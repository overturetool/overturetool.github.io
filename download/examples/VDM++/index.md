---
layout: default
title: VDM++
---

### Access-control
This specification describes access control and policies for restricting this.
Details of the specification may be found in:   
1. Formal Engineering of Access Control Policies in VDM++ Jeremy W. Bryans and 
John S. Fitzgerald. In proceedings of 9th International Conference on Formal 
Engineering Methods (ICFEM 2007). Boca Raton, USA, November 2007. pp 37--56
 
2. A Formal Approach to Dependable Evolution of Access Control Policies in 
Dynamic Collaborations Jeremy W. Bryans, John S. Fitzgerald and Panos Periorellis. 
In Proceedings of the 37th Annual IEEE/IFIP International Conference on Dependable 
Systems and Networks, pp 352-353, Supplemental Volume. June 25-28, 2007. Edinburgh, UK


| | |
|------|-------|
|Author:|Jeremy Bryans and John Fitzgerald|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](access-controlPP/Access-control.zip)  / [show specification](access-controlPP/index.html)|


### Alarm++proof
This is a version of the alarm example from the VDM++ book, John 
Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel 
Verhoef, Validated Designs for Object-oriented Systems, Springer, 
New York. 2005, ISBN 1-85233-881-4. This version of the example has 
been used for proof purposes and thus the operations in the normal 
VDM++ of this example are made as functions just like in the VDM-SL
version of the alarm example. The example is inspired by a subcomponent 
of a large alarm system developed by IFAD A/S. It is modelling the 
management of alarms for an industrial plant. The purpose of the 
model is to clarify the rules governing the duty roster and calling 
out of experts to deal with alarms.


| | |
|------|-------|
|Author:|John Fitzgerald and Peter Gorm Larsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](Alarm++proofPP/Alarm++proof.zip)  / [show specification](Alarm++proofPP/index.html)|


### Alarm++traces
This is a version of the alarm example from the VDM++ book where traces
have been added to test automation purposes. See John Fitzgerald, Peter
Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel Verhoef, Validated
Designs for Object-oriented Systems, Springer, New York. 2005, ISBN
1-85233-881-4. The example is inspired by a subcomponent of a large
alarm system developed by IFAD A/S. It is modelling the management of
alarms for an industrial plant. The purpose of the model is to clarify
the rules governing the duty roster and calling out of experts to deal
with alarms. A comparable model of this example also exists in VDM-SL.


| | |
|------|-------|
|Author:|John Fitzgerald and Peter Gorm Larsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](Alarm++tracesPP/Alarm++traces.zip)  / [show specification](Alarm++tracesPP/index.html)|


### AlarmErr
This is an erronerous version of the alarm example from the VDM++
book, John Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat
and Marcel Verhoef. Validated Designs for Object-oriented Systems,
Springer, New York. 2005, ISBN 1-85233-881-4. This version of the
example is used for illustrating the tool support in tutorial material
about Overture. It is inspired by a subcomponent of a large alarm
system developed by IFAD A/S. It is modelling the management of alarms
for an industrial plant. The purpose of the model is to clarify the
rules governing the duty roster and calling out of experts to deal
with alarms. A comparable model of this example also exists in VDM-SL.


| | |
|------|-------|
|Author:|John Fitzgerald and Peter Gorm Larsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](AlarmErrPP/AlarmErr.zip)  / [show specification](AlarmErrPP/index.html)|


### Alarm
This is the alarm example from the VDM++ book, John Fitzgerald, Peter
Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel Verhoef. Validated
Designs for Object-oriented Systems, Springer, New York. 2005, ISBN
1-85233-881-4. The example is inspired by a subcomponent of a large
alarm system developed by IFAD A/S. It is modelling the management of
alarms for an industrial plant. The purpose of the model is to clarify
the rules governing the duty roster and calling out of experts to deal
with alarms. A comparable model of this example also exists in VDM-SL.


| | |
|------|-------|
|Author:|John Fitzgerald and Peter Gorm Larsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](AlarmPP/Alarm.zip)  / [show specification](AlarmPP/index.html)|


### AutomatedStockBroker
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


