---
layout: default
title: Net Meeting 125
date: 22 November 2020, 1200 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 22 November 2020 |
| Participants  PGL, HDM, KP, TO, JR, SS |   Minutes by TO   |

## Review Status of the Action List

A list of actions can here found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22action+net-meeting%22).

* [Overture annotations] closed. Kenneth replied. The implementation seems somewhere between very difficult and impossible.
* [Meet with legal contact] closed.

PGL will take an action to plan 2021 core net meeting dates.

## Overture Language Board Status

The LB had a small number of participants, and will try to hold another meeting before end of year.
Two RMs are stuck needing Overture work (total functions and annotations as we just discussed).

## Status of VDMTools/ViennaTalk

### Viennatalk

No major change.

### VDMTools

No major change.

##  Status of the Overture Components

### Overture and VDMJ

VDMJ has been bumped to version 4.4.0-SNAPSHOT to allow a release of 4.3.0 to the Maven repository at Aarhus (to support Maestro). A small number of bug fixes have been added.

Overture has been bumped to version 3.0.2. The development version is now tracking Eclipse 2020-12 and should support Java 15 by default. Work in progress to upgrade the maven project shows the pain point is in the codegen/ subprojects...  We are still required to use java 8 to do releases, becasue javadoc generation requires mvn dependencies updates that break codegen. Nevertheless, development maven compilations succeed with Java 11.

### VDM for VSCode

The LSP project within VDMJ now supports protocol extensions that allow Proof Obligation Generation and Combinatorial Testing to be used from VS Code, via extensions developed at Aarhus.

Futa Hirakoba will work on syntax highlighting.

##  Release Planning

HDM takes an action for suggesting the 2021 planned release dates.

##  Community Development

The workshop programme of Overture 18 is available at https://www.overturetool.org/workshops/18th-overture-workshop.html.

##  Licensing of Overture source code

See comments above regarding licensing and the LSP feature.

##  Publications Status and Plans

See [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

None

<div id="edit_page_div"></div>

