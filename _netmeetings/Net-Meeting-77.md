---
layout: default
title: Net Meeting 77
date: 16 March 2014, 13:00 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 77

|||
|---|---|
| Date | 16 March 2014, 13:00 CET |
| Participants | Joey Coleman, Hiroshi Sako, Nick Battle, Peter Gorm Larsen, Peter Jorgensen, Shin Sahara, Ken Pierce, Marcel Verhoef, Luis Diogo Couto (minutes) |

Review Status of the Action List
--------------------------------

See [Net Meeting Actions](Net Meeting Actions "wikilink")

-   Action tracker moved to the wiki (see link above).
-   No progress on 41-1 and 59-1.
-   75-2: JWC awaiting decision on what to do from LB.
-   Closed the following actions:

### 75-3: Migrate NM Action Tracker to Overture Wiki

Created: 1 December 2013 (see [Net Meeting
75](Net Meeting 75 "wikilink"))\
Owner: Marcel Verhoef

Marcel will migrate the NM tracker to the Overture wiki.

### 76-1: Language Board 2014 Net Meetings

Created: 26 January 2014 (see [Net Meeting
76](Net Meeting 76 "wikilink"))\
Owner: Peter Wurtz Vinther Jorgensen

Send out schedule for the Language Board (LB) 2014 Net Meetings to the
LB mailing list.

Overture Language Board Status
------------------------------

-   Ken Pierce is the new LB chair
-   Last LB meeting a month ago:
    <http://wiki.overturetool.org/index.php/Minutes_of_the_LB_NM%2C_16th_February_2014>
-   Next LB meeting on March 30
-   Currently updating LRM for some RMs
-   A new LRM is available but was merged in after the latest release.

Status of VDMTools Development
------------------------------

Nothing to report.

Status of the Overture Components
---------------------------------

VDMJ

Some small bug fixes this period:

`2014-02-13 Fix to text and location of warning 5010`\
`2014-02-09 Correction to merge for incompatible maps`\
`2014-02-07 Added type check correction for constructor return statements`\
`2014-01-22 Missing type error for value definitions calling operations`

Overture

Various bug fixes

Code Generation

An experimental version should be available soon.

Release Planning
----------------

*("I" refers to JWC)*

Overture 2.0.4

Released 11 March, grab it at
[GitHub](https://github.com/overturetool/overture/releases/tag/Release%2F2.0.4)
— downloads are at the bottom of that page. The release process is
getting much better.

Maven Central

Overture core jars are now published on Maven Central — this means that
the core jars are available for anyone to use as a dependency in their
pom.xml without any extra configuration in their pom.xml files (this
applies only the the pure Java core jars, though: Eclipse makes things
difficult, as usual).

The process is a little baroque, but mostly automated. I suggest that
someone outside AU volunteer to learn how to push a release out to Maven
Central; volunteers? Ideally they'll do the release of 2.0.6 follow
instructions I'm writing in the dev wiki; but they'll need to register
with Sonatype first.

Publishing Eclipse dependencies

I'm still working on this; it'll probably stay with SF.net in the end.

Issues on GitHub — File attachments

I have no good solution for this, as GitHub only allows image
attachments. However, for most VDM models, it is feasible to just
copy/paste it into the bug report. If a user wishes to do this, they
should put three tildes (\~\~\~) in an otherwise empty at the start and
end of the code that's been pasted in.

Buildserver considerations

We've started using [Travis CI](https://travis-ci.org) to build the
Overture codebase. This is a free (for open source) service that may end
up meaning that we don't need a build server as such. The major
considerations here are a) the VDMTools conformance tests we have; b)
test status reporting; and c) producing release builds.

I see conformance testing as being addressed by individual (trusted)
developers just running them, and this is not a deviation from past
practice. Overall test status reporting is a bit tricky, but I'm still
thinking about it. Finally, the release builds can be built on an
individual's machine with a bit of discipline (indeed, 2.0.4 was built
on my laptop, so we'll see how that works).

Release Training

JWC wants to spread the knowledge of how to do release builds to people
outside of AU. We are currently looking for a candidate to learn this.

Community Development
---------------------

Nothing has been done on this due to lack of time. But there is an
action to discuss the issue and there will be a community development
session at the Workshop. Also, we will begin monitoring Overture
downloads as part of community development every NM.

Strategic Research Agenda
-------------------------

The Strategic [Research](Research "wikilink") Agenda is reviewed every
other NetMeeting.

Publications Status and Plans
-----------------------------

Also see [Planned Publications](Planned Publications "wikilink").

-   Awaiting notification on papers submitted to ABZ next week.
-   Awaiting a proof of the DESTECS book next week. If approved, should
    appear before FM'14
-   Work is underway for the next Overture workshop. A wiki page has
    been set up: [12th Overture
    Workshop](12th Overture Workshop "wikilink")
-   A few papers (title and preliminary abstract) have been submitted to
    the Workshop but more are needed.

Any Other Business
------------------

None.

   <div id="edit_page_div"></div>