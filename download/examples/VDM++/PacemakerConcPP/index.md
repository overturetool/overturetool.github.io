---
layout: default
title: PacemakerConcPP
---

## PacemakerConcPP
Author: Hugo Macedo


This model is made by Hugo Macedo as a part of his MSc thesis of a
pacemaker according to the grand challenge provided by Boston
Scientific in this area. This is the last of a series of VDM models
of the pacemaker and it incorporates a number of modes for the 
pacemaker. More information can be found in:

Hugo Macedo, Validating and Understanding Boston Scientific Pacemaker
Requirements, MSc thesis, Minho University, Portugal, October 2007.

Hugo Daniel Macedo, Peter Gorm Larsen and John Fitzgerald, Incremental 
Development of a Distributed Real-Time Model of a Cardiac Pacing System 
using VDM, In FM 2008: Formal Methods, 15th International Symposium on 
Formal Methods, Eds, Jorge Cuellar and Tom Maibaum and Kaisa Sere, 2008,
Springer-Verlag, Lecture Notes in Computer Science 5014, pp. 181--197.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new World("tests/scenarioGoodHeart.arg",<DOO>).Run()|
|Entry point     :| new World("tests/scenarioBrokenHeart.arg",<DOO>).Run()|
|Entry point     :| new World("tests/scenarioDoubleHeart.arg",<DOO>).Run()|
|Entry point     :| new World("tests/scenarioSometimesHeart.arg",<DOO>).Run()|


### BaseThread.vdmpp

{% raw %}
~~~
class BaseThread
	
instance variables

protected period : nat1 := 1;
protected isPeriodic : bool := true;

operations

protected BaseThread : () ==> BaseThread
BaseThread() ==
 (World`timerRef.RegisterThread(self);
  if(not World`timerRef.IsInitialising())
  then start(self);  
 );

public SetPeriod : nat1 ==> ()
SetPeriod(p) ==
  period := p;

protected Step : () ==> ()
Step() ==
  is subclass responsibility

thread
 (if isPeriodic
  then (while true
        do 
         (Step();
          World`timerRef.WaitRelative(period);
         )
       )
  else (Step();
        World`timerRef.WaitRelative(0);
        World`timerRef.UnRegisterThread();
       )
 );

end BaseThread
~~~
{% endraw %}

### Pacemaker.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                        
class Pacemaker 

 instance variables

 public static 
 atriaLead     : Lead      := new Lead(<ATRIA>, 5, true);

 public static 
 ventricleLead : Lead      := new Lead(<VENTRICLE>, 5, true);
                                                                                

 instance variables

 public static 
 accelerometer       : Accelerometer   := new Accelerometer();

 public static 
 rateController      : RateController  := new RateController(1, true);
                            
 instance variables
 
 public static 
 heartController     : HeartController := new HeartController(1000, true);

end Pacemaker
             
~~~
{% endraw %}

### World.vdmpp

{% raw %}
~~~
                                                                                                                                                        
class World is subclass of GLOBAL

types

instance variables

public static env      : [Environment] := nil;
public static timerRef : TimeStamp := new TimeStamp(0); --3
                                                                                                           
operations

public World: seq of char * Mode ==> World
World(filename,mode) == 
  (  -- create an environment
     env := new Environment(filename, 1, true);

     -- bind leads to the environment
     env.addLeadSensor(Pacemaker`atriaLead);
     env.addLeadSensor(Pacemaker`ventricleLead);
   
     -- bind accelerometer to the environment
     env.addAccelerometer(Pacemaker`accelerometer);
    
     -- bind leads to the controler
     Pacemaker`heartController.addLeadPacer(Pacemaker`atriaLead);
     Pacemaker`heartController.addLeadPacer(Pacemaker`ventricleLead);

     -- set up mode
     Pacemaker`heartController.setMode(mode);
     
     --start(Pacemaker`heartController);
     --start(Pacemaker`rateController);     

     --start(Pacemaker`ventricleLead);
  );

                                                                                   
