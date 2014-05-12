---
layout: default
title: CMSeqPP
---

##CMSeqPP
Author: Peter Gorm Larsen and Marcel Verhoef


This example is used in the guidelines for developing distributed 
real time systems using the VICE extension to VDM++. This model 
is available in a sequential version, a concurrent version as
well as in a distributed real-time VICE version. This is the 
distributed real time version of this example. | Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new World().Run()|


###CM.vdmpp

{% raw %}
~~~

class CM
instance variables
-- maintain a link to the detectorpublic static detector : MissileDetector := new MissileDetector();
public static sensor0 : Sensor := new Sensor(detector,0);public static sensor1 : Sensor := new Sensor(detector,90);public static sensor2 : Sensor := new Sensor(detector,180);public static sensor3 : Sensor := new Sensor(detector,270);
public static controller0 : FlareController := new FlareController(0);public static controller1 : FlareController := new FlareController(120);public static controller2 : FlareController := new FlareController(240);
public static dispenser0 : FlareDispenser := new FlareDispenser(0);public static dispenser1 : FlareDispenser := new FlareDispenser(30);public static dispenser2 : FlareDispenser := new FlareDispenser(60);public static dispenser3 : FlareDispenser := new FlareDispenser(90);
public static dispenser4 : FlareDispenser := new FlareDispenser(0);public static dispenser5 : FlareDispenser := new FlareDispenser(30);public static dispenser6 : FlareDispenser := new FlareDispenser(60);public static dispenser7 : FlareDispenser := new FlareDispenser(90);
public static dispenser8 : FlareDispenser := new FlareDispenser(0);public static dispenser9 : FlareDispenser := new FlareDispenser(30);public static dispenser10 : FlareDispenser := new FlareDispenser(60);public static dispenser11 : FlareDispenser := new FlareDispenser(90);
end CM

~~~
{% endraw %}

###environment.vdmpp

{% raw %}
~~~

class Environment is subclass of GLOBAL
types
public inline  = EventId * MissileType * Angle * Time;public outline = EventId * FlareType * Angle * Time * Time;
instance variables
-- access to the VDMTools stdioio : IO := new IO();
-- the input file to processinlines : seq of inline := [];
-- the output file to printoutlines : seq of outline := [];
-- maintain a link to all sensorsranges : map nat to (Angle * Angle) := {|->};sensors : map nat to Sensor := {|->};inv dom ranges = dom sensors;
-- information about the latest event that has arrivedevid : [EventId] := nil;
busy : bool := true;
operations
public Environment: seq of char ==> EnvironmentEnvironment (fname) ==  def mk_ (-,input) = io.freadval[seq of inline](fname) in    inlines := input;
public addSensor: Sensor ==> ()addSensor (psens) ==  (dcl id : nat := card dom ranges + 1;   atomic (    ranges := ranges munion {id |-> psens.getAperture()};    sensors := sensors munion {id |-> psens}    )  );
public Run: () ==> ()Run () ==  (while not (isFinished() and CM`detector.isFinished()) do    (evid := createSignal();     CM`detector.Step();     World`timerRef.StepTime();    ); showResult() );
private createSignal: () ==> [EventId]createSignal () ==  (if len inlines > 0   then (dcl curtime : Time := World`timerRef.GetTime(),              done : bool := false;         while not done do           def mk_ (eventid, pmt, pa, pt) = hd inlines in             if pt <= curtime             then (for all id in set dom ranges do                     def mk_(papplhs,pappsize) = ranges(id) in                       if canObserve(pa,papplhs,pappsize)                       then sensors(id).trip(eventid,pmt,pa);                   inlines := tl inlines;                   done := len inlines = 0;                   return eventid )             else (done := true;                   return nil ))   else (busy := false;         return nil));
public handleEvent: EventId * FlareType * Angle * Time * Time ==> ()handleEvent (newevid,pfltp,angle,pt1,pt2) ==  (outlines := outlines ^ [mk_ (newevid,pfltp, angle,pt1, pt2)] );
public showResult: () ==> ()showResult () ==  def - = io.writeval[seq of outline](outlines) in skip;
public isFinished : () ==> boolisFinished () ==   return inlines = [] and not busy;
end Environment

