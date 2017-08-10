---
layout: default
title: PacemakerSeqPP
---

## PacemakerSeqPP
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


### RateController.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                   
class RateController is subclass of GLOBAL

instance variables
 sensed   : [ActivityData];
 interval : Time;
 finished : bool; 
                                                                                                                                                                                    
instance variables
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
 RateController: () ==> RateController
 RateController() ==
   (LRL       := 60;
    MSR       := 120;
    threshold := MED;
    reactionT := 10; -- 10 s
    recoveryT := 2; -- 2 minutes;
    responseF := 8;
    sensed    := nil; 
    interval  := 1/((LRL/60)/1000);
    finished  := false;

   );
                                                                                                                                                                                                                      
public
getInterval : () ==> Time
getInterval () == return interval;
                                                                                                                                      

 public 
 Step : () ==> ()
 Step () == if sensed <> nil then controlRate();

                                                                                     
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
    Pacemaker`heartController.setInterval(interval)
   );

                                                                          
 private
 decreaseRate : () ==> ()
 decreaseRate () == 
   (
    interval := 1 / ((LRL / 60) / 1000);
    Pacemaker`heartController.setInterval(interval)
   );
                                                                                                                    
values

V_LOW : ActivityData = 1;
LOW : ActivityData = 2;
MED_LOW : ActivityData = 3;
MED : ActivityData = 4;
MED_HIGH : ActivityData = 5;
HIGH : ActivityData = 6;
V_HIGH : ActivityData = 7;

end RateController
                                                                                                  
~~~
{% endraw %}

### Pacemaker.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                        
class Pacemaker 

 instance variables

 public static 
 atriaLead     : Lead      := new Lead(<ATRIA>);

 public static 
 ventricleLead : Lead      := new Lead(<VENTRICLE>);
                                                                                

 instance variables

 public static 
 accelerometer       : Accelerometer   := new Accelerometer();

 public static 
 rateController      : RateController  := new RateController();
                                                                                     
 instance variables
 
 public static 
 heartController     : HeartController := new HeartController();

end Pacemaker
              
~~~
{% endraw %}

### Lead.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                      
class Lead is subclass of GLOBAL

instance variables

 private chamber : Chamber;       
 private scheduledPulse   : [(Time * Pulse)];
                                                                                                                                       
operations

 public 
 Lead: Chamber ==> Lead
 Lead(chm) == 
   (
    chamber := chm;
    scheduledPulse := nil;
   );
                                                                                                                            

 public 
 getChamber: () ==> Chamber
 getChamber () == return chamber;
                                                                                                                                                                                                                                          

 public 
 stimulate : Sense ==> ()
 stimulate (s) == Pacemaker`heartController.sensorNotify(s,chamber);

                                                                                                                                                            
 public
 Step: () ==> ()
 Step () == followPlan();
                                                                                        
 public 
 isFinished : () ==> bool
 isFinished () == return scheduledPulse = nil;

                                                                                                                                                                                                                                                                                                             
public
 addLeadPace : Pulse * Time ==> ()
 addLeadPace (p,t) == 
   if t <= World`timerRef.GetTime()
   then dischargePulse(p)
   else (scheduledPulse := mk_(t,p);
         return)
