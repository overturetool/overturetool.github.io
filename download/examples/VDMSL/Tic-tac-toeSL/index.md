---
layout: default
title: Tic-tac-toeSL
---

## Tic-tac-toeSL
Author: Nick Battle


A standard Tic-tac-toe game


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### XOTests.vdmsl

{% raw %}
~~~
--
-- A simple model of a tic-tac-toe game (noughts and crosses)
--

module XOTests
imports from XO
	operations
		play
	types
		Pos renamed Pos;
		PlayOrder renamed PlayOrder;
		Moves renamed Moves;
		Player renamed Player
	values
		SIZE renamed SIZE
		
exports all
definitions

-- Test data and supporting operations/traces

values
	OX = [<NOUGHT>, <CROSS>];
	XO = [<CROSS>, <NOUGHT>];
	XX = [<CROSS>];

	T1 = [mk_Pos(1,1), mk_Pos(1,2), mk_Pos(2,1), mk_Pos(1,3), mk_Pos(3,1)];
	T2 = [mk_Pos(1,1), mk_Pos(1,2), mk_Pos(1,3), mk_Pos(2,2), mk_Pos(3,1), mk_Pos(3,2)];
	E1 = [mk_Pos(1,1), mk_Pos(1,1), mk_Pos(1,2), mk_Pos(2,1), mk_Pos(1,3)];
	
	S = {1, ..., SIZE}

operations
	test: PlayOrder * Moves ==> Player | <DRAW> | <UNFINISHED>
	test(playorder, moves) ==
		XO`play(playorder, moves);

traces
	ALL:
		let ALLPOS = { mk_Pos(r, c) | r, c in set S } in			-- All 3x3 = 9 positions
		let m1 in set ALLPOS in										-- 9 1st moves
		let m2 in set ALLPOS \ {m1} in								-- 72 1st-2nd pairs
		let m3 in set ALLPOS \ {m1, m2} in							-- 504 1st-2nd-3rd etc...
		let m4 in set ALLPOS \ {m1, m2, m3} in						-- 3024
		let m5 in set ALLPOS \ {m1, m2, m3, m4} in					-- 15120 (minimum)
--		let m6 in set ALLPOS \ {m1, m2, m3, m4, m5} in				-- 60480
--		let m7 in set ALLPOS \ {m1, m2, m3, m4, m5, m6} in			-- 181440
--		let m8 in set ALLPOS \ {m1, m2, m3, m4, m5, m6, m7} in		-- 362880
--		let m9 in set ALLPOS \ {m1, m2, m3, m4, m5, m6, m7, m8} in	-- 362880
			XO`play(XO, [m1, m2, m3, m4, m5]);

end XOTests
~~~
{% endraw %}

### XO.vdmsl

{% raw %}
~~~
--
-- A simple model of a tic-tac-toe game (noughts and crosses)
--

module XO
exports all
definitions
values
	SIZE:nat1	= 3;						-- The size of the board (3x3)
	MAX:nat1	= SIZE * SIZE;				-- The maximum number of moves

types
	Player = <NOUGHT> | <CROSS>;			-- Just two players

	Pos ::									-- A position for a move
		row : nat1
		col : nat1
	inv p ==
		p.row <= SIZE and p.col <= SIZE;	-- Row/col must be on the board

	Game = map Pos to Player				-- A game (who has moved where)
	inv g ==
		forall p1, p2 : Player &			-- No player is ever more than one move ahead
			card dom (g :> {p1}) - card dom (g :> {p2}) in set {-1, 0, 1}


values
	S:set of nat1 = {1, ..., SIZE};

	winningLines = dunion			-- Sets of Pos for winning lines
	{
		{{ mk_Pos(r, c)			| c in set S } | r in set S },	-- All rows
		{{ mk_Pos(r, c)			| r in set S } | c in set S },	-- All columns
		{{ mk_Pos(x, x)			| x in set S }},				-- Diagnonal
		{{ mk_Pos(x, SIZE-x+1)	| x in set S }}					-- Other diagonal
	};


functions
	hasWon: Game * Player -> bool
	hasWon(g, p) ==
		let moves = movesForPlayer(g, p) in
			exists line in set winningLines &
				line subset moves;


	whoWon: Game -> Player
	whoWon(g) ==
		iota p:Player & hasWon(g, p)
	pre isWon(g);


	isWon: Game -> bool
	isWon(g) ==
		exists1 p:Player & hasWon(g, p);


	isDraw: Game -> bool
	isDraw(g) ==
		not isWon(g) and moveCountLeft(g) = 0;


	isUnfinished: Game -> bool
	isUnfinished(g) ==
		not isWon(g) and not isDraw(g);


	movesSoFar: Game -> set of Pos
	movesSoFar(g) ==
		dom g;


	moveCountSoFar: Game -> nat
	moveCountSoFar(g) ==
		card movesSoFar(g);


	moveCountLeft: Game -> nat
	moveCountLeft(g) ==
		MAX - moveCountSoFar(g);


	movesForPlayer: Game * Player -> set of Pos
	movesForPlayer(g, p) ==
		dom (g :> {p});


values
	PLAYERS	= { p | p:Player };		-- The set of all Players

types
	Moves = seq of Pos				-- A legal game play sequence
	inv moves ==
		len moves = card elems moves and			-- Has no duplicated moves
		len moves > card PLAYERS * (SIZE - 1) and	-- Has minimum moves to win 
		len moves <= MAX;							-- Hasn't too many moves

	PlayOrder = seq1 of Player				-- The order of play of the players
	inv order ==
		len order = card elems order and	-- No duplicates in the list
		elems order = PLAYERS				-- Order contains all players


state Sigma of
	game : Game		-- The game board, initialized by the play operation
end


operations
	move: Player * Pos ==> ()
	move(p, pos) ==
		game(pos) := p
	pre pos not in set movesSoFar(game) and
		moveCountLeft(game) > 0
	post game = game~ munion {pos |-> p} and
		 moveCountSoFar(game) = moveCountSoFar(game~) + 1;


	play: PlayOrder * Moves ==> Player | <DRAW> | <UNFINISHED>
	play(playorder, moves) ==
	(
		dcl order:PlayOrder := playorder;	-- hd order is always next to play
		game := {|->};

		for m in moves do
			let player = hd order in
			(
				move(player, m);

				if isWon(game) then
					return whoWon(game)
				elseif isDraw(game) then
					return <DRAW>
				else
					order := tl order ^ [player]
			);

		return <UNFINISHED>
	)
	post if RESULT = <DRAW> then isDraw(game)
		 else if RESULT = <UNFINISHED> then isUnfinished(game)
		 else RESULT = whoWon(game);

end XO
~~~
{% endraw %}

