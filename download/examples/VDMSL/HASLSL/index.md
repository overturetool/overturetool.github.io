---
layout: default
title: HASLSL
---

## HASLSL
Author: Sune Wolff


This is a VDM-SL version of a home automation example constructed
by Sune Wolff. 

More information can be found in:
Peter Gorm Larsen, John Fitzgerald and Sune Wolff, Methods for the Development 
of Distributed Real-Time Embedded Systems Using VDM, International Journal of 
Software and Informatics, Vol 3., No 2-3, June/September 2009, pp. 305-341. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| DEFAULT`HomeAutomation([mk_(true,20,19,60,62),mk_(false,20,20,60,60),mk_(true,20,19,60,60)])|


### HA.vdmsl

{% raw %}
~~~
types

HAInputs = seq of HAInput;
HAInput = Change * TargetTemp * CurrentTemp * TargetHumid * CurrentHumid;

Change = bool;

TargetTemp = nat
inv num == num <= 100;

CurrentTemp = nat
inv num == num <= 100;

TargetHumid = nat
inv num == num <= 100;

CurrentHumid = nat
inv num == num <= 100;

HAOut = seq of OutStep;
OutStep = EnvManipulation * AbsTime;
AbsTime = nat;

EnvManipulation = <OpenWindow> | <CloseWindow> | <IncTemp> | <DecTemp> | <LeaveTemp>;


values

TempChangeDuration  : nat = 2;
HumidChangeDuration : nat = 4;
StepLength          : nat = 1;


functions

HomeAutomation: HAInputs -> HAOut
HomeAutomation(haInputs) ==
  HA(haInputs, [], 0);

HA: HAInputs * HAOut * nat -> HAOut
HA(haInputs, outputSoFar, curTime) ==
  if haInputs = []
  then outputSoFar
  else let mk_(change,targetTemp,currentTemp,targetHumid,currentHumid) = hd haInputs,
           rest = tl haInputs,
           nextTime = curTime + StepLength             
       in
         if outputSoFar <> []
         then let mk_(-,timeOfLastInput) = outputSoFar(len outputSoFar)
              in
                if curTime <= timeOfLastInput and change
                then let interruptedOutput = InterruptOutput(outputSoFar,curTime),
                         newOutput = CounterOutput(interruptedOutput,curTime)
                     in
                       HA(rest,AddOutput(targetTemp, currentTemp, targetHumid, 
                                         currentHumid, curTime, newOutput), nextTime)
                else ChangeHA(haInputs,outputSoFar,curTime)
           else ChangeHA(haInputs,outputSoFar,curTime);

ChangeHA: HAInputs * HAOut * AbsTime -> HAOut
ChangeHA(haInputs,outputSoFar,curTime) ==
  let mk_(change,targetTemp,currentTemp,targetHumid,currentHumid) = hd haInputs,
      rest = tl haInputs,
      nextTime = curTime + StepLength             
  in
    if change 
    then HA(rest,AddOutput(targetTemp, currentTemp, targetHumid, currentHumid, 
                           curTime, outputSoFar), nextTime)
    else HA(rest,outputSoFar,nextTime);

AddOutput: nat * nat * nat * nat * nat * seq of OutStep -> seq of OutStep
AddOutput(targetTemp, curTemp, targetHumid, curHumid, curTime, outputSoFar) ==
  if targetHumid <> curHumid
  then HumidChanged(targetTemp, curTemp, targetHumid, curHumid, curTime, outputSoFar)
  elseif targetTemp <> curTemp
  then TempChanged(targetTemp, curTemp, curTime, outputSoFar)
  else outputSoFar;


TempChanged: nat * nat * nat * seq of OutStep -> seq of OutStep
TempChanged(targetTemp, curTemp, curTime, outputSoFar) ==
  let nextTime = curTime+(abs(curTemp-targetTemp))*TempChangeDuration,
      action   = if curTemp > targetTemp then <DecTemp> else <IncTemp>
  in
    outputSoFar ^ [mk_(action,curTime)] ^ [mk_(<LeaveTemp>,nextTime)];


HumidChanged: nat * nat * nat * nat * nat * seq of OutStep -> seq of OutStep
HumidChanged(targetTemp, curTemp, targetHumid, curHumid, curTime, outputSoFar) ==
  let tempChanged = (curHumid-targetHumid)*HumidChangeDuration/TempChangeDuration,
      action = if (curTemp-tempChanged) > targetTemp then <DecTemp> else <IncTemp>,
      timeChange = curTime+(curHumid-targetHumid)*HumidChangeDuration
  in
    outputSoFar ^ [mk_(<OpenWindow>,curTime)] ^ 
    if (curTemp-tempChanged) <> targetTemp
    then [mk_(<CloseWindow>, timeChange),
          mk_(action, timeChange),
          mk_(<LeaveTemp>, timeChange + 
                          ((abs(curTemp-targetTemp)) - tempChanged)*TempChangeDuration)]
    else [mk_(<CloseWindow>, timeChange)];


InterruptOutput : seq of OutStep * nat -> seq of OutStep
InterruptOutput(output, curTime) ==
  [output(i) | i in set inds output & let mk_(-,t) = output(i) in t <= curTime];

CounterOutput : seq of OutStep * nat -> seq of OutStep
CounterOutput(output, curTime) ==
  let mk_(lastOutput,-) = output(len output)
  in
    if lastOutput = <OpenWindow>
    then output ^ [mk_(<CloseWindow>, curTime)]
    elseif (lastOutput = <IncTemp> or lastOutput = <DecTemp>)
    then output ^ [mk_(<LeaveTemp>, curTime)]
    else output;
~~~
{% endraw %}

