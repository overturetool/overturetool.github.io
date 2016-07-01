---
layout: default
title: SAFERSL
---

## SAFERSL
Author: Sten Agerholm and Peter Gorm Larsen


This VDM-SL model is a response to the PVS model of the SAFER system
for NASA austronauts used for space walks used to maneuver back to a
space shuttle. It was made by Sten Agerholm and Peter Gorm Larsen and
published as:

S.Agerholm and P.G.Larsen, Modeling and Validating SAFER in VDM-SL, 
Proceedings of the Fourth NASA Langley Formal Methods Workshop, 
NASA Conference, Publication 3356, September 1997.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| TEST`HugeTest()|


### aah.vdmsl

{% raw %}
~~~
              


module AAH

imports from AUX all,
        from HCM all

exports all

definitions

state AAH of 
      active_axes : set of AUX`RotAxis
      ignore_hcm  : set of AUX`RotAxis
      toggle      : EngageState
      timeout     : nat
init s ==
  s = mk_AAH({},{},<AAH_off>,0)
end      
         
types

  EngageState = <AAH_off> | <AAH_started> | <AAH_on> | <pressed_once> |
                <AAH_closing> | <pressed_twice>;

values
  
  click_timeout: nat = 10 -- was 100, changed for test purposes

operations

  Transition: HCM`ControlButton * AUX`SixDofCommand * nat ==> ()
  Transition(button_pos,hcm_cmd,clock) ==
    let 
      engage = ButtonTransition(toggle,button_pos,active_axes,clock,timeout),
      starting = (toggle = <AAH_off>) and (engage = <AAH_started>)
    in
      (active_axes:= {a | a in set AUX`rot_axis_set & 
                          starting or 
                          (engage <> <AAH_off> and a in set active_axes and
                           (hcm_cmd.rot(a) = <Zero> or a in set ignore_hcm))};
       ignore_hcm:= {a | a in set AUX`rot_axis_set & 
                         (starting and hcm_cmd.rot(a) <> <Zero>) or 
                         (not starting and a in set ignore_hcm)};
       timeout:= if toggle = <AAH_on> and engage = <pressed_once>
                 then clock + click_timeout
                 else timeout;
       toggle:= engage);

  ActiveAxes: () ==> set of AUX`RotAxis
  ActiveAxes() == return active_axes;

  IgnoreHcm: () ==> set of AUX`RotAxis
  IgnoreHcm() == return ignore_hcm;

  Toggle: () ==> EngageState
  Toggle() == return toggle

functions

  AllAxesOff: set of AUX`RotAxis +> bool
  AllAxesOff(active) == active = {};

  ButtonTransition: EngageState * HCM`ControlButton * set of AUX`RotAxis * 
                    nat * nat +> EngageState
  ButtonTransition(estate,button,active,clock,timeout) ==
    cases mk_(estate,button) :
      mk_(<AAH_off>,<Up>)         -> <AAH_off>,
      mk_(<AAH_off>,<Down>)       -> <AAH_started>,
      mk_(<AAH_started>,<Up>)     -> <AAH_on>,
      mk_(<AAH_started>,<Down>)   -> <AAH_started>,
      mk_(<AAH_on>,<Up>)          -> if AllAxesOff(active)
                                     then <AAH_off>
                                     else <AAH_on>,
      mk_(<AAH_on>,<Down>)        -> <pressed_once>,
      mk_(<pressed_once>,<Up>)    -> <AAH_closing>,
      mk_(<pressed_once>,<Down>)  -> <pressed_once>,
      mk_(<AAH_closing>,<Up>)     -> if AllAxesOff(active)
                                     then <AAH_off>
                                     elseif clock > timeout
                                     then <AAH_on>
                                     else <AAH_closing>,
      mk_(<AAH_closing>,<Down>)   -> <pressed_twice>,
      mk_(<pressed_twice>,<Up>)   -> <AAH_off>,
      mk_(<pressed_twice>,<Down>) -> <pressed_twice>
    end;

end AAH

             
~~~
{% endraw %}

### auxilary.vdmsl

{% raw %}
~~~
              
module AUX 

exports all

definitions

values

  arbitrary_value = mk_token(1001);

  axis_command_set : set of AxisCommand = {<Neg>,<Zero>,<Pos>};

  tran_axis_set : set of TranAxis = {<X>,<Y>,<Z>};

  rot_axis_set : set of RotAxis = {<Roll>,<Pitch>,<Yaw>};

  null_tran_command : TranCommand = {a |-> <Zero> | a in set tran_axis_set};

  null_rot_command : RotCommand = {a |-> <Zero> | a in set rot_axis_set};

  null_six_dof : SixDofCommand 
               = mk_SixDofCommand(null_tran_command,null_rot_command)

types
 
  AxisCommand = <Neg> | <Zero> | <Pos>;

  TranAxis = <X> | <Y> | <Z>;

  RotAxis = <Roll> | <Pitch> | <Yaw>;

  TranCommand = map TranAxis to AxisCommand
  inv cmd == dom cmd = tran_axis_set;

  RotCommand = map RotAxis to AxisCommand
  inv cmd == dom cmd = rot_axis_set;

  SixDofCommand ::
    tran : TranCommand
    rot  : RotCommand

end AUX

             
~~~
{% endraw %}

### geom.vdmsl

{% raw %}
~~~
dlmodule GEOM

exports
  
  operations
    InitGeom : () ==> ();
    ShowThrust : seq of seq of char ==> ();
  
  
  uselib
    "geom_lib.so"

end GEOM
~~~
{% endraw %}

### gui.vdmsl

{% raw %}
~~~
              
dlmodule GUI

  exports
    operations
      GetCommand : () ==> seq of seq of char;
      GUI_Init_Tcl : () ==>()

  uselib
    "my_gui.so"

end GUI
              
~~~
{% endraw %}

### hcm.vdmsl

{% raw %}
~~~
               

module HCM

imports from AUX all

exports all

definitions

types

  SwitchPositions ::
    mode: ControlModeSwitch
    aah : ControlButton;

  ControlModeSwitch = <Rot> | <Tran>;

  ControlButton = <Up> | <Down>;
  
  HandGripPosition:: vert  : AUX`AxisCommand
                     horiz : AUX`AxisCommand
                     trans : AUX`AxisCommand
                     twist : AUX`AxisCommand

-- add inv to exclude impossible combinations???

functions

  GripCommand: HandGripPosition * ControlModeSwitch +> AUX`SixDofCommand
  GripCommand(mk_HandGripPosition(vert,horiz,trans,twist),mode) ==
    let tran = {<X>    |-> horiz,
                <Y>    |-> if mode = <Tran> then trans else <Zero>,
                <Z>    |-> if mode = <Tran> then vert else <Zero>},
        rot  = {<Roll> |-> if mode = <Rot> then vert else <Zero>,
                <Pitch>|-> twist,
                <Yaw>  |->  if mode = <Rot> then trans else <Zero>}
    in
      mk_AUX`SixDofCommand(tran,rot)

end HCM

             
~~~
{% endraw %}

### safer.vdmsl

{% raw %}
~~~
              


module SAFER

imports from AUX all,
        from HCM all,
        from TS all,
        from AAH all


exports all

definitions

state SAFER of
  clock      : nat
init s == 
  s = mk_SAFER(0)
end

operations

  ControlCycle: HCM`SwitchPositions * HCM`HandGripPosition * AUX`RotCommand ==> 
                TS`ThrusterSet
  ControlCycle(mk_HCM`SwitchPositions(mode,aah),raw_grip,aah_cmd) ==
    let grip_cmd  = HCM`GripCommand(raw_grip,mode),
        thrusters = TS`SelectedThrusters(grip_cmd,aah_cmd,AAH`ActiveAxes(),
                                         AAH`IgnoreHcm())
    in
       (AAH`Transition(aah,grip_cmd,clock);
        clock := clock + 1;
        return thrusters)
  post card RESULT <= 4 and 
       ThrusterConsistency(RESULT)

functions

  ThrusterConsistency: set of TS`ThrusterName +> bool
  ThrusterConsistency(thrusters) ==
    not ({<B1>,<F1>} subset thrusters) and 
    not ({<B2>,<F2>} subset thrusters) and 
    not ({<B3>,<F3>} subset thrusters) and 
    not ({<B4>,<F4>} subset thrusters) and 
    not (thrusters inter {<L1R>,<L1F>} <> {} and 
    thrusters inter {<R2R>,<R2F>} <> {}) and
    not (thrusters inter {<L3R>,<L3F>} <> {} and 
    thrusters inter {<R4R>,<R4F>} <> {}) and
    not (thrusters inter {<D1R>,<D1F>} <> {} and 
    thrusters inter {<U3R>,<U3F>} <> {}) and
    not (thrusters inter {<D2R>,<D2F>} <> {} and 
    thrusters inter {<U4R>,<U4F>} <> {}) 


end SAFER

             
~~~
{% endraw %}

### test.vdmsl

{% raw %}
~~~
              

module TEST

imports from SAFER all,
        from HCM all,
        from TS all,
        from AUX all,
	from GEOM
	  operations
    InitGeom : () ==> ();
    ShowThrust : seq of seq of char ==> (),
  


   from GUI 

    operations
      GetCommand : ()  ==> seq of seq of char; 
      GUI_Init_Tcl : () ==> ()

  exports all

definitions

values 

  switches_tran_up = mk_HCM`SwitchPositions(<Tran>,<Up>);

  switch_positions : set of HCM`SwitchPositions = 
    {mk_HCM`SwitchPositions(mode,aah) | 
       mode in set {<Tran>,<Rot>}, aah in set {<Up>,<Down>}};

  zero_grip : HCM`HandGripPosition = mk_HCM`HandGripPosition(<Zero>,<Zero>,
                                                             <Zero>,<Zero>);

  all_grip_positions : set of HCM`HandGripPosition =
    {mk_HCM`HandGripPosition(vert,horiz,trans,twist) |
     vert, horiz, trans, twist in set AUX`axis_command_set};

  all_rot_commands : set of AUX`RotCommand =
    {{<Roll> |-> a, <Pitch> |-> b, <Yaw> |-> c} |
     a, b, c in set AUX`axis_command_set};

  grip_positions : set of HCM`HandGripPosition 
    =
    {mk_HCM`HandGripPosition(vert,horiz,trans,twist) |
     vert, horiz, trans, twist in set AUX`axis_command_set &
     vert = <Zero> and horiz = <Zero> and trans = <Zero> or 
     vert = <Zero> and horiz = <Zero> and twist = <Zero> or 
     vert = <Zero> and trans = <Zero> and twist = <Zero> or 
     horiz = <Zero> and trans = <Zero> and twist = <Zero>};

  possibilities -- total of 972 cases
    : set of (HCM`SwitchPositions * HCM`HandGripPosition * AUX`RotCommand)
    = 
    {mk_(switch,grip,aah_law) |
       switch in set switch_positions, grip in set grip_positions, 
       aah_law in set all_rot_commands}
  
functions

  BigTest: () -> 
    map (HCM`SwitchPositions * HCM`HandGripPosition * AUX`RotCommand) to 
        TS`ThrusterSet 
  BigTest() == 
    {mk_(switch,grip,aah_law) |-> SAFER`ControlCycle(switch,grip,aah_law) |
     switch in set switch_positions, grip in set grip_positions, 
     aah_law in set all_rot_commands};

   HugeTest: () -> 
     map (HCM`SwitchPositions * HCM`HandGripPosition * AUX`RotCommand) to 
         TS`ThrusterSet 
   HugeTest() == 
   {mk_(switch,grip,aah_law) |-> SAFER`ControlCycle(switch,grip,aah_law) |
    switch in set switch_positions, grip in set all_grip_positions, 
    aah_law in set all_rot_commands};

  ConvertAxisCmd: seq of char -> AUX`AxisCommand
  ConvertAxisCmd(str) ==
    cases str:
      "neg" -> <Neg>,
      "pos" -> <Pos>,
      "zero" -> <Zero>,
      others -> undefined
    end;

  ConvertTIds: TS`ThrusterSet +> seq of seq of char
  ConvertTIds(ts) ==
    if ts = {}
    then []
    else let t in set ts
         in
	   [ConvertTId(t)]^ ConvertTIds(ts\{t});

  ConvertTId: TS`ThrusterName +> seq of char
  ConvertTId(tnm) ==
    cases tnm:
       <B1>  -> "B1",
       <B2>  -> "B2",
       <B3>  -> "B3",
       <B4>  -> "B4",
       <F1>  -> "F1",
       <F2>  -> "F2",
       <F3>  -> "F3",
       <F4>  -> "F4",
       <L1R> -> "L1R",
       <L1F> -> "L1F",
       <R2R> -> "R2R",
       <R2F> -> "R2F",
       <L3R> -> "L3R",
       <L3F> -> "L3F",
       <R4R> -> "R4R",
       <R4F> -> "R4F",
       <D1R> -> "D1R",
       <D1F> -> "D1F",
       <D2R> -> "D2R",
       <D2F> -> "D2F",
       <U3R> -> "U3R",
       <U3F> -> "U3F",
       <U4R> -> "U4R",
       <U4F> -> "U4F"
     end;
     
operations
  
  StartTest: () ==> ()
  StartTest() == ( GUI`GUI_Init_Tcl();
                   GEOM`InitGeom() );

  RunTest: () ==> bool
  RunTest() ==
   let cl = GUI`GetCommand()
   in
     if cl = []
     then return false
     else let [mode,aah,horiz,trans,vert,twist,roll,pitch,yaw] = cl,
              ts = SAFER`ControlCycle(
                    mk_HCM`SwitchPositions(
                     if mode = "translation" then <Tran> else <Rot>,
                     if aah = "1" then <Up> else <Down> ),
                   mk_HCM`HandGripPosition(ConvertAxisCmd(vert),
                                           ConvertAxisCmd(horiz),
                      ConvertAxisCmd(trans),ConvertAxisCmd(twist)),
                   {<Roll> |-> ConvertAxisCmd(roll), 
                    <Pitch> |-> ConvertAxisCmd(pitch),
                    <Yaw> |-> ConvertAxisCmd(yaw)})
	 in
	   (GEOM`ShowThrust(ConvertTIds(ts));
            return true );
    

  Loop : () ==> ()
  Loop() ==
  (
    StartTest();
    while RunTest() do skip;
    GEOM`ShowThrust(["stop"])
  );

  Move: () ==> ()
  Move() ==
   GEOM`ShowThrust(["move"]);

  NoMove: () ==> ()
  NoMove() ==
   GEOM`ShowThrust(["nomove"]);


end TEST

                                                                                                     
~~~
{% endraw %}

### ts.vdmsl

{% raw %}
~~~
              


module TS

imports from AUX all,
        from AAH all

exports all

definitions

types 

  ThrusterName = <B1> | <B2> | <B3> | <B4> | <F1> | <F2> | <F3> | <F4> |
                 <L1R>| <L1F>| <R2R>| <R2F>| <L3R>| <L3F>| <R4R>| <R4F>|
                 <D1R>| <D1F>| <D2R>| <D2F>| <U3R>| <U3F>| <U4R>| <U4F>;

  ThrusterSet = set of ThrusterName

functions

  RotCmdsPresent: AUX`RotCommand +> bool 
  RotCmdsPresent(cmd) ==
    exists a in set dom cmd & cmd(a) <> <Zero>;

  PrioritizedTranCmd: AUX`TranCommand +> AUX`TranCommand
  PrioritizedTranCmd(tran) ==
    if tran(<X>) <> <Zero> 
    then AUX`null_tran_command ++ {<X> |-> tran(<X>)}
    elseif tran(<Y>) <> <Zero> 
    then AUX`null_tran_command ++ {<Y> |-> tran(<Y>)}
    elseif tran(<Z>) <> <Zero> 
    then AUX`null_tran_command ++ {<Z> |-> tran(<Z>)}
    else AUX`null_tran_command;

  CombinedRotCmds: AUX`RotCommand * AUX`RotCommand * set of AUX`RotAxis +> 
                   AUX`RotCommand
  CombinedRotCmds(hcm_rot,aah,ignore_hcm) ==
    let aah_axes = ignore_hcm union 
                   {a | a in set AUX`rot_axis_set & hcm_rot(a) = <Zero>}
    in {a |-> aah(a) | a in set aah_axes} munion 
       {a |-> hcm_rot(a) | a in set AUX`rot_axis_set\aah_axes};

  IntegratedCommands: AUX`SixDofCommand * AUX`RotCommand * 
                      set of AUX`RotAxis * set of AUX`RotAxis +> 
                      AUX`SixDofCommand
  IntegratedCommands(mk_AUX`SixDofCommand(tran,rot),aah,
                     active_axes,ignore_hcm) == 
    if AAH`AllAxesOff(active_axes) 
    then if RotCmdsPresent(rot) 
         then mk_AUX`SixDofCommand(AUX`null_tran_command,rot)
         else mk_AUX`SixDofCommand(PrioritizedTranCmd(tran),
                                   AUX`null_rot_command)
    else if RotCmdsPresent(rot) 
         then mk_AUX`SixDofCommand(AUX`null_tran_command,
                                   CombinedRotCmds(rot,aah,ignore_hcm))
         else mk_AUX`SixDofCommand(PrioritizedTranCmd(tran),aah);

  BFThrusters: AUX`AxisCommand * AUX`AxisCommand * AUX`AxisCommand +> 
    ThrusterSet * ThrusterSet 
  BFThrusters(A,B,C) == 
    cases mk_(A,B,C) :
      mk_(<Neg>,<Neg>,<Neg>) -> mk_({<B4>},{<B2>,<B3>}),
      mk_(<Neg>,<Neg>,<Zero>) -> mk_({<B3>,<B4>},{}),
      mk_(<Neg>,<Neg>,<Pos>) -> mk_({<B3>},{<B1>,<B4>}),
