---
layout: default
title: KLV
---

~~~
This example describes a VDM++ specification of a KLV system. Thepurpose of the KLV system is to provide a continuous monitoring of thespeed of a train. The VDM++ specification is inspired by a KLVdescription provided to the EP26538 FMERail project as case study byAtelier B.  This model shows an example of how an informal descriptioncan be translated into a precise model that together with a graphicalfront-end can be used to ensure that the customer and the developerhave a common interpretation of the system under development.
The focus of the model is on the logic of the KLV systems when a trainmeets speed restriction beacons along the tracks, i.e. on events thattriggers the KLV system. Issues such as how to determine whether abeacon has been met within a certain distance calculated from speedhas been abstracted in away in the current model. They could be issuesto extend the model with.
#******************************************************#  AUTOMATED TEST SETTINGS#------------------------------------------------------#AUTHOR=Niels Kirkegaard#LANGUAGE_VERSION=classic#INV_CHECKS=true#POST_CHECKS=true#PRE_CHECKS=true#DYNAMIC_TYPE_CHECKS=true#SUPPRESS_WARNINGS=false#ENTRY_POINT= new UseKLV().Seq1()#ENTRY_POINT= #EXPECTED_RESULT=NO_ERROR_TYPE_CHECK#******************************************************
~~~
###Beacon.vdmpp

{% raw %}
~~~

class Beacon
end Beacon

~~~{% endraw %}

###CabDisplay.vdmpp

{% raw %}
~~~

class CabDisplay
instance variables
  alarm : bool := false;
  emergencybreak : bool := false;
  groundfault : bool := false;
operations
  public  setAlarm: () ==> ()  setAlarm () ==    alarm := true  pre not emergencybreak and not groundfault;
  public  unsetAlarm: () ==> ()  unsetAlarm () ==    alarm := false;
  public  setEmergencyBreak: () ==> ()  setEmergencyBreak () ==    ( alarm := false;      emergencybreak := true );
  public  unsetEmergencyBreak: () ==> ()  unsetEmergencyBreak () ==    emergencybreak := false;
  public  setGroundFault: () ==> ()  setGroundFault () ==    groundfault := true;
  public  unsetGroundFault: () ==> ()  unsetGroundFault () ==    groundfault := false;
  public  getDisplay: () ==> bool * bool * bool  getDisplay () ==    return mk_(alarm, emergencybreak, groundfault);
end CabDisplay

~~~{% endraw %}

###CheckSpeedEvent.vdmpp

{% raw %}
~~~

class CheckSpeedEvent is subclass of Event
instance variables
  speed : real;
