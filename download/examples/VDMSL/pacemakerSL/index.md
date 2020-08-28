---
layout: default
title: pacemakerSL
---

## pacemakerSL
Author: Hugo Macedo


The Pacemaker Challenge problem has been proposed by the 
North American Software Certification Consortium, based 
on a pacemaker specification offered by Boston Scientific. 
Participants in the challenge are invited to develop models, 
designs and implementations, as well as generating evidence 
that would be of value in certifying the software. More 
details can be found in:

Hugo Daniel Macedo, Peter Gorm Larsen and John Fitzgerald, 
Incremental Development of a Distributed Real-Time Model 
of a Cardiac Pacing System Using VDM, FM 2008: Formal 
Methods, LNCS 5014, Eds.: Jorge Cuellar, Tom Maibaum and 
Kaisa Sere, May 2008. 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### PacemakerAOOR.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
module PacemakerAOOR

definitions 

types 

Time = nat;

SenseTimeline = seq of (Sense * [AccelerometerData] * Time)
inv stl == let l = [i.#2 | i in seq stl & i.#2 <> nil]
           in l(1) = HIGH and forall i in set inds l & l(i) < MED => l(i-1) > MED;

AccelerometerData = nat
inv n == n < 3;

Sense = <NONE> | <PULSE>;

                                                                                                                            

ReactionTimeline = seq of (Reaction * Time); 

Reaction = <NONE> | <PULSE>;
                            
state Sigma of
   LRL                : nat
   LRLs               : nat
   LRLf               : nat
   MSR                : nat
   ActivityThreshold  : AccelerometerData
   ReactionTime       : nat
   RecoveryTime       : nat
   rateChangePlan     : map nat to (<INC> | <DEC>)
init s == s = mk_Sigma(60,0,2,120,MED,10,2,{|->})
end   
   

operations

Pacemaker : SenseTimeline ==> ReactionTimeline
Pacemaker(inp) == 
   return if inp = [] 
          then []
          else [HeartController(hd inp)] ^ Pacemaker(tl inp);
                         
HeartController : (Sense * [AccelerometerData] * Time) ==> (Reaction * Time)
HeartController (mk_(-,acc,time)) == 
  (
   if acc <> nil then AdjustRate(acc,time);        
   if time in set dom rateChangePlan then applyChange(rateChangePlan(time));
   if LRLf <= LRLs 
   then (
          LRLs := 1; 
          return mk_(<PULSE>,time)
        )
   else (
          LRLs := LRLs + 1; 
          return mk_(<NONE>,time)
        ); 

   );   

 applyChange : <INC> | <DEC> ==> ()
 applyChange (a) == if a = <INC> then LRLf := 1
                                 else LRLf := 2;
 
 AdjustRate : AccelerometerData * Time ==> ()
 AdjustRate(act,time) == 
    if act > ActivityThreshold
    then rateChangePlan := {time + 10*2 |-> <INC>}
    else rateChangePlan := {time + 120*2 |-> <DEC>}


 

                             
values 

LOW  : AccelerometerData = 0;
MED  : AccelerometerData = 1;
HIGH : AccelerometerData = 2;

sensedData : seq of (Sense * [AccelerometerData] * Time) = 
[mk_(<NONE>,nil,i) | i in set {1,...,120}]^
[mk_(<NONE>,HIGH,121)]^
[mk_(<NONE>,nil,i) | i in set {121,...,190}]^
[mk_(<NONE>,LOW,191)]^
[mk_(<NONE>,nil,i) | i in set {192,...,436}];	

end PacemakerAOOR
             
~~~
{% endraw %}

### RateController.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
module RateController

definitions 

types 

Input = map Time to ActivityData;
                                                                                                                                                                                                                                                      
Time = nat1;

ActivityData = nat1
inv a == a <= 7;

                                                                                       
RF = nat1
inv rf == rf <= 16;
                                                                                                                                   

Output = map Time to PPM; 

PPM = nat1
inv ppm == ppm >= 30 and ppm <= 175;

                                                                                 
values
   LRL           : PPM = 60;
   MSR           : PPM = 120;
   Threshold     : ActivityData = 6;
   ReactionTime  : Time = 150;
   ResponseFactor: RF = 8; -- Not understood
   RecoveryTime  : Time = 5;
                                                                                                                                                                                                                                                                                        
functions

Simulate(inp : Input)  out : Output
pre 0 not in set dom inp
post forall t in set dom inp &
            (out(t) = MSR =>  inp(t-ReactionTime) > Threshold or out(t-1) = MSR)
     and
     forall t in set dom inp \ {1} & 
            (out(t) = LRL =>  inp(t-RecoveryTime) < Threshold or out(t-1) = LRL);




end RateController
                                                                                                                                                                                                                                                                                                               
~~~
{% endraw %}

### PacemakerDDD.vdmsl

{% raw %}
~~~
              
module PacemakerDDD

definitions 

values 
LRL     : nat = 60;   -- ppm
ARP     : nat = 250;  -- ms
VRP     : nat = 320;  -- ms
PVARP   : nat = 250;  -- ms
AVD     : nat = 150;  -- ms
VAD     : nat = 850; -- ms

types 
SenseTimeline = set of (Time * Chamber);

Chamber = <ATRIUM> | <VENTRICLE>;

Time = int;

Alarm = nat;

ReactionTimeline = set of (Time * Chamber); 
   

functions

Pacemaker : Time * SenseTimeline -> ReactionTimeline
Pacemaker (t,s) == PM(mk_(1,t,s,{},1000,0,-ARP,-VRP)).#1;


PM : (Time * Time * SenseTimeline * ReactionTimeline * Alarm * Alarm * Time * Time) -> 
                                   ReactionTimeline * Alarm * Alarm * Time * Time
PM (mk_(i,t,s,r,AA,VA,LastA,LastV)) == 

                                 if i = t
                                 then mk_(r,AA,VA,LastA,LastV)
                                 else if mk_(i,<ATRIUM>) in set s 
                                      then PM(c(i+1,t,s,SensedAtrium(i,r,AA,VA,LastA,LastV)))
                                      elseif mk_(i,<VENTRICLE>) in set s 
                                          then PM(c(i+1,t,s,SensedVentricle(i,r,AA,VA,LastA,LastV)))
                                          else PM(c(i+1,t,s,SensedNothing(i,r,AA,VA,LastA,LastV)));


SensedAtrium : Time * ReactionTimeline * Alarm * Alarm * Time * Time -> ReactionTimeline * Alarm * Alarm * Time * Time
SensedAtrium (t,r,AA,VA,LastA,LastV) == 
 
                             if t - LastA < ARP or VA > 0 or t - LastA < PVARP   -- 5.4.2  or 5.4.5 or 5.4.3
                             then SensedNothing(t,r,AA,VA,LastA,LastV)
                             else mk_(r,0,t + AVD,t,LastV); -- valid sense + schedule Ventricle


SensedVentricle : Time * ReactionTimeline * Alarm * Alarm * Time * Time -> ReactionTimeline * Alarm * Alarm * Time * Time
SensedVentricle (t,r,AA,VA,LastA,LastV) == 

                                if t - LastV < VRP -- 5.4.3
                                then SensedNothing(t,r,AA,VA,LastA,LastV)
                                else mk_(r,t + VAD,0,LastA,t); -- valid sense + unset ventricle alarm


SensedNothing : Time * ReactionTimeline * Alarm * Alarm * Time * Time -> ReactionTimeline * Alarm * Alarm * Time * Time
SensedNothing (t, r, AA, VA,LastA,LastV) == 
             
             if AA > 0 and t >= AA                                           -- Atrium alarm is set and fired
             then mk_(r union {mk_(t,<ATRIUM>)}, 0, t + AVD,t,LastV)   -- atrial pulse + schedule ventrile
             elseif VA > 0 and t >= VA                                       -- Ventricle alarm is set and fired
                 then mk_(r union {mk_(t,<VENTRICLE>)}, t + VAD, 0,LastA,t)       -- pulse ventricle + unset timer
                 else mk_(r, AA, VA,LastA,LastV);                            -- no alarms




-- Auxiliar funtcions

-- A curry function
c : Time * Time * SenseTimeline * (ReactionTimeline * Alarm * Alarm * Time * Time) -> 
                    Time * Time * SenseTimeline * ReactionTimeline * Alarm * Alarm * Time * Time
c (i,t,s,mk_(r,a,v,la,lv)) == mk_(i,t,s,r,a,v,la,lv);

end PacemakerDDD
             
~~~
{% endraw %}

### PacemakerDOO.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
module PacemakerDOO

definitions 

types 

Time = nat;

SensedTimeline = set of (Chamber * Time);

Chamber = <ATRIA> | <VENTRICLE>;
                                                                                                        
ReactionTimeline = set of (Chamber * Time);

                                                                                
values
   LRL     : nat = 60;
   URL     : nat = 120;
   FixedAV : nat = 150;
                                                                                                                                                                                                                                                                                                
functions

Pacemaker (mk_(inp,n) : SensedTimeline * nat1) r : ReactionTimeline
post let nPulsesAtria = card {i | i in set r & i.#1 = <ATRIA>}, 
         nPulsesVentricle = card {i | i in set r & i.#1 = <VENTRICLE>}
     in  nPulsesAtria / n >= (LRL / 60) / 1000
         and
         nPulsesVentricle / n <= (URL / 60) / 1000
         and
         forall mk_(<ATRIA>,ta) in set r & (exists mk_(<VENTRICLE>,tv) in set r & tv = ta + FixedAV) ;
	                             
end PacemakerDOO
                                                                                                                                                                      
~~~
{% endraw %}

### PacemakerAOO.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
module PacemakerAOO

definitions 

values 
LRL     : nat = 60;
                                                                                                                                                 
types 
SenseTimeline = map Time to Sense;

Sense = <NONE> | <PULSE>;

Time = nat1;
                                                                                                                                                          
ReactionTimeline = map Time to Reaction; 

Reaction = <NONE> | <PULSE>;
   
functions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
Pacemaker (inp : SenseTimeline) r : ReactionTimeline
post let m = {i | i in set dom r & r(i) = <PULSE>}
     in card dom r = card dom inp 
        and
        card dom inp > 1 => r(1) = <PULSE> 
        and
        forall x in set m & (
           (exists y in set m & y > x) => 
                 (exists y in set m & abs(x - y) <= 60000/LRL and x <> y));

end PacemakerAOO
                                                                                                                                                                                                                                                                                                                                                                                                                                                      
~~~
{% endraw %}

### PacemakerAAT.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
module PacemakerAAT

definitions 

values 
LRL     : nat = 60;
ARP     : nat = 250;
                                                                                               
types 
SenseTimeline = seq of Sense ;

Sense = <NONE> | <PULSE>;

Time = nat1;
                                                                                                                                                                               
ReactionTimeline = seq of Reaction;

Reaction = <NONE> | <PULSE>;
   
functions
                                                                                                                                                                                                                                                                                                                            
Pacemaker (inp : SenseTimeline) r : ReactionTimeline
post let m = {i | i in set inds r & r(i) = <PULSE>}
     in len r = len inp 
        and
        forall x in set m & (
           (exists y in set m & y > x) => 
                 (exists z in set m &  z >= x and z - x <= 60000/LRL)
           );


end PacemakerAAT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
~~~
{% endraw %}

### PacemakerAAI.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
module PacemakerAAI

definitions 

values 
LRL     : nat = 60;
ARP     : nat = 250;
                                                                                               
types 
SenseTimeline = seq of Sense;

Sense = <NONE> | <PULSE>;

                                                                                                                                                                               
ReactionTimeline = seq of Reaction; 

Reaction = <NONE> | <PULSE>;
   
functions
                                                                                                                                                                                                                                                                                                                              
Pacemaker (inp : SenseTimeline) r : ReactionTimeline
post let m = {i | i in set inds r & r(i) = <PULSE>}
     in len r = len inp 
        and
        r(1) = <PULSE> 
        and
        forall x in set m & (
           (exists y in set m & y > x) => 
                 (exists z in set m &  z >= x and z - x <= 60000/LRL)
                 or
                 (exists z in set inds inp &  z >= x and z - x > ARP and inp(z) = <PULSE>)
           );


end PacemakerAAI
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
~~~
{% endraw %}