| | |
|------|-------|
|Author:|Anders Kaels Malmos|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](AutomatedStockBrokerPP/AutomatedStockBroker.zip)  / [show specification](AutomatedStockBrokerPP/index.html)|


### Autopilot



| | |
|------|-------|
|Author:||
|Version:|VDM_PP - classic|
|Details...|[model (zip)](AutopilotPP/Autopilot.zip)  / [show specification](AutopilotPP/index.html)|


### Buffers
This model is made by Yves Ledru et al. in a paper illustrating the
combinatorial testing tool called Tobias. In this model the traces to
be used for combinatorial testing purposes have been redone by Peter 
Gorm Larsen. For more information see:

Filtering TOBIAS Combinatorial Test Suites, Yves Ledru, Lydie du 
Bousquet, Olivier Maury and Pierre Bontron, In Fundamental 
Approaches to Software Engineering, Lecture Notes in Computer Science, 
Springer, ISSN 0302-9743 (Print) 1611-3349 (Online), Volume 2984/2004.


| | |
|------|-------|
|Author:|Yves Ledru|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](buffersPP/Buffers.zip)  / [show specification](buffersPP/index.html)|


### Buslines
This example models bus lines in a city, in which passengers are to be 
transferred from stop to stop. Passengers with specific destinations 
will arrive at a central station, and the route and flow of the buses 
need to be planned to service the passenger in the best possible way. 
The number and routes of buses as wells as the inflow of passengers are 
variables. 
 
 Remote Debugger must be set to remote class:
	gui.BuslinesRemote


| | |
|------|-------|
|Author:|Claus Ballegaard Nielsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](BuslinesPP/Buslines.zip)  / [show specification](BuslinesPP/index.html)|


### BuslinesWithDB
This example models bus lines in a city, in which passengers are to be 
transferred from stop to stop. Passengers with specific destinations 
will arrive at a central station, and the route and flow of the buses 
need to be planned to service the passenger in the best possible way. 
The number and routes of buses as wells as the inflow of passengers are 
variables. 

This version connects to a database containing maps and busroutes.
 
 Remote Debugger must be set to remote class:
	gui.BuslinesRemote


| | |
|------|-------|
|Author:|Claus Ballegaard Nielsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](BuslinesWithDBPP/BuslinesWithDB.zip)  / [show specification](BuslinesWithDBPP/index.html)|


### CashDispenserConc
This model is concurrent and it is described in VDM++. This enables 
abstraction from design considerations and can model errors in the
communication channel and it ensures maximum focus on high-level, 
precise and systematic analysis. This was developed by Sten Agerholm, 
Peter Gorm Larsen and Kim Sunesen in 1999 in connection with FM'99.


| | |
|------|-------|
|Author:|Sten Agerholm, Peter Gorm Larsen and Kim Sunesen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](CashDispenserConcPP/CashDispenserConc.zip)  / [show specification](CashDispenserConcPP/index.html)|


### CashDispenser
This model is described in the sequential subset of VDM++. 
This enables abstraction from design considerations and ensures 
maximum focus on high-level, precise and systematic analysis. This
was developed by Sten Agerholm, Peter Gorm Larsen and Kim Sunesen 
in 1999 in connection with FM'99.


| | |
|------|-------|
|Author:|Sten Agerholm, Peter Gorm Larsen and Kim Sunesen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](CashDispenserPP/CashDispenser.zip)  / [show specification](CashDispenserPP/index.html)|


### CMConc
This example is used in the guidelines for developing distributed 
real time systems using the VICE extension to VDM++. This model 
is available in a sequential version, a concurrent version as
well as in a distributed real-time VICE version. This is the 
distributed real time version of this example.


| | |
|------|-------|
|Author:|Peter Gorm Larsen and Marcel Verhoef|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](CMConcPP/CMConc.zip)  / [show specification](CMConcPP/index.html)|


### CMSeq
This example is used in the guidelines for developing distributed 
real time systems using the VICE extension to VDM++. This model 
is available in a sequential version, a concurrent version as
well as in a distributed real-time VICE version. This is the 
distributed real time version of this example.


| | |
|------|-------|
|Author:|Peter Gorm Larsen and Marcel Verhoef|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](CMSeqPP/CMSeq.zip)  / [show specification](CMSeqPP/index.html)|


