---
layout: default
title: Net Meeting 44
date: 13 June 2010, 1300 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 44

|||
|---|---|
| Date | 13 June 2010, 1300 CET |
| Participants | Peter Gorm Larsen, John Fitzgerald, Marcel Verhoef, Shin Sahara, Hiroshi Sako, Kenneth Lausdahl, Augusto Ribeiro, Nick Battle, Nico Plat, Ken Pierce, Carlos Vilhena, Miguel Ferreira (12 persons) |

Review of Action List
---------------------

-   38/2 (strategic research agenda - jsf/mv) : carried forward
-   39/1 (define type inference - pgl/nb) : carried forward
-   41/1 (notes on deploying vdm - pgl/mv/jsf/nb) : carried forward
-   43/1 (organise NM after astgen delivery - pgl/kl/mv/ar) : carried
    forward

VDMTools
--------

See detailed report of Shin Sahara (sent to the overture-core mailing
list) on the latest and greatest on VDMTools from Japan. Experimental
additions have been made to the notation to support "any"-type pattern
(denoted with a question mark) and some major companies in Japan have
showed (renewed) interest in VDM for commercial applications.

Overture
--------

IDE

Kenneth and Augusto have removed the dependency from the Eclipse DLTK
components and this is now available in the 0.2.1 release of the
Overture tool. Everyone is asked to start testing this release and
provide feedback and submit bugreports (if any). There still exists a
synchronisation problem in the handling of concurrent tasks in the VDMJ
interpreter for the RT extensions. The root cause has not yet been
determined.

ASTGEN

Marcel has released a stable version of treegen (used to be called
astgen) that should implement our requirements with respect to strict
decoupling of the plug-ins that manipulate the parsed syntax tree. Next
steps are to move the treegen tool to the maven build structure (action
by marcel) and then start work on changing the parser. Decision was
taken to drop the lex/yacc based Overture parser and continue work on
the VDMJ recursive descent parser and retrofit treegen in there. This
work will be done by Kenneth and Augusto, with help from Marcel
(treegen) and Nick (vdmj) when required. The aim is to split up VDMJ
into seperate components for parsing, type-checking and interpreting.

LANGUAGE BOARD

The minutes of the language board were briefly discussed. New action
44/1 was raised to initiate a dicussion on how to structure and
coordinate the development of the language semantics. The status of the
upcoming Overture workshop on semantics (13 september at London) was
briefly discussed and is being prepared by Sune, Ken Pierce and Nico.

Publication plans
-----------------

See [Planned Publications](Planned Publications "wikilink") (page has
been updated). The Japanese translation of the *Validated Designs* book
is due very soon.

Any Other Business
------------------

Kenneth announces that they have investigated moving the Overture
web-site and wiki from twiki to drupal and mediawiki for better security
and structuring.

Next Meeting
------------

Next meeting is due on Sunday 25 July, 13h00 CET.

   <div id="edit_page_div"></div>