--
      mk_(<Neg>,<Zero>,<Neg>) -> mk_({<B2>,<B4>},{}),
      mk_(<Neg>,<Zero>,<Zero>) -> mk_({<B1>,<B4>},{<B2>,<B3>}),
      mk_(<Neg>,<Zero>,<Pos>) -> mk_({<B1>,<B3>},{}),
----
      mk_(<Neg>,<Pos>,<Neg>) -> mk_({<B2>},{<B1>,<B4>}),
      mk_(<Neg>,<Pos>,<Zero>) -> mk_({<B1>,<B2>},{}),
      mk_(<Neg>,<Pos>,<Pos>) -> mk_({<B1>},{<B2>,<B3>}),
------
      mk_(<Zero>,<Neg>,<Neg>) -> mk_({<B4>,<F1>},{}),
      mk_(<Zero>,<Neg>,<Zero>) -> mk_({<B4>,<F2>},{}),
      mk_(<Zero>,<Neg>,<Pos>) -> mk_({<B3>,<F2>},{}),
--
      mk_(<Zero>,<Zero>,<Neg>) -> mk_({<B2>,<F1>},{}),
      mk_(<Zero>,<Zero>,<Zero>) -> mk_({},{}),
      mk_(<Zero>,<Zero>,<Pos>) -> mk_({<B3>,<F4>},{}),
