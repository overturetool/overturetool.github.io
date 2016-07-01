---
layout: default
title: ChessWayRT
---

## ChessWayRT
Author: Marcel Verhoef and Bert Bos and Ken Pierce


This example shows the discrete event model used for
co-simulation of the ChessWay personal people mover
as used in the DESTECS project (see http://www.destecs.org).
It reflects the status of the model which is mentioned
in the paper <I>A Formal Approach to Collaborative Modelling
and Co-simulation for Embedded Systems</I> which is submitted
to the Journal Mathematical Structures in Computer Science.
The corresponding continuous time model is available
through the first author.

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().RunVdmRt()|


### Accelerometer.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                     
class Accelerometer

instance variables
  -- link back to the controller managing this resource
  private mController : Controller;

operations
  public Accelerometer: Controller ==> Accelerometer
  Accelerometer (pController) == mController := pController;

  public getAccelerationData: () ==> real * real * real
  getAccelerationData () ==
    duration (0)
      ( dcl ax : real := mController.getValue("ACC_X"),
            ay : real := mController.getValue("ACC_Y"),
            az : real := mController.getValue("ACC_Z");
        return mk_(ax, ay, az) )
  
end Accelerometer
            
~~~
{% endraw %}

### Actuator.vdmrt

{% raw %}
~~~
class Actuator is subclass of IActuatorReal

instance variables

-- actuator value
value: real;

operations

-- constructor for PWM
public Actuator : real ==> Actuator 
Actuator(v) ==
	value := v;

-- default constructor for PWM
public Actuator: () ==> Actuator
Actuator() ==
	Actuator(0.0);

-- set actuator value
public SetValue: real ==> ()
SetValue(v) ==
  ( IO`printf("SetValue = %s\n", [v]);
	value := v );

end Actuator
~~~
{% endraw %}

### ChessWay.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
system ChessWay

instance variables
  -- architecture definition (two CPUs at 10 MIPS)
  fpga1 : CPU := new CPU(<FP>, 10E6);
  fpga2 : CPU := new CPU(<FP>, 10E6);

  -- communication infrastructure (one BUS at 100 kpbs)
  bus : BUS := new BUS(<FCFS>, 100E3, {fpga1, fpga2});
                            
instance variables
  -- sensors (co-simulation variables)
  public static acc_in: [ISensorReal] := nil;
  public static vel_in: [ISensorReal] := nil;

  -- actuators (co-simulation variables)
  public static acc_out: [IActuatorReal] := nil;
  public static vel_out: [IActuatorReal] := nil
                            
instance variables
  -- deployable objects (two controllers)
  static public lctrl : LeftController := new LeftController();
  static public rctrl : RightController := new RightController();

  -- flag to enable debugging logging in system classes
  static public debug : bool := true
                                                                                                                                                                                                                                    
operations
  -- construct the system class
  public ChessWay : () ==> ChessWay
  ChessWay () == 
    ( -- deploy the controllers on the CPUs
      fpga1.deploy(lctrl,"LeftCtrl");
      fpga2.deploy(rctrl,"RightCtrl") );
 
end ChessWay
             
~~~
{% endraw %}

### Controller.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                    
class Controller

values
  -- control loop sample time (1 ms)
  public SAMPLETIME = 0.001

instance variables
  -- identify the controller by name
  public mName : seq of char;

  -- the motor that is controlled
  public mMotorActuator : MotorActuator;
  public mMotorSensor : MotorSensor;

operations
  -- constructor
  public Controller: seq of char ==> Controller
  Controller (pName) ==
    ( -- initialise the name of the controller
      mName := pName;
      -- initialise the motor actuator and sensor
      mMotorActuator := new MotorActuator(self);
      mMotorSensor := new MotorSensor(self) )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
instance variables
  -- link back to the environment
  protected mEnvironment : [Environment] := nil;

operations
  -- establish a link to the environment model
  public setEnvironment: Environment ==> ()
  setEnvironment (pEnvironment) == mEnvironment := pEnvironment;

  -- push a value to the environment
  public setValue: seq of char * real ==> ()
  setValue (pName, pValue) ==
    mEnvironment.setValue(mName^"_"^pName, pValue)
  pre mEnvironment <> nil;

  -- get a value from the environment
  public getValue: seq of char ==> real
  getValue (pName) ==
    return mEnvironment.getValue(mName^"_"^pName)
  pre mEnvironment <> nil
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
values
  protected DEBUGCTRLLOOP = 2
 
operations
  -- prototype used for simulation diagnostics
  protected printDiagnostics: nat ==> ()
  printDiagnostics (pLoopCnt) ==
    duration (0)
      ( -- generic diagnostics announcement
        IO`printf(mName ^ " controller at %s on %s\n",
          [pLoopCnt, time / 1E9]);
        -- print the actuator internal state
        mMotorActuator.printDiagnostics() )

operations
  -- prototype for the device power-up
  public PowerUp: () ==> ()
  PowerUp () == is subclass responsibility

operations
  -- prototype of the main control loop
  async private CtrlLoop: () ==> ()
  CtrlLoop () == 
    ( -- use standard GoF behavior pattern
      duration (0) CtrlLoopEntry();
      CtrlLoopBody();
      duration (0) CtrlLoopExit() );

  -- auxiliary operation are used for diagnostics
  -- always executes with zero duration
  public CtrlLoopEntry: () ==> ()
  CtrlLoopEntry () == skip;

  public CtrlLoopBody: () ==> ()
  CtrlLoopBody () == is subclass responsibility;

  -- auxiliary operation are used for diagnostics
  -- always executes with zero duration
  public CtrlLoopExit: () ==> ()
  CtrlLoopExit () == skip;

thread
  -- the control loop runs at 1kHz with a 750 msec initial offset
  periodic (1, 0, 0, 0) (CtrlLoop)

end Controller
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
~~~
{% endraw %}

### DirectionSwitch.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                            
class DirectionSwitch

instance variables
  -- link back to the controller managing this resource
  private mController : Controller;

operations
  public DirectionSwitch: Controller ==> DirectionSwitch
  DirectionSwitch (pController) == mController := pController

types
  public tDirectionStatus = <LEFT> | <NEUTRAL> | <RIGHT>

operations
  public getStatus: () ==> tDirectionStatus
  getStatus () == 
    duration (0)
      ( dcl dir : real := mController.getValue("DIRECTION");
        -- negative value indicates left turn
        if dir < 0.0 then return <LEFT>;
        -- positive value indicates right turn
        if dir > 0.0 then return <RIGHT>;
        -- zero indicates no turn - move straight
        return <NEUTRAL> )

end DirectionSwitch
            
~~~
{% endraw %}

### DTControl.vdmrt

{% raw %}
~~~
class DTControl is subclass of DTObject

operations

-- calculates output, based on the error
public Output: real ==> real
Output(err) == 
	is subclass responsibility

end DTControl
~~~
{% endraw %}

### DTObject.vdmrt

{% raw %}
~~~
class DTObject

instance variables

protected sampletime: real := 1.0E-9;

operations

public SetSampleTime: real ==> ()
SetSampleTime(s) ==
	sampletime := s
pre s >= 0

end DTObject
~~~
{% endraw %}

### Environment.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
class Environment

values
  reserved : set of seq of char = {
    -- the accelerometer on to the LEFT controller
    "LEFT_ACC_X", "LEFT_ACC_Y", "LEFT_ACC_Z",
    -- the wheel connected to the LEFT controller
    "LEFT_HALL1", "LEFT_HALL2", "LEFT_HALL3",
    "LEFT_PWM", "LEFT_ACTUATED",
    -- the gyroscope connected to the LEFT controller
    "LEFT_YAW_RATE",
    -- the wheel connected to the RIGHT controller
    "RIGHT_HALL1", "RIGHT_HALL2", "RIGHT_HALL3",
    "RIGHT_PWM", "RIGHT_ACTUATED",
    -- the direction switch on the RIGHT controller
    "RIGHT_DIRECTION",
    -- the ON/OFF switch on the RIGHT controller
    "RIGHT_ONOFF",
    -- the safety switch on the RIGHT controller
    "RIGHT_SAFETY",
    -- the user behavior
    "USER",
    -- alternate interface model (using KP CT model)
    "LEFT_ACC", "RIGHT_VEL"
  }
                                                                                                                                                                                                                                      
types
  -- all actuators are represented by a 3-tuple containing
  -- start time, start value, direction coefficient
  public tCtCurve = real * real * real;

  -- map open-loop sensor name to non-empty sequence of 3-tuples
  public tCtBehavior = map seq of char to seq1 of tCtCurve
  inv tcb == forall tc in set rng tcb & 
               forall i in set inds tc \ {1} &
                 tc(i-1).#1 < tc(i).#1 

instance variables
  -- collection of CT open-loop sensor signals
  -- these will be read from a file (scenario)
  private mCtBehavior : tCtBehavior := {|->}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
operations
  public loadCsvFile: seq of char * seq of char ==> ()
  loadCsvFile (pctvar, pfname) ==
    ( dcl lcnt : nat := 1, lctc : seq of tCtCurve := [mk_(0.0, 0.0, 0.0)];
      -- diagnostics
      IO`printf("Reading CSV file %s\n", [pfname]);
      def mk_(rb, rv) = CSV`flinecount(pfname) in
        if rb
        then ( dcl cx : real := 0, cy : real := 0;
               -- print diagnostics
               IO`printf("Reading %s lines from CSV file\n", [rv]);
               -- read all lines
               while rv >= lcnt do
                 let mk_(-, vs) = CSV`freadval[seq of real](pfname, lcnt) in
                   ( -- time must be strict monotone increasing
                     if vs(1) > cx
                     then ( lctc := lctc ^ [mk_ (cx+0.5, cy, 0.0)];
                            cx := vs(1);
                            cy := vs(2) )
                     else cy := (cy + vs(2)) / 2;
                     lcnt := lcnt + 1 );
               -- conditionally add the last value read
               if lctc(len lctc).#1 < cx
               then lctc := lctc ^ [mk_ (cx+0.5, cy, 0.0)];
               -- store the continuous time behavior
               mCtBehavior := mCtBehavior ++ {pctvar |-> lctc};
               -- create initial sensor settings
               evalSensors(0);
               -- create initial user behavior
               mUser.evaluate() )
        else ( IO`println("Loading CSV file failed");
               -- cause overture tool to abort execution
               error ) )
  pre pctvar in set reserved;

  -- auxiliary operation to load a simulation scenario
  public loadScenario: seq of char ==> ()
  loadScenario (pfname) ==
    ( -- diagnostics
      IO`printf("Reading scenario %s\n", [pfname]);
      def mk_(rb,rv) = IO`freadval[tCtBehavior](pfname) in
        if rb
        then ( -- print diagnostics
               IO`println("Scenario loaded successfully");
               -- store the behaviors
               mCtBehavior := rv;
               -- create initial sensor settings
               evalSensors(0);
               -- create initial user behavior
               mUser.evaluate() )
        else ( IO`println("Loading scenario failed");
               -- cause Overture tool to abort execution
               error ) );

  -- auxiliary operation executed by the main loop
  -- computes and updates the open-loop sensor values
  public evalSensors: real ==> ()
  evalSensors (ptime) ==
    -- iterate over all actuation signals
    for all iname in set dom mCtBehavior do
      -- retrieve the behavior descriptions
      def behaviors = mCtBehavior(iname) in
      def behavior = hd behaviors in
        -- single or multiple behavior descriptors
        if len behaviors = 1
        then
          evalSingle(ptime, iname, behavior)
        else
          -- retrieve the next behavior description
          def mk_(ltime, -, -) = hd tl behaviors in
            if ltime <= ptime
            then ( -- remove the current behavior if time passed
                   mCtBehavior := mCtBehavior ++
                     {iname |-> tl behaviors};
                   -- set the new open-loop sensor value
                   evalSingle(ptime, iname, hd tl behaviors) )
            else evalSingle(ptime, iname, behavior);

  public evalSingle: real * seq of char * tCtCurve ==> ()
  evalSingle (ptime, pname, mk_(ltime, lvalue, ldir)) ==
    setValue(pname, lvalue + ldir * (ptime - ltime))
  pre ptime >= ltime
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
instance variables
  -- flag to enable debugging logging in Environment classes
  static public debug : nat := 1

instance variables
  -- maintain a link to the World class
  private mWorld : World;

  -- the maximum simulation time
  private mMaxSimTime : nat;

  -- the wheel model
  private mLeftWheel : Wheel;
  private mRightWheel : Wheel;

  -- the hall sensor model
  private mLeftHall : HallSensor;
  private mRightHall : HallSensor;

  -- the user model
  private mUser : User;

operations
  -- constructor of the Environment class
  public Environment : World * nat ==> Environment
  Environment (pWorld, pMaxSimTime) == 
    ( -- link the environment to the World
      mWorld := pWorld;

      -- set the maximum simulation time
      mMaxSimTime := pMaxSimTime;

      -- create the wheel models
      mLeftWheel := new Wheel("LEFT", self);
      mRightWheel := new Wheel("RIGHT", self);

      -- create the hall sensor models
      mLeftHall := new HallSensor("LEFT", self, mLeftWheel);
      mRightHall := new HallSensor("RIGHT", self, mRightWheel);

      -- force the initial values for the Hall sensors
      mLeftHall.evaluate();
      mRightHall.evaluate();

      -- create the user model
      mUser := new User(self, mLeftWheel, mRightWheel) )
                                                                                                                                                                                                                                                                                                                                                           
instance variables
  -- sensors
  private ain: ISensorReal := ChessWay`acc_in;
  private vin: ISensorReal := ChessWay`vel_in;

  -- actuators
  private aout: IActuatorReal := ChessWay`acc_out;
  private vout: IActuatorReal := ChessWay`vel_out
                            
instance variables
  -- maintain the list of simulation values
  private mValues: map seq of char to real := {|->}
                                                                                                                                                                                                                                                                                                                                                                                               
operations
  -- auxiliary operation to store actuator data
  public setValue: seq of char * real ==> ()
  setValue (pName, pValue) ==
    duration (0)
      ( dcl currentValue : [real] :=
          if pName in set dom mValues
          then mValues(pName)
          else nil;
        -- update the value map
        mValues := mValues ++ {pName |-> pValue};
        -- check for co-sim variables
        setCosimValue(pName, pValue);
        -- print optional diagnostics
        if debug > 1 and pValue <> currentValue 
        then ( IO`print(pName ^ " is set to ");
               IO`print(pValue);
               IO`print(" at ");
               IO`print(time/1E9);
               IO`print("\n") ) )
  -- protect against illegal late bound names
  pre pName in set reserved;

  private setCosimValue: seq of char * real ==> ()
  setCosimValue (pName, pValue) ==
    if mWorld.cosim
    then cases (pName) :
           "LEFT_ACC" -> ChessWay`acc_out.SetValue(pValue),
           "RIGHT_VEL" -> ChessWay`vel_out.SetValue(pValue),
           others -> skip
         end;

  -- auxiliary operation to retrieve sensor data
  public getValue: seq of char ==> real
  getValue (pName) ==
    duration (0) 
      if pName not in set dom mValues
      then ( -- release warning
             IO`print("warning: "^pName^
               " read before initialised\n");
             -- return defined value
             return 0.0 )
      else ( -- obtain the current value
             dcl retval : real := getCosimValue(pName);
             -- print optional diagnostics
             if debug > 1 
             then ( IO`print(pName ^ " was ");
                    IO`print(retval);
                    IO`print(" at ");
                    IO`print(time/1E9);
                    IO`print("\n") );
             -- return the value
             return retval )
  -- protect against illegal late bound names
  pre pName in set reserved;

  private getCosimValue: seq of char ==> real
  getCosimValue (pName) ==
    cases (pName) :
      "LEFT_ACC"  -> return ChessWay`acc_in.GetValue(),
      "RIGHT_VEL" -> return ChessWay`vel_in.GetValue(),
      others      -> return mValues(pName)
    end
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
sync
  -- environment access must be atomic 
  mutex (setValue);
  mutex (getValue);
  mutex (setValue,getValue)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
