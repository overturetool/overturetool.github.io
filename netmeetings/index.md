---
layout: default
title: Overture Core NetMeetings
---

# {{ page.title }}

The Overture core group net meetings. 

## Upcoming meetings:

* Net Meeting 107: 23rd April 2017, 1200 CEST
* Net Meeting 108: 28th May 2017, 1200 CST
* Net Meeting 109: 2nd July 2017, 1200 CST
* Net Meeting 110: 27th August 2017, 1200 CST
* Net Meeting 111: 8th October 2017, 1200 CST
* Net Meeting 112: 12th November 2017, 1200 CST
* Net Meeting 113: 17th December 2017, 1200 CST

And we have a [meeting template](template.html)

## Open Actions:

The list of open net meeting actions can be found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22).

## Past Meetings

{% for nm in site.netmeetings reversed %}
* [{{ nm.title }}]({{ site.url }}{{ nm.url }}): {{ nm.date | date: '%B %d, %Y' }} {% endfor %}
{% comment %} The endfor needs to be on the line with the list item {% endcomment %}


