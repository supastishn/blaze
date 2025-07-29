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
}
