---
layout: default
title: Net Meeting 60
date: 26 February 2012, 1300 CET
---


# Net Meeting 60

|||
|---|---|
| Date | 26 February 2012, 1300 CET |
| Participants | Kenneth Lausdahl, Shin Sahara, Hiroshi Sako, Nick battle, Joey Coleman, Nico Plat, Ken Pierce, Peter Gorm Larsen, John Fitzgerald. |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/tracker/?func=browse&group_id=141350&atid=775371).

-   41/1 (pgl - video on deployment of VDM) ongoing
-   52/1 (jwc - propose release plan 2012) Closed. Release Mgmt is a
    regular feature of meetings now.
-   52/2 (pgl - publish OW as ASE techrep) ongoing, but expected to
    close on 1 March

VDMTools
--------

New version is following:

` The VDM++ Toolbox v9.0.2b - Wed 15-Feb-2012 09:38:43 +0900`

Bug fixes:

1.  Aborting if of cyclic type definition fixed.
2.  Aborting in Java2VDM fixed.
3.  Improving Java code generation in trap statement, etc.

VDM Project:

1.  IPA/SEC(http://www.ipa.go.jp/index-e.html
    <http://www.ipa.go.jp/index-e.html>) start the Strict Specification
    Description Project and Working Group. I am the chief examiner of
    the Working Group, and Dr. Kurita is the vice-examiner.
2.  IPA/SEC continues another 2 working group on the Formal Method, and
    I am a member of these groups.

VDM Team:

`VDM Team donkeys are in stable, and stable :-)`

Overture
--------

**VDMJ:** Several small bug fixes or enhancements this period. A fix was
made to "cases" statement type checking to note that they may drop
through and not return a value; an internal change was made to the way
VDMJ handles constant and updatable values (fixed by Augusto - thanks!);
some unit tests were added for recursive measures; unused SL imports now
raise warnings, like other unused definitions; you can now set
breakpoints on "errs" clauses; SL state invariants are now checked even
if there is no "init" clause defined, and you can put init and inv
clauses in either order in a state definition (I got fed up of getting
this wrong).

Language Board
--------------

Anne Haxthausen has joined the LB. Thanks to Anne and the rest of the
LB.

Release Management
------------------

I would like to close action 52/1 as this is an ongoing process with a
regular agenda item, and the current state of the release plan will be
reported in these netmeetings.

The Release Plan in the [SourceForge SVN
repository](http://overture.svn.sourceforge.net/viewvc/overture/trunk/documentation/releaseplanning/)
has been updated to include elements from the LB RM spreadsheet. At
present there are four items in execution phase, however, I am not aware
of anyone actively working on implementing these features, so there are
no expected completion dates. This inclusion of the LB's RM items
follows a conversation with Nico Plat about the status and semantics of
their tracking spreadsheet.

There will be a DESTECS 1.3.0 (Monday) Overture 1.2.0 release appearing
during the coming week. KEL has returned from Portugal, so finishing the
new AST is now high priority.

If there is any particular information that is desired from the Release
Plan, an explanation of your needs, in terms of what information you
need to get from the release plan, would be appreciated.

Strategic Research Agenda
-------------------------

Not on the agenda for this meeting.

Publication plans
-----------------

See [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------

Next Meeting
------------

1 April 2012, 1300 CET.
