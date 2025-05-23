---
layout: default
title: CMSL
---

## CMSL
Author: Peter Gorm Larsen and Marcel Verhoef


The counter measures example was developed by Peter Gorm Larsen and Marcel 
Verhoef in 2007 in different dialect of VDM. This one is the most abstract 
version using VDM-SL.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| DEFAULT`CounterMeasures(testval1)|
|Entry point     :| DEFAULT`CounterMeasures(testval2)|
|Entry point     :| DEFAULT`CounterMeasures(testval3)|


### CMflat.vdmsl

{% raw %}
~~~
              
types

  MissileInputs = seq of MissileInput;

  MissileInput = MissileType * Angle;

  MissileType = <MissileA> | <MissileB> | <MissileC> | <None>;

  Angle = nat
  inv num == num <= 360;

  Output = map MagId to seq of OutputStep;

  MagId = token;

  OutputStep = FlareType * AbsTime;

  Response = FlareType * nat;

  AbsTime = nat;

  FlareType = <FlareOneA>  | <FlareTwoA>  | <FlareOneB> |
              <FlareTwoB>  | <FlareOneC>  | <FlareTwoC> |
              <DoNothingA> | <DoNothingB> | <DoNothingC>;

  Plan = seq of (FlareType * Delay);

  Delay = nat;

values

  responseDB : map MissileType to Plan =
    {<MissileA> |-> [ mk_(<FlareOneA>,900), mk_(<FlareTwoA>,500),
                      mk_(<DoNothingA>,100), mk_(<FlareOneA>,500)],
     <MissileB> |-> [ mk_(<FlareTwoB>,500), mk_(<FlareTwoB>,700)],
     <MissileC> |-> [ mk_(<FlareOneC>,400), mk_(<DoNothingC>,100),
                      mk_(<FlareTwoC>,400), mk_(<FlareOneC>,500)]
    };

  missilePriority : map MissileType to nat
                      = {<MissileA> |-> 1,
                         <MissileB> |-> 2,
                         <MissileC> |-> 3,
                         <None> |-> 0};

  stepLength : nat = 100;

  testval1 : MissileInputs = [mk_(<MissileA>,88),
                              mk_(<MissileB>,70),
                              mk_(<MissileA>,222),
                              mk_(<MissileC>,44)];

  testval2 : MissileInputs = [mk_(<MissileC>,188),
                              mk_(<MissileB>,70),
                              mk_(<MissileA>,2),
                              mk_(<MissileC>,44)];

  testval3 : MissileInputs = [mk_(<MissileA>,288),
                              mk_(<MissileB>,170),
                              mk_(<MissileA>,222),
                              mk_(<MissileC>,44)];

functions

CounterMeasures: MissileInputs -> Output
CounterMeasures(missileInputs) ==
  CM(missileInputs,{|->},{|->},0);

CM: MissileInputs * Output * map MagId to [MissileType] * 
    nat -> Output
CM( missileInputs, outputSoFar, lastMissile, curTime) ==
  if missileInputs = []
  then outputSoFar
  else let mk_(curMis,angle) = hd missileInputs,
           magid = Angle2MagId(angle)
       in
         if magid not in set dom lastMissile or
            (magid in set dom lastMissile and
             missilePriority(curMis) > 
             missilePriority(lastMissile(magid)))
         then let newOutput = 
                     InterruptPlan(curTime,outputSoFar,
                                   responseDB(curMis),
                                   magid)
              in CM(tl missileInputs, newOutput, 
                    lastMissile ++ {magid |-> curMis},
                    curTime + stepLength)
         else CM(tl missileInputs, outputSoFar, 
                 lastMissile,curTime + stepLength)
measure len missileInputs;
    
InterruptPlan: nat * Output * Plan * MagId -> Output
InterruptPlan(curTime,expOutput,plan,magid) ==
  {magid |-> (if magid in set dom expOutput
              then LeavePrefixUnchanged(expOutput(magid), 
                                        curTime)
              else []) ^
              MakeOutputFromPlan(curTime, plan)} 
  munion
  ({magid} <-: expOutput);

LeavePrefixUnchanged: seq of OutputStep * nat -> 
                      seq of OutputStep
LeavePrefixUnchanged(output_l, curTime) ==
  [o | o in seq output_l & let mk_(-,t) = o in t <= curTime];

MakeOutputFromPlan : nat * seq of Response -> seq of OutputStep
MakeOutputFromPlan(curTime, response) ==
  let output = OutputAtTimeZero(response) in
    [let mk_(flare,t) = o
     in
       mk_(flare,t+curTime)
    | o in seq output];

OutputAtTimeZero : seq of Response -> seq of OutputStep
OutputAtTimeZero(response) ==
  let absTimes = RelativeToAbsoluteTimes(response) in
    let mk_(firstFlare,-) = hd absTimes in
      [mk_(firstFlare,0)] ^
      [ let mk_(-,t) = absTimes(i-1),
            mk_(f,-) = absTimes(i) in
          mk_(f,t) | i in set {2,...,len absTimes}];

RelativeToAbsoluteTimes : seq of Response -> 
                          seq of (FlareType * nat)
RelativeToAbsoluteTimes(ts) ==
  if ts = []
  then []
  else let mk_(f,t) = hd ts,
           ns = RelativeToAbsoluteTimes(tl ts) in
         [mk_(f,t)] ^
         [ let mk_(nf, nt) = n in mk_(nf, nt + t) | n in seq ns]
measure len ts;

Angle2MagId: Angle -> MagId
Angle2MagId(angle) ==
  if angle < 90
  then mk_token("Magazine 1")
  elseif angle < 180
  then mk_token("Magazine 2")
  elseif angle < 270
  then mk_token("Magazine 3")
  else mk_token("Magazine 4");
                                                                                        
~~~
{% endraw %}

