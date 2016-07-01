---
layout: default
title: access-controlPP
---

## access-controlPP
Author: Jeremy Bryans and John Fitzgerald



This specification describes access control and policies for restricting this.
Details of the specification may be found in:   
1. Formal Engineering of Access Control Policies in VDM++ Jeremy W. Bryans and 
John S. Fitzgerald. In proceedings of 9th International Conference on Formal 
Engineering Methods (ICFEM 2007). Boca Raton, USA, November 2007. pp 37--56
 
2. A Formal Approach to Dependable Evolution of Access Control Policies in 
Dynamic Collaborations Jeremy W. Bryans, John S. Fitzgerald and Panos Periorellis. 
In Proceedings of the 37th Annual IEEE/IFIP International Conference on Dependable 
Systems and Networks, pp 352-353, Supplemental Volume. June 25-28, 2007. Edinburgh, UK
 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new Test().Run()|


### Env.vdmpp

{% raw %}
~~~
class Env

instance variables 
 
senv : map FExp`Id to FExp`SType;
denv : map FExp`Id to FExp`Val;

operations

public Env: map FExp`Id to FExp`SType * map FExp`Id to FExp`Val ==> Env
Env(s,d) ==
  (senv := s;
   denv := d;
  );

public GetSenv: () ==> map FExp`Id to FExp`SType
GetSenv() ==
  return senv;

public GetDenv: () ==> map FExp`Id to FExp`Val
GetDenv() ==
  return denv;

pure public GetVal: FExp`Id ==> FExp`Val
GetVal(id) ==
  return denv(id)
pre id in set dom denv;

public GetAVal:FExp`Id * FExp`Id ==> FExp`Val
GetAVal(id,index) ==
  return denv(id)(index)
pre id in set dom denv and index in set dom denv(id);

public GetSType: FExp`Id ==> FExp`SType
GetSType(id) ==
  return senv(id)
pre id in set dom denv;

public GetSAType: FExp`Id ==> FExp`AType
GetSAType(id) ==
  return senv(id)
pre id in set dom denv;

public GetAType:FExp`Id * FExp`Id ==> FExp`SType
GetAType(id,index) ==
  return senv(id)(index)
pre id in set dom denv and index in set dom denv(id);

end Env
  
~~~
{% endraw %}

### Evaluater.vdmpp

{% raw %}
~~~
class Evaluator

-- Evaluator is the "top level" class.  It receives an access control
-- request and returns a response.

instance variables

pdp : PDP;       -- an object of class PDP --- Policy Decision Point
env : Env;       -- an object of class Env
req : Request;   -- a request 
inst: Inst;

types 

Inst :: map FExp`UnId to FExp`Id

values

requester : FExp`UnId = mk_FExp`UnId(<requester>);
resource  : FExp`UnId = mk_FExp`UnId(<resource>);
-- action    : FExp`UnVar = mk_FExp`UnVar(<action>);

operations

public Evaluator: Request * PDP * Env ==> Evaluator
Evaluator(r,p,e) ==
 ( req := r;
   pdp := p;
   env := e;
   inst := mk_Inst({requester |-> req.GetSubject(), 
     resource |-> req.GetResource()})
 );

-- evaluate operates on the request that is part of Evaluator state. 

public evaluate: () ==> PDP`Effect
evaluate() ==
  if (pdp.GetpolicyCombAlg() = <denyOverrides>) then  
    return(evaluatePDPDenyOverrides())
  elseif (pdp.GetpolicyCombAlg() = <permitOverrides>) then  
    return(evaluatePDPPermitOverrides())
  else
    return(<NotApplicable>);

evaluatePDPDenyOverrides : () ==> PDP`Effect 
evaluatePDPDenyOverrides() ==
  if exists p in set pdp.Getpolicies() & 
    (evaluatePol(p) = <Deny> or evaluatePol(p) = <Indeterminate> )
  then return(<Deny>)
  elseif exists p in set pdp.Getpolicies() & 
    evaluatePol(p) = <Permit>
  then return(<Permit>)
  else return(<NotApplicable>);

