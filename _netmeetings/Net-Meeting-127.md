---
layout: default
title: Net Meeting 127
date: 2 May 2021, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Overture NetMeeting 127

|||
|---|---|
| Date | 02 May 2021, 12:00 CET |
| Participants | PGL, NB, HM, JR, KP, TO.  Minutes by NB. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* [Licensing of Fujitsu's VDMJ](https://github.com/overturetool/overturetool.github.io/issues/32) can be closed, pending the move of everything to VSCode under GPL.


## Overture Language Board Status

#### Open Requests

KP gave a summary of the current open Requests for Clarification and Modification with the Language Board.

The full list of open issues is [here](https://github.com/overturetool/language/issues).


## Status of VDMTools/ViennaTalk

#### VDMTools

No major updates

#### ViennaTalk

* [VDM-SL cheatsheet](https://viennatalk.org/ViennaDoc/cheatsheet-en/cheatsheet-types.html) in [English](https://viennatalk.org/ViennaDoc/cheatsheet-en/cheatsheet-types.html) and [Japanese](https://viennatalk.org/ViennaDoc/cheatsheet-ja/cheatsheet-types-ja.html).
  - shows major constructs of VDM-SL in [Types](https://viennatalk.org/ViennaDoc/cheatsheet-en/cheatsheet-types.html), [Expressions](https://viennatalk.org/ViennaDoc/cheatsheet-en/cheatsheet-expressions.html), [Definitions](https://viennatalk.org/ViennaDoc/cheatsheet-en/cheatsheet-definitions.html) and [Statements](https://viennatalk.org/ViennaDoc/cheatsheet-en/cheatsheet-statements.html)
  - Example expressions are animated on the browser with "run" buttons.

##  Status of the Overture Components

#### ViennaTalk

A new "cheat sheet" feature has been added, for those of us who cannot remember fiddly language details.

### VDM for VSCode

* Add Library feature is ready for testing and merging. Right-clicking on the Files explorer in a folder that has a VDM client on or vdm files in the top folder, an Add VDM Library button appears. Changed the activation to catch workspaces that contain vdm files on the top folder. Added a dialect field in the SLSP class so when client is on we just use the dialect in it. In case that is not found we try to match a .vdmsl/.vdmpp/.vdmrt file. 

* Working towards coverage and later FMU generation. Added Server-side support for coverage data generation by an extension of the SLSP "translate" request.

* PGL will look into using VSCode for students in the summer.

##  Release Planning

Now that a new VSCode feature has been added, it was decided to schedule a new release of the extension, and in future to follow a "rolling release" style, where releases are made on a frequent basis, with small functional enhancements.

It was suggested that the VSCode extension is moved from a JR private Github account to either INTO-CPS or (more likely) OvertureTool. HM/JR to progress.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://www.overturetool.org/download/)

For VSCode see status on [the extension page](https://marketplace.visualstudio.com/items?itemName=jonaskrask.vdm-vscode)

#### Overture Workshop

The CFP is out and everyone is encouraged to submit paper proposals.

##  Strategic Research Agenda

The Strategic Research Agenda is reviewed every other NetMeeting. No progress this time.


##  Publications Status and Plans

[Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html) will be updated by HM.


##  Any Other Business

PGL stated his intention to stand down as the Convener of these Overture net meetings, handing the batton over to HM. We thank Peter for his efforts over the years and look forward to working with Hugo in the chair in future. Peter will, of course, still be involved with Overture as far as possible.

