---
layout: default
title: xmlSL
---

## xmlSL
Author: Tomohiro Oda


This example is a simple AST for XML and utilities to manipulate it.
This model is originally intended to construct SVG models
to specify GUIs for interactive systems.
 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| ViennaDOM`createElement("SVG")|


### ViennaDOM.vdmsl

{% raw %}
~~~
module ViennaDOM
exports 
	types
		Element; 
		struct TaggedElement; 
		EventType; Event; 
		struct MouseEvent; 
		struct ChangeEvent;
		String;
		Name;
		struct Point;
	operations
		setDocument : Element ==> Element;
	  document : () ==> Element;
    createElement : String ==> TaggedElement;
    getElements : (TaggedElement -> bool) ==> seq of Element;
    getElementById : String ==> [TaggedElement];
    getElementsByToken : token ==> seq of TaggedElement;
    getElement : nat ==> [TaggedElement];
  functions
    getAttribute : TaggedElement * String -> [String];
    hasAttribute : TaggedElement * String -> bool;
    getAttributeNames : TaggedElement -> set of Element;
    removeAttribute : TaggedElement * String -> TaggedElement;
    setAttribute : TaggedElement * String * (String| real| seq of Point) -> TaggedElement;
    setEventHandler : TaggedElement * EventType -> TaggedElement;
    addToken : TaggedElement * token -> TaggedElement;
    hasToken : TaggedElement * token -> bool;
	
definitions
types
     Element = TaggedElement| String;
     TaggedElement ::
        name : Name
        attributes : map Name to [String| real]
        eventHandlers : set of EventType
        contents : seq of Element
        tokens : set of token
        identifier_ : nat;
     EventType = <click>| <change>;
     Event = MouseEvent| ChangeEvent;
     MouseEvent :: type : EventType target : TaggedElement x : nat y : nat;
     ChangeEvent :: type : EventType target : TaggedElement value : String;
     String = seq of char;
     Name = seq1 of char
        inv [c]^str ==
            c not in set IllegalNameStartChar
            and elems str inter IllegalNameChar = {};
     Point :: x : int y : int;

values
	/* The following definitions are still too permissive. 
	   should also include \u2000-\u200b, \u200e-\u206f, \u2190-\ux2bff, \u2ff0-0x3000, \ud800-\uf8ff, \ufdd0-0ufdef, \ufffe-\uffff .
	   Users of this specification are strongly encouraged to avoid use of symbolic characters. 
	   Please use only letters meaningful in natural languages. */
     IllegalNameChar : set of char =
        elems "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !\"#$%&'()*+,-/;<=>?@[\\]^`{|}×÷\u037e";
     IllegalNameStartChar : set of char =
        IllegalNameChar
        union elems "-.·0123456789\u0300\u0301\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030a\u030b\u030c\u030d\u030e\u030f\u0310\u0311\u0312\u0313\u0314\u0315\u0316\u0317\u0318\u0319\u031a\u031b\u031c\u031d\u031e\u031f\u0320\u0321\u0322\u0323\u0324\u0325\u0326\u0327\u0328\u0329\u032a\u032b\u032c\u032d\u032e\u032f\u0330\u0331\u0332\u0333\u0334\u0335\u0336\u0337\u0338\u0339\u033a\u033b\u033c\u033d\u033e\u033f\u0340\u0341\u0342\u0343\u0344\u0345\u0346\u0347\u0348\u0349\u034a\u034b\u034c\u034d\u034e\u034f\u0350\u0351\u0352\u0353\u0354\u0355\u0356\u0357\u0358\u0359\u035a\u035b\u035c\u035d\u035e\u035f\u0360\u0361\u0362\u0363\u0364\u0365\u0366\u0367\u0368\u0369\u036a\u036b\u036c\u036d\u036e\u036f";

state DOM of
    current : Element
    nextIdentifier : nat
init s == s = mk_DOM("", 0)
end

