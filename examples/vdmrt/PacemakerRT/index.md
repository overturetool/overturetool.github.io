---
layout: default
title: Pacemaker
---

~~~
This model is made by Hugo Macedo as a part of his MSc thesis of apacemaker according to the grand challenge provided by BostonScientific in this area. This is the last of a series of VDM modelsof the pacemaker and it incorporates a number of modes for the pacemaker. More information can be found in:
Hugo Macedo, Validating and Understanding Boston Scientific PacemakerRequirements, MSc thesis, Minho University, Portugal, October 2007.
Hugo Daniel Macedo, Peter Gorm Larsen and John Fitzgerald, Incremental Development of a Distributed Real-Time Model of a Cardiac Pacing System using VDM, In FM 2008: Formal Methods, 15th International Symposium on Formal Methods, Eds, Jorge Cuellar and Tom Maibaum and Kaisa Sere, 2008,Springer-Verlag, Lecture Notes in Computer Science 5014, pp. 181--197.
#******************************************************#  AUTOMATED TEST SETTINGS#------------------------------------------------------#AUTHOR= Hugo Macedo#LIB= IO#LANGUAGE_VERSION=classic#INV_CHECKS=true#POST_CHECKS=true#PRE_CHECKS=true#DYNAMIC_TYPE_CHECKS=true#SUPPRESS_WARNINGS=false#ENTRY_POINT=new World("tests/scenarioGoodHeart.arg",<DOO>).Run()#ENTRY_POINT=new World("tests/scenarioDoubleHeart.arg",<DOO>).Run()#ENTRY_POINT=new World("tests/scenarioBrokenHeart.arg",<DOO>).Run()#ENTRY_POINT=new World("tests/scenarioSometimesHeart.arg",<DOO>).Run()#ENTRY_POINT=new World("tests/scenarioGoodHeart.arg",<AOO>).Run()#ENTRY_POINT=new World("tests/scenarioDoubleHeart.arg",<AOO>).Run()#ENTRY_POINT=new World("tests/scenarioBrokenHeart.arg",<AOO>).Run()#ENTRY_POINT=new World("tests/scenarioSometimesHeart.arg",<AOO>).Run()#ENTRY_POINT=new World("tests/scenarioGoodHeart.arg",<AAI>).Run()#ENTRY_POINT=new World("tests/scenarioDoubleHeart.arg",<AAI>).Run()#ENTRY_POINT=new World("tests/scenarioBrokenHeart.arg",<AAI>).Run()#ENTRY_POINT=new World("tests/scenarioSometimesHeart.arg",<AAI>).Run()#ENTRY_POINT=new World("tests/scenarioGoodHeart.arg",<DDD>).Run()#ENTRY_POINT=new World("tests/scenarioDoubleHeart.arg",<DDD>).Run()#ENTRY_POINT=new World("tests/scenarioBrokenHeart.arg",<DDD>).Run()#ENTRY_POINT=new World("tests/scenarioSometimesHeart.arg",<DDD>).Run()#EXPECTED_RESULT=NO_ERROR_TYPE_CHECK#******************************************************
~~~
###Accelerometer.vdmrt

{% raw %}
~~~

