import { compile } from '../compiler';

describe('Compiler', () => {
  test('compiles numeric literal', () => {
    const code = '42;';
    const cpp = compile(code);
    expect(cpp).toContain('42');
  });

  test('compiles variable declaration', () => {
    const code = 'let x = 5;';
    const cpp = compile(code);
    expect(cpp).toContain('int x = 5;');
  });

  test('compiles print statement', () => {
    const code = 'print(42);';
    const cpp = compile(code);
    expect(cpp).toContain('std::cout << 42 << std::endl;');
  });

  test('compiles if statement', () => {
    const code = 'let x = 1; if (x > 0) { print(1); }';
    const cpp = compile(code);
    expect(cpp).toContain('if ((x > 0))');
    expect(cpp).toContain('std::cout << 1 << std::endl;');
  });

  test('compiles if-else statement', () => {
    const code = 'let x = 0; if (x > 0) { print(1); } else { print(0); }';
    const cpp = compile(code);
    expect(cpp).toContain('if ((x > 0))');
    expect(cpp).toContain('else');
    expect(cpp).toContain('std::cout << 0 << std::endl;');
  });

  test('compiles while statement', () => {
    const code = 'let i = 0; while (i < 5) { i = i + 1; }';
    const cpp = compile(code);
    expect(cpp).toContain('while ((i < 5))');
    expect(cpp).toContain('i = (i + 1);');
  });

  test('reports compilation errors', () => {
    const code = 'let x = ;';
    const cpp = compile(code);
    expect(cpp).toContain('Compilation error');
  });
});
