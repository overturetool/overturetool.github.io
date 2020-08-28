---
layout: default
title: SortingPP
---

## SortingPP
Author: Nick Battle


This example is a simple Sorting library with tests that are partly formed from combinatorial traces,
and partly from VDMUnit tests.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new TestAll().Run()|


### TypeTests.vdmpp

{% raw %}
~~~
/**
 * Test the Sort class with various type parameters.
 */
class TypeTests is subclass of TestCase
types
	Collation = seq of char
	inv c == card elems c = len c;		-- No duplicates in a collation sequence

	String = seq of char;				-- Strings can be empty (and sort *before* everything else)

values
	codeChars:Collation = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

	-- Collation sequence with numbers first
	backChars:Collation = "0123456789_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

functions
	valofCh: char * Collation -> nat1
	valofCh(c, collation) ==
		iota i in set inds collation & collation(i) = c
	pre c in set elems collation;

	lessCh: Collation -> char * char -> bool
	lessCh(collation)(a, b) ==
		valofCh(a, collation) < valofCh(b, collation);

	less: Collation -> String * String -> bool
	less(collation)(a, b) ==
		if a = [] and b = []
		then false
		else if a = [] or b = []
			then a = []
			else if a(1) <> b(1)
				then lessCh(collation)(a(1), b(1))
				else less(collation)(tl a, tl b)
	measure len a + len b;	-- Strictly decreasing

	ltint: int * int -> bool
	ltint(a, b) ==
		a < b;

	shorter: seq of char * seq of char -> bool
	shorter(a, b) ==
		len a < len b;


	-- Test functions for various types.

	test1: seq of int -> seq of int
	test1(list) == Sort`sort[int](list, ltint);

	test2: seq of seq of char -> seq of seq of char
	test2(list) == Sort`sort[seq of char](list, shorter);

	test3: seq of String -> seq of String
	test3(list) == Sort`sort[String](list, less(codeChars));

	test4: seq of char -> seq of char
	test4(list) == Sort`sort[char](list, lessCh(codeChars));

	test5: seq of char -> seq of char
	test5(list) == Sort`sort[char](list, lessCh(backChars));

operations
	protected runTest : () ==> ()
	runTest() ==
	(
		Assert`assertTrue("Integer sort1 failed!", test1([1,4,2,5,3,7,6,8]) = [1,2,3,4,5,6,7,8]);
		Assert`assertTrue("Length sort2 failed!", test2(["five", "two", "three"]) = ["two", "five", "three"]);
		Assert`assertTrue("String sort3 failed!", test3(["A", "BB", "c", ""]) = ["", "A", "BB", "c"]);
		Assert`assertTrue("Char sort4 failed!", test4("xyz123ABC") = "ABCxyz123");
		Assert`assertTrue("Char sort5 failed!", test5("abc123XYZ") = "123abcXYZ")
	)

traces
	SortInts:
		let V = {1,2,3,4,5} in
		let v1 in set V in
		let v2 in set V \ {v1} in
		let v3 in set V \ {v1, v2} in
		let v4 in set V \ {v1, v2, v3} in
		let v5 in set V \ {v1, v2, v3, v4} in
			test1([v1, v2, v3, v4, v5]);

	SortLengths:
		let V = {"abc", "ABC", "def", "ggdgdg", "zzz"} in
		let v1 in set V in
		let v2 in set V \ {v1} in
		let v3 in set V \ {v1, v2} in
		let v4 in set V \ {v1, v2, v3} in
		let v5 in set V \ {v1, v2, v3, v4} in
			test2([v1, v2, v3, v4, v5]);

	SortStrings:
		let V = {"abc", "ABC", "def", "ggdgdg", "zzz"} in
		let v1 in set V in
		let v2 in set V \ {v1} in
		let v3 in set V \ {v1, v2} in
		let v4 in set V \ {v1, v2, v3} in
		let v5 in set V \ {v1, v2, v3, v4} in
			test3([v1, v2, v3, v4, v5]);

	SortChars:
		let V = {'d', 'j', 'r', 's', 'w'} in
		let v1 in set V in
		let v2 in set V \ {v1} in
		let v3 in set V \ {v1, v2} in
		let v4 in set V \ {v1, v2, v3} in
		let v5 in set V \ {v1, v2, v3, v4} in
			test4([v1, v2, v3, v4, v5]);

	SortRevChars:
		let V = {'d', 'j', 'r', 's', 'w'} in
		let v1 in set V in
		let v2 in set V \ {v1} in
		let v3 in set V \ {v1, v2} in
		let v4 in set V \ {v1, v2, v3} in
		let v5 in set V \ {v1, v2, v3, v4} in
			test5([v1, v2, v3, v4, v5]);

