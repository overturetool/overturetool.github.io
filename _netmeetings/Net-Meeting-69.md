---
layout: default
title: Net Meeting 69
date: 24 March 2013, 1300 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 69

|||
|---|---|
| Date | 24 March 2013, 1300 CET |
| Participants | Joey Coleman, John Fitzgerald, Luis Diogo Couto, Nick Battle, Nico Plat, Peter Gorm Larsen (chair), Peter Jørgensen, Shin Sahara, Sako Hiroshi, Marcel Verhoef, Ken Pierce (minutes). |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/p/overture/netmeeting-actions/).

-   41/​1: Video on Deploying VDM (no progress)
-   59/​1: Reconsider SRA input and structure (no progress)
-   63/​1: Set up new SF-based mailing lists
    -   Discussion of using googlegroups or jiscmail mailing lists as an
        alternative to West. Nico will set up overture-users mailing
        list at West (to be used that for users and announcements).
        Peter Gorm Larsen will admin it.
-   65/​1: Investigate use of Stack Overflow for VDM community questions
    (closed, successful)
-   67/1: Find new Aarhus member of the Overture LB (closed, successful)
-   68/1: Review planned and published Overture publications (closed,
    successful)

VDMTools
--------

VDMTools 9.0.2 official release! The newest major upgrade version of
VDMTools 9.0.2 was released. <http://www.vdmtools.jp/en/>

-   In the version 9.0.2, the following change is made from 8.3.1.

Change log:

-   The 64-bit version is added to Windows and Linux. (64 bits of the
    Windows versions recommend Windows 7 or later. )
-   The Mac version changes to offer of the 32-bit version and the
    64-bit version (only Intel Mac).
-   Java / C++ code generation is improved, and also the new extension
    in Java generation is also added.
-   A dynamic link function is shifted to development by Visual Studio
    2010.
-   Offer of VICE which was beta release until now is ended.
-   The correspondence to Rose is ended as a correspondence tool of an
    UML link.
-   An icon and a splash screen are changed.
-   Fixed bugs.
-   Improved stability of this software

Change of a license:

-   Three kinds of licenses, Commercial, Academic, and Lite, are
    unified.
-   The VDMTools license which is a new license can use all the
    functions for all the people free.
-   Since the license serves as a click-on contract type, please confirm
    a license, before it downloads VDMTools.
    -   Approval is automatic. A link will be added form
        overturetool.org.

Overture
--------

Status of the Overture Components

<!-- -->

VDMJ

Small bug fixed to do with inmap subtype handling and error reporting
with the location of types used in VDM++ class constructors. Checked-in
and merged with the ASTv2 branches.

Overture Language Board

The minutes of the previous LB meeting can be found here
[Minutes\_of\_the\_LB\_NM%2C\_27th\_January\_2013](Minutes_of_the_LB_NM%2C_27th_January_2013 "wikilink").

Status of the AST restructuring

Overture version 2.0.0 alpha 2 is now up in [the Overture project's
"Files" section at
SF.net](https://sourceforge.net/projects/overture/files/Overture_IDE/2.0.0-alpha2/).
Please download and test it on your favourite models; if this version
appears to be stable, we will transition to using beta tags. Also,
please note that the 'Git commit description' in the About window (and
on the slash screen) will show as Dev/2alpha1-437-g6e2a3ee. Two
interesting things: first, it should show as Dev/2alpha2, but I'm
suspect that I forgot to tag the build before testing it; second, that
string is useful for telling the developers exactly which version from
the git repository that was used to build the platform.

Most notable is that, as far as we can tell, all of the major
functionality now works, including

-   Basic project management, typechecking, debug, POG
-   Java FFI (such as in VeMo), etc
-   POViewer
-   Quick Interpreter
-   Combinatorial Testing
-   UML Conversion

This is Kenneth's 'UML2' plugin, and replaces the old umltrans plugin

-   RT Trace Viewer

This replaces the old showtrace, and is its redevelopment by Peter WV
Jørgensen, Mads von Qualen and Martin A Andersen.

Peter J has also done quite a lot of work recently to make sure that the
new interpreter supports everything that the 1.2.4 interpreter does
(largely by porting Nick's changes).

However, we have dropped the

-   old showtrace plugin,
-   old umltrans plugin,
-   old potrans plugin,
-   old proofsupport plugin,
-   and integration with VDMTools (for now?), in particular the vdm2java
    plugin.

These are all open for debate, but note that some of these plugins were
semi- or non-functional, some have already been replaced, and we hope
that some of the functionality for these can be pulled back into
Overture from the COMPASS project (and hopefully other projects). In any
case, the old code remains safe in the repository's history, even though
it is no longer in the recent builds.

Known bugs, at this point, include

-   A file with event data for the old showtrace plugin is still
    generated and should be removed
-   There are flaws in coverage highlighting coloring
-   The VDM file editor in OS X is "jumpy" and will move the cursor in
    situations where the outline is updated (sort of; we think). It will
    be fixed before 2beta.

Further notes under [Release
Management](#Release_Management "wikilink").

Next Overture Workshop at iFM 2013

Deadline extended to 6th April. One suggested paper from Newcastle has
been withdrawn, AU expects to submit all of its papers.

Language Board
--------------

No current issues. Minutes of the previous LB meeting can be found here
[Minutes\_of\_the\_LB\_NM%2C\_27th\_January\_2013](Minutes_of_the_LB_NM%2C_27th_January_2013 "wikilink").

Release Management
------------------

Overture 1.2.5

At present there are no specific plans to create a v1.2.5 release,
though Nick has commited some VDMJ fixes to the repository.

Overture 2alpha build setup

For the technically inclined, the build setup of the astv2 (Overture 2)
branch in the git repository now uses the maven-tycho plugins. This
gives us a couple of benefits:

-   Setting up a new developer's machine takes about a 1/2 hour,
    assuming a decent internet connection. See the skeleton at [Setting
    up the Development
    Environment](Setting up the Development Environment "wikilink") for
    (rather rough) instructions on how to do it. We've tested this on
    several students that have no 'inside connection' successfully: not
    only did they get the dev environment set up, but they also did it
    with no help from any of the usual suspects in Aarhus. (And they did
    so quickly; one reported taking an hour and apologized for his
    internet connection, another took a day, but admitted most of that
    was setting up a linux VM because did doesn't like developing on
    windows so much.)
-   The 'bottleneck' mentioned in the last netmeeting's minutes has been
    removed, with the import of core jars being done by the appropriate
    ide plugin.
-   With this build setup, every developer's machine is now not only
    capable of creating a standalone version of the Overture platform,
    but the result is also as close to identical to the build server's
    version as is possible.

The version number carried within the maven pom.xml configuration files
has been set **back** to 2.0.0 from 2.2.x. Steps are being taken to
ensure that we do not end up with conflicts due to the 1.2.x builds
using a 2.1.x number (confused yet? We're trying to fix that).

Publication plans
-----------------

Status of Kenneth's iFM paper updated. Sakoh to check if IPA/SEC Booklet
\#2 can be marked as completed. See also [Planned
Publications](Planned Publications "wikilink").

Any Other Business
------------------

-   Luis suggests that effort needs to be maintained to manage our
    public face( maintaining wiki, website, and so on). Luis will take
    responsibility for the website. A standing item will be added to the
    agenda for future NMs to update on the status of the
    community/site/lists.
-   The overture.org domain is currently held by a domain reseller (I
    won't say squatter...); I have no clue as to how much money they
    want for it, but is there interesting in the community to acquire
    the domain?

Next Meeting
------------

28 April 2013, 1300 CEST.

   <div id="edit_page_div"></div>