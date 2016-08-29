---
layout: default
title: realmSL
---

## realmSL
Author: Peter Gorm Larsen


﻿This document is simply an attempt to model the basic data 
structures and auxiliary functions necessary to represent 
realms. A geometric realm defined here is a planner graph 
over a finite resolution grid. This example have been 
partly tested and the test coverage information is 
displayed on the postscript version of the document. 
The script used for testing is included among the source 
files. Realms are used to represent geographical data. 
This document is based on: 

Realms: A Foundation for Spatial Data Types in Database 
Systems, Ralf Hartmut Güting and Marcus Schneider, 
Advances in Spatial Databases - Third International 
Symposium, SSD'93, Springer-Verlag, June 1993. 

Map Generalisation, Ngo Quoc Tao, UNU/IIST, Macau, 
Draft, January, 1996. 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| REALM`AllLists({TEST`s1,TEST`s2,TEST`s3})|


### test.vdmsl

{% raw %}
~~~
                                           
module TEST

imports from REALM all

exports all

definitions

values

  p1: REALM`NPoint = mk_REALM`NPoint(1,1);

  p2: REALM`NPoint = mk_REALM`NPoint(5,3);

  p3: REALM`NPoint = mk_REALM`NPoint(1,9);

  p4: REALM`NPoint = mk_REALM`NPoint(2,3);

  p5: REALM`NPoint = mk_REALM`NPoint(9,5);

  p6: REALM`NPoint = mk_REALM`NPoint(6,9);

  p7: REALM`NPoint = mk_REALM`NPoint(4,5);

  p8: REALM`NPoint = mk_REALM`NPoint(4,6);

  p9: REALM`NPoint = mk_REALM`NPoint(1,6);

  p10:REALM`NPoint = mk_REALM`NPoint(5,0);

  p11:REALM`NPoint = mk_REALM`NPoint(5,1);

  p12:REALM`NPoint = mk_REALM`NPoint(6,0);

  p13:REALM`NPoint = mk_REALM`NPoint(6,1);

  s1: REALM`NSeg = mk_REALM`NSeg({p1,p2});

  s2: REALM`NSeg = mk_REALM`NSeg({p1,p3});

  s3: REALM`NSeg = mk_REALM`NSeg({p2,p4});

  s4: REALM`NSeg = mk_REALM`NSeg({p4,p3});

  s5: REALM`NSeg = mk_REALM`NSeg({p3,p2});

  s6: REALM`NSeg = mk_REALM`NSeg({p5,p4});

  s7: REALM`NSeg = mk_REALM`NSeg({p6,p1});

  s8: REALM`NSeg = mk_REALM`NSeg({p5,p3});

  s9: REALM`NSeg = mk_REALM`NSeg({p5,p7});

  s10:REALM`NSeg = mk_REALM`NSeg({p9,p3});

  s11:REALM`NSeg = mk_REALM`NSeg({p10,p8});

  s12:REALM`NSeg = mk_REALM`NSeg({p1,p5});

  s13:REALM`NSeg = mk_REALM`NSeg({p10,p13});

  s14:REALM`NSeg = mk_REALM`NSeg({p11,p12});

  r1: REALM`Realm = mk_REALM`Realm({p1,p2},{s1});

  r2: REALM`Realm = mk_REALM`Realm({p5,p4},{s6});

  r3: REALM`Realm = mk_REALM`Realm({p5,p4,p3},{s6,s8});

  r4: REALM`Realm = mk_REALM`Realm({p1,p3,p4,p5,p6,p7,p8},{s6,s8});

  r5: REALM`Realm = mk_REALM`Realm({p10,p13},{s13})

end TEST
             
~~~
{% endraw %}

### realm.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
module REALM

imports from TEST all

exports all

definitions

values

  max: nat = 10

types

  N = nat
  inv n == n < max;
                                                                                              
  NPoint ::
    x : N 
    y : N;

  NSeg :: 
    pts: set of NPoint 
  inv mk_NSeg(ps) == card ps = 2
                                                                                                                                                                                                                                                                                
functions

  SelPoints: NSeg +> NPoint * NPoint
  SelPoints(mk_NSeg(pts)) ==
    let p in set pts
    in 
      let q in set pts \ {p}
      in
        mk_(p,q)
                                                                                                                                                                                                                                         
