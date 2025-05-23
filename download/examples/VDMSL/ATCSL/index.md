---
layout: default
title: ATCSL
---

## ATCSL
Author: Natsuki Terada



This example was developed by Natsuki Terada from the Japanese Railways 
Research Institute (RTRI) on a two year visit to IFAD in 2000 and 2001. 
It models a database for digital Automatic Train Control in Japan. More 
information can be found in:

Natsuki Terada, Formal Integrity Analysis of Digital ATC Database,
In Proceedings of WCRR2001 (World Congress on Railway Research), 2001.
 
Natsuki Terada, Integrity Analysis of Digital ATC Database with 
Automatic Proofs, In VDM Workshop 3, Part of the FME 2002 conference,
Copenhagen, Denmark, July 2002.
 
Natsuki Terada, Application of Formal Methods to Automatic Train Control 
Systems, In Proceedings of Symposium on Formal Methods for Railway 
Operation and Control Systems (FORMS 2003), 2003.
 
N. Terada and M. Fukuda, Application of Formal Methods to the Railway 
Signaling Systems, In Quarterly Report of RTRI, 2002, Vol 43, no 4, 
pp 169-174.
 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### digitalATCdb.vdmsl

{% raw %}
~~~
--
-- Model of Digital ATC Database(1 & 2 /3) -- Track Circuits and Routes
--
-- ver 1.   2000.4.11 by n. terada
-- ver 2.   2000.6.14 by n. terada
-- ver 2.3  2000.6.26 by n. terada
-- ver 3    2000.8.16 by n. terada
-- ver 4    2000.9.13 by n. terada
-- ver 4.5  2000.9.15 by n. terada
-- ver 4.6  2000.10.11 by n. terada
-- ver 4.61 2001.2.5 by n.terada
-- track circuits -- basic unit
--
types
TrackC::	joints : map Joint_id to Joint
		atc : map Direction to ATC
		td : TD
		atbt : ATBT
inv tc == card dom tc.joints > 1 and
        dom tc.atc = {<ADIR>, <BDIR>} and
	TD_Used_for_NonInsulated_TrackC(tc.td, tc.atbt, rng tc.joints) and
	(tc.atc(<ADIR>).used and tc.atc(<BDIR>).used => 
                tc.atc(<ADIR>).carrier <> tc.atc(<BDIR>).carrier);


--
-- joint -- connection between two track circuits
--

Joint_id = token;

Joint::	position : nat
	insulated : Insulation
	remark : Remark;


Insulation = bool; -- true if joint is insulated
Remark :: atc_terminal : map Direction to bool  -- true if atc is terminated
	  line_terminal : bool -- true if line terminated
inv rm == dom rm.atc_terminal = {<ADIR>, <BDIR>};

Direction = <ADIR> | <BDIR>;
--
-- carrier of track circuits
-- atc signal , td(train detection signal) 
--
ATC :: used : bool -- true if Digital ATC is used
       carrier : token;

TD :: used : bool  -- true if TD is used
      carrier : token;

ATBT = <AT> | <BT> | <NULL>;

functions
TD_Used_for_NonInsulated_TrackC : TD * ATBT * set of Joint -> bool
TD_Used_for_NonInsulated_TrackC(td, atbt, joints) ==
	(atbt = <NULL> <=> not td.used) and
	((exists j in set joints & not j.insulated) => td.used);

--
-- Collection of Track Circuits
--
types
TrackC_id = token;
TrackC_map = map TrackC_id to TrackC
inv tcs == forall tid in set dom tcs &
	        forall jid in set dom tcs(tid).joints &
			Only_One_Next_TrackC(tcs, tid, jid) and
                        forall tid2 in set dom tcs & tid <> tid2 =>
		        	Joint_and_Next_TrackC(tcs(tid), tcs(tid2), jid)
;

functions
Only_One_Next_TrackC: map TrackC_id to TrackC * TrackC_id * Joint_id -> bool
Only_One_Next_TrackC(tcs, tcid, jid) ==
	card {tid | tid in set dom tcs & 
                tid <> tcid and jid in set dom tcs(tid).joints} < 2;

Joint_and_Next_TrackC: TrackC * TrackC * Joint_id -> bool
Joint_and_Next_TrackC(tc1, tc2, jid) ==
	(jid in set dom tc1.joints and jid in set dom tc2.joints) =>
        (tc1.joints(jid) = tc2.joints(jid) and
         not tc1.joints(jid).remark.line_terminal and
         Is_wf_adjacent_signal(tc1, jid, tc2, jid, false));


-- 
-- condition related with signal
--
Is_wf_adjacent_signal: TrackC * Joint_id * TrackC * Joint_id * bool -> bool
Is_wf_adjacent_signal(tc1, jid1, tc2, jid2, dir_chng) ==
        jid1 in set dom tc1.joints and
        jid2 in set dom tc2.joints and
        Remark_Compatible(tc1.joints(jid1).remark, tc2.joints(jid2).remark,
                dir_chng) and
	ATC_Terminal_and_ATC_Used(tc1.atc(<ADIR>), tc2.atc(<BDIR>),
         tc1.joints(jid1).remark, tc2.atc(<ADIR>), tc2.atc(<BDIR>),
         tc2.joints(jid2).remark, dir_chng) and
	Adjacent_TD_Carrier_Differ(tc1.td, tc1.atbt, tc2.td, tc2.atbt,
                tc1.joints(jid1).insulated and tc2.joints(jid2).insulated);

Remark_Compatible : Remark * Remark * bool-> bool
Remark_Compatible(rm1, rm2, dir_chng) ==
        (not dir_chng => rm1.atc_terminal = rm2.atc_terminal) and
        (dir_chng =>
        (rm1.atc_terminal(<ADIR>) = rm2.atc_terminal(<BDIR>) and
         rm1.atc_terminal(<BDIR>) = rm2.atc_terminal(<ADIR>)));

