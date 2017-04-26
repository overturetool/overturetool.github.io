---
layout: default
title: metroSL
---

## metroSL
Author: Sten Agerholm


This model presents three different abstract specifications of a metro
door management system in VDM-SL. The purpose of the presentation is
to describe alternatives to the Metro specification developed in the
European research project called SPECTRUM. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### metro.vdmsl

{% raw %}
~~~
              
module Metro1

exports all

definitions 

state Metro of
  doors: <Open> | <Closed>
  train: <Moving> | <Stopped>
inv mk_Metro(doors,train) == not (doors = <Open> and train = <Moving>)
init metro == metro = mk_Metro(<Closed>,<Stopped>)
end

operations
  Accelerate: () ==> ()
  Accelerate() == 
    (train:= <Moving>)
  pre doors = <Closed>;

  Break: () ==> ()
  Break() == 
    (train:= <Stopped>);
  
  Open: () ==> ()
  Open() == 
    (doors:= <Open>)
  pre train = <Stopped>;
  
  Close: () ==> ()
  Close() == 
    (doors:= <Closed>)

end Metro1
                                                                                                                                                                                         
module Metro1a

exports all

definitions 

state Metro of
  doorsopen: bool
  trainmoving: bool
inv mk_Metro(doorsopen,trainmoving) == not (doorsopen and trainmoving)
init metro == metro = mk_Metro(false,false)
end

operations
  Accelerate() 
  ext wr trainmoving
      rd doorsopen
  pre not doorsopen
  post trainmoving;

  Break()
  ext wr trainmoving
  post not trainmoving;

  Open()
  ext wr doorsopen
      rd trainmoving
  pre not trainmoving
  post doorsopen;

  Close()
  ext wr doorsopen
  post not doorsopen

end Metro1a
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
module Metro2

exports all

definitions 

state Metro of
  doors: <Open> | <Closed>
  train: <Moving> | <Stopped>
  bellon: [Time]  -- The bell is not ringing if bellon is nil
inv mk_Metro(doors,train,bellon) == 
  not (doors = <Open> and train = <Moving>) 
init metro == metro = mk_Metro(<Closed>,<Stopped>,nil)
end

types

  Time = nat;

operations
  Accelerate: () ==> ()
  Accelerate() == 
    (train:= <Moving>)
  pre doors = <Open>;

  Break: () ==> ()
  Break() == 
    (train:= <Stopped>);
  
  Open: () ==> ()
  Open() == 
    (doors:= <Open>)
  pre train = <Stopped>;
  
  CloseDepressed: Time ==> ()
  CloseDepressed(t) == 
    (bellon:= t)
  pre bellon = nil;

  CloseReleased: Time ==> ()
  CloseReleased(t) == 
    (if t+3 >= bellon 
     then doors:= <Closed> 
     else skip;
     bellon:= nil)
  pre bellon <> nil

end Metro2
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
module Metro3

exports all

definitions

types
  Time = real
  inv t == t>0;

  Interval:: start: Time
             stop: Time
  inv mk_Interval(s,e) == s < e;

  LifeTime = seq of Interval
  inv s == 
    forall i in set {1,...,len s - 1} & s(i).stop < s(i+1).start;

  System::
    train   : LifeTime  -- intervals for moving
    doors   : LifeTime  -- intervals for open
    bell    : LifeTime  -- intervals for ringing
    closebut: LifeTime  -- intervals for depressed
    closeassist: LifeTime -- intervals for activated
  inv mk_System(train,doors,bell,closebut,closeassist) ==
    NotMovingAndOpen(train,doors) and
    BellOnWhenCloseBut(bell,closebut) and
    CloseAssistAfter3Secs(closeassist,bell);
    
functions
  NotMovingAndOpen: LifeTime * LifeTime -> bool
  NotMovingAndOpen(train,doors) == 
    forall t in seq train, d in seq doors &
      not OverlappingIntervals(t,d);

  CloseAssistAfter3Secs: LifeTime * LifeTime -> bool
  CloseAssistAfter3Secs(closeassist,bell) == 
    forall c in seq closeassist &
      exists b in seq bell &
        b.stop >= b.start+3 and
        c.start = b.start+3;

  BellOnWhenCloseBut: LifeTime * LifeTime -> bool
  BellOnWhenCloseBut(bell,closebut) == 
    forall b in seq bell &
      exists c in seq closebut &
        SubInterval(b,c) 
  -- Too loose, correct?

functions -- Auxiliary functions

  OverlappingIntervals: Interval * Interval -> bool
  OverlappingIntervals(int1,int2) == 
    undefined; -- not specified yet.

  SubInterval: Interval * Interval -> bool
  SubInterval(int1,int2) == 
    undefined; -- not specified yet.

end Metro3
                                                                                                                                                                                                                                                                                                                                                                                      
~~~
{% endraw %}