### Codegen
This example is produced by a group of students as a part
of a VDM course given at the Engineering College of Aarhus. 
This model describes how to do code generation from a small 
applicative language called Simple to a subset of Java (called
Geraffe). This example also illustrates how one can make use
of Java jar files as a part of a VDM model supported by
Overture.


| | |
|------|-------|
|Author:|Johannes Ulfkjær Jensen, Jon Nielsen and Leni Lausdahl|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](CodegenPP/Codegen.zip)  / [show specification](CodegenPP/index.html)|


### Concfactorial
This example is made by Nick Battle and it illustrates how one can 
perform the traditional factorial functionality using the concurrency
primitives in VDM++.


| | |
|------|-------|
|Author:|Nick Battle|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](concfactorialPP/Concfactorial.zip)  / [show specification](concfactorialPP/index.html)|


### Diet2japan
This example is made by Shin Sahara as a test of local higher order
functions defined inside explicit function definitions in order to
test the correct interpretation of these constructs.


| | |
|------|-------|
|Author:|Shin Sahara|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](diet2japanPP/Diet2japan.zip)  / [show specification](diet2japanPP/index.html)|


### Dining
This example is made by Marcel Verhoef and it demonstrates the standard
classical dining philosophers problem expressed in VDM++. The standard 
launcer provided here is sufficient to cover the entire VDM++ model.


| | |
|------|-------|
|Author:|Marcel Verhoef|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](DiningPP/Dining.zip)  / [show specification](DiningPP/index.html)|


### ElectronicPurse
This example is made by Steve Riddle as an example for an 
exam question used at the VDM course in Newcastle. It deals
with an electronic purse in a simple form. This is one of the
grand challenges that is considered by the formal methods 
community for formal verification.


| | |
|------|-------|
|Author:|Steve Riddle|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](ElectronicPursePP/ElectronicPurse.zip)  / [show specification](ElectronicPursePP/index.html)|


### Enigma
This VDM++ model is developed by Marcel Verhoef as a part of the VDM++ book
John Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel 
Verhoef. Validated Designs for Object-oriented Systems, Springer, New York. 
2005, ISBN 1-85233-881-4. This is a VDM++ model of the famous
Enigma cipher machine used by the Germans in the Second World War to
encrypt and decrypt messages that were exchanged between military
units. The purpose of the model is to get a basic understanding of the
cipher mechanism as implemented in Enigma. This example was the first place
where the VDMUnit testing approach was introduced.


| | |
|------|-------|
|Author:|Marvel Verhoef|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](EnigmaPP/Enigma.zip)  / [show specification](EnigmaPP/index.html)|


### HomeAutomationConc



| | |
|------|-------|
|Author:|Sune Wolff|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](HomeAutomationConcPP/HomeAutomationConc.zip)  / [show specification](HomeAutomationConcPP/index.html)|


### HomeautomationSeq
This is a sequential VDM++ version of a home automation example constructed
by Sune Wolff. 

More information can be found in:
Peter Gorm Larsen, John Fitzgerald and Sune Wolff, Methods for the Development 
of Distributed Real-Time Embedded Systems Using VDM, International Journal of 
Software and Informatics, Vol 3., No 2-3, June/September 2009, pp. 305-341.


| | |
|------|-------|
|Author:|Sune Wolff|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](HomeautomationSeqPP/HomeautomationSeq.zip)  / [show specification](HomeautomationSeqPP/index.html)|


### IMM



| | |
|------|-------|
|Author:||
|Version:|VDM_PP - classic|
|Details...|[model (zip)](IMMPP/IMM.zip)  / [show specification](IMMPP/index.html)|


### KLV
This example describes a VDM++ specification of a KLV system. The
purpose of the KLV system is to provide a continuous monitoring of the
speed of a train. The VDM++ specification is inspired by a KLV
description provided to the EP26538 FMERail project as case study by
Atelier B.  This model shows an example of how an informal description
can be translated into a precise model that together with a graphical
front-end can be used to ensure that the customer and the developer
have a common interpretation of the system under development.

