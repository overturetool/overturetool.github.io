---
layout: default
title: EnigmaPP
---

## EnigmaPP
Author: Marvel Verhoef


This VDM++ model is developed by Marcel Verhoef as a part of the VDM++ book
John Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel 
Verhoef. Validated Designs for Object-oriented Systems, Springer, New York. 
2005, ISBN 1-85233-881-4. This is a VDM++ model of the famous
Enigma cipher machine used by the Germans in the Second World War to
encrypt and decrypt messages that were exchanged between military
units. The purpose of the model is to get a basic understanding of the
cipher mechanism as implemented in Enigma. This example was the first place
where the VDMUnit testing approach was introduced.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new EnigmaTest().Execute()|


### TestSuite.vdmpp

{% raw %}
~~~
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
~~~
{% endraw %}

### Configuration.vdmpp

{% raw %}
~~~
class Configuration
  is subclass of Component

instance variables
  protected config: inmap nat to nat;

operations
  protected Encode: nat ==> nat
  Encode (penc) ==
    if penc in set dom config
    then return config(penc)
    else return penc;

  protected Decode: nat ==> nat
  Decode (pdec) ==
    let invcfg = inverse config in
      if pdec in set dom invcfg
      then return invcfg(pdec)
      else return pdec;

  public Substitute: nat ==> nat
  Substitute(pidx) ==
    return Decode(next.Substitute(Encode(pidx)))
  pre next <> nil

end Configuration
~~~
{% endraw %}

### PlugboardTest.vdmpp

{% raw %}
~~~
class PlugboardTest
  is subclass of TestCase

values
  refcfg : inmap nat to nat =
    {1 |-> 2, 3 |-> 4};

  rotcfg : inmap nat to nat =
    {1 |-> 2, 2 |-> 1, 3 |-> 4, 4 |-> 3};

  pbcfg : inmap nat to nat =
    {1 |-> 3}

instance variables
  alph : Alphabet
  
operations
  public PlugboardTest: seq of char ==> PlugboardTest
  PlugboardTest(nm) == name := nm;

  protected SetUp: () ==> ()
  SetUp () == alph := new Alphabet("ABCD");

  protected SimpleTest: () ==> ()
  SimpleTest () ==
    (dcl tc : Plugboard := new Plugboard(alph,pbcfg);
     tc.SetNext(new Reflector(1,alph,refcfg));
     AssertTrue(tc.Substitute(1) = 4);
     AssertTrue(tc.Substitute(2) = 3);
     AssertTrue(tc.Substitute(3) = 2);
     AssertTrue(tc.Substitute(4) = 1));

  protected ComplexTest: () ==> ()
  ComplexTest () ==
    (dcl tc : Plugboard := new Plugboard(alph,pbcfg),
         rot : Rotor := new Rotor(1,1,alph,rotcfg);
     rot.SetNext(new Reflector(1,alph,refcfg));
     tc.SetNext(rot);
     AssertTrue(tc.Substitute(1) = 4);
     AssertTrue(tc.Substitute(2) = 3);
     AssertTrue(tc.Substitute(3) = 2);
     AssertTrue(tc.Substitute(4) = 1));

  protected RunTest: () ==> ()
  RunTest () == (SimpleTest(); ComplexTest());

  protected TearDown: () ==> ()
  TearDown () == skip;

end PlugboardTest
~~~
{% endraw %}

### Reflector.vdmpp

{% raw %}
~~~
class Reflector
  is subclass of Configuration

instance variables
  inv ReflectorInv(next, config, alph)

functions
  ReflectorInv:
    [Component] * inmap nat to nat * Alphabet -> bool
  ReflectorInv (pnext, pconfig, palph) ==
    pnext = nil and
    dom pconfig inter rng pconfig = {} and
    dom pconfig union rng pconfig = palph.GetIndices()

operations
  public Reflector:
    nat * Alphabet * inmap nat to nat ==> Reflector
  Reflector (psp, pa, pcfg) ==
    atomic (alph := pa;
      config := {pa.Shift(i, psp-1) |->
        pa.Shift(pcfg(i), psp-1) |
        i in set dom pcfg})
  pre psp in set pa.GetIndices() and
      ReflectorInv(next, pcfg, pa);

  public Substitute: nat ==> nat
  Substitute (pidx) ==
    if pidx in set dom config
    then Encode(pidx)
    else Decode(pidx)

