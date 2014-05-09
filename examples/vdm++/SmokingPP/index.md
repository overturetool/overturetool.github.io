---
layout: default
title: Smoking
---

~~~

#******************************************************#  AUTOMATED TEST SETTINGS#------------------------------------------------------#LANGUAGE_VERSION=classic#INV_CHECKS=true#POST_CHECKS=true#PRE_CHECKS=true#DYNAMIC_TYPE_CHECKS=true#SUPPRESS_WARNINGS=false#EXPECTED_RESULT=NO_ERROR_TYPE_CHECK#ENCODING=#DOCUMENT=#LIB=#AUTHOR=#******************************************************
~~~
###Agent.vdmpp

{% raw %}
~~~
class Agent
values  thing_l = [<Tobacco>, <Paper>, <Match>]
instance variables  timer : nat := 0;  table : Table;
operations
public Agent: Table ==> AgentAgent(tab) ==  table := tab;
public GetTime: () ==> natGetTime() ==  return timer;
public AddTobacco : () ==> boolAddTobacco() == (  if table.AddElement(thing_l(1)) then  ( 	World`graphics.tobaccoAdded();	return true;  );
  return false;);
public AddPaper : () ==> boolAddPaper() == (  if table.AddElement(thing_l(2)) then  ( 	World`graphics.paperAdded();	return true;  );
  return false;);
public AddMatch : () ==> boolAddMatch() == (  if table.AddElement(thing_l(3)) then  ( 	World`graphics.matchAdded();	return true;  );
  return false;);
end Agent
~~~{% endraw %}

###gui_Graphics.vdmpp

{% raw %}
~~~
class gui_Graphics	operations
    public init : () ==> ()	init() == is not yet specified;
	public tobaccoAdded : () ==> ()	tobaccoAdded() == is not yet specified; 
	public paperAdded : () ==> ()	paperAdded() == is not yet specified; 
	public matchAdded : () ==> ()	matchAdded() == is not yet specified; 
	public tableCleared : () ==> ()	tableCleared() == is not yet specified;  
	public nowSmoking : nat ==> ()	nowSmoking(smokerNumber) == is not yet specified;
	functions	public static ElementToNat : Table`Element -> nat    ElementToNat(elm) == 		cases elm:			<Tobacco> -> 1,			<Paper> -> 2,			<Match> -> 3	 	end;
end gui_Graphics

~~~{% endraw %}

###Smoker.vdmpp

{% raw %}
~~~
class Smoker
instance variables  smokerName : seq of char;   elements: set of Table`Element;  orig_element : Table`Element;  cigarettes : nat := 0;  --inv cigarettes in set {0,1};  table : Table;
operations
public Smoker: seq of char * Table`Element * Table ==> SmokerSmoker(name ,element,tab) == (  smokerName := name;  elements := {element};  orig_element := element;  table := tab);
Roll: () ==> ()Roll() == (  World`graphics.nowSmoking(gui_Graphics`ElementToNat(orig_element));  IO`print(smokerName ^ " rolling ");    elements := {};  cigarettes := cigarettes + 1  )pre card elements = 3;
Smoke: () ==> ()Smoke() ==(  IO`print("and smoking \n");   cigarettes := cigarettes - 1;  elements := {orig_element};);
thread  while true do (    elements := elements union table.TakeElements(elements);    Roll();    Smoke()  )
syncper Smoke => cigarettes > 0;
end Smoker
~~~{% endraw %}

###Table.vdmpp

{% raw %}
~~~
class Table
types
public Element = <Tobacco> | <Paper> | <Match>;
instance variables  elements : set of Element := {};  inv card elements <= 3 
operations
public AddElement:  Element ==> boolAddElement(es) ==  if(es not in set elements) then  (   	elements := elements union {es}; 	return true;  )  else 	return false;
private ExtraElement: () ==> set of ElementExtraElement() ==   let es = elements  in (       elements := {};        World`graphics.tableCleared();        IO`print("table clear");       return es);
public TakeElements: set of Element ==> set of ElementTakeElements(es) == (
  let e in set es    in       cases e:           <Tobacco> -> MissingPM(),        <Paper> -> MissingTM(),        <Match> -> MissingTP()       end;
    ExtraElement();)pre card es = 1;
MissingPM : () ==> ()MissingPM() == skip;
MissingTM : () ==> ()MissingTM() == skip;
MissingTP : () ==> ()MissingTP() == skip;
syncper MissingPM => elements = {<Paper>,<Match>};  per MissingTM => elements = {<Tobacco>,<Match>};    per MissingTP => elements = {<Tobacco>, <Paper>};  
--per AddElements => elements = {};--per TakeElements => card elements = 2;
end Table
~~~{% endraw %}

###World.vdmpp

{% raw %}
~~~
class World
instance variablespublic static graphics : gui_Graphics:= new gui_Graphics();
table: Table := new Table();public agent: Agent := new Agent(table);smokers : set of Smoker := {new Smoker("Smoker 1", <Tobacco>, table),                            new Smoker("Smoker 2", <Paper>, table),                            new Smoker("Smoker 3", <Match>, table)};limit : nat;finished : bool := false;
operations
public World: nat ==> WorldWorld(simtime) ==(  IO`print("World Ctor");  limit := simtime;
);
public Yield: () ==> ()Yield() == skip;
Finished: () ==> natFinished() ==  agent.GetTime();
public Run: () ==> ()Run() ==(   startlist(smokers);    graphics.init(); )
thread(while agent.GetTime() <= limit do  skip;   finished := true)
sync
per Finished => finished;end World
~~~{% endraw %}

