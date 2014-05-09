---
layout: default
title: Tracker
---

~~~
The tracker example is used in the mapping chapter of the VDM-SLbook by John Fitzgerald and Peter Gorm Larsen to introduce mappings and mapping operators concerns a system for tracking the movement of containers of hazardous material between phases of processing in a nuclear reprocessing plant. It is inspired by the formal model of a plant controller architecture developed by Manchester Informatics Ltd. in collaboration with British Nuclear Fuels (Engineering) Ltd. (BNFL) in 1995. More can be read about this in:
J.S. Fitzgerald and C.B. Jones, Proof in VDM: Case Studies, Chapter: Proof in the Validation of a Formal Model of a Tracking System for a Nuclear Plant, Springer-Verlag,FACIT Series, 1998.#******************************************************#  AUTOMATED TEST SETTINGS#------------------------------------------------------#LANGUAGE_VERSION=classic#AUTHOR= John Fitzgerald and Peter Gorm Larsen#INV_CHECKS=true#POST_CHECKS=true#PRE_CHECKS=true#DYNAMIC_TYPE_CHECKS=true#SUPPRESS_WARNINGS=false#ENTRY_POINT=DEFAULT`Permission(tracker_inital,cid1,mk_token("Unpacking"))#EXPECTED_RESULT=NO_ERROR_TYPE_CHECK#******************************************************
~~~
###testtracker.vdmsl

{% raw %}
~~~
values
glass = mk_token("Glass");
liquid = mk_token("liquid");
metal = mk_token("metal");
plastic = mk_token("plastic");
all_material = {glass,liquid,metal,plastic};
unpacking_inital = mk_Phase({},all_material,5);
sorting_inital = mk_Phase({},all_material,6);
assay_inital = mk_Phase({},all_material,5);
compaction_inital = mk_Phase({},{glass,metal,plastic},3);
storage_inital = mk_Phase({},{glass,metal,plastic},50);
coninfo_inital = {|->};
cid1 : ContainerId = mk_token(42);
phases_inital = {mk_token("Unpacking") |-> unpacking_inital,                 mk_token("Sorting")   |-> sorting_inital,                 mk_token("Assay")     |-> assay_inital,                 mk_token("Compaction")|-> compaction_inital,                 mk_token("Storage")   |-> storage_inital};
tracker_inital = mk_Tracker(coninfo_inital,phases_inital)
functions
SetUp: () -> TrackerSetUp() ==  tracker_inital

~~~{% endraw %}

###tracker.vdmsl

{% raw %}
~~~
types
Tracker :: containers : ContainerInfo           phases     : PhaseInfo  inv mk_Tracker(containers,phases) ==    Consistent(containers,phases) and    PhasesDistinguished(phases) and    MaterialSafe(containers,phases);
ContainerInfo = map ContainerId to Container;
PhaseInfo = map PhaseId to Phase;
Container :: fiss_mass : real             material  : Material;
Phase :: contents          : set of ContainerId         expected_materials: set of Material	 capacity          : natinv p == card p.contents <= p.capacity and         p.expected_materials <> {};
ContainerId = token;
PhaseId = token;
Material = token
functions

-- introduce a new container to the plant (map union)
  Introduce : Tracker * ContainerId * real * Material -> Tracker  Introduce(trk, cid, quan, mat) ==      mk_Tracker(trk.containers munion                 {cid |-> mk_Container(quan, mat)},                trk.phases)  pre cid not in set dom trk.containers;
-- permission to move (simple Boolean function)
Permission: Tracker * ContainerId * PhaseId  ->  boolPermission(mk_Tracker(containers, phases), cid, dest) ==     cid in set dom containers and    dest in set dom phases and     card phases(dest).contents < phases(dest).capacity and    containers(cid).material in set phases(dest).expected_materials;
-- Remove a container from the contents of a phase
Remove: Tracker * ContainerId * PhaseId -> TrackerRemove(mk_Tracker(containers, phases), cid, source) ==  let pha = mk_Phase(phases(source).contents \ {cid},                     phases(source).expected_materials,                     phases(source).capacity)  in    mk_Tracker(containers, phases ++ {source |-> pha})pre source in set dom phases and     cid in set phases(source).contents;
-- move a known container between two phases
Move: Tracker * ContainerId * PhaseId * PhaseId -> TrackerMove(trk, cid, ptoid, pfromid) ==  let cont = trk.phases(ptoid)  in   let pha = mk_Phase(cont.contents union {cid},                      cont.expected_materials,                      cont.capacity)   in     mk_Tracker(trk.containers,                Remove(trk,cid,pfromid).phases ++                 {ptoid |-> pha})pre Permission(trk, cid, ptoid) and     pre_Remove(trk,cid,pfromid);
-- delete a container from the plant
Delete: Tracker * ContainerId * PhaseId  ->  TrackerDelete(tkr, cid, source) ==   mk_Tracker({cid} <-: tkr.containers,              Remove(tkr, cid, source).phases)pre pre_Remove(tkr,cid,source);
-- Auxiliary functions defined for inv-Tracker  Consistent: ContainerInfo * PhaseInfo -> bool  Consistent(containers, phases) ==     forall ph in set rng phases &         ph.contents subset dom containers;
  PhasesDistinguished: PhaseInfo -> bool  PhasesDistinguished(phases) ==     not exists p1, p2 in set dom phases &        p1 <> p2 and         phases(p1).contents inter phases(p2).contents <> {};
  MaterialSafe: ContainerInfo * PhaseInfo -> bool  MaterialSafe(containers, phases) ==                     forall ph in set rng phases &         forall cid in set ph.contents &	   cid in set dom containers and           containers(cid).material in set ph.expected_materials

~~~{% endraw %}

