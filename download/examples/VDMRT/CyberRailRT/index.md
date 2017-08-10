---
layout: default
title: CyberRailRT
---

## CyberRailRT
Author: Jasper Nygaard and Rasmus Sørensen


This VDM-RT model was produced as a part of an MSn thesis investigating and analyzing
the possibility of obtaining early stage validation of potential candidate system 
architectures, by means of formal modelling and validation. The goal was to analyze 
recent research extensions of VDM++ for describing and analyzing such distributed 
systems (VDM-RT) and see if the language is suitable to stress test a distributed 
system and validate any architectural benefits. Additionally this thesis discusses
favorable approaches for realizing a case study of a transportation system in Tokyo, 
referred to as CyberRail. Different VDM++ models of candidate architectures for the 
CyberRail system has been developed and validated. This thesis includes 2 Real-Time 
VDM++ models (Backend Responsibility source, Joint Responsibility source), based 
on 2 different architectures. 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World("test1_10.txt").run()|
|Entry point     :| new World("test2.txt").run()|


### World.vdmrt

{% raw %}
~~~
                               
class World

instance variables
  protected envCustomer : [Customer] := nil;

operations


  public World : seq of char ==> World
  World(fname) ==
	(
		envCustomer := new Customer(fname);
		envCustomer.addTokenDevice(CRSystem`tok1);
		envCustomer.addTokenDevice(CRSystem`tok2);
		envCustomer.addTokenDevice(CRSystem`tok3);
		envCustomer.addTokenDevice(CRSystem`tok4);
		envCustomer.addTokenDevice(CRSystem`tok5);
		envCustomer.addTokenDevice(CRSystem`tok6);
		envCustomer.addTokenDevice(CRSystem`tok7);
		envCustomer.addTokenDevice(CRSystem`tok8);
		envCustomer.addTokenDevice(CRSystem`tok9);
		envCustomer.addTokenDevice(CRSystem`tok10);
		--envCustomer.addTokenDevice(CRSystem`tok11);
		--envCustomer.addTokenDevice(CRSystem`tok12);
		--envCustomer.addTokenDevice(CRSystem`tok13);

		envCustomer.addCyberRail(CRSystem`cb);
		CRSystem`cb.setQ_APM_out(CRSystem`apm);
		CRSystem`cb.setRailwayGrid(CRSystem`grid);
		CRSystem`apm.setQ_CR_out(CRSystem`cb);
		CRSystem`tok1.setQ_APM_out(CRSystem`apm);
		CRSystem`tok1.setQ_Env_out(envCustomer);

		CRSystem`tok2.setQ_Env_out(envCustomer);
		CRSystem`tok2.setQ_APM_out(CRSystem`apm);

		CRSystem`tok3.setQ_Env_out(envCustomer);
		CRSystem`tok3.setQ_APM_out(CRSystem`apm);

		CRSystem`tok4.setQ_Env_out(envCustomer);
		CRSystem`tok4.setQ_APM_out(CRSystem`apm);

		CRSystem`tok5.setQ_Env_out(envCustomer);
		CRSystem`tok5.setQ_APM_out(CRSystem`apm);

		CRSystem`tok6.setQ_Env_out(envCustomer);
		CRSystem`tok6.setQ_APM_out(CRSystem`apm);
		CRSystem`tok7.setQ_Env_out(envCustomer);
		CRSystem`tok7.setQ_APM_out(CRSystem`apm);
		CRSystem`tok8.setQ_Env_out(envCustomer);
		CRSystem`tok8.setQ_APM_out(CRSystem`apm);
		CRSystem`tok9.setQ_Env_out(envCustomer);
		CRSystem`tok9.setQ_APM_out(CRSystem`apm);
		CRSystem`tok10.setQ_Env_out(envCustomer);
		CRSystem`tok10.setQ_APM_out(CRSystem`apm);
		--CRSystem`tok11.setQ_Env_out(envCustomer);
		--CRSystem`tok11.setQ_APM_out(CRSystem`apm);
		--CRSystem`tok12.setQ_Env_out(envCustomer);
		--CRSystem`tok12.setQ_APM_out(CRSystem`apm);		
		--CRSystem`tok13.setQ_Env_out(envCustomer);
		--CRSystem`tok13.setQ_APM_out(CRSystem`apm);
		
	);

	public test : () ==> TokenDevice
	test () == return CRSystem`tok1;

	public run : () ==>  seq of Logger`logType
	run() == 	
	(
		dcl i : nat := 5;
--		duration(0)
      (
		start(envCustomer);
		start(CRSystem`apm);
		start(CRSystem`cb);
		start(CRSystem`tok1);
		start(CRSystem`tok2);
		start(CRSystem`tok3);
		start(CRSystem`tok4);
		start(CRSystem`tok5);
		start(CRSystem`tok6);
		start(CRSystem`tok7);
		start(CRSystem`tok8);
		start(CRSystem`tok9);
		start(CRSystem`tok10);
		--start(CRSystem`tok11);
		--start(CRSystem`tok12);
		--start(CRSystem`tok13);

		);
		envCustomer.isFinished();
		while i > 0 do
		(
			CRSystem`cb.isFinished();
			CRSystem`apm.isFinished();
			CRSystem`tok1.isFinished();
			CRSystem`tok1.isFinished();
			CRSystem`tok2.isFinished();
			CRSystem`tok3.isFinished();
			CRSystem`tok4.isFinished();
			CRSystem`tok5.isFinished();
			CRSystem`tok6.isFinished();
			CRSystem`tok7.isFinished();
			CRSystem`tok8.isFinished();
			CRSystem`tok9.isFinished();
			CRSystem`tok10.isFinished();
			--CRSystem`tok11.isFinished();
			--CRSystem`tok12.isFinished();
			--CRSystem`tok13.isFinished();
			
			i := i - 1;
		);
		
	
		
		envCustomer.showResults();
		return Logger`printLog();


	);
	
end World
             
~~~
{% endraw %}

### MessageQueue.vdmrt

{% raw %}
~~~
                                      
class MessageQueue

instance variables

queue : seq of Message := [];
size : nat := 0;


types
public String = seq of char;
public FunctionType = <setInactive> | <setActive>; 
public ParamType = nat | String;

public Message::
	funct : FunctionType
	params : seq of ParamType

operations

--Constructor
public MessageQueue : nat ==> MessageQueue
MessageQueue(psize) ==
	size := psize;


public push: Message ==> ()
push(message) ==
	queue := queue ^ [message];

public pop: () ==> Message
pop() == (
	let rtn_data = hd queue
	in
	(
		queue := tl queue;
		return rtn_data;
	)
);

sync
per push => #fin(push) - #fin(pop) < size; 	
--ensure that there's space in the queue
per pop => #fin(push) - #fin(pop) > 0;			
--ensure that there's data in the queue
mutex(pop,push);		
--Only a single activation of pop at a time.
--Have not testet if this sync is enough.	

end MessageQueue
             
~~~
{% endraw %}

### types.vdmrt

{% raw %}
~~~
                                

class MessageTypes

types

--Message Types
public REQUESTPLAN :: 
		navi : CyberRail`NavigationInput 
		tokdev : TokenDevice;