ATC_Terminal_and_ATC_Used : ATC * ATC * Remark * ATC * ATC * Remark * bool
        -> bool
ATC_Terminal_and_ATC_Used(atcA1, atcB1, rm1, atcA2, atcB2, rm2, dir_chng) ==
        (not dir_chng =>
	(((atcA1.used <> atcA2.used) = rm1.atc_terminal(<ADIR>)) and
         ((atcB1.used <> atcB2.used) = rm1.atc_terminal(<BDIR>)))) and
        (dir_chng =>
	(((atcA1.used <> atcB2.used) = rm1.atc_terminal(<ADIR>)) and
         ((atcB1.used <> atcA2.used) = rm1.atc_terminal(<BDIR>))))

pre     Remark_Compatible(rm1, rm2, dir_chng);


Adjacent_TD_Carrier_Differ : TD * ATBT * TD * ATBT * Insulation -> bool
Adjacent_TD_Carrier_Differ(td1, atbt1, td2, atbt2, insulated) ==
	(insulated or
		td1.carrier <> td2.carrier and 
		(atbt1 <> atbt2 or atbt1 = <AT> and atbt2 = <AT>));
--
-- end of track circuit
--

--
-- paths in track circuits
--
types
Path::	tc : TrackC_id
	start : Joint_id
	endp : Joint_id
	length : nat
        used : map Direction to bool
        condition : set of Condition
inv p == p.start <> p.endp and
         dom p.used = {<ADIR>, <BDIR>} and
         (exists dr in set dom p.used & p.used(dr)) and
        (forall c1, c2 in set p.condition & Condition_not_Conflict(c1, c2));
-- start.position < endp.position is added at inv_Area

Condition ::    kind : Cond_Kind
                start : nat
                endp : nat
                speed : nat     -- only used for <LIMIT>
                permill : nat   -- should be integer or real
inv con == con.start < con.endp;

Cond_Kind = <LIMIT> | <GRADIENT> | <SECTION>;

functions
Condition_not_Conflict : Condition * Condition -> bool
Condition_not_Conflict(c1, c2) ==
        (c1 <> c2 and c1.kind = c2.kind and c1.kind <> <LIMIT>) =>
                 not Overlap(c1, c2);

Overlap : Condition * Condition -> bool
Overlap(c1, c2) ==
        (c1.start < c2.start and c2.start < c1.endp) or
        (c2.start < c1.start and c1.start < c2.endp) or
        (c1.start = c2.start)
;


types
Path_id = token;


Path_map = map Path_id to Path
inv ps == forall pid1, pid2 in set dom ps & pid1 <> pid2 => 
                (Not_Same_Path(ps(pid1), ps(pid2)) and
                 Not_Start_and_End(ps(pid1), ps(pid2)));

functions
Not_Same_Path : Path * Path -> bool
Not_Same_Path(p1, p2) ==
	not (p1.start = p2.start and p1.endp = p2.endp) and
        not (p1.start = p2.endp and p1.endp = p2.start);
-- It is possible to allow the case p1.tc <> p2.tc
-- but that is not practical, so it is not allowed here.


Not_Start_and_End : Path * Path -> bool
Not_Start_and_End(p1, p2) ==
        (p1.tc = p2.tc) =>
        (not p1.start = p2.endp and not p2.start = p1.endp);

--
-- route
--
types
Route::	dr : Direction
	paths : seq1 of Path_id;

Route_map = map Route_id to Route
;

Route_id = token;

--
-- Area -- corresponds to stations or intermediate part.
--

Area ::	trackcs : TrackC_map
	paths : Path_map
	routes : Route_map
        kind : Area_Kind
        max : MaxSpeed

inv mk_Area(trackcs, paths, routes, -, -) ==
	(forall p in set rng paths &
		Path_within_TrackC(trackcs, p) and
		Direction_Correct(trackcs, p)) and
	(forall r in set rng routes &
		Path_Exists(paths, r.paths, r.dr) and
		Exists_ATC_for_Route(trackcs, paths, r) and
		Route_not_Circular(paths, r) and
		Path_Connected(paths, r.paths, r.dr))
;

Area_Kind = <PLAIN> | <COMPLEX>;
MaxSpeed = token;

functions
Path_within_TrackC : TrackC_map * Path -> bool
Path_within_TrackC(trackcs, p) ==
	p.tc in set dom trackcs and
	p.start in set dom trackcs(p.tc).joints and
	p.endp in set dom trackcs(p.tc).joints
;
        


Direction_Correct : TrackC_map * Path -> bool
Direction_Correct(trackcs, p) ==
	let pstart = trackcs(p.tc).joints(p.start).position,
	    pend = trackcs(p.tc).joints(p.endp).position in
                pstart < pend and
                p.length = pend - pstart and
                forall c in set p.condition &
                        pstart <= c.start and c.endp <= pend
pre Path_within_TrackC(trackcs, p);

Path_Exists : Path_map * seq of Path_id * Direction -> bool
Path_Exists(paths, route, dr) ==
	forall pid in seq route & 
                pid in set dom paths and
                paths(pid).used(dr)
;

-- next function is related with signal
Exists_ATC_for_Route : TrackC_map * Path_map * Route -> bool
Exists_ATC_for_Route(trackcs, paths, r) ==
	forall pid in seq r.paths &
		paths(pid).tc in set dom trackcs and
		trackcs(paths(pid).tc).atc(r.dr).used
pre	Path_Exists(paths, r.paths, r.dr);

Route_not_Circular : Path_map * Route-> bool
Route_not_Circular(paths, r) ==
	forall i, j in set inds r.paths &
		i <> j => paths(r.paths(i)).tc <> paths(r.paths(j)).tc
