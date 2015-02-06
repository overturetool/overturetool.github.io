---
layout: default
title: Net Meeting 76
date: 26th of January at 13:00 CEST
---


# Net Meeting 76

|||
|---|---|
| Date | 26th of January at 13:00 CEST |
| Participants | Marcel Verhoef, Hiroshi Sako, Nick Battle, Joey Coleman, John Fitzgerald, Peter Gorm Larsen, Peter Jørgensen, Shin Sahara |

Review Status of the Action List
--------------------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   75/​3: Migrate NM Action Tracker to Overture Wiki. No progress.
-   75/​2: Assist with LB tracker migration. No progress.
-   75/​1: Speak with SCSK: SCSK will follow the approach taken by
    Overture for (e.g. the standard library). Action closed.
-   59/​1 : Reconsider SRA input and structure. No progress.
-   41/​1: Video on Deploying VDM. No Progress.

Overture Language Board Status
------------------------------

LB meeting held on December 15: Minutes available at
[Minutes\_of\_the\_LB\_NM%2C\_15th\_December\_2013](Minutes_of_the_LB_NM%2C_15th_December_2013 "wikilink")

The Language Board is currently in between chairs and Peter Jørgensen
will take the responsibility of sending out a meeting schedule for 2014
to the Language Board mailing list.

Status of VDMTools Development
------------------------------

VDMTools 9.0.3 release!

<http://www.vdmtools.jp/en/modules/news/article.php?storyid=27>

Status of the Overture Components
---------------------------------

VDMJ

I now believe that all of the fixes and RM changes that had been applied
to the old 1.2 series code have been migrated to the 2.0.1 branches.
This includes the recent sproadic threads and stop statement changes
from the Language Board.

Release Planning
----------------

Overture v2.0.2

We presently (21 Jan) have 41 open and 41 closed bugs attached to the
v2.0.2 milestone in the [GitHub Issues tracker for
Overture](https://github.com/overturetool/overture/issues?milestone=13&state=open).
This includes all of the migration tasks that Nick and Peter J were
working on. That is enough to make a 2.0.2 release as it is, and this
will be done soon (per Joey's time, etc). A release candidate is
available at [1](http://overture.au.dk/overture/release), for those
interested in testing it. Release notes will be prepared shortly.

Issues in GitHub

Two points, one procedural, one a constraint.

The constraint is that it doesn't seem to be possible to attach
arbitrary files to an issue in GitHub. Joey knows of a few interesting
workarounds, but none is really suitable for random users.
Unfortunately, this constraint wasn't apparent when Joey switched the
bug reports over. At the moment it's possible to upload images, and text
files can be pasted into the description (or in a supplementary
comment).

The procedural comment is that the Milestones in the issue tracker are
being used to indicate the version a bug was **fixed** in, not which
version it's being **reported** for. This change is to (hopefully!)
simplify the process of making release notes, as it is possible to
simply look at the closed issues on a milestone and see what was fixed.
It means that, when closing out a milestone on a release, there will
have to be a mass move of unfixed bugs to the next milestone. Perhaps
that will provide some incentive to cut down the number of long-lived
bugs :).

Release candidates for minor versions

Going forward, for minor versions, it is Joey's intent to announce a
release candidate to the overture-core list, and if no show-stoppers are
found, release that version approximately one week later. The idea is to
balance agility in the release cycle with verification; for minor
versions it seems that waiting for a consensus that everyone believes
the version is good takes far too long.

New buildserver

We have the new buildserver running at [2](http://overture.au.dk), and
it is producing our test builds now. Not everything is configured, but
hopefully the old buildserver will be retired soon (at which point Joey
will also get the DNS entries for the old buildserver pointed to the new
one).

Community Development
---------------------

Based on some of the points raised by Joe Kiniry at the 11th Overture
workshop there was a discussion about how to form the Overture community
and make it grow. The use of social media like Twitter and Facebook was
discussed and the impression was that for other tools projects this
approach had not been very successful.

At the end of the discussion it was suggested that some of the time for
the upcoming Overture workshop should be dedicated for addressing the
forming of the Overture community. In particular that some time would be
dedicated for presentations from different actors of the community (tool
developers, industrial users, students, outsiders etc.) in order to
present their view on this and use this as input for a discussion.

It is the responsibility of the workshop organizer to think about how to
balance this so there is still room for the technical contributions.

Publications Status and Plans
-----------------------------

See [Planned Publications](Planned Publications "wikilink") for an
updated version.

Any Other Business
------------------

Nothing for this agenda item.
