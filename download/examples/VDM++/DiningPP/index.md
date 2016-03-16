---
layout: default
title: DiningPP
---

## DiningPP
Author: Marcel Verhoef


This example is made by Marcel Verhoef and it demonstrates the standard
classical dining philosophers problem expressed in VDM++. The standard 
launcer provided here is sufficient to cover the entire VDM++ model.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new Table(2).LetsEat()|


### philosopher.vdmpp

{% raw %}
~~~
              
class Philosopher

instance variables
  theTable : Table;
  turns : nat := 2

operations
  public Philosopher : Table ==> Philosopher
  Philosopher (pt) == theTable := pt;

  Think: () ==> ()
  Think () == skip;

  Eat: () ==> ()
  Eat () == turns := turns - 1;

thread
  ( while (turns > 0) do
      ( Think();
        theTable.takeFork();
        theTable.takeFork();
        Eat();
        theTable.releaseFork();
        theTable.releaseFork() );
    theTable.IamDone() )

end Philosopher
            
~~~
{% endraw %}

### table.vdmpp

{% raw %}
~~~
              
class Table

instance variables
  forks : nat := 0;
  guests : set of Philosopher := {};
  done : nat := 0

operations
  public Table: nat1 ==> Table
  Table (noGuests) ==
    while forks < noGuests do
      ( guests := guests union
          {new Philosopher(self)};
        forks := forks + 1 )
    pre noGuests >= 2;

  public takeFork: () ==> ()
  takeFork () == forks := forks - 1;

  public releaseFork: () ==> ()
  releaseFork () == forks := forks + 1;

  public IamDone: () ==> ()
  IamDone () == done := done + 1;

  wait: () ==> ()
  wait () == skip;

  public LetsEat: () ==> ()
  LetsEat () ==
   ( startlist(guests); wait() )

sync
   per takeFork => forks > 0;
   per wait => done = card guests;
   mutex(takeFork,releaseFork);
   mutex(IamDone)

end Table
            
~~~
{% endraw %}