~~~
{% endraw %}

###flarecontroller.vdmpp

{% raw %}
~~~

class FlareController is subclass of GLOBAL
instance variables
-- the left hand-side of the working angleprivate aperture : Angle;
-- maintain a link to each dispenserranges : map nat to (Angle * Angle) := {|->};dispensers : map nat to FlareDispenser := {|->};inv dom ranges = dom dispensers;
-- the relevant events to be treated by this controllerthreats : seq of (EventId * MissileType * Angle * Time) := [];
-- the status of the controllerbusy : bool := false
operations
public FlareController: Angle ==> FlareControllerFlareController (papp) == aperture := papp;
public addDispenser: FlareDispenser ==> ()addDispenser (pfldisp) ==  let angle = aperture + pfldisp.GetAngle() in    (dcl id : nat := card dom ranges + 1;     atomic     (ranges := ranges munion                 {id |-> mk_(angle, DISPENSER_APERTURE)};      dispensers := dispensers munion {id |-> pfldisp});     );
public Step: () ==> ()Step() ==  (if threats <> []   then def mk_ (evid,pmt, pa, pt) = getThreat() in          for all id in set dom ranges do            def mk_(papplhs, pappsize) = ranges(id) in              if canObserve(pa, papplhs, pappsize)              then dispensers(id).addThreat(evid,pmt,pt);   busy := len threats > 0;   for all id in set dom dispensers do     dispensers(id).Step());
-- get the left hand-side start point and opening anglepublic getAperture: () ==> GLOBAL`Angle * GLOBAL`AnglegetAperture () == return mk_(aperture, FLARE_APERTURE);
-- addThreat is a helper operation to modify the event-- list. currently events are stored first come first served.-- one could imagine using a different ordering insteadpublic addThreat: EventId * MissileType * Angle * Time ==> ()addThreat (evid,pmt,pa,pt) ==  (threats := threats ^ [mk_ (evid,pmt,pa,pt)];   busy := true );
-- getThreat is a local helper operation to modify the event listprivate getThreat: () ==> EventId * MissileType * Angle * TimegetThreat () ==  (dcl res : EventId * MissileType * Angle * Time := hd threats;   threats := tl threats;   return res );
public isFinished: () ==> boolisFinished () ==  return forall id in set dom dispensers &            dispensers(id).isFinished();
end FlareController

~~~
{% endraw %}

###flaredispenser.vdmpp

{% raw %}
~~~

