---
layout: default
title: CashDispenserPP
---

##CashDispenserPP
Author: Sten Agerholm, Peter Gorm Larsen and Kim Sunesen


This model is described in the sequential subset of VDM++. 
This enables abstraction from design considerations and ensures 
maximum focus on high-level, precise and systematic analysis. This
was developed by Sten Agerholm, Peter Gorm Larsen and Kim Sunesen 
in 1999 in connection with FM'99.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new SimpleTest().Run()|


###Account.vdmpp

{% raw %}
~~~

class Account
instance variables  cards : map Card`CardId to Cardholder;  balance : nat;  transactions : seq of Transaction := [];
  inv TransactionsInvariant(transactions);
values  dailyLimit : nat = 2000;
types  public AccountId = nat;  public Transaction :: date : Clock`Date                 cardId : Card`CardId                 amount : nat;
operations  ValidTransaction : Transaction ==> bool  ValidTransaction(transaction) ==    is not yet specified;
public Create : map Card`CardId to Cardholder * nat ==> Account  Create(cs,b) ==    (cards := cs;     balance := b;     return self);
  public GetBalance : () ==> nat  GetBalance() ==    return balance;
  public Withdrawal : Card`CardId * nat * Clock`Date ==> bool  Withdrawal(cardId,amount,date) ==    let transaction = mk_Transaction(date,cardId,amount)    in      if balance - amount >= 0 and         DateTotal(date,transactions^[transaction]) <= dailyLimit      then       (balance := balance - amount;        transactions := transactions ^ [transaction];        return true)      else        return false  pre cardId in set dom cards;
  public MakeStatement : Card`CardId * Clock`Date ==> Letter  MakeStatement(cardId,date) ==    let nm = cards(cardId).GetName(),        addr = cards(cardId).GetAddress()    in      (dcl letter : Letter := new Letter();       letter.Create(nm,addr,date,transactions,balance))  pre cardId in set dom cards;
  public GetCardIds: () ==> set of Card`CardId  GetCardIds() ==    return dom cards;
  public AddCard : Card`CardId * Cardholder ==> ()  AddCard(cId,ch) ==    cards := cards munion {cId |-> ch}  pre cId not in set dom cards;
  public RemoveCard : Card`CardId ==> ()  RemoveCard(cId) ==    cards := {cId} <-: cards  pre cId in set dom cards;
functions  TransactionsInvariant: seq of Transaction +> bool  TransactionsInvariant(ts) ==    forall date in set {ts(i).date | i in set inds ts} &      DateTotal(date,ts) <= dailyLimit;
  DateTotal : Clock`Date * seq of Transaction +> nat  DateTotal(date,ts) ==    Sum([ts(i).amount | i in set inds ts & ts(i).date = date]);
  Sum: seq of real +> real  Sum(rs) ==    if rs = [] then 0    else      hd rs + Sum(tl rs);
end Account

~~~
{% endraw %}

###Card.vdmpp

{% raw %}
~~~

class Card
types  public CardId = nat;  public Code = nat;  public PinCode = nat;
instance variables  code : Code;  cardId : CardId;  accountId : Account`AccountId;
operations  public Card : Code * CardId * Account`AccountId ==> Card  Card(c,cid,a) ==    (code := c;     cardId := cid;     accountId := a);
  public GetCode : () ==> Code  GetCode() ==    return code;
  public GetAccountId : () ==> Account`AccountId  GetAccountId() ==    return accountId;
  public GetCardId : () ==> CardId  GetCardId() ==    return cardId;
end Card

~~~
{% endraw %}

###CardHolder.vdmpp

{% raw %}
~~~

class Cardholder
types  public Address = seq of char;  public Name = seq of char;
instance variables  name : Name;  address : Address;
operations  public Create : Name * Address ==> Cardholder  Create(nm,addr) ==    (name := nm;     address := addr;     return self);
  public GetName : () ==> Name   GetName () ==    return name;
  public GetAddress : () ==> Address   GetAddress() ==    return address;
end Cardholder

~~~
{% endraw %}

###CentralResource.vdmpp

{% raw %}
~~~

class CentralResource
instance variables  accounts      : map Account`AccountId to Account := {|->};  numberOfTries : map Card`CardId to nat := {|->};  illegalCards  : set of Card`CardId := {};inv dom numberOfTries union illegalCards subset     dunion {acc.GetCardIds() | acc in set rng accounts};
  letterbox     : Letterbox;  clock         : Clock;
  inv forall acc1,acc2 in set rng accounts &          acc1 <> acc2 =>          acc1.GetCardIds() inter acc2.GetCardIds() = {};
