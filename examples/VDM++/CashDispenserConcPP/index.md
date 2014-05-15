---
layout: default
title: CashDispenserConcPP
---

## CashDispenserConcPP
Author: Sten Agerholm, Peter Gorm Larsen and Kim Sunesen


This model is concurrent and it is described in VDM++. This enables 
abstraction from design considerations and can model errors in the
communication channel and it ensures maximum focus on high-level, 
precise and systematic analysis. This was developed by Sten Agerholm, 
Peter Gorm Larsen and Kim Sunesen in 1999 in connection with FM'99.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new Main().Run()|


### Account.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                               
class Account

instance variables
  cards : map Card`CardId to Cardholder;
  balance : nat;
  transactions : seq of Transaction := [];
  
  inv TransactionsInvariant(transactions);
                                                                                                                                                                                                                                   
values
  dailyLimit : nat = 2000;

types
  public AccountId = nat;
  public Transaction :: date : Clock`Date
                 cardId : Card`CardId
                 amount : nat;
                                                                                                                                                                                                                                                                                                                                                                                       
operations
  public Account : map Card`CardId to Cardholder * nat ==> Account
  Account(cs,b) ==
    (cards := cs;
     balance := b);

  public GetBalance : () ==> nat
  GetBalance() ==
    return balance;
                                                                                                                     
  public Withdrawal : Card`CardId * nat * Clock`Date ==> bool
  Withdrawal(cardId,amount,date) ==
    let transaction = mk_Transaction(date,cardId,amount)
    in
      if balance - amount >= 0 and 
         DateTotal(date,transactions^[transaction]) <= dailyLimit 
      then
       (balance := balance - amount;
        transactions := transactions ^ [transaction];
        return true)
      else 
        return false
  pre cardId in set dom cards;

  public MakeStatement : Card`CardId * Clock`Date ==> Letter
  MakeStatement(cardId,date) ==
    let nm = cards(cardId).GetName(),
        addr = cards(cardId).GetAddress()
    in 
      return new Letter(nm,addr,date,transactions,balance)
  pre cardId in set dom cards;
                                                                                                               
  public GetCardIds: () ==> set of Card`CardId
  GetCardIds() == 
    return dom cards;
                                                                                                                      
  AddCard : Card`CardId * Cardholder ==> ()
  AddCard(cId,ch) ==
    cards := cards munion {cId |-> ch}
  pre cId not in set dom cards;

functions
  TransactionsInvariant: seq of Transaction +> bool
  TransactionsInvariant(ts) ==
    forall date in set {ts(i).date | i in set inds ts} &
      DateTotal(date,ts) <= dailyLimit;
                                                                                                                                                                                                   
  DateTotal : Clock`Date * seq of Transaction +> nat
  DateTotal(date,ts) ==
    Sum([ts(i).amount | i in set inds ts & ts(i).date = date]);

  Sum: seq of real +> real
  Sum(rs) ==
    if rs = [] then 0
    else
      hd rs + Sum(tl rs);

end Account
            
~~~
{% endraw %}

### Card.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                      
class Card

types
  public CardId = nat;
  public Code = nat;
  public PinCode = nat;

instance variables
  code : Code;
  cardId : CardId;
  accountId : Account`AccountId;

operations
  public Card : Code * CardId * Account`AccountId ==> Card
  Card(c,cid,a) ==
    (code := c;
     cardId := cid;
     accountId := a);

  public GetCode : () ==> Code
  GetCode() ==
    return code;

  public GetAccountId : () ==> Account`AccountId
  GetAccountId() ==
    return accountId;

  public GetCardId : () ==> CardId
  GetCardId() ==
    return cardId;

end Card
               
~~~
{% endraw %}

### CardHolder.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                             
class Cardholder

types
  public Address = seq of char;
  public Name = seq of char;

instance variables
  name : Name;
  address : Address;

