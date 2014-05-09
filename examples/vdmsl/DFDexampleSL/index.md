---
layout: listing
title: DFDexample
---

~~~

This specification describes how one can automatically transform Data
Flow Diagrams (DFD) into VDM-SL definitions. It is written as a flat
VDM-SL model in a purely executable style. However, in order to test
it at the top level one needs to construct a large test structure
which essentially is an AST for a DFD. This have been done in the past
but unfortunately the sources for this have been lost. This model was
basis for a paper published as:

"A Formal Semantics of Data Flows Diagrams", P.G.Larsen, N.Plat, 
H.Toetenel, Formal Aspects of Computing'' 1994, Vol 6, December


#******************************************************
#  AUTOMATED TEST SETTINGS
#------------------------------------------------------
#AUTHOR= Peter Gorm Larsen
#DOCUMENT= dfdexample.tex
#LANGUAGE_VERSION=classic
#INV_CHECKS=true
#POST_CHECKS=true
#PRE_CHECKS=true
#DYNAMIC_TYPE_CHECKS=true
#SUPPRESS_WARNINGS=false
#ENTRY_POINT=
#EXPECTED_RESULT=NO_ERROR_TYPE_CHECK
#******************************************************
~~~
###customlangdef.tex

~~~
\lstdefinelanguage{VDM++}
  {morekeywords={\#act, \#active, \#fin, \#req, \#waiting, abs, all, allsuper, always, and, answer, 
     assumption, async, atomic, be, bool, by, card, cases, char, class, comp, compose, conc, cycles,
     dcl, def, del, dinter, div, do, dom, dunion, duration, effect, elems, else, elseif, end,
     error, errs, exists, exists1, exit, ext, floor, for, forall, from, functions, 
     general, hd, if, in, inds, init, inmap, input, instance, int, inter, inv, inverse, iota, is, 
     isofbaseclass, isofclass, inv, inverse, lambda, let, map, mu, mutex, mod, nat, nat1, new, merge, 
     munion, not, of, operations, or, others, per, periodic, post, power, pre, pref, 
     private, protected, public, qsync, rd, responsibility, return, reverse, samebaseclass, 
     sameclass, psubset, rem, rng, sel, self, seq, seq1, set, skip, specified, st, 
     start, startlist, static, subclass, subset, subtrace, sync, synonym, then, thread, 
     threadid, time, tixe, tl, to, token, traces, trap, types, undefined, union, using, values, 
     variables, while, with, wr, yet, RESULT, false, true, nil, periodic pref, rat, real},
   %keywordsprefix=mk\_,
   %keywordsprefix=a\_,
   %keywordsprefix=t\_,
   %keywordsprefix=w\_,
   sensitive,
   morecomment=[l]--,
   morestring=[b]",
   morestring=[b]',
  }[keywords,comments,strings]
\lstdefinelanguage{JavaCC}
  {morekeywords={options, PARSER\_BEGIN, PARSER\_END, SKIP, TOKEN},
   sensitive=false,
  }[keywords]

~~~
###dfdexample.tex

~~~
\documentclass[11pt]{article}
\usepackage{a4}
\usepackage{makeidx}
%\usepackage{vdmsl-2e}
%\usepackage{color}
\usepackage{overture}
\usepackage{termref}
\usepackage{epsf}
\usepackage{latexsym}
\usepackage{longtable}

\newcommand{\StateDef}[1]{{\bf #1}}
\newcommand{\TypeDef}[1]{{\bf #1}}
\newcommand{\TypeOcc}[1]{{\it #1}}
\newcommand{\FuncDef}[1]{{\bf #1}}
\newcommand{\FuncOcc}[1]{#1}
\newcommand{\ModDef}[1]{{\tiny #1}}

\makeindex
%\documentstyle[epsf,a4,11pt,vdmsl_v1.1.31,makeidx,termref]{article}
\newcommand{\figdir}{/home/peter/toolbox}
\newcommand{\SA}{{\small SA}}
\newcommand{\SD}{{\small SD}}
\newcommand{\SASD}{{\small SA/SD}}
\newcommand{\VDM}{{\small VDM}}
\newcommand{\VDMSL}{{\small VDM-SL}}
\newcommand{\DFD}{{\small DFD}}
\newcommand{\DFDs}{{\small DFD}s}

\newcommand{\makefigure}[3]{\begin{figure}[ht]
{\leavevmode
\centering
\epsfbox{\figdir/#1.eps}
\caption{#2}\label{#3}}
\end{figure}}

\newcommand{\documenttype}{document}
\makeindex
\begin{document}

\title{A Formal Semantics of Data Flow Diagrams}
\author{Peter Gorm Larsen, Nico Plat and Hans Toetenel}
\date{November 1993}
\maketitle
\begin{abstract}
This document presents a full version of the
formal semantics of data flow diagrams reported in \cite{Larsen&93b}.
Data Flow Diagrams are used in Structured Analysis and are
 based on an abstract model for data flow transformations.
The semantics consists of a collection of \VDM\ functions,
transforming an abstract syntax representation of a data flow
diagram into an abstract syntax representation of a \VDM\
specification. Since this transformation is executable, it
becomes possible to provide a software analyst/designer with two `views' of
the system being modeled: a graphical view in terms of a data
flow diagram, and a textual view in terms of a \VDM\
specification. The specification presented in this document have been
processed by The IFAD VDM-SL Toolbox \cite{Lassen93} and the \LaTeX\ output is
produced directly by means of this tool. The complete transformation has
been syntax-checked, type-checked and tested using the
{\small IFAD VDM-SL}\ Toolbox \cite{Lassen93}; this has given us
confidence that the transformation we have defined is a reasonable one.
\end{abstract}
\newpage
\tableofcontents
\newpage
\section{Introduction}

The introduction of formal methods in industrial organizations
may become easier if these methods can be used alongside the
more widely used conventional techniques for software development,
such as `structured methods'.
Structured methods are methods for software analysis and design,
based on the use of heuristics for making analysis and design decisions.
They provide a relatively well-defined path, often in a cookbook-like
fashion (hence the term `structured' methods), starting from the analysis
of software requirements and ending at system coding.
The design notations used are usually graphical and have no formal basis.
In that sense structured and formal methods can be regarded as complementary.
It is often suggested that the informal graphical notations as provided by
structured methods are intuitively appealing to software analysts/designers.
Therefore, a combined structured/formal method may not only increase the
understanding of the use of formal methods in the software process, but 
also may increase the acceptability of formal methods to these people.

Our work in this area so far has concentrated on combining {\em Structured
Analysis (SA)} \cite{Yourdon75,Demarco78,Gane77}
with the {\em Vienna Development Method (VDM)}
\cite{Bjorner&82b,Jones90a}; we provide a brief introduction to
\SA, but we refer to text books such as \cite{Jones90a} and
\cite{Andrews&91} for an introduction to \VDM.
We think that a well-integrated combination of notations can be achieved
by using {\em data flow diagrams (DFDs)} -- which we consider to be the main
design notation of \SA\ --
as a graphical view of the system and \VDM\ as a textual
view. These different views emphasize different aspects of the
specified system: the \DFD\ graphical view
focuses on an overview of the {\em structure} of the system, whereas
the \VDM\ textual view focuses on the detailed {\em functionality} of the system.
The base of a combined structured/formal method consists of a formally defined
relation between the structured method and the formal method.
In \cite{Plat&91a} we describe several approaches to modeling \DFDs\ 
using the \VDMSL\ specification language \cite{BSIVDM92b,Dawes91}.
In this paper we discuss one such particular model in more detail,
thus essentially providing a `formal semantics' of \DFDs.
A discussion on the methodological aspects of the approach can be found in
\cite{Larsen&91b}.

The remainder of this paper is organized as follows.
In the following section a brief introduction to \SA\ is given, focusing on the
use of \DFDs.
In Section~\ref{sec:motivation} we describe our strategy for
transforming \DFDs\ into \VDM\ specifications, paying attention to the
limitations of our approach.
The main part of this paper is Section~\ref{transsec}, in which the formal
transformation from \DFDs\ to \VDM\ is presented.
Emphasis is put on the motivation for the choices
made in the transformation. The main aspects of the transformation
itself are described using \VDM\ functions together
with a number of examples.
In Section~\ref{sec:conclusions} we give an overview of related
work on formal semantics for \DFDs, and present some conclusions and
ideas for future work in this area.
This is followed by a list of references, and two appendices and an
index for the complete specification.
In the first appendix, we describe the abstract syntax representation
of \DFDs. In the second appendix we present the abstract syntax 
representation we use for the generated
\VDM\ specifications. This is a subset of the one used
in \cite{BSIVDM92b}\footnote{%
To be precise, the abstract syntax used for \VDM\ specifications is
a partof the one
called the `Outer Abstract Syntax' in \cite{BSIVDM92b}; a lack of knowledge about
this Outer Abstract Syntax
does not affect the understanding of this document, however.}).

\section{Overview of Structured Analysis}
\label{sec:sa}

{\em Structured Analysis ({\small\it SA})}
\cite{Yourdon75,Demarco78,Gane77} is one of
the most widely used methods for software analysis.
Often it is used in combination with {\em Structured Design ({\small\it SD})}
\cite{Yourdon75}; the resulting combination is called {\em \SASD}.
The approach to analysis taken in \SA\ is to concentrate on the functions
to be carried out by the system, using data flow abstraction to
describe the flow of data through a network of transforming
processes, called data transformers, together with access to data stores.
Such a network, which is the most important design product of \SA,
is called a {\em data flow diagram (DFD)}. The original version of
\SA\ was meant to be used to model sequential systems.  
A \DFD\ is a {\em directed graph} consisting of elementary building blocks.
Each building block has a graphical notation (figure~\ref{figexternalprocess}).

%\makefigure{building_blocks}{Elementary building blocks of a DFD}{figexternalprocess}

Through the years several dialects have evolved and extensions
have been defined (e.g. {\small SSADM}\ \cite{Longworth&86} and {\small SA/RT}\
\cite{Ward85}), 
but we limit ourselves to \DFDs\ with a sequential model and
a small number of building blocks:
\begin{itemize}
\item
{\em Data transformers}. Data transformers denote a transformation from
(an arbitrary number of) input values to
(an arbitrary number of) output values, possibly with side effects.
\item
{\em Data flows}. Data flows are represented as arrows, connecting one
data transformer to another. They represent a flow of data between the
data transformers they connect.
The flow of data is unidirectional in the direction of the arrow.
\item
{\em Data stores}. Data stores provide for (temporary) storage of data.
\item
{\em External processes.}
External processes are processes that are not part of the system but belong
to the outside world. They are used to show where the input to the system
is coming from and where the output of the system is going to.
\end{itemize}

\DFD s are used to model the {\em information flow} through a system.
As such they provide a limited view of the system:
in their most rudimentary form they neither show the control flow of the system
nor any timing aspects.
Therefore, \DFDs\ are often combined with data dictionaries,
control flow diagrams, state transition diagrams, decision tables
and mini-specifications to provide a comprehensive view of all the 
aspects of the system.

The process of constructing a \DFD\ is an iterative process.
Initially, the system to be designed is envisaged as one large data transformer,
getting input from and providing output to external processes.
This initial, high-level \DFD\ is called a {\em context diagram}.
The next step is the {\em decomposition}
of the context diagram into a network of data transformers,
the total network providing the same functionality as the original
context diagram.
This process is repeated for each data transformer until the analyst/designer
considers all the data transformers in the \DFD\ to be primitive,
i.e. each data transformer performs a simple operation that does not
need to be further decomposed.
We call such a collection of \DFDs, describing the same system but at different
levels of abstraction, a {\em hierarchy of DFDs}.

\section{Approach to the Transformation}
\label{sec:motivation}

Before presenting the formal transformation from \DFDs\ to \VDM\ we first explain
the underlying strategy for the transformation and the limitations
imposed upon the \DFDs\ to make our transformation valid.

\subsection{Underlying strategy}

The starting point for our transformation is the work presented in
\cite{Plat&91a}, in which the general properties of two transformations from
DFDs to \VDM\ constructs are discussed.
The main difference between these two transformations is the way data flows are
modeled: in the first transformation they are modeled as (infinitely large)
queues, in the second transformation they are modeled as operations combining
the two data transformers connected by the data flow.
The advantage of the latter transformation is that a more abstract
interpretation of \DFDs\ can be achieved, because the transformation
solely focuses on modeling the information flow through a \DFD.
This is also the reason for choosing this transformation 
as the basis for the transformation described in this paper.
One simplification with respect to the transformation described in
\cite{Plat&91a} is that the latter is
more general because the order
in which the `underlying' operations are called is left unspecified
(i.e. it is loosely specified),
which makes the operation modeling the data flow rather complicated.
In this paper, however, we are dealing with purely sequential systems,
and therefore we can assume that data flows between two
data transformers are `direct' in the sense that 
the data transformer that uses the data flow as input cannot be
called before the data transformer that uses the data flow as output.

\subsection{Transformation of DFD building blocks}


When providing a formal semantics for \DFDs\ it is
important to decide whether the \DFD\ is intended to model
a concurrent system or a sequential system. More recent versions
of \SA\ (like {\em SA/RT} \cite{Ward85}) include concurrency and can be
used to develop real-time systems. However, originally \SA\
was intended for the development of information systems
implemented in traditional imperative programming languages.
In that situation it seems natural to interpret the data transformers
as {\em functions} or
{\em operations} which, given input data, sequentially perform computations and
produce output data.
If the data flow diagrams are used to model a concurrent system
it is more natural to interpret data transformers as {\em processes},
possibly executing in parallel.
Since we restrict ourselves to sequential systems we model data transformers
as {\em VDM operations}\footnote{Data transformers neither having access to
data stores nor being connected to external processes can also be modeled
as {\em VDM functions}. In our approach only {\tiny VDM}
operations are used because
we want each different type of construct in a {\tiny DFD} to be mapped to 
(semantically) the same construct in {\tiny VDM}.
{\tiny VDM} functions and {\tiny VDM} operations
(without side-effects) semantically differ in the way {\em looseness} is interpreted
(see \cite{IFIP}).}.

To ensure that the structure of the \VDM\ specification
resembles the structure of the \DFD,
we group the operations modeling data transformers at the same level in
a hierarchy of \DFDs\ together in `modules'\footnote{%
{\tiny VDM-SL} as described in \cite{BSIVDM92b} has no structuring mechanism.
The structuring mechanism we used is based on a proposal by Bear
\cite{Bear88}. The constructs we use are simple so that an intuitive
interpretation suffices.}
importing the necessary types and
operations needed for the data transformers
(figure~\ref{hierarchy}).

%\makefigure{hierarchy}{Transformation of a hierarchy of DFDs into a VDM module structure (example)}{hierarchy}


{\em External processes} can be considered as processes `executing' in parallel with
the specified system.
In our approach we model the data flows from and to external processes
as {\em state components} in the \VDM\ specification.
This is a minor difference with the transformation presented in
\cite{Plat&91a},
in which external processes are regarded as part of the system and
are therefore modeled as \VDM\ operations in the same way as data transformers.


{\em Data stores} are modeled as \VDM\ {\em state components}.
This corresponds to the fact that data transformers
(which can be used to access and change data stores)
are modeled as \VDM\ operations,
the constructs in \VDMSL\ that can access and change state components.


We envisage {\em data flows} as constructs which can combine
two data transformers by providing communication facilities between
these two data transformers.
A data flow is, therefore, modeled as an operation
calling the operations that model the two data transformers connected by
the data flow. 
In this way a process of combining data transformers can be started during
which in each step two data transformers (connected by a data flow) are
integrated into a higher level data transformer, finally resulting in
the context diagram.

Generalizing this approach, we have chosen to combine 
all the data transformers in a \DFD\ into a
higher level data transformer in {\em one} step.
The data transformer constructed in this way is modeled as a \VDM\ operation.

\subsection{Limitations imposed upon the DFDs}

Besides restricting the expressibility of the kind of \DFDs\
for which we are able to provide semantics to sequential systems, we
assume that:

\begin{itemize}
\item Data flows not connected
      to an external process must form an acyclic
      graph at each level in the hierarchy of \DFDs. This
      is necessary because in our transformation we provide both
	  explicit \VDM\ specifications as well as implicit \VDM\ specifications
	  as models for \DFDs. Allowing general cyclic \DFDs\ would make the 
	  transformation into an explicit \VDM\ specification impossible.
	  The restriction furthermore simplifies the
      transformation of \DFDs\ into implicit \VDM\ specifications.
      In Section~\ref{depend} we come back to this restriction in more
	  detail.
\item There is a one-to-one mapping between the
      input to the system and the output from the system.
	  One-to-many mappings and many-to-one mappings are a common
	  problem when interpreting \DFDs, described in more detail
	  in \cite{Alabiso88}\footnote{%
      In \cite{Alabiso88} this problem is called {\em I/O uncohesiveness}.
      I/O uncohesiveness occurs if either a data transformer
      must consume several pieces of input data before generating
      output data, or if a data transformer generates pieces of output
      independently of all other inputs and outputs.
      Alabiso describes a solution called `the burial method',
	  centered around the generation of terminator symbols
      which indicate that `something is missing'.}.
	  However, we are not entirely satisfied with the solution proposed by
	  Alabiso, and since in our experience most of the \DFDs\ with
	  one-to-many or many-to-one mappings should be regarded as design
	  products and not as specification products, we feel that a
	  restriction to one-to-one mappings is not a serious one for our
	  purpose.
      Alternatively, the analyst may supply a mini-specification for 
      each non-primitive data transformer not obeying the restriction
	  of a one-to-one mapping between input and output.

\item To simplify the formal description the
data flows must have unique names at each level in the hierarchy
of \DFDs.
\end{itemize}

\include{generated/latex/specification/dfdexample.vdmsl}

\newpage
\bibliographystyle{abbrv}
\bibliography{savdm} 

\addcontentsline{toc}{section}{Index}
\printindex

\end{document}
  

~~~
###dfdexample.vdmsl

~~~
\section{The Transformation Functions}\label{transsec}

In this section we shall present the formal semantics we have
given to a hierarchy of DFDs. 
The more complicated parts will be illustrated
by means of small examples. Thus, this section contains a collection
of VDM functions which transform SA (with the structure described in
Appendix A) to a collection of VDM modules (represented in the
structure described in Appendix B).

\subsubsection{Top level functions}

The top-level function, which transforms a hierarchy of data flow
diagrams (an $HDFD$), also takes as arguments the mini-specifications supplied by the
user and the style in which the composing operations are to be generated%
\footnote{The argument with this information will be called $style$ thoughout the
definition indicating that it is the ``style" (implicit or explicit)
it should be transformed.}.

\begin{vdm_al}
functions
  
TransHDFD : HDFD * MSs * (<EXPL>|<IMPL>) -> set of Module
TransHDFD(hdfd,mss,style) ==
  let mainmod=MakeDFDModule(hdfd,mss,style) in
  let mk_(-,-,-,dfdmap,-)=hdfd in
  let mods= dunion {TransHDFD(dfd,mss,style)
                   | dfd in set rng dfdmap} in
  {mainmod} union mods;
\end{vdm_al}
For each module the interface and the body (the definitions) of 
the module must be created.

\begin{vdm_al}
MakeDFDModule : HDFD * MSs * (<EXPL>|<IMPL>) -> Module
MakeDFDModule(mk_(dfdid,dss,dfdtopo,dfdmap,dfdsig),
              mss,style) ==
  let i = MakeInterface(dfdid,dss,dfdtopo,dfdsig,dfdmap),
      defs = MakeDefinitions(dfdid,dss,dfdtopo,
                             dfdsig,mss,style) 
  in
    mk_(ModIdConf(dfdid),i,defs);
\end{vdm_al}

\noindent The name of the module (the first component of the
returned triple) is generated by means of a configuration function.
Any name ending in $Conf$ denotes
something which can be configured by a user of a tool translating
DFDs to VDM. 
These configuration functions should be defined (by the user or by a
tool%
\footnote{Such a tool would obviously also need to be able to produce
the abvstract syntax of strutured analysis and produce the concrete
syntax of the VDM specifications which are produced.}
automatically translating DFDs into VDM specifications) in order to be able to
conform to any specific conventions (e.g. for naming identifiers) that are used.
At the end of the formal definition we present an example of how these
functions can be defined.

\subsection{Interface functions}

The interface of each module contains an import part for a module with the
type information for all the data stores and the data flows (only the
types actually used in the given module are imported), an import part
for each of the data transformers that are further decomposed (and
are described in their own module), and an export part for the
operation which specifies the functionality of the given DFD.

\begin{vdm_al}
MakeInterface: DFDId * DSs * DFDTopo * DFDSig * DFDMap -> 
               Interface
MakeInterface(dfdid,dss,dfdtopo,dfdsig,dfdmap) ==
  let tmimp = MakeTypeModImp(dss, dom dfdtopo),
      dfdmimps = MakeDFDModImps(dom dfdmap,dfdsig),
      exp = MakeOpExp(dfdid,dfdsig(dfdid)) in
       mk_(({tmimp} union dfdmimps),exp)
pre dfdid in set dom dfdsig;
  
MakeTypeModImp : DSs * set of FlowId -> Import
MakeTypeModImp(dss,fids) ==
  let tysigs= {mk_TypeSig(DSIdConf(dsid))
              |dsid in set dss} union 
              {mk_TypeSig(FlowIdTypeConf(fid))
              |fid in set fids} in
  mk_(TypeModConf(),tysigs);
  
MakeDFDModImps: set of DFDId * DFDSig -> set of Import
MakeDFDModImps(dfdids,dfdsig) ==
  {mk_(ModIdConf(id),{MakeOpSig(id,dfdsig(id))}) 
                     | id in set dfdids}
pre dfdids subset dom dfdsig;
  
MakeOpExp : DFDId * Signature -> Export
MakeOpExp(dfdid,sig) ==
  {MakeOpSig(dfdid,sig)};
  
MakeOpSig : DFDId * Signature -> OpSig
MakeOpSig(dfdid,sig) ==
  let opty = MakeOpType(sig),
      opst = MakeOpState(sig) in
  mk_OpSig(OpIdConf(dfdid),opty,opst);
  
MakeOpType : Signature -> OpType
MakeOpType(mk_(il,ol,-)) ==
  mk_OpType(MakeType(il),MakeType(ol));
\end{vdm_al}
In $MakeType$ it can be seen that multiple flows to or from a data 
transformer are modelled as product types.

\begin{vdm_al}
MakeType : seq of FlowId -> [Type]
MakeType(fidl) ==
  cases len fidl:
    0 -> nil ,
    1 -> FlowIdTypeConf( hd fidl),
  others -> mk_ProductType([ FlowIdTypeConf(fidl(i))
                           | i in set inds fidl])
  end;
  
MakeOpState : Signature -> seq of Id
MakeOpState(mk_(-,-,sl)) ==
  [let mk_(s,-)=sl(i) 
   in
     StateVarConf(s)
  |i in set inds sl];
\end{vdm_al}

\subsection{The main function for definitions}

The body of each module contains a number of definitions.
The body will contain a state definition and if the
DFD contains any data stores, these are included together with the
data flows between the system and the external process.
 If the DFD contains any data transformers which are
not further decomposed, the body will also contain definitions for
these. Finally the module will always contain a definition of the
operation which describes the functionality of that DFD.

\begin{vdm_al}
MakeDefinitions: DFDId * DSs * DFDTopo * DFDSig * MSs * 
                 (<EXPL>|<IMPL>) -> Definitions
MakeDefinitions(dfdid,dss,dfdtopo,dfdsig,mss,style) ==
  let dst = MakeState(dfdid,dss,CollectExtDFs(dfdtopo)),
      msdescs = MakeMSDescs(dfdsig,mss),
      dfdop = MakeDFDOp(dfdid,dfdtopo,dfdsig,style) in
   if dst=nil 
   then {dfdop} union msdescs
   else {dst,dfdop} union msdescs;
\end{vdm_al}

\subsection{Functions for the state definition}

Each data store in a
DFD and each data flow to or from an external process is transformed
into a state component of the state definition.

\begin{vdm_al}
MakeState : DFDId * DSs * set of FlowId -> [StateDef]
MakeState(dfdid,dss,fids) ==
  if dss={} and fids={}
  then nil 
  else let fl=MakeFieldList(dss union fids)
       in
         mk_StateDef(StateIdConf(dfdid),fl);
  
MakeFieldList : set of StId -> seq of Field
MakeFieldList(ids) ==
  if ids={}
  then []
  else let id in set ids 
       in
         [MakeField(id)]^MakeFieldList(ids \ {id})
  measure Card;

Card: set of StId -> nat
Card(s) ==
  card s;
  
MakeField : StId -> Field
MakeField(id) ==
  mk_Field(StateVarConf(id),StateTypeConf(id));
\end{vdm_al}

\subsection{Functions for primitive MSs}

The data transformers which are
not further decomposed (they can be considered as being
primitive) can be supplied by the user in the form of a
mini-specification in VDM-SL. 
In the case where the user has not supplied such a
mini-specification, a simple implicitly defined operation 
is generated. Since the user has supplied only the type
information for the data transformer (by means of the data flow
types) the generated definition will have the right type with
\textbf{\ttfamily true} as a post-condition.

\begin{vdm_al}
MakeMSDescs : DFDSig * MSs -> set of Definition
MakeMSDescs(dfdsig,mss) ==
  if forall id in set dom dfdsig& is_DFDId(id)
  then {}
  else let id in set dom dfdsig be st is_MSId(id) 
       in
         let def'= if id in set dom mss
                   then mss(id)
                   else MakeOp(id,dfdsig(id))
         in
           {def'} union MakeMSDescs({id} <-: dfdsig,mss);
  
MakeOp: MSId *  (seq of FlowId * seq of FlowId * State) 
        -> ImplOp
MakeOp(msid,mk_(din,out,dst)) ==
  let partpl = MakeInpPar(din),
      residtp = MakeOutPair(out),
      dext = MakeExt(dst),
      body = mk_ImplOpBody(nil, mk_BoolLit(true)) 
  in
    mk_ImplOp(OpIdConf(msid),partpl,residtp,dext,body);
  
MakeInpPar : seq of FlowId -> seq of ParType
MakeInpPar(fidl) ==
  [mk_ParType(mk_PatternId(FlowIdVarConf(fidl(i))),
                           FlowIdTypeConf(fidl(i)))
  | i in set inds fidl];
\end{vdm_al}

In the function $MakeOutPair$ it should be noticed that if a data
transformer contains more that one data flow out from it, it is
necessary to ``invent" a new identifier to denote the result of the
data transformer ($ResultIdConf$).

\begin{vdm_al}
MakeOutPair : seq of FlowId -> [IdType]
MakeOutPair(fidl) ==
  cases len fidl:
    0 -> nil ,
    1 -> mk_IdType(FlowIdVarConf( hd fidl),
                   FlowIdTypeConf( hd fidl)),
  others -> let t=mk_ProductType([FlowIdTypeConf(fidl(i))
                                 |i in set inds fidl]) 
            in
              mk_IdType(ResultIdConf(),t)
  end;
  
MakeExt : State -> seq of ExtVarInf
MakeExt(dst) ==
  [MakeExtVar(dst(i))|i in set inds dst];
  
MakeExtVar : (StId * Mode) -> ExtVarInf
MakeExtVar(mk_(id,mode)) ==
  mk_ExtVarInf(mode,VarConf(id),TypeConf(id));
\end{vdm_al}

\subsection{Functions for composing data transformers implicitly}
\label{depend}

An operation describing the functionality of a DFD uses
the operations for the lower-level DFDs.
The combination that must be constructed depends upon the topology of the
DFD. Whenever a data transformer receives data from another data
transformer through a data flow (in the same DFD) this dependency
must be incorporated in the combination, by using the output value
from the first data transformer (and possibly changed state
component(s)) as input for the second data transformer. However,
since a data transformer in principle is a loose construct (see
\cite{Wieth89} for a thorough
treatment of the semantics of looseness) 
it is necessary when generating pre and
post-conditions to take this possible looseness into
account. This is done by specifying that there must exist an output
value (and possibly one or more changed state values) such that the
post-condition of the first data transformer is fulfilled and then
use this value (or values) for the data transformer which depends upon the
first one (see \cite{Plat&91a}).

By means of three small examples we will illustrate
what has to be taken into account to describe the functionality of a
DFD as a whole.

\subsubsection*{Example 1}

Consider the \DFD\ in figure~\ref{example1}.
%\makefigure{example1}{DFD for example 1}{example1}
It is a simple
\DFD\ consisting of two data transformers $P$ and $Q$,
each having one input data flow ($a$ and $b$ respectively) and one
output data flow ($b$ and $c$ respectively).
$Q$ receives data from $P$ and thus
$Q$ depends on $P$. When this \DFD\ is intended to model a sequential system it is
obvious that $P$ must be executed before $Q$ can be executed. This
dependency between $P$ and $Q$ also can be found in the pre- and post-condition
of the composite \DFD:

%\begin{vdm}
%\begin{op}[i]{PQ}
%\parms{a: A}[c: C]
%\begin{precond}
%\exists{b : B}\\
%    {pre-P(a) \And\\
%     post-P(a, b) \And \\
%     pre-Q(b)}
%\end{precond}
%\begin{postcond}
%\exists{b : B}\\
%    {pre-P(a) \And
%     post-P(a, b) \And \\
%     pre-Q(b) \And
%     post-Q(b, c)}
%\end{postcond}
%\end{op}
%\end{vdm}
\begin{lstlisting}
PQ(a: A) c : C
pre exists b : B & pre_P(a) and 
                   post_P(a,b) and 
                   pre_Q(b)
post exists b : B & pre_P(a) and 
                    post_P(a,b) and 
                    pre_Q(b) and
                    post_Q(b,c)
\end{lstlisting}

It is necessary to quote the post-condition\footnote{%
`Quoting' pre- and post-conditions of (implicitly defined) functions and
operations is a {\small VDM} technique to `invoke' other
functions or operations from within a pre- or post-condition (i.e. a
predicate): each implicitly defined function or operation $f$ has
associated boolean {\em functions} $pre-f$ and $post-f$ which, given the
appropriate arguments, yield $true$ if the pre- or post-condition respectively 
of $f$ holds for those arguments, and $false$ otherwise.
A quoted pre-condition of an operation takes
the input arguments of the operation and the state components 
used by the operation as its arguments.
A quotation of a post-condition of an operation first takes
the input arguments of the operation, then some arguments
representing the values of the state components before the operation is
executed, the output result of the operation, and finally the new state
components (only those to which the operation has write access).%
} of $P$ to
produce a value that must satisfy the pre-condition of $Q$. Since $P$
may be loosely specified there may be several values satisfying the
post-condition of $P$ given some argument $a$. However, since only
some of these values might satisfy the pre-condition of $Q$ an
existential quantification over this `internal data flow', $b$, is
necessary.
Alternative solutions can be envisaged, differing in the strength
of the constraints put upon the combination.

\noindent $\Box$\\

\subsubsection*{Example 2}

Example~1 is now expanded by introducing a data store that both
data transformer $P$ and data transformer $Q$ have write access to.
This \DFD\ is given in figure~\ref{example2}.
The data store $ds$ is -- as has been mentioned -- interpreted as a state
component.

%\makefigure{example2}{DFD for example 2}{example2}

This composite \DFD\ can be specified by the following implicit
definition:

%\begin{vdm}
%\begin{op}[i]{PQ_{DS}}
%\parms{a: A}[c: C]
%\ext{\Wr ds: DS\\}
%\begin{precond}
%\exists{b : B, ds' : DS}\\
%    {pre-P(a, ds) \And\\
%     post-P(a, ds, b, ds') \And \\
%     pre-Q(b, ds')}
%\end{precond}
%\begin{postcond}
%\exists{b : B, ds' : DS}\\
%    {pre-P(a, ~{ds}) \And
%     post-P(a, ~{ds}, b, ds') \And \\
%     pre-Q(b, ds') \And
%     post-Q(b, ds', c, ds)}
%\end{postcond}
%\end{op}
%\end{vdm}
\begin{lstlisting}
PQ_DS(a: A) c : C
wr ds : DS
pre exists b : B, ds' : DS & 
      pre_P(a, ds) and 
      post_P(a,ds,b,ds') and 
      pre_Q(b,ds')
post exists b : B, ds' : DS & 
        pre_P(a,ds~) and 
        post_P(a,ds~,b.ds') and 
        pre_Q(b,ds') and
        post_Q(b,ds',c,ds)
\end{lstlisting}

It is necessary to introduce an intermediate
state component, $ds'$, which holds the value of $ds$ in between execution of the different data
transformers, $P$ and $Q$. This situation occurs when several data
transformers are allowed to modify the same data store.

In addition, this example illustrates another technicality that must
be taken into account in the transformation from \DFD s to \VDM. The
value of the state component, $ds$, before activation of the operation
is referred to differently inside the pre-condition (as $ds$) and the
post-condition (as $~{ds}$). When a pre- or post-condition (using
an old state value) is quoted it is necessary to supply information
about whether it was quoted inside a pre-condition or inside a
post-condition.
 
\noindent $\Box$\\

\subsubsection*{Example 3}

The \DFD\ from example~2 is now expanded by adding an extra data
transformer, $R$, which also modifies data store $ds$, but
otherwise is not connected to the two other data transformers ($P$ and
$Q$). The \DFD\ is given in figure~\ref{example3}.
%\makefigure{example3}{DFD for example 3}{example3}

Although the \DFD\ at first sight still looks rather simple, it turns
out that the \VDM\ specification for the \DFD\ is quite complicated. The \DFD\
is illustrative for the situation in which
the {\em writer} of the \DFD\ may understand it
differently than the {\em reader} of the \DFD. The ambiguity comes
from the fact that nothing is said about in which order the three data
transformers should modify the data store. Maybe it is not important,
but maybe it is essential that one specific execution order is chosen
in the implementation.
The notation `$*: DS$' (in the figure)
means that a value of type $DS$ will be used at this
point, but we don't know exactly {\em which} value that will be. Consider
$P$ and $R$. One of them uses the old value of $ds$ in the quotation
of its post-condition, but we don't know which one because
that depends on the execution order.
The possible execution orders are visible in the
generated \VDM\ specification.

The following implicit definition of the composite \DFD\ can be generated:

%\begin{vdm}
%\begin{op}[i]{PQR_{DS}}
%\parms{a: A, d: D}[r: C \X E]
%\ext{\Wr ds : DS\\}
%\begin{precond}
%\exists{b : B, c : C, e : E, ds', ds'' : DS}\\ {%
%\lineup[c]{(}{pre-R(d, ds) \And post-R(d, ds, e, ds') \And \\
% pre-P(a, ds') \And post-P(a, ds', b, ds'') \And pre-Q(b, ds''))} \Or\\
%\lineup[c]{(}{pre-P(a, ds) \And post-P(a, ds, b, ds') \And \\
% pre-R(d, ds') \And post-R(d, ds', e, ds'') \And pre-Q(b, ds''))} \Or\\
%\lineup[c]{(}{pre-P(a, ds) \And post-P(a, ds, b, ds') \And \\
% pre-Q(b, ds') \And post-Q(b, ds', c, ds'') \And pre-R(d, ds''))}}
%\end{precond}
%\begin{postcond}
%\Let (c, e) = r
%\Lin\\
%\exists{b:B, ds', ds'' : DS}\\
%{\lineup[c]{(}{pre-R(d, ~{ds}) \And post-R(d, ~{ds}, e, ds') \And
%               pre-P(a, ds') \And \\ post-P(a, ds', b, ds'') \And
%	       pre-Q(b, ds'') \And post-Q(b, ds'', c, ds))} \Or\\
%\lineup[c]{(}{pre-P(a, ~{ds}) \And post-P(a, ~{ds}, b, ds') \And
%              pre-R(d, ds') \And \\ post-R(d, ds', e, ds'') \And
%	      pre-Q(b, ds'') \And post-Q(b, ds'', c, ds))} \Or\\
%\lineup[c]{(}{pre-P(a, ~{ds}) \And post-P(a, ~{ds}, b, ds') \And
%              pre-Q(b, ds') \And \\ post-Q(b, ds', c, ds'') \And
%	      pre-R(d, ds'') \And post-R(d, ds'', e, ds))}}
%\end{postcond}
%\end{op}
%\end{vdm}
\begin{lstlisting}
PQR_DS(a : A, d : D) r : C * E
wr ds : DS
pre exists b : B, c : C, e : E, ds', ds'' : DS &
       (pre_R(d, ds) and post_R(d, ds, e, ds') and
        pre_P(a, ds') and post_P(a, ds', b, ds'') and 
        pre_Q(b, ds'')) or
       (pre_P(a, ds) and post_P(a, ds, b, ds') and
        pre_R(d, ds') and post_R(d, ds', e, ds'') and 
        pre_Q(b, ds'')) or
       (pre_P(a, ds) and post_P(a, ds, b, ds') and
        pre_Q(b, ds') and post_Q(b, ds', c, ds'') and 
        pre_R(d, ds''))
post let (c, e) = r
     in
       exists b:B, ds', ds'' : DS &
         (pre_R(d, ds~) and post_R(d, ds~, e, ds') and
          pre_P(a, ds') and post_P(a, ds', b, ds'') and
          pre_Q(b, ds'') and post_Q(b, ds'', c, ds)) or
         (pre_P(a, ds~) and post_P(a, ds~, b, ds') and
          pre_R(d, ds') and post_R(d, ds', e, ds'') and
          pre_Q(b, ds'') and post_Q(b, ds'', c, ds)) or
         (pre_P(a, ds~) and post_P(a, ds~, b, ds') and
          pre_Q(b, ds') and post_Q(b, ds', c, ds'') and
          pre_R(d, ds'') and post_R(d, ds'', e, ds))
\end{lstlisting}

The post-condition shows that there are three possible
execution orders: $[P, Q, R]$, $[P, R, Q]$ and $[R, P, Q]$.
The pre- and post-conditions defined above ensure that at least one
possible execution order can be used. 
$r$ is a new name, introduced to denote the output as a whole.

\noindent $\Box$\\

Below, we present the functions that are used to compose
data transformers into implicit specifications. These
functions illustrate how the problematic issues from the three
examples above are dealt with.

\begin{vdm_al}
MakeDFDOp: DFDId * DFDTopo * DFDSig * (<EXPL>|<IMPL>) -> 
           OpDef
MakeDFDOp(dfdid,dfdtopo,dfdsig,style) ==
  if style=<EXPL>
  then MakeDFDExplOp(dfdid,dfdtopo,dfdsig)
  else MakeDFDImplOp(dfdid,dfdtopo,dfdsig)
pre if style=<EXPL>
    then pre_MakeDFDExplOp(dfdid,dfdtopo,dfdsig)
    else pre_MakeDFDImplOp(dfdid,dfdtopo,dfdsig);

MakeDFDImplOp : DFDId * DFDTopo * DFDSig -> ImplOp
MakeDFDImplOp(dfdid,dfdtopo,dfdsig) ==
  let mk_(din,out,dst)=dfdsig(dfdid) in
  let partpl = MakeInpPar(din),
      residtp = MakeOutPair(out),
      dext = MakeExt(dst),
      body = MakeImplOpBody(dfdid,dfdtopo,dfdsig) in
  mk_ImplOp(OpIdConf(dfdid),partpl,residtp,dext,body)
pre dfdid in set dom dfdsig and 
    pre_MakeImplOpBody(dfdid,dfdtopo,dfdsig);
\end{vdm_al}

The function $MakeImplOpBody$ is used to generate both the pre-condition
and the post-condition of an implicit operation definition.
In order to take intermediate data store values into account,
$MakeImplOpBody$ and its auxiliary functions will use a map from state
components to the current number of intermediate values ($intm$).
The map is initialized by mapping all state components to zero
(indicating that no intermediate state values have been introduced
yet)%
\footnote{The configuration function $StateVarIntConf$ 
inserts a number of quotes corresponding to the number of the
intermediate value, as it was done in the examples.}.
In addition, a map $maxm$ with the same domain of
state components is used to ensure that a
post-condition uses the state after an operation as the last of a
series of intermediate state components. Each state
component in $maxm$ is mapped to the number of data transformers
having write access (and thus potentially introduce an
intermediate state value) to that state component.

\begin{vdm_al}
MakeImplOpBody : DFDId * DFDTopo * DFDSig -> ImplOpBody
MakeImplOpBody(dfdid,dfdtopo,dfdsig) ==
  let intm = {stid |-> 0|mk_(stid,-) in set 
                         CollectStIds(rng dfdsig)},
      maxm = {stid |-> Reduce(NoOfWr(rng dfdsig,stid))
             | mk_(stid, -) in set 
               CollectStIds(rng dfdsig)},
      dpre  = MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm),
      dpost = MakePostExpr(dfdid,dfdtopo,dfdsig,intm,maxm) 
  in
    mk_ImplOpBody(dpre,dpost)
pre let intm = {stid |-> 0|mk_(stid,-) in set 
                           CollectStIds(rng dfdsig)},
        maxm = {stid |-> Reduce(NoOfWr(rng dfdsig,stid))
               | mk_(stid,-) in set 
                 CollectStIds(rng dfdsig)} 
    in
      pre_MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm) and 
      pre_MakePostExpr(dfdid,dfdtopo,dfdsig,intm,maxm)
\end{vdm_al}

The $IntM$ domain is an auxiliary domain which is used in the formal
transformation from SA to VDM. It is used to provide information
about intermediate state values.

\begin{vdm_al}
types
  IntM = map StId to nat
\end{vdm_al}

The function $MakePreExpr$ is used to generate the pre-condition of an
implicit operation body. The function will first determine whether an 
existential quantified expressions is needed
%(which is the case if there are independent
%partitions consisiting of more than one data transformer each)
by calling $QuantNec$, and depending on that, create either a existential
quantified expression, or just the predicate part of such an expression.

\begin{vdm_al}
functions
  
MakePreExpr: DFDId * DFDTopo * DFDSig * IntM * IntM -> 
             Expr
MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm) ==
  let mk_(-,out,dst)=dfdsig(dfdid) in
  let fids = NeedsQuant(dfdtopo,dfdsig,{},{}),
  pred = MakePrePred(dfdtopo,dfdsig,intm,maxm) in
    if QuantNec(out,dst,fids,intm,maxm)
    then let bind = MakeExistsBind(fids,dst,intm,
                                   maxm,<PRE>)
         in
           mk_ExistsExpr(bind,pred)
    else pred
  pre dfdid in set dom dfdsig;
\end{vdm_al}

The function $MakePrePred$ is used to create the `body' of the pre-condition
of an implicit operation. First, all possible orders of execution are
determined. Then, for each data transformer it is ensured that its pre-condition
can be satisfied by generating a predicate in which the pre-condition of that
data transformer is quoted in a context in which all its predecessors
in a possible executation order have
been executed.
Finally, all such predicates or combined in a disjunction.

\begin{vdm_al}
MakePrePred : DFDTopo * DFDSig * IntM * IntM -> Expr
MakePrePred(dfdtopo,dfdsig,intm,maxm) ==
  let eos=ExecutionOrders(dfdtopo) in
  DBinOp(<OR>,{MakePreForEO(piseq,dfdsig,intm,maxm)
              |piseq in set eos});
\end{vdm_al}

The function $MakePreForEO$ generates a pre-expression for a specific
execution order $piseq$. An application of both the
quoted pre and the quoted post-condition
of the first data transformer in the execution order
is generated (by $MakeQuotedApply$) and then $MakePreForEO$ is called
recursively with the remainder of the data transformers in $piseq$.
A collection of intermediate state values $intm'$ is constructed in each
recursion step in order to use the correct intermediate state values
in the construction of a quotation for an operation.
All quotations are combined in a conjunction.

\begin{vdm_al}
MakePreForEO: seq1 of ProcId * DFDSig * IntM * IntM ->
              Expr
MakePreForEO(piseq,dfdsig,intm,maxm) ==
  let nid= hd piseq in
  let intm'={stid |-> if mk_(stid, <READWRITE>) in set 
                         CollectStIds({dfdsig(nid)})
                      then intm(stid) + 1
                      else intm(stid)
            | stid in set dom intm} in
  let dpre = MakeQuotedApply(nid,dfdsig(nid),intm',maxm,
                             <PRE>,<PRE>),
      dpost = MakeQuotedApply(nid,dfdsig(nid),intm',maxm,
                              <PRE>,<POST>) 
  in
   if len piseq=1
   then dpre
   else let pred=mk_BinaryExpr(dpre,<AND>,dpost) 
        in
          mk_BinaryExpr(pred,<AND>,
                        MakePreForEO(tl piseq,dfdsig,
                                     intm',maxm));
\end{vdm_al}

$MakePostExpr$ is used to generate the post-condition of an implicit operation.
When a DFD has more than one output, these outputs are combined into
a tuple expression. A new name for this tuple expression is created by
generating a let-expression. $MakePostExpr$ first determines
whether such a let-expression should be generated.
Then, the body of the post-expression is generated by calling $MakeInExpr$.

\begin{vdm_al}
MakePostExpr: DFDId * DFDTopo * DFDSig * IntM * IntM -> 
              Expr
MakePostExpr(dfdid,dfdtopo,dfdsig,intm,maxm) ==
  let mk_(-,out,dst)=dfdsig(dfdid),
      fids = NeedsQuant(dfdtopo,dfdsig, elems out,{}),
      body = MakeInExpr(out,dst,fids,dfdtopo,dfdsig,
                        intm,maxm) 
  in
    if len out<= 1
    then body
    else mk_LetExpr(MakePattern(out),ResultIdConf(),body)
pre let mk_(-,out,dst)=dfdsig(dfdid),
        fids = NeedsQuant(dfdtopo,dfdsig, elems out,{}) 
    in
      pre_MakeInExpr(out,dst,fids,dfdtopo,dfdsig,
                     intm,maxm);
\end{vdm_al}

The function $MakeInExpr$ operates in much the same way as $MakePreExpr$ does
for the generation of pre-conditions. The function examines whether an
existential quantification is needed, and if this is the case such a 
quantified expression is generated. The remainder of the post-condition is
generated by calling $MakePostPred$.

\begin{vdm_al}
MakeInExpr: seq of FlowId * State * set of FlowId * 
            DFDTopo * DFDSig * IntM * IntM -> Expr
MakeInExpr(out,dst,fids,dfdtopo,dfdsig,intm,maxm) ==
  let pred=MakePostPred(dfdtopo,dfdsig,intm,maxm) 
  in
    if QuantNec(out,dst,fids,intm,maxm)
    then let bind = MakeExistsBind(fids,dst,intm,maxm,
                                   <POST>)
         in
           mk_ExistsExpr(bind,pred)
    else pred
pre pre_MakeExistsBind(fids,dst,intm,maxm,<POST>);
\end{vdm_al}

The function $MakePostPred$ is used to create the `body' of the post-condition
of an implicit operation. First, all possible orders of execution are
determined, and for each execution order a conjunction of quoted function
applications are generated using the intermediate state values (this
is done in $MakePostForEO$).
The separate conjunctions are then combined in one large disjunction,
in this way specifying that the implementor can choose either one of the
execution orders to implement the DFD.

\begin{vdm_al}
MakePostPred : DFDTopo * DFDSig * IntM * IntM -> Expr
MakePostPred(dfdtopo,dfdsig,intm,maxm) ==
  let eos=ExecutionOrders(dfdtopo) 
  in
    DBinOp(<OR>,{MakePostForEO(piseq,dfdsig,intm,maxm)
                |piseq in set eos});
\end{vdm_al}

The function $MakePostForEO$ generates a post-expression for a specific
execution order $piseq$. An application of both the
quoted pre and the quoted post-condition
of the first data transformer in the execution order
is generated (by $MakeQuotedApply$) and then $MakePostForEO$ is called
recursively with the remainder of the data transformers in $piseq$.
A collection of intermediate state values $intm'$ is constructed in each
recursion step in order to use the correct intermediate state values
in the construction of a quotation for an operation.
All quotations are combined in a conjunction.

\begin{vdm_al}
MakePostForEO: seq1 of ProcId * DFDSig * IntM * IntM -> 
               Expr
MakePostForEO(piseq,dfdsig,intm,maxm) ==
  let nid= hd piseq in
  let intm'={stid |-> if mk_(stid, <READWRITE>) in set 
                         CollectStIds({dfdsig(nid)})
                      then intm(stid) + 1
                      else intm(stid)
            | stid in set dom intm} in
  let dpre = MakeQuotedApply(nid,dfdsig(nid),intm',maxm,
                             <POST>, <PRE>),
      dpost = MakeQuotedApply(nid,dfdsig(nid),intm',maxm,
                              <POST>,<POST>) in
   if len piseq=1
  then mk_BinaryExpr(dpre,<AND>,dpost)
  else let pred=mk_BinaryExpr(dpre,<AND>,dpost) in
  mk_BinaryExpr(pred,<AND>,MakePostForEO(tl piseq,dfdsig,
                                         intm',maxm))
pre let nid= hd piseq 
    in
      nid in set dom dfdsig and 
      pre_MakeQuotedApply(nid,dfdsig(nid),intm,maxm,
                          <POST>,<PRE>) and 
      pre_MakeQuotedApply(nid,dfdsig(nid),intm,maxm,
                          <POST>,<POST>);
\end{vdm_al}

The function $MakeExistsBind$ is used by both $MakePreExpr$ and
$MakeInExpr$ for the construction of a multiple type binding (to be used in an
existential quantification), and a correspondingly updated collection
of intermediate state values. 
%The intermediate state
%values are first updated ($intm$) by increasing each state component in $st$
%(which has write access) by one, if it is not equivalent to the last
%one.
Two lists ($outl$ and $stl$) of pairs (the variable name and 
its type) are created in which the intermediate state values
(collected in $intm$) are taken into account. Then a multiple type binding
with these two lists is returned.

\begin{vdm_al}
MakeExistsBind: set of FlowId * State * IntM * IntM * 
               (<PRE>|<POST>) -> MultTypeBind
MakeExistsBind(fs,dst,intm,maxm,c) ==
  let outl = MakeTypeBindList(fs),
      stl = [let mk_(s,-)=dst(i),
                 p = MakePatternIds(s,intm(s)+1,maxm(s),c)
             in
               mk_TypeBind(p,StateTypeConf(s))
            |i in set inds dst 
            & let mk_(-,m)=dst(i) in m=<READWRITE>]
  in
    mk_MultTypeBind(outl^stl)
pre forall mk_(s,<READWRITE>) in set elems dst&
        s in set dom intm and s in set dom maxm;
\end{vdm_al}

The function $ExecutionOrders$ generates a set of `possible
execution orders'. An
execution order is a sequence of $ProcId$s. The order of $ProcId$s in such
an execution order is a valid order in which the data transformers in a 
DFD with topology $dfdtopo$ can be executed.

\begin{vdm_al}
ExecutionOrders: DFDTopo -> set of seq1 of ProcId
ExecutionOrders(dfdtopo) ==
  let top={mk_(fid,tid)
          |mk_(fid,tid) in set rng dfdtopo &
           (is_DFDId(fid) or is_MSId(fid) or (fid = nil)) 
            and 
           (is_DFDId(tid) or is_MSId(tid) or (tid = nil))},
      top2={mk_(fid,tid)|mk_(fid,tid) in set rng dfdtopo &
            (is_DFDId(fid) or is_MSId(fid)) and 
            (is_DFDId(tid) or is_MSId(tid))} in
    let piset= dunion {{pi_1,pi_2}
                       |mk_(pi_1,pi_2) in set top}\{nil} 
    in
      {piseq | piseq in set PossibleSeqs(piset) &
               forall i,j in set inds piseq &
                  j<i => (piseq(j) not in set
                          TransClosure(piseq(i),top2,{}))};
\end{vdm_al}
$MakeQuotedApply$ generates the application of the quotation of
a pre or a post-condition of an operation. Note that the configuration
function $StateVarIntConf$ is given information about where it is
quoted from. The necessity for this was shown in example~2.

\begin{vdm_al}
MakeQuotedApply: (DFDId|MSId) * Signature * IntM * IntM * 
                 (<PRE>|<POST>) * (<PRE>|<POST>) -> Apply
MakeQuotedApply(id,mk_(din,out,dst),intm,maxm,c,c2) ==
  let inarg = [FlowIdVarConf(din(i))|i in set inds din],
      oldstarg = [let mk_(s,m)=dst(i) in
                    if m=<READ>
                    then StateVarIntConf(s,intm(s),
                                         maxm(s),c)
                    else StateVarIntConf(s,intm(s) - 1,
                                         maxm(s),c)
                 |i in set inds dst],
      outarg = [FlowIdVarConf(out(i))|i in set inds out],
      starg = [let mk_(s,-)=dst(i) in
               StateVarIntConf(s,intm(s),maxm(s),c)
              |i in set inds dst & 
               let mk_(-,m)=dst(i) in m=<READWRITE>] in
   if c2=<PRE>
  then mk_Apply("pre_"^OpIdConf(id),inarg^oldstarg)
  else mk_Apply("post_"^OpIdConf(id),inarg^oldstarg^
                                     outarg^starg)
pre forall mk_(s,m) in set elems dst&
        s in set dom intm and
        s in set dom maxm and 
        m=<READWRITE> => intm(s)>0;
\end{vdm_al}

\subsection{Functions for composing data transformers explicitly}

The explicit definitions of
operations for composing data transformers in a DFD are generated
following the same dependency strategy which is used for 
generating the implicit definitions. The principle for combining the
data transformers uses the same dependency information from the
DFD. However, since the state of the DFD is not explicitly mentioned
in the call of an operation, there is no problem with intermediate
state values for the explicit definitions. Thus, the explicit
definitions will in general be shorter and easier to read than the
implicit ones. The different execution orders are dealt with by using the
non-deterministic statement\footnote{VDM-SL has a non-deterministic statement which
takes a set of statements and executes each of them them in a
non-deterministic order.}. In this way the choice of execution order
is left open.

\subsubsection*{Example 4}

Before presenting the formal description of how \DFD s as a whole can be
transformed into explicit operation definitions, we show how
the \DFDs\ from the first three examples can be described explicitly.

The first \DFD\ from figure~\ref{example1} can be specified by the following explicit
operation definition:

%\begin{vdm}
%\begin{op}[e]{PQ}
%\signature{A \Oto C}
%\parms{a}
%\Def b = P(a)
%\Din
%\Def c = Q(b)
%\Din
%\return{c}
%\end{op}
%\end{vdm}
\begin{lstlisting}
PQ: A ==> C
PQ(a) ==
  def b = P(a)
  in
    def c = Q(b)
    in
      return c
\end{lstlisting}
\noindent

Def-statements\footnote{A def-statement corresponds to a let-statement
(or let-expression) except that it is legal at the right-hand-side of
the equal sign to use an operation call that may modify the state.}
are used to introduce the (intermediate) data flows.

For the \DFD\ in figure~\ref{example2} the following explicit operation can be
generated: 

%\begin{vdm}
%\begin{op}[e]{PQ_{DS}}
%\signature{A \Oto C}
%\parms{a}
%\Def b = P(a)
%\Din
%\Def c = Q(b)
%\Din
%\return{c}
%\end{op}
%\end{vdm}
\begin{lstlisting}
PQ_DS: A ==> C
PQ_DS(a) ==
  def b = P(a)
  in
    def c = Q(b)
    in
      return c
\end{lstlisting}
\noindent 
This operation is equivalent to the one generated for the \DFD\
in example~\ref{example1}, because
the state components that are modified by the different
operation need not be explicitly mentioned in the call of these operations.
In this respect, explicit operations in \VDMSL\ are very much similar
to procedures in imperative programming languages accessing global variables.

The following explicit operation can be generated for the \DFD\ in figure~\ref{example3}:

\begin{lstlisting}
PQR_DS: A * D ==> C * E
PQR_DS(a,d) ==
 ||
 ((def b = P(a)
   in
     def c = Q(b)
     in
       def e = R(d)
       in
         return mk_(c,e)),
  (def e = R(d)
   in
     def b = P(a)
     in
       def c = Q(b)
       in
         return mk_(c,e)), 
  (def b = P(a)
   in
     def e = R(d)
     in
       def c = Q(b)
       in
         return mk_(c,e))
  )
\end{lstlisting}
%\begin{vdm}
%\begin{op}[e]{PQR_{DS}}
%\signature{A \X D \Oto C \X E}
%\parms{a, d}
%\begin{nondetstmt}
%\lineup[c]{(}
%{\Def b = P(a)
%\Din
%\Def c = Q(b)
%\Din
%\Def e = R(d)
%\Din
%\return{mk-(c, e)}),}\\
%\lineup[c]{(}
%{\Def e = R(d)
%\Din
%\Def b = P(a)
%\Din
%\Def c = Q(b)
%\Din
%\return{mk-(c, e)}),}\\
%\lineup[c]{(}
%{\Def b = P(a)
%\Din
%\Def e = R(d)
%\Din
%\Def c = Q(b)
%\Din
%\return{mk-(c, e)})}
%\end{nondetstmt}
%\end{op}
%\end{vdm}
\noindent
The three different execution orders
are incorporated in a
non-deterministic statement. It is necessary to use a return
statement at the end of each sequence statement in the
nondeterministic statement (each represents a possible execution order)
to ensure that a correct return value is created.

\noindent $\Box$\\

The function used to create operations for \DFD s in
the explicit style is called $MakeDFDExplOp$.
The strategy is somewhat similar to the one that
has been used for the implicit style. Here we also have a number of
possible execution orders that must be taken into account.

\begin{vdm_al}
MakeDFDExplOp : DFDId * DFDTopo * DFDSig -> ExplOp
MakeDFDExplOp(dfdid,dfdtopo,dfdsig) ==
  let mk_(din,-,-) = dfdsig(dfdid),
      eos = ExecutionOrders(dfdtopo),
      intm = {stid |-> 0
             | mk_(stid,-) in set 
               CollectStIds( rng dfdsig)},
      maxm = {stid |-> Reduce(NoOfWr(rng dfdsig,stid))
             |mk_(stid,-) in set CollectStIds(rng dfdsig)} 
  in
  let optype = MakeOpType(dfdsig(dfdid)),
      parms = [mk_PatternId(FlowIdVarConf(din(i)))
              |i in set inds din],
      bodys = {MakeStmtForEO(piseq,dfdid,dfdsig)
              |piseq in set eos},
      dpre  = MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm) in
  let body = MakeNonDetStmt(bodys) in
      mk_ExplOp(OpIdConf(dfdid),optype,parms,body,dpre)
pre dfdid in set dom dfdsig and 
    let intm = {stid |-> 0
               |mk_(stid,-) in set CollectStIds(rng dfdsig)},
        maxm = {stid |-> Reduce(NoOfWr(rng dfdsig,stid))
               |mk_(stid,-) in set CollectStIds(rng dfdsig)} 
    in
      pre_MakePreExpr(dfdid,dfdtopo,dfdsig,intm,maxm) and 
      forall piseq in set ExecutionOrders(dfdtopo)&
         pre_MakeStmtForEO(piseq,dfdid,dfdsig);
\end{vdm_al}

The function $MakeExplOpBody$ is defined recursively. In each
recursion step one
data transformer is processed until all data transformers
(collected in $pids$) in the given partition $p$ have been
incorporated. The strategy is the same as for $MakePreExpr$ and
$MakePostExpr$ where a new (independent) data transformer ($nid$) is
chosen. The function $MakeCallAndPat$ creates 
a call of the operation for the given
data transformer and the corresponding pattern which the call must
be matched against. If the operation returns a value, the call
is used in a define statement. Otherwise it is a call statement
which must be included as a part of a sequence of statements.

\begin{vdm_al}
MakeStmtForEO: seq1 of ProcId * DFDId * DFDSig -> Stmt
MakeStmtForEO(piseq,dfdid,dfdsig) ==
  let nid= hd piseq in
  let mk_(call,pat) = MakeCallAndPat(nid,dfdsig(nid)),
      kind = FindKind(dfdsig(nid)) in
   if len piseq=1
   then let mk_(-,out,-)=dfdsig(dfdid) in 
         let ret=mk_Return(MakeResult(out)) in
          if kind=<OPRES>
          then mk_DefStmt(pat,call,ret)
          else mk_Sequence([call,ret])
   else let rest=MakeStmtForEO( tl piseq,dfdid,dfdsig) in
         if kind=<OPRES>
         then mk_DefStmt(pat,call,rest)
         else if is_Sequence(rest)
              then let mk_Sequence(sl)=rest in
                    mk_Sequence([call]^sl)
              else mk_Sequence([call,rest])
pre hd piseq in set dom dfdsig;
  
MakeCallAndPat : (DFDId|MSId) * Signature -> Call * [Pattern]
MakeCallAndPat(id,mk_(din,out,-)) ==
  let inarg = [FlowIdVarConf(din(i))|i in set inds din],
      outarg = [FlowIdVarConf(out(i))|i in set inds out] in
  mk_(mk_Call(OpIdConf(id),inarg),MakePattern(outarg));
  
FindKind : Signature -> <OPRES>|<OPCALL>
FindKind(sig) ==
  cases sig:
    mk_(-,[],-) -> <OPCALL>,
    others -> <OPRES>
  end;
  
MakePattern : seq of Id -> [Pattern]
MakePattern(idl) ==
  cases len idl:
    0 -> nil ,
    1 -> mk_PatternId( hd idl),
  others -> mk_TuplePattern([mk_PatternId(idl(i)) 
                            | i in set inds idl])
  end;
  
MakeResult : seq1 of Id -> Expr
MakeResult(idl) ==
  if len idl=1
  then FlowIdVarConf( hd idl)
  else mk_TupleConstructor([FlowIdVarConf(idl(i))
                           |i in set inds idl]);
\end{vdm_al}

\subsection{General Auxiliary Functions}

The function $DBinOp$ generates an expression by distributing a binary operator
over a set of expressions.

\begin{vdm_al}
DBinOp : BinaryOp * set of Expr -> Expr
DBinOp(op,es) ==
  let e in set es in
   if  card es=1
   then e
   else mk_BinaryExpr(e,op,DBinOp(op, es \ {e}))
pre es<>{};
\end{vdm_al}

The function $CollectExtDFs$ is intended to collect the external data
flow identifiers from the topology of a DFD.

\begin{vdm_al}
CollectExtDFs : DFDTopo -> set of FlowId
CollectExtDFs(dfdtopo) ==
  {fid|fid in set dom dfdtopo 
      & let mk_(pid_1,pid_2)=dfdtopo(fid) in
           is_EPId(pid_1) or is_EPId(pid_2)};
  
NeedsQuant: DFDTopo * DFDSig * set of FlowId * 
           set of ProcId -> set of FlowId
NeedsQuant(dfdtopo,dfdsig,notneeded,pids) ==
  let top={mk_(fid,tid)|mk_(fid,tid) in set rng dfdtopo &
           (is_DFDId(fid) or is_MSId(fid)) and 
           (is_DFDId(tid) or is_MSId(tid))} 
  in
   if  dom dfdsig=pids
   then {}
   else let pid in set dom dfdsig \ pids in
        if TransClosure(pid,top,{})={} and 
           EquivClass(top,{pid})= dom dfdsig
        then NeedsQuant(dfdtopo,dfdsig,notneeded,
                        pids union {pid})
        else let mk_(-,out,-)=dfdsig(pid) in
              NeedsQuant(dfdtopo,dfdsig,notneeded,
                         pids union {pid}) union 
                         elems out \ notneeded;
\end{vdm_al}
The function $QuantNec$ is responsible for determining whether it is
necessary to use an existential quantification at a given place in a
post-condition.

\begin{vdm_al}
QuantNec: seq of FlowId * State * set of FlowId * 
           IntM * IntM -> bool 
QuantNec(out,dst,fids,intm,maxm) ==
  fids <> {} or
  -- (exists id in set elems out&  id in set fids) or 
  (exists mk_(s,m) in set elems dst&
       m=<READWRITE> and intm(s)<maxm(s))
pre forall mk_(s,-) in set elems dst&
       s in set dom intm and s in set dom maxm;
  
MakeTypeBindList : set of FlowId -> seq of TypeBind
MakeTypeBindList(fids) ==
 if fids={}
 then []
 else let fid in set fids 
      in
        let pat = [mk_PatternId(FlowIdVarConf(fid))],
            first=mk_TypeBind(pat,FlowIdTypeConf(fid)) 
        in
          [first]^MakeTypeBindList(fids \ {fid})
  measure CardFId;
  
CardFId: set of FlowId -> nat
CardFId(s) ==
  card s;
  
MakePatternIds: (Id | DSId) * nat * nat * 
                (<PRE>|<POST>) -> seq of PatternId
MakePatternIds(id, n, max, c) ==
  if (n = max) and (c = <POST>)
  then [mk_PatternId(StateVarConf(id))]
  else cases n:
       0      -> if c = <PRE>
                 then [mk_PatternId(StateVarConf(id))]
                 else [mk_PatternId(StateOldVarConf(id))],
       others -> MakePatternSeq(StateVarConf(id), n, max)
       end;
  
MakePatternSeq: Id * nat * nat -> seq of PatternId
MakePatternSeq(id, n, max) ==
  if n = max
  then [mk_PatternId(id ^ "'")]
  else [mk_PatternId(id ^ "'")] ^ 
       MakePatternSeq(id ^ "'", n+1, max)
  pre n <= max
  measure TowardsMax;
  
  TowardsMax: Id * nat * nat -> nat
  TowardsMax(-,n,max) ==
    max - n;
\end{vdm_al}

The function $EquivClass$ collects all data transformers from a
topology which are connected in an equivalence class.

\begin{vdm_al}
EquivClass: set of (ProcId * ProcId) * set of (MSId|DFDId) ->
            set of (MSId|DFDId)
EquivClass(top,ids) ==
   if exists mk_(fid,tid) in set top&
   (fid in set ids and tid not in set ids) or 
   (tid in set ids and fid not in set ids)
    then let mk_(fid,tid) in set top be st 
           (fid in set ids and tid not in set ids) or 
           (tid in set ids and fid not in set ids)
       in
         EquivClass(top,ids union {fid,tid})
  else ids;
\end{vdm_al}

$MakeNonDetStmt$ takes a set of statements, and
generate a non-deterministic statement from them if there is more than
one partition.

\begin{vdm_al}
MakeNonDetStmt : set of Stmt -> Stmt
MakeNonDetStmt(stmts) ==
  cases  card stmts:
    1 -> let {s}=stmts in s,
  others -> mk_NonDetStmt(stmts)
  end
pre  card stmts<>0;
\end{vdm_al}

The function $CollectStIds$ collects all state
component identifiers from a DFD.

\begin{vdm_al}
CollectStIds: set of Signature -> set of (StId * Mode)
CollectStIds(sigs) ==
  dunion { elems dst|mk_(-,-,dst) in set sigs};
\end{vdm_al}

The purpose of $NoOfWr$ is to determine how many data transformers there
are in a given partition that have write access to a given state component.
This information is used to deal with the intermediate state values.

\begin{vdm_al}
NoOfWr: set of Signature * StId -> nat 
NoOfWr(sigs,stid) ==
  if sigs={}
  then 0
  else let sig in set sigs in
  let mk_(-,-,dst)=sig in
   if mk_(stid,<READWRITE>) in set elems dst
   then 1+NoOfWr(sigs \ {sig},stid)
   else NoOfWr(sigs \ {sig},stid);
  
Reduce: nat -> nat
Reduce(n) ==
  if (n = 0) or (n = 1)
  then n
  else n - 1;
\end{vdm_al}

\subsection{Configuration functions}

\begin{vdm_al}
ModIdConf : DFDId -> Id
ModIdConf(mk_DFDId(id)) ==
  id^"Module";
  
StateIdConf : DFDId -> Id
StateIdConf(mk_DFDId(id)) ==
  id^"State";
  
DSIdConf : DSId -> Id
DSIdConf(mk_DSId(id)) ==
  id;
  
OpIdConf : MSId | DFDId | Id -> Id
OpIdConf(id) ==
  cases id:
    mk_MSId(id'),
    mk_DFDId(id') -> id',
    others        -> id
  end;
\end{vdm_al}
The $StateVarIntConf$ function needs to know whether a
state component is being referred to in a pre-condition or in a
post-condition of an operation. This is caused by the fact that the
state before the call of the operation is denoted differently in a
pre-condition than in a post-condition (in a pre-condition $v$ means
the state before calling the operation, while that is denoted by $~v$
in a post-condition).

\begin{vdm_al}
StateVarIntConf: (Id | DSId) * nat * nat * (<PRE>|<POST>) 
                 -> Id
StateVarIntConf(id,n,max,c) ==
  if (max=n) and (c=<POST>)
  then StateVarConf(id)
  else cases n:
       0   ->  if c=<PRE>
               then StateVarConf(id)
               else StateOldVarConf(id),
       1    -> StateVarConf(id)^"'",
       others -> StateVarIntConf(id,n - 1,max,c)^"'"
       end;
  
VarConf : StId -> Id
VarConf(id) ==
  if is_DSId(id)
  then StateVarConf(id)
  else FlowIdVarConf(id);
  
TypeConf : DSId|FlowId -> Id
TypeConf(id) ==
  if is_DSId(id)
  then StateTypeConf(id)
  else FlowIdTypeConf(id);
  
FlowIdVarConf : Id -> Id
FlowIdVarConf(id) ==
  ToLower(id);
  
FlowIdTypeConf : Id -> Id
FlowIdTypeConf(id) ==
  ToUpper(id);
  
StateTypeConf : Id | DSId -> Id
StateTypeConf(id) ==
  ToUpper(id);
  
StateVarConf : Id | DSId -> Id
StateVarConf(id) ==
  ToLower(id);
  
StateOldVarConf : Id | DSId -> Id
StateOldVarConf(id) ==
  ToLower(id)^"old";
  
TypeModConf : () -> Id
TypeModConf() ==
  "TypeModule";
  
ResultIdConf : () -> Id
ResultIdConf() ==
  "r";
  
PossibleSeqs: set of ProcId -> set of seq of ProcId
PossibleSeqs(pids) ==
  if pids = {}
  then {}
  else if card pids = 1
       then {[pid]| pid in set pids}
       else let pid in set pids
            in
              let rest = PossibleSeqs(pids \ {pid})
              in
                dunion {InsertPId(pid, seq') 
                       | seq' in set rest}
measure CardPSet;

CardPSet: set of ProcId -> nat
CardPSet(s) ==
  card s;
  
InsertPId: ProcId * seq of ProcId -> set of seq of ProcId
InsertPId(pid, seq') ==
  {seq'(1,...,i) ^ [pid] ^ seq'(i+1,...,len(seq')) 
  | i in set {0,...,len(seq')}};
  
ToLower: Id | DSId | DFDId | EPId | MSId -> Id
ToLower(id) ==
  let realid = cases id:
                 mk_DSId(id'),
                 mk_DFDId(id'),
                 mk_EPId(id'),
                 mk_MSId(id')  -> id',
                 others        -> id
               end
  in
    [LowerChar(realid(i)) | i in set inds realid];
\end{vdm_al}
The auxiliary functions ($ToLower$ and $ToUpper$) are to change
all letters to lower-case and upper-case letters respectively. 

\begin{vdm_al}
LowerChar: char -> char
LowerChar(c) ==
  cases c:
  'A' -> 'a',
  'B' -> 'b',
  'C' -> 'c',
  'D' -> 'd',
  'E' -> 'e',
  'F' -> 'f',
  'G' -> 'g',
  'H' -> 'h',
  'I' -> 'i',
  'J' -> 'j',
  'K' -> 'k',
  'L' -> 'l',
  'M' -> 'm',
  'N' -> 'n',
  'O' -> 'o',
  'P' -> 'p',
  'Q' -> 'q',
  'R' -> 'r',
  'S' -> 's',
  'T' -> 't',
  'U' -> 'u',
  'V' -> 'v',
  'W' -> 'w',
  'X' -> 'x',
  'Y' -> 'y',
  'Z' -> 'z',
  others -> c
  end;
  
  
ToUpper: Id | DSId | DFDId | EPId | MSId -> Id
ToUpper(id) ==
  let realid = cases id:
                 mk_DSId(id'),
                 mk_DFDId(id'),
                 mk_EPId(id'),
                 mk_MSId(id')  -> id',
                 others        -> id
               end
  in
    [UpperChar(realid(i)) | i in set inds realid];
  
UpperChar: char -> char
UpperChar(c) ==
  cases c:
  'a' -> 'A',
  'b' -> 'B',
  'c' -> 'C',
  'd' -> 'D',
  'e' -> 'E',
  'f' -> 'F',
  'g' -> 'G',
  'h' -> 'H',
  'i' -> 'I',
  'j' -> 'J',
  'k' -> 'K',
  'l' -> 'L',
  'm' -> 'M',
  'n' -> 'N',
  'o' -> 'O',
  'p' -> 'P',
  'q' -> 'Q',
  'r' -> 'R',
  's' -> 'S',
  't' -> 'T',
  'u' -> 'U',
  'v' -> 'V',
  'w' -> 'W',
  'x' -> 'X',
  'y' -> 'Y',
  'z' -> 'Z',
  others -> c
  end
\end{vdm_al}

\section{Conclusions}
\label{sec:conclusions}

In this paper we have defined a semantics for \DFDs\ by formally
specifying a transformation from \DFDs\ to \VDM\ specifications. In this
section we give a brief overview of related work in the area of
defining semantics for \DFDs, and we conclude with some
observations on our work and some ideas for further research.

\subsection{Related work}

When \DFDs\ were originally introduced, they were presented as a
graphical notation. The intended semantics of this notation
was defined verbally, but the need for a formal base is now more
commonly recognized, see e.g.~\cite{Hofstede&92}.
Work has been done on formalizing \DFDs, with the intention
of either disambiguating their meaning, or of using
the formal semantics as a base for a combined formal/structured method.

In \cite{Randell90} a translation back and forth between \DFDs\ and Z specifications is described.
\cite{Alabiso88} contains an explanation of how \DFDs\ can manually
be transformed into an object-oriented design. The paper touches
upon some problematic issues arising in a transformation from \DFDs.
In \cite{Semmens&91c} a small example of how a \DFD\ can be transformed
in Z is presented. However, no formal semantics of the \DFDs\ is
presented and it is not clear to what extent the transformation can
be automated.
In \cite{Bruza&89} some guidelines for how semantics can be attached
to \DFDs\ are given. It is sketched how \DFDs\ can be transformed into a
Petri net variant combined with path expressions.
In \cite{Elmstrom&93} a complete semantics is provided for the Ward
and Mellor version of SA/RT by means of high-level timed Petri nets.
Here an executable subset of VDM-SL is also used to describe the
mini-specifications of an SA/RT model.
In \cite{Adler88} a semantic base for guiding the decomposition
process in the construction of a hierarchy of \DFDs\ is presented. This
work is based on graph theory in an algebraic setting.
Kevin Jones uses \VDM\ to provide a denotational style semantics of a
non-conventional machine architecture (The Manchester DataFlow Machine)
based on data flow graphs \cite{Jones87e}.
In \cite{Fraser&91} a rule-based approach for transforming \SA\ products
into \VDM\ specifications is presented. Their \VDM\ specifications are
very explicit and hard to read, mainly because of the way
decision tables have been taken into account.
Polack concentrate on the methodological aspects of combining
\SA\ notations and {\small Z}\ specifications \cite{Polack92}, the resulting
combination is known as {\small SAZ}.
Tse and Pong use extended Petri nets for formalizing \DFDs\ \cite{Tse&89}.
France discusses an algebraic approach to modeling control-extended
DFDs in~\cite{France92}.
In~\cite{Semmens&92a} an overview of several approaches to combining \SA\
techniques and notations with formal methods (including our approach) is
given.

The main result of the work presented in this paper with respect to
other work in this area is that we have been able to capture the semantics of
a \DFD\ as a whole in a compositional way at a high level of
abstraction, taking into account the whole hierarchy of \DFDs\ that is
created during an \SA\ development, which to our knowledge
has not been done before.
 
\subsection{Status and Perspectives}

With respect to the semantics of \DFDs\ in terms of a formal
transformation to \VDM\ specifications the following observations can be made:
\begin{itemize}
\item
   An unambiguous interpretation of \DFDs\ is available, which
   -- due to the particular transformation chosen -- is abstract.
   Consequently, there are few restrictions on the further development
   of the \DFD\ into a software design.
\item
   The transformation is executable, which opens up possibilities for
   automatically generating \VDM\ specifications from \DFDs. In this way,
   the initial effort needed to produce a formal specification is
   significantly decreased.
\item
   The \DFDs\ and their \VDM\ counterparts can be regarded as equivalent
   views on the system, using different representations. 
\end{itemize}

A few restrictions apply to our transformation, however.
One of these is the exclusion of concurrent systems,
whereas some \SA\ extensions provide facilities for specifying such
systems.
We briefly mentioned how some of the \DFD\ constructs would be interpreted
if we had taken concurrency into account.
A transformation from a real-time \SA\ variant to a combination of \VDM\ and
e.g. CCS \cite{Milner80}, CSP \cite{Hoare85} or Petri nets \cite{Peterson77}
would be an interesting area for future research. We foresee that
the main problem in automatically providing a concurrent specification
description would be that such a description would have a very low level of
abstraction.
Intuitively it would be expected that each data transformer is transformed into
a {\em process} and that all these processes are executed in parallel. This
would result in a large number of processes due to the number of data
transformers usually present in a \DFD.

Concerns might also arise with respect to the size of the class of \DFDs\
having no cyclic internal data flows and obeying the one-to-one mapping
from input values to output values.
In our experience, cyclic data flows are often used to
model error situations which could also have been modeled by means of state
components in data stores. Therefore, most \DFDs\ with such cyclic
structures can be rewritten using only acyclic structures, and
therefore we believe that this restriction is not very important.
With respect to the restriction to one-to-one mappings between input
values and output values, we can say that usually the need for other
mappings only occurs when \DFDs\ are used as a design notation, but not
when they are used as an (abstract) specification notation. Therefore, 
this restriction cannot be considered very important in our situation.
\newpage
\bibliographystyle{nnewalpha}
%% note: retrieve dan.bib from https://github.com/overturetool/overture/tree/development/documentation/bib
\bibliography{dan}

\appendix
\newpage
\section{Abstract Syntax for Structured Analysis}

The version of Structured Analysis considered in this \documenttype\
consists of a hierarchy of data
flow diagrams ($HDFD$), a data dictionary ($DD$), and a collection of
uniquely identified mini-specifications ($MSs$). The types of all data flows
in the data flow diagrams must be defined in the data
dictionary. In addition to this,
the signature of the top-level DFD must conform to 
its topology.

\begin{vdm_al}
types
  
SA = HDFD * DD * MSs
inv mk_(hdfd,dd,-) == 
  FlowTypeDefined(hdfd,dd) and TopLevelSigOK(hdfd);
\end{vdm_al}

The hierarchy of data flow diagrams is defined recursively. Each
$HDFD$ has a name, an unordered collection of data stores used in
the DFD, a description of its topology, a collection of 
uniquely identified data transformers (``bubbles") 
which are further decomposed as $HDFD$s,
and a description of the signatures of all the data transformers.

The invariant for $HDFD$ ensures that the signatures of the data
transformers (and the DFD as a whole) are consistent with the topology
and the data stores, and that all the DFDs which are further
decomposed are described.

\begin{vdm_al}
HDFD = DFDId * DSs * DFDTopo * DFDMap * DFDSig;
--  inv mk_(id,dss,dfdtop,dfdmap,dfdsig) == 
--    DFDSigConsistent(id,dfdtop,dss,dfdmap,dfdsig) and 
--    LowerLevelUsed(dfdtop,dfdmap);
  
DSs = set of DSId;
  
DSId :: seq of char;
\end{vdm_al}

The topology of a DFD is a collection of uniquely identified data
flows. Each data flow is directed from a data transformer to another
data transformer. The data transformers can either be further decomposed
($DFDId$) or they can be primitive ($MSId$). An external process
($EPId$) is identified by its name.
At lower level DFDs where the data flow goes to (or comes
from) another data transformer which is outside the DFD the name is
omitted (the value {\textbf{\ttfamily nil}} is used).

The invariant requires that the topology of the
internal connections is acyclic.

\begin{vdm_al}
DFDTopo = map FlowId to ([ProcId] * [ProcId])
inv dfdtopo == 
  let top={mk_(fid,tid)
          |mk_(fid,tid) in set rng dfdtopo 
          & (is_DFDId(fid) or is_MSId(fid)) and
            (is_DFDId(tid) or is_MSId(tid))} in
    NotRecursive(top) and
  forall flowid in set dom dfdtopo & 
     FlowConnectOK(dfdtopo(flowid));
  
FlowId = seq of char;
  
ProcId = DFDId|MSId|EPId;
  
DFDMap = map DFDId to HDFD;
  
DFDSig = map (DFDId|MSId) to Signature;
\end{vdm_al}

A signature for a description of a data transformer consists of
input, output, and state information. If a data transformer does not
have any connection to a state component which it is changing, it must produce
some output value instead.

\begin{vdm_al}
Signature = Input * Output * State
inv mk_(-,out,sta) == 
  (sta=[]) => (out<>[]) and 
  (out=[]) => (exists mk_(-,m) in set elems sta & 
                 m=<READWRITE>);
  
Input = seq of FlowId;
  
Output = seq of FlowId;
\end{vdm_al}

The {\em State} part of a signature is a sequence of pairs of state
variable identifiers (either data store identifiers or
data flows between the system and the external
processes) and the modes in which they are accessed.

\begin{vdm_al}
State = seq of (StId * Mode);
  
StId = DSId|FlowId;
  
Mode = <READ>|<READWRITE>;
  
DD = map Id to Type;
  
MSs = map MSId to MS;
  
MS = OpDef;
  
DFDId :: seq of char;
  
EPId :: seq of char;
  
MSId :: seq of char
\end{vdm_al}

\subsubsection*{Auxiliary Functions for Invariants}

All data flows must have a type defined in the data dictionary
(checked by $FlowTypeDefined$).

\begin{vdm_al}
functions
  
FlowTypeDefined : HDFD * DD -> bool 
FlowTypeDefined(mk_(-,-,dfdtop,-,-),dd) ==
  forall fid in set dom dfdtop & 
     FlowIdTypeConf(fid) in set dom dd;
\end{vdm_al}

The data flows between the external processes and
the specified system are treated as state components. 
Therefore, the top-level
operation specifying the whole system contains no input or output
(checked by $TopLevelSigOK$).
All data flows must be present in the state component being either read or
write components, depending upon whether they are ingoing or outgoing data
flows.

\begin{vdm_al}
TopLevelSigOK: HDFD -> bool 
TopLevelSigOK(mk_(sysid,-,dfdtop,-,dfdsig)) ==
  sysid in set dom dfdsig and
  let mk_(din,out,dst)=dfdsig(sysid) in
  din=[] and out=[] and
  forall flowid in set dom dfdtop&
    let mk_(fid,tid)=dfdtop(flowid) in
      (is_EPId(fid) => 
       mk_(flowid,<READ>) in set elems dst) and 
      (is_EPId(tid) => 
       mk_(flowid,<READWRITE>) in set elems dst);
\end{vdm_al}

In order for the signature mapping to be consistent it is necessary
to ensure that all data stores are connected to data transformers,
that all signatures reflect the information about flows from the
topology, that all identifiers mentioned in the signatures are
available, and finally that signatures are provided for all data
transformers used in the DFD (checked by $DFDSigConsistent$ and its
auxiliary functions).

\begin{vdm_al}
DFDSigConsistent: DFDId * DFDTopo * DSs * DFDMap * DFDSig 
                  -> bool 
DFDSigConsistent(id,dfdtop,dss,dfdmap,dfdsig) ==
  DSConnected(dss,dfdsig) and 
  SigsAllRight(dfdtop,dfdsig) and 
  IdsInSigsAvail(dss,dfdtop, rng dfdsig) and 
  SigsForAllUsedIds(id, rng dfdtop,dfdmap,dfdsig);
  
DSConnected : DSs * DFDSig -> bool 
DSConnected(dss,dfdsig) ==
  forall dsid in set dss&
   exists mk_(-,-,dst) in set rng dfdsig&
   exists i in set inds dst&
   let mk_(id,-)=dst(i) in
    dsid=id;
  
SigsAllRight : DFDTopo * DFDSig -> bool 
SigsAllRight(dfdtop,dfdsig) ==
  forall flowid in set dom dfdtop &
   cases dfdtop(flowid):
    mk_(id,mk_EPId(-)) -> let mk_(-,-,dst)=dfdsig(id) in
                            mk_(flowid,<READWRITE>) in set 
                            elems dst,
    mk_(mk_EPId(-),id) -> let mk_(-,-,dst)=dfdsig(id) in
                            mk_(flowid,<READ>) in set 
                            elems dst,
    mk_(nil, id)       -> let mk_(din,-,-) = dfdsig(id) 
                          in
                            flowid in set elems din,
    mk_(id, nil) -> let mk_(-,out,-) = dfdsig(id) in
                      flowid in set elems out,
    mk_(fid,tid) -> let mk_(-,out,-) = dfdsig(fid),
                        mk_(din,-,-) = dfdsig(tid) in
                      (flowid in set elems out) and 
                      (flowid in set elems din)
   end;
  
IdsInSigsAvail : DSs * DFDTopo * set of Signature -> bool 
IdsInSigsAvail(dss,dfdtop,sigs) ==
  let fids=CollectExtDFs(dfdtop) in
  forall mk_(din,out,dst) in set sigs&
    elems din subset dom dfdtop and  
    elems out subset dom dfdtop and  
    elems dst subset {mk_(id,m)
                     |id in set dss union fids, 
                      m in set {<READ>,<READWRITE>}};
  
LowerLevelUsed : DFDTopo * DFDMap -> bool 
LowerLevelUsed(dfdtop,dfdmap) ==
  let ids =  dom dfdmap in
  forall mk_(fid,tid) in set rng dfdtop &
   (is_DFDId(fid) => fid in set ids) and 
   (is_DFDId(tid) => tid in set ids);
  
SigsForAllUsedIds: DFDId * set of ([ProcId] * [ProcId]) * 
                   DFDMap * DFDSig -> bool 
SigsForAllUsedIds(id,top,dfdmap,dfdsig) ==
 (forall dfdid in set dom dfdmap&
   let mk_(-,-,-,-,dfdsig')=dfdmap(dfdid) in
     dfdsig'(dfdid)=dfdsig(dfdid)) and
     let sigs= dom dfdsig in
       id in set sigs and -- dfds subset sigs and 
       forall mk_(fid,tid) in set top&
         ((is_MSId(fid) or is_DFDId(fid)) => 
          (fid in set sigs)) and 
         ((is_MSId(tid) or is_DFDId(tid)) => 
          (tid in set sigs));
  
FlowConnectOK : ([ProcId] * [ProcId]) -> bool 
FlowConnectOK(mk_(fid,tid)) ==
  ((is_EPId(fid) or fid=nil ) => 
   (is_DFDId(tid) or is_MSId(tid))) and 
  ((is_EPId(tid) or tid=nil ) => 
   (is_DFDId(fid) or is_MSId(fid)));
  
NotRecursive : set of ((DFDId|MSId) * (DFDId|MSId)) -> 
               bool 
NotRecursive(top) ==
  forall mk_(f,-) in set top&
     (f not in set TransClosure(f,top,{}));
  
TransClosure: (DFDId|MSId) * set of ((DFDId|MSId) * 
                                     (DFDId|MSId)) *
               set of (DFDId|MSId) -> set of (DFDId|MSId)
TransClosure(pid,top,dset) ==
   if exists mk_(fromid,toid) in set top&
      ((fromid=pid) or (fromid in set dset)) and 
      (toid not in set dset)
   then let mk_(fromid,toid) in set top be st
           ((fromid=pid) or (fromid in set dset)) and 
           (toid not in set dset)
        in TransClosure(pid,top,dset union {toid})
   else dset
\end{vdm_al}

\newpage
\section{The Abstract Syntax for VDM-SL}

In this appendix we provide an abstract syntax for the part of VDM-SL
which we actually use in the definition of the formal semantics of
DFDs. The abstract syntax for the structuring part is an extension to
the abstract syntax from the VDM-SL standard because structuring is
not yet a part of the standard. However, this abstract syntax
correspond closely to a part of the abstract syntax used in the IFAD
VDM-SL language. The abstract syntax for the flat language is simply a
subset of the one used in the VDM-SL standard. None of the subsections
below are annotated because this is done elsewhere already.

\subsection{Abstract Syntax for Structuring}

\begin{vdm_al}
types

Document = set of Module;
  
Module = ModuleId * Interface * Definitions;
 
ModuleId = seq of char;
  
Interface = Imports * Export;
  
Imports = set of Import;
  
Import = ModuleId * ModuleSig;
  
Export = ModuleSig;
  
ModuleSig = set of Sig;
  
Sig = TypeSig|OpSig;
  
TypeSig :: TypeId;
  
TypeId = seq of char;
  
OpSig :: id: Id 
         optype : OpType 
         stids : seq of Id;
\end{vdm_al}

\subsection{Abstract Syntax for the Flat Language}

\begin{vdm_al}
Definitions = set of Definition;
  
Definition = StateDef|OpDef; --|... 
  
StateDef :: id:Id
            fields: seq of Field;
  
Field :: sel:[Id]
         type:Type;
  
OpDef = ExplOp|ImplOp;
  
ExplOp :: id:Id
          optype:OpType
          parms: seq of Pattern
          body:Stmt
          dpre:Expr;
  
ImplOp :: id:Id
          partp: seq of ParType
          residtp:[IdType]
          dext: seq of ExtVarInf
          body:ImplOpBody;
  
ImplOpBody :: dpre:[Expr]
              dpost:Expr;
  
ParType :: pat:Pattern
           type:Type;
  
IdType :: id:Id
          type:Type;
  
ExtVarInf :: mode:ReadWriteMode
             id:Id
             type:Type;
  
ReadWriteMode = <READ>|<READWRITE>;
  
OpType :: dom':[Type]
          rng':[Type];
  
Type = ProductType |MapType|SetType|SeqType | TypeId | 
       BasicType | EnumType | OptionalType | UnionType; 
       --|... 
  
ProductType :: product: seq1 of Type;
  
MapType :: d: Type
           r: Type;
  
SetType :: Type;
  
SeqType :: Type;
  
BasicType = <TOKEN> | <CHAR> | <BOOL>;
  
EnumType :: seq of char;
  
OptionalType :: Type;
  
UnionType :: set of Type;

Stmt = DclStmt|DefStmt|NonDetStmt|Call|Sequence|Return|
       <IDENT>; -- |... 
  
DclStmt :: dcls: set of AssDef
           body:Stmt;
  
AssDef :: var:Id
          tp:Type;
  
DefStmt :: lhs:Pattern
           rhs:Expr|Call
           din:Stmt;
  
NonDetStmt :: stmts: set of Stmt;
  
Call :: oprt:Id
        args: seq of Expr;
  
Sequence :: stmts: seq1 of Stmt;
  
Return :: val:[Expr];
  
Expr = LetExpr|IfExpr|QuantExpr|BinaryExpr|
       TupleConstructor|Apply|Id|BoolLit; 
       --| ... 
  
LetExpr :: lhs:Pattern
           rhs:Expr
           din:Expr;
  
IfExpr :: test : Expr
          con  : Expr
          alt  : Expr;
  
QuantExpr = ExistsExpr; --| ... 
  
ExistsExpr :: bind: MultTypeBind
              pred:Expr;
  
BinaryExpr :: left:Expr
              op:BinaryOp
              right:Expr;
  
BinaryOp = <AND> | <OR> | <EQUAL> | <MEMB>; --| ... 

  
TupleConstructor :: fields: seq1 of Expr;
  
Apply :: name:Expr
         arg: seq of Expr;
  
BoolLit:: bool;
  
MultTypeBind :: mtb: seq1 of TypeBind;
  
TypeBind :: pats:seq of Pattern
            tp:Type;
  
Pattern = PatternId|TuplePattern; --| ... 
  
PatternId :: name:[Id];
  
TuplePattern :: fields: seq1 of Pattern;
  
Id = seq of char
\end{vdm_al}


~~~
###listings.sty

~~~
%%
%% This is file `listings.sty',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% listings.dtx  (with options: `kernel')
%% 
%% Please read the software license in listings.dtx or listings.pdf.
%%
%% (w)(c) 1996 -- 2003 Carsten Heinz and/or any other author
%% listed elsewhere in this file.
%%
%% This file is distributed under the terms of the LaTeX Project Public
%% License from CTAN archives in directory  macros/latex/base/lppl.txt.
%% Either version 1.0 or, at your option, any later version.
%%
%% Permission is granted to modify this file. If your changes are of
%% general interest, please contact the address below.
%%
%% Send comments and ideas on the package, error reports and additional
%% programming languages to <cheinz@gmx.de>.
%%
\def\filedate{2003/06/21}
\def\fileversion{1.1}
\NeedsTeXFormat{LaTeX2e}
\ProvidesPackage{listings}
             [\filedate\space\fileversion\space(Carsten Heinz)]
\def\lst@CheckVersion#1{\edef\reserved@a{#1}%
    \ifx\lst@version\reserved@a \expandafter\@gobble
                          \else \expandafter\@firstofone \fi}
\let\lst@version\fileversion
\def\lst@InputCatcodes{%
    \makeatletter \catcode`\"12%
    \catcode`\^^@\active
    \catcode`\^^I9%
    \catcode`\^^L9%
    \catcode`\^^M9%
    \catcode`\%14%
    \catcode`\~\active}
\def\lst@RestoreCatcodes#1{%
    \ifx\relax#1\else
        \noexpand\catcode`\noexpand#1\the\catcode`#1\relax
        \expandafter\lst@RestoreCatcodes
    \fi}
\edef\lst@RestoreCatcodes{%
    \noexpand\lccode`\noexpand\/`\noexpand\/%
    \lst@RestoreCatcodes\"\^^I\^^M\~\^^@\relax}
\lst@InputCatcodes
\AtEndOfPackage{\lst@RestoreCatcodes}
\def\@lst{lst}
\def\lst@IfSubstring#1#2{%
    \def\lst@temp##1#1##2##3\relax{%
        \ifx \@empty##2\expandafter\@secondoftwo
                 \else \expandafter\@firstoftwo \fi}%
    \expandafter\lst@temp#2#1\@empty\relax}
\def\lst@IfOneOf#1\relax#2{%
    \def\lst@temp##1,#1,##2##3\relax{%
        \ifx \@empty##2\expandafter\@secondoftwo
                 \else \expandafter\@firstoftwo \fi}%
    \expandafter\lst@temp\expandafter,#2,#1,\@empty\relax}
\def\lst@DeleteKeysIn#1#2{%
    \expandafter\lst@DeleteKeysIn@\expandafter#1#2,\relax,}
\def\lst@DeleteKeysIn@#1#2,{%
    \ifx\relax#2\@empty
        \expandafter\@firstoftwo\expandafter\lst@RemoveCommas
    \else
        \ifx\@empty#2\@empty\else
            \def\lst@temp##1,#2,##2{%
                ##1%
                \ifx\@empty##2\@empty\else
                    \expandafter\lst@temp\expandafter,%
                \fi ##2}%
            \edef#1{\expandafter\lst@temp\expandafter,#1,#2,\@empty}%
        \fi
    \fi
    \lst@DeleteKeysIn@#1}
\def\lst@RemoveCommas#1{\edef#1{\expandafter\lst@RC@#1\@empty}}
\def\lst@RC@#1{\ifx,#1\expandafter\lst@RC@ \else #1\fi}
\def\lst@ReplaceIn#1#2{%
    \expandafter\lst@ReplaceIn@\expandafter#1#2\@empty\@empty}
\def\lst@ReplaceInArg#1#2{\lst@ReplaceIn@#1#2\@empty\@empty}
\def\lst@ReplaceIn@#1#2#3{%
    \ifx\@empty#3\relax\else
        \def\lst@temp##1#2##2{%
            \ifx\@empty##2%
                \lst@lAddTo#1{##1}%
            \else
                \lst@lAddTo#1{##1#3}\expandafter\lst@temp
            \fi ##2}%
        \let\@tempa#1\let#1\@empty
        \expandafter\lst@temp\@tempa#2\@empty
        \expandafter\lst@ReplaceIn@\expandafter#1%
    \fi}
\providecommand*\@gobblethree[3]{}
\def\lst@GobbleNil#1\@nil{}
\def\lst@Swap#1#2{#2#1}
\def\lst@true{\let\lst@if\iftrue}
\def\lst@false{\let\lst@if\iffalse}
\lst@false
\def\lst@IfNextCharsArg#1{%
    \def\lst@tofind{#1}\lst@IfNextChars\lst@tofind}
\def\lst@IfNextChars#1#2#3{%
    \let\lst@tofind#1\def\@tempa{#2}\def\@tempb{#3}%
    \let\lst@eaten\@empty \lst@IfNextChars@}
\def\lst@IfNextChars@{\expandafter\lst@IfNextChars@@\lst@tofind\relax}
\def\lst@IfNextChars@@#1#2\relax#3{%
    \def\lst@tofind{#2}\lst@lAddTo\lst@eaten{#3}%
    \ifx#1#3%
        \ifx\lst@tofind\@empty
            \let\lst@next\@tempa
        \else
            \let\lst@next\lst@IfNextChars@
        \fi
        \expandafter\lst@next
    \else
        \expandafter\@tempb
    \fi}
\def\lst@IfNextCharActive#1#2#3{%
    \begingroup \lccode`\~=`#3\lowercase{\endgroup
    \ifx~}#3%
        \def\lst@next{#1}%
    \else
        \def\lst@next{#2}%
    \fi \lst@next #3}
\def\lst@for#1\do#2{%
    \def\lst@forbody##1{#2}%
    \@for\lst@forvar:=#1\do
    {\expandafter\lst@forbody\expandafter{\lst@forvar}}}
\def\lst@MakeActive#1{%
    \let\lst@temp\@empty \lst@MakeActive@#1%
    \relax\relax\relax\relax\relax\relax\relax\relax\relax}
\begingroup
\catcode`\^^@=\active \catcode`\^^A=\active \catcode`\^^B=\active
\catcode`\^^C=\active \catcode`\^^D=\active \catcode`\^^E=\active
\catcode`\^^F=\active \catcode`\^^G=\active \catcode`\^^H=\active
\gdef\lst@MakeActive@#1#2#3#4#5#6#7#8#9{\let\lst@next\relax
    \ifx#1\relax
    \else \lccode`\^^@=`#1%
    \ifx#2\relax
        \lowercase{\lst@lAddTo\lst@temp{^^@}}%
    \else \lccode`\^^A=`#2%
    \ifx#3\relax
        \lowercase{\lst@lAddTo\lst@temp{^^@^^A}}%
    \else \lccode`\^^B=`#3%
    \ifx#4\relax
        \lowercase{\lst@lAddTo\lst@temp{^^@^^A^^B}}%
    \else \lccode`\^^C=`#4%
    \ifx#5\relax
        \lowercase{\lst@lAddTo\lst@temp{^^@^^A^^B^^C}}%
    \else \lccode`\^^D=`#5%
    \ifx#6\relax
        \lowercase{\lst@lAddTo\lst@temp{^^@^^A^^B^^C^^D}}%
    \else \lccode`\^^E=`#6%
    \ifx#7\relax
        \lowercase{\lst@lAddTo\lst@temp{^^@^^A^^B^^C^^D^^E}}%
    \else \lccode`\^^F=`#7%
    \ifx#8\relax
        \lowercase{\lst@lAddTo\lst@temp{^^@^^A^^B^^C^^D^^E^^F}}%
    \else \lccode`\^^G=`#8%
    \ifx#9\relax
        \lowercase{\lst@lAddTo\lst@temp{^^@^^A^^B^^C^^D^^E^^F^^G}}%
    \else \lccode`\^^H=`#9%
        \lowercase{\lst@lAddTo\lst@temp{^^@^^A^^B^^C^^D^^E^^F^^G^^H}}%
        \let\lst@next\lst@MakeActive@
    \fi \fi \fi \fi \fi \fi \fi \fi \fi
    \lst@next}
\endgroup
\def\lst@DefActive#1#2{\lst@MakeActive{#2}\let#1\lst@temp}
\def\lst@DefOther#1#2{%
    \begingroup \def#1{#2}\escapechar\m@ne \expandafter\endgroup
    \expandafter\lst@DefOther@\meaning#1\relax#1}
\def\lst@DefOther@#1>#2\relax#3{\edef#3{\zap@space#2 \@empty}}
\def\lst@InsideConvert#1{\lst@InsideConvert@#1 \@empty}
\begingroup \lccode`\~=`\ \relax \lowercase{%
\gdef\lst@InsideConvert@#1 #2{%
    \lst@MakeActive{#1}%
    \ifx\@empty#2%
        \lst@lExtend\lst@arg{\lst@temp}%
    \else
        \lst@lExtend\lst@arg{\lst@temp~}%
        \expandafter\lst@InsideConvert@
    \fi #2}
}\endgroup
\def\lst@XConvert{\@ifnextchar\bgroup \lst@XConvertArg\lst@XConvert@}
\def\lst@XConvertArg#1{%
    {\lst@false \let\lst@arg\@empty
     \lst@XConvert#1\@nil
     \global\let\@gtempa\lst@arg}%
    \lst@lExtend\lst@arg{\expandafter{\@gtempa}}%
    \lst@XConvertNext}
\def\lst@XConvert@#1{%
    \ifx\@nil#1\else
        \begingroup\lccode`\~=`#1\lowercase{\endgroup
        \lst@lAddTo\lst@arg~}%
        \expandafter\lst@XConvertNext
    \fi}
\def\lst@XConvertNext{%
    \lst@if \expandafter\lst@XConvertX
      \else \expandafter\lst@XConvert \fi}
\def\lst@XConvertX#1{%
    \ifx\@nil#1\else
        \lst@XConvertX@#1\relax
        \expandafter\lst@XConvert
    \fi}
\def\lst@XConvertX@#1#2\relax{%
    \begingroup\lccode`\~=`#1\lowercase{\endgroup
    \lst@XCConvertX@@~}{#2}}
\def\lst@XCConvertX@@#1#2{\lst@lAddTo\lst@arg{{#1#2}}}
\def\lst@Require#1#2#3#4#5{%
    \begingroup
    \aftergroup\lst@true
    \ifx\@empty#3\@empty\else
        \def\lst@prefix{#2}\let\lst@require\@empty
        \edef\lst@temp{\expandafter\zap@space#3 \@empty}%
        \lst@for\lst@temp\do{%
          \ifx\@empty##1\@empty\else \lstKV@OptArg[]{##1}{%
            #4[####1]{####2}%
            \@ifundefined{\@lst\lst@prefix @\lst@malias $\lst@oalias}%
            {\edef\lst@require{\lst@require,\lst@malias $\lst@oalias}}%
            {}}%
          \fi}%
        \global\let\lst@loadaspects\@empty
        \lst@InputCatcodes
        \ifx\lst@require\@empty\else
            \lst@for{#5}\do{%
                \ifx\lst@require\@empty\else
                    \InputIfFileExists{##1}{}{}%
                \fi}%
        \fi
        \ifx\lst@require\@empty\else
            \PackageError{Listings}{Couldn't load requested #1}%
            {The following #1s weren't loadable:^^J\@spaces
             \lst@require^^JThis may cause errors in the sequel.}%
            \aftergroup\lst@false
        \fi
        \ifx\lst@loadaspects\@empty\else
            \lst@RequireAspects\lst@loadaspects
        \fi
    \fi
    \endgroup}
\def\lst@IfRequired[#1]#2{%
    \lst@NormedDef\lst@temp{[#1]#2}%
    \expandafter\lst@IfRequired@\lst@temp\relax}
\def\lst@IfRequired@[#1]#2\relax#3{%
    \lst@IfOneOf #2$#1\relax\lst@require
        {\lst@DeleteKeysIn@\lst@require#2$#1,\relax,%
         \global\expandafter\let
             \csname\@lst\lst@prefix @#2$#1\endcsname\@empty
         #3}}
\let\lst@require\@empty
\def\lst@NoAlias[#1]#2{%
    \lst@NormedDef\lst@oalias{#1}\lst@NormedDef\lst@malias{#2}}
\gdef\lst@LAS#1#2#3#4#5#6#7{%
    \lst@Require{#1}{#2}{#3}#4#5%
    #4#3%
    \@ifundefined{lst#2@\lst@malias$\lst@oalias}%
        {\PackageError{Listings}%
         {#1 \ifx\@empty\lst@oalias\else \lst@oalias\space of \fi
          \lst@malias\space undefined}%
         {The #1 is not loadable. \@ehc}}%
        {#6\csname\@lst#2@\lst@malias $\lst@oalias\endcsname #7}}
\def\lst@RequireAspects#1{%
    \lst@Require{aspect}{asp}{#1}\lst@NoAlias\lstaspectfiles}
\let\lstloadaspects\lst@RequireAspects
\@ifundefined{lstaspectfiles}
    {\newcommand\lstaspectfiles{lstmisc0.sty,lstmisc.sty}}{}
\gdef\lst@DefDriver#1#2#3#4{%
    \@ifnextchar[{\lst@DefDriver@{#1}{#2}#3#4}%
                 {\lst@DefDriver@{#1}{#2}#3#4[]}}
\gdef\lst@DefDriver@#1#2#3#4[#5]#6{%
    \def\lst@name{#1}\let\lst@if#4%
    \lst@NormedDef\lst@driver{\@lst#2@#6$#5}%
    \lst@IfRequired[#5]{#6}{\begingroup \lst@true}%
                           {\begingroup}%
    \lst@setcatcodes
    \@ifnextchar[{\lst@XDefDriver{#1}#3}{\lst@DefDriver@@#3}}
\gdef\lst@DefDriver@@#1#2{%
    \lst@if
        \global\@namedef{\lst@driver}{#1{#2}}%
    \fi
    \endgroup
    \@ifnextchar[\lst@XXDefDriver\@empty}
\gdef\lst@XXDefDriver[#1]{%
    \ifx\@empty#1\@empty\else
        \lst@if
            \lstloadaspects{#1}%
        \else
            \@ifundefined{\lst@driver}{}%
            {\xdef\lst@loadaspects{\lst@loadaspects,#1}}%
        \fi
    \fi}
\gdef\lst@XDefDriver#1#2[#3]#4#5{\lst@DefDriver@@#2{also#1=[#3]#4,#5}}
\let\lst@UserCommand\gdef
\newcommand*\lst@BeginAspect[2][]{%
    \def\lst@curraspect{#2}%
    \ifx \lst@curraspect\@empty
        \expandafter\lst@GobbleAspect
    \else
        \let\lst@next\@empty
        \lst@IfRequired[]{#2}%
            {\lst@RequireAspects{#1}%
             \lst@if\else \let\lst@next\lst@GobbleAspect \fi}%
            {\let\lst@next\lst@GobbleAspect}%
        \expandafter\lst@next
    \fi}
\def\lst@EndAspect{%
    \csname\@lst patch@\lst@curraspect\endcsname
    \let\lst@curraspect\@empty}
\long\def\lst@GobbleAspect#1\lst@EndAspect{\let\lst@curraspect\@empty}
\def\lst@Key#1#2{%
    \@ifnextchar[{\lstKV@def{#1}{#2}}%
                 {\def\lst@temp{\lst@Key@{#1}{#2}}
                  \afterassignment\lst@temp
                  \global\@namedef{KV@\@lst @#1}####1}}
\def\lstKV@def#1#2[#3]{%
    \global\@namedef{KV@\@lst @#1@default\expandafter}\expandafter
        {\csname KV@\@lst @#1\endcsname{#3}}%
    \def\lst@temp{\lst@Key@{#1}{#2}}\afterassignment\lst@temp
    \global\@namedef{KV@\@lst @#1}##1}
\def\lst@Key@#1#2{%
    \ifx\relax#2\@empty\else
        \begingroup \globaldefs\@ne
        \csname KV@\@lst @#1\endcsname{#2}%
        \endgroup
    \fi}
\def\lst@UseHook#1{\csname\@lst hk@#1\endcsname}
\def\lst@AddToHook{\lst@ATH@\iffalse\lst@AddTo}
\def\lst@AddToHookExe{\lst@ATH@\iftrue\lst@AddTo}
\def\lst@AddToHookAtTop{\lst@ATH@\iffalse\lst@AddToAtTop}
\long\def\lst@ATH@#1#2#3#4{%
    \@ifundefined{\@lst hk@#3}{%
        \expandafter\gdef\csname\@lst hk@#3\endcsname{}}{}%
    \expandafter#2\csname\@lst hk@#3\endcsname{#4}%
    \def\lst@temp{#4}%
    #1% \iftrue|false
        \begingroup \globaldefs\@ne \lst@temp \endgroup
    \fi}
\long\def\lst@AddTo#1#2{%
    \expandafter\gdef\expandafter#1\expandafter{#1#2}}
\def\lst@AddToAtTop#1#2{\def\lst@temp{#2}%
    \expandafter\expandafter\expandafter\gdef
    \expandafter\expandafter\expandafter#1%
    \expandafter\expandafter\expandafter{\expandafter\lst@temp#1}}
\def\lst@lAddTo#1#2{\expandafter\def\expandafter#1\expandafter{#1#2}}
\def\lst@Extend#1#2{%
    \expandafter\lst@AddTo\expandafter#1\expandafter{#2}}
\def\lst@lExtend#1#2{%
    \expandafter\lst@lAddTo\expandafter#1\expandafter{#2}}
\RequirePackage{keyval}[1997/11/10]
\def\lstKV@TwoArg#1#2{\gdef\@gtempa##1##2{#2}\@gtempa#1{}{}}
\def\lstKV@ThreeArg#1#2{\gdef\@gtempa##1##2##3{#2}\@gtempa#1{}{}{}}
\def\lstKV@FourArg#1#2{\gdef\@gtempa##1##2##3##4{#2}\@gtempa#1{}{}{}{}}
\def\lstKV@OptArg[#1]#2#3{%
    \gdef\@gtempa[##1]##2{#3}\lstKV@OptArg@{#1}#2\@}
\def\lstKV@OptArg@#1{\@ifnextchar[\lstKV@OptArg@@{\lstKV@OptArg@@[#1]}}
\def\lstKV@OptArg@@[#1]#2\@{\@gtempa[#1]{#2}}
\def\lstKV@XOptArg[#1]#2#3{%
    \global\let\@gtempa#3\lstKV@OptArg@{#1}#2\@}
\def\lstKV@CSTwoArg#1#2{%
    \gdef\@gtempa##1,##2,##3\relax{#2}%
    \@gtempa#1,,\relax}
\def\lstKV@SetIf#1{\lstKV@SetIf@#1\relax}
\def\lstKV@SetIf@#1#2\relax#3{\lowercase{%
    \expandafter\let\expandafter#3%
        \csname if\ifx #1t}true\else false\fi\endcsname}
\def\lstKV@SwitchCases#1#2#3{%
    \def\lst@temp##1\\#1&##2\\##3##4\@nil{%
        \ifx\@empty##3%
            #3%
        \else
            ##2%
        \fi
    }%
    \lst@temp\\#2\\#1&\\\@empty\@nil}
\lst@UserCommand\lstset{\begingroup \lst@setcatcodes \lstset@}
\def\lstset@#1{\endgroup \ifx\@empty#1\@empty\else\setkeys{lst}{#1}\fi}
\def\lst@setcatcodes{\makeatletter \catcode`\"=12\relax}
\def\lst@NewMode#1{%
    \ifx\@undefined#1%
        \lst@mode\lst@newmode\relax \advance\lst@mode\@ne
        \xdef\lst@newmode{\the\lst@mode}%
        \global\chardef#1=\lst@mode
        \lst@mode\lst@nomode
    \fi}
\newcount\lst@mode
\def\lst@newmode{\m@ne}% init
\lst@NewMode\lst@nomode % init (of \lst@mode :-)
\def\lst@UseDynamicMode{%
    \@tempcnta\lst@dynamicmode\relax \advance\@tempcnta\@ne
    \edef\lst@dynamicmode{\the\@tempcnta}%
    \expandafter\lst@Swap\expandafter{\expandafter{\lst@dynamicmode}}}
\lst@AddToHook{InitVars}{\let\lst@dynamicmode\lst@newmode}
\def\lst@EnterMode#1#2{%
    \bgroup \lst@mode=#1\relax #2%
    \lst@FontAdjust
    \lst@lAddTo\lst@entermodes{\lst@EnterMode{#1}{#2}}}
\lst@AddToHook{InitVars}{\let\lst@entermodes\@empty}
\let\lst@entermodes\@empty % init
\def\lst@LeaveMode{%
    \ifnum\lst@mode=\lst@nomode\else
        \egroup \expandafter\lsthk@EndGroup
    \fi}
\lst@AddToHook{EndGroup}{}% init
\def\lst@InterruptModes{%
    \lst@Extend\lst@modestack{\expandafter{\lst@entermodes}}%
    \lst@LeaveAllModes}
\lst@AddToHook{InitVars}{\global\let\lst@modestack\@empty}
\def\lst@ReenterModes{%
    \ifx\lst@modestack\@empty\else
        \lst@LeaveAllModes
        \global\let\@gtempa\lst@modestack
        \global\let\lst@modestack\@empty
        \expandafter\lst@ReenterModes@\@gtempa\relax
    \fi}
\def\lst@ReenterModes@#1#2{%
    \ifx\relax#2\@empty
        \gdef\@gtempa##1{#1}%
        \expandafter\@gtempa
    \else
        \lst@AddTo\lst@modestack{{#1}}%
        \expandafter\lst@ReenterModes@
    \fi
    {#2}}
\def\lst@LeaveAllModes{%
    \ifnum\lst@mode=\lst@nomode
        \expandafter\lsthk@EndGroup
    \else
        \expandafter\egroup\expandafter\lst@LeaveAllModes
    \fi}
\lst@AddToHook{ExitVars}{\lst@LeaveAllModes}
\lst@NewMode\lst@Pmode
\lst@NewMode\lst@GPmode
\def\lst@modetrue{\let\lst@ifmode\iftrue \lsthk@ModeTrue}
\let\lst@ifmode\iffalse % init
\lst@AddToHook{ModeTrue}{}% init
\def\lst@Lmodetrue{\let\lst@ifLmode\iftrue}
\let\lst@ifLmode\iffalse % init
\lst@AddToHook{EOL}{\@whilesw \lst@ifLmode\fi \lst@LeaveMode}
\def\lst@NormedDef#1#2{\lowercase{\edef#1{\zap@space#2 \@empty}}}
\def\lst@NormedNameDef#1#2{%
    \lowercase{\edef\lst@temp{\zap@space#1 \@empty}%
    \expandafter\xdef\csname\lst@temp\endcsname{\zap@space#2 \@empty}}}
\def\lst@GetFreeMacro#1{%
    \@tempcnta\z@ \def\lst@freemacro{#1\the\@tempcnta}%
    \lst@GFM@}
\def\lst@GFM@{%
    \expandafter\ifx \csname\lst@freemacro\endcsname \relax
        \edef\lst@freemacro{\csname\lst@freemacro\endcsname}%
    \else
        \advance\@tempcnta\@ne
        \expandafter\lst@GFM@
    \fi}
\newbox\lst@gtempboxa
\newtoks\lst@token \newcount\lst@length
\def\lst@ResetToken{\lst@token{}\lst@length\z@}
\lst@AddToHook{InitVarsBOL}{\lst@ResetToken \let\lst@lastother\@empty}
\lst@AddToHook{EndGroup}{\lst@ResetToken \let\lst@lastother\@empty}
\def\lst@lettertrue{\let\lst@ifletter\iftrue}
\def\lst@letterfalse{\let\lst@ifletter\iffalse}
\lst@AddToHook{InitVars}{\lst@letterfalse}
\def\lst@Append#1{\advance\lst@length\@ne
                  \lst@token=\expandafter{\the\lst@token#1}}
\def\lst@AppendOther{%
    \lst@ifletter \lst@Output\lst@letterfalse \fi
    \futurelet\lst@lastother\lst@Append}
\def\lst@AppendLetter{%
    \lst@ifletter\else \lst@OutputOther\lst@lettertrue \fi
    \lst@Append}
\def\lst@SaveToken{%
    \global\let\lst@gthestyle\lst@thestyle
    \global\let\lst@glastother\lst@lastother
    \xdef\lst@RestoreToken{\noexpand\lst@token{\the\lst@token}%
                           \noexpand\lst@length\the\lst@length\relax
                           \noexpand\let\noexpand\lst@thestyle
                                        \noexpand\lst@gthestyle
                           \noexpand\let\noexpand\lst@lastother
                                        \noexpand\lst@glastother}}
\def\lst@IfLastOtherOneOf#1{\lst@IfLastOtherOneOf@ #1\relax}
\def\lst@IfLastOtherOneOf@#1{%
    \ifx #1\relax
        \expandafter\@secondoftwo
    \else
        \ifx\lst@lastother#1%
            \lst@IfLastOtherOneOf@t
        \else
            \expandafter\expandafter\expandafter\lst@IfLastOtherOneOf@
        \fi
    \fi}
\def\lst@IfLastOtherOneOf@t#1\fi\fi#2\relax{\fi\fi\@firstoftwo}
\newdimen\lst@currlwidth % \global
\newcount\lst@column \newcount\lst@pos % \global
\lst@AddToHook{InitVarsBOL}
    {\global\lst@currlwidth\z@ \global\lst@pos\z@ \global\lst@column\z@}
\def\lst@CalcColumn{%
            \@tempcnta\lst@column
    \advance\@tempcnta\lst@length
    \advance\@tempcnta-\lst@pos}
\newdimen\lst@lostspace % \global
\lst@AddToHook{InitVarsBOL}{\global\lst@lostspace\z@}
\def\lst@UseLostSpace{\ifdim\lst@lostspace>\z@ \lst@InsertLostSpace \fi}
\def\lst@InsertLostSpace{%
    \lst@Kern\lst@lostspace \global\lst@lostspace\z@}
\def\lst@InsertHalfLostSpace{%
    \global\lst@lostspace.5\lst@lostspace \lst@Kern\lst@lostspace}
\newdimen\lst@width
\lst@Key{basewidth}{0.6em,0.45em}{\lstKV@CSTwoArg{#1}%
    {\def\lst@widthfixed{##1}\def\lst@widthflexible{##2}%
     \ifx\lst@widthflexible\@empty
         \let\lst@widthflexible\lst@widthfixed
     \fi
     \def\lst@temp{\PackageError{Listings}%
                                {Negative value(s) treated as zero}%
                                \@ehc}%
     \let\lst@error\@empty
     \ifdim \lst@widthfixed<\z@
         \let\lst@error\lst@temp \let\lst@widthfixed\z@
     \fi
     \ifdim \lst@widthflexible<\z@
         \let\lst@error\lst@temp \let\lst@widthflexible\z@
     \fi
     \lst@error}}
\lst@AddToHook{FontAdjust}
    {\lst@width=\lst@ifflexible\lst@widthflexible
                          \else\lst@widthfixed\fi \relax}
\lst@Key{fontadjust}{false}[t]{\lstKV@SetIf{#1}\lst@iffontadjust}
\def\lst@FontAdjust{\lst@iffontadjust \lsthk@FontAdjust \fi}
\lst@AddToHook{InitVars}{\lsthk@FontAdjust}
\def\lst@OutputBox#1{\lst@alloverstyle{\box#1}}
\def\lst@alloverstyle#1{#1}% init
\def\lst@Kern#1{%
    \setbox\z@\hbox{{\lst@currstyle{\kern#1}}}%
    \global\advance\lst@currlwidth \wd\z@
    \lst@OutputBox\z@}
\def\lst@CalcLostSpaceAndOutput{%
    \global\advance\lst@lostspace \lst@length\lst@width
    \global\advance\lst@lostspace-\wd\@tempboxa
    \global\advance\lst@currlwidth \wd\@tempboxa
    \global\advance\lst@pos -\lst@length
    \setbox\@tempboxa\hbox{\let\lst@OutputBox\box
        \ifdim\lst@lostspace>\z@ \lst@leftinsert \fi
        \box\@tempboxa
        \ifdim\lst@lostspace>\z@ \lst@rightinsert \fi}%
    \lst@OutputBox\@tempboxa \lsthk@PostOutput}
\lst@AddToHook{PostOutput}{}% init
\def\lst@OutputToken{%
    \lst@TrackNewLines \lst@OutputLostSpace
    \lst@CheckMerge
    {\lst@thestyle{\lst@FontAdjust
     \setbox\@tempboxa\lst@hbox
        {\lsthk@OutputBox
         \lst@lefthss
         \expandafter\lst@FillOutputBox\the\lst@token\@empty
         \lst@righthss}%
     \lst@CalcLostSpaceAndOutput}}%
    \lst@ResetToken}
\lst@AddToHook{OutputBox}{}% init
\def\lst@Delay#1{%
    \lst@CheckDelay
    #1%
    \lst@GetOutputMacro\lst@delayedoutput
    \edef\lst@delayed{\the\lst@token}%
    \edef\lst@delayedlength{\the\lst@length}%
    \lst@ResetToken}
\def\lst@Merge#1{%
    \lst@CheckMerge
    #1%
    \edef\lst@merged{\the\lst@token}%
    \edef\lst@mergedlength{\the\lst@length}%
    \lst@ResetToken}
\def\lst@MergeToken#1#2{%
    \advance\lst@length#2%
    \lst@lExtend#1{\the\lst@token}%
    \expandafter\lst@token\expandafter{#1}%
    \let#1\@empty}
\def\lst@CheckDelay{%
    \ifx\lst@delayed\@empty\else
        \lst@GetOutputMacro\@gtempa
        \ifx\lst@delayedoutput\@gtempa
            \lst@MergeToken\lst@delayed\lst@delayedlength
        \else
            {\lst@ResetToken
             \lst@MergeToken\lst@delayed\lst@delayedlength
             \lst@delayedoutput}%
            \let\lst@delayed\@empty
        \fi
    \fi}
\def\lst@CheckMerge{%
    \ifx\lst@merged\@empty\else
        \lst@MergeToken\lst@merged\lst@mergedlength
    \fi}
\let\lst@delayed\@empty % init
\let\lst@merged\@empty % init
\def\lst@column@fixed{%
    \lst@flexiblefalse
    \lst@width\lst@widthfixed\relax
    \let\lst@OutputLostSpace\lst@UseLostSpace
    \let\lst@FillOutputBox\lst@FillFixed
    \let\lst@hss\hss
    \def\lst@hbox{\hbox to\lst@length\lst@width}}
\def\lst@FillFixed#1{#1\lst@FillFixed@}
\def\lst@FillFixed@#1{%
    \ifx\@empty#1\else \lst@hss#1\expandafter\lst@FillFixed@ \fi}
\def\lst@column@flexible{%
    \lst@flexibletrue
    \lst@width\lst@widthflexible\relax
    \let\lst@OutputLostSpace\lst@UseLostSpace
    \let\lst@FillOutputBox\@empty
    \let\lst@hss\@empty
    \let\lst@hbox\hbox}
\def\lst@column@fullflexible{%
    \lst@column@flexible
    \def\lst@OutputLostSpace{\lst@ifnewline \lst@UseLostSpace\fi}%
    \let\lst@leftinsert\@empty
    \let\lst@rightinsert\@empty}
\def\lst@outputpos#1#2\relax{%
    \def\lst@lefthss{\lst@hss}\let\lst@righthss\lst@lefthss
    \let\lst@rightinsert\lst@InsertLostSpace
    \ifx #1c%
        \let\lst@leftinsert\lst@InsertHalfLostSpace
    \else\ifx #1r%
        \let\lst@righthss\@empty
        \let\lst@leftinsert\lst@InsertLostSpace
        \let\lst@rightinsert\@empty
    \else
        \let\lst@lefthss\@empty
        \let\lst@leftinsert\@empty
        \ifx #1l\else \PackageWarning{Listings}%
            {Unknown positioning for output boxes}%
        \fi
    \fi\fi}
\def\lst@flexibletrue{\let\lst@ifflexible\iftrue}
\def\lst@flexiblefalse{\let\lst@ifflexible\iffalse}
\lst@Key{columns}{[c]fixed}{\lstKV@OptArg[]{#1}{%
    \ifx\@empty##1\@empty\else \lst@outputpos##1\relax\relax \fi
    \expandafter\let\expandafter\lst@arg
                                \csname\@lst @column@##2\endcsname
    \lst@arg
    \ifx\lst@arg\relax
        \PackageWarning{Listings}{Unknown column format `##2'}%
    \else
        \lst@ifflexible
            \let\lst@columnsflexible\lst@arg
        \else
            \let\lst@columnsfixed\lst@arg
        \fi
    \fi}}
\let\lst@columnsfixed\lst@column@fixed % init
\let\lst@columnsflexible\lst@column@flexible % init
\lst@Key{flexiblecolumns}\relax[t]{%
    \lstKV@SetIf{#1}\lst@ifflexible
    \lst@ifflexible \lst@columnsflexible
              \else \lst@columnsfixed \fi}
\newcount\lst@newlines
\lst@AddToHook{InitVars}{\global\lst@newlines\z@}
\lst@AddToHook{InitVarsBOL}{\global\advance\lst@newlines\@ne}
\def\lst@NewLine{%
    \ifx\lst@OutputBox\@gobble\else
        \par\noindent \hbox{}%
    \fi
    \global\advance\lst@newlines\m@ne
    \lst@newlinetrue}
\def\lst@newlinetrue{\global\let\lst@ifnewline\iftrue}
\lst@AddToHookExe{PostOutput}{\global\let\lst@ifnewline\iffalse}% init
\def\lst@TrackNewLines{%
    \ifnum\lst@newlines>\z@
        \lsthk@OnNewLine
        \lst@DoNewLines
    \fi}
\lst@AddToHook{OnNewLine}{}% init
\lst@Key{emptylines}\maxdimen{%
    \@ifstar{\lst@true\@tempcnta\@gobble#1\relax\lst@GobbleNil}%
            {\lst@false\@tempcnta#1\relax\lst@GobbleNil}#1\@nil
    \advance\@tempcnta\@ne
    \edef\lst@maxempty{\the\@tempcnta\relax}%
    \let\lst@ifpreservenumber\lst@if}
\def\lst@DoNewLines{
    \@whilenum\lst@newlines>\lst@maxempty \do
        {\lst@ifpreservenumber
            \lsthk@OnEmptyLine
            \global\advance\c@lstnumber\lst@advancelstnum
         \fi
         \global\advance\lst@newlines\m@ne}%
    \@whilenum \lst@newlines>\@ne \do
        {\lsthk@OnEmptyLine \lst@NewLine}%
    \ifnum\lst@newlines>\z@ \lst@NewLine \fi}
\lst@AddToHook{OnEmptyLine}{}% init
\lst@Key{identifierstyle}{}{\def\lst@identifierstyle{#1}}
\lst@AddToHook{EmptyStyle}{\let\lst@identifierstyle\@empty}
\def\lst@GotoTabStop{%
    \ifnum\lst@newlines=\z@
        \setbox\@tempboxa\hbox{\lst@outputspace}%
        \setbox\@tempboxa\hbox to\wd\@tempboxa{{\lst@currstyle{\hss}}}%
        \lst@CalcLostSpaceAndOutput
    \else
        \global\advance\lst@lostspace \lst@length\lst@width
        \global\advance\lst@column\lst@length \lst@length\z@
    \fi}
\def\lst@OutputOther{%
    \lst@CheckDelay
    \ifnum\lst@length=\z@\else
        \let\lst@thestyle\lst@currstyle
        \lsthk@OutputOther
        \lst@OutputToken
    \fi}
\lst@AddToHook{OutputOther}{}% init
\let\lst@currstyle\relax % init
\def\lst@Output{%
    \lst@CheckDelay
    \ifnum\lst@length=\z@\else
        \ifx\lst@currstyle\relax
            \let\lst@thestyle\lst@identifierstyle
        \else
            \let\lst@thestyle\lst@currstyle
        \fi
        \lsthk@Output
        \lst@OutputToken
    \fi
    \let\lst@lastother\relax}
\lst@AddToHook{Output}{}% init
\def\lst@GetOutputMacro#1{%
    \lst@ifletter \global\let#1\lst@Output
            \else \global\let#1\lst@OutputOther\fi}
\def\lst@PrintToken{%
    \lst@ifletter \lst@Output \lst@letterfalse
            \else \lst@OutputOther \let\lst@lastother\@empty \fi}
\def\lst@XPrintToken{%
    \lst@PrintToken \lst@CheckMerge
    \ifnum\lst@length=\z@\else \lst@PrintToken \fi}
\def\lst@BeginDropOutput#1{%
    \xdef\lst@BDOnewlines{\the\lst@newlines}%
    \global\let\lst@BDOifnewline\lst@ifnewline
    \lst@EnterMode{#1}%
        {\lst@modetrue
         \let\lst@OutputBox\@gobble
         \aftergroup\lst@BDORestore}}
\def\lst@BDORestore{%
    \global\lst@newlines\lst@BDOnewlines
    \global\let\lst@ifnewline\lst@BDOifnewline}
\let\lst@EndDropOutput\lst@LeaveMode
\def\lst@ProcessLetter{\lst@whitespacefalse \lst@AppendLetter}
\def\lst@ProcessOther{\lst@whitespacefalse \lst@AppendOther}
\def\lst@ProcessDigit{%
    \lst@whitespacefalse
    \lst@ifletter \expandafter\lst@AppendLetter
            \else \expandafter\lst@AppendOther\fi}
\def\lst@whitespacetrue{\global\let\lst@ifwhitespace\iftrue}
\def\lst@whitespacefalse{\global\let\lst@ifwhitespace\iffalse}
\lst@AddToHook{InitVarsBOL}{\lst@whitespacetrue}
\lst@Key{tabsize}{8}
    {\ifnum#1>\z@ \def\lst@tabsize{#1}\else
         \PackageError{Listings}{Strict positive integer expected}%
         {You can't use `#1' as tabsize. \@ehc}%
     \fi}
\lst@Key{showtabs}f[t]{\lstKV@SetIf{#1}\lst@ifshowtabs}
\lst@Key{tab}{\kern.06em\hbox{\vrule\@height.3ex}%
              \hrulefill\hbox{\vrule\@height.3ex}}
    {\def\lst@tab{#1}}
\def\lst@ProcessTabulator{%
    \lst@XPrintToken \lst@whitespacetrue
    \global\advance\lst@column -\lst@pos
    \@whilenum \lst@pos<\@ne \do
        {\global\advance\lst@pos\lst@tabsize}%
    \lst@length\lst@pos
    \lst@PreGotoTabStop}
\def\lst@PreGotoTabStop{%
    \lst@ifshowtabs
        \lst@TrackNewLines
        \setbox\@tempboxa\hbox to\lst@length\lst@width
            {{\lst@currstyle{\hss\lst@tab}}}%
        \lst@CalcLostSpaceAndOutput
    \else
        \lst@ifkeepspaces
            \@tempcnta\lst@length \lst@length\z@
            \@whilenum \@tempcnta>\z@ \do
                {\lst@AppendOther\lst@outputspace
                 \advance\@tempcnta\m@ne}%
            \lst@OutputOther
        \else
            \lst@GotoTabStop
        \fi
    \fi
    \lst@length\z@ \global\lst@pos\z@}
\def\lst@outputspace{\ }
\def\lst@visiblespace{\lst@ttfamily{\char32}\textvisiblespace}
\lst@Key{showspaces}{false}[t]{\lstKV@SetIf{#1}\lst@ifshowspaces}
\lst@Key{keepspaces}{false}[t]{\lstKV@SetIf{#1}\lst@ifkeepspaces}
\lst@AddToHook{Init}
    {\lst@ifshowspaces
         \let\lst@outputspace\lst@visiblespace
         \lst@keepspacestrue
     \fi}
\def\lst@keepspacestrue{\let\lst@ifkeepspaces\iftrue}
\def\lst@ProcessSpace{%
    \lst@ifkeepspaces
        \lst@AppendOther\lst@outputspace
    \else \ifnum\lst@newlines=\z@
        \lst@AppendSpecialSpace
    \else \ifnum\lst@length=\z@
            \global\advance\lst@lostspace\lst@width
            \global\advance\lst@pos\m@ne
        \else
            \lst@AppendSpecialSpace
        \fi
    \fi \fi
    \lst@whitespacetrue}
\def\lst@AppendSpecialSpace{%
    \lst@ifwhitespace
        \lst@PrintToken
        \global\advance\lst@lostspace\lst@width
        \global\advance\lst@pos\m@ne
    \else
        \lst@AppendOther\lst@outputspace
    \fi}
\lst@Key{formfeed}{\bigbreak}{\def\lst@formfeed{#1}}
\def\lst@ProcessFormFeed{%
    \lst@XPrintToken
    \ifnum\lst@newlines=\z@
        \lst@EOLUpdate \lsthk@InitVarsBOL
    \fi
    \lst@formfeed
    \lst@whitespacetrue}
\def\lst@Def#1{\lccode`\~=#1\lowercase{\def~}}
\def\lst@Let#1{\lccode`\~=#1\lowercase{\let~}}
\lst@AddToAtTop{\try@load@fontshape}{\def\space{ }}
\def\lst@SelectStdCharTable{%
    \lst@Def{9}{\lst@ProcessTabulator}%
    \lst@Def{12}{\lst@ProcessFormFeed}%
    \lst@Def{32}{\lst@ProcessSpace}}
\def\lst@CCPut#1#2{%
    \ifnum#2=\z@
        \expandafter\@gobbletwo
    \else
        \lccode`\~=#2\lccode`\/=#2\lowercase{\lst@CCPut@~{#1/}}%
    \fi
    \lst@CCPut#1}
\def\lst@CCPut@#1#2{\lst@lAddTo\lst@SelectStdCharTable{\def#1{#2}}}
\lst@CCPut \lst@ProcessOther
    {"21}{"22}{"28}{"29}{"2B}{"2C}{"2E}{"2F}
    {"3A}{"3B}{"3D}{"3F}{"5B}{"5D}
    \z@
\lst@CCPut \lst@ProcessDigit
    {"30}{"31}{"32}{"33}{"34}{"35}{"36}{"37}{"38}{"39}
    \z@
\lst@CCPut \lst@ProcessLetter
    {"40}{"41}{"42}{"43}{"44}{"45}{"46}{"47}
    {"48}{"49}{"4A}{"4B}{"4C}{"4D}{"4E}{"4F}
    {"50}{"51}{"52}{"53}{"54}{"55}{"56}{"57}
    {"58}{"59}{"5A}
         {"61}{"62}{"63}{"64}{"65}{"66}{"67}
    {"68}{"69}{"6A}{"6B}{"6C}{"6D}{"6E}{"6F}
    {"70}{"71}{"72}{"73}{"74}{"75}{"76}{"77}
    {"78}{"79}{"7A}
    \z@
\def\lst@CCPutMacro#1#2#3{%
    \ifnum#2=\z@ \else
        \begingroup\lccode`\~=#2\relax \lccode`\/=#2\relax
        \lowercase{\endgroup\expandafter\lst@CCPutMacro@
            \csname\@lst @um/\expandafter\endcsname
            \csname\@lst @um/@\endcsname /~}#1{#3}%
        \expandafter\lst@CCPutMacro
    \fi}
\def\lst@CCPutMacro@#1#2#3#4#5#6{%
    \lst@lAddTo\lst@SelectStdCharTable{\def#4{#5#1}}%
    \def#1{\lst@UM#3}%
    \def#2{#6}}
\def\lst@UM#1{\csname\@lst @um#1@\endcsname}
\lst@CCPutMacro
    \lst@ProcessOther {"23}\#
    \lst@ProcessLetter{"24}\textdollar
    \lst@ProcessOther {"25}\%
    \lst@ProcessOther {"26}\&
    \lst@ProcessOther {"27}{\lst@ifupquote \textquotesingle
                                     \else \char39\relax \fi}
    \lst@ProcessOther {"2A}{\lst@ttfamily*\textasteriskcentered}
    \lst@ProcessOther {"2D}{\lst@ttfamily{-{}}{$-$}}
    \lst@ProcessOther {"3C}{\lst@ttfamily<\textless}
    \lst@ProcessOther {"3E}{\lst@ttfamily>\textgreater}
    \lst@ProcessOther {"5C}{\lst@ttfamily{\char92}\textbackslash}
    \lst@ProcessOther {"5E}\textasciicircum
    \lst@ProcessLetter{"5F}{\lst@ttfamily{\char95}\textunderscore}
    \lst@ProcessOther {"60}{\lst@ifupquote \textasciigrave
                                     \else \char96\relax \fi}
    \lst@ProcessOther {"7B}{\lst@ttfamily{\char123}\textbraceleft}
    \lst@ProcessOther {"7C}{\lst@ttfamily|\textbar}
    \lst@ProcessOther {"7D}{\lst@ttfamily{\char125}\textbraceright}
    \lst@ProcessOther {"7E}\textasciitilde
    \lst@ProcessOther {"7F}-
    \@empty\z@\@empty
\def\lst@ttfamily#1#2{\ifx\f@family\ttdefault#1\relax\else#2\fi}
\lst@AddToHook{Init}{\edef\ttdefault{\ttdefault}}
\lst@Key{upquote}{false}[t]{\lstKV@SetIf{#1}\lst@ifupquote
    \lst@ifupquote
       \@ifundefined{textasciigrave}%
          {\let\KV@lst@upquote\@gobble
           \lstKV@SetIf f\lst@ifupquote \@gobble\fi
           \PackageError{Listings}{Option `upquote' requires `textcomp'
            package.\MessageBreak The option has been disabled}%
          {Add \string\usepackage{textcomp} to your preamble.}}%
          {}%
    \fi}
\AtBeginDocument{%
  \@ifpackageloaded{upquote}{\RequirePackage{textcomp}%
                             \lstset{upquote}}{}%
  \@ifpackageloaded{upquote2}{\lstset{upquote}}{}}
\def\lst@activecharstrue{\let\lst@ifactivechars\iftrue}
\def\lst@activecharsfalse{\let\lst@ifactivechars\iffalse}
\lst@activecharstrue
\def\lst@SelectCharTable{%
    \lst@SelectStdCharTable
    \lst@ifactivechars
        \catcode9\active \catcode12\active \catcode13\active
        \@tempcnta=32\relax
        \@whilenum\@tempcnta<128\do
            {\catcode\@tempcnta\active\advance\@tempcnta\@ne}%
    \fi
    \lst@ifec \lst@DefEC \fi
    \let\do\lst@do@noligs \verbatim@nolig@list
    \lsthk@SelectCharTable
    \lst@DeveloperSCT
    \ifx\lst@Backslash\relax\else
        \lst@LetSaveDef{"5C}\lsts@backslash\lst@Backslash
    \fi}
\lst@Key{SelectCharTable}{}{\def\lst@DeveloperSCT{#1}}
\lst@Key{MoreSelectCharTable}\relax{\lst@lAddTo\lst@DeveloperSCT{#1}}
\lst@AddToHook{SetLanguage}{\let\lst@DeveloperSCT\@empty}
\def\lst@do@noligs#1{%
    \begingroup \lccode`\~=`#1\lowercase{\endgroup
    \lst@do@noligs@~}}
\def\lst@do@noligs@#1{%
    \expandafter\expandafter\expandafter\def
    \expandafter\expandafter\expandafter#1%
    \expandafter\expandafter\expandafter{\expandafter\lst@NoLig#1}}
\def\lst@NoLig{\advance\lst@length\m@ne \lst@Append\lst@nolig}
\def\lst@nolig{\lst@UM\@empty}%
\@namedef{\@lst @um@}{\leavevmode\kern\z@}
\def\lst@SaveOutputDef#1#2{%
    \begingroup \lccode`\~=#1\relax \lowercase{\endgroup
    \def\lst@temp##1\def~##2##3\relax}{%
        \global\expandafter\let\expandafter#2\@gobble##2\relax}%
    \expandafter\lst@temp\lst@SelectStdCharTable\relax}
\lst@SaveOutputDef{"5C}\lstum@backslash
\lst@Key{extendedchars}{false}[t]{\lstKV@SetIf{#1}\lst@ifec}
\def\lst@DefEC{%
    \lst@CCECUse \lst@ProcessLetter
      ^^80^^81^^82^^83^^84^^85^^86^^87^^88^^89^^8a^^8b^^8c^^8d^^8e^^8f%
      ^^90^^91^^92^^93^^94^^95^^96^^97^^98^^99^^9a^^9b^^9c^^9d^^9e^^9f%
      ^^a0^^a1^^a2^^a3^^a4^^a5^^a6^^a7^^a8^^a9^^aa^^ab^^ac^^ad^^ae^^af%
      ^^b0^^b1^^b2^^b3^^b4^^b5^^b6^^b7^^b8^^b9^^ba^^bb^^bc^^bd^^be^^bf%
      ^^c0^^c1^^c2^^c3^^c4^^c5^^c6^^c7^^c8^^c9^^ca^^cb^^cc^^cd^^ce^^cf%
      ^^d0^^d1^^d2^^d3^^d4^^d5^^d6^^d7^^d8^^d9^^da^^db^^dc^^dd^^de^^df%
      ^^e0^^e1^^e2^^e3^^e4^^e5^^e6^^e7^^e8^^e9^^ea^^eb^^ec^^ed^^ee^^ef%
      ^^f0^^f1^^f2^^f3^^f4^^f5^^f6^^f7^^f8^^f9^^fa^^fb^^fc^^fd^^fe^^ff%
      ^^00}
\def\lst@CCECUse#1#2{%
    \ifnum`#2=\z@
        \expandafter\@gobbletwo
    \else
        \ifnum\catcode`#2=\active
            \lccode`\~=`#2\lccode`\/=`#2\lowercase{\lst@CCECUse@#1~/}%
        \else
            \lst@ifactivechars \catcode`#2=\active \fi
            \lccode`\~=`#2\lccode`\/=`#2\lowercase{\def~{#1/}}%
        \fi
    \fi
    \lst@CCECUse#1}
\def\lst@CCECUse@#1#2#3{%
    \expandafter\def\csname\@lst @EC#3\endcsname{\lst@UM#3}%
    \expandafter\let\csname\@lst @um#3@\endcsname #2%
    \edef#2{\noexpand#1%
            \expandafter\noexpand\csname\@lst @EC#3\endcsname}}
\lst@AddToHook{Init}
    {\let\lsts@nfss@catcodes\nfss@catcodes
     \let\nfss@catcodes\lst@nfss@catcodes}
\def\lst@nfss@catcodes{%
    \lst@makeletter
        ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\relax
    \@makeother (\@makeother )\@makeother ,\@makeother :\@makeother &%
    \@makeother 0\@makeother 1\@makeother 2\@makeother 3\@makeother 4%
    \@makeother 5\@makeother 6\@makeother 7\@makeother 8\@makeother 9%
    \@makeother =\lsts@nfss@catcodes}
\def\lst@makeletter#1{%
    \ifx\relax#1\else\catcode`#111\relax \expandafter\lst@makeletter\fi}
\lst@AddToHook{Init}
{\edef\lst@OrgOutput{\the\output}%
 \output{\global\setbox\lst@gtempboxa\box\@cclv
         \expandafter\egroup
         \lst@SaveToken
     \lst@InterruptModes
     \setbox\@cclv\box\lst@gtempboxa
     \bgroup\lst@OrgOutput\egroup
     \bgroup
     \aftergroup\pagegoal\aftergroup\vsize
     \aftergroup\lst@ReenterModes\aftergroup\lst@RestoreToken}}
\lst@Key{alsoletter}\relax{%
    \lst@DoAlso{#1}\lst@alsoletter\lst@ProcessLetter}
\lst@Key{alsodigit}\relax{%
    \lst@DoAlso{#1}\lst@alsodigit\lst@ProcessDigit}
\lst@Key{alsoother}\relax{%
    \lst@DoAlso{#1}\lst@alsoother\lst@ProcessOther}
\lst@AddToHook{SelectCharTable}
    {\lst@alsoother \lst@alsodigit \lst@alsoletter}
\lst@AddToHookExe{SetLanguage}% init
    {\let\lst@alsoletter\@empty
     \let\lst@alsodigit\@empty
     \let\lst@alsoother\@empty}
\def\lst@DoAlso#1#2#3{%
    \lst@DefOther\lst@arg{#1}\let#2\@empty
    \expandafter\lst@DoAlso@\expandafter#2\expandafter#3\lst@arg\relax}
\def\lst@DoAlso@#1#2#3{%
    \ifx\relax#3\expandafter\@gobblethree \else
        \begingroup \lccode`\~=`#3\relax \lowercase{\endgroup
        \def\lst@temp##1\def~##2##3\relax{%
            \edef\lst@arg{\def\noexpand~{\noexpand#2\expandafter
                                         \noexpand\@gobble##2}}}}%
        \expandafter\lst@temp\lst@SelectStdCharTable\relax
        \lst@lExtend#1{\lst@arg}%
    \fi
    \lst@DoAlso@#1#2}
\def\lst@SaveDef#1#2{%
    \begingroup \lccode`\~=#1\relax \lowercase{\endgroup\let#2~}}
\def\lst@DefSaveDef#1#2{%
    \begingroup \lccode`\~=#1\relax \lowercase{\endgroup\let#2~\def~}}
\def\lst@LetSaveDef#1#2{%
    \begingroup \lccode`\~=#1\relax \lowercase{\endgroup\let#2~\let~}}
\def\lst@CDef#1{\lst@CDef@#1}
\def\lst@CDef@#1#2#3#4{\lst@CDefIt#1{#2}{#3}{#4#2#3}#4}
\def\lst@CDefX#1{\lst@CDefX@#1}
\def\lst@CDefX@#1#2#3{\lst@CDefIt#1{#2}{#3}{}}
\def\lst@CDefIt#1#2#3#4#5#6#7#8{%
    \ifx\@empty#2\@empty
        \def#1{#6\def\lst@next{#7#4#8}\lst@next}%
    \else \ifx\@empty#3\@empty
        \def#1##1{%
            #6%
            \ifx##1#2\def\lst@next{#7#4#8}\else
                     \def\lst@next{#5##1}\fi
            \lst@next}%
    \else
        \def#1{%
            #6%
            \lst@IfNextCharsArg{#2#3}{#7#4#8}%
                                     {\expandafter#5\lst@eaten}}%
    \fi \fi}
\def\lst@CArgX#1#2\relax{%
    \lst@DefActive\lst@arg{#1#2}%
    \expandafter\lst@CArg\lst@arg\relax}
\def\lst@CArg#1#2\relax{%
    \lccode`\/=`#1\lowercase{\def\lst@temp{/}}%
    \lst@GetFreeMacro{lst@c\lst@temp}%
    \expandafter\lst@CArg@\lst@freemacro#1#2\@empty\@empty\relax}
\def\lst@CArg@#1#2#3#4\@empty#5\relax#6{%
    \let#1#2%
    \ifx\@empty#3\@empty
        \def\lst@next{#6{#2{}{}}}%
    \else
        \def\lst@next{#6{#2#3{#4}}}%
    \fi
    \lst@next #1}
\def\lst@CArgEmpty#1\@empty{#1}
\lst@Key{excludedelims}\relax
    {\lsthk@ExcludeDelims \lst@NormedDef\lst@temp{#1}%
     \expandafter\lst@for\lst@temp\do
     {\expandafter\let\csname\@lst @ifex##1\endcsname\iftrue}}
\def\lst@DelimPrint#1#2{%
    #1%
      \begingroup
        \lst@mode\lst@nomode \lst@modetrue
        #2\lst@XPrintToken
      \endgroup
      \lst@ResetToken
    \fi}
\def\lst@DelimOpen#1#2#3#4#5#6\@empty{%
    \lst@TrackNewLines \lst@XPrintToken
    \lst@DelimPrint#1{#6}%
    \lst@EnterMode{#4}{\def\lst@currstyle#5}%
    \lst@DelimPrint{#1#2}{#6}%
    #3}
\def\lst@DelimClose#1#2#3\@empty{%
    \lst@TrackNewLines \lst@XPrintToken
    \lst@DelimPrint{#1#2}{#3}%
    \lst@LeaveMode
    \lst@DelimPrint{#1}{#3}}
\def\lst@BeginDelim{\lst@DelimOpen\iffalse\else{}}
\def\lst@EndDelim{\lst@DelimClose\iffalse\else}
\def\lst@BeginIDelim{\lst@DelimOpen\iffalse{}{}}
\def\lst@EndIDelim{\lst@DelimClose\iffalse{}}
\lst@AddToHook{SelectCharTable}{\lst@DefDelims}
\lst@AddToHookExe{SetLanguage}{\let\lst@DefDelims\@empty}
\def\lst@Delim#1{%
    \lst@false \let\lst@cumulative\@empty \let\lst@arg\@empty
    \@ifstar{\@ifstar{\lst@Delim@{#1}}%
                     {\let\lst@cumulative\relax
                      \lst@Delim@{#1}}}%
            {\lst@true\lst@Delim@{#1}}}
\def\lst@Delim@#1[#2]{%
    \gdef\lst@delimtype{#2}%
    \@ifnextchar[\lst@Delim@sty
                 {\lst@Delim@sty[#1]}}
\def\lst@Delim@sty[#1]{%
    \def\lst@delimstyle{#1}%
    \ifx\@empty#1\@empty\else
        \lst@Delim@sty@ #1\@nil
    \fi
    \@ifnextchar[\lst@Delim@option
                 \lst@Delim@delim}
\def\lst@Delim@option[#1]{\def\lst@arg{[#1]}\lst@Delim@delim}
\def\lst@Delim@sty@#1#2\@nil{%
    \if\relax\noexpand#1\else
        \edef\lst@delimstyle{\expandafter\noexpand
                             \csname\@lst @\lst@delimstyle\endcsname}%
    \fi}
\def\lst@Delim@delim#1\relax#2#3#4#5#6#7#8{%
    \ifx #4\@empty \lst@Delim@delall{#2}\fi
    \ifx\@empty#1\@empty
        \ifx #4\@nil
            \@ifundefined{\@lst @#2DM@\lst@delimtype}%
                {\lst@Delim@delall{#2@\lst@delimtype}}%
                {\lst@Delim@delall{#2DM@\lst@delimtype}}%
        \fi
    \else
        \expandafter\lst@Delim@args\expandafter
            {\lst@delimtype}{#1}{#5}#6{#7}{#8}#4%
        \let\lst@delim\@empty
        \expandafter\lst@IfOneOf\lst@delimtype\relax#3%
        {\@ifundefined{\@lst @#2DM@\lst@delimtype}%
             {\lst@lExtend\lst@delim{\csname\@lst @#2@\lst@delimtype
                                     \expandafter\endcsname\lst@arg}}%
             {\lst@lExtend\lst@delim{\expandafter\lst@UseDynamicMode
                                     \csname\@lst @#2DM@\lst@delimtype
                                     \expandafter\endcsname\lst@arg}}%
         \ifx #4\@nil
             \let\lst@temp\lst@DefDelims \let\lst@DefDelims\@empty
             \expandafter\lst@Delim@del\lst@temp\@empty\@nil\@nil\@nil
         \else
             \lst@lExtend\lst@DefDelims\lst@delim
         \fi}%
        {\PackageError{Listings}{Illegal type `\lst@delimtype'}%
                                {#2 types are #3.}}%
     \fi}
\def\lst@Delim@args#1#2#3#4#5#6#7{%
    \begingroup
    \lst@false \let\lst@next\lst@XConvert
    \@ifnextchar #4{\xdef\lst@delimtype{\expandafter\@gobble
                                        \lst@delimtype}%
                    #5\lst@next#2\@nil
                    \lst@lAddTo\lst@arg{\@empty#6}%
                    \lst@GobbleNil}%
                   {\lst@next#2\@nil
                    \lst@lAddTo\lst@arg{\@empty#3}%
                    \lst@GobbleNil}%
                 #1\@nil
    \global\let\@gtempa\lst@arg
    \endgroup
    \let\lst@arg\@gtempa
    \ifx #7\@nil\else
        \expandafter\lst@Delim@args@\expandafter{\lst@delimstyle}%
    \fi}
\def\lst@Delim@args@#1{%
    \lst@if
        \lst@lAddTo\lst@arg{{{#1}\lst@modetrue}}%
    \else
        \ifx\lst@cumulative\@empty
            \lst@lAddTo\lst@arg{{{}#1}}%
        \else
            \lst@lAddTo\lst@arg{{{#1}}}%
        \fi
    \fi}
\def\lst@Delim@del#1\@empty#2#3#4{%
    \ifx #2\@nil\else
        \def\lst@temp{#1\@empty#2#3}%
        \ifx\lst@temp\lst@delim\else
            \lst@lAddTo\lst@DefDelims{#1\@empty#2#3{#4}}%
        \fi
        \expandafter\lst@Delim@del
    \fi}
\def\lst@Delim@delall#1{%
    \begingroup
    \edef\lst@delim{\expandafter\string\csname\@lst @#1\endcsname}%
    \lst@false \global\let\@gtempa\@empty
    \expandafter\lst@Delim@delall@\lst@DefDelims\@empty
    \endgroup
    \let\lst@DefDelims\@gtempa}
\def\lst@Delim@delall@#1{%
    \ifx #1\@empty\else
        \ifx #1\lst@UseDynamicMode
            \lst@true
            \let\lst@next\lst@Delim@delall@do
        \else
            \def\lst@next{\lst@Delim@delall@do#1}%
        \fi
        \expandafter\lst@next
    \fi}
\def\lst@Delim@delall@do#1#2\@empty#3#4#5{%
    \expandafter\lst@IfSubstring\expandafter{\lst@delim}{\string#1}%
      {}%
      {\lst@if \lst@AddTo\@gtempa\lst@UseDynamicMode \fi
       \lst@AddTo\@gtempa{#1#2\@empty#3#4{#5}}}%
    \lst@false \lst@Delim@delall@}
\gdef\lst@DefDelimB#1#2#3#4#5#6#7#8{%
    \lst@CDef{#1}#2%
        {#3}%
        {\let\lst@bnext\lst@CArgEmpty
         \lst@ifmode #4\else
             #5%
             \def\lst@bnext{#6{#7}{#8}}%
         \fi
         \lst@bnext}%
        \@empty}
\gdef\lst@DefDelimE#1#2#3#4#5#6#7{%
    \lst@CDef{#1}#2%
        {#3}%
        {\let\lst@enext\lst@CArgEmpty
         \ifnum #7=\lst@mode%
             #4%
             \let\lst@enext#6%
         \else
             #5%
         \fi
         \lst@enext}%
        \@empty}
\lst@AddToHook{Init}{\let\lst@bnext\relax \let\lst@enext\relax}
\gdef\lst@DefDelimBE#1#2#3#4#5#6#7#8#9{%
    \lst@CDef{#1}#2%
        {#3}%
        {\let\lst@bnext\lst@CArgEmpty
         \ifnum #7=\lst@mode
             #4%
             \let\lst@bnext#9%
         \else
             \lst@ifmode\else
                 #5%
                 \def\lst@bnext{#6{#7}{#8}}%
             \fi
         \fi
         \lst@bnext}%
        \@empty}
\gdef\lst@delimtypes{s,l}
\gdef\lst@DelimKey#1#2{%
    \lst@Delim{}#2\relax
        {Delim}\lst@delimtypes #1%
                {\lst@BeginDelim\lst@EndDelim}
        i\@empty{\lst@BeginIDelim\lst@EndIDelim}}
\lst@Key{delim}\relax{\lst@DelimKey\@empty{#1}}
\lst@Key{moredelim}\relax{\lst@DelimKey\relax{#1}}
\lst@Key{deletedelim}\relax{\lst@DelimKey\@nil{#1}}
\gdef\lst@DelimDM@l#1#2\@empty#3#4#5{%
    \lst@CArg #2\relax\lst@DefDelimB{}{}{}#3{#1}{#5\lst@Lmodetrue}}
\gdef\lst@DelimDM@s#1#2#3\@empty#4#5#6{%
    \lst@CArg #2\relax\lst@DefDelimB{}{}{}#4{#1}{#6}%
    \lst@CArg #3\relax\lst@DefDelimE{}{}{}#5{#1}}
\def\lst@ReplaceInput#1{\lst@CArgX #1\relax\lst@CDefX{}{}}
\lst@Key{literate}{}{\def\lst@literate{#1}}
\lst@AddToHook{SelectCharTable}
    {\ifx\lst@literate\@empty\else
         \expandafter\lst@Literate\lst@literate{}\relax\z@
     \fi}
\def\lst@Literate#1#2#3{%
    \ifx\relax#2\@empty\else
        \lst@ReplaceInput{#1}%
            {\lst@XPrintToken \lst@letterfalse
             \lst@token{#2}\lst@length#3\relax
             \lst@XPrintToken}%
        \expandafter\lst@Literate
    \fi}
\def\lst@BeginDropInput#1{%
    \lst@EnterMode{#1}%
    {\lst@modetrue
     \let\lst@ifdropinput\iftrue
     \let\lst@ProcessLetter\@gobble
     \let\lst@ProcessDigit\@gobble
     \let\lst@ProcessOther\@gobble
     \let\lst@ProcessSpace\@empty
     \let\lst@ProcessTabulator\@empty
     \let\lst@ProcessFormFeed\@empty}}
\let\lst@ifdropinput\iffalse % init
\lst@Key{basicstyle}\relax{\def\lst@basicstyle{#1}}
\lst@Key{inputencoding}\relax{\def\lst@inputenc{#1}}
\lst@AddToHook{Init}
    {\lst@basicstyle
     \ifx\lst@inputenc\@empty\else
         \@ifundefined{inputencoding}{}%
            {\inputencoding\lst@inputenc}%
     \fi}
\lst@AddToHookExe{EmptyStyle}
    {\let\lst@basicstyle\@empty
     \let\lst@inputenc\@empty}
\def\lst@parshape{\parshape\@ne \z@ \linewidth}
\lst@AddToHookAtTop{EveryLine}{\lst@parshape}
\lst@AddToHookAtTop{EndGroup}{\lst@parshape}
\newcount\lst@lineno % \global
\lst@AddToHook{InitVars}{\global\lst@lineno\@ne}
\lst@Key{print}{true}[t]{\lstKV@SetIf{#1}\lst@ifprint}
\lst@Key{firstline}\relax{\def\lst@firstline{#1\relax}}
\lst@Key{lastline}\relax{\def\lst@lastline{#1\relax}}
\lst@AddToHook{PreSet}
    {\let\lst@firstline\@ne \def\lst@lastline{9999999\relax}}
\lst@Key{nolol}{false}[t]{\lstKV@SetIf{#1}\lst@ifnolol}
\def\lst@nololtrue{\let\lst@ifnolol\iftrue}
\let\lst@ifnolol\iffalse % init
\lst@Key{captionpos}{t}{\def\lst@captionpos{#1}}
\lst@Key{abovecaptionskip}\smallskipamount{\def\lst@abovecaption{#1}}
\lst@Key{belowcaptionskip}\smallskipamount{\def\lst@belowcaption{#1}}
\lst@Key{label}\relax{\def\lst@label{#1}}
\lst@Key{title}\relax{\def\lst@title{#1}\let\lst@caption\relax}
\lst@Key{caption}\relax{\lstKV@OptArg[{#1}]{#1}%
    {\def\lst@caption{##2}\def\lst@@caption{##1}}%
     \let\lst@title\@empty}
\lst@AddToHookExe{TextStyle}
    {\let\lst@caption\@empty \let\lst@@caption\@empty
     \let\lst@title\@empty \let\lst@label\@empty}
\@ifundefined{thechapter}
    {\newcounter{lstlisting}
     \renewcommand\thelstlisting{\@arabic\c@lstlisting}}
    {\newcounter{lstlisting}[chapter]
     \renewcommand\thelstlisting
         {\ifnum \c@chapter>\z@ \thechapter.\fi \@arabic\c@lstlisting}}
\lst@UserCommand\lstlistingname{Listing}
\@ifundefined{abovecaptionskip}
{\newskip\abovecaptionskip
 \newskip\belowcaptionskip
 \long\def\@makecaption#1#2{%
   \vskip\abovecaptionskip
   \sbox\@tempboxa{#1: #2}%
   \ifdim \wd\@tempboxa >\hsize
     #1: #2\par
   \else
     \global \@minipagefalse
     \hb@xt@\hsize{\hfil\box\@tempboxa\hfil}%
   \fi
   \vskip\belowcaptionskip}%
}{}
\def\lst@MakeCaption#1{%
    \ifx #1t%
        \ifx\lst@@caption\@empty\expandafter\lst@HRefStepCounter \else
                                \expandafter\refstepcounter
        \fi {lstlisting}%
        \ifx\lst@label\@empty\else \label{\lst@label}\fi
        \lst@ifnolol\else
            \ifx\lst@@caption\@empty
                \ifx\lst@caption\@empty
                    \ifx\lst@intname\@empty \else \def\lst@temp{ }%
                    \ifx\lst@intname\lst@temp \else
                        \addcontentsline{lol}{lstlisting}\lst@name
                    \fi\fi
                \fi
            \else
                \addcontentsline{lol}{lstlisting}%
                    {\protect\numberline{\thelstlisting}\lst@@caption}%
            \fi
         \fi
     \fi
    \ifx\lst@caption\@empty\else
        \lst@IfSubstring #1\lst@captionpos
            {\begingroup \let\@@vskip\vskip
             \def\vskip{\afterassignment\lst@vskip \@tempskipa}%
             \def\lst@vskip{\nobreak\@@vskip\@tempskipa\nobreak}%
             \par\normalsize\normalfont
             \ifx #1t\allowbreak \fi
             \ifx\lst@title\@empty
                 \expandafter\@makecaption
             \else
                 \expandafter\lst@maketitle
             \fi
                {\noindent\lstlistingname
                 \ifx\lst@@caption\@empty\else~\thelstlisting\fi}%
                \lst@caption
             \ifx #1b\allowbreak \fi
             \endgroup}{}%
    \fi}
\def\lst@maketitle#1#2{\@makecaption\lst@title@dropdelim\lst@title}
\def\lst@title@dropdelim#1{\ignorespaces}
\AtBeginDocument{%
\@ifundefined{caption@make}{}{%
\def\lst@maketitle#1#2{%
    \begingroup
    \captionstyle{lsttitle}\@makecaption{}\lst@title
    \endgroup}
\newcaptionstyle{lsttitle}{\caption@make{lsttitle}}%
\def\caption@@@lsttitle{\captiontext\par}%
}}
\def\lst@HRefStepCounter#1{%
    \begingroup
    \c@lstlisting\lst@neglisting
    \advance\c@lstlisting\m@ne \xdef\lst@neglisting{\the\c@lstlisting}%
    \ifx\hyper@refstepcounter\@undefined\else
        \hyper@refstepcounter{#1}%
    \fi
    \endgroup}
\gdef\lst@neglisting{\z@}% init
\lst@Key{boxpos}{c}{\def\lst@boxpos{#1}}
\def\lst@boxtrue{\let\lst@ifbox\iftrue}
\let\lst@ifbox\iffalse
\lst@Key{float}\relax[\lst@floatplacement]{%
    \def\lst@next{\@ifstar{\let\lst@beginfloat\@dblfloat
                           \let\lst@endfloat\end@dblfloat
                           \lst@KFloat}%
                          {\let\lst@beginfloat\@float
                           \let\lst@endfloat\end@float
                           \lst@KFloat}}
    \edef\lst@float{#1}%
    \expandafter\lst@next\lst@float\relax}
\def\lst@KFloat#1\relax{%
    \ifx\@empty#1\@empty
        \let\lst@float\lst@floatplacement
    \else
        \def\lst@float{#1}%
    \fi}
\lst@Key{floatplacement}{tbp}{\def\lst@floatplacement{#1}}
\lst@AddToHook{PreSet}{\let\lst@float\relax}
\lst@AddToHook{TextStyle}{\let\lst@float\relax}
\AtBeginDocument{%
\@ifundefined{c@float@type}%
    {\edef\ftype@lstlisting{\ifx\c@figure\@undefined 1\else 4\fi}}
    {\edef\ftype@lstlisting{\the\c@float@type}%
     \addtocounter{float@type}{\value{float@type}}}%
}
\lst@Key{aboveskip}\medskipamount{\def\lst@aboveskip{#1}}
\lst@Key{belowskip}\medskipamount{\def\lst@belowskip{#1}}
\lst@AddToHook{TextStyle}
    {\let\lst@aboveskip\z@ \let\lst@belowskip\z@}
\lst@Key{everydisplay}{}{\def\lst@EveryDisplay{#1}}
\lst@AddToHook{TextStyle}{\let\lst@ifdisplaystyle\iffalse}
\lst@AddToHook{DisplayStyle}{\let\lst@ifdisplaystyle\iftrue}
\let\lst@ifdisplaystyle\iffalse
\def\lst@Init#1{%
    \begingroup
    \ifx\lst@float\relax\else
        \edef\@tempa{\noexpand\lst@beginfloat{lstlisting}[\lst@float]}%
        \expandafter\@tempa
    \fi
    \ifhmode\ifinner \lst@boxtrue \fi\fi
    \lst@ifbox
        \lsthk@BoxUnsafe
        \hbox to\z@\bgroup
             $\if t\lst@boxpos \vtop
        \else \if b\lst@boxpos \vbox
        \else \vcenter \fi\fi
        \bgroup \par\noindent
    \else
        \lst@ifdisplaystyle
            \lst@EveryDisplay
            \par\penalty-50\relax
            \vspace\lst@aboveskip
        \fi
    \fi
    \normalbaselines
    \abovecaptionskip\lst@abovecaption\relax
    \belowcaptionskip\lst@belowcaption\relax
    \lst@MakeCaption t%
    \lsthk@PreInit \lsthk@Init
    \lst@ifdisplaystyle
        \global\let\lst@ltxlabel\@empty
        \if@inlabel
            \lst@ifresetmargins
                \leavevmode
            \else
                \xdef\lst@ltxlabel{\the\everypar}%
                \lst@AddTo\lst@ltxlabel{%
                    \global\let\lst@ltxlabel\@empty
                    \everypar{\lsthk@EveryLine\lsthk@EveryPar}}%
            \fi
        \fi
        \everypar\expandafter{\lst@ltxlabel
                              \lsthk@EveryLine\lsthk@EveryPar}%
    \else
        \everypar{}\let\lst@NewLine\@empty
    \fi
    \lsthk@InitVars \lsthk@InitVarsBOL
    \lst@Let{13}\lst@MProcessListing
    \let\lst@Backslash#1%
    \lst@EnterMode{\lst@Pmode}{\lst@SelectCharTable}%
    \lst@InitFinalize}
\let\lst@InitFinalize\@empty % init
\lst@AddToHook{PreInit}
    {\rightskip\z@ \leftskip\z@ \parfillskip=\z@ plus 1fil
     \let\par\@@par}
\lst@AddToHook{EveryLine}{}% init
\lst@AddToHook{EveryPar}{}% init
\lst@Key{showlines}f[t]{\lstKV@SetIf{#1}\lst@ifshowlines}
\def\lst@DeInit{%
    \lst@XPrintToken \lst@EOLUpdate
    \global\advance\lst@newlines\m@ne
    \lst@ifshowlines
        \lst@DoNewLines
    \else
        \setbox\@tempboxa\vbox{\lst@DoNewLines}%
    \fi
    \lst@ifdisplaystyle \par\removelastskip \fi
    \lsthk@ExitVars\everypar{}\lsthk@DeInit\normalbaselines
    \lst@MakeCaption b%
    \lst@ifbox
        \egroup $\hss \egroup
        \vrule\@width\lst@maxwidth\@height\z@\@depth\z@
    \else
        \lst@ifdisplaystyle
            \par\penalty-50\vspace\lst@belowskip
        \fi
    \fi
    \ifx\lst@float\relax\else
        \expandafter\lst@endfloat
    \fi
    \endgroup}
\newdimen\lst@maxwidth % \global
\lst@AddToHook{InitVars}{\global\lst@maxwidth\z@}
\lst@AddToHook{InitVarsEOL}
    {\ifdim\lst@currlwidth>\lst@maxwidth
         \global\lst@maxwidth\lst@currlwidth
     \fi}
\def\lst@EOLUpdate{\lsthk@EOL \lsthk@InitVarsEOL}
\def\lst@MProcessListing{%
    \lst@XPrintToken \lst@EOLUpdate \lsthk@InitVarsBOL
    \global\advance\lst@lineno\@ne
    \ifnum \lst@lineno>\lst@lastline
        \expandafter\lst@EndProcessListing
    \else
        \expandafter\lst@BOLGobble
    \fi}
\let\lst@EndProcessListing\endinput
\lst@Key{gobble}{0}{\def\lst@gobble{#1}}
\def\lst@BOLGobble{%
    \ifnum\lst@gobble>\z@
        \@tempcnta\lst@gobble\relax
        \expandafter\lst@BOLGobble@
\fi}
\def\lst@BOLGobble@@{%
    \ifnum\@tempcnta>\z@
        \expandafter\lst@BOLGobble@
    \fi}
\def\lstenv@BOLGobble@@{%
    \lst@IfNextChars\lstenv@endstring{\lstenv@End}%
    {\advance\@tempcnta\m@ne \expandafter\lst@BOLGobble@@\lst@eaten}}
\def\lst@BOLGobble@#1{%
    \let\lst@next#1%
    \ifx \lst@next\relax\else
    \ifx \lst@next\lst@MProcessListing\else
    \ifx \lst@next\lst@processformfeed\else
    \ifx \lst@next\lstenv@backslash
        \let\lst@next\lstenv@BOLGobble@@
    \else
        \let\lst@next\lst@BOLGobble@@
        \ifx #1\lst@processtabulator
            \advance\@tempcnta-\lst@tabsize\relax
            \ifnum\@tempcnta<\z@
                \lst@length-\@tempcnta \lst@PreGotoTabStop
            \fi
        \else
            \advance\@tempcnta\m@ne
        \fi
    \fi \fi \fi \fi
    \lst@next}
\def\lst@processformfeed{\lst@ProcessFormFeed}
\def\lst@processtabulator{\lst@ProcessTabulator}
\lst@Key{name}\relax{\def\lst@intname{#1}}
\lst@AddToHookExe{PreSet}{\global\let\lst@intname\@empty}
\lst@AddToHook{PreInit}{%
    \let\lst@arg\lst@intname \lst@ReplaceIn\lst@arg\lst@filenamerpl
    \global\let\lst@name\lst@arg \global\let\lstname\lst@name}
\def\lst@filenamerpl{_\textunderscore $\textdollar -\textendash}
\def\l@lstlisting#1#2{\@dottedtocline{1}{1.5em}{2.3em}{#1}{#2}}
\lst@UserCommand\lstlistlistingname{Listings}
\lst@UserCommand\lstlistoflistings{\bgroup
    \let\contentsname\lstlistlistingname
    \let\lst@temp\@starttoc \def\@starttoc##1{\lst@temp{lol}}%
    \tableofcontents \egroup}
\newcommand\lstinline[1][]{%
    \leavevmode\bgroup % \hbox\bgroup --> \bgroup
      \def\lst@boxpos{b}%
      \lsthk@PreSet\lstset{flexiblecolumns,#1}%
      \lsthk@TextStyle
      \@ifnextchar\bgroup{\afterassignment\lst@InlineG \let\@let@token}%
                         \lstinline@}
\def\lstinline@#1{%
    \lst@Init\relax
    \lst@IfNextCharActive{\lst@InlineM#1}{\lst@InlineJ#1}}
\lst@AddToHook{TextStyle}{}% init
\lst@AddToHook{SelectCharTable}{\lst@inlinechars}
\global\let\lst@inlinechars\@empty
\def\lst@InlineM#1{\gdef\lst@inlinechars{%
    \lst@Def{`#1}{\lst@DeInit\egroup\global\let\lst@inlinechars\@empty}%
    \lst@Def{13}{\lst@DeInit\egroup \global\let\lst@inlinechars\@empty
        \PackageError{Listings}{lstinline ended by EOL}\@ehc}}%
    \lst@inlinechars}
\def\lst@InlineJ#1{%
    \def\lst@temp##1#1{%
        \let\lst@arg\@empty \lst@InsideConvert{##1}\lst@arg
        \lst@DeInit\egroup}%
    \lst@temp}
\def\lst@InlineG{%
    \lst@Init\relax
    \lst@IfNextCharActive{\lst@InlineM\}}%
                         {\let\lst@arg\@empty \lst@InlineGJ}}
\def\lst@InlineGJ{\futurelet\@let@token\lst@InlineGJTest}
\def\lst@InlineGJTest{%
    \ifx\@let@token\egroup
        \afterassignment\lst@InlineGJEnd
        \expandafter\let\expandafter\@let@token
    \else
        \ifx\@let@token\@sptoken
            \let\lst@next\lst@InlineGJReadSp
        \else
            \let\lst@next\lst@InlineGJRead
        \fi
        \expandafter\lst@next
    \fi}
\def\lst@InlineGJEnd{\lst@arg\lst@DeInit\egroup}
\def\lst@InlineGJRead#1{%
    \lccode`\~=`#1\lowercase{\lst@lAddTo\lst@arg~}%
    \lst@InlineGJ}
\def\lst@InlineGJReadSp#1{%
    \lccode`\~=`\ \lowercase{\lst@lAddTo\lst@arg~}%
    \lst@InlineGJ#1}
\newcommand\lstinputlisting[2][]{%
    \def\lst@set{#1}%
    \IfFileExists{#2}%
        {\lst@InputListing{#2}}%
        {\filename@parse{#2}%
         \edef\reserved@a{\noexpand\lst@MissingFileError
             {\filename@area\filename@base}%
             {\ifx\filename@ext\relax tex\else\filename@ext\fi}}%
         \reserved@a}%
    \@doendpe \@newlistfalse \ignorespaces}
\def\lst@MissingFileError#1#2{%
    \typeout{^^J! Package Listings Error: File `#1(.#2)' not found.^^J%
        ^^JType X to quit or <RETURN> to proceed,^^J%
        or enter new name. (Default extension: #2)^^J}%
    \message{Enter file name: }%
    {\endlinechar\m@ne \global\read\m@ne to\@gtempa}%
    \ifx\@gtempa\@empty \else
        \def\reserved@a{x}\ifx\reserved@a\@gtempa\batchmode\@@end\fi
        \def\reserved@a{X}\ifx\reserved@a\@gtempa\batchmode\@@end\fi
        \filename@parse\@gtempa
        \edef\filename@ext{%
            \ifx\filename@ext\relax#2\else\filename@ext\fi}%
        \edef\reserved@a{\noexpand\IfFileExists %
                {\filename@area\filename@base.\filename@ext}%
            {\noexpand\lst@InputListing %
                {\filename@area\filename@base.\filename@ext}}%
            {\noexpand\lst@MissingFileError
                {\filename@area\filename@base}{\filename@ext}}}%
        \expandafter\reserved@a %
    \fi}
\let\lst@ifdraft\iffalse
\DeclareOption{draft}{\let\lst@ifdraft\iftrue}
\DeclareOption{final}{\let\lst@ifdraft\iffalse}
\lst@AddToHook{PreSet}
    {\lst@ifdraft
         \let\lst@ifprint\iffalse
         \@gobbletwo\fi\fi
     \fi}
\def\lst@InputListing#1{%
    \begingroup
      \lsthk@PreSet \gdef\lst@intname{#1}%
      \expandafter\lstset\expandafter{\lst@set}%
      \lsthk@DisplayStyle
      \catcode\active=\active
      \lst@Init\relax \let\lst@gobble\z@
      \lst@SkipToFirst
      \lst@ifprint \def\lst@next{\input{#1}}%
             \else \let\lst@next\@empty \fi
      \lst@next
      \lst@DeInit
    \endgroup}
\def\lst@SkipToFirst{%
    \ifnum \lst@lineno<\lst@firstline
        \lst@BeginDropInput\lst@Pmode
        \lst@Let{13}\lst@MSkipToFirst
        \lst@Let{10}\lst@MSkipToFirst
    \else
        \expandafter\lst@BOLGobble
    \fi}
\def\lst@MSkipToFirst{%
    \global\advance\lst@lineno\@ne
    \ifnum \lst@lineno=\lst@firstline
        \lst@LeaveMode \global\lst@newlines\z@
        \lsthk@InitVarsBOL
        \expandafter\lst@BOLGobble
    \fi}
\def\lstenv@DroppedWarning{%
    \ifx\lst@dropped\@undefined\else
        \PackageWarning{Listings}{Text dropped after begin of listing}%
    \fi}
\let\lst@dropped\@undefined % init
\begingroup \lccode`\~=`\^^M\lowercase{%
\gdef\lstenv@Process#1{%
    \ifx~#1%
        \lstenv@DroppedWarning \let\lst@next\lst@SkipToFirst
    \else\ifx^^J#1%
        \lstenv@DroppedWarning \let\lst@next\lstenv@ProcessJ
    \else
        \let\lst@dropped#1\let\lst@next\lstenv@Process
    \fi \fi
    \lst@next}
}\endgroup
\def\lstenv@ProcessJ{%
    \let\lst@arg\@empty
    \ifx\@currenvir\lstenv@name
        \expandafter\lstenv@ProcessJEnv
    \else
        \expandafter\def\expandafter\lst@temp\expandafter##1%
            \csname end\lstenv@name\endcsname
                {\lst@InsideConvert{##1}\lstenv@ProcessJ@}%
        \expandafter\lst@temp
    \fi}
\begingroup \lccode`\~=`\\\lowercase{%
\gdef\lstenv@ProcessJ@{%
    \lst@lExtend\lst@arg
        {\expandafter\ \expandafter~\lstenv@endstring}%
    \catcode10=\active \lst@Let{10}\lst@MProcessListing
    \lst@SkipToFirst \lst@arg}
}\endgroup
\def\lstenv@ProcessJEnv#1\end#2{\def\lst@temp{#2}%
    \ifx\lstenv@name\lst@temp
        \lst@InsideConvert{#1}%
        \expandafter\lstenv@ProcessJ@
    \else
        \lst@InsideConvert{#1\\end\{#2\}}%
        \expandafter\lstenv@ProcessJEnv
    \fi}
\def\lstenv@backslash{%
    \lst@IfNextChars\lstenv@endstring
        {\lstenv@End}%
        {\expandafter\lsts@backslash \lst@eaten}}%
\def\lstenv@End{%
    \ifx\@currenvir\lstenv@name
        \edef\lst@next{\noexpand\end{\lstenv@name}}%
    \else
        \def\lst@next{\csname end\lstenv@name\endcsname}%
    \fi
    \lst@next}
\lst@UserCommand\lstnewenvironment#1#2#{%
    \@ifundefined{#1}%
        {\let\lst@arg\@empty
         \lst@XConvert{#1}\@nil
         \expandafter\lstnewenvironment@\lst@arg{#1}{#2}}%
        {\PackageError{Listings}{Environment `#1' already defined}\@eha
         \@gobbletwo}}
\def\@tempa#1#2#3{%
\gdef\lstnewenvironment@##1##2##3##4##5{%
    \begingroup
    \global\@namedef{end##2}{\lstenv@Error{##2}}%
    \global\@namedef{##2}{\def\lstenv@name{##2}%
        \begingroup \catcode\active=\active \csname##2@\endcsname}%
    \let\l@ngrel@x\global
    \let\@xargdef\lstenv@xargdef
    \expandafter\new@command\csname##2@\endcsname##3%
        {\lsthk@PreSet ##4%
         \ifx\@currenvir\lstenv@name
             \def\lstenv@endstring{#1#2##1#3}%
         \else
             \def\lstenv@endstring{#1##1}%
         \fi
         \@namedef{end##2}{\lst@DeInit ##5\endgroup
                          \@doendpe \@ignoretrue}%
         \lsthk@DisplayStyle
         \let\lst@EndProcessListing\lstenv@SkipToEnd
         \lst@Init\lstenv@backslash
         \lst@ifprint
             \expandafter\expandafter\expandafter\lstenv@Process
         \else
             \expandafter\lstenv@SkipToEnd
         \fi
         \lst@insertargs}%
    \endgroup}%
}
\let\lst@arg\@empty \lst@XConvert{end}\{\}\@nil
\expandafter\@tempa\lst@arg
\let\lst@insertargs\@empty
\def\lstenv@xargdef#1{
    \expandafter\lstenv@xargdef@\csname\string#1\endcsname#1}
\def\lstenv@xargdef@#1#2[#3][#4]#5{%
  \@ifdefinable#2{%
       \gdef#2{%
          \ifx\protect\@typeset@protect
            \expandafter\lstenv@testopt
          \else
            \@x@protect#2%
          \fi
          #1%
          {#4}}%
       \@yargdef
          #1%
           \tw@
           {#3}%
           {#5}}}
\long\def\lstenv@testopt#1#2{%
  \@ifnextchar[{\catcode\active5\relax \lstenv@testopt@#1}%
               {#1[{#2}]}}
\def\lstenv@testopt@#1[#2]{%
    \catcode\active\active
    #1[#2]}
\begingroup \lccode`\~=`\\\lowercase{%
\gdef\lstenv@SkipToEnd{%
    \long\expandafter\def\expandafter\lst@temp\expandafter##\expandafter
        1\expandafter~\lstenv@endstring{\lstenv@End}%
    \lst@temp}
}\endgroup
\def\lstenv@Error#1{\PackageError{Listings}{Extra \string\end#1}%
    {I'm ignoring this, since I wasn't doing a \csname#1\endcsname.}}
\begingroup \lccode`\~=`\^^M\lowercase{%
\gdef\lst@TestEOLChar#1{%
    \def\lst@insertargs{#1}%
    \ifx ~#1\@empty \else
    \ifx^^J#1\@empty \else
        \global\let\lst@intname\lst@insertargs
        \let\lst@insertargs\@empty
    \fi \fi}
}\endgroup
\lstnewenvironment{lstlisting}[2][]
    {\lst@TestEOLChar{#2}%
     \lstset{#1}%
     \csname\@lst @SetFirstNumber\endcsname}
    {\csname\@lst @SaveFirstNumber\endcsname}
\lst@Key{fancyvrb}\relax[t]{%
    \lstKV@SetIf{#1}\lst@iffancyvrb
    \lstFV@fancyvrb}
\ifx\lstFV@fancyvrb\@undefined
    \gdef\lstFV@fancyvrb{\lst@RequireAspects{fancyvrb}\lstFV@fancyvrb}
\fi
\@ifundefined{ocp}{}
    {\lst@AddToHook{OutputBox}%
         {\let\lst@ProcessLetter\@firstofone
          \let\lst@ProcessDigit\@firstofone
          \let\lst@ProcessOther\@firstofone}}
\DeclareOption*{\expandafter\lst@ProcessOption\CurrentOption\relax}
\def\lst@ProcessOption#1#2\relax{%
    \ifx #1!%
        \lst@DeleteKeysIn\lst@loadaspects{#2}%
    \else
        \lst@lAddTo\lst@loadaspects{,#1#2}%
    \fi}
\@ifundefined{lst@loadaspects}
  {\def\lst@loadaspects{strings,comments,escape,style,language,%
      keywords,labels,lineshape,frames,emph,index}%
  }{}
\InputIfFileExists{lstpatch.sty}{}{}
\let\lst@ifsavemem\iffalse
\DeclareOption{savemem}{\let\lst@ifsavemem\iftrue}
\DeclareOption{noaspects}{\let\lst@loadaspects\@empty}
\ProcessOptions
\lst@RequireAspects\lst@loadaspects
\let\lst@loadaspects\@empty
\lst@UseHook{SetStyle}\lst@UseHook{EmptyStyle}
\lst@UseHook{SetLanguage}\lst@UseHook{EmptyLanguage}
\InputIfFileExists{listings.cfg}{}{}
\InputIfFileExists{lstlocal.cfg}{}{}
\endinput
%%
%% End of file `listings.sty'.

~~~
###lstdoc.sty

~~~
%%
%% This is file `lstdoc.sty',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% listings.dtx  (with options: `doc')
%% 
%% Please read the software license in listings.dtx or listings.pdf.
%%
%% (w)(c) 1996 -- 2003 Carsten Heinz and/or any other author
%% listed elsewhere in this file.
%%
%% This file is distributed under the terms of the LaTeX Project Public
%% License from CTAN archives in directory  macros/latex/base/lppl.txt.
%% Either version 1.0 or, at your option, any later version.
%%
%% Permission is granted to modify this file. If your changes are of
%% general interest, please contact the address below.
%%
%% Send comments and ideas on the package, error reports and additional
%% programming languages to <cheinz@gmx.de>.
%%
\def\filedate{2003/06/21}
\def\fileversion{1.1}
\ProvidesPackage{lstdoc}
             [\filedate\space\fileversion\space(Carsten Heinz)]
\let\lstdoc@currversion\fileversion
\RequirePackage[writefile]{listings}[2002/04/01]
\newif\iffancyvrb \IfFileExists{fancyvrb.sty}{\fancyvrbtrue}{}
\newif\ifcolor \IfFileExists{color.sty}{\colortrue}{}
\newif\ifhyper \@ifundefined{pdfoutput}{}
    {\IfFileExists{hyperref.sty}{\hypertrue}{}}
\newif\ifalgorithmic \IfFileExists{algorithmic.sty}{\algorithmictrue}{}
\newif\iflgrind \IfFileExists{lgrind.sty}{\lgrindtrue}{}
\iffancyvrb \RequirePackage{fancyvrb}\fi
\ifhyper \RequirePackage[colorlinks]{hyperref}\else
    \def\href#1{\texttt}\fi
\ifcolor \RequirePackage{color}\fi
\ifalgorithmic \RequirePackage{algorithmic}\fi
\iflgrind \RequirePackage{lgrind}\fi
\RequirePackage{nameref}
\renewcommand\ref{\protect\T@ref}
\renewcommand\pageref{\protect\T@pageref}
\def\lst@BeginRemark#1{%
    \begin{quote}\topsep0pt\let\small\footnotesize\small#1:}
\def\lst@EndRemark{\end{quote}}
\newenvironment{TODO}
    {\lst@BeginRemark{To do}}{\lst@EndRemark}
\newenvironment{ALTERNATIVE}
    {\lst@BeginRemark{Alternative}}{\lst@EndRemark}
\newenvironment{REMOVED}
    {\lst@BeginRemark{Removed}}{\lst@EndRemark}
\newenvironment{OLDDEF}
    {\lst@BeginRemark{Old definition}}{\lst@EndRemark}
\def\advise{\par\list\labeladvise
    {\advance\linewidth\@totalleftmargin
     \@totalleftmargin\z@
     \@listi
     \let\small\footnotesize \small\sffamily
     \parsep \z@ \@plus\z@ \@minus\z@
     \topsep6\p@ \@plus1\p@\@minus2\p@
     \def\makelabel##1{\hss\llap{##1}}}}
\let\endadvise\endlist
\def\advisespace{\hbox{}\qquad}
\def\labeladvise{$\to$}
\newenvironment{syntax}
   {\list{}{\itemindent-\leftmargin
    \def\makelabel##1{\hss\lst@syntaxlabel##1,,,,\relax}}}
   {\endlist}
\def\lst@syntaxlabel#1,#2,#3,#4\relax{%
    \llap{\scriptsize\itshape#3}%
    \def\lst@temp{#2}%
    \expandafter\lst@syntaxlabel@\meaning\lst@temp\relax
    \rlap{\hskip-\itemindent\hskip\itemsep\hskip\linewidth
          \llap{\ttfamily\lst@temp}\hskip\labelwidth
          \def\lst@temp{#1}%
          \ifx\lst@temp\lstdoc@currversion#1\fi}}
\def\lst@syntaxlabel@#1>#2\relax
    {\edef\lst@temp{\zap@space#2 \@empty}}
\newcommand*\syntaxnewline{\newline\hbox{}\kern\labelwidth}
\newcommand*\syntaxor{\qquad or\qquad}
\newcommand*\syntaxbreak
    {\hfill\kern0pt\discretionary{}{\kern\labelwidth}{}}
\let\syntaxfill\hfill
\def\alternative#1{\lst@true \alternative@#1,\relax,}
\def\alternative@#1,{%
    \ifx\relax#1\@empty
        \expandafter\@gobble
    \else
        \ifx\@empty#1\@empty\else
            \lst@if \lst@false \else $\vert$\fi
            \textup{\texttt{#1}}%
        \fi
    \fi
    \alternative@}
\long\def\m@cro@#1#2#3{\endgroup \topsep\MacroTopsep \trivlist
  \edef\saved@macroname{\string#3}%
  \def\makelabel##1{\llap{##1}}%
  \if@inlabel
    \let\@tempa\@empty \count@\macro@cnt
    \loop \ifnum\count@>\z@
      \edef\@tempa{\@tempa\hbox{\strut}}\advance\count@\m@ne \repeat
    \edef\makelabel##1{\llap{\vtop to\baselineskip
                               {\@tempa\hbox{##1}\vss}}}%
    \advance \macro@cnt \@ne
  \else  \macro@cnt\@ne  \fi
  \edef\@tempa{\noexpand\item[%
     #1%
       \noexpand\PrintMacroName
     \else
       \expandafter\noexpand\csname Print#2Name\endcsname % MODIFIED
     \fi
     {\string#3}]}%
  \@tempa
  \global\advance\c@CodelineNo\@ne
   #1%
      \SpecialMainIndex{#3}\nobreak
      \DoNotIndex{#3}%
   \else
      \csname SpecialMain#2Index\endcsname{#3}\nobreak % MODIFIED
   \fi
  \global\advance\c@CodelineNo\m@ne
  \ignorespaces}
\def\macro{\begingroup
   \catcode`\\12
   \MakePrivateLetters \m@cro@ \iftrue {Macro}}% MODIFIED
\def\environment{\begingroup
   \catcode`\\12
   \MakePrivateLetters \m@cro@ \iffalse {Env}}% MODIFIED
\def\newdocenvironment#1#2#3#4{%
    \@namedef{#1}{#3\begingroup \catcode`\\12\relax
                  \MakePrivateLetters \m@cro@ \iffalse {#2}}%
    \@namedef{end#1}{#4\endmacro}%
    \@ifundefined{Print#2Name}{\expandafter
        \let\csname Print#2Name\endcsname\PrintMacroName}{}%
    \@ifundefined{SpecialMain#2Index}{\expandafter
        \let\csname SpecialMain#2Index\endcsname\SpecialMainIndex}{}}
\newdocenvironment{aspect}{Aspect}{}{}
\def\PrintAspectName#1{}
\def\SpecialMainAspectIndex#1{%
    \@bsphack
    \index{aspects:\levelchar\protect\aspectname{#1}\encapchar main}%
    \@esphack}
\newdocenvironment{lstkey}{Key}{}{}
\def\PrintKeyName#1{\strut\keyname{#1}\ }
\def\SpecialMainKeyIndex#1{%
    \@bsphack
    \index{keys\levelchar\protect\keyname{#1}\encapchar main}%
    \@esphack}
\newcounter{argcount}
\def\labelargcount{\texttt{\#\arabic{argcount}}\hskip\labelsep$=$}
\def\macroargs{\list\labelargcount
    {\usecounter{argcount}\leftmargin=2\leftmargin
     \parsep \z@ \@plus\z@ \@minus\z@
     \topsep4\p@ \@plus\p@ \@minus2\p@
     \itemsep\z@ \@plus\z@ \@minus\z@
     \def\makelabel##1{\hss\llap{##1}}}}
\def\endmacroargs{\endlist\@endparenv}
\lst@RequireAspects{writefile}
\newbox\lst@samplebox
\lstnewenvironment{lstsample}[3][]
    {\global\let\lst@intname\@empty
     \gdef\lst@sample{#2}%
     \setbox\lst@samplebox=\hbox\bgroup
         \setkeys{lst}{language={},style={},tabsize=4,gobble=5,%
             basicstyle=\small\ttfamily,basewidth=0.51em,point={#1}}
         #3%
         \lst@BeginAlsoWriteFile{\jobname.tmp}}
    {\lst@EndWriteFile\egroup
     \ifdim \wd\lst@samplebox>.5\linewidth
         \begin{center}%
             \hbox to\linewidth{\box\lst@samplebox\hss}%
         \end{center}%
         \lst@sampleInput
     \else
         \begin{center}%
         \begin{minipage}{0.45\linewidth}\lst@sampleInput\end{minipage}%
         \qquad
         \begin{minipage}{0.45\linewidth}%
             \hbox to\linewidth{\box\lst@samplebox\hss}%
         \end{minipage}%
         \end{center}%
     \fi}
\lst@InstallKeywords{p}{point}{pointstyle}\relax{keywordstyle}{}ld
\lstnewenvironment{lstxsample}[1][]
    {\begingroup
         \setkeys{lst}{belowskip=-\medskipamount,language={},style={},%
             tabsize=4,gobble=5,basicstyle=\small\ttfamily,%
             basewidth=0.51em,point={#1}}
         \lst@BeginAlsoWriteFile{\jobname.tmp}}
    {\endgroup
     \endgroup}
\def\lst@sampleInput{%
    \MakePercentComment\catcode`\^^M=10\relax
    \small\lst@sample
    {\setkeys{lst}{SelectCharTable=\lst@ReplaceInput{\^\^I}%
                                  {\lst@ProcessTabulator}}%
     \leavevmode \input{\jobname.tmp}}\MakePercentIgnore}
\renewcommand\paragraph{\@startsection{paragraph}{4}{\z@}%
                                      {1.25ex \@plus1ex \@minus.2ex}%
                                      {-1em}%
                                      {\normalfont\normalsize\bfseries}}
\def\lstref#1{\emph{\ref{#1} \nameref{#1}}}
\def\@part[#1]#2{\addcontentsline{toc}{part}{#1}%
    {\parindent\z@ \raggedright \interlinepenalty\@M
     \normalfont \huge \bfseries #2\markboth{}{}\par}%
    \nobreak\vskip 3ex\@afterheading}
\renewcommand*\l@section[2]{%
    \addpenalty\@secpenalty
    \addvspace{.25em \@plus\p@}%
    \setlength\@tempdima{1.5em}%
    \begingroup
      \parindent \z@ \rightskip \@pnumwidth
      \parfillskip -\@pnumwidth
      \leavevmode
      \advance\leftskip\@tempdima
      \hskip -\leftskip
      #1\nobreak\hfil \nobreak\hb@xt@\@pnumwidth{\hss #2}\par
    \endgroup}
\renewcommand*\l@subsection{\@dottedtocline{2}{0pt}{2.3em}}
\renewcommand*\l@subsubsection{\@dottedtocline{3}{0pt}{3.2em}}
\newcommand\ikeyname[1]{%
    \lstkeyindex{#1}{}%
    \lstaspectindex{#1}{}%
    \keyname{#1}}
\newcommand\ekeyname[1]{%
    \@bsphack
    \lstkeyindex{#1}{\encapchar usage}%
    \lstaspectindex{#1}{\encapchar usage}%
    \@esphack}
\newcommand\rkeyname[1]{%
    \@bsphack
    \lstkeyindex{#1}{\encapchar main}%
    \lstaspectindex{#1}{\encapchar main}%
    \@esphack{\rstyle\keyname{#1}}}
\newcommand\icmdname[1]{%
    \@bsphack
    \lstaspectindex{#1}{}%
    \@esphack\texttt{\string#1}}
\newcommand\rcmdname[1]{%
    \@bsphack
    \lstaspectindex{#1}{\encapchar main}%
    \@esphack\texttt{\rstyle\string#1}}
\def\lstaspectindex#1#2{%
    \global\@namedef{lstkandc@\string#1}{}%
    \@ifundefined{lstisaspect@\string#1}
        {\index{unknown\levelchar
                \protect\texttt{\protect\string\string#1}#2}}%
        {\index{\@nameuse{lstisaspect@\string#1}\levelchar
                \protect\texttt{\protect\string\string#1}#2}}%
}
\def\lstkeyindex#1#2{%
}
\def\lstisaspect[#1]#2{%
    \global\@namedef{lstaspect@#1}{#2}%
    \lst@AddTo\lst@allkeysandcmds{,#2}%
    \@for\lst@temp:=#2\do
    {\ifx\@empty\lst@temp\else
         \global\@namedef{lstisaspect@\lst@temp}{#1}%
     \fi}}
\gdef\lst@allkeysandcmds{}
\def\lstprintaspectkeysandcmds#1{%
    \lst@true
    \expandafter\@for\expandafter\lst@temp
    \expandafter:\expandafter=\csname lstaspect@#1\endcsname\do
    {\lst@if\lst@false\else, \fi \texttt{\lst@temp}}}
\def\lstcheckreference{%
   \@for\lst@temp:=\lst@allkeysandcmds\do
   {\ifx\lst@temp\@empty\else
        \@ifundefined{lstkandc@\lst@temp}
        {\typeout{\lst@temp\space not in reference guide?}}{}%
    \fi}}
\newcommand*\lst{\texttt{lst}}
\newcommand*\Cpp{C\texttt{++}}
\let\keyname\texttt
\let\keyvalue\texttt
\let\hookname\texttt
\newcommand*\aspectname[1]{{\normalfont\sffamily#1}}
\DeclareRobustCommand\packagename[1]{%
    {\leavevmode\text@command{#1}%
     \switchfontfamily\sfdefault\rmdefault
     \check@icl #1\check@icr
     \expandafter}}%
\renewcommand\packagename[1]{{\normalfont\sffamily#1}}
\def\switchfontfamily#1#2{%
    \begingroup\xdef\@gtempa{#1}\endgroup
    \ifx\f@family\@gtempa\fontfamily#2%
                    \else\fontfamily#1\fi
    \selectfont}
\ifcolor
    \definecolor{darkgreen}{rgb}{0,0.5,0}
    \def\rstyle{\color{darkgreen}}
\else
    \let\rstyle\empty
\fi
\gdef\lst@emails{}
\newcommand*\lstthanks[2]
    {#1\lst@AddTo\lst@emails{,#1,<#2>}%
     \ifx\@empty#2\@empty\typeout{Missing email for #1}\fi}
\newcommand*\lsthelper[3]
    {{\let~\ #1}%
     \lst@IfOneOf#1\relax\lst@emails
     {}{\typeout{^^JWarning: Unknown helper #1.^^J}}}
\lstdefinelanguage[doc]{Pascal}{%
  morekeywords={alfa,and,array,begin,boolean,byte,case,char,const,div,%
     do,downto,else,end,false,file,for,function,get,goto,if,in,%
     integer,label,maxint,mod,new,not,of,or,pack,packed,page,program,%
     procedure,put,read,readln,real,record,repeat,reset,rewrite,set,%
     text,then,to,true,type,unpack,until,var,while,with,write,writeln},%
  sensitive=false,%
  morecomment=[s]{(*}{*)},%
  morecomment=[s]{\{}{\}},%
  morestring=[d]{'}}
\lstdefinestyle{}
    {basicstyle={},%
     keywordstyle=\bfseries,identifierstyle={},%
     commentstyle=\itshape,stringstyle={},%
     numberstyle={},stepnumber=1,%
     pointstyle=\pointstyle}
\def\pointstyle{%
    {\let\lst@um\@empty \xdef\@gtempa{\the\lst@token}}%
    \expandafter\lstkeyindex\expandafter{\@gtempa}{}%
    \expandafter\lstaspectindex\expandafter{\@gtempa}{}%
    \rstyle}
\lstset{defaultdialect=[doc]Pascal,language=Pascal,style={}}
\def\lstscanlanguages#1#2#3{%
    \begingroup
        \def\lst@DefDriver@##1##2##3##4[##5]##6{%
           \lst@false
           \lst@lAddTo\lst@scan{##6(##5),}%
           \begingroup
           \@ifnextchar[{\lst@XDefDriver{##1}##3}{\lst@DefDriver@@##3}}%
        \def\lst@XXDefDriver[##1]{}%
        \lst@InputCatcodes
        \def\lst@dontinput{#3}%
        \let\lst@scan\@empty
        \lst@for{#2}\do{%
            \lst@IfOneOf##1\relax\lst@dontinput
                {}%
                {\InputIfFileExists{##1}{}{}}}%
        \global\let\@gtempa\lst@scan
    \endgroup
    \let#1\@gtempa}
\def\lstprintlanguages#1{%
    \def\do##1{\setbox\@tempboxa\hbox{##1\space\space}%
        \ifdim\wd\@tempboxa<.5\linewidth \wd\@tempboxa.5\linewidth
                                   \else \wd\@tempboxa\linewidth \fi
        \box\@tempboxa\allowbreak}%
    \begin{quote}
      \par\noindent
      \hyphenpenalty=\@M \rightskip=\z@\@plus\linewidth\relax
      \lst@BubbleSort#1%
      \expandafter\lst@NextLanguage#1\relax(\relax),%
    \end{quote}}
\def\lst@NextLanguage#1(#2),{%
    \ifx\relax#1\else
        \def\lst@language{#1}\def\lst@dialects{(#2),}%
        \expandafter\lst@NextLanguage@
    \fi}
\def\lst@NextLanguage@#1(#2),{%
    \def\lst@temp{#1}%
    \ifx\lst@temp\lst@language
        \lst@lAddTo\lst@dialects{(#2),}%
        \expandafter\lst@NextLanguage@
    \else
        \do{\lst@language
        \ifx\lst@dialects\lst@emptydialect\else
            \expandafter\lst@NormedDef\expandafter\lst@language
                \expandafter{\lst@language}%
            \space(%
            \lst@BubbleSort\lst@dialects
            \expandafter\lst@PrintDialects\lst@dialects(\relax),%
            )%
        \fi}%
        \def\lst@next{\lst@NextLanguage#1(#2),}%
        \expandafter\lst@next
    \fi}
\def\lst@emptydialect{(),}
\def\lst@PrintDialects(#1),{%
    \ifx\@empty#1\@empty empty\else
        \lst@PrintDialect{#1}%
    \fi
    \lst@PrintDialects@}
\def\lst@PrintDialects@(#1),{%
    \ifx\relax#1\else
        , \lst@PrintDialect{#1}%
        \expandafter\lst@PrintDialects@
    \fi}
\def\lst@PrintDialect#1{%
    \lst@NormedDef\lst@temp{#1}%
    \expandafter\ifx\csname\@lst dd@\lst@language\endcsname\lst@temp
        \texttt{\underbar{#1}}%
    \else
        \texttt{#1}%
    \fi}
\def\lst@IfLE#1#2\@empty#3#4\@empty{%
    \ifx #1\relax
        \let\lst@next\@firstoftwo
    \else \ifx #3\relax
        \let\lst@next\@secondoftwo
    \else
        \lowercase{\ifx#1#3}%
            \def\lst@next{\lst@IfLE#2\@empty#4\@empty}%
        \else
            \lowercase{\ifnum`#1<`#3}\relax
                \let\lst@next\@firstoftwo
            \else
                \let\lst@next\@secondoftwo
            \fi
        \fi
    \fi \fi
    \lst@next}
\def\lst@BubbleSort#1{%
    \ifx\@empty#1\else
        \lst@false
        \expandafter\lst@BubbleSort@#1\relax,\relax,%
        \expandafter\lst@BubbleSort@\expandafter,\lst@sorted
                                      \relax,\relax,%
        \let#1\lst@sorted
        \lst@if
            \def\lst@next{\lst@BubbleSort#1}%
            \expandafter\expandafter\expandafter\lst@next
        \fi
    \fi}
\def\lst@BubbleSort@#1,#2,{%
    \ifx\@empty#1\@empty
        \def\lst@sorted{#2,}%
        \def\lst@next{\lst@BubbleSort@@}%
    \else
        \let\lst@sorted\@empty
        \def\lst@next{\lst@BubbleSort@@#1,#2,}%
    \fi
    \lst@next}
\def\lst@BubbleSort@@#1,#2,{%
    \ifx\relax#1\else
        \ifx\relax#2%
            \lst@lAddTo\lst@sorted{#1,}%
            \expandafter\expandafter\expandafter\lst@BubbleSort@@@
        \else
            \lst@IfLE #1\relax\@empty #2\relax\@empty
                          {\lst@lAddTo\lst@sorted{#1,#2,}}%
                {\lst@true \lst@lAddTo\lst@sorted{#2,#1,}}%
            \expandafter\expandafter\expandafter\lst@BubbleSort@@
        \fi
    \fi}
\def\lst@BubbleSort@@@#1\relax,{}
\endinput
%%
%% End of file `lstdoc.sty'.

~~~
###lstlang1.sty

~~~
%%
%% This is file `lstlang1.sty',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% lstdrvrs.dtx  (with options: `lang1')
%% 
%% (w)(c) 1996/1997/1998/1999/2000/2001/2002/2003 Carsten Heinz and/or
%% any other author listed elsewhere in this file.
%%
%% This file is distributed under the terms of the LaTeX Project Public
%% License from CTAN archives in directory  macros/latex/base/lppl.txt.
%% Either version 1.0 or, at your option, any later version.
%%
%% This file is completely free and comes without any warranty.
%%
%% Send comments and ideas on the package, error reports and additional
%% programming languages to <cheinz@gmx.de>.
%%
\ProvidesFile{lstlang1}
    [2003/08/13 1.1a listings language file]
%%
%% ACSL definition (c) 2000 by Andreas Matthias
%%
\lst@definelanguage{ACSL}[90]{Fortran}%
   {morekeywords={algorithm,cinterval,constant,derivative,discrete,%
         dynamic,errtag,initial,interval,maxterval,minterval,%
         merror,xerror,nsteps,procedural,save,schedule,sort,%
         table,terminal,termt,variable},%
    sensitive=false,%
    morecomment=[l]!%
   }[keywords, comments]%
%%
%% Ada 95 definition (c) Torsten Neuer
%%
\lst@definelanguage[95]{Ada}[83]{Ada}%
  {morekeywords={abstract,aliased,protected,requeue,tagged,until}}%
\lst@definelanguage[83]{Ada}%
  {morekeywords={abort,abs,accept,access,all,and,array,at,begin,body,%
      case,constant,declare,delay,delta,digits,do,else,elsif,end,entry,%
      exception,exit,for,function,generic,goto,if,in,is,limited,loop,%
      mod,new,not,null,of,or,others,out,package,pragma,private,%
      procedure,raise,range,record,rem,renames,return,reverse,select,%
      separate,subtype,task,terminate,then,type,use,when,while,with,%
      xor},%
   sensitive=f,%
   morecomment=[l]--,%
   morestring=[m]",% percent not defined as stringizer so far
   morestring=[m]'%
  }[keywords,comments,strings]%
%%
%% awk definitions (c) Christoph Giess
%%
\lst@definelanguage[gnu]{Awk}[POSIX]{Awk}%
  {morekeywords={and,asort,bindtextdomain,compl,dcgettext,gensub,%
      lshift,mktime,or,rshift,strftime,strtonum,systime,xor,extension}%
  }%
\lst@definelanguage[POSIX]{Awk}%
  {keywords={BEGIN,END,close,getline,next,nextfile,print,printf,%
      system,fflush,atan2,cos,exp,int,log,rand,sin,sqrt,srand,gsub,%
      index,length,match,split,sprintf,strtonum,sub,substr,tolower,%
      toupper,if,while,do,for,break,continue,delete,exit,function,%
      return},%
   sensitive,%
   morecomment=[l]\#,%
   morecomment=[l]//,%
   morecomment=[s]{/*}{*/},%
   morestring=[b]"%
  }[keywords,comments,strings]%
%%
%% Visual Basic definition (c) 2002 Robert Frank
%%
\lst@definelanguage[Visual]{Basic}
  {morekeywords={Abs,Array,Asc,AscB,AscW,Atn,Avg,CBool,CByte,CCur,%
      CDate,CDbl,Cdec,Choose,Chr,ChrB,ChrW,CInt,CLng,Command,Cos,%
      Count,CreateObject,CSng,CStr,CurDir,CVar,CVDate,CVErr,Date,%
      DateAdd,DateDiff,DatePart,DateSerial,DateValue,Day,DDB,Dir,%
      DoEvents,Environ,EOF,Error,Exp,FileAttr,FileDateTime,FileLen,%
      Fix,Format,FreeFile,FV,GetAllStrings,GetAttr,%
      GetAutoServerSettings,GetObject,GetSetting,Hex,Hour,IIf,%
      IMEStatus,Input,InputB,InputBox,InStr,InstB,Int,Integer,IPmt,%
      IsArray,IsDate,IsEmpty,IsError,IsMissing,IsNull,IsNumeric,%
      IsObject,LBound,LCase,Left,LeftB,Len,LenB,LoadPicture,Loc,LOF,%
      Log,Ltrim,Max,Mid,MidB,Min,Minute,MIRR,Month,MsgBox,Now,NPer,%
      NPV,Oct,Partition,Pmt,PPmt,PV,QBColor,Rate,RGB,Right,RightB,Rnd,%
      Rtrim,Second,Seek,Sgn,Shell,Sin,SLN,Space,Spc,Sqr,StDev,StDevP,%
      Str,StrComp,StrConv,String,Switch,Sum,SYD,Tab,Tan,Time,Timer,%
      TimeSerial,TimeValue,Trim,TypeName,UBound,Ucase,Val,Var,VarP,%
      VarType,Weekday,Year},% functions
   morekeywords=[2]{Accept,Activate,Add,AddCustom,AddFile,AddFromFile,%
      AddFromTemplate,AddItem,AddNew,AddToAddInToolbar,%
      AddToolboxProgID,Append,AppendChunk,Arrange,Assert,AsyncRead,%
      BatchUpdate,BeginTrans,Bind,Cancel,CancelAsyncRead,CancelBatch,%
      CancelUpdate,CanPropertyChange,CaptureImage,CellText,CellValue,%
      Circle,Clear,ClearFields,ClearSel,ClearSelCols,Clone,Close,Cls,%
      ColContaining,ColumnSize,CommitTrans,CompactDatabase,Compose,%
      Connect,Copy,CopyQueryDef,CreateDatabase,CreateDragImage,%
      CreateEmbed,CreateField,CreateGroup,CreateIndex,CreateLink,%
      CreatePreparedStatement,CreatePropery,CreateQuery,%
      CreateQueryDef,CreateRelation,CreateTableDef,CreateUser,%
      CreateWorkspace,Customize,Delete,DeleteColumnLabels,%
      DeleteColumns,DeleteRowLabels,DeleteRows,DoVerb,Drag,Draw,Edit,%
      EditCopy,EditPaste,EndDoc,EnsureVisible,EstablishConnection,%
      Execute,ExtractIcon,Fetch,FetchVerbs,Files,FillCache,Find,%
      FindFirst,FindItem,FindLast,FindNext,FindPrevious,Forward,%
      GetBookmark,GetChunk,GetClipString,GetData,GetFirstVisible,%
      GetFormat,GetHeader,GetLineFromChar,GetNumTicks,GetRows,%
      GetSelectedPart,GetText,GetVisibleCount,GoBack,GoForward,Hide,%
      HitTest,HoldFields,Idle,InitializeLabels,InsertColumnLabels,%
      InsertColumns,InsertObjDlg,InsertRowLabels,InsertRows,Item,%
      KillDoc,Layout,Line,LinkExecute,LinkPoke,LinkRequest,LinkSend,%
      Listen,LoadFile,LoadResData,LoadResPicture,LoadResString,%
      LogEvent,MakeCompileFile,MakeReplica,MoreResults,Move,MoveData,%
      MoveFirst,MoveLast,MoveNext,MovePrevious,NavigateTo,NewPage,%
      NewPassword,NextRecordset,OLEDrag,OnAddinsUpdate,OnConnection,%
      OnDisconnection,OnStartupComplete,Open,OpenConnection,%
      OpenDatabase,OpenQueryDef,OpenRecordset,OpenResultset,OpenURL,%
      Overlay,PaintPicture,Paste,PastSpecialDlg,PeekData,Play,Point,%
      PopulatePartial,PopupMenu,Print,PrintForm,PropertyChanged,Pset,%
      Quit,Raise,RandomDataFill,RandomFillColumns,RandomFillRows,%
      rdoCreateEnvironment,rdoRegisterDataSource,ReadFromFile,%
      ReadProperty,Rebind,ReFill,Refresh,RefreshLink,RegisterDatabase,%
      Reload,Remove,RemoveAddInFromToolbar,RemoveItem,Render,%
      RepairDatabase,Reply,ReplyAll,Requery,ResetCustom,%
      ResetCustomLabel,ResolveName,RestoreToolbar,Resync,Rollback,%
      RollbackTrans,RowBookmark,RowContaining,RowTop,Save,SaveAs,%
      SaveFile,SaveToFile,SaveToolbar,SaveToOle1File,Scale,ScaleX,%
      ScaleY,Scroll,Select,SelectAll,SelectPart,SelPrint,Send,%
      SendData,Set,SetAutoServerSettings,SetData,SetFocus,SetOption,%
      SetSize,SetText,SetViewport,Show,ShowColor,ShowFont,ShowHelp,%
      ShowOpen,ShowPrinter,ShowSave,ShowWhatsThis,SignOff,SignOn,Size,%
      Span,SplitContaining,StartLabelEdit,StartLogging,Stop,%
      Synchronize,TextHeight,TextWidth,ToDefaults,TwipsToChartPart,%
      TypeByChartType,Update,UpdateControls,UpdateRecord,UpdateRow,%
      Upto,WhatsThisMode,WriteProperty,ZOrder},% methods
   morekeywords=[3]{AccessKeyPress,AfterAddFile,AfterChangeFileName,%
      AfterCloseFile,AfterColEdit,AfterColUpdate,AfterDelete,%
      AfterInsert,AfterLabelEdit,AfterRemoveFile,AfterUpdate,%
      AfterWriteFile,AmbienChanged,ApplyChanges,Associate,%
      AsyncReadComplete,AxisActivated,AxisLabelActivated,%
      AxisLabelSelected,AxisLabelUpdated,AxisSelected,%
      AxisTitleActivated,AxisTitleSelected,AxisTitleUpdated,%
      AxisUpdated,BeforeClick,BeforeColEdit,BeforeColUpdate,%
      BeforeConnect,BeforeDelete,BeforeInsert,BeforeLabelEdit,%
      BeforeLoadFile,BeforeUpdate,ButtonClick,ButtonCompleted,%
      ButtonGotFocus,ButtonLostFocus,Change,ChartActivated,%
      ChartSelected,ChartUpdated,Click,ColEdit,Collapse,ColResize,%
      ColumnClick,Compare,ConfigChageCancelled,ConfigChanged,%
      ConnectionRequest,DataArrival,DataChanged,DataUpdated,DblClick,%
      Deactivate,DeviceArrival,DeviceOtherEvent,DeviceQueryRemove,%
      DeviceQueryRemoveFailed,DeviceRemoveComplete,DeviceRemovePending,%
      DevModeChange,Disconnect,DisplayChanged,Dissociate,%
      DoGetNewFileName,Done,DonePainting,DownClick,DragDrop,DragOver,%
      DropDown,EditProperty,EnterCell,EnterFocus,Event,ExitFocus,%
      Expand,FootnoteActivated,FootnoteSelected,FootnoteUpdated,%
      GotFocus,HeadClick,InfoMessage,Initialize,IniProperties,%
      ItemActivated,ItemAdded,ItemCheck,ItemClick,ItemReloaded,%
      ItemRemoved,ItemRenamed,ItemSeletected,KeyDown,KeyPress,KeyUp,%
      LeaveCell,LegendActivated,LegendSelected,LegendUpdated,%
      LinkClose,LinkError,LinkNotify,LinkOpen,Load,LostFocus,%
      MouseDown,MouseMove,MouseUp,NodeClick,ObjectMove,%
      OLECompleteDrag,OLEDragDrop,OLEDragOver,OLEGiveFeedback,%
      OLESetData,OLEStartDrag,OnAddNew,OnComm,Paint,PanelClick,%
      PanelDblClick,PathChange,PatternChange,PlotActivated,%
      PlotSelected,PlotUpdated,PointActivated,PointLabelActivated,%
      PointLabelSelected,PointLabelUpdated,PointSelected,%
      PointUpdated,PowerQuerySuspend,PowerResume,PowerStatusChanged,%
      PowerSuspend,QueryChangeConfig,QueryComplete,QueryCompleted,%
      QueryTimeout,QueryUnload,ReadProperties,Reposition,%
      RequestChangeFileName,RequestWriteFile,Resize,ResultsChanged,%
      RowColChange,RowCurrencyChange,RowResize,RowStatusChanged,%
      SelChange,SelectionChanged,SendComplete,SendProgress,%
      SeriesActivated,SeriesSelected,SeriesUpdated,SettingChanged,%
      SplitChange,StateChanged,StatusUpdate,SysColorsChanged,%
      Terminate,TimeChanged,TitleActivated,TitleSelected,%
      TitleActivated,UnboundAddData,UnboundDeleteRow,%
      UnboundGetRelativeBookmark,UnboundReadData,UnboundWriteData,%
      Unload,UpClick,Updated,Validate,ValidationError,WillAssociate,%
      WillChangeData,WillDissociate,WillExecute,WillUpdateRows,%
      WithEvents,WriteProperties},% VB-events
   morekeywords=[4]{AppActivate,Base,Beep,Call,Case,ChDir,ChDrive,%
      Const,Declare,DefBool,DefByte,DefCur,DefDate,DefDbl,DefDec,%
      DefInt,DefLng,DefObj,DefSng,DefStr,Deftype,DefVar,DeleteSetting,%
      Dim,Do,Else,ElseIf,End,Enum,Erase,Event,Exit,Explicit,FileCopy,%
      For,ForEach,Friend,Function,Get,GoSub,GoTo,If,Implements,Kill,%
      Let,LineInput,Lock,Lset,MkDir,Name,Next,OnError,On,Option,%
      Private,Property,Public,Put,RaiseEvent,Randomize,ReDim,Rem,%
      Reset,Resume,Return,RmDir,Rset,SavePicture,SaveSetting,%
      SendKeys,SetAttr,Static,Sub,Then,Type,Unlock,Wend,While,Width,%
      With,Write},% statements
   sensitive=false,%
   keywordcomment=rem,%
   MoreSelectCharTable=\def\lst@BeginKC@{% chmod
      \lst@ResetToken
      \lst@BeginComment\lst@GPmode{{\lst@commentstyle}%
                       \lst@Lmodetrue\lst@modetrue}\@empty},%
   morecomment=[l]{'},%
   morecomment=[s]{/*}{*/},%
   morestring=[b]",%
   }[keywords,comments,strings,keywordcomments]
\lst@definelanguage[ANSI]{C++}[ISO]{C++}{}%
\lst@definelanguage[GNU]{C++}[ISO]{C++}%
  {morekeywords={__attribute__,__extension__,__restrict,__restrict__,%
      typeof,__typeof__},%
  }%
\lst@definelanguage[Visual]{C++}[ISO]{C++}%
  {morekeywords={__asm,__based,__cdecl,__declspec,dllexport,%
      dllimport,__except,__fastcall,__finally,__inline,__int8,__int16,%
      __int32,__int64,naked,__stdcall,thread,__try,__leave},%
  }%
\lst@definelanguage[ISO]{C++}[ANSI]{C}%
  {morekeywords={and,and_eq,asm,bad_cast,bad_typeid,bitand,bitor,bool,%
      catch,class,compl,const_cast,delete,dynamic_cast,explicit,export,%
      false,friend,inline,mutable,namespace,new,not,not_eq,operator,or,%
      or_eq,private,protected,public,reinterpret_cast,static_cast,%
      template,this,throw,true,try,typeid,type_info,typename,using,%
      virtual,wchar_t,xor,xor_eq},%
  }%
%%
%% Objective-C definition (c) 1997 Detlev Droege
%%
\lst@definelanguage[Objective]{C}[ANSI]{C}
  {morekeywords={bycopy,id,in,inout,oneway,out,self,super,%
      @class,@defs,@encode,@end,@implementation,@interface,@private,%
      @protected,@protocol,@public,@selector},%
   moredirectives={import}%
  }%
\lst@definelanguage[ANSI]{C}%
  {morekeywords={auto,break,case,char,const,continue,default,do,double,%
      else,enum,extern,float,for,goto,if,int,long,register,return,%
      short,signed,sizeof,static,struct,switch,typedef,union,unsigned,%
      void,volatile,while},%
   sensitive,%
   morecomment=[s]{/*}{*/},%
   morecomment=[l]//,% nonstandard
   morestring=[b]",%
   morestring=[b]',%
   moredelim=*[directive]\#,%
   moredirectives={define,elif,else,endif,error,if,ifdef,ifndef,line,%
      include,pragma,undef,warning}%
  }[keywords,comments,strings,directives]%
%%
%% C-Sharp definition (c) 2002 Martin Brodbeck
%%
\lst@definelanguage[Sharp]{C}%
  {morekeywords={abstract,base,bool,break,byte,case,catch,char,checked,%
      class,const,continue,decimal,default,delegate,do,double,else,%
      enum,event,explicit,extern,false,finally,fixed,float,for,foreach,%
      goto,if,implicit,in,int,interface,internal,is,lock,long,%
      namespace,new,null,object,operator,out,override,params,private,%
      protected,public,readonly,ref,return,sbyte,sealed,short,sizeof,%
      static,string,struct,switch,this,throw,true,try,typeof,uint,%
      ulong,unchecked,unsafe,ushort,using,virtual,void,while},%
   sensitive,%
   morecomment=[s]{/*}{*/},%
   morecomment=[l]//,%
   morestring=[b]"
  }[keywords,comments,strings]%
%%
%% csh definition (c) 1998 Kai Below
%%
\lst@definelanguage{csh}
  {morekeywords={alias,awk,cat,echo,else,end,endif,endsw,exec,exit,%
      foreach,glob,goto,history,if,logout,nice,nohup,onintr,repeat,sed,%
      set,setenv,shift,source,switch,then,time,while,umask,unalias,%
      unset,wait,while,@,env,argv,child,home,ignoreeof,noclobber,%
      noglob,nomatch,path,prompt,shell,status,verbose,print,printf,%
      sqrt,BEGIN,END},%
   morecomment=[l]\#,%
   morestring=[d]"%
  }[keywords,comments,strings]%
\lst@definelanguage[90]{Fortran}[95]{Fortran}{}
\lst@definelanguage[95]{Fortran}[77]{Fortran}%
  {deletekeywords=SAVE,%
   morekeywords={ACTION,ADVANCE,ALLOCATE,ALLOCATABLE,ASSIGNMENT,CASE,%
      CONTAINS,CYCLE,DEALLOCATE,DEFAULT,DELIM,EXIT,INCLUDE,IN,NONE,IN,%
      OUT,INTENT,INTERFACE,IOLENGTH,KIND,LEN,MODULE,NAME,NAMELIST,NMT,%
      NULLIFY,ONLY,OPERATOR,OPTIONAL,OUT,PAD,POINTER,POSITION,PRIVATE,%
      PUBLIC,READWRITE,RECURSIVE,RESULT,SELECT,SEQUENCE,SIZE,STAT,%
      TARGET,USE,WHERE,WHILE,BLOCKDATA,DOUBLEPRECISION,ELSEIF,%
      ENDBLOCKDATA,ENDDO,ENDFILE,ENDFUNCTION,ENDIF,ENDINTERFACE,%
      ENDMODULE,ENDPROGRAM,ENDSELECT,ENDSUBROUTINE,ENDTYPE,ENDWHERE,%
      GOTO,INOUT,SELECTCASE},%
   deletecomment=[f],% no fixed comment line: 1998 Magne Rudshaug
   morecomment=[l]!%
  }%
\lst@definelanguage[77]{Fortran}%
  {morekeywords={ACCESS,ASSIGN,BACKSPACE,BLANK,BLOCK,CALL,CHARACTER,%
      CLOSE,COMMON,COMPLEX,CONTINUE,DATA,DIMENSION,DIRECT,DO,DOUBLE,%
      ELSE,END,ENTRY,EOF,EQUIVALENCE,ERR,EXIST,EXTERNAL,FILE,FMT,FORM,%
      FORMAT,FORMATTED,FUNCTION,GO,TO,IF,IMPLICIT,INQUIRE,INTEGER,%
      INTRINSIC,IOSTAT,LOGICAL,NAMED,NEXTREC,NUMBER,OPEN,OPENED,%
      PARAMETER,PAUSE,PRECISION,PRINT,PROGRAM,READ,REAL,REC,RECL,%
      RETURN,REWIND,SEQUENTIAL,STATUS,STOP,SUBROUTINE,THEN,TYPE,%
      UNFORMATTED,UNIT,WRITE,SAVE},%
   sensitive=f,%% not Fortran standard %%
   morecomment=[f]*,%
   morecomment=[f]C,%
   morecomment=[f]c,%
   morestring=[d]"%
  }[keywords,comments,strings]%
\lst@definelanguage{HTML}%
  {morekeywords={A,ADDRESS,APPLET,B,BASE,BASEFONT,BIG,BLOCKQUOTE,BODY,%
      BR,CENTER,CITE,CODE,DFN,DIR,DIV,DOCTYPE,EM,FONT,FORM,HEAD,HR,%
      H1,H2,H3,H4,H5,H6,HTML,I,IMG,INPUT,ISINDEX,KBD,LI,LINK,LISTING,%
      MAP,META,MENU,P,PLAINTEXT,PRE,OL,SAMP,SCRIPT,SELECT,SMALL,STRIKE,%
      STRING,SUB,SUP,STYLE,TABLE,TEXTAREA,TITLE,TT,U,UL,VAR,XMP,%
      action,align,alink,alt,background,bgcolor,border,cellpadding,%
      cellspacing,checked,code,codebase,color,cols,colspan,entype,%
      height,href,hspace,ismap,link,maxlength,method,multiple,name,%
      noshade,nowrap,rel,rev,rows,rowspan,selected,shape,size,src,text,%
      title,type,usemap,valign,value,vlink,vspace,width},%
   tag=**[s]<>,%
   sensitive=f,%
   morestring=[d]",% ??? doubled
   MoreSelectCharTable=%
      \lst@CArgX--\relax\lst@DefDelimB{}{}%
          {\ifnum\lst@mode=\lst@tagmode\else
               \expandafter\@gobblethree
           \fi}%
          \lst@BeginComment\lst@commentmode{{\lst@commentstyle}}%
      \lst@CArgX--\relax\lst@DefDelimE{}{}{}%
          \lst@EndComment\lst@commentmode
  }[keywords,comments,strings,html]%
%%
%% AspectJ definition (c) Robert Wenner
%%
\lst@definelanguage[AspectJ]{Java}[]{Java}%
  {morekeywords={%
      adviceexecution,after,args,around,aspect,aspectOf,before,%
      call,cflow,cflowbelow,%
      execution,get,handler,if,initialization,issingleton,pointcut,%
      percflow,percflowbelow,perthis,pertarget,preinitialization,%
      privileged,proceed,returning,set,staticinitialization,strictfp,%
      target,this,thisEnclosingJoinPoint,thisJoinPoint,throwing,%
      within,withincode}%
  }%
\lst@definelanguage{Java}%
  {morekeywords={abstract,boolean,break,byte,case,catch,char,class,%
      const,continue,default,do,double,else,extends,false,final,%
      finally,float,for,goto,if,implements,import,instanceof,int,%
      interface,label,long,native,new,null,package,private,protected,%
      public,return,short,static,super,switch,synchronized,this,throw,%
      throws,transient,true,try,void,volatile,while},%
   sensitive,%
   morecomment=[l]//,%
   morecomment=[s]{/*}{*/},%
   morestring=[b]",%
   morestring=[b]',%
  }[keywords,comments,strings]%
\lst@definelanguage{Matlab}%
  {morekeywords={gt,lt,gt,lt,amp,abs,acos,acosh,acot,acoth,acsc,acsch,%
      all,angle,ans,any,asec,asech,asin,asinh,atan,atan2,atanh,auread,%
      auwrite,axes,axis,balance,bar,bessel,besselk,bessely,beta,%
      betainc,betaln,blanks,bone,break,brighten,capture,cart2pol,%
      cart2sph,caxis,cd,cdf2rdf,cedit,ceil,chol,cla,clabel,clc,clear,%
      clf,clock,close,colmmd,Colon,colorbar,colormap,ColorSpec,colperm,%
      comet,comet3,compan,compass,computer,cond,condest,conj,contour,%
      contour3,contourc,contrast,conv,conv2,cool,copper,corrcoef,cos,%
      cosh,cot,coth,cov,cplxpair,cputime,cross,csc,csch,csvread,%
      csvwrite,cumprod,cumsum,cylinder,date,dbclear,dbcont,dbdown,%
      dbquit,dbstack,dbstatus,dbstep,dbstop,dbtype,dbup,ddeadv,ddeexec,%
      ddeinit,ddepoke,ddereq,ddeterm,ddeunadv,deblank,dec2hex,deconv,%
      del2,delete,demo,det,diag,diary,diff,diffuse,dir,disp,dlmread,%
      dlmwrite,dmperm,dot,drawnow,echo,eig,ellipj,ellipke,else,elseif,%
      end,engClose,engEvalString,engGetFull,engGetMatrix,engOpen,%
      engOutputBuffer,engPutFull,engPutMatrix,engSetEvalCallback,%
      engSetEvalTimeout,engWinInit,eps,erf,erfc,erfcx,erfinv,error,%
      errorbar,etime,etree,eval,exist,exp,expint,expm,expo,eye,fclose,%
      feather,feof,ferror,feval,fft,fft2,fftshift,fgetl,fgets,figure,%
      fill,fill3,filter,filter2,find,findstr,finite,fix,flag,fliplr,%
      flipud,floor,flops,fmin,fmins,fopen,for,format,fplot,fprintf,%
      fread,frewind,fscanf,fseek,ftell,full,function,funm,fwrite,fzero,%
      gallery,gamma,gammainc,gammaln,gca,gcd,gcf,gco,get,getenv,%
      getframe,ginput,global,gplot,gradient,gray,graymon,grid,griddata,%
      gtext,hadamard,hankel,help,hess,hex2dec,hex2num,hidden,hilb,hist,%
      hold,home,hostid,hot,hsv,hsv2rgb,if,ifft,ifft2,imag,image,%
      imagesc,Inf,info,input,int2str,interp1,interp2,interpft,inv,%
      invhilb,isempty,isglobal,ishold,isieee,isinf,isletter,isnan,%
      isreal,isspace,issparse,isstr,jet,keyboard,kron,lasterr,lcm,%
      legend,legendre,length,lin2mu,line,linspace,load,log,log10,log2,%
      loglog,logm,logspace,lookfor,lower,ls,lscov,lu,magic,matClose,%
      matDeleteMatrix,matGetDir,matGetFp,matGetFull,matGetMatrix,%
      matGetNextMatrix,matGetString,matlabrc,matlabroot,matOpen,%
      matPutFull,matPutMatrix,matPutString,max,mean,median,menu,mesh,%
      meshc,meshgrid,meshz,mexAtExit,mexCallMATLAB,mexdebug,%
      mexErrMsgTxt,mexEvalString,mexFunction,mexGetFull,mexGetMatrix,%
      mexGetMatrixPtr,mexPrintf,mexPutFull,mexPutMatrix,mexSetTrapFlag,%
      min,more,movie,moviein,mu2lin,mxCalloc,mxCopyCharacterToPtr,%
      mxCopyComplex16ToPtr,mxCopyInteger4ToPtr,mxCopyPtrToCharacter,%
      mxCopyPtrToComplex16,mxCopyPtrToInteger4,mxCopyPtrToReal8,%
      mxCopyReal8ToPtr,mxCreateFull,mxCreateSparse,mxCreateString,%
      mxFree,mxFreeMatrix,mxGetIr,mxGetJc,mxGetM,mxGetN,mxGetName,%
      mxGetNzmax,mxGetPi,mxGetPr,mxGetScalar,mxGetString,mxIsComplex,%
      mxIsFull,mxIsNumeric,mxIsSparse,mxIsString,mxIsTypeDouble,%
      mxSetIr,mxSetJc,mxSetM,mxSetN,mxSetName,mxSetNzmax,mxSetPi,%
      mxSetPr,NaN,nargchk,nargin,nargout,newplot,nextpow2,nnls,nnz,%
      nonzeros,norm,normest,null,num2str,nzmax,ode23,ode45,orient,orth,%
      pack,pascal,patch,path,pause,pcolor,pi,pink,pinv,plot,plot3,%
      pol2cart,polar,poly,polyder,polyeig,polyfit,polyval,polyvalm,%
      pow2,print,printopt,prism,prod,pwd,qr,qrdelete,qrinsert,quad,%
      quad8,quit,quiver,qz,rand,randn,randperm,rank,rat,rats,rbbox,%
      rcond,real,realmax,realmin,refresh,rem,reset,reshape,residue,%
      return,rgb2hsv,rgbplot,rootobject,roots,rose,rosser,rot90,rotate,%
      round,rref,rrefmovie,rsf2csf,save,saxis,schur,sec,sech,semilogx,%
      semilogy,set,setstr,shading,sign,sin,sinh,size,slice,sort,sound,%
      spalloc,sparse,spaugment,spconvert,spdiags,specular,speye,spfun,%
      sph2cart,sphere,spinmap,spline,spones,spparms,sprandn,sprandsym,%
      sprank,sprintf,spy,sqrt,sqrtm,sscanf,stairs,startup,std,stem,%
      str2mat,str2num,strcmp,strings,strrep,strtok,subplot,subscribe,%
      subspace,sum,surf,surface,surfc,surfl,surfnorm,svd,symbfact,%
      symmmd,symrcm,tan,tanh,tempdir,tempname,terminal,text,tic,title,%
      toc,toeplitz,trace,trapz,tril,triu,type,uicontrol,uigetfile,%
      uimenu,uiputfile,unix,unwrap,upper,vander,ver,version,view,%
      viewmtx,waitforbuttonpress,waterfall,wavread,wavwrite,what,%
      whatsnew,which,while,white,whitebg,who,whos,wilkinson,wk1read,%
      wk1write,xlabel,xor,ylabel,zeros,zlabel,zoom},%
   sensitive,%
   morecomment=[l]\%,%
   morestring=[m]'%
  }[keywords,comments,strings]%
%%
%% Mathematica definitions (c) 1999 Michael Wiese
%%
\lst@definelanguage[3.0]{Mathematica}[1.0]{Mathematica}%
  {morekeywords={Abort,AbortProtect,AbsoluteDashing,AbsolutePointSize,%
      AbsoluteThickness,AbsoluteTime,AccountingFormAiry,AiPrime,AiryBi,%
      AiryBiPrime,Alternatives,AnchoredSearch,AxesEdge,AxesOrigin,%
      AxesStyle,Background,BetaRegularized,BoxStyle,C,CheckAbort,%
      Circle,ClebschGordan,CMYKColor,ColorFunction,ColorOutput,Compile,%
      Compiled,CompiledFunction,ComplexExpand,ComposeList,Composition,%
      ConstrainedMax,ConstrainedMin,Contexts,ContextToFilename,%
      ContourLines,Contours,ContourShading,ContourSmoothing,%
      ContourStyle,CopyDirectory,CopyFile,CosIntegral,CreateDirectory,%
      Cuboid,Date,DeclarePackage,DefaultColor,DefaultFont,Delete,%
      DeleteCases,DeleteDirectory,DeleteFile,Dialog,DialogIndent,%
      DialogProlog,DialogSymbols,DigitQ,Directory,DirectoryStack,Disk,%
      Dispatch,DownValues,DSolve,Encode,Epilog,Erfc,Evaluate,%
      ExponentFunction,FaceGrids,FileByteCount,FileDate,FileNames,%
      FileType,Find,FindList,FixedPointList,FlattenAt,Fold,FoldList,%
      Frame,FrameLabel,FrameStyle,FrameTicks,FromCharacterCode,%
      FromDate,FullGraphics,FullOptions,GammaRegularized,%
      GaussianIntegers,GraphicsArray,GraphicsSpacing,GridLines,%
      GroebnerBasis,Heads,HeldPart,HomeDirectory,Hue,IgnoreCases,%
      InputStream,Install,InString,IntegerDigits,InterpolatingFunction,%
      InterpolatingPolynomial,Interpolation,Interrupt,InverseFunction,%
      InverseFunctions,JacobiZeta,LetterQ,LinearProgramming,ListPlay,%
      LogGamma,LowerCaseQ,MachineNumberQ,MantissaExponent,MapIndexed,%
      MapThread,MatchLocalNames,MatrixExp,MatrixPower,MeshRange,%
      MeshStyle,MessageList,Module,NDSolve,NSolve,NullRecords,%
      NullWords,NumberFormat,NumberPadding,NumberSigns,OutputStream,%
      PaddedForm,ParentDirectory,Pause,Play,PlayRange,PlotRegion,%
      PolygonIntersections,PolynomialGCD,PolynomialLCM,PolynomialMod,%
      PostScript,PowerExpand,PrecisionGoal,PrimePi,Prolog,%
      QRDecomposition,Raster,RasterArray,RealDigits,Record,RecordLists,%
      RecordSeparators,ReleaseHold,RenameDirectory,RenameFile,%
      ReplaceHeldPart,ReplacePart,ResetDirectory,Residue,%
      RiemannSiegelTheta,RiemannSiegelZ,RotateLabel,SameTest,%
      SampleDepth,SampledSoundFunction,SampledSoundList,SampleRate,%
      SchurDecomposition,SessionTime,SetAccuracy,SetDirectory,%
      SetFileDate,SetPrecision,SetStreamPosition,Shallow,SignPadding,%
      SinIntegral,SixJSymbol,Skip,Sound,SpellingCorrection,%
      SphericalRegion,Stack,StackBegin,StackComplete,StackInhibit,%
      StreamPosition,Streams,StringByteCount,StringConversion,%
      StringDrop,StringInsert,StringPosition,StringReplace,%
      StringReverse,StringTake,StringToStream,SurfaceColor,%
      SyntaxLength,SyntaxQ,TableAlignments,TableDepth,%
      TableDirections,TableHeadings,TableSpacing,ThreeJSymbol,TimeUsed,%
      TimeZone,ToCharacterCode,ToDate,ToHeldExpression,TokenWords,%
      ToLowerCase,ToUpperCase,Trace,TraceAbove,TraceBackward,%
      TraceDepth,TraceDialog,TraceForward,TraceOff,TraceOn,%
      TraceOriginal,TracePrint,TraceScan,Trig,Unevaluated,Uninstall,%
      UnsameQ,UpperCaseQ,UpValues,ViewCenter,ViewVertical,With,Word,%
      WordSearch,WordSeparators},%
    morendkeywords={Stub,Temporary,$Aborted,$BatchInput,$BatchOutput,%
      $CreationDate,$DefaultFont,$DumpDates,$DumpSupported,$Failed,%
      $Input,$Inspector,$IterationLimit,$Language,$Letters,$Linked,%
      $LinkSupported,$MachineEpsilon,$MachineID,$MachineName,%
      $MachinePrecision,$MachineType,$MaxMachineNumber,$MessageList,%
      $MessagePrePrint,$MinMachineNumber,$ModuleNumber,$NewMessage,%
      $NewSymbol,$Notebooks,$OperatingSystem,$Packages,$PipeSupported,%
      $PreRead,$ReleaseNumber,$SessionID,$SoundDisplayFunction,%
      $StringConversion,$StringOrder,$SyntaxHandler,$TimeUnit,%
      $VersionNumber}%
  }%
\lst@definelanguage[1.0]{Mathematica}%
  {morekeywords={Abs,Accuracy,AccurayGoal,AddTo,AiryAi,AlgebraicRules,%
      AmbientLight,And,Apart,Append,AppendTo,Apply,ArcCos,ArcCosh,%
      ArcCot,ArcCoth,ArcCsc,ArcCsch,ArcSec,ArcSech,ArcSin,ArcSinh,%
      ArcTan,ArcTanh,Arg,ArithmeticGeometricMean,Array,AspectRatio,%
      AtomQ,Attributes,Axes,AxesLabel,BaseForm,Begin,BeginPackage,%
      BernoulliB,BesselI,BesselJ,BesselK,BesselY,Beta,Binomial,Blank,%
      BlankNullSequence,BlankSequence,Block,Boxed,BoxRatios,Break,Byte,%
      ByteCount,Cancel,Cases,Catch,Ceiling,CForm,Character,Characters,%
      ChebyshevT,ChebyshevU,Check,Chop,Clear,ClearAll,ClearAttributes,%
      ClipFill,Close,Coefficient,CoefficientList,Collect,ColumnForm,%
      Complement,Complex,CompoundExpression,Condition,Conjugate,%
      Constants,Context,Continuation,Continue,ContourGraphics,%
      ContourPlot,Cos,Cosh,Cot,Coth,Count,Csc,Csch,Cubics,Cyclotomic,%
      D,Dashing,Decompose,Decrement,Default,Definition,Denominator,%
      DensityGraphics,DensityPlot,Depth,Derivative,Det,DiagonalMatrix,%
      DigitBlock,Dimensions,DirectedInfinity,Display,DisplayFunction,%
      Distribute,Divide,DivideBy,Divisors,DivisorSigma,Do,Dot,Drop,Dt,%
      Dump,EdgeForm,Eigensystem,Eigenvalues,Eigenvectors,Eliminate,%
      EllipticE,EllipticExp,EllipticF,EllipticK,EllipticLog,EllipticPi,%
      EllipticTheta,End,EndPackage,EngineeringForm,Environment,Equal,%
      Erf,EulerE,EulerPhi,EvenQ,Exit,Exp,Expand,ExpandAll,%
      ExpandDenominator,ExpandNumerator,ExpIntegralE,ExpIntegralEi,%
      Exponent,Expression,ExtendedGCD,FaceForm,Factor,FactorComplete,%
      Factorial,Factorial2,FactorInteger,FactorList,FactorSquareFree,%
      FactorSquareFreeList,FactorTerms,FactorTermsList,FindMinimum,%
      FindRoot,First,Fit,FixedPoint,Flatten,Floor,FontForm,For,Format,%
      FormatType,FortranForm,Fourier,FreeQ,FullDefinition,FullForm,%
      Function,Gamma,GCD,GegenbauerC,General,Get,Goto,Graphics,%
      Graphics3D,GrayLevel,Greater,GreaterEqual,Head,HermiteH,%
      HiddenSurface,Hold,HoldForm,Hypergeometric0F1, Hypergeometric1F1,%
      Hypergeometric2F1,HypergeometricU,Identity,IdentityMatrix,If,Im,%
      Implies,In,Increment,Indent,Infix,Information,Inner,Input,%
      InputForm,InputString,Insert,Integer,IntegerQ,Integrate,%
      Intersection,Inverse,InverseFourier,InverseJacobiSN,%
      InverseSeries,JacobiAmplitude,JacobiP,JacobiSN,JacobiSymbol,Join,%
      Label,LaguerreL,Last,LatticeReduce,LCM,LeafCount,LegendreP,%
      LegendreQ,LegendreType,Length,LerchPhi,Less,LessEqual,Level,%
      Lighting,LightSources,Limit,Line,LinearSolve,LineBreak,List,%
      ListContourPlot,ListDensityPlot,ListPlot,ListPlot3D,Literal,Log,%
      LogicalExpand,LogIntegral,MainSolve,Map,MapAll,MapAt,MatchQ,%
      MatrixForm,MatrixQ,Max,MaxBend,MaxMemoryUsed,MemberQ,%
      MemoryConstrained,MemoryInUse,Mesh,Message,MessageName,Messages,%
      Min,Minors,Minus,Mod,Modulus,MoebiusMu,Multinomial,N,NameQ,Names,%
      NBernoulliB,Needs,Negative,Nest,NestList,NIntegrate,%
      NonCommutativeMultiply,NonConstants,NonNegative,Normal,Not,%
      NProduct,NSum,NullSpace,Number,NumberForm,NumberPoint,NumberQ,%
      NumberSeparator,Numerator,O,OddQ,Off,On,OpenAppend,OpenRead,%
      OpenTemporary,OpenWrite,Operate,Optional,Options,Or,Order,%
      OrderedQ,Out,Outer,OutputForm,PageHeight,PageWidth,%
      ParametricPlot,ParametricPlot3D,Part,Partition,PartitionsP,%
      PartitionsQ,Pattern,Permutations,Plot,Plot3D,PlotDivision,%
      PlotJoined,PlotLabel,PlotPoints,PlotRange,PlotStyle,Pochhammer,%
      Plus,Point,PointSize,PolyGamma,Polygon,PolyLog,PolynomialQ,%
      PolynomialQuotient,PolynomialRemainder,Position,Positive,Postfix,%
      Power,PowerMod,PrecedenceForm,Precision,PreDecrement,Prefix,%
      PreIncrement,Prepend,PrependTo,Prime,PrimeQ,Print,PrintForm,%
      Product,Protect,PseudoInverse,Put,PutAppend,Quartics,Quit,%
      Quotient,Random,Range,Rational,Rationalize,Raw,Re,Read,ReadList,%
      Real,Rectangle,Reduce,Remove,RenderAll,Repeated,RepeatedNull,%
      Replace,ReplaceAll,ReplaceRepeated,Rest,Resultant,Return,Reverse,%
      RGBColor,Roots,RotateLeft,RotateRight,Round,RowReduce,Rule,%
      RuleDelayed,Run,RunThrough,SameQ,Save,Scaled,Scan,ScientificForm,%
      Sec,Sech,SeedRandom,Select,Sequence,SequenceForm,Series,%
      SeriesData,Set,SetAttributes,SetDelayed,SetOptions,Shading,Share,%
      Short,Show,Sign,Signature,Simplify,Sin,SingularValues,Sinh,%
      Skeleton,Slot,SlotSequence,Solve,SolveAlways,Sort,%
      SphericalHarmonicY,Splice,Sqrt,StirlingS1,StirlingS2,String,%
      StringBreak,StringForm,StringJoin,StringLength,StringMatchQ,%
      StringSkeleton,Subscript,Subscripted,Subtract,SubtractForm,Sum,%
      Superscript,SurfaceGraphics,Switch,Symbol,Table,TableForm,TagSet,%
      TagSetDelayed,TagUnset,Take,Tan,Tanh,ToString,TensorRank,TeXForm,%
      Text,TextForm,Thickness,Thread,Through,Throw,Ticks,%
      TimeConstrained,Times,TimesBy,Timing,ToExpression,Together,%
      ToRules,ToString,TotalHeight,TotalWidth,Transpose,TreeForm,TrueQ,%
      Unequal,Union,Unique,Unprotect,Unset,Update,UpSet,UpSetDelayed,%
      ValueQ,Variables,VectorQ,ViewPoint,WeierstrassP,%
      WeierstrassPPrime,Which,While,WorkingPrecision,Write,WriteString,%
      Xor,ZeroTest,Zeta},%
   morendkeywords={All,Automatic,Catalan,ComplexInfinity,Constant,%
      Degree,E,EndOfFile,EulerGamma,False,Flat,GoldenRatio,HoldAll,%
      HoldFirst,HoldRest,I,Indeterminate,Infinity,Listable,Locked,%
      Modular,None,Null,OneIdentity,Orderless,Pi,Protected,%
      ReadProtected,True,$CommandLine,$Context,$ContextPath,$Display,%
      $DisplayFunction,$Echo,$Epilog,$IgnoreEOF,$Line,$Messages,%
      $Output,$Path,$Post,$Pre,$PrePrint,$RecursionLimit,$System,%
      $Urgent,$Version},%
   sensitive,%
   morecomment=[s]{(*}{*)},%
   morestring=[d]"%
  }[keywords,comments,strings]%
%%
%% Octave definition (c) 2001,2002 Ulrich G. Wortmann
%%
\lst@definelanguage{Octave}%
  {morekeywords={gt,lt,gt,lt,amp,abs,acos,acosh,acot,acoth,acsc,acsch,%
      all,angle,ans,any,asec,asech,asin,asinh,atan,atan2,atanh,auread,%
      auwrite,axes,axis,balance,bar,bessel,besselk,bessely,beta,%
      betainc,betaln,blanks,bone,break,brighten,capture,cart2pol,%
      cart2sph,caxis,cd,cdf2rdf,cedit,ceil,chol,cla,clabel,clc,clear,%
      clf,clock,close,colmmd,Colon,colorbar,colormap,ColorSpec,colperm,%
      comet,comet3,compan,compass,computer,cond,condest,conj,contour,%
      contour3,contourc,contrast,conv,conv2,cool,copper,corrcoef,cos,%
      cosh,cot,coth,cov,cplxpair,cputime,cross,csc,csch,csvread,%
      csvwrite,cumprod,cumsum,cylinder,date,dbclear,dbcont,dbdown,%
      dbquit,dbstack,dbstatus,dbstep,dbstop,dbtype,dbup,ddeadv,ddeexec,%
      ddeinit,ddepoke,ddereq,ddeterm,ddeunadv,deblank,dec2hex,deconv,%
      del2,delete,demo,det,diag,diary,diff,diffuse,dir,disp,dlmread,%
      dlmwrite,dmperm,dot,drawnow,echo,eig,ellipj,ellipke,else,elseif,%
      end,engClose,engEvalString,engGetFull,engGetMatrix,engOpen,%
      engOutputBuffer,engPutFull,engPutMatrix,engSetEvalCallback,%
      engSetEvalTimeout,engWinInit,eps,erf,erfc,erfcx,erfinv,%
      errorbar,etime,etree,eval,exist,exp,expint,expm,expo,eye,fclose,%
      feather,feof,ferror,feval,fft,fft2,fftshift,fgetl,fgets,figure,%
      fill,fill3,filter,filter2,find,findstr,finite,fix,flag,fliplr,%
      flipud,floor,flops,fmin,fmins,fopen,for,format,fplot,fprintf,%
      fread,frewind,fscanf,fseek,ftell,full,function,funm,fwrite,fzero,%
      gallery,gamma,gammainc,gammaln,gca,gcd,gcf,gco,get,getenv,%
      getframe,ginput,global,gplot,gradient,gray,graymon,grid,griddata,%
      gtext,hadamard,hankel,help,hess,hex2dec,hex2num,hidden,hilb,hist,%
      hold,home,hostid,hot,hsv,hsv2rgb,if,ifft,ifft2,imag,image,%
      imagesc,Inf,info,input,int2str,interp1,interp2,interpft,inv,%
      invhilb,isempty,isglobal,ishold,isieee,isinf,isletter,isnan,%
      isreal,isspace,issparse,isstr,jet,keyboard,kron,lasterr,lcm,%
      legend,legendre,length,lin2mu,line,linspace,load,log,log10,log2,%
      loglog,logm,logspace,lookfor,lower,ls,lscov,lu,magic,matClose,%
      matDeleteMatrix,matGetDir,matGetFp,matGetFull,matGetMatrix,%
      matGetNextMatrix,matGetString,matlabrc,matlabroot,matOpen,%
      matPutFull,matPutMatrix,matPutString,max,mean,median,menu,mesh,%
      meshc,meshgrid,meshz,mexAtExit,mexCallMATLAB,mexdebug,%
      mexErrMsgTxt,mexEvalString,mexFunction,mexGetFull,mexGetMatrix,%
      mexGetMatrixPtr,mexPrintf,mexPutFull,mexPutMatrix,mexSetTrapFlag,%
      min,more,movie,moviein,mu2lin,mxCalloc,mxCopyCharacterToPtr,%
      mxCopyComplex16ToPtr,mxCopyInteger4ToPtr,mxCopyPtrToCharacter,%
      mxCopyPtrToComplex16,mxCopyPtrToInteger4,mxCopyPtrToReal8,%
      mxCopyReal8ToPtr,mxCreateFull,mxCreateSparse,mxCreateString,%
      mxFree,mxFreeMatrix,mxGetIr,mxGetJc,mxGetM,mxGetN,mxGetName,%
      mxGetNzmax,mxGetPi,mxGetPr,mxGetScalar,mxGetString,mxIsComplex,%
      mxIsFull,mxIsNumeric,mxIsSparse,mxIsString,mxIsTypeDouble,%
      mxSetIr,mxSetJc,mxSetM,mxSetN,mxSetName,mxSetNzmax,mxSetPi,%
      mxSetPr,NaN,nargchk,nargin,nargout,newplot,nextpow2,nnls,nnz,%
      nonzeros,norm,normest,null,num2str,nzmax,ode23,ode45,orient,orth,%
      pack,pascal,patch,path,pause,pcolor,pi,pink,pinv,plot,plot3,%
      pol2cart,polar,poly,polyder,polyeig,polyfit,polyval,polyvalm,%
      pow2,print,printopt,prism,prod,pwd,qr,qrdelete,qrinsert,quad,%
      quad8,quit,quiver,qz,rand,randn,randperm,rank,rat,rats,rbbox,%
      rcond,real,realmax,realmin,refresh,rem,reset,reshape,residue,%
      return,rgb2hsv,rgbplot,rootobject,roots,rose,rosser,rot90,rotate,%
      round,rref,rrefmovie,rsf2csf,save,saxis,schur,sec,sech,semilogx,%
      semilogy,set,setstr,shading,sign,sin,sinh,size,slice,sort,sound,%
      spalloc,sparse,spaugment,spconvert,spdiags,specular,speye,spfun,%
      sph2cart,sphere,spinmap,spline,spones,spparms,sprandn,sprandsym,%
      sprank,sprintf,spy,sqrt,sqrtm,sscanf,stairs,startup,std,stem,%
      str2mat,str2num,strcmp,strings,strrep,strtok,subplot,subscribe,%
      subspace,sum,surf,surface,surfc,surfl,surfnorm,svd,symbfact,%
      symmmd,symrcm,tan,tanh,tempdir,tempname,terminal,text,tic,title,%
      toc,toeplitz,trace,trapz,tril,triu,type,uicontrol,uigetfile,%
      uimenu,uiputfile,unix,unwrap,upper,vander,ver,version,view,%
      viewmtx,waitforbuttonpress,waterfall,wavread,wavwrite,what,%
      whatsnew,which,while,white,whitebg,who,whos,wilkinson,wk1read,%
      stderr,stdout,plot,set,endif,wk1write,xlabel,xor,ylabel,zeros,%
      zlabel,zoom,endwhile,endfunction},%
   sensitive=f,%
   morecomment=[l]\#,%
   morecomment=[l]\#\#,%
   morestring=[m]',%
   morestring=[m]"%
  }[keywords,comments,strings]%
\lst@definelanguage[XSC]{Pascal}[Standard]{Pascal}
  {deletekeywords={alfa,byte,pack,unpack},% 1998 Andreas Stephan
   morekeywords={dynamic,external,forward,global,module,nil,operator,%
      priority,sum,type,use,dispose,mark,page,release,cimatrix,%
      cinterval,civector,cmatrix,complex,cvector,dotprecision,imatrix,%
      interval,ivector,rmatrix,rvector,string,im,inf,re,sup,chr,comp,%
      eof,eoln,expo,image,ival,lb,lbound,length,loc,mant,maxlength,odd,%
      ord,pos,pred,round,rval,sign,substring,succ,trunc,ub,ubound}%
  }%
\lst@definelanguage[Borland6]{Pascal}[Standard]{Pascal}
  {morekeywords={asm,constructor,destructor,implementation,inline,%
      interface,nil,object,shl,shr,string,unit,uses,xor},%
   morendkeywords={Abs,Addr,ArcTan,Chr,Concat,Copy,Cos,CSeg,DiskFree,%
      DiskSize,DosExitCode,DosVersion,DSeg,EnvCount,EnvStr,Eof,Eoln,%
      Exp,FExpand,FilePos,FileSize,Frac,FSearch,GetBkColor,GetColor,%
      GetDefaultPalette,GetDriverName,GetEnv,GetGraphMode,GetMaxMode,%
      GetMaxX,GetMaxY,GetModeName,GetPaletteSize,GetPixel,GetX,GetY,%
      GraphErrorMsg,GraphResult,Hi,ImageSize,InstallUserDriver,%
      InstallUserFont,Int,IOResult,KeyPressed,Length,Lo,MaxAvail,%
      MemAvail,MsDos,Odd,Ofs,Ord,OvrGetBuf,OvrGetRetry,ParamCount,%
      ParamStr,Pi,Pos,Pred,Ptr,Random,ReadKey,Round,SeekEof,SeekEoln,%
      Seg,SetAspectRatio,Sin,SizeOf,Sound,SPtr,Sqr,Sqrt,SSeg,Succ,%
      Swap,TextHeight,TextWidth,Trunc,TypeOf,UpCase,WhereX,WhereY,%
      Append,Arc,Assign,AssignCrt,Bar,Bar3D,BlockRead,BlockWrite,ChDir,%
      Circle,ClearDevice,ClearViewPort,Close,CloseGraph,ClrEol,ClrScr,%
      Dec,Delay,Delete,DelLine,DetectGraph,Dispose,DrawPoly,Ellipse,%
      Erase,Exec,Exit,FillChar,FillEllipse,FillPoly,FindFirst,FindNext,%
      FloodFill,Flush,FreeMem,FSplit,GetArcCoords,GetAspectRatio,%
      GetDate,GetDefaultPalette,GetDir,GetCBreak,GetFAttr,%
      GetFillSettings,GetFTime,GetImage,GetIntVec,GetLineSettings,%
      GetMem,GetPalette,GetTextSettings,GetTime,GetVerify,%
      GetViewSettings,GoToXY,Halt,HighVideo,Inc,InitGraph,Insert,%
      InsLine,Intr,Keep,Line,LineRel,LineTo,LowVideo,Mark,MkDir,Move,%
      MoveRel,MoveTo,MsDos,New,NormVideo,NoSound,OutText,OutTextXY,%
      OvrClearBuf,OvrInit,OvrInitEMS,OvrSetBuf,PackTime,PieSlice,%
      PutImage,PutPixel,Randomize,Rectangle,Release,Rename,%
      RestoreCrtMode,RmDir,RunError,Sector,Seek,SetActivePage,%
      SetAllPalette,SetBkColor,SetCBreak,SetColor,SetDate,SetFAttr,%
      SetFillPattern,SetFillStyle,SetFTime,SetGraphBufSize,%
      SetGraphMode,SetIntVec,SetLineStyle,SetPalette,SetRGBPalette,%
      SetTextBuf,SetTextJustify,SetTextStyle,SetTime,SetUserCharSize,%
      SetVerify,SetViewPort,SetVisualPage,SetWriteMode,Sound,Str,%
      SwapVectors,TextBackground,TextColor,TextMode,Truncate,%
      UnpackTime,Val,Window}%
  }%
\lst@definelanguage[Standard]{Pascal}%
  {morekeywords={alfa,and,array,begin,boolean,byte,case,char,const,div,%
      do,downto,else,end,false,file,for,function,get,goto,if,in,%
      integer,label,maxint,mod,new,not,of,or,pack,packed,page,program,%
      put,procedure,read,readln,real,record,repeat,reset,rewrite,set,%
      text,then,to,true,type,unpack,until,var,while,with,write,%
      writeln},%
   sensitive=f,%
   morecomment=[s]{(*}{*)},%
   morecomment=[s]{\{}{\}},%
   morestring=[d]'%
  }[keywords,comments,strings]%
\lst@definelanguage{Perl}%
  {morekeywords={abs,accept,alarm,atan2,bind,binmode,bless,caller,%
      chdir,chmod,chomp,chop,chown,chr,chroot,close,closedir,connect,%
      continue,cos,crypt,dbmclose,dbmopen,defined,delete,die,do,dump,%
      each,else,elsif,endgrent,endhostent,endnetent,endprotoent,%
      endpwent,endservent,eof,eval,exec,exists,exit,exp,fcntl,fileno,%
      flock,for,foreach,fork,format,formline,getc,getgrent,getgrgid,%
      getgrnam,gethostbyaddr,gethostbyname,gethostent,getlogin,%
      getnetbyaddr,getnetbyname,getnetent,getpeername,getpgrp,%
      getppid,getpriority,getprotobyname,getprotobynumber,getprotoent,%
      getpwent,getpwnam,getpwuid,getservbyname,getservbyport,%
      getservent,getsockname,getsockopt,glob,gmtime,goto,grep,hex,if,%
      import,index,int,ioctl,join,keys,kill,last,lc,lcfirst,length,%
      link,listen,local,localtime,log,lstat,m,map,mkdir,msgctl,msgget,%
      msgrcv,msgsnd,my,next,no,oct,open,opendir,ord,pack,package,pipe,%
      pop,pos,print,printf,prototype,push,q,qq,quotemeta,qw,qx,rand,%
      read,readdir,readlink,recv,redo,ref,rename,require,reset,return,%
      reverse,rewinddir,rindex,rmdir,s,scalar,seek,seekdir,select,%
      semctl,semget,semop,send,setgrent,sethostent,setnetent,setpgrp,%
      setpriority,setprotoent,setpwent,setservent,setsockopt,shift,%
      shmctl,shmget,shmread,shmwrite,shutdown,sin,sleep,socket,%
      socketpair,sort,splice,split,sprintf,sqrt,srand,stat,study,sub,%
      substr,symlink,syscall,sysopen,sysread,system,syswrite,tell,%
      telldir,tie,tied,time,times,tr,truncate,uc,ucfirst,umask,undef,%
      unless,unlink,unpack,unshift,untie,until,use,utime,values,vec,%
      wait,waitpid,wantarray,warn,while,write,y},%
   sensitive,%
   morecomment=[l]\#,%
   morestring=[b]",%
   morestring=[b]',%
   MoreSelectCharTable=%
      \lst@ReplaceInput{\$\#}{\lst@ProcessOther\$\lst@ProcessOther\#}%
  }[keywords,comments,strings]%
%%
%% POV definition (c) 1999 Berthold H\"ollmann
%%
\lst@definelanguage{POV}%
  {morekeywords={abs,absorption,acos,acosh,adaptive,adc_bailout,agate,%
      agate_turb,all,alpha,ambient,ambient_light,angle,aperture,append,%
      arc_angle,area_light,array,asc,asin,asinh,assumed_gamma,atan,%
      atan2,atanh,average,background,bezier_spline,bicubic_patch,%
      black_hole,blob,blue,blur_samples,bounded_by,box,boxed,bozo,%
      break,brick,brick_size,brightness,brilliance,bumps,bump_map,%
      bump_size,camera,case,caustics,ceil,checker,chr,clipped_by,clock,%
      clock_delta,color,color_map,colour,colour_map,component,%
      composite,concat,cone,confidence,conic_sweep,control0,control1,%
      cos,cosh,count,crackle,crand,cube,cubic,cubic_spline,cubic_wave,%
      cylinder,cylindrical,debug,declare,default,defined,degrees,%
      density,density_file,density_map,dents,difference,diffuse,%
      dimensions,dimension_size,direction,disc,distance,%
      distance_maximum,div,eccentricity,else,emission,end,error,%
      error_bound,exp,extinction,fade_distance,fade_power,falloff,%
      falloff_angle,false,fclose,file_exists,filter,finish,fisheye,%
      flatness,flip,floor,focal_point,fog,fog_alt,fog_offset,fog_type,%
      fopen,frequency,gif,global_settings,gradient,granite,%
      gray_threshold,green,height_field,hexagon,hf_gray_16,hierarchy,%
      hollow,hypercomplex,if,ifdef,iff,ifndef,image_map,include,int,%
      interior,interpolate,intersection,intervals,inverse,ior,irid,%
      irid_wavelength,jitter,julia_fractal,lambda,lathe,leopard,%
      light_source,linear_spline,linear_sweep,local,location,log,%
      looks_like,look_at,low_error_factor,macro,mandel,map_type,marble,%
      material,material_map,matrix,max,max_intersections,max_iteration,%
      max_trace_level,media,media_attenuation,media_interaction,merge,%
      mesh,metallic,min,minimum_reuse,mod,mortar,nearest_count,no,%
      normal,normal_map,no_shadow,number_of_waves,object,octaves,off,%
      offset,omega,omnimax,on,once,onion,open,orthographic,panoramic,%
      perspective,pgm,phase,phong,phong_size,pi,pigment,pigment_map,%
      planar,plane,png,point_at,poly,polygon,poly_wave,pot,pow,ppm,%
      precision,prism,pwr,quadratic_spline,quadric,quartic,quaternion,%
      quick_color,quick_colour,quilted,radial,radians,radiosity,radius,%
      rainbow,ramp_wave,rand,range,ratio,read,reciprocal,%
      recursion_limit,red,reflection,reflection_exponent,refraction,%
      render,repeat,rgb,rgbf,rgbft,rgbt,right,ripples,rotate,roughness,%
      samples,scale,scallop_wave,scattering,seed,shadowless,sin,%
      sine_wave,sinh,sky,sky_sphere,slice,slope_map,smooth,%
      smooth_triangle,sor,specular,sphere,spherical,spiral1,spiral2,%
      spotlight,spotted,sqr,sqrt,statistics,str,strcmp,strength,strlen,%
      strlwr,strupr,sturm,substr,superellipsoid,switch,sys,t,tan,tanh,%
      text,texture,texture_map,tga,thickness,threshold,tightness,tile2,%
      tiles,torus,track,transform,translate,transmit,triangle,%
      triangle_wave,true,ttf,turbulence,turb_depth,type,u,%
      ultra_wide_angle,undef,union,up,use_color,use_colour,use_index,%
      u_steps,v,val,variance,vaxis_rotate,vcross,vdot,version,vlength,%
      vnormalize,vrotate,v_steps,warning,warp,water_level,waves,while,%
      width,wood,wrinkles,write,x,y,yes,z},%
   moredirectives={break,case,debug,declare,default,else,end,fclose,%
      fopen,local,macro,read,render,statistics,switch,undef,version,%
      warning,write},%
   moredelim=*[directive]\#,%
   sensitive,%
   morecomment=[l]//,%
   morecomment=[s]{/*}{*/},%
   morestring=[d]",%
  }[keywords,directives,comments,strings]%
%%
%% Python definition (c) 1998 Michael Weber
%%
\lst@definelanguage{Python}%
  {morekeywords={access,and,break,class,continue,def,del,elif,else,%
      except,exec,finally,for,from,global,if,import,in,is,lambda,not,%
      or,pass,print,raise,return,try,while},%
   sensitive=true,%
   morecomment=[l]\#,%
   morecomment=[s]{'''}{'''},% used for documentation text
   morecomment=[s]{"""}{"""},% added by Philipp Matthias Hahn
   morestring=[b]',%
   morestring=[b]"%
  }%
%%
%% Scilab definition (c) 2002,2003 Jean-Philippe Grivet
%%
\lst@definelanguage{Scilab}%
  {morekeywords={abcd,abinv,abort,abs,acoshm,acosh,acosm,acos,addcolor,%
      addf,addinter,addmenu,add_edge,add_node,adj2sp,adj_lists,aff2ab,%
      amell,analpf,analyze,ans,apropos,arc_graph,arc_number,argn,arhnk,%
      arl2,arma2p,armac,armax1,armax,arma,arsimul,artest,articul,ascii,%
      asinhm,asinh,asinm,asin,atanhm,atanh,atanm,atan,augment,auread,%
      auwrite,balanc,balreal,bandwr,basename,bdiag,besseli,besselj,%
      besselk,bessely,best_match,bezout,bifish,bilin,binomial,black,%
      bloc2exp,bloc2ss,bode,bool2s,boolean,boucle,break,bstap,buttmag,%
      bvode,cainv,calerf,calfrq,call,canon,casc,case,ccontrg,cdfbet,%
      cdfbin,cdfchi,cdfchn,cdffnc,cdff,cdfgam,cdfnbn,cdfnor,cdfpoi,%
      cdft,ceil,center,cepstrum,chaintest,chain_struct,champ1,champ,%
      chart,chdir,cheb1mag,cheb2mag,check_graph,check_io,chepol,chfact,%
      chol,chsolve,circuit,classmarkov,clean,clearfun,clearglobal,%
      clear,close,cls2dls,cmb_lin,cmndred,cmoment,code2str,coeff,coffg,%
      coff,colcompr,colcomp,colinout,colormap,colregul,companion,comp,%
      cond,conj,connex,contour2di,contour2d,contourf,contour,%
      contract_edge,contrss,contr,cont_frm,cont_mat,convex_hull,convol,%
      convstr,con_nodes,copfac,copy,correl,corr,coshm,cosh,cosm,cos,%
      cotg,cothm,coth,covar,csim,cspect,ctr_gram,cumprod,cumsum,%
      curblock,cycle_basis,czt,c_link,dasrt,dassl,datafit,date,dbphi,%
      dcf,ddp,debug,dec2hex,deff,definedfields,degree,delbpt,%
      delete_arcs,delete_nodes,delete,delip,delmenu,demos,denom,%
      derivative,derivat,des2ss,des2tf,determ,detr,det,dft,dhinf,%
      dhnorm,diag,diary,diff,diophant,dirname,dispbpt,dispfiles,disp,%
      dlgamma,double,dragrect,drawaxis,drawlater,drawnow,draw,driver,%
      dscr,dsearch,dsimul,dtsi,dt_ility,duplicate,edge_number,%
      edit_curv,edit_graph_menus,edit_graph,edit,eigenmarkov,ell1mag,%
      elseif,else,emptystr,endfunction,end,eqfir,eqiir,equil1,equil,%
      ereduc,erfcx,erfc,erf,errbar,errcatch,errclear,error,eval3dp,%
      eval3d,eval,evans,evstr,excel2sci,execstr,exec,exists,exit,expm,%
      exp,external,eye,fac3d,factors,faurre,fchamp,fcontour2d,fcontour,%
      fec,feedback,feval,ffilt,fftshift,fft,fgrayplot,figure,fileinfo,%
      file,filter,findm,findobj,findx0BD,find_freq,find_path,find,%
      findABCD,findAC,findBD,findBDK,findR,fit_dat,fix,floor,flts,foo,%
      formatman,format,fort,for,fourplan,fplot2d,fplot3d1,fplot3d,%
      fprintf,fprintfMat,frep2tf,freq,freson,frexp,frfit,frmag,fscanf,%
      fscanfMat,fsfirlin,fsolve,fspecg,fstabst,fstair,ftest,ftuneq,%
      fullrfk,fullrf,full,fun2string,funcprot,functions,function,%
      funptr,fusee,gainplot,gamitg,gammaln,gamma,gcare,gcd,gcf,%
      genfac3d,genlib,genmarkov,gen_net,geom3d,geomean,getblocklabel,%
      getcolor,getcurblock,getcwd,getdate,getd,getenv,getfield,getfont,%
      getf,getio,getlinestyle,getmark,getpid,getscicosvars,getsymbol,%
      getvalue,getversion,get_function_path,get,gfare,gfrancis,girth,%
      givens,glever,glist,global,glue,gpeche,graduate,grand,%
      graphics_entities,graph_2_mat,graph_center,graph_complement,%
      graph_diameter,graph_power,graph_simp,graph_sum,graph_union,%
      graph-list,graycolormap,grayplot,graypolarplot,grep,group,%
      gr_menu,gschur,gsort,gspec,gstacksize,gtild,g_margin,h2norm,halt,%
      hamilton,hankelsv,hank,harmean,havewindow,help,hermit,hess,%
      hex2dec,hilb,hinf,hist3d,histplot,horner,host,hotcolormap,%
      householder,hrmt,htrianr,hypermat,h_cl,h_inf_st,h_inf,h_norm,%
      iconvert,icon_edit,ieee,if,iirgroup,iirlp,iir,ilib_build,%
      ilib_compile,ilib_for_link,ilib_gen_gateway,ilib_gen_loader,%
      ilib_gen_Make,imag,impl,imrep2ss,imult,im_inv,inistate,input,%
      int16,int2d,int32,int3d,int8,intc,intdec,integrate,interpln,%
      interp,intersci,intersect,intg,intl,intppty,intsplin,inttrap,%
      inttype,int,invr,invsyslin,inv_coeff,inv,iqr,isdef,isdir,isequal,%
      iserror,isglobal,isinf,isnan,isoview,isreal,is_connex,jmat,%
      justify,kalm,karmarkar,kernel,keyboard,knapsack,kpure,krac2,%
      kroneck,kron,lasterror,lattn,lattp,lcf,lcmdiag,lcm,ldivf,ldiv,%
      leastsq,legends,length,leqr,levin,lev,lex_sort,lft,lgfft,library,%
      lib,lin2mu,lincos,lindquist,lines,line_graph,linfn,linf,link,%
      linmeq,linpro,linsolve,linspace,lin,listfiles,list,lmisolver,%
      lmitool,loadmatfile,loadplots,loadwave,load_graph,load,locate,%
      log10,log1p,log2,logm,logspace,log,lotest,lqe,lqg2stan,lqg_ltr,%
      lqg,lqr,lsq,lsslist,lstcat,lstsize,ltitr,ludel,lufact,luget,%
      lusolve,lu,lyap,macglov,macr2lst,macrovar,macro,mad,make_graph,%
      make_index,manedit,man,mapsound,markp2ss,matfile2sci,matrix,%
      mat_2_graph,maxi,max_cap_path,max_clique,max_flow,max,mclearerr,%
      mclose,meanf,mean,median,meof,mese,mesh2d,mfft,mfile2sci,mgeti,%
      mgetl,mgetstr,mget,milk_drop,mine,mini,minreal,minss,%
      min_lcost_cflow,min_lcost_flow1,min_lcost_flow2,min_qcost_flow,%
      min_weight_tree,min,mlist,mode,modulo,moment,mopen,move,%
      mps2linpro,mputl,mputstr,mput,mrfit,msd,mseek,mtell,mtlb_load,%
      mtlb_mode,mtlb_save,mtlb_sparse,mu2lin,mulf,mvvacov,m_circle,%
      names,nand2mean,nanmax,nanmeanf,nanmean,nanmedian,nanmin,%
      nanstdev,nansum,narsimul,ndims,nearfloat,nehari,neighbors,%
      netclose,netwindows,netwindow,newest,newfun,nextpow2,nf3d,nfreq,%
      nlev,nnz,nodes_2_path,nodes_degrees,node_number,noisegen,norm,%
      null,numdiff,numer,nyquist,obscont1,obscont,observer,obsvss,%
      obsv_mat,obs_gram,odedc,odedi,odeoptions,ode_discrete,ode_root,%
      ode,oldload,oldsave,ones,optim,orth,param3d1,param3d,%
      paramfplot2d,parrot,part,pathconvert,path_2_nodes,pause,pbig,%
      pdiv,pen2ea,pencan,penlaur,perctl,perfect_match,pertrans,pfss,%
      phasemag,phc,pinv,pipe_network,playsnd,plot2d1,plot2d2,plot2d3,%
      plot2d4,plot2d,plot3d1,plot3d2,plot3d3,plot3d,plotframe,%
      plotprofile,plot_graph,plot,plzr,pmodulo,pol2des,pol2str,pol2tex,%
      polarplot,polar,polfact,poly,portr3d,portrait,power,ppol,prbs_a,%
      predecessors,predef,printf,printing,print,prod,profile,projsl,%
      projspec,proj,psmall,pspect,pvm_addhosts,pvm_barrier,pvm_bcast,%
      pvm_bufinfo,pvm_config,pvm_delhosts,pvm_error,pvm_exit,%
      pvm_f772sci,pvm_getinst,pvm_gettid,pvm_get_timer,pvm_gsize,%
      pvm_halt,pvm_joingroup,pvm_kill,pvm_lvgroup,pvm_mytid,pvm_parent,%
      pvm_probe,pvm_recv,pvm_reduce,pvm_sci2f77,pvm_send,pvm_set_timer,%
      pvm_spawn_independent,pvm_spawn,pvm_start,pvm_tasks,%
      pvm_tidtohost,pvm,pwd,p_margin,qassign,qr,quapro,quart,quaskro,%
      quit,randpencil,rand,range,rankqr,rank,rat,rcond,rdivf,read4b,%
      readb,readc_,readmps,read,real,recur,reglin,regress,remezb,remez,%
      repfreq,replot,residu,resume,return,riccati,riccsl,ricc,ric_desc,%
      rlist,roots,rotate,round,routh_t,rowcompr,rowcomp,rowinout,%
      rowregul,rowshuff,rpem,rref,rtitr,rubberbox,salesman,savewave,%
      save_graph,save,scaling,scanf,schur,sci2exp,sci2for,sci2map,%
      sciargs,scicosim,scicos,scifunc_block,sd2sci,secto3d,select,%
      semidef,sensi,setbpt,seteventhandler,setfield,setmenu,%
      setscicosvars,set,sfact,sgrid,shortest_path,showprofile,%
      show_arcs,show_graph,show_nodes,sident,signm,sign,simp_mode,simp,%
      sincd,sinc,sinc,sinhm,sinh,sinm,sin,size,sm2des,sm2ss,smooth,%
      solve,sorder,sort,sound,sp2adj,spaninter,spanplus,spantwo,sparse,%
      spchol,spcompack,specfact,spec,speye,spget,splin,split_edge,%
      spones,sprand,sprintf,spzeros,sqroot,sqrtm,sqrt,squarewave,%
      square,srfaur,srkf,ss2des,ss2ss,ss2tf,sscanf,sskf,ssprint,ssrand,%
      stabil,stacksize,standard_define,standard_draw,standard_input,%
      standard_origin,standard_output,startup,stdevf,stdev,steadycos,%
      str2code,strange,strcat,strindex,strings,string,stripblanks,%
      strong_connex,strong_con_nodes,strsubst,st_deviation,st_ility,%
      subf,subgraph,subplot,successors,sum,supernode,sva,svd,svplot,%
      sylm,sylv,sysconv,sysdiag,sysfact,syslin,syssize,systems,system,%
      systmat,tabul,tangent,tanhm,tanh,tanm,tan,tdinit,testmatrix,%
      texprint,tf2des,tf2ss,then,thrownan,timer,time_id,titlepage,%
      tk_getdir,tk_getfile,tlist,toeplitz,tokenpos,tokens,trace,%
      translatepaths,trans_closure,trans,trfmod,trianfml,tril,trimmean,%
      trisolve,triu,trzeros,typename,typeof,type,uicontrol,uimenu,%
      uint16,uint32,uint8,ui_observer,ulink,unglue,union,unique,unix_g,%
      unix_s,unix_w,unix_x,unix,unobs,unsetmenu,user,varargin,%
      varargout,variancef,variance,varn,warning,wavread,wavwrite,%
      wcenter,wfir,what,whereami,whereis,where,while,whos,who_user,who,%
      wiener,wigner,window,winsid,with_gtk,with_pvm,with_texmacs,%
      with_tk,writb,write4b,write,xarcs,xarc,xarrows,xaxis,xbasc,%
      xbasimp,xbasr,xchange,xclear,xclea,xclick,xclip,xdel,xend,xfarcs,%
      xfarc,xfpolys,xfpoly,xfrect,xgetech,xgetfile,xgetmouse,xget,%
      xgraduate,xgrid,xinfo,xinit,xlfont,xload,xname,xnumb,xpause,%
      xpolys,xpoly,xrects,xrect,xrpoly,xs2fig,xs2gif,xs2ppm,xs2ps,%
      xsave,xsegs,select,xsetech,xsetm,xset,xstringb,xstringl,xstring,%
      xtape,xtitle,x_choices,x_choose,x_dialog,x_matrix,x_mdialog,%
      x_message_modeless,x_message,yulewalk,zeropen,zeros,zgrid,zpbutt,%
      zpch1,zpch2,zpell,mfprintf,mfscanf,mprintf,mscanf,msprintf,%
      msscanf,mucomp,%
      ABSBLK_f,AFFICH_f,ANDLOG_f,ANIMXY_f,BIGSOM_f,CLINDUMMY_f,CLKIN_f,%
      CLKINV_f,CLKOUT_f,CLKOUTV_f,CLKSOM_f,CLKSOMV_f,CLKSPLIT_f,%
      CLOCK_f,CLR_f,CLSS_f,CONST_f,COSBLK_f,CURV_f,DELAY_f,DELAYV_f,%
      DEMUX_f,DLR_f,DLRADAPT_f,DLSS_f,EVENTSCOPE_f,EVTDLY_f,EVTGEN_f,%
      EXPBLK_f,G_make,GAIN_f,GAINBLK_f,GENERAL_f,GENERIC_f,GENSIN_f,%
      GENSQR_f,HALT_f,IFTHEL_f,IN_f,INTEGRAL_f,INTRP2BLK_f,INTRPLBLK_f,%
      INVBLK_f,LOGBLK_f,LOOKUP_f,Matplot1,Matplot,MAX_f,MCLOCK_f,%
      MFCLCK_f,MIN_f,MUX_f,NDcost,NEGTOPOS_f,OUT_f,POSTONEG_f,POWBLK_f,%
      PROD_f,QUANT_f,RAND_f,READC_f,REGISTER_f,RELAY_f,RFILE_f,%
      ScilabEval,Sfgrayplot,Sgrayplot,SAMPLEHOLD_f,SAT_f,SAWTOOTH_f,%
      SCOPE_f,SCOPXY_f,SELECT_f,SINBLK_f,SOM_f,SPLIT_f,STOP_f,SUPER_f,%
      TANBLK_f,TCLSS_f,TEXT_f,TIME_f,TK_EvalFile,TK_EvalStr,TK_GetVar,%
      TK_SetVar,TRASH_f,WFILE_f,WRITEC_f,ZCROSS_f,%
      \%asn,\%helps,\%k,\%sn},%
   alsoletter=\%,% chmod
   sensitive,%
   morecomment=[l]//,%
   morestring=[b]",%
   morestring=[m]'%
  }[keywords,comments,strings]%
%%
%% SQL definition (c) 1998 Christian Haul
%%                (c) 2002 Neil Conway
%%                (c) 2002 Robert Frank
%%                (c) 2003 Dirk Jesko
%%
\lst@definelanguage{SQL}%
  {morekeywords={ABSOLUTE,ACTION,ADD,ALLOCATE,ALTER,ARE,AS,ASSERTION,%
      AT,BETWEEN,BIT_LENGTH,BOTH,BY,CASCADE,CASCADED,CASE,CAST,%
      CATALOG,CHAR_LENGTH,CHARACTER_LENGTH,CLUSTER,COALESCE,%
      COLLATE,COLLATION,COLUMN,CONNECT,CONNECTION,CONSTRAINT,%
      CONSTRAINTS,CONVERT,CORRESPONDING,CREATE,CROSS,CURRENT_DATE,%
      CURRENT_TIME,CURRENT_TIMESTAMP,CURRENT_USER,DAY,DEALLOCATE,%
      DEC,DEFERRABLE,DEFERED,DESCRIBE,DESCRIPTOR,DIAGNOSTICS,%
      DISCONNECT,DOMAIN,DROP,ELSE,END,EXEC,EXCEPT,EXCEPTION,EXECUTE,%
      EXTERNAL,EXTRACT,FALSE,FIRST,FOREIGN,FROM,FULL,GET,GLOBAL,%
      GRAPHIC,HAVING,HOUR,IDENTITY,IMMEDIATE,INDEX,INITIALLY,INNER,%
      INPUT,INSENSITIVE,INSERT,INTO,INTERSECT,INTERVAL,%
      ISOLATION,JOIN,KEY,LAST,LEADING,LEFT,LEVEL,LIMIT,LOCAL,LOWER,%
      MATCH,MINUTE,MONTH,NAMES,NATIONAL,NATURAL,NCHAR,NEXT,NO,NOT,NULL,%
      NULLIF,OCTET_LENGTH,ON,ONLY,ORDER,ORDERED,OUTER,OUTPUT,OVERLAPS,%
      PAD,PARTIAL,POSITION,PREPARE,PRESERVE,PRIMARY,PRIOR,READ,%
      RELATIVE,RESTRICT,REVOKE,RIGHT,ROWS,SCROLL,SECOND,SELECT,SESSION,%
      SESSION_USER,SIZE,SPACE,SQLSTATE,SUBSTRING,SYSTEM_USER,%
      TABLE,TEMPORARY,THEN,TIMEZONE_HOUR,%
      TIMEZONE_MINUTE,TRAILING,TRANSACTION,TRANSLATE,TRANSLATION,TRIM,%
      TRUE,UNIQUE,UNKNOWN,UPPER,USAGE,USING,VALUE,VALUES,%
      VARGRAPHIC,VARYING,WHEN,WHERE,WRITE,YEAR,ZONE,%
      AND,ASC,avg,CHECK,COMMIT,count,DECODE,DESC,DISTINCT,GROUP,IN,% FF
      LIKE,NUMBER,ROLLBACK,SUBSTR,sum,VARCHAR2,% FF
      MIN,MAX,UNION,UPDATE,% RF
      ALL,ANY,CUBE,CUBE,DEFAULT,DELETE,EXISTS,GRANT,OR,RECURSIVE,% DJ
      ROLE,ROLLUP,SET,SOME,TRIGGER,VIEW},% DJ
   morendkeywords={BIT,BLOB,CHAR,CHARACTER,CLOB,DATE,DECIMAL,FLOAT,% DJ
      INT,INTEGER,NUMERIC,SMALLINT,TIME,TIMESTAMP,VARCHAR},% moved here
   sensitive=false,% DJ
   morecomment=[l]--,%
   morecomment=[s]{/*}{*/},%
   morestring=[d]',%
   morestring=[d]"%
  }[keywords,comments,strings]%
%%
%% VHDL definition (c) 1997 Kai Wollenweber
%%
\lst@definelanguage{VHDL}%
  {morekeywords={ALL,ARCHITECTURE,ABS,AND,ASSERT,ARRAY,AFTER,ALIAS,%
      ACCESS,ATTRIBUTE,BEGIN,BODY,BUS,BLOCK,BUFFER,CONSTANT,CASE,%
      COMPONENT,CONFIGURATION,DOWNTO,ELSE,ELSIF,END,ENTITY,EXIT,%
      FUNCTION,FOR,FILE,GENERIC,GENERATE,GUARDED,GROUP,IF,IN,INOUT,IS,%
      INERTIAL,IMPURE,LIBRARY,LOOP,LABEL,LITERAL,LINKAGE,MAP,MOD,NOT,%
      NOR,NAND,NULL,NEXT,NEW,OUT,OF,OR,OTHERS,ON,OPEN,PROCESS,PORT,%
      PACKAGE,PURE,PROCEDURE,POSTPONED,RANGE,REM,ROL,ROR,REPORT,RECORD,%
      RETURN,REGISTER,REJECT,SIGNAL,SUBTYPE,SLL,SRL,SLA,SRA,SEVERITY,%
      SELECT,THEN,TYPE,TRANSPORT,TO,USE,UNITS,UNTIL,VARIABLE,WHEN,WAIT,%
      WHILE,XOR,XNOR,%
      DISCONNECT,ELIF,WITH},% Arnaud Tisserand
   sensitive=f,% 1998 Gaurav Aggarwal
   morecomment=[l]--,%
   morestring=[d]{"}%
  }[keywords,comments,strings]%
%%
%% VHDL-AMS definition (c) Steffen Klupsch
%%
\lst@definelanguage[AMS]{VHDL}[]{VHDL}%
  {morekeywords={ACROSS,ARRAY,BREAK,DISCONNECT,NATURE,NOISE,PORT,%
      PROCEDURAL,QUANTITY,SHARED,SPECTRUM,SUBNATURE,TERMINAL,THROUGH,%
      TOLERANCE,UNAFFACTED,UNITS}}
\lst@definelanguage{XML}%
  {keywords={,CDATA,DOCTYPE,ATTLIST,termdef,ELEMENT,EMPTY,ANY,ID,%
      IDREF,IDREFS,ENTITY,ENTITIES,NMTOKEN,NMTOKENS,NOTATION,%
      INCLUDE,IGNORE,SYSTEM,PUBLIC,NDATA,PUBLIC,%
      PCDATA,REQUIRED,IMPLIED,FIXED,%%% preceded by #
      xml,xml:space,xml:lang,version,standalone,default,preserve},%
   alsoother=$,%
   alsoletter=:,%
   tag=**[s]<>,%
   morestring=[d]",% ??? doubled
   morestring=[d]',% ??? doubled
   MoreSelectCharTable=%
      \lst@CArgX--\relax\lst@DefDelimB{}{}%
          {\ifnum\lst@mode=\lst@tagmode\else
               \expandafter\@gobblethree
           \fi}%
          \lst@BeginComment\lst@commentmode{{\lst@commentstyle}}%
      \lst@CArgX--\relax\lst@DefDelimE{}{}{}%
          \lst@EndComment\lst@commentmode
      \lst@CArgX[CDATA[\relax\lst@CDef{}%
          {\ifnum\lst@mode=\lst@tagmode
               \expandafter\lst@BeginCDATA
           \else \expandafter\lst@CArgEmpty
           \fi}%
          \@empty
      \lst@CArgX]]\relax\lst@CDef{}%
          {\ifnum\lst@mode=\lst@GPmode
               \expandafter\lst@EndComment
           \else \expandafter\lst@CArgEmpty
           \fi}%
          \@empty
  }[keywords,comments,strings,html]%
\endinput
%%
%% End of file `lstlang1.sty'.

~~~
###lstlang2.sty

~~~
%%
%% This is file `lstlang2.sty',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% lstdrvrs.dtx  (with options: `lang2')
%% 
%% (w)(c) 1996/1997/1998/1999/2000/2001/2002/2003 Carsten Heinz and/or
%% any other author listed elsewhere in this file.
%%
%% This file is distributed under the terms of the LaTeX Project Public
%% License from CTAN archives in directory  macros/latex/base/lppl.txt.
%% Either version 1.0 or, at your option, any later version.
%%
%% This file is completely free and comes without any warranty.
%%
%% Send comments and ideas on the package, error reports and additional
%% programming languages to <cheinz@gmx.de>.
%%
\ProvidesFile{lstlang2}
    [2003/08/13 1.1a listings language file]
%%
%% Abap definition by Knut Lickert
%%
\lst@definelanguage[R/3 6.10]{ABAP}[R/3 4.6C]{ABAP}%
  {morekeywords={try,endtry},%
  }[keywords,comments,strings]
\lst@definelanguage[R/3 4.6C]{ABAP}[R/3 3.1]{ABAP}%
  {morekeywords={method,ref,class,create,object,%
        methods,endmethod,private,protected,public,section,%
        catch,system-exceptions,endcatch,%
        },%
   moreprocnamekeys={class},%
   literate={->}{{$\rightarrow$}}1{=>}{{$\Rightarrow$}}1,%
  }[keywords,comments,strings,procnames]
\lst@definelanguage[R/3 3.1]{ABAP}[R/2 5.0]{ABAP}{}%
\lst@definelanguage[R/2 5.0]{ABAP}%
  {sensitive=f,%
   procnamekeys={report,program,form,function,module},%
   morekeywords={*,add,after,alias,analyzer,and,append,area,assign,at,%
        authority-check,before,binary,blank,break-point,calendar,call,%
        case,change,changing,check,clear,cnt,co,collect,commit,common,%
        component,compute,condense,cos,cp,cs,currency-conversion,%
        cursor,data,database,dataset,decimals,define,delete,dequeue,%
        describe,detail,dialog,directory,div,divide,do,documentation,%
        during,dynpro,else,end-of-page,end-of-selection,endat,endcase,%
        enddo,endfor,endform,endif,endloop,endmodule,endselect,%
        endwhile,enqueue,exceptions,exit,exp,export,exporting,extract,%
        field,field-groups,field-symbols,find,for,form,format,free,%
        from,function,generating,get,giving,hide,id,if,import,%
        importing,in,incl,include,initial,initialization,input,insert,%
        interrupt,into,is,language,leave,like,line,lines,line-count,
        line-selection,list-processing,load,local,log,logfile,loop,%
        margin,mark,mask,memory,menue,message,mod,modify,module,move,%
        move-text,multiply,na,new,new-line,new-page,no-gaps,np,ns,%
        number,obligatory,occurs,of,on,or,others,output,parameter,%
        parameters,parts,perform,pf-status,places,position,process,%
        raise,raising,ranges,read,refresh,refresh-dynpro,reject,remote,%
        replace,report,reserve,reset,restart,run,screen,scroll,search,%
        segments,select,select-options,selection-screen,set,shift,sin,%
        single,sqrt,start-of-selection,statement,structure,submit,%
        subtract,summary,summing,suppress,system,table,tables,task,%
        text,time,to,top-of-page,trace,transaction,transfer,%
        transfer-dynpro,translate,type,unpack,update,user-command,%
        using,value,when,where,while,window,with,workfile,write,},%
   morecomment=[l]",%
   morecomment=[f][0]*,%
   morestring=[d]'%
  }[keywords,comments,strings,procnames]
\lst@definelanguage[R/2 4.3]{ABAP}[R/2 5.0]{ABAP}%
  {deletekeywords={function,importing,exporting,changing,exceptions,%
        raise,raising}%
  }[keywords,comments,strings]
%%
%% Corba IDL definition (c) 1999 Jens T. Berger Thielemann
%%
\lst@definelanguage[CORBA]{IDL}%
  {morekeywords={any,attribute,boolean,case,char,const,context,default,%
      double,enum,exception,fixed,float,in,inout,interface,long,module,%
      native,Object,octet,oneway,out,raises,readonly,sequence,short,%
      string,struct,switch,typedef,union,unsigned,void,wchar,wstring,%
      FALSE,TRUE},%
   sensitive,%
   moredirectives={define,elif,else,endif,error,if,ifdef,ifndef,line,%
      include,pragma,undef,warning},%
   moredelim=*[directive]\#,%
   morecomment=[l]//,%
   morecomment=[s]{/*}{*/},%
   morestring=[b]"%
  }[keywords,comments,strings]%
%%
%% (Objective) Caml definition (c) 1999 Patrick Cousot
%%
%% Objective CAML and Caml light are freely available, together with a
%% reference manual, at URL ftp.inria.fr/lang/caml-light for the Unix,
%% Windows and Macintosh OS operating systems.
%%
\lst@definelanguage[Objective]{Caml}[light]{Caml}
  {deletekeywords={not,prefix,value,where},%
   morekeywords={assert,asr,class,closed,constraint,external,false,%
      functor,include,inherit,land,lazy,lor,lsl,lsr,lxor,method,mod,%
      module,new,open,parser,private,sig,struct,true,val,virtual,when,%
      object,ref},% TH
  }%
\lst@definelanguage[light]{Caml}
  {morekeywords={and,as,begin,do,done,downto,else,end,exception,for,%
      fun,function,if,in,let,match,mutable,not,of,or,prefix,rec,then,%
      to,try,type,value,where,while,with},%
   sensitive,%
   morecomment=[n]{(*}{*)},%
   morestring=[b]",%
   moredelim=*[directive]\#,%
   moredirectives={open,close,include}%
  }[keywords,comments,strings,directives]%
\lst@definelanguage[ibm]{Cobol}[1985]{Cobol}%
  {morekeywords={ADDRESS,BEGINNING,COMP-3,COMP-4,COMPUTATIONAL,%
      COMPUTATIONAL-3,COMPUTATIONAL-4,DISPLAY-1,EGCS,EJECT,ENDING,%
      ENTRY,GOBACK,ID,MORE-LABELS,NULL,NULLS,PASSWORD,RECORDING,%
      RETURN-CODE,SERVICE,SKIP1,SKIP2,SKIP3,SORT-CONTROL,SORT-RETURN,%
      SUPPRESS,TITLE,WHEN-COMPILED},%
  }%
\lst@definelanguage[1985]{Cobol}[1974]{Cobol}%
  {morekeywords={ALPHABET,ALPHABETIC-LOWER,ALPHABETIC-UPPER,%
      ALPHANUMERIC,ALPHANUMERIC-EDITED,ANY,CLASS,COMMON,CONTENT,%
      CONTINUE,DAY-OF-WEEK,END-ADD,END-CALL,END-COMPUTE,END-DELETE,%
      END-DIVIDE,END-EVALUATE,END-IF,END-MULTIPLY,END-PERFORM,END-READ,%
      END-RECEIVE,END-RETURN,END-REWRITE,END-SEARCH,END-START,%
      END-STRING,END-SUBTRACT,END-UNSTRING,END-WRITE,EVALUATE,EXTERNAL,%
      FALSE,GLOBAL,INITIALIZE,NUMERIC-EDITED,ORDER,OTHER,%
      PACKED-DECIMAL,PADDING,PURGE,REFERENCE,RELOAD,REPLACE,STANDARD-1,%
      STANDARD-2,TEST,THEN,TRUE},%
  }%
\lst@definelanguage[1974]{Cobol}%
  {morekeywords={ACCEPT,ACCESS,ADD,ADVANCING,AFTER,ALL,ALPHABETIC,ALSO,%
      ALTER,ALTERNATE,AND,ARE,AREA,AREAS,ASCENDING,ASSIGN,AT,AUTHOR,%
      BEFORE,BINARY,BLANK,BLOCK,BOTTOM,BY,CALL,CANCEL,CD,CF,CH,%
      CHARACTER,CHARACTERS,CLOCK-UNITS,CLOSE,COBOL,CODE,CODE-SET,%
      COLLATING,COLUMN,COMMA,COMMUNICATION,COMP,COMPUTE,CONFIGURATION,%
      CONTAINS,CONTROL,CONTROLS,CONVERTING,COPY,CORR,CORRESPONDING,%
      COUNT,CURRENCY,DATA,DATE,DATE-COMPILED,DATE-WRITTEN,DAY,DE,%
      DEBUG-CONTENTS,DEGUB-ITEM,DEBUG-LINE,DEBUG-NAME,DEBUG-SUB1,%
      DEBUG-SUB2,DEBUG-SUB3,DEBUGGING,DECIMAL-POINT,DECLARATIVES,%
      DELETE,DELIMITED,DELIMITER,DEPENDING,DESCENDING,DESTINATION,%
      DETAIL,DISABLE,DISPLAY,DIVIDE,DIVISION,DOWN,DUPLICATES,DYNAMIC,%
      EGI,ELSE,EMI,ENABLE,END,END-OF-PAGE,ENTER,ENVIRONMENT,EOP,EQUAL,%
      ERROR,ESI,EVERY,EXCEPTION,EXIT,EXTEND,FD,FILE,FILE-CONTROL,%
      FILLER,FINAL,FIRST,FOOTING,FOR,FROM,GENERATE,GIVING,GO,GREATER,%
      GROUP,HEADING,HIGH-VALUE,HIGH-VALUES,I-O,I-O-CONTROL,%
      IDENTIFICATION,IF,IN,INDEX,INDEXED,INDICATE,INITIAL,INITIATE,%
      INPUT,INPUT-OUTPUT,INSPECT,INSTALLATION,INTO,INVALID,IS,JUST,%
      JUSTIFIED,KEY,LABEL,LAST,LEADING,LEFT,LENGTH,LESS,LIMIT,LIMITS,%
      LINAGE,LINAGE-COUNTER,LINE,LINE-COUNTER,LINES,LINKAGE,LOCK,%
      LOW-VALUE,LOW-VALUES,MEMORY,MERGE,MESSAGE,MODE,MODULES,MOVE,%
      MULTIPLE,MULTIPLY,NATIVE,NEGATIVE,NEXT,NO,NOT,NUMBER,NUMERIC,%
      OBJECT-COMPUTER,OCCURS,OF,OFF,OMITTED,ON,OPEN,OPTIONAL,OR,%
      ORGANIZATION,OUTPUT,OVERFLOW,PAGE,PAGE-COUNTER,PERFORM,PF,PH,PIC,%
      PICTURE,PLUS,POINTER,POSITION,PRINTING,POSITIVE,PRINTING,%
      PROCEDURE,PROCEDURES,PROCEED,PROGRAM,PROGRAM-ID,QUEUE,QUOTE,%
      QUOTES,RANDOM,RD,READ,RECEIVE,RECORD,RECORDING,RECORDS,REDEFINES,%
      REEL,REFERENCES,RELATIVE,RELEASE,REMAINDER,REMOVAL,RENAMES,%
      REPLACING,REPORT,REPORTING,REPORTS,RERUN,RESERVE,RESET,RETURN,%
      REVERSED,REWIND,REWRITE,RF,RH,RIGHT,ROUNDED,RUN,SAME,SD,SEARCH,%
      SECTION,SECURITY,SEGMENT,SEGMENT-LIMIT,SELECT,SEND,SENTENCE,%
      SEPARATE,SEQUENCE,SEQUENTIAL,SET,SIGN,SIZE,SORT,SORT-MERGE,%
      SOURCE,SOURCE-COMPUTER,SPACE,SPACES,SPECIAL-NAMES,STANDARD,START,%
      STATUS,STOP,STRING,SUB-QUEUE-1,SUB-QUEUE-2,SUB-QUEUE-3,SUBTRACT,%
      SUM,SYMBOLIC,SYNC,SYNCHRONIZED,TABLE,TALLYING,TAPE,TERMINAL,%
      TERMINATE,TEXT,THAN,THROUGH,THRU,TIME,TIMES,TO,TOP,TRAILING,TYPE,%
      UNIT,UNSTRING,UNTIL,UP,UPON,USAGE,USE,USING,VALUE,VALUES,VARYING,%
      WHEN,WITH,WORDS,WORKING-STORAGE,WRITE,ZERO,ZEROES,ZEROS},%
   alsodigit=-,%
   sensitive=f,% ???
   morecomment=[f][commentstyle][6]*,%
   morestring=[d]"% ??? doubled
  }[keywords,comments,strings]%
\lst@definelanguage{Delphi}%
  {morekeywords={and,as,asm,array,begin,case,class,const,constructor,%
      destructor,div,do,downto,else,end,except,exports,file,finally,%
      for,function,goto,if,implementation,in,inherited,inline,%
      initialization,interface,is,label,library,mod,nil,not,object,of,%
      or,packed,procedure,program,property,raise,record,repeat,set,%
      shl,shr,string,then,to,try,type,unit,until,uses,var,while,with,%
      xor,%
      absolute,abstract,assembler,at,cdecl,default,dynamic,export,%
      external,far,forward,index,name,near,nodefault,on,override,%
      private,protected,public,published,read,resident,storedDir,%
      virtual,write},%
   morendkeywords={Abs,AddExitProc,Addr,AllocMem,AnsiCompareStr,%
      AnsiCompareText,AnsiLowerCase,AnsiUpperCase,Append,AppendStr,%
      ArcTan,AssignCrt,Assigned,AssignFile,BlockRead,BlockWrite,Break,%
      ChangeFileExt,ChDir,Chr,CloseFile,ClrEol,ClrScr,Concat,Continue,%
      Copy,Cos,CSeg,CursorTo,Date,DateTimeToFileDate,DateTimeToStr,%
      DateTimeToString,DateToStr,DayOfWeek,Dec,DecodeDate,DecodeTime,%
      Delete,DeleteFile,DiskFree,DiskSize,Dispose,DisposeStr,%
      DoneWinCrt,DSeg,EncodeDate,EncodeTime,Eof,Eoln,Erase,Exclude,%
      Exit,Exp,ExpandFileName,ExtractFileExt,ExtractFileName,%
      ExtractFilePath,FileAge,FileClose,FileDateToDateTime,FileExists,%
      FileGetAttr,FileGetDate,FileOpen,FilePos,FileRead,FileSearch,%
      FileSeek,FileSetAttr,FileSetDate,FileSize,FillChar,FindClose,%
      FindFirst,FindNext,FloatToDecimal,FloatToStrF,FloatToStr,%
      FloatToText,FloatToTextFmt,Flush,FmtLoadStr,FmtStr,Format,%
      FormatBuf,FormatDateTime,FormatFloat,Frac,Free,FreeMem,GetDir,%
      GetMem,GotoXY,Halt,Hi,High,Inc,Include,InitWinCrt,Insert,Int,%
      IntToHex,IntToStr,IOResult,IsValidIdent,KeyPressed,Length,Ln,Lo,%
      LoadStr,Low,LowerCase,MaxAvail,MemAvail,MkDir,Move,New,NewStr,%
      Now,Odd,Ofs,Ord,ParamCount,ParamStr,Pi,Pos,Pred,Ptr,Random,%
      Randomize,Read,ReadBuf,ReadKey,Readln,ReAllocMem,Rename,%
      RenameFile,Reset,Rewrite,RmDir,Round,RunError,ScrollTo,Seek,%
      SeekEof,SeekEoln,Seg,SetTextBuf,Sin,SizeOf,SPtr,Sqr,Sqrt,SSeg,%
      Str,StrCat,StrComp,StrCopy,StrDispose,StrECopy,StrEnd,StrFmt,%
      StrLCat,StrIComp,StrLComp,StrLCopy,StrLen,StrLFmt,StrLIComp,%
      StrLower,StrMove,StrNew,StrPas,StrPCopy,StrPos,StrScan,StrRScan,%
      StrToDate,StrToDateTime,StrToFloat,StrToInt,StrToIntDef,%
      StrToTime,StrUpper,Succ,Swap,TextToFloat,Time,TimeToStr,%
      TrackCursor,Trunc,Truncate,TypeOf,UpCase,UpperCase,Val,WhereX,%
      WhereY,Write,WriteBuf,WriteChar,Writeln},%
   sensitive=f,%
   morecomment=[s]{(*}{*)},%
   morecomment=[s]{\{}{\}},%
   morecomment=[l]{//},% 2001 Christian Gudrian
   morestring=[d]'%
  }[keywords,comments,strings]%
\lst@definelanguage{Eiffel}%
  {morekeywords={alias,all,and,as,BIT,BOOLEAN,CHARACTER,check,class,%
      creation,Current,debug,deferred,do,DOUBLE,else,elseif,end,%
      ensure,expanded,export,external,false,feature,from,frozen,if,%
      implies,indexing,infix,inherit,inspect,INTEGER,invariant,is,%
      like,local,loop,NONE,not,obsolete,old,once,or,POINTER,prefix,%
      REAL,redefine,rename,require,rescue,Result,retry,select,%
      separate,STRING,strip,then,true,undefine,unique,until,variant,%
      when,xor},%
   sensitive,%
   morecomment=[l]--,%
   morestring=[d]",%
  }[keywords,comments,strings]%
%%
%% Euphoria definition (c) 1998 Detlef Reimers
%%
\lst@definelanguage{Euphoria}%
  {morekeywords={abort,and,and_bits,append,arctan,atom,by,call,%
      call_proc,call_func,c_proc,c_func,clear_screen,close,%
      command_line,compare,constant,cos,do,date,else,elsif,end,exit,%
      find,floor,for,function,getc,getenv,get_key,gets,global,%
      get_pixel,if,include,integer,length,log,match,machine_func,%
      machine_proc,mem_copy,mem_set,not,not_bits,or,object,open,%
      or_bits,procedure,puts,position,prepend,print,printf,power,peek,%
      poke,pixel,poke4,peek4s,peek4u,return,rand,repeat,remainder,%
      routine_id,sequence,sqrt,sin,system,sprintf,then,type,to,time,%
      trace,tan,while,with,without,xor,xor_bits},%
   sensitive,%
   morecomment=[l]--,%
   morestring=[d]',%
   morestring=[d]"%
  }[keywords,comments,strings]%
%%
%% Guarded Command Language (GCL)  definition
%% (c) 2002 Mark van Eijk
%%
\lst@definelanguage{GCL}%
  {morekeywords={const,con,var,array,of,skip,if,fi,do,od,div,mod},%
   literate={|[}{\ensuremath{|\hskip -0.1em[}}2%
            {]|}{\ensuremath{]\hskip -0.1em|}}2%
    {[]}{\ensuremath{[\hskip -0.1em]}}2%
    {->}{\ensuremath{\rightarrow}~}2%
    {==}{\ensuremath{\equiv}~}2%
    {>=}{\ensuremath{\geq}~}2%
    {<=}{\ensuremath{\leq}~}2%
    {/\\}{\ensuremath{\land}~}2%
    {\\/}{\ensuremath{\lor}~}2%
    {!}{\ensuremath{\lnot}}1%
    {!=}{\ensuremath{\neq}~}2%
    {max}{\ensuremath{\uparrow}}1%
    {min}{\ensuremath{\downarrow}}1,%
   sensitive=f,%
   morecomment=[s]{\{}{\}},%
   morestring=[d]'%
  }[keywords,comments,strings]%
%%
%% gnuplot definition (c) Christoph Giess
%%
\lst@definelanguage{Gnuplot}%
  {keywords={abs,acos,acosh,arg,asin,asinh,atan,atan2,atanh,besj0,%
       besj1,besy0,besy1,ceil,cos,cosh,erf,erfc,exp,floor,gamma,ibeta,%
       inverf,igamma,imag,invnorm,int,lgamma,log,log10,norm,rand,real,%
       sgn,sin,sinh,sqrt,tan,tanh,column,tm_hour,tm_mday,tm_min,tm_mon,%
       tm_sec,tm_wday,tm_yday,tm_year,valid,cd,call,clear,exit,fit,%
       help,if,load,pause,plot,print,pwd,quit,replot,reread,reset,save,%
       set,show,shell,splot,test,update,angles,arrow,autoscale,border,%
       boxwidth,clabel,clip,cntrparam,contour,data,dgrid3d,dummy,%
       format,function,functions,grid,hidden3d,isosamples,key,keytitle,%
       label,logscale,mapping,offsets,output,parametric,pointsize,%
       polar,rrange,samples,size,style,surface,terminal,tics,time,%
       timefmt,title,trange,urange,variables,view,vrange,xdata,xlabel,%
       xmargin,xrange,xtics,mxtics,mytics,xdtics,xmtics,xzeroaxis,%
       ydata,ylabel,yrange,ytics,ydtics,ymtics,yzeroaxis,zdata,zero,%
       zeroaxis,zlabel,zrange,ztics,zdtics,zmtics,timefm,using,title,%
       with,index,every,thru,smooth},%
   sensitive,%
   comment=[l]\#,%
   morestring=[b]",%
   morestring=[b]',%
  }[keywords,comments,strings]%
%%
%% Haskell98 as implemented in Hugs98. See http://www.haskell.org
%% All keywords from Prelude and Standard Libraries
%% (c) 1999 Peter Bartke
%%
\lst@definelanguage{Haskell}%
  {otherkeywords={=>},%
   morekeywords={abstype,if,then,else,case,class,data,default,deriving,%
      hiding,if,in,infix,infixl,infixr,import,instance,let,module,%
      newtype,of,qualified,type,where,do,AbsoluteSeek,AppendMode,%
      Array,BlockBuffering,Bool,BufferMode,Char,Complex,Double,Either,%
      FilePath,Float,Int,Integer,IO,IOError,Ix,LineBuffering,Maybe,%
      Ordering,NoBuffering,ReadMode,ReadWriteMode,ReadS,RelativeSeek,%
      SeekFromEnd,SeekMode,ShowS,StdGen,String,Void,Bounded,Enum,Eq,%
      Eval,ExitCode,exitFailure,exitSuccess,Floating,Fractional,%
      Functor,Handle,HandlePosn,IOMode,Integral,List,Monad,MonadPlus,%
      MonadZero,Num,Numeric,Ord,Random,RandomGen,Ratio,Rational,Read,%
      Real,RealFloat,RealFrac,Show,System,Prelude,EQ,False,GT,Just,%
      Left,LT,Nothing,Right,WriteMode,True,abs,accum,accumArray,%
      accumulate,acos,acosh,all,and,any,ap,appendFile,applyM,%
      approxRational,array,asTypeOf,asin,asinh,assocs,atan,atan2,atanh,%
      bounds,bracket,bracket_,break,catch,catMaybes,ceiling,chr,cis,%
      compare,concat,concatMap,conjugate,const,cos,cosh,curry,cycle,%
      decodeFloat,delete,deleteBy,deleteFirstsBy,denominator,%
      digitToInt,div,divMod,drop,dropWhile,either,elem,elems,elemIndex,%
      elemIndices,encodeFloat,enumFrom,enumFromThen,enumFromThenTo,%
      enumFromTo,error,even,exitFailure,exitWith,exp,exponent,fail,%
      filter,filterM,find,findIndex,findIndices,flip,floatDigits,%
      floatRadix,floatRange,floatToDigits,floor,foldl,foldM,foldl1,%
      foldr,foldr1,fromDouble,fromEnum,fromInt,fromInteger,%
      fromIntegral,fromJust,fromMaybe,fromRat,fromRational,%
      fromRealFrac,fst,gcd,genericLength,genericTake,genericDrop,%
      genericSplitAt,genericIndex,genericReplicate,getArgs,getChar,%
      getContents,getEnv,getLine,getProgName,getStdGen,getStdRandom,%
      group,groupBy,guard,hClose,hFileSize,hFlush,hGetBuffering,%
      hGetChar,hGetContents,hGetLine,hGetPosn,hIsClosed,hIsEOF,hIsOpen,%
      hIsReadable,hIsSeekable,hIsWritable,hLookAhead,hPutChar,hPutStr,%
      hPutStrLn,hPrint,hReady,hSeek,hSetBuffering,hSetPosn,head,%
      hugsIsEOF,hugsHIsEOF,hugsIsSearchErr,hugsIsNameErr,%
      hugsIsWriteErr,id,ioError,imagPart,index,indices,init,inits,%
      inRange,insert,insertBy,interact,intersect,intersectBy,%
      intersperse,intToDigit,ioeGetErrorString,ioeGetFileName,%
      ioeGetHandle,isAlreadyExistsError,isAlreadyInUseError,isAlpha,%
      isAlphaNum,isAscii,isControl,isDenormalized,isDoesNotExistError,%
      isDigit,isEOF,isEOFError,isFullError,isHexDigit,isIEEE,%
      isIllegalOperation,isInfinite,isJust,isLower,isNaN,%
      isNegativeZero,isNothing,isOctDigit,isPermissionError,isPrefixOf,%
      isPrint,isSpace,isSuffixOf,isUpper,isUserError,iterate,ixmap,%
      join,last,lcm,length,lex,lexDigits,lexLitChar,liftM,liftM2,%
      liftM3,liftM4,liftM5,lines,listArray,listToMaybe,log,logBase,%
      lookup,magnitude,makePolar,map,mapAccumL,mapAccumR,mapAndUnzipM,%
      mapM,mapM_,mapMaybe,max,maxBound,maximum,maximumBy,maybe,%
      maybeToList,min,minBound,minimum,minimumBy,mkPolar,mkStdGen,%
      mplus,mod,msum,mzero,negate,next,newStdGen,not,notElem,nub,nubBy,%
      null,numerator,odd,openFile,or,ord,otherwise,partition,phase,pi,%
      polar,pred,print,product,properFraction,putChar,putStr,putStrLn,%
      quot,quotRem,random,randomIO,randomR,randomRIO,randomRs,randoms,%
      rangeSize,read,readDec,readFile,readFloat,readHex,readInt,readIO,%
      readList,readLitChar,readLn,readParen,readOct,readSigned,reads,%
      readsPrec,realPart,realToFrac,recip,rem,repeat,replicate,return,%
      reverse,round,scaleFloat,scanl,scanl1,scanr,scanr1,seq,sequence,%
      sequence_,setStdGen,show,showChar,showEFloat,showFFloat,%
      showFloat,showGFloat,showInt,showList,showLitChar,showParen,%
      showSigned,showString,shows,showsPrec,significand,signum,sin,%
      sinh,snd,sort,sortBy,span,split,splitAt,sqrt,stderr,stdin,stdout,%
      strict,subtract,succ,sum,system,tail,tails,take,takeWhile,tan,%
      tanh,toEnum,toInt,toInteger,toLower,toRational,toUpper,transpose,%
      truncate,try,uncurry,undefined,unfoldr,union,unionBy,unless,%
      unlines,until,unwords,unzip,unzip3,unzip4,unzip5,unzip6,unzip7,%
      userError,when,words,writeFile,zero,zip,zip3,zip4,zip5,zip6,zip7,%
      zipWith,zipWithM,zipWithM_,zipWith3,zipWith4,zipWith5,zipWith6,%
      zipWith7},%
   sensitive,%
   morecomment=[l]--,%
   morecomment=[n]{\{-}{-\}},%
   morestring=[b]"%
  }[keywords,comments,strings]%
%%
%% IDL definition (c) 1998 Juergen Heim
%%
\lst@definelanguage{IDL}%
  {morekeywords={and,begin,case,common,do,else,end,endcase,endelse,%
      endfor,endif,endrep,endwhile,eq,for,function,ge,goto,gt,if,le,lt,%
      mod,ne,not,of,on_ioerror,or,pro,repeat,return,then,until,while,%
      xor,on_error,openw,openr,openu,print,printf,printu,plot,read,%
      readf,readu,writeu,stop},%
   sensitive=f,%
   morecomment=[l];,%
   morestring=[d]'%
  }[keywords,comments,strings]%
\lst@definelanguage{Lisp}%
  {morekeywords={abort,abs,acons,acos,acosh,adjoin,alphanumericp,alter,%
      append,apply,apropos,aref,arrayp,ash,asin,asinh,assoc,atan,atanh,%
      atom,bit,boole,boundp,break,butlast,byte,catenate,ceiling,cerror,%
      char,character,characterp,choose,chunk,cis,close,clrhash,coerce,%
      collect,commonp,compile,complement,complex,complexp,concatenate,%
      conjugate,cons,consp,constantp,continue,cos,cosh,cotruncate,%
      count,delete,denominator,describe,directory,disassemble,%
      documentation,dpb,dribble,ed,eighth,elt,enclose,endp,eq,eql,%
      equal,equalp,error,eval,evalhook,evenp,every,exp,expand,export,%
      expt,fboundp,fceiling,fdefinition,ffloor,fifth,fill,find,first,%
      float,floatp,floor,fmakunbound,format,fourth,fround,ftruncate,%
      funcall,functionp,gatherer,gcd,generator,gensym,gentemp,get,getf,%
      gethash,identity,imagpart,import,inspect,integerp,intern,%
      intersection,tively,isqrt,keywordp,last,latch,lcm,ldb,ldiff,%
      length,list,listen,listp,load,log,logand,logbitp,logcount,logeqv,%
      logior,lognand,lognor,lognot,logtest,logxor,macroexpand,%
      makunbound,map,mapc,mapcan,mapcar,mapcon,maphash,mapl,maplist,%
      mask,max,member,merge,min,mingle,minusp,mismatch,mod,namestring,%
      nbutlast,nconc,nintersection,ninth,not,notany,notevery,nreconc,%
      nreverse,nsublis,nsubst,nth,nthcdr,null,numberp,numerator,nunion,%
      oddp,open,packagep,pairlis,pathname,pathnamep,phase,plusp,%
      position,positions,pprint,previous,princ,print,proclaim,provide,%
      random,rassoc,rational,rationalize,rationalp,read,readtablep,%
      realp,realpart,reduce,rem,remhash,remove,remprop,replace,require,%
      rest,revappend,reverse,room,round,rplaca,rplacd,sbit,scan,schar,%
      search,second,series,set,seventh,shadow,signal,signum,sin,sinh,%
      sixth,sleep,some,sort,split,sqrt,streamp,string,stringp,sublis,%
      subseq,subseries,subsetp,subst,substitute,subtypep,svref,sxhash,%
      symbolp,tailp,tan,tanh,tenth,terpri,third,truename,truncate,%
      typep,unexport,unintern,union,until,values,vector,vectorp,warn,%
      write,zerop,and,assert,case,ccase,cond,ctypecase,decf,declaim,%
      defclass,defconstant,defgeneric,defmacro,defmethod,defpackage,%
      defparameter,defsetf,defstruct,deftype,defun,defvar,do,dolist,%
      dotimes,ecase,encapsulated,etypecase,flet,formatter,gathering,%
      incf,iterate,labels,let,locally,loop,macrolet,mapping,or,pop,%
      producing,prog,psetf,psetq,push,pushnew,remf,return,rotatef,%
      setf,shiftf,step,time,trace,typecase,unless,untrace,when},%
   sensitive,% ???
   alsodigit=-,%
   morecomment=[l];,%
   morecomment=[s]{\#|}{|\#},% 1997 Aslak Raanes
   morestring=[b]"%
  }[keywords,comments,strings]%
%%
%% AutoLISP/VisualLISP - Stefan Lagotzki, info@lagotzki.de
%%
\lst@definelanguage[Auto]{Lisp}%
  {morekeywords={abs,acad_colordlg,acad_helpdlg,acad_strlsort,%
      action_tile,add_list,alert,alloc,and,angle,angtof,angtos,append,%
      apply,arx,arxload,arxunload,ascii,assoc,atan,atof,atoi,atom,%
      atoms-family,autoarxload,autoload,Boole,boundp,caddr,cadr,car,%
      cdr,chr,client_data_tile,close,command,cond,cons,cos,cvunit,%
      defun,defun-q,defun-q-list-ref,defun-q-list-set,dictadd,dictnext,%
      dictremove,dictrename,dictsearch,dimx_tile,dimy_tile,distance,%
      distof,done_dialog,end_image,end_list,entdel,entget,entlast,%
      entmake,entmakex,entmod,entnext,entsel,entupd,eq,equal,*error*,%
      eval,exit,exp,expand,expt,fill_image,findfile,fix,float,foreach,%
      function,gc,gcd,get_attr,get_tile,getangle,getcfg,getcname,%
      getcorner,getdist,getenv,getfiled,getint,getkword,getorient,%
      getpoint,getreal,getstring,getvar,graphscr,grclear,grdraw,grread,%
      grtext,grvecs,handent,help,if,initdia,initget,inters,itoa,lambda,%
      last,layoutlist,length,list,listp,load,load_dialog,log,logand,%
      logior,lsh,mapcar,max,mem,member,menucmd,menugroup,min,minusp,%
      mode_tile,namedobjdict,nentsel,nentselp,new_dialog,not,nth,%
      null,numberp,open,or,osnap,polar,prin1,princ,print,progn,prompt,%
      quit,quote,read,read-char,read-line,redraw,regapp,rem,repeat,%
      reverse,rtos,set,set_tile,setcfg,setenv,setfunhelp,setq,%
      setvar,setview,sin,slide_image,snvalid,sqrt,ssadd,ssdel,ssget,%
      ssgetfirst,sslength,ssmemb,ssname,ssnamex,sssetfirst,startapp,%
      start_dialog,start_image,start_list,strcase,strcat,strlen,subst,%
      substr,tablet,tblnext,tblobjname,tblsearch,term_dialog,terpri,%
      textbox,textpage,textscr,trace,trans,type,unload_dialog,untrace,%
      vector_image,ver,vl-acad-defun,vl-acad-undefun,vl-arx-import,%
      vl-bb-ref,vl-bb-set,vl-catch-all-apply,%
      vl-catch-all-error-message,vl-catch-all-error-p,vl-cmdf,vl-consp,%
      vl-directory-files,vl-doc-export,vl-doc-import,vl-doc-ref,%
      vl-doc-set,vl-every,vl-exit-with-error,vl-exit-with-value,%
      vl-file-copy,vl-file-delete,vl-file-directory-p,vl-file-rename,%
      vl-file-size,vl-file-systime,vl-filename-base,%
      vl-filename-directory,vl-filename-extension,vl-filename-mktemp,%
      vl-get-resource,vl-list*,vl-list->string,%
      vl-list-exported-functions,vl-list-length,vl-list-loaded-vlx,%
      vl-load-all,vl-load-com,vl-load-reactors,vl-member-if,%
      vl-member-if-not,vl-position,vl-prin1-to-string,%
      vl-princ-to-string,vl-propagate,vl-registry-delete,%
      vl-registry-descendents,vl-registry-read,vl-registry-write,%
      vl-remove,vl-remove-if,vl-remove-if-not,vl-some,vl-sort,%
      vl-sort-i,vl-string->list,vl-string-elt,vl-string-left-trim,%
      vl-string-mismatch,vl-string-position,vl-string-right-trim,%
      vl-string-search,vl-string-subst,vl-string-translate,%
      vl-string-trim,vl-symbol-name,vl-symbol-value,vl-symbolp,%
      vl-unload-vlx,vl-vbaload,vl-vbarun,vl-vlx-loaded-p,vlax-3D-point,%
      vlax-add-cmd,vlax-create-object,vlax-curve-getArea,%
      vlax-curve-getDistAtParam,vlax-curve-getDistAtPoint,%
      vlax-curve-getEndParam,vlax-curve-getEndPoint,%
      vlax-curve-getParamAtDist,vlax-curve-getParamAtPoint,%
      vlax-curve-getPointAtDist,vlax-curve-getPointAtParam,%
      vlax-curve-getStartParam,vlax-curve-getStartPoint,%
      vlax-curve-isClosed,vlax-curve-isPeriodic,vlax-curve-isPlanar,%
      vlax-curve-getClosestPointTo,%
      vlax-curve-getClosestPointToProjection,vlax-curve-getFirstDeriv,%
      vlax-curve-getSecondDeriv,vlax-dump-object,%
      vlax-ename->vla-object,vlax-erased-p,vlax-for,%
      vlax-get-acad-object,vlax-get-object,vlax-get-or-create-object,%
      vlax-get-property,vlax-import-type-library,vlax-invoke-method,%
      vlax-ldata-delete,vlax-ldata-get,vlax-ldata-list,vlax-ldata-put,%
      vlax-ldata-test,vlax-make-safearray,vlax-make-variant,%
      vlax-map-collection,vlax-method-applicable-p,%
      vlax-object-released-p,vlax-product-key,%
      vlax-property-available-p,vlax-put-property,vlax-read-enabled-p,%
      vlax-release-object,vlax-remove-cmd,vlax-safearray-fill,%
      vlax-safearray-get-dim,vlax-safearray-get-element,%
      vlax-safearray-get-l-bound,vlax-safearray-get-u-bound,%
      vlax-safearray-put-element,vlax-safearray-type,%
      vlax-safearray->list,vlax-tmatrix,vlax-typeinfo-available-p,%
      vlax-variant-change-type,vlax-variant-type,vlax-variant-value,%
      vlax-vla-object->ename,vlax-write-enabled-p,vlisp-compile,%
      vlr-acdb-reactor,vlr-add,vlr-added-p,vlr-beep-reaction,%
      vlr-command-reactor,vlr-current-reaction-name,vlr-data,%
      vlr-data-set,vlr-deepclone-reactor,vlr-docmanager-reactor,%
      vlr-dwg-reactor,vlr-dxf-reactor,vlr-editor-reactor,%
      vlr-insert-reactor,vlr-linker-reactor,vlr-lisp-reactor,%
      vlr-miscellaneous-reactor,vlr-mouse-reactor,vlr-notification,%
      vlr-object-reactor,vlr-owner-add,vlr-owner-remove,vlr-owners,%
      vlr-pers,vlr-pers-list,vlr-pers-p,vlr-pers-release,%
      vlr-reaction-names,vlr-reaction-set,vlr-reactions,vlr-reactors,%
      vlr-remove,vlr-remove-all,vlr-set-notification,%
      vlr-sysvar-reactor,vlr-toolbar-reactor,vlr-trace-reaction,%
      vlr-type,vlr-types,vlr-undo-reactor,vlr-wblock-reactor,%
      vlr-window-reactor,vlr-xref-reactor,vports,wcmatch,while,%
      write-char,write-line,xdroom,xdsize,zerop},%
   alsodigit=->,%
   otherkeywords={1+,1-},%
   sensitive=false,%
   morecomment=[l];,%
   morecomment=[l];;,%
   morestring=[b]"%
  }[keywords,comments,strings]%
%%
%% Make definitions (c) 2000 Rolf Niepraschk
%%
\lst@definelanguage[gnu]{make}%
  {morekeywords={SHELL,MAKE,MAKEFLAGS,$@,$\%,$<,$?,$^,$+,$*,%
      @,^,<,\%,+,?,*,% Markus Pahlow
      export,unexport,include,override,define,ifdef,ifneq,ifeq,else,%
      endif,vpath,subst,patsubst,strip,findstring,filter,filter-out,%
      sort,dir,notdir,suffix,basename,addsuffix,addprefix,join,word,%
      words,firstword,wildcard,shell,origin,foreach,%
      @D,@F,*D,*F,\%D,\%F,<D,<F,^D,^F,+D,+F,?D,?F,%
      AR,AS,CC,CXX,CO,CPP,FC,GET,LEX,PC,YACC,YACCR,MAKEINFO,TEXI2DVI,%
      WEAVE,CWEAVE,TANGLE,CTANGLE,RM,M2C,LINT,COMPILE,LINK,PREPROCESS,%
      CHECKOUT,%
      ARFLAGS,ASFLAGS,CFLAGS,CXXFLAGS,COFLAGS,CPPFLAGS,FFLAGS,GFLAGS,%
      LDFLAGS,LOADLIBES,LFLAGS,PFLAGS,RFLAGS,YFLAGS,M2FLAGS,MODFLAGS,%
      LINTFLAGS,MAKEINFO_FLAGS,TEXI2DVI_FLAGS,COFLAGS,GFLAGS,%
      OUTPUT_OPTION,SCCS_OUTPUT_OPTION,% missing comma: Markus Pahlow
      .PHONY,.SUFFIXES,.DEFAULT,.PRECIOUS,.INTERMEDIATE,.SECONDARY,%
      .IGNORE,.SILENT,.EXPORT_ALL_VARIABLES,MAKEFILES,VPATH,MAKESHELL,%
      MAKELEVEL,MAKECMDGOALS,SUFFIXES},%
   sensitive=true,
   morecomment=[l]\#,%
   morestring=[b]"%
  }[keywords,comments,strings,make]%
\lst@definelanguage{make}
  {morekeywords={SHELL,MAKE,MAKEFLAGS,$@,$\%,$<,$?,$^,$+,$*},%
   sensitive=true,%
   morecomment=[l]\#,%
   morestring=[b]"%
  }[keywords,comments,strings,make]%
%%
%% Mercury definition (c) 1997 Dominique de Waleffe
%% Extended (c) 2001 Ralph Becket
%%
\lst@definelanguage{Mercury}%
  {otherkeywords={::,->,-->,--->,:-,==,=>,<=,<=>},%
   morekeywords={module,include_module,import_module,interface,%
      end_module,implementation,mode,is,failure,semidet,nondet,det,%
      multi,erroneous,inst,in,out,di,uo,ui,type,typeclass,instance,%
      where,with_type,pred,func,lambda,impure,semipure,if,then,else,%
      some,all,not,true,fail,pragma,memo,no_inline,inline,loop_check,%
      minimal_model,fact_table,type_spec,terminates,does_not_terminate,%
      check_termination,promise_only_solution,unsafe_promise_unique,%
      source_file,obsolete,import,export,c_header_code,c_code,%
      foreign_code,foreign_proc,may_call_mercury,will_not_call_mercury,%
      thread_safe,not_thread_safe},%
   sensitive=t,%
   morecomment=[l]\%,%
   morecomment=[s]{/*}{*/},%
   morestring=[bd]",%
   morestring=[bd]'%
  }[keywords,comments,strings]%
%%
%% Miranda definition (c) 1998 Peter Bartke
%%
%% Miranda: pure lazy functional language with polymorphic type system,
%%          garbage collection and functions as first class citizens
%%
\lst@definelanguage{Miranda}%
  {morekeywords={abstype,div,if,mod,otherwise,readvals,show,type,where,%
     with,bool,char,num,sys_message,False,True,Appendfile,Closefile,%
     Exit,Stderr,Stdout,System,Tofile,\%include,\%export,\%free,%
     \%insert,abs,and,arctan,cjustify,code,concat,const,converse,cos,%
     decode,digit,drop,dropwhile,entier,error,exp,filemode,filter,%
     foldl,foldl1,foldr,foldr1,force,fst,getenv,hd,hugenum,id,index,%
     init,integer,iterate,last,lay,layn,letter,limit,lines,ljustify,%
     log,log10,map,map2,max,max2,member,merge,min,min2,mkset,neg,%
     numval,or,pi,postfix,product,read,rep,repeat,reverse,rjustify,%
     scan,seq,showfloat,shownum,showscaled,sin,snd,sort,spaces,sqrt,%
     subtract,sum,system,take,takewhile,tinynum,tl,transpose,undef,%
     until,zip2,zip3,zip4,zip5,zip6,zip},%
   sensitive,%
   morecomment=[l]||,%
   morestring=[b]"%
  }[keywords,comments,strings]%
%%
%% ML definition (c) 1999 Torben Hoffmann
%%
\lst@definelanguage{ML}%
  {morekeywords={abstype,and,andalso,as,case,do,datatype,else,end,%
       eqtype,exception,fn,fun,functor,handle,if,in,include,infix,%
       infixr,let,local,nonfix,of,op,open,orelse,raise,rec,sharing,sig,%
       signature,struct,structure,then,type,val,with,withtype,while},%
   sensitive,%
   morecomment=[n]{(*}{*)},%
   morestring=[d]"%
  }[keywords,comments,strings]%
%%
%% PHP definition by Luca Balzerani
%%
\lst@definelanguage{PHP}%
  {morekeywords={%
  %--- core language
    <?,?>,::,break,case,continue,default,do,else,%
    elseif,for,foreach,if,include,require,phpinfo,%
    switch,while,false,FALSE,true,TRUE,%
  %--- apache functions
    apache_lookup_uri,apache_note,ascii2ebcdic,ebcdic2ascii,%
    virtual,apache_child_terminate,apache_setenv,%
  %--- array functions
    array,array_change_key_case,array_chunk,array_count_values,%
    array_filter,array_flip,array_fill,array_intersect,%
    array_keys,array_map,array_merge,array_merge_recursive,%
    array_pad,array_pop,array_push,array_rand,array_reverse,%
    array_shift,array_slice,array_splice,array_sum,array_unique,%
    array_values,array_walk,arsort,asort,compact,count,current,each,%
    extract,in_array,array_search,key,krsort,ksort,list,natsort,%
    next,pos,prev,range,reset,rsort,shuffle,sizeof,sort,uasort,%
    usort,%
  %--- aspell functions
    aspell_new,aspell_check,aspell_check_raw,aspell_suggest,%
  %--- bc functions
    bcadd,bccomp,bcdiv,bcmod,bcmul,bcpow,bcscale,bcsqrt,bcsub,%
  %--- bzip2 functions
    bzclose,bzcompress,bzdecompress,bzerrno,bzerror,bzerrstr,%
    bzopen,bzread,bzwrite,%
  %--- calendar functions
    JDToGregorian,GregorianToJD,JDToJulian,JulianToJD,JDToJewish,%
    JDToFrench,FrenchToJD,JDMonthName,JDDayOfWeek,easter_date,%
    unixtojd,jdtounix,cal_days_in_month,cal_to_jd,cal_from_jd,%
  %--- ccvs functions
    ccvs_init,ccvs_done,ccvs_new,ccvs_add,ccvs_delete,ccvs_auth,%
    ccvs_reverse,ccvs_sale,ccvs_void,ccvs_status,ccvs_count,%
    ccvs_report,ccvs_command,ccvs_textvalue,%
  %--- classobj functions
    call_user_method,call_user_method_array,class_exists,get_class,%
    get_class_vars,get_declared_classes,get_object_vars,%
    is_a,is_subclass_of,method_exists,%
  %--- com functions
    COM,VARIANT,com_load,com_invoke,com_propget,com_get,com_propput,%
    com_set,com_addref,com_release,com_isenum,com_load_typelib,%
  %--- cpdf functions
    cpdf_add_annotation,cpdf_add_outline,cpdf_arc,cpdf_begin_text,%
    cpdf_clip,cpdf_close,cpdf_closepath,cpdf_closepath_fill_stroke,%
    cpdf_continue_text,cpdf_curveto,cpdf_end_text,cpdf_fill,%
    cpdf_finalize,cpdf_finalize_page,%
    cpdf_import_jpeg,cpdf_lineto,cpdf_moveto,cpdf_newpath,cpdf_open,%
    cpdf_page_init,cpdf_place_inline_image,cpdf_rect,cpdf_restore,%
    cpdf_rmoveto,cpdf_rotate,cpdf_rotate_text,cpdf_save,%
    cpdf_scale,cpdf_set_char_spacing,cpdf_set_creator,%
    cpdf_set_font,cpdf_set_horiz_scaling,cpdf_set_keywords,%
    cpdf_set_page_animation,cpdf_set_subject,cpdf_set_text_matrix,%
    cpdf_set_text_rendering,cpdf_set_text_rise,cpdf_set_title,%
    cpdf_setdash,cpdf_setflat,cpdf_setgray,cpdf_setgray_fill,%
    cpdf_setlinecap,cpdf_setlinejoin,cpdf_setlinewidth,%
    cpdf_setrgbcolor,cpdf_setrgbcolor_fill,cpdf_setrgbcolor_stroke,%
    cpdf_show_xy,cpdf_stringwidth,cpdf_set_font_directories,%
    cpdf_set_viewer_preferences,cpdf_stroke,cpdf_text,%
    cpdf_set_action_url,%
  %--- crack functions
    crack_opendict,crack_closedict,crack_check,crack_getlastmessage,%
  %--- ctype functions
    ctype_alnum,ctype_alpha,ctype_cntrl,ctype_digit,ctype_lower,%
    ctype_print,ctype_punct,ctype_space,ctype_upper,ctype_xdigit,%
  %--- curl functions
    curl_init,curl_setopt,curl_exec,curl_close,curl_version,%
    curl_error,curl_getinfo,%
  %--- cybercash functions
    cybercash_encr,cybercash_decr,cybercash_base64_encode,%
  %--- cybermut functions
    cybermut_creerformulairecm,cybermut_testmac,%
  %--- cyrus functions
    cyrus_connect,cyrus_authenticate,cyrus_bind,cyrus_unbind,%
    cyrus_close,%
  %--- datetime functions
    checkdate,date,getdate,gettimeofday,gmdate,gmmktime,gmstrftime,%
    microtime,mktime,strftime,time,strtotime,%
  %--- dbase functions
    dbase_create,dbase_open,dbase_close,dbase_pack,dbase_add_record,%
    dbase_delete_record,dbase_get_record,%
    dbase_numfields,dbase_numrecords,%
  %--- dba functions
    dba_close,dba_delete,dba_exists,dba_fetch,dba_firstkey,%
    dba_nextkey,dba_popen,dba_open,dba_optimize,dba_replace,%
  %--- dbm functions
    dbmopen,dbmclose,dbmexists,dbmfetch,dbminsert,dbmreplace,%
    dbmfirstkey,dbmnextkey,dblist,%
  %--- dbx functions
    dbx_close,dbx_connect,dbx_error,dbx_query,dbx_sort,dbx_compare,%
  %--- dio functions
    dio_open,dio_read,dio_write,dio_truncate,dio_stat,dio_seek,%
    dio_close,%
  %--- dir functions
    chroot,chdir,dir,closedir,getcwd,opendir,readdir,rewinddir,%
  %--- dotnet functions
    dotnet_load,%
  %--- errorfunc functions
    error_log,error_reporting,restore_error_handler,%
    trigger_error,user_error,%
  %--- exec functions
    escapeshellarg,escapeshellcmd,exec,passthru,system,shell_exec,%
  %--- fbsql functions
    fbsql_affected_rows,fbsql_autocommit,fbsql_change_user,%
    fbsql_commit,fbsql_connect,fbsql_create_db,fbsql_create_blob,%
    fbsql_database_password,fbsql_data_seek,fbsql_db_query,%
    fbsql_drop_db,fbsql_errno,fbsql_error,fbsql_fetch_array,%
    fbsql_fetch_field,fbsql_fetch_lengths,fbsql_fetch_object,%
    fbsql_field_flags,fbsql_field_name,fbsql_field_len,%
    fbsql_field_table,fbsql_field_type,fbsql_free_result,%
    fbsql_list_dbs,fbsql_list_fields,fbsql_list_tables,%
    fbsql_num_fields,fbsql_num_rows,fbsql_pconnect,fbsql_query,%
    fbsql_read_clob,fbsql_result,fbsql_rollback,fbsql_set_lob_mode,%
    fbsql_start_db,fbsql_stop_db,fbsql_tablename,fbsql_warnings,%
    fbsql_get_autostart_info,fbsql_hostname,fbsql_password,%
    fbsql_username,%
  %--- fdf functions
    fdf_open,fdf_close,fdf_create,fdf_save,fdf_get_value,%
    fdf_next_field_name,fdf_set_ap,fdf_set_status,fdf_get_status,%
    fdf_get_file,fdf_set_flags,fdf_set_opt,%
    fdf_set_javascript_action,fdf_set_encoding,fdf_add_template,%
  %--- filepro functions
    filepro,filepro_fieldname,filepro_fieldtype,filepro_fieldwidth,%
    filepro_fieldcount,filepro_rowcount,%
  %--- filesystem functions
    basename,chgrp,chmod,chown,clearstatcache,copy,delete,dirname,%
    diskfreespace,disk_total_space,fclose,feof,fflush,fgetc,fgetcsv,%
    fgetss,file_get_contents,file,file_exists,fileatime,filectime,%
    fileinode,filemtime,fileowner,fileperms,filesize,filetype,flock,%
    fopen,fpassthru,fputs,fread,fscanf,fseek,fstat,ftell,ftruncate,%
    set_file_buffer,is_dir,is_executable,is_file,is_link,%
    is_writable,is_writeable,is_uploaded_file,link,linkinfo,mkdir,%
    parse_ini_file,pathinfo,pclose,popen,readfile,readlink,rename,%
    rmdir,stat,lstat,realpath,symlink,tempnam,tmpfile,touch,umask,%
  %--- fribidi functions
    fribidi_log2vis,%
  %--- ftp functions
    ftp_connect,ftp_login,ftp_pwd,ftp_cdup,ftp_chdir,ftp_mkdir,%
    ftp_nlist,ftp_rawlist,ftp_systype,ftp_pasv,ftp_get,ftp_fget,%
    ftp_fput,ftp_size,ftp_mdtm,ftp_rename,ftp_delete,ftp_site,%
    ftp_quit,ftp_exec,ftp_set_option,ftp_get_option,%
  %--- funchand functions
    call_user_func_array,call_user_func,create_function,%
    func_get_args,func_num_args,function_exists,%
    register_shutdown_function,register_tick_function,%
  %--- gettext functions
    bindtextdomain,bind_textdomain_codeset,dcgettext,dcngettext,%
    dngettext,gettext,ngettext,textdomain,%
  %--- gmp functions
    gmp_init,gmp_intval,gmp_strval,gmp_add,gmp_sub,gmp_mul,%
    gmp_div_r,gmp_div_qr,gmp_div,gmp_mod,gmp_divexact,gmp_cmp,%
    gmp_com,gmp_abs,gmp_sign,gmp_fact,gmp_sqrt,gmp_sqrtrm,%
    gmp_pow,gmp_powm,gmp_prob_prime,gmp_gcd,gmp_gcdext,gmp_invert,%
    gmp_jacobi,gmp_random,gmp_and,gmp_or,gmp_xor,gmp_setbit,%
    gmp_scan0,gmp_scan1,gmp_popcount,gmp_hamdist,%
  %--- http functions
    header,headers_sent,setcookie,%
  %--- hw functions
    hw_Array2Objrec,hw_Children,hw_ChildrenObj,hw_Close,hw_Connect,%
    hw_Deleteobject,hw_DocByAnchor,hw_DocByAnchorObj,%
    hw_Document_BodyTag,hw_Document_Content,hw_Document_SetContent,%
    hw_ErrorMsg,hw_EditText,hw_Error,hw_Free_Document,hw_GetParents,%
    hw_GetChildColl,hw_GetChildCollObj,hw_GetRemote,%
    hw_GetSrcByDestObj,hw_GetObject,hw_GetAndLock,hw_GetText,%
    hw_GetObjectByQueryObj,hw_GetObjectByQueryColl,%
    hw_GetChildDocColl,hw_GetChildDocCollObj,hw_GetAnchors,%
    hw_Mv,hw_Identify,hw_InCollections,hw_Info,hw_InsColl,hw_InsDoc,%
    hw_InsertObject,hw_mapid,hw_Modifyobject,hw_New_Document,%
    hw_Output_Document,hw_pConnect,hw_PipeDocument,hw_Root,%
    hw_Who,hw_getusername,hw_stat,hw_setlinkroot,hw_connection_info,%
    hw_insertanchors,hw_getrellink,hw_changeobject,%
  %--- ibase functions
    ibase_connect,ibase_pconnect,ibase_close,ibase_query,%
    ibase_fetch_row,ibase_fetch_object,ibase_field_info,%
    ibase_free_result,ibase_prepare,ibase_execute,ibase_trans,%
    ibase_rollback,ibase_timefmt,ibase_num_fields,ibase_blob_add,%
    ibase_blob_close,ibase_blob_create,ibase_blob_echo,%
    ibase_blob_import,ibase_blob_info,ibase_blob_open,%
  %--- icap functions
    icap_open,icap_close,icap_fetch_event,icap_list_events,%
    icap_delete_event,icap_snooze,icap_list_alarms,%
    icap_rename_calendar,icap_delete_calendar,icap_reopen,%
  %--- iconv functions
    iconv,iconv_get_encoding,iconv_set_encoding,ob_iconv_handler,%
  %--- ifx functions
    ifx_connect,ifx_pconnect,ifx_close,ifx_query,ifx_prepare,ifx_do,%
    ifx_errormsg,ifx_affected_rows,ifx_getsqlca,ifx_fetch_row,%
    ifx_fieldtypes,ifx_fieldproperties,ifx_num_fields,ifx_num_rows,%
    ifx_create_char,ifx_free_char,ifx_update_char,ifx_get_char,%
    ifx_copy_blob,ifx_free_blob,ifx_get_blob,ifx_update_blob,%
    ifx_textasvarchar,ifx_byteasvarchar,ifx_nullformat,%
    ifxus_free_slob,ifxus_close_slob,ifxus_open_slob,%
    ifxus_seek_slob,ifxus_read_slob,ifxus_write_slob,%
  %--- iisfunc functions
    iis_get_server_by_path,iis_get_server_by_comment,iis_add_server,%
    iis_set_dir_security,iis_get_dir_security,iis_set_server_rights,%
    iis_set_script_map,iis_get_script_map,iis_set_app_settings,%
    iis_stop_server,iis_stop_service,iis_start_service,%
  %--- image functions
    exif_imagetype,exif_read_data,exif_thumbnail,getimagesize,%
    imagealphablending,imagearc,imagefilledarc,imageellipse,%
    imagechar,imagecharup,imagecolorallocate,imagecolordeallocate,%
    imagecolorclosest,imagecolorclosestalpha,imagecolorclosestthwb,%
    imagecolorexactalpha,imagecolorresolve,imagecolorresolvealpha,%
    imagecolorset,imagecolorsforindex,imagecolorstotal,%
    imagecopy,imagecopymerge,imagecopymergegray,imagecopyresized,%
    imagecreate,imagecreatetruecolor,imagetruecolortopalette,%
    imagecreatefromgd2,imagecreatefromgd2part,imagecreatefromgif,%
    imagecreatefrompng,imagecreatefromwbmp,imagecreatefromstring,%
    imagecreatefromxpm,imagedashedline,imagedestroy,imagefill,%
    imagefilledrectangle,imagefilltoborder,imagefontheight,%
    imagegd,imagegd2,imagegif,imagepng,imagejpeg,imagewbmp,%
    imageline,imageloadfont,imagepalettecopy,imagepolygon,%
    imagepsencodefont,imagepsfreefont,imagepsloadfont,%
    imagepsslantfont,imagepstext,imagerectangle,imagesetpixel,%
    imagesetstyle,imagesettile,imagesetthickness,imagestring,%
    imagesx,imagesy,imagettfbbox,imageftbbox,imagettftext,%
    imagetypes,jpeg2wbmp,png2wbmp,iptcembed,read_exif_data,%
  %--- imap functions
    imap_8bit,imap_alerts,imap_append,imap_base64,imap_binary,%
    imap_bodystruct,imap_check,imap_clearflag_full,imap_close,%
    imap_delete,imap_deletemailbox,imap_errors,imap_expunge,%
    imap_fetchbody,imap_fetchheader,imap_fetchstructure,%
    imap_getmailboxes,imap_getsubscribed,imap_header,%
    imap_headers,imap_last_error,imap_listmailbox,%
    imap_mail,imap_mail_compose,imap_mail_copy,imap_mail_move,%
    imap_mime_header_decode,imap_msgno,imap_num_msg,imap_num_recent,%
    imap_ping,imap_popen,imap_qprint,imap_renamemailbox,imap_reopen,%
    imap_rfc822_parse_headers,imap_rfc822_write_address,%
    imap_search,imap_setacl,imap_set_quota,imap_setflag_full,%
    imap_status,imap_subscribe,imap_uid,imap_undelete,%
    imap_utf7_decode,imap_utf7_encode,imap_utf8,imap_thread,%
  %--- info functions
    assert,assert_options,extension_loaded,dl,getenv,get_cfg_var,%
    get_defined_constants,get_extension_funcs,getmygid,%
    get_loaded_extensions,get_magic_quotes_gpc,%
    getlastmod,getmyinode,getmypid,getmyuid,get_required_files,%
    ini_alter,ini_get,ini_get_all,ini_restore,ini_set,phpcredits,%
    phpversion,php_logo_guid,php_sapi_name,php_uname,putenv,%
    set_time_limit,version_compare,zend_logo_guid,zend_version,%
  %--- ircg functions
    ircg_pconnect,ircg_fetch_error_msg,ircg_set_current,ircg_join,%
    ircg_msg,ircg_notice,ircg_nick,ircg_topic,ircg_channel_mode,%
    ircg_whois,ircg_kick,ircg_ignore_add,ircg_ignore_del,%
    ircg_is_conn_alive,ircg_lookup_format_messages,%
    ircg_set_on_die,ircg_set_file,ircg_get_username,%
    ircg_nickname_unescape,%
  %--- java functions
    java_last_exception_clear,java_last_exception_get,%
  %--- ldap functions
    ldap_add,ldap_bind,ldap_close,ldap_compare,ldap_connect,%
    ldap_delete,ldap_dn2ufn,ldap_err2str,ldap_errno,ldap_error,%
    ldap_first_attribute,ldap_first_entry,ldap_free_result,%
    ldap_get_dn,ldap_get_entries,ldap_get_option,ldap_get_values,%
    ldap_list,ldap_modify,ldap_mod_add,ldap_mod_del,%
    ldap_next_attribute,ldap_next_entry,ldap_read,ldap_rename,%
    ldap_set_option,ldap_unbind,ldap_8859_to_t61,%
    ldap_next_reference,ldap_parse_reference,ldap_parse_result,%
    ldap_sort,ldap_start_tls,ldap_t61_to_8859,%
  %--- mail functions
    mail,ezmlm_hash,%
  %--- math functions
    abs,acos,acosh,asin,asinh,atan,atanh,atan2,base_convert,bindec,%
    cos,cosh,decbin,dechex,decoct,deg2rad,exp,expm1,floor,%
    hexdec,hypot,is_finite,is_infinite,is_nan,lcg_value,log,log10,%
    max,min,mt_rand,mt_srand,mt_getrandmax,number_format,octdec,pi,%
    rad2deg,rand,round,sin,sinh,sqrt,srand,tan,tanh,%
  %--- mbstring functions
    mb_language,mb_parse_str,mb_internal_encoding,mb_http_input,%
    mb_detect_order,mb_substitute_character,mb_output_handler,%
    mb_strlen,mb_strpos,mb_strrpos,mb_substr,mb_strcut,mb_strwidth,%
    mb_convert_encoding,mb_detect_encoding,mb_convert_kana,%
    mb_decode_mimeheader,mb_convert_variables,%
    mb_decode_numericentity,mb_send_mail,mb_get_info,%
    mb_ereg,mb_eregi,mb_ereg_replace,mb_eregi_replace,mb_split,%
    mb_ereg_search,mb_ereg_search_pos,mb_ereg_search_regs,%
    mb_ereg_search_getregs,mb_ereg_search_getpos,%
  %--- mcal functions
    mcal_open,mcal_popen,mcal_reopen,mcal_close,%
    mcal_rename_calendar,mcal_delete_calendar,mcal_fetch_event,%
    mcal_append_event,mcal_store_event,mcal_delete_event,%
    mcal_list_alarms,mcal_event_init,mcal_event_set_category,%
    mcal_event_set_description,mcal_event_set_start,%
    mcal_event_set_alarm,mcal_event_set_class,mcal_is_leap_year,%
    mcal_date_valid,mcal_time_valid,mcal_day_of_week,%
    mcal_date_compare,mcal_next_recurrence,%
    mcal_event_set_recur_daily,mcal_event_set_recur_weekly,%
    mcal_event_set_recur_monthly_wday,mcal_event_set_recur_yearly,%
    mcal_event_add_attribute,mcal_expunge,mcal_week_of_year,%
  %--- mcrypt functions
    mcrypt_get_cipher_name,mcrypt_get_block_size,%
    mcrypt_create_iv,mcrypt_cbc,mcrypt_cfb,mcrypt_ecb,mcrypt_ofb,%
    mcrypt_list_modes,mcrypt_get_iv_size,mcrypt_encrypt,%
    mcrypt_module_open,mcrypt_module_close,mcrypt_generic_deinit,%
    mcrypt_generic,mdecrypt_generic,mcrypt_generic_end,%
    mcrypt_enc_is_block_algorithm_mode,%
    mcrypt_enc_is_block_mode,mcrypt_enc_get_block_size,%
    mcrypt_enc_get_supported_key_sizes,mcrypt_enc_get_iv_size,%
    mcrypt_enc_get_modes_name,mcrypt_module_self_test,%
    mcrypt_module_is_block_algorithm,mcrypt_module_is_block_mode,%
    mcrypt_module_get_algo_key_size,%
  %--- mhash functions
    mhash_get_hash_name,mhash_get_block_size,mhash_count,mhash,%
  %--- misc functions
    connection_aborted,connection_status,connection_timeout,%
    define,defined,die,eval,exit,get_browser,highlight_file,%
    ignore_user_abort,iptcparse,leak,pack,show_source,sleep,uniqid,%
    usleep,%
  %--- mnogosearch functions
    udm_add_search_limit,udm_alloc_agent,udm_api_version,%
    udm_cat_list,udm_clear_search_limits,udm_errno,udm_error,%
    udm_free_agent,udm_free_ispell_data,udm_free_res,%
    udm_get_res_field,udm_get_res_param,udm_load_ispell_data,%
    udm_check_charset,udm_check_stored,udm_close_stored,udm_crc32,%
  %--- msession functions
    msession_connect,msession_disconnect,msession_count,%
    msession_destroy,msession_lock,msession_unlock,msession_set,%
    msession_uniq,msession_randstr,msession_find,msession_list,%
    msession_set_array,msession_listvar,msession_timeout,%
    msession_getdata,msession_setdata,msession_plugin,%
  %--- msql functions
    msql,msql_affected_rows,msql_close,msql_connect,msql_create_db,%
    msql_data_seek,msql_dbname,msql_drop_db,msql_dropdb,msql_error,%
    msql_fetch_field,msql_fetch_object,msql_fetch_row,%
    msql_field_seek,msql_fieldtable,msql_fieldtype,msql_fieldflags,%
    msql_free_result,msql_freeresult,msql_list_fields,%
    msql_list_dbs,msql_listdbs,msql_list_tables,msql_listtables,%
    msql_num_rows,msql_numfields,msql_numrows,msql_pconnect,%
    msql_regcase,msql_result,msql_select_db,msql_selectdb,%
  %--- mssql functions
    mssql_close,mssql_connect,mssql_data_seek,mssql_fetch_array,%
    mssql_fetch_object,mssql_fetch_row,mssql_field_length,%
    mssql_field_seek,mssql_field_type,mssql_free_result,%
    mssql_min_error_severity,mssql_min_message_severity,%
    mssql_num_fields,mssql_num_rows,mssql_pconnect,mssql_query,%
    mssql_select_db,mssql_bind,mssql_execute,mssql_fetch_assoc,%
    mssql_guid_string,mssql_init,mssql_rows_affected,%
  %--- muscat functions
    muscat_setup,muscat_setup_net,muscat_give,muscat_get,%
  %--- mysql functions
    mysql_affected_rows,mysql_change_user,mysql_character_set_name,%
    mysql_connect,mysql_create_db,mysql_data_seek,mysql_db_name,%
    mysql_drop_db,mysql_errno,mysql_error,mysql_escape_string,%
    mysql_fetch_assoc,mysql_fetch_field,mysql_fetch_lengths,%
    mysql_fetch_row,mysql_field_flags,mysql_field_name,%
    mysql_field_seek,mysql_field_table,mysql_field_type,%
    mysql_info,mysql_insert_id,mysql_list_dbs,mysql_list_fields,%
    mysql_list_tables,mysql_num_fields,mysql_num_rows,%
    mysql_ping,mysql_query,mysql_unbuffered_query,%
    mysql_result,mysql_select_db,mysql_tablename,mysql_thread_id,%
    mysql_get_host_info,mysql_get_proto_info,mysql_get_server_info,%
  %--- network functions
    checkdnsrr,closelog,debugger_off,debugger_on,%
    fsockopen,gethostbyaddr,gethostbyname,gethostbynamel,getmxrr,%
    getprotobynumber,getservbyname,getservbyport,ip2long,long2ip,%
    pfsockopen,socket_get_status,socket_set_blocking,%
    syslog,%
  %--- nis functions
    yp_get_default_domain,yp_order,yp_master,yp_match,yp_first,%
    yp_errno,yp_err_string,yp_all,yp_cat,%
  %--- oci8 functions
    OCIDefineByName,OCIBindByName,OCILogon,OCIPLogon,OCINLogon,%
    OCIExecute,OCICommit,OCIRollback,OCINewDescriptor,OCIRowCount,%
    OCIResult,OCIFetch,OCIFetchInto,OCIFetchStatement,%
    OCIColumnName,OCIColumnSize,OCIColumnType,OCIServerVersion,%
    OCINewCursor,OCIFreeStatement,OCIFreeCursor,OCIFreeDesc,%
    OCIError,OCIInternalDebug,OCICancel,OCISetPrefetch,%
    OCISaveLobFile,OCISaveLob,OCILoadLob,OCIColumnScale,%
    OCIColumnTypeRaw,OCINewCollection,OCIFreeCollection,%
    OCICollAppend,OCICollAssignElem,OCICollGetElem,OCICollMax,%
    OCICollTrim,%
  %--- oracle functions
    Ora_Bind,Ora_Close,Ora_ColumnName,Ora_ColumnSize,Ora_ColumnType,%
    Ora_CommitOff,Ora_CommitOn,Ora_Do,Ora_Error,Ora_ErrorCode,%
    Ora_Fetch,Ora_Fetch_Into,Ora_GetColumn,Ora_Logoff,Ora_Logon,%
    Ora_Numcols,Ora_Numrows,Ora_Open,Ora_Parse,Ora_Rollback,%
  %--- outcontrol functions
    flush,ob_start,ob_get_contents,ob_get_length,ob_get_level,%
    ob_flush,ob_clean,ob_end_flush,ob_end_clean,ob_implicit_flush,%
  %--- ovrimos functions
    ovrimos_connect,ovrimos_close,ovrimos_longreadlen,%
    ovrimos_execute,ovrimos_cursor,ovrimos_exec,ovrimos_fetch_into,%
    ovrimos_result,ovrimos_result_all,ovrimos_num_rows,%
    ovrimos_field_name,ovrimos_field_type,ovrimos_field_len,%
    ovrimos_free_result,ovrimos_commit,ovrimos_rollback,%
  %--- pcntl functions
    pcntl_fork,pcntl_signal,pcntl_waitpid,pcntl_wexitstatus,%
    pcntl_wifsignaled,pcntl_wifstopped,pcntl_wstopsig,%
    pcntl_exec,%
  %--- pcre functions
    preg_match,preg_match_all,preg_replace,preg_replace_callback,%
    preg_quote,preg_grep,Pattern Modifiers,Pattern Syntax,%
  %--- pdf functions
    pdf_add_annotation,pdf_add_bookmark,pdf_add_launchlink,%
    pdf_add_note,pdf_add_outline,pdf_add_pdflink,pdf_add_thumbnail,%
    pdf_arc,pdf_arcn,pdf_attach_file,pdf_begin_page,%
    pdf_begin_template,pdf_circle,pdf_clip,pdf_close,pdf_closepath,%
    pdf_closepath_stroke,pdf_close_image,pdf_close_pdi,%
    pdf_concat,pdf_continue_text,pdf_curveto,pdf_delete,%
    pdf_endpath,pdf_end_pattern,pdf_end_template,pdf_fill,%
    pdf_findfont,pdf_get_buffer,pdf_get_font,pdf_get_fontname,%
    pdf_get_image_height,pdf_get_image_width,pdf_get_parameter,%
    pdf_get_pdi_value,pdf_get_majorversion,pdf_get_minorversion,%
    pdf_initgraphics,pdf_lineto,pdf_makespotcolor,pdf_moveto,%
    pdf_open,pdf_open_CCITT,pdf_open_file,pdf_open_gif,%
    pdf_open_image_file,pdf_open_jpeg,pdf_open_memory_image,%
    pdf_open_pdi_page,pdf_open_png,pdf_open_tiff,pdf_place_image,%
    pdf_rect,pdf_restore,pdf_rotate,pdf_save,pdf_scale,pdf_setcolor,%
    pdf_setflat,pdf_setfont,pdf_setgray,pdf_setgray_fill,%
    pdf_setlinecap,pdf_setlinejoin,pdf_setlinewidth,pdf_setmatrix,%
    pdf_setpolydash,pdf_setrgbcolor,pdf_setrgbcolor_fill,%
    pdf_set_border_color,pdf_set_border_dash,pdf_set_border_style,%
    pdf_set_duration,pdf_set_font,pdf_set_horiz_scaling,%
    pdf_set_info_author,pdf_set_info_creator,pdf_set_info_keywords,%
    pdf_set_info_title,pdf_set_leading,pdf_set_parameter,%
    pdf_set_text_rendering,pdf_set_text_rise,pdf_set_text_matrix,%
    pdf_set_word_spacing,pdf_show,pdf_show_boxed,pdf_show_xy,%
    pdf_stringwidth,pdf_stroke,pdf_translate,%
  %--- pfpro functions
    pfpro_init,pfpro_cleanup,pfpro_process,pfpro_process_raw,%
  %--- pgsql functions
    pg_close,pg_affected_rows,pg_connect,pg_dbname,pg_end_copy,%
    pg_query,pg_fetch_array,pg_fetch_object,pg_fetch_row,%
    pg_field_name,pg_field_num,pg_field_prtlen,pg_field_size,%
    pg_free_result,pg_last_oid,pg_host,pg_last_notice,pg_lo_close,%
    pg_lo_export,pg_lo_import,pg_lo_open,pg_lo_read,pg_lo_seek,%
    pg_lo_read_all,pg_lo_unlink,pg_lo_write,pg_num_fields,%
    pg_options,pg_pconnect,pg_port,pg_put_line,pg_fetch_result,%
    pg_client_encoding,pg_trace,pg_tty,pg_untrace,pg_get_result,%
    pg_send_query,pg_cancel_query,pg_connection_busy,%
    pg_connection_status,pg_copy_from,pg_copy_to,pg_escape_bytea,%
    pg_result_error,%
  %--- posix functions
    posix_kill,posix_getpid,posix_getppid,posix_getuid,%
    posix_getgid,posix_getegid,posix_setuid,posix_seteuid,%
    posix_setegid,posix_getgroups,posix_getlogin,posix_getpgrp,%
    posix_setpgid,posix_getpgid,posix_getsid,posix_uname,%
    posix_ctermid,posix_ttyname,posix_isatty,posix_getcwd,%
    posix_getgrnam,posix_getgrgid,posix_getpwnam,posix_getpwuid,%
  %--- printer functions
    printer_open,printer_abort,printer_close,printer_write,%
    printer_set_option,printer_get_option,printer_create_dc,%
    printer_start_doc,printer_end_doc,printer_start_page,%
    printer_create_pen,printer_delete_pen,printer_select_pen,%
    printer_delete_brush,printer_select_brush,printer_create_font,%
    printer_select_font,printer_logical_fontheight,%
    printer_draw_rectangle,printer_draw_elipse,printer_draw_text,%
    printer_draw_chord,printer_draw_pie,printer_draw_bmp,%
  %--- pspell functions
    pspell_add_to_personal,pspell_add_to_session,pspell_check,%
    pspell_config_create,pspell_config_ignore,pspell_config_mode,%
    pspell_config_repl,pspell_config_runtogether,%
    pspell_new,pspell_new_config,pspell_new_personal,%
    pspell_store_replacement,pspell_suggest,%
  %--- qtdom functions
    qdom_tree,qdom_error,%
  %--- readline functions
    readline,readline_add_history,readline_clear_history,%
    readline_info,readline_list_history,readline_read_history,%
  %--- recode functions
    recode_string,recode,recode_file,%
  %--- regex functions
    ereg,ereg_replace,eregi,eregi_replace,split,spliti,sql_regcase,%
  %--- sem functions
    sem_get,sem_acquire,sem_release,sem_remove,shm_attach,%
    shm_remove,shm_put_var,shm_get_var,shm_remove_var,ftok,%
  %--- sesam functions
    sesam_connect,sesam_disconnect,sesam_settransaction,%
    sesam_rollback,sesam_execimm,sesam_query,sesam_num_fields,%
    sesam_diagnostic,sesam_fetch_result,sesam_affected_rows,%
    sesam_field_array,sesam_fetch_row,sesam_fetch_array,%
    sesam_free_result,%
  %--- session functions
    session_start,session_destroy,session_name,session_module_name,%
    session_id,session_register,session_unregister,session_unset,%
    session_get_cookie_params,session_set_cookie_params,%
    session_encode,session_set_save_handler,session_cache_limiter,%
    session_write_close,%
  %--- shmop functions
    shmop_open,shmop_read,shmop_write,shmop_size,shmop_delete,%
  %--- snmp functions
    snmpget,snmpset,snmpwalk,snmpwalkoid,snmp_get_quick_print,%
    snmprealwalk,%
  %--- strings functions
    addcslashes,addslashes,bin2hex,chop,chr,chunk_split,%
    count_chars,crc32,crypt,echo,explode,get_html_translation_table,%
    hebrev,hebrevc,htmlentities,htmlspecialchars,implode,join,%
    localeconv,ltrim,md5,md5_file,metaphone,nl_langinfo,nl2br,ord,%
    print,printf,quoted_printable_decode,quotemeta,str_rot13,rtrim,%
    setlocale,similar_text,soundex,sprintf,strncasecmp,strcasecmp,%
    strcmp,strcoll,strcspn,strip_tags,stripcslashes,stripslashes,%
    strlen,strnatcmp,strnatcasecmp,strncmp,str_pad,strpos,strrchr,%
    strrev,strrpos,strspn,strstr,strtok,strtolower,strtoupper,%
    strtr,substr,substr_count,substr_replace,trim,ucfirst,ucwords,%
    vsprintf,wordwrap,%
  %--- swf functions
    swf_openfile,swf_closefile,swf_labelframe,swf_showframe,%
    swf_getframe,swf_mulcolor,swf_addcolor,swf_placeobject,%
    swf_removeobject,swf_nextid,swf_startdoaction,%
    swf_actiongeturl,swf_actionnextframe,swf_actionprevframe,%
    swf_actionstop,swf_actiontogglequality,swf_actionwaitforframe,%
    swf_actiongotolabel,swf_enddoaction,swf_defineline,%
    swf_definepoly,swf_startshape,swf_shapelinesolid,%
    swf_shapefillsolid,swf_shapefillbitmapclip,%
    swf_shapemoveto,swf_shapelineto,swf_shapecurveto,%
    swf_shapearc,swf_endshape,swf_definefont,swf_setfont,%
    swf_fontslant,swf_fonttracking,swf_getfontinfo,swf_definetext,%
    swf_definebitmap,swf_getbitmapinfo,swf_startsymbol,%
    swf_startbutton,swf_addbuttonrecord,swf_oncondition,%
    swf_viewport,swf_ortho,swf_ortho2,swf_perspective,swf_polarview,%
    swf_pushmatrix,swf_popmatrix,swf_scale,swf_translate,swf_rotate,%
  %--- sybase functions
    sybase_affected_rows,sybase_close,sybase_connect,%
    sybase_fetch_array,sybase_fetch_field,sybase_fetch_object,%
    sybase_field_seek,sybase_free_result,sybase_get_last_message,%
    sybase_min_error_severity,sybase_min_message_severity,%
    sybase_num_fields,sybase_num_rows,sybase_pconnect,sybase_query,%
    sybase_select_db,%
  %--- uodbc functions
    odbc_autocommit,odbc_binmode,odbc_close,odbc_close_all,%
    odbc_connect,odbc_cursor,odbc_do,odbc_error,odbc_errormsg,%
    odbc_execute,odbc_fetch_into,odbc_fetch_row,odbc_fetch_array,%
    odbc_fetch_object,odbc_field_name,odbc_field_num,%
    odbc_field_len,odbc_field_precision,odbc_field_scale,%
    odbc_longreadlen,odbc_num_fields,odbc_pconnect,odbc_prepare,%
    odbc_result,odbc_result_all,odbc_rollback,odbc_setoption,%
    odbc_tableprivileges,odbc_columns,odbc_columnprivileges,%
    odbc_primarykeys,odbc_foreignkeys,odbc_procedures,%
    odbc_specialcolumns,odbc_statistics,%
  %--- url functions
    base64_decode,base64_encode,parse_url,rawurldecode,rawurlencode,%
    urlencode,%
  %--- var functions
    doubleval,empty,floatval,gettype,get_defined_vars,%
    import_request_variables,intval,is_array,is_bool,is_double,%
    is_int,is_integer,is_long,is_null,is_numeric,is_object,is_real,%
    is_scalar,is_string,isset,print_r,serialize,settype,strval,%
    unset,var_dump,var_export,is_callable,%
  %--- vpopmail functions
    vpopmail_add_domain,vpopmail_del_domain,%
    vpopmail_add_domain_ex,vpopmail_del_domain_ex,%
    vpopmail_add_user,vpopmail_del_user,vpopmail_passwd,%
    vpopmail_auth_user,vpopmail_alias_add,vpopmail_alias_del,%
    vpopmail_alias_get,vpopmail_alias_get_all,vpopmail_error,%
  %--- w32api functions
    w32api_set_call_method,w32api_register_function,%
    w32api_deftype,w32api_init_dtype,%
  %--- wddx functions
    wddx_serialize_value,wddx_serialize_vars,wddx_packet_start,%
    wddx_add_vars,wddx_deserialize,%
  %--- xml functions
    xml_parser_create,xml_set_object,xml_set_element_handler,%
    xml_set_processing_instruction_handler,xml_set_default_handler,%
    xml_set_notation_decl_handler,%
    xml_parse,xml_get_error_code,xml_error_string,%
    xml_get_current_column_number,xml_get_current_byte_index,%
    xml_parser_free,xml_parser_set_option,xml_parser_get_option,%
    utf8_encode,xml_parser_create_ns,%
    xml_set_start_namespace_decl_handler,%
  %--- xslt functions
    xslt_set_log,xslt_create,xslt_errno,xslt_error,xslt_free,%
    xslt_set_sax_handler,xslt_set_scheme_handler,%
    xslt_set_base,xslt_set_encoding,xslt_set_sax_handlers,%
  %--- yaz functions
    yaz_addinfo,yaz_close,yaz_connect,yaz_errno,yaz_error,yaz_hits,%
    yaz_database,yaz_range,yaz_record,yaz_search,yaz_present,%
    yaz_scan,yaz_scan_result,yaz_ccl_conf,yaz_ccl_parse,%
    yaz_wait,yaz_sort,%
  %--- zip functions
    zip_close,zip_entry_close,zip_entry_compressedsize,%
    zip_entry_filesize,zip_entry_name,zip_entry_open,zip_entry_read,%
    zip_read,%
  %--- zlib functions
    gzclose,gzeof,gzfile,gzgetc,gzgets,gzgetss,gzopen,gzpassthru,%
    gzread,gzrewind,gzseek,gztell,gzwrite,readgzfile,gzcompress,%
    gzdeflate,gzinflate,gzencode,},%
   sensitive,%
   morecomment=[l]\#,%
   morecomment=[l]//,%
   morecomment=[s]{/*}{*/},%
   morestring=[b]",%
   morestring=[b]'%
  }[keywords,comments,strings]%
%%
%% Prolog definition (c) 1997 Dominique de Waleffe
%%
\lst@definelanguage{Prolog}%
  {morekeywords={op,mod,abort,ancestors,arg,ascii,ask,assert,asserta,%
      assertz,atom,atomic,char,clause,close,concat,consult,ed,ef,em,%
      eof,fail,file,findall,write,functor,getc,integer,is,length,%
      listing,load,name,nl,nonvar,not,numbervars,op,or,pp,prin,print,%
      private,prompt,putc,ratom,read,read_from_this_file,rename,repeat,%
      retract,retractall,save,see,seeing,seen,sh,skip,statistics,%
      subgoal_of,system,tab,tell,telling,time,told,trace,true,unload,%
      untrace,var,write},%
   sensitive=f,%
   morecomment=[l]\%,%
   morecomment=[s]{/*}{*/},%
   morestring=[bd]",%
   morestring=[bd]'%
  }[keywords,comments,strings]%
\lst@definelanguage{Ruby}%
  {morekeywords={if,else,elsif,end,while,until,unless,do,case,when,for,%
      in,each,def,module,class,break,redo,next,retry,exit,retrn,super,%
      begin,rescue,yield,ensure,raise,catch,throw,once,NIL,nil,new,%
      kind_of,self,require,include,extend},%
   sensitive=true,%
   morecomment=[l]\#,%
   morecomment=[l]\#\#,%
   morecomment=[s]{=BEGIN}{=END},%
   morestring=[b]',%
   morestring=[b]",%
   morestring=[b]/%
  }[keywords,comments,strings]%
%%
%% SHELXL definition (c) 1999 Aidan Philip Heerdegen
%%
\lst@definelanguage{SHELXL}%
  {morekeywords={TITL,CELL,ZERR,LATT,SYMM,SFAC,DISP,UNIT,LAUE,%
      REM,MORE,TIME,END,HKLF,OMIT,SHEL,BASF,TWIN,EXTI,SWAT,%
      MERG,SPEC,RESI,MOVE,ANIS,AFIX,HFIX,FRAG,FEND,EXYZ,EADP,%
      EQIV,OMIT,CONN,PART,BIND,FREE,DFIX,BUMP,SAME,SADI,CHIV,%
      FLAT,DELU,SIMU,DEFS,ISOR,SUMP,L.S.,CGLS,SLIM,BLOC,DAMP,%
      WGHT,FVAR,BOND,CONF,MPLA,RTAB,LIST,ACTA,SIZE,TEMP,WPDB,%
      FMAP,GRID,PLAN,MOLE},%
   sensitive=false,%
   alsoother=_,% Makes the syntax highlighting ignore the underscores
   morecomment=[l]{! },%
  }%
%%
%% Tcl/Tk definition (c) Gerd Neugebauer
%%
\lst@definelanguage[tk]{tcl}[]{tcl}%
  {morekeywords={activate,add,separator,radiobutton,checkbutton,%
      command,cascade,all,bell,bind,bindtags,button,canvas,canvasx,%
      canvasy,cascade,cget,checkbutton,config,configu,configur,%
      configure,clipboard,create,arc,bitmap,image,line,oval,polygon,%
      rectangle,text,textwindow,curselection,delete,destroy,end,entry,%
      entrycget,event,focus,font,actual,families,measure,metrics,names,%
      frame,get,grab,current,release,status,grid,columnconfigure,%
      rowconfigure,image,image,create,bitmap,photo,delete,height,types,%
      widt,names,index,insert,invoke,itemconfigure,label,listbox,lower,%
      menu,menubutton,message,move,option,add,clear,get,readfile,pack,%
      photo,place,radiobutton,raise,scale,scroll,scrollbar,search,see,%
      selection,send,stdin,stdout,stderr,tag,bind,text,tk,tkerror,%
      tkwait,window,variable,visibility,toplevel,unknown,update,winfo,%
      class,exists,ismapped,parent,reqwidth,reqheight,rootx,rooty,%
      width,height,wm,aspect,client,command,deiconify,focusmodel,frame,%
      geometry,group,iconbitmap,iconify,iconmask,iconname,iconposition,%
      iconwindow,maxsize,minsize,overrideredirect,positionfrom,%
      protocol,sizefrom,state,title,transient,withdraw,xview,yview,%
      yposition,%
      -accelerator,-activebackground,-activeborderwidth,%
      -activeforeground,-after,-anchor,-arrow,-arrowshape,-aspect,%
      -async,-background,-before,-bg,-bigincrement,-bitmap,-bordermode,%
      -borderwidth,-button,-capstyle,-channel,-class,-closeenough,%
      -colormap,-column,-columnspan,-command,-confine,-container,%
      -count,-cursor,-data,-default,-detail,-digits,-direction,%
      -displayof,-disableforeground,-elementborderwidth,-expand,%
      -exportselection,-extend,-family,-fg,-file,-fill,-focus,-font,%
      -fontmap,-foreground,-format,-from,-gamma,-global,-height,%
      -highlightbackground,-highlightcolor,-highlightthickness,-icon,%
      -image,-in,-insertbackground,-insertborderwidth,-insertofftime,%
      -insertontime,-imsertwidth,-ipadx,-ipady,-joinstyle,-jump,%
      -justify,-keycode,-keysym,-label,-lastfor,-length,-maskdata,%
      -maskfile,-menu,-message,-mode,-offvalue,-onvalue,-orient,%
      -outlien,-outlinestipple,-overstrike,-override,-padx,-pady,%
      -pageanchor,-pageheight,-pagewidth,-pagey,-pagey,-palette,%
      -parent,-place,-postcommand,-relheight,-relief,-relwidth,-relx,%
      -rely,-repeatdelay,-repeatinterval,-resolution,-root,-rootx,%
      -rooty,-rotate,-row,-rowspan,-screen,-selectcolor,-selectimage,%
      -sendevent,-serial,-setgrid,-showvalue,-shrink,-side,-size,%
      -slant,-sliderlength,-sliderrelief,-smooth,-splinesteps,-state,%
      -sticky,-stipple,-style,-subsample,-subwindow,-tags,-takefocus,%
      -tearoff,-tearoffcommand,-text,-textvariable,-tickinterval,-time,%
      -title,-to,-troughcolor,-type,-underline,-use,-value,-variable,%
      -visual,-width,-wrap,-wraplength,-x,-xscrollcommand,-y,%
      -bgstipple,-fgstipple,-lmargin1,-lmargin2,-rmargin,-spacing1,%
      -spacing2,-spacing3,-tabs,-yscrollcommand,-zoom,%
      activate,add,addtag,bbox,cget,clone,configure,coords,%
      curselection,debug,delete,delta,deselect,dlineinfo,dtag,dump,%
      entrycget,entryconfigure,find,flash,fraction,get,gettags,handle,%
      icursor,identify,index,insert,invoke,itemcget,itemconfigure,mark,%
      moveto,own,post,postcascade,postscript,put,redither,ranges,%
      scale,select,show,tag,type,unpost,xscrollcommand,xview,%
      yscrollcommand,yview,yposition}%
  }%
\lst@definelanguage[]{tcl}%
  {alsoletter={.:,*=&-},%
   morekeywords={after,append,array,names,exists,anymore,donesearch,%
      get,nextelement,set,size,startsearch,auto_mkindex,binary,break,%
      case,catch,cd,clock,close,concat,console,continue,default,else,%
      elseif,eof,error,eval,exec,-keepnewline,exit,expr,fblocked,%
      fconfigure,fcopy,file,atime,dirname,executable,exists,extension,%
      isdirectory,isfile,join,lstat,mtime,owned,readable,readlink,%
      rootname,size,stat,tail,type,writable,-permissions,-group,-owner,%
      -archive,-hidden,-readonly,-system,-creator,-type,-force,%
      fileevent,flush,for,foreach,format,gets,glob,global,history,if,%
      incr,info,argsbody,cmdcount,commands,complete,default,exists,%
      globals,level,library,locals,patchlevel,procs,script,tclversion,%
      vars,interp,join,lappend,lindex,linsert,list,llength,lrange,%
      lreplace,lsearch,-exact,-regexp,-glob,lsort,-ascii,-integer,%
      -real,-dictionary,-increasing,-decreasing,-index,-command,load,%
      namespace,open,package,forget,ifneeded,provide,require,unknown,%
      vcompare,versions,vsatisfies,pid,proc,puts,-nonewline,pwd,read,%
      regexp,-indices,regsub,-all,-nocaserename,return,scan,seek,set,%
      socket,source,split,string,compare,first,index,last,length,match,%
      range,tolower,toupper,trim,trimleft,trimright,subst,switch,tell,%
      time,trace,variable,vdelete,vinfo,unknown,unset,uplevel,upvar,%
      vwait,while,acos,asin,atan,atan2,ceil,cos,cosh,exp,floor,fmod,%
      hypot,log,log10,pow,sin,sinh,sqrt,tan,tanh,abs,double,int,round%
      },%
   morestring=[d]",%
   MoreSelectCharTable=%
      \lst@CArgX\#\relax\lst@DefDelimB{}{}%
          {\ifx\lst@lastother\lstum@backslash
               \expandafter\@gobblethree
           \fi}%
          \lst@BeginComment\lst@commentmode
          {{\lst@commentstyle}\lst@Lmodetrue}%
  }[keywords,comments,strings]%
%%
%% VBScript definition (c) 2000 Sonja Weidmann
%%
\lst@definelanguage{VBScript}%
  {morekeywords={Call,Case,Const,Dim,Do,Each,Else,End,Erase,Error,Exit,%
      Explicit,For,Function,If,Loop,Next,On,Option,Private,Public,%
      Randomize,ReDim,Rem,Select,Set,Sub,Then,Wend,While,Abs,Array,Asc,%
      Atn,CBool,CByte,CCur,CDate,CDbl,Chr,CInt,CLng,Cos,CreateObject,%
      CSng,CStr,Date,DateAdd,DateDiff,DatePart,DateSerial,DateValue,%
      Day,Exp,Filter,Fix,FormatCurrency,FormatDateTime,FormatNumber,%
      FormatPercent,GetObject,Hex,Hour,InputBox,InStr,InStrRev,Int,%
      IsArray,IsDate,IsEmpty,IsNull,IsNumeric,IsObject,Join,LBound,%
      LCase,Left,Len,LoadPicture,Log,LTrim,Mid,Minute,Month,MonthName,%
      MsgBox,Now,Oct,Replace,RGB,Right,Rnd,Round,RTrim,ScriptEngine,%
      ScriptEngineBuildVersion,ScriptEngineMajorVersion,%
      ScriptEngineMinorVersion,Second,Sgn,Sin,Space,Split,Sqr,StrComp,%
      StrReverse,String,Tan,Time,TimeSerial,TimeValue,Trim,TypeName,%
      UBound,UCase,VarType,Weekday,WeekdayName,Year, And,Eqv,Imp,Is,%
      Mod,Not,Or,Xor,Add,BuildPath,Clear,Close,Copy,CopyFile,%
      CopyFolder,CreateFolder,CreateTextFile,Delete,DeleteFile,%
      DeleteFolder,Dictionary,Drive,DriveExists,Drives,Err,Exists,File,%
      FileExists,FileSystemObject,Files,Folder,FolderExists,Folders,%
      GetAbsolutePathName,GetBaseName,GetDrive,GetDriveName,%
      GetExtensionName,GetFile,GetFileName,GetFolder,%
      GetParentFolderName,GetSpecialFolder,GetTempName,Items,Keys,Move,%
      MoveFile,MoveFolder,OpenAsTextStream,OpenTextFile,Raise,Read,%
      ReadAll,ReadLine,Remove,RemoveAll,Skip,SkipLine,TextStream,Write,%
      WriteBlankLines,WriteLine,Alias,Archive,CDROM,Compressed,%
      Directory,Fixed,ForAppending,ForReading,ForWriting,Hidden,Normal,%
      RAMDisk,ReadOnly,Remote,Removable,System,SystemFolder,%
      TemporaryFolder,TristateFalse,TristateTrue,TristateUseDefault,%
      Unknown,Volume,WindowsFolder,vbAbortRetryIgnore,%
      vbApplicationModal,vbArray,vbBinaryCompare,vbBlack,vbBlue,%
      vbBoolean,vbByte,vbCr,vbCrLf,vbCritical,vbCurrency,vbCyan,%
      vbDataObject,vbDate,vbDecimal,vbDefaultButton1,vbDefaultButton2,%
      vbDefaultButton3,vbDefaultButton4,vbDouble,vbEmpty,vbError,%
      vbExclamation,vbFirstFourDays,vbFirstFullWeek,vbFirstJan1,%
      vbFormFeed,vbFriday,vbGeneralDate,vbGreen,vbInformation,%
      vbInteger,vbLf,vbLong,vbLongDate,vbLongTime,vbMagenta,vbMonday,%
      vbNewLine,vbNull,vbNullChar,vbNullString,vbOKC,ancel,vbOKOnly,%
      vbObject,vbObjectError,vbQuestion,vbRed,vbRetryCancel,vbSaturday,%
      vbShortDate,vbShortTime,vbSingle,vbString,vbSunday,vbSystemModal,%
      vbTab,vbTextCompare,vbThursday,vbTuesday,vbUseSystem,%
      vbUseSystemDayOfWeek,vbVariant,vbVerticalTab,vbWednesday,vbWhite,%
      vbYellow,vbYesNo,vbYesNoCancel},%
   sensitive=f,%
   morecomment=[l]',%
   morestring=[d]"%
  }[keywords,comments,strings]%
%%
%% VRML definition (c) 2001 Oliver Baum
%%
\lst@definelanguage[97]{VRML}
  {morekeywords={DEF,EXTERNPROTO,FALSE,IS,NULL,PROTO,ROUTE,TO,TRUE,USE,%
      eventIn,eventOut,exposedField,field,Introduction,Anchor,%
      Appearance,AudioClip,Background,Billboard,Box,Collision,Color,%
      ColorInterpolator,Cone,Coordinate,CoordinateInterpolator,%
      Cylinder,CylinderSensor,DirectionalLight,ElevationGrid,Extrusion,%
      Fog,FontStyle,Group,ImageTexture,IndexedFaceSet,IndexedLineSet,%
      Inline,LOD,Material,MovieTexture,NavigationInfo,Normal,%
      NormalInterpolator,OrientationInterpolator,PixelTexture,%
      PlaneSensor,PointLight,PointSet,PositionInterpolator,%
      ProximitySensor,ScalarInterpolator,Script,Shape,Sound,Sphere,%
      SphereSensor,SpotLight,Switch,Text,TextureCoordinate,%
      TextureTransform,TimeSensor,TouchSensor,Transform,Viewpoint,%
      VisibilitySensor,WorldInfo},%
   morecomment=[l]\#,% bug: starts comment in the first column
   morestring=[b]"%
  }[keywords,comments,strings]
\endinput
%%
%% End of file `lstlang2.sty'.

~~~
###lstlang3.sty

~~~
%%
%% This is file `lstlang3.sty',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% lstdrvrs.dtx  (with options: `lang3')
%% 
%% (w)(c) 1996/1997/1998/1999/2000/2001/2002/2003 Carsten Heinz and/or
%% any other author listed elsewhere in this file.
%%
%% This file is distributed under the terms of the LaTeX Project Public
%% License from CTAN archives in directory  macros/latex/base/lppl.txt.
%% Either version 1.0 or, at your option, any later version.
%%
%% This file is completely free and comes without any warranty.
%%
%% Send comments and ideas on the package, error reports and additional
%% programming languages to <cheinz@gmx.de>.
%%
\ProvidesFile{lstlang3}
    [2003/08/13 1.1a listings language file]
\lst@definelanguage[68]{Algol}%
  {morekeywords={abs,and,arg,begin,bin,bits,bool,by,bytes,case,channel,%
      char,co,comment,compl,conj,divab,do,down,elem,elif,else,empty,%
      end,entier,eq,esac,exit,false,fi,file,flex,for,format,from,ge,%
      goto,gt,heap,if,im,in,int,is,isnt,le,leng,level,loc,long,lt,lwb,%
      minusab,mod,modab,mode,ne,nil,not,od,odd,of,op,or,ouse,out,over,%
      overab,par,plusab,plusto,pr,pragmat,prio,proc,re,real,ref,repr,%
      round,sema,shl,short,shorten,shr,sign,skip,string,struct,then,%
      timesab,to,true,union,up,upb,void,while},%
   sensitive=f,% ???
   morecomment=[s]{\#}{\#},%
   keywordcomment={co,comment}%
  }[keywords,comments,keywordcomments]%
\lst@definelanguage[60]{Algol}%
  {morekeywords={array,begin,Boolean,code,comment,div,do,else,end,%
      false,for,goto,if,integer,label,own,power,procedure,real,step,%
      string,switch,then,true,until,value,while},%
   sensitive=f,% ???
   keywordcommentsemicolon={end}{else,end}{comment}%
  }[keywords,keywordcomments]%
%%
%% x86masm definition (c) 2002 Andrew Zabolotny
%%
\lst@definelanguage[x86masm]{Assembler}%
  {morekeywords={al,ah,ax,eax,bl,bh,bx,ebx,cl,ch,cx,ecx,dl,dh,dx,edx,%
      si,esi,di,edi,bp,ebp,sp,esp,cs,ds,es,ss,fs,gs,cr0,cr1,cr2,cr3,%
      db0,db1,db2,db3,db4,db5,db6,db7,tr0,tr1,tr2,tr3,tr4,tr5,tr6,tr7,%
      st,aaa,aad,aam,aas,adc,add,and,arpl,bound,bsf,bsr,bswap,bt,btc,%
      btr,bts,call,cbw,cdq,clc,cld,cli,clts,cmc,cmp,cmps,cmpsb,cmpsw,%
      cmpsd,cmpxchg,cwd,cwde,daa,das,dec,div,enter,hlt,idiv,imul,in,%
      inc,ins,int,into,invd,invlpg,iret,ja,jae,jb,jbe,jc,jcxz,jecxz,%
      je,jg,jge,jl,jle,jna,jnae,jnb,jnbe,jnc,jne,jng,jnge,jnl,jnle,%
      jno,jnp,jns,jnz,jo,jp,jpe,jpo,js,jz,jmp,lahf,lar,lea,leave,lgdt,%
      lidt,lldt,lmsw,lock,lods,lodsb,lodsw,lodsd,loop,loopz,loopnz,%
      loope,loopne,lds,les,lfs,lgs,lss,lsl,ltr,mov,movs,movsb,movsw,%
      movsd,movsx,movzx,mul,neg,nop,not,or,out,outs,pop,popa,popad,%
      popf,popfd,push,pusha,pushad,pushf,pushfd,rcl,rcr,rep,repe,%
      repne,repz,repnz,ret,retf,rol,ror,sahf,sal,sar,sbb,scas,seta,%
      setae,setb,setbe,setc,sete,setg,setge,setl,setle,setna,setnae,%
      setnb,setnbe,setnc,setne,setng,setnge,setnl,setnle,setno,setnp,%
      setns,setnz,seto,setp,setpe,setpo,sets,setz,sgdt,shl,shld,shr,%
      shrd,sidt,sldt,smsw,stc,std,sti,stos,stosb,stosw,stosd,str,sub,%
      test,verr,verw,wait,wbinvd,xadd,xchg,xlatb,xor,fabs,fadd,fbld,%
      fbstp,fchs,fclex,fcom,fcos,fdecstp,fdiv,fdivr,ffree,fiadd,ficom,%
      fidiv,fidivr,fild,fimul,fincstp,finit,fist,fisub,fisubr,fld,fld1,%
      fldl2e,fldl2t,fldlg2,fldln2,fldpi,fldz,fldcw,fldenv,fmul,fnop,%
      fpatan,fprem,fprem1,fptan,frndint,frstor,fsave,fscale,fsetpm,%
      fsin,fsincos,fsqrt,fst,fstcw,fstenv,fstsw,fsub,fsubr,ftst,fucom,%
      fwait,fxam,fxch,fxtract,fyl2x,fyl2xp1,f2xm1},%
   morekeywords=[2]{.align,.alpha,assume,byte,code,comm,comment,.const,%
      .cref,.data,.data?,db,dd,df,dosseg,dq,dt,dw,dword,else,end,endif,%
      endm,endp,ends,eq,equ,.err,.err1,.err2,.errb,.errdef,.errdif,%
      .erre,.erridn,.errnb,.errndef,.errnz,event,exitm,extrn,far,%
      .fardata,.fardata?,fword,ge,group,gt,high,if,if1,if2,ifb,ifdef,%
      ifdif,ife,ifidn,ifnb,ifndef,include,includelib,irp,irpc,label,%
      .lall,le,length,.lfcond,.list,local,low,lt,macro,mask,mod,.model,%
      name,ne,near,offset,org,out,page,proc,ptr,public,purge,qword,.%
      radix,record,rept,.sall,seg,segment,.seq,.sfcond,short,size,%
      .stack,struc,subttl,tbyte,.tfcond,this,title,type,.type,width,%
      word,.xall,.xcref,.xlist},%
   alsoletter=.,alsodigit=?,%
   sensitive=f,%
   morestring=[b]",%
   morestring=[b]',%
   morecomment=[l];%
   }[keywords,comments,strings]
%%
%% Clean definition (c) 1999 Jos\'e Romildo Malaquias
%%
%% Clean 1.3 :  some standard functional language: pure, lazy,
%%              polymorphic type system, modules, type classes,
%%              garbage collection, functions as first class citizens
%%
\lst@definelanguage{Clean}%
  {otherkeywords={:,::,=,:==,=:,=>,->,<-,<-:,\{,\},\{|,|\},\#,\#!,|,\&,%
      [,],!,.,\\\\,;,_},%
   morekeywords={from,definition,implementation,import,module,system,%
      case,code,if,in,let,let!,of,where,with,infix,infixl,infixr},%
   morendkeywords={True,False,Start,Int,Real,Char,Bool,String,World,%
      File,ProcId},%
   sensitive,%
   morecomment=[l]//,% missing comma: Markus Pahlow
   morecomment=[n]{/*}{*/},%
   morestring=[b]"%
  }[keywords,comments,strings]%
\lst@definelanguage{Comal 80}%
  {morekeywords={AND,AUTO,CASE,DATA,DEL,DIM,DIV,DO,ELSE,ENDCASE,ENDIF,%
      ENDPROC,ENDWHILE,EOD,EXEC,FALSE,FOR,GOTO,IF,INPUT,INT,LIST,LOAD,%
      MOD,NEW,NEXT,NOT,OF,OR,PRINT,PROC,RANDOM,RENUM,REPEAT,RND,RUN,%
      SAVE,SELECT,STOP,TAB,THEN,TRUE,UNTIL,WHILE,ZONE},%
   sensitive=f,% ???
   morecomment=[l]//,%
   morestring=[d]"%
  }[keywords,comments,strings]%
\lst@definelanguage{Elan}%
  {morekeywords={ABS,AND,BOOL,CAND,CASE,CAT,COLUMNS,CONCR,CONJ,CONST,%
      COR,DECR,DEFINES,DET,DIV,DOWNTO,ELIF,ELSE,END,ENDIF,ENDOP,%
      ENDPACKET,ENDPROC,ENDREP,ENDSELECT,FALSE,FI,FILE,FOR,FROM,IF,%
      INCR,INT,INV,LEAVE,LENGTH,LET,MOD,NOT,OF,OP,OR,OTHERWISE,PACKET,%
      PROC,REAL,REP,REPEAT,ROW,ROWS,SELECT,SIGN,STRUCT,SUB,TEXT,THEN,%
      TRANSP,TRUE,TYPE,UNTIL,UPTO,VAR,WHILE,WITH,XOR,%
      maxint,sign,abs,min,max,random,initializerandom,subtext,code,%
      replace,text,laenge,pos,compress,change,maxreal,smallreal,floor,%
      pi,e,ln,log2,log10,sqrt,exp,tan,tand,sin,sind,cos,cosd,arctan,%
      arctand,int,real,lastconversionok,put,putline,line,page,get,%
      getline,input,output,sequentialfile,maxlinelaenge,reset,eof,%
      close,complexzero,complexone,complexi,complex,realpart,imagpart,%
      dphi,phi,vector,norm,replace,matrix,idn,row,column,sub,%
      replacerow,replacecolumn,replaceelement,transp,errorsstop,stop},%
   sensitive,%
   morestring=[d]"%
  }[keywords,strings]%
%%
%% Erlang definition (c) 2003 Daniel Gazard
%%
\lst@definelanguage{erlang}%
  {morekeywords={abs,after,and,apply,atom,atom_to_list,band,binary,%
      binary_to_list,binary_to_term,bor,bsl,bsr,bxor,case,catch,%
      date,div,element,erase,end,exit,export,float,float_to_list,%
      get,halt,hash,hd,if,info,import,integer,integer_to_list,%
      length,link,list,list_to_atom,list_to_float,list_to_integer,%
      list_to_tuple,module,node,nodes,now,of,or,pid,port,ports,%
      processes,put,receive,reference,register,registered,rem,%
      round,self,setelement,size,spawn,throw,time,tl,trace,trunc,%
      tuple,tuple_to_list,unlink,unregister,whereis,error,false,%
      infinity,nil,ok,true,undefined,when},%
   otherkeywords={->,!,[,],\{,\},},%
   morecomment=[l]\%,%
   morestring=[b]",%
   morestring=[b]'%
  }[keywords,comments,strings]%
\lst@definelanguage{ksh}
  {morekeywords={alias,awk,cat,echo,else,elif,fi,exec,exit,%
      for,in,do,done,select,case,esac,while,until,function,%
      time,export,cd,eval,fc,fg,kill,let,pwd,read,return,rm,%
      glob,goto,history,if,logout,nice,nohup,onintr,repeat,sed,%
      set,setenv,shift,source,switch,then,umask,unalias,%
      unset,wait,@,env,argv,child,home,ignoreeof,noclobber,%
      noglob,nomatch,path,prompt,shell,status,verbose,print,printf,%
      sqrt,BEGIN,END},%
   morecomment=[l]\#,%
   morestring=[d]",%
   morestring=[d]',%
   morestring=[d]`%
  }[keywords,comments,strings]%
\lst@definelanguage{Logo}%
  {morekeywords={and,atan,arctan,both,break,bf,bl,butfirst,butlast,%
      cbreak, close,co,continue,cos,count,clearscreen,cs,debquit,%
      describe,diff,difference,ed,edit,either,emptyp,equalp,er,erase,%
      errpause,errquit,fifp,filefprint,fifty,fileftype,fip,fileprint,%
      fird,fileread,fity,filetype,fiwd,fileword,f,first,or,fp,fprint,%
      fput,fty,ftype,full,fullscreen,go,bye,goodbye,gprop,greaterp,%
      help,if,iff,iffalse,ift,iftrue,nth,item,keyp,llast,lessp,list,%
      local,lput,make,max,maximum,memberp,memtrace,min,minimum,namep,%
      not,numberp,oflush,openr,openread,openw,openwrite,op,output,%
      pause,plist,pots,pow,pprop,pps,pr,print,product,quotient,random,%
      rc,readchar,rl,readlist,remprop,repcount,repeat,request,rnd,run,%
      se,sentence,sentencep,setc,setcolor,setipause,setqpause,po,show,%
      sin,split,splitscreen,sqrt,stop,sum,test,text,textscreen,thing,%
      to,tone,top,toplevel,type,untrace,wait,word,wordp,yaccdebug,is,%
      mod,remainder,trace,zerop,back,bk,bto,btouch,fd,forward,fto,%
      ftouch,getpen,heading,hit,hitoot,ht,hideturtle,loff,lampoff,lon,%
      lampon,lt,left,lot,lotoot,lto,ltouch,penc,pencolor,pd,pendown,pe,%
      penerase,penmode,pu,penup,px,penreverse,rt,right,rto,rtouch,%
      scrunch,seth,setheading,setscrun,setscrunch,setxy,shownp,st,%
      showturtle,towardsxy,clean,wipeclean,xcor,ycor,tur,turtle,%
      display,dpy},%
   sensitive=f% ???
  }[keywords]%
%%
%% MetaPost definition (c) 2003 Uwe Siart
%%
\lst@definelanguage{MetaPost}%
  {morekeywords={abs,addto,ahangle,ahlength,and,angle,arclength,%
      arctime,background,bbox,bboxmargin,beginfig,begingroup,beveled,%
      black,blue,bluepart,boolean,bot,boxit,boxjoin,bpath,btex,%
      buildcycle,butt,cc,ceiling,char,charcode,circleit,circmargin,%
      clip,cm,color,controls,cosd,curl,currentpen,currentpicture,%
      cutafter,cutbefore,cutdraw,cuttings,cycle,dashed,dashpattern,%
      day,dd,decimal,decr,def,defaultdx,defaultdy,defaultfont,%
      defaultpen,defaultscale,dir,direction,directionpoint,%
      directiontime,ditto,div,dotlabel,dotlabels,dotprod,down,downto,%
      draw,drawarrow,drawboxed,drawboxes,drawdblarrow,drawoptions,%
      drawshadowed,drawunboxed,else,elseif,end,enddef,endfig,endfor,%
      endgroup,epsilon,etex,evenly,exitif,exitunless,expr,extra,fi,%
      fill,filldraw,fixpos,fixsize,floor,fontsize,for,forever,%
      forsuffixes,fullcircle,getmid,green,greenpart,halfcircle,hex,%
      hide,identity,if,in,incr,infinity,infont,input,interim,%
      intersectionpoint,intersectiontimes,inverse,joinup,known,label,%
      labeloffset,labels,left,length,let,lft,linecap,linejoin,llcorner,%
      llft,loggingall,lrcorner,lrt,makepath,makepen,mark,max,mexp,%
      mfplain,middlepoint,midpoint,min,mitered,miterlimit,mlog,mod,%
      month,mp,mpx,mpxbreak,newinternal,normaldeviate,not,nullpicture,%
      numeric,oct,odd,or,origin,pair,path,pausing,pen,pencircle,%
      penoffset,pensquare,pic,pickup,picture,point,postcontrol,%
      precontrol,primarydef,prologues,quartercircle,red,redpart,%
      reflectedabout,reverse,right,rotated,rotatedaround,round,rounded,%
      rt,save,scaled,secondarydef,self,setbounds,shifted,shipout,show,%
      showdependencies,showstopping,showtoken,showvariable,sind,%
      slanted,special,sqrt,squared,step,str,string,subpath,substring,%
      tertiarydef,text,thelabel,time,top,tracingall,tracingcapsules,%
      tracingchoices,tracingcommands,tracingequations,tracinglostchars,%
      tracingmacros,tracingnone,tracingonline,tracingoutput,%
      tracingrestores,tracingspecs,tracingstats,tracingtitles,%
      transform,transformed,true,truecorners,ulcorner,ulft,undraw,%
      unfill,unfilldraw,uniformdeviate,unitsquare,unitvector,unknown,%
      until,up,upto,urcorner,urt,vardef,verbatimtex,whatever,white,%
      withcolor,withdots,withpen,xpart,xscaled,xxpart,xypart,year,%
      yscaled,yxpart,yypart,zscaled},%
   sensitive,%
   alsoother={0123456789$},%
   morecomment=[l]\%,%
   morestring=[s]"%
  }[keywords,comments,strings]%
%%
%% Mizar definition (c) 2003 Adam Grabowski
%%
%% Mizar is freely available at URL www.mizar.org for the Linux x86,
%% Solaris x86, and Windows operating systems.
%%
\lst@definelanguage{Mizar}%
  {otherkeywords={->,(\#,\#),.=),\&},%
   morekeywords={vocabulary,constructors,$1,$1,$2,$3,$4,$5,$6,$7,$8,%
      @proof,according,aggregate,and,antonym,as,associativity,assume,%
      asymmetry,attr,be,begin,being,by,canceled,case,cases,cluster,%
      clusters,coherence,commutativity,compatibility,connectedness,%
      consider,consistency,constructors,contradiction,correctness,def,%
      deffunc,define,definition,definitions,defpred,end,environ,equals,%
      ex,exactly,existence,for,from,func,given,hence,hereby,holds,%
      idempotence,if,iff,implies,involutiveness,irreflexivity,is,it,%
      let,means,mode,non,not,notation,now,of,or,otherwise,over,per,%
      pred,prefix,projectivity,proof,provided,qua,reconsider,redefine,%
      reflexivity,requirements,reserve,scheme,schemes,section,selector,%
      set,st,struct,such,suppose,symmetry,synonym,take,that,the,then,%
      theorem,theorems,thesis,thus,to,transitivity,uniqueness,%
      vocabulary,where},%
   sensitive=t,%
   morecomment=[l]::%
  }[keywords,comments]%
\lst@definelanguage{Modula-2}%
  {morekeywords={AND,ARRAY,BEGIN,BY,CASE,CONST,DIV,DO,ELSE,ELSIF,END,%
      EXIT,EXPORT,FOR,FROM,IF,IMPLEMENTATION,IMPORT,IN,MOD,MODULE,NOT,%
      OF,OR,POINTER,PROCEDURE,QUALIFIED,RECORD,REPEAT,RETURN,SET,THEN,%
      TYPE,UNTIL,VAR,WHILE,WITH,ABS,BITSET,BOOLEAN,CAP,CARDINAL,CHAR,%
      CHR,DEC,EXCL,FALSE,FLOAT,HALT,HIGH,INC,INCL,INTEGER,LONGCARD,%
      LONGINT,LONGREAL,MAX,MIN,NIL,ODD,ORD,PROC,REAL,SIZE,TRUE,TRUNC,%
      VAL,DEFINITION,LOOP},% added keywords due to Peter Bartke 99/07/22
   sensitive,%
   morecomment=[n]{(*}{*)},%
   morestring=[d]',%
   morestring=[d]"%
  }[keywords,comments,strings]%
\lstdefinelanguage{MuPAD}{%
   morekeywords={end,next,break,if,then,elif,else,end_if,case,end_case,%
      otherwise,for,from,to,step,downto,in,end_for,while,end_while,%
      repeat,until,end_repeat,or,and,not,xor,div,mod,union,minus,%
      intersect,subset,proc,begin,end_proc,domain,end_domain,category,%
      end_category,axiom,end_axiom,quit,delete,frame},%
   morekeywords=[2]{NIL,FAIL,TRUE,FALSE,UNKNOWN,I,RD_INF,RD_NINF,%
      RD_NAN,name,local,option,save,inherits,of,do},%
   otherkeywords={\%if,?,!,:=,<,>,=,<=,<>,>=,==>,<=>,::,..,...,->,%
      @,@@,\$},%
   sensitive=true,%
   morecomment=[l]{//},%
   morecomment=[n]{/*}{*/},%
   morestring=[b]",%
   morestring=[d]{`}%
  }[keywords,comments,strings]
\lst@definelanguage{NASTRAN}
  {morekeywords={ENDDATA},%
   morecomment=[l]$,%
   MoreSelectCharTable=%
        \lst@CArgX BEGIN\ BULK\relax\lst@CDef{}%
        {\lst@ifmode\else \ifnum\lst@length=\z@
             \lst@EnterMode{\lst@GPmode}{\lst@modetrue
                  \let\lst@currstyle\lst@gkeywords@sty}%
         \fi \fi}%
        {\ifnum\lst@mode=\lst@GPmode
             \lst@XPrintToken \lst@LeaveMode
         \fi}%
  }[keywords,comments]%
\lst@definelanguage{Oberon-2}%
  {morekeywords={ARRAY,BEGIN,BOOLEAN,BY,CASE,CHAR,CONST,DIV,DO,ELSE,%
      ELSIF,END,EXIT,FALSE,FOR,IF,IMPORT,IN,INTEGER,IS,LONGINT,%
      LONGREAL,LOOP,MOD,MODULE,NIL,OF,OR,POINTER,PROCEDURE,REAL,RECORD,%
      REPEAT,RETURN,SET,SHORTINT,THEN,TO,TRUE,TYPE,UNTIL,VAR,WHILE,%
      WITH,ABS,ASH,CAP,CHR,COPY,DEC,ENTIER,EXCL,HALT,INC,INCL,LEN,LONG,%
      MAX,MIN,NEW,ODD,ORD,SHORT,SIZE},%
   sensitive,%
   morecomment=[n]{(*}{*)},%
   morestring=[d]',%
   morestring=[d]"%
  }[keywords,comments,strings]%
%%
%% OCL definition (c) 2000 Achim D. Brucker
%%
%% You are allowed to use, modify and distribute this code either under
%% the terms of the LPPL (version 1.0 or later) or the GPL (version 2.0
%% or later).
%%
\lst@definelanguage[decorative]{OCL}[OMG]{OCL}
  {otherkeywords={@pre},%
   morendkeywords={name,attributes,associatoinEnds,operations,%
      supertypes,allSupertypes,allInstances,oclIsKindOf,oclIsTypeOf,%
      oclAsType,oclInState,oclIsNew,evaluationType,abs,floor,round,max,%
      min,div,mod,size,concat,toUpper,toLower,substring,includes,%
      excludes,count,includesAll,exludesAll,isEmpty,notEmpty,sum,%
      exists,forAll,isUnique,sortedBy,iterate,union,intersection,%
      including,excluding,symmetricDifference,select,reject,collect,%
      asSequence,asBag,asSequence,asSet,append,prepend,subSequence,at,%
      first,last,true,false,isQuery}%
  }%
\lst@definelanguage[OMG]{OCL}%
    {morekeywords={context,pre,inv,post},%
    ndkeywords={or,xor,and,not,implies,if,then,else,endif},%
    morekeywords=[3]{Boolean,Integer,Real,String,Set,Sequence,Bag,%
       OclType,OclAny,OclExpression,Enumeration,Collection,},%
    sensitive=t,%
    morecomment=[l]--,%
    morestring=[d]'%
   }[keywords,comments,strings]%
\lst@definelanguage{PL/I}%
  {morekeywords={ABS,ATAN,AUTOMATIC,AUTO,ATAND,BEGIN,BINARY,BIN,BIT,%
      BUILTIN,BY,CALL,CHARACTER,CHAR,CHECK,COLUMN,COL,COMPLEX,CPLX,%
      COPY,COS,COSD,COSH,DATA,DATE,DECIMAL,DEC,DECLARE,DCL,DO,EDIT,%
      ELSE,END,ENDFILE,ENDPAGE,ENTRY,EXP,EXTERNAL,EXT,FINISH,FIXED,%
      FIXEDOVERFLOW,FOFL,FLOAT,FORMAT,GET,GO,GOTO,IF,IMAG,INDEX,%
      INITIAL,INIT,INTERNAL,INT,LABEL,LENGTH,LIKE,LINE,LIST,LOG,LOG2,%
      LOG10,MAIN,MAX,MIN,MOD,NOCHECK,NOFIXEDOVERFLOW,NOFOFL,NOOVERFLOW,%
      NOOFL,NOSIZE,NOUNDERFLOW,NOUFL,NOZERODIVIDE,NOZDIV,ON,OPTIONS,%
      OVERFLOW,OFL,PAGE,PICTURE,PROCEDURE,PROC,PUT,READ,REPEAT,RETURN,%
      RETURNS,ROUND,SIN,SIND,SINH,SIZE,SKIP,SQRT,STATIC,STOP,STRING,%
      SUBSTR,SUM,SYSIN,SYSPRINT,TAN,TAND,TANH,THEN,TO,UNDERFLOW,UFL,%
      VARYING,WHILE,WRITE,ZERODIVIDE,ZDIV},%
   sensitive=f,%
   morecomment=[s]{/*}{*/},%
   morestring=[d]'%
  }[keywords,comments,strings]%
%%
%% Reduce definition (c) 2002 Geraint Paul Bevan
%%
\lst@definelanguage{Reduce}%
  {morekeywords={%
%% reserved identifiers
abs,acos,acosh,acot,acoth,acsc,acsch,%
adjprec,algebraic,algint,allbranch,allfac,and,%
antisymmetric,append,arglength,array,asec,asech,%
asin,asinh,atan,atan2,atanh,begin,bfspace,bye,%
card_no,ceiling,clear,clearrules,coeff,coeffn,%
cofactor,combineexpt,combinelogs,comment,comp,%
complex,conj,cons,cont,cos,cosh,cot,coth,cramer,%
cref,csc,csch,decompose,define,defn,deg,demo,den,%
depend,det,df,difference,dilog,display,div,do,e,%
echo,ed,editdef,ei,end,eps,eq,equal,erf,errcont,%
evallhseqp,eval_mode,even,evenp,exp,expandlogs,%
expr,expt,ezgcd,factor,factorial,factorize,fexpr,%
first,fix,fixp,floor,for,forall,foreach,fort,%
fort_width,freeof,fullroots,g,gcd,geq,go,goto,%
greaterp,high_pow,hypot,i,if,ifactor,impart,in,%
index,infinity,infix,input,int,integer,interpol,%
intstr,k,korder,lambda,lcm,lcof,length,leq,lessp,%
let,lhs,linear,linelength,lisp,list,listargp,%
listargs,ln,load,load_package,log,log10,logb,%
low_pow,lterm,macro,mainvar,mass,mat,match,%
mateigen,matrix,max,mcd,member,memq,min,minus,mkid,%
modular,msg,mshell,multiplicities,nat,neq,nero,%
nextprime,nil,nodepend,noncom,nonzero,nosplit,%
nospur,nullspace,num,numberp,odd,off,on,operator,%
or,order,ordp,out,output,part,pause,period,pf,pi,%
plus,precedence,precise,precision,pret,pri,primep,%
print_precision,procedure,product,quit,quotient,%
random,random_new_seed,rank,rat,ratarg,rational,%
rationalize,ratpri,real,rederr,reduct,remainder,%
remfac,remind,repart,repeat,rest,resultant,retry,%
return,reverse,revpri,rhs,rlisp88,%
root_multiplicity,round,roundall,roundbf,rounded,%
saveas,savestructr,scalar,sec,sech,second,set,%
setmod,setq,share,showrules,showtime,shut,sign,sin,%
sinh,smacro,solve,solvesingular,spur,sqrt,structr,%
sub,sum,symbolic,symmetric,t,tan,tanh,third,time,%
times,tp,tra,trace,trfac,trigform,trint,until,%
varname,vecdim,vector,weight,when,where,while,%
write,ws,wtlevel,%
%% identifiers with spaces
%% for all,for each,go to,such that,%
},%
  sensitive=false,%
  morecomment=[l]\%,%
  morecomment=[s]{COMMENT}{;},%
  morecomment=[s]{COMMENT}{$},%
  morestring="%
 }[keywords,comments,strings]%
\lst@definelanguage[IBM]{Simula}[DEC]{Simula}{}%
\lst@definelanguage[DEC]{Simula}[67]{Simula}%
  {morekeywords={and,eq,eqv,ge,gt,hidden,imp,le,long,lt,ne,not,%
      options,or,protected,short}%
  }%
\lst@definelanguage[CII]{Simula}[67]{Simula}%
  {morekeywords={and,equiv,exit,impl,not,or,stop}}%
\lst@definelanguage[67]{Simula}%
  {morekeywords={activate,after,array,at,before,begin,boolean,%
      character,class,comment,delay,detach,do,else,end,external,false,%
      for,go,goto,if,in,inner,inspect,integer,is,label,name,new,none,%
      notext,otherwise,prior,procedure,qua,reactivate,real,ref,resume,%
      simset,simulation,step,switch,text,then,this,to,true,until,value,%
      virtual,when,while},%
   sensitive=f,%
   keywordcommentsemicolon={end}{else,end,otherwise,when}{comment},%
   morestring=[d]",%
   morestring=[d]'%
  }[keywords,keywordcomments,strings]%
\lst@definelanguage{S}[]{R}{}
\lst@definelanguage[PLUS]{S}[]{R}{}
\lst@definelanguage{R}%
  {keywords={abbreviate,abline,abs,acos,acosh,action,add1,add,%
      aggregate,alias,Alias,alist,all,anova,any,aov,aperm,append,apply,%
      approx,approxfun,apropos,Arg,args,array,arrows,as,asin,asinh,%
      atan,atan2,atanh,attach,attr,attributes,autoload,autoloader,ave,%
      axis,backsolve,barplot,basename,besselI,besselJ,besselK,besselY,%
      beta,binomial,body,box,boxplot,break,browser,bug,builtins,bxp,by,%
      c,C,call,Call,case,cat,category,cbind,ceiling,character,char,%
      charmatch,check,chol,chol2inv,choose,chull,class,close,cm,codes,%
      coef,coefficients,co,col,colnames,colors,colours,commandArgs,%
      comment,complete,complex,conflicts,Conj,contents,contour,%
      contrasts,contr,control,helmert,contrib,convolve,cooks,coords,%
      distance,coplot,cor,cos,cosh,count,fields,cov,covratio,wt,CRAN,%
      create,crossprod,cummax,cummin,cumprod,cumsum,curve,cut,cycle,D,%
      data,dataentry,date,dbeta,dbinom,dcauchy,dchisq,de,debug,%
      debugger,Defunct,default,delay,delete,deltat,demo,de,density,%
      deparse,dependencies,Deprecated,deriv,description,detach,%
      dev2bitmap,dev,cur,deviance,off,prev,,dexp,df,dfbetas,dffits,%
      dgamma,dgeom,dget,dhyper,diag,diff,digamma,dim,dimnames,dir,%
      dirname,dlnorm,dlogis,dnbinom,dnchisq,dnorm,do,dotplot,double,%
      download,dpois,dput,drop,drop1,dsignrank,dt,dummy,dump,dunif,%
      duplicated,dweibull,dwilcox,dyn,edit,eff,effects,eigen,else,%
      emacs,end,environment,env,erase,eval,equal,evalq,example,exists,%
      exit,exp,expand,expression,External,extract,extractAIC,factor,%
      fail,family,fft,file,filled,find,fitted,fivenum,fix,floor,for,%
      For,formals,format,formatC,formula,Fortran,forwardsolve,frame,%
      frequency,ftable,ftable2table,function,gamma,Gamma,gammaCody,%
      gaussian,gc,gcinfo,gctorture,get,getenv,geterrmessage,getOption,%
      getwd,gl,glm,globalenv,gnome,GNOME,graphics,gray,grep,grey,grid,%
      gsub,hasTsp,hat,heat,help,hist,home,hsv,httpclient,I,identify,if,%
      ifelse,Im,image,\%in\%,index,influence,measures,inherits,install,%
      installed,integer,interaction,interactive,Internal,intersect,%
      inverse,invisible,IQR,is,jitter,kappa,kronecker,labels,lapply,%
      layout,lbeta,lchoose,lcm,legend,length,levels,lgamma,library,%
      licence,license,lines,list,lm,load,local,locator,log,log10,log1p,%
      log2,logical,loglin,lower,lowess,ls,lsfit,lsf,ls,machine,Machine,%
      mad,mahalanobis,make,link,margin,match,Math,matlines,mat,matplot,%
      matpoints,matrix,max,mean,median,memory,menu,merge,methods,min,%
      missing,Mod,mode,model,response,mosaicplot,mtext,mvfft,na,nan,%
      names,omit,nargs,nchar,ncol,NCOL,new,next,NextMethod,nextn,%
      nlevels,nlm,noquote,NotYetImplemented,NotYetUsed,nrow,NROW,null,%
      numeric,\%o\%,objects,offset,old,on,Ops,optim,optimise,optimize,%
      options,or,order,ordered,outer,package,packages,page,pairlist,%
      pairs,palette,panel,par,parent,parse,paste,path,pbeta,pbinom,%
      pcauchy,pchisq,pentagamma,persp,pexp,pf,pgamma,pgeom,phyper,pico,%
      pictex,piechart,Platform,plnorm,plogis,plot,pmatch,pmax,pmin,%
      pnbinom,pnchisq,pnorm,points,poisson,poly,polygon,polyroot,pos,%
      postscript,power,ppoints,ppois,predict,preplot,pretty,Primitive,%
      print,prmatrix,proc,prod,profile,proj,prompt,prop,provide,%
      psignrank,ps,pt,ptukey,punif,pweibull,pwilcox,q,qbeta,qbinom,%
      qcauchy,qchisq,qexp,qf,qgamma,qgeom,qhyper,qlnorm,qlogis,qnbinom,%
      qnchisq,qnorm,qpois,qqline,qqnorm,qqplot,qr,Q,qty,qy,qsignrank,%
      qt,qtukey,quantile,quasi,quit,qunif,quote,qweibull,qwilcox,%
      rainbow,range,rank,rbeta,rbind,rbinom,rcauchy,rchisq,Re,read,csv,%
      csv2,fwf,readline,socket,real,Recall,rect,reformulate,regexpr,%
      relevel,remove,rep,repeat,replace,replications,report,require,%
      resid,residuals,restart,return,rev,rexp,rf,rgamma,rgb,rgeom,R,%
      rhyper,rle,rlnorm,rlogis,rm,rnbinom,RNGkind,rnorm,round,row,%
      rownames,rowsum,rpois,rsignrank,rstandard,rstudent,rt,rug,runif,%
      rweibull,rwilcox,sample,sapply,save,scale,scan,scan,screen,sd,se,%
      search,searchpaths,segments,seq,sequence,setdiff,setequal,set,%
      setwd,show,sign,signif,sin,single,sinh,sink,solve,sort,source,%
      spline,splinefun,split,sqrt,stars,start,stat,stem,step,stop,%
      storage,strstrheight,stripplot,strsplit,structure,strwidth,sub,%
      subset,substitute,substr,substring,sum,summary,sunflowerplot,svd,%
      sweep,switch,symbol,symbols,symnum,sys,status,system,t,table,%
      tabulate,tan,tanh,tapply,tempfile,terms,terrain,tetragamma,text,%
      time,title,topo,trace,traceback,transform,tri,trigamma,trunc,try,%
      ts,tsp,typeof,unclass,undebug,undoc,union,unique,uniroot,unix,%
      unlink,unlist,unname,untrace,update,upper,url,UseMethod,var,%
      variable,vector,Version,vi,warning,warnings,weighted,weights,%
      which,while,window,write,\%x\%,x11,X11,xedit,xemacs,xinch,xor,%
      xpdrows,xy,xyinch,yinch,zapsmall,zip},%
   otherkeywords={!,!=,~,$,*,\&,\%/\%,\%*\%,\%\%,<-,<<-,_,/},%
   alsoother={._$},%
   sensitive,%
   morecomment=[l]\#,%
   morestring=[d]",%
   morestring=[d]'% 2001 Robert Denham
  }%
\lst@definelanguage{SAS}%
  {procnamekeys={proc},%
   morekeywords={DATA,AND,OR,NOT,EQ,GT,LT,GE,LE,NE,INFILE,INPUT,DO,BY,%
      TO,SIN,COS,OUTPUT,END,PLOT,RUN,LIBNAME,VAR,TITLE,FIRSTOBS,OBS,%
      DELIMITER,DLM,EOF,ABS,DIM,HBOUND,LBOUND,MAX,MIN,MOD,SIGN,SQRT,%
      CEIL,FLOOR,FUZZ,INT,ROUND,TRUNC,DIGAMMA,ERF,ERFC,EXP,GAMMA,%
      LGAMMA,LOG,LOG2,LOG10,ARCOS,ARSIN,ATAN,COSH,SINH,TANH,TAN,%
      POISSON,PROBBETA,PROBBNML,PROBCHI,PROBF,PROBGAM,PROBHYPR,%
      PROBNEGB,PROBNORM,PROBT,BETAINV,CINV,FINV,GAMINV,PROBIT,TINV,CSS,%
      CV,KURTOSIS,MEAN,NMISS,RANGE,SKEWNESS,STD,STDERR,SUM,USS,NORMAL,%
      RANBIN,RANCAU,RANEXP,RANGAM,RANNOR,RANPOI,RANTBL,RANTRI,RANUNI,%
      UNIFORM,IF,THEN,ELSE,WHILE,UNTIL,DROP,KEEP,LABEL,DEFAULT,ARRAY,%
      MERGE,CARDS,CARDS4,PUT,SET,UPDATE,ABORT,DELETE,DISPLAY,LIST,%
      LOSTCARD,MISSING,STOP,WHERE,ARRAY,DROP,KEEP,WINDOW,LENGTH,RENAME,%
      RETAIN,MEANS,UNIVARIATE,SUMMARY,TABULATE,CORR,FREQ,FOOTNOTE,NOTE,%
      SHOW},%
   otherkeywords={!,!=,~,$,*,\&,_,/,<,>=,=<,>},%
   morestring=[d]'%
   }[keywords,comments,strings,procnames]%
\lst@definelanguage[AlLaTeX]{TeX}[LaTeX]{TeX}%
  {moretexcs={AtBeginDocument,AtBeginDvi,AtEndDocument,AtEndOfClass,%
      AtEndOfPackage,ClassError,ClassInfo,ClassWarning,%
      ClassWarningNoLine,CurrentOption,DeclareErrorFont,%
      DeclareFixedFont,DeclareFontEncoding,DeclareFontEncodingDefaults,%
      DeclareFontFamily,DeclareFontShape,DeclareFontSubstitution,%
      DeclareMathAccent,DeclareMathAlphabet,DeclareMathAlphabet,%
      DeclareMathDelimiter,DeclareMathRadical,DeclareMathSizes,%
      DeclareMathSymbol,DeclareMathVersion,DeclareOldFontCommand,%
      DeclareOption,DeclarePreloadSizes,DeclareRobustCommand,%
      DeclareSizeFunction,DeclareSymbolFont,DeclareSymbolFontAlphabet,%
      DeclareTextAccent,DeclareTextAccentDefault,DeclareTextCommand,%
      DeclareTextCommandDefault,DeclareTextComposite,%
      DeclareTextCompositeCommand,DeclareTextFontCommand,%
      DeclareTextSymbol,DeclareTextSymbolDefault,ExecuteOptions,%
      GenericError,GenericInfo,GenericWarning,IfFileExists,%
      InputIfFileExists,LoadClass,LoadClassWithOptions,MessageBreak,%
      OptionNotUsed,PackageError,PackageInfo,PackageWarning,%
      PackageWarningNoLine,PassOptionsToClass,PassOptionsToPackage,%
      ProcessOptionsProvidesClass,ProvidesFile,ProvidesFile,%
      ProvidesPackage,ProvideTextCommand,RequirePackage,%
      RequirePackageWithOptions,SetMathAlphabet,SetSymbolFont,%
      TextSymbolUnavailable,UseTextAccent,UseTextSymbol},%
   morekeywords={array,center,displaymath,document,enumerate,eqnarray,%
      equation,flushleft,flushright,itemize,list,lrbox,math,minipage,%
      picture,sloppypar,tabbing,tabular,trivlist,verbatim}%
  }%
\lst@definelanguage[LaTeX]{TeX}[common]{TeX}%
  {moretexcs={a,AA,aa,addcontentsline,addpenalty,addtocontents,%
      addtocounter,addtolength,addtoversion,addvspace,alph,Alph,and,%
      arabic,array,arraycolsep,arrayrulewidth,arraystretch,author,%
      baselinestretch,begin,bezier,bfseries,bibcite,bibdata,bibitem,%
      bibliography,bibliographystyle,bibstyle,bigskip,boldmath,%
      botfigrule,bottomfraction,Box,caption,center,CheckCommand,circle,%
      citation,cite,cleardoublepage,clearpage,cline,columnsep,%
      columnseprule,columnwidth,contentsline,dashbox,date,dblfigrule,%
      dblfloatpagefraction,dblfloatsep,dbltextfloatsep,dbltopfraction,%
      defaultscriptratio,defaultscriptscriptratio,depth,Diamond,%
      displaymath,document,documentclass,documentstyle,doublerulesep,%
      em,emph,endarray,endcenter,enddisplaymath,enddocument,%
      endenumerate,endeqnarray,endequation,endflushleft,endflushright,%
      enditemize,endlist,endlrbox,endmath,endminipage,endpicture,%
      endsloppypar,endtabbing,endtabular,endtrivlist,endverbatim,%
      enlargethispage,ensuremath,enumerate,eqnarray,equation,%
      evensidemargin,extracolsep,fbox,fboxrule,fboxsep,filecontents,%
      fill,floatpagefraction,floatsep,flushbottom,flushleft,flushright,%
      fnsymbol,fontencoding,fontfamily,fontseries,fontshape,fontsize,%
      fontsubfuzz,footnotemark,footnotesep,footnotetext,footskip,frac,%
      frame,framebox,fussy,glossary,headheight,headsep,height,hline,%
      hspace,I,include,includeonly,index,inputlineno,intextsep,%
      itemindent,itemize,itemsep,iterate,itshape,Join,kill,label,%
      labelsep,labelwidth,LaTeX,LaTeXe,leadsto,lefteqn,leftmargin,%
      leftmargini,leftmarginii,leftmarginiii,leftmarginiv,leftmarginv,%
      leftmarginvi,leftmark,lhd,lim,linebreak,linespread,linethickness,%
      linewidth,list,listfiles,listfiles,listparindent,lrbox,%
      makeatletter,makeatother,makebox,makeglossary,makeindex,%
      makelabel,MakeLowercase,MakeUppercase,marginpar,marginparpush,%
      marginparsep,marginparwidth,markboth,markright,math,mathbf,%
      mathellipsis,mathgroup,mathit,mathrm,mathsf,mathsterling,mathtt,%
      mathunderscore,mathversion,mbox,mdseries,mho,minipage,%
      multicolumn,multiput,NeedsTeXFormat,newcommand,newcounter,%
      newenvironment,newfont,newhelp,newlabel,newlength,newline,%
      newmathalphabet,newpage,newsavebox,newtheorem,nobreakspace,%
      nobreakspace,nocite,nocorr,nocorrlist,nofiles,nolinebreak,%
      nonumber,nopagebreak,normalcolor,normalfont,normalmarginpar,%
      numberline,obeycr,oddsidemargin,oldstylenums,onecolumn,oval,%
      pagebreak,pagenumbering,pageref,pagestyle,paperheight,paperwidth,%
      paragraphmark,parbox,parsep,partopsep,picture,poptabs,pounds,%
      protect,pushtabs,put,qbezier,qbeziermax,r,raggedleft,raisebox,%
      ref,refstepcounter,renewcommand,renewenvironment,restorecr,%
      reversemarginpar,rhd,rightmargin,rightmark,rmfamily,roman,Roman,%
      rootbox,rule,samepage,sbox,scshape,secdef,section,sectionmark,%
      selectfont,setcounter,settodepth,settoheight,settowidth,sffamily,%
      shortstack,showoutput,showoverfull,sloppy,sloppypar,slshape,%
      smallskip,sqsubset,sqsupset,SS,stackrel,stepcounter,stop,stretch,%
      subparagraphmark,subsectionmark,subsubsectionmark,sum,%
      suppressfloats,symbol,tabbing,tabbingsep,tabcolsep,tabular,%
      tabularnewline,textasciicircum,textasciitilde,textbackslash,%
      textbar,textbf,textbraceleft,textbraceright,textbullet,%
      textcircled,textcompwordmark,textdagger,textdaggerdbl,textdollar,%
      textellipsis,textemdash,textendash,textexclamdown,textfloatsep,%
      textfraction,textgreater,textheight,textit,textless,textmd,%
      textnormal,textparagraph,textperiodcentered,textquestiondown,%
      textquotedblleft,textquotedblright,textquoteleft,textquoteright,%
      textregistered,textrm,textsc,textsection,textsf,textsl,%
      textsterling,textsuperscript,texttrademark,texttt,textunderscore,%
      textup,textvisiblespace,textwidth,thanks,thefootnote,thempfn,%
      thempfn,thempfootnote,thepage,thepage,thicklines,thinlines,%
      thispagestyle,title,today,topfigrule,topfraction,topmargin,%
      topsep,totalheight,tracingfonts,trivlist,ttfamily,twocolumn,%
      typein,typeout,unboldmath,unitlength,unlhd,unrhd,upshape,usebox,%
      usecounter,usefont,usepackage,value,vector,verb,verbatim,vline,%
      vspace,width,%
      normalsize,small,footnotesize,scriptsize,tiny,large,Large,LARGE,%
      huge,Huge}%
  }%
\lst@definelanguage[plain]{TeX}[common]{TeX}%
  {moretexcs={advancepageno,beginsection,bf,bffam,bye,cal,cleartabs,%
      columns,dosupereject,endinsert,eqalign,eqalignno,fiverm,fivebf,%
      fivei,fivesy,folio,footline,hang,headline,it,itemitem,itfam,%
      leqalignno,magnification,makefootline,makeheadline,midinsert,mit,%
      mscount,nopagenumbers,normalbottom,of,oldstyle,pagebody,%
      pagecontents,pageinsert,pageno,plainoutput,preloaded,proclaim,rm,%
      settabs,sevenbf,seveni,sevensy,sevenrm,sl,slfam,supereject,%
      tabalign,tabs,tabsdone,tabsyet,tenbf,tenex,teni,tenit,tenrm,%
      tensl,tensy,tentt,textindent,topglue,topins,topinsert,tt,ttfam,%
      ttraggedright,vfootnote}%
  }%
\lst@definelanguage[common]{TeX}[primitive]{TeX}
  {moretexcs={active,acute,ae,AE,aleph,allocationnumber,allowbreak,%
      alpha,amalg,angle,approx,arccos,arcsin,arctan,arg,arrowvert,%
      Arrowvert,ast,asymp,b,backslash,bar,beta,bgroup,big,Big,bigbreak,%
      bigcap,bigcirc,bigcup,bigg,Bigg,biggl,Biggl,biggm,Biggm,biggr,%
      Biggr,bigl,Bigl,bigm,Bigm,bigodot,bigoplus,bigotimes,bigr,Bigr,%
      bigskip,bigskipamount,bigsqcup,bigtriangledown,bigtriangleup,%
      biguplus,bigvee,bigwedge,bmod,bordermatrix,bot,bowtie,brace,%
      braceld,bracelu,bracerd,braceru,bracevert,brack,break,breve,%
      buildrel,bullet,c,cap,cases,cdot,cdotp,cdots,centering,%
      centerline,check,chi,choose,circ,clubsuit,colon,cong,coprod,%
      copyright,cos,cosh,cot,coth,csc,cup,d,dag,dagger,dashv,ddag,%
      ddagger,ddot,ddots,deg,delta,Delta,det,diamond,diamondsuit,dim,%
      displaylines,div,do,dospecials,dot,doteq,dotfill,dots,downarrow,%
      Downarrow,downbracefill,egroup,eject,ell,empty,emptyset,endgraf,%
      endline,enskip,enspace,epsilon,equiv,eta,exists,exp,filbreak,%
      flat,fmtname,fmtversion,footins,footnote,footnoterule,forall,%
      frenchspacing,frown,gamma,Gamma,gcd,ge,geq,gets,gg,goodbreak,%
      grave,H,hat,hbar,heartsuit,hglue,hideskip,hidewidth,hom,%
      hookleftarrow,hookrightarrow,hphantom,hrulefill,i,ialign,iff,Im,%
      imath,in,inf,infty,int,interdisplaylinepenalty,%
      interfootnotelinepenalty,intop,iota,item,j,jmath,joinrel,jot,%
      kappa,ker,l,L,lambda,Lambda,land,langle,lbrace,lbrack,lceil,%
      ldotp,ldots,le,leavevmode,leftarrow,Leftarrow,leftarrowfill,%
      leftharpoondown,leftharpoonup,leftline,leftrightarrow,%
      Leftrightarrow,leq,lfloor,lg,lgroup,lhook,lim,liminf,limsup,line,%
      ll,llap,lmoustache,ln,lnot,log,longleftarrow,Longleftarrow,%
      longleftrightarrow,Longleftrightarrow,longmapsto,longrightarrow,%
      Longrightarrow,loop,lor,lq,magstep,magstep,magstephalf,mapsto,%
      mapstochar,mathhexbox,mathpalette,mathstrut,matrix,max,maxdimen,%
      medbreak,medskip,medskipamount,mid,min,models,mp,mu,multispan,%
      nabla,narrower,natural,ne,nearrow,neg,negthinspace,neq,newbox,%
      newcount,newdimen,newfam,newif,newinsert,newlanguage,newmuskip,%
      newread,newskip,newtoks,newwrite,next,ni,nobreak,nointerlineskip,%
      nonfrenchspacing,normalbaselines,normalbaselineskip,%
      normallineskip,normallineskiplimit,not,notin,nu,null,nwarrow,o,O,%
      oalign,obeylines,obeyspaces,odot,oe,OE,offinterlineskip,oint,%
      ointop,omega,Omega,ominus,ooalign,openup,oplus,oslash,otimes,%
      overbrace,overleftarrow,overrightarrow,owns,P,parallel,partial,%
      perp,phantom,phi,Phi,pi,Pi,pm,pmatrix,pmod,Pr,prec,preceq,prime,%
      prod,propto,psi,Psi,qquad,quad,raggedbottom,raggedright,rangle,%
      rbrace,rbrack,rceil,Re,relbar,Relbar,removelastskip,repeat,%
      rfloor,rgroup,rho,rhook,rightarrow,Rightarrow,rightarrowfill,%
      rightharpoondown,rightharpoonup,rightleftharpoons,rightline,rlap,%
      rmoustache,root,rq,S,sb,searrow,sec,setminus,sharp,showhyphens,%
      sigma,Sigma,sim,simeq,sin,sinh,skew,slash,smallbreak,smallint,%
      smallskip,smallskipamount,smash,smile,sp,space,spadesuit,sqcap,%
      sqcup,sqrt,sqsubseteq,sqsupseteq,ss,star,strut,strutbox,subset,%
      subseteq,succ,succeq,sum,sup,supset,supseteq,surd,swarrow,t,tan,%
      tanh,tau,TeX,theta,Theta,thinspace,tilde,times,to,top,tracingall,%
      triangle,triangleleft,triangleright,u,underbar,underbrace,%
      uparrow,Uparrow,upbracefill,updownarrow,Updownarrow,uplus,%
      upsilon,Upsilon,v,varepsilon,varphi,varpi,varrho,varsigma,%
      vartheta,vdash,vdots,vec,vee,vert,Vert,vglue,vphantom,wedge,%
      widehat,widetilde,wlog,wp,wr,xi,Xi,zeta}%
  }%
\lst@definelanguage[primitive]{TeX}%
  {moretexcs={above,abovedisplayshortskip,abovedisplayskip,aftergroup,%
      abovewithdelims,accent,adjdemerits,advance,afterassignment,atop,%
      atopwithdelims,badness,baselineskip,batchmode,begingroup,%
      belowdisplayshortskip,belowdisplayskip,binoppenalty,botmark,box,%
      boxmaxdepth,brokenpenalty,catcode,char,chardef,cleaders,closein,%
      closeout,clubpenalty,copy,count,countdef,cr,crcr,csname,day,%
      deadcycles,def,defaulthyphenchar,defaultskewchar,delcode,%
      delimiter,delimiterfactor,delimitershortfall,dimen,dimendef,%
      discretionary,displayindent,displaylimits,displaystyle,%
      displaywidowpenalty,displaywidth,divide,doublehyphendemerits,dp,%
      edef,else,emergencystretch,end,endcsname,endgroup,endinput,%
      endlinechar,eqno,errhelp,errmessage,errorcontextlines,%
      errorstopmode,escapechar,everycr,everydisplay,everyhbox,everyjob,%
      everymath,everypar,everyvbox,exhyphenpenalty,expandafter,fam,fi,%
      finalhypendemerits,firstmark,floatingpenalty,font,fontdimen,%
      fontname,futurelet,gdef,global,globaldefs,halign,hangafter,%
      hangindent,hbadness,hbox,hfil,hfill,hfilneg,hfuzz,hoffset,%
      holdinginserts,hrule,hsize,hskip,hss,ht,hyphenation,hyphenchar,%
      hyphenpenalty,if,ifcase,ifcat,ifdim,ifeof,iffalse,ifhbox,ifhmode,%
      ifinner,ifmmode,ifnum,ifodd,iftrue,ifvbox,ifvmode,ifvoid,ifx,%
      ignorespaces,immediate,indent,input,insert,insertpenalties,%
      interlinepenalty,jobname,kern,language,lastbox,lastkern,%
      lastpenalty,lastskip,lccode,leaders,left,lefthyphenmin,leftskip,%
      leqno,let,limits,linepenalty,lineskip,lineskiplimits,long,%
      looseness,lower,lowercase,mag,mark,mathaccent,mathbin,mathchar,%
      mathchardef,mathchoice,mathclose,mathcode,mathinner,mathop,%
      mathopen,mathord,mathpunct,mathrel,mathsurround,maxdeadcycles,%
      maxdepth,meaning,medmuskip,message,mkern,month,moveleft,%
      moveright,mskip,multiply,muskip,muskipdef,newlinechar,noalign,%
      noboundary,noexpand,noindent,nolimits,nonscript,nonstopmode,%
      nulldelimiterspace,nullfont,number,omit,openin,openout,or,outer,%
      output,outputpenalty,over,overfullrule,overline,overwithdelims,%
      pagedepth,pagefilllstretch,pagefillstretch,pagefilstretch,%
      pagegoal,pageshrink,pagestretch,pagetotal,par,parfillskip,%
      parindent,parshape,parskip,patterns,pausing,penalty,%
      postdisplaypenalty,predisplaypenalty,predisplaysize,pretolerance,%
      prevdepth,prevgraf,radical,raise,read,relax,relpenalty,right,%
      righthyphenmin,rightskip,romannumeral,scriptfont,%
      scriptscriptfont,scriptscriptstyle,scriptspace,scriptstyle,%
      scrollmode,setbox,setlanguage,sfcode,shipout,show,showbox,%
      showboxbreadth,showboxdepth,showlists,showthe,skewchar,skip,%
      skipdef,spacefactor,spaceskip,span,special,splitbotmark,%
      splitfirstmark,splitmaxdepth,splittopskip,string,tabskip,%
      textfont,textstyle,the,thickmuskip,thinmuskip,time,toks,toksdef,%
      tolerance,topmark,topskip,tracingcommands,tracinglostchars,%
      tracingmacros,tracingonline,tracingoutput,tracingpages,%
      tracingparagraphs,tracingrestores,tracingstats,uccode,uchyph,%
      underline,unhbox,unhcopy,unkern,unpenalty,unskip,unvbox,unvcopy,%
      uppercase,vadjust,valign,vbadness,vbox,vcenter,vfil,vfill,%
      vfilneg,vfuzz,voffset,vrule,vsize,vskip,vsplit,vss,vtop,wd,%
      widowpenalty,write,xdef,xleaders,xspaceskip,year},%
   sensitive,%
   alsoother={0123456789$_},%
   morecomment=[l]\%%
  }[keywords,tex,comments]%
%%
%% Verilog definition (c) 2003 Cameron H. G. Wright <c.h.g.wright@ieee.org>
%%   Based on the IEEE 1364-2001 Verilog HDL standard
%%   Ref: S. Palnitkar, "Verilog HDL: A Guide to Digital Design and Synthesis,"
%%        Prentice Hall, 2003. ISBN: 0-13-044911-3
%%
\lst@definelanguage{Verilog}%
  {morekeywords={% reserved keywords
      always,and,assign,automatic,begin,buf,bufif0,bufif1,case,casex,%
      casez,cell,cmos,config,deassign,default,defparam,design,disable,%
      edge,else,end,endcase,endconfig,endfunction,endgenerate,%
      endmodule,endprimitive,endspecify,endtable,endtask,event,for,%
      force,forever,fork,function,generate,genvar,highz0,highz1,if,%
      ifnone,incdir,include,initial,inout,input,instance,integer,join,%
      large,liblist,library,localparam,macromodule,medium,module,nand,%
      negedge,nmos,nor,noshowcancelled,not,notif0,notif1,or,output,%
      parameter,pmos,posedge,primitive,pull0,pull1,pulldown,pullup,%
      pulsestyle_onevent,pulsestyle_ondetect,rcmos,real,realtime,reg,%
      release,repeat,rnmos,rpmos,rtran,rtranif0,rtranif1,scalared,%
      showcancelled,signed,small,specify,specparam,strong0,strong1,%
      supply0,supply1,table,task,time,tran,tranif0,tranif1,tri,tri0,%
      tri1,triand,trior,trireg,unsigned,use,vectored,wait,wand,weak0,%
      weak1,while,wire,wor,xnor,xor},%
   moredirectives={% system tasks and functions
      $bitstoreal,$countdrivers,$display,$fclose,$fdisplay,$fmonitor,%
      $fopen,$fstrobe,$fwrite,$finish,$getpattern,$history,$incsave,%
      $input,$itor,$key,$list,$log,$monitor,$monitoroff,$monitoron,%
      $nokey},%
   moredirectives={% compiler directives
      `accelerate,`autoexpand_vectornets,`celldefine,`default_nettype,%
      `define,`else,`elsif,`endcelldefine,`endif,`endprotect,%
      `endprotected,`expand_vectornets,`ifdef,`ifndef,`include,%
      `no_accelerate,`noexpand_vectornets,`noremove_gatenames,%
      `nounconnected_drive,`protect,`protected,`remove_gatenames,%
      `remove_netnames,`resetall,`timescale,`unconnected_drive},%
   moredelim=*[directive]\#,%
   sensitive,%
   morecomment=[s]{/*}{*/},%
   morecomment=[l]//,% nonstandard
   morestring=[b]"%
  }[keywords,comments,strings,directives]%
\endinput
%%
%% End of file `lstlang3.sty'.

~~~
###lstmisc.sty

~~~
%%
%% This is file `lstmisc.sty',
%% generated with the docstrip utility.
%%
%% The original source files were:
%%
%% listings.dtx  (with options: `misc,0.21')
%% 
%% Please read the software license in listings.dtx or listings.pdf.
%%
%% (w)(c) 1996 -- 2003 Carsten Heinz and/or any other author
%% listed elsewhere in this file.
%%
%% This file is distributed under the terms of the LaTeX Project Public
%% License from CTAN archives in directory  macros/latex/base/lppl.txt.
%% Either version 1.0 or, at your option, any later version.
%%
%% Permission is granted to modify this file. If your changes are of
%% general interest, please contact the address below.
%%
%% Send comments and ideas on the package, error reports and additional
%% programming languages to <cheinz@gmx.de>.
%%
\def\filedate{2003/06/21}
\def\fileversion{1.1}
\ProvidesFile{lstmisc.sty}
             [\filedate\space\fileversion\space(Carsten Heinz)]
\lst@CheckVersion\fileversion
    {\typeout{^^J%
     ***^^J%
     *** This file requires `listings.sty' version \fileversion.^^J%
     *** You have a serious problem, so I'm exiting ...^^J%
     ***^^J}%
     \batchmode \@@end}
\lst@BeginAspect{writefile}
\newtoks\lst@WFtoken % global
\lst@AddToHook{InitVarsBOL}{\global\lst@WFtoken{}}
\newwrite\lst@WF
\global\let\lst@WFifopen\iffalse % init
\gdef\lst@WFWriteToFile{%
  \begingroup
   \let\lst@UM\@empty
   \expandafter\edef\expandafter\lst@temp\expandafter{\the\lst@WFtoken}%
   \immediate\write\lst@WF{\lst@temp}%
  \endgroup
  \global\lst@WFtoken{}}
\gdef\lst@WFAppend#1{%
    \global\lst@WFtoken=\expandafter{\the\lst@WFtoken#1}}
\gdef\lst@BeginWriteFile{\lst@WFBegin\@gobble}
\gdef\lst@BeginAlsoWriteFile{\lst@WFBegin\lst@OutputBox}
\begingroup \catcode`\^^I=11
\gdef\lst@WFBegin#1#2{%
    \begingroup
    \let\lst@OutputBox#1%
    \def\lst@Append##1{%
        \advance\lst@length\@ne
        \expandafter\lst@token\expandafter{\the\lst@token##1}%
        \ifx ##1\lst@outputspace \else
            \lst@WFAppend##1%
        \fi}%
    \lst@lAddTo\lst@PreGotoTabStop{\lst@WFAppend{^^I}}%
    \lst@lAddTo\lst@ProcessSpace{\lst@WFAppend{ }}%
    \let\lst@DeInit\lst@WFDeInit
    \let\lst@MProcessListing\lst@WFMProcessListing
    \lst@WFifopen\else
        \immediate\openout\lst@WF=#2\relax
        \global\let\lst@WFifopen\iftrue
        \@gobbletwo\fi\fi
    \fi}
\endgroup
\gdef\lst@EndWriteFile{%
    \immediate\closeout\lst@WF \endgroup
    \global\let\lst@WFifopen\iffalse}
\global\let\lst@WFMProcessListing\lst@MProcessListing
\global\let\lst@WFDeInit\lst@DeInit
\lst@AddToAtTop\lst@WFMProcessListing{\lst@WFWriteToFile}
\lst@AddToAtTop\lst@WFDeInit{%
    \ifnum\lst@length=\z@\else \lst@WFWriteToFile \fi}
\lst@EndAspect
\lst@BeginAspect{strings}
\gdef\lst@stringtypes{d,b,m,bd,db}
\gdef\lst@StringKey#1#2{%
    \lst@Delim\lst@stringstyle #2\relax
        {String}\lst@stringtypes #1%
                     {\lst@BeginString\lst@EndString}%
        \@@end\@empty{}}
\lst@Key{string}\relax{\lst@StringKey\@empty{#1}}
\lst@Key{morestring}\relax{\lst@StringKey\relax{#1}}
\lst@Key{deletestring}\relax{\lst@StringKey\@nil{#1}}
\lst@Key{stringstyle}{}{\def\lst@stringstyle{#1}}
\lst@AddToHook{EmptyStyle}{\let\lst@stringstyle\@empty}
\lst@Key{showstringspaces}t[t]{\lstKV@SetIf{#1}\lst@ifshowstringspaces}
\gdef\lst@BeginString{%
    \lst@DelimOpen
        \lst@ifexstrings\else
        {\lst@ifshowstringspaces
             \lst@keepspacestrue
             \let\lst@outputspace\lst@visiblespace
         \fi}}
\lst@AddToHookExe{ExcludeDelims}{\let\lst@ifexstrings\iffalse}
\gdef\lst@EndString{\lst@DelimClose\lst@ifexstrings\else}
\gdef\lst@StringDM@d#1#2\@empty#3#4#5{%
    \lst@CArg #2\relax\lst@DefDelimBE{}{}{}#3{#1}{#5}#4}
\gdef\lst@StringDM@b#1#2\@empty#3#4#5{%
    \let\lst@ifbstring\iftrue
    \lst@CArg #2\relax\lst@DefDelimBE
       {\lst@ifletter \lst@Output \lst@letterfalse \fi}%
       {\ifx\lst@lastother\lstum@backslash
            \expandafter\@gobblethree
        \fi}{}#3{#1}{#5}#4}
\global\let\lst@ifbstring\iffalse % init
\lst@AddToHook{SelectCharTable}{%
    \lst@ifbstring
        \lst@CArgX \\\\\relax \lst@CDefX{}%
           {\lst@ProcessOther\lstum@backslash
            \lst@ProcessOther\lstum@backslash
            \let\lst@lastother\relax}%
           {}%
    \fi}
\global\let\lst@StringDM@bd\lst@StringDM@b
\global\let\lst@StringDM@db\lst@StringDM@bd
\gdef\lst@StringDM@a#1#2\@empty#3#4#5{%
    \lst@CArg #2\relax\lst@DefDelimBE{}{}%
        {\let\lst@next\@gobblethree
         \lst@ifletter\else
         \ifx\lst@lastother)\else \ifx\lst@lastother]\else
             \let\lst@next\@empty
         \fi \fi \fi
         \lst@next}#3{#1}{#5}#4}
\gdef\lst@StringDM@m#1#2\@empty#3#4#5{%
    \lst@CArg #2\relax\lst@DefDelimBE{}{}%
        {\let\lst@next\@gobblethree
         \lst@ifletter\else
             \lst@IfLastOtherOneOf{)].0123456789\lstum@rbrace'}%
                 {}%
                 {\let\lst@next\@empty}%
         \fi
         \lst@next}#3{#1}{#5}#4}
\lst@SaveOutputDef{"7D}\lstum@rbrace
\lst@EndAspect
\lst@BeginAspect{comments}
\lst@NewMode\lst@commentmode
\gdef\lst@commenttypes{l,f,s,n}
\gdef\lst@CommentKey#1#2{%
    \lst@Delim\lst@commentstyle #2\relax
        {Comment}\lst@commenttypes #1%
                {\lst@BeginComment\lst@EndComment}%
        i\@empty{\lst@BeginInvisible\lst@EndInvisible}}
\lst@Key{comment}\relax{\lst@CommentKey\@empty{#1}}
\lst@Key{morecomment}\relax{\lst@CommentKey\relax{#1}}
\lst@Key{deletecomment}\relax{\lst@CommentKey\@nil{#1}}
\lst@Key{commentstyle}{}{\def\lst@commentstyle{#1}}
\lst@AddToHook{EmptyStyle}{\let\lst@commentstyle\itshape}
\gdef\lst@BeginComment{%
    \lst@DelimOpen
        \lst@ifexcomments\else
        \lsthk@AfterBeginComment}
\gdef\lst@EndComment{\lst@DelimClose\lst@ifexcomments\else}
\lst@AddToHook{AfterBeginComment}{}
\lst@AddToHookExe{ExcludeDelims}{\let\lst@ifexcomments\iffalse}
\gdef\lst@BeginInvisible#1#2#3\@empty{%
    \lst@TrackNewLines \lst@XPrintToken
    \lst@BeginDropOutput{#1}}
\gdef\lst@EndInvisible#1\@empty{\lst@EndDropOutput}
\gdef\lst@CommentDM@l#1#2\@empty#3#4#5{%
    \lst@CArg #2\relax\lst@DefDelimB{}{}{}#3{#1}{#5\lst@Lmodetrue}}
\gdef\lst@CommentDM@f#1{%
    \@ifnextchar[{\lst@Comment@@f{#1}}%
                 {\lst@Comment@@f{#1}[0]}}
\gdef\lst@Comment@@f#1[#2]#3\@empty#4#5#6{%
    \lst@CArg #3\relax\lst@DefDelimB{}{}%
        {\lst@CalcColumn
         \ifnum #2=\@tempcnta\else
             \expandafter\@gobblethree
         \fi}%
        #4{#1}{#6\lst@Lmodetrue}}
\gdef\lst@CommentDM@s#1#2#3\@empty#4#5#6{%
    \lst@CArg #2\relax\lst@DefDelimB{}{}{}#4{#1}{#6}%
    \lst@CArg #3\relax\lst@DefDelimE{}{}{}#5{#1}}
\gdef\lst@CommentDM@n#1#2#3\@empty#4#5#6{%
    \ifx\@empty#3\@empty\else
        \def\@tempa{#2}\def\@tempb{#3}%
        \ifx\@tempa\@tempb
            \PackageError{Listings}{Identical delimiters}%
            {These delimiters make no sense with nested comments.}%
        \else
            \lst@CArg #2\relax\lst@DefDelimB
                {}%
                {\ifnum\lst@mode=#1\relax \expandafter\@gobble \fi}%
                {}#4{#1}{#6}%
            \lst@CArg #3\relax\lst@DefDelimE{}{}{}#5{#1}%
        \fi
    \fi}
\lst@EndAspect
\lst@BeginAspect{pod}
\lst@Key{printpod}{false}[t]{\lstKV@SetIf{#1}\lst@ifprintpod}
\lst@Key{podcomment}{false}[t]{\lstKV@SetIf{#1}\lst@ifpodcomment}
\lst@AddToHookExe{SetLanguage}{\let\lst@ifpodcomment\iffalse}
\lst@NewMode\lst@PODmode
\lst@AddToHook{SelectCharTable}
    {\lst@ifpodcomment
         \lst@CArgX =\relax\lst@DefDelimB{}{}%
           {\ifnum\@tempcnta=\z@
                \lst@ifprintpod\else
                    \def\lst@bnext{\lst@BeginDropOutput\lst@PODmode}%
                    \expandafter\expandafter\expandafter\@gobblethree
                \fi
            \else
               \expandafter\@gobblethree
            \fi}%
           \lst@BeginComment\lst@PODmode{{\lst@commentstyle}}%
         \lst@CArgX =cut\^^M\relax\lst@DefDelimE
           {\lst@CalcColumn}%
           {\ifnum\@tempcnta=\z@\else
                \expandafter\@gobblethree
            \fi}%
           {}%
           \lst@EndComment\lst@PODmode
     \fi}
\lst@EndAspect
\lst@BeginAspect[keywords]{html}
\gdef\lst@tagtypes{s}
\gdef\lst@TagKey#1#2{%
    \lst@Delim\lst@tagstyle #2\relax
        {Tag}\lst@tagtypes #1%
                     {\lst@BeginTag\lst@EndTag}%
        \@@end\@empty{}}
\lst@Key{tag}\relax{\lst@TagKey\@empty{#1}}
\lst@Key{tagstyle}{}{\def\lst@tagstyle{#1}}
\lst@AddToHook{EmptyStyle}{\let\lst@tagstyle\@empty}
\gdef\lst@BeginTag{%
    \lst@DelimOpen
        \lst@ifextags\else
        {\let\lst@ifkeywords\iftrue
         \lst@ifmarkfirstintag \lst@firstintagtrue \fi}}
\lst@AddToHookExe{ExcludeDelims}{\let\lst@ifextags\iffalse}
\gdef\lst@EndTag{\lst@DelimClose\lst@ifextags\else}
\lst@Key{usekeywordsintag}t[t]{\lstKV@SetIf{#1}\lst@ifusekeysintag}
\lst@Key{markfirstintag}f[t]{\lstKV@SetIf{#1}\lst@ifmarkfirstintag}
\gdef\lst@firstintagtrue{\global\let\lst@iffirstintag\iftrue}
\global\let\lst@iffirstintag\iffalse
\lst@AddToHook{PostOutput}{\lst@tagresetfirst}
\lst@AddToHook{Output}
    {\gdef\lst@tagresetfirst{\global\let\lst@iffirstintag\iffalse}}
\lst@AddToHook{OutputOther}{\gdef\lst@tagresetfirst{}}
\lst@AddToHook{Output}
    {\ifnum\lst@mode=\lst@tagmode
         \lst@iffirstintag \let\lst@thestyle\lst@gkeywords@sty \fi
         \lst@ifusekeysintag\else \let\lst@thestyle\lst@gkeywords@sty\fi
     \fi}
\lst@NewMode\lst@tagmode
\lst@AddToHook{Init}{\global\let\lst@ifnotag\iftrue}
\lst@AddToHook{SelectCharTable}{\let\lst@ifkeywords\lst@ifnotag}
\gdef\lst@Tag@s#1#2\@empty#3#4#5{%
    \global\let\lst@ifnotag\iffalse
    \lst@CArg #1\relax\lst@DefDelimB {}{}%
        {\ifnum\lst@mode=\lst@tagmode \expandafter\@gobblethree \fi}%
        #3\lst@tagmode{#5}%
    \lst@CArg #2\relax\lst@DefDelimE {}{}{}#4\lst@tagmode}%
\gdef\lst@BeginCDATA#1\@empty{%
    \lst@TrackNewLines \lst@PrintToken
    \lst@EnterMode\lst@GPmode{}\let\lst@ifmode\iffalse
    \lst@mode\lst@tagmode #1\lst@mode\lst@GPmode\relax\lst@modetrue}
\lst@EndAspect
\lst@BeginAspect{escape}
\lst@Key{texcl}{false}[t]{\lstKV@SetIf{#1}\lst@iftexcl}
\lst@AddToHook{TextStyle}{\let\lst@iftexcl\iffalse}
\lst@AddToHook{EOL}
    {\ifnum\lst@mode=\lst@TeXLmode
         \expandafter\lst@escapeend
         \expandafter\lst@LeaveAllModes
         \expandafter\lst@ReenterModes
     \fi}
\lst@AddToHook{AfterBeginComment}
    {\lst@iftexcl \lst@ifLmode \lst@ifdropinput\else
         \lst@PrintToken
         \lst@LeaveMode \lst@InterruptModes
         \lst@EnterMode{\lst@TeXLmode}{\lst@modetrue\lst@commentstyle}%
         \expandafter\expandafter\expandafter\lst@escapebegin
     \fi \fi \fi}
\lst@NewMode\lst@TeXLmode
\gdef\lst@ActiveCDefX#1{\lst@ActiveCDefX@#1}
\gdef\lst@ActiveCDefX@#1#2#3{
    \catcode`#1\active\lccode`\~=`#1%
    \lowercase{\lst@CDefIt~}{#2}{#3}{}}
\gdef\lst@Escape#1#2#3#4{%
    \lst@CArgX #1\relax\lst@CDefX
        {}%
        {\lst@ifdropinput\else
         \lst@TrackNewLines\lst@OutputLostSpace \lst@XPrintToken
         \lst@InterruptModes
         \lst@EnterMode{\lst@TeXmode}{\lst@modetrue}%
         \ifx\^^M#2%
             \lst@CArg #2\relax\lst@ActiveCDefX
                 {}%
                 {\lst@escapeend #4\lst@LeaveAllModes\lst@ReenterModes}%
                 {\lst@MProcessListing}%
         \else
             \lst@CArg #2\relax\lst@ActiveCDefX
                 {}%
                 {\lst@escapeend #4\lst@LeaveAllModes\lst@ReenterModes
                  \lst@whitespacefalse}%
                 {}%
         \fi
         #3\lst@escapebegin
         \fi}%
        {}}
\lst@NewMode\lst@TeXmode
\lst@Key{escapebegin}{}{\def\lst@escapebegin{#1}}
\lst@Key{escapeend}{}{\def\lst@escapeend{#1}}
\lst@Key{escapechar}{}
    {\ifx\@empty#1\@empty
         \let\lst@DefEsc\relax
     \else
         \def\lst@DefEsc{\lst@Escape{#1}{#1}{}{}}%
     \fi}
\lst@AddToHook{TextStyle}{\let\lst@DefEsc\@empty}
\lst@AddToHook{SelectCharTable}{\lst@DefEsc}
\lst@Key{escapeinside}{}{\lstKV@TwoArg{#1}%
    {\let\lst@DefEsc\@empty
     \ifx\@empty##1@empty\else \ifx\@empty##2\@empty\else
         \def\lst@DefEsc{\lst@Escape{##1}{##2}{}{}}%
     \fi\fi}}
\lst@Key{mathescape}{false}[t]{\lstKV@SetIf{#1}\lst@ifmathescape}
\lst@AddToHook{SelectCharTable}
    {\lst@ifmathescape \lst@Escape{\$}{\$}%
        {\setbox\@tempboxa=\hbox\bgroup$}%
        {$\egroup \lst@CalcLostSpaceAndOutput}\fi}
\lst@EndAspect
\lst@BeginAspect{keywords}
\global\let\lst@ifsensitive\iftrue % init
\global\let\lst@ifsensitivedefed\iffalse % init % \global
\lst@ifsavemem\else
\gdef\lst@KeywordTest#1#2#3{%
    \begingroup \let\lst@UM\@empty
    \global\expandafter\let\expandafter\@gtempa
        \csname\@lst#1@\the\lst@token\endcsname
    \endgroup
    \ifx\@gtempa\relax\else
        \let\lst@thestyle\@gtempa
    \fi}
\gdef\lst@KEYWORDTEST{%
    \uppercase\expandafter{\expandafter
        \lst@KEYWORDTEST@\the\lst@token}\relax}
\gdef\lst@KEYWORDTEST@#1\relax#2#3#4{%
    \begingroup \let\lst@UM\@empty
    \global\expandafter\let\expandafter\@gtempa
        \csname\@lst#2@#1\endcsname
    \endgroup
    \ifx\@gtempa\relax\else
        \let\lst@thestyle\@gtempa
    \fi}
\gdef\lst@WorkingTest#1#2#3{%
    \begingroup \let\lst@UM\@empty
    \global\expandafter\let\expandafter\@gtempa
        \csname\@lst#1@\the\lst@token\endcsname
    \endgroup
    \@gtempa}
\gdef\lst@WORKINGTEST{%
    \uppercase\expandafter{\expandafter
        \lst@WORKINGTEST@\the\lst@token}\relax}
\gdef\lst@WORKINGTEST@#1\relax#2#3#4{%
    \begingroup \let\lst@UM\@empty
    \global\expandafter\let\expandafter\@gtempa
        \csname\@lst#2@#1\endcsname
    \endgroup
    \@gtempa}
\gdef\lst@DefineKeywords#1#2#3{%
    \lst@ifsensitive
        \def\lst@next{\lst@for#2}%
    \else
        \def\lst@next{\uppercase\expandafter{\expandafter\lst@for#2}}%
    \fi
    \lst@next\do
    {\expandafter\ifx\csname\@lst#1@##1\endcsname\relax
        \global\expandafter\let\csname\@lst#1@##1\endcsname#3%
     \fi}}
\gdef\lst@UndefineKeywords#1#2#3{%
    \lst@ifsensitivedefed
        \def\lst@next{\lst@for#2}%
    \else
        \def\lst@next{\uppercase\expandafter{\expandafter\lst@for#2}}%
    \fi
    \lst@next\do
    {\expandafter\ifx\csname\@lst#1@##1\endcsname#3%
        \global\expandafter\let\csname\@lst#1@##1\endcsname\relax
     \fi}}
\fi
\lst@ifsavemem
\gdef\lst@IfOneOutOf#1\relax#2{%
    \def\lst@temp##1,#1,##2##3\relax{%
        \ifx\@empty##2\else \expandafter\lst@IOOOfirst \fi}%
    \def\lst@next{\lst@IfOneOutOf@#1\relax}%
    \expandafter\lst@next#2\relax\relax}
\gdef\lst@IfOneOutOf@#1\relax#2#3{%
    \ifx#2\relax
        \expandafter\@secondoftwo
    \else
        \expandafter\lst@temp\expandafter,#2,#1,\@empty\relax
        \expandafter\lst@next
    \fi}
\ifx\iffalse\else\fi
\gdef\lst@IOOOfirst#1\relax#2#3{\fi#2}
\gdef\lst@IFONEOUTOF#1\relax#2{%
    \uppercase{\def\lst@temp##1,#1},##2##3\relax{%
        \ifx\@empty##2\else \expandafter\lst@IOOOfirst \fi}%
    \def\lst@next{\lst@IFONEOUTOF@#1\relax}%
    \expandafter\lst@next#2\relax}
\gdef\lst@IFONEOUTOF@#1\relax#2#3{%
    \ifx#2\relax
        \expandafter\@secondoftwo
    \else
        \uppercase
            {\expandafter\lst@temp\expandafter,#2,#1,\@empty\relax}%
        \expandafter\lst@next
    \fi}
\gdef\lst@KWTest{%
    \begingroup \let\lst@UM\@empty
    \expandafter\xdef\expandafter\@gtempa\expandafter{\the\lst@token}%
    \endgroup
    \expandafter\lst@IfOneOutOf\@gtempa\relax}
\gdef\lst@KeywordTest#1#2#3{\lst@KWTest #2{\let\lst@thestyle#3}{}}
\global\let\lst@KEYWORDTEST\lst@KeywordTest
\gdef\lst@WorkingTest#1#2#3{\lst@KWTest #2#3{}}
\global\let\lst@WORKINGTEST\lst@WorkingTest
\fi
\lst@Key{sensitive}\relax[t]{\lstKV@SetIf{#1}\lst@ifsensitive}
\lst@AddToHook{SetLanguage}{\let\lst@ifsensitive\iftrue}
\lst@AddToHook{Init}
    {\lst@ifsensitive\else
         \let\lst@KeywordTest\lst@KEYWORDTEST
         \let\lst@WorkingTest\lst@WORKINGTEST
         \let\lst@IfOneOutOf\lst@IFONEOUTOF
     \fi}
\gdef\lst@MakeMacroUppercase#1{%
    \ifx\@undefined#1\else \uppercase\expandafter
        {\expandafter\def\expandafter#1\expandafter{#1}}%
    \fi}
\gdef\lst@InstallTest#1#2#3#4#5#6#7#8{%
    \lst@AddToHook{TrackKeywords}{\lst@TrackKeywords{#1}#2#4#6#7#8}%
    \lst@AddToHook{PostTrackKeywords}{\lst@PostTrackKeywords#2#3#4#5}}
\lst@AddToHook{Init}{\lsthk@TrackKeywords\lsthk@PostTrackKeywords}
\lst@AddToHook{TrackKeywords}{}% init
\lst@AddToHook{PostTrackKeywords}{}% init
\lst@AddToHook{Output}{\lst@ifkeywords \lsthk@DetectKeywords \fi}
\lst@AddToHook{DetectKeywords}{}% init
\lst@AddToHook{ModeTrue}{\let\lst@ifkeywords\iffalse}
\lst@AddToHook{Init}{\let\lst@ifkeywords\iftrue}
\gdef\lst@InstallTestNow#1#2#3#4#5{%
    \@ifundefined{\string#2#1}%
    {\global\@namedef{\string#2#1}{}%
     \edef\@tempa{%
         \noexpand\lst@AddToHook{\ifx#5dDetectKeywords\else Output\fi}%
         {\ifx #4w\noexpand\lst@WorkingTest
             \else\noexpand\lst@KeywordTest \fi
          {#1}\noexpand#2\noexpand#3}}%
     \lst@ifsavemem
         \@tempa
     \else
         \@ifundefined{\@lst#1@if@ins}%
             {\@tempa \global\@namedef{\@lst#1@if@ins}{}}%
             {}%
     \fi}
    {}}
\gdef\lst@TrackKeywords#1#2#3#4#5#6{%
    \lst@false
    \def\lst@arg{{#1}#4}%
    \expandafter\expandafter\expandafter\lst@TK@
        \expandafter\lst@arg#2\relax\relax
    \lst@ifsavemem\else
        \def\lst@arg{{#1}#4#2}%
        \expandafter\expandafter\expandafter\lst@TK@@
            \expandafter\lst@arg#3\relax\relax
    \fi
    \lst@if \lst@InstallTestNow{#1}#2#4#5#6\fi}
\gdef\lst@TK@#1#2#3#4{%
    \ifx\lst@ifsensitive\lst@ifsensitivedefed
        \ifx#3#4\else
            \lst@true
            \lst@ifsavemem\else
                \lst@UndefineKeywords{#1}#4#2%
                \lst@DefineKeywords{#1}#3#2%
            \fi
        \fi
    \else
        \ifx#3\relax\else
            \lst@true
            \lst@ifsavemem\else
                \lst@UndefineKeywords{#1}#4#2%
                \lst@DefineKeywords{#1}#3#2%
            \fi
        \fi
    \fi
    \lst@ifsavemem \ifx#3\relax\else
        \lst@ifsensitive\else \lst@MakeMacroUppercase#3\fi
    \fi \fi
    \ifx#3\relax
        \expandafter\@gobblethree
    \fi
    \lst@TK@{#1}#2}
\gdef\lst@TK@@#1#2#3#4#5{%
    \ifx#4\relax
        \expandafter\@gobblefour
    \else
        \lst@IfSubstring{#4#5}#3{}{\lst@UndefineKeywords{#1}#5#2}%
    \fi
    \lst@TK@@{#1}#2#3}
\lst@AddToHook{InitVars}
    {\global\let\lst@ifsensitivedefed\lst@ifsensitive}
\gdef\lst@PostTrackKeywords#1#2#3#4{%
    \lst@ifsavemem\else
        \global\let#3#1%
        \global\let#4#2%
    \fi}
\lst@Key{classoffset}\z@{\def\lst@classoffset{#1}}
\gdef\lst@InstallFamily#1#2#3#4#5{%
    \lst@Key{#2}\relax{\lst@UseFamily{#2}##1\relax\lst@MakeKeywords}%
    \lst@Key{more#2}\relax
        {\lst@UseFamily{#2}##1\relax\lst@MakeMoreKeywords}%
    \lst@Key{delete#2}\relax
        {\lst@UseFamily{#2}##1\relax\lst@DeleteKeywords}%
    \ifx\@empty#3\@empty\else
        \lst@Key{#3}{#4}{\lstKV@OptArg[\@ne]{##1}%
            {\@tempcnta\lst@classoffset \advance\@tempcnta####1\relax
             \@namedef{lst@#3\ifnum\@tempcnta=\@ne\else \the\@tempcnta
                             \fi}{####2}}}%
    \fi
    \expandafter\lst@InstallFamily@
        \csname\@lst @#2@data\expandafter\endcsname
        \csname\@lst @#5\endcsname {#1}{#2}{#3}}
\gdef\lst@InstallFamily@#1#2#3#4#5#6#7#8{%
    \gdef#1{{#3}{#4}{#5}#2#7}%
    \long\def\lst@temp##1{#6}%
    \ifx\lst@temp\@gobble
        \lst@AddTo#1{s#8}%
    \else
        \lst@AddTo#1{w#8}%
        \global\@namedef{lst@g#4@wp}##1{#6}%
    \fi}
\gdef\lst@UseFamily#1{%
    \def\lst@family{#1}%
    \@ifnextchar[\lst@UseFamily@{\lst@UseFamily@[\@ne]}}
\gdef\lst@UseFamily@[#1]{%
    \@tempcnta\lst@classoffset \advance\@tempcnta#1\relax
    \lst@ProvideFamily\lst@family
    \lst@UseFamily@a
        {\lst@family\ifnum\@tempcnta=\@ne\else \the\@tempcnta \fi}}
\gdef\lst@UseFamily@a#1{%
    \expandafter\lst@UseFamily@b
       \csname\@lst @#1@list\expandafter\endcsname
       \csname\@lst @#1\expandafter\endcsname
       \csname\@lst @#1@also\expandafter\endcsname
       \csname\@lst @g#1\endcsname}
\gdef\lst@UseFamily@b#1#2#3#4#5\relax#6{\lstKV@XOptArg[]{#5}#6#1#2#3#4}
\gdef\lst@ProvideFamily#1{%
    \@ifundefined{lstfam@#1\ifnum\@tempcnta=\@ne\else\the\@tempcnta\fi}%
    {\@namedef{lstfam@#1\ifnum\@tempcnta=\@ne\else \the\@tempcnta\fi}{}%
     \expandafter\expandafter\expandafter\lst@ProvideFamily@
         \csname\@lst @#1@data\endcsname
         {\ifnum\@tempcnta=\@ne\else \the\@tempcnta \fi}}%
    {}}%
\gdef\lst@ProvideFamily@#1#2#3#4#5#6#7#8{%
    \expandafter\xdef\csname\@lst @g#2#8@sty\endcsname
    {\if #6w%
         \expandafter\noexpand\csname\@lst @g#2@wp\endcsname{#8}%
     \else
         \expandafter\noexpand\csname\@lst @#3#8\endcsname
     \fi}%
    \ifx\@empty#3\@empty\else
        \edef\lst@temp{\noexpand\lst@AddToHook{Init}{%
            \noexpand\lst@ProvideStyle\expandafter\noexpand
                \csname\@lst @#3#8\endcsname\noexpand#4}}%
        \lst@temp
    \fi
    \expandafter\lst@ProvideFamily@@
         \csname\@lst @#2#8@list\expandafter\endcsname
         \csname\@lst @#2#8\expandafter\endcsname
         \csname\@lst @#2#8@also\expandafter\endcsname
         \csname\@lst @g#2#8@list\expandafter\endcsname
         \csname\@lst @g#2#8\expandafter\endcsname
         \csname\@lst @g#2#8@sty\expandafter\endcsname
         {#1}#5#6#7}
\gdef\lst@ProvideFamily@@#1#2#3#4#5#6#7#8{%
    \gdef#1{#2#5}\global\let#2\@empty \global\let#3\@empty % init
    \gdef#4{#2#5}\global\let#5\@empty % init
    \if #8l\relax
        \lst@AddToHook{SetLanguage}{\def#1{#2#5}\let#2\@empty}%
    \fi
    \lst@InstallTest{#7}#1#2#4#5#6}
\gdef\lst@InstallKeywords#1#2#3#4#5{%
    \lst@Key{#2}\relax
        {\lst@UseFamily{#2}[\@ne]##1\relax\lst@MakeKeywords}%
    \lst@Key{more#2}\relax
        {\lst@UseFamily{#2}[\@ne]##1\relax\lst@MakeMoreKeywords}%
    \lst@Key{delete#2}\relax
        {\lst@UseFamily{#2}[\@ne]##1\relax\lst@DeleteKeywords}%
    \ifx\@empty#3\@empty\else
        \lst@Key{#3}{#4}{\@namedef{lst@#3}{##1}}%
    \fi
    \expandafter\lst@InstallFamily@
        \csname\@lst @#2@data\expandafter\endcsname
        \csname\@lst @#5\endcsname {#1}{#2}{#3}}
\gdef\lst@ProvideStyle#1#2{%
    \ifx#1\@undefined \let#1#2%
    \else\ifx#1\relax \let#1#2\fi\fi}
\gdef\lst@BuildClassList#1#2,{%
    \ifx\relax#2\@empty\else
        \ifx\@empty#2\@empty\else
            \lst@lExtend#1{\csname\@lst @#2\expandafter\endcsname
                           \csname\@lst @g#2\endcsname}%
        \fi
        \expandafter\lst@BuildClassList\expandafter#1
    \fi}
\gdef\lst@DeleteClassesIn#1#2{%
    \expandafter\lst@DCI@\expandafter#1#2\relax\relax}
\gdef\lst@DCI@#1#2#3{%
    \ifx#2\relax
        \expandafter\@gobbletwo
    \else
        \def\lst@temp##1#2#3##2{%
            \lst@lAddTo#1{##1}%
            \ifx ##2\relax\else
                \expandafter\lst@temp
            \fi ##2}%
        \let\@tempa#1\let#1\@empty
        \expandafter\lst@temp\@tempa#2#3\relax
    \fi
    \lst@DCI@#1}
\gdef\lst@MakeKeywords[#1]#2#3#4#5#6{%
    \def#3{#4#6}\let#4\@empty \let#5\@empty
    \lst@MakeMoreKeywords[#1]{#2}#3#4#5#6}
\gdef\lst@MakeMoreKeywords[#1]#2#3#4#5#6{%
    \lst@BuildClassList#3#1,\relax,%
    \lst@DefOther\lst@temp{,#2}\lst@lExtend#4\lst@temp}
\gdef\lst@DeleteKeywords[#1]#2#3#4#5#6{%
    \lst@MakeKeywords[#1]{#2}\@tempa\@tempb#5#6%
    \lst@DeleteClassesIn#3\@tempa
    \lst@DeleteKeysIn#4\@tempb}
\lst@InstallFamily k{keywords}{keywordstyle}\bfseries{keywordstyle}{}ld
\lst@Key{ndkeywords}\relax
    {\lst@UseFamily{keywords}[\tw@]#1\relax\lst@MakeKeywords}%
\lst@Key{morendkeywords}\relax
    {\lst@UseFamily{keywords}[\tw@]#1\relax\lst@MakeMoreKeywords}%
\lst@Key{deletendkeywords}\relax
    {\lst@UseFamily{keywords}[\tw@]#1\relax\lst@DeleteKeywords}%
\lst@Key{ndkeywordstyle}\relax{\@namedef{lst@keywordstyle2}{#1}}%
\lst@Key{keywordsprefix}\relax{\lst@DefActive\lst@keywordsprefix{#1}}
\global\let\lst@keywordsprefix\@empty
\lst@AddToHook{SelectCharTable}
    {\ifx\lst@keywordsprefix\@empty\else
         \expandafter\lst@CArg\lst@keywordsprefix\relax
             \lst@CDef{}%
                      {\lst@ifletter\else
                           \global\let\lst@prefixkeyword\@empty
                       \fi}%
                      {}%
     \fi}
\lst@AddToHook{Init}{\global\let\lst@prefixkeyword\relax}
\lst@AddToHook{Output}
    {\ifx\lst@prefixkeyword\@empty
         \let\lst@thestyle\lst@gkeywords@sty
         \global\let\lst@prefixkeyword\relax
     \fi}%
\lst@Key{otherkeywords}{}{%
    \let\lst@otherkeywords\@empty
    \lst@for{#1}\do{%
      \lst@MakeActive{##1}%
      \lst@lExtend\lst@otherkeywords{%
          \expandafter\lst@CArg\lst@temp\relax\lst@CDef
              {}\lst@PrintOtherKeyword\@empty}}}
\lst@AddToHook{SelectCharTable}{\lst@otherkeywords}
\gdef\lst@PrintOtherKeyword#1\@empty{%
    \lst@XPrintToken
    \begingroup
      \lst@modetrue \lsthk@TextStyle
      \let\lst@ProcessDigit\lst@ProcessLetter
      \let\lst@ProcessOther\lst@ProcessLetter
      \lst@lettertrue
      \lst@gkeywords@sty{#1\lst@XPrintToken}%
    \endgroup}
\lst@EndAspect
\lst@BeginAspect[keywords]{emph}
\lst@InstallFamily e{emph}{emphstyle}{}{emphstyle}{}od
\lst@EndAspect
\lst@BeginAspect[keywords]{tex}
\lst@InstallKeywords{cs}{texcs}{texcsstyle}\relax{keywordstyle}
    {\ifx\lst@lastother\lstum@backslash
         \let\lst@thestyle\lst@texcsstyle
     \fi}
    ld
\lst@EndAspect
\lst@BeginAspect[keywords]{directives}
\lst@NewMode\lst@CDmode
\lst@AddToHook{EOL}{\ifnum\lst@mode=\lst@CDmode \lst@LeaveMode \fi}
\lst@InstallKeywords{d}{directives}{directivestyle}\relax{keywordstyle}
    {\ifnum\lst@mode=\lst@CDmode
         \let\lst@thestyle\lst@directivestyle
     \fi}
    ld
\global\let\lst@directives\@empty % init
\lst@AddToHook{SelectCharTable}
    {\ifx\lst@directives\@empty\else
         \lst@DefSaveDef{`\#}\lsts@CCD
         {\lst@CalcColumn
          \lst@ifmode\else
              \ifnum\@tempcnta=\z@
                  \lst@EnterMode{\lst@CDmode}{}%
              \fi
          \fi
          \ifnum\lst@mode=\lst@CDmode
              \ifnum\@tempcnta=\z@
                  \lst@XPrintToken
                  {\let\lst@currstyle\lst@directivestyle
                   \lsts@CCD\lst@PrintToken}%
              \else \lsts@CCD
              \fi
          \else \lsts@CCD
          \fi}%
     \fi}
\lst@AddTo\lst@stringtypes{,directive}
\gdef\lst@StringDM@directive#1#2#3\@empty{%
    \lst@CArg #2\relax\lst@CDef
        {}%
        {\let\lst@bnext\lst@CArgEmpty
         \ifnum\lst@mode=\lst@CDmode
             \def\lst@bnext{\lst@BeginString{#1}}%
         \fi
         \lst@bnext}%
        \@empty
    \lst@CArg #3\relax\lst@CDef
        {}%
        {\let\lst@enext\lst@CArgEmpty
         \ifnum #1=\lst@mode
             \let\lst@bnext\lst@EndString
         \fi
         \lst@bnext}%
        \@empty}
\lst@EndAspect
\lst@BeginAspect[keywords,comments]{keywordcomments}
\lst@NewMode\lst@KCmode \lst@NewMode\lst@KCSmode
\gdef\lst@BeginKC{\aftergroup\aftergroup\aftergroup\lst@BeginKC@}%
\gdef\lst@BeginKC@{%
    \lst@ResetToken
    \lst@BeginComment\lst@KCmode{{\lst@commentstyle}\lst@modetrue}%
                     \@empty}%
\gdef\lst@BeginKCS{\aftergroup\aftergroup\aftergroup\lst@BeginKCS@}%
\gdef\lst@BeginKCS@{%
    \lst@ResetToken
    \lst@BeginComment\lst@KCSmode{{\lst@commentstyle}\lst@modetrue}%
                     \@empty}%
\lst@AddToHook{PostOutput}{\lst@KCpost \global\let\lst@KCpost\@empty}
\global\let\lst@KCpost\@empty % init
\gdef\lst@EndKC{\lst@SaveToken \lst@LeaveMode \lst@RestoreToken
    \let\lst@thestyle\lst@identifierstyle \lsthk@Output}
\lst@InstallKeywords{kc}{keywordcomment}{}\relax{}
    {\ifnum\lst@mode=\lst@KCmode
         \edef\lst@temp{\the\lst@token}%
         \ifx\lst@temp\lst@KCmatch
             \lst@EndKC
         \fi
     \else
         \lst@ifmode\else
             \xdef\lst@KCmatch{\the\lst@token}%
             \global\let\lst@KCpost\lst@BeginKC
         \fi
     \fi}
    lo
\lst@Key{keywordcommentsemicolon}{}{\lstKV@ThreeArg{#1}%
    {\def\lst@KCAkeywordsB{##1}%
     \def\lst@KCAkeywordsE{##2}%
     \def\lst@KCBkeywordsB{##3}%
     \def\lst@KCkeywords{##1##2##3}}}
\lst@AddToHook{SetLanguage}{%
    \let\lst@KCAkeywordsB\@empty \let\lst@KCAkeywordsE\@empty
    \let\lst@KCBkeywordsB\@empty \let\lst@KCkeywords\@empty}
\lst@AddToHook{SelectCharTable}
    {\ifx\lst@KCkeywords\@empty\else
        \lst@DefSaveDef{`\;}\lsts@EKC
            {\lst@XPrintToken
             \ifnum\lst@mode=\lst@KCmode \lst@EndComment\@empty \else
             \ifnum\lst@mode=\lst@KCSmode \lst@EndComment\@empty
             \fi \fi
             \lsts@EKC}%
     \fi}
\gdef\lst@KCAWorkB{%
    \lst@ifmode\else \global\let\lst@KCpost\lst@BeginKC \fi}
\gdef\lst@KCBWorkB{%
    \lst@ifmode\else \global\let\lst@KCpost\lst@BeginKCS \fi}
\gdef\lst@KCAWorkE{\ifnum\lst@mode=\lst@KCmode \lst@EndKC \fi}
\lst@ProvideFamily@@
    \lst@KCAkeywordsB@list\lst@KCAkeywordsB \lst@KC@also
    \lst@gKCAkeywordsB@list\lst@gKCAkeywordsB \lst@KCAWorkB
    {kcb}owo % prefix, other key, working procedure, Output hook
\lst@ProvideFamily@@
    \lst@KCAkeywordsE@list\lst@KCAkeywordsE \lst@KC@also
    \lst@gKCAkeywordsE@list\lst@gKCAkeywordsE \lst@KCAWorkE
    {kce}owo
\lst@ProvideFamily@@
    \lst@KCBkeywordsB@list\lst@KCBkeywordsB \lst@KC@also
    \lst@gKCBkeywordsB@list\lst@gKCBkeywordsB \lst@KCBWorkB
    {kcs}owo
\lst@EndAspect
\lst@BeginAspect[keywords]{index}
\lst@InstallFamily w{index}{indexstyle}\lstindexmacro{indexstyle}
    {\csname\@lst @indexstyle#1\expandafter\endcsname
         \expandafter{\the\lst@token}}
    od
\lst@UserCommand\lstindexmacro#1{\index{{\ttfamily#1}}}
\lst@EndAspect
\lst@BeginAspect[keywords]{procnames}
\gdef\lst@procnametrue{\global\let\lst@ifprocname\iftrue}
\gdef\lst@procnamefalse{\global\let\lst@ifprocname\iffalse}
\lst@AddToHook{Init}{\lst@procnamefalse}
\lst@AddToHook{DetectKeywords}
    {\lst@ifprocname
         \let\lst@thestyle\lst@procnamestyle
         \lst@ifindexproc \csname\@lst @gindex@sty\endcsname \fi
         \lst@procnamefalse
     \fi}
\lst@Key{procnamestyle}{}{\def\lst@procnamestyle{#1}}
\lst@Key{indexprocnames}{false}[t]{\lstKV@SetIf{#1}\lst@ifindexproc}
\lst@AddToHook{Init}{\lst@ifindexproc \lst@indexproc \fi}
\gdef\lst@indexproc{%
    \@ifundefined{lst@indexstyle1}%
        {\@namedef{lst@indexstyle1}##1{}}%
        {}}
\lst@InstallKeywords w{procnamekeys}{}\relax{}
    {\global\let\lst@PNpost\lst@procnametrue}
    od
\lst@AddToHook{PostOutput}{\lst@PNpost\global\let\lst@PNpost\@empty}
\global\let\lst@PNpost\@empty % init
\lst@EndAspect
\lst@BeginAspect{style}
\@ifundefined{lststylefiles}
    {\lst@UserCommand\lststylefiles{lststy0.sty}}{}
\lst@UserCommand\lstdefinestyle{\lst@DefStyle\iftrue}
\lst@UserCommand\lst@definestyle{\lst@DefStyle\iffalse}
\gdef\lst@DefStyle{\lst@DefDriver{style}{sty}\lstset}
\global\@namedef{lststy@$}{\lsthk@EmptyStyle}
\lst@AddToHook{EmptyStyle}{}% init
\lst@Key{style}\relax{%
    \lst@LAS{style}{sty}{[]{#1}}\lst@NoAlias\lststylefiles
        \lsthk@SetStyle
        {}}
\lst@AddToHook{SetStyle}{}% init
\lst@EndAspect
\lst@BeginAspect{language}
\@ifundefined{lstdriverfiles}
    {\lst@UserCommand\lstlanguagefiles{lstlang0.sty}}{}
\lst@UserCommand\lstdefinelanguage{\lst@DefLang\iftrue}
\lst@UserCommand\lst@definelanguage{\lst@DefLang\iffalse}
\gdef\lst@DefLang{\lst@DefDriver{language}{lang}\lstset}
\lstdefinelanguage{}{}
\lst@Key{language}\relax{\lstKV@OptArg[]{#1}%
    {\lst@LAS{language}{lang}{[##1]{##2}}\lst@FindAlias\lstlanguagefiles
         \lsthk@SetLanguage
         {\lst@FindAlias[##1]{##2}%
          \let\lst@language\lst@malias
          \let\lst@dialect\lst@oalias}}}
\lst@Key{alsolanguage}\relax{\lstKV@OptArg[]{#1}%
    {\lst@LAS{language}{lang}{[##1]{##2}}\lst@FindAlias\lstlanguagefiles
         {}%
         {\lst@FindAlias[##1]{##2}%
          \let\lst@language\lst@malias
          \let\lst@dialect\lst@oalias}}}
\lst@AddToHook{SetLanguage}{}% init
\lst@UserCommand\lstalias{\@ifnextchar[\lstalias@\lstalias@@}
\gdef\lstalias@[#1]#2[#3]#4{\lst@NormedNameDef{lsta@#2$#1}{#4$#3}}
\gdef\lstalias@@#1#2{\lst@NormedNameDef{lsta@#1}{#2}}
\lst@Key{defaultdialect}\relax
    {\lstKV@OptArg[]{#1}{\lst@NormedNameDef{lstdd@##2}{##1}}}
\gdef\lst@FindAlias[#1]#2{%
    \lst@NormedDef\lst@oalias{#1}%
    \lst@NormedDef\lst@malias{#2}%
    \@ifundefined{lsta@\lst@malias}{}%
        {\edef\lst@malias{\csname\@lst a@\lst@malias\endcsname}}%
    \ifx\@empty\lst@oalias \@ifundefined{lstdd@\lst@malias}{}%
        {\edef\lst@oalias{\csname\@lst dd@\lst@malias\endcsname}}%
    \fi
    \edef\lst@temp{\lst@malias $\lst@oalias}%
    \@ifundefined{lsta@\lst@temp}{}%
        {\edef\lst@temp{\csname\@lst a@\lst@temp\endcsname}}%
    \expandafter\lst@FindAlias@\lst@temp $}
\gdef\lst@FindAlias@#1$#2${%
    \def\lst@malias{#1}\def\lst@oalias{#2}%
    \ifx\@empty\lst@oalias \@ifundefined{lstdd@\lst@malias}{}%
        {\edef\lst@oalias{\csname\@lst dd@\lst@malias\endcsname}}%
    \fi}
\gdef\lst@RequireLanguages#1{%
    \lst@Require{language}{lang}{#1}\lst@FindAlias\lstlanguagefiles
    \ifx\lst@loadaspects\@empty\else
        \lst@RequireAspects\lst@loadaspects
    \fi}
\global\let\lstloadlanguages\lst@RequireLanguages
\lst@EndAspect
\lst@BeginAspect{formats}
\@ifundefined{lstformatfiles}
    {\lst@UserCommand\lstformatfiles{lstfmt0.sty}}{}
\lst@UserCommand\lstdefineformat{\lst@DefFormat\iftrue}
\lst@UserCommand\lst@defineformat{\lst@DefFormat\iffalse}
\gdef\lst@DefFormat{\lst@DefDriver{format}{fmt}\lst@UseFormat}
\lstdefineformat{}{}
\lst@Key{format}\relax{%
    \lst@LAS{format}{fmt}{[]{#1}}\lst@NoAlias\lstformatfiles
        \lsthk@SetFormat
        {}}
\lst@AddToHook{SetFormat}{\let\lst@fmtformat\@empty}% init
\gdef\lst@fmtSplit#1#2{%
    \def\lst@temp##1#2##2\relax##3{%
        \ifnum##3=\z@
            \ifx\@empty##2\@empty
                \lst@false
                \let\lst@fmta#1%
                \let\lst@fmtb\@empty
            \else
                \expandafter\lst@temp#1\relax\@ne
            \fi
        \else
            \def\lst@fmta{##1}\def\lst@fmtb{##2}%
        \fi}%
    \lst@true
    \expandafter\lst@temp#1#2\relax\z@}
\gdef\lst@IfNextCharWhitespace#1#2#3{%
    \lst@IfSubstring#3\lst@whitespaces{#1}{#2}#3}
\begingroup
\catcode`\^^I=12\catcode`\^^J=12\catcode`\^^M=12\catcode`\^^L=12\relax%
\lst@DefActive\lst@whitespaces{\ ^^I^^J^^M}% add ^^L
\global\let\lst@whitespaces\lst@whitespaces%
\endgroup
\gdef\lst@fmtIfIdentifier#1{%
    \ifx\relax#1\@empty
        \expandafter\@secondoftwo
    \else
        \expandafter\lst@fmtIfIdentifier@\expandafter#1%
    \fi}
\gdef\lst@fmtIfIdentifier@#1#2\relax{%
    \let\lst@next\@secondoftwo
    \ifnum`#1=`_\else
    \ifnum`#1<64\else
    \ifnum`#1<91\let\lst@next\@firstoftwo\else
    \ifnum`#1<97\else
    \ifnum`#1<123\let\lst@next\@firstoftwo\else
    \fi \fi \fi \fi \fi
    \lst@next}
\gdef\lst@fmtIfNextCharIn#1{%
    \ifx\@empty#1\@empty \expandafter\@secondoftwo \else
                         \def\lst@next{\lst@fmtIfNextCharIn@{#1}}%
                         \expandafter\lst@next\fi}
\gdef\lst@fmtIfNextCharIn@#1#2#3#4{%
    \def\lst@temp##1#4##2##3\relax{%
        \ifx \@empty##2\expandafter\@secondoftwo
                 \else \expandafter\@firstoftwo \fi}%
    \lst@temp#1#4\@empty\relax{#2}{#3}#4}
\gdef\lst@fmtCDef#1{\lst@fmtCDef@#1}
\gdef\lst@fmtCDef@#1#2#3#4#5#6#7{%
    \lst@CDefIt#1{#2}{#3}%
               {\lst@fmtIfNextCharIn{#5}{#4#2#3}{#6#4#2#3#7}}%
               #4%
               {}{}{}}
\gdef\lst@fmtCDefX#1{\lst@fmtCDefX@#1}
\gdef\lst@fmtCDefX@#1#2#3#4#5#6#7{%
    \let#4#1%
    \ifx\@empty#2\@empty
        \def#1{\lst@fmtIfNextCharIn{#5}{#4}{#6#7}}%
    \else \ifx\@empty#3\@empty
        \def#1##1{%
            \ifx##1#2%
                \def\lst@next{\lst@fmtIfNextCharIn{#5}{#4##1}%
                                                      {#6#7}}%
            \else
                 \def\lst@next{#4##1}%
            \fi
            \lst@next}%
    \else
        \def#1{%
            \lst@IfNextCharsArg{#2#3}%
                {\lst@fmtIfNextCharIn{#5}{\expandafter#4\lst@eaten}%
                                         {#6#7}}%
                {\expandafter#4\lst@eaten}}%
    \fi \fi}
\gdef\lst@UseFormat#1{%
    \def\lst@fmtwhole{#1}%
    \lst@UseFormat@}
\gdef\lst@UseFormat@{%
    \lst@fmtSplit\lst@fmtwhole,%
    \let\lst@fmtwhole\lst@fmtb
    \ifx\lst@fmta\@empty\else
        \lst@fmtSplit\lst@fmta=%
        \ifx\@empty\lst@fmta\else
            \expandafter\lstKV@XOptArg\expandafter[\expandafter]%
                \expandafter{\lst@fmtb}\lst@UseFormat@b
        \fi
    \fi
    \ifx\lst@fmtwhole\@empty\else
        \expandafter\lst@UseFormat@
    \fi}
\gdef\lst@UseFormat@b[#1]#2{%
    \def\lst@fmtc{{#1}}\lst@lExtend\lst@fmtc{\expandafter{\lst@fmta}}%
    \def\lst@fmtb{#2}%
    \lst@fmtSplit\lst@fmtb\string
    \ifx\@empty\lst@fmta
        \lst@lAddTo\lst@fmtc{{}}%
    \else
        \lst@lExtend\lst@fmtc{\expandafter
            {\expandafter\lst@fmtPre\expandafter{\lst@fmta}}}%
    \fi
    \ifx\@empty\lst@fmtb
        \lst@lAddTo\lst@fmtc{{}}%
    \else
        \lst@lExtend\lst@fmtc{\expandafter
            {\expandafter\lst@fmtPost\expandafter{\lst@fmtb}}}%
    \fi
    \expandafter\lst@UseFormat@c\lst@fmtc}
\gdef\lst@UseFormat@c#1#2#3#4{%
    \lst@fmtIfIdentifier#2\relax
    {\lst@fmtIdentifier{#2}%
     \lst@if\else \PackageWarning{Listings}%
         {Cannot drop identifier in format definition}%
     \fi}%
    {\lst@if
         \lst@lAddTo\lst@fmtformat{\lst@CArgX#2\relax\lst@fmtCDef}%
     \else
         \lst@lAddTo\lst@fmtformat{\lst@CArgX#2\relax\lst@fmtCDefX}%
     \fi
     \lst@DefActive\lst@fmtc{#1}%
     \lst@lExtend\lst@fmtformat{\expandafter{\lst@fmtc}{#3}{#4}}}}
\lst@AddToHook{SelectCharTable}{\lst@fmtformat}
\global\let\lst@fmtformat\@empty
\gdef\lst@fmtPre#1{%
    \lst@PrintToken
    \begingroup
    \let\newline\lst@fmtEnsureNewLine
    \let\space\lst@fmtEnsureSpace
    \let\indent\lst@fmtIndent
    \let\noindent\lst@fmtNoindent
    #1%
    \endgroup}
\gdef\lst@fmtPost#1{%
    \global\let\lst@fmtPostOutput\@empty
    \begingroup
    \def\newline{\lst@AddTo\lst@fmtPostOutput\lst@fmtEnsureNewLine}%
    \def\space{\aftergroup\lst@fmtEnsurePostSpace}%
    \def\indent{\lst@AddTo\lst@fmtPostOutput\lst@fmtIndent}%
    \def\noindent{\lst@AddTo\lst@fmtPostOutput\lst@fmtNoindent}%
    \aftergroup\lst@PrintToken
    #1%
    \endgroup}
\lst@AddToHook{Init}{\global\let\lst@fmtPostOutput\@empty}
\lst@AddToHook{PostOutput}
    {\lst@fmtPostOutput \global\let\lst@fmtPostOutput\@empty}
\gdef\lst@fmtEnsureSpace{%
    \lst@ifwhitespace\else \expandafter\lst@ProcessSpace \fi}
\gdef\lst@fmtEnsurePostSpace{%
    \lst@IfNextCharWhitespace{}{\lst@ProcessSpace}}
\lst@Key{fmtindent}{20pt}{\def\lst@fmtindent{#1}}
\newdimen\lst@fmtcurrindent
\lst@AddToHook{InitVars}{\global\lst@fmtcurrindent\z@}
\gdef\lst@fmtIndent{\global\advance\lst@fmtcurrindent\lst@fmtindent}
\gdef\lst@fmtNoindent{\global\advance\lst@fmtcurrindent-\lst@fmtindent}
\gdef\lst@fmtEnsureNewLine{%
    \global\advance\lst@newlines\@ne
    \global\advance\lst@newlinesensured\@ne
    \lst@fmtignoretrue}
\lst@AddToAtTop\lst@DoNewLines{%
    \ifnum\lst@newlines>\lst@newlinesensured
        \global\advance\lst@newlines-\lst@newlinesensured
    \fi
    \global\lst@newlinesensured\z@}
\newcount\lst@newlinesensured % global
\lst@AddToHook{Init}{\global\lst@newlinesensured\z@}
\gdef\lst@fmtignoretrue{\let\lst@fmtifignore\iftrue}
\gdef\lst@fmtignorefalse{\let\lst@fmtifignore\iffalse}
\lst@AddToHook{InitVars}{\lst@fmtignorefalse}
\lst@AddToHook{Output}{\lst@fmtignorefalse}
\gdef\lst@fmtUseLostSpace{%
    \lst@ifnewline \kern\lst@fmtcurrindent \global\lst@lostspace\z@
    \else
        \lst@OldOLS
    \fi}
\lst@AddToHook{Init}
    {\lst@true
     \ifx\lst@fmtformat\@empty \ifx\lst@fmt\@empty \lst@false \fi\fi
     \lst@if
        \let\lst@OldOLS\lst@OutputLostSpace
        \let\lst@OutputLostSpace\lst@fmtUseLostSpace
        \let\lst@ProcessSpace\lst@fmtProcessSpace
     \fi}
\gdef\lst@fmtProcessSpace{%
    \lst@ifletter
        \lst@Output
        \lst@fmtifignore\else
            \lst@AppendOther\lst@outputspace
        \fi
    \else \lst@ifkeepspaces
        \lst@AppendOther\lst@outputspace
    \else \ifnum\lst@newlines=\z@
        \lst@AppendSpecialSpace
    \else \ifnum\lst@length=\z@
            \global\advance\lst@lostspace\lst@width
            \global\advance\lst@pos\m@ne
        \else
            \lst@AppendSpecialSpace
        \fi
    \fi \fi \fi
    \lst@whitespacetrue}
\lst@InstallTest{f}
    \lst@fmt@list\lst@fmt \lst@gfmt@list\lst@gfmt
    \lst@gfmt@wp
    wd
\gdef\lst@fmt@list{\lst@fmt\lst@gfmt}\global\let\lst@fmt\@empty
\gdef\lst@gfmt@list{\lst@fmt\lst@gfmt}\global\let\lst@gfmt\@empty
\gdef\lst@gfmt@wp{%
    \begingroup \let\lst@UM\@empty
    \let\lst@PrintToken\@empty
    \csname\lst@ @fmt$\the\lst@token\endcsname
    \endgroup}
\gdef\lst@fmtIdentifier#1#2#3#4{%
    \lst@DefOther\lst@fmta{#2}\edef\lst@fmt{\lst@fmt,\lst@fmta}%
    \@namedef{\lst@ @fmt$\lst@fmta}{#3#4}}
\lst@EndAspect
\lst@BeginAspect{labels}
\lst@Key{numbers}{none}{%
    \let\lst@PlaceNumber\@empty
    \lstKV@SwitchCases{#1}%
    {none&\\%
     left&\def\lst@PlaceNumber{\llap{\normalfont
                \lst@numberstyle{\thelstnumber}\kern\lst@numbersep}}\\%
     right&\def\lst@PlaceNumber{\rlap{\normalfont
                \kern\linewidth \kern\lst@numbersep
                \lst@numberstyle{\thelstnumber}}}%
    }{\PackageError{Listings}{Numbers #1 unknown}\@ehc}}
\lst@Key{numberstyle}{}{\def\lst@numberstyle{#1}}
\lst@Key{numbersep}{10pt}{\def\lst@numbersep{#1}}
\lst@Key{stepnumber}{1}{\def\lst@stepnumber{#1\relax}}
\lst@AddToHook{EmptyStyle}{\let\lst@stepnumber\@ne}
\lst@Key{numberblanklines}{true}[t]
    {\lstKV@SetIf{#1}\lst@ifnumberblanklines}
\lst@Key{numberfirstline}{f}[t]{\lstKV@SetIf{#1}\lst@ifnumberfirstline}
\gdef\lst@numberfirstlinefalse{\let\lst@ifnumberfirstline\iffalse}
\lst@Key{firstnumber}{auto}{%
    \lstKV@SwitchCases{#1}%
    {auto&\let\lst@firstnumber\@undefined\\%
     last&\let\lst@firstnumber\c@lstnumber
    }{\def\lst@firstnumber{#1\relax}}}
\lst@AddToHook{PreSet}{\let\lst@advancenumber\z@}
\lst@AddToHook{PreInit}
    {\ifx\lst@firstnumber\@undefined
         \let\lst@firstnumber\lst@firstline
     \fi}
\gdef\lst@SetFirstNumber{%
    \ifx\lst@firstnumber\@undefined
        \@tempcnta 0\csname\@lst no@\lst@intname\endcsname\relax
        \ifnum\@tempcnta=\z@ \@tempcnta\lst@firstline
                       \else \lst@nololtrue \fi
        \advance\@tempcnta\lst@advancenumber
        \edef\lst@firstnumber{\the\@tempcnta\relax}%
    \fi}
\gdef\lst@SaveFirstNumber{%
    \expandafter\xdef
        \csname\@lst no\ifx\lst@intname\@empty @ \else @\lst@intname\fi
        \endcsname{\the\c@lstnumber}}
\newcounter{lstnumber}% \global
\global\c@lstnumber\@ne % init
\renewcommand*\thelstnumber{\@arabic\c@lstnumber}
\lst@AddToHook{EveryPar}
    {\global\advance\c@lstnumber\lst@advancelstnum
     \global\advance\c@lstnumber\m@ne \refstepcounter{lstnumber}%
     \lst@SkipOrPrintLabel}%
\global\let\lst@advancelstnum\@ne
\lst@AddToHook{Init}{\def\@currentlabel{\thelstnumber}}
\lst@AddToHook{InitVars}
    {\global\c@lstnumber\lst@firstnumber
     \global\advance\c@lstnumber\lst@advancenumber
     \global\advance\c@lstnumber-\lst@advancelstnum
     \ifx \lst@firstnumber\c@lstnumber
         \global\advance\c@lstnumber-\lst@advancelstnum
     \fi}
\lst@AddToHook{ExitVars}
    {\global\advance\c@lstnumber\lst@advancelstnum}
\AtBeginDocument{%
    \def\theHlstnumber{\ifx\lst@@caption\@empty \lst@neglisting
                                          \else \thelstlisting \fi
                       .\thelstnumber}}
\newcount\lst@skipnumbers % \global
\lst@AddToHook{Init}
    {\ifnum \z@>\lst@stepnumber
         \let\lst@advancelstnum\m@ne
         \edef\lst@stepnumber{-\lst@stepnumber}%
     \fi
     \ifnum \z@<\lst@stepnumber
         \global\lst@skipnumbers\lst@firstnumber
         \global\divide\lst@skipnumbers\lst@stepnumber
         \global\multiply\lst@skipnumbers-\lst@stepnumber
         \global\advance\lst@skipnumbers\lst@firstnumber
         \ifnum\lst@skipnumbers>\z@
             \global\advance\lst@skipnumbers -\lst@stepnumber
         \fi
     \else
         \let\lst@SkipOrPrintLabel\relax
     \fi}
\gdef\lst@SkipOrPrintLabel{%
    \ifnum\lst@skipnumbers=\z@
        \global\advance\lst@skipnumbers-\lst@stepnumber\relax
        \lst@PlaceNumber
        \lst@numberfirstlinefalse
    \else
        \lst@ifnumberfirstline
            \lst@PlaceNumber
            \lst@numberfirstlinefalse
        \fi
    \fi
    \global\advance\lst@skipnumbers\@ne}%
\lst@AddToHook{OnEmptyLine}{%
    \lst@ifnumberblanklines\else \ifnum\lst@skipnumbers=\z@
        \global\advance\lst@skipnumbers-\lst@stepnumber\relax
    \fi\fi}
\lst@EndAspect
\lst@BeginAspect{lineshape}
\lst@Key{xleftmargin}{\z@}{\def\lst@xleftmargin{#1}}
\lst@Key{xrightmargin}{\z@}{\def\lst@xrightmargin{#1}}
\lst@Key{resetmargins}{false}[t]{\lstKV@SetIf{#1}\lst@ifresetmargins}
\lst@AddToHook{BoxUnsafe}{\let\lst@xleftmargin\z@
                          \let\lst@xrightmargin\z@}
\lst@AddToHook{TextStyle}{%
    \let\lst@xleftmargin\z@ \let\lst@xrightmargin\z@
    \let\lst@ifresetmargins\iftrue}
\lst@Key{linewidth}\linewidth{\def\lst@linewidth{#1}}
\lst@AddToHook{PreInit}{\linewidth\lst@linewidth\relax}
\gdef\lst@parshape{%
    \parshape\@ne \@totalleftmargin \linewidth}
\lst@AddToHook{Init}
    {\lst@ifresetmargins
         \advance\linewidth\@totalleftmargin
         \advance\linewidth\rightmargin
         \@totalleftmargin\z@
     \fi
     \advance\linewidth-\lst@xleftmargin
     \advance\linewidth-\lst@xrightmargin
     \advance\@totalleftmargin\lst@xleftmargin\relax}
\lst@Key{lineskip}{\z@}{\def\lst@lineskip{#1\relax}}
\lst@AddToHook{Init}
    {\parskip\z@
     \ifdim\z@=\lst@lineskip\else
         \@tempdima\baselineskip
         \advance\@tempdima\lst@lineskip
         \multiply\@tempdima\@cclvi
         \divide\@tempdima\baselineskip\relax
         \multiply\@tempdima\@cclvi
         \edef\baselinestretch{\strip@pt\@tempdima}%
         \selectfont
     \fi}
\lst@Key{breaklines}{false}[t]{\lstKV@SetIf{#1}\lst@ifbreaklines}
\lst@Key{breakindent}{20pt}{\def\lst@breakindent{#1}}
\lst@Key{breakautoindent}{t}[t]{\lstKV@SetIf{#1}\lst@ifbreakautoindent}
\lst@Key{prebreak}{}{\def\lst@prebreak{#1}}
\lst@Key{postbreak}{}{\def\lst@postbreak{#1}}
\lst@AddToHook{Init}
    {\lst@ifbreaklines
         \hbadness\@M \pretolerance\@M
         \def\lst@parshape{\parshape\tw@ \@totalleftmargin\linewidth
                           \lst@breakshape}%
     \else
         \let\lst@discretionary\@empty
     \fi}
\lst@AddToHook{OnNewLine}
    {\lst@ifbreaklines \lst@breakNewLine \fi}
\gdef\lst@discretionary{%
    \discretionary{\let\space\lst@spacekern\lst@prebreak}%
                  {\llap{\lsthk@EveryLine
                   \kern\lst@breakcurrindent \kern-\@totalleftmargin}%
                   \let\space\lst@spacekern\lst@postbreak}{}}
\lst@AddToHook{PostOutput}{\lst@discretionary}
\gdef\lst@spacekern{\kern\lst@width}
\gdef\lst@breakNewLine{%
    \@tempdima\lst@breakindent\relax
    \lst@ifbreakautoindent \advance\@tempdima\lst@lostspace \fi
    \@tempdimc-\@tempdima \advance\@tempdimc\linewidth
                          \advance\@tempdima\@totalleftmargin
    \xdef\lst@breakshape{\noexpand\lst@breakcurrindent \the\@tempdimc}%
    \xdef\lst@breakcurrindent{\the\@tempdima}}
\global\let\lst@breakcurrindent\z@ % init
\gdef\lst@breakshape{\@totalleftmargin \linewidth}
\gdef\lst@breakProcessOther#1{\lst@ProcessOther#1\lst@OutputOther}
\lst@AddToHook{SelectCharTable}
    {\lst@ifbreaklines \lst@Def{`)}{\lst@breakProcessOther)}\fi}
\lst@EndAspect
\lst@BeginAspect[lineshape]{frames}
\lst@Key{framexleftmargin}{\z@}{\def\lst@framexleftmargin{#1}}
\lst@Key{framexrightmargin}{\z@}{\def\lst@framexrightmargin{#1}}
\lst@Key{framextopmargin}{\z@}{\def\lst@framextopmargin{#1}}
\lst@Key{framexbottommargin}{\z@}{\def\lst@framexbottommargin{#1}}
\lst@Key{backgroundcolor}{}{\def\lst@bkgcolor{#1}}
\lst@Key{fillcolor}{}{\def\lst@fillcolor{#1}}
\lst@Key{rulecolor}{}{\def\lst@rulecolor{#1}}
\lst@Key{rulesepcolor}{}{\def\lst@rulesepcolor{#1}}
\lst@AddToHook{Init}{%
    \ifx\lst@fillcolor\@empty
        \let\lst@fillcolor\lst@bkgcolor
    \fi
    \ifx\lst@rulesepcolor\@empty
        \let\lst@rulesepcolor\lst@fillcolor
    \fi}
\lst@Key{rulesep}{2pt}{\def\lst@rulesep{#1}}
\lst@Key{framerule}{.4pt}{\def\lst@framerulewidth{#1}}
\lst@Key{framesep}{3pt}{\def\lst@frametextsep{#1}}
\lst@Key{frameshape}{}{%
    \let\lst@xrulecolor\@empty
    \lstKV@FourArg{#1}%
    {\uppercase{\def\lst@frametshape{##1}}%
     \uppercase{\def\lst@framelshape{##2}}%
     \uppercase{\def\lst@framershape{##3}}%
     \uppercase{\def\lst@framebshape{##4}}%
     \let\lst@ifframeround\iffalse
     \lst@IfSubstring R\lst@frametshape{\let\lst@ifframeround\iftrue}{}%
     \lst@IfSubstring R\lst@framebshape{\let\lst@ifframeround\iftrue}{}%
     \def\lst@frame{##1##2##3##4}}}
\lst@Key{frameround}\relax
    {\uppercase{\def\lst@frameround{#1}}%
     \expandafter\lstframe@\lst@frameround ffff\relax}
\global\let\lst@frameround\@empty
\lst@Key{frame}\relax{%
    \let\lst@xrulecolor\@empty
    \lstKV@SwitchCases{#1}%
    {none&\let\lst@frame\@empty\\%
     leftline&\def\lst@frame{l}\\%
     topline&\def\lst@frame{t}\\%
     bottomline&\def\lst@frame{b}\\%
     lines&\def\lst@frame{tb}\\%
     single&\def\lst@frame{trbl}\\%
     shadowbox&\def\lst@frame{tRBl}%
            \def\lst@xrulecolor{\lst@rulesepcolor}%
            \def\lst@rulesep{\lst@frametextsep}%
    }{\def\lst@frame{#1}}%
    \expandafter\lstframe@\lst@frameround ffff\relax}
\gdef\lstframe@#1#2#3#4#5\relax{%
    \lst@IfSubstring T\lst@frame{\edef\lst@frame{t\lst@frame}}{}%
    \lst@IfSubstring R\lst@frame{\edef\lst@frame{r\lst@frame}}{}%
    \lst@IfSubstring B\lst@frame{\edef\lst@frame{b\lst@frame}}{}%
    \lst@IfSubstring L\lst@frame{\edef\lst@frame{l\lst@frame}}{}%
    \let\lst@frametshape\@empty \let\lst@framebshape\@empty
    \lst@frameCheck
        ltr\lst@framelshape\lst@frametshape\lst@framershape #4#1%
    \lst@frameCheck
        LTR\lst@framelshape\lst@frametshape\lst@framershape #4#1%
    \lst@frameCheck
        lbr\lst@framelshape\lst@framebshape\lst@framershape #3#2%
    \lst@frameCheck
        LBR\lst@framelshape\lst@framebshape\lst@framershape #3#2%
    \let\lst@ifframeround\iffalse
    \lst@IfSubstring R\lst@frametshape{\let\lst@ifframeround\iftrue}{}%
    \lst@IfSubstring R\lst@framebshape{\let\lst@ifframeround\iftrue}{}%
    \let\lst@framelshape\@empty \let\lst@framershape\@empty
    \lst@IfSubstring L\lst@frame
        {\def\lst@framelshape{YY}}%
        {\lst@IfSubstring l\lst@frame{\def\lst@framelshape{Y}}{}}%
    \lst@IfSubstring R\lst@frame
        {\def\lst@framershape{YY}}%
        {\lst@IfSubstring r\lst@frame{\def\lst@framershape{Y}}{}}}
\gdef\lst@frameCheck#1#2#3#4#5#6#7#8{%
    \lst@IfSubstring #1\lst@frame
        {\if #7T\def#4{R}\else \def#4{Y}\fi}%
        {\def#4{N}}%
    \lst@IfSubstring #3\lst@frame
        {\if #8T\def#6{R}\else \def#6{Y}\fi}%
        {\def#6{N}}%
    \lst@IfSubstring #2\lst@frame{\edef#5{#5#4Y#6}}{}}
\lst@AddToHook{TextStyle}
   {\let\lst@frame\@empty
    \let\lst@frametshape\@empty
    \let\lst@framershape\@empty
    \let\lst@framebshape\@empty
    \let\lst@framelshape\@empty}
\gdef\lst@frameMakeBoxV#1#2#3{%
    \setbox#1\hbox{%
      \color@begingroup \lst@rulecolor
      \llap{\setbox\z@\hbox{\vrule\@width\z@\@height#2\@depth#3%
                            \lst@frameL}%
            \rlap{\lst@frameBlock\lst@rulesepcolor{\wd\z@}%
                                                  {\ht\z@}{\dp\z@}}%
            \box\z@
            \ifx\lst@framelshape\@empty
                \kern\lst@frametextsep\relax
            \else
                \lst@frameBlock\lst@fillcolor\lst@frametextsep{#2}{#3}%
            \fi
            \kern\lst@framexleftmargin}%
      \rlap{\kern-\lst@framexleftmargin
                    \@tempdima\linewidth
            \advance\@tempdima\lst@framexleftmargin
            \advance\@tempdima\lst@framexrightmargin
            \lst@frameBlock\lst@bkgcolor\@tempdima{#2}{#3}%
            \ifx\lst@framershape\@empty
                \kern\lst@frametextsep\relax
            \else
                \lst@frameBlock\lst@fillcolor\lst@frametextsep{#2}{#3}%
            \fi
            \setbox\z@\hbox{\vrule\@width\z@\@height#2\@depth#3%
                            \lst@frameR}%
            \rlap{\lst@frameBlock\lst@rulesepcolor{\wd\z@}%
                                                  {\ht\z@}{\dp\z@}}%
            \box\z@}%
      \color@endgroup}}
\gdef\lst@frameBlock#1#2#3#4{%
    \color@begingroup
      #1%
      \setbox\z@\hbox{\vrule\@height#3\@depth#4%
                      \ifx#1\@empty \@width\z@ \kern#2\relax
                              \else \@width#2\relax \fi}%
      \box\z@
    \color@endgroup}
\gdef\lst@frameR{%
    \expandafter\lst@frameR@\lst@framershape\relax
    \kern-\lst@rulesep}
\gdef\lst@frameR@#1{%
    \ifx\relax#1\@empty\else
        \if #1Y\lst@framevrule \else \kern\lst@framerulewidth \fi
        \kern\lst@rulesep
        \expandafter\lst@frameR@b
    \fi}
\gdef\lst@frameR@b#1{%
    \ifx\relax#1\@empty
    \else
        \if #1Y\color@begingroup
               \lst@xrulecolor
               \lst@framevrule
               \color@endgroup
        \else
               \kern\lst@framerulewidth
        \fi
        \kern\lst@rulesep
        \expandafter\lst@frameR@
    \fi}
\gdef\lst@frameL{%
    \kern-\lst@rulesep
    \expandafter\lst@frameL@\lst@framelshape\relax}
\gdef\lst@frameL@#1{%
    \ifx\relax#1\@empty\else
        \kern\lst@rulesep
        \if#1Y\lst@framevrule \else \kern\lst@framerulewidth \fi
        \expandafter\lst@frameL@
    \fi}
\gdef\lst@frameH#1#2{%
    \global\let\lst@framediml\z@ \global\let\lst@framedimr\z@
    \setbox\z@\hbox{}\@tempcntb\z@
    \expandafter\lst@frameH@\expandafter#1#2\relax\relax\relax
            \@tempdimb\lst@frametextsep\relax
    \advance\@tempdimb\lst@framerulewidth\relax
            \@tempdimc-\@tempdimb
    \advance\@tempdimc\ht\z@
    \advance\@tempdimc\dp\z@
    \setbox\z@=\hbox{%
      \lst@frameHBkg\lst@fillcolor\@tempdimb\@firstoftwo
      \if#1T\rlap{\raise\dp\@tempboxa\box\@tempboxa}%
       \else\rlap{\lower\ht\@tempboxa\box\@tempboxa}\fi
      \lst@frameHBkg\lst@rulesepcolor\@tempdimc\@secondoftwo
      \advance\@tempdimb\ht\@tempboxa
      \if#1T\rlap{\raise\lst@frametextsep\box\@tempboxa}%
       \else\rlap{\lower\@tempdimb\box\@tempboxa}\fi
      \rlap{\box\z@}%
    }}
\gdef\lst@frameH@#1#2#3#4{%
    \ifx\relax#4\@empty\else
        \lst@frameh \@tempcntb#1#2#3#4%
        \advance\@tempcntb\@ne
        \expandafter\lst@frameH@\expandafter#1%
    \fi}
\gdef\lst@frameHBkg#1#2#3{%
    \setbox\@tempboxa\hbox{%
        \kern-\lst@framexleftmargin
        #3{\kern-\lst@framediml\relax}{\@tempdima\z@}%
        \ifdim\lst@framediml>\@tempdimb
            #3{\@tempdima\lst@framediml \advance\@tempdima-\@tempdimb
               \lst@frameBlock\lst@rulesepcolor\@tempdima\@tempdimb\z@}%
              {\kern-\lst@framediml
               \advance\@tempdima\lst@framediml\relax}%
        \fi
        #3{\@tempdima\z@
           \ifx\lst@framelshape\@empty\else
               \advance\@tempdima\@tempdimb
           \fi
           \ifx\lst@framershape\@empty\else
               \advance\@tempdima\@tempdimb
           \fi}%
          {\ifdim\lst@framedimr>\@tempdimb
              \advance\@tempdima\lst@framedimr\relax
           \fi}%
        \advance\@tempdima\linewidth
        \advance\@tempdima\lst@framexleftmargin
        \advance\@tempdima\lst@framexrightmargin
        \lst@frameBlock#1\@tempdima#2\z@
        #3{\ifdim\lst@framedimr>\@tempdimb
               \@tempdima-\@tempdimb
               \advance\@tempdima\lst@framedimr\relax
               \lst@frameBlock\lst@rulesepcolor\@tempdima\@tempdimb\z@
           \fi}{}%
        }}
\gdef\lst@frameh#1#2#3#4#5{%
    \lst@frameCalcDimA#1%
    \lst@ifframeround \@getcirc\@tempdima \fi
    \setbox\z@\hbox{%
      \begingroup
      \setbox\z@\hbox{%
        \kern-\lst@framexleftmargin
        \color@begingroup
        \ifnum#1=\z@ \lst@rulecolor \else \lst@xrulecolor \fi
        \lst@frameCornerX\llap{#2L}#3#1%
        \ifdim\lst@framediml<\@tempdimb
            \xdef\lst@framediml{\the\@tempdimb}%
        \fi
        \begingroup
        \if#4Y\else \let\lst@framerulewidth\z@ \fi
                \@tempdima\lst@framexleftmargin
        \advance\@tempdima\lst@framexrightmargin
        \advance\@tempdima\linewidth
        \vrule\@width\@tempdima\@height\lst@framerulewidth \@depth\z@
        \endgroup
        \lst@frameCornerX\rlap{#2R}#5#1%
        \ifdim\lst@framedimr<\@tempdimb
            \xdef\lst@framedimr{\the\@tempdimb}%
        \fi
        \color@endgroup}%
      \if#2T\rlap{\raise\dp\z@\box\z@}%
       \else\rlap{\lower\ht\z@\box\z@}\fi
      \endgroup
      \box\z@}}
\gdef\lst@frameCornerX#1#2#3#4{%
    \setbox\@tempboxa\hbox{\csname\@lst @frame\if#3RR\fi #2\endcsname}%
    \@tempdimb\wd\@tempboxa
    \if #3R%
        #1{\box\@tempboxa}%
    \else
        \if #3Y\expandafter#1\else
               \@tempdimb\z@ \expandafter\vphantom \fi
        {\box\@tempboxa}%
    \fi}
\gdef\lst@frameCalcDimA#1{%
            \@tempdima\lst@rulesep
    \advance\@tempdima\lst@framerulewidth
    \multiply\@tempdima#1\relax
    \advance\@tempdima\lst@frametextsep
    \advance\@tempdima\lst@framerulewidth
    \multiply\@tempdima\tw@}
\lst@AddToHook{Init}{\lst@frameInit}
\newbox\lst@framebox
\gdef\lst@frameInit{%
    \ifx\lst@framelshape\@empty \let\lst@frameL\@empty \fi
    \ifx\lst@framershape\@empty \let\lst@frameR\@empty \fi
    \def\lst@framevrule{\vrule\@width\lst@framerulewidth\relax}%
    \lst@ifframeround
        \lst@frameCalcDimA\z@ \@getcirc\@tempdima
        \@tempdimb\@tempdima \divide\@tempdimb\tw@
        \advance\@tempdimb -\@wholewidth
        \edef\lst@frametextsep{\the\@tempdimb}%
        \edef\lst@framerulewidth{\the\@wholewidth}%
        \lst@frameCalcDimA\@ne \@getcirc\@tempdima
        \@tempdimb\@tempdima \divide\@tempdimb\tw@
        \advance\@tempdimb -\tw@\@wholewidth
        \advance\@tempdimb -\lst@frametextsep
        \edef\lst@rulesep{\the\@tempdimb}%
    \fi
    \lst@frameMakeBoxV\lst@framebox{\ht\strutbox}{\dp\strutbox}%
    \def\lst@framelr{\copy\lst@framebox}%
    \ifx\lst@frametshape\@empty\else
        \lst@frameH T\lst@frametshape
        \ifvoid\z@\else
            \par\lst@parshape
            \@tempdima-\baselineskip \advance\@tempdima\ht\z@
            \ifdim\prevdepth<\@cclvi\p@\else
                \advance\@tempdima\prevdepth
            \fi
            \ifdim\@tempdima<\z@
                \vskip\@tempdima\vskip\lineskip
            \fi
            \noindent\box\z@\par
            \lineskiplimit\maxdimen \lineskip\z@
        \fi
        \lst@frameSpreadV\lst@framextopmargin
    \fi}
\lst@AddToHook{EveryLine}{\lst@framelr}
\global\let\lst@framelr\@empty
\lst@AddToHook{DeInit}
    {\ifx\lst@framebshape\@empty\else \lst@frameExit \fi}
\gdef\lst@frameExit{%
    \lst@frameSpreadV\lst@framexbottommargin
    \lst@frameH B\lst@framebshape
    \ifvoid\z@\else
        \everypar{}\par\lst@parshape\nointerlineskip\noindent\box\z@
    \fi}
\gdef\lst@frameSpreadV#1{%
    \ifdim\z@=#1\else
        \everypar{}\par\lst@parshape\nointerlineskip\noindent
        \lst@frameMakeBoxV\z@{#1}{\z@}%
        \box\z@
    \fi}
\gdef\lst@frameTR{%
    \vrule\@width.5\@tempdima\@height\lst@framerulewidth\@depth\z@
    \kern-\lst@framerulewidth
    \raise\lst@framerulewidth\hbox{%
        \vrule\@width\lst@framerulewidth\@height\z@\@depth.5\@tempdima}}
\gdef\lst@frameBR{%
    \vrule\@width.5\@tempdima\@height\lst@framerulewidth\@depth\z@
    \kern-\lst@framerulewidth
    \vrule\@width\lst@framerulewidth\@height.5\@tempdima\@depth\z@}
\gdef\lst@frameBL{%
    \vrule\@width\lst@framerulewidth\@height.5\@tempdima\@depth\z@
    \kern-\lst@framerulewidth
    \vrule\@width.5\@tempdima\@height\lst@framerulewidth\@depth\z@}
\gdef\lst@frameTL{%
    \raise\lst@framerulewidth\hbox{%
        \vrule\@width\lst@framerulewidth\@height\z@\@depth.5\@tempdima}%
    \kern-\lst@framerulewidth
    \vrule\@width.5\@tempdima\@height\lst@framerulewidth\@depth\z@}
\gdef\lst@frameRoundT{%
    \setbox\@tempboxa\hbox{\@circlefnt\char\@tempcnta}%
    \ht\@tempboxa\lst@framerulewidth
    \box\@tempboxa}
\gdef\lst@frameRoundB{%
    \setbox\@tempboxa\hbox{\@circlefnt\char\@tempcnta}%
    \dp\@tempboxa\z@
    \box\@tempboxa}
\gdef\lst@frameRTR{%
    \hb@xt@.5\@tempdima{\kern-\lst@framerulewidth
                           \kern.5\@tempdima \lst@frameRoundT \hss}}
\gdef\lst@frameRBR{%
    \hb@xt@.5\@tempdima{\kern-\lst@framerulewidth
    \advance\@tempcnta\@ne \kern.5\@tempdima \lst@frameRoundB \hss}}
\gdef\lst@frameRBL{%
    \advance\@tempcnta\tw@ \lst@frameRoundB
    \kern-.5\@tempdima}
\gdef\lst@frameRTL{%
    \advance\@tempcnta\thr@@\lst@frameRoundT
    \kern-.5\@tempdima}
\lst@EndAspect
\lst@BeginAspect[keywords]{make}
\lst@NewMode\lst@makemode
\lst@AddToHook{Output}{%
    \ifnum\lst@mode=\lst@makemode
        \ifx\lst@thestyle\lst@gkeywords@sty
            \lst@makekeytrue
        \fi
    \fi}
\gdef\lst@makekeytrue{\let\lst@ifmakekey\iftrue}
\gdef\lst@makekeyfalse{\let\lst@ifmakekey\iffalse}
\global\lst@makekeyfalse % init
\lst@Key{makemacrouse}f[t]{\lstKV@SetIf{#1}\lst@ifmakemacrouse}
\gdef\lst@MakeSCT{%
    \lst@ifmakemacrouse
        \lst@ReplaceInput{$(}{%
            \lst@PrintToken
            \lst@EnterMode\lst@makemode{\lst@makekeyfalse}%
            \lst@Merge{\lst@ProcessOther\$\lst@ProcessOther(}}%
        \lst@ReplaceInput{)}{%
            \ifnum\lst@mode=\lst@makemode
                \lst@PrintToken
                \begingroup
                    \lst@ProcessOther)%
                    \lst@ifmakekey
                        \let\lst@currstyle\lst@gkeywords@sty
                    \fi
                    \lst@OutputOther
                \endgroup
                \lst@LeaveMode
            \else
                \expandafter\lst@ProcessOther\expandafter)%
            \fi}%
    \else
        \lst@ReplaceInput{$(}{\lst@ProcessOther\$\lst@ProcessOther(}%
    \fi}
\lst@EndAspect
\lst@BeginAspect{0.21}
\lst@Key{labelstyle}{}{\def\lst@numberstyle{#1}}
\lst@Key{labelsep}{10pt}{\def\lst@numbersep{#1}}
\lst@Key{labelstep}{0}{%
    \ifnum #1=\z@ \KV@lst@numbers{none}%
            \else \KV@lst@numbers{left}\fi
    \def\lst@stepnumber{#1\relax}}
\lst@Key{firstlabel}\relax{\def\lst@firstnumber{#1\relax}}
\lst@Key{advancelabel}\relax{\def\lst@advancenumber{#1\relax}}
\let\c@lstlabel\c@lstnumber
\lst@AddToHook{Init}{\def\thelstnumber{\thelstlabel}}
\newcommand*\thelstlabel{\@arabic\c@lstlabel}
\lst@Key{first}\relax{\def\lst@firstline{#1\relax}}
\lst@Key{last}\relax{\def\lst@lastline{#1\relax}}
\lst@Key{framerulewidth}{.4pt}{\def\lst@framerulewidth{#1}}
\lst@Key{framerulesep}{2pt}{\def\lst@rulesep{#1}}
\lst@Key{frametextsep}{3pt}{\def\lst@frametextsep{#1}}
\lst@Key{framerulecolor}{}{\lstKV@OptArg[]{#1}%
    {\ifx\@empty##2\@empty
         \let\lst@rulecolor\@empty
     \else
         \ifx\@empty##1\@empty
             \def\lst@rulecolor{\color{##2}}%
         \else
             \def\lst@rulecolor{\color[##1]{##2}}%
         \fi
     \fi}}
\lst@Key{backgroundcolor}{}{\lstKV@OptArg[]{#1}%
    {\ifx\@empty##2\@empty
         \let\lst@bkgcolor\@empty
     \else
         \ifx\@empty##1\@empty
             \def\lst@bkgcolor{\color{##2}}%
         \else
             \def\lst@bkgcolor{\color[##1]{##2}}%
         \fi
     \fi}}
\lst@Key{framespread}{\z@}{\def\lst@framespread{#1}}
\lst@AddToHook{PreInit}
    {\@tempdima\lst@framespread\relax \divide\@tempdima\tw@
     \edef\lst@framextopmargin{\the\@tempdima}%
     \let\lst@framexrightmargin\lst@framextopmargin
     \let\lst@framexbottommargin\lst@framextopmargin
     \advance\@tempdima\lst@xleftmargin\relax
     \edef\lst@framexleftmargin{\the\@tempdima}}
\newdimen\lst@innerspread \newdimen\lst@outerspread
\lst@Key{spread}{\z@,\z@}{\lstKV@CSTwoArg{#1}%
    {\lst@innerspread##1\relax
     \ifx\@empty##2\@empty
         \divide\lst@innerspread\tw@\relax
         \lst@outerspread\lst@innerspread
     \else
         \lst@outerspread##2\relax
     \fi}}
\lst@AddToHook{BoxUnsafe}{\lst@outerspread\z@ \lst@innerspread\z@}
\lst@Key{wholeline}{false}[t]{\lstKV@SetIf{#1}\lst@ifresetmargins}
\lst@Key{indent}{\z@}{\def\lst@xleftmargin{#1}}
\lst@AddToHook{PreInit}
    {\lst@innerspread=-\lst@innerspread
     \lst@outerspread=-\lst@outerspread
     \ifodd\c@page \advance\lst@innerspread\lst@xleftmargin
             \else \advance\lst@outerspread\lst@xleftmargin \fi
     \ifodd\c@page
         \edef\lst@xleftmargin{\the\lst@innerspread}%
         \edef\lst@xrightmargin{\the\lst@outerspread}%
     \else
         \edef\lst@xleftmargin{\the\lst@outerspread}%
         \edef\lst@xrightmargin{\the\lst@innerspread}%
     \fi}
\lst@Key{defaultclass}\relax{\def\lst@classoffset{#1}}
\lst@Key{stringtest}\relax{}% dummy
\lst@Key{outputpos}\relax{\lst@outputpos#1\relax\relax}
\lst@Key{stringspaces}\relax[t]{\lstKV@SetIf{#1}\lst@ifshowstringspaces}
\lst@Key{visisblespaces}\relax[t]{\lstKV@SetIf{#1}\lst@ifshowspaces}
\lst@Key{visibletabs}\relax[t]{\lstKV@SetIf{#1}\lst@ifshowtabs}
\lst@EndAspect
\lst@BeginAspect{fancyvrb}
\@ifundefined{FancyVerbFormatLine}
    {\typeout{^^J%
     ***^^J%
     *** `listings.sty' needs `fancyvrb.sty' right now.^^J%
     *** Please ensure its availability and try again.^^J%
     ***^^J}%
     \batchmode \@@end}{}
\gdef\lstFV@fancyvrb{%
    \lst@iffancyvrb
        \ifx\FancyVerbFormatLine\lstFV@FancyVerbFormatLine\else
            \let\lstFV@FVFL\FancyVerbFormatLine
            \let\FancyVerbFormatLine\lstFV@FancyVerbFormatLine
        \fi
    \else
        \ifx\lstFV@FVFL\@undefined\else
            \let\FancyVerbFormatLine\lstFV@FVFL
            \let\lstFV@FVFL\@undefined
        \fi
    \fi}
\gdef\lstFV@VerbatimBegin{%
    \ifx\FancyVerbFormatLine\lstFV@FancyVerbFormatLine
        \lsthk@TextStyle \lsthk@BoxUnsafe
        \lsthk@PreSet
        \lst@activecharsfalse
        \let\normalbaselines\relax
        \lst@Init\relax
        \lst@ifresetmargins \advance\linewidth-\@totalleftmargin \fi
        \everypar{}\global\lst@newlines\z@
        \lst@mode\lst@nomode \let\lst@entermodes\@empty
        \lst@InterruptModes
%% D.G. modification begin - Nov. 25, 1998
        \let\@noligs\relax
%% D.G. modification end
    \fi}
\gdef\lstFV@VerbatimEnd{%
    \ifx\FancyVerbFormatLine\lstFV@FancyVerbFormatLine
        \global\setbox\lstFV@gtempboxa\box\@tempboxa
        \global\let\@gtempa\FV@ProcessLine
        \lst@mode\lst@Pmode
        \lst@DeInit
        \let\FV@ProcessLine\@gtempa
        \setbox\@tempboxa\box\lstFV@gtempboxa
        \par
    \fi}
\newbox\lstFV@gtempboxa
\lst@AddTo\FV@VerbatimBegin\lstFV@VerbatimBegin
\lst@AddToAtTop\FV@VerbatimEnd\lstFV@VerbatimEnd
\lst@AddTo\FV@LVerbatimBegin\lstFV@VerbatimBegin
\lst@AddToAtTop\FV@LVerbatimEnd\lstFV@VerbatimEnd
\lst@AddTo\FV@BVerbatimBegin\lstFV@VerbatimBegin
\lst@AddToAtTop\FV@BVerbatimEnd\lstFV@VerbatimEnd
\gdef\lstFV@FancyVerbFormatLine#1{%
    \let\lst@arg\@empty \lst@FVConvert#1\@nil
    \global\lst@newlines\z@
    \vtop{\leavevmode\lst@parshape
          \lst@ReenterModes
          \lst@arg \lst@PrintToken\lst@EOLUpdate\lsthk@InitVarsBOL
          \lst@InterruptModes}}
\lst@Key{fvcmdparams}%
    {\overlay\@ne}%
    {\def\lst@FVcmdparams{,#1}}
\lst@Key{morefvcmdparams}\relax{\lst@lAddTo\lst@FVcmdparams{,#1}}
\gdef\lst@FVConvert{\@tempcnta\z@ \lst@FVConvertO@}%
\gdef\lst@FVConvertO@{%
    \ifcase\@tempcnta
        \expandafter\futurelet\expandafter\@let@token
        \expandafter\lst@FVConvert@@
    \else
        \expandafter\lst@FVConvertO@a
    \fi}
\gdef\lst@FVConvertO@a#1{%
    \lst@lAddTo\lst@arg{{#1}}\advance\@tempcnta\m@ne
    \lst@FVConvertO@}%
\gdef\lst@FVConvert@@{%
    \ifcat\noexpand\@let@token\bgroup \expandafter\lst@FVConvertArg
                                \else \expandafter\lst@FVConvert@ \fi}
\gdef\lst@FVConvertArg#1{%
    {\let\lst@arg\@empty
     \lst@FVConvert#1\@nil
     \global\let\@gtempa\lst@arg}%
     \lst@lExtend\lst@arg{\expandafter{\@gtempa\lst@PrintToken}}%
     \lst@FVConvert}
\gdef\lst@FVConvert@#1{%
    \ifx \@nil#1\else
       \if\relax\noexpand#1%
          \lst@lAddTo\lst@arg{\lst@OutputLostSpace\lst@PrintToken#1}%
       \else
          \lccode`\~=`#1\lowercase{\lst@lAddTo\lst@arg~}%
       \fi
       \expandafter\lst@FVConvert
    \fi}
\gdef\lst@FVConvert@#1{%
    \ifx \@nil#1\else
       \if\relax\noexpand#1%
          \lst@lAddTo\lst@arg{\lst@OutputLostSpace\lst@PrintToken#1}%
          \def\lst@temp##1,#1##2,##3##4\relax{%
              \ifx##3\@empty \else \@tempcnta##2\relax \fi}%
          \expandafter\lst@temp\lst@FVcmdparams,#1\z@,\@empty\relax
       \else
          \lccode`\~=`#1\lowercase{\lst@lAddTo\lst@arg~}%
       \fi
       \expandafter\lst@FVConvertO@
    \fi}
\lst@EndAspect
\lst@BeginAspect[keywords,comments,strings,language]{lgrind}
\gdef\lst@LGGetNames#1:#2\relax{%
    \lst@NormedDef\lstlang@{#1}\lst@ReplaceInArg\lstlang@{|,}%
    \def\lst@arg{:#2}}
\gdef\lst@LGGetValue#1{%
    \lst@false
    \def\lst@temp##1:#1##2##3\relax{%
        \ifx\@empty##2\else \lst@LGGetValue@{#1}\fi}
    \expandafter\lst@temp\lst@arg:#1\@empty\relax}
\gdef\lst@LGGetValue@#1{%
    \lst@true
    \def\lst@temp##1:#1##2:##3\relax{%
        \@ifnextchar=\lst@LGGetValue@@{\lst@LGGetValue@@=}##2\relax
        \def\lst@arg{##1:##3}}%
    \expandafter\lst@temp\lst@arg\relax}
\gdef\lst@LGGetValue@@=#1\relax{\def\lst@LGvalue{#1}}
\gdef\lst@LGGetComment#1#2{%
    \let#2\@empty
    \lst@LGGetValue{#1b}%
    \lst@if
        \let#2\lst@LGvalue
        \lst@LGGetValue{#1e}%
        \ifx\lst@LGvalue\lst@LGEOL
            \edef\lstlang@{\lstlang@,commentline={#2}}%
            \let#2\@empty
        \else
            \edef#2{{#2}{\lst@LGvalue}}%
        \fi
    \fi}
\gdef\lst@LGGetString#1#2{%
    \lst@LGGetValue{#1b}%
    \lst@if
        \let#2\lst@LGvalue
        \lst@LGGetValue{#1e}%
        \ifx\lst@LGvalue\lst@LGEOL
            \edef\lstlang@{\lstlang@,morestringizer=[l]{#2}}%
        \else
            \ifx #2\lst@LGvalue
                \edef\lstlang@{\lstlang@,morestringizer=[d]{#2}}%
            \else
                \edef\lst@temp{\lst@LGe#2}%
                \ifx \lst@temp\lst@LGvalue
                    \edef\lstlang@{\lstlang@,morestringizer=[b]{#2}}%
                \else
                    \PackageWarning{Listings}%
                    {String #2...\lst@LGvalue\space not supported}%
                \fi
            \fi
        \fi
    \fi}
\gdef\lst@LGDefLang{%
    \lst@LGReplace
    \let\lstlang@\empty
    \lst@LGGetValue{kw}%
    \lst@if
        \lst@ReplaceInArg\lst@LGvalue{{ },}%
        \edef\lstlang@{\lstlang@,keywords={\lst@LGvalue}}%
    \fi
    \lst@LGGetValue{oc}%
    \lst@if
        \edef\lstlang@{\lstlang@,sensitive=f}%
    \fi
    \lst@LGGetValue{id}%
    \lst@if
        \edef\lstlang@{\lstlang@,alsoletter=\lst@LGvalue}%
    \fi
    \lst@LGGetComment a\lst@LGa
    \lst@LGGetComment c\lst@LGc
    \ifx\lst@LGa\@empty
        \ifx\lst@LGc\@empty\else
            \edef\lstlang@{\lstlang@,singlecomment=\lst@LGc}%
        \fi
    \else
        \ifx\lst@LGc\@empty
            \edef\lstlang@{\lstlang@,singlecomment=\lst@LGa}%
        \else
            \edef\lstlang@{\lstlang@,doublecomment=\lst@LGc\lst@LGa}%
        \fi
    \fi
    \lst@LGGetString s\lst@LGa
    \lst@LGGetString l\lst@LGa
    \lst@LGGetValue{tc}%
    \lst@if
        \edef\lstlang@{\lstlang@,lgrindef=\lst@LGvalue}%
    \fi
    \expandafter\xdef\csname\@lst LGlang@\lst@language@\endcsname
        {\noexpand\lstset{\lstlang@}}%
    \lst@ReplaceInArg\lst@arg{{: :}:}\let\lst@LGvalue\@empty
    \expandafter\lst@LGDroppedCaps\lst@arg\relax\relax
    \ifx\lst@LGvalue\@empty\else
        \PackageWarningNoLine{Listings}{Ignored capabilities for
            \space `\lst@language@' are\MessageBreak\lst@LGvalue}%
    \fi}
\gdef\lst@LGDroppedCaps#1:#2#3{%
    \ifx#2\relax
        \lst@RemoveCommas\lst@LGvalue
    \else
        \edef\lst@LGvalue{\lst@LGvalue,#2#3}%
        \expandafter\lst@LGDroppedCaps
    \fi}
\begingroup
\catcode`\/=0
\lccode`\z=`\:\lccode`\y=`\^\lccode`\x=`\$\lccode`\v=`\|
\catcode`\\=12\relax
/lowercase{%
/gdef/lst@LGReplace{/lst@ReplaceInArg/lst@arg
    {{\:}{z }{\^}{y}{\$}{x}{\|}{v}{ \ }{ }{:\ :}{:}{\ }{ }{\(}({\)})}}
/gdef/lst@LGe{\e}
}
/endgroup
\gdef\lst@LGRead#1\par{%
    \lst@LGGetNames#1:\relax
    \def\lst@temp{endoflanguagedefinitions}%
    \ifx\lstlang@\lst@temp
        \let\lst@next\endinput
    \else
        \expandafter\lst@IfOneOf\lst@language@\relax\lstlang@
            {\lst@LGDefLang \let\lst@next\endinput}%
            {\let\lst@next\lst@LGRead}%
    \fi
    \lst@next}
\lst@Key{lgrindef}\relax{%
    \lst@NormedDef\lst@language@{#1}%
    \begingroup
    \@ifundefined{lstLGlang@\lst@language@}%
        {\everypar{\lst@LGRead}%
         \catcode`\\=12\catcode`\{=12\catcode`\}=12\catcode`\%=12%
         \catcode`\#=14\catcode`\$=12\catcode`\^=12\catcode`\_=12\relax
         \input{\lstlgrindeffile}%
        }{}%
    \endgroup
    \@ifundefined{lstLGlang@\lst@language@}%
        {\PackageError{Listings}%
         {LGrind language \lst@language@\space undefined}%
         {The language is not loadable. \@ehc}}%
        {\lsthk@SetLanguage
         \csname\@lst LGlang@\lst@language@\endcsname}}
\@ifundefined{lstlgrindeffile}
    {\lst@UserCommand\lstlgrindeffile{lgrindef.}}{}
\lst@EndAspect
\lst@BeginAspect[keywords]{hyper}
\lst@Key{hyperanchor}\hyper@@anchor{\let\lst@hyperanchor#1}
\lst@Key{hyperlink}\hyperlink{\let\lst@hyperlink#1}
\lst@InstallKeywords{h}{hyperref}{}\relax{}
    {\begingroup
         \let\lst@UM\@empty \xdef\@gtempa{\the\lst@token}%
     \endgroup
     \lst@GetFreeMacro{lstHR@\@gtempa}%
     \global\expandafter\let\lst@freemacro\@empty
     \@tempcntb\@tempcnta \advance\@tempcntb\m@ne
     \edef\lst@alloverstyle##1{%
         \let\noexpand\lst@alloverstyle\noexpand\@empty
         \noexpand\smash{\raise\baselineskip\hbox
             {\noexpand\lst@hyperanchor{lst.\@gtempa\the\@tempcnta}%
                                       {\relax}}}%
         \ifnum\@tempcnta=\z@ ##1\else
             \noexpand\lst@hyperlink{lst.\@gtempa\the\@tempcntb}{##1}%
         \fi}%
    }
    od
\lst@EndAspect
\endinput
%%
%% End of file `lstmisc.sty'.

~~~
###overture.sty

~~~
\usepackage{longtable}
\usepackage{times}
\usepackage{graphics}
\usepackage[pdftex,dvipsnames]{color}
\definecolor{notovered}{rgb}{1,0,0}  %red
% definition of VDM++, JavaCC, JJTree, JTB, ANTLR and SableCC for listings
\usepackage{listings}

% use package for VDM language definition
\usepackage{overturelanguagedef}
% Define Overture listing for The VDM language
\lstdefinestyle{overtureLanguageStyle}{basicstyle=\ttfamily,
			frame=trBL, 
%			numbers=left, 
%			gobble=0, 
			showstringspaces=false, 
%			linewidth=\textwidth, 
			frameround=fttt, 
			aboveskip=5mm,
			belowskip=5mm,
			framexleftmargin=0mm, 
			framexrightmargin=0mm}
% Set escape for inserting coverage macros
\lstset{escapeinside=!!}
% Set the default style for lstlistings
\lstset{style=overtureLanguageStyle}

% Custom macro used to color uncoverage model parts in listings
\newcommand{\notcovered}[1]{\textcolor{notovered}{#1}}

% Environment definition for VDM blocks
%  The listing style is reset to overture and the language is set to the active one in the project where the model has been generated from.
\lstnewenvironment{vdm_al}{\lstset{style=overtureLanguageStyle}\lstset{language=OVERTURE_LANGUAGE}}
{}

% Environment definition for test coverage use by VDM Tools
\lstnewenvironment{rtinfo}{}
{}




~~~
###savdm.bib

~~~
%G VDM CONFIRM
@BOOK{Bjorner&82,
  KEY           = "Bj\o{}rner\&82",
  AUTHOR        = "Dines Bj\o{}rner and Cliff B.\ Jones",
  TITLE         = "Formal Specification \& Software Development",
  PUBLISHER     = "Prentice-Hall International",
  YEAR          = "1982",
  SERIES        = "Series in Computer Science",
  ANNOTE        = "",
  COMMENT       = "NA. (PGL)"}

%G VDM CONFIRM FORTAIN ER
@TECHREPORT{Dick&91,
  KEY           = "Dick\&91",
  AUTHOR        = "Jeremy Dick and Jerome Loubersac",
  TITLE         = "A Visual Approach to VDM: Entity-Structure Diagrams",
  INSTITUTION   = "Bull",
  ADDRESS       = "68, Route de Versailles, 78430 Louveciennes (France)",
  YEAR          = "1991",
  MONTH         = "January",
  NUMBER        = "DE/DRPA/91001",
  SIZE          = "57",
  ANNOTE        = "",
  COMMENT       = "I have a copy of it and I have read it 1/5-91 (PGL)."}

%G FORCES SOFTENG Z CONFIRM
@ARTICLE{Hall90b,
  KEY           = "Hall90",
  AUTHOR        = "Anthony Hall",
  TITLE         = "Seven Myths of Formal Methods",
  JOURNAL       = "IEEE Software",
  YEAR          = "1990",
  MONTH         = "September",
  VOLUME        = "7",
  NUMBER        = "5",
  PAGES         = "11--19",
  SIZE          = "9",
  ANNOTE        = "",
  COMMENT       = "BIB. OBL. I have read it 12/4-91 (PGL)."}

%G BSIVDMINT THEORY
@ARTICLE{Hayes&89,
   KEY      = "Hayes\&89",
   AUTHOR   = "I.J. Hayes, C.B. Jones",
   TITLE    = "{Specifications are not (necessarily) executable}",
   JOURNAL  = "Software Engineering Journal",
   PAGES    = "330-338",
   VOLUME   = "",
   MONTH    = "November",
   YEAR     = "1989",
   COMMENT  = "I have a copy of it and I have read it (PGL)."}

%G VDM IPTESINT
@BOOK{Jones90,
  KEY           = "Jones90",
  AUTHOR        = "Cliff B.\ Jones",
  TITLE         = "Systematic Software Development Using VDM (second edition)",  
  PUBLISHER     = "Prentice Hall",
  ADDRESS       = "Englewood Cliffs, New Jersey", 
  YEAR          = "1990",
  SIZE          = "333", 
  ANNOTE        = "This book deals with the Vienna Development Method.
                   The approach explains formal (functional)
                   specifications and verified design with an emphasis
                   on the study of proofs in the development process.",
  COMMENT       = "I have a copy of it (PGL)."}

%G IPTES
@INPROCEEDINGS{Larsen&91,
  KEY           = "Larsen\&91",
  AUTHOR        = "Peter Gorm Larsen and Poul B\o{}gh Lassen",
  TITLE         = "An Executable Subset of Meta-IV with Loose Specification",
  BOOKTITLE     = "Accepted at the VDM'91 Symposium",
  ORGANIZATION  = "VDM Europe",
  PUBLISHER     = "Springer-Verlag",
  YEAR          = "1991",
  MONTH         = "March",
  SIZE          = "15",
  ANNOTE        = "",
  COMMENT       = "BIB. PGL"}

%G CONFIRM VDM SA IPTESINT
@TECHREPORT{Larsen&91c,
  KEY           = "Larsen\&91",
  AUTHOR        = "Peter Gorm Larsen, Nico Plat, and Hans Toetenel",
  TITLE         = "A Complete Formal Semantics of Data Flow Diagrams",
  INSTITUTION   = "Delft University of Technology",
  YEAR          = "1991",
  MONTH         = "July",
  SIZE          = "36",
  ANNOTE        = "",
  COMMENT       = "BIB. I have both a hard and a softcopy of this
                   (PGL)."}

%G VDM LIFE CONFIRM
@TECHREPORT{Plat&91b,
  KEY           = "Plat\&91",
  AUTHOR        = "Nico Plat, Jan van Katwijk, and Hans Toetenel",
  TITLE         = "Applications and Benefits of Formal Methods in
                   Software Development",
  INSTITUTION   = "Delft University of Technology",
  ADDRESS       = "Faculty of Technical Mathematics and Informatics",
  YEAR          = "1991",
  MONTH         = "April",
  NUMBER        = "91-33",
  SIZE          = "32",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it 22/4-91 (PGL)."}

%G VDM SA OBJECT CONFIRM
@INPROCEEDINGS{Toetenel&90,
  KEY          = "Toetenel\&90",
  AUTHOR       = "Hans Toetenel, Jan van Katwijk, Nico Plat",
  TITLE        = "Structured Analysis -- Formal Design, using Stream 
                  \& Object oriented Formal Specification",
  BOOKTITLE    = "Proc. of the ACM SIGSOFT International Workshop 
                  on Formal Methods in Software Development. 
                  Software Engineering Notes {\rm 15(4): 118-127}",
  PUBLISHER    = "ACM Press",
  YEAR         = "1990",
  ADDRESS      = "Napa, California, USA",
  MONTH        = "9-11 May",
  SIZE          = "10",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it 18/4-91 (PGL)."}

%G IPTESINT SART
@BOOK{Ward85,
  KEY           = "Ward\&85",
  AUTHOR        = "P.T.\ Ward and S.J.\ Mellor", 
  TITLE         = "Structured Development for Real-Time Systems",
  PUBLISHER     = "Yourdon Press",
  ADDRESS       = "New York",
  YEAR          = "1985-1986",
  VOLUME        = "1-3", 
  ANNOTE        = "",
  COMMENT       = "I have read selected parts of it but I don't have
                   a copy (PGL)."}

%G ADA SA SD
@BOOK{Watt&87,
  KEY           = "Watt\&87",
  AUTHOR        = "David A.\ Watt, Brian A.\ Wichmann and William Findlay",
  TITLE         = "ADA Language and Methodology",
  PUBLISHER     = "Prentice-Hall International",
  YEAR          = "1987",
  SIZE          = "518",
  ANNOTE        = "",
  COMMENT       = "NA. I have read most of it during my stay in Delft
                   (PGL)."}

%G FORTAIN Z VDM LARCH CSP CONFIRM
@ARTICLE{Wing90b,
  KEY           = "Wing90",
  AUTHOR        = "Jeannette M.\ Wing",
  TITLE         = "A Specifier's Introduction to Formal Methods",
  JOURNAL       = "IEEE Software",
  YEAR          = "1990",
  MONTH         = "September",
  VOLUME        = "23",
  NUMBER        = "9",
  PAGES         = "8--24",
  SIZE          = "15",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it 29/4-91 (PGL)."}

%G DFD CONFIRM IPTESINT
@ARTICLE{Adler88,
  KEY           = "Adler88",
  AUTHOR        = "Mike Adler",
  TITLE         = "An Algebra for Data Flow Diagram Process
                   Decomposition",
  JOURNAL       = "IEEE Transactions on Software Engeneering",
  YEAR          = "1988",
  MONTH         = "February",
  VOLUME        = "14",
  NUMBER        = "2",
  PAGES         = "169--183",
  SIZE          = "15",
  ANNOTE        = "This article makes an attempt of formalizing the 
                   data flow diagram decomposition by means directed
                   acyclic graphs and input/output connective
                   matrices.",
  COMMENT       = "BIB. I have read it 19/4-91 (PGL)."}

%G CONFIRM DFD OBJECT
@INPROCEEDINGS{Alabiso88,
  KEY           = "Alabiso88",
  AUTHOR        = "Bruno Alabiso",
  TITLE         = "Transformation of Data Flow Analysis Models to
                   Object Oriented Design",
  BOOKTITLE     = "OOPSLA'88 Proceedings",
  PUBLISHER     = "ACM",
  YEAR          = "1988",
  MONTH         = "November",
  PAGES         = "335--353",
  SIZE          = "19",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it 18/6-91 and it introduces the
                   notion of I/O uncohesiveness which is useful for
                   the CONFIRM project (PGL)."}

%G VDM CONFIRM
@BOOK{Bjorner&82,
  KEY           = "Bj\o{}rner\&82",
  AUTHOR        = "Dines Bj\o{}rner and Cliff B.\ Jones",
  TITLE         = "Formal Specification \& Software Development",
  PUBLISHER     = "Prentice-Hall International",
  YEAR          = "1982",
  SERIES        = "Series in Computer Science",
  ANNOTE        = "",
  COMMENT       = "NA. (PGL)"}

%G PETRI DFD SA IPTESINT CONFIRM
@TECHREPORT{Bruza&89,
  KEY           = "Bruza\&89",
  AUTHOR        = "P.D.\ Bruza and Th.P.\ van der Weide",
  TITLE         = "The Semantics of Data Flow Diagrams",
  INSTITUTION   = "University of Nijmegen",
  ADDRESS       = "Department of Informatics",
  YEAR          = "1989",
  MONTH         = "October",
  NUMBER        = "89-16",
  SIZE          = "13",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it 15/4/91 (PGL)"}

%G BSIVDM STD CEDERINT IPTESINT CONFIRM
@TECHREPORT{BSIVDM91,
  KEY           = "BSIVDM91",
  TITLE         = "VDM Specification Language -- Proto-Standard",
  INSTITUTION   = "British Standards Institution",
  YEAR          = "1991",
  MONTH         = "March",
  SIZE          = "269",
  NOTE          = "BSI IST/5/50",
  ANNOTE        = "",
  COMMENT       = "(PGL)."}

%G METPROJ SA SD CONFIRM IPTESINT
@BOOK{DeMarco78,
  KEY           = "DeMarco78",
  AUTHOR        = "Tom DeMarco",
  TITLE         = "Structured Analysis and System Specification",
  PUBLISHER     = "Yourdon Press",
  YEAR          = "1978",
  ANNOTE        = "",
  COMMENT       = "En udgave fra 1979 er bestilt 8/12.
                   L\aa{}nt fra NTUB (OBL). 
                   I have read parts of it 5/5-91 (PGL)."}

%G CONFIRM DFD
@INPROCEEDINGS{Eisenback&89,
  KEY           = "Eisenback\&89",
  AUTHOR        = "Susan Eisenback, Lee McLoughlin, and Chris Sadler",
  TITLE         = "Data-Flow Design as a Visual Programming Language",
  BOOKTITLE     = "Fifth International Workshop on Software 
                   Specification and Design",
  ORGANIZATION  = "IEEE Computer Society",
  PUBLISHER     = "IEEE",
  YEAR          = "1989",
  MONTH         = "May",
  PAGES         = "281--283",
  SIZE          = "3",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it 17/6-91 (PGL)."}

%G SA VDM CONFIRM
@ARTICLE{Fraser&91,
  KEY           = "Fraser\&91",
  AUTHOR        = "Martin D.\ Fraser, Kuldeep, and Vijay K.\ Vaishnavi",
  TITLE         = "Informal and Formal Requirements Specification
                   Languages: Bridging the Gap",
  JOURNAL       = "IEEE Transactions on Software Engineering",
  YEAR          = "1991",
  MONTH         = "May",
  VOLUME        = "17",
  NUMBER        = "5",
  PAGES         = "454--466",
  SIZE          = "13",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it (PGL)."}

%G METPROJ SA CONFIRM
@BOOK{Gane77,
  KEY           = "Gane\&77",
  AUTHOR        = "Chris Gane and Trish Sarson",
  TITLE         = "Structured Systems Analysis: Tools \& Techniques",
  PUBLISHER     = "Prentice-Hall",
  ADDRESS       = "Englewood Cliff, New Jersey 07632",
  YEAR          = "1977",
  ANNOTE        = "",
  COMMENT       = "NA. I have read parts of it (PGL)."}

%G VDM IPTESINT
@BOOK{Jones90,
  KEY           = "Jones90",
  AUTHOR        = "Cliff B.\ Jones",
  TITLE         = "Systematic Software Development Using VDM (second edition)",  
  PUBLISHER     = "Prentice Hall",
  ADDRESS       = "Englewood Cliffs, New Jersey", 
  YEAR          = "1990",
  SIZE          = "333", 
  ANNOTE        = "This book deals with the Vienna Development Method.
                   The approach explains formal (functional)
                   specifications and verified design with an emphasis
                   on the study of proofs in the development process.",
  COMMENT       = "I have a copy of it (PGL)."}

%G CONFIRM VDM SA IPTESINT
@INPROCEEDINGS{Larsen&91b,
  KEY           = "Larsen\&91",
  AUTHOR        = "Peter Gorm Larsen, Jan van Katwijk, Nico Plat,
                   Kees Pronk, and Hans Toetenel",
  TITLE         = "Towards an Integrated Combination of SA and VDM",
  BOOKTITLE     = "Structured Analysis and Formal Methods",
  YEAR          = "1991",
  MONTH         = "June",
  SIZE          = "9",
  ANNOTE        = "",
  COMMENT       = "BIB. I have both a hardcopy and a softcopy of
                   this article (PGL)."}

%G CONFIRM VDM SA IPTESINT
@TECHREPORT{Larsen&91c,
  KEY           = "Larsen\&91",
  AUTHOR        = "Peter Gorm Larsen, Nico Plat, and Hans Toetenel",
  TITLE         = "A Complete Formal Semantics of Data Flow Diagrams",
  INSTITUTION   = "Delft University of Technology",
  YEAR          = "1991",
  MONTH         = "July",
  SIZE          = "36",
  ANNOTE        = "",
  COMMENT       = "BIB. I have both a hard and a softcopy of this
                   (PGL)."}

%G CONFIRM VDM SA IPTESINT
@ARTICLE{Larsen&91d,
  KEY           = "Larsen\&91",
  AUTHOR        = "Peter Gorm Larsen, Nico Plat, and Hans Toetenel",
  TITLE         = "A Formal Semantics of Data Flow Diagrams",
  JOURNAL       = "Submitted to Formal Aspects of Computing",
  YEAR          = "1991",
  MONTH         = "July",
  SIZE          = "20",
  NOTE          = "",
  ANNOTE        = "",
  COMMENT       = "BIB. I have both a hard and a softcopy of it (PGL)."}

%G CONFIRM VDM SA IPTESINT
@INPROCEEDINGS{Larsen&91e,
  KEY           = "Larsen\&91",
  AUTHOR        = "Peter Gorm Larsen, Jan van Katwijk, Nico Plat,
                   Kees Pronk, and Hans Toetenel",
  TITLE         = "SVDM: An Integrated Combination of SA and VDM",
  BOOKTITLE     = "Methods Integration Conference",
  YEAR          = "1991",
  MONTH         = "September",
  SIZE          = "20",
  ANNOTE        = "",
  COMMENT       = "BIB. I have both a hardcopy and a softcopy of
                   this article (PGL)."}

%G SA VDM DFD IPTESINT CONFIRM
@INPROCEEDINGS{Plat&91a,
  KEY           = "Plat\&91",
  AUTHOR        = "Nico Plat, Jan van Katwijk, and Kees Pronk",
  TITLE         = "A Case for Structured Analysis/Formal Design",
  BOOKTITLE     = "VDM '91 -- Formal Software Development Methods",
  ORGANIZATION  = "VDM Europe",
  PUBLISHER     = "Springer-Verlag",
  YEAR          = "1991",
  MONTH         = "October",
  SIZE          = "26",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it twice 9-14/4-91 (PGL)"}

%G CONFIRM DFD Z
@INPROCEEDINGS{Randell91,
  KEY           = "Randell91",
  AUTHOR        = "Gill Randell",
  TITLE         = "The Integration of Structured and Formal Methods",
  BOOKTITLE     = "Workshop Structured Analysis and Formal Methods",
  ADDRESS       = "York",
  YEAR          = "1991",
  MONTH         = "June",
  PAGES         = "35--36",
  SIZE          = "2",
  ANNOTE        = "",
  COMMENT       = "BIB. (PGL)."}

%G CONFIRM Z DFD SA
@TECHREPORT{Semmens&91,
  KEY           = "Semmens\&91",
  AUTHOR        = "Lesley Semmens and Pat Allen",
  TITLE         = "Using Yourdon and Z: an Approach to Formal Specification",
  INSTITUTION   = "Faculty of Information and Engineering Systems",
  ADDRESS       = "Leeds Polytechnic",
  YEAR          = "1991",
  MONTH         = "January",
  SIZE          = "26",
  NOTE          = "Handed out at a workshop called ``Structured Analysis
                   and Formal Methods'' June 1991 in York",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it 9/6-91 (PGL)."}

%G SOFTENG CONFIRM
@BOOK{Sommerville82,
  KEY           = "Sommerville82",
  AUTHOR        = "I.\ Sommerville",
  TITLE         = "Software Engineering",
  PUBLISHER     = "Addison-Wesley",
  ADDRESS       = "London",
  YEAR          = "1982",
  ANNOTE        = "",
  COMMENT       = "We don't have it (PGL)."}

%G VDM SA OBJECT CONFIRM
@INPROCEEDINGS{Toetenel&90,
  KEY          = "Toetenel\&90",
  AUTHOR       = "Hans Toetenel, Jan van Katwijk, Nico Plat",
  TITLE        = "Structured Analysis -- Formal Design, using Stream 
                  \& Object oriented Formal Specification",
  BOOKTITLE    = "Proc. of the ACM SIGSOFT International Workshop 
                  on Formal Methods in Software Development. 
                  Software Engineering Notes {\rm 15(4): 118-127}",
  PUBLISHER    = "ACM Press",
  YEAR         = "1990",
  ADDRESS      = "Napa, California, USA",
  MONTH        = "9-11 May",
  SIZE          = "10",
  ANNOTE        = "",
  COMMENT       = "BIB. I have read it 18/4-91 (PGL)."}

%G METPROJ SA CONFIRM
@BOOK{Yourdon75,
  KEY           = "Yourdon\&75",
  AUTHOR        = "E.\ Yourdon and L.L.\ Constantine",
  TITLE         = "Structured Design",
  PUBLISHER     = "Yourdon Press",
  YEAR          = "1975",
  ANNOTE        = "",
  COMMENT       = "En udgave fra 1978 med titlen: 'Structured Design.
                   Fundamentals of a discipline of computer programs and
                   systems design' er bestilt 5/12. 2/2/0.
                   Er modtaget.
                   Der findes ovenst\aa{}ende TO! b\o{}ger. 
                   \AA{}rstallene er muligvis
                   forkerte. (OBL)
                   Yes I think that it should be 1975 (PGL)."}

%G STATSEM
@TECHREPORT{Larsen&93b,
  KEY           = "Larsen\&93",
  AUTHOR        = "Peter Gorm Larsen, Poul B\o{}gh Lassen and Marcel Verhoef",
  TITLE         = "Specification of the VDM-SL Static Semantics Checker",
  INSTITUTION   = "The Institute of Applied Computer Science",
  ADDRESS       = "Forskerparken 10, 5250 Odense SV, Denmark",
  YEAR          = "1993",
  MONTH         = "November",
  SIZE          = "189",
  ANNOTE        = "",
  COMMENT       = "LIB PGL"}

%G VDM TOOL IFADPUB
@INPROCEEDINGS{Lassen93,
  KEY           = "Lassen93",
  AUTHOR        = "Poul B\o{}gh Lassen",
  EDITOR        = "J.C.P.\ Woodcock and P.G.\ Larsen",
  TITLE         = "IFAD VDM-SL Toolbox",
  BOOKTITLE     = "FME'93: Industrial-Strength Formal Methods",
  PUBLISHER     = "Springer-Verlag",
  ADDRESS       = "Berlin Heidelberg",
  YEAR          = "1993",
  MONTH         = "April",
  PAGES         = "681",
  SIZE          = "1",
  ANNOTE        = "",
  COMMENT       = "PGL"}

%G VDM LANG
@BOOK{Bjorner&82b,
  KEY           = "Bj{\o}rner\&82",
  EDITOR        = "D. Bj{\o}rner and C.B. Jones",
  TITLE         = "{Formal Specification and Software Development}",
  PUBLISHER     = "Prentice-Hall International",
  YEAR          = "1982",
  ANNOTE        = "A monograph, intended for the practising, 
                   professional software engineer and professional programmer. 
                   Contains, as separate chapters: 1: \cite{Lucas82},
                   2: \cite{Jones82a}, 3: \cite{Stoy82}, 4: \cite{Jones82b},
                   5: \cite{Jones82c}, 6: \cite{Henhapl&82}, 7: \cite{Andrews&82},
                   8: \cite{Jones82d}, 9: \cite{Bjorner82c}, 10: \cite{Fielding&82},
                   11: \cite{Bjorner82d}, 12: \cite{Bjorner&82e},
                   13: \cite{Bjorner82f}.",
  COMMENT       = ""}

%G VDM IPTESINT STATSEM KDBINT REFIN TUTOR
@BOOK{Jones90a,
  KEY           = "Jones90",
  AUTHOR        = "Cliff B.\ Jones",
  TITLE         = "{Systematic Software Development Using VDM}",  
  PUBLISHER     = "Prentice-Hall International",
  ADDRESS       = "Englewood Cliffs, New Jersey", 
  YEAR          = "1990",
  SIZE          = "333",
  EDITION       = "Second",
  NOTE          = "ISBN 0-13-880733-7", 
  ANNOTE        = "This book deals with the Vienna Development Method.
                   The approach explains formal (functional)
                   specifications and verified design with an emphasis
                   on the study of proofs in the development process.",
  COMMENT       = "I have a copy of it (PGL)."}

%G VDM IPTESINT KDBINT TUTOR
@BOOK{Andrews&91,
  KEY           = "Andrews\&91",
  AUTHOR        = "Derek Andrews and Darrel Ince",
  TITLE         = "{Practical Formal Methods with VDM}",
  PUBLISHER     = "McGraw Hill",
  YEAR          = "1991",
  MONTH         = "September",
  SIZE          = "450",
  NOTE          = "ISBN 0-07-707214-6",
  ANNOTE        = "This book is a good introductory text book about
                   using VDM as a development method.",
  COMMENT       = "LIB. I have a copy of it (PGL)."}

%G BSIVDM VDM STD CEDERINT IPTESINT CONFIRM KDBINT
@TECHREPORT{BSIVDM92b,
  KEY           = "BSIVDM92",
  TITLE         = "{VDM Specification Language -- Proto-Standard}",
  INSTITUTION   = "British Standards Institution",
  YEAR          = "1992",
  MONTH         = "December",
  SIZE          = "402",
  NOTE          = "BSI IST/5/19 N-246B",
  ANNOTE        = "",
  COMMENT       = "(PGL)."}

%G BSIVDM STD TUTOR VDM IPTESINT STATSEM KDBINT
@BOOK{Dawes91,
  KEY           = "Dawes91",
  AUTHOR        = "John Dawes",
  TITLE         = "{The VDM-SL Reference Guide}",
  PUBLISHER     = "Pitman",
  YEAR          = "1991",
  SIZE          = "217",
  NOTE          = "ISBN 0-273-03151-1",
  ANNOTE        = "This is the best reference manual for the complete
                   VDM-SL which is being standardised. It refers to a
		   draft version of the standard which is quite close
		   to the current version of the standard.",
  COMMENT       = "I have a copy and I have read it 10/9-91 (PGL)."}

%G SA
@MANUAL{Longworth&86,
  KEY          = "Longworth\&86",
  AUTHOR       = "G. Longworth and D. Nicholls",
  TITLE        = "{SSADM Manual}",
  ORGANIZATION = "NCC",
  YEAR         = "1986", 
  MONTH        = "December",
  COMMENT      = "PGL not available"}

%G BSIVDM VDM CEDERINT IFADPUB FOUND
@INPROCEEDINGS{IFIP,
  KEY           = "Larsen\&89",
  AUTHOR        = "Peter Gorm Larsen, Michael Meincke Arentoft,
                   Brian Monahan and Stephen Bear",
  EDITOR        = "Ritter", 
  TITLE         = "{Towards a Formal Semantics of The BSI/VDM
                   Specification Language}",
  BOOKTITLE     = "{Information Processing 89}",
  ORGANIZATION  = "IFIP", 
  PUBLISHER     = "North-Holland", 
  YEAR          = "1989",
  MONTH         = "August", 
  PAGES         = "95--100", 
  SIZE          = "6", 
  ANNOTE        = "This is an overview article describing the
                   work towards a formal semantics of the BSI/VDM SL.",
  COMMENT       = "I have the whole book (PGL). This is my first
                   publication."}

%G BSIVDM VDM STRUCT IPTESINT KDBINT VDM88
@INPROCEEDINGS{Bear88,
  KEY           = "Bear88",
  AUTHOR        = "Stephen Bear",
  TITLE         = "{Structuring for the VDM Specification Language.}",
  BOOKTITLE     = "{VDM '88 VDM -- The Way Ahead}",
  ORGANIZATION  = "VDM-Europe",
  PUBLISHER     = "Springer-Verlag",
  YEAR          = "1988",
  MONTH         = "September",
  PAGES         = "2--25",
  SIZE          = "24",
  ANNOTE        = "A proposal for a scheme of structuring for the BSI-VDM
                   Specification Language is presented. The proposal has
                   the advantage that the import relation may be cyclic
                   and it separates the semantics of
                   the structuring concepts from the semantics of the core
                   language.",
  COMMENT       = "I have a hardcopy and I have a copy of the whole 
                   proceedings (PGL)."}

~~~
###termref.sty

~~~
\typeout{Terminology and References Environments. DiProGS 1987}

%************************************************************************
%									*
%	Bibliography and Terminology supporting commands		*
%									*
%************************************************************************

\newcommand{\bthisbibliography}[1]
  {\section{References}
   \begin {list} {}
     {\settowidth {\labelwidth} {[#1]XX}
      \setlength {\leftmargin} {\labelwidth}
      \addtolength{\leftmargin} {\labelsep}
      \setlength {\parsep} {1ex}
      \setlength {\itemsep} {2ex}
     }
  }
\newcommand{\ethisbibliography}{\end{list}}

\newcommand{\bthisterminology}[1]
  {\section{Terminology}
   \begin {list} {}
     {\settowidth {\labelwidth} {[#1]XX}
      \setlength {\leftmargin} {\labelwidth}
      \addtolength{\leftmargin} {\labelsep}
      \setlength {\itemsep} {2ex}
     }
  }
\newcommand{\ethisterminology}{\end{list}}


\newcommand{\writeterm}[1]
%  {\raisebox{-.6ex}{{\footnotesize$\tau$}}{\bf #1}}
  {\raisebox{.7ex}{{\footnotesize$\tau$}}%
   \makebox[-.2ex]{}%
   {\it #1}}

\newcommand{\termitem}[4]
  {\item[{\writeterm{#1}\hfill}]\hfill\\}

\newcommand{\termitemabbr}[4]
  {\item[{\writeterm{#1}\ \ \ (\writeterm{#2})\hfill}]\hfill\\}

\newcommand{\refitem}[2]
  {\bibitem[#1]{#2}}

%************************************************************************
%									*
%	Commands to refer to the terminology and bibliography. 		*
%									*
%************************************************************************

%\newcommand{\cite}[1]  	... defined in LaTeX

%\newcommand{\nocite}[1]   	... defined in LaTeX

% Commented out by PGL 9/4/90
% 
% \newcommand{\term}[2]
%   {\nocite{#1}\writeterm{#2}}
% 
% \newcommand{\noterm}[1]
%   {\nocite{#1}}


~~~
