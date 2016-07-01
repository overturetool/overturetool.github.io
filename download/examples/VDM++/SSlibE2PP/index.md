---
layout: default
title: SSlibE2PP
---

## SSlibE2PP
Author: Shin Sahara


This example contains a large collection of test classes that can be
used to test different aspects of VDM++. This makes use of the VDMUnit 
test approach.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new AllT().run()|


### AllT.vdmpp

{% raw %}
~~~
/*
Test Group
	Test of all test cases
Written by
	Shin Sahara
*/
class AllT
operations
public run : () ==>bool
run () == 
	let	ResultOfTest =
		[
			new TermT().run(),
			new TimeT().run(),
			new MapT().run(),
			new HashtableT().run(),
			new FHashtableT().run(),
			new DoubleListQueueT().run(),
			new QueueT().run(),
			new ＵｎｉｑｕｅＮｕｍｂｅｒＴ().run(),
			new RealT().run(), 
			new SetT().run(),
			new SequenceT().run(),
			new StringT().run(),
			new IntegerT().run(),
			new NumberT().run(),
			new CalendarT().run(),
			new SBCalendarT().run(),
			new DateT().run(),
			new FunctionT().run()
			],
		Message = "Result of all test cases."
		
	in
	if   forall i in set inds ResultOfTest & ResultOfTest(i) then
		return new TestLogger().succeededInAllTestcases(Message)
	else
		return new TestLogger().notSucceededInAllTestcases(Message)
	
end AllT
 
~~~
{% endraw %}

### Calendar.vdmpp

{% raw %}
~~~
class CalendarDefinition
values
	public homedir = ".";
types
	public NameOfDayOfTheWeek = <Mon> | <Tue> | <Wed> | <Thu> | <Fri> | <Sat> | <Sun>;
	public NumberOfDayOfTheWeek = nat
	inv d == d <= 6;	--number of day of the week (Sunday=0, Saturday=6);
	
end CalendarDefinition
--------------------------------------------------------------
class Calendar is subclass of CalendarDefinition	-- Gregorio Calendar
/*
Responsibility
	I am a Gregorio Calendar.
Abstract
	I calculate Gregorio Calendar by cooperating with Date class.
	You can get the the vernal equinox and the autumnal equinox until year 2099.
	My subclass has to define the set of holiday.
	My calculation is based on GMT, so my subclass has to calculate the diofference to GMT.
*/

values
	--difference of julianDate and modifiedJulianDate
	private daysDifferenceOfModifiedJulianDate = 2400000.5;

	private namesOfDayOfTheWeek = [<Sun>,<Mon>,<Tue>,<Wed>,<Thu>,<Fri>,<Sat>];

	private daysInYear = 365.25;
	protected monthsInYear = 12;
	private correctedMonths = 14;
	private daysInWeek = 7;
	private averageDaysInMonth = 30.6001;
	private yearInCentury = 100;
	private calculationCoefficientOfDate = 122.1;
	private calculationCoefficientOfYear = 4800;
	private centuryCalculationCoefficient = 32044.9;
	private theDayBeforeGregorioCalendarStarted  = 2299160.0;
	private theFirstDayOfGregorioCalendar  = 1582.78;
	
	io = new IO();

instance variables

	protected differenceWithGMT : real := 0;
	protected iToday : [Date] := nil;
	protected Year2Holidays : map int to set of Date := { |-> };	-- { year |-> set of holidays }

functions

----Comparing magnitude functions

public LT: Date * Date -> bool
LT(date1, date2) == date1.getModifiedJulianDate() < date2.getModifiedJulianDate();

public GT: Date * Date -> bool
GT(date1,date2) == date1.getModifiedJulianDate() > date2.getModifiedJulianDate();

public LE: Date * Date -> bool
LE(date1,date2) == not GT(date1,date2);

public GE: Date * Date -> bool
GE(date1,date2) == not LT(date1,date2);

-- Is date1 value equal date2 value?
public EQ: Date * Date -> bool
EQ(date1,date2) == date1.getModifiedJulianDate() = date2.getModifiedJulianDate();

public min : Date -> Date -> Date
min(date1)(date2) == if date1.LT(date2) then date1 else date2;

public max : Date -> Date -> Date
max(date1)(date2) == if date1.GT(date2) then date1 else date2;

----Query

public isDateString : 
	seq of char	-- date string (yyyymmdd format)
	->
	bool		-- if correct date then true else false
isDateString(yyyymmdd) == if getDateFromString(yyyymmdd) = false then false else true;

-- is leap year?
public isLeapYear: 
	int	-- year
	-> 
	bool	-- leap year or not
isLeapYear(year) == year mod 400 = 0 or (year mod yearInCentury <> 0 and year mod 4 = 0);

public getNumberOfDayOfTheWeek: Date -> NumberOfDayOfTheWeek
getNumberOfDayOfTheWeek(date) == 
	let	modifiedJulianDate = floor(date.getModifiedJulianDate())
	in	(modifiedJulianDate - 4) mod daysInWeek;

public getYyyymmdd: Date -> int * int * int
getYyyymmdd(date) == mk_(Year(date),Month(date),day(date));

public getNameOfDayOfTheWeek : Date -> NameOfDayOfTheWeek
getNameOfDayOfTheWeek(date) == namesOfDayOfTheWeek(getNumberOfDayOfTheWeek(date) + 1);

public getNumberOfDayOfTheWeekFromName : NameOfDayOfTheWeek -> NumberOfDayOfTheWeek
getNumberOfDayOfTheWeekFromName(nameOfDayOfTheWeek) == Sequence`Index[Calendar`NameOfDayOfTheWeek](nameOfDayOfTheWeek)(namesOfDayOfTheWeek) - 1;

public firstDayOfTheWeekInMonth : int * int * NameOfDayOfTheWeek -> Date
firstDayOfTheWeekInMonth(year, month,nameOfDayOfTheWeek) ==
	let	numberOfDayOfTheWeek = getNumberOfDayOfTheWeekFromName(nameOfDayOfTheWeek),
		firstDayOfMonth = getFirstDayOfMonth(year, month),
		diff = numberOfDayOfTheWeek - getNumberOfDayOfTheWeek(firstDayOfMonth) in
	cases true:
		(diff = 0)	-> firstDayOfMonth,
		(diff > 0)	-> firstDayOfMonth.plus(diff),
		(diff < 0)	-> firstDayOfMonth.plus((daysInWeek + diff) mod daysInWeek)
	end;

-- Get the last date which has the specified name of day of the week
-- My algorithm thinks "year Y, month 13" = "year y+1, month 1", so I can month + 1
public lastDayOfTheWeekInMonth : int * int *	NameOfDayOfTheWeek -> Date
lastDayOfTheWeekInMonth(year, month, nameOfDayOfTheWeek) == firstDayOfTheWeekInMonth(year,(month+1),nameOfDayOfTheWeek).minus(daysInWeek);

-- Get the n-th day of the week of specified month
public getNthDayOfTheWeek : int * int * int * NameOfDayOfTheWeek
	->
	Date | bool 	-- the date which has n-th  day of the week, if not exist then false
getNthDayOfTheWeek(aYear, aMonth, n, nameOfDayOfTheWeek) ==
	let	firstDayOfMonth = firstDayOfTheWeekInMonth(aYear,aMonth,nameOfDayOfTheWeek),
		r = firstDayOfMonth.plus(daysInWeek * (n - 1)) in
	cases Month(r):
		(aMonth)	-> r,
		others	-> false
	end;

--new Calendar().getFirstDayOfMonth(2001,7).get_yyyy_mm_dd() = mk_( 2001,7,1 )
public getFirstDayOfMonth : int * int -> Date
getFirstDayOfMonth(year, month) == getRegularDate(year, month, 1);

--new Calendar().getLastDayOfMonth(2001,7).get_yyyy_mm_dd() = mk_( 2001,7,31 )
public getLastDayOfMonth : int * int -> Date
getLastDayOfMonth(year, month) == getRegularDate(year, month+1, 1).minus(1);
	
public isSunday : Date -> bool
isSunday(date) == getNumberOfDayOfTheWeek(date) = 0;

public isSaturday : Date -> bool
isSaturday(date) == getNumberOfDayOfTheWeek(date) = 6;

public isWeekday : Date -> bool
isWeekday(date) == getNumberOfDayOfTheWeek(date) in set {1,...,5};

public isNotDayOff : Date -> bool
isNotDayOff(date) == not isSundayOrDayoff(date);

public isWeekday : NameOfDayOfTheWeek -> bool
isWeekday(nameOfDayOfTheWeek) == nameOfDayOfTheWeek not in set {<Sat>,<Sun>};

-- Return how many days between date1 and date2 of nameOfDayOfTheWeek.  
-- include date1 and date2 iff they have the nameOfDayOfTheWeek.
public getNumberOfTheDayOfWeek: Date * Date * NameOfDayOfTheWeek -> int
getNumberOfTheDayOfWeek(date1,date2,nameOfDayOfTheWeek) ==
	let	numberOfDayOfTheWeek = getNumberOfDayOfTheWeekFromName(nameOfDayOfTheWeek),
		startDate = min(date1)(date2),
		endDate = max(date1)(date2),
		numOfDays = diffOfDates(endDate,startDate) + 1,
		quotient = numOfDays div daysInWeek,
		remainder = numOfDays mod daysInWeek,
		delta = if subtractDayOfTheWeek(numberOfDayOfTheWeek,getNumberOfDayOfTheWeek(startDate)) + 1 <= remainder then 1 else 0	in
	quotient + delta
/*
post
	let	startDate = min(date1)(date2),
		endDate = max(date1)(date2)	in
	let setOfTheDayOfTheWeek = {day | day : Date & nameOfDayOfTheWeek = getNameOfDayOfTheWeek(day )}  in
	forall Date0, Date1  in set setOfTheDayOfTheWeek &
		startDate.LE(Date0) and Date0.LE(Date1) and Date1.LE(endDate) =>
			diffOfDates(Date1, Date0) mod 7 = 0 and 
	exists1 日i  in set setOfTheDayOfTheWeek &
		diffOfDates(日i, startDate) < 6 and
		exists1 日j  in set setOfTheDayOfTheWeek &
			diffOfDates(endDate, 日j) < 6 and
			diffOfDates(日j, 日i) = 7 * ((card setOfTheDayOfTheWeek) - 1)
*/
		;
/*
Following Japanese statement are the refinement proof by Shin Sahara and Mr. Toshiharu Yamazaki.
以下は、上記関数の山崎利治さんによる段階的洗練を佐原が「翻訳」した記述

pre
type R = {|rng [n → n / 7 | n∈Int]|} 	-- 7で割った商の集合
f, t∈Int, w∈R, 0≦f≦t,
h: Int → R 		--環準同型（ring homomorphism）

post
S = dom h(w) ∩ {f..t}・RESULT ≡ card(S) 	-- RESULTが答え （dom h(w)≡h-1(w)）

--整数系を環（ring）と見て、その商環（quotient ring）への準同型写像があり、その代数系上で事後条件を満たすプログラムを作る
I =｛f..t}
d = t - f + 1 	-- = card(I)
q = d / 7
r = d \ 7 		--7で割った余り

とすると、

q ≦ A ≦ q+1

が成り立つ。なぜなら、

任意の連続する７日間には、必ずw曜日がちょうど１日存在する。
card(I) = 7×q + r (0≦r＜7)であるから、Iには少なくともq個の連続する７日間が存在するが、q+1個は存在しない。
余りのr日間にw曜日が存在するかも知れない。

次に、

x ++ y = (x + y) \ 7
x ┴ y = max(x - y, 0)
として、

T = {h(f)..h(f) ++ (r ┴ 1)}
を考える。Tは余りr日間の曜日に対応する（card(T) = r）。
すると、

A ≡ if w∈T then q + 1 els q end

ここで、

x minus y = if x ≧ y then x - y els x - y + 7 end
とすれば、

w∈T ⇔ (w minus h(f)) + 1 ≦ r
である。なぜならば

w∈T	⇔ {0..(r ┴ 1)}∋wﾕ = w minus h(f)
	⇔ r ┴ 1 ≧ wﾕ
	⇔ r ≧ (w minus h(f)) + 1

従って、プログラムは以下のようになる。

A(f, t w)≡
	let
		d ≡ t - f + 1
		q ≡ d / 7
		r ≡ d \ 7
		delta ≡ if (w minus h(f)) + 1 ≦ r then 1 els 0 end
		x minus y ≡ if x ≧ y then x - y els x - y + 7 end
	in
		q + delta
	end
*/

private subtractDayOfTheWeek: int * int -> int
subtractDayOfTheWeek(x,y) == if x >= y then x - y else x - y + daysInWeek;

--dateから、そのdateの属するyearを求める。
public Year: Date -> int
Year(date) ==
if monthAux(date) < correctedMonths then
		yearAux(date) - calculationCoefficientOfYear
	else
		yearAux(date) - calculationCoefficientOfYear + 1;
		
--dateから、そのdateの属するmonthを求める。
public Month: Date -> int
Month(date) == if monthAux(date) < correctedMonths then
		monthAux(date) - 1
	else
		monthAux(date) - 13;
		
--dateから、dayを求める。
public day: Date -> int
day(date) == daysFromTheBeginningOfTheMonth(date);

--new Date().daysFromNewYear(getDateFrom_yyyy_mm_dd(2001,12,31)) = 365
public daysFromNewYear: Date -> int
daysFromNewYear(date) == 
	let	firstDateOfYear = getDateFrom_yyyy_mm_dd(Year(date), 1, 0)
	in	diffOfDates(date,firstDateOfYear);

daysFromTheBeginningOfTheMonth: Date -> int
daysFromTheBeginningOfTheMonth(date) == floor(daysFromTheBeginningOfTheMonthAsReal(date));

daysFromTheBeginningOfTheMonthAsReal: Date -> real
daysFromTheBeginningOfTheMonthAsReal(date) == yyyymmddModifyAux(date) + calculationCoefficientOfDate
- floor(daysInYear * yearAux(date)) - floor(averageDaysInMonth * monthAux(date)); 

monthAux: Date -> int
monthAux(date) ==
	floor((yyyymmddModifyAux(date) + calculationCoefficientOfDate - floor(daysInYear * yearAux(date))) / averageDaysInMonth);

yyyymmddModifyAux: Date -> real
yyyymmddModifyAux(date) == 
	let	julianDate = mjd2Jd(date.getModifiedJulianDate()),
		century =  floor((julianDate + centuryCalculationCoefficient) / 36524.25)
	in	
		if julianDate > theDayBeforeGregorioCalendarStarted then
			julianDate + centuryCalculationCoefficient + century - century div 4 + 0.5
		else
			julianDate + 32082.9 + 0.5;

yearAux: Date -> int
yearAux(date) == floor (yyyymmddModifyAux(date) / daysInYear);

public getVernalEquinoxOnGMT: int -> Date
getVernalEquinoxOnGMT(year) ==
	let	y = year / 1000.0	in
	modifiedJulianDate2Date(
		julianDate2ModifiedJulianDate(1721139.2855 + 365.2421376 * year + y * y *  (0.067919 - 0.0027879 * y)));
	
public getSummerSolsticeOnGMT: int -> Date
getSummerSolsticeOnGMT(year) ==
	let	y = year / 1000.0	in
	modifiedJulianDate2Date(
		julianDate2ModifiedJulianDate(1721233.2486 + 365.2417284 * year - y * y * (0.053018 - 0.009332 * y)));	
	 
public getAutumnalEquinoxOnGMT: int -> Date
getAutumnalEquinoxOnGMT(year) ==
	let	y = year / 1000.0	in
	modifiedJulianDate2Date(
		julianDate2ModifiedJulianDate (1721325.6978 + 365.2425055 * year - y * y * (0.126689 - 0.0019401 * y)));

public getWinterSolsticeOnGMT: int -> Date
getWinterSolsticeOnGMT(year) ==
	let	y = year / 1000.0	in
	modifiedJulianDate2Date(
		julianDate2ModifiedJulianDate(1721414.392 + 365.2428898 * year - y * y * (0.010965 - 0.0084855 * y)));


  public getVernalEquinox : int -> Date
 getVernalEquinox(year) == getDateInStandardTime(getVernalEquinoxOnGMT(year));
 
 public getSummerSolstice : int -> Date
 getSummerSolstice(year) == getDateInStandardTime(getSummerSolsticeOnGMT(year));
 
 public getAutumnalEquinox : int -> Date
 getAutumnalEquinox(year) == getDateInStandardTime(getAutumnalEquinoxOnGMT(year));
 
 -- Now, I can't get the right Winter Solstice in leap year
 public getWinterSolstice : int -> Date
 getWinterSolstice(year) == getDateInStandardTime(getWinterSolsticeOnGMT(year));


----calculation

public dateAdding: Date * int -> Date
dateAdding(date,addNumOfDays) == date.plus(addNumOfDays);

public diffOfDates: Date * Date -> int
diffOfDates(date1,date2) == floor(date1.getModifiedJulianDate() - date2.getModifiedJulianDate());

--dateからnumOfDaysを減算したdateを返す
public dateSubtracting: Date * int -> Date
dateSubtracting(date,subtractNumOfDays) == date.minus(subtractNumOfDays);

----Conversion

public mjd2Jd: real -> real
mjd2Jd(modifiedJulianDate) == modifiedJulianDate + daysDifferenceOfModifiedJulianDate;

public julianDate2ModifiedJulianDate: real -> real
julianDate2ModifiedJulianDate(julianDate) == julianDate - daysDifferenceOfModifiedJulianDate;

--yyyymmddを通常の値の範囲内に変換する。
--new Calendar().getRegularDate(2003, 14, 29) = getDateFrom_yyyy_mm_dd(2004, 2, 29)
public getRegularDate : int * int * int -> Date
getRegularDate(candidateYear, candidateOfMonth, candidateDate) ==
	let	mk_(year, month) = getRegularMonth(candidateYear, candidateOfMonth)
	in
	getDateFrom_yyyy_mm_dd(year, month, candidateDate);

--年月を通常の値の範囲内に変換する。
public getRegularMonth : int * int -> int * int
getRegularMonth(candidateYear, candidateOfMonth) ==
	let	year = 
			if candidateOfMonth <= 0 then
				candidateYear + (candidateOfMonth - 12) div monthsInYear
			else
				candidateYear + (candidateOfMonth - 1) div monthsInYear,
		candidateOfMonth2 = candidateOfMonth mod monthsInYear,
		month = 
			if candidateOfMonth2 = 0 then
				12
			else
				candidateOfMonth2
	in
	mk_(year, month);
	
	
--（整数三つ組の）date2Year(2001,7,1) = 2001.5
public date2Year:  int * int * int
	-> 
	real	--dateをYear(実数)に変換した値
date2Year(year, month, day) == year + (month - 1) / monthsInYear + (day - 1.0) / daysInYear;

public date2Str : Date +> seq of char
date2Str(date) == date.date2Str();

public convertDateFromString : seq of char +> [Date]
convertDateFromString(dateStr) == 
	let	date = getDateFromString(dateStr)
   	in	if date = false then nil
   		else date;

--以下は、休日の考慮をした機能で、サブクラスで休日の集合を定義する必要がある。

/* Query */
--２つのdateの間の休日の集合を返す。日曜日である休日も含むが、休日でない日曜日は含まない。
public getSetOfDayOffBetweenDates : Date * Date -> set of Date
getSetOfDayOffBetweenDates(date1,date2) ==
	let	Date1 = min(date1)(date2),
		Date2 = max(date1)(date2),
		setOfYear = {Year(Date1),...,Year(Date2)},
		setOfDayOff = dunion {getSetOfDayOff(year) | year in set setOfYear}
	in
	{dayOff | dayOff in set setOfDayOff & date1.LE(dayOff) and dayOff.LE(date2)};

--２つのdateの間の休日の数を返す。日曜日である休日も含むが、休日でない日dayOfWeekは含まない。
public getDayOffsExceptSunday: Date * Date -> int
getDayOffsExceptSunday(date1,date2) == card (getSetOfDayOffBetweenDates(date1,date2));

--２つのdateの間の休日あるいは日曜日の数を返す（startDateを含む）
public getTheNumberOfDayOff: Date * Date -> int
getTheNumberOfDayOff(date1,date2) ==
	let	Date1 = min(date1)(date2),
		Date2 = max(date1)(date2),
		numberOfSunday = getNumberOfTheDayOfWeek(Date1,Date2,<Sun>)	in
	numberOfSunday + card getSetOfNotSundayDayOff(Date1,Date2);

--２つのdateの間の休日あるいは日曜日の数を返す（startDateを含まない）
public getTheNumberOfDayOffExceptStartDate: Date * Date -> int
getTheNumberOfDayOffExceptStartDate(date1,date2) ==
	let	Date1 = min(date1)(date2),
		Date2 = max(date1)(date2)	in
	getTheNumberOfDayOff(Date1.plus( 1), Date2);

private getSetOfNotSundayDayOff : Date * Date -> set of Date
getSetOfNotSundayDayOff(date1,date2) ==
	let	setOfDayOff = getSetOfDayOffBetweenDates(date1,date2)	in
	{dayOff | dayOff in set setOfDayOff & not isSunday(dayOff)};

--日曜日である休日の集合を返す
public getDayOffsAndSunday : Date * Date -> set of Date
getDayOffsAndSunday(date1,date2) == 
	let	setOfDayOff = getSetOfDayOffBetweenDates(date1,date2)	in
	{dayOff | dayOff in set setOfDayOff & isSunday(dayOff)};

/* Conversion */

--休日でないdateを返す（未来へ向かって探索する）
public getFutureWeekday : Date-> Date
getFutureWeekday(date) ==
	cases  isSundayOrDayoff(date) or isSaturday(date):
		(true)	-> getFutureWeekday(date.plus( 1)),
		others	-> date
	end;

--休日でないdateを返す（過去へ向かって探索する）
public getPastWeekday : Date-> Date
getPastWeekday(date) ==
	cases   isSundayOrDayoff(date) or isSaturday(date):
		(true)	-> getPastWeekday (date.minus(1)),
		others	-> date
	end
	measure getPastWeekdaymeasure;

getPastWeekdaymeasure : Date +> nat
getPastWeekdaymeasure(d) == d.getModifiedJulianDate();

--与えられた平日に、平日n日分を加算する
public addWeekday : Date * int -> Date
addWeekday(date,addNumOfDays) == addWeekdayAux(getFutureWeekday(date),addNumOfDays);

public addWeekdayAux : Date * int -> Date
addWeekdayAux(date,addNumOfDays) ==
	cases isSundayOrDayoff(date) or isSaturday(date):
		(true)	-> addWeekdayAux(date.plus(1),addNumOfDays),
		others	->
					if addNumOfDays <= 0 then
						date
					else
						addWeekdayAux(date.plus(1), addNumOfDays-1)
	end;

--与えられた平日に、平日n日分を減算する
public subtractWeekday : Date * int -> Date
subtractWeekday(date,subtractNumOfDays) == subtractWeekdayAux(getPastWeekday(date),subtractNumOfDays);

public subtractWeekdayAux : Date * int -> Date
subtractWeekdayAux(date,subtractNumOfDays) ==
	cases isSundayOrDayoff(date) or isSaturday(date):
		(true)	-> subtractWeekdayAux(date.minus(1),subtractNumOfDays),
		others	->
					if subtractNumOfDays <= 0 then
						date
					else
						subtractWeekdayAux(date.minus(1), subtractNumOfDays-1)
	end;

/* Query */

public isDayOff : Date -> bool 
isDayOff(date) == 
	let	setOfDayOff = {d.getModifiedJulianDate() | d in set getSetOfDayOff(date.Year())}	in
	date.getModifiedJulianDate() in set setOfDayOff;
	
public isSundayOrDayoff : Date -> bool
isSundayOrDayoff(date) ==  isSunday(date) or isDayOff(date);

public isInDateSet :  Date * set of Date -> bool
isInDateSet(date, aNationalHolidaySet) == (
	let holidaySetByModifiedJulianDate = {floor d.getModifiedJulianDate() | d in set aNationalHolidaySet}
	in
	date.getModifiedJulianDate() in set holidaySetByModifiedJulianDate
  );

operations

public modifiedJulianDate2Date: real ==> Date
modifiedJulianDate2Date(modifiedJulianDate) == 
	return new Date(self,modifiedJulianDate);
	
public getDateFrom_yyyy_mm_dd: int * int * int  ==> Date
getDateFrom_yyyy_mm_dd(year, month, day) ==
	let	[y,m] = if (month > correctedMonths - monthsInYear) then
			[year + calculationCoefficientOfYear , month + 1]
		else
			[year + calculationCoefficientOfYear - 1 , month + correctedMonths - 1],
		century = y div yearInCentury,
	 	centuryCoefficient =		if (date2Year(year, month, day) > theFirstDayOfGregorioCalendar) then
						century div 4 - century - 32167.0
					else
						-32205.0,
		haldDay = 0.5	
	in
	return 
		modifiedJulianDate2Date(floor(daysInYear * y) + 
		floor(averageDaysInMonth * m) + day + centuryCoefficient - haldDay - daysDifferenceOfModifiedJulianDate);

public getDateFromString :
	seq of char	--yyyymmdd
	==>
	Date | bool	-- if not date then false
getDateFromString(yyyymmdd) ==
	(if not String`isDigits(yyyymmdd) then
		return false;
	let	yyyymmddByInt = String`asInteger(yyyymmdd),
		year = yyyymmddByInt div 10000,
		mmddByInt = yyyymmddByInt mod 10000,
		month =  mmddByInt div 100,
		day =  mmddByInt mod 100
	in
		if getDateFrom_yyyy_mm_dd(year,month,day).date2Str() = yyyymmdd then
			return getDateFrom_yyyy_mm_dd(year,month,day)
		else
			return false
	);

public getDateInStandardTime : Date ==> Date	
getDateInStandardTime(date) == 
	return modifiedJulianDate2Date (date.getModifiedJulianDate() + date.calendar().getDifferenceWithGMT());	

public getDayOfTheWeekInYear : int * NameOfDayOfTheWeek ==> set of Date
getDayOfTheWeekInYear(year,dayOfWeek) ==
	(
	dcl	aSetOfTheDayOfWeek : set of Date := {},
		date : Date := self.getNthDayOfTheWeek(year,1,1,dayOfWeek);
	while date.LE(self.lastDayOfTheWeekInMonth(year,12,dayOfWeek)) do (
		 aSetOfTheDayOfWeek :=  aSetOfTheDayOfWeek union {date};
		date := date.plus(7)
	);
	return aSetOfTheDayOfWeek
	);

public getDifferenceWithGMT : () ==> real
getDifferenceWithGMT() == return differenceWithGMT;

public setDifferenceWithGMT : (real) ==> ()
setDifferenceWithGMT(diff) == differenceWithGMT := diff;

public setTheSetOfDayOffs: int ==> ()
setTheSetOfDayOffs(-) == is subclass responsibility;
	
public getSetOfDayOff: int ==> set of Date 
getSetOfDayOff(aYear) == 
	(
	if not aYear in set dom Year2Holidays then
		self.setTheSetOfDayOffs(aYear);
	return self.Year2Holidays(aYear)
	);
	
--read todayfrom a file
public readToday : seq of char ==> [Date]
readToday(fname) ==
	let	mk_(r, mk_(y, m, d)) = io.freadval[int * int * int](fname)
	in
	if r then
		return getDateFrom_yyyy_mm_dd(y,m,d)
	else
		let	- = io.echo("Can't read today's data file.")
		in
		return nil;

--stub functions for getting today
public today: () ==> Date
today() == 
	if iToday = nil then
		return readToday(homedir ^ "/temp/Today.txt")	
	else
		return iToday;

--todayのdateを指定したreadFromFile。
public readFromFiletoday: seq of char ==> Date
readFromFiletoday(fname) == 
	if iToday = nil then
		return readToday(fname)	
	else
		return iToday;

public setToday : Date ==> ()
setToday(date) == iToday := date;
	
end Calendar
~~~
{% endraw %}

### CalendarT.vdmpp

{% raw %}
~~~
class CalendarT is subclass of TestDriver 
functions
public tests : () -> seq of TestCase
tests() == 
	[
	new CalendarT12(),
	new CalendarT11(),
	new CalendarT10(),
	new CalendarT09(),
	--new CalendarT08(), --deleted
	new CalendarT07(),
	new CalendarT06(),
	new CalendarT05(),
	new CalendarT03(),
	new CalendarT02(), 
	new CalendarT01(),
	new CalendarT04()
	];
end CalendarT

