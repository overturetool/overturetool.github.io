---
layout: default
title: AlarmSL
---

## AlarmSL
Author: John Fitzgerald and Peter Gorm Larsen



This is the alarm example from the VDM-SL book, John Fitzgerald and
Peter Gorm Larsen, Modelling Systems -- Practical Tools and Techniques
in Software Development}, Cambridge University Press, 2nd edition
2009. The example is inspired by a subcomponent of a large alarm
system developed by IFAD A/S. It is modelling the management of alarms
for an industrial plant. The purpose of the model is to clarify the
rules governing the duty roster and calling out of experts to deal
with alarms. A comparable model of this example also exists in VDM++.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| DEFAULT`Run(e1)|
|Entry point     :| DEFAULT`Run(e2)|
|Entry point     :| DEFAULT`Run(e3)|
|Entry point     :| DEFAULT`Run(e4)|
|Entry point     :| DEFAULT`Run(e5)|
|Entry point     :| DEFAULT`Run(e6)|
|Entry point     :| DEFAULT`Run(e7)|
|Entry point     :| DEFAULT`Run(e8)|


### alarm.vdmsl

{% raw %}
~~~
types

  Plant :: schedule : Schedule
           alarms   : set of Alarm
  inv mk_Plant(schedule,alarms) ==
        forall a in set alarms &
	   forall peri in set dom schedule &
	     QualificationOK(schedule(peri),a.quali);
	     
  Schedule = map Period to set of Expert
inv sch ==
   forall exs in set rng sch &
          exs <> {} and
          forall ex1, ex2 in set exs &
                 ex1 <> ex2 => ex1.expertid <> ex2.expertid;

  Period = token;

  Expert :: expertid : ExpertId
            quali    : set of Qualification
  inv ex == ex.quali <> {};

  ExpertId = token;

  Qualification = <Elec> | <Mech> | <Bio> | <Chem>;
	   
  Alarm :: alarmtext : seq of char
           quali     : Qualification

functions

  NumberOfExperts: Period * Plant -> nat
  NumberOfExperts(peri,plant) ==
    card plant.schedule(peri)
  pre peri in set dom plant.schedule;

  ExpertIsOnDuty: Expert * Plant -> set of Period
  ExpertIsOnDuty(ex,mk_Plant(sch,-)) ==
    {peri| peri in set dom sch & ex in set sch(peri)};

  ExpertToPage(a:Alarm,peri:Period,plant:Plant) r: Expert
  pre peri in set dom plant.schedule and
      a in set plant.alarms
  post r in set plant.schedule(peri) and
       a.quali in set r.quali;

  QualificationOK: set of Expert * Qualification -> bool
  QualificationOK(exs,reqquali) ==
    exists ex in set exs & reqquali in set ex.quali;

~~~
{% endraw %}

### changeexpert.vdmsl

{% raw %}
~~~
functions

-- this function is NOT correct. Why not?
ChangeExpert: Plant * Expert * Expert * Period -> Plant
ChangeExpert(mk_Plant(plan,alarms),ex1,ex2,peri) ==
  mk_Plant(plan ++ {peri |-> plan(peri)\{ex1} union {ex2}},alarms)
~~~
{% endraw %}

### testalarm.vdmsl

{% raw %}
~~~
values
 
  p1:Period = mk_token("Monday day");
  p2:Period = mk_token("Monday night");
  p3:Period = mk_token("Tuesday day");
  p4:Period = mk_token("Tuesday night");
  p5:Period = mk_token("Wednesday day");
  ps : set of Period = {p1,p2,p3,p4,p5};

  eid1:ExpertId = mk_token(134);
  eid2:ExpertId = mk_token(145);
  eid3:ExpertId = mk_token(154);
  eid4:ExpertId = mk_token(165);
  eid5:ExpertId = mk_token(169);
  eid6:ExpertId = mk_token(174);
  eid7:ExpertId = mk_token(181);
  eid8:ExpertId = mk_token(190);
  
  e1:Expert = mk_Expert(eid1,{<Elec>});
  e2:Expert = mk_Expert(eid2,{<Mech>,<Chem>});
  e3:Expert = mk_Expert(eid3,{<Bio>,<Chem>,<Elec>});
  e4:Expert = mk_Expert(eid4,{<Bio>});
  e5:Expert = mk_Expert(eid5,{<Chem>,<Bio>});
  e6:Expert = mk_Expert(eid6,{<Elec>,<Chem>,<Bio>,<Mech>});
  e7:Expert = mk_Expert(eid7,{<Elec>,<Mech>});
  e8:Expert = mk_Expert(eid8,{<Mech>,<Bio>});
  exs : set of Expert = {e1,e2,e3,e4,e5,e6,e7,e8};

  s: map Period to set of Expert
     = {p1 |-> {e7,e5,e1},
        p2 |-> {e6},
        p3 |-> {e1,e3,e8},
        p4 |-> {e6}};

  a1:Alarm = mk_Alarm("Power supply missing",<Elec>);
  a2:Alarm = mk_Alarm("Tank overflow",<Mech>);
  a3:Alarm = mk_Alarm("CO2 detected",<Chem>);
  a4:Alarm = mk_Alarm("Biological attack",<Bio>);
  alarms: set of Alarm = {a1,a2,a3,a4};
  
  plant1 : Plant = mk_Plant(s,{a1,a2,a3})
  
operations

Run: Expert ==> set of Period
Run(e) == return ExpertIsOnDuty(e, plant1);

traces 

  Test1: let a in set alarms
         in
           let p in set ps 
           in
             (NumberOfExperts(p,plant1);
              pre_ExpertToPage(a,p,plant1);
              let ex in set exs
              in
                post_ExpertToPage(a,p,plant1,ex))
               
  Test2: let ex in set exs
         in
           ExpertIsOnDuty(ex,plant1)
 
~~~
{% endraw %}

