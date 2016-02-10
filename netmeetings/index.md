---
layout: default
title: Overture Core NetMeetings
---

# {{ page.title }}

The Overture core group net meetings. 

## Upcoming meetings:

* Net Meeting 96: 13th March 2016, 1200 CET
* Net Meeting 97: 17th April 2016, 1200 CET
* Net Meeting 98: 22nd May 2016, 1200 CEST
* Net Meeting 99: 26th June 2016, 1200 CEST
* Net Meeting 100: 21th August 2016, 1200 CEST
* Net Meeting 101: 18th September 2016, 1200 CEST
* Net Meeting 102: 16th October 2016, 1200 CEST
* Net Meeting 103: 20th November 2016, 1200 CST
* Net Meeting 104: 18th December 2016, 1200 CST

And we have a [meeting template](template.html)

## Open Actions:

The list of open net meeting actions can be found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22).

## Past Meetings

{% for nm in site.netmeetings reversed %}
* [{{ nm.title }}]({{ site.url }}{{ nm.url }}): {{ nm.date | date: '%B %d, %Y' }} {% endfor %}
{% comment %} The endfor needs to be on the line with the list item {% endcomment %}


