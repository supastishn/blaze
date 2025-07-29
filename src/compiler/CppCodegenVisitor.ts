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

    this.declaredVars.clear(); // Initialize only once
    node.body.forEach(stmt => stmt.accept(this));

    this.emit('return 0;');
    this.indentLevel--;
    this.emit('}');
  }

  BinaryExpression(node: ast.BinaryExpressionNode) {
    // Handled in genExpression
  }

  VariableDeclaration(node: ast.VariableDeclarationNode) {
    const varName = node.identifier.name;
    if (!this.declaredVars.has(varName)) {
      const initValue = node.initializer ?
        this.genExpression(node.initializer) : '0';
      this.emit(`int ${varName} = ${initValue};`);
      this.declaredVars.add(varName);
    }
  }

  PrintStatement(node: ast.PrintStatementNode) {
    const exprValue = this.genExpression(node.expression);
    this.emit(`std::cout << ${exprValue} << std::endl;`);
  }

  BlockStatement(node: ast.BlockStatementNode) {
    this.emit('{');
    this.indentLevel++;
    node.body.forEach(stmt => stmt.accept(this));
    this.indentLevel--;
    this.emit('}');
  }

  AssignmentExpression(node: ast.AssignmentExpressionNode) {
    const varName = node.left.name;
    this.emit(`${varName} = ${this.genExpression(node.right)};`);
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
      case 'BinaryExpression': {
        const binNode = node as ast.BinaryExpressionNode;
        return `(${this.genExpression(binNode.left)} ${binNode.operator} ${this.genExpression(binNode.right)})`;
      }
      default:
        throw new Error(`Unsupported expression type: ${node.type}`);
    }
  }
}