----
      mk_(<Zero>,<Pos>,<Neg>) -> mk_({<B2>,<F3>},{}),
      mk_(<Zero>,<Pos>,<Zero>) -> mk_({<B1>,<F3>},{}),
      mk_(<Zero>,<Pos>,<Pos>) -> mk_({<B1>,<F4>},{}),
------
      mk_(<Pos>,<Neg>,<Neg>) -> mk_({<F1>},{<F2>,<F3>}),
      mk_(<Pos>,<Neg>,<Zero>) -> mk_({<F1>,<F2>},{}),
      mk_(<Pos>,<Neg>,<Pos>) -> mk_({<F2>},{<F1>,<F4>}),
--
      mk_(<Pos>,<Zero>,<Neg>) -> mk_({<F1>,<F3>},{}),
      mk_(<Pos>,<Zero>,<Zero>) -> mk_({<F2>,<F3>},{<F1>,<F4>}),
      mk_(<Pos>,<Zero>,<Pos>) -> mk_({<F2>,<F4>},{}),
----
      mk_(<Pos>,<Pos>,<Neg>) -> mk_({<F3>},{<F1>,<F4>}),
      mk_(<Pos>,<Pos>,<Zero>) -> mk_({<F3>,<F4>},{}),
      mk_(<Pos>,<Pos>,<Pos>) -> mk_({<F4>},{<F2>,<F3>})
    end;

  LRUDThrusters: AUX`AxisCommand * AUX`AxisCommand * AUX`AxisCommand +> 
    ThrusterSet * ThrusterSet 
  LRUDThrusters(A,B,C) == 
    cases mk_(A,B,C) :
      mk_(<Neg>,<Neg>,<Neg>) -> mk_({},{}),
      mk_(<Neg>,<Neg>,<Zero>) -> mk_({},{}),
      mk_(<Neg>,<Neg>,<Pos>) -> mk_({},{}),
--
      mk_(<Neg>,<Zero>,<Neg>) -> mk_({<L1R>},{<L1F>,<L3F>}),
      mk_(<Neg>,<Zero>,<Zero>) -> mk_({<L1R>,<L3R>},{<L1F>,<L3F>}),
      mk_(<Neg>,<Zero>,<Pos>) -> mk_({<L3R>},{<L1F>,<L3F>}),
----
      mk_(<Neg>,<Pos>,<Neg>) -> mk_({},{}),
      mk_(<Neg>,<Pos>,<Zero>) -> mk_({},{}),
      mk_(<Neg>,<Pos>,<Pos>) -> mk_({},{}),
------
      mk_(<Zero>,<Neg>,<Neg>) -> mk_({<U3R>},{<U3F>,<U4F>}),
      mk_(<Zero>,<Neg>,<Zero>) -> mk_({<U3R>,<U4R>},{<U3F>,<U4F>}),
      mk_(<Zero>,<Neg>,<Pos>) -> mk_({<U4R>},{<U3F>,<U4F>}),
--
      mk_(<Zero>,<Zero>,<Neg>) -> mk_({<L1R>,<R4R>},{}),
      mk_(<Zero>,<Zero>,<Zero>) -> mk_({},{}),
      mk_(<Zero>,<Zero>,<Pos>) -> mk_({<R2R>,<L3R>},{}),
----
      mk_(<Zero>,<Pos>,<Neg>) -> mk_({<D2R>},{<D1F>,<D2F>}),
      mk_(<Zero>,<Pos>,<Zero>) -> mk_({<D1R>,<D2R>},{<D1F>,<D2F>}),
      mk_(<Zero>,<Pos>,<Pos>) -> mk_({<D1R>},{<D1F>,<D2F>}),
------
      mk_(<Pos>,<Neg>,<Neg>) -> mk_({},{}),
      mk_(<Pos>,<Neg>,<Zero>) -> mk_({},{}),
      mk_(<Pos>,<Neg>,<Pos>) -> mk_({},{}),
--
      mk_(<Pos>,<Zero>,<Neg>) -> mk_({<R4R>},{<R2F>,<R4F>}),
      mk_(<Pos>,<Zero>,<Zero>) -> mk_({<R2R>,<R4R>},{<R2F>,<R4F>}),
      mk_(<Pos>,<Zero>,<Pos>) -> mk_({<R2R>},{<R2F>,<R4F>}),
----
      mk_(<Pos>,<Pos>,<Neg>) -> mk_({},{}),
      mk_(<Pos>,<Pos>,<Zero>) -> mk_({},{}),
      mk_(<Pos>,<Pos>,<Pos>) -> mk_({},{})
    end;

  SelectedThrusters: AUX`SixDofCommand * AUX`RotCommand * set of AUX`RotAxis * 
                     set of AUX`RotAxis +> ThrusterSet
  SelectedThrusters(hcm,aah,active_axes,ignore_hcm) ==
    let mk_AUX`SixDofCommand(tran,rot) = 
        IntegratedCommands(hcm,aah,active_axes,ignore_hcm),
        mk_(bf_mandatory,bf_optional) = 
               BFThrusters(tran(<X>),rot(<Pitch>),rot(<Yaw>)),
        mk_(lrud_mandatory,lrud_optional) = 
               LRUDThrusters(tran(<Y>),tran(<Z>),rot(<Roll>)),
        bf_thr = if rot(<Roll>) = <Zero> 
                 then bf_optional union bf_mandatory
                 else bf_mandatory,
        lrud_thr = if rot(<Pitch>) = <Zero> and rot(<Yaw>) = <Zero> 
                   then lrud_optional union lrud_mandatory
                   else lrud_mandatory
    in bf_thr union lrud_thr