operations 
  public  CheckSpeedEvent: real ==> CheckSpeedEvent  CheckSpeedEvent (s) ==    speed := s;
  public  execute : KLV ==> Test`TestResult  execute (klv) ==    ( klv.checkSpeed(speed);      let mk_(a,e,g) = klv.getCabDisplay().getDisplay(),          e' =  klv.getEmergencyBreak().getEmergencyBreak() in      return mk_Test`KLVstate(mk_Test`CabDisp(a,e,g),                               mk_Test`EmerBreak(e')) );
end CheckSpeedEvent

~~~{% endraw %}

###EmergencyBreak.vdmpp

{% raw %}
~~~

class EmergencyBreak
instance variables
  emergencybreak : bool := false;
operations
  public  setEmergencyBreak : () ==> ()  setEmergencyBreak () ==    emergencybreak := true;
  public  unsetEmergencyBreak : () ==> ()  unsetEmergencyBreak () ==    emergencybreak := false;
  public  getEmergencyBreak : () ==> bool  getEmergencyBreak () ==    return emergencybreak;
end EmergencyBreak

~~~{% endraw %}

###Event.vdmpp

{% raw %}
~~~

class Event
operations
  public  execute : KLV ==> Test`TestResult  execute (-) ==    is subclass responsibility;
end Event

~~~{% endraw %}

###FLTV.vdmpp

{% raw %}
~~~

class FLTV is subclass of Beacon
end FLTV

~~~{% endraw %}

###HeadMeetBeaconEvent.vdmpp

{% raw %}
~~~

class HeadMeetBeaconEvent is subclass of Event
instance variables
  beacon : Beacon;
operations
  public  HeadMeetBeaconEvent: Beacon ==> HeadMeetBeaconEvent   HeadMeetBeaconEvent(b) ==    beacon := b;
  public  execute : KLV ==> Test`TestResult  execute (klv) ==    ( klv.headMeetsBeacon(beacon);       let anns = klv.getAnnouncements(),          restr = klv.getSpeedRestrictions() in      return mk_Test`BeaconsMet(            [ mk_Test`TIVD(anns(i).getTargetSpeed())  |               i in set inds anns ],            [ mk_Test`TIVE(restr(i).getSpeedRestriction()) |              i in set inds restr ]) );
end HeadMeetBeaconEvent

~~~{% endraw %}

###KLV.vdmpp

{% raw %}
~~~

class KLV
instance variables  onboardcomp : OnBoardComp := new OnBoardComp();  cabdisplay : CabDisplay := new CabDisplay();  emergencybreak : EmergencyBreak := new EmergencyBreak();
instance variables
  announcements : seq of TIV_D := [];
  speedrestrictions : seq of TIV_E := [];  inv len speedrestrictions <= 5;
instance variables
  firstspeedrestriction : bool := true;
values  maxspeed : real = 140;
operations
publicheadMeetsBeacon : Beacon ==> ()headMeetsBeacon (beacon) ==  cases true:    (isofclass(TIV_D, beacon)) -> announceSpeedRestriction(beacon),    (isofclass(TIV_E, beacon)) -> addSpeedRestriction(beacon),    (isofclass(TIV_A, beacon)) -> deleteAnnouncements(),    (isofclass(FLTV, beacon))  -> skip  end;
publictailMeetsBeacon : Beacon ==> ()tailMeetsBeacon (beacon) ==  cases true:    (isofclass(TIV_D, beacon)) -> skip,    (isofclass(TIV_E, beacon)) -> if not firstspeedrestriction                                  then removeSpeedRestriction()                                  else firstspeedrestriction := false,    (isofclass(TIV_A, beacon)) -> skip,    (isofclass(FLTV, beacon))  -> ( firstspeedrestriction := true;                                    removeSpeedRestriction () )  end;
publicannounceSpeedRestriction : TIV_D ==> ()announceSpeedRestriction (tiv_d) ==( announcements := announcements ^ [tiv_d];  deletePossibleGroundFault () );
publicaddSpeedRestriction : TIV_E ==> ()addSpeedRestriction (tiv_e) ==  if len speedrestrictions < 5  then ( let speed = (hd announcements).getTargetSpeed() in         tiv_e.setSpeedRestriction (speed);         speedrestrictions := speedrestrictions ^ [tiv_e];         announcements := tl announcements;         deletePossibleGroundFault() )  else raiseGroundFault()pre announcements <> [];
publicdeleteAnnouncements : () ==> ()deleteAnnouncements () ==( announcements := [];  deletePossibleGroundFault() )pre announcements <> [];
publicremoveSpeedRestriction : () ==> ()removeSpeedRestriction () ==( speedrestrictions := tl speedrestrictions;  deletePossibleGroundFault() )pre speedrestrictions <> [];
publicraiseGroundFault : () ==> ()raiseGroundFault () ==  cabdisplay.setGroundFault();
publicdeletePossibleGroundFault: () ==> ()deletePossibleGroundFault () ==  let mk_(-,-,gf) = cabdisplay.getDisplay() in  if gf   then cabdisplay.unsetGroundFault();
publicnoBeaconMet : () ==> ()noBeaconMet () ==( announcements := tl announcements;  raiseGroundFault() )pre announcements <> [];
publiccheckSpeed : real ==> ()checkSpeed (speed) ==  let speedalarm = onboardcomp.checkSpeed (speed, getMaxSpeed()) in  cases speedalarm:    <SpeedOk> -> if not emergencybreak.getEmergencyBreak()                  then cabdisplay.unsetAlarm(),    <AlarmSpeed> -> if not emergencybreak.getEmergencyBreak()                    then cabdisplay.setAlarm(),    <EmergencyBreakSpeed> -> ( cabdisplay.setEmergencyBreak();                               emergencybreak.setEmergencyBreak() )  end;
publicgetMaxSpeed : () ==> realgetMaxSpeed () ==  if speedrestrictions <> []  then let speeds = { tiv_e.getSpeedRestriction()                    | tiv_e in set elems speedrestrictions } in       let minspeed in set speeds be st forall sp in set speeds &           minspeed <= sp in       return minspeed  else return maxspeed;
publicreleaseEmergencyBreak : real ==> ()releaseEmergencyBreak (sp) ==if sp = 0then ( cabdisplay.unsetEmergencyBreak ();       emergencybreak.unsetEmergencyBreak () )pre let mk_(-,eb,-) = cabdisplay.getDisplay() in eb and    emergencybreak.getEmergencyBreak();
publicgetCabDisplay : () ==> CabDisplaygetCabDisplay () ==  return cabdisplay;
publicgetEmergencyBreak : () ==> EmergencyBreakgetEmergencyBreak () ==  return emergencybreak;
publicgetAnnouncements: () ==> seq of TIV_DgetAnnouncements () ==  return announcements;
publicgetSpeedRestrictions: () ==> seq of TIV_EgetSpeedRestrictions () ==  return speedrestrictions;
end KLV

~~~{% endraw %}

###KLVStateEvent.vdmpp

{% raw %}
~~~

class KLVStateEvent is subclass of Event
operations 
  public  execute : KLV ==> Test`TestResult  execute (klv) ==    (let mk_(a,e,g) = klv.getCabDisplay().getDisplay(),         e' =  klv.getEmergencyBreak().getEmergencyBreak() in     return mk_Test`KLVstate(mk_Test`CabDisp(a,e,g),                              mk_Test`EmerBreak(e')) );
end KLVStateEvent

~~~{% endraw %}

###MaxSpeedEvent.vdmpp

{% raw %}
~~~

class MaxSpeedEvent is subclass of Event
operations 
  public  execute : KLV ==> Test`TestResult  execute (klv) ==    ( let ms = klv.getMaxSpeed() in      return mk_Test`MaxSpeed(ms) );