operations
  private mainLoop: () ==> ()
  mainLoop () ==
    ( -- determine the current time
      dcl ticks : nat := time,
          clock : real := ticks / World`SIM_RESOLUTION;

      -- update the open-loop sensor values and user behavior
      evalSensors(clock);

      -- update the wheel models
      mLeftWheel.evaluate();
      mRightWheel.evaluate();

      -- update the Hall sensor models
      mLeftHall.evaluate();
      mRightHall.evaluate();

      -- update the user model
      mUser.evaluate();

      -- optional diagnostics
      if debug > 0 then printDiagnostics();

      -- check if the maximum simulation time was reached
      if (ticks >= mMaxSimTime) then terminate() );

  -- operation to signal the main thread once we're done
  private terminate: () ==> ()
  terminate () == ( printEnvironment(); mWorld.signal() ) 

thread
  -- run this thread 1000 times per second
  -- with a 250 msec offset
  periodic (1, 0, 0, 0) (mainLoop)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
operations
  -- auxiliary diagnostics operations
  private printDiagnostics: () ==> ()
  printDiagnostics () == 
    ( -- diagnostics
      IO`print("\nEnvironment.mainLoop         = ");
      IO`print(time/1E9);
      IO`print("\n") );

  public printEnvironment: () ==> ()
  printEnvironment () ==
    ( -- diagnostics
      IO`print("Dump of the environment\n");
      -- iterate over all key/value pairs
      for all pKey in set dom mValues do
        ( IO`print(pKey);
          IO`print(" = ");
          IO`print(mValues(pKey));
          IO`print("\n") ) )

end Environment
                                                                                                                                   
~~~
{% endraw %}

### Gyroscope.vdmrt

{% raw %}
~~~
                                                                                                                                                                                     
class Gyroscope

instance variables
  -- link back to the controller managing this resource
  private mController : Controller;

operations
  public Gyroscope: Controller ==> Gyroscope
  Gyroscope (pController) == mController := pController;

  public getYawRateData: () ==> real
  getYawRateData () ==
    duration (0) return mController.getValue("YAW_RATE")

end Gyroscope
            
~~~
{% endraw %}

### HallSensor.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
class HallSensor

instance variables
  -- the logical name of the wheel
  mName : seq of char;

  -- link to the environment
  mEnvironment : Environment;

  -- link to the motor
  mWheel : Wheel

functions
  private convert: real -> nat
  convert (prad) ==
    -- convert radians into degrees modulo 360
    let degrees = floor (prad * MATH`pi / 180) in degrees mod 360

