---
layout: default
title: ProductLinePP
---

## ProductLinePP
Author: Naoyasu Ubayashi, Shin Nakajima and Masayuki Hirayama




| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new UserTest().test()|


### CONTEXT-atmospheric-air-pressureplace-high.vdmpp

{% raw %}
~~~
class HighAtmosphericAirPressure is subclass of AtmosphericAirPressure

instance variables
  inv
    atm > 1

end HighAtmosphericAirPressure
~~~
{% endraw %}

### SYSTEM-HW-thermistor.vdmpp

{% raw %}
~~~
class Thermistor

instance variables
  realworld_liquid : Liquid;

operations
  public
  Setup: RealWorld1 | RealWorld2 ==> ()
  Setup(realworld) ==
    realworld_liquid := realworld.liquid;

  public
  GetTemperature: () ==> real
  GetTemperature() ==
    return realworld_liquid.GetTemperature();

end Thermistor
~~~
{% endraw %}

### SYSTEM-SW-controller.vdmpp

{% raw %}
~~~
class Software

instance variables
  heater : Heater;
  thermistor : Thermistor;
  liquid_level_sensor : LiquidLevelSensor;

operations
  public
  Setup: RealWorld1 | RealWorld2 ==> ()
  Setup(realworld) ==
    (heater := new Heater();
     heater.Setup(realworld);
     thermistor := new Thermistor();
     thermistor.Setup(realworld);
     liquid_level_sensor := new LiquidLevelSensor();
     liquid_level_sensor.Setup(realworld);
     );

  public
  Boil: () ==> ()
  Boil() ==
    while thermistor.GetTemperature() < 100.0 and
          liquid_level_sensor.IsOn()
      do
        heater.On()
  pre  liquid_level_sensor.IsOn()
  post not liquid_level_sensor.IsOn();

end Software
~~~
{% endraw %}

### CONTEXT-atmospheric-air-pressureplace.vdmpp

{% raw %}
~~~
class AtmosphericAirPressure

types
  Atmosphere = real;

instance variables
  protected atm : real := 0.9;

operations
  pure public
  GetAtm: () ==> real
  GetAtm() == return atm;

  public
  SetAtm: real ==> ()
  SetAtm(a) ==
    atm := a;

end AtmosphericAirPressure
~~~
{% endraw %}

### SYSTEM-HW-liquid-level-sensor.vdmpp

{% raw %}
~~~
class LiquidLevelSensor

instance variables
  realworld_liquid : Liquid;

operations
  public
  Setup: RealWorld1 | RealWorld2 ==> ()
  Setup(realworld) ==
    realworld_liquid := realworld.liquid;

  pure public
  IsOn: () ==> bool
  IsOn() ==
    return realworld_liquid.GetAmount() > 0;

end LiquidLevelSensor
~~~
{% endraw %}

### CONTEXT-liquid-water.vdmpp

{% raw %}
~~~
class Water is subclass of Liquid

operations
  public
  SetBoilingPoint: () ==> ()
  SetBoilingPoint() ==
    boiling_point := {1.0  |-> 100.0,  --- 1atm   (=760mmHg) --> 100
                      0.53 |-> 85.0};  --- 0.53atm(=400mmHg) --> 85

end Water
~~~
{% endraw %}

### SYSTEM-HW-heater.vdmpp

{% raw %}
~~~
class Heater

types
  Switch = <On> | <Off>;

instance variables
  sw : Switch;
  realworld_liquid : Liquid;

operations
  public Setup: RealWorld1 | RealWorld2 ==> ()
  Setup(realworld) ==
    realworld_liquid := realworld.liquid;

  public On: () ==> ()
  On() ==
   (sw := <On>;
    realworld_liquid.AddTemperature());

  public Off: () ==> ()
  Off() ==
    sw := <Off>;

end Heater
~~~
{% endraw %}

### CONTEXT-liquid.vdmpp

{% raw %}
~~~
class Liquid

