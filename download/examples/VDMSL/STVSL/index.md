---
layout: default
title: STVSL
---

## STVSL
Author: Paul Mukherjee


This model aims to model a single transferable voting system used for electronic 
voting. It is further described in the following papers:  
 
P. Mukherjee and B.A. Wichmann. Formal Specification of the STV Algorithm. In
M.G. Hinchey and J. P. Bowen, editors, Applications of Formal Methods. Prentice
Hall, 1995.

Paul Mukherjee,  Automatic translation of VDM-SL specifications into gofer, 
Springer, Lecture Notes in Computer Science, Volume Volume 1313/1997 
Book FME '97: Industrial Applications and Strengthened Foundations of 
Formal Methods 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### stv.vdmsl

{% raw %}
~~~
values

Number_of_vacancies = 5;
Cand_names = {<Adam>,<Bill>,<Charlie>,<Donald>,<Edward>,<Frank>,<George>,
              <Harry>,<Ian>,<John>};

rand_choice = [<Bill>,<Adam>,<John>,<Frank>];

Votes = {
{<Adam> |-> 1,<Bill> |-> 2,<Charlie> |-> 3,<Frank> |-> 4} |->100000, 
{<Bill> |-> 1,<Adam> |-> 2,<Charlie> |-> 3,<George> |-> 4} |->100000, 
{<Adam> |-> 1,<Charlie> |-> 2,<Bill> |-> 3,<Harry> |-> 4} |->100000, 
{<Bill> |-> 1,<Charlie> |-> 2,<Adam> |-> 3,<Ian> |-> 4} |->100000, 
{<Charlie> |-> 1,<Adam> |-> 2,<Bill> |-> 3,<John> |-> 4} |->100000, 
{<Charlie> |-> 1,<Bill> |-> 2,<Adam> |-> 3,<Donald> |-> 4} |->100000, 
{<Donald> |-> 1,<Adam> |-> 2} |->1000, 
{<Frank> |-> 1,<Bill> |-> 2} |->1000, 
{<George> |-> 1,<Charlie> |-> 2} |->1000, 
{<Harry> |-> 1,<Bill> |-> 2} |->1000, 
{<Ian> |-> 1,<Adam> |-> 2} |->1000, 
{<John> |-> 1,<Charlie> |-> 2} |->1000}

types

Candidate_names = <Adam>|<Bill>|<Charlie>|<Donald>|<Edward>|
                  <Frank>|<George>|<Harry>|<Ian>|<John>;
                  -- token;

Voting_paper = map Candidate_names to nat1
  inv v == exists1 name:Candidate_names & v(name) = 1;

Parcel = map Voting_paper to nat1;

Score::name: Candidate_names
       count: real;

Stage = seq of Score
  inv s == 
      forall i in set inds s, j in set inds s & 
        (i < j => s(i).count >= s(j).count
          and
         i<>j => s(i).name <> s(j).name);

Value = real
  inv v  == v >= 0;

Sub_parcel:: votes: Parcel
             value: Value;

Candidate:: name: Candidate_names
            original_votes: Parcel
            transferred_votes: seq of Sub_parcel
  inv candidate == 
      (forall ov in set dom candidate.original_votes & 
          (ov :> {1} = {candidate.name |-> 1} and
          {candidate.name} <: ov = {candidate.name |-> 1}))
        and
      (forall sub_parcel in set elems candidate.transferred_votes &
          forall tv in set dom sub_parcel.votes &
                candidate.name in set dom tv);

Sub_parcel_bundle:: sub_parcels: map Candidate_names to Sub_parcel
                    non_transferable:Sub_parcel
                    loss_of_value: real;

Record_entry:: scores: set of Score
               non_transferable_value: real
               loss_of_value: real;

Result::scores: set of Score
        surplus_transferred:[Candidate_names]
        candidate_excluded:[Candidate_names];

Result_sheet:: results: seq of Result
               elected_candidates: set of Candidate_names;

