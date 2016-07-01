---
layout: default
title: SortingParcelsPP
---

## SortingParcelsPP
Author: Bjarke Møholt


The purpose of this VDM++ model is to analyse the rules governing for
distributing parcels with different kinds of goods is a
warehouse. This model is made by Bjarke Møholt as a small mini-project
in a course on "Modelling of Mission Critical Systems" (see
https://services.brics.dk/java/courseadmin/TOMoMi/pages/Modelling+of+Mission+Critical+Systems).


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new Test().Run()|


### Colli.vdmpp

{% raw %}
~~~

class Colli

functions

instance variables

ID : int := 0;
destination : int := 0;

operations

public Colli: int * int ==> Colli
Colli(id, dest) ==
(
ID := id;
destination := dest;
);

public getDestination : () ==> int
getDestination() ==
  return destination;

public getID : () ==> int
getID() == return ID;

public setID : int ==> ()
setID(id) == ID := id;

public setDestination : int ==> ()
setDestination(dest) == destination := dest;

end Colli
~~~
{% endraw %}

### Conveyor.vdmpp

{% raw %}
~~~
class Conveyor
 
functions

instance variables
goods : seq of Colli := [];
slides : seq of Slide := [];
inv forall a,b in set inds slides & 
 a<>b => slides(a).getID() <> slides(b).getID();

operations

 public addColli : Colli ==> ()
 addColli(elem) == goods := goods ^ [elem];

 public addSlide : Slide ==> ()
 addSlide(elem) == slides := slides ^ [elem]
pre forall a in set inds slides & elem.getID() <> slides(a).getID();

 public getSlides : () ==> seq of Slide
 getSlides() == return slides;

 public
 distributeGoods : () ==> ()
 distributeGoods() ==
 (dcl doomed : set of Colli := {};
  for all x in set inds goods do 
   for all y in set inds slides do 
    if goods(x).getDestination() = slides(y).getID() 
    then --hvis destination matcher slisk ID
    (slides(y).addGoods(goods(x));
     doomed := doomed union {goods(x)};
    );
  for all i in set doomed do 
   removeGoods(i);
 );

 public removeGoods : Colli ==> ()
 removeGoods(elem) ==
  (goods := [goods(x)|x in set inds goods & goods(x) <> elem ]
    --build a new sequence of all the elements <> input
   --IO`print( "removeGoods called, goods: \n");
   --IO`print(goods);
  );

 public checkForUndeliverableGoods : () ==> set of Colli
 checkForUndeliverableGoods() ==
 (
  return {goods(x)|x in set inds goods & 
   not exists s in set inds slides &
   slides(s).getID() = goods(x).getDestination() };
 );

--print methods for testing
 public printColli : () ==> ()
 printColli()==
 for all x in set inds goods do
 (IO`print( goods(x).getID() );
  IO`print("\t");
 );

 public printSlides : () ==> ()
 printSlides()==
 for all x in set inds slides do
 (IO`print(slides(x).getID() );
  IO`print("\t");
 );

end Conveyor
  
~~~
{% endraw %}

### Slide.vdmpp

{% raw %}
~~~
class Slide

functions

instance variables
 goods: set of Colli := {};
 ID : int := 0;

operations

public Slide : int ==> Slide
Slide(id) == ID := id;

pure public getID : () ==> int
getID() ==
 return ID;

public addGoods : Colli ==> ()
addGoods(elem) ==
goods := goods union {elem};

public setID : int ==> ()
setID(id) == ID := id;

public printColli : () ==> ()
printColli()==
for all x in set goods do (
 IO`print("\t");
 IO`print(x.getID() );
);

end Slide
~~~
{% endraw %}

### test.vdmpp

{% raw %}
~~~
class Test

instance variables

goods : set of Colli := {new Colli(0,0),
                         new Colli(1,1),
                         new Colli(2,2),
                         new Colli(3,3), --bad colli
                         new Colli(4,0),
                         new Colli(359,14) }; --bad colli
slides : set of Slide := {new Slide(0),
                          new Slide(1),
                          new Slide(2) };
--test inv and precondition
conveyor : Conveyor := new Conveyor();

operations
public Run : () ==> ()
Run() ==
(dcl temp : set of Colli := {};
 for all x in set goods do
   conveyor.addColli(x);

 for all y in set slides do
   conveyor.addSlide(y);

 IO`print("\nTest started..");

 IO`print("\ngoods in conveyor:\n");
 conveyor.printColli();
 IO`print("\nslides in conveyor:\n");
 conveyor.printSlides();

 for all s in set elems conveyor.getSlides() do
 (IO`print("\nSlide ID:\t");
  IO`print(s.getID() );
  IO`print(" has goods:");
  s.printColli();
 );

 IO`print("\n\n..Distributing goods!\n");
 conveyor.distributeGoods();

 IO`print("\ngoods in conveyor:\n");
 conveyor.printColli();
 IO`print("\nslides in conveyor:\n");
 conveyor.printSlides();

 for all s in set elems conveyor.getSlides() do
 (IO`print("\nSlide ID:\t");
  IO`print(s.getID() );
  IO`print(" has goods:");
  s.printColli();
 );

 temp := conveyor.checkForUndeliverableGoods();

 IO`print("\nundeliverable goods:\t");
 for all s in set temp do
 (IO`print(s.getID());
  IO`print("\t");
 );

);

end Test
~~~
{% endraw %}