public RETURNPLAN :: 
		plan : TransportPlan`DTO 
		tokdev : TokenDevice;
public CALCPLAN :: 
		navi : CyberRail`NavigationInput 
		tokdev : TokenDevice;
public INACTIVEROUTE :: 
		routeid : nat;
public ACTIVEROUTE :: 
		routeid : nat;
public ADDROUTE :: 
		route : TransportPlan`Route;	 
public REMOVEROUTE :: 
		route : TransportPlan`Route;	 
public STRATEGYINIT :: ;
public STRATEGYEND :: ;
public STRATEGYNOTIFY ::
		routeid : nat;

public MessageT = REQUESTPLAN | RETURNPLAN | CALCPLAN | 
			INACTIVEROUTE | ACTIVEROUTE | ADDROUTE | REMOVEROUTE |
			STRATEGYINIT | STRATEGYEND | STRATEGYNOTIFY;




operations

--public test : MessageT ==> seq of char
--test (cmd) ==
--(
--	cases cmd:
--		mk_MessageTypes`INACTIVEROUTE(-) -> return "inactiveroute",
--		mk_MessageTypes`REQUESTPLAN(-) -> return "request"
--	end;
--	return "fail";
--)

	

end MessageTypes


             
~~~
{% endraw %}

### TokenDevice.vdmrt

{% raw %}
~~~
                                           

class TokenDevice

instance variables

  private id_token : nat := 1;
  private transportPlan : [TransportPlan] := nil;
  private q_Env_out : Environment;
  private q_APM_out : ActivePlanManager;


operations
 
 public TokenDevice : nat ==> TokenDevice
 TokenDevice(id) == 
    id_token := id;


 public notifyPassenger : TransportPlan ==> ()
 notifyPassenger(TransPlan) ==
(
	transportPlan := TransPlan;
	q_Env_out.respons( transportPlan, nil,time);
	Logger`write("Notify "); Logger`write(id_token); Logger`write(time);	
);
    

  public requestTransportPlan : CyberRail`NavigationInput ==> ()
  requestTransportPlan(NavInput) ==
( 
	Logger`write("RequestTP"); Logger`write(id_token); Logger`write(time);
  	q_APM_out.addToClientQueue( mk_MessageTypes`REQUESTPLAN(NavInput, self));
);

public getTokenId : () ==> nat
  getTokenId() == return id_token;

public routeTraveled : () ==> ()
  routeTraveled() == (transportPlan.routeTraveled();
)
pre transportPlan.routesRemaining() > 0;

public setTransportPlan : TransportPlan ==> ()
setTransportPlan(tp) ==	
(
	transportPlan := tp;
);

