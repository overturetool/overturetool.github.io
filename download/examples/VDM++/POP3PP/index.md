---
layout: default
title: POP3PP
---

## POP3PP
Author: Paul Mukherjee


This example is written by Paul Mukherjee and it is used in the VDM++ book
John Fitzgerald, Peter Gorm Larsen, Paul Mukherjee, Nico Plat and Marcel 
Verhoef. Validated Designs for Object-oriented Systems, Springer, New York. 
2005, ISBN 1-85233-881-4. The concurrent system in question is a server 
for the POP3 protocol. This is a protocol supported by all major email c
lients to fetch email messages from the email server. 

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new POP3Test().Test1()|
|Entry point     :| new POP3Test().Test2()|


### pop3message.vdmpp

{% raw %}
~~~
                                               
class POP3Message

instance variables
  header : seq of char;
  body : seq of char;
  deleted : bool;
  uniqueId : seq of char
  

operations

public POP3Message: seq of char * seq of char * seq of char ==> POP3Message
POP3Message(nheader, nbody, nuniqueId) ==
( header := nheader;
  body := nbody;
  deleted := false;
  uniqueId := nuniqueId;
);

public GetBody: () ==> seq of char
GetBody() ==
  return body;

public GetHeader: () ==> seq of char
GetHeader() ==
  return header;

public GetText: () ==> seq of char
GetText() ==
  return header ^"\n"^body;

public Delete: () ==> POP3Message
Delete() ==
( deleted := true;
  return self
);

public IsDeleted: () ==> bool
IsDeleted() ==
  return deleted;

public Undelete: () ==> POP3Message
Undelete() ==
( deleted := false;
  return self
);

public GetSize: () ==> nat
GetSize() ==
  return len body + len header;

public GetUniqueId: () ==> seq of char
GetUniqueId() ==
  return uniqueId;

end POP3Message
             
~~~
{% endraw %}

### messagechannel.vdmpp

{% raw %}
~~~
                                                   
class MessageChannel

instance variables
                            
instance variables
  data : [POP3Types`ClientCommand |
          POP3Types`ServerResponse]  := nil;
                            
instance variables

io : IO := new IO();
debug : bool := true;
                            
operations

Send: POP3Types`ClientCommand | 
      POP3Types`ServerResponse ==> ()
Send(msg) ==
  data := msg;

Listen: () ==> POP3Types`ClientCommand | 
               POP3Types`ServerResponse
Listen() ==
let d = data in
  ( data := nil; return d
  );
                             
operations

public ServerSend: POP3Types`ServerResponse ==> ()
ServerSend(p) == 
( if debug                         
  then let - = io.echo("***> ServerSend")
       in skip;                          
  Send(p);
  if debug                               
  then let - = io.echo("***> fin ServerSend")
       in skip                               
);                                           
                            
public ClientListen: () ==> POP3Types`ServerResponse
ClientListen() == 
( if debug
  then let - = io.echo("***> ClientListen")
       in skip;
  let r = Listen(),
      - = if debug
          then io.echo("***> fin ClientListen")
          else false
  in
    return r;
);

public ClientSend: POP3Types`ClientCommand ==> ()
ClientSend(p) == 
( if debug
  then let - = io.echo("***> ClientSend")
       in skip;
  Send(p);
  if debug
  then let - = io.echo("***> fin ClientSend")
       in skip;
);

public ServerListen: () ==> POP3Types`ClientCommand
ServerListen() == 
( if debug
  then let - = io.echo("***> ServerListen")
       in skip;
  let c = Listen(),
      - = if debug
          then io.echo("***> fin ServerListen")
          else false
  in 
    return c
);
                            
sync 
  per ServerListen => #fin(ClientSend) - 1 = 
                      #fin(ServerListen);
                            
  per ClientListen => #fin(ServerSend) - 1 = #fin(ClientListen);
                            
  per ServerSend => #fin(ClientSend) = #fin(ServerListen) and
                    #fin(ServerListen) - 1 = #fin(ServerSend);
                            
  per ClientSend => #fin(ServerSend) = #fin(ClientListen) 
                    and 
                    #fin(ClientSend) = #fin(ServerListen) 
                    and
                    #fin(ServerSend) = #fin(ClientSend) ;

end MessageChannel
             
