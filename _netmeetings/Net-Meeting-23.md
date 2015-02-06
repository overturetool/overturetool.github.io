---
layout: default
title: Net Meeting 23
date: 20 January 2008, 1300 CET
---


# Net Meeting 23

|||
|---|---|
| Date | 20 January 2008, 1300 CET |
| Participants | Peter Gorm Larsen, JohnFitzgerald, Carlos Vilhena, Adriana Santos, Hugo Macedo, Shin Sahara, MarcelVerhoef, Augusto Ribeiro and SanderVermolen |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   13/2 Ongoing.
-   15/2 Closed. Thomas has updated the Overture site with his work now.
-   16/1 Closed.
-   20/1 Ongoing.
-   20/2 Closed.
-   20/3 Ongoing.
-   20/4 Closed.
-   20/5 Ongoing.
-   23/1 New: Peter Gorm Larsen to ensure that Posix progress is on NM
    agenda.

VDMTools
--------

Status and development plans for VDMTools version 8.xx
:   Released version 8.0.1b-080115. Struggling with automotive companies
    for:
    -   How to write requirement specification (not only by using VDM,
        especially for plant models);
    -   How to write detailed design specification (by VDM).

:   Development plans: High priority:
    -   Test case generator from proof obligation (model based test);
    -   Eclipse-nize of VDMTools;
    -   XMI interface;
    -   Using AST by user.

:   Priority under consideration:
    -   VICE improvement;
    -   VDM with SAT/SMT solver.

:   Low priority:
    -   "Japanizing" error messages;
    -   Alternative tool of CORBA interface.

<!-- -->

Bug reporting for VDMTools bugs
:   There are no English reported bugs.

Overture
--------

Status of Thomas' work on the Overture type checker
:   It has now been uploaded but it is only for a subset of VDM++ and it
    has not yet been code generated.

<!-- -->

Status of Hugo's work on the Overture interpreter
:   With the high priority of the VDMTools development to the eclipse
    platform there will be an opportunity to improve Hugo's work.

<!-- -->

Status of Sander's work on the Overture proof support
:   Improving the proof support.

<!-- -->

The MONDEX case study
:   Nothing to report.

<!-- -->

The Pacemaker case study
:   Nothing to report.

<!-- -->

Introduction to new Overture subjects (Adriana, Carlos and Augusto)
:   Concerning Carlos's thesis, he is writing about the possible
    limitations of a connection between VDM++ and JML, and comparing the
    semantics of both languages. Right now, he is starting the practical
    side of his work together with his writing, that will start with
    some important decisions evolving the JML parser.

<!-- -->

:   Adriana is working on test automation support. She has been working
    with Tobias, which is a combinatorial testing tool. She made 2
    examples in order to use it: the Triangle Problem and the Towers of
    Hanoi. She also made the test coverage using the vdmtools. At the
    moment, test sequencing seems to be one good choice to implement in
    the Overture. The VDMTesK? tool is in stand-by. We are waiting to
    hear some news from the developers. They will try to find out why
    the tool isn't working properly. She has been also reading about
    mutation testing and will probably have access to another tool which
    applies this strategy. Besides all this, she is also writing her
    thesis.

<!-- -->

:   Augusto's thesis started this week and the subject is proof
    obligation generation for Overture. His work will focus on trying to
    extend the current POG to generate obligations for recursive
    functions.

Publication plans
-----------------

In preparation:

-   Paper path case study (Marcel)
-   ACM Computing Surveys paper on industrial applications of FMs
    (Peter, Juan, John)
-   FeliCa? paper (Araki, Peter and FeliCa?)
-   2nd edition of "Modelling Systems", Cambridge University Press (John
    & Peter) by Feb 2008
-   VDM++ book (Shin)

In review:

-   Wiley Encyclopedia of Computer Science & Engineering entry on "VDM"
    (John, Peter, Marcel) - revised following review comments.
-   "The Connection between Two Ways of Reasoning about Partial
    Functions" (John and Cliff), submitted to Information Processing
    Letters
-   PhD? thesis (Marcel)
-   Pacemaker modelling & validation FM08 (Hugo, Peter, John)
-   Paper about proof work FM08 (Sander)

In press:

-   "Learning by Doing" (John, Peter, Steve Riddle), accepted by FACJ
    special issue on education
-   VDM in Japan (Peter, John), BCS FACS workshop
-   Dynamic Coalitions (John, Jeremy et al.) BCS FACS workshop

Recently Appeared:

-   Traces Paper (John, Peter, Simon, Marcel), accepted by HASE07
-   New Wikipedia entry on "VDM", replacing current separate entries on
    VDM and VDM-SL. (John)
-   Formal models of access control in XACML (Jeremy,John) at ICFEM 2007

Strategic Research Agenda and Wikipedia
---------------------------------------

Peter updated <http://www.vdmportal.org/twiki/bin/view/Main/SRA> and
feedback is welcome.

Wikipedia VDM section has been updated but still need improvements.

Any other business
------------------

Note that FM'09 will be in Eindhoven.

John advertise all about ICTAC (http://www.ictac.net/ictac08).
Submissions by 11 April and there will be a special track on tools. The
chairs will be John and Anne Haxthausen and they have completely
revamped he programme committee so the conference will be more applied.

Sander said that a PhD? student at Delft University is working on
generating language plugins for Eclipse based in their grammars
(specifically dsls) to support highlighting, syntax checking code
folding, etc.

Next Meeting
------------

2 March 2008, 1300 CET
