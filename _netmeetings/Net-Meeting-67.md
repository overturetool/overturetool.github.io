---
layout: default
title: Net Meeting 67
date: January 26th 2013
---


# Net Meeting 67

|||
|---|---|
| Date | January 26th 2013 |
| Participants | *Peter Gorm Larsen *Nico Plat *Marcel Verhoef *Shin Sahara *Hiroshi Sako *John Fitzgerald |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   41/?1: Video on Deploying VDM
    -   No news
-   59/?1: Reconsider SRA input and structure
    -   No news
-   63/?1: set up new SF-based mailing lists
    -   No news.
-   65/?1: Investigate use of Stack Overflow for VDM community questions
    -   No update relative to last meeting.

VDMTools
--------

Dr. K fixed some bugs of type checking of recursive curried function. I
couldn't talk with Dr. K about this modification, because I was busy
with funerals of my father, mother, and mother-in-law. At least, the
following example is OK.

Version

1.  The VDM++ Toolbox v9.0.2 - Mon 21-Jan-2013 10:49:01 +0900

`      functions`\
`      public fmap[@elem]: (@elem -> @elem) -> seq of @elem -> seq of @elem`\
`      fmap(f)(l) ==`\
`             if l = []`\
`             then []`\
`             else [f(hd l)] ^ (fmap[@elem](f)(tl l))`\
`      measure m;`

`      m[@elem]: (@elem -> @elem) * seq of @elem -> nat`\
`      m(-,l) == len l;`

Overture
--------

VDMJ

The **narrow\_** keyword is now implemented. A small bug was fixed with
mk\_token comparisons, that meant that tokens of different underlying
types would sometimes be considered equal. This is now changed so that
tokens are equal if and only if their values would be equal. A **-path**
command line option has been added to VDMJ to allow more convenient
library access when using the command line. The -path option(s) provide
alternative search directories when source files cannot be found
relative to the current directory. This has also been updated by the LB
in the language manual. The updates to manuals shall be pushed out to
the users in connection with every release.

ASTv2

No change relative to the last netmeeting. AU has a new person starting
in February who will spend some time with this.

Language Board
--------------

The meeting minutes will be available here:
[1](http://wiki.overturetool.org/index.php/Language_Board_NetMeeting_Minutes)

Release Management
------------------

Overture 1.2.4

Expected to be released in February, after the present COMPASS project
deliverable push calms down.

Overture 2alpha

No change.

Overture Workshop
-----------------

The next Overture workshop will be held at iFM 2013 (see
<http://www.it.abo.fi/iFM2013/workshops_and_tutorials.php>)

Publication plans
-----------------

Also see [Planned Publications](Planned Publications "wikilink").

A few changes were reported at the meeting.

However, more will follow after discussions between John, Ken and Carl.
The "Newcastle Cyber-Physical Systems Initiative" mentioned is a new lab
that we are starting in Newcastle as a result of a big investment by the
university in a significant extension to the campus for Computing
Science. Newcastle also plans to start teaching with VDM-RT in their BSc
module on Real-Time systems next year. Students will use DESTECS and
20-Sim as well. New training materials will be developed for the
students over next summer.

Any Other Business
------------------

None

Next Meeting
------------

February 24th 2012 13:00 CET