public travel : () ==> ()
travel () == (
		onTheRoad();
		if( transportPlan <> nil and transportPlan.routesRemaining() > 0 ) 
		then(
		--dcl t : TransportPlan`Route := (transportPlan.getNextRoute());
	transportPlan.routeTraveled(); 
	)
);

public onTheRoad : () ==> ()
onTheRoad () == skip;

public isFinished : () ==> ()
isFinished() == skip;


		


--Setup handles----------------------------------

 
public setQ_Env_out : Environment ==> ()
setQ_Env_out(env)== ( q_Env_out := env; );

public setQ_APM_out : ActivePlanManager ==> ()
setQ_APM_out(apm)== ( q_APM_out := apm; );


thread
periodic(2000E6,100,2900,200000)(travel);

sync

per onTheRoad => (transportPlan <> nil) and (len transportPlan.routeList > 0);

per isFinished => (transportPlan = nil) or (len transportPlan.routeList = 0);

mutex(requestTransportPlan);
mutex(travel);

end TokenDevice

               
~~~
{% endraw %}

### Environment.vdmrt

{% raw %}
~~~
                                     
class Environment

types 

public outline = [TransportPlan] * [nat] * nat;
public inline = [CyberRail`NavigationInput] * [nat] * [nat] * nat;

instance variables
  protected io : IO := new IO();
  protected outfileName : seq of char := "";
  protected  outlines : seq of outline := [];
  protected  inlines : seq of inline := [];
  protected  busy : bool := true;

operations

  public stimulate : () ==> ()
  stimulate() ==
    is subclass responsibility;

  public isFinished : () ==> ()
  isFinished() ==
    is subclass responsibility;

  public respons : [TransportPlan] * [TransportPlan`Route] * nat ==> ()
  respons(plan, route, t) ==
  	(outlines := outlines ^ [mk_(plan,route,t)]);

  public showResults : () ==> ()
  showResults() ==
  def - = io.fwriteval[seq of outline](outfileName,outlines,<start>) in skip;

  public Environment : seq of char ==> Environment
  Environment(fname) ==(
     def mk_ (-,input) = io.freadval[seq of inline](fname) in
   inlines := input;
	outfileName := "Results for " ^ fname;
)

sync
	mutex(respons);
	mutex(showResults);

thread
(
	while true do
	(
		showResults();
	)
)

end Environment

             
~~~
{% endraw %}

### strategy.vdmrt

{% raw %}
~~~
                                       

class Strategy

types


operations

protected strategyInit : () ==> ()
strategyInit() == 
is subclass responsibility;

protected strategyNotify : () ==> ()
strategyNotify() == 
is subclass responsibility;

protected strategyEnd : () ==> ()
strategyEnd() == 
is subclass responsibility;

protected handleEvents : () ==> ()
handleEvents() == 
is subclass responsibility;



end Strategy

             
~~~
{% endraw %}

### Company.vdmrt

{% raw %}
~~~
                                  
class Company is subclass of Environment

instance variables

  private cyberrail : CyberRail;

operations

  public Company : seq of char ==> Company
  Company(fname) ==
   self.Environment(fname);

  public composeTransportGrid : () ==> ()
  composeTransportGrid() ==
    is not yet specified;

	public isFinished : () ==> ()
		isFinished () == skip;

  public stimulate : () ==> ()
  stimulate() ==
  (
		if len inlines > 0
		then (dcl done : bool := false; 
				(
				while not done do(
					def mk_(nav,tid,route_id,t) = hd inlines in
						if t <= time
						then ( cyberrail.setInactiveRoute(route_id);
								inlines := tl inlines
								)
						else
							done :=  true;
					)
				);
			)
			else
				busy := false;
  )

thread
	while true do
	(
		if busy
		then stimulate();
	)

sync

per isFinished => not busy;
end Company

             
~~~
{% endraw %}

### Customer.vdmrt

{% raw %}
~~~
                                  
class Customer is subclass of Environment

instance variables
  public static tokenDevices : map nat to TokenDevice := {|->};
private cyberrail : CyberRail;

operations

public Customer : seq of char ==> Customer
Customer(fname) ==
(
	def mk_ (-,input) = io.freadval[seq of inline](fname) in
		inlines := input;
		
	outfileName := "Results for " ^ fname
);

public Customer : () ==> Customer
Customer()==(
	tokenDevices :=  {0|-> new TokenDevice(0)};
);

public addCyberRail : CyberRail ==> ()
addCyberRail (cr) == cyberrail := cr;

public addTokenDevice : TokenDevice ==> ()
addTokenDevice(td) ==
	--tokenDevices := td;
	tokenDevices := tokenDevices munion { td.getTokenId() |-> td};

	public isFinished : () ==> ()
		isFinished () == skip;

	public test : () ==> map nat to TokenDevice
	test () == return tokenDevices;


  public stimulate : () ==> ()
  stimulate() ==
  (
		duration(1) (
	
		if len inlines > 0
		then( 
				dcl curtime : nat := time,
				done : bool := false; 
				(
				while not done do(
					def mk_(nav,tid,route_id,t) = hd inlines in
						if (t < time)
						then ( 
							if ( route_id = nil )
							then tokenDevices(tid).requestTransportPlan(nav)
							else cyberrail.addToStimuliQueue(
							        mk_MessageTypes`INACTIVEROUTE(route_id));
								
							reduceInline();
							done := len inlines = 0;
						)
						else(
							done :=  true;
						)	
					)
				);
			)
			else(
				busy := false;
				)
	);
  );

private isDone : () ==> ()
isDone() == skip;	

private reduceInline : () ==> ()
reduceInline () == 
(if(len inlines > 0) then
	inlines := tl inlines;
)
pre len inlines > 0;

inputStimuli : () ==> ()
inputStimuli() == 
	(
		duration(1) (
		if len inlines > 0
		then (
			stimulate()
			)
		else (
				busy := false;
		);
	);
);

thread
periodic(2000E6,100,1900,0) (inputStimuli);


sync
mutex(addTokenDevice);
mutex(stimulate);
mutex(reduceInline);
per isFinished => not busy; --Ensure interleaving in World

end Customer

             
~~~
{% endraw %}

### snw.vdmrt

{% raw %}
~~~
                                  


class SNW is subclass of Strategy


instance variables

private state : State := <run>;

types

public State =  <run> | <halt>;

