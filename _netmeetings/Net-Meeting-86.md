---
layout: default
title: Net Meeting 86
date: 22 February 2015, 1300 CET
---

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | AA, BB, ..., CC.  Minutes by DD. |


## Review Status of the Action List

See [Net Meeting Actions](actions.html)

* 10-1 some progress...
* 11-4 no progress...
* 15-2 is now closed.
* ...


## Overture Language Board Status

#### topic 1

some description


## Status of VDMTools Development

SS has reported the status of VDMTools to be unchanged.


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

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### topic 1
...

##  Publications Status and Plans

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

#### In preparation:

* Item 1
* Item 2

#### In review:

* Item 1

#### In press:

* Item 1

##  The next Overture workshop

The next [Overture workshop](http://overturetool.org/workshops/13th-Overture-Workshop) is planned to take place in connection with the [FM'15 conference](http://fm2015.ifi.uio.no/). We hope that we will get a lot of submissions.

##  Any Other Business
