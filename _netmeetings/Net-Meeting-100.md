---
layout: default
title: Net Meeting 100
date: 21 August 2016, 1200 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | PGL, JF, SH, PJ, LDC, TO, NP, SS, TF (Tommaso Fabbri).  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1 No progress. JF is visiting PGL this week so hopefully they will find time to work on this.
* 88-1 NP is suggesting to take a structured approach to this (NP will add the details about this to the Github tracker later). In particular, Nico is suggesting to have a session about this at the next Overture workshop.


## Overture Language Board Status

See the minutes from today's [LB NM](https://github.com/overturetool/language/wiki/Minutes-of-the-LB-NM%2C-21st-August-2016)


## Status of VDMTools Development
* Adopted RM#35 and RM#36 (set1 and seq bind)
* Jenkins server at http://vdmtools.csce.kyushu-u.ac.jp/ci/ for Linux binary package
* Work in progress: It is expected that the VDMTools sources will be publicly available by the end of the year

##  Status of the Overture Components

#### ViennaTalk

* Adopted RM#35 and RM#36 (set1 and seq bind)
* The Smalltalk Code generator translates all the executable subset of VDM-SL including type invariants, state invariants, pre/post conditions into executable Smalltalk codes.
  - quotes state invariants, pre/post conditions on functions/operations
* The generated code can execute type-bound expressions such as ```forall y:nat1 & y = 1 or x = y or x mod y > 0``` by giving a finite set as an approximate enumeration of the type's values.

#### VDMJ

VDMJ has been updated to include RMs 35 and 36 (set1 and seq binds), and released as version 3.2.0. The same changes have been ported to Overture, and will be included in the next release, once the LRM has been updated.

#### Overture

In addition to RMs 35 and 36 Overture has been updated to build against Eclipse Neon.

##  Release Planning

Overture 2.4.0 will be released on August 30, 2016.
A release candidate will be sent out some time next week.

See [issues closed since last release](https://github.com/overturetool/overture/issues?utf8=%E2%9C%93&q=is%3Aclosed%20is%3Aissue%20milestone%3Av2.4.0%20)


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://www.overturetool.org/download/)

#### The C code generator

Tommaso Fabbri is working on connecting Overture to TASTE in collaboration with ESA. A paper that describes this project will be submitted to the Overture workshop.

#### Overture workshop

The local organisers have offered us to take part in a general workshop dinner (for all workshops) on the Monday evening, but it will cost  40 euros per person. PGL will ask the local organisers if the dinner is mandatory for all participants if we accept this offer.


##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.


##  Publications Status and Plans

See [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).


##  Any Other Business

None.

<div id="edit_page_div"></div>
