---
layout: default
title: telephoneSL
---

Author: Bernhard Aichernig


This example due to Abrial has been translated from the 
B-notation into VDM-SL. It demonstrates how an event-based 
system may be modeled using the specification language 
of the Vienna Development Method. In the following, 
operations specify the events which can be initiated 
either by the system or by a subscriber (user). An 
implicit style using pre- and post-conditions has 
been chosen, in order to model the system's state 
transitions. The model of the telephone exchange is 
centred around a set of subscribers who may be engaged 
in telephone conversations through a network controlled 
by an exchange. 
|  |           |
| :------------ | :---------- |
|Language Version:| classic|


###telephone.vdmsl

{% raw %}
~~~

module EXCHdefinitions types   Subscriber = token;
   Initiator =  <AI> | <WI> | <SI>;
   Recipient = <WR> | <SR>;
   Status = <fr> | <un> | Initiator | Recipient;
 state Exchange of   status: map Subscriber to Status   calls:  inmap Subscriber to Subscriber inv mk_Exchange(status, calls) ==     forall i in set dom calls &        (status(i) = <WI> and status(calls(i)) = <WR>)        or       (status(i) = <SI> and status(calls(i)) = <SR>) end


operations
  Lift(s: Subscriber)  ext wr status  pre s in set dom (status :> {<fr>})-- pre s in set dom status and status(s) = <fr>  post status = status~ ++ {s |-> <AI>};
  Connect(i: Subscriber, r: Subscriber)  ext wr status      wr calls  pre i in set dom (status :> {<AI>}) and      r in set dom (status :> {<fr>})  post status = status~ ++ {i |-> <WI>, r |-> <WR>} and       calls = calls~ ++ {i |-> r};
  MakeUn(i: Subscriber)  ext wr status  pre i in set dom (status :> {<AI>})   post status = status~ ++ {i |-> <un>};
  Answer(r: Subscriber)      ext rd calls      wr status  pre r in set dom (status :> {<WR>})   post status = status~ ++ {r |-> <SR>, (inverse calls)(r) |-> <SI>};  
  ClearAttempt(i: Subscriber)  ext wr status  pre  i in set dom (status :> {<AI>})   post status = status~ ++ {i |-> <fr>};
  ClearWait(i: Subscriber)  ext wr status      wr calls  pre  i in set dom (status :> {<WI>})   post status = status~ ++ {i |-> <fr>, calls(i) |-> <fr>} and       calls =  {i} <-: calls~;
  ClearSpeak(i: Subscriber)  ext wr status      wr calls  pre  i in set dom (status :> {<SI>})   post status = status~ ++ {i |-> <fr>, calls(i) |-> <un>} and       calls =  {i} <-: calls~;
  Suspend(r: Subscriber)  ext rd calls      wr status  pre r in set dom (status :> {<SR>})   post status = status~ ++ {r |-> <WR>, (inverse calls)(r) |-> <WI>};
  ClearUn(s: Subscriber)  ext wr status  pre s in set dom (status :> {<un>})  post  status = status~ ++ {s |-> <fr>}
end EXCH  

~~~
{% endraw %}

