---
layout: default
title: Alarm++proofPP
---

## Alarm++proofPP
Author: John Fitzgerald and Peter Gorm Larsen


This is a version of the alarm example from the VDM++ book, John 
Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel 
Verhoef, Validated Designs for Object-oriented Systems, Springer, 
New York. 2005, ISBN 1-85233-881-4. This version of the example has 
been used for proof purposes and thus the operations in the normal 
VDM++ of this example are made as functions just like in the VDM-SL
version of the alarm example. The example is inspired by a subcomponent 
of a large alarm system developed by IFAD A/S. It is modelling the 
management of alarms for an industrial plant. The purpose of the 
model is to clarify the rules governing the duty roster and calling 
out of experts to deal with alarms. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new alarm().RunTest()|


### alarmProof.vdmpp

{% raw %}
~~~
-- alarm-with-POs.vdm
-- The alarm example 
class alarm
 
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

public Period = token;

  Expert :: expertid : ExpertId
            quali    : set1 of Qualification;

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
    {peri | peri in set dom sch & ex in set sch(peri)};

  ExpertToPage(a:Alarm,peri:Period,plant:Plant) r: Expert
  pre peri in set dom plant.schedule and
    a in set plant.alarms
  post r in set plant.schedule(peri) and
    a.quali in set r.quali;

static  QualificationOK: set of Expert * Qualification -> bool
  QualificationOK(exs,reqquali) ==
    exists ex in set exs & reqquali in set ex.quali;
  
operations

pure public RunTest : () ==> set of Period
RunTest () ==
  let a1  : Alarm = mk_Alarm("Mechanical fault",<Mech>),
      a2  : Alarm = mk_Alarm("Tank overflow",<Chem>),
      ex1 : Expert = mk_Expert(mk_token(1),{<Mech>,<Bio>}),
      ex2 : Expert = mk_Expert(mk_token(2),{<Elec>}),
      ex3 : Expert = mk_Expert(mk_token(3),{<Chem>,<Bio>,<Mech>}),
      ex4 : Expert = mk_Expert(mk_token(4),{<Elec>,<Chem>}),
      p1  : Period = mk_token("Monday day"),
      p2  : Period = mk_token("Monday night"),
      plant : Plant = mk_Plant({p1 |-> {ex1,ex4}, p2 |-> {ex2,ex3}},{a1,a2})       
  in
    return ExpertIsOnDuty(ex1,plant);
		
end alarm

~~~
{% endraw %}

