---
layout: default
title: Modelling Systems General Exercises
---

## Modelling Systems: Answers to Additional General Exercises

### Dynamic and static semantics for a small language (hard)

#### Static Semantics

In order to check, if a program is well-formed, a static environment which maps identifiers to types has to be introduced. types

~~~ 
  StatEnv = map Identifier to Type; 
~~~   
  
Using the static environment, a top-down definition of well-formed program constructs can be given. In the following definitions the prefix wf_ stands for well-formed.

~~~ 
functions 

  wf_Program : Program -> bool 
  wf_Program(mk_Program(decls, stmt)) == 
    wf_Declarations(decls) and wf_Stmt(stmt, get_Declarations(decls)); 
~~~ 

The incomplete informal description of the declarations raises several questions, which force to make design decisions. A declaration with an initial value contains two type informations, one in the type and one in the value. The two types must be the same. An open question is, what happens with uninitialized variables when they are evaluated inside an expression without having a value associated. This problem concerns both the static and dynamic semantics. If the value is not checked in the static semantics, the dynamic semantics has to take over this task. The following solutions are possible:

* Required initial values
 * All declarations must be declared with initial values. This is the simplest solution. The static semantics checks the consistency of both types. In the dynamic semantics neither types nor uninitiated values have to be considered.
* Default initialization
 * In this solution the static semantics checks the types of initiated variables. In the dynamic semantics the appropriate default initial values have to be set for variables which are not initialized explicitly. Hence the dynamic semantics has to take type information into account.
* Consideration of missing values
 * This is the most complicated solution. Again the static semantics checks both types in the declarations. However, the dynamic semantics has to consider possible uninitiated variables in every construct containing expressions. It would be possible to extend the logic to a three valued logic containing the value undefined, e.g. the expression true undefined could then be evaluated to true.
* Generating runtime errors
 * The dynamic semantics generates runtime errors, if uninitiated variables are used in expressions.
 
In this specification the second solution will be chosen, where all variables without initiations are initiated with default values.

~~~ 
  wf_Declarations : seq of Declaration -> bool 
  wf_Declarations(decls) == 
    (forall i1, i2 in set inds decls & 
      i1 <> i2 => decls(i1).id <> decls(i2).id) and 
    (forall i in set inds decls & 
      decls(i).val <> nil => 
      ((is_BoolVal(decls(i).val) and decls(i).tp = <BoolType>) or 
       (is_IntVal(decls(i).val) and decls(i).tp = <IntType>))); 

  get_Declarations : seq of Declaration -> StatEnv 
  get_Declarations(decls) == 
    {id |-> tp | mk_Declaration(id, tp, -) in set elems decls}; 
~~~ 	
	
The specification of the static semantics of statements is made by a simple case distinction.

~~~ 
  wf_Stmt : Stmt * StatEnv -> bool 
  wf_Stmt(stmt, senv) == 
    cases true : 
      (is_BlockStmt(stmt))  -> wf_BlockStmt(stmt, senv), 
      (is_AssignStmt(stmt)) -> let mk_(wf_ass, -) = wf_AssignStmt(stmt, senv) 
                               in wf_ass, 
      (is_CondStmt(stmt))   -> wf_CondStmt(stmt, senv), 
      (is_ForStmt(stmt))    -> wf_ForStmt(stmt, senv), 
      (is_RepeatStmt(stmt)) -> wf_RepeatStmt(stmt, senv), 
      others                -> false 
    end; 

  wf_BlockStmt : BlockStmt * StatEnv -> bool 
  wf_BlockStmt(mk_BlockStmt(decls, stmts), senv) == 
    wf_Declarations(decls) and wf_Stmts(stmts, senv ++ get_Declarations(decls)); 

  wf_Stmts : seq of Stmt * StatEnv -> bool 
  wf_Stmts(stmts, senv) == 
    forall stmt in set elems stmts & wf_Stmt(stmt, senv); 
~~~ 	
	
The types of the left-hand and right-hand side of an assignment must be the same. In addition the type of the assignment which is needed in the context of the for-loop is returned.

