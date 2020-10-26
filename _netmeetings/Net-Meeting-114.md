---
layout: default
title: Net Meeting 114
date: 25 February 2018, 1200 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | PGL, NB, KP, PJ, JF.  Minutes by PJ. |

## Review Status of the Action List

* [88-1](https://github.com/overturetool/overturetool.github.io/issues/18): No progress.

## Overture Language Board Status

The following people have stated their desire to join the Language Board for 2018:

* Peter W. V. Tran-Jørgensen
* Paul Chisholm
* Ken Pierce
* Anne Haxthausen
* Nick Battle
* Tomohiro Oda
* Luís Diogo Couto

A few things to note:

1. The LB will be formed at the core meeting on February 25th, 2018.

2. We aim to have an odd (yet flexible) number of members for voting reasons. If an even number of people volunteer, an election process will be started at the core meeting on February 25th.

3. The [meeting dates](https://github.com/overturetool/language/wiki/Language-Board-NetMeeting-Minutes#meeting-dates-for-2018) for 2018 have already been planned.

Update: The LB for 2018 is:

* Peter W. V. Tran-Jørgensen
* Paul Chisholm
* Ken Pierce
* Anne Haxthausen
* Nick Battle
* Tomohiro Oda
* Luís Diogo Couto

## Status of VDMTools Development
### VDMTools

* 49 commits since the last NM (Dec 17)
  - measure functions
  - other brush-ups
  - TO and Dr. K are working on making a new release

### ViennaTalk

* Released Viennatalk "Harajuku"
  - VDM Directory Browser: a file-based Browser to be used in conjunction with other tools, such as git, the Overture tool and VDMTools.
  - ViennaUnit: a unit testing framework for VDM Browser

##  Status of the Overture Components
#### VDMJ



##  Release Planning

### Overture

Overture 2.6.0 is out. For details, see the [release notes](https://github.com/overturetool/overture/releases/tag/Release%2F2.6.0).
 Since the release of 2.6.0, the Overture IDE has been updated to [sort classes alphabetically](https://github.com/overturetool/overture/issues/665) in the launch configuration view. Also, [issue 666](https://github.com/overturetool/overture/issues/666) has been fixed. Finally, PGL fixed one of the standard examples, which did not pass type-checking due to a recent improvement related to type-checking of imports in VDM-SL.
 
Leo from Newcastle has experienced that some of the recent Overture releases, specifically 2.5.6 and 2.6.0, do not cope well with big models on MAC. We haven't had complaints from Windows and Linux users though. PJ and Leo are currently looking into this. Originally, PJ was thinking that this issue might be caused by the particular version of Eclipse that Overture builds against (2.5.4 onward build against Eclipse Neon, previous releases build against Eclipse Neon). We tried to build a 2.6.1-SNAPSHOT version of Overture based on Eclipse Neon, which seems to perform better on MAC Sierra. After spending more time looking into this, it looks like the issue is MAC Sierra itself.

The Overture release we have planned for 2018 are listed [here](https://github.com/overturetool/overture/milestones).

### VDM2C

[VDM2C 0.2.0](https://github.com/overturetool/vdm2c/releases) was released on February 14.

##  Community Development

We disussed the opportunity to create an online course on VDM for newcomers. Something that could potentially be hosted by an online course service. It would be a lot of work, so if we go for this we would need to split the tasks between the different stakeholders.

Steve Riddle from Newcastle has made a MOOC (Massive Open Online Course) on cyber-security. Steve might be able to advise on a similar strategy for VDM. It's very high-level elementary stuff, but it does get thousands of participants. A teacher need to interact with participants who pay, but you can limit this. We're talking about thousands of attendees, so it's not interaction at the individual level. There can be some use of forums, etc. KP will chat to Steve about this.

#### Core NM Dates

Upcoming core meetings are listed [here](https://overturetool.org/netmeetings/).

##  Publications Status and Plans

See [Planned Publications](https://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

NB will be in Newcastle next week.