pre t > World`timerRef.GetTime() => scheduledPulse = nil;
                                                                                                             
 private 
 dischargePulse : Pulse ==> ()
 dischargePulse (p) ==
    World`env.handleEvent(p,chamber,World`timerRef.GetTime());
                                                                                                                                 
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
Mode = <AOO> | <AOOR> | <AAT> | <DOO> | <OFF>;

                                                                      
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

### World.vdmpp

{% raw %}
~~~
                                                                                                                                                        
class World is subclass of GLOBAL

types

instance variables

public static env      : [Environment] := nil;
public static timerRef : Timer := new Timer();
                                                                                                                                                               
operations

public World: seq of char * Mode ==> World
World(filename,mode) == 
  (  -- create an environment
     env := new Environment(filename);

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
  );
                                                                                   
public Run: () ==> ()
Run () == (env.Run(); env.showResult());
  

end World
                                                                                        
~~~
{% endraw %}

### Timer.vdmpp

{% raw %}
~~~
                                                                                                                
class Timer is subclass of GLOBAL

 instance variables
                                                                                     
currentTime : Time := 0;

                                                                       
 values

stepLength : Time = 50;

                                                                      
 operations

public 
StepTime : () ==> ()
StepTime () == currentTime := currentTime + stepLength;

                                                                        
public 
GetTime : () ==> Time
GetTime () == return currentTime;


end Timer
                                                                                        
~~~
{% endraw %}

### Environment.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                      
class Environment is subclass of GLOBAL

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
                                                                                                                                                                                                                   
instance variables
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
Environment : seq of char ==> Environment
Environment (fname) ==
  def mk_(-,mk_(timeval,input)) = io.freadval[InputTP](fname) 
  in (inplines := input;
      simtime  := timeval
     );

                                                                                        
public 
addLeadSensor : Lead ==> ()
addLeadSensor(lsens) == 
   leads := leads ++ {lsens.getChamber() |-> lsens};

public 
addAccelerometer : Accelerometer ==> ()
addAccelerometer(acc) == 
   accelerometer := acc;

                                                                                                                                                                                                 

public 
Run: () ==> ()
Run () ==
   (
    while not (isFinished() 
               and 
               Pacemaker`heartController.isFinished()
               and 
               World`timerRef.GetTime() > simtime)
    do 
      (
       createSignal();
       Pacemaker`rateController.Step();
       Pacemaker`heartController.Step();        
       World`timerRef.StepTime();
      );
    );

                                                                                                                                                                                            

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
isFinished: () ==> bool
isFinished () == return inplines = [] and not busy;

end Environment

                                                                                              
~~~
{% endraw %}

### HeartController.vdmpp

{% raw %}
~~~
                                                                                                             
class HeartController is subclass of GLOBAL

instance variables 

 leads     : map Chamber to Lead;
 sensed    : map Chamber to Sense;
 mode      : Mode;
 FixedAV   : Time;
 lastPulse : Time;
 ARP       : Time;
 interval  : Time;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
operations
 
 public 
 HeartController : () ==> HeartController
 HeartController() == 
   (
    leads     := {|->};
    sensed    := {|->};
    mode      := <OFF>;
    FixedAV   := 150;
    lastPulse := 0;
    ARP       := 250;
    interval:= Pacemaker`rateController.getInterval();
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

                                                                                               
 public 
 Step : ()  ==> ()
 Step () == 
   (pace();
    for all key in set dom leads 
    do leads(key).Step();
   );
                                                                                                                                                                    
 private
 PaceAOO : () ==> ()
 PaceAOO () == 
   let curTime : Time = World`timerRef.GetTime()
   in if (interval + lastPulse <= curTime)
      then (
            lastPulse := curTime;
            leads(<ATRIA>).addLeadPace(<PULSE>,curTime)
           )
      else skip
  pre <ATRIA> in set dom leads
  ;
                                                                              
 private
 PaceAAT : () ==> ()
 PaceAAT () == 
   let curTime : Time = World`timerRef.GetTime()
   in if <ATRIA> in set dom sensed and sensed(<ATRIA>) = <PULSE>
      then if curTime - lastPulse <= ARP 
           then skip
           else (
                 lastPulse := curTime;
                 leads(<ATRIA>).addLeadPace(<TRI_PULSE>,curTime)
                 )
      elseif (interval + lastPulse <= curTime)
      then (
            lastPulse  := curTime;
            leads(<ATRIA>).addLeadPace(<PULSE>,curTime)
           )
      else skip
  pre <ATRIA> in set dom leads
  ;
                                                                                                                                                          
 private
 PaceDOO : () ==> ()
 PaceDOO () == 
   let curTime : Time = World`timerRef.GetTime()
   in (if (interval + lastPulse <= curTime)
       then (
            lastPulse := curTime;
            leads(<ATRIA>).addLeadPace(<PULSE>,curTime);
            leads(<VENTRICLE>).addLeadPace(<PULSE>,curTime + FixedAV)
           )
       else skip;
       )
  pre {<ATRIA>,<VENTRICLE>} subset dom leads
  ;
                                                                                   
 public 
 isFinished : () ==> bool
 isFinished () == 
   return forall key in set dom leads &
                 leads(key).isFinished();
                                                                                                   
 public 
 sensorNotify : Sense * Chamber ==> ()
 sensorNotify (s,c) == 
   (sensed := sensed ++ {c |-> s});
                                                                          
 public 
 setMode : Mode ==> ()
 setMode (m) == 
   (mode := m);
                                                                                                                 
 public 
 setInterval : Time ==> ()
 setInterval (t) == interval := t;

end HeartController
                                                                                                  
~~~
{% endraw %}