class FlareDispenser is subclass of GLOBAL
values
responseDB : map MissileType to Plan =  {<MissileA> |-> [mk_(<FlareOneA>,900),                   mk_(<FlareTwoA>,500),                   mk_(<DoNothingA>,100),                   mk_(<FlareOneA>,500)],   <MissileB> |-> [mk_(<FlareTwoB>,500),                   mk_(<FlareTwoB>,700)],   <MissileC> |-> [mk_(<FlareOneC>,400),                   mk_(<DoNothingC>,100),                   mk_(<FlareTwoC>,400),                   mk_(<FlareOneC>,500)] };
missilePriority : map MissileType to nat =  {<None>     |-> 0,   <MissileA> |-> 1,   <MissileB> |-> 2,   <MissileC> |-> 3 }
types
public Plan = seq of PlanStep;
public PlanStep = FlareType * Time;
instance variables
public curplan : Plan := [];curprio        : nat := 0;busy           : bool := false;aperture       : Angle;eventid        : [EventId];
operations
public FlareDispenser: nat ==> FlareDispenserFlareDispenser(ang) ==  aperture := ang;
public Step: () ==> ()Step() ==  if len curplan > 0  then (dcl curtime : Time := World`timerRef.GetTime(),            first : PlanStep := hd curplan,            next : Plan := tl curplan;        let mk_(fltp, fltime) = first in          (if fltime <= curtime           then (releaseFlare(eventid,fltp,fltime,curtime);                 curplan := next;                 if len next = 0                 then (curprio := 0;                        busy := false ) )           )    );
public GetAngle: () ==> natGetAngle() ==  return aperture;
public addThreat: EventId * MissileType * Time ==> ()addThreat (evid, pmt, ptime) ==  if missilePriority(pmt) > curprio  then (dcl newplan : Plan :=  [],            newtime : Time := ptime;        -- construct an absolute time plan        for mk_(fltp, fltime) in responseDB(pmt) do          (newplan := newplan ^ [mk_ (fltp, newtime)];           newtime := newtime + fltime );        -- immediately release the first action        def mk_(fltp, fltime) = hd newplan;            t = World`timerRef.GetTime() in          releaseFlare(evid,fltp,fltime,t);        -- store the rest of the plan        curplan := tl newplan;        eventid := evid;        curprio := missilePriority(pmt);        busy := true )pre pmt in set dom missilePriority and    pmt in set dom responseDB;
private releaseFlare: EventId * FlareType * Time * Time ==> ()releaseFlare (evid,pfltp, pt1, pt2) ==   World`env.handleEvent(evid,pfltp,aperture,pt1,pt2);
public isFinished: () ==> boolisFinished () ==   return not busy
end FlareDispenser

~~~
{% endraw %}

###global.vdmpp

{% raw %}
~~~

class GLOBAL
values
public SENSOR_APERTURE = 90;public FLARE_APERTURE = 120;public DISPENSER_APERTURE = 30
types
-- there are three different types of missilespublic MissileType = <MissileA> | <MissileB> | <MissileC> | <None>;
-- there are nine different flare types, three per missilepublic FlareType =    <FlareOneA> | <FlareTwoA> | <DoNothingA> |     <FlareOneB> | <FlareTwoB> | <DoNothingB> |     <FlareOneC> | <FlareTwoC> | <DoNothingC>;
-- the angle at which the missile is incomingpublic Angle = natinv num == num < 360;
public EventId = nat;
public Time = nat
operations
public canObserve: Angle * Angle * Angle ==> boolcanObserve (pangle, pleft, psize) ==  def pright = (pleft + psize) mod 360 in    if pright < pleft    -- check between [0,pright> and [pleft,360>    then return (pangle < pright or pangle >= pleft)    -- check between [pleft, pright>    else return (pangle >= pleft and pangle < pright);
public getAperture: () ==> Angle * AnglegetAperture () == is subclass responsibility;
end GLOBAL

~~~
{% endraw %}

###missiledetector.vdmpp

{% raw %}
~~~

class MissileDetector is subclass of GLOBAL
-- the primary task of the MissileDetector is to-- collect all sensor data and dispatch each event-- to the appropriate FlareController
instance variables
-- maintain a link to each controllerranges : map nat to (Angle * Angle) := {|->};controllers : map nat to FlareController := {|->};inv dom ranges = dom controllers;
-- collects the observations from all attached sensorsthreats : seq of (EventId * MissileType * Angle * Time) := [];
-- status of the missile detectorbusy : bool := false
operations
-- addController is only used to instantiate the modelpublic addController: FlareController ==> ()addController (pctrl) ==  (dcl nid : nat := card dom ranges + 1;   atomic    (ranges := ranges munion {nid |-> pctrl.getAperture()};     controllers := controllers munion {nid |-> pctrl}    );  );
public Step: () ==> ()Step() ==  (if threats <> []   then def mk_ (evid,pmt, pa, pt) = getThreat() in          for all id in set dom ranges do            def mk_(papplhs, pappsize) = ranges(id) in              if canObserve(pa, papplhs, pappsize)              then controllers(id).addThreat(evid,pmt,pa,pt);    busy := len threats > 0;    for all id in set dom controllers do      controllers(id).Step()  );
-- addThreat is a helper operation to modify the event-- list. currently events are stored first come first served.-- one could imagine using a different ordering instead.public addThreat: EventId * MissileType * Angle * Time ==> ()addThreat (evid,pmt,pa,pt) ==   (threats := threats ^ [mk_ (evid,pmt,pa,pt)];   busy := true );
-- getThreat is a local helper operation to modify the event listprivate getThreat: () ==> EventId * MissileType * Angle * TimegetThreat () ==  (dcl res : EventId * MissileType * Angle * Time := hd threats;   threats := tl threats;   return res );
public isFinished: () ==> boolisFinished () ==  return forall id in set dom controllers &            controllers(id).isFinished()
end MissileDetector

~~~
{% endraw %}

###sensor.vdmpp

{% raw %}
~~~

class Sensor is subclass of GLOBAL
instance variables
-- the missile detector this sensor is connected toprivate detector : MissileDetector;
-- the left hand-side of the viewing angle of the sensorprivate aperture : Angle;
operations
public Sensor: MissileDetector * Angle ==> SensorSensor (pmd, psa) == ( detector := pmd; aperture := psa);
-- get the left hand-side start point and opening anglepublic getAperture: () ==> GLOBAL`Angle * GLOBAL`AnglegetAperture () == return mk_ (aperture, SENSOR_APERTURE);
-- trip is called asynchronously from the environment to-- signal an event. the sensor triggers if the event is-- in the field of view. the event is stored in the-- missile detector for further processingpublic trip: EventId * MissileType * Angle ==> ()trip (evid, pmt, pa) ==  -- log and time stamp the observed threat  detector.addThreat(evid, pmt,pa,World`timerRef.GetTime())pre canObserve(pa, aperture, SENSOR_APERTURE)
end Sensor

