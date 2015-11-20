---
layout: default
title: Overture Core NetMeetings
---

# {{ page.title }}

The Overture core group net meetings. 

## Upcoming meetings:

* Net Meeting 93: 6th December 2015, 1300 CET
* Net Meeting 94: 10th January 2016, 1300 CET
* Net Meeting 95: 7th February 2016, 1300 CET
* Net Meeting 96: 13th March 2016, 1300 CET
* Net Meeting 97: 17th April 2016, 1300 CET
* Net Meeting 98: 22nd May 2016, 1300 CEST
* Net Meeting 99: 26th June 2016, 1300 CEST
* Net Meeting 100: 

And we have a [meeting template](template.html)

## Open Actions:

The list of open net meeting actions can be found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22).

## Past Meetings

{% for nm in site.netmeetings reversed %}
* [{{ nm.title }}]({{ site.url }}{{ nm.url }}): {{ nm.date }}{% endfor %}
{% comment %} The endfor needs to be on the line with the list item {% endcomment %}


