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

  test('compiles for statement', () => {
    const code = 'for (let i = 0; i < 5; i = i + 1) { print(i); }';
    const cpp = compile(code);
    expect(cpp).toContain('for (int i = 0; (i < 5); i = (i + 1))');
    expect(cpp).toContain('std::cout << i << std::endl;');
  });

  test('compiles unary minus', () => {
    const code = 'let x = -5;';
    const cpp = compile(code);
    expect(cpp).toContain('int x = (-5);');
  });

  test('compiles function declaration and call', () => {
    const code = `
      function add(a, b) {
        return a + b;
      }
      let result = add(3, 4);
      print(result);
    `;
    const cpp = compile(code);
    expect(cpp).toContain('int add(int a, int b)');
    expect(cpp).toContain('return (a + b);');
    expect(cpp).toContain('auto result = add(3, 4);');
    expect(cpp).toContain('print_any(result);');
  });

  test('compiles string and boolean literals', () => {
    const code = 'let s = "hello"; let b = true;';
    const cpp = compile(code);
    expect(cpp).toContain('auto s = std::string("hello");');
    expect(cpp).toContain('auto b = true;');
  });

  test('compiles logical expressions', () => {
    const code = 'let r = a && b;';
    const cpp = compile(code);
    expect(cpp).toContain('auto r = (a && b);');
  });

  test('compiles array literals and access', () => {
    const code = 'let arr = [1, "a"]; print(arr[0]);';
    const cpp = compile(code);
    expect(cpp).toContain('auto arr = std::vector<std::any>{1, std::string("a")};');
    expect(cpp).toContain('print_any(arr[0]);');
  });

  test('compiles object literals and access', () => {
    const code = 'let obj = { "key": "value" }; print(obj.key);';
    const cpp = compile(code);
    expect(cpp).toContain('auto obj = std::map<std::string, std::any>{{"key", std::string("value")}};');
    expect(cpp).toContain('print_any(std::any_cast<std::map<std::string, std::any>&>(obj)["key"]);');
  });

  test('reports compilation errors', () => {
    const code = 'let x = ;';
    const cpp = compile(code);
    expect(cpp).toContain('Compilation error');
  });
});
