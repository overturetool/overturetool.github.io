---
layout: default
title: QuadilateralPP
---

## QuadilateralPP
Author: Stephen Goldsack


This example deals with quadilaterals (figures with four 
straight lines) and the inheritance between them. A few 
basic operations are defined in the respective classes. 
This package also illustrates how to make use of C++ 
code automatically generated using VDMTools. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### rhombus.vdmpp

{% raw %}
~~~
class Rhombus is subclass of Parallelogram
 
  instance variables
  inv length (v1) = length (v2)
 
end Rhombus
~~~
{% endraw %}

### math.vdmpp

{% raw %}
~~~
class MATH

-- 	VDMTools STANDARD LIBRARY: MATH
--      --------------------------------------------
-- 
-- Standard library for the VDMTools Interpreter. When the interpreter
-- evaluates the preliminary functions/operations in this file,
-- corresponding internal functions is called instead of issuing a run
-- time error. Signatures should not be changed, as well as name of
-- module (VDM-SL) or class (VDM++). Pre/post conditions is 
-- fully user customisable. 
-- Dont care's may NOT be used in the parameter lists.

  functions
public static
    sin:real +> real
    sin(v) ==
    is not yet specified    
    post abs RESULT <= 1;

public static
    cos:real +> real
    cos(v) ==
    is not yet specified
    post abs RESULT <= 1;

public static
    tan:real -> real
    tan(a) ==
    is not yet specified
    pre cos(a) <> 0;

public static
    cot:real -> real	
    cot(a) ==
    is not yet specified -- Could also be: 1/tan(r)
    pre sin(a) <> 0;

public static
    asin:real -> real
    asin(a) ==
    is not yet specified
    pre abs a <= 1;

public static
    acos:real -> real
    acos(a) ==
    is not yet specified
    pre abs a <= 1;

public static
    atan:real +> real
    atan(v) ==
    is not yet specified;

public static
    acot:real +> real
    acot(a) ==
    atan(1/a)
    pre a <> 0;

public static
    sqrt:real -> real
    sqrt(a) ==
    is not yet specified
    pre a >= 0;

public static
    pi_f:() +> real
    pi_f () ==
    is not yet specified

  operations

