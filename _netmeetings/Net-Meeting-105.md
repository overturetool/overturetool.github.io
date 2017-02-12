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
| Participants | PGL, CT, HM, KP, NB, MV, PJ, SH, SS, TO. Minutes by KP. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 88-1 (Consider input for video on VDM): No progress.


## Overture Language Board Status

#### LB 2017

Paul Chisholm agreed to join, so there are 7 members (KP, NB, JP, AH, TO, LDC, PC). KP remains Convener and PJ remains as Secretary.

#### Working Groups

The LB will form "working groups" around key issues that don't consititute RMs. Each group has a GitHub issue, a champion from the LB to lead it and a standing item on the agenda. 

Initial working groups are for [Proof Obligation Generation](https://github.com/overturetool/language/issues/33) and for the [Working Groups](https://github.com/overturetool/language/issues/41). Once the latter is updated, another will form to look at the process of handling libraries from the Community.

##### RMs

There is one RM that is now open for community discussion [Equality and Order Clauses for Type Definitions](https://github.com/overturetool/language/issues/39)

## Status of ViennaTalk

#### Support for implicit/extended explicit functions/operations

Smalltalk code generators now generate codes for implicit functions/operations which simply signal ViennaImplicitEvaluation exception.
This update will enable developers to handle the evaluation of implicit functions/operations by arbitrary handlers.
Pretty printing implicit definitions and extended explicit definitions is also available.

## Status of VDMTools Development

#### LRM
Translation of the Language Reference Manual is started to catch up updates and improve translation accuracy.

It seems that the user manual is not up to date with respect to the categories used for proof obligations generated. We need someone to update this.

##  Status of the Overture Components

#### VDMJ

A small change was made to VDMJ 4 (and ported to Overture) that can give a noticable interpreter performance improvement in specifications that internally throw a lot of exceptions. This occurs naturally in specs with complex union types or which perform a lot of complex pattern matching. The saving is to avoid building a Java native stack trace to attach to these exceptions, which is not needed because they are always caught and handled.

#### Overture

As part of implementing the performance improvement described above, Overture has been updated to use AstCreator version 1.6.10. In addition, Casper Thule has started working on updating the VDM-to-Isabelle/HOL translation to support the newest Isabelle VDM embedding.

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