~~~
{% endraw %}

### connectionchannel.vdmpp

{% raw %}
~~~
                                                      
class MessageChannelBuffer

instance variables
                            
instance variables

data : [MessageChannel] := nil;
                            
operations

public Put: MessageChannel ==> ()
Put(msg) ==
  data := msg;
                            
operations

public Get: () ==> MessageChannel
Get() ==
let d = data in
  ( data := nil;
    return d
  )
                            
sync

per Get => data <> nil;
per Put   => data = nil;
                            
sync
  mutex(Put, Get);
  mutex(Put);
  mutex(Get);

end MessageChannelBuffer
             
~~~
{% endraw %}

### pop3server.vdmpp

{% raw %}
~~~
                                               
class POP3Server

types
                            
public MessageInfo :: index : nat
                      size  : nat;
                            
instance variables
  connChannel: MessageChannelBuffer;
                            
instance variables
  maildrop      : MailDrop;
  passwords     : map POP3Types`UserName to 
                  POP3Types`Password;
  locks         : map ClientHandlerId to 
                  POP3Types`UserName;
  serverStarted : bool := false;
inv dom passwords = dom maildrop and
    rng locks subset dom maildrop;
 
types

public MailDrop = map POP3Types`UserName to MailBox;
public MailBox :: 
  msgs   : seq of POP3Message
  locked : bool;
public ClientHandlerId = nat;
                            
operations

public POP3Server: POP3Server`MailDrop * MessageChannelBuffer * 
                   map POP3Types`UserName to POP3Types`Password ==> POP3Server
POP3Server(nmd, nch, npasswords) ==
( maildrop    := nmd;
  connChannel := nch;
  locks       := {|->};
  passwords   := npasswords
);

public AuthenticateUser: POP3Types`UserName * POP3Types`Password ==> bool
AuthenticateUser(user, password) ==
  return user in set dom passwords and
         passwords(user) = password;

public IsLocked: POP3Types`UserName ==> bool
IsLocked(user) ==
  return user in set rng locks;

                            
operations

SetUserMessages: POP3Types`UserName * seq of POP3Message 
                 ==> ()
SetUserMessages(user, newMsgs) ==
  maildrop(user) := mu(maildrop(user), msgs |-> newMsgs);
                            
GetUserMail: POP3Types`UserName ==> MailBox
GetUserMail(user) ==
  return maildrop(user);
                            
sync
  mutex(SetUserMessages);
  mutex(SetUserMessages, GetUserMail)
                            
operations

GetUserMessages: POP3Types`UserName ==> seq of POP3Message
GetUserMessages(user) ==
  return GetUserMail(user).msgs;

                            
public RemoveDeletedMessages: POP3Types`UserName ==> bool
RemoveDeletedMessages(user) ==
  let oldMsgs = GetUserMessages(user),
      newMsgs = [ oldMsgs(i) | i in set inds oldMsgs
                             & not oldMsgs(i).IsDeleted()]
  in
    ( SetUserMessages(user, newMsgs);
      return true
    );
                            
public AcquireLock: ClientHandlerId * POP3Types`UserName ==> ()
AcquireLock (clId, user) ==
  locks := locks ++ { clId |-> user}
pre clId not in set dom locks and
    user in set dom maildrop;

                            
public ReleaseLock: ClientHandlerId ==> ()
ReleaseLock(clId) ==
  locks := {clId} <-: locks
pre clId in set dom locks;

sync
mutex(AcquireLock);
mutex(ReleaseLock);
mutex(AcquireLock, ReleaseLock, IsLocked);
                            
operations

CreateClientHandler: MessageChannel ==> ()
CreateClientHandler(mc) ==
  start(new POP3ClientHandler(self, mc));

                            
public IsMessageNumber: POP3Types`UserName * nat ==> bool
IsMessageNumber(user, index) ==
  let mb = GetUserMessages(user) 
  in
    return index in set inds mb;  

public IsValidMessageNumber: POP3Types`UserName * nat ==> bool
IsValidMessageNumber(user, index) ==
  let mb = GetUserMessages(user) 
  in
    return index in set inds mb and
           not mb(index).IsDeleted();

public MessageIsDeleted: POP3Types`UserName * nat ==> bool
MessageIsDeleted(user, index) ==
  let mb = GetUserMessages(user) 
  in
    return index in set inds mb and
           mb(index).IsDeleted();

