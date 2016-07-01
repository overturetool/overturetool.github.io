---
layout: default
title: oldcarradioRT
---

## oldcarradioRT
Author: Marcel Verhoef


This was the first model Marcel Verhoef tried to make of the car
radio navigation example using the original version of VICE with
one CPU. This failed and as a consequence Marcel Verhoef and Peter
Gorm Larsen came up with an improved version of VDM-RT with 
multiple CPUs connected with BUSses.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new RadNavSys(1).Run()|
|Entry point     :| new RadNavSys(2).Run()|


### AbstractTask.vdmrt

{% raw %}
~~~
              
class AbstractTask

instance variables
  -- keep the name of the task for easy logging
  name : seq of char := [];

  -- the queue for normal events to be handled by this task
  events : seq of NetworkEvent := [];
  -- the queue of high-priority events to be handled by this task
  interrupts : seq of InterruptEvent := [];

  -- a link to the dispatcher for out-going messages (events)
  dispatcher : EventDispatcher

operations
  public AbstractTask: seq of char * EventDispatcher ==> AbstractTask
  AbstractTask (pnm, ped) == atomic ( name := pnm; dispatcher := ped; );

  pure public getName: () ==> seq of char
  getName () == return name;

  -- setEvent is a call-back used by the EventDispatcher to insert
  -- events into the appropriate event queue of this AbstractTask instance
  public setEvent: Event ==> ()
  setEvent (pe) == 
    if isofclass(NetworkEvent,pe)
    then events := events ^ [pe]
    else interrupts := interrupts ^ [pe];

  -- getEvent is called by the event loop of this AbstractTask instance to 
  -- process incoming events when they are available. note that getEvent 
  -- is blocked by a permission predicate (see sync) when no events are 
  -- available and also note that getEvent gives interrupts priority over 
  -- other events
  protected getEvent: () ==> Event
  getEvent () ==
    if len interrupts > 0
    then ( dcl res: Event := hd interrupts;
           interrupts := tl interrupts;
           return res )
    else ( dcl res: Event := hd events;
           events := tl events;
           return res );

  -- handleEvent shall be overloaded by the derived classes to implement
  -- the actual event loop handling. a typical event loop handler would be
  -- thread while (true) do handleEvent(getEvent())
  --protected handleEvent: Event ==> ()
  --handleEvent (-) == is subclass responsibility;

  -- sendMessage is used to send a message to another task
  -- typically used for inter process communication
  protected sendMessage: seq of char * nat ==> ()
  sendMessage (pnm, pid) == dispatcher.SendNetwork(name, pnm, pid);

  -- raiseInterrupt is used to send a high-priority message
  -- typically used to communicate from environment to the system or vice versa
  protected raiseInterrupt: seq of char * nat ==> ()
  raiseInterrupt (pnm, pid) == dispatcher.SendInterrupt(name, pnm, pid)

sync
  -- setEvent and getEvent are mutually exclusive
  mutex (setEvent, getEvent);
  -- getEvent is blocked until at least one message is available
  per getEvent => len events > 0 or len interrupts > 0

end AbstractTask
             
~~~
{% endraw %}

### AbstractTaskEvent.vdmrt

{% raw %}
~~~
              
class AbstractTaskEvent

instance variables
  abstask : AbstractTask;
  ev : Event

operations
  public AbstractTaskEvent: AbstractTask * Event ==> AbstractTaskEvent
  AbstractTaskEvent (pat, pev) == (abstask := pat; ev := pev);

  public getFields: () ==> AbstractTask * Event
  getFields () == return mk_ (abstask, ev)

end AbstractTaskEvent
             
~~~
{% endraw %}

### BasicTask.vdmrt

{% raw %}
~~~
              
class BasicTask is subclass of AbstractTask

operations
  public BasicTask: seq of char * EventDispatcher ==> BasicTask
  BasicTask (pnm, ped) == AbstractTask(pnm, ped);

protected handleEvent: Event ==> ()
handleEvent (e) == skip;

-- BasicTask just implements the standard event handling loop
-- handleEvent is still left to the responsibility of the subclass of BasicTask
thread
  while (true) do
    handleEvent(getEvent())

end BasicTask
             
~~~
{% endraw %}

### EnvironmentTask.vdmrt

{% raw %}
~~~
              
class EnvironmentTask is subclass of AbstractTask

