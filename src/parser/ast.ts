export interface Visitor {
  Program(node: ProgramNode): void;
  Identifier(node: IdentifierNode): void;
  NumericLiteral(node: NumericLiteralNode): void;
  AssignmentExpression(node: AssignmentExpressionNode): void;
  ExpressionStatement(node: ExpressionStatementNode): void;
  FirstExpression(node: FirstExpressionNode): void;
  BinaryExpression(node: BinaryExpressionNode): void;
  VariableDeclaration(node: VariableDeclarationNode): void;
  BlockStatement(node: BlockStatementNode): void;
  IfStatement(node: IfStatementNode): void;
  WhileStatement(node: WhileStatementNode): void;
  ForStatement(node: ForStatementNode): void;
  UnaryExpression(node: UnaryExpressionNode): void;
  FunctionDeclaration(node: FunctionDeclarationNode): void;
  ReturnStatement(node: ReturnStatementNode): void;
  CallExpression(node: CallExpressionNode): void;
  BooleanLiteral(node: BooleanLiteralNode): void;
  StringLiteral(node: StringLiteralNode): void;
  LogicalExpression(node: LogicalExpressionNode): void;
  ArrayExpression(node: ArrayExpressionNode): void;
  ObjectExpression(node: ObjectExpressionNode): void;
  Property(node: PropertyNode): void;
  MemberExpression(node: MemberExpressionNode): void;
  ClassDeclaration(node: ClassDeclarationNode): void;
  MethodDefinition(node: MethodDefinitionNode): void;
  ThisExpression(node: ThisExpressionNode): void;
  NewExpression(node: NewExpressionNode): void;
}

export abstract class NodeBase {
  abstract type: string;
  abstract accept(visitor: Visitor): void;
}

export type Node = ProgramNode | IdentifierNode | NumericLiteralNode
    | AssignmentExpressionNode | ExpressionStatementNode | FirstExpressionNode
    | BinaryExpressionNode | VariableDeclarationNode | BlockStatementNode
    | IfStatementNode | WhileStatementNode | ForStatementNode | UnaryExpressionNode
    | FunctionDeclarationNode | ReturnStatementNode | CallExpressionNode | BooleanLiteralNode
    | StringLiteralNode | LogicalExpressionNode | ArrayExpressionNode | ObjectExpressionNode
    | PropertyNode | MemberExpressionNode | ClassDeclarationNode | MethodDefinitionNode
    | ThisExpressionNode | NewExpressionNode;

export class ProgramNode extends NodeBase {
  type: 'Program' = 'Program';
  body: Node[];

  constructor(body: Node[]) {
    super();
    this.body = body;
  }

  accept(visitor: Visitor) {
    visitor.Program(this);
    this.body.forEach((child: Node) => child.accept(visitor));
  }
}

export class IdentifierNode extends NodeBase {
  type: 'Identifier' = 'Identifier';
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  accept(visitor: Visitor) {
    visitor.Identifier(this);
  }
}

export class NumericLiteralNode extends NodeBase {
  type: 'NumericLiteral' = 'NumericLiteral';
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  accept(visitor: Visitor) {
    visitor.NumericLiteral(this);
  }
}

export class StringLiteralNode extends NodeBase {
  type: 'StringLiteral' = 'StringLiteral';
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  accept(visitor: Visitor) {
    visitor.StringLiteral(this);
  }
}

export class BooleanLiteralNode extends NodeBase {
  type: 'BooleanLiteral' = 'BooleanLiteral';
  value: boolean;

  constructor(value: boolean) {
    super();
    this.value = value;
  }

  accept(visitor: Visitor) {
    visitor.BooleanLiteral(this);
  }
}

export class AssignmentExpressionNode extends NodeBase {
  type: 'AssignmentExpression' = 'AssignmentExpression';
  left: Node; // Can be Identifier or MemberExpression
  right: Node;

  constructor(left: Node, right: Node) {
    super();
    this.left = left;
    this.right = right;
  }