pre	Path_Exists(paths, r.paths, r.dr);

Path_Connected : Path_map * seq of Path_id * Direction-> bool
Path_Connected(paths, route, dr) ==
	forall i in set inds route &
		(i + 1) in set inds route =>
                ((dr = <ADIR> =>
                        paths(route(i)).endp = paths(route(i+1)).start) and
                 (dr = <BDIR> =>
                        paths(route(i)).start = paths(route(i+1)).endp))

pre	Path_Exists(paths, route, dr);

--
-- end of invariant
--

--
-- Operation of Data Base (Area Level)
--
Add_TrackC : Area * TrackC_id * TrackC -> Area
Add_TrackC(ar, tcid, tc) ==
mu(ar, trackcs |-> ar.trackcs ++ {tcid |-> tc})
pre	tcid not in set dom ar.trackcs and
	forall jid in set dom tc.joints &
		Only_One_Next_TrackC(ar.trackcs, tcid, jid) and
                forall tcid1 in set dom ar.trackcs &
		Joint_and_Next_TrackC(tc, ar.trackcs(tcid1), jid)
post	tcid in set dom RESULT.trackcs and
        RESULT.trackcs = ar.trackcs ++ {tcid |-> tc} and
	RESULT.trackcs(tcid) = tc and
        RESULT.paths = ar.paths and
        RESULT.routes = ar.routes;

Del_TrackC : Area * TrackC_id -> Area
Del_TrackC(ar, tcid) ==
mu(ar, trackcs |-> {tcid} <-: ar.trackcs)
pre	tcid in set dom ar.trackcs and
	forall p in set rng ar.paths & p.tc <> tcid
post	tcid not in set dom RESULT.trackcs and
        RESULT.trackcs = {tcid} <-: ar.trackcs and
        RESULT.paths = ar.paths and
        RESULT.routes = ar.routes;


Add_Joint : Area * TrackC_id * Joint_id * Joint -> Area
Add_Joint(ar, tid, jid, joint) ==
	let tc = ar.trackcs(tid) in
	mu(ar, trackcs |-> ar.trackcs ++ {tid |->
		mu(tc, joints |-> tc.joints ++ {jid |-> joint})})
pre	tid in set dom ar.trackcs and
	let tc = ar.trackcs(tid) in
		jid not in set dom tc.joints and
		TD_Used_for_NonInsulated_TrackC(tc.td, tc.atbt, 
				rng tc.joints union {joint}) and
		Only_One_Next_TrackC(ar.trackcs, tid, jid) and
                forall tid1 in set dom ar.trackcs & tid1 <> tid =>
		Joint_and_Next_TrackC(ar.trackcs(tid1),
			mu(tc,joints |-> tc.joints ++ {jid |-> joint}), jid)
post	tid in set dom RESULT.trackcs and
	jid in set dom RESULT.trackcs(tid).joints and
        dom RESULT.trackcs = dom ar.trackcs and
        {tid} <-: RESULT.trackcs = {tid} <-: ar.trackcs and
        RESULT.trackcs(tid) = mu(ar.trackcs(tid), 
                joints |-> ar.trackcs(tid).joints ++ {jid |-> joint}) and
	RESULT.trackcs(tid).joints(jid) = joint and
	RESULT.trackcs(tid).atc = ar.trackcs(tid).atc and
        RESULT.trackcs(tid).td = ar.trackcs(tid).td and
        RESULT.trackcs(tid).atbt = ar.trackcs(tid).atbt and
        RESULT.paths = ar.paths and
        RESULT.routes = ar.routes
;

Del_Joint : Area * TrackC_id * Joint_id -> Area
Del_Joint(ar, tcid, jid) ==
	let tc = ar.trackcs(tcid) in
	mu(ar, trackcs |-> ar.trackcs ++
		{tcid |-> mu(tc, joints |-> {jid} <-: tc.joints)})
pre	tcid in set dom ar.trackcs and
	jid in set dom ar.trackcs(tcid).joints and
	card dom ar.trackcs(tcid).joints > 2 and
	(forall path in set rng ar.paths &
		path.tc <> tcid or
		jid <> path.start and jid <> path.endp)
post    tcid in set dom RESULT.trackcs and
        dom RESULT.trackcs = dom ar.trackcs and
        {tcid} <-: RESULT.trackcs = {tcid} <-: ar.trackcs and
        jid not in set dom RESULT.trackcs(tcid).joints and
        RESULT.trackcs(tcid) = mu(ar.trackcs(tcid), 
                joints |-> {jid} <-: ar.trackcs(tcid).joints) and
	RESULT.trackcs(tcid).atc = ar.trackcs(tcid).atc and
        RESULT.trackcs(tcid).td = ar.trackcs(tcid).td and
        RESULT.trackcs(tcid).atbt = ar.trackcs(tcid).atbt and
        RESULT.trackcs(tcid).joints = {jid} <-: ar.trackcs(tcid).joints and
        RESULT.paths = ar.paths and
        RESULT.routes = ar.routes
;

Add_Path : Area * Path_id * Path -> Area
Add_Path(ar, pid, path) ==
	mu(ar, paths |-> ar.paths ++ {pid |-> path})
pre	pid not in set dom ar.paths and
	Path_within_TrackC(ar.trackcs, path) and
	Direction_Correct(ar.trackcs, path) and
	forall p in set rng ar.paths & 
                Not_Same_Path(p, path) and Not_Start_and_End(p, path)
post	pid in set dom RESULT.paths and
        RESULT.paths = ar.paths ++ {pid |-> path} and
	RESULT.paths(pid) = path and
        RESULT.trackcs = ar.trackcs and
        RESULT.routes = ar.routes;


