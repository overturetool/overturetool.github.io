---
layout: default
title: Net Meeting 140
date: 26 May 2024, 1200 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 26 May 2024, 12:00 CEST |
| Participants | XX, YY, ZZ Minutes by ZZ |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status

* The LB will be elected at the core meeting, and the first LB meeting will be held after the core meeting.

## Status of ViennaTalk Development

* ViennaTalk Lyon has been released
  - Refactoring Browser is renewed with new features and new UIs.
    - Specification slicing to highlight fragments of specification that may affect the execution of the given expression/statement.
    - Playground with state variables table to evaluate an expression or to execute a statement/trace.
    - EpiLog to automatically journals modifications and executions, and to manage versions of the source and values of state variables 
  - Typechecker is built in.
  - Transpiler can be used as an alternative interpreter.
  - Transpiler generates traces
  - the base platform is migrated to Pharo 12

##  Status of the Overture Components

#### VDMJ

* Fixed Java 20+ bug, caused by the deprecation of the ThreadDeath exception
* Updated documentation and wiki for recent enhancements
* Allow various operators (like `duration` and starting threads) to be prohibited during spec initialization.

#### VSCode Extension

* Enhanced the POG GUI to include QuickCheck features, allowing counterexamples to be executed/debugged directly from the GUI.
* Simplify and unify the VSCode classpath handling for libraries, plugins and annotations, allowing them all to be configured via the UI.
* A beta release VSIX is available for trying :-)

#### LSP Server

##  Release Planning

##  Community Development

#### The web appearance of VDM 

#### Overture Traffic

See download stats on [number of installs](https://marketplace.visualstudio.com/items?itemName=overturetool.vdm-vscode).

#### OVT-22 

15th  of July is the deadline for paper submissions...
Need to check easychair is up and all the fine details.


##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).



##  Any Other Business

TBA


<div id="edit_page_div"></div>

