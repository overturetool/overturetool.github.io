---
layout: default
title: iiossRT
---

##iiossRT
Author: Christian Thillemann and Bardur Joensen


This project was made by Christian Thillemann and Bardur Joensen in a
VDM course. It is modelling a small subset of a controller for a pig 
stable that wish to keep track of the whereabouts of a collection of pigs
in a stable.| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new World().Run()|


###Actuator.vdmrt

{% raw %}
~~~

class Actuator is subclass of IIOSSTYPES
instance variables	actuatorID : nat;operations	public Actuator: (nat) ==> Actuator	Actuator(actID) ==	(	  actuatorID := actID;	  return self;	);
	public SetValues : EventId * PigPosition ==> ()	SetValues(eventId, val) == 	(							-- eventID, eventType, text, eventTime		World`env.handleEvent(eventId, <SHOW_PIG>,                               " PigPosition " ^ VDMUtil`val2seq_of_char[PigPosition](val),                               time);	);sync	mutex(SetValues);end Actuator


~~~
{% endraw %}

###Environment.vdmrt

{% raw %}
~~~

class Environment is subclass of IIOSSTYPES
types
	public InputTP   = Time * seq of inline;
	public outline = EventId * EventType * seq of char * nat; 	public inline = EventId * EventType * PigId * [Position] * PigStyId * Time;
instance variables
	-- access to the VDMTools stdio	io : IO := new IO();	-- the input file to process	inlines : seq of inline := [];	-- the output file to print	outlines : seq of outline := [];	-- maintain a link to all sensors	sensors : map nat to Sensor := {|->};	--inv dom ranges = dom sensors;	busy : bool := true;
	server : [Server] := nil;
	-- Amount of time we want to simulate	simtime : nat; -- Time;
