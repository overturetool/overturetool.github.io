---
layout: default
title: MSAWseqPP
---

## MSAWseqPP
Author: Augusto Ribeiro


This VDM++ model is made by August Ribeiro as input for the VDM
courses delivered at IHA in Denmark. It is a concurrent version 
of the Minimum Safety Altitude Warning System (MSAW) example.

2011-12-28 This VDM++ model has been updated by Rasmus Lauritsen 
with the addition of a swing java radar display. The Radar.vdmpp 
model is now hooked up the with Radar display. The radar display 
will make a 360 degrees scan everytime the "Scan" operation on 
the Radar is invoked.

lib/radar.jar contains binary and source code for the java radar 
display.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### UseATC.vdmpp

{% raw %}
~~~
class UseATC

values

  id : token = mk_token(1);
  fo : FO = new FO(id,mk_GLOBAL`Coordinates(1,-1),50);
  c1: GLOBAL`Coordinates = mk_GLOBAL`Coordinates(2,-2);
  c2: GLOBAL`Coordinates = mk_GLOBAL`Coordinates(3,-3);
  
instance variables

  atc: AirTrafficController := new AirTrafficController()

traces
 
TestATC: let r = new Radar(-8,-9,42)
         in
         let c in set {c1,c2}
         in
          ((atc.updateHistory() |
            atc.cleanUpHistory() |
            atc.addRadar(r) |
            atc.findThreats() |
            fo.setCoordinates(c)){2,4};
           atc.getDirectionVectors(id))

end UseATC
~~~
{% endraw %}

### GLOBAL.vdmpp

{% raw %}
~~~
class GLOBAL

types

public Altitude = real
inv a == a >= 0;

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

public test : real * real * real * real ==> Vector * Vector * 
              real * real * Vector * real * real
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

### AirSpace.vdmpp

{% raw %}
~~~
class AirSpace is subclass of GLOBAL

instance variables

--airspace : set of FO := {};
--inv forall x,y in set airspace & x <> y => x.getId() <> y.getId();

airspace : map FOId to FO := {|->};
  
operations

public addFO : FO ==> ()
addFO(fo) ==
  airspace := airspace ++ {fo.getId() |-> fo};

public removeFO : FOId ==> ()
removeFO(id) ==
  airspace := {id} <-: airspace;
    
public getFO : FOId ==> FO
getFO(id) ==
  return airspace(id)
pre id in set dom airspace;

public getAirspace : () ==> set of FO
getAirspace() ==
  return rng airspace;

public updateFO : FOId * Coordinates * Altitude ==> ()
updateFO(id,coord,alt) ==
  if (id in set dom airspace)
  then 
   (let fo = airspace(id)
    in 
     (fo.setCoordinates(coord);
      fo.setAltitude(alt);
     -- fo.registerPosition())
     )
   )
  else
    (let newfo = new FO(id,coord,alt)
     in airspace := airspace munion {id |-> newfo}
    );
    


end AirSpace
~~~
{% endraw %}

### atc.vdmpp

{% raw %}
~~~
class AirTrafficController is subclass of GLOBAL

instance variables  
  
radars    : set of Radar    := {};  
obstacles : set of Obstacle := {};
history   : map FOId to (seq of Position) := {|->}; 

operations
 
public getDirectionVectors : FOId ==> seq of Vector
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
 (let id = fo.getId(),
      coor = fo.getCoordinates(),
      alt = fo.getAltitude()
  in 
    if id in set dom history 
    then history := history ++ 
                    {id |-> addHistory(history(id),coor,alt)}
    else history := history munion 
                    {id |-> addHistory([],coor,alt)}
 );

public cleanUpHistory : () ==> ()
cleanUpHistory() == 
 (let alldetected = dunion {r.getDetected() | r in set radars},
      allids = { fo.getId() | fo in set alldetected }
  in 
    history := allids <: history 
 );

functions
private addHistory : History * Coordinates * Altitude  -> History
addHistory(hist,coord,alt) ==
  if(len hist < 3)
  then hist ^ [mk_Position(coord,alt)]
  else tl hist ^ [mk_Position(coord,alt)];

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

public detectedByTwoRadars : set of Radar ==> set of FO
detectedByTwoRadars(r) == 
  return dunion {a.getDetected() inter b.getDetected() 
                 | a,b in set r & a <> b};
    
public detectedByAllRadars : set of Radar ==> set of FO
detectedByAllRadars(r) ==
  return dinter {rad.getDetected() | rad in set r};    

public Step : () ==> ()
Step() == 
( for all r in set radars 
  do 
    r.Scan(MSAW`airspace);
  updateHistory();
  findThreats();
);  

