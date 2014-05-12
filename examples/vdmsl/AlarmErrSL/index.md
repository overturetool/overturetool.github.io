---
layout: default
title: AlarmErrSL
---

##AlarmErrSL
Author: John Fitzgerald and Peter Gorm Larsen



This is an erronerous version of the alarm example from the VDM-SL
book, John Fitzgerald and Peter Gorm Larsen, Modelling Systems --
Practical Tools and Techniques in Software Development}, Cambridge
University Press, 2nd edition 2009. This version of the example is
used for illustrating the tool support in tutorial material about
Overture. It is inspired by a subcomponent of a large alarm system
developed by IFAD A/S. It is modelling the management of alarms for an
industrial plant. The purpose of the model is to clarify the rules
governing the duty roster and calling out of experts to deal with
alarms. A comparable model of this example also exists in VDM++.

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|


###alarmerr.vdmsl

{% raw %}
~~~
types
  Plant :: schedule : Schedule           alarms   : set of Alarm  inv mk_Plant(schedule,alarms) ==        forall a in set alarms &	   forall per in set dom schedule &	     QualificationOK(schedule(per),a.quali,a);
  Schedule = map Period to set of Expert  inv schedule == forall exs in set rng schedule & exss <> {};
  Period = token;
  Expert :: expertid : ExpertId            quali    : set of Qualification  inv ex == ex.quali <> {};
  ExpertId = token;
  Qualification = <Elec>  <Mech> | <Bio> | <Chem>;
  Alarm :: alarmtext : seq of char           quali     : Qualification
functions
  NumberOfExperts: Period * Plant -> nat  NumberOfExperts(per,plant) ==    card plant.schedule(per)  pre per in set dom plant.schedule;
  ExpertIsOnDuty: Expert * Plant -> set of Period  ExpertIsOnDuty(ex,mk_Plant(sch,-)) ==    {per| per in set dom sch & ex in set sch(per)}
  ExpertToPage(a:Alarm,per:Period,plant:Plant) r Expert  pre per in set dom plant.schedule and      a in set plant.alarms  post r in set plant.schedule(per) and       a.quali in set r.qualifi;
  QualificationOK: set of Expert * Qualification -> bool  QualificationOK(exs,reqquali) ==    exists ex in set exs  reqquali = ex.quali
~~~
{% endraw %}