end TypeTests
~~~
{% endraw %}

### TestAll.vdmpp

{% raw %}
~~~
/**
 * Execute all of the VDMUnit tests.
 */
class TestAll
operations
	public Run: () ==> ()
	Run() ==
		let ts : TestSuite = new TestSuite(),
			result = new TestResult() 
		in
		(
			ts.addTest(new TypeTests());
			ts.addTest(new StableTests());
			ts.run(result);
			IO`println(result.toString());
		);

end TestAll
~~~
{% endraw %}

### Sort.vdmpp

{% raw %}
~~~
/**
 * Implements a polymorphic quicksort for arbitrary types with a less function.
 */
class Sort
functions
	equals[@T]: @T * @T * (@T * @T -> bool) -> bool
	equals(a, b, less) ==
		not less(a, b) and not less(b, a);

	public sort[@T]: seq of @T * (@T * @T -> bool) -> seq of @T
	sort(l, less) ==
		cases l:
			[] -> [],

			[x] -> [x],

			[x, y] -> if less(y, x)
					  then [y, x]
					  else [x, y],	-- NB, stable for equality

			-^[x]^- ->  sort[@T]([y | y in seq l & less(y, x)], less) ^
						         [y | y in seq l & equals[@T](y, x, less) ] ^
						sort[@T]([y | y in seq l & less(x, y)], less)
		end

	post bagOf[@T](l) = bagOf[@T](RESULT) and	-- Permutation
		forall i in set {1, ..., len RESULT - 1} &
			not less(RESULT(i+1), RESULT(i))	-- Sorted!

	measure len l;	-- Strictly decreasing

	bagOf[@T]: seq of @T -> map @T to nat
	bagOf(s) ==
		{ i |-> occurs[@T](i, s) | i in set elems s }
	post dom RESULT = elems s and sizeOfBag[@T](RESULT) = len s;

	sizeOfBag[@T]: map @T to nat -> nat
	sizeOfBag(b) ==
		if b = {|->}
		then 0
		else let e in set dom b in b(e) + sizeOfBag[@T]({e} <-: b)
	measure card dom b;	-- Strictly decreasing

	occurs[@T]: @T * seq of @T -> nat
	occurs(e, s) ==
		if s = [] then 0
		else (if e = hd s then 1 else 0) + occurs[@T](e, tl s)
	measure len s;	-- Strictly decreasing

end Sort
~~~
{% endraw %}

### StableTests.vdmpp

{% raw %}
~~~
/**
 * Test that the Sort class is a stable sort (the order of "equal" items is preserved).
 */
class StableTests is subclass of TestCase
types
	R ::
		ordered	: nat
		ignored	: nat;

values
	S1 = [mk_R(1,1), mk_R(2,2), mk_R(1,3), mk_R(2,4), mk_R(1,5), mk_R(2,6)]

functions
	lessR: R * R -> bool
	lessR(a, b) ==
		a.ordered < b.ordered;	-- Only depends on one field, to check for stable sorting

	test1: seq of R -> seq of R
	test1(s) == Sort`sort[R](s, lessR)

	pre forall i, j in set inds s &
		(i < j) => (s(i).ignored < s(j).ignored)

	post forall i, j in set inds RESULT &
		(RESULT(i).ordered = RESULT(j).ordered and i < j) => (RESULT(i).ignored < RESULT(j).ignored);

operations
	protected runTest : () ==> ()
	runTest() ==
		Assert`assertTrue("StableTests failed",
			test1(S1) = [mk_R(1,1), mk_R(1,3), mk_R(1,5), mk_R(2,2), mk_R(2,4), mk_R(2,6)]);

traces
	StabilityTest :
		let S = {1, ..., 5} in
		let a, b, c, d, e in set S in
		let A = [ mk_R(a, 1), mk_R(b, 2), mk_R(c, 3), mk_R(d, 4), mk_R(e, 5) ] in
			test1(A);

end StableTests
~~~
{% endraw %}

