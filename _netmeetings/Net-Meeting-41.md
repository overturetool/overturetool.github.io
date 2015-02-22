---
layout: default
title: Net Meeting 41
date: 6 February 2010, 1500 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 41

|||
|---|---|
| Date | 6 February 2010, 1500 CET |
| Participants | Peter Gorm Larsen, John Fitzgerald, Shin Sahara, Marcel Vaerhof, Nick Battle, Carlos Vilhena, Augusto Ribeiro, Kenneth Lausdahl and Ken Pierce. |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   38/2: still open. John said that they have begun such an update and
    they will upload relevant changes to the wiki SRA. Semantics are
    absolutely key and there is a need to work on proof support.
-   39/1: still open. This action is being carried forward.
-   40/1: closed, since it is a point on the agenda.
-   40/2: closed.
-   40/3: closed.
-   40/4: closed.
-   41/1: new. Prepare new materials on how VDM fits into industrial
    development practice. This is to be aimed at a lay "manager"
    readership. Contributors: MV, JSF, NB and PGL.
-   41/2: new. Peter to hand over convenership of LB to Nico. Nico to
    set clear QoS? expectations on the LB members and to doodle for
    several future LB meetings (arrange months in advance).
-   41/3: new. Marcel to explore facilities for managing and announcing
    releases provided by SF. He is to report back to overture-core.
-   41/4: new. Comments to PGL on the release plan\> Complete by 20
    February 2010.

VDMTools
--------

Shin sent out the usual VDMTools report (see overture-core list).

Overture
--------

Status for each of the Overture components at sourceforge

jmltrans

Carlos have been working in a standalone JML parser (based in the
OpenJML project) that is able to output an AST of the parsed JML files
so that he can connect it to the jmltrans tool. However, the jmltrans
tools needs to be revised because of the changes in the overture AST and
it needs to be a part of an Eclipse plugin (it was done before the
eclipse version of the Overture).

Furthermore, depending on the JML AST structure returned from their
parser, he might have to change the JML AST definition in VDM++ in order
to ease the conversion process. T

Overture IDE

Kenneth recommends that he and augusto take the IDE components and
refactor them or redo them when there is a decision about DLTK. It
should cover the IDE components ( a larger task which may take some
time)

Concerning vdmtools, Kenneths thinks we might be able to get Christian
(kedde) to look into this since he made it. Then give us a few new
features and a status of those components

Overture Language Board

Nico Plat could not be present in the netmeeting, but he has told Peter
that he is willing to enter in the LB as the convenor and replace him
there.

Release Plan

Peter made a draft of the release plan. A few members suggested to have
it in SourceForge as well, in order to update it easily.

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

In review:

-   DESTECS project introduction (Peter, Jan Broenink, Marcel, et al.)

In press:

-   Overture Introductory paper aimed at ACM SE Notes (Peter, Nick,
    Miguel, John, Kenneth, Marcel)
-   New proof paper (Sander, Peter, Jozef) accepted to SAC
-   Formal Semantics of a VDM Extension for Distributed Embedded Systems
    (Jozef and Marcel) in Festschrift for W P de Roever (LNCS 5930)

Recently Appeared:

-   None

EVERYONE please remember to update the publications list on
vdmportal.org

EVERYONE please remember to acknowledge DESTECS in any relevant
publications!

Any Other Business
------------------

Overture Documentation:

-   Three Overture tool introductions have been prepared for the 3
    dialects, each as a replacement Chapter 3. We'll get reviews of the
    draft chapters from colleagues.
-   A guide to Overture for potential adopters: Actions 40/3 and 40/4 -
    Peter and Nick to review older VDM marketing materials.

Next Meeting
------------

14 March 2010, 14:00 CET

   <div id="edit_page_div"></div>