functions

  Points: NSeg +> set of NPoint
  Points(s) ==
    let mk_(p1,p2) = SelPoints(s)
    in
      {mk_NPoint(x,y)| x in set DiffX(p1,p2), y in set DiffY(p1,p2) &
                       let p = mk_NPoint(x,y) in
                         RatEq(Slope(p,p1),Slope(p2,p)) or p = p1 or p = p2}
                                                                                                                                                                               
types

  Rat = int * int
                                                                                                             
functions

  Slope: NPoint * NPoint +> Rat
  Slope(mk_NPoint(x1,y1),mk_NPoint(x2,y2)) ==
    mk_((y2-y1),(x2-x1));
                                                                                               
  RatEq: Rat * Rat +> bool
  RatEq(mk_(x1,y1),mk_(x2,y2)) ==
    x1 * y2 = x2 * y1;
                                                                                                                                                              
  DiffX: NPoint * NPoint +> set of N
  DiffX(mk_NPoint(x1,-),mk_NPoint(x2,-)) ==
    if x1 < x2
    then {x1,...,x2}
    else {x2,...,x1};

  DiffY: NPoint * NPoint +> set of N
  DiffY(mk_NPoint(-,y1),mk_NPoint(-,y2)) ==
    if y1 < y2
    then {y1,...,y2}
    else {y2,...,y1};
                                                                                                    
  On: NPoint * NSeg +> bool
  On(p,s) ==
     p in set Points(s);
                                                                                                                            
  In: NPoint * NSeg +> bool
  In(p,s) ==
    On(p,s) and p not in set s.pts;
                                                                                                                   
  Meet: NSeg * NSeg +> bool
  Meet(mk_NSeg(pts1),mk_NSeg(pts2)) ==
    card (pts1 inter pts2) = 1;
                                                                                                      
  Parallel: NSeg * NSeg +> bool
  Parallel(s,t) ==
    let mk_(p1,p2) = SelPoints(s),
        mk_(p3,p4) = SelPoints(t)
    in
      Slope(p1,p2) = Slope(p3,p4);
                                                                                                                    
  Overlap: NSeg * NSeg +> bool
  Overlap(s1,s2) ==
    card (Points(s1) inter Points(s2)) > 1;
                                                                                             
  Aligned: NSeg * NSeg +> bool
  Aligned(s1,s2) ==
    Coliner(s1,s2) and not Overlap(s1,s2);
                                                                                                                                  
  Intersect: NSeg * NSeg +> bool
  Intersect(s,t) ==
    let mk_(mk_NPoint(x11,y11),mk_NPoint(x12,y12)) = SelPoints(s),
        mk_(mk_NPoint(x21,y21),mk_NPoint(x22,y22)) = SelPoints(t)
    in
      let a11 = x11 - x12,
          a12 = x22 - x21,
          a21 = y11 - y12,
          a22 = y22 - y21,
          b1  = x11 - x21,
          b2  = y11 - y21
      in
        let d1 = b1 * a22 - b2 * a12,
            d2 = b2 * a11 - b1 * a21,
            d  = a11 * a22 - a12 * a21
        in
          d <> 0 and 
          let l = d1 / d,
              m = d2 / d
          in
            0 < l and l < 1 and
            0 < m and m < 1;

  Coliner: NSeg * NSeg +> bool
  Coliner(s,t) ==
    let mk_(p1,p2) = SelPoints(s),
        mk_(p3,p4) = SelPoints(t) 
    in
      RatEq(Slope(p1,p2),Slope(p3,p4)) and 
      (RatEq(Slope(p1,p3),Slope(p1,p4)) or
       RatEq(Slope(p3,p1),Slope(p1,p4)));
                                                                                                      
  Disjoint: NSeg * NSeg +> bool
  Disjoint(s1,s2) ==
    s1 <> s2 and not Meet(s1,s2) and not Intersect(s1,s2);
                                                                                                                                                                                                                               
  Intersection: NSeg * NSeg -> NPoint
  Intersection(s,t) ==
    let mk_(mk_NPoint(x11,y11),mk_NPoint(x12,y12)) = SelPoints(s),
        mk_(mk_NPoint(x21,y21),mk_NPoint(x22,y22)) = SelPoints(t)
    in
      let a11 = x11 - x12,
          a12 = x22 - x21,
          a21 = y11 - y12,
          a22 = y22 - y21,
          b1  = x11 - x21,
          b2  = y11 - y21
      in
        let d1 = b1 * a22 - b2 * a12,
            d  = a11 * a22 - a12 * a21
        in
          if d <> 0
          then let x0 = x11 * d + d1 * (x12 - x11),
                   y0 = y11 * d + d1 * (y12 - y11)
               in
                 mk_NPoint(RoundToN(abs x0,abs d),RoundToN(abs y0,abs d))
          else undefined
  pre Intersect(s,t);

  RoundToN: nat * nat +> nat 
  RoundToN(a,b) ==
    let mk_(z,aa) = if a >= b
                    then mk_(a div b, a mod b)
                    else mk_(0,a)
    in
      if aa = 0 or 2 * aa <= b
      then z
      else z + 1
                                                                                                                                                                                                                                                                                                                                                          
