---
layout: default
title: Modelling Systems Logic
---

## Modelling Systems: Answers to Additional General Exercises

### Evaluation

1. `not (true and false) = not false = true`
2. `(true or false) => (true => false) = true => false = false`
3. `(true and false) <=> (not true and not false) = false <=> (false and true) = false <=> false = true`
4. `0 < 34 and 0 = 34 = true and false = false`
5. `0*34 > 90 or 0+90 > 1 or true = 0>90 or 90 > 1 or true = true` (You could see instantly that, because one of the disjuncts is true, the whole of this disjunction must be true.)
6. `(0=0 or 34>23) <=> (90=4 and 1=5 and 1=44) = true <=> false = false`
7. `(0+34 > 2 => 90+1>3) => 0=12 = (true => true) => false = true => false = false`
8. `0+34>2 => (90+1>3 => 0=12) = true => (true => false) = true => false = false`

### Presentation of logical expressions

1. `(p and (not (not (not (not q))))) <=> r`
2. `((p and q) or r) <=> (s and t)`
3. `((p => q) <=> (r => s)) <=> (p => (q or s))`
4. `((p and q) => r) <=> (((p and q) or r) => (c and d))`

### Quantifiers

1. `forall x in set {7,55,133,200} & x > 5`
2. `exists x:nat & x < 50`
3. `exists x,y:nat & x*y = 50`
4. `exists factor:nat & 2*factor = 24`
5. `forall x:nat & (exists factor & 2*factor = x) or (exists factor & 2*factor = x+1)`
6. `not exists x:nat & (exists factor & 2*factor = x) and (exists factor & 2*factor = x+1)`
7. `forall x,y:nat & exists q:rat & q = x/y` or, including the expression to record the non-zero divisor restriction: `forall x:nat, y:nat1 & exists q:rat & q = x/y`

Expansions:

1. `2*1 < 10 and 2*2 < 10 and ... and 2*5 < 10`
2. `1*1 = 9 or 2*2 = 9 or ... 5*5 = 9`
3. `1*1 = 1*1 or 1*2 = 2*2 or 1*3 = 3*3 or 2*1 = 1*1 or 2*2 = 2*2 or 2*3 = 3*3 or 3*1 = 1*1 or 3*2 = 2*2 or 3*3 = 3*3`

Evaluating to true or false:

1. `true`
2. `false`
3. `false`
4. `false`
5. `false, e.g. i=1, j=10`
6. `false, e.g. i=3, j=4`
7. `false, e.g. i=j=3`
8. `true, e.g. x=2,y=3`

### Love relations

{% raw %}
~~~
types 
Name = token; 

People = set of Name; 

Lovers = map Name to People 
inv m == not ({} in set rng m); 
-- p |-> S is in the map, if p loves everybody in S 
-- models a binary relation on a set from People 

Result :: whom: [People] 
          flag: bool; 

functions 

Loves: Name * Name * Lovers -> bool 
Loves(p,q,L) == -- p Loves q 
 p in set dom L and q in set L(p); 

SILBE : Lovers * People -> Result 
-- short for  SomebodyIsLovedByEverybody 
-- returns set of people loved by everybody and Boolean flag 
SILBE(L,C) == 
    let a = dinter {L(x)| x in set dom L} 
     in let b= (C=dom L) and (a <> {}) 
      in 
    mk_Result(if b then a else nil, b); 

-- Test Data 
-- For CC1 (Empty, false)  returned; for CC2 (Betty, true) 

SILBE1: Lovers * People -> bool 
-- an alternative  solution involving function Loves 
SILBE1(L,C) == 
   exists  i in set C  & forall j in set C & Loves(j,i,L); 

NLE: Lovers * People -> bool 
-- short of Nobody Loves Everybody 
NLE(L,C) == 

 forall i in set C & 
   exists j in set C & 
        not Loves(i,j,L); 
-- Tests: for (CC1,C) - true, for (CC4,C) false. 

TransLove: Lovers  -> bool 
-- Transitive Love 
TransLove(L) == 
  let R = dunion rng L in -- those who are loved 
   let D = dom L in -- those who love 

   forall i in set D & 
    forall j in set D & -- potentially loved by i 
     Loves(i,j,L) and (j in set D) =>  -- if i loves j AND j loves somebody 
        exists k in set L(j) & Loves(i,k,L); 

-- Test cases: CC1, no j loves anybody 
-- CC2 true, C3 loved by everybody 
-- CC3 false: C1 loves C2, C2 loves C1,C3,C5, but C1 does not love any of them 
-- CC4: everybody loves everybody 
-- CHALLENGE:  Explain the result 
  

values 

C1: Name = mk_token("jim"); 
C2: Name = mk_token("joan"); 
C3: Name = mk_token("betty"); 
C4: Name = mk_token("john"); 
C5: Name = mk_token("phil"); 
C6: Name = mk_token("barb"); 

C : People = {C1,C2,C3,C4,C5,C6}; 

CC1: Lovers 
    = { C1 |-> {C2, C3}, C4 |-> {C5,C6}}; 

CC2: Lovers 
    = { C1 |-> {C2, C3}, C2 |-> {C1,C3,C5}, C3 |-> {C3}, 
        C4 |-> {C3,C6}, C5 |-> {C3,C6}, C6 |-> {C2,C3}}; 

CC3: Lovers 
    = { C1 |-> {C2}, C2 |-> {C1,C3,C5}, C3 |-> {C3}, 
        C4 |-> {C3,C6}, C5 |-> {C3,C6}, C6 |-> {C2,C3}}; 

CC4: Lovers = { x |-> C | x in set C};
~~~
{% endraw %}