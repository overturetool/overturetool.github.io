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
| Participants | PGL, JF, NB, TO, PJ, NP.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 88-1 No progress.

## Overture Language Board Status

#### RM #39 A Primitive Order Relation for Types in VDM-SL

At today's LB NM, all LB members agreed to move this RM to 'Execution'. The execution phase usually involves the development of a draft implementation of the tool feature for testing.

## Status of VDMTools Development

No major update.

##  Status of the Overture Components

#### VDMJ

I've re-added the DBGPReader interface to VDMJ version 4 (I had previously omitted this, since VDMJ is primarily command-line oriented. But now the debugging system is sensibly structured, it was easy to restore it). This means that the VDMJ jar can *almost* be slotted into Overture. That in turn means that there is usually a performance boost, and it gives access to the high-precision build of VDMJ (arbitrary precision arithmetic). There are some problems still, and it only covers execution and debugging, not POG and CT tests. But in principle we ought to be able to define the interfaces for these features too, which gives the possibility of implementing them in multiple VDM "engines".

I also made a small change to Overture to give the execution time of an operation when started via a standard launcher - ie. as well as the result appearing in the Console view, it also says how long that result took to calculate.

#### Overture

I (PJ) have introduced a minor enhancement that affects generation of LaTeX reports on Mac OSX (see issue [625](https://github.com/overturetool/overture/issues/625)). Also, I've introduced some fixes in Java code-generator, one of them affecting code-generation of specifications that use concurrency constructs.

#### VDM2C

We (PJ and VB) are working on extending the coverage of the garbage collector (see issue [87](https://github.com/overturetool/vdm2c/issues/87)). While doing so, VB has found a number of problems in the garbage collector that have already been fixed. We're working towards support the [Alarm example](https://github.com/overturetool/vdm2c/issues/89).

##  Release Planning

The release of Overture 2.4.8 is due by June 5, 2017. If possible, I (PJ) would like suggestions for two future relase dates.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)


##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.


##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business

<div id="edit_page_div"></div>


