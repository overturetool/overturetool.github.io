---
layout: default
title: Net Meeting 92
date: 25 October 2015, 1300 CEST
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

#### VDMJ
A few bug fixes to VDMJ, not all of which are in Overture yet:
* 2015-10-19 Remove "unused" warning for traces in SL modules
* 2015-10-06 Recognise \subsubsection in LaTeX files
* 2015-10-01 Check for non-static history operations in static sync clauses


##  Status of the Overture Components

#### Java/JML generator

The coverage of the VDM-SL to Java/JML generator has been extended to cover checking of all the types supported by the Java code generator. This means that it covers checking of basic types, record types, union types, sequences (seq and seq1), sets, maps (map and inmap), optional and named type definitions constrained by invariants.

The generated JML annotations use a small runtime with utility functionality to check if a value respects its type(s). When the code generator plugin is invoked it generates an Eclipse project containing the generated Java/JML and the VDM-to-JML runtime.

This work is available on the pvj/main branch and it will be included in the next release of Overture.

##  Release Planning

#### topic 1

some description


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### topic 1
...


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
