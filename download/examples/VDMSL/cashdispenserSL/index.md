---
layout: default
title: cashdispenserSL
---

## cashdispenserSL
Author: Peter Gorm Larsen


This model is described in VDM-SL as a very abstract specification
of how a pacemaker can pace a heart that is not having periodic 
stroken in the two heart chambers. 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| DEFAULT`Sum([1,2,3,4,5,6,7,8,9])|


### cashdispenser.vdmsl

{% raw %}
~~~
state System of
  accounts : map AccountId to Account
  illegalCards : set of CardId
  curCard : [Card]
  cardOk : bool
  retainedCards : set of Card
inv mk_System(accs,-,curCard,cardOk,-) == 
      (curCard = nil => not cardOk) and 
      (forall id1, id2 in set dom accs &
        id1 <> id2 =>
        dom accs(id1).cards inter dom accs(id2).cards = {})
init s == s = mk_System({|->},{},nil,false,{})
end

types
  Account :: cards : map CardId to Cardholder
             balance : nat
             transactions : seq of Transaction
  inv account == TransactionsInvariant(account.transactions);

  Transaction :: date : Date
                 cardId : CardId
                 amount : nat;

  Card :: code : Code
          cardId : CardId
          accountId : AccountId;

  Cardholder :: name : Name;

  AccountId = nat;
  Name = seq of char;
  CardId = nat;
  Code = nat;
  PinCode = nat;
  Date = seq of char;

functions

  TransactionsInvariant : seq of Transaction +> bool
  TransactionsInvariant(ts) ==
    forall date in set {t.date | t in seq ts} &
      DateTotal(date,ts) <= dailyLimit;

  DateTotal : Date * seq of Transaction +> nat
  DateTotal(date,ts) ==
    Sum([t.amount | t in seq ts & t.date = date]);

values
  dailyLimit : nat = 2000;

operations

  InsertCard : Card ==> ()
  InsertCard(c) ==
    curCard := c
  pre curCard = nil;

  Validate : PinCode ==> <PinOk> | <PinNotOk> | <Retained>        
  Validate(pin) ==
    let codeOk = curCard.code = Encode(pin),
        cardLegal = IsLegalCard(curCard,illegalCards,accounts) 
    in
      (if not cardLegal then 
        (retainedCards := retainedCards union {curCard};
         cardOk := false;
         curCard := nil;
         return <Retained>)
       else
         cardOk := codeOk;
       return if cardOk
              then <PinOk>
              else <PinNotOk>)
  pre curCard <> nil and not cardOk;

  ReturnCard : () ==> ()
  ReturnCard() ==
    (cardOk := false;
     curCard:= nil)
  pre curCard <> nil;

  GetBalance : () ==> nat
  GetBalance() ==
    return accounts(curCard.accountId).balance
  pre curCard <> nil and cardOk and IsLegalCard(curCard,illegalCards,accounts);

  MakeWithdrawal : nat * Date ==> bool
  MakeWithdrawal(amount,date) ==
    let mk_Card(-,cardId,accountId) = curCard,
        transaction = mk_Transaction(date,cardId,amount)        
    in
      if accounts(accountId).balance - amount >= 0 and 
        DateTotal(date,accounts(accountId).transactions^[transaction])
        <= dailyLimit
      then
        (accounts(accountId).balance := 
           accounts(accountId).balance - amount;
         accounts(accountId).transactions := 
           accounts(accountId).transactions ^ [transaction];
         return true)
     else 
       return false
  pre curCard <> nil and cardOk and IsLegalCard(curCard,illegalCards,accounts);

  RequestStatement : () ==> Name * seq of Transaction * nat
  RequestStatement() ==
    let mk_Card(-,cardId,accountId) = curCard,
        mk_Account(cards,balance,transactions) = accounts(accountId)
    in
      return mk_(cards(cardId).name,transactions,balance)
  pre curCard <> nil and cardOk and IsLegalCard(curCard,illegalCards,accounts)

functions

  IsLegalCard : Card * set of CardId * map AccountId to Account -> bool
  IsLegalCard(mk_Card(-,cardId,accountId),pillegalcards,paccounts) ==
     cardId not in set pillegalcards and 
     accountId in set dom paccounts and
     cardId in set dom paccounts(accountId).cards;

operations

  ReportIllegalCard : CardId ==> ()
  ReportIllegalCard(cardId) ==
    illegalCards := illegalCards union {cardId};

  AddAccount : AccountId * Account ==> ()
  AddAccount(accountId,account) ==
    accounts := accounts munion {accountId |-> account}
  pre accountId not in set dom accounts;

functions
  Encode: PinCode +> Code
  Encode(pin) ==
    pin; -- NB The actual encoding procedure has not yet been chosen

  Sum: seq of real +> real
  Sum(rs) ==
    if rs = [] then 0
    else
      hd rs + Sum(tl rs)
  measure len rs;

traces

TestCash: let c in set {mk_Card(1,1,1), mk_Card(2,2,2)}
          in
            (InsertCard(c);
             Validate(1111);
             ReportIllegalCard(c.cardId)){1,5};
~~~
{% endraw %}

