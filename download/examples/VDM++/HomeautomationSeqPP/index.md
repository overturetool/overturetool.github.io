---
layout: default
title: HomeautomationSeqPP
---

## HomeautomationSeqPP
Author: Sune Wolff


This is a sequential VDM++ version of a home automation example constructed
by Sune Wolff. 

More information can be found in:
Peter Gorm Larsen, John Fitzgerald and Sune Wolff, Methods for the Development 
of Distributed Real-Time Embedded Systems Using VDM, International Journal of 
Software and Informatics, Vol 3., No 2-3, June/September 2009, pp. 305-341. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new TestComplete().Execute()|


### Actuator.vdmpp

{% raw %}
~~~
--The Actuator Class

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

protected ID	: nat;
protected Type	: NetworkTypes`nodeType;
protected Corr	: NetworkTypes`correction;
protected Env	: Environment;

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

### Environment.vdmpp

{% raw %}
~~~
--The Environment Class

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

private envTemp		: nat;
private envHumid	: nat;

private ha       : HA;
private io       : IO := new IO();
private inlines	 : seq of inline := [];
private simtime	 : nat;

private finished : bool := false;

--
-- Types definition section
--
types

-- Input file: Temp, Humid, Time
public inline	= nat * nat * nat;

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
     );
  
    ha := new HA();
    envTemp := 20;
    envHumid := 85;
   );
   
public Run: () ==> ()
Run () == 
 (while not isFinished() do
    (CreateSignal();
     -- step rest of model
     HA`Host.Step();
     World`timerRef.StepTime();
    );
 );

private CreateSignal: () ==> ()
CreateSignal() ==
 (if len inlines > 0
  then (dcl curtime : nat := World`timerRef.GetTime();
  def mk_ (temp, humid, time) = hd inlines 
  in
   (if time <= curtime
    then (SetTemp(temp);
          SetHumid(humid);
          IO`print("\n\nNew env values set");
          IO`print("\nAt time: ");
          IO`print(time);
          inlines := tl inlines;
          return
         );
   );
  )
  else (finished := true;
        return
       );
 );	

public ReadTemp: () ==> nat
	ReadTemp() ==
		return envTemp;

public IncTemp: () ==> ()
	IncTemp() ==
		envTemp := envTemp + 1;

public DecTemp: () ==> ()
	DecTemp() ==
		envTemp := envTemp - 1;

public SetTemp: nat ==> ()
	SetTemp(t) ==
		envTemp := t;

public ReadHumid: () ==> nat
	ReadHumid() ==
		return envHumid;

public IncHumid: () ==> ()
	IncHumid() ==
		envHumid := envHumid + 1;

public DecHumid: () ==> ()
	DecHumid() ==
		envHumid := envHumid - 1;

public SetHumid: nat ==> ()
	SetHumid(h) ==
		envHumid := h;

public isFinished : () ==> bool
isFinished () == 
  return inlines = [] and finished;

end Environment
~~~
{% endraw %}

### HomeAutomation.vdmpp

{% raw %}
~~~
--The HA Class

-----------------------------------------------
-- Author:		Sune Wolf - 20022462
-- Created:		20/4 - 2008
-- Updated:
-- Description: 	System class in the HomeAutomation project
-----------------------------------------------

--
-- class definition
--
class HA

--
-- instance variables
--
instance variables

public static Host	: HostController := new HostController(22, 75);
public static TempNode	: TemperatureSensor := new TemperatureSensor(1, <TEMPSENSOR>, 0);
public static HumidNode	: HumidSensor := new HumidSensor(2, <HUMIDSENSOR>, 0);
public static ThermNode	: Thermostat := new Thermostat(3, <THERMOSTAT>);
public static WinNode	: Window := new Window(4, <WINDOW>);

--
-- Types definition section
--
types   

--
-- Operations definition section
--
operations

public HA: () ==> HA
	HA() ==
		(Host.AddNode(TempNode.GetID(), TempNode.GetType());
		Host.AddNode(HumidNode.GetID(), HumidNode.GetType());
		Host.AddNode(ThermNode.GetID(), ThermNode.GetType());
		Host.AddNode(WinNode.GetID(), WinNode.GetType());
		);

