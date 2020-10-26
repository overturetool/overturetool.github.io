---
layout: default
title: Net Meeting 92
date: 25 October 2015, 1300 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 2015-10-25 13:00 CET |
| Participants | PGL, TO, NB, PJ, VB, SS, JF, HS, MV, LF.  Minutes by PJ. |

Welcome to the two new attendees: Victor Bandur (VB) who is a new member of the Aarhus University software engineering group and Leo Freitas (LF) from the University of Newcastle (UNEW).

## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1: Revise Strategic Goals for 2020. No progress.
* 88-1: Consider input for video on VDM. No progress.

## Overture Language Board Status

The pure operation RM (RM 27) is now completed. Other than that there has been some interest in the UTP model of the VDM semantics.

The next LB meeting is the last meeting of 2015 and every member will step down and there will be a new election round. This will be announced via the core mailing list after the next LB NM, so all community members have a chance to run for election.


## Status of VDMTools Development

VDMTools is stable.
Dr. Kei Sato is trying to add the pure operations feature.

##  Status of the Overture Components

#### VDMJ
A few bug fixes to VDMJ, not all of which are in Overture yet:

* 2015-10-19 Remove "unused" warning for traces in SL modules
* 2015-10-06 Recognise \subsubsection in LaTeX files
* 2015-10-01 Check for non-static history operations in static sync clauses


#### Java/JML generator

The coverage of the VDM-SL to Java/JML generator has been extended to cover checking of all the types supported by the Java code generator. This means that it covers checking of basic types, record types, union types, sequences (seq and seq1), sets, maps (map and inmap), optional and named type definitions constrained by invariants.

The generated JML annotations use a small runtime with utility functionality to check if a value respects its type(s). When the code generator plugin is invoked it generates an Eclipse project containing the generated Java/JML and the VDM-to-JML runtime.

This work is available on the pvj/main branch and it will be included in the next release of Overture.

##  Release Planning

Nothing to report.


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)


##  Publications Status and Plans

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business

In the INTO-CPS project there is an intent of making an open source licensing policy inspired by the one from OpenModelica (see https://openmodelica.org/home/consortium). This allows companies who are members at the right level and who are actively supporting the further development and maintenance have an opportunity for making use of the open source code inside their own commercial extensions. Peter Gorm Larsen feels that it would be beneficial for the future commercial use of Overture to change its license to also be a part of this. It would be convenient to have a first initial discussion about that.

Hansen Salim has started on his PhD at UNEW. Hopefully he will be contributing to the AADL+ASN.1+VDM agenda. Right now he is working on learning AADL and ASN.1.
 
<div id="edit_page_div"></div>