class Accelerometer is subclass of GLOBAL
operations
 public  stimulate : ActivityData ==> () stimulate (a) == Pacemaker`rateController.stimulate(a);
end Accelerometer

~~~{% endraw %}

###Environment.vdmrt

{% raw %}
~~~

class Environment is subclass of GLOBAL
 types public InputTP   = (Time * seq of Inpline)inv inp == forall line in set elems inp.#2 & inp.#1 >= line.#4;
public Inpline = (Sense * Chamber * ActivityData * Time);
public Outline = (Pulse * Chamber * Time);  
 instance variables
-- Input/Output io : IO := new IO();
inplines : seq of Inpline := [];outlines : seq of Outline := [];
-- Environment  
busy : bool := true;
-- Amount of time we want to simulatesimtime : Time;
 instance variables-- Sensors
-- Leads
leads : map Chamber to Lead := {|->};
-- Accelerometeraccelerometer : Accelerometer;

 operations
-- Constructorpublic Environment : seq1 of char ==> EnvironmentEnvironment (fname) ==  def mk_(-,mk_(timeval,input)) = io.freadval[InputTP](fname)   in (inplines := input;      simtime  := timeval     );

public addLeadSensor : Lead ==> ()addLeadSensor(lsens) ==    leads := leads ++ {lsens.getChamber() |-> lsens};
public addAccelerometer : Accelerometer ==> ()addAccelerometer(acc) ==    accelerometer := acc;

private createSignal : () ==> ()createSignal () ==    (     if len inplines > 0     then (dcl curtime : Time := time,              done : bool := false;          while not done do             let mk_(sensed,chamber,accinfo,stime) = hd inplines              in if stime <= curtime                then                (                 leads(chamber).stimulate(sensed);                 accelerometer.stimulate(accinfo);                 inplines := inplines(2,...,len(inplines));                 done := len inplines = 0                )                else done := true           );     if len inplines = 0 then busy := false;    );


public handleEvent : Pulse * Chamber * Time ==> ()handleEvent(p,c,t) ==   outlines := outlines ^ [mk_(p,c,t)]; 
publicshowResult : () ==> ()showResult () ==   def - = io.writeval[seq of Outline](convert(outlines)) in skip;
functions
convert : seq of Outline -> seq of Outlineconvert (s) == [mk_(s(i).#1,s(i).#2,floor(s(i).#3 / 10)) | i in set inds s];
operationspublic isFinished: () ==> ()isFinished () == skip

thread  periodic (1000E6,10,900,0) (createSignal);


sync mutex (handleEvent,showResult);mutex (createSignal);
per isFinished => not busy and time >= simtime;

end Environment

~~~{% endraw %}

###GLOBAL.vdmrt

{% raw %}
~~~

class GLOBAL
types 

-- Sensed activitypublicSense = <NONE> | <PULSE>;
-- Heart chamber identifierpublic Chamber = <ATRIA> | <VENTRICLE>;

-- Accelerometer outputpublic ActivityData = nat1inv a == a <= 7;

-- Paced actvitypublicPulse = <PULSE> | <TRI_PULSE>;
-- Operation modepublic Mode = <OFF> | <AOO> | <AAI> | <AOOR> | <AAT> | <DOO> | <DDD>;

-- PPMpublic PPM = nat1inv ppm == ppm >= 30 and ppm <= 175;

-- Timepublic Time = nat;
end GLOBAL

~~~{% endraw %}

###HeartController.vdmrt

{% raw %}
~~~

class HeartController is subclass of GLOBAL
instance variables 
 leads     : map Chamber to Lead; sensed    : map Chamber to Sense; finished  : bool; mode      : Mode; FixedAV   : Time; lastpulse : Time; ARP       : Time; interval  : Time;

operations
 public  HeartController : () ==> HeartController HeartController() ==    (    leads     := {|->};    sensed    := {|->};    finished  := false;    mode      := <AAT>;    FixedAV   := 1500;    lastpulse := 0;    ARP       := 2500;    interval  := Pacemaker`rateController.getInterval();   );


 public  addLeadPacer : Lead ==> () addLeadPacer (lead) ==    leads := leads ++ {lead.getChamber() |-> lead};

 public  pace : ()  ==> () pace () ==    (cases mode :         <AOO>  -> PaceAOO(),         <AAT>  -> PaceAAT(),         <DOO>  -> PaceDOO(),         <OFF>  -> skip,         others -> error    end;    sensed := {|->}   );

 private PaceAOO : () ==> () PaceAOO () ==    let curTime : Time = time   in if (interval + lastpulse <= curTime)      then (            lastpulse := curTime;            leads(<ATRIA>).addLeadPace(<PULSE>,curTime)           )      else skip  ;
 private PaceAAT : () ==> () PaceAAT () ==    let curTime : Time = time   in if <ATRIA> in set dom sensed and sensed(<ATRIA>) = <PULSE>      then if curTime - lastpulse <= ARP            then skip           else (                 lastpulse := curTime;                 leads(<ATRIA>).addLeadPace(<TRI_PULSE>,curTime)                 )      elseif (interval + lastpulse <= curTime)      then (            lastpulse  := curTime;            leads(<ATRIA>).addLeadPace(<PULSE>,curTime)           )      else skip  ;
 private PaceDOO : () ==> () PaceDOO () ==    let curTime : Time = time   in (if (interval + lastpulse <= curTime)       then (            lastpulse := curTime;            leads(<ATRIA>).addLeadPace(<PULSE>,curTime);            leads(<VENTRICLE>).addLeadPace(<PULSE>,curTime + FixedAV)           )       else skip;       )  ;
 public  isFinished : () ==> () isFinished () == for all lead in set rng leads do                     lead.isFinished();
 public  sensorNotify : Sense * Chamber ==> () sensorNotify (s,c) ==    (sensed := sensed ++ {c |-> s});
 public  setInterval : Time ==> () setInterval (t) == interval := t;
 public  setMode : Mode ==> () setMode (m) ==    (mode := m);