end Reflector
~~~
{% endraw %}

### RotorTest.vdmpp

{% raw %}
~~~
              
class RotorTest
  is subclass of TestCase

values
  refcfg : inmap nat to nat =
    { 1 |-> 2, 3 |-> 4};

  rotcfg : inmap nat to nat =
    { 1 |-> 1,  2 |-> 3, 3 |-> 2, 4 |-> 4}
    
instance variables
  alph : Alphabet

operations
  public RotorTest: seq of char ==> RotorTest
  RotorTest(nm) == name := nm;

  protected SetUp: () ==> ()
  SetUp () == alph := new Alphabet("ABCD");

  protected SimpleTest: () ==> ()
  SimpleTest () ==
    ( dcl tc : Rotor := new Rotor(1,1,alph,rotcfg);
      tc.SetNext(new Reflector(1,alph,refcfg));
      AssertTrue(tc.Substitute(1) = 3);
      AssertTrue(tc.Substitute(2) = 4);
      AssertTrue(tc.Substitute(3) = 1);
      AssertTrue(tc.Substitute(4) = 2);
      tc.Rotate();
      AssertTrue(tc.Substitute(1) = 2);
      AssertTrue(tc.Substitute(2) = 1);
      AssertTrue(tc.Substitute(3) = 4);
      AssertTrue(tc.Substitute(4) = 3);
      tc.Rotate();
      AssertTrue(tc.Substitute(1) = 3);
      AssertTrue(tc.Substitute(2) = 4);
      AssertTrue(tc.Substitute(3) = 1);
      AssertTrue(tc.Substitute(4) = 2);
      tc.Rotate();
      AssertTrue(tc.Substitute(1) = 2);
      AssertTrue(tc.Substitute(2) = 1);
      AssertTrue(tc.Substitute(3) = 4);
      AssertTrue(tc.Substitute(4) = 3) );

  protected ComplexTest: () ==> ()
  ComplexTest () ==
    ( dcl tc1 : Rotor := new Rotor(1,1,alph,rotcfg),
          tc2 : Rotor := new Rotor(1,1,alph,rotcfg);
      tc1.SetNext(new Reflector(1,alph,refcfg));
      tc2.SetNext(tc1);
      AssertTrue(tc2.Substitute(1) = 2);
      AssertTrue(tc2.Substitute(2) = 1);
      AssertTrue(tc2.Substitute(3) = 4);
      AssertTrue(tc2.Substitute(4) = 3);
      tc2.Rotate();
      AssertTrue(tc2.Substitute(1) = 2);
      AssertTrue(tc2.Substitute(2) = 1);
      AssertTrue(tc2.Substitute(3) = 4);
      AssertTrue(tc2.Substitute(4) = 3);
      tc2.Rotate();
      AssertTrue(tc2.Substitute(1) = 3);
      AssertTrue(tc2.Substitute(2) = 4);
      AssertTrue(tc2.Substitute(3) = 1);
      AssertTrue(tc2.Substitute(4) = 2);
      tc2.Rotate();
      AssertTrue(tc2.Substitute(1) = 2);
      AssertTrue(tc2.Substitute(2) = 1);
      AssertTrue(tc2.Substitute(3) = 4);
      AssertTrue(tc2.Substitute(4) = 3);
      tc2.Rotate();
      AssertTrue(tc2.Substitute(1) = 3);
      AssertTrue(tc2.Substitute(2) = 4);
      AssertTrue(tc2.Substitute(3) = 1);
      AssertTrue(tc2.Substitute(4) = 2);
      tc2.Rotate();
      AssertTrue(tc2.Substitute(1) = 2);
      AssertTrue(tc2.Substitute(2) = 1);
      AssertTrue(tc2.Substitute(3) = 4);
      AssertTrue(tc2.Substitute(4) = 3);
      tc2.Rotate();
      AssertTrue(tc2.Substitute(1) = 2);
      AssertTrue(tc2.Substitute(2) = 1);
      AssertTrue(tc2.Substitute(3) = 4);
      AssertTrue(tc2.Substitute(4) = 3);
      tc2.Rotate();
      AssertTrue(tc2.Substitute(1) = 4);
      AssertTrue(tc2.Substitute(2) = 3);
      AssertTrue(tc2.Substitute(3) = 2);
      AssertTrue(tc2.Substitute(4) = 1) );

  protected RunTest: () ==> ()
  RunTest () == ( SimpleTest(); ComplexTest() );

  protected TearDown: () ==> ()
  TearDown () == skip;

