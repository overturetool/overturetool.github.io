---
layout: default
title: Modelling Systems Using Sets
---

## Modelling Systems: Answers to Additional Exercises on Sets

### Basic Exercises

Evaluating
1. {x | x in set {2,...,5} & x > 2} = {3,4,5}
2. {x | x in set {2,...,5} & x*x > 22} = {5}
3. dunion{ {1,2},{1,5,6},{3,4,6} } = {1,...,6}
4. dinter{ {1,2},{1,5,6},{3,4,6} } = {}

Express the following in VDM-SL:
The set s has less than 5 elements: `card s < 5`

The class of even integers: this has to be a type rather than a set, because the class of values could be infinitely large. We therefore use a type definition with an invariant to capture the limitation.

~~~
Evens = int
inv n == exists h : int & h*2=n
~~~

The set of even integers less than 30: this is a finite set, so it can be defined by a set comprehension: `{ x | x:int & (exists h:int & h*2=n) and x < 30}`
The sets s1 and s2 are non-empty and disjoint (i.e. they have no elements in common). `s1 <> {} and s2 <> {} and s1 inter s2 = {}`

The elements contained in both s1 and s2 are also in s3: `s1 inter s2 subset s3`
Write an explicit function definition for the set difference operator.

~~~
        diff: set of X * set of X -> set of X
        diff(s1,s2) == { x | x in set s1 & not x in set s2}
~~~
		
Alternatively, use a type binding in the comprehension:

~~~
        diff2: set of X * set of X -> set of X
        diff2(s1,s2) == { x | x : X & x in set s1 and not x in set s2}
~~~
		
If s is of type set of (set of nat), write an expression which says that all the sets in s are disjoint.

~~~
       forall s1,s2 in set s & s1 <> s2 => s1 inter s2 = {}
~~~
	   
Notice that the following is incorrect:

~~~
       forall s1,s2 in set s & s1 inter s2 = {}
~~~
	   
because s1 and s2 could evaluate to the same set in s. The erroneous expression above is going to be false for any s except the set containing only the empty set (i.e. the case where s = { Ø }

### Connected Sets

~~~
types

  ConSet = set of set of A
  inv cs == 
    cs <> {} and 
    forall s in set cs & s <> {};

  A = token;

functions

  TC: ConSet -> bool
  TC(cs) ==
    forall s1, s2 in set cs & s1 inter s2 <> {};

  NC: ConSet * nat -> bool
  NC(cs,n) ==
    forall s1 in set cs &
      card {s | s in set cs & s inter s1 <> {}} = n + 1;

  RC: ConSet -> bool
  RC(cs) ==
    NC(cs,2) and
    let s1 in set cs 
    in
      let s2 in set cs \ {s1} be st s1 inter s2 <> {}
      in
        CheckOrder(cs \ {s1,s2}, s1, s2);

  CheckOrder: set of set of A * set of A * set of A -> bool
  CheckOrder(cs,sfirst,snext) ==
    if card cs < 2
    then forall s in set cs & s inter sfirst <> {}
    else if exists s in set cs & s inter snext <> {}
         then let s in set cs be st s inter snext <> {} 
              in
                CheckOrder(cs \ {s}, sfirst, s)
         else false;

values

  s1: set of A = {mk_token(1),mk_token(2),mk_token(3)};
  s2: set of A = {mk_token(3),mk_token(4)};
  s3: set of A = {mk_token(4),mk_token(5),mk_token(2)};
  s4: set of A = {mk_token(6),mk_token(7)};
  s5: set of A = {mk_token(7),mk_token(8)};
  s6: set of A = {mk_token(8),mk_token(6)};

  cs1: ConSet = {s1,s2,s3};
  cs2: ConSet = {s1,s2,s3,s4,s5,s6};
~~~

### Equivalence recordings

~~~
-- solution for part 1
types

  Equiv = set of set of Elem
  inv equiv == 
    equiv <> {} and
    forall es1,es2 in set equiv &
      es1 <> es2 => es1 inter es2 = {} and
      es1 <> {};

  Elem = token;

values

  eq: Equiv = {{mk_token(1),mk_token(2)},
               {mk_token(3)},
               {mk_token(4),mk_token(5),mk_token(6)}};

-- solution for part 2
types

  MarkedParts = set of Pair
  inv mps ==
    mps <> {} and
    forall p1,p2 in set mps &
      not p1.elem in set p1.parti union p2.parti and
      p1 <> p2 => (p1.elem <> p2.elem and
                   p1.parti inter p2.parti = {});

  Pair ::
    elem : Elem
    parti: set of Elem;

-- solution for part 3

functions

  Marked2Equiv: MarkedParts -> Equiv
  Marked2Equiv(mps) ==
    {{elem} union parti | mk_Pair(elem,parti) in set mps};

  Equiv2Markeds: Equiv -> set of MarkedParts
  Equiv2Markeds(equiv) ==
    {{mk_Pair(elem,parti)|{(elem)} union parti in set equiv}
    | elem in set dunion equiv}

  -- note that the (elem) is a math value pattern meaning that 
  -- the value of "elem" in this context is used rather than a 
  -- new identifier being intruduced. The set union pattern
  -- between a singleton set with elem and the rest (parti) 
  -- is used to make an arbitrary split between them.
~~~

### A thesaurus

~~~
types 
Thesaurus = set of Group 
inv ts == not exists g1, g2 in set ts & g1 inter g2 = {}; 

Group = set of Word; 

Word = seq of char 
inv w == len w <= 20 

functions 

Words: Thesaurus -> set of Word 
Words(ts) == dunion ts; 

Similar(w:Word, ts:Thesaurus)g:Group 
pre w in set Words(ts) 
post w in set g and g in set ts; 

AddWord: Word * Word * Thesaurus -> Thesaurus 
AddWord(old, new, ts) == (ts \ {Similar(old,ts)}) union {Similar(old,ts) union {new}} 
pre new not in set Words(ts); 

RemWord: Word * Thesaurus -> Thesaurus 
RemWord(w,ts) == ts \ { g | g in set ts & w in set g} 
~~~