operations




protected strategyInit : () ==> ()
strategyInit() == 
(
	state := <halt>
);

protected strategyNotify : () ==> ()
strategyNotify() == is subclass responsibility;


protected strategyEnd : () ==> ()
strategyEnd() == 
(
	state := <run>;
);

protected handleEvents : ActivePlanManager ==> ()
handleEvents(apm) == is subclass responsibility;


end SNW

             
~~~
{% endraw %}

### RailwayGrid.vdmrt

{% raw %}
~~~
                                        

class RailwayGrid

instance variables

private routeList : set of TransportPlan`Route; 
private grid : Grid := {};
private inactiveGrid : Grid := {};
private inactiveRouteID : set of (TransportPlan`Route | nat) := {};
private io : IO := new IO();

types

public String = seq of char;
public Plan = seq of TransportPlan`Route;
public Grid = set of Plan;


operations

--Constructor	
public RailwayGrid : () ==> RailwayGrid	
RailwayGrid()==
(	
--duration(0)(
dcl R1 : TransportPlan`Route 
       := mk_TransportPlan`Route("A", "B", 42, "P1",200, 1), 
	R2 : TransportPlan`Route 
	   := mk_TransportPlan`Route("A", "C", 42, "P1", 200, 2),
	R3 : TransportPlan`Route 
	   := mk_TransportPlan`Route("B", "C", 99, "P1", 200, 3),	
	R4 : TransportPlan`Route 
	   := mk_TransportPlan`Route("B", "D", 42, "P1", 200,4),
	R5 : TransportPlan`Route 
	   := mk_TransportPlan`Route("B", "A", 42, "P1", 200,5),	
	R6 : TransportPlan`Route 
	   := mk_TransportPlan`Route("C", "D", 42, "P1", 200,6),
	R7 : TransportPlan`Route 
	   := mk_TransportPlan`Route("C", "A", 42, "P1", 200,7),
	R8 : TransportPlan`Route 
	   := mk_TransportPlan`Route("D", "B", 42, "P1", 200,8),	
	R9 : TransportPlan`Route 
	   := mk_TransportPlan`Route("D", "C", 42, "P1", 200,9),
	R10 : TransportPlan`Route 
	    := mk_TransportPlan`Route("C", "B", 99, "P1", 200,10);
	
	routeList := {R1,R2,R3,R4,R5,R6,R7,R8,R9,R10}; 

	grid := recAlgo({},[], "A") union 
	        recAlgo({},[], "B") union 
	        recAlgo({},[], "C") union 
	        recAlgo({},[], "D");	
	writef (grid);
--	);
--	return self;
);

private recAlgo : Grid * Plan * String ==> Grid
recAlgo(grid, plan, station) ==
(
	dcl grid_temp : Grid := grid;
	for all r in set routeList  do
	(
		if( r.departureLocation = station and 
				not (exists p in set elems plan & 
				r.arrivalLocation = p.arrivalLocation or
				r.arrivalLocation = p.departureLocation) )
		then (
					dcl temp : Plan :=  plan ^ [r];
					grid_temp := grid_temp union {temp};
			 		grid_temp := recAlgo( grid_temp, temp, 
			 		                      r.arrivalLocation);
			  );
	);
 	return grid_temp;
);

pure public getGrid: () ==> Grid
getGrid()==
(
	return grid;
);

public setInactiveRoute : nat ==> ()
setInactiveRoute(id)==
(
	duration(0) (
	inactiveRouteID := inactiveRouteID union {id};
	inactiveGrid := inactiveGrid union  
	                {tp | tp in set grid
	                    & exists x in set elems tp & x.id_route = id};
	grid := {x | x in set grid 
	           & id not in set {route.id_route | route in set elems x}}; 
	);
)
pre exists x in set routeList & x.id_route = id;




---------------------------------------------------------------------------------------------------------------
public test : () ==> ()
test()== 
(
	writef (recAlgo({},[], "A") union 
	        recAlgo({},[], "B") union 
	        recAlgo({},[], "C") union 
	        recAlgo({},[], "D") );
);

private writef : Grid ==> ()
	writef(grid)==
	(
		def - = io.fwriteval[Grid]("railway.txt",grid,<append>) in skip;
	);

end RailwayGrid
               
~~~
{% endraw %}

### Logger.vdmrt

{% raw %}
~~~
                                      

class Logger

types
	public logType =  (CyberRail`String | TransportPlan | TP | Fnc | 
	                   TransportPlan`DTO | seq of TransportPlan`Route | 
	                   MessageTypes`MessageT | seq of TransportPlan | 
	                   TokenDevice | seq of MessageTypes`MessageT | 
	                   set of TransportPlan | nat | CyberRail`NavigationInput);

	public TP::
				depa:CyberRail`String
				arri:CyberRail`String
				route: seq of nat
				tokenId: nat;

	public Fnc::
				methodName: CyberRail`String

instance variables 
	public static log : seq of logType := [];