instance variables
  -- use a unique identifier for each generated event
  static private num : nat := 0;

  -- we limit the number of inserted stimuli
  protected max_stimuli : nat := 0;

  -- administration for the event traces
  -- e2s is used for all out-going stimuli (environment to system)
  -- s2e is used for all received responses (system to environment)
  protected e2s : map nat to nat := {|->};
  protected s2e : map nat to nat := {|->}

functions
  -- checkResponseTimes verifies for each received response whether
  -- or not the elapse time did (not) exceed the user-defined limit
  public checkResponseTimes: map nat to nat * map nat to nat * nat -> bool
  checkResponseTimes (pe2s, ps2e, plim) ==
    forall idx in set dom ps2e &
      ps2e(idx) - pe2s(idx) <= plim
  -- the responses received should also be sent
  pre dom ps2e inter dom pe2s = dom ps2e
  
operations
  public EnvironmentTask: seq of char * EventDispatcher * nat ==>
         EnvironmentTask
  EnvironmentTask (tnm, disp, pno) == 
  ( max_stimuli := pno; AbstractTask(tnm,disp) );

  protected handleEvent: Event ==> ()
  handleEvent (-) == skip;
  
  public getNum: () ==> nat
  getNum () == ( dcl res : nat := num; num := num + 1; return res );

  -- setEvent is overloaded. Incoming messages are immediately handled
  -- by calling handleEvent directly, in stead of added to an input queue.
  public setEvent: Event ==> ()
  setEvent (pe) == handleEvent(pe);

  -- Run shall be overloaded to implement the event generation loop
  -- towards the system. typically, it starts a periodic thread
 public Run: () ==> ()
 Run () == skip;

  -- logEnvToSys is used to register when an event was inserted into
  -- the system. note that the 'time' keyword refers to the internal
  -- simulation wall clock of VDMTools
  public logEnvToSys: nat ==> ()
  logEnvToSys (pev) == e2s := e2s munion {pev |-> time};

  -- logSysToEnv is used to register when an event was received from
  -- the system. note that the 'time' keyword refers to the internal
  -- simulation wall clock of VDMTools
  public logSysToEnv: nat ==> ()
  logSysToEnv (pev) == s2e := s2e munion {pev |-> time};

  -- getMinMaxAverage calculates the minimum, maximum and average
  -- response times that were observed during execution of the model
  -- note that getMinMaxAverage is blocked until the number of
  -- system responses is equal to the number of sent stimuli
  -- termination is ensured because only a maximum number of stimuli
  -- is allowed to be inserted in the system, so eventually all
  -- stimuli can be processed by the system. this method only works
  -- when each stimulus leads to exactly one response, which is the
  -- case in this instance
  public getMinMaxAverage: () ==> nat * nat * real
  getMinMaxAverage () ==
    ( dcl min : [nat] := nil, max : [nat] := nil, diff : nat := 0;
      for all cnt in set dom s2e do
        let dt = s2e(cnt) - e2s(cnt) in
          ( if min = nil then min := dt
            else (if min > dt then min := dt);
            if max = nil then max := dt
            else (if max < dt then max := dt);
            diff := diff + dt );
      return mk_(min, max, diff / card dom s2e) )

sync
  -- getNum is mutually exclusive to ensure unique values
  mutex (getNum);
  mutex(logEnvToSys);
  mutex(logSysToEnv);
  -- getMinMaxAverage is blocked until all responses have been received
  per getMinMaxAverage => card dom s2e = max_stimuli

end EnvironmentTask
             
~~~
{% endraw %}

### Event.vdmrt

{% raw %}
~~~
              
class Event

instance variables
  val : nat

operations
  public Event: nat ==> Event
  Event (pv) == val := pv;

  public getEvent: () ==> nat
  getEvent () == return val

end Event
             
~~~
{% endraw %}

### EventDispatcher.vdmrt

{% raw %}
~~~
              
class EventDispatcher is subclass of Logger

instance variables
  queues : map seq of char to AbstractTask := {|->};
  messages : seq of AbstractTaskEvent := [];
  interrupts: seq of AbstractTaskEvent := []

