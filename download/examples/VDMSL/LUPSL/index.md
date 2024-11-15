---
layout: default
title: LUPSL
---

## LUPSL
Author: Lothar Schmitz


This VDM model is made by Lothar Schmitz and it has taken different
standard algorithms for the length of longest upsequence problem
from David Gries and Janusz Laski (see references below). Different 
versions of the algorithms are included. See also:

David Gries: The Science of Programming, Springer-Verlag 1981, 
pp. 259-262.

Janusz Laski und William Stanley, Software Verification and Analysis, 
Springer-Verlag, 2009.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| DEFAULT`lupsmOp1Gries(DEFAULT`a1)|
|Entry point     :| DEFAULT`lupsmOp1Gries(DEFAULT`a2)|
|Entry point     :| DEFAULT`lupsmOp1Gries(DEFAULT`a3)|
|Entry point     :| DEFAULT`lupsmOp1Gries(DEFAULT`a4)|
|Entry point     :| DEFAULT`lupsmOp1Gries(DEFAULT`a5)|
|Entry point     :| DEFAULT`lupslOp1Laski(DEFAULT`a1)|
|Entry point     :| DEFAULT`lupslOp1Laski(DEFAULT`a2)|
|Entry point     :| DEFAULT`lupslOp1Laski(DEFAULT`a3)|
|Entry point     :| DEFAULT`lupslOp1Laski(DEFAULT`a4)|
|Entry point     :| DEFAULT`lupslOp1Laski(DEFAULT`a5)|
|Entry point     :| DEFAULT`lupsmOp2Gries(DEFAULT`a1)|
|Entry point     :| DEFAULT`lupsmOp2Gries(DEFAULT`a2)|
|Entry point     :| DEFAULT`lupsmOp2Gries(DEFAULT`a3)|
|Entry point     :| DEFAULT`lupsmOp2Gries(DEFAULT`a4)|
|Entry point     :| DEFAULT`lupsmOp2Gries(DEFAULT`a5)|
|Entry point     :| DEFAULT`lupslOp2Laski(DEFAULT`a1)|
|Entry point     :| DEFAULT`lupslOp2Laski(DEFAULT`a2)|
|Entry point     :| DEFAULT`lupslOp2Laski(DEFAULT`a3)|
|Entry point     :| DEFAULT`lupslOp2Laski(DEFAULT`a4)|
|Entry point     :| DEFAULT`lupslOp2Laski(DEFAULT`a5)|


### LUPSL.vdmsl

{% raw %}
~~~
types

array = seq1 of int;

values

a1: array = [1,2,9,4,7,3]; --,11,8,14,6]; 
a2: array = [4,3,2,1];
a3 = [1,2,3,4]; 
a4 = [2];
a5 = [2,2,2,2];

functions

MaxOfSet: set1 of int -> int
MaxOfSet(s) ==
 let e in set s in
   if card s = 1 then
      e
   else
      let mr = MaxOfSet(s\{e}) in
         if e > mr then e else mr
 post RESULT in set s and forall e in set s & e <= RESULT
 measure card s;

lupsltok : array * nat1 -> nat
lupsltok(a,k) ==
 let compatible = {lupsltok(a,j) | j in set{1,...,k-1} & a(j)<=a(k)} 
 in
   if compatible = {} 
   then 1 
   else MaxOfSet(compatible) + 1; 

lupsl : array -> nat
lupsl(a) == 
  MaxOfSet({lupsltok(a,j) | j in set inds a});

ascending : array * set of int -> bool
ascending(a,s) ==
   forall i,j in set s & i<j => a(i)<=a(j) pre s subset (inds a);

lupslSpec : array -> int
lupslSpec(a) ==
   MaxOfSet({ card s | s in set power inds a & ascending(a,s) })

operations

lupslOp1Laski : array ==> nat
lupslOp1Laski(a) == 
  (dcl lupsls : set of nat := {};
   for all k in set inds a do
      lupsls := lupsls union {lupsltok(a,k)};
   return MaxOfSet(lupsls);
  )
post lupslSpec(a) = RESULT;

state lups of
  lupslarr : array 
init s == s = mk_lups([1])
end

operations

lupsmOp1Gries : array ==> nat
lupsmOp1Gries(a) == 
  (lupslarr := [a(1)];
   for k = 2 to len a do
      lupsm4kop1Gries(a,k);
   return len lupslarr;
  )