operations
	public static writeTransportPlan : TransportPlan ==> ()
	writeTransportPlan(o) ==
	(
		dcl list : seq of nat := [];
		if len o.getRouteList() = 0 then
			log := log ^ [mk_TP("NA","NA", [], o.getTokenId())] ^ ["\n"]
		else
		(
 			for r in o.getRouteList() do
				list := list ^ [r.id_route];
		log := log ^ [mk_TP( o.getRouteList()(1).departureLocation, 
		                   (o.getRouteList())(len o.getRouteList()).
		                       arrivalLocation, 
		                   list, o.getTokenId())] ^ ["\n"];
		) ;  
	);

	public static writeFnc : CyberRail`String ==> ()
	writeFnc(fnc) ==
	(
		log := log ^ [mk_Fnc(fnc)]^  ["\n"];
	);
	
	public static write : logType ==> () 
	write(o)== 	( 
		duration(0)(	
		log := log ^ [o] ^ ["\n"];
		Logger`flush();
		);
);

	public static flush : () ==> ()
	flush()== (
	dcl io: IO := new IO();
	 def - = io.fwriteval[seq of logType]("logger.log",log,<start>) in skip;
	);

	public static printLog : () ==> seq of logType	
printLog() == return log;

sync
mutex(write);

end Logger

             
~~~
{% endraw %}

### TransportPlan.vdmrt

{% raw %}
~~~
                                             


class TransportPlan

instance variables
  private id_token : nat;
  private totalFee : real;
  private totalDuration : nat;
  private choice : CyberRail`Choice;
  public routeList : seq of Route := [];
  private routesTravled : seq of Route := [];

inv len routeList > 0 => forall i in set inds routeList 
  & i < len routeList => 
  routeList(i).arrivalLocation = routeList(i+1).departureLocation;


types

public Route ::
departureLocation : CyberRail`String
arrivalLocation : CyberRail`String
fee : real
platform : CyberRail`String
dur : nat
id_route : nat
inv r == len r.platform > 0 and
			len r.arrivalLocation > 0 and
			len r.departureLocation > 0 and
			r.fee >= 0 ;

public DTO ::
	id_token : nat
	routeList : seq of Route
	choice : CyberRail`Choice



operations

--Constructor
public TransportPlan : seq of Route * CyberRail`Choice * nat ==> TransportPlan
TransportPlan(routes, pChoice, id_tok) ==
(
	id_token := id_tok;
	choice := pChoice;
	routeList := routes;
);

public getNextRoute : () ==> TransportPlan`Route
getNextRoute () == (
	return hd routeList;
)
pre len routeList > 0;

public containsRoute: nat ==> bool
containsRoute(id_route) == 
return exists r in set elems routeList & r.id_route = id_route
pre len routeList > 0;

public addRoute: Route ==> ()
addRoute(route) ==(
 routeList := routeList^[route];
 totalFee:= totalFee + route.fee
)
pre routeList(len routeList).arrivalLocation = route.departureLocation;

public routeTraveled: () ==> ()
routeTraveled () == (
	routesTravled := routesTravled ^ [hd routeList];
	routeList := tl routeList;
)
pre len routeList > 0;

pure public routesRemaining : () ==> nat
routesRemaining() == ( return len routeList;);

public getByValue : () ==> DTO
getByValue()== return mk_TransportPlan`DTO(id_token, routeList, choice);


public getPlanAsNaviInput: () ==> CyberRail`NavigationInput
getPlanAsNaviInput() ==(
return mk_CyberRail`NavigationInput((hd routeList).departureLocation,
(routeList(len routeList)).arrivalLocation, 	choice, id_token )
)
pre len routeList > 0;

public getTokenId: () ==> nat
getTokenId() == return id_token;

--debug
public getRouteList: () ==> seq of Route
getRouteList()==
	return routeList;

sync
	mutex(routeTraveled);
	
end TransportPlan
             
~~~
{% endraw %}

### CRSystem.vdmrt

{% raw %}
~~~
                                  
system CRSystem

instance variables

-- cpu for CyberRail
cpu1 : CPU := new CPU (<FCFS>,1E6);
 
-- cpu for TokenDevice
cpu3 : CPU := new CPU (<FCFS>,1E6);
cpu4 : CPU := new CPU (<FCFS>,1E6);
cpu5 : CPU := new CPU (<FCFS>,1E6);
cpu6 : CPU := new CPU (<FCFS>,1E6);
cpu7 : CPU := new CPU (<FCFS>,1E6);
cpu8 : CPU := new CPU (<FCFS>,1E6);
cpu9 : CPU := new CPU (<FCFS>,1E6);
cpu10 : CPU := new CPU (<FCFS>,1E6);
cpu11 : CPU := new CPU (<FCFS>,1E6);
cpu12 : CPU := new CPU (<FCFS>,1E6);
--cpu13 : CPU := new CPU (<FCFS>,1E6);
--cpu14 : CPU := new CPU (<FCFS>,1E6);
--cpu15 : CPU := new CPU (<FCFS>,1E6);

-- cpu for APM
cpu2 : CPU := new CPU (<FCFS>,1E6);

-- bus to connect CyberRail and APM
bus1 : BUS := new BUS (<FCFS>,1E3,{cpu1,cpu2});

-- bus to connect TokenDevice to APM
bus2 : BUS := new BUS (<FCFS>,5,{cpu3,cpu2});
bus3 : BUS := new BUS (<FCFS>,5,{cpu4,cpu2});
bus4 : BUS := new BUS (<FCFS>,5,{cpu5,cpu2});
bus5 : BUS := new BUS (<FCFS>,5,{cpu6,cpu2});
bus6 : BUS := new BUS (<FCFS>,5,{cpu7,cpu2});
bus7 : BUS := new BUS (<FCFS>,5,{cpu8,cpu2});
bus8 : BUS := new BUS (<FCFS>,5,{cpu9,cpu2});
bus9 : BUS := new BUS (<FCFS>,5,{cpu10,cpu2});
bus10 : BUS := new BUS (<FCFS>,5,{cpu11,cpu2});
bus12 : BUS := new BUS (<FCFS>,5,{cpu12,cpu2});
--bus13 : BUS := new BUS (<FCFS>,5,{cpu13,cpu2});
--bus14 : BUS := new BUS (<FCFS>,5,{cpu14,cpu2});
--bus15 : BUS := new BUS (<FCFS>,5,{cpu15,cpu2});
  
