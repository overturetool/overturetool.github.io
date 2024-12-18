---
layout: default
title: DigraphSL
---

## DigraphSL
Author: Janusz Laski



The specification describes how directed graphs and relations over
such graphs can can tested for relevant properties and manipulated in
different ways. This specification is produced by Janusz Laski from
Oakland University in the USA. Most of the definitions in this
specification can be interpreted.

This model is only an illustration of the problems germane to automatic 
software analysis. To get a better understanding of the scope of the 
analysis consult the text "Software Verification and Analysis, An 
Integrated, Hands-on -- Approach," by Janusz Laski w/William Stanley, 
Springer 2009. A brief online introduction is offered on the Website
www.stadtools.com.

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| relations`IsTransitive(relations`A5)|
|Entry point     :| relations`IsTransitive(A7)|


### flowgraphtypes.vdmsl

{% raw %}
~~~
------------------------------------------------------------------
-- Module  flowgraph_types
-- Author:  Janusz Laski
-- Purpose: Exports types needed in flowgraph analysis
-- Version 2.0  (January 10, 2010)
-----------------------------------------------------------------
module flowgraph_types

imports from relations
  all

exports
  all

definitions

types

Node = nat1;

Nodes = set of Node; -- any subset of Node
GraphNodes = set of Node
inv N == 
  card N >0 and 
  N = {1,..., card N}; -- sets of consecutive natural   numbers

Arc = Node * Node; 
BinRel = relations`BinRel; --  family of Arc-sets

Variable = token;
Vars = set of Variable;
Varmap = seq of Vars;

Path = seq of Node;
     Paths = set of Path;

