---
layout: default
title: Net Meeting 62
date: 6th May 2012, 1300 CET
---


# Net Meeting 62

|||
|---|---|
| Date | 6th May 2012, 1300 CET |
| Participants | Peter Gorm Larsen, Sune Wolff, Augusto Ribeiro, Kenneth Lausdahl, Joey Coleman, Nick Battle, Nico Plat, Marcel Verhoef |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/tracker/?func=browse&group_id=141350&atid=775371).

-   59/1: Reconsider SRA input and structure
-   41/1: Video on Deploying VDM

No change to items this time.

VDMTools
--------

The newest version
:   The VDM++ Toolbox v9.0.2b - Tue 24-Apr-2012 08:51:01 +0900

Publishing
:   My paper was accepted to Sofware Symposium 2012.

    :   The title is "VDM++ specification as structured Japanese
        Requirement specification"

VDM Team
:   Same as last month.

VDM Project
:   Dr. K and Mr. Ueki are working to improve code generation for SCSK
    software factory.
:   IPA/SEC "formal specification and strict specification WG" is
    active.
:   IPA/SEC "formal method training WG" is active too.

VDM Sales
:   We got a VDM training from a subsidiary of FUJITU :-)

    :   I have to teach Overturetool and VDMTool.

Overture
--------

VDMJ

Changed "old" variable processing for postconditions to copy only
affected state. This is more efficient and corrects a problem found with
accessing old-inherited state. Corrected pattern handling for empty
sequence/sets.

ASTv2

The parser and type-checker were synched with VDMJ. Next steps are
implementing the test framework that thoroughly tests the parser and
type-checker and start the interpreter implementation.

VDM 2 UML translator

The VDM 2 UML translator is in process of being changed to use the ASTv2
parser.

Language Board
--------------

4 RMs presently in Discussion, but need more consideration.

Release Management
------------------

Source code in Git

The entire Subversion repository has been migrated to Git on
sourceforge, and a page explaining basic Git usage is partially written
at [Using Git](Using Git "wikilink"). The devs at IHA have migrated
their work, however, configuration of Nick Battle's setup is unfinished.
For the moment it is possible to synchronize between the old SVN repo
and Git (but this isn't a great long-term solution). Part of the push to
shift to Git has to do with the proposal for the Release Process, below.
Joey is available –as time permits– to help assist anyone who needs to
transition their build setup.

Release Process proposal

***This is a proposal, comments desired — this will be written up into a
wiki page for comment before the next core netmeeting***

Note that one of the strongest features of Git is its handling of
branches –parallel streams of development– both 'cheaply' and with
clearer history tracking as compared to Subversion. Branches are not
reflected in the file structure of the repository, but rather as names
pointing to specific version in the history.

1.  All development on the overture platform should be done in branches
    dedicated to a particular person or feature. So, the work on the
    ASTv2 is done in the *astV2* branch; Joey's effort to sort out the
    maven build setup was done in a branch called *Pruning*, and that
    branch has since been deleted as it was merged back into the
    *master* branch.
2.  The *master* branch is to be used only to merge in stable features
    and bugfixes as they become ready for a release of the Overture
    tool. If possible, changes to the master branch will be restricted
    to a small handful of people; otherwise, the nature of Git makes it
    possible to omit changes which ought not have been made to *master*.
3.  Breaking the build in the *master* branch should be considered a
    grave sin.
4.  New development should happen in a branch named for either the
    developer (e.g. *jwc*, *ari*, etc), the feature (e.g. *astV2*,
    *VDMJ-Dynamic-Reconfig*), or, best, a combination of name and
    feature (e.g. *jwc-maven-fixes*). The rationale behind the last is
    that it makes it easy to identify both the feature and a contact
    person.
5.  It is still a bit unclear where bugfixes should happen. For very
    small bugfixes it seems acceptable to work directly in *master*, for
    larger problems a new branch should be created.
6.  Before any major feature is merged into the *master* branch, the
    developer should merge **from** the *master* branch into their
    feature branch, then contact a release manager (i.e. the small
    handful of *master* branch maintainers) to arrange to merge their
    work into the main development tree.
    -   This implies that the release manager must coordinate these
        features merges with an eye to reducing the amount of disruption
        it will cause in other branches.
    -   This also suggests that it's a good idea for feature branch
        developers to merge from the *master* branch to keep up to date
        and reduce the effort required to merge the feature back into
        the main development tree.

7.  Branches that are *done* should probably be deleted. Note that this
    does not delete any history! It only removes a convenient name for
    referring to the branch.

Build Machinery

The Git *master* branch now has a maven configuration such that **mvn
install** in the project root will now properly compile the Overture
source. Further, **mvn eclipse:eclipse** (mostly) does what we expect
and gives us an environment that we can use for development. Version
number increments can now be done in a very small handful of places, and
can be automated with a small number of commands (which are documented
in the repository). We are able to compile a working version of the tool
that we've tested on Windows and OS X.

One major change resulting is that we now depend on maven 3 for the
build of the IDE portion of the source tree. We've not yet investigated
how much effort it would be to make it work with maven 2; feedback would
be welcomed as to whether this is necessary (for new developers,
probably not; the question relates more to present needs). As far as we
are aware, maven 2 still works in the core portion of the source tree.

The development pages on the wiki will be updated soon, in light of both
the transition to Git and the update to the maven setup.

***Action for all: feed back on necessity of Maven 2 to Joey***

LB Sync

[https://sourceforge.net/tracker/?func=detail&aid=3438625&group\_id=141350&atid=1127184
RM
3438625](https://sourceforge.net/tracker/?func=detail&aid=3438625&group_id=141350&atid=1127184 RM 3438625 "wikilink")
has been added to the Release Planning document, but it remains
unscheduled for the usual resourcing reasons.

Confusions about announcing Overture to outsiders
-------------------------------------------------

Present situation is confusing — we have a number of mailing lists in
different places, and their purposes aren't clear. Also, the 'correct'
way of getting in touch with the community is not presently clear.

Nick Battle to take an action (62/1) to summarise current state and
propose a better state of affairs.

Publication plans
-----------------

Discussed, see [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------

Overture Workshop at FM2012

Hoping for more submissions at the moment, we may have to consider some
changes in the plan for the day.

Next Meeting
------------