The focus of the model is on the logic of the KLV systems when a train
meets speed restriction beacons along the tracks, i.e. on events that
triggers the KLV system. Issues such as how to determine whether a
beacon has been met within a certain distance calculated from speed
has been abstracted in away in the current model. They could be issues
to extend the model with.


| | |
|------|-------|
|Author:|Niels Kirkegaard|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](KLVPP/KLV.zip)  / [show specification](KLVPP/index.html)|


### Memoryproof



| | |
|------|-------|
|Author:||
|Version:|VDM_PP - classic|
|Details...|[model (zip)](memoryproofPP/Memoryproof.zip)  / [show specification](memoryproofPP/index.html)|


### MetroInterlocking
This example is produced by a student as a part of a VDM course given at the Department of Engineering at the University of Aarhus. This model describes a small interlocking system for a metro.


| | |
|------|-------|
|Author:|Steffen Diswal|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](MetroInterlockingPP/MetroInterlocking.zip)  / [show specification](MetroInterlockingPP/index.html)|


### Mondex



| | |
|------|-------|
|Author:||
|Version:|VDM_PP - classic|
|Details...|[model (zip)](MondexPP/Mondex.zip)  / [show specification](MondexPP/index.html)|


### MSAWconcur
This VDM++ model is made by August Ribeiro as input for the VDM
courses delivered at IHA in Denmark. It is a concurrent version 
of the Minimum Safety Altitude Warning System (MSAW) example.

This project is currently not running with the Overture interpreter.


| | |
|------|-------|
|Author:|Augusto Ribeiro|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](MSAWconcurPP/MSAWconcur.zip)  / [show specification](MSAWconcurPP/index.html)|


### MSAWseq
This VDM++ model is made by August Ribeiro as input for the VDM
courses delivered at IHA in Denmark. It is a concurrent version 
of the Minimum Safety Altitude Warning System (MSAW) example.

2011-12-28 This VDM++ model has been updated by Rasmus Lauritsen 
with the addition of a swing java radar display. The Radar.vdmpp 
model is now hooked up the with Radar display. The radar display 
will make a 360 degrees scan everytime the "Scan" operation on 
the Radar is invoked.

lib/radar.jar contains binary and source code for the java radar 
display.


| | |
|------|-------|
|Author:|Augusto Ribeiro|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](MSAWseqPP/MSAWseq.zip)  / [show specification](MSAWseqPP/index.html)|


### PacemakerConc
This model is made by Hugo Macedo as a part of his MSc thesis of a
pacemaker according to the grand challenge provided by Boston
Scientific in this area. This is the last of a series of VDM models
of the pacemaker and it incorporates a number of modes for the 
pacemaker. More information can be found in:

Hugo Macedo, Validating and Understanding Boston Scientific Pacemaker
Requirements, MSc thesis, Minho University, Portugal, October 2007.

Hugo Daniel Macedo, Peter Gorm Larsen and John Fitzgerald, Incremental 
Development of a Distributed Real-Time Model of a Cardiac Pacing System 
using VDM, In FM 2008: Formal Methods, 15th International Symposium on 
Formal Methods, Eds, Jorge Cuellar and Tom Maibaum and Kaisa Sere, 2008,
Springer-Verlag, Lecture Notes in Computer Science 5014, pp. 181--197.


| | |
|------|-------|
|Author:|Hugo Macedo|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](PacemakerConcPP/PacemakerConc.zip)  / [show specification](PacemakerConcPP/index.html)|


### PacemakerSeq
This model is made by Hugo Macedo as a part of his MSc thesis of a
pacemaker according to the grand challenge provided by Boston
Scientific in this area. This is the last of a series of VDM models
of the pacemaker and it incorporates a number of modes for the 
pacemaker. More information can be found in:

Hugo Macedo, Validating and Understanding Boston Scientific Pacemaker
Requirements, MSc thesis, Minho University, Portugal, October 2007.

Hugo Daniel Macedo, Peter Gorm Larsen and John Fitzgerald, Incremental 
Development of a Distributed Real-Time Model of a Cardiac Pacing System 
using VDM, In FM 2008: Formal Methods, 15th International Symposium on 
Formal Methods, Eds, Jorge Cuellar and Tom Maibaum and Kaisa Sere, 2008,
Springer-Verlag, Lecture Notes in Computer Science 5014, pp. 181--197.