Candset = set of Candidate;
Candnset = set of Candidate_names

state St of
  elected: set of Candidate
  excluded: set of Candidate
  continuing: set of Candidate
  stages: seq of Stage
  quota: real
  record: seq of Record_entry
  next_choice : seq of Candidate_names
  inv s  ==
    {cand.name | cand in set s.elected union s.excluded union s.continuing} =
        Cand_names
    and
    disjoint({s.elected, s.excluded, s.continuing})
    and
    (forall cand1 in set s.elected union s.excluded union s.continuing,
        cand2 in set s.elected union s.excluded union s.continuing &
          (cand1 = cand2) <=> (cand1.name = cand2.name))
init s == s =
  mk_St({mk_Candidate(nm,{|->},[])|nm in set Cand_names},
        --{},
        {},{},[],42,[],[])
end


functions

mult_p_sum:set of (nat * Parcel) -> nat
mult_p_sum(s) ==
        if s = {} then 0 
        else let mk_(m,pa) in set s in
          (card(dom pa) * m) + mult_p_sum(s \ {mk_(m,pa)});

size: Parcel -> nat
size(p) ==
  let mults = rng p in
  let mult_p = {mk_(m, p :> {m}) | m in set mults} in
  mult_p_sum(mult_p);


disjoint: set of (set of Candidate) -> bool
disjoint(ss) == forall s1 in set ss, s2 in set ss &
                        s1<>s2 => s1 inter s2 = {};

vote_res: Parcel * set of Voting_paper -> Parcel
vote_res(votes,domain) == domain <: votes;

sort_papers: Parcel * set of Candidate_names -> Candset
sort_papers(votes, names) ==
      {mk_Candidate(name,vote_res(votes,{v | v in set dom votes & (v :>
             {1}) =  ({name |-> 1})}),[])| name in set names};


two_decimal_places: real -> real
two_decimal_places(r) ==
        let s = r*100 in
        if floor s = s then r else (floor s + 1)/100;

stage_bk: seq of Score -> Score
stage_bk(s) ==
  s(len s)
pre s <> [];

defer_transfer_of_surplus:real * Stage -> bool
defer_transfer_of_surplus(quota, stage) ==
         let lowest_value = (stage_bk(stage)).count,
             second_lowest_value = stage(len stage - 1).count in         
         sum([s.count - quota | s in seq stage &
                s.count > quota]) <= second_lowest_value - lowest_value
pre len stage > 1;

sum: seq of real -> real
sum(s) ==
  if s = [] then 0 
  else hd s + sum(tl s);

sole_leader: Stage * Candidate_names * set of Candidate_names -> bool
sole_leader(stage,name,leaders) ==
  let cand = iota c in seq stage & c.name = name in
  let leading_scores = 
      {sc | sc in seq stage & sc.name in set leaders} \ {cand} in
  forall sc in set leading_scores & cand.count > sc.count;

greatest_value_at_earliest_stage: Candidate_names * seq of Stage -> bool
greatest_value_at_earliest_stage(name,all_stages) ==
        let leaders = {score.name | score in seq hd all_stages &
                          score.count = (hd hd all_stages).count} in
        exists i in set inds all_stages &
          (sole_leader(all_stages(i), name,leaders)
           and
           (forall j in set {i+1,...,len all_stages}, 
                    other_leader in set leaders &
                not (sole_leader(all_stages(j),other_leader,leaders))));
 



surplus_from_original_votes: Candidate -> bool
surplus_from_original_votes(candidate) ==
        candidate.transferred_votes = [];

construct_sub_parcels: Value * Parcel * Candidate * set of Candidate
                -> Sub_parcel_bundle
