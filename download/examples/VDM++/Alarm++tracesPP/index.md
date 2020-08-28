---
layout: default
title: Alarm++tracesPP
---

## Alarm++tracesPP
Author: John Fitzgerald and Peter Gorm Larsen


This is a version of the alarm example from the VDM++ book where traces
have been added to test automation purposes. See John Fitzgerald, Peter
Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel Verhoef, Validated
Designs for Object-oriented Systems, Springer, New York. 2005, ISBN
1-85233-881-4. The example is inspired by a subcomponent of a large
alarm system developed by IFAD A/S. It is modelling the management of
alarms for an industrial plant. The purpose of the model is to clarify
the rules governing the duty roster and calling out of experts to deal
with alarms. A comparable model of this example also exists in VDM-SL.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new Test1().Run()|


### expert.vdmpp

{% raw %}
~~~
              
class Expert

instance variables

quali : set1 of Qualification;
                            
types
 
public Qualification = <Mech> | <Chem> | <Bio> | <Elec>;
                            
operations

public Expert: set1 of Qualification ==> Expert
Expert(qs) ==
  quali := qs;
                              
pure public GetQuali: () ==> set of Qualification
GetQuali() ==
  return quali;
  
end Expert
             
~~~
{% endraw %}

### alarm.vdmpp

{% raw %}
~~~
              
class Alarm
types
                            
types
  
public String = seq of char;

instance variables 

descr    : String;
reqQuali : Expert`Qualification;
                            
operations

public Alarm: Expert`Qualification * String ==> Alarm
Alarm(quali,str) ==
( descr := str;
  reqQuali := quali
);
                               
pure public GetReqQuali: () ==> Expert`Qualification
GetReqQuali() ==
  return reqQuali;
  
end Alarm
             
~~~
{% endraw %}

### plant.vdmpp

{% raw %}
~~~
              
class Plant

instance variables

alarms   : set of Alarm;
schedule : map Period to set of Expert;
inv PlantInv(alarms,schedule);

functions

PlantInv: set of Alarm * map Period to set of Expert -> 
          bool
PlantInv(as,sch) ==
  (forall p in set dom sch & sch(p) <> {}) and
  (forall a in set as &
     forall p in set dom sch &
       exists expert in set sch(p) &
         a.GetReqQuali() in set expert.GetQuali());

types

public Period = token;

operations

pure public ExpertToPage: Alarm * Period ==> Expert
ExpertToPage(a, p) ==
  let expert in set schedule(p) be st
      a.GetReqQuali() in set expert.GetQuali()
  in
    return expert
pre a in set alarms and
    p in set dom schedule
post let expert = RESULT
     in
       expert in set schedule(p) and
       a.GetReqQuali() in set expert.GetQuali();

pure public NumberOfExperts: Period ==> nat
NumberOfExperts(p) ==
  return card schedule(p)
pre p in set dom schedule;

pure public ExpertIsOnDuty: Expert ==> set of Period
ExpertIsOnDuty(ex) ==
  return {p | p in set dom schedule & 
              ex in set schedule(p)};

public Plant: set of Alarm * 
              map Period to set of Expert ==> Plant
Plant(als,sch) ==
( alarms := als;
  schedule := sch
)
pre PlantInv(als,sch);

public AddExpertToSchedule: Period * Expert ==> ()
AddExpertToSchedule(p,ex) ==
  schedule(p) := if p in set dom schedule
                 then schedule(p) union {ex}
                 else {ex};
  
-- this one is erronerous but combinatorial testing should find that                 
public RemoveExpertFromSchedule: Period * Expert ==> ()
RemoveExpertFromSchedule(p,ex) == 
  let exs = schedule(p)
  in
    schedule := if card exs = 1
                then {p} <-: schedule
                else schedule ++ {p |-> exs \ {ex}}
pre p in set dom schedule;
                
end Plant
             
~~~
{% endraw %}

### test1.vdmpp

{% raw %}
~~~
              
class Test1

instance variables

a1   : Alarm  := new Alarm(<Mech>,"Mechanical fault");
a2   : Alarm  := new Alarm(<Chem>,"Tank overflow");
ex1  : Expert := new Expert({<Mech>,<Bio>});
ex2  : Expert := new Expert({<Elec>});
ex3  : Expert := new Expert({<Chem>,<Bio>,<Mech>});
ex4  : Expert := new Expert({<Elec>,<Chem>});
plant: Plant  := new Plant({a1},{p1 |-> {ex1,ex4},
                                 p2 |-> {ex2,ex3}});
exs : set of Expert := {ex1,ex2,ex3,ex4};

values

p1: Plant`Period = mk_token("Monday day");
p2: Plant`Period = mk_token("Monday night");
p3: Plant`Period = mk_token("Tuesday day");
p4: Plant`Period = mk_token("Tuesday night");
ps : set of Plant`Period = {p1,p2,p3,p4};

operations

pure public Run: () ==> set of Plant`Period * Expert
Run() == 
  let periods = plant.ExpertIsOnDuty(ex1),
      expert  = plant.ExpertToPage(a1,p1)
  in 
    return mk_(periods,expert);

traces

  AddingAndDeleting: let myex in set exs
                     in
                       let myex2 in set exs \ {myex}
                       in
                         let p in set ps 
                         in
                          (plant.AddExpertToSchedule(p,myex);
                           plant.AddExpertToSchedule(p,myex2);
                           plant.RemoveExpertFromSchedule(p,myex);
                           plant.RemoveExpertFromSchedule(p,myex2))
                           
                       
end Test1
             
~~~
{% endraw %}

