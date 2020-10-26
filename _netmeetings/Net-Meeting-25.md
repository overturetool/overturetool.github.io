---
layout: default
title: Net Meeting 25
date: 20 April 2008, 1300 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 25

|||
|---|---|
| Date | 20 April 2008, 1300 CET |
| Participants | Peter Gorm Larsen, JohnFitzgerald, Carlos Vilhena, Adriana Santos, Hugo Macedo, Shin Sahara, MarcelVerhoef, Augusto Ribeiro, SanderVermolen and Miguel Ferreira |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   13/2 Closed.
-   23/1 Closed
-   24/1 Organise SRA meeting at Turku (Tuesday). Keep open, not
    finalised yet.
-   24/2 Discuss Pacemaker future challenge with McMaster? at FM. John
    asked Tom Maibaum and Alan Wassyng if they are available. Alan is
    not attending FM, but has indicated that a North American Consortium
    has been set up to fix the rules for the challenge. Providing domain
    expertise support is a priority.
-   24/3 Closed
-   24/4 Find out about Rodin Tool plug-in standards
-   24/5 Closed
-   25/1 Open. Produce plan with Jeremy for final stages of Mondex

VDMTools
--------

Status and development plans for VDMTools version 8.xx
:   Version 8.1 is now available.

Overture
--------

Overture Parser Update
:   Marcel plans to release ASTGEN and the new parser ASAP. The
    interface to the AST classes have not changed, so it should work
    with the existing tools, like Sanders.

<!-- -->

Status of Adriana's work on the Overture Test Automation Support
:   Adriana specified the Combinatorial Testing Strategy. She is able to
    generate test cases based on Regular Expressions The filtering
    process is also specified, but at the moment the operation which
    tells if a test case had failed or not is fictitious... all test
    cases fail. Adriana will have to connect my specification with the
    VDMTools interpreter. The VDMTools interpreter will be used to run
    each test case and let know if the test case failed or not. If
    someone wants a more detailed description about something, please
    let her know.

<!-- -->

Status of Carlos' work on the Overture Connector between VDM++ and JML
:   Carlos started recently the implementation of the connection between
    VDM++ and JML. Concurrently, he continued writing the theoretical
    differences between the two referred languages and the requirement
    specification of this connection. He is also exploring another
    possibility of using the current JML parser to extract the forest of
    Abstract Syntax Trees form JML input files. For this purpose, he
    will try to use the new JML tools set (JML4), which is an
    Eclipse-based tool set of JML. Together with the JML community, he
    will try to overrun this problem/challenge. However, this will need
    further research about the limitations of the new tool set that they
    are developing.

<!-- -->

Status of Augusto's work on the Overture Proof Obligation Generator
:   Augusto is currently specifying the POG for the Termination Proofs.
    Method for discharge of this PO are also being studied, especially
    nested recursion.

<!-- -->

Possible new students to take new Overture tasks
:   Peter will I try to contact José for potential new students who
    might be interested. Two new Danish MSc thesis students will work on
    Overture UML mapping after summer. New UK MSc student working from
    now to end August.

<!-- -->

The MONDEX case study
:   They started this work by concentrating on illustrative proofs of
    correct refinement. There has been slow progress because it all has
    to be done by hand. One can see the state of the proof checking on
    the Wiki page. They still plan to generate a TR including the
    proofs. However, they have decided to make a main focus the
    illustration of test-based validation technology using VDMTools (so
    far the main distinctive selling point of VDM). To that end, Ken has
    been involved in setting up a testing framework which is now
    installed in a local SVN repository (along with the emerging TR).
:   John thinks they can get there in the end but, because this has not
    been a concentrated effort (because of lack of willingness to commit
    concentrated resources) it will not tell an encouraging story about
    VDM. Their lack of proof tools is still a major weakness compared to
    other formalisms. However, their testing support is impressive. The
    work has had a beneficial effect in spreading experience in VDM,
    VDMTools and proof among a wider group here in Newcastle.

<!-- -->