~~~ 
  wf_AssignStmt : AssignStmt * StatEnv -> bool * [Type] 
  wf_AssignStmt(mk_AssignStmt(lhs, rhs), senv) == 
    let mk_(wf_var, tp_var) = wf_Variable(lhs, senv), 
        mk_(wf_ex, tp_ex) = wf_Expr(rhs, senv) 
    in mk_(wf_ex and wf_var and tp_var = tp_ex, tp_var); 
~~~ 	
	
In the conditional statement and the repeat-loop a boolean expression is required:

~~~ 
  wf_CondStmt : CondStmt * StatEnv -> bool 
  wf_CondStmt(mk_CondStmt(guard, thenst, elsest), senv) == 
    let mk_(wf_ex, tp_ex) = wf_Expr(guard, senv) 
    in wf_ex and tp_ex = <BoolType> and 
       wf_Stmt(thenst, senv) and wf_Stmt(elsest, senv); 

  wf_RepeatStmt : RepeatStmt * StatEnv -> bool 
  wf_RepeatStmt(mk_RepeatStmt(repeat, until), senv) == 
    let mk_(wf_ex, tp_ex) = wf_Expr(until, senv) 
    in wf_ex and tp_ex = <BoolType> and wf_Stmt(repeat, senv); 
~~~ 	
	
The for-loop is underspecified and raises the question, which kind of loop is really intended. It is not clear if the stop expression should be of type Integer or Bool, which leads to two different loop concepts. For a detailed discussion on the possibilities to interpret the semantics of the for-loop see below. For the static semantics the most obvious design decision has been made that the stop-expression should be of type Integer.

~~~ 
  wf_ForStmt : ForStmt * StatEnv -> bool 
  wf_ForStmt(mk_ForStmt(start, stop, stmt), senv) == 
    let mk_(wf_ass, tp_ass) = wf_AssignStmt(start, senv), 
        mk_(wf_ex, tp_ex) = wf_Expr(stop, senv) 
    in wf_ass and wf_ex and tp_ass = <IntType> and tp_ex = <IntType> and 
       wf_Stmt(stmt, senv); 
~~~ 	   
	   
Handling expressions and variables, it is necessary to return the type in addition to the well-formedness predicate.

~~~ 
  wf_Expr : Expr * StatEnv -> bool * [Type] 
  wf_Expr(ex, senv) == 
    cases true : 
      (is_BoolVal(ex))    -> mk_(true, <BoolType>), 
      (is_IntVal(ex))     -> mk_(true, <IntType>), 
      (is_Variable(ex))   -> wf_Variable(ex, senv), 
      (is_BinaryExpr(ex)) -> wf_BinaryExpr(ex, senv), 
      others              -> mk_(false, <IntType>) 
    end; 

  wf_Variable : Variable * StatEnv -> bool * [Type] 
  wf_Variable(mk_Variable(id), senv) == 
    if id in set dom senv then 
      mk_(true, senv(id)) 
    else 
      mk_(false, nil); 
~~~ 	  
	  
It is not explicitly stated if the equality operator should also be defined for Boolean values. For simplicity the decision is made to define equality only for Integers.

~~~ 
  wf_BinaryExpr : BinaryExpr * StatEnv -> bool * [Type] 
  wf_BinaryExpr(mk_BinaryExpr(lhs, op, rhs), senv) == 
    let mk_(wf_lhs, tp_lhs) = wf_Expr(lhs, senv), 
        mk_(wf_rhs, tp_rhs) = wf_Expr(rhs, senv) 
    in cases op : 
       <Add>, <Sub>, <Div>, <Mul> -> 
         mk_(wf_lhs and wf_rhs and tp_lhs = <IntType> and tp_rhs = <IntType>, 
             <IntType>), 
       <Lt>, <Gt>, <Eq> -> 
         mk_(wf_lhs and wf_rhs and tp_lhs = <IntType> and tp_rhs = <IntType>, 
             <BoolType>), 
       <And>, <Or> -> 
         mk_(wf_lhs and wf_rhs and tp_lhs = <BoolType> and tp_rhs = <BoolType>, 
             <BoolType>), 
       others -> mk_(false, nil) 
       end; 
~~~ 
	   
#### Dynamic Semantics

