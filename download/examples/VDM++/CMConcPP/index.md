---
layout: default
title: CMConcPP
---

## CMConcPP
Author: Peter Gorm Larsen and Marcel Verhoef


This example is used in the guidelines for developing distributed 
real time systems using the VICE extension to VDM++. This model 
is available in a sequential version, a concurrent version as
well as in a distributed real-time VICE version. This is the 
distributed real time version of this example. 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### missiledetector.vdmpp

{% raw %}
~~~
              
class MissileDetector is subclass of GLOBAL, BaseThread

-- the primary task of the MissileDetector is to
-- collect all sensor data and dispatch each event
-- to the appropriate FlareController

instance variables

-- maintain a link to each controller
ranges : map nat to (Angle * Angle) := {|->};
controllers : map nat to FlareController := {|->};
inv dom ranges = dom controllers;

-- collects the observations from all attached sensors
threats : seq of (EventId * MissileType * Angle * Time) := [];

-- status of the missile detector
busy : bool := false

operations

public MissileDetector: [ThreadDef] ==> MissileDetector
MissileDetector(tDef)==
 (if tDef <> nil
  then (period := tDef.p;
        isPeriodic := tDef.isP;
       );
  BaseThread(self);
 );

-- addController is only used to instantiate the model
public addController: FlareController ==> ()
addController (pctrl) ==
  (dcl nid : nat := card dom ranges + 1;
   atomic
    (ranges := ranges munion {nid |-> pctrl.getAperture()};
     controllers := controllers munion {nid |-> pctrl}
    );
   );

-- addThreat is a helper operation to modify the event
-- list. currently events are stored first come first served.
-- one could imagine using a different ordering instead.
public addThreat: EventId * MissileType * Angle * Time ==> ()
addThreat (evid,pmt,pa,pt) == 
  (threats := threats ^ [mk_ (evid,pmt,pa,pt)];
   busy := true );

-- getThreat is a local helper operation to modify the event list
private getThreat: () ==> EventId * MissileType * Angle * Time
getThreat () ==
  (dcl res : EventId * MissileType * Angle * Time := hd threats;
   threats := tl threats;
   return res );

public isFinished: () ==> ()
isFinished () ==
  for all id in set dom controllers do
    controllers(id).isFinished();

protected Step: () ==> ()
Step() ==
( if threats <> []
  then (def mk_ (evid,pmt, pa, pt) = getThreat() in
          for all id in set dom ranges do
            def mk_(papplhs, pappsize) = ranges(id) in
              if canObserve(pa, papplhs, pappsize)
              then controllers(id).addThreat(evid,pmt,pa,pt);
        busy := len threats > 0);
);
 
sync

mutex (Step);

-- addThreat and getThreat modify the same instance variables
-- therefore they need to be declared mutual exclusive
mutex (addThreat,getThreat);

-- getThreat is used as a 'blocking read' from the main
-- thread of control of the missile detector
per getThreat => len threats > 0;
per isFinished => not busy


end MissileDetector
              
~~~
{% endraw %}

### TimeStamp.vdmpp

{% raw %}
~~~
              
class TimeStamp

values

public stepLength : nat = 1;

instance variables

currentTime  : nat   := 0;
wakeUpMap    : map nat to [nat] := {|->};
barrierCount : nat := 0;
registeredThreads : set of BaseThread := {};
isInitialising : bool := true;
-- singleton instance of class
private static timeStamp : TimeStamp := new TimeStamp();

operations

-- private constructor (singleton pattern)
private TimeStamp : () ==> TimeStamp
TimeStamp() ==
	skip;

-- public operation to get the singleton instance
pure public static GetInstance: () ==> TimeStamp
GetInstance() ==
  return timeStamp;

public RegisterThread : BaseThread ==> ()
RegisterThread(t) ==
 (barrierCount := barrierCount + 1;
  registeredThreads := registeredThreads union {t};  
 );
 
public UnRegisterThread : BaseThread ==> ()
UnRegisterThread(t) ==
 (barrierCount := barrierCount - 1;
  registeredThreads := registeredThreads \ {t};
 );
 
public IsInitialising: () ==> bool
IsInitialising() ==
  return isInitialising;
 
public DoneInitialising: () ==> ()
DoneInitialising() ==
 (if isInitialising
  then (isInitialising := false;
        for all t in set registeredThreads 
        do
          start(t);
       );
 );

