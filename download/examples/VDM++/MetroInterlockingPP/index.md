---
layout: default
title: MetroInterlockingPP
---

## MetroInterlockingPP
Author: Steffen Diswal


This example is produced by a student as a part of a VDM course given at the Department of Engineering at the University of Aarhus. This model describes a small interlocking system for a metro.  

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run(18)|
|Entry point     :| new UnitTestRunner().Execute()|


### UnitTests.vdmpp

{% raw %}
~~~
class UnitTests is subclass of TestCase

instance variables
    private system: InterlockingSystem := new InterlockingSystem();
    private units: seq of MetroUnit := [ ];
    private lines: seq of InterlockingSystem`MetroLine := [ ];
    
functions
    private static Track: nat * nat * InterlockingSystem`TrackKind * nat1 -> InterlockingSystem`Track
                   Track(x, y, kind, capacity) == mk_InterlockingSystem`Track(mk_(x, y), kind, capacity);
    
    private static Line: InterlockingSystem`MetroLineName * seq of InterlockingSystem`Track -> InterlockingSystem`MetroLine
                   Line(name, tracks) == InterlockingSystem`CreateLinearLine(name, tracks);
    
operations
    public setUp: () ==> ()
           setUp() ==
           (
                system := new InterlockingSystem();
                units := [ new MetroUnit(mk_token(i)) | i in set { 1, ..., 8 } ];
                lines := [ Line("Underwater 1", [ Track(1, 1, <Underwater>, 1), Track(2, 1, <Underground>, 2), Track(3, 1, <Underground>, 2), Track(4, 1, <Underground>, 1) ])
                         , Line("Underground 1", [ Track(1, 1, <Underground>, 1), Track(2, 1, <Underground>, 2), Track(3, 1, <Underground>, 2), Track(4, 1, <Underground>, 1) ])
                         , Line("Overground 1", [ Track(1, 1, <Overground>, 1), Track(2, 1, <Underground>, 2), Track(3, 1, <Underground>, 2), Track(4, 1, <Underground>, 1) ])
                         , Line("Elevated 1", [ Track(1, 1, <Elevated>, 1), Track(2, 1, <Underground>, 2), Track(3, 1, <Underground>, 2), Track(4, 1, <Underground>, 1) ])
                         , Line("Underwater 2", [ Track(1, 2, <Underwater>, 1), Track(2, 2, <Underground>, 1) ])
                         , Line("Underground 2", [ Track(1, 2, <Underground>, 1), Track(2, 2, <Underground>, 1) ])
                         , Line("Overground 2", [ Track(1, 2, <Overground>, 1), Track(2, 2, <Underground>, 1) ])
                         , Line("Elevated 2", [ Track(1, 2, <Elevated>, 1), Track(2, 2, <Underground>, 1) ]) ];
                
                AddLines();
                AddUnits();
                RelocateUnits();
           );
    
    private AddLines: () ==> ()
            AddLines() ==
            (
                system.AddLine(lines(1));
                system.AddLine(lines(2));
                system.AddLine(lines(3));
                system.AddLine(lines(4));
                system.AddLine(lines(5));
                system.AddLine(lines(6));
                system.AddLine(lines(7));
                system.AddLine(lines(8));
            );
    
    private AddUnits: () ==> ()
            AddUnits() ==
            (
                system.AddUnit(units(1));
                system.AddUnit(units(2));
                system.AddUnit(units(3));
                system.AddUnit(units(4));
                system.AddUnit(units(5));
                system.AddUnit(units(6));
                system.AddUnit(units(7));
                system.AddUnit(units(8));
            );
    
    private RelocateUnits: () ==> ()
            RelocateUnits() ==
            (
                units(1).Relocate(lines(1), 1);
                units(2).Relocate(lines(2), 1);
                units(3).Relocate(lines(3), 1);
                units(4).Relocate(lines(4), 1);
                units(5).Relocate(lines(5), 1);
                units(6).Relocate(lines(6), 1);
                units(7).Relocate(lines(7), 1);
                units(8).Relocate(lines(8), 1);
            );
    
    private TickAll: () ==> ()
            TickAll() ==
            (
                system.Tick();
                units(1).Tick();
                units(2).Tick();
                units(3).Tick();
                units(4).Tick();
                units(5).Tick();
                units(6).Tick();
                units(7).Tick();
                units(8).Tick();
            );
    
    private States: () ==> seq of MetroUnit`MetroUnitState
            States() == return [ u.GetState() | u in seq units ];
    
    -- // PrioritiseUnits //
    public testPrioritiseUnits1: () ==> ()
           testPrioritiseUnits1() ==
                def priorities = [ <Underwater>, <Underground>, <Overground>, <Elevated> ];
                    prioritisedUnits = system.PrioritiseUnits(elems units, priorities)
                in
                (
                    -- PrioritiseUnits is non-deterministic when units have equal priority.
                    assertTrue(prioritisedUnits(1) in set { units(1), units(5) } \ { prioritisedUnits(2) });
                    assertTrue(prioritisedUnits(2) in set { units(1), units(5) } \ { prioritisedUnits(1) });
                    assertTrue(prioritisedUnits(3) in set { units(2), units(6) } \ { prioritisedUnits(4) });
                    assertTrue(prioritisedUnits(4) in set { units(2), units(6) } \ { prioritisedUnits(3) });
                    assertTrue(prioritisedUnits(5) in set { units(3), units(7) } \ { prioritisedUnits(6) });
                    assertTrue(prioritisedUnits(6) in set { units(3), units(7) } \ { prioritisedUnits(5) });
                    assertTrue(prioritisedUnits(7) in set { units(4), units(8) } \ { prioritisedUnits(8) });
                    assertTrue(prioritisedUnits(8) in set { units(4), units(8) } \ { prioritisedUnits(7) });
                );
    
    public testPrioritiseUnits2: () ==> ()
           testPrioritiseUnits2() ==
                def priorities = [ <Overground>, <Underground>, <Underwater>, <Elevated> ];
                    prioritisedUnits = system.PrioritiseUnits(elems units, priorities)
                in
                (
                    assertTrue(prioritisedUnits(1) in set { units(3), units(7) } \ { prioritisedUnits(2) });
                    assertTrue(prioritisedUnits(2) in set { units(3), units(7) } \ { prioritisedUnits(1) });
                    assertTrue(prioritisedUnits(3) in set { units(2), units(6) } \ { prioritisedUnits(4) });
                    assertTrue(prioritisedUnits(4) in set { units(2), units(6) } \ { prioritisedUnits(3) });
                    assertTrue(prioritisedUnits(5) in set { units(1), units(5) } \ { prioritisedUnits(6) });
                    assertTrue(prioritisedUnits(6) in set { units(1), units(5) } \ { prioritisedUnits(5) });
                    assertTrue(prioritisedUnits(7) in set { units(4), units(8) } \ { prioritisedUnits(8) });
                    assertTrue(prioritisedUnits(8) in set { units(4), units(8) } \ { prioritisedUnits(7) });
                );
    
    public testPrioritiseUnits3: () ==> ()
           testPrioritiseUnits3() ==
                def priorities = [ <Underground>, <Elevated>, <Overground>, <Underwater> ];
                    prioritisedUnits = system.PrioritiseUnits(elems units, priorities)
                in
                (
                    assertTrue(prioritisedUnits(1) in set { units(2), units(6) } \ { prioritisedUnits(2) });
                    assertTrue(prioritisedUnits(2) in set { units(2), units(6) } \ { prioritisedUnits(1) });
                    assertTrue(prioritisedUnits(3) in set { units(4), units(8) } \ { prioritisedUnits(4) });
                    assertTrue(prioritisedUnits(4) in set { units(4), units(8) } \ { prioritisedUnits(3) });
                    assertTrue(prioritisedUnits(5) in set { units(3), units(7) } \ { prioritisedUnits(6) });
                    assertTrue(prioritisedUnits(6) in set { units(3), units(7) } \ { prioritisedUnits(5) });
                    assertTrue(prioritisedUnits(7) in set { units(1), units(5) } \ { prioritisedUnits(8) });
                    assertTrue(prioritisedUnits(8) in set { units(1), units(5) } \ { prioritisedUnits(7) });
                );
        
    -- // Tick //
    public testTick1: () ==> ()
           testTick1() ==
           (
                TickAll();
                assertTrue(States() = [ <Running>, <Running>, <Stopped>, <Stopped>, <Running>, <Stopped>, <Stopped>, <Stopped> ]);
                -- Capacity is          ------------------- 2 --------------------  ------------------- 1 --------------------
           );
    
    public testTick2: () ==> ()
           testTick2() ==
           (
                TickAll();
                TickAll();
                assertTrue(States() = [ <Running>, <Running>, <Stopped>, <Stopped>, <Running>, <Stopped>, <Stopped>, <Stopped> ]);
                -- Capacity is          ------------------- 2 --------------------  ------------------- 1 --------------------
           );
    
    public testTick3: () ==> ()
           testTick3() ==
           (
                TickAll();
                TickAll();
                TickAll();
                assertTrue(States() = [ <Running>, <Stopped>, <Running>, <Running>, <Running>, <Stopped>, <Stopped>, <Stopped> ]);
                -- Capacity is          -------- 1 ------------------- 2 ---------  ------------------- 1 --------------------
           );
    
    public tearDown: () ==> ()
           tearDown() == skip;
    
end UnitTests
~~~
{% endraw %}

### InterlockingSystem.vdmpp

{% raw %}
~~~
class InterlockingSystem

types
    public Coordinate = nat * nat;
    public NonEmptyString = seq1 of char;
    
    -- // Tracks //
    public TrackKind = <Underwater> | <Underground> | <Overground> | <Elevated>;
    public Track :: location: Coordinate
                    kind: TrackKind
                    capacity:- nat1;            -- Number of parallel tracks/rails at this track section.
    
    public CapacityMap = map Track to int;
    
    -- // Metro lines //
    public MetroLineName = NonEmptyString;
    public MetroLine :: name: MetroLineName
                        tracks: seq1 of Track
    
    -- Metro lines are assumed to be circular (i.e. the first and last track are the same).
    inv mk_MetroLine(-, t) == IsCircular(t);
    
values
    private trackPriorities: seq of TrackKind = [ <Underwater>, <Underground>, <Elevated>, <Overground> ];  -- Highest to lowest.
    
instance variables
    private lines: inmap MetroLineName to MetroLine := { |-> };
    private units: inmap MetroUnit`MetroUnitId to MetroUnit := { |-> };
    
    -- All metro units with metro line associations must be associated with existing metro lines.
    inv forall u in set rng units &
            u.GetLine() <> nil => u.GetLine() in set rng lines;
    
    -- All tracks must accommodate all metro units. If any track exceeds its capacity, it is overloaded and metro units may collide.
    inv TracksAccommodateAllMetroUnits();
    
