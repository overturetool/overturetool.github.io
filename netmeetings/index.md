---
layout: default
title: Overture Core NetMeetings
---

# {{ page.title }}

The Overture core group net meetings.

## Upcoming meetings:

* Net Meeting 86: 22nd February 2015, 1300 CET
* Net Meeting 87: 29th March 2015, 1300 CET
* Net Meeting 88: 3rd May 2015, 1300 CET
* Net Meeting 89: 7th June 2015, 1300 CET
* Net Meeting 90: 16th August 2015, 1300 CET
* Net Meeting 91: 20th September 2015, 1300 CET
* Net Meeting 92: 25th October 2015, 1300 CET
* Net Meeting 93: 6th December 2015, 1300 CET

And we have a [meeting template](template.html)

## Past Meetings

{% for nm in site.netmeetings reversed %}
* [{{ nm.title }}]({{ site.url }}{{ nm.url }}): {{ nm.date }}{% endfor %}
{% comment %} The endfor needs to be on the line with the list item {% endcomment %}


