---
layout: default
title: Net Meeting 109
date: 2 July 2017, 1200 CEST
---

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | PTJ, NB, NP, TO, LDC, .  Minutes by NB. |

## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 88-1 This is ongoing via the Business Development initiative, and was discussed under Community Development. We need to make sure that Business Development has its own item on the standing agenda.


## Overture Language Board Status

(1): NB and LC have implemented the "order relation" feature in Overture. Next step is to build a standalone version of Overture that contains this feature and make it available for testing

(2) We are working on preparing a process for submitting extensions/changes to the standard librard libraries (similar to what we have for RMs)

With regards to (1), hopefully we can include this feature in the August 14 release of Overture. There will also be some tidy-up changes made to the parser and LRM grammar to make them consistent.

## Status of VDMTools Development

A new release is to be made soon (no other details).

There was a brief discussion about whether it would now be possible to move VDMTools' "external tests" out of a GitHub repository in Aarhus to GitHub, now that VDMTools is open source. PJ and LDC will look at this.

## Status of ViennaTalk Development

#### new debugger
A debugger for auto-genered Smalltalk code is implemented and integrated with the conventional Smalltalk debugger. The debugger shows the both Smalltalk code and VDM-SL source when debugging auto-generated Smalltalk code and highlights the current PC on the both sources.

[![debugger demo](http://img.youtube.com/vi/NLnhBYM46Yc/1.jpg)](http://www.youtube.com/watch?v=NLnhBYM46Yc)

##  Status of the Overture Components

#### VDMJ

A lot of work has been done on RM39 (eq and ord qualifiers for types). This is now in the late stages of testing for both VDMJ and Overture.

Overture has a new experimental feature to identify cyclic dependencies in definitions, which should give more helpful errors than those annoying initialization failures. This needs careful testing before release. It is also available in VDMJ.


##  Release Planning

#### August Release 2.5.0

This is on track and should contain the RM39 eq/ord language changes, as well as the development changes mentioned above.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### Business Development

Without KP or JF on the call, we were unsure of the status of Business Development discussions at NCL. NP will ask for progress, though clearly the workshop in September would be an ideal opportunity to discuss matters face to face.

##  Strategic Research Agenda

The Strategic Research Agenda was not reviewed.

##  Publications Status and Plans

Luis and PJ are planning to submit a paper to SAC 2018 about the AGCO project (harvesting). There have not yet been any EasyChair submissions for Workshop 15, and we were reminded of the deadlines - abstracts by 14th July, papers by 24th July.

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

No AOB was discussed.

Meeting closed at 12:39 CET.
