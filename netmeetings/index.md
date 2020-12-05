---
layout: default
title: Overture Core NetMeetings
---

# {{ page.title }}

The Overture core group net meetings. 

## Upcoming meetings:

* Net Meeting 130: November 7, 2021
* Net Meeting 129: August 29, 2021
* Net Meeting 128: June 27, 2021
* Net Meeting 127: May 2, 2021
* Net Meeting 126: February 14, 2021

And we have a [meeting template](template.html)

## Open Actions:

The list of open net meeting actions can be found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22).

## Past Meetings

{% for nm in site.netmeetings reversed %}
* [{{ nm.title }}]({{ site.url }}{{ nm.url }}): {{ nm.date | date: '%B %d, %Y' }} {% endfor %}
{% comment %} The endfor needs to be on the line with the list item {% endcomment %}