construct_sub_parcels(val,parcel,discontinuing,continuing_candidates) ==
 let names = {candidate.name | candidate in set continuing_candidates} in
 let sub_parcel_map = { n |-> mk_Sub_parcel({ v |-> parcel(v) | v in set dom
                            parcel & next_preference(n,v,names)},val) 
                             | n in set names} in
 let non_empty_sub_parcel_map = { n |-> sub_parcel_map(n) | n in set
            dom sub_parcel_map & sub_parcel_map(n).votes <> {|->}} in
 mk_Sub_parcel_bundle(non_empty_sub_parcel_map,
                      mk_Sub_parcel(non_transferable_papers(parcel,
                                     discontinuing.name, names),1.0),0);


non_transferable_papers: Parcel * Candidate_names * set of Candidate_names
                -> Parcel
non_transferable_papers(parcel,disc,cont) ==
        { v | v in set dom parcel & 
                non_transferable_paper(v,disc,cont)} <: parcel;

next_preference: Candidate_names * Voting_paper * set of Candidate_names -> 
                 bool
next_preference(name,vote,continuing) ==
        if name in set dom vote 
        then exists i in set rng vote &
                (vote(name) = i
                 and
                 dom (vote :> {1,...,i-1}) inter continuing = {})
        else false;

construct_bundle_for_transfer:real * Value * Parcel * Candidate * 
        set of Candidate -> Sub_parcel_bundle
construct_bundle_for_transfer(surplus, old_value, old_votes, disc, cont_cands)
     == 
     let new_sub_parcels = construct_sub_parcels(1.00, old_votes,
                                disc, cont_cands) in
     let total_no_of_trans_votes = size(old_votes) - 
                        size(new_sub_parcels.non_transferable.votes) in
     let total_val_trans_votes = total_no_of_trans_votes * old_value in
     let transf_val = calc_transf_value(surplus,total_val_trans_votes,
                                       old_value,total_no_of_trans_votes) in
     let sub_parcels = { n |->
          mk_Sub_parcel(new_sub_parcels.sub_parcels(n).votes,
          transf_val) | n in set dom new_sub_parcels.sub_parcels},
         loss_of_value = calc_loss_of_value(surplus,
                    total_val_trans_votes,total_no_of_trans_votes, old_value),
         non_trans_val = calc_non_transf_value(surplus, 
                                        total_val_trans_votes) in
     mk_Sub_parcel_bundle(sub_parcels,
                          mk_Sub_parcel(new_sub_parcels.non_transferable.votes,
                                        non_trans_val),
                          loss_of_value);


calc_transf_value: real * Value * Value * nat -> Value
calc_transf_value(surplus,total_value,old_value, total_no) ==
        if surplus < total_value
        then (floor((100*surplus)/total_no))/100
        else old_value;

calc_loss_of_value: real * Value * nat * Value -> real
calc_loss_of_value(surplus,total_value,total_number,old_value) ==
        if surplus < total_value
        then (surplus/total_number) - 
                (floor(100*surplus*old_value/total_value))/100
        else 0;

calc_non_transf_value: real * Value -> Value
calc_non_transf_value(surplus,total_value) ==
        if surplus > total_value
        then surplus - total_value
        else 0;

redistribute_parcels: Candset * Sub_parcel_bundle -> Candset
redistribute_parcels(previous_collection,bundle) ==
          {mu(candidate, transferred_votes |-> 
                [bundle.sub_parcels(n)]^candidate.transferred_votes)|
                candidate in set previous_collection, 
                    n in set dom bundle.sub_parcels &
                  candidate.name = n}
          union
          {candidate| candidate in set previous_collection &
                        candidate.name not in set dom bundle.sub_parcels}
