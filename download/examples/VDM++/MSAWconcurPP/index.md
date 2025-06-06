---
layout: default
title: MSAWconcurPP
---

## MSAWconcurPP
Author: Augusto Ribeiro


This VDM++ model is made by August Ribeiro as input for the VDM
courses delivered at IHA in Denmark. It is a concurrent version 
of the Minimum Safety Altitude Warning System (MSAW) example.

This project is currently not running with the Overture interpreter.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### GLOBAL.vdmpp

{% raw %}
~~~
class GLOBAL

types

public Altitude = real;

public FOId = token;
public RadarId = token;

public
Coordinates :: 
  X : real
  Y : real;

public Time = nat;

public String = seq of char;

public ObstacleType = <Natural> | <Artificial> | <Airport>  | <Military_Area>;
  
public FOWarning = ObstacleType | <EstimationWarning>;   

public RadarWarning = <Saturated>;

public MinimumSafetyAltitude = nat | <NotAllowed>;

public Position ::
  coord    : Coordinates
  altitude : Altitude; 

public History = seq of Position;

public Vector ::
  X : real
  Y : real;

functions

protected isPointInRange : Coordinates * nat1 * Coordinates -> bool
isPointInRange(center,range,point) ==
  (center.X - point.X)**2 + (center.Y - point.Y)**2 <= range**2;
  
protected vectorSum : Vector * Vector -> Vector
vectorSum(v1,v2) ==
  mk_Vector(v1.X + v2.X,v1.Y + v2.Y);
  
protected vectorDiv : Vector * int -> Vector 
vectorDiv(v,n) ==
  mk_Vector(v.X/n,v.Y/n)
pre n <> 0;

protected addVectorToPoint : Vector * Position -> Coordinates
addVectorToPoint(v,p) ==
  mk_Coordinates(p.coord.X + v.X, p.coord.Y + v.Y);

protected vectorLength : Vector -> real 
vectorLength(v) ==
  MATH`sqrt(v.X**2 + v.Y**2);

protected unitVector : Vector -> Vector
unitVector(v) ==
  let l = vectorLength(v)
  in 
    mk_Vector(v.X/l,v.Y/l); 

protected dotProduct : Vector * Vector -> real
dotProduct(v1,v2) ==
  v1.X * v2.X + v1.Y * v2.Y;
  
protected angleBetweenVectors : Vector * Vector -> real
angleBetweenVectors(v1,v2) ==
  let uv1 = unitVector(v1),
      uv2 = unitVector(v2),
      dvs = dotProduct(uv1,uv2),
      angle = MATH`acos(dvs)  
  in
    radians2degree(angle);

