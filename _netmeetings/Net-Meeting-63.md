---
layout: default
title: Net Meeting 63
date: 10 June 2012, 1300 CEST
---


# Net Meeting 63

|||
|---|---|
| Date | 10 June 2012, 1300 CEST |
| Participants | Hiroshi Sako, Joey Coleman, Kenneth Lausdahl, John Fitzgerald, Marcel Verhoef, Nick Battle, Peter Gorm Larsen, Shin Sahara |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/tracker/?func=browse&group_id=141350&atid=775371).

-   62/1: Propose rationalisation of mailing lists and similar. Closed.
    **Resolved:** two lists, overture-core and overture-users, both
    hosted on SourceForge.
-   59/1: Reconsider SRA input and structure. No progress.
-   41/1: Video on Deploying VDM. No progress.

VDMTools
--------

Version

`v9.0.2b - Thu 07-Jun-2012 10:08:32 +0900`

-   evolved Code Generation.
-   bug fixes.

Publishing in Japanese

1.  Mr. Oda and Mr. Sakoh are writing a research report in IPA/SEC. The
    report is based on their interview with Peter, Dr. Jonathan Bowen
    and others.
2.  IPA/SEC WG decided to write a booklet about Formal Method
    (especially VDM) in Japanese. The main author is Shin, and the
    second author is Dr. Keijiro Araki.

VDM Project in Japan

1.  SCSK started a new VDM project. But, the detail is a secret.
2.  Dr. Keijiro Araki started a new research project around VDM and
    formal method.

Overture
--------

VDMJ

The RM 3438625 feature from the Language Board to add map patterns was
added to VDMJ and is therefore available for informal testing. A small
bug fix went in for the parser to avoid problems with expressions like
"mk\_token()". The coverage Latex output was tweaked to detect
overloaded functions and operations and differentiate the coverage
information in the summary table.

ASTv2

We have now completed most of the implementation to the new AST except
for the interpreter. We have implemented a test suite that runs c. 4K
tests on each build. There is only a about 5 tests failing at the moment
when considering the parser, type checker and proof obligation
generator.

The build server link for the new ASTv2 version is
[1](http://overture.iha.dk:8080/job/Overture-ASTv2/) and the output
version build is located at
[2](http://build.overturetool.org/builds/overtureAst2/). To future
improve the quality of the tool we enabled coverage information to the
collected from all test cases
[<http://overture.iha.dk:8080/job/Overture-ASTv2/lastBuild/emma/>?]. A
more detailed version is also available for e.g. the type checker, (only
available when not building),
[3](http://overture.iha.dk:8080/job/Overture-ASTv2/ws/core/typechecker/target/site/emma/index.html).

Future work:

-   Fix the UML translator. Work on this is started and the plan is to
    use UML2 [4](http://www.eclipse.org/modeling/mdt/?project=uml2) from
    Eclipse so any tool that supports this can be used. (Most open
    source tools for Eclipse uses this format)
-   Interpreter. We plan to build the skeleton Monday and then during
    the week add convert the scheduling code as well. Leaving the
    expression and statement evaluation for later.
-   Eclipse RCP test. We are currently building the Overture
    IDE[5](http://build.overturetool.org/builds/overtureAst2/) but it
    needs to be tested.
-   Add VDM specifications that increase the
    coverage[6](http://overture.iha.dk:8080/job/Overture-ASTv2/ws/core/typechecker/target/site/emma/index.html)
    in the type checker.

Language Board
--------------

No issues

Release Management
------------------

Maven 2?

Following the query from [Net Meeting 62](Net Meeting 62 "wikilink"), is
there any need to maintain compatibility with Maven 2? At NM63, no-ne
suggested any cuase to maintain this.

SF.net Transition

Detail at [SF.net Transition](SF.net Transition "wikilink")

Summary: Joey would like to transition the hosting environment at
SourceForge to the new system they are developing. They plan to migrate
all projects 'in the next few months', this would just move us a bit
early. The new environment appears to be stable, and is used by the
COMPASS and DESTECS projects.

Suggested transition date in Week 24 (next week).

Development/Release Process

Not yet written up; this should be available before September's meeting.

LB Coordination

Nothing to report

Strategic Research Agenda
-------------------------

The Strategic [Research](Research "wikilink") Agenda is reviewed every
other NetMeeting.

Publication plans
-----------------

See [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------

Next Meeting
------------

2 September 2012