pre
     dom bundle.sub_parcels subset {candidate.name | 
                                  candidate in set
previous_collection};

  score_sort: Stage -> Stage
  score_sort(sta) ==
    cases sta:
      []      -> sta,
      [e]     -> sta,
      others  -> let sta1^sta2 in set {sta} be st abs (len sta1 - len sta2) < 2
                 in
                   let sta_l = score_sort(sta1),
                       sta_r = score_sort(sta2) in
                    score_merge(sta_l, sta_r)
    end;

  score_merge: Stage * Stage -> Stage
  score_merge(sta1,sta2) ==
    cases mk_(sta1,sta2):
      mk_([],sta),mk_(sta,[]) -> sta,
      others              -> if (hd sta1).count >= (hd sta2).count then 
                               [hd sta1] ^ score_merge(tl sta1, sta2)
                             else
                               [hd sta2] ^ score_merge(sta1, tl sta2)
    end;

set_seq: set of Score -> Stage
set_seq(s) ==
  if s = {} then []
  else let e in set s in [e]^(set_seq(s\{e}));

build_first_stage: set of Candidate -> Stage
build_first_stage(candidates) ==
  score_sort(set_seq({mk_Score(candidate.name,size(candidate.original_votes))|
                candidate in set candidates}));


construct_new_stage:Stage * Candidate_names * Sub_parcel_bundle -> Stage
construct_new_stage(old_stage,discontinuing, bundle) ==
     let cands_with_more_votes = dom bundle.sub_parcels in
     let unsorted_scores = 
         { mk_Score(name,old_count +  bundle.sub_parcels(name).value *
                           size(bundle.sub_parcels(name).votes)) |
                  mk_Score(name,old_count) in seq old_stage &
                  name in set cands_with_more_votes}

        union
        {sc | sc in seq old_stage & sc.name not in set cands_with_more_votes } in
     score_sort(set_seq(unsorted_scores));


exists_non_deferable_surplus: (seq of Stage) * real -> bool
exists_non_deferable_surplus(stages,quota) ==
        (hd (hd stages)).count >= quota
        and
        not defer_transfer_of_surplus(quota, hd stages);

trailing_candidate: Candidate_names * seq1 of Stage -> bool
trailing_candidate(name,all_stages) ==
        let trailing_count = (stage_bk(hd all_stages)).count in
        let lowest = { score.name | score in seq hd all_stages &
                                score.count = trailing_count} in
        exists i in set inds all_stages &
          (sole_trailer(all_stages(i),name,lowest) and
           forall j in set {i+1,...,len all_stages}, other in set lowest &
                not (sole_trailer(all_stages(j),other,lowest)));

sole_trailer: Stage * Candidate_names * set of Candidate_names -> bool
sole_trailer(stage,name,lowest) ==
	let cand = iota c in seq stage & c.name = name in
	let lowest_scores =  {sc | sc in seq stage & sc.name in set lowest} \ {cand} in
	forall sc in set lowest_scores & cand.count < sc.count;



number_of_continuing_candidates: set of Candidate_names -> nat
number_of_continuing_candidates(cands) == card cands;

number_of_remaining_vacancies: set of Candidate_names -> nat
number_of_remaining_vacancies(cands) == Number_of_vacancies - card cands;


total_value:Sub_parcel -> real
total_value(sub_parcel) ==
  size(sub_parcel.votes) * sub_parcel.value;

number_of_candidates_satisfying_quota: (set of Candidate) * (seq of Stage) * 
                                          real -> nat
number_of_candidates_satisfying_quota(continuing,stages,quota) ==
  let xs_quota_scs = { sc.name | sc in seq hd stages & sc.count >= quota} in
  card { cand | cand in set continuing & cand.name in set xs_quota_scs};

non_transferable_paper: Voting_paper * Candidate_names * 
                                set of Candidate_names -> bool
non_transferable_paper(paper,discontinuing,continuing_names) ==
  dom (paper :-> {1}) inter continuing_names = {} or
  let s = (rng( paper :-> {1,...,(paper(discontinuing))})) in
  if s = {} then true 
  else let m = min(s) in
  (card dom (paper :> {m}) > 1
        or
   m - 1 not in set rng paper);

min: set1 of real -> real
min(s) ==
 let m in set s in
 if card s = 1 then m 
 else let sm = min (s \ {m}) in
   if m < sm then m else sm;