functions 
       
isFOatSafeAltitude : MinimumSafetyAltitude * Position -> bool
isFOatSafeAltitude(msa,pos) == 
  msa <> <NotAllowed> and msa < pos.altitude;
  
operations
 
isFOSafe : Obstacle * Position ==> bool
isFOSafe(obs,pos) ==
  let obsloc      = obs.getCoordinates(),
      secureRange = obs.getSecureRange(),
      foloc       = pos.coord
  in
    if isPointInRange(obsloc,secureRange,foloc)
    then isFOatSafeAltitude(obs.getMSA(),pos)
    else return false;
 
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
 
end AirTrafficController
~~~
{% endraw %}

### MSAW.vdmpp

{% raw %}
~~~
class MSAW is subclass of GLOBAL

instance variables 

public static atc : AirTrafficController := new AirTrafficController();
  

public static radar1 : Radar := new Radar(6,11,20);
  

public static radar2 : Radar := new Radar (30,30,5);  

public static airspace : AirSpace := new AirSpace();

public static militaryZone : Obstacle := 
  new Obstacle(<NotAllowed>,mk_Coordinates(25,0),5,5,<Military_Area>);


end MSAW
~~~
{% endraw %}

### Radar.vdmpp

{% raw %}
~~~
class Radar is subclass of GLOBAL

types 
    
 
instance variables

  location : Coordinates;
  range : nat1;
  detected : map FOId to FO;
  priority : seq of FO := [];
  radarDisplay: dk_au_eng_Radar;
  static rc:int := 0;   
  
operations

public Radar : int * int * nat1 ==> Radar
Radar(x,y,r) ==
 (location := mk_Coordinates(x,y);
  range := r;
  detected := {|->};
  radarDisplay := new dk_au_eng_Radar();
  setupRadar(radarDisplay);
 );

public Scan : AirSpace ==> ()
Scan(as) ==
 (detected := { x.getId() |-> x | x in set as.getAirspace() & InRange(x) };
  UpdatePriorityList();
  DisplayScan();
 );
    
private InRange : FO ==> bool
InRange(fo) ==
  let foLocation = fo.getCoordinates()
  in 
    return isPointInRange(location,range,foLocation); 
   
public getDetected : () ==> set of FO
getDetected() == 
  return rng detected;

public getDetectedMap : () ==> map FOId to FO
getDetectedMap() ==
  return detected;

public saturatedRadar : () ==> bool
saturatedRadar() == 
  return card dom detected > range / 4;
  
public getSaturatingFOs : () ==> set of FOId
getSaturatingFOs() ==
  return {priority(i).getId() | i in set inds priority & i > floor(range/4)};

public getLocation : () ==> Coordinates
getLocation() == 
  return location;

public getRange : () ==> nat1
getRange() ==
  return range;
  
