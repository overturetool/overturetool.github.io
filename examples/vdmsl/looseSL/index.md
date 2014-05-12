---
layout: default
title: looseSL
---

Author: Peter Gorm Larsen


This VDM model is made by Peter Gorm Larsen as an exploration of how
the looseness in a subset of VDM-SL. So this is illustrating how it is
possible to explore all models is a simple fashion including the
possibility of recursive functions where looseness is involved inside
each recursive call. A paper about this work have been published as:

Peter Gorm Larsen, Evaluation of Underdetermined Explicit Expressions,
Formal Methods Europe'94: Industrial Benefit of Formal Methods,
Springer Verlag, October 1994.
|  |           |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| DEFAULT`LooseEvalExpr(expr2)|
|Entry point     :| DEFAULT`LooseEvalExpr(mk_NumLit(8))|
|Entry point     :| DEFAULT`LooseEvalExpr(expr)|


###as.vdmsl

{% raw %}
~~~



------------------------------------------------------------------------------------------ Abstract Syntax Definitions ----------------------------------------------------------------------------------------------
types

------------------------------------------------------------------------------------------------- Definitions -------------------------------------------------------------------------------------------------------
Definitions :: valuem : seq of ValueDef               fnm : map Name to ExplFnDef;


------------------------------------------------------------------------------------------------- Value Definitions -------------------------------------------------------------------------------------------------
ValueDef :: pat : Pattern                                                 val : Expr;
------------------------------------------------------------------------------------------------- Functions Definitions ---------------------------------------------------------------------------------------------
ExplFnDef :: nm      : Name             pat     : Pattern             body    : Expr;
------------------------------------------------------------------------------------------------- Expressions -------------------------------------------------------------------------------------------------------
Expr = LetExpr | LetBeSTExpr| IfExpr | CasesExpr |       UnaryExpr | BinaryExpr | SetEnumerationExpr |       ApplyExpr | Literal | Name | BracketedExpr ;            

BracketedExpr :: expr : Expr;
LetExpr :: lhs   : Pattern           rhs   : Expr           body  : Expr;
LetBeSTExpr :: lhs : Bind                                                    St  : Expr               In  : Expr;
IfExpr :: test   : Expr                                                    cons   : Expr          altn   : Expr;
CasesExpr :: sel    : Expr             altns  : seq of CaseAltn              Others : [Expr];
CaseAltn :: match : Pattern            body  : Expr;
UnaryExpr  :: opr : UnaryOp              arg : Expr;
UnaryOp = <NUMMINUS>;
BinaryExpr :: left  : Expr              opr   : BinaryOp              right : Expr;
BinaryOp = <EQ> | <NUMPLUS> | <NUMMINUS> | <NUMMULT> | <SETMINUS> ;
SetEnumerationExpr :: els : seq of Expr;
ApplyExpr :: fct : Name             arg : Expr;
Name :: ids : seq of Id;
Id = seq of char;
------------------------------------------------------------------------------------------- Patterns and Bindings ---------------------------------------------------------------------------------------------------
Pattern = PatternName | MatchVal | SetPattern;
PatternName :: nm : [(Name * Position)];
MatchVal :: val : Expr;
SetPattern = SetEnumPattern | SetUnionPattern;
SetEnumPattern :: Elems : seq of Pattern;
SetUnionPattern :: lp : Pattern                   rp : Pattern;
Position = nat * nat;
Bind = SetBind;
SetBind :: pat : Pattern           Set : Expr;
------------------------------------------------------------------------------------------- Literals ----------------------------------------------------------------------------------------------------------------
Literal = BoolLit | NumLit;
BoolLit:: val : bool;
NumLit :: val : int
values
 pat : Pattern = mk_PatternName(mk_(mk_Name(["x"]),mk_(1,1)));
 sexpr : Expr = mk_SetEnumerationExpr([mk_NumLit(1),mk_NumLit(2)]); expr : Expr = mk_LetBeSTExpr(mk_SetBind(pat,sexpr),                               mk_BoolLit(true),                               mk_Name(["x"]));
 expr2 : Expr = mk_BinaryExpr(expr, <NUMPLUS>, expr);


~~~
{% endraw %}

###auxil.vdmsl

{% raw %}
~~~


operations
SeqOfSetOf2SetOfSeqOf : seq of set of (VAL | BlkEnv) ==>                         set of seq of (VAL | BlkEnv)SeqOfSetOf2SetOfSeqOf(seq_ls) ==( dcl res_s : set of seq of (VAL | BlkEnv) := { [] } ,      tmpres_s : set of seq of (VAL | BlkEnv) ;  for tmp_s in seq_ls do   ( tmpres_s := {} ;    for all tmp_l in set res_s do      for all e in set tmp_s do        tmpres_s := tmpres_s union { tmp_l ^ [ e ] } ;    res_s := tmpres_s   );  return res_s)
functions
  Consistent: LVAL * Model -> LVAL  Consistent(lval,bind) ==    {mk_(val,b munion bind)    | mk_(val,b) in set lval &      forall id in set (dom b inter dom bind) &             b(id) = bind(id)};
  SetToSeq: set of VAL +> seq of VAL  SetToSeq(s) ==    if s = {}    then []    else let e in set s         in           [e] ^ SetToSeq(s\{e}) post s = elems RESULT;

  Permute: seq of VAL -> set of seq of VAL  Permute(l) ==    cases l:      [],      [-]    -> { l },      others -> dunion { { [ l(i) ] ^ j | j in set Permute(RestSeq(l, i))} |                            i in set inds l }    end;
  RestSeq: seq of VAL * nat1 -> seq of VAL  RestSeq(l,i) ==    [ l(j) | j in set (inds l \ { i }) ];
  PatternIds: Pattern +> set of UniqueId  PatternIds(pat) ==    cases pat:      mk_PatternName(mk_(nm,pos)) -> {mk_(nm,pos,FnInfo())},      mk_MatchVal(-)              -> {},      mk_SetEnumPattern(els)      -> dunion {PatternIds(elem)                                            |elem in set elems els},      mk_SetUnionPattern(lp,rp)   -> PatternIds(lp) union                                     PatternIds(rp)    end

~~~
{% endraw %}

###env.vdmsl

{% raw %}
~~~

types
  ENVL = seq of ENV;
  ENV = seq of BlkEnv;
  BlkEnv = seq of NameVal;
  NameVal = UniqueId * VAL;
  UniqueId = (Name * Position * ([Name * VAL]));
  LVAL = set of (VAL * Model);
  Model = map UniqueId to VAL;
  VAL = NUM | BOOL | SET;
  NUM :: v : int;
  BOOL :: v : bool;
  SET :: v : set of VAL

state Sigma of  env_l: ENVL  val_m: map UniqueId to LVAL  fn_m: map Name to (Pattern * Expr)  curfn: seq of (Name * VAL)  fnparms: set of UniqueIdinit s ==  s = mk_Sigma([[]],               {|->},               {|->},               [],	       {})end

operations
  CreateContext: Definitions ==> ()  CreateContext(mk_Definitions(valuem,fnm)) ==    (InstallValueDefs(valuem);     InstallFnDefs(fnm));
  InstallValueDefs: seq of ValueDef ==> ()  InstallValueDefs(val_l) ==    for mk_ValueDef(pat,expr) in val_l do      let lval = LooseEvalExpr(expr)      in        for all mk_(val,model) in set lval do	  let env_s = PatternMatch(pat,val)	  in	    val_m := Extend(val_m,	             {id |-> {mk_(Look(env,id),model)|env in set env_s}		     | id in set dinter {SelDom(env)| env in set env_s}});


  InstallFnDefs: map Name to ExplFnDef ==> ()  InstallFnDefs(fn_marg) ==    fn_m := {nm |-> mk_(fn_marg(nm).pat,fn_marg(nm).body)            | nm in set dom fn_marg};
  InstallCurFn: Name * VAL * set of UniqueId ==> ()  InstallCurFn(nm,val,patids) ==   (curfn := [mk_(nm,val)] ^ curfn;    fnparms := fnparms union patids);
  LeaveCurFn: () ==> ()  LeaveCurFn() ==    curfn := tl curfn  pre curfn <> []

operations
  PopEnvL: () ==> ()  PopEnvL() ==    env_l := tl env_l;
  TopEnvL : () ==> ENV  TopEnvL () ==    return hd env_l;
  PushEmptyEnv : () ==> ()  PushEmptyEnv () ==    env_l := [ [] ] ^ env_l;
  PopBlkEnv : () ==> ()  PopBlkEnv () ==    env_l := [ tl hd env_l ] ^ tl env_l;
  PushBlkEnv : BlkEnv ==> ()  PushBlkEnv (benv) ==    env_l := [ [ benv ] ^ hd env_l ] ^ tl env_l;
  MkEmptyBlkEnv: () ==> BlkEnv  MkEmptyBlkEnv() ==    return [];
  CombineBlkEnv : BlkEnv * BlkEnv ==> BlkEnv  CombineBlkEnv ( env1,env2) ==    return env1 ^ env2;
  MkBlkEnv : (Name * Position) * VAL ==> BlkEnv  MkBlkEnv (mk_(nm,pos), val_v ) ==    let fninfo = FnInfo()    in      return [ mk_(mk_(nm, pos, fninfo), val_v)];
  FnInfo: () ==> [Name * VAL]  FnInfo() ==    if len curfn = 0    then return nil    else return hd curfn;
  LooseLookUp: Name ==> LVAL  LooseLookUp(nm) ==  (let topenv = TopEnvL()   in     for env in topenv do       for mk_(id,val) in env do         if SelName(id) = nm 	 then return {mk_(val, if id in set fnparms	                       then {|->}			       else {id |-> val})}	 else skip;   LookUpValueDefs(nm));
  LookUpValueDefs: Name ==> LVAL  LookUpValueDefs(nm) ==    (for all id in set dom val_m do      if SelName(id) = nm      then return {mk_(v,m munion {id |-> v}) | mk_(v,m) in set val_m(id)};     error); 
  LookUpFn: Name ==> Pattern * Expr  LookUpFn(nm) ==    return fn_m(nm)  pre nm in set dom fn_m
functions
  SelName: UniqueId +> Name  SelName(mk_(nm,-,-)) ==    nm;
  SelNameAndPos: UniqueId +> Name * Position  SelNameAndPos(mk_(nm,pos,-)) ==    mk_(nm,pos);
  SelDom: BlkEnv +> set of UniqueId  SelDom(blkenv) ==    {id| mk_(id,-) in set elems blkenv};
  Look: BlkEnv * UniqueId +> VAL  Look(env,id) ==    if env = []    then undefined    else let mk_(nm,val) = hd env         in	   if nm = id	   then val	   else Look(tl env, id)  pre exists mk_(nm,-) in set elems env & nm = id;
  Extend: (map UniqueId to LVAL) * (map UniqueId to LVAL) +>          (map UniqueId to LVAL)  Extend(val_m,upd_m) ==    val_m ++ {id |-> if id in set dom val_m                     then val_m(id) union upd_m(id)		     else upd_m(id)	     | id in set dom upd_m}


~~~
{% endraw %}

###expr.vdmsl

{% raw %}
~~~


operations
  LooseEvalExpr: Expr ==> LVAL  LooseEvalExpr(expr) ==    cases true :     (is_LetExpr(expr))                  -> LooseEvalLetExpr(expr),     (is_LetBeSTExpr(expr))              -> LooseEvalLetBeSTExpr(expr),     (is_IfExpr(expr))                   -> LooseEvalIfExpr(expr),     (is_CasesExpr(expr))                -> LooseEvalCasesExpr(expr),     (is_BinaryExpr(expr))               -> LooseEvalBinaryExpr(expr),     (is_SetEnumerationExpr(expr))       -> LooseEvalSetEnumerationExpr(expr),     (is_ApplyExpr(expr))                -> LooseEvalApplyExpr(expr),     (is_NumLit(expr)),     (is_BoolLit(expr))                  -> LooseEvalLiteral(expr),     (is_Name(expr))                     -> LooseLookUp(expr),     (is_BracketedExpr(expr))            -> LooseEvalBracketedExpr(expr),     others                              -> error    end;
  LooseEvalBracketedExpr : BracketedExpr ==> LVAL  LooseEvalBracketedExpr (mk_BracketedExpr(expr)) ==    LooseEvalExpr(expr);
  LooseEvalLetExpr : LetExpr ==> LVAL  LooseEvalLetExpr ( mk_LetExpr(pat,expr,in_e)) ==  ( dcl lval: LVAL := {};
    let val_lv = LooseEvalExpr(expr) in     for all mk_(val_v,m) in set val_lv do       let env_s = PatternMatch(pat,val_v) in         if env_s <> {}         then for all env in set env_s do	       (PushBlkEnv(env) ;                let in_lv = LooseEvalExpr(in_e) in                ( PopBlkEnv() ;                  lval := lval union Consistent(in_lv,m)                )              )         else error;  return lval);
  LooseEvalLetBeSTExpr : LetBeSTExpr ==> LVAL  LooseEvalLetBeSTExpr ( mk_LetBeSTExpr(lhs, st_e, in_e)) ==   (dcl lval : LVAL := {};    dcl em_s: set of (BlkEnv * Model) := {};
    for all mk_(env,m) in set EvalBind(lhs) do     (PushBlkEnv(env);     let st_lv = LooseEvalExpr(st_e) in       for all mk_(val,m2) in set Consistent(st_lv,m) do         if val = mk_BOOL(true)	 then em_s := em_s union {mk_(env,m2 munion m)};    PopBlkEnv());    if em_s <> {}    then for all mk_(env,m3) in set em_s do          (PushBlkEnv(env) ;           let in_lv = LooseEvalExpr(in_e) in             (PopBlkEnv();              lval := lval union Consistent(in_lv,m3)             )          )    else error;    return lval);
  LooseEvalIfExpr : IfExpr ==> LVAL  LooseEvalIfExpr(mk_IfExpr (test, cons, altn)) ==  (dcl lval : set of (VAL * Model) := {};
  let test_lv = LooseEvalExpr(test) in   for all mk_(test_v,m) in set test_lv do    if is_BOOL(test_v)    then let mk_BOOL(b) = test_v in         if b         then lval := lval union Consistent(LooseEvalExpr(cons),m)         else lval := lval union Consistent(LooseEvalExpr(altn),m)    else error;  return lval);
  LooseEvalCasesExpr: CasesExpr ==> LVAL  LooseEvalCasesExpr (mk_CasesExpr(sel,altns,Others)) ==  (dcl lval : set of (VAL * Model) := {},       alt_l : seq of CaseAltn := altns,       cont : bool := true;
   let sel_lv = LooseEvalExpr(sel)   in     for all mk_(sel_v,m) in set sel_lv do       (while alt_l <> [] and cont do        (let mk_CaseAltn(pat,body) = hd alt_l	 in	   let env_s = PatternMatch(pat,sel_v)	   in	     if env_s <> {}	     then (cont := false;	           for all env in set env_s do	            (PushBlkEnv(env);	             lval := lval union Consistent(LooseEvalExpr(body),m);		     PopBlkEnv()));	 alt_l := tl alt_l);      if not cont      then cont := true      elseif Others = nil      then error      else lval := lval union LooseEvalExpr(Others));    return lval);
  LooseEvalBinaryExpr: BinaryExpr ==> LVAL  LooseEvalBinaryExpr (mk_BinaryExpr(left_e, opr, right_e)) ==    let left_lv  = LooseEvalExpr(left_e),        right_lv = LooseEvalExpr(right_e)    in      if opr = <SETMINUS>      then LooseEvalSetBinaryExpr(left_lv, right_lv)      elseif opr = <EQ>      then LooseEvalEqBinaryExpr(left_lv, right_lv)      else LooseEvalNumBinaryExpr(left_lv, opr, right_lv);
  LooseEvalSetBinaryExpr: LVAL * LVAL ==> LVAL  LooseEvalSetBinaryExpr(l_lv, r_lv) ==   (dcl lval : LVAL := {};    for all mk_(mk_SET(lv),lm) in set l_lv do      for all mk_(mk_SET(rv),rm) in set Consistent(r_lv,lm) do        lval := lval union {mk_(mk_SET(lv \ rv),rm munion lm)};    return lval)  pre forall mk_(v,-) in set l_lv union r_lv & is_SET(v);
  LooseEvalEqBinaryExpr: LVAL * LVAL ==> LVAL  LooseEvalEqBinaryExpr(l_lv, r_lv) ==   (dcl lval : LVAL := {};    for all mk_(lv,lm) in set l_lv do      for all mk_(rv,rm) in set Consistent(r_lv,lm) do        lval := lval union {mk_(mk_BOOL(lv = rv),rm munion lm)};    return lval);
  LooseEvalNumBinaryExpr: LVAL * BinaryOp * LVAL ==> LVAL  LooseEvalNumBinaryExpr(l_lv, opr, r_lv) ==   (dcl lval : LVAL := {};    for all mk_(mk_NUM(lv),lm) in set l_lv do      for all mk_(mk_NUM(rv),rm) in set Consistent(r_lv,lm) do        cases opr:          <NUMMINUS> -> lval := lval union {mk_(mk_NUM(lv - rv),rm munion lm)},          <NUMPLUS>  -> lval := lval union {mk_(mk_NUM(lv + rv),rm munion lm)},          <NUMMULT>  -> lval := lval union {mk_(mk_NUM(lv * rv),rm munion lm)}    end;    return lval)  pre forall mk_(v,-) in set l_lv union r_lv & is_NUM(v);
  LooseEvalSetEnumerationExpr: SetEnumerationExpr ==> LVAL  LooseEvalSetEnumerationExpr(mk_SetEnumerationExpr(els)) ==    (dcl sm_s : set of ((set of VAL) * Model) := {};
     if len els = 0     then return {mk_(mk_SET({}),{|->})}     else (sm_s := {mk_({elem},m) | mk_(elem,m) in set LooseEvalExpr(els(1))};
           for index = 2 to len els do            let elm_llv = LooseEvalExpr(els(index)) in              sm_s := {mk_(s union {e},m munion m2)	              | mk_(s,m) in set sm_s, mk_(e,m2) in set elm_llv &		        forall id in set (dom m inter dom m2) &			m(id) = m2(id)};           return {mk_(mk_SET(s),m) | mk_(s,m) in set sm_s})); 
  LooseEvalApplyExpr: ApplyExpr ==> LVAL  LooseEvalApplyExpr(mk_ApplyExpr(fct_e, arg_e)) ==   (dcl lval: LVAL := {};
    let arg_lv = LooseEvalExpr(arg_e),        mk_(pat,body) = LookUpFn(fct_e)    in     (PushEmptyEnv();      for all mk_(arg_v,m) in set arg_lv do        let env_s = PatternMatch(pat,arg_v)	in	  (InstallCurFn(fct_e, arg_v, PatternIds(pat));	   for all env in set env_s do	     (PushBlkEnv(env);	      let ap_lv = LooseEvalExpr(body)	      in	        (PopBlkEnv();	         lval := lval union Consistent(ap_lv,m))));           LeaveCurFn());    PopEnvL();    return lval);
  LooseEvalLiteral: Literal ==> LVAL  LooseEvalLiteral(lit) ==    return if is_NumLit(lit)           then {mk_(mk_NUM(lit.val),{|->})}	   else {mk_(mk_BOOL(lit.val),{|->})}



~~~
{% endraw %}

###pat.vdmsl

{% raw %}
~~~

operations
  PatternMatch : Pattern * VAL ==> set of BlkEnv  PatternMatch (pat_p, val_v) ==    cases true:     (is_PatternName(pat_p))     -> let mk_PatternName(id) = pat_p in                                       return { MkBlkEnv(id, val_v) },     (is_MatchVal(pat_p))        -> let lval = LooseEvalExpr(pat_p.val)                                    in				      (for all mk_(v,m) in set lval do				        if v = val_v					then return { MkEmptyBlkEnv()};			               return {}),     (is_SetEnumPattern(pat_p))  -> MatchSetEnumPattern(pat_p, val_v),     (is_SetUnionPattern(pat_p)) -> MatchSetUnionPattern(pat_p, val_v),     others -> error    end;

MatchSetEnumPattern : SetEnumPattern * VAL ==> set of BlkEnvMatchSetEnumPattern ( mk_SetEnumPattern(elems_lp), val_v) ==if is_SET(val_v)then let mk_SET(val_sv) = val_v in       if card val_sv = card elems elems_lp       then let perm_slv = Permute(SetToSeq(val_sv)) in              return dunion { MatchLists(elems_lp, tmp_lv) |                               tmp_lv in set perm_slv }       else return {}else return {};
MatchSetUnionPattern : SetUnionPattern * VAL ==> set of BlkEnvMatchSetUnionPattern ( mk_SetUnionPattern(lp_p, rp_p), val_v) ==( dcl envres_sl : set of BlkEnv := {};  if is_SET(val_v)  then let mk_SET(val_sv) = val_v in       ( for all mk_(setl_sv, setr_sv) in set                { mk_(setl_sv,setr_sv) |                 setl_sv ,setr_sv in set power val_sv &                   (setl_sv union setr_sv = val_sv ) and                    (setl_sv inter setr_sv = {}) } do            let envl_s = PatternMatch(lp_p, mk_SET(setl_sv)),               envr_s = PatternMatch(rp_p, mk_SET(setr_sv)) in             if envl_s <> {} and envr_s <> {}             then let tmpenv = { CombineBlkEnv(tmp1, tmp2) |                                 tmp1 in set envl_s, tmp2 in set envr_s }                   in                    envres_sl := envres_sl union UnionMatch(tmpenv);         return envres_sl       )  else return {});
MatchLists : seq of Pattern * seq of VAL ==> set of BlkEnvMatchLists (els_lp, val_lv) == let tmp_ls = [ PatternMatch(els_lp(i), val_lv(i)) |                i in set inds els_lp ] in   if {} not in set elems tmp_ls   then let perm_s = SeqOfSetOf2SetOfSeqOf(tmp_ls) in          UnionMatch({ conc l | l in set perm_s })   else return {};
UnionMatch : set of BlkEnv ==> set of BlkEnvUnionMatch (blk_sl) ==return { StripDoubles(blk_l) |         blk_l in set blk_sl &           forall mk_(id1,v1_v) in set elems blk_l,                  mk_(id2,v2_v) in set elems blk_l &                   SelName(id1) = SelName(id2) => (v1_v = v2_v)};
StripDoubles : BlkEnv ==> BlkEnvStripDoubles (blk_l) ==( dcl tmpblk_l : BlkEnv := blk_l,      res_l : BlkEnv := [];  while tmpblk_l <> [] do     let mk_(id,val_v) = hd tmpblk_l in    ( if not exists mk_(id1 ,-) in set elems tl tmpblk_l & id1 = id      then res_l := CombineBlkEnv(res_l, MkBlkEnv(SelNameAndPos(id), val_v));      tmpblk_l := tl tmpblk_l    );  return res_l);
EvalBind : Bind ==> set of (BlkEnv * Model)EvalBind (bind) ==EvalSetBind(bind);
EvalSetBind : SetBind ==> set of (BlkEnv * Model)EvalSetBind ( mk_SetBind(pat_p ,set_e )) ==( dcl env_s : set of (BlkEnv * Model) := {};  let set_lv = LooseEvalExpr(set_e) in   (for all mk_(set_v,m) in set set_lv do     (if is_SET(set_v)      then let mk_SET(set_sv) = set_v in           ( for all elm_v in set set_sv do                (let new_envs = PatternMatch(pat_p, elm_v) in                env_s := env_s union {mk_(env,m) | env in set new_envs})           )      else error);    return env_s))

~~~
{% endraw %}

