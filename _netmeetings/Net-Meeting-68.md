---
layout: default
title: Net Meeting 68
date: 24 February 2013, 13h00 CET
---


# Net Meeting 68

|||
|---|---|
| Date | 24 February 2013, 13h00 CET |
| Participants | Joey Coleman, John Fitzgerald, Luis Diogo Monteiro Duarte Couto (aka "Luis"), Nick Battle, Nico Plat, Peter Gorm Larsen (chair), Shin Sahara, Marcel Verhoef (minutes). Apologies received from Sako Hiroshi. |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   41/​1: Video on Deploying VDM (no progress).
-   59/​1: Reconsider SRA input and structure (no progress).
-   63/​1: set up new SF-based mailing lists (see 65/1).
-   65/​1: Investigate use of Stack Overflow for VDM community questions
    -   We've had a couple more questions there in the last month; Nick
        caught both (though one would have benefitted from the asker
        googling for the language manual and looking up the basic
        syntax). Some additional ideas where discussed, action item has
        been updated. Kept open until move to StackOverflow
        infrastructure is in place.
-   67/1: Find new Aarhus member of the Overture LB (no progress).

VDMTools
--------

-   version of VDMTools 8.3.2rc33/9.0.2rc33
    -   Final candidate version.
    -   Modified examples.
        -   Took measures against Windows 64 bit in dl-example.
        -   Appended Java code in dl-example.
        -   Fixed the Makefile of corba api for Windows.
        -   Using clang on Mac OS X 10.7 or later version

<!-- -->

-   SCSK Organization
    -   SS will quit SCSK at 31th March.
    -   SCSK will continue VDM in minimum level.
        -   Mr. Ueki and Dr. Kei Sato move to another division.
        -   If VDM maintenance tasks occurred they will do the tasks.
        -   If VDM consulting tasks happened SS will do the tasks.

Overture
--------

Status for the different Overture components

<!-- -->

VDMJ

I added a small JUnit test suite to Fujitsu's VDMJ site (still GPL and
it works with Overture's VDMJ build too), which means that it is easy to
build Java tests that use "command line" VDM. Leo is looking at this for
bulk-testing his students' project work for example, and it is
essentially what we use to run the SCSK test suite. I've added details
to the User Guide. Otherwise, there was just a small bug fix so that
renamed VDM-SL imports now hide the original name.

Overture Language Board

Minutes of last meeting
[here](Minutes_of_the_LB_NM%2C_27th_January_2013 "wikilink"). Next
language board meeting will be 17 March, and the board is still looking
for a new volunteer member.

Status on the AST restructuring — Overture 2α2

