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

* https://github.com/overturetool/overturetool.github.io/issues/35 Meet with legal contact is closed (without much help unfortunately) 
* https://github.com/overturetool/overturetool.github.io/issues/32 / https://github.com/overturetool/overturetool.github.io/issues/34
 on hold.
 * https://github.com/overturetool/overturetool.github.io/issues/18 88-1 Input for video is closed as this idea is no longer current.
 
## Overture Language Board Status

The Language Board met. Ken remains Convener and Tomo takes over from Peter J as secretary. We thank Peter J for his efforts. Minutes are here: https://github.com/overturetool/language/wiki/Minutes-of-the-LB-NM%2C-17th-March-2020.

There are a couple of fixes to the LRM. The main issues open are updating Overture. Help is needed on getting annotations working, and also total functions. Both are in VDMJ but the Overture integration is tricky / needs some effort.

## Status of VDMTools/ViennaTalk

### Viennatalk
A history management module named VDMPad-EpiLog for VDMPad has been added. It is intended to help summarizing exploratory process. You can edit the history to review what you did and what you confirmed about the model. You can also re-run some series of evaluations in newer revisions of the model (see "Review the session" section in https://viennatalk.org/ViennaTalk/VDMPad.html for details). Leo mentions the AI4FM project which allowed Isabelle to discover proof strategies from failures. There is a nice PhD thesis on this by Andrius Velykis.

### VDMTools
No major updates.

### VDM++ for VSCode
Futa Hirakoba joins the Community. He is working on VDM++ extension for VSCode.

##  Status of the Overture Components

### Overture and VDMJ

A couple of bugs were fixed in Overture 2.7.4 and VDMJ regarding mutually recursive measure warning messages. See bugs #719 and #720.

A new subproject of VDMJ has been created, called LSP. This implements a Language Server Protocol and Debug Access Protocol server, which provides language services to an LSP/DAP capable IDE, such as VS Code. This enables us to use VDMJ from a fully featured IDE. This includes annotations, which we are currently not able to use in the Overture IDE. The feature is currently [available](https://github.com/nickbattle/vdmj/tree/master/LSP) for test.

Jonas and Fredrik are doing good progress towards the creation of an LSP client. We have met with Futa Hirakoba and Tomohiro Oda right after the last Overture net meeting and since then much developments have been made to prepare the MSc project which goal is to make the VSCode client for the VDMJ server a full fledged IDE.

Regarding the Overture Tool, a new release candidate is available for tests at https://overture.au.dk/overture/development/latest/. It contains a major bump in Eclpise versions. It allows JAVA 11, and should not be dependent of Java 8 anymore. 
Bug #721 is fixed and equal file names in different folders are now allowed. The last two changes require systematic testing, as they may have broken functionality. 

Leo reports good progress on the Isabelle translator. It caters for a large subset of VDM; current work is on refining the tricky bits and conventions. The tool is also now command-line usable for others to try. Testing underway to iron out velocity issues there will be a  release for people to play with.

##  Release Planning

There are question marks around the  release of the 2.7.5 candiate as version 3.0.0 to mark the major leap in JVM/Eclipse dependency (avoiding the need for Java 8). Delay until the problems can be solved. 



##  Community Development

Potential Overture workshop in Newcastle Summer 2020 has been put on hold due to the Covid-19 pandemic. We will plan the workshop once we know more about the future situation.

##  Licensing of Overture source code

No progress on Overture licensing as such. But the LSP project looks promising, and provides a way forward where we can link VDMJ and its LSP server in an independent "product" (VS Code extension) without Eclipse license restrictions (I think!)

See the VS Code [licensing FAQ](https://code.visualstudio.com/docs/supporting/FAQ#_licensing).

##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business


<div id="edit_page_div"></div>

