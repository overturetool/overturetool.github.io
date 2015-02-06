---
layout: default
title: Net Meeting 80
date: 6 July 2014, 13:00 CEST
---


# Net Meeting 80

|||
|---|---|
| Date | 6 July 2014, 13:00 CEST |
| Participants | PGL, NB, JF, JC, PJ. Minutes by NB. |

Review Status of the Action List
--------------------------------

See [Net Meeting Actions](Net Meeting Actions "wikilink")

-   41-1 no progress but PGL will try to have a go at this over the
    summer
-   59-1 Some progress on this one. Agreed to close this action, and add
    a new action from today for JF to hold an email/skype discussion
    about revising the goals for 2020, and the specifics of the
    semantics, methods&apps and tools pages.
-   75-2 Is carried forward, JC is in dicussion with MV about this.
-   76-2 Is now closed, after the 12th Overture workshop.
-   79-1 Is now closed.
-   79-2 Is carried forward, though it was noted that there may be
    assistance from Aarhus with testing the UI.

Overture Language Board Status
------------------------------

The minutes of the last LB meeting can be found here:
[minutes](http://wiki.overturetool.org/index.php/Minutes_of_the_LB_NM%2C_29th_June_2014)

The LB agreed to remove periodic and sporadic threads from VDM++, though
there is some discussion still about object patterns and the semantics
of object references being used in a functional context. We also hope
that Tomohiro Oda will be able to sit in on LB meetings as an expert and
to help the LB liase with Japan.

Status of VDMTools Development
------------------------------

State is the same as the previous meeting.

Status of the Overture Components
---------------------------------

VDMJ

Just a few small bug fixed this period:

`2014-07-06 Map patterns not working with munion`\
`2014-07-05 Correct type check of undefined values`\
`2014-07-02 Correct type check error with record field values`\
`2014-06-23 Fix type checker to report errors for private abstract fn/ops`\
`2014-06-23 Fix for maplet patterns and possible type matching`

Release Planning
----------------

Version 2.1.0 released

Version 2.1.0 was released 12 June, with small bugfixes ([grab it at
GitHub](https://github.com/overturetool/overture/releases/tag/Release%2F2.1.0)).
The major features justifying the shift to a 2.1.x version number are
the "official" release of PeterJ's codegen and Luís and Nick's AST-based
POG.

Release Process

There's been no progress on the Release Process document since the
workshop, but that will be revisited when version 2.1.2 is released. The
plan is still to have Kenneth actually do the release, with Joey
watching over his shoulder.

Community Development
---------------------

Overture Traffic

See [June download
stats](https://sourceforge.net/projects/overture/files/stats/timeline?dates=2014-06-01+to+2014-07-01)

There was an enormous (\~10,000) download spike in June from Pakistan.
I've no idea what that's about, but it rather skews our statistics!

Wiki Migrations

The dev wiki has moved entirely to Gihub. See [Overture Developer
Support](Overture Developer Support "wikilink").

We are considering migration of the core wiki at
<https://github.com/overturetool/overturetool.github.io/issues/4>

Featured Examples

The following models have been chosen for featured example status:

1.  Stack // rewritten to flat SL
2.  Dining
3.  TelephoneSL // implicit style
4.  buffers2 // Combinatorial Testing (LUHN was the original choice but
    it crashes CT)
5.  POP3 // Runners-up: Worldcup, VFS, ConwayGameLife
6.  CashDispenser

The MSAW series was also considered as the final example. It can take
the place of CashDispenser.

Strategic Research Agenda
-------------------------

Not discussed this time.

Publications Status and Plans
-----------------------------

The publication list was reviewed. See [Planned
Publications](Planned Publications "wikilink").

Any Other Business
------------------

JF: "We had some great connections made at INCOSE last week for the
COMPASS work. I have asked for some connections to Japanese people
possibly interested in SoS modelling". Contact was from Keio University.
Also, "[There] is a person frome a jet manufacturer interested in
unmanned vehicles and in particular the use of SysML to manage problems
with concurrent development - I thought there was an interest in
co-modelling but with this person SysML is the place to start, rather
than VDM/20-sim." Contact is from Gulfstream. Also, "I was approached
after the COMPASS talk by Gael Blondelle, Director of European
Eco-System Development at the Eclipse Foundation. I thought at first he
wanted the software, but he wants the COMPASS (and I think by extension
Overture) tools community to get involved in one of his things". JF will
send email to introduce Gael to the Overture team.