class CalendarT01 is subclass of TestCase
operations 
protected test: () ==> bool
	test() == 
		let	jc = new JapaneseCalendar()	in
	(
	jc.setToday(jc.getDateFrom_yyyy_mm_dd(2001,9,12));
	return
		jc.getDateFrom_yyyy_mm_dd(2003, 3, 0).asString() = "20030228" and
		jc.getDateFrom_yyyy_mm_dd(2003, 2, 29).asString() = "20030301" and
		jc.getDateFrom_yyyy_mm_dd(2004, 3, 0).asString() = "20040229" and
		jc.getDateFrom_yyyy_mm_dd(2004, 2, 30).asString() = "20040301" and
		jc.getDateFrom_yyyy_mm_dd(2004, 1, 60).asString() = "20040229" and
		jc.getDateFrom_yyyy_mm_dd(2004, 1, 61).asString() = "20040301" and
		jc.getDateFrom_yyyy_mm_dd(2001,5,1).get_yyyy_mm_dd() = mk_(2001,5,1) and
		jc.getYyyymmdd(jc.today()) = mk_(2001,9,12) and
		jc.modifiedJulianDate2Date(jc.julianDate2ModifiedJulianDate(2299160)).get_yyyy_mm_dd() = mk_(1582,10,4)  and	--theDayBeforeGregorioCalendarStarted
		jc.modifiedJulianDate2Date(jc.julianDate2ModifiedJulianDate(2299160)).plus(1).get_yyyy_mm_dd() = mk_(1582,10,15) and	--theFirstDayOfGregorioCalendar
		jc.date2Str(jc.getDateFromString("20010711")) = "20010711" and
		jc.convertDateFromString("saharashin") = nil and
		JapaneseCalendar`getJapaneseDateStr(jc.getDateFrom_yyyy_mm_dd(2001,5,1)) = "13 5 1" and
		jc.getAutumnalEquinox(2001).EQ(jc.getDateFrom_yyyy_mm_dd(2001,9,23)) = true
	)
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT01:\tMake date.";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT01

class CalendarT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar()	in
	return
		jc.dateAdding(jc.getDateFrom_yyyy_mm_dd(2001,5,1),3) .date2Str() = "20010504" and
		jc.diffOfDates(jc.getDateFrom_yyyy_mm_dd(2001,5,8),jc.getDateFrom_yyyy_mm_dd(2001,5,1)) = 7 and
		jc.dateSubtracting(jc.getDateFrom_yyyy_mm_dd(2001,5,1),1) .get_yyyy_mm_dd() = mk_(2001,4,30)
;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT02:\tAddition and subtraction of date.";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT02

class CalendarT03 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar()	in
	return
		jc.getVernalEquinox(2001).date2Str() = "20010320" and
		jc.getSummerSolstice(2001).date2Str() = "20010621" and
		jc.getAutumnalEquinox(2001).date2Str() = "20010923" and
		jc.getWinterSolstice(2001).date2Str() = "20011222" and
		jc.getVernalEquinox(2999).date2Str() = "29990320" and
		jc.getSummerSolstice(2999).date2Str() = "29990620" and
		jc.getAutumnalEquinox(2999).date2Str() = "29990922" and
		jc.getWinterSolstice(2999).date2Str() = "29991222" and
		--jc.getWinterSolstice(2008).date2Str() = "20081221" and -- error in leap year
		jc.getWinterSolstice(2007).date2Str() = "20071222" and
		jc.getWinterSolstice(2012).date2Str() = "20121221" and
		jc.getWinterSolstice(2016).date2Str() = "20161221" 
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT03:\tCalculation of Vernal Equinox, Summer Solstice, Autumnal Equinox, Winter Solstice.";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT03

class CalendarT04 is subclass of TestCase
operations 
public test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		setOfDayOffIn2009 = jc.getSetOfDayOff(2009),
		setOfDayOff = jc.getSetOfDayOff(2001),
		setOfDayOff2003 = jc.getSetOfDayOff(2003),
		d0401 = jc.getDateFromString("20010401"),
		d0408 = jc.getDateFromString("20010408"),
		d0430 = jc.getDateFromString("20010430"),
		setOfDayOffBy_yyyy_mm_dd =  {jc.getYyyymmdd(dayOff) | dayOff in set setOfDayOff},
		setOfDayOffBy_yyyy_mm_dd2003 =  {jc.getYyyymmdd(dayOff) | dayOff in set setOfDayOff2003},
		setOfDayOffBy_yyyy_mm_ddIn2009 =  {jc.getYyyymmdd(dayOff) | dayOff in set setOfDayOffIn2009}
		in
	return
		setOfDayOffBy_yyyy_mm_dd = 
			{ mk_( 2001,1,1 ),
  			mk_( 2001,1,8 ),
			mk_( 2001,2,11 ),
 			mk_( 2001,2,12 ),
  			mk_( 2001,3,20 ),
 			mk_( 2001,4,29 ),
  			mk_( 2001,4,30 ),
  			mk_( 2001,5,3 ),
  			mk_( 2001,5,4 ),
  			mk_( 2001,5,5 ),
 			mk_( 2001,7,20 ),
  			mk_( 2001,9,15 ),
			mk_( 2001,9,23 ),
  			mk_( 2001,9,24 ),
  			mk_( 2001,10,8 ),
  			mk_( 2001,11,3 ),
  			mk_( 2001,11,23 ),
  			mk_( 2001,12,23 ),
  			mk_( 2001,12,24 )
  			} and
  		setOfDayOffBy_yyyy_mm_dd2003 =
  			{ mk_( 2003,1,1 ),
			  mk_( 2003,1,13 ),
			  mk_( 2003,2,11 ),
			  mk_( 2003,3,21 ),
			  mk_( 2003,4,29 ),
			  mk_( 2003,5,3 ),
			  mk_( 2003,5,4 ),
			  mk_( 2003,5,5 ),
			  mk_( 2003,7,21 ),
			  mk_( 2003,9,15 ),
			  mk_( 2003,9,23 ),
			  mk_( 2003,10,13 ),
			  mk_( 2003,11,3 ),
			  mk_( 2003,11,23 ),
			  mk_( 2003,11,24 ),
 			  mk_( 2003,12,23 ) 
 			 } and
		setOfDayOffBy_yyyy_mm_ddIn2009 =
			  { mk_( 2009, 1, 1 ),
				mk_( 2009, 1, 12 ),
				mk_( 2009, 2, 11 ),
				mk_( 2009, 3, 20 ),
				mk_( 2009, 4, 29 ),
				mk_( 2009, 5, 3 ),
				mk_( 2009, 5, 4 ),
				mk_( 2009, 5, 5 ),
				mk_( 2009, 5,6 ),
				mk_( 2009, 7, 20 ),
				mk_( 2009, 9, 21 ),
  				mk_( 2009, 9, 22 ),
				mk_( 2009, 9, 23 ),
				mk_( 2009, 10, 12 ),
				mk_( 2009, 11, 3 ),
				mk_( 2009, 11, 23 ),
				mk_( 2009, 12, 23 ) } and
  		jc.getDayOffsExceptSunday(d0401,d0430)  = 2 and
  		card jc.getDayOffsAndSunday(d0401,d0430) = 1 and
  		jc.getDayOffsAndSunday(d0401,d0408) = {}
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT04:\tGet set of Day off.";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT04

class CalendarT05 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		d0711 = jc.getDateFromString("20010711")	in
	(
	jc.setToday(jc.getDateFrom_yyyy_mm_dd(2001,3,1));
	let	d0301 = jc.today()	in
	return
		d0711.EQ(jc.getDateFrom_yyyy_mm_dd(2001, 7, 11)) and
		jc.EQ(d0711,jc.getDateFrom_yyyy_mm_dd(2001, 7, 11)) and
		d0301.LT(d0711) and
		jc.LT(d0301, d0711) and
		d0711.GT(d0301) and
		jc.GT(d0711,d0301) and
		d0711.GE(d0711) and d0711.GE(d0301) and
		jc.GE(d0711,d0711)  and jc.GE(d0711,d0301) and
		d0711.LE(d0711) and d0301.LE(d0711) and
		jc.LE(d0711,d0711) and jc.LE(d0301,d0711) 
	)
;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT05:\tCompare date.";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT05

class CalendarT06 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		d10010301 = jc.getDateFromString("10010301"),
		d0711 = jc.getDateFromString("20010711")		in
	(
	let	d0301 = jc.today()	in
	return
		jc.firstDayOfTheWeekInMonth(2000,3,<Wed>).get_yyyy_mm_dd() = mk_( 2000,3,1 ) and
		jc.firstDayOfTheWeekInMonth(2001,7,<Sun>).get_yyyy_mm_dd() = mk_( 2001,7,1 ) and
		jc.lastDayOfTheWeekInMonth(2000,2,<Tue>).get_yyyy_mm_dd() = mk_( 2000,2,29 ) and
		jc.lastDayOfTheWeekInMonth(2001,7,<Sun>).get_yyyy_mm_dd() = mk_( 2001,7,29 ) and
		jc.getNthDayOfTheWeek(2001,7,5,<Sun>).get_yyyy_mm_dd() = mk_( 2001,7,29 ) and
		jc.getNthDayOfTheWeek(2001,7,6,<Sun>) = false and
		jc.getNumberOfTheDayOfWeek(d0711,d0301,<Sun>)  = 19 and
		jc.getNumberOfTheDayOfWeek(d0711,d10010301,<Sun>)  = 52196 and
		jc.getNumberOfDayOfTheWeekFromName(<Thu>) = 4 and
		jc.getNumberOfDayOfTheWeekFromName(<Fri>) = 5 and
		jc.getNumberOfDayOfTheWeekFromName(<Sat>) = 6 and
		jc.getNumberOfDayOfTheWeekFromName(<Sun>) = 0 
	)
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT06:\tGet day of the week.";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT06

class CalendarT07 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar()	in
	return
		jc.getDateFromString("sahara") = false and
		jc.getDateFromString("20011232") = false and
		jc.getDateFromString("20011231").date2Str() = "20011231"
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT07:\tgetDateFromString";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT07

class CalendarT09 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar()
	in
	return
		jc.today().EQ(jc.getDateFrom_yyyy_mm_dd(2001, 3, 1)) and
		jc.readFromFiletoday(homedir ^ "/temp/BaseDay.txt").EQ(jc.getDateFrom_yyyy_mm_dd(2003, 10, 24))
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT09:\tRead today datefrom a file.";
protected tearDown: () ==> ()
tearDown() == return;

end CalendarT09

class CalendarT10 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar()
	in
	return
		jc.getLastDayOfMonth(2004, 1).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 1, 31)) and
		jc.getLastDayOfMonth(2004, 2).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 2, 29)) and
		jc.getLastDayOfMonth(2004, 3).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 3, 31)) and
		jc.getLastDayOfMonth(2004, 4).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 4, 30)) and
		jc.getLastDayOfMonth(2004, 5).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 5, 31)) and
		jc.getLastDayOfMonth(2004, 6).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 6, 30)) and
		jc.getLastDayOfMonth(2004, 7).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 7, 31)) and
		jc.getLastDayOfMonth(2004, 8).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 8, 31)) and
		jc.getLastDayOfMonth(2004, 9).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 9, 30)) and
		jc.getLastDayOfMonth(2004, 10).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 10, 31)) and
		jc.getLastDayOfMonth(2004, 11).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 11, 30)) and
		jc.getLastDayOfMonth(2004, 12).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 12, 31)) and
		jc.getLastDayOfMonth(2003, 13).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 1, 31)) and
		jc.getLastDayOfMonth(2003, 8+6).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 2, 29)) and
		jc.getLastDayOfMonth(2003, 15).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 3, 31)) and
		jc.getLastDayOfMonth(2003, 16).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 4, 30)) and
		jc.getLastDayOfMonth(2003, 17).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 5, 31)) and
		jc.getLastDayOfMonth(2003, 18).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 6, 30)) and
		jc.getLastDayOfMonth(2003, 19).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 7, 31)) and
		jc.getLastDayOfMonth(2003, 20).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 8, 31)) and
		jc.getLastDayOfMonth(2003, 21).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 9, 30)) and
		jc.getLastDayOfMonth(2003, 22).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 10, 31)) and
		jc.getLastDayOfMonth(2003, 23).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 11, 30)) and
		jc.getLastDayOfMonth(2003, 24).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 12, 31)) and
		jc.getLastDayOfMonth(2005, 2).EQ(jc.getDateFrom_yyyy_mm_dd(2005, 2, 28))
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT10:\tGet the end of month.";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT10

class CalendarT11 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar()
	in
	return
		jc.getRegularDate(2004, 1, 1).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 1, 1)) and
		jc.getRegularDate(2003, 12, 32).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 1, 1)) and
		jc.getRegularDate(2003, 24, 32).EQ(jc.getDateFrom_yyyy_mm_dd(2005, 1, 1)) and
		jc.getRegularDate(2003, 13, 1).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 1, 1)) and
		jc.getRegularDate(2004, 1, 32).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 2, 1)) and
		jc.getRegularDate(2004, 2, 0).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 1, 31)) and
		jc.getRegularDate(2004, 2, 28).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 2, 28)) and
		jc.getRegularDate(2004, 2, 29).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 2, 29)) and
		jc.getRegularDate(2004, 3, 0).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 2, 29)) and
		jc.getRegularDate(2004, 3, -1).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 2, 28)) and
		jc.getRegularDate(2003, 2, 29).EQ(jc.getDateFrom_yyyy_mm_dd(2003, 3, 1)) and
		jc.getRegularDate(2004, 4, 1).EQ(jc.getDateFrom_yyyy_mm_dd(2004, 4, 1)) and
		jc.getRegularDate(2004, 0, 1).EQ(jc.getDateFrom_yyyy_mm_dd(2003, 12, 1)) and
		jc.getRegularDate(2004, -1, 1).EQ(jc.getDateFrom_yyyy_mm_dd(2003, 11, 1)) and
		jc.getRegularDate(2004, -10, 29).EQ(jc.getDateFrom_yyyy_mm_dd(2003, 3, 1)) and
		jc.getRegularDate(2004, -10, 28).EQ(jc.getDateFrom_yyyy_mm_dd(2003, 2, 28)) and
		jc.getRegularDate(2004, -11, 1).EQ(jc.getDateFrom_yyyy_mm_dd(2003, 1, 1)) and
		jc.getRegularDate(2004, -12, 1).EQ(jc.getDateFrom_yyyy_mm_dd(2002, 12, 1))
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT11:\tgetRegularDate";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT11

class CalendarT12 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar()
	in
	return
		jc.getRegularMonth(2004, 1) = mk_(2004, 1) and
		jc.getRegularMonth(2004, 2) = mk_(2004, 2) and
		jc.getRegularMonth(2004, 3) = mk_(2004, 3) and
		jc.getRegularMonth(2004, 4) = mk_(2004, 4) and
		jc.getRegularMonth(2004, 5) = mk_(2004, 5) and
		jc.getRegularMonth(2004, 6) = mk_(2004, 6) and
		jc.getRegularMonth(2004, 7) = mk_(2004, 7) and
		jc.getRegularMonth(2004, 8) = mk_(2004, 8) and
		jc.getRegularMonth(2004, 9) = mk_(2004, 9) and
		jc.getRegularMonth(2004, 10) = mk_(2004, 10) and
		jc.getRegularMonth(2004, 11) = mk_(2004, 11) and
		jc.getRegularMonth(2004, 12) = mk_(2004, 12) and
		jc.getRegularMonth(2004, 13) = mk_(2005, 1)  and
		jc.getRegularMonth(2004, 14) = mk_(2005, 2) and
		jc.getRegularMonth(2004, 24) = mk_(2005, 12) and
		jc.getRegularMonth(2004, 25) = mk_(2006, 1) and
		jc.getRegularMonth(2004, 0) = mk_(2003, 12) and
		jc.getRegularMonth(2004, -1) = mk_(2003, 11) and
		jc.getRegularMonth(2004, -10) = mk_(2003, 2) and
		jc.getRegularMonth(2004, -11) = mk_(2003, 1) and
		jc.getRegularMonth(2004, -12) = mk_(2002, 12) and
		jc.getRegularMonth(2004, -13) = mk_(2002, 11)
	;
protected setUp: () ==> ()
setUp() == TestName := "CalendarT12:\tgetRegularMonth";
protected tearDown: () ==> ()
tearDown() == return;
end CalendarT12
~~~
{% endraw %}

### Character.vdmpp

{% raw %}
~~~
class Character

values
--vNumEnglishChars = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
vNumOrderMap = 
	{'0' |-> 1, '1' |-> 2, '2' |-> 3, '3' |-> 4, '4' |-> 5, '5' |-> 6, '6' |-> 7, '7' |-> 8, '8' |-> 9, '9' |-> 10};

vChapitalCharOrderMap =
	{'A' |-> 12, 'B' |-> 14, 'C' |-> 16, 'D' |-> 18, 'E' |-> 20, 'F' |-> 22, 'G' |-> 24, 'H' |-> 26, 'I' |-> 28, 
	'J' |-> 30, 'K' |-> 32, 'L' |-> 34, 'M' |-> 36, 'N' |-> 38, 'O' |-> 40, 'P' |-> 42, 'Q' |-> 44, 'R' |-> 46,
	'S' |-> 48, 'T' |-> 50, 'U' |-> 52, 'V' |-> 54, 'W' |-> 56, 'X' |-> 58, 'Y' |-> 60, 'Z' |-> 62};

vSmallCharOrderMap =
	{'a' |-> 11, 'b' |-> 13, 'c' |-> 15, 'd' |-> 17, 'e' |-> 19, 'f' |-> 21, 'g' |-> 23, 'h' |-> 25, 'i' |-> 27,
	'j' |-> 29, 'k' |-> 31, 'l' |-> 33, 'm' |-> 35, 'n' |-> 37, 'o' |-> 39, 'p' |-> 41, 'q' |-> 43, 'r' |-> 45, 
	's' |-> 47, 't' |-> 49, 'u' |-> 51, 'v' |-> 53, 'w' |-> 55, 'x' |-> 57, 'y' |-> 59, 'z' |-> 61};

vCharOrderMap = vNumOrderMap munion vChapitalCharOrderMap munion vSmallCharOrderMap;

functions
/* Converted from vNumEnglishChars to vCharOrderMap
static public makeOrderMap : seq of char +> map char to nat
makeOrderMap(s) ==
	{s(i) |-> i | i in set inds s};
*/

static public asDigit: char -> int | bool
asDigit(c) ==
	if isDigit(c) then
		let s = [c] in
		let mk_(-, i) = VDMUtil`seq_of_char2val[int](s) in i
	else
		false;

static public asDictOrder : char -> int
asDictOrder(c) == 
	if c in set dom vCharOrderMap then
		vCharOrderMap(c)
	else
		let nonAsciiChar = 999999 in nonAsciiChar;

static public isDigit : char -> bool
isDigit(c) == c in set dom vNumOrderMap;

static public isLetter : char -> bool
isLetter(c) == c in set dom (vChapitalCharOrderMap munion vSmallCharOrderMap);

static public isLetterOrDigit : char -> bool
isLetterOrDigit(c) == isDigit(c) or isLetter(c);

static public isCapitalLetter : char -> bool
isCapitalLetter(c) == c in set dom vChapitalCharOrderMap;

static public isLowercaseLetter : char -> bool
isLowercaseLetter(c) == c in set dom vSmallCharOrderMap;

static public LT: char * char -> bool
LT(c1,c2) == Character`LT2(c1)(c2);

static public LT2: char -> char -> bool
LT2(c1)(c2) == Character`asDictOrder(c1) < Character`asDictOrder(c2);

static public LE : char * char -> bool
LE(c1, c2) == Character`LE2(c1)(c2);

static public LE2 : char -> char -> bool
LE2(c1)(c2) ==  Character`LT2(c1)(c2) or c1 = c2;

static public GT : char * char -> bool
GT(c1, c2) == Character`GT2(c1)(c2);

static public GT2 : char -> char -> bool
GT2(c1)(c2) == Character`LT2(c2)(c1);

static public GE : char * char -> bool
GE(c1, c2) == Character`GE2(c1)(c2);

static public GE2 : char -> char -> bool
GE2(c1)(c2) == not Character`LT2(c1)(c2);
			
end Character
~~~
{% endraw %}

### CommonDefinition.vdmpp

{% raw %}
~~~
class CommonDefinition is subclass of Object

/*
values
public StringOrder	= lambda x : seq of char , y : seq of char & String`LT(x,y);
public NumericOrder	= lambda x : NumericalValue, y : NumericalValue & x < y;
public DateOrder	= lambda x : Date, y : Date & x.LT(y);
public AmountOfMoneyOrder	= lambda x : AmountOfMoney, y : AmountOfMoney & x < y;
*/

functions
public StringOrder : seq of char * seq of char -> bool
StringOrder(x, y) == String`LT(x,y);

public NumericOrder : NumericalValue * NumericalValue -> bool
NumericOrder(x, y) == x < y;

public DateOrder : Date * Date -> bool
DateOrder(x, y) ==  x.LT(y);

public AmountOfMoneyOrder : AmountOfMoney * AmountOfMoney -> bool
AmountOfMoneyOrder(x, y) == x < y;
	
types
public Identifier = seq of char
inv - ==  forall s1, s2 : seq of char, id1, id2 : Identifier & id1 <> id2 => s1 <> s2;
public Quantity = int;
public NumericalValue = int;
public Percent = real
inv p == 0 <= p and p <= 100;
public AmountOfMoney = int;
public NonNegativeAmountOfMoney = nat;
public PositiveAmountOfMoney = nat1;
public AmountOfMoney2 = real
	inv am == new Real().isNDigitsAfterTheDecimalPoint(am,2) ;	-- 2 digits after the decimal point

end CommonDefinition
~~~
{% endraw %}

### Date.vdmpp

{% raw %}
~~~
class Date  is subclass of CalendarDefinition	-- date
/*
Responsibility
	I am a date of Gregorio Calendar.
Abstract
	I calculate date by cooperating with Calendar class.
	There can be two or more objects at the same date. 

Therefore, it is judged that the date is equal by using EQ operation. 
*/

instance variables

private ModifiedJulianDate : real := 0;
private usingCalendar : Calendar;

/*
ModifiedJulianDateは、julianDateでは数値が大きくなりすぎたので採用されたdateを表す数値で、1858年11月17日を0とする。
calculation誤差の関係から、2倍精度浮動小数点(Cではdouble)でなければならない。
*/

functions

----Query

public getNumberOfDayOfTheWeek: () -> Calendar`NumberOfDayOfTheWeek
getNumberOfDayOfTheWeek() == calendar().getNumberOfDayOfTheWeek(self);

public getNameOfDayOfTheWeek : () -> Calendar`NameOfDayOfTheWeek
getNameOfDayOfTheWeek() == calendar().getNameOfDayOfTheWeek(self) ;

--指定された曜日が、selfとdateの間に何日あるかを返す。 
public getNumberOfTheDayOfWeek: Date * Calendar`NameOfDayOfTheWeek -> int
getNumberOfTheDayOfWeek(date,nameOfDayOfTheWeek) == calendar().getNumberOfTheDayOfWeek(self,date,nameOfDayOfTheWeek);

--selfとdateの間の休日あるいは日曜日の数を返す（startDateを含む）
public getTheNumberOfDayOff: Date -> int
getTheNumberOfDayOff(date) == calendar().getTheNumberOfDayOff(self,date);

--selfとdateの間の休日あるいは日曜日の数を返す（startDateを含まない）
public getTheNumberOfDayOffExceptStartDate: Date -> int
getTheNumberOfDayOffExceptStartDate(date) == calendar().getTheNumberOfDayOffExceptStartDate(self,date) ;

--dateから、そのdateの属する年を求める。
public Year: () -> int
Year() == calendar().Year(self);
		
--dateから、そのdateの属する月を求める。
public Month: () -> int
Month() == calendar().Month(self);
		
--dateから、日を求める。
public day: () -> int
day() == calendar().day(self);

/* calculation  */

--休日でないdateを返す（未来へ向かって探索する）
public getFutureWeekday : ()-> Date
getFutureWeekday() == calendar().getFutureWeekday(self);

--休日でないdateを返す（過去へ向かって探索する）
public getPastWeekday : ()-> Date
getPastWeekday() == calendar().getPastWeekday(self);

--selfに、平日n日分を加算する
public addWeekday : int -> Date
addWeekday(addNumOfDays) == calendar().addWeekday(self,addNumOfDays);

--selfに、平日n日分を減算する
public subtractWeekday : int -> Date
subtractWeekday(subtractNumOfDays) == calendar().subtractWeekday(self,subtractNumOfDays) ;

/* checking */

public isSunday : () -> bool
isSunday() == calendar().isSunday(self);

public isSaturday : () -> bool
isSaturday() == calendar().isSaturday(self);

public isWeekday : () -> bool
isWeekday() == calendar().isWeekday(self);

public isNotDayOff : () -> bool
isNotDayOff() == calendar().isNotDayOff(self);

public isDayOff : () -> bool 
isDayOff() == calendar().isDayOff(self);

public isSundayOrDayoff : () -> bool 
isSundayOrDayoff() ==  calendar().isSundayOrDayoff(self);

--new Date().getDateFrom_yyyy_mm_dd(2001,12,31).daysFromNewYear() = 365
public daysFromNewYear: () -> int
daysFromNewYear() == calendar().daysFromNewYear(self);

/* conversion */

public get_yyyy_mm_dd: () -> int * int * int
get_yyyy_mm_dd() == mk_(self.Year(), self.Month(), self.day());

private toStringAux: int -> seq of char
toStringAux(i) == 
	let	str = Integer`asString	in
	if i >= 10 then str(i) else "0" ^ str(i);

public date2Str: () -> seq of char
date2Str() == self.asString();

operations

----conversion

public asString: () ==> seq of char
asString() ==
	(let	asString =Integer`asString,
		y = self.Year(),
		m = self.Month(),
		d = self.day(),
		yearStr = asString(y),
		monthStr = toStringAux(m),
		dateStr = toStringAux(d)
	in
		return yearStr ^ monthStr ^ dateStr
	);

public print: ()   ==> seq of char
print() ==
	(let	asString =Integer`asString,
		y = self.Year(),
		m = self.Month(),
		d = self.day(),
		yearStr = asString(y),
		monthStr = toStringAux(m),
		dateStr = toStringAux(d)
	in
		return "Year=" ^ yearStr ^ ", Month=" ^ monthStr ^ ", Day=" ^ dateStr ^ ", "
	);


----比較

/*
操作名
	大小比較を行う関数群。
引数
	date
返値
	真ならtrueを返し、そうでなければfalseを返す。
内容
	自身と与えられたdateの大小比較を行う。
*/
public LT: Date ==> bool
LT(date) == return floor self.getModifiedJulianDate() < floor date.getModifiedJulianDate();

public GT: Date ==> bool
GT(date) == return floor self.getModifiedJulianDate() > floor date.getModifiedJulianDate();

public LE: Date ==> bool
LE(date) == return not self.GT(date);

public GE: Date ==> bool
GE(date) == return not self.LT(date);

--自身と与えられたdateがEQか判定する。
public EQ: Date ==> bool	--等しければtrueを返し、そうでなければfalseを返す。
EQ(date) ==  return (floor self.getModifiedJulianDate() = floor date.getModifiedJulianDate());

--自身と与えられたdateが等しくないか判定する。
public NE: Date ==> bool	--等しければfalseを返し、そうでなければtrueを返す。
NE(date) ==  return (floor self.getModifiedJulianDate() <> floor date.getModifiedJulianDate());

----calculation

--自身にnumOfDaysを加算したdateを返す
public plus: int ==> Date
plus(addNumOfDays) == return calendar().modifiedJulianDate2Date(self.getModifiedJulianDate() + addNumOfDays) ;

--自身からnumOfDaysを減算したdateを返す
public minus: int ==> Date
minus(subtractNumOfDays) == return calendar().modifiedJulianDate2Date(self.getModifiedJulianDate() - subtractNumOfDays) ;

--インスタンス変数へのアクセス操作

--ModifiedJulianDate
public setModifiedJulianDate: real ==> ()
setModifiedJulianDate(r) == ModifiedJulianDate := r;

public getModifiedJulianDate: () ==> real
getModifiedJulianDate() == return ModifiedJulianDate;

public calendar : () ==> Calendar
calendar() == return usingCalendar;

--Constructor
public Date : Calendar * real ==> Date
Date(aCal, aModifiedJulianDate) == 
	(
	usingCalendar := aCal;
	setModifiedJulianDate(aModifiedJulianDate);
	return self
	);

end Date
~~~
{% endraw %}

### DateT.vdmpp

{% raw %}
~~~
class DateT is subclass of TestDriver 
functions
public tests : () -> seq of TestCase
tests() == 
	[ new DateT01(), new DateT02(), new DateT03(), 
	new DateT04(),
	new DateT05(), new DateT06(),new DateT07()
	];
end DateT

class DateT01 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		d = jc.getDateFrom_yyyy_mm_dd(2001,5,1)	,
		d1 = jc.getDateFrom_yyyy_mm_dd(2001,4,29),
		d2 = jc.getDateFrom_yyyy_mm_dd(2001,4,28)
	in
	return
		d.getNumberOfDayOfTheWeek() = jc.getNumberOfDayOfTheWeekFromName(<Tue>) and
		d.getNameOfDayOfTheWeek() = <Tue> and
		d1.getNameOfDayOfTheWeek() = <Sun> and
		d2.getNameOfDayOfTheWeek() = <Sat> and
		d.isSunday() = false and
		d.isSaturday() = false and
		d.isWeekday() = true and
		d.isDayOff() = false and 
		d.isNotDayOff() = true and
		d.isSundayOrDayoff()  = false
	;
protected setUp: () ==> ()
setUp() == TestName := "DateT01:\tCalculate the day of the week.";
protected tearDown: () ==> ()
tearDown() == return;
end DateT01

class DateT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		d = jc.getDateFrom_yyyy_mm_dd(2001,5,1)		in
	return
		d.get_yyyy_mm_dd() = mk_(2001,5,1) and
		d.date2Str() = "20010501" and
		d.asString() = "20010501" and
		d.print() = "Year=2001, Month=05, Day=01, "
	;
protected setUp: () ==> ()
setUp() == TestName := "DateT02:\tConvert date.";
protected tearDown: () ==> ()
tearDown() == return;
end DateT02

class DateT03 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		d20000101 = jc.getDateFromString("20000101"),
		d0301 = jc.getDateFromString("20010301"),
		d0501 = jc.getDateFromString("20010501"),
		d0711 = jc.getDateFrom_yyyy_mm_dd(2001,7,11)	in
	return
		d0301.getTheNumberOfDayOff(d0711)  = 24 and
		d0501.getTheNumberOfDayOffExceptStartDate(d0711) = 13 and
		d20000101.getTheNumberOfDayOff(d0711)  = 103
	;
protected setUp: () ==> ()
setUp() == TestName := "DateT03:\tgetTheNumberOfDayOff";
protected tearDown: () ==> ()
tearDown() == return;
end DateT03

class DateT04 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		d20001231 = jc.getDateFrom_yyyy_mm_dd(2000,12,31),
		d1231 = jc.getDateFrom_yyyy_mm_dd(2001,12,31),
		d0626 = jc.getDateFrom_yyyy_mm_dd(2001,6,26),
		d0501 = jc.getDateFromString("20010501"),
		d0505 = jc.getDateFromString("20010505"),
		d0502 = jc.getDateFrom_yyyy_mm_dd(2001,5,2)		in
	return
		d0502.addWeekday(1).getFutureWeekday().date2Str() = "20010507" and
		d0502.getPastWeekday().subtractWeekday(1).date2Str() = "20010501" and
		d0501.getPastWeekday().subtractWeekday(1).date2Str() = "20010427" and
		d0501.getFutureWeekday().date2Str() = "20010501" and
		d0501.addWeekday(2).date2Str() = "20010507" and
		d0502.subtractWeekday(2).date2Str() = "20010427" and
		d1231.daysFromNewYear() = 365 and
		d20001231.daysFromNewYear() = 366 and
		d0501.getNumberOfTheDayOfWeek(d0626,<Tue>) = 9 and
		jc.getFutureWeekday(d0505).date2Str() = "20010507" and
		jc.getFutureWeekday(d0501).date2Str() = "20010501" and
		jc.getPastWeekday(d0501).date2Str() = "20010501" and
		jc.getPastWeekday(d0505).date2Str() = "20010502" 
	;
protected setUp: () ==> ()
setUp() == TestName := "DateT04:\tCalculate date.";
protected tearDown: () ==> ()
tearDown() == return;
end DateT04

class DateT05 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		d0711 = jc.getDateFromString("20010711")	in
	(
	jc.setToday(jc.getDateFrom_yyyy_mm_dd(2001, 3, 1));
	let	d0301 = jc.today()	in
	return
		d0711.EQ(jc.getDateFrom_yyyy_mm_dd(2001, 7, 11)) and
		d0711.NE(jc.getDateFrom_yyyy_mm_dd(2001, 7, 12)) and
		jc.EQ(d0711,jc.getDateFrom_yyyy_mm_dd(2001, 7, 11)) and
		d0301.LT(d0711) and
		jc.LT(d0301, d0711) and
		d0711.GT(d0301) and
		jc.GT(d0711,d0301) and
		d0711.GE(d0711) and d0711.GE(d0301) and
		jc.GE(d0711,d0711)  and jc.GE(d0711,d0301) and
		d0711.LE(d0711) and d0301.LE(d0711) and
		jc.LE(d0711,d0711) and jc.LE(d0301,d0711)
	);
protected setUp: () ==> ()
setUp() == TestName := "DateT05:\tCompare date.date";
protected tearDown: () ==> ()
tearDown() == return;
end DateT05

class DateT06 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar(),
		d10010301 = jc.getDateFromString("10010301"),
		d0711 = jc.getDateFromString("20010711")	in
	(
	jc.setToday(jc.getDateFrom_yyyy_mm_dd(2001, 3, 1));
	let	d0301 = jc.today()		in
	return
		jc.firstDayOfTheWeekInMonth(2000,3,<Wed>).get_yyyy_mm_dd() = mk_( 2000,3,1 ) and
		jc.firstDayOfTheWeekInMonth(2001,7,<Sun>).get_yyyy_mm_dd() = mk_( 2001,7,1 ) and
		jc.lastDayOfTheWeekInMonth(2000,2,<Tue>).get_yyyy_mm_dd() = mk_( 2000,2,29 ) and
		jc.lastDayOfTheWeekInMonth(2001,7,<Sun>).get_yyyy_mm_dd() = mk_( 2001,7,29 ) and
		jc.getNthDayOfTheWeek(2001,7,5,<Sun>).get_yyyy_mm_dd() = mk_( 2001,7,29 ) and
		jc.getNthDayOfTheWeek(2001,7,6,<Sun>) = false and
		jc.getNumberOfTheDayOfWeek(d0711,d0301,<Sun>)  = 19 and
		jc.getNumberOfTheDayOfWeek(d0711,d10010301,<Sun>)  = 52196	
	);
protected setUp: () ==> ()
setUp() == TestName := "DateT06:\tGet the day of the week.";
protected tearDown: () ==> ()
tearDown() == return;
end DateT06

class DateT07 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	jc = new JapaneseCalendar()	in
	return
		jc.isLeapYear(2000) = true and
		jc.isLeapYear(2001) = false and
		jc.isLeapYear(1996) = true and
		jc.isLeapYear(1900) = false and
		jc.isLeapYear(1600) = true and
		jc.isDateString("sahara") = false and
		jc.isDateString("20010723") = true and
		jc.isDateString("20011232") = false and
		jc.isWeekday(<Mon>) = true and
		jc.isWeekday(<Tue>) = true and
		jc.isWeekday(<Wed>) = true and
		jc.isWeekday(<Thu>) = true and
		jc.isWeekday(<Fri>) = true and
		jc.isWeekday(<Sat>) = false and
		jc.isWeekday(<Sun>) = false and
		jc.date2Str(jc.getLastDayOfMonth(2000,2)) = "20000229" and
		jc.date2Str(jc.getLastDayOfMonth(2001,2)) = "20010228"
	;
protected setUp: () ==> ()
setUp() == TestName := "DateT07:\tQuery about date.date";
protected tearDown: () ==> ()
tearDown() == return;
end DateT07
~~~
{% endraw %}

### DoubleListQueue.vdmpp

{% raw %}
~~~
/*   
 * Queue using 2 sequences.
 * Usage:
 *	make empty queue as following:
 * 		let Q0 = DoubleListQueue`empty[int]() in ...
 *	
 *	append an element to queue:
 *		DoubleListQueue`enQueue(1, Q0)
 *	
*/

class DoubleListQueue

functions
static public empty[@T] : () -> seq of @T * seq of @T
empty() == mk_([], []);

static public isEmpty[@T] : (seq of @T * seq of @T) -> bool
isEmpty(s) == s = mk_([], []);

static public enQueue[@T] : @T * (seq of @T * seq of @T) -> seq of @T * seq of @T
enQueue(anElem, mk_(aHeads, aTails)) == mk_(aHeads, [anElem] ^ aTails);

static public deQueue[@T] : (seq of @T * seq of @T) -> [seq of @T * seq of @T]
deQueue(mk_(aHeads, aTails)) == 
	cases aHeads:
		[-] ^ aTailsOfHeads	-> mk_(aTailsOfHeads, aTails),
		[]	-> 
			cases aTails:
				[]		-> nil,
				others	-> mk_(tl Sequence`freverse[@T](aTails), [])
			end
	end;