We've had some build issues with the astV2 branch, and are addressing
them in a more general way in an attempt to eliminate an entire class of
build problems that we frequently encounter. Some details on this are in
the [Release Management](#Release_Management "wikilink") section below,
and even more are available if desired by chatting with Joey.
Documentation of the build system will be produced on the wiki before
the final release of Overture 2.

Status of the individual components is pending testing; the core
functionality appears to be fine; the quick interpreter works; the main
interpreter and combinatorial testing have configuration errors; the
UML2 translation plugin works; and the rest is yet untested. This
reflects the state of the 2α version as of Friday (22nd) afternoon; Joey
had hoped to have the build system stabilised by then, but it will be
next week. Expect an announcement of a 2α2 version for testing in the
coming week.

Peter WV Jørgensen –who was one of the students involved in writing the
ShowtraceNextGen plugin– has started on the COMPASS project as of the
start of February, and is presently working directly on the Overture
codebase. Presently he's integrating changes from the dev-nick branch
into the astV2 codebase, and doing small cleanups along the way.

Next Overture workshop at iFM 2013

Two-day joint workshop with the B-method group. First call for papers
was sent out but no submissions received so far. Ideas are maturing for
the following papers:

-   NCL: position paper on multi co-modelling
-   NCL: joint work of Carl and Jeremy
-   NCL: report on cyber physical systems work
-   generic state machine modelling framework for VDM-RT (Marcel)

The idea for a new Overture Development Board

Augusto Ribeiro and other Overture developers have been having some
talks on how we can make it easier for other developers to join in the
project and also on how to improve the general code quality on the
Overture tool. From this discussions, the idea of forming some kind of
Development Board (ODB) that would try to improve the tool in those
specific matters appeared.

We had our first meeting last Thursday, to try and define some common
ground in respect to expectations and hopes. The board at the moment is
composed of 4 developers (Augusto, Kenneth Lausdahl, Nick Battle and
Luis Couto) and Peter G. Larsen as the user representative. If somebody
else is interested in joining this group, please mail Augusto. Everybody
is, of course, welcome in our group discussions.

The Overture development board will concern itself mainly with the
Overture codebase. The overall responsibility will be to keep the code
at a high quality and make it as easy as possible for new developers to
join the project, either to help with existing things or create new
functionality.

Our responsibilities will be to:

-   Maintain code quality
-   Maintain the architecture with a focus on extensibility
-   Maintain the Overture coding standards guide
-   Ensure documentation exists at various levels
-   Approve major changes to the Overture codebase
-   Maintain a roadmap for the codebase

This proposal was discussed at the NM and accepted; we look forward to
future reports from the DB.

Release Management
------------------

Overture 1.2.4

The development branch is now caught up with dev-nick; assuming that
there are no issues with the latest development version [on the build
server](http://build.overturetool.org/builds/OvertureDevelopment/) then
it will be made into the v1.2.4 release. This will most likely be the
last pure VDMJ version of Overture.

Overture 2α2

Progress has been made lately on refactoring the build architecture,
using both the maven-tycho plugin and the lessons learned in setting up
the COMPASS tool.

The maven Tycho plugin has vastly improved since the last time JWC tried
it (a bit more than a year ago). The plugin is the result of a
collaborative effort between the maven and Eclipse people to allow the
compilation of Eclipse plugins using maven. Configuration is bit
different: Tycho modules use the plugin.xml, build.properties, and
MANIFEST.MF to determine library dependencies and the like (while maven
normally keeps that metadata in pom.xml files). This allows these
modules to use exactly the same configuration files for both the Eclipse
debugging build and the maven standalone build. It appears, as a result,
that we get a better match between what runs in the Eclipse debugging
mode, and what runs in standalone builds.

From the experience with the COMPASS tool, the way that the jar files
from *core/* in the code are all being made available to the Eclipse
plugins in *ide/* via the *org.overture.ide.core* plugin. The COMPASS
project creates a similar "bottleneck" — this vastly simplifies the
configuration and tracking of jar files. We may set it up so that only
the common jar files (e.g. for the ast, the typechecker, etc.) are made
available through *org.overture.ide.core*, and plugin-specific jar files
(e.g. those for the combinatorial testing functionality) are made
available directly by the individual Eclipse plugins. The previous build
setup required that every plugin import the specific core jars it
needed: that worked, but was missing a version update on a single plugin
caused hard to detect errors.

The ultimate goal of this is for it to be possible for anyone to be able
to produce a standalone version of the Overture tool by running
`mvn install ; cd ide ; mvn install`.

Publication plans
-----------------

Also see [Planned Publications](Planned Publications "wikilink") and
[Overture Publications](Overture Publications "wikilink").

Both lists are in need of updating, some [Planned
Publications](Planned Publications "wikilink") have already appeared but
are not yet available through the [Overture
Publications](Overture Publications "wikilink") page. Ken Pierce will
review the list and send e-mails to all individual authors to their
status and encourage them to perform the update.

Any Other Business
------------------

-   VDM-SL IDE on Smalltalk Brower
    -   Mr. Oda (Software Research Associates Inc.
        <http://www.sra.co.jp/index-en.shtml>) made VDM-SL IDE on
        Smalltalk Brower. It uses VDMJ, and run on Squeak (a dialect of
        smalltalk).

Next Meeting
------------

24 March 2013, 1300 CET.