operations
  public HallSensor: seq of char * Environment * Wheel
    ==> HallSensor
  HallSensor (pName, pEnvironment, pWheel) ==
    ( mName := pName;
      mEnvironment := pEnvironment;
      mWheel := pWheel );

  private setSensor: seq of char * bool ==> ()
  setSensor (pSensor, pValue) ==
    if pValue
    then mEnvironment.setValue(pSensor, 1.0)
    else mEnvironment.setValue(pSensor, 0.0);

  public setSensors: bool * bool * bool ==> ()
  setSensors (ph1, ph2, ph3) ==
    ( setSensor(mName^"_HALL1", ph1);
      setSensor(mName^"_HALL2", ph2);
      setSensor(mName^"_HALL3", ph3) );

  public evaluate: () ==> ()
  evaluate () ==
    -- retrieve and convert the current wheel position
    def position = convert(mWheel.position) in
      cases (position div 60):
        0 -> setSensors(true,  false, true),
        1 -> setSensors(true,  false, false),
        2 -> setSensors(true,  true,  false),
        3 -> setSensors(false, true,  false),
        4 -> setSensors(false, true,  true),
        5 -> setSensors(false, false, true),
        others -> error
      end

end HallSensor
                                                                                                                                                                                                                                                                                                                              
~~~
{% endraw %}