end TS


             
~~~
{% endraw %}

### workspace.vdmsl

{% raw %}
~~~
module WorkSpace

imports from SAFER all,
        from HCM all,
        from TS all,
        from AUX all

exports all

definitions

types 

Input = seq of nat
inv inp == len inp = 9;

ThrusterMatrix = seq of seq of bool
inv tm == len tm = 4 and forall i in set inds tm & len tm(i) = 6

functions

RunControlCycle: Input -> ThrusterMatrix
RunControlCycle (input) ==
  let mk_(swpos, hgpos, rcom) = TransformInput (input) in
  let ts = SAFER`ControlCycle (swpos, hgpos, rcom) in
  GenerateThrusterMatrix (ts);

TransformInput: Input -> HCM`SwitchPositions * HCM`HandGripPosition * 
                         AUX`RotCommand
TransformInput (input) ==
  let [mode,aah,horiz,trans,vert,twist,roll,pitch,yaw] = input in
  let swpos = mk_HCM`SwitchPositions(
                     if mode = 1 then <Tran> else <Rot>,
                     if aah = 0 then <Up> else <Down> ),
      hgpos = mk_HCM`HandGripPosition(
                     ConvertAxisCmd(vert),
                     ConvertAxisCmd(horiz),
                     ConvertAxisCmd(trans),
                     ConvertAxisCmd(twist) ),
      rcom  = { <Roll> |-> ConvertAxisCmd(roll), 
                <Pitch> |-> ConvertAxisCmd(pitch),
                <Yaw> |-> ConvertAxisCmd(yaw) } in
  mk_(swpos, hgpos, rcom);