functions
    -- // Metro lines and tracks //
    private static AllTracks: set of MetroLine -> set of Track
                   AllTracks(allLines) == dunion { elems line.tracks | line in set allLines };
    
    public static IsCircular: seq1 of Track -> bool
                  IsCircular(tracks) == hd tracks = tracks(len tracks);

    public static InRangeOfTracks: [MetroLine] * nat1 -> bool
                  InRangeOfTracks(line, trackIndex) == line <> nil => trackIndex <= len line.tracks;
    
    public static NextTrackIndex: [MetroLine] * nat1 -> nat1
                  NextTrackIndex(line, currentTrackIndex) ==
                        if line = nil then
                            currentTrackIndex
                        elseif currentTrackIndex < len line.tracks - 1 then
                            currentTrackIndex + 1
                        else
                            1
    post InRangeOfTracks(line, RESULT);
    
    public static TrackAt: [MetroLine] * nat1 -> [Track]
                  TrackAt(line, trackIndex) ==
                        if line <> nil then
                            line.tracks(trackIndex)
                        else
                            nil
    pre InRangeOfTracks(line, trackIndex);
    
    public static CreateCircularLine: MetroLineName * seq1 of Track -> MetroLine
                  CreateCircularLine(name, tracks) == mk_MetroLine(name, tracks)
    pre IsCircular(tracks);
    
    public static CreateReversedCircularLine: MetroLineName * seq1 of Track -> MetroLine
                  CreateReversedCircularLine(name, tracks) == mk_MetroLine(name, Reverse(tracks))
    pre IsCircular(tracks);
    
    public static CreateLinearLine: MetroLineName * seq1 of Track -> MetroLine
                  CreateLinearLine(name, tracks) == mk_MetroLine(name, LinearToCircularLine(tracks));
    
    public static LinearToCircularLine: seq1 of Track -> seq1 of Track
                  LinearToCircularLine(tracks) == tracks ^ (tl Reverse(tracks))
    post IsCircular(RESULT);
    
    public static Reverse: seq of Track -> seq of Track
                  Reverse(tracks) ==
                      if tracks = [ ] then
                          [ ]
                      else
                          Reverse(tl tracks) ^ [ hd tracks ]
    measure Length;
    
    private static Length: seq of Track -> nat
                   Length(tracks) == len tracks;
    
    -- // Units //
    private static UnitSetToSequence: set of MetroUnit -> seq of MetroUnit
                   UnitSetToSequence(unitSet) ==
                       if unitSet = { } then
                           [ ]
                       else
                           let unit in set unitSet
                           in
                               [ unit ] ^ UnitSetToSequence(unitSet \ { unit })
    measure Card;
    
    private static Card: set of MetroUnit -> nat
                   Card(unitSet) == card unitSet;
    
