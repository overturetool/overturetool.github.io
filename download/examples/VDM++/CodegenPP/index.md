---
layout: default
title: CodegenPP
---

## CodegenPP
Author: Johannes Ulfkjær Jensen, Jon Nielsen and Leni Lausdahl


This example is produced by a group of students as a part
of a VDM course given at the Engineering College of Aarhus. 
This model describes how to do code generation from a small 
applicative language called Simple to a subset of Java (called
Geraffe). This example also illustrates how one can make use
of Java jar files as a part of a VDM model supported by
Overture.  

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| classic|
|Entry point     :| new codegen_Util().Run()|


### GiraffeBasicTypeImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeBasicTypeImpl is subclass of GiraffeBasicType

end GiraffeBasicTypeImpl
~~~
{% endraw %}

### GiraffeBinaryExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeBinaryExpressionImpl is subclass of GiraffeBinaryExpression
instance variables
    private iv_lhs:GiraffeExpression;
    private iv_op:GiraffeBinaryOperator;
    private iv_rhs:GiraffeExpression;

operations
    public GiraffeBinaryExpressionImpl: GiraffeExpression * GiraffeBinaryOperator * GiraffeExpression ==> GiraffeBinaryExpressionImpl
    GiraffeBinaryExpressionImpl(p_lhs, p_op, p_rhs) ==
    (
        iv_lhs := p_lhs;
        iv_op := p_op;
        iv_rhs := p_rhs;
    );

    public getLhs: () ==> GiraffeExpression
    getLhs() == return iv_lhs;

    public getOp: () ==> GiraffeBinaryOperator
    getOp() == return iv_op;

    public getRhs: () ==> GiraffeExpression
    getRhs() == return iv_rhs;

end GiraffeBinaryExpressionImpl
~~~
{% endraw %}

### GiraffeBinaryOperatorImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeBinaryOperatorImpl is subclass of GiraffeBinaryOperator

end GiraffeBinaryOperatorImpl
~~~
{% endraw %}

### GiraffeBooleanLiteralExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeBooleanLiteralExpressionImpl is subclass of GiraffeBooleanLiteralExpression
instance variables
    private iv_value:bool;

operations
    public GiraffeBooleanLiteralExpressionImpl: bool ==> GiraffeBooleanLiteralExpressionImpl
    GiraffeBooleanLiteralExpressionImpl(p_value) ==
    (
        iv_value := p_value;
    );

    public getValue: () ==> bool
    getValue() == return iv_value;

end GiraffeBooleanLiteralExpressionImpl
~~~
{% endraw %}

### GiraffeCaseAlternativeImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeCaseAlternativeImpl is subclass of GiraffeCaseAlternative
instance variables
    private iv_test:GiraffeExpression;
    private iv_exp:GiraffeExpression;

operations
    public GiraffeCaseAlternativeImpl: GiraffeExpression * GiraffeExpression ==> GiraffeCaseAlternativeImpl
    GiraffeCaseAlternativeImpl(p_test, p_exp) ==
    (
        iv_test := p_test;
        iv_exp := p_exp;
    );

    public getTest: () ==> GiraffeExpression
    getTest() == return iv_test;

    public getExp: () ==> GiraffeExpression
    getExp() == return iv_exp;

end GiraffeCaseAlternativeImpl
~~~
{% endraw %}

### GiraffeCasesExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeCasesExpressionImpl is subclass of GiraffeCasesExpression
instance variables
    private iv_test:GiraffeExpression;
    private iv_alts:seq of GiraffeCaseAlternative;
    private iv_deflt:[GiraffeExpression];

operations
    public GiraffeCasesExpressionImpl: GiraffeExpression * seq of GiraffeCaseAlternative * [GiraffeExpression] ==> GiraffeCasesExpressionImpl
    GiraffeCasesExpressionImpl(p_test, p_alts, p_deflt) ==
    (
        iv_test := p_test;
        iv_alts := p_alts;
        iv_deflt := p_deflt;
    );

    public getTest: () ==> GiraffeExpression
    getTest() == return iv_test;

    public getAlts: () ==> seq of GiraffeCaseAlternative
    getAlts() == return iv_alts;

    public hasDeflt: () ==> bool
    hasDeflt() == return (iv_deflt = nil);

    public getDeflt: () ==> GiraffeExpression
    getDeflt() == return iv_deflt;

end GiraffeCasesExpressionImpl
~~~
{% endraw %}

### GiraffeClassDefinitionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeClassDefinitionImpl is subclass of GiraffeClassDefinition
instance variables
    private iv_name:GiraffeIdentifier;
    private iv_methods:set of GiraffeMethodDefinition;

operations
    public GiraffeClassDefinitionImpl: GiraffeIdentifier * set of GiraffeMethodDefinition ==> GiraffeClassDefinitionImpl
    GiraffeClassDefinitionImpl(p_name, p_methods) ==
    (
        iv_name := p_name;
        iv_methods := p_methods;
    );

    public getName: () ==> GiraffeIdentifier
    getName() == return iv_name;

    public getMethods: () ==> set of GiraffeMethodDefinition
    getMethods() == return iv_methods;

end GiraffeClassDefinitionImpl
~~~
{% endraw %}

### GiraffeDoubleLiteralExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeDoubleLiteralExpressionImpl is subclass of GiraffeDoubleLiteralExpression
instance variables
    private iv_value:real;

operations
    public GiraffeDoubleLiteralExpressionImpl: real ==> GiraffeDoubleLiteralExpressionImpl
    GiraffeDoubleLiteralExpressionImpl(p_value) ==
    (
        iv_value := p_value;
    );

    public getValue: () ==> real
    getValue() == return iv_value;

end GiraffeDoubleLiteralExpressionImpl
~~~
{% endraw %}

### GiraffeElseIfExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Thu Mar 11 11:27:03 CET 2010
--

class GiraffeElseIfExpressionImpl is subclass of GiraffeElseIfExpression
instance variables
    private iv_test:GiraffeExpression;
    private iv_thn:GiraffeExpression;

operations
    public GiraffeElseIfExpressionImpl: GiraffeExpression * GiraffeExpression ==> GiraffeElseIfExpressionImpl
    GiraffeElseIfExpressionImpl(p_test, p_thn) ==
    (
        iv_test := p_test;
        iv_thn := p_thn;
    );

    public getTest: () ==> GiraffeExpression
    getTest() == return iv_test;

    public getThn: () ==> GiraffeExpression
    getThn() == return iv_thn;

end GiraffeElseIfExpressionImpl
~~~
{% endraw %}

### GiraffeExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeExpressionImpl is subclass of GiraffeNodeImpl
    -- empty
end GiraffeExpressionImpl
~~~
{% endraw %}

### GiraffeIdentifierImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeIdentifierImpl is subclass of GiraffeIdentifier
instance variables
    private iv_name:seq of char;

operations
    public GiraffeIdentifierImpl: seq of char ==> GiraffeIdentifierImpl
    GiraffeIdentifierImpl(p_name) ==
    (
        iv_name := p_name;
    );

    public getName: () ==> seq of char
    getName() == return iv_name;

end GiraffeIdentifierImpl
~~~
{% endraw %}

### GiraffeIfExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeIfExpressionImpl is subclass of GiraffeIfExpression
instance variables
    private iv_test:GiraffeExpression;
    private iv_thn:GiraffeExpression;
    private iv_els:GiraffeExpression;

operations
    public GiraffeIfExpressionImpl: GiraffeExpression * GiraffeExpression * GiraffeExpression ==> GiraffeIfExpressionImpl
    GiraffeIfExpressionImpl(p_test, p_thn, p_els) ==
    (
        iv_test := p_test;
        iv_thn := p_thn;
        iv_els := p_els;
    );

    public getTest: () ==> GiraffeExpression
    getTest() == return iv_test;

    public getThn: () ==> GiraffeExpression
    getThn() == return iv_thn;

    public getEls: () ==> GiraffeExpression
    getEls() == return iv_els;