last_vacancy_fillable: (set of Candidate) * (seq of Stage) * real -> bool
last_vacancy_fillable(continuing,stages, quota) ==
        let continuing_names = {c.name | c in set continuing} in
        let continuing_scores = [s | s in seq hd stages &
                                     s.name in set continuing_names],
            surplus_scores = [s | s in seq hd stages & s.count > quota] in
        exists i in set inds continuing_scores &
          continuing_scores(i).count >
            sum([continuing_scores(j).count | 
                    j in set (inds continuing_scores \ {i})]) +
            sum([ss.count - quota | ss in seq surplus_scores]);



make_result_sheet: seq of Stage * real * seq of Record_entry * 
       set of Candidate_names -> Result_sheet
make_result_sheet(stages, quota, record, elected) == 
let result: nat1 -> Result
    result(i) == if len stages(i+1) > len stages(i)
                 then let excluded = iota ex in set Cand_names &
                                ex in set { sc.name | 
                                  sc in seq stages(i+1) &
                                 (forall osc in seq stages(i) & 
                                             osc.name <> sc.name)} in
                      mk_Result(record(i+1).scores,nil,excluded)
                 else let transferred = iota tf in set Cand_names &
                              tf in set { sc.name | 
                                   sc in seq stages(i+1) & 
                              mk_Score(sc.name,quota) in set elems stages(i) 
                                      and sc.count > quota} in
                      mk_Result(record(i+1).scores,transferred,nil) in
  mk_Result_sheet([result(len record - j) | j in set {1,...,len record -
1}],elected);

sp_set_seq: set of Sub_parcel -> seq of Sub_parcel
sp_set_seq(s) ==
  if s = {} then []
  else let e in set s in [e]^(sp_set_seq (s\{e}));

  sub_parcels_sort: seq of Sub_parcel -> seq of Sub_parcel
  sub_parcels_sort(sps) ==
    cases sps:
      []      -> sps,
      [e]     -> sps,
      others  -> let sps1^sps2 in set {sps} be st abs (len sps1 - len sps2) < 2
                 in
                   let sps_l = sub_parcels_sort(sps1),
                       sps_r = sub_parcels_sort(sps2) in
                    sub_parcels_merge(sps_l, sps_r)
    end;

  sub_parcels_merge: seq of Sub_parcel * seq of Sub_parcel -> seq of Sub_parcel
  sub_parcels_merge(sps1,sps2) ==
    cases mk_(sps1,sps2):
      mk_([],sps),mk_(sps,[]) -> sps,
      others              -> if total_value(hd sps1)>= total_value(hd sps2) 
                             then [hd sps1] ^ sub_parcels_merge(tl sps1, sps2)
                             else [hd sps2] ^ sub_parcels_merge(sps1, tl sps2)
    end


operations

CHOOSE_SURPLUS_TO_TRANSFER:() ==> Candidate_names
CHOOSE_SURPLUS_TO_TRANSFER() ==
  (dcl leaders:set of Candidate_names := 
                {score.name | score in seq hd stages &
                        score.count = (hd hd stages).count};
       if card leaders = 1
       then let {n} = leaders in return(n)
       else if exists n in set leaders &
                        greatest_value_at_earliest_stage(n,stages)
            then return(iota name in set leaders & 
                     greatest_value_at_earliest_stage(name,stages))
            else return RANDOM_ELEMENT(leaders))
 pre stages <> [];

CHOOSE_CANDIDATE_TO_EXCLUDE:() ==> Candidate_names
CHOOSE_CANDIDATE_TO_EXCLUDE() ==
   (dcl lowest:set of Candidate_names := 
              {score.name | score in seq hd stages &
                        score.count = (stage_bk(hd stages)).count};
       if card lowest = 1
       then let {n} = lowest in return(n)
       else if exists n in set lowest &
                        trailing_candidate(n,stages)
            then return(iota name in set lowest & 
                     trailing_candidate(name,stages))
            else return RANDOM_ELEMENT(lowest))
