---
layout: default
title: Codegen
---

~~~
This example is produced by a group of students as a partof a VDM course given at the Engineering College of Aarhus. This model describes how to do code generation from a small applicative language called Simple to a subset of Java (calledGeraffe). This example also illustrates how one can make useof Java jar files as a part of a VDM model supported byOverture.  #******************************************************#  AUTOMATED TEST SETTINGS#------------------------------------------------------#AUTHOR=Johannes UlfkjÃ¦r Jensen, Jon Nielsen and Leni Lausdahl#LANGUAGE_VERSION=classic#INV_CHECKS=true#POST_CHECKS=true#PRE_CHECKS=true#DYNAMIC_TYPE_CHECKS=true#SUPPRESS_WARNINGS=false#ENTRY_POINT=new codegen_Util().Run()#LIB=IO#EXPECTED_RESULT=NO_ERROR_TYPE_CHECK#******************************************************
~~~
###Codegen.vdmpp

{% raw %}
~~~
class Codegen	types
	values
	instance variables
	operations
	public Generate : GiraffeSpecification ==> seq of char	Generate(spec) ==		let clazz : GiraffeClassDefinition = spec.getClazz(),			genClasses : seq of char = Generate(clazz)		in				return conc ["public class ", genClasses];
	public Generate : GiraffeClassDefinition ==> seq of char	Generate(classDef) ==		let methods : set of GiraffeMethodDefinition = classDef.getMethods(),			mlist : seq of GiraffeMethodDefinition = VDMUtil`set2seq[GiraffeMethodDefinition](methods),			genMethods : seq of char = conc [Generate(mlist(i)) | i in set inds mlist]		in			return conc [classDef.getName().getName(), " { ", genMethods];--, " } "];
	public Generate : GiraffeMethodDefinition ==> seq of char	Generate(method) ==		let params : seq of GiraffeParameter = method.getParameters(),			genParams : seq of char = conc tail(conc [[", ", Generate(params(i))] | i in set inds params]),			body : seq of GiraffeStatement = method.getBody(),			genBody : seq of char = conc conc [[Generate(body(i)), ";"] | i in set inds body]		in	return conc ["public static ", Generate(method.getType()), " ", Generate(method.getName()), "(", genParams, ")", "{", genBody, "}"];
	public Generate : GiraffeParameter ==> seq of char	Generate(param) == return conc [Generate(param.getType()), " ", param.getName().getName()];
	public Generate : GiraffeType ==> seq of char	Generate(type) ==		if isofclass(GiraffeIdentifier, type) then			let i : GiraffeIdentifier = type			in return i.getName()		else			let t : GiraffeBasicType = type			in 				cases t.name:					"INT"	-> return "int",					"DOUBLE"-> return "double",					"BOOL"	-> return "boolean",					others -> error				end;
	public Generate : GiraffeStatement ==> seq of char	Generate(stm) == 		cases (true):			(isofclass(GiraffeVariableDeclStatement, stm)) ->				let s : GiraffeVariableDeclStatement = stm				in	return conc [Generate(s.getType()), " ", Generate(s.getName()), " = ", GenerateExpression(s.getValue())],			(isofclass(GiraffeReturnStatement, stm)) ->	let	s : GiraffeReturnStatement = stm														in	return conc ["return ", GenerateExpression(s.getValue())],			others -> error		end;
	public GenerateExpression : GiraffeExpression ==> seq of char	GenerateExpression(exp) ==		cases (true):			(isofclass(GiraffeIntegerLiteralExpression, exp)) ->				let	e : GiraffeIntegerLiteralExpression = exp				in 	return new codegen_Util().iToS(e.getValue()),			(isofclass(GiraffeVariableExpression, exp)) ->				let	e : GiraffeVariableExpression = exp				in return e.getName().getName(),			(isofclass(GiraffeBinaryExpression, exp)) -> 				let e : GiraffeBinaryExpression = exp				in return GenerateBinaryExpression(e),			(isofclass(GiraffeIfExpression, exp)) ->				let e : GiraffeIfExpression = exp				in return " ( (" ^ GenerateExpression(e.getTest()) ^ ") ? (" ^ GenerateExpression(e.getThn()) ^ ") : (" ^ GenerateExpression(e.getEls()) ^ ") ) ",				others -> error		end;
	public GenerateBinaryExpression : GiraffeBinaryExpression ==> seq of char	GenerateBinaryExpression(binexp) ==		let op : GiraffeBinaryOperator = binexp.getOp(),			lhs : GiraffeExpression = binexp.getLhs(),			rhs : GiraffeExpression = binexp.getRhs()		in			cases op.name:				("EQUALS") -> return " ( " ^ GenerateExpression(lhs) ^ " == " ^ GenerateExpression(rhs) ^ " ) ",				("PLUS") -> return " ( " ^ GenerateExpression(lhs) ^ " + " ^ GenerateExpression(rhs) ^ " ) ",				others -> error			end;
	functions
	public tail : seq of seq of char -> seq of seq of char	tail(x) == 		if (x = []) then			[]		else			tl x;
end Codegen
~~~{% endraw %}

###Compiler.vdmpp

{% raw %}
~~~
class Compiler	types
	values	util : codegen_Util = new codegen_Util();
	instance variables
	typeDefs : seq of SimpleTypeDefinition := [];
	context : map seq of char to seq of char := {|->};	inv card dom context = card rng context;
	varDecls : seq of GiraffeVariableDeclStatement := [];
	uid : nat1 := 1;
	operations
private getUniqeName : () ==> seq of chargetUniqeName() == let res = uid				in (uid := uid + 1;				return "v" ^ util.iToS(res))post RESULT not in set rng context;
private getUniqeSimpleName : () ==> seq of chargetUniqeSimpleName() == (	while true do	(		let name : seq of char = getUniqeName() -- Use it as a source of new string     		in 			if (name not in set dom context) then				return name	);
	return "")post RESULT not in set dom context;
public Compile : seq of char * SimpleSpecification ==> GiraffeSpecificationCompile(programName, spec) ==	let name : GiraffeIdentifier = new GiraffeIdentifierImpl(programName),		defs : seq of SimpleDefinition = spec.getDefs(),		functionz : set of GiraffeMethodDefinition = {Compile(defs(i)) 													 | i in set inds defs 													 & isofclass(SimpleFunctionDefinition, defs(i))},		classDef : GiraffeClassDefinition = new GiraffeClassDefinitionImpl(name, functionz)	in 		(typeDefs := [defs(i) | i in set inds defs & isofclass(SimpleTypeDefinition, defs(i))];		return new GiraffeSpecificationImpl(classDef))pre len programName > 0 and programName(1) not in set {'0','1','2','3','4','5','6','7','8','9'};
public Compile : SimpleFunctionDefinition ==> GiraffeMethodDefinitionCompile(func) ==	let name : GiraffeIdentifier = new GiraffeIdentifierImpl(func.getName().getName()),		defs : seq of SimpleParameter = func.getParams(),		params : seq of GiraffeParameter = [Compile(defs(i)) 										   | i in set inds defs],		type : GiraffeType = Compile(GetType(func.getBody())),		body : seq of GiraffeStatement = varDecls ^ [new GiraffeReturnStatementImpl(Compile(func.getBody()))]	in (varDecls := [];		return new GiraffeMethodDefinitionImpl(name, params, type, body))pre varDecls = [] and context = {|->}post varDecls = [] and context = {|->};
public Compile : SimpleParameter ==> GiraffeParameterCompile(param) ==	let name : GiraffeIdentifier = new GiraffeIdentifierImpl(param.getName().getName()),		type : GiraffeType = Compile(param.getType())	in return new GiraffeParameterImpl(type, name);
public Compile : SimpleType ==> [GiraffeType]Compile(type) ==		if isofclass(SimpleIdentifier, type) then			let t : SimpleIdentifier = type			in return Compile(GetBasicType(t))--new GiraffeIdentifierImpl(t.getName())		else			let t : SimpleBasicType = type			in 				cases t.name:					"INT" 	-> return GiraffeBasicType`INT,					others -> return nil				endpost RESULT <> nil;
public Compile : SimpleExpression ==> [GiraffeExpression]Compile(exp) ==	cases true:		(isofclass(SimpleIntegerLiteralExpression, exp)) -> let e : SimpleIntegerLiteralExpression = exp																	in return new GiraffeIntegerLiteralExpressionImpl(e.getValue()),		(isofclass(SimpleBinaryExpression, exp)) -> let e : SimpleBinaryExpression = exp															in return Compile(e.getOp(), e.getLhs(), e.getRhs()),		(isofclass(SimpleCasesExpression, exp)) -> let e : SimpleCasesExpression = exp													in return CompileCases(e),		(isofclass(SimpleVariableExpression, exp)) ->	let e : SimpleVariableExpression = exp,															name : SimpleIdentifier = e.getName()														in	return new GiraffeVariableExpressionImpl(new GiraffeIdentifierImpl(context(name.getName()))),		(isofclass(SimpleLetExpression, exp)) ->	let e : SimpleLetExpression = exp													in return CompileLet(e),		(isofclass(SimpleIfExpression, exp)) -> let e : SimpleIfExpression = exp													in return CompileIf(e),		others -> return nil	endpost RESULT <> nil;
public CompileCases : SimpleCasesExpression ==> GiraffeExpressionCompileCases(e) ==	let testVarName : SimpleIdentifier = new SimpleIdentifierImpl(getUniqeSimpleName()),		testVar : SimpleVariableExpression = new SimpleVariableExpressionImpl(testVarName),		testVarAss : SimpleLocalDefinition = new SimpleLocalDefinitionImpl(testVarName, e.getTest()),		letBody : SimpleExpression = 			if e.getAlts() = [] then				e.getDeflt()			else				let first : SimpleCaseAlternative = hd e.getAlts(),					ifTest : SimpleBinaryExpression = new SimpleBinaryExpressionImpl(testVar, SimpleBinaryOperator`EQUALS, first.getTest()),					rest : seq of SimpleCaseAlternative = tl e.getAlts(),					elsIfs : seq of SimpleElseIfExpression = [new SimpleElseIfExpressionImpl(new SimpleBinaryExpressionImpl(testVar, SimpleBinaryOperator`EQUALS, rest(i).getTest()), rest(i).getExp()) | i in set inds rest]				in 					new SimpleIfExpressionImpl(ifTest, first.getExp(), elsIfs, e.getDeflt())	in return Compile(new SimpleLetExpressionImpl([testVarAss], letBody))pre not e.hasDeflt(); -- Empty defaults not allowed as we do not want to implement runtime errors.-- not operator used due to a bug in ASTGEN
public CompileLet : SimpleLetExpression ==> GiraffeExpressionCompileLet(letExp) ==	let oldContext : map seq of char to seq of char = context	in (for x in letExp.getDefs() do			let name : seq of char = x.getName().getName(),				newName : seq of char = getUniqeName(),				type : SimpleType = GetType(x.getValue()),				gType : GiraffeType = Compile(type),				gName : GiraffeIdentifier = new GiraffeIdentifierImpl(newName),				gValue : GiraffeExpression = Compile(x.getValue()),				gStm : GiraffeVariableDeclStatement = new GiraffeVariableDeclStatementImpl(gType, gName, gValue)			in (context := context ++ {name |-> newName};				varDecls := varDecls ^ [gStm];);		let body : GiraffeExpression =  Compile(letExp.getBody())		in (context := oldContext; return body;))pre letExp.getDefs() <> [];
public Compile : SimpleBinaryOperator * SimpleExpression * SimpleExpression ==> [GiraffeBinaryExpression]Compile(op, lhs, rhs) ==	cases op.name:		"EQUALS" -> let	glhs : GiraffeExpression = Compile(lhs),						gop : GiraffeBinaryOperator = GiraffeBinaryOperator`EQUALS,						grhs : GiraffeExpression = Compile(rhs)					in return new GiraffeBinaryExpressionImpl(glhs, gop, grhs),
		"PLUS" -> let	glhs : GiraffeExpression = Compile(lhs),						gop : GiraffeBinaryOperator = GiraffeBinaryOperator`PLUS,						grhs : GiraffeExpression = Compile(rhs)				in return new GiraffeBinaryExpressionImpl(glhs, gop, grhs),		others -> 				return nil	endpost RESULT <> nil;
