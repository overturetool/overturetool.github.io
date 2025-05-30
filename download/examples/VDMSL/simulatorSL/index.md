---
layout: default
title: simulatorSL
---

## simulatorSL
Author: V. S. Alagar \and D. Muthiayen


The simulator specified in VDM-SL in this example is the 
main component of an animation tool designed for use in 
the validation of complex real-time reactive systems 
described using TROM (Timed Reactive Object Model) 
formalism. We include two versions of the specifications; 
Section 2 contains the version in which implicit operations 
are used, and most of the operations are rewritten as explicit 
operations in the version contained in Section 3.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### simulator1.vdmsl

{% raw %}
~~~
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

module TROM

   exports all

definitions

types

PortType       :: label       : String
                  cardinality : nat
                  portlist    : seq of Port

inv mk_PortType(label, cardinality, portlist) ==

   (cardinality = card elems portlist);

Event          :: label    : String
                  type     : EventType
                  porttype : PortType

inv mk_Event(label, type, porttype) ==

   (((type = <INTERNAL>) and (porttype.label = "NULLPORT")) or
    ((type = <INPUT>) and (porttype.label <> "NULLPORT")) or
    ((type = <OUTPUT>) and (porttype.label <> "NULLPORT")));

State          :: label     : String
                  type      : StateType
                  isinitial : bool
                  substates : set of State

inv mk_State(label, type, isinitial, substates) ==

   (let exists_entry_state : set of State +> bool
        exists_entry_state(substates) ==
           ((exists1 s in set substates & (s.isinitial = true)) and
            (forall s in set substates &
              (((s.type = <SIMPLE>) and (s.substates = { })) or
               ((s.type = <COMPLEX>) and (exists_entry_state(s.substates)))))) 
    in
   (((type = <SIMPLE>) and (substates = { })) or
    ((type = <COMPLEX>) and (exists_entry_state(substates)))));

Attribute      :: label : String
                  type  : String;

LSLTrait       :: traitlabel   : String
                  traittype    : String
                  elementtypes : seq of String;

AttrFunction   :: stat       : State
                  attributes : set of Attribute;

TransitionSpec :: label         : String
                  sourcestate   : State
                  destinstate   : State
                  triggerevent  : Event
                  portcondition : bool
                  enabcondition : bool
                  postcondition : bool;

TimeConstraint :: label            : String
                  transition       : TransitionSpec
                  constrainedevent : Event
                  timebounds       : ReactionWindow
                  disablingstates  : set of State
                  reactionwindows  : set of ReactionWindow

inv mk_TimeConstraint(label,transition,cevent,tbounds,dstates,rwindows) ==

   (((cevent.type = <INTERNAL>) or (cevent.type = <OUTPUT>)) and
    (forall rw in set rwindows &
       ((rw.uppertimebound - rw.lowertimebound) =
                         (tbounds.uppertimebound - tbounds.lowertimebound))));

EventType      = <INPUT> | <INTERNAL> | <OUTPUT>;

StateType      = <SIMPLE> | <COMPLEX>;

ReactionWindow :: lowertimebound : nat
                  uppertimebound : nat

inv mk_ReactionWindow(lowertimebound, uppertimebound) ==

   (lowertimebound <= uppertimebound);

Port           :: label : String;

PortLink       :: tromporttuple1 : TromPortTuple
                  tromporttuple2 : TromPortTuple

inv mk_PortLink(tromporttuple1, tromporttuple2) ==

   (tromporttuple1.tromlabel <> tromporttuple2.tromlabel);

TromPortTuple  :: tromlabel : String
                  portlabel : String;

SimulationEvent :: eventlabel   : String
                   tromlabel    : String
                   portlabel    : String
                   occurtime    : nat
                   eventhistory : [EventHistory];

EventHistory    :: triggeredtransition : bool
                   tromcurrentstate    : [State]
                   assignmentvector    : [token]
                   reactionshistory    : set of ReactionHistory;

ReactionHistory :: timeconstraint : TimeConstraint
                   reactionwindow : ReactionWindow
                   reaction       : Reaction;

Reaction = <FIRED> | <DISABLED> | <ENABLED>;

LSLTraitDefinition :: label    : String
                      paramets : seq of String;

String         = seq1 of char;