evaluatePDPPermitOverrides : () ==> PDP`Effect 
evaluatePDPPermitOverrides() ==
  if exists p in set pdp.Getpolicies() & 
    (evaluatePol(p) = <Permit> or evaluatePol(p) = <Indeterminate> )
  then return(<Permit>)
  elseif exists p in set pdp.Getpolicies() & 
    evaluatePol(p) = <Deny>
  then return(<Deny>)
  else return(<NotApplicable>);

evaluateRule : PDP`Rule ==> PDP`Effect 
evaluateRule(rule) ==
  if targetmatch(rule.target) then 
     if rule.cond = nil 
     then return(rule.effect)
     else  if (rule.cond).wfExpr(env) then
       cases (rule.cond).EvaluateBind(req,env):
             true   -> return(rule.effect),
             false  -> return(<NotApplicable>),
            <Indet> -> return(<Indeterminate>),
            others -> error
       end
           else return <NotApplicable> 
  else
    return(<NotApplicable>);
  
evaluatePol : PDP`Policy ==> PDP`Effect
evaluatePol(pol) ==
   if targetmatch(pol.target) then
     cases pol.ruleCombAlg:
           <denyOverrides>   -> return(evaluateRulesDenyOverrides(pol.rules)),
           <permitOverrides> -> return(evaluateRulesPermitOverrides(pol.rules)),
            others -> return(<NotApplicable>)
     end
   else  -- target does not match
     return(<NotApplicable>);

evaluateRulesDenyOverrides : set of PDP`Rule ==> PDP`Effect
evaluateRulesDenyOverrides(rs) ==
  if exists r in set rs &
    evaluateRule(r) = <Deny>
  then return(<Deny>)
  elseif exists r in set rs & 
    (evaluateRule(r) = <Indeterminate> and pdp.GetEffect(r) = <Deny> )
  then return(<Indeterminate>)
  elseif exists r in set rs &
    evaluateRule(r) = <Permit>
  then return(<Permit>)
  elseif exists r in set rs & 
    (evaluateRule(r) = <Indeterminate> and pdp.GetEffect(r) = <Permit> )
  then return(<Indeterminate>)
  else return(<NotApplicable>);

evaluateRulesPermitOverrides : set of PDP`Rule ==> PDP`Effect
evaluateRulesPermitOverrides(rs) ==
  if exists r in set rs &
    evaluateRule(r) = <Permit>
  then return(<Permit>)
  elseif exists r in set rs & 
    (evaluateRule(r) = <Indeterminate> and pdp.GetEffect(r) = <Permit> )
  then return(<Indeterminate>)
  elseif exists r in set rs & 
    evaluateRule(r) = <Deny>
  then return(<Deny>)
  elseif exists r in set rs & 
    (evaluateRule(r) = <Indeterminate> and pdp.GetEffect(r) = <Deny> )
  then return(<Indeterminate>)
  else return(<NotApplicable>);

-- targetmatch has been adapted.  If any of the sets in the target of 
-- the (rule|policy) is empty then they match anything.  

targetmatch : PDP`Target ==> bool
targetmatch(tgt) ==
     if ((tgt.subjects  = {}) or (req.GetSubject() in set tgt.subjects)) and
        ((tgt.resources = {}) or (req.GetResource() in set tgt.resources)) and
        ((tgt.actions = {})   or (req.GetActions() inter tgt.actions) <> {}) 
     then return true 
     else return false;


end Evaluator
~~~
{% endraw %}

### FExp.vdmpp

{% raw %}
~~~
class FExp

instance variables

fexp : Expr; 

operations

public FExp : Expr ==> FExp
FExp(fe) ==
 fexp := fe;

public GetExp: () ==> Expr
GetExp() == 
  return fexp;

types

public AtomicVal = bool | int | <Indet>;
public BoolArray = map Id to bool;
public IntArray = map Id to int;
public UnArray = map Id to <Indet>;
public StructuredVal = BoolArray | IntArray | UnArray;
public Val = AtomicVal | StructuredVal;



public Expr = Id | UnId | BoolExpr | ArithExpr | ArrayLookup;

public Id = token;

public UnId :: <requester>|<resource>; --<action>;

-- Expressions returning true or false
public BoolExpr = RelExpr | Unary | Infix | Equal | boolLiteral;

public RelExpr :: left  : Expr
                  op    : <LT>|<GT>
	              right : Expr; 

public Unary :: op   : <NOT>
                body : Expr;

public Infix :: left  : Expr
                op    : <AND>|<OR>
                right : Expr;

public Equal ::  left  : Expr
                 op    : <EQ>
	             right : Expr;

public boolLiteral :: <TRUE>|<FALSE>;

-- Expression returning integer
public ArithExpr = intLiteral; -- | ArithInfix

