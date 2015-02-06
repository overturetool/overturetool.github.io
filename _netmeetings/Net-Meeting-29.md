---
layout: default
title: Net Meeting 29
date: 05 November 2008, 1300 CET
---


# Net Meeting 29

|||
|---|---|
| Date | 05 November 2008, 1300 CET |
| Participants | Peter Gorm Larsen, JohnFitzgerald, Carlos Vilhena, Adriana Santos, Shin Sahara, Augusto Ribeiro, HKA Lintrup, Kenneth Lausdahl, Christian Thillemann and Nick Battle. |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   24/4 Find out about Rodin Tool plug-in standards. Passed to Cristian
-   27/1 MARCEL: plan CVS-\>SVN conversion - Expects to have this ready
    about 2 weeks before the workshop (8th and 9th of November 2008)
-   27/2: coordinate Tools Workshop with JNO

VDMTools
--------

-   Advertized VDMTools in one of the biggest electric company.

Overture
--------

Overture Parser Update

Nothing to report.

Status of Adriana's work on the Overture Test Automation Support

The current plan is to: Documenting the tool properly, and afterwards
extend it for the constructs that are not yet being considered The
future plan of my work is: Document how the tool can be used. There is a
GUI which must be explained so that someone else besides myself can use
it! The name of each trace should be changed for a path. In this way,
the test cases that are automatically generated are saved in the path
the user chose. Reduce the hand-made work that users must dedicate to
use tool. Enlarge the type of test cases that can be automatically
generated.

Status of Carlos' work on the Overture Connector between VDM++ and JML status:

Stabilise the tool, in order to be able to work on its extension. Fix a
number of bugs that need to be fixed before continuing the work. Carry
through some extentions one of the more likely candidates will be VDM
functions to JML abstract methods (and vice-versa) Add more information
to the documentation, concerning the decisions I made

Status of Augusto's work on the Overture Proof Obligation Generator

Proof obligations are now generated for polymorphic function but still
needs extensive testing. Next step resolving the problem with mutual
recursion between super-classes. The coverage test are up and running
and polymorphic functions will be tested Next step is to study should
study if the polymorphic functions can be transfered to HOL

New students (Kenneth and Hans Christian)

Looked into mapping the uml n-arry association to a instanca variable
like: att1 : B \* C \* D where B,C,D are other classes (but only to
enterprise architect). More information in the PDF-document email
received

Status on Christian's work

The eclipse plugin

The overall plan is to aim for a common interface for VDMTools and
Overture functionality on the eclipse platform.

Implemented features:

-   Outline
-   Syntax highlighting
-   Preferences

Road map(prioritized):

-   Builder (and shows error messages)
-   Update-Site (when done, an email will be sent to the mailing list)
-   Quick outline
-   Filter the outline
-   Corba to vdm
-   Auto completion
-   Toggle LaTeX?

The MONDEX case study

no progress since the last NM, but look for more steps forward after the
next Mondex day on 17 October. We are under a lot of pressure from
Deploy High Command to spend effort on that. The latest MONDEX surge
produced good improvement on the proofs, see table at:
<http://www.vdmportal.org/twiki/bin/view/Main/MondexCaseStudy> Unit
tests for the operations in the abstract world have been prepared but
the tests for the operations in the concrete world are yet to be
prepared. With the automated proof work, some progress has been made,
but are still unable to replicate Sander’s results.

The Pacemaker case study

My presentation given on 15 September in London is now on the vdmportal
Pacemaker page
<http://www.vdmportal.org/twiki/pub/Main/PacemakerCaseStudy/FitzgeraldPacemaker.pdf>
and going into the VSR repository. It addresses both the Z and VDM
models. There was a very positive response, notable from Tony Hoare who
was delighted to see a possibility of relating models in "alternative"
formalisms. From the point of view of co-simulation, I have been in
touch with some bio-computing people at Oxford who have managed to point
me to some heart models. We will start with a single cell model and then
advance to perhaps a systemic model but modern heart models are vast and
based on difference matrices like a sort of finite element analysis
approach. That area of co-simulation may be some way off. Who will do
this? I can now say that the international team working on this area
will include: us, Andrew Butterfield (Trinity College Dublin, Ireland),
Dominque Méry (LORIA, France) plus a new PhD student, Steve King at
York, of course Artur and Marcel in Brazil. I am planning a meeting of
as many as possible of this group in Newcastle, now probably in the New
Year. TrAmS?, one of the projects with which I am involved at Newcastle,
is buying a one of the reference platforms for implementations of
Pacemaker software.

The POSIX

No progress since last NM

Overture Workshop
-----------------

Unfortunately neither Adriana, Carlos, Shin and John can make it.

The temporary plan of the workshop

1.  Eclipse plug-in help for everyone mainly by Christian
2.  Plugin development of kernel functionality mainly by Marcel
3.  Test approach for each component jointly between Marcel and me for
    the testing the overall idea is that Maven will be used as the
    development platform. There is a free on-line book about this at
    <http://www.topazproject.org/trac/attachment/wiki/MavenInfo/BetterBuildsWithMaven.pdf?format=raw>

José Nuno suggested Braga, in Portugal. Web-site is up
[here](3rd Overture Workshop "wikilink").

Publication plans
-----------------

In preparation:

-   Paper path case study (Marcel)
-   ACM Computing Surveys paper on industrial applications of FMs
    (Peter, Juan, John)
-   Tools for Policy Design in Virtual Organisations: A Proof-of-Concept
    Study (John, Jeremy)
-   VICE Process paper (John, Peter, Sune Wolff) for Dines Bjoerner
-   Pos for Recursive Functions (Augusto, Peter)
-   VDM++ and JML (Carlos, Peter)
-   Felica (Mr Kurita and maybe Shin?)
-   Proof support (Sander, Jozef, Peter)

In review:

-   2nd edition of "Modelling Systems", Cambridge University Press (John
    & Peter) Now with CUP and being copy-edited
-   PhD thesis (Marcel)

In press:

-   Jozef and Marcel: Formal Semantics of a VDM Extension for
    Distributed Embedded Systems; to appear in Festschrift for W P de
    Roever (LNCS).
-   Jozef, A summary of the FM06 and IFM07 paper and enhanced the PVS
    models, to appear in Festschrift for W P de Roever (LNCS).

Recently Appeared (since last NM): None

Any other business
------------------

There is increased interest in VDM Tools at Newcastle, particularly from
the proof perspective. The name that we might hear more from is Alexei
Iliasov. Alexei, who recently completed his PhD, is now working in
TrAmS? on the definition of patterns for fault tolerance mechanisms. It
turns out to be not very easy to incorporate such patterns into Event B
(Alexei?s first formalism) and so we are looking at others, including
VDM++ and CSP||B. I see VDM++ as an interesting possibility here,
because the expression of genericity through o-o is something not
available in the other formalisms. We of course lose out in the
comparison because of the lack of proof support. I will arrange for
Alexei to talk with both Peter and me during his forthcoming visit to
Newcastle.

Next Meeting
------------

December 7th, 2008 - 13:00 CE