end GiraffeIfExpressionImpl
~~~
{% endraw %}

### GiraffeIntegerLiteralExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeIntegerLiteralExpressionImpl is subclass of GiraffeIntegerLiteralExpression
instance variables
    private iv_value:int;

operations
    public GiraffeIntegerLiteralExpressionImpl: int ==> GiraffeIntegerLiteralExpressionImpl
    GiraffeIntegerLiteralExpressionImpl(p_value) ==
    (
        iv_value := p_value;
    );

    public getValue: () ==> int
    getValue() == return iv_value;

end GiraffeIntegerLiteralExpressionImpl
~~~
{% endraw %}

### GiraffeLiteralExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeLiteralExpressionImpl is subclass of GiraffeExpressionImpl
    -- empty
end GiraffeLiteralExpressionImpl
~~~
{% endraw %}

### GiraffeMethodDefinitionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeMethodDefinitionImpl is subclass of GiraffeMethodDefinition
instance variables
    private iv_name:GiraffeIdentifier;
    private iv_parameters:seq of GiraffeParameter;
    private iv_type:GiraffeType;
    private iv_body:seq of GiraffeStatement;

operations
    public GiraffeMethodDefinitionImpl: GiraffeIdentifier * seq of GiraffeParameter * GiraffeType * seq of GiraffeStatement ==> GiraffeMethodDefinitionImpl
    GiraffeMethodDefinitionImpl(p_name, p_parameters, p_type, p_body) ==
    (
        iv_name := p_name;
        iv_parameters := p_parameters;
        iv_type := p_type;
        iv_body := p_body;
    );

    public getName: () ==> GiraffeIdentifier
    getName() == return iv_name;

    public getParameters: () ==> seq of GiraffeParameter
    getParameters() == return iv_parameters;

    public getType: () ==> GiraffeType
    getType() == return iv_type;

    public getBody: () ==> seq of GiraffeStatement
    getBody() == return iv_body;

end GiraffeMethodDefinitionImpl
~~~
{% endraw %}

### GiraffeNodeImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeNodeImpl
    -- empty
end GiraffeNodeImpl
~~~
{% endraw %}

### GiraffeParameterImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeParameterImpl is subclass of GiraffeParameter
instance variables
    private iv_type:GiraffeType;
    private iv_name:GiraffeIdentifier;

operations
    public GiraffeParameterImpl: GiraffeType * GiraffeIdentifier ==> GiraffeParameterImpl
    GiraffeParameterImpl(p_type, p_name) ==
    (
        iv_type := p_type;
        iv_name := p_name;
    );

    public getType: () ==> GiraffeType
    getType() == return iv_type;

    public getName: () ==> GiraffeIdentifier
    getName() == return iv_name;

end GiraffeParameterImpl
~~~
{% endraw %}

### GiraffeReturnStatementImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeReturnStatementImpl is subclass of GiraffeReturnStatement
instance variables
    private iv_value:GiraffeExpression;

operations
    public GiraffeReturnStatementImpl: GiraffeExpression ==> GiraffeReturnStatementImpl
    GiraffeReturnStatementImpl(p_value) ==
    (
        iv_value := p_value;
    );

    public getValue: () ==> GiraffeExpression
    getValue() == return iv_value;

end GiraffeReturnStatementImpl
~~~
{% endraw %}

### GiraffeSpecificationImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeSpecificationImpl is subclass of GiraffeSpecification
instance variables
    private iv_clazz:GiraffeClassDefinition;

operations
    public GiraffeSpecificationImpl: GiraffeClassDefinition ==> GiraffeSpecificationImpl
    GiraffeSpecificationImpl(p_clazz) ==
    (
        iv_clazz := p_clazz;
    );

    public getClazz: () ==> GiraffeClassDefinition
    getClazz() == return iv_clazz;

end GiraffeSpecificationImpl
~~~
{% endraw %}

### GiraffeStatementImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeStatementImpl is subclass of GiraffeNodeImpl
    -- empty
end GiraffeStatementImpl
~~~
{% endraw %}

### GiraffeTypeImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeTypeImpl is subclass of GiraffeNodeImpl
    -- empty
end GiraffeTypeImpl
~~~
{% endraw %}

### GiraffeUnaryExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeUnaryExpressionImpl is subclass of GiraffeUnaryExpression
instance variables
    private iv_op:GiraffeUnaryOperator;
    private iv_exp:GiraffeExpression;

operations
    public GiraffeUnaryExpressionImpl: GiraffeUnaryOperator * GiraffeExpression ==> GiraffeUnaryExpressionImpl
    GiraffeUnaryExpressionImpl(p_op, p_exp) ==
    (
        iv_op := p_op;
        iv_exp := p_exp;
    );

    public getOp: () ==> GiraffeUnaryOperator
    getOp() == return iv_op;

    public getExp: () ==> GiraffeExpression
    getExp() == return iv_exp;

end GiraffeUnaryExpressionImpl
~~~
{% endraw %}

### GiraffeUnaryOperatorImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeUnaryOperatorImpl is subclass of GiraffeUnaryOperator

end GiraffeUnaryOperatorImpl
~~~
{% endraw %}

### GiraffeVariableDeclStatementImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeVariableDeclStatementImpl is subclass of GiraffeVariableDeclStatement
instance variables
    private iv_type:GiraffeType;
    private iv_name:GiraffeIdentifier;
    private iv_value:GiraffeExpression;

operations
    public GiraffeVariableDeclStatementImpl: GiraffeType * GiraffeIdentifier * GiraffeExpression ==> GiraffeVariableDeclStatementImpl
    GiraffeVariableDeclStatementImpl(p_type, p_name, p_value) ==
    (
        iv_type := p_type;
        iv_name := p_name;
        iv_value := p_value;
    );

    public getType: () ==> GiraffeType
    getType() == return iv_type;

    public getName: () ==> GiraffeIdentifier
    getName() == return iv_name;

    public getValue: () ==> GiraffeExpression
    getValue() == return iv_value;

end GiraffeVariableDeclStatementImpl
~~~
{% endraw %}

### GiraffeVariableExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:16 CET 2010
--

class GiraffeVariableExpressionImpl is subclass of GiraffeVariableExpression
instance variables
    private iv_name:GiraffeIdentifier;

operations
    public GiraffeVariableExpressionImpl: GiraffeIdentifier ==> GiraffeVariableExpressionImpl
    GiraffeVariableExpressionImpl(p_name) ==
    (
        iv_name := p_name;
    );

    public getName: () ==> GiraffeIdentifier
    getName() == return iv_name;

end GiraffeVariableExpressionImpl
~~~
{% endraw %}

### GiraffeBasicType.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeBasicType is subclass of GiraffeType
values
    public BOOL = new GiraffeBasicType("BOOL");
    public DOUBLE = new GiraffeBasicType("DOUBLE");
    public INT = new GiraffeBasicType("INT");

instance variables
    public name:[seq of char] := nil;

operations
    public GiraffeBasicType: seq of char ==> GiraffeBasicType
    GiraffeBasicType(n) == name := n;

end GiraffeBasicType
~~~
{% endraw %}

### GiraffeBinaryExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeBinaryExpression is subclass of GiraffeExpression
operations
    public getLhs: () ==> GiraffeExpression
    getLhs() == is subclass responsibility;

    public getOp: () ==> GiraffeBinaryOperator
    getOp() == is subclass responsibility;

    public getRhs: () ==> GiraffeExpression
    getRhs() == is subclass responsibility;

end GiraffeBinaryExpression
~~~
{% endraw %}

