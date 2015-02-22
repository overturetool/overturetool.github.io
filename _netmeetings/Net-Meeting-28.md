---
layout: default
title: Net Meeting 28
date: 07 September 2008, 1300 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 28

|||
|---|---|
| Date | 07 September 2008, 1300 CET |
| Participants | Peter Gorm Larsen, JohnFitzgerald, Carlos Vilhena, Adriana Santos, Shin Sahara, MarcelVerhoef, Augusto Ribeiro, Kenneth Lausdahl, Miguel Ferreira, Christian Thillermann and Nick Battle. |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   24/4 Find out about Rodin Tool plug-in standards.
-   27/1 MARCEL: plan CVS-\>SVN conversion
-   27/2 Closed.

VDMTools
--------

Status of the VDMTools

-   No info this time

Status of the VDMTools project

The brother company CSK Systems Nishi-Nihon(West-Japan) got the research
project with AIST(http://www.aist.go.jp/index\_en.html). Agda and VDM is
the main specification language of this project. have to make a
converter from unified specifications (which have to be a writable
language from the industrial engineer's view) to Agda and VDM. And, we
have to return the verified results to the unified specification side.

Sales of VDMTools

We've got many trial users, but there is no real new user to date

Education

-   Masami Hagiya who is a professor at Department of Computer Science,
    Graduate School of Information Science and Technology, University of
    Tokyo. <http://hagi.is.s.u-tokyo.ac.jp/members/> hagiya.html)
    started to teach VDM as a part of formal specification language.
-   Tao Bears LLC. thinks to make a VDM seminar course.

Overture
--------

Overture Parser Update

Nothing to report.

Status of Adriana's work on the Overture Test Automation Support

The future plan of my work is: - Document how the tool can be used.
There is a GUI which must be explained so that someone else besides
myself can use it! - The name of each trace should be changed for a
path. In this way, the test cases that are automatically generated are
saved in the path the user chose. - Reduce the hand-made work that users
must dedicate to use tool. - Enlarge the type of test cases that can be
automatically generated.

Status of Carlos' work on the Overture Connector between VDM++ and JML

In the future, I intend to stabilise the tool, in order to be able to
work on its extension. Now, there are a number of bugs that need to be
fixed before continuing the work. After making it robust, I intend to
start extending it in order to be able to map VDM++ functions to JML in
first place, and then in the other way around. In a long run, I intend
to allow as many constructs as possible.

Status of Augusto's work on the Overture Proof Obligation Generator

Proof obligations are now generated for polymorphic function but still
needs extensive testing. Next step resolving the problem with mutual
recursion between super-classes.

New students (Kenneth and Hans Christian)

Kenneth and Hans Christian are currently studying the infrastructure
specification for UML 2.1 to determine the meta-structure of the UML
language, which will enable them to find any new stuff to include in the
VDM \<-\> UML mapper (besides the constructs described in the Rose-VDM
link documentation). They have identified conflicts between VDM and UML
(e.g. namespaces and template classes), which they will analyse and come
up with a solution to.

The MONDEX case study

The latest MONDEX surge produced good improvement on the proofs, see
table at: <http://www.vdmportal.org/twiki/bin/view/Main/MondexCaseStudy>
Unit tests for the operations in the abstract world have been prepared
but the tests for the operations in the concrete world are yet to be
prepared. With the automated proof work, some progress has been made,
but are still unable to replicate Sander’s results.

The Pacemaker case study

John has made only limited progress on the VDM models but have got time
to do so. He have a telco next week with some computer scientists at
Oxford working on models of the heart, so an interesting possibility is
co-simulation here. He will give a talk on the state of the pacemaker on
15 September in London. The aim is to engage the interest of other
groups as well.

The POSIX

What Miguel was able to do since last time for the case study, was to
model and test two new operations FS\_WriteFile and FS\_SetFileOffset in
VDM++. He is currently updating the Alloy models with the two new
operations, but some challenges are making-me have to experiment allot,
because he want to keep the abstraction level high enough, so that he do
not have to use Alloy sequences. Whenever this is done, he'll be able to
model check the operations, and re-adjust the models if necessary. The
next step will be to adapt the VDM++ model for the Automatic Proof
Support system, so that it can generate the HOL model.

Overture - Eclipse Integration Status
-------------------------------------

Christian has just started implenting the overture parser into an
eclipse plugin. He hopes to have the first release of the plugin ready
soon. The overall plan is to aim for a common interface for VDMTools and
Overture functionality on the eclipse platform.

Overture Workshop
-----------------

José Nuno suggested Braga, in Portugal. Web-site is up
[here](5th Overture Workshop "wikilink").

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

Next Meeting
------------

October 5th, 2008 - 13:00 CE

   <div id="edit_page_div"></div>