### IActuatorReal.vdmrt

{% raw %}
~~~
class IActuatorReal

operations

-- set actuator value
public SetValue: real ==> ()
SetValue(v) ==
	is subclass responsibility;

end IActuatorReal
~~~
{% endraw %}

### ISensorReal.vdmrt

{% raw %}
~~~
class ISensorReal

operations

-- set actuator value
public GetValue: () ==> real
GetValue() ==
	is subclass responsibility;

end ISensorReal
~~~
{% endraw %}

### LeftController.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                   
class LeftController
  is subclass of Controller

values
  -- values for PID controller (acceleration)
  KP1   : real = 0.009;
  KI1   : real = 8.69565217391;
  KD1   : real = 0.02875;
  BETA1 : real = 0.1

instance variables
  -- link to the controller
  public ctrl : DTControl;

  -- sensors connected to the left controller
  public mAccelerometer : Accelerometer;
  public mGyroscope : Gyroscope

operations
  -- constructor for the left motor controller
  public LeftController: () ==> LeftController
  LeftController () ==
    ( -- create the co-sim shared variables
      ChessWay`acc_in := new Sensor();
      ChessWay`acc_out := new Actuator();
      -- create the controller
      ctrl := new PID(KP1, KI1, KD1, BETA1);
	  ctrl.SetSampleTime(SAMPLETIME);
      -- create the sensors
      mAccelerometer := new Accelerometer(self);
      mGyroscope := new Gyroscope(self);
      -- call the controller base constructor
      Controller("LEFT") )

instance variables
  -- maintain a link to the other controller
  private mRight : [RightController] := nil

operations
  -- auxiliary operation to hook controller models together
  public setRightController: RightController ==> ()
  setRightController (pRight) == mRight := pRight
  pre mRight = nil
                                                                                                                                                                                                                                                                                                 
instance variables
  -- loop count variable
  private mLoopCnt : nat := 0;

  -- time at control loop entry
  private mTimeEntry : nat := 0;

  -- enable debug logging
  private mDebug : nat := 0
   
                                                                                                                                                                                                                                                      
operations
  public CtrlLoopEntry: () ==> ()
  CtrlLoopEntry () ==
    ( -- increase the loop counter
      mLoopCnt := mLoopCnt + 1;
      -- capture the current time
      mTimeEntry := time;
      -- diagnostics
      if mDebug >= DEBUGCTRLLOOP then
        IO`printf("LeftController.mainLoop  (S) = %s (%s)\n",
          [mTimeEntry / 1E9, mLoopCnt]) );

  public CtrlLoopBody: () ==> ()
  CtrlLoopBody () ==
    duration (0)
      ( dcl --hall : bool * bool * bool :=
            --  mMotorSensor.getHallSensorData(),
            --acc : real * real * real :=
            --  mAccelerometer.getAccelerationData(),
            ---gyro : real :=
            --  mGyroscope.getYawRateData(),
            user : real := mEnvironment.getValue("USER");
        IO`printf("user = %s\n", [user]);
        -- execute the control loop
--        mMotorActuator.SetValue(ctrl.Output(mMotorSensor.GetValue()-user));
        ChessWay`acc_out.SetValue(ctrl.Output(ChessWay`acc_in.GetValue()-user));
