---
layout: default
title: Net Meeting 130
date: 7 November 2021, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Overture NetMeeting 130

|||
|---|---|
| Date | 07 November 2021, 12:00 CEST |
| Participants | PGL, KP, NB, TO, MV Minutes by HDM  |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status

#### Open Requests

The full list of open issues is [here](https://github.com/overturetool/language/issues).

Progress was made on clarifying/unifying the let/def behaviours among different tools. 


## Status of VDMTools/ViennaTalk

#### VDMTools

No major change.

#### ViennaTalk

There will be a major release this year to adopt the new debugger architecture of the updated major version of Pharo Smalltalk.
The refactoring browser will also be available in the planned major release.

##  Status of the Overture Components


### VDM for VSCode

New release for the [TR-007: Overture VDM VSCode Extension: User Guide](https://github.com/overturetool/documentation/raw/editing/documentation/UserGuideVDMVSCode/VDMVSCodeUserGuide.pdf) made last month.

There is a new VSCode 1.2.2 in preparation. This includes "exception breakpoints" (the ability to stop on particular VDM "exit" statements), and a new LSP HLD to describe the basic design of the language server. There will also be support for "code lenses" that appear above functions or operations, which allow them to be launched or debugged without the tedious process of setting up a launch configuration. It will also support remote control operation of a VDM specification. And lastly, it supports the simple inclusion of plugins to handle extended (ie. unknown!) LSP requests - this is how Leo has managed to incorporate the Isabelle translation. You simply add the plugin jar to the classpath.

##  Release Planning


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://www.overturetool.org/download/)

For VSCode see status on [the extension page](https://marketplace.visualstudio.com/items?itemName=jonaskrask.vdm-vscode)

#### Overture Workshop

 We had 16 participants with us at Aarhus University and 38 attendees in the online session. The slides are now available in the [workshop page](https://www.overturetool.org/workshops/19th-overture-workshop.html). The most important outcome was the idea of a hackathon to be held next year! 20th workshop should also be memorable and maybe organized on 2023.

##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting. No progress this time.


##  Publications Status and Plans

[Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html)

##  Any Other Business

* Moving away from GPLv3 licensing. The problem remains. It was decided to close the overture issue, but further discussion is needed.
* New dates for meetings (post-meeting suggestion):
    * 27 Feb
    * 22 May
    * 28 Aug
    * 27 Nov