### GiraffeBinaryOperator.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeBinaryOperator is subclass of GiraffeNode
values
    public AND = new GiraffeBinaryOperator("AND");
    public DIV = new GiraffeBinaryOperator("DIV");
    public EQUALS = new GiraffeBinaryOperator("EQUALS");
    public GE = new GiraffeBinaryOperator("GE");
    public GT = new GiraffeBinaryOperator("GT");
    public LE = new GiraffeBinaryOperator("LE");
    public LT = new GiraffeBinaryOperator("LT");
    public MINUS = new GiraffeBinaryOperator("MINUS");
    public MOD = new GiraffeBinaryOperator("MOD");
    public NE = new GiraffeBinaryOperator("NE");
    public OR = new GiraffeBinaryOperator("OR");
    public PLUS = new GiraffeBinaryOperator("PLUS");
    public TIMES = new GiraffeBinaryOperator("TIMES");

instance variables
    public name:[seq of char] := nil;

operations
    public GiraffeBinaryOperator: seq of char ==> GiraffeBinaryOperator
    GiraffeBinaryOperator(n) == name := n;

end GiraffeBinaryOperator
~~~
{% endraw %}

### GiraffeBooleanLiteralExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeBooleanLiteralExpression is subclass of GiraffeLiteralExpression
operations
    public getValue: () ==> bool
    getValue() == is subclass responsibility;

end GiraffeBooleanLiteralExpression
~~~
{% endraw %}

### GiraffeCaseAlternative.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeCaseAlternative is subclass of GiraffeNode
operations
    public getTest: () ==> GiraffeExpression
    getTest() == is subclass responsibility;

    public getExp: () ==> GiraffeExpression
    getExp() == is subclass responsibility;

end GiraffeCaseAlternative
~~~
{% endraw %}

### GiraffeCasesExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeCasesExpression is subclass of GiraffeExpression
operations
    public getTest: () ==> GiraffeExpression
    getTest() == is subclass responsibility;

    public getAlts: () ==> seq of GiraffeCaseAlternative
    getAlts() == is subclass responsibility;

    public hasDeflt: () ==> bool
    hasDeflt() == is subclass responsibility;

    public getDeflt: () ==> GiraffeExpression
    getDeflt() == is subclass responsibility;

end GiraffeCasesExpression
~~~
{% endraw %}

### GiraffeClassDefinition.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeClassDefinition is subclass of GiraffeNode
operations
    public getName: () ==> GiraffeIdentifier
    getName() == is subclass responsibility;

    public getMethods: () ==> set of GiraffeMethodDefinition
    getMethods() == is subclass responsibility;

end GiraffeClassDefinition
~~~
{% endraw %}

### GiraffeDoubleLiteralExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeDoubleLiteralExpression is subclass of GiraffeLiteralExpression
operations
    public getValue: () ==> real
    getValue() == is subclass responsibility;

end GiraffeDoubleLiteralExpression
~~~
{% endraw %}

### GiraffeElseIfExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Thu Mar 11 11:27:03 CET 2010
--

class GiraffeElseIfExpression is subclass of GiraffeNode
operations
    public getTest: () ==> GiraffeExpression
    getTest() == is subclass responsibility;

    public getThn: () ==> GiraffeExpression
    getThn() == is subclass responsibility;

end GiraffeElseIfExpression
~~~
{% endraw %}

### GiraffeExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeExpression is subclass of GiraffeNode
    -- Abstract
end GiraffeExpression
~~~
{% endraw %}

### GiraffeIdentifier.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeIdentifier is subclass of GiraffeType
operations
    public getName: () ==> seq of char
    getName() == is subclass responsibility;

end GiraffeIdentifier
~~~
{% endraw %}

### GiraffeIfExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeIfExpression is subclass of GiraffeExpression
operations
    public getTest: () ==> GiraffeExpression
    getTest() == is subclass responsibility;

    public getThn: () ==> GiraffeExpression
    getThn() == is subclass responsibility;

    public getEls: () ==> GiraffeExpression
    getEls() == is subclass responsibility;

end GiraffeIfExpression
~~~
{% endraw %}

### GiraffeIntegerLiteralExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeIntegerLiteralExpression is subclass of GiraffeLiteralExpression
operations
    public getValue: () ==> int
    getValue() == is subclass responsibility;

end GiraffeIntegerLiteralExpression
~~~
{% endraw %}

### GiraffeLiteralExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeLiteralExpression is subclass of GiraffeExpression
    -- Abstract
end GiraffeLiteralExpression
~~~
{% endraw %}

### GiraffeMethodDefinition.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeMethodDefinition is subclass of GiraffeNode
operations
    public getName: () ==> GiraffeIdentifier
    getName() == is subclass responsibility;

    public getParameters: () ==> seq of GiraffeParameter
    getParameters() == is subclass responsibility;

    public getType: () ==> GiraffeType
    getType() == is subclass responsibility;

    public getBody: () ==> seq of GiraffeStatement
    getBody() == is subclass responsibility;

end GiraffeMethodDefinition
~~~
{% endraw %}

### GiraffeNode.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeNode
    -- Abstract
end GiraffeNode
~~~
{% endraw %}

### GiraffeParameter.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeParameter is subclass of GiraffeNode
operations
    public getType: () ==> GiraffeType
    getType() == is subclass responsibility;

    public getName: () ==> GiraffeIdentifier
    getName() == is subclass responsibility;

end GiraffeParameter
~~~
{% endraw %}

### GiraffeReturnStatement.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeReturnStatement is subclass of GiraffeStatement
operations
    public getValue: () ==> GiraffeExpression
    getValue() == is subclass responsibility;

end GiraffeReturnStatement
~~~
{% endraw %}

### GiraffeSpecification.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeSpecification is subclass of GiraffeNode
operations
    public getClazz: () ==> GiraffeClassDefinition
    getClazz() == is subclass responsibility;

end GiraffeSpecification
~~~
{% endraw %}

### GiraffeStatement.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeStatement is subclass of GiraffeNode
    -- Abstract
end GiraffeStatement
~~~
{% endraw %}

### GiraffeType.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeType is subclass of GiraffeNode
    -- Abstract
end GiraffeType
~~~
{% endraw %}

### GiraffeUnaryExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeUnaryExpression is subclass of GiraffeExpression
operations
    public getOp: () ==> GiraffeUnaryOperator
    getOp() == is subclass responsibility;

    public getExp: () ==> GiraffeExpression
    getExp() == is subclass responsibility;

end GiraffeUnaryExpression
~~~
{% endraw %}

### GiraffeUnaryOperator.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeUnaryOperator is subclass of GiraffeNode
values
    public MINUS = new GiraffeUnaryOperator("MINUS");
    public NOT = new GiraffeUnaryOperator("NOT");
    public PLUS = new GiraffeUnaryOperator("PLUS");

instance variables
    public name:[seq of char] := nil;

operations
    public GiraffeUnaryOperator: seq of char ==> GiraffeUnaryOperator
    GiraffeUnaryOperator(n) == name := n;

end GiraffeUnaryOperator
~~~
{% endraw %}

### GiraffeVariableDeclStatement.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeVariableDeclStatement is subclass of GiraffeStatement
operations
    public getType: () ==> GiraffeType
    getType() == is subclass responsibility;

    public getName: () ==> GiraffeIdentifier
    getName() == is subclass responsibility;

    public getValue: () ==> GiraffeExpression
    getValue() == is subclass responsibility;

end GiraffeVariableDeclStatement
~~~
{% endraw %}

### GiraffeVariableExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 13:43:15 CET 2010
--

class GiraffeVariableExpression is subclass of GiraffeExpression
operations
    public getName: () ==> GiraffeIdentifier
    getName() == is subclass responsibility;

end GiraffeVariableExpression
~~~
{% endraw %}

### SimpleApplyExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleApplyExpressionImpl is subclass of SimpleApplyExpression
instance variables
    private iv_func:SimpleExpression;
    private iv_args:seq of SimpleExpression;

operations
    public SimpleApplyExpressionImpl: SimpleExpression * seq of SimpleExpression ==> SimpleApplyExpressionImpl
    SimpleApplyExpressionImpl(p_func, p_args) ==
    (
        iv_func := p_func;
        iv_args := p_args;
    );

    public getFunc: () ==> SimpleExpression
    getFunc() == return iv_func;

    public getArgs: () ==> seq of SimpleExpression
    getArgs() == return iv_args;

