---
title: NetMeeting Default Template
date:  2015-01-28 13:00 CET
---

# Net-Meeting Template and Addition Guide

<!-- _This template should be copied to the `_netmeetings/` directory and edited appropriately._ -->

* Navigate to: https://github.com/overturetool/overturetool.github.io/tree/master/_netmeetings
* Find and press the + sign at the end of: overturetool.github.io/_netmeetings/+
* Enter the new file name: `Net-Meeting-XX.md`, where XX is the netmeeting number.
* Paste the content of the template below into the Edit new file box
* Update the header title and date
* Commit the file. It can be edited after it is created by selecing it and pressing the pen on the top right.

A github guide for creating pages are avaliable from here: https://help.github.com/articles/creating-new-files/

Template starts below this line:

--------------------------------------- Template Begin ----------------------------------------------------------

~~~
---
layout: default
title: Net Meeting XX
date: 4 February 2007, 1200 CET
---

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date }} |
| Participants | AA, BB, ..., CC.  Minutes by DD. |


## Review Status of the Action List

See [Net Meeting Actions](actions.html)

* 10-1 some progress...
* 11-4 no progress...
* 15-2 is now closed.
* ...


## Overture Language Board Status

#### topic 1

some description


## Status of VDMTools Development

#### topic 1

some description


##  Status of the Overture Components

#### Component 1

details about it


##  Release Planning

#### topic 1

some description


##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### topic 1
...


##  Strategic Research Agenda

The Strategic [[Research]] Agenda is reviewed every other NetMeeting.


##  Publications Status and Plans

Also see [[Planned Publications]].

#### In preparation:

* Item 1
* Item 2

#### In review:

* Item 1

#### In press:

* Item 1


##  Any Other Business

~~~
