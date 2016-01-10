---
layout: default
title: Net Meeting 94
date: 10 January 2016, 1300 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

|||
|---|---|
| Date | 2016-01-10 13:00 CET |
| Participants | AA, BB, ..., CC.  Minutes by DD. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1 is carried forward.
* 88-1 is carried forward.
* 93-1 can be closed.
* 93-2 should be carried forward. I forgot about that
* 93-3 can be closed



## Overture Language Board Status

#### topic 1

It was unanimously agreed to extend the number of voting members to nine. The first LB meeting this year will be on Jan 31.


## Status of VDMTools Development

#### topic 1

some description

SCSK and Sony are still negotiating about the VDMTools rights.


##  Status of the Overture Components

#### VDMJ

Some updates committed to the VDMJ (command line) GitHub repo to enable combinatorial test expansion to be done iteratively, which enables far greater numbers of tests to be expanded and executed. Bug #490 fixed.

#### Overture code generation

Recently I (PJ) have been doing more work on code generating VDM-SL traces. By generating, or annotating, the generated Java code with JML annotations it is now possible to give verdicts to the code generated trace tests. This new feature is useful for testing the generated code more exhaustively, but it also is useful for executing trace tests much faster. Unfortunaly I don't have any performance metrics for the code generated traces yet, but I hope to have some soon.

For the past few days I've been working on updating the code generated traces to also include detailed information about trace variables. This should make it possible to derive test stems similar to those used internally by the VDM trace interpreter. These stems can be used for filtering large collections of tests statistically based on the "shapes" of the tests. This part does, however, need more development work and testing.

#### RT to C to generation

A new project has been started on code generating VDM-RT to C. See https://github.com/overturetool/vdm2c  

##  Release Planning

No release plans yet.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

We're up to 739 for 2.3.0, which makes it the most downloaded version of Overture!

#### topic 1
...


##  The next Overture Workshop

A draft application for this is attached to the email announcing this Overture Core NM

##  Publications Status and Plans

Also see [[Planned Publications]].

#### In preparation:

* Item 1
* Item 2

#### In review:

* Item 1

#### In press:

* Item 1


##  Any Other Business

<div id="edit_page_div"></div>
