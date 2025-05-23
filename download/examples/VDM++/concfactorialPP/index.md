---
layout: default
title: concfactorialPP
---

## concfactorialPP
Author: Nick Battle



This example is made by Nick Battle and it illustrates how one can 
perform the traditional factorial functionality using the concurrency
primitives in VDM++.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new Factorial().factorial(20)|


### concfactorial.vdmpp

{% raw %}
~~~
class Factorial
instance variables
	result : nat := 5;
	
operations
	public factorial : nat ==> nat
	factorial(n) ==
		if n = 0 then return 1
		else (
			dcl m : Multiplier;
			m := new Multiplier();
			m.calculate(1,n);
			start(m);
			result:= m.giveResult();
			return result
		)
		
end Factorial

class Multiplier
instance variables
	i : nat1;
	j : nat1;
	k : nat1;
	result : nat1
	
operations
	public calculate : nat1 * nat1 ==> ()
	calculate (first, last) ==
		(i := first; j := last);
		
	doit : () ==> ()
	doit() ==
	(
		if i = j then result := i
		else (
			dcl p : Multiplier;
			dcl q : Multiplier;
			p := new Multiplier();
			q := new Multiplier();
			start(p);start(q);
			k := (i + j) div 2;
			-- division with rounding down
			p.calculate(i,k);
			q.calculate(k+1,j);
			result := p.giveResult() * q.giveResult ()
		)
	);
	
	public giveResult : () ==> nat1
	giveResult() ==
		return result;
		
sync
	-- cyclic constraints allowing only the
	-- sequence calculate; doit; giveResult
	
	per doit => #fin (calculate) > #act(doit);
	per giveResult => #fin (doit) > #act (giveResult);
	per calculate => #fin (giveResult) = #act (calculate)
	
thread
	doit(); 
	
end Multiplier
~~~
{% endraw %}

