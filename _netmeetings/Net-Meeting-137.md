---
layout: default
title: Net Meeting 136
date: 27 Aug 2023, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting Default Template

|||
|---|---|
| Date | 27 Aug 2023, 12:00 CEST |
| Participants | XX, YY, ZZ Minutes by XX |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status



## Status of ViennaTalk Development


##  Status of the Overture Components

#### VDMJ

Many improvements made to the QuickCheck plugin for VDMJ (and VSCode console), allowing more efficient value expansions, a "random" value strategy and a "search" strategy that looks for specific expression patterns in each PO that can be turned into counterexamples. Looked at several SMT solvers, with the intention of using them to find counterexamples for POs (or _prove_ there are none) - in particular, alt-ergo, cvc4 and cvc5 (via SMTLIB), Z3, Choco-solver, Mini-zinc and Prolog. All of them are capable of finding counterexamples for simple cases, but the "theories" supported them are not easily capable of expressing something as rich a a VDM-SL PO (in general). It's possible that simple cases might work though (useful in teaching, if not for serious use).

#### VSCode Extension

There would be extension work required to enhance the PO dialog to invoke something like QuickCheck and display the results in a helpful way.

#### LSP Server

The QuickCheck extension mentioned above works for VSCode too, via the execution console.

##  Release Planning

##  Community Development

#### The web appearance of VDM 

Status...

#### Overture Traffic

See download stats on [number of installs](https://marketplace.visualstudio.com/items?itemName=overturetool.vdm-vscode).


#### OVT-22 

Webpage created.

##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

It was agreed that people should review and update this page with their planned papers.

##  Any Other Business


<div id="edit_page_div"></div>

