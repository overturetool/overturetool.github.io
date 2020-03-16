---
layout: default
title: BuslinesPP
---

## BuslinesPP
Author: Claus Ballegaard Nielsen


This example models bus lines in a city, in which passengers are to be 
transferred from stop to stop. Passengers with specific destinations 
will arrive at a central station, and the route and flow of the buses 
need to be planned to service the passenger in the best possible way. 
The number and routes of buses as wells as the inflow of passengers are 
variables. 
 
 Remote Debugger must be set to remote class:
	gui.BuslinesRemote
 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### Waypoint.vdmpp

{% raw %}
~~~
class Waypoint

	types
		public BusStops = <A> | <B> | <C> | <D> | <E> | <F> | <Central>;
		public WaypointsEnum = <WP1> | <WP2> | <WP3> | <WP4> | BusStops;	

	instance variables
		protected id : WaypointsEnum;
		protected isStop : bool := false;

	operations
		public Waypoint : Waypoint`WaypointsEnum ==> Waypoint
		Waypoint(s) == 
		(
			id := s;
		);

		pure public GetId : () ==> WaypointsEnum
		GetId()== return id;

		pure public IsStop: () ==> bool
		IsStop()== return isStop;


end Waypoint
~~~
{% endraw %}

### Environment.vdmpp

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

instance variables

	public city : City;
	private io : IO := new IO();
	private inlines : seq of inline := [];
	private outlines : seq of char := [];
	private busy : bool := true;
	private simulating : bool := false;

	private passengersTransported : nat := 0;
	private passengersAnnoyed : nat := 0;
	private passengersCount : nat :=0;
	private passengersAnnoyedStops :  map Waypoint`WaypointsEnum to nat := {|->};

