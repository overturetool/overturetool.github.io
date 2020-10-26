---
layout: default
title: Net Meeting 102
date: 16 October 2016, 1200 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | 2016.10.16 12:00 CET |
| Participants | PGL, JF, NB, VB, HM, TO, NP, KP, PJ, LC, SH. Apologies from MV. Minutes by JF. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 88-1 remains open until after the Overture Workshop


## Overture Language Board Status

#### RMs closed out
KP reported: The LB met on 2016-10-16. Two RMs on set1 and sequence bindings have been closed as these are now fully implemented. PL is going through all the public VDM examples to make use of the new features

#### Standard Libraries: Investigation
There is a new RM about standard libraries, which we think is interesting to discuss but not strictly an RM, so we have marked it as "Investigation". There is still some work to clarify exactly what is being requested. KP believes it's a tool mechanism to have libraries submitted by users available in the tool, along with linked inclusion (rather than source inclusion), and with the LB having a role of deciding if submitted libraries meet requirements on quality, documentation etc. It is noted that tool extensions are outwith the scope of the LB, but any change to the Community Process is within the LB's scope. The LB role would be to define what qualifies as a "good" library as part of an extended Community Process. LB members hope to clarify and report back by NM 103. 


## Status of VDMTools Development
TO reports the source tree adaptation is completed and will be published on github next week if no unexpected problem happens. The binary package will be available this month, as previously indicated. PL indicated that the binaries are to be handed out at the Cyprus Workshop.


##  Status of the Overture Components

#### Java Code Generator 
The Java code generator now provides limited support for code generation of OO models that use multiple inheritance. Specifically, the Java code generator tries to represent VDM classes as interfaces whenever it can. This feature is used in an AU project that uses VDM/publish-subscribe to model harvest operations. A more detailed description of this feature can be found [here](https://github.com/overturetool/overture/issues/606). Other than that a few corrections have been made to some of the VDM examples that bundle with the tool.

#### C# Translator 
Limited progress. Not yet integrated with Overture; effort requried to do this.  

##  Release Planning

[Overture 2.4.2](https://github.com/overturetool/overture/releases/tag/Release%2F2.4.2) was released 06 October, 2016. Next release -- version 2.4.2 -- is due by December 5, 2016.


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](https://overturetool.org/download/)

##  Publications Status and Plans

Also see [Planned Publications](https://overturetool.org/publications/PlannedPublications.html).

Workshop papers have been removed to the workshop wiki. It was noted that the page is out of date. 
VB: C code generator paper to be revisited. 

##  Any Other Business

TO reported that he has moved to Kyushu University to the end of this year. 

<div id="edit_page_div"></div>
