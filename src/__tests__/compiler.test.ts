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

  test('reports compilation errors', () => {
    const code = 'let x = ;';
    const cpp = compile(code);
    expect(cpp).toContain('Compilation error');
  });
});