--
-- Functions definition section
--
functions

--
-- Values definition section
--
values

end HA
~~~
{% endraw %}

### HostController.vdmpp

{% raw %}
~~~
--The HostController Class

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

--
-- instance variables
--
instance variables

private finished	: bool := false;
private print		: bool := true;

private TargetTemp	: nat;
private Temp		: nat := 0;
private TargetHumid	: nat;
private Humid		: nat := 0;

private NodeList	: map nat to NetworkTypes`nodeType := { |-> };
private Algo		: algType := <NONE>;

--
-- Types definition section
--
types   

public algType	= <THTW> | <TTW> | <TT> | <TW> | <HW> | <NONE>;

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
		(for all r in set rng NodeList do
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
		(cases Algo:
			<THTW>		-> THTWAlgo(),
			<TTW>		-> TTWAlgo(),
			<TT>		-> TTAlgo(),
			<TW>		-> TWAlgo(),
			<HW>		-> HWAlgo(),
			<NONE>		-> return
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
			then (TargetReachedPrint(World`timerRef.GetTime());
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
			then (TargetReachedPrint(World`timerRef.GetTime());
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
		then (HA`ThermNode.SetCorrection(<INC>);
		print := true;
		)
		else (HA`ThermNode.SetCorrection(<NONE>);
			if print
			then (TargetReachedPrint(World`timerRef.GetTime());
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
			then (TargetReachedPrint(World`timerRef.GetTime());
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
			then (TargetReachedPrint(World`timerRef.GetTime());
				);
			print := false;
			);
		);

private TargetReachedPrint: nat ==> ()
TargetReachedPrint(t) ==
 (IO`print("\nTarget values reached");
  IO`print("\nAt time: ");
  IO`print(t);  
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

public Step: () ==> ()
Step() ==
 (HA`TempNode.Step();
  HA`HumidNode.Step();
  UpdateValues();
  Algorithm();
  HA`WinNode.Step();
  HA`ThermNode.Step();
 );

end HostController
~~~
{% endraw %}

### HumidSensor.vdmpp

{% raw %}
~~~
--The HumidSensor Class

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
	Step() ==
		(Value := World`env.ReadHumid();
		);

end HumidSensor
~~~
{% endraw %}

### NetworkTypes.vdmpp

{% raw %}
~~~
--The NetworkTypes Class

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
-- instance variables
--
instance variables

--
-- Types definition section
--
types   

public nodeType 	= <TEMPSENSOR> | <HUMIDSENSOR> | <WINDOW> | <THERMOSTAT> | <HOSTCONTROL> | <NONE>;
public correction = <INC> | <DEC> | <OPEN> | <CLOSE> | <NONE>;

--
-- Operations definition section
--
operations

--
-- Functions definition section
--
functions

--
-- Values definition section
--
values

end NetworkTypes
~~~
{% endraw %}

### Sensor.vdmpp

{% raw %}
~~~
--The Sensor Class

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

protected ID	: nat;
protected Type	: NetworkTypes`nodeType;
protected Value	: nat;
protected Env	: Environment;

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

public ReadValue: () ==> nat
	ReadValue() ==
		return Value;

public Step: () ==> ()
	Step() ==
		is subclass responsibility

end Sensor
~~~
{% endraw %}

### Surroundings.vdmpp

{% raw %}
~~~
--The Surroundings Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		21/4 - 2008
-- Updated:
-- Description: 	Class containing surrounding variables
-----------------------------------------------

--
-- class definition
--
class Surroundings

--
-- instance variables
--
instance variables

private envTemp	: nat;
private envHumid	: nat;

--
-- Operations definition section
--
operations

public Surroundings: () ==> Surroundings
	Surroundings() ==
		(envTemp := 20;
		envHumid := 85;
		);

public ReadTemp: () ==> nat
	ReadTemp() ==
		return envTemp;

public IncTemp: () ==> ()
	IncTemp() ==
		envTemp := envTemp + 1;

public DecTemp: () ==> ()
	DecTemp() ==
		envTemp := envTemp - 1;

public SetTemp: nat ==> ()
	SetTemp(t) ==
		envTemp := t;

public ReadHumid: () ==> nat
	ReadHumid() ==
		return envHumid;

public IncHumid: () ==> ()
	IncHumid() ==
		envHumid := envHumid + 1;

public DecHumid: () ==> ()
	DecHumid() ==
		envHumid := envHumid - 1;

public SetHumid: nat ==> ()
	SetHumid(h) ==
		envHumid := h;

end Surroundings
~~~
{% endraw %}

### TemperatureSensor.vdmpp

{% raw %}
~~~
--The TemperatureSensor Class

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
-- Operations definition section
--
operations

public TemperatureSensor: nat * NetworkTypes`nodeType * nat ==> TemperatureSensor
	TemperatureSensor (id, type, val) ==
		(ID := id;
		Type := type;
		Value := val;
		);

