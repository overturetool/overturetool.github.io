---
layout: default
title: Net Meeting 136
date: 21 May 2023, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting Default Template

|||
|---|---|
| Date | 21 May 2023, 12:00 CEST |
| Participants | TO, KP, HDM Minutes by HDM |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status

Closed #49 and #50.

We need some experts to check the added RM50 Tord modifications. The changes are available for experimentation in the "maximal" branch of VDMJ. Please follow Nick guidance here.

## Status of ViennaTalk Development
Released a new major version [Firenze](https://github.com/tomooda/ViennaTalk/releases/tag/firenze) based on the new release of Pharo 11.

Currently the implementation of AST is being refactored so that AST-level analysis will be easily implemented later.

##  Status of the Overture Components

#### VDMJ
VDMJ has an experimental "QuickCheck" plugin (development branch) that attempts to disprove proof obligations by direct evaluation, giving a counterexample if it can. For example here checking 7 POs from a small spec, failing on the last one (because 4 does not meet the invariant of T):
```
> qc
Expanding 2 ranges: ..
Ranges expanded in 0.049s
PO# 1, PASSED in 0.018s
PO# 2, PASSED in 0.001s
PO# 3, PASSED in 0.001s
PO# 4, PASSED in 0.0s
PO# 5, PASSED in 0.002s
PO# 6, PASSED in 0.003s
PO# 7, FAILED in 0.008s: Counterexample: a = 4
f: subtype obligation in 'DEFAULT' (test.vdm) at line 9:5
(forall a:T &
    inv_T((if (a = 0) then 1 else (a * f((a - 1))))) and
    (is_nat((if (a = 0) then 1 else (a * f((a - 1)))))))
>
```

#### VSCode Extension
The QuickCheck plugin is available for VSCode too, but is only a command line tool. Once this feature is stable or useful, it should be integrated with the VSCode client and POG "view", with updates to the SLSP protocol to support it.

#### LSP Server

##  Release Planning

##  Community Development

#### The web appearance of VDM 

* Make users aware of novel features.
* Wikipedia
* Overturetool.org
* Outdated manuals (how to replace Eclipse)
* Agree on how to update.

We agreed on a community effort, where members should open issues and make corrections by making pull requests that should later be considered in the next core meeting. [Issues](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)
Please make a note on the issue/pull request in case a simple deletion of outdated content is not enough. We will consider those in the core meeting to evaluate whether we should make a new version of the material.

#### Overture Traffic

See download stats on [number of installs](https://marketplace.visualstudio.com/items?itemName=overturetool.vdm-vscode).


#### OVT-22 

Planning to have a rolling deadline to have journal first submissions...
Hugo to make a call for papers for OVT-22.

##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

It was agreed that people should review and update this page with their planned papers.

##  Any Other Business


<div id="edit_page_div"></div>

