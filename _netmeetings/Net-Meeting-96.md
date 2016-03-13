---
layout: default
title: Net Meeting 96
date: 13 March 2016, 1200 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | CT, HS, KP, LDC, MV, NB, PGL, SS, TO, VB, PJ.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 93-2 PGL has finished this.
* 88-1 No progress..
* 80-1 No progress.


## Overture Language Board Status

Two new RMs were submitted last night. Both of these have been advanced and briefly discussed at today's LB NM. See https://github.com/overturetool/language/wiki/Minutes-of-the-LB-NM%2C-13th-March-2016-2016 for details.

Other than that the LB is having a meeting with Simon torrow about the first deliverable about the VDM UTP semantics.


## Status of VDMTools Development

The negotiation between Kyushu Univ and SCSK went forward. They are still in transaction, but the process is moving forward.


#### Overture webIDE

The pilot study is available at http://overturecloudide.privatedns.org, where only VDM-SL is supported at the moment.
The features supported are:

- Creation and editing of projects, directories, and files.
- Import of sample models.
- Generation of project outline and pog.
- Linting of models.
- Very limited code completion.
- Debugging of models.

There are still issues on the backend concerning integration with the Overture core, where parsing and type checking sometimes produces concurrecy exception, such as ConcurrentModificationException when lists are iterated.

The code for both the frontend and backend is available at https://bitbucket.org.

Frontend: https://bitbucket.org/overturewebide/overture-webide
Backend: https://bitbucket.org/overturewebide/overture-webide-playapi

## Status of ViennaTalk Development

#### Overture

We're starting to move towards Java8. Overture 2.3.2 is the last version of Overture that will support Java7.

#### Smalltalk code generators for VDM-SL

* Live class generation for flat/modular specification, and
* Script generation for flat specificatio or single module

[![ViennaTalk: Code Generation](http://img.youtube.com/vi/sDXiM5yvTxw/1.jpg)](http://www.youtube.com/watch?v=sDXiM5yvTxw)

##  Status of the Overture Components

#### VDMJ

The following bugs have been fixed since the last NM (bug numbers refer to VDMJ's issues). Where applicable, the same bugs have been fixed in Overture.

* 3.1.1 Build 160211, fixed second problem related to bug #9
* 3.1.1 Build 160221, fixed problem with variable name shaped reduction
* 3.1.1 Build 160225, fixed problem with POs of record unions, bug #13
* 3.1.1 Build 160303, fixed problem with type check of records, bug #14
* 3.1.1 Build 160304, fixed more general problem with multi-type checking, bug #15

##  Release Planning

Overture 2.3.2 is finally out.

Wrt release planning PGL has suggested some dates to be targeted for the rest of the year.


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)


##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.


##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business

For licensing of Overture PGL has started a discussion in a small subgroup about whether it would make sense to host it (and VDMTools) under an OpenModelica like construction.

<div id="edit_page_div"></div>
