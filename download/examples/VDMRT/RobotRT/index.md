---
layout: default
title: RobotRT
---

## RobotRT
Author: Lasse Lorentzen and Kenneth Lausdahl


This example was produced by Lasse Lorentzen and Kenneth Lausdahl
as a part of a VDM course of a robot travelling autonomically inside
a cave aiming at avioding different obstacles on its path.

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### World.vdmrt

{% raw %}
~~~
class World
 
instance variables
 
public static env : [Enviroment] :=nil;
 
operations
public World : () ==> World
World() ==
(
   env := new Enviroment();
   Robot`nmc.AddMovingObsticle(Robot`mobs1);
   Robot`nmc.AddMovingObsticle(Robot`mobs2);
   Robot`nmc.AddMovingObsticle(Robot`mobs3);
   Robot`nmc.AddMovingObsticle(Robot`mobs4);
 
   Robot`steering.AddObstacleSensor(Robot`obsSensorNorth);
   Robot`steering.AddObstacleSensor(Robot`obsSensorSouth);
   Robot`steering.AddObstacleSensor(Robot`obsSensorEast);
   Robot`steering.AddObstacleSensor(Robot`obsSensorWest);
 
 
 );
 
 public Run : () ==> ()
 Run() ==
 (
   start(env);
   env.isFinished(); --wait for env to handle alle events
 
 );
 
 
end World
~~~
{% endraw %}

### RobotTest.vdmrt

{% raw %}
~~~
class RobotTest
 
operations
 public Execute: () ==> ()
 Execute () ==
   (dcl ts : TestSuite := new TestSuite();
    ts.AddTest(new GridTest("Grid"));
    ts.AddTest(new StorageTest("Storage"));
   -- ts.AddTest(new DataReaderTest("DataReader"));
   -- ts.AddTest(new EnviromentTest("Enviroment "));
   -- ts.AddTest(new ObstacleSensorTest("ObstacleSensor"));
   -- ts.AddTest(new SteeringControllerTest("SteeringController "));
   -- ts.AddTest(new StorageTest("Storage"));
    ts.Run())
    
end RobotTest
~~~
{% endraw %}

### Storage.vdmrt

{% raw %}
~~~
class Storage
 
types
public  inDataType = nat * nat;
 
values
startIndex : nat = 1;
destIndex : nat = 2;
batCapIndex : nat = 3;
instance variables
 file : IO;
  inputFileName : seq of char := "map.m";
 inv inputFileName <> [];
 outputFileName : seq of char;
 inv outputFileName <> [];
 inData : seq of inDataType := [];
 public dest : Grid`Point;
 public startingPoint : Grid`Point;
 public battery : nat;
 inv battery >= 0;
 counter : nat;
 public fields : nat; -- used as support in test
 
