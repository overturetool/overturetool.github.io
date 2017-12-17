# Net Meeting 113

|---|---|
| Date | 17th Dec 2017 |
| Participants | PGL, NP, NB, TO.  Minutes by NB. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 88-1 An update on the work Newcastle is doing with EMVCo and MULTOS will be presented at the next Overture workshop.

## Overture Language Board Status

Two RMs are currently active, #42 and #43. See https://github.com/overturetool/language/issues.

RM#42 modifies the recursive measure sematics to allow in-line expressions, which generate implicit functions in the same way as pre/postconditions. This RM is in the Execution phase and has been implemented in VDMJ; Overture will follow.

RM#43 modifies function application syntax to dispense with brackets and commas for arguments. This is currently in the Community Discussion phase and will remain so until 7th Jan. One negative response received so far; further input was requested from the Core.

A Request for Clarification (of the LRM) has also been received, regarding the syntax of function signatures and the use of the total function indicator (+>). Advice will be sought from PGL.

## Status of VDMTools Development

* http://fmvdm.org/ will be operating another year.
* We agreed to try to keep the Wiki page about Overture/VDMTools differences up to date.
* NB will look at whether the VDM specs (ie. specs of the language/tools from VDMTools) can be processed by VDNJ/Overture.

### ViennaTalk

* Incorporated RM#42 except code generation

##  Status of the Overture Components
#### VDMJ

Has been updated for the RM#42 measure changes, though not yet released. Some minor bug fixes since the last NM.

#### VDM2C

We're mostly working on addressing some memory leak issues in the generated code. Hopefully we'll have these issues fixed by the end of the next week.

##  Release Planning

### Overture

[Overture 2.5.6](https://github.com/overturetool/overture/releases/tag/Release%2F2.5.6) was released on December 11. The release dates for 2018 are as follows:

- February 16
- May 18
- July 6
- October 19

### VDM2C

The plan is to release a new version of VDM2C early January (2018).

##  Community Development

### Core NM Dates

Four meetings are proposed for 2018 to encourage more people to attend. Meeting invites will be sent out with electronic invites attached (PGL) and more reminders will be given (NB).

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/). Note that many of these downloads are thought to be due to bots which download and re-distribute free software.

##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

NP drew attention to the next FORMALiSE meeting on 2nd June 2018, Gothenburg, Sweden: http://www.formalise.org/

##  Any Other Business

The LB would like to remind everyone in Core that nominations for the LB membership in 2018 is now open. A separate email will be sent with details, but the current plan is to close nominations in mid-Jan.


