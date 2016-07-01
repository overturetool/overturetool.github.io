---
layout: default
title: recursiveSL
---

## recursiveSL
Author: John Fitzgerald and Peter Gorm Larsen


This example is made by John Fitgerald and Peter Gorm Larsen and it
is used in the chapter about recursion in the second edition of the 
VDM-SL book. It contains a number of examples for recursive graph 
structures and functionality over such graphs.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| DEFAULT`AllLabDesc(lgraph,1)|


### graphs.vdmsl

{% raw %}
~~~
types

Graph = map Id to set of Id
inv g == dunion rng g subset dom g;

ASyncGraph = Graph
inv asyncg == 
  forall id in set dom asyncg & 
     id not in set TransClos(asyncg,id);

Path = seq of Id;

Id = nat

functions

Paths: ASyncGraph * Id -> set of Path
Paths(g,id) ==
  let children = g(id)
  in
    if children = {}
    then {[id]}
    else dunion {{[id] ^ p | p in set Paths(g,c)} 
                | c in set children}  
pre id in set dom g
measure measureTransClos;

measureTransClos : ASyncGraph * Id -> nat
measureTransClos(g,id) == 
  card TransClos(g,id);

LinearPath: Graph * Id -> Path
LinearPath(g,id) ==
  let children = g(id)
  in
    if card children <> 1 or 
       exists parent in set dom g & 
          parent <> id and children subset g(parent)
    then [id]
    else let child in set children
         in
           [id] ^ LinearPath(g,child)
pre id in set dom g and
    id not in set TransClos(g,id);
   
TransClos: Graph * Id -> set of Id
TransClos(g,id) ==
  dunion {TransClosAux(g,c,{})| c in set g(id)}
pre id in set dom g;

TransClosAux: Graph * Id * set of Id -> set of Id
TransClosAux(g,id,reached) ==
  if id in set reached
  then {}
  else {id} union
       dunion {TransClosAux(g,c,reached union {id}) 
              | c in set g(id)}
pre id in set dom g
measure measureGraphReached;

measureGraphReached : Graph * Id * set of Id -> nat
measureGraphReached(g,-,reached) ==
  card dom g - card reached;

AsycDescendents: AcyclicGraph * Id -> set of Id
AsycDescendents(g,id) == 
  {id} union dunion {AsycDescendents(g,c) | c in set  g(id)}
pre id in set dom g
measure measureTransClos;

Descendents: Graph * Id * set of Id -> set of Id
Descendents(g,id,reached) ==
  if id in set reached
  then {}
  else {id} union
       dunion {Descendents(g,c,reached union {id}) 
              | c in set g(id)}
pre id in set dom g
measure measureGraphReached;

AllDesc: Graph * Id -> set of Id
AllDesc(g,id) ==
  dunion {TransClosAux(g,c,{})| c in set g(id)}
pre id in set dom g;

types

AcyclicGraph = Graph
inv acg == 
  not exists id in set dom acg & 
     id in set AllDesc(acg,id);

values

  graph : Graph = {1 |-> {2,3},
                   2 |-> {4},
                   3 |-> {5},
                   4 |-> {6},
                   5 |-> {6},
                   6 |-> {}}
~~~
{% endraw %}

### labgraphs.vdmsl

{% raw %}
~~~
types

LabGraph = map NodeId to (map ArcId to NodeId)
inv g == 
  UniqueArcIds(g) and
  forall m in set rng g & rng m subset dom g;

AcyclicLabGraph = LabGraph
inv acg == 
  not exists id in set dom acg & 
     id in set AllLabDesc(acg,id);

NodeId = nat;

ArcId = nat

functions

AllLabDesc: LabGraph * NodeId -> set of NodeId
AllLabDesc(g,id) ==
  dunion {LabDescendents(g,c,{})| c in set rng g(id)}
pre id in set dom g;

measureLabGraphReached : LabGraph * Id * set of Id -> nat
measureLabGraphReached(g,-,reached) ==
  card dom g - card reached;

LabDescendents: LabGraph * NodeId * set of NodeId -> set of NodeId
LabDescendents(g,id,reached) ==
  if id in set reached
  then {}
  else {id} union
       dunion {LabDescendents(g,c,reached union {id}) 
              | c in set rng g(id)}
pre id in set dom g
measure measureLabGraphReached;

UniqueArcIds: map NodeId to (map ArcId to NodeId) -> bool
UniqueArcIds(g) ==
  let m = {nid |-> dom g(nid) | nid in set dom g}
  in
    forall nid1, nid2 in set dom m &
       nid1 <> nid2 => m(nid1) inter m(nid2) = {}

values

  lgraph : LabGraph = {1 |-> {1 |-> 2,2 |-> 3},
                       2 |-> {3 |-> 4},
                       3 |-> {4 |-> 5},
                       4 |-> {5 |-> 6},
                       5 |-> {6 |-> 6},
                       6 |-> {|->}}
~~~
{% endraw %}