Trom :: label            : String
        tromclass        : String
        porttypes        : set of PortType
        events           : set of Event
        states           : set of State
        attributes       : set of Attribute
        lsltraits        : set of LSLTrait
        attrfunctions    : set of AttrFunction
        transitionspecs  : set of TransitionSpec
        timeconstraints  : set of TimeConstraint
        currentstate     : State
        assignmentvector : token

inv mk_Trom(label,tromclass,porttypes,events,states,attributes,
            lsltraits,attrfunctions,
      transitionspecs,timeconstraints,currentstate,assignmentvector) ==

   (forall pt1, pt2 in set porttypes &
      (pt1.label = pt2.label => pt1 = pt2)) and

   (forall e1, e2 in set events &
      (e1.label = e2.label => e1 = e2)) and

   (forall s1, s2 in set states &
      (s1.label = s2.label => s1 = s2)) and

   (forall a1, a2 in set attributes &
      (a1.label = a2.label => a1 = a2)) and

   (forall tr1, tr2 in set lsltraits &
      (tr1.traittype = tr2.traittype => tr1 = tr2)) and

   (forall af1, af2 in set attrfunctions &
      (af1.stat = af2.stat => af1 = af2)) and

   (forall ts1, ts2 in set transitionspecs &
      (ts1.label = ts2.label => ts1 = ts2)) and

   (forall tc1, tc2 in set timeconstraints &
      (tc1.label = tc2.label => tc1 = tc2)) and

   (forall e in set events &
      (exists pt in set porttypes & (pt = e.porttype))) and

   (exists1 s in set states &
      (s.isinitial = true)) and

   (exists1 s in set states &
      ((currentstate = s) or (substate_of(currentstate, s)))) and

   (forall a in set attributes &
      ((exists1 pt in set porttypes & (pt.label = a.type)) or
       (exists1 tr in set lsltraits & (tr.traittype = a.type)))) and

   (forall tr in set lsltraits &
      (forall el in set elems tr.elementtypes &
         ((exists1 pt in set porttypes & (pt.label = el)) or
          (exists1 tr2 in set lsltraits & (tr2.traittype = el))))) and

   (forall af in set attrfunctions &
      ((exists1 s in set states & ((s = af.stat) or 
                                   (substate_of(af.stat, s)))) and
       (forall afa in set af.attributes &
          (exists1 a in set attributes & (a = afa))))) and

   (forall ts in set transitionspecs &
      ((exists1 s in set states & ((s = ts.sourcestate) or 
                                   (substate_of(ts.sourcestate, s)))) and
       (exists1 d in set states & ((d = ts.destinstate) or 
                                   (substate_of(ts.destinstate, d)))) and
       (exists1 e in set events & (e = ts.triggerevent)))) and
 
   (forall tc in set timeconstraints &
      ((exists1 ts in set transitionspecs & (ts = tc.transition)) and
       (exists1 e in set events &
         ((e = tc.constrainedevent) and
          ((e.type = <INTERNAL>) or (e.type = <OUTPUT>)))) and
       (forall ds in set tc.disablingstates &
         (exists1 s in set states & ((s = ds) or (substate_of(ds, s)))))));

Subsystem :: label     : String
             includes  : set of Subsystem
             troms     : set of Trom
             portlinks : set of PortLink

