---
layout: default
title: Net Meeting 87
date: 29 March 2015, 1300 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | Nick Battle, Nico Plat,  Peter Gorm Larsen (chair),  Tomohiro Oda, Peter Tran-Jørgensen. Minutes by Peter Tran-Jørgensen. |

## Review Status of the Action List

See [Net Meeting Actions](actions.html)

* 80-1 Status remains unchanged. Action is still open.

## Overture Language Board Status

#### Add a VDM-Util function for getting current system time

There has been a proposal to extend the standard libraries with support for measuring the time it takes to execute a functional description.

See https://github.com/overturetool/language/issues/31

#### Pure operations

Status of this request for modification remains unchanged.

See https://github.com/overturetool/language/issues/27 

some description

## Status of VDMTools Development

#### v.9.0.6

SCSK has a plan to release v9.0.6 in this month.


##  Status of the Overture Components

#### VDMJ

Some small bug fixes:

* 2015-03-24 Fix to typecheck of forward references
* 2015-03-18 Fix to typecheck of map/seq override operator
* 2015-03-14 Fix to typecheck of subset and psubset
* 2015-03-03 Correction for is_ handling of function types

#### New Projects
Students at the University of Minho have started two projects on Overture (ldc supervising): 

* using Alloy to discharge POs in VDM-SL
* building a new coverage plug-in

It will be some time until either of these is in the tool (if they ever are) but we are particularly interested in how the students get along. These are probably the first fully remote Overture contributions by new developers.

Most recent work on the Java code generator

New functionality added to the Java code generator:

* Choosing output package of the generated code
* Do a launch configuration based code generation and have the Java code generator generating the corresponding main class.
* Output as an Eclipse project. In addition to the user generated code, it also has a copy of the code generation runtime. (One with the binaries only, and one with the sources attached).

##  Release Planning

#### Overture 2.2.4

The next version of Overture is coming out very soon. The internal RC has been sent out for testing (interested parties can grab it at http://overture.au.dk/overture/development/Build-206_2015-03-27_13-21/). Assuming all goes well, the release will be built and published Monday, March 30.

The release will consist of bugfixes and some usability improvements as well as some updates to the user manual. It is being done in part to support upcoming VDM courses.


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### @overturetool
The Overture twitter handle (https://twitter.com/overturetool) is now under direct administration of the Overture project. We have a tool in place to do group tweeting so multiple people can tweet from the handle without sharing a password. It would be really nice if we could make the acount more lively. Interested parties should contact ldc/kl. Also, we are considering embedding the timeline on the main overturetool.org website. Input is welcome on this.


##  Publications Status and Plans

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business

PVJ is going ot the US (University of Central Florida) for a two month period (April, May). He will be working on translating VDM into JML and use this in relation to his work on code generation of traces.

<div id="edit_page_div"></div>