end RotorTest
             
~~~
{% endraw %}

### Alphabet.vdmpp

{% raw %}
~~~
class Alphabet

instance variables
  alph : seq of char := [];

inv AlphabetInv(alph)

functions
  AlphabetInv: seq of char -> bool
  AlphabetInv (palph) ==
    len palph mod 2 = 0 and
    card elems palph = len palph

operations
  public Alphabet: seq of char ==> Alphabet
  Alphabet (pa) == alph := pa
  pre AlphabetInv(pa);

  public GetChar: nat ==> char
  GetChar (pidx) == return alph(pidx)
  pre pidx in set inds alph;

  public GetIndex: char ==> nat
  GetIndex (pch) ==
    let pidx in set {i | i in set inds alph
                       & alph(i) = pch} in
      return pidx
  pre pch in set elems alph;

  pure public GetIndices: () ==> set of nat
  GetIndices () == return inds alph;

  public GetSize: () ==> nat
  GetSize () == return len alph;

  public Shift: nat * nat ==> nat
  Shift (pidx, poffset) ==
    if pidx + poffset > len alph
    then return pidx + poffset - len alph
    else return pidx + poffset
  pre pidx in set inds alph and
      poffset <= len alph;

  public Shift: nat ==> nat
  Shift (pidx) == Shift(pidx, 1)
end Alphabet
~~~
{% endraw %}

### SimpleEnigmaTest.vdmpp

{% raw %}
~~~
class SimpleEnigmaTest is subclass of TestCase

operations
  public SimpleEnigmaTest: seq of char ==> SimpleEnigmaTest
  SimpleEnigmaTest(nm) == name := nm;

  protected SetUp: () ==> ()
  SetUp () == skip;

  protected RunTest: () ==> ()
  RunTest () == 
    (dcl se1 : SimpleEnigma := new SimpleEnigma(),
         se2 : SimpleEnigma := new SimpleEnigma();
     for ch in "ABCDDCBAABCDDCBAAABBCCDD" do
       AssertTrue(
         se1.Keystroke(se2.Keystroke(ch)) = ch));

  protected TearDown: () ==> ()
  TearDown () == skip

end SimpleEnigmaTest
~~~
{% endraw %}

### SimpleEnigma.vdmpp

{% raw %}
~~~
class SimpleEnigma
  is subclass of Component

values
   refcfg : inmap nat to nat =
     {1 |-> 3, 2 |-> 4};
   rotcfg : inmap nat to nat =
     {1 |-> 2, 2 |-> 4, 3 |-> 3, 4 |-> 1};
   pbcfg : inmap nat to nat =
     {2 |-> 3}

operations
  public SimpleEnigma: () ==> SimpleEnigma
  SimpleEnigma () ==
    (dcl cp : Component ;
     alph := new Alphabet("ABCD");
     next := new Reflector(4,alph,refcfg);
     cp := new Rotor(3,3,alph,rotcfg);
     cp.SetNext(next);
     next := cp;
     cp := new Rotor(2,2,alph,rotcfg);
     cp.SetNext(next);
     next := cp;
     cp := new Rotor(1,1,alph,rotcfg);
     cp.SetNext(next);
     next := cp;
     cp := new Plugboard(alph,pbcfg);
     cp.SetNext(next);
     next := cp);

  public Keystroke : char ==> char
  Keystroke (pch) ==
    let pidx = alph.GetIndex(pch) in
      return alph.GetChar(next.Substitute(pidx))
  pre isofclass(Plugboard,next);

  -- this is needed to make this a non-abstract class
  public Substitute: nat ==> nat
  Substitute (-) == return 1;
  

end SimpleEnigma
~~~
{% endraw %}

### TestResult.vdmpp

{% raw %}
~~~
class TestResult

instance variables
  failures : seq of TestCase := []
  