pre stages <> [];


RANDOM_ELEMENT:Candnset ==> Candidate_names
RANDOM_ELEMENT(s) ==
  (dcl c:Candidate_names := hd next_choice; 
   next_choice := tl next_choice;
   return(c));

PREPARE_ELECTION: Parcel ==> ()
PREPARE_ELECTION(votes) ==
    (dcl curr_cont:Candset := sort_papers(votes, Cand_names);
     excluded := {};
     continuing := curr_cont;
     next_choice := rand_choice;
     elected := {};
     stages := [build_first_stage(curr_cont)];
     quota := two_decimal_places(size(votes)/(Number_of_vacancies + 1));
     record := [mk_Record_entry(elems hd stages,0,0)];
     let nc = number_of_candidates_satisfying_quota(curr_cont,stages,quota) in
    if ((0 < nc) and (nc <= Number_of_vacancies))
    then
      CHANGE_STATUS_OF_ELECTED_CANDIDATES()
    else skip);
                                

ELECT_ALL_REMAINING_CANDIDATES:() ==> ()
ELECT_ALL_REMAINING_CANDIDATES() ==
  (elected := elected union continuing;
   continuing := {});


PROCESS_SUB_PARCELS:Candidate * seq of Sub_parcel ==> ()
PROCESS_SUB_PARCELS(ex_cand, sub_parcels) ==
 ( dcl i: nat:=0;
   dcl non_trans_value: real:=0;
   dcl bundle: Sub_parcel_bundle:=mk_Sub_parcel_bundle({|->},
                                  mk_Sub_parcel({|->},0.0),0);
   dcl new_candidates: set of Candidate := continuing \ {ex_cand};
   dcl new_stage: Stage := hd stages;
   while i <> len sub_parcels do
        ( i:= i+1;
	  bundle:=
              construct_sub_parcels(sub_parcels(i).value,sub_parcels(i).votes,
                     ex_cand,new_candidates);
          non_trans_value:=non_trans_value + size(bundle.non_transferable.votes) *
		sub_parcels(i).value;
          new_candidates:= redistribute_parcels(new_candidates,bundle);
          new_stage:= construct_new_stage(new_stage,ex_cand.name,bundle);
          (let no_cands = number_of_candidates_satisfying_quota(new_candidates,
				[new_stage],quota) in
          (if 0 < no_cands and no_cands <= number_of_remaining_vacancies
                                             ({e.name | e in set elected})
           then let  xs_quota_scs = {sc.name | sc in seq
                                       new_stage & sc.count >= quota} in
                let  new_elected = { cand | cand in set new_candidates &
				   cand.name in set xs_quota_scs} in
		(elected:=elected union new_elected;
                new_candidates:=new_candidates \ new_elected)
          else skip)));
        continuing:= new_candidates;
        excluded:=excluded union {ex_cand};
        record:= [mk_Record_entry( elems new_stage
                                  union
                                  {score|score in set (hd record).scores &
                                    score.name not in set 
                                    {sc.name | sc in seq new_stage}} union 
                                  {mk_Score(ex_cand.name,0)},
                                 non_trans_value,0)]^record;
        stages:= [[ns | ns in seq new_stage & ns.name <> ex_cand.name]]^stages);


ELECT_LAST_CANDIDATE:() ==> ()
ELECT_LAST_CANDIDATE() ==
(dcl elected_candidate:Candidate := iota leader in set continuing &
		leader.name = ((hd stages)(Number_of_vacancies)).name;
     elected := elected union {elected_candidate};
     continuing := continuing \ {elected_candidate})
pre last_vacancy_fillable(continuing,stages,quota);