public intLiteral :: <ZERO>|<ONE>|<TWO>|<THREE>|<FOUR>|<FIVE>|<SIX>|<SEVEN>|<EIGHT>|<NINE>|<TEN>;


public ArrayLookup :: aname : Id | UnId	
                      index : Id | UnId; 

operations

-- binds the unbound variables within an expression.

public BindExpr: Expr * Request ==> FExp`Expr 
BindExpr(fe,req) == 
 cases fe:
  mk_UnId(<requester>) -> return req.GetSubject(),
  mk_UnId(<resource>) -> return req.GetResource(),
  mk_RelExpr(left,op,right) -> return mk_RelExpr(BindExpr(left,req), op, BindExpr(right,req)), 
  mk_Unary(op,body) -> return mk_Unary(op,BindExpr(body,req)),
  mk_Infix(left,op,right) -> return mk_Infix(BindExpr(left,req), op, BindExpr(right,req)), 
--mk_ArrExp(left,op,right) -> ...
  mk_intLiteral(-) -> return fe,
  mk_boolLiteral(-) -> return fe,
  mk_ArrayLookup(aname,index) -> return mk_ArrayLookup(BindExpr(aname,req),BindExpr(index,req)),
  others -> return fe
 end;

-- Evaluate returns the meaning of an expression,  wrt an environment 

---------------------------------------
-- Dynamic Semantics for Expressions --
---------------------------------------

public EvaluateBind : Request * Env ==> Val
EvaluateBind(req,env) == 
  let expr = BindExpr(fexp,req) in 
    Evaluate(expr,env);

Evaluate : Expr * Env ==> Val
Evaluate(expr,env) == 
    cases expr :  
      mk_RelExpr(-,-,-)       -> MRelExpr(expr,env),
      mk_Unary(-,-)           -> MUnary(expr,env),
      mk_Infix(-,-,-)         -> MInfix(expr,env), 
      mk_Equal(-,-,-)         -> MEqual(expr,env),
--mk_ArrExp(-,-,-) -> ... 
      mk_boolLiteral(-)       -> MLiteral(expr), 
      mk_intLiteral(-)        -> MLiteral(expr),
      mk_ArrayLookup(-,-)     -> MArrayLookup(expr,env),
    others                    -> MId(expr,env)
  end;

pure private MId : Id * Env ==> Val
MId(Id,env) == 
	return env.GetVal(Id); 

MRelExpr : RelExpr * Env ==> Val
MRelExpr(exp,env) == 
  cases exp:
   mk_RelExpr(-,<GT>,-)  -> return (EvaluateGT(exp.left,exp.right,env)),
   mk_RelExpr(-,<LT>,-)  -> return (EvaluateLT(exp.left,exp.right,env)),
   others -> error
  end;

EvaluateLT: Expr * Expr * Env ==> Val
EvaluateLT(exp1,exp2,env) == 
  return (Evaluate(exp1,env) < Evaluate(exp2,env));

EvaluateGT: Expr * Expr * Env ==> Val
EvaluateGT(exp1,exp2,env) == 
  return (Evaluate(exp1,env) > Evaluate(exp2,env));

MUnary : Unary * Env ==> Val
MUnary(unary,env) == 
	return not (Evaluate(unary.body,env));

MInfix : Infix * Env ==> Val
MInfix(exp,env) == 
  cases exp:
   mk_Infix(-,<AND>,-) -> return (EvaluateAND(exp.left,exp.right,env)),
   mk_Infix(-,<OR>,-)  -> return (EvaluateOR(exp.left,exp.right,env)),
   others -> error
  end;

EvaluateAND: Expr * Expr * Env ==> Val
EvaluateAND(exp1,exp2,env) ==
  return (Evaluate(exp1,env) and Evaluate(exp2,env));

MEqual : Equal * Env ==> Val
MEqual(exp,env) == 
   return (Evaluate(exp.left, env) = Evaluate(exp.right,env));

-- order of evaluation is left to right, as stipulated by XACML standard

EvaluateOR: Expr * Expr * Env ==> Val
EvaluateOR(exp1,exp2,env) ==
  if (Evaluate(exp1,env))
  then return true
  else return Evaluate(exp2,env);

MArrayLookup : ArrayLookup * Env ==> Val
MArrayLookup(mk_ArrayLookup(aname,index),env) == 
   return (MId(aname,env))(index)
pre index in set dom MId(aname,env);

functions

 MLiteral : boolLiteral | intLiteral -> Val
 MLiteral(exp) == 
   cases exp:
     mk_boolLiteral(<TRUE>) -> true,
      mk_boolLiteral(<FALSE>)-> false,
      mk_intLiteral(<ZERO>)  -> 0,
      mk_intLiteral(<ONE>)   -> 1,
      mk_intLiteral(<TWO>)   -> 2,
      mk_intLiteral(<THREE>) -> 3,
      mk_intLiteral(<FOUR>)  -> 4,
      mk_intLiteral(<FIVE>)  -> 5,
      mk_intLiteral(<SIX>)   -> 6,
      mk_intLiteral(<SEVEN>) -> 7,
      mk_intLiteral(<EIGHT>) -> 8,
      mk_intLiteral(<NINE>)  -> 9,
     others                             -> 10
   end;


--------------------------------------
-- Static Semantics for Expressions --
--------------------------------------

-- types for TP and WF judgements

types

public SType = <B>|<I>|<U>|AType|<Err>;

public AType = map Id to <B>|<I>|<U>;

operations -- for TP and WF judgements

public wfExpr : Env ==> bool
wfExpr(env) ==
  return exprTp(fexp,env) = <B>;

private exprTp : Expr * Env ==> SType
exprTp(ex, env) ==
  cases ex:
    mk_Unary(-,-) 		-> wfUnary(ex,env),
    mk_Infix(-,-,-) 	-> wfInfix(ex,env),
    mk_RelExpr(-,-,-)	-> wfRelExpr(ex,env),
--    mk_ArithExpr()
    mk_Equal(-,-,-)	-> wfEqual(ex,env), 
    mk_boolLiteral(-)       -> wfLiteral(ex),
    mk_intLiteral(-)       -> wfLiteral(ex),
    mk_UnId(-)          -> wfUnId(ex),
    mk_ArrayLookup(-,-) -> wfArrayLookup(ex,env),
    others					-> wfId(ex,env)
  end;

private wfInfix : Infix * Env ==> SType
wfInfix(mk_Infix(e1,-,e2), env) ==
  if exprTp(e1, env) = <B> and exprTp(e2, env) = <B>
  then return <B>
  else return <Err>;


private wfUnary : Unary * Env ==> SType
wfUnary(mk_Unary(-,e), env) ==
  if exprTp(e, env) = <B>
  then return <B>
  else return <Err>;

private wfRelExpr : RelExpr * Env ==> SType
wfRelExpr(mk_RelExpr(e1,-,e2), env) ==
  if exprTp(e1, env) = <I> and exprTp(e2, env) = <I>
  then return <B>
  else return <Err>;

private wfLiteral : boolLiteral | intLiteral ==> SType
wfLiteral(e) ==
   cases e:
    mk_boolLiteral(-) -> return <B>,
    mk_intLiteral(-)  -> return <I>,
    others -> return <Err>
   end;

private wfEqual: Equal * Env ==> SType
wfEqual(mk_Equal(e1,-,e2), env) ==
  if (exprTp(e1, env) = <B> and exprTp(e2, env) = <B>) or
     (exprTp(e1, env) = <I> and exprTp(e2, env) = <I>) or
     (exprTp(e1, env) = <U> and exprTp(e2, env) = <U>)
  then return <B>
  else return <Err>;

private wfId: Id * Env ==> SType
wfId(e,env) ==
  if (e in set dom env.GetSenv())  
  then let tp = env.GetSType(e) in
           if tp = <B> or tp = <I> or tp = <U>
           then return env.GetSType(e)
           else return <Err>            
  else return <Err>;

wfUnId : UnId  ==> SType
wfUnId(e) ==  
  cases e:
   mk_UnId(<requester>)	-> return <U>,
   mk_UnId(<resource>)	-> return <U>,
--   mk_UnId(<action>)	-> return <U>,
   others				-> return <Err>
  end;  

wfArrayLookup : ArrayLookup * Env ==> SType 
wfArrayLookup(mk_ArrayLookup(id, index),env) == 
  if (id in set dom env.GetSenv())  -- Id is in the env
  then let tp = env.GetSType(id) in  -- get the type of Id in env
           if tp = <B> or tp = <I> or tp = <U>
           then return <Err> -- Id is not an array in the env 
           elseif index in set dom env.GetSenv()(id) -- assuming Id points to an array in senv
				then return env.GetAType(id,index) -- Get type of index in map
				else return <Err>
  else return <Err>;  


end FExp
~~~
{% endraw %}

### PDP.vdmpp

{% raw %}
~~~
class PDP 

instance variables 

policies : set of Policy;
policyCombAlg : CombAlg; 

operations

public PDP: set of Policy * CombAlg  ==> PDP
PDP(ps,pca) == 
 (policies := ps;
  policyCombAlg := pca
 );

types

public Permit = token;
public Deny = token;
public Null = token;
 
public CombAlg = <denyOverrides> | <permitOverrides>;
 
public Policy :: target : [Target]
                  rules : set of Rule
            ruleCombAlg : CombAlg;
 
public Rule :: target : [Target]  
               effect : Effect
                 cond : [FExp];

public Effect = <Permit> | <Deny> | <Indeterminate> | <NotApplicable>;   
              
public Target :: subjects : set of Subject
                resources : set of Resource
                  actions : set of Action;

public Action = FExp`Id;
public Subject = FExp`Id;
public Resource = FExp`Id;

