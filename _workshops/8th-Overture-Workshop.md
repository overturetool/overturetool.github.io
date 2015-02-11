---
layout: default
title: The 8th Overture Workshop
date: 2014-06-21
location: Unknown
---

# {{ page.title }}

Introduction
------------

VDM (The Vienna Development Method) is a well-established formal method,
which has seen widespread use in both academia and industry. In recent
years, extensions have been defined that introduce notions of
object-orientation and real-time control to VDM. These extensions bring
with them many interesting semantic issues that are yet to be resolved.
This one-day workshop, jointly organized by the VDM Community and
BCS-FACS, addressed semantic issues relating to the formal specification
language and its derivatives, together referred to as "VDM-10", and to
the "Overture" open tools project for VDM-10.

Title, date and location
------------------------

"Semantic Issues in VDM: a BCS-FACS and Overture Workshop"

13 September 2010. BCS, Davidson Building, 5 Southampton Street, London
WC2E 7HA, United Kingdom

The proceedings of the workshop is available as a technical
report[1](http://www.cs.ncl.ac.uk/publications/trs/papers/1224.pdf) from
Newcastle University.

![|700px](8thgroup.jpg "|700px")

Sponsors
--------

The workshop was sponsored by the BCS, who kindly offered free use of
their location and refreshments.The workshop was followed by a BCS-FACS
evening seminar, where Jan Broenink (University of Twente, The
Netherlands) gave a presentation: "Embedded Control Software Design with
Formal Methods and Engineering Models".

Agenda for the workshop
-----------------------

09:00 Introduction and welcome

09:10 Theme 1: "Object-orientation". Presentations by Nick Battle and
Erik Ernst, followed by a short intermission and a 1,5 hour discussion
block

12:00 Lunch

13:00 Theme 2: "PhD Work". Presentations by Matthew Lovert and Claus
Nielsen.

14:00 Theme 3: "Real-time and co-simulation". Presentations by Kenneth
Lausdahl and Marcel Verhoef, followed by a short intermission and a 1,5
hour discussion block.

16:45 Concluding remarks

16:55 End of Workshop

Abstracts and presentations
---------------------------

-   Nick Battle (Fujitsu, UK): [Object Oriented Issues in
    VDM++](2010battle.pdf "wikilink")

Abstract: The semantics of the VDM-SL dialect of VDM is formally defined
in an ISO standard. However, the object oriented dialect, VDM++, has
only an informally defined semantics and this causes problems both in
the development of VDM++ tool support, and with the use of the dialect
for formal verification. This paper summarises the semantic issues
encountered while developing VDM++ support in the VDMJ tool, and the
informal proposals for how to address them in VDM-10.

-   Erik Ernst (Aarhus University, Denmark): [The Case for Simple
    Object-Orientation in VDM++](2010ernst.pdf "wikilink")

Abstract: In the process of defining a precise semantics for VDM++,
there are many possible criteria for the selection of features and their
detailed properties. We take an outsider's view on the known
difficulties and ambiguities, and argue for a strong emphasis on the
most foundational features. Based on such a simple core language with
few but full-fledged features, additional features could then be
supported by means of a reduction to the core language, which allows for
an open-ended set of additional features including multiple variants.
This approach reduces the complexity for tool implementers, and ensures
semantic transparency for users. The use of additional features may
represent a trade-off between convenient and familiar usage and semantic
transparency, but at least the division between core and additional
features is explicit which puts the user in control of the trade-off.

-   Matthew Lovert (University of Newcastle, UK): [A Semantic Model for
    the Logic of Partial Functions](2010lovert.pdf "wikilink")

Abstract: Partial functions and operators arise frequently in program
specifications. The application of partial functions and operators can
give rise to non-denoting (undefined) terms. Non-denoting terms that are
then arguments to strict relational operators lead to non-denoting
logical values of which First-Order Predicate Calculus has no meaning
for. One logic that copes naturally with propositions over terms that
can fail to denote is a non-classical (three-valued) logic entitled the
The Logic of Partial Functions (LPF). The aim of this paper is to
provide semantics for LPF, which is done through a Structural
Operational Semantics which provides an intuitive introduction into how
LPF copes with non-denoting terms that can arise.

-   Claus Nielsen (Aarhus School of Engineering, Denmark): [Towards
    Dynamic Reconfiguration of Distributed Systems in
    VDM-RT](2010nielsen.pdf "wikilink")

Abstract: The VDM-RT dialect enables the modeling and validation of
distributed embedded real-time systems by expressing the distributed
architecture as CPUs connected by buses. This paper presents the initial
results of a study in extending VDM-RT to enable dynamic reconfiguration
during the runtime execution of a model. New language constructs is
introduced for expressing the dynamic reconfiguration of the deployment
of CPUs and changes to the BUS topology as well as subsystem
redeployment on CPUs during the execution of the model. A case study of
a vehicle monitoring system is presented to show the semantics of the
proposed extension and demonstrate the impact on a model.

-   Kenneth Lausdahl (Aarhus School of Engineering, Denmark), [Towards a
    Formal Semantics for Concurrency, Communication, Real-time and
    Probabilities in VDM-RT](2010lausdahl.pdf "wikilink") and and Marcel
    Verhoef (Chess, The Netherlands): [Preparing Overure for the
    Future - VDM10++ / VDM1X](2010mave.pdf "wikilink")

Abstract: An inventory of current semantic models of the VDM language is
presented, for which their purpose, strengths and weaknesses are
assessed. The focus will be on VDM-RT with (multi-threading and
multi-core) concurrency, communication, scheduling and real-time. Areas
are identified where the semantics is currently unclear, incomplete or
even undefined. Challenges in adopting novel language concepts are
investigated, for example for modeling uncertainty in real-time
distributed systems. Approaches taken by other formalisms are presented
and suggestions are offered how these ideas could be applied in the
context of VDM-RT. The result of this work shall be a roadmap for the
definition of a full semantics of VDM-RT, which is aimed, on the short
term, at symbolic execution (simulation), but needs to be amenable to
formal proof and exhaustive search (model checking) in the future.

Organizers
----------

-   Nico Plat (West Consulting BV, The Netherlands)
-   Sune Wolff (Aarhus School of Engineering, Denmark)
-   Ken Pierce (Newcastle University, UK)

Pictures
--------

Image:Pic21.JPG|The Ouverture Workshop will be held in Wilkes Room 2
Image:Pic25.JPG|Nico Plat opens the workshop Image:Pic1.JPG|Participants
in the morning Image:Pic2.JPG|Nick Battle with the first talk of the day
Image:Pic3.JPG|Nick again, enthusiastic about the subject
Image:Pic4.JPG|Peter Gorm Larsen explaining invariants
Image:Pic22.JPG|Football and formal methods mixed up?
Image:Pic5.JPG|Erik Ernst Image:Pic6.JPG|The group listening to Erik
Image:Pic7.JPG|Erik explaining diamond inheritance Image:Pic8.JPG|The
group again Image:Pic9.JPG|Erik listening and thinking
Image:Pic24.JPG|Peter Gorm Larsen proudly presents the Japanese
translation of VDFOS Image:Pic10.JPG|Matthew Lovert
Image:Pic11.JPG|Claus Nielsen Image:Pic12.JPG|Kenneth Lausdahl
Image:Pic13.JPG|Shin Sahara taking a picture Image:Pic14.JPG|Marcel
Verhoef Image:Pic15.JPG|Subgroup \#1 disccussing RT and co-sim issues
Image:Pic16.JPG|Subgroup \#2 disccussing RT and co-sim issues
Image:Pic17.JPG|Subgroup \#3 disccussing RT and co-sim issues
Image:Pic18.JPG|Ken Pierce Image:Pic19.JPG|Sune Wolff and Peter Gorm
Larsen Image:Pic20.JPG|Marcel Verhoef
