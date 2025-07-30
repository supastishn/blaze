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

  test('visits nodes with PrintVisitor', () => {
    const ast = parse('let x = 5');
    const printVisitor = new PrintVisitor();
    // Just verify it doesn't throw
    expect(() => ast.accept(printVisitor)).not.toThrow();
  });
});