public WaitRelative : nat ==> ()
WaitRelative(val) ==
 (WaitAbsolute(currentTime + val);  
 );
 
public WaitAbsolute : nat ==> ()
WaitAbsolute(val) == (
  AddToWakeUpMap(threadid, val);
  -- Last to enter the barrier notifies the rest.
  BarrierReached();
  -- Wait till time is up
  Awake();
);

BarrierReached : () ==> ()
BarrierReached() == 
(
	while (card dom wakeUpMap = barrierCount) do
  	(
  		currentTime := currentTime + stepLength;
  		let threadSet : set of nat = {th | th in set dom wakeUpMap 
  										 & wakeUpMap(th) <> nil and wakeUpMap(th) <= currentTime }
		in
			for all t in set threadSet 
			do
				wakeUpMap := {t} <-: wakeUpMap;
	);
)
post forall x in set rng wakeUpMap & x = nil or x >= currentTime;

AddToWakeUpMap : nat * [nat] ==> ()
AddToWakeUpMap(tId, val) ==
   wakeUpMap := wakeUpMap ++ { tId |-> val };

public NotifyThread : nat ==> ()
NotifyThread(tId) ==
 wakeUpMap := {tId} <-: wakeUpMap;

pure public GetTime : () ==> nat
GetTime() ==
  return currentTime;

Awake: () ==> ()
Awake() == skip;

public ThreadDone : () ==> ()
ThreadDone() == 
	AddToWakeUpMap(threadid, nil);

sync
  per Awake => threadid not in set dom wakeUpMap;

  mutex (IsInitialising);
  mutex (DoneInitialising);
  
  mutex (AddToWakeUpMap);
  mutex (NotifyThread);
  mutex (BarrierReached);
  
  mutex (AddToWakeUpMap, NotifyThread);
  mutex (AddToWakeUpMap, BarrierReached);
  mutex (NotifyThread, BarrierReached);
  
  mutex (AddToWakeUpMap, NotifyThread, BarrierReached);

end TimeStamp
~~~
{% endraw %}

### flaredispenser.vdmpp

{% raw %}
~~~
              
class FlareDispenser is subclass of GLOBAL, BaseThread

values

responseDB : map MissileType to Plan =
  {<MissileA> |-> [mk_(<FlareOneA>,900),
                   mk_(<FlareTwoA>,500),
                   mk_(<DoNothingA>,100),
                   mk_(<FlareOneA>,500)],
   <MissileB> |-> [mk_(<FlareTwoB>,500),
                   mk_(<FlareTwoB>,700)],
   <MissileC> |-> [mk_(<FlareOneC>,400),
                   mk_(<DoNothingC>,100),
                   mk_(<FlareTwoC>,400),
                   mk_(<FlareOneC>,500)] };

missilePriority : map MissileType to nat =
  {<None>     |-> 0,
   <MissileA> |-> 1,
   <MissileB> |-> 2,
   <MissileC> |-> 3 }

types

public Plan = seq of PlanStep;

public PlanStep = FlareType * Time;

instance variables

public curplan : Plan := [];
curprio        : nat := 0;
busy           : bool := false;
aperture       : Angle;
eventid        : [EventId];

operations

public FlareDispenser: Angle * [ThreadDef] ==> FlareDispenser
FlareDispenser(ang, tDef) ==
 (aperture := ang;
 
  if tDef <> nil
  then (period := tDef.p;
        isPeriodic := tDef.isP;
       );
  BaseThread(self);
 );

pure public GetAngle: () ==> nat
GetAngle() ==
  return aperture;

public addThreat: EventId * MissileType * Time ==> ()
addThreat (evid, pmt, ptime) ==
  if missilePriority(pmt) > curprio
  then (dcl newplan : Plan :=  [],
            newtime : Time := ptime;
        -- construct an absolute time plan
        for mk_(fltp, fltime) in responseDB(pmt) do
          (newplan := newplan ^ [mk_ (fltp, newtime)];
           newtime := newtime + fltime );
        -- immediately release the first action
        def mk_(fltp, fltime) = hd newplan;
            t = World`timerRef.GetTime() in
          releaseFlare(evid,fltp,fltime,t);
         -- store the rest of the plan
         curplan := tl newplan;
         eventid := evid;
         curprio := missilePriority(pmt);
         busy := true )
pre pmt in set dom missilePriority and
    pmt in set dom responseDB;

protected Step: () ==> ()
Step () ==
  (if len curplan > 0
   then (dcl curtime : Time := World`timerRef.GetTime(),
             done : bool := false;
         while not done do
           (dcl first : PlanStep := hd curplan,
                next : Plan := tl curplan;
            let mk_(fltp, fltime) = first in
              if fltime <= curtime
              then (releaseFlare(eventid,fltp,fltime,curtime);
                    curplan := next;
                    if len next = 0
                    then (curprio := 0; 
                          done := true; 
                          busy := false ) )
              else done := true ) ) );