end SimpleApplyExpressionImpl
~~~
{% endraw %}

### SimpleBasicTypeImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleBasicTypeImpl is subclass of SimpleBasicType

end SimpleBasicTypeImpl
~~~
{% endraw %}

### SimpleBinaryExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleBinaryExpressionImpl is subclass of SimpleBinaryExpression
instance variables
    private iv_lhs:SimpleExpression;
    private iv_op:SimpleBinaryOperator;
    private iv_rhs:SimpleExpression;

operations
    public SimpleBinaryExpressionImpl: SimpleExpression * SimpleBinaryOperator * SimpleExpression ==> SimpleBinaryExpressionImpl
    SimpleBinaryExpressionImpl(p_lhs, p_op, p_rhs) ==
    (
        iv_lhs := p_lhs;
        iv_op := p_op;
        iv_rhs := p_rhs;
    );

    public getLhs: () ==> SimpleExpression
    getLhs() == return iv_lhs;

    public getOp: () ==> SimpleBinaryOperator
    getOp() == return iv_op;

    public getRhs: () ==> SimpleExpression
    getRhs() == return iv_rhs;

end SimpleBinaryExpressionImpl
~~~
{% endraw %}

### SimpleBinaryOperatorImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleBinaryOperatorImpl is subclass of SimpleBinaryOperator

end SimpleBinaryOperatorImpl
~~~
{% endraw %}

### SimpleBooleanLiteralExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleBooleanLiteralExpressionImpl is subclass of SimpleBooleanLiteralExpression
instance variables
    private iv_value:bool;

operations
    public SimpleBooleanLiteralExpressionImpl: bool ==> SimpleBooleanLiteralExpressionImpl
    SimpleBooleanLiteralExpressionImpl(p_value) ==
    (
        iv_value := p_value;
    );

    public getValue: () ==> bool
    getValue() == return iv_value;

end SimpleBooleanLiteralExpressionImpl
~~~
{% endraw %}

### SimpleCaseAlternativeImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleCaseAlternativeImpl is subclass of SimpleCaseAlternative
instance variables
    private iv_test:SimpleExpression;
    private iv_exp:SimpleExpression;

operations
    public SimpleCaseAlternativeImpl: SimpleExpression * SimpleExpression ==> SimpleCaseAlternativeImpl
    SimpleCaseAlternativeImpl(p_test, p_exp) ==
    (
        iv_test := p_test;
        iv_exp := p_exp;
    );

    public getTest: () ==> SimpleExpression
    getTest() == return iv_test;

    public getExp: () ==> SimpleExpression
    getExp() == return iv_exp;

end SimpleCaseAlternativeImpl
~~~
{% endraw %}

### SimpleCasesExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleCasesExpressionImpl is subclass of SimpleCasesExpression
instance variables
    private iv_test:SimpleExpression;
    private iv_alts:seq of SimpleCaseAlternative;
    private iv_deflt:[SimpleExpression];

operations
    public SimpleCasesExpressionImpl: SimpleExpression * seq of SimpleCaseAlternative * [SimpleExpression] ==> SimpleCasesExpressionImpl
    SimpleCasesExpressionImpl(p_test, p_alts, p_deflt) ==
    (
        iv_test := p_test;
        iv_alts := p_alts;
        iv_deflt := p_deflt;
    );

    public getTest: () ==> SimpleExpression
    getTest() == return iv_test;

    public getAlts: () ==> seq of SimpleCaseAlternative
    getAlts() == return iv_alts;

    public hasDeflt: () ==> bool
    hasDeflt() == return (iv_deflt = nil);

    public getDeflt: () ==> SimpleExpression
    getDeflt() == return iv_deflt;

end SimpleCasesExpressionImpl
~~~
{% endraw %}

### SimpleDefinitionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleDefinitionImpl is subclass of SimpleNodeImpl
    -- empty
end SimpleDefinitionImpl
~~~
{% endraw %}

### SimpleElseIfExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleElseIfExpressionImpl is subclass of SimpleElseIfExpression
instance variables
    private iv_test:SimpleExpression;
    private iv_thn:SimpleExpression;

operations
    public SimpleElseIfExpressionImpl: SimpleExpression * SimpleExpression ==> SimpleElseIfExpressionImpl
    SimpleElseIfExpressionImpl(p_test, p_thn) ==
    (
        iv_test := p_test;
        iv_thn := p_thn;
    );

    public getTest: () ==> SimpleExpression
    getTest() == return iv_test;

    public getThn: () ==> SimpleExpression
    getThn() == return iv_thn;

end SimpleElseIfExpressionImpl
~~~
{% endraw %}

### SimpleExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleExpressionImpl is subclass of SimpleNodeImpl
    -- empty
end SimpleExpressionImpl
~~~
{% endraw %}

### SimpleFunctionDefinitionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleFunctionDefinitionImpl is subclass of SimpleFunctionDefinition
instance variables
    private iv_name:SimpleIdentifier;
    private iv_params:seq of SimpleParameter;
    private iv_body:SimpleExpression;

operations
    public SimpleFunctionDefinitionImpl: SimpleIdentifier * seq of SimpleParameter * SimpleExpression ==> SimpleFunctionDefinitionImpl
    SimpleFunctionDefinitionImpl(p_name, p_params, p_body) ==
    (
        iv_name := p_name;
        iv_params := p_params;
        iv_body := p_body;
    );

    public getName: () ==> SimpleIdentifier
    getName() == return iv_name;

    public getParams: () ==> seq of SimpleParameter
    getParams() == return iv_params;

    public getBody: () ==> SimpleExpression
    getBody() == return iv_body;

end SimpleFunctionDefinitionImpl
~~~
{% endraw %}

### SimpleIdentifierImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleIdentifierImpl is subclass of SimpleIdentifier
instance variables
    private iv_name:seq of char;

operations
    public SimpleIdentifierImpl: seq of char ==> SimpleIdentifierImpl
    SimpleIdentifierImpl(p_name) ==
    (
        iv_name := p_name;
    );

    public getName: () ==> seq of char
    getName() == return iv_name;

end SimpleIdentifierImpl
~~~
{% endraw %}

### SimpleIfExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleIfExpressionImpl is subclass of SimpleIfExpression
instance variables
    private iv_test:SimpleExpression;
    private iv_thn:SimpleExpression;
    private iv_elif:seq of SimpleElseIfExpression;
    private iv_ese:SimpleExpression;

operations
    public SimpleIfExpressionImpl: SimpleExpression * SimpleExpression * seq of SimpleElseIfExpression * SimpleExpression ==> SimpleIfExpressionImpl
    SimpleIfExpressionImpl(p_test, p_thn, p_elif, p_ese) ==
    (
        iv_test := p_test;
        iv_thn := p_thn;
        iv_elif := p_elif;
        iv_ese := p_ese;
    );

    public getTest: () ==> SimpleExpression
    getTest() == return iv_test;

    public getThn: () ==> SimpleExpression
    getThn() == return iv_thn;

    public getElif: () ==> seq of SimpleElseIfExpression
    getElif() == return iv_elif;

    public getEse: () ==> SimpleExpression
    getEse() == return iv_ese;

end SimpleIfExpressionImpl
~~~
{% endraw %}

### SimpleIntegerLiteralExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleIntegerLiteralExpressionImpl is subclass of SimpleIntegerLiteralExpression
instance variables
    private iv_value:int;

operations
    public SimpleIntegerLiteralExpressionImpl: int ==> SimpleIntegerLiteralExpressionImpl
    SimpleIntegerLiteralExpressionImpl(p_value) ==
    (
        iv_value := p_value;
    );

    public getValue: () ==> int
    getValue() == return iv_value;

end SimpleIntegerLiteralExpressionImpl
~~~
{% endraw %}

### SimpleLetExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleLetExpressionImpl is subclass of SimpleLetExpression
instance variables
    private iv_defs:seq of SimpleLocalDefinition;
    private iv_body:SimpleExpression;

operations
    public SimpleLetExpressionImpl: seq of SimpleLocalDefinition * SimpleExpression ==> SimpleLetExpressionImpl
    SimpleLetExpressionImpl(p_defs, p_body) ==
    (
        iv_defs := p_defs;
        iv_body := p_body;
    );

    public getDefs: () ==> seq of SimpleLocalDefinition
    getDefs() == return iv_defs;

    public getBody: () ==> SimpleExpression
    getBody() == return iv_body;

end SimpleLetExpressionImpl
~~~
{% endraw %}

### SimpleLiteralExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleLiteralExpressionImpl is subclass of SimpleExpressionImpl
    -- empty
end SimpleLiteralExpressionImpl
~~~
{% endraw %}

### SimpleLocalDefinitionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleLocalDefinitionImpl is subclass of SimpleLocalDefinition
instance variables
    private iv_name:SimpleIdentifier;
    private iv_value:SimpleExpression;

operations
    public SimpleLocalDefinitionImpl: SimpleIdentifier * SimpleExpression ==> SimpleLocalDefinitionImpl
    SimpleLocalDefinitionImpl(p_name, p_value) ==
    (
        iv_name := p_name;
        iv_value := p_value;
    );

    public getName: () ==> SimpleIdentifier
    getName() == return iv_name;

    public getValue: () ==> SimpleExpression
    getValue() == return iv_value;

end SimpleLocalDefinitionImpl
~~~
{% endraw %}

### SimpleNodeImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleNodeImpl
    -- empty
end SimpleNodeImpl
~~~
{% endraw %}

### SimpleParameterImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleParameterImpl is subclass of SimpleParameter
instance variables
    private iv_name:SimpleIdentifier;
    private iv_type:SimpleType;

operations
    public SimpleParameterImpl: SimpleIdentifier * SimpleType ==> SimpleParameterImpl
    SimpleParameterImpl(p_name, p_type) ==
    (
        iv_name := p_name;
        iv_type := p_type;
    );

    public getName: () ==> SimpleIdentifier
    getName() == return iv_name;

    public getType: () ==> SimpleType
    getType() == return iv_type;

end SimpleParameterImpl
~~~
{% endraw %}

### SimpleRealLiteralExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleRealLiteralExpressionImpl is subclass of SimpleRealLiteralExpression
instance variables
    private iv_value:real;

operations
    public SimpleRealLiteralExpressionImpl: real ==> SimpleRealLiteralExpressionImpl
    SimpleRealLiteralExpressionImpl(p_value) ==
    (
        iv_value := p_value;
    );

    public getValue: () ==> real
    getValue() == return iv_value;

end SimpleRealLiteralExpressionImpl
~~~
{% endraw %}

### SimpleSpecificationImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleSpecificationImpl is subclass of SimpleSpecification
instance variables
    private iv_defs:seq of SimpleDefinition;

operations
    public SimpleSpecificationImpl: seq of SimpleDefinition ==> SimpleSpecificationImpl
    SimpleSpecificationImpl(p_defs) ==
    (
        iv_defs := p_defs;
    );

    public getDefs: () ==> seq of SimpleDefinition
    getDefs() == return iv_defs;

end SimpleSpecificationImpl
~~~
{% endraw %}

### SimpleTypeDefinitionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleTypeDefinitionImpl is subclass of SimpleTypeDefinition
instance variables
    private iv_name:SimpleIdentifier;
    private iv_type:SimpleType;

operations
    public SimpleTypeDefinitionImpl: SimpleIdentifier * SimpleType ==> SimpleTypeDefinitionImpl
    SimpleTypeDefinitionImpl(p_name, p_type) ==
    (
        iv_name := p_name;
        iv_type := p_type;
    );

    public getName: () ==> SimpleIdentifier
    getName() == return iv_name;

    public getType: () ==> SimpleType
    getType() == return iv_type;

end SimpleTypeDefinitionImpl
~~~
{% endraw %}

### SimpleTypeImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleTypeImpl is subclass of SimpleNodeImpl
    -- empty
end SimpleTypeImpl
~~~
{% endraw %}

### SimpleUnaryExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleUnaryExpressionImpl is subclass of SimpleUnaryExpression
instance variables
    private iv_op:SimpleUnaryOperator;
    private iv_exp:SimpleExpression;

operations
    public SimpleUnaryExpressionImpl: SimpleUnaryOperator * SimpleExpression ==> SimpleUnaryExpressionImpl
    SimpleUnaryExpressionImpl(p_op, p_exp) ==
    (
        iv_op := p_op;
        iv_exp := p_exp;
    );

    public getOp: () ==> SimpleUnaryOperator
    getOp() == return iv_op;

    public getExp: () ==> SimpleExpression
    getExp() == return iv_exp;

end SimpleUnaryExpressionImpl
~~~
{% endraw %}

### SimpleUnaryOperatorImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleUnaryOperatorImpl is subclass of SimpleUnaryOperator

end SimpleUnaryOperatorImpl
~~~
{% endraw %}

### SimpleVariableExpressionImpl.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:55 CET 2010
--

class SimpleVariableExpressionImpl is subclass of SimpleVariableExpression
instance variables
    private iv_name:SimpleIdentifier;

operations
    public SimpleVariableExpressionImpl: SimpleIdentifier ==> SimpleVariableExpressionImpl
    SimpleVariableExpressionImpl(p_name) ==
    (
        iv_name := p_name;
    );

    public getName: () ==> SimpleIdentifier
    getName() == return iv_name;

end SimpleVariableExpressionImpl
~~~
{% endraw %}

### SimpleApplyExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleApplyExpression is subclass of SimpleExpression
operations
    public getFunc: () ==> SimpleExpression
    getFunc() == is subclass responsibility;

    public getArgs: () ==> seq of SimpleExpression
    getArgs() == is subclass responsibility;

end SimpleApplyExpression
~~~
{% endraw %}

### SimpleBasicType.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleBasicType is subclass of SimpleType
values
    public BOOL = new SimpleBasicType("BOOL");
    public INT = new SimpleBasicType("INT");
    public NAT = new SimpleBasicType("NAT");
    public REAL = new SimpleBasicType("REAL");

instance variables
    public name:[seq of char] := nil;

operations
    public SimpleBasicType: seq of char ==> SimpleBasicType
    SimpleBasicType(n) == name := n;

end SimpleBasicType
~~~
{% endraw %}

### SimpleBinaryExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleBinaryExpression is subclass of SimpleExpression
operations
    public getLhs: () ==> SimpleExpression
    getLhs() == is subclass responsibility;

    public getOp: () ==> SimpleBinaryOperator
    getOp() == is subclass responsibility;

    public getRhs: () ==> SimpleExpression
    getRhs() == is subclass responsibility;

end SimpleBinaryExpression
~~~
{% endraw %}

### SimpleBinaryOperator.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleBinaryOperator is subclass of SimpleNode
values
    public AND = new SimpleBinaryOperator("AND");
    public DIV = new SimpleBinaryOperator("DIV");
    public DIVIDE = new SimpleBinaryOperator("DIVIDE");
    public EQUALS = new SimpleBinaryOperator("EQUALS");
    public EQUIVALENT = new SimpleBinaryOperator("EQUIVALENT");
    public GE = new SimpleBinaryOperator("GE");
    public GT = new SimpleBinaryOperator("GT");
    public IMPLIES = new SimpleBinaryOperator("IMPLIES");
    public LE = new SimpleBinaryOperator("LE");
    public LT = new SimpleBinaryOperator("LT");
    public MINUS = new SimpleBinaryOperator("MINUS");
    public MOD = new SimpleBinaryOperator("MOD");
    public NE = new SimpleBinaryOperator("NE");
    public OR = new SimpleBinaryOperator("OR");
    public PLUS = new SimpleBinaryOperator("PLUS");
    public REM = new SimpleBinaryOperator("REM");
    public TIMES = new SimpleBinaryOperator("TIMES");

