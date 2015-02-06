---
layout: default
title: Net Meeting 36
date: 2 August 2009, 1300 CET
---


# Net Meeting 36

|||
|---|---|
| Date | 2 August 2009, 1300 CET |
| Participants | Peter Gorm Larsen, John Fitzgerald, Shin Sahara, Nick Battle, Kenneth Lausdahl?, Sako Hiroshi, Augusto Ribeiro, Nico Plat, Miguel Ferreira. |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   33/3: Kenneth update Ov. wiki and set up tools updatesite - Closed
-   34/1: Shin to enable everyone to see tracking - Closed (a mail Mr.
    Ueki if you wants to look the bug list masayuki-ueki@....com)
-   34/3: All to update web pages - (good ideas about the stucture
    should be emailed to PGL/Miguel until the 10th of August)
-   35/2: Get OCP v1.1 upgraded form DRAFT to full status - Closed
-   35/3 Everyone to test the updatesite and stand-alone - Closed

VDMTools
--------

Shin sent out the usual VDMTools report (see overture-core list).

-   Action 36/1: ALL; get UIDs for access to bug list

Overture
--------

-   Action 36/2: ALL - email PGL & Miguel with ideas for improved Wiki

Status for each of the Overture components at sourceforge

-   Action 36/3: Gather & manage defect reports against the update site
    (KennethLausdahl)

traces and UML mapper (KennethLausdahl)

Core components

AST:

-   Added Oml2VppVisitor both vpp and Java. (Other versions of the file
    will be removed later from the SVN)

StdLib:

-   Decompiled the UTIL class to remove all the wrong error markings
    Eclipse make in source files when it cannot resolve the class. (The
    rest of the class files will also be decompiled soon.)
-   Added VDMUtil both vpp and Java. (Java implementation is incomplete)
-   Added IO both vpp and Java. (Java implementation is incomplete)

Umltrans:

-   Updated Vpp to Uml to report classes which cannot be transformed in
    the console
-   Added print of transformed classes and total execution time
-   Added unit test comparing both vpp files and xmi files from the
    transformation with expected files.

Tools (Maven build automation)

-   Vdmt (1.0.3):
-   New goal for creation of VDM Tools project
-   Update to the code generator so it works with large number of
    classes and have build in check sum to insure that only changed
    classes are generated.
-   New goal to generate a log file with the path to all files in the
    project.

Astgen

-   Created a Maven plugin to wrap Marcels AstGen?
-   Added a goal for generating the vpp files from a .ast file in a
    project

eclipse (Christian and David)

No status reported

POTrans (Miguel)

Miguel has created a new subproject named Automatic Proof System (APS)
(svn:core/proofsupport) where he implemented the basic interaction for
the proof system as designed by Sander Vermolen.

-   Action 36/4: Miguel to coordinate a demo of proof support by FM09

VDMJ (Nick)

Nick created a command line client for the DBGp protocol. Nick started
the work on the VICE extension execution (previously it only did VICE
type checking).

Overture Community Process

Note: Language Board = Executive Committee.

LB to be downsized to 5 members. The LB accepted the first three
proposals and they are:

-   International character support for Overture identifiers
-   The introduction of the "reverse" sequence operator
-   Generalising let-be expressions

The proposals will pass through a stage of deliberation and then
execution.

Overture covering several VDM dialects instead of just OML?

Overture will undergo a series of changes to make it more linkable with
the VDM "brand". Dropping the OML name is one of the actions and
avoiding the reference to different dialects might help with citations.
Referring to it as VDM tools: Next Generation could also improve the
visibility of Overture.

Overture will support different VDM dialects. LB is to decide which
changes to the dialect will be supported but anybody is allowed to make
any their own experiments/changes. Rodin Report - Kenneth & Miguel

See overture-core list.

Workshop

Program of the [7th Overture Workshop](7th Overture Workshop "wikilink")

Publication plans
-----------------

In preparation:

-   Overture Introductory paper aimed at ACM SE Notes (Peter, Nick,
    John, others?)
-   Paper path case study (Marcel & Jozef)
-   New proof paper (Sander, Peter, Jozef)
-   Japanese Translation of VDM++ Book (Sakoh, hopefully publication by
    August 2009)
-   Pos for Recursive Functions (Augusto, Peter)

In review:

-   CT (Kenneth, Peter, Nick) submitted to ICFEM 09
-   VICE Process paper (John, Peter, Sune Wolff) accepted by special
    issue of International Journal of Software and Informatics – in
    final updates now.
-   Felica (Mr Kurita) accepted by special issue of International
    Journal of Software and Informatics – in final updates now.
-   UML mapper (Kenneth, HK, Peter) accepted by FM’09 - in final updates
    now.
-   Industrial applications of FMs (Juan, John, Peter, Jim), accepted
    for I-Day at FM09. Completed.

In press:

-   ACM Computing Surveys paper on industrial applications of FMs (Jim,
    Peter, Juan, John).
-   Jozef and Marcel: Formal Semantics of a VDM Extension for
    Distributed Embedded Systems; to appear in Festschrift for W P de
    Roever (LNCS).
-   Jozef, A summary of the FM06 and IFM07 paper and enhanced the PVS
    models, to appear in Festschrift for W P de Roever (LNCS).

Nothing in the "recently appeared" list.

Any Other Business
------------------

Mr Takayuki Moriof the Systems Development Center in Komatsu is expected
now to come to Newcastle to work on embedded systems design and formal
methods generally for 18 months from January 2010.

Next Meeting
------------

September 6th 2009, 1300 CET

Note: next NM should address the problem of 13:00 CET = 20:00 JST.
