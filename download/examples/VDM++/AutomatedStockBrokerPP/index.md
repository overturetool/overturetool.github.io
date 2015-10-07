---
layout: default
title: AutomatedStockBrokerPP
---

## AutomatedStockBrokerPP
Author: Anders Kaels Malmos


The system is an automated stock broker, where you can specify a list
of stocks which automaticly, can either be bought or sold. This is
done by defining a prioritised list of stocks to observe, which each
has defined a trigger that tells in which situation the system should
react with either a buy or a sell action. The trigger is a rule
defined upon the history and the current value of the stock. This
model is made by Anders Kaels Malmos as a small mini-project in a
course on "Modelling of Mission Critical Systems" (see
https://services.brics.dk/java/courseadmin/TOMoMi/pages/Modelling+of+Mission+Critical+Systems). 

More information about the model and the purpose of it can be found in
the ProjectReport.pdf file included in the zip file with the source files.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new World().Run()|


### timer.vdmpp

{% raw %}
~~~
class Timer 

instance variables

  currentTime : nat := 1;

values 

  stepLength : nat = 1;

operations

public 
  StepTime: () ==> ()
  StepTime() == 
    currentTime := currentTime + stepLength;

public
  GetTime: () ==> nat 
  GetTime() == return currentTime;

end Timer
~~~
{% endraw %}

### Stock.vdmpp

{% raw %}
~~~
class Stock is subclass of GLOBAL
 types
  
  public RateOfChange = <positive> | <negative> | <constant>;  
  
 instance variables
  name : StockIdentifier;
  valueHistory : seq of StockValue;
  currentRateOfChange : [RateOfChange]; 
 operations
  
  public Stock: StockIdentifier * StockValue ==> Stock
  Stock(n,startValue) == (
   valueHistory := [];
   valueHistory := [startValue] ^ valueHistory; 
   name := n;
   currentRateOfChange := nil;  
  ); 

  public UpdateStock:() ==> ()
  UpdateStock() == (
   
   currentRateOfChange :=
   cases currentRateOfChange:
    nil -> InitialRateOfChange(hd valueHistory),
    others -> NextRateOfChange(currentRateOfChange, hd valueHistory)
   end;   

   cases currentRateOfChange:
    <positive> -> valueHistory := [hd valueHistory + 1] ^ valueHistory,  
    <negative> -> valueHistory := [hd valueHistory - 1] ^ valueHistory,
    <constant> -> valueHistory := [hd valueHistory] ^ valueHistory
   end;
  )
  pre len valueHistory >= 1
  post (currentRateOfChange = <positive> => valueHistory(1) > valueHistory(2))
   and (currentRateOfChange = <negative> => valueHistory(1) < valueHistory(2))
   and (currentRateOfChange = <constant> => valueHistory(1) = valueHistory(2))
   and hd valueHistory >= 0;

  pure public GetName: () ==> StockIdentifier 
  GetName() == 
   return name; 

  pure public GetCurrentValue : () ==> StockValue 
  GetCurrentValue() == 
   return hd valueHistory; 

  pure public GetValueHistory : () ==> seq of StockValue 
  GetValueHistory() == (
   return valueHistory; 
  );
   
  InitialRateOfChange : (StockValue) ==> RateOfChange
  InitialRateOfChange(sv) == 
   let r = MATH`rand(21) mod 3 
   in
    return 
    if(sv > 0)
    then
     cases r:
      0 -> <positive>,
      1 -> <negative>,
      2 -> <constant>
     end
    else 
     cases r:
      0 -> <positive>,
      1 -> <positive>,
      2 -> <constant>
     end;

  NextRateOfChange : RateOfChange * StockValue ==> RateOfChange
  NextRateOfChange(roc,sv) == 
   let r = MATH`rand(10), 
    other = MakelistFromSet({x | x : RateOfChange & x <> roc and (x=<negative> => sv > 0) })   
   in
    return 
    if r >= 0 and r <= 7 and (roc = <negative> => sv > 0)  
    then roc
    else  
     other((MATH`rand(20) mod len other) + 1);

  MakelistFromSet : set of RateOfChange ==> seq of RateOfChange
  MakelistFromSet(roc) ==
   return
   if( card roc > 0) then 
    let r in set roc 
     in 
     [r] ^ MakelistFromSet(roc \ {r})
   else []

end Stock
~~~
{% endraw %}

### StockWatcher.vdmpp

{% raw %}
~~~
class StockWatcher is subclass of GLOBAL
 
 instance variables
  eventHistory : seq of Event;
  stockRecord : StockRecord;
  sm : [StockMarket];
  currentlyTriggeredAction : [ActionType];
  
  inv  eventHistory(len eventHistory).Type = <EntersNoActionRegion> 
    and 
   forall e in set inds eventHistory & e <> len eventHistory => 
      (eventHistory(e).Type = <LeavesNoActionRegion> => eventHistory(e + 1).Type = <LowerLimit>
                or eventHistory(e + 1).Type = <UpperLimit>)
      and
      (eventHistory(e).Type = <EntersNoActionRegion> => eventHistory(e + 1).Type = <LeavesNoActionRegion>
                  or eventHistory(e + 1).Type = <Valley>
                  or eventHistory(e + 1).Type = <Peak>);

 operations
  public StockWatcher: StockRecord * seq of Event ==> StockWatcher
  StockWatcher(sr, predefinedEvents) == (
   eventHistory := predefinedEvents;
   sm := nil;
   stockRecord := sr;
   currentlyTriggeredAction := nil;   
  )
  pre let val = predefinedEvents(len predefinedEvents).Value 
      in 
        IsInRegion(val,sr.NoActionReg);

  public StockWatcher: StockRecord ==> StockWatcher
  StockWatcher(sr) == (
   sm := World`stockMarket;
   stockRecord := sr;
   eventHistory := [mk_Event(<EntersNoActionRegion>,0,
     sm.GetStock(stockRecord.Name).GetCurrentValue())];
   currentlyTriggeredAction := nil;   
  )
  pre (sr.Name in set World`stockMarket.GetStockNames()) 
   and
    let val = World`stockMarket.GetStock(sr.Name).GetCurrentValue() 
    in 
     IsInRegion(val,sr.NoActionReg);

  UpdateEvents : nat ==> ()
  UpdateEvents(time) == 
   let stock = sm.GetStock(stockRecord.Name)
    in
     let stockHistory = stock.GetValueHistory(), reg = stockRecord.NoActionReg, 
         l = reg.LowerValue, u = reg.UpperValue, cv = stock.GetCurrentValue() 
      in
      (if IsInRegion(hd stockHistory, reg) and
          not IsInRegion(stockHistory(2), reg)
       then eventHistory := [mk_Event(<EntersNoActionRegion>,time,cv)] ^ eventHistory
       elseif not IsInRegion(hd stockHistory, reg) and
              IsInRegion(stockHistory(2), reg)
       then eventHistory := [mk_Event(<LeavesNoActionRegion>,time,cv)] ^ eventHistory;
       
       if hd stockHistory = u and stockHistory(2)  <> u
       then eventHistory := [mk_Event(<UpperLimit>,time,cv)] ^ eventHistory
       elseif hd stockHistory = l
              and stockHistory(2) <> l
       then eventHistory := [mk_Event(<LowerLimit>,time,cv)] ^ eventHistory
       elseif not IsInRegion(hd stockHistory, reg) and IsPeak(stockHistory)
       then eventHistory := [mk_Event(<Peak>,time,cv)] ^ eventHistory
       elseif (not IsInRegion(hd stockHistory, reg)
              and IsValley(stockHistory) )
       then eventHistory := [mk_Event(<Valley>,time,cv)] ^ eventHistory;
            
       IO`print(eventHistory)
      ) 
  pre let stockHistory = sm.GetStock(stockRecord.Name).GetValueHistory() 
      in len stockHistory >= 2
  post eventHistory(len eventHistory).Type = <EntersNoActionRegion> 
    and 
   forall e in set inds eventHistory & e <> len eventHistory => 
      (eventHistory(e).Type = <LeavesNoActionRegion> => eventHistory(e + 1).Type = <LowerLimit>
                or eventHistory(e + 1).Type = <UpperLimit>)
      and
      (eventHistory(e).Type = <EntersNoActionRegion> => eventHistory(e + 1).Type = <LeavesNoActionRegion>
                  or eventHistory(e + 1).Type = <Valley>
                  or eventHistory(e + 1).Type = <Peak>);

  UpdateAction : nat ==> ()
  UpdateAction(tim) == 
   let actionTrigger = stockRecord.Triggers(stockRecord.State)
    in 
     currentlyTriggeredAction :=
        if IsActionTriggeredAtTime(tim,actionTrigger,eventHistory) and 
           not IsInRegion(GetStockValue(tim), stockRecord.NoActionReg) 
        then actionTrigger.Action
        else nil;

  public ObserveStock : nat ==> ()
  ObserveStock(time) == (
   if (World`simulate)
   then( UpdateEvents(time);)
   else skip;
 
   UpdateAction(time);
  )
  post NoActiveTriggerInNoActionRegion(GetStockValue(time),stockRecord.NoActionReg,currentlyTriggeredAction);

  public updateStockRecord : StockRecord ==> ()
  updateStockRecord(sr) == 
   stockRecord := sr;

  pure public GetStockValue : nat ==> StockValue
  GetStockValue(time) == 
   if World`simulate
   then return eventHistory(1).Value
   else return eventHistory(len eventHistory - time).Value
  pre len eventHistory > 0;
       
  pure public GetTriggeredAction : () ==> [ActionType]
  GetTriggeredAction() ==
   return currentlyTriggeredAction; 

 functions
  
  NoActiveTriggerInNoActionRegion: StockValue * Region * [ActionType]  -> bool
  NoActiveTriggerInNoActionRegion(sv,reg,at) == 
   IsInRegion(sv,reg) => at = nil;

  IsInRegion: StockValue * Region -> bool
  IsInRegion(sv,reg) == 
   let u = reg.UpperValue , l = reg.LowerValue
    in 
     sv >= l and sv <= u;
    
  IsPeak: seq of StockValue -> bool
  IsPeak(svs) == 
   let current = hd svs 
    in 
     let indicesOneAbove = {i | i in set inds svs & current+1 = svs(i) and i <> len svs} 
      in
       exists i in set indicesOneAbove & 
        forall v in set {2,...,i} & current+1 = svs(v)
        and 
        svs(i+1) = current;

  IsValley: seq of StockValue -> bool
  IsValley(svs) == 
   let current = hd svs 
    in 
     let indicesOneBelow = {i | i in set inds svs & current-1 = svs(i) and i <> len svs} 
      in
       exists i in set indicesOneBelow & 
        forall v in set {2,...,i} & current-1 = svs(v)
        and 
        svs(i+1) = current;

  FindLowestIndexFromTime: nat * seq of Event  -> nat1
  FindLowestIndexFromTime(time,events) == 
   let pastEvents = { x | x in set inds events & events(x).TimeStamp <= time  }
    in
     let i,j in set pastEvents be st (i <> j) => (events(i).TimeStamp <= events(j).TimeStamp)  
     in 
       i;

  public IsActionTriggeredAtTime: nat * ActionTrigger * seq of Event  -> bool
  IsActionTriggeredAtTime(time,action,eventHistory) == 
   let tgr = action.Trigger
    in
     let index = FindLowestIndexFromTime(time,eventHistory),
         s = eventHistory(index,...,index + len tgr - 1)
      in
      ((forall i in set inds s & s(i).Type = tgr(i))
      and (s(1).TimeStamp = time)
      and len s = len tgr)
   
end StockWatcher
~~~
{% endraw %}

### StockMarket.vdmpp

{% raw %}
~~~
class StockMarket is subclass of GLOBAL

 instance variables
  stocks : map StockIdentifier to Stock := {|->};

 operations
  public UpdateStocks:() ==> ()
  UpdateStocks() == 
   for all stock in set rng stocks do
    stock.UpdateStock();

  public AddStock:(Stock )==> ()
  AddStock(stock) == 
   stocks := {stock.GetName() |-> stock} munion stocks
  pre stock.GetName() not in set dom stocks
  post stock.GetName() in set dom stocks; 

  public RemoveStock:(Stock )==> ()
  RemoveStock(stock) == 
   stocks := {stock.GetName()} <-: stocks
  pre stock.GetName() in set dom stocks
  post stock.GetName() not in set dom stocks;

  pure public GetStock:(StockIdentifier)==> Stock 
  GetStock(name) == 
   return stocks(name)
  pre name in set dom stocks;

  pure public GetStockNames: () ==> set of StockIdentifier 
  GetStockNames() ==
   return dom stocks;
  
end StockMarket
~~~
{% endraw %}

### GLOBAL.vdmpp

{% raw %}
~~~
class GLOBAL
types
public String = seq of char;

public EventType = <UpperLimit> | <LowerLimit> | <Peak> | <Valley> | 
<EntersNoActionRegion> | <LeavesNoActionRegion>;

public StockState = <PotentialBuy> | <Bought>;

public Event :: Type : EventType
TimeStamp : nat
Value : nat; 

public Region :: UpperValue : StockValue
  LowerValue : StockValue
inv mk_Region(p1,p2) == p1 >= p2;

public StockValue = nat;
public StockIdentifier = token;

public ActionType = <Buy> | <Sell> ;

public ActionTrigger :: Trigger : seq of EventType
Action : ActionType;

public StockRecord :: Name : StockIdentifier 
Triggers : map StockState to ActionTrigger 
NoActionReg : Region
Cost : StockValue
State : StockState

inv mk_StockRecord(p1,p2,p3,p4,p5) == p2(<PotentialBuy>).Action = <Buy> 
and p2(<Bought>).Action = <Sell>;

public ActionEvent :: Type : ActionType
  Time : nat
  StockName : StockIdentifier
  Value : StockValue;
 
values
public static testValues : map StockIdentifier to seq of Event = 
{mk_token("test") |-> [
mk_Event(<LeavesNoActionRegion>,6,5),
mk_Event(<LowerLimit>,5,8),
mk_Event(<UpperLimit>,4,12),
mk_Event(<EntersNoActionRegion>,3,11),
mk_Event(<LeavesNoActionRegion>,2,13),
mk_Event(<UpperLimit>,1,12),  
mk_Event(<EntersNoActionRegion>,0,10)
],
mk_token("test12") |-> [
mk_Event(<LeavesNoActionRegion>,6,5),
mk_Event(<LowerLimit>,5,8),
mk_Event(<UpperLimit>,4,12),
mk_Event(<EntersNoActionRegion>,3,11),
mk_Event(<LeavesNoActionRegion>,2,16),
mk_Event(<UpperLimit>,1,12),  
mk_Event(<EntersNoActionRegion>,0,10)
],
mk_token("test2") |-> [
mk_Event(<LeavesNoActionRegion>,6,5),
mk_Event(<UpperLimit>,5,8),
mk_Event(<LowerLimit>,4,8),
mk_Event(<EntersNoActionRegion>,3,11),
mk_Event(<LeavesNoActionRegion>,2,6),
mk_Event(<LowerLimit>,1,8),  
mk_Event(<EntersNoActionRegion>,0,10)
]};

end GLOBAL
~~~
{% endraw %}

### World.vdmpp

{% raw %}
~~~
class World is subclass of GLOBAL
 
values
 simTime : nat = 100; 
 actionsLimit : nat = 4;
 startCash : nat = 100;
 public static simulate : bool = false;
 
instance variables  

 public static timerRef : Timer := new Timer();

 public static stockMarket : StockMarket := new StockMarket();
 asb : AutomatedStockBroker := new AutomatedStockBroker(startCash);  
   
operations

public isFinished : () ==> bool
 isFinished() == 
    return (not len asb.GetActionLog() < actionsLimit) or 
           (not timerRef.GetTime() <= simTime);

 public Run : () ==> ()
 Run() ==
 ( 
  stockMarket.AddStock(new Stock(mk_token("test"),10));
  stockMarket.AddStock(new Stock(mk_token("test12"),10));
  stockMarket.AddStock(new Stock(mk_token("test2"),10));

  (dcl r1 : StockRecord := mk_StockRecord(mk_token("test"),
     { <PotentialBuy> |-> mk_ActionTrigger([<LeavesNoActionRegion>,<LowerLimit>],<Buy>),
       <Bought> |-> mk_ActionTrigger([<LeavesNoActionRegion>,<UpperLimit>],<Sell>)},
        mk_Region(12,8),10,<Bought>),
    r2 : StockRecord := mk_StockRecord(mk_token("test12"),
     { <PotentialBuy> |-> mk_ActionTrigger([<LeavesNoActionRegion>,<LowerLimit>],<Buy>),
       <Bought> |-> mk_ActionTrigger([<LeavesNoActionRegion>,<UpperLimit>],<Sell>)},
        mk_Region(12,8),10,<Bought>),

   r3 : StockRecord := mk_StockRecord(mk_token("test2"),
     { <PotentialBuy> |-> mk_ActionTrigger([<LeavesNoActionRegion>,<LowerLimit>],<Buy>),
       <Bought> |-> mk_ActionTrigger([<LeavesNoActionRegion>,<UpperLimit>],<Sell>)},
        mk_Region(12,8),0,<PotentialBuy>);

   asb.AddStock(r1,1);
   asb.AddStock(r2,2);
   asb.AddStock(r3,3);
   
   while not isFinished()
   do 
   (
    IO`print("step : ");
    IO`print(timerRef.GetTime());
    IO`print("\n");
 
    stockMarket.UpdateStocks();
 
    asb.Step(timerRef.GetTime());
       timerRef.StepTime();
   );
  )
 );
