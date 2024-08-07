---
layout: default
title: expressSL
---

## expressSL
Author: Marcel Verhoef


The (building) industry in Europe currently uses the 
ISO-STEP standard to define information models with the 
aim to exchange data about those information models. The 
ISO-STEP standard contains the EXPRESS modelling language 
and several programming language bindings and an ASCII 
neutral format to implement interfaces to those models. 
Unfortunately, industry has not reached consensus on a 
particular information model, therefore multiple models 
exist. This raises the need to migrate instances from one 
model to another and vice-versa, commonly referred to as 
the "mapping". The aim of this exercise was to determine 
the applicability of VDM-SL with respect to these types 
of problems. For more details on the mapping issue down-
loadable copies of two papers resulting from this research 
is available. The example shows a simple VDM-SL abstract 
syntax representation of the ISO STEP part 21 physical 
file format and a transformation process for a particular 
set of abstract syntax instances. It implements a mapping 
between the relational model representation (rmrep) into 
a simple polynomial representation. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| Database`Transform()|


### express.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                
module Database

exports all

definitions

types
  
PhysicalFile ::
  headersec : map seq of char to seq of Parameter
  datasec   : map nat to ([Scope] * Record);

HeaderEntity ::
  name  : seq of char
  parms : seq of Parameter;

Scope :: ;

Record = SimpleRecord | SuperRecord ;

SuperRecord ::
  rec_list : seq of SimpleRecord;

SimpleRecord ::
  name  : seq of char
  parms : seq of Parameter;

Parameter = StringParameter |
            RealParameter |
            IntegerParameter |
            EntityInstanceName |
            EnumerationParameter |
            BinaryParameter |
            ListParameter |
            TypedParameter |
            OmittedParameter |
            UnknownParameter ;

StringParameter ::
  data : seq of char;

RealParameter ::
  data : real;

IntegerParameter ::
  data : int;

EntityInstanceName ::
  data : nat;

EnumerationParameter ::
  data : seq of char;

BinaryParameter ::
  data : bool;

ListParameter ::
  data : seq of Parameter;

TypedParameter::
  name : seq of char
  data : Parameter;

OmittedParameter:: ;

UnknownParameter::

operations

CheckReferences: Parameter ==> set of nat
CheckReferences(parm) ==
  cases parm:
    mk_EntityInstanceName(id) -> return {id},
    mk_ListParameter(parms) ->
        ( dcl res : set of nat := {};
          for subparm in parms do
            res := res union CheckReferences(subparm);
          return res),
    others -> return {}
  end;

FindAllReferencesToEntity: nat ==> set of nat
FindAllReferencesToEntity (eid) ==
  let eins = dom in_model.datasec \ {eid} 
  in
  ( dcl res : set of nat := {};
    for all ein in set eins do
      let mk_(-,mk_SimpleRecord(-,parms)) = 
          in_model.datasec(ein) 
      in
        if eid in set CheckReferences(
                       mk_ListParameter(parms)) 
        then res := res union {ein};
    return res
  );

FindAllInstances: seq of char ==> set of nat
FindAllInstances(nm) ==
  let eins = dom in_model.datasec 
  in
  ( dcl res : set of nat := {};
    for all ein in set eins do
      let mk_(-,rec) = in_model.datasec(ein) 
      in
        if IsA (rec, nm) 
        then res := res union {ein};
    return res
  );
 
LookUpEntityInstance: nat ==> [Record]
LookUpEntityInstance (ein) ==
  let eins = dom in_model.datasec 
  in
    if ein in set eins 
    then let mk_(-,rec) = in_model.datasec(ein) 
         in
           return rec
    else return nil;

TransformRmVertex: nat ==> nat
TransformRmVertex(rmv_id) ==
  let mk_SimpleRecord(-,parms) = LookUpEntityInstance (rmv_id) 
  in
    let mk_EntityInstanceName(cpnt_id) = parms(5) 
    in
      return cpnt_id;

TransformRmEdge: nat ==> set of (nat * nat)
TransformRmEdge (rme_id) ==
  let mk_SimpleRecord(-,parms) = LookUpEntityInstance(rme_id) 
  in
    let mk_ListParameter(rmees) = parms(3) 
    in
    ( dcl res : set of (nat * nat) := {};
      for rmee in rmees do
        let mk_EntityInstanceName(rmee_id) = rmee 
        in
          let {rmee_ref} = FindAllReferencesToEntity(rmee_id)\{rme_id} 
          in
            res := res union {mk_(rme_id, TransformRmVertex(rmee_ref))};
      return res
    );

       TransformRmLoop: nat ==> seq of nat
       TransformRmLoop (rml_id) ==
          let mk_SimpleRecord(-,parms) = LookUpEntityInstance (rml_id) in
          let mk_ListParameter(rmess) = parms(2) in
            ( dcl res : set of (nat * nat) := {};
              for rmes in rmess do
                let mk_EntityInstanceName(rmes_id) = rmes in
                let rme_ref = FindAllReferencesToEntity(rmes_id) \ {rml_id} in
                   for all rme_id in set rme_ref do
                     res := res union TransformRmEdge(rme_id);
              return SortPoints(res)
            );

       Transform: () ==> set of seq of nat
       Transform () ==
          let rmls = FindAllInstances("RM_LOOP") in
            ( dcl res : set of seq of nat := {};
              for all rml in set rmls do
                 res := res union {TransformRmLoop(rml)};
              return res
            );

      Create: set of seq of nat ==> ()
      Create (AbstrMod) ==
         ( dcl ds : map nat to ([Scope] * Record) := {|->},
               LookUpTable : map nat to nat := {|->},
               polylist : seq of EntityInstanceName := [];
           for all ent in set Collect(AbstrMod) do
             ( last_id := last_id + 1;
               LookUpTable := LookUpTable munion { ent |-> last_id };
               let mk_SimpleRecord(-,parms) = LookUpEntityInstance(ent) in
                 ds := ds munion { last_id |-> mk_(nil, 
                   mk_SimpleRecord("VERTEX",[parms(3)]))}
             );
           for all poly in set AbstrMod do
             ( last_id := last_id + 1;
               ds := ds munion { last_id |-> mk_(nil,
                 mk_SimpleRecord("POLYLINE",[mk_ListParameter(
                   MapInToOut(poly,LookUpTable))]))};
               polylist := polylist ^ [mk_EntityInstanceName(last_id)]
             );
           ds := ds munion { last_id + 1 |-> mk_(nil,
             mk_SimpleRecord("DRAWING",[mk_ListParameter(polylist)]))};
           out_model := mk_PhysicalFile (
             { "FILE_NAME" |-> [mk_UnknownParameter()],
               "FILE_DESCRIPTION" |-> [mk_UnknownParameter()],
               "FILE_SCHEMA" |-> [mk_UnknownParameter()] }
             , ds )
        );

       DoMapping: PhysicalFile ==> PhysicalFile
       DoMapping (pf) ==
         ( in_model := pf;
           Create(Transform());
           return out_model
         )

    functions
      MapInToOut : seq of nat * map nat to nat -> seq of EntityInstanceName
      MapInToOut (ins, lut) ==
         if ins = [] then
           []
         else
           [mk_EntityInstanceName(lut(hd ins))] ^ MapInToOut(tl ins, lut)
      measure len ins;
      
      LenPar1: seq of nat * map nat to nat -> nat
      LenPar1(list,-) ==
        len list;

      Collect : set of seq of nat -> set of nat
      Collect (theSet) ==
        cases theSet:
          {} -> {},
          others -> let e in set theSet in elems e union Collect(theSet\{e})
        end
      measure card theSet;
      
      SetCard: set of seq of nat -> nat
      SetCard(s) ==
        card s;

      IsA: Record * seq of char -> bool
      IsA(rec,nm) ==
        if is_SimpleRecord(rec) then
          let mk_SimpleRecord (name,-) = rec in
             nm = name
        else
          false;

      SortInnerLeft: set of (nat * nat) * nat -> seq of nat
      SortInnerLeft (theSet, goal) ==
         cases theSet:
           {} -> [],
           others ->
             let mk_(a,b) in set theSet be st a = goal in
                SortInnerRight(theSet\{mk_(a,b)}, b)
         end;

      SortInnerRight: set of (nat * nat) * nat -> seq of nat
      SortInnerRight (theSet,goal) ==
         cases theSet:
           {} -> [],
           others ->
             let mk_(a,b) in set theSet be st b = goal in
                [b] ^ SortInnerLeft(theSet\{mk_(a,b)}, a)
         end;

      SortPoints : set of (nat * nat) -> seq of nat
      SortPoints (theSet) ==
         let mk_(a,b) in set theSet in
           SortInnerRight(theSet\{mk_(a,b)},b)

    state Kernel of
      in_model : PhysicalFile
      out_model : PhysicalFile
      last_id : nat
    init
      k == k = mk_Kernel(
                 mk_PhysicalFile({|->},{|->}),
                 mk_PhysicalFile({|->},{|->}),
                 0
               )
    end

end Database
                                          
~~~
{% endraw %}