Del_Path : Area * Path_id -> Area
Del_Path(ar, pid) ==
	mu(ar, paths |-> {pid} <-: ar.paths)
pre	pid in set dom ar.paths and
	forall r in set rng ar.routes &	pid not in set elems r.paths
post	pid not in set dom RESULT.paths and
        RESULT.paths = {pid} <-: ar.paths and
        RESULT.trackcs = ar.trackcs and
        RESULT.routes = ar.routes;

Add_Route : Area * Route_id * Route -> Area
Add_Route (ar, rid, r) ==
mu(ar, routes |-> ar.routes ++ {rid |-> r})
pre	rid not in set dom ar.routes and
	Path_Exists(ar.paths, r.paths, r.dr) and
        Exists_ATC_for_Route(ar.trackcs, ar.paths, r) and
	Route_not_Circular(ar.paths, r) and
	Path_Connected(ar.paths, r.paths, r.dr)
post	rid in set dom RESULT.routes and
        RESULT.routes = ar.routes ++ {rid |-> r} and
	RESULT.routes(rid) = r and
        RESULT.trackcs = ar.trackcs and
        RESULT.paths = ar.paths;

Del_Route : Area * Route_id -> Area
Del_Route(ar, rid) ==
mu(ar, routes |-> {rid} <-: ar.routes)
pre	rid in set dom ar.routes
post	rid not in set dom RESULT.routes and
        RESULT.routes = {rid} <-: ar.routes and
        RESULT.trackcs = ar.trackcs and
        RESULT.paths = ar.paths;

Add_Condition : Area * Path_id * Condition -> Area
Add_Condition(ar, pid, con) ==
        let p = mu(ar.paths(pid), 
                condition |-> ar.paths(pid).condition union {con}) in
        mu(ar, paths |-> ar.paths ++ {pid |-> p})
pre     pid in set dom ar.paths and
        let p = ar.paths(pid) in
                ar.trackcs(p.tc).joints(p.start).position <= con.start and 
                con.endp <= ar.trackcs(p.tc).joints(p.endp).position and
                (forall c in set p.condition & Condition_not_Conflict(c, con))

post    pid in set dom RESULT.paths and
        dom RESULT.paths = dom ar.paths and
        {pid} <-: RESULT.paths = {pid} <-: ar.paths and
        RESULT.paths(pid) = mu(ar.paths(pid), 
                  condition |-> ar.paths(pid).condition union {con}) and
        RESULT.paths(pid).start = ar.paths(pid).start and
        RESULT.paths(pid).endp = ar.paths(pid).endp and
        RESULT.paths(pid).tc = ar.paths(pid).tc and
        RESULT.paths(pid).length = ar.paths(pid).length and
        RESULT.paths(pid).condition = ar.paths(pid).condition union {con} and
        RESULT.trackcs = ar.trackcs and
        RESULT.routes = ar.routes
;

Del_Condition : Area * Path_id * Cond_Kind * nat * nat -> Area
Del_Condition(ar, pid, kind, start, endp) ==
        let p = mu(ar.paths(pid), condition |-> 
                {l | l in set ar.paths(pid).condition & 
                 not (l.kind = kind and l.start = start and l.endp = endp)}) in
        mu(ar, paths |-> ar.paths ++ {pid |-> p})
pre     pid in set dom ar.paths and
        (exists c in set ar.paths(pid).condition &
                c.kind = kind and c.start = start and c.endp = endp)
post    pid in set dom RESULT.paths and
        dom RESULT.paths = dom ar.paths and
        {pid} <-: RESULT.paths = {pid} <-: ar.paths and
        RESULT.paths(pid) = mu(ar.paths(pid), condition |->
               {l | l in set ar.paths(pid).condition & 
               not (l.kind = kind and l.start = start and l.endp = endp)}) and
        RESULT.paths(pid).start = ar.paths(pid).start and
        RESULT.paths(pid).endp = ar.paths(pid).endp and
        RESULT.paths(pid).tc = ar.paths(pid).tc and
        RESULT.paths(pid).length = ar.paths(pid).length and
        RESULT.trackcs = ar.trackcs and
        RESULT.routes = ar.routes
;

--
-- end of Operation (Area level)
--


types
--
-- Line -- collection of Areas
--
--

Line :: areas : Area_map
	connect : Connect_map
--      ver : Version                --
--      edit_date : Date             -- These 4 fields are
--      valid_date : Date            -- to be used version control system.
--      locked : bool                --
inv mk_Line(areas, connect) == 
    forall c in set dom connect & 
        (forall n in set c & Area_Joint_Exists(areas, n)) and

        (forall n1, n2 in set c & n1 <> n2 =>
                Direction_for_Area_Joint(areas(n1.aid).paths, n1.no, 
                    areas(n2.aid).paths, n2.no, connect(c).chng_direction) and
               	let tc1 = areas(n1.aid).trackcs(n1.tcid),
                    tc2 = areas(n2.aid).trackcs(n2.tcid) in
                    Joint_Compatible(tc1.joints(n1.no), tc2.joints(n2.no),
				connect(c)) and
                    Is_wf_adjacent_signal(tc1, n1.no, tc2, n2.no,
				connect(c).chng_direction));

Area_map = map Area_id to Area;
Area_id = token;

-- (Plan)
-- Area_id :: lid : nat
--            aid : nat


--
-- connection between two areas
--
Area_Joint ::	aid : Area_id
		tcid : TrackC_id
		no : Joint_id;

Connect = set of Area_Joint
inv con == card con = 2 and
        forall a1, a2 in set con & a1 <> a2 => a1.aid <> a2.aid;


Connect_map = map Connect to Remark_Connect
inv con == forall a1, a2 in set dom con & a1 <> a2 => a1 inter a2 = {};


