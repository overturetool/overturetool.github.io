---
layout: default
title: webserverPP
---

## webserverPP
Author: 



This is a very simple VDM++ of the basic functionality of a web
server.


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### url.vdmpp

{% raw %}
~~~

class URL

  operations

    -- for a given configuration, translate maps this URL to the 
    -- location of the corresponding file on the server.
    public
    translate : () ==> Filename
    translate () == is not yet specified;
     

end URL
~~~
{% endraw %}

### webserver.vdmpp

{% raw %}
~~~

class Webserver

  functions


    -- execute_script models OS execution of a CGI script generating
    -- html file at stdout
    execute_script : File -> File
    execute_script(f) == is not yet specified;

  instance variables
    site_map : map URL to Filename := {|->}

  operations

    ExecuteCGI : URL ==> File
    ExecuteCGI (url) == 
      def CGI_script = (site_map(url)).get_file()
      in  return (execute_script(CGI_script))
    pre url in set dom site_map;

    RetrieveURL : URL ==> File
    RetrieveURL (url) == 
      return ((site_map(url)).get_file())
    pre url in set dom site_map;

    UploadFile : File * URL ==> ()
    UploadFile  (file, url) == 
     (url.translate().put_file(file);
      site_map := site_map ++ {url |-> url.translate()});

    ServerBusy : () ==> File
    ServerBusy () == 
     (dcl f:File := new File();
      f.write("<html><title>Server Busy</title>"^
              "<body><h3>Server busy</h3> Please try again later</body>"^
              "</html>");
      return(f));

    DeleteURL : URL ==> ()
    DeleteURL (url) ==
      site_map := {url} <-: site_map;

  sync
 
    per RetrieveURL => #active(RetrieveURL) + #active(ExecuteCGI) < 10;
    per ExecuteCGI  => #active(RetrieveURL) + #active(ExecuteCGI) < 10;
    per ServerBusy  => #waiting(RetrieveURL) + #waiting(ExecuteCGI) >= 100;
    per DeleteURL   => dom site_map <> {}

end Webserver

  
~~~
{% endraw %}

### filename.vdmpp

{% raw %}
~~~

class Filename

  operations

   -- get_file models OS operation of taking a location and returning
   -- content of file at that location
   public
   get_file : () ==> File
   get_file () == is not yet specified; 

   -- put_file models OS operation of storing given file at a given
   -- location
   public
   put_file : File ==> ()
   put_file (f) == is not yet specified; 

end Filename
~~~
{% endraw %}

### file.vdmpp

{% raw %}
~~~
class File

  instance variables

    data: seq of char := ""

  operations 

    public
    write : seq of char ==> ()
    write(chs) == 
      data := chs

end File
~~~
{% endraw %}