operations
	public Environment: seq of char ==> Environment	Environment (fname) ==	(		def mk_(-,mk_(timeval,input)) = io.freadval[Time * seq of inline](fname) 		in	    (			inlines := input;			simtime := timeval;	    );	);
	public addServer : Server ==> ()	addServer (pServer) == 	(		server := pServer;	);
	public addSensor: Sensor ==> ()	addSensor (psens) == 	(		dcl id : nat := card dom sensors + 1;	    sensors := sensors munion {id |-> psens}	);
	public getServer: () ==> Server	getServer() == return server	pre server <> nil;
	public getNoSensors: () ==> nat	getNoSensors() == return card dom sensors;        
	private createSignal: () ==> () 	createSignal () == 	duration(10)	(		if len inlines > 0  then 		(			dcl curtime : Time := time, done : bool := false;	        while not done do	        (	        	def mk_ (eventid, eventType, pigid, position, pigStyId, pt) = hd inlines in -- Next inline event	            if pt <= curtime then 	            (	             	 if (eventType = <PIG_NEW>) then	             	 (	             	 	sensors(pigStyId).trip(eventType, pigid, position);	             	 )	             	 elseif (eventType = <PIG_MOVED>) then	             	 (	             	 	sensors(pigStyId).trip(eventType, pigid, nil);	             	 )	             	 elseif (eventType = <SHOW_PIG>) then	             	 (	             	 	server.PointAtPig(eventid,pigid);	             	 );	                 inlines := tl inlines;	                 done := len inlines = 0;	                 return;	            ) 	            else 	            (		             	done := true;	                return	            )	         )	    )		else 		(			busy := false;			return;		)	  )	  pre server <> nil and card dom sensors <> 0;

	public handleEvent: EventId * EventType *  seq of char * Time ==> ()	handleEvent (eventID, eventType, text, eventTime) == 	(	   outlines := outlines ^ [mk_(eventID, eventType, text, eventTime)];	);
	public showResult: () ==> ()	showResult () ==	(		IIOSSTYPES`DebugPrint("---------------");		IIOSSTYPES`DebugPrint("ShowResult");		for outline in outlines do		(			IIOSSTYPES`DebugPrint(" ");             IO`print(outline);		);				IIOSSTYPES`DebugPrint("---------------");	);
	public isFinished : () ==> ()	isFinished () == skip;
	public GetAndPurgeOutlines: () ==> seq of outlineGetAndPurgeOutlines() ==  let res = outlines  in    (outlines := [];     return res);
sync
	mutex (handleEvent);	mutex(createSignal);	per isFinished => not busy;
thread	periodic (1000E6,10,900,0) (createSignal)

end Environment


~~~
{% endraw %}

###IIOSS.vdmrt

{% raw %}
~~~


system IIOSS
instance variables	-- CPUS	-- Server	cpu1 : CPU := new CPU (<FCFS>,1E6); -- server	--stablecontrollers	cpu2 : CPU := new CPU (<FCFS>,1E6); -- stablecontroller1	cpu3 : CPU := new CPU (<FCFS>,1E6); -- stablecontroller2	-- sensors	cpu4 : CPU := new CPU (<FCFS>,1E6);  -- stablecontroller1Sensor	cpu5 : CPU := new CPU (<FCFS>,1E6);  -- stablecontroller1Sensor	cpu6 : CPU := new CPU (<FCFS>,1E6);  -- stablecontroller2Sensor	cpu7 : CPU := new CPU (<FCFS>,1E6);  -- stablecontroller2Sensor	-- Actuators	cpu8 : CPU := new CPU (<FCFS>,1E6);  -- stablecontroller1	cpu9 : CPU := new CPU (<FCFS>,1E6); -- stablecontroller1	cpu10 : CPU := new CPU (<FCFS>,1E6); -- stablecontroller2	cpu11 : CPU := new CPU (<FCFS>,1E6); -- stablecontroller2	

	--BUSs	-- Server to stablecontroller ?	bus1 : BUS := new BUS (<FCFS>,1E6,{cpu1,cpu2});	bus2 : BUS := new BUS (<FCFS>,1E6,{cpu1,cpu3});	-- stablecontroller1 to sensors	bus3 : BUS := new BUS (<FCFS>,1E6,{cpu2,cpu4,cpu5});	-- stablecontroller2 to sensors	bus4 : BUS := new BUS (<FCFS>,1E6,{cpu3,cpu6,cpu7});	-- stablecontroller1 to sensors	bus5 : BUS := new BUS (<FCFS>,1E6,{cpu2,cpu8,cpu9});	-- stablecontroller2 to sensors	bus6 : BUS := new BUS (<FCFS>,1E6,{cpu3,cpu10,cpu11});



	-- stable controller	public static server : Server := new Server();	--public static server : Server := new Server("scenario.txt");	-- Stable controller	public static StableController1 : StableController := new StableController(server);	public static StableController2 : StableController := new StableController(server);
	-- Sensors for stableController1	public static sensor1 : Sensor := new Sensor(StableController1);	public static sensor2 : Sensor := new Sensor(StableController1);
	-- Sensors for stableController2	public static sensor3 : Sensor := new Sensor(StableController2);	public static sensor4 : Sensor := new Sensor(StableController2);	public static sensor5 : Sensor := new Sensor(StableController2);
	-- Actuators for stableController1	public static actuator1 : Actuator := new Actuator();	public static actuator2 : Actuator := new Actuator();
	-- Actuators for stableController2	public static actuator3 : Actuator := new Actuator();	public static actuator4 : Actuator := new Actuator();
operationspublic IIOSS: () ==> IIOSSIIOSS () ==(	cpu1.deploy(server);	-- StableController1	cpu2.deploy(StableController1);	-- StableController2	cpu3.deploy(StableController2);	-- Sensors	cpu4.deploy(sensor1);	cpu5.deploy(sensor2);
	cpu6.deploy(sensor3);	cpu7.deploy(sensor4);	-- actuators	cpu8.deploy(actuator1);	cpu9.deploy(actuator2);
	cpu10.deploy(actuator3);	cpu11.deploy(actuator4);
);
end IIOSS


~~~
{% endraw %}

###iiosstypes.vdmrt

{% raw %}
~~~

class IIOSSTYPES
types	public PigPosition::		id: nat1		pos: Position;
	public Position::		posX: int		posY: int;
	public EventId = nat;	public PigId = nat;	public PigStyId = nat;	public Time = nat;
	public EventType = <SHOW_PIG> | <PIG_MOVED> | <PIG_NEW> | <NEED_MEDIC> | <NONE>;

operations	static public DebugPrint: seq of char ==> ()	DebugPrint(text) ==	(		def file = new IO()		in		def - = file.writeval[seq of char](text) in skip;	);
end IIOSSTYPES


~~~
{% endraw %}

###Sensor.vdmrt

{% raw %}
~~~

class Sensor is subclass of IIOSSTYPES instance variables	private stableController : StableController;	private pigs: set of PigId := {}; 

operations	public Sensor: StableController ==> Sensor	Sensor(controller) == 	(			stableController := controller;		return self;	);

	async public trip : EventType * PigId * [Position] ==> ()	trip(eventType,pigId, position) == 	(		if (eventType = <PIG_NEW>) then		(			stableController.AddPig(pigId, self, position);		) 		elseif (eventType = <PIG_MOVED>) then		(			stableController.RemovePig(pigId);		);	); 
end Sensor


~~~
{% endraw %}

###Server.vdmrt

{% raw %}
~~~

class Server is subclass of IIOSSTYPES
types	private medicTime = EventId * PigId * Time;instance variables	private io : IO := new IO();	--mapper gateway til gris ID	private stables : map PigId to StableController := {|->}; --map pigId to controller
	private medicTimes : seq of medicTime := [mk_(1,1,5000), mk_(2,5,8000)];	private busy : bool := false;
operations
	public GetNoPigs: () ==> nat	GetNoPigs() == return card dom stables;
	public PointAtPig: EventId * PigId ==> ()	PointAtPig(eventid, pigId) == 	(		if (pigId not in set dom stables) then		(			World`env.handleEvent(eventid, <SHOW_PIG>,                                   " Pig " ^ VDMUtil`val2seq_of_char[nat](pigId)                                   ^" not in stable: " ,                                   time);		)		else 		(			let stbCtrl = stables(pigId) in			(				stbCtrl.PointAtPig(eventid, pigId);			)		);	);
	-- Add a Pig to 	async public AddPig: PigId * StableController ==> ()	AddPig(pigID, stableController) ==	(		stables := stables munion {pigID |-> stableController};	)	pre pigID not in set dom stables	post card dom stables = card dom stables~ + 1;
		-- Remove a Pig 	async public RemovePig: PigId ==> ()	RemovePig(pigID) ==	(		stables := {pigID} <-: stables;	)	pre pigID in set dom stables 	post card dom stables + 1 = card dom stables~;
	public NeedMedic : () ==> ()	NeedMedic() ==	(			if (not medicTimes = []) then		(  			def mk_(eventid, pigid, t) = hd medicTimes in 			if (time  > t) then			(				if (pigid in set dom stables) then				(					World`env.handleEvent(eventid, <NEED_MEDIC>,                                           " " ^ VDMUtil`val2seq_of_char[nat](pigid),                                           time);
				);				medicTimes := tl medicTimes;						);		)		else		(			busy := false;		);	);
	public isFinished: () ==> ()	isFinished () == skip
sync	mutex(AddPig);	mutex(RemovePig);	mutex(RemovePig,AddPig);    mutex(NeedMedic);
	per PointAtPig => card rng stables > 0;
	per isFinished => not busy
thread	periodic (1000E6,0,0,0) (NeedMedic)end Server


~~~
{% endraw %}

###StableController.vdmrt

{% raw %}
~~~

class StableController is subclass of IIOSSTYPES
instance variables	private parent: Server;
	private sensors: map Sensor to PigStyId := {|->}; --map sensor to grisesti	private actuators: inmap Actuator to PigStyId := {|->}; --map actuator to grisesti
	private busy : bool := false;
	private pigsInSty : map PigPosition to PigStyId := {|->}; --map pigID to pigsty;
operations	public StableController : Server ==> StableController	StableController(srv) ==	(		parent := srv;		return self;	);
	-- Add a Pig to pigSty and inform the server	public AddPig: PigId * Sensor * Position ==> ()	AddPig(pigID, sensor, position) ==	(		dcl pigStyId: PigStyId := sensors(sensor);  		dcl pigPos : PigPosition := mk_PigPosition(pigID,position);		pigsInSty := pigsInSty munion {pigPos |-> pigStyId};		parent.AddPig(pigID, self);	)	pre sensor in set dom sensors; 

	-- Remove a Pig from pigSty and inform the server	public RemovePig: PigId ==> ()	RemovePig(pigID) ==	(		--dcl pigStyId: PigStyId := sensors(sensor);		dcl pigPosition : PigPosition := mk_PigPosition(pigID, mk_Position(0,0));		pigsInSty := {pigPosition} <-: pigsInSty;		parent.RemovePig(pigID); 	) 	pre exists pp in set dom pigsInSty & pp.id = pigID;

	async public PointAtPig: EventId * PigId ==> ()	PointAtPig(eventId, pigId) == 	(		-- find pig		let pigPos in set dom pigsInSty be st pigPos.id = pigId in 		(			-- find pigStyID			for all pigStyID in set rng pigsInSty do			(  				if (pigPos.id = pigId) then				(					let invActuators = inverse actuators in					(						--World`env.handleEvent(1, <SHOW_PIG>, " " ^ [pigId], time);						invActuators( pigStyID ).SetValues(eventId, pigPos);						return;					);				);			);		);	);	--Pre inmap TODO
	public AddActuator: Actuator * PigStyId ==> ()	AddActuator(act, sti) ==	(		actuators := actuators munion {act |-> sti};	)	pre act not in set dom actuators; 
	public AddSensor: Sensor * PigStyId ==> ()	AddSensor(sens, sti) ==	(		sensors := sensors munion {sens |-> sti};	)	pre sens not in set dom sensors;

