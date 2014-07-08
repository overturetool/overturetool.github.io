---
layout: default
title: Modelling Systems: Using Mappings
---

## Modelling Systems: Additional Exercises on Mappings

### Students and courses

In a educational institution there are students and courses which are all uniquely identified. Students can register to attend a course. For each course name there is a collection of students following that class.

1. Define the types associated with the educational institution (represent the institution via a type called School).
2. Define two predicate functions, one which check school classes for having no students, another which checks that only school students are following not less than 3 and not more than 5 courses.
3. Define 4 functions which admits new students to schools, existing students to courses, and which drop students from courses and schools respectively. The signatures of these functions are as follows:

~~~   
NewStudent: School * Student -> School
NewCourse: School * Student * Course -> School
DropStudent: School * Student -> School
DropCourse: School * Student * Course -> School
~~~

### A library database

The requirements specification is taken from "A Study of 12 Specifications of the Library Problem" by Jeannette M. Wing, IEEE Software, July 1988. Consider a small library database with the following transactions:

1. Borrow/Return a copy of a book.
2. Add/Remove a copy of a book to/from the library.
3. Get a list of books by a particular author or in a particular subject area.
4. Get a list of books currently borrowed by a particular person.
5. Find the person who last borrowed a particular copy of a book.

There are two kinds of users: staff users and ordinary borrowers. Transactions 1,2,4 and 5 are restricted to staff users, except that ordinary borrowers can perform transaction 4 to find out the list of books currently borrowed by themselves.

The database must also satisfy the following constraints:

* All copies in the library must be available for checkout or be checked out.
* No copy of a book may be both available and checked out at the same time.
* A borrower may not have more than a predefined number of books checked out at the same time.

Make an abstract VDM model of these requirements using the systematic approach described in the chapter with the chemical plant alarm example.

### Store manager for chemical waste (again, again)

Let us now revisit the solution made to Exercise 5 in the collection of [[MSExSets][exercises for sets] and see how an alternative model using mappings would look.

1. In Question 5.1 for sets you recorded some restrictions on unique identifiers in the plant. You can avoid having to state these if you use mappings. For example, if we model a store, not as a set of racks but as a mapping from rack identifiers to rack data, where the rack data has the contents field and the capacity from the former Rack data type. Define the new Store data type using this scheme (you will also need to define a RackData type). Do you any longer need to state the uniqueness condition on rack identifiers? Explain your answer.
2. Define the invariants on the new Store data type.

### Train reservations

This exercise provides more practice at the construction of a formal model, and also explores some of the ideas of validation and proof obligations. In the UK the train reservation system works in a way where a small reservation tag is placed at reserved seats. This tag is simply a piece of paper so when you get to the seat to find someone in it and no reservation tag. You end up stading all the way to Edinburgh or wherever. Danish railways get over the problem by having a software reservations system that sends reservation data to the train where it gets displayed in a little LCD panel over the seat. This way, you aren't subject to the railways staff making a mistake with reservation tags or with dodgy individuals removing the seat reservation when they get ito it. Suppose you work for a software firm commissioned to develop a booking system on the Danish model. Your formal model refers to stations, trains and journeys. The purpose of your model is to define the functionality of the system. You might not be too concerned bout how precisely stations are represented: Station = token; A journey could be modelled as a sequence of stations that you go through:

~~~
Journey = seq of Station;
~~~

Reservations are for segments of a journey (e.g. between the second and fifth stations):

~~~
Segment :: origin       : nat1 
           destignation : nat1 
inv s == s.origin < s.destignation;
~~~

Trains will be identified by identifiers, the respresentation of which is immaterial:

~~~
TrainId = token;
~~~

For each train, we record its route (the journey it is following) and the collection of seat numbers available on the train:

~~~
TrainInfo :: route : Journey 
             seats : set of SeatNo;
~~~
			 
We will not be concerned with the details of seat numbers:

~~~
SeatNo = token;
~~~

Now to reservations. These are identified by reservation identifiers (ResId):

~~~ 
ResId = token;
~~~

Information about each reservation includes the seat number reserved, the train it's on and the segment of the journey for which the reservation has been made - it's possible to have a seat reserved fro someone from station 3 to station 5 and then reserved for someone else from station 5 to station 7, for example. The overall reservations system is a record of two mappings containing train details and reservation details:

~~~
System :: trains : map TrainId to TrainInfo 
          res    : map ResId to ResInfo
~~~

#### Exercise 4.1: invariant
Define the following clauses in the invariant:

1. all the trains in which reservations have been made are known to the system (i.e. are in the trains mapping)
2. all reserved seats are actually in the trains in which they are reserved.
3. there is no double booking (i.e. there are no two distinct reservations which have reserved the same seat on the same train for some part of the train's journey). Here you will need to define what it means for two journey segments to overlap one another: do this by means of an auxiliary function.

#### Exercise 4.2: functionality and satisfaibility
A function is satisfiable if, for any inputs satisfying the precondition (if there is one), the output is guaranteed to satisfy the invariant on the output type. Define the following functions and explain how you have ensured that your function is satisfiable in each case:

1. Define a function that initialises the system to an empty system (i.e. a record with two empty mappings in it.
2. Define a function to add a new rtain to the system (i.e. add a train which so far has no reservations).
3. Add a new reservation for a given seat on a given train.
4. Suggest a seat: given a train and a desired journey segment, suggest an available seat (i.e. one that is not booked for the segment).

#### Exercise 4.3: animation
Are all the functions you have defined executable? Design an interface through which you could execute the specification. Just write a short note about it, and draw an illustration of how your interface would look.