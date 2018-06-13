---
layout: default
title: The 16th Overture Workshop
date: 2018-07-14
location: Oxford, UK
---
# THE 16TH OVERTURE WORKSHOP

The 16th Overture Workshop will be held on Saturday 14 July 2018 in association with the [Federated Logic Conference (FLoC) 2018](http://www.floc2018.org/) and the [22nd International Symposium on Formal Methods (FM 2018)](http://www.fmeurope.org/?p=613).

## LOCATION AND REGISTRATION

**Location: Oxford University, United Kingdom**

_Room TBC_ (either the Maths and Blavatnik buildings): <http://www.floc2018.org/venues/>

Please register for the workshop via <http://www.floc2018.org/register/>. Early registration is now closed, but you can still register for £110 / £95 (regular / student) until Monday 25, or £165 / £150 on the day. Accomodation details can be found at <http://www.floc2018.org/accommodation/>.

Preliminary proceedings are available [here](16/floc_overture16_proceedings_collated.pdf).



## PROGRAMME

<ul style="list-style-type: none; padding: 0 and margin: 0">
  <li style="list-style-type:none">
    <p>0830-0900	<strong>Registration</strong></p>
    <p><strong>OPENING SESSION</strong></p>
  </li>
  <li style="list-style-type:none">
    <p><details><summary>0900-1000 <strong>Jean-Christophe Filliâtre</strong>
    <i>Auto-active Verification using Why3's IDE_</i>(shared keynote F-IDE workshop)</summary>
    Why3 is a platform for deductive program verification. It features a
    rich language for specification and programming, called WhyML, and 
    relies on external theorem provers, both automated and interactive, 
    to discharge verification conditions. Why3 comes with a dedicated 
    IDE where users edit source files and build proofs interactively 
    using a blend of logical transformations and calls to external 
    theorem provers.  In this talk, I will illustrate the typical 
    workflow of program verification using Why3's IDE, focusing on the 
    key features of WhyML, auto-active verification, and proof 
    maintenance.
    </details></p>
  </li>
  <li style="list-style-type:none">
    <p>1000-1010 <em>Welcome to the Overture Workshop</em> (Ken Pierce and Marcel Verhoef)</p>
    <p><strong>TOOLS SESSION</strong></p>
  </li>
  <li style="list-style-type:none">
    <p><details><summary>1010-1030 Peter W. V. Tran-Jørgensen, René Nilsson and <strong>Kenneth Lausdahl</strong>
    <em>Enhancing Testing of VDM-SL Models</em></summary>
    We find that testing of VDM-SL models is currently a tedious and
    error-prone task due to lack of tool support for conveniently
    defining tests, executing tests automatically, and validating test
    results. In VDM++, test-driven development is supported by the
    VDMUnit framework, which offers many of the features one would
    expect from a modern testing framework. However, since VDMUnit
    relies on object-orientation and exception handling, this framework
    does not work for testing VDM-SL models. In this paper, we discuss
    the challenges of testing VDM-SL models, and propose a library
    extension of Overture/VDMUnit that improves this situation. We
    demonstrate usage of this library extension, and show how it also
    enables one to reuse tests to validate code-generated VDM-SL models.
    </details></p>    
  </li>
  <li style="list-style-type:none">
    <p>1030-1100 <strong>COFFEE</strong></p>
  </li>
  <li style="list-style-type:none">
    <p><details><summary>1100-1120 <strong>Casper Thule</strong>, Kenneth Lausdahl and Peter Gorm Larsen
    <em>Overture FMU: VDM-RT as FMU Controller</em></summary>
    The Functional Mock-up Interface is a standard for co-simulation, 
    which both defines and describes a set of C interfaces that a 
    simulation unit, a Functional Mock-up Unit (FMU), must adhere to in
    order to participate in such a co-simulation. To avoid the effort of
    implementing the low level details of the C interface when 
    developing an FMU, one can use the Overture tool and the language 
    VDM-RT. VDM-RT is a VDM dialect used for modelling real-time and 
    potentially distributed systems. By using the Overture extension, 
    called Overture FMU, the VDM-RT dialect can be used to develop FMUs.
    This raises the abstraction level of the implementation language and
    avoids implementation details of the FMI-interface thereby 
    supporting rapid prototyping of FMUs. Furthermore, it enables 
    precise time detection of changes in outputs, as every expression 
    and statement in VDM-RT is associated with a ``timing cost''. The 
    Overture FMU has been used in several industrial case studies, and 
    this paper describes how the Overture tool-wrapper FMU engages in a
    co-simulation in terms of architecture, synchronisation and 
    execution. Furthermore, a small example is presented.
    </details>    
    </p> 
  </li>
  <li style="list-style-type:none">
    <p><details><summary>1120-1140 <strong>Tomohiro Oda</strong>, Keijiro Araki and Peter Larsen
    <em>ViennaVM: a Virtual Machine for VDM-SL development</em></summary>
    The executable subset of VDM allows code generators to automatically
    produce program code. A lot of research have been conducted on 
    automated code generators. Virtual machines are common platforms of 
    executing program code. Those virtual machines demand rigorous 
    implementation and in return give portability among different 
    operating systems and CPUs. This paper introduces a virtual machine 
    called ViennaVM which is formally defined in VDM-SL and still under 
    development. The objective of ViennaVM is to serve as a target 
    platform of code generators from VDM specifications.
    </details></p>      
    <p><strong>APPLICATIONS SESSION</strong></p>
  </li>
  <li style="list-style-type:none">
    <p><details><summary>1140-1200 <strong>Georgios Zervakis</strong> and <strong>Ken Pierce</strong>
    <em>Multi-modelling of Cooperative Swarms</em></summary>
    A major challenge in multi-modelling and co-simulation of 
    cyber-physical systems (CPSs) using distributed control, such as 
    swarms of autonomous Unmanned Aerial Vehicles (UAVs), is the need to
    model distributed controller-hardware pairs where communication 
    between controllers using complex types is required. Co-simulation 
    standards such as the Functional Mock-up Interface (FMI) only 
    supports simple scalar types. This makes the protocol easy to adopt 
    for new tools, but is limiting where a richer form of data exchange
    is required, such as distributed controllers. This paper applies 
    previous work on adding an explicit network VDM model, called an 
    ether, to a multi-model by deploying it to a more complex
    multi-model, specifically  swarm of UAVs.
    </details></p>
  </li>
  <li style="list-style-type:none">
    <p><details><summary>1200-1220 Martin Mansfield, Charles Morisset, Carl Gamble, <strong>John Mace</strong>, Ken Pierce and John Fitzgerald 
    <em>Design Space Exploration for Secure Building Control</em></summary>
    By automation of their critical systems, modern buildings are 
    becoming increasingly intelligent, but also increasingly vulnerable 
    to both cyber and physical attacks. We propose that multi-models can
    be used not only to assess the security weaknesses of smart 
    buildings, but also to optimise their control to be resilient to 
    malicious use. The proposed approach makes use of the INTO-CPS 
    toolchain to model both building systems and the behaviour of
    adversaries, and utilises design space exploration to analyse the 
    impact of security on usability. By separation of standard control 
    and security monitoring, the approach is suitable for both the 
    design of new controllers and the improvement of legacy systems. A 
    case study of a fan coil unit demonstrates how a controller can be 
    augmented to be more secure, and how the trade-off between security 
    and usability can be explored to find an optimal design. We propose 
    that the suggested use of multi-models can aid building managers and
    security engineers to build systems which are both secure and user 
    friendly.
    </details></p>
    </li>
  <li style="list-style-type:none">
    <p>1230-1400 <strong>LUNCH</strong></p>
    <p><strong>PERSPECTIVES AND METHODS</strong></p>
  </li>
  <li style="list-style-type:none">
    <p><details><summary>1400-1450 <strong>Leo Freitas</strong>
    <em>VDM at large: analysing the EMV Next Generation Kernel</em> (shared keynote with F-IDE workshop)</summary>
    The EMV consortium protocols facilitate worldwide interoperability 
    of secure electronic payments. In this paper, we describe our 
    experience in using VDM to model EMV 2nd Generation Kernel.
    </details></p>   
  </li>
  <li style="list-style-type:none">
    <p><details><summary>1450-1510 <strong>René Søndergaard Nilsson</strong>, Kenneth Lausdahl, Hugo Daniel Macedo and Peter Gorm Larsen
    <em>Transforming an industrial case study from VDM++ to VDM-SL</em></summary>
    Normally transitions between different VDM dialects go from VDM-SL 
    towards VDM++ or VDM-RT. In this paper we would like to demonstrate 
    that it actually can make sense to move in the opposite direction.
    We present a case study where a requirement change late in the 
    project deemed the need for distribution and concurrency aspects 
    unnecessary. Consequently, the developed VDM-RT model was 
    transformed to VDM++ and later to VDM-SL. The advantage of this 
    transformation is to reduce complexity and prepare the model for a 
    combined commercial and research setting.
    </details></p>       
  </li>
  <li style="list-style-type:none">
    <p><details><summary>1510-1530 <strong>Simon Fraser</strong> 
    <em>Integrating VDM-SL into the Continuous Delivery Pipelines of Cloud-based Software</em></summary>
    The cloud is quickly becoming the principle means by which software 
    is delivered into the hands of users. This has not only changed the 
    shipping mechanism, but the whole process by which software is 
    developed. The application of lean manufacturing principles to 
    software engineering, and the growth of continuous integration and 
    delivery, have contributed to the end-to-end automation of the 
    development lifecycle. Gone are the days of quarterly releases of 
    monolithic systems; the cloud-based, software as a service is formed
    of hundred or even thousands of microservices with new versions 
    available to the end user on a daily basis. If formal methods are to
    be relevant in the world of cloud computing, we must be able to 
    apply the same principles; enabling easy componentization of 
    specifications and the integration of the processes around those 
    specifications into the fully mechanized process. In this paper we 
    present tools that enable VDM-SL specifications to be constructed, 
    tested and documented in the same way as their implementation 
    through the use of a VDM Gradle plugin. By taking advantage of 
    existing binary repository systems we will show that known 
    dependency resolution instruments can be used to facilitate the 
    breakdown of specifications and enable the easy re-use of 
    foundational components. We also suggest that the deployment of 
    those components to central repositories could reduce the learning 
    curve of formal methods and concentrate efforts on the innovative.
    Furthermore, we propose a number of additional tools and 
    integrations that we believe could increase the use of VDM-SL in the
    development of cloud software.
    </details></p>     
  </li>
  <li style="list-style-type:none">
    <p>1530-1600  <strong>COFFEE</strong></p>
    <p><strong>CLOSING SESSION - SRA WORKSHOP</strong></p>
  </li>
  <li style="list-style-type:none">
    <p>1600-1800 <em>Strategic Research Agenda for Overture</em><br/>
    We will organise the final session ahead of time (using the 
    overtture-core and users mailing lists), such that we have 
    sufficient inputs to guide the discussion in the closing session. 
    The intent is to provide structure to the future development of 
    Overture; taking into account key points from the presentations and 
    discussions. The SRA should, from our point of view, address the 
    following points:
    <ol type="1">
      <li>Language and semantics</li>
      <li>Tool support</li>
      <li>Applications</li>
      <li>Community building</li>
      <li>Business offerings</li>      
    </ol>
    </p>
  </li>
</ul>

## Original CALL FOR PAPERS



The  16th Overture Workshop is the latest in a
series of workshops around the Vienna Development Method (VDM), the open-source project
Overture, and related tools and formalisms. VDM is one of the best established formal methods for systems development. A lively community of researchers and practitioners in academia and industry has grown around the modelling languages (VDM-SL, VDM++, VDM-RT, CML) and tools (VDMTools, Overture, Crescendo, Symphony, and the INTO-CPS chain). Together, these provide a platform for work on modelling and analysis technology that includes static and dynamic analysis, test generation, execution support, and model checking. 

Current projects on model-based design for cyber-physical systems (INTO-CPS and the CPSE Labs experiments TEMPO, CPSBuDi and IPP4CPPS) are generating real results. There are also important developments in Japan with the release of VDMTools under an
open source licence. It is thus timely to focus on the future of the methods and toolchain, improvements in capabilities, and potential applications. We also propose to hold a structured discussion on possible commercial futures. 

Previous workshops have been invaluable in encouraging both new and established members of the community in their work, and helping to determine priorities and future directions. Proceedings of former workshops are available at http://www.overturetool.org/.

**Location: Oxford University, United Kingdom**

### Submission

Submission of abstracts and papers is through EasyChair: https://easychair.org/conferences/?conf=overture16.

### Important Dates

* 8 April 2018: Submission of abstracts of papers  
* 15 April 2018: Submission deadline for papers (PDF only, please)
* 15 May 2018: notification to authors
* 25 May 2018: Final version of papers due
* 14 July 2018: Workshop

### Call

The workshop provides a forum for discussing and advancing the state of the art in formal modelling and analysis using VDM and its family of associated formalisms. We strongly
welcome contributions addressing the development of tools for VDM, developments in foundations, and reports on practical experience. Each paper will be peer-reviewed by at least three members of the PC, must use the Springer LNCS format, and should not exceed 15 pages in length. Accepted papers will be available at the workshop on a memory stick and published in a Newcastle University Technical Report. The scope of the workshop includes, but is not restricted to: 

* Reports on applications of VDM technology, especially reports of industrial use.
* Papers describing requirements, designs, implementations and case studies of support
tools for VDM (using Overture or other tools)
* Papers on the foundations and methodology associated with VDM and its extensions,
including the description of real-time and distributed systems.
* Papers combining VDM with other notations and tools.
* Position papers on VDM and its promotion in industry practice.
* Papers on extensions of Overture including Crescendo, INTO-CPS and VDMPad.

### Organisers

* [Ken Pierce](http://www.ncl.ac.uk/computing/people/profile/kennethpierce.html#background), Newcastle University, United Kingdom. 
  Email: <kenneth.pierce@newcastle.ac.uk>
* [Marcel Verhoef](http://www.marcelverhoef.nl/), ESA - European Space Agency, ESTEC, NL. 
  Email: <Marcel.Verhoef@esa.int>

### Program Committee

* K. Araki, Kyushu University, Japan
* V. Bandur, Aarhus University, Denmark
* N. Battle, Fujitsu, UK
* L.D. Couto, UTRC, Ireland
* J. Fitzgerald, Newcastle University, UK
* L. Freitas, Newcastle University, UK
* F. Ishikawa, NII, Japan
* P.W.V. Tran-Jørgensen, Aarhus University, Denmark
* P.G. Larsen, Aarhus University, Denmark 
* P. Masci, Universidade do Minho, Portugal
* T. Oda, Software Research Associates, Inc., Japan
* J.N. Oliveira, Minho University, Portugal
* N. Plat, Thanos, The Netherlands 

