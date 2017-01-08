---
layout: default
title: Net Meeting 104
date: 8 January 2017, 1200 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | ....  Minutes by XXX. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

## Overture Language Board Status


## Status of VDMTools Development

#### https://github.com/vdmtools/vdmtools/
* Dr. K is keep updating VDMTools. (changelog: https://github.com/vdmtools/vdmtools/commits/master)

#### http://fmvdm.org/
* Binary package downloads (319 total)
 - windows : 251
 - mac : 47
 - linux : 21

## Status of ViennaTalk Development

* Only minor updates for bugfixes

##  Status of the Overture Components

#### VDMJ
A new [release 4.0](https://github.com/nickbattle/vdmj/releases/tag/4.0.0-1) of VDMJ is available for alpha testing. This release does not add any new functionality, but it has a large scale restructuring of the internals of VDMJ.

Version 3 and earlier of VDMJ have a monolithic structure, where the code for each type of analysis on a node type (for example, type checking, execution and PO generation) is included in the single AST node of that type. Version 4 onwards splits the functionality of the different analyses into separate classes. Before an analysis is performed, the system generates a new tree of objects specifically for that analysis (once only). This means we can keep new analyses independent of existing code and the AST, but without using visitors, which can become cumbersome for very large ASTs.
##  Release Planning


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)


##  Follow up on the Business Canvas session from the Overture Workshop

The business model for Overture see https://github.com/overturetool/overture/wiki/Business-model

##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).


## New Actions


## Any Other Business


<div id="edit_page_div"></div>