operations
  -- Register is used to maintain a callback link to all the tasks in the 
  -- system and the environment. the link is used by the SendNetwork and 
  -- SendInterrupt operations and the event loop of the EventDispatcher 
  -- (see thread)
  public Register: AbstractTask ==> ()
  Register (pat) ==
    queues := queues munion { pat.getName() |-> pat }
    pre pat.getName() not in set dom queues;

  -- setEvent is used to maintain temporary queues for the event loop of
  -- EventDispatcher. it is called by the SendNetwork and SendInterrupt 
  -- operations which are in turn called from the other tasks in the 
  -- system and the environment.
  setEvent: AbstractTask * Event ==> ()
  setEvent (pat, pe) == 
    if isofclass(NetworkEvent,pe)
    then messages := messages ^ [new AbstractTaskEvent(pat,pe)]
    else interrupts := interrupts ^ [new AbstractTaskEvent(pat,pe)];

  -- getEvent is used to retrieve events from the temporary event 
  -- queues if they are available. otherwise getEvent is blocked 
  -- (see sync) which will also block the event handler of 
  -- EventDispatcher
  getEvent: () ==> AbstractTask * Event
  getEvent () ==
    if len interrupts > 0
    then ( dcl res : AbstractTaskEvent := hd interrupts;
           interrupts := tl interrupts;
           return res.getFields() )
    else ( dcl res : AbstractTaskEvent := hd messages;
           messages := tl messages;
           return res.getFields() );

  -- SendNetwork is typically called by a system or an environment
  -- task. The event is logged for post analysis and it is added
  -- to the temporary event queue for handling by the event loop
  public SendNetwork: seq of char * seq of char * nat ==> ()
  SendNetwork (psrc, pdest, pid) ==
    duration (0)
      ( dcl pbt: AbstractTask := queues(pdest);
        printNetworkEvent(psrc, pdest, pid);
        setEvent(pbt, new NetworkEvent(pid)) )
    pre pdest in set dom queues;

  -- SendInterrupt is typically called by a system or an environment
  -- task. The event is logged for post analysis and it is added
  -- to the temporary event queue for handling by the event loop
  public SendInterrupt: seq of char * seq of char * nat ==> ()
  SendInterrupt (psrc, pdest, pid) ==
    duration (0)
      ( dcl pbt: AbstractTask := queues(pdest);
        printInterruptEvent(psrc, pdest, pid);
        setEvent(pbt, new InterruptEvent(pid)) )
    pre pdest in set dom queues;

-- the event handler of EventDispatcher. note that we can simulate the overhead
-- of the operating system, which is typically also running on our system,
-- by changing the duration below. note that the while loop is blocked (and
-- this thread will be suspended) if there are no events in either queue
thread
  duration (0)
    while (true) do
      def mk_ (pat,pe) = getEvent() in
        pat.setEvent(pe)

sync
  -- setEvent and getEvent are mutually exclusive
  mutex(setEvent, getEvent);
  -- the thread shall be blocked until there is at least one message available
  per getEvent => len messages > 0 or len interrupts > 0

end EventDispatcher
             
~~~
{% endraw %}

### InsertAddress.vdmrt

{% raw %}
~~~
              
class InsertAddress is subclass of EnvironmentTask

operations
  public InsertAddress: EventDispatcher * nat ==> InsertAddress
  InsertAddress (ped, pno) == EnvironmentTask("InsertAddress", ped, pno);

  -- handleEvent receives the responses from the system
  -- and checks whether the response time for the matching
  -- stimulus was less than or equal to 2000 time units
  protected handleEvent: Event ==> ()
  handleEvent (pev) == duration (0) logSysToEnv(pev.getEvent());
 -- post checkResponseTimes(e2s,s2e,6000);

  -- createSignal generates the stimuli for the system
  createSignal: () ==> ()
  createSignal () ==
    duration (0)
      if (card dom e2s < max_stimuli) then
        ( dcl num : nat := getNum();
          logEnvToSys(num);
          raiseInterrupt("HandleKeyPress", num) );

  -- start the thread of the task
  public Run: () ==> ()
  Run () == start(self)

thread
  periodic (1000,0,0,0) (createSignal)
  
end InsertAddress
             
~~~
{% endraw %}

### InterruptEvent.vdmrt

{% raw %}
~~~
              
class InterruptEvent is subclass of Event

operations
  public InterruptEvent: nat ==> InterruptEvent
  InterruptEvent (pne) == Event(pne)

end InterruptEvent
             
~~~
{% endraw %}

### Logger.vdmrt

{% raw %}
~~~
              
class Logger

instance variables
  -- using the VDMTools standard IO library to create a trace file
  static io : IO := new IO();
  static mode : <start> | <append> := <start>