static public top[@T] : (seq of @T * seq of @T) -> [@T]
top(mk_(aHeads, aTails)) == 
	cases aHeads:
		[h] ^ -	-> h,
		[]	-> 
			cases aTails:
				[]		-> nil,
				others	-> hd Sequence`freverse[@T](aTails)
			end
	end;

static public fromList[@T] : seq of @T * (seq of @T * seq of @T) -> seq of @T * seq of @T
fromList(aSeq, aQueue) ==
	cases aSeq:
		[]				-> aQueue,
		[h] ^ aTailsOfSeq		-> fromList[@T](aTailsOfSeq, enQueue[@T](h, aQueue))
	end
measure fromListMeasure;

static fromListMeasure[@T] : seq of @T *  (seq of @T * seq of @T) +> nat
fromListMeasure(s, -) == len s;

static public toList[@T] : (seq of @T * seq of @T) -> seq of @T
toList(aaQueue) ==
	cases aaQueue:
		(mk_([], []))	-> [],
		aQueue	-> [top[@T](aQueue)] ^ toList[@T](deQueue[@T](aQueue))
	end
measure toListMeasure;

static toListMeasure[@T] :  (seq of @T * seq of @T) +> nat
toListMeasure(mk_(s1, s2)) == len s1 + len s2;

end DoubleListQueue
~~~
{% endraw %}

### DoubleListQueueT.vdmpp

{% raw %}
~~~
class DoubleListQueueT is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests () == 
	[ new DoubleListQueueT01()
	];
end DoubleListQueueT

class DoubleListQueueT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	q0 = DoubleListQueue`empty[int](),
		q1 = DoubleListQueue`enQueue[int](1, q0),
		q2 = DoubleListQueue`enQueue[int](2, q1),
		q3 = DoubleListQueue`enQueue[int](3, q2),
		h1 = DoubleListQueue`top[int](q3),
		q4 = DoubleListQueue`deQueue[int](q3),
		q5 = DoubleListQueue`enQueue[int](4, q4),
		q6 = DoubleListQueue`enQueue[int](5, q5),
		q7 = DoubleListQueue`deQueue[int](q6),
		q8 = DoubleListQueue`deQueue[int](q7),
		q9 = DoubleListQueue`deQueue[int](q8),
		q10 = DoubleListQueue`deQueue[int](q9),
		h2 = DoubleListQueue`top[int](q10),
		q11 = DoubleListQueue`deQueue[int](q10),
		q12 = DoubleListQueue`fromList[char]("Sahara Shin", DoubleListQueue`empty[char]())
	in
	return
		DoubleListQueue`isEmpty[int](q0) and q0 = mk_([], []) and
		DoubleListQueue`toList[int](q1) = [1] and q1 = mk_([], [1]) and
		DoubleListQueue`toList[int](q2) = [1,2] and q2 = mk_([], [2,1]) and
		DoubleListQueue`toList[int](q3) = [1,2,3] and q3 = mk_([], [3,2,1]) and
		h1 = 1 and
		DoubleListQueue`toList[int](q4) = [2,3] and q4 = mk_([2,3], []) and
		DoubleListQueue`toList[int](q5) = [2,3,4] and q5 = mk_([2,3], [4]) and
		DoubleListQueue`toList[int](q6) = [2,3,4,5] and q6 = mk_([2,3], [5, 4]) and
		DoubleListQueue`toList[int](q7) = [3,4,5] and q7 = mk_([3], [5, 4]) and
		DoubleListQueue`toList[int](q8) = [4,5] and q8 = mk_([], [5, 4]) and
		DoubleListQueue`toList[int](q9) = [5] and q9 = mk_([5], []) and
		DoubleListQueue`toList[int](q10) = [] and DoubleListQueue`isEmpty[int](q10) and q10 = mk_([], []) and
		h2 = nil and
		q11 = nil and
		DoubleListQueue`toList[char](q12) = "Sahara Shin" and q12 = mk_([], "nihS arahaS")
		
;
protected setUp: () ==> ()
setUp() == TestName := "DoubleListQueueT01:\t Test Queue";
protected tearDown: () ==> ()
tearDown() == return;
end DoubleListQueueT01
~~~
{% endraw %}

### FHashtable.vdmpp

{% raw %}
~~~
                                                                                           
--"$Id"
class FHashtable

functions
                                                                                             
static public Put[@T1, @T2] : 
	(map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> @T1 -> @T2 
	-> (map @T1 to (map @T1 to  @T2))
Put(aHashtable)(aHashCode)(aKey)(aValue) ==
	let	hashcode = aHashCode(aKey)
	in
	if hashcode in set dom aHashtable then
		aHashtable ++ {hashcode |-> (aHashtable(hashcode) ++ {aKey |-> aValue})}
	else
		aHashtable munion {hashcode |-> {aKey |-> aValue}}
	;
                                                                                            
static public PutAll[@T1, @T2] : 
	(map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> (map @T1 to  @T2) 
	-> (map @T1 to (map @T1 to  @T2)) 
PutAll(aHashtable)(aHashCode)(aMap) == 
	PutAllAux[@T1, @T2](aHashtable)(aHashCode)(aMap)(dom aMap);

static public PutAllAux[@T1, @T2] :
	(map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> (map @T1 to  @T2)  -> set of @T1
	-> (map @T1 to (map @T1 to  @T2)) 
PutAllAux(aHashtable)(aHashCode)(aMap)(aKeySet) ==
	if aKeySet = {} then
		aHashtable
	else
		let	aKey in set aKeySet	in
		let	newHashtable = Put[@T1, @T2](aHashtable)(aHashCode)(aKey)(aMap(aKey))	
		in
		PutAllAux[@T1, @T2](newHashtable)(aHashCode)(aMap)(aKeySet \ {aKey})
	;
                                                                              
static public Get[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> @T1  -> [@T2]
Get(aHashtable)(aHashCode)(aKey) ==
	let	hashcode = aHashCode(aKey)
	in
	if hashcode in set dom aHashtable then
		FMap`Get[@T1, @T2](aHashtable(hashcode))(aKey)
	else
		nil
	;
                                                                                                              
static public Remove[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> @T1 -> (map @T1 to (map @T1 to  @T2))
Remove(aHashtable)(aHashCode)(aKey) == 
	let	hashcode = aHashCode(aKey)
	in
	{h |-> ({aKey} <-: aHashtable(hashcode)) | h in set {hashcode}} munion 
		{hashcode} <-: aHashtable ;
                                                                               
static public Clear[@T1, @T2] : () -> (map @T1 to (map @T1 to  @T2))
Clear() == ({ |-> });
                                                                                               
static public KeySet[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> set of  @T1
KeySet(aHashtable) == 
	--let	aMapSet : set of (map @T1 to @T2) = rng aHashtable,
		--f : map @T1 to @T2 -> set of @T1 = lambda x : map @T1 to  @T2 & dom x
	let	aMapSet = rng aHashtable
	in
	if aMapSet <> {} then
		--dunion FSet`Fmap[map @T1 to  @T2, set of @T1](f)(aMapSet)
		dunion  {dom s | s in set aMapSet} 
	else
		{};
                                                                                           
static public ValueSet[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> set of  @T2
ValueSet(aHashtable) == 
	--let	aMapSet : set of (map @T1 to @T2) = rng aHashtable,
		--f : map @T1 to @T2 -> set of @T2 = lambda x : map @T1 to  @T2 & rng x
	let	aMapSet = rng aHashtable
	in
	if aMapSet <> {} then
		--dunion FSet`Fmap[map @T1 to  @T2, set of @T2](f)(aMapSet)
		dunion  {rng s | s in set aMapSet} 
	else
		{};
                                                                            
static public Size[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> nat
Size(aHashtable) == card KeySet[@T1, @T2](aHashtable) ;
                                                                                          
static public IsEmpty[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> bool
IsEmpty(aHashtable) == KeySet[@T1, @T2](aHashtable) = {};
                                                                                                       
static public Contains[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> @T2 -> bool
Contains(aHashtable)(aValue) == 
	let	aMapSet = rng aHashtable	
	in
	if aMapSet <> {} then
		exists aMap in set aMapSet & aValue in set rng aMap
	else
		false;
                                                                                                               
static public ContainsKey[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> @T1 -> bool
ContainsKey(aHashtable)(aKey) == 
	let	aMapSet = rng aHashtable	
	in
	if aMapSet <> {} then
		exists aMap in set aMapSet & aKey in set dom aMap
	else
		false;

end FHashtable
                                                                           
~~~
{% endraw %}

### FHashtableT.vdmpp

{% raw %}
~~~
                                                         
class FHashtableT

functions
static public run : () +> bool
run() == 
let	testcases = [ t1(), t2(), t3(), t4(), t5(), t6() ]
in
FTestDriver`run(testcases);
                                                                  
static t1 : () -> FTestDriver`TestCase
t1() ==
	
	mk_FTestDriver`TestCase(
	"FHashtableT01:\t Test Contains, PutAll",
	let	aHashCode = lambda x : int & x mod 13,
		p1 = FHashtable`PutAll[int, seq of char]({ |-> })(aHashCode)(
				{1 |-> "Sahara", 2 |-> "Sato", 14 |-> "Sakoh"}
			),
		c1 = FHashtable`Contains[int, seq of char](p1)
	in
	c1("Sahara") and
	c1("Sato") and
	c1("Sakoh") and
	c1("") = false)
	;
                                                                            
static t2 : () -> FTestDriver`TestCase
t2() ==
	
	mk_FTestDriver`TestCase(
	"FHashtableT02:\t Test Clear, Remove, ContainsKey",
	let	aHashCode = lambda x : seq of char & if x = "" then "" else FSequence`Take[char](1)(x),
		h2 = FHashtable`PutAll[seq of char, int]({ |-> })(aHashCode)(
				{"a" |-> 1, "b" |-> 2, "c" |-> 3}
			),
		h3 = FHashtable`Clear[int, seq of char](),
		deletedh2 = FHashtable`Remove[seq of char, int](h2)(aHashCode)("b"),
		c1 = FHashtable`Contains[seq of char, int](deletedh2),
		ck1 = FHashtable`ContainsKey[seq of char, int](deletedh2)
	in
	h3 = {|->} and
	FHashtable`Get[seq of char, int](deletedh2)(aHashCode)("b") = nil and
	c1(2) = false and
	c1(1) and
	c1(3) and
	ck1("b") = false and 
	ck1("a") and
	ck1("c"))
	;
                                                          
static t3 : () -> FTestDriver`TestCase
t3() ==
	
	mk_FTestDriver`TestCase(
	"FHashtableT03:\t Test Put, Get",
	let	aHashCode = lambda x : int & x mod 13,
		put = FHashtable`Put[int, seq of char],
		p1 = put({ |-> })(aHashCode)(1)("Sahara"),
		p2 = put(p1)(aHashCode)(2)("Bush"),
		p3 = put(p2)(aHashCode)(2)("Sato"),
		p4 = put(p3)(aHashCode)(14)("Sakoh"),
		get = FHashtable`Get[int, seq of char](p4),
		g = FHashtable`Get[int, seq of char](p4)(aHashCode)
	in
	get(aHashCode)(1) = "Sahara" and
	get(aHashCode)(2) = "Sato" and
	get(aHashCode)(14) = "Sakoh" and
	get(aHashCode)(99) = nil and
	FSequence`Fmap[int, seq of char](g)([1, 14]) = ["Sahara", "Sakoh"] and
	FSequence`Fmap[int, seq of char](g)([1, 2]) = ["Sahara", "Sato"] 
	)
	;
                                                                  
static t4 : () -> FTestDriver`TestCase
t4() ==
	
	mk_FTestDriver`TestCase(
	"FHashtableT04:\t Test KeySet, ValueSet",
	let	aHashCode = lambda x : int & x mod 13,
		put = FHashtable`Put[int, seq of char],
		p1 = put({ |-> })(aHashCode)(1)("Sahara"),
		p2 = put(p1)(aHashCode)(2)("Bush"),
		p3 = put(p2)(aHashCode)(2)("Sato"),
		p4 = put(p3)(aHashCode)(14)("Sakoh"),
		k = FHashtable`KeySet[int, seq of char],
		v = FHashtable`ValueSet[int, seq of char]
	in
	k(p1) = {1} and
	v(p1) = {"Sahara"} and
	k(p2) = {1, 2} and
	v(p2) = {"Sahara", "Bush"} and
	k(p4) = {1,2,14} and
	v(p4) = {"Sahara", "Sato", "Sakoh"})
	;
                                                                            
static t5 : () -> FTestDriver`TestCase
t5() ==
	
	mk_FTestDriver`TestCase(
	"FHashtableT05:\t Test hashCode is duplicate",
	let	aHashCode1 = lambda x : int & x mod 13,
		h1 = FHashtable`PutAll[int, seq of char]({ |-> })(aHashCode1)(
				{1 |-> "SaharaShin", 2 |-> "SatoKei", 14 |-> "SakohHiroshi", 27 |-> "NishikawaNoriko"}
			),
		h2 = FHashtable`Remove[int, seq of char](h1)(aHashCode1)(14)
	in
	FHashtable`KeySet[int, seq of char](h2) = {1, 2, 27} and
	FHashtable`ValueSet[int, seq of char](h2) = {"SaharaShin",  "SatoKei", "NishikawaNoriko"})
	;
                                                      
static t6 : () -> FTestDriver`TestCase
t6() ==
	
	mk_FTestDriver`TestCase(
	"FHashtableT06:\t Test Size",
	let	aHashCode1 = lambda x : int & x mod 13,
		remove = FHashtable`Remove[int, seq of char],
		h1 = FHashtable`PutAll[int, seq of char]({ |-> })(aHashCode1)(
				{1 |-> "SaharaShin", 2 |-> "SatoKei", 14 |-> "SakohHiroshi"}
			),
		h2 = remove(h1)(aHashCode1)(1),
		h3 = remove(h2)(aHashCode1)(2),
		h4 = remove(h3)(aHashCode1)(14),
		isempty = FHashtable`IsEmpty[int, seq of char],
		size = FHashtable`Size[int, seq of char]
	in
	isempty(h4) and
	size(h4) = 0 and
	isempty(h3)  = false and
	size(h3) = 1 and
	size(h2) = 2 and
	size(h1) = 3)
	;

end FHashtableT
            
~~~
{% endraw %}

### FMap.vdmpp

{% raw %}
~~~
                                                                                  
--"$Id"
class FMap

functions
                                                                                                                                 
static public Get[@T1, @T2] : map @T1 to @T2 -> @T1 -> [@T2]
Get(aMap)(aKey) ==
	if aKey in set dom aMap then
		aMap(aKey)
	else
		nil;
                                                                                                                 
static public Contains[@T1, @T2] : map @T1 to @T2 -> @T2 -> bool
Contains(aMap)(aValue) == aValue in set rng aMap;
                                                                                                                     
static public ContainsKey[@T1, @T2] : map @T1 to @T2 -> @T1 -> bool
ContainsKey(aMap)(aKey) == aKey in set dom aMap;
	
end FMap
                                                              
~~~
{% endraw %}

### FSequence.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                        
class FSequence
--"$Id: Sequence.vpp,v 1.1 2005/10/31 02:09:58 vdmtools Exp $";
	
functions 

                                                                     
static public Sum[@T] : seq of @T ->  @T
Sum(s) == Foldl[@T, @T](Plus[@T])(0)(s)
pre
	is_(s, seq of int) or is_(s, seq of nat) or is_(s, seq of nat1) or
 	is_(s, seq of real) or is_(s, seq of rat);
                                                                      
static public Prod[@T] : seq of @T ->  @T
Prod(s) == Foldl[@T, @T](Product[@T])(1)(s)
pre
	is_(s, seq of int) or is_(s, seq of nat) or is_(s, seq of nat1) or
 	is_(s, seq of real) or is_(s, seq of rat);
                                                       
static public Plus[@T] : @T -> @T -> @T
Plus(a)(b) == if is_real(a) and is_real(b)
              then a + b
              else undefined;
                                                         
static public Product[@T] : @T -> @T -> @T
Product(a)(b) == if is_real(a) and is_real(b)
              then a * b
              else undefined;
                                                              
static public Append[@T] : seq of @T -> @T -> seq of @T
Append(s)(e) == s ^ [e];
                                                                            
static public Average[@T]: seq of @T ->  [real]
Average(s) == if s = [] then nil else AverageAux[@T](0)(0)(s)
post
	if s = [] then
		RESULT = nil
	else let sum = Sum[@T](s)
	     in
		RESULT = if is_real(sum) 
		         then sum / len s
		         else undefined;

static AverageAux[@T] : @T -> @T -> seq of @T -> real
AverageAux(total)(numOfElem)(s) ==
  if is_(s,seq of real) and is_real(total) and is_real(numOfElem)
  then
	cases s :
	[x] ^ xs	-> AverageAux[@T](total + x)(numOfElem + 1)(xs),
	[]		-> total / numOfElem 
	end
	else undefined;
                                                                                                                                                      
static public IsAscendingInTotalOrder[@T] : (@T * @T -> bool) -> seq of @T -> bool
IsAscendingInTotalOrder(f)(s) ==
	forall i,j  in set inds s & i < j  => f(s(i),s(j)) or s(i) = s(j);
                                                                                                                                                       
static public IsDescendingInTotalOrder[@T] : (@T * @T -> bool) -> seq of @T -> bool
IsDescendingInTotalOrder(f)(s) ==
	forall i,j  in set inds s & i < j  => f(s(j),s(i)) or s(i) = s(j);
                                                                                                                                             
static public IsAscending [@T]: seq of @T -> bool
IsAscending(s) ==
	IsAscendingInTotalOrder[@T](lambda x : @T, y : @T & 
	                              if is_real(x) and is_real(y) 
	                              then x < y
	                              else undefined)(s);
                                                                                                                                              
static public IsDescending[@T]: seq of @T -> bool
IsDescending(s) ==
	IsDescendingInTotalOrder[@T](lambda x : @T, y : @T & 
	                                  if is_real(x) and is_real(y) 
	                                  then x < y
	                                  else undefined)(s);
                                                                                                                                   
static public Sort[@T] : (@T * @T -> bool) -> seq of @T -> seq of @T
Sort(f)(s) ==
	cases s:
		[]	-> [],
		[x]^xs	-> 
			Sort[@T](f)([xs(i) | i in set inds xs & f(xs(i),x)]) ^
			[x] ^
			Sort[@T](f)([xs(i) | i in set inds xs & not f(xs(i),x)])
	end;
                                                                                                                                   
static public AscendingSort[@T] : seq of @T -> seq of @T
AscendingSort(s) == Sort[@T](lambda x : @T, y : @T & 
                                if is_real(x) and is_real(y) 
	                              then x < y
	                              else undefined)(s)
post
	IsAscending[@T](RESULT);
                                                                                                                                                                       
static public DescendingSort[@T] : seq of @T -> seq of @T
DescendingSort(s) == Sort[@T](lambda x : @T, y : @T & 
                                  if is_real(x) and is_real(y) 
	                                then x > y
	                                else undefined)(s)
post
	IsDescending[@T](RESULT);
                                                                                                                                                 
static public IsOrdered[@T] : seq of (@T * @T -> bool) -> seq of @T -> seq of @T -> bool
IsOrdered(f)(s1)(s2) ==
	cases mk_(s1,s2):
		mk_([],[])			-> false,
		mk_([],-)			-> true,
		mk_(-,[])			-> false,
		mk_([x1]^xs1,[x2]^xs2)	->
			if (hd f)(x1,x2) then
				true
			elseif (hd f)(x2,x1) then
				false
			else
				IsOrdered[@T](tl f)(xs1)(xs2)
	end;
                                                                                                                   
static public Merge[@T] : (@T * @T -> bool) -> seq of @T -> seq of @T -> seq of @T
Merge(f)(s1)(s2) == 
	cases mk_(s1,s2):
		mk_([], y)			-> y,
		mk_(x, [])			-> x,
		mk_([x1]^xs1,[x2]^xs2)	->
			if f(x1,x2) then
				[x1] ^ FSequence`Merge[@T](f)(xs1)(s2)
			else
				[x2] ^ FSequence`Merge[@T](f)(s1)(xs2)
	end;
                                                                                                    
static public InsertAt[@T]: nat1 -> @T -> seq of @T -> seq of @T
InsertAt(i)(e)(s) ==
	cases mk_(i, s) :
	mk_(1, s1)		-> [e] ^ s1,
	mk_(-, [])		-> [e],
	mk_(i1, [x] ^ xs)	-> [x] ^ InsertAt[@T](i1 - 1)(e)(xs)
	end;
                                                                                                   
static public RemoveAt[@T]: nat1 -> seq of @T -> seq of @T
RemoveAt(i)(s) ==
	cases mk_(i, s) :
	mk_(1, [-] ^ xs)	-> xs,
	mk_(i1, [x] ^ xs)	-> [x] ^ RemoveAt[@T](i1 - 1)(xs),
	mk_(-, [])		-> []
	end;
                                                                                          
static public RemoveDup[@T] :  seq of @T ->  seq of @T
RemoveDup(s) == 
	cases s :
	[x]^xs		-> [x] ^ RemoveDup[@T](Filter[@T](lambda e : @T & e <> x)(xs)) ,
	[]		-> []
	end
post
	not IsDup[@T](RESULT);
                                                                                   
static public RemoveMember[@T] :  @T -> seq of @T -> seq of @T
RemoveMember(e)(s) == 
	cases s :
	[x]^xs		-> if e = x then xs else [x] ^ RemoveMember[@T](e)(xs),
	[]		-> []
	end;
                                                                                                    
static public RemoveMembers[@T] :  seq of @T -> seq of @T -> seq of @T
RemoveMembers(es)(s) == 
	cases es :
	[]		-> s,
	[x]^xs		-> RemoveMembers[@T](xs)(RemoveMember[@T](x)(s))
	end;
                                                                                                                                  
static public UpdateAt[@T]: nat1 -> @T -> seq of @T -> seq of @T
UpdateAt(i)(e)(s) ==
	cases mk_(i, s) :
	mk_(-, [])		-> [],
	mk_(1, [-] ^ xs)	-> [e] ^ xs,
	mk_(i1,  [x] ^ xs)	-> [x] ^ UpdateAt[@T](i1 - 1)(e)(xs)
	end;
                                                                                   
static public Take[@T] : int -> seq of @T -> seq of @T
Take(i)(s) == s(1,...,i);
                                                                                                                         
static public TakeWhile[@T] : (@T -> bool) -> seq of @T ->seq of @T
TakeWhile(f)(s) ==
	cases s :
	[x] ^ xs	-> 
		if f(x) then
			[x] ^ TakeWhile[@T](f)(xs)
		else
			[],
	[]	-> []
	end;
                                                                                
static public Drop[@T]: int -> seq of @T -> seq of @T
Drop(i)(s) == s(i+1,...,len s);
                                                                                                                      
static public DropWhile[@T] : (@T -> bool) -> seq of @T ->seq of @T
DropWhile(f)(s) ==
	cases s :
	[x] ^ xs	-> 
		if f(x) then
			DropWhile[@T](f)(xs)
		else
			s,
	[]	-> []
	end;
                                                                                                                                                                                         
static public Span[@T] : (@T -> bool) -> seq of @T -> seq of @T * seq of @T
Span(f)(s) ==
	cases s :
	[x] ^ xs	-> 
		if f(x) then
			let	mk_(satisfied, notSatisfied) = Span[@T](f)(xs)
			in
			mk_([x] ^ satisfied, notSatisfied)
		else
			mk_([], s),
	[]	-> mk_([], [])
	end;
                                                                                                                
static public SubSeq[@T]: nat -> nat -> seq1 of @T -> seq of @T
SubSeq(i)(numOfElems)(s) == s(i,...,i + numOfElems - 1);
                                                                         
static public Last[@T]: seq of @T -> @T
Last(s) == s(len s);
                                                                                          
static public Fmap[@T1,@T2]: (@T1 -> @T2) -> seq of @T1 -> seq of @T2
Fmap(f)(s) == [f(s(i)) | i in set inds s];
                                                                                                                                                                   
static public Filter[@T]: (@T -> bool) -> seq of @T -> seq of @T
Filter(f)(s) == [s(i) | i in set inds s & f(s(i))];
                                                                                                                    
static public Foldl[@T1, @T2] : (@T1 -> @T2 -> @T1) -> @T1 -> seq of @T2 -> @T1
Foldl(f)(args)(s) == 
	cases s :
	[]		-> args,
	[x] ^ xs	-> Foldl[@T1,@T2](f)(f(args)(x))(xs)
	end;
                                                                                                                      
static public Foldr[@T1, @T2] : 
	(@T1 -> @T2 -> @T2) -> @T2 -> seq of @T1 -> @T2
Foldr(f)(args)(s) == 
	cases s :
	[]		-> args,
	[x] ^ xs	-> f(x)(Foldr[@T1,@T2](f)(args)(xs))
	end;
                                                                               
static public IsMember[@T] : @T -> seq of @T -> bool
IsMember(e)(s) == 
	cases s :
	[x]^xs		-> e = x or IsMember[@T] (e)(xs),
	[]		-> false
	end;
                                                                                                             
static public IsAnyMember[@T]:  seq of @T -> seq of @T -> bool
IsAnyMember(es)(s) == 
	cases es :
	[x]^xs		->  IsMember[@T] (x)(s) or IsAnyMember[@T] (xs)(s) ,
	[]		-> false
	end;
                                                                                            
static public IsDup[@T] : seq of @T -> bool
IsDup(s) == not card elems s = len s
post
	if s = [] then 
		RESULT = false
	else
		RESULT = not forall i, j in set inds s & s(i) <> s(j) <=> i <> j ;
                                                                                                                                              
static public Index[@T]: @T -> seq of @T -> int
Index(e)(s) == 
	let	i = 0
	in
	IndexAux[@T](e)(s)(i);

static public IndexAux[@T] : @T -> seq of @T -> int -> int
IndexAux(e)(s)(i) ==
	cases s:
		[]		-> 0,
		[x]^xs		->
			if x = e then 
				i + 1
			else
				IndexAux[@T](e)(xs)(i+1)
	end;
                                                                                                                                     
static public IndexAll[@T] : @T -> seq of @T -> set of nat1
IndexAll(e)(s) == {i | i in set inds s & s(i) = e};
                                                                                                                             
static public Flatten[@T] : seq of seq of @T -> seq of @T
Flatten(s) == conc s;
                                                                                                 
static public Compact[@T] : seq of [@T] -> seq of @T
Compact(s) == [s(i) | i in set inds s & s(i) <> nil]
post
	forall i in set inds RESULT & RESULT(i) <> nil;
                                                                                                                                               
static public Freverse[@T] : seq of @T -> seq of @T
Freverse(s) == [s(len s + 1 -  i) | i in set inds s];
                                                                        
static public Permutations[@T]: seq of @T -> set of seq of @T
Permutations(s) == 
cases s:
	[],[-] -> {s},
	others -> dunion {{[s(i)]^j | j in set Permutations[@T](RemoveAt[@T](i)(s))} | i in set inds s} 
end
post
	forall x in set RESULT & elems x = elems s;
                                                                                                            
static public IsPermutations[@T]: seq of @T -> seq of @T -> bool
IsPermutations(s)(t) == 
	RemoveMembers[@T](s)(t) = [] and RemoveMembers[@T](t)(s) = [];
                                                                               
static public Unzip[@T1, @T2] : seq of (@T1 * @T2) -> seq of @T1 * seq of @T2
Unzip(s) ==
	cases s :
	[]			-> mk_([], []),
	[mk_(x, y)] ^ xs	->
		let	mk_(s1, t) = Unzip[@T1, @T2](xs)
		in
		mk_([x] ^ s1, [y] ^ t)
	end;
                                                                             
static public Zip[@T1, @T2] : seq of @T1 * seq of @T2 -> seq of (@T1 * @T2)
Zip(s1, s2) == Zip2[@T1, @T2](s1)(s2);
                                                                                                                                          
static public Zip2[@T1, @T2] : seq of @T1 -> seq of @T2 -> seq of (@T1 * @T2)
Zip2(s1)(s2) == 
	cases mk_(s1, s2) :
	mk_([x1] ^ xs1, [x2] ^ xs2)	-> [mk_(x1, x2)] ^ Zip2[@T1, @T2](xs1)(xs2),
	mk_(-, -)				-> []
	end;

end FSequence
                                                                         
~~~
{% endraw %}

### FTestDriver.vdmpp

{% raw %}
~~~
                                                                                                                                                
--$Id: TestDriver.vpp,v 1.1 2005/10/31 02:09:59 vdmtools Exp $
class FTestDriver

types
public TestCase ::
	testCaseName : seq of char
	testResult : bool;

functions
                                                                                                                                                                                                                                                          
static public run: seq of FTestDriver`TestCase +> bool
run(t) ==
	let	m = "Result-of-testcases.",
		r = [isOK(t(i)) | i in set inds t]
	in
	if  forall i in set inds r & r(i) then
		FTestLogger`SuccessAll(m)
	else
		FTestLogger`FailureAll(m);
                                                                                                                                                                                                               
static public isOK: FTestDriver`TestCase +> bool
isOK(t) ==
	if GetTestResult(t) then
		FTestLogger`Success(t)
	else
		FTestLogger`Failure(t);
                                                                           
static public GetTestResult : FTestDriver`TestCase +> bool
GetTestResult(t) == t.testResult;
                                                                       	
static public GetTestName: FTestDriver`TestCase +> seq of char
GetTestName(t) == t.testCaseName;

end FTestDriver

                                                                             
~~~
{% endraw %}

### FTestLogger.vdmpp

{% raw %}
~~~
                                                                                                  
--$Id: TestLogger.vpp,v 1.1 2005/10/31 02:09:59 vdmtools Exp $
class FTestLogger
values
historyFileName =  "VDMTESTLOG.TXT";

functions
                                                                                                                                        
static public Success: FTestDriver`TestCase +> bool
Success(t) == 
	let	message = 
			FTestDriver`GetTestName(t)^"\tOK.\n",
		- = Fprint( message),
		- = Print(message)		
	in
	true;
                                                                                                                                         
static public Failure: FTestDriver`TestCase +> bool
Failure(t) == 
	let	message = FTestDriver`GetTestName(t)^"\tNG.\n",
		- = Fprint( message),
		- = Print( message)		
	in
	false;
                                                                                                                                                 
static public SuccessAll : seq of char +> bool
SuccessAll(m) ==
	let	message = m ^ "\tOK!!\n",
		- = Fprint(message),
		- = Print( message)
	in
	true;
                                                                                                                                                  	
static public FailureAll :  seq of char +> bool
FailureAll(m) ==
	let	message = m ^ "\tNG!!\n",
		- = Fprint( message),
		- = Print( message)
	in
	false;
                                                                                      
static public Print : seq of char -> bool
Print (s) == new IO().echo(s);
                                                                                                                                                 
static public Fprint : seq of char -> bool
Fprint (s) == new IO().fecho(historyFileName,  s, <append>);

operations
                                                                                                       
static public Pr : seq of char ==> ()
Pr (s) == let - = new IO().echo(s) in skip;
                                                                                                                                                                   
static public Fpr : seq of char ==> ()
Fpr (s) == let - = new IO().fecho(historyFileName,  s, <append>) in skip;

end FTestLogger
                                                                            
~~~
{% endraw %}

### Function.vdmpp

{% raw %}
~~~
              
class Function

functions 
                            
static public Funtil[@T] : (@T -> bool) -> (@T -> @T) -> @T -> @T
Funtil(p)(f)(x) == if p(x) then x else Funtil[@T](p)(f)(f(x));
                            
static public Fwhile[@T] : (@T -> bool) -> (@T -> @T) -> @T -> @T
Fwhile(p)(f)(x) == if p(x) then Fwhile[@T](p)(f)(f(x)) else x;
                            
static public Seq[@T] : seq of (@T -> @T) -> @T -> @T
Seq(fs)(p) ==
	cases fs :
	[xf] ^ xfs	-> Seq[@T](xfs)(xf(p)),
	[]					-> p
	end
--measure length
;

--static length[@T] : seq of (@T -> @T) -> @T -> nat
--length(fs)(-) == len fs;
                            
static public readFn[@T] : seq of char -> [@T]
readFn(fname) ==
	let 
		io = new IO(),
		mk_(aResult, f) = io.freadval[@T](fname)
	in
	if aResult then
		f
	else
		let -= io.echo("Can't read values from the data file = " ^ fname)
		in
		nil;
                            
end Function
            
~~~
{% endraw %}

### FunctionT.vdmpp

{% raw %}
~~~
class FunctionT is subclass of TestDriver 
functions
public tests : () -> seq of TestCase
tests() == 
	[ 
	new FunctionT01(), new FunctionT02(),  new FunctionT03()
	];
end FunctionT
----------------------------------------------------------

class FunctionT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	f1 = lambda x : int & x * 2,
		p1 = lambda x : int & x > 1000,
		p11 = lambda x : int & x <= 1000,
		f2 = lambda x : seq of char & x ^ "0",
		p2 = lambda x : seq of char & len x > 9,
		p21 = lambda x : seq of char & len x <= 9
	in
	return
		Function`Fwhile[int](p11)(f1)(1) = 1024 and
		Function`Fwhile[seq of char](p21)(f2)("123456") = "1234560000" and
		Function`Funtil[int](p1)(f1)(1) = 1024 and
		Function`Funtil[seq of char](p2)(f2)("123456") = "1234560000"
	;
protected setUp: () ==> ()
setUp() == TestName := "FunctionT01:\tTest Fwhile, Funtil.";
protected tearDown: () ==> ()
tearDown() == return;
end FunctionT01
----------------------------------------------------------

class FunctionT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	f1 = lambda x : int & x * 2,
		f2 = lambda x : int & x * 3,
		f3 = lambda x : int & x ** 2,
		funcSeq1 = [f1, f2, f3],
		f10 = lambda x : seq of char & x ^ x,
		f11 = Sequence`take[char](10),
		f12 = Sequence`drop[char](4),
		funcSeq2 = [f10, f11, f12]
	in
	return
		Function`Seq[int](funcSeq1)(2) = (2 * 2 * 3) ** 2 and
		Function`Seq[seq of char](funcSeq2)("12345678") = "567812"
	;
protected setUp: () ==> ()
setUp() == TestName := "FunctionT02:\tTest function apply.";
protected tearDown: () ==> ()
tearDown() == return;
end FunctionT02
----------------------------------------------------------

class FunctionT03 is subclass of TestCase
types
public INT = int;
public ReadingFunctionType = INT -> INT -> INT;
--public ReadingFunctionType = int -> int -> int;

functions
public ReadingFunction: () -> ReadingFunctionType
ReadingFunction() == 
	let fn =  "./fread-func.txt"
	in
	Function`readFn[ReadingFunctionType](fn);

operations 
protected test: () ==> bool
test() == 
	return 
		ReadingFunction() (3)(2) = 1 and
		ReadingFunction() (4)(4) = 0 and
		ReadingFunction() (4)(-3) = -2 and
		ReadingFunction() (-4)(3) = 2
	;
protected setUp: () ==> ()
setUp() == TestName := "FunctionT03:\tTest of reading function.";
protected tearDown: () ==> ()
tearDown() == return;
end FunctionT03
~~~
{% endraw %}

### Hashtable.vdmpp

{% raw %}
~~~
/* Responsibility：
 *	Hash Table
 
 * Usage：
 *	（１） Object in Hashtable have to have hashCode() function and equals() function.
 
 * From historical reason, there are functional programming style and object-oriented style functions.
 * if function name starts chapital letter, the function is functional programming style
 * else the function is object-oriented style.
*/
class Hashtable is subclass of CommonDefinition 

types
public Contents = map Object to Object;
public Bucket = map int to Contents;

instance variables
sBucket : Bucket := { |->};

operations

public Hashtable : () ==> Hashtable
Hashtable() == 
	(
	sBucket := { |-> };
	return self
	);
	
public Hashtable : Contents ==> Hashtable
Hashtable(aContents) == 
	(
	self.putAll(aContents);
	return self
	);

--Hashtableのクリアー
public clear : () ==> ()
clear() == setBuckets({ |-> });

public getBuckets : () ==> Bucket 
getBuckets() == return sBucket;

public setBuckets : Bucket ==> ()
setBuckets(aBucket) == sBucket := aBucket;

public keySet : () ==> set of Object
keySet() ==
	let	buckets = self.getBuckets()
	in
	(
	dcl allKeySet : set of Object := {};
	for all aContents in set rng buckets do
		allKeySet := allKeySet union dom aContents;
	return allKeySet
	);

public put : Object * Object ==> ()
put(akey, aValue) ==
	let	buckets = self.getBuckets(),
		hashcode = akey.hashCode()
	in
	(
	if hashcode in set dom buckets then
		self.setBuckets(buckets ++ {hashcode |-> (buckets(hashcode) ++ {akey |-> aValue})})
	else
		self.setBuckets(buckets munion {hashcode |-> {akey |-> aValue}})
	);

public putAll : Contents ==> ()
putAll(aContents) == 
	for all key in set dom aContents do (
		self.put(key, aContents(key))
	);

public get : Object  ==> [Object]
get(key) ==
	let	buckets = self.getBuckets(),
		hashcode = key.hashCode()
	in
	(
	if hashcode in set dom buckets then
		let	aContents = buckets(hashcode)
		in
		for all aKey in set dom aContents do (
			if key.equals(aKey) then
				return aContents(aKey)
		);
	return nil
	);

public remove : Object ==> [Object]
remove(key) ==
	let	buckets = self.getBuckets(),
		hashcode = key.hashCode(),
		deleteObj = self.get(key)
	in
	(
	if deleteObj <> nil then
		let	aContents = buckets(hashcode),
			newContents = aContents :-> {deleteObj}
		in
		(
		self.setBuckets(buckets ++ {hashcode |-> newContents});
		return deleteObj
		)
	else
		return nil
	);

public valueSet : () ==> set of Object
valueSet() ==
	let	buckets = self.getBuckets()
	in
	(
	dcl aValueSet : set of Object := {};
	for all aContents in set rng buckets do
		aValueSet := aValueSet union rng aContents;
	return aValueSet
	);

functions

public size : () -> nat
size() == card self.keySet();

public isEmpty : () -> bool
isEmpty() == self.keySet() = {};
		
public contains : Object -> bool
contains(anObject) ==
	let	buckets = self.getBuckets()
	in
	exists hashcode in set dom buckets &
		let	aContents = buckets(hashcode)
		in
		exists key in set dom aContents &
			 aContents(key).equals(anObject);
		
public containsKey : Object -> bool
containsKey(aKey) ==
	let	buckets = self.getBuckets()
	in
	exists hashcode in set dom buckets & 
		exists key in set dom buckets(hashcode) &
			aKey.equals(key);


-----------Functional Programming part

functions

static public Put[@T1, @T2] : 
	(map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> @T1 -> @T2 
	-> (map @T1 to (map @T1 to  @T2))
Put(aHashtable)(aHashCode)(aKey)(aValue) ==
	let	hashcode = aHashCode(aKey)
	in
	if hashcode in set dom aHashtable then
		aHashtable ++ {hashcode |-> (aHashtable(hashcode) ++ {aKey |-> aValue})}
	else
		aHashtable munion {hashcode |-> {aKey |-> aValue}}
	;

static public PutAll[@T1, @T2] : 
	(map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> (map @T1 to  @T2) 
	-> (map @T1 to (map @T1 to  @T2)) 
PutAll(aHashtable)(aHashCode)(aMap) == 
	PutAllAux[@T1, @T2](aHashtable)(aHashCode)(aMap)(dom aMap);

static public PutAllAux[@T1, @T2] :
	(map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> (map @T1 to  @T2)  -> set of @T1
	-> (map @T1 to (map @T1 to  @T2)) 
PutAllAux(aHashtable)(aHashCode)(aMap)(aKeySet) ==
	if aKeySet = {} then
		aHashtable
	else
		let	aKey in set aKeySet	in
		let	newHashtable = Put[@T1, @T2](aHashtable)(aHashCode)(aKey)(aMap(aKey))	
		in
		PutAllAux[@T1, @T2](newHashtable)(aHashCode)(aMap)(aKeySet \ {aKey})
	;

static public Get[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> @T1  -> [@T2]
Get(aHashtable)(aHashCode)(aKey) ==
	let	hashcode = aHashCode(aKey)
	in
	if hashcode in set dom aHashtable then
		Map`Get[@T1, @T2](aHashtable(hashcode))(aKey)
	else
		nil
	;

static public Remove[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> (@T1 -> @T1) -> @T1 -> (map @T1 to (map @T1 to  @T2))
Remove(aHashtable)(aHashCode)(aKey) == 
	let	hashcode = aHashCode(aKey)
	in
	{h |-> ({aKey} <-: aHashtable(hashcode)) | h in set {hashcode}} munion 
		{hashcode} <-: aHashtable ;

--Hashtableのクリアー
static public Clear[@T1, @T2] : () -> (map @T1 to (map @T1 to  @T2))
Clear() == ({ |-> });

static public KeySet[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> set of  @T1
KeySet(aHashtable) == 
	--let	aMapSet = rng aHashtable,
		--f = lambda x : map @T1 to  @T2 & dom x
	let	aMapSet = rng aHashtable
	in
	if aMapSet <> {} then
		--dunion Set`fmap[map @T1 to  @T2, @T2](f)(aMapSet)
		dunion  {dom s | s in set aMapSet} 
	else
		{};

static public ValueSet[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> set of  @T2
ValueSet(aHashtable) == 
	--let	aMapSet = rng aHashtable,
		--f = lambda x : map @T1 to  @T2 & rng x
	let	aMapSet = rng aHashtable
	in
	if aMapSet <> {} then
		--dunion Set`fmap[map @T1 to  @T2, @T2](f)(aMapSet)
		dunion  {rng s | s in set aMapSet} 
	else
		{};
	
static public Size[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> nat
Size(aHashtable) == card KeySet[@T1, @T2](aHashtable) ;

static public IsEmpty[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> bool
IsEmpty(aHashtable) == KeySet[@T1, @T2](aHashtable) = {};
		
static public Contains[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> @T2 -> bool
Contains(aHashtable)(aValue) == 
	let	aMapSet = rng aHashtable	
	in
	if aMapSet <> {} then
		exists aMap in set aMapSet & aValue in set rng aMap
	else
		false;
		
static public ContainsKey[@T1, @T2] : (map @T1 to (map @T1 to  @T2)) -> @T1 -> bool
ContainsKey(aHashtable)(aKey) == 
	let	aMapSet = rng aHashtable	
	in
	if aMapSet <> {} then
		exists aMap in set aMapSet & aKey in set dom aMap
	else
		false;

end Hashtable
~~~
{% endraw %}

### HashtableT.vdmpp

{% raw %}
~~~
/*
Test Group 
	test of Hashtable
*/
----------------------------------------------------
class StringObj is subclass of CommonDefinition

instance variables
public content : seq of char;

functions
public hashCode : () -> int
hashCode() == 
	let c = getContent() in
	if  c <> nil then
		len c mod 17
	else
		-1;

public equals : Object -> bool
equals(anObject) == if isofclass(StringObj, anObject)
                   then self.getContent() = anObject.getContent()
                   else false;

operations
public StringObj : seq of char ==> StringObj
StringObj(aString) ==
	(
	content := aString;
	return self
	);

public getContent : () ==> [seq of char]
getContent() == 
	if isofclass(StringObj, self) then 
		return content
	else 
		return nil;

end StringObj
----------------------------------------------------
class IntObj is subclass of CommonDefinition

instance variables
public content : int;

functions
public hashCode : () -> int
hashCode() == 
	let c = getContent() in
	if c <> nil then
		c mod 13
	else
		-1;

public equals : Object -> bool
equals(anObject) == if isofclass(IntObj, anObject)
                   then self.getContent() = anObject.getContent()
                   else false;

operations
public IntObj : int ==> IntObj
IntObj(i) ==
	(
	content := i;
	return self
	);
	
public getContent : () ==> [int]
getContent() == 
	if isofclass(IntObj, self) then 
		return content
	else 
		return nil;

end IntObj
----------------------------------------------------
class HashtableT is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests() == 
	[ 
	new HashtableT52(), new HashtableT53(), new HashtableT54(),
	new HashtableT55(), new HashtableT56(), new HashtableT57(),
	new HashtableT01(), new HashtableT02(), new HashtableT03(),
	new HashtableT04(), 
	new HashtableT05(), new HashtableT06(),
	new HashtableT07()
	];
end HashtableT
----------------------------------------------------

class HashtableT01 is subclass of TestCase, CommonDefinition
operations 

protected test: () ==> bool
test() == 
	let	h1 = new Hashtable(),
		k1 = new IntObj(1),
		k2 = new IntObj(2),
		k3 = new IntObj(3),
		h2 =
			new Hashtable({
				k1 |-> new StringObj("Shin Sahara"), 
				k2 |-> new StringObj("Kei Sato"), 
				k3 |-> new StringObj("Hiroshi Sakoh")
			})
	in
	return 
		h1.getBuckets() = { |-> } and
		h2.get(k1).equals(new StringObj("Shin Sahara")) and
		h2.get(k2).equals(new StringObj("Kei Sato")) and
		h2.get(k3).equals(new StringObj("Hiroshi Sakoh")) and
		h2.get(new IntObj(1)).equals(new StringObj("Shin Sahara")) and
		h2.get(new IntObj(2)).equals(new StringObj("Kei Sato")) and
		h2.get(new IntObj(3)).equals(new StringObj("Hiroshi Sakoh")) 
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT01:\tConstructor test.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT01
---------------------------------------

class HashtableT02 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	h1 = 
			new Hashtable({
				new IntObj(1) |-> new StringObj("Shin Sahara"), 
				new IntObj(2) |->new StringObj("Kei Sato"), 
				new IntObj(3) |-> new StringObj("Hiroshi Sakoh")
			}),
		h2 = 
			new Hashtable({
				new StringObj("a") |->new IntObj(1),  
				new StringObj("b") |-> new IntObj(2), 
				new StringObj("c") |-> new IntObj(3)
			})
	in
	return 
		h1.contains(new StringObj("Shin Sahara")) and
		h1.contains(new StringObj("Kei Sato")) and
		h1.contains(new StringObj("Shin Sakoh")) = false and
		h1.containsKey(new IntObj(1)) and
		h1.containsKey(new IntObj(4)) = false and
		h2.contains(new IntObj(3)) and
		h2.contains(new IntObj(7)) = false and
		h2.containsKey(new StringObj("a")) and
		h2.containsKey(new StringObj("d")) = false
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT02:\tsearch test.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT02
---------------------------------------

class HashtableT03 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	h1 =
			new Hashtable({
				new IntObj(1) |-> new StringObj("Shin Sahara"), 
				new IntObj(2) |->new StringObj("Kei Sato"), 
				new IntObj(3) |-> new StringObj("Hiroshi Sakoh")
			}),
		h2 = 
			new Hashtable({
				new StringObj("a") |->new IntObj(1),  
				new StringObj("b") |-> new IntObj(2), 
				new StringObj("c") |-> new IntObj(3)
			}),
		deleteObj = h2.remove(new StringObj("b"))
	in
	(
	h1.clear();
	return 
		h1.getBuckets() = {|->} and
		deleteObj.equals(new IntObj(2)) and
		h2.get(new StringObj("b")) = nil and
		h2.contains(new IntObj(2)) = false and
		h2.containsKey(new StringObj("b")) = false and
		h2.remove(new StringObj("d")) = nil
	)
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT03:\tDelete test.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT03
---------------------------------------

class HashtableT04 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	--let	h1 = new Hashtable(),
	--	h2 = new Hashtable()
	--in
	(
	dcl h1 : Hashtable := new Hashtable();
	dcl h2 : Hashtable := new Hashtable();
	h1.putAll({
			new IntObj(1) |-> new StringObj("Shin Sahara"), 
			new IntObj(2) |->new StringObj("Kei Sato"), 
			new IntObj(14) |-> new StringObj("Hiroshi Sakoh")
	});
	h2.put(new StringObj("a"), new IntObj(1));
	h2.put(new StringObj("b"), new IntObj(2));
	def c = new StringObj("c") in (
		h2.put(c, new IntObj(4));
		h2.put(c, new IntObj(3))
	);
	return
		h1.get(new IntObj(1)).equals(new StringObj("Shin Sahara"))  and
		h1.get(new IntObj(2)).equals(new StringObj("Kei Sato")) and
		h1.get(new IntObj(14)).equals(new StringObj("Hiroshi Sakoh")) and
		h1.get(new IntObj(4)) = nil and  
		h2.get(new StringObj("a")).equals(new IntObj(1)) and
		h2.get(new StringObj("b")).equals(new IntObj(2)) and
		h2.get(new StringObj("c")).equals(new IntObj(3)) and 
		h2.get(new StringObj("d")) = nil 
	)
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT04:\tTest of put, get.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT04
---------------------------------------

class HashtableT05 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	h1 = new Hashtable(),
		h2 = new Hashtable(),
		h1k1 = new IntObj(1),
		h1k2 = new IntObj(2),
		h1k3 = new IntObj(14),
		h1v1 = new StringObj("Shin Sahara"),
		h1v2 = new StringObj("Kei Sato"),
		h1v3 = new StringObj("Hiroshi Sakoh"),
		h2k1 = new StringObj("a"),
		h2k2 = new StringObj("b"),
		h2k3 = new StringObj("c"),
		h2v1 = new IntObj(1),
		h2v2 = new IntObj(2),
		h2v3 = new IntObj(18)
		
	in
	(
	h1.putAll({
			h1k1 |-> h1v1, 
			h1k2 |-> h1v2, 
			h1k3 |-> h1v3
	});
	h2.put(h2k1, h2v1);
	h2.put(h2k2, h2v2);
	h2.put(h2k3, h2v3);
	let	keySet1 = h1.keySet(),
		valueSet1 = h1.valueSet(),
		keySet2 = h2.keySet(),
		valueSet2 = h2.valueSet()
	in
	return
		keySet1 = {h1k1, h1k2, h1k3} and
		valueSet1 = {h1v1, h1v2, h1v3} and
		keySet2 = {h2k1, h2k2, h2k3} and
		valueSet2 = {h2v1, h2v2, h2v3}
	)
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT05:\tTest of getting keys and values.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT05
---------------------------------------

class HashtableT06 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	h1 = new Hashtable(),
		h1k1 = new IntObj(1),
		h1k2 = new IntObj(14),
		h1k3 = new IntObj(16),
		h1k4 = new IntObj(27),
		h1v1 = new StringObj("a"),
		h1v2 = new StringObj("b"),
		h1v3 = new StringObj("c")
	in
	(
	h1.putAll({
			h1k1 |-> h1v1, 
			h1k2 |-> h1v2, 
			h1k3 |-> h1v3
	});
	let	- = h1.remove(new IntObj(14)) 
	in
	h1.put(h1k4, h1v3);
	return
		h1.keySet() = {h1k1, h1k3, h1k4} and
		h1.valueSet() = {h1v1, h1v3, h1v3}
	)
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT06:\tTest when hashCode overlaps.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT06
---------------------------------------

class HashtableT07 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	h1 = new Hashtable(),
		h2 = new Hashtable(),
		h1k1 = new IntObj(1),
		h1k2 = new IntObj(14),
		h1k3 = new IntObj(16),
		h1v1 = new StringObj("a"),
		h1v2 = new StringObj("b"),
		h1v3 = new StringObj("c")
	in
	(
	h1.putAll({
			h1k1 |-> h1v1, 
			h1k2 |-> h1v2, 
			h1k3 |-> h1v3
	});
	h2.putAll({
			h1k1 |-> h1v1, 
			h1k2 |-> h1v2, 
			h1k3 |-> h1v3
	});
	let	- = h1.remove(new IntObj(1)),
		- = h1.remove(new IntObj(14)),
		- = h1.remove(new IntObj(16)),
		- = h2.remove(new IntObj(14))
	in
	return
		h1.isEmpty() and
		h1.size() = 0 and
		h2.isEmpty() = false and
		h2.size() = 2 
		
	)
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT07:\tTest of size.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT07
---------------------------------------

class HashtableT52 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	aHashCode = lambda x : int & x mod 13,
		p1 = Hashtable`PutAll[int, seq of char]({ |-> })(aHashCode)(
				{1 |-> "Sahara", 2 |-> "Sato", 14 |-> "Sakoh"}
			),
		c1 = Hashtable`Contains[int, seq of char](p1)
	in
	return
		c1("Sahara") and
		c1("Sato") and
		c1("Sakoh") and
		c1("") = false
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT52:\tFunctional finding.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT52
---------------------------------------

class HashtableT53 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	aHashCode1 = lambda x : int & x mod 13,
		aHashCode2 = lambda x : seq of char & if x = "" then "" else Sequence`take[char](1)(x),
		- = Hashtable`PutAll[int, seq of char]({ |-> })(aHashCode1)(
				{1 |-> "Shin Sahara", 2 |-> "Kei Sato", 14 |-> "Hiroshi Sakoh"}
			),
		h2 = Hashtable`PutAll[seq of char, int]({ |-> })(aHashCode2)(
				{"a" |-> 1, "b" |-> 2, "c" |-> 3}
			),
		h3 = Hashtable`Clear[int, seq of char](),
		afterRemoveh2 = Hashtable`Remove[seq of char, int](h2)(aHashCode2)("b"),
		c1 = Hashtable`Contains[seq of char, int](afterRemoveh2),
		ck1 = Hashtable`ContainsKey[seq of char, int](afterRemoveh2)
	in
	(
	return 
		h3 = {|->} and
		Hashtable`Get[seq of char, int](afterRemoveh2)(aHashCode2)("b") = nil and
		c1(2) = false and
		c1(1) and
		c1(3) and
		ck1("b") = false and 
		ck1("a") and
		ck1("c") 
	)
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT53:\tTest of functional remove.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT53
---------------------------------------

class HashtableT54 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	aHashCode = lambda x : int & x mod 13,
		put = Hashtable`Put[int, seq of char],
		p1 = put({ |-> })(aHashCode)(1)("Sahara"),
		p2 = put(p1)(aHashCode)(2)("Bush"),
		p3 = put(p2)(aHashCode)(2)("Sato"),
		p4 = put(p3)(aHashCode)(14)("Sakoh"),
		get = Hashtable`Get[int, seq of char](p4)
	in
	return
		get(aHashCode)(1) = "Sahara" and
		get(aHashCode)(2) = "Sato" and
		get(aHashCode)(14) = "Sakoh" and
		get(aHashCode)(99) = nil
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT54:\tFunctional Put and Get.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT54
---------------------------------------

class HashtableT55 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	aHashCode = lambda x : int & x mod 13,
		put = Hashtable`Put[int, seq of char],
		p1 = put({ |-> })(aHashCode)(1)("Sahara"),
		p2 = put(p1)(aHashCode)(2)("Bush"),
		p3 = put(p2)(aHashCode)(2)("Sato"),
		p4 = put(p3)(aHashCode)(14)("Sakoh"),
		k = Hashtable`KeySet[int, seq of char],
		v = Hashtable`ValueSet[int, seq of char]
	in
	return
		k(p1) = {1} and
		v(p1) = {"Sahara"} and
		k(p2) = {1, 2} and
		v(p2) = {"Sahara", "Bush"} and
		k(p4) = {1,2,14} and
		v(p4) = {"Sahara", "Sato", "Sakoh"}
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT55:\tFunctional getting information.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT55
---------------------------------------

class HashtableT56 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	aHashCode1 = lambda x : int & x mod 13,
		h1 = Hashtable`PutAll[int, seq of char]({ |-> })(aHashCode1)(
				{1 |-> "Shin Sahara", 2 |-> "Kei Sato", 14 |-> "Hiroshi Sakoh", 27 |-> "Nishikawa"}
			),
		h2 = Hashtable`Remove[int, seq of char](h1)(aHashCode1)(14)
	in
	(
	return
		Hashtable`KeySet[int, seq of char](h2) = {1, 2, 27} and
		Hashtable`ValueSet[int, seq of char](h2) = {"Shin Sahara",  "Kei Sato", "Nishikawa"}
	)
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT56:\tWhen hashode overlapped.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT56
---------------------------------------

class HashtableT57 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	aHashCode1 = lambda x : int & x mod 13,
		remove = Hashtable`Remove[int, seq of char],
		h1 = Hashtable`PutAll[int, seq of char]({ |-> })(aHashCode1)(
				{1 |-> "Shin Sahara", 2 |-> "Kei Sato", 14 |-> "Hiroshi Sakoh"}
			),
		h2 = remove(h1)(aHashCode1)(1),
		h3 = remove(h2)(aHashCode1)(2),
		h4 = remove(h3)(aHashCode1)(14),
		isempty = Hashtable`IsEmpty[int, seq of char],
		size = Hashtable`Size[int, seq of char]
	in
	(
	return
		isempty(h4) and
		size(h4) = 0 and
		isempty(h3)  = false and
		size(h3) = 1 and
		size(h2) = 2 and
		size(h1) = 3
	)
;
protected setUp: () ==> ()
setUp() == TestName := "HashtableT57:\tTest of functional Size.";
protected tearDown: () ==> ()
tearDown() == return;
end HashtableT57
---------------------------------------
~~~
{% endraw %}

### Integer.vdmpp

{% raw %}
~~~
class Integer

functions 

static public asString: int -> seq1 of char 
asString(i) == 
	if i < 0 then
		"-" ^ asStringAux(-i)
	else
		asStringAux(i) ;
		
static public asStringAux: nat -> seq1 of char 
asStringAux(n) == 
	let	r = n mod 10,
		q = n div 10
	in
		cases q:
			0		-> asChar(r),
			others	-> asStringAux(q) ^ asChar(r)
		end
	measure ndiv10;

static ndiv10 : nat +> nat
ndiv10(n) == n div 10;

-- Convert integer to COBOL type number string (like ZZZ9.ZZ). 
static public asStringZ: seq of char -> int -> seq1 of char 
asStringZ(cobolStrConversionCommand)(i) == 
	let	minusSymbol = '-'	in
	if i < 0 then
		if cobolStrConversionCommand(1) = minusSymbol then
			[minusSymbol] ^ asStringZAux(String`subStr(cobolStrConversionCommand,2,len cobolStrConversionCommand))(-i, true)
		else
			asStringZAux(cobolStrConversionCommand)(-i, true)
	else
		if cobolStrConversionCommand(1) = minusSymbol then
			asStringZAux(String`subStr(cobolStrConversionCommand,2,len cobolStrConversionCommand))(i, true)
		else
			asStringZAux(cobolStrConversionCommand)(i, true) ;
 		
 static public asStringZAux: seq of char -> nat * bool -> seq1 of char 
 asStringZAux(cobolStrConversionCommand)(n, wasZero) == 
  	let	cobolStrConversionCommandStrLen = len cobolStrConversionCommand,
  		cobolStrConversionCommandChar = cobolStrConversionCommand(cobolStrConversionCommandStrLen),
  		cobolStrConversionCommandStr = String`subStr(cobolStrConversionCommand,1,cobolStrConversionCommandStrLen - 1),
  		r = n mod 10,
  		q = n div 10,
  		isZero = r = 0 and wasZero and q <> 0 
  	in
  		cases cobolStrConversionCommandStr:
  			[]		-> asCharZ(cobolStrConversionCommandChar)(r, isZero),
  			others	-> 
  				asStringZAux(cobolStrConversionCommandStr)(q, isZero) ^ 
  				asCharZ(cobolStrConversionCommandChar)(r, isZero)
 		end;
--measure  length;

static length : seq of char -> nat * bool -> nat
length(cobolStrConversionCommand)(-, -) == len cobolStrConversionCommand;

static public asCharZ : char -> nat * bool ->  seq1 of char | bool
asCharZ(cobolStrConversionCommandChar)(n, wasZero) ==
	cases n:
		0	-> 
			if cobolStrConversionCommandChar in set {'z', 'Z'} and wasZero then
				"0"
			elseif cobolStrConversionCommandChar = '0'  or cobolStrConversionCommandChar = '9' then
				"0"
			else
				" ",	-- Don't deal with all cases of cobolStrConversionCommandChar
		1	-> "1",
		2	-> "2",
		3	-> "3",
		4	-> "4",
		5	-> "5",
		6	-> "6",
		7	-> "7",
		8	-> "8",
		9	-> "9",
		others	-> false
	end;

static public asChar : int -> seq1 of char | bool
asChar(i) ==
	cases i:
		0	-> "0",
		1	-> "1",
		2	-> "2",
		3	-> "3",
		4	-> "4",
		5	-> "5",
		6	-> "6",
		7	-> "7",
		8	-> "8",
		9	-> "9",
		others	-> false
	end;

static public GCD : nat -> nat -> nat
GCD(x)(y) == 
	if y = 0 then x else GCD(y)(x rem y);
--measure GCDMeasure;

static GCDMeasure : nat -> nat -> nat
GCDMeasure(x)(-) == x;

static public LCM : nat -> nat -> nat
LCM(x)(y) ==
	cases mk_(x, y) :
	mk_(-, 0)	-> 0,
	mk_(0, -)	-> 0,
	mk_(z, w)	-> (z / GCD(z)(w)) * w
	end;
			
end Integer
~~~
{% endraw %}

### IntegerT.vdmpp

{% raw %}
~~~
class IntegerT is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests () == 
	[ new IntegerT01(), new IntegerT02()
	];
end IntegerT
---------------------------------------
class IntegerT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	i = new Integer()		in
	return
		(i.asString(1234567890) = "1234567890" and
		i.asString(-1234567890) = "-1234567890" and
		i.asStringZ("zzz9")(9900) = "9900" and
		i.asStringZ("9")(0) = "0" and
		i.asStringZ("z")(0) = " " and
		i.asStringZ("z")(9) = "9" and
		i.asStringZ("zzz9")(9) = "   9" and
		i.asStringZ("0009")(9) = "0009" and
		i.asStringZ("-0009")(9) = "0009" and
		i.asStringZ("-zzz9")(-9999) = "-9999" and
		i.asStringZ("-zzz9")(-9) = "-   9" and
		i.asStringZ("zzz9")(-9999) = "9999" and
		i.asStringZ("zzz9")(-9) = "   9" and
		i.asString(0) = "0" and
		i.asChar(0) = "0" and 
		i.asChar(1) = "1" and
		i.asChar(2) = "2" and
		i.asChar(3) = "3" and
		i.asChar(4) = "4" and 
		i.asChar(5) = "5" and 
		i.asChar(6) = "6" and
		i.asChar(7) = "7" and
		i.asChar(8) = "8" and
		i.asChar(9) = "9" and
		i.asChar(10) = false
		)
;
protected setUp: () ==> ()
setUp() == TestName := "IntegerT01:\tConvert integer to string.";
protected tearDown: () ==> ()
tearDown() == return;
end IntegerT01
---------------------------------------

class IntegerT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	gcd = Integer`GCD(24),
		lcm = Integer`LCM(7)
	in
	return
		Sequence`fmap[nat, nat](gcd)([36, 48, 16]) = [12, 24, 8]  and
		Sequence`fmap[nat, nat](lcm)([3, 4, 5]) = [21, 28, 35]
;
protected setUp: () ==> ()
setUp() == TestName := "IntegerT02:\tGet GCD and LCM.";
protected tearDown: () ==> ()
tearDown() == return;
end IntegerT02
~~~
{% endraw %}

### JapaneseCalendar.vdmpp

{% raw %}
~~~
class JapaneseCalendar is subclass of Calendar 
/*
Responsibility
	I'm a Japanese Calendar based on JST.
	Especially, I know Japanese holidays
*/

values
public differenceBetweenGMTandJST = 0.375;	-- 0.375 = 9 hours = 9 / 24 day
public differenceBetweenADandJapaneseCal = 1988;

functions

static private toStringAux: int -> seq of char
toStringAux(i) == 
	let	str = Integer`asString	in
	if i >= 10 then str(i) else " " ^ str(i);
	
static public getJapaneseDateStr : Date -> seq of char
getJapaneseDateStr(ADdate) == 
	let	asString =Integer`asString,
		yearOfJapaneseCal = ADdate.Year() - differenceBetweenADandJapaneseCal,
		m = ADdate.Month(),
		d = ADdate.day(),
		yearStr = asString(yearOfJapaneseCal),
		monthStr = toStringAux(m),
		dateStr = toStringAux(d)	in
		yearStr ^ monthStr ^ dateStr
pre
	ADdate.Year() >= differenceBetweenADandJapaneseCal;

operations

public setTheSetOfDayOffs: int ==> ()
setTheSetOfDayOffs(year) ==
	let	comingOfAgeDay = getNthDayOfTheWeek(year,1,2,<Mon>),
		marineDay = if year >= 2003 then getNthDayOfTheWeek(year,7, 3,<Mon>) else getDateFrom_yyyy_mm_dd(year,7,20),
		respect4TheAgedDay = if year >= 2003 then getNthDayOfTheWeek(year,9, 3,<Mon>) else getDateFrom_yyyy_mm_dd(year,9,15),
		healthSportsDay = getNthDayOfTheWeek(year,10, 2,<Mon>),
		nationalHolidaySet =  {
			getDateFrom_yyyy_mm_dd(year,1,1), 
			comingOfAgeDay,
			getDateFrom_yyyy_mm_dd(year,2,11),
			getVernalEquinox(year), 
			getDateFrom_yyyy_mm_dd(year,4,29),
			getDateFrom_yyyy_mm_dd(year,5,3),
			getDateFrom_yyyy_mm_dd(year,5,4), 	--formally this date is not national holiday
			getDateFrom_yyyy_mm_dd(year,5,5),
			marineDay,
			respect4TheAgedDay,
			getAutumnalEquinox(year),
			healthSportsDay,
			getDateFrom_yyyy_mm_dd(year,11,3),
			getDateFrom_yyyy_mm_dd(year,11,23),
			getDateFrom_yyyy_mm_dd(year,12,23)
		},
		mondayMakeupHolidat = 
			if year >= 2007 then 
				{getNotNationalHolidaysInFuture(nationalHolidaySet, d) | d in set nationalHolidaySet & isSunday(d)}
			else
				 {d.plus(1) | d in set nationalHolidaySet & isSunday(d)},
		weekdayBetweenDayOff = 
			if year >= 2007 then
				getWeekdayBetweenDayOff(nationalHolidaySet) 
			else
				{}
	in
	Year2Holidays := Year2Holidays munion { year |-> nationalHolidaySet union mondayMakeupHolidat union weekdayBetweenDayOff}
pre
	year >= 2000;

public JapaneseCalendar : () ==> JapaneseCalendar
JapaneseCalendar() ==
	(
	setDifferenceWithGMT(differenceBetweenGMTandJST); 
	return self
	);

public getWeekdayBetweenDayOff : set of Date ==> set of Date
getWeekdayBetweenDayOff(aNationalHolidaySet) == (
	let 
		candidatesOfWeekdayBetweenDayOff = 
			dunion { {d.minus(1), d.plus(1)} | d in set aNationalHolidaySet &
				d.minus(1).Year() = d.Year() and d.plus(1).Year() = d.Year()},
		weekdayBetweenHoliday = 
			{ d | d in set candidatesOfWeekdayBetweenDayOff & 
				let yesterday : Date = d.minus(1), tomorrow : Date =  d.plus(1) in
				isInDateSet(yesterday, aNationalHolidaySet) and isInDateSet(tomorrow, aNationalHolidaySet)}
	in
	return weekdayBetweenHoliday
 );

functions
public getNotNationalHolidaysInFuture :set of Date * Date-> Date
getNotNationalHolidaysInFuture(aNationalHolidaySet, date) ==
	cases  isInDateSet(date, aNationalHolidaySet) :
		(true)	-> getNotNationalHolidaysInFuture(aNationalHolidaySet, date.plus( 1)),
		others	-> date
	end;

end JapaneseCalendar
~~~
{% endraw %}

### Map.vdmpp

{% raw %}
~~~
class Map 

functions
static public Get[@T1, @T2] : map @T1 to @T2 -> @T1 -> [@T2]
Get(aMap)(aKey) ==
	if aKey in set dom aMap then
		aMap(aKey)
	else
		nil;

static public Contains[@T1, @T2] : map @T1 to @T2 -> @T2 -> bool
Contains(aMap)(aValue) == aValue in set rng aMap;

static public ContainsKey[@T1, @T2] : map @T1 to @T2 -> @T1 -> bool
ContainsKey(aMap)(aKey) == aKey in set dom aMap;
	
end Map
~~~
{% endraw %}

### MapT.vdmpp

{% raw %}
~~~
class MapT is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests() == 
	[ 
	new MapT01(), new MapT02()	
	];
end MapT
----------------------------------------------------
class MapT01 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	m1 = {1 |-> "Kei Sato", 19 |-> "Shin Sahara", 20 |-> "Hiroshi Sakoh"},
		m2 = {"Kei Sato" |-> 1,  "Shin Sahara" |-> 19,  "Hiroshi Sakoh" |-> 20},
		get1 = Map`Get[int, seq of char],
		get2 = Map`Get[seq of char, int]
	in
	return 
		get1(m1)(19) = "Shin Sahara" and
		get1(m1)(2) = nil and
		get2(m2)("Shin Sahara") = 19 and
		get2(m2)("Worst Prime Minister Koizumi") = nil
;
protected setUp: () ==> ()
setUp() == TestName := "MapT01:\tTest of Get function.";
protected tearDown: () ==> ()
tearDown() == return;
end MapT01
----------------------------------------------------
class MapT02 is subclass of TestCase, CommonDefinition
operations 
protected test: () ==> bool
test() == 
	let	m1 = {1 |-> "Kei Sato", 19 |-> "Shin Sahara", 20 |-> "Hiroshi Sakoh"},
		m2 = {"Kei Sato" |-> 1,  "Shin Sahara" |-> 19,  "Hiroshi Sakoh" |-> 20},
		c1 = Map`Contains[int, seq of char],
		k1 = Map`ContainsKey[int, seq of char],
		c2 = Map`Contains[seq of char, int],
		k2 = Map`ContainsKey[seq of char, int]
	in
	return 
		c1(m1)("Kei Sato") and c1(m1)("Shin Sahara") and c1(m1)("Hiroshi Sakoh") and
		c1(m1)("Worst Prime Minister Koizumi") = false and
		k1(m1)(1) and k1(m1)(19) and k1(m1)(20) and
		not k1(m1)(99) and
		c2(m2)(1) and c2(m2)(19) and c2(m2)(20) and
		c2(m2)(30) = false and
		k2(m2)("Kei Sato") and k2(m2)("Shin Sahara") and k2(m2)("Hiroshi Sakoh") and
		k2(m2)("Worst Prime Minister Koizumi") = false
;
protected setUp: () ==> ()
setUp() == TestName := "MapT02:\tTest of Contains related functions.";
protected tearDown: () ==> ()
tearDown() == return;
end MapT02
~~~
{% endraw %}

### Number.vdmpp

{% raw %}
~~~
class Number
 
functions 

static public isComputable[@e]: @e -> bool
isComputable(n) ==
	is_(n,int) or is_(n,nat) or is_(n,nat1) or is_(n,real) or is_(n,rat);

static public min[@e] :( @e * @e -> bool) -> @e -> @e -> @e
min(f)(n1)(n2) == if f(n1,n2) then n1 else n2;
	
static public max[@e] : ( @e * @e -> bool) -> @e -> @e -> @e
max(f)(n1)(n2) == if f(n1,n2) then n2 else n1;
			
end Number
~~~
{% endraw %}

### NumberT.vdmpp

{% raw %}
~~~
class NumberT is subclass of TestDriver 

functions
public tests : () -> seq of TestCase
tests () == 
	[ new NumberT01(),  new NumberT02(),  new NumberT03()
	];
end NumberT

class NumberT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		(Number`min[int](lambda x:int, y:int & x < y)(-3)(4) = -3 and
		Number`min[int](lambda x:int, y:int & x < y)(4)(-3) = -3 and
		Number`min[nat](lambda x:nat, y:nat & x < y)(2)(10) = 2 and
		Number`min[int](lambda x:int, y:int & x < y)(0)(0) = 0 and
		Number`max[real](lambda x:real, y:real & x < y)(0.001)( -0.001) = 0.001 and
		Number`max[real](lambda x:real, y:real & x < y)(-0.001)( 0.001) = 0.001 and
		Number`max[real](lambda x:real, y:real & x < y)(0.0)(0.0) = 0.0)
;
protected setUp: () ==> ()
setUp() == TestName := "NumberT01:\tSummary of integer.";
protected tearDown: () ==> ()
tearDown() == return;
end NumberT01

class NumberT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		 Number`isComputable[char]('a') = false and
		 Number`isComputable[int](-9) = true and
		 Number`isComputable[nat](0) = true and
		 Number`isComputable[nat1](1) = true and
		 Number`isComputable[real](1.234) = true and
		 Number`isComputable[rat](1.234) = true
;
protected setUp: () ==> ()
setUp() == TestName := "NumberT02:\tIs computable?";
protected tearDown: () ==> ()
tearDown() == return;
end NumberT02

class NumberT03 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		 Number`min[seq of int](lambda s1: seq of int, s2 : seq of int & len s1 < len s2)([1,2])([1,2,3])  = [1, 2]  and
		 Number`max[seq of int](lambda s1: seq of int, s2 : seq of int & len s1 < len s2)([1,2])([1,2,3])  = [1, 2, 3] 
;
protected setUp: () ==> ()
setUp() == TestName := "NumberT03:\tType is not computable, but...";
protected tearDown: () ==> ()
tearDown() == return;
end NumberT03
~~~
{% endraw %}

### Object.vdmpp

{% raw %}
~~~
class Object
/*
作成者 = 佐原伸
作成日 = 2000年 8月 23日 
Responsibility
	オブジェクト共通の振る舞いを表す。

Abstract
	すべてのオブジェクトに共通な機能を定義する。
*/
	
functions 

public hashCode : () -> int
hashCode() == 1;

public equals : Object -> bool
equals(-) == true;

operations
public getContent : () ==> [seq of char | int]
getContent() == return 1374;	--meaningless value. so subclass must set.
			
end Object
~~~
{% endraw %}

### Product.vdmpp

{% raw %}
~~~
class Product 

functions

static public Curry[@T1, @T2, @T3] : (@T1 * @T2 -> @T3) -> @T1 -> @T2 -> @T3
Curry(f)(x)(y) == f(x, y);

static public Uncurry[@T1, @T2, @T3] : (@T1 -> @T2 -> @T3) -> @T1 * @T2 -> @T3
Uncurry(f)(x,y) == f(x)(y);

end Product
~~~
{% endraw %}

### ProductT.vdmpp

{% raw %}
~~~
class ProductT is subclass of TestDriver 
functions
public tests : () -> seq of TestCase
tests() == 
	[ 
	new ProductT01()
	];
end ProductT
----------------------------------------------------------

class ProductT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	lt = String`LT,
		lt2 = lambda x : int, y : int & x < y
	in
	return
		Product`Curry[seq of char, seq of char, bool](lt)("abc")("abcd") and
		Product`Curry[seq of char, seq of char, bool](lt)("abcde")("abcd") = false and
		Product`Curry[int, int, bool](lt2)(3)(4) and
		Product`Uncurry[seq of char, seq of char, bool](String`LT2)("abc", "abcd") and
		Product`Uncurry[seq of char, seq of char, bool](String`LT2)("abcde", "abcd") = false and
		Product`Uncurry[seq of char, seq of char, bool](String`LE2)("3", "4")
	;
protected setUp: () ==> ()
setUp() == TestName := "ProductT01:\t Test of curry function.";
protected tearDown: () ==> ()
tearDown() == return;
end ProductT01
~~~
{% endraw %}

### Queue.vdmpp

{% raw %}
~~~
class Queue

functions
static public empty[@T] : () -> seq of @T
empty() == [];

static public isEmpty[@T] : seq of @T -> bool
isEmpty(s) == s = [];
	
static public enQueue[@T] : @T * seq of @T -> seq of @T
enQueue(anElem, aQueue) == aQueue ^ [anElem];

static public deQueue[@T] : seq of @T -> seq of @T
deQueue(aQueue) == 
	if aQueue = [] then
		[]
	else
		tl aQueue;

static public top[@T] : seq of @T -> [@T]
top(aQueue) == 
	if aQueue = [] then
		nil
	else
		hd aQueue;

end Queue
~~~
{% endraw %}

### QueueT.vdmpp

{% raw %}
~~~
class QueueT is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests () == 
	[ new QueueT01()
	];
end QueueT

class QueueT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	q0 = Queue`empty[int](),
		q1 = Queue`enQueue[int](1, q0),
		q2 = Queue`enQueue[int](2, q1),
		q3 = Queue`enQueue[int](3, q2),
		h1 = Queue`top[int](q3),
		q4 = Queue`deQueue[int](q3),
		q5 = Queue`deQueue[int](q4),
		q6 = Queue`deQueue[int](q5),
		h2 =  Queue`top[int](q6),
		q7 = Queue`deQueue[int](q6)
	in
	return
		q0 = [] and
		q1 = [1] and
		q2 = [1,2] and
		q3 = [1,2,3] and
		h1 = 1 and
		q4 = [2,3] and
		q5 = [3] and
		q6 = [] and
		h2 = nil and
		q7 = [] and
		Queue`isEmpty[int](q7) and
		not Queue`isEmpty[int](q5) 
		
;
protected setUp: () ==> ()
setUp() == TestName := "QueueT01:\t Test Queue";
protected tearDown: () ==> ()
tearDown() == return;
end QueueT01
~~~
{% endraw %}

### Real.vdmpp

{% raw %}
~~~
class Real

values
	Tolerance = 1e-8;
	Variation = 1e-5;	

functions

static public EQ : real -> real -> bool
EQ(r1)( r2) == abs(r1 - r2) < Tolerance;

static public EQE : real -> real -> real -> bool
EQE(e)(r1)(r2) == abs(r1 - r2) < e;

static public numberOfDigit : real -> nat
numberOfDigit(x) ==
	let	i = floor(x)	in
	if x = i then
		aNumberOfIntegerPartDigit(i)
	else
		aNumberOfIntegerPartDigit(i) + 1 + getNumberOfDigitsAfterTheDecimalPoint(x);

static public aNumberOfIntegerPartDigit : int -> nat
aNumberOfIntegerPartDigit(i) == aNumberOfIntegerPartDigitAux(i, 1);

static public aNumberOfIntegerPartDigitAux : int * nat -> nat
aNumberOfIntegerPartDigitAux(i, numberOfDigit) ==
	let	q = i div 10 in
	cases q:
		0		-> numberOfDigit,
		others	-> Real`aNumberOfIntegerPartDigitAux(q, numberOfDigit + 1)
	end
measure idiv10;

static idiv10 : int * nat +> nat
idiv10(i, -) == i div 10;

static public isNDigitsAfterTheDecimalPoint : real * nat -> bool
isNDigitsAfterTheDecimalPoint(x,numberOfDigit) == 
	getNumberOfDigitsAfterTheDecimalPoint(x) = numberOfDigit;

static public getNumberOfDigitsAfterTheDecimalPoint : real -> nat
getNumberOfDigitsAfterTheDecimalPoint(x) == getNumberOfDigitsAfterTheDecimalPointAux(x,0);

static getNumberOfDigitsAfterTheDecimalPointAux : real * nat -> nat
getNumberOfDigitsAfterTheDecimalPointAux(x,numberOfDigit) ==
	if x = floor(x) then
		numberOfDigit
	else
		getNumberOfDigitsAfterTheDecimalPointAux(x * 10, numberOfDigit + 1);

static public roundAterDecimalPointByNdigit : real * nat -> real
roundAterDecimalPointByNdigit(r, numberOfDigit) ==
	let	multiple = 10 ** numberOfDigit
	in
	floor(r * multiple  + 0.5) / multiple
pre
	r >= 0;

static public Differentiate : (real -> real) ->real -> real
Differentiate(f)(x) == (f(x+Variation) - f(x)) / Variation ;

--Newton's method to solve the equation
static public NewtonMethod: (real ->real) -> real -> real
NewtonMethod(f)(x) ==
	let	terminationCondition = lambda y : real &  abs(f(y)) < Tolerance,
		nextApproximation = lambda y : real & y - (f(y) / Differentiate(f)(y))	in
	new Function().Funtil[real](terminationCondition)(nextApproximation)(x);
	
-- Integration by Trapezoidal rule algorithm. This is too bad :-)
static public integrate : (real -> real)  -> nat1 -> real -> real -> real
integrate(f)(n)(a)(b) == 
	let	
		h = (b - a) / n,
		s = seqGenerate(n, a, h)
	in
	h * (f(a) / 2 + Sequence`Sum[real](Sequence`fmap[real, real](f)(s)) + f(b) / 2);

operations
static private seqGenerate : nat1 * real * real  ==> seq of real
seqGenerate(n, a, h) == 
	(	
		dcl s : seq of real := [];
		for i = 1 to n do
		s := s ^ [a + i * h];
	return s
	);

functions
--get root value for testing Newton Method.
static public root: real -> real
root(x) ==
	let	f = lambda y : real & y ** 2 - x	in
	NewtonMethod(f)(x);

static public getTotalPrincipal : real * int -> real
getTotalPrincipal(Interest,year) == (1 + Interest) ** year
pre
	Interest >= 0 and year > 0;

static getInterestImplicitSpec_Math_version : real * int -> real
getInterestImplicitSpec_Math_version(multiple,year) == is not yet specified
pre
	multiple > 1.0 and year > 0 
post
	multiple > 1.0 and year > 0 and
	exists1 Interest : real &
		let totalPrincipalAndInterest = getTotalPrincipal(Interest,year)
		in multiple = totalPrincipalAndInterest  and RESULT = Interest;
		
static getInterestImplicitSpec_Computer_version : real * int -> real
getInterestImplicitSpec_Computer_version(multiple,years) ==
	is not yet specified
pre
	multiple > 1.0 and years > 0 
post
	multiple > 1.0 and years > 0 and
	exists1 Interest : real & 
		let	totalPrincipalAndInterest = getTotalPrincipal(Interest,years)
		in	EQ(multiple)(totalPrincipalAndInterest) and RESULT = Interest;

--getInterest explicit specification
static public getInterest: real * int -> real
getInterest(multiple,years) ==
	let	f = lambda Interest : real & multiple - getTotalPrincipal(Interest,years)	in
	NewtonMethod(f)(0);
	
end Real
~~~
{% endraw %}

### RealT.vdmpp

{% raw %}
~~~
class RealT is subclass of TestDriver 
functions
public tests : () -> seq of TestCase
tests () == 
	[ 
	new RealT01(), new RealT02(), new RealT03(), new RealT04(),
	new RealT05(), new RealT06(), new RealT07(), new RealT08()
	];
end RealT
-----------------------------------------------------

class RealT01 is subclass of TestCase
values
	Tolelance = 1E-10;
operations 
protected test: () ==> bool
test() == 
	let	r = new Real()		in
	return
		Real`EQ(r.getInterest(2,10))(0.07177346254161253 )
;
protected setUp: () ==> ()
setUp() == TestName := "RealT01:\tTest of getInterest";
protected tearDown: () ==> ()
tearDown() == return;
end RealT01
-----------------------------------------------------

class RealT02 is subclass of TestCase
values
	Tolelance = 1E-10;
operations 
protected test: () ==> bool
test() == 
	let	r = new Real()		in
	return
		Real`EQ(r.root(2))(1.414213562382246 )
;
protected setUp: () ==> ()
setUp() == TestName := "RealT02:\tTest of root.";
protected tearDown: () ==> ()
tearDown() == return;
end RealT02
-----------------------------------------------------

class RealT03 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	r = new Real()		in
	return
		r.isNDigitsAfterTheDecimalPoint(10.01,2)  and
		not r.isNDigitsAfterTheDecimalPoint(10.01,3)  and
		r.isNDigitsAfterTheDecimalPoint(10.012,3)  and
		r.isNDigitsAfterTheDecimalPoint(10.0,0)  and
		r.isNDigitsAfterTheDecimalPoint(10.011,2) = false  and
		r.isNDigitsAfterTheDecimalPoint(10.1,0) = false and
		r.getNumberOfDigitsAfterTheDecimalPoint(-1.2) = 1 and
		r.getNumberOfDigitsAfterTheDecimalPoint(1.0) = 0 and
		r.getNumberOfDigitsAfterTheDecimalPoint(1) = 0 and
		r.getNumberOfDigitsAfterTheDecimalPoint(1.23) = 2
;
protected setUp: () ==> ()
setUp() == TestName := "RealT03:\tTest isNDigitsAfterTheDecimalPoint and getNumberOfDigitsAfterTheDecimalPoint.";
protected tearDown: () ==> ()
tearDown() == return;
end RealT03
-----------------------------------------------------

class RealT04 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	r = new Real()		in
	return
		r.numberOfDigit(0) = 1 and
		r.numberOfDigit(1) = 1 and
		r.numberOfDigit(9) = 1 and
		r.numberOfDigit(10) = 2 and
		r.numberOfDigit(99) = 2 and
		r.numberOfDigit(100) = 3 and
		r.numberOfDigit(0.1) = 3 and
		r.numberOfDigit(9.1) = 3 and
		r.numberOfDigit(10.1) = 4 and
		r.numberOfDigit(10.123) = 6
;
protected setUp: () ==> ()
setUp() == TestName := "RealT04:\tTest numberOfDigit.";
protected tearDown: () ==> ()
tearDown() == return;
end RealT04
-----------------------------------------------------

class RealT05 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		Real`EQ(Real`roundAterDecimalPointByNdigit(10.12345, 4))( 10.1235) and
		Real`EQ(Real`roundAterDecimalPointByNdigit(10.12345, 3))( 10.123 ) and
		Real`EQ(Real`roundAterDecimalPointByNdigit(10.12345, 2))( 10.12)  and
		Real`EQ(Real`roundAterDecimalPointByNdigit(10.125, 2) )( 10.13)  and
		Real`EQ(Real`roundAterDecimalPointByNdigit(10.14, 1))(  10.1)  and
		Real`EQ(Real`roundAterDecimalPointByNdigit(10.15, 1) )(  10.2)  and
		Real`EQ(Real`roundAterDecimalPointByNdigit(10.5, 0))( 11)  and
		Real`EQ(Real`roundAterDecimalPointByNdigit(10.4, 0) )( 10)  
;
protected setUp: () ==> ()
setUp() == TestName := "RealT05:\tTest roundAterDecimalPointByNdigit.";
protected tearDown: () ==> ()
tearDown() == return;
end RealT05
-----------------------------------------------------

class RealT06 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		Real`EQ(10.0123456678)(10.0123456789) = false and
		Real`EQ(10.01234567891)(10.01234567892) and
		Real`EQ(10.012345678801)(10.0123456789) and
		Real`EQE(1E-2)(10.12345)(10.12987)
;
protected setUp: () ==> ()
setUp() == TestName := "RealT06:\tTest EQ (Equal).";
protected tearDown: () ==> ()
tearDown() == return;
end RealT06
-----------------------------------------------------

class RealT07 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let f1 = lambda x : real & x ** 2
	in
	return
		Real`EQ(Real`integrate(f1)(10)(1)(2))(2.735) and
		Real`EQ(Real`integrate(f1)(100)(1)(2))(2.37335) and
		Real`EQ(Real`integrate(f1)(1000)(1)(2))(2.3373335)
;
protected setUp: () ==> ()
setUp() == TestName := "RealT07:\tTest integrate(x ** 2)";
protected tearDown: () ==> ()
tearDown() == return;
end RealT07
-----------------------------------------------------

class RealT08 is subclass of TestCase
values
pi = MATH`pi;
sin = MATH`sin

operations 
protected test: () ==> bool
test() == 
	return
		Real`EQ(Real`integrate(sin)(2)(0)(pi))(1.5707963278)  and 
		Real`EQ(Real`integrate(sin)(3)(0)(pi))(1.8137993649)  and 
		Real`EQ(Real`integrate(sin)(4)(0)(pi))(1.8961188984)  and 
		Real`EQ(Real`integrate(sin)(5)(0)(pi))(1.9337655984)  and
		Real`EQ(Real`integrate(sin)(2000)(1)(pi))(1.5403021586) 
;
protected setUp: () ==> ()
setUp() == TestName := "RealT08:\tTest integrate(sin) .";
protected tearDown: () ==> ()
tearDown() == return;
end RealT08




~~~
{% endraw %}

### SBCalendar.vdmpp

{% raw %}
~~~
                                                                                                                                                                          	
class SBCalendar is subclass of JapaneseCalendar -- date

values
	io = new IO();
	calendar = new SBCalendar();

instance variables

public iTodayOnBusiness : [Date] := nil;	-- This value express today for test.
public iTodayOnCompanyMap : [map seq of char to Date] := { |-> };		-- a map of companyCode to todayOnBusiness
public timeOfSystem : [Time] := nil;	-- This value express now for test.

functions

static public isCorrectContractMonth: seq of char -> bool
isCorrectContractMonth(aContractMonth) ==
	calendar.getDateFromString(aContractMonth ^ "01") <> false;

static public getExerciseDate :  seq of char -> Date
getExerciseDate(aContractMonth) ==
	let	firstDayOfContractMonth = calendar.getDateFromString(aContractMonth ^ "01"),
		designatedYear = firstDayOfContractMonth.Year(),
		designatedMonth =firstDayOfContractMonth.Month()	in
	calendar.getNthDayOfTheWeek(designatedYear,designatedMonth,2,<Fri>).getPastWeekday()
pre
	isCorrectContractMonth(aContractMonth);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 	
static public getContractDate : Date -> Date 
getContractDate(aDate) == 	
	let	 
		mk_(year, month) = calendar.getMonthOf6monthsLater(aDate.Year(), aDate.Month()),
		date = aDate.day(),
		candidateDate = getCandidateDate(year, month, date)
	in
	candidateDate.getPastWeekday()	--Sometime the result is a date of previous month. 
--pre
	--aDate.isNotDayOff()
post	
	let	
		mk_(year, month) = calendar.getMonthOf6monthsLater(aDate.Year(), aDate.Month()),
		date = aDate.day(),
		candidateDate = getCandidateDate(year, month, date) 
	in
	RESULT.EQ(candidateDate.getPastWeekday()) and
	if isDayoffFromTheBeginingOfMonthToCandidateDate(candidateDate) then
		RESULT.Month() = getPreviousMonth(year, month) 
	else
		RESULT.Month() = month;

static public getMonthOf6monthsLater :  int * int ->  int * int
getMonthOf6monthsLater(year, month) == calendar.getRegularMonth(year, month+6);

static public getCandidateDate : int * int * int -> Date
getCandidateDate(year, month, date)  == 
		let	dateOfEndOfMonth = calendar.getLastDayOfMonth(year, month)
		in
			if dateOfEndOfMonth.day() < date then
				dateOfEndOfMonth
			else
				calendar.getDateFrom_yyyy_mm_dd(year, month, date);

static public isDayoffFromTheBeginingOfMonthToCandidateDate : Date -> bool
isDayoffFromTheBeginingOfMonthToCandidateDate(candidateDate) == 
	forall day in set {1, ..., candidateDate.day()} & 
		calendar.isSundayOrDayoff(calendar.getDateFrom_yyyy_mm_dd(candidateDate.Year(), candidateDate.Month(), day));

static public getPreviousMonth : int * int -> int
getPreviousMonth(year, month) == 
		let	mk_(-, previousMonth) = calendar.getRegularMonth(year, month-1)
		in
		previousMonth;

static public isDateNil: [Date] -> bool
isDateNil(date) ==  date = nil; --or date = maxDate();

static public systemDate : () -> Date
systemDate() == calendar.today();

operations
public setTheSetOfDayOffs: int ==> () 	-- get the set of dayoff, but Sundays are not in set
setTheSetOfDayOffs(year) ==
	let	japaneseCalendar = new JapaneseCalendar(),
		japaneseDayoffSet = japaneseCalendar.getSetOfDayOff(year),
		TR1のsetOfDayOff = {
			japaneseCalendar.getDateFrom_yyyy_mm_dd(year,1,2), 
			japaneseCalendar.getDateFrom_yyyy_mm_dd(year,1,3), 
			japaneseCalendar.getDateFrom_yyyy_mm_dd(year,12,29), 
			japaneseCalendar.getDateFrom_yyyy_mm_dd(year,12,30), 
			japaneseCalendar.getDateFrom_yyyy_mm_dd(year,12,31)
		},
		saturdaySet = japaneseCalendar.getDayOfTheWeekInYear(year,<Sat>) 	in
	Year2Holidays := Year2Holidays munion { year |-> japaneseDayoffSet union TR1のsetOfDayOff union saturdaySet}
pre
	year >= 2000;

--todayOnBusinessをreadFromFile
public readTodayOnBusiness : seq of char ==> [Date]
readTodayOnBusiness(fname) ==
	let	mk_(rslt, mk_(y,m,d)) = io.freadval[int * int * int](fname)
	in
	if rslt then
		return getDateFrom_yyyy_mm_dd(y,m,d)
	else
		let	- = io.echo("Can't read BaseDay's data file.")
		in
		return nil;

--get today for test
public todayOnBusiness: () ==> Date
todayOnBusiness() == 
	if iTodayOnBusiness = nil then
		return readTodayOnBusiness(homedir ^ "/temp/BaseDay.txt")
	else
		return iTodayOnBusiness;

public readFromFiletodayOnBusiness: seq of char ==> Date
readFromFiletodayOnBusiness(fname) == 
	if iTodayOnBusiness = nil then
		return readTodayOnBusiness(fname)
	else
		return iTodayOnBusiness;

public setTodayOnBusiness : Date ==> ()
setTodayOnBusiness(date) == iTodayOnBusiness := date;

-- get today for system. For example, many business systems thinks just after midnight is as "today"
public todayOnCompany: seq of char ==> Date
todayOnCompany(companyCode) == 
	(
	if iTodayOnCompanyMap = nil then
		setTodayOnCompany(companyCode,todayOnBusiness());
	return iTodayOnCompanyMap(companyCode)
	);

public setTodayOnCompany : seq of char * Date ==> ()
setTodayOnCompany(companyCode,date) == iTodayOnCompanyMap := iTodayOnCompanyMap ++ { companyCode |-> date };

public readSystemTime : () ==> [Time]
readSystemTime() ==
	let	mk_(rslt, now) = io.freadval[Time](homedir ^ "/temp/SystemTime.txt")
	in
	if rslt then
		return now
	else
		let	- = io.echo("Can't read System Time data file.")
		in
		return nil;

public systemTime : () ==> Time
systemTime() == 
	if timeOfSystem = nil then
		readSystemTime()
	else
		return timeOfSystem;

public setSystemTime : Time ==> ()
setSystemTime(t) ==  timeOfSystem := t;

public SBCalendar : () ==> SBCalendar
SBCalendar() ==
	(
	setDifferenceWithGMT(differenceBetweenGMTandJST); 
	return self
	);
	
end SBCalendar
                                                                          
~~~
{% endraw %}

### SBCalendarT.vdmpp

{% raw %}
~~~
class SBCalendarT is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests () == 
	[
	new SBCalendarT06(),
	new SBCalendarT05(),
	new SBCalendarT04(),
	new SBCalendarT03(),
	new SBCalendarT02(),
	new SBCalendarT01()
	];
end SBCalendarT

class SBCalendarT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	c = new SBCalendar()	in
	(
	c.setTodayOnBusiness(c.getDateFrom_yyyy_mm_dd(2001,9,12));
	c.setSystemTime(new Time(c, 2003, 10, 23, 13, 12, 34, 567));
	return
		(
		--c.maxDate().EQ(c.getDateFrom_yyyy_mm_dd(9999,12,31)) and
		--c.maxDate().date2Str = c.dateの最大値 and
		c.todayOnBusiness().EQ(c.getDateFrom_yyyy_mm_dd(2001,9,12)) and
		c.isDateNil(nil) = true and
		--c.isDateNil(c.maxDate()) = true and
		c.isDateNil(c.todayOnBusiness()) = false and
		c.systemDate().EQ(c.today()) and
		c.systemTime().EQ(new Time(c, 2003, 10, 23, 13, 12, 34, 567))
		)
	)
;
protected setUp: () ==> ()
setUp() == TestName := "SBCalendarT01:\tTest maxDate and date is nil.";
protected tearDown: () ==> ()
tearDown() == return;
end SBCalendarT01

class SBCalendarT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	jc = new SBCalendar(),
		setOfDayOff = jc.getSetOfDayOff(2001),
		setOfDayOff2006 = jc.getSetOfDayOff(2006),
		d0401 = jc.getDateFromString("20010401"),
		d0408 = jc.getDateFromString("20010408"),
		d0430 = jc.getDateFromString("20010430"),
		setOfDayOffBy_yyyy_mm_dd =  {jc.getYyyymmdd(dayOff) | dayOff in set setOfDayOff}	,
		setOfDayOffBy_yyyy_mm_dd2006 =  {jc.getYyyymmdd(dayOff) | dayOff in set setOfDayOff2006}	in
	return
		setOfDayOffBy_yyyy_mm_dd = 
			{ mk_( 2001,1,1 ),
			  mk_( 2001,1,2 ),
			  mk_( 2001,1,3 ),
			  mk_( 2001,1,6 ),
			  mk_( 2001,1,8 ),
			  mk_( 2001,1,13 ),
			  mk_( 2001,1,20 ),
			  mk_( 2001,1,27 ),
			  mk_( 2001,2,3 ),
			  mk_( 2001,2,10 ),
			  mk_( 2001,2,11 ),
			  mk_( 2001,2,12 ),
			  mk_( 2001,2,17 ),
			  mk_( 2001,2,24 ),
			  mk_( 2001,3,3 ),
			  mk_( 2001,3,10 ),
			  mk_( 2001,3,17 ),
			  mk_( 2001,3,20 ),
			  mk_( 2001,3,24 ),
			  mk_( 2001,3,31 ),
			  mk_( 2001,4,7 ),
			  mk_( 2001,4,14 ),
			  mk_( 2001,4,21 ),
			  mk_( 2001,4,28 ),
			  mk_( 2001,4,29 ),
			  mk_( 2001,4,30 ),
			  mk_( 2001,5,3 ),
			  mk_( 2001,5,4 ),
			  mk_( 2001,5,5 ),
			  mk_( 2001,5,12 ),
			  mk_( 2001,5,19 ),
			  mk_( 2001,5,26 ),
			  mk_( 2001,6,2 ),
			  mk_( 2001,6,9 ),
			  mk_( 2001,6,16 ),
			  mk_( 2001,6,23 ),
			  mk_( 2001,6,30 ),
			  mk_( 2001,7,7 ),
			  mk_( 2001,7,14 ),
			  mk_( 2001,7,20 ),
			  mk_( 2001,7,21 ),
			  mk_( 2001,7,28 ),
			  mk_( 2001,8,4 ),
			  mk_( 2001,8,11 ),
			  mk_( 2001,8,18 ),
			  mk_( 2001,8,25 ),
			  mk_( 2001,9,1 ),
			  mk_( 2001,9,8 ),
			  mk_( 2001,9,15 ),
			  mk_( 2001,9,22 ),
			  mk_( 2001,9,23 ),
			  mk_( 2001,9,24 ),
			  mk_( 2001,9,29 ),
			  mk_( 2001,10,6 ),
			  mk_( 2001,10,8 ),
			  mk_( 2001,10,13 ),
			  mk_( 2001,10,20 ),
			  mk_( 2001,10,27 ),
			  mk_( 2001,11,3 ),
			  mk_( 2001,11,10 ),
			  mk_( 2001,11,17 ),
			  mk_( 2001,11,23 ),
			  mk_( 2001,11,24 ),
			  mk_( 2001,12,1 ),
			  mk_( 2001,12,8 ),
			  mk_( 2001,12,15 ),
			  mk_( 2001,12,22 ),
			  mk_( 2001,12,23 ),
			  mk_( 2001,12,24 ),
			  mk_( 2001,12,29 ),
			  mk_( 2001,12,30 ),
			 mk_( 2001,12,31 ) } and
  		setOfDayOffBy_yyyy_mm_dd2006 =
			{ mk_( 2006,1,1 ),
			  mk_( 2006,1,2 ),
			  mk_( 2006,1,3 ),
			  mk_( 2006,1,7 ),
			  mk_( 2006,1,9 ),
			  mk_( 2006,1,14 ),
			  mk_( 2006,1,21 ),
			  mk_( 2006,1,28 ),
			  mk_( 2006,2,4 ),
			  mk_( 2006,2,11 ),
			  mk_( 2006,2,18 ),
			  mk_( 2006,2,25 ),
			  mk_( 2006,3,4 ),
			  mk_( 2006,3,11 ),
			  mk_( 2006,3,18 ),
			  mk_( 2006,3,21 ),
			  mk_( 2006,3,25 ),
			  mk_( 2006,4,1 ),
			  mk_( 2006,4,8 ),
			  mk_( 2006,4,15 ),
			  mk_( 2006,4,22 ),
			  mk_( 2006,4,29 ),
			  mk_( 2006,5,3 ),
			  mk_( 2006,5,4 ),
			  mk_( 2006,5,5 ),
			  mk_( 2006,5,6 ),
			  mk_( 2006,5,13 ),
			  mk_( 2006,5,20 ),
			  mk_( 2006,5,27 ),
			  mk_( 2006,6,3 ),
			  mk_( 2006,6,10 ),
			  mk_( 2006,6,17 ),
			  mk_( 2006,6,24 ),
			  mk_( 2006,7,1 ),
			  mk_( 2006,7,8 ),
			  mk_( 2006,7,15 ),
			  mk_( 2006,7,17 ),
			  mk_( 2006,7,22 ),
			  mk_( 2006,7,29 ),
			  mk_( 2006,8,5 ),
			  mk_( 2006,8,12 ),
			  mk_( 2006,8,19 ),
			  mk_( 2006,8,26 ),
			  mk_( 2006,9,2 ),
			  mk_( 2006,9,9 ),
			  mk_( 2006,9,16 ),
			  mk_( 2006,9,18 ),
			  mk_( 2006,9,23 ),
			  mk_( 2006,9,30 ),
			  mk_( 2006,10,7 ),
			  mk_( 2006,10,9 ),
			  mk_( 2006,10,14 ),
			  mk_( 2006,10,21 ),
			  mk_( 2006,10,28 ),
			  mk_( 2006,11,3 ),
			  mk_( 2006,11,4 ),
			  mk_( 2006,11,11 ),
			  mk_( 2006,11,18 ),
			  mk_( 2006,11,23 ),
			  mk_( 2006,11,25 ),
			  mk_( 2006,12,2 ),
			  mk_( 2006,12,9 ),
			  mk_( 2006,12,16 ),
			  mk_( 2006,12,23 ),
			  mk_( 2006,12,29 ),
			  mk_( 2006,12,30 ),
			  mk_( 2006,12,31 ) } and
  		jc.getDayOffsExceptSunday(d0401,d0430)  = 6 and
  		card jc.getDayOffsAndSunday(d0401,d0430) = 1 and
  		jc.getDayOffsAndSunday(d0401,d0408) = {}
	;
protected setUp: () ==> ()
setUp() == TestName := "SBCalendarT02:\tGetting set of day off.";
protected tearDown: () ==> ()
tearDown() == return;
end SBCalendarT02

class SBCalendarT03 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	c = new SBCalendar()	in
	(
	c.setTodayOnBusiness(c.getDateFrom_yyyy_mm_dd(2001,9,12));
	return
		(
		c.getExerciseDate("200111").EQ(c.getDateFrom_yyyy_mm_dd(2001,11,9))  and
		c.getExerciseDate("200109").EQ(c.getDateFrom_yyyy_mm_dd(2001,9,14))  and
		c.isCorrectContractMonth("200206") = true and
		c.isCorrectContractMonth("200206.01") = false and
		c.isCorrectContractMonth("Shin Sahara") = false 
		)
	)
;
protected setUp: () ==> ()
setUp() == TestName := "SBCalendarT03:\tTest validity checking of contract month and getting execution date.";
protected tearDown: () ==> ()
tearDown() == return;
end SBCalendarT03

class SBCalendarT04 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	c = new SBCalendar(),
		d0929 = c.getDateFrom_yyyy_mm_dd(2001, 9, 29),
		d0104 = c.getDateFrom_yyyy_mm_dd(20021, 1, 4)	in
	(
	c.setTodayOnCompany("007",d0104);
	c.setTodayOnCompany("009",d0929);
	return
		(
		c.todayOnCompany("007") = d0104 and
		c.todayOnCompany("009") = d0929 
		)
	)
;
protected setUp: () ==> ()
setUp() == TestName := "SBCalendarT04:\tTest of todayOnCompany";
protected tearDown: () ==> ()
tearDown() == return;
end SBCalendarT04

class SBCalendarT05 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	c = new SBCalendar()
	in
	return
		c.todayOnBusiness().EQ(c.getDateFrom_yyyy_mm_dd(2003, 10, 24)) and
		c.readFromFiletodayOnBusiness(homedir ^ "/temp/Today.txt").EQ(c.getDateFrom_yyyy_mm_dd(2001, 3, 1))
;
protected setUp: () ==> ()
setUp() == TestName := "SBCalendarT05:\tTest todayOnBusiness from a file.";
protected tearDown: () ==> ()
tearDown() == return;
end SBCalendarT05

class SBCalendarT06 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	c = new SBCalendar(),
		sDate = SBCalendar`getContractDate
	in
	return
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 1, 5)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 7, 5)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 1, 31)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 7, 30)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 2, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 7, 30)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 2, 2)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 8, 2)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 2, 27)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 8, 27)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 3, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 9, 1)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 3, 30)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 9, 30)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 3, 31)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 9, 30)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 4, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 10, 1)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 4, 30)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 10, 29)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 5, 6)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 11, 5)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 5, 7)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 11, 5)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 5, 10)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 11, 10)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 6, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 12, 1)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 6, 28)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 12, 28)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 6, 29)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 12, 28)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 6, 30)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 12, 28)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 7, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 12, 28)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 7, 2)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 12, 28)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 7, 5)).EQ(c.getDateFrom_yyyy_mm_dd(2005, 1, 5)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2004, 7, 30)).EQ(c.getDateFrom_yyyy_mm_dd(2005, 1, 28)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 8, 2)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 2, 2)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 8, 28)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 2, 27)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 8, 29)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 2, 27)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 9, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 3, 1)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 9, 30)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 3, 30)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 10, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 4, 1)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 10, 29)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 4, 28))  and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 11, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 4, 30)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 11, 30)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 5, 28)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 12, 1)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 6, 1)) and
		sDate(c.getDateFrom_yyyy_mm_dd(2003, 12, 26)).EQ(c.getDateFrom_yyyy_mm_dd(2004, 6, 25))