operations
  public AddFailure: TestCase ==> ()
  AddFailure (ptst) == failures := failures ^ [ptst];

  public Print: seq of char ==> ()
  Print (pstr) ==
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

### Rotor.vdmpp

{% raw %}
~~~
class Rotor
  is subclass of Configuration

instance variables
  latch_pos : nat;
  latch_lock : bool := false;

inv RotorInv(latch_pos, config, alph)

functions
  RotorInv: nat * inmap nat to nat * Alphabet -> bool
  RotorInv (platch_pos, pconfig, palph) ==
    let ainds = palph.GetIndices() in
      platch_pos in set ainds and
      dom pconfig = ainds and
      rng pconfig = ainds and
      exists x in set dom pconfig & x <> pconfig(x)

operations
  public Rotor:
    nat * nat * Alphabet * inmap nat to nat ==> Rotor
  Rotor (psp, plp, pa, pcfg) == 
    atomic (latch_pos := pa.Shift(plp,psp-1); 
      alph := pa;
      config := {pa.Shift(i,psp-1) |->
                 pa.Shift(pcfg(i),psp-1) |
                 i in set dom pcfg})
  pre psp in set pa.GetIndices() and
      RotorInv(plp, pcfg, pa);

  public Rotate: () ==> ()
  Rotate () ==
    (-- propagate the rotation to the next component
     -- and tell it where our latch position is
     next.Rotate(latch_pos);
     -- update our own latch position and take the
     -- alphabet size into account
     if latch_pos = alph.GetSize()
     then latch_pos := 1
     else latch_pos := latch_pos+1;
     -- update the transpositioning relation by
     -- shifting all indices one position
     config := {alph.Shift(i) |->
                alph.Shift(config(i)) |
                i in set dom config};
     -- remember the rotation
     latch_lock := true)
  pre isofclass(Rotor,next) or
      isofclass(Reflector,next);

  public Rotate: nat ==> ()
  Rotate (ppos) ==
    -- compare the latch position and the lock
    if ppos = latch_pos and not latch_lock
    -- perform the actual rotation
    then Rotate()
    -- otherwise reset the lock
    else latch_lock := false
  pre ppos in set alph.GetIndices();
    
end Rotor
~~~
{% endraw %}

### Plugboard.vdmpp

{% raw %}
~~~
class Plugboard
  is subclass of Configuration

instance variables
  inv PlugboardInv(config, alph)

functions
  PlugboardInv: inmap nat to nat * Alphabet -> bool
  PlugboardInv (pconfig, palph) ==
    dom pconfig subset palph.GetIndices()

