import * as ast from './ast';

export const TokenType = {
  EOF: 'EOF',
  Identifier: 'Identifier',
  NumericLiteral: 'NumericLiteral',
  Assignment: '=',
  Semicolon: ';',
  First: 'first',
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
  private line = 1;
  private column = 0;
  
  constructor(private readonly input: string) {}

  nextToken(): Token {
    while (/\s/.test(this.peek())) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 0;
      } else {
        this.column++;
      }
      this.position++;
    }

    if (this.position >= this.input.length) {
      return { type: 'EOF', value: '', line: this.line, column: this.column };
    }

    const current = this.peek();
    const char = current?.charAt(0);

    if (/[a-zA-Z_]/.test(char)) {
      return this.parseIdentifier();
    }

    if (/[0-9]/.test(char)) {
      return this.parseNumber();
    }

    if (char === '=') {
      this.advance();
      return { type: 'Assignment', value: '=', line: this.line, column: this.column++ };
    }

    if (char === ';') {
      this.advance();
      return { type: 'Semicolon', value: ';', line: this.line, column: this.column++ };
    }

    throw new Error(`Unexpected character: '${char}' at line ${this.line}, column ${this.column}`);
  }

  private parseIdentifier(): Token {
    const start = this.position;
    const startLine = this.line;
    const startCol = this.column;
    
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      this.advance();
    }
    
    const value = this.input.slice(start, this.position);
    if (value === 'first') {
      return { type: 'First', value: 'first', line: startLine, column: startCol };
    }
    return { type: 'Identifier', value, line: startLine, column: startCol };
  }

  private parseNumber(): Token {
    const start = this.position;
    const startLine = this.line;
    const startCol = this.column;
    
    while (/[0-9]/.test(this.peek())) {
      this.advance();
    }
    
    const value = this.input.slice(start, this.position);
    return { 
      type: 'NumericLiteral', 
      value: parseInt(value, 10), 
      line: startLine, 
      column: startCol 
    };
  }

  private peek(): string {
    if (this.position >= this.input.length) return '';
    return this.input.charAt(this.position);
  }

  private advance(): void {
    this.position++;
    this.column++;
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
      throw new Error(`Unexpected token: ${this.currentToken.type}, expected ${tokenType}`);
    }
  }

  parseProgram(): ast.ProgramNode {
    const body: ast.Node[] = [];
    
    while (this.currentToken.type !== 'EOF') {
      body.push(this.parseStatement());
    }
    
    return { 
      type: 'Program', 
      body, 
      accept: ast.ProgramNode.prototype.accept 
    } as ast.ProgramNode;
  }

  private parseStatement(): ast.Node {
    const stmt = this.parseExpressionStatement();
    if (this.currentToken.type === 'Semicolon') {
      this.eat('Semicolon');
    }
    return stmt;
  }

  private parseExpressionStatement(): ast.ExpressionStatementNode {
    const expression = this.parseExpression();
    return { 
      type: 'ExpressionStatement', 
      expression, 
      accept: ast.ExpressionStatementNode.prototype.accept 
    } as ast.ExpressionStatementNode;
  }

  private parseExpression(): ast.Node {
    return this.parseAssignmentExpression();
  }

  private parseAssignmentExpression(): ast.Node {
    if (this.currentToken.type === 'Identifier') {
      const identifier = this.parseIdentifier();
      
      if (this.currentToken.type === 'Assignment') {
        this.eat('Assignment');
        const right = this.parseExpression();
        return { 
          type: 'AssignmentExpression',
          left: identifier,
          right,
          accept: ast.AssignmentExpressionNode.prototype.accept
        } as ast.AssignmentExpressionNode;
      }

      return identifier;
    }
    
    return this.parsePrimaryExpression();
  }

  private parsePrimaryExpression(): ast.Node {
    switch (this.currentToken.type) {
      case 'Identifier':
        return this.parseIdentifier();
      case 'NumericLiteral':
        return this.parseNumericLiteral();
      case 'First':
        return this.parseFirstExpression();
      default:
        throw new Error(`Unexpected primary expression: ${this.currentToken.type}`);
    }
  }

  private parseFirstExpression(): ast.FirstExpressionNode {
    this.eat('First');
    const argument = this.parseExpression();
    return {
      type: 'FirstExpression',
      argument,
      accept: ast.FirstExpressionNode.prototype.accept
    } as ast.FirstExpressionNode;
  }

  private parseIdentifier(): ast.IdentifierNode {
    const token = this.currentToken;
    this.eat('Identifier');
    return { 
      type: 'Identifier', 
      name: token.value as string, 
      accept: ast.IdentifierNode.prototype.accept 
    } as ast.IdentifierNode;
  }

  private parseNumericLiteral(): ast.NumericLiteralNode {
    const token = this.currentToken;
    this.eat('NumericLiteral');
    return { 
      type: 'NumericLiteral', 
      value: token.value as number, 
      accept: ast.NumericLiteralNode.prototype.accept 
    } as ast.NumericLiteralNode;
  }
}
