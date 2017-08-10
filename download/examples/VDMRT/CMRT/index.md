---
layout: default
title: CMRT
---

## CMRT
Author: Peter Gorm Larsen and Marcel Verhoef


This example is used in the guidelines for developing distributed 
real time systems using the VICE extension to VDM++. This model 
is available in a sequential version, a concurrent version as
well as in a distributed real-time VICE version. This is the 
distributed real time version of this example. 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### TestResult.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
class TestResult

instance variables
  failures : seq of TestCase := []
  
operations
  public AddFailure: TestCase ==> ()
  AddFailure (ptst) == failures := failures ^ [ptst];

  public Print: seq of char ==> ()
  Print (pstr) ==
    def - = new IO().echo(pstr ^ "\n") in skip;
    
  public Show: () ==> ()
  Show () ==
    if failures = [] then
      Print ("No failures detected")
    else
      for failure in failures do
        Print (failure.GetName() ^ " failed")
  
end TestResult
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
~~~
{% endraw %}

### global.vdmrt

{% raw %}
~~~
              
class GLOBAL

values
  public SENSOR_APERTURE = 90;
  public FLARE_APERTURE = 120;
  public DISPENSER_APERTURE = 30

types
  -- there are three different types of missiles
  public MissileType = <MissileA> | <MissileB> | <MissileC>;

  -- there are nine different flare types, three per missile
  public FlareType =
    <FlareOneA> | <FlareTwoA> | <DoNothingA> | 
    <FlareOneB> | <FlareTwoB> | <DoNothingB> | 
    <FlareOneC> | <FlareTwoC> | <DoNothingC>;

  -- the angle at which the missile is incoming
  public Angle = nat
  inv num == num < 360;

public EventId = nat;

public Time = nat

