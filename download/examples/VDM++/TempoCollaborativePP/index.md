---
layout: default
title: TempoCollaborativePP
---

## TempoCollaborativePP
Author: 


This is a brief description on how to run the TEMPO demonstrator, and how to configure it. This is without the graphical 
extensions made in the project for Overture: for the use of those we refer to the associated manuals. The below is still
relevant if you want to use the graphical extensions, though.

The demonstrator is executed by launching a run configuration. So in order to do that you have to make one. A typical example
has the following parameters:
- Launch mode: Entry point
- Class: World()
- Function/Operation: Run("RotterdamNetwork.csv", "TMSconfiguration.csv", 300)

The operation "Run" takes three parameters:
- A network configuration (in the example: "RotterdamNetwork.csv")
- The configuration of the TMS in the system (in the example: "TMSconfiguration.csv")
- The duration of the simulation in units of 10 seconds, which is the cycle time between the Java simulator and the VDM 
  model. In the example it is 300, that means 3000 seconds = 50 minutes. Since the simulator first takes 20 minutes 
  without interacting with the model this means that the total run time is 70 minutes in the example.
  
All configuration files are .csv, so basically comma seperated text files.

The following files are relevant:
- network description
- TMS configuration
- geographic description of the network
- description of the events taking place during the simulation.

*** Network desscription ***

This file contains the following information for every edge in the network:
- The identifier of the edge
- the starting node for the edge
- the end node for the edge
- the length of the edge
- the number of lanes that the edge has
- the maximum speed for the edge
- flow of cars into the edge

An example line in the file could be: "A201","A20S","A20A4",1,2,70,240

*** TMS description ***

This file contains the following information for every TMS in the network:
- the identification of the TMS
- an identification of the edge included
- a traffic control measure if available (alternatively nil is included)
- a priority if available (alternatively nil is included, lower numbers mean a higher priority)
- possible suggested routes to make diversions avoiding the edge (currently this value is always nil)

An example line in the file could be: "RWS","A152","HardShoulder",1,nil

*** Geographic description ***

This is only relevant for the Java simulator. The file should always have the name "GeoInfo.csv". It specifies
the geographic location in terms of GPS coordinates for each node in the network, so that the simulator knows
where to plot it on the map.

*** Events ***

Describes the events that take place during the simulation. Each line contains:

- Time in seconds after t=0 the event occurs (i.e. including the 20 minute initialisation time that the simulator takes to 
  fill the network
- The type of event. This can be one of the following:
  * SetInputStream -- sets the number of vehicles injected on a certain edge in terms of #vehicles/minute
  * BridgeOpen -- opens a bridge (should result in a diversion if possible)
  * BridgeClose --  closes a bridge (NB to work correctly a bridge should be closed explicitly at t=0)
  * Incident -- typcially an accident that blocks part of the road, thus limiting the capacity of an edge
  * IncidentEnds -- End the incident and increases capacity again
- the edge where the event occurs
- a numeric value relevant for the edge. In case of:
  * A SetInputStream event: #vehicles/minute injected in the edge
  * Bridge or Incident: the percentage related to the length of the edge at which the bridge or incident is located.
  
An example line in the file could be: 1220,"SetInputStream","A153",5

*** Use of Overture Graphics Support ***

As a part of the TEMPO project a new plug-in on top of the Overture tool called the "Overture Graphics 
Plugin Development". Thus, it is possible to update versions of Overture version 2.4.0 or higher under
"Help -> Install New Software" inside the Overture Eclipse tool. After having installed the plug-in it is
possible to add this feature for a specific project by selecting "Overture Graphics -> Add Overture 
Graphics Library" by right-clicking on a project. When this have been carried out debugging can be started
with a special "Vdm Graphics Application" and this will start up a seperate Electron application called the
"Overture Graphics Plugin". Here one need to choose the root class (in this case "World") and afterwards 
what top-level method to run (in this can one can either select "run" or "runwithoutcollab"). Afterwards, 
it is possible to define multiple plots which can be viewed while a VDM simulation is on-going (either in 
2D  or 3D). For this model it makes sense to monitor "tmsX.averagedensity" and "tmsX.averagevelocity" where
X is either 1 or 2. Finally, it is possible to select a plot and dooble click on it and then start the VDM
simulator with the selected operation. In this case a new GUI (programmed in Java) will come up and then 
from there the entire simulation can be started up.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run("RotterdamNetwork.csv", "TMSconfiguration.csv", 300)|
|Entry point     :| new World().runwithoutcollab()|


### SimpleEnvironment.vdmpp

{% raw %}
~~~
class TestEnvironment is subclass of Environment

instance variables 

simtime : [nat];
time : nat;
sit: EdgeSit;
falling: bool; 

operations 

public TestEnvironment: Network * map World`TMSId to TMS * [nat] ==> TestEnvironment 
TestEnvironment(net, tms, t) == (
	let - = Environment(net, tms) in skip;
	simtime := t;
	time := 0;
	sit := mk_(0,120,0,false,false);
	falling := true
);

public Run: () ==> ()
Run() == while not isFinished() do (
	dcl trafsit: TrafficSituation := {|->};
	dcl control: TMS`Control := {|->};
	for all e in set network.GetEdgeIds() do trafsit := trafsit ++ {e |-> sit};
	for all id in set dom tms_m do (tms_m(id).Step(trafsit));
  for all id in set dom tms_m do (tms_m(id).MakeOffers());
  for all id in set dom tms_m do (tms_m(id).EvaluateOffers());
  for all id in set dom tms_m do let c = tms_m(id).FinaliseOffers() in control := control ++ c;
	IO`printf("%s\nEdge situation: %s\nControl measures: %s\n", [time, sit, control]);
	time := time+1;
	UpdateSit()
);

private UpdateSit: () ==> ()
UpdateSit() == (
	if falling then
		sit := mk_(sit.#1, sit.#2 - 5, sit.#3, false, false)
	else
		sit := mk_(sit.#1, sit.#2 + 5, sit.#3, false, false);
	if sit.#2 = 0 and falling then falling := false;
	if sit.#2 = 120 and not falling then falling := true;
);

protected isFinished: () ==> bool
isFinished() == return if simtime <> nil then time >= simtime else false;

end TestEnvironment
~~~
{% endraw %}

### Environment.vdmpp

{% raw %}
~~~
class Environment

types

public Performance ::            
  pol : map Network`EdgeId to Polution
  veh_traveldist : nat;

public EdgeSit = CarDensity * AvgSpeed * Polution * Incident * BridgeOpen;
public TrafficSituation = map Network`EdgeId to EdgeSit;
  
public CarDensity = nat;
public AvgSpeed = nat;
public Polution = nat;
public Incident = bool;
public BridgeOpen = bool
  
instance variables

protected network : Network := new Network({|->});
protected tms_m : map World`TMSId to TMS := {|->};  
  
operations

public Environment: Network * map World`TMSId to TMS ==> Environment 
Environment(net, tms) == (
	network := net;
	tms_m := tms
);

public Run: bool * seq of char * seq1 of char ==> ()
Run(-,-,-) == skip;

protected isFinished: () ==> bool
isFinished() == return false;

end Environment
~~~
{% endraw %}

### Network.vdmpp

{% raw %}
~~~
	class Network

types

public EdgeId = seq of char;
  
public Request ::
   originator : EdgeId
   service : TMS`ServiceId
   severity: real
   cost : real
   accepted : bool;
  
instance variables

  connections : map EdgeId to Edge := {|->};
  requests: map EdgeId to set of Request := {|->};
  offers: map EdgeId to set of Request := {|->};
  notproblematic : map World`TMSId to set of EdgeId := {|->};
  
operations

  public Network: map EdgeId to Edge ==> Network
  Network(conn) ==
    connections := conn;
   
  public MakeOffer: EdgeId * real ==> () 
  MakeOffer (eid, cost) ==
  (  let reqs = {mu(r,accepted |-> false, cost |-> cost) | r in set requests(eid)}
    in
    offers(eid) := (if eid in set dom offers 
                    then offers(eid)
                    else {}) union reqs;
                    IO`printf("The following offers are made: %s", [offers(eid)])
  )
  pre eid in set dom requests;
  
  public AddRequests: map EdgeId to set of Request ==> ()
  AddRequests(req_m) ==
    requests := requests ++ {id |-> req_m(id) union
                                    if id in set dom requests
                                    then requests(id)
                                    else {} 
                            | id in set dom req_m};
                            
  pure public GetNotProblematic: () ==> set of EdgeId
  GetNotProblematic() ==
    return dunion rng notproblematic;
    
  pure public GetRequests: EdgeId ==> set of Request
  GetRequests(eid) ==
    return if eid in set dom requests
           then requests(eid)
           else {};
           
 pure public GetOffers: EdgeId ==> map EdgeId to set of Request
 GetOffers(requestor) ==
    return { provider |->{offer |offer in set offers(provider)}
           | provider in set dom offers & provider = requestor};
               
  public AcceptOffers: EdgeId * set of Request ==> ()
  AcceptOffers(eid, accepted) ==
     offers(eid) := (if eid in set dom offers
                     then offers(eid) 
                     else {}) union accepted;
                
  pure public GetAcceptedOffers: EdgeId ==> set of Request
  GetAcceptedOffers(eid) ==
    return if eid in set dom offers 
           then {offer | offer in set offers(eid) & offer.accepted} 
           else {};
  
  public ResetOffers: () ==> ()
  ResetOffers() ==
    (requests := {|->};
     offers := {|->});

  public CancelOldProblematicEdges: World`TMSId * set of Network`EdgeId ==> ()
  CancelOldProblematicEdges(tmsid,edges) ==
    notproblematic(tmsid) := edges union if tmsid in set dom notproblematic
                                         then notproblematic(tmsid)
                                         else {};
     
  public ResetNotproblematic: World`TMSId ==> ()
  ResetNotproblematic(tmsid) ==
    notproblematic(tmsid) := {};
    
  pure public OfInterestTo: EdgeId ==> set of EdgeId
  OfInterestTo(edgeid) ==
    let s = connections(edgeid).GetStartNode(),
        e = connections(edgeid).GetEndNode()
    in 
      return {eid | eid in set dom connections
                  & connections(eid).GetEndNode() = s or connections(eid).GetStartNode() = e}
  pre edgeid in set dom connections;
                  
  public LeadsToInNSteps: EdgeId * nat1 ==> set of EdgeId
  LeadsToInNSteps(edgeid,n) ==
    let s = connections(edgeid).GetStartNode(),
        leadsto = {eid | eid in set dom connections
                       & connections(eid).GetEndNode() = s} 
    in
      if n = 1
      then return leadsto
      else let starts = {connections(eid).GetEndNode()
                        | eid in set leadsto},
               rest = dunion {LeadsToInNSteps(eid,n-1)
                             | eid in set leadsto
                             & connections(eid).GetEndNode() in set starts}
           in 
             return leadsto union rest
  pre edgeid in set dom connections;
  
  pure public GetMaxSpeed: EdgeId ==> nat
  GetMaxSpeed(edgeid) ==
     return connections(edgeid).maxSpeed
  pre edgeid in set dom connections;
  
  pure public GetOpenLanes: EdgeId ==> nat
  GetOpenLanes(edgeid) ==
     return connections(edgeid).laneCount
  pre edgeid in set dom connections;
  
  
  public GetEdgeIds: () ==> set of EdgeId
  GetEdgeIds() == return dom connections;
  
  pure public IsInputEdge: EdgeId * EdgeId ==> bool
  IsInputEdge (eid1, eid2) ==
    return connections(eid1).GetEndNode() = connections(eid2).GetStartNode()  
  pre {eid1,eid2} subset dom connections;    
  -- Test if eid1 is an input edge to eid2
  
  pure public IsOutputEdge: EdgeId * EdgeId ==> bool
  IsOutputEdge (eid1, eid2) ==
    return connections(eid1).GetStartNode() = connections(eid2).GetEndNode() 
  pre {eid1,eid2} subset dom connections;    
  -- Test if eid1 is an output edge of eid2
  
--public AddDiversionRoutes: EdgeId * set of seq of EdgeId ==> ()
--AddDiversionRoutes(eid,routes) ==
--  div_routes(eid) := routes;
  
  pure public GetConnections: () ==> map EdgeId to Edge
 GetConnections() ==
   return connections;
   
           
end Network
~~~
{% endraw %}

### SimulatorIO.vdmpp

{% raw %}
~~~
class tempo_vdm_SimulatorIO

operations

	public static
		initialize : (seq of char) * (seq of char) ==> (seq of char)
		initialize( networkFile, tmsFile ) == 
			is not yet specified;

	public static
		runSimulator : (nat1) ==> ()
		runSimulator( time ) ==
			is not yet specified;

	public static
		fastForwardSimulator : (nat1) ==> ()
		fastForwardSimulator( time ) ==
			is not yet specified;

	public static
		applyHardShoulder : seq of char * bool ==> ()
		applyHardShoulder( edgeId, enable) ==
			is not yet specified;
			
	public static
		applyTrafficLight : seq of char * nat ==> ()
		applyTrafficLight( edgeId, greenTime) ==
			is not yet specified;
			
	public static
		applyRampMeter : seq of char * nat ==> ()
		applyRampMeter( edgeId, redTime) ==
			is not yet specified;
			
	public static
		applyDiversion : seq of char * seq of char ==> ()
		applyDiversion( edgeId, message) ==
			is not yet specified;
			
	public static
		applyMaxSpeed : seq of char * nat ==> ()
		applyMaxSpeed( edgeId, maxSpeed) ==
			is not yet specified;

	public static
		applyLaneClosure : seq of char * nat ==> ()
		applyLaneClosure( edgeId, closed) ==
			is not yet specified;

	public static
		getSituation : seq of char ==> Environment`EdgeSit
		getSituation( edge_id ) ==
			is not yet specified;