operations
  -- printNetworkEvent writes a time trace to the file mytrace.txt
  -- this file can be used for application specific post analysis
  public printNetworkEvent: seq of char * seq of char * nat ==> ()
  printNetworkEvent (psrc, pdest, pid) ==
    def - = io.fwriteval[seq of (seq of char | nat)]
      ("mytrace.txt", ["network", psrc, pdest, pid, time], mode)
      in mode := <append>;
 
  -- printInterruptEvent writes a time trace to the file mytrace.txt
  -- this file can be used for application specific post analysis
  public printInterruptEvent: seq of char * seq of char * nat ==> ()
  printInterruptEvent (psrc, pdest, pid) ==
    def - = io.fwriteval[seq of (seq of char | nat)]
      ("mytrace.txt", ["interrupt", psrc, pdest, pid, time], mode)
      in mode := <append>;

end Logger
             
~~~
{% endraw %}

### MMIHandleKeyPressOne.vdmrt

{% raw %}
~~~
              
class MMIHandleKeyPressOne is subclass of BasicTask

operations
  public MMIHandleKeyPressOne: EventDispatcher ==> MMIHandleKeyPressOne
  MMIHandleKeyPressOne (pde) ==  BasicTask("HandleKeyPress",pde);

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  public HandleKeyPress: () ==> ()
  HandleKeyPress () == duration (100) skip;

  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( HandleKeyPress();
      -- send message to next task in this scenario
      sendMessage("AdjustVolume", pe.getEvent()) )

end MMIHandleKeyPressOne
             
~~~
{% endraw %}

### MMIHandleKeyPressTwo.vdmrt

{% raw %}
~~~
              
class MMIHandleKeyPressTwo is subclass of BasicTask

operations
  public MMIHandleKeyPressTwo: EventDispatcher ==> MMIHandleKeyPressTwo
  MMIHandleKeyPressTwo (pde) == BasicTask("HandleKeyPress",pde);

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  public HandleKeyPress: () ==> ()
  HandleKeyPress () == duration (100) skip;

  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( HandleKeyPress();
	-- send message to next task in this scenario
      sendMessage("DatabaseLookup", pe.getEvent()) )

end MMIHandleKeyPressTwo
             
~~~
{% endraw %}

### MMIUpdateScreenAddress.vdmrt

{% raw %}
~~~
              
class MMIUpdateScreenAddress is subclass of BasicTask

operations
  public MMIUpdateScreenAddress: EventDispatcher ==> MMIUpdateScreenAddress
  MMIUpdateScreenAddress (pde) == BasicTask("UpdateScreenAddress",pde);

  public UpdateScreen: () ==> ()
  UpdateScreen () == duration (500) skip;

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( UpdateScreen();
	-- scenario finished. signal response back to the environment
      raiseInterrupt("InsertAddress", pe.getEvent()) )

end MMIUpdateScreenAddress
             
~~~
{% endraw %}

### MMIUpdateScreenTMC.vdmrt

{% raw %}
~~~
              
class MMIUpdateScreenTMC is subclass of BasicTask

operations
  public MMIUpdateScreenTMC: EventDispatcher ==> MMIUpdateScreenTMC
  MMIUpdateScreenTMC (pde) == BasicTask("UpdateScreenTMC",pde);

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  public UpdateScreen: () ==> ()
  UpdateScreen () == duration (500) skip;

  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( UpdateScreen();
	-- scenario finished. signal response back to the environment
      raiseInterrupt("TransmitTMC", pe.getEvent()) )

end MMIUpdateScreenTMC
             
~~~
{% endraw %}

### MMIUpdateScreenVolume.vdmrt

{% raw %}
~~~
              
class MMIUpdateScreenVolume is subclass of BasicTask

operations
  public MMIUpdateScreenVolume: EventDispatcher ==> MMIUpdateScreenVolume
  MMIUpdateScreenVolume (pde) == BasicTask("UpdateScreenVolume",pde);

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  public UpdateScreen: () ==> ()
  UpdateScreen () == duration (500) skip;

  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( UpdateScreen();
	-- scenario finished. signal response back to the environment
      raiseInterrupt("VolumeKnob", pe.getEvent()) )

end MMIUpdateScreenVolume
             
~~~
{% endraw %}

### NavigationDatabaseLookup.vdmrt

{% raw %}
~~~
              
class NavigationDatabaseLookup is subclass of BasicTask

