---
layout: default
title: Net Meeting 124
date: 6 Sepotember 2020, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 17 May 2020 |
| Participants HDM, LF, NB, PGL, SS, TO  |   Minutes by HDM   |

## Review Status of the Action List

A list of actions can here found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22action+net-meeting%22).



## Overture Language Board Status


## Status of VDMTools/ViennaTalk

### Viennatalk

ViennaTalk "Hakodate" has been released. https://github.com/tomooda/ViennaTalk/releases/tag/Hakodate

The major update is ViennaVisuals, which provides a DOM operation library to generate XML-based document models including SVG (Scalable Vector Graphics) and XHTML. Events on document elements can be handled by operations in VDM.

### VDMTools

No major changes.

### VDM++ for VSCode

Futa Hirakoba is working on hover and completion functionalities, but hasn't reached a new release.

##  Status of the Overture Components

### Overture and VDMJ

**VDMJ** Some nasty (but obscure) VDMJ bugs fixed over the summer - corresponding fixes made to Overture too.

Overture 3.0.0 has finally been released. This release contains several additions and improvements, and Overture now runs on top of Java 8, 9, 10, and 13. It is also possible to run on top of Java 14 with the development version Overture 3.0.1. We are currently testing the most recent Eclipse platform 2020-09, which will be officially released on the 16th of September. 

### VDM for VSCode

A new LSP feature now available which provides VDMJ language services (all dialects) to an LSP/DAP client, such as VSCode. This also enables us to use the @Annotation features of VDMJ as they were intended - ie. errors in annotation comments are highlighted and they execute as intended when a spec is processed. See README and screen-shots at https://github.com/nickbattle/vdmj/tree/master/LSP. Note that there are no awkward licence restrictions by taking this route (unlike the Eclipse licence in Overture).


##  Release Planning

We expect to release Overture 3.0.2 very soon after the official release of Eclipse 2020-09.  

##  Community Development

##  Licensing of Overture source code

See comments above regarding licensing and the LSP feature.

##  Publications Status and Plans

See [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).


##  Any Other Business


<div id="edit_page_div"></div>

