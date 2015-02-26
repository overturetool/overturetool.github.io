---
layout: default
title: sortPPPP
---

## sortPPPP
Author: Peter Gorm Larsen


This VDM++ model is made by Peter Gorm Larsen in 2010 based on the original 
VDM++ model created many years ago at IFAD.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new SortMachine().GoSorting([4,2,5,6,4,42,1,1,99,5])|


### dosort.vdmpp

{% raw %}
~~~
                                
class DoSort is subclass of Sorter

operations

  public Sort: seq of int ==> seq of int
  Sort(l) ==
    return DoSorting(l)
 
functions

  DoSorting: seq of int -> seq of int
  DoSorting(l) ==
    if l = [] then
      []
    else
      let sorted = DoSorting (tl l) in
        InsertSorted (hd l, sorted)
  measure Len;

  InsertSorted: int * seq of int -> seq of int
  InsertSorted(i,l) ==
    cases true :
      (l = [])    -> [i],
      (i <= hd l) -> [i] ^ l,
      others      -> [hd l] ^ InsertSorted(i,tl l)
    end
  measure Len;

  Len: seq of int -> nat
  Len(list) ==
    len list;

  Len: int * seq of int -> nat
  Len(-,list) ==
    len list

end DoSort 
                
~~~
{% endraw %}

### implsort.vdmpp

{% raw %}
~~~
                                                                                                                                    
class ImplSort is subclass of Sorter

operations

  public Sort: seq of int ==> seq of int
  Sort(l) ==
    return ImplSorter(l);

functions

  public ImplSorter(l: seq of int) r: seq of int
  post IsPermutation(r,l) and IsOrdered(r);

  IsPermutation: seq of int * seq of int -> bool
  IsPermutation(l1,l2) ==    
    forall e in set (elems l1 union elems l2) &
      card {i | i in set inds l1 & l1(i) = e} =
      card {i | i in set inds l2 & l2(i) = e};

  IsOrdered: seq of int -> bool
  IsOrdered(l) ==
    forall i,j in set inds l & i > j => l(i) >= l(j)

end ImplSort
             
~~~
{% endraw %}

### mergesort.vdmpp

{% raw %}
~~~
                                    
class MergeSort is subclass of Sorter

operations

  public Sort: seq of int ==> seq of int
  Sort(l) ==
    return MergeSorter(l)

functions

  MergeSorter: seq of real -> seq of real
  MergeSorter(l) ==
    cases l:
      []      -> l,
      [e]     -> l,
      others  -> let l1^l2 in set {l} be st abs (len l1 - len l2) < 2
                 in
                   let l_l = MergeSorter(l1),
                       l_r = MergeSorter(l2) in
                    Merge(l_l, l_r)
    end
  measure Len;

  Len: seq of real -> nat
  Len(list) ==
    len list;
                                                                                                                                                                                                                                                                                                                       
  Merge: seq of int * seq of int -> seq of int
  Merge(l1,l2) ==
    cases mk_(l1,l2):
      mk_([],l),mk_(l,[]) -> l,
      others              -> if hd l1 <= hd l2 then 
                               [hd l1] ^ Merge(tl l1, l2)
                             else
                               [hd l2] ^ Merge(l1, tl l2)
    end
  pre forall i in set inds l1 & l1(i) >= 0 and
      forall i in set inds l2 & l2(i) >= 0
  measure Len;

  Len: seq of int * seq of int -> nat
  Len(list1,list2) ==
    len list1 + len list2;

end MergeSort

             
~~~
{% endraw %}

### explsort.vdmpp

{% raw %}
~~~
                                                                                                                           
class ExplSort is subclass of Sorter

operations

  public Sort: seq of int ==> seq of int
  Sort(l) ==
    let r in set Permutations(l) be st IsOrdered(r) in 
    return r

functions

  Permutations: seq of int -> set of seq of int
  Permutations(l) ==
    cases l:
      [],[-] -> {l},
      others -> dunion {{[l(i)]^j | 
                         j in set Permutations(RestSeq(l,i))} | 
                         i in set inds l}
    end
  measure Len;

  RestSeq: seq of int * nat -> seq of int
  RestSeq(l,i) ==
    [l(j) | j in set (inds l \ {i})]
  pre i in set inds l
  post elems RESULT subset elems l and
       len RESULT = len l - 1;

  IsOrdered: seq of int -> bool
  IsOrdered(l) ==
    forall i,j in set inds l & i > j => l(i) >= l(j);

  Len: seq of int -> nat
  Len(list) ==
    len list

end ExplSort
             
~~~
{% endraw %}

### sorter.vdmpp

{% raw %}
~~~
                                      
class Sorter
 
operations

  public
  Sort: seq of int ==> seq of int 
  Sort(arg) ==
    is subclass responsibility

end Sorter
               
~~~
{% endraw %}

### sortmachine.vdmpp

{% raw %}
~~~
                                       

class SortMachine

instance variables
  srt: Sorter := new MergeSort();

                                                                                                                                                                                                                           

operations

  public SetSort: Sorter ==> ()
  SetSort(s) ==
    srt := s;
                                                                                   
  public GoSorting: seq of int ==> seq of int  
  GoSorting(arr) ==
    return srt.Sort(arr);
                                                                                         
  public SetAndSort: Sorter * seq of int ==> seq of int
  SetAndSort(s, arr) ==
  ( srt := s;
    return srt.Sort(arr)
  )

traces

  DiffSorting: let srt in set {new DoSort(),new ExplSort(),new ImplSort(),
                               new MergeSort()}
              in
                 SetAndSort(srt,[3,1,66,11,5,3,99])

end SortMachine

             
~~~
{% endraw %}