thread periodic (200E6,0,190,0) (pace);
sync
per isFinished => sensed = {|->} and #active(pace) = 0;


mutex(sensorNotify,pace,setInterval);mutex(sensorNotify,PaceAOO,PaceDOO,PaceAAT);end HeartController

~~~{% endraw %}

###Lead.vdmrt

{% raw %}
~~~

class Lead is subclass of GLOBAL
instance variables
 private chamber : Chamber;        private scheduledPulse : [(Time * Pulse)];
operations
 public  Lead: Chamber ==> Lead Lead(chm) ==    (    chamber := chm;    scheduledPulse := nil   );

 public  getChamber: () ==> Chamber getChamber () == return chamber;

 public  stimulate : Sense ==> () stimulate (s) == Pacemaker`heartController.sensorNotify(s,chamber);

 public  isFinished : () ==> () isFinished () == skip;

 public  addLeadPace : Pulse * Time ==> () addLeadPace (p,t) ==    if t <= time   then dischargePulse(p,chamber)   else (scheduledPulse := mk_(t,p);         return);
 private  dischargePulse : Pulse * Chamber ==> () dischargePulse (p,c) ==    duration(4)    World`env.handleEvent(p,c,time);
 private  followPlan : () ==> () followPlan () ==    (     dcl curTime : Time := time;     if scheduledPulse <> nil     then if(curTime >= scheduledPulse.#1)           then (dischargePulse(scheduledPulse.#2,chamber);                scheduledPulse := nil);
   );


thread  periodic (50E6,0,49,0) (followPlan)


sync
mutex(addLeadPace);mutex(dischargePulse);mutex(followPlan);per isFinished =>  scheduledPulse = nil;
end Lead 

~~~{% endraw %}

###Pacemaker.vdmrt

{% raw %}
~~~

system Pacemaker 
 instance variables
 public static  atriaLead       : Lead       := new Lead(<ATRIA>);
 public static  ventricleLead   : Lead       := new Lead(<VENTRICLE>);

instance variables
 public static  accelerometer       : Accelerometer   := new Accelerometer();
 public static  rateController      : RateController  := new RateController();

 instance variables
 public static  heartController : HeartController := new HeartController();
instance variables
 cpu1 : CPU := new CPU(<FCFS>,1E3);  cpu2 : CPU := new CPU(<FCFS>,1E3);  cpu3 : CPU := new CPU(<FCFS>,1E3);  cpu4 : CPU := new CPU(<FP>,1E3); 
 -- Lead (artia) <-> HeartController bus1 : BUS := new BUS(<FCFS>,1E6,{cpu1,cpu4});
 -- Lead (ventricle) <-> HeartController bus2 : BUS := new BUS(<FCFS>,1E6,{cpu2,cpu4});
 -- Accelerometer <-> RateController bus3 : BUS := new BUS(<FCFS>,1E6,{cpu3,cpu4});


operations
 public Pacemaker: () ==> Pacemaker Pacemaker () ==    (     cpu1.deploy(atriaLead);    cpu2.deploy(ventricleLead);    cpu3.deploy(accelerometer);    cpu4.deploy(rateController);    cpu4.deploy(heartController); --   cpu4.setPriority(HeartController`pace,3); --   cpu4.setPriority(RateController`increaseRate,1); --   cpu4.setPriority(RateController`decreaseRate,1);   );
end Pacemaker

~~~{% endraw %}

###RateController.vdmrt

{% raw %}
~~~

class RateController is subclass of GLOBAL
instance variables rateplan : map Time to Time; sensed   : [ActivityData]; interval : Time; finished : bool;


instance variables-- programmable values LRL       : PPM; MSR       : PPM; threshold : nat1; reactionT : Time; recoveryT : Time; responseF : nat1;
inv threshold < 8    and    reactionT in set {10,...,50}    and    recoveryT in set {2,...,16}    and     responseF <= 16;
operations
 public  RateController: () ==> RateController RateController() ==   (LRL       := 60;    MSR       := 120;    threshold := MED;    reactionT := 10; -- 10 s    recoveryT := 2; -- 2 minutes;    responseF := 8;    sensed    := nil;     interval  := 1/((LRL/60)/10000);    finished  := false;
   );
publicgetInterval : () ==> TimegetInterval () == return interval;
 private controlRate : () ==> () controlRate () ==     (    (if sensed > threshold     then increaseRate()     elseif sensed < threshold     then decreaseRate()     else skip;     );    sensed := nil;    );

 public  stimulate : ActivityData ==> () stimulate (ad) == sensed := ad;
 public increaseRate : () ==> () increaseRate () ==    (    interval := 1 / ((MSR / 60) / 10000);    Pacemaker`heartController.setInterval(interval)   );

 public decreaseRate : () ==> () decreaseRate () ==    (    interval := 1 / ((LRL / 60) / 10000);    Pacemaker`heartController.setInterval(interval)   );
 public  finish : () ==> () finish () == finished := true; 
 public  isFinished : () ==> () isFinished () == skip; 

thread while true do    controlRate();

syncmutex(stimulate);
per isFinished => finished;
per controlRate => sensed <> nil;
values
--V-LOW 1--LOW 2--MED-LOW 4MED : ActivityData = 4;--MED-HIGH 4--HIGH 6--V-HIGH 6
end RateController

~~~{% endraw %}

###World.vdmrt

{% raw %}
~~~

class World is subclass of GLOBAL 
types
instance variables
public static env : [Environment] := nil;
operations
public World: seq of char * GLOBAL`Mode ==> WorldWorld(filename,mode) ==   (  -- create an environment     env := new Environment(filename);
     -- bind leads to the environment     env.addLeadSensor(Pacemaker`atriaLead);     env.addLeadSensor(Pacemaker`ventricleLead);
     -- bind accelerometer to the environment     env.addAccelerometer(Pacemaker`accelerometer);
     -- bind leads to the controler        -- bind leads to the controler     Pacemaker`heartController.addLeadPacer(Pacemaker`atriaLead);     Pacemaker`heartController.addLeadPacer(Pacemaker`ventricleLead);
     -- set up mode     Pacemaker`heartController.setMode(mode);        
     start(Pacemaker`heartController);     start(Pacemaker`rateController);     start(Pacemaker`atriaLead);     start(Pacemaker`ventricleLead);

  );

public Run: () ==> ()Run () ==   (    start(env);    env.isFinished();   Pacemaker`heartController.isFinished();   env.showResult()  );

end World

~~~{% endraw %}