Remark_Connect :: chng_direction : bool
		  chng_distance : bool;

functions
Area_Joint_Exists : Area_map * Area_Joint -> bool
Area_Joint_Exists(areas, n) ==
	n.aid in set dom areas and
        n.tcid in set dom areas(n.aid).trackcs and
        n.no in set dom areas(n.aid).trackcs(n.tcid).joints and
        not areas(n.aid).trackcs(n.tcid).joints(n.no).remark.line_terminal and
        forall tcid in set dom areas(n.aid).trackcs & n.tcid <> tcid =>
                n.no not in set dom areas(n.aid).trackcs(tcid).joints;


Direction_for_Area_Joint : Path_map * Joint_id * Path_map * Joint_id * bool 
        -> bool
Direction_for_Area_Joint(pm1, n1, pm2, n2, chng_dir) ==
        forall p1 in set rng pm1, p2 in set rng pm2 &
        ((p1.start = n1 and p2.start = n2) => chng_dir) and
        ((p1.endp  = n1 and p2.endp  = n2) => chng_dir) and
        ((p1.start = n1 and p2.endp  = n2) => not chng_dir) and
        ((p1.endp  = n1 and p2.start = n2) => not chng_dir)
;


Joint_Compatible: Joint * Joint * Remark_Connect -> bool
Joint_Compatible(j1, j2, rm) ==
	j1.insulated = j2.insulated and
        ((j1.position <> j2.position) = rm.chng_distance) and
        Remark_Compatible(j1.remark, j2.remark, rm.chng_direction);

Add_Area : Line * Area_id * Area_Kind * MaxSpeed -> Line
Add_Area(ln, aid, kind, max) ==
mu(ln, areas |-> ln.areas ++ {aid |-> mk_Area({|->}, {|->}, {|->}, kind, max)})
pre	aid not in set dom ln.areas
post	aid in set dom RESULT.areas and
        RESULT.connect = ln.connect;

Change_Area : Line * Area_id * Area -> Line
Change_Area(ln, aid, area) ==
mu(ln, areas |-> ln.areas ++ {aid |-> area})
pre	aid in set dom ln.areas and
	inv_Line(mk_Line(ln.areas ++ {aid |-> area}, ln.connect))
post	RESULT.areas(aid) = area and
        RESULT.connect = ln.connect;


Del_Area : Line * Area_id -> Line
Del_Area(ln, aid) ==
mu(ln, areas |-> {aid} <-: ln.areas)
pre	aid in set dom ln.areas and
	(forall c in set dom ln.connect & 
                forall aj in set c & aj.aid <> aid)
post	aid not in set dom RESULT.areas and
        RESULT.connect = ln.connect;


Add_Connect : Line * Connect * Remark_Connect -> Line
Add_Connect(ln, con, r) ==
mu(ln, connect |-> ln.connect ++ {con |-> r})
pre	(forall c in set dom ln.connect & c inter con = {}) and
        (forall n in set con & Area_Joint_Exists(ln.areas, n)) and
                        
        (forall n1, n2 in set con & n1 <> n2 =>
                Direction_for_Area_Joint(ln.areas(n1.aid).paths, n1.no, 
                        ln.areas(n2.aid).paths, n2.no, r.chng_direction) and
        	let tc1 = ln.areas(n1.aid).trackcs(n1.tcid),
	            tc2 = ln.areas(n2.aid).trackcs(n2.tcid) in
        	Joint_Compatible(tc1.joints(n1.no), tc2.joints(n2.no), r) and
        	Is_wf_adjacent_signal(tc1,n1.no, tc2, n2.no, r.chng_direction))

post	con in set dom RESULT.connect and
        RESULT.connect = ln.connect ++ {con |-> r} and
	RESULT.connect(con) = r and
        RESULT.areas = ln.areas
;

Del_Connect : Line * Area_Joint -> Line
Del_Connect(ln, n) ==
mu(ln, connect |-> 
        {c |-> ln.connect(c) | c in set dom ln.connect & n not in set c})
pre	exists c in set dom ln.connect & n in set c
post	forall c in set dom RESULT.connect & n not in set c and
        RESULT.areas = ln.areas;
functions

Line_Add_TrackC : Line * Area_id * TrackC_id * TrackC -> Line
Line_Add_TrackC(ln, aid, tcid, tc) ==
       mu(ln, areas |-> ln.areas ++ 
                {aid |-> Add_TrackC(ln.areas(aid), tcid, tc)})
pre     aid in set dom ln.areas and
        pre_Add_TrackC(ln.areas(aid), tcid, tc) and
        (forall jid in set dom tc.joints &
         forall c in set dom ln.connect &
                forall n in set c &
                        n.aid = aid => n.no <> jid)
post    aid in set dom RESULT.areas and
        dom ln.areas = dom RESULT.areas and
        {aid} <-: RESULT.areas = {aid} <-: ln.areas and
        tcid in set dom RESULT.areas(aid).trackcs and
        RESULT.areas(aid).trackcs = 
                ln.areas(aid).trackcs ++ {tcid |-> tc} and
        RESULT.areas(aid).trackcs(tcid) = tc and
        RESULT.connect = ln.connect;

Line_Del_TrackC : Line * Area_id * TrackC_id -> Line
Line_Del_TrackC(ln, aid, tcid) ==
        mu(ln, areas |-> ln.areas ++
                {aid |-> Del_TrackC(ln.areas(aid), tcid)})
pre     aid in set dom ln.areas and
        pre_Del_TrackC(ln.areas(aid), tcid) and
        forall c in set dom ln.connect & forall aj in set c &
                        aj.aid = aid => aj.tcid <> tcid
