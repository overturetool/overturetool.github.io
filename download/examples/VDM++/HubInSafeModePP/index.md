---
layout: default
title: HubInSafeModePP
---

## HubInSafeModePP
Author: Klaus Petersen


The purpose of the hub in safe mode is to allow a service technician
to physically enter the hub of the wind turbine to carry out
maintenance. For the service technician to do so without risking his
life, it must be guaranteed that the main shaft connected to the rotor
of the wind turbine, is at a complete stand still and securely
locked. This model is made by Klaus Petersen as a small mini-project in a
course on "Modelling of Mission Critical Systems" (see
https://services.brics.dk/java/courseadmin/TOMoMi/pages/Modelling+of+Mission+Critical+Systems). 

More information about the model and the purpose of it can be found in
the Report.pdf file included in the zip file with the source files.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new Enviroment().Run()|


### Mode.vdmpp

{% raw %}
~~~
class Mode
 instance variables
 protected static mHubController : [HubController] := nil;
 protected static mEnterHubInSafeMode : bool := false;

 operations
 public static SetHubController : HubController ==> ()
 SetHubController(hubController) ==
  mHubController := hubController;

 public Run : () ==> ()
 Run() ==
  OnRun();

 public EnterHubInSafeMode : () ==> ()
 EnterHubInSafeMode() ==
  mEnterHubInSafeMode := true;

 public LeaveHubInSafeMode : () ==> ()
 LeaveHubInSafeMode() ==
  mEnterHubInSafeMode := false;

 protected ChangeMode : Mode ==> ()
 ChangeMode(newMode) ==
 (OnExit();
  newMode.OnEntry();
  mHubController.SetMode(newMode);
 )
 pre Mode`StateChangeInv(mHubController.GetMode(), newMode) and 
     let mainShaftController = mHubController.GetMainShaftController(),
         hub = mHubController.GetHub()
     in
       Mode`HubInSafeModeInv(mHubController.GetMode(), 
                             mainShaftController.GetRPM(), 
                             mainShaftController.IsLocked(), hub.IsOpen());

 protected OnEntry : () ==> ()
 OnEntry() == skip;

 protected OnRun : () ==> ()
 OnRun() == is subclass responsibility;

 protected OnExit : () ==> ()
 OnExit() == skip;

 functions
 public static StateChangeInv : Mode * Mode -> bool
 StateChangeInv(oldMode, newMode) ==
  (isofclass(ModeOperational, oldMode) and isofclass(ModeEnterHubInSafeMode, newMode)) or
  (isofclass(ModeEnterHubInSafeMode, oldMode) and isofclass(ModeHubInSafeMode, newMode)) or
  (isofclass(ModeHubInSafeMode, oldMode) and isofclass(ModeLeaveHubInSafeMode, newMode)) or
  (isofclass(ModeLeaveHubInSafeMode, oldMode) and isofclass(ModeOperational, newMode)) or
  (isofclass(ModeLeaveHubInSafeMode, oldMode) and isofclass(ModeHubInSafeMode, newMode));

 public static HubInSafeModeInv : Mode * MainShaftController`RPMType * bool * bool -> bool
 HubInSafeModeInv(mode, rpm, isLocked, isOpen) ==
  --if hub in safe mode then RPM must be 0, mainshaft must be locked, hub door must be unlocked and open
  (isofclass(ModeHubInSafeMode, mode) and rpm = 0 and isLocked and isOpen) or
   --if not in hub in safe mode hub door must be closed and locked
  (not isofclass(ModeHubInSafeMode, mode) and not isOpen);
 
end Mode
class ModeEnterHubInSafeMode is subclass of Mode
 values
 static public MAX_WINDSPEED : WindMeasurementController`WindSpeedType = 15;

 operations
 protected OnRun : () ==> ()
 OnRun() ==
  let mainShaftController = mHubController.GetMainShaftController()
  in
  (
   if not mainShaftController.IsBrakeApplied() then
   (
    mainShaftController.ApplyBrake();
    mainShaftController.Run()
   );
   
   if not mainShaftController.IsLocked() and 
      mainShaftController.GetRPM() <= MainShaftController`LOCK_LIMIT 
   then (mainShaftController.CloseLock();
         ChangeMode(new ModeHubInSafeMode())
        )
  )

end ModeEnterHubInSafeMode

class ModeHubInSafeMode is subclass of Mode

 operations
 protected OnEntry : () ==> ()
 OnEntry() ==
  mHubController.GetHub().Open();

 protected OnRun : () ==> ()
 OnRun() ==
  if not mEnterHubInSafeMode then
   ChangeMode(new ModeLeaveHubInSafeMode());

 protected OnExit : () ==> ()
 OnExit() ==
  mHubController.GetHub().Close();

end ModeHubInSafeMode

class ModeLeaveHubInSafeMode is subclass of Mode
 operations
 protected OnRun : () ==> ()
 OnRun() ==
 let hub = mHubController.GetHub()
 in
  if hub.IsEStopPressed() then
  (
   IO`print("EStop\n");
   EnterHubInSafeMode();
   ChangeMode(new ModeHubInSafeMode())
  )
  else if not hub.IsAlarmActive() then
   ChangeMode(new ModeOperational());
 
end ModeLeaveHubInSafeMode

class ModeOperational is subclass of Mode

 operations
 protected OnEntry : () ==> ()
 OnEntry() ==
  let mainShaftController = mHubController.GetMainShaftController()
  in
  (
   mainShaftController.OpenLock();
   mainShaftController.ReleaseBrake();
   mainShaftController.Run()
  );

 protected OnRun : () ==> ()
 OnRun() ==
  if mEnterHubInSafeMode and 
     WindMeasurementController`GetInstance().GetWindSpeed() <= 
     ModeEnterHubInSafeMode`MAX_WINDSPEED 
  then ChangeMode(new ModeEnterHubInSafeMode())

end ModeOperational
~~~
{% endraw %}

### Enviroment.vdmpp

{% raw %}
~~~
class Enviroment

 types
 public TestData ::
     Wind : WindMeasurementController`WindSpeedType
     Cmds : OperatingPanel`CmdType
     EStop : bool

 functions
 static CreateTestSeq : WindMeasurementController`WindSpeedType * bool -> 
                        seq of TestData
 CreateTestSeq(wind, eStop) ==
  [if x mod 10 = 1 
   then mk_TestData(wind,<E>,false)
   elseif x mod 10 = 5 
   then mk_TestData(wind,<L>,false)
   else mk_TestData(wind,<N>,x mod 10 = 6 and eStop) 
  | x in set {1,...,10}];

 operations
 public static Run : () ==> ()
 Run() ==
  let TestSeq = CreateTestSeq(14, false) ^ 
                CreateTestSeq(15, true) ^ 
                CreateTestSeq(15, false) ^ 
                CreateTestSeq(16, false),
       WindTurbine = new WindTurbine(TestSeq)
  in
   WindTurbine.Run()

end Enviroment
~~~
{% endraw %}

### Hub.vdmpp

{% raw %}
~~~
class Hub
 instance variables
 mSpeaker : Speaker;
 mIsLocked : bool := true;
 mIsEStopPressed: bool := false;

 operations
 public Hub : () ==> Hub
 Hub() ==
  mSpeaker := new Speaker();

 public Open : () ==> ()
 Open() ==
 (
  mIsLocked := false;
  mSpeaker.StopAlarm()
 )
 pre not IsOpen();

 public Close : () ==> ()
 Close() ==
 (
  mIsLocked := true;
  mSpeaker.StartAlarm()
 )
 pre IsOpen();

 public IsOpen : () ==> bool
 IsOpen() ==
  return not mIsLocked;

 public IsAlarmActive : () ==> bool
 IsAlarmActive() ==
  return mSpeaker.IsActive();

 public PressEStop : () ==> ()
 PressEStop() ==
  mIsEStopPressed := true;

 public ReleaseEStop : () ==> ()
 ReleaseEStop() ==
  mIsEStopPressed := false;
 
 public IsEStopPressed : () ==> bool
 IsEStopPressed() ==
  return mIsEStopPressed;
 
 public Run : () ==> ()
 Run() ==
  mSpeaker.Run();

end Hub
~~~
{% endraw %}

### Speaker.vdmpp

{% raw %}
~~~
class Speaker
 instance variables
 mAlarm : nat := 0;

 operations
 public StartAlarm : () ==> ()
 --Start alarm for max duration of one minute
 StartAlarm() ==
  mAlarm := 3;

 --Stop alarm. If alarm already stopped this has no effect.
 public StopAlarm : () ==> ()
 StopAlarm() ==
  mAlarm := 0;

 --return true if alarm is currently active, false otherwise.
 public IsActive : () ==> bool
 IsActive() ==
  return mAlarm <> 0;

 public Run : () ==> ()
 Run() ==
  if (mAlarm > 0) 
  then mAlarm := mAlarm - 1

end Speaker
~~~
{% endraw %}

### HubController.vdmpp

{% raw %}
~~~
class HubController
 instance variables
 mHub : Hub;
 mMainShaftController : MainShaftController;
 mMode : Mode;
 inv Mode`HubInSafeModeInv(mMode, mMainShaftController.GetRPM(), 
                           mMainShaftController.IsLocked(), mHub.IsOpen());
 mEStopSeq : seq of bool := []; 

 operations
 public HubController : seq of bool * MainShaftController ==> HubController
 HubController(eStopSeq, mainShaftController) ==
 (
  mHub := new Hub();
  mEStopSeq := eStopSeq;
  mMainShaftController := mainShaftController;
  mMode := new ModeOperational();
  Mode`SetHubController(self);
 );

 public GetHub : () ==> Hub
 GetHub() ==
  return mHub;

 public GetMainShaftController : () ==> MainShaftController
 GetMainShaftController() ==
  return mMainShaftController;

 public SetMode : Mode ==> ()
 SetMode(mode) ==
  mMode := mode
 pre Mode`StateChangeInv(mMode, mode) and 
     Mode`HubInSafeModeInv(mode, mMainShaftController.GetRPM(), 
                           mMainShaftController.IsLocked(), mHub.IsOpen());
 
 public GetMode : () ==> Mode
 GetMode() ==
  return mMode;

 public Run : () ==> ()
 Run() ==
 (if len mEStopSeq >= 1 
  then let eStop = hd mEStopSeq
       in
        (mEStopSeq := tl mEStopSeq;

         if eStop 
         then mHub.PressEStop()
         else mHub.ReleaseEStop()
        );

  mHub.Run();
  mMode.Run();
 );

end HubController
~~~
{% endraw %}

### OperatingPanel.vdmpp

{% raw %}
~~~
class OperatingPanel
 types
 --Enter Hub In Safe Mode (E) | Leave Hub In Safe Mode (L) | No Command (N)
 public CmdType = <E> | <L> | <N>;
 
 instance variables
 mCmdSeq : seq of CmdType;
 mHubController : HubController;
 mTime : nat := 0;

 operations
 public OperatingPanel : seq of CmdType * HubController ==> OperatingPanel
 OperatingPanel(cmdSeq, hubController) ==
 (
  mCmdSeq := cmdSeq;
  mHubController := hubController;
 );

 EnterHubInSafeMode : () ==> ()
 EnterHubInSafeMode() ==
  mHubController.GetMode().EnterHubInSafeMode();
   

 LeaveHubInSafeMode : () ==> ()
 LeaveHubInSafeMode() ==
  mHubController.GetMode().LeaveHubInSafeMode();

 Print : nat1 * seq of char ==> ()
 Print(time, string) ==
 (
  IO`print("T");
  IO`print(time);
  IO`print(" " ^ string ^ "\n");
 );

 public RunCmdInterface : () ==> ()
 RunCmdInterface() ==
 (
  if len mCmdSeq >= 1 then
   let cmd = hd mCmdSeq
   in
   (
    mCmdSeq := tl mCmdSeq;
    mTime := len mCmdSeq + 1;    

    if cmd = <E> then
    (
     Print(mTime, "Command <E>");
     EnterHubInSafeMode()
    )
    else if cmd = <L> then
    ( 
     Print(mTime, "Command <L>");
     LeaveHubInSafeMode()
    )
   )
 );

 public RunDisplayInterface : () ==> ()
 RunDisplayInterface() ==
 (
  --todo klaus cases
  if  isofclass(ModeEnterHubInSafeMode, mHubController.GetMode()) then
   Print(mTime, "Entering Hub In Safe Mode")
  else if isofclass(ModeHubInSafeMode, mHubController.GetMode()) then
   Print(mTime, "Hub In Safe Mode")
  else if isofclass(ModeLeaveHubInSafeMode, mHubController.GetMode()) then
   Print(mTime, "Leaving Hub In Safe Mode")
  else 
   Print(mTime, "Operational")
 ); 
end OperatingPanel
~~~
{% endraw %}

### WindMeasurementController.vdmpp

{% raw %}
~~~
class WindMeasurementController
 types
 public WindSpeedType = nat
 inv w == w <= 50

 values
 public static MAX_WIND : WindSpeedType = 50;

 instance variables
 mWindSpeedSeq : seq of WindSpeedType;
 static mInstance : [WindMeasurementController] := nil;

 operations
 WindMeasurementController : seq of WindSpeedType ==> WindMeasurementController
 WindMeasurementController(windSpeedSeq) ==
  mWindSpeedSeq := windSpeedSeq;

 public static CreateInstance : seq of WindSpeedType ==> ()
 CreateInstance(windSpeedSeq) ==
  if mInstance = nil 
  then mInstance := new WindMeasurementController(windSpeedSeq);

 public static GetInstance : () ==> WindMeasurementController
 GetInstance() ==
  return mInstance
 pre mInstance <> nil;

 public GetWindSpeed : () ==> WindSpeedType
 GetWindSpeed() ==
  return hd mWindSpeedSeq
 pre mWindSpeedSeq <> [];

 public IsFinished : () ==> bool
 IsFinished() ==
  return mWindSpeedSeq = []; 

 public Run : () ==> ()
 Run() ==
  if mWindSpeedSeq <> [] 
  then mWindSpeedSeq := tl mWindSpeedSeq;

end WindMeasurementController
~~~
{% endraw %}

### WindTurbine.vdmpp

{% raw %}
~~~
class WindTurbine
 instance variables
 mHubController : HubController;
 mMainShaftController : MainShaftController;
 mOperatingPanel : OperatingPanel;

 operations
 public WindTurbine : seq of Enviroment`TestData ==> WindTurbine
 WindTurbine(testData) ==
 (
  WindMeasurementController`CreateInstance([testData(i).Wind | i in set inds testData]);
  mMainShaftController := new MainShaftController();
  mHubController := new HubController([testData(i).EStop | i in set inds testData], 
                                      mMainShaftController);
  mOperatingPanel := new OperatingPanel( [testData(i).Cmds | i in set inds testData], 
                                         mHubController );
 );

 public Run : () ==> ()
 Run() ==
  while(not WindMeasurementController`GetInstance().IsFinished())
  do
  (
   mOperatingPanel.RunCmdInterface();
   
   mMainShaftController.Run();
   mHubController.Run();

   mOperatingPanel.RunDisplayInterface();
      
   WindMeasurementController`GetInstance().Run();
  )