operations
    public AddUnit: MetroUnit ==> ()
           AddUnit(unit) == units := units munion { unit.GetId() |-> unit }
    pre unit.GetId() not in set dom units and
        (unit.GetLine() <> nil => unit.GetLine() in set rng lines) and
        (unit.GetLocation() <> nil => RemainingCapacityOf(unit.GetLocation()) > 0);
    
    public RemoveUnit: MetroUnit`MetroUnitId ==> ()
           RemoveUnit(unitId) == units := { unitId } <-: units;
    
    public AddLine: MetroLine ==> ()
           AddLine(line) == lines := lines munion { line.name |-> line }
    pre line.name not in set dom lines;
    
    public RemoveLine: MetroLineName ==> ()
           RemoveLine(lineName) == lines := { lineName } <-: lines;
    
    pure
    public IsAnyUnitStuck: () ==> bool
           IsAnyUnitStuck() ==
                return exists u in set rng units &
                           u.IsStuck();
    
    public FindStuckUnit: () ==> MetroUnit
           FindStuckUnit() ==
                let u in set rng units be st u.IsStuck()
                in
                    return u
    pre IsAnyUnitStuck();
    
    public Tick: () ==> ()
           Tick() ==
                def unitsAllowedToRun: set of MetroUnit = UnitsAllowedToRun()
                in
                (
                    for all u in set rng units \ unitsAllowedToRun do
                        u.Stop();
                        
                    for all u in set unitsAllowedToRun do
                        u.Run();
                )
    post forall track in set AllTracks(rng lines) &
             NumberOfEnteringUnitsOn(track) <= RemainingCapacityOf(track);
    
    -- // Track capacities //
    pure 
    private TracksAccommodateAllMetroUnits: () ==> bool
            TracksAccommodateAllMetroUnits() ==
                return forall capacity in set rng RemainingCapacities() &
                           capacity >= 0;
    
    pure
    private RemainingCapacities: () ==> CapacityMap
            RemainingCapacities() == return { track |-> RemainingCapacityOf(track) | track in set AllTracks(rng lines) };
    
    pure 
    private RemainingCapacityOf: Track ==> int
            RemainingCapacityOf(track) ==
                def numberOfUnitsOnTrack: nat = card { unit | unit in set rng units & unit.GetLocation() = track }
                in
                    return track.capacity - numberOfUnitsOnTrack;
    
    pure
    private NumberOfEnteringUnitsOn: Track ==> int
            NumberOfEnteringUnitsOn(track) ==
                return card { unit | unit in set rng units & unit.GetNextLocation() = track and unit.GetState() = <Running> };
    
    -- // Interlocking mechanism //
    private UnitsAllowedToRun: () ==> set of MetroUnit
            UnitsAllowedToRun() ==
            (
                dcl capacities: CapacityMap := RemainingCapacities(),
                    unitsAllowedToRun: set of MetroUnit := { };
                def prioritisedUnits: seq of MetroUnit = PrioritiseUnits(rng units, trackPriorities)
                in
                (
                    for unit in prioritisedUnits do
                    (
                        if MayRun(capacities, unit) then
                        (
                            capacities := Occupied(capacities, unit);
                            unitsAllowedToRun := unitsAllowedToRun union { unit };
                        );
                    );
                    
                    return unitsAllowedToRun;
                );
            );
    
    public PrioritiseUnits: set of MetroUnit * seq of TrackKind ==> seq of MetroUnit 
           PrioritiseUnits(unitsToPrioritise, priorities) ==
                if priorities = [ ] then
                    return [ ]
                else
                    def nextUnits = UnitsOn(unitsToPrioritise, hd priorities);
                        pendingUnits = unitsToPrioritise \ nextUnits
                    in
                        return UnitSetToSequence(nextUnits) ^ PrioritiseUnits(pendingUnits, tl priorities)
    post forall unit in set elems RESULT &
             unit.GetNextLocation() in set AllTracks(rng lines);
    
    private UnitsOn: set of MetroUnit * TrackKind ==> set of MetroUnit
            UnitsOn(unitsToFilter, trackKind) ==
                return { unit | unit in set unitsToFilter & unit.GetLocation() <> nil and unit.GetLocation().kind = trackKind };
    
    private MayRun: CapacityMap * MetroUnit ==> bool
            MayRun(capacities, unit) == return capacities(unit.GetNextLocation()) > 0
    pre unit.GetNextLocation() in set dom capacities;
    
    private Occupied: CapacityMap * MetroUnit ==> CapacityMap
            Occupied(capacities, unit) ==
                def currentRemainingCapacity = capacities(unit.GetNextLocation())
                in
                    return capacities ++ { unit.GetNextLocation() |-> currentRemainingCapacity - 1 }
    pre unit.GetNextLocation() in set dom capacities and
        capacities(unit.GetNextLocation()) > 0;
    
end InterlockingSystem
~~~
{% endraw %}

### UnitTestRunner.vdmpp

{% raw %}
~~~
class UnitTestRunner

operations
    public Execute: () ==> ()
           Execute() ==
                def tests: TestSuite = new TestSuite(new UnitTests());
                    result = new TestResult()
                in
                (
                    tests.run(result);
                    IO`println(result.toString());
                );

