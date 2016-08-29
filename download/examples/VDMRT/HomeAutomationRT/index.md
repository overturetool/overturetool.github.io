---
layout: default
title: HomeAutomationRT
---

## HomeAutomationRT
Author: Sune Wolff


This is a distributed real-time version of a home automation example constructed
by Sune Wolff. 

More information can be found in:
Peter Gorm Larsen, John Fitzgerald and Sune Wolff, Methods for the Development 
of Distributed Real-Time Embedded Systems Using VDM, International Journal of 
Software and Informatics, Vol 3., No 2-3, June/September 2009, pp. 305-341. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### Window.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		21/4 - 2008
-- Updated:
-- Description: 	Window actuator sub class
-----------------------------------------------

--
-- class definition
--
class Window is subclass of Actuator

--
-- instance variables
--
instance variables

  finished : bool := false;

--
-- Operations definition section
--
operations

public Window: nat * NetworkTypes`nodeType ==> Window
Window (id, type) ==
 (ID := id;
  Type := type;
  Corr := <CLOSE>;
 );

public Step: () ==> ()
Step() ==
  --cycles(1E3)
 (dcl tempCorr: NetworkTypes`correction := GetCorrection();
  if (tempCorr = <OPEN>)
  then (World`env.DecHumid();
        World`env.DecTemp();
       );
 );

async public SetCorrection: NetworkTypes`correction ==> ()
SetCorrection(cor) ==
  --cycles(1E3)
  Corr := cor
pre (cor = <OPEN>) or (cor = <CLOSE>);

public GetCorrection: () ==> NetworkTypes`correction
GetCorrection() ==
  return Corr;

public IsFinished: () ==> ()
IsFinished() ==
  skip;

sync
  --mutex(PeriodicOp); -- ADDED
  per IsFinished => finished;
  mutex(SetCorrection, GetCorrection);

--
-- Thread definition section
--
thread

-- period of thread (period, jitter, delay, offset)
periodic(1000E6,0,0,0) (Step)

end Window
~~~
{% endraw %}

### Environment.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		20/4 - 2008
-- Updated:
-- Description: 	Environment class of the HomeAutomation project
-----------------------------------------------

--
-- class definition
--
class Environment

--
-- instance variables
--
instance variables

  private io       : IO := new IO();
  private inlines  : seq of inline := [];
  private outlines : seq of outline := [];
  private simtime  : nat;
  private finished : bool := false;
  private envTemp  : int := 20;
  private envHumid : int := 75;
--  inv envTemp >= 0;
--  inv envHumid >= 0;

--
-- Types definition section
--
types

-- Input file: TempIn, HumidIn, TimeIn
public inline	= nat * nat * nat;
-- Output: Time, TempValue, HumidValue
public outline	= nat * nat * nat;

--
-- Operations definition section
--
operations
 
public Environment: seq of char ==> Environment
Environment(fname) ==
 (def mk_ (-,mk_(t,input)) = io.freadval[nat * seq of inline](fname) 
  in
   (inlines := input;
    simtime := t;
    envTemp := 20;
    envHumid := 75;
   );
 )
pre fname <> []
post inlines <> [] and simtime > 0;

private CreateSignal: () ==> ()
CreateSignal() ==
 (if len inlines > 0
  then (dcl curtime : nat := time;
	def mk_ (tempIn, humidIn, timeIn) = hd inlines 
        in
         (if timeIn <= curtime
          then (SetTemp(tempIn);
                SetHumid(humidIn);              
                inlines := tl inlines;
                return
               );
         );
       );
  if (time >= simtime)
  then (ShowResults();
        finished := true;
        return;
       );
 );	