operations
  pure public canObserve: Angle * Angle * Angle ==> bool
  canObserve (pangle, pleft, psize) ==
    def pright = (pleft + psize) mod 360 in
      if pright < pleft
      -- check between [0,pright> and [pleft,360>
      then return (pangle < pright or pangle >= pleft)
      -- check between [pleft, pright>
      else return (pangle >= pleft and pangle < pright);
       
  public getAperture: () ==> Angle * Angle
  getAperture () == is subclass responsibility;

end GLOBAL
                                                                              
~~~
{% endraw %}

### CMTest.vdmrt

{% raw %}
~~~
              
class CMTest
operations
  public Execute: () ==> ()
  Execute () ==
    (dcl ts : TestSuite := new TestSuite();
     ts.AddTest(new CMTestCase2("Busy"));
     ts.Run())

end CMTest
                                                                            
~~~
{% endraw %}

### CMTestCase2.vdmrt

{% raw %}
~~~
              
class CMTestCase2 is subclass of TestCase

operations
  public CMTestCase2: seq of char ==> CMTestCase2
  CMTestCase2(nm) == name := nm;

  protected SetUp: () ==> ()
  SetUp () == skip;

  protected RunTest: () ==> ()
  RunTest () == 
    (dcl inlines : seq of Environment`inline :=
       [ mk_ (1,<MissileA>,45,10000), mk_ (2,<MissileB>,270,11000),
         mk_ (3,<MissileA>,276,12000),mk_ (4,<MissileC>,266,14000) ];
    def - = new IO().fwriteval[seq of Environment`inline]
            ("scenario.txt",inlines,<start>) in 
    let world = new World() in
      (world.Run();
       let reaction = world.env.GetAndPurgeOutlines()
       in 
         for all i in set inds inlines do
           AssertTrue(exists j in set inds reaction &
                         reaction(j).#1 = i and
                         reaction(j).#4 + 1000 > reaction(j).#5)));

  protected TearDown: () ==> ()
  TearDown () == skip

end CMTestCase2
                                                                                    
~~~
{% endraw %}

### fighteraircraft.vdmrt

{% raw %}
~~~
              
system CM

instance variables

-- cpu to deploy sensor 1 and 2
cpu1 : CPU := new CPU (<FCFS>,1E6);

-- cpu to deploy sensor 3 and 4
cpu2 : CPU := new CPU (<FCFS>,1E6);

-- cpu to deploy the MissileDetector
-- and the FlareControllers
cpu3 : CPU := new CPU (<FP>,1E9);

-- cpus for the flare dispensers
cpu4 : CPU := new CPU (<FCFS>,1E8);
cpu5 : CPU := new CPU (<FCFS>,1E8);
cpu6 : CPU := new CPU (<FCFS>,1E8);

-- bus to connect sensors 1 and 2 to the missile detector
bus1 : BUS := new BUS (<FCFS>,1E3,{cpu1,cpu3});

-- bus to connect sensors 3 and 4 to the missile detector
bus2 : BUS := new BUS (<FCFS>,1E3,{cpu2,cpu3});
  
-- bus to connect flare controllers to the dispensers
bus3 : BUS := new BUS (<FCFS>,1E3,{cpu3,cpu4,cpu5,cpu6});

-- maintain a link to the detector
public static detector : MissileDetector := new MissileDetector(nil);

public static sensor0 : Sensor := new Sensor(detector,0);
public static sensor1 : Sensor := new Sensor(detector,90);
public static sensor2 : Sensor := new Sensor(detector,180);
public static sensor3 : Sensor := new Sensor(detector,270);

public static controller0 : FlareController := new FlareController(0, nil);
public static controller1 : FlareController := new FlareController(120, nil);
public static controller2 : FlareController := new FlareController(240, nil);

public static dispenser0 : FlareDispenser := new FlareDispenser(0, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser1 : FlareDispenser := new FlareDispenser(30, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser2 : FlareDispenser := new FlareDispenser(60, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser3 : FlareDispenser := new FlareDispenser(90, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));

public static dispenser4 : FlareDispenser := new FlareDispenser(0, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser5 : FlareDispenser := new FlareDispenser(30, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser6 : FlareDispenser := new FlareDispenser(60, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser7 : FlareDispenser := new FlareDispenser(90, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));

public static dispenser8 : FlareDispenser := new FlareDispenser(0, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser9 : FlareDispenser := new FlareDispenser(30, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser10 : FlareDispenser := new FlareDispenser(60, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
public static dispenser11 : FlareDispenser := new FlareDispenser(90, mk_BaseRTThread`ThreadDef(1000E6,true,0,0,0));
  
operations
 
public CM: () ==> CM
CM () ==
  (cpu3.deploy(detector);
--   cpu3.setPriority(MissileDetector`addThreat,100);

   -- set-up sensor 0 and 1
   cpu1.deploy(sensor0);
--   cpu1.setPriority(Sensor`trip,100);
   cpu1.deploy(sensor1);

   -- set-up sensor 2 and 3
   cpu2.deploy(sensor2);
--   cpu2.setPriority(Sensor`trip,100);
   cpu2.deploy(sensor3);

   -- add the first controller with four dispensers
   cpu3.deploy(controller0);
--   cpu3.setPriority(FlareController`addThreat,80);
   -- add the dispensers to the controller
   cpu4.deploy(dispenser0);
--   cpu4.setPriority(FlareDispenser`addThreat,100);
--   cpu4.setPriority(FlareDispenser`evalQueue,80);
   cpu4.deploy(dispenser1);
   cpu4.deploy(dispenser2);
   cpu4.deploy(dispenser3);

   -- add the second controller with four dispensers
   cpu3.deploy(controller1);
   -- add the dispensers to the controller
   cpu5.deploy(dispenser4);
--   cpu5.setPriority(FlareDispenser`addThreat,100);
--   cpu5.setPriority(FlareDispenser`evalQueue,80);
   cpu5.deploy(dispenser5);
   cpu5.deploy(dispenser6);
   cpu5.deploy(dispenser7);

   -- add the third controller with four dispensers
   cpu3.deploy(controller2);
   -- add the dispensers to the controller
   cpu6.deploy(dispenser8);
--   cpu6.setPriority(FlareDispenser`addThreat,100);
--   cpu6.setPriority(FlareDispenser`evalQueue,80);
   cpu6.deploy(dispenser9);
   cpu6.deploy(dispenser10);
   cpu6.deploy(dispenser11);
   )

end CM
            
~~~
{% endraw %}

### Test.vdmrt

{% raw %}
~~~
               
class Test

operations
  public Run: TestResult ==> ()
  Run (-) == is subclass responsibility

end Test
             
~~~
{% endraw %}

### TestSuite.vdmrt

{% raw %}
~~~
              
class TestSuite
  is subclass of Test

instance variables
  tests : seq of Test := [];
                           
operations
  public Run: () ==> ()
  Run () ==
    (dcl ntr : TestResult := new TestResult();
     Run(ntr);
     ntr.Show());
                           
  public Run: TestResult ==> ()
  Run (result) ==
    for test in tests do
      test.Run(result);

  public AddTest: Test ==> ()
  AddTest(test) ==
    tests := tests ^ [test];

end TestSuite
             
~~~
{% endraw %}

### sensor.vdmrt

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
public getAperture: () ==> GLOBAL`Angle * GLOBAL`Angle
getAperture () == return mk_ (aperture, SENSOR_APERTURE);

-- trip is called asynchronously from the environment to
-- signal an event. the sensor triggers if the event is
-- in the field of view. the event is stored in the
-- missile detector for further processing
async public trip: EventId * MissileType * Angle ==> ()
trip (evid, pmt, pa) ==
  -- log and time stamp the observed threat
  detector.addThreat(evid,pmt,pa,time)
pre canObserve(pa, aperture, SENSOR_APERTURE)

end Sensor
                                                                           
~~~
{% endraw %}

### BaseRTThread.vdmrt

{% raw %}
~~~
class BaseRTThread

types

public static ThreadDef ::
  p : nat1
  isP : bool
  j : nat
  d : nat
  o : nat;
	
instance variables

protected period : nat1 := 1000E6;
protected isPeriodic : bool := true;
protected jitter : nat := 0;
protected delay : nat := 0;
protected offset : nat := 0;

protected registeredSelf : BaseRTThread;
protected timeStamp : RTTimeStamp := RTTimeStamp`GetInstance();

operations

protected BaseRTThread : BaseRTThread ==> BaseRTThread
BaseRTThread(t) ==
 (registeredSelf := t;
  timeStamp.RegisterThread(registeredSelf);
  if(not timeStamp.IsInitialising())
  then start(registeredSelf);   
 );

protected Step : () ==> ()
Step() ==
  is subclass responsibility;

thread

periodic(period, jitter, delay, offset)(Step);

end BaseRTThread
~~~
{% endraw %}

### RTTimeStamp.vdmrt

{% raw %}
~~~
class RTTimeStamp

instance variables

registeredThreads : set of BaseRTThread := {};
isInitialising : bool := true;
-- singleton instance of class
private static rtTimeStamp : RTTimeStamp := new RTTimeStamp();

operations

-- private constructor (singleton pattern)
private RTTimeStamp : () ==> RTTimeStamp
RTTimeStamp() ==
  skip;

-- public operation to get the singleton instance
public static GetInstance: () ==> RTTimeStamp
GetInstance() ==
  return rtTimeStamp;

public RegisterThread : BaseRTThread ==> ()
RegisterThread(t) ==
 (registeredThreads := registeredThreads union {t};  
 );
 
public UnRegisterThread : BaseRTThread ==> ()
UnRegisterThread(t) ==
 (registeredThreads := registeredThreads \ {t};
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
 
sync 

mutex (RegisterThread);
mutex (UnRegisterThread);
mutex (RegisterThread, UnRegisterThread);
mutex (IsInitialising);
mutex (DoneInitialising);

end RTTimeStamp
~~~
{% endraw %}

### world.vdmrt

{% raw %}
~~~
              
class World

instance variables

-- maintain a link to the environment
public static timerRef : RTTimeStamp := RTTimeStamp`GetInstance();
public static env : [Environment] := nil;

operations

public World: () ==> World
World () ==
  (-- set-up the sensors
   env := new Environment("scenario.txt", mk_BaseRTThread`ThreadDef(1000E6,true,10,900,0));
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

### environment.vdmrt

{% raw %}
~~~
              
class Environment is subclass of GLOBAL, BaseRTThread

types

public inline  = EventId * MissileType * Angle * Time;
public outline = EventId * FlareType * Angle * nat * Time

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

operations

 public getAperture: () ==> Angle * Angle
  getAperture () == is not yet specified;

public Environment: seq of char * [ThreadDef] ==> Environment
Environment (fname, tDef) ==
 (def mk_ (-,input) = io.freadval[seq of inline](fname) in
    inlines := input;
   
  if tDef <> nil
  then (period := tDef.p;
        jitter := tDef.j;
        delay := tDef.d;
        offset := tDef.o;
       ); 
   BaseRTThread(self);
 );

public addSensor: Sensor ==> ()
addSensor (psens) ==
  duration (0)
  (dcl id : nat := card dom ranges + 1;
   atomic (
    ranges := ranges munion {id |-> psens.getAperture()};
    sensors := sensors munion {id |-> psens} 
   )
  );

private createSignal: () ==> ()
createSignal () ==
  duration (0) 
  (if len inlines > 0
   then (dcl curtime : Time := time, done : bool := false;
         while not done do
           def mk_ (eventid, pmt, pa, pt) = hd inlines in
             if pt <= curtime
             then (for all id in set dom ranges do
                     def mk_(papplhs,pappsize) = ranges(id) in
                       if canObserve(pa,papplhs,pappsize)
                       then sensors(id).trip(eventid,pmt,pa);
                   inlines := tl inlines;
                   done := len inlines = 0)
             else done := true)
   else busy := false);

public handleEvent: EventId * FlareType * Angle * Time * Time ==> ()
handleEvent (evid,pfltp,angle,pt1,pt2) ==
  duration (0) 
  (outlines := outlines ^ [mk_ (evid,pfltp,angle,pt1,pt2)] );

public showResult: () ==> ()
showResult () ==
  def - = io.writeval[seq of outline](outlines) in skip;

public isFinished : () ==> ()
isFinished () == skip;

public GetAndPurgeOutlines: () ==> seq of outline
GetAndPurgeOutlines() ==
  let res = outlines
  in
    (outlines := [];
     return res);

public Step : () ==> ()
Step() ==
 (createSignal();
 );

sync

mutex (handleEvent);
mutex (createSignal);
per isFinished => not busy;

end Environment
                                                                                                 
~~~
{% endraw %}

### missiledetector.vdmrt

{% raw %}
~~~
              
class MissileDetector is subclass of GLOBAL, BaseRTThread

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
        jitter := tDef.j;
        delay := tDef.d;
        offset := tDef.o;
       ); 
  BaseRTThread(self);
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
async public addThreat: EventId * MissileType * Angle * Time ==> ()
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
 (if threats <> []
  then (def mk_ (evid,pmt, pa, pt) = getThreat() in
          for all id in set dom ranges do
            def mk_(papplhs, pappsize) = ranges(id) in
              if canObserve(pa, papplhs, pappsize)
              then controllers(id).addThreat(evid,pmt,pa,pt);
        busy := len threats > 0);
 );

  public getAperture: () ==> Angle * Angle
  getAperture () == is not yet specified;

sync

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

### flaredispenser.vdmrt

{% raw %}
~~~
              
class FlareDispenser is subclass of GLOBAL, BaseRTThread

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
  {<MissileA> |-> 1,
   <MissileB> |-> 2,
   <MissileC> |-> 3 }

types

public Plan = seq of PlanStep;

public PlanStep = FlareType * Time;

instance variables

public curplan : Plan := [];
curprio        : nat := 0;
busy           : bool := false;
aparature      : Angle;
eventid        : [EventId];

operations

public FlareDispenser: Angle * [ThreadDef] ==> FlareDispenser
FlareDispenser(ang, tDef) ==
 (aparature := ang;
 
  if tDef <> nil
  then (period := tDef.p;
        jitter := tDef.j;
        delay := tDef.d;
        offset := tDef.o;
       ); 
  BaseRTThread(self);
 );

public GetAngle: () ==> nat
GetAngle() ==
  return aparature;

async public addThreat: EventId * MissileType * Time ==> ()
addThreat (evid, pmt, ptime) ==
  if missilePriority(pmt) > curprio
  then (dcl newplan : Plan :=  [],
            newtime : Time := ptime;
        -- construct an absolute time plan
        for mk_(fltp, fltime) in responseDB(pmt) do
          (newplan := newplan ^ [mk_ (fltp, newtime)];
           newtime := newtime + fltime );
        -- immediately release the first action
        def mk_(fltp, fltime) = hd newplan in
          releaseFlare(evid,fltp,fltime,time);
        -- store the rest of the plan
        curplan := tl newplan;
        eventid := evid;
        curprio := missilePriority(pmt);
        busy := true )
pre pmt in set dom missilePriority and
    pmt in set dom responseDB;

protected async Step: () ==> ()
Step () ==
  cycles (1E5) 
  (if len curplan > 0
   then (dcl curtime : Time := time, done : bool := false;
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
  World`env.handleEvent(evid,pfltp,aparature,pt1,pt2);

public isFinished: () ==> ()
isFinished () == skip;

  public getAperture: () ==> Angle * Angle
  getAperture () == is not yet specified;

sync

mutex (addThreat,Step);
per isFinished => not busy;

end FlareDispenser
                                                                                                  
~~~
{% endraw %}

### flarecontroller.vdmrt

{% raw %}
~~~
              
class FlareController is subclass of GLOBAL, BaseRTThread

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
        jitter := tDef.j;
        delay := tDef.d;
        offset := tDef.o;
       ); 
  BaseRTThread(self);
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
      start (pfldisp) );

-- get the left hand-side start point and opening angle
public getAperture: () ==> GLOBAL`Angle * GLOBAL`Angle
getAperture () == return mk_(aperture, FLARE_APERTURE);

-- addThreat is a helper operation to modify the event
-- list. currently events are stored first come first served.
-- one could imagine using a different ordering instead
async public addThreat: EventId * MissileType * Angle * Time ==> ()
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
         busy := len threats > 0; 
        );
   );

sync

-- addThreat and getThreat modify the same instance variables
-- therefore they need to be declared mutual exclusive
mutex (addThreat,getThreat);

-- getThreat is used as a 'blocking read' from the main
-- thread of control of the missile detector
per getThreat => len threats > 0;
per isFinished => not busy

end FlareController
                                                                                                     
~~~
{% endraw %}

### TestCase.vdmrt

{% raw %}
~~~
               
class TestCase
  is subclass of Test

instance variables
  protected name : seq of char

operations
  public TestCase: seq of char ==> TestCase
  TestCase(nm) == name := nm;

  public GetName: () ==> seq of char
  GetName () == return name;
                           
  protected AssertTrue: bool ==> ()
  AssertTrue (pb) == if not pb then exit <FAILURE>;

  protected AssertFalse: bool ==> ()
  AssertFalse (pb) == if pb then exit <FAILURE>;
                            
  public Run: TestResult ==> ()
  Run (ptr) ==
    trap <FAILURE>
      with 
        ptr.AddFailure(self)
      in
        (SetUp();
	 RunTest();
	 TearDown());
                            
  protected SetUp: () ==> ()
  SetUp () == is subclass responsibility;

  protected RunTest: () ==> ()
  RunTest () == is subclass responsibility;

  protected TearDown: () ==> ()
  TearDown () == is subclass responsibility

end TestCase
             
~~~
{% endraw %}

