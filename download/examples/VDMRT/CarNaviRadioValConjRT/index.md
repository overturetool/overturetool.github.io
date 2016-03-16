---
layout: default
title: CarNaviRadioValConjRT
---

## CarNaviRadioValConjRT
Author: Marcel Verhoef



This example is a modified version of the car radio navigation example. It demonstrates the use of validation conjectures.

The origin of the car radio navigation example comes from Marcel Verhoef as a part of his PhD thesis where it was used to compare different formalisms. This example shows how an embedded application with both radio, navigation and traffic messages are joined in one
coherent application in a distributed application.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new Testing().Test()|


### Navigation.vdmrt

{% raw %}
~~~
class Navigation

operations
  async 
  public DatabaseLookup: () ==> ()
  DatabaseLookup () ==
    ( cycles (5E6) skip;
      --duration (5E6) skip;
      RadNavSys`mmi.UpdateScreen(2) );

  async 
  public DecodeTMC: () ==> ()
  DecodeTMC () ==
    ( cycles (5E5) skip;
      --duration (5E6) skip;
      RadNavSys`mmi.UpdateScreen(3) )

end Navigation
~~~
{% endraw %}

### mmi.vdmrt

{% raw %}
~~~
class MMI

operations
  async 
  public HandleKeyPress: nat ==> ()
  HandleKeyPress (pn) ==
    ( cycles (1E5) skip;
      --duration (1E5) skip;
      cases (pn):
        1 -> RadNavSys`radio.AdjustVolumeUp(),
        2 -> RadNavSys`radio.AdjustVolumeDown(),
        3 -> RadNavSys`navigation.DatabaseLookup()
      end ); 

  async 
  public UpdateScreen: nat ==> ()
  UpdateScreen (pn) ==
    ( cycles (5E5) skip;
      --duration (5E5) skip;
      cases (pn):
        1 -> IO`println("Screen Update: Volume Knob"),
        2 -> IO`println("Screen Update: InsertAddress"), --World`envTasks("InsertAddress").HandleEvent(pno),
        3 -> IO`println("Screen Update: TransmitTMC") -- World`envTasks("TransmitTMC").HandleEvent(pno)
      end )

end MMI
~~~
{% endraw %}

### World.vdmrt

{% raw %}
~~~
class World
 
types
  public perfdata = nat * nat * real

instance variables
 

operations
  	
  public RunScenario1 : () ==> ()
  RunScenario1 () ==
    ( RadNavSys`mmi.HandleKeyPress(1);
      RadNavSys`mmi.HandleKeyPress(1);
      RadNavSys`mmi.HandleKeyPress(1);
    );

 

end World
~~~
{% endraw %}

### Test.vdmrt

{% raw %}
~~~
class Testing

operations
  public Test: () ==> ()
  Test () ==
  (
    new World().RunScenario1();
		start(self);
    block();
  );


  private block : () ==> ()
  block () == skip;

  private op : () ==> ()
  op () == skip;

sync

per block => time > 5000000


thread

  periodic(1000E6,0,0,0)(op)

end Testing

~~~
{% endraw %}

### Radio.vdmrt

{% raw %}
~~~
class Radio

values 
  public MAX : nat = 10;

instance variables
  public volume : nat := 0;

operations

  async public AdjustVolumeUp : () ==> ()
  AdjustVolumeUp () ==
	( cycles (1E6) skip;
    if volume < MAX
    then ( volume := volume + 1;		   
           RadNavSys`mmi.UpdateScreen(1))
    );

  async public AdjustVolumeDown : () ==> ()
  AdjustVolumeDown () ==
    ( cycles (1E6) skip;
    if volume > 0
    then ( volume := volume - 1;       
           RadNavSys`mmi.UpdateScreen(1))
    );

  async public HandleTMC: () ==> ()
  HandleTMC () ==
    ( cycles (1E6) skip;
      RadNavSys`navigation.DecodeTMC() 
    );

end Radio
~~~
{% endraw %}

### RadNavSys.vdmrt

{% raw %}
~~~
system RadNavSys
instance variables
  -- create application tasks
  static public mmi : MMI := new MMI();
  static public radio : Radio := new Radio();
  static public navigation : Navigation := new Navigation();
  
  -- create CPUs (policy, capacity)
  CPU1 : CPU := new CPU (<FP>, 22E6);
  CPU2 : CPU := new CPU (<FP>, 11E6);
  CPU3 : CPU := new CPU (<FP>, 113E6);

  -- create a bus (policy, capacity, topology)
  BUS1 : BUS := new BUS (<CSMACD>, 72E3, {CPU1, CPU2, CPU3})

operations
  public RadNavSys: () ==> RadNavSys
  RadNavSys () ==
    ( -- deploy mmi on CPU1
      CPU1.deploy(mmi,"MMIT");
      CPU1.setPriority(MMI`HandleKeyPress,100);
      CPU1.setPriority(MMI`UpdateScreen,90);
      -- deploy radio on CPU2
      CPU2.deploy(radio,"RadioT");
      CPU2.setPriority(Radio`AdjustVolumeUp,100);
      CPU2.setPriority(Radio`AdjustVolumeDown,100);
      CPU2.setPriority(Radio`HandleTMC,90);
      -- deploy navigation on CPU3
      CPU3.deploy(navigation,"NavT");
      CPU3.setPriority(Navigation`DatabaseLookup, 100);
      CPU3.setPriority(Navigation`DecodeTMC, 90)
      -- starting the CPUs and BUS is implicit
    );
    
/* timing invariants
separate(#fin(MMI`UpdateScreen), #fin(MMI`UpdateScreen), 500 ms);
*/

end RadNavSys
~~~
{% endraw %}