protected radians2degree : real -> real
radians2degree(r) ==
  r * (180/MATH`pi);

protected atan2 : real * real -> real
atan2(y,x) == 
  2 * MATH`atan(y/(MATH`sqrt(x**2+y**2)+x))
pre not (x = 0 and y = 0);

protected signedVectorAngle : Vector * Vector -> real
signedVectorAngle(v1,v2) ==
  atan2(v2.Y,v2.X) - atan2(v1.Y,v1.X);

protected vectorAngle : Vector -> real * real
vectorAngle(v) ==
   mk_( radians2degree (MATH`acos(v.X / MATH`sqrt(v.X**2 + v.Y**2))), 
        radians2degree( MATH`asin(v.Y / MATH`sqrt(v.X**2 + v.Y**2))));

protected vectorRotate : Vector * real -> Vector
vectorRotate(v,a) ==
  let x' = MATH`cos(a)*v.X - MATH`sin(a)*v.Y,
      y' = MATH`cos(a)*v.Y + MATH`sin(a)*v.X
  in
    mk_Vector(round(x'),round(y'));

protected round : real -> real
round(r) == 
  let fr  = floor(r),
      dif = abs(r - fr)
  in 
    if(dif < 10**-10)
    then fr
    else r;

operations

public test : real * real * real * real ==> Vector * Vector * real * real * Vector * real * real
test(x1,y1,x2,y2) == 
  let v1 = mk_Vector(x1,y1),
      v2 = mk_Vector(x2,y2)
  in 
    return mk_(unitVector(v1),
               unitVector(v2),
               dotProduct(unitVector(v1),unitVector(v2)),
               atan2(0.000001,0.0000000),
               vectorRotate(v2,signedVectorAngle(v1,v2)),
               radians2degree(signedVectorAngle(v1,v2)),
               angleBetweenVectors(v1,v2)
              );

end GLOBAL

~~~
{% endraw %}

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

### obstacle.vdmpp

{% raw %}
~~~
class Obstacle is subclass of GLOBAL

instance variables
 
  MSA            : MinimumSafetyAltitude ;
  location       : Coordinates;
  radius         : nat1;
  securityRadius : nat;
  type           : ObstacleType;
  
operations 
 
public Obstacle : MinimumSafetyAltitude * Coordinates * nat * nat * 
                  ObstacleType ==> Obstacle
Obstacle(msa,loc,ra,secRa,tp) ==
 (MSA := msa;
  location := loc;
  radius := ra;
  securityRadius := secRa;
  type := tp;
 ); 

public getType : () ==> ObstacleType 
getType() == 
  return type;
 
public getCoordinates : () ==> Coordinates
getCoordinates() ==
  return location;

public getSecureRange : () ==> nat1
getSecureRange() ==
  return radius + securityRadius;
  
public getMSA : () ==> MinimumSafetyAltitude
getMSA() == 
  return MSA;
 


end Obstacle 
~~~
{% endraw %}

### environment.vdmpp

{% raw %}
~~~
class Environment is subclass of GLOBAL, BaseThread

types 

InputTP   = (Time * seq of inline);

inline  = FOId * int * int * Altitude * Time;
  
FOOut = FOId * Coordinates * Altitude * FOWarning * 
        MinimumSafetyAltitude * Time;
RadarOut = Coordinates * nat1 * RadarWarning * nat *  Time;
  
  
outline = FOOut | RadarOut; 


instance variables 

  io : IO := new IO();
  inlines  : seq of inline  := [];
  outlines : seq of outline := [];

  airspace : [AirSpace] := nil;
  busy : bool := true;
  updating : bool := false;
  simtime : Time;  
operations
  
public Environment : String * nat1 * bool ==> Environment
Environment(fname, p, isP) == 
 (def mk_(-,mk_(timeval,input)) = io.freadval[InputTP](fname) 
  in
    (inlines := input;
     simtime := timeval);
 period := p;
 isPeriodic := isP;    
 );    
      
public setAirSpace : AirSpace ==> ()
setAirSpace(as) ==
  airspace := as;
      
public handleFOWarningEvent : FOId * Coordinates * Altitude * FOWarning * 
                              MinimumSafetyAltitude * Time ==> ()
handleFOWarningEvent(id,coord,alt,warn,msa,t) ==
  outlines := outlines ^ [mk_(id,coord,alt,warn,msa,t)];
 
public handleRadarWarningEvent : Coordinates * nat1 * RadarWarning * nat *  Time ==> ()
handleRadarWarningEvent(coord,range,radWarn,num,pt) ==
  outlines := outlines ^ [mk_(coord,range,radWarn,num,pt)];

public showResult : () ==> ()
showResult() ==
  def - = io.writeval[seq of outline](outlines) in skip;
 

private updateFOs : () ==> ()
updateFOs() ==
 (if len inlines > 0 
  then (dcl curtime : Time := World`timerRef.GetTime(),
        done : bool := false;
        while not done do
          def mk_(id,x,y, altitude,pt) = hd inlines
          in 
            if pt <= curtime 
            then (airspace.updateFO(id,mk_Coordinates(x,y),altitude);
                  inlines := tl inlines; 
                  updating := true;
                  done := len inlines = 0 )
            else done := true
       )
  else busy := false
 );
     

public isFinished : () ==> () 
isFinished() == skip;

public Step: () ==> ()
Step() ==
 (if World`timerRef.GetTime() < simtime
  then(updateFOs();
       if updating
       then updating := false;
      )
  else busy := false; 
 );

sync

mutex(handleFOWarningEvent);
per isFinished => not busy;

mutex(handleRadarWarningEvent);
mutex(handleRadarWarningEvent,handleFOWarningEvent);

--thread
-- (
--  while World`timerRef.GetTime() < simtime do
--   (updateFOs();
              
--    if updating
--    then (World`timerRef.WaitRelative(1);
--          updating := false);
--   );
--  busy := false; 
--  )


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
 
pure public IsInitialising: () ==> bool
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

pure public GetTime : () ==> nat
GetTime() ==
  return currentTime;

Awake: () ==> ()
Awake() == skip;

public ThreadDone : () ==> ()
ThreadDone() == 
	AddToWakeUpMap(threadid, nil);

sync
  per Awake => threadid not in set dom wakeUpMap;

--mutex(IsInitialising);
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

### atc.vdmpp

{% raw %}
~~~
class AirTrafficController is subclass of GLOBAL, BaseThread

instance variables  
  
busy      : bool            := false;
radars    : set of Radar    := {};  
obstacles : set of Obstacle := {};
history   : map FOId to (seq of Position) := {|->}; 

operations

public AirTrafficController: nat1 * bool ==> AirTrafficController
AirTrafficController(p, isP) ==
 (period := p;
 isPeriodic := isP;
 );
 
OverviewAllRadars: () ==> map FOId to FO
OverviewAllRadars() ==
  return merge {r.getDetectedMap() | r in set radars};

private getDirectionVectors : FOId ==> seq of Vector
getDirectionVectors(id) ==
  let hist = history(id),
      p1 = hist(3),
      p2 = hist(2),
      p3 = hist(1)
  in
    return [mk_Vector(p1.coord.X - p2.coord.X,
                      p1.coord.Y - p2.coord.Y),                   
            mk_Vector(p2.coord.X - p3.coord.X,
                      p2.coord.Y - p3.coord.Y)]
pre id in set dom history and len history(id) = 3;

public getAltitudeHistory : FOId ==> seq of nat
getAltitudeHistory(id) ==
  let hist = history(id),
      lastHist = hist(1,...,2)
  in 
    return [lastHist(i).altitude | i in set inds lastHist]
pre id in set dom history and len history(id) = 3;


public updateHistory : () ==> ()
updateHistory() ==
 (
   cleanUpHistory();
   for all r in set radars
   do
    (for all fo in set r.getDetected()
     do
      registerHistory(fo);
    )
 );

private registerHistory : FO ==> ()
registerHistory(fo) ==
 (let id = fo.getId()
  in 
    if id in set dom history 
    then history := history ++ {id |-> addHistory(history(id),fo.getCoordinates(),fo.getAltitude())}
    else history := history munion {id |-> addHistory([],fo.getCoordinates(),fo.getAltitude())}
 );

private cleanUpHistory : () ==> ()
cleanUpHistory() == 
 (let alldetected = dunion {r.getDetected() | r in set radars},
      allids = { fo.getId() | fo in set alldetected }
  in 
    history := allids <: history 
 );

functions
private addHistory : History * Coordinates * Altitude  -> History
addHistory(hist,coord,alt) ==
  if len hist > 0 
  then 
    let lastValue = last(hist)
    in
     if lastValue = mk_Position(coord,alt)
      then hist
      else
        if(len hist < 3)
        then hist ^ [mk_Position(coord,alt)]
        else tl hist ^ [mk_Position(coord,alt)]
  else hist ^ [mk_Position(coord,alt)];
     
private last : History -> Position
last(hist) ==
  hist(len hist)
pre len hist > 0;

operations

public addRadar : Radar ==> ()
addRadar(r) == 
 radars := {r} union radars;
 
    
public addObstacle : Obstacle ==> ()
addObstacle(ob) ==
  obstacles := {ob} union obstacles;

public findThreats : () ==> ()
findThreats() ==
  let allFOs = dunion { r.getDetected() | r in set radars }
  in 
   (for all fo in set allFOs
    do 
      for all ob in set obstacles
      do
        if not isFOSafe(ob,fo.getPosition())
        then writeObjectWarning(ob,fo)
        else 
          if len history(fo.getId()) = 3 
          then willFObeSafe(ob,fo);       
    for all r in set radars
    do 
      if r.saturatedRadar()
      then writeRadarWarning(r)
   );

public UpdatesPresent:() ==> ()
UpdatesPresent() ==
  busy := true;

operations

public detectedByTwoRadars : set of Radar ==> set of FO
detectedByTwoRadars(radars) == 
  return dunion {a.getDetected() inter b.getDetected() 
         | a,b in set radars & a <> b};
    
public detectedByAllRadars : set of Radar ==> set of FO
detectedByAllRadars(radars) ==
  return dinter {r.getDetected() | r in set radars};    

isFOSafe : Obstacle * Position ==> bool
isFOSafe(obs,pos) ==
  let obsloc      = obs.getCoordinates(),
      secureRange = obs.getSecureRange(),
      foloc       = pos.coord
  in
    return isPointInRange(obsloc,secureRange,foloc) => 
           isFOatSafeAltitude(obs.getMSA(),pos);
    
       
isFOatSafeAltitude : MinimumSafetyAltitude * Position ==> bool
isFOatSafeAltitude(msa,pos) == 
  return msa <> <NotAllowed> and msa < pos.altitude;
 
willFObeSafe : Obstacle * FO ==> ()
willFObeSafe(obs,fo) ==
  let pred = isPredictPossible(fo)
  in 
    for all p in set pred
    do
      if not isFOSafe(obs,p)
      then 
        let id   = fo.getId(),
            cs   = fo.getCoordinates(),
            alt  = fo.getAltitude(),
            type = <EstimationWarning>,
            msa  = obs.getMSA(),
            t    = World`timerRef.GetTime()
        in 
         (World`env.handleFOWarningEvent(id, cs, alt, type, msa, t);
          return
         )
pre fo.getId() in set dom history and  len history(fo.getId()) = 3;  
  
   
private writeObjectWarning : Obstacle * FO ==> ()  
writeObjectWarning(obs,fo) == 
  let id   = fo.getId(),
      cs   = fo.getCoordinates(),
      alt  = fo.getAltitude(),
      type = obs.getType(),
      msa  = obs.getMSA(),
      t    = World`timerRef.GetTime()
  in
    World`env.handleFOWarningEvent(id, cs, alt, type, msa, t);

private writeRadarWarning : Radar ==> ()
writeRadarWarning(r) ==
  let coord   = r.getLocation(),
      range   = r.getRange(),
      radWarn = <Saturated>,
      num     = card r.getDetected(),
      t       = World`timerRef.GetTime()
  in
    World`env.handleRadarWarningEvent(coord,range,radWarn,num,t);
         
private isPredictPossible : FO ==> [set of Position]
isPredictPossible(fo)==
  let hist = history(fo.getId())
  in
    if len hist < 3
    then return nil
    else return predictPosition(fo)
pre fo.getId() in set dom history ;
 
     
private predictPosition : FO ==> set of Position
predictPosition(fo) ==
  let foid   = fo.getId(),
      vs     = getDirectionVectors(foid),
      estVec = vectorRotate(vs(1),signedVectorAngle(vs(2),vs(1))),
      estAlt = predictAltitude(getAltitudeHistory(foid)),
      estCoo = addVectorToPoint(estVec,history(foid)(3)),
      estPos = mk_Position(estCoo,estAlt)
      
  in
    return calculateNeighborhood(estPos)
pre fo.getId() in set dom history and len history(fo.getId()) = 3; 

functions
private calculateNeighborhood : Position -> set of Position
calculateNeighborhood(pos) ==
 {pos,
  mk_Position(addVectorToPoint(mk_Vector(2,0),pos),pos.altitude),
  mk_Position(addVectorToPoint(mk_Vector(-2,0),pos),pos.altitude),
  mk_Position(addVectorToPoint(mk_Vector(0,2),pos),pos.altitude),
  mk_Position(addVectorToPoint(mk_Vector(0,-2),pos),pos.altitude)
 };

private predictAltitude : seq of nat -> nat
predictAltitude(alts) ==
  alts(1) + (alts(1) - alts(2)) 
pre len alts = 2;  
 
 
operations  
public isFinished : () ==> ()
isFinished() ==
  for all r in set radars do
    r.isFinished(); 
 
public Step : () ==> ()
Step() == 
( for all r in set radars 
  do 
    r.Scan(MSAW`airspace);
  updateHistory();
  findThreats();
  busy := false
);   
 
--thread
--  (for all r in set radars do
--     start(r);
--   while true do
--    Step();    
--  )

sync 
per isFinished => not busy;
--per Step => busy  
mutex(Step);
 
end AirTrafficController
~~~
{% endraw %}

### world.vdmpp

{% raw %}
~~~
class World
  
instance variables  
  
public static
  env : [Environment] := nil;

public static 
  timerRef : TimeStamp := new TimeStamp(); --2    

  
   
operations

public 
  World : () ==> World
  World() ==
    ( env := new Environment("scenario.txt", 1, true);
      env.setAirSpace(MSAW`airspace);
      MSAW`atc.addObstacle(MSAW`militaryZone);
      MSAW`atc.addRadar(MSAW`radar1);
      MSAW`atc.addRadar(MSAW`radar2);
      
      timerRef.DoneInitialising();
    );
  
public Run : () ==> ()
Run() ==
 (
  --start(env);
  --start(MSAW`atc);
  env.isFinished();
  MSAW`atc.isFinished();
  
  env.showResult()
 )
 
end World
~~~
{% endraw %}

### Radar.vdmpp

{% raw %}
~~~
class Radar is subclass of GLOBAL, BaseThread

types 

instance variables
  busy     : bool := true;
  location : Coordinates;
  range    : nat1;
  detected : map FOId to FO;
  priority : seq of FO := [];
inv forall foid in set dom detected & detected(foid).getId() = foid
  
operations

public Radar : int * int * nat1 * nat1 * bool ==> Radar
Radar(x,y,r, p, isP) ==
 (location := mk_Coordinates(x,y);
  range := r;
  detected := {|->};
  period := p;
  isPeriodic := isP;
 );

public Scan : AirSpace ==> ()
Scan(as) ==
 (detected := { x.getId() |-> x | x in set as.getAirspace() & InRange(x) };
  UpdatePriorityList()
 );
    
pure private InRange : FO ==> bool
InRange(fo) ==
  let foLocation = fo.getCoordinates()
  in 
    return isPointInRange(location,range,foLocation); 
   
pure public getDetected : () ==> set of FO
getDetected() == 
  return rng detected;

pure public getDetectedMap : () ==> map FOId to FO
getDetectedMap() ==
  return detected;

pure public saturatedRadar : () ==> bool
saturatedRadar() == 
  return card dom detected > range / 4;
  
pure public getSaturatingFOs : () ==> set of FOId
getSaturatingFOs() ==
  return {priority(i).getId() | i in set inds priority & i > floor(range/4)};

pure public getLocation : () ==> Coordinates
getLocation() == 
  return location;

pure public getRange : () ==> nat1
getRange() ==
  return range;
  
private UpdatePriorityList : () ==> ()
UpdatePriorityList() == 
  let notDetect = elems priority \ rng detected,
      newlyDet  = detected :-> elems priority
  in 
    ( removeNotDetected(notDetect);
      addNewlyDetected(newlyDet);
      busy := false
    );

private removeNotDetected : set of FO ==> ()
removeNotDetected(fos) == 
  priority := [p | p in seq priority & p in set fos];    
  
private addNewlyDetected : map FOId to FO ==> ()
addNewlyDetected(newlyDetect) == 
  priority := priority ^ set2seqFO(rng newlyDetect);    

public isFinished: () ==> ()
isFinished() == skip;

public Step: () ==> ()
Step() ==
  let as = MSAW`airspace
  in
  (detected := { x.getId() |-> x | x in set as.getAirspace() & InRange(x) };
   UpdatePriorityList();
   --World`timerRef.WaitRelative(TimeStamp`stepLength);
  )

functions
set2seqFO : set of FO -> seq of FO
set2seqFO(fos) ==
  if fos = {}
  then []
  else 
    let fo in set fos
    in
      [fo] ^ set2seqFO(fos\{fo})
measure set2seqFOm;  
      
set2seqFOm : set of FO -> nat
set2seqFOm(fos) == card fos;
     
--thread

--while true do
-- (
--  let as = MSAW`airspace
--  in
--  (detected := { x.getId() |-> x | x in set as.getAirspace() & InRange(x) };
--   UpdatePriorityList();
--   World`timerRef.WaitRelative(TimeStamp`stepLength);
--  )
-- )

sync 
mutex(Step);
--mutex(InRange);
mutex(UpdatePriorityList);

per isFinished => not busy;
mutex(removeNotDetected);
mutex (addNewlyDetected);
mutex(UpdatePriorityList)
      
end Radar
~~~
{% endraw %}

### FO.vdmpp

{% raw %}
~~~
class FO is subclass of GLOBAL

instance variables 
  id    : FOId;
  coord : Coordinates;
  alt   : Altitude;  
  
 
operations

public FO : FOId * Coordinates * Altitude ==> FO
FO(idarg,coordarg,altarg) == 
 (id := idarg;
  coord := coordarg;
  alt := altarg;
 );
    
pure public getId : () ==> FOId
getId() ==
  return id;

pure public getCoordinates : () ==> Coordinates
getCoordinates() == 
  return coord;

public setCoordinates : Coordinates ==> ()
setCoordinates(coordarg) ==
  coord := coordarg;
  
pure public getAltitude : () ==> Altitude
getAltitude() ==
  return alt;
    
public setAltitude : Altitude ==> ()
setAltitude(altarg) ==
  alt := altarg;
 
pure public getPosition : () ==> Position
getPosition() == 
  return mk_Position(coord,alt);  

end FO
~~~
{% endraw %}

### AirSpace.vdmpp

{% raw %}
~~~
class AirSpace is subclass of GLOBAL

instance variables

airspace : map FOId to FO := {|->};

inv forall foid1, foid2 in set dom airspace & 
      foid1 <> foid2 => airspace(foid1).getId() <> airspace(foid2).getId()
  
operations

public addFO : FO ==> ()
addFO(fo) ==
 (airspace := airspace munion {fo.getId() |-> fo};
  MSAW`atc.UpdatesPresent())
pre fo.getId() not in set dom airspace;

public removeFO : FOId ==> ()
removeFO(id) ==
  (airspace := {id} <-: airspace;
   MSAW`atc.UpdatesPresent());
    
public getFO : FOId ==> FO
getFO(id) ==
  return airspace(id)
pre id in set dom airspace;

public getAirspace : () ==> set of FO
getAirspace() ==
  return rng airspace;

public updateFO : FOId * Coordinates * Altitude ==> ()
updateFO(id,coord,alt) ==
 (if (id in set dom airspace)
  then 
    let fo = airspace(id)
    in 
     (fo.setCoordinates(coord);
      fo.setAltitude(alt))
     -- fo.registerPosition())
  else
    (let newfo = new FO(id,coord,alt)
     in airspace := airspace munion {id |-> newfo}
    );
  MSAW`atc.UpdatesPresent())

end AirSpace
~~~
{% endraw %}

### MSAW.vdmpp

{% raw %}
~~~
class MSAW is subclass of GLOBAL

instance variables 

public static atc : AirTrafficController := new AirTrafficController(1, true);
  

public static airspace : AirSpace := new AirSpace();

public static militaryZone : Obstacle := 
  new Obstacle(<NotAllowed>,mk_Coordinates(25,0),5,5,<Military_Area>);

public static radar1 : Radar := new Radar(6,11,20, 1, true);
public static radar2 : Radar := new Radar (30,30,5, 1, true);  

end MSAW
~~~
{% endraw %}

