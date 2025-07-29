import { Parser } from '../parser/parser';
import { Lexer } from '../parser/parser';
import { CppCodegenVisitor } from './CppCodegenVisitor';

export const compile = (source: string): string => {
  const lexer = new Lexer(source);
  const parser = new Parser(lexer);
  const ast = parser.parseProgram();
  
  const codegen = new CppCodegenVisitor();
  ast.accept(codegen);
  return codegen.getCode();
};