public Step: () ==> ()
	Step() ==
		(Value := World`env.ReadTemp();
		);

end TemperatureSensor
~~~
{% endraw %}

### Test.vdmpp

{% raw %}
~~~
--The Test Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		14/5 - 2008
-- Updated:
-- Description: 	Test class
-----------------------------------------------

--
-- class definition
--
class Test

--
-- Operations definition section
--
operations

public Run: TestResult ==> ()
	Run(-) == is subclass responsibility

end Test
~~~
{% endraw %}

### TestActuator.vdmpp

{% raw %}
~~~
--The TestActuator Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		14/5 - 2008
-- Updated:
-- Description: 	Testing all actuator classes
-----------------------------------------------

--
-- class definition
--
class TestActuator is subclass of TestCase

--
-- instance variables
--
instance variables

win 		: Window;
therm		: Thermostat;

--
-- Operations definition section
--
operations

public TestActuator: seq of char ==> TestActuator
	TestActuator(nm) == name := nm;

protected SetUp: () ==> ()
	SetUp() ==
	(win := new Window(3, <WINDOW>);
therm := new Thermostat(4, <THERMOSTAT>);
	);

protected Test: () ==> ()
	Test() ==
		(AssertTrue(win.GetID() = 3);
		AssertTrue(win.GetType() = <WINDOW>);

		AssertTrue(therm.GetID() = 4);
		AssertTrue(therm.GetType() = <THERMOSTAT>);
		);

protected RunTest: () ==> ()
	RunTest() == Test();

protected TearDown: () ==> ()
	TearDown() == skip;

end TestActuator
~~~
{% endraw %}

### TestCase.vdmpp

{% raw %}
~~~
--The TestCase Class

-----------------------------------------------
-- Author:
-- Created:
-- Updated:
-- Description: 
-----------------------------------------------

--
-- class definition
--
class TestCase is subclass of Test

--
-- instance variables
--
instance variables

protected name : seq of char

--
-- Operations definition section
--
operations

public TestCase: seq of char ==> TestCase
	TestCase(nm) == name := nm;

public GetName: () ==> seq of char
	GetName() == return name;

protected AssertTrue: bool ==> ()
	AssertTrue(pb) == if not pb then exit <FAILURE>;

protected AssertFalse: bool ==> ()
	AssertFalse(pb) == if pb then exit <FAILURE>;

public Run: TestResult ==> ()
	Run(ptr) ==
		trap <FAILURE>
			with 
				ptr.AddFailure(self)
			in
				(SetUp();
				RunTest();
				TearDown();
				);

protected SetUp: () ==> ()
	SetUp() == is subclass responsibility;

protected RunTest: () ==> ()
	RunTest() == is subclass responsibility;

protected TearDown: () ==> ()
	TearDown() == is subclass responsibility;

end TestCase
~~~
{% endraw %}

### TestComplete.vdmpp

{% raw %}
~~~
--The TestComplete Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		14/5 - 2008
-- Updated:
-- Description: 	Runs all test cases
-----------------------------------------------

--
-- class definition
--
class TestComplete

--
-- Operations definition section
--
operations

public Execute: () ==> ()
	Execute() ==
		(dcl ts : TestSuite := new TestSuite();
--		ts.AddTest(new TestSurroundings("TestSurroundings"));
		ts.AddTest(new TestSensor("TestSensor"));
		ts.AddTest(new TestActuator("TestActuator"));
		ts.AddTest(new TestHostController("TestHC"));
		ts.Run();
		);

end TestComplete
~~~
{% endraw %}

### TestHostController.vdmpp

{% raw %}
~~~
--The TestHostController Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		14/5 - 2008
-- Updated:
-- Description: 	Testing the HostController class
-----------------------------------------------

--
-- class definition
--
class TestHostController is subclass of TestCase

--
-- instance variables
--
instance variables

--env		: Environment;
world		: World;
host		: HostController;
tempSensor 	: TemperatureSensor;
humidSensor	: HumidSensor;
win 		: Window;
therm		: Thermostat;

--
-- Operations definition section
--
operations

public TestHostController: seq of char ==> TestHostController
	TestHostController(nm) == name := nm;

protected SetUp: () ==> ()
	SetUp() ==
	(--env := new Environment();
	world := new World();
	host := new HostController(23, 78);
--	tempSensor := new TemperatureSensor(1, <TEMPSENSOR>, 0);
--	humidSensor := new HumidSensor(2, <HUMIDSENSOR>, 0);
--	win := new Window(3, <WINDOW>);
--	therm := new Thermostat(4, <THERMOSTAT>);
	);

protected Test: () ==> ()
	Test() ==
	(
--	AssertTrue(HA`Host.GetAlgo() = <NONE>);

