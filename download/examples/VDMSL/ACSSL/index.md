---
layout: default
title: ACSSL
---

## ACSSL
Author: Paul Mukherjee



This specification describes the safety requirements involved in adding and 
removing explosives at an explosives storage site. The specification is based 
on United Kingdom Ministry of Defence regulations concerning safe storage of 
explosives, which in turn are based on UN regulations. 
Details of the specification may be found in:   
1. P. Mukherjee and V. Stavridou, "The Formal Specification of Safety 
   Requirements for the Storage of Explosives", technical report DITC 185/91, 
   National Physical Laboratory, 1991. 
2. P. Mukherjee and V. Stavridou, "The Formal Specification of Safety 
   Requirements for Storing Explosives", Formal Aspects of Computing, 
   5(4):299-336, 1993. 
This example is primarily specified using the implicit style in VDM so it
does not have a main debug functionality.



| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| DEFAULT`sum({3,4,5})|


### acs.vdmsl

{% raw %}
~~~

types

Cg = <A>|<B>|<C>|<D>|<E>|<F>|<G>|<H>|<J>|<K>|<L>|<S>;
Hzd = <ONEPONE> | <ONEPTWO> | <ONEPTHREE> | <ONEPFOUR>;

Inf = <INFINITY>;

Kg = real|Inf
  inv k == k <> <INFINITY> => k >= 0;

Realp = real
  inv r == r >= 0;

Metre = Realp;

Object::   neq: Kg
           hzd: Hzd
           cg:   Cg
           xlen: Metre
           ylen: Metre
           zlen: Metre;

Element_label = token;

Element::  object: Object
           x: Realp
           y: Realp;

Point::   x: Realp
          y: Realp;

Pes_types = <EARTHCOVEREDBUILDING>|<HEAVYWALLEDBUILDING>|
              <TRAVERSEDSITE>|<UNTRAVERSEDSITE>;

Magazine::   type: Pes_types
             max_neq: Kg
             hzd: Hzd
             length: Metre
             breadth: Metre
             height: Metre
             elements: inmap Element_label to Element;
        

Storage_building :: kind: <IGLOOSEVENBAR>|<IGLOOTHREEBAR>|
                        <EARTHCOVEREDBUILDING>|
                        <EARTHCOVEREDWITHFIREHEADWALL>|
                        <EARTHCOVEREDWITHDOORBARRICADE>|
                        <HEAVYWALLEDWITHPROTECTIVEROOF>|
                        <HEAVYWALLEDWITHOUTPROTECTIVEROOF>|
                        <TRAVERSEDSITE>| <UNTRAVERSEDSITE>;

Process_building :: kind: <WITHPROTECTIVEROOFTRAVERSED>|
                        <WITHOUTPROTECTIVEROOFTRAVERSED>|
                        <WITHORWITHOUTPROTECTIVEROOFUNTRAVERSED>;

Other_building :: kind: <INHABITEDBUILDING>|<TRAFFICROUTE>;

Exs_types = Storage_building | Process_building | Other_building;

Building::  type: Exs_types
            length: Metre
            breadth: Metre
            height: Metre;

Quad = seq of Point
  inv q == len q = 4 and rectangular(q);

Site_label = token;

Exposed_site:: building: Building
               vertices: Quad
               door: nat
inv exs == (forall p in seq exs.vertices(2,...,4) &
                distance(mk_Point(0,0),exs.vertices(1)) <= 
                        distance(mk_Point(0,0),p)   and
                distance(mk_Point(0,0),exs.vertices(1)) = 
                        distance(mk_Point(0,0),p)
                   => exs.vertices(1).y < p.y)      and
              exs.door in set {0,...,3}             and
             (exists i in set inds exs.vertices, j in set inds exs.vertices &
                abs(j-i) = 2                and
                distance(exs.vertices(1),exs.vertices(i)) = 
                       exs.building.length  and
                distance(exs.vertices(1),exs.vertices(j)) = 
                       exs.building.breadth);

Pot_explosion_site:: mgzn: Magazine
                     vertices: seq of Point
                     door: nat
inv pes == (forall p in seq pes.vertices(2,...,4) &
                distance(mk_Point(0,0),pes.vertices(1)) <= 
                        distance(mk_Point(0,0),p)   and
                distance(mk_Point(0,0),pes.vertices(1)) = 
                        distance(mk_Point(0,0),p)
                   => pes.vertices(1).y < p.y)      and
              pes.door in set {0,...,3}             and
              (exists i in set inds pes.vertices, j in set inds pes.vertices &
                distance(pes.vertices(1),pes.vertices(i)) = 
                      pes.mgzn.length      and
                distance(pes.vertices(1),pes.vertices(j)) = pes.mgzn.breadth);

Line:: m: real
       c: real;

RelOrientation = <PERP> | <FACING> | <AWAY>;

OrientedExs = Exs_types * (RelOrientation | <NONE>)
inv mk_(exs,ro) ==
  not is_Storage_building(exs) <=> (ro = <NONE>);

OrientedPes = Pes_types * (RelOrientation | <NONE>)
inv mk_(pes,ro) ==
  pes <> <EARTHCOVEREDBUILDING> <=> (ro = <NONE>);

Table_Co_ordinate = OrientedExs * OrientedPes



values

asharp: map Hzd to (map Table_Co_ordinate to real)
= { h |-> let m : map Table_Co_ordinate to real in m | h: Hzd};
-- is not yet defined;

bsharp: map Hzd to (map Table_Co_ordinate to real)
= { h |-> let m : map Table_Co_ordinate to real in m | h: Hzd};
-- is not yet defined;

exceptions_hd1_1 : set of Table_Co_ordinate
= let s: set of Table_Co_ordinate in s;

exceptions_hd1_2 : set of Table_Co_ordinate
= let s: set of Table_Co_ordinate in s;

exceptions_hd1_3a : set of Table_Co_ordinate
= let s: set of Table_Co_ordinate in s;

exceptions_hd1_3b : set of Table_Co_ordinate
= let s: set of Table_Co_ordinate in s;

Xmax = 5; -- is not yet defined;
Ymax = 5; -- is not yet defined;

next_point: map nat to nat
  = { 1 |-> 2, 2|-> 3, 3|-> 4, 4|-> 1};

Compatible_pairs: set of (Cg * Cg) = 
{mk_(<A>,<A>),mk_(<A>,<S>),mk_(<B>,<B>),mk_(<B>,<S>),mk_(<C>,<C>),mk_(<C>,<D>),
 mk_(<C>,<E>),mk_(<C>,<G>),mk_(<C>,<S>),mk_(<D>,<D>),mk_(<D>,<E>),mk_(<D>,<G>),
 mk_(<D>,<S>),mk_(<E>,<E>),mk_(<E>,<G>),mk_(<E>,<G>),mk_(<E>,<S>),mk_(<F>,<F>),
 mk_(<F>,<S>),mk_(<G>,<G>),mk_(<G>,<S>),mk_(<H>,<H>),mk_(<H>,<S>),mk_(<J>,<J>),
 mk_(<J>,<S>)};

hzdnum: map Hzd to nat
  = { <ONEPONE> |-> 1, <ONEPTWO> |-> 2, <ONEPTHREE> |-> 3, <ONEPFOUR> |-> 4};

orientation: map nat to RelOrientation
  = {0 |-> <PERP>, 1 |-> <FACING>, 2 |-> <PERP>, 3 |-> <AWAY>};


esharp: nat = let x : nat in x -- is not yet defined

state Store of
        pes: inmap Site_label to Pot_explosion_site
        exs: inmap Site_label to Exposed_site
        xmax: Metre
        ymax: Metre
inv mk_Store(pes,exs,xmax,ymax) == 
      xmax > 0 and ymax > 0 and
      dom pes subset dom exs and
      forall p in set dom pes & is_Storage_building(exs(p).building.type)
init store == store = mk_Store({|->},{|->},Xmax,Ymax)
end


functions

rectangular: seq of Point -> bool
rectangular(v) ==
        distance(v(1),v(2)) = distance(v(3),v(4)) and
        distance(v(1),v(4)) = distance(v(2),v(3)) and
        distance(v(1),v(3)) = distance(v(2),v(4)) and
        card elems v = len v
pre len v = 4;

distance: Point * Point -> Metre
distance(p1,p2) == sqrt((p2.x-p1.x)**2 + (p2.y-p1.y)**2);

sqrt (x: real) s:Realp
pre x >= 0
post s >= 0 and s**2 = x;

suff_space_at:Object * Magazine * Point -> bool
suff_space_at(o,m,p) ==
        0 < p.x + o.xlen and p.x + o.xlen <= m.length and
        0 < p.y + o.ylen and p.y + o.ylen <= m.breadth and 
        0 < o.zlen and o.zlen <= m.height and
        forall a in set rng m.elements &
                ((a.x > p.x + o.xlen) or (a.x + a.object.xlen < p.x)) and
                ((a.y > p.y + o.ylen) or (a.y + a.object.ylen < p.y));

find_point(o:Object, m:Magazine) pt:Point
pre exists x: Realp, y:Realp & suff_space_at(o,m,mk_Point(x,y))
post suff_space_at(o,m,pt);

within_hazard: Object * Magazine -> bool
within_hazard(o,m) ==
  hzdnum(o.hzd) >= hzdnum(m.hzd);

compatible: Cg * Cg -> bool
compatible(m,n) == (mk_(m,n) in set Compatible_pairs) 
                        or (mk_(n,m) in set Compatible_pairs);

all_compatible: Object * Magazine -> bool
all_compatible(o,m) == forall elt in set rng m.elements &
                        compatible(o.cg,elt.object.cg);

sum: set of real -> real
sum(s) ==
  if s = {} 
  then 0 
  else let x in set s 
       in
         x + sum(s \ {x})
measure card s;

suff_capacity: Object * Magazine -> bool
suff_capacity(o,m) ==
  if m.max_neq <> <INFINITY> 
  then sum({elt.object.neq| elt in set rng m.elements}) + o.neq <= m.max_neq
  else true;

safe_addition: Object * Magazine * Point -> bool
safe_addition(o,m,p) ==
        suff_space_at(o,m,p) and
        within_hazard(o,m) and
        all_compatible(o,m) and
        suff_capacity(o,m);

rel_pos:Pot_explosion_site * Exposed_site -> nat
rel_pos(pes,exs) == floor(ang_sep(pes,exs)) div 90;

table_entry: Pot_explosion_site * Exposed_site ->  Table_Co_ordinate
table_entry(pes,exs) ==
     let inc = rel_pos(pes,exs) in
     let exs_ro = if is_Storage_building(exs.building.type)
                  then orientation((inc + exs.door) mod 4)
                  else <NONE>,
         pes_ro = if pes.mgzn.type = <EARTHCOVEREDBUILDING>
                  then orientation((inc + pes.door) mod 4)
                  else <NONE> in 
     let o_exs = mk_(exs.building.type,exs_ro),
         o_pes = mk_(pes.mgzn.type,pes_ro) in
     mk_(o_exs,o_pes);    

min(s: set1 of Realp) m: Realp
post m in set s and forall x in set s & m <= x;

max(s: set1 of Realp) m:Realp
post m in set s and forall x in set s & m >= x;

truncated: Realp -> bool
truncated(r) == is_nat(r *(10 ** esharp));

side: Point * Point -> set of Point
side(p1,p2) ==
     if p2.x = p1.x
     then { mk_Point(p1.x,y) | y: Realp &
                        truncated(y) and
                        min({p1.y,p2.y}) <= y and y<=max({p1.y,p2.y})}
     else { mk_Point(x,y) | x: Realp, y: Realp &
                truncated(x) and
                truncated(y) and
                min({p1.x,p2.x}) <= x and x <= max({p1.x,p2.x}) and
                min({p1.y,p2.y}) <= y and y <= max({p1.y,p2.y}) and
                if x<> p1.x 
                then (y - p1.y)/(x - p1.x) = (p2.y - p1.y)/(p2.x - p1.x)
                else y = p1.y};

perimeter: (Pot_explosion_site|Exposed_site) -> (set of Point)
perimeter(site) ==
  dunion {side(site.vertices(i),site.vertices(next_point(i)))|
                i in set {1,...,4}};

shortest_dist:Pot_explosion_site * Exposed_site -> Metre
shortest_dist(pes,exs) ==
  min({distance(p1,p2)| p1: Point, p2:Point &
                p1 in set perimeter(pes) and
                p2 in set perimeter(exs)});

minseparation:Pot_explosion_site * Exposed_site -> bool
minseparation(pes,exs) == 
  shortest_dist(pes,exs) >= bsharp((pes.mgzn.hzd))(table_entry(pes,exs));

qd: Pot_explosion_site * Exposed_site -> Kg
qd(pes,exs) ==
  let d = shortest_dist(pes,exs),
      tbe = table_entry(pes,exs) in
        cases pes.mgzn.hzd :
          (<ONEPONE>) ->
                if tbe in set exceptions_hd1_1
                then (if d < 180
                     then 0.54 * d ** (3/2)
                     elseif (180 <=d and d < 240)
                     then 0.03*d ** 2
                     else 9.1*10**(-5) * d**3)
                else asharp(<ONEPONE>)(tbe) *d**3,
          (<ONEPTWO>) ->
                if tbe in set exceptions_hd1_2
                then (<INFINITY>)
                else asharp(<ONEPTWO>)(tbe) * d**5.5,
          (<ONEPTHREE>) ->
                if tbe in set exceptions_hd1_3a
                then <INFINITY>
                elseif tbe in set exceptions_hd1_3b
                then asharp(<ONEPTHREE>)(tbe) * d**2
                else asharp(<ONEPTHREE>)(tbe) * d**3,
          (<ONEPFOUR>) ->
                <INFINITY>
        end;

nearest_storage_building(pes:Pot_explosion_site,
                         exs: set of Exposed_site)e:Exposed_site
pre exists ex in set exs & is_Storage_building(ex.building.type)
post e in set exs and
     is_Storage_building(e.building.type) and
     forall ex in set exs &
        is_Storage_building(ex.building.type) =>
          shortest_dist(pes,e) <= shortest_dist(pes,ex);

nearest_inhabited_building(pes:Pot_explosion_site,
                           exs: set of Exposed_site)e:Exposed_site
pre exists ex in set exs & ex.building.type.kind = <INHABITEDBUILDING>
post e in set exs and
     e.building.type.kind = <INHABITEDBUILDING> and
     forall ex in set exs &
        ex.building.type.kind = <INHABITEDBUILDING> =>
          shortest_dist(pes,e) <= shortest_dist(pes,ex);

nearest_traffic_route(pes:Pot_explosion_site,
                      exs: set of Exposed_site)e:Exposed_site
pre exists ex in set exs & ex.building.type.kind = <TRAFFICROUTE>
post e in set exs and
     e.building.type.kind = <TRAFFICROUTE> and
     forall ex in set exs &
        ex.building.type.kind = <TRAFFICROUTE> =>
          shortest_dist(pes,e) <= shortest_dist(pes,ex);

nearest_process_building(pes:Pot_explosion_site,
                         exs: set of Exposed_site)e:Exposed_site
pre exists ex in set exs & is_Process_building(ex.building.type)
post e in set exs and
     is_Process_building(e.building.type) and
     (forall ex in set exs &
        is_Process_building(ex.building.type) =>
          shortest_dist(pes,e) <= shortest_dist(pes,ex));

nearest_buildings(pes:Pot_explosion_site, exs: set of Exposed_site) 
                    exset: (set of Exposed_site)
post (exists e in set exs & is_Storage_building(e.building.type))
        => nearest_storage_building(pes,exs) in set exset and
     (exists e in set exs & is_Process_building(e.building.type))
        => nearest_process_building(pes,exs) in set exset and
     (exists e in set exs & e.building.type.kind = <INHABITEDBUILDING>)
        => nearest_inhabited_building(pes,exs) in set exset and
     (exists e in set exs & e.building.type.kind = <TRAFFICROUTE>)
        => nearest_traffic_route(pes,exs) in set exset;

find_max_neq:Pot_explosion_site * set1 of Exposed_site -> Kg
find_max_neq(pes,exs) == 
  min({qd(pes,e)|e in set nearest_buildings(pes,exs)});

centre(v: Quad) p: Point
post forall i in set {1,...,3} &
        distance(p,v(i)) = distance(p,v(1));

line_eqn: Point * Point * Point -> Line
line_eqn(p1,p2,p3) == 
  mk_Line( (p1.y + p2.y - 2*p3.y)/(p1.x + p2.x - 2* p3.x),
              p3.y - p3.x*((p1.y + p2.y - 2*p3.y)/(p1.x + p2.x - 2*p3.x)))
pre distance(p1,p3) = distance(p2,p3);

incline:Point * Point * Point * Point * Point * Point -> real
incline(p1,p2,p3,p4,p5,p6) ==
     let mk_Line(m1,c1) = line_eqn(p5,p6,p2) in
     let mk_Line(m2,c2) = line_eqn(p3,p4,p1) in
     let x3 = (c1-c2)/(m2-m1) in
     let y3 = ((m2*c1 - m1*c2)/(m2-m1)) in
           sqrt( ((x3-p2.x)**2 + (y3-p2.y)**2)/((x3-p1.x)**2 + (y3-p1.y)**2))
pre distance(p1,p2) = distance(p1,p4) and
    distance(p2,p5) = distance(p2,p6) and
    line_eqn(p5,p6,p2).m*line_eqn(p3,p4,p1).m = -1;


ang_sep(pes:Pot_explosion_site, exs:Exposed_site) qsharp:real
post let fsharp = arctan(incline(centre(pes.vertices),centre(exs.vertices),
                        pes.vertices(1), pes.vertices(4), exs.vertices(1),
                        exs.vertices(2))) in
     if centre(pes.vertices).x = centre(exs.vertices).x
     then ( if centre(pes.vertices).y < centre(exs.vertices).y
            then qsharp = fsharp
            else qsharp = fsharp + 180)
     else let m1 = line_eqn(pes.vertices(1), pes.vertices(4), 
                                   centre(pes.vertices)).m,
              m2 = ((centre(exs.vertices).y - centre(pes.vertices).y)/
                         (centre(exs.vertices).x - centre(pes.vertices).x)) in 
          if m2 > m1 then qsharp = fsharp else qsharp = fsharp + 180;

arctan: real -> real
arctan(r) ==
let res : real in res --  is not yet defined

operations

ADD_OBJECT(o:Object, elt: Element_label, site: Site_label)
ext wr pes: inmap Site_label to Pot_explosion_site
pre site in set dom pes and
    exists pt: Point & (safe_addition(o,(pes(site)).mgzn,pt) and
                        elt not in set dom (pes(site)).mgzn.elements)
post let p = pes~(site) in
     let mk_Point(x,y) = find_point(o,p.mgzn) in
     let new_elems = p.mgzn.elements ++ {elt |-> mk_Element(o,x,y)} in
     let new_mag = mu(p.mgzn, elements |-> new_elems) in
     let new_site = mu(p, mgzn |-> new_mag) in
     pes = pes~ ++ {site |-> new_site};


REMOVE_OBJECT(elt: Element_label, site: Site_label)
ext wr pes: inmap Site_label to Pot_explosion_site
pre site in set dom pes and elt in set dom (pes(site)).mgzn.elements
post let p = pes~(site) in
     let new_elems = {elt} <-: p.mgzn.elements in
     let new_mag = mu(p.mgzn, elements |-> new_elems) in
     let new_site = mu(p, mgzn |-> new_mag) in
     pes = pes~ ++ {site |-> new_site};


ADD_PES(pex:Pot_explosion_site, label: Site_label,type:Storage_building)
ext wr pes: inmap Site_label to Pot_explosion_site
    wr exs: inmap Site_label to Exposed_site
    rd xmax, ymax: Metre
pre forall exp in set rng exs & minseparation(pex,exp) and
    forall v in seq pex.vertices &
        (0 <= v.x and v.x <= xmax and
         0 <= v.y and v.y <= ymax) and
    label not in set dom pes
post let new_neq = find_max_neq(pex,rng(exs~)) in
     let new_mgzn = mu(pex.mgzn, max_neq |-> new_neq) in
     let new_pex = mu (pex, mgzn |-> new_mgzn) in
     let new_building = mk_Building(type,pex.mgzn.length,pex.mgzn.breadth,
                                    pex.mgzn.height) in
     let new_exp = mk_Exposed_site(new_building,pex.vertices,pex.door) in
     pes = pes~ ++ { label |-> new_pex} and
     exs = exs~ ++ { label |-> new_exp};





ADD_EXP(ex:Exposed_site, label: Site_label)
ext wr exs: inmap Site_label to Exposed_site
    rd pes: inmap Site_label to Pot_explosion_site
    rd xmax, ymax: Metre
pre not (is_Storage_building(ex.building.type)) and
    forall v in seq ex.vertices & 
        (0<=v.x and v.x <= xmax and
         0<=v.y and v.y <= ymax) and
    label not in set dom exs and
    forall pex in set rng pes &
       let proposed_neq = find_max_neq(pex, rng(exs ++ {label |-> ex})) in
       if proposed_neq <> <INFINITY>
         then find_max_neq(pex,rng(exs)) <= proposed_neq
       else true
post exs = exs~ ++ {label |-> ex}

~~~
{% endraw %}