--        -- execute the controller
--        let pwm = computeResponse(hall, acc, gyro) in
--          mMotorActuator.setPWM(pwm);
--        -- local diagnostics 
--        duration (0)
--          if ChessWay`debug then
--            ( -- IO`print("L-HALL  = ");
--              -- IO`print(hall);  IO`print("\n");
--              -- IO`print("L-ACC   = ");
--              -- IO`print(acc);  IO`print("\n");
--              -- IO`print("L-YRATE = ");
--              -- IO`print(gyro);  IO`print("\n");
        skip );

  public CtrlLoopExit: () ==> ()
  CtrlLoopExit () ==
    ( dcl mTimeExit : nat := time;
      -- diagnostics
      if mDebug >= DEBUGCTRLLOOP then
        IO`printf("LeftController.mainLoop  (F) = %s (%s)\n",
          [mTimeExit / 1E9, mLoopCnt]);
      if mDebug > DEBUGCTRLLOOP then
        IO`printf("LeftController execution time was %s\n",
          [(mTimeExit - mTimeEntry) / 1E9]) )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
operations
  public PowerUp: () ==> ()
  PowerUp () ==
    duration (100)
      ( mMotorActuator.initActuator();
        mMotorActuator.printDiagnostics() )
  pre mRight <> nil

operations
  -- prototype used for simulation diagnostics
  public printDiagnostics: () ==> ()
  printDiagnostics () ==
    duration (0)
      Controller`printDiagnostics(mLoopCnt)
                                                                                                                                                                                                                                                                                                                                                                                                                                                     
operations
  public computeResponse: (bool * bool * bool) *
    (real * real * real) * real ==> real
  computeResponse (-, -, -) == return -0.1; 

end LeftController
            
~~~
{% endraw %}

### MotorActuator.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
class MotorActuator
  is subclass of IActuatorReal

types
  -- motor is either free running or actuated
  private tDriveStatus = <ACTUATED> | <FREERUNNING>

instance variables
  -- motor is initially free running
  private mDriveStatus : tDriveStatus := <FREERUNNING>;

  -- link back to the controller managing this resource
  private mController : Controller;

operations
  public MotorActuator: Controller ==> MotorActuator
  MotorActuator (pController) == mController := pController;

  public initActuator: () ==> ()
  initActuator () ==  
    ( -- set drive status to free running
      mDriveStatus := <FREERUNNING>;
      -- push initial motor drive status to environment
      mController.setValue("ACTUATED", 0);
      -- reset the motor PWM start-up value
      mController.setValue("PWM", 0) );

  public isActuated: () ==> bool
  isActuated () == return mDriveStatus = <ACTUATED>;

  public setFreeRunning: () ==> ()
  setFreeRunning () ==
    if isActuated()
    then ( -- update the motor actuation state
           mDriveStatus := <FREERUNNING>;
           -- push the drive status to the environment
           duration (0) mController.setValue("ACTUATED", 0);
           -- conditional diagnostics
           duration (0) if ChessWay`debug
                        then printDiagnostics() );

  public setActuated: () ==> ()
  setActuated () ==
    if not isActuated()
    then ( -- update the motor actuation state
           mDriveStatus := <ACTUATED>;
           -- push the drive state to the environment
           duration (0) mController.setValue("ACTUATED", 1);
           -- conditional diagnostics
           duration (0) if ChessWay`debug
                        then printDiagnostics() );

  public SetValue: real ==> ()
  SetValue(v) ==
    if mController.mName = "LEFT"
    then mController.setValue("ACC", v)
    else mController.setValue("VEL", v);

  public setPWM: real ==> ()
  setPWM (pPWM) ==
    if isActuated()
    -- store the PWM value (push to environment)
    then duration (0) mController.setValue("PWM", pPWM)
    else skip
  pre pPWM >= -1.0 and pPWM <= 1.0;

  public printDiagnostics: () ==> ()
  printDiagnostics () ==
    ( IO`print(mController.mName ^ " motor is ");
      IO`print(mDriveStatus);
      IO`print(" at ");
      IO`print(time/1E9);
      IO`print("\n") );

end MotorActuator
            
~~~
{% endraw %}

### MotorSensor.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                            
class MotorSensor
  is subclass of ISensorReal

instance variables

  -- link back to the controller managing this resource
  private mController : Controller;

operations
  public MotorSensor: Controller ==> MotorSensor
  MotorSensor (pController) == mController := pController;

  public GetValue: () ==> real
  GetValue() == 
    if mController.mName = "LEFT"
    then mController.getValue("ACC")
    else mController.getValue("VEL");

  public getHallSensorData: () ==> bool * bool * bool
  getHallSensorData () == 
    duration (0)
      ( -- retrieve the values from the environment
        dcl h1 : real := mController.getValue("HALL1"), 
            h2 : real := mController.getValue("HALL2"),
            h3 : real := mController.getValue("HALL3");
        -- map to Boolean values
        return mk_ (h1 > 0, h2 > 0, h3 > 0) )

end MotorSensor
            
~~~
{% endraw %}

### OnOffSwitch.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                            
class OnOffSwitch

instance variables
  -- link back to the controller managing this resource
  private mController : Controller;

operations
  public OnOffSwitch: Controller ==> OnOffSwitch
  OnOffSwitch (pController) == mController := pController;

  public getStatus: () ==> bool
  getStatus () == 
    duration (0)
      return mController.getValue("ONOFF") > 0;

end OnOffSwitch
            
~~~
{% endraw %}

### P.vdmrt

{% raw %}
~~~
class P is subclass of DTControl

instance variables

-- design parameters
protected k: real;

operations

-- constructor for PD
public P: real ==> P
P(k_) ==
(
    k := k_;
);
    
-- default constructor for PD
public P: () ==> P
P() ==
    P(DEF_K);

-- calculates output, based on the error
public Output: real ==> real
Output(err) == 
(
	return k * err
);

values

-- defaults
DEF_K: real = 0.2;

end P
~~~
{% endraw %}

### PD.vdmrt

{% raw %}
~~~
class PD is subclass of DTControl

instance variables

-- design parameters
protected k: real;
protected tauD: real;
protected beta: real;

-- variables
protected uD: real;
protected prev_err: real

operations

