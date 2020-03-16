---
layout: default
title: HomeAutomationConcPP
---

## HomeAutomationConcPP
Author: Sune Wolff




| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### Window.vdmpp

{% raw %}
~~~
class Window is subclass of Actuator, BaseThread

instance variables

finished	: bool := false;

operations

public Window: nat * NetworkTypes`nodeType * Surroundings * nat1 * bool ==> Window
Window (id, type, envir, p, isP) ==
 (ID := id;
  Type := type;
  Corr := <CLOSE>;
  Env := envir;
  period := p;
  isPeriodic := isP;
 );

public SetCorrection: NetworkTypes`correction ==> ()
SetCorrection(cor) ==
  Corr := cor
pre (cor = <OPEN>) or (cor = <CLOSE>);

public Finish: () ==> ()
Finish() ==
  finished := true;

public IsFinished: () ==> ()
IsFinished() ==
  skip;

protected Step: () ==> ()
Step() ==
 (if (GetCorr() = <OPEN>)
  then (HA`Sur.DecHumid();
        HA`Sur.DecTemp();
       );
 );

sync
	
  per IsFinished => finished;

--thread
-- (--World`timerRef.RegisterThread();
 
--  while true 
--  do
--   (if (GetCorr() = <OPEN>)
--    then (HA`Env.DecHumid();
--          HA`Env.DecTemp();
--         );
--    World`timerRef.WaitRelative(5);--World`timerRef.stepLength);
--   )
-- )

end Window
~~~
{% endraw %}

### Environment.vdmpp

{% raw %}
~~~
class Environment is subclass of BaseThread

instance variables

--private ha       : HA;
private io       : IO := new IO();
private inlines	 : seq of inline := [];
private simtime	 : nat := 1E9;

private finished : bool := false;

types

-- Input file: Temp, Humid, Time
public inline	= nat * nat * nat;

operations

public Environment: seq of char * nat1 * bool ==> Environment
Environment(fname, p, isP) ==
 (period := p;
  isPeriodic := isP;
  
  def mk_ (-,mk_(t,input)) = io.freadval[nat * seq of inline](fname) 
  in
   (inlines := input;
    simtime := t;
   );
 );

private CreateSignal: () ==> ()
CreateSignal() ==
 (if len inlines > 0
  then (dcl curtime : nat := World`timerRef.GetTime();
  def mk_ (temp, humid, time) = hd inlines 
  in
   (if time = curtime
    then (HA`Sur.SetTemp(temp);
          HA`Sur.SetHumid(humid);
          IO`print([time] ^ ["New env values set!"]);
          IO`print(" \n");
          inlines := tl inlines;
          return
         );
   );
  )
  else (finished := true;
        return
       );
 );	

public IsFinished: () ==> ()
IsFinished() ==
  skip;
  
public Finish: () ==> ()
Finish() ==
  finished := true;

protected Step: () ==> ()
Step() ==
 (if World`timerRef.GetTime() < simtime 
  then CreateSignal()   
  else finished := true;     
 );

sync

  per IsFinished => finished;

--thread
-- (--World`timerRef.RegisterThread();
--  --start(new ClockTick(threadid));
--  while World`timerRef.GetTime() < simtime 
--  do
--   (--if(World`timerRef.GetTime() = 100)
--    --then (testT := new TestThread(77, true);
--    --     );
--    if not finished
--    then CreateSignal();
		