types

  Realm ::
    points: set of NPoint
    segs  : set of NSeg
  inv mk_Realm(ps,ss) ==
    (forall mk_NSeg(pts) in set ss & pts subset ps) and
    (forall s in set ss, p in set ps & not In(p,s)) and
    (forall s1,s2 in set ss & s1 <> s2 => (not Intersect(s1,s2) and not Overlap(s1,s2)))
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
functions

  InsertNPoint: Realm * NPoint +> Realm
  InsertNPoint(mk_Realm(ps,ss),p) ==
    if p in set ps
    then mk_Realm(ps,ss)
    elseif forall s in set ss & p not in set E(s)
    then mk_Realm(ps union {p},ss)
    else let s_env = {s|s in set ss & p in set E(s)}
         in
           let ss1 = dunion{{mk_NSeg({p1,p}),mk_NSeg({p,p2})}
                           |mk_NSeg({p1,p2}) in set s_env 
                           & p not in set {p1,p2}}
           in
             mk_Realm(ps union {p},(ss union ss1)\s_env) 
  pre not exists s in set ss & In(p,s);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  InsertNSegment: Realm * NSeg +> Realm
  InsertNSegment(mk_Realm(ps,ss),s) ==
    if s in set ss
    then mk_Realm(ps,ss)
    elseif (forall p in set ps & p not in set E(s)\EndPoints(ss)) and 
           (forall t in set ss & not Intersect(s,t) and not Overlap(s,t)) 
    then mk_Realm(ps,ss union {s})
    else let p_env = {p | p in set ps inter E(s)}\EndPoints(ss),
             s_inter = {t|t in set ss & Intersect(s,t)}
         in
           let ss1 = ChopNPoints(p_env,{s})
           in
             let mk_(new_ps, new_ss) = ChopNSegs(ss, s_inter,ss1,{})
             in
               mk_Realm(ps union new_ps,new_ss)
  pre s.pts subset ps;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  ChopNPoints: set of NPoint * set of NSeg +> set of NSeg
  ChopNPoints(ps,ss) ==
    if ps = {}
    then ss
    else let p in set ps
         in
           let s_env = {s | s in set ss & p in set E(s) and
                                          p not in set s.pts}
           in
             let s in set s_env
             in
               let mk_(p1,p2) = SelPoints(s)
               in
                 ChopNPoints(ps\{p},(ss \{s}) union {mk_NSeg({p1,p}),mk_NSeg({p2,p})})
  pre forall p in set ps & exists s in set ss & p in set E(s) and p not in set s.pts;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

  ChopNSegs: set of NSeg * set of NSeg * set of NSeg * set of NPoint +> 
             set of NPoint * set of NSeg
  ChopNSegs(ss,s_inter,newss,ps) ==
    if s_inter = {}
    then mk_(ps,ss union newss)
    else let t in set s_inter
         in
           let {s} = {s |s in set newss & Intersect(s,t)}
           in
             let p = Intersection(t,s)
             in
               let chop_s = {mk_NSeg({p,sp})|sp in set s.pts & p <> sp},
                   chop_t = {mk_NSeg({p,tp})|tp in set t.pts & p <> tp}
               in
                 ChopNSegs((ss \ {t}) union chop_t,
                           s_inter\{t}, (newss \ {s}) union chop_s, ps union{p});
                                                                                                                                                                          
  E: NSeg +> set of NPoint
  E(s) ==
    let mk_(p1,p2) = SelPoints(s)
    in
      {mk_NPoint(x,y) | x in set DiffX(p1,p2), y in set DiffY(p1,p2) &
                        (0 < y and y < max - 1 and 
                              Intersect(mk_NSeg({mk_NPoint(x,y-1),mk_NPoint(x,y+1)}),s)) or
                        (0 < x and x < max - 1 and
                              Intersect(mk_NSeg({mk_NPoint(x-1,y),mk_NPoint(x+1,y)}),s))};
                                                                                                                                                    
  EndPoints: set of NSeg -> set of NPoint
  EndPoints(ss) ==
    dunion{pts|mk_NSeg(pts) in set ss};
                                                                                                                                                                                                                                      

  CycleCheck: set of NSeg +> bool
  CycleCheck(ss) ==
    exists sl in set AllLists(ss) &
      forall i in set inds sl &
        Meet(sl(i),sl(if i = len sl then 1 else i+1)) and
        forall j in set inds sl \ {if i = 1 then len sl else i-1,
                                   i,
                                   if i = len sl then 1 else i+1} & 
          not Meet(sl(i),sl(j));
                                                                                                                                                                                                                                                                                                                                                                       
  AllLists: set of NSeg +> set of seq of NSeg
  AllLists(ss) ==
    cases ss:
      {}     -> {[]},
      {s}    -> {[s]},
      others -> dunion {{[s]^l | 
                         l in set AllLists(ss \{s})} | 
                         s in set ss}
    end
                                                                                                                      