inv mk_Subsystem(label, includes, troms, portlinks) ==

   (forall s1, s2 in set includes &
      (s1.label = s2.label => s1 = s2)) and

   (let included_subsystem : String * set of Subsystem +> bool
        included_subsystem(subsystemlabel, subsystems) ==
           (exists1 s in set subsystems &
              ((s.label = subsystemlabel) or
               (included_subsystem(subsystemlabel, s.includes)))) in

   (not included_subsystem(label, includes))) and
   
   (forall trom1, trom2 in set troms &
      (trom1.label = trom2.label => trom1 = trom2)) and

   (let included_trom : String * set of Subsystem +> bool
        included_trom(tromlabel, subsystems) ==
           (exists1 s in set subsystems &
              ((exists1 trom in set s.troms &
                  (trom.label = tromlabel)) or
               (included_trom(tromlabel, s.includes)))) in

   (forall trom in set troms &
      (not included_trom(trom.label, includes)))) and

   (let linked_trom : TromPortTuple * set of Trom +> bool
        linked_trom(tptuple, troms) ==
           (exists1 trom in set troms &
              ((trom.label = tptuple.tromlabel) and
               (exists1 pt in set trom.porttypes &
                  (exists1 p in set elems pt.portlist & 
                     (p.label = tptuple.portlabel))))),

        linked_subsystem : TromPortTuple * set of Subsystem +> bool
        linked_subsystem(tptuple, subsystems) ==
           (exists1 s in set subsystems &
              (((linked_trom(tptuple, s.troms)) and 
               (not linked_subsystem(tptuple, s.includes))) or
               ((not linked_trom(tptuple, s.troms)) and 
                (linked_subsystem(tptuple, s.includes)))) and

            (forall s2 in set {su | su : Subsystem & 
               su in set subsystems and su <> s} &
               ((not linked_trom(tptuple, s2.troms)) and
                (not linked_subsystem(tptuple, s2.includes))))) in

      (forall pl in set portlinks &
         ((((linked_trom(pl.tromporttuple1, troms)) and
            (not linked_subsystem(pl.tromporttuple1, includes))) or
           ((not linked_trom(pl.tromporttuple1, troms)) and
            (linked_subsystem(pl.tromporttuple1, includes)))) and
          (((linked_trom(pl.tromporttuple2, troms)) and
            (not linked_subsystem(pl.tromporttuple2, includes))) or
           ((not linked_trom(pl.tromporttuple2, troms)) and
            (linked_subsystem(pl.tromporttuple2, includes)))))))

                             

state System of

SUBSYSTEM : Subsystem

SIMULATIONEVENTLIST : seq of SimulationEvent

LSLLIBRARY : set of LSLTraitDefinition

CLOCK : nat

inv mk_System(subsystem, simulationeventlist, lsllibrary, clock) ==

   (let contains_trom : Subsystem +> bool
        contains_trom(subsys) ==
           ((subsys.troms <> { }) or 
           (exists1 s in set subsys.includes & (contains_trom(s)))) 
    in

      contains_trom(subsystem)) and

   (let contains_portlink : Subsystem +> bool
        contains_portlink(subsys) ==
           ((subsys.portlinks <> { }) or 
           (exists1 s in set subsys.includes & (contains_portlink(s)))) 
    in

      contains_portlink(subsystem)) and

   (forall i, j in set inds simulationeventlist &
      (((i = j) and (simulationeventlist(i) = simulationeventlist(j)))or
       ((i < j) and (simulationeventlist(i).occurtime <= 
                     simulationeventlist(j).occurtime)) or
       ((i > j) and (simulationeventlist(i).occurtime >= 
                     simulationeventlist(j).occurtime)))) and

   (forall se1, se2 in set elems simulationeventlist &
      (((se1.occurtime = se2.occurtime) and 
        (se1.tromlabel <> se2.tromlabel)) or
       (se1.occurtime <> se2.occurtime))) and

   (let accepted_by_trom : SimulationEvent * Subsystem +> bool
        accepted_by_trom(se, subsys) ==
           (exists1 trom in set subsys.troms &
              ((trom.label = se.tromlabel) and
               (exists1 e in set trom.events &
                   ((e.label = se.eventlabel) and
                    (exists1 pt in set trom.porttypes &
                       ((pt = e.porttype) and
                        (exists1 p in set elems pt.portlist & 
                           (p.label = se.portlabel)))))))) in

    let accepted_by_subsystem : SimulationEvent * Subsystem +> bool
        accepted_by_subsystem(se, subsys) ==
           (exists1 s in set subsys.includes &
              ((((accepted_by_trom(se, s)) and 
                 (not accepted_by_subsystem(se, s))) or
                ((not accepted_by_trom(se, s)) and 
                 (accepted_by_subsystem(se, s)))) and
               (forall s2 in set {su | su : Subsystem & 
                  su in set subsys.includes and su <> s} &
                ((not accepted_by_trom(se, s2)) and 
                 (not accepted_by_subsystem(se, s2)))))) in

      (forall se in set elems simulationeventlist &
         (((accepted_by_trom(se, subsystem)) and 
          (not accepted_by_subsystem(se, subsystem))) or
          ((not accepted_by_trom(se, subsystem)) and 
           (accepted_by_subsystem(se, subsystem)))))) and

   (let exists_lsltrait : Subsystem +> bool
        exists_lsltrait(subsys) ==
           ((forall trom in set subsys.troms &
               (forall tr in set trom.lsltraits & 
                  (exists traitdef in set lsllibrary & 
                     (traitdef.label = tr.traitlabel)))) and

            (forall s in set subsys.includes & 
               (exists_lsltrait(s)))) in

       (exists_lsltrait(subsystem)))