instance variables
  protected aap : AtmosphericAirPressure;      -- static property
  protected boiling_point : map real to real;  -- static property
  protected temperature : real;                -- dynamic property
  protected amount : real;                     -- dynamic property

operations
  public
  GetAap: () ==> AtmosphericAirPressure
  GetAap() ==
    return aap;

  public
  SetAap: AtmosphericAirPressure ==> ()
  SetAap(a) ==
    aap := a;

  public
  GetBoilingPoint: real ==> real
  GetBoilingPoint(atm) ==
    return boiling_point(atm)
  pre atm in set dom boiling_point;

  public
  GetTemperature: () ==> real
  GetTemperature() ==
    return temperature;

  public
  SetTemperature: real ==> ()
  SetTemperature(t) ==
    temperature := t;

  public
  AddTemperature: () ==> ()
  AddTemperature() ==
    if temperature < boiling_point(aap.GetAtm())
      then
        temperature := temperature + 1.0
      else
       (temperature := boiling_point(aap.GetAtm());
        amount := amount - 1.0  --- evaporation (1.0 is inadequate value!)
       )
  pre
    aap.GetAtm() in set dom boiling_point and
    temperature <= boiling_point(aap.GetAtm())
  post
    temperature <= boiling_point(aap.GetAtm());

  pure public
  GetAmount: () ==> real
  GetAmount() ==
    return amount;

  public
  SetAmount: real ==> ()
  SetAmount(a) ==
    amount := a;

end Liquid
~~~
{% endraw %}

### USER-test.vdmpp

{% raw %}
~~~
class UserTest

instance variables
  realworld : RealWorld1;
  sw : Software;

operations
  public
  test: () ==> bool
  test() ==
    (realworld := new RealWorld1();
     realworld.Setup();
     sw := new Software();
     sw.Setup(realworld);
     sw.Boil();
     return true);

end UserTest
~~~
{% endraw %}

### REALWORLD-low-water.vdmpp

{% raw %}
~~~
class RealWorld1

instance variables
  public aap: LowAtmosphericAirPressure;
  public liquid : Water;

  -- only realworld_liquid variable can be accessed
  -- from a system (heater, thermistor, and liquid level sensor)

  -- CONTEXT-atmospheric-air-pressureplace-low and
  -- CONTEXT-liquid-water
  -- are selected

operations
  public
  Setup: () ==> ()
  Setup() ==
    (aap := new LowAtmosphericAirPressure();
     aap.SetAtm(0.53);
     liquid := new Water();
     liquid.SetAap(aap);
     liquid.SetBoilingPoint();
     liquid.SetTemperature(35.0);
     liquid.SetAmount(1000.0));

end RealWorld1
~~~
{% endraw %}

### CONTEXT-atmospheric-air-pressureplace-low.vdmpp

{% raw %}
~~~
class LowAtmosphericAirPressure is subclass of AtmosphericAirPressure

instance variables
  inv
    atm < 1

end LowAtmosphericAirPressure
~~~
{% endraw %}

### CONTEXT-atmospheric-air-pressureplace-normal.vdmpp

{% raw %}
~~~
class NormalAtmosphericAirPressure is subclass of AtmosphericAirPressure

instance variables
  inv
    atm = 1

end NormalAtmosphericAirPressure
~~~
{% endraw %}

### REALWORLD-normal-water.vdmpp

{% raw %}
~~~
class RealWorld2

instance variables
  public aap: NormalAtmosphericAirPressure;
  public liquid : Water;

  -- only realworld_liquid variable can be accessed
  -- from a system (heater, thermistor, and liquid level sensor)

  -- CONTEXT-atmospheric-air-pressureplace-normal and
  -- CONTEXT-liquid-water
  -- are selected

operations
  public
  Setup: () ==> ()
  Setup() ==
    (aap := new NormalAtmosphericAirPressure();
     aap.SetAtm(1.0);
     liquid := new Water();
     liquid.SetAap(aap);
     liquid.SetBoilingPoint();
     liquid.SetTemperature(35.0);
     liquid.SetAmount(1000.0));

end RealWorld2
~~~
{% endraw %}

