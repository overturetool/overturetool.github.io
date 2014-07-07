---
layout: default
title: Validated Designs for Object-oriented Systems
---

<table>
        <thead>
            <tr>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
               <td><a href="{{ site.url }}/publications/books/vdoos/"> <img src="{{ site.url }}/publications/books/vdoos.jpg" height="140" alt="Validated Designs for Object-oriented Systems"> </a></td>
				<td><a href="{{ site.url }}/publications/books/vdoos/"> <img src="{{ site.url }}/publications/books/vdoos-jp.jpg" height="140" alt="Validated Designs for Object-oriented Systems"> </a></td>
 
            </tr>
        </tbody>
</table>

### Validated Designs for Object-oriented Systems

Here you can find sample models, solutions to exercises, course material

**Exercises and course material not moved yet**

### About the book

Object-oriented design methods are commonplace in computing systems development, but are often dismissed as little more than 'boxes and arrows'. If systems developers are to gain the full advantage from such methods, they should be able to achieve designs that are not merely the subject of heated argument, but can be improved by careful, rigorous and machine-supported analysis. Validated Designs for Object-oriented Systems describes an object-oriented design approach that combines the benefits of abstract modelling with the analytic power of formal methods, to give designs that can be rigorously validated and assured with automated support. UML class models are augmented with consistent, complementary functional views in VDM++, with the engineer free to move between them. This allows developers to choose levels of abstraction and rigour appropriate to each given project. Aimed at software architects, designers and developers as well as computer scientists, no prior knowledge of formal methods is assumed. The elements of functional modelling are introduced using numerous examples and exercises, industrial case studies and experience reports. This book complements "[Modelling Systems]({{site.url}}/publications/books/ms2/)" by John Fitzgerald and Peter Gorm Larsen, now available in its second edition.
 
### Tool support

[SCSK Systems](http://www.csk.com/) has kindly provided a special version of [VDMTools](http://www.vdmbook.com/twiki/bin/view/Main/VdmTools) to support our book. VDMTools Lite is available free of charge and can be downloaded from www.vdmtools.jp/en. Versions are available for Windows 2000/XP, Mac (G4, G5 and x86) and Linux. For academic users, site licenses are available, also free of charge, for the full version of the tool. The full version includes automatic code generation for Java and C++, dynamic link library and CORBA support. Please contact [VDM.SP@csk.com](mailto:VDM.SP@csk.com) for any queries related to licensing.
The alternative to VDMTools is to use the Overture open source solution built on top of the Eclipse platform. A tutorial introducing Overture in a way similar to chapter 3 of the book can be [downloaded]({{site.url}}/files/VDMPPGuideToOverture.pdf). Overture stand-alone executables for Windows, Mac and Linux are also [freely available]({{site.url}}/download/).

### Reference

Validated Designs for Object-oriented Systems. John Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel Verhoef. ISBN: 1-85233-881-4. Springer, New York. 2005.

Download the BIB file entry from the [publication list]({{site.url}}/publications/})

You can purchase the book on-line at the [Springer web-site](http://www.springer.com/east/home/generic/search/results?SGWID=5-40109-22-33837368-0). A Japanese translation is available as ISBN 978-1-85233-881-7 from August 2010, also available from the same publisher.

### Course material

Slides supporting the book can be found on the [VDM Portal](http://www.vdmportal.org/twiki/bin/view/Main/Vdmbookteaching)

### Errata

#### page 75

The last sentence on the page should be changed from:

~~~
Thus, the month can be extracted from a date by selecting field 2:
~~~

to:

~~~
Thus, the street can be extracted from an address by selecting field 2:
~~~

#### page 90
There is a problem with the definition of the `Sample` function definition. It makes use of the `Sex` function. However, `Sex` takes a `CPRNo`Digits4` as a parameter whereas in `Sample` it is being passed a `CPRNo` in the line:

~~~
p in set pop and Sex(p) = sexreqd
~~~

One solution is to make use of the `GetCode()` operation that is defined on p93.
The line then becomes:

~~~
p in set pop and Sex(p.GetCode()) = sexreqd
~~~

This change applies to both boxed definitions of `Sample`.

#### page 93
The second sentence following the first VDM++ box should have:
`(introduced later)`
changed to:
`(introduced previously)`

#### page 155
The body of `CarPassingEvent` should say:

~~~
NewPassage(distanceBetweenLoops / drivingTime)
~~~

instead of:

~~~
NewPassage(distanceBetweenLoops * drivingTime)
~~~

#### page 162
The definition of `ResetLog` and `WriteLog` should be changed to:

~~~
class OperatorControl

...

public ResetLog:() ==> ()
ResetLog() ==
  atomic
   ( messageLog := [];
     locations := [] );

public WriteLog: seq1 of char * CWS`Location ==> ()
WriteLog(message, location) ==
  atomic
  ( messageLog := messageLog ^ [message ^ ConvertNum2String(location)];
    locations := locations ^ [location] );

end OperatorControl
~~~

This change is necessary in order to ensure that the invariant (requiring the length of the instance variables `messageLog` and `locations` to be equal) is checked after both instance variables are updated.

#### page 180
The first box should be changed to:

~~~
class CongestionSensor

...

instance variables
  passageSensors: map CWS`Lane to PassageSensor := {|->};

end CongestionSensor
~~~

#### page 292
Figure 12.3 should be changed to the following figure:

<img src="{{ site.url }}/publications/books/vdoos/pop3seqdia.PNG" />

#### page 355/356
**Exercise 5.1** All three boxed solutions should be modified as described for p90 above.

#### page 357
In the solution to Exercise 6.7 should the answer for the first exercise only one quote with apple.

#### page 362
In the solution to Exercise 7.8 should the answer for the second exercise be changed from `[9,3,2,3]` to `[true,false,false]`.

#### page 364
In the solution to Exercise 7.12 should the answer for the first exercise be changed from `[true,false,4]` to `[true,true,4]`.

#### page 365
In the solution to Exercise 7.16 should the answer to the last exercise be changed from `{[5]}` to `{[5,4,5]}`. In the solution to Exercise 8.2 should the answer to the last exercise be changed from `{1 |-> 0.5}` be changed to `{|->}`.

#### page 366
In the solution to Exercise 8.6 should the answer to the last exercise be changed from `{1 |-> 5, 3 |-> 1, 5 |-> 1}` be changed to `{1 |-> 6, 3 |-> 1, 5 |-> 1}`.