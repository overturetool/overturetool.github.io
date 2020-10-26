---
layout: default
title: Net Meeting 98
date: 22 May 2016, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | CT, KS, LF, LC, MV, NB, PGL, TO, VB, PJ.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1 No progress.
* 88-1 No progress.


## Overture Language Board Status

Two RMs have been moved to the 'Execution' phase, which means that the LB will start implementing them in the tool. For more information see the minutes from today's Language Board meeting:

https://github.com/overturetool/language/wiki/Minutes-of-the-LB-NM,-22nd-May-2016

## Status of VDMTools Development

Nothing new to report.

##  Status of the Overture Components

#### VDMJ

Various VDMJ bug fixes this period, as usual, applied to Overture where appropriate:

* 3.1.1 Build 160425, correct arithmetic operations for very large values.
* 3.1.1 Build 160426, fix problem with measures that use UpdatableValues
* 3.1.1 Build 160511, fix a problem with UpdatableValue re-use

#### Overture

Several fixes related to traces. Also a few fixes for the Java code generator reported by students workin on code generation related projects.

#### Web IDE

The web IDE currently only supports VDM-SL.
Before we implement additional features, and add support for VDM++ and VDM-RT, we need to restructure different parts of the current implementation to make the web IDE more stable and improve performance.
We will be experimenting with different approaches for using the Overture core in a multi-user environment.
Our issues concern the use of static variables in the Overture core, so we will be using either processes or class loaders to get around this.

#### C Code Generator

A prototype code generator is now available from ``Install New Software ...''.  It has support for basic language features, including classes, overriding etc., but complex patterns, record updates, function values etc. are not yet supported.  It is still under heavy development, driven by industrial partner case study models.

##  Release Planning

Anders will release Overture 2.3.6 today. For a list of fixes see:

https://github.com/overturetool/overture/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+milestone%3Av2.3.6+ 

Overture now requires Java 8 and it also builds against Eclipse Mars
(newest Eclipse).

The release also includes a prototype version of a VDM-RT-to-C code
generator. The VDM-RT-to-C prototype has been developed by Kenneth
Lausdahl and Victor Bandur.

You can install it via the VDM2C update site: 'Help' menu -> 'Install new software'
and choose 'Overture VDM2C Development'. Also note  that this plugin has its own


##  Community Development

#### Student projects

Tommaso will join the team to work on a summer project from ESA. The idea behind Tommaso's work will be to make a ASN.1 translation to the VDM type system such that we can easily integrate Overture with TASTE. Some of this is described in MV's position paper submitted to the previous Overture workshop in Oslo.

#### Overture Traffic

See download stats on [the downloads page](https://overturetool.org/download/)


##  Publications Status and Plans

See [Planned Publications](https://overturetool.org/publications/PlannedPublications.html).


##  Any Other Business

None.

<div id="edit_page_div"></div>
