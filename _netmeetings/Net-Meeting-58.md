---
layout: default
title: Net Meeting 58
date: 18 December 2011, 13h00 CET.
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 58

|||
|---|---|
| Date | 18 December 2011, 13h00 CET. |
| Participants | Nick Battle, Marcel Verhoef, John Fitzgerald, Joey Coleman, Sune Wolff, Nico Plat, Hiroshi Sako. |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/tracker/?func=browse&group_id=141350&atid=775371).

41/1 : PGL: No progress. Carried forward

52/1 : JC: Some progress, not finished. See report below.

52/2 : PGL: Progress but still not closed. Carried forward

57/1 : **Closed**: the meeting agreed that the LB is enlarged to seven
members.

57/2 **Closed**: send note to LB on status of VDM libraries. The view
(NB/NP) was that libraries were a tool matter, rather than an LB/LRM
matter.

57/3 : **Closed**: all authors have updated the publications list and
added the target conference or journal.

VDMTools
--------

The newest version is following:

-   The VDM++ Toolbox v9.0.2b - Thu 08-Dec-2011 08:26:34 +0900.

I've uploaded in Dropbox share area, and mail all of you where it is.
But, I'll delete the share area on 31th Dec. 2011.

Modified properties are followings:

1.  Change GC timing.
2.  Append /\* \*/ type comment in VDM-SL.
3.  Fixed bugs in narrow expression.

Overture
--------

**VDMJ**: Only two small changes since the last meeting. The reporting
of warnings for non-deterministic statements that include sub-statements
that may return a value was improved (some statements may not be
reached, but we don't know which). And the new "classname" function was
added to the internal library so that it can be called via VDMUtils.

**IDE**: Only small changes has been made to the IDE, mostly
improvements inside the tool which is not visible to the user.

**Overture build**:

-   We are currently working on some improvements for the maven build
    needed for the branch for the new AST. The change will mostly be in
    the way the IDE uses core artifacts (VDMJ). This should also solve
    some of the problems new users might have with eclipse or at lease
    reduce the complexity. The change will also allow us to use Maven 3
    which should have some improvements especially on the networking
    side.

**New AST**

-   AST generator is ready without the extension feature. A version had
    been made that allowed extensions but it was discovered that it was
    not good enough do to the restriction on reuse of utility (e.g. not
    possible to use utility functions made for the type check when
    implementing the interpreter).
-   Parser for VDM-SL, VDM-PP and VDM-RT is completed.
-   Type checker for VDM-SL, VDM-PP and VDM-RT is completed.
-   Proof Obligation gernerator for VDM-SL, VDM-PP and VDM-RT is mostly
    completed.
-   We hope to start implementing the new AST into the IDE this Monday
    (19 dec 2011).
-   The improved extension feature for the AST generator is ongoing but
    not completed. The idea is to subclass the base tree in the extended
    tree making all utility functions and visitors possible to use with
    the extended tree.

Release 2.0.0RC1 is expected mid January 2012, which includes these
features.

Language Board
--------------

Minutes of the last meeting are available here:
[Minutes\_of\_the\_LB\_NM%2C\_20th\_November\_2011](Minutes_of_the_LB_NM%2C_20th_November_2011 "wikilink")

There has been very little activity or progress since the last meeting.

The meeting has agreed to extend the board to seven members. Marcel
Verhoef volunteered to join, one position still open. The current board
members have opted for re-election for another one year term. The
meeting has kindly accepted that offer and reinstated the LB for the
year 2012.

Release Management
------------------

Overture 1.1.1 has now been officially released.

An initial draft of the 2012 release plan is made. You can see my
initial draft on the [SourceForge SVN
Browser](http://overture.svn.sourceforge.net/viewvc/overture/trunk/documentation/releaseplanning/),
though I am still gathering features for the broad list. Eventually the
release process will become its own document, and the feature & actions
list will be handled by something with better dependency/target tracking
than LaTeX (I will look in depth at the current bug system, though I
don't think it will suffice, and also at Trac; if necessary I will
broaden my search).

Joey is proposing to use TRAC as the tool to make the release management
easier to administer.

Overture release 2.0.0-RC1 is expected mid January 2012, which includes
the overhauled AST.

Strategic Research Agenda
-------------------------

The research agenda is reviewed at every second meeting and was
discussed last time. Since then there have only been comments from Nick
Battle, who asked whether [methods and
applications](Methods+Apps page "wikilink") could be regarded as part of
the research agenda. We await any further comments for discussion at the
next NM. Everyone is encouraged to discuss and make modifications to the
[Research](Research "wikilink") agenda pages.

We will have an interactive discussion session on the SRA at NM 59.

Publication plans
-----------------

Also see [Planned Publications](Planned Publications "wikilink"). Joey
has volunteered to maintain a list of uncoming events where Overture
papers could be submitted, everyone should add events as they become
aware of them. Nico announced that a workshop is planned at ICSE this
year focused on formal methods, he suggests that we could submit there
too.

Any Other Business
------------------

Please note that ABZ papers are due on January 14th!

Next Meeting
------------

[ January 22nd 2012, 1300 CET](Net Meeting 59 "wikilink").

   <div id="edit_page_div"></div>