operations
  public Cardholder : Name * Address ==> Cardholder
  Cardholder(nm,addr) ==
    (name := nm;
     address := addr);

  public GetName : () ==> Name 
  GetName () ==
    return name;

  public GetAddress : () ==> Address 
  GetAddress() ==
    return address;

end Cardholder
              
~~~
{% endraw %}

### CentralResource.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                  
class CentralResource

instance variables
  accounts      : map Account`AccountId to Account := {|->};
  numberOfTries : map Card`CardId to nat := {|->};
  illegalCards  : set of Card`CardId := {};
  letterbox     : Letterbox;
  clock         : Clock;
                                                                                     
  inv forall acc1,acc2 in set rng accounts &
          acc1 <> acc2 => 
          acc1.GetCardIds() inter acc2.GetCardIds() = {};

values
  maxNumberOfTries : nat = 3;

operations
  public CentralResource : Clock * Letterbox ==> CentralResource
  CentralResource(c,l) ==
    (clock := c;
     letterbox := l);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  public GetBalance : Account`AccountId ==> [nat]
  GetBalance(accountId) ==
    if accountId in set dom accounts then
      accounts(accountId).GetBalance()
    else 
      return nil;

  public Withdrawal : Account`AccountId * Card`CardId * nat ==> bool
  Withdrawal(accountId,cardId,amount) ==
    if IsLegalCard(accountId,cardId) then
      accounts(accountId).Withdrawal(cardId,amount,clock.GetDate())
    else 
      return false;

  public PostStatement : Account`AccountId * Card`CardId ==> bool
  PostStatement(accountId,cardId) ==
    if IsLegalCard(accountId,cardId) then
      (letterbox.PostStatement
        (accounts(accountId).MakeStatement(cardId,clock.GetDate()));
       return true)
    else 
      return false;
                                                                                                                                                   
  public IsLegalCard : Account`AccountId * Card`CardId ==> bool
  IsLegalCard(accountId,cardId) ==
    return 
      cardId not in set illegalCards and 
      accountId in set dom accounts and
      cardId in set accounts(accountId).GetCardIds();

  public NumberOfTriesExceeded : Card`CardId ==> bool
  NumberOfTriesExceeded(cardId) == 
    return numberOfTries(cardId) >= maxNumberOfTries;

  public ResetNumberOfTries : Card`CardId ==> ()
  ResetNumberOfTries(cardId) ==
    numberOfTries(cardId) := 0;

  public IncrNumberOfTries : Card`CardId ==> ()
  IncrNumberOfTries(cardId) ==
    numberOfTries(cardId) := numberOfTries(cardId) + 1;
                                                                                                
  public AddAccount : Account`AccountId * Account ==> ()
  AddAccount(accId,acc) ==
    (numberOfTries := numberOfTries ++ 
                      {cId |-> 0 | cId in set acc.GetCardIds()};
     accounts := accounts ++ {accId |-> acc})
  pre accId not in set dom accounts;

  public AddIllegalCard : Card`CardId ==> ()
  AddIllegalCard(cId) ==
    illegalCards := illegalCards union {cId};

end CentralResource
             
~~~
{% endraw %}

### Channel.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
class Channel
                                                                                                                                                                                                                                                                                                                                             
instance variables
  req : [Request] := nil;
  resp :[Response] := nil;
  timer : Timer := new Timer();
  curTime : nat := 0;
                                                                                                                                                                                                          
values
  timeout = 1500;
                                                                                                                                              
types
                                                                                                                                       
  public Request :: command : Command
                    data : set of ReqData;
                                                                                                                                           
  public Command = <TriesExceeded> | <ResetTries> | <IncTries> | 
                   <GetBalance> | <Withdrawal> | <PostStmt> | 
                  <IsLegalCard>;
                                                                                                                       
  public ReqData = CardId | AccountId | Amount;
  public CardId :: val : Card`CardId;
  public AccountId :: val : Account`AccountId;
  public Amount :: val : nat;
                                                                                                                                                                      
  public Response :: command : Command
              data : RespData;
  public RespData = [nat] | bool;
                                                                                                                                                                       
operations
                                                                                                                                                                                                                                                                                                                                                                                            
  public SendRequest : Request ==> ()
  SendRequest(r) ==
    (req := r;
     timer.Start())
  pre req = nil;
                                                                                                                                                                                                  
  public ReceiveRequest : () ==> Request
  ReceiveRequest() ==
    let r = req in
    (req := nil;
     return r);
                                                                                                                                                                                                                                                                                                                                                                          
  public SendResponse : Response ==> ()
  SendResponse(r) ==
    (resp := r;
     timer.Stop())
  pre resp = nil;
                                                                                                                                                                                     
  public ReceiveResponse : () ==> [Response]
  ReceiveResponse() ==
    let r = resp in
    (resp := nil;
     return r);
                                                                                                                                                                      
  public Wait: () ==> ()
  Wait() == 
    skip;
                                                                                                                                                             
  CheckTime: () ==> ()
  CheckTime() ==
    curTime := timer.GetTime()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
functions

  AllReceived : nat * nat * nat * nat -> bool
  AllReceived(act_send, fin_send, act_rec, fin_rec) ==
    act_send = fin_send and
    act_rec = fin_rec and
    (act_send + fin_send) = (act_send + fin_send);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
sync
  per SendResponse => 
        AllReceived(#act(SendRequest), #fin(SendRequest),
                    #act(ReceiveRequest), #fin(ReceiveRequest)) and
        AllReceived(#act(SendResponse), #fin(SendResponse),
                    #act(ReceiveResponse), #fin(ReceiveResponse)) and
        #act(SendRequest) - #fin(SendResponse) = 1;
                                                                                                                                                                                
  per ReceiveRequest => req <> nil;
                                                                                                                                                                                                                                                                                                               
  per Wait => curTime > timeout or resp <> nil;
                                                                                                                                                         
thread
  periodic(1000)(CheckTime)

end Channel
             
~~~
{% endraw %}

### Clock.vdmpp

{% raw %}
~~~
                                                                                             
class Clock

types
  public Date = seq of char;

instance variables
  date : Date := [];

operations
  public SetDate : Date ==> ()
  SetDate(d) ==
    date := d;

  public GetDate : () ==> Date
  GetDate() ==
    return date;

end Clock
             
~~~
{% endraw %}

### concur.vdmpp

{% raw %}
~~~
class Main

instance variables

  ltills : map TillId to LocalTill := {|->};
  tills : map TillId to Till := {|->};
  cards : seq of Card := [];
  resource : CentralResource;
  clock : Clock := new Clock();
  letterbox : Letterbox := new Letterbox();
  mb : MessageBuffer := new MessageBuffer();

types

  public TillId = nat;

values

  nat2char : map nat to char =
    { 0 |-> '0', 1 |-> '1', 2 |-> '2', 3 |-> '3', 4 |-> '4', 
      5 |-> '5', 6 |-> '6', 7 |-> '7', 8 |-> '8', 9 |-> '9' };

functions

  tStr : nat -> seq of char
  tStr(n) == "Till " ^ nat2string(n) ^":\t";

  nat2chars : nat -> seq of char
  nat2chars(n) ==
    if n = 0
    then []
    elseif n < 10
    then [nat2char(n)]
    else (nat2chars(n div 10)) ^ [ nat2char(n mod 10)];

  nat2string : nat -> seq of char
  nat2string(n) ==
    if n = 0
    then "0"
    else nat2chars(n)

operations

  public GetTill: TillId ==> Till
  GetTill(tid) ==
    return tills(tid);

  public Main: () ==> Main
  Main() ==
    (clock.SetDate("150999");
    let c1 = new Card(123456,1,1),
        c2 = new Card(123457,2,2),
        c3 = new Card(123458,3,3),
        c4 = new Card(123459,4,4), 
        c5 = new Card(123460,5,5),
        c6 = new Card(123461,6,5),
        c7 = new Card(123462,7,5)
    in
    let peter = new Cardholder("Peter Gorm Larsen",
                                        "Granvej 24"),
        paul = new Cardholder("Paul Mukherjee",
                                        "Rugaardsvej 47"),
        sten = new Cardholder("Sten Agerholm",
                                        "Teisensvej ??"),
        kim = new Cardholder("Kim Sunesen",
                                      "??"),
        CSK = new Cardholder("CSK","Forskerparken 10A")
     in
       let pglacc1 = new Account({1 |-> peter},5000),
           saacc1  = new Account({2 |-> sten},0),
           ksacc1  = new Account({3 |-> kim},9000),
           pmacc1  = new Account({4 |-> paul},6000),
           ifacc1  = new Account({5 |-> peter,
                                  6 |-> sten,
                                  7 |-> CSK},3000),
           pglid1 = 1,
           said1  = 2,
           ksid1  = 3,
           pmid1  = 4,
           ifid1  = 5
       in 
         (resource := new CentralResource(clock,new Letterbox());
          resource.AddAccount(pglid1,pglacc1);
          resource.AddAccount(said1,saacc1);              
          resource.AddAccount(ksid1,ksacc1);
          resource.AddAccount(pmid1,pmacc1);
          resource.AddAccount(ifid1,ifacc1);
          tills := {1 |-> SetupTill(1,new Till()),
                    2 |-> SetupTill(2,new Till()),
                    3 |-> SetupTill(3,new Till()),
                    4 |-> SetupTill(4,new Till())};
          cards := [c1,c2,c3,c4,c5,c6,c7];
         ));

    SetupTill : nat * Till ==> Till
    SetupTill(i,t) ==
       let c = new Channel(),
           lt = new LocalTill(c, resource),
           lr = new LocalResource(c) in
         (start(lt);
          ltills := ltills ++ { i |-> lt};
          t.Set(lr));

    public RepairTill : nat  ==> ()
    RepairTill(tillNum) ==
      tills(tillNum) := SetupTill(tillNum, tills(tillNum));

    public EnterCardAtTill : nat * nat * nat ==> ()
    EnterCardAtTill(tillNum, cardNum, pin) ==
      (tills(tillNum).InsertCard(cards(cardNum));
       let validRes1 = tills(tillNum).Validate(pin) in
       let msg = cases validRes1:
              <Fail> ->     tStr(tillNum) ^"Validate card failed",
              <Retained> -> tStr(tillNum) ^"Card Retained",
              <PinNotOk> -> "Validate Unsuccessful",
              <PinOk> ->    tStr(tillNum) ^"Validate Successful",
              others ->     tStr(tillNum) ^"Unknown Message"
              end in
       mb.put(msg);
       -- Make till 1 fail as soon as the card is entered
       if tillNum = 1
       then Fail(tillNum))
    pre tillNum in set dom tills;

    public WithdrawalAtTill : nat * nat ==> ()
    WithdrawalAtTill(tillNum, amount) ==
         let wd1 = tills(tillNum).MakeWithdrawal(amount) in
         let msghdr =tStr(tillNum) ^"Withdrawal ("^nat2string(amount) ^")" in
         if <Fail> = wd1
         then mb.put(msghdr ^ " Failed")
         elseif not wd1
         then mb.put(msghdr ^ " Unsuccessful")
         else mb.put(msghdr ^ " Successful");

    public GetBalanceAtTill : nat ==> ()
    GetBalanceAtTill (tillNum) ==    
         let bal1 = tills(tillNum).GetBalance() in
         if nil = bal1
         then mb.put(tStr(tillNum) ^
                     "Balance not known for this account")
         elseif <Fail> = bal1
         then mb.put(tStr(tillNum) ^"Balance Failed")
         else mb.put(tStr(tillNum) ^
                     "Balance is " ^ nat2string(bal1) );

    public Fail : nat ==> ()
    Fail(tillNum) ==
      (ltills(tillNum).Fail();
       mb.put(tStr(tillNum) ^ "LocalTill Fail"));

    public ReturnCard : nat ==> ()
    ReturnCard(tillNum) ==
     (tills(tillNum).ReturnCard();
      mb.put(tStr(tillNum) ^"Card Returned"));

    Wait: () ==> ()
    Wait () == skip;

    public Run : () ==> seq of char
    Run() ==
      (dcl user1:User := new User(1,1,123456,self),
           user2:User := new User(2,5,123460,self),
           user3:User := new User(3,6,123461,self),
           user4:User := new User(4,7,123462,self);
       start(user1);
       start(user2);
       start(user3);
       start(user4);
       Wait();
       return mb.get());

sync

  mutex(SetupTill);
  mutex(ReturnCard);
  per Wait => #fin(ReturnCard) >= 3
      

end Main

class MessageBuffer

instance variables

  data : seq of char := [];

operations

  public put : seq of char ==> ()
  put(msg) ==
    data := data ^ "\n" ^ msg ;

  public get : () ==> seq of char
  get() == return data;

sync
  mutex(all);

end MessageBuffer

class User

instance variables

  tillNum : nat;
  cardNum : nat;
  pin : nat;
  m : Main

operations

  public User : nat * nat * nat * Main ==> User 
  User (nt, nc, np, nm) ==
    (tillNum := nt;
     cardNum := nc;
     pin := np;
     m := nm);

  Test1 : () ==> ()
  Test1() ==
    (m.EnterCardAtTill(tillNum,cardNum,pin);
     m.GetBalanceAtTill(tillNum);
     m.WithdrawalAtTill(tillNum,100);
     m.GetBalanceAtTill(tillNum);
     m.ReturnCard(tillNum))

    

thread
  Test1()

end User

~~~
{% endraw %}

### Letter.vdmpp

{% raw %}
~~~
                                                                                                      
class Letter

instance variables
  name : Cardholder`Name;
  address : Cardholder`Address;
  date : Clock`Date;
  transactions : seq of Account`Transaction;
  balance : nat

operations
  public Letter: Cardholder`Name * Cardholder`Address * Clock`Date * 
          seq of Account`Transaction * nat ==> Letter
  Letter(nm,addr,d,ts,b) ==
    (name := nm;
     address := addr;
     date := d;
     transactions := ts;
     balance:= b)
     
end Letter
              
~~~
{% endraw %}

### Letterbox.vdmpp

{% raw %}
~~~
                                                                                                         
class Letterbox

instance variables
  statements : seq of Letter := [];

operations
  public PostStatement : Letter ==> ()
  PostStatement(letter) == 
    statements := statements ^ [letter];

  GetLastStatement : () ==> Letter
  GetLastStatement() == 
    return statements(len statements)
  pre statements <> [];

end Letterbox
            
~~~
{% endraw %}

### LocalResource.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                            
class LocalResource
                                                                                                       
instance variables
  c : Channel := new Channel();

operations
                                                                                     
  public LocalResource : Channel ==> LocalResource
  LocalResource(nc) ==
    c := nc;
                                                                                                                                                                                                                                                                                                              
  public GetBalance : Account`AccountId ==> [nat]| <Fail>
  GetBalance(accountId) ==
    let req = mk_Channel`Request(<GetBalance>,
                                 {mk_Channel`AccountId(accountId)}) in
    (c.SendRequest(req);
     Wait(<GetBalance>));
                                                                                                                                                                                                                                                                                             
  Wait : Channel`Command ==> Channel`RespData | <Fail>
  Wait(comm) ==
    (c.Wait();
     let resp = c.ReceiveResponse() in
     if resp = nil
     then return <Fail>
     elseif resp.command <> comm
     then return <Fail>
     else return resp.data);
                                                                                                                                              
  public Withdrawal : Account`AccountId * Card`CardId * nat ==> bool | <Fail>
  Withdrawal(accountId,cardId,amount) ==
    let req = mk_Channel`Request(<Withdrawal>,
                                 {mk_Channel`AccountId(accountId),
                                  mk_Channel`CardId(cardId),
                                  mk_Channel`Amount(amount)}) in
    (c.SendRequest(req);
     Wait(<Withdrawal>));

  public PostStatement : Account`AccountId * Card`CardId ==> bool | <Fail>
  PostStatement(accountId,cardId) ==
    let req = mk_Channel`Request(<PostStmt>,
                                 {mk_Channel`AccountId(accountId),
                                  mk_Channel`CardId(cardId)}) in
    (c.SendRequest(req);
     Wait(<PostStmt>));

  public IsLegalCard : Account`AccountId * Card`CardId ==> bool | <Fail>
  IsLegalCard(accountId,cardId) ==
    let req = mk_Channel`Request(<IsLegalCard>,
                                 {mk_Channel`AccountId(accountId),
                                  mk_Channel`CardId(cardId)}) in    
    (c.SendRequest(req);
     Wait(<IsLegalCard>));

  public NumberOfTriesExceeded : Card`CardId ==> bool | <Fail>
  NumberOfTriesExceeded(cardId) == 
    let req = mk_Channel`Request(<TriesExceeded>,
                                 {mk_Channel`CardId(cardId)}) in
    (c.SendRequest(req);
     Wait(<TriesExceeded>));

  public ResetNumberOfTries : Card`CardId ==> [<Fail>]
  ResetNumberOfTries(cardId) ==
    let req = mk_Channel`Request(<ResetTries>,
                                 {mk_Channel`CardId(cardId)}) in
    (c.SendRequest(req);
     Wait(<ResetTries>));

  public IncrNumberOfTries : Card`CardId ==> [<Fail>]
  IncrNumberOfTries(cardId) ==
    let req = mk_Channel`Request(<IncTries>,
                                 {mk_Channel`CardId(cardId)}) in
    (c.SendRequest(req);
     Wait(<IncTries>));

end LocalResource
              
~~~
{% endraw %}

### LocalTill.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                
class LocalTill
                                                                                                                                                                                                                                                                                                                                                                                                        
instance variables
  c: Channel;
  resource : CentralResource;
  enabled : bool := true;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
thread
  while enabled do
      let req = c.ReceiveRequest() in
      if enabled
      then ProcessRequest(req);
                                                                                                                                                                                                                                                                                                                                                                                                                                     
operations

  ProcessRequest : Channel`Request ==> ()
  ProcessRequest(req) ==
   (dcl respdata : Channel`RespData;
    cases req:
        mk_Channel`Request(
            <Withdrawal>, {mk_Channel`AccountId(accId),
                           mk_Channel`CardId(cardId),
                           mk_Channel`Amount(amt)})     
          -> respdata := resource.Withdrawal(accId, cardId, amt),
        mk_Channel`Request(
            <PostStmt>, {mk_Channel`AccountId(accId),
                         mk_Channel`CardId(cardId)})
          -> respdata := resource.PostStatement(accId, cardId),
        mk_Channel`Request(
            <IsLegalCard>, {mk_Channel`AccountId(accId),
                            mk_Channel`CardId(cardId)})
          -> respdata := resource.IsLegalCard(accId, cardId),
        mk_Channel`Request(
            <GetBalance>, {mk_Channel`AccountId(accId)})
          -> respdata := resource.GetBalance(accId),
        mk_Channel`Request(
            <TriesExceeded>, {mk_Channel`CardId(cardId)})
          -> respdata := resource.NumberOfTriesExceeded(cardId),
        mk_Channel`Request(
            <ResetTries>, {mk_Channel`CardId(cardId)})
          -> (resource.ResetNumberOfTries(cardId);
              respdata := nil),       
        mk_Channel`Request(
            <IncTries>, {mk_Channel`CardId(cardId)})
          -> (resource.IncrNumberOfTries(cardId);
              respdata := nil)
    end;
    c.SendResponse(mk_Channel`Response(req.command, respdata)));
                                                                                                                                    
  public LocalTill : Channel * CentralResource ==> LocalTill
  LocalTill(nc, nr) ==
    (c := nc;
     resource := nr);
                                                                                                                                            
  public Fail : () ==> ()
  Fail() ==
    enabled := false;
                                                                                                                                                                                
  public Repair : Channel ==> ()
  Repair(nc) ==
   (c := nc;
    enabled := true);

end LocalTill
              
~~~
{% endraw %}

### Till.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
class Till

instance variables
  curCard : [Card] := nil;
  cardOk : bool := false;
  retainedCards : set of Card := {};
  resource : LocalResource;

  inv curCard = nil => not cardOk;

operations
  public Till: LocalResource ==> Till
  Till(res) == 
    resource := res;

  public Set: LocalResource ==> Till
  Set(res) ==
   (resource := res;
    return self);
    
  public InsertCard : Card ==> ()
  InsertCard(c) ==
    curCard := c
  pre not CardInside();

  public Validate : Card`PinCode ==> <PinOk> | <PinNotOk> | <Retained> 
                              | <Fail>  
  Validate(pin) ==
    let cardId = curCard.GetCardId(),
        codeOk = curCard.GetCode() = Encode(pin),
        cardLegal = IsLegalCard()
    in if cardLegal = <Fail>
       then return <Fail>
       else
          (cardOk := codeOk and cardLegal;
           if not cardLegal 
           then (retainedCards := retainedCards union {curCard};
                 curCard := nil;
                 return <Retained>)
           elseif codeOk 
           then if resource.ResetNumberOfTries(cardId) = <Fail>
                then return <Fail> 
                else return <PinOk>
           else
             (let incTries = resource.IncrNumberOfTries(cardId),
                  numTriesExceeded = 
                             resource.NumberOfTriesExceeded(cardId) in
              if <Fail> in set {incTries, numTriesExceeded}
              then return <Fail>
              elseif numTriesExceeded then
                (retainedCards := retainedCards union {curCard};
                 cardOk := false;
                 curCard := nil;
                 return <Retained>)
              else return <PinNotOk>
             )
          )
  pre CardInside() and not cardOk;

  public ReturnCard : () ==> ()
  ReturnCard() ==
    (cardOk := false;
     curCard:= nil)
  pre CardInside();

  public GetBalance : () ==> [nat]|<Fail>
  GetBalance() ==
    resource.GetBalance(curCard.GetAccountId())
  pre CardValidated();

  public MakeWithdrawal : nat ==> bool | <Fail>
  MakeWithdrawal(amount) ==
    resource.Withdrawal
      (curCard.GetAccountId(),curCard.GetCardId(),amount)
  pre CardValidated();

  public RequestStatement : () ==> bool | <Fail>
  RequestStatement() ==
    resource.PostStatement(curCard.GetAccountId(),curCard.GetCardId())
  pre CardValidated();
                                                                                                         
  public IsLegalCard : () ==> bool | <Fail>
  IsLegalCard() ==
    return 
      resource.IsLegalCard(curCard.GetAccountId(),curCard.GetCardId())
  pre CardInside();

  public CardValidated: () ==> bool
  CardValidated() ==
    return curCard <> nil and cardOk;

  public CardInside: () ==> bool
  CardInside() ==
   return curCard <> nil;

functions

  Encode: Card`PinCode +> Card`Code
  Encode(pin) ==
    pin; -- NB The actual encoding procedure has not yet been chosen

end Till
            
~~~
{% endraw %}

### Timer.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                       
class Timer
                                                                                                                                                                                                             
instance variables
  curTime : nat := 0;
  active : bool := false;
                                                                                                              
operations
  public Start : () ==> ()
  Start() ==
    (active := true;
     curTime := 0);

  public Stop : () ==> () 
  Stop() ==
    active := false;

  public GetTime : () ==> nat
  GetTime() ==
    return curTime;

  IncTime: () ==> ()
  IncTime() ==
    if active
    then curTime := curTime + 100;
                                                                                                                                                                          
thread
  periodic(1000)(IncTime)

end Timer
             
~~~
{% endraw %}