types   
	inline  = Types`Event;
	InputTP   = seq of inline;

operations

	public Environment: seq of char ==> Environment
	Environment(filename) ==
	(
		city := new City();

		def mk_(-,input) = io.freadval[InputTP](filename) in
		(
			inlines := input;
		);	 

		BuildCityMap();
	);

	private BuildCityMap : () ==> ()
	BuildCityMap() ==
	(
		dcl a : Busstop, b : Busstop, c : Busstop, d : Busstop, e : Busstop, f :Busstop;
		dcl wp1 : Waypoint, wp2 : Waypoint, wp3 : Waypoint, wp4 : Waypoint;

		a := city.addBusstop(<A>);
		b := city.addBusstop(<B>);
		c := city.addBusstop(<C>);
		d := city.addBusstop(<D>);
		e := city.addBusstop(<E>);
		f := city.addBusstop(<F>);

		wp1 := city.addWaypoint(<WP1>);
		wp2 := city.addWaypoint(<WP2>);
		wp3 := city.addWaypoint(<WP3>);
		wp4 := city.addWaypoint(<WP4>);
		
		city.addRoad(a, b, <R1>, 40);
		city.addRoad(b, wp1, <R2>, 80);
		city.addRoad(b, wp2, <R3>, 50);
		city.addRoad(a, wp2, <R4>, 90);
		city.addRoad(wp2, c, <R5>, 60);
		city.addRoad(c, d, <R6>, 40);
		city.addRoad(c, f, <R7>, 60);
		city.addRoad(f, city.getCentralStation(), <R8>, 100);
		city.addRoad(city.getCentralStation(), wp3, <R9>, 50);
		city.addRoad(wp3, wp4, <R10>, 30);
		city.addRoad(d, wp4, <R11>, 40);
		city.addRoad(wp3, e, <R12>, 40);
		city.addRoad(e, wp1, <R13>, 40);
		city.addRoad(wp1, d, <R14>, 30);
		city.addRoad(f, wp4, <R15>, 20);
		city.addRoad(wp1, wp3, <R16>, 40);
		city.addRoad(a, city.getCentralStation(), <HW1>, 310, Config`DefaultRoadSpeedLimit + 10);
	);	

  
	public Events: () ==> ()
	Events() ==
	(
	   if inlines <> []
	   then 
	   (  
	    dcl done : bool := false, 
	    eventOccurred : bool := false,
	    curtime : Types`Time := World`timerRef.GetTime();
	
		while not done do
		(
	     def event = hd inlines in      
			cases event:
				mk_Types`BusRoute(-,-,-) ->
				(
					if event.t <= curtime
					then
					(
					    Printer`OutWithTS("Environment: Bus route "
					     					 ^ Printer`natToString(event.ID)); 

						let b = city.addBus(event.ID, event.route) in  
						( 
							Printer`Out("Waypoints:");
							let wps = b.GetWaypoints() in 
								let wpsIds = [wp.GetId() | wp in seq wps] in 
									IO`print(wpsIds);

							Printer`Out("\nStops:");

							let wps = b.GetStops() in 
								let wpsIds = [wp.GetId() | wp in seq wps] in 
									IO`print(wpsIds);
							Printer`Out("\n");
						);

				    	 eventOccurred := true;
					)
			    ),
			    mk_Types`Inflow(-,-) ->
			    (
				    if event.t <= curtime
					then
					(
						SetInflow(event.flow);
				    	
				     	eventOccurred := true;
				     )
			    ),
			    mk_Types`Simulate(-) ->
			    (
			    	if event.t <= curtime
					then
					(
						if not simulating then
						(
							Printer`OutWithTS("Environment: " 
				    					  ^ "Simulation started");
							simulating := true;
							start(city);
							city.WaitForThreadStart();
							for all bus in set city.getBuses() do 
							(
								start(bus);
								bus.WaitForThreadStart();
							);

						); 
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
	
			if eventOccurred then
		  	(
		  		inlines := tl inlines;
		  		done := len inlines = 0;  
		  	) 
		  	else 
				done := true;
			  
			eventOccurred := false;
	    	);
		  )
	      else busy := false;
	);
   
	public handleEvent : seq of char ==> ()
	handleEvent(s) ==
	(
	   Printer`OutWithTS("#Environment handled System Event: " ^ s);
	   outlines := outlines ^ Printer`natToString(World`timerRef.GetTime()) ^ ": " ^ s ^ "\n"; 
	);

	private SetInflow : nat  ==> ()
	SetInflow(flow)== 
	(
		Printer`OutWithTS("Environment: " 
		  ^ "Inflow changed to " ^ Printer`natToString(flow));
				     
		city.setInflow(flow);
	);

	public IncreaseInflow : () ==> ()
	IncreaseInflow() ==
	(
		let flow = city.getInflow() in 
		(
			if(flow < Config`MaxInflow) then
				SetInflow(flow +1);
		)
	);

	public DecreaseInflow : () ==> ()
	DecreaseInflow() ==
	(
		let flow = city.getInflow() in 
		(
			if(flow > 0) then
				SetInflow(flow -1);
		)
	);

	public TransportedPassengers : nat ==> ()
	TransportedPassengers(number)== 
		passengersTransported := passengersTransported + number;

	--public AnnoyedPassenger : nat * Waypoint`WaypointsEnum ==> ()
	--AnnoyedPassenger(number, waypoint)== 
	public AnnoyedPassenger : nat * Waypoint`WaypointsEnum ==> ()
	AnnoyedPassenger(number, goal)==
	(
		passengersAnnoyed := passengersAnnoyed + number;

		if(goal not in set dom passengersAnnoyedStops) then 
		(
			passengersAnnoyedStops := passengersAnnoyedStops ++ {goal |-> number};
		)
		else
			passengersAnnoyedStops := passengersAnnoyedStops ++ {goal |-> passengersAnnoyedStops(goal) + number};
	);

	public PassengerCount : () ==> ()
	PassengerCount()== 
		passengersCount := passengersCount + 1;
	
	public report : () ==> ()
	report() ==
	(
		Printer`Out("\n\nHowever beautiful the strategy," ^ 
	  					" you should occasionally look at the results.");
	  	Printer`Out("**************RESULT**************");
	  	Printer`Out("**********************************");
	  	--Printer`Out(outlines);
	  	Printer`Out(" " ^ VDMUtil`val2seq_of_char[nat](passengersCount) ^ "\t passengers in total. (transported and at central)");	
		Printer`Out(" " ^ VDMUtil`val2seq_of_char[nat](passengersTransported) ^ "\t passengers transported.");
		Printer`Out(" " ^ VDMUtil`val2seq_of_char[nat](passengersAnnoyed) ^ "\t passengers got annoyed.");	

		
		for all waypoint in set dom passengersAnnoyedStops do
		(	
			Printer`Out("\t" ^ VDMUtil`val2seq_of_char[Waypoint`WaypointsEnum](waypoint) ^ " : " ^ VDMUtil`val2seq_of_char[nat](passengersAnnoyedStops(waypoint)));

		);
	  	Printer`Out("\n**********************************");
		Printer`Out("**********************************");
	);
   
	public isFinished : () ==> () 
  	isFinished() == skip;

  	public goEnvironment : () ==> () 
	goEnvironment() == skip;

	public run : () ==> ()
	run() ==
	(
    	start(self);
	);

thread
(
	start(new ClockTick());
	while busy do
  	(
   		Events();
		World`timerRef.WaitRelative(0);
		World`timerRef.NotifyAndIncTime();
    	World`timerRef.Awake();
		World`graphics.move();
		World`graphics.sleep();
 	);
 
 	Printer`Out("No more events;");
)

sync
	per isFinished => not busy;
	mutex(handleEvent)

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
wakeUpMap    : map nat to nat := {|->};
--syncWithTimeInc : set of nat := {};
--syncWithTimeIncCurrent : set of nat := {};

operations

                                                                                                                      

public WaitRelative : nat ==> ()
WaitRelative(val) ==
  AddToWakeUpMap(threadid, currentTime + val);
 
                                                                                          
 
public WaitAbsolute : nat ==> ()
WaitAbsolute(val) ==
  AddToWakeUpMap(threadid, val);

                                                                                                  

AddToWakeUpMap : nat * nat ==> ()
AddToWakeUpMap(tId, val) ==
   wakeUpMap := wakeUpMap ++ { tId |-> val };

                                                                                                     

public NotifyThread : nat ==> ()
NotifyThread(tId) ==
 wakeUpMap := {tId} <-: wakeUpMap;

                                                                                                       

public NotifyAll : () ==> ()
NotifyAll() ==
  let threadSet : set of nat = {th | th in set dom wakeUpMap & wakeUpMap(th) <= currentTime }
  in
    for all t in set threadSet 
    do
      NotifyThread(t);

                                                                                                                                                                                                

public NotifyAndIncTime : () ==> ()
NotifyAndIncTime() ==
 (
  		currentTime := currentTime + stepLength;
 	 	NotifyAll();
--		syncWithTimeIncCurrent := syncWithTimeInc; 
 );

                                                             

public GetTime : () ==> nat
GetTime() ==
  return currentTime;

                                                                                                                    

public Awake: () ==> ()
Awake() == skip;

                                                                                                                                                                                                                                                                                                                                                          

--public SyncWithTimeIncrement : () ==> ()
--SyncWithTimeIncrement() ==	
--(
--	syncWithTimeInc := syncWithTimeInc union {threadid}; --keep track of all
--	syncWithTimeIncCurrent := syncWithTimeIncCurrent union {threadid}; --include in current sync round
--	skip;
--);

--public YieldTimeIncrement: () ==> ()
--YieldTimeIncrement()==
--(
--	syncWithTimeIncCurrent := syncWithTimeIncCurrent \ {threadid};
--	skip
--);


sync
  per Awake => threadid not in set dom wakeUpMap;

  per NotifyAndIncTime => (card {th | th in set dom wakeUpMap & wakeUpMap(th) = currentTime +1} > 0) ;  --The magic one,  only allow run
--  per NotifyAndIncTime => ({th | th in set dom wakeUpMap & wakeUpMap(th) <= currentTime} inter syncWithTimeIncCurrent) = {};

  mutex(NotifyAll);
  mutex(AddToWakeUpMap);
  mutex(AddToWakeUpMap, NotifyAll); 
--  mutex(SyncWithTimeIncrement);
--  mutex(YieldTimeIncrement);
--  mutex(SyncWithTimeIncrement, YieldTimeIncrement, NotifyAndIncTime);

end TimeStamp
                                                                                         
~~~
{% endraw %}

### Printer.vdmpp

{% raw %}
~~~
class Printer

	operations		
		public static Out: seq of char ==> ()
		 Out (pstr) ==
		   def - = new IO().echo(pstr ^ "\n") in skip;
		    
		
		public static natToString : nat ==> seq of char 
		natToString(n) ==
		(
			return VDMUtil`val2seq_of_char[nat](n);
		);

		  
		public static OutWithTS: seq of char ==> ()
		OutWithTS (pstr) ==
    		def - = new IO().echo(Printer`natToString(World`timerRef.GetTime()) ^": " ^ pstr ^ "\n") in skip;


		public static intToString : int ==> seq of char 
		intToString(i) ==
		(
			return VDMUtil`val2seq_of_char[int](i);
		);

end Printer
~~~
{% endraw %}

### City.vdmpp

{% raw %}
~~~
class City

	instance variables
		wayspoints : set of Waypoint := {};
		
		stops : inmap Waypoint`BusStops to Busstop := {|->};	
		roads : inmap Road`RoadNumber to Road := {|->};	
		buses : inmap nat to Bus := {|->};
		central : Busstop;
		inflow : nat; 

	operations
		public City : () ==> City
		City()== 
		(
			central := addBusstop(<Central>);
			inflow := 1; --default inflow value
		);		

		
		--add a new busStop to the city
		public addBusstop : Waypoint`BusStops ==> Busstop 
		addBusstop(stp) == 
		(
			let bs = new Busstop(stp) in 
			(
				stops := stops munion {stp|->bs};
				wayspoints := wayspoints union {bs};
				return bs
			)
		)
		pre stp not in set dom stops; 


		--add waypoint to the city, pasengers can not get off at a waypoint
		public addWaypoint : Waypoint`WaypointsEnum ==> Waypoint 
		addWaypoint(stp) == 
		(
			let wp = new Waypoint(stp) in 
			(
				wayspoints := wayspoints union {wp};
				return wp;
			)
		)
		pre stp not in set dom stops;


		--add road to the city, a road are end to end and must have to waypoints and a roadnumber 
		-- the length of the road has significance to travel time of the bus
		public addRoad : Waypoint * Waypoint * Road`RoadNumber * nat ==> ()
		addRoad(wp1, wp2, roadNmbr, length) ==	
		(
			let r = new Road(roadNmbr, {wp1, wp2}, length) in
			(
				roads := roads munion {roadNmbr |-> r};
			);
		)
		pre roadNmbr not in set dom roads --road number not used before
		and wp1 <> wp2	--not the same wp, a road to the same wp is not a road
		and forall r in set rng roads & not r.Covers({wp1, wp2}); --  waypoint not connected before



		--overloaded addRoad, which allows for the speedlimit of the road to be change from
		-- the default value
		public addRoad : Waypoint * Waypoint * Road`RoadNumber * nat * nat==> ()
		addRoad(wp1, wp2, roadNmbr, length ,speedlimit) ==	
		(
			let r = new Road(roadNmbr, {wp1, wp2}, length, speedlimit) in
			(
				roads := roads munion {roadNmbr |-> r};		
			)
		)
		pre roadNmbr not in set dom roads --road number not used before
		and forall r in set rng roads & not r.Covers({wp1, wp2}) --  waypoint not connected before
		and wp1 <> wp2;	--not the same wp, a road to the same wp is not a road

		--add a new bus with a particular road 
		public addBus : nat * seq of Road`RoadNumber ==> Bus
		addBus(lineNumber, route)==
		(
			--validate that route is possible and finds waypoints along route  	
			dcl busstops : seq of Waypoint := [];
			dcl currentWP : Waypoint;
			--find roads from ids
			let busRoads = findRoadsFromRoadNumber(route) in
			(
					--always start from central
					currentWP := central;
					busstops := [currentWP];

					--find busstops on the route, starting from central
					for all i in set inds busRoads do
					(
						--stepwise move along route
						currentWP := busRoads(i).OppositeEnd(currentWP);
						busstops := busstops ^ [currentWP];
					);
								

				if (hd busstops <> busstops(len(busstops))) then
					exit "End not the same as start "; --change to pre? 
				
				--creat bus	
				let bus = new Bus(lineNumber, busRoads, busstops) in 
				(
					--add to mapping
					buses := buses munion {lineNumber |-> bus};
					--
					World`graphics.busAdded(lineNumber);
					return bus;
				)	
			);
		)
		pre len route > 1 --there actually is a route
		and lineNumber not in set dom buses; --bus linenumber is not known


		pure private findRoadsFromRoadNumber : seq of Road`RoadNumber ==> seq of Road
		findRoadsFromRoadNumber(route)==  
				return [roads(elem) | elem in seq route]; 

		pure public getCentralStation : () ==> Busstop
		getCentralStation()== 
			return central;

		--passenger inflow
		public setInflow : nat ==> ()
		setInflow(flow) ==	
		(			
			inflow := flow;
			World`graphics.inflowChanged(inflow);
		);

		pure public getInflow : () ==> nat
		getInflow()==
			return inflow;

		pure public getBuses : () ==> set of Bus
		getBuses()==
			return rng buses;
		
		--sync functionality for ensuring thread is started, 
		--due to lack of thread scheduling fairness
		public WaitForThreadStart : () ==> ()
		WaitForThreadStart() == skip;

		private ThreadStarted : () ==> ()
		ThreadStarted() == skip;

	sync
		--mutex(setInflow);
		--mutex(setInflow, getInflow);
		per WaitForThreadStart => #fin(ThreadStarted) > 0

	thread
	(
		ThreadStarted();
		while true do
		(
			--add passengers to central station
				for all - in set {1,...,getInflow()} do
				(
					--random find stop for passenger to get off
					let stopSeq = VDMUtil`set2seq[Waypoint`BusStops](dom stops) in  --TODO exclude central
						let i = MATH`rand(World`timerRef.GetTime()) mod len stopSeq  in
							let pass = new Passenger(stops(stopSeq(i+1))) in 
							(
								--let pass = new Passenger(stops(<A>)) in --TODO
								central.AddPassenger(pass);
								World`graphics.passengerAtCentral(pass.Id(), 
									VDMUtil`val2seq_of_char[Waypoint`WaypointsEnum]
									(pass.GetDestination().GetId()));
							)
				);

			World`env.handleEvent(Printer`natToString(central.GetWaitingCount()) ^ " passengers waiting a central station");
			
			--check annoyance of waiting passengers
			for all pass in set central.GetWaiting() do
				pass.AnnoyedOfWaiting();

			World`timerRef.WaitRelative(5);
   			World`timerRef.NotifyAll();
   			World`timerRef.Awake();
		) 
	)

end City
~~~
{% endraw %}

### WaitNotify.vdmpp

{% raw %}
~~~
              
class WaitNotify

instance variables

waitset : set of nat := {}

operations

public Wait : () ==> ()
Wait() ==
( AddToWaitSet (threadid);
  Awake()
);
	
public Notify : () ==> ()
Notify() ==
  let p in set waitset in
    waitset := waitset \ {p};

public NotifyThread: nat ==> ()
NotifyThread(tId) ==
  waitset :=  waitset \ {tId};

public NotifyAll: () ==> ()
NotifyAll() ==
  waitset :=  {};

private AddToWaitSet : nat ==> ()
AddToWaitSet(n) ==
  waitset := waitset union {n};

private Awake : () ==> ()
Awake() == skip

sync
per Awake => threadid not in set waitset;
mutex(AddToWaitSet)

end WaitNotify
                                                                                        
~~~
{% endraw %}

### Config.vdmpp

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
-- Values definition section
--
values

--max passengers on bus
public static BusCapacity : nat = 15;
--speed limit on road, buses will always drive to the limit   		
public static DefaultRoadSpeedLimit : nat = 10;   			
--amount of waiting time beofre passengers become annoyed
public static PassengerAnnoyanceLimit : nat = 40;   	
--max value of passengers inflow 
public static MaxInflow : nat = 10;   	

end Config
~~~
{% endraw %}

### World.vdmpp

{% raw %}
~~~
-----------------------------------------------
-- Class:			World
-- Description: 	World class
-----------------------------------------------

-- Rules of this world
-- In the model, the city map is fixed and the buses and their route are defined in the inputvalues.txt
--
--		 _ _ _ _ WP2_ _ _ _ _ C _ _ _ _ _ _ F _ _ _ _ _R8
--		|		  | 	R5	  |		R7	 R15|		   |
--		|		  |			R6|_ D _ _ _ _ _|WP4	   | 
--		|R4		  |R3			 |	  R11	|		   |
--		|		  |			  R14|			|R10	   |
--	   A|_ _ _ _ B|_ _ _ _ _ _ _ WP1_ _R16_WP3_ _ _ _ _| Central 
--		|	R1			 R2		  |			|	   R9  |
--		|					  R13 |_ _ E _ _|R12	   |
--		|											   |
--		|											   |
--		|_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ | 
--							 HW1
--
-- � Passengers arrive at a certain inflow rate on central station, their destination is randomly picked
-- � Buses always drives at full speed according to the roads speed limit
-- � Passengers will not get on buses that do not pass their stop
-- � Passenger will not change between multiple buses to get to a stop
-- � Buses always drives in cicles. i.e. the start and the stop of a route must be the same
-- � A bus route is defined by roads, and the bus will stop at all stops it passes on these roads
-- � The roads in the bus route must be connected end to end, as the bus can not jump passed pieces of road
-- � Roads are connected by waypoints, some of these waypoints function as bus stops where passengers get off. 

class World

instance variables
public static graphics : gui_Graphics:= new gui_Graphics();

public static env : [Environment] := new Environment("inputvalues.txt");
public static timerRef : TimeStamp := new TimeStamp();  

operations

	public World: () ==> World
	World() ==
	(
	 	Printer`Out("World created: ");
		Printer`Out("------------------------------------------\n");
	);

	public Run: () ==> ()
	Run() == 
	(
		graphics.init();
		env.run();
	  	env.isFinished();

		env.report();

	  	Printer`Out("End of this world");
	);




end World
~~~
{% endraw %}

### Passenger.vdmpp

{% raw %}
~~~
class Passenger

	instance variables
		static nextPassengerId : nat := 1;

		passengerId : nat;
		goal :  Waypoint;
		inv goal.IsStop() = true;		

		annoyanceLimit : nat;
		pickedUp : bool;
		alreadyAnnoyed : bool;

	operations
		public Passenger : Busstop==> Passenger 
		Passenger(destination) == 
		(
			passengerId := GetNextId();
			goal := destination;
			annoyanceLimit := World`timerRef.GetTime() + Config`PassengerAnnoyanceLimit;
			pickedUp := false;
			alreadyAnnoyed := false;

			World`env.PassengerCount();
		)
		pre destination.IsStop() = true;
		
		pure public GetDestination : () ==>  Waypoint
		GetDestination()== 
			return goal;

		public GotOnBus : () ==> () 
		GotOnBus()== 
		(
			World`graphics.passengerGotOnBus(passengerId);
			pickedUp := true;
		);

		public IsAnnoyedOfWaiting : () ==> bool
		IsAnnoyedOfWaiting() == return annoyanceLimit < World`timerRef.GetTime() 
									and not pickedUp;

		-- report to environment when  passenger becomes annoyed.
		public AnnoyedOfWaiting : () ==> ()
		AnnoyedOfWaiting() == 
		(
			if(IsAnnoyedOfWaiting() and not alreadyAnnoyed) then
			(
				alreadyAnnoyed := true;
				World`env.handleEvent("Passenger " ^ Printer`natToString(passengerId) ^ " heading for " ^ 
				 VDMUtil`val2seq_of_char[Waypoint`WaypointsEnum](goal.GetId()) ^ " is annoyed of waiting.");			
				World`env.AnnoyedPassenger(1, goal.GetId());
				World`graphics.passengerAnnoyed(passengerId);
			)
		);

		pure public Id : () ==> nat
		Id()== 
			return passengerId;
	
		private GetNextId : () ==> nat
		GetNextId() ==
		(
			let pid = nextPassengerId 
			in 
			(
				nextPassengerId := nextPassengerId +1;
				return pid;
			)

		);

	sync
		mutex(GotOnBus, AnnoyedOfWaiting);

end Passenger
~~~
{% endraw %}

### Types.vdmpp

{% raw %}
~~~
class Types

types   
public Time = nat;
public Direction = <NORTH> | <SOUTH> | <EAST> | <WEST>;

public Event = BusRoute | Inflow | Simulate | WasteTime;

public BusRoute ::
        ID : nat
		route : seq of Road`RoadNumber
		t : Time;
        
public Inflow ::
        flow : nat
        t : Time; 
        
public Simulate ::
        t : nat;   
        
public WasteTime ::
        t : Time;
            
functions 
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

### Busstop.vdmpp

{% raw %}
~~~
class Busstop is subclass of Waypoint

	instance variables
		waiting : set of Passenger := {};

	operations
		public Busstop : Waypoint`BusStops ==> Busstop
		Busstop(s) == 
		(
			id := s;
			isStop := true;
		);

		--number of passenger waiting
		pure public GetWaitingCount : () ==> nat
		GetWaitingCount() ==
			return card waiting;
		
		--get passengers waiting
		pure public GetWaiting : () ==> set of Passenger
		GetWaiting() ==
			return waiting;

		-- get passengers waiting on a bus which passes specific stops 
		pure public GetWaitingOn : seq of Waypoint==> set of Passenger
		GetWaitingOn(stopsAt)==
			let stops = elems stopsAt in
			return  {p | p in set waiting & {p.GetDestination()} inter stops <> {}};

		--passenger arrived at the busstop
		public AddPassenger : Passenger ==> ()
		AddPassenger(p) == 
			waiting := waiting union {p}; 
		
		--passenger got on a bus
		public PassengerLeft : set of Passenger ==> ()
		PassengerLeft(p) ==
			waiting := waiting \ p
		pre p inter waiting <> {};

sync
	---protect waiting instance variable
	mutex(AddPassenger, PassengerLeft)

end Busstop
~~~
{% endraw %}

### Road.vdmpp

{% raw %}
~~~
class Road
	types
		public RoadNumber = <R1> | <R2> | <R3> | <R4> | <R5> | <R6> | <R7> | <R8> 
			| <R9> | <R10> | <R11> | <R12> | <R13> |<R14> | <R15> | <R16> | <HW1>;
	values

	instance variables
		roadNmbr  : RoadNumber;		
		roadLength : nat;
		speedlimit : nat;
		wps : set of Waypoint := {};
		timePenalty : nat;
		inv card wps > 1;

	operations
		public Road : RoadNumber * set of Waypoint * nat ==> Road
		Road(roadnumber, waypoints, length) ==
		(
			atomic 
			(
			roadNmbr := roadnumber;
			roadLength := length;
			speedlimit := Config`DefaultRoadSpeedLimit;
			wps := waypoints;
			timePenalty := floor(length / Config`DefaultRoadSpeedLimit);
			)
		)
		pre card waypoints > 1;

		public Road : RoadNumber *  set of Waypoint * nat * nat ==> Road
		Road(roadnumber, waypoints, length, limit) ==
		(
			roadNmbr := roadnumber;
			roadLength := length;
			speedlimit := limit;
			wps := waypoints;
			--time cost of driving on the road
			timePenalty := floor(roadLength / speedlimit);
		)
		pre card waypoints > 1;

		pure public Covers : set of Waypoint ==> bool
		Covers(waypoints) == 
			 return {w.GetId() | w in set waypoints} = {w.GetId() | w in set wps};  --does road cover the waypoints in arg

		pure public GetWaypoints : () ==> set of Waypoint
		GetWaypoints()==
				return wps;

		pure public OppositeEnd : Waypoint ==> Waypoint
		OppositeEnd(wp)==
				 let opposite in set wps \ {wp} in return opposite
		pre wp in set wps; 	-- if the waypoint is not found on the road
						-- it may indicate that the route is not connected 
						-- by the same waypoint

		
		pure public GetSpeedLimit : () ==> nat
		GetSpeedLimit()==
				return speedlimit;

		pure public GetLength : () ==> nat
		GetLength() == 
			return roadLength;

		pure public GetRoadNumber : () ==> RoadNumber
		GetRoadNumber()== 
				return roadNmbr;

		pure public GetTimePenalty : () ==> nat
		GetTimePenalty()== 
				return timePenalty;

end Road
~~~
{% endraw %}

### Bus.vdmpp

{% raw %}
~~~
class Bus
	
	instance variables
		seats : set of Passenger;
		inv card seats <= Config`BusCapacity;
		
		--bus line number
		line : nat;

		-- the route of road the bus is moving along
		route : seq of Road;
		-- what roads are left in the current pass of the route
		curRoute : seq of Road;
		-- where are we heading
		nextWP : Waypoint;
		-- what road are we currently on
		currentRoad : Road;
		--waypoints passed by the bus
		wps : seq of Waypoint;
		
	operations
		public Bus : nat * seq of Road * seq of Waypoint ==> Bus
		Bus(linenumber, busroute, waypoints)==
		(
			line := linenumber;
			route := busroute;
			curRoute := busroute;
			nextWP := hd waypoints;			

			wps := waypoints;
			seats := {};
		)
		pre len waypoints > 1; --ensure bus has somewhere to go

		public GetOn : set of Passenger ==> ()
		GetOn(ps) == 
		(
			seats := seats union ps;
			World`graphics.busPassengerCountChanged(line, card seats);
		)
		pre card seats + card ps <= Config`BusCapacity; 

		public GotOff : set of Passenger ==> ()
		GotOff(p) == 	
		(
			seats := seats \ p;
			World`graphics.busPassengerCountChanged(line, card seats);
		)
		pre p inter seats <> {};

		pure public GetWaypoints : () ==> seq of Waypoint
		GetWaypoints()== 
			return wps;

		pure public GetStops : () ==> seq of Busstop
		GetStops()== 
			return [wp | wp in seq wps & wp.IsStop() ];
		

		private NextWaypoint : () ==> Waypoint
		NextWaypoint()== 
		(	
			--start route over
			if(len curRoute = 0) then
 				curRoute := route;

			--next road
			let nextRoad = hd curRoute in 
			(
				--move along route
				curRoute := tl curRoute;
				--what road are we on
				currentRoad := nextRoad;
				-- update waypoints
				let currentWp = nextWP  in
				(
					nextWP := currentRoad.OppositeEnd(currentWp);
					return currentWp;
				)
			);
		);

		--functionality to ensure thread start
		public WaitForThreadStart : () ==> ()
		WaitForThreadStart() == skip;

		private ThreadStarted : () ==> ()
		ThreadStarted() == skip;

	sync
		per GetOn => card seats < Config`BusCapacity;
		per WaitForThreadStart => #fin(ThreadStarted) > 0
	
	thread
	(
		dcl passGettingOn : set of Passenger;
		ThreadStarted();
		let - = NextWaypoint() in skip; --prevent return

		--loop which moves bus along route, and lets passengers on and off at stops
		while true do
		(
			Printer`OutWithTS("%Bus " ^ Printer`natToString(line) ^ ": running on " ^ 
									VDMUtil`val2seq_of_char[Road`RoadNumber](currentRoad.GetRoadNumber()) ^
									" with length " ^ Printer`natToString(currentRoad.GetLength()) ^ " and speedlimit " ^
									 Printer`natToString(currentRoad.GetSpeedLimit()) ^
									 " Next: " ^ VDMUtil`val2seq_of_char[Waypoint`WaypointsEnum](nextWP.GetId()) ^
									 " Time: " ^ Printer`natToString(currentRoad.GetTimePenalty())
							);
 
			World`graphics.busInRouteTo(line,
				VDMUtil`val2seq_of_char[Road`RoadNumber](currentRoad.GetRoadNumber()), 
				VDMUtil`val2seq_of_char[Waypoint`WaypointsEnum](nextWP.GetId()),
				currentRoad.GetTimePenalty());

			--add to penalty for moving along road
			World`timerRef.WaitRelative(currentRoad.GetTimePenalty());
   			World`timerRef.NotifyAll();
   			World`timerRef.Awake();

			--next on bus route
			let next = NextWaypoint() in
			( 	
				Printer`OutWithTS("%Bus " ^ Printer`natToString(line) ^ 
				" arrived at " ^ 
				VDMUtil`val2seq_of_char[Waypoint`WaypointsEnum](next.GetId()));

				let nextId = next.GetId() in
				( 
					--let passengers in at central station if 
					--their destination is on the bus' route
					if nextId = <Central> then
					(
						--bus returned with passengers; in the current model this should not be possible
						--if(seats <> {}) then exit "Bus returned with passengers";
						
						let central : Busstop = next in
						( 
							--find passengers for bus
							let potentialPassengers : set of Passenger = central.GetWaitingOn(wps) in 
							(
								if(card potentialPassengers > 0) then
								(
									--count available sets in bus
									if((Config`BusCapacity - card seats) < card potentialPassengers) then 
										--not room for all, select some
										passGettingOn := SelectSubset(potentialPassengers, Config`BusCapacity - card seats)
									else
										passGettingOn := potentialPassengers;
									
									-- leave busstop and enter bus seats
									central.PassengerLeft(passGettingOn);
									GetOn(passGettingOn);
									for all p in set passGettingOn do p.GotOnBus();

									Printer`OutWithTS("%Bus " ^ Printer`natToString(line) ^ ": " ^ 
										Printer`natToString(card passGettingOn) ^ " got on");

									--add to time penalty for stopping
									World`graphics.busStopping(line);
									World`timerRef.WaitRelative(3);
			   						World`timerRef.NotifyAll();
			   						World`timerRef.Awake();
								)
							);
						);
					);					

					-- let passengers off at their destination
					let gettingOff = { p | p in set seats & p.GetDestination() = next} in
					(
							if(card gettingOff > 0) then
							(
								GotOff(gettingOff);
								Printer`OutWithTS("%Bus " ^ Printer`natToString(line) ^ ": " ^ 
									Printer`natToString(card gettingOff) ^ " got off");
								
								World`env.TransportedPassengers(card gettingOff);

								--add to time penalty for stopping
								World`graphics.busStopping(line);
								World`timerRef.WaitRelative(3);
		   						World`timerRef.NotifyAll();
		   						World`timerRef.Awake();
							);
					);
				);
			);

		);
	);

	operations
		pure private SelectSubset : set of Passenger * nat ==> set of Passenger
		SelectSubset(ps, limit)==
		(
			--base case
			if limit = 0 then 
				return {};

			--smaller than limit, return
			if card ps <= limit then 
				return ps;

			--recusive
			let sub in set ps in
					return {sub} union SelectSubset(ps \ {sub}, limit -1); 
		)

end Bus
~~~
{% endraw %}

### gui_Graphics.vdmpp

{% raw %}
~~~
class gui_Graphics
	operations

	    public init : () ==> ()
		init() == is not yet specified;
	
		public busInRouteTo : nat * seq of char * seq of char * nat ==> ()
		busInRouteTo(busid, roadid, waypoint, time) == is not yet specified; 
	
		public move : () ==> ()
		move() == is not yet specified;

		public sleep : () ==> ()
		sleep() == is not yet specified;
	
		public passengerAtCentral : nat * seq of char  ==> ()
		passengerAtCentral(id, waypoint) == is not yet specified;

		public passengerAnnoyed : nat==> ()
		passengerAnnoyed(id) == is not yet specified;
	
		public passengerGotOnBus : nat ==> ()
		passengerGotOnBus(id) == is not yet specified;

		public inflowChanged : nat ==> ()
		inflowChanged(id) == is not yet specified;

		public busAdded : nat ==> ()
		busAdded(id) == is not yet specified;

		public busStopping : nat ==> ()
		busStopping(id) == is not yet specified;

		public busPassengerCountChanged : nat * nat ==> ()
		busPassengerCountChanged(busid, count) == is not yet specified;

end gui_Graphics

~~~
{% endraw %}

### ClockTick.vdmpp

{% raw %}
~~~
class ClockTick

thread 
	while true do
	(
		World`timerRef.WaitRelative(1);
  		World`timerRef.NotifyAll();
  		World`timerRef.Awake();
 	)

 end ClockTick
~~~
{% endraw %}