post    aid in set dom RESULT.areas and
        dom ln.areas = dom RESULT.areas and
        {aid} <-: RESULT.areas = {aid} <-: ln.areas and
        RESULT.areas(aid).trackcs = {tcid} <-: ln.areas(aid).trackcs and
        tcid not in set dom RESULT.areas(aid).trackcs and
        RESULT.connect = ln.connect;

Line_Add_Joint : Line * Area_id * TrackC_id * Joint_id * Joint -> Line
Line_Add_Joint(ln, aid, tcid, jid, j) ==
        mu(ln, areas |-> ln.areas ++
                {aid |-> Add_Joint(ln.areas(aid), tcid, jid, j)})
pre     aid in set dom ln.areas and
        pre_Add_Joint(ln.areas(aid), tcid, jid, j) and
        (forall c in set dom ln.connect & forall n in set c &
                n.aid = aid => n.no <> jid)
post    aid in set dom RESULT.areas and
        tcid in set dom RESULT.areas(aid).trackcs and
        jid in set dom RESULT.areas(aid).trackcs(tcid).joints and
        dom RESULT.areas = dom ln.areas and
        {aid} <-: RESULT.areas = {aid} <-: ln.areas and
        dom RESULT.areas(aid).trackcs = dom ln.areas(aid).trackcs and
        {tcid} <-: RESULT.areas(aid).trackcs = 
                {tcid} <-: ln.areas(aid).trackcs and
        RESULT.areas(aid).trackcs(tcid).joints = 
                ln.areas(aid).trackcs(tcid).joints ++ {jid |-> j} and
        RESULT.areas(aid).trackcs(tcid).joints(jid) = j and
        RESULT.connect = ln.connect;

Line_Del_Joint : Line * Area_id * TrackC_id * Joint_id -> Line
Line_Del_Joint(ln, aid, tcid, jid) ==
        mu(ln, areas |-> ln.areas ++
                {aid |-> Del_Joint(ln.areas(aid), tcid, jid)})
pre     aid in set dom ln.areas and
        pre_Del_Joint(ln.areas(aid), tcid, jid) and
        forall c in set dom ln.connect & forall aj in set c &
                (aj.aid = aid and aj.tcid = tcid) => aj.no <> jid
post    aid in set dom RESULT.areas and
        tcid in set dom RESULT.areas(aid).trackcs and
        jid not in set dom RESULT.areas(aid).trackcs(tcid).joints and
        dom RESULT.areas = dom ln.areas and
        {aid} <-: RESULT.areas = {aid} <-: ln.areas and
        dom RESULT.areas(aid).trackcs = dom ln.areas(aid).trackcs and
        {tcid} <-: RESULT.areas(aid).trackcs = 
                        {tcid} <-: ln.areas(aid).trackcs and
        RESULT.areas(aid).trackcs(tcid).joints = 
                {jid} <-: ln.areas(aid).trackcs(tcid).joints and
        RESULT.connect = ln.connect;


Line_Add_Path : Line * Area_id * Path_id * Path -> Line
Line_Add_Path(ln, aid, pid, p) ==
       mu(ln, areas |-> ln.areas ++ 
                {aid |-> Add_Path(ln.areas(aid), pid, p)})
pre     aid in set dom ln.areas and
        pre_Add_Path(ln.areas(aid), pid, p) and
        forall c in set dom ln.connect &
                forall n1, n2 in set c & 
                (n1 <> n2 and n1.aid = aid) =>
                 Direction_for_Area_Joint({pid |-> p}, n1.no, 
                  ln.areas(n2.aid).paths , n2.no, ln.connect(c).chng_direction)
post    aid in set dom RESULT.areas and
        pid in set dom RESULT.areas(aid).paths and
        dom RESULT.areas = dom ln.areas and
        {aid} <-: RESULT.areas = {aid} <-: ln.areas and
        RESULT.areas(aid).paths = ln.areas(aid).paths ++ {pid |-> p} and
        RESULT.areas(aid).paths(pid) = p and
        RESULT.connect = ln.connect;

Line_Del_Path : Line * Area_id * Path_id -> Line
Line_Del_Path(ln, aid, pid) ==
        mu(ln, areas |-> ln.areas ++ {aid |-> Del_Path(ln.areas(aid), pid)})
pre     aid in set dom ln.areas and
        pre_Del_Path(ln.areas(aid), pid)
post    aid in set dom RESULT.areas and
        pid not in set dom RESULT.areas(aid).paths and
        dom RESULT.areas = dom ln.areas and
        {aid} <-: RESULT.areas = {aid} <-: ln.areas and
        RESULT.areas(aid).paths = {pid} <-: ln.areas(aid).paths and
        RESULT.connect = ln.connect;


Line_Add_Route : Line * Area_id * Route_id * Route -> Line
Line_Add_Route(ln, aid, rid, r) ==
        mu(ln, areas |-> ln.areas ++ {aid |-> Add_Route(ln.areas(aid), rid,r)})
pre     aid in set dom ln.areas and
        pre_Add_Route(ln.areas(aid), rid, r)
post    aid in set dom RESULT.areas and
        rid in set dom RESULT.areas(aid).routes and
        dom RESULT.areas = dom ln.areas and
        {aid} <-: RESULT.areas = {aid} <-: ln.areas and
        RESULT.areas(aid).routes = ln.areas(aid).routes ++ {rid |-> r} and
        RESULT.areas(aid).routes(rid) = r and
        RESULT.connect = ln.connect;

Line_Del_Route : Line * Area_id * Route_id -> Line
Line_Del_Route(ln, aid, rid) ==
        mu(ln, areas |-> ln.areas ++ {aid |-> Del_Route(ln.areas(aid), rid)})
pre     aid in set dom ln.areas and
        pre_Del_Route(ln.areas(aid), rid)