public GetType : SimpleExpression ==> SimpleTypeGetType(exp) ==	return SimpleBasicType`INT;
public GetBasicType : SimpleType ==> SimpleBasicTypeGetBasicType(type) ==	return SimpleBasicType`INT;
functions
public CompileIf : SimpleIfExpression -> GiraffeIfExpressionCompileIf(selif) ==let	gTest : GiraffeExpression = Compile(selif.getTest()),	gThen : GiraffeExpression = Compile(selif.getThn()),	gElse : GiraffeExpression = deflatten(selif.getElif(), selif.getEse())	in		new GiraffeIfExpressionImpl(gTest,gThen,gElse);
public deflatten : seq of SimpleElseIfExpression * SimpleExpression -> GiraffeExpressiondeflatten(elsif, els) ==	if (elsif = []) then		Compile(els)	else		let head : SimpleElseIfExpression = hd elsif,			gTest : GiraffeExpression = Compile(head.getTest()),			gThen : GiraffeExpression = Compile(head.getThn()),			gElse : GiraffeExpression = deflatten(tl elsif, els)		in new GiraffeIfExpressionImpl(gTest, gThen, gElse);
end Compiler
~~~{% endraw %}

###nativetest.vdmpp

{% raw %}
~~~
class codegen_Util
instance variables
compiler : Compiler := new Compiler();codegen : Codegen := new Codegen();--io : IO := new IO();
operations
public Run : () ==> (bool|int|seq of char)Run() ==	let programs = getSimpleNames() in	Run(programs);
public Run : seq of seq of char ==> seq of charRun(programs) ==	if programs = [] then		return []	else		let			program = hd programs,			z = parseSimpleProgram(program),			a = compiler.Compile(program, z),			b = codegen.Generate(a),			real_b = b ^ " public static void main(String[] argv){ System.exit(x()); }}",			c = writeProgram(program, real_b),			d = compileProgram(program),			e = runProgram(program)		in			if e <> 42 then				return "\nTest " ^ program ^ " failed with code: " ^ iToS(e) ^ Run(tl programs)			else				return "\nTest " ^ program ^ " success" ^ Run(tl programs);
functions	public iToS : int -> seq of char	iToS(i) == is not yet specified;
	public showType : int -> int	showType(type) == is not yet specified;
	public getSimpleNames : () -> seq of seq of char	getSimpleNames() == is not yet specified;
	public parseSimpleProgram : seq of char -> SimpleSpecification	parseSimpleProgram(filename) == is not yet specified;
	public writeProgram : seq of char * seq of char -> bool	writeProgram(fileName, contents) == is not yet specified;
	public compileProgram : seq of char -> bool	compileProgram(fileName) == is not yet specified;
	public runProgram : seq of char -> (int|bool)	runProgram(fileName) == is not yet specified;
