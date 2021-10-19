---
layout: default
title: IMMPP
---

## IMMPP
Author: Till Böttjer


This example models a controller for an Injection Moulding Machine.
This model was mainly developed by Till Böttjer, a part of his PhD 
work. More information can be found in:

Till Böttjer, Michael Sandberg, Peter Gorm Larsen, and Hugo Daniel Macedo,
Modelling an Injection Moulding Machine using the Vienna Development Method
Incremental, In OVT-19: 19th Overture Workshop, 2021. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().ScenarioCSV("scenario_A.csv")|


### InjectionMachine.vdmpp

{% raw %}
~~~
/*
The InjectionMachine class resembles the machine tool and contains parameters relevant for the injection moulding provcess. 
The injection machine is initialized in Idle state with the Gate closed, and all parameters set to zero state.
*/

class InjectionMachine


types

	stateType = <Filling> | <Packing> | <Cooling> | <Ejecting> | <Idle>; 
	LockState = <Open>    | <Closed>;

	
instance variables

	public env_x : real;          -- position of screw
	public env_p_hyd : real;      -- hydraulic pressure
	public v_t : real;            -- target velocity during filling
	public env_p_hyd_t : real;    -- target pressure == holding pressure
	
	public env_state : stateType; -- current phase 
	env_lock   : LockState;	  
  
  
operations

	public InjectionMachine : (real) ==> InjectionMachine
	InjectionMachine(x0) == (
		env_state   := <Idle>;
		env_lock    := <Closed>;
		env_x       := x0;
		env_p_hyd   := 0;
		v_t         := 0; 
		env_p_hyd_t := 0;
	);
	
	public Step : () ==> () 
	Step() == (
		IMM_System`ps.setReading(env_x);
		IMM_System`prs.setReading(env_p_hyd);
		);

	
	public GetPosition : () ==> real 
	GetPosition() ==  return env_x;
	
	public GetTargetVelocity : () ==> real 
	GetTargetVelocity() == return v_t;
		
	public SetPosition : real ==> ()
	SetPosition(r) == env_x := r;
	
	public SetTargetVelocity : (real) ==> () 
	SetTargetVelocity(vt) == v_t := vt;
	
	public SetPressure : real ==> () 
	SetPressure(p) == env_p_hyd := p;
	
end InjectionMachine
~~~
{% endraw %}

### World.vdmpp

{% raw %}
~~~
/*
To date, injection moulding machines integrate a complex control and software systems including closed-loop process, open-loop phase, 
safety and quality control. We developed an abstract model of the control architecture of an injection moulding machine.   
This model was developed in Overture version 3.0.0. We selected the VDM-RT dialect to implement the process/machine controller, 
quality controller and data acquisition system as a distributed control architecture. 
The \texttt{World} class is the top-level entry point to the model. A scenario is input from a CSV file containing timestep, screw position, 
hydraulic pressure and the order to start production of a new plastic element. The logger operation returns a CSV file after each step of the simulation. 
*/

class World

types

	public Position = real;
	public Pressure = real;
	public Order = real;
	public TimeStamp = real;

instance variables

	public static  env : [Environment] := nil;
  