types

  Cycle = set of NSeg
  inv ss == CycleCheck(ss)
                                                                                                                                                                                                                                                     
functions

  OnCycle: NPoint * Cycle +> bool
  OnCycle(p,c) ==
    exists s in set c & On(p,s);

  InsideCycle: NPoint * Cycle +> bool
  InsideCycle(p,c) ==
    not OnCycle(p,c) and IsOdd(card SR(p,c) + card SI(p,c)) ;

  OutsideCycle: NPoint * Cycle +> bool
  OutsideCycle(p,c) ==
    not (OnCycle(p,c) or InsideCycle(p,c));
                                                                                                                                                                                                                                                                                                                                        
  SR: NPoint * Cycle +> set of NSeg
  SR(p,ss) ==
    {s | s in set ss & let mk_(p1,p2) = SelPoints(s)
                       in
                         (p.y < max - 1 and not On(p1,SP(p)) and On(p2,SP(p))) or
                         (p.y < max - 1 and not On(p2,SP(p)) and On(p1,SP(p)))}
  pre CycleCheck(ss);  

  SI: NPoint * Cycle +> set of NSeg
  SI(p,ss) ==
    {s | s in set ss & p.y < max - 1 and Intersect(s,SP(p))};  

  SP: NPoint +> NSeg
  SP(mk_NPoint(x,y)) ==
    mk_NSeg({mk_NPoint(x,y),mk_NPoint(x,max - 1)})
  pre y < max - 1;
 
  IsOdd: nat +> bool
  IsOdd(n) ==
    n mod 2 <> 0;
                                                                                                                                                                                                                                                                                                                                                                                              

  Partition: (NPoint * set of NSeg -> bool) * Cycle +> set of NPoint
  Partition(pred,ss) ==
    {mk_NPoint(x,y) | x in set {0,...,max-1}, y in set {0,...,max-1} & 
                      pred(mk_NPoint(x,y),ss)};
                                                                                                                                                                                 

  P: Cycle +> set of NPoint
  P(ss) ==
    Partition(OnCycle,ss) union Partition(InsideCycle,ss);
                                                                                                                                                                                                                                                                                                   

  AreaInside: Cycle * Cycle +> bool
  AreaInside(c1,c2) ==
    P(c1) subset P(c2);

  EdgeInside: Cycle * Cycle +> bool
  EdgeInside(c1,c2) ==
    AreaInside(c1,c2) and c1 inter c2 = {};

  VertexInside: Cycle * Cycle +> bool
  VertexInside(c1,c2) ==
    EdgeInside(c1,c2) and 
    Partition(OnCycle,c1) inter Partition(OnCycle,c2) = {};
      
  AreaDisjoint: Cycle * Cycle +> bool
  AreaDisjoint(c1,c2) ==
    Partition(InsideCycle,c1) inter P(c2) = {} and
    Partition(InsideCycle,c2) inter P(c1) = {};

  EdgeDisjoint: Cycle * Cycle +> bool
  EdgeDisjoint(c1,c2) ==
    AreaDisjoint(c1,c2) and c1 inter c2 = {};

  VertexDisjoint: Cycle * Cycle +> bool
  VertexDisjoint(c1,c2) ==
    P(c1) inter P(c2) = {};

  AdjacentCycles: Cycle * Cycle +> bool
  AdjacentCycles(c1,c2) ==
    AreaDisjoint(c1,c2) and c1 inter c2 <> {};

  MeetCycles: Cycle * Cycle +> bool
  MeetCycles(c1,c2) ==
    EdgeDisjoint(c1,c2) and
    Partition(OnCycle,c1) inter Partition(OnCycle,c2) <> {};
                                                                                                   

  SAreaInside: NSeg * Cycle +> bool
  SAreaInside(s,c) ==
    let mk_(p1,p2) = SelPoints(s)
    in
      PAreaInside(p1,c) and PAreaInside(p2,c);

  SEdgeInside: NSeg * Cycle +> bool
  SEdgeInside(s,c) ==
    let mk_(p1,p2) = SelPoints(s)
    in
      (PAreaInside(p1,c) and PVertexInside(p2,c)) or
      (PAreaInside(p2,c) and PVertexInside(p1,c));

  SVertexInside: NSeg * Cycle +> bool
  SVertexInside(s,c) ==
    let mk_(p1,p2) = SelPoints(s)
    in
      PVertexInside(p1,c) and PVertexInside(p2,c);
                                                                    

  PAreaInside: NPoint * Cycle +> bool
  PAreaInside(p,c) ==
    p in set P(c);

  PVertexInside: NPoint * Cycle +> bool
  PVertexInside(p,c) ==
    p in set Partition(InsideCycle,c)
                                                                                                                                                                                                                                                                            