private releaseFlare: EventId * FlareType * Time * Time ==> ()
releaseFlare (evid, pfltp, pt1, pt2) == 
  World`env.handleEvent(evid,pfltp,aperture,pt1,pt2);

public isFinished: () ==> ()
isFinished () == skip;


sync

mutex (Step);
mutex (addThreat);
per isFinished => not busy
     
end FlareDispenser
               
~~~
{% endraw %}

### sensor.vdmpp

{% raw %}
~~~
              
class Sensor is subclass of GLOBAL

instance variables

-- the missile detector this sensor is connected to
private detector : MissileDetector;

-- the left hand-side of the viewing angle of the sensor
private aperture : Angle;

operations

public Sensor: MissileDetector * Angle ==> Sensor
Sensor (pmd, psa) == ( detector := pmd; aperture := psa);

-- get the left hand-side start point and opening angle
pure public getAperture: () ==> GLOBAL`Angle * GLOBAL`Angle
getAperture () == return mk_ (aperture, SENSOR_APERTURE);

-- trip is called asynchronously from the environment to
-- signal an event. the sensor triggers if the event is
-- in the field of view. the event is stored in the
-- missile detector for further processing
public trip: EventId * MissileType * Angle ==> ()
trip (evid, pmt, pa) ==
  -- log and time stamp the observed threat
  detector.addThreat(evid, pmt,pa,World`timerRef.GetTime())
pre canObserve(pa, aperture, SENSOR_APERTURE)

end Sensor
              
~~~
{% endraw %}

### flarecontroller.vdmpp

{% raw %}
~~~
              
class FlareController is subclass of GLOBAL, BaseThread

instance variables

-- the left hand-side of the working angle
private aperture : Angle;

-- maintain a link to each dispenser
ranges : map nat to (Angle * Angle) := {|->};
dispensers : map nat to FlareDispenser := {|->};
inv dom ranges = dom dispensers;

-- the relevant events to be treated by this controller
threats : seq of (EventId * MissileType * Angle * Time) := [];

-- the status of the controller
busy : bool := false

operations

public FlareController: Angle * [ThreadDef] ==> FlareController
FlareController (papp, tDef) == 
 (aperture := papp;
 
  if tDef <> nil
  then (period := tDef.p;
        isPeriodic := tDef.isP;
       );
  BaseThread(self);
 );

public addDispenser: FlareDispenser ==> ()
addDispenser (pfldisp) ==
  let angle = aperture + pfldisp.GetAngle() in
    (dcl id : nat := card dom ranges + 1;
     atomic
      (ranges := ranges munion 
                 {id |-> mk_(angle, DISPENSER_APERTURE)};
       dispensers := dispensers munion {id |-> pfldisp}
      );
     );

-- get the left hand-side start point and opening angle
pure public getAperture: () ==> GLOBAL`Angle * GLOBAL`Angle
getAperture () == return mk_(aperture, FLARE_APERTURE);

-- addThreat is a helper operation to modify the event
-- list. currently events are stored first come first served.
-- one could imagine using a different ordering instead
public addThreat: EventId * MissileType * Angle * Time ==> ()
addThreat (evid,pmt,pa,pt) ==
  (threats := threats ^ [mk_ (evid,pmt,pa,pt)];
   busy := true );

-- getThreat is a local helper operation to modify the event list
private getThreat: () ==> EventId * MissileType * Angle * Time
getThreat () ==
  (dcl res : EventId * MissileType * Angle * Time := hd threats;
   threats := tl threats;
   return res );

public isFinished: () ==> ()
isFinished () ==
  for all id in set dom dispensers do
    dispensers(id).isFinished();

protected Step: () ==> ()
Step() ==
  (if threats <> []
  then (def mk_ (evid,pmt, pa, pt) = getThreat() in
         for all id in set dom ranges do
           def mk_(papplhs, pappsize) = ranges(id) in
             if canObserve(pa, papplhs, pappsize)
             then dispensers(id).addThreat(evid,pmt,pt);
        busy := len threats > 0 );
       );