  accept(visitor: Visitor) {
    this.left.accept(visitor);
    this.right.accept(visitor);
    visitor.AssignmentExpression(this);
  }
}

export class CallExpressionNode extends NodeBase {
  type: 'CallExpression' = 'CallExpression';
  callee: Node;
  arguments: Node[];

  constructor(callee: Node, args: Node[]) {
    super();
    this.callee = callee;
    this.arguments = args;
  }

  accept(visitor: Visitor) {
    visitor.CallExpression(this);
  }
}

export class ExpressionStatementNode extends NodeBase {
  type: 'ExpressionStatement' = 'ExpressionStatement';
  expression: Node;

  constructor(expression: Node) {
    super();
    this.expression = expression;
  }

  accept(visitor: Visitor) {
    this.expression.accept(visitor);
    visitor.ExpressionStatement(this);
  }
}

export class FirstExpressionNode extends NodeBase {
  type: 'FirstExpression' = 'FirstExpression';
  argument: Node;

  constructor(argument: Node) {
    super();
    this.argument = argument;
  }

  accept(visitor: Visitor) {
    visitor.FirstExpression(this);
  }
}

export class BinaryExpressionNode extends NodeBase {
  type: 'BinaryExpression' = 'BinaryExpression';
  operator: string;
  left: Node;
  right: Node;

  constructor(operator: string, left: Node, right: Node) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }

  accept(visitor: Visitor) {
    visitor.BinaryExpression(this);
  }
}

export class LogicalExpressionNode extends NodeBase {
  type: 'LogicalExpression' = 'LogicalExpression';
  operator: string;
  left: Node;
  right: Node;

  constructor(operator: string, left: Node, right: Node) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }

  accept(visitor: Visitor) {
    visitor.LogicalExpression(this);
  }
}

export class VariableDeclarationNode extends NodeBase {
  type: 'VariableDeclaration' = 'VariableDeclaration';
  identifier: IdentifierNode;
  initializer: Node | null;

  constructor(identifier: IdentifierNode, initializer: Node | null) {
    super();
    this.identifier = identifier;
    this.initializer = initializer;
  }

  accept(visitor: Visitor) {
    visitor.VariableDeclaration(this);
  }
}

export class FunctionDeclarationNode extends NodeBase {
  type: 'FunctionDeclaration' = 'FunctionDeclaration';
  name: IdentifierNode;
  params: IdentifierNode[];
  body: BlockStatementNode;

  constructor(name: IdentifierNode, params: IdentifierNode[], body: BlockStatementNode) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }

  accept(visitor: Visitor) {
    visitor.FunctionDeclaration(this);
  }
}

export class ReturnStatementNode extends NodeBase {
  type: 'ReturnStatement' = 'ReturnStatement';
  argument: Node | null;

  constructor(argument: Node | null) {
    super();
    this.argument = argument;
  }

  accept(visitor: Visitor) {
    visitor.ReturnStatement(this);
  }
}

export class BlockStatementNode extends NodeBase {
  type: 'BlockStatement' = 'BlockStatement';
  body: Node[];

  constructor(body: Node[]) {
    super();
    this.body = body;
  }

  accept(visitor: Visitor) {
    visitor.BlockStatement(this);
  }
}

export class IfStatementNode extends NodeBase {
  type: 'IfStatement' = 'IfStatement';
  test: Node;
  consequent: BlockStatementNode;
  alternate: IfStatementNode | BlockStatementNode | null;

  constructor(test: Node, consequent: BlockStatementNode, alternate: IfStatementNode | BlockStatementNode | null) {
    super();
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }

  accept(visitor: Visitor) {
    visitor.IfStatement(this);
  }
}

export class WhileStatementNode extends NodeBase {
  type: 'WhileStatement' = 'WhileStatement';
  test: Node;
  body: BlockStatementNode;

  constructor(test: Node, body: BlockStatementNode) {
    super();
    this.test = test;
    this.body = body;
  }

