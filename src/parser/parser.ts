import * as ast from './ast';

export const TokenType = {
  EOF: 'EOF',
  Identifier: 'Identifier',
  NumericLiteral: 'NumericLiteral',
  Assignment: '=',
  Semicolon: ';',
  First: 'first',
  Plus: '+',
  Minus: '-',
  Multiply: '*',
  Divide: '/',
  LeftParen: '(',
  RightParen: ')',
  LeftBrace: '{',
  RightBrace: '}',
  Let: 'let',
  Print: 'print',
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

    if (char === '+') {
      this.advance();
      return { type: 'Plus', value: '+', line: this.line, column: this.column++ };
    }
    if (char === '-') {
      this.advance();
      return { type: 'Minus', value: '-', line: this.line, column: this.column++ };
    }
    if (char === '*') {
      this.advance();
      return { type: 'Multiply', value: '*', line: this.line, column: this.column++ };
    }
    if (char === '/') {
      this.advance();
      return { type: 'Divide', value: '/', line: this.line, column: this.column++ };
    }
    if (char === '(') {
      this.advance();
      return { type: 'LeftParen', value: '(', line: this.line, column: this.column++ };
    }
    if (char === ')') {
      this.advance();
      return { type: 'RightParen', value: ')', line: this.line, column: this.column++ };
    }
    if (char === '{') {
      this.advance();
      return { type: 'LeftBrace', value: '{', line: this.line, column: this.column++ };
    }
    if (char === '}') {
      this.advance();
      return { type: 'RightBrace', value: '}', line: this.line, column: this.column++ };
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
    if (value === 'let') {
      return { type: 'Let', value: 'let', line: startLine, column: startCol };
    }
    if (value === 'print') {
      return { type: 'Print', value: 'print', line: startLine, column: startCol };
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
    if (this.currentToken.type === 'Let') return this.parseVariableDeclaration();
    if (this.currentToken.type === 'Print') return this.parsePrintStatement();
    if (this.currentToken.type === 'LeftBrace') return this.parseBlockStatement();

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

  private getPrecedence(opType: string): number {
    switch (opType) {
      case 'Plus':
      case 'Minus': return 1;
      case 'Multiply':
      case 'Divide': return 2;
      default: return 0;
    }
  }

  private parseBinaryExpression(precedence: number): ast.Node {
    let left = this.parseAssignmentExpression();

    while (true) {
      const token = this.currentToken;
      const newPrecedence = this.getPrecedence(token.type);
      if (newPrecedence <= precedence) break;

      this.eat(token.type as TokenType);
      const right = this.parseBinaryExpression(newPrecedence);
      left = {
        type: 'BinaryExpression',
        operator: token.value as string,
        left,
        right,
        accept: ast.BinaryExpressionNode.prototype.accept
      } as ast.BinaryExpressionNode;
    }
    return left;
  }

  private parseVariableDeclaration(): ast.VariableDeclarationNode {
    this.eat('Let');
    const identifier = this.parseIdentifier();
    let initializer: ast.Node | null = null;

    if (this.currentToken.type === 'Assignment') {
      this.eat('Assignment');
      initializer = this.parseExpression();
    }

    return {
      type: 'VariableDeclaration',
      identifier,
      initializer,
      accept: ast.VariableDeclarationNode.prototype.accept
    };
  }

  private parsePrintStatement(): ast.PrintStatementNode {
    this.eat('Print');
    const expression = this.parseExpression();
    return {
      type: 'PrintStatement',
      expression,
      accept: ast.PrintStatementNode.prototype.accept
    };
  }

  private parseBlockStatement(): ast.BlockStatementNode {
    this.eat('LeftBrace');
    const body: ast.Node[] = [];

    while (this.currentToken.type !== 'RightBrace' && this.currentToken.type !== 'EOF') {
      body.push(this.parseStatement());
    }

    this.eat('RightBrace');
    return {
      type: 'BlockStatement',
      body,
      accept: ast.BlockStatementNode.prototype.accept
    };
  }

  private parseExpression(): ast.Node {
    return this.parseBinaryExpression(0);
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
      case 'LeftParen': {
        this.eat('LeftParen');
        const expr = this.parseExpression();
        this.eat('RightParen');
        return expr;
      }
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