sync

-- addThreat and getThreat modify the same instance variables
-- therefore they need to be declared mutual exclusive
mutex (addThreat,getThreat);
mutex (Step);

-- getThreat is used as a 'blocking read' from the main
-- thread of control of the missile detector
per getThreat => len threats > 0;
per isFinished => len threats = 0 --not busy

end FlareController
               
~~~
{% endraw %}

### environment.vdmpp

{% raw %}
~~~
              
class Environment is subclass of GLOBAL, BaseThread

types

public InputTP   = (Time * seq of inline);

public inline  = EventId * MissileType * Angle * Time;
public outline = EventId * FlareType * Angle * Time * Time

instance variables

-- access to the VDMTools stdio
io : IO := new IO();

-- the input file to process
inlines : seq of inline := [];

-- the output file to print
outlines : seq of outline := [];

-- maintain a link to all sensors
ranges : map nat to (Angle * Angle) := {|->};
sensors : map nat to Sensor := {|->};
inv dom ranges = dom sensors;

busy : bool := true;

-- Amount of time we want to simulate
simtime : Time;

operations

public Environment: seq of char * [ThreadDef] ==> Environment
Environment (fname, tDef) ==
 (def mk_ (-,mk_(timeval,input)) = io.freadval[InputTP](fname) in
    (inlines := input;
     simtime := timeval);
     
  if tDef <> nil
  then (period := tDef.p;
        isPeriodic := tDef.isP;
       );
  BaseThread(self);
  );

public addSensor: Sensor ==> ()
addSensor (psens) ==
  (dcl id : nat := card dom ranges + 1;
   atomic (
    ranges := ranges munion {id |-> psens.getAperture()};
    sensors := sensors munion {id |-> psens} 
   )
  );

