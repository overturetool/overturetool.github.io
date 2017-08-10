---
layout: default
title: VeMoRT
---

## VeMoRT
Author: Claus Ballegaard Nielsen


This example was used in the MSc thesis for Claus Ballegaard
Nielsen in order to illustrate how dynamic deployment with advantage 
could be added to VDM-RT.

More information can be found in:
Nielsen, C.B.: Dynamic Reconfiguration of Distributed Systems in VDM-RT. 
Master's thesis, Aarhus University (December 2010).
 

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
    -- include IO.vpp from the VDMTools distribution (stdlib directory)
    -- if you are getting a type error while checking this specification
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

### Vehicle.vdmrt

{% raw %}
~~~
                                       
-----------------------------------------------
-- Class:			Vehicle
-- Description: 	Vehicle class describes the physical moving 
--					elements in the system
-----------------------------------------------

--
-- class definition
--
class Vehicle

--
-- instance variables
--
instance variables

private dir: Types`Direction;
private speed : nat;
private lowgrip : bool;
private turnIndicator : Indicator := <NONE>;
private pos : Position;
private id : nat;
--
-- Types definition section
--
types  
public Indicator = <LEFT> | <RIGHT> | <NONE>;
--
-- Operations definition section
--
operations

public Vehicle:  nat * Position * nat * Types`Direction ==> Vehicle
Vehicle(identifier, p, s, d) ==
(
  pos := p;
  speed := s;
  dir := d;
  id := identifier;
  lowgrip := false;
);


public Vehicle:  VehicleData ==> Vehicle
Vehicle(vdDTO) ==
(
  pos := vdDTO.GetPosition();
  speed := vdDTO.GetSpeed();
  dir := vdDTO.GetDirection();
  id := vdDTO.GetID();
  lowgrip := vdDTO.getLowGrip();
);


pure public GetDirection: () ==> Types`Direction 
GetDirection() ==
return dir;

async public SetDirection: Types`Direction  ==> ()
SetDirection(d) ==
(
dir := d;
);

public GetSpeed: () ==> nat 
GetSpeed() ==
return speed;
	
async public SetSpeed: nat ==> () 
SetSpeed(s) ==
speed := s;

public getLowGrip: () ==> bool 
getLowGrip() ==
(
return lowgrip
);

async public setLowGrip: bool ==> () 
setLowGrip(lg) ==
(
lowgrip := lg;
);
	
public TurnIndicator: () ==> Indicator 
TurnIndicator() ==
return turnIndicator;	
	
async public setTurnIndicator: Indicator ==> () 
setTurnIndicator(indicator) ==
( 
 turnIndicator := indicator;
);
	
pure public GetPosition: () ==> Position 
GetPosition() ==
--return pos.deepCopy();
return pos;

async public SetPosition: Position ==> () 
SetPosition(p) ==
pos := p;

pure public GetID: () ==> nat
GetID() ==
return id;

public Move : () ==> ()
Move() ==
( 
 cases dir:
 <NORTH> -> pos.setY(pos.Y() + speed),  
 <SOUTH> -> pos.setY(pos.Y() - speed),  
 <EAST>  -> pos.setX(pos.X() + speed), 
 <WEST>  -> pos.setX(pos.X() - speed) 
 end;

 Printer`OutWithTS("Vehicle " ^ Printer`natToString(id) ^ " moved " 
    ^ Types`DirectionToString(dir)  ^ " to  " ^ pos.toString() ^ " with speed " 
    ^ Printer`natToString(speed));
);
  
public getDTO : () ==> VehicleData
getDTO() ==
(
 let vd = new VehicleData(id, pos.deepCopy(), speed, dir, lowgrip) in 
 return vd;
)
  
--
-- Functions definition section
--
functions
  
public static IndicatorToString : Indicator -> seq of char 
IndicatorToString(i) ==
(
cases i:
<LEFT>-> "LEFT",
<RIGHT>-> "RIGHT",
<NONE>-> "NONE"
end
)



--
-- Values definition section
--
values

--
-- sync definition section
--
sync
 mutex(Move);
 mutex(Move, SetPosition); --, GetPosition);
 mutex(SetPosition);
 mutex(SetDirection);
 --mutex(GetDirection, SetDirection);
 mutex(SetSpeed);
 mutex(GetSpeed, SetSpeed);
 mutex(setLowGrip);
 mutex(getLowGrip, setLowGrip);
 mutex(setTurnIndicator);
 mutex(TurnIndicator,setTurnIndicator);

end Vehicle


                                                                           
~~~
{% endraw %}

### TestTrafficData.vdmrt

{% raw %}
~~~
                                             
-----------------------------------------------
-- Class:			TestTrafficData
-- Description: 	Test the TrafficData class 
-----------------------------------------------

--
-- class definition
--
class TestTrafficData is subclass of TestCase

--
-- instance variables
--
instance variables
private pos : Position;
--
-- Operations definition section
--
operations
public TestTrafficData: seq of char ==> TestTrafficData
TestTrafficData(s) ==
(
	TestCase(s);
);

protected SetUp: () ==> ()
SetUp () == pos := new Position(5,1); 

protected RunTest: () ==> ()
RunTest () ==
(
 dcl td : TrafficData := new TrafficData(<Congestion>, pos, <NORTH>),
 td2 : TrafficData := new TrafficData(<LeftTurn>, pos, <WEST>),
 td3 : TrafficData := new TrafficData(<RedLight>, pos, <EAST>);

 AssertTrue(td.GetPosition().X() = 5);
 AssertTrue(td.GetPosition().Y() = 1); 
 AssertTrue(td.GetDirection() = <NORTH>);
 AssertTrue(td.GetMessage() = <Congestion>);
 AssertTrue(TrafficData`MessageTypeToString(td.GetMessage()) = "Congestion ");
 
 AssertTrue(td2.GetPosition().X() = 5);
 AssertTrue(td2.GetPosition().Y() = 1); 
 AssertTrue(td2.GetDirection() = <WEST>);
 AssertTrue(td2.GetMessage() = <LeftTurn>);
 AssertTrue(TrafficData`MessageTypeToString(td2.GetMessage()) = "Left Turn");
 
 AssertTrue(td3.GetPosition().X() = 5);
 AssertTrue(td3.GetPosition().Y() = 1); 
 AssertTrue(td3.GetDirection() = <EAST>);
 AssertTrue(td3.GetMessage() = <RedLight>);
 AssertTrue(TrafficData`MessageTypeToString(td3.GetMessage()) = "Red Light");
 
 testExpired();
);
  
protected TearDown: () ==> ()
TearDown () == skip;

public testExpired : () ==> ()
testExpired() ==
( 
  dcl td : TrafficData := new TrafficData(<LowGrip>, pos, <NORTH>);
  AssertFalse(td.Expired());
  duration(15000) --should depend on Config to ensure we are above threshold
  AssertFalse(td.Expired());
  duration(15000) --should depend on Config to ensure we are above threshold
  AssertTrue(td.Expired());
);

end TestTrafficData

                                                                                   
~~~
{% endraw %}

### TestPosition.vdmrt

{% raw %}
~~~
                                          
-----------------------------------------------
-- Class:			TestPosition
-- Description: 	Test the Position class 
-----------------------------------------------

--
-- class definition
--
class TestPosition is subclass of TestCase

--
-- instance variables
--
instance variables

--
-- Operations definition section
--
operations
public TestPosition: seq of char ==> TestPosition
TestPosition(s) ==
(
	TestCase(s);
);

protected SetUp: () ==> ()
SetUp () == skip;

protected RunTest: () ==> ()
RunTest () ==
(
 dcl pos : Position := new Position(2, 1);

 AssertTrue(pos.X() = 2);
 AssertTrue(pos.Y() = 1); 

 pos.setX(10);
 AssertTrue(pos.X() = 10); 
 
 pos.setY(4);
 AssertTrue(pos.Y() = 4); 
 							 
 AssertTrue(pos.toString() = "position X: 10 Y: 4");
 
 testInRange();
 testDeepCopy();
 testCompare();
);
  
protected TearDown: () ==> ()
TearDown () == skip;


public testInRange : () ==> ()
testInRange() ==
(
 dcl p  : Position := new Position(0, 0),
 p2 : Position := new Position(1, 0);
 
  AssertTrue(p.inRange(p2 , 1));
  AssertFalse(p.inRange(p2, 0));
  p2.setY(4);
  p2.setX(4);
  AssertTrue(p.inRange(p2 , 5));
);


public testDeepCopy : () ==> ()
testDeepCopy() ==
(
 dcl p  : Position := new Position(5, 3),
 p2 : Position := p.deepCopy();
 
 AssertFalse(p = p2);
 AssertTrue(p.X() = p2.X());
 AssertTrue(p.Y() = p2.Y());
 p.setX(10);
 AssertTrue(p.X() <> p2.X());
);


public testCompare : () ==> ()
testCompare() ==
(
 dcl p  : Position := new Position(5, 3),
 p2 : Position := p.deepCopy();
 
 AssertTrue(Position`Compare(p,p2));
 AssertTrue(Position`Compare(p2,p));
 p.setX(10);
 AssertFalse(Position`Compare(p,p2));
);



