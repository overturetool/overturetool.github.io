---
layout: default
title: ISO8601SL
---

## ISO8601SL
Author: Paul Chisholm


This is a model of dates, times and durations from the ISO8601 standard. It is 
intended as a core library for use  by higher level models that require dates and/or 
times and/or durations. Dates are  based on the Gregorian calendar. The Gregorian 
calendar commenced in October 1582, but it is extended backwards to year 1 in the 
proleptic Gregorian calendar, as per ISO 8601.
Times assume Co-ordinated Univeral Time (UTC). Timezones and daylight savings are 
not supported. The granularity of times is to the nearest millisecond.
A duration is modelled as a number of elapsed milliseconds (being the smallest unit 
of time). All functions are explicit and executable. Where a non-executable condition 
adds value, it is included as a comment.



| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| Set`sum({1,2,3,4,5,6,7,8,9})|


### Seq.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose functions over sequences.

   All functions are explicit and executable. Where a non-executable condition adds value, it
   is included as a comment.
*/
module Seq
imports from Numeric all,
        from Ord all
exports functions sum: seq of real +> real;
                  prod: seq of real +> real;
                  min[@a]: seq1 of @a +> @a;
                  minWith[@a]: (@a * @a +> bool) +> seq1 of @a +> @a;
                  max[@a]: seq1 of @a +> @a;
                  maxWith[@a]: (@a * @a +> bool) +> seq1 of @a +> @a;
                  inSeq[@a]: @a * seq of @a +> bool;
                  indexOf[@a]: @a * seq1 of @a +> nat1;
                  indexOfSeq[@a]: seq1 of @a * seq1 of @a +> nat1;
                  indexOfSeqOpt[@a]: seq1 of @a * seq1 of @a +> [nat1];
                  numOccurs[@a]: @a * seq of @a +> nat;
                  permutation[@a]: seq of @a * seq of @a +> bool;
                  ascending[@a]: seq of @a +> bool;
                  ascendingWith[@a]: (@a * @a +> bool) +> seq of @a +> bool;
                  descending[@a]: seq of @a +> bool;
                  descendingWith[@a]: (@a * @a +> bool) +> seq of @a +> bool;
                  insert[@a]: @a * seq of @a +> seq of @a;
                  insertWith[@a]: (@a * @a +> bool) +> @a * seq of @a +> seq of @a;
                  sort[@a]: seq of @a +> seq of @a;
                  sortWith[@a]: (@a * @a +> bool) +> seq of @a +> seq of @a;
                  lexicographic[@a]: seq of @a * seq of @a +> bool;
                  lexicographicWith[@a]: (@a * @a +> bool) +> seq of @a * seq of @a +> bool;
                  preSeq[@a]: seq of @a * seq of @a +> bool;
                  postSeq[@a]: seq of @a * seq of @a +> bool;
                  subSeq[@a]: seq of @a * seq of @a +> bool;
                  replicate[@a]: nat * @a +> seq of @a;
                  padLeft[@a]: seq of @a * @a * nat +> seq of @a;
                  padRight[@a]: seq of @a * @a * nat +> seq of @a;
                  padCentre[@a]: seq of @a * @a * nat +> seq of @a;
                  dropWhile[@a]: (@a +> bool) * seq of @a +> seq of @a;
                  xform[@a,@b]: (@a +> @b) * seq of @a +> seq of @b;
                  fold[@a]: (@a * @a +> @a) * @a * seq of @a +> @a;
                  fold1[@a]: (@a * @a +> @a) * seq1 of @a +> @a;
                  zip[@a,@b]: seq of @a * seq of @b +> seq of (@a * @b);
                  unzip[@a,@b]: seq of (@a * @b) +> seq of @a * seq of @b;
                  isDistinct[@a]: seq of @a +> bool;
                  pairwise[@a]: (@a * @a +> bool) +> seq of @a +> bool;
                  app[@a]: seq of @a * seq of @a +> seq of @a;
                  setOf[@a]: seq of @a +> set of @a;
                  format[@a]: (@a +> seq of char) * seq of char * seq of @a +> seq of char

definitions

functions

  -- The sum of a set of numerics.
  sum: seq of real +> real
  sum(s) == fold[real](Numeric`add,0,s);

  -- The product of a set of numerics.
  prod: seq of real +> real
  prod(s) == fold[real](Numeric`mult,1,s);

  -- The minimum of a sequence.
  min[@a]: seq1 of @a +> @a
  min(s) == fold1[@a](Ord`min[@a], s)
  post RESULT in set elems s and forall e in set elems s & RESULT <= e;

  -- The minimum of a sequence with respect to a relation.
  minWith[@a]: (@a * @a +> bool) +> seq1 of @a +> @a
  minWith(o)(s) == fold1[@a](Ord`minWith[@a](o), s)
  post RESULT in set elems s and forall e in set elems s & RESULT = e or o(RESULT,e);

  -- The maximum of a sequence.
  max[@a]: seq1 of @a +> @a
  max(s) == fold1[@a](Ord`max[@a], s)
  post RESULT in set elems s and forall e in set elems s & RESULT >= e;

  -- The maximum of a sequence with respect to a relation.
  maxWith[@a]: (@a * @a +> bool) +> seq1 of @a +> @a
  maxWith(o)(s) == fold1[@a](Ord`maxWith[@a](o), s)
  post RESULT in set elems s and forall e in set elems s & RESULT = e or o(e,RESULT);

  -- Does an element appear in a sequence?
  inSeq[@a]: @a * seq of @a +> bool
  inSeq(e,s) == e in set elems s;

  -- The position an item appears in a sequence?
  indexOf[@a]: @a * seq1 of @a +> nat1
  indexOf(e,s) == cases s:
                    [-]    -> 1,
                    [f]^ss -> if e=f then 1 else 1 + indexOf[@a](e,ss)
                  end
  pre inSeq[@a](e,s)
  measure size0;

  -- The position a subsequence appears in a sequence.
  indexOfSeq[@a]: seq1 of @a * seq1 of @a +> nat1
  indexOfSeq(r,s) == if preSeq[@a](r,s)
                     then 1
                     else 1 + indexOfSeq[@a](r, tl s)
  pre subSeq[@a](r,s)
  measure size3;

  -- The position a subsequence appears in a sequence?
  indexOfSeqOpt[@a]: seq1 of @a * seq1 of @a +> [nat1]
  indexOfSeqOpt(r,s) == if subSeq[@a](r,s) then indexOfSeq[@a](r, s) else nil;

  -- The number of times an element appears in a sequence.
  numOccurs[@a]: @a * seq of @a +> nat
  numOccurs(e,sq) == len [ 0 | i in seq sq & i = e ];

  -- Is one sequence a permutation of another?
  permutation[@a]: seq of @a * seq of @a +> bool
  permutation(sq1,sq2) ==
    len sq1 = len sq2 and
    forall x in seq sq1 & numOccurs[@a](x,sq1) = numOccurs[@a](x,sq2);

  -- Is a sequence presented in ascending order?
  ascending[@a]: seq of @a +> bool
  ascending(s) == forall i in set {1,...,len s - 1} & s(i) <= s(i+1)
  post RESULT <=> descending[@a](reverse(s));

  -- Is a sequence presented in ascending order with respect to a relation?
  ascendingWith[@a]: (@a * @a +> bool) +> seq of @a +> bool
  ascendingWith(o)(s) == forall i in set {1,...,len s - 1} & s(i) = s(i+1) or o(s(i), s(i+1))
  post RESULT <=> descendingWith[@a](o)(reverse(s));

  -- Is a sequence presented in descending order?
  descending[@a]: seq of @a +> bool
  descending(s) == forall i in set {1,...,len s - 1} & s(i) >= s(i+1);
  --post RESULT <=> ascending[@a](reverse(s));

  -- Is a sequence presented in descending order with respect to a relation?
  descendingWith[@a]: (@a * @a +> bool) +> seq of @a +> bool
  descendingWith(o)(s) == forall i in set {1,...,len s - 1} & s(i) = s(i+1) or o(s(i+1), s(i));
  --post RESULT <=> ascendingWith[@a](o)(reverse(s));

  -- Insert a value into an ascending sequence preserving order.
  insert[@a]: @a * seq of @a +> seq of @a
  insert(x, s) == cases s:
                    []    -> [x],
                    [y]   -> if x <= y then [x,y] else [y,x],
                    [y]^t -> if x <= y then [x]^s else [y]^insert[@a](x, t)
                  end
  pre ascending[@a](s)
  post ascending[@a](RESULT) and permutation[@a]([x]^s, RESULT)
  measure size9;

  -- Insert a value into an ascending sequence of values preserving order.
  insertWith[@a]: (@a * @a +> bool) +> @a * seq of @a +> seq of @a
  insertWith(o)(x, s) ==
    cases s:
      []    -> [x],
      [y]   -> if o(x,y) then [x,y] else [y,x],
      [y]^t -> if o(x,y) then [x]^s else [y]^insertWith[@a](o)(x, t)
    end
  pre ascendingWith[@a](o)(s)
  post ascendingWith[@a](o)(RESULT) and permutation[@a]([x]^s, RESULT)
  measure size6;

  -- Sort a sequence of items.
  sort[@a]: seq of @a +> seq of @a
  sort(s) == cases s:
               []      -> [],
               [x]     -> [x],
               [x] ^ t -> insert[@a](x, sort[@a](t))
             end
  post elems RESULT = elems s and ascending[@a](RESULT)
  measure size10;

  -- Sort a sequence of items by the provided order relation.
  sortWith[@a]: (@a * @a +> bool) +> seq of @a +> seq of @a
  sortWith(o)(s) == cases s:
                      [] -> [],
                      [x] -> [x],
                      [x] ^ t -> insertWith[@a](o)(x, sortWith[@a](o)(t))
                    end
  post elems RESULT = elems s and ascendingWith[@a](o)(RESULT)
  measure size7;

  -- Lexicographic ordering on sequences.
  lexicographic[@a]: seq of @a * seq of @a +> bool
  lexicographic(s, t) ==
    cases mk_(s, t):
      mk_([], [-])        -> true,
      mk_([], -^-)        -> true,
      mk_([x], [y])       -> x < y,
      mk_([x], [y]^-)     -> x <= y,
      mk_([x]^-, [y])     -> x < y,
      mk_([x]^s1, [y]^t1) -> x < y or x = y and lexicographic[@a](s1, t1),
      mk_(-,-)            -> false
    end
    post RESULT <=> exists i in set {0,...,Numeric`min(len s, len t)}
                         & (forall j in set {1,...,i} & s(j) = t(j)) and
                           let s1 = s(i+1,...,len s),
                               t1 = t(i+1,...,len t)
                           in s1 = [] and t1 <> [] or
                              s1 <> [] and t1 <> [] and hd s1 < hd t1
  measure size11;

  -- Lexicographic ordering on sequences by the provided order relation.
  lexicographicWith[@a]: (@a * @a +> bool) +> seq of @a * seq of @a +> bool
  lexicographicWith(o)(s, t) ==
    cases mk_(s, t):
      mk_([], [-])        -> true,
      mk_([], -^-)        -> true,
      mk_([x], [y])       -> o(x, y),
      mk_([x], [y]^-)     -> o(x, y) or x = y,
      mk_([x]^-, [y])     -> o(x, y),
      mk_([x]^s1, [y]^t1) -> o(x, y) or x = y and lexicographicWith[@a](o)(s1, t1),
      mk_(-,-)            -> false
    end
    post RESULT <=> exists i in set {0,...,Numeric`min(len s, len t)}
                         & (forall j in set {1,...,i} & s(j) = t(j)) and
                           let s1 = s(i+1,...,len s),
                               t1 = t(i+1,...,len t)
                           in s1 = [] and t1 <> [] or
                              s1 <> [] and t1 <> [] and o(hd s1, hd t1)
  measure size8;

  -- Is one sequence a prefix of another?
  preSeq[@a]: seq of @a * seq of @a +> bool
  preSeq(pres,full) == pres = full(1,...,len pres);

  -- Is one sequence a suffix of another?
  postSeq[@a]: seq of @a * seq of @a +> bool
  postSeq(posts,full) == preSeq[@a](reverse posts, reverse full);

  -- Is one sequence a subsequence of another sequence?
  subSeq[@a]: seq of @a * seq of @a +> bool
  subSeq(sub,full) == sub = [] or (exists i,j in set inds full & sub = full(i,...,j));

  -- Create a sequence of identical elements.
  replicate[@a]: nat * @a +> seq of @a
  replicate(n,x) == [ x | i in set {1,...,n} ]
  post len RESULT = n and forall y in seq RESULT & y = x;

  -- Pad a sequence on the left with a given item up to a specified length.
  padLeft[@a]: seq of @a * @a * nat +> seq of @a
  padLeft(sq,x,n) == replicate[@a](n-len sq, x) ^ sq
  pre n >= len sq
  post len RESULT = n and postSeq[@a](sq, RESULT);

  -- Pad a sequence on the right with a given item up to a specified length.
  padRight[@a]: seq of @a * @a * nat +> seq of @a
  padRight(sq,x,n) == sq ^ replicate[@a](n-len sq, x)
  pre n >= len sq
  post len RESULT = n and preSeq[@a](sq, RESULT);

  -- Pad a sequence with a given item such that it is centred in a specified length.
  -- If padded by an odd number, add the extra item on the right.
  padCentre[@a]: seq of @a * @a * nat +> seq of @a
  padCentre(sq,x,n) == let space = if n <= len sq then 0 else n - len sq
                       in padRight[@a](padLeft[@a](sq,x,len sq + (space div 2)),x,n);

  -- Drop items from a sequence while a predicate is true.
  dropWhile[@a]: (@a +> bool) * seq of @a +> seq of @a
  dropWhile(p, s) == cases s:
                       []      -> [],
                       [x] ^ t -> if p(x) then dropWhile[@a](p, t) else s
                     end
  post postSeq[@a](RESULT, s) and
       (RESULT = [] or not p(RESULT(1))) and
       forall i in set {1,...,(len s - len RESULT)} & p(s(i))
  measure size5;

  -- Apply a function to all elements of a sequence.
  xform[@a,@b]: (@a+>@b) * seq of @a +> seq of @b
  xform(f,s) == [ f(x) | x in seq s ]
  post len RESULT = len s and
       (forall i in set inds s & RESULT(i) = f(s(i)));

  -- Fold (iterate, accumulate, reduce) a binary function over a sequence.
  -- The function is assumed to be associative and have an identity element.
  fold[@a]: (@a * @a +> @a) * @a * seq of @a +> @a
  fold(f, e, s) == cases s:
                     []    -> e,
                     [x]   -> x,
                     s1^s2 -> f(fold[@a](f,e,s1), fold[@a](f,e,s2))
                   end
  --pre (forall x:@a & f(x,e) = x and f(e,x) = x)
  --and forall x,y,z:@a & f(x,f(y,z)) = f(f(x,y),z)
  measure size2;

  -- Fold (iterate, accumulate, reduce) a binary function over a non-empty sequence.
  -- The function is assumed to be associative.
  fold1[@a]: (@a * @a +> @a) * seq1 of @a +> @a
  fold1(f, s) == cases s:
                   [e]   -> e,
                   s1^s2 -> f(fold1[@a](f,s1), fold1[@a](f,s2))
                 end
  --pre forall x,y,z:@a & f(x,f(y,z)) = f(f(x,y),z)
  measure size1;

  -- Pair the corresponding elements of two lists of equal length.
  zip[@a,@b]: seq of @a * seq of @b +> seq of (@a * @b)
  zip(s,t) == [ mk_(s(i),t(i)) | i in set inds s ]
  pre len s = len t
  post len RESULT = len s and mk_(s,t) = unzip[@a,@b](RESULT);

  -- Split a list of pairs into a list of firsts and a list of seconds.
  unzip[@a,@b]: seq of (@a * @b) +> seq of @a * seq of @b
  unzip(s) == mk_([ x.#1 | x in seq s], [ x.#2 | x in seq s])
  post let mk_(t,u) = RESULT in len t = len s and len u = len s;
  -- and s = zip[@a,@b](RESULT.#1,RESULT.#2);

  -- Are the elements of a list distinct (no duplicates).
  isDistinct[@a]: seq of @a +> bool
  isDistinct(s) == len s = card elems s;

  -- Are the elements of a sequence pairwise related?
  pairwise[@a]: (@a * @a +> bool) +> seq of @a +> bool
  pairwise(f)(s) == forall i in set {1,...,len s-1} & f(s(i), s(i+1));

  -- Create a string presentation of a set.
  format[@a]: (@a +> seq of char) * seq of char * seq of @a +> seq of char
  format(f,sep,s) == cases s:
                       []    -> "",
                       [x]   -> f(x),
                       t ^ u -> format[@a](f,sep,t) ^ sep ^ format[@a](f,sep,u)
                     end
  measure size4;

  -- The following functions wrap primitives for convenience, to allow them for example to
  -- serve as function arguments.

  -- Concatenation of two sequences.
  app[@a]: seq of @a * seq of @a +> seq of @a
  app(m,n) == m^n;

  -- Set of sequence elements.
  setOf[@a]: seq of @a +> set of @a
  setOf(s) == elems(s);

  -- Measure functions.

  size0[@a]: @a * seq1 of @a +> nat
  size0(-, s) == len s;

  size1[@a]: (@a * @a +> @a) * seq1 of @a +> nat
  size1(-, s) == len s;

  size2[@a]: (@a * @a +> @a) * @a * seq of @a +> nat
  size2(-, -, s) == len s;

  size3[@a]: seq1 of @a * seq1 of @a +> nat
  size3(-, s) == len s;

  size4[@a]: (@a +> seq of char) * seq of char * seq of @a +> nat
  size4(-, -, s) == len s;

  size5[@a]: (@a +> bool) * seq of @a +> nat
  size5(-, s) == len s;

  size6[@a]: (@a * @a +> bool) * @a * seq of @a +> nat
  size6(-,-,s) == len s;

  size7[@a]: (@a * @a +> bool) * seq of @a +> nat
  size7(-,s) == len s;

  size8[@a]: (@a * @a +> bool) * seq of @a * seq of @a +> nat
  size8(-,s,t) == len s + len t;

  size9[@a]: @a * seq of @a +> nat
  size9(-,s) == len s;

  size10[@a]: seq of @a +> nat
  size10(s) == len s;

  size11[@a]: seq of @a * seq of @a +> nat
  size11(-, s) == len s;

end Seq
~~~
{% endraw %}

### Set.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose functions over sets.

   All functions are explicit and executable. Where a non-executable condition adds value, it
   is included as a comment.
*/
module Set
imports from Numeric all,
        from Seq all,
        from Ord all
exports functions sum: set of real +> real;
                  prod: set of real +> real;
                  min[@a]: set1 of @a +> @a;
                  minWith[@a]: (@a * @a +> bool) +> set1 of @a +> @a;
                  max[@a]: set1 of @a +> @a;
                  maxWith[@a]: (@a * @a +> bool) +> set1 of @a +> @a;
                  toSeq[@a]: set of @a +> seq of @a;
                  xform[@a,@b]: (@a +> @b) * set of @a +> set of @b;
                  filter[@a]: (@a +> bool) +> set of @a +> set of @a;
                  fold[@a]: (@a * @a +> @a) * @a * set of @a +> @a;
                  fold1[@a]: (@a * @a +> @a) * set1 of @a +> @a;
                  pairwiseDisjoint[@a]: set of set of @a +> bool;
                  isPartition[@a]: set of set of @a * set of @a +> bool;
                  permutations[@a]: set1 of @a +> set1 of seq1 of @a;
                  xProduct[@a,@b]: set of @a * set of @b +> set of (@a * @b);
                  format[@a]: (@a +> seq of char) * seq of char * set of @a +> seq of char

definitions

functions

  -- The sum of a set of numerics.
  sum: set of real +> real
  sum(s) == fold[real](Numeric`add,0,s);

  -- The product of a set of numerics.
  prod: set of real +> real
  prod(s) == fold[real](Numeric`mult,1,s);

  -- The minimum of a set.
  min[@a]: set1 of @a +> @a
  min(s) == fold1[@a](Ord`min[@a], s)
  -- pre Type argument @a admits an order relation.
  post RESULT in set s and forall e in set s & RESULT <= e;

  -- The minimum of a set with respect to a relation.
  minWith[@a]: (@a * @a +> bool) +> set1 of @a +> @a
  minWith(o)(s) == fold1[@a](Ord`minWith[@a](o), s)
  post RESULT in set s and forall e in set s & RESULT <= e;

  -- The maximum of a set.
  max[@a]: set1 of @a +> @a
  max(s) == fold1[@a](Ord`max[@a], s)
  -- pre Type argument @a admits an order relation.
  post RESULT in set s and forall e in set s & RESULT >= e;

  -- The maximum of a set with respect to a relation.
  maxWith[@a]: (@a * @a +> bool) +> set1 of @a +> @a
  maxWith(o)(s) == fold1[@a](Ord`maxWith[@a](o), s)
  post RESULT in set s and forall e in set s & RESULT >= e;

  -- The sequence whose elements are those of a specified set, with no duplicates.
  -- No order is guaranteed in the resulting sequence.
  toSeq[@a]: set of @a +> seq of @a
  toSeq(s) == cases s:
                {} ->        [],
                {x} ->       [x],
                t union u -> toSeq[@a](t) ^ toSeq[@a](u)
              end
  post len RESULT = card s and elems RESULT = s
  measure size;
  /*
    A simpler definition would be
      toSeq(s) == [ x | x in set s ]
    This would however assume an order relation on the argument type @a.
  */

  -- Apply a function to all elements of a set. The result set may be smaller than the
  -- argument set if the function argument is not injective.
  xform[@a,@b]: (@a+>@b) * set of @a +> set of @b
  xform(f,s) == { f(e) | e in set s }
  post (forall e in set s & f(e) in set RESULT) and
       (forall r in set RESULT & exists e in set s & f(e) = r);

  -- Filter those elements of a set that satisfy a predicate.
  filter[@a]: (@a +> bool) +> set of @a +> set of @a
  filter(p)(s) == { x | x in set s & p(x) }
  post (forall x in set RESULT & p(x)) and (forall x in set s \ RESULT & not p(x));

  -- Fold (iterate, accumulate, reduce) a binary function over a set.
  -- The function is assumed to be commutative and associative, and have an identity element.
  fold[@a]: (@a * @a +> @a) * @a * set of @a +> @a
  fold(f, e, s) == cases s:
                     {}        -> e,
                     {x}       -> x,
                     t union u -> f(fold[@a](f,e,t), fold[@a](f,e,u))
                   end
  --pre (forall x:@a & f(x,e) = x and f(e,x) = x)
  --and (forall x,y:@a & f(x, y) = f(y, x))
  --and (forall x,y,z:@a & f(x,f(y,z)) = f(f(x,y),z))
  measure size2;

  -- Fold (iterate, accumulate, reduce) a binary function over a non-empty set.
  -- The function is assumed to be commutative and associative.
  fold1[@a]: (@a * @a +> @a) * set1 of @a +> @a
  fold1(f, s) == cases s:
                   {e}       -> e,
                   t union u -> f(fold1[@a](f,t), fold1[@a](f,u))
                 end
  --pre (forall x,y:@a & f(x,y) = f(y,x))
  --and (forall x,y,z:@a & f(x,f(y,z)) = f(f(x,y),z))
  measure size1;

  -- Are the members of a set of sets pairwise disjoint.
  pairwiseDisjoint[@a]: set of set of @a +> bool
  pairwiseDisjoint(ss) == forall x,y in set ss & x<>y => x inter y = {};

  -- Is a set of sets a partition of a set?
  isPartition[@a]: set of set of @a * set of @a +> bool
  isPartition(ss,s) == pairwiseDisjoint[@a](ss) and dunion ss = s;

  -- All (sequence) permutations of a set.
  permutations[@a]: set1 of @a +> set1 of seq1 of @a
  permutations(s) ==
    cases s:
      {e} -> {[e]},
      -   -> dunion { { [e]^tail | tail in set permutations[@a](s\{e}) } | e in set s }
    end
  post -- for a set of size n, there are n! permutations
       card RESULT = prod({1,...,card s}) and
       forall sq in set RESULT & len sq = card s and elems sq = s
  measure size0;

  -- The cross product of two sets.
  xProduct[@a,@b]: set of @a * set of @b +> set of (@a * @b)
  xProduct(s,t) == { mk_(x,y) | x in set s, y in set t }
  post card RESULT = card s * card t;

  -- Create a string presentation of a set.
  format[@a]: (@a +> seq of char) * seq of char * set of @a +> seq of char
  format(f,sep,s) == cases s:
                       {}        -> "",
                       {x}       -> f(x),
                       t union u -> format[@a](f,sep,t) ^ sep ^ format[@a](f,sep,u)
                     end
  measure size3;

  -- Measure functions.

  size[@a]: set of @a +> nat
  size(s) == card s;

  size0[@a]: set1 of @a +> nat
  size0(s) == card s;

  size1[@a]: (@a * @a +> @a) * set1 of @a +> nat
  size1(-, s) == card s;

  size2[@a]: (@a * @a +> @a) * @a * set of @a +> nat
  size2(-, -, s) == card s;

  size3[@a]: (@a +> seq of char) * seq of char * set of @a +> nat
  size3(-, -, s) == card s;

end Set
~~~
{% endraw %}

### Char.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose types, constants and functions over
   characters and strings (sequences characters).

   All functions are explicit and executable. Where a non-executable condition adds value, it
   is included as a comment.
*/
module Char
imports from Seq all
exports types Upper
              Lower
              Letter
              Digit
              Octal
              Hex
              AlphaNum
              AlphaNumUpper
              AlphaNumLower
              Space
              WhiteSpace
              Phrase
              PhraseUpper
              PhraseLower
              Text
              TextUpper
              TextLower
        values SP, TB, CR, LF : char
               WHITE_SPACE, UPPER, LOWER, DIGIT, OCTAL, HEX : set of char
               UPPERS, LOWERS, DIGITS, OCTALS, HEXS: seq of char
        functions toLower: Upper +> Lower
                  toUpper: Lower +> Upper

definitions

types

  Upper = char
  inv c == c in set UPPER;

  Lower = char
  inv c == c in set LOWER;

  Letter = Upper | Lower;

  Digit = char
  inv c == c in set DIGIT;
  
  Octal = char
  inv c == c in set OCTAL;

  Hex = char
  inv c == c in set HEX;

  AlphaNum = Letter | Digit;

  AlphaNumUpper = Upper | Digit;

  AlphaNumLower = Lower | Digit;

  Space = char
  inv sp == sp = ' ';

  WhiteSpace = char
  inv ws == ws in set WHITE_SPACE;

  Phrase = seq1 of (AlphaNum|Space);

  PhraseUpper = seq1 of (AlphaNumUpper|Space);

  PhraseLower = seq1 of (AlphaNumLower|Space);

  Text = seq1 of (AlphaNum|WhiteSpace);

  TextUpper = seq1 of (AlphaNumUpper|WhiteSpace);

  TextLower = seq1 of (AlphaNumLower|WhiteSpace);

values

  SP:char = ' ';
  TB:char = '\t';
  CR:char = '\r';
  LF:char = '\n';
  WHITE_SPACE:set of char = {SP,TB,CR,LF};
  UPPER:set of char = {'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
                       'R','S','T','U','V','W','X','Y','Z'};
  UPPERS: seq of Upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  LOWER:set of char = {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q',
                       'r','s','t','u','v','w','x','y','z'};
  LOWERS: seq of Lower = "abcdefghijklmnopqrstuvwxyz";
  DIGIT:set of char = {'0','1','2','3','4','5','6','7','8','9'};
  DIGITS:seq of Digit = "0123456789";
  OCTAL:set of char = {'0','1','2','3','4','5','6','7'};
  OCTALS:seq of Octal = "01234567";
  HEX:set of char = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
  HEXS:seq of Hex = "0123456789ABCDEF";

functions

  -- Convert upper case letter to lower case.
  toLower: Upper +> Lower
  toLower(c) == LOWERS(Seq`indexOf[Upper](c,UPPERS))
  post toUpper(RESULT) = c;

  -- Convert lower case letter to upper case.
  toUpper: Lower +> Upper
  toUpper(c) == UPPERS(Seq`indexOf[Lower](c,LOWERS));
  --post toLower(RESULT) = c;

end Char
~~~
{% endraw %}

### ISO8601.vdmsl

{% raw %}
~~~
/*
   A model of dates, times, intervals and durations. Intended as a core library for use by
   higher level models that require dates and/or times and/or intervals and/or durations.

   The model is based on the ISO 8601 standard for representation of dates and times using
   the Gregorian calendar:

     https://en.wikipedia.org/wiki/ISO_8601

   For dates and times, this model largely conforms to the RFC 3339 profile:

     https://tools.ietf.org/html/rfc3339

   Exceptions to RFC 3339 are:
   - A seconds value of 60 (leap second) is not supported;
   - ISO 8601/RFC 3339 impose no limitation on the resolution of times; the finest granularity
     of this model is milliseconds.

   The model additionally supports a subset of the specification of time intervals and
   durations from ISO 8601. Those aspects supported are:
   - a duration is expressed as a number of milliseconds;
   - an interval is expressed as a start/end date/time value.

   All functions are explicit and executable. Where a non-executable condition adds value, it
   is included as a comment.

*/
module ISO8601
imports from Numeric all,
        from Set all,
        from Seq all
exports types struct Year;
              struct Month;
              struct Day;
              struct Hour;
              struct Minute;
              struct Second;
              struct Millisecond;
              struct Date;
              struct Time;
              struct TimeInZone;
              struct Offset;
              struct DTG;
              struct DTGInZone;
              struct Interval;
              Duration
        values MILLIS_PER_SECOND, SECONDS_PER_MINUTE, MINUTES_PER_HOUR, HOURS_PER_DAY, FIRST_YEAR, LAST_YEAR: nat;
               DAYS_PER_MONTH, DAYS_PER_MONTH_LEAP: map nat1 to nat1;
               MAX_DAYS_PER_MONTH, MONTHS_PER_YEAR, DAYS_PER_YEAR, DAYS_PER_LEAP_YEAR: nat1;
               FIRST_DATE, LAST_DATE: Date;
               FIRST_TIME, LAST_TIME: Time;
               FIRST_DTG, LAST_DTG: DTG;
               NO_DURATION, ONE_MILLISECOND, ONE_SECOND, ONE_MINUTE, ONE_HOUR, ONE_DAY, ONE_YEAR, ONE_LEAP_YEAR: Duration
        functions isLeap: Year +> bool;
                  daysInMonth: Year * Month +> nat1;
                  daysInYear: Year +> nat1;
                  dtgInRange: DTG * DTG * DTG +> bool;
                  inInterval: DTG * Interval +> bool;
                  dtgWithin: DTG * Duration * DTG +> bool;
                  overlap: Interval * Interval +> bool;
                  within: Interval * Interval +> bool;
                  add: DTG * Duration +> DTG;
                  subtract: DTG * Duration +> DTG;
                  diff: DTG * DTG +> Duration;
                  durAdd: Duration * Duration +> Duration;
                  durSubtract: Duration * Duration +> Duration;
                  durMultiply: Duration * nat +> Duration;
                  durDivide: Duration * nat +> Duration;
                  durDiff: Duration * Duration +> Duration;
                  durToMillis: Duration +> nat;
                  durFromMillis: nat +> Duration;
                  durToSeconds: Duration +> nat;
                  durFromSeconds: nat +> Duration;
                  durToMinutes: Duration +> nat;
                  durFromMinutes: nat +> Duration;
                  durModMinutes : Duration +> Duration;
                  durToHours: Duration +> nat;
                  durFromHours: nat +> Duration;
                  durModHours : Duration +> Duration;
                  durToDays: Duration +> nat;
                  durFromDays : nat +> Duration;
                  durModDays : Duration +> Duration;
                  durToMonth: Duration * Year +> nat;
                  durFromMonth: Year * Month +> Duration;
                  durUptoMonth: Year * Month +> Duration;
                  durToYear : Duration * Year +> nat;
                  durFromYear: Year +> Duration;
                  durUptoYear: Year +> Duration;
                  durToDTG: Duration +> DTG;
                  durFromDTG: DTG +> Duration;
                  durToDate: Duration +> Date;
                  durFromDate: Date +> Duration;
                  durToTime: Duration +> Time;
                  durFromTime: Time +> Duration;
                  durFromTimeInZone: TimeInZone +> Duration;
                  durFromInterval: Interval +> Duration;
                  finestGranularity: DTG * Duration +> bool;
                  finestGranularityI: Interval * Duration +> bool;
                  minDTG: set1 of DTG +> DTG;
                  maxDTG: set1 of DTG +> DTG;
                  minDate: set1 of Date +> Date;
                  maxDate: set1 of Date +> Date;
                  minTime: set1 of Time +> Time;
                  maxTime: set1 of Time +> Time;
                  minDuration: set1 of Duration +> Duration;
                  maxDuration: set1 of Duration +> Duration;
                  sumDuration: seq of Duration +> Duration;
                  instant: DTG +> Interval;
                  nextDateForYM: Date +> Date;
                  nextDateForDay: Date * Day +> Date;
                  previousDateForYM: Date +> Date;
                  previousDateForDay: Date * Day +> Date;
                  normalise: DTGInZone +> DTG;
                  normaliseTime: TimeInZone +> Time * [PlusOrMinus];
                  formatDTG: DTG +> seq of char;
                  formatDTGInZone: DTGInZone +> seq of char;
                  formatDate: Date +> seq of char;
                  formatTime: Time +> seq of char;
                  formatTimeInZone: TimeInZone +> seq of char;
                  formatInterval: Interval +> seq of char;
                  formatDuration: Duration +> seq of char

definitions

types

  -- A year: 0 = 0AD (or 1BC).
  Year = nat
  inv year == FIRST_YEAR <= year and year <= LAST_YEAR;

  -- A month in a year (January is numbered 1).
  Month = nat1
  inv month == month <= MONTHS_PER_YEAR;

  -- A day in a month.
  Day = nat1
  inv day == day <= MAX_DAYS_PER_MONTH;

  -- An hour in a day.
  Hour = nat
  inv hour == hour < HOURS_PER_DAY;

  -- A minute in an hour.
  Minute = nat
  inv minute == minute < MINUTES_PER_HOUR;

  -- A second in a minute.
  Second = nat
  inv second == second < SECONDS_PER_MINUTE;

  -- A millisecond in a second.
  Millisecond = nat
  inv milli == milli < MILLIS_PER_SECOND;

  -- A date is a triple (year/month/day).
  -- Day of month must be consistent with respect to year.
  Date :: year : Year
          month: Month
          day  : Day
  inv mk_Date(y,m,d) == d <= daysInMonth(y,m)
  ord mk_Date(y1,m1,d1) < mk_Date(y2,m2,d2) ==
        Seq`lexicographic[nat]([y1,m1,d1], [y2,m2,d2]);

  -- A Time consists of four elements (hours/minutes/seconds/milliseconds).
  Time :: hour  : Hour
          minute: Minute
          second: Second
          milli : Millisecond
  ord mk_Time(h1,m1,s1,l1) < mk_Time(h2,m2,s2,l2) ==
        Seq`lexicographic[nat]([h1,m1,s1,l1], [h2,m2,s2,l2]);

  -- A time in a zone consists of a time and a time zone offset.
  TimeInZone :: time  : Time
                offset: Offset
  eq t1 = t2 == normaliseTime(t1).#1 = normaliseTime(t2).#1
  ord t1 < t2 == normaliseTime(t1).#1 < normaliseTime(t2).#1;

  -- The timezone offset
  Offset :: delta: Duration
            pm   : PlusOrMinus
  inv os == -- Offset must be less than one day and an integral number of minutes.
            os.delta < ONE_DAY and durModMinutes(os.delta) = NO_DURATION
  eq mk_Offset(d1,o1) = mk_Offset(d2,o2) ==
       d1 = d2 and o1 = o2 or d1 = NO_DURATION and d2 = NO_DURATION;

  -- The direction of a time zone offset.
  PlusOrMinus = <PLUS> | <MINUS>;

  -- A DTG (date/time group) is a combined date and time.
  DTG :: date: Date
         time: Time
  ord mk_DTG(d1,t1) < mk_DTG(d2,t2) == d1 < d2 or d1 = d2 and t1 < t2;

  -- A date and time with time zone offset.
  DTGInZone :: date: Date
               time: TimeInZone
  inv mk_DTGInZone(date,time) ==
        let changeDay = normaliseTime(time).#2
        in -- Adjusted time must not be earlier than 0000-01-01T00:00:00Z.
           not (date = FIRST_DATE and changeDay = <PLUS>) and
           -- Adjusted time must not be later than 9999-12-31T23:59:59,999Z
           not (date = LAST_DATE and changeDay = <MINUS>)
  eq dtg1 = dtg2 == normalise(dtg1) = normalise(dtg2)
  ord dtg1 < dtg2 == normalise(dtg1) < normalise(dtg2);

  -- An interval is a pair of DTGs representing all time instants between the start (inclusive)
  -- and end (exclusive) values.
  Interval :: begins: DTG
              ends  : DTG
  inv ival == -- The start of the interval must be earlier than the end.
              ival.begins < ival.ends;

  -- Duration: a period of time in milliseconds.
  Duration :: dur: nat
  ord d1 < d2 == d1.dur < d2.dur;

values

  MILLIS_PER_SECOND:nat = 1000;
  SECONDS_PER_MINUTE:nat = 60;
  MINUTES_PER_HOUR:nat = 60;
  HOURS_PER_DAY:nat = 24;
  DAYS_PER_MONTH:map nat1 to nat1 = {1|->31, 2|->28, 3|->31, 4|->30, 5|->31, 6|->30,
                                     7|->31, 8|->31, 9|->30, 10|->31, 11|->30, 12|->31};
  DAYS_PER_MONTH_LEAP:map nat1 to nat1 = DAYS_PER_MONTH ++ {2|->29};
  MAX_DAYS_PER_MONTH:nat1 = Set`max[nat1](rng DAYS_PER_MONTH);
  MONTHS_PER_YEAR:nat1 = card dom DAYS_PER_MONTH;
  DAYS_PER_YEAR:nat1 = daysInYear(1); -- 1 is an arbitrary non-leap year.
  DAYS_PER_LEAP_YEAR:nat1 = daysInYear(4); -- 4 is an arbitrary leap year.
  FIRST_YEAR:nat = 0;
  LAST_YEAR:nat = 9999;
  FIRST_DATE:Date = mk_Date(FIRST_YEAR,1,1);
  LAST_DATE:Date = mk_Date(LAST_YEAR,12,31);
  FIRST_TIME:Time = mk_Time(0,0,0,0);
  LAST_TIME:Time = mk_Time(23,59,59,999);
  FIRST_DTG:DTG = mk_DTG(FIRST_DATE, FIRST_TIME);
  LAST_DTG:DTG = mk_DTG(LAST_DATE, LAST_TIME);
  NO_DURATION:Duration = durFromMillis(0);
  ONE_MILLISECOND:Duration = durFromMillis(1);
  ONE_SECOND:Duration = durFromSeconds(1);
  ONE_MINUTE:Duration = durFromMinutes(1);
  ONE_HOUR:Duration = durFromHours(1);
  ONE_DAY:Duration = durFromDays(1);
  ONE_YEAR:Duration = durFromDays(DAYS_PER_YEAR);
  ONE_LEAP_YEAR:Duration = durFromDays(DAYS_PER_LEAP_YEAR);

functions

  -- Is a year a leap year?
  isLeap: Year +> bool
  isLeap(year) == year rem 4 = 0 and (year rem 100 = 0 => year rem 400 = 0);

  -- The number of days in a month with respect to a year.
  daysInMonth: Year * Month +> nat1
  daysInMonth(year, month) ==
    if isLeap(year) then DAYS_PER_MONTH_LEAP(month) else DAYS_PER_MONTH(month);

  -- The number of days in a year.
  daysInYear: Year +> nat1
  daysInYear(year) == Seq`sum([daysInMonth(year,m) | m in set {1,...,MONTHS_PER_YEAR}]);

  -- Does a DTG fall between two given DTGs?
  -- Start is inclusive, end is exclusive.
  dtgInRange: DTG * DTG * DTG +> bool
  dtgInRange(dtg1, dtg2, dtg3) == dtg1 <= dtg2 and dtg2 < dtg3;

  -- Is a DTG within a specified duration of another DTG?
  dtgWithin: DTG * Duration * DTG +> bool
  dtgWithin(dtg, dur, target) ==
    inInterval(dtg, mk_Interval(subtract(target, dur), add(target, dur)));

  -- Does a DTG fall within an interval?
  inInterval: DTG * Interval +> bool
  inInterval(dtg, ival) == dtgInRange(ival.begins, dtg, ival.ends);

  -- Do two intervals overlap?
  overlap: Interval * Interval +> bool
  overlap(i1, i2) == i2.begins < i1.ends and i1.begins < i2.ends;
  --post RESULT = exists d:DTG & inInterval(d, i1) and inInterval(d, i2);

  -- Does one interval fall wholly within another interval?
  within: Interval * Interval +> bool
  within(i1, i2) == i2.begins <= i1.begins and i1.ends <= i2.ends;
  --post RESULT = forall d:DTG & inInterval(d, i1) => inInterval(d, i2);

  -- Increase a DTG by a duration.
  add: DTG * Duration +> DTG
  add(dtg, dur) == durToDTG(durAdd(durFromDTG(dtg), dur))
  post subtract(RESULT, dur) = dtg;

  -- Decrease a DTG by a duration.
  subtract: DTG * Duration +> DTG
  subtract(dtg, dur) == durToDTG(durDiff(durFromDTG(dtg), dur))
  pre dur <= durFromDTG(dtg);
  --post add(RESULT,dur) = dtg;

  -- The duration between two DTGs.
  diff: DTG * DTG +> Duration
  diff(dtg1, dtg2) == durDiff(durFromDTG(dtg1), durFromDTG(dtg2))
  post (dtg1 <= dtg2 => add(dtg1,RESULT) = dtg2) and
       (dtg2 <= dtg1 => add(dtg2,RESULT) = dtg1);

  -- Add two durations.
  durAdd: Duration * Duration +> Duration
  durAdd(d1, d2) == mk_Duration(d1.dur + d2.dur)
  --post durDiff(RESULT, d1) = d2 and durDiff(RESULT,d2) = d1;
  post durSubtract(RESULT, d1) = d2 and
       durSubtract(RESULT, d2) = d1;

  -- Subtract one duration from another.
  durSubtract: Duration * Duration +> Duration
  durSubtract(d1, d2) == mk_Duration(d1.dur - d2.dur)
  pre d1 >= d2;
  --post durAdd(RESULT, d2) = d1;

  -- Multiply a duration by a fixed amount.
  durMultiply: Duration * nat +> Duration
  durMultiply(d, n) == mk_Duration(d.dur * n)
  post durDivide(RESULT, n) = d;

  -- Divide a duration by a fixed amount.
  durDivide: Duration * nat +> Duration
  durDivide(d, n) == mk_Duration(d.dur div n);
  --post durMultiply(RESULT, n) <= d and d < durMultiply(RESULT, n+1);

  -- The difference between two durations.
  durDiff: Duration * Duration +> Duration
  durDiff(d1, d2) == mk_Duration(abs(d1.dur - d2.dur))
  post (d1 <= d2 => durAdd(d1,RESULT) = d2) and (d2 <= d1 => durAdd(d2,RESULT) = d1);

  -- The whole number of milliseconds in a duration.
  durToMillis: Duration +> nat
  durToMillis(d) == d.dur
  post durFromMillis(RESULT) = d;

  -- The duration of a number of milliseconds.
  durFromMillis: nat +> Duration
  durFromMillis(sc) == mk_Duration(sc);
  --post durToMillis(RESULT) = sc;

  -- The whole number of seconds in a duration.
  durToSeconds: Duration +> nat
  durToSeconds(d) == durToMillis(d) div MILLIS_PER_SECOND
  post durFromSeconds(RESULT) <= d and d < durFromSeconds(RESULT+1);

  -- The duration of a number of seconds.
  durFromSeconds: nat +> Duration
  durFromSeconds(sc) == durFromMillis(sc*MILLIS_PER_SECOND);
  --post durToSeconds(RESULT) = sc;

  -- The whole number of minutes in a duration.
  durToMinutes: Duration +> nat
  durToMinutes(d) == durToSeconds(d) div SECONDS_PER_MINUTE
  post durFromMinutes(RESULT) <= d and d < durFromMinutes(RESULT+1);

  -- The duration of a number of minutes.
  durFromMinutes: nat +> Duration
  durFromMinutes(mn) == durFromSeconds(mn*SECONDS_PER_MINUTE);
  --post durToMinutes(RESULT) = mn;

  -- Remove all whole minutes from a duration.
  durModMinutes : Duration +> Duration
  durModMinutes(d) == mk_Duration(d.dur rem ONE_MINUTE.dur)
  post RESULT < ONE_MINUTE;
  --exists n:nat & durAdd(durFromMinutes(n),RESULT) = d

  -- The whole number of hours in a duration.
  durToHours: Duration +> nat
  durToHours(d) == durToMinutes(d) div MINUTES_PER_HOUR
  post durFromHours(RESULT) <= d and d < durFromHours(RESULT+1);

  -- The duration of a number of hours.
  durFromHours: nat +> Duration
  durFromHours(hr) == durFromMinutes(hr*MINUTES_PER_HOUR);
  --post durToHours(RESULT) = hr;

  -- Remove all whole hours from a duration.
  durModHours : Duration +> Duration
  durModHours(d) == mk_Duration(d.dur rem ONE_HOUR.dur)
  post RESULT < ONE_HOUR;
  --exists n:nat & durAdd(durFromHours(n),RESULT) = d

  -- The whole number of days in a duration.
  durToDays: Duration +> nat
  durToDays(d) == durToHours(d) div HOURS_PER_DAY
  post durFromDays(RESULT) <= d and d < durFromDays(RESULT+1);

  -- The duration of a number of days.
  durFromDays: nat +> Duration
  durFromDays(dy) == durFromHours(dy*HOURS_PER_DAY);
  --post durToDays(RESULT) = dy;

  -- Remove all whole days from a duration.
  durModDays : Duration +> Duration
  durModDays(d) == mk_Duration(d.dur rem ONE_DAY.dur)
  post RESULT < ONE_DAY;
  --exists n:nat & durAdd(durFromDays(n),RESULT) = d

  -- The whole number of months in a duration (with respect to a year).
  durToMonth: Duration * Year +> nat
  durToMonth(dur, year) ==
    Set`max[Month]({ m | m in set {1,...,MONTHS_PER_YEAR} & durUptoMonth(year,m) <= dur }) - 1
  pre dur < durFromYear(year);

  -- The duration of a month (with respect to a year).
  durFromMonth: Year * Month +> Duration
  durFromMonth(year, month) == durFromDays(daysInMonth(year,month));

  -- The duration up to the start of a month (with respect to a year).
  durUptoMonth: Year * Month +> Duration
  durUptoMonth(year, month) == sumDuration([durFromMonth(year,m) | m in set {1,...,month-1}]);

  -- The whole number of years in a duration (starting from a reference year).
  durToYear : Duration * Year +> nat
  durToYear(dur, year) ==
    if dur < durFromYear(year)
    then 0
    else 1 + durToYear(durDiff(dur, durFromYear(year)), year+1)
  --post RESULT = Set`max({ y | y : Year & durUptoYear(year+y) <= dur })
  measure m_durToYear;

  -- The measure function for durToYear
  m_durToYear : Duration * Year +> nat
  m_durToYear(d,-) == d.dur;

  -- The duration of a year.
  durFromYear: Year +> Duration
  durFromYear(year) == durFromDays(daysInYear(year));

  -- The duration up to the start of a year.
  durUptoYear: Year +> Duration
  durUptoYear(year) == sumDuration([durFromYear(y) | y in set {FIRST_YEAR,...,year-1}]);

  -- The DTG corresponding to a duration.
  durToDTG: Duration +> DTG
  durToDTG(dur) == let dy = durFromDays(durToDays(dur))
                   in mk_DTG(durToDate(dy),durToTime(durDiff(dur,dy)))
  post durFromDTG(RESULT) = dur;

  -- The duration of a DTG (with respect to the start of time).
  durFromDTG: DTG +> Duration
  durFromDTG(dtg) == durAdd(durFromDate(dtg.date),durFromTime(dtg.time));
  --post durToDTG(RESULT) = dtg;

  -- The date corresponding to a duration.
  durToDate: Duration +> Date
  durToDate(dur) == let yr = durToYear(dur,FIRST_YEAR),
                        ydur = durDiff(dur, durUptoYear(yr)),
                        mn = durToMonth(ydur,yr)+1,
                        dy = durToDays(durDiff(ydur, durUptoMonth(yr,mn)))+1
                    in mk_Date(yr,mn,dy)
  post durFromDate(RESULT) <= dur and dur < durAdd(durFromDate(RESULT),ONE_DAY);

  -- The duration of a date (with respect to the start of time).
  durFromDate: Date +> Duration
  durFromDate(date) ==
    durAdd(durUptoYear(date.year),
           durAdd(durUptoMonth(date.year,date.month), durFromDays(date.day-1)));
  --post durToDate(RESULT) = date;

  -- The time corresponding to a duration.
  durToTime: Duration +> Time
  durToTime(dur) == let hr = durToHours(dur),
                        mn = durToMinutes(durDiff(dur,durFromHours(hr))),
                        hmd = durAdd(durFromHours(hr),durFromMinutes(mn)),
                        sc = durToSeconds(durDiff(dur,hmd)),
                        ml = durToMillis(durDiff(dur,durAdd(hmd,durFromSeconds(sc))))
                    in mk_Time(hr,mn,sc,ml)
  pre dur < ONE_DAY
  post durFromTime(RESULT) = dur;

  -- The duration of a time.
  durFromTime: Time +> Duration
  durFromTime(time) ==
    durAdd(durFromHours(time.hour),
           durAdd(durFromMinutes(time.minute),
                  durAdd(durFromSeconds(time.second),durFromMillis(time.milli))));
  --post durToTime(RESULT) = time;

  -- The duration of a time with respect to a time zone.
  durFromTimeInZone: TimeInZone +> Duration
  durFromTimeInZone(time) ==
    let ntime = normaliseTime(time).#1
    in durFromTime(ntime);
  --post durToTime(RESULT) = time;

  -- The duration of a time interval.
  durFromInterval: Interval +> Duration
  durFromInterval(i) == diff(i.begins, i.ends)
  post add(i.begins, RESULT) = i.ends;

  -- Is a DTG expressed no finer than a specified granularity.
  finestGranularity: DTG * Duration +> bool
  finestGranularity(dtg, dur) == durFromDTG(dtg).dur mod dur.dur = 0
  pre dur <> NO_DURATION;
  --post RESULT = exists n:nat & durMultiply(dur, n) = durFromDTG(dtg);

  -- Are the DTGs in an interval expressed no finer than a specified granularity.
  finestGranularityI: Interval * Duration +> bool
  finestGranularityI(i, dur) ==
    finestGranularity(i.begins, dur) and finestGranularity(i.ends, dur);

  -- The minimum DTG in a set.
  minDTG: set1 of DTG +> DTG
  minDTG(dtgs) == Set`min[DTG](dtgs)
  post RESULT in set dtgs and forall d in set dtgs & RESULT <= d;

  -- The maximum DTG in a set.
  maxDTG: set1 of DTG +> DTG
  maxDTG(dtgs) ==  Set`max[DTG](dtgs)
  post RESULT in set dtgs and forall d in set dtgs & RESULT >= d;

  -- The minimum Date in a set.
  minDate: set1 of Date +> Date
  minDate(dates) == Set`min[Date](dates)
  post RESULT in set dates and forall d in set dates & RESULT <= d;

  -- The maximum Date in a set.
  maxDate: set1 of Date +> Date
  maxDate(dates) ==  Set`max[Date](dates)
  post RESULT in set dates and forall d in set dates & RESULT >= d;

  -- The minimum Time in a set.
  minTime: set1 of Time +> Time
  minTime(times) == Set`min[Time](times)
  post RESULT in set times and forall t in set times & RESULT <= t;

  -- The maximum Time in a set.
  maxTime: set1 of Time +> Time
  maxTime(times) == Set`max[Time](times)
  post RESULT in set times and forall t in set times & RESULT >= t;

  -- The minimum Duration in a set.
  minDuration: set1 of Duration +> Duration
  minDuration(durs) == Set`min[Duration](durs)
  post RESULT in set durs and forall d in set durs & RESULT <= d;

  -- The maximum Duration in a set.
  maxDuration: set1 of Duration +> Duration
  maxDuration(durs) == Set`max[Duration](durs)
  post RESULT in set durs and forall d in set durs & RESULT >= d;

  -- The sum of a sequence of durations.
  sumDuration: seq of Duration +> Duration
  sumDuration(sd) == mk_Duration(Seq`sum([ d.dur | d in seq sd ]));

  -- An interval that represents an instant in time.
  instant: DTG +> Interval
  instant(dtg) == mk_Interval(dtg, add(dtg, ONE_MILLISECOND))
  post inInterval(dtg, RESULT);
       --and forall d:DTG & d = dtg <=> inInterval(d,RESULT);

  -- Given a date, find the next date on which the day of month is the same.
  nextDateForYM: Date +> Date
  nextDateForYM(date) == nextDateForDay(date, date.day);
  --post RESULT = minDate({ dt | dt:Date & dt > date and dt.day = date.day});

  -- Given a date and specific day, find the closest next date on which the day of month is the
  -- same as the specified day.
  nextDateForDay: Date * Day +> Date
  nextDateForDay(date, day) == nextYMDForDay(date.year, date.month, date.day, day)
  pre day <= MAX_DAYS_PER_MONTH;
  --post RESULT = minDate({ dt | dt:Date & dt > date and dt.day = day });

  -- Given a year/month/day, find the closest next date on which the day of month is the same.
  nextYMDForDay: Year * Month * Day * Day +> Date
  nextYMDForDay(yy, mm, dd, day) ==
    let nextm = if mm = MONTHS_PER_YEAR then 1 else mm+1,
        nexty = if mm = MONTHS_PER_YEAR then yy+1 else yy
    in if dd < day and day <= daysInMonth(yy, mm)
       then mk_Date(yy, mm, day)
       elseif day = 1
       then mk_Date(nexty, nextm, day)
       else nextYMDForDay(nexty, nextm, 1, day)
  pre dd <= daysInMonth(yy, mm)
  --post RESULT = minDate({ date | date:Date & date > mk_Date(yy, mm, dd) and
  --                                           date.day = day })
  measure m_nextYMDForDay;

  -- The measure function for nextYMDForDay
  m_nextYMDForDay: Year * Month * Day * Day +> nat
  m_nextYMDForDay(y,m,-,-) == ((LAST_YEAR+1)*MONTHS_PER_YEAR) - (y*MONTHS_PER_YEAR + m);

  -- Given a date, find the previous date on which the day of month is the same.
  previousDateForYM: Date +> Date
  previousDateForYM(date) == previousDateForDay(date, date.day);
  --post RESULT = maxDate({ dt | dt:Date & dt  date and dt.day = date.day });

  -- Given a date and specific day, find the closest previous date on which the day of month is
  -- the same as the specified day.
  previousDateForDay: Date * Day +> Date
  previousDateForDay(date, day) == previousYMDForDay(date.year, date.month, date.day, day)
  pre day <= MAX_DAYS_PER_MONTH;
  --post RESULT = maxDate({ dt | dt:Date & dt < date and dt.day = day });

  -- Given a date, find the closest later date on which the day of month is the same.
  previousYMDForDay: Year * Month * Day * Day +> Date
  previousYMDForDay(yy, mm, dd, day) ==
    let prevm = if mm > 1 then mm-1 else MONTHS_PER_YEAR,
        prevy = if mm > 1 then yy else yy-1
    in if day < dd
       then mk_Date(yy, mm, day)
       elseif day <= daysInMonth(prevy, prevm)
       then mk_Date(prevy, prevm, day)
       else previousYMDForDay(prevy, prevm, 1, day)
  pre dd <= daysInMonth(yy, mm)
  --post RESULT = maxDate({ date | date:Date & date < mk_Date(yy, mm, dd) and
  --                                           date.day = day })
  measure m_previousYMDForDay;

  -- The measure function for previousYMDForDay
  m_previousYMDForDay: Year * Month * Day * Day +> nat
  m_previousYMDForDay(y,m,-,-) == y*MONTHS_PER_YEAR + m;

  -- Normalise a DTG value such that it is expressed without time zone offset.
  -- Applying the offset may result in a change of date.
  -- Example: 2001-01-01T01:00+02:00 becomes 2000-12-31T23:00Z.
  normalise: DTGInZone +> DTG
  normalise(dtg) == let mk_(ntime,pm) = normaliseTime(dtg.time),
                        baseDtg = mk_DTG(dtg.date, ntime)
                    in cases pm:
                         <PLUS>  -> subtract(baseDtg, ONE_DAY),
                         <MINUS> -> add(baseDtg, ONE_DAY)
                       end;

  -- Normalise a time value with a time zone offset to the UTC value, wrapping across the day
  -- boundary. Return an indication if the normalisation pushes the time to a different day.
  -- Example: 01:00+02:00 (01:00, two hours ahead of UTC) becomes (23:00Z,<PLUS>) indicating
  -- the original time with offset is on the day after the UTC time.
  -- Similarly, 23:30-01:15 becomes (00:45,<MINUS>).
  normaliseTime: TimeInZone +> Time * [PlusOrMinus]
  normaliseTime(time) ==
    let utcTimeDur = durFromTime(time.time)
    in cases time.offset:
         mk_Offset(offset,<PLUS>)
           -> -- Zone offset ahead of UTC
              if offset <= utcTimeDur
              then -- No day change
                   mk_(durToTime(durSubtract(utcTimeDur,offset)), nil)
              else -- UTC time one day earlier
                   mk_(durToTime(durSubtract(durAdd(utcTimeDur,ONE_DAY),offset)),<PLUS>),
         mk_Offset(offset,<MINUS>)
           -> -- Zone offset behind UTC
              let adjusted = durAdd(utcTimeDur,offset)
              in if adjusted < ONE_DAY
                 then -- No day change
                      mk_(durToTime(adjusted),nil)
                 else -- UTC time one day later
                      mk_(durToTime(durSubtract(adjusted,ONE_DAY)),<MINUS>)
       end;

  -- Format a date and time as per ISO 8601.
  formatDTG: DTG +> seq of char
  formatDTG(dtg) == formatDate(dtg.date) ^ "T" ^ formatTime(dtg.time);

  -- Format a date and time with a time zone offset as per ISO 8601.
  formatDTGInZone: DTGInZone +> seq of char
  formatDTGInZone(dtg) == formatDate(dtg.date) ^ "T" ^ formatTimeInZone(dtg.time);

  -- Format a date as per ISO 8601.
  formatDate: Date +> seq of char
  formatDate(mk_Date(y,m,d)) ==
    Numeric`zeroPad(y,4) ^ "-" ^ Numeric`zeroPad(m,2) ^ "-" ^ Numeric`zeroPad(d,2);

  -- Format a time as per ISO 8601.
  formatTime: Time +> seq of char
  formatTime(mk_Time(h,m,s,l)) ==
    let frac = if l = 0 then "" else "," ^ Numeric`zeroPad(l,3)
    in Numeric`zeroPad(h,2) ^ ":" ^ Numeric`zeroPad(m,2) ^ ":" ^
       Numeric`zeroPad(s,2) ^ frac;

  -- Format a time with a time zone offset as per ISO 8601.
  formatTimeInZone: TimeInZone +> seq of char
  formatTimeInZone(mk_TimeInZone(time,o)) ==
    formatTime(time) ^ (if o.delta = NO_DURATION then "Z" else formatOffset(o));

  -- Format a time offset as per ISO 8601.
  formatOffset: Offset +> seq of char
  formatOffset(mk_Offset(dur,pm)) ==
    let hm = durToTime(dur),
        sign = if pm = <PLUS> then "+" else "-"
    in sign ^ Numeric`zeroPad(hm.hour,2) ^ ":" ^ Numeric`zeroPad(hm.minute,2);

  -- Format a DTG interval as per ISO 8601.
  formatInterval: Interval +> seq of char
  formatInterval(interval) == formatDTG(interval.begins) ^ "/" ^ formatDTG(interval.ends);

  -- Format a duration as per ISO 8601.
  formatDuration: Duration +> seq of char
  formatDuration(d) ==
    let numDays = durToDays(d),
        mk_Time(h,m,s,l) = durToTime(durModDays(d)),
        item: nat * char +> seq of char
        item(n,c) == if n = 0 then "" else Numeric`formatNat(n)^[c],
        itemSec: nat * nat +> seq of char
        itemSec(x,y) == Numeric`formatNat(x) ^ "." ^ Numeric`zeroPad(y,3) ^ "S",
        date = item(numDays,'D'),
        time = item(h,'H') ^ item(m,'M') ^ if l=0 then item(s,'S') else itemSec(s,l)
    in if date="" and time=""
       then "PT0S"
       else "P" ^ date ^ (if time="" then "" else "T" ^ time);