  accept(visitor: Visitor) {
    visitor.WhileStatement(this);
  }
}

export class ForStatementNode extends NodeBase {
  type: 'ForStatement' = 'ForStatement';
  init: Node | null;
  test: Node | null;
  update: Node | null;
  body: BlockStatementNode;

  constructor(init: Node | null, test: Node | null, update: Node | null, body: BlockStatementNode) {
    super();
    this.init = init;
    this.test = test;
    this.update = update;
    this.body = body;
  }

  accept(visitor: Visitor) {
    visitor.ForStatement(this);
  }
}

export class UnaryExpressionNode extends NodeBase {
  type: 'UnaryExpression' = 'UnaryExpression';
  operator: string;
  argument: Node;

  constructor(operator: string, argument: Node) {
    super();
    this.operator = operator;
    this.argument = argument;
  }

  accept(visitor: Visitor) {
    visitor.UnaryExpression(this);
  }
}

export class ArrayExpressionNode extends NodeBase {
  type: 'ArrayExpression' = 'ArrayExpression';
  elements: Node[];

  constructor(elements: Node[]) {
    super();
    this.elements = elements;
  }

  accept(visitor: Visitor) {
    visitor.ArrayExpression(this);
  }
}

export class MemberExpressionNode extends NodeBase {
  type: 'MemberExpression' = 'MemberExpression';
  object: Node;
  property: Node;
  computed: boolean; // true for foo[bar], false for foo.bar

  constructor(object: Node, property: Node, computed: boolean) {
    super();
    this.object = object;
    this.property = property;
    this.computed = computed;
  }

  accept(visitor: Visitor) {
    visitor.MemberExpression(this);
  }
}

export class ObjectExpressionNode extends NodeBase {
  type: 'ObjectExpression' = 'ObjectExpression';
  properties: PropertyNode[];

  constructor(properties: PropertyNode[]) {
    super();
    this.properties = properties;
  }

  accept(visitor: Visitor) {
    visitor.ObjectExpression(this);
  }
}

export class PropertyNode extends NodeBase {
  type: 'Property' = 'Property';
  key: IdentifierNode | StringLiteralNode;
  value: Node;

  constructor(key: IdentifierNode | StringLiteralNode, value: Node) {
    super();
    this.key = key;
    this.value = value;
  }

  accept(visitor: Visitor) {
    visitor.Property(this);
  }
}

export class ClassDeclarationNode extends NodeBase {
  type: 'ClassDeclaration' = 'ClassDeclaration';
  name: IdentifierNode;
  body: MethodDefinitionNode[];

  constructor(name: IdentifierNode, body: MethodDefinitionNode[]) {
    super();
    this.name = name;
    this.body = body;
  }

  accept(visitor: Visitor) {
    visitor.ClassDeclaration(this);
  }
}

export class MethodDefinitionNode extends NodeBase {
  type: 'MethodDefinition' = 'MethodDefinition';
  key: IdentifierNode;
  kind: 'constructor' | 'method';
  params: IdentifierNode[];
  body: BlockStatementNode;

  constructor(key: IdentifierNode, kind: 'constructor' | 'method', params: IdentifierNode[], body: BlockStatementNode) {
    super();
    this.key = key;
    this.kind = kind;
    this.params = params;
    this.body = body;
  }

  accept(visitor: Visitor) {
    visitor.MethodDefinition(this);
  }
}

export class ThisExpressionNode extends NodeBase {
  type: 'ThisExpression' = 'ThisExpression';

  constructor() {
    super();
  }

  accept(visitor: Visitor) {
    visitor.ThisExpression(this);
  }
}

export class NewExpressionNode extends NodeBase {
  type: 'NewExpression' = 'NewExpression';
  callee: Node;
  arguments: Node[];

  constructor(callee: Node, args: Node[]) {
    super();
    this.callee = callee;
    this.arguments = args;
  }

  accept(visitor: Visitor) {
    visitor.NewExpression(this);
  }
}
