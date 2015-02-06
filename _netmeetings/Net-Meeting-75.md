---
layout: default
title: Net Meeting 75
date: 13/12/01
---


# Net Meeting 75

|||
|---|---|
| Date | 13/12/01 |
| Participants | Joey Coleman, Ken Pierce, Marcel Verhoef, Nick Battle, Peter Gorm Larsen, John Fitzgerald, Hiroshi Sako,  Peter Jorgensen, Shin Sahara, Luis Diogo Couto (minutes) |

Review Status of the Action List
--------------------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   41/1: No progress
-   59/1: No progress
-   70/1: Completed. Git documents are live on this very wiki
-   73/1: Completed. Dev board activity has been made clear

Overture Language Board Status
------------------------------

LB meeting held on Nov 10: Minutes available at
[Minutes\_of\_the\_LB\_NM%2C\_10th\_November\_2013](Minutes_of_the_LB_NM%2C_10th_November_2013 "wikilink")

Next meeting will be held on Dec 15 - the year's last

A new convener has not yet been selected. One will be chosen (along with
a secretary) at the beginning of the new year

Status of VDMTools Development
------------------------------

DB Brothers

SCSK released following frameworks and library. Following SCSK pages are
in Japanese. Japanese VDM people will translate someday.

<http://www.vdmtools.jp/modules/wfdownloads/viewcat.php?cid=15>
(Japanese page)

-   DBI Library: The DBI library is a DDL to access RDB through ODBC.
    <http://www.vdmtools.jp/doc/vdmLib/DBI.html> (Japanese page)
-   DB Framework: The DB framework is the VDM++ interface to simulate
    RDB access. <http://www.vdmtools.jp/doc/vdmLib/DBFramework.html>
    (Japanese page)
-   SQL Framework: SQL framework is the framework to generate SQL
    statement from VDM++. <http://www.vdmtools.jp/doc/vdmLib/SQL.html>
    (Japanese page)

The LB has had no input into the creation of these libraries. Better
coordination is needed. Shin will take an action speak with SCSK to this
effect (see action
[https://sourceforge.net/p/overture/netmeeting-actions/108/
here](https://sourceforge.net/p/overture/netmeeting-actions/108/ here "wikilink")).

Status of the Overture Components
---------------------------------

VDMJ

The following bug fixes have been made to VDMJ since the last meeting.
They will be pulled into the 2.0 branch in due course:

`2013-11-27 Correction to atomic evaluation with class invariants`\
`2013-11-22 Correction to satisfiability POs`\
`2013-11-21 Removed the "nil" type from the parser`\
`2013-11-19 Allow breakpoints on class invariant expressions`\
`2013-11-16 Correct type checking of static calls to non static operations`\
`2013-11-15 Allow static operation postconditions to use "old" static data`\
`2013-11-11 Corrected scheduling policy unfairness that affects stop ordering`\
`2013-11-11 Only allow stop to work on the same CPU as the caller`\
`2013-10-30 Fix breakpoints with "for" statement without "by" clause`\
`2013-10-30 Correction to type checking of nil returns`\
`2013-10-28 Type checker correction for "while true" loops`

Overture Ide-2.0.1-SNAPSHOT

We met error (! Too many }'s.) in LateX process of Japanese VDM++ model.

We met some internal errors in debug of Japanese models.

Reporting of errors issues is difficult since the models and errors are
in Japanese but bug reports will be filed in the new GitHub tracker.

Synch between Overture and VDMJ

Peter J has been porting NB's VDMJ fixes over but the progress is slow.
NB will try and help more with this process. NB will become more
familiarised with ASTV2 so that the fixes can be done directly.

New features

Interpretation of post conditions is expected to available sometime
before the end of the year. Some problems

Release Planning
----------------

Overture 2.0.0

*still in holding state*

Overture 2.0.0 is up on sf.net, but the release hasn't been announced
yet. We still need to:

1.  Run down the bug list, closing those that are definitely fixed
2.  Update the web pages
3.  Upload the Overture Eclipse Plugin repository (so that pure Eclipse
    users can install it in a general environment)

This is, as usual, constrained by my time (except for the bug list).

At some point in December we expect to release a v2.0.2 that includes
some cleanups/small fixes. I will need to run down the commit log to see
what's changed, but there have been significant changes that to support
aspects of COMPASS, and some of them may be more general.

An email will be sent out to Overture users announcing the new version
sometime during the upcoming week.

Move to GitHub

The move happened on Thu 21 Nov; many of you will remember this date as
the day your inbox suddenly received 1000 emails. Other than that, the
move went smoothly and is now complete. The repository is at
<https://github.com/overturetool/overture> and the issue tracker is at
<https://github.com/overturetool/overture/issues>. Crescendo (DESTECS)
has been on GitHub for a couple weeks longer, and Symphony (COMPASS)
will likely be moved in December.

Note: only the Overture *'bug* tracker has been moved. The trackers for
the LB, NM actions, and features are still on sf.net; I'm open to
discussing moving them, but for the LB and NM trackers it's not clear to
me how they should be moved. However, the features tracker will probably
migrate onto GitHub and be integrated in with the bugs, as the issues
feature there naturally integrates bugs and feature requests.

Strategic Research Agenda
-------------------------

The Strategic [Research](Research "wikilink") Agenda is reviewed every
other NetMeeting.

Publications Status and Plans
-----------------------------

Some new papers added and others moved to published (yay!).

Overture Workshop TR is expected soon.

CODES book will go to the publisher today. Should be out soon.

Also see [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------

Community Building

The discussion on community building has been resumed. Most agree that
it is something that we need to work more on. Community building will
now be a standing item in future NMs.

Infrastructure

As part of the move to GitHub, we need to decide what to do with the NM
and LB trackers.

-   The LB will its own tracker on GitHub but in separate repository.
    JWC will help with this -
    [https://sourceforge.net/p/overture/netmeeting-actions/109/
    action](https://sourceforge.net/p/overture/netmeeting-actions/109/ action "wikilink").
-   The NM tracker will be migrated to the Overture wiki. MV will take
    care of this -
    [https://sourceforge.net/p/overture/netmeeting-actions/110/
    action](https://sourceforge.net/p/overture/netmeeting-actions/110/ action "wikilink").

JWC, MV and KP will meet and make a plan to harmonise the Overture
infrastructure.
