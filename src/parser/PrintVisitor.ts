import * as ast from './ast';

export class PrintVisitor implements ast.Visitor {
  depth: number = 0;

  Program(node: ast.ProgramNode) {
    console.log(`${'  '.repeat(this.depth)}Program [${node.body.length} statements]`);
    this.depth++;
    node.body.forEach(stmt => stmt.accept(this));
    this.depth--;
  }

  Identifier(node: ast.IdentifierNode) {
    console.log(`${'  '.repeat(this.depth)}Identifier: ${node.name}`);
  }

  NumericLiteral(node: ast.NumericLiteralNode) {
    console.log(`${'  '.repeat(this.depth)}Number: ${node.value}`);
  }

  AssignmentExpression(node: ast.AssignmentExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}AssignmentExpression:`);
    this.depth++;
    node.left.accept(this);
    node.right.accept(this);
    this.depth--;
  }

  ExpressionStatement(node: ast.ExpressionStatementNode) {
    console.log(`${'  '.repeat(this.depth)}ExpressionStatement:`);
    this.depth++;
    node.expression.accept(this);
    this.depth--;
  }

  FirstExpression(node: ast.FirstExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}FirstExpression:`);
    this.depth++;
    node.argument.accept(this);
    this.depth--;
  }

  BinaryExpression(node: ast.BinaryExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}BinaryExpression: ${node.operator}`);
    this.depth++;
    node.left.accept(this);
    node.right.accept(this);
    this.depth--;
  }

  VariableDeclaration(node: ast.VariableDeclarationNode) {
    console.log(`${'  '.repeat(this.depth)}VariableDeclaration: ${node.identifier.name}`);
    if (node.initializer) {
      this.depth++;
      node.initializer.accept(this);
      this.depth--;
    }
  }

  PrintStatement(node: ast.PrintStatementNode) {
    console.log(`${'  '.repeat(this.depth)}PrintStatement:`);
    this.depth++;
    node.expression.accept(this);
    this.depth--;
  }

  BlockStatement(node: ast.BlockStatementNode) {
    console.log(`${'  '.repeat(this.depth)}BlockStatement [${node.body.length} statements]`);
    this.depth++;
    node.body.forEach(stmt => stmt.accept(this));
    this.depth--;
  }

  IfStatement(node: ast.IfStatementNode) {
    console.log(`${'  '.repeat(this.depth)}IfStatement:`);
    this.depth++;
    node.test.accept(this);
    node.consequent.accept(this);
    if (node.alternate) {
      node.alternate.accept(this);
    }
    this.depth--;
  }

  WhileStatement(node: ast.WhileStatementNode) {
    console.log(`${'  '.repeat(this.depth)}WhileStatement:`);
    this.depth++;
    node.test.accept(this);
    node.body.accept(this);
    this.depth--;
  }

  ForStatement(node: ast.ForStatementNode) {
    console.log(`${'  '.repeat(this.depth)}ForStatement:`);
    this.depth++;
    if (node.init) node.init.accept(this);
    if (node.test) node.test.accept(this);
    if (node.update) node.update.accept(this);
    node.body.accept(this);
    this.depth--;
  }

  UnaryExpression(node: ast.UnaryExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}UnaryExpression: ${node.operator}`);
    this.depth++;
    node.argument.accept(this);
    this.depth--;
  }

  FunctionDeclaration(node: ast.FunctionDeclarationNode) {
    console.log(`${'  '.repeat(this.depth)}FunctionDeclaration: ${node.name.name}`);
    this.depth++;
    node.params.forEach(p => p.accept(this));
    node.body.accept(this);
    this.depth--;
  }

  ReturnStatement(node: ast.ReturnStatementNode) {
    console.log(`${'  '.repeat(this.depth)}ReturnStatement:`);
    if (node.argument) {
      this.depth++;
      node.argument.accept(this);
      this.depth--;
    }
  }

  CallExpression(node: ast.CallExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}CallExpression:`);
    this.depth++;
    node.callee.accept(this);
    node.arguments.forEach(arg => arg.accept(this));
    this.depth--;
  }

  BooleanLiteral(node: ast.BooleanLiteralNode) {
    console.log(`${'  '.repeat(this.depth)}Boolean: ${node.value}`);
  }

  StringLiteral(node: ast.StringLiteralNode) {
    console.log(`${'  '.repeat(this.depth)}String: "${node.value}"`);
  }

  LogicalExpression(node: ast.LogicalExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}LogicalExpression: ${node.operator}`);
    this.depth++;
    node.left.accept(this);
    node.right.accept(this);
    this.depth--;
  }

  ArrayExpression(node: ast.ArrayExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}ArrayExpression [${node.elements.length} elements]`);
    this.depth++;
    node.elements.forEach(el => el.accept(this));
    this.depth--;
  }

  ObjectExpression(node: ast.ObjectExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}ObjectExpression [${node.properties.length} properties]`);
    this.depth++;
    node.properties.forEach(p => p.accept(this));
    this.depth--;
  }

  Property(node: ast.PropertyNode) {
    console.log(`${'  '.repeat(this.depth)}Property:`);
    this.depth++;
    node.key.accept(this);
    node.value.accept(this);
    this.depth--;
  }

  MemberExpression(node: ast.MemberExpressionNode) {
    console.log(`${'  '.repeat(this.depth)}MemberExpression (computed: ${node.computed})`);
    this.depth++;
    node.object.accept(this);
    node.property.accept(this);
    this.depth--;
  }
}
