---
layout: default
title: ConwayGameLifeSL
---

## ConwayGameLifeSL
Author: Nick Battle, Peter Gorm Larsen and Claus Ballegaard Nielsen (animation)


Conway's Game of Life
The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells,
each of which is in one of two possible states, alive or dead. Every cell interacts with its 
eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent.
At each step in time, the following transitions occur:

*   Any live cell with fewer than two live neighbours dies, as if caused by under-population.
*   Any live cell with two or three live neighbours lives on to the next generation.
*   Any live cell with more than three live neighbours dies, as if by overcrowding.
*   Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The initial pattern constitutes the seed of the system. The first generation is created by 
applying the above rules simultaneously to every cell in the seed-births and deaths occur 
simultaneously, and the discrete moment at which this happens is sometimes called a tick 
(in other words, each generation is a pure function of the preceding one). The rules continue 
to be applied repeatedly to create further generations.

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| Conway`periodN(PULSAR,3)|
|Entry point     :| Conway`tests()|
|Entry point     :| Conway`generations(130,DIEHARD)|
|Entry point     :| gui_Graphics`generations_animate(130,DIEHARD)|


### Graphics.vdmsl

{% raw %}
~~~
module gui_Graphics 

imports from Conway all

exports all
definitions

types
	Configuration ::
		gridSide : int
		sleepTime : int
		pop : Conway`Population;

functions
	generations_animate: nat1 * Configuration -> seq of Conway`Population
	generations_animate(n,conf) == 
		let - = initialise(conf.gridSide, conf.sleepTime) 
		 in
		  let patterns =  Conway`generations(n, conf.pop) 
		   in 
		    animate_step(patterns);

	animate_step : seq of Conway`Population -> seq of Conway`Population
	animate_step(pop) ==
		if pop = [] 
		then []
		else
			let - = {newLivingCell(cell.x, cell.y)| cell in set hd pop} 
			 in		
			  let - = newRound() 
			   in
	 		    animate_step(tl pop) 
	measure len pop;
	
  initialise: nat1 * nat1 -> int
  initialise(gridSideCount, sleepTime)== is not yet specified;
    
  newLivingCell:  int * int -> int
  newLivingCell(x,y)== is not yet specified;
    
  newRound: () -> int
  newRound()== is not yet specified;

values
	BLOCK = mk_Configuration(4, 500, Conway`BLOCK);

	BLINKER = mk_Configuration(5, 500, Conway`BLINKER);
	
	TOAD = mk_Configuration(6, 500, Conway`TOAD );
	
	BEACON = mk_Configuration(8, 500, Conway`BEACON);
            
	PULSAR =  mk_Configuration(17, 1000, Conway`PULSAR);
				
  DIEHARD = mk_Configuration(33, 300, Conway`DIEHARD);
      
  GLIDER = mk_Configuration(40, 100, Conway`GLIDER);      
       
  GOSPER_GLIDER_GUN = mk_Configuration(40, 50, Conway`GOSPER_GLIDER_GUN);

end gui_Graphics
~~~
{% endraw %}

### Conway.vdmsl

{% raw %}
~~~
/**
 * Conways Game of Life
 *
 * The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells,
 * each of which is in one of two possible states, alive or dead. Every cell interacts with its 
 * eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent.
 * At each step in time, the following transitions occur:
 *
 *   Any live cell with fewer than two live neighbours dies, as if caused by under-population.
 *   Any live cell with two or three live neighbours lives on to the next generation.
 *   Any live cell with more than three live neighbours dies, as if by overcrowding.
 *   Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 *
 * The initial pattern constitutes the seed of the system. The first generation is created by 
 * applying the above rules simultaneously to every cell in the seed-births and deaths occur 
 * simultaneously, and the discrete moment at which this happens is sometimes called a tick 
 * (in other words, each generation is a pure function of the preceding one). The rules continue 
 * to be applied repeatedly to create further generations.
 *
 * Modelled in VDM-SL by Nick Battle and Peter Gorm Larsen and animation made by 
 * Claus Ballegaard Nielsen
 */

module Conway 
exports all

definitions

values
	GENERATE	= 3;		-- Number of neighbours to cause generation
	SURVIVE		= {2, 3};	-- Numbers of neighbours to ensure survival, else death
	
types
	Point ::				-- Plain is indexed by integers
		x : int
		y : int;
		
	Population = set of Point;
	
	
functions
	-- Generate the Points around a given Point
	around: Point -> set of Point
	around(p) ==
		{ mk_Point(p.x + x, p.y + y) | x, y in set { -1, 0, +1 }
			& x <> 0 or y <> 0 }
	post card RESULT < 9;
	
	-- Count the number of live cells around a given point 
	neighbourCount: Population * Point -> nat
	neighbourCount(pop, p) ==
		card { q | q in set around(p) & q in set pop }
	post RESULT < 9;

	-- Generate the set of empty cells that will become live
	newCells: Population -> set of Point
	newCells(pop) ==
		dunion
		{
			{ q | q in set around(p)
				  & q not in set pop and neighbourCount(pop, q) = GENERATE }		
			| p in set pop
		}
	post RESULT inter pop = {};		-- None currently live
		
	-- Generate the set of cells to die
	deadCells: Population -> set of Point
	deadCells(pop) ==
		{ p | p in set pop
			& neighbourCount(pop, p) not in set SURVIVE }
	post RESULT inter pop = RESULT;	-- All currently live
	
	-- Perform one generation
	generation: Population -> Population
	generation(pop) ==
		(pop \ deadCells(pop)) union newCells(pop);

	-- Generate a sequence of N generations 
	generations: nat1 * Population -> seq of Population
	generations(n,pop) ==
		let new_p = generation(pop)
		in
			if n = 1
			then [new_p] 
			else [new_p] ^ generations(n-1,new_p)
	measure n;
    
    -- Generate an offset of a Population (for testing gliders)
	offset: Population * int * int -> Population
	offset(pop, dx, dy) ==
		{ mk_Point(x + dx, y + dy) | mk_Point(x, y) in set pop };
		
	-- Test whether two Populations are within an offset of each other
	isOffset: Population * Population * nat1 -> bool
	isOffset(pop1, pop2, max) ==
		exists dx, dy in set {-max, ..., max}
			& (dx <> 0 or dy <> 0) and offset(pop1, dx, dy) = pop2;
			
	-- Test whether a game is N-periodic
	periodN: Population * nat1 -> bool
	periodN(pop, n) == (generation ** n)(pop) = pop;

	-- Test whether a game disappears after N generations
	disappearN: Population * nat1 -> bool
	disappearN(pop, n) ==
		(generation ** n)(pop) = {};
 
	-- Test whether a game is N-gliding within max cells
	gliderN: Population * nat1 * nat1 -> bool
	gliderN(pop, n, max) ==
		isOffset(pop, (generation ** n)(pop), max);
		
 	-- Versions of the three tests that check that N is the least value
	periodNP: Population * nat1 -> bool
	periodNP(pop, n) ==
		{ a | a in set {1, ..., n} & periodN(pop, a) } = {n};

	disappearNP: Population * nat1 -> bool
	disappearNP(pop, n) ==
		{ a | a in set {1, ..., n} & disappearN(pop, a) } = {n};
		
	gliderNP: Population * nat1 * nat1 -> bool
	gliderNP(pop, n, max) ==
		{ a | a in set {1, ..., n} & gliderN(pop, a, max) } = {n};
 
	
-- Test games from http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
values
	BLOCK = { mk_Point(0,0), mk_Point(-1,0), mk_Point(0,-1), mk_Point(-1,-1)};

	BLINKER = { mk_Point(-1,0), mk_Point(0,0), mk_Point(1,0) };
	
	TOAD = BLINKER union { mk_Point(0,-1), mk_Point(-1,-1), mk_Point(-2,-1) };
	
	BEACON = { mk_Point(-2,0), mk_Point(-2,1), mk_Point(-1,1), mk_Point(0,-2),  
	           mk_Point(1,-2), mk_Point(1,-1 )};
            
	PULSAR = let quadrant = { mk_Point(2,1), mk_Point(3,1), mk_Point(3,2),
                           mk_Point(1,2), mk_Point(1,3), mk_Point(2,3),
                           mk_Point(5,2), mk_Point(5,3), mk_Point(6,3), mk_Point(7,3),
                           mk_Point(2,5), mk_Point(3,5), mk_Point(3,6), mk_Point(3,7) }
			in
				quadrant union
				{ mk_Point(-x, y)| mk_Point(x, y) in set quadrant } union
				{ mk_Point(x, -y)| mk_Point(x, y) in set quadrant } union
				{ mk_Point(-x, -y)| mk_Point(x, y) in set quadrant };
				
  DIEHARD = {mk_Point(0,1),mk_Point(1,1),mk_Point(1,0),
             mk_Point(0,5),mk_Point(0,6),mk_Point(0,7),mk_Point(2,6)};
      
  GLIDER = { mk_Point(1,0), mk_Point(2,0), mk_Point(3,0), mk_Point(3,1), mk_Point(2,2) };      
       
  GOSPER_GLIDER_GUN = { mk_Point(2,0), mk_Point(2,1), mk_Point(2,2), mk_Point(3,0), mk_Point(3,1),
        mk_Point(3,2), mk_Point(4,-1), mk_Point(4,3), mk_Point(6,-2), mk_Point(6,-1),
        mk_Point(6,3), mk_Point(6,4), mk_Point(16,1), mk_Point(16,2), mk_Point(17,1),
        mk_Point(17,2), mk_Point(-1,-1), mk_Point(-2,-2), mk_Point(-2,-1), mk_Point(-2,0),
        mk_Point(-3,-3), mk_Point(-3,1), mk_Point(-4,-1), mk_Point(-5,-4), mk_Point(-5,2),
        mk_Point(-6,-4), mk_Point(-6,2), mk_Point(-7,-3), mk_Point(-7,1), mk_Point(-8,-2),
        mk_Point(-8,-1), mk_Point(-8,0), mk_Point(-17,-1), mk_Point(-17,0), mk_Point(-18,-1),
        mk_Point(-18,0)};
        
functions
	tests: () -> seq of bool
	tests() ==
	[
		periodNP(BLOCK,	1),	-- ie. constant
		periodNP(BLINKER,2),
		periodNP(TOAD,	2),
		periodNP(BEACON, 2),
		periodNP(PULSAR, 3),
		gliderNP(GLIDER, 4, 1),
		disappearNP(DIEHARD, 130)
	];
	          
             
end Conway
    
~~~
{% endraw %}

