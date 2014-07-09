---
layout: default
title: Modelling Systems General Exercises
---

## Modelling Systems: Additional General Exercises

Exercise 1 is based on one supplied by Bernhard K. Aichernig and Andreas Kerschbaumer from TU Graz in Austria. Exercise 2 is based on one supplied by Prof. Janusz Laski from Oakland University. The assistance from all of them is gratefully acknowledged.

### Dynamic and static semantics for a small language (hard)

A VDM-SL specification of the static and dynamic semantics of a typed imperative programming language is to be developed. The abstract syntax and an informal description of the semantics of the language is given. Let us first define what the meaning of static and dynamic semantics is:

* Static semantics
 * The static semantics should define and check the well-formedness of programs in the given language. This includes static type checking, the complete and unambiguous definition of all variables inside program blocks, and scoping.

* Dynamic semantics
 * The dynamic semantics associates a meaning to a programming language. In this example the dynamic semantics is a function mapping a program to its final global environment, which is the state of all global variables after execution.
 
### Informal Language Definition

Below the abstract syntax of the language is given in VDM-SL. In order to keep the language simple, only Integer and Boolean types are defined.
A program consists of a declaration part followed by a statement.
definitions 

~~~
types 

  Program :: decls : seq of Declaration 
             stmt  : Stmt; 
~~~			 

A (variable) declaration consists of an identifier, an associated type and an optional initial value.

~~~
  Declaration :: id  : Identifier 
                 tp  : Type 
                 val : [Value]; 
~~~				 
				 
An identifier is a sequence of characters. In our language two types are known, Boolean and Integer. The two types of values in the language are modeled as the corresponding VDM-SL types bool and int.

~~~
  Identifier = seq1 of char; 

  Type = <BoolType> | <IntType> ; 

  Value = BoolVal | IntVal; 

  BoolVal :: val : bool; 

  IntVal :: val : int; 
~~~  
  
Our simple language only knows four kinds of statements: block statements, assignments, a conditional statement, a for-loop and a repeat-loop.

~~~
  Stmt = BlockStmt | AssignStmt | CondStmt | ForStmt | RepeatStmt; 
~~~  
  
A block statement consists of local variable declarations and a non-empty sequence of statements.

~~~
  BlockStmt :: decls  : seq of Declaration 
                     stmts : seq1 of Stmt; 
~~~
					 
The left-hand side of an assignment is a variable, which is simply an identifier. The right-hand side is defined as an expression.
 
~~~
  AssignStmt :: lhs : Variable 
                rhs : Expr; 

  Variable :: id : Identifier; 
~~~

An expression could be a binary expression, a value or a variable. A binary expression consists of a left-hand expression, an operator and a right-hand expression.

~~~
  Expr = BinaryExpr | Value | Variable; 

  BinaryExpr :: lhs : Expr 
                op  : Operator 
                rhs : Expr; 
~~~
				
The numeric operators of the language are addition, subtraction, Integer-division, and multiplication. The Boolean operators are less-than, greater-then, equality, conjunction, and finally disjunction.

~~~
  Operator = <Add> | <Sub> | <Div> | <Mul> | <Lt> | <Gt> | <Eq> | <And> | <Or>; 
~~~  
  
A conditional if-statement consists of a guard predicate, the then- and else-branch.

~~~
  CondStmt :: guard  : Expr 
              thenst : Stmt 
              elsest : Stmt; 
~~~			  
			  
The for-loop consists of an initial assignment to the loop-variable, followed by an expression, which defines the stop value of the loop-variable, and the statement to be repeated. It is allowed to modify the loop-variable inside the body of the loop.

~~~
  ForStmt :: start : AssignStmt 
             stop  : Expr 
             stmt  : Stmt; 
~~~			 
			 
Finally, the repeat-loop consists of the statement to be repeated and its stop condition.

~~~
  RepeatStmt :: repeat : Stmt 
                until  : Expr; 
~~~

#### Questions

For this small programming language you should now define:

1. the static semantics (with the signature `wf_Program : Program -> bool`) and
2. the dynamic semantics (with the signature `EvalProgram : Program -> DynEnv` where `DynEnv` is defined to be `DynEnv = map` Identifier to Value).

### Program Flowgraphs (hard)

The flowgraph is a version of a directed graph that provides a model of the flow of control in a subprogram, i.e. a procedure or function; it is a formal version of a flowchart that can be derived automatically from the subprogram's source code. The essential components of the flowgraph are nodes, which correspond to instructions in the procedure. An instruction is the smallest (further nondecomposable) executable part of a programming statement. Thus, mathematically, a flowgraph is a quadruple <N,A,S,E> where N is the set of nodes, A is a set of arcs and S and E are, respectively, the Start and Exit node. An arc a in A is a pair (n m), where n,m?N with the meaning "m may be executed after n has completed execution." Figure 1 shows a procedure in Pascal. Figure 2 shows the list of instructions in procedure Search that has been derived automatically from the code; the instructions are also listed in column 2 in Figure 1. Figure 3 shows the set of arcs. Thus, the flowgraph F=<1..21,A,1,21> where A is shown in Figure 3.

