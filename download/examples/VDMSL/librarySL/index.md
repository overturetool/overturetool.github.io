---
layout: default
title: librarySL
---

## librarySL
Author: Anne Maarsel


This specification is for a bibliography database. It has been written
by Anne Maarsel when she was a student working at OECD Halden Reator
Project in the Summer of 1998. Note that this specification can be
improved in various ways. First of all it introduces post-conditions
that are not really adding much value since they are virtually
identical to the explicit bodies. In addition the use of an optional
type instead of <nil> would be appropriate here.



| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| DEFAULT`isnumber(42)|


### library.vdmsl

{% raw %}
~~~
types

Id = nat;
String = seq of char|<nil>;
Edition = nat|<nil>
inv e == e in set {1,...,50} union {<nil>};
Month = nat|<nil>
inv e == e in set {1,...,12} union {<nil>};
Number = nat1|<nil>;
Pages = nat1|<nil>;
Series = nat1|<nil>;
Volume = nat1|<nil>;
Year = nat|<nil>
inv e == e in set {1800,...,1998} union {<nil>};

Article::id	:Id
	author	:String
	journal	:String
	month	:Month
	note	:String
	number	:Number
	pages	:Pages
	title	:String
	volume	:Volume	
	year	:Year;

Book::	id	:Id
	address	:String
	author	:String
	edition	:Edition
	editor	:String
	month	:Month
	note	:String
	publisher:String
	series	:Series
	title	:String
	volume	:Volume	
	year	:Year;

Inproceeding::	id	:Id
		address	:String
		author	:String
		booktitle:String
		editor	:String
		month	:Month
		note	:String
		organization:String
		pages	:Pages
		publisher:String
		title	:String
		year	:Year;	

Manual::id	:Id
	address	:String
	author	:String
	edition	:Edition
	month	:Month
	note	:String
	organization:String
	title	:String
	year	:Year;

Techreport::	id	:Id
		address	:String
		author	:String
		institution:String
		month	:Month
		note	:String
		number	:Number
		title	:String
		type	:String
		year	:Year;

Record =  Article | Book | Inproceeding | Manual | Techreport;

Recordtype = <article> | <book> | <inproceeding> | <manual> | <techreport>;

Value = Id | String | Edition | Month | Number | Pages | 
	Series | Volume | Year;

Valuetype = <id> | <address> | <author> | <booktitle> | <edition> | 
	<editor> | <institution> | <journal> | <month> | <note> | 
	<number> | <organization> | <pages> | <publisher> | <series> | 
	<title> | <type> | <volume> | <year>;



state mgd of
dB:set of Record
init dB==dB=mk_mgd({})
end


functions


field: Recordtype +> set of Valuetype
field(rt)==
  required(rt) union optional(rt)
post RESULT=required(rt) union optional(rt);



get: set of Record*Id +> Record
get(dB,i)==
  let record in set dB 
  in 
	if record.id=i 
	then record 
	else get(dB\{record},i)	
pre	i in set usedIds(dB) 
post RESULT.id=i and RESULT in set dB
measure card db;
  
getvalue: Valuetype*set of Record*Id +> Value
getvalue(valuetype,dB,i)==
	cases valuetype:
		<title>	->		get(dB,i).title,
		<author> ->		get(dB,i).author,
		<journal> ->		get(dB,i).journal,
		<year> ->		get(dB,i).year,
		<booktitle> ->		get(dB,i).booktitle,
		<institution> ->	get(dB,i).institution,
		<publisher> ->		get(dB,i).publisher
	end
pre	i in set usedIds(dB) and
	valuetype in set {<title>,<author>,<journal>,<year>,<booktitle>,
			<institution>,<publisher>}
post 	valuetype=<title>	and RESULT=get(dB,i).title or
	valuetype=<author>	and RESULT=get(dB,i).author or
	valuetype=<journal>	and RESULT=get(dB,i).journal or 
	valuetype=<year>	and RESULT=get(dB,i).year or
	valuetype=<booktitle>	and RESULT=get(dB,i).booktitle or
	valuetype=<institution>	and RESULT=get(dB,i).institution or
	valuetype=<publisher>	and RESULT=get(dB,i).publisher;

iscomplete :set of Record*Id +> bool
iscomplete(dB,i)==
  required(recordtype(dB,i))={f|f in set required(recordtype(dB,i)) 
                               & not isempty(getvalue(f,dB,i))}
pre	i in set usedIds(dB) 
post (forall x in set required(recordtype(dB,i)) & 
	     not isempty(getvalue(x,dB,i))) <=> RESULT;

isedition: Value +> bool
isedition(v)==
	v in set {1,...,50} or v=<nil>;

isempty: Value +> bool
isempty(value)==
	if value=<nil> then true
	else false
post value=<nil> <=> RESULT;

isidentical: set of Record +> bool
isidentical(dB)==
	if dB={} then false 
	else let record1 in set dB in 
	if iscomplete(dB,record1.id) 
	then isidentical2(dB,dB\{record1},dB,record1)
	else isidentical(dB\{record1})
post 	(exists i,j in set usedIds(dB) & i<>j and iscomplete(dB,i) 
	and iscomplete (dB,j) 
	and recordtype(dB,i)=recordtype(dB,j) and
	forall x in set required(recordtype(dB,i)) 
	& getvalue(x,dB,i)=getvalue(x,dB,j)) <=> RESULT;

isidentical2: set of Record*set of Record*set of Record*Record +>bool
isidentical2(dB1,dB2,olddB,record1)==
	if dB2={} then isidentical(dB1\{record1}) 
	else let record2 in set dB2 in
	if iscomplete(olddB,record2.id) then
	isidentical3(dB1,dB2,olddB,record1,record2,
	required(recordtype(olddB,record1.id)))
	else isidentical2(dB1,dB2\{record2},olddB,record1);

isidentical3: set of Record*set of Record*set of Record*Record*
              Record*set of Valuetype +> bool
isidentical3(dB1,dB2,olddB,record1,record2,requiredfields)==
	if requiredfields={} then true
	else let field in set requiredfields in
	if getvalue(field,olddB,record1.id)<>
	getvalue(field,olddB,record2.id) 
	then isidentical2(dB1,dB2\{record2},olddB,record1)
	else isidentical3(dB1,dB2,olddB,record1,record2,requiredfields\{field});

ismonth: Value +> bool
ismonth(v)==
	is_nat(v);
	--v in set {1,...,12} or v=<nil>;

isnumber: Value +> bool
isnumber(v)==
	is_nat(v) or v=<nil>;

ispages: Value +> bool
ispages(v)==
	is_nat(v) or v=<nil>;

isstring: Value +> bool
isstring(v)==
  if not is_real(v) 
  then if v=[] 
       then true
       elseif is_char(hd(v)) 
       then isstring(tl(v))
       else false
  else false;
	
issubstring: String*String +> bool
issubstring(string1,string2)==
	if string1=[] then true 
	elseif string2=[] or string1=<nil> or string2=<nil> then false
	elseif hd(string1)=hd(string2) 
	then issubstring2(tl(string1),tl(string2),string1)
	else issubstring(string1,tl(string2))
post	(not (string2=<nil>)) and (exists i,j in set inds(string2) 
	& substring(string2,i,j)=string1) <=> RESULT;

issubstring2: String*String*String +> bool
issubstring2(string1,string2,oldstring1)==
	if string1=[] then true 
	elseif string2=[] then false
	elseif hd(string1)=hd(string2) 
	then issubstring2(tl(string1),tl(string2),oldstring1)
	else issubstring(oldstring1,string2);



isvalueoffield: Value*Valuetype +> bool
isvalueoffield(v,f)==
	cases f:
		<address> ->	isstring(v),
		<author> ->	isstring(v), 
		<booktitle> ->	isstring(v),
		<edition> ->	isedition(v),
		<editor> ->	isstring(v),
		<institution> ->isstring(v),
		<journal> ->	isstring(v), 
		<month>	->	ismonth(v),
		<note> ->	isstring(v),
		<number> ->	isnumber(v),
		<organization> ->isstring(v),
		<pages> ->	ispages(v),
		<publisher> ->	isstring(v),
		<title>	->	isstring(v),
		<type> ->	isstring(v),
		<volume> ->	isvolume(v),
		<year> ->	isyear(v)
	end
post 	((f=<address> 	and exists x:String & x=v) or
	(f=<author> 	and exists x:String & x=v) or
	(f=<booktitle> 	and exists x:String & x=v) or
	(f=<edition> 	and exists x:Edition & x=v) or
	(f=<editor> 	and exists x:String & x=v) or
	(f=<institution> and exists x:String & x=v) or
	(f=<journal> 	and exists x:String & x=v) or
	(f=<month> 	and exists x:Month & x=v) or
	(f=<note> 	and exists x:String & x=v) or
	(f=<number> 	and exists x:Number & x=v) or
	(f=<organization>and exists x:String & x=v) or
	(f=<pages> 	and exists x:Pages & x=v) or
	(f=<publisher> 	and exists x:String & x=v) or
	(f=<title> 	and exists x:String & x=v) or
	(f=<type> 	and exists x:String & x=v) or
	(f=<volume> 	and exists x:Volume & x=v) or
	(f=<year> 	and exists x:Year & x=v)) <=> RESULT;

isvolume: Value +> bool
isvolume(v)==
	is_nat(v) or v=<nil>;

isyear: Value +> bool
isyear(v)==
	v in set {1800,...,1998} or v=<nil>;

optional: Recordtype +> set of Valuetype
optional(rt)==
	cases rt:
		<article> 	-> {<volume>,<number>,<month>,<note>},
		<book>		-> {<volume>,<series>,<address>,
				<edition>,<month>,<note>,<publisher>},
		<inproceeding>	-> {<editor>,<pages>,<organization>,
				<publisher>,<address>,<pages>,<organization>},
		<manual>	-> {<edition>,<note>,<organization>,<month>,
				<address>,<author>,<organization>,<year>},
		<techreport>	-> {<number>,<note>,<type>,<month>,<address>}
	end
post 	rt = <article>		
	and RESULT={<volume>,<number>,<month>,<note>} or
	rt = <book>		
	and RESULT={<volume>,<series>,<address>,<edition>,<month>,<note>,
		<publisher>} or
 	rt = <inproceeding>	
	and RESULT={<editor>,<pages>,<organization>,<publisher>,<address>,
		<pages>,<organization>} or
	rt = <manual>		
	and RESULT={<edition>,<note>,<organization>,<month>,<address>,
		<author>,<organization>,<year>} or
	rt = <techreport>	
	and RESULT={<number>,<note>,<type>,<month>,<address>};

recordtype: set of Record*Id +> Recordtype
recordtype(dB,i)==
	if is_Article(get(dB,i)) 		then <article> 
	elseif is_Book(get(dB,i))	 	then <book> 
	elseif is_Inproceeding(get(dB,i)) 	then <inproceeding> 
	elseif is_Manual(get(dB,i))	 	then <manual> 
	else <techreport>
pre	i in set usedIds(dB)
post 	is_Article(get(dB,i)) 		and RESULT=<article> or
	is_Book(get(dB,i))	 	and RESULT=<book> or
	is_Inproceeding(get(dB,i)) 	and RESULT=<inproceeding> or
	is_Manual(get(dB,i))	 	and RESULT=<manual> or
	is_Techreport(get(dB,i))  	and RESULT=<techreport>;

required: Recordtype +> set of Valuetype
required(rt)==
	cases rt:
		<article> 	-> {<title>,<author>,<journal>,<year>},
		<book>		-> {<title>,<author>,<publisher>,<year>},
		<inproceeding>	-> {<title>,<author>,<booktitle>,<year>},
		<manual>	-> {<title>},
		<techreport>	-> {<title>,<author>,<institution>,<year>}
	end
post 	rt = <article>		
	and RESULT={<title>,<author>,<journal>,<year>} or
	rt = <book>		
	and RESULT={<title>,<author>,<publisher>,<year>} or
 	rt = <inproceeding>	
	and RESULT={<title>,<author>,<booktitle>,<year>} or
	rt = <manual>		
	and RESULT={<title>} or
	rt = <techreport>	
	and RESULT={<title>,<author>,<institution>,<year>};

substring(s:String,i:nat1,j:nat1) r:String
pre	i<j and j<=len(s)
post	exists s1,s2:String & len(s1)=i-1 and len(s2)=len(s)-j 
	and s=s1^r^s2;

usedIds: set of Record +> set of Id
usedIds(dB)==
	idset(dB,{})
post 	forall x in set dB & x.id in set RESULT and
	forall i in set RESULT & exists x in set dB & x.id = i;

idset: set of Record*set of Id +> set of Id
idset(dB,ids)==
  if dB={} 
  then ids
  else let record in set dB 
       in 
	     idset(dB\{record},ids union {record.id})
measure card dB;
  
operations

CREATE: Recordtype ==> Id
CREATE(e)==
(dcl i:nat1:=1;
(while
i in set usedIds(dB) do i:=i+1);
	cases e:
		<article> 	-> dB:=dB union 
					{mk_Article(i,<nil>,<nil>,<nil>,<nil>,
					<nil>,<nil>,<nil>,<nil>,<nil>)},
		<book>  	-> dB:=dB union 
					{mk_Book(i,<nil>,<nil>,<nil>,<nil>,
					<nil>,<nil>,<nil>,<nil>,<nil>,<nil>,
					<nil>)}, 
		<inproceeding>	-> dB:=dB union 
					{mk_Inproceeding(i,<nil>,<nil>,<nil>,
					<nil>,<nil>,<nil>,<nil>,<nil>,<nil>,
					<nil>,<nil>)}, 
		<manual>	-> dB:=dB union 
					{mk_Manual(i,<nil>,<nil>,<nil>,<nil>,
					<nil>,<nil>,<nil>,<nil>)},
		<techreport>	-> dB:=dB union 
					{mk_Techreport(i,<nil>,<nil>,<nil>,
					<nil>,<nil>,<nil>,<nil>,<nil>,<nil>)}
	end;
return i)

post 	RESULT not in set usedIds(dB~) and 
	e=<article> and 
	dB=dB~ union {mk_Article(RESULT,<nil>,<nil>,<nil>,<nil>,<nil>,<nil>,
				<nil>,<nil>,<nil>)}  
	or e=<book> and 
	dB=dB~ union {mk_Book(RESULT,<nil>,<nil>,<nil>,<nil>,<nil>,<nil>,
				<nil>,<nil>,<nil>,<nil>,<nil>)} 
	or e=<inproceeding> and 
	dB=dB~ union {mk_Inproceeding(RESULT,<nil>,<nil>,<nil>,<nil>,<nil>,
				<nil>,<nil>,<nil>,<nil>,<nil>,<nil>)} 
	or e=<manual> and
	dB=dB~ union {mk_Manual(RESULT,<nil>,<nil>,<nil>,<nil>,<nil>,<nil>,
				<nil>,<nil>)}  
	or e=<techreport>  and 
	dB=dB~ union {mk_Techreport(RESULT,<nil>,<nil>,<nil>,<nil>,<nil>,
				<nil>,<nil>,<nil>,<nil>)};

UPDATE(i:Id,f:Valuetype,v:Value)==
(if i in set usedIds(dB) and f in set field(recordtype(dB,i)) and 
isvalueoffield(v,f)
then (cases f:
	<address>	-> let urecord={mu(get(dB,i),address|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<author>	-> let urecord={mu(get(dB,i),author|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<booktitle>	-> let urecord={mu(get(dB,i),booktitle|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<edition>	-> let urecord={mu(get(dB,i),edition|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<editor>	-> let urecord={mu(get(dB,i),editor|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<institution>	-> let urecord=
				{mu(get(dB,i),institution|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<journal>	-> let urecord={mu(get(dB,i),journal|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<month>		-> let urecord={mu(get(dB,i),month|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<note>		-> let urecord={mu(get(dB,i),note|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<number>	-> let urecord={mu(get(dB,i),number|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<organization>	-> let urecord=
				{mu(get(dB,i),organization|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<pages>		-> let urecord={mu(get(dB,i),pages|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<publisher>	-> let urecord={mu(get(dB,i),publisher|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<title>		-> let urecord={mu(get(dB,i),title|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<type>		-> let urecord={mu(get(dB,i),type|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<volume>	-> let urecord={mu(get(dB,i),volume|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord,
	<year>		-> let urecord={mu(get(dB,i),year|->v)} in  
				dB:=(dB\{get(dB,i)}) union urecord
end;
if iscomplete(dB,i) and isidentical(dB) 
then (DELETE(i); error;)))
ext wr 	dB:set of Record
pre 	i in set usedIds(dB) and
	f in set field(recordtype(dB,i)) and
	isvalueoffield(v,f) and
	not (iscomplete(dB,i) and isidentical(dB))
post	getvalue(f,dB,i)=v and 
	dB\{get(dB,i)}=dB~\{get(dB~,i)} and
	forall x in set field(recordtype(dB,i))\{f} & 
	   getvalue(x,dB,i)=getvalue(x,dB~,i);

COMPLETE: Id ==> bool
COMPLETE(i)==
	return iscomplete(dB,i)
pre 	i in set usedIds(dB)
post	iscomplete(dB,i) <=> RESULT;


DELETE(i:Id)==
	if i in set usedIds(dB)
	then dB:=dB\{get(dB,i)}
ext wr 	dB:set of Record
pre 	i in set usedIds(dB)
post	dB~=dB union {get(dB~,i)};

SEARCH: String ==> set of Id
SEARCH(a)==
 (dcl ids:set of Id:={};
  for all record in set dB do
    if issubstring(a,record.author) 
    then ids:=ids union {record.id}
    else ids:=ids;
	return ids)
post forall i in set RESULT & issubstring(a,get(dB,i).author)
	and not exists record in set dB & 
	(record.id not in set RESULT and 
     issubstring(a,get(dB,i).author));

GET: Id ==> Record
GET(i)==
	return get(dB,i)
pre 	i in set usedIds(dB)
post	RESULT=get(dB,i);


~~~
{% endraw %}

