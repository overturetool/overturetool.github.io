---
layout: default
title: Net Meeting 83
date: 2nd November 2014.
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 83

|||
|---|---|
| Date | 2nd November 2014. |
| Participants | KP (chair), NB (minutes), JF, LD, JC |

Review Status of the Action List
--------------------------------

-   41-1 Ongoing
-   79-2 Completed. NB will create a GitHub issue to request the
    automation of the tests identified.
-   80-1 Ongoing
-   82-1 Action will be transferred to KP. Some progress has been made.
-   82-2 Closed. Overture 2.1.2 now has this feature.

See [Net Meeting Actions](Net Meeting Actions "wikilink")

Overture Language Board Status
------------------------------

KP gave an update on the LB status. Two RMs have been completed recently
(Object Patterns, and the removal of sporadic and periodic from VDM++).
There remains one active open RM, "Pure Operations", which is being
hotly debated.

JC also reminded us that we need to create GitHub issues in the main
Overture repository when RMs enter the Execution state, to make sure
they are recorded in the next Release Notes. KP will also add this as a
note to the (new) wiki pages about LB processes.

Status of VDMTools Development
------------------------------

Dr.K is trying to execute some type bind as following:

`   vdm> p { a | a : bool }`\
`   { false, true }`\
`   vdm> p { a | a : [`<A>`] }`\
`   { nil, `<A>` }`\
`   vdm> p { a | a : bool * ( `<A>` | `<X>` | `<C>` ) }`\
`   { mk_( false, `<A>` ), mk_( false, `<X>` ), mk_( false, `<C>` ), mk_( true, `<A>` ), mk_( true, `<X>` ), mk_( true, `<C>` ) }`\
`   vdm>`

This changes brings VDMTools in line with VDMJ.

Status of the Overture Components
---------------------------------

VDMJ

A few small bug fixes this period:

`2014-10-30 Correct problem with type check of unary minus expressions`\
`2014-10-24 Fix for membership test of recursive types`\
`2014-10-23 Correction to externals clause type checking`\
`2014-09-28 Added implementation of Object Patterns (RM#25)`

Release Planning
----------------

Version 2.1.2 released

Version 2.1.2 was released 9 October, with small bugfixes ([grab it at
GitHub](https://github.com/overturetool/overture/releases/tag/Release%2F2.1.2)).
Mostly bugfixes.

Release Process

There's only been minor progress on the Release Process document since
the last release, and the plan to have Kenneth release 2.1.2 didn't
happen. The plan is still to have Kenneth actually do the release, with
Joey watching over his shoulder, possibly for version 2.1.4.

Implementation of RMs from the Language Board

Nick noticed that Joey had not mentioned any of the implemented RMs in
the release notes for the past few releases, and they agreed that a
GitHub issue should probably be created in the code repository when a RM
moves to the 'execution' stage so that they are appropriately tracked
with releases.

Overture Documentation primary location

The primary location for the Overture document (including the LRM) is in
the overturetool/language repo on GitHub; do not edit the version in the
overturetool/overture repo, as it is deprecated and will go away as soon
as Joey has time to adjust the build.

Version 2.1.4

We presently have a small handful of fixed bugs, so Joey expects to do a
release at some point in late November, keeping with the \~2 month tempo
for releases.

Community Development
---------------------

Analytics for the month of september:
<Media:Analytics_20140930-20141030.pdf>. Lots of other information is
available from the website but for now we start with Overview,
Engagement and Location data.

JF gave a short update about the recent trip he and PGL took to Japan. A
trip report can be found at [Japan Trip November
2014](Japan Trip November 2014 "wikilink"). Action 83-1 will record the
need for a proper trip report. One interesting outcome is likely to be
the availability of videos of the main presentations on YouTube.

Strategic Research Agenda
-------------------------

This was not discussed, pending the completion of action 80-1: Revise
Strategic Goals for 2020.

Publications Status and Plans
-----------------------------

Individuals will make updates to the wiki. We hope to see the 12th
Workshop proceedings out next week. See [Planned
Publications](Planned Publications "wikilink").

   <div id="edit_page_div"></div>