---
layout: default
title: Net Meeting 137
date: 03 SepSound 2023, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting Default Template

|||
|---|---|
| Date | 03 Sep 2023, 12:00 CEST |
| Participants | HDM, PGL, NB, TO, KP Minutes by HDM |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status

See associated minutes.

## Status of ViennaTalk Development

Specification slicing based on the static program slicing technique is under development.
A slice *Slice[S, op, (v1,...,vn)]* is a pruned AST of the specification *S* that produces the same state with regard to the state variables $v1,...,vn$ by the operation $op$.
Slicing is expected to be used in the impact analysis of modification on a specification, debugging, and reading support.
A major version will be released after the implementation of specification slicing is finished.

No change in VDMTools.

##  Status of the Overture Components

#### VDMJ

Many improvements made to the QuickCheck plugin for VDMJ (and VSCode console), allowing more efficient value expansions, a "random" value strategy and a "search" strategy that looks for specific expression patterns in each PO that can be turned into counterexamples. Strategies are "pluggable", so groups can develop their own and add them to a collection.

Looked at several SMT solvers, with the intention of using them to find counterexamples for POs (or _prove_ there are none) via a QC strategy - in particular, alt-ergo, cvc4 and cvc5 (via SMTLIB), Z3, Choco-solver, Mini-zinc and Prolog. All of them are capable of finding counterexamples for simple cases, but the "theories" supported by them are not easily capable of expressing something as rich as a VDM-SL PO, in general. It's possible that simple cases might work though (like specs that just involve ints and linear arthmetic; useful in teaching, if not for serious use?).

#### VSCode Extension

There would be extension and SLSP protocol work required to enhance the PO dialog to invoke something like QuickCheck on the server and display the results in a helpful way.

#### LSP Server

The QuickCheck extension mentioned above works for VSCode too, but only via the execution console.

##  Release Planning

##  Community Development

#### The web appearance of VDM 

Status. We keep with the previous plan. All members are requested to open issues on improving opportunities and we as a community should also improve the pages.

#### Overture Traffic

See download stats on [number of installs](https://marketplace.visualstudio.com/items?itemName=overturetool.vdm-vscode).


#### OVT-22 

Webpage created.

##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

It was agreed that people should review and update this page with their planned papers.

##  Any Other Business


<div id="edit_page_div"></div>

