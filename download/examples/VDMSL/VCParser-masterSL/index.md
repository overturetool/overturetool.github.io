---
layout: default
title: VCParser-masterSL
---

## VCParser-masterSL
Author: Tomohiro Oda



This example is created by Tomohiro Oda and it illustrates
how it is possible to use higher-order functions in VDM-SL
to create parser elements that can be put together in a 
compositional fashion. This model can be used as a kind of
library that one can play with manipulating strings into a 
VDM AST representation.



| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| MMParser`eval("1+1+4+0")|


### VCParser.vdmsl

{% raw %}
~~~
module VCParser
/***
VCParser
Author: Tomohiro Oda
Version: 0.01
License: the MIT License

Copyright (c) 2013 Tomohiro Oda and Software Research Associates, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
***/
exports all
definitions
types
     SOURCE = seq of char;
     ERROR :: message : seq of char;
     LABEL = [seq of char];
     TREE :: label : LABEL contents : seq of TREE| seq of char;
     PARSED :: parsed : TREE| ERROR remaining : SOURCE;
     PARSER = SOURCE -> PARSED;

values
    /***
    messages
    ***/
     UNEXPECTED_EOF = "Unexpected EOF";
     UNEXPECTED = "Unexpected ";
     EXPECTED = "Expected ";
    /***
    parsers
    ***/
     any =
        lambda source : SOURCE &
            cases source:
                [] -> mk_PARSED(mk_ERROR(UNEXPECTED_EOF), source),
                others -> mk_PARSED(mk_TREE(nil, [hd source]), tl source)
                end;
     digit =
        label(
            "digit",
            either([takeChar("0123456789"(index)) | index in set {1, ..., 10}]));
     lowerAlphabet =
        label(
            "lowerAlphabet",
            either(
                [takeChar("abcdefghijklmnopqrstuvwxyz"(index))
                    | index in set {1, ..., 26}]));
     upperAlphabet =
        label(
            "upperAlphabet",
            either(
                [takeChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ"(index))
                    | index in set {1, ..., 26}]));
     alphabet = label("alphabet", either([lowerAlphabet, upperAlphabet]));
     natnum =
        label(
            "nat",
            concat(
                series(
                    [concat(series([pass(fail(takeChar('0'))), digit])),
                    concat(star(digit))])));
     integer = label("int", concat(series([option(takeChar('-')), natnum])));

functions
    /***
    parser generators
    ***/
    takeChar : char -> PARSER
    takeChar(c) ==
        lambda source : SOURCE &
            cases source:
                [] -> mk_PARSED(mk_ERROR(UNEXPECTED_EOF), source),
                others ->
                    if
                        hd source = c
                    then
                        mk_PARSED(mk_TREE(nil, [c]), tl source)
                    else
                        mk_PARSED(mk_ERROR(EXPECTED ^ "'" ^ [c] ^ "'"), source)
                end;
    /***
    parser combinators
    ***/
    
    takeString : seq1 of char -> PARSER
    takeString(string) ==
        concat(series([takeChar(string(index)) | index in set inds string]));
    
    series : seq1 of PARSER -> PARSER
    series(parsers) ==
        lambda source : SOURCE &
            let mk_PARSED(tree1, source1) = (hd parsers)(source)
            in
                cases mk_(tree1, tl parsers):
                    mk_(mk_ERROR(-), -) -> mk_PARSED(tree1, source1),
                    mk_(-, []) -> mk_PARSED(mk_TREE(nil, [tree1]), source1),
                    mk_(-, rest) ->
                        let mk_PARSED(tree2, source2) = series(rest)(source1)
                        in
                            cases tree2:
                                mk_TREE(-, trees2) ->
                                    mk_PARSED(mk_TREE(nil, [tree1] ^ trees2), source2),
                                mk_ERROR(-) -> mk_PARSED(tree2, source2)
                                end
                    end;
    
    either : seq1 of PARSER -> PARSER
    either(parsers) ==
        lambda source : SOURCE &
            let mk_PARSED(tree1, source1) = (hd parsers)(source)
            in
                cases mk_(tree1, tl parsers):
                    mk_(mk_ERROR(-), []) -> mk_PARSED(tree1, source1),
                    mk_(mk_ERROR(-), -) -> either(tl parsers)(source),
                    mk_(-, -) -> mk_PARSED(tree1, source1)
                    end;
    
    star : PARSER -> PARSER
    star(parser) ==
        lambda source : SOURCE &
            cases parser(source):
                mk_PARSED(mk_ERROR(-), -) -> mk_PARSED(mk_TREE(nil, []), source),
                mk_PARSED(tree, rest) ->
                    let mk_PARSED(mk_TREE(-, trees), source2) = star(parser)(rest)
                    in mk_PARSED(mk_TREE(nil, [tree] ^ trees), source2)
                end;
    
    option : PARSER -> PARSER
    option(parser) ==
        lambda source : SOURCE &
            cases parser(source):
                mk_PARSED(mk_ERROR(-), -) -> mk_PARSED(mk_TREE(nil, []), source),
                success -> success
                end;
    
    trimBlanks : PARSER -> PARSER
    trimBlanks(parser) ==
        (lambda parsed : PARSED &
            cases parsed:
                mk_PARSED(mk_ERROR(-), -) -> parsed,
                mk_PARSED(mk_TREE(-, contents), rest) -> mk_PARSED(contents(2), rest)
                end)
        comp (series(
                [star(either([takeChar(' '), takeChar('\t')])), parser,
                star(either([takeChar(' '), takeChar('\t')]))]));
    
    fail : PARSER -> PARSER
    fail(parser) ==
        lambda source : SOURCE &
            let mk_PARSED(tree1, source1) = parser(source)
            in
                cases tree1:
                    mk_ERROR(-) -> mk_PARSED(mk_TREE(nil, []), source),
                    mk_TREE(-, -) ->
                        mk_PARSED(
                            mk_ERROR(
                                UNEXPECTED
                                ^ [source(index) | index in set {1, ..., len source - len source1}]),
                            source)
                    end;
    
    concat : PARSER -> PARSER
    concat(parser) ==
        (lambda p : PARSED &
            cases p:
                mk_PARSED(mk_ERROR(-), -) -> p,
                mk_PARSED(mk_TREE(-, contents), rest) ->
                    if contents = []
                        then mk_PARSED(mk_TREE(nil, contents), rest)
                    elseif is_(contents, seq of char)
                        then mk_PARSED(mk_TREE(nil, contents), rest)
                    else
                        mk_PARSED(
                            mk_TREE(
                                nil,
                                conc [let mk_TREE(-, subcontent) = contents(index) in subcontent
                                    | index in set inds contents]),
                            rest)
                end)
        comp parser;
    
    pass : PARSER -> PARSER
    pass(parser) ==
        lambda source : SOURCE &
            cases parser(source):
                mk_PARSED(mk_TREE(l, -), rest) -> mk_PARSED(mk_TREE(l, []), rest),
                err -> err
                end;
    
    label : LABEL* PARSER -> PARSER
    label(newLabel, parser) ==
        (lambda parsed : PARSED &
            cases parsed:
                mk_PARSED(mk_TREE(-, contents), source) ->
                    mk_PARSED(mk_TREE(newLabel, contents), source),
                others -> parsed
                end)
        comp parser;
    
    trans : (PARSED -> PARSED)* PARSER -> PARSER
    trans(modifier, parser) == modifier comp parser;
    
    transtree : (TREE -> TREE)* PARSER -> PARSER
    transtree(modifier, parser) ==
        trans(
            lambda parsed : PARSED &
                cases parsed:
                    mk_PARSED(mk_ERROR(-), -) -> parsed,
                    mk_PARSED(tree, rest) -> mk_PARSED(modifier(tree), rest)
                    end,
            parser);
    
    iferror : seq of char* PARSER -> PARSER
    iferror(message, parser) ==
        trans(
            lambda parsed : PARSED &
                cases parsed:
                    mk_PARSED(mk_ERROR(-), rest) -> mk_PARSED(mk_ERROR(message), rest),
                    mk_PARSED(mk_TREE(-, -), -) -> parsed
                    end,
            parser);

end VCParser
~~~
{% endraw %}

### MMParser.vdmsl

{% raw %}
~~~
module MMParser
/***
MMParser
Author: Tomohiro Oda
Version: 0.01
License: the MIT License

Copyright (c) 2013 Tomohiro Oda and Software Research Associates, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
***/
imports from VCParser all
exports functions eval : seq of char -> [int];
definitions
types
     TREE = VCParser`TREE;