operations
  public NavigationDatabaseLookup: EventDispatcher ==> NavigationDatabaseLookup
  NavigationDatabaseLookup (pde) == BasicTask("DatabaseLookup",pde);

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  public DatabaseLookup: () ==> ()
  DatabaseLookup() == duration (5000) skip;

  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( DatabaseLookup();
	-- send message to next task in this scenario
      sendMessage("UpdateScreenAddress", pe.getEvent()) )

end NavigationDatabaseLookup
             
~~~
{% endraw %}

### NavigationDecodeTMC.vdmrt

{% raw %}
~~~
              
class NavigationDecodeTMC is subclass of BasicTask

operations
  public NavigationDecodeTMC: EventDispatcher ==> NavigationDecodeTMC
  NavigationDecodeTMC (pde) == BasicTask("DecodeTMC",pde);

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  public DecodeTMC: () ==> ()
  DecodeTMC () == duration (500) skip;

  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( DecodeTMC();
      -- send message to next task in this scenario
      sendMessage("UpdateScreenTMC", pe.getEvent()) )

end NavigationDecodeTMC
             
~~~
{% endraw %}

### NetworkEvent.vdmrt

{% raw %}
~~~
              
class NetworkEvent is subclass of Event

operations
  public NetworkEvent: nat ==> NetworkEvent
  NetworkEvent (pne) == Event(pne)

end NetworkEvent
             
~~~
{% endraw %}

### RadioAdjustVolume.vdmrt

{% raw %}
~~~
              
class RadioAdjustVolume is subclass of BasicTask

operations
  public RadioAdjustVolume: EventDispatcher ==> RadioAdjustVolume
  RadioAdjustVolume (pde) == BasicTask("AdjustVolume",pde);

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  public AdjustVolume: () ==> ()
  AdjustVolume () == duration (100) skip;

  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( AdjustVolume();
      -- send message to next task in this scenario
      sendMessage("UpdateScreenVolume", pe.getEvent()) )

end RadioAdjustVolume
             
~~~
{% endraw %}

### RadioHandleTMC.vdmrt

{% raw %}
~~~
              
class RadioHandleTMC is subclass of BasicTask

operations
  public RadioHandleTMC: EventDispatcher ==> RadioHandleTMC
  RadioHandleTMC (pde) == BasicTask("HandleTMC",pde);

  -- we do not specify *what* the operation does
  -- we only specify its execution time
  public HandleTMC: () ==> ()
  HandleTMC () == duration (1000) skip;

  protected handleEvent: Event ==> ()
  handleEvent (pe) ==
    ( HandleTMC();
      -- send message to the next task in this scenario
      sendMessage("DecodeTMC", pe.getEvent()) )

end RadioHandleTMC
             
~~~
{% endraw %}

### RadNavSys.vdmrt

{% raw %}
~~~
              
class RadNavSys

types
  public perfdata = nat * nat * real

instance variables
  dispatch : EventDispatcher := new EventDispatcher();
  appTasks : set of BasicTask := {};
  envTasks : map seq of char to EnvironmentTask := {|->};
  mode : nat 