functions
 public FindSmallestSeqLen: map String to seq of Event -> nat
 FindSmallestSeqLen(m) == 
 let x,y in set {len m(x) | x in set dom m} be st x <> y => x <= y in x; 

end World
~~~
{% endraw %}

### AutomatedStockBroker.vdmpp

{% raw %}
~~~
class AutomatedStockBroker is subclass of GLOBAL
  
instance variables
  stocks : seq of StockRecord;
  stockWatchers : map StockIdentifier to StockWatcher;
  actionLog : seq of ActionEvent := [];
  balance : int;
  inv balance >= 0;
  -- no stock can have the same name  
  inv forall x,y in set inds stocks & x <> y => stocks(x).Name <> stocks(y).Name;

  --says that foreach ActionEvent in the log if there exist a next action with the same 
  --Stock name, it should have a different ActionType. this insures that you dont sell or buy the same
  --two times in a row
  inv let stockIdentifiers = {si.Name | si in set elems stocks}
      in 
        forall stockIdentifier in set stockIdentifiers & 
          let allEventsStock = [ actionLog(i) | i in set inds actionLog 
                                              & actionLog(i).StockName = stockIdentifier]
          in 
            (forall e in set inds allEventsStock & 
               (e <> len allEventsStock) => 
               (allEventsStock(e).Type <> allEventsStock(e+1).Type)); 
       
  inv MaxOneOfEachActionTypePerTime(actionLog);    
  