;
protected setUp: () ==> ()
setUp() == TestName := "SBCalendarT06:\tGetting contract date of margin trading.";
protected tearDown: () ==> ()
tearDown() == return;
end SBCalendarT06
~~~
{% endraw %}

### Sequence.vdmpp

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           	
class Sequence
	
functions 

static public Sum[@T]: seq of @T ->  @T
Sum(s) == SumAux[@T](s)(0)
pre
	is_(s, seq of real);

static SumAux[@T] : seq of @T -> @T -> @T
SumAux(s)(sum) ==
  if is_(s,seq of real) and is_real(sum)
  then
	if s = [] then
		sum
	else
		SumAux[@T](tl s)(sum + hd s)
  else undefined;
--measure length_measure;

static length_measure[@T] : seq of @T +> nat
length_measure(s) == len s;

static public Product[@T]: seq of @T ->  @T
Product(s) == ProductAux[@T](s)(1)
pre
	is_(s, seq of real);
 	
static ProductAux[@T] : seq of @T -> @T -> @T
ProductAux(s)(p) ==
 if is_(s,seq of real) and is_real(p)
 then
	cases s :
	[h] ^ tail	-> ProductAux[@T](tail)(p * h),
	[]			-> p
	end
 else undefined;
--measure length_measure;

static public GetAverage[@T]: seq of @T ->  [real]
GetAverage(s) == if s = [] then nil else GetAverageAux[@T](s)(0)(len s);