--	HA`Host.AddNode(HA`TempNode.GetID(),HA`TempNode.GetType());
--	AssertTrue(HA`Host.GetAlgo() = <NONE>);

--	HA`Host.AddNode(HA`WinNode.GetID(),HA`WinNode.GetType());
--	AssertTrue(HA`Host.GetAlgo() = <TW>);
	
--	HA`TempNode.Step();
--	AssertTrue(HA`TempNode.ReadValue() = 20);

--	HA`Host.UpdateValues();
--	AssertTrue(HA`Host.GetTemp() = 20);
--	AssertTrue(HA`Host.GetHumid() = 0);

--	HA`Host.Algorithm();
--	AssertTrue(HA`WinNode.GetCorrection() = <CLOSE>);

-- ****************************************************
--	HA`Host.AddNode(HA`ThermNode.GetID(),HA`ThermNode.GetType());
--	AssertTrue(HA`Host.GetAlgo() = <TTW>);
	
--	HA`TempNode.Step();
--	AssertTrue(HA`TempNode.ReadValue() = 20);

--	HA`Host.UpdateValues();
--	AssertTrue(HA`Host.GetTemp() = 20);
--	AssertTrue(HA`Host.GetHumid() = 0);

--	HA`Host.Algorithm();
--	AssertTrue(HA`WinNode.GetCorrection() = <CLOSE>);
--	AssertTrue(HA`ThermNode.GetCorrection() = <INC>);

-- ****************************************************
--	HA`Host.AddNode(HA`HumidNode.GetID(),HA`HumidNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <THTW>);
	
	HA`TempNode.Step();
	HA`HumidNode.Step();
	AssertTrue(HA`TempNode.ReadValue() = 20);
	AssertTrue(HA`HumidNode.ReadValue()= 85);

	HA`Host.UpdateValues();
	AssertTrue(HA`Host.GetTemp() = 20);
	AssertTrue(HA`Host.GetHumid() = 85);

	HA`Host.Algorithm();
	AssertTrue(HA`WinNode.GetCorrection() = <OPEN>);
	AssertTrue(HA`ThermNode.GetCorrection() = <NONE>);

-- ****************************************************
	HA`Host.RemoveNode(HA`HumidNode.GetID(),HA`HumidNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <TTW>);	

	HA`TempNode.Step();
	AssertTrue(HA`TempNode.ReadValue() = 20);

	HA`Host.UpdateValues();
	AssertTrue(HA`Host.GetTemp() = 20);

	HA`Host.Algorithm();
	AssertTrue(HA`WinNode.GetCorrection() = <CLOSE>);
	AssertTrue(HA`ThermNode.GetCorrection() = <INC>);

-- ****************************************************
	HA`Host.RemoveNode(HA`WinNode.GetID(),HA`WinNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <TT>);

	HA`TempNode.Step();
	AssertTrue(HA`TempNode.ReadValue() = 20);

	HA`Host.UpdateValues();
	AssertTrue(HA`Host.GetTemp() = 20);

	HA`Host.Algorithm();
	AssertTrue(HA`ThermNode.GetCorrection() = <INC>);

-- ****************************************************
	HA`Host.RemoveNode(HA`TempNode.GetID(),HA`TempNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <NONE>);

	HA`Host.RemoveNode(HA`ThermNode.GetID(),HA`ThermNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <NONE>);

	HA`Host.AddNode(HA`WinNode.GetID(),HA`WinNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <NONE>);
	
	HA`Host.AddNode(HA`HumidNode.GetID(),HA`HumidNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <HW>);

	HA`HumidNode.Step();
	AssertTrue(HA`HumidNode.ReadValue() = 85);

	HA`Host.UpdateValues();
	AssertTrue(HA`Host.GetHumid() = 85);

	HA`Host.Algorithm();
	AssertTrue(HA`WinNode.GetCorrection() = <OPEN>);

-- ****************************************************
	HA`Host.RemoveNode(HA`HumidNode.GetID(),HA`HumidNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <NONE>);

	HA`Host.AddNode(HA`TempNode.GetID(),HA`TempNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <TW>);

	HA`TempNode.Step();
	AssertTrue(HA`TempNode.ReadValue() = 20);

	HA`Host.UpdateValues();
	AssertTrue(HA`Host.GetTemp() = 20);

	HA`Host.Algorithm();
	AssertTrue(HA`WinNode.GetCorrection() = <CLOSE>);

-- ****************************************************
	HA`Host.AddNode(HA`ThermNode.GetID(),HA`ThermNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <TTW>);

	HA`Host.AddNode(HA`HumidNode.GetID(),HA`HumidNode.GetType());
	AssertTrue(HA`Host.GetAlgo() = <THTW>);
	);

protected RunTest: () ==> ()
	RunTest() == Test();

protected TearDown: () ==> ()
	TearDown() == skip;

end TestHostController
~~~
{% endraw %}

### TestResult.vdmpp

{% raw %}
~~~
--The TestResult Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		14/5 - 2008
-- Updated:
-- Description: 	TestResult class
-----------------------------------------------

--
-- class definition
--
class TestResult

--
-- instance variables
--
instance variables

failures : seq of TestCase := []

--
-- Operations definition section
--
operations

public AddFailure: TestCase ==> ()
	AddFailure(ptst) == failures := failures ^ [ptst];

public Print: seq of char ==> ()
	Print(pstr) ==
		def - = new IO().echo(pstr ^ "\n") in skip;

public Show: () ==> ()
	Show() ==
		if failures = [] then
			Print("No failures detected")
		else 
			for failure in failures do
				Print(failure.GetName() ^ " failed");

end TestResult
~~~
{% endraw %}

### TestSensor.vdmpp

{% raw %}
~~~
--The TestSensor Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		14/5 - 2008
-- Updated:
-- Description: 	Test class to test Sensors
-----------------------------------------------

--
-- class definition
--
class TestSensor is subclass of TestCase

--
-- instance variables
--
instance variables

tempSensor 	: TemperatureSensor;
humidSensor	: HumidSensor;

--
-- Operations definition section
--
operations

public TestSensor: seq of char ==> TestSensor
	TestSensor(nm) == name := nm;

protected SetUp: () ==> ()
	SetUp() ==
	(tempSensor := new TemperatureSensor(1, <TEMPSENSOR>, 0);
humidSensor := new HumidSensor(2, <HUMIDSENSOR>, 0);
	);

protected Test: () ==> ()
	Test() ==
		(AssertTrue(tempSensor.GetID() = 1);
		AssertTrue(tempSensor.GetType() = <TEMPSENSOR>);
		AssertTrue(tempSensor.ReadValue() = 0);

		AssertTrue(humidSensor.GetID() = 2);
		AssertTrue(humidSensor.GetType() = <HUMIDSENSOR>);
		AssertTrue(humidSensor.ReadValue() = 0);		
		);

protected RunTest: () ==> ()
	RunTest() == Test();

protected TearDown: () ==> ()
	TearDown() == skip;


end TestSensor
~~~
{% endraw %}

### TestSuite.vdmpp

{% raw %}
~~~
--The TestSuite Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		14/5 - 2008
-- Updated:
-- Description: 	TestSuite class
-----------------------------------------------

--
-- class definition
--
class TestSuite is subclass of Test

--
-- instance variables
--
instance variables

tests : seq of Test := [];

--
-- Operations definition section
--
operations

public Run: () ==> ()
	Run () ==
		(dcl ntr : TestResult := new TestResult();
		Run(ntr);
		ntr.Show();
		);

public Run: TestResult ==> ()
	Run(result) ==
		for test in tests do
			test.Run(result);

public AddTest: Test ==> ()
	AddTest(test) ==
		tests := tests ^ [test];

end TestSuite
~~~
{% endraw %}

### TestSurroundings.vdmpp

{% raw %}
~~~
--The TestSurroundings Class

-----------------------------------------------
-- Author:		Sune Wolff - 20022462
-- Created:		14/5 - 2008
-- Updated:
-- Description: 	Testing the Surroundings class
-----------------------------------------------

--
-- class definition
--
class TestSurroundings is subclass of TestCase

--
-- instance variables
--
instance variables

env		: Environment;

--
-- Operations definition section
--
operations

public TestSurroundings: seq of char ==> TestSurroundings
	TestSurroundings(nm) == name := nm;

protected SetUp: () ==> ()
	SetUp() ==
env := new Environment();

protected Test: () ==> ()
	Test() ==
		(AssertTrue(env.ReadTemp() = 20);
		AssertTrue(env.ReadHumid() = 85);

		env.IncTemp();
		AssertTrue(env.ReadTemp() = 21);
		env.DecTemp();
		AssertTrue(env.ReadTemp() = 20);		
		env.SetTemp(23);
		AssertTrue(env.ReadTemp() = 23);

		env.IncHumid();
		AssertTrue(env.ReadHumid() = 86);
		env.DecHumid();
		AssertTrue(env.ReadHumid() = 85);		
		env.SetHumid(71);
		AssertTrue(env.ReadHumid() = 71);
		);

protected RunTest: () ==> ()
	RunTest() == Test();

protected TearDown: () ==> ()
	TearDown() == skip;

end TestSurroundings
~~~
{% endraw %}

### Thermostat.vdmpp

{% raw %}
~~~
--The Thermostat Class

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
-- Operations definition section
--
operations

public Thermostat: nat * NetworkTypes`nodeType ==> Thermostat
	Thermostat (id, type) ==
		(ID := id;
		Type := type;
		Corr := <NONE>;
		);

public Step: () ==> ()
	Step() ==
		(if (Corr = <INC>)
		then World`env.IncTemp()
		elseif (Corr = <DEC>)
		then World`env.DecTemp();
		);

public SetCorrection: NetworkTypes`correction ==> ()
	SetCorrection(cor) ==
		Corr := cor
pre (cor = <INC>) or (cor = <DEC>) or (cor = <NONE>);

public GetCorrection: () ==> NetworkTypes`correction
	GetCorrection() ==
		return Corr;

end Thermostat
~~~
{% endraw %}

### timer.vdmpp

{% raw %}
~~~
              
class Timer

instance variables

currentTime : nat := 0;

values

stepLength : nat = 10;

operations

public StepTime : () ==> ()
StepTime() ==
  currentTime := currentTime + stepLength;

public GetTime : () ==> nat
GetTime() ==
  return currentTime;

end Timer
                                                                         
~~~
{% endraw %}

### Window.vdmpp

{% raw %}
~~~
--The Window Class

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
		(if (Corr = <OPEN>)
		then (World`env.DecHumid();
		      World`env.DecTemp();
			);
		);

public SetCorrection: NetworkTypes`correction ==> ()
	SetCorrection(cor) ==
		Corr := cor
pre (cor = <OPEN>) or (cor = <CLOSE>);

public GetCorrection: () ==> NetworkTypes`correction
	GetCorrection() ==
		return Corr;

end Window
~~~
{% endraw %}

### World.vdmpp

{% raw %}
~~~
--The World Class

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

instance variables

static public env : Environment := new Environment("scenario.txt");
static public timerRef : Timer := new Timer();
  
operations

public Run: () ==> ()
Run() ==
 (-- start environment creating input
  env.Run();
 );

end World
~~~
{% endraw %}

