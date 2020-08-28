---
layout: default
title: treePP
---

## treePP
Author: 



This VDM++ model contains basic classes for defining 
and traversing over abstract threes and queues.
 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### usetree.vdmpp

{% raw %}
~~~
class UseTree

instance variables

  t1 : BinarySearchTree := new BinarySearchTree();
  t2 : Tree := new BinarySearchTree()

traces

  insertion_BST : 
    (let n in set {1,...,5} in
       t1.Insert(n)
    ){2};  (t1.breadth_first_search() | 
            t1.depth_first_search() |
            t1.inorder () |
            t1.isEmpty()
           )

end UseTree
~~~
{% endraw %}

### tree.vdmpp

{% raw %}
~~~

class Tree

  types

    public
    tree = <Empty> | node;
    
    public
    node :: lt: Tree
            nval : int
            rt : Tree

  instance variables
    protected root: tree := <Empty>;



  operations

    pure protected
    nodes : () ==> set of node
    nodes () ==
      cases root:
        <Empty> -> return ({}),
        mk_node(lt,v,rt) -> return(lt.nodes() union rt.nodes()),
        others -> error
      end ;

    protected
    addRoot : int ==> ()
    addRoot (x) ==
      root := mk_node(new Tree(),x,new Tree());

    protected
    rootval : () ==> int
    rootval () == return root.nval
    pre root <> <Empty>;

    pure protected
    gettree : () ==> tree
    gettree () == return root;

    protected
    leftBranch : () ==> Tree
    leftBranch () == return root.lt
    pre not isEmpty();

    protected
    rightBranch : () ==> Tree
    rightBranch () == return root.rt
    pre not isEmpty();

    pure public
    isEmpty : () ==> bool
    isEmpty () == return (root = <Empty>);

    public
    breadth_first_search : () ==> seq of int 
    breadth_first_search () ==
       if isEmpty()
       then return []
       else 
         (dcl to_visit: Queue := new Queue();
          dcl visited : seq of int := [];

          to_visit.Enqueue(gettree());
  
          while (not to_visit.isEmpty()) do
            def curr_node = to_visit.Dequeue()
            in ( visited := visited^[curr_node.nval];
                 if not curr_node.lt.isEmpty()
                 then to_visit.Enqueue(curr_node.lt.gettree());
                 if not curr_node.lt.isEmpty()
                 then to_visit.Enqueue(curr_node.rt.gettree());
               );
          return (visited));

    public
    depth_first_search : () ==> seq of int
    depth_first_search () ==
      cases root:
         <Empty> -> return [],
         mk_node(lt,v,rt) -> let ln = lt.depth_first_search(),
                                 rn = rt.depth_first_search()
                             in return [v]^ln^rn,
		others -> error                             
      end;

    public inorder : () ==> seq of int
    inorder () ==
      cases root:
        <Empty> -> return [],
        mk_node(lt,v,rt) -> let ln = lt.inorder(),
                                rn = rt.inorder()
                            in return ln^[v]^rn,
		others -> error                            
      end


end Tree
    
~~~
{% endraw %}

### queue.vdmpp

{% raw %}
~~~
class Queue

  instance variables
    vals : seq of Tree`node := [];

  operations

    public
    Enqueue : Tree`node ==> ()
    Enqueue (x) ==
      vals := vals ^ [x];

    public
    Dequeue : () ==> Tree`node
    Dequeue () ==
      def x = hd vals
      in ( vals := tl vals;
           return x)
    pre not isEmpty();

    pure public
    isEmpty : () ==> bool
    isEmpty () == 
      return(vals = [])

end Queue
~~~
{% endraw %}

### avl.vdmpp

{% raw %}
~~~
class AVLTree is subclass of Tree

  functions

  tree_isAVLTree : tree -> bool
  tree_isAVLTree(t) == true

end AVLTree
~~~
{% endraw %}

### bst.vdmpp

{% raw %}
~~~
class BinarySearchTree is subclass of Tree


  functions

    public
    isBst : Tree`tree -> bool
    isBst (t) ==
      cases t:
        <Empty> -> true,
        mk_node(lt,v,rt) -> 
           (forall n in set lt.nodes() & n.nval <= v) and
           (forall n in set rt.nodes() & v <= n.nval) and
           isBst(lt.gettree()) and isBst(rt.gettree())
      end
 
  operations

    BinarySearchTree_inv : () ==> bool
    BinarySearchTree_inv () ==
      return(isBst(root));

    public
    Insert : int ==> ()
    Insert (x) ==
      (dcl curr_node : Tree := self;

       while not curr_node.isEmpty() do
         if curr_node.rootval() < x
         then curr_node := curr_node.rightBranch()
         else curr_node := curr_node.leftBranch();
       curr_node.addRoot(x);
       )

end BinarySearchTree
class BalancedBST is subclass of BinarySearchTree

  values

  v = 1

end BalancedBST
~~~
{% endraw %}

