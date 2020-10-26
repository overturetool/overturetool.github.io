---
layout: default
title: Net Meeting 74
date: Sunday the 27th of October 2013 at 13:00 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 74

|||
|---|---|
| Date | Sunday the 27th of October 2013 at 13:00 CET |
| Participants | PGL (chair), NB, HS, JC(partially present), JF(partially present), SS |

Review Status of the Action List
--------------------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   PGL thinks 73/1 can be closed.
-   No progress on other current actions.

Overture Language Board Status
------------------------------

[Minutes of the LB NM, 13th October 2013](http://wiki.overturetool.org/index.php/Minutes_of_the_LB_NM%2C_13th_October_2013)

-   NB : I thinks that there are experimental versions of the stop and
    stoplist statements available. But I really need to get MV's
    agreement before tweaking things.

Status of VDMTools Development
------------------------------

newest version

The VDM++ Toolbox v9.0.3 - Mon 30-Sep-2013 11:06:15 +0900

-   fixed a bug in C++ generation. PGL can confirm that the bug fix made
    his problem go away.

Status of the Overture Components
---------------------------------

VDMJ

The following changes were made since the last NM. I'm still applying
changes to Fujitsu's command line "VDMJ" and PJ is applying the
corresponding changes to the 2.x.x branch of Overture. Note that two
recent LB RMs are now available ("stop" statements and sporadic
threads), though the new keywords for both of these need to be declared
in the Editor (ie. I've only changed the interpreter, not the editor, so
"stop" and "sporadic" are not yet highlighted keywords).

`2013-10-22 Corrections to type check of static operation guards`\
`2013-10-21 Correction for sync guards on static operations`\
`2013-09-30 Correction for two successive stop calls`\
`2013-09-27 Correction for deadlocked CT test cases`\
`2013-09-26 Correction to stopped thread handling`\
`2013-09-26 First cut of RM#18, sporadic threads`\
`2013-09-26 First cut of RM#20, thread stop statements`

Other component

-   PGL: Other components have not been improved because of main
    attention on the COMPASS side right now.

<!-- -->

-   JC: That's largely correct -- KEL and CLAUSBN have been working hard
    on some typechecker (compass) issues and that's taken 2.5weeks so
    far along with some related extension bits.

<!-- -->

-   PGL: HI who is a Janaese visitor now has been able to produce a
    pretty printer enabling Japanese support inside the lstlisting LaTeX
    environment. When we have a beta of that we will need checking from
    SS and HS.

<!-- -->

-   PGL: HI is also working on a translation from the expressions we can
    have in post conditions to the ProB constraint solver.

<!-- -->

-   PGL: In November, Kenneth will go to the ProB guys and get that
    integrated into the interpreter so we will be able to interpret
    implicit specifications.

Development Board Status
------------------------

[Reference to Development Board](https://github.com/overturetool/overture/wiki/Development-Board)

-   JC: I don't know, for that, how much wants to be
    transferred/summarized.
-   NB: Well, the only thing that I'm aware of that's happening is that
    we're close to sorting out the copyright labelling in the
    source.There's a mixture of Fujitsu, Overture and Fujitsu +Overture
    ownership.
-   NB: We need to be clear who owns what going forward. It will help us
    in future when/if we integrate more external sources.
-   PGL: At some point of time I would like us to discuss the
    possibility of moving away from GNUv3 BUT not now.
-   NB: Luis has been running with this, after I gave him lists of file
    ownerships. Well, yes that's possible, but it would involve talking
    to Fujitsu legal to change our bits.

Release Planning
----------------

Overture 2.0.0

Overture 2.0.0 is up on sf.net, but the release hasn't been announced
yet. We still need to:

1.  Run down the bug list, closing those that are definitely fixed
2.  Make the release note
3.  Update the web pages
4.  Upload the Overture Eclipse Plugin repository (so that pure Eclipse
    users can install it in a general environment)
5.  A "grand renaming" of branches in the git repository to clean things
    up (v2 is the "astv2" branch, and that will become the
    "master"+"development" branches; v1.2.x is on the
    "master"/"development" pair, and will be moved to something more
    appropriate). A warning email will go out beforehand.

This is, as usual, constrained by my time (except for the bug list).

At some point in October/November we expect to release a v2.0.2 that
includes some cleanups small fixes. I will need to run down the commit
log to see what's changed, but there have been significant changes that
to support aspects of COMPASS, and some of them may be more general. One
of the things I hope to have set up for the 2.0.2 release is code
signing for the OS X binaries.

Overture 1.2.x

I have noted that Nick has made some fixes to that branch. I would like
a clear indication of the plans for 1.2.x going forward.

1.2.5 is is the end of the 1.x.x line.

-   NB: I intend to maintain the Fujitsu sources externally, which then
    apply more easily to 1.2.5. But that need never be released. I ought
    to be able to update the astV2 interpreter too.

Buildserver

Still pending my time. (last meeting: We have a new buildserver at AU
for the Overture (and derivate projects). It's still in the process of
being configured; it probably needs 1–2 days of effort to move
everything over. The switchover should be invisible to most people,
however.)

Move to GitHub

The dev board is considering moving all code repos to GitHub (AstCreator
is there now). If you'd like to check out what it looks like, go to
<https://github.com/overturetool/overture> and have a look. It is
current as of Saturday afternoon (and moving git repositories is really
easy). I'm looking into moving the bug tracker as well; I do not have
any immediate suggestions regarding the LB tracker, the netmeeting
action tracker, or the feature request tracker (though the last could
easily be merged into the bug tracker).

Branding — COMPASS and DESTECS

Just a note for general information. The DESTECS Tool is being rebranded
as the Crescendo Tool and, similarly, the COMPASS Tool will become the
Symphony tool. New icons, web domains, etc, are being created.

Strategic Research Agenda
-------------------------

The Strategic [Research](Research "wikilink") Agenda is reviewed every
other NetMeeting.

Community Maintenance Reporting
-------------------------------

Current Status

See [Community Management](Community Management "wikilink").

-   Luis leaving to focus on development board.

<!-- -->

-   PGL: We have a suggestion for the next workshop to be held in
    Newcastle June 2014 chaired by John and Nick.

<!-- -->

-   NB: We need to agree a theme - or can it just be general Overture
    work?

<!-- -->

-   JC: That might be a good place to talk about license on the side.

<!-- -->

-   PGL: I wonder if easy start-up with overture development by
    newcommers could be a theme? That might be really good, if we have
    enough of the architecture/framework documentation together

<!-- -->

-   NB: Is this to be a workshop (useful presentations) or papers (work
    by other groups)?

<!-- -->

-   PGL: It could be a combination of presentations and "work" sessions.

<!-- -->

-   JF: I was going to suggest a focus on certain application areas like
    cyber-physical, but I wonder if we might develop Peter's idea and
    have a sort of brainstorm on the accessibility of the technology

<!-- -->

-   NB: What did you mean by "accessibility", John?

<!-- -->

-   JF: I meant "how do you get into formal modelling with VDM".

<!-- -->

-   NB: I'm very interested in industry accessibility, in that sense,
    having found it very difficult at Fujitsu.

<!-- -->

-   PGL: My feeling is that it would be good to get more new sites of
    developers involved first and then at a different event try to help
    newcommers how to develop using VDM.

<!-- -->

-   JC: Running it as a user-focussed workshop, then, with perhaps a
    side-focus (couple of hours?) on the guts of the tool? (relevant to
    modellers, fi possible?)

<!-- -->

-   PGL: Maybe it could be a start of an Overture book and brainstorming
    on what should be in that.

<!-- -->

-   NB: Well yes, I've mentioned before that I'd like to see an industry
    focussed book. And general practice too, not just "co-modelling" :)

<!-- -->

-   PGL: Maybe we should start an email exchange about this and based on
    that determine if this should be (parts of) the theme for the next
    workshop?

<!-- -->

-   PGL: I see such a book focussing on good recommendations about
    "patterns" to use in modelling under different circumstances.

<!-- -->

-   HS: Anyway i can participate the ML on that topic.

<!-- -->

-   JF: Back to the Workshop ... Perhaps it would be great to ask
    participants to offer position papers on a question or two related
    to this goal of easier adoption of VDM/Overture by practitioners.
    Related book is [Deploy
    book](http://www.springer.com/computer/swe/book/978-3-642-33169-5)

<!-- -->

-   JF: We would offer some specific advice based on experience. Perhaps
    starting more form what the reader needs to know rather than telling
    the history.

<!-- -->

-   PGL: We shall use Overture new subgroup for that email discussion.

Publications Status and Plans
-----------------------------

Also see [Planned Publications](Planned Publications "wikilink").

In preparation:

In review:

-   VDM++ Tutorial for "How to Make a Model?" seminar, IPA/SEC Seminar
    text (Shin Sahara, in Japanese, Nov. 2013)

In press:

Any Other Business
------------------

PGL: We need to find out how to improve the attendees for these NMs in
general. I think suggestions are welcome.

Next Meeting
------------

   <div id="edit_page_div"></div>