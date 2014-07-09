---
layout: default
title: The Vienna Development Method
---

## The Vienna Development Method

The Vienna Development Method (VDM) is one of the longest established model-oriented formal
methods for the development of computer-based systems and software. It consists of a group of
mathematically well-founded languages and tools for expressing and analyzing system models during
early design stages, before expensive implementation commitments are made. The construction and
analysis of the model help to identify areas of incompleteness or ambiguity in informal system
specifications, and provide some level of confidence that a valid implementation will have key properties,
especially those of safety or security. VDM has a strong record of industrial application, in many cases by
practitioners who are not specialists in the underlying formalism or logic. Experience with the method
suggests that the effort expended on formal modeling and analysis can be recovered in reduced rework
costs arising from design errors.

### Language

VDM models are expressed in a specification language (VDM-SL) that supports the description of data
and functionality. Data are defined by means of types built using constructors that define structured data
and collections such as sets, sequences and mappings from basic values such as Booleans and numbers.
These types are very abstract, allowing the user to add any relevant constraints as data type invariants.
Functionality is defined in terms of operations over these data types. Operations can be defined implicitly
by preconditions and postconditions that characterize their behavior, or explicitly by means of specific
algorithms. An extension of VDM-SL, called VDM++, supports object-oriented structuring of models and
permits direct modeling of concurrency.

Since the modeling language has a formal mathematical semantics, a wide range of analyses can be
performed on models, both to check internal consistency and to confirm that models have emergent
properties. Analyses may be performed by inspection, static analysis, testing or mathematical proof. To
assist in this process, there is extensive tool support for building models in collaboration with other
modeling tools, to execute and test models, to carry out different forms of static analysis and to generate
executable code in a high-level programming language.

### History
The origins of VDM lie in work done in the IBM Laboratory at Vienna in the 1970s, where a formal
specification language (Meta-IV) was developed in order to define the programming language PL/I.
Meta-IV was subsequently used to define minimal BASIC, parts of FORTRAN and APL, ALGOL 60,
Ada and Pascal. The first description of this form of VDM, based on Meta-IV, was published in 1978 [1].
Dines Bjørner and colleagues at the Dansk Datamatik Center developed the language definition
capabilities of VDM which delivered the first European Ada compiler to achieve validation. Their
modeling style, emphasizing explicit definition of functions, came to be known as the Danish School of
VDM. Cliff Jones and colleagues, working at IBM Hursley, Oxford and Manchester Universities
subsequently developed the parts of VDM that were not specifically aimed at programming language
definition into a more general modeling framework [2]; their style, which emphasizes abstract modeling,
and validation by proof, became known as the English School of VDM. An account of the scientific
decisions embodied in VDM can be found in Jones’ summary [3].

The standardization of VDM-SL by the British Standards Institution and the International Organization
for Standardization (ISO) sought to define a language that could accommodate the Danish and English
Schools. It also provided an impetus for the development of tools to support the analysis of models
written in the newly standardized language. At the same time, there was discussion of the possibility of a
“lightweight” application of formal modeling technology, stressing the carefully targeted application of
formal modeling, with strong industry-standard tool support. In spite of the ‘Method’ in its name, the use
of VDM does not prescribe a particular development process or methodology. Instead, the components of
the method may be used as developers see fit. This pragmatic approach [4] led to substantial advances in
the application of VDM and later extended to the VDM++ language [5].

## SYSTEM MODELING IN VDM
The use of VDM involves the development and analysis of models to help understand systems and predict
their properties. Good models exhibit abstraction and rigor. Abstraction is the suppression of detail that is
not relevant to the purpose for which a model is constructed. The decision about what to include and what
to omit from an abstract model requires good engineering judgment. A guiding principle in VDM is that
only elements relevant to the model’s purpose should be included; it follows that the model’s purpose
should be clearly understood and described. Rigor is the capacity to perform a mathematical analysis of
the model’s properties in order to gain confidence that an accurate implementation of the modeled system
will have certain key characteristics.
In computing systems development, modeling and design notations with a strong mathematical basis are
termed formal. VDM is based on a formal specification language VDM-SL, the semantics of which are
given mathematically in an ISO Standard [6]. VDM models, although often expressed in an executable
subset, are developed primarily for analysis rather than serving as final implementations.

### Model Structure
In VDM, models consist of representations of the data on which a system operates and the functionality
that is to be performed. Data includes the externally visible input/output and internal state data.
Functionality includes the operations that may be invoked at the system interface as well as auxiliary
functions that exist purely to assist in the definition of the operations. In the ISO Standard [6] there is an
informative appendix providing a modular framework for flat VDM-SL models. This modular framework
includes traditional import and export features as well as parameterized modules and instantiations of
these.

The VDM++ language extends flat VDM-SL with facilities for specification of object-oriented systems,
and structures models into class definitions, each of which has similar elements to a single VDM-SL
specification, with the state variables taking the role of instance variables and the operations playing the
part of methods. The remainder of this section will restrict consideration to VDM-SL, with VDM++
considered at a later stage.

### Modeling data
Data models in VDM are founded on basic abstract data types together with a set of type constructors. A
full account of VDM-SL data types and type constructors is provided in current texts [5].
Basic types include numbers (natural, integer, rational and real) and characters. Note that, in accordance
with VDM’s abstraction principle, there are no predetermined maximum representable numbers or real
number precisions. If a user wishes to specify these limits because they are relevant to the problem being
modeled, it is possible to do so explicitly by means of invariants. Invariants are logical expressions
(predicates) that represent conditions to be respected by all elements of the data type to which they are
attached.