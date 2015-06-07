---
layout: default
title: Net Meeting 89
date: 7 June 2015, 1300 CEST
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting 89

|||
|---|---|
| Date | 2015-07-06 13:00 CET |
| Participants | Marcel Verhoef, Nick Battle, Peter Gorm Larsen (chair), Ken Pierce, Shin Sahara, Tomohiro Oda, Hiroshi Sako, Peter Tran-Jørgensen, Shin Sahara, Tomohiro Oda. Minutes by Peter Tran-Jørgensen. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1 No progress. Action remains open.
* 88-1 No progress. Action remains open.

## Overture Language Board Status

The request for clarification on constructors being declared static has been agreed and the LRM will be updated soon. See [RM #32](See https://github.com/overturetool/language/issues/32)

Regarding [RM #27](https://github.com/overturetool/language/issues/27) the LB has discussed a solution to simply allow operation calls in pre-post and generate run-time errors if the state is modified.

In addition Nick has made a "hack" version as a short term solution to the problem. It simply runs the type check of pre and post conditions with the language version set to classic. Nick will push his work to a branch and we'll then set up a build job for it to make it accessible.

Finally KP is updating the community process to mention Requests for Clarificaiton explicitly so we have a workflow for these.

## Status of VDMTools Development

* 2015-03-31 VDMTools 9.0.6 was released.

##  Status of the Overture Components
#### VDMJ

* 2015-05-21 Correction to type check of let constants
* 2015-05-19 Correction to type invariants on char/bool/token
* 2015-06-04 Prevent static constructors and limit constructor calling

#### Isabelle Integration 

v0 of the Isabelle VDM embedding has been completed. At the moment, it's just the CML embedding minus the reactive definitions and with syntax that's closer to VDM. The embedding can be found at https://github.com/isabelle-utp/.

The Codegen-based VDM to Isabelle translator has been updated to generate syntax for the new embedding. Also, it is now available as an IDE plugin. It is still too experimental to release (in fact, it depends on an unreleased version of ASTCreator so it cannot even be built by the build server at the moment).

#### UMinho Student Projects

The Alloy translation is now capable of translating (and slicing) VDM-SL models with types and values. It's also possible to discharge type invariant satisfiability POs via Alloy. Work is proceeding on translating functions at the moment. See https://github.com/EduardoPessoa/PI_MFES for more.

The MC/DC Code Coverage plugin is now integrated in the interpreter via the DBGPv2 protocol. Any model can be intereted and MC/DC data (in the form of an .xml file) will be generated and placed alongside the exiting .covtl files. There is no way to visualize this data at the moment, though that is ongoing work. See https://github.com/jmcPereira/overture for more.

#### VDM-SL to JML generation

PJ has developed a first version of the VDM-SL to JML generator that generates JML annotations corresponding to the pre/post conditions, state invariants and named type invariants in a VDM-SL model. Just like the VDM-SL to Java generator, the JML generator can currently only be invoked via the command-line although the plan is to also make it accessible via the Overture IDE.

##  Release Planning

Anders Telkelsen has been hired as release manager by AU for the INTO-CPS project spending a day a week on this. He will also make releases of the Overture tools in the future. It is expected that a next release will be made after the LB issue 27 have been resolved.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

##  Publications Status and Plans

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

## Removal of old stuff from SourceForge?

MV will try to remove the remaining stuff we have from SourceForge.

##  Any Other Business

None.

<div id="edit_page_div"></div>
