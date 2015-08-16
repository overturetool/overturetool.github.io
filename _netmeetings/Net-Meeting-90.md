<script src="http://code.jquery.com/jquery-1.11.1.min.js">
</script>
<script src="/javascripts/edit.js"></script>
<script>setEditButonNm();</script>

# Net Meeting 90

|||
|---|---|
| Date | 2015-08-16 13:00 CET |
| Participants | HS, KP, PGL, NB, PJ, TO.  Minutes by PJ. |


## Review Status of the Action List

See [Net Meeting Actions](https://github.com/overturetool/overturetool.github.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22action+net-meeting%22)

* 80-1: Revise Strategic Goals for 2020. No progress.
* 88-1: Consider input for video on VDM. No progress.

## Overture Language Board Status

#### RM 27

Nick has implemented a first version of pure operations in both VDMJ and Overture. There has been some initial testing and a few issues have been reported. PGL will take care of updating the LRM when we get to that.


## Status of VDMTools Development

Shin reported VDMTools to be stable. Other than that there's nothing new.


##  Status of the Overture Components

#### VDMJ

I've updated VDMJ and Overture to support the "pure operation" feature described by RM#27. This is only enabled in "vdm10" mode (not classic). I need people to test the feature before we merge the change into the main branch. The Overture changes are currently on a separate "ncb/pureoperations" branch. Note also that VDMJ has moved from SourceForge to GitHub (as SF was down for a couple of weeks!). See https://github.com/nickbattle/vdmj.

#### VDM-SL to JML annotated Java

I (PJ) found some flaws in the way that the JML generator handles atomic execution and state invariants that I have fixed. A new release of the JML generator will ship with the next release of Overture.

##  Release Planning

When the pure operation implementation is considered stable Overture 2.3 will be released. Peter will talk to Anders (the release manager) about this.

##  Community Development

Nothing new reported.

#### Overture Traffic

See download stats on [the downloads page](http://overturetool.org/download/)

##  Publications Status and Plans

Also see [Planned Publications](http://overturetool.org/publications/PlannedPublications.html).

##  Any Other Business

None.

<div id="edit_page_div"></div>
