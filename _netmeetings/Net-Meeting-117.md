---
layout: default
title: Net Meeting 117
date: 18 November 2018, 1200 CEST
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | PGL, NB, TO, HM, LC, PJ, LF, KP.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* [88-1](https://github.com/overturetool/overturetool.github.io/issues/18) No progress.

## Overture Language Board Status

The minutes from today's Language Board net meeting are available [here](https://github.com/overturetool/language/wiki/Minutes-of-the-LB-NM,-18th-November-2018).

## Status of VDMTools/Viennatalk Development

* VDMPad server has been moved to http://vdmpad.viennatalk.org/
* The code repository of ViennaTalk has been moved to https://github.com/tomooda/ViennaTalk/
* ViennaTalk Oxford has been released. https://github.com/tomooda/ViennaTalk/releases/tag/Oxford-1
* The source code of ViennaVM is available at https://github.com/tomooda/ViennaVM

##  Status of the Overture Components

Overture [version 2.6.4](https://github.com/overturetool/overture/releases/tag/Release%2F2.6.4) was released on October 29.

Overture's VDM-to-Java code-generator has been updated to support

* VDM-SL's `renamed` construct, see [issue 690](https://github.com/overturetool/overture/issues/690) and
* polymorphic types (simple cases), see [issue 691](https://github.com/overturetool/overture/issues/691).

In addition to that several issues with the code-generator, identified by Leo Freitas, have been fixed.

## vdm-mode

REPL support for [vdm-mode](https://github.com/peterwvj/vdm-mode) is under development. The package, called `vdm-comint`, has been submitted to [MELPA](https://melpa.org/) and is currently in [review](https://github.com/melpa/melpa/pull/5807).

##  Release Planning

#### Overture

Release dates for 2019 can be found [here](https://github.com/overturetool/overture/milestones).

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### The next Overture workshop

The proposal for the next Overture workshop, which is chaired by Luis Couto and Carl Gamble, has been subitted to FM. Once the confirmation has been received, Luis and Carl will start to look for an invited speaker. We expect to know the decision about the proposal by the next core meeting.

##  Licensing of Overture source code

We're awaiting MV's input on this.

##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

None.

<div id="edit_page_div"></div>