end UnitTestRunner
~~~
{% endraw %}

### World.vdmpp

{% raw %}
~~~
class World

values
    private system: InterlockingSystem = new InterlockingSystem();

    private lines: seq of InterlockingSystem`MetroLine =
    [
        LinearLine("Central line", [ Track(1, 0, <Underground>, 2) -- 1
                                   , Track(2, 0, <Underwater>, 1)
                                   , Track(3, 0, <Underwater>, 1)
                                   , Track(4, 0, <Underwater>, 1) -- 2
                                   , Track(5, 0, <Underground>, 2)
                                   , Track(6, 0, <Underground>, 2)
                                   , Track(7, 0, <Underground>, 2) -- 3
                                   , Track(8, 0, <Overground>, 2)
                                   , Track(9, 0, <Overground>, 2)
                                   , Track(9, 1, <Elevated>, 1) ]), -- 4
        
        CircularLine("Circle line", [ Track(4, 1, <Underground>, 1) -- 5
                                    , Track(3, 1, <Underground>, 1)
                                    , Track(2, 1, <Overground>, 1)
                                    , Track(1, 1, <Overground>, 1) -- 6
                                    , Track(1, 0, <Underground>, 2)
                                    , Track(2, 0, <Underwater>, 1)
                                    , Track(3, 0, <Underwater>, 1)
                                    , Track(4, 0, <Underwater>, 1)
                                    , Track(5, 0, <Underground>, 2) -- 7
                                    , Track(5, 1, <Underground>, 1)
                                    , Track(4, 1, <Underground>, 1) ])
    ];
    
    private units: seq of MetroUnit = [ new MetroUnit(mk_token(i)) | i in set { 1, ..., 7 } ];
    
    private stateCharacters: map MetroUnit`MetroUnitState to char = { <Running> |-> 'R', <Stopped> |-> ' ' };
    
