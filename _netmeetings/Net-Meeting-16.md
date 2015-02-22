---
layout: default
title: Net Meeting 16
date: 4 March 2007, 1200 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 16

|||
|---|---|
| Date | 4 March 2007, 1200 CET |
| Participants | John Fitzgerald, Peter Gorm Larsen, Hugo Macedo, Shin Sahara, Marcel Verhoef |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   13/2 is ongoing and is an expected outcome of the Mondex work.
-   14/2 remains open. Discussed further when considering the research
    agenda.
-   15/2 open. Thomas is still not finished with his SS work and the
    talked completion date is end of April.
-   15/3 open.
-   15/4 open.
-   15/5 closed. Done.

VDMTools
--------

Status of VDMTools development
:   The proof obligation generator spec to take the new VICE extensions
    into account was updated by Peter. Shin will make bug reports of it
    at the end of March.

<!-- -->

Bug reporting for VDMTools bugs
:   A URL is being set up for bug reports and Shin will report on how to
    access and use it.

-   **Action 16/1** Shin to report on VDMTools bug reporting usage.

Overture
--------

Status of Thomas' work on the Overture type checker
:   Thomas is almost finished with his work but he needs to concentrate
    on his thesis writing at the moment. He has not dealt with
    operations, inheritance and instance variables and probably he will
    not get time to do that. His focus has been on investigation whether
    it is possible to do type derivation in the same way as for ML for
    polymorphic functions and typeless functions. This is not a problem
    for the other work on the tools.

<!-- -->

Status of Hugo's work on the Overture interpreter
:   Hugo sent a short report on the actual achievements on the Overture
    Interpreter which are the confirmation of the feasibility of the
    ideas that precede his project. One idea is to translate the OML
    classes to byte code and use JVM to debug; the alternative is to
    specify our own Virtual Machine refactoring and reusing some actual
    specifications. The second approach is being studied. Further
    feedback on the vital decision between JVM or the internal approach
    will be given off line by Marcel.

<!-- -->

Status of Sander's work on the Overture proof support
:   Sander was travelling, so John reported. We can generate and prove a
    PO from the simplest case study and are making progress at
    generating theories and tactics sufficient to deal with more complex
    ones. The hardest are those with an existential quantifier because
    of the need to generate a witness value. The various improvements
    that have taken place between HOL98 and HOL4 are making some aspects
    of the project simpler than we expected.
:   Sander's visit to Ncl took place last week and was well timed. Cliff
    and John are investigating characterizations of LPF and they had a
    visit from Jim Woodcock on the same subject. So there was a chance
    for Sander to see something of the longer-term research issues as
    well as working on the shorter-term goals of updating Prosper.

<!-- -->

Mondex and Pacemaker case studies
:   Jeremy Bryans reported that several people have expressed interest
    in tackling Mondex in VDM, and that he is leading this work from
    Newcastle. A workshop is scheduled for 2-3 April at Newcastle for
    the interested people to make concrete progress. Prior to that, a
    reading group at Newcastle will review the monograph that describes
    the Mondex study in Z.
:   John reported that the Newcastle team is using this as an
    opportunity to learn VDM++ as they go, and this is doing a great
    deal widen the skills base for Overture.
:   There was some discussion of real time and stochastic extensions.
    Marcel reported very good results introducing an element of
    stochastic modeling into the RT extensions that he has been working
    on for the final chapter of his PhD.

Publication plans
-----------------

In preparation:

-   Traces Paper (John, Peter, Simon, Marcel), due early April.
-   The Goldsmith Conjecture and LPF (John, Cliff) due early April for
    Information Processing Letters.
-   Paper path case study (Marcel) for SCSC ( aleading simulation
    conference).
-   Encyclopedia of Computer Science & Engineering entry on "VDM" (John,
    Peter, Marcel) due 25 May
-   Wikipedia entry on VDM (John) aiming for 25 May as well.
-   Marcel's thesis.

In review:

-   Water Tank case study (IFM)

In press:

-   Isola keynote (John, Peter) in Isola proceedings (John checking
    publication date with editors).
-   Dynamic Coalitions (Jeremy, John) in Isola proceedings (John
    checking publication date with editors).
-   The LPF and VDM (John) in Dines and Martin Henson's new book (with
    publisher).

Any Other Business
------------------

Nothing to report.

Next Meeting
------------

8 Apr 2007 1200 CET

  <div id="edit_page_div"></div>