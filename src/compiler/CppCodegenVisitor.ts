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

  Identifier(node: ast.IdentifierNode) {
    // Implemented in expression handling
  }

  NumericLiteral(node: ast.NumericLiteralNode) {
    // Implemented in expression handling
  }

  BinaryExpression(node: ast.BinaryExpressionNode) {
    // Handled in genExpression
  }

  UnaryExpression(node: ast.UnaryExpressionNode) {
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

  IfStatement(node: ast.IfStatementNode) {
    this.emit(`if (${this.genExpression(node.test)})`);
    node.consequent.accept(this);
    if (node.alternate) {
      this.emit('else');
      node.alternate.accept(this);
    }
  }

  WhileStatement(node: ast.WhileStatementNode) {
    this.emit(`while (${this.genExpression(node.test)})`);
    node.body.accept(this);
  }

  ForStatement(node: ast.ForStatementNode) {
    let initStr = '';
    if (node.init) {
      if (node.init.type === 'VariableDeclaration') {
        const varDecl = node.init as ast.VariableDeclarationNode;
        const varName = varDecl.identifier.name;
        const initValue = varDecl.initializer ? this.genExpression(varDecl.initializer) : '0';
        initStr = `int ${varName} = ${initValue}`;
      } else {
        initStr = this.genExpression(node.init);
      }
    }

    const testStr = node.test ? this.genExpression(node.test) : '';
    const updateStr = node.update ? this.genExpression(node.update) : '';

    this.emit(`for (${initStr}; ${testStr}; ${updateStr})`);
    node.body.accept(this);
  }

  AssignmentExpression(node: ast.AssignmentExpressionNode) {
    // Implemented in expression handling
  }

  ExpressionStatement(node: ast.ExpressionStatementNode) {
    const code = this.genExpression(node.expression);
    this.emit(`${code};`);
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
      case 'AssignmentExpression': {
        const assignNode = node as ast.AssignmentExpressionNode;
        return `${assignNode.left.name} = ${this.genExpression(assignNode.right)}`;
      }
      case 'UnaryExpression': {
        const unaryNode = node as ast.UnaryExpressionNode;
        return `(${unaryNode.operator}${this.genExpression(unaryNode.argument)})`;
      }
      case 'BinaryExpression': {
        const binNode = node as ast.BinaryExpressionNode;
        return `(${this.genExpression(binNode.left)} ${binNode.operator} ${this.genExpression(binNode.right)})`;
      }
      default:
        throw new Error(`Unsupported expression type: ${node.type}`);
    }
  }
}