init mk_System(subsys, simeventlist, lsllib, clock) ==

   simeventlist <> [] and clock = 0

end

                             

functions

   get_trom_object(tromlabel : String, subsystem : Subsystem) trom: [Trom]

   post

      ((trom in set subsystem.troms and trom.label = tromlabel) or

       (exists1 s in set subsystem.includes &

           (trom = get_trom_object(tromlabel, s))) or

       (trom = nil));


   get_transition_spec(trom : Trom, se : SimulationEvent) ts : [TransitionSpec]

   pre

      (trom.label = se.tromlabel)

   post

      (((ts in set trom.transitionspecs) and

        ((trom.currentstate.label = ts.sourcestate.label) or

         (substate_of(trom.currentstate, ts.sourcestate))) and

        (ts.triggerevent.label = se.eventlabel) and

        (ts.portcondition = true) and

        (ts.enabcondition = true)) or

       (ts = nil));


   substate_of : State * State +> bool
   substate_of(substate, complexstate) ==

      (substate in set complexstate.substates or

       (exists1 s in set complexstate.substates &

          (s.type = <COMPLEX> and substate_of(substate, s))))

   pre

      (complexstate.type = <COMPLEX>);


   get_entry_state(complexstate : State) entry : State

   pre

      (complexstate.type = <COMPLEX>)

   post

      (exists1 s in set complexstate.substates &

         ((s.isinitial = true) and

          ((s.type = <SIMPLE> and entry = s) or

           (s.type = <COMPLEX> and entry = get_entry_state(s)))));


   get_initial_state(trom : Trom) initial : State

   pre

      (trom.states <> { })

   post

      (exists1 s in set trom.states &

         ((s.isinitial = true) and

          ((s.type = <SIMPLE> and initial = s) or

           (s.type = <COMPLEX> and initial = get_entry_state(s)))));


   get_linked_tromport_tuple(tupleA : TromPortTuple, subsystem : Subsystem) 
                             tupleB : [TromPortTuple]

   post

      ((exists1 pl in set subsystem.portlinks &

          ((pl.tromporttuple1 = tupleA and pl.tromporttuple2 = tupleB) or

           (pl.tromporttuple2 = tupleA and pl.tromporttuple1 = tupleB))) or

       (exists1 s in set subsystem.includes &

          (tupleB = get_linked_tromport_tuple(tupleA, s))) or

       (tupleB = nil));


   exists_in_subsystem : Trom * Subsystem +> bool
   exists_in_subsystem(trom, subsys) ==

      (trom in set subsys.troms or

       (exists1 subsystem in set subsys.includes &

          (exists_in_subsystem(trom, subsystem))))

   pre

      ((subsys.troms <> { }) or (subsys.includes <> { }));


   get_unconstrained_internal_event(trom : Trom) event : [Event]

   post

      ((exists ts in set trom.transitionspecs &

         ((ts.sourcestate = trom.currentstate) and

          (ts.triggerevent.type = <INTERNAL>) and

          (not constrained_event(trom, ts.triggerevent)) and

          (event = ts.triggerevent))) or

       (event = nil));


   constrained_event : Trom * Event +> bool
   constrained_event(trom, event) ==

      (exists tc in set trom.timeconstraints &

         (tc.constrainedevent = event))

   pre

      (event in set trom.events);


   get_simevent_index(se : SimulationEvent, 
                      se_list : seq of SimulationEvent) index : nat1

   pre

      (se in set elems se_list)

   post

      (se_list(index) = se);


   get_random_time_within_rw(rw : ReactionWindow) time : nat

   post

      ((time >= rw.lowertimebound) and (time <= rw.uppertimebound));


   get_lru_port(portlist : seq of Port) port : Port

   pre

      (portlist <> [])

   post

      (port in set elems portlist)