sync	mutex(AddSensor);	mutex(AddActuator);	mutex(RemovePig,AddPig);	mutex(AddPig);	mutex(RemovePig);	--mutex(PointAtPig);
end StableController


~~~
{% endraw %}

###IIOSSTest.vdmrt

{% raw %}
~~~

class IIOSSTestoperations	public Execute: () ==> ()	Execute () ==	    (dcl ts : TestSuite := new TestSuite();	     ts.AddTest(new IIOSSTestCase2("Unit test"));	     ts.Run()		)
end IIOSSTest

~~~
{% endraw %}

###IIOSSTestCase2.vdmrt

{% raw %}
~~~

class IIOSSTestCase2 is subclass of TestCaseinstance variables	world : World;	stbCtr : StableController;
operations	public IIOSSTestCase2: seq of char ==> IIOSSTestCase2	IIOSSTestCase2(nm) == name := nm;
	protected SetUp: () ==> ()	SetUp () == --skip;	(		world := new World();		stbCtr := new StableController(IIOSS`server);	);
	-- inline = EventId * EventType * PigId * [Position] * PigStyId * Time;	protected RunTest: () ==> ()	RunTest () ==     (    	ServerTest();    	EnvTest();    );
    private ServerTest : () ==> ()    ServerTest() ==    (    	(dcl serv : Server := new Server();    		serv.PointAtPig(1,1);    	    	    		world.env.showResult();
    	let reaction = world.env.GetAndPurgeOutlines()  		in   			AssertTrue(len reaction = 1);  		    	
  			serv.AddPig(1, stbCtr);  			AssertTrue(serv.GetNoPigs() = 1);  			  			
  			serv.RemovePig(3);  			AssertFalse(serv.GetNoPigs() = 0);
  			serv.RemovePig(1);  			AssertTrue(serv.GetNoPigs() = 0);  		)
    );
    private EnvTest: () ==> ()    EnvTest() ==    (    	let env = world.env    	in    	(    		--env.addServer(serv);    		AssertTrue(IIOSS`server = env.getServer());
    		AssertTrue(env.getNoSensors() = 4);    	)    );

	protected TearDown: () ==> ()	TearDown () == skip
