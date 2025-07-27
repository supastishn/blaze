import { PrintVisitor } from './src/parser/PrintVisitor';
import * as ast from './src/parser/ast';

const astRoot: ast.ProgramNode = {
  type: 'Program',
  body: [
    { type: 'Identifier', name: 'x', accept: ast.IdentifierNode.prototype.accept },
    { type: 'NumericLiteral', value: 42, accept: ast.NumericLiteralNode.prototype.accept },
  ],
  accept: ast.ProgramNode.prototype.accept
};

astRoot.accept(new PrintVisitor());