~~~
{% endraw %}

###timer.vdmpp

{% raw %}
~~~

class Timer
instance variables
currentTime : nat := 0;private static timerInstance : Timer := new Timer(); 
values
stepLength : nat = 10;
operations
private Timer: () ==> TimerTimer() ==  skip;
public static GetInstance: () ==> TimerGetInstance() ==  return timerInstance;
public StepTime : () ==> ()StepTime() ==  currentTime := currentTime + stepLength;
public GetTime : () ==> natGetTime() ==  return currentTime;
end Timer

~~~
{% endraw %}

###world.vdmpp

{% raw %}
~~~

class World
instance variables
-- maintain a link to the environmentpublic static env : [Environment] := nil;public static timerRef : Timer := Timer`GetInstance();
operations
public World: () ==> WorldWorld () ==  (-- set-up the sensors   env := new Environment("scenario.txt");   env.addSensor(CM`sensor0);   env.addSensor(CM`sensor1);   env.addSensor(CM`sensor2);   env.addSensor(CM`sensor3);
   -- add the first controller with four dispensers   CM`controller0.addDispenser(CM`dispenser0);   CM`controller0.addDispenser(CM`dispenser1);   CM`controller0.addDispenser(CM`dispenser2);   CM`controller0.addDispenser(CM`dispenser3);   CM`detector.addController(CM`controller0);
   -- add the second controller with four dispensers   CM`controller1.addDispenser(CM`dispenser4);   CM`controller1.addDispenser(CM`dispenser5);   CM`controller1.addDispenser(CM`dispenser6);   CM`controller1.addDispenser(CM`dispenser7);   CM`detector.addController(CM`controller1);
   -- add the third controller with four dispensers   CM`controller2.addDispenser(CM`dispenser8);   CM`controller2.addDispenser(CM`dispenser9);   CM`controller2.addDispenser(CM`dispenser10);   CM`controller2.addDispenser(CM`dispenser11);   CM`detector.addController(CM`controller2);  );
-- the run function blocks the user-interface thread-- until all missiles in the file have been processedpublic Run: () ==> ()Run () ==   env.Run()
end World

~~~
{% endraw %}

