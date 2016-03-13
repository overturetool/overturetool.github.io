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