private UpdatePriorityList : () ==> ()
UpdatePriorityList() == 
  let notDetect = elems priority \ rng detected,
      newlyDet  = rng detected \ elems priority
  in 
    ( 
      for all fobj in set notDetect do
        let
            id: seq of char = VDMUtil`val2seq_of_char[FOId](fobj.getId())
        in
            radarDisplay.RemFlyingObject(id);
      for all fobj in set newlyDet do
        let
            mk_Coordinates(X,Y) = fobj.getCoordinates(),
            token2seq_of_char = VDMUtil`val2seq_of_char[token]
         in 
            radarDisplay.AddFlyingObject(X,Y,0,token2seq_of_char(fobj.getId()));
      removeNotDetected(notDetect);
      addNewlyDetected(newlyDet);
    );

private removeNotDetected : set of FO ==> ()
removeNotDetected(fos) == 
  priority := [priority(i) | i in set inds priority 
                           & priority(i) in set fos];    
  
private addNewlyDetected : set of FO ==> ()
addNewlyDetected(newlyDetect) == 
  priority := priority ^ set2seqFO(newlyDetect);    

private setupRadar: dk_au_eng_Radar ==> ()
setupRadar(r) == (r.SetWindowPosition(450*rc+50,100);
                  r.SetStepSize(5);
                  r.SetScanTime(60);
                  r.SetScanWidth(350);
                  let
                    int2seq_of_char = VDMUtil`val2seq_of_char[int],
                    mk_Coordinates(x,y) = location
                  in
                    r.SetTitle("MSAW Radar: (" ^ int2seq_of_char(x) ^ "," ^ int2seq_of_char(y) ^ ")");
                  rc:=rc+1;);

private DisplayScan: () ==> ()
DisplayScan() == for all x in set {1,...,360/5} do radarDisplay.StepRadar();

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


end Radar
~~~
{% endraw %}

### environment.vdmpp

{% raw %}
~~~
class Environment is subclass of GLOBAL

types 

inline  = FOId * int * int * Altitude * Time;
  
protected FOOut = FOId * Coordinates * Altitude * FOWarning * 
        MinimumSafetyAltitude * Time;
protected RadarOut = Coordinates * nat1 * RadarWarning * nat *  Time;
  
  
protected outline = FOOut | RadarOut; 

instance variables 

  io : IO := new IO();
  inlines  : seq of inline  := [];
  outlines : seq of outline := [];

  airspace : [AirSpace] := nil;
  busy : bool := true;
  
operations
  
public Environment : String ==> Environment
Environment(fname) == 
  def mk_(-,input) = io.freadval[seq of inline](fname) 
  in
    inlines := input;
    
      
public setAirSpace : AirSpace ==> ()
setAirSpace(as) ==
  airspace := as;
      
public handleFOWarningEvent : FOId * Coordinates * Altitude * FOWarning * 
                              MinimumSafetyAltitude * Time ==> ()
handleFOWarningEvent(id,coord,alt,warn,msa,time) ==
  outlines := outlines ^ [mk_(id,coord,alt,warn,msa,time)];
 
public handleRadarWarningEvent : Coordinates * nat1 * 
                                 RadarWarning * nat *  Time ==> ()
handleRadarWarningEvent(coord,range,radWarn,num,pt) ==
  outlines := outlines ^ [mk_(coord,range,radWarn,num,pt)];
 

public showResult : () ==> ()
showResult() ==
  def - = io.writeval[seq of outline](outlines) in skip;
 


public Run : () ==> ()
Run() ==
 (while not isFinished()
  do 
   (updateFOs();
    MSAW`atc.Step();
    World`timerRef.StepTime();
   );  
  showResult()
 );
  
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
                  done := len inlines = 0 )
            else done := true
       )
  else busy := false
 );
     

public isFinished : () ==> bool 
isFinished() == 
  return inlines = [];

end Environment
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
FO(i,c,a) == 
 (id := i;
  coord := c;
  alt := a;
 );
    
pure public getId : () ==> FOId
getId() ==
  return id;

public getCoordinates : () ==> Coordinates
getCoordinates() == 
  return coord;

public setCoordinates : Coordinates ==> ()
setCoordinates(c) ==
  coord := c;
  
public getAltitude : () ==> Altitude
getAltitude() ==
  return alt;
    
public setAltitude : Altitude ==> ()
setAltitude(a) ==
  alt := a;
 
public getPosition : () ==> Position
getPosition() == 
  return mk_Position(coord,alt); 
  

end FO
~~~
{% endraw %}

### timer.vdmpp

{% raw %}
~~~
class Timer 

instance variables

  currentTime : nat := 0;

values 

  stepLength : nat = 100;

operations

public 
  StepTime: () ==> ()
  StepTime() == 
    currentTime := currentTime + stepLength;

public
  GetTime: () ==> nat 
  GetTime() == return currentTime;

end Timer
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
  timerRef : Timer := new Timer();    

  
   
operations

public 
  World : () ==> World
  World() ==
    ( env := new Environment("scenario.txt");
      env.setAirSpace(MSAW`airspace);
      MSAW`atc.addRadar(MSAW`radar1);
      MSAW`atc.addRadar(MSAW`radar2);
      MSAW`atc.addObstacle(MSAW`militaryZone);
    );
  