FlowGraph::
  N: Nodes
  A: BinRel
  S: Node
  E: Node
  inv G == (relations`field(G.A) subset G.N)
            -- arcs in A come from N * N
    and (G.S in set G.N) and (G.E in set G.N); 
            -- Start and Exit nodes come from N

ExtendedFlowGraph :: 
     G: FlowGraph
     U: Varmap -- U(i) = list of variables used in node i
     D: Varmap -- D(i) = list of variables defined in i
     inv mk_ExtendedFlowGraph(G,U,D) == 
          (len U = card G.N) and (len D = card G.N);


values

     N1: Nodes={1,...,4};
     N2: Nodes={1,...,10};
     N3: Nodes={1};  

-- special  relations
     A0: BinRel = {}; -- empty relation
     A1: BinRel={mk_(1,2)}; -- singleton relation
     A2: BinRel={mk_(1,2), mk_(2,3), mk_(3,4)}; -- linear relation 
     A3: BinRel=A1 union {mk_(4,5), mk_(4, 1), mk_(5, 6), mk_(6, 7), 
                          mk_(7, 8), mk_(8, 9), mk_(9, 10)}; 
                          -- binary tree rooted at 4
     A4: BinRel={mk_(1,2), mk_(2,3), mk_(2,4), mk_(3,5), mk_(4,5), 
                 mk_(5,6)}; -- acyclic relation
     A5: BinRel={mk_(1,2), mk_(2,3), mk_(2,4), mk_(3,5), mk_(4,6), 
                 mk_(6,5), mk_(5,7)}; -- acyclic relation
     A6: BinRel={mk_(1,1), mk_(2,2), mk_(3,3), mk_(4,4), mk_(5,5)}; 
                 --sling relation
     A7: BinRel={mk_(1,2), mk_(2,3), mk_(2,4), mk_(3,5), mk_(4,6), 
                 mk_(6,5), mk_(5,7), mk_(5,2)}; -- cyclic relation
     A8: BinRel=A7 union {mk_(6,1)}; -- nested cycle
-- Flowgraphs
  
     G1: FlowGraph= mk_FlowGraph(N1, A1,1,4); -- isolated nodes
     G2: FlowGraph= mk_FlowGraph(N1, A2,1,4); -- linear graph
     G3: FlowGraph= mk_FlowGraph(N2, A3,1,6);
--     G4: FlowGraph= mk_FlowGraph(N3, A1,1,6); -- invalid 
     G5: FlowGraph= mk_FlowGraph(N2, A5,1,7);
     G6: FlowGraph= mk_FlowGraph(N2, A6,1,5);  

 -- STATE DEFINITION

state ST of -- two isolated nodes, no arcs
  G: FlowGraph
init x == 
  x = mk_ST(mk_FlowGraph({1,2},{},1,2)) 
end

end flowgraph_types
~~~
{% endraw %}

### digraph.vdmsl

{% raw %}
~~~
------------------------------------------------------------------
-- Module   digraph. Used in SAMS (Software Analysis and Modeling System)
-- Author:  Janusz Laski
-- Purpose: Define functions for manipulating graphs 
-- Version 2.0.0  (January 10,2010)

-- This model is only an illustration of the problems germane to automatic 
-- software anlaysis. To get a better understanding of the scope of the 
-- analysis consult the text "Software Verification and Analysis, An 
-- Integrated, Hands-on -- Approach," by Janusz Laski w/William Stanley, 
-- Springer 2009. A brief online introduction is offered on the Website
-- www.stadtools.com.
-----------------------------------------------------------------



module digraph 

imports

  from flowgraph_types all,
  from relations all

exports all

definitions

types 

Node =  flowgraph_types`Node;

Flowgraph = flowgraph_types`FlowGraph;

functions

succ: Flowgraph * Node  -> set of Node
succ(G,n) == 
  {k| k in set G.N & mk_(n,k) in set G.A};

pred: Flowgraph * Node  -> set of Node
pred(G,n) == 
  {k| k in set G.N & mk_(k,n) in set G.A};

existspath: Flowgraph * Node * Node -> bool
existspath(MFG,n1,n2) == 
  mk_(n1,n2) in set relations`Warshall(MFG.A);


end digraph
~~~
{% endraw %}

### Relations.vdmsl

{% raw %}
~~~
------------------------------------------------------------------
-- Module   relations
-- Author:  Janusz Laski
-- Purpose: Exports functions for manipulating binary relations  
-- Version 2.0  (January 10, 2010)
-----------------------------------------------------------------



module relations

exports all

definitions

types

     Node=nat1;
     BinRel = set of (nat1 * nat1);

values

 A0: BinRel = {}; -- empty relation
 A1: BinRel={mk_(1,2)}; -- singleton relation
 A2: BinRel={mk_(1,2), mk_(2,3), mk_(3,4)}; -- linear relation 
 A3: BinRel=A1 union {mk_(4,5), mk_(4, 1), mk_(5, 6), mk_(6, 7), mk_(7, 8), 
            mk_(8, 9), mk_(9, 10), mk_(2,3)}; -- binary tree rooted at 4
 A4: BinRel={mk_(1,2), mk_(2,3), mk_(2,4), mk_(3,5), mk_(4,5), mk_(5,6)}; 
            -- acyclic relation
 A5: BinRel={mk_(1,2), mk_(2,3), mk_(2,4), mk_(3,5), mk_(4,6), mk_(6,5), 
             mk_(5,7)}; -- acyclic relation
 A6: BinRel={mk_(1,1), mk_(2,2), mk_(3,3), mk_(4,4), mk_(5,5)}; 
            --sling relation
 A7: BinRel={mk_(1,2), mk_(2,3), mk_(2,4), mk_(3,5), mk_(4,6), mk_(6,5), 
             mk_(5,7), mk_(5,2)}; -- cyclic relation
 A8: BinRel=A7 union {mk_(6,1)}; -- nested cycle


functions

-- TESTING PROPERTIES OF RELATIONS

 IsReflexive:BinRel-> bool
 IsReflexive(R)==
   forall x in set field(R) &
      mk_(x,x) in set R; 
                 
IsSymmetrical:BinRel-> bool
IsSymmetrical(R)==
  forall x,y in set field(R) &
     ((mk_(x,y) in set R) => (mk_(y,x) in set R)); 

 IsTransitive:BinRel-> bool
 IsTransitive(R)==
   forall x,y,z in set field(R) &
     (((mk_(x,y) in set R) and (mk_(y,z) in set R))=> (mk_(x,z) in set R)); 

 IsEquivalence:BinRel-> bool
 IsEquivalence(R)==
   IsReflexive(R) and IsSymmetrical(R) and IsTransitive(R); 


-- OPERATIONS ON RELATIONS

 domain:BinRel -> set of nat1 
 domain(R) == 
   { x | mk_(x,-) in set R};
     
 domain1:BinRel -> set of nat1
 -- can't be interpreted 'cause of type binds
 domain1(R) == 
   {x|x:nat1 & exists y:nat1 & mk_(x,y) in set R};

 range:BinRel -> set of nat1
 range(R) == 
   { y | mk_(-,y) in set R};

 field:BinRel -> set of nat1
 field(R) == 
   domain(R) union range(R);

 inverse_rel:BinRel -> BinRel
 inverse_rel(R) == 
   {mk_(y,x)|mk_(x,y) in set R};
   -- or x in set domain(R),y in set range(R) & mk_(x,y) in set R};


 id_rel: BinRel -> BinRel
 -- Returns the identity relation of R  
 id_rel(R) == 
   {mk_(x,x)| x in set field(R)};

 Composition:BinRel * BinRel -> BinRel
 Composition(R,Q) == 
   {mk_(a,c)|mk_(a,b1) in set R,
             mk_(b2,c) in set Q & b1=b2};
   -- or{mk_(a,c)| a in set domain(R), c in set range(Q) & 
   -- exists b in set (range(R) inter domain(Q)) &
   -- mk_(a,b) in set R and mk_(b,c) in set Q};

 power_of:BinRel * nat1 -> BinRel --returns the xth power of R
 power_of(R,x) == 
   if (x = 1) 
   then R
   else Composition(R, power_of(R, x-1))
 pre x>0;

 Power_rel: BinRel * nat -> BinRel
 -- Returns  the kth power of R.  
 Power_rel(R,k) == 
   if k=0 
   then id_rel(R)
   elseif k=1 
   then R
   else Composition(R,Power_rel(R, k-1));