-- constructor for PD
public PD: real * real * real ==> PD
PD(k_, tauD_, beta_) ==
(
    k := k_;
	tauD := tauD_;
	beta := beta_;
	-- initial values
    uD := 0.0;
	prev_err := 0.0	
);

-- constructor for PD
public PD: real * real ==> PD
PD(k_, tauD_) ==
	PD(k_, tauD_, DEF_BETA);
    
-- default constructor for PD
public PD: () ==> PD
PD() ==
    PD(DEF_K, DEF_TAUD, DEF_BETA);

-- calculates output, based on the error
public Output: real ==> real
Output(err) == 
(
	dcl factor: real :=  1 / (sampletime + tauD * beta);
	uD := factor * (tauD * uD * beta + tauD * k * (err - prev_err) + sampletime * k * err);
	prev_err := err;
	return uD
);

values

-- defaults
DEF_K: real = 0.2;
DEF_TAUD: real = 1.0;
DEF_BETA: real = 0.1;

end PD
~~~
{% endraw %}

### PI.vdmrt

{% raw %}
~~~
class PI is subclass of DTControl

instance variables

-- design parameters
protected k: real;
protected tauI: real;

-- variables
protected uP: real;
protected uI: real;

operations

-- constructor for PI
public PI: real * real ==> PI
PI(k_, tauI_) ==
(
    k := k_;
	tauI := tauI_;
	-- initial values
	uP := 0;
    uI := 0
);

-- default constructor for PI
public PI: () ==> PI
PI() ==
    PI(DEF_K, DEF_TAUI);

-- calculates output, based on the error
public Output: real ==> real
Output(err) == 
(
	dcl bi: real := k * sampletime / tauI;
	uP := k * err;
	uI := uI + bi* err;
	return uP + uI;
);

values

-- defaults
DEF_K: real = 1;
DEF_TAUI: real = 0.5;

end PI
~~~
{% endraw %}

### PID.vdmrt

{% raw %}
~~~
class PID is subclass of DTControl

instance variables

-- design parameters
protected k: real;
protected tauI: real;
protected tauD: real; 
protected beta: real;

-- variables
protected uP: real;
protected uD: real;
protected uI: real;
protected prev_err: real

operations

-- constructor for PID
public PID: real * real * real * real ==> PID
PID(k_, tauI_, tauD_, beta_) ==
(
	k := k_;
	tauI := tauI_;
    tauD := tauD_;
    beta := beta_;
	-- initial values
	uP := 0;
    uD := 0;
    uI := 0;
	prev_err := 0
)
pre tauI_ <> 0 and tauD_ <> 0 and
    beta_ > 0 and beta_ <= 1;

-- constructor for PID
public PID: real * real * real ==> PID
PID(k_, tauI_, tauD_) ==
	PID(k_, tauI_, tauD_, DEF_BETA)
pre tauI_ <> 0 and tauD_ <> 0;

-- default constructor for PID
public PID: () ==> PID
PID() ==
	PID(DEF_K, DEF_TAUI, DEF_TAUD, DEF_BETA);

-- calculates output, based on the error
public Output: real ==> real
Output(err) == 
(
	dcl factor: real :=  1 / (sampletime + tauD * beta);
	uD := factor * (tauD *  uD  * beta + tauD * k * (err - prev_err) + sampletime * k * err);
	uI := uI + sampletime * tauD / tauI;
	prev_err := err;
	return uI + uD
);

values

-- defaults
DEF_K: real = 0.2;
DEF_TAUI: real = 0.5;
DEF_TAUD: real = 1.0;
DEF_BETA: real = 0.1;

end PID
~~~
{% endraw %}

### RightController.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                               
class RightController
  is subclass of Controller

values
  -- values for P controller (velocity)
  KP2   : real = 20;
  KI2   : real = 78.431372549;
  KD2   : real = 0.0031875;
  BETA2 : real = 0.1

instance variables
   -- controller
  public ctrl : DTControl;

  -- sensors connected to the right controller
  public mSafetySwitch    : SafetySwitch;
  public mOnOffSwitch     : OnOffSwitch;
  public mDirectionSwitch : DirectionSwitch;

operations
  -- constructor for the left motor controller
  public RightController: () ==> RightController
  RightController () == 
    ( -- create the co-sim shared variables
      ChessWay`vel_in := new Sensor();
      ChessWay`vel_out := new Actuator();
      -- create the controller
      ctrl := new P(KP2);
	  ctrl.SetSampleTime(SAMPLETIME);
      -- create the sensors
      mSafetySwitch := new SafetySwitch(self);
      mOnOffSwitch := new OnOffSwitch(self);
      mDirectionSwitch := new DirectionSwitch(self);
      -- call the controller base constructor
      Controller ("RIGHT") );

instance variables
  -- maintain a link to the other controller
  private mLeft : [LeftController] := nil

operations
  -- auxiliary operation to hook controller models together
  public setLeftController: LeftController ==> ()
  setLeftController (pLeft) == mLeft := pLeft
  pre mLeft = nil
                                                                                                                                                                                                                                                                                                 
instance variables
  -- loop count variable
  private mLoopCnt : nat := 0;

  -- time at control loop entry
  private mTimeEntry : nat := 0;

  -- enable debug logging
  private mDebug : nat := 0
   
                                                                                                                                                                                                                                                                   
operations
  public CtrlLoopEntry: () ==> ()
  CtrlLoopEntry () ==
    duration (0)
      ( -- first increase the loop counter
        mLoopCnt := mLoopCnt + 1;
        -- capture the current time
        mTimeEntry := time;
        -- diagnostics
        if mDebug >= DEBUGCTRLLOOP then
          IO`printf("RightController.mainLoop (S) = %s (%s)\n",
            [mTimeEntry / 1E9, mLoopCnt]) );

  public CtrlLoopBody: () ==> ()
  CtrlLoopBody () ==
    duration (0)
      ( --dcl hall  : bool * bool * bool :=
        --      mMotorSensor.getHallSensorData(),
        --    safe  : bool := mSafetySwitch.getStatus(),
        --    onoff : bool := mOnOffSwitch.getStatus(),
        --    dir : DirectionSwitch`tDirectionStatus :=
        --      mDirectionSwitch.getStatus();
        -- execute the control loop
--        mMotorActuator.SetValue(ctrl.Output(mMotorSensor.GetValue())); 
        ChessWay`vel_out.SetValue(ctrl.Output(ChessWay`vel_in.GetValue())); 