operations
  public Plugboard:
    Alphabet * inmap nat to nat ==> Plugboard
  Plugboard (pa, pcfg) ==
    atomic (alph := pa;
      config := pcfg munion inverse pcfg)
  pre dom pcfg inter rng pcfg = {} and
      PlugboardInv(pcfg, pa);

  public Substitute: nat ==> nat
  Substitute (pidx) ==
    (next.Rotate();
     Configuration`Substitute(pidx))
  pre pidx in set alph.GetIndices() and
      (isofclass(Rotor,next) or
       isofclass(Reflector,next))

end Plugboard
~~~
{% endraw %}

### Test.vdmpp

{% raw %}
~~~
class Test

operations
  public Run: TestResult ==> ()
  Run (-) == is subclass responsibility

end Test

~~~
{% endraw %}

### AlphabetTest.vdmpp

{% raw %}
~~~
              
class AlphabetTest
  is subclass of TestCase

values
  str : seq of char = "ABCD"

operations
  public AlphabetTest: seq of char ==> AlphabetTest
  AlphabetTest(nm) == name := nm;

  protected SetUp: () ==> ()
  SetUp () == skip;

  protected RunTest: () ==> ()
  RunTest () ==
    ( dcl tc : Alphabet := new Alphabet(str);
      for all i in set inds str do
        ( AssertTrue(tc.GetChar(i) = str(i));
          AssertTrue(tc.GetIndex(str(i)) = i);
          AssertTrue(tc.Shift(1,i) = tc.Shift(i)) );
      AssertTrue(tc.GetSize() = 4);
      AssertTrue(tc.GetIndices() = {1,...,4}) );
      
  protected TearDown: () ==> ()
  TearDown () == skip;

end AlphabetTest
             
~~~
{% endraw %}

### EnigmaTest.vdmpp

{% raw %}
~~~
class EnigmaTest
operations
  public Execute: () ==> ()
  Execute () ==
    (dcl ts : TestSuite := new TestSuite();
     ts.AddTest(new AlphabetTest("Alphabet"));
     ts.AddTest(new ConfigurationTest("Configuration"));
     ts.AddTest(new ReflectorTest("Reflector"));
     ts.AddTest(new RotorTest("Rotor"));
     ts.AddTest(new PlugboardTest("Plugboard"));
     ts.AddTest(new SimpleEnigmaTest("SimpleEnigma"));
     ts.Run())
     
end EnigmaTest
~~~
{% endraw %}

### ReflectorTest.vdmpp

{% raw %}
~~~
              
class ReflectorTest
  is subclass of TestCase

values
  cfg : inmap nat to nat =
    { 1 |-> 2, 3 |-> 4 }
    
instance variables
  alph : Alphabet;

operations
  public ReflectorTest: seq of char ==> ReflectorTest
  ReflectorTest(nm) == name := nm;

  protected SetUp: () ==> ()
  SetUp () == alph := new Alphabet("ABCD");

  SimpleTest: () ==> ()
  SimpleTest () ==
    ( dcl tc1 : Reflector := new Reflector(1, alph, cfg),
          tc2 : Reflector := new Reflector(2, alph, cfg);
      AssertTrue (tc1.Substitute(1) = 2);
      AssertTrue (tc1.Substitute(2) = 1);
      AssertTrue (tc1.Substitute(3) = 4);
      AssertTrue (tc1.Substitute(4) = 3);
      AssertTrue (tc2.Substitute(1) = 4);
      AssertTrue (tc2.Substitute(2) = 3);
      AssertTrue (tc2.Substitute(3) = 2);
      AssertTrue (tc2.Substitute(4) = 1) );


  ComplexTest: () ==> ()
  ComplexTest () ==
    for all x in set alph.GetIndices() do
      ( dcl tc : Reflector := new Reflector(x, alph, cfg);
        for all y in set alph.GetIndices() do
          AssertTrue(tc.Substitute(tc.Substitute(y)) = y) );

  protected RunTest: () ==> ()
  RunTest () == ( SimpleTest(); ComplexTest() );

  protected TearDown: () ==> ()
  TearDown () == skip

end ReflectorTest
             
~~~
{% endraw %}

### Component.vdmpp

{% raw %}
~~~
class Component

instance variables
  protected next : [Component] := nil;
  protected alph : Alphabet

operations
  pure public Successors: () ==> set of Component
  Successors () ==
    if next = nil
    then return {self}
    else return {self} union next.Successors();

  public SetNext: Component ==> ()
  SetNext (pcom) == next := pcom
    pre next = nil and
        self not in set pcom.Successors();

  public Substitute: nat ==> nat
  Substitute (-) == is subclass responsibility;

  public Rotate: () ==> ()
  Rotate () == skip;

  public Rotate: nat ==> ()
  Rotate (-) == skip

end Component
~~~
{% endraw %}

### ConfigurationTest.vdmpp

{% raw %}
~~~
              
class ConfigurationTest
  is subclass of Configuration, TestCase

values
  cfg : inmap nat to nat =
    { 1 |-> 2, 3 |-> 4 }
    
operations
  public ConfigurationTest: seq of char ==> ConfigurationTest
  ConfigurationTest(nm) == name := nm;

  protected SetUp: () ==> ()
  SetUp () == config := cfg;

  protected RunTest: () ==> ()
  RunTest () == 
    ( AssertTrue(Encode(1) = 2);
      AssertTrue(Encode(2) = 2);
      AssertTrue(Encode(3) = 4);
      AssertTrue(Encode(4) = 4);
      AssertTrue(Decode(1) = 1);
      AssertTrue(Decode(2) = 1);
      AssertTrue(Decode(3) = 3);
      AssertTrue(Decode(4) = 3) );

  protected TearDown: () ==> ()
  TearDown () == skip;

end ConfigurationTest
             
~~~
{% endraw %}

### TestCase.vdmpp

{% raw %}
~~~
class TestCase
  is subclass of Test

instance variables
  protected name : seq of char

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
~~~
{% endraw %}