static GetAverageAux[@T] : seq of @T -> @T -> @T -> real
GetAverageAux(s)(sum)(numberOfElem) ==
 if is_(s,seq of real) and is_real(sum) and is_real(numberOfElem)
 then
	cases s :
	[h] ^ tail	-> GetAverageAux[@T](tail)(sum + h)(numberOfElem),
	[]			-> sum / numberOfElem
	end
else undefined;
--measure length_measure;

static public isAscendingTotalOrder [@T]:
	(@T * @T -> bool) -> seq of @T -> bool
isAscendingTotalOrder (decideOrderFunc)(s) ==
	forall i,j  in set inds s & i < j  => decideOrderFunc(s(i),s(j)) or s(i) = s(j);

static public isDescendingTotalOrder [@T]:
	(@T * @T -> bool) -> seq of @T -> bool
isDescendingTotalOrder (decideOrderFunc)(s) ==
	forall i,j  in set inds s & i < j  => decideOrderFunc(s(j),s(i)) or s(i) = s(j);

static public isAscendingOrder [@T]: seq of @T -> bool
isAscendingOrder(s) ==
	isAscendingTotalOrder [@T](lambda x : @T, y : @T & if is_real(x) and is_real(y)
                                                     then x < y
                                                     else undefined)(s);

static public isDescendingOrder[@T]: seq of @T -> bool
isDescendingOrder(s) ==
	isDescendingTotalOrder [@T](lambda x : @T, y : @T & if is_real(x) and is_real(y)
                                                      then x < y
                                                      else undefined)(s);

