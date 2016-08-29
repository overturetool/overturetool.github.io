---
layout: default
title: stackPP
---

## stackPP
Author: 




| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| n|


### usestack.vdmpp

{% raw %}
~~~
class UseStack
instance variables
  stack : Stack := new Stack();
traces
  TracesStack :
    stack.Reset() ;
    let x in set {2,8} in stack.Push(x){1,4};
    (stack.Push(9) | stack.Pop())

end UseStack
~~~
{% endraw %}

### stack.vdmpp

{% raw %}
~~~
class Stack

  instance variables
    stack : seq of int := [];

  operations

    public
    Reset : () ==> ()
    Reset () ==
      stack := [];

    public
    Pop : () ==> int
    Pop() ==
      def res = hd stack in
        (stack := tl stack;
         return res)
    pre stack <> []
    post stack~ = [RESULT]^stack;

    public Push: int ==> ()
    Push(elem) ==
      stack := stack ^[elem];

    public
    Top : () ==> int
    Top() ==
      return (hd stack);

end Stack
~~~
{% endraw %}