public Run: () ==> ()
Run () == 
  (
   --start(env); 
   timerRef.DoneInitialising();
   env.isFinished();
   Pacemaker`heartController.isFinished();
   env.showResult()
  );
  

end World
             
~~~
{% endraw %}

### RateController.vdmpp

{% raw %}
~~~
                                                                                                                        
class RateController is subclass of GLOBAL, BaseThread

instance variables
 rateplan : map Time to Time;
 sensed   : [ActivityData];
 interval : Time;
 finished : bool;

 
                            
instance variables
-- programmable values
 LRL       : PPM;
 MSR       : PPM;
 threshold : nat1;
 reactionT : Time;
 recoveryT : Time;
 responseF : nat1;

inv threshold < 8
    and
    reactionT in set {10,...,50}
    and
    recoveryT in set {2,...,16}
    and 
    responseF <= 16;
                                                                                                                                            
operations
  
 public 
 RateController: nat1 * bool ==> RateController
 RateController(p, isP) ==
   (LRL       := 60;
    MSR       := 120;
    threshold := MED;
    reactionT := 10; -- 10 s
    recoveryT := 2; -- 2 minutes;
    responseF := 8;
    sensed    := nil; 
    interval  := 1/((LRL/60)/1000);
    finished  := false;
    period := p;
    isPeriodic := isP;
   );
                             
public
getInterval : () ==> Time
getInterval () == return interval;
                            
 private
 controlRate : () ==> ()
 controlRate () == 
    (
    if sensed > threshold
    then increaseRate()
    elseif sensed < threshold
    then decreaseRate()
    else skip;
    sensed := nil;
    );
                            

 public 
 stimulate : ActivityData ==> ()
 stimulate (ad) == sensed := ad;
                              
 private
 increaseRate : () ==> ()
 increaseRate () == 
   (
    interval := 1 / ((MSR / 60) / 1000);
    Pacemaker`heartController.SetPeriod(interval); --setInterval(interval)
   );

                            
 private
 decreaseRate : () ==> ()
 decreaseRate () == 
   (
    interval := 1 / ((LRL / 60) / 1000);
    Pacemaker`heartController.setInterval(interval)
   );
                             
 public 
 finish : () ==> ()
 finish () == finished := true; 

 public 
 isFinished : () ==> ()
 isFinished () == skip; 

public Step: () ==> ()
Step() ==
  if (sensed <> nil)
  then controlRate();

                                                                                                       

--thread
-- while true do
--    controlRate();
                                                              

sync
mutex(stimulate);

mutex(increaseRate,decreaseRate,getInterval);

per isFinished => finished;

mutex(Step);
--per controlRate => sensed <> nil;

                             
values

--V-LOW 1
--LOW 2
--MED-LOW 4
MED : ActivityData = 4;
--MED-HIGH 4
--HIGH 6
--V-HIGH 6

end RateController
                
~~~
{% endraw %}

### Accelerometer.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                               
class Accelerometer is subclass of GLOBAL

operations

 public 
 stimulate : ActivityData ==> ()
 stimulate (a) == Pacemaker`rateController.stimulate(a);

end Accelerometer
              
~~~
{% endraw %}

### Lead.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                      
class Lead is subclass of GLOBAL, BaseThread

instance variables

 private chamber : Chamber;       
 private scheduledPulse : [(Time * Pulse)];

operations

 public 
 Lead: Chamber * nat1 * bool ==> Lead
 Lead(chm, p, isP) ==   
   (
    chamber := chm;
    scheduledPulse := nil;
    period := p;
    isPeriodic := isP;
   );
                                                                                                                     

 public 
 getChamber: () ==> Chamber
 getChamber () == return chamber;
                                                                                                                                              

 public 
 stimulate : Sense ==> ()
 stimulate (s) == Pacemaker`heartController.sensorNotify(s,chamber);

                            
 public 
 isFinished : () ==> ()
 isFinished () == skip;

                                                                                      
 public 
 addLeadPace : Pulse * Time ==> ()
 addLeadPace (p,t) ==  
   if t <= World`timerRef.GetTime()
   then dischargePulse(p)
   else (scheduledPulse := mk_(t,p);
         return);
                            
 private 
 followPlan : () ==> ()
 followPlan () ==
    (
     dcl curTime : Time := World`timerRef.GetTime();
     if scheduledPulse <> nil
     then if(curTime >= scheduledPulse.#1) 
          then (dischargePulse(scheduledPulse.#2);
                scheduledPulse := nil);
     
   );
   
      
                              
 private 
 dischargePulse : Pulse ==> ()
 dischargePulse (p) ==
    World`env.handleEvent(p,chamber,World`timerRef.GetTime());

public Step: () ==> ()
Step() ==
 (if(scheduledPulse <> nil)
  then followPlan();
  --    World`timerRef.WaitRelative(5);
 );

                                                                                                                          
--thread
--  while true do 
--    ( if(scheduledPulse <> nil)
--      then followPlan();
--      World`timerRef.WaitRelative(5);
--      World`timerRef.NotifyAll();
--      World`timerRef.Awake();
--    );
    
                                                                                      

sync

--per followPlan => scheduledPulse <> nil;
per isFinished => scheduledPulse = nil;

mutex(Step);
mutex(addLeadPace);
mutex(dischargePulse);

end Lead 
             
~~~
{% endraw %}

### GLOBAL.vdmpp

{% raw %}
~~~
                                                                                                                                                                          
class GLOBAL

types 

                                                                                                                                      
-- Sensed activity
public
Sense = <NONE> | <PULSE>;
                                                                                                                                                           
-- Heart chamber identifier
public 
Chamber = <ATRIA> | <VENTRICLE>;
                                                                                                                                                                                                                                                          

-- Accelerometer output
public 
ActivityData = nat1
inv a == a <= 7;

                                                                                                                                                                                                                                                                                
-- Paced actvity
public
Pulse = <PULSE> | <TRI_PULSE>;
                                                                                                                                  
-- Operation mode
public 
Mode = <OFF> | <AOO> | <AOOR> | <AAT> | <DOO>;

                                                                      
-- PPM
public 
PPM = nat1
inv ppm == ppm >= 30 and ppm <= 175;

                                                                                               
-- Time
public 
Time = nat;
    
end GLOBAL
                
~~~
{% endraw %}

### HeartController.vdmpp

{% raw %}
~~~
                                                                                                            
class HeartController is subclass of GLOBAL, BaseThread

instance variables 

 leads     : map Chamber to Lead;
 sensed    : map Chamber to Sense;
 mode      : Mode;
 finished  : bool;
 FixedAV   : Time;
 lastpulse : Time;
 ARP       : Time;
 interval  : Time;
                            

operations
 
 public 
 HeartController : nat1 * bool ==> HeartController
 HeartController(p, isP) == 
   (
    leads     := {|->};
    sensed    := {|->};
    mode      := <DOO>;
    finished  := false;
    FixedAV   := 150;
    lastpulse := 0;
    ARP       := 250;
    interval:= Pacemaker`rateController.getInterval();
    period := p;
    isPeriodic := isP;
   );

                            

 public 
 addLeadPacer : Lead ==> ()
 addLeadPacer (lead) == 
   leads := leads ++ {lead.getChamber() |-> lead};

                            
 public 
 pace : ()  ==> ()
 pace () == 
   (cases mode :
         <AOO>  -> PaceAOO(),
         <AAT>  -> PaceAAT(),
         <DOO>  -> PaceDOO(),
         <OFF>  -> skip,
         others -> error
    end;
    sensed := {|->}
   );

                                       
 private
 PaceAOO : () ==> ()
 PaceAOO () == 
   let curTime : Time = World`timerRef.GetTime()
   in if (interval + lastpulse <= curTime)
      then (
            lastpulse := curTime;
            leads(<ATRIA>).addLeadPace(<PULSE>,curTime)
           )
      else skip
  ;
                                       
 private
 PaceAAT : () ==> ()
 PaceAAT () == 
   let curTime : Time = World`timerRef.GetTime()
   in if <ATRIA> in set dom sensed and sensed(<ATRIA>) = <PULSE>
      then if curTime - lastpulse <= ARP 
           then skip
           else (
                 lastpulse := curTime;
                 leads(<ATRIA>).addLeadPace(<TRI_PULSE>,curTime)
                 )
      elseif (interval + lastpulse <= curTime)
      then (
            lastpulse  := curTime;
            leads(<ATRIA>).addLeadPace(<PULSE>,curTime)
           )
      else skip
  ;
                                       
 private
 PaceDOO : () ==> ()
 PaceDOO () == 
   let curTime : Time = World`timerRef.GetTime()
   in (if (interval + lastpulse <= curTime)
       then (
            lastpulse := curTime;
            leads(<ATRIA>).addLeadPace(<PULSE>,curTime);
            leads(<VENTRICLE>).addLeadPace(<PULSE>,FixedAV + curTime)
           )
       else skip;
       )
  ;
                             
 public 
 finish : () ==> ()
 finish () == finished := true;

 public 
 isFinished : () ==> ()
 isFinished () ==  for all lead in set rng leads do
                     lead.isFinished();
                            
 public 
 sensorNotify : Sense * Chamber ==> ()
 sensorNotify (s,c) == 
   (sensed := sensed ++ {c |-> s});
                            
 public 
 setInterval : Time ==> ()
 setInterval (t) == interval := t;
                                                                          
 public 
 setMode : Mode ==> ()
 setMode (m) == 
   (mode := m);
   
public Step: () ==> ()
Step() ==
  pace();
 
                                                                                                             
--thread

-- (while true do
--    (      
--      pace();
--      World`timerRef.WaitRelative(interval);
--    );
-- );
                                                                                                                                                                      
