---
layout: default
title: PacemakerSimplePP
---

## PacemakerSimplePP
Author: Steve Riddle and Peter Gorm Larsen


This model is a very simple version of the pacemaker as it has
been used for a small exercise to VDM newcommers. It was first 
used in a VDM course delivered by Steve Riddle and John Fitzgerald
and later used and adjusted by Peter Gorm Larsen also. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new Heart().IdealHeart()|
|Entry point     :| new Pacemaker().Pace(Pacemaker`wrongTR,5,2)|


### Pacemaker.vdmpp

{% raw %}
~~~
class Pacemaker

values

public wrongTR: Heart`Trace = 
                [<A>, nil, <V>, nil, nil, <A>, nil, nil, nil, nil ];
  
operations

public Pace: Heart`Trace * nat1 * nat1 ==> Heart`Trace
Pace(tr,aperi,vdel) ==
  return [nil] ^
         [ if (i mod aperi = vdel + 1) and tr(i) <> <V> 
           then <V>
           else nil
         | i in set inds tl tr];

end Pacemaker
~~~
{% endraw %}

### Heart.vdmpp

{% raw %}
~~~
class Heart

types

public Trace = seq of [Event];

public Event = <A> | <V>;
	values

instance variables

aperiod : nat := 15;
vdelay  : nat := 10;

operations

public Heart: nat * nat ==> Heart
Heart(aperi,vdel) ==
  (aperiod := aperi;
   vdelay := vdel);
    
public IdealHeart: () ==> Trace
IdealHeart() ==
  return [ if i mod aperiod = 1
           then <A>
           elseif i mod aperiod = vdelay + 1
           then <V>
           else nil
         | i in set {1,...,100}];
     
public FaultyHeart() tr : Trace
ext rd aperiod : nat
post len tr = 100 and
     Periodic(tr,<A>,aperiod) and 
     not Periodic(tr,<V>,aperiod); 
         
functions

public Periodic: Trace * Event * nat1 -> bool
Periodic(tr,e,p) ==
  forall t in set inds tr &
     (tr(t) = e) =>
     (t + p <= len tr =>
     ((tr(t+p) = e and
       forall i in set {t+1, ..., t+p-1} & tr(i) <> e))
      and
      (t + p > len tr =>
       forall i in set {t+1, ..., len tr} & tr(i) <> e));

end Heart
~~~
{% endraw %}

