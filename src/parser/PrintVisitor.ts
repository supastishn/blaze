import * as ast from './ast';

export class PrintVisitor implements ast.Visitor {
  depth: number = 0;

  Program(node: ast.ProgramNode) {
    console.log(`${'  '.repeat(this.depth)}Program [${node.body.length} statements]`);
    this.depth++;
  }

  Identifier(node: ast.IdentifierNode) {
    console.log(`${'  '.repeat(this.depth)}Identifier: ${node.name}`);
  }

  NumericLiteral(node: ast.NumericLiteralNode) {
    console.log(`${'  '.repeat(this.depth)}Number: ${node.value}`);
  }
  
  // Add methods for other node types
}
