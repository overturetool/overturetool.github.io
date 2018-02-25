---
layout: default
title: Net Meeting 114
date: 25 February 2018, 1200 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | PGL, NP, NB, TO.  Minutes by NB. |

## Review Status of the Action List


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

## Status of VDMTools Development
### VDMTools

* 49 commits since the last NM (Dec 17)
  - measure functions
  - other brush-ups

### ViennaTalk

* Released Viennatalk "Harajuku"
  - VDM Directory Browser: a file-based Browser to be used in conjunction with other tools, such as git, the Overture tool and VDMTools.
  - ViennaUnit: a unit testing framework for VDM Browser

##  Status of the Overture Components
#### VDMJ



##  Release Planning

### Overture

Overture 2.6.0 is out. For details, see the [release notes](https://github.com/overturetool/overture/releases/tag/Release%2F2.6.0).
 Since the release of 2.6.0, the Overture IDE has been updated to [sort classes alphabetically](https://github.com/overturetool/overture/issues/665) in the launch configuration view.
 
Leo from Newcastle has experienced that some of the recent Overture releases, specifically 2.5.6 and 2.6.0, do not cope well with big models on MAC. We haven't had complaints from Windows and Linux users though. PJ and Leo are currently looking into this. Originally, PJ was thinking that this issue might be caused by the particular version of Eclipse that Overture builds against (2.5.4 onward build against Eclipse Neon, previous releases build against Eclipse Neon). We tried to build a 2.6.1-SNAPSHOT version of Overture based on Eclipse Neon, which seems to perform better on MAC Sierra. After spending more time looking into this, it looks like the issue is MAC Sierra itself.

The Overture release we have planned for 2018 are listed [here](https://github.com/overturetool/overture/milestones).

### VDM2C

[VDM2C 0.2.0](https://github.com/overturetool/vdm2c/releases) was released on February 14.

##  Community Development

#### Core NM Dates

Upcoming core meetings are listed [here](http://overturetool.org/netmeetings/).

#### Overture Traffic


##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business




