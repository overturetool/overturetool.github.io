---
layout: default
title: The 5th Overture Workshop
date: 2008-11-08
location: University of Minho, Portugal
---

# {{ page.title }}

Date, location and theme
------------------------

8th and 9th of November 2008, Braga, Portugal

This workshop was organised at the University of Minho in Braga,
Portugal. The overall theme of this workshop was to exercise different
aspects of developing software for the Overture open source platform on
top of Eclipse. The aspects that will be covered included:

-   Kernel functionality developed on top of the abstract syntax using
    VDM++ and with code generation to java
-   User interface functionality focusing on how to develop Eclipse
    plug-ins
-   Testing using VDMUnit and JUnit of Overture components.

Sponsors
--------

The workshop is sponsored by [NOKIA](http://research.nokia.com/), Taro
Kurita privately, Shin Sahara privately and Marcel Verhoef privately.

![](Nokia-logotype_100px.gif "Nokia-logotype_100px.gif")

Agenda
------

**8th of November**

-   9:00 - 9:10 Welcome to the 5th Overture workshop by Peter Gorm
    Larsen
-   9:10 - 10:00 Overall structure of the Overture tool development,
    [SourceForge](5/Overture Sourceforge "wikilink"), SVN, Maven and
    VDMTools Java code generation by Marcel Verhoef
-   10:00 - 11:00 Exercise: Structure the simple DoSort? example
    according to these priciples and generate and compile Java code for
    it
-   11:00 - 11:15 Coffee break
-   11:15 - 11:40 Testing in Overture: VDMUnit and JUnit by Marcel
    Verhoef
-   11:40 - 12:10 Revisit exercise and add testing using these
    principles
-   12:10 - 13:00 Introduction of the Overture kernel (scanner, parser,
    ast file and ASTGEN) by Marcel Verhoef
-   13:00 - 14:00 Lunch
-   14:00 - 15:00 Exercise: Add "measure" for recursive functions to all
    components ([Measure Notes](5/Measure exercise.pdf "wikilink"))
-   15:00 - 15:20 Presentation of the existing proof support component
    by Miguel Ferreira
-   15:20 - 15:40 Presentation of the existing UML mapper component by
    Kenneth Lausdahl
-   15:40 - 16:00 Presentation of the existing JML coupling and test
    automation components by Peter Gorm Larsen
-   16:00 - 16:15 Coffee break
-   16:15 - 19:00 Group work: Each group will restructure the component
    allocated to them according to the Marven principles, add tests and
    check it into the SVN respository at
    [SourceForge](5/Overture Sourceforge "wikilink"). Marcel Verhoef will
    be assisting all teams. In case a group cannot complete this task at
    least a migration plan will be made for the remaining tasks.
-   20:00 Workshop dinner at [Centurium
    Restaurant](http://centurium.bracaraaugusta.com/)

**9th of November**

-   9:00 - 10:00 Introduction to the principles inside Eclipse by
    Christian Thillemann
-   10:00 - 11:00 Explanation about how to create Eclipse plug-ins
    (placement of code, adding buttons and entries to menus and
    update-site)
-   11:00 - 11:15 Coffee break
-   11:15 - 12:15 Exercise: Adding ones own plug-in with an extra button
    and an extra menu item in Eclipse
-   12:15 - 13:00 Introduction to how one can call external code from
    Eclipse exemplified using CORBA for VDMTools and possibly connection
    to VDMJ by Christian Thillemann
-   13:00 - 14:00 Lunch
-   14:00 - 18:00 Group work: Each group will restructure the component
    allocated to them to Eclipse for real and are able to compile, test
    and check in these updates. Christian Thillemann (and Marcel
    Verhoef) will be assiting all teams. In case a group cannot complete
    this task at least a migration plan will be made for the remaining
    tasks.
-   16:00 - 16:15 Coffee break
-   18:00 - 18:30 Workshop closure including discussions on how to move
    forward from here managed by Peter Gorm Larsen

Software Requirements
---------------------

-   Java JDK SE 6 (install the Java Development Kit for J2SE version 6,
    not just the JRE)
-   Eclipse Classic 3.4.1 (http://www.eclipse.org/downloads/), do NOT
    install Eclipse IDE for Java Developers
-   Maven 2.0.9 (http://maven.apache.org/download.html)
-   Maven integration for Eclipse (http://m2eclipse.codehaus.org/)
-   Subversion integration for Eclipse (http://subclipse.tigris.org/)
-   Download and install the latest version of jFlex
-   Download and install ASTGEN and the patched version of byaccj which
    can be found in the Download section on the OvertureParser page.
-   Windows users need to install Cygwin (Unix tools on Win32)
-   Members of the proof component team must also install HOL4 and
    MoscowML
-   And finally, create a user account for yourselves at www.sf.net and
    join the Overturetool project
    (http://sourceforge.net/projects/overture)

Group Composition
-----------------

The participants have been divided up into the following groups: (more
to be added when a complete list of Minho participants are available)

-   Proof component: Miguel Ferreira, Jose Oliveira, Eduardo Brito,
    Samuel Silva, Joey Coleman and Augusto Ribeiro
-   Test automation component: Peter Gorm Larsen, Luis Barbosa, Ana
    Paiva, Nuno Rodrigues and Hugo Pacheco
-   JML and VDM++ combination component: Helder Pereira, Miguel Vilaca,
    Ricardo Romano and Alcino Cunha
-   VDM++ and UML component: Kenneth Lausdahl, Hans Christian Agerlund
    Lintrup, Barbara Vieira, Miguel Marques, José Pascoal Faria and Joao
    Miguel Fernandes
-   TraceViewer? component: Pedro Russo and Marcel Verhoef on the Sunday
-   Interpreter integration in Eclipse: Hugo Macedo, Marco Devesas
    Campos, Daniel Machado and Lasse Lorentzen (this team will consider
    how such a perspective can be made in Eclipse and analyse what needs
    to be changed to VDMTools' interpreter to use that here).

Helpful references
------------------

VDMUnit is described in Chapter 9 of the Validated Designs book, see
www.vdmbook.com JUnit can be found at <http://junit.org> and a good
"junit-by-example" introduction can be found at
<http://junit.sourceforge.net/> For Overture, we currently use version
3.8.1 of JUnit A very good (and free) introductionary book on Maven is
Better Builds With Maven (PDF) The definitive reference on Maven:
<http://oreilly.com/catalog/9780596517335/> For SVN, check the following
books: <http://svnbook.red-bean.com/> (also available printed as
<http://oreilly.com/catalog/9780596510336/>) For developing Eclipse
plug-ins, check out the excellent book <http://qualityeclipse.com/>

Results of the workshop
-----------------------

An initial version of the different subprojects for the Overture tool
have been established. See [subproject status](Subprojects "wikilink").

Accomodation possibilities
--------------------------

Hotels direct booking by participants (please mention Overture Workshop
as the prices below are reduced) SPRU Residence: must be booked by the
University (send an email to lsb@di.uminho.pt specifying dates and type
of accommodation required)

Albergaria Senhora-a-Branca (\*\*\*\*) Largo da Senhora-a-Branca nº 58
4710-443 Braga Tel: (+351) 253 269938; Fax: (+351) 253 269937 WWW:
<http://albergariasrabranca.pt/indiceing.html> email:
AlbergariaSraBranca@oninet.pt Distance to the University: 20 min
(walking) Prices: Single 34.5 € , Double 45 € (breakfast and private
garage included) (Now full -- JoeyColeman - 30 Sep 2008)

Hotel Lamacaes (\*\*\*) Av.D.João II nº75 - Nogueiró 4715 - 313 Braga
Tel: (+351) 253 603 680 / 919 668 256; Fax: (+351) 253 603 689 WWW:
<http://www.hotel-lamacaes.com/> Distance to the University: 5 min
(walking) Prices: Single 33 € , Double 40 € (breakfast included)

SPRU Braga Estacao (University Residence) Largo da Estação do Caminho de
Ferro Maximinos - 4700-023 Braga Tel: (+351) 253 206500; Fax: (+351) 253
687116 WWW: <http://www.spru.pt> (select Braga-Estacao) Distance to the
University: 30 min (walking) or bus Prices: Single 23 € Double 30 € (no
breakfast)

How to get to Braga
-------------------

The nearest airport is Francisco Sá Carneiro airport of Porto
(http://www.ana.pt/portal/page/portal/ANA/AEROPORTO\_PORTO/) From Porto
airport:

Taxi
:   Taking a taxi is the simplest and the fastest way (45 min). The
    distance between the Oporto airport and Braga is about 50km by road.
    The cost of traveling from the airport to the Braga city center
    should be around EUR 50.00.

<!-- -->

Metro+Train
:   The cheapest way: Take the metro to Oporto Railway Station
    "Campanhã". Line E (Violet) goes to "Estadio do Dragão". Exit at
    Campanhã. The metro ticket should cost you around EUR 2.00. Take a
    train from the Campanhã train station to Braga. The train ticket
    should cost you around EUR 2.00. In general the earliest train to
    Braga leaves from Porto-Campanhã station at 6:21; the last train
    leaves at 22:36. Be sure to check since timetables are different on
    weekends.
    [(timetables)](http://www.cp.pt/StaticFiles/Imagens/PDF/Passageiros/horarios/urbanos_porto_2007/linha_braga.pdf)

Pictures
--------

![](Participants5thworkshop.jpg "Participants5thworkshop.jpg")

**Standing Left to Right:**João Miguel Fernandes, Ana Paiva, Augusto
Ribeiro, Bárbara Vieira, Kenneth Lausdahl, Alcino Cunha, José Oliveira,
Peter Gorm Larsen, Christian Thillemann, Lasse Lorentzen, Hans Kristian
Agerlund Lintrup, Luis Barbosa, Nuno Rodrigues, Óscar Ribeiro,

**Front row:** Marcel Verhoef, Miguel Marques, Daniel Machado, José
Vilaça, Hugo Pacheco, Joey Coleman, Miguel Ferreira, Hélder Pereira,
Ricardo Romano (Photo by Marcel Verhoef, 9 November 2008)

Image:5ws1.jpg Image:5ws2.jpg Image:5ws3.jpg Image:5ws4.jpg
Image:5ws5.jpg Image:5ws6.jpg