end WindTurbine
~~~
{% endraw %}

### MainShaftController.vdmpp

{% raw %}
~~~
class MainShaftController
 values
 public static LOCK_LIMIT : RPMType = 1;
 public static MAX_RPM : RPMType = WindMeasurementController`MAX_WIND * 10;

 types
 public RPMType = nat
 inv rpm == rpm <= WindMeasurementController`MAX_WIND * 10;

 instance variables
 mIsLocked : bool := false;
 mBrakeSeq :seq of Brake := [];
 inv BrakeSeqInv(mBrakeSeq);
 mRPM : RPMType := 0;
 mIsBrakeApplied : bool := false;

 functions
 static BrakeSeqInv : seq of Brake -> bool
 BrakeSeqInv(brakeSeq) ==
  forall i in set inds brakeSeq & 
     i>1 => brakeSeq(i-1).GetLow() = brakeSeq(i).GetHigh();

 operations
 public MainShaftController : () ==> MainShaftController
 MainShaftController() ==
 (--Blade Pitch
  AddBrake(new Brake(100,MAX_RPM));
  --Generator
  AddBrake(new Brake(50,100));
  --Disc Brake
  AddBrake(new Brake(LOCK_LIMIT,50));
  --Lock
  AddBrake(new Brake(0, LOCK_LIMIT));
 );

 public CloseLock : () ==> ()
 CloseLock() == 
  mIsLocked := true
 pre not IsLocked() and GetRPM() = 0 and IsBrakeApplied();

 public OpenLock : () ==> ()
 OpenLock() == 
  mIsLocked := false
 pre IsLocked() and GetRPM() = 0 and IsBrakeApplied();

 public IsLocked : () ==> bool
 IsLocked() == 
  return mIsLocked;

 AddBrake : Brake ==> ()
 AddBrake(brake) ==
  mBrakeSeq := mBrakeSeq ^ [brake]
 pre BrakeSeqInv(mBrakeSeq ^ [brake]);

 RemoveBrake : Brake ==> ()
 RemoveBrake(brake) ==
  mBrakeSeq := [mBrakeSeq(i)|i in set inds mBrakeSeq & not mBrakeSeq(i).IsEqual(brake)]
 pre (exists i in set inds mBrakeSeq & mBrakeSeq(i).IsEqual(brake)) and
   BrakeSeqInv([mBrakeSeq(i)|i in set inds mBrakeSeq & not mBrakeSeq(i).IsEqual(brake)]);

 public ApplyBrake : () ==> ()
 ApplyBrake() ==
  mIsBrakeApplied := true
 pre len mBrakeSeq <> 0;

 public ReleaseBrake : () ==> ()
 ReleaseBrake() ==
  mIsBrakeApplied := false
 pre len mBrakeSeq <> 0;

 public IsBrakeApplied : () ==> bool
 IsBrakeApplied() == 
  return mIsBrakeApplied
 pre len mBrakeSeq <> 0;

 -- return current rotational speed of main shaft in RPM.
 public GetRPM : () ==> RPMType
 GetRPM() ==
  return mRPM;

 public Run : () ==> ()
 Run() ==
 (if mIsBrakeApplied 
  then for all i in set inds mBrakeSeq do
         mRPM := mBrakeSeq(i).ApplyBrake(mRPM)
  else mRPM := WindMeasurementController`GetInstance().GetWindSpeed() * 10; 
 )
 pre len mBrakeSeq <> 0
 post mRPM <= MAX_RPM;

end MainShaftController
~~~
{% endraw %}

### Brake.vdmpp

{% raw %}
~~~
class Brake
 instance variables
 mLowLimit : MainShaftController`RPMType;
 mHighLimit : MainShaftController`RPMType;
 
 operations
 public Brake : MainShaftController`RPMType * MainShaftController`RPMType ==> Brake
 Brake(low, high) ==
 (
  mLowLimit := low;
  mHighLimit := high
 )
 pre low < high;

 public GetLow : () ==> MainShaftController`RPMType
 GetLow() ==
  return mLowLimit;

 public GetHigh : () ==> MainShaftController`RPMType
 GetHigh() ==
  return mHighLimit;

 public IsEqual : Brake ==> bool
 IsEqual(brake) ==
  return GetLow() = brake.GetLow() and GetHigh() = brake.GetHigh();

 public ApplyBrake : MainShaftController`RPMType ==> 
                     MainShaftController`RPMType
 ApplyBrake(rpm) ==
  return if InRange(rpm) 
         then mLowLimit
         else rpm;

 public InterSect : Brake ==> bool
 InterSect(brake) ==
  return brake.InRange(mLowLimit) or brake.InRange(mHighLimit);
 
 public InRange : (MainShaftController`RPMType) ==> bool
 InRange(rpm) ==
  return rpm >= mLowLimit and rpm <= mHighLimit;

end Brake
~~~
{% endraw %}