end ISO8601
~~~
{% endraw %}

### Ord.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose functions over orders.

   All definitions are explicit and executable.
*/
module Ord
exports functions min[@a]: @a * @a +> @a
                  minWith[@a]: (@a * @a +> bool) +> @a * @a +> @a
                  max[@a]: @a * @a +> @a
                  maxWith[@a]: (@a * @a +> bool) +> @a * @a +> @a

definitions

values

functions

  /*
    The function defined below a simple in nature, and of limited value in their own right.
    They can be used in other modules where it is necessary to pass min/max functions as
    arguments to other functions without the need to define auxiliary functions.
  */

  -- The minimum of two values.
  min[@a]: @a * @a +> @a
  min(x,y) == if x < y then x else y;
  -- pre The type parameter admits an order relation.

  -- The minimum of two values with respect to a relation.
  minWith[@a]: (@a * @a +> bool) +> @a * @a +> @a
  minWith(o)(x,y) == if o(x,y) then x else y;
  -- pre 'o' is a partial order relation.

  -- The maximum of two values.
  max[@a]: @a * @a +> @a
  max(x,y) == if y < x then x else y;
  -- pre The type parameter admits an order relation.

  -- The maximum of two values with respect to a relation.
  maxWith[@a]: (@a * @a +> bool) +> @a * @a +> @a
  maxWith(o)(x,y) == if o(y,x) then x else y;
  -- pre 'o' is a partial order relation.

