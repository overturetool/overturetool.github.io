---
layout: default
title: DFDexampleSL
---

## DFDexampleSL
Author: Peter Gorm Larsen



This specification describes how one can automatically transform Data
Flow Diagrams (DFD) into VDM-SL definitions. It is written as a flat
VDM-SL model in a purely executable style. However, in order to test
it at the top level one needs to construct a large test structure
which essentially is an AST for a DFD. This have been done in the past
but unfortunately the sources for this have been lost. This model was
basis for a paper published as:

"A Formal Semantics of Data Flows Diagrams", P.G.Larsen, N.Plat, 
H.Toetenel, Formal Aspects of Computing'' 1994, Vol 6, December



| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|


### dfdexample.vdmsl

{% raw %}
~~~vdm
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
functions
  
TransHDFD : HDFD * MSs * (<EXPL>|<IMPL>) -> set of Module
TransHDFD(hdfd,mss,style) ==
  let mainmod=MakeDFDModule(hdfd,mss,style) in
  let mk_(-,-,-,dfdmap,-)=hdfd in
  let mods= dunion {TransHDFD(dfd,mss,style)
                   | dfd in set rng dfdmap} in
  {mainmod} union mods;
                                                                                                                         
MakeDFDModule : HDFD * MSs * (<EXPL>|<IMPL>) -> Module
MakeDFDModule(mk_(dfdid,dss,dfdtopo,dfdmap,dfdsig),
              mss,style) ==
  let i = MakeInterface(dfdid,dss,dfdtopo,dfdsig,dfdmap),
      defs = MakeDefinitions(dfdid,dss,dfdtopo,
                             dfdsig,mss,style) 
  in
    mk_(ModIdConf(dfdid),i,defs);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
MakeInterface: DFDId * DSs * DFDTopo * DFDSig * DFDMap -> 
               Interface
MakeInterface(dfdid,dss,dfdtopo,dfdsig,dfdmap) ==
  let tmimp = MakeTypeModImp(dss, dom dfdtopo),
      dfdmimps = MakeDFDModImps(dom dfdmap,dfdsig),
      exp = MakeOpExp(dfdid,dfdsig(dfdid)) in
       mk_(({tmimp} union dfdmimps),exp)
pre dfdid in set dom dfdsig;
  
MakeTypeModImp : DSs * set of FlowId -> Import
MakeTypeModImp(dss,fids) ==
  let tysigs= {mk_TypeSig(DSIdConf(dsid))
              |dsid in set dss} union 
              {mk_TypeSig(FlowIdTypeConf(fid))
              |fid in set fids} in
  mk_(TypeModConf(),tysigs);
  
MakeDFDModImps: set of DFDId * DFDSig -> set of Import
MakeDFDModImps(dfdids,dfdsig) ==
  {mk_(ModIdConf(id),{MakeOpSig(id,dfdsig(id))}) 
                     | id in set dfdids}
pre dfdids subset dom dfdsig;
  
MakeOpExp : DFDId * Signature -> Export
MakeOpExp(dfdid,sig) ==
  {MakeOpSig(dfdid,sig)};
  
MakeOpSig : DFDId * Signature -> OpSig
MakeOpSig(dfdid,sig) ==
  let opty = MakeOpType(sig),
      opst = MakeOpState(sig) in
  mk_OpSig(OpIdConf(dfdid),opty,opst);
  
MakeOpType : Signature -> OpType
MakeOpType(mk_(il,ol,-)) ==
  mk_OpType(MakeType(il),MakeType(ol));
                                                                                                                                           
MakeType : seq of FlowId -> [Type]
MakeType(fidl) ==
  cases len fidl:
    0 -> nil ,
    1 -> FlowIdTypeConf( hd fidl),
  others -> mk_ProductType([ FlowIdTypeConf(fidl(i))
                           | i in set inds fidl])
  end;
  
MakeOpState : Signature -> seq of Id
MakeOpState(mk_(-,-,sl)) ==
  [let mk_(s,-)=sl(i) 
   in
     StateVarConf(s)
  |i in set inds sl];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
MakeDefinitions: DFDId * DSs * DFDTopo * DFDSig * MSs * 
                 (<EXPL>|<IMPL>) -> Definitions
MakeDefinitions(dfdid,dss,dfdtopo,dfdsig,mss,style) ==
  let dst = MakeState(dfdid,dss,CollectExtDFs(dfdtopo)),
      msdescs = MakeMSDescs(dfdsig,mss),
      dfdop = MakeDFDOp(dfdid,dfdtopo,dfdsig,style) in
   if dst=nil 
   then {dfdop} union msdescs
   else {dst,dfdop} union msdescs;
                                                                                                                                                                                                                        
MakeState : DFDId * DSs * set of FlowId -> [StateDef]
MakeState(dfdid,dss,fids) ==
  if dss={} and fids={}
  then nil 
  else let fl=MakeFieldList(dss union fids)
       in
         mk_StateDef(StateIdConf(dfdid),fl);
  
MakeFieldList : set of StId -> seq of Field
MakeFieldList(ids) ==
  if ids={}
  then []
  else let id in set ids 
       in
         [MakeField(id)]^MakeFieldList(ids \ {id})
  measure Card;

Card: set of StId -> nat
Card(s) ==
  card s;
  
MakeField : StId -> Field
MakeField(id) ==
  mk_Field(StateVarConf(id),StateTypeConf(id));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
