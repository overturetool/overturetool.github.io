---
layout: default
title: Net Meeting 95
date: 7 February 2016, 13:00 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

|||
|---|---|
| Date | 2016-02-07 13:00 CET |
| Participants | LF, LDC, MV, NB, PGL, SS, TO, VB, PJ.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1 No progress
* 88-1 Some progress. NB, MV and PGL has started discussing this on Github. People are encouraged to take part in the discussion. See https://github.com/overturetool/overturetool.github.io/issues/18 
* 93-2. No progress. PGL will email the people from Porto later today.


## Overture Language Board Status

The LB has suggested moving the core meetings from 13:00 CET to 12:00 CET such that the core meeting is immediately followed by the LB NM. There were objections so the new schedule for the core meetings was accepted. In the future the core meetings will therefore start at 12:00 CET. PGL will update the meeting schedule accordingly.


## Status of VDMTools Development

Nothing new to report.


##  Status of the Overture Components

#### VDMJ
A few bug fixes applied. Build numbers below are VDMJ's, relevant fixes also applied to 2.3.1-SNAPSHOT

* 3.1.1 Build 160112, fixed static instance variable type checks, bug #7
* 3.1.1 Build 160120, fixed problem with inheritance and overloading, bug #8
* 3.1.1 Build 160122, fixed problem with abstract class detection, bug #9
* 3.1.1 Build 160126, fixed problem with class union type checking, bug #10
* 3.1.1 Build 160201, fixed problem with union pattern matching, bug #11
* 3.1.1 Build 160203, fixed problem with ValueListenerLists growth, bug #12

#### New GUI Support in Overture (part of the TEMPO project)

A new framework for developing UIs for VDM models with DukeScript has been developed (see <https://github.com/overturetool/tempo-ui>). A very rough proof of concept demo video is available at <https://dl.dropboxusercontent.com/u/1587375/uidemo.avi>

Two student workers will use this framework to develop a UI for a Traffic Management System model, developed as part of the Tempo project.

#### Removal of Components from the main build

We have begun removing certain components from the Overture build. These components are not maintained by anyone and provide features that nobody uses. They also slow the build down. They are being migrated into stand-alone repositories in the overturetool GitHub org. So far, we have removed the ProB integration and the old GUI Builder (no relation to TempoUI). More may come (such as the new pretty printer and the test framework).



#### On-going AU Overture-related student projects

* Magnus Louvmand and Peter Mathiesen: Work on a small project on improving the auto-completion functionality of Overture. The plan is that this will be followed up with a thesis project after the summer of 2016.
* Kasper Saaby and Rasmus Reimer: Thesis work on a WebIDE for the Overture Platform that may make use of the VDMPad editor. This WebIDE is currently capable of supporting multiple projects, multiple panes in the editor, navigatable outline, syntax highlighting, error reporting on specific lines and initial support for proof obligation generation. This will be demonstrated at the Software Engineering group on the 10th of February. The project will be completed by May 2016.
* Milos Chabada: Thesis work on a GUI Test Automation Environment which will use Overture as a case study.
* Nikolas Bram and Peter Holst: Thesis work with Code Generation Extensions for Overture/VDM towards Typescript/Javascript. The project will be completed by June 2016.
* Steffen Diswal: Thesis work on Code Generation Towards a .NET code contracts and C# Platform. The project will be completed by June 2016.

#### Overture code generation

Lots of internal fixes and extensibility improvements to the code generation platform. All these improvements are based on feedback from the VDM-to-C code generator and the VDM-RT code generator projects. All the technical details related to this are described at <https://github.com/overturetool/overture/issues/491>.

In addition to that we have started updating the Isabelle translator to use the newest code generation platform.

Other than that just some bug fixes in the Java code generator.

The VDM-RT code generator that uses Java RMI to represent the distributed communication between the JVMs, has been updated the use the newest features of the code generation platform. Additionally, work has been started on updating the VDM-RT code generator to use the newest version of the VDM++-to-Java code generator. Finally, it is investigated how to integrate the VDM-RT code generator with the Maven build system.

The VDM to C code generator is progressing well, we are working toward generating one of the INTO-CPS case study models, and are very close (roughly a week).  This VDM model is itself generated from PLC ladder code, so it is very consistent, and moreover contains a simple but important set of language features to target.

##  Release Planning

It is expected that there will be a new release of Overture within the near future. PGL's VDM course will start soon.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://overturetool.org/download/)

#### Website Issues

The https://overturetool.org/ website is built with GitHub Pages Jekyll. GitHub is updating Jekyll and the current rendering engine is being discontinued (May 1) so we need to migrate. The new version looks mostly fine but we need someone to test it before start using it.

#### The old Overture Wiki

 The old wiki (wiki.overturetool.org) is still on-line. PGL will take an action to follow up and talk to IT about taking it off-line.

##  Publications Status and Plans

See [Planned Publications](https://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

TO made ViennaTalk videos - see https://www.youtube.com/watch?v=ZIR3fFPeTz0 and https://www.youtube.com/watch?v=anZoWeA5vd0 . Feedback on these videos are very welcome.

There's now a "Related tools" section on the overturetool website: https://overturetool.org/community/related-tools.html 

<div id="edit_page_div"></div>
