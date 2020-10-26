---
layout: default
title: Net Meeting 59
date: 22 January 2012, 1300 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 59

|||
|---|---|
| Date | 22 January 2012, 1300 CET |
| Participants | Peter Gorm Larsen, John Fitzgerald, Marcel Verhoef, Nick Battle, Shin Sahara, Nico Plat, Hiroshi Sako, Kenneth Lausdahl, Joey Coleman.  Received appologies from Ken Pierce. |

Review of Action List
---------------------

The action item list is maintained as a tracker on
[SourceForge](https://sourceforge.net/tracker/?func=browse&group_id=141350&atid=775371).

-   41/1 (pgl - video on deployment of VDM) - No progress has been made
-   52/1 (jwc - propose release plan 2012) - See Release Management
    section
-   52/2 (pgl - publish OW as ASE techrep) - Will be solved before next
    NM at new AU web-pages

VDMTools
--------

-   Newest version: The VDM++ Toolbox v9.0.2b - Thu 19-Jan-2012
    14:09:52 +0900

1.  Now, we can redefine class name in types.

-   Bug status

1.  Sometimes, the interpreter can't execute redefined records. Now,
    fixed.
2.  inv\_ functions were not static. Now, they are static.
3.  Signatures of pre\_ / post\_ functions were not generated in type
    check. Now, they are generated.

Overture
--------

**VDMJ**: A few bugs fixed this period. A parser error was fixed that
now disallows empty blocks; fixes were made to iota and exists1 to allow
them to work correctly with type binds (for finite types); a small
change to the type checker was made to better handle the type of blocks
that "return nil"; and a larger change was added to perform better
pattern matching, especially for cases where a pattern correlates the
value of a variable from two or more place in the pattern.

**IDE + AST**: A few minor bugs has been fixed. One of the bugs was with
the working directory not being set, this was introduced when fixing a
mac debugger problem. The new IDE with the new AST is also progressing,
all features are available except combinatorial testing and the quick
interpreter. There is a few minor bugs left in the type checker which
was introduced when a new location search engine was added to the IDE,
this engine handles the editor outline sync and will also open for the
implementation of more advanced completion.

Language Board
--------------

The last meeting's minutes are available
[here](http://wiki.overturetool.org/index.php/Minutes_of_the_LB_NM%2C_18th_December_2011).
The status of the language changes under review is shown
[here](https://spreadsheets.google.com/pub?key=ryibeUenlWcxrukJBlwQKuA&output=html).

Release Management
------------------

Overture 2.0.0 has clearly been delayed; integrating the new AST into
the interpreter is not yet finished.

A release plan for future features in Overture is pending some feedback
on what future features we wish to add, and who is to add them. IHA is
holding a brainstorming meeting in the coming week to work out possible
local effort.

Strategic Research Agenda
-------------------------

John Fitzgerald: The Strategic [Research](Research "wikilink") Agenda is
due to be reviewed this meeting. Everyone is asked to read the relevant
pages prior to the meeting. We well have an interactive discussion
session dedicated to its contents. If you have concrete suggestions or
comments to the SRA, please write them down here.

**NB:** Reading the second bullet on the main SRA page, it seems to say
that the strategy is to treat Overture as an experimental platform (ie.
not for stable industrial use), while VDMTools is the preferred
industrial platform. Is that the intended meaning? It seems at odds with
the description of the tools thread at the bottom of the page. The SEN
paper we wrote a few years ago talks about building a platform to
integrate VDM tools, but we don't talk about tool integration much these
days. I always thought that meant technical integration (at one time,
you could select your VDM interpreter from a dropdown in Overture), but
perhaps now it means that Overture is an umbrella term for various
related VDM tools? Can we clear this up?

**JSF:** This reflects where we were a few years ago, before DESTECS and
COMPASS got going. I think we were trying to say that we were targeting
our research activity on making Overture an attractive platform for
interesting extensions (e.g. in verification, testing, domain-specific
modelling) that woudl arise primarily through research projects. If we
intend Overture to be developed towards industry-readiness, is that part
of the strategic research agenda?

**NB:** Also in the second bullet, it specifically mentions OO models
and distributed/RT aspects as strategic. Does that mean non-OO VDM
specification is deprecated in the strategy, or are we just responding
to the current DESTECS type projects that are OO/RT. Does this mean the
OO/RT aspects of the semantics thread have greater urgency?

**JSF:** I don't think that the emphasis on OO/RT is especially
appropriate now - it may have been more of a leading concern a couple of
years ago. One observation from DESTECS is that VDM-SL definitely has a
place.

**MV:** Removed several typos from the main page. It could use a simple
graphic that visualise the main strands. More appealing then just text,
in any case.

**MV:** Semantics sub-page: no reference to interest into probabilistics
while this seems a logical next step. Furthermore, the link to (and the
role of) the LB is missing. Who's *in control* of the language?

**JSF:** If we want to make stochastics part of our agenda, that's fine.
It may be worth a workshop that looks at appropriate directions to take.
In my experience, this needs to be thought through very carefully
indeed, as it can become a semantic minefield. You need to be very
precise about what you want stochastic analysis for, and what kinds of
analysis you wish to do. For me, it makes most sense in the embedded
systems domain.

Publication plans
-----------------

See [Planned Publications](Planned Publications "wikilink").

Any Other Business
------------------

John Fitzgerald: Consider moving future NMs to Skype (text only, not
video or audio in general). This has some advantage of making screen
sharing possible for demos etc. For many of us, skype has become the
norm for NMs in other projects as it appears to be more reliable for
users on Macs. Against this, we do not have skype ids for all the
typical Overture meeting participants.

**All:** Agreed, next NM will be on Skype.

John Fitzgerald: Consider moving the NM action list from SF to this
Wiki. Upside: it's one less window to have to have open in the NM.
Downside: maybe we lose some tracking facilities (like all those useful
emails that we receive when they change :-))

**All:** We keep the procedure as-is, just using a deep-link from the
minutes to the SF action list. If action holders report progress prior
to the NM then any discussions can be easy to edit during the NM.

Shin Sahara:

1.  We SCSK Corporation got a new customer that is network software
    company.
2.  IPA/SEC( <http://www.ipa.go.jp/index-e.html>)
    1.  held the formal method seminar in Kumamoto city. We got some
        future users of VDMTools.
    2.  starts a new small research project. The project was knocked
        down to my former company SRA(Mr. Oda) and Mr. Sakoh. So,
        they'll contact with Peter and Marcel. I'm the chief examiner of
        the SEC Working Group for this project, and Dr. Kurita is the
        vice-examiner :-)

Next Meeting
------------

[Net Meeting 60](Net Meeting 60 "wikilink"): February 26th 2012, 1300
CET.

   <div id="edit_page_div"></div>