end Ord
~~~
{% endraw %}

### Numeric.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose functions over numerics.

   All definitions are explicit and executable.
*/
module Numeric
imports from Seq all
exports functions differBy: real * real * real +> bool;
                  formatNat: nat +> seq1 of char;
                  decodeNat: seq1 of char +> nat;
                  fromChar: char +> nat;
                  toChar: nat +> char;
                  zeroPad: nat * nat1 +> seq1 of char;
                  min: real * real +> real;
                  max: real * real +> real;
                  less: real * real +> bool;
                  leq: real * real +> bool;
                  grtr: real * real +> bool;
                  geq: real * real +> bool;
                  add: real * real +> real;
                  mult: real * real +> real

definitions

values

  DIGITS:seq of char = "0123456789";

functions

  -- Do two numerics differ by at least a specified value.
  differBy: real * real * real +> bool
  differBy(x, y, delta) == abs (x-y) >= delta
  pre delta > 0;

  -- Format a natural number as a string of digits.
  formatNat: nat +> seq1 of char
  formatNat(n) == if n < 10
                  then [toChar(n)]
                  else formatNat(n div 10) ^ formatNat(n mod 10)
  measure size1;

  -- Create a natural number from a sequence of digit characters.
  decodeNat: seq1 of char +> nat
  decodeNat(s) == cases s:
                    [c] -> fromChar(c),
                    u^[c] -> 10*decodeNat(u)+fromChar(c)
                  end
  measure size2;

  -- Convert a character digit to the corresponding natural number.
  fromChar: char +> nat
  fromChar(c) == Seq`indexOf[char](c,DIGITS)-1
  pre c in set elems DIGITS
  post toChar(RESULT) = c;

  -- Convert a numeric digit to the corresponding character.
  toChar: nat +> char
  toChar(n) == DIGITS(n+1)
  pre n <= 9;
  --post fromChar(RESULT) = n

  -- Format a natural number as a string with leading zeros up to a specified length.
  zeroPad: nat * nat1 +> seq1 of char
  zeroPad(n,w) == Seq`padLeft[char](formatNat(n),'0',w);

  /*
    The following are simple functions that are of limited value in their own right.
    The are provided to allow them for example to serve as function arguments.
  */

  -- Sum of two numbers.
  add: real * real +> real
  add(m,n) == m+n;

  -- Product of two numbers.
  mult: real * real +> real
  mult(m,n) == m*n;

  -- The minimum of two numerics.
  min: real * real +> real
  min(x,y) == if x < y then x else y
  post RESULT in set {x,y} and RESULT <= x and RESULT <= y;

  -- The maximum of two numerics.
  max: real * real +> real
  max(x,y) == if x > y then x else y
  post RESULT in set {x,y} and RESULT >= x and RESULT >= y;

  -- Numeric less than.
  -- Useful for passing as a function argument.
  less: real * real +> bool
  less(x,y) == x < y;

  -- Numeric less than or equal.
  -- Useful for passing as a function argument.
  leq: real * real +> bool
  leq(x,y) == x <= y;

  -- Numeric greater than.
  -- Useful for passing as a function argument.
  grtr: real * real +> bool
  grtr(x,y) == x > y;

  -- Numeric greater than or equal.
  -- Useful for passing as a function argument.
  geq: real * real +> bool
  geq(x,y) == x >= y;

  -- Measure functions.

  size1: nat +> nat
  size1(n) == n;

  size2: seq1 of char +> nat
  size2(s) == len s;

end Numeric
~~~
{% endraw %}

