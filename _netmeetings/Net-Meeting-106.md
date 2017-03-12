---
layout: default
title: Net Meeting 106
date: 12 March 2017, 1200 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting Default Template

|||
|---|---|
| Date | 28 January 2015, 13:00 CET |
| Participants | AA, BB, ..., CC.  Minutes by DD. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 88-1 (Consider input for video on VDM): No progress.

## Overture Language Board Status

#### RM39: Equality and Order Clauses for Type Definitions

There has been no Community input on RM39. Please join the discussion here https://github.com/overturetool/language/issues/39#issuecomment-267935090 before the next core meeting (April 23rd 2017).

#### Working Groups

The LB have established two working groups (WGs) to progress cross-cutting language and tool issues. The idea is to have a leader for each group and an issue on the tracker as the main place for dicsussion. LB and Community members can then join groups to help progress things. There will be a wiki page listing the groups, leaders, members and links to each issue. The first two WGs are POG led by NB and community libraries led by KP. 

#### Wiki pages

The LB will undertake a refresh of the wiki pages to reflect the new WG idea and tidy up some problems that occured in the move to github.

## Status of VDMTools Development

No members from Japan could attend today so this item was not discussed.

##  Status of the Overture Components

#### VDMJ

4.0.0 Build 170308, Improved support for multi-threaded debugging

Support for command-line multi-threaded debugging in VDMJ has always been poor. This fix enables such debugging to be roughly the same as the remote debugging client (ie. Overture's debugger).

#### VDM2C

We (VB, PJ and MH) are happy to announce the first major release of the VDM to C code generator.  This version addresses the critical issue of RAM and flash usage on the embedded microcontrollers used in INTO-CPS.  The generated code makes use of a garbage collector, which must be called manually.  Instructions on how to do this are included in the [release notes](https://github.com/overturetool/vdm2c/releases/tag/Release%2F0.1.0).  This version does not yet include support for the distributed constructs of VDM-RT.  The next release of the Overture FMU exporter will include this release of VDM2C.

#### Overture

We (KL and PJ) have added a [Frequently Asked Questions (FAQ) section](http://overturetool.org/faq/) to the overturetool.org website. Currently it addresses the issues that MacOS Sierra users may experience when they try to open a freshly downloaded version of Overture.

##  Release Planning

Overture version 2.4.6 is out. See the [release notes](https://github.com/overturetool/overture/releases/tag/Release%2F2.4.6) for a description of what has changed since the last release.

Next release of Overture, version 2.4.8, is due by June 5, 2017.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### Business Model

We welcomed the input from Graeme Young, but are not clear exactly what the next steps should be, nor exactly on the goal (making an income from Overture, update of formal modelling, etc.). The suggestion is to have a dedicated workshop, and perhaps ask Graeme to clarify what he would need us to present to him as a next iteration on the idea, to focus the outcome of such a workshop. KP will try to arrange to meet Graeme with NP and PGL via video link.

##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.

##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

<div id="edit_page_div"></div>
