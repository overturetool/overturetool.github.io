---
layout: default
title: Net Meeting 54
date: 14 August 2011, 1030 CET
---

<script src="https://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 54

|||
|---|---|
| Date | 14 August 2011, 1030 CET |
| Participants | Peter Gorm Larsen, Nick Battle, Shin Sahara, John Fitzgerald, Marcel Verhoef. |

Review of Action List
---------------------

-   38/2 (strategic research agenda - jsf) : carried forward (JSF+PGL to
    review before next NM)
-   41/1 (video on deploying vdm - pgl/mv/jsf/nb) : carried forward
-   52/1 (propose release plan at the June 2011 Workshop): only
    discussed informally at the workshop. Action revised to target 1
    November.
-   52/2 (publish June 2011 OW as an ASE Tech Report): carried forward

VDMTools
--------

See detailed report from Shin Sahara (sent to the overture-core mailing
list) for the latest on VDMTools from Japan. A large number of
smaller-scale but very positive engagements. Shin reported the set up of
a VDM Working Group as part of the Dependable Software Forum (DSF)

Overture
--------

IDE

See detailed report from Kenneth Lausdahl and August Ribeiro (sent to
the overture-core mailing list) for the latest news on the Overture IDE.
Since the IDE release only a single change has been made optimizing the
update of the navigator.

Language Board

RMs are up in for community discussion. People should actively discuss
the outstanding issues.

Action 54/1: LB to place minutes on the Wiki in future.

Release of version 1.1

Agreed to announce this minor release in a "small splash" way to VDM
Forum + twitter + all overture users.

AST Restructuring

See detailed report from Kenneth Lausdahl and August Ribeiro (sent to
the overture-core mailing list) for the latest news on the AST
Restructuring. This has turned out to be a larger task than originally
envisaged.

"As you all might know we started the work on creating a new generated
AST with visitor support for Overture. So far we have completed the AST
definition and implemented changed VDMJ parser to create the new tree.
Implemented the type checker so that it can check all but a few of the
examples SL models in the same way as VDMJ does it. It can also check
the CSK Test suite where only a few models give errors and about 50
models fail, however almost all of the 50 failures are just an offset in
the reported location of warnings and errors which is not a big deal to
fix.

The derived AST stuff we have been discussing turned out to be a bad
idea (We implemented it for the interpreter). Here is what we discussed
doing: We have a tree AST1 which has some structure, then we would
create a new AST2 which has the same structure but new Java classes with
no relation to AST1. This turned out to be a bad idea because e.g. the
interpreter would need some functionality already implemented in the
type checker e.g. the type comparator. The result of this was
re-implementing the same functionality used to do some work based on the
AST (In our case this might be quite a lot of code which then would be
duplicate classes just taking a different Java class name with the same
structure).

We changed most of the interpreter to the new AST (Which is an extended
copy of the AST from the Type Checker). Missing are a few places where
parsing and TC is done plus the two visitors evaluating the expressions
and statements, however this work is relatively easy. The main part
missing is that we need to change the AST so that it both extends the
type checker AST and allows new stuff to be added. We have a solution
for this but is a bit more complicated than the original idea since Java
doesn’t have multiple inheritance."

Publication plans
-----------------

Please ensure that the Planned Publications page [Planned
Publications](Planned Publications "wikilink") is updated, and that any
published papers are available on the Overture wiki [Overture
Publications](Overture Publications "wikilink")

AOB
---

No other business.

Next Meeting
------------

Next meeting is due on September 18th 2011, 1300 CET

   <div id="edit_page_div"></div>