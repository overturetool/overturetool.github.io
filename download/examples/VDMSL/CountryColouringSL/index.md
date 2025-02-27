---
layout: default
title: CountryColouringSL
---

## CountryColouringSL
Author: Anne Haxthausen


This model has been translated by Peter Gorm Larsen from a similar
model made in the RAISE Specification Language by Anne Haxthausen. It
specifies relationships between countries on a map where naboring
countries shall be coloured differently.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| DEFAULT`colMapExpl({mk_("Denmark","Sweden"),mk_("Denmark","Germany"),mk_("Germany","Poland")})|


### CountryColouring.vdmsl

{% raw %}
~~~
              
types

  Country = seq of char;

  Relation = set of (Country * Country);

  Colour = set of Country;

  Colouring = set of Colour;

functions

  isRelation: Relation -> bool
  isRelation(r) ==
    forall mk_(c1,c2) in set r & c1 <> c2;

  areNb: Country * Country * Relation -> bool
  areNb(cn1,cn2,r) ==
    mk_(cn1,cn2) in set r or mk_(cn2,cn1) in set r;

  CountriesRel: Relation -> set of Country
  CountriesRel(r) ==
    dunion {{c1,c2} | mk_(c1,c2) in set r};

  sameColour: Country * Country * Colouring -> bool
  sameColour(cn1,cn2,cols) ==
    exists col in set cols & cn1 in set col and cn2 in set col;

  CountriesCol: Colouring -> set of Country
  CountriesCol(cols) ==
    dunion cols;

  isColouring: Colouring -> bool
  isColouring(cols) ==
    forall col1,col2 in set cols & col1 <> col2 => col1 inter col2 = {};

  isColouringOf: Colouring * set of Country -> bool
  isColouringOf(cols,cns) ==
    CountriesCol(cols) = cns;

  nbDistinctColours: Colouring * Relation -> bool
  nbDistinctColours(cols,r) ==
    forall cn1, cn2 in set CountriesRel(r) &
           areNb(cn1,cn2,r) => not sameColour(cn1,cn2,cols);

  colMap(r: Relation) cols : Colouring 
  pre isRelation(r)
  post isColouring(cols) and
       isColouringOf(cols, CountriesRel(r)) and
       nbDistinctColours(cols, r);

  canBeExtBy: Colour * Country * Relation -> bool 
  canBeExtBy(col, c, r) ==
    forall c1 in set col & not areNb(c1, c, r);

  extndCol: Colouring * Country * Relation -> Colouring
  extndCol(cols,c,r) ==
    if cols = {} 
    then {{c}}
    else let col in set cols 
         in
           if canBeExtBy(col,c,r)
           then { {c} union col } union cols \ {col}
           else { col } union extndCol(cols \ {col}, c, r)
  measure card cols;

  colCntrs: set of Country * Relation -> Colouring
  colCntrs(cs, r) ==
    if cs = {} 
    then  {}
    else let c in set cs 
         in 
           extndCol(colCntrs(cs\{c}, r), c, r)
  measure card cs;

  colMapExpl: Relation -> Colouring
  colMapExpl(r) ==
    colCntrs(CountriesRel(r), r)
   pre isRelation(r)
            
~~~
{% endraw %}