--        -- execute the controller
--        let pwm = computeResponse(hall, safe, onoff, dir) in
--          mMotorActuator.setPWM(pwm);
--        -- local diagnostics
--        duration (0)
--          if ChessWay`debug then
--            ( -- IO`print("R-HAL   = ");
--              -- IO`print(hall); IO`print("\n");
--              -- IO`print("R-SAFE  = ");
--              -- IO`print(safe); IO`print("\n");
--              -- IO`print("R-ONOFF = ");
--              -- IO`print(onoff); IO`print("\n");
--              -- IO`print("R-DIR   = ");
--              -- IO`print(dir); IO`print("\n");
        skip );

  public CtrlLoopExit: () ==> ()
  CtrlLoopExit () ==
    duration (0)
      ( dcl mTimeExit : nat := time;
        -- diagnostics
        if mDebug >= DEBUGCTRLLOOP then
          IO`printf("RightController.mainLoop (F) = %s (%s)\n",
            [mTimeExit / 1E9, mLoopCnt]);
        if mDebug > DEBUGCTRLLOOP then
          IO`printf("RightController execution time was %s\n",
            [(mTimeExit - mTimeEntry) / 1E9]) )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
operations
  public PowerUp: () ==> ()
  PowerUp () ==
    duration (100)
      ( mMotorActuator.initActuator();
        mMotorActuator.printDiagnostics() )
  pre mLeft <> nil
 
operations
  -- prototype used for simulation diagnostics
  public printDiagnostics: () ==> ()
  printDiagnostics () ==
    duration (0)
      Controller`printDiagnostics(mLoopCnt)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
operations
  public computeResponse: (bool * bool * bool) * bool *
    bool * DirectionSwitch`tDirectionStatus ==> real
  computeResponse (-, -, onoff, -) == 
    ( if onoff
      then ( mMotorActuator.setActuated();
             mLeft.mMotorActuator.setActuated() )
      else ( mMotorActuator.setFreeRunning();
             mLeft.mMotorActuator.setFreeRunning() );
      return 0.1 )

end RightController
            
~~~
{% endraw %}

### SafetySwitch.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                          
class SafetySwitch

instance variables
  -- link back to the controller managing this resource
  private mController : Controller;

operations
  public SafetySwitch: Controller ==> SafetySwitch
  SafetySwitch (pController) == mController := pController;

  public getStatus: () ==> bool
  getStatus () == 
    duration (0)
      return mController.getValue("SAFETY") > 0;

end SafetySwitch
            
~~~
{% endraw %}

### Sensor.vdmrt

{% raw %}
~~~
class Sensor is subclass of ISensorReal

instance variables

-- sensor value
value: real;

operations

-- constructor for Sensor
public Sensor: real ==> Sensor
Sensor(v) ==
	value := v;

-- default constructor for Sensor
public Sensor: () ==> Sensor
Sensor() ==
	Sensor(0.0);

-- get sensor value
public GetValue: () ==> real
GetValue() ==
  ( IO`printf("GetValue = %s\n", [value]);
	return value );

end Sensor
~~~
{% endraw %}

### SetpointProfileCSV.vdmrt

{% raw %}
~~~
class SetpointProfileCSV

instance variables

-- file to read and the number of lines it contains
filename: seq of char;
lines: int;
line: int;

-- current and next setpoint
setpoint: real;
next_setpoint: [(real * real)]

operations

-- constructor for SetpointProfileCSV
public SetpointProfileCSV: real * seq of char ==> SetpointProfileCSV
SetpointProfileCSV(init, file) ==
(
	-- count lines in file
	filename := file;
	line := 1;
	let mk_(success,l) = CSV`flinecount(file) in
	(
		if not success then quit("Failed to read input file '%s': %s.", [file, new CSV().ferror()]);
		lines := l
	);	
	setpoint := init;
	next_setpoint := nil
);

-- constructor for SetpointProfileCSV
public SetpointProfileCSV: seq of char ==> SetpointProfileCSV
SetpointProfileCSV(file) ==
	SetpointProfileCSV(0.0, file);

-- read the next setpoint from the file
private ReadNextSetpoint: () ==> ()
ReadNextSetpoint() ==
(
	let mk_(-,vals) = CSV`freadval[seq of real](filename,line) in 
	(
		if len vals <> 2 then quit("Incorrect number of values in %s line %s (expected: 2, actual: %s)\n", [filename,line,len vals])
		else 
		(
			next_setpoint := mk_(vals(1),vals(2));
			line := line + 1;
		)
	)
)
pre line <= lines and next_setpoint = nil;

-- return the value of the current setpoint
public GetSetpoint: () ==> real
GetSetpoint() ==
( dcl curtime : real := time / 1.0E9;
	-- no more setpoints
	if line = lines then return setpoint;	

	-- read from file if we need to
	if next_setpoint = nil then ReadNextSetpoint();

	-- update setpoint if necessary
	let mk_(t,sp) = next_setpoint in
		if curtime >= t then 
		(
			setpoint := sp;
			next_setpoint := nil
		);

    -- show the computed setpoint
    IO`printf("setpoint (%s) = %s\n", [curtime, setpoint]);

	-- return current setpoint
	return setpoint
);

-- quit with given error (printf version)
private quit: seq of char * seq of ? ==> ()
quit(m,s) ==
(
	IO`printf(m ^ "\n",s);
	exit
);

