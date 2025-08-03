export interface Visitor {
  Program(node: ProgramNode): void;
  Identifier(node: IdentifierNode): void;
  NumericLiteral(node: NumericLiteralNode): void;
  AssignmentExpression(node: AssignmentExpressionNode): void;
  ExpressionStatement(node: ExpressionStatementNode): void;
  FirstExpression(node: FirstExpressionNode): void;
  BinaryExpression(node: BinaryExpressionNode): void;
  VariableDeclaration(node: VariableDeclarationNode): void;
  PrintStatement(node: PrintStatementNode): void;
  BlockStatement(node: BlockStatementNode): void;
  IfStatement(node: IfStatementNode): void;
  WhileStatement(node: WhileStatementNode): void;
  ForStatement(node: ForStatementNode): void;
  UnaryExpression(node: UnaryExpressionNode): void;
  FunctionDeclaration(node: FunctionDeclarationNode): void;
  ReturnStatement(node: ReturnStatementNode): void;
  CallExpression(node: CallExpressionNode): void;
}

// Add accept() methods to all node interfaces
export interface NodeBase {
  type: string;
  accept(visitor: Visitor): void;
}

export type Node = ProgramNode | IdentifierNode | NumericLiteralNode
    | AssignmentExpressionNode | ExpressionStatementNode | FirstExpressionNode
    | BinaryExpressionNode | VariableDeclarationNode | PrintStatementNode | BlockStatementNode
    | IfStatementNode | WhileStatementNode | ForStatementNode | UnaryExpressionNode
    | FunctionDeclarationNode | ReturnStatementNode | CallExpressionNode;

export interface ProgramNode extends NodeBase {
  type: 'Program';
  body: Node[];
}

export interface IdentifierNode extends NodeBase {
  type: 'Identifier';
  name: string;
}

export interface NumericLiteralNode extends NodeBase {
  type: 'NumericLiteral';
  value: number;
}

export interface AssignmentExpressionNode extends NodeBase {
  type: 'AssignmentExpression';
  left: IdentifierNode;
  right: Node;
}

export interface CallExpressionNode extends NodeBase {
  type: 'CallExpression';
  callee: Node;
  arguments: Node[];
}

export interface ExpressionStatementNode extends NodeBase {
  type: 'ExpressionStatement';
  expression: Node;
}

export interface FirstExpressionNode extends NodeBase {
  type: 'FirstExpression';
  argument: Node;
}

export interface BinaryExpressionNode extends NodeBase {
  type: 'BinaryExpression';
  operator: string;
  left: Node;
  right: Node;
}

export interface VariableDeclarationNode extends NodeBase {
  type: 'VariableDeclaration';
  identifier: IdentifierNode;
  initializer: Node | null;
}

export interface FunctionDeclarationNode extends NodeBase {
  type: 'FunctionDeclaration';
  name: IdentifierNode;
  params: IdentifierNode[];
  body: BlockStatementNode;
}

export interface ReturnStatementNode extends NodeBase {
  type: 'ReturnStatement';
  argument: Node | null;
}

export interface PrintStatementNode extends NodeBase {
  type: 'PrintStatement';
  expression: Node;
}

export interface BlockStatementNode extends NodeBase {
  type: 'BlockStatement';
  body: Node[];
}

export interface IfStatementNode extends NodeBase {
  type: 'IfStatement';
  test: Node;
  consequent: BlockStatementNode;
  alternate: IfStatementNode | BlockStatementNode | null;
}

export interface WhileStatementNode extends NodeBase {
  type: 'WhileStatement';
  test: Node;
  body: BlockStatementNode;
}

export interface ForStatementNode extends NodeBase {
  type: 'ForStatement';
  init: Node | null;
  test: Node | null;
  update: Node | null;
  body: BlockStatementNode;
}

export interface UnaryExpressionNode extends NodeBase {
  type: 'UnaryExpression';
  operator: string;
  argument: Node;
}

(ProgramNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.Program(this);
  this.body.forEach((child: Node) => child.accept(visitor));
};

(IdentifierNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.Identifier(this);
};

(NumericLiteralNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.NumericLiteral(this);
};

(AssignmentExpressionNode.prototype as any).accept = function(visitor: Visitor) {
  this.left.accept(visitor);
  this.right.accept(visitor);
  visitor.AssignmentExpression(this);
};

(ExpressionStatementNode.prototype as any).accept = function(visitor: Visitor) {
  this.expression.accept(visitor);
  visitor.ExpressionStatement(this);
};

(FirstExpressionNode.prototype as any).accept = 
    function(visitor: Visitor) {
  visitor.FirstExpression(this);
};

(BinaryExpressionNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.BinaryExpression(this);
};

(VariableDeclarationNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.VariableDeclaration(this);
};

(PrintStatementNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.PrintStatement(this);
};

(BlockStatementNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.BlockStatement(this);
};

(IfStatementNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.IfStatement(this);
};

(WhileStatementNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.WhileStatement(this);
};

(ForStatementNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.ForStatement(this);
};

(UnaryExpressionNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.UnaryExpression(this);
};

(FunctionDeclarationNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.FunctionDeclaration(this);
};

(ReturnStatementNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.ReturnStatement(this);
};

(CallExpressionNode.prototype as any).accept = function(visitor: Visitor) {
  visitor.CallExpression(this);
};