functions
    private static Track: nat * nat * InterlockingSystem`TrackKind * nat1 -> InterlockingSystem`Track
                   Track(x, y, kind, capacity) == mk_InterlockingSystem`Track(mk_(x, y), kind, capacity);
    
    private static CircularLine: InterlockingSystem`MetroLineName * seq of InterlockingSystem`Track -> InterlockingSystem`MetroLine
                   CircularLine(name, tracks) == InterlockingSystem`CreateCircularLine(name, tracks);
    
    private static LinearLine: InterlockingSystem`MetroLineName * seq of InterlockingSystem`Track -> InterlockingSystem`MetroLine
                   LinearLine(name, tracks) == InterlockingSystem`CreateLinearLine(name, tracks);
    
operations
    public World: () ==> World
           World() == InitialiseSystem();
    
    private InitialiseSystem: () ==> ()
            InitialiseSystem() ==
            (
                for line in lines do system.AddLine(line);
                for unit in units do system.AddUnit(unit);
                
                units(1).Relocate(lines(1), 1);
                units(2).Relocate(lines(1), 4);
                units(3).Relocate(lines(1), 7);
                units(4).Relocate(lines(1), 10);
                
                units(5).Relocate(lines(2), 1);
                units(6).Relocate(lines(2), 4);
                units(7).Relocate(lines(2), 9);
            );
    
    public Run: nat ==> ()
           Run(stepLimit) ==
                for all step in set { 1, ..., stepLimit } do
                (
                    TickWorld();
                    Print(step);
                );
    
    private TickWorld: () ==> ()
            TickWorld() ==
            (
                system.Tick();
                for unit in units do unit.Tick();
            );
    
    private Pad: seq of char ==> seq of char
            Pad(chars) ==
                if len chars = 1 then
                    return "  " ^ chars
                else if len chars = 2 then
                    return " " ^ chars
                else
                    return chars;
                    
    private Print: nat1 ==> ()
            Print(step) ==
                def stepText = Pad(VDMUtil`val2seq_of_char[nat1](step));
                    states = [ stateCharacters(u.GetState()) | u in seq units ]
                in 
                    IO`println(stepText ^ ": " ^ states);
    
end World
~~~
{% endraw %}

### MetroUnit.vdmpp

{% raw %}
~~~
class MetroUnit

types
    public MetroUnitId = token;
    public MetroUnitState = <Running> | <Stopped>;
    
instance variables
    private id: MetroUnitId;
    private state: MetroUnitState := <Stopped>;
    private line: [InterlockingSystem`MetroLine] := nil;
    private trackIndex: nat1 := 1;
    
    -- The metro unit must be on the tracks.
    inv InterlockingSystem`InRangeOfTracks(line, trackIndex);
    
    private recentStates: seq of MetroUnit`MetroUnitState := [ ];
    
    -- Save states of at most ten time steps.
    inv len recentStates <= 10;
    
