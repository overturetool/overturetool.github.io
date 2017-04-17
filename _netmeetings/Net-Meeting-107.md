---
layout: default
title: Net Meeting 107
date: 23 April 2017, 1200 CEST
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


## Status of VDMTools Development

#### topic 1

some description


##  Status of the Overture Components

#### VDMJ

I've re-added the DBGPReader interface to VDMJ version 4 (I had previously omitted this, since VDMJ is primarily command-line oriented. But now the debugging system is sensibly structured, it was easy to restore it). This means that the VDMJ jar can *almost* be slotted into Overture. That in turn means that there is usually a performance boost, and it gives access to the high-precision build of VDMJ (arbitrary precision arithmetic). There are some problems still, and it only covers execution and debugging, not POG and CT tests. But in principle we ought to be able to define the interfaces for these features too, which gives the possibility of implementing them in multiple VDM "engines".

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

~~~