end IIOSSTestCase2

~~~
{% endraw %}

###Test.vdmrt

{% raw %}
~~~

class Test
operations	public Run: TestResult ==> ()	Run (-) == is subclass responsibility
end Test

~~~
{% endraw %}

###TestCase.vdmrt

{% raw %}
~~~

class TestCase  is subclass of Test
instance variables  protected name : seq of char
operations	public TestCase: seq of char ==> TestCase	TestCase(nm) == name := nm;
	public GetName: () ==> seq of char	GetName () == return name;
	protected AssertTrue: bool ==> ()	AssertTrue (pb) == if not pb then exit <FAILURE>;
	protected AssertFalse: bool ==> ()	AssertFalse (pb) == if pb then exit <FAILURE>;
	public Run: TestResult ==> ()	Run (ptr) == 	    trap <FAILURE>	      with 	        ptr.AddFailure(self)	      in	        (SetUp();		 RunTest();		 TearDown());
	protected SetUp: () ==> ()	SetUp () == is subclass responsibility;
	protected RunTest: () ==> ()	RunTest () == is subclass responsibility;
	protected TearDown: () ==> ()	TearDown () == is subclass responsibility
end TestCase

~~~
{% endraw %}

###TestResult.vdmrt

{% raw %}
~~~

--The class \vdmstyle{TestResult} maintains a collection--of references to test cases that have failed. The--exception handler defined in the operation \vdmstyle{Run}--of class \vdmstyle{TestCase} calls the operation--\vdmstyle{AddResult}, which will append the object--reference of the test case to the tail of the sequence--\vdmstyle{failures}. The operation \vdmstyle{Show} is used--to print a list of test cases that have failed or--provide a message to indicate that no failures were--found. Note that the standard I/O library, which is--supplied with \vdmtools, is used here. \vdmstyle{IO.echo}--prints a string on the standard output, just like --\vdmstyle{System.out.println} in Java. The \emph{def--statement} is used to suppress the boolean value --returned by \vdmstyle{IO.echo}:\sindex{IO standard library}
class TestResult
instance variables  failures : seq of TestCase := []
operations	public AddFailure: TestCase ==> ()	AddFailure (ptst) == failures := failures ^ [ptst];
	public Print: seq of char ==> ()	Print (pstr) ==		def - = new IO().echo(pstr ^ "\n") in skip;
	public Show: () ==> ()	Show () ==	    if failures = [] then	      Print ("No failures detected")	    else	      for failure in failures do	        Print (failure.GetName() ^ " failed")
