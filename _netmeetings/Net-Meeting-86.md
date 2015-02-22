---
layout: default
title: Net Meeting 86
date: 22 February 2015, 1300 CET
---

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | Nick Battle, Peter Gorm Larsen (chair), John Fitzgerald, Peter Jorgensen, Ken Pierce, Tomohiro Oda, Shin Sahara. Minutes by Marcel Verhoef. |


## Review Status of the Action List

See [Net Meeting Actions](actions.html)

##  41-1: Video on Deploying VDM

__Created__: 6 February 2010 (see [[Net Meeting 41]]) <br />
__Owner__: Peter Gorm Larsen

Prepare new materials on how VDM fits into industrial development practice. This is to be aimed at a lay "manager" readership. Contributors: MV, JSF, NB and PGL. Now closed.

##  80-1: Strategic research agenda

No progress reported.

##  82-1: To create landing page for language board

__Created__: 21 September 2014 (see [[Net Meeting 82]]) <br />
__Owner__: Ken Pierce

Now Closed.

## Overture Language Board Status

No specific issues to report. The discussion on object invariants is still pending, no comments were received after publication of the summary.

## Status of VDMTools Development

VDMTools is stable+ no changes since last report.

##  Status of the Overture Components

#### VDMJ

Some bug fixes this period:

* 2015-01-31 Fix for combinatorial trace stemming
* 2015-01-29 Correction for dev, rem and mod by zero
* 2015-01-26 Correction to static data initialization
* 2015-01-21 Fix to type check of set ranges
* 2015-01-19 Fix to type check of object field designators

Currently, VDMJ uses 64-bit longs and doubles to hold whole number types and real types internally. These are fast and efficient, and for most purposes they are large and accurate enough. But strictly speaking, the VDM language does not
have limitations on the size or precision of numbers.

I've prepared patches for VDMJ and VDMJUnit which replace the internal long/double values with BigInteger and BigDecimal values. This should be regarded as experimental, but the system does pass all the language tests that I
have. The change makes the full test suite about 3% slower.

The two new jars are called vdmj-3.0.1-P.jar and vdmjunit-1.0.0-P.jar.

Usage is the same as before, except for a new -precision option to set the number of decimal places that are significant. The default is 100. This can also be adjusted from the command line with a new "precision" command that displays or adjusts the current scale.

#### Overture generic

Reported by PJ:
- Fix to the SmokerPP example
- Java code not updated to ASTv2
- I did a few bug fixes for traces
- Fixes for the Java CG (mostly relatd to generation of pattern matching)
- Enhancement: The Java code now outputs the generated code as an Eclipse project together with the runtime library and another jar with the runtime sources attached
- Some early work on auto completion of things like quotes and types

#### Combinatorial Testing

Serious bug discovered in the latest release, CT only works with trivial examples and crashes when invariants are used. Under investigations at the moment. PJ needs to sync with Kenneth. Peter needs this solved as his VDM course is starting soon. 

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

##  Publications Status and Plans

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).
From now on, this agenda point will be PM. Participants should update the list prior to the NM.

##  The next Overture workshop

The next [Overture workshop](http://overturetool.org/workshops/13th-Overture-Workshop) is planned to take place in connection with the [FM'15 conference](http://fm2015.ifi.uio.no/). Number of submission is still low at the moment, we need to encourage everyone to submit work in progress.

##  Any Other Business

None.
