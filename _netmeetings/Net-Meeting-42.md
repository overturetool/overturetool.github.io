---
layout: default
title: Net Meeting 42
date: 14 March 2010, 1400 CET
---


# Net Meeting 42

|||
|---|---|
| Date | 14 March 2010, 1400 CET |
| Participants | Peter Gorm Larsen, Shin Sahara, Marcel Verhof, Nick Battle, Nico Plat, Sako Hiroshi, Kenneth Lausdahl and Ken Pierce. |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   38/2: still open. Marcel any progress here? no, not at the moment,
    john & I are too busy at the moment. will talk to JSF about it at
    the upcoming DESTECS meeting end of this month
-   39/1: still open. Related to new ASTGen. This action is being
    carried forward.
-   41/1: open and responsible person changed to Peter Gorm Larsen.
-   41/2: closed.
-   41/4: closed. Since no feedback.
-   42/1: New. Action on everyone (see LB status)

VDMTools
--------

Shin sent out the usual VDMTools report (see overture-core list). Small
discussion about an famous Japan user which have expressed that they
recognize VDM as useful for expressing domain knowledge by using
invariant and pre/post-condition.

Overture
--------

VDMJ

Nick has started a new branch with a new scheduler implementation with
good progress.

ASTGen

Marcel have been working on a new version of the ASTGen he hope he will
be able to release it very soon for testing.

Overture IDE

-   Refactoring of the entire IDE has started. Here the DLTK framwork
    will be removed and the debug interface redeveloped based on the
    same protocol.
-   Overture IDE has been prepared for release as version 0.2.
-   Examples available for the Overture IDE 0.2 has been update by Peter
    Gorm Larsen, he reports that there now exist almost 100 examples.
    Kenneth Lausdahl reports that a new test tool for examples has been
    made which can check out the examples execute test with a generated
    web page for inspecting the results of testing. (Marcel recommends
    this tool to be made available at the website)

Overture Language Board

Nico Plat: Well we had our 2010 kick-off NM meeting last weekend; quite
productive. Nick will send around the minutes of the LB meeting.

An issue has been moved the the OCP discussion phase, so now it's time
for yu guys to form an opinion on it. One important thing though that
John also e-mailed about is the point of OML language definition
documents. One of the things that we concluded is that we don't really
have a good overview of are the documents and artifacts that actually
contribute to the definition (semantically and otherwise) of the OML, so
we want to inventarise this. Then we can decide what is still missing
and make up road map (word of the year to get these missing parts. When
we are there we will have a much better mechanism for judging the effect
of language issues on the OML. So I would like you all to take 10
minutes later today and make up a list of language deocuments (and other
language artefacts) and send that either to me directly or to
overture\_lb (AT) overturetool.org.

Release status of Overture IDE 0.2

Shin has been testing the IDE with Japan models written in Shift-JIS and
discovered strange conversions between Shift-JIS and UTF-8. He will mail
example model to Kenneth Lausdahl.

Marcel raised a question about what should be included of external
plug-ins in the release (SVN/CVS) which lead to a longer discussion
about how to decide which plug-ins goes into the release.

The discussion will continue offline but Nico raised the concern that we
should see if we could improve the procedure which is used to specify
what goes into the release.

Publication plans
-----------------

Planned (note the lead author and approximate date):

-   DESTECS paper on static correctness conditions for co-simulation
    (John, June 2010)
-   DESTECS paper on co-simulation incl. tool support (Peter, end 2010,
    aiming for FM’11)
-   DESTECS paper on case studies (Marcel, aiming for an I-Day in 2010
    or 2011)
-   DESTECS paper on fault modelling in VDM and in co-sim framework
    (John, 2011)
-   Paper on the jmltrans tool (Peter and Carlos)
-   Co-simulation examples (John and Ken)
-   Pacemaker Challenge state of the art (John et al.)

In preparation:

-   Paper path case study (Marcel & Jozef, target end February 2010) for
    Journal of Systems and Software
-   Japanese Translation of VDM++ Book (Sako) Target end March
-   POs for Recursive Functions (Augusto, Peter)
-   CT (Kenneth, Peter, Nick)

In review: In press:

-   DESTECS project introduction (Peter, Jan Broenink, Marcel, et al.)
-   Overture Introductory paper aimed at ACM SE Notes (Peter, Nick,
    Miguel, John, Kenneth, Marcel)
-   New proof paper (Sander, Peter, Jozef) accepted to SAC
-   Formal Semantics of a VDM Extension for Distributed Embedded Systems
    (Jozef and Marcel) in Festschrift for W P de Roever (LNCS 5930)

Recently Appeared:

-   None

Next Meeting
------------

18 Apr 2010, 13:00 CET