sync

per isFinished => sensed = {|->} and finished;

mutex(sensorNotify,pace);

end HeartController
             
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
wakeUpMap    : map nat to [nat] := {|->};
barrierCount : nat := 0;
registeredThreads : set of BaseThread := {};
isInitialising : bool := true;

operations

public TimeStamp : nat ==> TimeStamp
TimeStamp(count) ==
	barrierCount := count;

public RegisterThread : BaseThread ==> ()
RegisterThread(t) ==
 (barrierCount := barrierCount + 1;
  registeredThreads := registeredThreads union {t};  
 );
 
public UnRegisterThread : () ==> ()
UnRegisterThread() ==
 (barrierCount := barrierCount - 1;
  --registeredThreads := registeredThreads \ {t};
 );
 
public IsInitialising: () ==> bool
IsInitialising() ==
  return isInitialising;
 
public DoneInitialising: () ==> ()
DoneInitialising() ==
 (if isInitialising
  then (isInitialising := false;
        for all t in set registeredThreads 
        do
          start(t);
       );
 );

public WaitRelative : nat ==> ()
WaitRelative(val) ==
 (WaitAbsolute(currentTime + val);  
 );
 
public WaitAbsolute : nat ==> ()
WaitAbsolute(val) == (
  AddToWakeUpMap(threadid, val);
  -- Last to enter the barrier notifies the rest.
  BarrierReached();
  -- Wait till time is up
  Awake();
);

