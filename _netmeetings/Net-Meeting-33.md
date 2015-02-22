---
layout: default
title: Net Meeting 33
date: 8 March 2009, 1400 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 33

|||
|---|---|
| Date | 8 March 2009, 1400 CET |
| Participants | Peter Gorm Larsen, John Fitzgerald, Shin Sahara, Nick Battle, Miguel Ferreira, Christian Thillemann. |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   24/4 Find out about Rodin Tool plug-in standard - Assigned to
    Christian Thillerman. - Ongoing
-   33/1: All: Comment on proposed logo - New
-   33/2: All: Comment on proposed sty file - New
-   33/3: Kenneth: Update Overture wiki and set up "updatesite" for the
    tools - New
-   33/4: Peter: announce/invite volunteers for LB membership - New

John's comments on the actions:

-   31/1 Closed. Was completed when we distributed the first version a
    couple of weeks ago.
-   31/2 Closed. We received one group of initial views (from Nick). The
    proposed process has been simplified and, in accordance with
    discussions at the last NM, is focussed on managing updates to the
    OML Language Definition document. Further discussion in response to
    Action 32/1.
-   31/3 Closed. Since the main constraints were Marcel’s, mine and
    Peter’s diaries, we prefer to propose 7-8 May to everyone. More
    details under Agendum 3.3.
-   32/1 Closed. We received one set of comments on the proposal (from
    Nick). The proposal was updated in response to these and was
    circulated to overturetool-core for discussion. Further discussion
    under Agendum 3.2.

Peter's comments on the actions:

-   32/2 I have done but so far only feedback from Nico.

VDMTools
--------

Shin sent out the usual VDMTools report (see overture-core list), to
which he added: In some cases the VDMTools Interpreter is faster than
its Java counterpart in VDMJ.

Peter' comments on Shin's status report:

Although progress has been made regarding bug fixes, the web pages seem
to be outdated. Best should be to keep these synchronized; Request CSK
for permission to update the wiki for the bug status, so that Peter can
include the text about the bugs reported.

Overture
--------

Status for each of the Overture components at sourceforge

ast (Marcel)

Marcel announced that significant progress has been made on the SVN
repository, thanks to the help of Nick and Kenneth now most components
are in compilable state under maven and Eclipse build support. The next
steps will be on are deployment towards an updatesite and the inclusion
of the components build by Christian and David. Marcel will also create
an issue tracker for the code base in SVN, a new milling list dedicated
to development matters, and streamline the release process.

potrans (Miguel)

Miguel's status on the PO translation is that it is now starting to move
on again, starting with the connection to the VDMTools, through CORBA
interface, to generate proof obligations. Peter proposed that Miguel
should include a connection to VDMJ as well.

testgen (Peter)

The first version of the Overture Combinatorial Testing tool has now
been released. We very much look forward to have feedback from as many
as possible of you on the user manual and the associated tool.

eclipse (Christian and David)

Christian reports that work is being done on the debugging protocol
(dbgp). They have a version of the Eclipse Plug-In, where it is possible
to use the VDMJ interpreter in a console with the files in the project.
At the moment Nick is also working on the VDMJ end of the eclipse
plugin, and he is making some changes to it that will enable to see the
values when debugging models. These changes will be included in the next
version of the plugin.

vdmj (Nick)

The source of VDMJ is now in SVN, thanks to Marcel and Peter.

Nick reported:

-   Progress in VDMJ's handling of combinatorial testing to the point
    where it correctly expands and executes traces. As this is using the
    full power of VDMJ's parser, it can deal with arbitrarily complex
    trace bindings. It also (now) does error filtering, though this is
    not yet checked into SVN. It's fairly fast.
-   Added native support for the CSK MATH library, for both VDM-SL and
    VDM++.
-   Changed it to parse the VICE language extensions (including via the
    Overture parser), and have added most of the type checking
    associated with them.
-   Made several corrections to handle Shin's "SSlib" - a complex VDM++
    library. Improvements include support for extra Japanese "letter"
    characters that can appear in lexical names, and sensible support
    for curried functions with pre/post conditions. Several bugs were
    fixed too. The SSlib unit tests now execute successfully.
-   Added four command line options to disable runtime pre/post
    condition checking, type invariants and dynamic type checking.
    Depending on the specification, this can produce up to a 20% runtime
    improvement.

Overture Community Process
--------------------------

Note: Language Board = Executive Committee.

John's opening remark: An OCP has been proposed but there needs to be
some form of agreement to implement it. If it is agreed to proceed with
it, the LB needs to be elected and its first job is to ensure the
generation of the first set of documents that it will be responsible for
protecting, i.e. the OML definition V1.