--    World`timerRef.WaitRelative(1);
--   );
--  finished := true;
-- )

end Environment
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

operations

public TimeStamp : nat ==> TimeStamp
TimeStamp(count) ==
	barrierCount := count;

public RegisterThread : BaseThread ==> ()
RegisterThread(t) ==
 (barrierCount := barrierCount + 1;
  registeredThreads := registeredThreads union {t};  
 );
 
public UnRegisterThread : () ==> ()
UnRegisterThread() ==
 (barrierCount := barrierCount - 1;
  --registeredThreads := registeredThreads \ {t};
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

public GetTime : () ==> nat
GetTime() ==
  return currentTime;

Awake: () ==> ()
Awake() == skip;

public ThreadDone : () ==> ()
ThreadDone() == 
	AddToWakeUpMap(threadid, nil);

sync
  per Awake => threadid not in set dom wakeUpMap;

mutex(IsInitialising);
mutex(DoneInitialising);
  -- Is this really needed?
  mutex(AddToWakeUpMap);
  mutex(NotifyThread);
  mutex(BarrierReached);
  
  mutex(AddToWakeUpMap, NotifyThread);
  mutex(AddToWakeUpMap, BarrierReached);
  mutex(NotifyThread, BarrierReached);
  
  mutex(AddToWakeUpMap, NotifyThread, BarrierReached);

end TimeStamp
~~~
{% endraw %}

### HostController.vdmpp

{% raw %}
~~~

class HostController is subclass of BaseThread

instance variables

private finished    : bool := false;
private print       : bool := true;

private TargetTemp  : nat;
private Temp        : nat := 0;
private TargetHumid : nat;
private Humid       : nat := 0;

private NodeList    : map nat to NetworkTypes`nodeType := { |-> };
private Algo        : algType := <NONE>;


types   

private algType	= <THTW> | <TTW> | <TT> | <TW> | <HW> | <NONE>;


operations

public HostController: nat * nat * nat1 * bool ==> HostController
HostController(t, h, p, isP) ==
 (TargetTemp := t;
  TargetHumid := h;
  period := p;
  isPeriodic := isP;
 );

private UpdateValues: () ==> ()
UpdateValues() ==
 (for all r in set rng NodeList 
  do
   (if (r = <HUMIDSENSOR>)
    then Humid := HA`HumidNode.ReadValue();
    if (r = <TEMPSENSOR>)
    then Temp := HA`TempNode.ReadValue();
   );
 );

private Algorithm: () ==> ()
Algorithm() ==
 (cases Algo:
    <THTW> -> THTWAlgo(),
    <TTW>  -> TTWAlgo(),
    <TT>   -> TTAlgo(),
    <TW>   -> TWAlgo(),
    <HW>   -> HWAlgo(),
    <NONE> -> return
  end
 );

private THTWAlgo: () ==> ()
THTWAlgo() ==
 (if (Humid > TargetHumid)
  then (HA`WinNode.SetCorrection(<OPEN>);
        HA`ThermNode.SetCorrection(<NONE>);
        print := true;
       )
  elseif (Temp > TargetTemp+1)
  then (HA`WinNode.SetCorrection(<CLOSE>);
        HA`ThermNode.SetCorrection(<DEC>);
        print := true;
       )
  elseif (Temp < TargetTemp-1)
  then (HA`WinNode.SetCorrection(<CLOSE>);
        HA`ThermNode.SetCorrection(<INC>);
        print := true;
       )
  else (HA`WinNode.SetCorrection(<CLOSE>);
        HA`ThermNode.SetCorrection(<NONE>);
        if print
        then (IO`print([World`timerRef.GetTime()] ^ ["Target values reached"]);
              IO`print(" \n");
             );
        print := false;
       );
 );

private TTWAlgo: () ==> ()
TTWAlgo() ==
 (if (Temp > TargetTemp + 2)
  then (HA`WinNode.SetCorrection(<OPEN>);
        HA`ThermNode.SetCorrection(<DEC>);
        print := true;
       )
  elseif (Temp > TargetTemp + 1)
  then (HA`WinNode.SetCorrection(<CLOSE>);
        HA`ThermNode.SetCorrection(<DEC>);
        print := true;
       )
  elseif (Temp < TargetTemp - 1)
  then (HA`WinNode.SetCorrection(<CLOSE>);
        HA`ThermNode.SetCorrection(<INC>);
        print := true;
       )
  else (HA`WinNode.SetCorrection(<CLOSE>);
        HA`ThermNode.SetCorrection(<NONE>);
        if print
        then (IO`print([World`timerRef.GetTime()] ^ ["Target values reached"]);
              IO`print(" \n");
             );
        print := false;
       );
 );