end tempo_vdm_SimulatorIO
~~~
{% endraw %}

### SimulatorEnvironment.vdmpp

{% raw %}
~~~
class SimulatorEnvironment is subclass of Environment

instance variables 

simtime : [nat];
time : nat;

operations 

public SimulatorEnvironment: Network * map World`TMSId to TMS * [nat] ==> SimulatorEnvironment 
SimulatorEnvironment(net, tms, t) == (
	let - = Environment(net, tms) in skip;
	simtime := t;
	time := 0;
);

public Run: bool * seq of char * seq1 of char ==> ()
Run(colab,network_file,tms_file) == (
	dcl path: seq of char := tempo_vdm_SimulatorIO`initialize(network_file,tms_file);
	tempo_vdm_SimulatorIO`fastForwardSimulator(20 * 60);
	while not isFinished() do (
		dcl trafsit: TrafficSituation;
		dcl control: TMS`Control := {|->};
		tempo_vdm_SimulatorIO`runSimulator(10);
		trafsit := UpdateSit();
		for all id in set dom tms_m do tms_m(id).Step(trafsit);
	  if colab 
	  then for all id in set dom tms_m do tms_m(id).MakeOffers();
		for all id in set dom tms_m do tms_m(id).EvaluateOffers();
	  for all id in set dom tms_m do 
	    let c = tms_m(id).FinaliseOffers() 
		  in 
		    (control := control ++ c;
		     network.ResetNotproblematic(id));
		IO`printf("%s\nEdge situation: %s\nControl measures: %s\n", [time, trafsit, control]);
		for all e in set dom control do
			for all m in set control(e) do
				if is_TMS`HardShoulder(m) then
					tempo_vdm_SimulatorIO`applyHardShoulder(e, m.open)
				elseif is_TMS`MaxSpeed(m) then
					if m.speed <> nil
					then tempo_vdm_SimulatorIO`applyMaxSpeed(e, m.speed)
					else tempo_vdm_SimulatorIO`applyMaxSpeed(e, 0)
				elseif is_TMS`TrafficLight(m) then
					tempo_vdm_SimulatorIO`applyTrafficLight(e, m.greentime)
				elseif is_TMS`RampMeter(m) then
				  tempo_vdm_SimulatorIO`applyRampMeter(e, m.redtime)
				elseif is_TMS`Diversion(m) then
					if m.route <> nil
					then tempo_vdm_SimulatorIO`applyDiversion(e, m.route)
					else tempo_vdm_SimulatorIO`applyDiversion(e, "")
				elseif is_TMS`LaneClosure(m) then
				  tempo_vdm_SimulatorIO`applyLaneClosure(e, m.closed);
		network.ResetOffers();
		time := time+1;
	);
);