-- RELATIONAL CLOSURES

 Reflexive_cl: BinRel -> BinRel
 -- Returns the reflexive closure of R  
 Reflexive_cl(R) == 
   (R union id_rel(R));
 
 Symmetric_cl: BinRel -> BinRel  
 -- Returns the symmetric closure of R  
 Symmetric_cl(R) ==
   R union inverse_rel(R);

 Transitive_cl: BinRel -> BinRel 
 -- Returns the transitive irreflexive closure of R 
 -- Identical to formal definition of closure. 
 -- Very inefficient interpretation: for every k,k>1, ALL
 -- lower powers of R are computed from scratch
 Transitive_cl(R) == 
   dunion{Power_rel(R,k) | k in set {1,...,card field(R)}};

 TransitiveRefl_cl: BinRel -> BinRel
 -- Returns the transitive reflexive closure of R  
 TransitiveRefl_cl(R) == 
   dunion{Power_rel(R,k) | k in set {0,...,card field(R)}};

 PowerList: BinRel -> seq of BinRel
 PowerList(R) == 
   BuildList(R, card field(R))
 pre R<>{};


 BuildList: BinRel * nat1 -> seq of BinRel
 -- BuildList(R,n) == sequence of powers of relation R, of maximal length n,
 -- i.e. RESULT = [Power_rel(R,1),...,Power_rel(R,n)], n>0.
 -- Thus RESULT(i)=Power_rel(R,i), 0<i<=n.
 -- For ACYCLIC R, only NONEMPTY powers of R are computed, i.e.
 -- in that case the length of the result list may be less than n.
 -- If R = {} the result is [{}] for any n>0.
 -- The function  derives each power of R only once.

 BuildList(R,n) == 
   if n=1 
   then [R]
   else let M= BuildList(R,n-1), C=Composition(M(len M),R)
        in
          if C={}  --empty higher powers of R
          then M 
          else M ^ [C]
 pre n>0;

  
 maxset: set1 of int -> int
 -- returns maximum of set 
 maxset(S) == 
   let x in set S
   in
     if card S = 1 
     then x
     else max2(x,maxset(S\ {x}));


 max2: int * int -> int
 max2(a,b) == 
   if a>= b 
   then a 
   else b;


operations

pure Warshall: BinRel ==> BinRel
-- efficiently computes transitive closure of Q
Warshall(Q) == 
 (dcl i: nat1, j: nat1, k: nat1, R: BinRel;
   
 R := Q;
   let n = maxset (field(R))
     in
  for  k = 1 to n do
    for  i = 1 to n do 
      for j = 1 to n do
       if mk_(i,j) not in set R 
       then if mk_(i,k) in set R and mk_(k,j) in set R
             then R := R union {mk_(i,j)};
 return R;
);


-- Testing functions&operations

functions

test_PowerList: BinRel -> bool
-- tests PowerList using a simpler albeit  inefficient 
-- Power_Rel as an automatic  test oracle, to avoid manual test evaluation
test_PowerList(R)== 
  let L = PowerList(R), 
      n = card field(R)
  in 
  (forall i in set inds L & L(i)=Power_rel(R,i))
     and len L<n => Power_rel(R, len L +1) ={};
-- For "normal" applications pre_PowerList(R) <=> R<>{} should be observed.
-- However, PowerList should also be tested for R={}.
-- Such a STRESS TEST shows the function's behaviour for invalid data.


end relations
~~~
{% endraw %}