public DeleteMessage: POP3Types`UserName * nat ==> ()
DeleteMessage(user, index) ==
  let oldMsg = GetUserMessages(user)(index),
      newMsg = oldMsg.Delete()
  in
    SetUserMessages(user, GetUserMessages(user) ++ { index |-> newMsg })
pre user in set dom maildrop and
    let mb = maildrop(user).msgs 
    in index in set inds mb and
       not mb(index).IsDeleted();

public GetMsgHeader: POP3Types`UserName * nat ==> seq of char
GetMsgHeader(user, index) ==
  let mb = GetUserMessages(user) 
  in
    return mb(index).GetHeader()
pre user in set dom maildrop and
    let mb = maildrop(user).msgs 
    in index in set inds mb and
       not mb(index).IsDeleted();

public GetMsgBody: POP3Types`UserName * nat ==> seq of char
GetMsgBody(user, index) ==
  let mb = GetUserMessages(user) 
  in
    return mb(index).GetBody()
pre user in set dom maildrop and
    let mb = maildrop(user).msgs 
    in index in set inds mb and
       not mb(index).IsDeleted();



public ResetDeletedMessages: POP3Types`UserName ==> ()
ResetDeletedMessages(user) ==
  let oldMsgs = GetUserMessages(user),
      newMsgs = [ oldMsgs(i).Undelete() 
                | i in set inds oldMsgs ]
  in
    SetUserMessages(user, newMsgs)
pre user in set dom maildrop;

public GetMessageText: POP3Types`UserName * nat ==> seq of char
GetMessageText(user, index) ==
  return GetUserMessages(user)(index).GetText()
pre user in set dom maildrop and
    let mb = GetUserMessages(user) 
    in
      index in set inds mb and
      not mb(index).IsDeleted();

public GetMessageSize: POP3Types`UserName * nat ==> nat
GetMessageSize(user, index) ==
  return GetUserMessages(user)(index).GetSize()
pre user in set dom maildrop and
    let mb = maildrop(user).msgs 
    in
      index in set inds mb and
      not mb(index).IsDeleted();

public GetMessageInfo: POP3Types`UserName * [nat] ==> set of MessageInfo
GetMessageInfo(user, index) ==
  let mb = GetUserMessages(user) in
  if index = nil
  then 
    return elems [mk_MessageInfo(i, 
                                 GetMessageSize(user, i)) |
                  i in set inds mb & not mb(i).IsDeleted()]
  else
    return { mk_MessageInfo(index, 
                            GetMessageSize(user, index)) }
pre index <> nil => (index in set inds maildrop(user).msgs and
                       not maildrop(user).msgs(index).IsDeleted());

                            

public GetUidl: POP3Types`UserName * nat ==> seq of char
GetUidl (user, index) ==
  let mb = GetUserMessages(user)
  in
    return POP3ClientHandler`int2string(index) ^" " ^
           mb(index).GetUniqueId();

public GetAllUidls:  POP3Types`UserName ==> seq of seq of char
GetAllUidls(user) == 
  let mb = GetUserMessages(user)
  in
    return [GetUidl(user, index) | index in set inds mb];

                            
public GetNumberOfMessages: POP3Types`UserName ==> nat
GetNumberOfMessages(user) ==
  return len GetUserMessages(user)
pre user in set dom maildrop;

                            
public GetMailBoxSize: POP3Types`UserName ==> nat
GetMailBoxSize(user) ==
  let mb = GetUserMail(user) in
  return sumseq ( [mb.msgs(i).GetSize()| i in set inds mb.msgs] )
pre user in set dom maildrop;

public GetChannel: () ==> MessageChannelBuffer
GetChannel() ==
  return connChannel;
                            
functions

public sumseq: seq of nat -> nat
sumseq(s) ==
  if s = []
  then 0
  else hd s + sumseq(tl s)
measure Len;

Len: seq of nat -> nat
Len(l) ==
  len l; 

                            
thread

while true do
( let msgChannel = connChannel.Get() 
  in
    CreateClientHandler(msgChannel);
  serverStarted := true;
)
                            
operations

public WaitForServerStart: () ==> ()
WaitForServerStart() ==
  skip;

