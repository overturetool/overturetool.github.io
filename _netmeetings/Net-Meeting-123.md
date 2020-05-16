---
layout: default
title: Net Meeting 123
date: 17 May 2020, 1200 CEST
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 17 May 2020 |
| Participants  |   Minutes by  |

## Review Status of the Action List

A list of actions can here found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22action+net-meeting%22).



## Overture Language Board Status


## Status of VDMTools/ViennaTalk

### Viennatalk

### VDMTools

##  Status of the Overture Components

### Overture and VDMJ

A couple of bugs were fixed in Overture 2.7.4 and VDMJ regarding mutually recursive measure warning messages. See bugs #719 and #720.

A new subproject of VDMJ has been created, called LSP. This implements a Language Server Protocol and Debug Access Protocol server, which provides language services to an LSP/DAP capable IDE, such as VS Code. This enables us to use VDMJ from a fully featured IDE. This includes annotations, which we are currently not able to use in the Overture IDE. The feature is currently [available](https://github.com/nickbattle/vdmj/tree/master/LSP) for test.

Jonas and Fredrik are doing good progress towards the creation of an LSP client. We have met with Futa Hirakoba and Tomohiro Oda right after the last Overture net meeting and since then much developments have been made to prepare the MSc project which goal is to make the VSCode client for the VDMJ server a full fledged IDE.

Regarding the Overture Tool, a new release candidate is available for tests at https://overture.au.dk/overture/development/latest/. It contains a major bump in Eclpise versions. It allows JAVA 11, and should not be dependent of Java 8 anymore. 
Bug #721 is fixed and equal file names in different folders are now allowed. The last two changes require systematic testing, as they may have broken functionality. 


##  Release Planning

In case no issues are fund until the 22 of May, we will release the 2.7.5 candiate as version 3.0.0.



##  Community Development


##  Licensing of Overture source code

No progress on Overture licensing as such. But the LSP project looks promising, and provides a way forward where we can link VDMJ and its LSP server in an independent "product" (VS Code extension) without Eclipse license restrictions (I think!)

See the VS Code [licensing FAQ](https://code.visualstudio.com/docs/supporting/FAQ#_licensing).

##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business


<div id="edit_page_div"></div>