--bus to connect cb token device
--bus3 : BUS := new BUS (<FCFS>,1E6,{cpu1, cpu3});

public static tok1 : TokenDevice := new TokenDevice(1);
public static tok2 : TokenDevice := new TokenDevice(2);
public static tok3 : TokenDevice := new TokenDevice(3);
public static tok4 : TokenDevice := new TokenDevice(4);
public static tok5 : TokenDevice := new TokenDevice(5);
public static tok6 : TokenDevice := new TokenDevice(6);
public static tok7 : TokenDevice := new TokenDevice(7);
public static tok8 : TokenDevice := new TokenDevice(8);
public static tok9 : TokenDevice := new TokenDevice(9);
public static tok10 : TokenDevice := new TokenDevice(10);
--public static tok11: TokenDevice := new TokenDevice(11);
--public static tok12: TokenDevice := new TokenDevice(12);
--public static tok13 : TokenDevice := new TokenDevice(13);
public static cb : CyberRail := new CyberRail();
public static apm : ActivePlanManager := new ActivePlanManager();
public static grid :  RailwayGrid := new RailwayGrid();

operations

CRSystem : () ==> CRSystem
CRSystem()==
(
	cpu1.deploy(cb);
	cpu2.deploy(apm);
	cpu1.deploy(grid);
	cpu3.deploy(tok1);
	cpu4.deploy(tok2);
	cpu5.deploy(tok3);
	cpu6.deploy(tok4);
	cpu7.deploy(tok5);
	cpu8.deploy(tok6);
	cpu9.deploy(tok7);
	cpu10.deploy(tok8);
	cpu11.deploy(tok9);
	cpu12.deploy(tok10);
	--cpu13.deploy(tok11);
	--cpu14.deploy(tok12);
	--cpu15.deploy(tok13);

)

end CRSystem
             
~~~
{% endraw %}

### CyberRail.vdmrt

{% raw %}
~~~
                                         


class CyberRail

instance variables

private normalState : bool := true;
private curtime : nat := 0;

private railway : RailwayGrid;
private q_APM_out : ActivePlanManager;
private q_Env_in : seq of MessageTypes`MessageT := []; 
private q_APM_in : seq of MessageTypes`MessageT := []; 
private busy : bool := false;
private timeout : nat := 0;

types

public NavigationInput :: 
departureLocation : String
arrivalLocation : String
transportChoice : Choice
id_token : nat1

inv n == len n.departureLocation > 0 and
	len n.arrivalLocation > 0 ;
	
public String = seq of char;
public Choice = <Cheapest>|<Quickest>


operations


public setRailwayGrid : RailwayGrid ==> ()
setRailwayGrid(grid)== (
	railway := grid;
);

public isFinished : () ==> ()
isFinished () == skip;


public calculateTransportPlan : NavigationInput * TokenDevice ==> 
                                [TransportPlan`DTO]
calculateTransportPlan(navInput, tokenDevice) ==
(
 dcl tempPlan : TransportPlan;
 dcl tempGrid : RailwayGrid`Grid := railway.getGrid();
 def l = {r | r in set tempGrid 
            & r(1).departureLocation = navInput.departureLocation and
              r(len r).arrivalLocation = navInput.arrivalLocation} 
 in (
  if card l = 0
  then
  (
   return nil;
  )
  else if navInput.transportChoice = <Cheapest>
  then
   tempPlan :=  new TransportPlan(findCheapest(l), 
                                  <Cheapest>, 
                                  navInput.id_token)
  else tempPlan :=  new TransportPlan(findQuickest(l), 
                                      <Quickest>, 
                                      navInput.id_token);
 );
 return tempPlan.getByValue(); 
)
pre exists r in set railway.getGrid() & 
      r(1).departureLocation = navInput.departureLocation and 
      r(len r).arrivalLocation = navInput.arrivalLocation;


public setActiveRoute : nat ==> ()
setActiveRoute(id_Route) == is not yet specified;


