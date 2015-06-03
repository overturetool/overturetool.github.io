---
layout: default
title: Net Meeting 89
date: 7 June 2015, 1300 CEST
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

#### VDMJ

* 2015-05-21 Correction to type check of let constants
* 2015-05-19 Correction to type invariants on char/bool/token

## Status of VDMTools Development

#### topic 1

some description


##  Status of the Overture Components

#### Isabelle Integration 

v0 of the Isabelle VDM embedding has been completed. At the moment, it's just the CML embedding minus the reactive definitions and with syntax that's closer to VDM. The embedding can be found at https://github.com/isabelle-utp/.

The Codegen-based VDM to Isabelle translator has been updated to generate syntax for the new embedding. Also, it is now available as an IDE plugin. It is still too experimental to release (in fact, it depends on an unreleased version of ASTCreator so it cannot even be built by the build server at the moment).

#### UMinho Student Projects

The Alloy translation is now capable of translating (and slicing) VDM-SL models with types and values. It's also possible to discharge type invariant satisfiability POs via Alloy. Work is proceeding on translating functions at the moment. See https://github.com/EduardoPessoa/PI_MFES for more.

The MC/DC Code Coverage plugin is now integrated in the interpreter via the DBGPv2 protocol. Any model can be intereted and MC/DC data (in the form of an .xml file) will be generated and placed alongside the exiting .covtl files. There is no way to visualize this data at the moment, though that is ongoing work. See https://github.com/jmcPereira/overture for more.

##  Release Planning

#### topic 1

some description


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### topic 1
...


##  Strategic Research Agenda

The Strategic [[Research]] Agenda is reviewed every other NetMeeting.


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
