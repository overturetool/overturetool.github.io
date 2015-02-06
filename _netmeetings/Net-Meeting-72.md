---
layout: default
title: Net Meeting 72
date: 30th June 2013
---


# Net Meeting 72

|||
|---|---|
| Date | 30th June 2013 |
| Participants | Augusto Ribeiro, Hiroshi Sako, John Fitzgerald, Marcel Verhoef, Nick Battle, Peter Gorm Larsen, Peter Jorgensen, Shin Sahara, Luis Couto (minutes) |

Review Status of the Action List
--------------------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   41/?1: Video on Deploying VDM
    -   No progress but hope to have it done for the 2.0 release
-   59/?1: Reconsider SRA input and structure
    -   Suspended for now. Will be revisited at the Overture workshop
-   70/?1: Document on Using Git
    -   Completed and awaiting feedback (see [Using
        Git](Using Git "wikilink")).

Overture Language Board Status
------------------------------

No LB meeting since the last time, though a paper is being worked on.

Status of VDMTools Development
------------------------------

Newest Version

The VDM Toolbox 9.0.3- Fri 14-June-2013

Measure functions became executable. And, we can check return values
decrease.

Following is a sample: Based on LRM sample. Current checking checks
return value is smaller than old one. For example, if n.\#1 of id2
changed to n.\#2 then runtime error occurs. --- class A

operations public Test: () ==\> seq of nat Test() ==

`return [`\
` fac(10),`\
` fac2(10),`\
` fac4(mk_(10,3)),`\
` fac5(10)(3),`\
` fac6[nat](10),`\
` fac7[nat](10)(2)`\
`];`

functions public fac: nat +\> nat fac(n) ==

`cases n:`\
`  0      -> 1,`\
`  others -> n * fac(n-1)`\
`end`

measure id;

public fac2: nat +\> nat fac2(n) ==

`cases n:`\
`  0      -> 1,`\
`  others -> n * fac3(n-1)`\
`end`

measure id;

public fac3: nat +\> nat fac3(n) == fac2(n);

public fac4: (nat \* nat) +\> nat fac4(mk\_(n, x)) ==

`cases n:`\
`  0      -> 1,`\
`  others -> n * fac4(mk_(n-1, x))`\
`end`

measure id2;

public fac5: nat +\> nat +\> nat fac5(n)(x) ==

`cases n:`\
`  0      -> 1,`\
`  others -> n * fac5(n-1)(x)`\
`end`

measure id3;

public fac6[@T]: @T +\> @T fac6(n) ==

`cases n:`\
`  0      -> 1,`\
`  others -> n * fac6[@T](n-1)`\
`end`

measure id4;

public fac7[@T]: @T +\> @T +\> @T fac7(n)(x) ==

`cases n:`\
`  0      -> 1,`\
`  others -> n * fac7[@T](n-1)(x)`\
`end`

measure id5;

public id: nat +\> nat id(n) == n;

public id2: (nat \* nat) +\> nat id2(n) == n.\#1;

public id3: nat +\> nat +\> nat id3(n)(-) == n;

public id4[@T2]: @T2 +\> nat id4(n) == n;

public id5[@T2]: @T2 +\> @T2 +\> nat id5(n)(-) == n;

end A

------------------------------------------------------------------------

How to execute:

vpp\> r test.vdm Parsing "test.vdm" (Plain Text) ... done vpp\> set
measure??????????????\<--- set measure execution measure check set vpp\>
init Initializing specification ... Initializing A done vpp\> d new
A().Test() [ 3628800, 3628800, 3628800, 3628800, 3628800, 3628800 ]
vpp\> tcov write vdm.tc vpp\> rtinfo vdm.tc

