---
layout: default
title: AlarmErrPP
---

##AlarmErrPP
Author: John Fitzgerald and Peter Gorm Larsen


This is an erronerous version of the alarm example from the VDM++
book, John Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat
and Marcel Verhoef. Validated Designs for Object-oriented Systems,
Springer, New York. 2005, ISBN 1-85233-881-4. This version of the
example is used for illustrating the tool support in tutorial material
about Overture. It is inspired by a subcomponent of a large alarm
system developed by IFAD A/S. It is modelling the management of alarms
for an industrial plant. The purpose of the model is to clarify the
rules governing the duty roster and calling out of experts to deal
with alarms. A comparable model of this example also exists in VDM-SL.



| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|


###alarm.vdmpp

{% raw %}
~~~
class Alarm
types
public String = seq of char;
instance variables 
descr    : String;reqQuali : Expert`Qualification;
operations
public Alarm: Expert`Qualification * String ==> AlarmAlarm(quali,str) ==( descr := str;  reqQuali := quali;  return 7);
public GetReqQuali: () ==> Expert`QualificationGetReqQuali() ==  return reqQuali;
end Alarm
~~~
{% endraw %}

###expert.vdmpp

{% raw %}
~~~
class Expert
instance variables
quali : set of Qualification;
types
public Qualification = <Mech> <Chem> | <Bio> | <Elec>;
operations
public Expert: set of Qualification ==> ExpertExpert(qs) ==  quali := qs;
public GetQuali: () ==> set of QualificationGetQuali() ==  return quali;
end Expert
~~~
{% endraw %}

###plant.vdmpp

{% raw %}
~~~
class Plant
instance variables
alarms   : set of Alarmschedule : map Period to set of Expert;inv PlantInv(alarms,schedule);
functions
PlantInv: set of Alarm * map Period to set of Expert ->           boolPlantInv(as,sch) ==  (forall p in set dom sch & sch(p) <> {}) and  (forall a in set as &     forall p in set dom sch        exists expert in set sch(p) &         a.GetReqQuali() in set expert.GetQuali());
types
public Period = token;
operations
public ExpertToPage: Alarm * Period ==> ExpertExpertToPage(a, p) ==  let expert in set schedule(p) be st      a.GetReqQuali() in set expert.GetQuali()  in    return expertpre a in set alarms and    p in set dom schedulepost let expert = RESULT     in       expert in set schedule(p) and       a.GetReqQuali() in set expert.GetQuali();
public NumberOfExperts: Period ==> natNumberOfExperts(p) ==  return card schedule(p)pre p in set dom schedule;
public ExpertIsOnDuty: Expert ==> set of PeriodExpertIsOnDuty(ex) ==  return {p | p in set dom schedule &               ex in set schedule(p)};
public Plant: set of Alarm *               map Period to set of Expert ==> PlantPlant(als,sch) ==( alarms := als;  schedule := sch)pre PlantInv(als,sch);
end Plant
~~~
{% endraw %}

###test1.vdmpp

{% raw %}
~~~
class Test1
instance variables
a1   : Alarm  := new Alarm(<Mech>,"Mechanical fault");a2   : Alarm  := new Alarm(<Chem>,"Tank overflow");ex1  : Expert := new Expert({<Mech>,<Bio>});ex2  : Expert := new Expert({<Elec>});ex3  : Expert := new Expert({<Chem>,<Bio>,<Mech>});ex4  : Expert := new Expert({<Elec>,<Chem>});plant: Plant  := new Plant({a1},{p1 |-> {ex1,ex4},                                 p2 |-> {ex2,ex3}});
values
p1: Plant`Period = mk_token("Monday day");p2: Plant`Period = mk_token("Monday night");p3: Plant`Period = mk_token("Tuesday day");p4: Plant`Period = mk_token("Tuesday night");
operations
public Run: () ==> set of Plant`Period * ExpertRun() ==   let periods = plant.ExpertIsOnDuty(ex1),      expert  = plant.ExpertToPage(a1,p1)  in     return mk_(periods,expert);
end Test1
~~~
{% endraw %}

