---
layout: default
title: SAFERProofPP
---

## SAFERProofPP
Author: Sten Agerholm




| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new SAFERSys().BigTest()|
|Entry point     :| new SAFERSys().HugeTest()|


### saferproof.vdmpp

{% raw %}
~~~
class SAFERSys

types

 public SAFER:: clock: nat  -- init s == s = mk_SAFER(0)

functions  -- operations

  ControlCycle: SwitchPositions * HandGripPosition * RotCommand *
                SAFER * AAH -> ThrusterSet * SAFER * AAH
  ControlCycle(mk_SwitchPositions(mode,aah),raw_grip,aah_cmd,
               saferstate,aahstate) ==
    let mk_SAFER(clock) = saferstate,
        grip_cmd  = GripCommand(raw_grip,mode),
        thrusters = 
          SelectedThrusters(grip_cmd,aah_cmd,
            aahstate.active_axes,aahstate.ignore_hcm),
        aahstate' = Transition(aah,grip_cmd,clock,aahstate),
        saferstate' = mu(saferstate,clock|->clock+1)
    in mk_(thrusters,saferstate',aahstate')
  post let mk_(thr,-,-) = RESULT 
       in card thr <= 4 and   
          ThrusterConsistency(thr)

functions

  ThrusterConsistency: set of ThrusterName +> bool
  ThrusterConsistency(thrusters) ==
    not ({<B1>,<F1>} subset thrusters) and 
    not ({<B2>,<F2>} subset thrusters) and 
    not ({<B3>,<F3>} subset thrusters) and 
    not ({<B4>,<F4>} subset thrusters) and 
    not (thrusters inter {<L1R>,<L1F>} <> {} and thrusters inter {<R2R>,<R2F>} <> {}) and
    not (thrusters inter {<L3R>,<L3F>} <> {} and thrusters inter {<R4R>,<R4F>} <> {}) and
    not (thrusters inter {<D1R>,<D1F>} <> {} and thrusters inter {<U3R>,<U3F>} <> {}) and
    not (thrusters inter {<D2R>,<D2F>} <> {} and thrusters inter {<U4R>,<U4F>} <> {}) 


----------------
-- module AUX 
----------------

values

--  arbitrary_value = mk_token(1001);

  axis_command_set : set of AxisCommand = {<Neg>,<Zero>,<Pos>};

  tran_axis_set : set of TranAxis = {<X>,<Y>,<Z>};

 public rot_axis_set : set of RotAxis = {<Roll>,<Pitch>,<Yaw>};

  null_tran_command : TranCommand = {a |-> <Zero> | a in set tran_axis_set};

  null_rot_command : RotCommand = {a |-> <Zero> | a in set rot_axis_set};

  null_six_dof : SixDofCommand 
               = mk_SixDofCommand(null_tran_command,null_rot_command)

types
 
 public AxisCommand = <Neg> | <Zero> | <Pos>;

  TranAxis = <X> | <Y> | <Z>;

 public RotAxis = <Roll> | <Pitch> | <Yaw>;

  TranCommand = map TranAxis to AxisCommand
  inv cmd == dom cmd = tran_axis_set;

 public RotCommand = map RotAxis to AxisCommand
  inv cmd == dom cmd = rot_axis_set;

  SixDofCommand ::
    tran : TranCommand
    rot  : RotCommand

----------------
-- module AAH 
----------------


types
 public AAH:: active_axes : set of RotAxis
        ignore_hcm  : set of RotAxis
        toggle      : EngageState
        timeout     : nat
--  init s == s = mk_AAH({},{},<AAH_off>,0)
         
types

public  EngageState = <AAH_off> | <AAH_started> | <AAH_on> | <pressed_once> |
                <AAH_closing> | <pressed_twice>;

values
  
  click_timeout: nat = 10 -- was 100, changed for test purposes

functions -- operations

  Transition: ControlButton * SixDofCommand * nat * AAH -> AAH
  Transition(button_pos,hcm_cmd,clock,aahstate) ==
    let 
      mk_AAH(active_axes,ignore_hcm,toggle,timeout) = aahstate,
      engage = ButtonTransition(toggle,button_pos,active_axes,clock,timeout),
      starting = (toggle = <AAH_off>) and (engage = <AAH_started>),
      aahstate' = mu(aahstate,
        active_axes|->
          {a | a in set rot_axis_set & 
           starting or 
           (engage <> <AAH_off> and a in set active_axes and
           (hcm_cmd.rot(a) = <Zero> or a in set ignore_hcm))},
        ignore_hcm|->
          {a | a in set rot_axis_set & 
           (starting and hcm_cmd.rot(a) <> <Zero>) or 
           (not starting and a in set ignore_hcm)},
        timeout|->
          if toggle = <AAH_on> and engage = <pressed_once>
          then clock + click_timeout
          else timeout,
       toggle|-> engage)
    in aahstate';
 
functions

  AllAxesOff: set of RotAxis +> bool
  AllAxesOff(active) == active = {};

  ButtonTransition: EngageState * ControlButton * set of RotAxis * 
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

----------------
-- module HCM
----------------

types

 public SwitchPositions ::
    mode: ControlModeSwitch
    aah : ControlButton;

 public ControlModeSwitch = <Rot> | <Tran>;

 public ControlButton = <Up> | <Down>;
  
 public HandGripPosition:: vert  : AxisCommand
                     horiz : AxisCommand
                     trans : AxisCommand
                     twist : AxisCommand

-- add inv to exclude impossible combinations???

