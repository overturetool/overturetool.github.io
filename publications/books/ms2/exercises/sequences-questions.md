---
layout: default
title: Modelling Systems Using Sequences
---

## Modelling Systems: Additional Exercises on Sequences
Exercises 2 & 3 are based on those supplied by Prof. Janusz Laski from Oakland University.

### Basic Exercises

1. Evaluate the following expressions:
 1. `[x | x in set {2,...,5} & x > 2]`
 2. `[x | x in set {3,5,2,4} & x*x < 22]`
2. Express the following in VDM-SL:
 1. The sequence `L` has less than 5 distinct elements.
 2. The sequence `L` has no duplicated elements.
 3. The sequences `L1` and `L2` are non-empty and are disjoint (i.e. they have no elements in common).
3. Write an explicit function definition for the `inds` operator.
4. If L is of type `seq of (seq of nat)`, write an expression which says that all the sequences in L are disjoint.

### Arrays

Given are two arrays A[1..N] and B[1..N]. Translate the following into VDM-SL predicates and test them so both the true and false values will be returned.

1. No value in A between j and k is in B between k+1 and N.
2. Array A stores the first N perfect squares in the reversed order (exclude 0).A ConSet? is a non-empty collection of distinct, non-empty collections of values of type A.

HINT: Model the arrays as sequences.

### Lines

In the following, consider a line as a sequence of characters.
Specify and test the function

~~~
NumOfOccurr: ? -> ? 
~~~

that returns the number of occurrences of character `x` in sequence `p` of type `Line`.
Specify and test the function

~~~
NumOfDistinctEls: ? -> ? 
~~~

that returns the number of distinct elements in `p` of type `Line`.
Specify and test function

~~~
Distance: ? * ? 
~~~

which, given `p` and `q` of type `Line`, returns the number of distinct characters that are either in `p` or in `q` but not in both.

### Average
Define the function `Average` to take a sequence of real numbers and return the average of those numbers.

### Reversing sequences
Define a function which reverses a sequence. Make two definitions: one using recusrsion and one using sequence comprehension.

### Store manager for chemical waste (again)
Let's revisit the solution made to Exercise 5 on sets and see how an alternative model using sequences would look.

1. Up to now, we have ignored the fact that vessels are stored in a rack in some order. Define the data types from Exercise 2 again, this time with vessels stored in sequence. Do you need to add any further restrictions? (Hint - what are the differences between sets and sequences?)
2. Briefly sketch the main changes you have to make to the functions defined in Question 5.2 for sets in order to accommodate the use of sequences. Don't repeat any unchanged functions.