operations

public GetpolicyCombAlg: () ==> CombAlg
GetpolicyCombAlg() ==
  return policyCombAlg;

public Getpolicies: () ==> set of Policy
Getpolicies() ==
  return policies;

public GetEffect: Rule ==> Effect
GetEffect(r) ==
  return r.effect;

end PDP
~~~
{% endraw %}

### Request.vdmpp

{% raw %}
~~~
class Request

instance variables
  
-- Request targets must have a single subject AND a single resource.   

subject  : PDP`Subject;
resource : PDP`Resource;
actions  : set of PDP`Action;

types

Inst :: map token to FExp`Id;

 operations

public Request: PDP`Subject * PDP`Resource * set of PDP`Action ==> Request
Request(s,r,aset) ==
 (subject  := s;
  resource := r;
  actions  := aset;
); 

public GetSubject: () ==> PDP`Subject
GetSubject() == 
  return subject;

public GetResource: () ==> PDP`Resource
GetResource() == 
  return resource;

public GetActions: () ==> set of PDP`Action
GetActions() == 
  return actions;

end Request
~~~
{% endraw %}

### Test.vdmpp

{% raw %}
~~~
class Test
	values

requester : FExp`UnId = mk_FExp`UnId(<requester>);
resource  : FExp`UnId = mk_FExp`UnId(<resource>);

