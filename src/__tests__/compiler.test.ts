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
    expect(cpp).toContain('auto x = 5;');
  });

  test('compiles console.log statement', () => {
    const code = 'console.log(42);';
    const cpp = compile(code);
    expect(cpp).toContain('print_any(42);');
  });

  test('compiles if statement', () => {
    const code = 'let x = 1; if (x > 0) { console.log(1); }';
    const cpp = compile(code);
    expect(cpp).toContain('if ((x > 0))');
    expect(cpp).toContain('print_any(1);');
  });

  test('compiles if-else statement', () => {
    const code = 'let x = 0; if (x > 0) { console.log(1); } else { console.log(0); }';
    const cpp = compile(code);
    expect(cpp).toContain('if ((x > 0))');
    expect(cpp).toContain('else');
    expect(cpp).toContain('print_any(0);');
  });

  test('compiles while statement', () => {
    const code = 'let i = 0; while (i < 5) { i = i + 1; }';
    const cpp = compile(code);
    expect(cpp).toContain('while ((i < 5))');
    expect(cpp).toContain('i = (i + 1);');
  });

  test('compiles for statement', () => {
    const code = 'for (let i = 0; i < 5; i = i + 1) { console.log(i); }';
    const cpp = compile(code);
    expect(cpp).toContain('for (int i = 0; (i < 5); i = (i + 1))');
    expect(cpp).toContain('print_any(i);');
  });

  test('compiles unary minus', () => {
    const code = 'let x = -5;';
    const cpp = compile(code);
    expect(cpp).toContain('auto x = (-5);');
  });

  test('compiles function declaration and call', () => {
    const code = `
      function add(a, b) {
        return a + b;
      }
      let result = add(3, 4);
      console.log(result);
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
    const code = 'let arr = [1, "a"]; console.log(arr[0]);';
    const cpp = compile(code);
    expect(cpp).toContain('auto arr = std::vector<std::any>{1, std::string("a")};');
    expect(cpp).toContain('print_any(arr[0]);');
  });

  test('compiles object literals and access', () => {
    const code = 'let obj = { "key": "value" }; console.log(obj["key"]);';
    const cpp = compile(code);
    expect(cpp).toContain('auto obj = std::map<std::string, std::any>{{"key", std::string("value")}};');
    // Note: obj.key syntax is now assumed to be class property access.
    // Map access must now use bracket notation.
    expect(cpp).toContain('print_any(obj[std::string("key")]);');
  });

  test('compiles class declaration and instantiation', () => {
    const code = `
      class Counter {
        constructor(initial) {
          this.count = initial;
        }

        increment() {
          this.count = this.count + 1;
          return this.count;
        }
      }
      let c = new Counter(0);
      console.log(c.increment());
      console.log(c.increment());
    `;
    const cpp = compile(code);
    expect(cpp).toContain('struct Counter {');
    expect(cpp).toContain('std::any count;');
    expect(cpp).toContain('Counter(std::any initial)');
    expect(cpp).toContain('this->count = initial;');
    expect(cpp).toContain('std::any increment()');
    expect(cpp).toContain('this->count = (this->count + 1);');
    expect(cpp).toContain('return this->count;');
    expect(cpp).toContain('auto c = std::make_shared<Counter>(0);');
    expect(cpp).toContain('print_any(c->increment());');
  });

  test('reports compilation errors', () => {
    const code = 'let x = ;';
    const cpp = compile(code);
    expect(cpp).toContain('COMPILE ERROR: ');
  });
});