In order to define the dynamic semantics of a program the dynamic environment is defined. For this simple language it is sufficient to model it as a mapping from identifiers to values. Thus the storage is not taken into account. Since the decision has been made, to instantiate all variables the value of the dynamic environment is not optional:

~~~ 
types 

  DynEnv = map Identifier to Value; 
~~~   
  
As in the definition of the static semantics, a top-down approach is used. The result of the dynamic semantics function is the global dynamic environment consisting of the global variables.
The pre-condition of the dynamic semantics function !EvalProgram is the well-formedness of the program and a second condition which concerns the division by zero and will be explained later on.

~~~ 
functions 

  EvalProgram : Program -> DynEnv 
  EvalProgram(mk_Program(decls, stmt)) == 
    EvalStmt(stmt, EvalDeclarations(decls)) 
  pre wf_Program(mk_Program(decls, stmt)) and 
      pre_EvalStmt(stmt, EvalDeclarations(decls)); 
Evaluating uninitiated variable declarations, a proper default value is assigned: false for Boolean values and 0 for Integer values.
  EvalDeclarations : seq of Declaration -> DynEnv 
  EvalDeclarations(decls) == 
    {id |-> if val <> nil 
            then val 
            elseif tp = <BoolType> 
            then mk_BoolVal(false) 
            else mk_IntVal(0) 
    | mk_Declaration(id, tp, val) in set elems decls}; 
~~~ 	
	
The evaluation of the statements is rather simple to specify. Only for the block statement the scoping rules have to be considered: The statements in the block are evaluated in the global environment overridden by the local environment. The returning environment contains the updated global variables.

