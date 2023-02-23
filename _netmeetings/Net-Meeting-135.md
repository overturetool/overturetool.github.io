---
layout: default
title: Net Meeting 135
date: 26 February 2023, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# NetMeeting Default Template

|||
|---|---|
| Date | 26 February 2023, 12:00 CEST |
| Participants | X,Y,Z.  Minutes by W. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)



## Overture Language Board Status


## Status of ViennaTalk Development

No major changes.

##  Status of the Overture Components

#### VDMJ

Added a [wiki](https://github.com/nickbattle/vdmj/wiki) to the GitHub site. Rather than being a separate version of the PDF documentation, it's presented as a conversation _about_ the PDF documents, with links to them.

Converted VDMJ internals to use the same  plugin architecture as the LSP Server. So you can add new functionality (analyses and commands) by including a jar on the classpath.

Added a "QuickCheck" plugin (see above) example project for VDMJ that attempts to use value ranges to make explicit tests of proof obligations that include type binds (ie. most of them). This is also available as an LSP plugin. It should be regarded as experimental for now! Here's how you use it:
```
functions
	f: real -> nat
	f(a) == a + 1;

Interpreter started
> p f(1)
= 2
Executed in 0.161 secs. 

> qc -c
Created 1 default ranges in ranges.qc. Check them! Then run 'qc'

> qc
Ranges expanded in 0.081s
PO# 1, FAILED in 0.003s: Counterexample: a = 0.1
f: subtype obligation in 'DEFAULT' (test.vdm) at line 2:5
(forall a:real &
  is_nat((a + 1)))

> qc -?
Usage: quickcheck [-c <file>]|[-f <file>] [<PO numbers>]
> 
```

#### VSCode Extension

We have two MSc students looking at a new release pipeline and how to use DevOps to improve the integration of different components into the extension.

#### LSP Server

Tested the LSP Server with the Kate editor, and added a [wiki page](https://github.com/nickbattle/vdmj/wiki/Using-the-Kate-Editor) for its configuration.

##  Release Planning

#### VSCode 1.3.8 Release 

New release will include recent changes to VDMJ (e.g. quick check). It will test a new DevOps approach to the releases under development at AU.

##  Community Development

#### Overture Traffic

See download stats on [number of installs](https://marketplace.visualstudio.com/items?itemName=overturetool.vdm-vscode).


#### OVT-21

OVT-21 is already under way. Reviews sent to authors this week. 

##  Publications Status and Plans

Also see [Planned Publications](https://www.overturetool.org/publications/PlannedPublications.html).

It was agreed that people should review and update this page with their planned papers.

##  Any Other Business


<div id="edit_page_div"></div>

