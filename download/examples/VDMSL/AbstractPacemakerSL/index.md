---
layout: default
title: AbstractPacemakerSL
---

## AbstractPacemakerSL
Author: Sten Agerholm, Peter Gorm Larsen and Kim Sunesen


This model is described in VDM-SL as a short, flat specification. 
This enables abstraction from design considerations and ensures 
maximum focus on high-level, precise and systematic analysis. This
was developed by Sten Agerholm, Peter Gorm Larsen and Kim Sunesen 
in 1999 in connection with FM'99.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| DEFAULT`IdealHeart()|


### AbstractPacemaker.vdmsl

{% raw %}
~~~
types

Trace = seq of [Event];

Event = <A> | <V>;

state Pacemaker of
  aperiod : nat 
  vdelay  : nat
init p == p = mk_Pacemaker(15,10)
end
operations

Init: nat * nat ==> ()
Init(aperi,vdel) ==
  (aperiod := aperi;
   vdelay := vdel);
    
IdealHeart: () ==> Trace
IdealHeart() ==
  return [ if i mod aperiod = 1
           then <A>
           elseif i mod aperiod = vdelay + 1
           then <V>
           else nil
         | i in set {1,...,100}];
     
FaultyHeart() tr : Trace
post len tr = 100 and
     Periodic(tr,<A>,aperiod) and 
     not Periodic(tr,<V>,aperiod); 
         
functions

Periodic: Trace * Event * nat1 -> bool
Periodic(tr,e,p) ==
  forall t in set inds tr &
     (tr(t) = e) =>
     (t + p <= len tr =>
     ((tr(t+p) = e and
       forall i in set {t+1, ..., t+p-1} & tr(i) <> e))
      and
      (t + p > len tr =>
       forall i in set {t+1, ..., len tr} & tr(i) <> e));
       
values

 wrongTR: Trace = [<A>, nil, <V>, nil, nil, <A>, nil, nil, nil, nil ];
  
operations

Pace: Trace * nat1 * nat1 ==> Trace
Pace(tr,aperi,vdel) ==
  return [nil] ^
         [ if (i mod aperi = vdel + 1) and tr(i) <> <V> 
           then <V>
           else nil
         | i in set inds tl tr];
~~~
{% endraw %}

