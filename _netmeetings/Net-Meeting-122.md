---
layout: default
title: Net Meeting 122
date: 9 February 2020, 1200 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 9 February 2020 |
| Participants PGL, NB, TO, HM | Minutes by KP |

## Review Status of the Action List

A list of actions can here found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22action+net-meeting%22).

## Overture Language Board Status

No meeting was held.

## Status of VDMTools/ViennaTalk

### Viennatalk
[ViennaTalk "Porto"](https://github.com/tomooda/ViennaTalk/releases/tag/Porto) released on Feb 5 2020. This is basically to catch up the major upgrade of the base environment [Pharo 8](https://pharo.org/).

### VDMTools
Dr. K keeps maintaining the code.

### VDM++ for VSCode

A student of Prof. Katayama at Miyazaki Univ developed VDM++ for VSCode.

##  Status of the Overture Components

### Overture and VDMJ

NB managed to make progress on some of the very old bugs that we've had on the Overture buglist for a few years. A complete list of mergable fixes is [here](https://github.com/overturetool/overture/issues?q=is%3Aissue+is%3Aopen+label%3AMergable).

Of particular note:

The POG and missing measures warnings now deal with mutual recursion. This is currently limited to a mutual "depth" of 8 calls in a loop (eg. a calls b, b calls c, c ... and h calls a) to avoid excessive TC computation.

Stack overflow errors are now caught and reported sensibly at runtime, rather than just crashing the JVM.

#ifdef processing is now working, and more flexible.

NB also tidied the bug list, rationalised the labels and closed a few issues where we could.

##  Release Planning

NB: would recommend we consider a bug fix release to pick up the mergable fixes mentioned above.

##  Community Development


##  Licensing of Overture source code

NB completed a review of the copyright-origin of the files that comprise the Overture source tree and put the results in the IPR issue (https://github.com/overturetool/overture/issues/705). The analysis makes some simplifying assumptions (see the issue), but we believe the result is essentially correct.

One possible way forward - perhaps some way away - is the work that Hugo is doing with the Language Server Protocol implementation. NB discussed this with Hugo while in Aarhus. The advantage for us is that having an LPS server independent of the IDE means that we can separate the IPR concerns.

##  Publications Status and Plans

See [Planned Publications](https://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business


<div id="edit_page_div"></div>
