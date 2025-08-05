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
    this.emit('#include <string>');
    this.emit('#include <vector>');
    this.emit('#include <any>');
    this.emit('#include <map>');
    this.emit('#include <variant>');
    this.emit('');
    this.emit('// Forward declaration for recursive structures');
    this.emit('void print_any(const std::any& value);');
    this.emit('');
    this.emit('void print_any(const std::any& value) {');
    this.emit('  if (value.type() == typeid(int)) { std::cout << std::any_cast<int>(value); }');
    this.emit('  else if (value.type() == typeid(double)) { std::cout << std::any_cast<double>(value); }');
    this.emit('  else if (value.type() == typeid(bool)) { std::cout << (std::any_cast<bool>(value) ? "true" : "false"); }');
    this.emit('  else if (value.type() == typeid(const char*)) { std::cout << "\"" << std::any_cast<const char*>(value) << "\""; }');
    this.emit('  else if (value.type() == typeid(std::string)) { std::cout << "\"" << std::any_cast<std::string>(value) << "\""; }');
    this.emit('  else if (value.type() == typeid(std::vector<std::any>)) {');
    this.emit('    const auto& vec = std::any_cast<const std::vector<std::any>&>(value);');
    this.emit('    std::cout << "[";');
    this.emit('    for (size_t i = 0; i < vec.size(); ++i) { print_any(vec[i]); if (i < vec.size() - 1) std::cout << ", "; }');
    this.emit('    std::cout << "]";');
    this.emit('  } else if (value.type() == typeid(std::map<std::string, std::any>)) {');
    this.emit('    const auto& map = std::any_cast<const std::map<std::string, std::any>&>(value);');
    this.emit('    std::cout << "{";');
    this.emit('    size_t i = 0;');
    this.emit('    for (const auto& pair : map) { std::cout << "\"" << pair.first << "\": "; print_any(pair.second); if (i < map.size() - 1) std::cout << ", "; i++; }');
    this.emit('    std::cout << "}";');
    this.emit('  } else { std::cout << "unsupported_type"; }');
    this.emit('}');
    this.emit('');
    this.emit('using namespace std;');
    this.emit('');

    // Hoist function declarations
    node.body.forEach(stmt => {
      if (stmt.type === 'FunctionDeclaration') {
        stmt.accept(this);
        this.emit('');
      }
    });

    this.emit('int main() {');
    this.indentLevel++;

    this.declaredVars.clear(); // Initialize only once
    node.body.forEach(stmt => {
      if (stmt.type !== 'FunctionDeclaration') {
        stmt.accept(this);
      }
    });

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

  FunctionDeclaration(node: ast.FunctionDeclarationNode) {
    const fnName = node.name.name;
    const params = node.params.map(p => `int ${p.name}`).join(', ');
    this.emit(`int ${fnName}(${params})`); // Assume int return for now
    node.body.accept(this);
  }

  ReturnStatement(node: ast.ReturnStatementNode) {
    if (node.argument) {
      this.emit(`return ${this.genExpression(node.argument)};`);
    } else {
      this.emit('return 0;'); // Default return for void functions, but we assume int
    }
  }

  CallExpression(node: ast.CallExpressionNode) {
    // Handled in genExpression
  }

  BooleanLiteral(node: ast.BooleanLiteralNode) {
    // Handled in genExpression
  }
  
  StringLiteral(node: ast.StringLiteralNode) {
    // Handled in genExpression
  }

  LogicalExpression(node: ast.LogicalExpressionNode) {
    // Handled in genExpression
  }

  ArrayExpression(node: ast.ArrayExpressionNode) {
    // Handled in genExpression
  }
  
  ObjectExpression(node: ast.ObjectExpressionNode) {
    // Handled in genExpression
  }
  
  Property(node: ast.PropertyNode) {
    // Handled in genExpression
  }
  
  MemberExpression(node: ast.MemberExpressionNode) {
    // Handled in genExpression
  }

  VariableDeclaration(node: ast.VariableDeclarationNode) {
    const varName = node.identifier.name;
    if (!this.declaredVars.has(varName)) {
      const initValue = node.initializer ?
        this.genExpression(node.initializer) : '0';
      this.emit(`auto ${varName} = ${initValue};`);
      this.declaredVars.add(varName);
    }
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
    if (node.expression.type === 'CallExpression') {
      const callNode = node.expression as ast.CallExpressionNode;
      if (
        callNode.callee.type === 'MemberExpression' &&
        (callNode.callee as ast.MemberExpressionNode).object.type === 'Identifier' &&
        ((callNode.callee as ast.MemberExpressionNode).object as ast.IdentifierNode).name === 'console' &&
        (callNode.callee as ast.MemberExpressionNode).property.type === 'Identifier' &&
        ((callNode.callee as ast.MemberExpressionNode).property as ast.IdentifierNode).name === 'log'
      ) {
        const args = callNode.arguments;
        if (args.length > 0) {
          for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            this.emit(`print_any(${this.genExpression(arg)});`);
            if (i < args.length - 1) {
              this.emit(`std::cout << " ";`);
            }
          }
        }
        this.emit(`std::cout << std::endl;`);
        return;
      }
    }
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
      case 'StringLiteral':
        return `std::string("${(node as ast.StringLiteralNode).value}")`;
      case 'BooleanLiteral':
        return (node as ast.BooleanLiteralNode).value ? 'true' : 'false';
      case 'AssignmentExpression': {
        const assignNode = node as ast.AssignmentExpressionNode;
        const left = this.genExpression(assignNode.left);
        return `${left} = ${this.genExpression(assignNode.right)}`;
      }
      case 'UnaryExpression': {
        const unaryNode = node as ast.UnaryExpressionNode;
        return `(${unaryNode.operator}${this.genExpression(unaryNode.argument)})`;
      }
      case 'BinaryExpression':
      case 'LogicalExpression': {
        const binNode = node as ast.BinaryExpressionNode; // works for both
        return `(${this.genExpression(binNode.left)} ${binNode.operator} ${this.genExpression(binNode.right)})`;
      }
      case 'CallExpression': {
        const callNode = node as ast.CallExpressionNode;
        const callee = this.genExpression(callNode.callee);
        const args = callNode.arguments.map(arg => this.genExpression(arg)).join(', ');
        return `${callee}(${args})`;
      }
      case 'MemberExpression': {
        const memberNode = node as ast.MemberExpressionNode;
        const obj = this.genExpression(memberNode.object);
        if (memberNode.computed) {
          return `${obj}[${this.genExpression(memberNode.property)}]`;
        } else {
          const prop = (memberNode.property as ast.IdentifierNode).name;
          // Assuming map for dot notation
          return `std::any_cast<std::map<std::string, std::any>&>(${obj})["${prop}"]`;
        }
      }
      case 'ArrayExpression': {
        const arrayNode = node as ast.ArrayExpressionNode;
        const elements = arrayNode.elements.map(el => this.genExpression(el)).join(', ');
        return `std::vector<std::any>{${elements}}`;
      }
      case 'ObjectExpression': {
        const objNode = node as ast.ObjectExpressionNode;
        const props = objNode.properties.map(p => {
          let key;
          if (p.key.type === 'Identifier') {
            key = `"${p.key.name}"`;
          } else { // StringLiteralNode
            key = `"${(p.key as ast.StringLiteralNode).value}"`;
          }
          const val = this.genExpression(p.value);
          return `{${key}, ${val}}`;
        }).join(', ');
        return `std::map<std::string, std::any>{${props}}`;
      }
      default:
        throw new Error(`Unsupported expression type: ${node.type}`);
    }
  }
}
