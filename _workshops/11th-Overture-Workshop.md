---
layout: default
title: The 12th Overture Workshop
date: 2014-06-21
location: Newcastle upon Tyne, UK
---

# {{ page.title }}

## 12th Overture Workshop on VDM, Newcastle University, Newcastle upon Tyne, UK, Saturday 21 June 2014 

<img src="12/Ncl18980.jpg" width="200px" />
<img src="12/Ncl7971.jpg" width="200px" />
<img src="12/Ncl26696.jpg" width="200px" />

The proceedings are available [HERE](12/TR1446.pdf) as N. Battle and J. S. Fitzgerald (Eds.), Proceedings of the 12th Overture Workshop, Newcastle University, 21 June 2014, Technical Report CS-TR-1446, School of Computing Science, Newcastle University. 

The 12th in the “Overture” series of workshops on the Vienna Development Method, its associated tools and applications, was held in association with the [COMPASS](http://www.compass-research.eu) project at Newcastle in June 2014. The workshop aimed to identify and encourage new collaborative research, and to foster current strands of work towards new projects and publications. 

VDM is one of the longest established formal methods, having its origins in compiler development work in IBM in the 1970s. In the 1990s, the basic VDM modelling language was standardized by ISO and the first commercial tools emerged. Since 2000, the method has been extended to support object-orientation, concurrency, real-time and distribution. Advances in these areas led to the development of new technology for the design of embedded systems based on [collaborative modelling and co-simulation](http://www.springer.com/computer/communication+networks/book/978-3-642-54117-9). A notable recent development has been the very successful combination of VDM with Circus as a basis for the COMPASS Modelling Language (CML) – the first formal modelling language developed specifically for systems of systems (SoSs). 

Research in VDM is driven as much by the needs of industry practice as by a wish to develop fundamental theory. As a consequence, the need for robust tool support has been a priority for many years. The community-based [Overture](http://www.overturetool.org) initiative is developing industry-strength tools on a new open platform that has been successfully adapted to form a platforms for co-modelling and co-simulation in embedded systems design (the [Crescendo](http://www.crescendotool.org) platform), and latterly SoS modelling, verification and testing (the [Symphony](http://www.symphonytool.org) platform). 

The 12th workshop reflected the breadth and depth of work in VDM. Contributions covered topics as diverse as fundamental approaches to reasoning about concurrency, design space exploration, the use of Crescendo in teaching, and of course tools (interpreter design, code generation and the maturing architecture of Overture itself). Presentations most talks are to be found in the Overture Wiki .

We are grateful to the [School of Computing Science](http://www.ncl.ac.uk/computing) at [Newcastle University](http://www.ncl.ac.uk/) for its kind hospitality in hosting the workshop for the fourth time in the fifteen year history of the series.


### Programme

* 0900-0930 Coffee and Welcome (John Fitzgerald and Nick Battle) 
* 0930-1010 Enabling Interpretation of Implicit VDM Specifications using ProB (Kenneth Lausdahl, Hiroshi Ishikawa and Peter Gorm Larsen)
* 1010-1050 Code Generation for VDM++ (Peter Würtz Vinther Jørgensen, Morten Larsen and Luis Diogo Couto)
* 1050-1120 Coffee 
* 1120-1200 A Guide to the Architecture of Overture (Luis Diogo Couto)
* 1200-1230 Tools Development Update (Joey Coleman) 
* 1220-1330 Lunch at the [Northern Stage](http://www.northernstage.co.uk/northern-stage/)
* 1330-1410 Concurrency, Rely/Guarantee and Separation Logic (Cliff Jones)
* 1410-1450 Design Space Exploration through Co-modelling and Co-simulation – the Pacemaker Challenge (John Fitzgerald, Carl Gamble, Peter Gorm Larsen, and Martin Mansfield)
* 1450-1530 Teaching With Crescendo (Ken Pierce) 
* 1530-1600 Tea
* 1600-1645 Closing Discussion (John Fitzgerald and Nick Battle)
* 19:00 Dinner at the [Bridge Tavern](http://www.thebridgetavern.com/)


### Abstracts

#### Enabling Interpretation of Implicit VDM Specifications using ProB

_Authors_ Kenneth Lausdahl, Hiroshi Ishikawa and Peter Gorm Larsen <br />
_Abstract__ Modelling of software can with advantage start by the creation of an initial software design at a high-level of abstraction expressed as implicit specifications. The Vienna Development Method is a formal method that support different levels of abstraction including such implicit specification mechanisms. However, most of the existing tool-support for VDM does not support this style of modelling adequately from an analysis perspective. In this paper we demonstrate how such implicit specifications can be made interpretable through the use of the ProB constraint solver allowing them to be validated like explicit specifications. We shown how an internal translation to ProB is made and how this integrates with the existing VDM interpreter from Overture.

#### [A Code Generation Platform for VDM](12/Slides_codegen.pdf)

_Author_ Peter Würtz Vinther Jørgensen, Morten Larsen and Luis Diogo Couto <br />
_Abstract_ In this paper we describe ongoing work on a code generation platform that simplifies the construction of code generators for VDM in the Overture tool. The platform represents the code generated model as an Intermediate Representation (IR) and assists a code generator in transforming the IR into a structure that is easier to code generate. Since the IR is independent of any target language, a code generator can choose the transformations it needs to obtain the IR it desires. Based on the code generation platform a VDM++ to Java code generator has been developed, while early work is currently being made on a C++ code generator. Implementing the Java and C++ code generators has provided useful feedback for the architecture of the code generation platform. This has helped us to generalise the platform structure in order to make it a stronger foundation to use for constructing code generators.

#### [A Guide to the Architecture of Overture](12/Archi-guide-intro.pdf)

_Author_ Luis Diogo Couto <br />
_Abstract_ Overture is an open source IDE for VDM with an extensible, plug-in based architecture. However, it currently faces significant challenges to its developer resources. The number of active developers is small and it is difficult to attract new developers, in part because the Overture code base is large and complex and therefore challenging to learn.  This is further complicated by a lack of documentation throughout. This paper presents an initial effort to address these challenges in the form of a guide to the architecture of Overture. The guide itself is a living document, being maintained in the developer wiki. This paper presents key sections of the guide as well as issues encountered during its production and possible solutions.


#### [Tools Development Update](12/ToolsDevelopmentUpdate.html)

_Author_ Joey Coleman <br />
_Abstract_ We will give an overview of the nut and bolts state of how development, and what we're currently working to improve upon.

#### [Concurrency, Rely/Guarantee and Separation Logic](12/2014-06-Overture-CJ.pdf)

_Author_ Cliff Jones <br />
_Background ( by JSF)_ One of the largest research challenges in formal methods is finding compositional development methods to cope with systems which run in concurrent environments. This challenge becomes ever more pressing with the advent of many-core hardware. My Oxford research showed how the notion of interference could be handled in specifications and design verification by using rely and guarantee-conditions. However rely/guarantee reasoning is heavier than for sequential programs, and subsequent work -- for example on object-based approaches and on atomicity refinement -- has sought to ease this burden. Current promising research includes looking at the links to separation logics. Relevant active projects include the UK EPSRC-funded [Taming Concurrency](http://www.ncl.ac.uk/computing/research/project/4519) with [Dr Nisansala Yatapanage](http://homepages.cs.ncl.ac.uk/nisansala.yatapanage/) and [Andrius Velykis](http://andrius.velykis.lt/), and the ARC-funded [Reasoning about concurrent programs: Refining rely-guarantee thinking](http://www.ncl.ac.uk/computing/research/publication/195502), led by [Prof. Ian Hayes](http://staff.itee.uq.edu.au/ianh/). 


#### Design Space Exploration through Co-modelling and Co-Simulation - the Pacemaker Challenge

_Author_ John S Fitzgerald, Carl Gamble, Peter Gorm Larsen and Martin Mansfield <br />
_Abstract_ We present a study aiming to demonstrate that co-modelling and co-simulation can be used to explore design alternatives in the context of the pacemaker challenge problem. Specifically, we show the use of VDM as a discrete-event formalism modelling the controller, coupled to a continuous time model of the leads and heart environment represented in 20-sim. Possibilities for the exploration of design alternatives through co-simulation are illustrated by examining the change from synchronous to asynchronous pacing modes in the presence of noise. 

#### Teaching with Crescendo

_Author_ Ken Pierce <br />
_Abstract_ We describe the use of Crescendo, Overture and 20-sim in the design and delivery of an undergraduate course on Real-Time and Cyber-Physical Systems. The underlying goal is to be able to teach Computing Science students the basic elements of real-time control using co-simulation of VDM-RT with 20-sim, instead of direct control of real laboratory robots. Based on the experience in delivering the course, we have developed fresh tutorial material for Crescendo, and piloted it at FM 2014 this year.


### Key Dates

* Final Versions Due: 21 June 2014
* Workshop: 21 June 2014

### Organisers

* [Nick Battle](mailto:Nick.Battle@gmail.com), Fujitsu UK 
* [John Fitzgerald](mailto:John.Fitzgerald@ncl.ac.uk), Newcastle University, UK
* [Claire Smith](mailto:Claire.Smith@ncl.ac.uk), Newcastle University, UK

### Participants

![Front row: Ken Pierce, Kenneth Lausdahl, Cliff Jones, Joey Coleman, Peter Gorm Larsen, Carl Gamble; Back row: Mark Jackson, Marcel Verhoef, Luis Couto, John Fitzgerald, Nick Battle, Peter Joergensen, Hiroshi Ishikawa](12/I26A5745.JPG)

