---
layout: default
title: Net Meeting 105
date: 12 February 2017, 1200 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | PGL, CT, HM, KP, NB, MV, PJ, SH, SS, TO, JF. Minutes by KP. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 88-1 (Consider input for video on VDM): No progress.


## Overture Language Board Status

#### LB 2017

Paul Chisholm agreed to join, so there are 7 members (KP, NB, JP, AH, TO, LDC, PC). KP remains Convener and PJ remains as Secretary.

#### Working Groups

The LB will form "working groups" around key issues that don't consititute RMs. Each group has a GitHub issue, a champion from the LB to lead it and a standing item on the agenda. 

Initial working groups are for [Proof Obligation Generation](https://github.com/overturetool/language/issues/33) and for the [Working Groups](https://github.com/overturetool/language/issues/41). Once the latter is updated, another will form to look at the process of handling libraries from the Community.

##### RMs

There is one RM that is now open for community discussion [Equality and Order Clauses for Type Definitions](https://github.com/overturetool/language/issues/39)

## Status of ViennaTalk

#### Support for implicit/extended explicit functions/operations

Smalltalk code generators now generate codes for implicit functions/operations which simply signal ViennaImplicitEvaluation exception.
This update will enable developers to handle the evaluation of implicit functions/operations by arbitrary handlers.
Pretty printing implicit definitions and extended explicit definitions is also available.

## Status of VDMTools Development

See Documentation below.

##  Status of the Overture Components

#### VDMJ

A small change was made to VDMJ 4 (and ported to Overture) that can give a noticable interpreter performance improvement in specifications that internally throw a lot of exceptions. This occurs naturally in specs with complex union types or which perform a lot of complex pattern matching. The saving is to avoid building a Java native stack trace to attach to these exceptions, which is not needed because they are always caught and handled. In specifications with traces a 20% performance improvement has been seen.

#### Overture

As part of implementing the performance improvement described above, Overture has been updated to use AstCreator version 1.6.10. In addition, Casper Thule has started working on updating the VDM-to-Isabelle/HOL translation to support the newest Isabelle VDM embedding.

#### VDM2C

Curently, we're working on implementing a VDM2C garbage collector. Hopefully, we'll have a prototype version available soon.

#### Definition Jumping

NB identified that fixing the following bug would be of high value: [F3 Open Declaration sometimes fails](https://github.com/overturetool/overture/issues/608). PJ to look into increasing the priority of this fix.

## Documentation

#### Japanese LRM

Japanese translation of the Language Reference Manual is started to catch up updates and improve translation accuracy.

#### VDMTools User Manual

The VDMTools user manual is not up to date with respect to the categories used for proof obligations generated. We need someone to update this. This was noted as useful input to the POG WG of the LB (see above). 

#### Overture User Manual

HM identified that the UML translation and LaTeX generation secitons could be improved. PGL wrote these and KL wrote the UML translation. HM will try to improve these where possible in discussion with PGL and KL.

#### Differences Between Overture and VDMTools

There's a subtle difference in pattern matching between Overture and VDMTools in traces. Both are legal behaviors by the LRM. NB and TO to discuss offline. See also [this list](https://github.com/overturetool/language/wiki/Differences-between-Overture-and-VDMTools).

##  Release Planning

Next Overture release is due March 6, 2017. See [issue list](https://github.com/overturetool/overture/issues?q=is%3Aissue+is%3Aclosed+milestone%3A2.4.6)

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### Business Model

NP and MV met and worked on the output from the business model workshop in Cyprus. Results are here [Business model](https://github.com/overturetool/overture/wiki/Business-model). JF approached the Business development Unit at Newcastle and got the following:

> Summary: There appears to be an opportunity but the appetite to take this further needs to be tested by modelling a realistic first step and then looking at what resource technically, manually and financially will be estimated to achieve this. One thing to remember and as I get a feel for the user group, many are academic it would appear and a ‘soft start’ within the safety of the University community can be an option. This would not involve any great risk and most of the legal, insurance, process, governance structures exist in universities (and they often have commercial teams). An opportunity to test the market without jumping into the void. Would have to be with agreement of the University but could allow sanity check of models and viability prior to launching. Again there would need to be lead institution and pretty much all of the above applies but it may help to see what may be possible and then refine an approach.
>
> Main question is what do you want to achieve. Happy to talk further.

MV to set up a Doodle to find time for a separate net-workshop on this matter.

##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.

##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

<div id="edit_page_div"></div>