public 
  Run : () ==> ()
  Run() ==
    env.Run();

end World
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

### dk_au_eng_Radar.vdmpp

{% raw %}
~~~
class dk_au_eng_Radar
--
-- External Java implementation of radar screen
--
--
	operations

        
		-- Add a FO to the radar to track
		public AddFlyingObject: int * int * int * seq of char ==> ()
		AddFlyingObject(longtitude, latitude, altitude, transpondercode) == is not yet specified;

		-- Remove a FO from the radar
		public RemFlyingObject: seq of char ==> ()
		RemFlyingObject(transpondercode) == is not yet specified;

		-- Make the scan line progress one step
		public StepRadar: () ==> ()
		StepRadar() == is not yet specified;

        -- Update the position of a flying object given its transponder code 
        public UpdateFlyingObject: seq of char * int * int ==> ()
        UpdateFlyingObject(transponder,long,lat) == is not yet specified;

        -- Set the step size, that is the angle by which the scan line is progressed when
        -- stepping
        public SetStepSize: int ==> ()
        SetStepSize(size) == is not yet specified;

        -- Set the width of the scan cone
        public SetScanWidth: int ==> ()
        SetScanWidth(width) == is not yet specified;

        -- Set the time a scan takes
        public SetScanTime: int ==> ()
        SetScanTime(time) == is not yet specified;

        -- Set the position of the Radar window (a nice model with two radars would want to 
        -- position the radars next to each other).
        public SetWindowPosition: int * int ==> ()
        SetWindowPosition(x,y) == is not yet specified;

        -- Set the title of the Radar Window
        public SetTitle: seq of char ==> ()
        SetTitle(title) == is not yet specified;

        -- Force the Scan Angle to be angle
        public SetScanAngle: int ==> ()
        SetScanAngle(angle) == is not yet specified;

		-- Run operation that makes 400 steps with two planes one of which is moving across.
		public static TestRadar: () ==> int
		TestRadar() == (
            let
                rad1:dk_au_eng_Radar = new dk_au_eng_Radar(),
                rad2:dk_au_eng_Radar = new dk_au_eng_Radar()
            in (
                rad2.SetWindowPosition(300,300);
                rad1.SetScanWidth(60);
                rad1.SetScanTime(80);
                rad1.AddFlyingObject(120, 120, 0, "LAN256");
                rad1.AddFlyingObject(0, 80, 0, "BA512");
                rad1.SetStepSize(6);
                for all x in set { -200,...,200 } do
                    (rad2.StepRadar();rad1.UpdateFlyingObject("BA512",x,80);rad1.SetWindowPosition(x+250, 100);rad1.StepRadar());
                
            return 0);
        );


end dk_au_eng_Radar
~~~
{% endraw %}