static public sort[@T] : (@T * @T -> bool) -> seq of @T -> seq of @T
sort(decideOrderFunc)(s) ==
	cases s:
		[]	-> [],
		[h]^tail	-> 
			sort[@T](decideOrderFunc)([tail(i) | i in set inds tail & decideOrderFunc(tail(i),h)]) ^
			[h] ^
			sort[@T](decideOrderFunc)([tail(i) | i in set inds tail & not decideOrderFunc(tail(i),h)])
	end;

static public ascendingOrderSort[@T] : seq of @T -> seq of @T
ascendingOrderSort(s) == sort[@T](lambda x : @T, y : @T & if is_real(x) and is_real(y)
                                                          then x < y
                                                          else undefined)(s);

static public descendingOrderSort[@T] : seq of @T -> seq of @T
descendingOrderSort(s) == sort[@T](lambda x : @T, y : @T & if is_real(x) and is_real(y)
                                                           then x > y
                                                           else undefined)(s);

static public isOrdered[@T] : seq of (@T * @T -> bool) -> seq of @T -> seq of @T -> bool
isOrdered(decideOrderFuncSeq)(s1)(s2) ==
	cases mk_(s1,s2):
		mk_([],[])		-> false,
		mk_([],-)		-> true,
		mk_(-,[])	-> false,
		mk_([h1]^tail1,[h2]^tail2)	->
			if (hd decideOrderFuncSeq)(h1,h2) then
				true
			elseif (hd decideOrderFuncSeq)(h2,h1) then
				false
			else
				Sequence`isOrdered[@T](tl decideOrderFuncSeq)(tail1)(tail2)
	end;

static public Merge[@T] : (@T * @T -> bool) -> seq of @T -> seq of @T -> seq of @T
Merge(decideOrderFunc)(s1)(s2) == 
	cases mk_(s1,s2):
		mk_([], y)						-> y,
		mk_(x, [])						-> x,
		mk_([h1]^tail1,[h2]^tail2)		->
			if decideOrderFunc(h1,h2) then
				[h1] ^ Sequence`Merge[@T](decideOrderFunc)(tail1)(s2)
			else
				[h2] ^ Sequence`Merge[@T](decideOrderFunc)(s1)(tail2)
	end;

static public InsertAt[@T]: nat1 -> @T -> seq of @T -> seq of @T
InsertAt(position)(e)(s) ==
	cases mk_(position, s) :
	mk_(1, str)				-> [e] ^ str,
	mk_(-, [])				-> [e],
	mk_(pos, [h] ^ tail)	-> [h] ^ InsertAt[@T](pos - 1)(e)(tail)
	end;

static public RemoveAt[@T]: nat1 -> seq of @T -> seq of @T
RemoveAt(position)(s) ==
	cases mk_(position, s) :
	mk_(1, [-] ^ tail)		-> tail,
	mk_(pos, [h] ^ tail)	-> [h] ^ RemoveAt[@T](pos - 1)(tail),
	mk_(-, [])				-> []
	end;

static public RemoveDup[@T] :  seq of @T ->  seq of @T
RemoveDup(s) == 
	cases s :
	[h]^tail		-> [h] ^ RemoveDup[@T](filter[@T](lambda x : @T & x <> h)(tail)) ,
	[]			-> []
	end
measure length_measure;
	
static public RemoveMember[@T] :  @T -> seq of @T -> seq of @T
RemoveMember(e)(s) == 
	cases s :
	[h]^tail		-> if e = h then tail else [h] ^ RemoveMember[@T](e)(tail),
	[]			-> []
	end;
	
static public RemoveMembers[@T] :  seq of @T -> seq of @T -> seq of @T
RemoveMembers(elemSeq)(s) == 
	cases elemSeq :
	[]			-> s,
	[h]^tail		-> RemoveMembers[@T](tail)(RemoveMember[@T](h)(s))
	end;

static public UpdateAt[@T]: nat1 -> @T -> seq of @T -> seq of @T
UpdateAt(position)(e)(s) ==
	cases mk_(position, s) :
	mk_(-, [])				-> [],
	mk_(1, [-] ^ tail)		-> [e] ^ tail,
	mk_(pos,  [h] ^ tail)	-> [h] ^ UpdateAt[@T](pos - 1)(e)(tail)
	end;

static public take[@T]: int -> seq of @T -> seq of @T
take(i)(s) == s(1,...,i);

static public TakeWhile[@T] : (@T -> bool) -> seq of @T ->seq of @T
TakeWhile(f)(s) ==
	cases s :
	[h] ^ tail	-> 
		if f(h) then
			[h] ^ TakeWhile[@T](f)(tail)
		else
			[],
	[]	-> []
	end;
	
static public drop[@T]: int -> seq of @T -> seq of @T
drop(i)(s) == s(i+1,...,len s);

static public DropWhile[@T] : (@T -> bool) -> seq of @T ->seq of @T
DropWhile(f)(s) ==
	cases s :
	[h] ^ tail	-> 
		if f(h) then
			DropWhile[@T](f)(tail)
		else
			s,
	[]	-> []
	end;

static public Span[@T] : (@T -> bool) -> seq of @T -> seq of @T * seq of @T
Span(f)(s) ==
	cases s :
	[h] ^ tail	-> 
		if f(h) then
			let	mk_(matchSeq, otherSeq) = Span[@T](f)(tail)
			in
			mk_([h] ^ matchSeq, otherSeq)
		else
			mk_([], s),
	[]	-> mk_([], [])
	end;

static public SubSeq[@T]: nat -> nat -> seq1 of @T -> seq of @T
SubSeq(startPos)(numOfElem)(s) == s(startPos,...,startPos+numOfElem-1);

static public last[@T]: seq of @T -> @T
last(s) == s(len s);

static public fmap[@T1,@T2]: (@T1 -> @T2) -> seq of @T1 -> seq of @T2
fmap(f)(s) == [f(s(i)) | i in set inds s];

public Fmap[@elem]: (@elem -> @elem) -> seq of @elem -> seq of @elem
Fmap(f)(l) ==
       if l = []
       then []
       else [f(hd l)] ^ (Fmap[@elem](f)(tl l));

static public filter[@T]: (@T -> bool) -> seq of @T -> seq of @T
filter(f)(s) == [s(i) | i in set inds s & f(s(i))];

static public Foldl[@T1, @T2] : 
	(@T1 -> @T2 -> @T1) -> @T1 -> seq of @T2 -> @T1
Foldl(f)(arg)(s) == 
	cases s :
	[]			-> arg,
	[h] ^ tail	-> Foldl[@T1,@T2](f)(f(arg)(h))(tail)
	end;

static public Foldr[@T1, @T2] : 
	(@T1 -> @T2 -> @T2) -> @T2 -> seq of @T1 -> @T2
Foldr(f)(arg)(s) == 
	cases s :
	[]			-> arg,
	[h] ^ tail	-> f(h)(Foldr[@T1,@T2](f)(arg)(tail))
	end;

static public isMember[@T] : @T -> seq of @T -> bool
isMember(e)(s) == 
	cases s :
	[h]^tail		-> e = h or isMember[@T] (e)(tail),
	[]			-> false
	end;

static public isAnyMember[@T]:  seq of @T -> seq of @T -> bool
isAnyMember(elemSeq)(s) == 
	cases elemSeq :
	[h]^tail		->  isMember[@T] (h)(s) or isAnyMember[@T] (tail)(s) ,
	[]			-> false
	end;

static public Index[@T]: @T -> seq of @T -> int
Index(e)(s) == 
	let	i = 0
	in	IndexAux[@T](e)(s)(i);

static IndexAux[@T]: @T -> seq of @T -> int -> int
IndexAux(e)(s)(indx) ==
	cases s:
		[]			-> 0,
		[x]^xs	->
			if x = e then 
				indx + 1
			else
				IndexAux[@T](e)(xs)(indx+1)
	end;
	
static public IndexAll2[@T] : @T -> seq of @T -> set of int
IndexAll2(e)(s) == {i | i in set inds s & s(i) = e};
	
static public flatten[@T] : seq of seq of @T -> seq of @T
flatten(s) == conc s;

static public compact[@T] : seq of [@T] -> seq of @T
compact(s) == [s(i) | i in set inds s & s(i) <> nil];

static public freverse[@T] : seq of @T -> seq of @T
freverse(s) == [s(len s + 1 -  i) | i in set inds s];

static public Permutations[@T]: seq of @T -> set of seq of @T
Permutations(s) == 
cases s:
	[],[-] -> {s},
	others -> dunion {{[s(i)]^j | j in set Permutations[@T](RestSeq[@T](s,i))} | i in set inds s}
end
measure length_measure;

static public RestSeq[@T]: seq of @T * nat -> seq of @T
RestSeq(s,i) == [s(j) | j in set (inds s \ {i})];

static public Unzip[@T1, @T2] : seq of (@T1 * @T2) -> seq of @T1 * seq of @T2
Unzip(s) ==
	cases s :
	[]				-> mk_([], []),
	[mk_(x, y)] ^ tail	->
		let	mk_(xs, ys) = Unzip[@T1, @T2](tail)
		in
		mk_([x] ^ xs, [y] ^ ys)
	end
measure lengthUnzip;

static lengthUnzip[@T1, @T2] : seq of (@T1 * @T2) +> nat
lengthUnzip(s) == len s;

static public Zip[@T1, @T2] : seq of @T1 * seq of @T2 -> seq of (@T1 * @T2)
Zip(s1, s2) == Zip2[@T1, @T2](s1)(s2);
                            	
static public Zip2[@T1, @T2] : seq of @T1 -> seq of @T2 -> seq of (@T1 * @T2)
Zip2(s1)(s2) == 
	cases mk_(s1, s2) :
	mk_([h1] ^ tail1, [h2] ^ tail2)		-> [mk_(h1, h2)] ^ Zip2[@T1, @T2](tail1)(tail2),
	mk_(-, -)							-> []
	end;

end Sequence
                                                                       
~~~
{% endraw %}

### SequenceT.vdmpp

{% raw %}
~~~
class SequenceT is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests() == 
	[ 
	new SequenceT25(), 
	new SequenceT23(), new SequenceT24(),
	new SequenceT19(), new SequenceT20(),
	new SequenceT21(), new SequenceT22(),
	new SequenceT01(), new SequenceT02(),
	new SequenceT03(), new SequenceT04(),
	new SequenceT05(), new SequenceT06(),
	new SequenceT07(), new SequenceT08(),
	new SequenceT09(), new SequenceT10(),
	new SequenceT11(), new SequenceT12(),
	new SequenceT13(), new SequenceT14(),
	new SequenceT15(), new SequenceT16(),
	new SequenceT17(), new SequenceT18()
	];
end SequenceT

class SequenceT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	sq = new Sequence()	in
       return (sq.Sum[int]([1,2,3,4,5,6,7,8,9]) = 45 and
       sq.Sum[int]([]) = 0) and
       Sequence`Product[int]([2, 3, 4]) = 24 and
       Sequence`Product[int]([]) = 1
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT01:\t Integer sum and product.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT01

class SequenceT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	sq = new Sequence()	in
	return sq.Sum[real]([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) = 4.5 and
	sq.Sum[real]([]) = 0.0 and
	Sequence`Product[real]([2.0, 3.0, 4.0]) = 24.0 and
	Sequence`Product[real]([]) = 1.0 and
	Sequence`Product[real]([2.1, 3.2, 4.3]) = 2.1 * 3.2 * 4.3
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT02:\t Real sum and product.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT02

class SequenceT03 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	sq = new Sequence()	in
	return sq.isAscendingOrder[int]([1,2,4,4,7,8,8,8]) and
	not sq.isAscendingOrder[real]([1.0,2.0,3.0,1.5])
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT03:\t Test isAscendingOrder (integer and real)";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT03

class SequenceT04 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	sq = new Sequence()	in
	return 
		sq.isDescendingOrder[int]([3,2,2,1,1]) and
		Sequence`isDescendingTotalOrder[int] (lambda x : int, y : int & x < y)([3,2,2,1,1]) and
		Sequence`isDescendingTotalOrder[int] (lambda x : int, y : int & x < y)([3,2,2,1,2]) = false
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT04:\t Test isDescendingTotalOrder (integer).";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT04

class SequenceT05 is subclass of TestCase
types
	public TestType = int|seq of char|char;
	public RecordType ::
		val : int
		str : seq of char
		chr : char;