| | |
|------|-------|
|Author:|Hugo Macedo|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](PacemakerSeqPP/PacemakerSeq.zip)  / [show specification](PacemakerSeqPP/index.html)|


### PacemakerSimple
This model is a very simple version of the pacemaker as it has
been used for a small exercise to VDM newcommers. It was first 
used in a VDM course delivered by Steve Riddle and John Fitzgerald
and later used and adjusted by Peter Gorm Larsen also.


| | |
|------|-------|
|Author:|Steve Riddle and Peter Gorm Larsen|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](PacemakerSimplePP/PacemakerSimple.zip)  / [show specification](PacemakerSimplePP/index.html)|


### POP3
This example is written by Paul Mukherjee and it is used in the VDM++ book
John Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel 
Verhoef. Validated Designs for Object-oriented Systems, Springer, New York. 
2005, ISBN 1-85233-881-4. The concurrent system in question is a server 
for the POP3 protocol. This is a protocol supported by all major email c
lients to fetch email messages from the email server.


| | |
|------|-------|
|Author:|Paul Mukherjee|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](POP3PP/POP3.zip)  / [show specification](POP3PP/index.html)|


### ProductLine



| | |
|------|-------|
|Author:|Naoyasu Ubayashi, Shin Nakajima and Masayuki Hirayama|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](ProductLinePP/ProductLine.zip)  / [show specification](ProductLinePP/index.html)|


### Quadilateral
This example deals with quadilaterals (figures with four 
straight lines) and the inheritance between them. A few 
basic operations are defined in the respective classes. 
This package also illustrates how to make use of C++ 
code automatically generated using VDMTools.


| | |
|------|-------|
|Author:|Stephen Goldsack|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](QuadilateralPP/Quadilateral.zip)  / [show specification](QuadilateralPP/index.html)|


### ReaderWriter



| | |
|------|-------|
|Author:||
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](ReaderWriterPP/ReaderWriter.zip)  / [show specification](ReaderWriterPP/index.html)|


### SAFER
This specification is a VDM++ model of the SAFER 
(Simplified Aid for EVA Rescue) example presented in 
the second volume of the NASA guidebook on formal 
methods. 

Here Appendix C contains a complete listing of the 
SAFER system using PVS. We have translated this PVS 
specification rather directly into VDM-SL previously 
and here that model is again moved to VDM++. In the 
VDM++ model we have abstracted away form a number of 
parts which has been left as uninterpreted functions 
in the PVS model. This has been done because we have 
defined the purpose of the model to clarify the 
functionality of the thruster selection logic and the 
protocol for the automatic attitude hold functionality. 
Otherwise we have on purpose varied as little as 
possible from the given PVS model. In order to 
visualise this example the dynamic link feature is 
illustrated as well. In the test class Test there are 
a few examples of using the traces primitives used for 
test automation. 

More explanation about this work can be found in the papers: 
 *Sten Agerholm and Peter Gorm Larsen, Modeling and 
  Validating SAFER in VDM-SL, ed: Michael Holloway, 
  in "Fourth NASA Langley Formal Methods Workshop", 
  NASA, September 1997. 
 *Sten Agerholm and Wendy Schafer, Analyzing SAFER using 
  UML and VDM++, ed: John Fitzgerald and Peter Gorm Larsen, 
  in "VDM Workshop at the Formal Methods 1999 conference, 
  Toulouse


| | |
|------|-------|
|Author:|Sten Agerholm and Peter Gorm Larsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](SAFERPP/SAFER.zip)  / [show specification](SAFERPP/index.html)|


### SAFERProof



| | |
|------|-------|
|Author:|Sten Agerholm|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](SAFERProofPP/SAFERProof.zip)  / [show specification](SAFERProofPP/index.html)|


### Smoking



| | |
|------|-------|
|Author:|Claus Ballegaard Nielsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](SmokingPP/Smoking.zip)  / [show specification](SmokingPP/index.html)|