private findCheapest : RailwayGrid`Grid ==> [seq of TransportPlan`Route]
findCheapest(list) ==
(
	dcl sum : real := 0;
	dcl cheap : real := 9999;
	dcl rtn : seq of TransportPlan`Route := [];
	
	for all s in set list do
	(
		sum := 0;
		for r in s do
			sum := sum + r.fee;
		if sum < cheap then
		(
			cheap := sum;
			rtn := s;
		);    
	);
	return rtn;
);

private findQuickest : RailwayGrid`Grid ==> [seq of TransportPlan`Route]
findQuickest (list) == findCheapest(list);

public setQ_APM_out : ActivePlanManager ==> ()
setQ_APM_out(apm) == ( 
	q_APM_out := apm;
);

async public addToStimuliQueue : MessageTypes`MessageT ==> ()
addToStimuliQueue(msg) == 
(
	q_Env_in := q_Env_in ^ [msg];
);

public addToSystemQueue : MessageTypes`MessageT ==> ()
addToSystemQueue(msg) == 
( 
	q_APM_in := q_APM_in ^ [msg];
);

public handleEvents : () ==> ()
handleEvents() ==
(
	duration(0)(
	if len q_Env_in > 0 or len q_APM_in > 0 
	then(
		busy := true;
		if(len q_Env_in > 0)
		then 
			handleQ_Env_in()
		
		else if ( normalState and len q_APM_in > 0)
		then 
			 handleQ_APM_in();				
		)
		else
			busy := false;

		if(not normalState and (curtime + timeout) <= time)
		then 
			finalizeInactiveRoute();
	);
			
);


private handleQ_Env_in : () ==> ()
handleQ_Env_in() == (
let msg = hd q_Env_in 
in 
  (cases msg:
	mk_MessageTypes`INACTIVEROUTE(-) -> handleInactiveRoute(msg), 
	mk_MessageTypes`ACTIVEROUTE(-) -> skip,
	mk_MessageTypes`ADDROUTE(-) -> skip,
	mk_MessageTypes`REMOVEROUTE(-) -> skip
   end;
   );
reduce_Q_Env();
)
pre len q_Env_in > 0;

private handleQ_APM_in : () ==> ()
handleQ_APM_in() == (
let msg = hd q_APM_in 
in
  (cases msg: 
	mk_MessageTypes`CALCPLAN(navi, tokenDevice) -> 
	      handleCalcPlan(navi, tokenDevice)
   end;
   );
reduce_Q_APM();
)
pre len q_APM_in > 0;

private handleCalcPlan : CyberRail`NavigationInput * TokenDevice ==> ()
handleCalcPlan(navi, tokenDevice)==(
	q_APM_out.addToSystemQueue( mk_MessageTypes`RETURNPLAN( 
	      calculateTransportPlan(navi, tokenDevice), tokenDevice))
);

private handleInactiveRoute : MessageTypes`MessageT ==> ()
handleInactiveRoute(msg) ==
(	
	normalState := false;
	curtime := time;
	let mk_MessageTypes`INACTIVEROUTE(routeid) = msg in
	(
		q_APM_out.addToSystemQueue(mk_MessageTypes`STRATEGYINIT());
		railway.setInactiveRoute(routeid);
		q_APM_out.addToSystemQueue(mk_MessageTypes`STRATEGYNOTIFY(routeid));
	);
	
);

private finalizeInactiveRoute : () ==> ()
finalizeInactiveRoute()==
(
	q_APM_out.addToSystemQueue(mk_MessageTypes`STRATEGYEND());
	normalState := true;
);


public setInactiveRoute : nat ==> ()
setInactiveRoute(id_Route) == (
skip;
);

private reduce_Q_APM : () ==> ()
reduce_Q_APM () == q_APM_in := tl q_APM_in
pre len q_APM_in > 0; 

private reduce_Q_Env : () ==> ()
reduce_Q_Env () == q_Env_in := tl q_Env_in
pre len q_APM_in > 0;

thread
	while(true) do
	(
		handleEvents();
   )


sync
per handleEvents => (len q_Env_in + len q_APM_in) > 0;

per isFinished =>  (len q_Env_in + len q_APM_in) = 0;

mutex(reduce_Q_Env,addToStimuliQueue);
mutex(reduce_Q_APM,addToSystemQueue);
mutex(reduce_Q_Env);
mutex(reduce_Q_APM);
mutex(calculateTransportPlan);
mutex(addToStimuliQueue);
mutex(addToSystemQueue);
end CyberRail
               
~~~
{% endraw %}

### ActivePlanManager.vdmrt

{% raw %}
~~~
                                                 

class ActivePlanManager is subclass of Strategy


instance variables


private activeTokens : inmap TokenDevice to TransportPlan := {|->};
inv forall x,y in set dom activeTokens &
 x = y =>  activeTokens(x) = activeTokens(y);
--Ensure only one TokenDevice reside in the map.
--Tests if 2 elements from domain is equal then (implication) they point
--to the same entity. 

private busy : bool := false;

private q_CR_out: CyberRail; 

private tokenDevices : set of TokenDevice;
private q_Tok_in : seq of MessageTypes`MessageT := [];
private q_CR_in : seq of MessageTypes`MessageT := [];
private q_Tok_out : seq of TransportPlan := [];

private state : State := <run>;

types

public State =  <run> | <halt>;

operations


--Strategy-------------------------------------------------
protected strategyInit : () ==> ()
strategyInit() == 
(
	state := <halt>
);

protected strategyNotify : () ==> ()
strategyNotify() == skip; -- is subclass responsibility;


protected strategyEnd : () ==> ()
strategyEnd() == 
(
	state := <run>;
);

protected handleEvents : () ==> ()
handleEvents() == 
is not yet specified;
-----------------------------------------------------------
  public ActivePlanManager : ()  ==> ActivePlanManager
  ActivePlanManager() == (skip;);


	public isFinished : () ==> ()
	isFinished () == skip;

  public inactiveRoute : nat ==> ()
  inactiveRoute(id_route) ==
  (
		duration(50)
		(
		for all t in set rng activeTokens do
		(

			if t.containsRoute(id_route)
			then
			(let p = inverse activeTokens in
			   q_CR_out.addToSystemQueue(
			             mk_MessageTypes`CALCPLAN(
			              t.getPlanAsNaviInput(),p(t)));
			)
 	 	);
		);
	);


