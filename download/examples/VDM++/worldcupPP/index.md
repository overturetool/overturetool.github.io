---
layout: default
title: worldcupPP
---

## worldcupPP
Author: Yves Ledru



This example illustrates how one can define the rules 
for calculating who will qualify in the world 
championship in soccer given different initial groups. 
This model is made for the championship in 2000 but it 
could easily be updated to reflect the any championships. 
In the test class UseGP there are a few examples of 
using the traces primitives used for test automation.
 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### worldcup.vdmpp

{% raw %}
~~~
class GroupPhase

values

secondRoundWinners = [<A>,<B>,<C>,<D>,<E>,<F>,<G>,<H>];
secondRoundRunnersUp = [<B>,<A>,<D>,<C>,<F>,<E>,<H>,<G>]


types

public Team = <Brazil> | <Norway> | <Morocco> | <Scotland> |
       <Italy> | <Chile> | <Austria> | <Cameroon> |
       <France> | <Denmark> | <SouthAfrica> | <SaudiArabia> | 
       <Nigeria> | <Paraguay> | <Spain> | <Bulgaria> |
       <Holland> | <Mexico> | <Belgium> | <SouthKorea> |
       <Germany> | <Yugoslavia> | <Iran> | <UnitedStates> |
       <Rumania> | <England> | <Colombia> | <Tunisia> |
       <Argentina> | <Croatia> | <Jamaica> | <Japan>;

public GroupName = <A> | <B> | <C> | <D> | <E> | <F> | <G> | <H>;
       

Score :: team : Team
         won : nat
         drawn : nat
         lost : nat
         points : nat
inv sc == sc.points = 3 * sc.won + sc.drawn;





instance variables
  gps : map GroupName to set of Score :=
        { <A> |-> sc_init ({<Brazil>, <Norway>, <Morocco>, <Scotland>}),
          <B> |-> sc_init ({<Italy>, <Chile>, <Austria>, <Cameroon>}),
          <C> |-> sc_init ({<France>, <Denmark>, <SouthAfrica>,<SaudiArabia>}),
          <D> |-> sc_init ({ <Nigeria>, <Paraguay>, <Spain>, <Bulgaria>}),
          <E> |-> sc_init ({ <Holland>, <Mexico>, <Belgium>, <SouthKorea>}),
          <F> |-> sc_init ({<Germany>, <Yugoslavia>, <Iran>, <UnitedStates>}),
          <G> |-> sc_init ({<Rumania>, <England>, <Colombia>, <Tunisia>}),
          <H> |-> sc_init ({<Argentina>, <Croatia>, <Jamaica>, <Japan>})};
inv forall gp in set rng gps & 
      (card gp = 4 and
       forall sc in set gp & sc.won + sc.lost + sc.drawn <= 3)

functions

sc_init : set of Team -> set of Score
sc_init (ts) ==
  { mk_Score (t,0,0,0,0) | t in set ts };

clear_winner : set of Score -> bool
clear_winner (scs) ==
  exists sc in set scs & 
    forall sc' in set scs \ {sc} & sc.points > sc'.points;

