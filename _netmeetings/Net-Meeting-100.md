---
layout: default
title: Net Meeting 100
date: 21 August 2016, 1200 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
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


## Status of VDMTools Development
### adopted RM#35 and RM#36 (set1 and seq bind)
### Jenkins server at http://vdmtools.csce.kyushu-u.ac.jp/ci/ for Linux binary package

still needs some fixes to make the source publicly open.


##  Status of the Overture Components

#### ViennaTalk

* adopted RM#35 and RM#36 (set1 and seq bind)
* The Smalltalk Code generator translates all the executable subset of VDM-SL including type invariants, state invariants, pre/post conditions into executable Smalltalk codes.
  - quotes state invariants, pre/post conditions on functions/operations
* The generated code can execute type-bound expressions such as ```forall y:nat1 & y = 1 or x = y or x mod y > 0``` by giving a finite set as an approximate enumeration of the type's values.

#### Component 2

some description

##  Release Planning

#### topic 1

some description


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
