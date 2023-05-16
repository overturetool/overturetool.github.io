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
| Participants | ... Minutes by ... . |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)


## Overture Language Board Status


## Status of ViennaTalk Development


##  Status of the Overture Components

#### VDMJ
VDMJ has an experimental plugin (development branch) that attempts to disprove proof obligations by direct evaluation, giving a counterexample if it can. For example here checking 7 POs from a small spec, failing on the last one:
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
(forall a:T &inv_T((if (a = 0) then 1 else (a * f((a - 1))))) and
(is_nat((if (a = 0) then 1 else (a * f((a - 1)))))))
>
```

#### VSCode Extension


#### LSP Server

##  Release Planning

##  Community Development

#### The web appearance of VDM 

* Make users aware of novel features.
* Wikipedia
* Overturetool.org
* Outdated manuals (how to replace Eclipse)
* Agree on how to update.

#### Overture Traffic

See download stats on [number of installs](https://marketplace.visualstudio.com/items?itemName=overturetool.vdm-vscode).


#### OVT-22 

Planning to have a rolling deadline to have journal first submissions...

##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

It was agreed that people should review and update this page with their planned papers.

##  Any Other Business


<div id="edit_page_div"></div>