functions

  GripCommand: HandGripPosition * ControlModeSwitch +> SixDofCommand
  GripCommand(mk_HandGripPosition(vert,horiz,trans,twist),mode) ==
    let tran = {<X>    |-> horiz,
                <Y>    |-> if mode = <Tran> then trans else <Zero>,
                <Z>    |-> if mode = <Tran> then vert else <Zero>},
        rot  = {<Roll> |-> if mode = <Rot> then vert else <Zero>,
                <Pitch>|-> twist,
                <Yaw>  |->  if mode = <Rot> then twist else <Zero>}
    in
      mk_SixDofCommand(tran,rot)

---------------
-- module TS
---------------

types 

 public ThrusterName = <B1> | <B2> | <B3> | <B4> | <F1> | <F2> | <F3> | <F4> |
                 <L1R>| <L1F>| <R2R>| <R2F>| <L3R>| <L3F>| <R4R>| <R4F>|
                 <D1R>| <D1F>| <D2R>| <D2F>| <U3R>| <U3F>| <U4R>| <U4F>;

 public ThrusterSet = set of ThrusterName

functions

  RotCmdsPresent: RotCommand +> bool 
  RotCmdsPresent(cmd) ==
    exists a in set dom cmd & cmd(a) <> <Zero>;

  PrioritizedTranCmd: TranCommand +> TranCommand
  PrioritizedTranCmd(tran) ==
    if tran(<X>) <> <Zero> 
    then null_tran_command ++ {<X> |-> tran(<X>)}
    elseif tran(<Y>) <> <Zero> 
    then null_tran_command ++ {<Y> |-> tran(<Y>)}
    elseif tran(<Z>) <> <Zero> 
    then null_tran_command ++ {<Z> |-> tran(<Z>)}
    else null_tran_command;

  CombinedRotCmds: RotCommand * RotCommand * set of RotAxis +> RotCommand
  CombinedRotCmds(hcm_rot,aah,ignore_hcm) ==
    let aah_axes = ignore_hcm union 
                   {a | a in set rot_axis_set & hcm_rot(a) = <Zero>}
    in {a |-> aah(a) | a in set aah_axes} munion 
       {a |-> hcm_rot(a) | a in set rot_axis_set\aah_axes};

  IntegratedCommands: SixDofCommand * RotCommand * set of RotAxis * set of RotAxis +> SixDofCommand
  IntegratedCommands(mk_SixDofCommand(tran,rot),aah,active_axes,ignore_hcm) == 
    if AllAxesOff(active_axes) 
    then if RotCmdsPresent(rot) 
         then mk_SixDofCommand(null_tran_command,rot)
         else mk_SixDofCommand(PrioritizedTranCmd(tran),null_rot_command)
    else if RotCmdsPresent(rot) 
         then mk_SixDofCommand(null_tran_command,
                                   CombinedRotCmds(rot,aah,ignore_hcm))
         else mk_SixDofCommand(PrioritizedTranCmd(tran),aah);

  BFThrusters: AxisCommand * AxisCommand * AxisCommand +> 
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

  LRUDThrusters: AxisCommand * AxisCommand * AxisCommand +> 
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

  SelectedThrusters: SixDofCommand * RotCommand * set of RotAxis * set of RotAxis +> ThrusterSet
  SelectedThrusters(hcm,aah,active_axes,ignore_hcm) ==
    let mk_SixDofCommand(tran,rot) = IntegratedCommands(hcm,aah,active_axes,ignore_hcm),
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
    in bf_thr union lrud_thr;

operations

public BigTest: () ==> map (SwitchPositions * HandGripPosition * RotCommand) to (ThrusterSet * SAFER * AAH)
BigTest() ==
  let switch_positions : set of SwitchPositions = {mk_SwitchPositions(mode,aah) | mode in set {<Tran>,<Rot>}, aah in set {<Up>,<Down>}},
      grip_positions : set of HandGripPosition = {mk_HandGripPosition(vert,horiz,trans,twist) |
                                                  vert, horiz, trans, twist in set axis_command_set &
                                                  vert = <Zero> and horiz = <Zero> and trans = <Zero> or 
                                                  vert = <Zero> and horiz = <Zero> and twist = <Zero> or 
                                                  vert = <Zero> and trans = <Zero> and twist = <Zero> or 
                                                  horiz = <Zero> and trans = <Zero> and twist = <Zero>},
      all_rot_commands : set of RotCommand = {{<Roll> |-> a, <Pitch> |-> b, <Yaw> |-> c} | a, b, c in set axis_command_set},     
      safer : SAFER = mk_SAFER(0),
      aah : AAH = mk_AAH({},{},<AAH_off>,0)
  in 
    (return {mk_(switch,grip,aah_law) |-> ControlCycle(switch,grip,aah_law,safer,aah) |
             switch in set switch_positions, 
             grip in set grip_positions, 
             aah_law in set all_rot_commands}
    );

public HugeTest: () ==> map (SwitchPositions * HandGripPosition * RotCommand) to (ThrusterSet * SAFER * AAH)
HugeTest() == 
  let switch_positions : set of SwitchPositions = {mk_SwitchPositions(mode,aah) | mode in set {<Tran>,<Rot>}, aah in set {<Up>,<Down>}},
      all_grip_positions : set of HandGripPosition = {mk_HandGripPosition(vert,horiz,trans,twist) | 
                                                  vert, horiz, trans, twist in set axis_command_set},
      all_rot_commands : set of RotCommand = {{<Roll> |-> a, <Pitch> |-> b, <Yaw> |-> c} | a, b, c in set axis_command_set},     
      safer : SAFER = mk_SAFER(0),
      aah : AAH = mk_AAH({},{},<AAH_off>,0) 
  in
    (return {mk_(switch,grip,aah_law) |-> ControlCycle(switch,grip,aah_law,safer,aah) |
             switch in set switch_positions, 
             grip in set all_grip_positions, 
             aah_law in set all_rot_commands}
    );

end SAFERSys
~~~
{% endraw %}

