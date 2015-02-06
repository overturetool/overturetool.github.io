---
layout: default
title: Overture Workshops
---

# {{ page.title }}

The Overture Workshops.

{% assign sortedWorkshops = site.workshops | sort:'date' %}
{% for ws in sortedWorkshops reversed %}
* [{{ ws.title }}]({{ site.url }}{{ ws.url }}): {{ ws.date }}{% if ws.location %}, {{ ws.location }}{% endif %}{% endfor %}
{% comment %} The endfor needs to be on the line with the list item {% endcomment %}


