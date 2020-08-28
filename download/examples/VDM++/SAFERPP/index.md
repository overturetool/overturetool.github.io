---
layout: default
title: SAFERPP
---

## SAFERPP
Author: Sten Agerholm and Peter Gorm Larsen


This specification is a VDM++ model of the SAFER 
(Simplified Aid for EVA Rescue) example presented in 
the second volume of the NASA guidebook on formal 
methods. 

Here Appendix C contains a complete listing of the 
SAFER system using PVS. We have translated this PVS 
specification rather directly into VDM-SL previously 
and here that model is again moved to VDM++. In the 
VDM++ model we have abstracted away form a number of 
parts which has been left as uninterpreted functions 
in the PVS model. This has been done because we have 
defined the purpose of the model to clarify the 
functionality of the thruster selection logic and the 
protocol for the automatic attitude hold functionality. 
Otherwise we have on purpose varied as little as 
possible from the given PVS model. In order to 
visualise this example the dynamic link feature is 
illustrated as well. In the test class Test there are 
a few examples of using the traces primitives used for 
test automation. 

More explanation about this work can be found in the papers: 
 *Sten Agerholm and Peter Gorm Larsen, Modeling and 
  Validating SAFER in VDM-SL, ed: Michael Holloway, 
  in "Fourth NASA Langley Formal Methods Workshop", 
  NASA, September 1997. 
 *Sten Agerholm and Wendy Schafer, Analyzing SAFER using 
  UML and VDM++, ed: John Fitzgerald and Peter Gorm Larsen, 
  in "VDM Workshop at the Formal Methods 1999 conference, 
  Toulouse 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new Test().BigTest()|


### IntegratedCommand.vdmpp

{% raw %}
~~~
                                                 
class IntegratedCommand is subclass of SixDOfCommand

instance variables
  aah : AAH;

operations
  public
  SetAAHLink : AAH ==> ()
  SetAAHLink(a) == 
    aah := a;

  public
  IntegrateCmds : () ==> ()
  IntegrateCmds() ==
    if aah.AllAxesOff()
    then (if rotcmd.RotCmdsPresent()
          then trancmd.SuppressAllAxes() 
          else trancmd.Prioritize())
    else (if rotcmd.RotCmdsPresent()
          then (trancmd.SuppressAllAxes();
                CombineRotCmds())
          else (trancmd.Prioritize();
                rotcmd.SetAxesdir(aah.GetRotcmd())));

  CombineRotCmds : () ==> ()
  CombineRotCmds() ==
    let aah_axes = 
          aah.GetIgnore_hcm() union 
           {a | a in set Command`allaxes & rotcmd.GetAxesdir()(a) = <Zero>} 
    in rotcmd.SetAxesdir
         ({a |-> aah.GetRotcmd()(a) | a in set aah_axes} munion 
          {a |-> rotcmd.GetAxesdir()(a) | a in set Command`allaxes\aah_axes});


end IntegratedCommand
                                                                                                                                            
~~~
{% endraw %}

### HandControlUnit.vdmpp

{% raw %}
~~~
                                               
class HandControlUnit

types
  public Button = <Up> | <Down>;
  public Mode = <Tran> | <Rot>;

instance variables
  x : Command`Direction;
  pitch : Command`Direction;
  yaw_y : Command`Direction;
  roll_z : Command`Direction;
  aahbutton : Button;
  modeswitch : Mode;


operations
  public
  SetAAH : Button ==> ()
  SetAAH(aahbuttonarg) ==
    aahbutton := aahbuttonarg;

  public
  ReadAAH : () ==> Button
  ReadAAH() ==
    return aahbutton;

  public
  SetGrip : Command`Direction * Command`Direction * Command`Direction *
            Command`Direction ==> ()
  SetGrip(xarg, pitcharg, yaw_yarg, roll_zarg) ==
    (x := xarg;
     pitch := pitcharg;
     yaw_y := yaw_yarg;
     roll_z := roll_zarg);

  public
  SetMode : Mode ==> ()
  SetMode(m) ==
    modeswitch := m;

  public
  ReadGrip : () ==> Command`Direction * Command`Direction * 
                    Command`Direction * Command`Direction * Mode
  ReadGrip() ==
    return mk_(x, pitch, yaw_y, roll_z, modeswitch);


