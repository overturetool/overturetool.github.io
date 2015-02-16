---
layout: default
title: The VDM languages
---

## The VDM Specification Language
<!--
*TBD see wiki pedia [wiki](http://en.wikipedia.org/wiki/Vienna_Development_Method)*

- VDM-SL: the VDM Specification Language,
  [ISO/IEC 13817-1:1996](http://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=22988),
  with extensions for modules

## The Object-oriented extension

- VDM-PP: Object oriented extension of VDM-SL, also known as VDM++

## The Real-Time extension

- VDM-RT: Extension of VDM++ for specifying real-time and distributed
  systems. Draft content below.
      -->

The complete VDM-10 Language Manual can be downloaded [here.]({{ site.url }}/files/VDM10_lang_man.pdf)	  
  

VDM Features
------------

The VDM-SL and VDM++ syntax and semantics are described at length in the VDMTools language manuals and in the available texts. The ISO Standard contains a formal definition of the language's semantics. In the remainder of this article, the ISO-defined interchange (ASCII) syntax is used. Some texts prefer a more concise mathematical syntax.

A VDM-SL model is a system description given in terms of the functionality performed on data. It consists of a series of definitions of data types and functions or operations performed upon them.

### Basic Types: numeric, character, token and quote types

VDM-SL includes basic types modelling numbers and characters as follows:

| Basic Types |||
| ------------- |:-------------:| -----:|
| `bool`|Boolean datatype|`false, true`|
| `nat` |natural numbers (including zero)|0, 1, 2, 3, ...|
| `nat1`| natural numbers (excluding zero)| 1, 2, 3, 4, ...|
| `int`| integers| ..., -3, -2, -1, 0, 1, 2, 3, ...|
| `rat`| rational numbers| a/b, where a and b are integers, b is not 0|
| `real`| real numbers| ...|
| `char`| characters| `A, B, C, ...`|
|`token`| structureless tokens| ...|
|`<A>`|the quote type containing the value `<A>`|...|


Data types are defined to represent the main data of the modelled system. Each type definition introduces a new type name and gives a representation in terms of the basic types or in terms of types already introduced. For example, a type modelling user identifiers for a log-in management system might be defined as follows:

~~~
types UserId = nat
~~~

For manipulating values belonging to data types, operators are defined on the values. Thus, natural number addition, subtraction etc. are provided, as are Boolean operators such as equality and inequality. The language does not fix a maximum or minimum representable number or a precision for real numbers. Such constraints are defined where they are required in each model by means of data type invariants - Boolean expressions denoting conditions that must be respected by all elements of the defined type. For example a requirement that user identifiers must be no greater than 9999 would be expressed as follows (where `<=` is the "less than or equal to" Boolean operator on natural numbers):

~~~
UserId = nat inv uid == uid <= 9999
~~~

Since invariants can be arbitrarily complex logical expressions, and membership of a defined type is limited to only those values satisfying the invariant, type correctness in VDM-SL is not automatically decidable in all situations.

The other basic types include char for characters. In some cases, the representation of a type is not relevant to the model's purpose and would only add complexity. In such cases, the members of the type may be represented as structureless tokens. Values of token types can only be compared for equality - no other operators are defined on them. Where specific named values are required, these are introduced as quote types. Each quote type consists of one named value of the same name as the type itself. Values of quote types (known as quote literals) may only be compared for equality.

For example, in modelling a traffic signal controller, it may be convenient to define values to represent the colours of the traffic signal as quote types:

~~~
<Red>, <Amber>, <FlashingAmber>, <Green>
~~~

### Type Constructors: Union, Product and Composite Types

The basic types alone are of limited value. New, more structured data types are built using type constructors.

##### Basic Type Constructors

* Union of types `T1,...,Tn`: `T2 | ... | Tn`
* Cartesian product of types `T1,...,Tn`: `T1*T2*...*Tn`
* Composite (Record) type: `T :: f1:T1 ... fn:Tn`

The most basic type constructor forms the union of two predefined types. The type `(A|B)` contains all elements of the type A and all of the type `B`. In the traffic signal controller example, the type modelling the colour of a traffic signal could be defined as follows:

~~~
SignalColour = <Red> | <Amber> | <FlashingAmber> | <Green>
~~~

Enumerated types in VDM-SL are defined as shown above as unions on quote types.

Cartesian product types may also be defined in VDM-SL. The type `(A1*...*An)` is the type composed of all tuples of values, the first element of which is from the type `A1` and the second from the type `A2` and so on. The composite or record type is a Cartesian product with labels for the fields. The type

~~~
T :: f1:A1 f2:A2 ... fn:An
~~~

is the Cartesian product with fields labelled `f1,...,fn`. An element of type `T` can be composed from its constituent parts by a constructor, written `mk_T`. Conversely, given an element of type `T`, the field names can be used to select the named component. For example, the type

~~~
Date :: day:nat1 month:nat1 year:nat inv mk_Date(d,m,y) == d <=31 and m<=12
~~~

models a simple date type. The value `mk_Date(1,4,2001)` corresponds to 1 April 2001. Given a date `d`, the expression `d.month` is a natural number representing the month. Restrictions on days per month and leap years could be incorporated into the invariant if desired. Combining these:

~~~
mk_Date(1,4,2001).month = 4
~~~

### Collections

Collection types model groups of values. Sets are finite unordered collections in which duplication between values is suppressed. Sequences are finite ordered collections (lists) in which duplication may occur and mappings represent finite correspondences between two sets of values.

#### Sets

The set type constructor (written `set of T` where `T` is a predefined type) constructs the type composed of all finite sets of values drawn from the type `T`. For example, the type definition

~~~
UGroup = set of UserId
~~~

defines a type `UGroup` composed of all finite sets of `UserId` values. Various operators are defined on sets for constructing their union, intersections, determining proper and non-strict subset relationships etc.

##### Main Operators on Sets (s, s1, s2 are sets)

* Set enumeration: the set of elements `a`, `b` and `c`: `{a, b, c}`
* Set comprehension: the set of `x` from type `T` such that `P(x)`: `{x | x:T & P(x)}`
* The set of integers in the range `i` to `j`: `{i, ..., j}`
* Set membership, `e` is an element of set `s`: `e in set s`
* Not a member of, `e` is not an element of set `s`: `e not in set s`
* Union of sets `s1` and `s2`: `s1 union s2`
* Intersection of sets `s1` and `s2`: `s1 inter s2`
* Set difference of sets `s1` and `s2`: `s1 \ s2`
* Distributed union of set of sets `s`: `dunion s`
* Proper subset, s1 is a (proper) subset of `s2`: `s1 psubset s2`
* (weak) subset, s1 is a (weak) subset of `s2`: `s1 subset s2`
* The cardinality of set `s`: `card s`


#### Sequences

The finite sequence type constructor (written `seq of T` where `T` is a predefined type) constructs the type composed of all finite lists of values drawn from the type `T`. For example, the type definition

~~~
String = seq of char
~~~

Defines a type `String` composed of all finite strings of characters. Various operators are defined on sequences for constructing concatenation, selection of elements and subsequences etc. Many of these operators are partial in the sense that they are not defined for certain applications. For example, selecting the 5th element of a sequence that contains only three elements is undefined.

The order and repetition of items in a sequence is significant, so `[a, b]` is not equal to `[b, a]`, and `[a]` is not equal to `[a, a]`.

##### Main Operators on Sequences (s, s1,s2 are sequences)

* Sequence enumeration: the sequence of elements `a`, `b` and `c`: `[a, b, c]`
* Sequence comprehension: sequence of expressions `f(x)` for each `x` of (numeric) type `T` such that `P(x)` holds 
(`x` values taken in numeric order): `[f(x) | x:T & P(x)]`
* The head (first element) of `s`: `hd s`
* The tail (remaining sequence after head is removed) of `s`: `tl s`
* The length of `s`: `len s`
* The set of elements of `s`: `elems s`
* The `i`^th^ element of `s`: `s(i)`
* The set of indices for the sequence `s`: `inds s`
* The sequence formed by concatenating sequences `s1` and `s2`: `s1^s2`


#### Maps

A finite mapping is a correspondence between two sets, the domain and range, with the domain indexing elements of the range. It is therefore similar to a finite function. The mapping type constructor in VDM-SL (written `map T1 to T2` where `T1` and `T2` are predefined types) constructs the type composed of all finite mappings from sets of `T1` values to sets of `T2` values. For example, the type definition

~~~
Birthdays = map String to Date
~~~

Defines a type `Birthdays` which maps character strings to `Date`. Again, operators are defined on mappings for indexing into the mapping, merging mappings, overwriting extracting sub-mappings.

##### Main Operators on Mappings

* Mapping enumeration: `a` maps to `r`, `b` maps to `s`: `{a |-> r, b |-> s}`
* Mapping comprehension: `x` maps to `f(x)` for all `x` for type `T` such that `P(x)`: `{x |-> f(x) | x:T & P(x)}`
* The domain of `m`: `dom m`
* The range of `m`: `rng m`
* Application, `m` applied to `x`: `m(x)`
* Union of mappings `m1` and `m2` (`m1`, `m2` must be consistent where they overlap): `m1 munion m2`
* Override, `m1` overwritten by `m2`: `m1 ++ m2`


### Structuring

The main difference between the VDM-SL and VDM++ notations are the way in which structuring is dealt with. In VDM-SL there is a conventional modular extension whereas VDM++ has a traditional object-oriented structuring mechanism with classes and inheritance.

#### Structuring in VDM-SL

In the ISO standard for VDM-SL there is an informative annex that contains different structuring principles. These all follow traditional information hiding principles with modules and they can be explained as:

-   **Module naming**: Each module is syntactically started with the keyword `module` followed by the name of the module. At the end of a module the keyword `end` is written followed again by the name of the module.
-   **Importing**: It is possible to import definitions that has been exported from other modules. This is done in an *imports section* that is started off with the keyword `imports` and followed by a sequence of imports from different modules. Each of these module imports are started with the keyword `from` followed by the name of the module and a module signature. The *module signature* can either simply be the keyword `all` indicating the import of all definitions exported from that module, or it can be a sequence of import signatures. The import signatures are specific for types, values, functions and operations and each of these are started with the corresponding keyword. In addition these import signatures name the constructs that there is a desire to get access to. In addition optional type information can be present and finally it is possible to *rename* each of the constructs upon import. For types one needs also to use the keyword `struct` if one wish to get access to the *internal structure* of a particular type.
-   **Exporting**: The definitions from a module that one wish other modules to have access to are exported using the keyword `exports` followed by an exports module signature. The *exports module signature* can either simply consist of the keyword `all` or as a sequence of export signatures. Such *export signatures* are specific for types, values, functions and operations and each of these are started with the corresponding keyword. In case one wish to export the internal structure of a type the keyword `struct` must be used.
-   **More exotic features**: In earlier versions of the VDM-SL tools there was also support for parameterized modules and instantiations of such modules. However, these features was taken out of VDMTools around 2000 because they was hardly ever used in industrial applications and there was a substantial number of tool challenges with these features.

#### Structuring in VDM++

In VDM++ structuring are done using classes and multiple inheritance. The key concepts are:

-   **Class**: Each class is syntactically started with the keyword `class` followed by the name of the class. At the end of a class the keyword `end` is written followed again by the name of the class.
-   **Inheritance**: In case a class inherits constructs from other classes the class name in the class heading can be followed by the keywords `is subclass of` followed by a comma-separated list of names of superclasses.
-   **Access modifiers**: Information hiding in VDM++ is done in the same way as in most object oriented languages using access modifiers. In VDM++ definitions are per default private but in front of all definitions it is possible to use one of the access modifier keywords: `private`, `public` and `protected`.


#### The VDM-RT extension of VDM++ 

The VDM-RT extensions can be summarised as:
- **System Composition:** A system class has been introduced as a first class citizen to the language, which is composed of one or more processors which are connected by one or more communication channels. In this way it is possible to explore the performance of the overall system based on the capacities of the hardware and an abstract model of the desired functionality. Potential bottlenecks can be found at a very early stage of the design.
- **Deployment of functionality:** A set of special predefined classes, BUS and CPU, are made available to construct the distributed architecture in the model. The system class is used to contain such an architecture model. Regular user-defined VDM++ classes can be instantiated and deployed on a specific CPU in the model. The communication topology between the computation resources in the model can be described using the BUS class.
- **Asynchronous operations:** The VDM++ notation is extended with an async keyword in the signature of an operation to denote that an operation is asynchronous. The caller shall no longer be blocked; it can immediately resume its own thread of control after the call is initiated. A new thread is created and started immediately to execute the body of the asynchronous operation.
- **Special timing instructions:** In the timed version of VDM++ each instruction has its own time characteristics. However, these default values can be overwritten using either a duration or a cycles statement to specify time delays that are independent or dependent of the processor capacity respectively. The time delay incurred by the message transfer over the BUS is made dependent on the size of the message being transferred, which is a function of the parameter values passed to the operation call.

Modelling functionality
-----------------------

### Functional modelling

In VDM-SL, functions are defined over the data types defined in a model. Support for abstraction requires that it should be possible to characterize the result that a function should compute without having to say how it should be computed. The main mechanism for doing this is the *implicit function definition* in which, instead of a formula computing a result, a logical predicate over the input and result variables, termed a *postcondition*, gives the result's properties. For example, a function `SQRT` for calculating a square root of a natural number might be defined as follows:

~~~
SQRT(x:nat) r:real 
	post r*r = x
~~~

Here the postcondition does not define a method for calculating the result `r` but states what properties can be assumed to hold of it. Note that this defines a function that returns a valid square root; there is no requirement that it should be the positive or negative root. The specification above would be satisfied, for example, by a function that returned the negative root of 4 but the positive root of all other valid inputs. Note that functions in VDM-SL are required to be *deterministic* so that a function satisfying the example specification above must always return the same result for the same input.

A more constrained function specification is arrived at by strengthening the postcondition. For example the following definition constrains the function to return the positive root.

~~~
SQRT(x:nat) r:real 
	post r*r = x and r >= 0
~~~

All function specifications may be restricted by *preconditions* which are logical predicates over the input variables only and which describe constraints that are assumed to be satisfied when the function is executed. For example, a square root calculating function that works only on positive real numbers might be specified as follows:

~~~
SQRTP(x:real) r:real 
	pre x >=0 
	post r*r = x and r >= 0
~~~

The precondition and postcondition together form a *contract* that to be satisfied by any program claiming to implement the function. The precondition records the assumptions under which the function guarantees to return a result satisfying the postcondition. If a function is called on inputs that do not satisfy its precondition, the outcome is undefined (indeed, termination is not even guaranteed).

VDM-SL also supports the definition of executable functions in the manner of a functional programming language. In an *explicit* function definition, the result is defined by means of an expression over the inputs. For example, a function that produces a list of the squares of a list of numbers might be defined as follows:

~~~
SqList: seq of nat -> seq of nat 
SqList(s) == 
	if s = [] 
	then [] 
	else [(hd s)**2] ^ SqList(tl s)
~~~

This recursive definition consists of a function signature giving the types of the input and result and a function body. An implicit definition of the same function might take the following form:

~~~
SqListImp(s:seq of nat)r:seq of nat 
	post len r = len s and 
		 forall i in set inds s & r(i) = s(i)**2
~~~

The explicit definition is in a simple sense an implementation of the implicitly specified function. The correctness of an explicit function definition with respect to an implicit specification may be defined as follows.

Given an implicit specification:

~~~
f(p:T_p) r:T_r 
	pre pre-f(p) 
	post post-f(p, r)
~~~

and an explicit function:

~~~
f:T_p -> T_r
~~~

we say it satisfies the specification iff:

~~~
forall p in set T_p & pre-f(p) => 
	f(p):T_r and post-f(p, f(p))
~~~

So, "`f` is a correct implementation" should be interpreted as "`f` satisfies the specification".

### State-based modelling

In VDM-SL, functions do not have side-effects such as changing the state of a persistent global variable. This is a useful ability in many programming languages, so a similar concept exists; instead of functions, *operations* are used to change **state variables** (AKA globals).

For example, if we have a state consisting of a single variable `someStateRegister : nat`, we could define this in VDM-SL as:

~~~
state Register of 
	someStateRegister : nat 
end 
~~~

In VDM++ this would instead be defined as:

instance variables someStateRegister : nat

An operation to load a value into this variable might be specified as:

~~~
LOAD(i:nat) 
	ext wr someStateRegister:nat 
	post someStateRegister = i
~~~

The *externals* clause (`ext`) specifies which parts of the state can be accessed by the operation; `rd` indicating read-only access and `wr` being read/write access.

Sometimes it is important to refer to the value of a state before it was modified; for example, an operation to add a value to the variable may be specified as:

~~~
ADD(i:nat) 
	ext wr someStateRegister : nat 
	post someStateRegister = someStateRegister~ + i
~~~

Where the `~` symbol on the state variable in the postcondition indicates the value of the state variable before execution of the operation.