post    aid in set dom RESULT.areas and
        dom RESULT.areas = dom ln.areas and
        {aid} <-: RESULT.areas = {aid} <-: ln.areas and
        rid not in set dom RESULT.areas(aid).routes and
        RESULT.areas(aid).routes = {rid} <-: ln.areas(aid).routes and
        RESULT.connect = ln.connect;

Line_Add_Condition : Line * Area_id * Path_id * Condition-> Line
Line_Add_Condition(ln, aid, pid, con) ==
        mu(ln, areas |-> ln.areas ++
                        {aid |-> Add_Condition(ln.areas(aid), pid, con)})
pre     aid in set dom ln.areas and
        pre_Add_Condition(ln.areas(aid), pid, con);

Line_Del_Condition : Line * Area_id * Path_id * Cond_Kind * nat * nat-> Line
Line_Del_Condition(ln, aid, pid, kind, start, endp) ==
        mu(ln, areas |-> ln.areas ++ 
                {aid |-> Del_Condition(ln.areas(aid), pid, kind, start, endp)})
pre     aid in set dom ln.areas and
        pre_Del_Condition(ln.areas(aid), pid, kind, start, endp)
;

--
--  Digital ATC Database
--  Condition for "Completed" Database
--

functions
Is_wf_Line_DB : Line -> bool
Is_wf_Line_DB(ln) ==

        (forall aid in set dom ln.areas & let ar = ln.areas(aid) in
                Joint_Completed(ar.trackcs, aid, ln.connect) and
                Path_Exists_for_Joint(ar.trackcs, ar.paths) and
                Path_Exists_for_TrackC(ar.trackcs, ar.paths) and
                Route_Exists_for_Path(ar) and
                Path_Exists_before_Start(ar, aid, ln.connect) and
                Path_Exists_after_End(ar, aid, ln.connect) and
                Route_Exists_to_Terminal(ar, aid, ln.connect) and
                (ar.kind = <PLAIN> => Is_Plain_Area(ar, aid, ln.connect))) and

        Following_Path_Exists_at_Connect(ln) and
        Preceding_Path_Exists_at_Connect(ln) and
        One_Side_Unique_Path_at_Connection(ln);



Joint_Completed : TrackC_map * Area_id * Connect_map -> bool
Joint_Completed(trackcs, aid, connect) ==
        forall tid in set dom trackcs &
        let tc = trackcs(tid) in
                forall jid in set dom tc.joints &
                (not exists tcid in set dom trackcs & tcid <> tid and
                                jid in set dom trackcs(tcid).joints) =>
                (mk_Area_Joint(aid, tid, jid) in set dunion dom connect or
                 tc.joints(jid).remark.line_terminal)
;

Path_Exists_for_Joint : TrackC_map * Path_map -> bool
Path_Exists_for_Joint(trackcs, paths) ==
        forall tid in set dom trackcs &
        forall jid in set dom trackcs(tid).joints &
                (exists p in set rng paths & 
                        p.tc = tid and
                        (p.start = jid or p.endp = jid))
;

Path_Exists_for_TrackC : TrackC_map * Path_map -> bool
Path_Exists_for_TrackC(trackcs, paths) ==
        forall tid in set dom trackcs &
        forall dr in set dom trackcs(tid).atc &
                trackcs(tid).atc(dr).used => 
                        exists p in set rng paths & 
                                p.tc = tid and p.used(dr)
;

Route_Exists_for_Path : Area -> bool
Route_Exists_for_Path(ar) ==
        forall pid in set dom ar.paths &
        forall dr in set dom ar.paths(pid).used &
                ar.paths(pid).used(dr) =>
                ar.trackcs(ar.paths(pid).tc).atc(dr).used =>
                exists r in set rng ar.routes & 
                        r.dr = dr and pid in set elems r.paths;

Path_Exists_before_Start :  Area * Area_id * Connect_map -> bool
Path_Exists_before_Start(ar, aid, connect) ==
        forall pid in set dom ar.paths &
        let p = ar.paths(pid) in
        forall dr in set dom p.used &
                p.used(dr) =>
                (mk_Area_Joint(aid, p.tc, p.start) in set dunion dom connect or
                ar.trackcs(p.tc).joints(p.start).remark.line_terminal or
                ar.trackcs(p.tc).joints(p.start).remark.atc_terminal(dr) or
                exists pid1 in set dom ar.paths &
                        let p1 = ar.paths(pid1) in
                        p1.tc <> p.tc and
                        p1.used(dr) and
                        p1.endp = p.start)
;

Path_Exists_after_End :  Area * Area_id * Connect_map -> bool
Path_Exists_after_End(ar, aid, connect) ==
        forall pid in set dom ar.paths &
        let p = ar.paths(pid) in
        forall dr in set dom p.used &
                p.used(dr) =>
                (mk_Area_Joint(aid, p.tc, p.endp) in set dunion dom connect or
                ar.trackcs(p.tc).joints(p.endp).remark.line_terminal or
                ar.trackcs(p.tc).joints(p.endp).remark.atc_terminal(dr) or
                exists pid1 in set dom ar.paths &
                        let p1 = ar.paths(pid1) in
                        p1.tc <> p.tc and
                        p1.used(dr) and
                        p1.start = p.endp)
;

StartJoint : Path * Direction -> Joint_id
StartJoint(path, dr) ==
        if dr = <ADIR> then path.start else path.endp
post    (dr = <ADIR> => RESULT = path.start) and
        (dr = <BDIR> => RESULT = path.endp);

EndJoint : Path * Direction -> Joint_id
EndJoint(path, dr) ==
        if dr = <ADIR> then path.endp else path.start
post    (dr = <ADIR> => RESULT = path.endp) and
        (dr = <BDIR> => RESULT = path.start);


