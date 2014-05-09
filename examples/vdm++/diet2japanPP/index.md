---
layout: default
title: diet2japan
---

~~~
This example is made by Shin Sahara as a test of local higher orderfunctions defined inside explicit function definitions in order totest the correct interpretation of these constructs.#******************************************************#  AUTOMATED TEST SETTINGS#------------------------------------------------------#AUTHOR= Shin Sahara#LANGUAGE_VERSION=classic#INV_CHECKS=true#POST_CHECKS=true#PRE_CHECKS=true#DYNAMIC_TYPE_CHECKS=true#SUPPRESS_WARNINGS=false#ENTRY_POINT=Diet`BMI(100,200)#ENTRY_POINT= Diet`getWeightFromBMI(55,76)#EXPECTED_RESULT=NO_ERROR_TYPE_CHECK#******************************************************
~~~
###Diet.vdmpp

{% raw %}
~~~

class Diet
valuespublic	e = 1E-10;public	h = 1e-5;	
functionsstatic public BMI : real* real -> realBMI(weight, height) ==	let	h100 = height / 100	in	weight / h100 ** 2pre	weight > 0 and height > 0post	RESULT > 0;
static public getWeightFromBMI : real * real -> realgetWeightFromBMI(height, aBMI) ==	let			f = lambda weight : real & aBMI - BMI(weight, height) 	in	newton(f)(60)pre	height > 0 and aBMI > 0post	abs(aBMI - BMI(RESULT, height)) <= e;
static public newton: (real ->real) -> real -> realnewton(f)(x) ==	let	isFinish = lambda y : real & abs(f(y)) < e,		nextApproximate = lambda y : real & y - (f(y) / derivative(f)(y))	in	Funtil[real](isFinish)(nextApproximate)(x);
static public derivative : (real -> real) ->real -> realderivative(f)(x) == (f(x+h) - f(x)) / h ;
static public Funtil[@T] : (@T -> bool) -> (@T -> @T) -> @T -> @TFuntil(p)(f)(x) == if p(x) then x else Funtil[@T](p)(f)(f(x));
end Diet

~~~{% endraw %}

