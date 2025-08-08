import * as ast from '../parser/ast';

export class CppCodegenVisitor implements ast.Visitor {
  private output: string[] = [];
  private indentLevel = 0;
  private declaredVars = new Set<string>();
  private declaredClasses = new Set<string>();
  private currentClass: string | null = null;
  private headers = new Set<string>();

  getCode(): string {
    return this.output.join('\n');
  }

  private emit(line: string) {
    this.output.push('  '.repeat(this.indentLevel) + line);
  }

  Program(node: ast.ProgramNode) {
    this.output = [];
    this.headers.clear();
    this.declaredVars.clear();
    this.declaredClasses.clear();
    this.currentClass = null;

    const declarations = node.body.filter(
      (stmt) => stmt.type === 'ClassDeclaration' || stmt.type === 'FunctionDeclaration'
    );
    const mainStatements = node.body.filter(
      (stmt) => stmt.type !== 'ClassDeclaration' && stmt.type !== 'FunctionDeclaration'
    );

    // Dry run to populate headers, suppressing output
    const originalEmit = this.emit;
    this.emit = () => {};
    node.body.forEach(stmt => stmt.accept(this));
    this.emit = originalEmit;

    // Now build the actual output
    this.headers.add('<iostream>'); // For std::cout
    Array.from(this.headers).sort().forEach(h => this.emit(`#include ${h}`));
    this.emit('');
    this.emit('using namespace std;');
    this.emit('');

    // Forward-declare all classes
    declarations.forEach(stmt => {
      if (stmt.type === 'ClassDeclaration') {
        const className = (stmt as ast.ClassDeclarationNode).name.name;
        this.emit(`struct ${className};`);
        this.declaredClasses.add(className);
      }
    });
    if (this.declaredClasses.size > 0) this.emit('');

    // Emit definitions for classes and functions
    this.declaredVars.clear();
    declarations.forEach(stmt => {
      stmt.accept(this);
      this.emit('');
    });

    // Emit main function
    this.emit('int main() {');
    this.indentLevel++;
    this.declaredVars.clear(); // Reset for main scope
    if (mainStatements.length > 0) {
      mainStatements.forEach(stmt => {
        stmt.accept(this);
      });
    }
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

  private findProperties(ctor: ast.MethodDefinitionNode): Set<string> {
    const properties = new Set<string>();
    const visitor = (node: ast.Node) => {
      if (node.type === 'AssignmentExpression') {
        const assignment = node as ast.AssignmentExpressionNode;
        if (assignment.left.type === 'MemberExpression') {
          const member = assignment.left as ast.MemberExpressionNode;
          if (member.object.type === 'ThisExpression' && !member.computed) {
            properties.add((member.property as ast.IdentifierNode).name);
          }
        }
      }
      // a simple recursive traversal
      for (const key in node) {
        if (typeof (node as any)[key] === 'object' && (node as any)[key] !== null && typeof (node as any)[key].accept === 'function') {
          visitor((node as any)[key]);
        } else if (Array.isArray((node as any)[key])) {
          (node as any)[key].forEach((n: any) => {
            if (typeof n === 'object' && n !== null && typeof n.accept === 'function') {
              visitor(n)
            }
          });
        }
      }
    };
    ctor.body.body.forEach(visitor);
    return properties;
  }

  ClassDeclaration(node: ast.ClassDeclarationNode) {
    const className = node.name.name;
    this.currentClass = className;
    this.emit(`struct ${className} {`);
    this.indentLevel++;

    const constructorNode = node.body.find(m => m.kind === 'constructor');
    if (constructorNode) {
      const properties = this.findProperties(constructorNode);
      properties.forEach(prop => {
        this.emit(`std::any ${prop};`);
      });
    }

    node.body.forEach(method => method.accept(this));

    this.indentLevel--;
    this.emit(`};`);
    this.currentClass = null;
  }

  MethodDefinition(node: ast.MethodDefinitionNode) {
    const params = node.params.map(p => `std::any ${p.name}`).join(', ');
    if (node.kind === 'constructor') {
      this.emit(`${this.currentClass}(${params})`);
    } else {
      // Assuming all methods return std::any for simplicity
      this.emit(`std::any ${node.key.name}(${params})`);
    }
    node.body.accept(this);
  }

  ThisExpression(node: ast.ThisExpressionNode) {
    // Handled in genExpression
  }
  
  NewExpression(node: ast.NewExpressionNode) {
    // Handled in genExpression
  }

  FunctionDeclaration(node: ast.FunctionDeclarationNode) {
    this.headers.add('<any>');
    const fnName = node.name.name;
    const params = node.params.map(p => `std::any ${p.name}`).join(', ');
    this.emit(`std::any ${fnName}(${params})`);
    node.body.accept(this);
  }

  ReturnStatement(node: ast.ReturnStatementNode) {
    this.headers.add('<any>');
    if (node.argument) {
      this.emit(`return ${this.genExpression(node.argument)};`);
    } else {
      this.emit('return {};'); // Return default-constructed std::any
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
      if (node.initializer) {
        const initValue = this.genExpression(node.initializer);
        this.emit(`auto ${varName} = ${initValue};`);
      } else {
        this.headers.add('<any>');
        this.emit(`std::any ${varName};`);
      }
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
        this.headers.add('<iostream>');
        const args = callNode.arguments;
        if (args.length > 0) {
          const cppArgs = args.map(arg => this.genExpression(arg));
          this.emit(`std::cout << ${cppArgs.join(' << " " << ')} << std::endl;`);
        } else {
          this.emit('std::cout << std::endl;');
        }
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
        this.headers.add('<string>');
        return `std::string("${(node as ast.StringLiteralNode).value}")`;
      case 'BooleanLiteral':
        return (node as ast.BooleanLiteralNode).value ? 'true' : 'false';
      case 'ThisExpression':
        return 'this';
      case 'NewExpression': {
        this.headers.add('<memory>');
        const newNode = node as ast.NewExpressionNode;
        const callee = this.genExpression(newNode.callee);
        const args = newNode.arguments.map(arg => this.genExpression(arg)).join(', ');
        return `std::make_shared<${callee}>(${args})`;
      }
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
        const args = callNode.arguments.map(arg => this.genExpression(arg)).join(', ');

        if (callNode.callee.type === 'MemberExpression') {
          const memberNode = callNode.callee as ast.MemberExpressionNode;
          const obj = this.genExpression(memberNode.object);
          const prop = this.genExpression(memberNode.property);
          return `${obj}->${prop}(${args})`;
        }
        
        const callee = this.genExpression(callNode.callee);
        return `${callee}(${args})`;
      }
      case 'MemberExpression': {
        const memberNode = node as ast.MemberExpressionNode;
        const obj = this.genExpression(memberNode.object);
        const prop = this.genExpression(memberNode.property);

        if (memberNode.computed) {
          return `${obj}[${prop}]`;
        } else {
          return `${obj}->${prop}`;
        }
      }
      case 'ArrayExpression': {
        this.headers.add('<vector>');
        this.headers.add('<any>');
        const arrayNode = node as ast.ArrayExpressionNode;
        const elements = arrayNode.elements.map(el => this.genExpression(el)).join(', ');
        return `std::vector<std::any>{${elements}}`;
      }
      case 'ObjectExpression': {
        this.headers.add('<map>');
        this.headers.add('<string>');
        this.headers.add('<any>');
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
