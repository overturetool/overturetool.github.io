---
layout: default
title: Modelling Systems Logic
---

## Modelling Systems: Additional Exercises on Logic

Exercise 4 is based on one supplied by Prof. Janusz Laski from Oakland University.

### Evaluation

Given the following assignment of values to variables:

~~~
a:=0 d:=1 
b:=34 e:=true 
c:=90 f:=false 
~~~

Evaluate the logical expressions below:

1. `not (e and f)`
2. `(e or f) => (not e and not f)`
3. `e and f) <=> (not e and not f)`
4. `a < b and a = b`
5. `a*b > c or a+c>d or true`
6. `(a=0 or b < 23) <=> (c=4 and d=5 and d=44)`
7. `(a+b > 2 => c+d > 3) => a=12`
8. `a+b > 2 => (c+d > 3 => a=12)`

### Presentation of logical expressions

It's surprising how often you come across formal models in which the way an expression is laid out on the page gives a false impression of its meaning. Be especially careful when laying out formulae with liebreaks and indentations. For example, consider the following expression:

~~~ 
x > 30 or 
y < 10 => x < 20
~~~

with the assignment `x:=35, y:=5`. The way the formula is laid out on the page suggests that we should evaluate it as follows:
(x > 30) or (y < 10 => x < 20)
which evaluates to
 
true or (true => false)
which in turn evaluates to `true`. However, if we apply the actual order of precedence of the logical operators, we should break the expression as follows:

~~~
(x > 30 or y < 10) => (x < 20)
~~~

and this evaluates to

~~~
(true or true) => (false)
~~~

which in turn evaluates to `false`. This could mean the difference between turning some critical valve on or off! Although the problem seems obvious on a small example, it is very easy to forget to take care when developing larger models, with longer identifiers and more complex formulae. Formatting adds nothing to the meaning of an expression, although it can help its readability. Bracket the following formulae to show the order of evaluation. Let p, q, r, s and t stand for arbitrary logical expressions.

1. `p and not not not not q <=> r`
2. `p and q or r <=> s and t`
3. `p => q <=> r => s <=> p => q or s`
4. `(p and q => r) <=> p and q or r => c and d`

Writing expressions without parentheses is very bad style: it just makes the model difficult to read. Use parentheses liberally and organise expressions on the page so that they are clear to you and to your readers.

### Quantifiers

Translate the following statements into logical expressions:

1. All the numbers in the set {7,55,133,200} are greater than 5.
2. There is a Natural number less than 50.
3. There are two Natural numbers that multiply together to give 60.
4. The number 24 is even.
5. For any two successive Natural numbers, one of them is even.
6. There is no even number whose successor is even.
7. For any pair of natural numbers, there is a rational number equal to their quotient. (This isn't true: the divisor must not be zero. Rewrite the expression to record this restriction.)

Expand the following into conjunctions or disjunctions:

1. `forall x in set {1,...,5} & 2*x < 10`
2. `exists y in set {1,...,5} & y*y = 9`
3. `exists x,y in set {1,...,3} & x*y = y*y`

Which of the following expressions evaluate to true and which to false?

1. `forall i in set {1,...,10} & i < 50`
2. `forall i : nat1 & i < 10000`
3. `exists n:nat & n < 0`
4. `exists i:int & i > -3 and i+20 < 5`
5. `forall i:nat & (exists j:nat & i*j=10) => i in set {2,5}`
6. `forall i,j in set {3,4,5} & i*j <> 12`
7. `not exists i,j in set {3,4,5} & i*j = 9`
8. `exists x,y:nat & not exists r:nat & x*r=y`

### Love relations

Translate and test the following propositions into VDM-SL Boolean functions over a collection `Name` of individuals.

1. Somebody is loved by everybody: `SomebodyIsLovedByEverybody: ? -> ?`
2. Nobody loves everybody: `NobodyLovesEverybody: ? -> ?`
3. If you love somebody, you love some of those he/she loves, too: `TransitiveLove: ? -> ?`

HINTS: (1) `Define` Name as a `token` type; (2) Introduce type `Lovers` as a mapping from names to the ones they love (3) Define values of the type `Lovers` for your tests. You can also consider whether this alternatively could be modelled using a relation between names modelled as a set of pairs of names.

### Overloaded experts (add on exercise to Chapter 2's alarm example)

Legislation on health and safety at work has forced us to introduce limits on the number of periods worked by experts. A schedule is said to be overloaded if there is some expert in the schedule who is on duty for three periods or more in the schedule. Complete the definition of the function Overloaded given below. The function should return the value true if and only if the schedule given as input is overloaded.

~~~
  Overloaded: Schedule -> bool 
  Overloaded(sch) == ... 
~~~
  
 Hint: use a quantified predicate over the three periods.
 
### Redundant Experts (add-on exercise to Chapter 2's alarm example)

It is Monday morning and the following experts are on duty:

1. Andrea, who is qualified in and ,
2. Bill, who is qualified in ,
3. Cherie, who is qualified in and

The chemical plant's managers have decided that we should have no more experts on duty than is necessary to ensure that every qualification is covered by one expert in each period. Who can we send home this morning? How would you characterise whether an expert is unnecessary? Define a Boolean function called Redundant which, given a Schedule, a Period in the schedule and an Expert on duty in that period, returns true if and only if the expert could be sent home (assuming the other experts all stay). Your function will need a pre- condition to ensure that the given period is in the domain of the schedule (in set dom) and that the given expert is on duty in the given period.

### Do we still need `inv-Expert`? (add-on exercise to Chapter 2's alarm example)

In chapter 2 the type Expert to represent experts was defined as:

~~~
Expert :: expertid : ExpertId 
          quali    : set of Qualification 
inv ex == ex.quali <> {}
~~~

The invariant recorded the restriction that experts should have at least one qualification. Later, we defined an invariant on the type Plant which records the constraint that there should be an expert with each type of qualification available in all periods:

~~~
Plant :: schedule : Schedule 
         alarms : set of Alarm 
inv mk_Plant(schedule,alarms) == 
    forall a in set alarms & 
       forall per in set dom schedule & 
          exists ex in set exs & a.quali in set ex.quali
~~~

Does the invariant on `Plant` stop us from having experts with no qualifications? Explain your answer.