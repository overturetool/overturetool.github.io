---
layout: default
title: Net Meeting 101
date: 18 September 2016, 12:00 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | PGL, JF, MV, NP, TO  Minutes by NB |

## Review Status of the Action List

Action 80-1, to update the strategic agenda, was closed after work by PGL and JF. Two slides are availailable from PGL.

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status

The LB failed to meet this time, due to problems forming a stable Skype meeting and two members of the board being away. To avoid similar problems in future, MV created a #language-board channel within the Overture team on Slack. If the rest of the LB agrees, future meetings will be held there.

## Status of VDMTools Development

* still working on changing source files and documentation that refer SCSK as a responsible tool provider.
* Binary distribution will be released before source code.

##  Status of the Overture Components

#### ViennaTalk
* migrated into Pharo 5.0 with a new Spur VM (generated codes run roughly 1.5 times faster)

#### VDMJ

Just one very small tweak to VDMJ (doesn't apply to Overture):
* 3.2.0 Build 160914, Improvement to typechecking of traces.

#### Overture

The following fixes and enhancements have been made since the last core meeting:

* Fixes to the concurrency extension of the Java code generator (feedback received from the [AGCO project](http://eng.au.dk/forskning/forskningsprojekter/mechanical-and-materials-engineering-research-projects/off-line-and-on-line-logistics-planning-of-harvesting-processes/))
* Further work on the [auto-completion feature](https://github.com/overturetool/overture/issues/423)

##  Release Planning

For the next release -- version 2.4.2 (due by October 9, 2016) -- we expect to include a first version of the auto-completion feature. As usual a release candidate will be sent out one or two weeks before the release date.

Furthermore, in response to the request for future release dates, the following milestones have been added to Github:

* 2.4.4 Due by December 5, 2016
* 2.4.6 Due by March 6, 2017
* 2.4.8 Due by June 5, 2017

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://www.overturetool.org/download/)

#### Overture workshop

NP described the intention of the "special session" at the workshop, for the benefit of those who did not attend the previous net meeting. The session will produce a BMC (Business Model Canvas) and a VPC (Value proposition canvas) for formal methods. More information will be distributed to attendees before the event. The SRA will also be an important input here.

##  Strategic Research Agenda

This has been published, and action 80-1 closed. The agenda is currently available as a slide pack from PGL, but we should add the information to the GitHub site shortly.

##  Publications Status and Plans

See [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

NP reminded us that he is leaving West IT Solutions on 1st October to pursue a career as an independent consultant. The team offer him our best wishes for the future.

MV identified an interesting development from a Lithuanian company that intends to produce a qualified code generator for VDM, based on AdaCore QGen technology. We hope that they will be able to use Overture technology and support the community in future.

<div id="edit_page_div"></div>