-- quit with given error (println version)
private quit: seq of char ==> ()
quit(m) ==
(
	IO`println(m);
	exit
)

end SetpointProfileCSV
~~~
{% endraw %}

### User.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
class User

values
  gravity : real = 9.80665

instance variables
  -- link to the environment
  mEnvironment : Environment;

  -- link to both wheels
  mLeftWheel : Wheel;
  mRightWheel : Wheel;

  -- last evaluated at time step
  last : nat := 0;

  -- current deviation from upright
  angle : real := 0.0

operations
  public User: Environment * Wheel * Wheel ==> User
  User (pEnvironment, pLeftWheel, pRightWheel) ==
    ( mEnvironment := pEnvironment;
      mLeftWheel := pLeftWheel;
      mRightWheel := pRightWheel );

  public evaluate: () ==> ()
  evaluate () == 
    ( dcl user : real := mEnvironment.getValue("USER"),
          now : nat := time;
      -- compute and update the yaw rate
      def dt = (now - last) / World`SIM_RESOLUTION in
      def rate = if dt = 0 then 0 else (angle - user) / dt in
        mEnvironment.setValue("LEFT_YAW_RATE", rate);
      -- compute and update the acceleration
      def dx = MATH`cos(user) * gravity in
        mEnvironment.setValue("LEFT_ACC_X", dx);
      def dy = MATH`sin(user) * gravity in
        mEnvironment.setValue("LEFT_ACC_Y", dy);
      -- delta between the left and right wheel acceleration
      def dz = mLeftWheel.acc - mRightWheel.acc in
        mEnvironment.setValue("LEFT_ACC_Z", dz);
      -- update the angle
      angle := user;
      -- remember when we where executed
      last := now )

end User
                                                                                                                                                                                                                                                                                                                                                                                         
~~~
{% endraw %}

### Wheel.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                 
class Wheel

values
  -- maximum angular acceleration is 20 pi rad/sec^2
  MAX_ACC : real = 62.8318531

instance variables
  -- the logical name of the wheel
  mName : seq of char;

  -- link to the environment
  mEnvironment : Environment;

  -- last evaluated at time step
  last : nat := 0;

  -- current angular acceleration
  public acc : real := 0.0;

  -- current angular speed
  public speed : real := 0.0;

  -- current angular position
  public position : real := 0.0

operations
  -- constructor for the wheel class
  public Wheel: seq of char * Environment ==> Wheel
  Wheel (pname, penv) == ( mName := pname; mEnvironment := penv);

  private isActuated: () ==> bool
  isActuated () ==
    return mEnvironment.getValue(mName^"_ACTUATED") = 1;

  private getPWM: () ==> real
  getPWM () ==
    return mEnvironment.getValue(mName^"_PWM");

  public evaluate: () ==> ()
  evaluate () ==
    ( dcl pwm       : real := if isActuated()
                              then getPWM()
                              else 0.0,
          old_acc   : real := acc,
          old_speed : real := speed,
          now       : nat  := time;
      -- compute the amount of time passed
      def dt = (now - last) / World`SIM_RESOLUTION in
        ( -- update the current wheel acceleration
          acc := MAX_ACC * pwm;
          -- update the wheel angular speed (Euler)
          speed := speed + 0.5 * dt * (old_acc + acc);
          -- update the wheel angular positiom (Euler)
          position := position + 0.5 * dt * (old_speed + speed);
          -- remember when we where executed
          last := now )  )

end Wheel
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
~~~
{% endraw %}

### World.vdmrt

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
class World

values
  -- in this model use nanosecond resolution
  public SIM_RESOLUTION = 1E9;

  -- maximum simulation time is 10 seconds
  public MAX_SIM_TIME = 20 * SIM_RESOLUTION

instance variables
  -- are we running a co-simulation or not
  public static cosim : bool := false

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
operations
  -- top-level access function for ChessWay co-simulation
  public run : () ==> ()
  run () == 
    ( -- set the co-simulation indicator
      cosim := true;
      -- execute the same model
      RunScenario("steeringsignal1.csv") );

  -- top-level access function for ChessWay DE only simulation
  public RunVdmRt : () ==> ()
  RunVdmRt () == RunScenario("scenario1.txt");

  -- top-level access function to run a particular scenario
  public RunScenario: seq1 of char ==> ()
  RunScenario (fname) ==
    ( -- create an instance of the Environment model
      dcl env : Environment :=
        new Environment(self, MAX_SIM_TIME);

      -- load a simulation scenario
      if cosim
      then env.loadCsvFile("USER", fname)
      else env.loadScenario(fname);

      -- link the environment to the system controllers
      ChessWay`lctrl.setEnvironment(env);
      ChessWay`rctrl.setEnvironment(env);

      -- cross link the two system controller models
      ChessWay`lctrl.setRightController(ChessWay`rctrl);
      ChessWay`rctrl.setLeftController(ChessWay`lctrl);

      -- announce start of simulation run
      IO`print("Starting ChessWay DE simulation\n");

	  -- initialize the system tasks
      ChessWay`lctrl.PowerUp();
      ChessWay`rctrl.PowerUp();

      -- start the environment and periodic loopcontroller tasks
      startlist({env, ChessWay`lctrl, ChessWay`rctrl});

      -- wait for simulation run end (lock main DESTECS GUI thread)
      waitForSimulationEnd();

      -- announce end of simulation run
      IO`print("ChessWay DE simulation completed at ");
      IO`print(time / SIM_RESOLUTION);
      IO`print(" sec\n") )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
instance variables
  -- boolean to indicate when simulation run is complete
  public finish : bool := false

operations
  -- auxiliary operation to wait for simulation run to finish
  private waitForSimulationEnd: () ==> ()
  waitForSimulationEnd () ==
    -- print conditional diagnostics
    if ChessWay`debug
    then ( ChessWay`lctrl.printDiagnostics();
           ChessWay`rctrl.printDiagnostics() );

  public signal: () ==> () 
  signal () == 
    ( finish := true;
      IO`println("Environment requests end of simulation") );

sync
  -- the environment task has to unlock the main thread
  per waitForSimulationEnd => finish

end World
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
~~~
{% endraw %}

