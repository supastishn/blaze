export interface Visitor {
  Program(node: ProgramNode): void;
  Identifier(node: IdentifierNode): void;
  NumericLiteral(node: NumericLiteralNode): void;
  AssignmentExpression(node: AssignmentExpressionNode): void;
  ExpressionStatement(node: ExpressionStatementNode): void;
}

// Add accept() methods to all node interfaces
export interface NodeBase {
  type: string;
  accept(visitor: Visitor): void;
}

export type Node = ProgramNode | IdentifierNode | NumericLiteralNode
    | AssignmentExpressionNode | ExpressionStatementNode;

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

export interface ExpressionStatementNode extends NodeBase {
  type: 'ExpressionStatement';
  expression: Node;
}

// Implement accept for each node type
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