operations 
public  test: () ==> bool
test() == 
	let	sq = new Sequence(),
		decideOrderFuncSeq =
			[(lambda x : int, y : int & x < y),
			lambda x : seq of char, y : seq of char & String`LT(x,y),
			lambda x : char, y : char & Character`LT(x,y)
			],
		decideOrderFunc =
			lambda x : RecordType, y :  RecordType &
				Sequence`isOrdered[SequenceT05`TestType]
					(decideOrderFuncSeq)([x.val,x.str,x.chr])([y.val,y.str,y.chr])
		in
	return 
		Sequence`sort[int](lambda x : int, y : int & x < y)([3,1,5,4]) = [1,3,4,5] and
		Sequence`sort[seq of char]
			(lambda x : seq of char, y : seq of char & String`LT(x,y))
			(["12", "111", "01"]) = ["01","111","12"] and
		Sequence`sort[SequenceT05`RecordType](decideOrderFunc)
			([mk_RecordType(10,"sahara",'c'),mk_RecordType(10,"sahara",'a')]) =
			[mk_RecordType(10,"sahara",'a'),mk_RecordType(10,"sahara",'c')] and
		sq.isOrdered[SequenceT05`TestType](decideOrderFuncSeq)([3,"123",'a'])([3,"123",'A']) = true and
		sq.isOrdered[SequenceT05`TestType](decideOrderFuncSeq)([3,"123",'a'])([3,"123",'0']) = false and
		sq.isOrdered[int|seq of char|char](decideOrderFuncSeq)([])([]) = false and
		sq.isOrdered[int|seq of char|char](decideOrderFuncSeq)([])([3,"123",'0']) = true and
		sq.isOrdered[int|seq of char|char](decideOrderFuncSeq)([3,"123",'0'])([]) = false
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT05:\t test sort and isOrdered.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT05

class SequenceT06 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	sq = new Sequence(),
		decideOrderFunc1 = lambda x : int, y : int & x < y,
		decideOrderFunc2 = lambda x : char, y : char & Character`LT(x,y)		in
	return
		sq.Merge[int](decideOrderFunc1)([1,4,6])([2,3,4,5]) = [1,2,3,4,4,5,6] and
		sq.Merge[char](decideOrderFunc2)("146")("2345") = "1234456" and
		sq.Merge[char](decideOrderFunc2)("")("2345") = "2345" and
		sq.Merge[char](decideOrderFunc2)("146")("") = "146"
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT06:\t Merge sequences.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT06

class SequenceT07 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	sq = new Sequence()		in
	return
		sq.take[int](2)([2,3,4,5]) = [2,3] and
		sq.drop[char](5)("Shin Sahara") = "Sahara" and
		sq.last[int]([1,2,3]) = 3 and
		sq.filter[int](lambda x:int & x mod 2 = 0)([1,2,3,4,5,6]) = [2,4,6] and
		Sequence`SubSeq[char](4)(3)("1234567890") = "456" and
		Sequence`flatten[int]([[1,2,3], [3,4], [4,5,6]]) = [ 1,2,3,3,4,4,5,6 ]
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT07:\t Handling sequences.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT07

class SequenceT08 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	return
		Sequence`ascendingOrderSort[int]([3,1,6,4,2,6,5]) = [1,2,3,4,5,6,6] and
		Sequence`descendingOrderSort[int]([3,1,6,4,2,6,5]) = [6,6,5,4,3,2,1] 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT08:\t Test sort.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT08

class SequenceT09 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	return
		Sequence`compact[[int]]([3,1,6,4,nil,2,6,5,nil]) = [3,1,6,4,2,6,5] and
		Sequence`compact[[int]]([nil,nil]) = [] and
		Sequence`compact[[int]]([]) = [] 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT09:\t Delete nil elements.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT09

class SequenceT10 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	return
		Sequence`freverse[[int]]([3,1,6,4,nil,2,6,5,nil]) = [nil, 5, 6, 2, nil, 4, 6, 1, 3] and
		Sequence`freverse[[int]]([]) = [] 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT10:\t Get inverse sequence.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT10

class SequenceT11 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	return
		Sequence`Permutations[[int]]([1,2,3]) =
			{ [ 1,2,3 ],
			  [ 1,3,2 ],
			  [ 2,1,3 ],
			  [ 2,3,1 ],
			  [ 3,1,2 ],
			  [ 3,2,1 ] } and
		Sequence`Permutations[[int]]([]) = {[]}
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT11:\t Get permutation.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT11

class SequenceT12 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	return
		Sequence`isMember[int](2)([1,2,3,4,5,6]) and
		Sequence`isMember[int](0)([1,2,3,4,5,6]) = false and
		Sequence`isMember[int](6)([1,2,3,4,5,6]) and
		Sequence`isAnyMember[int]([6])([1,2,3,4,5,6]) and
		Sequence`isAnyMember[int]([0,7])([1,2,3,4,5,6]) = false and
		Sequence`isAnyMember[int]([4,6])([1,2,3,4,5,6]) and
		Sequence`isAnyMember[int]([])([1,2,3,4,5,6]) = false 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT12:\t Search sequence.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT12
-------------------------------------------------------------
class SequenceT13 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	return
		Sequence`fmap[int, int](lambda x:int & x mod 3)([1,2,3,4,5])  = [1, 2, 0, 1, 2] and
		Sequence`fmap[seq of char, seq of char]
			(Sequence`take[char](2))(["Shin Sahara", "Hiroshi Sakoh"]) = ["Sh", "Hi"]
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT13:\tTest fmap.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT13
-------------------------------------------------------------
class SequenceT14 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	index = Sequence`Index,
		indexAll = Sequence`IndexAll2
	in
	return
		index[int](1)([1,2,3,4,5])  = 1 and
		index[int](5)([1,2,3,4,5])  = 5 and
		index[int](9)([1,2,3,4,5])  = 0 and
		index[char]('b')(['a', 'b', 'c'])  = 2 and
		index[char]('z')(['a', 'b', 'c'])  = 0 and
		indexAll[int](9)([1,2,3,4,5]) = {} and
		indexAll[int](9)([]) = {} and
		indexAll[int](1)([1,2,3,4,1]) = {1,5} and
		indexAll[int](1)([1,2,3,4,1,1]) = {1,5,6} 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT14:\t Test Index.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT14
-------------------------------------------------------------
class SequenceT15 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	avg1 = Sequence`GetAverage[int],
		avg2 = Sequence`GetAverage[real]
	in
	return
		avg1([]) = nil and
		avg1([1,2,3,4]) = (1+2+3+4) / 4 and
		avg2([1.3, 2.4, 3.5]) = 7.2 / 3
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT15:\t Test GetAverage.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT15
-------------------------------------------------------------
class SequenceT16 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	ins1 = Sequence`InsertAt[int],
		ins2 = Sequence`InsertAt[char]
	in
	return
		ins1(1)(1)([2,3,4,5]) = [1,2,3,4,5] and
		ins1(3)(3)([1,2,4,5]) = [1,2,3,4,5] and
		ins1(3)(3)([1,2]) = [1,2,3] and
		ins1(4)(3)([1,2]) = [1,2,3] and
		ins1(5)(3)([1,2]) = [1,2,3] and
		ins2(1)('1')("2345") = "12345" and
		ins2(3)('3')("1245") = "12345" and
		ins2(3)('3')("12") = "123"
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT16:\t Test InsertAt.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT16
-------------------------------------------------------------
class SequenceT17 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	rm1 = Sequence`RemoveAt[int],
		rm2 = Sequence`RemoveAt[char]
	in
	return
		rm1(1)([1,2,3,4,5]) = [2,3,4,5] and
		rm1(3)([1,2,4,3]) = [1,2,3] and
		rm1(3)([1,2]) = [1,2] and
		rm1(4)([1,2]) = [1,2] and
		rm1(5)([1,2]) = [1,2] and
		rm2(1)("12345") = "2345" and
		rm2(3)("1243") = "123" and
		rm2(3)("12") = "12"
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT17:\t Test RemoveAt.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT17
-------------------------------------------------------------
class SequenceT18 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	up1 = Sequence`UpdateAt[int],
		up2 = Sequence`UpdateAt[char]
	in
	return
		up1(1)(10)([1,2,3,4,5]) = [10,2,3,4,5] and
		up1(3)(40)([1,2,4,3]) = [1,2,40,3] and
		up1(2)(30)([1,2]) = [1,30] and
		up1(3)(30)([1,2]) = [1,2] and
		up1(4)(30)([1,2]) = [1,2] and
		up2(1)('a')("12345") = "a2345" and
		up2(3)('b')("1243") = "12b3" and
		up2(3)('c')("123") = "12c" and
		up2(3)('c')("12") = "12"
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT18:\t Test UpdateAt.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT18
-------------------------------------------------------------
class SequenceT19 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	removeDup = Sequence`RemoveDup[int],
		removeMember = Sequence`RemoveMember[int],
		removeMembers = Sequence`RemoveMembers[int]
	in
	return
		removeDup([]) = [] and
		removeDup([1,1,2,2,2,3,4,4,4,4]) = [1,2,3,4] and
		removeDup([1,2,3,4]) = [1,2,3,4] and
		removeMember(1)([]) = [] and
		removeMember(1)([1,2,3]) = [2,3] and
		removeMember(4)([1,2,3]) = [1,2,3] and
		removeMembers([])([]) = [] and
		removeMembers([])([1,2,3]) = [1,2,3] and
		removeMembers([1,2,3])([]) = [] and
		removeMembers([1,2,3])([1,2,3]) = [] and
		removeMembers([1,4,5])([1,2,3,4]) = [2,3] 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT19:\t Test removes.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT19
-------------------------------------------------------------
class SequenceT20 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	zip = Sequence`Zip[int, char],
		zip2 = Sequence`Zip2[int,char],
		unzip = Sequence`Unzip[int, char]
	in
	return
		zip([], []) = [] and
		zip([1,2,3], ['a', 'b', 'c']) = [mk_(1, 'a'), mk_(2, 'b'), mk_(3, 'c')] and
		zip([1,2], ['a', 'b', 'c']) = [mk_(1, 'a'), mk_(2, 'b')] and
		zip([1,2,3], ['a', 'b']) = [mk_(1, 'a'), mk_(2, 'b')] and
		zip2([])([]) = [] and
		zip2([1,2,3])(['a', 'b', 'c']) = [mk_(1, 'a'), mk_(2, 'b'), mk_(3, 'c')] and
		unzip([]) = mk_([], []) and
		unzip([mk_(1, 'a'), mk_(2, 'b'), mk_(3, 'c')]) = mk_([1,2,3], ['a', 'b', 'c']) 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT20:\t Test zip related functions.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT20
-------------------------------------------------------------
class SequenceT21 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	span = Sequence`Span[int],
		p1 = lambda x : int & x mod 2 = 0,
		p2 = lambda x : int & x < 10
 	in
	return
		span(p1)([]) = mk_([], []) and
		span(p1)([2,4,6,1,3]) = mk_([2,4,6], [1,3]) and
		span(p2)([1,2,3,4,5]) = mk_([1,2,3,4,5], []) and
		span(p2)([1,2,12,13,4,15]) = mk_([1,2], [12,13,4,15])
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT21:\t Test span.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT21
-------------------------------------------------------------
class SequenceT22 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	takeWhile = Sequence`TakeWhile[int],
		dropWhile = Sequence`DropWhile[int],
		p1 = lambda x : int & x mod 2 = 0
 	in
	return
		takeWhile(p1)([]) = [] and
		takeWhile(p1)([2,4,6,8,1,3,5,2,4]) = [2,4,6,8] and
		dropWhile(p1)([]) = [] and
		dropWhile(p1)([2,4,6,8,1,2,3,4,5]) = [1,2,3,4,5] 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT22:\t Test TakeWhile and DropWhile.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT22
-------------------------------------------------------------
class SequenceT23 is subclass of TestCase
functions
public plus : int -> int -> int
plus(a)(b) == a + b;

public product : int -> int -> int
product(a)(b) == a * b;

public append : seq of char -> char -> seq of char
append(s)(e) == s ^ [e];

operations 
public  test: () ==> bool
test() == 
	let	foldl = Sequence`Foldl[int, int],
		f2 = Sequence`Foldl[seq of char, char]
 	in
	return
		foldl(plus)(0)([1,2,3]) = 6 and
		foldl(product)(1)([2,3,4]) = 24 and
		f2(append)([])("abc") = "abc" 
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT23:\t Test Foldl.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT23
-------------------------------------------------------------
class SequenceT24 is subclass of TestCase
functions
public plus : int -> int -> int
plus(a)(b) == a + b;

public product : int -> int -> int
product(a)(b) == a * b;
operations 
public  test: () ==> bool
test() == 
	let	removeAt = Sequence`RemoveAt[char],
		foldr = Sequence`Foldr[int, int],
		f3 = Sequence`Foldr[nat1, seq of char]
 	in
	return
		foldr(plus)(0)([1,2,3]) = 6 and
		foldr(product)(1)([2,3,4]) = 24 and
		f3(removeAt)("12345")([1,3,5]) = "24"
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT24:\t Test Foldr.";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT24
-------------------------------------------------------------
class SequenceT25 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	let	sq = new Sequence()	in
	return
		Real`EQ(sq.GetAverage[real]([1.1,2.2,3.3]))(2.2) and
		Real`EQ(sq.GetAverage[real]([1,2,3,4,5,6,7,8,9,10]))(5.5)
;
protected setUp: () ==> ()
setUp() == TestName := "SequenceT25:\t Test GetAverage";
protected tearDown: () ==> ()
tearDown() == return;
end SequenceT25
~~~
{% endraw %}

### Set.vdmpp

{% raw %}
~~~
class Set

functions 
-- Same as VDMUtil`set2seq which is implemented by C++
static public asSequence[@T]: set of @T -> seq of @T
asSequence(aSet) ==  
	cases aSet :
		{}		-> [],
		{x} union xs	-> [x] ^ asSequence[@T](xs)
	end
post
	hasSameElems[@T](RESULT, aSet)
measure cardinality;

static cardinality[@T]: set of @T +> nat
cardinality(aSet) == card aSet;

static public hasSameElems[@T] : (seq of @T) * (set of @T) -> bool
hasSameElems(aSeq,aSet) == (elems aSeq = aSet) and (len aSeq = card aSet);

static public Combinations[@T] : nat1 -> set of @T -> set of set of @T
Combinations(n)(aSet) ==
	{ aElem | aElem in set power aSet & card aElem = n};


static public fmap[@T1,@T2]: (@T1 -> @T2) -> set of @T1 -> set of @T2
fmap(f)(aSet) == {f(s) | s in set aSet};

static public Sum[@T]: set of @T ->  @T
Sum(aSet) == SumAux[@T](aSet)(0)
pre
	is_(aSet, set of int) or is_(aSet, set of nat) or is_(aSet, set of nat1) or
 	is_(aSet, set of real) or is_(aSet, set of rat);

static SumAux[@T] : set of @T -> @T -> @T
SumAux(aSet)(aSum) ==
	cases aSet :
	({})	-> aSum,
	{e} union s->
		SumAux[@T](s)(if is_real(aSum) and is_real(e)
		              then aSum + e
		              else undefined)
	end
pre
	pre_Sum[@T](aSet);

end Set
~~~
{% endraw %}

### SetT.vdmpp

{% raw %}
~~~
class SetT is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests () == 
	[
		new SetT01(),
		new SetT02(),
		new SetT03(),
		new SetT04()
	];
end SetT
----------------------------------------
class SetT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		Set`hasSameElems[int](Set`asSequence[int]({1,2,3,4}),{1,2,3,4}) and
		(elems Set`asSequence[int]({1,2,3,3,4}) = {1,2,3,4})
;
protected setUp: () ==> ()
setUp() == TestName := "SetT01:\t Compare sequences and convert to sequence.";
protected tearDown: () ==> ()
tearDown() == return;
end SetT01
----------------------------------------

class SetT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		Set`Combinations[int](2)({1,2,3}) = { { 1,2 }, { 1,3 }, { 2,3 } } and
		Set`Combinations[int](2)({1,2,3,4}) = { { 1,2 },  { 1,3 },  { 1,4 },  { 2,3 },  { 2,4 },  { 3,4 } } and
		Set`fmap[set of int, set of set of int](Set`Combinations[int](2))({{1,2,3}, {1,2,3,4}}) =
			{{ { 1,2 }, { 1,3 }, { 2,3 } }, { { 1,2 },  { 1,3 },  { 1,4 },  { 2,3 },  { 2,4 },  { 3,4 } } } and
		Set`Combinations[int](3)({1,2,3,4}) = { { 1,2,3 },  { 1,2,4 },  { 1,3,4 },  { 2,3,4 } } and
		Set`Combinations[seq of char](2)({"Sahara", "Sato", "Sakoh", "Yatsu", "Nishikawa" }) = 
			{ { "Sahara",    "Sato" },  { "Sahara",    "Nishikawa" },  { "Sahara",    "Yatsu" },  { "Sahara",    "Sakoh" },  { "Sato",    "Nishikawa" }, 
			{ "Sato",    "Yatsu" },  { "Sato",    "Sakoh" },  { "Nishikawa",    "Yatsu" },  { "Nishikawa",    "Sakoh" },  { "Yatsu",    "Sakoh" } }
;
protected setUp: () ==> ()
setUp() == TestName := "SetT02:\t Get combination.";
protected tearDown: () ==> ()
tearDown() == return;
end SetT02
-------------------------------------------------------------

class SetT03 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	return
		Set`fmap[int, int](lambda x:int & x mod 3)({1,2,3,4,5})  = {0, 1, 2} and
		Set`fmap[seq of char, seq of char]
			(Sequence`take[char](2))({"Shin Sahara", "Hiroshi Sakoh"}) = {"Sh", "Hi"}
;
protected setUp: () ==> ()
setUp() == TestName := "SetT03:\t Test fmap.";
protected tearDown: () ==> ()
tearDown() == return;
end SetT03
-------------------------------------------------------------

class SetT04 is subclass of TestCase
operations 
public  test: () ==> bool
test() == 
	return
		Set`Sum[int]({1,...,10}) = 55 and
		Set`Sum[int]({1, 2, 3, 4, 5, 6, 7, 8,  9, 10}) = 55 and
		abs(Set`Sum[real]({0.1, 0.2, 0.3}) - 0.6) <= 1E-5 and
		Set`Sum[nat]({1, 2, 3, 3}) = 6
;
protected setUp: () ==> ()
setUp() == TestName := "SetT04:\tTest sum of set elements.";
protected tearDown: () ==> ()
tearDown() == return;
end SetT04
~~~
{% endraw %}

### String.vdmpp

{% raw %}
~~~
class String is subclass of Sequence

functions

--Conversion functions
static public asInteger: seq of char -> int
asInteger(s) == String`AsIntegerAux(s)(0);

static private AsIntegerAux : seq of char -> int -> int
AsIntegerAux(s)(sum) ==
	if s = [] then
		sum
	else
		AsIntegerAux(tl s)(10 * sum + Character`asDigit(hd s));
--	measure length;

static length : seq of char +> nat
length(s) == len s;

static lengthNil : [seq of char] +> nat
lengthNil(s) == if s = nil then 0 else len s;
	
--Decision functions
static public isSomeString: (char -> bool) -> seq of char -> bool
isSomeString(f)(s) == forall i in set inds s & f(s(i));

static public isDigits : seq of char -> bool
isDigits(s) == isSomeString(Character`isDigit)(s);

static public isLetters : seq of char -> bool
isLetters(s) == isSomeString(Character`isLetter)(s);

static public isLetterOrDigits : seq of char -> bool
isLetterOrDigits(s) == isSomeString(Character`isLetterOrDigit)(s);

static public isSpaces : [seq of char] -> bool
isSpaces(s) ==isSomeString(lambda c : char & c = ' ' or c = '\t')(s);

static public LT : seq of char * seq of char -> bool
LT(s1, s2) == String`LT2(s1)(s2);

static public LT2 : seq of char -> seq of char -> bool
LT2(s1)(s2) == 
	cases mk_(s1,s2):
		mk_([],[])		-> false,
		mk_([],-)		-> true,
		mk_(-^-,[])	-> false,
		mk_([head1]^tails1,[head2]^tails2)	->
			if Character`LT(head1,head2) then
				true
			elseif Character`LT(head2,head1) then
				false
			else
				String`LT(tails1, tails2)
	end;

static public LE : seq of char * seq of char -> bool
LE(s1, s2) == String`LE2(s1)(s2);

static public LE2 : seq of char -> seq of char -> bool
LE2(s1)(s2) == String`LT2(s1)(s2) or s1 = s2;

static public GT : seq of char * seq of char -> bool
GT(s1, s2) == String`GT2(s1)(s2);

static public GT2 : seq of char -> seq of char -> bool
GT2(s1)(s2) == String`LT(s2, s1);

static public GE : seq of char * seq of char -> bool
GE(s1, s2) == String`GE2(s1)(s2);

static public GE2 : seq of char -> seq of char -> bool
GE2(s1)(s2) == not String`LT2(s1)(s2);

static public Index: char -> seq of char -> int
Index(c)(aStr) == Sequence`Index[char](c)(aStr);

static public indexAll : seq of char * char -> set of int
indexAll(aStr,c) == Sequence`IndexAll2[char](c)(aStr);

static public IndexAll2 : char -> seq of char -> set of int
IndexAll2(c)(aStr) == Sequence`IndexAll2[char](c)(aStr);

static public isInclude : seq of char -> seq of char -> bool
isInclude(aStr)(aTargetStr) ==
	let	indexSet = indexAll(aStr,aTargetStr(1))
	in	exists i in set indexSet & 
			SubStr(i)(len aTargetStr)(aStr) = aTargetStr
pre
	aTargetStr <> ""
	;

static public subStr :
	seq1 of char * nat * nat -> seq of char
subStr(aStr,fromPos,length) == aStr(fromPos,...,fromPos+length-1);

static public SubStr : nat -> nat -> seq1 of char -> seq of char
SubStr(fromPos)(length)(aStr) == aStr(fromPos,...,fromPos+length-1);

static public GetToken : seq of char * set of char -> seq of char
GetToken(s, aDelimitterSet) == 
	TakeWhile[char](lambda c : char & c not in set aDelimitterSet)(s);

static public DropToken : seq of char * set of char -> seq of char
DropToken(s, aDelimitterSet) == 
	DropWhile[char](lambda c : char & c not in set aDelimitterSet)(s);

static public getLines : seq of char -> seq of seq of char
getLines(s) ==
	getLinesAux(s)([]);

static public getLinesAux : seq of char -> seq of seq of char -> seq of seq of char
getLinesAux(s)(line) ==
	if s = [] then
		line
	else
		let wDelimitterSet = {'\n'},
			wHeadLine = GetToken(s, wDelimitterSet),
			wTailStringCandidate = DropToken(s, wDelimitterSet),
			wTailString = 
				if wTailStringCandidate <> [] and hd wTailStringCandidate = '\n' then tl wTailStringCandidate 
				else wTailStringCandidate
		in
		getLinesAux(wTailString)(line ^ [wHeadLine]);
--measure length;

operations
static public index: seq of char * char ==> int
index(aStr,c) == (
	for i = 1 to len aStr do
		if aStr(i) = c then return i;
	return 0
);

static public subStrFill :
	seq of char * nat * nat * char ==> seq of char
subStrFill(aStr,fromPos,length, fillChar) ==
	let	lastPos = fromPos+length-1
	in (
		dcl aResult : seq of char := "";
		for i = fromPos to lastPos  do (
			if i <= len aStr then
				aResult := aResult ^ [aStr(i)]
			else
				aResult := aResult ^ [fillChar]
		);
		return aResult
	)
pre
	fromPos > 0 and length >= 0;

end String
~~~
{% endraw %}

### StringT.vdmpp

{% raw %}
~~~
class StringT is subclass of TestDriver 
functions
public tests : () -> seq of TestCase
tests () == 
	[
	new StringT01(), new StringT02(), 
	new StringT03(), new StringT04(),
	new StringT05(), new StringT06(),
	new StringT07(), new StringT08(),
	new StringT09(), -- new StringT10(),
	new StringT11(), new StringT12(),
	new StringT13(), new StringT14()
	];
end StringT

class StringT01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	c = new Character()	in
	return
		(
		c.isDigit('0') = true and
		c.isDigit('1') = true and
		c.isDigit('2') = true and
		c.isDigit('3') = true and
		c.isDigit('4') = true and
		c.isDigit('5') = true and
		c.isDigit('6') = true and
		c.isDigit('7') = true and
		c.isDigit('8') = true and
		c.isDigit('9') = true and
		c.isDigit('a') = false and
		c.asDigit('0') = 0 and
		c.asDigit('1') = 1 and
		c.asDigit('2') = 2 and
		c.asDigit('3') = 3 and
		c.asDigit('4') = 4 and
		c.asDigit('5') = 5 and
		c.asDigit('6') = 6 and
		c.asDigit('7') = 7 and
		c.asDigit('8') = 8 and
		c.asDigit('9') = 9 and
		c.asDigit('a') = false )
;
protected setUp: () ==> ()
setUp() == TestName := "StringT01:\tConvert digit to integer.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT01

class StringT02 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	c = new Character()	in
	return
		(c.asDictOrder('0') = 1 and
		c.asDictOrder('9') = 10 and
		c.asDictOrder('a') = 11 and
		c.asDictOrder('A') = 12 and
		c.asDictOrder('z') = 61 and
		c.asDictOrder('Z') = 62 and
		c.asDictOrder('\n') = 999999 and
		c.asDictOrder('\t') = 999999 )
;
protected setUp: () ==> ()
setUp() == TestName := "StringT02:\tReturn dictionary order of character.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT02

class StringT03 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	s = new String(),
		LT = String`LT2,
		LE = String`LE2,
		GT = String`GT2,
		GE = String`GE2
	in
	return
		(s.LT("123","123") = false and
		LT("123")("123") = false and
		s.GT("123","123") = false and
		GT("123")( "123") = false and
		s.LT("","") = false and
		s.GT("","") = false and
		s.LT("","123") = true and
		s.GT("","123") = false and
		s.LT("123","") = false and
		s.GT("123","") and
		s.LT("123","1234") and
		s.GT("123","1234") = false and
		s.LT("1234","123") = false and
		s.GT("1234","123") and
		s.LT("123","223") and
		s.GT("123","223") = false and
		s.LE("123","123") and
		LE("123")("123") and
		s.GE("123","123") and
		s.LE("123","1234") and
		LE("123")("1234") and
		s.GE("123","1234") = false and
		GE("123")("1234") = false and
		s.LE("1234","123") = false and
		not LE("1234")("123") and
		s.GE("1234","123") and
		s.LE("","") and
		LE("")("") and
		Sequence`fmap[seq of char, bool](LT("123"))(["123", "1234", "", "223"]) = [false, true, false, true] and
		Sequence`fmap[seq of char, bool](LE("123"))(["1234", ""]) = [true, false] and
		Sequence`fmap[seq of char, bool](GT("123"))([ "123", "", "23"]) = [false, true, false] and
		Sequence`fmap[seq of char, bool](GE("123"))(["1234", ""]) = [false, true] 
		)
;
protected setUp: () ==> ()
setUp() == TestName := "StringT03:\tCompare magnitude of string.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT03

class StringT04 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	s1234 = "1234",
		s = new String()	in
	return
		s1234 = "1234" and
		s.isSpaces("") = true and
		s.isSpaces("  ") = true and
		s.isSpaces(" \t  ") = true and
		s.isSpaces([]) = true 
;
protected setUp: () ==> ()
setUp() == TestName := "StringT04:\tCompare 2 strings is equal.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT04

class StringT05 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	LT = Character`LT,
		GT = Character`GT,
		LE = Character`LE,
		GE = Character`GE
	in
	return
		(LT('a','a') = false and
		Character`LT2('a')('a') = false and
		GT('a','a') = false and
		Character`GT2('a')('a') = false and
		LT('1','2') and
		Character`LT2('1')('2') and
		GT('1','0') and
		Character`GT2('1')('0') and
		LT('9','a') and
		Character`LT2('9')('a') and
		GT('\n','0') and
		Character`GT2('\n')('0') and
		LE('a','0') = false and
		Character`LE2('a')('0') = false and
		GE('a','0') and
		Character`GE2('a')('0') and
		Sequence`fmap[char, bool](Character`LT2('5'))("456") = [false, false, true]
		)
;
protected setUp: () ==> ()
setUp() == TestName := "StringT05:\tCompare magnitude of character.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT05

class StringT06 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	s = new String(),
		substr = String`SubStr
	in
	return
		(s.subStr("Shin Sahara",6,6) = "Sahara" and
		s.subStr("Shin Sahara",6,8) = "Sahara" and
		s.subStr("Shin Sahara",6,3) = "Sah" and
		s.subStr("Shin Sahara",1,0) = "" and
		s.subStrFill("sahara",1,3,'*') = "sah" and
		s.subStrFill("sahara",1,6,'*') = "sahara" and
		s.subStrFill("sahara",1,10,'*') = "sahara****" and
		s.subStrFill("sahara",3,4,'*') = "hara" and
		s.subStrFill("sahara",3,10,'*') = "hara******" and
		s.subStrFill("sahara",1,0,'*') = "" and
		s.subStrFill("",1,6,'*') = "******" and
		String`SubStr(6)(6)("Shin Sahara") = "Sahara" and
		substr(6)(8)("Shin Sahara") = "Sahara" and
		Sequence`fmap[seq of char, seq of char](substr(6)(8))(["1234567890", "12345671"]) = ["67890", "671"]
		)
;
protected setUp: () ==> ()
setUp() == TestName := "StringT06:\tGet substring.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT06


class StringT07 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		(String`isDigits("1234567890")  = true and
		String`asInteger("1234567890")  = 1234567890 and
		String`asInteger("")  = 0 
		)
;
protected setUp: () ==> ()
setUp() == TestName := "StringT07:\tHandling digit strings.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT07

class StringT08 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	return
		(
		String`index("1234567890",'1')  = 1 and
		String`index("1234567890",'0') = 10 and
		String`index("1234567890",'a')  = 0 and
		String`indexAll("1234567890",'1')  = {1} and
		String`indexAll("1234567890",'0') = {10} and
		String`indexAll("1234567890",'a')  = {} and 
		String`indexAll("1231567190",'1')  = {1,4,8} and 
		String`indexAll("1231567191",'1')  = {1,4,8,10} and
		String`Index('1')("1234567890")  = 1 and
		String`Index('0')("1234567890") = 10 and
		String`Index('a')("1234567890")  = 0 and
		String`IndexAll2('1')("1234567890")  = {1} and
		String`IndexAll2('0')("1234567890") = {10} and
		String`IndexAll2('a')("1234567890")  = {} and 
		String`IndexAll2('1')("1231567190")  = {1,4,8} and 
		String`IndexAll2('1')("1231567191")  = {1,4,8,10} and
		Sequence`fmap[seq of char, int](String`Index('1'))(["1234567890", "2345671"]) = [1, 7] and
		Sequence`fmap[seq of char, set of int](String`IndexAll2('1'))(["1231567190", "1231567191"]) = [{1,4,8}, {1,4,8,10}]
		)
;
protected setUp: () ==> ()
setUp() == TestName := "StringT08:\tGet first position of a character in a string.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT08

class StringT09 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let isInclude = String`isInclude
	in
	return
		(String`isInclude("1234567890")( "abc")  = false and
		isInclude("Shin")("Shin") = true and
		isInclude("Shin")("S") = true and
		isInclude("Shin")("h") = true and
		isInclude("Shin")("n") = true
		)
;
protected setUp: () ==> ()
setUp() == TestName := "StringT09:\tIs a string the substring of another string.";
protected tearDown: () ==> ()
tearDown() == return;
end StringT09

class StringT10 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
		tixe {<RuntimeError>  |->  return true } in
		return String`isInclude("Shin Sahara")("")
;
protected setUp: () ==> ()
setUp() == TestName := "StringT10:\tIs a string the substring of another string. In case of pre-condition error";
protected tearDown: () ==> ()
tearDown() == return;
end StringT10

class StringT11 is subclass of TestCase
operations 
public test: () ==> bool
test() == 
	return 
		let 区切り文字 = elems "\t\n " in
		String`GetToken("sahara\tshin", 区切り文字) = "sahara" and
		String`GetToken("sahara\tshin SCSK", 区切り文字) = "sahara" and
		String`DropToken("sahara\tshin", 区切り文字) = "\tshin" and
		String`DropToken("sahara\tshin SCSK", 区切り文字) = "\tshin SCSK" and
		String`DropToken("sahara\tshin SCSK\n", 区切り文字) = "\tshin SCSK\n"