private createSignal: () ==> () 
createSignal () ==
  (if len inlines > 0
   then (dcl curtime : Time := World`timerRef.GetTime(), 
             done : bool := false;
         while not done do
           def mk_ (eventid, pmt, pa, pt) = hd inlines in
             if pt <= curtime
             then (for all id in set dom ranges do
                     def mk_(papplhs,pappsize) = ranges(id) in
                       if canObserve(pa,papplhs,pappsize)
                       then sensors(id).trip(eventid,pmt,pa);
                   inlines := tl inlines;
                   done := len inlines = 0;
                   return) 
             else (done := true;
                   return))
   else (busy := false;
         return));

public handleEvent: EventId * FlareType * Angle * Time * Time ==> ()
handleEvent (evid,pfltp,angle,pt1,pt2) ==
  (outlines := outlines ^ [mk_ (evid,pfltp,angle,pt1,pt2)] );

public showResult: () ==> ()
showResult () ==
  def - = io.writeval[seq of outline](outlines) in skip;

public isFinished : () ==> ()
isFinished () == skip;

public Step : () ==> ()
Step() ==
 (if World`timerRef.GetTime() < simtime
  then createSignal()
  else busy := false;
 );
 
sync

mutex (handleEvent);
mutex (createSignal);
per isFinished => not busy;

end Environment
              
~~~
{% endraw %}

### world.vdmpp

{% raw %}
~~~
              
class World

instance variables

public static timerRef : TimeStamp := TimeStamp`GetInstance();
public static env : [Environment] := nil;

operations

public World: () ==> World
World () ==
  (-- set-up the sensors
   env := new Environment("scenario.txt", nil);
   
   env.addSensor(CM`sensor0);
   env.addSensor(CM`sensor1);
   env.addSensor(CM`sensor2);
   env.addSensor(CM`sensor3);

   -- add the first controller with four dispensers
   CM`controller0.addDispenser(CM`dispenser0);
   CM`controller0.addDispenser(CM`dispenser1);
   CM`controller0.addDispenser(CM`dispenser2);
   CM`controller0.addDispenser(CM`dispenser3);
   CM`detector.addController(CM`controller0);

   -- add the second controller with four dispensers
   CM`controller1.addDispenser(CM`dispenser4);
   CM`controller1.addDispenser(CM`dispenser5);
   CM`controller1.addDispenser(CM`dispenser6);
   CM`controller1.addDispenser(CM`dispenser7);
   CM`detector.addController(CM`controller1);
 
   -- add the third controller with four dispensers
   CM`controller2.addDispenser(CM`dispenser8);
   CM`controller2.addDispenser(CM`dispenser9);
   CM`controller2.addDispenser(CM`dispenser10);
   CM`controller2.addDispenser(CM`dispenser11);
   CM`detector.addController(CM`controller2);   
   );

-- the run function blocks the user-interface thread
-- until all missiles in the file have been processed
public Run: () ==> ()
Run () == 
  (-- start the environment
   timerRef.DoneInitialising();
   -- wait for the environment to handle all input
   env.isFinished();
   -- wait for the missile detector to finish
   CM`detector.isFinished();
   -- print the result
   env.showResult())

end World
              
~~~
{% endraw %}

### BaseThread.vdmpp

{% raw %}
~~~
class BaseThread
	
types

public static ThreadDef ::
  p : nat1
  isP : bool;

instance variables

protected period : nat1 := 1;
protected isPeriodic : bool := true;

protected registeredSelf : BaseThread;
protected timeStamp : TimeStamp := TimeStamp`GetInstance();

operations

protected BaseThread : BaseThread ==> BaseThread
BaseThread(t) ==
 (registeredSelf:= t;
  timeStamp.RegisterThread(registeredSelf);
  if(not timeStamp.IsInitialising())
  then start(registeredSelf);  
 );

protected Step : () ==> ()
Step() ==
  is subclass responsibility;

thread

 (if isPeriodic
  then (while true
        do 
         (Step();
          timeStamp.WaitRelative(period)
         )
       )
  else (Step();
        timeStamp.WaitRelative(0);
        timeStamp.UnRegisterThread(registeredSelf);
       );
 );

end BaseThread
~~~
{% endraw %}

### global.vdmpp

{% raw %}
~~~
              
class GLOBAL

values

public SENSOR_APERTURE = 90;
public FLARE_APERTURE = 120;
public DISPENSER_APERTURE = 30

types

-- there are three different types of missiles
public MissileType = <MissileA> | <MissileB> | <MissileC> | <None>;

-- there are nine different flare types, three per missile
public FlareType =
    <FlareOneA> | <FlareTwoA> | <DoNothingA> | 
    <FlareOneB> | <FlareTwoB> | <DoNothingB> | 
    <FlareOneC> | <FlareTwoC> | <DoNothingC>;

-- the angle at which the missile is incoming
public Angle = nat
inv num == num < 360;

public EventId = nat;

public Time = nat;

operations

pure public canObserve: Angle * Angle * Angle ==> bool
canObserve (pangle, pleft, psize) ==
  def pright = (pleft + psize) mod 360 in
    if pright < pleft
    -- check between [0,pright> and [pleft,360>
    then return (pangle < pright or pangle >= pleft)
    -- check between [pleft, pright>
    else return (pangle >= pleft and pangle < pright);

end GLOBAL
              
~~~
{% endraw %}

### fighteraircraft.vdmpp

{% raw %}
~~~
              
class CM

instance variables

  -- maintain a link to the detector
  public static detector : MissileDetector := new MissileDetector(nil);

  public static sensor0 : Sensor := new Sensor(detector,0);
  public static sensor1 : Sensor := new Sensor(detector,90);
  public static sensor2 : Sensor := new Sensor(detector,180);
  public static sensor3 : Sensor := new Sensor(detector,270);

  public static controller0 : FlareController := new FlareController(0, nil);
  public static controller1 : FlareController := new FlareController(120, nil);
  public static controller2 : FlareController := new FlareController(240, nil);

  public static dispenser0 : FlareDispenser := new FlareDispenser(0, nil);
  public static dispenser1 : FlareDispenser := new FlareDispenser(30, nil);
  public static dispenser2 : FlareDispenser := new FlareDispenser(60, nil);
  public static dispenser3 : FlareDispenser := new FlareDispenser(90, nil);

  public static dispenser4 : FlareDispenser := new FlareDispenser(0, nil);
  public static dispenser5 : FlareDispenser := new FlareDispenser(30, nil);
  public static dispenser6 : FlareDispenser := new FlareDispenser(60, nil);
  public static dispenser7 : FlareDispenser := new FlareDispenser(90, nil);

  public static dispenser8 : FlareDispenser := new FlareDispenser(0, nil);
  public static dispenser9 : FlareDispenser := new FlareDispenser(30, nil);
  public static dispenser10 : FlareDispenser := new FlareDispenser(60, nil);
  public static dispenser11 : FlareDispenser := new FlareDispenser(90, nil);

end CM
              
~~~
{% endraw %}