values  maxNumberOfTries : nat = 3;
operations  public AddLetterbox : Clock * Letterbox ==> ()  AddLetterbox(c,l) ==    (clock := c;     letterbox := l);
  public GetBalance : Account`AccountId ==> [nat]  GetBalance(accountId) ==    if accountId in set dom accounts then      accounts(accountId).GetBalance()    else      return nil;
  public Withdrawal : Account`AccountId * Card`CardId * nat ==> bool  Withdrawal(accountId,cardId,amount) ==    if IsLegalCard(accountId,cardId) then      accounts(accountId).Withdrawal(cardId,amount,clock.GetDate())    else      return false;
  public PostStatement : Account`AccountId * Card`CardId ==> bool  PostStatement(accountId,cardId) ==    if IsLegalCard(accountId,cardId) then      (letterbox.PostStatement        (accounts(accountId).MakeStatement(cardId,clock.GetDate()));       return true)    else      return false;
  public IsLegalCard : Account`AccountId * Card`CardId ==> bool  IsLegalCard(accountId,cardId) ==    return      cardId not in set illegalCards and      accountId in set dom accounts and      cardId in set accounts(accountId).GetCardIds();
  public NumberOfTriesExceeded : Card`CardId ==> bool  NumberOfTriesExceeded(cardId) ==    return numberOfTries(cardId) >= maxNumberOfTries;
  public ResetNumberOfTries : Card`CardId ==> ()  ResetNumberOfTries(cardId) ==    numberOfTries(cardId) := 0;
  public IncrNumberOfTries : Card`CardId ==> ()  IncrNumberOfTries(cardId) ==    numberOfTries(cardId) := numberOfTries(cardId) + 1;
  public AddAccount : Account`AccountId * Account ==> ()  AddAccount(accId,acc) ==    atomic    (accounts := accounts ++ {accId |-> acc};     numberOfTries := numberOfTries ++                      {cId |-> 0 | cId in set acc.GetCardIds()};     )  pre accId not in set dom accounts;
  public AddIllegalCard : Card`CardId ==> ()  AddIllegalCard(cId) ==    illegalCards := illegalCards union {cId};
end CentralResource

~~~
{% endraw %}

###Clock.vdmpp

{% raw %}
~~~

class Clock
types  public Date = seq of char;
instance variables
  date : Date := "";
operations  public SetDate : Date ==> ()  SetDate(d) ==    date := d;
  public GetDate : () ==> Date  GetDate() ==    return date;
end Clock

~~~
{% endraw %}

###Letter.vdmpp

{% raw %}
~~~

class Letter
instance variables  public name : Cardholder`Name;  public address : Cardholder`Address;  public date : Clock`Date;  public transactions : seq of Account`Transaction;  public balance : nat
operations  public Create: Cardholder`Name * Cardholder`Address * Clock`Date *          seq of Account`Transaction * nat ==> Letter  Create(nm,addr,d,ts,b) ==    (name := nm;     address := addr;     date := d;     transactions := ts;     balance:= b;     return self);
end Letter

~~~
{% endraw %}

###Letterbox.vdmpp

{% raw %}
~~~

class Letterbox
instance variables  statements : seq of Letter := [];
operations  public PostStatement : Letter ==> ()  PostStatement(letter) ==     statements := statements ^ [letter];
  public GetLastStatement : () ==> Letter  GetLastStatement() ==     return statements(len statements)  pre statements <> [];
end Letterbox

~~~
{% endraw %}

###SimpleTest.vdmpp

{% raw %}
~~~
class SimpleTest
values
  c1 : Card = new Card(123456,1,1);  cards : set of Card = {c1};  resource : CentralResource = new CentralResource();  tills : map TillId to Till = {1 |-> new Till(resource)};
instance variables
  clock : Clock := new Clock();  letterbox : Letterbox := new Letterbox();
types
  public TillId = nat;
operations 
public Run : () ==> bool   Run () ==    (clock.SetDate("150999");    let peter = new Cardholder().Create("Peter Gorm Larsen", "Granvej 24")    in       let pglacc1 = new Account().Create({1 |-> peter},5000),           pglid1 = 1       in          (resource.AddAccount(pglid1,pglacc1);                   resource.AddLetterbox(clock, new Letterbox());          tills(1).InsertCard(c1);          if tills(1).Validate(123456) = <PinOk>          then return tills(1).MakeWithdrawal(800)          else return false;         );              );
end SimpleTest
~~~
{% endraw %}

###Event.vdmpp

{% raw %}
~~~

class Event
operations   public execute : System ==> Test`TestResult  execute(system) ==    is subclass responsibility;
end Event

~~~
{% endraw %}

###GetBalance.vdmpp

{% raw %}
~~~

class GetBalance is subclass of Event
instance variables
  tillid : System`TillId;