ConvertAxisCmd: nat -> AUX`AxisCommand
ConvertAxisCmd(n) ==
  cases n:
    0 -> <Neg>,
    1 -> <Pos>,
    2 -> <Zero>,
    others -> undefined
  end;

GenerateThrusterMatrix: TS`ThrusterSet +> ThrusterMatrix
GenerateThrusterMatrix (ts) ==
  let tson = { GenerateThrusterLabel (t) | t in set ts } in
  [ [ mk_(j,i) in set tson | i in set {1,...,6} ]
    | j in set {1,...,4} ];

GenerateThrusterLabel: TS`ThrusterName +> nat * nat
GenerateThrusterLabel (tnm) ==
  cases tnm:
     <B1>  -> mk_(1,4),
     <B2>  -> mk_(2,4),
     <B3>  -> mk_(4,4),
     <B4>  -> mk_(3,4),
     <F1>  -> mk_(1,1),
     <F2>  -> mk_(2,1),
     <F3>  -> mk_(4,1),
     <F4>  -> mk_(3,1),
     <L1R> -> mk_(1,2),
     <L1F> -> mk_(1,3),
     <R2R> -> mk_(2,2),
     <R2F> -> mk_(2,3),
     <L3R> -> mk_(4,2),
     <L3F> -> mk_(4,3),
     <R4R> -> mk_(3,2),
     <R4F> -> mk_(3,3),
     <D1R> -> mk_(1,6),
     <D1F> -> mk_(1,5),
     <D2R> -> mk_(2,6),
     <D2F> -> mk_(2,5),
     <U3R> -> mk_(4,6),
     <U3F> -> mk_(4,5),
     <U4R> -> mk_(3,6),
     <U4F> -> mk_(3,5)
   end;

values

switchpos = mk_HCM`SwitchPositions (<Tran>,<Down>);
handgrippos = mk_HCM`HandGripPosition (<Zero>,<Pos>,<Zero>,<Zero>);
rotcomm = { <Roll> |-> <Zero>, <Pitch> |-> <Zero>, <Yaw> |-> <Zero> }

end WorkSpace
~~~
{% endraw %}