public static
    srand:int ==> ()
    srand(a) ==
    let - = MATH`srand2(a) in skip
    pre a >= -1;

public static
    rand:int ==> int 
    rand(a) ==
    is not yet specified;

public static
    srand2:int ==> int 
    srand2(a) ==
    is not yet specified
    pre a >= -1

  functions

public static
    exp:real +> real
    exp(a) ==
    is not yet specified;

public static
    ln:real -> real
    ln(a) ==
    is not yet specified
    pre a > 0;

public static
    log:real -> real
    log(a) ==
    is not yet specified
    pre a > 0;

  values
public
    pi = 3.14159265358979323846

 
end MATH
~~~
{% endraw %}

### square.vdmpp

{% raw %}
~~~
class Square is subclass of Rhombus, Rectangle
 
end Square
~~~
{% endraw %}

### quadrilateral.vdmpp

{% raw %}
~~~
class Quadrilateral is subclass of Vector
 
  instance variables
    position: vector := NullVector;
    protected v1 : vector := NullVector;
    protected v2 : vector := NullVector;
    protected v3 : vector := NullVector;
    protected v4 : vector := NullVector;
    inv add (add (v1, v2), add (v3, v4)) = NullVector;
 
  operations
    public
    Move: Position * Position ==> ()
    Move(p1, p2) ==
      position := add(position, mk_vector(p1, p2));

    public
    SetShape: Position * Position * Position * Position ==> ()
    SetShape(p1, p2, p3, p4) ==
    ( atomic (
      v1 := mk_vector(p1, p2);
      v2 := mk_vector(p2, p3);
      v3 := mk_vector(p3, p4);
      v4 := mk_vector(p4, p1) ));

    public
    Display: () ==> ()
    Display() == is not yet specified
 
end Quadrilateral

~~~
{% endraw %}

### parallelogram.vdmpp

{% raw %}
~~~
class Parallelogram is subclass of Quadrilateral
 
   instance variables
      inv (length (v1) = length (v3)) and (length (v2) = length (v4))
 
   operations
      public
      GetAngle: () ==> real
      GetAngle() ==
        let math = new MATH() 
        in
        return math.acos (inproduct (v1, v2) / (length (v1) * length (v2)))
 
end Parallelogram

~~~
{% endraw %}

### vector.vdmpp

{% raw %}
~~~
class Vector 
 
  values
    public NullVector : vector = mk_vector (mk_(0,0),mk_(0,0))
 
  types
    public
    vector :: head: Position
              tail: Position;
 
    public
    Position = Coordinate * Coordinate;
 
    public
    Coordinate = nat
 
  functions
    public
    inproduct: vector * vector -> real
    inproduct (v1, v2) ==
      let mk_vector (mk_(hd1x, hd1y), mk_(tl1x, tl1y)) = v1,
          mk_vector (mk_(hd2x, hd2y), mk_(tl2x, tl2y)) = v2 in
        (tl1x - hd1x) * (tl2x - hd2x) + (tl1y - hd1y) * (tl2y - hd2y);
 
    public
    length: vector -> real
    length (v) ==
      let mk_vector (mk_(hdx, hdy), mk_(tlx, tly)) = v in
        MATH`sqrt ((tlx - hdx)**2 + (tly - hdy)**2);              
 
    public
    add: vector * vector -> vector
    add (v1, v2) ==
      let mk_vector (hd1, mk_(tl1x, tl1y)) = v1,
          mk_vector (mk_(hd2x, hd2y), mk_(tl2x, tl2y)) = v2 in
        mk_vector(hd1, mk_(tl1x + (tl2x - hd2x), tl1y + (tl2y - hd2y)))
 
end Vector

~~~
{% endraw %}

### rectangle.vdmpp

{% raw %}
~~~
class Rectangle is subclass of Parallelogram
 
  instance variables
  inv inproduct (v1 , v2) = 0 
 
end Rectangle
~~~
{% endraw %}

### workspace.vdmpp

{% raw %}
~~~
class WorkSpace is subclass of Vector
 
  types
    Token = nat;

  instance variables
    screen: map Token to Quadrilateral := {|->};
 
  operations

    LookUp: Token ==> Quadrilateral
    LookUp(qid) ==
      return screen (qid)
    pre qid in set dom screen;

    GetAngle: Token ==> real
    GetAngle(qid) ==
      def scrn: Parallelogram = screen(qid) in
        return scrn.GetAngle()
    pre qid in set dom screen 
        and isofclass (Parallelogram, screen(qid));
 
    Display: Token * Quadrilateral ==> ()
    Display(qid, q) == 
      ( screen := screen munion { qid |-> q };
        q.Display() )
    pre q not in set rng screen;

    UnDisplay: Token ==> ()
    UnDisplay(qid) == 
      screen := {qid} <-: screen
    pre qid in set dom screen;

    Move: Token * (nat * nat) * (nat * nat) ==> ()
    Move(qid, p1, p2) ==
    ( dcl scrn : Quadrilateral := screen(qid);
      UnDisplay (qid);
      scrn.Move (p1,p2);
      Display (qid, scrn)
    )
    pre qid in set dom screen
  
end WorkSpace

~~~
{% endraw %}

### mathematics.vdmpp

{% raw %}
~~~
class Mathematics
 
  values
    pi: real = 3.14
 
  types
    Angle = real
    inv a == a >= 0 and a <= 2*pi
 
  functions
    acos (x: real) res: Angle
    post inv_Angle (res);
 
    sqrt (r: real) res: real
    post res**2 = r

end Mathematics
~~~
{% endraw %}

