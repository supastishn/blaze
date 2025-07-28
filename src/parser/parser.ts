import * as ast from './ast';

// Token types
export const TokenType = {
  EOF: 'EOF',
  Identifier: 'Identifier',
  NumericLiteral: 'NumericLiteral',
  Assignment: '=',
  Semicolon: ';',
} as const;

export type TokenType = keyof typeof TokenType;

export interface Token {
  type: TokenType | string;
  value: string | number;
  line: number;
  column: number;
}

export class Lexer {
  private position = 0;
  
  constructor(private readonly input: string) {}

  nextToken(): Token {
    // TODO: Implement tokenization
    return { type: 'EOF', value: '', line: 0, column: 0 };
  }
}

export class Parser {
  private currentToken!: Token;
  
  constructor(private lexer: Lexer) {
    this.currentToken = lexer.nextToken();
  }

  private eat(tokenType: TokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.nextToken();
    } else {
      throw new Error(`Unexpected token: ${this.currentToken.type}`);
    }
  }

  parseProgram(): ast.ProgramNode {
    const program = { type: 'Program', body: [] } as ast.ProgramNode;
    // TODO: Parse statements
    return program;
  }

  private parseStatement(): ast.Node {
    return this.parseExpressionStatement();
  }

  private parseExpressionStatement(): ast.ExpressionStatementNode {
    const expression = this.parseExpression();
    this.eat('Semicolon');
    return { type: 'ExpressionStatement', expression } as ast.ExpressionStatementNode;
  }

  private parseExpression(): ast.Node {
    return this.parseAssignmentExpression();
  }

  private parseAssignmentExpression(): ast.Node {
    const left = this.parsePrimaryExpression();
    if (this.currentToken.type === 'Assignment') {
      this.eat('Assignment');
      const right = this.parseExpression();
      return { type: 'AssignmentExpression', left, right } as ast.AssignmentExpressionNode;
    }
    return left;
  }

  private parsePrimaryExpression(): ast.Node {
    switch (this.currentToken.type) {
      case 'Identifier':
        return this.parseIdentifier();
      case 'NumericLiteral':
        return this.parseNumericLiteral();
      default:
        throw new Error('Unexpected primary expression');
    }
  }

  private parseIdentifier(): ast.IdentifierNode {
    const token = this.currentToken;
    this.eat('Identifier');
    return { type: 'Identifier', name: token.value as string } as ast.IdentifierNode;
  }

  private parseNumericLiteral(): ast.NumericLiteralNode {
    const token = this.currentToken;
    this.eat('NumericLiteral');
    return { type: 'NumericLiteral', value: token.value as number } as ast.NumericLiteralNode;
  }
}