values
     series = VCParser`series;
     either = VCParser`either;
     star = VCParser`star;
     trimBlanks = VCParser`trimBlanks;
     integer = VCParser`integer;
     takeChar = VCParser`takeChar;
     transtree = VCParser`transtree;
     parseInt = trimBlanks(integer);
     parseMul = series([takeChar('*'), parseInt]);
     parseDiv = series([takeChar('/'), parseInt]);
     parseTerm =
        transtree(
            liftOperator, series([parseInt, star(either([parseMul, parseDiv]))]));
     parseAdd = series([takeChar('+'), parseTerm]);
     parseSub = series([takeChar('-'), parseTerm]);
     parseExpression =
        transtree(
            liftOperator, series([parseTerm, star(either([parseAdd, parseSub]))]));

functions
    liftOperator : VCParser`TREE -> VCParser`TREE
    liftOperator(tree) ==
        let mk_VCParser`TREE(-, [left, right]) = tree
        in
            let mk_VCParser`TREE(-, rights) = right
            in
                cases rights:
                    [] -> left,
                    [mk_VCParser`TREE(-, [mk_VCParser`TREE(-, operator), operand])] ^ rest ->
                        liftOperator(
                            mk_VCParser`TREE(
                                nil,
                                [mk_VCParser`TREE(operator, [left, operand]),
                                mk_VCParser`TREE(nil, rest)]))
                    end;
    
    evalInt : seq of char -> int
    evalInt(string) ==
        cases string:
            "-" ^ rest -> evalInt(rest) * -1,
            [] -> 0,
            others ->
                evalInt([string(i) | i in set {1, ..., len string - 1}]) * 10
                + {'0' |-> 0, '1' |-> 1, '2' |-> 2, '3' |-> 3, '4' |-> 4, '5' |-> 5,
                '6' |-> 6, '7' |-> 7, '8' |-> 8, '9' |-> 9}(
                    string(len string))
            end
    measure lenChar;
    
    lenChar : seq of char -> nat
    lenChar(x) == len x;
    
    evalTree : TREE -> int
    evalTree(tree) ==
        cases tree:
            mk_VCParser`TREE("int", contents) -> evalInt(contents),
            mk_VCParser`TREE("*", [e1, e2]) -> evalTree(e1) * evalTree(e2),
            mk_VCParser`TREE("/", [e1, e2]) -> evalTree(e1) / evalTree(e2),
            mk_VCParser`TREE("+", [e1, e2]) -> evalTree(e1) + evalTree(e2),
            mk_VCParser`TREE("-", [e1, e2]) -> evalTree(e1) - evalTree(e2)
            end;
    
    eval : seq of char -> [int]
    eval(string) ==
        cases parseExpression(string):
            mk_VCParser`PARSED(tree, []) -> evalTree(tree),
            others -> nil
            end;

end MMParser
~~~
{% endraw %}