end TestPosition

                                                                                
~~~
{% endraw %}

### World.vdmrt

{% raw %}
~~~
                                     
-----------------------------------------------
-- Class:			World
-- Description: 	World class in the VeMo project
-----------------------------------------------

--
-- class definition
--
class World

--
-- instance variables
--
instance variables

public static env : [Environment] := new Environment("inputvalues.txt");

--
-- Types definition section
--
types   

--
-- Operations definition section
--
operations

public World: () ==> World
World() ==
(
 Printer`OutAlways("Creating World");
 
 --vehicle
 VeMo`vemoCtrl.addController(VeMo`ctrl1);
 VeMo`vemoCtrl.addController(VeMo`ctrl2);
 --VeMo`vemoCtrl.addController(VeMo`ctrl3);
 --VeMo`vemoCtrl.addController(VeMo`ctrl4);
 --VeMo`vemoCtrl.addController(VeMo`ctrl5);
 --VeMo`vemoCtrl.addController(VeMo`ctrl6);
 --VeMo`vemoCtrl.addController(VeMo`ctrl7);
 --VeMo`vemoCtrl.addController(VeMo`ctrl8);  
 VeMo`vemoCtrl.addController(VeMo`ctrl9);
 --VeMo`vemoCtrl.addController(VeMo`ctrl10);
 --VeMo`vemoCtrl.addController(VeMo`ctrl11);
 --VeMo`vemoCtrl.addController(VeMo`ctrl12);
 --VeMo`vemoCtrl.addController(VeMo`ctrl13);
 --VeMo`vemoCtrl.addController(VeMo`ctrl14);
 
 
-- VeMo`vemoCtrl.addTrafficLight(VeMo`tl1);
 env.setVeMoCtrl(VeMo`vemoCtrl);

 Printer`OutAlways("World created: "  
				 ^ " Maybe this world is another planet's hell.");
 Printer`OutAlways("------------------------------------------\n");
);

public Run: () ==> ()
Run() == 
(
  env.run();
  env.isFinished();
  duration(1000)
  env.report();
  Printer`OutWithTS("End of this world");
);

public static Verbose : bool ==> ()
Verbose(v) == Printer`Echo(v);

--
-- Functions definition section
--
functions

--
-- Values definition section
--
values

end World


                                                                         
~~~
{% endraw %}

### Types.vdmrt

{% raw %}
~~~
                               
-----------------------------------------------
-- Class:			Types
-- Description: 	Defines simple types
-----------------------------------------------

--
-- class definition
--
class Types

types   
public Time = nat;
public Direction = <NORTH> | <SOUTH> | <EAST> | <WEST>;

public Event = VechicleRun | TrafficLightRun | VehicleUpdateSpeed 
			   | VehicleUpdatePosition | VehicleUpdateDirection 
			   | VehicleLowGrip | VehicleTurnIndication | WasteTime;

public VechicleRun ::
        ID : nat
        t : Time; 
        
public TrafficLightRun ::
        ID : nat
        t : Time; 
        
public VehicleUpdateSpeed ::
        ID : nat
        speed : real
        t : Time;     
        
public VehicleUpdatePosition ::
		ID : nat
   		posX : nat
        posY : nat
        t : Time;
        
public VehicleUpdateDirection ::
		ID : nat
		direction : Direction
        t : Time;

public VehicleLowGrip ::
        ID : nat
        lowGrip : bool
        t : Time;

public VehicleTurnIndication ::
        ID : nat
        turn : Vehicle`Indicator
        t : Time;
public WasteTime ::
        t : Time;
            
functions
  public static DirectionToString : Direction -> seq of char 
  DirectionToString(d) ==
  (
  	cases d:
  	<NORTH>-> "NORTH",
  	<SOUTH>-> "SOUTH",
  	<EAST>-> "EAST",
  	<WEST>-> "WEST"
  	end
  );
  
  public static DirectionToGraphics : Direction -> nat
  DirectionToGraphics(d) ==
  (
    cases d:
    <NORTH>-> 1,
    <SOUTH>-> 5,
    <EAST>->  3,
    <WEST>->  7
    end
  );
  
end Types


                                                                         
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

### Printer.vdmrt

{% raw %}
~~~
                                       
-----------------------------------------------
-- Class:			Printer
-- Description: 	Printes text seq via IO
-----------------------------------------------

--
-- class definition
--
class Printer

instance variables
  private static echo : bool := true


--
-- Operations definition section
--
operations

  public static Echo : bool ==> ()
  Echo(v) ==
  echo := v;

  public static OutAlways: seq of char ==> ()
  OutAlways (pstr) ==
    def - = new IO().echo(pstr ^ "\n") in skip;
    
  
  public static OutWithTS: seq of char ==> ()
  OutWithTS (pstr) ==
    def - = new IO().echo(Printer`natToString(time) 
    					  ^ ": " ^ pstr ^ "\n") 
    					  in skip;

  public static natToString : nat ==> seq of char 
  natToString(n) ==
  (
    return VDMUtil`val2seq_of_char[nat](n);
  );
  
  public static intToString : int ==> seq of char 
  intToString(i) ==
  (
    return VDMUtil`val2seq_of_char[int](i);
  );

sync
 mutex(OutWithTS)
  
end Printer

                                                                           
~~~
{% endraw %}

### TestVehicle.vdmrt

{% raw %}
~~~
                                         
-----------------------------------------------
-- Class:			TestVehicle
-- Description: 	Test the Vehicle class 
-----------------------------------------------

--
-- class definition
--
class TestVehicle is subclass of TestCase

--
-- instance variables
--
instance variables

private dir: Types`Direction;
private pos : Position;


--
-- Operations definition section
--
operations

public TestVehicle: seq of char ==> TestVehicle
TestVehicle(s) ==
(
	TestCase(s);
);


protected SetUp: () ==> ()
SetUp () == 
(
 dir := <EAST>; 
 pos := new Position(5,1);  
);

protected RunTest: () ==> ()
RunTest () ==
(
 dcl vec : Vehicle := new Vehicle(2, pos, 1, dir),
  	vec2 : Vehicle := new Vehicle(3, pos, 1, dir);

 AssertTrue(vec <> vec2);
 AssertTrue(vec.GetID() = 2);
 AssertTrue(vec2.GetID() = 3); 
 testGetDirection();
 testSetDirection();
 testGetSpeed();
 testSetSpeed();
 testgetLowGrip();
 testsetLowGrip();
 testTurnIndicator();
 testsetTurnIndicator();
 testGetPosition();
 testSetPosition();
 testStep();
);
  
protected TearDown: () ==> ()
TearDown () == skip;


protected initData : () ==> Vehicle
initData() ==
return new Vehicle(1, pos, 1, dir);


protected testGetDirection: () ==> ()
testGetDirection() ==
(
dcl v : Vehicle := initData();
AssertTrue(v.GetDirection() = <EAST>)
);

protected testSetDirection: ()  ==> ()
testSetDirection() ==
(
dcl v : Vehicle := initData();
v.SetDirection(<WEST>);
AssertTrue(v.GetDirection() = <WEST>)
);

protected testGetSpeed: () ==> () 
testGetSpeed() ==
(
dcl v : Vehicle := initData();
AssertTrue(v.GetSpeed() = 1)
);
	
protected testSetSpeed: () ==> () 
testSetSpeed() ==
(
dcl v : Vehicle := initData();
v.SetSpeed(10);
AssertTrue(v.GetSpeed() = 10)
);

protected testgetLowGrip: () ==> () 
testgetLowGrip() ==
(
dcl v : Vehicle := initData();
AssertFalse(v.getLowGrip())
);

protected testsetLowGrip: () ==> () 
testsetLowGrip() ==
(
dcl v : Vehicle := initData();
v.setLowGrip(true);
AssertTrue(v.getLowGrip());
v.setLowGrip(false);
AssertFalse(v.getLowGrip())
);
	
protected testTurnIndicator: () ==> () 
testTurnIndicator() ==
(
dcl v : Vehicle := initData();
AssertTrue(v.TurnIndicator() = <NONE>);
AssertTrue(Vehicle`IndicatorToString(<LEFT>) = "LEFT");
AssertTrue(Vehicle`IndicatorToString(<RIGHT>) = "RIGHT");
AssertTrue(Vehicle`IndicatorToString(<NONE>) = "NONE");
);	
	
protected testsetTurnIndicator: () ==> () 
testsetTurnIndicator() ==
(
dcl v : Vehicle := initData();
v.setTurnIndicator(<LEFT>);
AssertTrue(v.TurnIndicator() = <LEFT>);
);
	
protected testGetPosition: () ==> () 
testGetPosition() ==
(
dcl v : Vehicle := initData();
let p = v.GetPosition() in
 (
 AssertTrue(p.X() = 5);
 AssertTrue(p.Y() = 1);
 )
);

protected testSetPosition: () ==> () 
testSetPosition() ==
(
dcl v : Vehicle := initData();
 let newP = new Position(10, 1) in
 v.SetPosition(newP);
  let p = v.GetPosition() in
  (
  AssertTrue(p.X() = 10);
  AssertTrue(p.Y() = 1);
  )
);


protected testStep: () ==> ()
testStep() ==
(
dcl v : Vehicle := initData();
 let p = v.GetPosition() in
 (
 AssertTrue(p.X() = 5);
 AssertTrue(p.Y() = 1);
 );
 
 v.Move();
 AssertTrue(v.GetDirection() = <EAST>);
 AssertTrue(Types`DirectionToString(v.GetDirection()) = "EAST");
 let p = v.GetPosition() in
 (
 AssertTrue(p.X() = 6);
 AssertTrue(p.Y() = 1);
 );
 
 v.Move();
 let p = v.GetPosition() in
 (
 AssertTrue(p.X() = 7);
 AssertTrue(p.Y() = 1);
 );
 
 v.SetDirection(<NORTH>);
 AssertTrue(v.GetDirection() = <NORTH>);
 AssertTrue(Types`DirectionToString(v.GetDirection()) = "NORTH");
 v.Move();
 let p = v.GetPosition() in
 (
 AssertTrue(p.X() = 7);
 AssertTrue(p.Y() = 2);
 );
 
 v.SetDirection(<WEST>);
 AssertTrue(v.GetDirection() = <WEST>);
 AssertTrue(Types`DirectionToString(v.GetDirection()) = "WEST");
 v.Move();
 let p = v.GetPosition() in
 (
 AssertTrue(p.X() = 6);
 AssertTrue(p.Y() = 2);
 );
 
  
 v.SetDirection(<SOUTH>);
 AssertTrue(v.GetDirection() = <SOUTH>);
 AssertTrue(Types`DirectionToString(v.GetDirection()) = "SOUTH");
 v.Move();
 let p = v.GetPosition() in
 (
 AssertTrue(p.X() = 6);
 AssertTrue(p.Y() = 1);
 );
 
 
);

-- sequential model only
--protected testStep: () ==> ()
--testStep() ==
--(
--dcl v : Vehicle := initData();
-- let p = v.GetPosition() in
-- (
-- AssertTrue(p.X() = 5);
-- AssertTrue(p.Y() = 1);
-- );
-- 
-- v.Step();
-- AssertTrue(v.GetDirection() = <EAST>);
-- let p = v.GetPosition() in
-- (
-- AssertTrue(p.X() = 6);
-- AssertTrue(p.Y() = 1);
-- );
-- 
-- v.Step();
-- let p = v.GetPosition() in
-- (
-- AssertTrue(p.X() = 7);
-- AssertTrue(p.Y() = 1);
-- );
-- 
-- v.SetDirection(<NORTH>);
-- AssertTrue(v.GetDirection() = <NORTH>);
-- v.Step();
-- let p = v.GetPosition() in
-- (
-- AssertTrue(p.X() = 7);
-- AssertTrue(p.Y() = 2);
-- );
-- 
--);

end TestVehicle

                                                                               
~~~
{% endraw %}

### TestSuite.vdmrt

{% raw %}
~~~
              
class TestSuite
  is subclass of Test

instance variables
  tests : seq of Test := [];

types

public
  TestKinds = TestVehicle | TestPosition | TestTrafficLight | TestTrafficData |
              TestTraffic | TestController | TestVeMoController;
  
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

  public AddTest: TestKinds ==> ()
  AddTest(test) ==
    tests := tests ^ [test];

end TestSuite

                                                                               
~~~
{% endraw %}

### VehicleData.vdmrt

{% raw %}
~~~
                                           
-----------------------------------------------
-- Class:			Vehicle
-- Description: 	DTO representing the data in the Vehicle class
-----------------------------------------------

--
-- class definition
--
class VehicleData

--
-- instance variables
--
instance variables

private dir: Types`Direction;
private speed : nat;
private lowgrip : bool;
private turnIndicator : Indicator := <NONE>;
private pos : Position;
private id : nat;
--
-- Types definition section
--
types  
public Indicator = <LEFT> | <RIGHT> | <NONE>;
--
-- Operations definition section
--
operations

public VehicleData : nat * Position * nat * Types`Direction * bool 
	==> VehicleData
VehicleData(identifier, p, s, d, grip) ==
(
  pos := p;
  speed := s;
  dir := d;
  id := identifier;
  lowgrip := grip;
);

public GetDirection: () ==> Types`Direction 
GetDirection() ==
return dir;

public GetSpeed: () ==> nat 
GetSpeed() ==
return speed;
	
public getLowGrip: () ==> bool 
getLowGrip() ==
(
return lowgrip
);
	
public TurnIndicator: () ==> Indicator 
TurnIndicator() ==
return turnIndicator;	
	
public GetPosition: () ==> Position 
GetPosition() ==
return pos.deepCopy();

public GetID: () ==> nat
GetID() ==
return id;


--
-- Values definition section
--
values

--
-- sync definition section
--
 
end VehicleData


                                                                                
~~~
{% endraw %}

### Environment.vdmrt

{% raw %}
~~~
                                           
-----------------------------------------------
-- Class:			Environment
-- Description: 	Environment class in the VeMo project
-----------------------------------------------

--
-- class definition
--
class Environment

--
-- instance variables
--
instance variables

private vemoCtrl : VeMoController;
private io : IO := new IO();
private inlines : seq of inline := [];
private outlines : seq of char := [];
private busy : bool := true;

--
-- Types definition section
--
types   
inline  = Types`Event;
InputTP   = seq of inline;
--
-- Operations definition section
--
operations

public Environment: seq of char ==> Environment
Environment(filename) ==
(
 	Printer`OutWithTS("Environment created: "  
 					 ^ "Some aren't used to an environment"  
					 ^ " where excellence is expected");

	def mk_(-,input) = io.freadval[InputTP](filename) in
	(
	inlines := input;
	);	 
);

  
public Events: () ==> ()
Events() ==
(
   if inlines <> []
   then 
   (  
    dcl done : bool := false, 
    eventOccurred : bool := false,
    curtime : Types`Time := time;

    while not done do
    (
     def event = hd inlines in      
		cases event:
			mk_Types`VechicleRun(-,-) ->
			(
				if event.t <= curtime
				then
				(
				     Printer`OutWithTS("Environment: Start Vehicle event "
				     					 ^ Printer`natToString(event.ID)); 
					 let ctrl = vemoCtrl.getController(event.ID) in
					 (
					 ctrl.run();
					 );
			    	 eventOccurred := true;
				)
		    ),
		    mk_Types`TrafficLightRun(-,-) ->
		    (
			    if event.t <= curtime
				then
				(
			    	Printer`OutWithTS("Environment: " 
			    					  ^ " Start TrafficLight event");
			     
			      	let light = vemoCtrl.getTrafficLight(event.ID) in 
			      	start(light);

			     	eventOccurred := true;
			     )
		    ),
		    mk_Types`VehicleUpdateSpeed(-,-,-) ->
		    (
		    	if event.t <= curtime
				then
				(
					 Printer`OutWithTS("Environment: SpeedUpdate event: " 
					 					^ "For vehicle: " 
					 					^ Printer`natToString(event.ID) 
					 					^ " New Speed: " 
					 					^ Printer`natToString(event.speed));
					 					 
					 let c = vemoCtrl.getController(event.ID) in 
					     c.getVehicle().SetSpeed(event.speed);
				
					 eventOccurred := true;
				) 
		    ),
		    mk_Types`VehicleUpdatePosition(-,-,-,-) ->
		    (
			 	if event.t <= curtime
				then
				(
			 	 	let pos = new Position(event.posX, event.posY) in
			 	 		let c = vemoCtrl.getController(event.ID) in 
			       		(
			       		c.getVehicle().SetPosition(pos); 
			       		Printer`OutWithTS("Environment: PositionUpdate event: 
									For vehicle: " 
									^ Printer`natToString(event.ID) 
									^ " New position:" 
									^ pos.toString());
			       		);
			     
			     	eventOccurred := true;
			    )
		    ),
		    mk_Types`VehicleLowGrip (-,-,-) ->
		    (
    			if event.t <= curtime
				then
				(
				 Printer`OutWithTS("Environment: LowGrip event: " 
				 					^ "For vehicle: " 
				 					^ Printer`natToString(event.ID)); 
				 let c = vemoCtrl.getController(event.ID)  in 
					 c.getVehicle().setLowGrip(event.lowGrip);
			    
			    eventOccurred := true;
			    )
		    ),
		    mk_Types`VehicleTurnIndication(-,-,-) ->
		    (
		    	if event.t <= curtime
				then
				(
				 Printer`OutWithTS("Environment: TurnIndication event: " 
				 					^ "For vehicle: " 
		 							^ Printer`natToString(event.ID) 
		 							^ " New indicator: " 
		 							^ Vehicle`IndicatorToString(event.turn));  
				 let c = vemoCtrl.getController(event.ID) in 
			     c.getVehicle().setTurnIndicator(event.turn); 
			     
			     eventOccurred := true;
			     )
		    ),
		    mk_Types`VehicleUpdateDirection(-,-,-) ->
		    (
		    	if event.t <= curtime
				then
				(
				 Printer`OutWithTS("Environment: DirectionUpdate event: " 
				 				  ^ "For vehicle: " 
				 				  ^ Printer`natToString(event.ID) 
				 				  ^ " New Direction: " 
				 				  ^ Types`DirectionToString(event.direction)); 
			 	 let c = vemoCtrl.getController(event.ID) in  
			         c.getVehicle().SetDirection(event.direction); 
			    
			     eventOccurred := true;
			     )
		    ),
		    mk_Types`WasteTime(-) ->
		    (
		    	if event.t <= curtime
				then
				(		
				 Printer`OutWithTS("Environment: Wasting time");	    
			     eventOccurred := true;
			    )
		    ),
		    others -> Printer`OutWithTS("Environment: No match found")
		end;

		if eventOccurred 
	 	then
	  	(
	  	inlines := tl inlines;
	  	done := len inlines = 0;  
	  	) 
	  	else done := true;
		  
		eventOccurred := false;
    	);
	  )
      else busy := false;
);
   
   public handleEvent : seq of char ==> ()
   handleEvent(s) ==
   (
   Printer`OutWithTS("#Environment Handled System Event: " ^ s);
   outlines := outlines ^ Printer`natToString(time) ^ ": " ^ s ^ "\n"; 
   );
   
   
   public report : () ==> ()
   report() ==
   (
   Printer`OutAlways("\n\nHowever beautiful the strategy," ^ 
   					"you should occasionally look at the results.");
   Printer`OutAlways("**RESULT***");
   Printer`OutAlways("***********");
   Printer`OutAlways(outlines);
   Printer`OutAlways("\n***********");
   Printer`OutAlways("***********");
   );
   
   public isFinished : () ==> () 
   isFinished() == skip;

   public goEnvironment : () ==> () 
   goEnvironment() == skip;
   
   public setVeMoCtrl : VeMoController ==> ()
   setVeMoCtrl(vemoController) == vemoCtrl := vemoController;

   public run : () ==> ()
   run() ==
   (
	start(vemoCtrl);
    start(self);

   )
--
--
-- Functions definition section
--
functions

--
-- Values definition section
--
values


--
-- Threads definition section
--
thread
(
 while busy do
  --duration(10) 
  (
   Events();
--   Printer`OutWithTS("Environment done");
   vemoCtrl.EnvironmentReady();
 );
 
 Printer`OutAlways("No more events;");
)
--
-- sync definition section
--
sync
 per isFinished => not busy;
 per Events => #fin(Events) = #fin(goEnvironment);
 mutex(handleEvent)

end Environment

                                                                               
~~~
{% endraw %}

### Controller.vdmrt

{% raw %}
~~~
                                          
-----------------------------------------------
-- Class:			Controller
-- Description: 	Controller is main class in 
--					every independent VeMo unit
-----------------------------------------------

--
-- class definition
--
class Controller

--
-- instance variables
--
instance variables
-- traffic data issued by this controller, that will be passed on 
-- other controllers.
private internalTrafficData : seq of TrafficData := []; 	    
inv len internalTrafficData <=  Config`TrafficDataKeeptNumber;
-- traffic data from other controllers moving in the opposite direction,
private externalTrafficData : seq of TrafficData := [];  		
-- this will not be passes on as it makes no sense with the current 
-- warning types.  
inv len externalTrafficData <= Config`TrafficDataKeeptNumber;    

--keep track of whom we have communicated with.
private communicatedWith : seq of nat := [];
inv len communicatedWith <= Config`TrafficDataKeeptNumber; 		 

private traffic : Traffic;
 -- the vehicle the VeMo system Controller is placed in.
private vemoVehicle : Vehicle;

private canRun : bool := true;
--
-- Types definition section
--
types   

--
-- Operations definition section
--
operations

public Controller : Vehicle ==> Controller
Controller (vehicle) ==
(
vemoVehicle := vehicle;
traffic := new Traffic();
);


async public AddOncomingVehicle: VehicleData ==> ()
AddOncomingVehicle(vd) ==
(
if not traffic.ExistVehicleData(vd)
then
let v = new Vehicle(vd) in
traffic.AddVehicle(v);
);


public AddTrafficData:  nat * seq of TrafficData ==> ()
AddTrafficData(vemoUnitID, data) ==
(
 --we cant use empty data
 if data = [] 
 then 
 return;
 
 --did we already exchange information?
 if vemoUnitID in set elems communicatedWith 
 then 
 return;

 --keep track of who we have communicated with
 if len communicatedWith < Config`TrafficDataKeeptNumber
 then
 communicatedWith := communicatedWith ^ [vemoUnitID]
 else
 communicatedWith := tl communicatedWith ^ [vemoUnitID];

 -- add traffic 
 if(len externalTrafficData < Config`TrafficDataKeeptNumber)
 then 
 externalTrafficData := externalTrafficData ^ data
 else
 externalTrafficData :=  tl externalTrafficData ^ data;

 for d in data do 
 ( 
  World`env.handleEvent("Vehicle: " ^ Printer`natToString(GetVehicleID()) ^ 
 						" received " ^  d.ToString());
 );

 VeMoController`graphics.receivedMessage(GetVehicleID());
);
 
 
private AddInternalTrafficData: TrafficData ==> ()
AddInternalTrafficData(data) ==
(
 if(len internalTrafficData < Config`TrafficDataKeeptNumber)
 then 
 internalTrafficData := internalTrafficData ^ [data]
 else
 internalTrafficData :=  tl internalTrafficData ^ [data];
);


public GetTrafficData: () ==> [seq of TrafficData] 
GetTrafficData() == 
-- deep copy
return [ new TrafficData(internalTrafficData(i).GetMessage(), 
						 internalTrafficData(i).GetPosition(), 
				 		 internalTrafficData(i).GetDirection()) 
						| i in set inds internalTrafficData ];

            
pure public GetVehicleID : () ==> nat
GetVehicleID()== return vemoVehicle.GetID();


pure public GetPosition : () ==> [Position]
GetPosition() ==
return vemoVehicle.GetPosition();


pure public GetDirection: () ==> [Types`Direction] 
GetDirection() ==
return vemoVehicle.GetDirection();


public getVehicle : () ==> [Vehicle]
getVehicle() ==
return  vemoVehicle;


public getVehicleDTO : () ==> [VehicleData]
getVehicleDTO() == vemoVehicle.getDTO(); 


public EnvironmentReady: () ==> ()
EnvironmentReady() == if(canRun = false) then canRun := true;


public Step: () ==> ()
Step() ==
(
  vemoVehicle.Move();
   
 --check expired internal data
 for all td in set elems internalTrafficData do
 (
  if td.Expired()
  then 
  (
  --remove td
  internalTrafficData := [internalTrafficData(i) 
  					| i in set inds internalTrafficData 
  					& internalTrafficData(i) <> td];
  )
 );
 
 --check for lowgrip, and check if already set at position.  
 if vemoVehicle.getLowGrip() = true 
 then 
 (
 --The position check will only be relevant if the car has speed 0
 if vemoVehicle.GetSpeed() = 0 => 
 not exists data in set elems internalTrafficData 
 				& Position`Compare(data.GetPosition(), GetPosition()) and  
                data.GetPosition() <>  GetPosition()and  
                data.GetMessage() = <LowGrip> 
 then 
 let lowGripMsg = new TrafficData(<LowGrip>, GetPosition().deepCopy()
 								 , GetDirection()) 
 in  
 AddInternalTrafficData(lowGripMsg);
 );
 
 --check for turnindicator, and check if already set at position.  
 if vemoVehicle.TurnIndicator() = <LEFT> 
 then 
 (
 --The position check will only be relevant if the car has speed 0
 if vemoVehicle.GetSpeed() = 0 =>
 not exists data in set elems internalTrafficData 
 				& Position`Compare(data.GetPosition(), GetPosition()) 
 				and  data.GetMessage() = <LeftTurn> 
 then 
 let turnMsg = new TrafficData(<LeftTurn>, GetPosition().deepCopy()
 								,GetDirection()) 
 in  
 AddInternalTrafficData(turnMsg);
 );
 
  --check for congestion, and check if already set at position.  
 if traffic.Congestion() = true
 then 
 (
 --The position check will only be relevant if the car has speed 0
 if vemoVehicle.GetSpeed() = 0 =>
 not exists data in set elems internalTrafficData 
 				& Position`Compare(data.GetPosition(), GetPosition()) 
 				  and  data.GetMessage() = <Congestion> 
  then
  ( 
  let congMsg = new TrafficData(<Congestion>, GetPosition().deepCopy()
  								, GetDirection()) 
   in  
   (
    AddInternalTrafficData(congMsg);
   )
  )
 );
 
);


async public run : () ==> ()
run() == start(self)
 
--
-- Functions definition section
--
functions

--
-- Values definition section
--
values


--
-- Thread definition section
--
thread
while true do 
duration(500)
(
  Step();
  canRun := false;
)


--
-- sync definition section
--
sync
per Step => canRun;
mutex(AddInternalTrafficData,GetTrafficData);
mutex(AddInternalTrafficData);
mutex(Step)

end Controller


                                                                              
~~~
{% endraw %}

### VeMoController.vdmrt

{% raw %}
~~~
                                              
-----------------------------------------------
-- Class:			VeMoController
-- Description: 	VeMoController main controller for the VeMo system
-----------------------------------------------

--
-- class definition
--
class VeMoController

--
-- instance variables
--
instance variables
public ctrlUnits : inmap nat to Controller := {|->};
public lights : inmap nat to TrafficLight := {|->};
inv dom ctrlUnits inter dom lights = {};
inv forall id in set dom ctrlUnits & ctrlUnits(id).GetVehicleID() = id;
inv forall id in set dom lights & lights(id).GetID() = id;

--graphics
public static graphics : gui_Graphics := new gui_Graphics();

static env : Environment := World`env;

--
-- Types definition section
--
types   

--
-- Operations definition section
--
operations

public VeMoController : () ==> VeMoController 
VeMoController () ==
(
    graphics.init(); 
);

public addController: Controller ==> ()
addController(ctrl) ==
(
	ctrlUnits := ctrlUnits munion {ctrl.GetVehicleID() |->  ctrl} ;    

    let vecID = ctrl.GetVehicleID() in
    (
       graphics.addVehicle(vecID);

       let pos = ctrl.GetPosition() in
       graphics.updatePosition(vecID, pos.X(), pos.Y());

       let dir = ctrl.GetDirection() in
       graphics.updateDirection(
                                vecID, 
                                Types`DirectionToGraphics(dir)
                                );

       for all unit in set rng ctrlUnits do
       graphics.connectVehicles(unit.GetVehicleID() ,vecID);
    )
) 
pre ctrl.GetVehicleID() not in set (dom ctrlUnits union dom lights);
--and ctrl not in set dom controllerConnections;

public addTrafficLight: TrafficLight ==> ()
addTrafficLight(light) ==
(
    lights := lights munion {light.GetID() |-> light};    
)
pre light.GetID() not in set dom lights 
				  and light.GetID() not in set dom ctrlUnits;

public getController : nat ==> Controller
getController(id) ==
(
  return ctrlUnits(id);
)
pre id in set dom ctrlUnits;

public getTrafficLight : nat ==> TrafficLight
getTrafficLight(id) ==
(
  return lights(id);
)
pre id in set dom lights;

public EnvironmentReady: () ==> ()
EnvironmentReady() == skip;


public CalculateInRange: () ==> ()
CalculateInRange() == 
(  
   -- vehicles/controllers are denoted units in the following 
   let units = rng ctrlUnits in   
    -- for all units, find the ones in range. 
    -- This could be optimized given that if one unit can see another unit,
    -- then they can see each other, no need to calculate the range again 
    -- for units seeing each other. However this will be complex, given that 
    -- one unit might have serveral units in its range that aren't in range 
    -- of each other.              
    for all unit in set units do 
    (
     let pos = unit.GetPosition() in
           graphics.updatePosition(unit.GetVehicleID(), pos.X(), pos.Y());
     
     let dir = unit.GetDirection() in graphics.updateDirection(
                                      unit.GetVehicleID(),
                                      Types`DirectionToGraphics(dir));

     let inrange = FindInRangeWithOppositeDirection(unit, units)  
     in
     (	
       -- only request data, the way the loop is built will ensure that all 
	   -- units will request data. 
       if(card inrange > 0)
       then
       for all oncomingVehicle in set inrange do
       (
         unit.AddTrafficData(oncomingVehicle.GetVehicleID() 
         					,oncomingVehicle.GetTrafficData());
         
         let vehicleDTO = unit.getVehicleDTO() in 
         oncomingVehicle.AddOncomingVehicle(vehicleDTO); 
       );
	 ) 
    );

    graphics.sleep();

	-- synchronization, when we have calculated inrange allow vehicles to 
	--move again
    for all u in set rng ctrlUnits do u.EnvironmentReady(); 
);

--
-- Functions definition section
--
functions
public static OppositeDirection : Types`Direction -> Types`Direction
OppositeDirection(d) ==
cases d:
<NORTH> -> <SOUTH>,  
<SOUTH> -> <NORTH>,  
<EAST>  -> <WEST>, 
<WEST>  -> <EAST>
end;


-- compare the range of a single vehicle/controller to a 
-- set of vehicles/controllers
public  FindInRange : Controller * set of Controller -> set of Controller
FindInRange(v, vs) == 
   let inrange = { ir | ir in set vs & v <> ir and InRange(v,ir) = true }
   in
   inrange;	
  
  
-- compare the range of two vehicles/controllers
public InRange : Controller * Controller -> bool
InRange(u1,u2) ==
 let pos1 = u1.GetPosition(), pos2 = u2.GetPosition()
 in 
 pos1.inRange(pos2, Config`Range);

  
  
-- compare the range of a single vehicle/controller to a set of 
-- vehicles/controllers moving in the opposite direction
public FindInRangeWithOppositeDirection : Controller * set of Controller 
	-> set of Controller
FindInRangeWithOppositeDirection(u ,us) ==  
 let dir = OppositeDirection(u.GetDirection()) in
  let inrange = { ir | ir in set FindInRange(u, us) & dir = ir.GetDirection()}
    in inrange;

--
-- Values definition section
--
values


--
-- Thread definition section
--
thread
(
 while true do
 (
   CalculateInRange();
   env.goEnvironment();
 )
)

--
-- sync definition section
--
sync
per CalculateInRange => #fin(EnvironmentReady) > #fin(CalculateInRange); 


-- has heavy performance loss
mutex (CalculateInRange, addController, getController);
mutex (addController);
mutex (getController);
mutex (CalculateInRange)
end VeMoController


                                                                                  
~~~
{% endraw %}

### Config.vdmrt

{% raw %}
~~~
                                      
-----------------------------------------------
-- Class:			Config
-- Description: 	Config contains configuration values
-----------------------------------------------

--
-- class definition
--
class Config

--
-- instance variables
--
instance variables
--
-- Types definition section
--
types   

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
--indicates the range in which units in the system can see each other
public static Range : nat = 12;   				
--indicates the periode for which a TrafficData Message is valid
public static TrafficDataLifeTime : nat = 300000; 
--indicates the number of TrafficData Message held by the vdm units	
public static TrafficDataKeeptNumber : nat = 5; 
--indicates the number of vehicles held for calculation congestion
public static TrafficCongestionTrack : nat = 5; 
--indicates the vehicle range for congestion
public static TrafficCongestionRange : nat = 1; 
 --indicates the threshold speed for congestion
public static TrafficCongestionThreshold : nat = 2;
end Config


                                                                          
~~~
{% endraw %}

### TrafficLight.vdmrt

{% raw %}
~~~
                                             
-----------------------------------------------
-- Class:			TrafficLight
-- Description: 	TrafficLight the VeMo project
-----------------------------------------------

--
-- class definition
--
class TrafficLight

--
-- instance variables
--
instance variables

private pos: Position;
private greenLightTime : nat1;
private greenDir: Types`Direction;
private id : nat;
--
-- Types definition section
--
types   

--
-- Operations definition section
--
operations

public TrafficLight: nat * Position * nat1 ==> TrafficLight
TrafficLight(identifier ,p, t) ==
(
	pos := p ;
	greenLightTime := t;
	id := identifier;
	
	greenDir := <NORTH>
);

public AddTrafficData: TrafficData ==> ()
AddTrafficData(data) ==
is not yet specified;

public GetTrafficData: () ==> set of TrafficData 
GetTrafficData() ==
is not yet specified;

public GetPosition: () ==> Position 
GetPosition() ==
 return pos;
	
public GreenLightPath: () ==> Types`Direction 
GreenLightPath() ==
 return greenDir;

pure public GetID: () ==> nat
GetID() ==
 return id;
	
private Step: () ==> ()
Step() ==
(
    if (time mod greenLightTime) = 0
    then 
    (
	 greenDir := CrossDirection(greenDir);  
    )
);
	
--
-- Functions definition section
--
functions

public static CrossDirection : Types`Direction -> Types`Direction
CrossDirection(d) ==
cases d:
<NORTH> -> <EAST>,  
<SOUTH> -> <WEST>,  
<EAST>  -> <NORTH>, 
<WEST>  -> <SOUTH>
end;

--
-- Values definition section
--
values

--
-- Thread definition section
--
thread
 periodic (1000E6,10,900E6,0) (Step)
    

--
-- sync definition section
--
sync
mutex(GreenLightPath);
mutex(Step,GreenLightPath);

end TrafficLight


                                                                                
~~~
{% endraw %}

### TestTrafficLight.vdmrt

{% raw %}
~~~
                                              
-----------------------------------------------
-- Class:			TestTrafficLight
-- Description: 	Test the TrafficLight class 
-----------------------------------------------

--
-- class definition
--
class TestTrafficLight is subclass of TestCase

--
-- instance variables
--
instance variables
private pos : Position;
--
-- Operations definition section
--
operations
public TestTrafficLight: seq of char ==> TestTrafficLight
TestTrafficLight(s) ==
(
	TestCase(s);
);

protected SetUp: () ==> ()
SetUp () == pos := new Position(5,1); 

protected RunTest: () ==> ()
RunTest () ==
(
 dcl trfLgt : TrafficLight := new TrafficLight(1, pos, 5);
 AssertTrue(trfLgt.GetID() = 1);
 AssertTrue(trfLgt.GetPosition().X() = 5);
 AssertTrue(trfLgt.GetPosition().Y() = 1); 
 AssertTrue(trfLgt.GreenLightPath() = <NORTH>);
 
 testGreenLightPath();
 testCrossDirection();
);
  
protected TearDown: () ==> ()
TearDown () == skip;


--sequential model only
--public testGreenLightPath : () ==> ()
--testGreenLightPath() ==
--(
--  dcl trfLgt : TrafficLight := new TrafficLight(1, pos, 2);
-- 
--  AssertTrue(trfLgt.GreenLightPath() = <NORTH>);
--  trfLgt.Step();
--  trfLgt.Step();
--  AssertTrue(trfLgt.GreenLightPath() = <NORTH>);
--  Timer`Tick();
--  Timer`Tick();
--  trfLgt.Step();
--  AssertTrue(trfLgt.GreenLightPath() = <EAST>);
--);

public testGreenLightPath : () ==> ()
testGreenLightPath() ==
(
  dcl trfLgt : TrafficLight := new TrafficLight(1, pos, 2);
  start(trfLgt);
  AssertTrue(trfLgt.GreenLightPath() = <NORTH>);
);


public testCrossDirection : () ==> ()
testCrossDirection() ==
(
  AssertTrue(TrafficLight`CrossDirection(<NORTH>) = <EAST>);
  AssertTrue(TrafficLight`CrossDirection(<SOUTH>) = <WEST>);
  AssertTrue(TrafficLight`CrossDirection(<EAST>) = <NORTH>);
  AssertTrue(TrafficLight`CrossDirection(<WEST>) = <SOUTH>);

);


end TestTrafficLight

                                                                                    
~~~
{% endraw %}

### gui_Graphics.vdmrt

{% raw %}
~~~
class gui_Graphics

	instance variables
-- TODO Define instance variables here
	operations
    
    public init : () ==> ()
    init()== is not yet specified;

    public sleep: () ==> ()
    sleep()== is not yet specified;

    public addVehicle: int ==> ()
    addVehicle(vecID)== is not yet specified;

    public connectVehicles: int * int ==> ()
    connectVehicles(vecID, vecID2)== is not yet specified;

    public disconnectVehicles: int * int ==> ()
    disconnectVehicles(vecID, vecID2)== is not yet specified;

    public updatePosition: int * int * int ==> ()
    updatePosition(vecID, x, y)== is not yet specified;

    public updateDirection: int * int ==> ()
    updateDirection(vecID, dir)== is not yet specified;

    public receivedMessage : int ==> ()
    receivedMessage(vecID) == is not yet specified;

end gui_Graphics
~~~
{% endraw %}

### TestVeMoController.vdmrt

{% raw %}
~~~
                                                
------------------------------------------------
-- Class:			TestVeMoController
-- Description: 	Test the VeMoController class 
-----------------------------------------------

--
-- class definition
--
class TestVeMoController is subclass of TestCase

--
-- instance variables
--
instance variables
private pos : Position;
--
-- Operations definition section
--
operations
public TestVeMoController: seq of char ==> TestVeMoController
TestVeMoController(s) ==
(
	TestCase(s);
);

protected SetUp: () ==> ()
SetUp () == pos := new Position(1,1); 

protected RunTest: () ==> ()
RunTest () ==
(
 Printer`OutAlways("Testing VeMoController");
 start(self);
 self.IsFinished();
);
  
  
private runner : () ==> ()
runner () ==
(
 dcl vec : Vehicle := new Vehicle(2, pos, 1, <NORTH>),
 vec2 : Vehicle := new Vehicle(3, new Position(1,3), 1, <SOUTH>),
 ctrl : Controller := new Controller(vec),
 ctrl2 : Controller := new Controller(vec2),
 vec3 : Vehicle := new Vehicle(4, new Position(1,3), 1, <EAST>),
 vemoCtrl : VeMoController := new VeMoController(),
 trfLight : TrafficLight := new TrafficLight(11, new Position(1,3), 5);
 
 --test call of inrange and data exchange
 vec.setLowGrip(true);
 vemoCtrl.addController(ctrl);
 vemoCtrl.addController(ctrl2);
 AssertTrue(vemoCtrl.getController(2) = ctrl);
 
 start(vemoCtrl);
 --start(ctrl);
	
 vemoCtrl.CalculateInRange();
 let vs = ctrl.GetTrafficData() in
  (
  skip;
   let v = vs(1) in
   (
   	AssertTrue(v.GetPosition().X() = 1);
   	AssertTrue(v.GetPosition().Y() = 2);
   	AssertTrue(v.GetMessage() = <LowGrip>);
   	AssertTrue(v.GetDirection() = <NORTH>);
   )
  );
  
  --test opposite direction
  AssertTrue(VeMoController`OppositeDirection(vec3.GetDirection()) = <WEST>);  
  vec3.SetDirection(<WEST>);
  AssertTrue(VeMoController`OppositeDirection(vec3.GetDirection()) = <EAST>);
  
  -- test trafficlight
  vemoCtrl.addTrafficLight(trfLight);
  let t = vemoCtrl.getTrafficLight(11) in
  (
  	AssertTrue(t.GetID() = 11);
 	AssertTrue(Position`Compare(t.GetPosition(), new Position(1,3)));
  )
);
  
  
private IsFinished : () ==> ()
IsFinished () ==  skip;

  
protected TearDown: () ==> ()
TearDown () == skip;


thread
(
 runner(); 
)

--
-- sync definition section
--
sync
 per IsFinished => #fin(runner) > 0;

end TestVeMoController

                                                                                      
~~~
{% endraw %}

### TestTraffic.vdmrt

{% raw %}
~~~
                                          
------------------------------------------------
-- Class:			TestTraffic
-- Description: 	Test the Traffic class 
-----------------------------------------------

--
-- class definition
--
class TestTraffic is subclass of TestCase

--
-- instance variables
--
instance variables
private pos : Position;
--
-- Operations definition section
--
operations
public TestTraffic: seq of char ==> TestTraffic
TestTraffic(s) ==
(
	TestCase(s);
);

protected SetUp: () ==> ()
SetUp () == pos := new Position(1,1); 

protected RunTest: () ==> ()
RunTest () ==
(
  dcl traf : Traffic := new Traffic(),
  vec : Vehicle := new Vehicle(2, pos, 1, <NORTH>),
  vec2 : Vehicle := new Vehicle(3, pos, 1, <NORTH>),
  vec3 : Vehicle := new Vehicle(4, pos, 1, <NORTH>),
  vec4 : Vehicle := new Vehicle(5, pos, 1, <NORTH>),
  vec5 : Vehicle := new Vehicle(6, pos, 1, <NORTH>),
  vec6 : Vehicle := new Vehicle(7, pos, 1, <NORTH>);
 
  AssertFalse(traf.ExistVehicle(vec));
  traf.AddVehicle(vec);
  AssertTrue(traf.ExistVehicle(vec));
  traf.AddVehicle(vec2);
  
  let vs = traf.GetVehicles() in
  (
   AssertTrue(len vs = 2);
   AssertTrue(vs(1) = vec);
  );
  
   traf.AddVehicle(vec3);
   traf.AddVehicle(vec4);
   traf.AddVehicle(vec5);
   
   let vs = traf.GetVehicles() in
   AssertTrue(len vs = 5);
   
   traf.AddVehicle(vec6);
   let vs = traf.GetVehicles() in
   AssertTrue(len vs = 5);
   
   testCongestion();
);
  
protected TearDown: () ==> ()
TearDown () == skip;

--public Step: () ==> ()
--Step() == skip;
--timeToLive := timeToLive -1;

public testCongestion : () ==> ()
testCongestion() ==
(
 dcl pos2 : Position := new Position(1,2),
 pos3 : Position := new Position(1,3),
 pos4 : Position := new Position(1,5);

 dcl traf : Traffic := new Traffic(),
 vec : Vehicle := new Vehicle(2, pos, 1, <NORTH>),
 vec2 : Vehicle := new Vehicle(3, pos2, 1, <NORTH>),
 vec3 : Vehicle := new Vehicle(4, pos3, 1, <NORTH>),
 vec4 : Vehicle := new Vehicle(5, pos4, 1, <SOUTH>);
 
 dcl traf : Traffic := new Traffic();
 
 let vs = [vec,vec2,vec3,vec4] in
 (
  for v in vs do 
  (
  traf.AddVehicle(v);
  );

--start vehicle

--sequential model only
--  for v in vs do 
--  (
--   v.Step();
--   v.Step();
--  );
 
  AssertTrue(traf.Congestion());
 );
 
)
end TestTraffic

                                                                               
~~~
{% endraw %}

### Traffic.vdmrt

{% raw %}
~~~
                                       
-----------------------------------------------
-- Class:			Traffic
-- Description: 	Traffic contains the vehicles known by VeMo
-----------------------------------------------

--
-- class definition
--
class Traffic

--
-- instance variables
--
instance variables

private vehicles: seq of Vehicle := [];
inv len vehicles <= 5;
--
-- Types definition section
--
types   

--
-- Operations definition section
--
operations

public AddVehicle: Vehicle ==> () 
AddVehicle(vehicle) ==
(
 if(len vehicles < Config`TrafficCongestionTrack)
 then 
 vehicles := vehicles ^ [vehicle]
 else
 vehicles :=  tl vehicles ^ [vehicle]
)
pre vehicle not in set elems vehicles; 
  
 
public ExistVehicle : Vehicle ==> bool
ExistVehicle(v) == 
(
return {vec | vec in set elems vehicles & v.GetID() = vec.GetID()} <> {};
);


public ExistVehicleData : VehicleData ==> bool
ExistVehicleData(v) == 
(
return {vec | vec in set elems vehicles & v.GetID() = vec.GetID()} <> {};
);


public GetVehicles: () ==> seq of Vehicle 
GetVehicles() ==
return vehicles;
	
	
public Congestion: () ==> bool
Congestion() ==
(	
 dcl inrange : set of Vehicle := {};
 
 for v in vehicles do
 (
  let vs = FindInRangeWithSameDirection(v,vehicles)
  in
  inrange := inrange union vs;
 ); 
 
 if card inrange = 0
 then return false;
 
 let avgspeed = AverageSpeed(inrange) 
 in 
 (
 return avgspeed < Config`TrafficCongestionThreshold;
 )
);
	
	
private AverageSpeed: set of Vehicle ==> nat
AverageSpeed(vs) ==
( 
  dcl sumSpeed: nat := 0;
  for all v in set vs do
      sumSpeed := sumSpeed + v.GetSpeed();
    return (sumSpeed/card vs)
)
pre card vs <> 0;
--
-- Functions definition section
--
functions

 -- compare the range of two vehicles
public InRange : Vehicle * Vehicle -> bool
InRange(v1,v2) ==
let pos1 = v1.GetPosition(), pos2 = v2.GetPosition()
in
pos1.inRange(pos2, Config`TrafficCongestionRange);


-- compare the range of a single vehicle to a set of vehicles moving in 
-- the same direction
public FindInRangeWithSameDirection : Vehicle * seq of Vehicle 
	 -> set of Vehicle
FindInRangeWithSameDirection(v ,vs) ==
let dir = v.GetDirection() in
 { ir | ir in set elems vs & v <> ir 
 						   and dir = ir.GetDirection() 
 						   and InRange(v,ir) = true }


--
-- Values definition section
--
values

--
-- sync definition section
--
sync
mutex(Congestion, AddVehicle);
mutex(ExistVehicle, AddVehicle);
mutex(GetVehicles, AddVehicle);
mutex(AddVehicle);

end Traffic


                                                                           
~~~
{% endraw %}

### TrafficData.vdmrt

{% raw %}
~~~
                                            
-----------------------------------------------
-- Class:			TrafficData
-- Description: 	TrafficData is the base for different types of 
--					messages in the system.
-----------------------------------------------

--
-- class definition
--
class TrafficData

--
-- instance variables
--
instance variables
private dir: Types`Direction;
private pos: Position;
private message: MessageType;
private timeToLive : nat;

--
-- Types definition section
--
types   
public MessageType = <LowGrip> | <Congestion> | <LeftTurn> | <RedLight>;

--
-- Operations definition section
--
operations
public TrafficData: MessageType * Position * Types`Direction ==> TrafficData
	TrafficData(m,p,d) ==
		(
		pos := p ;
		message := m;
		dir := d;
		timeToLive := time + Config`TrafficDataLifeTime;
		);

public GetPosition: () ==> Position 
	GetPosition() ==
	return pos;
	
public GetMessage: () ==> MessageType
	GetMessage() ==
	return message;

public GetDirection: () ==> Types`Direction 
GetDirection() ==
return dir;
	
public Expired : () ==> bool
Expired() ==
return time >= timeToLive;

public ToString : () ==> seq of char 
ToString() ==
return "traffic data reporting " 
		^ MessageTypeToString(message) 
		^ " moved " ^ Types`DirectionToString(dir) 
		^ " at " ^ pos.toString()  
		^ " with lifetime " 
		^ Printer`intToString(timeToLive - time);

--
-- Functions definition section
--
functions

public static MessageTypeToString : MessageType -> seq of char 
MessageTypeToString(m) ==
(
cases m:
<LowGrip>-> "Low Grip",
<Congestion>-> "Congestion ",
<LeftTurn>-> "Left Turn",
<RedLight> -> "Red Light"
end
)

--
-- Values definition section
--
values

end TrafficData


                                                                               
~~~
{% endraw %}

### TestCase.vdmrt

{% raw %}
~~~
              

class TestCase
  is subclass of Test

instance variables
  name : seq of char

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

### Position.vdmrt

{% raw %}
~~~
                                        
-----------------------------------------------
-- Class:			Position
-- Description: 	Defines a X,Y position
-----------------------------------------------

--
-- class definition
--
class Position

--
-- instance variables
--
instance variables

private x: int;
private y: int;

--
-- Types definition section
--
types   

--
-- Operations definition section
--
operations

public Position: int * int ==> Position
Position(x_, y_) ==
(
 x := x_;
 y := y_;
);
		
pure public X: () ==> int
X() ==
(
	return x;
);

pure public Y: () ==> int
Y() ==
(
	return y;
);

public setX : int ==> ()
setX(newX) ==
(
  x := newX

);

public setY: int ==> ()
setY(newY) ==
(
y := newY

);

public toString : () ==> seq of char
toString() == 
(
	return "position X: " 
	^ VDMUtil`val2seq_of_char[int](x) 
	 ^ " Y: " ^ VDMUtil`val2seq_of_char[int](y) -- Printer`intToString(y) 
);

pure public inRange : Position * int ==> bool
inRange(p, range) ==
(
    let xd = x - p.X(), yd = y -p.Y() in 
    (
        let d = MATH`sqrt((xd * xd) + (yd * yd)) in
        (
            return d <= range;   
        )
    )
);

public deepCopy : () ==> Position
deepCopy() ==
(
 let newPos = new Position(x,y)
 in 
 return newPos;  
)

--
-- Functions definition section
--
functions
public static Compare: Position * Position -> bool
Compare(a,b) ==
a.X() = b.X() and a.Y() = b.Y() 


--
-- Values definition section
--
values

end Position

                                                                            
~~~
{% endraw %}

### TestController.vdmrt

{% raw %}
~~~
                                            
------------------------------------------------
-- Class:			TestController
-- Description: 	Test the Controller class 
-----------------------------------------------

--
-- class definition
--
class TestController is subclass of TestCase

--
-- instance variables
--
instance variables
private pos : Position;
--
-- Operations definition section
--
operations
public TestController: seq of char ==> TestController
TestController(s) ==
(
	TestCase(s);
);

protected SetUp: () ==> ()
SetUp () == pos := new Position(1,1); 

protected RunTest: () ==> ()
RunTest () ==
(
  dcl vec : Vehicle := new Vehicle(2, pos, 1, <NORTH>),
  ctrl : Controller := new Controller(vec),
  vec2 : Vehicle := new Vehicle(3, pos.deepCopy(), 1, <NORTH>),
  ctrl2 : Controller := new Controller(vec2),
  vec3 : Vehicle := new Vehicle(4, pos.deepCopy(), 1, <NORTH>),
  ctrl3 : Controller := new Controller(vec3);

  AssertTrue(ctrl.getVehicle() = vec);
  AssertTrue(ctrl.GetDirection() = <NORTH>);
  AssertTrue(ctrl.GetVehicleID() = 2);
  AssertTrue(ctrl.GetPosition().X() = pos.X());
  AssertTrue(ctrl.GetPosition().Y() = pos.Y());
 
  --test get traffic data
  vec.setLowGrip(true);
  vec.setTurnIndicator(<LEFT>);
  ctrl.Step();
  let vs = ctrl.GetTrafficData() in
  (
   let v = vs(1) in
   (
   AssertTrue(v.GetPosition().X() = 1);
   AssertTrue(v.GetPosition().Y() = 2);
   AssertTrue(v.GetMessage() = <LowGrip>);
   AssertTrue(v.GetDirection() = <NORTH>);
   );
   let v = vs(2) in
   (
   AssertTrue(v.GetPosition().X() = 1);
   AssertTrue(v.GetPosition().Y() = 2);
   AssertTrue(v.GetMessage() = <LeftTurn>);
   AssertTrue(v.GetDirection() = <NORTH>);

   )
  );
  
  vec.SetSpeed(0);
  vec.setTurnIndicator(<LEFT>);
  ctrl.Step();
  let vs = ctrl.GetTrafficData() in
  (
   let v = vs(1) in
   (
   AssertTrue(v.GetPosition().X() = 1);
   AssertTrue(v.GetPosition().Y() = 2);
   AssertTrue(v.GetMessage() = <LowGrip>);
   AssertTrue(v.GetDirection() = <NORTH>);
   );
   let v = vs(2) in
   (
   AssertTrue(v.GetPosition().X() = 1);
   AssertTrue(v.GetPosition().Y() = 2);
   AssertTrue(v.GetMessage() = <LeftTurn>);
   AssertTrue(v.GetDirection() = <NORTH>);
   )
  );
  
  ctrl.AddOncomingVehicle(ctrl2.getVehicleDTO());
  ctrl.AddOncomingVehicle(ctrl3.getVehicleDTO());
  ctrl.Step();
  let vs = ctrl.GetTrafficData() in
  let v = vs(3) in
  (
   AssertTrue(v.GetMessage() = <Congestion>);
  );
  
  --  --test add of traffic data. Test that adding loops when more than five
  ctrl.AddTrafficData(21, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(22, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(23, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(24, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(25, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(26, [new TrafficData(<LeftTurn>, pos , <NORTH>)]);

  --test that the same vehicle can't communicate until pass threshold. 
  ctrl.AddTrafficData(31, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(32, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(33, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(34, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(31, [new TrafficData(<LeftTurn>, pos , <NORTH>)]);
  ctrl.AddTrafficData(35, [new TrafficData(<Congestion>, pos , <NORTH>)]);
  ctrl.AddTrafficData(31, [new TrafficData(<LeftTurn>, pos , <NORTH>)]);
  
  -- actually this can't be automatically tested. 
  -- The added data is internal only. The test can only be verified  
  -- by checking the handled events in environment. 
  
);
  
protected TearDown: () ==> ()
TearDown () == skip;

end TestController

                                                                                  
~~~
{% endraw %}

### VeMo.vdmrt

{% raw %}
~~~
                                     

-----------------------------------------------
-- Class:			VeMo
-- Description: 	VeMo is the system class in the VeMo project
-----------------------------------------------

--
-- class definition
--
system VeMo

--
-- instance variables
--
instance variables

public  cpu0 : CPU := new CPU (<FP>,1E6);		-- changed for setPriority to work
public  cpu1 : CPU := new CPU (<FCFS>,1E6);
public  cpu2 : CPU := new CPU (<FCFS>,1E6);
public  cpu9 : CPU := new CPU (<FCFS>,1E6);

public bus1 : BUS := new BUS (<FCFS>,1E6,{cpu0, cpu1, cpu2, cpu9});

static e : Environment := World`env;

-- Vehicles
public static ctrl1 : Controller := new Controller(
									new Vehicle(1, 
									new Position(17, -20), 1, <NORTH>));

public static ctrl2 : Controller := new Controller(
									new Vehicle(2, 
									new Position(-4, 25), 3, <SOUTH>));

public static ctrl9 : Controller := new Controller(
									new Vehicle(9, 
									new Position(23, 20), 1, <SOUTH>));


--traffic lights
public static tl1 : TrafficLight := new TrafficLight(20 
													,new Position(1, 1)
													, 100);

public static vemoCtrl : VeMoController := new VeMoController();

--
-- Operations definition section
--
operations

public VeMo: () ==> VeMo
 VeMo() ==
 (
 cpu1.deploy(ctrl1); 
 cpu2.deploy(ctrl2);
 cpu9.deploy(ctrl9);
 );


end VeMo


                                                                        
~~~
{% endraw %}

### TestVeMoComplete.vdmrt

{% raw %}
~~~
                                                      
-----------------------------------------------
-- Class:			TestVeMoComplete
-- Description: 	Test all test suites and classes in VeMo system 
-----------------------------------------------

--
-- class definition
--

class TestVeMoComplete


instance variables


--
-- Operations definition section
--
operations

public Execute: () ==> ()
	Execute() ==
		(
		dcl w : World := new World() , ts : TestSuite := new TestSuite();
		ts.AddTest(new TestVehicle("TestVehicle"));
		ts.AddTest(new TestPosition("TestPosition")); 
		ts.AddTest(new TestTrafficLight("TestTrafficLight"));
		ts.AddTest(new TestTrafficData("TestTrafficData"));
		ts.AddTest(new TestTraffic("TestTraffic"));
		ts.AddTest(new TestController("TestController"));
	    ts.AddTest(new TestVeMoController("TestVeMoController"));
		ts.Run();
		);
		
end TestVeMoComplete

                                                                                    
~~~
{% endraw %}

