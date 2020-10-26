---
layout: default
title: Net Meeting 64
date: 7th October 2012, 1300 CEST
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 64

|||
|---|---|
| Date | 7th October 2012, 1300 CEST |
| Participants | Peter, Nick, Augusto, Joey, Shin |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/tracker/?func=browse&group_id=141350&atid=775371).

-   63/1: Set up new overture-core and overture-users mailing lists on
    SourceForge.
    -   Still open: the sf.net list hosting puts ads into the messages;
        this is not a great solution. We are open to other suggestions
-   59/1: Reconsider SRA input and structure.
    -   Ongoing.
-   41/1: Video on Deploying VDM.
    -   Ongoing.

VDMTools
--------

Version

-   v9.0.2 - Wed 03-Oct-2012 14:12:34 +0900

1.  Evolved for code generation.
2.  Fixed a bug in curried function.
3.  Fixed bugs in case of using "overload" and "override" both. Still,
    we can't call abstract functions/operations, from outside of
    super-sub tree objects.

Modifications

-   VDMUint : Appended following functions for code generation. We think
    that these functions should move to other file, but now they are in
    VDMUtil.vpp file.

`-- Convert a char into a UTF16 code value.`\
`static public`\
`char2code: char -> nat`\
`char2code(c) == is not yet specified;`

`-- Convert a UTF16 code value into a char.`\
`static public`\
`code2char: nat -> char`\
`code2char(c) == is not yet specified;`

`-- Get current time in miliseconds since Jan. 1, 1970`\
`static public`\
`current_time: () ==> nat`\
`current_time() == is not yet specified;`\
`end VDMUtil`

Overture
--------

VDMJ

The changes for the recent RMs to allow expressions in cycles/duration
and periodic statements were made. A bug fix was applied to allow for
the correct monitoring of obj.field expressions in sync guards
(previously, guards did not notice changes to such expressions). A small
POG fix was made regarding the handling of seq1 types (they cannot be
empty, so hd/tl will always be safe). Another small fix was applied to
make more sensible error messages for set/seq values.

ASTv2

It was noted that we are short of hands to work on ASTv2 currently, with
Kenneth at MIT and Augusto moving away. There may be folk to pick up
this work early next year, but there will inevitably be a period where
progress is slow while people learn their way round the code.

No other component progress reported.

Language Board
--------------

Progress reported via the last LB NM meeting minutes
[here](http://wiki.overturetool.org/index.php/Minutes_of_the_LB_NM%2C_9th_September_2012)

Release Management
------------------

Most of the items in this section relate to actions in the month
following the last NM.

#### SF.net transition

We transitioned to the new SF.net project hosting platform shortly after
the last netmeeting; this appears to have been mostly painless, though
the LB tracking numbers ended up changing. To the best of my (Joey's)
knowledge, this was unavoidable; happily, the number of LB items numbers
in the 10's rather than 100's or more.

#### Overture 1.2.2

We have the version 1.2.2 release of Overture ready but for the release
notes; those will be made as time allows. Joey proposes that this be the
penultimate release of the 1.2.x series, with 1.2.3 catching any last
fixes in that series.

#### Overture 2.0.0alpha1

We also have the first ASTv2 alpha ready for review and testing, and
this version should be essentially feature-complete. As with v1.2.2, its
proper release awaits release notes. The general hope is that all future
development be done on the ASTv2 versions, though we still have a few
small from Nick to pull in. The CML tool being developed in the COMPASS
project is already developing using this version.

#### LB Coordination

Nothing to report.

Strategic Research Agenda
-------------------------

The Strategic [Research](Research "wikilink") Agenda is reviewed every
other NetMeeting.

Publication plans
-----------------

See [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------

Peter mentioned that he will be presenting at a seminar on Formal
Methods in Industry in Japan later in October
[1](http://sec.ipa.go.jp/seminar/2012/20121023.html).

Next Meeting
------------

The next meeting for the 11th November will be cancelled. Peter and Joey
cannot make it, and many folk will have met up in Aarhus the weekend
before in any case.

   <div id="edit_page_div"></div>