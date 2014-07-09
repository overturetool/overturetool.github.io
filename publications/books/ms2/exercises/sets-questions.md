---
layout: default
title: Modelling Systems Using Sets
---

## Modelling Systems: Additional Exercises on Modelling with Sets

Exercises 2 & 3 are based on those supplied by Prof. Dines Bjørner of the Technical University of Denmark, whose assistance is gratefully acknowledged.

### Basic Exercises

1. Evaluate the following expressions:
 1. `{x | x in set {2,...,5} & x > 2}`
 2. `{x | x in set {2,...,5} & x*x > 22}`
 3. `dunion{ {1,2},{1,5,6},{3,4,6}}`
 4. `dinter{ {1,2},{1,5,6},{3,4,6}}`
2. Express the following in VDM-SL:
 1. The set s has less than 5 elements.
 2. The class of even integers.
 3. The set of even integers less than 30.
 4. The sets s1 and s2 are non-empty and disjoint (i.e. they have no elements in common).
 5. The elements contained in both s1 and s2 are also in s3.
3. Write an explicit function definition for the set difference operator.
4. If s is of type set of `(set of nat)`, write an expression which says that all the sets in s are disjoint.

### Connected Sets

1. A ConSet is a non-empty collection of distinct, non-empty collections of values of type A. Define a type ConSet to represent ConSets.
2. A "tightly connected" ConSet is a set of sets such that every set element shares at least one A-value with every other set element. Define a Boolean function TC which tests a ConSet to see if it is tightly connected or not.
An "n-connected" ConSet is a set of sets such that every set share at least one object with exactly n other set elements. Define a Boolean function NC which tests a ConSet for "n-connectedness".
A non-trivial "ring-connected" ConSet is a set of sets such that there is a cyclic ordering of all the elements such that only pairs of adjacent sets share A values.
3. Define a Boolean function RC which tests for the above property. (Hint: use recursion).

### Equivalence recordings

1. An equivalence class recording is a non-empty set of non-empty distinct, non-overlapping sets of elements. The representation of elements is immaterial. Define the type of such partitionings and, if needed, an appropriate invariant. Define a value belonging to this type which puts 1 and 2 in one equivalence class, 3 alone in another equivalence class and 4, 5 and 6 in the last equivalence class.
2. A marked partitioning is a non-empty set of pairs, each pair consists of a distinct object and a set of objects such that the first object is not a member of any (second) set of the marked partitioning, and such that all such sets have no elements in common. Define the type of such marked partitionings and, if needed, an appropriate invariant.
3. Define two functions: one which given a well-formed marken partitioning produces a "corresponding" equivalence class recording, and one which given a well-formed equivalence recording generates the set of all possible "correspondig" marked partitions. In order to define the second function it is neccesary to use a match value pattern and set patterns. No examples have been given for this in the book but these kind of patterns are described in the appendix.

"Correspondance" is defined as follows: a marked partitioning corresponds to an equivalence class recording if by turning each pair of the former into a set whose elements are those of its components and by doing this for all such pairs one gets the equivalence recording.

### A Thesaurus

Write a model of a thesaurus. A thesaurus is a collection of groups of words of similar meanings. For example, the Oxford Thesaurus groups the following words together: formal, aloof, ceremonious, civil, dignified, distant, dress, dressy, icy, impersonal, literary, nominal, official, outward, perfunctory, priggish, polite, ... The thesaurus system should have a data structure which models the collections of words along with an invariant recording the restriction that no word should appear in more than one collection (this is a slightly simplistic assumption, but is a useful one for the exercise).

Define functions to effect the following commands:

1. Add a word to a grouping in the thesaurus. The user will supply a word already in the thesaurus and a new word with a similar meaning. Remember to ensure that the invariant is respected.
2. Remove a word form the thesaurus. The user will supply the word to be removed.
3. Return the words which have a similar meaning to a given word.
4. Return the number of words which have a similar meaning to a given word.

### Store manager for chemical waste

This exercise is related to the explosives storage example, but is actually inspired by work of Alexandria Walker on a formal model of storage placement and control software. The model concerns a store manager for chemical waste. Waste is stored in vessels. Each vessel has a unique identifier, a material type related to the volatility of the waste (hot, warm or cold) and a quantity of waste contained in the vessel. Formally, this is expressed in the following type definitions:

~~~
types
   Vessel :: vid      : VId
             material : MaterialType
             quantity : real;

   MaterialType = <Hot> | <Warm> | <Cold>;
~~~
   
Vessels are stored in racks. Each rack has a unique identifier, a collection of vessels in it and a maximum capacity (i.e. the maximum number of vessels that can be accommodated).

~~~
   Rack :: rid      : Rid
          contents : set of Vessel
          capacity : nat;
~~~
		  
A complete store is a collection of racks:

~~~
  Store = set of Rack;
~~~
  
The identifier types are immaterial:

~~~
  Vid = token; 
  Rid = token 
~~~
  
Now try the following:

1. Record the following restrictions in the storage model:
 1. No two racks in a store have the same identifier.
 2. No two vessels in a store have the same identifier.
 3. No rack has more vessels in it that its capacity allows.
 4. At most one vessel in a rack contains hot material.
2. We need some way of finding places for vessels in the store so that the restrictions above continue to be respected. Define the following functions:
 1. Create an empty store.
 2. Get the identifiers of all the vessels in a store.
 3. Given a rack, return true if the rack is full up, false otherwise.
 4. A rack is "viable" for storage of a vessel if the restrictions in 2.1 (c) and (d) will be respected if the vessel is added to the rack. Define a boolean function "viable" that returns true if a given rack is viable for storage of a given vessel and and returns false otherwise.
 5. Define a function "safe-place" which, given a store and a vessel, returns a viable rack from the store for the vessel. The function should return the value nil if no viable rack exists in the store.
 6. Define a function "place" which places a vessel in a given rack in the store. Use a pre-condition to ensure that the rack is viable and that no other vessel with the same identifier already exists in the store.