~~~
    56    procedure Search 
    57    (* searches for pivot *) 
    58            (i,                   (* current row number  *) 
    59             n: integer;          (* # of equations  *) 
    60             var index : ary2i;   (* pivot indexes *) 
    61             irow, icol : integer); (* indices of 
    62                       the old pivot         *) 
    63 
    64         var 
    65           big : real; 
    66           j,k : integer; 
    67 
    68         begin 
    69               (* search for largest element *) 
    70   1           big := 0.0; 
     71   2-4,17      for j := 1 to n do 
    72                 begin 
    73   5               if index[j, 3] <> 1 then 
    74                     begin 
    75   6-8,16              for k := 1 to n do 
    76                         begin 
    77   9                       if index[k, 3] > 1 then 
    78  10                         writeln('ERROR: matrix singular'); 
    79  11                       if index[k, 3] < 1 then 
    80  12                         if abs(b[j, k]) >= big then 
    81                               begin 
    82  13                             irow := j; 
    83  14                             icol := k; 
    84  15                             big := abs(b[j, k]) 
    85                               end 
    86                         end (* k loop *) 
    87                     end 
    88                 end (* j loop *); 
    89  18           index[icol, 3] := index[icol, 3] + 1; 
    90  19           index[i, 1] := irow; 
    91  20           index[i, 2] := icol; 
    92  21     end; (* search *) 
    93 
~~~	
	
FIGURE 1. Procedure Search.

~~~
         1  big:=0.0 
         2  j:=1 
         3  _ub1:=n 
         4  j<=_ub1 
         5  index[j,3]<>1 
         6  k:=1 
         7  _ub2:=n 
         8  k<=_ub2 
         9  index[k,3]>1 
        10  writeln(' ERROR: matrix singular') 
        11  index[k,3]<1 
        12  abs(b[j,k])>=big 
        13  irow:=j 
         14  icol:=k 
        15  big:=abs(b[j,k]) 
        16  k:=succ(k) 
        17  j:=succ(j) 
        18  index[icol,3]:=index[icol,3]+1 
        19  index[i,1]:=irow 
        20  index[i,2]:=icol 
        21  EXIT 
~~~
		
FIGURE 2. Instructions in procedure Search from Figure 1 (Step 1).

~~~
       1  --->   2 
       2  --->   3 
       3  --->   4 
       4  --->  18  5 
       5  --->  17  6 
       6  --->   7 
       7  --->   8 
       8  --->  17  9 
       9  --->  11 10 
      10  --->  11 
      11  --->  16 12 
      12  --->  16 13 
      13  --->  14 
      14  --->  15 
      15  --->  16 
      16  --->   8 
      17  --->   4 
      18  --->  19 
      19  --->  20 
      20  --->  21 
~~~	  
	  
FIGURE 3. Transfer of control between instructions in Figure 2. Notation "k --> list of nodes" means: control can be passed from node k to any in the list.

#### Definitions
* For a node n in N, m is a successor of n iff there is an arc (n m) in A.
* For a node n in N, m is a predecessor of n iff there is an arc (m n) in A.
* A path from n to m in the flow graph is a sequence of nodes (n1, n2, ..., nk) such that n1=n, nk=m
* every node in the sequence is in N
* for every adjacent pair of nodes ni and ni+1, the arc (ni ni+1) is in the set A of arcs.

#### Questions

1. Propose data structures for the following types (you will most likely need type invariants):
 1. Nodes: sets of natural numbers such that every set in the type contains all numbers between 1 and the cardinality of the set, i.e. the elements of the type are sets {1,...,K} for arbitrary K greater than 0. Use the is_Nodes function to test your solution (both True and False).
 2. Arcs - i.e. a set of binary relations on the set Nodes, i.e. sets of sets of pairs of nodes. Test is_Arcs.
 3. Flowgraph, to model program flowgraphs.
2. Create a set of values for type Flowgraph, and check their consistency using is_Flowgraph.
3. Define the following functions:
 * Successors: `Flowgraph * Node -> set of Node` -- returns the set of successor of node in the flowgraph
 * Predecessors: `Flowgraph * Node -> set of Node` -- returns the set of predecessors of node in the flowgraph
4. Define type Path as a set of sequences of nodes and then define the function
 * `Is-path-in-Graph: Flowgraph * Path -> bool` -- Is-path-in-Graph (G, p) = = p is a path in G.
5. Define type No-Branches which maps every node in the flowgraph to a successor. For decision nodes (i.e. ones with more than one successors), pick arbitrarily one successor. Assuming that m is a mapping of the type, what is the meaning of the expression `m ** k`, where k is a natural number? Test your solution.