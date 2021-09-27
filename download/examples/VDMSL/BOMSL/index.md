---
layout: default
title: BOMSL
---

## BOMSL
Author: Peter Gorm Larsen


This specification was produced for VDM-SL courses presented by Peter 
Gorm Larsen in 1996. The modelling of a Bill Of Material (BOM) is a rather
standard example making use of an Directed Acyclic Graph (DAG) structure. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| DEFAULT`Parts(1,bom)|
|Entry point     :| DEFAULT`Parts(1,cycle)|


### bom.vdmsl

{% raw %}
~~~
              
types

BOM = map Pn to set of Pn
inv bom == 
  (forall ps in set rng bom & ps subset dom bom) and
  (forall p in set dom bom & p not in set Parts(p, bom));
    
Pn = nat

values

bom = {1 |-> {2,4}, 2 |-> {3,4,5}, 3 |-> {5,6}, 4 |-> {6}, 
       5 |-> {4}, 6 |-> {}};
    
cycle = {1 |-> {2,4}, 2 |-> {3,4,5}, 3 |-> {5,6}, 4 |-> {6}, 
         5 |-> {4}, 6 |-> {1}};

functions

Parts: Pn * map Pn to set of Pn -> set of Pn
Parts(p, bom) ==
  TransClos(bom, bom(p))
pre p in set dom bom;

TransClos: (map Pn to set of Pn) * set of Pn -> set of Pn
TransClos(bom, ps) ==
  if forall p in set ps & bom(p) subset ps
  then ps
  else let newps = dunion { bom(p) | p in set ps} 
       in
         TransClos(bom, ps union newps)            
pre ps subset dom bom
measure card dom bom - card ps;
  
Explode: Pn * BOM -> set of Pn
Explode(p, bom) ==
  bom(p) union Exps(bom, bom(p))
pre p in set dom bom;

Exps: BOM * set of Pn -> set of Pn
Exps(bom, ps) ==
  if ps = {}
  then {}
  else let p1 in set ps 
       in 
         Explode(p1, bom) union Exps(bom, ps \ {p1})
pre ps subset dom bom;

Enter: BOM * Pn * set of Pn -> BOM
Enter(bom, p, ps) ==
  bom munion { p |-> ps }
pre (p not in set dom bom) and (ps subset dom bom);

Delete: Pn * BOM -> BOM
Delete(p, bom) ==
  {p} <-: bom
pre (p in set dom bom) and (inv_BOM({p} <-: bom));

Add: Pn * Pn * BOM -> BOM
Add(p1, p2, bom) == 
  bom ++ {p1 |-> bom(p1) union {p2} }
pre (p1 in set dom bom) and (p2 in set dom bom) and 
    (p2 not in set bom(p1)) and (p1 not in set Explode(p2,bom));

Erase: Pn * Pn * BOM -> BOM
Erase(p1, p2, bom) ==
  bom ++ { p1 |-> bom(p1) \ {p2} }
pre (p1 in set dom bom) and (p2 in set dom bom) and
    (p2 in set bom(p1))
              
~~~
{% endraw %}