operations
  public Init : System`TillId ==> GetBalance  Init(tid) ==    (tillid := tid;     return self);
  public execute : System ==> Test`TestResult  execute(sys) ==    let till = sys.GetTill(tillid)    in      if till.CardValidated()      then till.GetBalance()      else return false;
end GetBalance

~~~
{% endraw %}

###IllegalCard.vdmpp

{% raw %}
~~~

class IllegalCard is subclass of Event
instance variables
  mycard   : Card`CardId;
operations
  public Init : Card`CardId ==> IllegalCard  Init(c) ==    (mycard := c;     return self);
  public execute : System ==> Test`TestResult  execute(sys) ==    (sys.GetResource().AddIllegalCard(mycard);     return true);
end IllegalCard

~~~
{% endraw %}

###InsertCard.vdmpp

{% raw %}
~~~

class InsertCard is subclass of Event
instance variables
  tillid : System`TillId;  mycard : Card;
operations
  public Init : System`TillId * Card ==> InsertCard  Init(tid, c) ==    (tillid := tid;     mycard := c;     return self);
  public execute : System ==> Test`TestResult  execute(sys) ==    (sys.GetTill(tillid).InsertCard(mycard);     return true);
end InsertCard

~~~
{% endraw %}

###ReturnCard.vdmpp

{% raw %}
~~~

class ReturnCard is subclass of Event
instance variables
  tillid : System`TillId;
operations
  public Init : System`TillId ==> ReturnCard  Init(tid) ==    (tillid := tid;     return self);
  public execute : System ==> Test`TestResult  execute(sys) ==    (let till = sys.GetTill(tillid)     in       if till.CardInside()       then till.ReturnCard()       else return false;     return true);
end ReturnCard

~~~
{% endraw %}

###SendStatement.vdmpp

{% raw %}
~~~

class SendStatement is subclass of Event
instance variables
  tillid : System`TillId;
operations  public Init : System`TillId ==> SendStatement  Init(tid) ==    (tillid := tid;     return self);
  public execute : System ==> Test`TestResult  execute(sys) ==    let till = sys.GetTill(tillid)    in      if till.CardValidated()      then till.RequestStatement()      else return false;
end SendStatement

~~~
{% endraw %}

###System.vdmpp

{% raw %}
~~~

class System
values
  c1 : Card = new Card(123456,1,1);  c2 : Card = new Card(123457,2,2);  c3 : Card = new Card(123458,3,3);  c4 : Card = new Card(123459,4,4);   c5 : Card = new Card(123460,5,5);  c6 : Card = new Card(123461,6,5);  c7 : Card = new Card(123462,7,5);  cards : set of Card = {c1,c2,c3,c4,c5,c6,c7};  resource : CentralResource = new CentralResource();  tills : map TillId to Till =                    {1 |-> new Till(resource),                    2 |-> new Till(resource),                    3 |-> new Till(resource)};
instance variables
  clock : Clock := new Clock();  letterbox : Letterbox := new Letterbox();
types
  public TillId = nat;
operations
  public GetTill: TillId ==> Till  GetTill(tid) ==    return tills(tid);
  public GetResource: () ==> CentralResource  GetResource() ==    return resource;
  public System: () ==> System  System() ==    (clock.SetDate("150999");    let peter = new Cardholder().Create("Peter Gorm Larsen",                                        "Granvej 24"),        paul = new Cardholder().Create("Paul Mukherjee",                                        "Rugaardsvej 47"),        sten = new Cardholder().Create("Sten Agerholm",                                        "Teisensvej ??"),        kim = new Cardholder().Create("Kim Sunesen",                                      "??"),        CSK = new Cardholder().Create("CSK","Forskerparken 10A")     in       let pglacc1 = new Account().Create({1 |-> peter},5000),           saacc1  = new Account().Create({2 |-> sten},0),           ksacc1  = new Account().Create({3 |-> kim},9000),           pmacc1  = new Account().Create({4 |-> paul},6000),           ifacc1  = new Account().Create({5 |-> peter,                                           6 |-> sten,                                           7 |-> CSK},70000),           pglid1 = 1,           said1  = 2,           ksid1  = 3,           pmid1  = 4,           ifid1  = 5       in          (resource.AddAccount(pglid1,pglacc1);          resource.AddAccount(said1,saacc1);                        resource.AddAccount(ksid1,ksacc1);          resource.AddAccount(pmid1,pmacc1);          resource.AddAccount(ifid1,ifacc1); --         tills := ; --         cards := {c1,c2,c3,c4,c5,c6,c7};          resource.AddLetterbox(clock,new Letterbox())));
