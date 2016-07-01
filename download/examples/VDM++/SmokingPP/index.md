---
layout: default
title: SmokingPP
---

## SmokingPP
Author: Claus Ballegaard Nielsen




| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### Agent.vdmpp

{% raw %}
~~~
class Agent

values
  thing_l = [<Tobacco>, <Paper>, <Match>]

instance variables
  timer : nat := 0;
  table : Table;

operations

public Agent: Table ==> Agent
Agent(tab) ==
  table := tab;

public GetTime: () ==> nat
GetTime() ==
  return timer;

public AddTobacco : () ==> bool
AddTobacco() == 
(
  if table.AddElement(thing_l(1)) then
  (
 	World`graphics.tobaccoAdded();
	return true;
  );

  return false;
);

public AddPaper : () ==> bool
AddPaper() == 
(
  if table.AddElement(thing_l(2)) then
  (
 	World`graphics.paperAdded();
	return true;
  );

  return false;
);

public AddMatch : () ==> bool
AddMatch() == 
(
  if table.AddElement(thing_l(3)) then
  (
 	World`graphics.matchAdded();
	return true;
  );

  return false;
);

end Agent
~~~
{% endraw %}

### gui_Graphics.vdmpp

{% raw %}
~~~
class gui_Graphics
	operations

    public init : () ==> ()
	init() == is not yet specified;

	public tobaccoAdded : () ==> ()
	tobaccoAdded() == is not yet specified; 

	public paperAdded : () ==> ()
	paperAdded() == is not yet specified; 

	public matchAdded : () ==> ()
	matchAdded() == is not yet specified; 

	public tableCleared : () ==> ()
	tableCleared() == is not yet specified;  

	public nowSmoking : nat ==> ()
	nowSmoking(smokerNumber) == is not yet specified;

	functions
	public static ElementToNat : Table`Element -> nat
    ElementToNat(elm) == 
		cases elm:
			<Tobacco> -> 1,
			<Paper> -> 2,
			<Match> -> 3
	 	end;

end gui_Graphics

~~~
{% endraw %}

### IO.vdmpp

{% raw %}
~~~
class IO

--  Overture STANDARD LIBRARY: INPUT/OUTPUT
--      --------------------------------------------
-- 
-- Standard library for the Overture Interpreter. When the interpreter
-- evaluates the preliminary functions/operations in this file,
-- corresponding internal functions is called instead of issuing a run
-- time error. Signatures should not be changed, as well as name of
-- module (VDM-SL) or class (VDM++). Pre/post conditions is 
-- fully user customizable. 
-- Don't care's may NOT be used in the parameter lists.
--
-- The in/out functions  will return false if an error occurs. In this
-- case an internal error string will be set (see 'ferror').
--
-- File path:
--  * An absolute path is accepted and used as specified.
--  * A relative path is relative to the debugger or if running in the 
--      Overture IDE relative to the project root.
--

types
 
/**
 * The file directive used in in/out functions.
 */
public filedirective = <start>|<append> 

functions

/**
 * Write VDM value in ASCII format to the console.
 *
 * @param val the VDM value to be written
 * @return true if successful else false
 */
public static writeval[@p]: @p -> bool
writeval(val)==
  is not yet specified;

/**
 * Write VDM value in ASCII format to file. The type of the val must be
 * specified as fwriteval[seq of char](...) when calling the function.
 *
 * @param filename the name of the file
 * @param val the VDM value to be written.
 * @param fdir if <start> then it will overwrite an existing file, 
 *  else <append> will append output to the existing file
 * @return true if successful else false
 */
public static fwriteval[@p]:seq1 of char * @p * filedirective -> bool
fwriteval(filename,val,fdir) ==
  is not yet specified;

/**
 * Read VDM value in ASCII format from file. The type which should be read must be
 * specified as freadval[seq of char](...) when calling the function.
 *
 * @param filename the name of the file
 * @return mk_(success,@p) if successful success will be 
 * set to true else false. @p will hold nil if unsuccessful or the value read.
 */
public static freadval[@p]:seq1 of char -> bool * [@p]
freadval(filename) ==
  is not yet specified
  post let mk_(b,t) = RESULT in not b => t = nil;

operations

/**
 * Write text to std out. Surrounding double quotes will be stripped,
 * backslashed characters should be interpreted.
 *
 * @param text the text to write to the console
 * @return if successful true else false.
 */
public echo: seq of char ==> bool
echo(text) ==
  fecho ("",text,nil);

/**
 * Write text to file like <code>echo</code>.
 *
 * @param filename the name of the file
 * @param text the text to write to be written.
 * @param fdir if nil or <start> then it will overwrite an existing file, 
 *  else <append> will append output to the existing file.
 * @return true if successful else false
 */
public fecho: seq of char * seq of char * [filedirective] ==> bool
fecho (filename,text,fdir) ==
  is not yet specified
  pre filename = "" <=> fdir = nil;

/**
 * Returns the last error which may have occurred by any of the io/out functions
 *
 * @return the last error message
 */
public ferror:()  ==> seq of char
ferror () ==
  is not yet specified;
  
-- New simplified format printing operations


/**
 * Prints any VDM value to the console
 *
 * @param arg a VDM value of any type
 */
public static print: ? ==> ()
print(arg) ==
    is not yet specified;

/**
 * Prints any VDM value to the console as a new line
 *
 * @param arg a VDM value of any type
 */
public static println: ? ==> ()
println(arg) ==
    is not yet specified;

/**
 * Prints any VDM value to the console
 *
 * @param format standard format string used in 
  *  Java by <code>String.format(format,value)</code>
 * @param arg a sequence of VDM values of any type
 */
public static printf: seq of char * seq of ? ==> ()
printf(format, args) ==
    is not yet specified;

end IO
~~~
{% endraw %}

### MATH.vdmpp

{% raw %}
~~~
class MATH

-- 	Overture STANDARD LIBRARY: MATH
--      --------------------------------------------
-- 
-- Standard library for the Overture Interpreter. When the interpreter
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

public static 
    fac:nat -> nat1 
    fac(a) == 
    is not yet specified 
    pre a < 21;         -- The limit for 64-bit calculations

  values
public
    pi = 3.14159265358979323846

 
end MATH
~~~
{% endraw %}

### VDMUtil.vdmpp

{% raw %}
~~~
class VDMUtil

-- 	Overture STANDARD LIBRARY: MiscUtils
--      --------------------------------------------
-- 
-- Standard library for the Overture Interpreter. When the interpreter
-- evaluates the preliminary functions/operations in this file,
-- corresponding internal functions is called instead of issuing a run
-- time error. Signatures should not be changed, as well as name of
-- module (VDM-SL) or class (VDM++). Pre/post conditions is 
-- fully user customisable. 
-- Dont care's may NOT be used in the parameter lists.

functions
-- Converts a set argument into a sequence in non-deterministic order.
static public set2seq[@T] : set of @T +> seq of @T
set2seq(x) == is not yet specified;

-- Returns a context information tuple which represents
-- (fine_name * line_num * column_num * class_name * fnop_name) of corresponding source text
static public get_file_pos : () +> [ seq of char * nat * nat * seq of char * seq of char ]
get_file_pos() == is not yet specified;

-- Converts a VDM value into a seq of char.
static public val2seq_of_char[@T] : @T +> seq of char
val2seq_of_char(x) == is not yet specified;

-- converts VDM value in ASCII format into a VDM value
-- RESULT.#1 = false implies a conversion failure
static public seq_of_char2val[@p]:seq1 of char -> bool * [@p]
seq_of_char2val(s) ==
  is not yet specified
  post let mk_(b,t) = RESULT in not b => t = nil;


static public classname[@T] : @T -> [seq1 of char]
    classname(s) == is not yet specified;

end VDMUtil


~~~
{% endraw %}

### Smoker.vdmpp

{% raw %}
~~~
class Smoker

instance variables
  smokerName : seq of char; 
  elements: set of Table`Element;
  orig_element : Table`Element;
  cigarettes : nat := 0;
  --inv cigarettes in set {0,1};
  table : Table;

operations

public Smoker: seq of char * Table`Element * Table ==> Smoker
Smoker(name ,element,tab) == (
  smokerName := name;
  elements := {element};
  orig_element := element;
  table := tab);

Roll: () ==> ()
Roll() == (
  World`graphics.nowSmoking(gui_Graphics`ElementToNat(orig_element));
  IO`print(smokerName ^ " rolling ");  
  elements := {};
  cigarettes := cigarettes + 1
  )
pre card elements = 3;

Smoke: () ==> ()
Smoke() ==(
  IO`print("and smoking \n"); 
  cigarettes := cigarettes - 1;
  elements := {orig_element};
);

thread
  while true do (
    elements := elements union table.TakeElements(elements);
    Roll();
    Smoke()
  )

sync
per Smoke => cigarettes > 0;

end Smoker
~~~
{% endraw %}

### Table.vdmpp

{% raw %}
~~~
class Table

types

public Element = <Tobacco> | <Paper> | <Match>;

instance variables
  elements : set of Element := {};
  inv card elements <= 3 

operations

public AddElement:  Element ==> bool
AddElement(es) ==
  if(es not in set elements) then
  (
   	elements := elements union {es};
 	return true;
  )
  else
 	return false;

private ExtraElement: () ==> set of Element
ExtraElement() ==   
let es = elements
  in (
       elements := {};
        World`graphics.tableCleared();
        IO`print("table clear");
       return es);

public TakeElements: set of Element ==> set of Element
TakeElements(es) == (

  let e in set es
    in 
      cases e:   
        <Tobacco> -> MissingPM(),
        <Paper> -> MissingTM(),
        <Match> -> MissingTP()
       end;

    ExtraElement();)
pre card es = 1;

MissingPM : () ==> ()
MissingPM() == skip;

MissingTM : () ==> ()
MissingTM() == skip;

MissingTP : () ==> ()
MissingTP() == skip;

sync
per MissingPM => elements = {<Paper>,<Match>};  
per MissingTM => elements = {<Tobacco>,<Match>};    
per MissingTP => elements = {<Tobacco>, <Paper>};  

--per AddElements => elements = {};
--per TakeElements => card elements = 2;

end Table
~~~
{% endraw %}

### World.vdmpp

{% raw %}
~~~
class World

instance variables
public static graphics : gui_Graphics:= new gui_Graphics();

table: Table := new Table();
public agent: Agent := new Agent(table);
smokers : set of Smoker := {new Smoker("Smoker 1", <Tobacco>, table),
                            new Smoker("Smoker 2", <Paper>, table),
                            new Smoker("Smoker 3", <Match>, table)};
limit : nat;
finished : bool := false;

operations

public World: nat ==> World
World(simtime) ==
(
  IO`print("World Ctor");
  limit := simtime;
  
);

public Yield: () ==> ()
Yield() == skip;

Finished: () ==> nat
Finished() ==
  agent.GetTime();

public Run: () ==> ()
Run() ==
(
   startlist(smokers);
    graphics.init();
 )

thread
(
while agent.GetTime() <= limit do
  skip; 
  finished := true)

sync

per Finished => finished;
end World
~~~
{% endraw %}