instance variables
    public name:[seq of char] := nil;

operations
    public SimpleBinaryOperator: seq of char ==> SimpleBinaryOperator
    SimpleBinaryOperator(n) == name := n;

end SimpleBinaryOperator
~~~
{% endraw %}

### SimpleBooleanLiteralExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleBooleanLiteralExpression is subclass of SimpleLiteralExpression
operations
    public getValue: () ==> bool
    getValue() == is subclass responsibility;

end SimpleBooleanLiteralExpression
~~~
{% endraw %}

### SimpleCaseAlternative.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleCaseAlternative is subclass of SimpleNode
operations
    public getTest: () ==> SimpleExpression
    getTest() == is subclass responsibility;

    public getExp: () ==> SimpleExpression
    getExp() == is subclass responsibility;

end SimpleCaseAlternative
~~~
{% endraw %}

### SimpleCasesExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleCasesExpression is subclass of SimpleExpression
operations
    public getTest: () ==> SimpleExpression
    getTest() == is subclass responsibility;

    public getAlts: () ==> seq of SimpleCaseAlternative
    getAlts() == is subclass responsibility;

    public hasDeflt: () ==> bool
    hasDeflt() == is subclass responsibility;

    public getDeflt: () ==> SimpleExpression
    getDeflt() == is subclass responsibility;

end SimpleCasesExpression
~~~
{% endraw %}

### SimpleDefinition.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleDefinition is subclass of SimpleNode
    -- Abstract
end SimpleDefinition
~~~
{% endraw %}

### SimpleElseIfExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleElseIfExpression is subclass of SimpleNode
operations
    public getTest: () ==> SimpleExpression
    getTest() == is subclass responsibility;

    public getThn: () ==> SimpleExpression
    getThn() == is subclass responsibility;

end SimpleElseIfExpression
~~~
{% endraw %}

### SimpleExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleExpression is subclass of SimpleNode
    -- Abstract
end SimpleExpression
~~~
{% endraw %}

### SimpleFunctionDefinition.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleFunctionDefinition is subclass of SimpleDefinition
operations
    public getName: () ==> SimpleIdentifier
    getName() == is subclass responsibility;

    public getParams: () ==> seq of SimpleParameter
    getParams() == is subclass responsibility;

    public getBody: () ==> SimpleExpression
    getBody() == is subclass responsibility;

end SimpleFunctionDefinition
~~~
{% endraw %}

### SimpleIdentifier.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleIdentifier is subclass of SimpleType
operations
    public getName: () ==> seq of char
    getName() == is subclass responsibility;

end SimpleIdentifier
~~~
{% endraw %}

### SimpleIfExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleIfExpression is subclass of SimpleExpression
operations
    public getTest: () ==> SimpleExpression
    getTest() == is subclass responsibility;

    public getThn: () ==> SimpleExpression
    getThn() == is subclass responsibility;

    public getElif: () ==> seq of SimpleElseIfExpression
    getElif() == is subclass responsibility;

    public getEse: () ==> SimpleExpression
    getEse() == is subclass responsibility;

end SimpleIfExpression
~~~
{% endraw %}

### SimpleIntegerLiteralExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleIntegerLiteralExpression is subclass of SimpleLiteralExpression
operations
    public getValue: () ==> int
    getValue() == is subclass responsibility;

end SimpleIntegerLiteralExpression
~~~
{% endraw %}

### SimpleLetExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleLetExpression is subclass of SimpleExpression
operations
    public getDefs: () ==> seq of SimpleLocalDefinition
    getDefs() == is subclass responsibility;

    public getBody: () ==> SimpleExpression
    getBody() == is subclass responsibility;

end SimpleLetExpression
~~~
{% endraw %}

### SimpleLiteralExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleLiteralExpression is subclass of SimpleExpression
    -- Abstract
end SimpleLiteralExpression
~~~
{% endraw %}

### SimpleLocalDefinition.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleLocalDefinition is subclass of SimpleNode
operations
    public getName: () ==> SimpleIdentifier
    getName() == is subclass responsibility;

    public getValue: () ==> SimpleExpression
    getValue() == is subclass responsibility;

end SimpleLocalDefinition
~~~
{% endraw %}

### SimpleNode.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleNode
    -- Abstract
end SimpleNode
~~~
{% endraw %}

### SimpleParameter.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleParameter is subclass of SimpleNode
operations
    public getName: () ==> SimpleIdentifier
    getName() == is subclass responsibility;

    public getType: () ==> SimpleType
    getType() == is subclass responsibility;

end SimpleParameter
~~~
{% endraw %}

### SimpleRealLiteralExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleRealLiteralExpression is subclass of SimpleLiteralExpression
operations
    public getValue: () ==> real
    getValue() == is subclass responsibility;

end SimpleRealLiteralExpression
~~~
{% endraw %}

### SimpleSpecification.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleSpecification is subclass of SimpleNode
operations
    public getDefs: () ==> seq of SimpleDefinition
    getDefs() == is subclass responsibility;

end SimpleSpecification
~~~
{% endraw %}

### SimpleType.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleType is subclass of SimpleNode
    -- Abstract
end SimpleType
~~~
{% endraw %}

### SimpleTypeDefinition.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleTypeDefinition is subclass of SimpleDefinition
operations
    public getName: () ==> SimpleIdentifier
    getName() == is subclass responsibility;

    public getType: () ==> SimpleType
    getType() == is subclass responsibility;

end SimpleTypeDefinition
~~~
{% endraw %}

### SimpleUnaryExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleUnaryExpression is subclass of SimpleExpression
operations
    public getOp: () ==> SimpleUnaryOperator
    getOp() == is subclass responsibility;

    public getExp: () ==> SimpleExpression
    getExp() == is subclass responsibility;

end SimpleUnaryExpression
~~~
{% endraw %}

### SimpleUnaryOperator.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleUnaryOperator is subclass of SimpleNode
values
    public MINUS = new SimpleUnaryOperator("MINUS");
    public NOT = new SimpleUnaryOperator("NOT");
    public PLUS = new SimpleUnaryOperator("PLUS");

instance variables
    public name:[seq of char] := nil;

operations
    public SimpleUnaryOperator: seq of char ==> SimpleUnaryOperator
    SimpleUnaryOperator(n) == name := n;

end SimpleUnaryOperator
~~~
{% endraw %}

### SimpleVariableExpression.vdmpp

{% raw %}
~~~
--
-- Created automatically by VDMJ ASTgen. DO NOT EDIT.
-- Wed Mar 17 17:56:54 CET 2010
--

class SimpleVariableExpression is subclass of SimpleExpression
operations
    public getName: () ==> SimpleIdentifier
    getName() == is subclass responsibility;

end SimpleVariableExpression
~~~
{% endraw %}

### Codegen.vdmpp

