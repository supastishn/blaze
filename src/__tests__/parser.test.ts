import { Lexer, Parser } from '../parser/parser';
import { PrintVisitor } from '../parser/PrintVisitor';

function parse(code: string) {
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  return parser.parseProgram();
}

describe('Parser', () => {
  test('parses numeric literal', () => {
    const ast = parse('42');
    expect(ast.body[0].type).toBe('ExpressionStatement');
  });

  test('parses variable assignment', () => {
    const ast = parse('x = 5');
    expect(ast.body[0].type).toBe('ExpressionStatement');
    expect((ast.body[0] as any).expression.type).toBe('AssignmentExpression');
  });

  test('parses print statement', () => {
    const ast = parse('print(42)');
    expect(ast.body[0].type).toBe('PrintStatement');
  });

  test('parses block statement', () => {
    const ast = parse('{ print(42); }');
    expect(ast.body[0].type).toBe('BlockStatement');
  });

  test('parses if statement', () => {
    const ast = parse('if (x > 0) { print(1); }');
    expect(ast.body[0].type).toBe('IfStatement');
  });

  test('parses if-else statement', () => {
    const ast = parse('if (x > 0) { print(1); } else { print(0); }');
    const stmt = ast.body[0] as any;
    expect(stmt.type).toBe('IfStatement');
    expect(stmt.alternate).not.toBeNull();
    expect(stmt.alternate.type).toBe('BlockStatement');
  });

  test('parses while statement', () => {
    const ast = parse('while (x > 0) { x = x - 1; }');
    expect(ast.body[0].type).toBe('WhileStatement');
  });

  test('parses for statement', () => {
    const ast = parse('for (let i = 0; i < 10; i = i + 1) { print(i); }');
    const stmt = ast.body[0] as any;
    expect(stmt.type).toBe('ForStatement');
    expect(stmt.init.type).toBe('VariableDeclaration');
    expect(stmt.test.type).toBe('BinaryExpression');
    expect(stmt.update.type).toBe('AssignmentExpression');
    expect(stmt.body.type).toBe('BlockStatement');
  });

  test('parses unary minus expression', () => {
    const ast = parse('let x = -5;');
    const stmt = ast.body[0] as any;
    expect(stmt.type).toBe('VariableDeclaration');
    expect(stmt.initializer.type).toBe('UnaryExpression');
    expect(stmt.initializer.operator).toBe('-');
    expect((stmt.initializer.argument as any).type).toBe('NumericLiteral');
  });

  test('parses function declaration', () => {
    const ast = parse('function add(a, b) { return a + b; }');
    const stmt = ast.body[0] as any;
    expect(stmt.type).toBe('FunctionDeclaration');
    expect(stmt.name.name).toBe('add');
    expect(stmt.params.length).toBe(2);
    expect(stmt.body.type).toBe('BlockStatement');
  });

  test('parses call expression', () => {
    const ast = parse('add(1, 2);');
    const stmt = ast.body[0] as any;
    expect(stmt.type).toBe('ExpressionStatement');
    expect(stmt.expression.type).toBe('CallExpression');
    expect(stmt.expression.callee.name).toBe('add');
    expect(stmt.expression.arguments.length).toBe(2);
  });

  test('visits nodes with PrintVisitor', () => {
    const ast = parse('let x = 5');
    const printVisitor = new PrintVisitor();
    // Just verify it doesn't throw
    expect(() => ast.accept(printVisitor)).not.toThrow();
  });
});