private TTAlgo: () ==> ()
TTAlgo() ==
 (if (Temp > TargetTemp + 1)
  then (HA`ThermNode.SetCorrection(<DEC>);
        print := true;
       )
  elseif (Temp < TargetTemp - 1)
  then (HA`ThermNode.SetCorrection(<DEC>);
        print := true;
       )
  else (HA`ThermNode.SetCorrection(<NONE>);
        if print
        then (IO`print([World`timerRef.GetTime()] ^ ["Target values reached"]);
              IO`print(" \n");
             );
        print := false;
       );
 );

private TWAlgo: () ==> ()
TWAlgo() ==
 (if (Temp > TargetTemp + 1)
  then (HA`WinNode.SetCorrection(<OPEN>);
        print := true;
       ) 
  else (HA`WinNode.SetCorrection(<CLOSE>);
        if print
        then (IO`print([World`timerRef.GetTime()] ^ ["Target values reached"]);
              IO`print(" \n");
             );
        print := false;
       );
 );

private HWAlgo: () ==> ()
HWAlgo() ==
 (if (Humid > TargetHumid)
  then (HA`WinNode.SetCorrection(<OPEN>);
        print := true;
       )
  else (HA`WinNode.SetCorrection(<CLOSE>);
        if print
        then (IO`print([World`timerRef.GetTime()] ^ ["Target values reached"]);
              IO`print(" \n");
             );
        print := false;
       );
 );

private UpdateAlgorithm: () ==> ()
UpdateAlgorithm() ==
 (if (rng NodeList = {})
  then Algo := <NONE>
  elseif (rng NodeList = {<TEMPSENSOR>, <HUMIDSENSOR>, <THERMOSTAT>, <WINDOW>})
  then Algo := <THTW>
  elseif (rng NodeList = {<TEMPSENSOR>, <THERMOSTAT>,<WINDOW>})
  then Algo := <TTW>
  elseif (rng NodeList = {<TEMPSENSOR>, <THERMOSTAT>})
  then Algo := <TT>
  elseif (rng NodeList = {<TEMPSENSOR>, <WINDOW>})
  then Algo := <TW>
  elseif (rng NodeList = {<HUMIDSENSOR>, <WINDOW>})
  then Algo := <HW>
  else Algo := <NONE>;
 );

private printStr: seq of char ==> ()
printStr(str) ==
 (print := false;
  IO`print(str);
 );

public AddNode: nat * NetworkTypes`nodeType ==> ()
AddNode(id, type) ==
 (NodeList := NodeList ++ {id |-> type};
  UpdateAlgorithm();
 )
pre id not in set dom NodeList
post card(dom NodeList) = card(dom NodeList~) + 1;

public RemoveNode: nat * NetworkTypes`nodeType ==> ()
RemoveNode(id, type) ==
 (if (NodeList(id) = type)
  then NodeList := {id} <-: NodeList;
 )
pre id in set dom NodeList
post card(dom NodeList) = card(dom NodeList~) - 1;

public IsFinished: () ==> ()
IsFinished() == 
  skip;

public Finish: () ==> ()
Finish() == 
  finished := true;

protected Step: () ==> ()
Step() ==
 (UpdateValues();
  Algorithm();
 );

sync

per IsFinished => finished;
per printStr => print;


--thread
-- (while true 
--  do
--   (UpdateValues();
--    Algorithm();
--    World`timerRef.WaitRelative(3);--World`timerRef.stepLength);
--   )
-- )

end HostController
~~~
{% endraw %}

### Sensor.vdmpp

{% raw %}
~~~
class Sensor

instance variables

protected ID	: nat;
protected Type	: NetworkTypes`nodeType;
protected Value	: nat;
protected Env	: Surroundings;

operations

pure public GetID: () ==> nat
GetID() ==
  return ID;

pure public GetType: () ==> NetworkTypes`nodeType
GetType() ==
  return Type;

pure public ReadValue: () ==> nat
ReadValue() ==
  return Value;

end Sensor
~~~
{% endraw %}

### NetworkTypes.vdmpp

{% raw %}
~~~
class NetworkTypes

types   

public nodeType   = <TEMPSENSOR> | <HUMIDSENSOR> | <WINDOW> | <THERMOSTAT> | <HOSTCONTROL> | <NONE>;
public correction = <INC> | <DEC> | <OPEN> | <CLOSE> | <NONE>;

end NetworkTypes
~~~
{% endraw %}

### Actuator.vdmpp

{% raw %}
~~~
class Actuator

instance variables

protected ID   : nat;
protected Type : NetworkTypes`nodeType;
protected Corr : NetworkTypes`correction;
protected Env	: Surroundings;

operations

pure public GetID: () ==> nat
GetID() ==
  return ID;

pure public GetType: () ==> NetworkTypes`nodeType
GetType() ==
  return Type;

pure protected GetCorr: () ==> NetworkTypes`correction
GetCorr() ==
  return Corr;

end Actuator
~~~
{% endraw %}

### TemperatureSensor.vdmpp

{% raw %}
~~~
class TemperatureSensor is subclass of Sensor, BaseThread

instance variables

finished	: bool := false;

operations

public TemperatureSensor: nat * NetworkTypes`nodeType * nat * Surroundings * nat1 * bool ==> TemperatureSensor
TemperatureSensor (id, type, val, envir, p, isP) ==
 (ID := id;
  Type := type;
  Value := val;
  Env := envir;
  period := p;
  isPeriodic := isP;
 );

public Finish: () ==> ()
Finish() ==
  finished := true;

public IsFinished: () ==> ()
IsFinished() ==
  skip;

protected Step: () ==> ()
Step() ==
  Value := Env.ReadTemp();

sync
	
  per IsFinished => finished;

--thread
-- (--World`timerRef.RegisterThread();
 
--  while true 
--  do
--   (Value := Env.ReadTemp();
--    World`timerRef.WaitRelative(3);--World`timerRef.stepLength);
--   )
-- )

end TemperatureSensor
~~~
{% endraw %}

### World.vdmpp

{% raw %}
~~~
class World

instance variables

private env				: Environment;
public static timerRef	: TimeStamp := new TimeStamp(); --(6);
private ha : HA;

operations

public World: () ==> World
World() ==
 (ha := new HA();  
  env := new Environment("scenario.txt", 1, true);
  
  ha.Host.AddNode(ha.TempNode.GetID(), ha.TempNode.GetType());
  ha.Host.AddNode(ha.HumidNode.GetID(), ha.HumidNode.GetType());
  ha.Host.AddNode(ha.ThermNode.GetID(), ha.ThermNode.GetType());
  ha.Host.AddNode(ha.WinNode.GetID(), ha.WinNode.GetType());

  -- End the initialisation phase of system threads
  World`timerRef.DoneInitialising();  
 );

public Run: () ==> ()
Run() ==
 (-- wait til environment has finished creating input
  env.IsFinished();
  -- print simulation finishing message
  IO`print("Test run finished at time: ");
  IO`print(timerRef.GetTime());
 );

end World
~~~
{% endraw %}

### HumidSensor.vdmpp

{% raw %}
~~~
class HumidSensor is subclass of Sensor, BaseThread

instance variables

finished	: bool := false;

operations

public HumidSensor: nat * NetworkTypes`nodeType * nat * Surroundings * nat1 * bool ==> HumidSensor
HumidSensor (id, type, val, envir, p, isP) ==
 (ID := id;
  Type := type;
  Value := val;
  Env := envir;
  period := p;
  isPeriodic := isP;
 );

public Finish: () ==> ()
Finish() ==
  finished := true;

public IsFinished: () ==> ()
IsFinished() ==
  skip;

protected Step: () ==> ()
Step() ==
  Value := Env.ReadHumid();

sync
	
  per IsFinished => finished;

--thread
-- (--World`timerRef.RegisterThread();
  
--  while true 
--  do 
--   (Value := Env.ReadHumid();
--    World`timerRef.WaitRelative(3);--World`timerRef.stepLength);
--   )
-- )

