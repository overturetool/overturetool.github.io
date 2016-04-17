---
layout: default
title: Net Meeting 97
date: 17 April 2016, 1200 CEST
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | PGL, MV, NB, LC, TO, LF, PJ.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1 No progess.
* 88-1 No progress.


## Overture Language Board Status


Both RMs have entered the dicsussion phase and are open to input from the public. The LB generally seems supportive of the two RMs.

See https://github.com/overturetool/language/issues/35 and https://github.com/overturetool/language/issues/36 for more information about the RMs.


## Status of VDMTools Development


VDMTools is transferred to Kyushu

## Overture

* The Luna mirrors have been taken down so I changed Overture to build against Mars.
* Next release of Overture requires Java 8.
* A few auto-completion features are under development (student project) which might make it into the next release.

##  Status of the Overture Components

#### VDMJ

Several small changes made to VDMJ and where relevant, Overture. The following taken from VDMJ release notes:

* 3.1.1 Build 160317, fixed problem with sequence comprehensions, bug #16
* 3.1.1 Build 160320, more performance improvements to trace iterators
* 3.1.1 Build 160324, improvement in function instantiation checks, bug #17
* 3.1.1 Build 160404, detect use of type parameter variables, bug #18
* 3.1.1 Build 160408, added runtrace ranges.
* 3.1.1 Build 160409, experimental assertVDM addition to VDMJUnit
* 3.1.1 Build 160410, improvement to trace syntax error reporting
* 3.1.1 Build 160411, added message parameter to assertVDM methods
* 3.1.1 Build 160415, some corrections to check of exports, imports and measures with type parameters

#### ViennaTalk

* added syntax highlighting to VDM Browser.
* added code generation that creates an object of an anonymous class from each module (in addition to scripts and classes).
* performance improvement of auto-generated code (operations).

##  Release Planning

The next release of Overture is scheduled for May 16.


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### New Users

Paul Chisholm is a new user from Airservices Australia (a govt. owned company that builds systems for the airline industry). He's interested both in using VDM modelling internally and using the same techniques in international standards (to do with exchange of air traffic information, since he sits on the Change Control Board for some of these standards). The recent improvements to VDMJ/Overture's type checking messages are a result of Paul's input.

##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.


##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).



##  Any Other Business

* Tomohiro Oda started to collect VDM benchmarks at repository (https://github.com/tomooda/VDM-benchmark). Please consider contributing your executable spec.

<div id="edit_page_div"></div>
