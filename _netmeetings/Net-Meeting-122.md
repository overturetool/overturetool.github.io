---
layout: default
title: Net Meeting 122
date: 9 February 2020, 1200 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 9 February 2020 |
| Participants  |   Minutes by  |

## Review Status of the Action List

A list of actions can here found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22action+net-meeting%22).



## Overture Language Board Status


## Status of VDMTools/ViennaTalk

### Viennatalk


### VDMTools


##  Status of the Overture Components

### Overture and VDMJ

I've managed to make some progress on some of the very old bugs that we've had on the Overture buglist for a few years. A complete list of mergable fixes is: https://github.com/overturetool/overture/issues?q=is%3Aissue+is%3Aopen+label%3AMergable

Of particular note:

The POG and missing measures warnings now deal with mutual recursion. This is currently limited to a mutual "depth" of 8 calls in a loop (eg. a calls b, b calls c, c ... and h calls a) to avoid excessive TC computation.

Stack overflow errors are now caught and reported sensibly at runtime, rather than just crashing the JVM.

#ifdef processing is now working, and more flexible.

##  Release Planning


##  Community Development


##  Licensing of Overture source code


##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business


<div id="edit_page_div"></div>