BarrierReached : () ==> ()
BarrierReached() == 
(
	while (card dom wakeUpMap = barrierCount) do
  	(
  		currentTime := currentTime + stepLength;
  		let threadSet : set of nat = {th | th in set dom wakeUpMap 
  										 & wakeUpMap(th) <> nil and wakeUpMap(th) <= currentTime }
		in
			for all t in set threadSet 
			do
				wakeUpMap := {t} <-: wakeUpMap;
	);
)
post forall x in set rng wakeUpMap & x = nil or x >= currentTime;

AddToWakeUpMap : nat * [nat] ==> ()
AddToWakeUpMap(tId, val) ==
   wakeUpMap := wakeUpMap ++ { tId |-> val };

public NotifyThread : nat ==> ()
NotifyThread(tId) ==
 wakeUpMap := {tId} <-: wakeUpMap;

public GetTime : () ==> nat
GetTime() ==
  return currentTime;

Awake: () ==> ()
Awake() == skip;

public ThreadDone : () ==> ()
ThreadDone() == 
	AddToWakeUpMap(threadid, nil);

sync
  per Awake => threadid not in set dom wakeUpMap;

mutex(IsInitialising);
mutex(DoneInitialising);
  -- Is this really needed?
  mutex(AddToWakeUpMap);
  mutex(NotifyThread);
  mutex(BarrierReached);
  
  mutex(AddToWakeUpMap, NotifyThread);
  mutex(AddToWakeUpMap, BarrierReached);
  mutex(NotifyThread, BarrierReached);
  
  mutex(AddToWakeUpMap, NotifyThread, BarrierReached);

