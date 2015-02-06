---
layout: default
title: Net Meeting 79
date: June 1st 2014
---


# Net Meeting 79

|||
|---|---|
| Date | June 1st 2014 |
| Participants | Peter Gorm Larsen, John Fitzgerald, Nick Battle, Shin Sahara, Luis Diogo Couto (minutes) |

Review Status of the Action List
--------------------------------

See [Net Meeting Actions](Net Meeting Actions "wikilink")

-   41-1: No progress. To be discussed at the upcoming workshop
-   59-1: Work is ongoing on revising the SRA pages. To be discussed at
    the workshop
-   75-2: Principals absent. Not discussed.
-   76-2: To be discussed at the workshop.

Overture Language Board Status
------------------------------

Awaiting feedback from Dr. K via Shin on various topics.

Status of VDMTools Development
------------------------------

Newest version

-   Version 9.0.4(2014.5.2 update): This version provisionally supports
    followings:

1.  sporadic
2.  stop/stoplist

-   Update to use Qt 4.2.
-   Update to use omniORB 4.2.0
-   Bug fixes

gather requirements

-   Dr.K (SCSK) wants to gather requirements to improve VDMTools.
    -   There are some limitations on how much time will be available to
        work on VDMTools.
    -   The main suggestion given at the NM was to increase
        compatibility with Overture and supporting the decisions of the
        LB.
    -   A new UI was also suggested but it is unlikely there will be
        time to implement one.
    -   PGL will compose an email with the suggestions.

Status of the Overture Components
---------------------------------

VDMJ

The usual dribble of bug fixes since the last meeting. The following is
from the VDMJ Release Notes, though the corresponding fixes have also
been made to Overture:

`2014-05-22 Account for is_ expressions in type checker`\
`2014-05-21 Set intersect can fail with named types`\
`2014-05-20 Correct type check of while statement condition`\
`2014-05-16 Enable type restrictions on UpdatableValues`\
`2014-05-08 Prevent inheritance of private constructors`\
`2014-05-08 Correction to listener handling in value assignments`\
`2014-05-08 Correct guards for static operations and variables`\
`2014-05-06 Correction for guards with uninitialized field expressions`\
`2014-05-01 Change SL state record types to reflect any state invariant`

The remaining Overture components are not usually discussed under this
heading. PGL has a new action (79-1) to discuss moving them over to
release planning.

Release Planning
----------------

Version 2.0.8 released

Version 2.0.8 was released 19 May, with small bugfixes ([grab it at
GitHub](https://github.com/overturetool/overture/releases/tag/Release%2F2.0.8)).
Unfortunately, PGL found a regression which means that the combinatorial
testing isn't working. There is also a case where the (beta) code
generation fails due to a lack of folders. I expect to include fixes for
either 2.1.0 or 2.0.10

These issues highlight the need for some level of UI testing. PGL and NB
have a new action (79-2) for creating an initial list of UI tests to be
carried out. Automation of these tests is a serious concern.

Also, the fact that no users complained of these bugs once again
highlights the need to discuss our user base and community building
efforts.

Version 2.1.0 plans

The plan for version 2.1.0 is to have two “banner” features:

-   Complete replacement of the old string-based POG with the new
    AST-based POG
-   Code Generation

The release is nearly ready; first release candidate exposed a small
problem with the combinatorial testing; we'll see nearly next week if
it's fixable in a short timeframe.

Buildserver notes

We've set up a (third) new buildserver at AU, taking over the
overture.au.dk/build.overturetool.org address. The previous two build
servers have been decommissioned, and the new one appears to be working
very well. We will also still continue to use the Travis CI public
infrastructure, as it gives fast feedback about any branch without
having to configure it on the AU buildserver.

Release Process

The status of the release process document
[1](https://github.com/overturetool/overture/wiki/Release-Process) is
steadily improving — JWC is reasonably certain that all of the commands
are correct now. Among the things to come is the set of all the places
that need to be updated once the release artefacts have been created.

It is still important that someone outside of AU has a handle on what
needs to be done to perform a release, but we're moving in that
direction.

Community Development
---------------------

Overture Traffic

See [Download
stats](http://sourceforge.net/projects/overture/files/Overture_IDE/stats/timeline)

New Website

-   overturetool.org
    -   suggestions for improvement
    -   website bug reports to
        [2](https://github.com/overturetool/overturetool.github.io/issues)
-   future of the wiki(s)
    -   dev wiki is at
        [3](https://github.com/overturetool/overture/wiki) (the wiki
        area connected to the main code repository on github) — devs use
        this now
    -   general wiki at
        [4](https://github.com/overturetool/overturetool.github.io/wiki)
        (the wiki area connected to the website repository) - should we
        migrate the general wiki?
    -   The current wiki (ie the one you're reading now) needs to be
        cleaned up and the migrations are a good opportunity for it. The
        developer materials need to be migrated over anyway and we
        should discuss if the same should be done for the general
        material, thus abandoning this wiki entirely.

The wiki and website discussions were postponed for when we have more
people present at the NM.

We once again discussed the topic of community building. While its
importance is recognised by all, there is still no consensus on what the
best approach is. There we some suggestions made (focusing on improving
our tools and methods, targeting students, a wiki clean up) but in
general we need a more cohesive strategy and set of goals for community
building. The issue will be discussed further at the next workshop.

Strategic Research Agenda
-------------------------

The SRA needs to be revised and there have been discussions on it. Old
materials exit but their usefulness is questionable. Several questions
have been raised such as PhD students, research topics for VDM, tying it
closer to community building and the ultimate goals of the SRA.

This issue needs to be discussed further and the workshop is one
possible venue for it (though there are concerns of whether we'll have
enough time to cover everything). Another possibility is to have a NM
dedicated to it.

Publications Status and Plans
-----------------------------

Updates made to [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------
