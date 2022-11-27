---
layout: default
title: Net Meeting 134
date: 27 November 2022, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting Default Template

|||
|---|---|
| Date | 27 November 2022, 12:00 CEST |
| Participants | HM, NB, KP, TO, LF, PGL.  Minutes by NB. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* No open actions.

## Overture Language Board Status

The LB progressed a few issues. The big one is that there is a request to alter constructors in VDM++ which is a known issue for many years and any "fix" will break backwards compatability. We will need to decide as a Community if/how we navigate this (and if we want to put the effort in to change the tools).

We can try to discuss before but Lubeck might be a good place for this.

Also it was the last LB meeting, so we'll have an election over the end of year as usual.

## Status of ViennaTalk Development

No changes.

##  Status of the Overture Components

#### VDMJ

* The VDMJ #ifdef processor is now more sensible and will apply to all external readers (like AsciiDoc or LaTeX source).
* Very long power set calculations can now be interrupted in the debugger.
* Some small combinatorial testing bugs fixed.
* Applied the LB changes for RM#49 (more sensible "let" semantics).
* A new [External Format Reader Guide](https://github.com/nickbattle/vdmj/blob/master/vdmj/documentation/ExternalFormatGuide.pdf) is available to help people write for new formats/sources. Added a CSVReader example to the VDMJ examples.
* Bug fixed to allow VDMJ to work with Java 19.
* A new [Library Writers Guide](https://github.com/nickbattle/vdmj/blob/master/vdmj/documentation/LibraryGuide.pdf) is availabe to help people create new libraries.
* Looked at some issues reported to the LB about VDM++ object construction (needs clarification in the LRM).
* There's a new experimental feature to allow VDMJ command line execution to be "p" paused or "q" interrupted, dropping into the debugger.

NB asked for feedback on the new Guides.

#### VSCode Extension

* The [VSCode wiki](https://github.com/overturetool/vdm-vscode/wiki) has been updated considerably, especially for new users (Getting Started).
* A new [Plugin Writer's Guide](https://github.com/nickbattle/vdmj/blob/master/lsp/documentation/PluginWritersGuide.pdf) is available to explain how to write a new plugin for the extension.
* A new "generate" command is available to allow CT expansion to debugged.

##  Release Planning

#### VSCode 1.3.7 Release 

It includes the VDM to UML translation and the updates to VDMJ

Version 1.3.7 has been released, with patches to VDMJ and UML jars.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://www.overturetool.org/download/).

The old Eclipse download page will be updated to deprecate Overture Eclipse in favour of VDM VSCode.

#### OVT-20 and OVT-21

OVT-21 is already under way. PC invitations were made, and mostly accepted. The CFP is awaiting approval by Easychair.

##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

It was agreed that people should review and update this page with their planned papers.

##  Any Other Business

Meeting dates 2023:

* 26 Feb
* 21 May
* 27 Aug
* 26 Nov

<div id="edit_page_div"></div>