end TestResult

~~~
{% endraw %}

###TestSuite.vdmrt

{% raw %}
~~~

class TestSuite  is subclass of Test
instance variables  tests : seq of Test := [];
operationspublic Run: () ==> ()  Run () ==    (dcl ntr : TestResult := new TestResult();     Run(ntr);     ntr.Show());
public Run: TestResult ==> ()  Run (result) ==    for test in tests do      test.Run(result);
public AddTest: Test ==> ()  AddTest(test) ==    tests := tests ^ [test];
end TestSuite

~~~
{% endraw %}

###World.vdmrt

{% raw %}
~~~

class World
instance variables
	-- maintain a link to the environment	public static env : [Environment] := nil;
operations
	public World: () ==> World	World () ==	(	   -- set-up the sensors	   env := new Environment("scenario.txt");
		-- add sensors	   env.addSensor(IIOSS`sensor1);	   env.addSensor(IIOSS`sensor2);	   env.addSensor(IIOSS`sensor3);	   env.addSensor(IIOSS`sensor4);
	   --server	   env.addServer(IIOSS`server);
		-- controller 1										--AddSensor(sensor, PigStyId)	   IIOSS`StableController1.AddSensor(IIOSS`sensor1,1);	   IIOSS`StableController1.AddSensor(IIOSS`sensor2,2); 
	   IIOSS`StableController1.AddActuator(IIOSS`actuator1,1);	   IIOSS`StableController1.AddActuator(IIOSS`actuator2,2);

		-- controller 2							--AddSensor(sensor, PigStyId)	   IIOSS`StableController2.AddSensor(IIOSS`sensor3,3);	   IIOSS`StableController2.AddSensor(IIOSS`sensor4,4);
	   IIOSS`StableController2.AddActuator(IIOSS`actuator3,3);	   IIOSS`StableController2.AddActuator(IIOSS`actuator4,4);
	   --env.isFinished();
		start(IIOSS`server);
	 );  

	public Run: () ==> ()	Run () == 	(	   IIOSSTYPES`DebugPrint("************************************************");	   IIOSSTYPES`DebugPrint("** World class started ");	   IIOSSTYPES`DebugPrint("************************************************");	   start (env);	   env.isFinished();	   IIOSS`server.isFinished();	   env.showResult();   	   IIOSSTYPES`DebugPrint("************************************************");	   IIOSSTYPES`DebugPrint("** World class ended ");	   IIOSSTYPES`DebugPrint("************************************************");	)
end World


~~~
{% endraw %}