traces
  T1: let c in set cards      in        let t in set rng tills        in          let p in set {123456,123457,123458,123459,123460,123461,123462}          in            (t.InsertCard(c);t.Validate(p);t.MakeWithdrawal(1000)) 
  T2: let c in set cards       in        let t1, t2 in set rng tills        in          let p in set {123456,123457,123458,123459,123460,123461,123462}          in            ((t1.InsertCard(c);               t2.InsertCard(c);              t1.Validate(p);              t1.MakeWithdrawal(1000);              t2.MakeWithdrawal(1000))|             (t1.Validate(p);              t1.MakeWithdrawal(3000)) )end System

~~~
{% endraw %}

###Test.vdmpp

{% raw %}
~~~

class Testtypes
  public TestResult = [bool | nat | <PinOk> | <PinNotOk> | <Retained>]
instance variables
  system : System := new System();
operations  public runTests : seq of Event ==> seq of TestResult  runTests(events) == (return [events(i).execute(system)         | i in set inds events ]);
  public runOneTest : Event ==> TestResult  runOneTest(event) ==  return event.execute(system);
end Test

~~~
{% endraw %}

###Validate.vdmpp

{% raw %}
~~~

class Validate is subclass of Event
instance variables
  tillid : System`TillId;  code : Card`PinCode;
operations  public Init : System`TillId * Card`PinCode ==> Validate  Init(tid, pin) ==    (tillid := tid;     code := pin;     return self);
  public execute : System ==> Test`TestResult  execute(sys) ==    sys.GetTill(tillid).Validate(code);
end Validate

~~~
{% endraw %}

###Withdrawal.vdmpp

{% raw %}
~~~

class Withdrawal is subclass of Event
instance variables
  tillid : System`TillId;  amount : nat;
operations  public Init : System`TillId * nat ==> Withdrawal  Init(t, a) ==    (tillid := t;     amount := a;     return self);
  public execute : System ==> Test`TestResult  execute(sys) ==    let till = sys.GetTill(tillid)    in      if till.CardValidated()      then till.MakeWithdrawal(amount)      else return false;
end Withdrawal

~~~
{% endraw %}

###Till.vdmpp

{% raw %}
~~~

class Till
instance variables  curCard : [Card] := nil;  cardOk : bool := false;  retainedCards : set of Card := {};  resource : CentralResource;
  inv curCard = nil => not cardOk;
operations  public Till: CentralResource ==> Till  Till(res) ==     resource := res;
  public InsertCard : Card ==> ()  InsertCard(c) ==    curCard := c  pre not CardInside();
  public Validate : Card`PinCode ==> <PinOk> | <PinNotOk> | <Retained>  Validate(pin) ==    let cardId = curCard.GetCardId(),        codeOk = curCard.GetCode() = Encode(pin),        cardLegal = IsLegalCard()    in      (cardOk := codeOk and cardLegal;       if not cardLegal then          (retainedCards := retainedCards union {curCard};          curCard := nil;          return <Retained>)       elseif codeOk then         resource.ResetNumberOfTries(cardId)       else         (resource.IncrNumberOfTries(cardId);          if resource.NumberOfTriesExceeded(cardId) then            (retainedCards := retainedCards union {curCard};             cardOk := false;             curCard := nil;             return <Retained>));       return if cardOk              then <PinOk>              else <PinNotOk>)  pre CardInside() and not cardOk;
  public ReturnCard : () ==> ()  ReturnCard() ==    (cardOk := false;     curCard:= nil)  pre CardInside();
  public GetBalance : () ==> [nat]  GetBalance() ==    resource.GetBalance(curCard.GetAccountId())  pre CardValidated();
  public MakeWithdrawal : nat ==> bool  MakeWithdrawal(amount) ==    resource.Withdrawal      (curCard.GetAccountId(),curCard.GetCardId(),amount)  pre CardValidated();
  public RequestStatement : () ==> bool  RequestStatement() ==    resource.PostStatement(curCard.GetAccountId(),curCard.GetCardId())  pre CardValidated();
  public IsLegalCard : () ==> bool  IsLegalCard() ==    return       resource.IsLegalCard(curCard.GetAccountId(),curCard.GetCardId())  pre CardInside();
  public CardValidated: () ==> bool  CardValidated() ==    return curCard <> nil and cardOk;
  public CardInside: () ==> bool  CardInside() ==    return curCard <> nil;
functions
  Encode: Card`PinCode +> Card`Code  Encode(pin) ==    pin; -- NB! The actual encoding procedure has not yet been chosen
end Till

~~~
{% endraw %}

