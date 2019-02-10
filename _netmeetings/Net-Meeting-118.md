---
layout: default
title: Net Meeting 118
date: 10 February 2019, 1200 CEST
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants NB, PGL, TO, LF, JF, KP, PJ |   Minutes by PJ. |


## Review Status of the Action List

A list of actions can here found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22action+net-meeting%22)

No progress.

## Overture Language Board Status

The following people were standing for election:

* Peter W. V. Tran-Jørgensen
* Luís Diogo Couto
* Tomohiro Oda
* Leo Freitas
* Nick Battle
* Ken Pierce
* Anne Haxthausen
* Paul Chisholm

The LB is aiming for an odd number of members for votings reasons. As AH was willing to give up voting rights all eight members were accepted as Language Board members for 2019.

## Status of VDMTools

Some recent bug fixes (December 15).

## Viennatalk Development

A new version of [ViennaTalk](https://github.com/tomooda/ViennaTalk/releases/tag/lille) has been released.

##  Status of the Overture Components

## VDMJ

Paul Chisholm (PC) is currently working on a feature that aims to reduce the efforts needed to document VDM specs. This is achieved by including the documentation in comments such that it can be used to auto-generate a set of HTML pages that act as the specification documentation. In addition to the documentation, a secondary goal is to provide a more convenient way to view specifications using the capabilities of HTML and a browser, avoiding the need for an IDE.

PC's prototype is built on VDMJ4, but doesn’t adhere to the architecture NB introduced in VDMJ4. It covers all of the functional subset of VDM-SL, and a fairly large proportion of operations/statements as well. There are a number of issues that need resolved. The next step is to work on an update with the intent it will become part of the VDMJ baseline,
adhering to the VDMJ4 architecture.

PC has only looked at HTML generation, but NB, LDC and LF have all proposed ideas that widen the scope (e.g. generation of makdown). Longer term, if we get a successful release of VDMJ it would be good to have something like this in Overture.

## vdm-mode

REPL support for [vdm-mode](https://github.com/peterwvj/vdm-mode) is now available. The package, called `vdm-comint` and is also available via [MELPA](https://melpa.org/).

##  Release Planning

#### Overture

We're currently working on implementing the [annotations feature](https://github.com/overturetool/language/issues/46) in Overture, but getting it to work with the IDE is causing a lot of problems that we're currently looking into.

Release dates for 2019 can be found [here](https://github.com/overturetool/overture/milestones).

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### The next Overture workshop

We need input from CG and LC. KP will follow up on this. The workshop page is available [here](http://overturetool.org/workshops/17th-overture-workshop.html).

##  Licensing of Overture source code

We're awaiting MV's input on this.

##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

None.

<div id="edit_page_div"></div>





