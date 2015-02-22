---
layout: default
title: Net Meeting 37
date: 6 September 2009, 1300 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 37

|||
|---|---|
| Date | 6 September 2009, 1300 CET |
| Participants | Peter Gorm Larsen, John Fitzgerald, Shin Sahara, Nick Battle, Carlos Vilhena, Sako Hiroshi, Augusto Ribeiro and Marcel Verhoef. |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   36/1: ALL; get UIDs for access to bug list - Closed
-   36/2: ALL - email PGL & Miguel with ideas for improved Wiki - Closed
-   36/3: Gather & manage defect reports against the update site - Open
-   36/4: Miguel to coordinate a demo of proof support by FM09 - Open
-   37/1: PGL to crown someone "Wiki Czar" - New
-   37/2: Shin and Augusto to address Shin's Overture bugs - New
-   37/3 LB to improve internal operations: internal NMs? - New
-   37/4: negotiate display stand arrangements for FM'09 - New

VDMTools
--------

Shin sent out the usual VDMTools report (see overture-core list).

Overture
--------

Status for each of the Overture components at sourceforge:

traces and UML mapper (KennethLausdahl)

-   Core components

AST

Added Oml2VppVisitor both vpp and Java. (Other versions of the file will
be removed later from the SVN)

StdLib

-   Decompiled the UTIL class to remove all the wrong error markings
    Eclipse make in source files when it cannot resolve the class. (The
    rest of the class files will also be decompiled soon.)
-   Added VDMUtil both vpp and Java. (Java implementation is incomplete)
-   Added IO both vpp and Java. (Java implementation is incomplete)

Umltrans

-   Updated Vpp to Uml to report classes which cannot be transformed in
    the console
-   Added print of transformed classes and total execution time
-   Added unit test comparing both vpp files and xmi files from the
    transformation with expected files.

Tools (Maven build automation)

-   Vdmt (1.0.3)
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

-   No status reported

POTrans (Miguel)

Miguel has created a new subproject named Automatic Proof System (APS)
(svn:core/proofsupport) where he implemented the basic interaction for
the proof system as designed by Sander Vermolen.

-   Action 36/4: Miguel to coordinate a demo of proof support by FM09

VDMJ (Nick)

Nick created a command line client for the DBGp protocol. Nick started
the work on the VICE extension execution (previously it only did VICE
type checking).

Test Automation Support (Carlos)

Carlos will take over this subject. Kenneth and Peter will help to get
started both in terms of current work and future plans.

Overture Community Process

Note: Language Board = Executive Committee.

LB to be downsized to 5 members.

The LB accepted the first three proposals and they are:

-   International character support for Overture identifiers
-   The introduction of the "reverse" sequence operator
-   Generalising let-be expressions

The proposals will pass through a stage of deliberation and then
execution.

[Language Boards
Issues](http://sourceforge.net/tracker/?group_id=141350&atid=1127184)

Overture covering several VDM dialects instead of just OML?

Overture will undergo a series of changes to make it more linkable with
the VDM "brand". Dropping the OML name is one of the actions and
avoiding the reference to different dialects might help with citations.
Referring to it as VDM tools: Next Generation could also improve the
visibility of Overture.

Overture will support different VDM dialects. LB is to decide which
changes to the dialect will be supported but anybody is allowed to make
any their own experiments/changes.

Rodin Report - Kenneth & Miguel

See overture-core list.

Workshop

Program of the [7th Overture Workshop](7th Overture Workshop "wikilink")

Publication plans

In preparation:

-   Overture Introductory paper aimed at ACM SE Notes (Peter, Nick,
    Miguel, John, Kenneth, Marcel)
-   Paper path case study (Marcel & Jozef) end September 2009 for
    Journal of Systems and SOftware
-   New proof paper (Sander, Peter, Jozef)
-   Japanese Translation of VDM++ Book (Sako) – end September 2009
-   POs for Recursive Functions (Augusto, Peter)

In review:

-   CT (Kenneth, Peter, Nick) submitted to ICFEM 09

In press:

-   Industrial applications of FMs (Juan, John, Peter, Jim), accepted
    for I-Day at FM09.
-   UML mapper (Kenneth, HK, Peter) accepted by FM’09.
-   VICE Process paper (John, Peter, Sune Wolff) accepted by special
    issue of International Journal of Software and Informatics.
-   Felica (Mr Kurita) accepted by special issue of International
    Journal of Software and Informatics.
-   ACM Computing Surveys paper on industrial applications of FMs (Jim,
    Peter, Juan, John).
-   Jozef and Marcel: Formal Semantics of a VDM Extension for
    Distributed Embedded Systems; to appear in Festschrift for W P de
    Roever (LNCS).

Any Other Business
------------------

There will be a Pmaker meeting on the Sunday before FM'09. Everyone is
welcome, but please just let John know if you wish to attend.

Next Meeting
------------

October 11th 2009, 1300 CET

Note: next NM should address the problem of 13:00 CET = 20:00 JST.

   <div id="edit_page_div"></div>