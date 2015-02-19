---
layout: default
title: Net Meeting 84
date: 14 December 2014, 13:00 CET
---


# Net Meeting 84

|||
|---|---|
| Date | 14 December 2014, 13:00 CET |
| Participants | HS, JC, JF, MV, KP, PGL, PJ, SS, TO. Minutes by PJ. |

Review Status of the Action List
--------------------------------

See [Net Meeting Actions](Net Meeting Actions "wikilink")

-   41-11

PGL has made a video on this but received little feedback. KP has
offered to give some feedback on the video. Actions remains open.

-   80-1

It was suggested to devote a NM for this next year. Action remains open.

-   82-1

KP is currently working on this. Actions remains open.

-   83-1

PGL has started working on the report. It can be found at
<http://wiki.overturetool.org/index.php/Japan_Trip_November_2014> . JF
and PGL will try to work more on this over the vacation period.

Overture Language Board Status
------------------------------

Election of the LB for 2015

Eight persons has stated their desire to become a member of the LB for
2015. However, according to the rules of the LB only seven members are
allowed (due to the rules of majority voting). Shin proposed to be an
observer of the LB and therefore the members of the LB for year 2015
will be:

-   Sako Hiroshi
-   Tomohiro Oda
-   Ken Pierce
-   Anne Haxthausen
-   Marcel Verhoef
-   Peter Tran-Jørgensen
-   Nick Battle
-   Shin Sahara (Observer)

Status of VDMTools Development
------------------------------

SS has reported the status of VDMTools to be unchanged.

Status of the Overture Components
---------------------------------

VDMJ

A few bug fixes, and one enhancement to allow <RuntimeException> to be
thrown/caught, which is compatible with VDMTools behaviour.

`2014-11-11 Correction to conversion of composed function values`\
`` 2014-11-10 Fix IO`freadval to use specification charset ``\
`2014-11-09 Correction for object reference comparisons`\
`2014-11-04 Introduce the -exceptions flag to throw `<RuntimeException>

Overture

-   Code Generation

On the code generator side their is a development version of a C++ code
generator back end from another student at Aarhus. KP is working on an
Arduino (restricted C++) backend and PJ is helping out with that.

-   GUI builder

A tool for automatic generation of user interfaces for VDM models has
been integrated into Overture. Currently, only VDM++ models are
supported. The tool is run as a launch configuration, although
breakpoints are not correctly supported yet. For more about the tool,
see
<http://www.thinkmind.org/index.php?view=article&articleid=icsea_2011_17_20_10244>

Release Planning
----------------

Version 2.1.4 released

Version 2.1.4 was released 20 November, with small bugfixes ([grab it at
GitHub](https://github.com/overturetool/overture/releases/tag/Release%2F2.1.4)),
with the main legwork done by Luís.

Release Process

From watching Luís go through the release process, Joey has noted some
improvements that must be made to the process document, and will deal
with them as time permits. Another not-done-by-Joey release is
tentatively planned for either 2.1.8 or 2.1.10

Version 2.1.6

Expected in the new year.

Community Development
---------------------

Overture Traffic

See download stats on [GitHub](http://overturetool.org/download/)

Analytics for November: <Media:Analytics-november.pdf>.

Interesting Overture projects:

-   Fuyuki ISHIKAWA from NII wish are working on producing a plug-in for
    VDM metrics. NB and LDC have been helpful with that.

<!-- -->

-   At Kyushu University they have developed a “pre-formal” support that
    they will port over to become a part of Overture


Separate Git repository for the Overture documents
--------------------------------------------------

With the migration of the LRM and Language Board issue tracker to a
GitHub repository (https://github.com/overturetool/language), the
examples and all of the documents (with a few exceptions, like release
notes) were migrated to the new repository. Joey announced to the
overture-core list that that should be considered the canonical place
for them, and that bug reports pertaining to the examples should be
submitted there; this was also noted in [Net Meeting
83](Net Meeting 83 "wikilink") minutes with no objection. Marcel has
objected, as there is a preference that that issue tracker only be used
for LB issues.

During the meeting it was decided to use the LB tracker solely for RMs
and not for the LRM. The content of the LB repository moves to a new
documentation repository instead. The Overture repository and the
associated issues tracker will remain unchanged. An action on Joey has
been created - see [Net-Meeting 84](actions.html#Separate)

Publications Status and Plans
-----------------------------

See [Planned Publications](Planned Publications "wikilink").

The next Overture workshop
--------------------------

The draft call is available at: 
<http://wiki.overturetool.org/index.php/13th_Overture_Workshop>

Input on the draft slidecast video using VDM for requirements
-------------------------------------------------------------

KP and MV will give some feedback on this.

Any Other Business
------------------

None.
