---
layout: default
title: The Overture Community
---

# ViennaTalk

![ViennaTalk logo](https://raw.githubusercontent.com/tomooda/ViennaTalk-doc/master/images/ViennaTalk-logo-150.png)

[ViennaTalk](https://github.com/tomooda/ViennaTalk-doc/blob/master/README.md) is a VDM environment built upon [Pharo Smalltalk](http://pharo.org) system.

Pre-built packages for MacOSX, Linux and Windows are available at [https://github.com/tomooda/ViennaTalk-doc/releases](https://github.com/tomooda/ViennaTalk-doc/releases).

## Demo movies

[![Introduction to VDM Browser](http://img.youtube.com/vi/ZIR3fFPeTz0/1.jpg)](http://www.youtube.com/watch?v=ZIR3fFPeTz0)
[![ViennaTalk: Types, Values and Objects](http://img.youtube.com/vi/anZoWeA5vd0/1.jpg)](http://www.youtube.com/watch?v=anZoWeA5vd0)

## VDMPad
[VDMPad](https://github.com/tomooda/ViennaTalk-doc/blob/master/VDMPad.md) is a lightweight WebIDE for VDM-SL shipped with ViennaTalk.

[![VDMPad](http://img.youtube.com/vi/-tY1C-zsNw0/1.jpg)](http://www.youtube.com/watch?v=-tY1C-zsNw0)


[A free VDMPad server](http://vdmpad.csce.kyushu-u.ac.jp) is available by courtesy of Kyushu University, Japan.
No user registration is required.

# VDMTools

![VDMTools logo](https://avatars1.githubusercontent.com/u/16361443?v=3&s=100)

[VDMTools](http://fmvdm.org/) is a fully featured toolbox for VDM-family with a long history. It has both IDE with GUI and command line tools with features including syntax checkers, type checkers, interpreters, proof obligation generators and code generators. Binary packages (for Mac, Linux and Windows) and documentation (in English and Japanese) are available at [fmvdm](http://fmvdm.org/) site, and all source code and documentation are now open-sourced under GPLv3 at [github repository](http://github.com/vdmtools/vdmtools/).

# vdm-mode

[vdm-mode](https://github.com/peterwvj/vdm-mode) is an Emacs package for writing VDM specifications using VDM-SL, VDM++ and VDM-RT.

# VDMJ

## Description

VDMJ provides basic tool support for the VDM-SL, VDM++ and VDM-RT specification languages, written in Java. It includes a parser, a type checker, an interpreter (with arbitrary precision arithmetic), a debugger, a proof obligation generator and a combinatorial test generator with coverage recording, as well as JUnit support for automatic testing and user definable annotations.

VDMJ is a command line tool, but it is used by the Overture project, which adds a graphical Eclipse IDE interface as well as features like code generation (see screen shots below).

## Features

* Parses, type checks, executes and debugs VDM specifications
* Generates proof obligations
* Generates detailed code coverage for tests in LaTeX or MS doc
* Performs combinatorial tests
* Supports all three VDM dialects: VDM-SL, VDM++ and VDM-RT
* Supports plain text, LaTeX, MS doc, docx or ODF source files
* Supports international character sets in specifications (eg. Greek, Japanese or Cyrillic)
* Supports external libraries and remote control (tool integration)
* Provides JUnit support for automatic testing of specifications
* Supports arbitrary precision arithmetic
* Supports user defined annotations
