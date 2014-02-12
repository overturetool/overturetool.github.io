--- 
layout: default 
title: Overture tool project 
---

## Downloading, installing and running the Overture Tools

Installing Overture is really simple and straightforward, it will take just a few minutes!

## Prerequisites

Overture is entirely written in [Java](http://www.java.com) and build on top of the [Eclipse](http://www.eclipse.org) platform.  
The only thing you need is a standard Java Run-time Environment (JRE version 1.6 or later). 
You can download Java from [www.java.com](http://www.java.com). 
Please make sure Java is working properly and visible in your executable search path. 
Check this by running "_java -version_" on the command-line!

## Downloading Overture

In order to make installation as easy as possible, we have prepared pre-installed binary distributions — grab everything you need in one go! 
Pre-packaged binaries are available for **Windows**, **Linux** with GTK, and **Mac OS X**; we provide 32-bit and 64-bit versions for all platforms. 
The latest release of the Overture IDE can be found on the [GitHub overturetool Releases page](https://github.com/overturetool/overture/releases). 
The generic Windows versions are known to work with both Windows 7 as well as Windows XP SP3.

[ ![Overture IDE releases at GitHub]({{ site.base }}/images/GitHub_Logo.png) ](https://github.com/overturetool/overture/releases)

## Installing and running Overture

Unzip the downloaded file in any preferred location on your harddisk, as long as it is a location where there is sufficient diskspace and where you have sufficient access priviliges (rwx). 
Double-click "_overture.exe_" which is found in the root of the unzipped directory. 
Overture will start (a splash screen will appear) and the tool will ask you to set the workspace directory. 
This is where your Overture projects will be stored, you can choose this location freely, it can be changed at any point in time. 
Finally, the Overture IDE will appear and you are in business! 
A detailed description of these installation steps is given [here]({{ site.base }}/documentation/install.html). 
Once you have the tool up and running, it is worthwhile to check out the available [tutorials and documentation]({{ site.base }}/documentation/).

## If you experience problems....

In case you experience problems, there are two options for you to get support, directly from the Overture developers. 
You can either post a question on the [StackOverflow with the VDM++ tag](http://stackoverflow.com/questions/tagged/vdm%2b%2b) or [send us an e-mail](http://www.google.com/recaptcha/mailhide/d?k=01mU5bAq4Rogp5FVouKumLoQ==&c=pHoefT8t8vvgTnqYB_4422-4CEytwUaijr_er5aSbIw=). 
In your message, please include information on the host operating system you are using (for example: Windows XP SP3, 32-bit), the Java JRE version you have installed (include the output of "java -version") and the name of the Overture installation package that you have downloaded. 
If you believe that you have found a real bug in the Overture Tool, please submit it [here](https://github.com/overturetool/overture/issues). 
You can browse the [open issue list](https://github.com/overturetool/overture/issues), to check whether your problem has already been raised by someone else.

## Uninstalling and removing Overture

For Windows users that are using version 1.1.1 (or later), simply run the uninstaller, either directly or from the Windows Control Panel. 
In case you want to uninstall Overture on Linux or Mac, simply delete the unzipped directory. 
Note that if you have used the default workspace (which is a subdirectory of the installation directory) also any models you have created will be removed. 
Overture does not make any other modifications to your system - there are no residuals!

## Checking for updates

There are two ways to keep the Overture tool in sync with the project releases. 
First one is simple: just repeat the steps described above, by manually downloading and installing the latest version from SourceForge. 
Multiple versions of the Overture tool can happily co-exist as long as you install them in seperate directories! 
The second option is also simple and well-known to Eclipse users, by moving to the Help menu and select "_Check for Updates_". 
This will upgrade the currently running tool instance to the latest and greatest.

## Extending the Overture tool

The current Overture tool release 2.0.0 is based on Eclipse Classic 4.3.1. 
You can extend the Overture tool with other Eclipse plug-ins that are compatible with that Eclipse release. 
For example, it is very easy to add the [Subclipse plug-in](http://subclipse.tigris.org) to Overture, such that you can put your specifications under revision control using subversion.

## Integration with other tools

There are a few tools that provide an integration interface to the Overture tools. They are only required if you wish to use specific features of the Overture tool. They are not required for the basic functionality.

- Latex can be used to produce documentation. On Linux, this is known to work with TeTeX, on Windows we have used [MikTex](http://miktex.org) successfully.
- Overture tool provides functionality to read and write UML 2.0 interchange files using the XMI file format. This has been tested and shown to work with [Enterprise Architect](http://www.sparxsystems.com).
- Overture tools provides a coupling to [VDMTools](http://www.vdmtools.jp/en).

For further details, we refer to the User Guide, which can be found [here]({{ site.base }}/files/OvertureIDEUserGuide.pdf).

####Overture: Formal Modelling in VDM