operations

   simulator : () ==> ()
   simulator() ==
   (
      dcl i : nat1 := 1;

      initialize_simulation_clock();

      schedule_unconstrained_internal_events_from_initial_state();

      while (i <= len SIMULATIONEVENTLIST) do
      (
         while (CLOCK < SIMULATIONEVENTLIST(i).occurtime) do
         (
            update_simulation_clock()
         );

         while ((i <= len SIMULATIONEVENTLIST) and
                (CLOCK = SIMULATIONEVENTLIST(i).occurtime)) do
         (
            handle_event(SIMULATIONEVENTLIST(i));

            i := i + 1
         )
      )
   )

   pre

      ((SIMULATIONEVENTLIST <> []) and

       (forall se in set elems SIMULATIONEVENTLIST &

          ((se.occurtime >= CLOCK) and

           (se.eventhistory = nil))) and

       (forall trom in set {trom | trom : Trom & 
                                   exists_in_subsystem(trom, SUBSYSTEM)} &

             ((trom.currentstate = get_initial_state(trom)) and

              (forall tc in set trom.timeconstraints &

                 (tc.reactionwindows = { })))))

   post

      ((SIMULATIONEVENTLIST <> []) and

       (SIMULATIONEVENTLIST(len SIMULATIONEVENTLIST).occurtime = CLOCK) and

       (forall se in set elems SIMULATIONEVENTLIST &

          ((se.occurtime <= CLOCK) and

           (se.eventhistory <> nil))) and

       (forall trom in set {trom | trom : Trom 
                                 & exists_in_subsystem(trom, SUBSYSTEM)} &

             (forall tc in set trom.timeconstraints &

                (tc.reactionwindows = { }))));


   handle_event : SimulationEvent ==> ()
   handle_event(se) ==
   (
      dcl trom : [Trom],

          ts : [TransitionSpec];

      trom := get_trom_object(se.tromlabel, SUBSYSTEM);

      if trom = nil then return else skip;

      ts := get_transition_spec(trom, se);

      if ts = nil then
      (
         update_history_notransition(trom, se, ts)
      )
      else
      (
         update_history_assignment_vector(trom, se, ts);

         if ts.postcondition = false then
         (
            update_history_notransition(trom, se, ts)
         )
         else
         (
            update_history_transition(trom, se, ts);

            update_trom_current_state(trom, se, ts);

            handle_transition(trom, se, ts);

            schedule_unconstrained_internal_event(trom, se)
         )
      )
   )

   pre

      (se.occurtime = CLOCK)

   post

      (CLOCK = CLOCK~);


   handle_transition : Trom * SimulationEvent * TransitionSpec ==> ()
   handle_transition(trom, se, ts) ==
   (
      for all tc in set trom.timeconstraints do
      (
         if tc.constrainedevent.label = se.eventlabel then
         (
            for all rw in set tc.reactionwindows do
            (
               if se.occurtime >= rw.lowertimebound and
                  se.occurtime <= rw.uppertimebound then
               (
                  update_history_fire_reaction(trom, se, tc, rw);

                  fire_reaction(trom, se, tc, rw)
               )
            )
         );

         if trom.currentstate in set tc.disablingstates then
         (
            for all rw in set tc.reactionwindows do
            (
               update_history_disable_reaction(trom, se, tc, rw);

               disable_reaction(trom, se, tc, rw)
            )
         );

         if ts.label = tc.transition.label then
         (
            update_history_enable_reaction(trom, se, tc, ts);

            enable_reaction(trom, se, tc, ts)
         )
      )
   )

   pre

      (se.occurtime = CLOCK)

   post

      (CLOCK = CLOCK~);


   update_trom_current_state(trom : Trom, se : SimulationEvent, 
                             ts : TransitionSpec)

   pre

      (ts.postcondition = true)

   post

      (((ts.destinstate.type = <SIMPLE>) and
        (trom.currentstate = ts.destinstate)) or

       ((ts.destinstate.type = <COMPLEX>) and
        (trom.currentstate = get_entry_state(ts.destinstate))));


   update_history_assignment_vector(trom : Trom, se : SimulationEvent, 
                                    ts : [TransitionSpec])

   pre

      (ts <> nil)

   post

      (se.eventhistory.assignmentvector = trom.assignmentvector);


   update_history_notransition(trom : Trom, se : SimulationEvent, 
                               ts : [TransitionSpec])

   pre

      ((ts = nil) or (ts.postcondition = false))

   post

      ((se.eventhistory.triggeredtransition = false) and

       (se.eventhistory.tromcurrentstate = nil) and

       (se.eventhistory.assignmentvector = nil) and

       (se.eventhistory.reactionshistory = { }));


   update_history_transition(trom : Trom, se : SimulationEvent, 
                             ts : TransitionSpec)

   pre

      (ts.postcondition = true)

   post

      ((se.eventhistory.triggeredtransition = true) and

       (se.eventhistory.tromcurrentstate = trom.currentstate) and

       (se.eventhistory.assignmentvector = trom.assignmentvector) and

       (se.eventhistory.reactionshistory = { }));


   update_history_fire_reaction(trom : Trom, se : SimulationEvent, 
                                tc : TimeConstraint,
         rw : ReactionWindow)

   pre

      ((tc.constrainedevent.label = se.eventlabel) and

       (rw in set tc.reactionwindows) and

       (se.occurtime >= rw.lowertimebound) and

       (se.occurtime <= rw.uppertimebound))

   post

      (exists rh in set se.eventhistory.reactionshistory &

         ((rh.timeconstraint = tc) and

          (rh.reactionwindow = rw) and

          (rh.reaction = <FIRED>)));


   update_history_disable_reaction(trom : Trom, se : SimulationEvent, 
                                   tc : TimeConstraint,
         rw : ReactionWindow)

   pre

      ((trom.currentstate in set tc.disablingstates) and

       (rw in set tc.reactionwindows))

   post

      (exists rh in set se.eventhistory.reactionshistory &

         ((rh.timeconstraint = tc) and

          (rh.reactionwindow = rw) and

          (rh.reaction = <DISABLED>)));


   update_history_enable_reaction(trom : Trom, se : SimulationEvent, 
                                  tc : TimeConstraint,
        ts : TransitionSpec)

   ext rd CLOCK : nat

   pre

      (ts.label = tc.transition.label)

   post

      (let rw : ReactionWindow be st

         rw = mk_ReactionWindow(tc.timebounds.lowertimebound + CLOCK,
                                tc.timebounds.uppertimebound + CLOCK) in

         (exists rh in set se.eventhistory.reactionshistory &

            ((rh.timeconstraint = tc) and

             (rh.reactionwindow = rw) and

             (rh.reaction = <ENABLED>))));


   fire_reaction(trom : Trom, se : SimulationEvent, 
                 tc : TimeConstraint, rw : ReactionWindow)

   pre

      ((tc.constrainedevent.label = se.eventlabel) and

       (rw in set tc.reactionwindows) and

       (se.occurtime >= rw.lowertimebound) and

       (se.occurtime <= rw.uppertimebound))

   post

      (rw not in set tc.reactionwindows);


   disable_reaction(trom : Trom, se : SimulationEvent, 
                    tc : TimeConstraint, rw : ReactionWindow)

   ext rd SUBSYSTEM : Subsystem

       wr SIMULATIONEVENTLIST : seq of SimulationEvent

   pre

      ((trom.currentstate in set tc.disablingstates) and

       (rw in set tc.reactionwindows))

   post

      ((rw not in set tc.reactionwindows) and

       (let se2 : SimulationEvent be st

          se2 = get_enabled_simevent(trom, tc) in

          (((tc.constrainedevent.type = <INTERNAL>) and

            (SIMULATIONEVENTLIST =
                                   [s | s in seq SIMULATIONEVENTLIST~ &
                                          s <> se2])) or

           ((tc.constrainedevent.type = <OUTPUT>) and

            (let tromporttuple : [TromPortTuple] be st

               tromporttuple = get_linked_tromport_tuple
                             (mk_TromPortTuple(se2.tromlabel, se2.portlabel),
                                SUBSYSTEM) in

            (let se3 : SimulationEvent be st

               se3 = get_enabled_simevent_synch(tromporttuple, tc) in

               SIMULATIONEVENTLIST =
                                     [s | s in seq SIMULATIONEVENTLIST~ &
                                          s <> se2 and
                                          s <> se3]))))));


   enable_reaction(trom : Trom, se : SimulationEvent, 
                   tc : TimeConstraint, ts : TransitionSpec)

   ext rd CLOCK : nat

       rd SUBSYSTEM : Subsystem

       wr SIMULATIONEVENTLIST : seq of SimulationEvent

   pre

      (ts.label = tc.transition.label)

   post

      (let rw : ReactionWindow be st

         rw = mk_ReactionWindow(tc.timebounds.lowertimebound + CLOCK,
                                 tc.timebounds.uppertimebound + CLOCK) in

      (let port : Port be st

         port = get_lru_port(tc.constrainedevent.porttype.portlist) in

      (let occurtime : nat be st

         occurtime = get_random_time_within_rw(rw) in

      (let se2 : SimulationEvent be st

         se2 = mk_SimulationEvent
                         (tc.constrainedevent.label, trom.label, 
                          port.label, occurtime, nil) in

         ((rw in set tc.reactionwindows) and

          (se2 in set elems SIMULATIONEVENTLIST) and

          (((tc.constrainedevent.type = <OUTPUT>) and

            (let tromporttuple : [TromPortTuple] be st

               tromporttuple = get_linked_tromport_tuple
                           (mk_TromPortTuple(se2.tromlabel, 
                                             se2.portlabel), SUBSYSTEM) in

            (((tromporttuple <> nil) and

              (let se3 : SimulationEvent be st

               se3 = mk_SimulationEvent
                                 (se2.eventlabel, 
                                  tromporttuple.tromlabel,
                                  tromporttuple.portlabel, 
                                  se2.occurtime, nil) in

               (se3 in set elems SIMULATIONEVENTLIST))) or

             (tromporttuple = nil)))) or

           (tc.constrainedevent.type = <INTERNAL>)))))));


   pure get_enabled_simevent(trom : Trom, tc : TimeConstraint) 
                        se : SimulationEvent

   ext rd CLOCK : nat

       rd SIMULATIONEVENTLIST : seq of SimulationEvent

   pre

      (tc in set trom.timeconstraints)

   post

      ((se in set elems SIMULATIONEVENTLIST) and

       (se.eventlabel = tc.constrainedevent.label) and

       (se.tromlabel = trom.label) and

       (se.occurtime >= CLOCK) and

       (se.eventhistory = nil));


   pure get_enabled_simevent_synch(tromporttuple : TromPortTuple, 
                              tc : TimeConstraint) se : SimulationEvent

   ext rd CLOCK : nat

       rd SIMULATIONEVENTLIST : seq of SimulationEvent

   post

      ((se in set elems SIMULATIONEVENTLIST) and

       (se.eventlabel = tc.constrainedevent.label) and

       (se.tromlabel = tromporttuple.tromlabel) and

       (se.occurtime >= CLOCK) and

       (se.eventhistory = nil));


   schedule_unconstrained_internal_events_from_initial_state()

   ext rd CLOCK : nat

       rd SUBSYSTEM : Subsystem

       wr SIMULATIONEVENTLIST : seq of SimulationEvent

   pre

      CLOCK = 0

   post

      ((CLOCK = 0) and

       (forall trom in set {trom | trom : Trom 
                                 & exists_in_subsystem(trom, SUBSYSTEM)} &

         (let event : [Event] = get_unconstrained_internal_event(trom) in

            (((event <> nil) and

              (let se : SimulationEvent be st

                 se = mk_SimulationEvent
                     (event.label, trom.label, "NULLPORT", CLOCK, nil) in

                 ((se in set elems SIMULATIONEVENTLIST) and

                  (let i : nat1 be st

                     SIMULATIONEVENTLIST(i) = se in

                   (forall se2 in set elems SIMULATIONEVENTLIST~ &

                      (let j : nat1 be st

                         SIMULATIONEVENTLIST(j) = se2 in

                       i < j)))))) or

             (event = nil)))));


   schedule_unconstrained_internal_event(trom : Trom, se : SimulationEvent)

   ext rd CLOCK : nat

       wr SIMULATIONEVENTLIST : seq of SimulationEvent

   pre

      ((se in set elems SIMULATIONEVENTLIST) and (se.tromlabel = trom.label))

   post

      (let event : [Event] = get_unconstrained_internal_event(trom) in

         (((event <> nil) and

           (let j : nat1 be st

              j = get_simevent_index(se, SIMULATIONEVENTLIST) in

           (let se2 : SimulationEvent be st

              se2 = mk_SimulationEvent
                     (event.label, trom.label, "NULLPORT", CLOCK, nil) in

              (SIMULATIONEVENTLIST =

                 [SIMULATIONEVENTLIST~(i) 
                 | i in set inds SIMULATIONEVENTLIST~ & i <= j] ^
            [se2] ^
                    [SIMULATIONEVENTLIST~(i) 
                    | i in set inds SIMULATIONEVENTLIST~ & i > j])))) or

          (event = nil)));


   initialize_simulation_clock()

   ext wr CLOCK : nat

   post

      CLOCK = 0;


   update_simulation_clock()

   ext wr CLOCK : nat

   post

      CLOCK = CLOCK~ + 1


end TROM

                             
~~~
{% endraw %}