end HumidSensor
~~~
{% endraw %}

### BaseThread.vdmpp

{% raw %}
~~~
class BaseThread
	
instance variables

protected period : nat1 := 1;
protected isPeriodic : bool := true;

operations

protected BaseThread : () ==> BaseThread
BaseThread() ==
 (World`timerRef.RegisterThread(self);
  if(not World`timerRef.IsInitialising())
  then start(self);  
 );

protected Step : () ==> ()
Step() ==
  is subclass responsibility

thread
 (if isPeriodic
  then (while true
        do 
         (Step();
          World`timerRef.WaitRelative(period);
         )
       )
  else (Step();
        World`timerRef.WaitRelative(0);
        World`timerRef.UnRegisterThread();
       )
 );

end BaseThread
~~~
{% endraw %}

### Thermostat.vdmpp

{% raw %}
~~~

class Thermostat is subclass of Actuator, BaseThread

instance variables

finished	: bool := false;


operations

public Thermostat: nat * NetworkTypes`nodeType * Surroundings * nat1 * bool ==> Thermostat
Thermostat (id, type, envir, p, isP) ==
 (ID := id;
  Type := type;
  Corr := <NONE>;
  Env := envir;
  period := p;
  isPeriodic := isP;
 );

public SetCorrection: NetworkTypes`correction ==> ()
SetCorrection(cor) ==
  Corr := cor
pre (cor = <INC>) or (cor = <DEC>) or (cor = <NONE>);

public Finish: () ==> ()
Finish() ==
  finished := true;

public IsFinished: () ==> ()
IsFinished() ==
  skip;

protected Step: () ==> ()
Step() ==
 (dcl tempCorr: NetworkTypes`correction := GetCorr();

  if tempCorr = <INC>
  then HA`Sur.IncTemp()
  elseif tempCorr = <DEC>
  then HA`Sur.DecTemp();
 );

sync
	
  per IsFinished => finished;

--thread
-- (--World`timerRef.RegisterThread();
  
--  while true 
--  do 
--   (dcl tempCorr: NetworkTypes`correction := GetCorr();

--    if tempCorr = <INC>
--    then HA`Env.IncTemp()
--    elseif tempCorr = <DEC>
--    then HA`Env.DecTemp();
	
--    World`timerRef.WaitRelative(5);--World`timerRef.stepLength);
--   )
-- )