sync

per WaitForServerStart => serverStarted;
                            
end POP3Server
                                                                    
~~~
{% endraw %}

### pop3types.vdmpp

{% raw %}
~~~
                                              
class POP3Types
types
                            
types

public ClientCommand = StandardClientCommand | 
                       OptionalClientCommand;
public StandardClientCommand = QUIT | STAT | LIST | RETR | 
                               DELE | NOOP | RSET;
public OptionalClientCommand = TOP | UIDL | USER | PASS | 
                               APOP;

                            
public QUIT :: ;

                            
public STAT :: ;

                            
public LIST :: messageNumber : [nat];

                            
public RETR :: messageNumber : nat;
                            
public DELE :: messageNumber : nat;

                            
public NOOP :: ;

                            
public RSET :: ;

                            
public TOP :: messageNumber : nat
              numLines      : nat;

                            
public UIDL :: messageNumber : [nat];

                            
public USER :: name : UserName;

                            
public PASS :: string : seq of char;

                            
public APOP :: name   : seq of char
               digest : seq of char;

                            
public UserName = seq of char;
public Password = seq of char;

                            
public ServerResponse = OkResponse | ErrResponse;
public OkResponse ::  data : seq of char;
public ErrResponse :: data : seq of char;
                            
functions

end POP3Types
                 
~~~
{% endraw %}

### pop3clienthandler.vdmpp

{% raw %}
~~~
                                                       
class POP3ClientHandler

types
                            
types

ServerState = <Authorization> | <Transaction> | <Update>;

                            
values

unknownMessageMsg: seq of char = "No such message";
negativeStatusMsg: seq of char = 
                     "Wrong state for this command";
                            
alreadyDeletedMsg: seq of char = "Message already deleted";
deleteFailMsg    : seq of char = "Some deleted messages not removed";
maildropLockedMsg: seq of char = "Maildrop already locked";
maildropReadyMsg : seq of char = "Maildrop locked and ready";
passwordFailedMsg: seq of char = "User/password authentication failed";
quitMsg          : seq of char = "Quitting POP3 Server";
submitPasswordMsg: seq of char = "Enter password";
                            
instance variables
  ss    : ServerState;
  parent: POP3Server;
  user  : POP3Types`UserName;
                           
instance variables
  msgChannel: MessageChannel;
  id: POP3Server`ClientHandlerId;
  lastWasUser: bool := false

                            
operations

public POP3ClientHandler: POP3Server * MessageChannel ==> POP3ClientHandler
POP3ClientHandler(nparent, nch) ==
( 
  let - = new IO().echo("Creating POP3ClientHandler") in skip;
  ss := <Authorization>;
  parent := nparent;
  msgChannel := nch
);


                            --[ReceiveCommand]
ReceiveCommand: POP3Types`ClientCommand 
                ==> POP3Types`ServerResponse
ReceiveCommand(c) ==
  let response = 
    cases c:
      mk_POP3Types`QUIT()    -> ReceiveQUIT(c), 
      mk_POP3Types`STAT()    -> ReceiveSTAT(c), 
      mk_POP3Types`LIST(-)   -> ReceiveLIST(c), 
      mk_POP3Types`RETR(-)   -> ReceiveRETR(c), 
      mk_POP3Types`DELE(-)   -> ReceiveDELE(c), 
      mk_POP3Types`NOOP()    -> ReceiveNOOP(c), 
      mk_POP3Types`RSET()    -> ReceiveRSET(c), 
      mk_POP3Types`TOP(-,-)  -> ReceiveTOP(c),  
      mk_POP3Types`UIDL(-)   -> ReceiveUIDL(c), 
      mk_POP3Types`USER(-)   -> ReceiveUSER(c), 
      mk_POP3Types`PASS(-)   -> ReceivePASS(c)
    end
  in                           
  ( if is_POP3Types`USER(c)    
    then lastWasUser := true   
    else lastWasUser := false; 
    return response            
  );                          

                            