public addTransportPlan : TransportPlan * TokenDevice ==> ()
  addTransportPlan(plan,tokenDevice) ==(	
		
   activeTokens := activeTokens ++ {tokenDevice|-> plan};
	q_Tok_out := q_Tok_out ^ [plan];	
	);	

public removeTransportPlan : TransportPlan * TokenDevice ==> ()
  removeTransportPlan(plan,tokenDevice) ==(
  activeTokens := {tokenDevice} <-: activeTokens;  
  --Restrict map to not contain a mapplet containing tokenDevice
 );

public getPlans : () ==> set of TransportPlan
  getPlans() == return rng activeTokens;


public handleEvent : () ==> ()
	handleEvent() == (
if((len q_CR_in + len q_Tok_in + len q_Tok_out) <> 0)
then(
		if(len q_CR_in <> 0  )
		then 
			 handleQ_CR_in()
	   
		else if(state = <run> and len q_Tok_out <> 0)
		then 
			handleQ_Tok_out()

		else if(state = <run> and len q_Tok_in <> 0)
		then 
			handleQ_Tok_in()
	)
	else
		busy := false;
);


private handleQ_Tok_out : () ==> ()
handleQ_Tok_out() == (
 let ptt_map = inverse activeTokens, plan = hd q_Tok_out in (
  let tokenDevice = ptt_map(plan) in (
   tokenDevice.notifyPassenger(plan);
  );
  q_Tok_out := tl q_Tok_out;
 )
)
pre len q_Tok_out > 0 and 
    exists plan in set rng activeTokens & plan = hd q_Tok_out;

private handleQ_CR_in : () ==> ()
handleQ_CR_in() ==
(
	busy := true;
		
		let msg = hd q_CR_in in
		(cases msg:
		  mk_MessageTypes`RETURNPLAN(-,-) -> handleTransportPlan(msg),
		  --mk_MessageTypes`INACTIVEROUTE(-) -> handleInactiveRoute(msg),
		  mk_MessageTypes`STRATEGYNOTIFY(-) -> handleInactiveRoute(msg),
		  mk_MessageTypes`STRATEGYINIT() -> handleStrategyInit(),
		  mk_MessageTypes`STRATEGYEND() -> handleStrategyEnd()
		end;
		);
		reduce_Q_CR();
)
pre len q_CR_in > 0;

private handleQ_Tok_in : () ==> ()
handleQ_Tok_in()==
(
 busy := true;
  let msg = hd q_Tok_in in
  (
   cases msg:
    mk_MessageTypes`REQUESTPLAN(-,-) -> handleRequestPlan(msg)
   end;
  );
 reduce_Q_Tok();
)
pre len q_Tok_in > 0; 

private handleStrategyInit : () ==> ()
handleStrategyInit()== (
	Logger`write("Read StrategyINIT "); Logger`write(time);	
	state := <halt>;
);	

private handleStrategyEnd : () ==> ()
handleStrategyEnd()== (
	state := <run>;
);
private handleInactiveRoute : MessageTypes`MessageT ==> ()
handleInactiveRoute(msg) ==
(
	let mk_MessageTypes`STRATEGYNOTIFY(routeid) = msg in
	(
		inactiveRoute(routeid);
	)
);

private handleTransportPlan :  MessageTypes`MessageT ==> ()
handleTransportPlan(msg) ==
(	
	
	let mk_MessageTypes`RETURNPLAN(dto, tok) = msg in
	(
		addTransportPlan(new TransportPlan(dto.routeList, 
		                 dto.choice, dto.id_token), tok);
	)
);

private handleRequestPlan : MessageTypes`MessageT ==> ()
handleRequestPlan(msg) ==
(

	let mk_MessageTypes`REQUESTPLAN(navi, tok) = msg in
		(
			q_CR_out.addToSystemQueue(
			          mk_MessageTypes`CALCPLAN(navi,tok));
		)
);

private reduce_Q_Tok : () ==> ()
reduce_Q_Tok () == q_Tok_in := tl q_Tok_in
pre len q_Tok_in > 0;

private reduce_Q_CR : () ==> ()
reduce_Q_CR () == (q_CR_in := tl q_CR_in;
)
pre len q_CR_in > 0;
							
--Initialize CyberRail ref.
public setQ_CR_out :  CyberRail ==> ()
setQ_CR_out(cr) == (q_CR_out := cr);



public addToSystemQueue : MessageTypes`MessageT ==> ()
addToSystemQueue(msg) ==
(
	q_CR_in := q_CR_in ^ [msg];
);

async public addToClientQueue : MessageTypes`MessageT ==> ()
addToClientQueue(msg)==
(
	q_Tok_in := q_Tok_in ^ [msg];
);


thread
	while true do
	(
			handleEvent();
	)




sync

per handleEvent => ((len q_CR_in + len q_Tok_in + len q_Tok_out) > 0);
per isFinished => (len q_CR_in + len q_Tok_in + len q_Tok_out)=0;
mutex(reduce_Q_Tok,addToClientQueue);
mutex(reduce_Q_CR,addToSystemQueue);
mutex(addToSystemQueue);
mutex(addToClientQueue);
mutex(handleEvent);
mutex(reduce_Q_Tok);
mutex(reduce_Q_CR);

end ActivePlanManager

             
~~~
{% endraw %}