~~~ 
  EvalStmt : Stmt * DynEnv -> DynEnv 
  EvalStmt(stmt, denv) == 
    cases true : 
      (is_BlockStmt(stmt))  -> EvalBlockStmt(stmt, denv), 
      (is_AssignStmt(stmt)) -> EvalAssignStmt(stmt, denv), 
      (is_CondStmt(stmt))   -> EvalCondStmt(stmt, denv), 
      (is_ForStmt(stmt))    -> EvalForStmt(stmt, denv), 
      (is_RepeatStmt(stmt)) -> EvalRepeatStmt(stmt, denv) 
    end 
  pre (is_BlockStmt(stmt)   => pre_EvalBlockStmt(stmt, denv)) and 
      (is_AssignStmt(stmt)  => pre_EvalAssignStmt(stmt, denv)) and 
      (is_CondStmt(stmt)    => pre_EvalCondStmt(stmt, denv)) and 
      (is_ForStmt(stmt)     => pre_EvalForStmt(stmt, denv)) and 
      (is_RepeatStmt(stmt)  => pre_EvalRepeatStmt(stmt, denv)); 

  EvalBlockStmt : BlockStmt * DynEnv -> DynEnv 
  EvalBlockStmt(mk_BlockStmt(decls, stmts), denv) == 
    let ldenv = EvalDeclarations(decls) in 
      let denv' = EvalStmts(stmts, denv ++ ldenv) in 
        denv ++ dom ldenv <-: denv' 
  pre let ldenv = EvalDeclarations(decls) 
      in pre_EvalStmts(stmts, denv ++ ldenv); 

  EvalStmts : seq of Stmt * DynEnv -> DynEnv 
  EvalStmts(stmts, denv) == 
    cases stmts : 
      [] -> denv, 
      others -> EvalStmts(tl stmts, EvalStmt(hd stmts, denv)) 
    end 
  pre stmts <> [] => pre_EvalStmt(hd stmts, denv); 

  EvalAssignStmt : AssignStmt * DynEnv -> DynEnv 
  EvalAssignStmt(mk_AssignStmt(lhs, rhs), denv) == 
    denv ++ {lhs.id |-> EvalExpr(rhs, denv)} 
  pre pre_EvalExpr(rhs, denv); 

  EvalCondStmt : CondStmt * DynEnv -> DynEnv 
  EvalCondStmt(mk_CondStmt(guard, thenst, elsest), denv) == 
    if EvalExpr(guard, denv).val 
    then EvalStmt(thenst, denv) 
    else EvalStmt(elsest, denv) 
  pre pre_EvalExpr(guard, denv) and 
      if EvalExpr(guard, denv).val 
      then pre_EvalStmt(thenst, denv) 
      else pre_EvalStmt(elsest, denv); 

  EvalRepeatStmt : RepeatStmt * DynEnv -> DynEnv 
  EvalRepeatStmt(mk_RepeatStmt(repeat, until), denv) == 
    let denv' = EvalStmt(repeat, denv) in 
    if EvalExpr(until, denv').val 
      then denv' 
      else EvalRepeatStmt(mk_RepeatStmt(repeat, until), denv') 
  pre pre_EvalStmt(repeat, denv) and 
      pre_EvalExpr(until, EvalStmt(repeat, denv)); 
~~~ 	  
	  
As indicated above, the dynamic semantics of the for-loop is underspecified. The informal description allows the interpretation of the stop-expression to be of type integer or Boolean, which leads to two different loop concepts and raises further questions about the dynamic semantics of for-loops:

* Integer-expression
 * The assignment is evaluated once when the loop is entered. The expression could either be evaluated once at the beginning or at each repetition. After each execution of the loop's body the loop-variable is increased. The loop is finished if the loop-variable is greater than the value:
     
~~~ 
	 for i := 1 to 5 do ... 
~~~ 
	 
* Boolean expression and running execution of the assignment
 * The loop is executed until the Boolean expression evaluates to 'true'.. The evaluation of the expression and the assignment is performed continuously:

~~~ 
	i := 1; 
     for (i := i + 1, i = 5) do ... 
~~~ 
	 
* Boolean expression with evaluating the assignment once
 * The assignment is evaluated once at the beginning of the loop. The Boolean expression is again evaluated continuously. Here the loop variable must be increased (changed) inside the loop.
* The most obvious approach is the specification of the expression as an integer type and and the constraint to evaluate the assignment once. Further questions concerning the loop-variable arise:
 * Is it allowed to use the loop-variable inside the stop-expression?
 * Is it allowed to change the loop-variable inside the body?
 * Is it allowed to change the variables, which are used in the stop-expression, inside the body?

 Unwanted effects could arise, if the expression is computed continuously and if the loop-variable is allowed inside the expression or the variables inside the expression are allowed inside the body. Therefore, the design decision is made that the stop-expression is only evaluated once. Furthermore, no restrictions in the usage of variables are made.

~~~  
 EvalForStmt : ForStmt * DynEnv -> DynEnv 
  EvalForStmt(mk_ForStmt(start, stop, stmt), denv) == 
    let denv' = EvalAssignStmt(start, denv) in 
    EvalForLoop(start.lhs, EvalExpr(stop, denv'), stmt, denv') 
  pre pre_EvalAssignStmt(start, denv) and 
      pre_EvalExpr(stop, EvalAssignStmt(start, denv)); 

  EvalForLoop : Variable * Value * Stmt * DynEnv -> DynEnv 
  EvalForLoop(mk_Variable(id), val, stmt, denv) == 
    if denv(id).val <= val.val 
      then let denv' = EvalStmt(stmt, denv) 
           in EvalForLoop(mk_Variable(id), val, stmt, 
                          denv' ++ {id |-> mk_IntVal(denv'(id).val + 1)}) 
      else denv 
  pre pre_EvalStmt(stmt, denv); 
~~~ 
  
The evaluation of binary expressions is straightforward. An exception is the binary expression where the problem of division by zero may occur. A pre-condition states that the right-hand side must not be zero. This pre-condition has to be added to every function on a higher level in the definition hierarchy.

~~~ 
  EvalExpr : Expr * DynEnv -> Value 
  EvalExpr(ex, denv) == 
    cases ex : 
      mk_BoolVal(-), 
      mk_IntVal(-)         -> ex, 
      mk_Variable(id)      -> denv(id), 
      mk_BinaryExpr(-,-,-) -> EvalBinaryExpr(ex, denv) 
    end 
  pre is_BinaryExpr(ex) => pre_EvalBinaryExpr(ex, denv); 

  EvalBinaryExpr : BinaryExpr * DynEnv -> Value 
  EvalBinaryExpr(mk_BinaryExpr(lhs, op, rhs), denv) == 
    let v1 = EvalExpr(lhs, denv).val, 
        v2 = EvalExpr(rhs, denv).val 
    in cases op : 
       <Add> -> mk_IntVal(v1 + v2), 
       <Sub> -> mk_IntVal(v1 - v2), 
       <Div> -> mk_IntVal(v1 div v2), 
       <Mul> -> mk_IntVal(v1 * v2), 
       <Lt> ->  mk_BoolVal(v1 < v2), 
       <Gt> ->  mk_BoolVal(v1 > v2), 
       <Eq> ->  mk_BoolVal(v1 = v2), 
       <And> -> mk_BoolVal(v1 and v2), 
       <Or> ->  mk_BoolVal(v1 or v2) 
    end 
  pre op = <Div> => EvalExpr(rhs, denv).val <> 0; 
~~~ 

### Program Flowgraphs (hard)

{% raw %}
~~~
types 
Node = nat1; 

Nodes = set of Node; -- any subset of Node 

GraphNodes = set of Node 
inv N == forall i in set {1,...,card N} & i in set N; 
-- sets of form {1,...,K}, for arbitrary K 

Arc = Node * Node; 
Arcs = set of Arc; -- family of binary relations on Node 

Flowgraph:: 
 N: GraphNodes 
 A: Arcs 
 S: Node 
 E: Node 
inv mk_Flowgraph(N,A,S,E) == 
 (card N >1) and 
 (S in set N) and 
 (E in set N) and 
 let G=mk_Flowgraph(N,A,S,E) in 
 (Successors(G,E) = {}) and -- exit has no successors 
 (Predecessors(G,S) = {}) and  -- entry has no predecessor 
 let All = {mk_(x,y)| x,y in set N} in -- all possible arcs on N 
 (A subset All); -- arcs in A come from N * N 

Path = seq of Node; 

functions 

Successors: Flowgraph * Node -> Nodes 
Successors(mk_Flowgraph(N,A,S,E),n) == 
  {x| x in set N & mk_(n,x) in set A} 
pre n in set N; 

Predecessors: Flowgraph * Node -> Nodes 
Predecessors(G,n) == {x| x in set G.N & mk_(x,n) in set G.A} 
pre n in set G.N; 

-- NOTE: Th eabove definitions are OK without dynamic invariant checking 
-- However, if you turn the latter on, infinitie recursion will occur, 
-- since the functions Predecessors and Successors will try again 
-- to check the invariant. Solution? 

-- Redefine the signature of Predec- and Succs-essors to avoid explicitly 
-- referring to type Flowgraph, e.g. 
-- Successors: Arcs * Nodes * Node -> Nodes 
-- called as Successors (A,N,N) 

IsPathInGraph: Flowgraph * Path -> bool 
IsPathInGraph(mk_Flowgraph(N,A,S,E), p) == 
  forall i in set {1,...,len p -1} & mk_(i,i+1) in set A; 

a: Node * Node -> Arc 
-- returns arc (i,j), to build arc values easier 
a(i,j) == mk_(i,j); 
  

values 

V: GraphNodes = {1,...,10}; -- one set for all flow graphs 
  

-- various sets of arcs for different kinds of graphs 
AllArcs: Arcs ={mk_(x,y)| x,y in set V}; -- all potential arcs 
A0: Arcs = {}; --empty graph 
A1: Arcs = {a(i,j)| i, j in set V & j=i+1};  -- linear graph 
A2: Arcs = A1 union {a(4,6)}; -- one IF at 4 
A3: Arcs = A2 union {a(8,3),a(3,9)}; -- IF and loop at3 
A4: Arcs = A3 union {a(9,2)}; -- nested loops 

g1v: Flowgraph= mk_Flowgraph(V,A0,1,10); --valid empty graph 
-- g1i: Flowgraph= mk_Flowgraph(V,A0,1,20); -- invalid empty graph, 
-- initialization error IF dynamic invariant checking on 

g2v: Flowgraph = mk_Flowgraph(V,A1,1,10); -- valid linear 
--g2i: Flowgraph = mk_Flowgraph(V,A1,1,20); --invalid linear 
~~~
{% endraw %}