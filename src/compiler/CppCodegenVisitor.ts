import * as ast from '../parser/ast';

export class CppCodegenVisitor implements ast.Visitor {
  private output: string[] = [];
  private indentLevel = 0;
  private declaredVars = new Set<string>();

  getCode(): string {
    return this.output.join('\n');
  }

  private emit(line: string) {
    this.output.push('  '.repeat(this.indentLevel) + line);
  }

  Program(node: ast.ProgramNode) {
    this.emit('#include <iostream>');
    this.emit('using namespace std;');
    this.emit('');
    this.emit('int main() {');
    this.indentLevel++;
    
    node.body.forEach(stmt => {
      this.declaredVars.clear(); // Reset per statement
      stmt.accept(this);
    });
    
    this.emit('return 0;');
    this.indentLevel--;
    this.emit('}');
  }

  Identifier(node: ast.IdentifierNode) {
    if (!this.declaredVars.has(node.name)) {
      this.emit(`int ${node.name} = 0;`);
      this.declaredVars.add(node.name);
    }
  }

  NumericLiteral(node: ast.NumericLiteralNode) {
    // Value will be used in expressions
  }

  AssignmentExpression(node: ast.AssignmentExpressionNode) {
    node.left.accept(this);  // Ensure var is declared
    this.emit(`${node.left.name} = ${this.genExpression(node.right)};`);
  }

  ExpressionStatement(node: ast.ExpressionStatementNode) {
    node.expression.accept(this);
  }

  FirstExpression(node: ast.FirstExpressionNode) {
    const tempVar = `temp${Math.floor(Math.random() * 10000)}`;
    this.emit(`auto ${tempVar} = ${this.genExpression(node.argument)};`);
    this.emit(`std::cout << ${tempVar} << " (type: " << typeid(${tempVar}).name() << \")" << std::endl;`);
  }

  private genExpression(node: ast.Node): string {
    switch (node.type) {
      case 'Identifier':
        return (node as ast.IdentifierNode).name;
      case 'NumericLiteral':
        return String((node as ast.NumericLiteralNode).value);
      default:
        throw new Error(`Unsupported expression type: ${node.type}`);
    }
  }
}
