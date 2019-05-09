---
layout: default
title: Net Meeting 119
date: 12 May 2019, 1200 CEST
---

<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# {{ page.title }}

|||
|---|---|
| Date | {{ page.date | date: "%-d %B %Y, %R %Z"}} |
| Participants TBD |   Minutes by TBD. |


## Review Status of the Action List

A list of actions can here found [here](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22action+net-meeting%22)


## Overture Language Board Status


## Status of VDMTools/ViennaTalk

* [v9.0.9](https://github.com/vdmtools/vdmtools/releases/tag/v9.0.9) is released.

### The website
* SSLized https://viennatalk.org/ . http://viennatalk.org/ is redirected to https://viennatalk.org/
* SSLized https://viennatalk.org/vdmpad/. http://viennatalk.org/vdmpad/ is still accessible by the conventional HTTP so that it can still serve as a cloud VDM-SL interpreter server.

##  Status of the Overture Components

The next release of Overture will include

* Support for [VDM annotations](https://github.com/overturetool/language/issues/46) (currently limited to the Overture command-line interface)
* Improved type checking of struct import/export (VDM-SL only)
* Improved Java code-generation support
  - Limited support for [polymorphic types](https://github.com/overturetool/overture/issues/691)
  - Support for [renamed constructs](https://github.com/overturetool/overture/issues/690) (VDM-SL only)
  - Several bug fixes for the code-generator based on LF's work.

### The website (overturetool.org)

Updating the overturetool.org website, by pushing changes to the [overturetool.github.io](https://github.com/overturetool/overturetool.github.io) repository, produces the following rather critical warning:

> The page build completed successfully, but returned the following warning for the `master` branch:
> The custom domain for your GitHub Pages site is pointed at an outdated
> IP address. You must update your site's DNS records if you'd like it
> to be available via your custom domain. For more information, see
> https://help.github.com/en/articles/using-a-custom-domain-with-github-pages.
> For information on troubleshooting Jekyll see:
>  https://help.github.com/articles/troubleshooting-jekyll-builds

In order to fix this we'd have to go to the company where we purchased the domain and update the DNS settings. However, it is currently unclear who has the power to do this.

##  Release Planning

The next release, which is due June 03, includes several new features and bug fixes (described above). For this reason, we will send out the release candidate (RC) three weeks in advance. This will give us some extra time for testing and possibly send out a second RC, if needed. The release version will be 2.7.0.

##  Community Development

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

#### The next Overture workshop


##  Licensing of Overture source code


##  Publications Status and Plans

See [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business



<div id="edit_page_div"></div>