ReceiveQUIT: POP3Types`QUIT ==> POP3Types`ServerResponse
ReceiveQUIT(-) ==
( dcl response: POP3Types`ServerResponse;
  cases ss: 
    <Authorization> -> response := mk_POP3Types`OkResponse(quitMsg),
    <Transaction> -> 
      let b = parent.RemoveDeletedMessages(user) in
      -- spec is unclear about update state - see pg 10
      -- i.e. quit is actually received in the transaction state and
      -- then the server moves into the update state, but no commands
      -- can be received in the update state
      ( ss := <Update>;
        parent.ReleaseLock(id);
        response := if b 
                    then mk_POP3Types`OkResponse(quitMsg)
                    else mk_POP3Types`ErrResponse(deleteFailMsg)
      ),
    others -> error
  end;
  return response
);

                            
ReceiveSTAT: POP3Types`STAT ==> POP3Types`ServerResponse
ReceiveSTAT (-) ==
  if ss = <Transaction>
  then return mk_POP3Types`OkResponse(" " ^ 
                            int2string(parent.GetNumberOfMessages(user)) ^
                            " " ^ 
                            int2string(parent.GetMailBoxSize(user)))
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);

                            
ReceiveLIST: POP3Types`LIST ==> POP3Types`ServerResponse
ReceiveLIST(list) ==
  if ss = <Transaction>
  then if list.messageNumber = nil or
          parent.IsValidMessageNumber(user, list.messageNumber)
       then let msgs = parent.GetMessageInfo(user, list.messageNumber)
            in
              return mk_POP3Types`OkResponse(MakeScanListHeader(msgs)^"\n"^
                                             MakeScanListing(msgs))  
       else return mk_POP3Types`ErrResponse(unknownMessageMsg)
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);

                            
functions

MakeScanListHeader: set of POP3Server`MessageInfo -> seq of char
MakeScanListHeader(msgs) ==
  let lp = card msgs in
  int2string(lp) ^ (if lp = 1 then " message(" else " messages(") ^
  int2string(sum({msg.size | msg in set msgs})) ^
  " octets)";

                            
set2seq[@tp]: set of @tp -> seq of @tp
set2seq(s) ==
if s = {}
then []
else let v in set s in
  [v] ^ set2seq[@tp](s \ {v})
measure Size;

Size[@tp]: set of @tp -> nat
Size(list) == card list;

MakeScanListing: set of POP3Server`MessageInfo -> seq of char
MakeScanListing(msgs) ==
  let msgSeq = set2seq[POP3Server`MessageInfo](msgs) in
  MakeMultilineResponse([int2string(msgSeq(i).index) ^ " " ^ 
                         int2string(msgSeq(i).size) 
                        | i in set inds msgSeq]);

                            
MakeMultilineResponse: seq of seq of char -> seq of char
MakeMultilineResponse(resps) ==
  if resps = []
  then []
  elseif len resps = 1
  then hd resps
  else hd resps ^ "\n" ^ MakeMultilineResponse(tl resps)
measure Len;

MakeLineSeq: seq of char -> seq of seq of char
MakeLineSeq(text) ==
  if text = []
  then []
  else let mk_(line, rest) = GetLine(text)
       in
         [line] ^ MakeLineSeq(rest)
measure Len;

GetLine: seq of char -> (seq of char) * (seq of char)
GetLine(text) ==
  if text = []
  then mk_([], [])
  elseif hd text = '\n'
  then mk_([], tl text)
  else let mk_(line, rest) = GetLine(tl text)
       in
         mk_([hd text] ^ line, rest)
measure Len;

Len: seq of char | seq of seq of char -> nat
Len(l) ==
  len l;
                            
sum: set of nat -> nat
sum(s) ==
  if s = {}
  then 0
  else let e in set s in
       sum(s \ {e}) + e
measure Card;

Card: set of nat -> nat
Card(s) ==
  card s;

                            
operations

ReceiveRETR: POP3Types`RETR ==> POP3Types`ServerResponse
ReceiveRETR(retr) ==
  if ss = <Transaction>
  then 
    if parent.IsValidMessageNumber(user, 
                                   retr.messageNumber)
    then let msgText = parent.GetMessageText(
                                user, 
                                retr.messageNumber),
             sizeText = 
               int2string(parent.GetMessageSize(
                                   user,
                                   retr.messageNumber))
         in
            return mk_POP3Types`OkResponse(sizeText ^ 
                                           "\n" ^ 
                                           msgText)
    else return 
           mk_POP3Types`ErrResponse(unknownMessageMsg)
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);
                            
