---
layout: default
title: DepartureTMISL
---

## DepartureTMISL
Author: Paul Chisholm


This is a model of an Air Traffic Flow Management (ATFM) departure Traffic Management Initiative
  (TMI) with the constraints:
  - a set of flights wish to depart an airport;
  - each flight may only take off from certain runways;
  - each flight has a preferred take off time;
  - each flight has an acceptable take off window;
  - only certain runways are available;
  - runways have a maximum rate at which departures can take place;
  - the TMI runs for a specific time interval.

Within these constraints, the goal is to allocate a take off time and runway to flights
in an optimal manner. This model is making use of some of the newer language features such as set1.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| Set`sum({1,2,3,4,5,6,7,8,9})|


### DepartureTMI.vdmsl

{% raw %}
~~~
/*
  A model of an Air Traffic Flow Management (ATFM) departure Traffic Management Initiative
  (TMI) with the constraints:
  - a set of flights wish to depart an airport;
  - each flight may only take off from certain runways;
  - each flight has a preferred take off time;
  - each flight has an acceptable take off window;
  - only certain runways are available;
  - runways have a maximum rate at which departures can take place;
  - the TMI runs for a specific time interval.

  Within these constraints, the goal is to allocate a take off time and runway to flights
  in an optimal manner.

  This module depends on modules Set, Seq and ISO8601 contained in the ISO8601 example located at

    https://www.overturetool.org/download/examples/VDMSL/
*/
module DepartureTMI
imports from ISO8601 all,
        from Seq all,
        from Set all
exports types AirportDesig
              FlightId
              RunwayDesig
              struct FlightInfo
              struct RunwayRates
              Rate
              struct TMIConfig
              struct Allocation
              DepartureTMI
        functions departureTMI: TMIConfig +> DepartureTMI * set of FlightId

definitions

types

  -- An airport designator.
  AirportDesig = token;

  -- A flight identifier.
  FlightId = token;

  -- A runway designator.
  RunwayDesig = token;

  -- Information on when a flight can take off and what runways it can use.
  FlightInfo :: canUse   : set1 of RunwayDesig -- The runways the flight can use
                preferred: ISO8601`DTG         -- The preferred take off time
                window   : ISO8601`Interval    -- The acceptable take off window
  inv flight == -- The preferred time falls in the take off window
                ISO8601`inInterval(flight.preferred, flight.window);

  -- The rate for each available runway.
  -- The domain of the map is the set of available runways.
  RunwayRates = map RunwayDesig to Rate
  inv rr == -- At least one runway is available.
            dom rr <> {};

  -- The minimum duration between consecutive departures.
  Rate = ISO8601`Duration;

  -- A TMI configuration for departures at an airport.
  TMIConfig :: airport: AirportDesig                -- The airport location designator
               period : ISO8601`Interval            -- The period over which the TMI runs
               flight :-map FlightId to FlightInfo  -- The flights that wish to depart
               rates  :-RunwayRates                 -- The runway rates
  inv tmiCfg == -- Every flight window overlaps the TMI period
                (forall f in set rng tmiCfg.flight & ISO8601`overlap(f.window, tmiCfg.period)) and
                -- Every flight can use at least one of the available runways
                (forall f in set rng tmiCfg.flight & f.canUse inter dom tmiCfg.rates <> {});

  -- An allocated runway and take off time.
  Allocation :: rwy : RunwayDesig   -- The allocated runway
                ttot: ISO8601`DTG;  -- The target take off time

  -- A departure TMI is a mapping from flights to their allocated runways and departure times.
  DepartureTMI = inmap FlightId to Allocation;

functions

  -- Run the TMI: determine a runway and take off time for each flight.
  -- Highlight those flights that could not be accommodated.
  departureTMI(config:TMIConfig) res:DepartureTMI * set of FlightId
  post -- The result is a solution.
       satisfies(config, res.#1) and
       -- Of all solutions, the result is one with the least cost.
       (forall tmi:DepartureTMI
             & satisfies(config, tmi) => cost(config, res.#1) <= cost(config, tmi)) and
       -- Those flights that could not be accommodated in the TMI are returned.
       res.#2 = dom config.flight \ dom res.#1;

  -- Does a TMI satisfy the constraints with respect to a configuration?
  satisfies: TMIConfig * DepartureTMI +> bool
  satisfies(config,tmi) ==
    -- Only candidate flights are allocated.
    dom tmi subset dom config.flight and
    -- The flight can use the allocated runway.
    (forall f in set dom tmi & tmi(f).rwy in set config.flight(f).canUse) and
    -- An allocated runway is in the set of available runways.
    (forall f in set dom tmi & tmi(f).rwy in set dom config.rates) and
    -- The allocated take off time falls within the acceptable take off window.
    (forall f in set dom tmi & ISO8601`inInterval(tmi(f).ttot, config.flight(f).window)) and
    -- The allocated take off time falls within the period of the TMI.
    (forall f in set dom tmi & ISO8601`inInterval(tmi(f).ttot, config.period)) and
    -- Two flights allocated the same runway depart at least the required duration apart.
    (forall f,g in set dom tmi
          & f <> g and tmi(f).rwy = tmi(g).rwy
            => ISO8601`durGeq(ISO8601`diff(tmi(f).ttot, tmi(g).ttot), config.rates(tmi(f).rwy)));

  -- The cost of a TMI as a function of the deviations of the individual flights.
  -- The ideal solution is where every flight is allocated its preferred time.
  cost: TMIConfig * DepartureTMI -> nat
  cost(config,tmi) == ISO8601`durToSeconds(ISO8601`sumDuration(deviations(config, tmi)));

  -- The deviation of each flight expressed as a duration of time.
  -- Flights that could not be accommodated are also assigned a deviation.
  deviations: TMIConfig * DepartureTMI -> seq of ISO8601`Duration
  deviations(config,tmi) ==
    let allFlights = Set`toSeq[FlightId](dom config.flight)
    in [ if f in set dom tmi
         then allocatedDeviation(config.flight(f), tmi(f))
         else omittedDeviation(config.period, config.flight(f).window)
       | f in seq allFlights
       ];

  -- The deviation of a flight from an allocated time.
  allocatedDeviation: FlightInfo * Allocation +> ISO8601`Duration
  allocatedDeviation(flight,alloc) == ISO8601`diff(flight.preferred, alloc.ttot);

  -- The deviation of a flight that is omitted from a TMI.
  omittedDeviation: ISO8601`Interval * ISO8601`Interval +> ISO8601`Duration
  omittedDeviation(period, flightWindow) ==
    let dur = ISO8601`durFromInterval(flightWindow)
    in if ISO8601`within(flightWindow, period) then dur else ISO8601`durDivide(dur, 2);

end DepartureTMI
~~~
{% endraw %}

### Seq.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose functions over sequences.

   All functions are explicit and executable. Where a non-executable condition adds value, it
   is included as a comment.
*/
module Seq
imports from Numeric all
exports functions sum: seq of real +> real
                  prod: seq of real +> real
                  min: seq1 of real +> real
                  max: seq1 of real +> real
                  inSeq[@a]: @a * seq of @a +> bool
                  indexOf[@a]: @a * seq1 of @a +> nat1
                  indexOfSeq[@a]: seq1 of @a * seq1 of @a +> nat1
                  indexOfSeqOpt[@a]: seq1 of @a * seq1 of @a +> [nat1]
                  numOccurs[@a]: @a * seq of @a +> nat
                  permutation[@a]: seq of @a * seq of @a +> bool
                  preSeq[@a]: seq of @a * seq of @a +> bool
                  postSeq[@a]: seq of @a * seq of @a +> bool
                  subSeq[@a]: seq of @a * seq of @a +> bool
                  padLeft[@a]: seq of @a * @a * nat +> seq of @a
                  padRight[@a]: seq of @a * @a * nat +> seq of @a
                  padCentre[@a]: seq of @a * @a * nat +> seq of @a
                  xform[@a,@b]: (@a +> @b) * seq of @a +> seq of @b
                  fold[@a]: (@a * @a +> @a) * @a * seq of @a +> @a
                  fold1[@a]: (@a * @a +> @a) * seq1 of @a +> @a
                  zip[@a,@b]: seq of @a * seq of @b +> seq of (@a * @b)
                  unzip[@a,@b]: seq of (@a * @b) +> seq of @a * seq of @b
                  isDistinct[@a]: seq of @a +> bool
                  app[@a]: seq of @a * seq of @a +> seq of @a
                  setOf[@a]: seq of @a +> set of @a

definitions

functions

  -- The sum of a sequence of numerics.
  sum: seq of real +> real
  sum(s) == fold[real](Numeric`add,0,s);

  -- The product of a sequence of numerics.
  prod: seq of real +> real
  prod(s) == fold[real](Numeric`mult,1,s);

  -- The minimum of a sequence of numerics.
  min: seq1 of real +> real
  min(s) == fold1[real](Numeric`min,s)
  post RESULT in set elems s and forall e in set elems s & RESULT <= e;

  -- The maximum of a sequence of numerics.
  max: seq1 of real +> real
  max(s) == fold1[real](Numeric`max,s)
  post RESULT in set elems s and forall e in set elems s & RESULT >= e;

  -- Does an element appear in a sequence?
  inSeq[@a]: @a * seq of @a +> bool
  inSeq(e,s) == e in set elems s;

  -- The position an item appears in a sequence?
  indexOf[@a]: @a * seq1 of @a +> nat1
  indexOf(e,s) == cases s:
                    [-]    -> 1,
                    [f]^ss -> if e=f then 1 else 1 + indexOf[@a](e,ss)
                  end
  pre inSeq[@a](e,s)
  measure size0;

  -- The position a subsequence appears in a sequence.
  indexOfSeq[@a]: seq1 of @a * seq1 of @a +> nat1
  indexOfSeq(r,s) == if preSeq[@a](r,s)
                     then 1
                     else 1 + indexOfSeq[@a](r, tl s)
  pre subSeq[@a](r,s)
  measure size3;

  -- The position a subsequence appears in a sequence?
  indexOfSeqOpt[@a]: seq1 of @a * seq1 of @a +> [nat1]
  indexOfSeqOpt(r,s) == if subSeq[@a](r,s) then indexOfSeq[@a](r, s) else nil;

  -- The number of times an element appears in a sequence.
  numOccurs[@a]: @a * seq of @a +> nat
  numOccurs(e,sq) == len [ 0 | i in set inds sq & sq(i) = e ];

  -- Is one sequence a permutation of another?
  permutation[@a]: seq of @a * seq of @a +> bool
  permutation(sq1,sq2) ==
    len sq1 = len sq2 and
    forall i in set inds sq1 & numOccurs[@a](sq1(i),sq1) = numOccurs[@a](sq1(i),sq2);

  -- Is one sequence a prefix of another?
  preSeq[@a]: seq of @a * seq of @a +> bool
  preSeq(pres,full) == pres = full(1,...,len pres);

  -- Is one sequence a suffix of another?
  postSeq[@a]: seq of @a * seq of @a +> bool
  postSeq(posts,full) == preSeq[@a](reverse posts, reverse full);

  -- Is one sequence a subsequence of another sequence?
  subSeq[@a]: seq of @a * seq of @a +> bool
  subSeq(sub,full) == exists i,j in set inds full & sub = full(i,...,j);

  -- Pad a sequence on the left with a given item up to a specified length.
  padLeft[@a]: seq of @a * @a * nat +> seq of @a
  padLeft(sq,x,n) == [ x | i in set {1 ,..., n - len sq} ] ^ sq;

  -- Pad a sequence on the right with a given item up to a specified length.
  padRight[@a]: seq of @a * @a * nat +> seq of @a
  padRight(sq,x,n) == sq ^ [ x | i in set {1 ,..., n - len sq} ];

  -- Pad a sequence on the right with a given item up to a specified length.
  padCentre[@a]: seq of @a * @a * nat +> seq of @a
  padCentre(sq,x,n) == let space = if n <= len sq then 0 else n - len sq
                       in padRight[@a](padLeft[@a](sq,x,len sq + (space div 2)),x,n);

  -- Apply a function to all elements of a sequence.
  xform[@a,@b]: (@a+>@b) * seq of @a +> seq of @b
  xform(f,s) == [ f(s(i)) | i in set inds s ]
  post len RESULT = len s;

  -- Fold (iterate, accumulate, reduce) a binary function over a sequence.
  -- The function is assumed to be associative and have an identity element.
  fold[@a]: (@a * @a +> @a) * @a * seq of @a +> @a
  fold(f, e, s) == cases s:
                     []    -> e,
                     [x]   -> x,
                     s1^s2 -> f(fold[@a](f,e,s1), fold[@a](f,e,s2))
                   end
  --pre (exists x:@a & forall y:@a & f(x,y) = y and f(y,x) = y)
  --and forall x,y,z:@a & f(x,f(y,z)) = f(f(x,y),z)
  measure size2;

  -- Fold (iterate, accumulate, reduce) a binary function over a non-empty sequence.
  -- The function is assumed to be associative.
  fold1[@a]: (@a * @a +> @a) * seq1 of @a +> @a
  fold1(f, s) == cases s:
                   [e]   -> e,
                   s1^s2 -> f(fold1[@a](f,s1), fold1[@a](f,s2))
                 end
  --pre forall x,y,z:@a & f(x,f(y,z)) = f(f(x,y),z)
  measure size1;

  -- Pair the corresponding elements of two lists of equal length.
  zip[@a,@b]: seq of @a * seq of @b +> seq of (@a * @b)
  zip(s,t) == [ mk_(s(i),t(i)) | i in set inds s ]
  pre len s = len t
  post len RESULT = len s;

  -- Split a list of pairs into a list of firsts and a list of seconds.
  unzip[@a,@b]: seq of (@a * @b) +> seq of @a * seq of @b
  unzip(s) == mk_([ s(i).#1 | i in set inds s], [ s(i).#2 | i in set inds s])
  post let mk_(t,u) = RESULT in len t = len s and len u = len s;

  -- Are the elements of a list distinct (no duplicates).
  isDistinct[@a]: seq of @a +> bool
  isDistinct(s) == len s = card elems s;

  -- The following functions wrap primitives for convenience, to allow them for example to
  -- serve as function arguments.

  -- Concatenation of two sequences.
  app[@a]: seq of @a * seq of @a +> seq of @a
  app(m,n) == m^n;

  -- Set of sequence elements.
  setOf[@a]: seq of @a +> set of @a
  setOf(s) == elems(s);

  -- Measure functions.

  size0[@a]: @a * seq1 of @a +> nat
  size0(-, s) == len s;

  size1[@a]: (@a * @a +> @a) * seq1 of @a +> nat
  size1(-, s) == len s;

  size2[@a]: (@a * @a +> @a) * @a * seq of @a +> nat
  size2(-, -, s) == len s;

  size3[@a]: seq1 of @a * seq1 of @a +> nat
  size3(-, s) == len s;

end Seq
~~~
{% endraw %}

### Set.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose functions over sets.

   All functions are explicit and executable. Where a non-executable condition adds value, it
   is included as a comment.
*/
module Set
imports from Numeric all,
        from Seq all
exports functions sum: set of real +> real
                  prod: set of real +> real
                  min: set of real +> real
                  max: set of real +> real
                  toSeq[@a]: set of @a +> seq of @a
                  xform[@a,@b]: (@a +> @b) * set of @a +> set of @b
                  fold[@a]: (@a * @a +> @a) * @a * set of @a +> @a
                  fold1[@a]: (@a * @a +> @a) * set of @a +> @a
                  pairwiseDisjoint[@a]: set of set of @a +> bool
                  isPartition[@a]: set of set of @a * set of @a +> bool
                  permutations[@a]: set of @a +> set of seq1 of @a
                  xProduct[@a,@b]: set of @a * set of @b +> set of (@a * @b)

definitions

functions

  -- The sum of a set of numerics.
  sum: set of real +> real
  sum(s) == fold[real](Numeric`add,0,s);

  -- The product of a set of numerics.
  prod: set of real +> real
  prod(s) == fold[real](Numeric`mult,1,s);

  -- The minimum of a set of numerics.
  min: set of real +> real
  min(s) == fold1[real](Numeric`min, s)
  pre s <> {}
  post RESULT in set s and forall e in set s & RESULT <= e;

  -- The maximum of a set of numerics.
  max: set of real +> real
  max(s) == fold1[real](Numeric`max, s)
  pre s <> {}
  post RESULT in set s and forall e in set s & RESULT >= e;

  -- The sequence whose elements are those of a specified set, with no duplicates.
  -- No order is guaranteed in the resulting sequence.
  toSeq[@a]: set of @a +> seq of @a
  toSeq(s) ==
  	cases s:
		{} ->        [],
		{x} ->       [x],
		t union u -> toSeq[@a](t) ^ toSeq[@a](u)
    end
  post len RESULT = card s and forall e in set s & Seq`inSeq[@a](e,RESULT);

  -- Apply a function to all elements of a set. The result set may be smaller than the
  -- argument set if the function argument is not injective.
  xform[@a,@b]: (@a+>@b) * set of @a +> set of @b
  xform(f,s) == { f(e) | e in set s }
  post (forall e in set s & f(e) in set RESULT) and
       (forall r in set RESULT & exists e in set s & f(e) = r);

  -- Fold (iterate, accumulate, reduce) a binary function over a set.
  -- The function is assumed to be commutative and associative, and have an identity element.
  fold[@a]: (@a * @a +> @a) * @a * set of @a +> @a
  fold(f, e, s) == cases s:
                     {}        -> e,
                     {x}       -> x,
                     t union u -> f(fold[@a](f,e,t), fold[@a](f,e,u))
                   end
  --pre (exists x:@a & forall y:@a & f(x,y) = y and f(y,x) = y)
  --and (forall x,y:@a & f(x, y) = f(y, x))
  --and (forall x,y,z:@a & f(x,f(y,z)) = f(f(x,y),z))
  measure size2;

  -- Fold (iterate, accumulate, reduce) a binary function over a non-empty set.
  -- The function is assumed to be commutative and associative.
  fold1[@a]: (@a * @a +> @a) * set of @a +> @a
  fold1(f, s) == cases s:
                   {e}       -> e,
                   t union u -> f(fold1[@a](f,t), fold1[@a](f,u))
                 end
  pre s <> {}
  --and (forall x,y:@a & f(x,y) = f(y,x))
  --and (forall x,y,z:@a & f(x,f(y,z)) = f(f(x,y),z))
  measure size1;

  -- Are the members of a set of sets pairwise disjoint.
  pairwiseDisjoint[@a]: set of set of @a +> bool
  pairwiseDisjoint(ss) == forall x,y in set ss & x<>y => x inter y = {};

  -- Is a set of sets a partition of a set?
  isPartition[@a]: set of set of @a * set of @a +> bool
  isPartition(ss,s) == pairwiseDisjoint[@a](ss) and dunion ss = s;

  -- All (sequence) permutations of a set.
  permutations[@a]: set of @a +> set of seq1 of @a
  permutations(s) ==
    cases s:
      {e} -> {[e]},
      -   -> dunion { { [e]^tail | tail in set permutations[@a](s\{e}) } | e in set s }
    end
  pre s <> {}
  post -- for a set of size n, there are n! permutations
       card RESULT = prod({1,...,card s}) and
       forall sq in set RESULT & len sq = card s and elems sq = s
  measure size;

  -- The cross product of two sets.
  xProduct[@a,@b]: set of @a * set of @b +> set of (@a * @b)
  xProduct(s,t) == { mk_(x,y) | x in set s, y in set t }
  post card RESULT = card s * card t;

  -- Measure functions.

  size[@a]: set of @a +> nat
  size(s) == card s;

  size1[@a]: (@a * @a +> @a) * set of @a +> nat
  size1(-, s) == card s;

  size2[@a]: (@a * @a +> @a) * @a * set of @a +> nat
  size2(-, -, s) == card s;

end Set
~~~
{% endraw %}

### Char.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose types, constants and functions over
   characters and strings (sequences characters).

   All functions are explicit and executable. Where a non-executable condition adds value, it
   is included as a comment.
*/
module Char
imports from Seq all
exports types Upper
              Lower
              Letter
              struct Digit 
              Octal
              Hex
              AlphaNum
              AlphaNumUpper
              AlphaNumLower
              Space
              WhiteSpace
              Phrase
              PhraseUpper
              PhraseLower
              Text
              TextUpper
              TextLower
        values SP, TB, CR, LF : char
               WHITE_SPACE, UPPER, LOWER, DIGIT, OCTAL, HEX : set of char
               UPPERS, LOWERS, OCTALS, HEXS: seq of char
               DIGITS : seq of Digit
        functions toLower: Upper +> Lower
                  toUpper: Lower +> Upper

definitions

types

  Upper = char
  inv c == c in set UPPER;

  Lower = char
  inv c == c in set LOWER;

  Letter = Upper | Lower;

  Digit = char
  inv c == c in set DIGIT;
  
  Octal = char
  inv c == c in set OCTAL;

  Hex = char
  inv c == c in set HEX;

  AlphaNum = Letter | Digit;

  AlphaNumUpper = Upper | Digit;

  AlphaNumLower = Lower | Digit;

  Space = char
  inv sp == sp = ' ';

  WhiteSpace = char
  inv ws == ws in set WHITE_SPACE;

  Phrase = seq1 of (AlphaNum|Space);

  PhraseUpper = seq1 of (AlphaNumUpper|Space);

  PhraseLower = seq1 of (AlphaNumLower|Space);

  Text = seq1 of (AlphaNum|WhiteSpace);

  TextUpper = seq1 of (AlphaNumUpper|WhiteSpace);

  TextLower = seq1 of (AlphaNumLower|WhiteSpace);

values

  SP:char = ' ';
  TB:char = '\t';
  CR:char = '\r';
  LF:char = '\n';
  WHITE_SPACE:set of char = {SP,TB,CR,LF};
  UPPER:set of char = {'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
                       'R','S','T','U','V','W','X','Y','Z'};
  UPPERS: seq of Upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  LOWER:set of char = {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q',
                       'r','s','t','u','v','w','x','y','z'};
  LOWERS: seq of Lower = "abcdefghijklmnopqrstuvwxyz";
  DIGIT:set of char = {'0','1','2','3','4','5','6','7','8','9'};
  DIGITS:seq of Digit = "0123456789";
  OCTAL:set of char = {'0','1','2','3','4','5','6','7'};
  OCTALS:seq of Octal = "01234567";
  HEX:set of char = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
  HEXS:seq of Hex = "0123456789ABCDEF";

functions

  -- Convert upper case letter to lower case.
  toLower: Upper +> Lower
  toLower(c) == LOWERS(Seq`indexOf[Upper](c,UPPERS))
  post toUpper(RESULT) = c;

  -- Convert lower case letter to upper case.
  toUpper: Lower +> Upper
  toUpper(c) == UPPERS(Seq`indexOf[Lower](c,LOWERS));
  --post toLower(RESULT) = c;

end Char
~~~
{% endraw %}

### ISO8601.vdmsl

{% raw %}
~~~
/*
   A model of dates, times, intervals and durations. Intended as a core library for use by
   higher level models that require dates and/or times and/or intervals and/or durations.

   The model is based on the ISO 8601 standard for representation of dates and times using
   the Gregorian calendar:

     https://en.wikipedia.org/wiki/ISO_8601

   For dates and times, this model largely conforms to the RFC 3339 profile:

     https://tools.ietf.org/html/rfc3339

   Exceptions to RFC 3339 are:
   - A seconds value of 60 (leap second) is not supported;
   - ISO 8601/RFC 3339 impose no limitation on the resolution of times; the finest granularity
     of this model is milliseconds.

   The model additionally supports a subset of the specification of time intervals and
   durations from ISO 8601. Those aspects supported are:
   - a duration is expressed as a number of milliseconds;
   - an interval is expressed as a start/end date/time value.

   All functions are explicit and executable. Where a non-executable condition adds value, it
   is included as a comment.

*/
module ISO8601
imports from Numeric all,
        from Set all,
        from Seq all
exports types struct Year
              struct Month
              struct Day
              struct Hour
              struct Minute
              struct Second
              struct Millisecond
              struct Date
              struct Time
              struct Offset
              struct UTC
              struct DTG
              struct Interval
              Duration
        values MILLIS_PER_SECOND, SECONDS_PER_MINUTE, MINUTES_PER_HOUR, HOURS_PER_DAY, FIRST_YEAR, LAST_YEAR: nat
               DAYS_PER_MONTH, DAYS_PER_MONTH_LEAP: map nat1 to nat1
               MAX_DAYS_PER_MONTH, MONTHS_PER_YEAR, DAYS_PER_YEAR, DAYS_PER_LEAP_YEAR: nat1
               FIRST_DATE, LAST_DATE: Date;
               NO_DURATION, ONE_MILLISECOND, ONE_SECOND, ONE_MINUTE, ONE_HOUR, ONE_DAY, ONE_YEAR, ONE_LEAP_YEAR: Duration
        functions mkUTC: Hour * Minute * Second +> UTC
                  isUTC: Time +> bool
                  toUTC: Time +> UTC
                  isLeap: Year +> bool
                  daysInMonth: Year * Month +> nat1
                  daysInYear: Year +> nat1
                  dateLess: Date * Date +> bool
                  dateLeq: Date * Date +> bool
                  dateGrtr: Date * Date +> bool
                  dateGeq: Date * Date +> bool
                  timeEq: Time * Time +> bool
                  timeLess: Time * Time +> bool
                  utcLess: UTC * UTC +> bool
                  timeLeq: Time * Time +> bool
                  timeGrtr: Time * Time +> bool
                  timeGeq: Time * Time +> bool
                  dtgEq: DTG * DTG +> bool
                  dtgLess: DTG * DTG +> bool
                  dtgLeq: DTG * DTG +> bool
                  dtgGrtr: DTG * DTG +> bool
                  dtgGeq: DTG * DTG +> bool
                  durLess: Duration * Duration +> bool
                  durLeq: Duration * Duration +> bool
                  durGrtr: Duration * Duration +> bool
                  durGeq: Duration * Duration +> bool
                  dtgInRange: DTG * DTG * DTG +> bool
                  inInterval: DTG * Interval +> bool
                  overlap: Interval * Interval +> bool
                  within: Interval * Interval +> bool
                  add: DTG * Duration +> DTG
                  subtract: DTG * Duration +> DTG
                  diff: DTG * DTG +> Duration
                  durAdd: Duration * Duration +> Duration
                  durSubtract: Duration * Duration +> Duration
                  durMultiply: Duration * nat +> Duration
                  durDivide: Duration * nat +> Duration
                  durDiff: Duration * Duration +> Duration
                  durToMillis: Duration +> nat
                  durFromMillis: nat +> Duration
                  durToSeconds: Duration +> nat
                  durFromSeconds: nat +> Duration
                  durToMinutes: Duration +> nat
                  durFromMinutes: nat +> Duration
                  durModMinutes : Duration +> Duration
                  durToHours: Duration +> nat
                  durFromHours: nat +> Duration
                  durModHours : Duration +> Duration
                  durToDays: Duration +> nat
                  durFromDays : nat +> Duration
                  durModDays : Duration +> Duration
                  durToMonth: Duration * Year +> nat
                  durFromMonth: Year * Month +> Duration
                  durUptoMonth: Year * Month +> Duration
                  durToYear : Duration * Year +> nat
                  durFromYear: Year +> Duration
                  durUptoYear: Year +> Duration
                  durToDTG: Duration +> DTG
                  durFromDTG: DTG +> Duration
                  durToDate: Duration +> Date
                  durFromDate: Date +> Duration
                  durToTime: Duration +> UTC
                  durFromTime: Time +> Duration
                  durFromInterval: Interval +> Duration
                  minDTG: set of DTG +> DTG
                  maxDTG: set of DTG +> DTG
                  minDate: set of Date +> Date
                  maxDate: set of Date +> Date
                  minTime: set of Time +> Time
                  maxTime: set of Time +> Time
                  minDuration: set of Duration +> Duration
                  maxDuration: set of Duration +> Duration
                  sumDuration: seq of Duration +> Duration
                  instant: DTG +> Interval
                  format: DTG +> seq of char
                  formatDate: Date +> seq of char
                  formatTime: Time +> seq of char
                  formatInterval: Interval +> seq of char
                  formatDuration: Duration +> seq of char
                  normalise: DTG +> DTG

definitions

types

  -- A year: 0 = 0AD (or 1BC).
  Year = nat
  inv year == FIRST_YEAR <= year and year <= LAST_YEAR;

  -- A month in a year (January is numbered 1).
  Month = nat1
  inv month == month <= MONTHS_PER_YEAR;

  -- A day in a month.
  Day = nat1
  inv day == day <= MAX_DAYS_PER_MONTH;

  -- An hour in a day.
  Hour = nat
  inv hour == hour < HOURS_PER_DAY;

  -- A minute in an hour.
  Minute = nat
  inv minute == minute < MINUTES_PER_HOUR;

  -- A second in a minute.
  Second = nat
  inv second == second < SECONDS_PER_MINUTE;

  -- A millisecond in a second.
  Millisecond = nat
  inv milli == milli < MILLIS_PER_SECOND;

  -- A date is a triple (year/month/day).
  -- Day of month must be consistent with respect to year.
  Date :: year :Year
          month:Month
          day  :Day
  inv mk_Date(y,m,d) == d <= daysInMonth(y,m);

  -- A time consists of four elements (hours/minutes/seconds/milliseconds),
  -- optionally with a time zone offset.
  Time :: hour  :Hour
          minute:Minute
          second:Second
          milli :Millisecond
          offset:[Offset];

  -- The timezone offset
  Offset :: delta:Duration
            pm   :[PlusOrMinus]
            -- Offset must be less than one day and an integral number of minutes.
  inv os == durLess(os.delta, ONE_DAY) and durModMinutes(os.delta) = NO_DURATION;

  PlusOrMinus = <PLUS> | <MINUS>;

  -- UTC time: a time with no offset.
  UTC = Time
  inv utc == utc.offset = nil;

  -- A DTG (date/time group) is a combined date and time.
  DTG :: date:Date
         time:Time
  inv mk_DTG(date,time) ==
        let utcTimeDur = durFromUTCTime(toUTC(time))
        in -- Adjusted time must not be earlier than 0000-01-01T00:00:00Z.
           (date = FIRST_DATE and time.offset <> nil and time.offset.pm = <PLUS> =>
                durGeq(utcTimeDur,time.offset.delta)) and
           -- Adjusted time must not be later than 9999-12-31T23:59:59,999Z
           (date = LAST_DATE and time.offset <> nil and time.offset.pm = <MINUS> =>
                durLess(durAdd(utcTimeDur,time.offset.delta),ONE_DAY));

  -- An interval is a pair of DTGs representing all time instants between those
  -- bounding values (inclusive).
  -- The end of the interval must not be earlier than the start.
  Interval :: begins:DTG
              ends  :DTG
  inv ival == dtgLeq(ival.begins, ival.ends);

  -- Duration: a period of time in milliseconds.
  Duration :: dur:nat;

values

  MILLIS_PER_SECOND:nat = 1000;
  SECONDS_PER_MINUTE:nat = 60;
  MINUTES_PER_HOUR:nat = 60;
  HOURS_PER_DAY:nat = 24;
  DAYS_PER_MONTH:map nat1 to nat1 = {1|->31, 2|->28, 3|->31, 4|->30, 5|->31, 6|->30,
                                     7|->31, 8|->31, 9|->30, 10|->31, 11|->30, 12|->31};
  DAYS_PER_MONTH_LEAP:map nat1 to nat1 = DAYS_PER_MONTH ++ {2|->29};
  MAX_DAYS_PER_MONTH:nat1 = Set`max(rng DAYS_PER_MONTH);
  MONTHS_PER_YEAR:nat1 = card dom DAYS_PER_MONTH;
  DAYS_PER_YEAR:nat1 = daysInYear(1); -- 1 is an arbitrary non-leap year.
  DAYS_PER_LEAP_YEAR:nat1 = daysInYear(4); -- 4 is an arbitrary leap year.
  FIRST_YEAR:nat = 0;
  LAST_YEAR:nat = 9999;
  FIRST_DATE:Date = mk_Date(FIRST_YEAR,1,1);
  LAST_DATE:Date = mk_Date(LAST_YEAR,12,31);
  NO_DURATION:Duration = durFromMillis(0);
  ONE_MILLISECOND:Duration = durFromMillis(1);
  ONE_SECOND:Duration = durFromSeconds(1);
  ONE_MINUTE:Duration = durFromMinutes(1);
  ONE_HOUR:Duration = durFromHours(1);
  ONE_DAY:Duration = durFromDays(1);
  ONE_YEAR:Duration = durFromDays(DAYS_PER_YEAR);
  ONE_LEAP_YEAR:Duration = durFromDays(DAYS_PER_LEAP_YEAR);

functions

  -- Create a UTC time (without milliseconds).
  mkUTC: Hour * Minute * Second +> UTC
  mkUTC(h,m,s) == mk_Time(h,m,s,0,nil);

  -- Is a time in UTC?
  isUTC: Time +> bool
  isUTC(time) == time.offset = nil;

  -- Drop the offset part of a time.
  toUTC: Time +> UTC
  toUTC(time) == mu(time, offset|->nil);

  -- Is a year a leap year?
  isLeap: Year +> bool
  isLeap(year) == year rem 4 = 0 and (year rem 100 = 0 => year rem 400 = 0);

  -- The number of days in a month with respect to a year.
  daysInMonth: Year * Month +> nat1
  daysInMonth(year,month) ==
    if isLeap(year) then DAYS_PER_MONTH_LEAP(month) else DAYS_PER_MONTH(month);

  -- The number of days in a year.
  daysInYear: Year +> nat1
  daysInYear(year) == Seq`sum ([daysInMonth(year,m) | m in set {1,...,MONTHS_PER_YEAR}]);

  -- Order relation on dates.
  dateLess: Date * Date +> bool
  dateLess(mk_Date(y1,m1,d1), mk_Date(y2,m2,d2)) ==
    y1<y2 or (y1=y2 and m1<m2) or (y1=y2 and m1=m2 and d1<d2);

  -- Less than or equal relation on dates.
  dateLeq: Date * Date +> bool
  dateLeq(date1,date2) == dateLess(date1, date2) or date1 = date2;

  -- Greater than relation on dates.
  dateGrtr: Date * Date +> bool
  dateGrtr(d1, d2) == dateLess(d2, d1);

  -- Greater than or equal relation on dates.
  dateGeq: Date * Date +> bool
  dateGeq(d1, d2) == dateLeq(d2, d1);

  -- Equality relation on times.
  -- Primitive equality insufficient since offset must be considered.
  timeEq: Time * Time +> bool
  timeEq(time1, time2) == normaliseTime(time1) = normaliseTime(time2);

  -- Order relation on times.
  timeLess: Time * Time +> bool
  timeLess(time1, time2) ==
    utcLess(normaliseTime(time1).#1, normaliseTime(time2).#1);

  -- Order relation on UTC times.
  utcLess: UTC * UTC +> bool
  utcLess(mk_Time(h1,m1,s1,l1,-), mk_Time(h2,m2,s2,l2,-)) ==
    h1<h2 or (h1=h2 and m1<m2) or (h1=h2 and m1=m2 and s1<s2) or
    (h1=h2 and m1=m2 and s1=s2 and l1<l2);

  -- Less than or equal relation on times.
  timeLeq: Time * Time +> bool
  timeLeq(time1, time2) == timeLess(time1, time2) or timeEq(time1, time2);

  -- Greater than relation on times.
  timeGrtr: Time * Time +> bool
  timeGrtr(d1, d2) == timeLess(d2, d1);

  -- Greater than or equal relation on times.
  timeGeq: Time * Time +> bool
  timeGeq(d1, d2) == timeLeq(d2, d1);

  -- Equality relation on DTGs: are their normalised values identical?
  -- Primitive equality insufficient since primitive equality on times is insufficient.
  dtgEq: DTG * DTG +> bool
  dtgEq(dtg1, dtg2) == normalise(dtg1) = normalise(dtg2);

  -- Order relation on DTGs.
  dtgLess: DTG * DTG +> bool
  dtgLess(dtg1, dtg2) ==
    let n1 = normalise(dtg1),
        n2 = normalise(dtg2)
    in dateLess(n1.date,n2.date) or (n1.date=n2.date and utcLess(n1.time,n2.time));

  -- Less than or equal relation on DTGs.
  dtgLeq: DTG * DTG +> bool
  dtgLeq(dtg1, dtg2) == dtgLess(dtg1, dtg2) or dtgEq(dtg1, dtg2);

  -- Greater than relation on DTGs.
  dtgGrtr: DTG * DTG +> bool
  dtgGrtr(d1, d2) == dtgLess(d2, d1);

  -- Greater than or equal relation on DTGs.
  dtgGeq: DTG * DTG +> bool
  dtgGeq(d1, d2) == dtgLeq(d2, d1);

  -- Order relation on durations.
  durLess: Duration * Duration +> bool
  durLess(d1, d2) == d1.dur < d2.dur;

  -- Less than or equal relation on durations.
  durLeq: Duration * Duration +> bool
  durLeq(d1, d2) == durLess(d1,d2) or d1 = d2;

  -- Greater than relation on durations.
  durGrtr: Duration * Duration +> bool
  durGrtr(d1, d2) == durLess(d2, d1);

  -- Greater than or equal relation on durations.
  durGeq: Duration * Duration +> bool
  durGeq(d1, d2) == durLeq(d2, d1);

  -- Does a DTG fall between two given DTGs?
  dtgInRange: DTG * DTG * DTG +> bool
  dtgInRange(dtg1, dtg2, dtg3) == dtgLeq(dtg1, dtg2) and dtgLeq(dtg2, dtg3);

  -- Does a DTG fall within an interval?
  inInterval: DTG * Interval +> bool
  inInterval(dtg, ival) == dtgInRange(ival.begins, dtg, ival.ends);

  -- Do two intervals overlap?
  overlap: Interval * Interval +> bool
  overlap(i1, i2) == dtgLeq(i2.begins,i1.ends) and dtgLeq(i1.begins,i2.ends);
  --post RESULT = exists d:DTG & inInterval(d, i1) and inInterval(d, i2);

  -- Does one interval fall wholly within another interval?
  within: Interval * Interval +> bool
  within(i1, i2) == dtgLeq(i2.begins,i1.begins) and dtgLeq(i1.ends,i2.ends);
  --post RESULT = forall d:DTG & inInterval(d, i1) => inInterval(d, i2);

  -- Increase a DTG by a duration.
  add: DTG * Duration +> DTG
  add(dtg, dur) == durToDTG(durAdd(durFromDTG(dtg),dur))
  post RESULT.time.offset = dtg.time.offset and subtract(RESULT,dur) = dtg;

  -- Decrease a DTG by a duration.
  subtract: DTG * Duration +> DTG
  subtract(dtg, dur) == durToDTG(durDiff(durFromDTG(dtg),dur))
  pre durLeq(dur, durFromDTG(dtg))
  post RESULT.time.offset = dtg.time.offset;
  --post add(RESULT,dur) = dtg;

  -- The duration between two DTGs.
  diff: DTG * DTG +> Duration
  diff(dtg1, dtg2) == durDiff(durFromDTG(dtg1), durFromDTG(dtg2))
  post (dtgLeq(dtg1,dtg2) => add(dtg1,RESULT) = dtg2) and
       (dtgLeq(dtg2,dtg1) => add(dtg2,RESULT) = dtg1);

  -- Add two durations.
  durAdd: Duration * Duration +> Duration
  durAdd(d1, d2) == mk_Duration(d1.dur + d2.dur)
  --post durDiff(RESULT, d1) = d2 and durDiff(RESULT,d2) = d1;
  post durSubtract(RESULT, d1) = d2 and
       durSubtract(RESULT, d2) = d1;

  -- Subtract on duration from another.
  durSubtract: Duration * Duration +> Duration
  durSubtract(d1, d2) == mk_Duration(d1.dur - d2.dur)
  pre durGeq(d1, d2);
  --post durAdd(RESULT, d2) = d1;

  -- Multiply a duration by a fixed amount.
  durMultiply: Duration * nat +> Duration
  durMultiply(d, n) == mk_Duration(d.dur * n)
  post durDivide(RESULT, n) = d;

  -- Divide a duration by a fixed amount.
  durDivide: Duration * nat +> Duration
  durDivide(d, n) == mk_Duration(d.dur div n);
  --post durLeq(durMultiply(RESULT, n), d) and durLess(d, durMultiply(RESULT, n+1));

  -- The difference between two durations.
  durDiff: Duration * Duration +> Duration
  durDiff(d1, d2) == mk_Duration(abs(d1.dur - d2.dur))
  post (durLeq(d1,d2) => durAdd(d1,RESULT)=d2) and (durLeq(d2,d1) => durAdd(d2,RESULT)=d1);

  -- The whole number of milliseconds in a duration.
  durToMillis: Duration +> nat
  durToMillis(d) == d.dur
  post durFromMillis(RESULT) = d;

  -- The duration of a number of milliseconds.
  durFromMillis: nat +> Duration
  durFromMillis(sc) == mk_Duration(sc);
  --post durToMillis(RESULT) = sc;

  -- The whole number of seconds in a duration.
  durToSeconds: Duration +> nat
  durToSeconds(d) == durToMillis(d) div MILLIS_PER_SECOND
  post durLeq(durFromSeconds(RESULT), d) and durLess(d, durFromSeconds(RESULT+1));

  -- The duration of a number of seconds.
  durFromSeconds: nat +> Duration
  durFromSeconds(sc) == durFromMillis(sc*MILLIS_PER_SECOND);
  --post durToSeconds(RESULT) = sc;

  -- The whole number of minutes in a duration.
  durToMinutes: Duration +> nat
  durToMinutes(d) == durToSeconds(d) div SECONDS_PER_MINUTE
  post durLeq(durFromMinutes(RESULT), d) and durLess(d, durFromMinutes(RESULT+1));

  -- The duration of a number of minutes.
  durFromMinutes: nat +> Duration
  durFromMinutes(mn) == durFromSeconds(mn*SECONDS_PER_MINUTE);
  --post durToMinutes(RESULT) = mn;

  -- Remove all whole minutes from a duration.
  durModMinutes : Duration +> Duration
  durModMinutes(d) == mk_Duration(d.dur rem ONE_MINUTE.dur)
  post durLess(RESULT, ONE_MINUTE);
  --exists n:nat & durAdd(durFromMinutes(n),RESULT) = d

  -- The whole number of hours in a duration.
  durToHours: Duration +> nat
  durToHours(d) == durToMinutes(d) div MINUTES_PER_HOUR
  post durLeq(durFromHours(RESULT), d) and durLess(d, durFromHours(RESULT+1));

  -- The duration of a number of hours.
  durFromHours: nat +> Duration
  durFromHours(hr) == durFromMinutes(hr*MINUTES_PER_HOUR);
  --post durToHours(RESULT) = hr;

  -- Remove all whole hours from a duration.
  durModHours : Duration +> Duration
  durModHours(d) == mk_Duration(d.dur rem ONE_HOUR.dur)
  post durLess(RESULT, ONE_HOUR);
  --exists n:nat & durAdd(durFromHours(n),RESULT) = d

  -- The whole number of days in a duration.
  durToDays: Duration +> nat
  durToDays(d) == durToHours(d) div HOURS_PER_DAY
  post durLeq(durFromDays(RESULT), d) and durLess(d, durFromDays(RESULT+1));

  -- The duration of a number of days.
  durFromDays: nat +> Duration
  durFromDays(dy) == durFromHours(dy*HOURS_PER_DAY);
  --post durToDays(RESULT) = dy;

  -- Remove all whole days from a duration.
  durModDays : Duration +> Duration
  durModDays(d) == mk_Duration(d.dur rem ONE_DAY.dur)
  post durLess(RESULT, ONE_DAY);
  --exists n:nat & durAdd(durFromDays(n),RESULT) = d

  -- The whole number of months in a duration (with respect to a year).
  durToMonth: Duration * Year +> nat
  durToMonth(dur, year) ==
    Set`max({ m | m in set {1,...,MONTHS_PER_YEAR} & durLeq(durUptoMonth(year,m), dur) }) - 1
  pre durLess(dur,durFromYear(year));

  -- The duration of a month (with respect to a year).
  durFromMonth: Year * Month +> Duration
  durFromMonth(year, month) == durFromDays(daysInMonth(year,month));

  -- The duration up to the start of a month (with respect to a year).
  durUptoMonth: Year * Month +> Duration
  durUptoMonth(year, month) == sumDuration([durFromMonth(year,m) | m in set {1,...,month-1}]);

  -- The whole number of years in a duration (starting from a reference year).
  durToYear : Duration * Year +> nat
  durToYear(dur, year) ==
    if durLess (dur, durFromYear(year))
    then 0
    else 1 + durToYear(durDiff(dur, durFromYear(year)), year+1)
  --post RESULT = Set`max({ y | y : Year & durLeq(durUptoYear(year+y), dur) })
  measure durToYear_measure;

  -- The measure function for durToYear
  durToYear_measure : Duration * Year +> nat
  durToYear_measure(d,-) == d.dur;

  -- The duration of a year.
  durFromYear: Year +> Duration
  durFromYear(year) == durFromDays(daysInYear(year));

  -- The duration up to the start of a year.
  durUptoYear: Year +> Duration
  durUptoYear(year) == sumDuration([durFromYear(y) | y in set {FIRST_YEAR,...,year-1}]);

  -- The DTG corresponding to a duration.
  durToDTG: Duration +> DTG
  durToDTG(dur) == let dy = durFromDays(durToDays(dur))
                   in mk_DTG(durToDate(dy),durToTime(durDiff(dur,dy)))
  post isUTC(RESULT.time) and durFromDTG(RESULT) = dur;

  -- The duration of a DTG (with respect to the start of time).
  durFromDTG: DTG +> Duration
  durFromDTG(dtg) == let ndtg = normalise(dtg)
                     in durAdd(durFromDate(ndtg.date),durFromTime(ndtg.time));
  --post durToDTG(RESULT) = dtg;

  -- The date corresponding to a duration.
  durToDate: Duration +> Date
  durToDate(dur) == let yr = durToYear(dur,FIRST_YEAR),
                        ydur = durDiff(dur, durUptoYear(yr)),
                        mn = durToMonth(ydur,yr)+1,
                        dy = durToDays(durDiff(ydur, durUptoMonth(yr,mn)))+1
                    in mk_Date(yr,mn,dy)
  post durLeq(durFromDate(RESULT), dur) and durLess(dur, durAdd(durFromDate(RESULT),ONE_DAY));

  -- The duration of a date (with respect to the start of time).
  durFromDate: Date +> Duration
  durFromDate(date) ==
    durAdd(durUptoYear(date.year),
           durAdd(durUptoMonth(date.year,date.month), durFromDays(date.day-1)));
  --post durToDate(RESULT) = date;

  -- The time corresponding to a duration.
  durToTime: Duration +> UTC
  durToTime(dur) == let hr = durToHours(dur),
                        mn = durToMinutes(durDiff(dur,durFromHours(hr))),
                        hmd = durAdd(durFromHours(hr),durFromMinutes(mn)),
                        sc = durToSeconds(durDiff(dur,hmd)),
                        ml = durToMillis(durDiff(dur,durAdd(hmd,durFromSeconds(sc))))
                    in mk_Time(hr,mn,sc,ml,nil)
  pre durLess(dur,ONE_DAY)
  post durFromTime(RESULT) = dur;

  -- The duration of a time.
  durFromTime: Time +> Duration
  durFromTime(time) ==
    let ntime = normaliseTime(time).#1
    in durFromUTCTime(ntime);
  --post timeEq(durToTime(RESULT), time);

  -- The duration of a UTC time; offset correction not necessary.
  durFromUTCTime: UTC +> Duration
  durFromUTCTime(time) ==
    durAdd(durFromHours(time.hour),
           durAdd(durFromMinutes(time.minute),
                  durAdd(durFromSeconds(time.second),durFromMillis(time.milli))));
  --post durToTime(RESULT) = time;

  -- The duration of a time interval.
  durFromInterval: Interval +> Duration
  durFromInterval(i) == diff(i.begins, i.ends)
  post add(i.begins, RESULT) = i.ends;

  -- The minimum DTG in a set.
  minDTG: set of DTG +> DTG
  minDTG(dtgs) == iota dtg in set dtgs & forall d in set dtgs & dtgLeq(dtg, d)
  pre dtgs <> {};

  -- The maximum DTG in a set.
  maxDTG: set of DTG +> DTG
  maxDTG(dtgs) == iota dtg in set dtgs & forall d in set dtgs & dtgLeq(d, dtg)
  pre dtgs <> {};

  -- The minimum Date in a set.
  minDate: set of Date +> Date
  minDate(dates) == iota date in set dates & forall d in set dates & dateLeq(date, d)
  pre dates <> {};

  -- The maximum Date in a set.
  maxDate: set of Date +> Date
  maxDate(dates) == iota date in set dates & forall d in set dates & dateLeq(d, date)
  pre dates <> {};

  -- The minimum Time in a set.
  minTime: set of Time +> Time
  minTime(times) == iota time in set times & forall t in set times & timeLeq(time, t)
  pre times <> {};

  -- The maximum Time in a set.
  maxTime: set of Time +> Time
  maxTime(times) == iota time in set times & forall t in set times & timeLeq(t, time)
  pre times <> {};

  -- The minimum Duration in a set.
  minDuration: set of Duration +> Duration
  minDuration(durs) == iota dur in set durs & forall d in set durs & durLeq(dur, d)
  pre durs <> {};

  -- The maximum Duration in a set.
  maxDuration: set of Duration +> Duration
  maxDuration(durs) == iota dur in set durs & forall d in set durs & durLeq(d, dur)
  pre durs <> {};

  -- The sum of a sequence of durations.
  sumDuration: seq of Duration +> Duration
  sumDuration(sd) == mk_Duration(Seq`sum([ sd(i).dur | i in set inds sd ]));

  -- An interval that represents an instant in time.
  instant: DTG +> Interval
  instant(dtg) == mk_Interval(dtg,dtg)
  post inInterval(dtg, RESULT);
       --and forall d:DTG & dtgEq(d,dtg) <=> inInterval(d,RESULT);

  -- Format a date and time as per ISO 8601.
  format: DTG +> seq of char
  format(dtg) == formatDate(dtg.date) ^ "T" ^ formatTime(dtg.time);

  -- Format a date as per ISO 8601.
  formatDate: Date +> seq of char
  formatDate(mk_Date(y,m,d)) ==
    Numeric`zeroPad(y,4) ^ "-" ^ Numeric`zeroPad(m,2) ^ "-" ^ Numeric`zeroPad(d,2);

  -- Format a time as per ISO 8601.
  formatTime: Time +> seq of char
  formatTime(mk_Time(h,m,s,l,o)) ==
    let frac = if l = 0 then "" else "," ^ Numeric`zeroPad(l,3),
        os = if o = nil then "Z" else formatOffset(o)
    in Numeric`zeroPad(h,2) ^ ":" ^ Numeric`zeroPad(m,2) ^ ":" ^
       Numeric`zeroPad(s,2) ^ frac ^ os;

  -- Format a time offset as per ISO 8601.
  formatOffset: Offset +> seq of char
  formatOffset(mk_Offset(dur,pm)) ==
    let hm = durToTime(dur),
             sign = if pm = <PLUS> then "+" else "-"
    in sign ^ Numeric`zeroPad(hm.hour,2) ^ ":" ^ Numeric`zeroPad(hm.minute,2);

  -- Format a DTG interval as per ISO 8601.
  formatInterval: Interval +> seq of char
  formatInterval(interval) == format(interval.begins) ^ "/" ^ format(interval.ends);

  -- Format a duration as per ISO 8601.
  formatDuration: Duration +> seq of char
  formatDuration(d) ==
    let numDays = durToDays(d),
        mk_Time(h,m,s,l,-) = durToTime(durModDays(d)),
        item: nat * char +> seq of char
        item(n,c) == if n = 0 then "" else Numeric`formatNat(n)^[c],
        itemSec: nat * nat +> seq of char
        itemSec(x,y) == Numeric`formatNat(x) ^ "." ^ Numeric`zeroPad(y,3) ^ "S",
        date = item(numDays,'D'),
        time = item(h,'H') ^ item(m,'M') ^ if l=0 then item(s,'S') else itemSec(s,l)
    in if date="" and time=""
       then "PT0S"
       else "P" ^ date ^ (if time="" then "" else "T" ^ time);

  -- Normalise a DTG value such that it is expressed as UTC; the offset is nil.
  -- Applying the offset may result in a change of date.
  -- Example: 2001-01-01T01:00+02:00 becomes 2000-12-31T23:00Z.
  normalise: DTG +> DTG
  normalise(dtg) == let mk_(ntime,pm) = normaliseTime(dtg.time),
                        baseDtg = mk_DTG(dtg.date,ntime)
                    in cases pm:
                         nil     -> baseDtg,
                         <PLUS>  -> subtract(baseDtg,ONE_DAY),
                         <MINUS> -> add(baseDtg,ONE_DAY)
                       end;

  -- Normalise a time value to UTC with respect to the offset, wrapping across the day
  -- boundary. Return an indication if the normalisation pushes the time to a different day.
  -- Example: 01:00+02:00 (01:00, two hours ahead of UTC) becomes (23:00Z,<PLUS>) indicating
  -- the original time with offset is on the day after the UTC time.
  -- Similarly, 23:30-01:15 becomes (00:45,<MINUS>).
  normaliseTime: Time +> UTC * [PlusOrMinus]
  normaliseTime(time) ==
    let utcTimeDur = durFromUTCTime(toUTC(time))
    in cases time.offset:
         nil
           -> -- Time already UTC
              mk_(time,nil),
         mk_Offset(offset,<PLUS>)
           -> -- Zone offset ahead of UTC
              if durLeq(offset,utcTimeDur)
              then -- No day change
                   mk_(durToTime(durSubtract(utcTimeDur,offset)), nil)
              else -- UTC time one day earlier
                   mk_(durToTime(durSubtract(durAdd(utcTimeDur,ONE_DAY),offset)),<PLUS>),
         mk_Offset(offset,<MINUS>)
           -> -- Zone offset behind UTC
              let adjusted = durAdd(utcTimeDur,offset)
              in if durLess(adjusted,ONE_DAY)
                 then -- No day change
                      mk_(durToTime(adjusted),nil)
                 else -- UTC time one day later
                      mk_(durToTime(durSubtract(adjusted,ONE_DAY)),<MINUS>)
       end;

end ISO8601
~~~
{% endraw %}

### Numeric.vdmsl

{% raw %}
~~~
/*
   A module that specifies and defines general purpose functions over numerics.

   All definitions are explicit and executable.
*/
module Numeric
imports from Char all,
        from Seq all
exports functions min: real * real +> real
                  max: real * real +> real
                  formatNat: nat +> seq of Char`Digit
                  zeroPad: nat * nat1 +> seq of Char`Digit
                  formatNat: nat +> seq of Char`Digit
                  fromChar: Char`Digit +> nat
                  toChar: nat +> Char`Digit
                  add: real * real +> real
                  mult: real * real +> real

definitions

functions

  -- The minimum of two numerics.
  min: real * real +> real
  min(x,y) == if x<y then x else y;

  -- The maximum of two numerics.
  max: real * real +> real
  max(x,y) == if x>y then x else y;

  -- Format a natural number as a string of digits.
  formatNat: nat +> seq of Char`Digit
  formatNat(n) == if n < 10
                  then [toChar(n)]
                  else formatNat(n div 10) ^ [toChar(n mod 10)]
  measure n;

  -- Convert a character digit to the corresponding natural number.
  fromChar: Char`Digit +> nat
  fromChar(c) == Seq`indexOf[Char`Digit](c,Char`DIGITS)-1
  post toChar(RESULT) = c;

  -- Convert a numeric digit to the corresponding character.
  toChar: nat +> Char`Digit
  toChar(n) == Char`DIGITS(n+1)
  pre 0 <= n and n <= 9;
  --post fromChar(RESULT) = n

  -- Format a natural number as a string with leading zeros up to a specified length.
  zeroPad: nat * nat1 +> seq of Char`Digit
  zeroPad(n,w) == Seq`padLeft[Char`Digit](formatNat(n),'0',w);

  -- The following functions wrap primitives for convenience, to allow them for example to
  -- serve as function arguments.

  -- Sum of two numbers.
  add: real * real +> real
  add(m,n) == m+n;

  -- Product of two numbers.
  mult: real * real +> real
  mult(m,n) == m*n;


end Numeric
~~~
{% endraw %}

