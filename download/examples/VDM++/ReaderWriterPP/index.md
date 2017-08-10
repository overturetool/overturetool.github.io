---
layout: default
title: ReaderWriterPP
---

## ReaderWriterPP
Author: 




| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new TestClass().Run()|


### Buffer.vdmpp

{% raw %}
~~~
class Buffer

instance variables

data : [nat] := nil

operations

public Buffer: () ==> Buffer
Buffer() == 
	data := nil;

public Write: nat ==> ()
Write(newData) ==
  (IO`print("Writer wrote: "); IO`print(newData); IO`print("\n");
   data := newData;
  );

public Read: () ==> nat
Read() ==
  let oldData : nat = data
  in
    (IO`print("Reader read: "); IO`print(oldData); IO`print("\n");
     data := nil;     
     return oldData;
    );

public IsFinished: () ==> ()
IsFinished() == skip;

sync

per Write => #fin(Read) = #fin(Write);
per Read => (#fin(Read) + 1) = #fin(Write);
--per Write => data = nil;
--per Read => data <> nil;
per IsFinished => #fin(Read) = 3;


end Buffer
~~~
{% endraw %}

### io.vdmpp

{% raw %}
~~~
class IO

-- 	Overture STANDARD LIBRARY: INPUT/OUTPUT
--      --------------------------------------------
-- 
-- Standard library for the Overture Interpreter. When the interpreter
-- evaluates the preliminary functions/operations in this file,
-- corresponding internal functions is called instead of issuing a run
-- time error. Signatures should not be changed, as well as name of
-- module (VDM-SL) or class (VDM++). Pre/post conditions is 
-- fully user customisable. 
-- Dont care's may NOT be used in the parameter lists.
--
-- The in/out functions  will return false if an error occurs. In this
-- case an internal error string will be set (see 'ferror').

types
 
public
filedirective = <start>|<append> 

functions

-- Write VDM value in ASCII format to std out:
public
writeval[@p]: @p -> bool
writeval(val)==
  is not yet specified;

-- Write VDM value in ASCII format to file.
-- fdir = <start> will overwrite existing file,
-- fdir = <append> will append output to the file (created if
-- not existing).
public
fwriteval[@p]:seq1 of char * @p * filedirective -> bool
fwriteval(filename,val,fdir) ==
  is not yet specified;

-- Read VDM value in ASCII format from file
public
freadval[@p]:seq1 of char -> bool * [@p]
freadval(f) ==
  is not yet specified
  post let mk_(b,t) = RESULT in not b => t = nil;

operations

-- Write text to std out. Surrounding double quotes will be stripped,
-- backslashed characters should be interpreted.
public
echo: seq of char ==> bool
echo(text) ==
  fecho ("",text,nil);

-- Write text to file like 'echo'
public
fecho: seq of char * seq of char * [filedirective] ==> bool
fecho (filename,text,fdir) ==
  is not yet specified
  pre filename = "" <=> fdir = nil;

-- The in/out functions  will return false if an error occur. In this
-- case an internal error string will be set. 'ferror' returns this
-- string and set it to "".
public
ferror:()  ==> seq of char
ferror () ==
  is not yet specified;
  
-- New simplified format printing operations

public static print: ? ==> ()
print(arg) ==
	is not yet specified;

public static printf: seq of char * seq of ? ==> ()
printf(format, args) ==
	is not yet specified;

end IO
~~~
{% endraw %}

### TestClass.vdmpp

{% raw %}
~~~

class TestClass

instance variables

B : Buffer;

operations

public Run: () ==> ()
Run() ==
(
    B := new Buffer();

    def - = new IO().echo("Going to fire writer" ^ "\n") in skip;
    start(new Writer(B));
    
    def - = new IO().echo("Going to fire reader"^ "\n") in skip;
    start(new Reader(B));

   def - = new IO().echo("TestClass is now going to wait"^"\n") in skip;
   B.IsFinished();

)

end TestClass



~~~
{% endraw %}

### Writer.vdmpp

{% raw %}
~~~
class Writer

instance variables

b : Buffer;

index : nat := 0;

operations

public Writer: Buffer ==> Writer
Writer(buf) == 
	b := buf;

public Write: () ==> nat
Write() == 
 ( 
   index := index + 1;
   return index;
 )

thread
 ( while true do
  ( let x = Write() in
     ( b.Write(x);
       
     )
  )
 )

end Writer


~~~
{% endraw %}

### Reader.vdmpp

{% raw %}
~~~

class Reader

instance variables

b : Buffer

operations

public Reader: Buffer ==> Reader
Reader(buf) ==
	b := buf;

--public Read: nat ==> ()
--Read(d) == skip;

thread
  while true do
  ( let x = b.Read() in
     (skip;
    --Read(x);
    )
  )
end Reader


~~~
{% endraw %}

