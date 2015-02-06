---
layout: default
title: Net Meeting 70
date: 28th April 2013, 1300 CET
---


# Net Meeting 70

|||
|---|---|
| Date | 28th April 2013, 1300 CET |
| Participants | Joey Coleman, Luis Diogo Couto (minutes), Nick Battle, Peter Gorm Larsen (chair), Peter Jørgensen, Sako Hiroshi. |

Review Status of the Action List
--------------------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   41/?1: Video on Deploying VDM - no changes
-   59/?1: Reconsider SRA input and structure - no changes
-   63/?1: Set up new SF-based mailing lists - closed pending setup of
    overture-users mailing list

Status of VDMTools Development
------------------------------

Tool Status

Same as last month.

VDM related people in Japan

In software Symposium 2013 (on 8th - 10th July), Dr. Kurita and Dr.
Nakatsugawa (both are from FeliCa Networks) have become a program vice
chair and a leader of the formal methods working group. Mr. Sakoh and I
are the sub leader of the working group.

Status of the Overture Components
---------------------------------

VDMJ

A few small bugs fixed this period. A bug with negative "mod"
expressions; a bug regarding the accessibility check (in VDM++) for
state designators that refer to private fields; there was a parser
correction for "is not yet specified" and "is subclass responsibility";
and a small fix for inconclusive function calls in traces (thanks to PJ
for that one!). A rather nastier bug was found/fixed on Friday, where
field updates to record values with invariants were not checking the
invariant. This was also hiding a problem with the atomic assignment
statement, which was not supressing type invariant checks. All fixes
checked-in and merged with the ASTv2 branches (except perhaps the last
two, but coming soon).

astCreator

An unfortunate implementation choice from the COMPASS project meant that
the extended ASTs were generating conflicting classes. For the moment,
JWC has changed the astCreator generation to use Java Strings in a way
that requires Java 7. This is meant to be short-term temporary, and we
have two student programmer looking at different aspects to help resolve
this.

Development Board Status
------------------------

Current status

-   Selected members for board
-   Established responsibilities and long term goals
-   Began elaborating the code standards document
-   Approved the initial dev task list

There are some tasks in the git repository that have not been published
on the list. They are too complex to be used for "getting started". But
more tasks will come.

Online presence

2 pages on this wiki:

-   [Development Board](Development Board "wikilink") (main page)
-   [Overture Dev Tasks](Overture Dev Tasks "wikilink")

Coming up

-   Approve architecture redesign
-   more to come...

Release Planning
----------------

Overture astv2

Version 2.0.0beta1 is informally released; time constraints mean that
JWC has not announced it. The "jumpiness" bug on OS X and Linux is still
present. PWVJ is resolving bugs as they come in, that come from the
students in PGL's course as they use the tool.

-   Java 1.7 is being used as a temporary fix. We will downgrade to 1.6
    for the release version of 2.0.0
-   The goal is to release 2.0.0 sometime in the summer
-   Documentation is currently being updated but help is needed with
    this
-   Along with 2.0.0, there will be a final 1.2.x release

Community Maintenance Reporting
-------------------------------

The motivation, responsibilities and tasks for community management have
been defined. The team has been officially launched by putting its page
up on the overture wiki.

There will be 3 main responsibilities in the community management team.
We are currently looking for people to tackle 2 of them (wiki editor and
online presence manager).

We will look for these members in the core list and elsewhere. The wiki
job is significantly more important. It will not require that the person
do all the work themselves but simply lead the effort and be responsible
for the wiki.

Publications Status and Plans
-----------------------------

Also see [Planned Publications](Planned Publications "wikilink").

No changes.

Any Other Business
------------------

Overture Workshop

A new deadline has been planned for the summer period. The workshop will
be held in Aarhus at the end of August.

Separating Documentation/Code in the repository

The documentation will remain in the git repository (to simplify the
build process). But the separation will be introduced. A new aggregation
branch for documentation will be created. All work on documentation
should be centered around it. PGL will monitor and oversee this branch.

Branch Policies

A document explaining the oficial policies for branch naming and use is
required. A draft of this document has been started ([Using
Git](Using Git "wikilink")) and a new
[action](https://sourceforge.net/p/overture/netmeeting-actions/106/) has
been created for its completion. LDC is responsible for it.

Next Meeting
------------

26th May 2013, 1300 CEST