end HandControlUnit
                                                                                                                                       
~~~
{% endraw %}

### Test.vdmpp

{% raw %}
~~~
                                    
class Test is subclass of WorkSpace
 
values
  DirectionSet : set of Command`Direction = {<Neg>, <Pos>, <Zero>};
  ModeSet : set of HandControlUnit`Mode = {<Tran>, <Rot>};
  AAHButtonSet : set of HandControlUnit`Button = {<Up>, <Down>};
  RotCmdSet : set of Command`AxisMap =
    {{<axis1> |-> a, <axis2> |-> b, <axis3> |-> c} 
    | a,b,c in set {<Zero>,<Pos>,<Neg>}}

instance variables

  w : WorkSpace := new WorkSpace();

operations
  public BigTest: () ==> nat 
  BigTest() ==
    (SetupTopology();
     return
     (card dom 
      {mk_(x, pitch, yaw_y, roll_z, modeswitch, <Up>) |-> 
       ControlCycle(x, pitch, yaw_y, roll_z, modeswitch, <Up>,
                    Command`nullaxesdir) 
      | x, pitch, yaw_y, roll_z in set DirectionSet, 
        modeswitch in set ModeSet}));

  public HugeTest: () ==> nat
  HugeTest() ==
    (SetupTopology();
     return
     (card dom
     {mk_(x, pitch, yaw_y, roll_z, modeswitch, aahbutton, aahcmd) |-> 
       ControlCycle(x, pitch, yaw_y, roll_z, modeswitch, aahbutton,
                    aahcmd) 
     | x, pitch, yaw_y, roll_z in set DirectionSet, 
       modeswitch in set ModeSet, aahbutton in set AAHButtonSet,
       aahcmd in set RotCmdSet}));
 
traces
 
BT : w.SetupTopology(); let x, pitch, yaw_y, roll_z in set DirectionSet in 
                     let modeswitch in set ModeSet in
                     w.ControlCycle(x, pitch, yaw_y, roll_z, modeswitch, <Up>,
                                    Command`nullaxesdir)
                                    
HT: w.SetupTopology();
    let x, pitch, yaw_y, roll_z in set DirectionSet in 
    let modeswitch in set ModeSet in
    let aahbutton in set AAHButtonSet in
    let aahcmd in set RotCmdSet in
     w.ControlCycle(x, pitch, yaw_y, roll_z, modeswitch, aahbutton, aahcmd) 

end Test
                                                                                                                   
~~~
{% endraw %}

### Command.vdmpp

{% raw %}
~~~
                                       
class Command
types
  public
  Axis = <axis1> | <axis2> | <axis3>;
  
  public
  Direction = <Neg> | <Pos> | <Zero>;

  public
  AxisMap = map Axis to Direction
  inv dir == dom dir = {<axis1>, <axis2>, <axis3>};

values
  public allaxes : set of Axis = {<axis1>, <axis2>, <axis3>};
  public X = <axis1>;
  public Y = <axis2>;
  public Z = <axis3>;
  public PITCH = <axis1>;
  public YAW = <axis2>;
  public ROLL = <axis3>;
  public nullaxesdir : AxisMap = {a |-> <Zero> | a in set allaxes};

instance variables
  protected axesdir : AxisMap := nullaxesdir;

operations
  public
  GetAxesdir : () ==> AxisMap
  GetAxesdir() ==
    return axesdir;

  public
  SetAxesdir : AxisMap ==> ()
  SetAxesdir(a) == 
    axesdir := a;

  public
  GetDirection : Axis ==> Direction
  GetDirection(a) == 
    return axesdir(a);

  public
  SetDirection : Axis * Direction ==> ()
  SetDirection(a, d) ==
    axesdir := axesdir ++ {a |-> d};

  public
  SuppressAllAxes : () ==> ()
  SuppressAllAxes() ==
    axesdir := nullaxesdir;


end Command
                                                                                                                       
~~~
{% endraw %}

### ThrusterSelectionTable.vdmpp

{% raw %}
~~~
                                                 
class ThrusterSelectionTable 

types
  public
  ThrSelMap = map (Command`Direction * Command`Direction * 
                   Command`Direction) 
              to ThrusterControl`ThrSel;

instance variables
  selections : ThrSelMap := {|->};


operations
  public
  Lookup : Command`Direction * Command`Direction * Command`Direction ==> 
           ThrusterControl`ThrSel
  Lookup(dir1, dir2, dir3) ==
    return selections(mk_(dir1, dir2, dir3));

  public
  MakeTable : ThrSelMap ==> ()
  MakeTable(m) ==
    selections:= m;

end ThrusterSelectionTable
                                                                                                                                                      
~~~
{% endraw %}

### WorkSpace.vdmpp

{% raw %}
~~~
                                         
class WorkSpace 

values
  check : bool = true;

instance variables
  hcu: HandControlUnit := new HandControlUnit();
  aah: AAH := new AAH();
  intcmd: IntegratedCommand := new IntegratedCommand();
  thrcontrol: ThrusterControl := new ThrusterControl();
  vda: ValveDriveAssembly := new ValveDriveAssembly();
  clock: Clock := new Clock();

operations
  public
  SetupTopology() ==
    (aah.SetHCULink(hcu);
     aah.SetSixDOfLink(intcmd);
     aah.SetClockLink(clock);
     intcmd.SetHCULink(hcu);
     intcmd.SetAAHLink(aah);
     thrcontrol.SetIntCmdLink(intcmd);
     thrcontrol.SetVDALink(vda));
  
  public
  ControlCycle : Command`Direction * Command`Direction * Command`Direction * 
                 Command`Direction * 
                 HandControlUnit`Mode * HandControlUnit`Button * 
                 Command`AxisMap ==>
                 set of ThrusterControl`ThrusterPosition
  ControlCycle(x,pitch,yaw_y,roll_z,modeswitch,aahbutton,aahcmd) ==
    (clock.IncrTime();
     hcu.SetAAH(aahbutton);
     hcu.SetGrip(x, pitch, yaw_y, roll_z);
     hcu.SetMode(modeswitch);
     aah.SetRotcmd(aahcmd);
     intcmd.ConvertGrip();
     aah.Update();
     intcmd.IntegrateCmds();
     thrcontrol.SelectThrusters();
     thrcontrol.SignalThrusters();
     vda.ThrustersOn())
  post card RESULT <= 4 and ThrusterConsistency(RESULT);

  pure ThrusterConsistency : set of ThrusterControl`ThrusterPosition ==> bool 
  ThrusterConsistency(thrusters) ==
    return 
    (not({<B1>, <F1>} subset thrusters) and
     not({<B2>, <F2>} subset thrusters) and
     not({<B3>, <F3>} subset thrusters) and
     not({<B4>, <F4>} subset thrusters) and
     not(thrusters inter {<L1R>, <L1F>} <> {} and
       thrusters inter {<R2R>, <R2F>} <> {}) and
     not(thrusters inter {<L3R>, <L3F>} <> {} and 
       thrusters inter {<R4R>, <R4F>} <> {}) and
     not(thrusters inter {<D1R>, <D1F>} <> {} and
       thrusters inter {<U3R>, <U3F>} <> {}) and
     not(thrusters inter {<D2R>, <D2F>} <> {} and 
       thrusters inter {<U4R>, <U4F>} <> {}));
  
end WorkSpace
                                                                                                                             
~~~
{% endraw %}

### SixDOfCommand.vdmpp

{% raw %}
~~~
                                             
class SixDOfCommand
instance variables
  protected
  hcu : HandControlUnit;
  protected
  rotcmd : RotationCommand := new RotationCommand();
  protected
  trancmd : TranslationCommand := new TranslationCommand();

operations
  public
  GetCommand : () ==> Command`AxisMap * Command`AxisMap
  GetCommand() ==
    return(mk_(trancmd.GetAxesdir(), rotcmd.GetAxesdir()));

  public
  SetHCULink : HandControlUnit ==> ()
  SetHCULink(h) ==
    hcu := h;

  public
  ConvertGrip : () ==> ()
  ConvertGrip() ==
    let mk_(x, pitch, yaw_y, roll_z, modeswitch) = hcu.ReadGrip(),
        tran = {Command`X |-> x,
                Command`Y |-> if modeswitch = <Tran> 
                              then yaw_y else <Zero>,
                Command`Z |-> if modeswitch = <Tran> 
                              then roll_z else <Zero>},
        rot = {Command`ROLL |-> if modeswitch = <Rot> 
                                then roll_z else <Zero>,
               Command`PITCH |->pitch,
               Command`YAW |-> if modeswitch = <Rot> 
                               then yaw_y else <Zero>}
    in (trancmd.SetAxesdir(tran);
        rotcmd.SetAxesdir(rot));

-- Alternative formulation of ConvertGrip
--    let mk_(x, pitch, yaw_y, roll_z, modeswitch) = hcu.ReadGrip(),
--    in (trancmd.SuppressAllAxes();
--        rotcmd.SuppressAllAxes();
--        trancmd.SetDirection(Command`X, x);
--        rotcmd.SetDirection(Command`PITCH, pitch);
--        if modeswitch = <Tran> 
--        then (trancmd.SetDirection(Command`Y, yaw_y);
--              trancmd.SetDirection(Command`Z, roll_z))
--        else (rotcmd.SetDirection(Command`YAW, yaw_y);
--               rotcmd.SetDirection(Command`ROLL, roll_z)));


end SixDOfCommand
                                                                                                                                    
~~~
{% endraw %}

### RotationCommand.vdmpp

{% raw %}
~~~
                                               
class RotationCommand is subclass of Command
operations
  public
  RotCmdsPresent : () ==> bool
  RotCmdsPresent() ==
    return (exists a in set dom axesdir & axesdir(a) <> <Zero>);

end RotationCommand
                                                                                                                                        
~~~
{% endraw %}

### ValveDriveAssembly.vdmpp

{% raw %}
~~~
                                                  
class ValveDriveAssembly

instance variables
  thrusters : map ThrusterControl`ThrusterPosition to Thruster := 
    {thr |-> new Thruster() | thr in set ThrusterControl`ThrusterSet};

operations
  public
  UpdateThrusters : set of ThrusterControl`ThrusterPosition ==> ()
  UpdateThrusters(selected) ==
    (for all a in set selected
     do thrusters(a).SetOn(); 
     for all a in set ThrusterControl`ThrusterSet\selected 
     do thrusters(a).SetOff());  
   
  public
  ThrustersOn : () ==> set of ThrusterControl`ThrusterPosition
  ThrustersOn() == 
    return {thr | thr in set ThrusterControl`ThrusterSet & 
            thrusters(thr).GetState() = <On>}

end ValveDriveAssembly
                                                                                                                                              
~~~
{% endraw %}

### ThrusterControl.vdmpp

{% raw %}
~~~
                                               
class ThrusterControl

values  -- two thruster selection tables...
  bf_thrusters : ThrusterSelectionTable`ThrSelMap = {|->};

  bf_thrusters1 : ThrusterSelectionTable`ThrSelMap = 
     {mk_(<Neg>, <Neg>, <Neg>) |-> mk_ThrSel({<B4>}, {<B2>, <B3>}),
      mk_(<Neg>,<Neg>,<Zero>) |-> mk_ThrSel({<B3>,<B4>},{}),
      mk_(<Neg>,<Neg>,<Pos>) |-> mk_ThrSel({<B3>},{<B1>,<B4>}),
--
      mk_(<Neg>,<Zero>,<Neg>) |-> mk_ThrSel({<B2>,<B4>},{}),
      mk_(<Neg>,<Zero>,<Zero>) |-> mk_ThrSel({<B1>,<B4>},{<B2>,<B3>}),
      mk_(<Neg>,<Zero>,<Pos>) |-> mk_ThrSel({<B1>,<B3>},{}),
----
      mk_(<Neg>,<Pos>,<Neg>) |-> mk_ThrSel({<B2>},{<B1>,<B4>}),
      mk_(<Neg>,<Pos>,<Zero>) |-> mk_ThrSel({<B1>,<B2>},{}),
      mk_(<Neg>,<Pos>,<Pos>) |-> mk_ThrSel({<B1>},{<B2>,<B3>}),
------
      mk_(<Zero>,<Neg>,<Neg>) |-> mk_ThrSel({<B4>,<F1>},{}),
      mk_(<Zero>,<Neg>,<Zero>) |-> mk_ThrSel({<B4>,<F2>},{}),
      mk_(<Zero>,<Neg>,<Pos>) |-> mk_ThrSel({<B3>,<F2>},{}),
--
      mk_(<Zero>,<Zero>,<Neg>) |-> mk_ThrSel({<B2>,<F1>},{}),
      mk_(<Zero>,<Zero>,<Zero>) |-> mk_ThrSel({},{}),
      mk_(<Zero>,<Zero>,<Pos>) |-> mk_ThrSel({<B3>,<F4>},{}),
----
      mk_(<Zero>,<Pos>,<Neg>) |-> mk_ThrSel({<B2>,<F3>},{}),
      mk_(<Zero>,<Pos>,<Zero>) |-> mk_ThrSel({<B1>,<F3>},{}),
      mk_(<Zero>,<Pos>,<Pos>) |-> mk_ThrSel({<B1>,<F4>},{}),
------
      mk_(<Pos>,<Neg>,<Neg>) |-> mk_ThrSel({<F1>},{<F2>,<F3>}),
      mk_(<Pos>,<Neg>,<Zero>) |-> mk_ThrSel({<F1>,<F2>},{}),
      mk_(<Pos>,<Neg>,<Pos>) |-> mk_ThrSel({<F2>},{<F1>,<F4>}),
--
      mk_(<Pos>,<Zero>,<Neg>) |-> mk_ThrSel({<F1>,<F3>},{}),
      mk_(<Pos>,<Zero>,<Zero>) |-> mk_ThrSel({<F2>,<F3>},{<F1>,<F4>}),
      mk_(<Pos>,<Zero>,<Pos>) |-> mk_ThrSel({<F2>,<F4>},{}),
----
      mk_(<Pos>,<Pos>,<Neg>) |-> mk_ThrSel({<F3>},{<F1>,<F4>}),
      mk_(<Pos>,<Pos>,<Zero>) |-> mk_ThrSel({<F3>,<F4>},{}),
      mk_(<Pos>,<Pos>,<Pos>) |-> mk_ThrSel({<F4>},{<F2>,<F3>})};

  lrud_thrusters : ThrusterSelectionTable`ThrSelMap = {|->};

  lrud_thrusters1 : ThrusterSelectionTable`ThrSelMap =
     {mk_(<Neg>,<Neg>,<Neg>) |-> mk_ThrSel({},{}),
      mk_(<Neg>,<Neg>,<Zero>) |-> mk_ThrSel({},{}),
      mk_(<Neg>,<Neg>,<Pos>) |-> mk_ThrSel({},{}),
--
      mk_(<Neg>,<Zero>,<Neg>) |-> mk_ThrSel({<L1R>},{<L1F>,<L3F>}),
      mk_(<Neg>,<Zero>,<Zero>) |-> mk_ThrSel({<L1R>,<L3R>},{<L1F>,<L3F>}),
      mk_(<Neg>,<Zero>,<Pos>) |-> mk_ThrSel({<L3R>},{<L1F>,<L3F>}),
----
      mk_(<Neg>,<Pos>,<Neg>) |-> mk_ThrSel({},{}),
      mk_(<Neg>,<Pos>,<Zero>) |-> mk_ThrSel({},{}),
      mk_(<Neg>,<Pos>,<Pos>) |-> mk_ThrSel({},{}),
------
      mk_(<Zero>,<Neg>,<Neg>) |-> mk_ThrSel({<U3R>},{<U3F>,<U4F>}),
      mk_(<Zero>,<Neg>,<Zero>) |-> mk_ThrSel({<U3R>,<U4R>},{<U3F>,<U4F>}),
      mk_(<Zero>,<Neg>,<Pos>) |-> mk_ThrSel({<U4R>},{<U3F>,<U4F>}),
--
      mk_(<Zero>,<Zero>,<Neg>) |-> mk_ThrSel({<L1R>,<R4R>},{}),
      mk_(<Zero>,<Zero>,<Zero>) |-> mk_ThrSel({},{}),
      mk_(<Zero>,<Zero>,<Pos>) |-> mk_ThrSel({<R2R>,<L3R>},{}),
----
      mk_(<Zero>,<Pos>,<Neg>) |-> mk_ThrSel({<D2R>},{<D1F>,<D2F>}),
      mk_(<Zero>,<Pos>,<Zero>) |-> mk_ThrSel({<D1R>,<D2R>},{<D1F>,<D2F>}),
      mk_(<Zero>,<Pos>,<Pos>) |-> mk_ThrSel({<D1R>},{<D1F>,<D2F>}),
------
      mk_(<Pos>,<Neg>,<Neg>) |-> mk_ThrSel({},{}),
      mk_(<Pos>,<Neg>,<Zero>) |-> mk_ThrSel({},{}),
      mk_(<Pos>,<Neg>,<Pos>) |-> mk_ThrSel({},{}),
--
      mk_(<Pos>,<Zero>,<Neg>) |-> mk_ThrSel({<R4R>},{<R2F>,<R4F>}),
      mk_(<Pos>,<Zero>,<Zero>) |-> mk_ThrSel({<R2R>,<R4R>},{<R2F>,<R4F>}),
      mk_(<Pos>,<Zero>,<Pos>) |-> mk_ThrSel({<R2R>},{<R2F>,<R4F>}),
----
      mk_(<Pos>,<Pos>,<Neg>) |-> mk_ThrSel({},{}),
      mk_(<Pos>,<Pos>,<Zero>) |-> mk_ThrSel({},{}),
      mk_(<Pos>,<Pos>,<Pos>) |-> mk_ThrSel({},{})};
 
  public ThrusterSet : set of ThrusterPosition = 
    {<B1>, <B2>, <B3>, <B4>, <F1>, <F2>, <F3>, <F4>, <L1R>, <L1F>, <R2R>, 
     <R2F>, <L3R>, <L3F>, <R4R>, <R4F>, <D1R>, <D1F>, <D2R>, <D2F>, <U3R>, 
     <U3F>, <U4R>, <U4F>};

types
  public
  ThrusterPosition = <B1> | <B2> | <B3> | <B4> | <F1> | <F2> | <F3> | <F4> |
                     <L1R>| <L1F>| <R2R>| <R2F>| <L3R>| <L3F>| <R4R>| <R4F>|
                     <D1R>| <D1F>| <D2R>| <D2F>| <U3R>| <U3F>| <U4R>| <U4F>;

  public
  ThrSel :: always_on : set of ThrusterPosition
            optional : set of ThrusterPosition;

instance variables
  vda : ValveDriveAssembly;
  intcmd : IntegratedCommand;
  selected : set of ThrusterPosition := {};
  tslogic1 : ThrusterSelectionTable := InitTable(bf_thrusters1);
  tslogic2 : ThrusterSelectionTable := InitTable(lrud_thrusters1);
--  tslogic1 : ThrusterSelectionTable := new ThrusterSelectionTable();
--  tslogic2 : ThrusterSelectionTable := new ThrusterSelectionTable();

operations

  public
  InitTable : ThrusterSelectionTable`ThrSelMap ==> 
              ThrusterSelectionTable
  InitTable(table) == 
    (dcl tmp:ThrusterSelectionTable := new ThrusterSelectionTable(); 
     tmp.MakeTable(table); return tmp);

  PrintSelected : () ==> set of ThrusterPosition
  PrintSelected() ==
    return selected;

  public
  SetIntCmdLink : IntegratedCommand ==> ()
  SetIntCmdLink(i) ==
    intcmd := i;

  public
  SetVDALink : ValveDriveAssembly ==> ()
  SetVDALink(v) == 
    vda := v;  

  public
  SelectThrusters : () ==> ()
  SelectThrusters() ==
    let mk_(tran, rot) = intcmd.GetCommand(),
        lookup1 =  tslogic1.Lookup(tran(Command`X), rot(Command`PITCH),
                                   rot(Command`YAW)),
        lookup2 = tslogic2.Lookup(tran(Command`Y), tran(Command`Z), 
                                  rot(Command`ROLL)),
        bf_thr = if rot(Command`ROLL) = <Zero> 
                 then lookup1.always_on union lookup1.optional
                 else lookup1.always_on,
        lrud_thr = if rot(Command`PITCH) = <Zero> and 
                      rot(Command`YAW) = <Zero> 
                   then lookup2.optional union lookup2.always_on
                   else lookup2.always_on
     in selected := bf_thr union lrud_thr;

  public
  SignalThrusters : () ==> ()
  SignalThrusters() ==
    vda.UpdateThrusters(selected);

  InitializeTables : () ==> ()
  InitializeTables() ==
    (tslogic1.MakeTable(bf_thrusters); 
     tslogic2.MakeTable(lrud_thrusters));

end ThrusterControl
                                                                                                                                        
~~~
{% endraw %}

### AAH.vdmpp

{% raw %}
~~~
                                   
class AAH
 
types
  public
  EngageState = <AAH_off> | <AAH_started> | <AAH_on> | <pressed_once> |
                <AAH_closing> | <pressed_twice>;

values
  click_timeout : nat = 10;

instance variables
  hcu : HandControlUnit;
  clock : Clock;
  rotcmd : RotationCommand := new RotationCommand();
  toggle : EngageState := <AAH_off>;
  gripcmd : SixDOfCommand;
  timeout : nat := 0;
  ignore_hcm_rot : set of Command`Axis := {};
  active_rot_axes : set of Command`Axis := {};

operations
  public
  Update : () ==> ()
  Update() ==
    let engage = ButtonTransition(hcu.ReadAAH(), clock.ReadTime()),
        starting = (toggle = <AAH_off>) and (engage = <AAH_started>),
        mk_(-, rot) = gripcmd.GetCommand() 
    in (active_rot_axes := {a | a in set Command`allaxes & starting or 
                            (engage <> <AAH_off> and 
                               a in set active_rot_axes and
                            (rot(a) = <Zero> or 
                             a in set ignore_hcm_rot))};
        ignore_hcm_rot := {a | a in set Command`allaxes & 
                           (starting and rot(a) <> <Zero>) or 
                           (not starting and a in set ignore_hcm_rot)};
        timeout := if toggle = <AAH_on> and engage = <pressed_once>
                    then clock.ReadTime() + click_timeout
                    else timeout;
        toggle := engage);

  public
  GetRotcmd : () ==> Command`AxisMap
  GetRotcmd() ==
    return rotcmd.GetAxesdir();

  public
  SetRotcmd : Command`AxisMap ==> ()
  SetRotcmd(m) ==
    rotcmd.SetAxesdir(m);

  public
  AllAxesOff : () ==> bool
  AllAxesOff() ==
    return (active_rot_axes = {});

  public
  SetHCULink : HandControlUnit ==> ()
  SetHCULink(h) ==
    hcu := h;

  public
  SetClockLink : Clock ==> ()
  SetClockLink(c) ==
    clock := c;

  public
  GetIgnore_hcm : () ==> set of Command`Axis
  GetIgnore_hcm() ==
    return ignore_hcm_rot;

  public
  SetSixDOfLink : SixDOfCommand ==> ()
  SetSixDOfLink(s) ==
    gripcmd := s;

  public
  GetActive_axes : () ==> set of Command`Axis
  GetActive_axes() ==
    return active_rot_axes;

  ButtonTransition : HandControlUnit`Button * nat ==> EngageState
  ButtonTransition(button_pos, count) ==
    return 
      (cases mk_(toggle,button_pos) :
         mk_(<AAH_off>,<Up>)         -> <AAH_off>,
         mk_(<AAH_off>,<Down>)       -> <AAH_started>,
         mk_(<AAH_started>,<Up>)     -> <AAH_on>,
         mk_(<AAH_started>,<Down>)   -> <AAH_started>,
         mk_(<AAH_on>,<Up>)          -> if AllAxesOff()
                                        then <AAH_off>
                                        else <AAH_on>,
         mk_(<AAH_on>,<Down>)        -> <pressed_once>,
         mk_(<pressed_once>,<Up>)    -> <AAH_closing>,
         mk_(<pressed_once>,<Down>)  -> <pressed_once>,
         mk_(<AAH_closing>,<Up>)     -> if AllAxesOff()
                                        then <AAH_off>
                                        elseif count > timeout
                                        then <AAH_on>
                                        else <AAH_closing>,
         mk_(<AAH_closing>,<Down>)   -> <pressed_twice>,
         mk_(<pressed_twice>,<Up>)   -> <AAH_off>,
         mk_(<pressed_twice>,<Down>) -> <pressed_twice>
       end);

end AAH
                                                                                                                
~~~
{% endraw %}

### Thruster.vdmpp

{% raw %}
~~~
                                        
class Thruster

types
  public On_Off = <On> | <Off>;

instance variables
  state : On_Off := <Off>;

 
operations
  public
  SetOn : () ==> ()
  SetOn() ==
    state := <On>;

  public
  SetOff : () ==> ()
  SetOff() ==
    state := <Off>;

  public
  GetState : () ==> On_Off
  GetState() ==
    return state;

end Thruster
                                                                                                                          
~~~
{% endraw %}

### TranslationCommand.vdmpp

{% raw %}
~~~
                                                  
class TranslationCommand is subclass of Command
operations
  public
  Prioritize : () ==> ()
  Prioritize() ==
    axesdir := if axesdir(X) <> <Zero> 
               then axesdir ++ {Y |-> <Zero>, Z |-> <Zero>}
               elseif axesdir(Y) <> <Zero> 
               then axesdir ++ {Z |-> <Zero>}
               else axesdir;

end TranslationCommand
                                                                                                                                              
~~~
{% endraw %}

### Interface.vdmpp

{% raw %}
~~~
                                         
class Interface

instance variables
  ws : WorkSpace := new WorkSpace() 

types 

public
Input = seq of nat
inv inp == len inp = 9;

public
ThrusterMatrix = seq of seq of bool
inv tm == len tm = 4 and forall i in set inds tm & len tm(i) = 6

operations

public
SetupTopology: () ==> ()
SetupTopology () ==
  ws.SetupTopology();

public
RunControlCycle: Input ==> ThrusterMatrix
RunControlCycle (inp) ==
  let mk_(x,p,y,z,m,ab,ah) = TransformInput (inp) in
  let ts = ws.ControlCycle (x,p,y,z,m,ab,ah) in
  return GenerateThrusterMatrix (ts);

functions

TransformInput: Input -> Command`Direction * Command`Direction *
                 Command`Direction * Command`Direction * 
                 HandControlUnit`Mode * HandControlUnit`Button * 
                 Command`AxisMap 
TransformInput (inp) ==
  let [mode,aah,horiz,trans,vert,twist,roll,pitch,yaw] = inp in
   mk_( ConvertAxisCmd(horiz), 
	  ConvertAxisCmd(twist),
	  ConvertAxisCmd(trans),
	  ConvertAxisCmd(vert),
	  if mode = 1 then <Tran> else <Rot>,
	  if aah = 0 then <Up> else <Down>,
	  { <axis3> |-> ConvertAxisCmd(roll), 
    	    <axis1> |-> ConvertAxisCmd(pitch),
     	    <axis2> |-> ConvertAxisCmd(yaw) } );

ConvertAxisCmd: nat -> Command`Direction
ConvertAxisCmd(n) ==
  cases n:
    0 -> <Neg>,
    1 -> <Pos>,
    2 -> <Zero>,
    others -> undefined
  end;

GenerateThrusterMatrix: set of ThrusterControl`ThrusterPosition +> 
                        ThrusterMatrix
GenerateThrusterMatrix (ts) ==
  let tson = { GenerateThrusterLabel (t) | t in set ts } in
  [ [ mk_(j,i) in set tson | i in set {1,...,6} ]
    | j in set {1,...,4} ];

GenerateThrusterLabel: ThrusterControl`ThrusterPosition +> nat * nat
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

thrusters = mk_(<Pos>,<Zero>,<Zero>,<Zero>,<Tran>,<Down>,
                { <Roll> |-> <Zero>, <Pitch> |-> <Zero>, <Yaw> |-> <Zero> })

end Interface
                                                              
~~~
{% endraw %}

### Clock.vdmpp

{% raw %}
~~~
                                     
class Clock
 
instance variables
  count : nat := 0;

operations
  public
  SetTime : nat ==> ()
  SetTime(t) ==
    count := t;

  public
  IncrTime : () ==> ()
  IncrTime() ==
    count := count + 1;

  public
  ReadTime : () ==> nat
  ReadTime() ==
    return count;

end Clock
                                                                                                                   
~~~
{% endraw %}

