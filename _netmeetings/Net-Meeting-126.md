---
layout: default
title: Net Meeting 126
date: 14 February 2021, 1200 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 14 February 2021 |
| Participants PGL, MV, HDM, NB, KP   |   Minutes by KP   |

## Review Status of the Action List
A list of actions can here found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22action+net-meeting%22).

* PGL has made a list of dates for NMs in 2021.
* [List which Overture Eclipse plugins rely on VDMJ code](https://github.com/overturetool/overturetool.github.io/issues/34) closes. See [Moving Overture from GPL to BSD/CC](https://github.com/overturetool/overture/issues/705).

## Overture Language Board Status

Ken will continue as Convener, Tomo as Secretary. Four people nominated themselves so far, we at least one more for a quorum, so Hugo kindly volunteered.

## Status of VDMTools/ViennaTalk

### Viennatalk
No major change.

### VDMTools
No major change.

##  Status of the Overture Components

### Overture and VDMJ

VDMJ has been updated to support VSCode problems, so mainly in the LSP Server.

A recent change to enable nested block comments was added, though has caused some concern when applied to Overture. This is currently submitted to the Language Board as a [Request for Clarification](https://github.com/overturetool/language/issues/52).

### VDM for VSCode

The "VDM VS Code" extension for VSCode has been released and is now at version 1.0.5. To allow rapid bug fixing, we've adopted the convention that increments in the third digit of the version number indicate "snapshot" builds of the next 1.1.0 baselined release. This means we have been able to get fixes for the several small issues that people have found - the extension automatically updates when a new version is available. The release seems stable and we're encouraging our power users to take a look, to stress the system (ie. Paul, Leo and others).

There are some installation and user instructions in the READMEs [here](https://github.com/nickbattle/vdmj/blob/master/lsp/README.md) and [here](https://github.com/jonaskrask/vdm-vscode/blob/master/README.md).

##  Release Planning

VSC 1.1.0 to be released soon. New Overture release in the next two weeks.

##  Community Development

The plan is to have the next Overture workshop on the 22nd of October 2021 physically in AArhus (but also accessible on-line) with Casper Thule and Ken Pierce as the programme committee chairs and Hugo Macedo as the organising chair. CfP will be out in a few weeks.

##  Licensing of Overture source code

Regarding VSC the extensions will all move to GPLv3 to align with VDMJ, using [SPFX strings](https://spdx.dev/ids/) to ensure machine-readability of the license. The medium- to long-term plan will be to move over to VSC once the features are all there. 

##  Publications Status and Plans

See [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

##  Any Other Business


<div id="edit_page_div"></div>