operations

	public World : () ==> World
  World() == (env := new Environment(); );
		

	public ScenarioCSV : seq of char ==> ()
	ScenarioCSV(scenario) == (RunCSVScenario(scenario););
	
	
	public Stimulate : real * real * real * real ==> ()
	Stimulate(ts,pos,pres,order) == (
		-- Check if order is started
		if (order = 1) then IMM_System`ctl.Start();	
		-- Step the time by ts 
		IMM_System`timer.StepTime(ts);
		
		-- Deliver input pos and pres
		if (IMM_System`m.GetState() = <Off>)
		then	IMM_System`imm.SetPosition(pos);
		
		IMM_System`imm.SetPressure(pres);
		IMM_System`imm.Step();

		-- Step the controller		
		IMM_System`ctl.Step();
		IMM_System`m.Step(ts);
		
		Logger(); );	 
	
	
	public RunCSVScenario: seq1 of char ==>  ()
  RunCSVScenario(file_n) ==
    let mk_(ok,lines) = CSV`flinecount(file_n)
    in
      if ok 
      then (for i = 1 to lines do
            -- each line in the test events contains
            -- - The timestamp ts where event occured
            -- - The position sensor input
            -- - The pressure sensor input 
            -- - The order execution command
             let mk_(ok,[ts,pos,pres,order]) = 
                  CSV`freadval[seq of real](file_n,i)
             in Stimulate(ts,pos,pres,order);
           )
      else return; 
   
    
   public Logger : () ==> ()
   Logger() == (
   	 let b = CSV`fwriteval("out.csv",[IMM_System`timer.GetTime(),
	 																	 IMM_System`ctl.ctl_x,
	 																	 IMM_System`imm.env_x,
	 																	 IMM_System`ctl.ctl_v,
	 																	 IMM_System`imm.v_t,
	 																	 IMM_System`ctl.ctl_state,
	 																	 env.getAccepted(),
	 																	 env.getScrapped()],<append>)
	 in return;	);
	
	
end World

~~~
{% endraw %}

### PositionSensor.vdmpp

{% raw %}
~~~
/*
In the following we have the \texttt{PositionSensor} class for which the instances 
model the position of the screw in the barrel of e IMM.
The class is a standard sensor model class, yet  we define a position invariant, 
given that the screw positions are from 0 to 40 mm.
*/

class PositionSensor is subclass of Sensor

types 
	Position = real 
	--inv r ==  r >= 0 and r <= 40;
	
instance variables

	value : Position;

operations

	public PositionSensor : real  ==> PositionSensor
	PositionSensor(r) == value := r;

	public getReading: () ==> real
	getReading() == return value;
   
  public setReading: real ==> ()
	setReading(r) == value := r;
	              
  public Step : () ==> ()
  Step() == return;

end PositionSensor
~~~
{% endraw %}

### IMM_System.vdmpp

{% raw %}
~~~
class IMM_System

instance variables
	
	public static timer : Timer := new Timer();
	public static imm : InjectionMachine := new InjectionMachine(0);
	
	-- Controllers
	public static ctl : Controller := new Controller();
	
	-- Actuator
	public static b : Belt := new Belt();
	public static m : MotorActuator := new MotorActuator();
	
	-- Sensor
	public static ps   : PositionSensor := new PositionSensor();
	public static prs  : PressureSensor := new PressureSensor();
	public static prs5 : PressureSensor := new PressureSensor();
		
	public static gs : GateSensor := new GateSensor(false);
	 
end IMM_System
~~~
{% endraw %}

### Environment.vdmpp

{% raw %}
~~~
class Environment

types
   Bin = nat;

instance variables
   accepted : Bin;
   scrapped : Bin;
   
operations

	public Environment : () ==> Environment
	Environment() == (
				accepted := 0;
				scrapped := 0;
	);

	public handleAcceptEvent : () ==> ()
	handleAcceptEvent() == accepted := accepted + 1;
	
	public handleScrapEvent : () ==> ()
	handleScrapEvent() == scrapped := scrapped + 1;
	
	public getAccepted : () ==> nat
	getAccepted() == return accepted;
	 
	public getScrapped : () ==> nat
	getScrapped() == return scrapped;

end Environment
~~~
{% endraw %}

### Timer.vdmpp

{% raw %}
~~~
/*
This is the Timer class containing the current simulation time. 
Functionality includes a GetTime operation returning the current time, 
and a StepTime operation to advance the simulation time by delta.
*/

class Timer

instance variables
  public stime : real;      -- simulation time
  
  
operations
	-- Constructor 
	public Timer: () ==> (Timer) 
	Timer() == (
		stime := 0;
	);
	
	-- Simulation timer
 	public GetTime : () ==> real
	GetTime() == return stime;
	
	public StepTime : (real) ==> () 
	StepTime(delta) == (
		stime := stime + delta;
	);
	
end Timer
~~~
{% endraw %}

### MotorActuator.vdmpp

{% raw %}
~~~
class MotorActuator

types
	public ActuatorState = <On> | <Off>;


instance variables

	public act_state : ActuatorState;


functions

	public CalcPosition : real * real * real -> real
	CalcPosition(x, v_t, ts) == x + v_t * ts;
	
	
operations

	public MotorActuator : () ==> MotorActuator 
	MotorActuator() == (
		act_state := <Off>;
	);
	
	public GetState : () ==> ActuatorState
	GetState() == return act_state;
	
	public SetState : (ActuatorState) ==> ()
	SetState(act) == act_state := act;
	
	public Step : (real) ==> () 
	Step(ts) == (
		if (IMM_System`m.GetState() = <On>)
		then	IMM_System`imm.SetPosition(CalcPosition(IMM_System`imm.GetPosition(),IMM_System`imm.GetTargetVelocity(),ts));
	);
	

end MotorActuator
~~~
{% endraw %}

### Belt.vdmpp

{% raw %}
~~~
class Belt
	
instance variables

	value : real;

operations

	public Belt : () ==> Belt 
	Belt() == value := 1;
	
	public Accept : () ==> ()
	Accept () ==  World`env.handleAcceptEvent();
                 
  public Scrap : () ==> ()
	Scrap () == World`env.handleScrapEvent();      
                       
  public Step : () ==> ()
  Step() ==  return;

end Belt
~~~
{% endraw %}

### PressureSensor.vdmpp

{% raw %}
~~~
class PressureSensor is subclass of Sensor

types 

	Pressure = real
	inv r == r >= 0 and r <= 100;

instance variables

	value : Pressure;

operations

	public PressureSensor : real ==> PressureSensor
	PressureSensor(r) == value := r;

	public getReading: () ==> real
	getReading() == return value;
   
  public setReading: real ==> ()
	setReading(r) == value := r;
	              
  public Step : () ==> ()
  Step() == return;
  
end PressureSensor
~~~
{% endraw %}

### GateSensor.vdmpp

{% raw %}
~~~
class GateSensor 

instance variables

	value : bool;

operations

	public GateSensor: bool ==> GateSensor
	GateSensor(p) == value := p;
	
	public getReading: () ==> bool
	getReading() == return value;
	   
	public setReading: bool ==> ()
	setReading(b) == value := b;
	
	public Step : () ==> ()
	Step() == return;

end GateSensor
~~~
{% endraw %}

### Controller.vdmpp

{% raw %}
~~~
/*
The Controller class is reponsible for stepping through the 4+1 phases during the injection moulding process while monitoring quality of the moulded part based on process parameters. 
The functionality of each phase is implemented as operations - FillStep, PackStep, CoolStep and EjectStep. The Delta operation contains a Cases-statement to switch between phases.
*/

class Controller


types
	StateType = <Filling> | <Packing> | <Cooling> | <Ejecting> | <Idle>; 
	LockState = <Open> | <Close>;
	Quality   = <OK> | <Scrap>;


values

	-- Ram velocity setpoints v_f
	public v1 : real = 20;
	public v2 : real = 40;
	public v3 : real = 5;
	
	-- Position cutpoints
	public x1 : real = 3.8;
	public x2 : real = 15.2;
	public x3 : real = 20.3; -- switch over position to pressure control
	-- Packing pressure 
	public phold : real = 2.88;
	
	public t_fill : real = 3;
	public t_pack : real = 6; -- relative packing time
	public t_cool : real = 7; -- relative cooling time
	public t_eject : real = 0.2; -- relative eject time 

	-- Control constant screw motion 
	K_p = 0.9; 
	K_d = 0.3; 
		
		
instance variables

	public ctl_x : real; -- position of screw
	public ctl_v : real; -- velocity of screw
	
	public ctl_p_hyd : real;      -- hydraulic pressure
	p_hold : real;     -- target pressure during packing
	
	public ctl_state : StateType; -- current phase 
	ctl_bin : Quality;
	lock : LockState;
 	tphase : real; -- start time phase n
 	
 	-- Cooling PD Control
 	last_time : real; -- last time step
 	e_ti_last : real := 0;
 	e_ti : real := 0;
 	e'_ti : real := 0;
 	ctl_x_last : real := 0;
 	
  -- Quality Control
 	ctl_x_max  : real;
 	hyd_peak_max : real;
 	hyd_peak_ok : bool;
 	
  inv InterlockInvariant(lock,ctl_state)
  
  

functions
  -- Check Property 1
	InterlockInvariant : LockState * StateType -> bool
	InterlockInvariant (ls,s) == (ls = <Open>) => (s = <Idle>); 
	           
                                    
	                          
operations

	public Controller: () ==> Controller 
	Controller() == (
		ctl_state := <Idle>; 
		ctl_bin := <OK>;
		ctl_x := 0; 
		ctl_v := 0;
		ctl_p_hyd := 0;
	  
	  -- Quality control
	  ctl_x_max := 0;
	  hyd_peak_max := 0;
	  hyd_peak_ok := true;
	  
		lock := <Close>;
		tphase := 0;
		last_time := 0;
		p_hold := 2.88; -- [MPa]	
		);
		
		public Step: () ==> ()
		Step() == (
		
		 cases ctl_state:
		    <Idle> -> return,
		    <Filling> -> FillStep(),
		    <Packing> -> PackStep(),
		    <Cooling> -> CoolStep(),
		    <Ejecting> -> EjectStep()
		 end;	);

	public FillStep : () ==> () 
	FillStep() == (		
		dcl t: real;
		
		-- Fetch sensor reading
		ctl_x := IMM_System`ps.getReading();
		
		-- Run control logic
		if (ctl_x < x1)
		then (IMM_System`imm.v_t := v1)
		elseif (ctl_x < x2) 
	  then (IMM_System`imm.v_t := v2)
	  elseif (ctl_x < x3) 
	  then (IMM_System`imm.v_t := v3)
	  -- Transition to Packing
	  else Delta();
	  
	  -- Transition to Packing
	  if(IMM_System`timer.GetTime()-tphase >= t_fill) 
	  then Delta(); 
	  
	  -- Quality control
	  -- Property 2
	  if (ctl_x > ctl_x_max) then ctl_x_max := ctl_x;
	  
	  -- Property 3
	  t         := IMM_System`timer.GetTime();
	  ctl_p_hyd := IMM_System`prs.getReading();
	  
	  if (t <= 0.9 and ctl_p_hyd >= 11) 
	  then hyd_peak_ok := false;
	   
	  if (t >=1.1 and ctl_p_hyd >= 11) 
	  then hyd_peak_ok := false;
	  
	  if (t > 0.9 and t < 1.1 and hyd_peak_ok and hyd_peak_max < ctl_p_hyd)
	  then hyd_peak_max := ctl_p_hyd;
	  	  
	  )
	  pre ctl_state = <Filling>;
	  
	
	public PackStep : () ==> ()
	PackStep() == ( 
	
		-- Fetch sensor reading
		ctl_p_hyd := IMM_System`prs.getReading();
		ctl_x := IMM_System`ps.getReading(); 
		
		-- Set holding pressure 
		IMM_System`imm.env_p_hyd_t := p_hold;

    -- Transition to Cooling
	  if(IMM_System`timer.GetTime()-tphase >= t_pack) 
	  then Delta(); 
	  
	  )
	  pre ctl_state = <Packing>;
	  
	
	public CoolStep : () ==> ()
	CoolStep() == (
		dcl t : real := IMM_System`timer.GetTime();
		dcl dt : real := (t - last_time);
		last_time := t;
		
		ctl_x_last := ctl_x;	
		ctl_x := IMM_System`ps.getReading();
			
		e_ti_last := e_ti; 
		e_ti := 0 - ctl_x_last;
		e'_ti := (e_ti - e_ti_last)/dt;
				
		IMM_System`imm.SetTargetVelocity(K_p * e_ti + K_d * e'_ti);
		
		if (IMM_System`timer.GetTime()-tphase >= t_cool)
  	then Delta(); )
  	pre ctl_state = <Cooling>
	  post if (ctl_state = <Ejecting>) then abs (e_ti - 0) < 0.1 else true;
	
	public EjectStep : () ==> () 
	EjectStep() == (
		-- Actuate ejector pins (Currently assumed to happen automatically)
		
	  -- Invoque Quality Control Logic
		let success : bool = PartIsOK()
		in if (success) then 
			    ctl_bin := <OK>
		   else 
			    ctl_bin := <Scrap>;
			 		
		-- Check if there is a jam
		if(IMM_System`timer.GetTime()-tphase > t_eject)
		then ( -- Send the ctl_bin to Environment handle event
		       if (ctl_bin = <OK>) then IMM_System`b.Accept()
		       										 else IMM_System`b.Scrap();
		       Delta()
		     );	)
		pre ctl_state = <Ejecting>;
		     

	public Delta : () ==> ()
	Delta() == (
		cases ctl_state:
		   <Idle> -> 	(ctl_state := <Filling>;),
		   
		   <Filling> -> (ctl_state := <Packing>;
		   							IMM_System`imm.env_state := <Packing>; 
		   							tphase := IMM_System`timer.GetTime();
		   							IMM_System`imm.v_t := 0;),
		   							
		   <Packing> -> (ctl_state := <Cooling>; 		
		   							IMM_System`imm.env_state := <Cooling>;	
		   							tphase := IMM_System`timer.GetTime();
		   							IMM_System`m.SetState(<On>);
		   						  e_ti := 0 - ctl_x_last;),
		   							
		   							
		   <Cooling> -> (ctl_state := <Ejecting>;
		   							IMM_System`imm.env_state := <Ejecting>;
		   							tphase := IMM_System`timer.GetTime()),
		   							
		   <Ejecting> -> (ctl_state := <Idle>; 
		   							 IMM_System`imm.env_state := <Idle>;)
		   end 
		   );
	
	
	public Start : () ==> ()
  Start () == 
              if lock = <Close> 
              then (
                   -- Initialize variables
                   ctl_state := <Filling>;
                   ctl_x_max := 0;
                   hyd_peak_ok := true;
                   hyd_peak_max := 0;
                   -- Send start signal to output interface
              		 IMM_System`imm.env_state := <Filling>;
              		)
              else error
              pre ctl_state = <Idle>;
              
              
           
	PartIsOK : () ==> bool
	PartIsOK () == return (ctl_x_max >= 20.3) and hyd_peak_ok and (hyd_peak_max >= 9.1); -- Check Property 2


end Controller
~~~
{% endraw %}

### Sensor.vdmpp

{% raw %}
~~~
class Sensor

operations

  public setReading: real ==> ()
  setReading(r) == is subclass responsibility;  
  
end Sensor
~~~
{% endraw %}

