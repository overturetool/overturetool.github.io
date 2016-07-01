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
            mk_VCParser`TREE("/", [e1, e2]) -> evalTree(e1) div evalTree(e2),
            mk_VCParser`TREE("+", [e1, e2]) -> evalTree(e1) + evalTree(e2),
            mk_VCParser`TREE("-", [e1, e2]) -> evalTree(e1) - evalTree(e2)
            end;
    
    hasDivZero : VCParser`TREE -> bool
    hasDivZero(tree) == cases tree:
        mk_VCParser`TREE("/", [-, mk_VCParser`TREE("int", "0")]) -> true,
        mk_VCParser`TREE("/", [-, mk_VCParser`TREE("int", "-0")]) -> true,
        mk_VCParser`TREE("int", -) -> false,
        mk_VCParser`TREE(-, [tree1, tree2]) -> hasDivZero(tree1) or hasDivZero(tree2)
        end;

    eval : seq of char -> [int]
    eval(string) ==
        cases parseExpression(string):
            mk_VCParser`PARSED(tree, []) -> if hasDivZero(tree) then nil else evalTree(tree),
            others -> nil
            end;

end MMParser
~~~
{% endraw %}

### MMParserTest.vdmsl

{% raw %}
~~~
module MMParserTest
/***
Combinatorial Testing Module for MMParser.
requires vdm10 turned on.
***/
imports
    from MMParser functions eval renamed eval;
exports all
definitions
traces
integer:
    let s in set {"", "-"} in
        let d1 in set {"1", "2", "3", "4", "5", "6", "7", "8", "9"} in
            let d2 in set {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"} in
                eval(s^d1^d2);

two_terms:
    let s1, s2 in set {"", "-"} in
        let n1, n2 in set {"39", "441", "0"} in
            let op1 in set {"*", "/", "+", "-"} in
                eval(s1 ^ n1 ^ op1 ^ s2 ^ n2);

three_terms:
    let s1, s2, s3 in set {"", "-"} in
        let n1, n2, n3 in set {"39", "441", "0"} in
            let op1, op2 in set {"*", "/", "+", "-"} in
                eval(s1 ^ n1 ^ op1 ^ s2 ^ n2 ^ op2 ^ s3 ^ n3);

four_terms:
    let i1, i2, i3, i4 in set {"-39", "441", "0"} in
        let op1, op2, op3 in set {"*", "/", "+", "-"} in
            eval(i1 ^ op1 ^ i2 ^ op2 ^ i3 ^ op3 ^ i4);

end MMParserTest
~~~
{% endraw %}

### VCParser.vdmsl

{% raw %}
~~~
module VCParser
/***
VCParser
Author: Tomohiro Oda and Paul Chisholm
Version: 0.01
License: the MIT License

Copyright (c) 2013 Tomohiro Oda, Paul Chisholm
                   and Software Research Associates, Inc.

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
     -- The source to be parsed - a sequence of characters.
     SOURCE = seq of char;
     
     -- Error meesage resulting from failed parsing.
     ERROR :: message : seq of char;

     -- Parse tree label (optional).
     LABEL = [seq of char];
     
     -- Parse tree: a label and a sequence of subtree/character items.
     TREE :: label : LABEL
             contents : seq of (TREE | char);
     
     -- A parse result: the parse tree or error message, plus input text that was not processed.
     PARSED :: parsed : TREE | ERROR
               remaining : SOURCE;

     -- The type of parsing functions.
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

     -- Recognise any character.
     any =
        lambda source : SOURCE &
            cases source:
                [] -> mk_PARSED(mk_ERROR(UNEXPECTED_EOF), source),
                others -> mk_PARSED(mk_TREE(nil, [hd source]), tl source)
                end;

     -- Recognise a single white space character.
     whiteChar =
        label(
            "whiteChar",
            either([takeChar(" \t\r\n"(index)) | index in set {1, ..., 4}]));

     -- Recognise a (possibly empty) sequence of white space characters.
     whiteString = star(whiteChar);

     -- Recognise a non-empty sequence of white space characters.
     whiteString1 = plus(whiteChar);

     -- Recognise and discard a (possibly empty) sequence of white space characters.
     passWhiteString = pass(whiteString);

     -- Recognise and discard a non-empty sequence of white space characters.
     passWhiteString1 = pass(whiteString1);

     -- Recognise a decimal digit.
     digit =
        label(
            "digit",
            either([takeChar("0123456789"(index)) | index in set {1, ..., 10}]));

     -- Recognise a lower case roman alphabetic character.
     lowerAlphabet =
        label(
            "lowerAlphabet",
            either(
                [takeChar("abcdefghijklmnopqrstuvwxyz"(index))
                    | index in set {1, ..., 26}]));

     -- Recognise an upper case roman alphabetic character.
     upperAlphabet =
        label(
            "upperAlphabet",
            either(
                [takeChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ"(index))
                    | index in set {1, ..., 26}]));

     -- Recognise a roman alphabetic character.
     alphabet =
        label("alphabet", either([lowerAlphabet, upperAlphabet]));

     -- Recognise a natural number (leading zeroes not allowed).
     natnum =
        label(
            "nat",
            either(
                [takeChar('0'),
                concat(series([fail(takeChar('0')), concat(plus(digit))]))]));

     -- Recognise an integer.
     integer =
        label("int", concat(series([option(takeChar('-')), natnum])));

functions
    /***
    parser generators
    ***/

    -- Recognise a specified character.
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

    -- Recognise and discard a specified character.
    passChar : char -> PARSER
    passChar(c) == pass(takeChar(c));

    -- Recognise one of a sequence of specified characters.
    takeOneOfChar : seq1 of char -> PARSER
    takeOneOfChar(chars) ==
        either([ takeChar(chars(i)) | i in set inds chars]);

    -- Recognise a specified string.
    takeString : seq1 of char -> PARSER
    takeString(string) ==
        concat(
            series([takeChar(string(index)) | index in set inds string]));

    -- Recognise and discard a specified string.
    passString : seq of char -> PARSER
    passString(s) == pass(takeString(s));

    -- Recognise one of a sequence of specified strings.
    takeOneOfString : seq1 of seq1 of char -> PARSER
    takeOneOfString(strings) ==
        either([ takeString(strings(i)) | i in set inds strings]);

    /***
    parser combinators
    ***/

    -- Recognise, in order, a sequence of parsers.
    --   VCParser:  series([nonterm1,nonterm2,...,nontermn])
    --   ISO 14977: nonterm1 , nonterm2 , ... , nontermn
    series : seq1 of PARSER -> PARSER
    series(parsers) ==
        lambda source : SOURCE &
            (let mk_PARSED(tree1, source1) = (hd parsers)(source)
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
                        end);

    -- Recognise one of a sequence of parsers.
    --   VCParser:  either([nonterm1,nonterm2,...,nontermn])
    --   ISO 14977: nonterm1 | nonterm2 | ... | nontermn
    either : seq1 of PARSER -> PARSER
    either(parsers) ==
        lambda source : SOURCE &
            (let mk_PARSED(tree1, source1) = (hd parsers)(source)
                in
                    cases mk_(tree1, tl parsers):
                        mk_(mk_ERROR(-), []) -> mk_PARSED(tree1, source1),
                        mk_(mk_ERROR(-), -) -> either(tl parsers)(source),
                        mk_(-, -) -> mk_PARSED(tree1, source1)
                        end);

    -- Recognise a parser zero or more times.
    --   VCParser:  star(nonterm)
    --   ISO 14977: { nonterm }
    star : PARSER -> PARSER
    star(parser) ==
        lambda source : SOURCE &
            cases parser(source):
                mk_PARSED(mk_ERROR(-), -) -> mk_PARSED(mk_TREE(nil, []), source),
                mk_PARSED(tree, rest) ->
                    if
                        rest = source
                    then
                        mk_PARSED(tree, rest)
                    else
                        (let mk_PARSED(mk_TREE(-, trees), source2) = star(parser)(rest)
                            in mk_PARSED(mk_TREE(nil, [tree] ^ trees), source2))
                end;

    -- Recognise a parser one or more times.
    --   VCParser:  plus(nonterm)
    --   ISO 14977: nonterm , { nonterm }
    plus : PARSER -> PARSER
    plus(parser) ==
        lambda source : SOURCE &
            cases parser(source):
                mk_PARSED(mk_ERROR(e), -) -> mk_PARSED(mk_ERROR(e), source),
                mk_PARSED(tree, rest) ->
                    let mk_PARSED(mk_TREE(-, trees), source2) = star(parser)(rest)
                    in mk_PARSED(mk_TREE(nil, [tree] ^ trees), source2)
                end;

    -- Recognise a parser a specified number of times based on lower and upper bounds.
    -- If lower bound omitted, 0 is assumed.
    -- If upper bound is omitted, there is no limit.
    iterate : PARSER * [nat] * [nat1] -> PARSER
    iterate(parser, m, n) ==
        let lower = if m = nil then 0 else m
        in
            series(
                [parser | i in set {1, ..., lower}]
                ^ (if
                        n = nil
                    then
                        [star(parser)]
                    else
                        [option(parser) | i in set {lower + 1, ..., n}]))
    pre m <> nil and n <> nil => m <= n;

    -- Recognise a parser one or more times interleaved by a specified separator.
    --   VCParser:  iterateWithSeparator(nonterm1,nonterm2)
    --   ISO 14977: nonterm1 , { nonterm2 , nonterm1 }
    iterateWithSeparator : PARSER * PARSER -> PARSER
    iterateWithSeparator(parser, separator) ==
        let next_item = series([pass(separator), parser])
        in series([parser, star(next_item)]);

    -- Recognise a parser an exact number of times.
    --   VCParser:  iterateFixedTimes(nonterm,n)
    --   ISO 14977: n * nonterm
    iterateFixedTimes : PARSER * nat1 -> PARSER
    iterateFixedTimes(parser, n) == iterate(parser, n, n);

    -- Recognise a parser up to a specified number of times (lower bound is 0).
    --   VCParser:  iterateAtMost(nonterm,n)
    --   ISO 14977: n * [ nonterm ]
    iterateAtMost : PARSER * nat1 -> PARSER
    iterateAtMost(parser, n) == iterate(parser, nil, n);

    -- Recognise a parser at least a specified number of times (no upper limit).
    --   VCParser:  iterateAtLeast(nonterm,n)
    --   ISO 14977: n * nonterm , { nonterm }
    iterateAtLeast : PARSER * nat -> PARSER
    iterateAtLeast(parser, n) == iterate(parser, n, nil);

    -- Optionally recognise a parser.
    --   VCParser:  option(nonterm)
    --   ISO 14977: [ nonterm ]
    option : PARSER -> PARSER
    option(parser) ==
        lambda source : SOURCE &
            cases parser(source):
                mk_PARSED(mk_ERROR(-), -) -> mk_PARSED(mk_TREE(nil, []), source),
                success -> success
                end;

    -- Recognise a parser, skipping preceding and succeeding blanks.
    trimBlanks : PARSER -> PARSER
    trimBlanks(parser) ==
        concat(series([passWhiteString, parser, passWhiteString]));

    -- Fail to recognise a parser.
    -- If the parser succeeds, an error message is returned.
    -- If the parser fails, success is returned and no input is consumed.
    fail : PARSER -> PARSER
    fail(parser) ==
        lambda source : SOURCE &
            (let mk_PARSED(tree1, source1) = parser(source)
                in
                    cases tree1:
                        mk_ERROR(-) -> mk_PARSED(mk_TREE(nil, []), source),
                        mk_TREE(-, -) ->
                            mk_PARSED(
                                mk_ERROR(
                                    UNEXPECTED
                                    ^ [source(index) | index in set {1, ..., len source - len source1}]),
                                source)
                        end);

    -- Recognise a parser then concatenate all the items of any subtrees and lift into the top level tree.
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
                                        | index in set inds contents & is_(contents(index), TREE)]),
                                rest)
                    end)
        comp parser;

    -- Recognise a parser and discard the resulting parse tree.
    pass : PARSER -> PARSER
    pass(parser) ==
        lambda source : SOURCE &
            cases parser(source):
                mk_PARSED(mk_TREE(l, -), rest) -> mk_PARSED(mk_TREE(l, []), rest),
                err -> err
                end;

    -- Recognise a parser and assign a label to the resulting parse tree.
    label : LABEL * PARSER -> PARSER
    label(newLabel, parser) ==
        (lambda parsed : PARSED &
                cases parsed:
                    mk_PARSED(mk_TREE(-, contents), source) ->
                        mk_PARSED(mk_TREE(newLabel, contents), source),
                    others -> parsed
                    end)
        comp parser;

    -- Recognise a parser and, if successful, transform the parse result.
    trans : (PARSED -> PARSED) * PARSER -> PARSER
    trans(modifier, parser) == modifier comp parser;

    -- Recognise a parser and, if successful, transform the parse tree.
    transtree : (TREE -> TREE) * PARSER -> PARSER
    transtree(modifier, parser) ==
        trans(
            lambda parsed : PARSED &
                cases parsed:
                    mk_PARSED(mk_ERROR(-), -) -> parsed,
                    mk_PARSED(tree, rest) -> mk_PARSED(modifier(tree), rest)
                    end,
            parser);

    -- Recognise a parser; if it fails, set the error message.
    iferror : seq of char * PARSER -> PARSER
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

### VCParserSupp.vdmsl

{% raw %}
~~~
module VCParserSupp
/***
VCParserSupp
Author: Tomohiro Oda and Paul Chisholm
Version: 0.01
License: the MIT License

Copyright (c) 2016 Tomohiro Oda, Paul Chisholm
                   and Software Research Associates, Inc.

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

****************************************************************************

This module supplements the VCParser module with additional convenience functions.

Note this module depends on modules Char, Numeric and Seq that are in the ISO8601 example located at

    http://overturetool.org/download/examples/VDMSL/

***/
imports from VCParser types PARSER renamed PARSER
                            SOURCE renamed SOURCE
                            PARSED renamed PARSED
                            TREE   renamed TREE
                            ERROR  renamed ERROR
                            LABEL  renamed LABEL
                      functions label renamed label
                                either renamed either
                                concat renamed concat
                                iterate renamed iterate
                                digit renamed digit
                                lowerAlphabet renamed lowerAlphabet
                                upperAlphabet renamed upperAlphabet
                                alphabet renamed alphabet
                                takeChar renamed takeChar,
        from Seq all,
        from Numeric all,
        from Char all
exports values lowerAlphanum, upperAlphanum, alphanum, octal, hex: PARSER
        functions takeNumeric      : [nat1] * [nat1] -> PARSER
                  takeFixedNumeric : nat1 -> PARSER
                  takeBoundedString: seq1 of char * PARSER * nat * nat -> PARSER
                  takeUpto         : seq1 of char * [PARSER] +> PARSER
                  takeUptoOneOf    : seq of seq1 of char * [seq1 of char] * [PARSER] +> PARSER
                  getContent       : LABEL * TREE +> seq of char
                  getContentNat    : LABEL * TREE +> nat
                  getTrees         : LABEL * TREE +> seq of TREE
                  getTree          : LABEL * TREE +> TREE
                  isEmpty          : TREE +> bool
                  prune            : PARSED -> PARSED
                  pruneTree        : TREE -> TREE
                  format           : PARSED -> seq of char
                  formatTree       : TREE * nat -> seq of char

definitions

values

     TABSIZE = 2;

     -- Recognise a lower case alphanumeric character.
     lowerAlphanum =
        label("lowerAlphanum", either([lowerAlphabet, digit]));

     -- Recognise an upper case alphanumeric character.
     upperAlphanum =
        label("upperAlphanum", either([upperAlphabet, digit]));

     -- Recognise an alphanumeric character.
     alphanum =
        label("alphabet", either([alphabet, digit]));

     -- Recognise an octal digit.
     octal =
        label(
            "octal",
            either([takeChar("01234567"(index)) | index in set {1, ..., 8}]));

     -- Recognise a hexadecimal digit.
     hex =
        label(
            "hex",
            either([takeChar("0123456789ABCDEFabcdef"(index)) | index in set {1, ..., 22}]));

functions

    -- Recognise a numeric value optionally specifying the minimum and maximum digits.
    takeNumeric: [nat1] * [nat1] -> PARSER
    takeNumeric(m, n) == let m1 = if m = nil then 1 else m
                         in concat(iterate(digit, m1, n))
    pre m <> nil and n <> nil => m <= n;

    -- Recognise a fixed length numeric value.
    takeFixedNumeric: nat1 -> PARSER
    takeFixedNumeric(n) == takeNumeric(n, n);

    -- Recognise a string optionally specifying a minimum and maximum length.
    -- While the parser argument can be arbitrary, the intent is it recognises a single character.
    takeBoundedString: seq1 of char * PARSER * nat * nat -> PARSER
    takeBoundedString(lbl, parser, min, max) == label(lbl, concat(iterate(parser, min, max)))
    pre min <= max;

    -- Recognise characters in the source till a specified token is reached.
    -- If an optional parser is specified, use it to parse the recognised string.
    takeUpto: seq1 of char * [PARSER] +> PARSER
    takeUpto(word, parser) ==
        lambda source : SOURCE &
            cases Seq`indexOfSeqOpt[char](word, source):
                nil   -> mk_PARSED(mk_ERROR(word ^ " not found"), source),
                index -> let recognised = [ source(i) | i in set {1,...,index-1} ],
                             remainder = [ source(i) | i in set {index,...,len source} ] in
                             if parser = nil
                                 then mk_PARSED(mk_TREE(nil, recognised), remainder)
                                 else let mk_PARSED(tree, rest) = parser(recognised) in
                                          cases tree:
                                              mk_ERROR(-)  -> mk_PARSED(mk_ERROR("unrecognised"), source),
                                              mk_TREE(-,-) -> if Char`isWhiteSpaces(rest)
                                                                  then mk_PARSED(tree, remainder)
                                                                  else mk_PARSED(mk_ERROR("excess"), rest^remainder)
                                              end
                end;

    -- Recognise characters in the source till one of a specified sequence of tokens is reached.
    -- If no such token is found, and an optional terminator is provided, recognise characters up to the terminator.
    -- If a sequence is recognised and an optional parser is specified, use it to parse the recognised string.
    takeUptoOneOf: seq of seq1 of char * [seq1 of char] * [PARSER] +> PARSER
    takeUptoOneOf(tokens, term, parser) ==
        lambda source : SOURCE &
            cases tokens:
                []         -> if term = nil
                              then mk_PARSED(mk_ERROR("not found"), source)
                              else takeUpto(term, parser)(source),
                [tok]^rest -> let mk_PARSED(tree, source1) = takeUpto(tok, parser)(source) in
                                  cases tree:
                                      mk_ERROR(-)  -> takeUptoOneOf(rest, term, parser)(source),
                                      mk_TREE(-,-) -> mk_PARSED(tree, source1)
                                      end
                end;

    /*
       Convenience functions for extracting items from a parse tree.
    */

    -- Get the character content.
    getContent: LABEL * TREE +> seq of char
    getContent(lbl, mk_TREE(tlabel,content)) == content
    pre (lbl = nil or lbl = tlabel) and is_(content, seq of char);

    -- Get the character content as a natural number.
    getContentNat: LABEL * TREE +> nat
    getContentNat(lbl, tree) == Numeric`decodeNat(getContent(lbl,tree))
    pre pre_getContent(lbl, tree) and Char`isDigits(tree.contents);

    -- Get the sequence of sub trees.
    getTrees: LABEL * TREE +> seq of TREE
    getTrees(lbl, mk_TREE(tlabel,content)) == content
    pre (lbl = nil or lbl = tlabel) and is_(content, seq of TREE);

    -- Get the only sub tree.
    getTree: LABEL * TREE +> TREE
    getTree(lbl, tree) == tree.contents(1)
    pre pre_getTrees(lbl, tree) and len tree.contents = 1;

    -- Is a tree empty (has not label or content)?
    isEmpty : TREE +> bool
    isEmpty(mk_TREE(tlabel,content)) == tlabel = nil and content = [];

    /*
       Convenience functions for flattening out parse trees:
       - remove empty sub trees;
       - lift sub components up where a nil label is encountered.
    */

    -- Filter out empty subtrees from a parse result.
    prune : PARSED -> PARSED
    prune(mk_PARSED(parsed, remaining)) ==
        if
            is_ERROR(parsed)
        then
            mk_PARSED(parsed, remaining)
        else
            mk_PARSED(pruneTree(liftTree(parsed)), remaining);

    -- Filter out empty subtrees from a tree.
    pruneTree : TREE -> TREE
    pruneTree(mk_TREE(lbl, contents)) ==
        if
            is_(contents, seq of char)
        then
            mk_TREE(lbl, contents)
        else
            mk_TREE(lbl, pruneTrees(contents));

    -- Prune a sequence of trees.
    pruneTrees : seq of TREE -> seq of TREE
    pruneTrees(trees) == [ pruneTree(trees(i)) | i in set inds trees & not isEmpty(pruneTree(trees(i))) ];
    
    -- Lift subtrees with a nil label up a level.
    liftTree : TREE -> TREE
    liftTree(mk_TREE(lbl,contents)) ==
        if is_(contents, seq of char)
            then mk_TREE(lbl,contents)
        else let lifted = liftTrees(contents)
             in if lbl = nil and len lifted = 1
                then lifted(1)
                else mk_TREE(lbl,lifted);

    -- Lift a sequence of subtrees.
    liftTrees : seq of TREE -> seq of TREE
    liftTrees(trees) == conc [ liftTreeSeq(trees(i)) | i in set inds trees ];

    -- Auxiliary function for lifting subtrees.
    -- Produces a sequence of trees in case the top level tree has a nil label.
    liftTreeSeq : TREE -> seq of TREE
    liftTreeSeq(mk_TREE(lbl,contents)) ==
        if is_(contents, seq of char)
        then [mk_TREE(lbl,contents)]
        else let lifted = liftTrees(contents)
             in if lbl = nil
                then lifted
                else [mk_TREE(lbl,lifted)];

    /*
       Convenience functions for creating a pretty printed text version of a parse tree.
    */

    -- Format a parse result as text.
    format : PARSED -> seq of char
    format(mk_PARSED(parsed, remaining)) ==
        formatTreeOrError(parsed) ^ "Remaining: [" ^ remaining ^ "]";

    -- Format a parse tree or parse error as text.
    formatTreeOrError : TREE| ERROR -> seq of char
    formatTreeOrError(treeOrError) ==
        if
            is_ERROR(treeOrError)
        then
            "Error: " ^ treeOrError.message ^ "\n"
        else
            "Parse Tree:\n" ^ formatTree(treeOrError, TABSIZE);

    -- Format a parse tree as text.
    formatTree : TREE * nat -> seq of char
    formatTree(mk_TREE(lbl, contents), n) ==
        let lblstr = if lbl = nil then "" else lbl
        in indent(n) ^ "'" ^ lblstr ^ "'\n" ^ formatContent(contents, n + TABSIZE);

    -- Format as text the parse tree content (text or sequence of subtrees).
    formatContent : (seq of TREE | seq of char) * nat -> seq of char
    formatContent(tt, n) ==
        if
            is_(tt, seq of char)
        then
            indent(n) ^ "[" ^ tt ^ "]\n"
        else
            conc [formatTree(tt(i), n) | i in set inds tt];

    -- Create a sequence of spaces.
    indent : nat +> seq of char
    indent(n) == [' ' | i in set {1, ..., n}];

end VCParserSupp
~~~
{% endraw %}

### VCParserTest.vdmsl

{% raw %}
~~~
module VCParserTest
imports from VCParser
    types
        ERROR renamed ERROR;
        PARSED renamed PARSED;
        TREE renamed TREE;
    functions
        takeChar renamed takeChar;
        takeString renamed takeString;
        series renamed series;
        either renamed either;
        star renamed star;
        plus renamed plus;
        option renamed option;
        trimBlanks renamed trimBlanks;
        fail renamed fail;
        concat renamed concat;
        pass renamed pass;
        label renamed label;
        trans renamed trans;
        transtree renamed transtree;
        iferror renamed iferror;
    values
        any renamed any;
        digit renamed digit;
        natnum renamed natnum;
        integer renamed integer;
exports all
definitions
values
    a = takeChar('a');
    b = takeChar('b');
    c = takeChar('c');
functions
    id : PARSED -> PARSED
    id(parsed) == parsed;
operations
    test : PARSED * (PARSED->bool) ==> ()
    test(parsed, result) == skip
    pre result(parsed);

    /* any */
    test_any : () ==> ()
    test_any() == (
        test(any("a"), lambda p:PARSED & p.parsed.contents = "a");
        test(any("1"), lambda p:PARSED & p.parsed.contents = "1");
        test(any(""), lambda p:PARSED & is_ERROR(p.parsed)));

    /* digit */
    test_digit : () ==> ()
    test_digit() == (
        test(digit("a"), lambda p:PARSED & is_ERROR(p.parsed));
        test(digit("1"), lambda p:PARSED & p.parsed.contents = "1");
        test(digit(""), lambda p:PARSED & is_ERROR(p.parsed)));

    /* natnum */
    test_natnum : () ==> ()
    test_natnum() == (
        test(natnum("0"), lambda p:PARSED & p.parsed.contents = "0");
        test(natnum("123"), lambda p:PARSED & p.parsed.contents = "123");
        test(natnum("123.45"), lambda p:PARSED & p.parsed.contents = "123");
        test(natnum("-1"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* integer */
    test_integer : () ==> ()
    test_integer() == (
        test(integer("0"), lambda p:PARSED & p.parsed.contents = "0");
        test(integer("123"), lambda p:PARSED & p.parsed.contents = "123");
        test(integer("-123"), lambda p:PARSED & p.parsed.contents = "-123");
        test(integer("123.45"), lambda p:PARSED & p.parsed.contents = "123");
        test(integer("-x"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* takeChar */
    test_takeChar : () ==> ()
    test_takeChar() == (
        test(takeChar('a')("abc"), lambda p:PARSED & p.parsed.contents = "a");
        test(takeChar('a')("bca"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* takeString */
    test_takeString : () ==> ()
    test_takeString() == (
        test(takeString("abc")("abcd"), lambda p:PARSED & p.parsed.contents = "abc");
        test(takeString("abc")("abx"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* star */
    test_star : () ==> ()
    test_star() == (
        test(star(a)("aabc"), lambda p:PARSED & len p.parsed.contents = 2);
        test(star(a)("abc"), lambda p:PARSED & len p.parsed.contents = 1);
        test(star(a)("bc"), lambda p:PARSED & len p.parsed.contents = 0));

    /* plus */
    test_plus : () ==> ()
    test_plus() == (
        test(plus(a)("aabc"), lambda p:PARSED & len p.parsed.contents = 2);
        test(plus(a)("abc"), lambda p:PARSED & len p.parsed.contents = 1);
        test(plus(a)("bc"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* option */
    test_option : () ==> ()
    test_option() == (
        test(option(a)("aabc"), lambda p:PARSED & p.parsed.contents = "a");
        test(option(a)("aabc"), lambda p:PARSED & p.remaining = "abc");
        test(option(a)("abc"), lambda p:PARSED & p.parsed.contents = "a");
        test(option(a)("abc"), lambda p:PARSED & p.remaining = "bc");
        test(option(a)("bc"), lambda p:PARSED & p.parsed.contents = "");
        test(option(a)("bc"), lambda p:PARSED & p.remaining = "bc");
    );

    /* concat */
    test_concat : () ==> ()
    test_concat() == (
        test(concat(plus(a))("aaabc"), lambda p:PARSED & p.parsed.contents = "aaa");
        test(concat(plus(a))("bc"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* trimBlanks */
    test_trimBlanks : () ==> ()
    test_trimBlanks() == (
        test(trimBlanks(a)(" a bc"), lambda p:PARSED & p.parsed.contents = "a");
        test(trimBlanks(a)(" a bc"), lambda p:PARSED & p.remaining = "bc");
        test(trimBlanks(a)("a bc"), lambda p:PARSED & p.parsed.contents = "a");
        test(trimBlanks(a)("a bc"), lambda p:PARSED & p.remaining = "bc");
        test(trimBlanks(a)(" abc"), lambda p:PARSED & p.parsed.contents = "a");
        test(trimBlanks(a)(" abc"), lambda p:PARSED & p.remaining = "bc");
        test(trimBlanks(a)("bc"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* fail */
    test_fail : () ==> ()
    test_fail() == (
        test(fail(a)("abc"), lambda p:PARSED & is_ERROR(p.parsed));
        test(fail(a)("bc"), lambda p:PARSED & p.parsed.contents = "");
        test(fail(a)("bc"), lambda p:PARSED & p.remaining = "bc"));

    /* pass */
    test_pass : () ==> ()
    test_pass() == (
        test(pass(a)("abc"), lambda p:PARSED & p.parsed.contents = "");
        test(pass(a)("abc"), lambda p:PARSED & p.remaining = "bc");
        test(pass(a)("bc"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* label */
    test_label : () ==> ()
    test_label() == (
        test(label("A", a)("abc"), lambda p:PARSED & p.parsed.nodelabel = "A");
        test(label("A", a)("abc"), lambda p:PARSED & p.parsed.contents = "a");
        test(label("A", a)("abc"), lambda p:PARSED & p.remaining = "bc");
        test(label("A", a)("bc"), lambda p:PARSED & is_ERROR(p.parsed)));
        
    /* trans */
    test_trans : () ==> ()
    test_trans() == (
        let parsed = mk_PARSED(mk_TREE(nil, []), []) in (
            test(trans(lambda -:PARSED&parsed, a)("abc"), lambda p:PARSED & p = parsed);
            test(trans(lambda -:PARSED&parsed, a)("bc"), lambda p:PARSED & p = parsed)));

    /* transtree */
    test_transtree : () ==> ()
    test_transtree() == (
        let tree = mk_TREE(nil, []) in (
            test(transtree(lambda -:TREE&tree, a)("abc"), lambda p:PARSED & p.parsed = tree);
            test(transtree(lambda -:TREE&tree, a)("bc"), lambda p:PARSED & is_ERROR(p.parsed))));

    /* iferror */
    test_iferror : () ==> ()
    test_iferror() == (
        test(iferror("A", a)("abc"), lambda p:PARSED & p.parsed.contents = "a");
        test(iferror("A", a)("bc"), lambda p:PARSED & is_ERROR(p.parsed));
        test(iferror("A", a)("bc"), lambda p:PARSED & p.parsed.message = "A"));

    /* series */
    test_series : () ==> ()
    test_series() == (
        test(series([a, b])("abc"), lambda p:PARSED & len p.parsed.contents = 2);
        test(series([a, b])("bca"), lambda p:PARSED & is_ERROR(p.parsed)));

    /* either */
    test_either : () ==> ()
    test_either() == (
        test(either([a, b])("abc"), lambda p:PARSED & p.parsed.contents = "a");
        test(either([a, b])("bca"), lambda p:PARSED & p.parsed.contents = "b");
        test(either([a, b])("cab"), lambda p:PARSED & is_ERROR(p.parsed)));

traces

unit:
    test_any();
    test_digit();
    test_natnum();
    test_integer();
    test_takeChar();
    test_takeString();
    test_star();
    test_plus();
    test_option();
    test_concat();
    test_trimBlanks();
    test_fail();
    test_pass();
    test_trans();
    test_transtree();
    test_iferror();
    test_series();
    test_either();

combinators:
    let c1, c2 in set {star, plus, option, trimBlanks, fail, pass} in
        id(c1(c2(a))("abc"));
    let n1, n2 in set {series, either} in
        id(n1([n2([a, b]), c])("abc"));
    let c1, c2 in set {star, plus, option, trimBlanks, fail, pass} in
        let n1 in set {series, either} in
            id(c1(n1([c2(a), b]))("abc"));
end VCParserTest
~~~
{% endraw %}