{% raw %}
~~~
class Codegen
	types
	
	values
	
	instance variables
	
	operations
	
	public Generate : GiraffeSpecification ==> seq of char
	Generate(spec) ==
		let clazz : GiraffeClassDefinition = spec.getClazz(),
			genClasses : seq of char = Generate(clazz)
		in	
			return conc ["public class ", genClasses];

	public Generate : GiraffeClassDefinition ==> seq of char
	Generate(classDef) ==
		let methods : set of GiraffeMethodDefinition = classDef.getMethods(),
			mlist : seq of GiraffeMethodDefinition = VDMUtil`set2seq[GiraffeMethodDefinition](methods),
			genMethods : seq of char = conc [Generate(mlist(i)) | i in set inds mlist]
		in
			return conc [classDef.getName().getName(), " { ", genMethods];--, " } "];
		
	public Generate : GiraffeMethodDefinition ==> seq of char
	Generate(method) ==
		let params : seq of GiraffeParameter = method.getParameters(),
			genParams : seq of char = conc tail(conc [[", ", Generate(params(i))] | i in set inds params]),
			body : seq of GiraffeStatement = method.getBody(),
			genBody : seq of char = conc conc [[Generate(body(i)), ";"] | i in set inds body]
		in	return conc ["public static ", Generate(method.getType()), " ", Generate(method.getName()), "(", genParams, ")", "{", genBody, "}"];
	
	public Generate : GiraffeParameter ==> seq of char
	Generate(param) == return conc [Generate(param.getType()), " ", param.getName().getName()];
	
	public Generate : GiraffeType ==> seq of char
	Generate(type) ==
		if isofclass(GiraffeIdentifier, type) then
			let i : GiraffeIdentifier = type
			in return i.getName()
		else
			let t : GiraffeBasicType = type
			in 
				cases t.name:
					"INT"	-> return "int",
					"DOUBLE"-> return "double",
					"BOOL"	-> return "boolean",
					others -> error
				end;
	
	public Generate : GiraffeStatement ==> seq of char
	Generate(stm) == 
		cases (true):
			(isofclass(GiraffeVariableDeclStatement, stm)) ->
				let s : GiraffeVariableDeclStatement = stm
				in	return conc [Generate(s.getType()), " ", Generate(s.getName()), " = ", GenerateExpression(s.getValue())],
			(isofclass(GiraffeReturnStatement, stm)) ->	let	s : GiraffeReturnStatement = stm
														in	return conc ["return ", GenerateExpression(s.getValue())],
			others -> error
		end;
	
	public GenerateExpression : GiraffeExpression ==> seq of char
	GenerateExpression(exp) ==
		cases (true):
			(isofclass(GiraffeIntegerLiteralExpression, exp)) ->
				let	e : GiraffeIntegerLiteralExpression = exp
				in 	return new codegen_Util().iToS(e.getValue()),
			(isofclass(GiraffeVariableExpression, exp)) ->
				let	e : GiraffeVariableExpression = exp
				in return e.getName().getName(),
			(isofclass(GiraffeBinaryExpression, exp)) -> 
				let e : GiraffeBinaryExpression = exp
				in return GenerateBinaryExpression(e),
			(isofclass(GiraffeIfExpression, exp)) ->
				let e : GiraffeIfExpression = exp
				in return " ( (" ^ GenerateExpression(e.getTest()) ^ ") ? (" ^ GenerateExpression(e.getThn()) ^ ") : (" ^ GenerateExpression(e.getEls()) ^ ") ) ",
				others -> error
		end;
	
	public GenerateBinaryExpression : GiraffeBinaryExpression ==> seq of char
	GenerateBinaryExpression(binexp) ==
		let op : GiraffeBinaryOperator = binexp.getOp(),
			lhs : GiraffeExpression = binexp.getLhs(),
			rhs : GiraffeExpression = binexp.getRhs()
		in
			cases op.name:
				("EQUALS") -> return " ( " ^ GenerateExpression(lhs) ^ " == " ^ GenerateExpression(rhs) ^ " ) ",
				("PLUS") -> return " ( " ^ GenerateExpression(lhs) ^ " + " ^ GenerateExpression(rhs) ^ " ) ",
				others -> error
			end;
			
	functions
	
	public tail : seq of seq of char -> seq of seq of char
	tail(x) == 
		if (x = []) then
			[]
		else
			tl x;
	
end Codegen
~~~
{% endraw %}

### Compiler.vdmpp

{% raw %}
~~~
class Compiler
	types

	values
	util : codegen_Util = new codegen_Util();
	
	instance variables
	
	typeDefs : seq of SimpleTypeDefinition := [];
	
	context : map seq of char to seq of char := {|->};
	inv card dom context = card rng context;
	
	varDecls : seq of GiraffeVariableDeclStatement := [];
	
	uid : nat1 := 1;
	
	operations
	
private getUniqeName : () ==> seq of char
getUniqeName() == let res = uid
				in (uid := uid + 1;
				return "v" ^ util.iToS(res))
post RESULT not in set rng context;

private getUniqeSimpleName : () ==> seq of char
getUniqeSimpleName() == 
(
	while true do
	(
		let name : seq of char = getUniqeName() -- Use it as a source of new string     
		in 
			if (name not in set dom context) then
				return name
	);

	return ""
)
post RESULT not in set dom context;

public Compile : seq of char * SimpleSpecification ==> GiraffeSpecification
Compile(programName, spec) ==
	let name : GiraffeIdentifier = new GiraffeIdentifierImpl(programName),
		defs : seq of SimpleDefinition = spec.getDefs(),
		functionz : set of GiraffeMethodDefinition = {Compile(defs(i)) 
													 | i in set inds defs 
													 & isofclass(SimpleFunctionDefinition, defs(i))},
		classDef : GiraffeClassDefinition = new GiraffeClassDefinitionImpl(name, functionz)
	in 
		(typeDefs := [defs(i) | i in set inds defs & isofclass(SimpleTypeDefinition, defs(i))];
		return new GiraffeSpecificationImpl(classDef))
pre len programName > 0 and programName(1) not in set {'0','1','2','3','4','5','6','7','8','9'};

public Compile : SimpleFunctionDefinition ==> GiraffeMethodDefinition
Compile(func) ==
	let name : GiraffeIdentifier = new GiraffeIdentifierImpl(func.getName().getName()),
		defs : seq of SimpleParameter = func.getParams(),
		params : seq of GiraffeParameter = [Compile(defs(i)) 
										   | i in set inds defs],
		type : GiraffeType = Compile(GetType(func.getBody())),
		body : seq of GiraffeStatement = varDecls ^ [new GiraffeReturnStatementImpl(Compile(func.getBody()))]
	in (varDecls := [];
		return new GiraffeMethodDefinitionImpl(name, params, type, body))
pre varDecls = [] and context = {|->}
post varDecls = [] and context = {|->};

public Compile : SimpleParameter ==> GiraffeParameter
Compile(param) ==
	let name : GiraffeIdentifier = new GiraffeIdentifierImpl(param.getName().getName()),
		type : GiraffeType = Compile(param.getType())
	in return new GiraffeParameterImpl(type, name);

public Compile : SimpleType ==> [GiraffeType]
Compile(type) ==
		if isofclass(SimpleIdentifier, type) then
			let t : SimpleIdentifier = type
			in return Compile(GetBasicType(t))--new GiraffeIdentifierImpl(t.getName())
		else
			let t : SimpleBasicType = type
			in 
				cases t.name:
					"INT" 	-> return GiraffeBasicType`INT,
					others -> return nil
				end
post RESULT <> nil;

public Compile : SimpleExpression ==> [GiraffeExpression]
Compile(exp) ==
	cases true:
		(isofclass(SimpleIntegerLiteralExpression, exp)) -> let e : SimpleIntegerLiteralExpression = exp
																	in return new GiraffeIntegerLiteralExpressionImpl(e.getValue()),
		(isofclass(SimpleBinaryExpression, exp)) -> let e : SimpleBinaryExpression = exp
															in return Compile(e.getOp(), e.getLhs(), e.getRhs()),
		(isofclass(SimpleCasesExpression, exp)) -> let e : SimpleCasesExpression = exp
													in return CompileCases(e),
		(isofclass(SimpleVariableExpression, exp)) ->	let e : SimpleVariableExpression = exp,
															name : SimpleIdentifier = e.getName()
														in	return new GiraffeVariableExpressionImpl(new GiraffeIdentifierImpl(context(name.getName()))),
		(isofclass(SimpleLetExpression, exp)) ->	let e : SimpleLetExpression = exp
													in return CompileLet(e),
		(isofclass(SimpleIfExpression, exp)) -> let e : SimpleIfExpression = exp
													in return CompileIf(e),
		others -> return nil
	end
post RESULT <> nil;

