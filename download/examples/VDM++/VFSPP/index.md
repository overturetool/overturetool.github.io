---
layout: default
title: VFSPP
---

## VFSPP
Author: Miguel Ferreira


This is a Specification of the File System Layer, sliced at the 
FS_DeleteFileDir operation, as defined in the INTEL Flash File 
System document. It includes: a VDM++ model that can be model 
checked in an equivalent Alloy model; and an adapted version 
of the VDM++ model to be used in the Overture Automated Proof 
Support system. In the test class UseFileSystemLayerAlg there 
are a few examples of using the traces primitives used for 
test automation. This model has been developed by Miguel 
Ferreira

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| new UseFileSystemLayerAlg().dummy()|


### UseFileSystemLayerAlg.vdmpp

{% raw %}
~~~
class UseFileSystemLayerAlg

instance variables
public sys : FileSystemLayerAlg := new FileSystemLayerAlg();

values

  file : FileSystemLayerAlg`File = mk_FileSystemLayerAlg`File(
                                    mk_FileSystemLayerAlg`Attributes(
                                     <RegularFile>),
                                    "hello world");
  file2: FileSystemLayerAlg`File = mk_FileSystemLayerAlg`File(
                                    mk_FileSystemLayerAlg`Attributes(
                                     <Directory>),
                                    nil);
 ofd : FileSystemLayerAlg`OpenFileDescriptor = 
       mk_FileSystemLayerAlg`OpenFileDescriptor(["whoami"]);
 s : FileSystemLayerAlg`System = 
     mk_FileSystemLayerAlg`System({42 |-> ofd},
                                  {<Root> |-> file2,
                                   ["whoami"] |-> file});

operations

public dummy: () ==> ()
dummy() == skip;

traces

  T : sys.FS_Init_Main() ; (sys.dirName(<Root>) | 
                            sys.isDirectory(file) | 
                            sys.FS_DeleteFileDir_Main(s,["Dummy"]) ){3}
                            
  
end UseFileSystemLayerAlg

~~~
{% endraw %}

### FileSystemLayerAlg.vdmpp

{% raw %}
~~~
class FileSystemLayerAlg

types 

public
Path = <Root> | seq1 of FileName;

public
FileName = seq1 of char;

public 
FileContents = seq of char;

public 
FileStore = map Path to File
inv fileStore == 
  <Root> in set dom fileStore and
  forall path in set dom fileStore & 
    let parent = dirName(path) in
        parent in set dom fileStore and 
        isDirectory(fileStore(parent));

public
File :: attributes : Attributes
        contents   : [FileContents]
inv file == 
  (file.attributes.fileType = <Directory> and file.contents = nil) or
  (file.attributes.fileType = <RegularFile> and file.contents <> nil);

public 
Attributes :: fileType : FileType;

public 
FileType = <RegularFile> | <Directory>;

public 
OpenFileDescriptorTable = 
  map FileHandler to OpenFileDescriptor;

public 
FileHandler = nat;

public 
OpenFileDescriptor :: 
  path : Path;

public 
System :: table       : OpenFileDescriptorTable
          fileStore   : FileStore
inv sys ==
  forall openfiledescriptor in set rng sys.table & 
    openfiledescriptor.path in set dom sys.fileStore;


functions

public
FS_DeleteFileDir_Main : System * Path -> System * FFS_Status
FS_DeleteFileDir_Main(sys, full_path) == 
  if not isRoot(full_path) and
     isElemFileStore(full_path, sys.fileStore) and
     pre_FS_DeleteFileDir_System(sys, full_path)
  then mk_(FS_DeleteFileDir_System(sys, full_path), <FFS_StatusSuccess>)
  else mk_(sys, FS_DeleteFileDir_Exception(sys, full_path));

private
FS_DeleteFileDir_System : System * Path -> System
FS_DeleteFileDir_System(sys, full_path) == 
  mu(sys, fileStore |-> FS_DeleteFileDir_FileStore(sys.fileStore, full_path))
pre pre_FS_DeleteFileDir_FileStore(sys.fileStore, full_path) and
  forall buffer in set rng sys.table & buffer.path <> full_path;

private
FS_DeleteFileDir_FileStore : FileStore * Path -> FileStore
FS_DeleteFileDir_FileStore(fileStore, full_path) == 
  {full_path} <-: fileStore
pre forall path in set dom fileStore & dirName(path) <> full_path;

private
FS_DeleteFileDir_Exception : System * Path -> FFS_Status
FS_DeleteFileDir_Exception(sys, full_path) == 
  if isRoot(full_path)
  then   <FS_ErrorInvalidPath>
  elseif not isElemFileStore(full_path, sys.fileStore)
  then   <FS_ErrorPathNotFound>
  elseif exists buffer in set rng sys.table & buffer.path = full_path
  then   <FS_ErrorFileStillOpen>
  elseif isDirectory(sys.fileStore(full_path)) or
         exists path in set dom sys.fileStore & full_path = dirName(path)
  then   <FS_ErrorDirectoryNotEmpty>
  else   <FFS_StatusUnknown>;

public 
FS_Init_Main : () -> System * FFS_Status
FS_Init_Main() == mk_(FS_Init_System(), <FFS_StatusSuccess>);

private
FS_Init_System : () -> System 
FS_Init_System() == mk_System(FS_Init_Table(), FS_Init_FileStore());

private
FS_Init_Table : () -> OpenFileDescriptorTable

FS_Init_Table() == {|->};

private
FS_Init_FileStore : () -> FileStore
FS_Init_FileStore() == {<Root> |-> mk_File(mk_Attributes(<Directory>), nil)};



static public
dirName : Path -> Path
dirName(full_path) == 
  if full_path = <Root> or len full_path = 1
  then <Root>
  else [ full_path(i) | i in set inds full_path & i < len full_path ];


static public
isDirectory : File -> bool
isDirectory(file) == file.attributes.fileType = <Directory>;

public
isRoot : Path -> bool
isRoot(path) == path = <Root>;

public
isElemFileStore : Path * FileStore -> bool
isElemFileStore(path, fileStore) == path in set dom fileStore;

types
public FFS_Status = 
                    <FFS_StatusSuccess> 
                  | <FFS_StatusNotFound>
                  | <FFS_StatusUnknown>
                  | <FS_ErrorDirectoryNotEmpty>
                  | <FS_ErrorFileStillOpen> 
                  | <FS_ErrorPathNotFound>
                  | <FS_ErrorInvalidPath>
                  | <FS_ErrorTooManyOpenFiles>;

end FileSystemLayerAlg

~~~
{% endraw %}