;
protected setUp: () ==> ()
setUp() == TestName := "StringT11:\t指定した文字列の先頭tokenを得る。";
protected tearDown: () ==> ()
tearDown() == return;
end StringT11

/*
シナリオID
	文字列を行に分解するシナリオ
内容
	文字列を行に分解するかを検査する。
*/
class StringT12 is subclass of TestCase
operations 
public test: () ==> bool
test() == 
	return 
		let 対象文字列1 = "private 次状態を得る : () ==> 「状態」\n次状態を得る(aガード, aガード引数, aイベント, aイベント引数,  a処理時間) == (\ncases mk_(aガード, 現在状態, aイベント)  :\n\tmk_(-,-,(エラー検知)) -> return エラー中,\n",
			ss1 = String`getLines(対象文字列1),
			対象文字列2 = "佐原\n伸",
			ss2 = String`getLines(対象文字列2)
		in
		ss1(1) = "private 次状態を得る : () ==> 「状態」" and
		ss1(2) = "次状態を得る(aガード, aガード引数, aイベント, aイベント引数,  a処理時間) == (" and
		ss1(3) = "cases mk_(aガード, 現在状態, aイベント)  :" and
		ss1(4) = "\tmk_(-,-,(エラー検知)) -> return エラー中," and
		ss2(1) = "佐原" and
		ss2(2) = "伸"
;
protected setUp: () ==> ()
setUp() == TestName := "StringT12:\t文字列を行に分解する。";
protected tearDown: () ==> ()
tearDown() == return;
end StringT12

/*
シナリオID
	英数字か判定するシナリオ
内容
	英数字か判定が正しいかを検査する。
*/
class StringT13 is subclass of TestCase
operations 
public test: () ==> bool
test() == 
	return 
		let	w英字列 = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ",
			w数字列 = "0123456789",
			w英数字列 = w英字列 ^ w数字列
		in
		String`isLetters(w英字列) and
		not String`isLetters(" " ^ w英字列) and
		String`isDigits(w数字列) and
		not String`isDigits(" " ^ w数字列) and
		not String`isDigits("a" ^ w数字列) and
		String`isLetterOrDigits(w英数字列)  and
		not String`isLetterOrDigits(w英数字列 ^ " ") 
;
protected setUp: () ==> ()
setUp() == TestName := "StringT13:\t英数字かの判定が正しいかを検査する。";
protected tearDown: () ==> ()
tearDown() == return;
end StringT13

class StringT14 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	isSomeString = String`isSomeString
	in	return 
		isSomeString(Character`isLetterOrDigit)("007isTheMmurder") and
		not isSomeString(Character`isLetterOrDigit)("007 is the mmurder") and
		isSomeString(Character`isCapitalLetter)("SAHARA") and
		not isSomeString(Character`isCapitalLetter)("Sahara") and
		isSomeString(Character`isLowercaseLetter)("sahara") and
		not isSomeString(Character`isLowercaseLetter)("Sahara") 
		
;
protected setUp: () ==> ()
setUp() == TestName := "StringT11:\tIs a some kind of string?";
protected tearDown: () ==> ()
tearDown() == return;
end StringT14

~~~
{% endraw %}

### Term.vdmpp

{% raw %}
~~~
class Term

values
	Rcsid = "$Id: Term.vpp,v 1.1 2005/10/31 02:15:42 vdmtools Exp $";

instance variables
startTime : [Time];
endTime : [Time];

functions
static public isInThePeriod : Time * Term -> bool
isInThePeriod(aTime, aPeriod) ==
	(aPeriod.getStartTime() = nil or aPeriod.getStartTime().LE(aTime)) and
	(aPeriod.getEndTime() = nil or aPeriod.getEndTime().GE(aTime));

public EQ : Term -> bool
EQ(aPeriod) == 
	self.getStartTime().EQ(aPeriod.getStartTime()) and self.getEndTime().EQ(aPeriod.getEndTime());

operations
public Term:[Time]*[Time] ==> Term
Term(astartTime, aendTime) ==
	(
	startTime := astartTime;
	endTime := aendTime;
	return self
	);

public getStartTime : () ==> [Time]
getStartTime() == return startTime;

public getEndTime : () ==> [Time]
getEndTime() == return endTime;
	
end  Term
~~~
{% endraw %}

### TermT.vdmpp

{% raw %}
~~~
class TermT is subclass of TestDriver 
functions
public tests : () -> seq of TestCase
tests() == 
	[ 
	new TermT01()
	];
end TermT
----------------------------------------------------------

class TermT01 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	cal = new JapaneseCalendar(),
		astartTime = new Time(cal, 2003, 7, 30, 14, 29, 30, 20),
		aendTime = new Time(cal, 2003, 7, 30, 14, 29, 30, 22),
		t1        = new Time(cal, 2003, 7, 30, 14, 29, 30, 19),
		t2        = new Time(cal, 2003, 7, 30, 14, 29, 30, 20),
		t3        = new Time(cal, 2003, 7, 30, 14, 29, 30, 21),
		t4        = new Time(cal, 2003, 7, 30, 14, 29, 30, 22),
		t5        = new Time(cal, 2003, 7, 30, 14, 29, 30, 23),
		t6        = new Time(cal, 2003, 7, 29, 14, 29, 30, 20),
		t7        = new Time(cal, 2003, 7, 31, 14, 29, 30, 20),
		t8        = new Time(cal, 2003, 7, 29, 14, 29, 29, 20),
		t9        = new Time(cal, 2003, 7, 29, 14, 29, 31, 20),
		term1 = new Term(astartTime, aendTime)
	in
	return
		not term1.isInThePeriod(t1, term1) and
		term1.isInThePeriod(t2, term1) and
		term1.isInThePeriod(t3, term1) and
		term1.isInThePeriod(t4, term1) and
		not term1.isInThePeriod(t5, term1) and
		not term1.isInThePeriod(t6, term1) and
		not term1.isInThePeriod(t7, term1) and
		not term1.isInThePeriod(t8, term1) and
		not term1.isInThePeriod(t9, term1)
	;
protected setUp: () ==> ()
setUp() == TestName := "TermT01:\tTest of term constructor and isInThePeriod()";
protected tearDown: () ==> ()
tearDown() == return;
end TermT01
----------------------------------------------------------
~~~
{% endraw %}

### TestCase.vdmpp

{% raw %}
~~~
class TestCase

instance variables

	public TestName: seq of char := "** anonymous regression test **";

operations
public TestACase: () ==> bool
TestACase() == 
	(dcl	r: bool;
	setUp();
	r := test();
	tearDown();
	return r);
	
public getTestName: () ==> seq of char
getTestName() == return TestName;

protected test: () ==> bool
test() == is subclass responsibility;

protected setUp: () ==> ()
setUp() == return;

protected tearDown: () ==> ()
tearDown() == return;

end TestCase

~~~
{% endraw %}

### TestDriver.vdmpp

{% raw %}
~~~
class TestDriver
--Super class of TestDriver

functions

--Return all TestCases
public tests : () -> seq of TestCase
tests() == is subclass responsibility;

--Confirm test result
public isOK: TestCase -> bool
isOK(t) ==
	if t.TestACase() then
		new TestLogger().Succeeded(t)
	else
		new TestLogger().Failed(t);

operations

--Test a TestCase sequence.
public run: () ==> bool
run() ==
	let	Message = "Test result of a testcase seaquence.",
		TestcaseSeq = tests()	,
		aResult = [isOK(TestcaseSeq(i)) | i in set inds TestcaseSeq]
		--aResult = new Sequence().fmap[TestCase,bool](isOK)(TestcaseSeq)
	in
	if  forall i in set inds aResult & aResult(i) then
		return new TestLogger().succeededInAllTestcases(Message)
	else
		return new TestLogger().notSucceededInAllTestcases(Message)
	
end TestDriver

~~~
{% endraw %}

### TestLogger.vdmpp

{% raw %}
~~~
--$Id: TestLogger.vpp,v 1.2 2006/04/04 07:03:05 vdmtools Exp $
class TestLogger
--テストのログを管理する

values

hisotoryFileName = "VDMTESTLOG.TXT"

functions

public Succeeded: TestCase -> bool
Succeeded(t) == 
	let	Message = t.getTestName()^"\t OK.\n",
		- = new IO().fecho(hisotoryFileName, Message, <append>)	,
		- = new IO().echo(Message)		in
	true;

public Failed: TestCase -> bool
Failed(t) == 
	let	Message = t.getTestName()^"\t NG.\n",
		- = new IO().fecho(hisotoryFileName, Message, <append>),
		- = new IO().echo( Message)		in
	false;

public succeededInAllTestcases : seq of char -> bool
succeededInAllTestcases(m) ==
	let	Message = m ^ "\t OK!!\n",
		- = new IO().fecho(hisotoryFileName, Message, <append>),
		- = new IO().echo( Message)
	in
	true;
	
public notSucceededInAllTestcases :  seq of char -> bool
notSucceededInAllTestcases(m) ==
	let	Message = m ^ "\t NG!!\n",
		- = new IO().fecho(hisotoryFileName,  Message, <append>),
		- = new IO().echo( Message)
	in
	false;

end TestLogger
~~~
{% endraw %}

### Time.vdmpp

{% raw %}
~~~
class Time is subclass of CalendarDefinition
/*
Responsibility
	時間を表す。
Abstract
	私は時間あるいはアナリシス・パターンで言うところの時点であり、aDateの時間を表す。
	例えば2003年7月28日14時15分59秒を表す。
*/

values
public hoursPerDay = 24;	--１日の時間数
public minutesPerHour = 60;	--１時間の分数
public secondsPerMinute = 60;	--１分の秒数
public ミリ = 1000;		--ミリを通常の単位にするための倍数
public milliSecondsPerDay = hoursPerDay * minutesPerHour * secondsPerMinute * ミリ;	--１日=２４時間をmilliSecondで表した数
public milliSecondsPerHour = minutesPerHour * secondsPerMinute * ミリ;	--１時間をmilliSecondで表した数
private io = new IO();

types
public TimeInMilliSeconds = nat;	--１日の時刻を０時を0としたmilliSecond単位で持つ。
	
instance variables
/*　本来は、Javaのようにdate・時間を合わせてmilliSecond単位で持つべきだろうが、
　　Dateは倍精度浮動小数点数でModifiedJulianDateを持っているため、時間の精度は５分程度となる。
　　このため、dateと時刻を分けて持つことにした。
*/
sDate : Date;
sTime : TimeInMilliSeconds;
	
operations
--Constructor
public Time : Calendar * int * int * int * nat * nat * nat  * nat ==> Time
Time(cal, year, month, 日, 時, aMinute, aSecond, milliSecond) ==
	(
	sDate := cal.getDateFrom_yyyy_mm_dd(year, month, 日);
	sTime := self.IntProduct2TimeMillieSeconds(時, aMinute, aSecond, milliSecond);
	return self
	);

public Time : Calendar * int * int * int ==> Time
Time(cal, year, month, 日) ==
	(
	sDate := cal.getDateFrom_yyyy_mm_dd(year, month, 日);
	sTime := self.IntProduct2TimeMillieSeconds(0, 0, 0, 0);
	return self
	);
	
public Time : Date ==> Time
Time(aDate) ==
	(
	sDate := aDate;
	sTime := self.IntProduct2TimeMillieSeconds(0, 0, 0, 0);
	return self
	);
	
--currentDateTimeを求める単体テスト用関数。
public Time: Calendar ==> Time
Time(cal) == 
	(
	let	currentDateTime = readCurrentDateTime(homedir ^ "/temp/Today.txt", homedir ^ "/temp/Now.txt", cal)
	in
	(
	sDate := currentDateTime.getDate();
	sTime := currentDateTime.getTime();
	);
	return self
	);


--currentDateTimeを指定したreadFromFile単体テスト用関数。
public Time: seq of char * seq of char * Calendar ==> Time
Time(dateFileName, 時間fname, cal) ==
	(
	let	currentDateTime = readCurrentDateTime(dateFileName, 時間fname, cal)
	in
	(
	sDate := currentDateTime.getDate();
	sTime := currentDateTime.getTime();
	);
	return self
	);
		
--currentDateTimeをreadFromFile
public readCurrentDateTime : seq of char * seq of char * Calendar ==> [Time]
readCurrentDateTime(dateFileName, 時間fname, cal) ==
	let	mk_(結果, mk_(h, m, s, ms)) = io.freadval[int * int * int * int](時間fname)
	in
	if 結果 then
		let	d = cal.readFromFiletoday(dateFileName)	in
		return new Time(cal, d.Year(),  d.Month(), d.day(), h, m, s, ms)
	else
		let	- = io.echo("Can't read Current Date-Time data file.")
		in
		return nil;

--インスタンス変数操作

public getDate : () ==> Date
getDate() == return sDate;	

public setDate : Date ==> ()
setDate(aDate) == sDate := aDate;

public getTime : () ==> TimeInMilliSeconds
getTime() == return sTime;

public setTime : TimeInMilliSeconds ==> ()
setTime(aTime) == sTime :=aTime;

public hour: () ==> nat
hour() == 
	let	mk_(hour, -, -, -) = self.Time2IntProduct(self.getTime())
	in
	return hour;

public setTimeFromNat : nat ==> ()
setTimeFromNat(aTime) ==
	let	mk_(-, aMinute, aSecond, milliSecond) = self.Time2IntProduct(self.getTime())
	in
	self.setTime(IntProduct2TimeMillieSeconds(aTime, aMinute, aSecond, milliSecond));
	
public minute: () ==> nat
minute() == 
	let	mk_(-, aMinute, -, -) = self.Time2IntProduct(self.getTime())
	in
	return aMinute;
	
public setMinuteFromNat : nat ==> ()
setMinuteFromNat(minute) ==
	let	mk_(hour, -, aSecond, milliSecond) = self.Time2IntProduct(self.getTime())
	in
	self.setTime(IntProduct2TimeMillieSeconds(hour, minute, aSecond, milliSecond));
		
public second: () ==> nat
second() ==
	let	mk_(-, -, aSecond, -) = self.Time2IntProduct(self.getTime())
	in
	return aSecond;
	
public setSecond : nat ==> ()
setSecond(aSecond) ==
	let	mk_(hour, aMinute, -, milliSecond) = self.Time2IntProduct(self.getTime())
	in
	self.setTime(IntProduct2TimeMillieSeconds(hour, aMinute, aSecond, milliSecond));
		
public milliSecond: () ==> nat
milliSecond() ==
	let	mk_(-, -, -, milliSecond) = self.Time2IntProduct(self.getTime())
	in
	return milliSecond;
	
public setMilliSecond : nat ==> ()
setMilliSecond(aMilliSecond) ==
	let	mk_(hour, aMinute, aSecond, -) = self.Time2IntProduct(self.getTime())
	in
	self.setTime(IntProduct2TimeMillieSeconds(hour, aMinute, aSecond, aMilliSecond));
	
functions
-- Get attribute.

--時間から、その時間の属する暦を求める。
public calendar : () -> Calendar
calendar() == getDate().calendar();

--時間から、その時間の属する年を求める。
public Year: () -> int
Year() == self.getDate().calendar().Year(self.getDate());
		
--時間から、その時間の属する月を求める。
public Month: () -> int
Month() == self.getDate().calendar().Month(self.getDate());
		
--時間から、日を求める。
public day: () -> int
day() == self.getDate().calendar().day(self.getDate());

public getTimeAsNat : () -> nat
getTimeAsNat() == self.getTime();

----Compare

public LT: Time -> bool
LT(aTime) == 
	let	date1 = floor self.getDate().getModifiedJulianDate(),
		date2 = floor aTime.getDate().getModifiedJulianDate()
	in
	cases true :
	(date1 < date2)	-> true,
	(date1 = date2)	-> 
		if self.getTimeAsNat() < aTime.getTimeAsNat() then
			true
		else
			false,
	others		-> false
	end;

public GT: Time -> bool
GT(aTime) == not (self.LT(aTime) or self.EQ(aTime));

public LE: Time -> bool
LE(aTime) == not self.GT(aTime);

public GE: Time -> bool
GE(aTime) == not self.LT(aTime);

--自身と与えられた時間がEQか判定する。
public EQ: Time  ->  bool
EQ(aTime) == 
	self.getDate().EQ(aTime.getDate()) and self.getTimeAsNat() = aTime.getTimeAsNat();

--自身と与えられた時間が等しくないか判定する。
public NE: Time ->  bool
NE(aTime) ==  not self.EQ(aTime);

--変換

public IntProduct2TimeMillieSeconds : int * int * int * int -> int
IntProduct2TimeMillieSeconds(hour, aMinute, aSecond, milliSecond) ==((hour * minutesPerHour + aMinute) * secondsPerMinute + aSecond) * ミリ + milliSecond;

public Time2IntProduct : TimeInMilliSeconds -> nat * nat * nat * nat
Time2IntProduct(aTime) ==
	let	hms = aTime div ミリ,
		milliSecond = aTime mod ミリ,
		hm = hms div secondsPerMinute,
		aSecond = hms mod secondsPerMinute,
		hour = hm div minutesPerHour,
		aMinute = hm mod minutesPerHour
	in
	mk_(hour, aMinute, aSecond, milliSecond);

operations
public asString : () ==> seq of char
asString() == 
	let	mk_(hour, aMinute, aSecond, milliSecond) = self.Time2IntProduct(self.getTime())
	in
	return 
		self.getDate().asString() ^ 
		Integer`asString(hour) ^
		Integer`asString(aMinute) ^
		Integer`asString(aSecond) ^
		Integer`asStringZ("009")(milliSecond);

public print : () ==> seq of char
print() == 
	let	mk_(hour, aMinute, aSecond, milliSecond) = self.Time2IntProduct(self.getTime())
	in
	return 
		self.getDate().print() ^ 
		Integer`asString(hour) ^ "Hour, " ^
		Integer`asString(aMinute) ^ "Minute, " ^
		Integer`asString(aSecond) ^ "Second, " ^
		Integer`asStringZ("009")(milliSecond) ^ "MilliSecond" ;

----calculation

--milliSecondを加算する
public plusmilliSecond : int ==> Time
plusmilliSecond(aMilliSecond) == 
	let	time = self.getTime() + aMilliSecond,
		CarriedNumOfDays = 
			if time >= 0 then
				time div milliSecondsPerDay
			else
				time div milliSecondsPerDay - 1,
		newTime = time mod milliSecondsPerDay
	in
	(
	dcl aTime : Time := new Time(self.calendar(), self.Year(), self.Month(), self.day()) ;
	aTime.setTime(newTime);
	aTime.setDate(aTime.getDate().plus(CarriedNumOfDays));
	return aTime
	);
	
public plussecond : int ==> Time
plussecond(aSecond) == self.plusmilliSecond(aSecond * ミリ);
	
public plusminute : int ==> Time
plusminute(minute) == self.plusmilliSecond(minute * secondsPerMinute * ミリ);
	
public plushour : int ==> Time
plushour(hour) == self.plusmilliSecond(hour * minutesPerHour * secondsPerMinute * ミリ);
	
public plus: int * int * int * int ==> Time
plus(hour, aMinute, aSecond, milliSecond) == self.plusmilliSecond(IntProduct2TimeMillieSeconds(hour, aMinute, aSecond, milliSecond));
	
--milliSecondを減算する
public minusmilliSecond : int ==> Time
minusmilliSecond(aMilliSecond) == return self.plusmilliSecond(-aMilliSecond);
		
public minus: int * int * int * int  ==> Time
minus(hour, aMinute, aSecond, milliSecond) == self.minusmilliSecond(IntProduct2TimeMillieSeconds(hour, aMinute, aSecond, milliSecond));
		
end Time
~~~
{% endraw %}

### TimeT.vdmpp

{% raw %}
~~~
class TimeT is subclass of TestDriver 
functions
public tests : () -> seq of TestCase
tests() == 
	[ 
	new TimeT06(), new TimeT05(), new TimeT04(),
	new TimeT03(), new TimeT02(), new TimeT01()
	];
end TimeT
----------------------------------------------------------

class TimeT01 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	cal = new JapaneseCalendar(),
		d1 = cal.getDateFrom_yyyy_mm_dd(2003, 7, 30),
		d3 = cal.getDateFrom_yyyy_mm_dd(2003, 8, 15),
		t1 = new Time(cal, 2003, 7, 30, 14, 29, 30, 20),
		t2 = new Time(cal, 2003, 8, 1) ,
		t3 = new Time(d3)
	in
	return
		t1.getDate().EQ(d1) and 
		t1.Time2IntProduct(t1.getTime()) = mk_(14, 29, 30, 20) and 
		mk_(t1.hour(), t1.minute(), t1.second()) = mk_(14, 29, 30) and
		mk_(t2.Year(), t2.Month(), t2.day()) = mk_(2003, 8, 1) and 
		t2.getTime() = t2.IntProduct2TimeMillieSeconds(0, 0, 0, 0) and
		t3.getDate().EQ(d3) and 
		t3.getTime() = t2.IntProduct2TimeMillieSeconds(0, 0, 0, 0) 
	;
protected setUp: () ==> ()
setUp() == TestName := "Ｔｉｍｅ０１：¥tＴｅｓｔ　ｏｆ　ｃｏｎｓｔｒｕｃｔｏｒ．";
protected tearDown: () ==> ()
tearDown() == return;
end TimeT01
----------------------------------------------------------

class TimeT02 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	cal = new JapaneseCalendar(),
		t1 = new Time(cal, 2003, 7, 30, 14, 29, 30, 0),
		t2 = new Time(cal, 2003, 8, 1) ,
		t4 = new Time(cal, 2003, 7, 30, 14, 29, 31, 0),
		t5 = new Time(cal, 2003, 7, 30, 14, 29, 31, 0),
		t6 = t1
	in
	return 
		t1.LT(t2) and
		t1.LT(t4) and
		t1.LE(t2) and
		t1.LE(t4) and
		t2.GT(t1) and
		t4.GT(t1) and
		t2.GE(t1) and
		t4.GE(t1) and
		t4.EQ(t5) and
		t4.NE(t1) and
		t4 <> t5 and
		t1 = t6
	;
protected setUp: () ==> ()
setUp() == TestName := "TimeT02:\tATime comparing.";
protected tearDown: () ==> ()
tearDown() == return;
end TimeT02
----------------------------------------------------------

class TimeT03 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	cal = new JapaneseCalendar(),
		t = new Time(cal, 2003, 7, 30, 14, 29, 30, 0),
		t1 = t.plussecond(20),
		t2 = t.plussecond(30),
		t3 = t.plussecond(50),
		t4 = t.plussecond(90),
		t5 = t.plussecond(150),
		t6 = t.plussecond(3600),
		t7 = t.plusminute(30),
		t8 = t.plusminute(31),
		t9 = t.plusminute(40),
		t10 = t.plusminute(91),
		t11 = t.plusminute(1440),
		t12 = t.plus(9, 30, 30, 123),
		t13 = t.plushour(48),
		t14 = t.plus(0, 0, 0, 0)
	in
	return 
		t1.minute() = 29 and t1.second() = 50 and
		t2.minute() = 30 and t2.second() = 0 and
		t3.minute() = 30 and t3.second() = 20 and
		t4.minute() = 31 and t4.second() = 0 and
		t5.hour() = 14 and t5.minute() = 32 and t5.second() = 0 and  
		t6.hour() = 15 and t6.minute() = 29 and t6.second() = 30 and  
		t7.hour() = 14 and t7.minute() = 59 and
		t8.hour() = 15 and t8.minute() = 0 and
		t9.hour() = 15 and t9.minute() = 9 and
		t10.hour() = 16 and t10.minute() = 0 and t10.second() = 30 and
		t11.Year() = 2003 and t11.Month() = 7 and t11.day() = 31 and t11.hour() = 14 and t11.minute() = 29 and t11.second() = 30 and
		t12.Year() = 2003 and t12.Month() = 7 and t12.day() = 31 and t12.hour() = 0 and t12.minute() = 0 and t12.second() = 0 and t12.milliSecond() = 123 and
		t13.Year() = 2003 and t13.Month() = 8 and t13.day() = 1 and t13.hour() = 14 and t13.minute() = 29 and t13.second() = 30 and t13.milliSecond() = 0 and
		t13.asString() = "20030801142930000" and
		t13.print() = "Year=2003, Month=08, Day=01, 14Hour, 29Minute, 30Second, 000MilliSecond" and
		t14.asString() = "20030730142930000"
	;
protected setUp: () ==> ()
setUp() == TestName := "TimeT03:\tTime ading.";
protected tearDown: () ==> ()
tearDown() == return;
end TimeT03
----------------------------------------------------------

class TimeT04 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	cal = new JapaneseCalendar(),
		t = new Time(cal, 2003, 7, 30, 14, 29, 30, 0),
		t1 = t.minus(14, 30, 30, 0) ,
		t2 = t.minus(38, 30, 30, 0) ,
		t3 = t.plus(-38, -30, -30, 0),
		t4 = t.plus(-0, -0, -0, -0)
	in
	return 
		t1.Time2IntProduct(t1.getTime())  = mk_(23,59,0,0) and
		t1.getDate().date2Str() = "20030729" and
		t2.Time2IntProduct(t2.getTime())  = mk_(23,59,0,0) and
		t2.getDate().date2Str() = "20030728" and
		t3.Time2IntProduct(t3.getTime())  = mk_(23,59,0,0) and
		t3.getDate().date2Str() = "20030728" and
		t4.print() = "Year=2003, Month=07, Day=30, 14Hour, 29Minute, 30Second, 000MilliSecond"
		
	;
protected setUp: () ==> ()
setUp() == TestName := "TimeT04:\tATime subtracting.";
protected tearDown: () ==> ()
tearDown() == return;
end TimeT04
----------------------------------------------------------

class TimeT05 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	cal = new JapaneseCalendar(),
		t1 = new Time(cal, 2003, 7, 30, 14, 29, 30, 0),
		t2 = new Time(cal, 2003, 7, 30, 14, 29, 30, 0),
		t3 = new Time(cal, 2003, 7, 30, 14, 29, 30, 0),
		t4 = new Time(cal, 2003, 7, 30, 14, 29, 30, 0)
	in
	(
	t1.setTimeFromNat(15);
	t2.setMinuteFromNat(19);
	t3.setSecond(47);
	t4.setMilliSecond(789);
	return 
		t1.Time2IntProduct(t1.getTime())  = mk_(15, 29, 30, 0) and
		t2.Time2IntProduct(t2.getTime())  = mk_(14, 19, 30, 0) and
		t3.Time2IntProduct(t3.getTime())  = mk_(14, 29, 47, 0) and
		t4.Time2IntProduct(t4.getTime())  = mk_(14, 29, 30, 789) and
		t4.getDate().date2Str() = "20030730" 
	)	
	;
protected setUp: () ==> ()
setUp() == TestName := "TimeT05:\tSet instance variables.";
protected tearDown: () ==> ()
tearDown() == return;
end TimeT05
----------------------------------------------------------

class TimeT06 is subclass of TestCase, CalendarDefinition
operations 
protected test: () ==> bool
test() == 
	let	cal = new SBCalendar()
	in
	(
	return 
		new Time(cal).EQ(new Time(cal, 2001, 3, 1, 10, 11, 23, 456)) and
		new Time(homedir ^ "/temp/BaseDay.txt", homedir ^ "/temp/Now2.txt", cal).EQ(new Time(cal, 2003, 10, 24, 12, 34, 56, 789))
	)	
	;
protected setUp: () ==> ()
setUp() == TestName := "TimeT06:\tTest currentDateTime from file.";
protected tearDown: () ==> ()
tearDown() == return;
end TimeT06
~~~
{% endraw %}

### UniqueNumber.vdmpp

{% raw %}
~~~
class ＵｎｉｑｕｅＮｕｍｂｅｒ is subclass of CommonDefinition

values
ＤｅｆａｕｌｔＶａｌｕｅ = 1;

instance variables
protected UniqNum  : int := ＤｅｆａｕｌｔＶａｌｕｅ		-- UniqNum of next issued

functions
public getUniqNum : int * nat1 -> int
getUniqNum(aCandidateNum, aNumberOfDigit) == 
	if aCandidateNum >= 10 ** aNumberOfDigit then 
		initialize() 
	else
		aCandidateNum;

operations
-- make an unique number within aNumberOfDigit
public ｇｅｔＵｎｉｑＮｕｍＳｔｒ : nat1 ==> seq of char
ｇｅｔＵｎｉｑＮｕｍＳｔｒ(aNumberOfDigit) ==
	let	n = getUniqNum(UniqNum, aNumberOfDigit)
	in
	(
	UniqNum := UniqNum + 1;
	return Integer`asString(n)
	);
	
public initialize : () ==> int
initialize() == 
	(
	UniqNum := ＤｅｆａｕｌｔＶａｌｕｅ;
	return UniqNum
	);

end  ＵｎｉｑｕｅＮｕｍｂｅｒ
~~~
{% endraw %}

### UniqueNumberT.vdmpp

{% raw %}
~~~
class ＵｎｉｑｕｅＮｕｍｂｅｒＴ is subclass of TestDriver
functions
public tests : () -> seq of TestCase
tests () == 
	[new ＵｎｉｑｕｅＮｕｍｂｅｒＴ01()
	];
end ＵｎｉｑｕｅＮｕｍｂｅｒＴ

class ＵｎｉｑｕｅＮｕｍｂｅｒＴ01 is subclass of TestCase
operations 
protected test: () ==> bool
test() == 
	let	o = new ＵｎｉｑｕｅＮｕｍｂｅｒ()	in
	return
		(
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "1" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "2" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "3" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "4" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "5" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "6" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "7" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "8" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "9" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "1" and 
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(1) = "2" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "3" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "4" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "5" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "6" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "7" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "8" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "9" and
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "10" and 
		o.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(2) = "11"
		)
;
protected setUp: () ==> ()
setUp() == TestName := " ＵｎｉｑｕｅＮｕｍｂｅｒＴ01:\t ＵｎｉｑｕｅＮｕｍｂｅｒＴ01 Unit test";
protected tearDown: () ==> ()
tearDown() == return;
end ＵｎｉｑｕｅＮｕｍｂｅｒＴ01
~~~
{% endraw %}

### UseCalendar.vdmpp

{% raw %}
~~~
class UseCalendar

instance variables
sJC : JapaneseCalendar :=  new JapaneseCalendar();

traces

S1 : 
	let y in set {2010,...,2012} in let m in set {1,...,12} in let d in set {1,...,31} in sJC.getDateFrom_yyyy_mm_dd(y, m, d).asString()

S2:
	let y in set {2010,...,2100} in sJC.getVernalEquinox(y).date2Str()

end UseCalendar
~~~
{% endraw %}

### UseReal.vdmpp

{% raw %}
~~~
class UseReal

instance variables
	r : Real := new Real()	

traces

S1: let n in set {0, 1, 9, 10, 99, 199, 0.1, 9.1, 10.1, 10.123} in r.numberOfDigit(n)

end UseReal
~~~
{% endraw %}

### UseUniqueNumber.vdmpp

{% raw %}
~~~
class UseUniqueNumber

instance variables
sUN : ＵｎｉｑｕｅＮｕｍｂｅｒ :=  new ＵｎｉｑｕｅＮｕｍｂｅｒ()

traces

S1 : 
	let n in set {1,...,4} in sUN.ｇｅｔＵｎｉｑＮｕｍＳｔｒ(n){100}

end UseUniqueNumber
~~~
{% endraw %}

