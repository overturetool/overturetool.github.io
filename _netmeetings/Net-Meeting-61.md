---
layout: default
title: Net Meeting 61
date: 1 April 2012
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 61

|||
|---|---|
| Date | 1 April 2012 |
| Participants | Peter Gorm Larsen,  John Fitzgerald, Kenneth Lausdahl, Nico Plat, Shin Sahara, Joey Coleman |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/tracker/?func=browse&group_id=141350&atid=775371).

-   [https://sourceforge.net/tracker/?func=detail&aid=3477348&group\_id=141350&atid=775371
    59/1](https://sourceforge.net/tracker/?func=detail&aid=3477348&group_id=141350&atid=775371 59/1 "wikilink"):
    Reconsider SRA input and structure
-   [https://sourceforge.net/tracker/?func=detail&aid=3288530&group\_id=141350&atid=775371
    52/2](https://sourceforge.net/tracker/?func=detail&aid=3288530&group_id=141350&atid=775371 52/2 "wikilink"):
    Publishing OW as an ASE Tech Report
-   [https://sourceforge.net/tracker/?func=detail&aid=2947048&group\_id=141350&atid=775371
    41/1](https://sourceforge.net/tracker/?func=detail&aid=2947048&group_id=141350&atid=775371 41/1 "wikilink"):
    Video on Deploying VDM

VDMTools
--------

1.  The newest version
    -   vdmpp-9.0.2b-120326
        -   Code Generation modified. But, only dr.k knows changes :-\<

2.  Publishing = nil
3.  VDM Team
    -   Mr. Ogawa left the VDM team.
        -   He became the president of a subsidiary company.
        -   He thinks to use VDM in his company.

4.  VDM Project
    -   IPA/SEC started a new working group that relates VDM and strict
        specification.
        -   Mr. Sakoh and Mr. Oda become the member of the WG.
            -   Mr. Oda was a pupil of Prof. Araki.
        -   Already, Mr. Kurita and I are the member.
    -   IPA/SEC continues the the formal method training WG .
        -   Prof. Araki, Mr. Kurita and I are the member.

5.  VDM Sales = nil

Overture
--------

**VDMJ**

Just some minor tweaks and fixes this period. There was a fix to SL to
allow "old" state to be referred to in a postcondition as a whole (eg.
Sigma\~) as well as individual state items; the binary operators were
changed so that stepping the debugger only stops "on" the left and right
expressions rather than on the operator itself - this makes for much
more sensible stepping through very long chains of "and" clauses (for
example); made a small fix to the way complex sequence comprehensions
work, after Shin spotted a bug :)

Language Board
--------------

[https://sourceforge.net/tracker/?func=detail&aid=3438625&group\_id=141350&atid=1127184 RM 3438625](https://sourceforge.net/tracker/?func=detail&aid=3438625&group_id=141350&atid=1127184 RM 3438625 "wikilink") Append pattern

Announced for discussion by Sune on 26 March; agreed in meeting that it
can be moved to execution.

Release Management
------------------

Releases

Versions 1.2.0 and 1.2.1 have been released, the latter being a very
minor bugfix. There was an issue with dependencies in the build of the
latter, but that has been sorted, and that particular problem will not
recur.

Upcoming Bits

The ASTv2 transition is now a focus, and we will have that integrated
and released as soon as possible.

Version control for the source code is switching from SVN to Git on
sourceforge; IHA and Nick Battle are testing the workflow at present.
Joey will watch for changes in the SVN tree, but all further development
should happen in the Git repository. The primary motivation for the
transition is to allow better management of parallel streams of
development.

Strategic Research Agenda
-------------------------

The Strategic [Research](Research "wikilink") Agenda is reviewed every
other NetMeeting.

Publication plans
-----------------

Please update [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------

None

   <div id="edit_page_div"></div>