operations

public AutomatedStockBroker: nat ==> AutomatedStockBroker
AutomatedStockBroker(startCash) == (
  balance := startCash;
  stocks := [];
  stockWatchers := {|->};
);

public AddStock: StockRecord * nat1 ==> ()
AddStock(sRecord,priority) == (
  stocks := stocks(1,...,priority-1) ^ [sRecord] 
            ^ stocks(priority+1,...,len stocks);
  if (World`simulate)
  then stockWatchers(sRecord.Name) := new StockWatcher(sRecord)
  else stockWatchers(sRecord.Name) := new StockWatcher(sRecord,testValues(sRecord.Name));
)
pre sRecord.Name not in set { x.Name | x in set elems stocks}
post (sRecord.Name in set dom stockWatchers) 
     and (sRecord = stocks(priority)); 
  
public GetActionLog:() ==> seq of ActionEvent
GetActionLog() == 
  return actionLog;
  
public GetStocksWithActiveActionTrigger: StockState ==> seq of StockRecord
GetStocksWithActiveActionTrigger(ss) == 
  return [stocks(s) | s in set inds stocks  
                    & (stockWatchers(stocks(s).Name).GetTriggeredAction() <> nil)
                      and (stocks(s).State = ss)]
post let res = RESULT in forall i in set inds res & res(i).State = ss;
  
FindValidBuy: seq of StockRecord * nat ==> [StockRecord]
FindValidBuy(potBuys,time) ==  
  return let affordableStocks = 
    [potBuys(x) | x in set inds potBuys & CanAfford(potBuys(x),balance)]
     in 
     (
      if(len affordableStocks > 0)
      then let x in set inds affordableStocks be st  
       (forall y in set inds affordableStocks & (stockWatchers(affordableStocks(x).Name).GetStockValue(time)) >= 
       (stockWatchers(affordableStocks(y).Name).GetStockValue(time)))
       in affordableStocks(x)
      else nil 
     );
    
FindValidSell: seq of StockRecord * nat ==> StockRecord
FindValidSell(potSells,time) == 
  return let x in set inds potSells be st  
    (forall y in set inds potSells & 
      (stockWatchers(potSells(x).Name).GetStockValue(time) - potSells(x).Cost) >= 
      (stockWatchers(potSells(y).Name).GetStockValue(time) - potSells(y).Cost))
    in potSells(x)  
pre len potSells > 0
post IsGTAll(stockWatchers(RESULT.Name).GetStockValue(time) - RESULT.Cost,
  {stockWatchers(x.Name).GetStockValue(time) - x.Cost | x in set elems potSells});

  PerformBuy: StockRecord * nat ==> ()
  PerformBuy(potAction,time) == 
   let sw = stockWatchers(potAction.Name),value = sw.GetStockValue(time)  
   in
   (
    actionLog := [mk_ActionEvent(<Buy>,time,potAction.Name,value)] ^ actionLog;
    balance := balance - value;

    let i in set inds stocks be st stocks(i).Name = potAction.Name
     in
    (
     stocks(i) := mu(potAction, State |-> <Bought>, Cost |-> value );
     sw.updateStockRecord(stocks(i))
    ) 
   )
  pre potAction.State = <PotentialBuy> and 
   stockWatchers(potAction.Name).GetTriggeredAction() = <Buy>
  post balance >= 0;

  PerformSell: StockRecord * nat ==> ()
  PerformSell(potAction,time) == 
   let sw = stockWatchers(potAction.Name),value = sw.GetStockValue(time) 
   in
   (
    actionLog := [mk_ActionEvent(<Sell>,time,potAction.Name,value)] ^ actionLog;
    balance := balance + value;
    
    let i in set inds stocks be st stocks(i).Name = potAction.Name
     in
    (
     stocks(i) := mu(potAction, State |-> <PotentialBuy>, Cost |-> 0);
     sw.updateStockRecord(stocks(i))
    ) 
   )
  pre potAction.State = <Bought> and 
   stockWatchers(potAction.Name).GetTriggeredAction() = <Sell>  
  post balance >= 0;
  
  ObserveAllStocks: nat ==> ()
  ObserveAllStocks(time) == 
   for all i in set inds stocks do
    let stock = stocks(i), csw = stockWatchers(stock.Name)
     in csw.ObserveStock(time);

  public Step: nat ==> ()
  Step(time) == (

   ObserveAllStocks(time);
      
   let potBuys = GetStocksWithActiveActionTrigger(<PotentialBuy>) , 
    potSells = GetStocksWithActiveActionTrigger(<Bought>),
    validBuy = FindValidBuy(potBuys,time)
    in
    (
     if(len potSells > 0)
     then (PerformSell(FindValidSell(potSells,time), time);)
     else skip;
     IO`print("\npot sels : ");
     IO`print(potSells);

     if(validBuy <> nil)
     then (PerformBuy(validBuy, time);)
     else skip;
     IO`print("\npot buys : ");
     IO`print(potBuys);
    );  
   
   IO`print("\n");
   IO`print("Finished step : ");
   IO`print(time);
   IO`print(" with actionLog : ");
   IO`print(actionLog);
   IO`print(" and Balance : ");
   IO`print(balance);
   IO`print("\n");
  )
  post MaxOneOfEachActionTypePerTime(actionLog);

functions

IsGTAll: int * set of int -> bool
IsGTAll(sv,ssv) == 
  forall i in set ssv & sv >= i;

CanAfford: StockRecord * nat -> bool
CanAfford(sr,balance) == 
  sr.Cost <= balance;
    
MaxOneOfEachActionTypePerTime: seq of ActionEvent -> bool
MaxOneOfEachActionTypePerTime(actionLog) == 
  forall x,y in set inds actionLog & 
     (x <> y and actionLog(x).Time = actionLog(y).Time) => 
     (actionLog(x).Type <> actionLog(y).Type)

end AutomatedStockBroker
~~~
{% endraw %}