private ShowResults: () ==> ()
ShowResults() ==
 (IO`print("Time, Temperature, Humidity\n");

  for all i in set inds outlines
  do
   (IO`print("\n");
    IO`print(outlines(i));
   );  
 );

public HandleEvent: nat * nat * nat ==> ()
HandleEvent(curTime, TempValue, HumidValue) ==
  outlines := outlines ^ [mk_ (curTime, TempValue, HumidValue)];

public SetTemp: nat ==> ()
SetTemp(t) ==
 (envTemp := t;
  HandleEvent(time, envTemp, envHumid);
 );

public SetHumid: nat ==> ()
SetHumid(h) ==
 (envHumid := h;
  HandleEvent(time, envTemp, envHumid);
 );

public ReadTemp: () ==> int
ReadTemp() ==
  return envTemp;

public IncTemp: () ==> ()
IncTemp() ==
 (envTemp := envTemp + 1;
  HandleEvent(time, envTemp, envHumid);
 );

public DecTemp: () ==> ()
DecTemp() ==
 (envTemp := envTemp - 1;
  HandleEvent(time, envTemp, envHumid);
 );

public ReadHumid: () ==> nat
ReadHumid() ==
  return envHumid;

public IncHumid: () ==> ()
IncHumid() ==
 (envHumid := envHumid + 1;
  HandleEvent(time, envTemp, envHumid);
 );

public DecHumid: () ==> ()
DecHumid() ==
 (envHumid := envHumid - 1;
  HandleEvent(time, envTemp, envHumid);
 );

public IsFinished: () ==> ()
IsFinished() ==
  skip;

sync

  mutex(IncTemp);
  mutex(DecTemp);
  mutex(SetTemp);
  mutex(ReadTemp, IncTemp, DecTemp, SetTemp);
  mutex(IncHumid);
  mutex(DecHumid);
  mutex(SetHumid);
  mutex(ReadHumid, IncHumid, DecHumid, SetHumid);
  mutex(HandleEvent);
  per IsFinished => finished;

--
-- Thread definition section
--
thread

-- period of thread (period, jitter, delay, offset)
periodic(1000E6,0,0,0) (CreateSignal)

end Environment
~~~
{% endraw %}

### HumidSensor.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		21/4 - 2008
-- Updated:
-- Description: 	Humiditor sensor class for HomeAutomation project
-----------------------------------------------

--
-- class definition
--
class HumidSensor is subclass of Sensor

--
-- instance variables
--
instance variables

  finished : bool := false;

--
-- Operations definition section
--
operations

public HumidSensor: nat * NetworkTypes`nodeType * nat ==> HumidSensor
HumidSensor (id, type, val) ==
 (ID := id;
  Type := type;
  Value := val;
 );

public Step: () ==> ()
Step () ==
  --cycles(1E3)
  Value := World`env.ReadHumid();

public IsFinished: () ==> ()
IsFinished() ==
  skip;

sync
  --mutex(PeriodicOp);	-- ADDED
  per IsFinished => finished;

--
-- Thread definition section
--
thread

-- period of thread (period, jitter, delay, offset)
periodic(1000E6,0,0,0) (Step)

end HumidSensor
~~~
{% endraw %}

### Thermostat.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		21/4 - 2008
-- Updated:
-- Description: 	Thermostat sub class
-----------------------------------------------

--
-- class definition
--
class Thermostat is subclass of Actuator

--
-- instance variables
--
instance variables

  finished : bool := false;

--
-- Operations definition section
--
operations

public Thermostat: nat * NetworkTypes`nodeType 
==> Thermostat
Thermostat (id, type) ==
 (ID := id;
  Type := type;
  Corr := <NONE>;
 );

public Step: () ==> ()
Step() ==
  --cycles(1E3)
 (dcl tempCorr: NetworkTypes`correction := GetCorrection();
  if (tempCorr = <INC>)
  then World`env.IncTemp()
  elseif (tempCorr = <DEC>)
  then World`env.DecTemp();
 );

async public SetCorrection: NetworkTypes`correction ==> ()
SetCorrection(cor) ==
  --cycles(1E3)
  Corr := cor
pre (cor = <INC>) or (cor = <DEC>) or (cor = <NONE>);

public GetCorrection: () ==> NetworkTypes`correction
GetCorrection() ==
  return Corr;

public IsFinished: () ==> ()
IsFinished() ==
  skip;

sync
  --mutex(PeriodicOp); -- ADDED
  per IsFinished => finished;
  mutex(SetCorrection, GetCorrection);

--
-- Thread definition section
--
thread

-- period of thread (period, jitter, delay, offset)
periodic(1000E6,0,0,0) (Step)

end Thermostat
~~~
{% endraw %}

### HostController.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		20/4 - 2008
-- Updated:
-- Description: 	HostController is the central server
-----------------------------------------------

--
-- class definition
--
class HostController

values

  private OVERSHOOT_CNT : nat = 2;

--
-- instance variables
--
instance variables

  private finished    : bool := false;

  private TargetTemp  : nat;
  private Temp        : nat := 0;
  private TargetHumid : nat;
  private Humid       : nat := 0;
  private NodeList    : map nat to NetworkTypes`nodeType := { |-> };
  private Algo        : algType := <NONE>;

  private incTempCnt  : nat := 0;
  private decTempCnt  : nat := 0;
  private decHumidCnt : nat := 0;

--
-- Types definition section
--
types   

  public algType = <THTW> | <TTW> | <TT> | <TW> | <HW> | <NONE>;

--
-- Operations definition section
--
operations

public HostController: nat * nat ==> HostController
HostController(t, h) ==
 (TargetTemp := t;
  TargetHumid := h;
 );

public UpdateValues: () ==> ()
UpdateValues() ==
  --cycles(1E9)
 (for all r in set rng NodeList 
  do
   (if (r = <HUMIDSENSOR>)
    then Humid := HA`HumidNode.ReadValue();
    if (r = <TEMPSENSOR>)
    then Temp := HA`TempNode.ReadValue();
   );
 );

public GetAlgo: () ==> algType
GetAlgo() ==
  return Algo;

public GetTemp: () ==> nat
GetTemp() ==
  return Temp;

public GetHumid: () ==> nat
GetHumid() ==
  return Humid;

public Algorithm: () ==> ()
Algorithm() ==
  --cycles(1E11)
 (if (Humid > TargetHumid)
  then decHumidCnt := decHumidCnt + 1
  elseif (Temp > TargetTemp)
  then decTempCnt := decTempCnt + 1
  elseif (Temp < TargetTemp)
  then incTempCnt := incTempCnt + 1;

  cases Algo:
    <THTW> -> THTWAlgo(),
    <TTW>  -> TTWAlgo(),
    <TT>   -> TTAlgo(),
    <TW>   -> TWAlgo(),
    <HW>   -> HWAlgo(),
    <NONE> -> return
  end
 );

-- Avoid overshooting target values
private THTWAlgo : () ==> ()
THTWAlgo () == 
 (if (incTempCnt >= OVERSHOOT_CNT)
  then (HA`ThermNode.SetCorrection(<INC>);
        incTempCnt := 0;
       )
  else if (decTempCnt >= OVERSHOOT_CNT)
  then (HA`ThermNode.SetCorrection(<DEC>);
        decTempCnt := 0;
       )
  else if (decHumidCnt >= OVERSHOOT_CNT)
  then (HA`WinNode.SetCorrection(<OPEN>);
        decHumidCnt := 0;
       )
  else (HA`WinNode.SetCorrection(<CLOSE>);
        HA`ThermNode.SetCorrection(<NONE>);
       );
 );

private TTWAlgo: () ==> ()
TTWAlgo() ==
 (if (incTempCnt >= OVERSHOOT_CNT)
  then (HA`ThermNode.SetCorrection(<INC>);
        incTempCnt := 0;
       )
  else if (decTempCnt >= OVERSHOOT_CNT)
  then (HA`ThermNode.SetCorrection(<DEC>);
        decTempCnt := 0;
       )
  else (HA`WinNode.SetCorrection(<CLOSE>);
        HA`ThermNode.SetCorrection(<NONE>);
       );
 );

private TTAlgo: () ==> ()
TTAlgo() ==
 (if (incTempCnt >= OVERSHOOT_CNT)
  then (HA`ThermNode.SetCorrection(<INC>);
        incTempCnt := 0;
       )
  else if (decTempCnt >= OVERSHOOT_CNT)
  then (HA`ThermNode.SetCorrection(<DEC>);
        decTempCnt := 0;
       )
  else (HA`ThermNode.SetCorrection(<NONE>);
       );
 );

private TWAlgo: () ==> ()
TWAlgo() ==
 (if (decTempCnt >= OVERSHOOT_CNT)
  then (HA`WinNode.SetCorrection(<OPEN>);
        decTempCnt := 0;
       )
  else if (decHumidCnt >= OVERSHOOT_CNT)
  then (HA`WinNode.SetCorrection(<OPEN>);
        decHumidCnt := 0;
       )
  else (HA`WinNode.SetCorrection(<CLOSE>);
       );
 );

private HWAlgo: () ==> ()
HWAlgo() ==
 (if (decHumidCnt >= OVERSHOOT_CNT)
  then (HA`WinNode.SetCorrection(<OPEN>);
        decHumidCnt := 0;
       );
 );

private UpdateAlgorithm: () ==> ()
UpdateAlgorithm() ==
 (if (rng NodeList = {})
  then Algo := <NONE>
  elseif (rng NodeList = {<TEMPSENSOR>, <HUMIDSENSOR>, <THERMOSTAT>, <WINDOW>})
  then Algo := <THTW>
  elseif (rng NodeList = {<TEMPSENSOR>, <THERMOSTAT>, <WINDOW>})
  then Algo := <TTW>
  elseif (rng NodeList = {<TEMPSENSOR>, <THERMOSTAT>})
  then Algo := <TT>
  elseif (rng NodeList = {<TEMPSENSOR>, <WINDOW>})
  then Algo := <TW>
  elseif (rng NodeList = {<HUMIDSENSOR>, <WINDOW>})
  then Algo := <HW>
  else Algo := <NONE>;
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
  UpdateAlgorithm();
 )
pre id in set dom NodeList
post card(dom NodeList) = card(dom NodeList~) - 1;

private PeriodicOp: () ==> ()
PeriodicOp() ==
 (UpdateValues();
  Algorithm();
 );

public IsFinished: () ==> ()
IsFinished() == 
  skip;

public Finish: () ==> ()
Finish() == 
  finished := true;

sync
  mutex(AddNode,RemoveNode);
  per IsFinished => finished;

--
-- Thread definition section
--
thread

-- period of thread (period, jitter, delay, offset)
periodic(1000E6,0,0,0) (PeriodicOp)

end HostController
~~~
{% endraw %}

### Sensor.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		20/4 - 2008
-- Updated:
-- Description: 	Sensor superclass for HomeAutomation project
-----------------------------------------------

--
-- class definition
--
class Sensor

--
-- instance variables
--
instance variables

  protected ID    : nat;
  protected Type  : NetworkTypes`nodeType;
  protected Value : int;

--
-- Operations definition section
--
operations

public GetID: () ==> nat
GetID() ==
  return ID;

public GetType: () ==> NetworkTypes`nodeType
GetType() ==
  return Type;

public ReadValue: () ==> int
ReadValue() ==
  --cycles (1E3)
  return Value;

public Step: () ==> ()
Step() ==
  is subclass responsibility

end Sensor
~~~
{% endraw %}

### World.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		20/4 - 2008
-- Updated:	
-- Description: 	World class in the HomeAutomation project
-----------------------------------------------

--
-- class definition
--
class World

--
-- instance variables
--
instance variables

  public static env : [Environment] := nil;

--
-- Operations definition section
--
operations
 
public World: () ==> World
World() ==
 (env := new Environment("scenario.txt");
  HA`Host.AddNode(HA`TempNode.GetID(),HA`TempNode.GetType());
  HA`Host.AddNode(HA`HumidNode.GetID(),HA`HumidNode.GetType());
  HA`Host.AddNode(HA`ThermNode.GetID(),HA`ThermNode.GetType());
  HA`Host.AddNode(HA`WinNode.GetID(),HA`WinNode.GetType());

  start(HA`TempNode);
  start(HA`HumidNode);
  start(HA`ThermNode);
  start(HA`WinNode);
  start(HA`Host);
 );

public Run: () ==> ()
Run() ==
 (-- start environment creating input
  start(env);
  -- wait til environment has finished creating input
  env.IsFinished();
  -- kill HostController thread
  --HA`Host.Finish();
 );

end World
~~~
{% endraw %}

### NetworkTypes.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		15/4 - 2008
-- Updated:
-- Description: 	NetworkTypes class for NetworkModel project
-----------------------------------------------

--
-- class definition
--
class NetworkTypes

--
-- Types definition section
--
types   

public nodeType   = <TEMPSENSOR> | <HUMIDSENSOR> | <WINDOW> | <THERMOSTAT> | <HOSTCONTROL> | <NONE>;
public correction = <INC> | <DEC> | <OPEN> | <CLOSE> | <NONE>;

end NetworkTypes
~~~
{% endraw %}

### Actuator.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		21/4 - 2008
-- Updated:
-- Description: 	Actuator super class
-----------------------------------------------

--
-- class definition
--
class Actuator

--
-- instance variables
--
instance variables

  protected ID   : nat;
  protected Type : NetworkTypes`nodeType;
  protected Corr : NetworkTypes`correction;

--
-- Operations definition section
--
operations

public GetID: () ==> nat
GetID() ==
  return ID;

public GetType: () ==> NetworkTypes`nodeType
GetType() ==
  return Type;

public Step: () ==> ()
Step() ==
  is subclass responsibility

end Actuator
~~~
{% endraw %}

### HomeAutomation.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolf - 20022462
-- Created:		20/4 - 2008
-- Updated:
-- Description: 	System class in the HomeAutomation project
-----------------------------------------------

--
-- class definition
--
system HA

-- 
-- instance variables
--
instance variables

  -- cpu for host controller
  cpu1 : CPU := new CPU(<FCFS>, 1E6);
  -- cpu for sensors
  cpu2 : CPU := new CPU(<FCFS>, 1E6);
  cpu5 : CPU := new CPU(<FCFS>, 1E6);
  -- cpu for actuators
  cpu3 : CPU := new CPU(<FCFS>, 1E6);
  cpu4 : CPU := new CPU(<FCFS>, 1E6);

  -- bus connecting host controller and sensors
  bus1 : BUS := new BUS(<FCFS>, 1E3, {cpu1, cpu2, cpu3, cpu4, cpu5 });

  public static Host      : HostController := new HostController(20, 75);
  public static TempNode  : TemperatureSensor := new TemperatureSensor(1, <TEMPSENSOR>, 20);
  public static HumidNode : HumidSensor := new HumidSensor(2, <HUMIDSENSOR>, 75);
  public static ThermNode : Thermostat := new Thermostat(3, <THERMOSTAT>);
  public static WinNode   : Window := new Window(4, <WINDOW>);

--
-- Operations definition section
--
operations

public HA: () ==> HA
HA() ==
 (cpu1.deploy(Host);
  cpu2.deploy(TempNode);
  cpu5.deploy(HumidNode);
  cpu3.deploy(ThermNode);
  cpu4.deploy(WinNode); 
 );

end HA
~~~
{% endraw %}

### TemperatureSensor.vdmrt

{% raw %}
~~~
-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		20/4 - 2008
-- Updated:
-- Description: 	TemperatureSensor subclass for HomeAutomation project
-----------------------------------------------

--
-- class definition
--
class TemperatureSensor is subclass of Sensor

--
-- instance variables
--
instance variables

  finished : bool := false;

--
-- Operations definition section
--
operations

public TemperatureSensor: nat * NetworkTypes`nodeType * int ==> TemperatureSensor
TemperatureSensor (id, type, val) ==
 (ID := id;
  Type := type;
  Value := val;
 );

public Step: () ==> ()
Step() ==
  --cycles(1E3)
  Value := World`env.ReadTemp();

public IsFinished: () ==> ()
IsFinished() ==
  skip;

sync
  --mutex(PeriodicOp); -- ADDED
  per IsFinished => finished;

--
-- Thread definition section
--
thread

-- period of thread (period, jitter, delay, offset)
periodic(1000E6,0,0,0) (Step)

end TemperatureSensor
~~~
{% endraw %}

