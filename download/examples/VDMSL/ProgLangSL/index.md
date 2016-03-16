---
layout: default
title: ProgLangSL
---

## ProgLangSL
Author: ernhard K. Aichernig and Andreas Kerschbaumer


This example is made by Bernhard K. Aichernig and Andreas Kerschbaumer 
and it contains a VDM model for a Static and Dynamic Semantics of a Simple 
Programming Language. The example has been an assignment in the exercises 
of the software technology course at the Technical University Graz, Austria. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| Test`RunTypeCheck()|
|Entry point     :| Test`RunEval()|


### dynsem.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                         
module DYNSEM

imports
 from AST all,
 from STATSEM all
 
exports all

definitions

types

  DynEnv = map AST`Identifier to AST`Value;
                                                                                                                                                                                                                                                                                                                                                                                                                                     
functions

  EvalProgram : AST`Program -> DynEnv
  EvalProgram(mk_AST`Program(decls, stmt)) ==
    EvalStmt(stmt, EvalDeclarations(decls))
  pre STATSEM`wf_Program(mk_AST`Program(decls, stmt)) and 
      pre_EvalStmt(stmt, EvalDeclarations(decls));
                                                                                                                                                                             
  EvalDeclarations : seq of AST`Declaration -> DynEnv
  EvalDeclarations(decls) ==
    {id |-> if val <> nil
            then val 
            elseif tp = <BoolType> 
            then mk_AST`BoolVal(false)
            else mk_AST`IntVal(0)  
        | mk_AST`Declaration(id, tp, val) in set elems decls};

                                                                                                                                                                                                                                                                                                                                             
  EvalStmt : AST`Stmt * DynEnv -> DynEnv
  EvalStmt(stmt, denv) ==
    cases true :
      (is_AST`BlockStmt(stmt))  -> EvalBlockStmt(stmt, denv),
      (is_AST`AssignStmt(stmt)) -> EvalAssignStmt(stmt, denv),
      (is_AST`CondStmt(stmt))   -> EvalCondStmt(stmt, denv),
      (is_AST`ForStmt(stmt))    -> EvalForStmt(stmt, denv),
      (is_AST`RepeatStmt(stmt)) -> EvalRepeatStmt(stmt, denv)
    end
  pre (is_AST`BlockStmt(stmt)   => pre_EvalBlockStmt(stmt, denv)) and
      (is_AST`AssignStmt(stmt)  => pre_EvalAssignStmt(stmt, denv)) and
      (is_AST`CondStmt(stmt)    => pre_EvalCondStmt(stmt, denv)) and
      (is_AST`ForStmt(stmt)     => pre_EvalForStmt(stmt, denv)) and
      (is_AST`RepeatStmt(stmt)  => pre_EvalRepeatStmt(stmt, denv));

  EvalBlockStmt : AST`BlockStmt * DynEnv -> DynEnv
  EvalBlockStmt(mk_AST`BlockStmt(decls, stmts), denv) ==
    let ldenv = EvalDeclarations(decls) in
      let denv' = EvalStmts(stmts, denv ++ ldenv) in
        denv ++ dom ldenv <-: denv'
  pre let ldenv = EvalDeclarations(decls) 
      in pre_EvalStmts(stmts, denv ++ ldenv);

  EvalStmts : seq of AST`Stmt * DynEnv -> DynEnv
  EvalStmts(stmts, denv) ==
    cases stmts :
      [] -> denv,
      others -> EvalStmts(tl stmts, EvalStmt(hd stmts, denv))
    end
  pre stmts <> [] => pre_EvalStmt(hd stmts, denv)
  measure LenStmt;
  
  LenStmt: seq of AST`Stmt * DynEnv -> nat
  LenStmt(l,-) ==
    len l;

  EvalAssignStmt : AST`AssignStmt * DynEnv -> DynEnv
  EvalAssignStmt(mk_AST`AssignStmt(lhs, rhs), denv) ==
    denv ++ {lhs.id |-> EvalExpr(rhs, denv)}
  pre pre_EvalExpr(rhs, denv);

  EvalCondStmt : AST`CondStmt * DynEnv -> DynEnv
  EvalCondStmt(mk_AST`CondStmt(guard, thenst, elsest), denv) ==
    if EvalExpr(guard, denv).val
    then EvalStmt(thenst, denv) 
    else EvalStmt(elsest, denv)
  pre pre_EvalExpr(guard, denv) and
      if EvalExpr(guard, denv).val
      then pre_EvalStmt(thenst, denv) 
      else pre_EvalStmt(elsest, denv);

  EvalRepeatStmt : AST`RepeatStmt * DynEnv -> DynEnv
  EvalRepeatStmt(mk_AST`RepeatStmt(repeat, until), denv) ==
    let denv' = EvalStmt(repeat, denv) in
    if EvalExpr(until, denv').val
      then denv'
      else EvalRepeatStmt(mk_AST`RepeatStmt(repeat, until), denv')
  pre pre_EvalStmt(repeat, denv) and
      pre_EvalExpr(until, EvalStmt(repeat, denv));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  EvalForStmt : AST`ForStmt * DynEnv -> DynEnv
  EvalForStmt(mk_AST`ForStmt(start, stop, stmt), denv) ==
    let denv' = EvalAssignStmt(start, denv) in
    EvalForLoop(start.lhs, EvalExpr(stop, denv'), stmt, denv')
  pre pre_EvalAssignStmt(start, denv) and
      pre_EvalExpr(stop, EvalAssignStmt(start, denv));

  EvalForLoop : AST`Variable * AST`Value * AST`Stmt * DynEnv -> DynEnv
  EvalForLoop(mk_AST`Variable(id), val, stmt, denv) ==
    if denv(id).val <= val.val
      then let denv' = EvalStmt(stmt, denv)
           in EvalForLoop(mk_AST`Variable(id), val, stmt, 
                          denv' ++ {id |-> mk_AST`IntVal(denv'(id).val + 1)})
      else denv
  pre pre_EvalStmt(stmt, denv)
  measure LoopParInc;
  
  LoopParInc: AST`Variable * AST`Value * AST`Stmt * DynEnv -> nat
  LoopParInc(mk_AST`Variable(id), val, -, denv) ==
    val.val - denv(id).val;
                                                                                                                                                                                                                                                                                                                                                      
  EvalExpr : AST`Expr * DynEnv -> AST`Value
  EvalExpr(ex, denv) ==
    cases ex :
      mk_AST`BoolVal(-),
      mk_AST`IntVal(-)         -> ex,
      mk_AST`Variable(id)      -> denv(id),
      mk_AST`BinaryExpr(-,-,-) -> EvalBinaryExpr(ex, denv)
    end
  pre is_AST`BinaryExpr(ex) => pre_EvalBinaryExpr(ex, denv);

  EvalBinaryExpr : AST`BinaryExpr * DynEnv -> AST`Value
  EvalBinaryExpr(mk_AST`BinaryExpr(lhs, op, rhs), denv) ==
    let v1 = EvalExpr(lhs, denv).val,
        v2 = EvalExpr(rhs, denv).val 
    in cases op :
       <Add> -> mk_AST`IntVal(v1 + v2),
       <Sub> -> mk_AST`IntVal(v1 - v2),
       <Div> -> mk_AST`IntVal(v1 div v2),
       <Mul> -> mk_AST`IntVal(v1 * v2),
       <Lt> ->  mk_AST`BoolVal(v1 < v2),
       <Gt> ->  mk_AST`BoolVal(v1 > v2),
       <Eq> ->  mk_AST`BoolVal(v1 = v2),
       <And> -> mk_AST`BoolVal(v1 and v2),
       <Or> ->  mk_AST`BoolVal(v1 or v2)
    end
  pre op = <Div> => EvalExpr(rhs, denv).val <> 0;

end DYNSEM
             
~~~
{% endraw %}

### statsem.vdmsl

{% raw %}
~~~
                                                                                                                                                                      
module STATSEM

imports from AST all

exports all

definitions

types

  StatEnv = map AST`Identifier to AST`Type;
                                                                                                                                                                                                                  
functions

  wf_Program : AST`Program -> bool
  wf_Program(mk_AST`Program(decls, stmt)) ==
    wf_Declarations(decls) and wf_Stmt(stmt, get_Declarations(decls));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
wf_Declarations : seq of AST`Declaration -> bool
wf_Declarations(decls) ==
  (forall i1, i2 in set inds decls & 
    i1 <> i2 => decls(i1).id <> decls(i2).id) and
  (forall i in set inds decls & 
    decls(i).val <> nil => 
    ((is_AST`BoolVal(decls(i).val) and decls(i).tp = <BoolType>) or 
     (is_AST`IntVal(decls(i).val) and decls(i).tp = <IntType>)));

get_Declarations : seq of AST`Declaration -> StatEnv
get_Declarations(decls) ==
  {id |-> tp | mk_AST`Declaration(id, tp, -) in set elems decls};
                                                                                                                          
wf_Stmt : AST`Stmt * StatEnv -> bool
wf_Stmt(stmt, senv) ==
  cases true :
    (is_AST`BlockStmt(stmt))  -> wf_BlockStmt(stmt, senv),
    (is_AST`AssignStmt(stmt)) -> let mk_(wf_ass, -) = 
                                     wf_AssignStmt(stmt, senv)
                                 in wf_ass,
    (is_AST`CondStmt(stmt))   -> wf_CondStmt(stmt, senv),
    (is_AST`ForStmt(stmt))    -> wf_ForStmt(stmt, senv),
    (is_AST`RepeatStmt(stmt)) -> wf_RepeatStmt(stmt, senv),
    others                -> false
  end;

wf_BlockStmt : AST`BlockStmt * StatEnv -> bool
wf_BlockStmt(mk_AST`BlockStmt(decls, stmts), senv) ==
  wf_Declarations(decls) and 
  wf_Stmts(stmts, senv ++ get_Declarations(decls));

wf_Stmts : seq of AST`Stmt * StatEnv -> bool
wf_Stmts(stmts, senv) ==
  forall stmt in set elems stmts & wf_Stmt(stmt, senv);
                                                                                                                                                                                                                   
wf_AssignStmt : AST`AssignStmt * StatEnv -> bool * [AST`Type]
wf_AssignStmt(mk_AST`AssignStmt(lhs, rhs), senv) ==
  let mk_(wf_var, tp_var) = wf_Variable(lhs, senv),
      mk_(wf_ex, tp_ex) = wf_Expr(rhs, senv)
  in mk_(wf_ex and wf_var and tp_var = tp_ex, tp_var);
                                                                                                              
wf_CondStmt : AST`CondStmt * StatEnv -> bool
wf_CondStmt(mk_AST`CondStmt(guard, thenst, elsest), senv) ==
  let mk_(wf_ex, tp_ex) = wf_Expr(guard, senv)
  in wf_ex and tp_ex = <BoolType> and 
     wf_Stmt(thenst, senv) and wf_Stmt(elsest, senv);

wf_RepeatStmt : AST`RepeatStmt * StatEnv -> bool
wf_RepeatStmt(mk_AST`RepeatStmt(repeat, until), senv) ==
  let mk_(wf_ex, tp_ex) = wf_Expr(until, senv)
  in wf_ex and tp_ex = <BoolType> and wf_Stmt(repeat, senv);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