Peter's comment on the process draft V1.1: it looks like a great
process.

John expressed his concerns about the scrutiny to which the proposed OCP
has been submitted to, and proposes that we either arrange some sort of
vote to adopt it, or establish a date after which the OCP is considered
adopted if there are no comments by then. He also added that the draft
suggests an official LB of no more than 5 persons because that seems to
be as much as our community can sustain at the moment. However, he
suspect that the LB will not want to be particularly secretive in
general and so almost everyone will be involved in some capacity.

As there were no more comments to the draft, next followed the
suggestion of names for the Executive Committee:

-   Miguel: Peter, John, Shin and Nick;
-   Peter: Marcel, Nick, Shin, John and Peter;

During the suggestions for the EC John presented his which of not
participating in the committee, due to the lack of resources to handle
all the underlying duties. Nick expressed that the EC should be an
authoritative organ within the OCP, and Peter added that it should be
both authoritative and administrative.

Nick also recovered the idea of having a user in the EC, that is
detached from the development activities. Shin and John agree that this
would be a great opportunity to bring someone else on board, and Shin
proposed Mr. Kurita and Mr. Sakoh, as suitable to have a position in the
EC. There was a greater consensus around Mr Sakoh, due to his great
skill in languages and their semantics. Shin committed to contact Mr.
Sakoh about this matter.

Also the connection to CSK and VDMTools was address as of great
importance to the OCP and Overture in general.

Workshop

John's update on the Newcastle Workshop plans: Newcastle University has
kindly agreed to fund a shor “Visiting Fellowship” to allow Marcel to
work with us on tools and on co-simulation, especially with reference to
the Pacemaker study. I thus envisage two workshops: The first workshop
is essentially derived from the Braga event and will focus on the
current state of Overture, with particular emphasis on plug-in
development and support. Participation will be open to anyone, and I
have had expressions of interest from RODIN/DEPLOY people. This is
currently proposed for 7-8 May. The second workshop will relate to
co-simulation and the Pacemaker challenge. My intention is to hold this
later in the year, with participation from non-VDMers investigating the
pacemaker. The proposed dates for the first workshop are provisional but
I’m hoping that we will be able to get suitable facilities. I expect to
confirm the dates this week, when Claire is back from vacation. I’ll
take an action on this. Comments welcome.

John is also going to be responsible for the programme for the first
event.

Profile of VDM++ on the web and the Overture web page in general

Marcel has now access to the file system of www.overturetool.org and
Kenneth will start making changes soon to the appearance of the
web-site. He has lso removed the old updatesite and XML-schema stuff.

Publication plans
-----------------

In preparation:

-   Paper path case study (Marcel)
-   ACM Computing Surveys paper on industrial applications of FMs (Jim,
    Peter, Juan, John): very last stages of preparation now. Well
    received.
-   Pos for Recursive Functions (Augusto, Peter)
-   VDM++ and JML (Carlos, Peter)
-   New proof paper (Sander, Peter, Augusto, Jozef)
-   UML mapper (Kenneth, HK, Peter)
-   CT (Kenneth, Peter)

In review:

-   2nd edition of "Modelling Systems", Cambridge University Press (John
    & Peter) Now in the final corrections phase prior to production.
-   VICE Process paper (John, Peter, Sune Wolff) submitted to
-   Felica (Mr Kurita and maybe Shin?) – same journal special issue as
    the VICE paper.

In press:

-   Tools for Policy Design in Virtual Organizations: A Proof-of-Concept
    Study (John, Jeremy) Accepted for the KSCO workshop.
-   Jozef and Marcel: Formal Semantics of a VDM Extension for
    Distributed Embedded Systems; to appear in Festschrift for W P de
    Roever (LNCS).
-   Jozef, A summary of the FM06 and IFM07 paper and enhanced the PVS
    models, to appear in Festschrift for W P de Roever (LNCS).

Recently appeared (since last NM): None

Any Other Business
------------------

John: At Newcastle we had a visit two weeks ago from AIST in Japan:
Makoto Takeyama, Yoshiki Kinoshita and Yutaka Matsuno. Dr Takeyama, I
think, speaks regularly to Shin. They came to talk about dependability
rather than formal methods, but we still had some good discussions on
this topic and they saw something of our work on VDM models of dynamic
coalitions.

Next Meeting
------------

April 19th 2009, 1300 CET Note: next NM should address the problem of
13:00 CET = 20:00 JST.

   <div id="edit_page_div"></div>