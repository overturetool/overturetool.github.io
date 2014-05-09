---
layout: default
title: gateway
---

~~~
This example is for a trusted gateway made by John Fitzgerald and Peter Gorm Larsen inspired by a more comprehensive model developedby British Aerospace. THe work undertaken here was published in:
Peter Gorm Larsen, Tom Brookes, Mike Green and John Fitzgerald, A Comparison of the Conventional and Formal Design of a Secure System Component, Nordic Seminar on Dependable Computing Systems, August, 1994.
J.S. Fitzgerald, T.M. Brookes, M.A. Green, and P.G. Larsen, Formal and Informal Specifications of a Secure System Component: first results in a comparative study, Formal Methods Europe'94 - : Industrial Benefitof Formal Methods, Springer Verlag, October 1994.
Peter Gorm Larsen, John Fitzgerald, Tom Brookes, Mike Green, Formal Modelling and Simulation in the Development of a Security-critical Message Processing System, Anglo-French workshop on Formal Methods, Modelling and Simulation for System Engineering, Saint-Quentin, France, February, 1995.
John Fitzgerald, Peter Gorm Larsen, Tom Brookes and Mike Green, Developing a Security-critical System using Formal and Conventional Methods, Chapter 14 in Applications of Formal Methods, M.G. Hinchey and J.P. Bowen (editors), Prentice Hall International Series in Computer Science, September 1995.
Peter Gorm Larsen, John Fitzgerald and Tom Brookes, Lessons Learned from Applying Formal Specification in Industry, IEEE Software, pp 48-56, May 1996.
T.M. Brookes, J.S. Fitzgerald, and P.G. Larsen, Formal and Informal Specifications of a Secure System Component: final results in a comparative study, Formal Methods Europe'96, pp 214-227, Springer Verlag, March 1996.
#******************************************************#  AUTOMATED TEST SETTINGS#------------------------------------------------------#AUTHOR= John Fitzgerald and Peter Gorm Larsen#LANGUAGE_VERSION=classic#INV_CHECKS=true#POST_CHECKS=true#PRE_CHECKS=true#DYNAMIC_TYPE_CHECKS=true#SUPPRESS_WARNINGS=false#ENTRY_POINT=DEFAULT`Occurs("topsecret","peter87topsecrethere next")#EXPECTED_RESULT=NO_ERROR_TYPE_CHECK#******************************************************
~~~
###gateway.vdmsl

{% raw %}
~~~
-- A trusted gateway-- For Chapter 7 (Sequences)
types
  String = seq of char  inv s == s <> [];  
  Message = String  inv m == len m <= 100;
  Classification = <HI> | <LO>;
  Category = set of String;
  Ports :: high: seq of Message           low : seq of Message
functions
-- checking whether a substring occur in another string
  Occurs: String * String -> bool  Occurs(substr,str) ==    exists i,j in set inds str & substr = str(i,...,j);
-- Classifying messages
  Classify: Message * Category -> Classification  Classify(m,cat) ==    if exists hi in set cat & Occurs(hi,m)    then <HI>    else <LO>;

-- The main gateway function using recursion
  Gateway: seq of Message * Category -> Ports  Gateway(ms,cat) ==    if ms = []    then mk_Ports([],[])    else let rest_p = Gateway(tl ms,cat)         in           ProcessMessage(hd ms,cat,rest_p)   measure MesLen;
   MesLen: seq of Message * Category -> nat   MesLen(list,-) ==     len list;
-- Classify the message and add to the appropriate port.
  ProcessMessage: Message * Category * Ports -> Ports  ProcessMessage(m,cat,ps) ==    if Classify(m,cat) = <HI>    then mk_Ports([m]^ps.high,ps.low)    else mk_Ports(ps.high,[m]^ps.low);

-- The main gateway function without using recursion
  Gateway2: seq of Message * Category -> Ports  Gateway2(ms,cat) ==    mk_Ports([ms(i)|i in set inds ms & Classify(ms(i),cat) = <HI>],             [ms(i)|i in set inds ms & Classify(ms(i),cat) = <LO>]);
-- Functions illustrating other sequence operators. 
  AnyHighClass: seq of Message * Category -> bool  AnyHighClass(ms,cat) ==    exists m in set elems ms & Classify(m,cat) = <HI>;
  Censor: seq of Message * Category -> seq of Message  Censor(ms,cat) ==    [ms(i) | i in set inds ms & Classify(ms(i),cat) = <LO>];
  FlattenMessages: seq of Message -> Message  FlattenMessages(ms) ==    conc ms  pre len conc ms <= 100 



~~~{% endraw %}