end MaxSpeedEvent

~~~{% endraw %}

###NoBeaconMetEvent.vdmpp

{% raw %}
~~~

class NoBeaconMetEvent is subclass of Event
operations 
  public  execute : KLV ==> Test`TestResult  execute (klv) ==    ( klv.noBeaconMet();      let mk_(a,e,g) = klv.getCabDisplay().getDisplay(),          e' =  klv.getEmergencyBreak().getEmergencyBreak() in       return mk_Test`KLVstate(mk_Test`CabDisp(a,e,g),                                mk_Test`EmerBreak(e')) );
end NoBeaconMetEvent

~~~{% endraw %}

###OnBoardComp.vdmpp

{% raw %}
~~~

class OnBoardComp
types
  public   AlarmLevel = <SpeedOk> | <AlarmSpeed> | <EmergencyBreakSpeed>;
values 
  AlarmSpeedAdd = 5;  EmergencySpeedAdd = 10;
functions
  public  checkSpeed : real * real -> AlarmLevel  checkSpeed (speed, maxspeed) ==    if speed < maxspeed + AlarmSpeedAdd    then <SpeedOk>    elseif speed < maxspeed + EmergencySpeedAdd    then <AlarmSpeed>    else <EmergencyBreakSpeed>
end OnBoardComp

~~~{% endraw %}

###TailMeetBeaconEvent.vdmpp

{% raw %}
~~~

class TailMeetBeaconEvent is subclass of Event
instance variables
  beacon : Beacon;
operations
  public  TailMeetBeaconEvent: Beacon ==> TailMeetBeaconEvent  TailMeetBeaconEvent (b) ==    beacon := b;
  public  execute : KLV ==> Test`TestResult  execute (klv) ==    ( klv.tailMeetsBeacon(beacon);       let anns = klv.getAnnouncements(),          restr = klv.getSpeedRestrictions() in        return mk_Test`BeaconsMet(            [ mk_Test`TIVD(anns(i).getTargetSpeed())  |              i in set inds anns ],            [ mk_Test`TIVE(restr(i).getSpeedRestriction()) |              i in set inds restr ]) );
end TailMeetBeaconEvent

~~~{% endraw %}

###Test.vdmpp

{% raw %}
~~~

class Test
types
  public  TestResult = KLVstate | BeaconsMet | MaxSpeed;
  public  KLVstate :: cd : CabDisp              eb : EmerBreak;
  public  CabDisp :: alarm   : bool             emerbr  : bool             grfault : bool;
  public  EmerBreak :: break : bool;
  public  BeaconsMet :: ann : seq of TIVD                res : seq of TIVE;
  public  TIVD :: ts : real;
  public  TIVE :: sp : real;
  public  MaxSpeed :: ms: real;
instance variables
  klv : KLV := new KLV();
operations
  public  runTests : seq of Event ==> seq of TestResult  runTests (events) ==    return [events(i).execute(klv) | i in set inds events ];
  public  runOneTest : Event ==> TestResult  runOneTest (event) ==    return event.execute(klv)--  pre isofclass() => ;
end Test

~~~{% endraw %}

###TIV_A.vdmpp

{% raw %}
~~~

class TIV_A is subclass of Beacon
end TIV_A

~~~{% endraw %}

###TIV_D.vdmpp

{% raw %}
~~~

class TIV_D is subclass of Beacon
instance variables  targetspeed : real;
operations
  public  TIV_D: real ==> TIV_D  TIV_D (ts) ==    targetspeed := ts;
  public  getTargetSpeed : () ==> real  getTargetSpeed () ==    return targetspeed;
end TIV_D

~~~{% endraw %}

###TIV_E.vdmpp

{% raw %}
~~~

class TIV_E is subclass of Beacon
instance variables
  speed : [real] := nil;
operations
  public  setSpeedRestriction : real ==> ()  setSpeedRestriction (s) ==    speed := s;
  public  getSpeedRestriction : () ==> real  getSpeedRestriction () ==    return speed  pre speed <> nil;
end TIV_E

~~~{% endraw %}

###useKLV.vdmpp

{% raw %}
~~~
class UseKLV
values
  ev60 : HeadMeetBeaconEvent = new HeadMeetBeaconEvent(new TIV_D(60));  ev40 : HeadMeetBeaconEvent = new HeadMeetBeaconEvent(new TIV_D(40));  ev70 : HeadMeetBeaconEvent = new HeadMeetBeaconEvent(new TIV_D(70));  eve1 : HeadMeetBeaconEvent = new HeadMeetBeaconEvent(new TIV_E());  eve2 : TailMeetBeaconEvent = new TailMeetBeaconEvent(new TIV_E());  eve3 : TailMeetBeaconEvent = new TailMeetBeaconEvent(new FLTV());  ev_s : set of Event = {ev60,ev40,ev70,eve1,eve2,eve3};
instance variables
  test : Test := new Test();  klv : KLV := new KLV()
traces
Seq1 : let ev1 in set ev_s       in        let ev2 in set ev_s \ {ev1}        in         let ev3 in set ev_s  \ {ev1,ev2}         in          let ev4 in set ev_s \ {ev1,ev2,ev3}          in            let ev5 in set ev_s \ {ev1,ev2,ev3,ev4}            in           let ev6 in set ev_s \ {ev1,ev2,ev3,ev4,ev5}           in          (test.runOneTest(ev1);           test.runOneTest(ev2);           test.runOneTest(ev3);           test.runOneTest(ev1);           test.runOneTest(ev4);           test.runOneTest(ev5);           test.runOneTest(ev6)) --[ev1,ev2,ev3,ev4,ev5,ev4,ev5,ev6])

end UseKLV
~~~{% endraw %}

