---
layout: default
title: ElectronicPursePP
---

## ElectronicPursePP
Author: Steve Riddle


This example is made by Steve Riddle as an example for an 
exam question used at the VDM course in Newcastle. It deals
with an electronic purse in a simple form. This is one of the
grand challenges that is considered by the formal methods 
community for formal verification.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### Purse.vdmpp

{% raw %}
~~~
class Purse

types
public CardId = token

instance variables

private balance: nat;
private cardNo: CardId;

operations

public IncreaseBal: nat ==> ()
IncreaseBal(sum)==
  balance := balance + sum;

public DecreaseBal: nat ==> ()
DecreaseBal(sum)==
  balance := balance - sum
pre sum <= balance;

pure public GetBalance:() ==> nat
GetBalance() == 
  return balance;

pure public GetCardNo: () ==> CardId
GetCardNo() == 
  return cardNo;

public Purse: CardId * nat ==> Purse
Purse(newId, startbal) ==
( cardNo := newId;
  balance := startbal ) ;

functions
-- no functions currently defined
end Purse
~~~
{% endraw %}

### System.vdmpp

{% raw %}
~~~
class System

instance variables

private Purses: map Purse`CardId to Purse;
inv forall p in set dom Purses & Purses(p).GetCardNo() = p;
private Log: seq of Transaction := [];

types

public Transaction :: 
         fromId : Purse`CardId
         toId   : Purse`CardId
         sum    : nat;

operations

public Transfer: Purse`CardId * Purse`CardId * nat ==> ()
Transfer(fromId, toId, sum) == 
( Purses(fromId).DecreaseBal(sum);
  Purses(toId).IncreaseBal(sum);
)
pre {fromId, toId} subset dom Purses and 
    fromId <> toId and
    Purses(fromId).GetBalance() >= sum;

public System: set of Purse ==> System
System(PurseSet) ==
  Purses := {p.GetCardNo() |-> p | p in set PurseSet}
pre forall p,q in set PurseSet & p <> q => p.GetCardNo() <> q.GetCardNo();

public TotalTransferred:() ==> nat
TotalTransferred() == 
  return TotalSum(Log);

functions

TotalSum: seq of Transaction -> nat
TotalSum(tseq) ==
  if tseq = [] 
  then 0
  else let tx = hd tseq 
       in 
         tx.sum + TotalSum(tl tseq)
measure Len;

Len: seq of Transaction -> nat
Len(l) ==
  len l;

end System
~~~
{% endraw %}

