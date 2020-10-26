---
layout: default
title: Net Meeting 108
date: 28 May 2017, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants | AA, BB, ..., CC.  Minutes by DD. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 88-1 No progress.


## Overture Language Board Status

Work on RM39 [Equality and Order Clauses for Type Definitions](https://github.com/overturetool/language/issues/39) is continuing and Luis hopes that the feature will be available for the August release of Overture. We had a brief discussion about increasing version numbers, which we feel core should address at this NM. Working Groups: Regarding [Community Library Process](https://github.com/overturetool/language/issues/41) we hope to have a draft submission template and process for the next NM. Work on the [PO documentation](https://github.com/overturetool/language/issues/33) has been slow, we wondered if there will be any relevant output from student work at AU.

## Status of VDMTools Development

#### ord/eq clauses

The interpreter on github can animate specs with eq/ord clauses.
POG is not done, but will soon generate POs for ord and eq.
The updates to LRM will also be translated to Japanese documentation.
After stabilizing those updates, the binary packages will be released.

##  Status of the Overture Components

#### Overture
 
Some of the Overture standard examples have been improved and updated to use pure operations and sequence binds. In addition, the Java code-generator Maven plugin has been [slightly improved](https://github.com/overturetool/overture/issues/627).


##  Release Planning

Next release of Overture is due by June 5. A release candidate was made available on May 26.

We hope to have RM #39 ("order relations") implemented in the August 14 release of Overture.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://overturetool.org/download/)


##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting.


##  Publications Status and Plans

See [Planned Publications](https://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business

<div id="edit_page_div"></div>