wf_ForStmt : AST`ForStmt * StatEnv -> bool
wf_ForStmt(mk_AST`ForStmt(start, stop, stmt), senv) ==
  let mk_(wf_ass, tp_ass) = wf_AssignStmt(start, senv),
      mk_(wf_ex, tp_ex) = wf_Expr(stop, senv)
  in wf_ass and wf_ex and tp_ass = <IntType> and tp_ex = <IntType> and 
     wf_Stmt(stmt, senv);
                                                                                                                                                 
wf_Expr : AST`Expr * StatEnv -> bool * [AST`Type]
wf_Expr(ex, senv) ==
  cases true :
    (is_AST`BoolVal(ex))    -> mk_(true, <BoolType>),
    (is_AST`IntVal(ex))     -> mk_(true, <IntType>),
    (is_AST`Variable(ex))   -> wf_Variable(ex, senv),
    (is_AST`BinaryExpr(ex)) -> wf_BinaryExpr(ex, senv),
    others                  -> mk_(false, <IntType>)
  end;

wf_Variable : AST`Variable * StatEnv -> bool * [AST`Type]
wf_Variable(mk_AST`Variable(id), senv) ==
  if id in set dom senv 
  then mk_(true, senv(id))
  else mk_(false, nil);
                                                                                                                                                                                                       
wf_BinaryExpr : AST`BinaryExpr * StatEnv -> bool * [AST`Type]
wf_BinaryExpr(mk_AST`BinaryExpr(lhs, op, rhs), senv) ==
  let mk_(wf_lhs, tp_lhs) = wf_Expr(lhs, senv), 
      mk_(wf_rhs, tp_rhs) = wf_Expr(rhs, senv)
  in cases op :
     <Add>, <Sub>, <Div>, <Mul> -> 
       mk_(wf_lhs and wf_rhs and 
       tp_lhs = <IntType> and tp_rhs = <IntType>,
           <IntType>),
     <Lt>, <Gt>, <Eq> ->
       mk_(wf_lhs and wf_rhs and 
       tp_lhs = <IntType> and tp_rhs = <IntType>,
           <BoolType>),
     <And>, <Or> ->
       mk_(wf_lhs and wf_rhs and 
       tp_lhs = <BoolType> and tp_rhs = <BoolType>,
           <BoolType>),
     others -> mk_(false, nil)
     end;
      
end STATSEM
             
~~~
{% endraw %}

### Test.vdmsl

{% raw %}
~~~
                                         
module Test

imports 
from AST all,
from STATSEM all,
from DYNSEM all
 
exports all
definitions 

values 

  binexpr: AST`Expr = 
           mk_AST`BinaryExpr(mk_AST`IntVal(4),
                             <Add>,
                             mk_AST`IntVal(5))
functions

RunTypeCheck: () -> bool * [AST`Type]
RunTypeCheck() ==
  STATSEM`wf_Expr(binexpr,{|->});
  
RunEval: () -> AST`Value
RunEval() ==
  DYNSEM`EvalExpr(binexpr,{|->})
  
end Test
            
~~~
{% endraw %}

### ast.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                             
module AST

exports all

definitions

types

  Program :: decls : seq of Declaration
             stmt  : Stmt;
                                                                                                                                   
  Declaration :: id  : Identifier
                 tp  : Type
                 val : [Value];
                                                                                                                                                                                                                                                   
  Identifier = seq1 of char;

  Type = <BoolType> | <IntType> ;

  Value = BoolVal | IntVal;

  BoolVal :: val : bool;

  IntVal :: val : int;
                                                                                                                                                                                                                                                                                                                                                                   
  Stmt = BlockStmt | AssignStmt | CondStmt | ForStmt | RepeatStmt;
                                                                                                                                
  BlockStmt :: decls : seq of Declaration
               stmts : seq1 of Stmt;
                                                                                                                                                                 
  AssignStmt :: lhs : Variable
                rhs : Expr;

  Variable :: id : Identifier;
                                                                                                                                                                                                
  Expr = BinaryExpr | Value | Variable;

  BinaryExpr :: lhs : Expr
                op  : Operator
                rhs : Expr;
                                                                                                                                                                                                                                        
  Operator = <Add> | <Sub> | <Div> | <Mul> | <Lt> | <Gt> | <Eq> | <And> | <Or>;
                                                                                                                   
  CondStmt :: guard  : Expr
              thenst : Stmt
              elsest : Stmt;
                                                                                                                                                                                                                                                                                            
  ForStmt :: start : AssignStmt
             stop  : Expr
             stmt  : Stmt;
                                                                                                                       
  RepeatStmt :: repeat : Stmt
                until  : Expr;
                
end AST
             
~~~
{% endraw %}

