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
             <td><a href="{{ site.url }}/publications/books/vdoos/"> <img src="{{ site.url }}/publications/books/vdoos-jp.jpg" height="140" alt="Validated Designs for Object-oriented Systems"> </a></td>
 
            </tr>
        </tbody>
</table>

### VDM++によるオブジェクト指向システムの高品質設計と検証

このページは Validated Designs for Object-oriented Systems の訳本である「VDM++によるオブジェクト指向システムの高品質設計と検証」(翔泳社 2010年)のサポートページです。これから内容が追加されますが、とりあえず サンプルモデル, 演習の解答, セミナー資料 などをご覧下さい。VDMそのものの情報に関しては the VDM Portalをご覧下さい。

 
### Tool について

株式会社 CSK Systems 様から VDMTools の特別版 VDMTools Lite が、本書の例題を試す為に無償で提供されています。 www.vdmtools.jp　をご覧下さい。動作環境は Windows 2000/XP/Vista/7, Mac (G4, G5 and x86) そして Linux です。コード生成(Java, C++)や動的リンクライブラリ、そして CORBA サポートを含む完全版については VDM.SP@csk.com までお問い合わせ下さい。
VDMTools の代わりの選択肢としてオープンソースの Overture プロジェクトの成果もお使いいただけます。概要は downloaded へどうぞ。Overture のツール(Windows, Mac そして Linux用)のダウンロードは次の場所からどうぞ freely available。


### 正誤表

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