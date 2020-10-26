---
layout: default
title: Net Meeting 116
date: 9 September 2018, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | PGL, TO, PJ, NP, KP, MV, HM.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* [88-1](https://github.com/overturetool/overturetool.github.io/issues/18) No progress.

## Overture Language Board Status

[RC 44, "Total Functions"](https://github.com/overturetool/language/issues/44) was discussed at today's Language Board net meeting. A summary of the discussion is available [here](https://github.com/overturetool/language/wiki/Minutes-of-the-LB-NM,-9th-September-2018).

## Status of VDMTools/Viennatalk Development

None.

##  Status of the Overture Components

[Issue 686](https://github.com/overturetool/overture/issues/686) has been fixed.

In addition, some type-checker/interpreter issues have been reported recently. Nick will look into this when he returns to the UK.

## vdm-mode.el *NEW TOOL*

[vdm-mode.el](https://github.com/peterwvj/vdm-mode) is an Emacs package for writing VDM specifications using VDM-SL, VDM++ and VDM-RT. It currently supports the following features:

* Syntax highlighting and editing
* Replacement of ASCII syntax (e.g. lambda) with more aesthetically looking symbols (e.g. λ) using prettify-symbols-mode
* On the fly syntax checking using Flycheck
  * Integration with VDMJ and Overture
* VDM YASnippets

##  Release Planning

#### Overture

Next release of Overture, [version 2.6.4](https://github.com/overturetool/overture/milestone/40), is due October 19.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://overturetool.org/download/)

##  Licensing of Overture source code

Based a recent email sent to the core mailing list by MV, there was a discussion about the best licensing strategy to use for Overture in the future. The problem is that GPL v3 might be too restrictive for our purposes: GPL v3 is quite specific about what you can do (and cannot do) when you build applications that include other code. For example, formally we cannot use libraries and plugins that are not compliant to GPLv3 in any applications built with Overture code. Furthermore, most of Eclipse is released under EPL (a weak copyleft license) that is NOT compatible with GPL.

We switched to GPLv3 roughly when we moved from sourceforge to Github with the argument that it would ensure that downstream users that either modify Overture or build tools on top of would be required to open source these changes or derived products. However, we never considered the Eclipse impact properly and ignored it, until it was spotted by a third party.

There are to ways to address this. Either we

* change the GPLv3 licences to add a clause that this tainting of libraries used does not apply. but (1) this requires to keep an explicit list of all libraries used - every time the tool changes! and (2) all copy right holders (people that actually wrote the code) must agree to this licence change (yes, each time!) or

* move away from GPLv3 towards another (open source) license agreement. This also requires the same iteration with all copyright holders, but if we do it correctly, we only have to do it once. Caveat: this also applies to VDMJ, for which FUJITSU is the copyright holder. Regarding this option there's a big catch: ALL copyright holders must agree to the change, you cannot make a partial move. Alternative licenses would be EPL (weak copyleft - implictly compatible with Eclipse but not necessarily other tool frameworks) or BSD two-clause.

The license change process is roughly as follows:

* we make up our mind on our license policy

* we open a discussion phase to allow community feedback on the proposed change

* if there is no opposition, we implement the change, as follows
  * we ask all copyright authors for written permission (i.e. via a git tracker) that they agree to the license change
  * if all authors have agreed, we make a final archive of the current version (that will be available as GPLv3 for eternity as we cannot revoke what is out there)
  * we make a new release of Overture, under the new license regime

Based on the discussion, people seem to lean towards a more permissive license. Concretely, it was proposed to consider BSD two-clause and the impact that has on the community.

##  Publications Status and Plans

See [Planned Publications](https://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

None.

<div id="edit_page_div"></div>