winner_by_more_wins : set of Score -> bool
winner_by_more_wins (scs) ==
  exists sc in set scs &
    forall sc' in set scs \ {sc} &
      (sc.points > sc'.points) or
      (sc.points = sc'.points and sc.won > sc'.won)



operations

public Win : Team * Team ==> ()
Win (wt,lt) ==
  let gp in set dom gps be st {wt,lt} subset {sc.team | sc in set gps(gp)}
  in gps := gps ++ { gp |-> 
                         { if sc.team = wt
                           then mu(sc, won |-> sc.won + 1,
                                       points |-> sc.points + 3)
                           else if sc.team = lt
                           then mu(sc, lost |-> sc.lost + 1)
                           else sc 
                                   | sc in set gps(gp)}}
pre exists gp in set dom gps & {wt,lt} subset {sc.team | sc in set gps(gp)};

Win2 (wt,lt: Team)
ext wr gps : map GroupName to set of Score
pre exists gp in set dom gps & 
        {wt,lt} subset {sc.team | sc in set gps(gp)}
post exists gp in set dom gps &
       {wt,lt} subset {sc.team | sc in set gps(gp)}
       and gps = gps~ ++ 
                     { gp |-> 
                       {if sc.team = wt
                        then mu(sc, won |-> sc.won + 1,
                                    points |-> sc.points + 3)
                        else if sc.team = lt
                        then mu(sc, lost |-> sc.lost + 1)
                        else sc 
                   | sc in set gps(gp)}};

GroupWinner (gp:GroupName) t:Team
ext rd gps : map GroupName to set of Score
pre gp in set dom gps
post t in set {sc.team | sc in set gps(gp)} and
     let sct = iota sc in set gps(gp) & sc.team = t 
     in 
       forall sc in set gps(gp) &
         sc.team <> t => sct.points > sc.points or
                         sct.points = sc.points and sct.won > sc.won;

GroupRunnerUp (gp:GroupName) t:Team
ext rd gps : map GroupName to set of Score
pre gp in set dom gps
post let sc' in set gps(gp) be st
       true --post_GroupWinner(gp,sc'.team,gps,gps)
     in t in set {sc.team | sc in set gps(gp) \ {sc'}} and
        let sct = iota sc in set gps(gp) \ {sc'} & sc.team = t
        in forall sc in set gps(gp) \ {sc'} &
         sc.team <> t => sct.points > sc.points or
                         sct.points = sc.points and sct.won > sc.won;

-- let stmt - lots of examples presumably
GroupWinner_expl : GroupName ==> Team
GroupWinner_expl (gp) ==
  let sc in set gps(gp) be st
     forall sc' in set gps(gp) \ {sc} & 
        (sc.points > sc'.points) or
        (sc.points = sc'.points and sc.won > sc'.won)
  in return sc.team
pre gp in set dom gps;

GroupRunnerUp_expl : GroupName ==> Team
GroupRunnerUp_expl (gp) ==
  def t = GroupWinner(gp)
  in let sct = iota sc in set gps(gp) & sc.team = t
     in 
       let sc in set gps(gp) \ {sct} be st
         forall sc' in set gps(gp) \ {sc,sct} & 
           (sc.points > sc'.points) or
           (sc.points = sc'.points and sc.won > sc'.won)
       in return sc.team
pre gp in set dom gps;

-- def stmt
SecondRound_expl : () ==> seq of (Team * Team)
SecondRound_expl () ==
  def winners = { gp |-> GroupWinner_expl(gp) | gp in set dom gps };
      runners_up = { gp |-> GroupRunnerUp_expl(gp) | gp in set dom gps}
  in return ([mk_(winners(secondRoundWinners(i)),
                  runners_up(secondRoundRunnersUp(i))) | i in set {1,...,8}]);


-- assignment to state designator
--  c.f. earlier version of Win
Win_sd : Team * Team ==> ()
Win_sd (wt,lt) ==
  let gp in set dom gps be st {wt,lt} subset {sc.team | sc in set gps(gp)}
  in gps(gp) := { if sc.team = wt
                  then mu(sc, won |-> sc.won + 1,
                              points |-> sc.points + 3)
                  else if sc.team = lt
                  then mu(sc, lost |-> sc.lost + 1)
                  else sc 
                      | sc in set gps(gp)}
pre exists gp in set dom gps & {wt,lt} subset {sc.team | sc in set gps(gp)};


-- conditional statements

GroupWinner_if : GroupName ==> Team
GroupWinner_if (gp) ==
  if clear_winner(gps(gp))
  then return ((iota sc in set gps(gp) &
                 forall sc' in set gps(gp) \ {sc} &
                   sc.points > sc'.points).team)
  else if winner_by_more_wins(gps(gp))
       then return ((iota sc in set gps(gp) &
                 forall sc' in set gps(gp) \ {sc} &
                   (sc.points > sc'.points) or
                   (sc.points = sc'.points and sc.won > sc'.won)).team)
  else RandomElement ( {sc.team | sc in set gps(gp) &
                         forall sc' in set gps(gp) &
                          sc'.points <= sc.points} )
pre gp in set dom gps;

RandomElement : set of Team ==> Team
RandomElement (ts) ==
  (dcl t:Team := let t' in set ts in t';
   return (t));

public GroupWinner_cases : GroupName ==> Team
GroupWinner_cases (gp) ==
  cases true:
    (clear_winner(gps(gp))) -> 
         return ((iota sc in set gps(gp) &
                   forall sc' in set gps(gp) \ {sc} &
                    sc.points > sc'.points).team),

    (winner_by_more_wins(gps(gp))) ->
         return ((iota sc in set gps(gp) &
                   forall sc' in set gps(gp) \ {sc} &
                     (sc.points > sc'.points) or
                     (sc.points = sc'.points and sc.won > sc'.won)).team),

    others -> RandomElement ( {sc.team | sc in set gps(gp) &
                                forall sc' in set gps(gp) &
                                 sc'.points <= sc.points} )
  end
pre gp in set dom gps;

-- for loops
GroupWinners: () ==> set of Team
GroupWinners () ==
  (dcl winners : set of Team := {};
   for all gp in set dom gps do
     (dcl winner: Team := GroupWinner(gp);
      winners := winners union {winner}
     );
   return winners
   );

end GroupPhase
class UseGP

instance variables

  gp : GroupPhase := new GroupPhase()

traces

    InitBeforePlay : 
    let t1 in set {<Brazil>, <Norway>, <Morocco>, <Scotland>}
    in
      let t2 in set {<Brazil>, <Norway>, <Morocco>, <Scotland>} \ {t1}
      in
        let t3 in set {<Brazil>, <Norway>, <Morocco>, <Scotland>} \ {t1,t2}
        in
          let t4 in set {<Brazil>, <Norway>, <Morocco>, <Scotland>} \ {t1,t2,t3}
          in
            (gp.Win(t1,t2);gp.Win(t1,t3);gp.Win(t1,t4);gp.Win(t2,t3);
             gp.Win(t2,t4);gp.Win(t3,t4);gp.GroupWinner_cases(<A>)
            )
            

end UseGP
~~~
{% endraw %}

