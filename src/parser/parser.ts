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
  If: 'if',
  Else: 'else',
  While: 'while',
  For: 'for',
  DoubleEquals: '==',
  NotEquals: '!=',
  LessThan: '<',
  GreaterThan: '>',
  LessThanOrEquals: '<=',
  GreaterThanOrEquals: '>=',
  Comma: ',',
  Function: 'function',
  Return: 'return',
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

    const startCol = this.column;
    if (char === '=') {
      this.advance();
      if (this.peek() === '=') {
        this.advance();
        return { type: 'DoubleEquals', value: '==', line: this.line, column: startCol };
      }
      return { type: 'Assignment', value: '=', line: this.line, column: startCol };
    }
    if (char === '!') {
        this.advance();
        if (this.peek() === '=') {
            this.advance();
            return { type: 'NotEquals', value: '!=', line: this.line, column: startCol };
        }
        throw new Error(`Unexpected character: '!' at line ${this.line}, column ${startCol}`);
    }
    if (char === '<') {
        this.advance();
        if (this.peek() === '=') {
            this.advance();
            return { type: 'LessThanOrEquals', value: '<=', line: this.line, column: startCol };
        }
        return { type: 'LessThan', value: '<', line: this.line, column: startCol };
    }
    if (char === '>') {
        this.advance();
        if (this.peek() === '=') {
            this.advance();
            return { type: 'GreaterThanOrEquals', value: '>=', line: this.line, column: startCol };
        }
        return { type: 'GreaterThan', value: '>', line: this.line, column: startCol };
    }
    if (char === '+') {
      this.advance();
      return { type: 'Plus', value: '+', line: this.line, column: startCol };
    }
    if (char === '-') {
      this.advance();
      return { type: 'Minus', value: '-', line: this.line, column: startCol };
    }
    if (char === '*') {
      this.advance();
      return { type: 'Multiply', value: '*', line: this.line, column: startCol };
    }
    if (char === '/') {
      this.advance();
      return { type: 'Divide', value: '/', line: this.line, column: startCol };
    }
    if (char === '(') {
      this.advance();
      return { type: 'LeftParen', value: '(', line: this.line, column: startCol };
    }
    if (char === ')') {
      this.advance();
      return { type: 'RightParen', value: ')', line: this.line, column: startCol };
    }
    if (char === '{') {
      this.advance();
      return { type: 'LeftBrace', value: '{', line: this.line, column: startCol };
    }
    if (char === '}') {
      this.advance();
      return { type: 'RightBrace', value: '}', line: this.line, column: startCol };
    }

    if (char === ',') {
      this.advance();
      return { type: 'Comma', value: ',', line: this.line, column: startCol };
    }

    if (char === ';') {
      this.advance();
      return { type: 'Semicolon', value: ';', line: this.line, column: startCol };
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
    if (value === 'if') {
      return { type: 'If', value: 'if', line: startLine, column: startCol };
    }
    if (value === 'else') {
      return { type: 'Else', value: 'else', line: startLine, column: startCol };
    }
    if (value === 'while') {
      return { type: 'While', value: 'while', line: startLine, column: startCol };
    }
    if (value === 'for') {
      return { type: 'For', value: 'for', line: startLine, column: startCol };
    }
    if (value === 'function') {
      return { type: 'Function', value: 'function', line: startLine, column: startCol };
    }
    if (value === 'return') {
      return { type: 'Return', value: 'return', line: startLine, column: startCol };
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
      accept(visitor: ast.Visitor) {
        visitor.Program(this);
        this.body.forEach(child => child.accept(visitor));
      }
    } as ast.ProgramNode;
  }

  private parseStatement(): ast.Node {
    let stmt: ast.Node;
    if (this.currentToken.type === 'Let') {
      stmt = this.parseVariableDeclaration();
    } else if (this.currentToken.type === 'Print') {
      stmt = this.parsePrintStatement();
    } else if (this.currentToken.type === 'LeftBrace') {
      stmt = this.parseBlockStatement();
    } else if (this.currentToken.type === 'If') {
      stmt = this.parseIfStatement();
    } else if (this.currentToken.type === 'While') {
      stmt = this.parseWhileStatement();
    } else if (this.currentToken.type === 'For') {
      stmt = this.parseForStatement();
    } else if (this.currentToken.type === 'Function') {
      stmt = this.parseFunctionDeclaration();
    } else if (this.currentToken.type === 'Return') {
      stmt = this.parseReturnStatement();
    } else {
      stmt = this.parseExpressionStatement();
    }

    // Handle semicolon for all non-block statements
    if (stmt.type !== 'BlockStatement' && stmt.type !== 'IfStatement' && stmt.type !== 'WhileStatement' && stmt.type !== 'ForStatement' && stmt.type !== 'FunctionDeclaration' && this.currentToken.type === 'Semicolon') {
      this.eat('Semicolon');
    }
    
    return stmt;
  }

  private parseExpressionStatement(): ast.ExpressionStatementNode {
    const expression = this.parseExpression();
    return { 
      type: 'ExpressionStatement', 
      expression, 
      accept(visitor: ast.Visitor) {
        this.expression.accept(visitor);
        visitor.ExpressionStatement(this);
      }
    } as ast.ExpressionStatementNode;
  }

  private getPrecedence(opType: string): number {
    switch (opType) {
      case 'DoubleEquals':
      case 'NotEquals':
      case 'LessThan':
      case 'GreaterThan':
      case 'LessThanOrEquals':
      case 'GreaterThanOrEquals':
        return 1;
      case 'Plus':
      case 'Minus': return 2;
      case 'Multiply':
      case 'Divide': return 3;
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
        accept(visitor: ast.Visitor) {
          visitor.BinaryExpression(this);
        }
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
      accept(visitor: ast.Visitor) {
        visitor.VariableDeclaration(this);
      }
    } as ast.VariableDeclarationNode;
  }

  private parsePrintStatement(): ast.PrintStatementNode {
    this.eat('Print');
    const expression = this.parseExpression();
    return {
      type: 'PrintStatement',
      expression,
      accept(visitor: ast.Visitor) {
        visitor.PrintStatement(this);
      }
    } as ast.PrintStatementNode;
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
      accept(visitor: ast.Visitor) {
        visitor.BlockStatement(this);
      }
    } as ast.BlockStatementNode;
  }

  private parseIfStatement(): ast.IfStatementNode {
    this.eat('If');
    this.eat('LeftParen');
    const test = this.parseExpression();
    this.eat('RightParen');
    
    const consequent = this.parseBlockStatement();
    let alternate: ast.IfStatementNode | ast.BlockStatementNode | null = null;
    
    if (this.currentToken.type === 'Else') {
      this.eat('Else');
      const tokenType = this.currentToken.type as string;
      if (tokenType === 'If') {
        alternate = this.parseIfStatement();
      } else {
        alternate = this.parseBlockStatement();
      }
    }
    
    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
      accept(visitor: ast.Visitor) {
        visitor.IfStatement(this);
      }
    } as ast.IfStatementNode;
  }

  private parseWhileStatement(): ast.WhileStatementNode {
    this.eat('While');
    this.eat('LeftParen');
    const test = this.parseExpression();
    this.eat('RightParen');
    
    const body = this.parseBlockStatement();
    
    return {
      type: 'WhileStatement',
      test,
      body,
      accept(visitor: ast.Visitor) {
        visitor.WhileStatement(this);
      }
    } as ast.WhileStatementNode;
  }

  private parseForStatement(): ast.ForStatementNode {
    this.eat('For');
    this.eat('LeftParen');

    let init: ast.Node | null = null;
    if (this.currentToken.type !== 'Semicolon') {
      if (this.currentToken.type === 'Let') {
        init = this.parseVariableDeclaration();
      } else {
        init = this.parseExpression();
      }
    }
    this.eat('Semicolon');

    let test: ast.Node | null = null;
    if (this.currentToken.type !== 'Semicolon') {
      test = this.parseExpression();
    }
    this.eat('Semicolon');

    let update: ast.Node | null = null;
    if (this.currentToken.type !== 'RightParen') {
      update = this.parseExpression();
    }
    this.eat('RightParen');

    const body = this.parseBlockStatement();

    return {
      type: 'ForStatement',
      init,
      test,
      update,
      body,
      accept(visitor: ast.Visitor) {
        visitor.ForStatement(this);
      }
    } as ast.ForStatementNode;
  }

  private parseFunctionDeclaration(): ast.FunctionDeclarationNode {
    this.eat('Function');
    const name = this.parseIdentifier();
    
    this.eat('LeftParen');
    const params: ast.IdentifierNode[] = [];
    if (this.currentToken.type !== 'RightParen') {
        params.push(this.parseIdentifier());
        while (this.currentToken.type === 'Comma') {
            this.eat('Comma');
            params.push(this.parseIdentifier());
        }
    }
    this.eat('RightParen');
    
    const body = this.parseBlockStatement();
    
    return {
        type: 'FunctionDeclaration',
        name,
        params,
        body,
        accept(visitor: ast.Visitor) {
            visitor.FunctionDeclaration(this);
        }
    } as ast.FunctionDeclarationNode;
  }

  private parseReturnStatement(): ast.ReturnStatementNode {
    this.eat('Return');
    let argument: ast.Node | null = null;
    if (this.currentToken.type !== 'Semicolon') {
        argument = this.parseExpression();
    }
    
    return {
        type: 'ReturnStatement',
        argument,
        accept(visitor: ast.Visitor) {
            visitor.ReturnStatement(this);
        }
    } as ast.ReturnStatementNode;
  }

  private parseExpression(): ast.Node {
    return this.parseBinaryExpression(0);
  }

  private parseAssignmentExpression(): ast.Node {
    let expr = this.parsePrimaryExpression();

    while (this.currentToken.type === 'LeftParen') {
      this.eat('LeftParen');
      const args: ast.Node[] = [];
      if (this.currentToken.type !== 'RightParen') {
        args.push(this.parseExpression());
        while (this.currentToken.type === 'Comma') {
          this.eat('Comma');
          args.push(this.parseExpression());
        }
      }
      this.eat('RightParen');
      expr = {
        type: 'CallExpression',
        callee: expr,
        arguments: args,
        accept(visitor: ast.Visitor) {
            visitor.CallExpression(this);
        }
      } as ast.CallExpressionNode;
    }

    if (this.currentToken.type === 'Assignment') {
      if (expr.type !== 'Identifier') {
        throw new Error('Invalid left-hand side in assignment expression.');
      }
      this.eat('Assignment');
      const right = this.parseExpression();
      return { 
        type: 'AssignmentExpression',
        left: expr,
        right,
        accept(visitor: ast.Visitor) {
          this.left.accept(visitor);
          this.right.accept(visitor);
          visitor.AssignmentExpression(this);
        }
      } as ast.AssignmentExpressionNode;
    }
    
    return expr;
  }

  private parsePrimaryExpression(): ast.Node {
    if (this.currentToken.type === 'Minus') {
      return this.parseUnaryExpression();
    }
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

  private parseUnaryExpression(): ast.UnaryExpressionNode {
    const token = this.currentToken;
    this.eat('Minus');
    const argument = this.parsePrimaryExpression();
    return {
      type: 'UnaryExpression',
      operator: token.value as string,
      argument,
      accept(visitor: ast.Visitor) {
        visitor.UnaryExpression(this);
      }
    } as ast.UnaryExpressionNode;
  }

  private parseFirstExpression(): ast.FirstExpressionNode {
    this.eat('First');
    const argument = this.parseExpression();
    return {
      type: 'FirstExpression',
      argument,
      accept(visitor: ast.Visitor) {
        visitor.FirstExpression(this);
      }
    } as ast.FirstExpressionNode;
  }

  private parseIdentifier(): ast.IdentifierNode {
    const token = this.currentToken;
    this.eat('Identifier');
    return { 
      type: 'Identifier', 
      name: token.value as string, 
      accept(visitor: ast.Visitor) {
        visitor.Identifier(this);
      }
    } as ast.IdentifierNode;
  }

  private parseNumericLiteral(): ast.NumericLiteralNode {
    const token = this.currentToken;
    this.eat('NumericLiteral');
    return { 
      type: 'NumericLiteral', 
      value: token.value as number, 
      accept(visitor: ast.Visitor) {
        visitor.NumericLiteral(this);
      }
    } as ast.NumericLiteralNode;
  }
}
