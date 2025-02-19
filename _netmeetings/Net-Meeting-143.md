---
layout: default
title: Net Meeting 143
date: 23 February 2025, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting 142

|||
|---|---|
| Deadline | 23 February 2025, 12:00 CEST |
| Participants | See git log |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status

## Status of ViennaTalk Development

* ViennaTalk *Waikiki* has been released on Jan 7, 2025

   - EpiLog/HiDeHo for exploration support
     -  Dynamic and contextual extraction of a series of versions
   - Refactoring browser as the default editor for VDM-SL
   -  Unit tests and traces are run integrated in the test runner on the Refactoring browser.
   -  The execution contexts of failed tests are saved and directly debuggable
   -  Adopted the new Pharo debugger architecture in Pharo 12


* Hi-De-Ho integration

Hi-De-Ho (HInts for Directing the Exploration from History of Operations) is a micro-versioning framework for Pharo, currently used in ViennaTalk, gOLAP (Sales analysis tool), and re:mobidyc (multi-agent modeling environment).
In deign tasks, we often need to choose a design decision that we are not sure if the choice is appropriate or not.
Version control systems are tools to support the users to explore such design choices by trying an uncertain design choice, reverting if not successful, and cherry picking some fragments from the past partially-successful versions.
However, today's main-stream version control systems, such as Git, rather put more emphasis to long-term distributed team collaboration than short-term personal tasks.
Hi-De-Ho is a simple version control system to be embedded in design environments to provide versioning, tagging, commenting, reverting and fine-grained cherry picking.

##  Status of the Overture Components

#### VDMJ and VDM-VSCode

Progress with VDMJ 4.7.0-SNAPSHOT was mainly focussed on operation POs and VDM-VSCode support for their discharge, via QuickCheck. Operation POs now track the value of state variable updates using "let" definitions to hide previous values, and state that is amended on multiple paths is tracked as an "ambiguous" state, leading to "Unchecked" POs.

The updated POG and QuickCheck was used by PGL to re-visit the VDM Examples suite that is distributed with the tool.

A new heuristic feature was added to QuickCheck to allow more analysis of `MAYBE` cases. A new "reasons" strategy uses this to check whether the obligation reasons about all of the variables in the obligation root. For example, if the obligation is `k in set dom m`, then the PO ought to (at least) reason about k and m. If this is not the case, the `MAYBE` result is qualified with an observation like, "Note: does not reason about k?".

A new "constant" QuickCheck strategy uses constants in an obligation to bias the generation of counterexamples. For example, if a PO uses a constant MAX_WIDGETS, the strategy will try a few values "around" that constant for parameters that match the type of the symbol. The thinking is that constants are "sensitive points" around which errors will cluster.

A `@TypeParam` annotation was added, to allow polymorphic type parameters to be qualified a little, which makes caller type checking better. For example, `@TypeParam @T = seq of ?` (added before a function definition with `[@T]`) is like using `<T extends List<?>>` in Java, saying that the T type parameter is some sort of sequence, rather than any old type.

A High Level Design document for QuickCheck was created, in the same style as other VDMJ documents.

A rolling 1.5.1 VSIX for VDM-VSCode is [available](https://github.com/nickbattle/vdmj/releases/download/4.7.0-1/vdm-vscode-1.5.1-patch.vsix). We should consider a release soon.

##  Release Planning

#### VDM-VSCode

##  Community Development

#### Overture Traffic

See download stats on [number of installs](https://marketplace.visualstudio.com/items?itemName=overturetool.vdm-vscode).

#### OVT-23
This is organised in Aarhus as a part of the INTO-CPS Summit. I have discussed with different stakeholders planning to submit contributions here. I hope that we will have a great event (PGL).

##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).


##  Any Other Business



<div id="edit_page_div"></div>