The Pacemaker case study
:   Hugo has so far made the one serious attempt at this study. The
    models were a good start, but they were mainly developed in order to
    illustrate a development methodology rather than to make a
    significant attack on the pacemaker study. Zoe has been looking in
    detail at some of the models (and indeed is now attempting them in
    Event-B) and feels that major revisions would be required if they
    were attempting a serious attack on the study. John's main concern
    is that there is no definite specification of what the challenge
    problem is and, further, how anyone can attempt it without access to
    domain expertise. For the moment, this remains an example used to
    illustrate other things. John sees no prospect of that changing
    unless more people than himself and Zoe commit time and resources,
    and they get some domain expertise.

Meeting with McMaster? people on FM'08

-   Proposed*' ACTION: 24/2.*'

The POSIX
:   John will update to the BTrees model that has been adopted into the
    study by Jim Woodcock, based on some old VDM work. José Nuno has a
    small team working in this area and they are also in contact with
    Sander. Miguel and Samuel are working on a Intel specification of
    the Flash File System Core.

Publication plans
-----------------

In preparation:

-   "Connecting Between VDM++ and JML", Carlos M. G. Vilhena. To appear
    as a Newcastle University (UK) Technical Report at the Fourth
    VDM-Overture Workshop at Formal Methods 08, Turku, Finland, May 2008
-   “Overture: Combinatorial Test Automation Support for VDM++”, Adriana
    S. Santos. To appear as a Newcastle University (UK) Technical Report
    at the Fourth VDM-Overture Workshop at Formal Methods 08, Turku,
    Finland, May 2008.
-   Tools for Policy Design in Virtual Organisations: A Proof-of-Concept
    Study (Jeremy & John to submit to ICFEM'08)
-   Paper path case study (Marcel)
-   ACM Computing Surveys paper on industrial applications of FMs
    (Peter, Juan, John)
-   2nd edition of "Modelling Systems", Cambridge University Press (John
    & Peter) by Feb 2008
-   VDM++ book (Shin)

In review:

-   PhD? thesis (Marcel)

In press:

-   FeliCa? paper (Araki, Peter and FeliCa?), to appear at IDay at FM'08
-   Hugo, Peter, John, Incremental Development of a Distributed
    Real-Time Model of A Cardiac Pacing System using VDM, to appear in
    Proc. FM 2008
-   John, Peter, Marcel, Vienna Development Method, in B. Wah (ed.),
    Wiley Encyclopedia of Computer Science and Engineering.
-   John et al, Animation-based Validation of a Formal Model of Dynamic
    Virtual Organisations, to appear in P. Boca and J. P. Bowen (eds.)
    Proc. BCS-FACS Workshop on Formal Methods in Industry.
-   Peter and John. Recent industrial Applications of VDM in Japan, to
    appear in P. Boca and J. P. Bowen (eds.) Proc. BCS-FACS Workshop on
    Formal Methods in Industry.
-   Formal Semantics of a VDM Extension for Distributed Embedded
    Systems; (Jozef and Marcel) to appear in Festschrift for W P de
    Roever (LNCS).
-   Jozef, A summary of the FM06 and IFM07 paper and enhanced the PVS
    models, to appear in Festschrift for W P de Roever (LNCS).
-   Paper about proof work (Sander), Overture/VDM++ Workshop at FM08

Recently Appeared:

-   Peter Gorm Larsen, John Fitzgerald and Shin Sahara, VDMTools:
    advances in support for formal modeling in VDM, ACM SIGPLAN Notices
    43(2), February 2008, pp3-11.
-   John Fitzgerald and Cliff B. Jones, The Connection between Two Ways
    of Reasoning about Partial Functions, Information Processing
    Letters, Accepted Manuscript, Available online 29 February 2008,
-   P. G. Larsen, J. S. Fitzgerald and S. Riddle. Practice-oriented
    courses in formal methods using VDM++. Formal Aspects of Computing,
    Springer-Verlag, February 2008 (currently available in online-first)
    DOI 10.1007/s00165-008-0068-5

Strategic Research Agenda and Wikipedia
---------------------------------------

Peter has worked on Wikipedia entry and it had considerably improved.
Feedback from potential readers would be important.

Any other business
------------------

Nothing to report.

Next Meeting
------------

8 June 2008, 1300 CET

   <div id="edit_page_div"></div>