MakeMSDescs : DFDSig * MSs -> set of Definition
MakeMSDescs(dfdsig,mss) ==
  if forall id in set dom dfdsig& is_DFDId(id)
  then {}
  else let id in set dom dfdsig be st is_MSId(id) 
       in
         let def'= if id in set dom mss
                   then mss(id)
                   else MakeOp(id,dfdsig(id))
         in
           {def'} union MakeMSDescs({id} <-: dfdsig,mss);
  
MakeOp: MSId *  (seq of FlowId * seq of FlowId * State) 
        -> ImplOp
MakeOp(msid,mk_(din,out,dst)) ==
  let partpl = MakeInpPar(din),
      residtp = MakeOutPair(out),
      dext = MakeExt(dst),
      body = mk_ImplOpBody(nil, mk_BoolLit(true)) 
  in
    mk_ImplOp(OpIdConf(msid),partpl,residtp,dext,body);
  
MakeInpPar : seq of FlowId -> seq of ParType
MakeInpPar(fidl) ==
  [mk_ParType(mk_PatternId(FlowIdVarConf(fidl(i))),
                           FlowIdTypeConf(fidl(i)))
  | i in set inds fidl];
                                                                                                                                                                                                                                                                      
MakeOutPair : seq of FlowId -> [IdType]
MakeOutPair(fidl) ==
  cases len fidl:
    0 -> nil ,
    1 -> mk_IdType(FlowIdVarConf( hd fidl),
                   FlowIdTypeConf( hd fidl)),
  others -> let t=mk_ProductType([FlowIdTypeConf(fidl(i))
                                 |i in set inds fidl]) 
            in
              mk_IdType(ResultIdConf(),t)
  end;
  
MakeExt : State -> seq of ExtVarInf
MakeExt(dst) ==
  [MakeExtVar(dst(i))|i in set inds dst];
  
MakeExtVar : (StId * Mode) -> ExtVarInf
MakeExtVar(mk_(id,mode)) ==
  mk_ExtVarInf(mode,VarConf(id),TypeConf(id));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
MakeDFDOp: DFDId * DFDTopo * DFDSig * (<EXPL>|<IMPL>) -> 
           OpDef
MakeDFDOp(dfdid,dfdtopo,dfdsig,style) ==
  if style=<EXPL>
  then MakeDFDExplOp(dfdid,dfdtopo,dfdsig)
  else MakeDFDImplOp(dfdid,dfdtopo,dfdsig)
pre if style=<EXPL>
    then pre_MakeDFDExplOp(dfdid,dfdtopo,dfdsig)
    else pre_MakeDFDImplOp(dfdid,dfdtopo,dfdsig);

MakeDFDImplOp : DFDId * DFDTopo * DFDSig -> ImplOp
MakeDFDImplOp(dfdid,dfdtopo,dfdsig) ==
  let mk_(din,out,dst)=dfdsig(dfdid) in
  let partpl = MakeInpPar(din),
      residtp = MakeOutPair(out),
      dext = MakeExt(dst),
      body = MakeImplOpBody(dfdid,dfdtopo,dfdsig) in
  mk_ImplOp(OpIdConf(dfdid),partpl,residtp,dext,body)
pre dfdid in set dom dfdsig and 
    pre_MakeImplOpBody(dfdid,dfdtopo,dfdsig);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
MakeImplOpBody : DFDId * DFDTopo * DFDSig -> ImplOpBody
MakeImplOpBody(dfdid,dfdtopo,dfdsig) ==
  let intm = {stid |-> 0|mk_(stid,-) in set 
                         CollectStIds(rng dfdsig)},
      maxm = {stid |-> Reduce(NoOfWr(rng dfdsig,stid))
             | mk_(stid, -) in set 
               CollectStIds(rng dfdsig)},
      dpre  = MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm),
      dpost = MakePostExpr(dfdid,dfdtopo,dfdsig,intm,maxm) 
  in
    mk_ImplOpBody(dpre,dpost)
pre let intm = {stid |-> 0|mk_(stid,-) in set 
                           CollectStIds(rng dfdsig)},
        maxm = {stid |-> Reduce(NoOfWr(rng dfdsig,stid))
               | mk_(stid,-) in set 
                 CollectStIds(rng dfdsig)} 
    in
      pre_MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm) and 
      pre_MakePostExpr(dfdid,dfdtopo,dfdsig,intm,maxm)
                                                                                                                                                                                                    
types
  IntM = map StId to nat
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
functions
  
MakePreExpr: DFDId * DFDTopo * DFDSig * IntM * IntM -> 
             Expr
MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm) ==
  let mk_(-,out,dst)=dfdsig(dfdid) in
  let fids = NeedsQuant(dfdtopo,dfdsig,{},{}),
  pred = MakePrePred(dfdtopo,dfdsig,intm,maxm) in
    if QuantNec(out,dst,fids,intm,maxm)
    then let bind = MakeExistsBind(fids,dst,intm,
                                   maxm,<PRE>)
         in
           mk_ExistsExpr(bind,pred)
    else pred
  pre dfdid in set dom dfdsig;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
MakePrePred : DFDTopo * DFDSig * IntM * IntM -> Expr
MakePrePred(dfdtopo,dfdsig,intm,maxm) ==
  let eos=ExecutionOrders(dfdtopo) in
  DBinOp(<OR>,{MakePreForEO(piseq,dfdsig,intm,maxm)
              |piseq in set eos});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