end Thermostat
~~~
{% endraw %}

### Surroundings.vdmpp

{% raw %}
~~~
class Surroundings

instance variables

private envTemp	 : nat;
private envHumid : nat;

operations

public Surroundings: () ==> Surroundings
Surroundings() ==
 (envTemp := 20;
  envHumid := 75;
 );

public SetTemp: nat ==> ()
SetTemp(t) ==
  envTemp := t;

public SetHumid: nat ==> ()
SetHumid(h) ==
  envHumid := h;

pure public ReadTemp: () ==> nat
ReadTemp() ==
  return envTemp;

public IncTemp: () ==> ()
IncTemp() ==
  envTemp := envTemp + 1;

public DecTemp: () ==> ()
DecTemp() ==
  envTemp := envTemp - 1;

pure public ReadHumid: () ==> nat
ReadHumid() ==
  return envHumid;

public IncHumid: () ==> ()
IncHumid() ==
  envHumid := envHumid + 1;

public DecHumid: () ==> ()
DecHumid() ==
  envHumid := envHumid - 1;

sync

  mutex(IncTemp);
  mutex(DecTemp);
  mutex(SetTemp);
  mutex(IncTemp, DecTemp, SetTemp);
  mutex(IncHumid);
  mutex(DecHumid); 
  mutex(SetHumid);
  mutex(IncHumid, DecHumid, SetHumid);

end Surroundings
~~~
{% endraw %}

### HomeAutomation.vdmpp

{% raw %}
~~~

class HA

instance variables

public static Sur		: Surroundings := new Surroundings();
public static TempNode	: TemperatureSensor := new TemperatureSensor(1, <TEMPSENSOR>, 0, Sur, 3, true);
public static HumidNode	: HumidSensor := new HumidSensor(2, <HUMIDSENSOR>, 0, Sur, 3, true);
public static ThermNode	: Thermostat := new Thermostat(3, <THERMOSTAT>, Sur, 5, true);
public static WinNode	: Window := new Window(4, <WINDOW>, Sur, 5, true);
public static Host		: HostController := new HostController(22, 75, 3, true);

end HA
~~~
{% endraw %}

