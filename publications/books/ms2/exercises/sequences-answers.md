---
layout: default
title: Modelling Systems Using Sequences
---

## Modelling Systems: Answers to Additional Exercises on Sequences

### Basic Exercises

1. Evaluating
 1. `[x | x in set {2,...,5} & x > 2] = [3,4,5]`
 2. `[x | x in set {3,5,2,4} & x*x > 22] = [2,3,4]`
2. Express the following in VDM-SL:
 1. The sequence L has less than 5 distinct elements: `card elems L < 5`
 2. The sequence L has no duplicated elements: `card elems L = len L`
 3. The sequences L1 and L2 are non-empty and are disjoint (i.e. they have no elements in common): `L1 <> [] and L2 <> [] and elems L1 inter elems L2 = {}`
4. Write an explicit function definition for the inds operator.
 
~~~
Inds: seq of X -> set of nat 
Inds(L) == {1,...,len L} 
~~~

5. If `L` is of type `seq of (seq of nat)`, write an expression which says that all the sequences in `L` are disjoint.
 
~~~
       forall L1,L2 in set elems L & L1 <> L2 => elems L1 inter elems L2 = {}
~~~
	   
	   Notice that the following is incorrect:
 
~~~
 forall L1,L2 in set elems L & elems L1 inter elems L2 = {}
~~~

 because `L1` and `L2` could evaluate to the same element sequence in `L`. The erroneous expression above is going to be false for any `L` except the sequence containing only the empty sequence (i.e. the case where `L = [[]]`).
 
### Array

~~~
types

Array = seq of int
inv A == len A >=1;


functions

NoOverlap: Array * Array * nat * nat -> bool
-- no value in A between j and k is in B between k+1 and N
NoOverlap(A,B,j,k) ==
  elems A(j,...,k) inter elems B(k+1,...,len B) = {}
pre j>=1 and k >=1 and j<=len A and k <= len A and k <= len B;


-- Tests: (a1,a2,1,3) - false; (b1,a2,3,4) - true

PerfectSquares: Array -> bool
PerfectSquares(A) ==
  forall i in set inds A & A(i)=(len A - i + 1) * (len A - i + 1);


values

c1: Array = [3,6,7]; -- false
c2: Array = [16,9,4,1]; -- true
~~~

### Lines

~~~
types

Line = seq of char;

functions

NumberOfOccur: char * Line -> nat
-- number of occurences of x in p 
NumberOfOccur(x,p) == card {i| i in set inds p & p(i) =x};


NumOfDistinctEls: Line -> nat
-- returns number of distinct elements in p
NumOfDistinctEls(p) == card elems p;


Distance: Line * Line -> nat
-- returns number of distinct elements that are either in A or B but 
-- not in both
Distance(A,B) == 
  card ((elems A \ elems B) union (elems B \ elems A));
~~~

### Average

~~~
functions 
Average: seq of real -> real 
Average(L) == 
  Sum(L) / len L; 

Sum: seq of real -> real 
Sum(L) == 
  if L = [] 
  then 0 
  else hd L + Sum(tl L) 
~~~

### Reversing sequences

~~~
types 
  X = token -- it could be defined to anything 
-- using full VDM-SL these functions could actually be defined as polymorphic functions. 

functions 

Reverse: seq of X -> seq of X 
Reverse(L) == 
  if L = [] 
  then [] 
  else Reverse(tl L) ^ [hd L]; 

Reverse2: seq of X -> seq of X 
Reverse2(L) == 
  [L(len L + 1 - i) | i in set inds L]; 
~~~