operations
    public MetroUnit: MetroUnitId ==> MetroUnit
           MetroUnit(newId) ==
           (
                id := newId;
           );
    
    pure public GetId: () ==> MetroUnitId
           GetId() == return id;
    
    pure
    public GetLine: () ==> [InterlockingSystem`MetroLine]
           GetLine() == return line;
    
    pure
    public GetLocation: () ==> [InterlockingSystem`Track]
           GetLocation() == return InterlockingSystem`TrackAt(line, trackIndex);
    
    pure
    public GetNextLocation: () ==> [InterlockingSystem`Track]
           GetNextLocation() == return InterlockingSystem`TrackAt(line, InterlockingSystem`NextTrackIndex(line, trackIndex));
    
    pure
    public GetState: () ==> MetroUnitState
           GetState() == return state;
    
    pure
    public IsStuck: () ==> bool
           IsStuck() ==
                return recentStates <> [] and
                       not exists s in seq recentStates & s = <Running>;
    
    public Relocate: [InterlockingSystem`MetroLine] * nat1 ==> ()
           Relocate(newLine, startingTrackIndex) ==
                atomic
                (
                    line := newLine;
                    trackIndex := startingTrackIndex;
                )
    pre InterlockingSystem`InRangeOfTracks(newLine, startingTrackIndex);
    
    public Run: () ==> ()
           Run() == state := <Running>;
    
    public Stop: () ==> ()
           Stop() == state := <Stopped>;
    
    public Tick: () ==> ()
           Tick() == 
           (
                Move();
                UpdateRecentStates();
           );
           
    private Move: () ==> ()
            Move() ==
                if state = <Running> then
                    trackIndex := InterlockingSystem`NextTrackIndex(line, trackIndex);
    
    private UpdateRecentStates: () ==> ()
            UpdateRecentStates() ==
                recentStates := (if len recentStates = 10 then
                                     tl recentStates
                                 else recentStates) ^ [ state ]
    post len recentStates <= 10;
    
end MetroUnit
~~~
{% endraw %}