operations
    setDocument : Element ==> Element
    setDocument(element) ==
        (current := element;
        return current);
    
    pure document : () ==> Element
    document() == return current;
    
    createElement : String ==> TaggedElement
    createElement(name) ==
        let identifier = nextIdentifier
        in
            (nextIdentifier := nextIdentifier + 1;
            return mk_TaggedElement(name, {|->}, {}, [], {}, identifier));
    
    pure getElements : (TaggedElement -> bool) ==> seq of Element
    getElements(condition) == return findAll_(current, condition);
    
    pure getElementById : String ==> [TaggedElement]
    getElementById(value) ==
        return find_(
                current,
                lambda element : TaggedElement &
                    getAttribute(element, "id") = value);
    
    pure getElementsByToken : token ==> seq of TaggedElement
    getElementsByToken(target) ==
        return findAll_(
                current,
                lambda element : TaggedElement & target in set element.tokens);
    
    pure getElement : nat ==> [TaggedElement]
    getElement(id) ==
        return find_(
                current, lambda element : TaggedElement & element.identifier_ = id);

functions
    getAttribute : TaggedElement * String -> [String]
    getAttribute(element, attribute) ==
        if
            attribute in set dom element.attributes
        then
            element.attributes(attribute)
        else
            nil;
    
    hasAttribute : TaggedElement * String -> bool
    hasAttribute(element, attribute) ==
        attribute in set dom element.attributes;
    
    getAttributeNames : TaggedElement -> set of Element
    getAttributeNames(element) == dom element.attributes;
    
    removeAttribute : TaggedElement * String -> TaggedElement
    removeAttribute(element, attribute) ==
        mu(element,attributes |-> {attribute} <-: element.attributes);
    
    setAttribute : TaggedElement * String * (String| real| seq of Point) -> TaggedElement
    setAttribute(element, attribute, value) ==
        mu(element,
            attributes
            |-> element.attributes
            ++ {attribute
            |-> if is_(value, seq of Point) then points2string(value) else value});
        
    setEventHandler : TaggedElement * EventType -> TaggedElement
    setEventHandler(element, event) ==
        mu(element,eventHandlers |-> element.eventHandlers union {event});
    
    addToken : TaggedElement * token -> TaggedElement
    addToken(element, t) ==
        mu(element,tokens |-> element.tokens union {t});
    
    hasToken : TaggedElement * token -> bool
    hasToken(element, t) == t in set element.tokens;

functions
/*
	 Utility functions for internal use
*/
    digit2string : nat -> String
    digit2string(n) == ["0123456789"(n + 1)];
    
    int2string : int -> String
    int2string(i) ==
        if i < 0
            then "-" ^ int2string(-i)
        elseif i <= 9
            then digit2string(i)
        else
            int2string(i div 10) ^ digit2string(i mod 10)
    measure m_int2string;
    
    m_int2string : int -> nat
    m_int2string(i) == if i < 0 then abs i + 1 else i;
    
    point2string : Point -> String
    point2string(p) == int2string(p.x) ^ "," ^ int2string(p.y);
    
    points2string : seq of Point -> String
    points2string(ps) ==
        cases ps:
            [] -> "",
            [p] -> point2string(p),
            others -> point2string(hd ps) ^ " " ^ points2string(tl ps)
            end
    measure m_points2string;

    m_points2string : seq of Point -> nat
    m_points2string(ps) == len ps;
    
    find_ : Element * (TaggedElement -> bool) -> [TaggedElement]
    find_(whole, condition) ==
        cases whole:
            mk_TaggedElement(
                -, -, -, contents, -, -) ->
                if condition(whole) then whole else findFirst_(contents, condition),
            others -> nil
            end;
    
    findAll_ : Element * (TaggedElement -> bool) -> seq of TaggedElement
    findAll_(whole, condition) ==
        cases whole:
            mk_TaggedElement(
                -, -, -, contents, -, -) ->
                (if condition(whole) then [whole] else [])
                ^ conc [findAll_(content, condition) | content in seq contents],
            others -> []
            end;
    
    findFirst_ : seq of Element * (TaggedElement -> bool) -> [TaggedElement]
    findFirst_(elements, condition) ==
        cases elements:
            [] -> nil,
            others ->
                let head = find_(hd elements, condition)
                in
                    (if head <> nil then head else findFirst_(tl elements, condition))
            end
    measure m_findFirst_;
    
    m_findFirst_ : seq of Element * (TaggedElement -> bool) -> nat
    m_findFirst_(elements, -) == len elements;

end ViennaDOM
~~~
{% endraw %}

