---
layout: default
title: Net Meeting 85
date: 18 January 2015, 13:00 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 85

|||
|---|---|
| Date | 18 January 2015, 13:00 CET |
| Participants | PGL(chair), NB(minutes), PJ, MV, JC, HS, LDC, SS, TO |

Review Status of the Action List
--------------------------------

See [Net Meeting Actions](Net Meeting Actions "wikilink")

Actions 41-1, 80-1 and 82-1 are carried forward. Actions 83-1 and 84-1
are closed. No new actions.

Overture Language Board Status
------------------------------

The Language Board was dissolved at the end of 2014. The re-formed LB
has yet to meet in 2015. The first meeting will be next Sunday, so no
progress to report.

Status of VDMTools Development
------------------------------

SS has reported the status of VDMTools to be unchanged.

Status of the Overture Components
---------------------------------

VDMJ

Just small bug fixes in this period:

`2014-12-17 Correction to type check of self-referential definitions`

Overture

`2014-01-07 Fixed construction of pre and post types for functions and operations`

In addition, there has been made a series of improvements to the Java
code generator concerning code generation of scoping of local variables
as well hidden definitions and duplicate definitions. The Java code
generator now:

-   Introduces local scopes when it generates code for statement blocks,
    let statements and let expressions
-   Handles renaming of local hidden definitions and local duplicate
    definitions, which is allowed in VDM, but not in Java. Now the Java
    code generator identifies definitions that hide other definitions as
    well as duplicate definitions and then it renames each of them along
    with their occurrences (variables expressions and identifier
    patterns) in order to be able to produce Java code that can compile.

Release Planning
----------------

Version 2.1.6 released

Version 2.1.6 has been released. The major new thing is the integration
of the GUI builder stuff from Porto into the IDE. Other than the usual
bug fixes, the only other notable bit is that the command line jar is
now bundled in the main distribution zipfiles.

Release process

As part of the 2.1.6 release, Joey has revised the process document
based on Luís' experience with 2.1.4. It should be possible for
developers to do a release by following the instructions in the document
now.

Version 2.1.8

Per the usual pace, 2.1.8 should be expected in late March.

Community Development
---------------------

Overture Traffic

See download stats on [GitHub](http://overturetool.org/download/)

Analytics

-   December 2014: <Media:Analytics201412.pdf>.

<!-- -->

-   Overview 2014 (tracking started in July ): <Media:Overview2014.pdf>.

*more info available at <http://www.google.com/analytics/> (access must
be granted)*

There was some discussion about some work being undertaken by Kyushu
University on tool support for the generation of specifications from
annotated natural language descriptions. There is no progress
information available currently, but this will be tracked in future
meetings.

Strategic Research Agenda
-------------------------

This was omitted, since JF was not present.

Publications Status and Plans
-----------------------------

See [Planned Publications](Planned Publications "wikilink").

NB will clarify the status of the 12th Overture Workshop proceedings
with JF.

Any Other Business
------------------

MV updated us with his new contact details, as his previous Chess
details are about to expire.

   <div id="edit_page_div"></div>