`` 100%     22  A`id ``\
`` 100%     11  A`fac ``\
`` 100%     11  A`id2 ``\
`` 100%     11  A`id3 ``\
`` 100%     11  A`id4 ``\
`` 100%     11  A`id5 ``\
`` 100%      1  A`Test ``\
`` 100%     11  A`fac2 ``\
`` 100%     10  A`fac3 ``\
`` 100%     11  A`fac4 ``\
`` 100%     11  A`fac5 ``\
`` 100%     11  A`fac6 ``\
`` 100%     11  A`fac7 ``\
`100%  A`

Total Coverage: 100% vpp\> unset measure????????????\<--- stop measure
execution measure check unset vpp\> tcov reset vpp\> d new A().Test() [
3628800, 3628800, 3628800, 3628800, 3628800, 3628800 ] vpp\> tcov write
vdm.tc vpp\> rtinfo vdm.tc

``   0%      0  A`id ``\
`` 100%     11  A`fac ``\
``   0%      0  A`id2 ``\
``   0%      0  A`id3 ``\
``   0%      0  A`id4 ``\
``   0%      0  A`id5 ``\
`` 100%      1  A`Test ``\
`` 100%     11  A`fac2 ``\
`` 100%     10  A`fac3 ``\
`` 100%     11  A`fac4 ``\
`` 100%     11  A`fac5 ``\
`` 100%     11  A`fac6 ``\
`` 100%     11  A`fac7 ``\
` 94%  A`

Total Coverage: 94% vpp\>

------------------------------------------------------------------------

These new tests have not yet been tried on VDMJ/Overture. Nick will be
handling this. Also, Shin will try the additional tests for this in
Overture.

The goal is for closer synchronization between both tools.

Status of the Overture Components
---------------------------------

VDMJ

A few more small bugs fixed this period. A fix to type accessibility
checks, a fix to restore coverage tracking for atomic statements, an
improvement to class invariant handling, and a type-check correction for
access to fields of object references passed as parameters. I think
these have been copied into the ASTv2 branches now. There were also a
couple of late fixes to the PO generator, following from work I'm doing
with Luis, but those probably won't have made it into ASTv2 yet.

Misc Fixes

Kenneth and Peter have fixed various small issues with the tool. Also,
all the changes made to VDMJ have been ported to ASTv2. Except for the
ongoing work on POG, which must be ported when it has reached a steady
state in VDMJ. In addition, Overture has some issues with respect to
coverage coloring that needs to be checked into. For some language
constructs the coverage coloring is not handed correctly.

New POG

Work on the new POG by Luis and Nick is ongoing. Only a few obligations
are left to be converted. The next stage will be testing.

Development Board Status
------------------------

Module Reps

The Dev board continues to discuss the assignment of modules to the
various rep. Progress is ongoing.

Overture Dev Night

Members of the Dev Board are planning an informal coding social event
called Overture Dev night for September in Aarhus. More information will
be available soon.

Release Planning
----------------

Overture 2.0.0

Status for the full release is essentially the same; JWC hasn't had the
opportunity to fully focus on this during the past month. Factoring out
the bits that require Java7 has only had slow progress.

Remaining work includes:

-   Finishing the refactoring of the assistants to remove the Java7
    dependency
-   Standalone documentation updates
-   Internal documentation updates (help pages, about boxes, welcome
    screens, etc)
-   Sorting out OS X signing keys

We still plan to release during the summer, but it won't be until
August.

Overture 1.2.x

As before; expect a version 1.2.5 concurrent with the final 2.0.0

AstCreator split out

It is still planned to split AstCreator into a separate repository, but
no progress has been made.

Community Maintenance Reporting
-------------------------------

Membership

Still no new members. Tasks and responsibilities must be rethought.

Tasks

We must discuss which tasks to prioritize and which responsibilities to
keep/drop.

I propose wiki maintenance as the most important responsibility and as
such the one that must kept. The blog/etc. will have to be dropped for
now.

In terms of tasks, there are 3:

1.  wiki clean up
2.  website redesign
3.  web presence overhaul.

The first one is again the most important but it would be very nice if
we could complete 2 and 3 in time for the release of Overture 2.0 (the
new website could be launched along with 2.0 to "celebrate"). Some help
would be needed to complete all 3 in time.

No volunteers were available to help with these tasks. Luis will make a
plan and proceed on his own.

Publications Status and Plans
-----------------------------

[Planned Publications](Planned Publications "wikilink") has been cleaned
up (titles, dates, etc.).

But further updating is necessary on the status of some papers. Their
authors (namely Sune) will be contacted to do so.

Also, some papers will be moved from In Press to Recently Appeared and
their links updated (Shin and PGL).

Any Other Business
------------------

It has been proposed that the next NetMeeting (August 25) be held at the
Overture workshop instead (1 week later). The idea was approved but we
must coordinate with the organizers of the Overture workshop.

Next Meeting
------------
