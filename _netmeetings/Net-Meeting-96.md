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
* 93-2 is carried forward.
* 93-3 can be closed.



## Overture Language Board Status

It was unanimously agreed to extend the number of voting members to nine. The first LB meeting this year will be on Jan 31, 11:00 CEST.


## Status of VDMTools Development


SCSK and Sony are still negotiating this.


##  Status of the Overture Components

#### VDMJ

Some updates committed to the VDMJ (command line) GitHub repo to enable combinatorial test expansion to be done iteratively, which enables far greater numbers of tests to be expanded and executed. Bug #490 fixed.

#### Overture code generation

Recently I (PJ) have been doing more work on code generating VDM-SL traces. By generating, or annotating, the generated Java code with JML annotations it is now possible to give verdicts to the code generated trace tests. This new feature is useful for testing the generated code more exhaustively, but it also is useful for executing trace tests much faster. Unfortunaly I don't have any performance metrics for the code generated traces yet, but I hope to have some soon.

For the past few days I've been working on updating the code generated traces to also include detailed information about trace variables. This should make it possible to derive test stems similar to those used internally by the VDM trace interpreter. These stems can be used for filtering large collections of tests statistically based on the "shapes" of the tests. This part does, however, need more development work and testing.

#### RT to C to generation (part of the INTO-CPS project)

A new project has been started on code generating VDM-RT to C. See https://github.com/overturetool/vdm2c  

#### VDMPad

VDMPad is now a part of ViennaTalk, distributed at https://github.com/tomooda/ViennaTalk-doc/releases.

Documentations are https://github.com/tomooda/ViennaTalk-doc/blob/master/README.md

##  Release Planning

No release plans yet.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

We're up to 739 downloads, which makes Overture 2.3.0 the most downloaded version of Overture!


##  The next Overture Workshop

A draft application for this is attached to the email announcing this Overture Core NM

The workshop page is available at http://overturetool.org/workshops/14th-Overture-Workshop.html 

##  Publications Status and Plans

See see http://overturetool.org/publications/PlannedPublications.html 


##  Any Other Business

None.

<div id="edit_page_div"></div>