types

  Face :: c  : Cycle
          hs : set of Cycle
  inv mk_Face(c,hs) == 
    (forall h in set hs & EdgeInside(h,c)) and
    (forall h1,h2 in set hs & h1 <> h2 => EdgeDisjoint(h1,h2)) and
    (forall ss in set power (c union dunion hs) & 
           CycleCheck(ss) => ss in set hs union {c}) 
                                                                                                   
functions

  PAreaInsideF: NPoint * Face +> bool
  PAreaInsideF(p,mk_Face(c,hs)) ==
    PAreaInside(p,c) and forall h in set hs & not PVertexInside(p,h);

  SAreaInsideF: NSeg * Face +> bool
  SAreaInsideF(s,mk_Face(c,hs)) ==
    SAreaInside(s,c) and forall h in set hs & not SEdgeInside(s,h);
                                                                                                                               

  FAreaInside: Face * Face +> bool
  FAreaInside(mk_Face(c1,hs1),mk_Face(c2,hs2)) ==
    AreaInside(c1,c2) and 
    forall h2 in set hs2 & AreaDisjoint(h2,c1) or 
           exists h1 in set hs1 & AreaInside(h2,h1);

  FAreaDisjoint: Face * Face +> bool
  FAreaDisjoint(mk_Face(c1,hs1),mk_Face(c2,hs2)) ==
    AreaDisjoint(c1,c2) or
    (exists h2 in set hs2 & AreaInside(c1,h2)) or
    (exists h1 in set hs1 & AreaInside(c2,h1));

  FEdgeDisjoint: Face * Face +> bool
  FEdgeDisjoint(mk_Face(c1,hs1),mk_Face(c2,hs2)) ==
    EdgeDisjoint(c1,c2) or 
    (exists h2 in set hs2 & EdgeInside(c1,h2)) or
    (exists h1 in set hs1 & EdgeInside(c2,h1))
    
end REALM
                                                                                                                                                                                                                                                           
~~~
{% endraw %}