--
-- Route_Exists_to_Terminal means that Train can reach an Area_Joint or
--                                                    an end of track.
Route_Exists_to_Terminal : Area * Area_id * Connect_map -> bool
Route_Exists_to_Terminal(ar, aid, connect) ==
        forall rid in set dom ar.routes &
                let r = ar.routes(rid) in
                let pid = r.paths(len r.paths) in
                let jid  = EndJoint(ar.paths(pid), r.dr),
                    tcid = ar.paths(pid).tc in

                mk_Area_Joint(aid, tcid, jid) in set dunion dom connect or
                ar.trackcs(tcid).joints(jid).remark.line_terminal or
                ar.trackcs(tcid).joints(jid).remark.atc_terminal(r.dr) or
                Following_Route_Exists(ar.routes, rid) or
                Following_Path_Unique(ar.paths, pid, r.dr);


--
-- Following_Route_Exists1 :
-- On the last path, if a next route which includes following paths can 
-- be indicated, train can proceed with next route ID.
--

Following_Route_Exists : Route_map * Route_id -> bool
Following_Route_Exists(routes, rid) ==
        exists rid1 in set dom routes & 
                let r = routes(rid), r1 = routes(rid1) in
                r1.dr = r.dr and
                exists i in set inds r1.paths &
                        r1.paths(i) = r.paths(len r.paths) and
                        i < len r1.paths
pre     rid in set dom routes;

--
-- Unique_Next_Path :
-- On the last path, if there is only one next path possible,
--  trains can proceed to the next path.
--
Following_Path_Unique : Path_map * Path_id * Direction-> bool
Following_Path_Unique(paths, pid, dr) ==
        exists1 pid1 in set dom paths &
                paths(pid1).tc <> paths(pid).tc and
                paths(pid1).used(dr) and
                EndJoint(paths(pid), dr) = StartJoint(paths(pid1), dr)
pre     pid in set dom paths;


--
-- Plain Area, where from TrackC_id and direction, Route can be determined.
--

Is_Plain_Area : Area * Area_id * Connect_map-> bool
Is_Plain_Area(ar, aid, connect) ==
        (forall tcid in set dom ar.trackcs &
        forall dr in set dom ar.trackcs(tcid).atc &
        ar.trackcs(tcid).atc(dr).used =>
                exists1 rid in set dom ar.routes &
                        ar.routes(rid).dr = dr and
                        exists pid in seq ar.routes(rid).paths &
                        ar.paths(pid).tc = tcid) and
        (forall r in set rng ar.routes &
                let p = ar.paths(r.paths(len r.paths)) in
                let jid = EndJoint(p, r.dr) in
                mk_Area_Joint(aid, p.tc, jid) in set dunion dom connect or
                ar.trackcs(p.tc).joints(jid).remark.line_terminal or
                ar.trackcs(p.tc).joints(jid).remark.atc_terminal(r.dr));
                

--
-- One_Side_Unique_Path_at_Connection
--  At the connection it is not favorable that 
--  in both area paths are not unique.
-- Because it makes imposibble to indicate next path 
--                              in the former track circuit.

One_Side_Unique_Path_at_Connection : Line -> bool
One_Side_Unique_Path_at_Connection(ln) ==
        forall con in set dom ln.connect &
        forall n1, n2 in set con & n1 <> n2 =>
        forall dr in set {<ADIR>, <BDIR>} &
        card {p | p in set rng ln.areas(n1.aid).paths & 
                p.used(dr) and 
                EndJoint(p, dr) = n1.no} > 1 =>

                (ln.areas(n1.aid).trackcs(n1.tcid).joints(n1.no).
                    remark.atc_terminal(dr) or

                 let dr2 = if not ln.connect(con).chng_direction then dr
                                else if dr = <ADIR> then <BDIR> else <ADIR> in
                 card {p | p in set rng ln.areas(n2.aid).paths & 
                                p.used(dr2) and 
                                StartJoint(p, dr2) = n2.no} = 1);

Following_Path_Exists_at_Connect : Line -> bool
Following_Path_Exists_at_Connect(ln) ==
        forall con in set dom ln.connect &
        forall n1, n2 in set con & n1 <> n2 =>
        forall dr in set {<ADIR>, <BDIR>} &
        (exists p in set rng ln.areas(n1.aid).paths &
                p.used(dr) and
                EndJoint(p, dr) = n1.no) =>
        (ln.areas(n1.aid).trackcs(n1.tcid).joints(n1.no).
            remark.atc_terminal(dr) or
        (exists p2 in set rng ln.areas(n2.aid).paths &
                 let dr2 = if not ln.connect(con).chng_direction then dr
                                else if dr = <ADIR> then <BDIR> else <ADIR> in
                 p2.used(dr2) and
                 StartJoint(p2, dr2) = n2.no));

Preceding_Path_Exists_at_Connect : Line -> bool
Preceding_Path_Exists_at_Connect(ln) ==
        forall con in set dom ln.connect &
        forall n1, n2 in set con & n1 <> n2 =>
        forall dr in set {<ADIR>, <BDIR>} &
        (exists p in set rng ln.areas(n1.aid).paths &
                p.used(dr) and
                StartJoint(p, dr) = n1.no) =>
        (ln.areas(n1.aid).trackcs(n1.tcid).joints(n1.no).
            remark.atc_terminal(dr) or
        (exists p2 in set rng ln.areas(n2.aid).paths &
                let dr2 = if not ln.connect(con).chng_direction 
                          then dr
                          elseif dr = <ADIR> 
                          then <BDIR> 
                          else <ADIR> in
                p2.used(dr2) and
                EndJoint(p2, dr2) = n2.no));
~~~
{% endraw %}