end TimeStamp
~~~
{% endraw %}

### Environment.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                             
class Environment is subclass of GLOBAL, BaseThread

 types 
public InputTP   = (Time * seq of Inpline)
inv inp == forall line in set elems inp.#2 & inp.#1 >= line.#4;

public Inpline = (Sense * Chamber * ActivityData * Time);

public Outline = (Pulse * Chamber * Time);  

 instance variables

-- Input/Output 
io : IO := new IO();

inplines : seq of Inpline := [];
outlines : seq of Outline := [];

-- Environment  

busy : bool := true;

-- Amount of time we want to simulate
simtime : Time;
                                                                                                                                                         
 instance variables
-- Sensors

-- Leads

leads : map Chamber to Lead := {|->};

-- Accelerometer
accelerometer : Accelerometer;

                                                                                                                                                                                                                    
 operations

-- Constructor
public 
Environment : seq of char * nat1 * bool ==> Environment
Environment (fname, p, isP) ==
  def mk_(-,mk_(timeval,input)) = io.freadval[InputTP](fname) 
  in (inplines := input;
      simtime  := timeval;
      period := p;
      isPeriodic := isP;
     );

                                                                                        
public 
addLeadSensor : Lead ==> ()
addLeadSensor(lsens) == 
   leads := leads ++ {lsens.getChamber() |-> lsens};

public 
addAccelerometer : Accelerometer ==> ()
addAccelerometer(acc) == 
   accelerometer := acc;

                                                                                       

private 
createSignal : () ==> ()
createSignal () == 
   ( 
    if len inplines > 0 
    then (dcl curtime : Time := World`timerRef.GetTime(),
              done : bool := false;
          while not done do
             let mk_(sensed,chamber,accinfo,stime) = hd inplines 
             in if stime <= curtime
                then
                (
                 leads(chamber).stimulate(sensed);
                 accelerometer.stimulate(accinfo);
                 inplines := tl inplines;
                 done := len inplines = 0
                )
                else done := true
           );
     if len inplines = 0 then busy := false;
    );

                                                                                                                                                                            

public 
handleEvent : Pulse * Chamber * Time ==> ()
handleEvent(p,c,t) == outlines := outlines ^ [mk_(p,c,t)]; 

                                                                                         
public
showResult : () ==> ()
showResult () ==
   def - = io.writeval[seq of Outline](outlines) in skip;

                                                                                                                                                                
public 
isFinished: () ==> ()
isFinished () == skip;

public Step: () ==> ()
Step() ==
 (if busy
  then createSignal();
  
  if World`timerRef.GetTime() >= simtime
  then (Pacemaker`heartController.finish();
        Pacemaker`rateController.finish()
       );
 );
                                                                                        
--thread
--  (
--   while true do
--     ( if busy
--       then createSignal();
--       if World`timerRef.GetTime() >= simtime
--       then (Pacemaker`heartController.finish();
--             Pacemaker`rateController.finish());
--       World`timerRef.WaitRelative(1);
--     );

--  );
                                                                                                                                                                                                                                                                                                                                                         
sync 

mutex (handleEvent,showResult);

per isFinished => not busy;

end Environment

             
~~~
{% endraw %}

