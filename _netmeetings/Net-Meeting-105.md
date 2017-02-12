---
layout: default
title: Net Meeting 105
date: 12 February 2017, 1200 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | AA, BB, ..., CC.  Minutes by DD. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 10-1 some progress...
* 11-4 no progress...
* 15-2 is now closed.
* ...


## Overture Language Board Status

#### topic 1

some description


## Status of ViennaTalk

#### support for implicit/extended explicit functions/operations

Smalltalk code generators now generate codes for implicit functions/operations which simply signal ViennaImplicitEvaluation exception.
This update will enable developers to handle the evaluation of implicit functions/operations by arbitrary handlers.
Pretty printing implicit definitions and extended explicit definitions is also available.

## Status of VDMTools Development

#### LRM
Translation of the Language Reference Manual is started to catch up updates and improve translation accuracy.

##  Status of the Overture Components

#### VDMJ

A small change was made to VDMJ 4 (and ported to Overture) that can give a noticable interpreter performance improvement in specifications that internally throw a lot of exceptions. This occurs naturally in specs with complex union types or which perform a lot of complex pattern matching. The saving is to avoid building a Java native stack trace to attach to these exceptions, which is not needed because they are always caught and handled.

#### Overture

As part of implementing the performance improvement described above, Overture has been updated to use AstCreator version 1.6.10. In addition, Casper Thule has started working on updating the VDM-to-Isabelle/HOL translation to support the newest Isabelle VDM medding.

#### VDM2C

Curently, we're working on implementing a VDM2C garbage collector. Hopefully, we'll have a prototype version available soon.

##  Release Planning

Next Overture release is due March 6, 2017.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### topic 1
...


##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.


##  Publications Status and Plans

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

#### In preparation:

* Item 1
* Item 2

#### In review:

* Item 1

#### In press:

* Item 1


##  Any Other Business

<div id="edit_page_div"></div>