end codegen_Util

~~~{% endraw %}

###VDMUtil.vdmpp

{% raw %}
~~~
class VDMUtil
-- 	Overture STANDARD LIBRARY: MiscUtils--      ---------------------------------------------- -- Standard library for the Overture Interpreter. When the interpreter-- evaluates the preliminary functions/operations in this file,-- corresponding internal functions is called instead of issuing a run-- time error. Signatures should not be changed, as well as name of-- module (VDM-SL) or class (VDM++). Pre/post conditions is -- fully user customisable. -- Dont care's may NOT be used in the parameter lists.
functions-- Converts a set argument into a sequence in non-deterministic order.static public set2seq[@T] : set of @T +> seq of @Tset2seq(x) == is not yet specified;
-- Returns a context information tuple which represents-- (fine_name * line_num * column_num * class_name * fnop_name) of corresponding source textstatic public get_file_pos : () +> [ seq of char * nat * nat * seq of char * seq of char ]get_file_pos() == is not yet specified;
-- Converts a VDM value into a seq of char.static public val2seq_of_char[@T] : @T +> seq of charval2seq_of_char(x) == is not yet specified;
-- converts VDM value in ASCII format into a VDM value-- RESULT.#1 = false implies a conversion failurestatic public seq_of_char2val[@p]:seq1 of char -> bool * [@p]seq_of_char2val(s) ==  is not yet specified  post let mk_(b,t) = RESULT in not b => t = nil;
end VDMUtil
class Afunctions	public f() r:[ seq of char * nat * nat * seq of char * seq of char ]		== VDMUtil`get_file_pos();
end A
~~~{% endraw %}

