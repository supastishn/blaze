"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewExpressionNode = exports.ThisExpressionNode = exports.MethodDefinitionNode = exports.ClassDeclarationNode = exports.PropertyNode = exports.ObjectExpressionNode = exports.MemberExpressionNode = exports.ArrayExpressionNode = exports.UnaryExpressionNode = exports.ForStatementNode = exports.WhileStatementNode = exports.IfStatementNode = exports.BlockStatementNode = exports.ReturnStatementNode = exports.FunctionDeclarationNode = exports.VariableDeclarationNode = exports.LogicalExpressionNode = exports.BinaryExpressionNode = exports.FirstExpressionNode = exports.ExpressionStatementNode = exports.CallExpressionNode = exports.AssignmentExpressionNode = exports.BooleanLiteralNode = exports.StringLiteralNode = exports.NumericLiteralNode = exports.IdentifierNode = exports.ProgramNode = exports.NodeBase = void 0;
class NodeBase {
}
exports.NodeBase = NodeBase;
class ProgramNode extends NodeBase {
    type = 'Program';
    body;
    constructor(body) {
        super();
        this.body = body;
    }
    accept(visitor) {
        visitor.Program(this);
        this.body.forEach((child) => child.accept(visitor));
    }
}
exports.ProgramNode = ProgramNode;
class IdentifierNode extends NodeBase {
    type = 'Identifier';
    name;
    constructor(name) {
        super();
        this.name = name;
    }
    accept(visitor) {
        visitor.Identifier(this);
    }
}
exports.IdentifierNode = IdentifierNode;
class NumericLiteralNode extends NodeBase {
    type = 'NumericLiteral';
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        visitor.NumericLiteral(this);
    }
}
exports.NumericLiteralNode = NumericLiteralNode;
class StringLiteralNode extends NodeBase {
    type = 'StringLiteral';
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        visitor.StringLiteral(this);
    }
}
exports.StringLiteralNode = StringLiteralNode;
class BooleanLiteralNode extends NodeBase {
    type = 'BooleanLiteral';
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        visitor.BooleanLiteral(this);
    }
}
exports.BooleanLiteralNode = BooleanLiteralNode;
class AssignmentExpressionNode extends NodeBase {
    type = 'AssignmentExpression';
    left; // Can be Identifier or MemberExpression
    right;
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    accept(visitor) {
        this.left.accept(visitor);
        this.right.accept(visitor);
        visitor.AssignmentExpression(this);
    }
}
exports.AssignmentExpressionNode = AssignmentExpressionNode;
class CallExpressionNode extends NodeBase {
    type = 'CallExpression';
    callee;
    arguments;
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.arguments = args;
    }
    accept(visitor) {
        visitor.CallExpression(this);
    }
}
exports.CallExpressionNode = CallExpressionNode;
class ExpressionStatementNode extends NodeBase {
    type = 'ExpressionStatement';
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        this.expression.accept(visitor);
        visitor.ExpressionStatement(this);
    }
}
exports.ExpressionStatementNode = ExpressionStatementNode;
class FirstExpressionNode extends NodeBase {
    type = 'FirstExpression';
    argument;
    constructor(argument) {
        super();
        this.argument = argument;
    }
    accept(visitor) {
        visitor.FirstExpression(this);
    }
}
exports.FirstExpressionNode = FirstExpressionNode;
class BinaryExpressionNode extends NodeBase {
    type = 'BinaryExpression';
    operator;
    left;
    right;
    constructor(operator, left, right) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    accept(visitor) {
        visitor.BinaryExpression(this);
    }
}
exports.BinaryExpressionNode = BinaryExpressionNode;
class LogicalExpressionNode extends NodeBase {
    type = 'LogicalExpression';
    operator;
    left;
    right;
    constructor(operator, left, right) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    accept(visitor) {
        visitor.LogicalExpression(this);
    }
}
exports.LogicalExpressionNode = LogicalExpressionNode;
class VariableDeclarationNode extends NodeBase {
    type = 'VariableDeclaration';
    identifier;
    initializer;
    constructor(identifier, initializer) {
        super();
        this.identifier = identifier;
        this.initializer = initializer;
    }
    accept(visitor) {
        visitor.VariableDeclaration(this);
    }
}
exports.VariableDeclarationNode = VariableDeclarationNode;
class FunctionDeclarationNode extends NodeBase {
    type = 'FunctionDeclaration';
    name;
    params;
    body;
    constructor(name, params, body) {
        super();
        this.name = name;
        this.params = params;
        this.body = body;
    }
    accept(visitor) {
        visitor.FunctionDeclaration(this);
    }
}
exports.FunctionDeclarationNode = FunctionDeclarationNode;
class ReturnStatementNode extends NodeBase {
    type = 'ReturnStatement';
    argument;
    constructor(argument) {
        super();
        this.argument = argument;
    }
    accept(visitor) {
        visitor.ReturnStatement(this);
    }
}
exports.ReturnStatementNode = ReturnStatementNode;
class BlockStatementNode extends NodeBase {
    type = 'BlockStatement';
    body;
    constructor(body) {
        super();
        this.body = body;
    }
    accept(visitor) {
        visitor.BlockStatement(this);
    }
}
exports.BlockStatementNode = BlockStatementNode;
class IfStatementNode extends NodeBase {
    type = 'IfStatement';
    test;
    consequent;
    alternate;
    constructor(test, consequent, alternate) {
        super();
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
    accept(visitor) {
        visitor.IfStatement(this);
    }
}
exports.IfStatementNode = IfStatementNode;
class WhileStatementNode extends NodeBase {
    type = 'WhileStatement';
    test;
    body;
    constructor(test, body) {
        super();
        this.test = test;
        this.body = body;
    }
    accept(visitor) {
        visitor.WhileStatement(this);
    }
}
exports.WhileStatementNode = WhileStatementNode;
class ForStatementNode extends NodeBase {
    type = 'ForStatement';
    init;
    test;
    update;
    body;
    constructor(init, test, update, body) {
        super();
        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
    }
    accept(visitor) {
        visitor.ForStatement(this);
    }
}
exports.ForStatementNode = ForStatementNode;
class UnaryExpressionNode extends NodeBase {
    type = 'UnaryExpression';
    operator;
    argument;
    constructor(operator, argument) {
        super();
        this.operator = operator;
        this.argument = argument;
    }
    accept(visitor) {
        visitor.UnaryExpression(this);
    }
}
exports.UnaryExpressionNode = UnaryExpressionNode;
class ArrayExpressionNode extends NodeBase {
    type = 'ArrayExpression';
    elements;
    constructor(elements) {
        super();
        this.elements = elements;
    }
    accept(visitor) {
        visitor.ArrayExpression(this);
    }
}
exports.ArrayExpressionNode = ArrayExpressionNode;
class MemberExpressionNode extends NodeBase {
    type = 'MemberExpression';
    object;
    property;
    computed; // true for foo[bar], false for foo.bar
    constructor(object, property, computed) {
        super();
        this.object = object;
        this.property = property;
        this.computed = computed;
    }
    accept(visitor) {
        visitor.MemberExpression(this);
    }
}
exports.MemberExpressionNode = MemberExpressionNode;
class ObjectExpressionNode extends NodeBase {
    type = 'ObjectExpression';
    properties;
    constructor(properties) {
        super();
        this.properties = properties;
    }
    accept(visitor) {
        visitor.ObjectExpression(this);
    }
}
exports.ObjectExpressionNode = ObjectExpressionNode;
class PropertyNode extends NodeBase {
    type = 'Property';
    key;
    value;
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
    }
    accept(visitor) {
        visitor.Property(this);
    }
}
exports.PropertyNode = PropertyNode;
class ClassDeclarationNode extends NodeBase {
    type = 'ClassDeclaration';
    name;
    body;
    constructor(name, body) {
        super();
        this.name = name;
        this.body = body;
    }
    accept(visitor) {
        visitor.ClassDeclaration(this);
    }
}
exports.ClassDeclarationNode = ClassDeclarationNode;
class MethodDefinitionNode extends NodeBase {
    type = 'MethodDefinition';
    key;
    kind;
    params;
    body;
    constructor(key, kind, params, body) {
        super();
        this.key = key;
        this.kind = kind;
        this.params = params;
        this.body = body;
    }
    accept(visitor) {
        visitor.MethodDefinition(this);
    }
}
exports.MethodDefinitionNode = MethodDefinitionNode;
class ThisExpressionNode extends NodeBase {
    type = 'ThisExpression';
    constructor() {
        super();
    }
    accept(visitor) {
        visitor.ThisExpression(this);
    }
}
exports.ThisExpressionNode = ThisExpressionNode;
class NewExpressionNode extends NodeBase {
    type = 'NewExpression';
    callee;
    arguments;
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.arguments = args;
    }
    accept(visitor) {
        visitor.NewExpression(this);
    }
}
exports.NewExpressionNode = NewExpressionNode;