inv startIndex > 0 and destIndex > 0 and batCapIndex > 0;
operations
 
 public Storage : () ==> Storage
 Storage() ==
 (
   battery := 0;
   file := new IO();
   startingPoint := mk_Grid`Point(0,0);
   outputFileName:= "TestRun.txt";
   fields := 0;
 );
 
 
  public Load : seq of char ==> Grid
 Load(newFileName) ==
 (
   inputFileName := newFileName;
   file := new IO();
   def mk_ (-,input) = file.freadval[seq of inDataType]( inputFileName) in
   inData := input;
        
    return SetData(inData);
 )
 pre newFileName <> [];
 
 private SetData : seq of inDataType ==> Grid
 SetData(data) ==
 (
   def g = new Grid(mk_Grid`Point(0,0),mk_Grid`Point(100,100))
   in
   (
   startingPoint := mk_Grid`Point(data(startIndex).#1, data(startIndex).#2);
   dest := mk_Grid`Point(data(destIndex).#1,data(destIndex).#2);
   battery := (inData(batCapIndex).#1);
   fields := len data - 2; --just for test
  let obsticales = { mk_Grid`Point(data(i).#1,inData(i).#2) |-> <Occupied> 
                   | i in set {4, ...,len data}}      
     in g.SetPointMP(obsticales);
   return g;
   )
 
 )
 pre startIndex in set inds (data) and 
     destIndex in set inds (data) and 
     batCapIndex in set inds (data);
 
 public Save : Grid * seq of SteeringController`Route * Grid`Point * bool ==> ()
 Save(g, routes,dest,b) ==
 (
   PrintLine("#--START--#");
   PrintLine("#--Start Successfull Destination--#");
   def - = file.fwriteval[bool * Grid`Point]
                         (outputFileName,mk_(b, dest),<append>) 
   in skip;   PrintLine("#--End Successfull Destination--#");
   PrintLine("#--Start Grid--#");
   for all x in set dom g.points
   do
   (
           WriteMap(x,g.points(x));
   );
   PrintLine("#--End Grid--#");  
    for all x in set inds routes
   do
   (
     PrintLine("#--Start Route--#");  
      PrintInt(x);
     WriteRoute(routes(x));
     PrintLine("#--End Reoute Grid--#");
   );
   PrintLine("#--END--#");
 );
 
private WriteMap: Grid`Point * Grid`PointAvalibility ==> ()
WriteMap(g,p) ==
(
  file := new IO();
  def - = file.fwriteval[Grid`Point * Grid`PointAvalibility]
                        (outputFileName,mk_(g,p),<append>) in skip;
);
 
 
private WriteRoute: SteeringController`Route ==> ()
WriteRoute(r) ==
(
  file := new IO();
  for all x in set inds r
  do(
      def - = file.fwriteval[Grid`Point]( outputFileName,(r(x)),<append>) 
      in skip;
     );
  
 );
 
private PrintInt: nat ==> ()
PrintInt(i) ==
(
  file := new IO();
  def - = file.fwriteval[nat]( outputFileName,i,<append>) in skip;
);
 
private PrintLine: seq of char  ==> ()
PrintLine (line) ==
(
  file := new IO();
  def - = file.fwriteval[seq of char]( outputFileName,line,<append>) in skip;
);
 
end Storage




class StorageTest is subclass of TestCase
 
instance variables
private completeGrid : Grid;
 
values
 
operations

 public StorageTest : seq of char ==> StorageTest
 StorageTest(name) == TestCase(name);
 
 protected SetUp: () ==> ()
 SetUp () == skip;
 
 protected RunTest: () ==> ()
 RunTest () ==
    (
      dcl tc : Storage:= new Storage();
        completeGrid := tc.Load("testmap.txt");
     AssertTrue(tc.fields = card dom completeGrid.points);
      AssertTrue(tc.startingPoint = mk_Grid`Point(0,0));
      AssertTrue(tc.dest = mk_Grid`Point(10,10));
      
      AssertTrue(<Occupied> = completeGrid.GetPointAvalibility(1,1));
      AssertTrue(<Occupied> = completeGrid.GetPointAvalibility(2,2));
      AssertTrue(<Occupied> = completeGrid.GetPointAvalibility(3,3));
      AssertTrue(<Occupied> = completeGrid.GetPointAvalibility(4,4));
   );
    
  
  protected TearDown: () ==> ()
 TearDown () == skip
 
end StorageTest
~~~
{% endraw %}

### VDMUnit Framework.vdmrt

{% raw %}
~~~
class Test
 
operations
 public Run: TestResult ==> ()
 Run (-) == is subclass responsibility
 
end Test
 
 
class TestCase
 is subclass of Test
 
instance variables
 name : seq of char
 
operations
 public TestCase: seq of char ==> TestCase
 TestCase(nm) == name := nm;
 
 public GetName: () ==> seq of char
 GetName () == return name;
 
 protected AssertTrue: bool ==> ()
 AssertTrue (pb) == if not pb then exit <FAILURE>;
 
 protected AssertFalse: bool ==> ()
 AssertFalse (pb) == if pb then exit <FAILURE>;
 
 public Run: TestResult ==> ()
 Run (ptr) ==
   trap <FAILURE>
     with
        ptr.AddFailure(self)
     in
       (SetUp();
       RunTest();
       TearDown());
 
 protected SetUp: () ==> ()
 SetUp () == is subclass responsibility;
 
 protected RunTest: () ==> ()
 RunTest () == is subclass responsibility;
 
 protected TearDown: () ==> ()
 TearDown () == is subclass responsibility
 
end TestCase
 
 
class TestSuite
 is subclass of Test
 
instance variables
 tests : seq of Test := [];
 
operations
 public Run: () ==> ()
 Run () ==
   (dcl ntr : TestResult := new TestResult();
    Run(ntr);
    ntr.Show());
 
 public Run: TestResult ==> ()
 Run (result) ==
   for test in tests do
     test.Run(result);
 
 public AddTest: Test ==> ()
 AddTest(test) ==
   tests := tests ^ [test];
 
end TestSuite
 
 
class TestResult
 
instance variables
 failures : seq of TestCase := []
 
operations
 public AddFailure: TestCase ==> ()
 AddFailure (ptst) == failures := failures ^ [ptst];
 
 public Print: seq of char ==> ()
 Print (pstr) ==
   -- include IO.vpp from the VDMTools distribution (stdlib directory)
   -- if you are getting a type error while checking this specification
   def - = new IO().echo(pstr ^ "\n") in skip;
   
  public Show: () ==> ()
 Show () ==
   if failures = [] then
     Print ("No failures detected")
   else
     for failure in failures do
       Print (failure.GetName() ^ " failed")
 
end TestResult
~~~
{% endraw %}

### Util.vdmrt

{% raw %}
~~~
class Util
 
 
operations
 
 public static PrintValue: Grid`Point ==> ()
 PrintValue(p) ==
 (
   def file = new IO()
   in
     def - = file.writeval[int *  int](mk_(p.X,p.Y)) in skip;
 );
 public static PrintDebug : seq of char ==> ()
 PrintDebug(debugData) ==
 (
   def file = new IO()
   in
     def - = file.echo(debugData ^ "\n") in skip;
 );
 
 
 public static PrintInt: int ==> ()
 PrintInt(i) ==
 (
   def file = new IO()
   in
     def - = file.writeval[int](i) in skip;
 );
 
 
 
end Util
~~~
{% endraw %}

### DataReader.vdmrt

{% raw %}
~~~
class DataReader
 
operations
 public DataReader : () ==> DataReader
 DataReader() ==
   return self;
 
 public Read : () ==> ()
 Read() ==
   skip;
 
end DataReader

class DataReaderTest is subclass of TestCase
values
 
operations
 protected SetUp: () ==> ()
 SetUp () == skip;
 
 protected RunTest: () ==> ()
 RunTest () == skip;
 
  protected TearDown: () ==> ()
 TearDown () == skip
 
end DataReaderTest
~~~
{% endraw %}

### Enviroment.vdmrt

{% raw %}
~~~
class Enviroment
 
instance variables
 private file : Storage;
 public completeGrid : Grid;
 private currentRobotPosition : Grid`Point;
 private busy : bool := true;
operations
 public Enviroment : () ==> Enviroment
 Enviroment() ==
 (
   file := new Storage();
   completeGrid := new Grid(mk_Grid`Point(0,0),mk_Grid`Point(100,100));
 );
 
 public GetPointAvalibility: Grid`Point ==> Grid`PointAvalibility
 GetPointAvalibility(p) ==
   return completeGrid.GetPointAvalibility(p.X,p.Y);
   
public handleEvent : Grid * seq of SteeringController`Route * 
                     Grid`Point * bool==> ()
handleEvent(g, routes,dest,b) ==
   file.Save(g,routes,dest,b);
 
public isFinished : () ==> ()
 isFinished () == Robot`steering.isFinished();
 
thread
 (--here we have to interact with the robot, 
  --punch, shoot...something
 
   completeGrid := file.Load("testmap.map");
   start(Robot`nmc);   --observe
   start(Robot`mobs1); --move
   start(Robot`mobs2); --move
   start(Robot`mobs3); --move
   start(Robot`mobs4); --move
   start(Robot`steering);
   Robot`steering.SetDiscoverInfo(file.startingPoint,
                                  file.dest, file.battery);
 
   busy := false;
 
 )
 
sync
 
per isFinished => not busy;
 
 
end Enviroment


class EnviromentTest is subclass of TestCase
values
 
operations
 protected SetUp: () ==> ()
 SetUp () == skip;
 
 protected RunTest: () ==> ()
 RunTest () == skip;
 
  protected TearDown: () ==> ()
 TearDown () == skip
 
end EnviromentTest
~~~
{% endraw %}

### ObstacleSensor.vdmrt

{% raw %}
~~~
class ObstacleSensor
types
public SensorDirection = <North> | <South> | <East> | <West>;
 
instance variables
sDirection : SensorDirection;
 
operations
 public ObstacleSensor : SensorDirection ==> ObstacleSensor
 ObstacleSensor(direction) ==
   sDirection:= direction;
 
 public GetPointAvalibility : Grid`Point ==> Grid`PointAvalibility
 GetPointAvalibility (p) ==
   if World`env.GetPointAvalibility(p) = <Occupied> then
     return <Occupied>
   else
     return <Free>
 pre World`env.completeGrid.IsValidGridPoint(p);
 
  public GetDirection : () ==> SensorDirection
 GetDirection() == return sDirection;
 
end ObstacleSensor



class ObstacleSensorTest is subclass of TestCase
values
 
operations
 protected SetUp: () ==> ()
 SetUp () == skip;
 
 protected RunTest: () ==> ()
 RunTest () ==
    (
     dcl tc : ObstacleSensor:= new ObstacleSensor(<North>);
      AssertTrue(tc.GetDirection() = <North>);
 
   );
    
  
  protected TearDown: () ==> ()
 TearDown () == skip
 
end ObstacleSensorTest
~~~
{% endraw %}

### MovingObstacle.vdmrt

{% raw %}
~~~
class MovingObstacle
types
public MoveDirection = <North> | <South> | <East> | <West>;
instance variables
firstpos : Grid`Point;
pos : Grid`Point;
direction : MoveDirection;
steps :int;
busy: bool := true;
operations
 public MovingObstacle: Grid`Point * MoveDirection ==> MovingObstacle
 MovingObstacle (p, dir) ==
 (
   firstpos:=p;
   pos:= firstpos;
   direction := dir;
   steps :=0;
 );
 
 private Step : () ==> ()
 Step() ==
 duration(1000)
 (
   if steps = 10 then
     (
       SetPos(firstpos,0);
     )
   else
     (
        if direction = <North> then
          SetPos(mk_Grid`Point(pos.X,pos.Y+1),steps+1);
      
        if direction = <South> then
          SetPos(mk_Grid`Point(pos.X,pos.Y-1),steps+1);
 
        if direction = <East> then
          SetPos(mk_Grid`Point(pos.X+1,pos.Y),steps+1);
 
        if direction = <West> then
          SetPos(mk_Grid`Point(pos.X-1,pos.Y),steps+1);
 
      );
--Util`PrintDebug("Mobs");
--Util`PrintValue(pos);
 
 );
 private SetPos: Grid`Point * int ==> ()
 SetPos(p,s) == ( pos:= p; steps:= s;);
 
 public GetPos: () ==> Grid`Point
   GetPos() ==
     return pos;
 
 public Stop: () ==> ()
 Stop() == busy:=false;
thread
periodic(1000E6,100, 100,0)(Step);
 
sync
 
mutex(SetPos, GetPos);
mutex(SetPos);
 
 
end MovingObstacle



class MovingObstacleTest is subclass of TestCase
values
 
operations
 protected SetUp: () ==> ()
 SetUp () == skip;
 
 protected RunTest: () ==> ()
 RunTest () == skip;
 
  protected TearDown: () ==> ()
 TearDown () == skip
 
end MovingObstacleTest
~~~
{% endraw %}

### Robot.vdmrt

{% raw %}
~~~
system Robot
 
instance variables
-- cpu speed has only influence on the model if cycles is used
 cpu1 : CPU := new CPU( <FP>, 1E9);
 cpu2 : CPU := new CPU( <FP>, 1E9);
 cpu3 : CPU := new CPU( <FP>, 1E9);
 cpu4 : CPU := new CPU( <FP>, 1E9);
 cpu5 : CPU := new CPU( <FP>, 1E9);
 
-- BUS speed does only have effect if large amount of data 
-- is transfered between CPUs
 bus1 : BUS := new BUS( <FCFS>, 1E9, {cpu1});      
 -- steering and obs sensor
 bus2 : BUS := new BUS( <FCFS>, 1E6, {cpu1,cpu2}); 
 --sterring and mo observer
 bus3 : BUS := new BUS( <FCFS>, 1E6, {cpu5,cpu1}); 
 --sterring and datareader
 bus4 : BUS := new BUS( <FCFS>, 1E6, {cpu3,cpu2}); 
 --mo and move observer
 bus5 : BUS := new BUS( <FCFS>, 1E6, {cpu4,cpu2}); 
 --mo and move observer
 
 
 private name : set of char;
 public static obsSensorNorth : ObstacleSensor := new ObstacleSensor(<North>);
 public static obsSensorSouth : ObstacleSensor := new ObstacleSensor(<South>);
 public static obsSensorEast  : ObstacleSensor := new ObstacleSensor(<East>);
 public static obsSensorWest : ObstacleSensor := new ObstacleSensor(<West>);
 
 
 public static dataReader : DataReader := new DataReader();
 public static steering   : SteeringController := new SteeringController();
 
 public static mobs1 : MovingObstacle 
                     := new MovingObstacle(mk_Grid`Point(5,0),<West>);
 public static mobs2 : MovingObstacle 
                     := new MovingObstacle(mk_Grid`Point(7,0),<West>);
 public static mobs3 : MovingObstacle 
                     := new MovingObstacle(mk_Grid`Point(20,20),<West>);
 public static mobs4 : MovingObstacle 
                     := new MovingObstacle(mk_Grid`Point(10,10),<South>);
 
 public static nmc : NextMoveController := new NextMoveController();
operations
 public Robot : () ==> Robot
 Robot() ==
 (      
   cpu1.deploy(obsSensorNorth);
   cpu1.deploy(obsSensorSouth);
    cpu1.deploy(obsSensorEast);
   cpu1.deploy(obsSensorWest);
 
   cpu5.deploy(dataReader);
 
   cpu1.deploy(steering);
   cpu1.setPriority(SteeringController`SetDiscoverInfo,80);
 
   cpu3.deploy(mobs1);
   cpu3.setPriority(MovingObstacle`Step,15);
   cpu3.deploy(mobs2);
    cpu3.setPriority(MovingObstacle`Step,15);
 
   cpu4.deploy(mobs3);
   cpu4.setPriority(MovingObstacle`Step,15);
   cpu4.deploy(mobs4);
   cpu4.setPriority(MovingObstacle`Step,15);
 
   cpu2.deploy(nmc);
   cpu2.setPriority(NextMoveController`LocateMovingObstacles,80);
 
 );
 
end Robot
~~~
{% endraw %}

### SteeringController.vdmrt

{% raw %}
~~~
class SteeringController
values
 
MAX_POINT : Grid`Point = mk_Grid`Point(100,100);
types
public Route= seq of Grid`Point;
 
instance variables
 private routes : seq of Route := [];
 public static obsSensors : set of ObstacleSensor := {};
 private batCap : int := 1;
 private dest: Grid`Point;
 private  workingGrid : Grid;
 busy : bool := true;
-- inv batCap > 1 and len routes > 0 => GetBatUsage()*2 <= batCap;
 
operations
 
 public SteeringController : () ==> SteeringController
 SteeringController() ==
 (
   skip;
 );
 
-- GET
 
 private GetPointDirection : Grid`Point ==> ObstacleSensor`SensorDirection
 GetPointDirection(p) ==
   (
     let curPos = GetPos() in
     if curPos.X > p.X then return <East>
     else if  curPos.X < p.X then return <West>
     else if  curPos.Y > p.Y then return <North>
     else return <South>
 
   );
 
 pure private GetBatUsage: () ==> nat
 GetBatUsage() ==
    return len routes(len routes)
 pre len routes > 0;
 
 pure private GetPos : () ==> Grid`Point
 GetPos() ==
    let r = routes(len routes) in
     return r(len r);
 
 private GetRoutes : () ==> seq of Route
 GetRoutes () ==
    return routes;
 
 private GetNeighbourPoints : () ==> set of Grid`Point
 GetNeighbourPoints() ==
   return
   (
     let cPos = GetPos()
       in
       (
         {mk_Grid`Point(cPos.X,y)| y in set {cPos.Y+1, cPos.Y-1} & y>=0}
         union
         {mk_Grid`Point(x,cPos.Y)| x in set {cPos.X+1, cPos.X-1} & x>=0}
         ) \ {cPos}
   )
  
  post RESULT =
 (
   let cPos = GetPos()
     in
     (
       {mk_Grid`Point(cPos.X,y)| y in set {cPos.Y+1, cPos.Y-1} & y>=0}
       union
       {mk_Grid`Point(x,cPos.Y)| x in set {cPos.X+1, cPos.X-1} & x>=0}
       ) \ {cPos}
  ) and forall p in set RESULT & workingGrid.IsValidGridPoint(p);
 
 
  private GetNextMove : set of Grid`Point ==> [Grid`Point]
 GetNextMove (neighbourPoints) ==
 (
   let freePts= {p|p in set neighbourPoints 
                  & workingGrid.GetPointAvalibility(p.X,p.Y)=<Free> and
                    not IsInRoute(p)}
     in
       if card freePts > 0 then
         return Robot`nmc.GetNextPoint(freePts, dest)
       else
         return nil;
 
 );
-- Other help operations (GET)
 
 private IsDestination : Grid`Point ==> bool
 IsDestination(p) ==
   return p.X = dest.X and p.Y = dest.Y;
 
 private DoesRouteHaveMoreOptions : () ==> bool
 DoesRouteHaveMoreOptions () ==
 (
   return len routes(len routes) > 1
 );
 
 private IsInRoute : Grid`Point ==> bool
 IsInRoute(p) ==
 (
   let r = conc routes in
   if card {r(x) | x in set inds r & r(x) = p} > 0
   then return true
   else return false
 );
 
 
-- operations moving or changing the location
 
 private StartNewRoute : () ==> ()
 StartNewRoute() ==
  (
   let r = routes(len routes)
     in
     if len r > 1 then
     (
        routes := routes ^ [r(1,...,len routes(len routes)-1)];
     );
 );
 
  public ReturnToBase : () ==> ()
 ReturnToBase() ==
   skip;
 
 private Move : Grid`Point ==> ()
 Move(p) ==
   duration(1000)
   (
     let r = routes(len routes)
       in routes(len routes) := r ^ [p]
   )
 
  pre GetBatUsage()*2 <= batCap and batCap > 1 and 
      let cp = routes(len routes)(len routes(len routes))
      in p.X <> cp.X or p.Y <> cp.Y
 post p = routes(len routes)(len routes(len routes));
 
 
 
 private RestartNewRoute : () ==> ()
 RestartNewRoute () ==
 (
   ReturnToBase();
   StartNewRoute();
 );
 
 private FindRoute : () ==> Grid * seq of Route * Grid`Point * bool
 FindRoute() ==
 (
  
    if FindRouteToDestination() then
   (  
      Robot`dataReader.Read();
     Util`PrintDebug("Succes");
   )
   else
   (
     Util`PrintDebug("No route found, has reached dead end");
   );
   ReturnToBase();
 
   Util`PrintDebug("The End");
   return mk_( workingGrid,routes, dest, IsDestination(GetPos()) );
  )
 pre workingGrid.IsValidGridPoint(dest);
  
 
 
  private FindRouteToDestination : () ==> bool
 FindRouteToDestination () ==
 (
   while not IsDestination(GetPos()) and GetBatUsage()*2 <= batCap do
   (
     let neighbourPoints = {n|n in set GetNeighbourPoints() 
                             & workingGrid.IsValidGridPoint(n)}
       in
         if card neighbourPoints > 0 then
         (
            DiscoverUnknownNeighbourPoints(neighbourPoints);
           let nextMove = GetNextMove(neighbourPoints)
             in
               if nextMove <> nil then
               (
                 Move(nextMove);
                 Util`PrintDebug("Moved to pos:");
                  Util`PrintValue(GetPos())
                )
               else
                (
                   if DoesRouteHaveMoreOptions() then
                     RestartNewRoute()
                   else
                     return false; 
                     -- no routes to destination. Dead end
               );
         )
         else
           RestartNewRoute();
   );
   return true; -- route found
 
 );
 
 
 
 private DiscoverUnknownNeighbourPoints : set of Grid`Point ==> ()
 DiscoverUnknownNeighbourPoints(neighbourPoints) ==
 (
   let unknownPoints = {p| p in set neighbourPoints 
                         & workingGrid.GetPointAvalibility(p.X,p.Y)=<Unknown>}
     in
     (
       let knownMappings = { p |-> obs.GetPointAvalibility(p) 
                           | obs in set obsSensors, p in set unknownPoints 
                           & obs.GetDirection() = GetPointDirection(p)}
         in
             workingGrid.SetPointMP(knownMappings)
     );
 
 )
 pre forall p in set neighbourPoints & workingGrid.IsValidGridPoint(p);
 
 public SetDiscoverInfo: Grid`Point * Grid`Point * int ==> ()
 SetDiscoverInfo(startingPoint, destination, batCapacity) ==
 (
   workingGrid := new Grid(startingPoint, MAX_POINT);
   workingGrid.SetPointMP({startingPoint |-> <Free>});
   batCap:= batCapacity;
   dest:= destination;
   routes := [ [startingPoint] ];--first route first point = startingPoint
 )
 pre ValidatePoint(MAX_POINT,destination) and
     ValidatePoint(MAX_POINT, startingPoint) and
     batCapacity >=2;
 
 public AddObstacleSensor: ObstacleSensor ==> ()
 AddObstacleSensor(obs) ==
   obsSensors := obsSensors union {obs};
 
 
 
 public isFinished : () ==> ()
 isFinished () == skip;
 
  sync
 per isFinished => not busy;
 
thread
 while busy do
 (
   let res = FindRoute()
     in
       World`env.handleEvent(res.#1, res.#2, res.#3, res.#4);
   busy := false;
 );
 
sync
 
per FindRoute => #fin(SetDiscoverInfo) > #fin(FindRoute);
 
mutex (FindRoute);
 
mutex (SetDiscoverInfo, FindRoute);
mutex (SetDiscoverInfo);
mutex (AddObstacleSensor);
  
functions
 
ValidatePoint: Grid`Point * Grid`Point -> bool
 ValidatePoint(max,point) ==
   max.X >= point.X and max.Y >= point.Y and point.X>= 0 and point.Y >=0;
end SteeringController



class SteeringControllerTest is subclass of TestCase
values
 sta : Grid`Point = mk_Grid`Point(0,0);
 
operations
 protected SetUp: () ==> ()
 SetUp () == skip;
 
 protected RunTest: () ==> ()
 RunTest () == skip;
    
  
  protected TearDown: () ==> ()
 TearDown () == skip
 
end SteeringControllerTest
~~~
{% endraw %}

### Grid.vdmrt

{% raw %}
~~~
class Grid
 
types
public PointAvalibility = <Free> | <Occupied> | <Unknown>;
public Point ::
      X: int
      Y: int
 
instance variables
public points: map Point to PointAvalibility := {|->};
 
private maxPoint: Point := mk_Point(10E6,10E6);
 
inv forall p in set dom points & IsValidGridPoint(p) 
--& exists pa in set rng points & points(p)=pa;
 
operations
 
 public Grid : Point * Point ==> Grid
 Grid(startPoint,p) ==
 (
   points := { startPoint |-> <Free>};
   maxPoint := p;
 )
 pre IsValidGridPoint(startPoint) and IsValidGridPoint(p);
 
 public GetPointAvalibility : int * int ==> PointAvalibility
 GetPointAvalibility(x, y) ==
   if mk_Point(x,y) in set dom points
     then                       
        return(points(mk_Point(x,y)))
     else
       return <Unknown>
 
  pre IsValidGridPoint(mk_Point(x,y));
 
 public SetPointMP : map Point to PointAvalibility ==> ()
 SetPointMP(mapping) ==
   points := points ++ mapping
 pre forall p in set dom mapping & IsValidGridPoint(p);
 
 
 pure public IsValidGridPoint : Point ==> bool
 IsValidGridPoint(p)==
   return maxPoint.X >= p.X and p.X >= 0 and maxPoint.Y >= p.Y and p.Y >=0
   
end Grid


class GridTest is subclass of TestCase
values
 sta : Grid`Point = mk_Grid`Point(0,0);
 max : Grid`Point = mk_Grid`Point(100,100);
 
operations

 public GridTest : seq of char ==> GridTest
 GridTest(name) == TestCase(name);
 protected SetUp: () ==> ()
 SetUp () == skip;
 
 protected RunTest: () ==> ()
 RunTest () ==
    (
      dcl tc : Grid := new Grid(sta,max);
       AssertTrue(tc.GetPointAvalibility(sta.X, sta.Y) = <Free>);
       AssertFalse(tc.IsValidGridPoint(mk_Grid`Point(-999999,-999999)));
       AssertFalse(tc.IsValidGridPoint(mk_Grid`Point(999999,999999)));
       AssertTrue( tc.IsValidGridPoint(mk_Grid`Point (4,1)));
       AssertTrue(<Unknown> = tc.GetPointAvalibility(4,1));
       AssertTrue(<Unknown> = tc.GetPointAvalibility(4,2));
       AssertTrue(<Unknown> = tc.GetPointAvalibility(4,3));
       AssertTrue(<Unknown> = tc.GetPointAvalibility(5,4));
   );
    
  
  protected TearDown: () ==> ()
 TearDown () == skip
 
end GridTest
~~~
{% endraw %}

### NextMoveController.vdmrt

{% raw %}
~~~
class NextMoveController
 
instance variables
obs : map Grid`Point to Grid`PointAvalibility;
mobs : set of MovingObstacle := {};
thread
-- periodic (period,jitter,delay,offset) (operation
periodic(2500E6,1,0,0)( LocateMovingObstacles);
 
sync
--check before move
mutex (SetObs, IsPointBlocked);
 
-- no simultanious calls
mutex (SetObs);
mutex (WaitForAvalibility);
 
mutex (LocateMovingObstacles);
mutex (GetNextPoint);
per GetNextPoint => #fin(LocateMovingObstacles) > #fin(GetNextPoint);
per IsPointBlocked => #fin(SetObs) > #fin(IsPointBlocked);
 
operations
 
 public NextMoveController: () ==> NextMoveController
 NextMoveController () ==
 (
   skip;
 );
 
public AddMovingObsticle : MovingObstacle ==> ()
 AddMovingObsticle(mo) ==
   mobs := mobs union {mo};
 
private LocateMovingObstacles : () ==>()
 LocateMovingObstacles() ==
 duration(100)
 (
 
    let m = { mo.GetPos()|-><Occupied> | mo in set mobs} in
     SetObs(m);
 );
 
private SetObs: map Grid`Point to Grid`PointAvalibility ==> ()
 SetObs(mp) ==
  (
   obs := { |->}; 
   -- remove old data could be replaced by using the thread 
   -- id of the thread
   obs := obs ++ mp
 );
 
private WaitForAvalibility: Grid`Point ==> ()
 WaitForAvalibility(p) ==
   while IsPointBlocked(p) do
    (
     Util`PrintDebug("Waiting for obstacle on pos:");
     Util`PrintValue(p);
     Util`PrintInt(time);
 
     skip;
   );
 
private IsPointBlocked: Grid`Point ==> bool
 IsPointBlocked(p) ==
(
 
 
          Util`PrintDebug("Requesting Pos");
          Util`PrintValue(p);
          Util`PrintDebug("Mobs");
          for all mo in set dom obs do
            Util`PrintValue(mo);
 
if p in set dom obs then
Util`PrintDebug("in")
else
Util`PrintDebug("not");
 
   return p in set dom obs;
);
 
 public GetNextPoint : set of Grid`Point * Grid`Point ==> [Grid`Point]
 GetNextPoint(neighbours, dest) ==
   let tmp : set1 of Grid`Point ={p| p in set neighbours 
             & not exists q in set neighbours & 
                      Distance(p, dest) > Distance(q, dest)}
    in
      for all p in set tmp      
        do
        (
 
          WaitForAvalibility(p);
          
 
 
           return p
        )
 pre card neighbours > 0;
 
functions
 
  Distance: Grid`Point * Grid`Point -> nat
  Distance(p1, p2) ==
    def a = (p2.X-p1.X)* (p2.X-p1.X) + (p2.Y-p1.Y)* (p2.Y-p1.Y)
      in
        if 0<= a then
          floor(MATH`sqrt(a))
        else
           0;
 
end NextMoveController



class NextMoveControllerTest is subclass of TestCase
values
 
operations
 protected SetUp: () ==> ()
 SetUp () == skip;
 
 protected RunTest: () ==> ()
 RunTest () == skip;
 
  protected TearDown: () ==> ()
 TearDown () == skip
 
end NextMoveControllerTest
~~~
{% endraw %}