TRANSFER_SURPLUS:() ==> ()
TRANSFER_SURPLUS() ==
 (dcl name:Candidate_names := CHOOSE_SURPLUS_TO_TRANSFER();
  def  candidate = iota c in set elected & c.name = name in
  def  surplus = (hd hd stages).count - quota;
       sub_parcel = if surplus_from_original_votes(candidate)
                    then mk_Sub_parcel(candidate.original_votes,1.0)
                    else hd candidate.transferred_votes in
  def  sub_parcel_bundle = construct_bundle_for_transfer(surplus,
                                   sub_parcel.value,
                                   sub_parcel.votes,candidate,continuing) in
  def new_stage =  construct_new_stage(
            [mk_Score(name,quota)]^(
            [s | s in seq (hd stages) & s.name <> name]), candidate.name,
            sub_parcel_bundle) in
  def curr_cont = redistribute_parcels(continuing \ {candidate}, 
                                      sub_parcel_bundle) in
    (stages := [new_stage]^stages;
     record := [mk_Record_entry( 
                elems new_stage union
                {score| score in set (hd record).scores &
                        score.name not in set {sc.name|sc in seq
                                          new_stage}},
                sub_parcel_bundle.non_transferable.value,
                sub_parcel_bundle.loss_of_value)]^record;
    continuing := curr_cont;
    let nc = number_of_candidates_satisfying_quota(curr_cont,stages,quota) in
    if 0 < nc and nc <= Number_of_vacancies
    then (CHANGE_STATUS_OF_ELECTED_CANDIDATES())))
pre exists_non_deferable_surplus(stages,quota);


EXCLUDE_CANDIDATE:() ==> ()
EXCLUDE_CANDIDATE() ==
    let name = CHOOSE_CANDIDATE_TO_EXCLUDE() in
    let excluded_candidate  = iota c in set continuing &
      c.name = name 
    in
    let sorted_sub_parcels = 
         sub_parcels_sort(sp_set_seq(elems excluded_candidate.transferred_votes
                    union
                    {mk_Sub_parcel(excluded_candidate.original_votes,1.0)}))
    in 
    PROCESS_SUB_PARCELS(excluded_candidate,sorted_sub_parcels);

ELECT_CANDIDATES:() ==> ()
ELECT_CANDIDATES() ==
    def nc = number_of_continuing_candidates({c.name | c in set continuing});
        nv = number_of_remaining_vacancies({e.name | e in set elected});
        nq = number_of_candidates_satisfying_quota(continuing,stages,quota) 
    in
    if nc = nv
      then ELECT_ALL_REMAINING_CANDIDATES()
    elseif (0< nq and nq <= nv)
      then CHANGE_STATUS_OF_ELECTED_CANDIDATES()
    elseif (nv = 1
           and
           last_vacancy_fillable(continuing,stages,quota))
      then ELECT_LAST_CANDIDATE()
    elseif exists_non_deferable_surplus(stages,quota)
      then TRANSFER_SURPLUS()
    else EXCLUDE_CANDIDATE();

CONDUCT_ELECTION: Parcel ==> Result_sheet
CONDUCT_ELECTION(votes) ==
    (PREPARE_ELECTION(votes);
     while (card elected <> Number_of_vacancies) and 
               (card continuing > 0) do
        ELECT_CANDIDATES();
     return make_result_sheet(stages,quota,record,{e.name | e in set elected}));

CHANGE_STATUS_OF_ELECTED_CANDIDATES:() ==> ()
CHANGE_STATUS_OF_ELECTED_CANDIDATES() ==
  let xs_quota_scs = {sc.name | sc in seq hd stages & sc.count >= quota} in
  def candidates_satisfying_quota = {candidate | candidate in set 
        continuing & candidate.name in set xs_quota_scs} in
     (elected := candidates_satisfying_quota union elected;
     continuing := continuing \ candidates_satisfying_quota)
pre number_of_candidates_satisfying_quota(continuing,stages,quota) <=
      number_of_remaining_vacancies({e.name | e in set elected})


~~~
{% endraw %}