Anne : FExp`Id = (mk_token("Anne"));
Bob : FExp`Id = (mk_token("Bob"));
Charlie : FExp`Id = (mk_token("Charlie"));
Dave : FExp`Id = (mk_token("Dave"));
Eric : FExp`Id = (mk_token("Eric"));
Fred : FExp`Id = (mk_token("Fred"));

write : FExp`Id = (mk_token("write"));
read : FExp`Id = (mk_token("read"));
create : FExp`Id = (mk_token("create"));
signoff : FExp`Id = (mk_token("signoff"));

lab_results_signed : FExp`Id =
  (mk_token("lab_results_signed"));

results_analysis_signed : FExp`Id =
  (mk_token("results_analysis_signed"));

Project1 : set of PDP`Subject = {Anne,Bob}; 
Project2 : set of PDP`Subject = {Bob,Charlie,Dave};
lab_technician : set of PDP`Subject = {Anne,Dave};
lab_manager  : set of PDP`Subject = {Bob,Charlie};

Company2 : set of PDP`Subject = {Eric, Fred}; 
Assessor : set of PDP`Subject = {Fred};

lab_results : FExp`Id = (mk_token("lab_results"));
results_analysis : FExp`Id = (mk_token("results_analysis"));
sc_assess : FExp`Id = (mk_token("sc_assess"));

doc1 : FExp`Id = (mk_token("doc1"));
doc2 : FExp`Id = (mk_token("doc2"));

signed : FExp`Id = (mk_token("signed"));

con_nt : FExp = new FExp(mk_FExp`Unary(<NOT>,mk_FExp`boolLiteral(<TRUE>)));
con_nf : FExp = new FExp(mk_FExp`Unary(<NOT>,mk_FExp`boolLiteral(<FALSE>)));
con_no : FExp = new FExp(mk_FExp`Unary(<NOT>,mk_FExp`intLiteral(<ONE>)));

-- on Project One, lab results can be created only by a lab
-- technician, and can be read by anybody on the project.  These are
-- project-wide.