### SortingParcels
The purpose of this VDM++ model is to analyse the rules governing for
distributing parcels with different kinds of goods is a
warehouse. This model is made by Bjarke Møholt as a small mini-project
in a course on "Modelling of Mission Critical Systems" (see
https://services.brics.dk/java/courseadmin/TOMoMi/pages/Modelling+of+Mission+Critical+Systems).


| | |
|------|-------|
|Author:|Bjarke Møholt|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](SortingParcelsPP/SortingParcels.zip)  / [show specification](SortingParcelsPP/index.html)|


### Sorting
This example is a simple Sorting library with tests that are partly formed from combinatorial traces,
and partly from VDMUnit tests.


| | |
|------|-------|
|Author:|Nick Battle|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](SortingPP/Sorting.zip)  / [show specification](SortingPP/index.html)|


### SortPP
This VDM++ model is made by Peter Gorm Larsen in 2010 based on the original 
VDM++ model created many years ago at IFAD.


| | |
|------|-------|
|Author:|Peter Gorm Larsen|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](sortPPPP/SortPP.zip)  / [show specification](sortPPPP/index.html)|


### SSlibE2
This example contains a large collection of test classes that can be
used to test different aspects of VDM++. This makes use of the VDMUnit 
test approach.


| | |
|------|-------|
|Author:|Shin Sahara|
|Version:|VDM_PP - classic|
|Details...|[model (zip)](SSlibE2PP/SSlibE2.zip)  / [show specification](SSlibE2PP/index.html)|


### Stack



| | |
|------|-------|
|Author:||
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](stackPP/Stack.zip)  / [show specification](stackPP/index.html)|


### TempoCollaborative
This is a brief description on how to run the TEMPO demonstrator, and how to configure it. This is without the graphical 
extensions made in the project for Overture: for the use of those we refer to the associated manuals. The below is still
relevant if you want to use the graphical extensions, though.

The demonstrator is executed by launching a run configuration. So in order to do that you have to make one. A typical example
has the following parameters:
- Launch mode: Entry point
- Class: World()
- Function/Operation: Run("RotterdamNetwork.csv", "TMSconfiguration.csv", 300)

The operation "Run" takes three parameters:
- A network configuration (in the example: "RotterdamNetwork.csv")
- The configuration of the TMS in the system (in the example: "TMSconfiguration.csv")
- The duration of the simulation in units of 10 seconds, which is the cycle time between the Java simulator and the VDM 
  model. In the example it is 300, that means 3000 seconds = 50 minutes. Since the simulator first takes 20 minutes 
  without interacting with the model this means that the total run time is 70 minutes in the example.
  
All configuration files are .csv, so basically comma seperated text files.

The following files are relevant:
- network description
- TMS configuration
- geographic description of the network
- description of the events taking place during the simulation.

*** Network desscription ***

This file contains the following information for every edge in the network:
- The identifier of the edge
- the starting node for the edge
- the end node for the edge
- the length of the edge
- the number of lanes that the edge has
- the maximum speed for the edge
- flow of cars into the edge

An example line in the file could be: "A201","A20S","A20A4",1,2,70,240

*** TMS description ***

This file contains the following information for every TMS in the network:
- the identification of the TMS
- an identification of the edge included
- a traffic control measure if available (alternatively nil is included)
- a priority if available (alternatively nil is included, lower numbers mean a higher priority)
- possible suggested routes to make diversions avoiding the edge (currently this value is always nil)

An example line in the file could be: "RWS","A152","HardShoulder",1,nil

*** Geographic description ***

This is only relevant for the Java simulator. The file should always have the name "GeoInfo.csv". It specifies
the geographic location in terms of GPS coordinates for each node in the network, so that the simulator knows
where to plot it on the map.

*** Events ***

Describes the events that take place during the simulation. Each line contains:

- Time in seconds after t=0 the event occurs (i.e. including the 20 minute initialisation time that the simulator takes to 
  fill the network
- The type of event. This can be one of the following:
  * SetInputStream -- sets the number of vehicles injected on a certain edge in terms of #vehicles/minute
  * BridgeOpen -- opens a bridge (should result in a diversion if possible)
  * BridgeClose --  closes a bridge (NB to work correctly a bridge should be closed explicitly at t=0)
  * Incident -- typcially an accident that blocks part of the road, thus limiting the capacity of an edge
  * IncidentEnds -- End the incident and increases capacity again
- the edge where the event occurs
- a numeric value relevant for the edge. In case of:
  * A SetInputStream event: #vehicles/minute injected in the edge
  * Bridge or Incident: the percentage related to the length of the edge at which the bridge or incident is located.
  
An example line in the file could be: 1220,"SetInputStream","A153",5

*** Use of Overture Graphics Support ***

As a part of the TEMPO project a new plug-in on top of the Overture tool called the "Overture Graphics 
Plugin Development". Thus, it is possible to update versions of Overture version 2.4.0 or higher under
"Help -> Install New Software" inside the Overture Eclipse tool. After having installed the plug-in it is
possible to add this feature for a specific project by selecting "Overture Graphics -> Add Overture 
Graphics Library" by right-clicking on a project. When this have been carried out debugging can be started
with a special "Vdm Graphics Application" and this will start up a seperate Electron application called the
"Overture Graphics Plugin". Here one need to choose the root class (in this case "World") and afterwards 
what top-level method to run (in this can one can either select "run" or "runwithoutcollab"). Afterwards, 
it is possible to define multiple plots which can be viewed while a VDM simulation is on-going (either in 
2D  or 3D). For this model it makes sense to monitor "tmsX.averagedensity" and "tmsX.averagevelocity" where
X is either 1 or 2. Finally, it is possible to select a plot and dooble click on it and then start the VDM
simulator with the selected operation. In this case a new GUI (programmed in Java) will come up and then 
from there the entire simulation can be started up.


| | |
|------|-------|
|Author:||
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](TempoCollaborativePP/TempoCollaborative.zip)  / [show specification](TempoCollaborativePP/index.html)|


### Trackerproof
This VDM++ model is a direct transformation from the 
VDM-SL model presented in the Fitzgerald&Larsen98 book 
on VDM-SL. The tracker takes care of monitoring and 
controlling the nuclear material in a plant that takes 
care of processing such waste material.


| | |
|------|-------|
|Author:|John Fitzgerald|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](trackerproofPP/Trackerproof.zip)  / [show specification](trackerproofPP/index.html)|


### Trayallocation
This VDM++ model is made by two students of a sortation system
able to sort parcels into different trays for example for an
airport sorting suitcases for different flights. The model here
focus on the algorithm for prioritising between different feeders
to the conveyer belt


| | |
|------|-------|
|Author:|Kim Bjerge and José Antonio Esparza Jaesparza|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](trayallocationPP/Trayallocation.zip)  / [show specification](trayallocationPP/index.html)|


### Tree
This VDM++ model contains basic classes for defining 
and traversing over abstract threes and queues.


| | |
|------|-------|
|Author:||
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](treePP/Tree.zip)  / [show specification](treePP/index.html)|


### VFS
This is a Specification of the File System Layer, sliced at the 
FS_DeleteFileDir operation, as defined in the INTEL Flash File 
System document. It includes: a VDM++ model that can be model 
checked in an equivalent Alloy model; and an adapted version 
of the VDM++ model to be used in the Overture Automated Proof 
Support system. In the test class UseFileSystemLayerAlg there 
are a few examples of using the traces primitives used for 
test automation. This model has been developed by Miguel 
Ferreira


| | |
|------|-------|
|Author:|Miguel Ferreira|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](VFSPP/VFS.zip)  / [show specification](VFSPP/index.html)|


### Webserver
This is a very simple VDM++ of the basic functionality of a web
server.


| | |
|------|-------|
|Author:||
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](webserverPP/Webserver.zip)  / [show specification](webserverPP/index.html)|


### Worldcup
This example illustrates how one can define the rules 
for calculating who will qualify in the world 
championship in soccer given different initial groups. 
This model is made for the championship in 2000 but it 
could easily be updated to reflect the any championships. 
In the test class UseGP there are a few examples of 
using the traces primitives used for test automation.


| | |
|------|-------|
|Author:|Yves Ledru|
|Version:|VDM_PP - vdm10|
|Details...|[model (zip)](worldcupPP/Worldcup.zip)  / [show specification](worldcupPP/index.html)|