ReceiveDELE: POP3Types`DELE ==> POP3Types`ServerResponse
ReceiveDELE(retr) ==
  if ss = <Transaction>
  then if parent.IsValidMessageNumber(user, retr.messageNumber)
       then ( parent.DeleteMessage(user, retr.messageNumber);
              return mk_POP3Types`OkResponse("message " ^
                                             int2string(retr.messageNumber) ^
                                             " deleted")
            )
       else if parent.MessageIsDeleted(user, retr.messageNumber)
       then return mk_POP3Types`ErrResponse(alreadyDeletedMsg)
       else return mk_POP3Types`ErrResponse(unknownMessageMsg)
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);


                            
ReceiveNOOP: POP3Types`NOOP ==> POP3Types`ServerResponse
ReceiveNOOP(-) ==
  if ss = <Transaction>
  then return mk_POP3Types`OkResponse("")
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);

                            
ReceiveRSET: POP3Types`RSET ==> POP3Types`ServerResponse
ReceiveRSET(-) ==
  if ss = <Transaction>
  then ( parent.ResetDeletedMessages(user);
         return mk_POP3Types`OkResponse(
                   "maildrop has " ^ 
                   int2string(parent.GetNumberOfMessages(user))^
                   " messages")
       )
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);


                            
ReceiveTOP:  POP3Types`TOP ==> POP3Types`ServerResponse
ReceiveTOP(top) ==
  if ss = <Transaction>
  then if parent.IsValidMessageNumber(user, top.messageNumber)
       then let header = parent.GetMsgHeader(user, top.messageNumber),
                body = parent.GetMsgBody(user, top.messageNumber),
                lines = MakeLineSeq(body)
            in
              return mk_POP3Types`OkResponse(
                        header ^"\n"^
                        MakeMultilineResponse(lines(1,...,
                                              top.numLines)))
       else return mk_POP3Types`ErrResponse(unknownMessageMsg)
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);
                            
ReceiveUIDL: POP3Types`UIDL ==> POP3Types`ServerResponse
ReceiveUIDL(uidl) ==
  if ss = <Transaction>
  then if uidl.messageNumber = nil
       then let uidlTxt = parent.GetAllUidls(user)
            in
              return mk_POP3Types`OkResponse(MakeMultilineResponse(uidlTxt))
       elseif parent.IsMessageNumber(user, uidl.messageNumber)
         -- Note that the spec is unclear here as to whether we should
         -- allow viewing of a specific message's uidl if the message
         -- is marked as deleted
       then return mk_POP3Types`OkResponse(parent.GetUidl(user, 
                                                          uidl.messageNumber))
       else return mk_POP3Types`ErrResponse(unknownMessageMsg)
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);

                            
ReceiveUSER: POP3Types`USER ==> POP3Types`ServerResponse
ReceiveUSER(usercmd) ==
  if ss = <Authorization>
  then ( user := usercmd.name;
         return mk_POP3Types`OkResponse(submitPasswordMsg)
       )
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);

                            
ReceivePASS: POP3Types`PASS ==> POP3Types`ServerResponse
ReceivePASS(pass) ==
  if ss = <Authorization> and lastWasUser
  then ( lastWasUser := false;
         if parent.AuthenticateUser(user, pass.string)
         then if parent.IsLocked(user)
              then return mk_POP3Types`ErrResponse(maildropLockedMsg)
              else ( parent.AcquireLock(id, user);
                     ss := <Transaction>;
                     return mk_POP3Types`OkResponse(maildropReadyMsg)
                   )
         else return mk_POP3Types`ErrResponse(passwordFailedMsg)
       )
  else return mk_POP3Types`ErrResponse(negativeStatusMsg);
                            
functions

static public int2string: int -> seq of char
int2string(i) ==
  if i = 0
  then "0"
  elseif i < 0
  then "-"^int2string(-i)
  else  int2stringR(i)
measure Abs;

static Abs: int -> nat
Abs(i) ==
  abs i;

static int2stringR: nat -> seq of char
int2stringR(n) ==
  if n = 0
  then ""
  else let first= n div 10,
           last = n mod 10 in
       int2stringR(first) ^
       cases last:
         0 -> "0",
         1 -> "1",
         2 -> "2",
         3 -> "3",
         4 -> "4",
         5 -> "5",
         6 -> "6",
         7 -> "7",
         8 -> "8",
         9 -> "9"
       end
measure Id;

static Id: nat -> nat
Id(n) == n; 



                            
thread
( dcl cmd: POP3Types`ClientCommand;
  id := threadid;
  cmd := msgChannel.ServerListen();
  while (cmd <> mk_POP3Types`QUIT()) do
  ( msgChannel.ServerSend(ReceiveCommand(cmd));
    cmd := msgChannel.ServerListen()
  );
  msgChannel.ServerSend(ReceiveCommand(cmd));
)
                            
end POP3ClientHandler
                                                                          
~~~
{% endraw %}

### pop3test.vdmpp

{% raw %}
~~~
class POP3Test

values

users : seq of POP3Types`UserName = 
  [ "paul",
    "peter",
    "nico",
    "john",
    "marcel"];

passwords : seq of POP3Types`Password = 
  [ "laup",
    "retep",
    "ocin",
    "nhoj",
    "lecram"];

headers : seq of seq of char = 
  ["From paul@mail.domain\n" ^
   "Subject Subject 1 \n"^
   "Date Fri, 19 Oct 2001 10:52:58 -0500",
   "From peter@mail.domain\n" ^
   "Subject Subject 2 \n"^
   "Date Sat, 20 Oct 2001 10:52:58 -0500",
   "From nico@mail.domain\n" ^
   "Subject Subject 3 \n"^
   "Date Sun, 21 Oct 2001 10:52:58 -0500",
   "From john@mail.domain\n" ^
   "Subject Subject 4 \n"^
   "Date Mon, 22 Oct 2001 10:52:58 -0500",
   "From marcel@mail.domain\n" ^
   "Subject Subject 5 \n"^
   "Date Tues, 23 Oct 2001 10:52:58 -0500"];

bodies : seq of seq of char = 
  ["Greetings from Paul",
   "Greetings from Peter",
   "Greetings from Nico",
   "Greetings from John",
   "Greetings from Marcel"];

functions

public MakePasswordMap: () -> map POP3Types`UserName to POP3Types`Password
MakePasswordMap() ==
  { users(i) |-> passwords(i) | i in set inds users };

operations

public MakeMailDrop: () ==> POP3Server`MailDrop
MakeMailDrop() ==
  return
  { users(i) |-> mk_POP3Server`MailBox(MakeMessages(users(i)),
                                       false) 
  | i in set inds users};

public MakeMessages: POP3Types`UserName ==> seq of POP3Message
MakeMessages (user) ==
  return
  [ new POP3Message(headers(i), 
                    bodies(i) ^ " to " ^ user,
                    user ^ POP3ClientHandler`int2string(i))
  | i in set inds headers ];

functions

TestRun1: () -> seq of POP3Types`ClientCommand
TestRun1() ==
  [ mk_POP3Types`USER(users(1)),
    mk_POP3Types`PASS(passwords(1)),
    mk_POP3Types`STAT(),
    mk_POP3Types`LIST(nil),
    mk_POP3Types`RETR(1),
    mk_POP3Types`DELE(1),
    mk_POP3Types`RETR(1),
    mk_POP3Types`RSET(),
    mk_POP3Types`NOOP(),
    mk_POP3Types`LIST(3),
    mk_POP3Types`LIST(8),
    mk_POP3Types`TOP(2, 5),
    mk_POP3Types`UIDL(nil),
    mk_POP3Types`UIDL(3),
    mk_POP3Types`DELE(1),
    mk_POP3Types`DELE(1),
    mk_POP3Types`UIDL(1),
    mk_POP3Types`QUIT()
  ]

instance variables

   server : POP3Server;
   ch : MessageChannelBuffer;
   mc1 : MessageChannel;
   mc2 : MessageChannel;
   mc3 : MessageChannel;
   send1 : POP3TestSender;
   send2 : POP3TestSender;
   listen1 : POP3TestListener;
   listen2 : POP3TestListener;

operations

public StartServer: POP3Server ==> ()
StartServer(myserver) ==
(  start(myserver);
--   server.WaitForServerStart()
);



public Test1: () ==> ()
Test1() ==
  let ch = new MessageChannelBuffer(),
      server = new POP3Server(MakeMailDrop(), ch, MakePasswordMap())
  in 
    ( dcl mc : MessageChannel := new MessageChannel();
      start(server);
      ch.Put(mc);
      let run = TestRun1(),
          send = new POP3TestSender("c", run, mc),
          listen = new POP3TestListener("l", mc)
      in
      ( start(send);
        start(listen);
        listen.IsFinished()
      )
    );

public Test2: () ==> ()
Test2() ==
  let ch = new MessageChannelBuffer(),
      server = new POP3Server(MakeMailDrop(), ch, MakePasswordMap())
  in 
    ( dcl mc1 : MessageChannel := new MessageChannel(),
          mc2 : MessageChannel := new MessageChannel();
      start(server);
      ch.Put(mc1);
      ch.Put(mc2);
      let run = TestRun1(),
          send1 = new POP3TestSender("c1", run, mc1),
          send2 = new POP3TestSender("c2", run, mc2),
          listen1 = new POP3TestListener("l1", mc1),
          listen2 = new POP3TestListener("l2", mc2)
      in
      ( start(send1);
        start(send2);
        start(listen1);
        start(listen2);
        listen1.IsFinished();
        listen2.IsFinished();
      )
    );

Start: POP3TestSender | POP3TestListener ==> ()
Start(obj) ==
  start(obj);
  
public POP3Test:() ==> POP3Test
POP3Test() ==
  (ch := new MessageChannelBuffer();
   server := new POP3Server(MakeMailDrop(), ch, MakePasswordMap());
   mc1 := new MessageChannel();
   mc2 := new MessageChannel();
   mc3 := new MessageChannel();
   send1 := new POP3TestSender("c1", TestRun1(), mc1);
   send2 := new POP3TestSender("c2", TestRun1(), mc2);
   listen1 := new POP3TestListener("l1", mc1);
   listen2 := new POP3TestListener("l2", mc2)
  );

traces

  Two: StartServer(server);
       --let mc in set {mc1,mc2,mc3} in
       (ch.Put(mc1) | ch.Put(mc2) | ch.Put(mc3)){3};
       Start(send1); Start(send2);
       Start(listen1); Start(listen2);
       listen1.IsFinished();
       listen2.IsFinished();
       
end POP3Test

class POP3TestSender

instance variables

id   : seq of char;
cmds : seq of POP3Types`ClientCommand;
mc   : MessageChannel

operations

public POP3TestSender: seq of char * seq of POP3Types`ClientCommand * 
                       MessageChannel ==> POP3TestSender
POP3TestSender(idarg, cmdsarg, mcarg) ==
( id := idarg;
  cmds := cmdsarg;
  mc := mcarg
);

LogClient: POP3Types`ClientCommand ==> ()
LogClient(cmd) ==
  let io = new IO() ,
      - = io.echo("Client " ^ id ^ " says -> "),
      - = io.writeval[POP3Types`ClientCommand](cmd)
  in
    skip;

SendCmd: MessageChannel * POP3Types`ClientCommand ==> ()
SendCmd(mcarg, cmd) ==
( mcarg.ClientSend(cmd);
  LogClient(cmd);
);

thread
  for cmd in cmds do
    SendCmd(mc, cmd);


end POP3TestSender

class POP3TestListener

instance variables

id : seq of char;
mc : MessageChannel;
finished : bool

operations

public POP3TestListener: seq of char * MessageChannel ==> POP3TestListener
POP3TestListener(idarg, mcarg) ==
( id := idarg;
  mc := mcarg;
  finished := false;
);

LogServer: POP3Types`ServerResponse ==> ()
LogServer(resp) ==
  let io = new IO() ,
      - = io.echo("Server " ^ id ^ " responds -> "),
      - = io.writeval[POP3Types`ServerResponse](resp)
  in
    skip;

public IsFinished: () ==> ()
IsFinished() ==
  skip;

sync 
  per IsFinished => finished

thread
( dcl response : POP3Types`ServerResponse := mc.ClientListen();
  while response <> mk_POP3Types`OkResponse( "Quitting POP3 Server" )
  do
  ( LogServer(response);
    response := mc.ClientListen()
  );
  LogServer(response);
  finished := true
)

end POP3TestListener
~~~
{% endraw %}