private UpdateSit: () ==> TrafficSituation
UpdateSit() == (
	dcl sit: EdgeSit;
	dcl trafsit: TrafficSituation := {|->};
	for all e in set network.GetEdgeIds() do (
		sit := tempo_vdm_SimulatorIO`getSituation(e);
		trafsit(e) := sit;
	);
	return trafsit
);

protected isFinished: () ==> bool
isFinished() == return if simtime <> nil then time >= simtime else false;

end SimulatorEnvironment
~~~
{% endraw %}

### EdgeStats.vdmpp

{% raw %}
~~~
class EdgeStats

	instance variables
		public avgSpeed      : nat1 := 1; -- speed of last N cars
		public carCount      : nat  := 0; -- cars / edge
		public carDensity    : nat  := 0; -- cars / distance
		public carThroughput : nat  := 0; -- cars / period

end EdgeStats
~~~
{% endraw %}

### Edge.vdmpp

{% raw %}
~~~
class Edge

types

public NodeId = token;

	instance variables
		public maxSpeed  : nat1 := 1;
		public laneCount : nat1 := 1;
		public length    : nat1 := 1;
    startN : NodeId;
    endN : NodeId;
  
operations

public Edge: nat * nat1 * nat1 * NodeId * NodeId ==> Edge
Edge(ms,lc,l,sn,en) ==
  (maxSpeed := ms;
   laneCount := lc;
   length := l;
   startN := sn;
   endN := en);
    
pure public GetEndNode: () ==> NodeId
GetEndNode() ==
  return endN;
   
pure public GetStartNode: () ==> NodeId
GetStartNode() ==
  return startN;
    
end Edge
~~~
{% endraw %}

### TMS.vdmpp

{% raw %}
~~~
class TMS

values

LOWSPEEDTHRESHOLD : nat = 40;
HIGHSPEEDTHRESHOLD : nat = 70;
LOWDENSITYTHRESHOLD : nat = 10;
HIGHDENSITYTHRESHOLD : nat = 15;
DELTASPEED : nat = 20;
NORMALGREENTIME : nat = 10;
NORMALREDTIME : nat = 1;
LONGGREENTIME : nat = 30;
LONGREDTIME : nat = 20;
MAXPRIORITY : nat = 3;
STANDARDGREENTIME : nat = 10;
STANDARDREDTIME : nat = 15;
OPEN : bool = true;
CLOSED : bool = false;
SERIOUSCONGESTION : nat = 100;
STEPREDTIME : nat = 5;
STEPGREENTIME : nat = 20;
ACCEPTABLECOSTS : nat = 10

types
  
public Priority = nat1
inv p == p <= MAXPRIORITY ;

public Object = Bridge;

public Bridge ::
   status: BridgeStatus;
   
public BridgeStatus = <open>|<closed>;
  
public TCM = HardShoulder | MaxSpeed | TrafficLight | RampMeter | Diversion | LaneClosure;

public MaxSpeed ::
  speed : [nat];
  
public Diversion ::
 -- routes : set of seq of Network`EdgeId;
  route : [seq of char];
  
public TrafficLight ::
  on: bool
  greentime : nat;

public RampMeter ::
  redtime : nat;
  
public HardShoulder ::
  open : bool;
  
public LaneClosure ::
  closed : nat;
 
public Control = map Network`EdgeId to set of TCM;

-- The ActControl is different from Control in that it also contains information about the requestor so 
-- it can be removed when no longer needed...
public ActControl = map Network`EdgeId to set of (Network`EdgeId * TCM);

public Bridges = map Network`EdgeId to Bridge;

public Priorities = map Network`EdgeId to Priority;

public LeadsTo = map Network`EdgeId to set of Network`EdgeId;

 ServiceMap = map ServiceId to set of TCM;
 
public ServiceId = <IncreaseInput> | <DecreaseInput> | <IncreaseOutput> | <DecreaseOutput> | <IncreaseCapacity> | <DecreaseCapacity> | <Divert>;
 
 values
-- TODO Define values here
instance variables

myid: seq of char;

leadsto: LeadsTo := {|->};
network: Network;
myedges : set of Network`EdgeId; -- ids must be edge ids that this TMS control
interestededges : set of Network`EdgeId; --those additional edges I would like to get information about
inv TMSInv(myedges, interestededges);
-- Tom-Tom TMSs would have no edges to control but would have all edges as interestededges
-- and as a consequence can give advice to their cars of better routes given the new TMCs

control : Control := {|->}; -- these are the possible TCMs for each edge
actctrl : ActControl := {|->}; -- these are the actual TCMs for each edge
--inv forall tcm in set dunion rng actctrl & is_MaxSpeed(tcm) => tcm.speed <> nil;
bridges : Bridges := {|->}; -- this maps specifies which edges have a bridge
trafsit : Environment`TrafficSituation := {|->};

trigger: Control := {|->};  -- these are the new TCMs being triggered in this step
prios: Priorities := {|->};
inv dom trigger subset dom control;
inv dom actctrl subset dom control;
inv dom control subset myedges;

oldproblematicedges: set of Network`EdgeId := {};
problematicedges: set of Network`EdgeId := {};
incidents: set of Network`EdgeId := {};

public negos: int := 0;
public acceptedoffers: int := 0;
public averagedensity: real :=0;
public densityperedge: map Network`EdgeId to real := {|->};
public averagevelocity: real :=0;
public velocityperedge: map Network`EdgeId to real := {|->};
internaledges : map Network`EdgeId to set of Network`EdgeId;
world : World;

operations

public TMS: seq of char * Network ==> TMS
TMS(id, n) ==
  (myid := id; 
   myedges := {};
   interestededges := {};
   internaledges := {|->};
   control := {|->};
   network := n);

public SetWorld: World ==> ()
SetWorld(w) ==
   world := w;

public ResetNetwork: Network * World ==> ()
ResetNetwork(n,w) ==
  (network := n;
   world := w;
  );
  
public AddEdge: set of Network`EdgeId ==> ()
AddEdge(eid_s) ==
  myedges := myedges union eid_s;
  
public AddTCM: Network`EdgeId * TCM ==> ()
AddTCM(eid, tcm) ==
  control(eid) := (if eid in set dom control
                   then control(eid) 
                   else {}) union {tcm};
                   
public AddBridge: Network`EdgeId * Bridge ==> ()
AddBridge(eid, bridge) ==
  bridges(eid) := bridge;
                   
public AddPriority: Network`EdgeId * Priority ==> ()
AddPriority(eid, prio) ==
  prios(eid) := prio;

public CalculateInterest: Network ==> ()
CalculateInterest(n) == (
	dcl interest: set of Network`EdgeId := {};
	for all eid in set myedges do interest := interest union n.OfInterestTo(eid);
	interestededges := interest \ myedges
);

RecordDensityVelocity: Environment`TrafficSituation ==> ()
RecordDensityVelocity(ts) ==
(dcl accumulatingdensity: real :=0,
     accumulatingvelocity: real :=0;
 for all eid in set myedges 
 do let mk_(d,v,-,-,-) = ts(eid) in
   (accumulatingdensity := accumulatingdensity + d;
    accumulatingvelocity := accumulatingvelocity + v;
    if eid in set dom densityperedge 
   then densityperedge(eid) := d
   else densityperedge := densityperedge munion {eid|->d};
   if eid in set dom velocityperedge 
   then velocityperedge(eid) := v
   else velocityperedge := velocityperedge munion {eid|->v}
   );
   averagedensity := accumulatingdensity/card myedges;
   averagevelocity := accumulatingvelocity/card myedges;
);

GenerateMyOwnTriggers: Environment`TrafficSituation ==> ()
GenerateMyOwnTriggers(ts) ==
(oldproblematicedges := problematicedges;
 problematicedges := {};
 RecordDensityVelocity(ts); -- Done for visulisation purposes.
(for all eid in set dom control 
 do
   let tcm_s = control(eid) in
    (IO`printf("Controls avaliable for %s: %s\n",[eid,tcm_s]);
    if tcm_s <> {}
     then (if exists tcm in set tcm_s & is_HardShoulder(tcm)
           then trigger(eid) := if eid in set dom trigger 
                                then AddTrig(trigger(eid),SetHardShoulder(eid, ts(eid))) 
                                else AddTrig({},SetHardShoulder(eid, ts(eid)));
           if exists tcm in set tcm_s & is_LaneClosure(tcm)
           then trigger(eid) := if eid in set dom trigger 
                                then AddTrig(trigger(eid),SetLaneClosure(eid, ts(eid))) 
                                else AddTrig({},SetLaneClosure(eid, ts(eid)));
           if exists tcm in set tcm_s & is_MaxSpeed(tcm)
           then trigger(eid) := if eid in set dom trigger 
                                then AddTrig(trigger(eid),SetMaxSpeed(eid, ts(eid))) 
                                else AddTrig({},SetMaxSpeed(eid, ts(eid)));
           if exists tcm in set tcm_s & is_TrafficLight(tcm)
           then trigger(eid) := if eid in set dom trigger 
                                then AddTrig(trigger(eid),SetTrafficLight(eid, ts(eid))) 
                                else AddTrig({},SetTrafficLight(eid, ts(eid)));
           if exists tcm in set tcm_s & is_RampMeter(tcm)
           then trigger(eid) := if eid in set dom trigger 
                                then AddTrig(trigger(eid),SetRampMetering(eid, ts(eid))) 
                                else AddTrig({},SetRampMetering(eid, ts(eid)))
           else skip)
     else skip);
  for all rid in set myedges
  do
    let mk_(d,v,-,-,bridgeopen) = ts(rid) 
    in 
      (if v < LOWSPEEDTHRESHOLD or d > HIGHDENSITYTHRESHOLD or d = 0 or bridgeopen
       then problematicedges := problematicedges union {rid}; 
       bridges(rid) := if rid in set dom bridges and bridgeopen
                       then mk_Bridge(<open>)
                       else mk_Bridge(<closed>);
       for all rid2 in set {beid | beid in set dom bridges & bridges(beid).status = <open>}
       do
         let eids = {leid | leid in set leadsto(rid2) 
                          & leid in set dom control and 
                            exists tcm in set control(leid) & is_Diversion(tcm)}
         in 
           for all eid in set eids
           do
             trigger(eid) := if eid in set dom trigger 
                             then AddTrig(trigger(eid),SetDiversion(rid2)) 
                             else AddTrig({},SetDiversion(rid2));
       for all rid2 in set {beid | beid in set dom bridges & bridges(beid).status = <closed>}
       do
         let eids = {leid | leid in set leadsto(rid2) 
                          & leid in set dom control and 
                            exists tcm in set control(leid) & is_Diversion(tcm)}
         in 
           for all eid in set eids
           do
             trigger(eid) := if eid in set dom trigger 
                             then AddTrig(trigger(eid),SetDiversion(nil)) 
                             else AddTrig({},SetDiversion(nil)) 
       );
     if oldproblematicedges \problematicedges <> {}
     then let non = oldproblematicedges \problematicedges
          in skip;
     IO`printf("Own triggers of %s: %s\n", [myid, trigger]);
     IO`printf("Problematic edges of %s: %s\n", [myid, problematicedges]);
     IO`printf("No longer Problematic edges of %s\n", [oldproblematicedges\problematicedges]);
))
pre dom control subset dom ts; 

public UpdateInternalEdges: () ==> ()
UpdateInternalEdges() ==
  leadsto := {eid |->network.LeadsToInNSteps(eid,2) | eid in set myedges};
  
SetLaneClosure: Network`EdgeId * Environment`EdgeSit ==> set of TCM
SetLaneClosure(eid, mk_(-,-,-,incident,-)) ==
if incident 
then (problematicedges := problematicedges union {eid}; 
      incidents := incidents union {eid};
      return {mk_LaneClosure(1)}
     )
elseif not incident and eid in set incidents
then (actctrl := {eid} <-: actctrl;
      problematicedges := problematicedges \ {eid};
      incidents := incidents\{eid};
      return {mk_LaneClosure(0)}
     )
else return {};

SetHardShoulder: Network`EdgeId * Environment`EdgeSit ==> set of TCM
SetHardShoulder(eid, mk_(d,v,-,-,-)) ==
(IO`printf("Density at %s is %s\n",[eid,d]);
if v < LOWSPEEDTHRESHOLD or d > HIGHDENSITYTHRESHOLD
then (problematicedges := problematicedges union {eid}; 
      if eid in set dom actctrl => forall tcm in set actctrl(eid) & not is_HardShoulder(tcm)
      then (actctrl(eid) := {mk_(eid,mk_HardShoulder(true))} union 
                            if eid in set dom actctrl
                            then actctrl(eid)
                            else {};
           return {mk_HardShoulder(true)})
      else return {}
     )
else (if v >= HIGHSPEEDTHRESHOLD and d <= LOWDENSITYTHRESHOLD --and eid in set dom actctrl
      then (actctrl := {eid} <-: actctrl;
            problematicedges := problematicedges \ {eid};
            return {mk_HardShoulder(false)})
      else return {}
     )
);

SetMaxSpeed: Network`EdgeId * Environment`EdgeSit ==> set of TCM
SetMaxSpeed(eid, mk_(d,-,-,-,-)) ==
if d > HIGHDENSITYTHRESHOLD
then (problematicedges := problematicedges union {eid}; 
      if eid in set dom actctrl => forall tcm in set actctrl(eid) & not is_MaxSpeed(tcm)
      then return {mk_MaxSpeed(network.GetMaxSpeed(eid)-DELTASPEED)}
      else return {}
     )
else (if d <= LOWDENSITYTHRESHOLD -- and eid in set dom actctrl
      then (actctrl := {eid} <-: actctrl;
            problematicedges := problematicedges \ {eid};
            return {mk_MaxSpeed(nil)})
      else return {}
     );

pure SetDiversion: [Network`EdgeId] ==> set of TCM
SetDiversion(eid) ==
  if eid = nil
  then return {} 
  else return {mk_Diversion("Avoid " ^ eid)};

SetTrafficLight: Network`EdgeId * Environment`EdgeSit ==> set of TCM
SetTrafficLight(eid, mk_(d,-,-,-,-)) ==
if d > HIGHDENSITYTHRESHOLD 
then (problematicedges := problematicedges union {eid}; 
      return {mk_TrafficLight(true, LONGGREENTIME)}
     )
elseif d < LOWDENSITYTHRESHOLD 
then return {mk_TrafficLight(true, NORMALGREENTIME)}
else return {};

SetRampMetering: Network`EdgeId * Environment`EdgeSit ==> set of TCM
SetRampMetering(eid, mk_(d,-,-,-,-)) ==
if d > HIGHDENSITYTHRESHOLD 
then (problematicedges := problematicedges union {eid}; 
      return {mk_RampMeter(LONGREDTIME)}
     )
elseif d < LOWDENSITYTHRESHOLD 
then (actctrl := {eid} <-: actctrl;
      problematicedges := problematicedges \ {eid};
      return {mk_RampMeter(NORMALREDTIME)})
else return {};

-- The following operation generates "reguests for help" by an edge with a "problem"
-- from adjacent edges. The request for help is expressed in terms of a service required by
-- the edge form the adjacent edge. From thte total set of services available this wil only
-- be a request for <IncreaseInput> (for output edges) or <DecreaseOutput> (for input edges).
GenerateRequestsForHelp: () ==> map Network`EdgeId to set of Network`Request
GenerateRequestsForHelp() ==
  (dcl requests: map Network`EdgeId to set of Network`Request := {|->};
      for all eid in set problematicedges do
        if exists ieid in set interestededges & 
              {ieid, eid} subset dom network.GetConnections() and 
              network.IsOutputEdge (ieid, eid)
        then let ieid in set interestededges be st network.IsOutputEdge (ieid, eid)
             in 
               let severe = Utility(network.GetMaxSpeed(eid),trafsit(eid), prios(eid)),
                   r = mk_Network`Request (eid, <IncreaseInput>, severe, 0, false)
               in
                 requests(ieid) := if ieid in set dom requests 
                                   then requests(ieid) union {r}
                                   else {r}
        elseif exists ieid in set interestededges & 
                  {ieid, eid} subset dom network.GetConnections() and 
                  network.IsInputEdge (ieid, eid)
        then let ieid in set interestededges be st network.IsInputEdge (ieid, eid)
             in
               let severe = Utility(network.GetMaxSpeed(eid),trafsit(eid), prios(eid)),
                   r = mk_Network`Request (eid, <DecreaseOutput>, severe, 0, false),
                   rm = {eid2 |-> mk_Network`Request (eid, <DecreaseOutput>, severe, 0, false)
                        | eid2 in set leadsto(eid)}
               in
                 (requests(ieid) := if ieid in set dom requests 
                                    then requests(ieid) union {r}
                                    else {r};
                  requests := requests ++ {eid3 |-> {rm(eid3)} union if eid3 in set dom requests
                                                                     then requests(eid3)
                                                                     else {}
                                          | eid3 in set dom rm})
        else skip;
     return requests
  )
pre problematicedges subset dom trafsit and 
    problematicedges subset dom prios;

public Step: Environment`TrafficSituation ==> ()
Step(ts) ==
  (dcl deltcm : TCM;
   IO`printf("Available controls for %s: %s\n", [myid, control]);
  trigger:= {|->};
   trafsit := ts;
   GenerateMyOwnTriggers(ts);
   let requests = GenerateRequestsForHelp() in
   ( network.CancelOldProblematicEdges(myid,oldproblematicedges\problematicedges);
     IO`printf("Requests: %s\n", [requests]);
     network.AddRequests (requests);
     let noproblems = network.GetNotProblematic()
     in
       for all eid in set noproblems
       do
         for all acteid in set dom actctrl
         do
           if let pairs = actctrl(acteid) in exists p in set pairs & p.#1 =  eid
           then (deltcm := let p in set actctrl(acteid) be st p.#1 =  eid in p.#2;
                 actctrl := {acteid} <-: actctrl;
                 trigger(acteid) := cases deltcm:
                                      mk_Diversion(-) -> {mk_Diversion(nil)},
                                      mk_HardShoulder(true) -> {mk_HardShoulder(false)},
                                      others -> undefined -- not yet tested
                                    end
                )
   )
  );

public MakeOffers: () ==> ()
MakeOffers() ==
  (for all eid in set myedges do
    let requestedservice = network.GetRequests(eid) in 
     if eid in set dom control and requestedservice <> {} and
        (eid in set dom actctrl => actctrl(eid) <> {}) -- Don't make an offer if it is in conflict with what is already there
     then -- here an arbitrary choice is made in case multiple requests are made for an edge. 
          -- In reality this should be improved in the future
          let requestor in set {ser.originator | ser in set requestedservice} in
          let severity in set {ser.severity | ser in set requestedservice}  in  
     let tcm = RequestedServices2PossibleTCMs(requestor, eid, {e.service | e in set requestedservice}) 
          in      
          let cost = Utility(network.GetMaxSpeed(eid),trafsit(eid), prios(eid))-severity in
             if tcm <> {}
             then ( network.MakeOffer (eid, cost);
                    negos := negos + 1;
                    IO`printf("Offers made by %s: %s with cost %s\n", [myid, negos, cost])
                  );
  );
  
public EvaluateOffers: () ==> ()
EvaluateOffers () ==
    (for all eid in set myedges do
    let offers = network.GetOffers(eid) 
    in
      for all provider in set dom offers do
        let reqs = offers(provider)
        in
          network.AcceptOffers (provider, {if request.cost < ACCEPTABLECOSTS
                                           then mu(request,accepted |-> true)
                                           else request
                                          | request in set reqs})
        );
  
public FinaliseOffers: () ==> Control
FinaliseOffers() ==
  (for all eid in set myedges do
    let offers = network.GetAcceptedOffers(eid),
        nonproblem = network.GetNotProblematic() in 
     if eid in set dom control and (offers <> {} or nonproblem <> {}) and
        true -- To be extended for cases where the requested service is in conflict with what is already there
     then if nonproblem <> {}
          then for all non in set nonproblem 
               do
                 let tcm = if eid in set dom actctrl 
                           then {p.#2 | p in set actctrl(eid) & p.#1 = non}
                           else {},
                     canceltcm = {cases t:
                                    mk_HardShoulder(-)   -> mk_HardShoulder(false),
                                    mk_MaxSpeed(-)       -> mk_MaxSpeed(nil),
                                    mk_LaneClosure(-)    -> mk_LaneClosure(0),
                                    mk_Diversion(-)      -> mk_Diversion(nil),
                                    mk_TrafficLight(-,-) -> mk_TrafficLight(true, NORMALGREENTIME),
                                    mk_RampMeter(-)      -> mk_RampMeter(NORMALREDTIME)
                                  end
                                 | t in set tcm}
               in 
                 trigger(eid) := canceltcm union
                                 if eid in set dom trigger
                                 then trigger(eid)
                                 else {}
          else let requestor in set { ser.originator | ser in set offers}  in  
               let tcm = RequestedServices2PossibleTCMs(requestor, eid, {e.service | e in set offers}) 
               in 
                (trigger(eid) := tcm union
                                if eid in set dom trigger
                                then trigger(eid)
                                else {};
          cases trigger(eid): -- this only works if there is exactly one tcm in the trigger for an edge
             {mk_HardShoulder(false)},
             {mk_MaxSpeed(nil)}, 
             {mk_LaneClosure(0)},
             {mk_TrafficLight(true, (NORMALGREENTIME))},
             {mk_Diversion(nil)},
             {mk_RampMeter((NORMALREDTIME))} -> actctrl := {eid} <-: actctrl,
             others -> let tcmpairs = {mk_(requestor,t) | t in set tcm}
                       in
                         actctrl := actctrl ++ {eid |-> tcmpairs union 
                                               if eid in set dom actctrl
                                               then actctrl(eid)
                                               else {}}
             end);
          acceptedoffers := acceptedoffers + 1;
          IO`printf("Accepted offers by %s: %s\n", [myid, acceptedoffers]);
          IO`printf("Final set of triggers generated by %s: %s\n", [myid, trigger]);
  return trigger
  );

-- This operation needs to determine which traffic control measures can be applied
-- in response to a request for help, expressed in terms of a "service" to be
-- provided. Multiple service can be requested, and in turn multiple control 
-- measures can be suggested. So it can be quite complicated, e.g. in cases where
-- requested services are contradictory (e.g. IncreaseCapacity, DecreaseCapacity.
-- The operation is not so advanced yet, it only deals with one arbitrary control
-- measure that can provide the service. Contradictory services are not yet dealt
-- with.
pure RequestedServices2PossibleTCMs: Network`EdgeId * Network`EdgeId * set of ServiceId ==> set of TCM
RequestedServices2PossibleTCMs (rid, eid, services) ==
   cases services:
      {<IncreaseInput>}  -> if exists tcm in set control(eid) & is_RampMeter(tcm) 
                            then return {mk_RampMeter(let redtime = GetCurrentRedTime(eid) in
                                                      if redtime > STEPREDTIME 
                                                      then redtime - STEPREDTIME 
                                                      else NORMALREDTIME)} 
                            else return {},
      {<DecreaseOutput>} -> if exists tcm in set control(eid) & is_Diversion(tcm) 
                            then return SetDiversion(rid) -- Diversion needs to be set properly. For this the eid of the requestor for help needs to be included in the game.
                            else return {},
      {<IncreaseInput>, 
       <DecreaseOutput>} -> return {}, -- not sophisticated enough.
      others -> return {}
   end;
   
-- This operation returns the current red time of a RampMeter at the beginning
-- of an edge. Obviously it still needs to be done properly.
pure GetCurrentRedTime: Network`EdgeId ==> nat
GetCurrentRedTime (eid) ==
  if eid in set dom actctrl and exists tcm in set actctrl(eid) & is_RampMeter(tcm.#2)
  then let tcm in set actctrl(eid) be st is_RampMeter(tcm.#2) in return tcm.#2.redtime
  else return STANDARDREDTIME;
  
functions

-- The Utility function needs fine tuning
Utility: nat1 * Environment`EdgeSit * Priority +> real
Utility (maxspeed, ts, prio) ==
   let mk_(-,v,-,-,-) = ts
   in
     (maxspeed - v)/ prio
pre maxspeed >= ts.#2 and prio <> 0;
   
TCM2Service: TCM * TCM +> ServiceId
TCM2Service (tcm_old, tcm_new) ==
   cases true:
     (is_MaxSpeed(tcm_old))     -> MaxSpeed2Service(tcm_new),
     (is_Diversion(tcm_old))    -> Diversion2Service(tcm_new),
     (is_TrafficLight(tcm_old))	-> TrafficLight2Service(tcm_old, tcm_new),
     (is_RampMeter (tcm_old))   -> RampMeter2Service(tcm_old, tcm_new),
     (is_HardShoulder(tcm_old)) -> HardShoulder2Service(tcm_new),
     (is_LaneClosure(tcm_old))  -> LaneClosure2Service(tcm_old, tcm_new)
   end;

MaxSpeed2Service: MaxSpeed +> ServiceId
MaxSpeed2Service(tcm_new) ==
  if tcm_new.speed = nil 
  then <DecreaseCapacity> 
  else <IncreaseCapacity>;
  
Diversion2Service: Diversion +> ServiceId
Diversion2Service(tcm_new) ==
  if tcm_new.route <> nil 
  then <DecreaseOutput> 
  else <IncreaseInput>;

TrafficLight2Service: TrafficLight * TrafficLight +> ServiceId
TrafficLight2Service(tl_old, tl_new) ==
  if tl_new.greentime > tl_old.greentime 
  then <IncreaseOutput>
  else <DecreaseOutput>;
  
RampMeter2Service: RampMeter * RampMeter +> ServiceId
RampMeter2Service(rm_old, rm_new) ==
  if rm_new.redtime > rm_old.redtime 
  then <DecreaseInput> 
  else <IncreaseInput>;
 
HardShoulder2Service: HardShoulder +> ServiceId
HardShoulder2Service(hardshoulder) == 
  if hardshoulder.open 
  then <IncreaseCapacity> 
  else <DecreaseCapacity>;
  
LaneClosure2Service: LaneClosure * LaneClosure +> ServiceId
LaneClosure2Service(lc_old, lc_new) == 
  if lc_new.closed < lc_old.closed
  then <IncreaseCapacity> 
  else <DecreaseCapacity>;

TMSInv: set of Network`EdgeId * set of Network`EdgeId +> bool
TMSInv(e_s,i_s) == 
 e_s inter i_s = {};
 
public ConvertTCM: seq of char +> TCM
ConvertTCM(string) ==
  cases string:
    "MaxSpeed" -> mk_MaxSpeed(nil),
    "Diversion" -> mk_Diversion(""),
    "TrafficLight" -> mk_TrafficLight(true, STANDARDGREENTIME),
    "RampMeter" -> mk_RampMeter(NORMALREDTIME),
    "HardShoulder" -> mk_HardShoulder(CLOSED),
    "LaneClosure" -> mk_LaneClosure(0)
  end;
  
public ConvertBridge: seq of char +> Object
ConvertBridge(string) ==
  cases string:
    "Bridge" -> mk_Bridge(<closed>)
  end;
  
AddTrig: set of TCM * set of TCM +> set of TCM
AddTrig(s1,s2) ==
  if s2 = {}
  then s1 
  else let tcm in set s2 
       in
         (if forall t in set s1 & DifferentTypes(t,tcm)
          then {tcm} 
          else  {}) union AddTrig(s1,s2\{tcm})
measure Card;

Card: set of TCM * set of TCM +> nat
Card(-,s) == card s;

DifferentTypes: TCM * TCM +> bool
DifferentTypes(t,s) ==
  not ((is_MaxSpeed(t) and is_MaxSpeed(s)) or
       (is_Diversion(t) and is_Diversion(s)) or
       (is_TrafficLight(t) and is_TrafficLight(s)) or
       (is_RampMeter(t) and is_RampMeter(s)) or
       (is_HardShoulder(t) and is_HardShoulder(s)) or
       (is_LaneClosure(t) and is_LaneClosure(s)));
 
end TMS
~~~
{% endraw %}

### EdgeCommand.vdmpp

{% raw %}
~~~
class EdgeCommand

	instance variables
		public curSpeed     : nat := 0;
		public openNumLanes : nat := 0;
		
		-- blocked due to traffic-lights / accidents
		public isBlocked    : bool := false;

	  -- weather
		public minTimeBetweenCars: real := 0.0;

operations

public Update: nat * nat * bool * real ==> ()
Update(cs,onl,ib,mtbc) ==
  (curSpeed := cs;
   openNumLanes := onl;
   isBlocked := ib;
   minTimeBetweenCars := mtbc);
   
end EdgeCommand
~~~
{% endraw %}

### AWorld.vdmpp

{% raw %}
~~~
class World

types

public TMSId = seq of char;
  
instance variables

static network : Network := new Network({|->});
env: Environment;
static public tms1: TMS := new TMS("Rotterdam", network);
static public tms2: TMS := new TMS("RWS", network);
static tms_m : map TMSId to TMS := {"Rotterdam" |-> tms1, "RWS" |-> tms2};
collaboration : bool := true;

operations

public run: ()  ==> () --Performance
  run() == (
  	Run("RotterdamNetwork.csv", "TMSconfiguration.csv", 300)
	);
	
public runwithoutcollab: ()  ==> () --Performance
  runwithoutcollab() == (
  	SetCollaboration(false);
  	Run("RotterdamNetwork.csv", "TMSconfiguration.csv", 300)
	);
	
  public Run: seq of char * seq1 of char * [nat] ==> () --Performance
  Run(network_file, tms_file, simtime) == (
  	network := ReadRoadNetwork(network_file);
  	for all tid in set dom tms_m do
  	  tms_m(tid).ResetNetwork(network,self);
  	ReadTMSs(tms_file, network);
  	env := new SimulatorEnvironment(network, tms_m, simtime);
  	for all tid in set dom tms_m do
  	  tms_m(tid).UpdateInternalEdges();
  	env.Run(collaboration,network_file,tms_file)
	);
	  
  public ReadRoadNetwork: seq1 of char ==> Network
  ReadRoadNetwork(file_n) ==
    let mk_(ok,lines) = CSV`flinecount(file_n)
    in
      if ok 
      then (dcl net : map Network`EdgeId to Edge := {|->};
            for i = 1 to lines do
            -- each line in the network configuration file contains
            -- - The identifier of the edge
            -- - the starting node for the edge
            -- - the ending node for the edge
            -- - the length of the edge
            -- - the number of lanes for the edge
            -- - the maximum speed for the edge
            -- - flow of cars into the edge
             let mk_(ok,[edgeid,startid,endid,l,lane,max,inflow]) = 
                  CSV`freadval[seq of (nat | seq of char)](file_n,i)
             in net(edgeid) := new Edge(max,lane,l,mk_token(startid),mk_token(endid));
             return new Network(net)
           )
      else error;
      
  public ReadTMSs: seq of char * Network ==> ()
  ReadTMSs(file_n, n) ==
    let mk_(ok,lines) = CSV`flinecount(file_n)
    in
      if ok 
      then (for i = 1 to lines do
            -- each line in the TMS configuration file contains:
            -- - the identification of the TMS
            -- - an identification of the edge included
            -- - a traffic control measure if available (alternatively nil is included)
            -- - a priority if available (alternatively nil is included)
            -- - possible suggested routes to make diversions avoiding the edge
             let mk_(ok,[tmsid,edgeid,tcm,prio,diversions]) = 
                  CSV`freadval[seq of ([nat] | seq of char |set of seq of seq of char)](file_n,i),
                  tid = tmsid
             in (  --{["A202","S109","S102","A153"],["A42","A43","A152","A153"],["A42","S114","S102","A153"]}
               if not tid in set dom tms_m 
               then tms_m(tid) := new TMS("Invalid TMS", n);-- this should never happen
               tms_m(tid).AddEdge({edgeid});
               if tcm <> nil and tcm <> "Bridge" then tms_m(tid).AddTCM(edgeid,TMS`ConvertTCM(tcm));
               if tcm <> nil and tcm = "Bridge" then tms_m(tid).AddBridge(edgeid,TMS`ConvertBridge(tcm));
               if prio <> nil then tms_m(tid).AddPriority(edgeid,prio);
--               if diversions <> nil
--               then network.AddDiversionRoutes(edgeid, 
--                                               {[r(j) | j in set inds r]
--                                               | r in set diversions})
             );
						 for all tid in set dom tms_m do tms_m(tid).CalculateInterest(n);-- sort out interested edges	
           )
      else error;
      
 public SetCollaboration: bool ==> ()
 SetCollaboration(b) ==
   collaboration := b;

end World
~~~
{% endraw %}