public CompileCases : SimpleCasesExpression ==> GiraffeExpression
CompileCases(e) ==
	let testVarName : SimpleIdentifier = new SimpleIdentifierImpl(getUniqeSimpleName()),
		testVar : SimpleVariableExpression = new SimpleVariableExpressionImpl(testVarName),
		testVarAss : SimpleLocalDefinition = new SimpleLocalDefinitionImpl(testVarName, e.getTest()),
		letBody : SimpleExpression = 
			if e.getAlts() = [] then
				e.getDeflt()
			else
				let first : SimpleCaseAlternative = hd e.getAlts(),
					ifTest : SimpleBinaryExpression = new SimpleBinaryExpressionImpl(testVar, SimpleBinaryOperator`EQUALS, first.getTest()),
					rest : seq of SimpleCaseAlternative = tl e.getAlts(),
					elsIfs : seq of SimpleElseIfExpression = [new SimpleElseIfExpressionImpl(new SimpleBinaryExpressionImpl(testVar, SimpleBinaryOperator`EQUALS, rest(i).getTest()), rest(i).getExp()) | i in set inds rest]
				in 
					new SimpleIfExpressionImpl(ifTest, first.getExp(), elsIfs, e.getDeflt())
	in return Compile(new SimpleLetExpressionImpl([testVarAss], letBody))
pre not e.hasDeflt(); -- Empty defaults not allowed as we do not want to implement runtime errors.
-- not operator used due to a bug in ASTGEN

public CompileLet : SimpleLetExpression ==> GiraffeExpression
CompileLet(letExp) ==
	let oldContext : map seq of char to seq of char = context
	in (for x in letExp.getDefs() do
			let name : seq of char = x.getName().getName(),
				newName : seq of char = getUniqeName(),
				type : SimpleType = GetType(x.getValue()),
				gType : GiraffeType = Compile(type),
				gName : GiraffeIdentifier = new GiraffeIdentifierImpl(newName),
				gValue : GiraffeExpression = Compile(x.getValue()),
				gStm : GiraffeVariableDeclStatement = new GiraffeVariableDeclStatementImpl(gType, gName, gValue)
			in (context := context ++ {name |-> newName};
				varDecls := varDecls ^ [gStm];);
		let body : GiraffeExpression =  Compile(letExp.getBody())
		in (context := oldContext; return body;))
pre letExp.getDefs() <> [];

public Compile : SimpleBinaryOperator * SimpleExpression * SimpleExpression ==> [GiraffeBinaryExpression]
Compile(op, lhs, rhs) ==
	cases op.name:
		"EQUALS" -> let	glhs : GiraffeExpression = Compile(lhs),
						gop : GiraffeBinaryOperator = GiraffeBinaryOperator`EQUALS,
						grhs : GiraffeExpression = Compile(rhs)
					in return new GiraffeBinaryExpressionImpl(glhs, gop, grhs),

		"PLUS" -> let	glhs : GiraffeExpression = Compile(lhs),
						gop : GiraffeBinaryOperator = GiraffeBinaryOperator`PLUS,
						grhs : GiraffeExpression = Compile(rhs)
				in return new GiraffeBinaryExpressionImpl(glhs, gop, grhs),
		others -> 
				return nil
	end
post RESULT <> nil;

public GetType : SimpleExpression ==> SimpleType
GetType(exp) ==
	return SimpleBasicType`INT;
	
public GetBasicType : SimpleType ==> SimpleBasicType
GetBasicType(type) ==
	return SimpleBasicType`INT;

functions

public CompileIf : SimpleIfExpression -> GiraffeIfExpression
CompileIf(selif) ==
let
	gTest : GiraffeExpression = Compile(selif.getTest()),
	gThen : GiraffeExpression = Compile(selif.getThn()),
	gElse : GiraffeExpression = deflatten(selif.getElif(), selif.getEse())
	in
		new GiraffeIfExpressionImpl(gTest,gThen,gElse);

public deflatten : seq of SimpleElseIfExpression * SimpleExpression -> GiraffeExpression
deflatten(elsif, els) ==
	if (elsif = []) then
		Compile(els)
	else
		let head : SimpleElseIfExpression = hd elsif,
			gTest : GiraffeExpression = Compile(head.getTest()),
			gThen : GiraffeExpression = Compile(head.getThn()),
			gElse : GiraffeExpression = deflatten(tl elsif, els)
		in new GiraffeIfExpressionImpl(gTest, gThen, gElse);
		
end Compiler
~~~
{% endraw %}

### nativetest.vdmpp

{% raw %}
~~~
class codegen_Util

instance variables

compiler : Compiler := new Compiler();
codegen : Codegen := new Codegen();
--io : IO := new IO();

operations

public Run : () ==> (bool|int|seq of char)
Run() ==
	let programs = getSimpleNames() in
	Run(programs);
				
public Run : seq of seq of char ==> seq of char
Run(programs) ==
	if programs = [] then
		return []
	else
		let
			program = hd programs,
			z = parseSimpleProgram(program),
			a = compiler.Compile(program, z),
			b = codegen.Generate(a),
			real_b = b ^ " public static void main(String[] argv){ System.exit(x()); }}",
			c = writeProgram(program, real_b),
			d = compileProgram(program),
			e = runProgram(program)
		in
			if e <> 42 then
				return "\nTest " ^ program ^ " failed with code: " ^ iToS(e) ^ Run(tl programs)
			else
				return "\nTest " ^ program ^ " success" ^ Run(tl programs);
	
functions
	public iToS : int -> seq of char
	iToS(i) == is not yet specified;

	public showType : int -> int
	showType(type) == is not yet specified;

	public getSimpleNames : () -> seq of seq of char
	getSimpleNames() == is not yet specified;

	public parseSimpleProgram : seq of char -> SimpleSpecification
	parseSimpleProgram(filename) == is not yet specified;
	
	public writeProgram : seq of char * seq of char -> bool
	writeProgram(fileName, contents) == is not yet specified;
	
	public compileProgram : seq of char -> bool
	compileProgram(fileName) == is not yet specified;
	
	public runProgram : seq of char -> (int|bool)
	runProgram(fileName) == is not yet specified;
	
end codegen_Util

~~~
{% endraw %}

### returnConstInt.vdmpp

{% raw %}
~~~
class returnConstInt
values
public returnConstInt = 
new SimpleSpecificationImpl([
    new SimpleFunctionDefinitionImpl(new SimpleIdentifierImpl("x"),
        [
        ],
        new SimpleIntegerLiteralExpressionImpl(13))
])
;
end returnConstInt
~~~
{% endraw %}

### VDMUtil.vdmpp

{% raw %}
~~~
class VDMUtil

-- 	Overture STANDARD LIBRARY: MiscUtils
--      --------------------------------------------
-- 
-- Standard library for the Overture Interpreter. When the interpreter
-- evaluates the preliminary functions/operations in this file,
-- corresponding internal functions is called instead of issuing a run
-- time error. Signatures should not be changed, as well as name of
-- module (VDM-SL) or class (VDM++). Pre/post conditions is 
-- fully user customisable. 
-- Dont care's may NOT be used in the parameter lists.

functions
-- Converts a set argument into a sequence in non-deterministic order.
static public set2seq[@T] : set of @T +> seq of @T
set2seq(x) == is not yet specified;

-- Returns a context information tuple which represents
-- (fine_name * line_num * column_num * class_name * fnop_name) of corresponding source text
static public get_file_pos : () +> [ seq of char * nat * nat * seq of char * seq of char ]
get_file_pos() == is not yet specified;

-- Converts a VDM value into a seq of char.
static public val2seq_of_char[@T] : @T +> seq of char
val2seq_of_char(x) == is not yet specified;

-- converts VDM value in ASCII format into a VDM value
-- RESULT.#1 = false implies a conversion failure
static public seq_of_char2val[@p]:seq1 of char -> bool * [@p]
seq_of_char2val(s) ==
  is not yet specified
  post let mk_(b,t) = RESULT in not b => t = nil;

end VDMUtil

class A
functions
	public f() r:[ seq of char * nat * nat * seq of char * seq of char ]
		== VDMUtil`get_file_pos();
	
end A
~~~
{% endraw %}

