---
layout: default
title: Net Meeting 142
date: 24 November 2024, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting 142

|||
|---|---|
| Deadline | 24 November 2024, 12:00 CEST |
| Participants | See git log |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status

## Status of ViennaTalk Development

Improvements on on-the-fly testing
* On-the-fly testing triggers both unit tests and traces at every modification to the source specification.
* Failed/error tests can be debuged on Smalltalk debugger.

Improvements on slicing
* VDM sources on Smalltalk debugger can be sliced with expressions.
* The refactoring browser can display slices across multiple modules/sections.

Improvements on EpiLogue
* re-designed UI

##  Status of the Overture Components

#### VDMJ and VDM-VSCode

* VDMJ 4.6.0 and VDM-VSCode 1.5.0 released. Work is now proceeding against the 4.7.0-SNAPSHOT.
* The most significant development work is better production of proof obligations for operations (as opposed to functions). This requires the tracking of possible updates to mutable variables (state, or dcl declarations) and limits the POs that can be discharged with QuickCheck easily. But many more operation POs are now checkable, rather than being "Unchecked" - for example, ~40% of POs in the Overture example suite were Unchecked; now that is down to ~14%. The work is currently only sensible in VDM-SL, since the object state in VDM++/RT is much harder to reason about.
* In connection with the changes above, a new code lens is now produced by the POG, labelling failed obligations inline. When these lenses are clicked, they work like the regular "Launch/Debug" lenses, but substitute counterexample arguments that have been discovered by the QuickCheck process. This allows counterexamples to be debugged very easily.
* Leo has been using the above to check some very large models - including the VDM_Toolkit and some confidential models from Newcastle. Feedback here has led to many bug fixes(!) and improvements.
* Markus is working on updates to the GUI front end. If anyone wants to try the new POG/GUI, let me know - we produce patch VSIX files for people to try, but development is ongoing.

![image](https://github.com/user-attachments/assets/c63c51b2-d635-400c-b2de-a7c96c06306e)

##  Release Planning

#### VDM-VSCode


##  Community Development

#### Overture Traffic

See download stats on [number of installs](https://marketplace.visualstudio.com/items?itemName=overturetool.vdm-vscode).

#### OVT-23

Will happen in June 2025 co-located with INTO-CPS workshop
in Aarhus, Denmark

##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.


##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).


##  Any Other Business


### Next year net meetings suggestions:

* 23 Feb
* 18 May
* 31 Aug
* 23 Nov

In addition there is a physical meeting at OVT-23 as planned.



<div id="edit_page_div"></div>