project1_rule_nf : PDP`Rule = 
   mk_PDP`Rule(mk_PDP`Target(lab_technician,{lab_results},{create}),
           <Permit>, con_nf);

project1_rule_nt : PDP`Rule = 
   mk_PDP`Rule(mk_PDP`Target(lab_technician,{lab_results},{create}),
           <Permit>, con_nt);

project1_rule_no : PDP`Rule = 
   mk_PDP`Rule(mk_PDP`Target(lab_technician,{lab_results},{create}),
           <Permit>, con_no);

project1_rule2 : PDP`Rule = 
   mk_PDP`Rule(mk_PDP`Target(Project1,{lab_results},{read}),
           <Permit>, nil);


-- The project policy for the lab_results document is the combination
-- of these.
-- one policy for each exzpression that we test 

lab_results_project_policy_no : PDP`Policy = 
   mk_PDP`Policy(mk_PDP`Target(Project1,{lab_results},{}),
         {project1_rule_no, project1_rule2}, <denyOverrides>);
 

lab_results_project_policy_nt : PDP`Policy = 
   mk_PDP`Policy(mk_PDP`Target(Project1,{lab_results},{}),
         {project1_rule_nt, project1_rule2}, <denyOverrides>);
 

lab_results_project_policy_nf : PDP`Policy = 
   mk_PDP`Policy(mk_PDP`Target(Project1,{lab_results},{}),
         {project1_rule_nf, project1_rule2}, <denyOverrides>);
 
-- New policy 
-- Only a lab manager can sign these results off.   

lab_results_rule1 : PDP`Rule =
   mk_PDP`Rule(mk_PDP`Target(lab_manager,{lab_results},{signoff}),
           <Permit>, nil);

-- Also, after signoff, no one can write to the lab_results file. 

lab_results_rule2 : PDP`Rule =
    mk_PDP`Rule(mk_PDP`Target(Project1,{lab_results},{write}),
            <Deny>, new FExp(mk_FExp`ArrayLookup(signed,resource)));

lab_results_creator_policy : PDP`Policy = 
   mk_PDP`Policy(mk_PDP`Target(Project1,{lab_results},{}),
         {lab_results_rule1, lab_results_rule2}, <denyOverrides>);

-- New policy
-- From company 2, assessor_role writes the scale assessment.

scale_assess_write : PDP`Rule = 
    mk_PDP`Rule(mk_PDP`Target(Assessor,{sc_assess},{write}),
            <Permit>, nil);

-- From company 2, anyone can read the scale assessment.

scale_assess_read : PDP`Rule = 
    mk_PDP`Rule(mk_PDP`Target(Company2,{sc_assess},{read}),
            <Permit>, nil);

scale_assess_policy : PDP`Policy = 
   mk_PDP`Policy(mk_PDP`Target(Company2,{sc_assess},{}),
         {scale_assess_read, scale_assess_write}, <denyOverrides>);

gold_policy_no : PDP = 
    new PDP({lab_results_project_policy_no,lab_results_creator_policy,scale_assess_policy},
            <permitOverrides>);

gold_policy_nt : PDP = 
    new PDP({lab_results_project_policy_nt,lab_results_creator_policy,scale_assess_policy},
            <permitOverrides>);

gold_policy_nf : PDP = 
    new PDP({lab_results_project_policy_nf,lab_results_creator_policy,scale_assess_policy},
             <permitOverrides>);

gold_policy_project_results : PDP = 
    new PDP({lab_results_project_policy_nf,lab_results_creator_policy}, <permitOverrides>);

gold_policy_results_scale : PDP = 
    new PDP({lab_results_creator_policy,scale_assess_policy}, <permitOverrides>);




	operations

  public Run: () ==> PDP`Effect
  Run () ==
--  ( dcl pdp : PDP := gold_policy_no;
--  ( dcl pdp : PDP := gold_policy_nt;
--  ( dcl pdp : PDP := gold_policy_nf;
--  ( dcl pdp : PDP := gold_policy_project_results;
  ( dcl pdp : PDP := gold_policy_results_scale;
    dcl s : FExp := new FExp(mk_token("signed"));
    dcl lr : FExp := new FExp(mk_token("lab_results"));
    dcl req : Request := new Request(Anne,lab_results,{create});
    dcl env : Env := new Env({s.GetExp() |-> {lr.GetExp() |-> <B>}},
                             {s.GetExp() |-> {lr.GetExp() |-> true}}); 
    dcl eval : Evaluator := new Evaluator(req,pdp,env);
    return eval.evaluate()
  );

end Test
~~~
{% endraw %}