MakePreForEO: seq1 of ProcId * DFDSig * IntM * IntM ->
              Expr
MakePreForEO(piseq,dfdsig,intm,maxm) ==
  let nid= hd piseq in
  let intm'={stid |-> if mk_(stid, <READWRITE>) in set 
                         CollectStIds({dfdsig(nid)})
                      then intm(stid) + 1
                      else intm(stid)
            | stid in set dom intm} in
  let dpre = MakeQuotedApply(nid,dfdsig(nid),intm',maxm,
                             <PRE>,<PRE>),
      dpost = MakeQuotedApply(nid,dfdsig(nid),intm',maxm,
                              <PRE>,<POST>) 
  in
   if len piseq=1
   then dpre
   else let pred=mk_BinaryExpr(dpre,<AND>,dpost) 
        in
          mk_BinaryExpr(pred,<AND>,
                        MakePreForEO(tl piseq,dfdsig,
                                     intm',maxm));
                                                                                                                                                                                                                                                                                                                                                                                                                                                     
MakePostExpr: DFDId * DFDTopo * DFDSig * IntM * IntM -> 
              Expr
MakePostExpr(dfdid,dfdtopo,dfdsig,intm,maxm) ==
  let mk_(-,out,dst)=dfdsig(dfdid),
      fids = NeedsQuant(dfdtopo,dfdsig, elems out,{}),
      body = MakeInExpr(out,dst,fids,dfdtopo,dfdsig,
                        intm,maxm) 
  in
    if len out<= 1
    then body
    else mk_LetExpr(MakePattern(out),ResultIdConf(),body)
pre let mk_(-,out,dst)=dfdsig(dfdid),
        fids = NeedsQuant(dfdtopo,dfdsig, elems out,{}) 
    in
      pre_MakeInExpr(out,dst,fids,dfdtopo,dfdsig,
                     intm,maxm);
                                                                                                                                                                                                                                                                                                                                                                        
MakeInExpr: seq of FlowId * State * set of FlowId * 
            DFDTopo * DFDSig * IntM * IntM -> Expr
MakeInExpr(out,dst,fids,dfdtopo,dfdsig,intm,maxm) ==
  let pred=MakePostPred(dfdtopo,dfdsig,intm,maxm) 
  in
    if QuantNec(out,dst,fids,intm,maxm)
    then let bind = MakeExistsBind(fids,dst,intm,maxm,
                                   <POST>)
         in
           mk_ExistsExpr(bind,pred)
    else pred
pre pre_MakeExistsBind(fids,dst,intm,maxm,<POST>);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
MakePostPred : DFDTopo * DFDSig * IntM * IntM -> Expr
MakePostPred(dfdtopo,dfdsig,intm,maxm) ==
  let eos=ExecutionOrders(dfdtopo) 
  in
    DBinOp(<OR>,{MakePostForEO(piseq,dfdsig,intm,maxm)
                |piseq in set eos});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
MakePostForEO: seq1 of ProcId * DFDSig * IntM * IntM -> 
               Expr
MakePostForEO(piseq,dfdsig,intm,maxm) ==
  let nid= hd piseq in
  let intm'={stid |-> if mk_(stid, <READWRITE>) in set 
                         CollectStIds({dfdsig(nid)})
                      then intm(stid) + 1
                      else intm(stid)
            | stid in set dom intm} in
  let dpre = MakeQuotedApply(nid,dfdsig(nid),intm',maxm,
                             <POST>, <PRE>),
      dpost = MakeQuotedApply(nid,dfdsig(nid),intm',maxm,
                              <POST>,<POST>) in
   if len piseq=1
  then mk_BinaryExpr(dpre,<AND>,dpost)
  else let pred=mk_BinaryExpr(dpre,<AND>,dpost) in
  mk_BinaryExpr(pred,<AND>,MakePostForEO(tl piseq,dfdsig,
                                         intm',maxm))
pre let nid= hd piseq 
    in
      nid in set dom dfdsig and 
      pre_MakeQuotedApply(nid,dfdsig(nid),intm,maxm,
                          <POST>,<PRE>) and 
      pre_MakeQuotedApply(nid,dfdsig(nid),intm,maxm,
                          <POST>,<POST>);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
MakeExistsBind: set of FlowId * State * IntM * IntM * 
               (<PRE>|<POST>) -> MultTypeBind
MakeExistsBind(fs,dst,intm,maxm,c) ==
  let outl = MakeTypeBindList(fs),
      stl = [let mk_(s,-)=dst(i),
                 p = MakePatternIds(s,intm(s)+1,maxm(s),c)
             in
               mk_TypeBind(p,StateTypeConf(s))
            |i in set inds dst 
            & let mk_(-,m)=dst(i) in m=<READWRITE>]
  in
    mk_MultTypeBind(outl^stl)
pre forall mk_(s,<READWRITE>) in set elems dst&
        s in set dom intm and s in set dom maxm;
                                                                                                                                                                                                                                                                                                                
ExecutionOrders: DFDTopo -> set of seq1 of ProcId
ExecutionOrders(dfdtopo) ==
  let top={mk_(fid,tid)
          |mk_(fid,tid) in set rng dfdtopo &
           (is_DFDId(fid) or is_MSId(fid) or (fid = nil)) 
            and 
           (is_DFDId(tid) or is_MSId(tid) or (tid = nil))},
      top2={mk_(fid,tid)|mk_(fid,tid) in set rng dfdtopo &
            (is_DFDId(fid) or is_MSId(fid)) and 
            (is_DFDId(tid) or is_MSId(tid))} in
    let piset= dunion {{pi_1,pi_2}
                       |mk_(pi_1,pi_2) in set top}\{nil} 
    in
      {piseq | piseq in set PossibleSeqs(piset) &
               forall i,j in set inds piseq &
                  j<i => (piseq(j) not in set
                          TransClosure(piseq(i),top2,{}))};
                                                                                                                                                                                                                                                                                                 
MakeQuotedApply: (DFDId|MSId) * Signature * IntM * IntM * 
                 (<PRE>|<POST>) * (<PRE>|<POST>) -> Apply
MakeQuotedApply(id,mk_(din,out,dst),intm,maxm,c,c2) ==
  let inarg = [FlowIdVarConf(din(i))|i in set inds din],
      oldstarg = [let mk_(s,m)=dst(i) in
                    if m=<READ>
                    then StateVarIntConf(s,intm(s),
                                         maxm(s),c)
                    else StateVarIntConf(s,intm(s) - 1,
                                         maxm(s),c)
                 |i in set inds dst],
      outarg = [FlowIdVarConf(out(i))|i in set inds out],
      starg = [let mk_(s,-)=dst(i) in
               StateVarIntConf(s,intm(s),maxm(s),c)
              |i in set inds dst & 
               let mk_(-,m)=dst(i) in m=<READWRITE>] in
   if c2=<PRE>
  then mk_Apply("pre_"^OpIdConf(id),inarg^oldstarg)
  else mk_Apply("post_"^OpIdConf(id),inarg^oldstarg^
                                     outarg^starg)
pre forall mk_(s,m) in set elems dst&
        s in set dom intm and
        s in set dom maxm and 
        m=<READWRITE> => intm(s)>0;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
MakeDFDExplOp : DFDId * DFDTopo * DFDSig -> ExplOp
MakeDFDExplOp(dfdid,dfdtopo,dfdsig) ==
  let mk_(din,-,-) = dfdsig(dfdid),
      eos = ExecutionOrders(dfdtopo),
      intm = {stid |-> 0
             | mk_(stid,-) in set 
               CollectStIds( rng dfdsig)},
      maxm = {stid |-> Reduce(NoOfWr(rng dfdsig,stid))
             |mk_(stid,-) in set CollectStIds(rng dfdsig)} 
  in
  let optype = MakeOpType(dfdsig(dfdid)),
      parms = [mk_PatternId(FlowIdVarConf(din(i)))
              |i in set inds din],
      bodys = {MakeStmtForEO(piseq,dfdid,dfdsig)
              |piseq in set eos},
      dpre  = MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm) in
  let body = MakeNonDetStmt(bodys) in
      mk_ExplOp(OpIdConf(dfdid),optype,parms,body,dpre)
pre dfdid in set dom dfdsig and 
    let intm = {stid |-> 0
               |mk_(stid,-) in set CollectStIds(rng dfdsig)},
        maxm = {stid |-> Reduce(NoOfWr(rng dfdsig,stid))
               |mk_(stid,-) in set CollectStIds(rng dfdsig)} 
    in
      pre_MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm) and 
      forall piseq in set ExecutionOrders(dfdtopo)&
         pre_MakeStmtForEO(piseq,dfdid,dfdsig);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
MakeStmtForEO: seq1 of ProcId * DFDId * DFDSig -> Stmt
MakeStmtForEO(piseq,dfdid,dfdsig) ==
  let nid= hd piseq in
  let mk_(call,pat) = MakeCallAndPat(nid,dfdsig(nid)),
      kind = FindKind(dfdsig(nid)) in
   if len piseq=1
   then let mk_(-,out,-)=dfdsig(dfdid) in 
         let ret=mk_Return(MakeResult(out)) in
          if kind=<OPRES>
          then mk_DefStmt(pat,call,ret)
          else mk_Sequence([call,ret])
   else let rest=MakeStmtForEO( tl piseq,dfdid,dfdsig) in
         if kind=<OPRES>
         then mk_DefStmt(pat,call,rest)
         else if is_Sequence(rest)
              then let mk_Sequence(sl)=rest in
                    mk_Sequence([call]^sl)
              else mk_Sequence([call,rest])
pre hd piseq in set dom dfdsig;
  
MakeCallAndPat : (DFDId|MSId) * Signature -> Call * [Pattern]
MakeCallAndPat(id,mk_(din,out,-)) ==
  let inarg = [FlowIdVarConf(din(i))|i in set inds din],
      outarg = [FlowIdVarConf(out(i))|i in set inds out] in
  mk_(mk_Call(OpIdConf(id),inarg),MakePattern(outarg));
  
FindKind : Signature -> <OPRES>|<OPCALL>
FindKind(sig) ==
  cases sig:
    mk_(-,[],-) -> <OPCALL>,
    others -> <OPRES>
  end;
  
MakePattern : seq of Id -> [Pattern]
MakePattern(idl) ==
  cases len idl:
    0 -> nil ,
    1 -> mk_PatternId( hd idl),
  others -> mk_TuplePattern([mk_PatternId(idl(i)) 
                            | i in set inds idl])
  end;
  
MakeResult : seq1 of Id -> Expr
MakeResult(idl) ==
  if len idl=1
  then FlowIdVarConf( hd idl)
  else mk_TupleConstructor([FlowIdVarConf(idl(i))
                           |i in set inds idl]);
                                                                                                                                                                                  
DBinOp : BinaryOp * set of Expr -> Expr
DBinOp(op,es) ==
  let e in set es in
   if  card es=1
   then e
   else mk_BinaryExpr(e,op,DBinOp(op, es \ {e}))
pre es<>{};
                                                                                                                                                
CollectExtDFs : DFDTopo -> set of FlowId
CollectExtDFs(dfdtopo) ==
  {fid|fid in set dom dfdtopo 
      & let mk_(pid_1,pid_2)=dfdtopo(fid) in
           is_EPId(pid_1) or is_EPId(pid_2)};
  
NeedsQuant: DFDTopo * DFDSig * set of FlowId * 
           set of ProcId -> set of FlowId
NeedsQuant(dfdtopo,dfdsig,notneeded,pids) ==
  let top={mk_(fid,tid)|mk_(fid,tid) in set rng dfdtopo &
           (is_DFDId(fid) or is_MSId(fid)) and 
           (is_DFDId(tid) or is_MSId(tid))} 
  in
   if  dom dfdsig=pids
   then {}
   else let pid in set dom dfdsig \ pids in
        if TransClosure(pid,top,{})={} and 
           EquivClass(top,{pid})= dom dfdsig
        then NeedsQuant(dfdtopo,dfdsig,notneeded,
                        pids union {pid})
        else let mk_(-,out,-)=dfdsig(pid) in
              NeedsQuant(dfdtopo,dfdsig,notneeded,
                         pids union {pid}) union 
                         elems out \ notneeded;
                                                                                                                                                                                      
QuantNec: seq of FlowId * State * set of FlowId * 
           IntM * IntM -> bool 
QuantNec(out,dst,fids,intm,maxm) ==
  fids <> {} or
  -- (exists id in set elems out&  id in set fids) or 
  (exists mk_(s,m) in set elems dst&
       m=<READWRITE> and intm(s)<maxm(s))
pre forall mk_(s,-) in set elems dst&
       s in set dom intm and s in set dom maxm;
  
MakeTypeBindList : set of FlowId -> seq of TypeBind
MakeTypeBindList(fids) ==
 if fids={}
 then []
 else let fid in set fids 
      in
        let pat = [mk_PatternId(FlowIdVarConf(fid))],
            first=mk_TypeBind(pat,FlowIdTypeConf(fid)) 
        in
          [first]^MakeTypeBindList(fids \ {fid})
  measure CardFId;
  
CardFId: set of FlowId -> nat
CardFId(s) ==
  card s;
  
MakePatternIds: (Id | DSId) * nat * nat * 
                (<PRE>|<POST>) -> seq of PatternId
MakePatternIds(id, n, max, c) ==
  if (n = max) and (c = <POST>)
  then [mk_PatternId(StateVarConf(id))]
  else cases n:
       0      -> if c = <PRE>
                 then [mk_PatternId(StateVarConf(id))]
                 else [mk_PatternId(StateOldVarConf(id))],
       others -> MakePatternSeq(StateVarConf(id), n, max)
       end;
  
MakePatternSeq: Id * nat * nat -> seq of PatternId
MakePatternSeq(id, n, max) ==
  if n = max
  then [mk_PatternId(id ^ "'")]
  else [mk_PatternId(id ^ "'")] ^ 
       MakePatternSeq(id ^ "'", n+1, max)
  pre n <= max
  measure TowardsMax;
  
  TowardsMax: Id * nat * nat -> nat
  TowardsMax(-,n,max) ==
    max - n;
                                                                                                                                                   
EquivClass: set of (ProcId * ProcId) * set of (MSId|DFDId) ->
            set of (MSId|DFDId)
EquivClass(top,ids) ==
   if exists mk_(fid,tid) in set top&
   (fid in set ids and tid not in set ids) or 
   (tid in set ids and fid not in set ids)
    then let mk_(fid,tid) in set top be st 
           (fid in set ids and tid not in set ids) or 
           (tid in set ids and fid not in set ids)
       in
         EquivClass(top,ids union {fid,tid})
  else ids;
                                                                                                                                                                   
MakeNonDetStmt : set of Stmt -> Stmt
MakeNonDetStmt(stmts) ==
  cases  card stmts:
    1 -> let {s}=stmts in s,
  others -> mk_NonDetStmt(stmts)
  end
pre  card stmts<>0;
                                                                                                              
CollectStIds: set of Signature -> set of (StId * Mode)
CollectStIds(sigs) ==
  dunion { elems dst|mk_(-,-,dst) in set sigs};
                                                                                                                                                                                                                                                       
NoOfWr: set of Signature * StId -> nat 
NoOfWr(sigs,stid) ==
  if sigs={}
  then 0
  else let sig in set sigs in
  let mk_(-,-,dst)=sig in
   if mk_(stid,<READWRITE>) in set elems dst
   then 1+NoOfWr(sigs \ {sig},stid)
   else NoOfWr(sigs \ {sig},stid);
  
Reduce: nat -> nat
Reduce(n) ==
  if (n = 0) or (n = 1)
  then n
  else n - 1;
                                                                  
ModIdConf : DFDId -> Id
ModIdConf(mk_DFDId(id)) ==
  id^"Module";
  
StateIdConf : DFDId -> Id
StateIdConf(mk_DFDId(id)) ==
  id^"State";
  
DSIdConf : DSId -> Id
DSIdConf(mk_DSId(id)) ==
  id;
  
OpIdConf : MSId | DFDId | Id -> Id
OpIdConf(id) ==
  cases id:
    mk_MSId(id'),
    mk_DFDId(id') -> id',
    others        -> id
  end;
                                                                                                                                                                                                                                                                                                                                                                                                                                                           
StateVarIntConf: (Id | DSId) * nat * nat * (<PRE>|<POST>) 
                 -> Id
StateVarIntConf(id,n,max,c) ==
  if (max=n) and (c=<POST>)
  then StateVarConf(id)
  else cases n:
       0   ->  if c=<PRE>
               then StateVarConf(id)
               else StateOldVarConf(id),
       1    -> StateVarConf(id)^"'",
       others -> StateVarIntConf(id,n - 1,max,c)^"'"
       end;
  
VarConf : StId -> Id
VarConf(id) ==
  if is_DSId(id)
  then StateVarConf(id)
  else FlowIdVarConf(id);
  
TypeConf : DSId|FlowId -> Id
TypeConf(id) ==
  if is_DSId(id)
  then StateTypeConf(id)
  else FlowIdTypeConf(id);
  
FlowIdVarConf : Id -> Id
FlowIdVarConf(id) ==
  ToLower(id);
  
FlowIdTypeConf : Id -> Id
FlowIdTypeConf(id) ==
  ToUpper(id);
  
StateTypeConf : Id | DSId -> Id
StateTypeConf(id) ==
  ToUpper(id);
  
StateVarConf : Id | DSId -> Id
StateVarConf(id) ==
  ToLower(id);
  
StateOldVarConf : Id | DSId -> Id
StateOldVarConf(id) ==
  ToLower(id)^"old";
  
TypeModConf : () -> Id
TypeModConf() ==
  "TypeModule";
  
ResultIdConf : () -> Id
ResultIdConf() ==
  "r";
  
PossibleSeqs: set of ProcId -> set of seq of ProcId
PossibleSeqs(pids) ==
  if pids = {}
  then {}
  else if card pids = 1
       then {[pid]| pid in set pids}
       else let pid in set pids
            in
              let rest = PossibleSeqs(pids \ {pid})
              in
                dunion {InsertPId(pid, seq') 
                       | seq' in set rest}
measure CardPSet;

CardPSet: set of ProcId -> nat
CardPSet(s) ==
  card s;
  
InsertPId: ProcId * seq of ProcId -> set of seq of ProcId
InsertPId(pid, seq') ==
  {seq'(1,...,i) ^ [pid] ^ seq'(i+1,...,len(seq')) 
  | i in set {0,...,len(seq')}};
  
ToLower: Id | DSId | DFDId | EPId | MSId -> Id
ToLower(id) ==
  let realid = cases id:
                 mk_DSId(id'),
                 mk_DFDId(id'),
                 mk_EPId(id'),
                 mk_MSId(id')  -> id',
                 others        -> id
               end
  in
    [LowerChar(realid(i)) | i in set inds realid];
                                                                                                                                                            
LowerChar: char -> char
LowerChar(c) ==
  cases c:
  'A' -> 'a',
  'B' -> 'b',
  'C' -> 'c',
  'D' -> 'd',
  'E' -> 'e',
  'F' -> 'f',
  'G' -> 'g',
  'H' -> 'h',
  'I' -> 'i',
  'J' -> 'j',
  'K' -> 'k',
  'L' -> 'l',
  'M' -> 'm',
  'N' -> 'n',
  'O' -> 'o',
  'P' -> 'p',
  'Q' -> 'q',
  'R' -> 'r',
  'S' -> 's',
  'T' -> 't',
  'U' -> 'u',
  'V' -> 'v',
  'W' -> 'w',
  'X' -> 'x',
  'Y' -> 'y',
  'Z' -> 'z',
  others -> c
  end;
  
  
ToUpper: Id | DSId | DFDId | EPId | MSId -> Id
ToUpper(id) ==
  let realid = cases id:
                 mk_DSId(id'),
                 mk_DFDId(id'),
                 mk_EPId(id'),
                 mk_MSId(id')  -> id',
                 others        -> id
               end
  in
    [UpperChar(realid(i)) | i in set inds realid];
  
UpperChar: char -> char
UpperChar(c) ==
  cases c:
  'a' -> 'A',
  'b' -> 'B',
  'c' -> 'C',
  'd' -> 'D',
  'e' -> 'E',
  'f' -> 'F',
  'g' -> 'G',
  'h' -> 'H',
  'i' -> 'I',
  'j' -> 'J',
  'k' -> 'K',
  'l' -> 'L',
  'm' -> 'M',
  'n' -> 'N',
  'o' -> 'O',
  'p' -> 'P',
  'q' -> 'Q',
  'r' -> 'R',
  's' -> 'S',
  't' -> 'T',
  'u' -> 'U',
  'v' -> 'V',
  'w' -> 'W',
  'x' -> 'X',
  'y' -> 'Y',
  'z' -> 'Z',
  others -> c
  end
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
types
  
SA = HDFD * DD * MSs
inv mk_(hdfd,dd,-) == 
  FlowTypeDefined(hdfd,dd) and TopLevelSigOK(hdfd);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
HDFD = DFDId * DSs * DFDTopo * DFDMap * DFDSig;
--  inv mk_(id,dss,dfdtop,dfdmap,dfdsig) == 
--    DFDSigConsistent(id,dfdtop,dss,dfdmap,dfdsig) and 
--    LowerLevelUsed(dfdtop,dfdmap);
  
DSs = set of DSId;
  
DSId :: seq of char;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
DFDTopo = map FlowId to ([ProcId] * [ProcId])
inv dfdtopo == 
  let top={mk_(fid,tid)
          |mk_(fid,tid) in set rng dfdtopo 
          & (is_DFDId(fid) or is_MSId(fid)) and
            (is_DFDId(tid) or is_MSId(tid))} in
    NotRecursive(top) and
  forall flowid in set dom dfdtopo & 
     FlowConnectOK(dfdtopo(flowid));
  
FlowId = seq of char;
  
ProcId = DFDId|MSId|EPId;
  
DFDMap = map DFDId to HDFD;
  
DFDSig = map (DFDId|MSId) to Signature;
                                                                                                                                                                                                                                                                            
Signature = Input * Output * State
inv mk_(-,out,sta) == 
  (sta=[]) => (out<>[]) and 
  (out=[]) => (exists mk_(-,m) in set elems sta & 
                 m=<READWRITE>);
  
Input = seq of FlowId;
  
Output = seq of FlowId;
                                                                                                                                                                                                                                                            
State = seq of (StId * Mode);
  
StId = DSId|FlowId;
  
Mode = <READ>|<READWRITE>;
  
DD = map Id to Type;
  
MSs = map MSId to MS;
  
MS = OpDef;
  
DFDId :: seq of char;
  
EPId :: seq of char;
  
MSId :: seq of char
                                                                                                                                                                                 
functions
  
FlowTypeDefined : HDFD * DD -> bool 
FlowTypeDefined(mk_(-,-,dfdtop,-,-),dd) ==
  forall fid in set dom dfdtop & 
     FlowIdTypeConf(fid) in set dom dd;
                                                                                                                                                                                                                                                                                                                                                                                                                            
TopLevelSigOK: HDFD -> bool 
TopLevelSigOK(mk_(sysid,-,dfdtop,-,dfdsig)) ==
  sysid in set dom dfdsig and
  let mk_(din,out,dst)=dfdsig(sysid) in
  din=[] and out=[] and
  forall flowid in set dom dfdtop&
    let mk_(fid,tid)=dfdtop(flowid) in
      (is_EPId(fid) => 
       mk_(flowid,<READ>) in set elems dst) and 
      (is_EPId(tid) => 
       mk_(flowid,<READWRITE>) in set elems dst);
                                                                                                                                                                                                                                                                                                                                                                                                                                                               
DFDSigConsistent: DFDId * DFDTopo * DSs * DFDMap * DFDSig 
                  -> bool 
DFDSigConsistent(id,dfdtop,dss,dfdmap,dfdsig) ==
  DSConnected(dss,dfdsig) and 
  SigsAllRight(dfdtop,dfdsig) and 
  IdsInSigsAvail(dss,dfdtop, rng dfdsig) and 
  SigsForAllUsedIds(id, rng dfdtop,dfdmap,dfdsig);
  
DSConnected : DSs * DFDSig -> bool 
DSConnected(dss,dfdsig) ==
  forall dsid in set dss&
   exists mk_(-,-,dst) in set rng dfdsig&
   exists i in set inds dst&
   let mk_(id,-)=dst(i) in
    dsid=id;
  
SigsAllRight : DFDTopo * DFDSig -> bool 
SigsAllRight(dfdtop,dfdsig) ==
  forall flowid in set dom dfdtop &
   cases dfdtop(flowid):
    mk_(id,mk_EPId(-)) -> let mk_(-,-,dst)=dfdsig(id) in
                            mk_(flowid,<READWRITE>) in set 
                            elems dst,
    mk_(mk_EPId(-),id) -> let mk_(-,-,dst)=dfdsig(id) in
                            mk_(flowid,<READ>) in set 
                            elems dst,
    mk_(nil, id)       -> let mk_(din,-,-) = dfdsig(id) 
                          in
                            flowid in set elems din,
    mk_(id, nil) -> let mk_(-,out,-) = dfdsig(id) in
                      flowid in set elems out,
    mk_(fid,tid) -> let mk_(-,out,-) = dfdsig(fid),
                        mk_(din,-,-) = dfdsig(tid) in
                      (flowid in set elems out) and 
                      (flowid in set elems din)
   end;
  
IdsInSigsAvail : DSs * DFDTopo * set of Signature -> bool 
IdsInSigsAvail(dss,dfdtop,sigs) ==
  let fids=CollectExtDFs(dfdtop) in
  forall mk_(din,out,dst) in set sigs&
    elems din subset dom dfdtop and  
    elems out subset dom dfdtop and  
    elems dst subset {mk_(id,m)
                     |id in set dss union fids, 
                      m in set {<READ>,<READWRITE>}};
  
LowerLevelUsed : DFDTopo * DFDMap -> bool 
LowerLevelUsed(dfdtop,dfdmap) ==
  let ids =  dom dfdmap in
  forall mk_(fid,tid) in set rng dfdtop &
   (is_DFDId(fid) => fid in set ids) and 
   (is_DFDId(tid) => tid in set ids);
  
SigsForAllUsedIds: DFDId * set of ([ProcId] * [ProcId]) * 
                   DFDMap * DFDSig -> bool 
SigsForAllUsedIds(id,top,dfdmap,dfdsig) ==
 (forall dfdid in set dom dfdmap&
   let mk_(-,-,-,-,dfdsig')=dfdmap(dfdid) in
     dfdsig'(dfdid)=dfdsig(dfdid)) and
     let sigs= dom dfdsig in
       id in set sigs and -- dfds subset sigs and 
       forall mk_(fid,tid) in set top&
         ((is_MSId(fid) or is_DFDId(fid)) => 
          (fid in set sigs)) and 
         ((is_MSId(tid) or is_DFDId(tid)) => 
          (tid in set sigs));
  
FlowConnectOK : ([ProcId] * [ProcId]) -> bool 
FlowConnectOK(mk_(fid,tid)) ==
  ((is_EPId(fid) or fid=nil ) => 
   (is_DFDId(tid) or is_MSId(tid))) and 
  ((is_EPId(tid) or tid=nil ) => 
   (is_DFDId(fid) or is_MSId(fid)));
  
NotRecursive : set of ((DFDId|MSId) * (DFDId|MSId)) -> 
               bool 
NotRecursive(top) ==
  forall mk_(f,-) in set top&
     (f not in set TransClosure(f,top,{}));
  
TransClosure: (DFDId|MSId) * set of ((DFDId|MSId) * 
                                     (DFDId|MSId)) *
               set of (DFDId|MSId) -> set of (DFDId|MSId)
TransClosure(pid,top,dset) ==
   if exists mk_(fromid,toid) in set top&
      ((fromid=pid) or (fromid in set dset)) and 
      (toid not in set dset)
   then let mk_(fromid,toid) in set top be st
           ((fromid=pid) or (fromid in set dset)) and 
           (toid not in set dset)
        in TransClosure(pid,top,dset union {toid})
   else dset
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
types

Document = set of Module;
  
Module = ModuleId * Interface * Definitions;
 
ModuleId = seq of char;
  
Interface = Imports * Export;
  
Imports = set of Import;
  
Import = ModuleId * ModuleSig;
  
Export = ModuleSig;
  
ModuleSig = set of Sig;
  
Sig = TypeSig|OpSig;
  
TypeSig :: TypeId;
  
TypeId = seq of char;
  
OpSig :: id: Id 
         optype : OpType 
         stids : seq of Id;
                                                                                
Definitions = set of Definition;
  
Definition = StateDef|OpDef; --|... 
  
StateDef :: id:Id
            fields: seq of Field;
  
Field :: sel:[Id]
         type:Type;
  
OpDef = ExplOp|ImplOp;
  
ExplOp :: id:Id
          optype:OpType
          parms: seq of Pattern
          body:Stmt
          dpre:Expr;
  
ImplOp :: id:Id
          partp: seq of ParType
          residtp:[IdType]
          dext: seq of ExtVarInf
          body:ImplOpBody;
  
ImplOpBody :: dpre:[Expr]
              dpost:Expr;
  
ParType :: pat:Pattern
           type:Type;
  
IdType :: id:Id
          type:Type;
  
ExtVarInf :: mode:ReadWriteMode
             id:Id
             type:Type;
  
ReadWriteMode = <READ>|<READWRITE>;
  
OpType :: dom':[Type]
          rng':[Type];
  
Type = ProductType |MapType|SetType|SeqType | TypeId | 
       BasicType | EnumType | OptionalType | UnionType; 
       --|... 
  
ProductType :: product: seq1 of Type;
  
MapType :: d: Type
           r: Type;
  
SetType :: Type;
  
SeqType :: Type;
  
BasicType = <TOKEN> | <CHAR> | <BOOL>;
  
EnumType :: seq of char;
  
OptionalType :: Type;
  
UnionType :: set of Type;

Stmt = DclStmt|DefStmt|NonDetStmt|Call|Sequence|Return|
       <IDENT>; -- |... 
  
DclStmt :: dcls: set of AssDef
           body:Stmt;
  
AssDef :: var:Id
          tp:Type;
  
DefStmt :: lhs:Pattern
           rhs:Expr|Call
           din:Stmt;
  
NonDetStmt :: stmts: set of Stmt;
  
Call :: oprt:Id
        args: seq of Expr;
  
Sequence :: stmts: seq1 of Stmt;
  
Return :: val:[Expr];
  
Expr = LetExpr|IfExpr|QuantExpr|BinaryExpr|
       TupleConstructor|Apply|Id|BoolLit; 
       --| ... 
  
LetExpr :: lhs:Pattern
           rhs:Expr
           din:Expr;
  
IfExpr :: test : Expr
          con  : Expr
          alt  : Expr;
  
QuantExpr = ExistsExpr; --| ... 
  
ExistsExpr :: bind: MultTypeBind
              pred:Expr;
  
BinaryExpr :: left:Expr
              op:BinaryOp
              right:Expr;
  
BinaryOp = <AND> | <OR> | <EQUAL> | <MEMB>; --| ... 

  
TupleConstructor :: fields: seq1 of Expr;
  
Apply :: name:Expr
         arg: seq of Expr;
  
BoolLit:: bool;
  
MultTypeBind :: mtb: seq1 of TypeBind;
  
TypeBind :: pats:seq of Pattern
            tp:Type;
  
Pattern = PatternId|TuplePattern; --| ... 
  
PatternId :: name:[Id];
  
TuplePattern :: fields: seq1 of Pattern;
  
Id = seq of char
              
~~~
{% endraw %}

