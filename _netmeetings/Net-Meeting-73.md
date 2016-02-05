---
layout: default
title: Net Meeting 73
date: 29 September 2013, 13:00 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 73

|||
|---|---|
| Date | Sunday the 29th of September at 13:00 CET |
| Participants | PGL (chair), NB, KP, NP, JWC; Minutes by NB. |

Review Status of the Action List
--------------------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   No progress on current actions
-   New action taken for PGL to discuss Development Board plans with
    Augusto.

Overture Language Board Status
------------------------------

It was noted that the LB minutes incorrectly state that there are no
open RMs, when there is one remaining in Discussion (RM\#19). NB has
made some progress with the VDMJ implementation of RMs \#18 and \#20.
PGL and KP volunteered to look at some of the issues arising from the
implementation, while MV is very busy.

Status of VDMTools Development
------------------------------

From SS's email, there has been no change in VDMTools. It was noted that
Mr. Tomohiro Oda created a project for VDMPad on SourceForge.

Status of the Overture Components
---------------------------------

VDMJ

The following changes were made to the 1.x.x series branch. I think most
of these have been ported to the 2.x.x branch for release now:

`2013-09-13 Correction to traces running in VDM-RT`\
`2013-09-05 Clean up threads properly with exit statements`\
`2013-08-14 Correction to implicit function satisfiability POs`\
`2013-08-14 Correction to allow self to be used in thread sections `\
`2013-08-12 Efficiency improvement for traces that create objects`\
`2013-08-09 Small correction to empty sequence subtype testing`\
`2013-08-09 Fix for polymorphic parameter type comparisons`\
`2013-08-09 Fix to identify duplicate trace definitions in SL`\
`2013-08-04 Correction to pattern matching in set binds`\
`2013-08-01 Improvement to state designator error messages`\
`2013-08-01 Fix for breakpoint on exit statements with no argument`\
`2013-07-31 Type resolution correction for value definitions`\
`2013-07-26 Correction for old~ names in postcondition apply expressions`\
`2013-07-03 Correction to subtype POs for implicit functions`\
`2013-07-01 Improve ParameterPatternObligation and add missing param pattern checks`

Development Board Status
------------------------

No update here. PGL will discuss plans with Augusto.

Release Planning
----------------

Overture 2.0.0

Code-wise, the release is ready to go. What remains is all of the
'bookkeeping' effort of ensuring that everything is bundled correctly,
and so on. JWC's time in September was occupied by teaching and COMPASS
deliverables, so the release still needs to be done. With a little bit
of luck, it will happen next week. Version 2.0.0beta6 (on SourceForge)
is the version we will release as 2.0.0. This version is Java 6
compatible.

At some point in October we expect to release a v2.0.2 (odd final
numbers → development, even final numbers → release), that includes some
cleanups small fixes.

Remaining work includes:

-   Standalone documentation updates (possible; this may be complete)
-   Internal documentation updates (help pages, about boxes, welcome
    screens, etc)
-   Sorting out OS X signing keys

Overture 1.2.x

Version 1.2.5 is now up on SourceForge. As noted in an email to
overturetool-core, JWC hopes that this is the last release in the 1.2.x
series. The build structure of 1.2.x is far behind that of the 2.x
series, and consequently is harder to produce a new version in it.

AstCreator split out

AstCreator has been split out of the main Overture repository and is now
hosted in a repository on GitHub, and there is a corresponding maven
repository there to access the libraries. This allows us a bit more
flexibility in the build, and means we do not need to keep Overture 100%
in lockstep with changes made to AstCreator. It's also giving us a nice
test of how suitable GitHub is. We will be publishing AstCreator
releases to the main Sonatype maven repository, so that no special
configuration would be required for anyone to use AstCreator in their
own projects.

Buildserver

We have a new buildserver at AU for the Overture (and derivate
projects). It's still in the process of being configured; it probably
needs 1–2 days of effort to move everything over. The switchover should
be invisible to most people, however.

Strategic Research Agenda
-------------------------

The Strategic [Research](Research "wikilink") Agenda is reviewed every
other NetMeeting.

Community Maintenance Reporting
-------------------------------

There were considered too few people at the NM to discuss this,
especially without JF and MV. PGL will start a thread discussion by
email to seek contributions from the group as to the way forward.

Publications Status and Plans
-----------------------------

See [Planned Publications](Planned Publications "wikilink"). This has
been updated by PGL, but no other changes were identified at the
meeting.

Any Other Business
------------------

PGL's new Overture video was discussed briefly and was appreciated by
all. Some suggestions were made for using full-screen display in places,
and the possibility of showing the UML conversion tool was discussed.
There was a brief discussion about whether it is better to show
"incomplete" features and admit their shortcomings, or just to not
mention what the tool cannot yet do.

We noted that no progress has been made on plans for the next Overture
workshop. There was not enough support for a workshop in Singapore at
FM2014. We need to make sure this is not forgotten about.

Next Meeting
------------

   <div id="edit_page_div"></div>