operations

  public RadNavSys: () ==> RadNavSys
  RadNavSys () ==
   (addApplicationTask(new MMIHandleKeyPressOne(dispatch));
    addApplicationTask(new RadioAdjustVolume(dispatch));
    addApplicationTask(new MMIUpdateScreenVolume(dispatch));
    addApplicationTask(new RadioHandleTMC(dispatch));
    addApplicationTask(new NavigationDecodeTMC(dispatch));
    addApplicationTask(new MMIUpdateScreenTMC(dispatch)) );
               
  -- the constructor initialises the system and starts the application
  -- tasks. because there are no events from the environment tasks yet
  -- all tasks will block in their own event handler loops. similarly
  -- the dispatcher task is started and blocked
  public RadNavSys: nat ==> RadNavSys
  RadNavSys (pi) ==
    ( mode := pi;
      cases (mode) :
        1 -> ( addApplicationTask(new MMIHandleKeyPressOne(dispatch));
               addApplicationTask(new RadioAdjustVolume(dispatch));
               addApplicationTask(new MMIUpdateScreenVolume(dispatch));
               addApplicationTask(new RadioHandleTMC(dispatch));
               addApplicationTask(new NavigationDecodeTMC(dispatch));
               addApplicationTask(new MMIUpdateScreenTMC(dispatch)) ),
        2 -> ( addApplicationTask(new MMIHandleKeyPressTwo(dispatch));
               addApplicationTask(new NavigationDatabaseLookup(dispatch));
               addApplicationTask(new MMIUpdateScreenAddress(dispatch));
               addApplicationTask(new RadioHandleTMC(dispatch));
               addApplicationTask(new NavigationDecodeTMC(dispatch));
               addApplicationTask(new MMIUpdateScreenTMC(dispatch)) )
      end;
      startlist(appTasks); start(dispatch) )
   pre pi in set {1, 2};

  -- the addApplicationTask helper operation instantiates the callback
  -- link to the task and adds it to the set of application tasks
  addApplicationTask: BasicTask ==> ()
  addApplicationTask (pbt) ==
    ( appTasks := appTasks union {pbt};
      dispatch.Register(pbt) );

  -- the addEnvironmentTask helper operation instantiates the callback
  -- link to the task and and starts the environment task. since the
  -- VDMTools command-line always has the highest priority, the task will
  -- not be scheduled for execution until some blocking operation is
  -- called or the time slice is exceeded
  addEnvironmentTask: EnvironmentTask ==> ()
  addEnvironmentTask (pet) ==
    ( envTasks := envTasks  munion {pet.getName() |-> pet};
      dispatch.Register(pet);
      pet.Run() );

  -- the Run operation creates and starts the appropriate environment tasks
  -- for this scenario. to ensure that the system model has ample time to
  -- make progress (because RadNavSys will be started from the VDMTools
  -- command-line which always has the highest priority) the calls to
  -- getMinMaxAverage will block until all responses have been received
  -- by the environment task
  public Run: () ==> map seq of char to perfdata
  Run () ==
    ( cases (mode):
        1 -> ( addEnvironmentTask(new VolumeKnob(dispatch,10));
               addEnvironmentTask(new TransmitTMC(dispatch,10)) ),
        2 -> ( addEnvironmentTask(new InsertAddress(dispatch,10));
               addEnvironmentTask(new TransmitTMC(dispatch,10)) )
      end;
      return { name |-> envTasks(name).getMinMaxAverage() 
             | name in set dom envTasks } )

end RadNavSys
             
~~~
{% endraw %}

### TransmitTMC.vdmrt

{% raw %}
~~~
              
class TransmitTMC is subclass of EnvironmentTask

operations
  public TransmitTMC: EventDispatcher * nat ==> TransmitTMC
  TransmitTMC (ped, pno) == EnvironmentTask("TransmitTMC", ped, pno);

  -- handleEvent receives the responses from the system
  -- and checks whether the response time for the matching
  -- stimulus was less than or equal to 10000 time units
  protected handleEvent: Event ==> ()
  handleEvent (pev) == duration (0) logSysToEnv(pev.getEvent())
  post checkResponseTimes(e2s,s2e,10000);

  -- createSignal generates the stimuli for the system
  createSignal: () ==> ()
  createSignal () ==
    duration (0)
      if (card dom e2s < max_stimuli) then
        ( dcl num : nat := getNum();
          logEnvToSys(num);
          raiseInterrupt("HandleTMC", num) );

  -- start the thread of the task
  public Run: () ==> ()
  Run () == start(self)

thread
  periodic (1000,0,0,0) (createSignal)

end TransmitTMC
             
~~~
{% endraw %}

### VolumeKnob.vdmrt

{% raw %}
~~~
              
class VolumeKnob is subclass of EnvironmentTask

operations
  public VolumeKnob: EventDispatcher * nat ==> VolumeKnob
  VolumeKnob (ped, pno) == EnvironmentTask("VolumeKnob", ped, pno);

  -- handleEvent receives the responses from the system
  -- and checks whether the response time for the matching
  -- stimulus was less than or equal to 1500 time units
  protected handleEvent: Event ==> ()
  handleEvent (pev) == duration (0) logSysToEnv(pev.getEvent())
  post checkResponseTimes(e2s,s2e,1500);

  -- createSignal generates the stimuli for the system
  createSignal: () ==> ()
  createSignal () ==
    duration (0)
      if (card dom e2s < max_stimuli) then
        ( dcl num : nat := getNum();
          logEnvToSys(num);
          raiseInterrupt("HandleKeyPress", num) );

  -- start the thread of the task
  public Run: () ==> ()
  Run () == start(self)

thread
  periodic (1000,0,0,0) (createSignal)
  
end VolumeKnob
             
~~~
{% endraw %}

