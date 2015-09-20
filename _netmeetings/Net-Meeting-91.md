---
layout: default
title: Net Meeting 91
date: 20 September 2015, 1300 CEST
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 91

|||
|---|---|
| Date | 2015-09-20 13:00 CET |
| Participants | NB, SS, PGL, KP, PJ, TO.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1: Revise Strategic Goals for 2020. No progress.
* 88-1: Consider input for video on VDM. No progress.

## Overture Language Board Status

#### RM 27 (Pure operations)

This RM will officially be completed when Overture 2.3.0 is released. The feature is implemented (and available in the release candiate) and the LRM update has been made as well.


## Status of VDMTools Development

VDMTools is stable.

##  Status of the Overture Components

#### VDMJ

Various small changes and corrections in support of the "pure operations" change.

#### Overture

Work since the previous meeting includes a bug fix in the Java code generator related to map overrides, small tweaks to the testing framework and general code base cleanup. Other than that the work on the pure operations feature has made it into the test branch.

We are in the process of preparing the next release of Overture, version 2.3.0, which among many things includes the new pure operations feature and updated standard examples. The release candidate is available from http://overture.au.dk/overture/test/Build-217_2015-09-17_18-34/

The release candidate was made available on Thurday and so far the only issues reported were already present in the current release (version 2.2.6). See issues https://github.com/overturetool/overture/issues/273 and https://github.com/overturetool/overture/issues/471 

##  Release Planning

All VDM examples and manuals have been updated for the forthcoming 2.3.0 release by PGL. Review comments are welcome.


##  Community Development

On the 1st of October a new project called "TMS Experiment with Mobility in the Physical world using Overture" (TEMPO) will be started as a 12 months experiement supported by the CPSE Labs project. The project partners are West Consulting (with Nico Plat as the coordinator) and Aarhus University (with Peter Gorm Larsen as the principal investigator) and they will be assisted by Newcastle University (with John Fitzgerald as the principal investigator) from the CPSE Labs consortium. This project aim to extend Overture with better support for 2D and 3D animation of VDM models possibly in the form of libraries. At the kick-off meeting in October there will be a 2 day VDM course that will be open to other Dutch industrial parties.

In addition new MSc thesis projects in Aarhus will carry out different extensions to Overture. This includes a project on code generation towards the Rust programming language as well as a project performing a WebIDE for Overture.

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

##  Publications Status and Plans

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

TO is currently working on integrating VDMPad and other animation prototyping environments into a library named ViennaTalk. The documentation is available at https://github.com/tomooda/ViennaTalk-doc/ and the source code is available at http://smalltalkhub.com/#!/%7Etomooda/ViennaTalk  . Among several things, Vienna Talk includes a simple Smalltalk-styled browser for VDM-SL and an environment for prototyping UIs.

<div id="edit_page_div"></div>
