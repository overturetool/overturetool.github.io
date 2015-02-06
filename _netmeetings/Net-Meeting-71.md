---
layout: default
title: Net Meeting 71
date: 26 May 2013, 13:00 CEST
---


# Net Meeting 71

|||
|---|---|
| Date | 26 May 2013, 13:00 CEST |
| Participants | Peter Gorm Larsen, Peter Jørgensen, Luís Couto, Hiroski Sako, Shin Sahara, Joey Coleman |

Review Status of the Action List
--------------------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   41/?1: Video on Deploying VDM
-   59/?1: Reconsider SRA input and structure
-   63/?1: Set up new SF-based mailing lists

(Closed) Now complete; overture-users mailing list created via Nico,
Wiki updated

-   70/1: Document on Using Git

See [Using\_Git](Using_Git "wikilink"). First draft up, feedback
desired; will announce on the mailing lists.

Overture Language Board Status
------------------------------

Planning a paper on the recent language changes for the next [ Overture
workshop in Aarhus](11th Overture Workshop "wikilink").

Status of VDMTools Development
------------------------------

Status

Same as last month.

Status of the Overture Components
---------------------------------

VDMJ

Several fixes this period. The atomic statement was improved to come in
line with some detailed semantics that were discussed in the LB (and I
have an action to update the LRM to clarify this). Working with Luis on
the new POG identified some minor problems with the existing POG, which
were fixed. I made various changes to try to make VDMJ more compatible
with VDMTools (ie. stricter, usually) - some parsing and type checking
changes in cases expressions and "(not) in set" expressions, and a bug
fix to do with type accessibility. Lastly, I made a fix to do with
coverage for traces.

ASTv2 POG

Currently, the Overture POG uses a string based representation for Proof
Obligations. This is limited for other tools to come in and perform
analysis on the POs. So, the POG will be improved to support an AST
based representation of proof obligations. The new format has been
defined and the support classes have been completed. The PO classes are
currently being migrated to the new format.

ASTv2 Interface based LexTokens

The various Lex Tokens of the Overture AST were defined and implemented
directly as classes. This hindered reuse and caused significant
classpath problems with extensions. To solve this problem, the LexTokens
are being moved over to interfaces. This is a long, multi step process.
Step 1, "blind conversion" has been completed.

Development Board Status
------------------------

Overture Module Reps

There is a need to have a person responsible for each module. This rep
will have awareness of the current status of the module and any work
needed/being done. The dev board is currently working through the module
list to assign these responsibilities.

Release Planning
----------------

Overture 2.0.0

Overture 2.0.0beta2 is available on the sf.net server; it integrates the
Lex\* interface changes noted above in the components section, and the
start of the refactoring of the many assistants to remove the Java1.7
dependency. The bundle now unpacks into a subdirectory.

Remaining work includes:

-   Finishing the refactoring of the assistants to remove the Java7
    dependency
-   Standalone documentation updates
-   Internal documentation updates (help pages, about boxes, welcome
    screens, etc)
-   Sorting out OS X signing keys

This is not an exhaustive list, but the plan is still to release during
the summer.

Overture 1.2.x

The plan is still to release a final version (1.2.5) in this series with
the final 2.0.0 release.

AstCreator

JWC and KEL wish to split astCreator out of the main Overture repository
and into its own repository. The plan is to host it on GitHub and ensure
that all of the necessary configuration is done to get astCreator into
the main maven plugin repositories. With luck this will allow astCreator
to be used a little more broadly.

Community Maintenance Reporting
-------------------------------

Still looking for members to to join the team. Due to low membership,
some tasks should be re-prioritized.

Publications Status and Plans
-----------------------------

See [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------

Next Meeting
------------

30th June 2013, 1300 CEST
