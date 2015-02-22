---
layout: default
title: Net Meeting 27
date: 20 July 2008, 1300 CET
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 27

|||
|---|---|
| Date | 20 July 2008, 1300 CET |
| Participants | Peter Gorm Larsen, JohnFitzgerald, Carlos Vilhena, Adriana Santos, Shin Sahara, MarcelVerhoef, Augusto Ribeiro, Kenneth Lausdahl, Miguel Ferreira and Nick Battle. |

Review of Action List
---------------------

The actions are all at Overture on SourceForge.

-   24/4 Find out about Rodin Tool plug-in standards.
-   27/1 MARCEL: plan CVS-\>SVN conversion
-   27/2 coordinate Tools Workshop with JNO

VDMTools
--------

Status of the VDMTools

:\* Fixed bugs: No.239, 252

:\* Not yet fixed bugs: No.248, 249, 252, 253, 254, 256

Status of the VDMTools project
:   CSK, SRA and Prof Araki proposed a research project to METI
    (Ministry of Economy, Trade and Industry):
    -   A guideline for using VDM in industry
    -   A guideline for using Haskell in industry
    -   A converter which converts functional VDM-SL specifications to
        Haskell.

Brother companies, CSK Systems Chubu (in Nagoya) and CSK Systems
Nishi-Nihon (in Osaka) started VDMTools sales activities: CSK Systems
Nishi-Nihon got the research project of METI with AIST(Advance
Industrial Science and Technology?)

:\* The project uses Agda and VDM

Sales of VDMTools
:   Our sales found many candidates of VDM user, but they are the
    candidate yet

<!-- -->

Education

:\* Prof. Hagiya in Tokyo University will use my VDM++ seminar materials
in computer language class.

:\* A small company (TAO bears LLC) wants to use my VDM++ seminar
materials in their formal method seminar course.

Overture
--------

Overture Parser Update

Nothing to report.

Status of Adriana's work on the Overture Test Automation Support

Adriana finished the first version of the combinatorial testing tool. It
is now possible to automatically generate test cases from traces.
However, there are some limitations which should be take into
consideration as future work. In order to finish her's work, she had to
implement the pretty printer for VDM++, together with Carlos, who also
needed it for his work. They did not cover all the 277 classes, but a
very larger number was covered and already successfully tested with our
specifications. However, further testing should be done in order to
guaranty its correctness. There are also some things to improve, e.g.
indentation.

Status of Carlos' work on the Overture Connector between VDM++ and JML

After delivering the thesis and the specification, he made some
improvements on the mapper. Besides, he built a java application to make
it usable.

Status of Augusto's work on the Overture Proof Obligation Generator

-   Proof obligation generator: almost everything is implemented and
    working. Polymorphic functions needs further testing but is almost
    completed. Known limitations: mutual recursive functions that
    defined with superclass functions. He plan to work on these on the
    future with the help of Peter.
-   Discharge of proofs: automatic discharge of the simple proofs.
    Guidelines to prove more complex functions are supplied on my
    thesis. He changed the VDM to HOL translator a bit so it would be
    easier to prove automatically in HOL some of the recursive
    functions.

New students (Kenneth and Hans Christian)

Kenneth and Hans Christian will development a tool similar with Rose
link from VDMTools. They will extend the overture project with an
eclipse plugin (EMF) for going back and forth between VDM and UML.
Additionally they will take a look at the test trace file and see if it
is possible to pars this file into a UML sequence diagram.

The MONDEX case study

A new MSc student will be working part-time over the next 12 months.
Sarah Clarke will work on a demonstration of GUI-based validation of the
executable Mondex models. In this she will be helped on the interface
design by David Greathead, the psychologist who worked with us on the
dynamic coalitions stuff. We have allocated two remaining Mondex days at
Newcastle: 30 July and 1 August, when we hope to complete the proof
work. Sarah has added a topic to the wiki (linked from the Mondex topic)
to serve as a reporting base. Thereafter the target is to prepare a
paper for a planned special issue of FACJ with completion 4Q08 as I
previously reported.

The Pacemaker case study

John have agreed to become the UK owner of the Pacemaker problem for GC6
(the initiative on challenge problems for software verification).
Several initiatives to fund full-time work on the pacemaker and other
GC6 problems are underway and I will not bore you all with the details.
One that he will explore is the possibility of setting up an EU network
on formal techniques and certification of critical systems, to mirror
the North American group. He will be working on the Pacemaker models in
August and will give a presentation on the state of the Pacemaker study
on 15 September at the ASM conference in London. Pacemaker FAQ is in the
wiki at <http://www.cas.mcmaster.ca/wiki/index.php/Pacemaker_FAQ> The
head of wiki is: <http://www.cas.mcmaster.ca/wiki/index.php/Pacemaker>
John will give an invited talk on the pacemaker work as part of a GC day
immediately preceding the ABZ conference in London in September. He will
work further on Pacemaker before then.

The POSIX

Before the last NM Miguel was translating the FS\_OpenFileDir operation
to Alloy so that it could be model checked. Since then he have completed
the verification of the FS\_OpenFileDir and started to use the VDM Unit
Test framework explained in the VDMBook. Unit testing as been of great
use making it easier to layout the test suites, but because it is a very
simple architecture it doesn't show the assert where the test failed.
From the verification of the FS\_OpenFileDir (opens or creates a file or
a directory) operation i found 2 bugs by model checking:

-   when ever the operation is called with an FS\_OpenMode that enforces
    the file to always be created it is necessary to remove it if it
    exists, before creating a new one. In this case, if the path (passed
    as argument) is the Root directory, then the attributes' (passed as
    argument) file type should be
-   the operation pre condition wasn't allowing for the creation of the
    Root directory, and for that it was necessary to ad a disjunct
    clause (making the pre condition weaker)

All POs generated by the VDMTools where model checked with success in
Alloy. As for proof I used the Automatic Proof Support system to
discharge them in HOL:

-   I discharged 15 out of 21 POs
-   out of the 6 POs that weren't discharged
-   1 evaluated to FALSE (even though it is not false!!!)
-   5 were taking to long to complete

One of the POs that was taking tow long is about the FileStore?
invariant preservation (the others are related to extra VDM constructs
inserted fo allow the translation). For this PO I tried to use HOL to
calculate a precondition that would make the operation sustain the
FileStore? invariant. I had to follow HOL's proof step by step in order
to understand the sub goals that were being generated (so it was harder
than doing it my self!!). I eventually reached a predicate for the pre
condition that would hold the invariant, but my intuition was that this
new predicate was just equivalent to the initial predicate I had
written. So he asked HOL to prove that the predicates are in fact
equivalents, which it did. There are two new operations being
written/verified which are FS\_SetFileOffset and FS\_WriteFile. After
these operation have been verified he will start to prepare the
refinement work, trying to represent the File System Layer data
structures in Data Object Layer data structures.

Overture Workshop
-----------------

José Nuno suggested Braga, in Portugal.

Publication plans
-----------------

In preparation:

-   Paper path case study (Marcel)
-   ACM Computing Surveys paper on industrial applications of FMs
    (Peter, Juan, John)
-   Tools for Policy Design in Virtual Organisations: A Proof-of-Concept
    Study (considering for FACJ)

In review:

-   2nd edition of "Modelling Systems", Cambridge University Press (John
    & Peter) - goes to CUP for review this week
-   PhD? thesis (Marcel)

In press:

-   John, Peter, Marcel, Vienna Development Method, in B. Wah (ed.),
    Wiley Encyclopedia of Computer Science and Engineering.
-   Jozef and Marcel: Formal Semantics of a VDM Extension for
    Distributed Embedded Systems; to appear in Festschrift for W P de
    Roever (LNCS).
-   Jozef, A summary of the FM06 and IFM07 paper and enhanced the PVS
    models, to appear in Festschrift for W P de Roever (LNCS).

Recently Appeared:

-   Modelling and Analysis in VDM: Proceedings of the Fourth
    VDM/Overture Workshop, Fitzgerald J.S., Larsen P.G., Sahara S.
    (eds.), Technical Report CS-TR-1099, School of Computing Science,
    Newcastle University, May 2008.
    <http://www.cs.ncl.ac.uk/publications/trs/papers/1099.pdf> Includes
    several papers previously listed as "in preparation".
-   Final version of J.S. Fitzgerald, C.B. Jones, The Connection between
    Two Ways of Reasoning about Partial Functions, Information
    Processing Letters (2008), 107(3-4), pp. 128-132, 2008 (Ncl:
    CS-TR-1044)
-   T. Kurita, M. Chiba and Y.Nakatsugawa, "Application of a Formal
    Specification Language in the Development of the "Mobile FeliCa?" IC
    Chip Firmware for Embedding in Mobile Phone" in J. Cuellar, T.
    Maibaum and K. Sere eds., "FM 2008: Formal Methods", LNCS 5014, pp
    425-429.
-   Hugo, Peter, John, Incremental Development of a Distributed
    Real-Time Model of A Cardiac Pacing System using VDM, in J. Cuellar,
    T. Maibaum and K. Sere eds., "FM 2008: Formal Methods", LNCS 5014,
    pp 181-197.
-   John et al., Animation-based Validation of a Formal Model of Dynamic
    Virtual Organisations, in P. Boca, J. P. Bowen and P. G. Larsen
    (eds.) Proc. BCS-FACS Workshop on Formal Methods in Industry.
    <http://www.bcs.org/upload/pdf/ewic_fm07_paper3.pdf>
-   Peter and John. Recent Industrial Applications of VDM in Japan, to
    appear in P. Boca, J. P. Bowen and P. G. Larsen (eds.) Proc.
    BCS-FACS Workshop on Formal Methods in Industry.
    <http://www.bcs.org/upload/pdf/ewic_fm07_paper8.pdf>

Any other business
------------------

An Overture Summer School was suggested and it will be discussed in the
next meeting.

Concerning eclipse integration I can say that I have a new student
(Christian) to do a small project (150 hours) this authum on that + if
it goes well continue with that as his MSc thesis from January. Phase
one will include integration of newest parser in the eclipse editor and
invocation of VDMTools as well.

The members of the Overture community should take an action to
investigate the rCOS plug-ins. A description of the rCos tool is
available on <http://rcos.iist.unu.edu/tool>. They have put the latest
information about the rCOS tool on our webpage, the first version is
released. The tool , and eclipse update can be used to download the
latest version.

Nick Battle has been developing a java implementation of a VDM-SL
parser, type checker and interpreter.

Next Meeting
------------

7 September 2008, 1300 CET

   <div id="edit_page_div"></div>