post lupslSpec(a) = RESULT;
 
lupsm4kop1Gries : array * nat1 ==> ()
lupsm4kop1Gries(a,k) ==
  (dcl i : int; 
   if lupslarr(len lupslarr)<=a(k) then
      lupslarr := lupslarr^[a(k)]
   else
     (i := iota x in set {1,...,len lupslarr} &
             lupslarr(x) > a(k) and 
             forall j in set {1,...,x-1} & lupslarr(j) <= a(k);
      lupslarr(i) := a(k);
     );
  )
pre k in set inds a;
 
lupslOp2Laski : array ==> nat
lupslOp2Laski(a) == 
  (dcl lupslmax : nat := 0;
   for k = 1 to len a do
      let lak = lupsltok(a,k) in
        if lak > lupslmax then lupslmax := lak;
   return lupslmax;
  )
post lupslSpec(a) = RESULT;
 
lupsmOp2Gries : array ==> nat
lupsmOp2Gries(a) == 
  (lupslarr := [a(1)];
   for k = 2 to len a do
      lupsm4kop2Gries(a,k);
   return len lupslarr;
  )
post lupslSpec(a) = RESULT;

lupsm4kop2Gries : array * nat1 ==> ()
lupsm4kop2Gries(a,k) ==
  (dcl i : int; 
   if lupslarr(len lupslarr)<=a(k) then
      lupslarr := lupslarr^[a(k)]
   else
     (i := 1;
      while lupslarr(i) <= a(k) do
         i := i+1;
      lupslarr(i) := a(k);
     );
  )
pre k in set inds a;
 
lupslOp3Laski : array ==> nat
lupslOp3Laski(a) == 
  (dcl lupslmax : nat := 0; 
   for k = 1 to len a do
      let lak = lupsltokop1Laski(a,k) in
        if lak > lupslmax 
        then lupslmax := lak;
   return lupslmax;
  )
post lupslSpec(a) = RESULT;

lupsltokop1Laski : array * nat1 ==> nat
lupsltokop1Laski(a,k) ==
  (dcl compatible : set of int := {};
   dcl erg : int; 
   for j = 1 to k-1 do
       if a(j)<=a(k) then
          compatible := (compatible union {lupslarr(j)});
   if compatible = {} then 
      erg := 1
   else 
      erg := MaxOfSet(compatible) + 1;
   lupslarr := lupslarr^[erg];
   return erg;
  )
pre k in set inds a; 
 
lupsmOp3Gries : array ==> nat
lupsmOp3Gries(a) == 
  (lupslarr := [a(1)];
   for k = 2 to len a do
      lupsm4kop3Gries(a,k);
   return len lupslarr;
  )
post lupslSpec(a) = RESULT;
 
lupsm4kop3Gries : array * nat1 ==> ()
lupsm4kop3Gries(a,k) ==
  (dcl li : int,
       re : int,
       m  : int; 
   if lupslarr(len lupslarr)<=a(k) then
          lupslarr := lupslarr^[a(k)]
   elseif a(k)< lupslarr(1) then 
      lupslarr(1) := a(k)
   else  
      (li := 1;
       re := len lupslarr;
       while li <> re-1 do
         (m := (li+re) div 2;
          if lupslarr(m)<=a(k) then
             li := m
          else
             re := m;
         );
         lupslarr(re) := a(k);
       );
  )
pre k in set inds a;
 
lupslOp4Laski : array ==> nat
lupslOp4Laski(a) == 
  (dcl lupslmax : nat := 0; 
   for k = 1 to len a do
      let lak = lupsltokop2Laski(a,k) in
        if lak > lupslmax 
        then lupslmax := lak;
   return lupslmax;
  )
post lupslSpec(a) = RESULT;
 
lupsltokop2Laski : array * nat1 ==> nat
lupsltokop2Laski(a,k) ==
  (dcl erg : int := 0; 
   for j = 1 to k-1 do
       if a(j)<=a(k) then
          if erg < lupslarr(j) 
          then erg := lupslarr(j);
   erg := erg+1;
   lupslarr := lupslarr^[erg];
   return erg;
  )
pre k in set inds a; 

 
~~~
{% endraw %}

