"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Lexer = exports.TokenType = void 0;
exports.TokenType = {
    EOF: 'EOF',
    Identifier: 'Identifier',
    NumericLiteral: 'NumericLiteral',
    StringLiteral: 'StringLiteral',
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
    LeftBracket: '[',
    RightBracket: ']',
    Let: 'let',
    If: 'if',
    Else: 'else',
    True: 'true',
    False: 'false',
    While: 'while',
    For: 'for',
    DoubleEquals: '==',
    NotEquals: '!=',
    LessThan: '<',
    GreaterThan: '>',
    LessThanOrEquals: '<=',
    GreaterThanOrEquals: '>=',
    Comma: ',',
    Colon: ':',
    Dot: '.',
    Bang: '!',
    AmpersandAmpersand: '&&',
    PipePipe: '||',
    Function: 'function',
    Return: 'return',
    Class: 'class',
    Constructor: 'constructor',
    This: 'this',
    New: 'new',
};
class Lexer {
    input;
    position = 0;
    line = 1;
    column = 0;
    constructor(input) {
        this.input = input;
    }
    nextToken() {
        while (/\s/.test(this.peek())) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 0;
            }
            else {
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
        if (char === '"') {
            return this.parseString();
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
            return { type: 'Bang', value: '!', line: this.line, column: startCol };
        }
        if (char === '&') {
            this.advance();
            if (this.peek() === '&') {
                this.advance();
                return { type: 'AmpersandAmpersand', value: '&&', line: this.line, column: startCol };
            }
        }
        if (char === '|') {
            this.advance();
            if (this.peek() === '|') {
                this.advance();
                return { type: 'PipePipe', value: '||', line: this.line, column: startCol };
            }
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
        if (char === '[') {
            this.advance();
            return { type: 'LeftBracket', value: '[', line: this.line, column: startCol };
        }
        if (char === ']') {
            this.advance();
            return { type: 'RightBracket', value: ']', line: this.line, column: startCol };
        }
        if (char === ',') {
            this.advance();
            return { type: 'Comma', value: ',', line: this.line, column: startCol };
        }
        if (char === ';') {
            this.advance();
            return { type: 'Semicolon', value: ';', line: this.line, column: startCol };
        }
        if (char === ':') {
            this.advance();
            return { type: 'Colon', value: ':', line: this.line, column: startCol };
        }
        if (char === '.') {
            this.advance();
            return { type: 'Dot', value: '.', line: this.line, column: startCol };
        }
        throw new Error(`Unexpected character: '${char}' at line ${this.line}, column ${this.column}`);
    }
    parseIdentifier() {
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
        if (value === 'true') {
            return { type: 'True', value: 'true', line: startLine, column: startCol };
        }
        if (value === 'false') {
            return { type: 'False', value: 'false', line: startLine, column: startCol };
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
        if (value === 'class') {
            return { type: 'Class', value: 'class', line: startLine, column: startCol };
        }
        if (value === 'constructor') {
            return { type: 'Constructor', value: 'constructor', line: startLine, column: startCol };
        }
        if (value === 'this') {
            return { type: 'This', value: 'this', line: startLine, column: startCol };
        }
        if (value === 'new') {
            return { type: 'New', value: 'new', line: startLine, column: startCol };
        }
        return { type: 'Identifier', value, line: startLine, column: startCol };
    }
    parseNumber() {
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
    parseString() {
        const startCol = this.column;
        this.advance(); // consume opening "
        const start = this.position;
        while (this.peek() !== '"' && this.position < this.input.length) {
            this.advance();
        }
        if (this.peek() !== '"') {
            throw new Error(`Unterminated string at line ${this.line}, column ${startCol}`);
        }
        const value = this.input.slice(start, this.position);
        this.advance(); // consume closing "
        return { type: 'StringLiteral', value, line: this.line, column: startCol };
    }
    peek() {
        if (this.position >= this.input.length)
            return '';
        return this.input.charAt(this.position);
    }
    advance() {
        this.position++;
        this.column++;
    }
}
exports.Lexer = Lexer;
class Parser {
    lexer;
    currentToken;
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = lexer.nextToken();
    }
    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.nextToken();
        }
        else {
            throw new Error(`Unexpected token: ${this.currentToken.type}, expected ${tokenType}`);
        }
    }
    parseProgram() {
        const body = [];
        while (this.currentToken.type !== 'EOF') {
            body.push(this.parseStatement());
        }
        return {
            type: 'Program',
            body,
            accept(visitor) {
                visitor.Program(this);
                this.body.forEach(child => child.accept(visitor));
            }
        };
    }
    parseStatement() {
        let stmt;
        if (this.currentToken.type === 'Let') {
            stmt = this.parseVariableDeclaration();
        }
        else if (this.currentToken.type === 'LeftBrace') {
            stmt = this.parseBlockStatement();
        }
        else if (this.currentToken.type === 'If') {
            stmt = this.parseIfStatement();
        }
        else if (this.currentToken.type === 'While') {
            stmt = this.parseWhileStatement();
        }
        else if (this.currentToken.type === 'For') {
            stmt = this.parseForStatement();
        }
        else if (this.currentToken.type === 'Function') {
            stmt = this.parseFunctionDeclaration();
        }
        else if (this.currentToken.type === 'Class') {
            stmt = this.parseClassDeclaration();
        }
        else if (this.currentToken.type === 'Return') {
            stmt = this.parseReturnStatement();
        }
        else {
            stmt = this.parseExpressionStatement();
        }
        // Handle semicolon for all non-block statements
        if (stmt.type !== 'BlockStatement' && stmt.type !== 'IfStatement' && stmt.type !== 'WhileStatement' && stmt.type !== 'ForStatement' && stmt.type !== 'FunctionDeclaration' && stmt.type !== 'ClassDeclaration' && this.currentToken.type === 'Semicolon') {
            this.eat('Semicolon');
        }
        return stmt;
    }
    parseExpressionStatement() {
        const expression = this.parseExpression();
        return {
            type: 'ExpressionStatement',
            expression,
            accept(visitor) {
                this.expression.accept(visitor);
                visitor.ExpressionStatement(this);
            }
        };
    }
    getPrecedence(opType) {
        switch (opType) {
            case 'PipePipe':
                return 1;
            case 'AmpersandAmpersand':
                return 2;
            case 'DoubleEquals':
            case 'NotEquals':
            case 'LessThan':
            case 'GreaterThan':
            case 'LessThanOrEquals':
            case 'GreaterThanOrEquals':
                return 3;
            case 'Plus':
            case 'Minus': return 4;
            case 'Multiply':
            case 'Divide': return 5;
            default: return 0;
        }
    }
    parseBinaryExpression(precedence) {
        let left = this.parseCallMemberExpression();
        while (true) {
            const token = this.currentToken;
            const opType = token.type;
            const newPrecedence = this.getPrecedence(opType);
            if (newPrecedence === 0 || newPrecedence <= precedence)
                break;
            this.eat(opType);
            const right = this.parseBinaryExpression(newPrecedence);
            if (opType === 'AmpersandAmpersand' || opType === 'PipePipe') {
                left = {
                    type: 'LogicalExpression',
                    operator: token.value,
                    left,
                    right,
                    accept(visitor) {
                        visitor.LogicalExpression(this);
                    }
                };
            }
            else {
                left = {
                    type: 'BinaryExpression',
                    operator: token.value,
                    left,
                    right,
                    accept(visitor) {
                        visitor.BinaryExpression(this);
                    }
                };
            }
        }
        return left;
    }
    parseVariableDeclaration() {
        this.eat('Let');
        const identifier = this.parseIdentifier();
        let initializer = null;
        if (this.currentToken.type === 'Assignment') {
            this.eat('Assignment');
            initializer = this.parseExpression();
        }
        return {
            type: 'VariableDeclaration',
            identifier,
            initializer,
            accept(visitor) {
                visitor.VariableDeclaration(this);
            }
        };
    }
    parseBlockStatement() {
        this.eat('LeftBrace');
        const body = [];
        while (this.currentToken.type !== 'RightBrace' && this.currentToken.type !== 'EOF') {
            body.push(this.parseStatement());
        }
        this.eat('RightBrace');
        return {
            type: 'BlockStatement',
            body,
            accept(visitor) {
                visitor.BlockStatement(this);
            }
        };
    }
    parseIfStatement() {
        this.eat('If');
        this.eat('LeftParen');
        const test = this.parseExpression();
        this.eat('RightParen');
        const consequent = this.parseBlockStatement();
        let alternate = null;
        if (this.currentToken.type === 'Else') {
            this.eat('Else');
            const tokenType = this.currentToken.type;
            if (tokenType === 'If') {
                alternate = this.parseIfStatement();
            }
            else {
                alternate = this.parseBlockStatement();
            }
        }
        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate,
            accept(visitor) {
                visitor.IfStatement(this);
            }
        };
    }
    parseWhileStatement() {
        this.eat('While');
        this.eat('LeftParen');
        const test = this.parseExpression();
        this.eat('RightParen');
        const body = this.parseBlockStatement();
        return {
            type: 'WhileStatement',
            test,
            body,
            accept(visitor) {
                visitor.WhileStatement(this);
            }
        };
    }
    parseForStatement() {
        this.eat('For');
        this.eat('LeftParen');
        let init = null;
        if (this.currentToken.type !== 'Semicolon') {
            if (this.currentToken.type === 'Let') {
                init = this.parseVariableDeclaration();
            }
            else {
                init = this.parseExpression();
            }
        }
        this.eat('Semicolon');
        let test = null;
        if (this.currentToken.type !== 'Semicolon') {
            test = this.parseExpression();
        }
        this.eat('Semicolon');
        let update = null;
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
            accept(visitor) {
                visitor.ForStatement(this);
            }
        };
    }
    parseFunctionDeclaration() {
        this.eat('Function');
        const name = this.parseIdentifier();
        this.eat('LeftParen');
        const params = [];
        const currentTokenType = this.currentToken.type;
        if (currentTokenType !== 'RightParen') {
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
            accept(visitor) {
                visitor.FunctionDeclaration(this);
            }
        };
    }
    parseClassDeclaration() {
        this.eat('Class');
        const name = this.parseIdentifier();
        this.eat('LeftBrace');
        const body = [];
        while (this.currentToken.type !== 'RightBrace') {
            body.push(this.parseMethodDefinition());
        }
        this.eat('RightBrace');
        return {
            type: 'ClassDeclaration',
            name,
            body,
            accept(visitor) { visitor.ClassDeclaration(this); }
        };
    }
    parseMethodDefinition() {
        let key;
        if (this.currentToken.type === 'Constructor') {
            const token = this.currentToken;
            this.eat('Constructor');
            key = {
                type: 'Identifier',
                name: token.value,
                accept(visitor) { visitor.Identifier(this); }
            };
        }
        else {
            key = this.parseIdentifier();
        }
        const kind = key.name === 'constructor' ? 'constructor' : 'method';
        this.eat('LeftParen');
        const params = [];
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
            type: 'MethodDefinition',
            key,
            kind,
            params,
            body,
            accept(visitor) { visitor.MethodDefinition(this); }
        };
    }
    parseReturnStatement() {
        this.eat('Return');
        let argument = null;
        if (this.currentToken.type !== 'Semicolon') {
            argument = this.parseExpression();
        }
        return {
            type: 'ReturnStatement',
            argument,
            accept(visitor) {
                visitor.ReturnStatement(this);
            }
        };
    }
    parseExpression() {
        return this.parseAssignmentExpression();
    }
    parseAssignmentExpression() {
        const left = this.parseBinaryExpression(0);
        if (this.currentToken.type === 'Assignment') {
            if (left.type !== 'Identifier' && left.type !== 'MemberExpression') {
                throw new Error('Invalid left-hand side in assignment expression.');
            }
            this.eat('Assignment');
            const right = this.parseAssignmentExpression(); // Right-associative
            return {
                type: 'AssignmentExpression',
                left,
                right,
                accept(visitor) {
                    this.left.accept(visitor);
                    this.right.accept(visitor);
                    visitor.AssignmentExpression(this);
                }
            };
        }
        return left;
    }
    parseCallMemberExpression(allowCall = true) {
        let expr = this.parsePrimaryExpression();
        while (true) {
            const tokenType = this.currentToken.type;
            if (allowCall && tokenType === 'LeftParen') {
                this.eat('LeftParen');
                const args = [];
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
                    accept(visitor) {
                        visitor.CallExpression(this);
                    }
                };
            }
            else if (tokenType === 'LeftBracket') {
                this.eat('LeftBracket');
                const property = this.parseExpression();
                this.eat('RightBracket');
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property,
                    computed: true,
                    accept(visitor) { visitor.MemberExpression(this); }
                };
            }
            else if (tokenType === 'Dot') {
                this.eat('Dot');
                const property = this.parseIdentifier();
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property,
                    computed: false,
                    accept(visitor) { visitor.MemberExpression(this); }
                };
            }
            else {
                break;
            }
        }
        return expr;
    }
    parsePrimaryExpression() {
        const tokenType = this.currentToken.type;
        if (tokenType === 'Minus' || tokenType === 'Bang') {
            return this.parseUnaryExpression();
        }
        switch (tokenType) {
            case 'Identifier':
                return this.parseIdentifier();
            case 'NumericLiteral':
                return this.parseNumericLiteral();
            case 'StringLiteral':
                return this.parseStringLiteral();
            case 'True':
            case 'False':
                return this.parseBooleanLiteral();
            case 'First':
                return this.parseFirstExpression();
            case 'This':
                return this.parseThisExpression();
            case 'New':
                return this.parseNewExpression();
            case 'LeftParen': {
                this.eat('LeftParen');
                const expr = this.parseExpression();
                this.eat('RightParen');
                return expr;
            }
            case 'LeftBracket':
                return this.parseArrayExpression();
            case 'LeftBrace':
                return this.parseObjectExpression();
            default:
                throw new Error(`Unexpected primary expression: ${this.currentToken.type}`);
        }
    }
    parseUnaryExpression() {
        const token = this.currentToken;
        this.eat(token.type); // Eat Minus or Bang
        const argument = this.parsePrimaryExpression();
        return {
            type: 'UnaryExpression',
            operator: token.value,
            argument,
            accept(visitor) {
                visitor.UnaryExpression(this);
            }
        };
    }
    parseThisExpression() {
        this.eat('This');
        return {
            type: 'ThisExpression',
            accept(visitor) { visitor.ThisExpression(this); }
        };
    }
    parseNewExpression() {
        this.eat('New');
        const callee = this.parseCallMemberExpression(false); // Parses callee but not call arguments
        // Arguments are optional for `new`
        let args = [];
        if (this.currentToken.type === 'LeftParen') {
            this.eat('LeftParen');
            if (this.currentToken.type !== 'RightParen') {
                args.push(this.parseExpression());
                while (this.currentToken.type === 'Comma') {
                    this.eat('Comma');
                    args.push(this.parseExpression());
                }
            }
            this.eat('RightParen');
        }
        return {
            type: 'NewExpression',
            callee,
            arguments: args,
            accept(visitor) { visitor.NewExpression(this); }
        };
    }
    parseFirstExpression() {
        this.eat('First');
        const argument = this.parseExpression();
        return {
            type: 'FirstExpression',
            argument,
            accept(visitor) {
                visitor.FirstExpression(this);
            }
        };
    }
    parseIdentifier() {
        const token = this.currentToken;
        this.eat('Identifier');
        return {
            type: 'Identifier',
            name: token.value,
            accept(visitor) {
                visitor.Identifier(this);
            }
        };
    }
    parseNumericLiteral() {
        const token = this.currentToken;
        this.eat('NumericLiteral');
        return {
            type: 'NumericLiteral',
            value: token.value,
            accept(visitor) {
                visitor.NumericLiteral(this);
            }
        };
    }
    parseStringLiteral() {
        const token = this.currentToken;
        this.eat('StringLiteral');
        return {
            type: 'StringLiteral',
            value: token.value,
            accept(visitor) { visitor.StringLiteral(this); }
        };
    }
    parseBooleanLiteral() {
        const token = this.currentToken;
        this.eat(token.type);
        return {
            type: 'BooleanLiteral',
            value: token.type === 'True',
            accept(visitor) { visitor.BooleanLiteral(this); }
        };
    }
    parseArrayExpression() {
        this.eat('LeftBracket');
        const elements = [];
        if (this.currentToken.type !== 'RightBracket') {
            elements.push(this.parseExpression());
            while (this.currentToken.type === 'Comma') {
                this.eat('Comma');
                elements.push(this.parseExpression());
            }
        }
        this.eat('RightBracket');
        return {
            type: 'ArrayExpression',
            elements,
            accept(visitor) { visitor.ArrayExpression(this); }
        };
    }
    parseObjectExpression() {
        this.eat('LeftBrace');
        const properties = [];
        if (this.currentToken.type !== 'RightBrace') {
            properties.push(this.parseProperty());
            while (this.currentToken.type === 'Comma') {
                this.eat('Comma');
                properties.push(this.parseProperty());
            }
        }
        this.eat('RightBrace');
        return {
            type: 'ObjectExpression',
            properties,
            accept(visitor) { visitor.ObjectExpression(this); }
        };
    }
    parseProperty() {
        let key;
        if (this.currentToken.type === 'Identifier') {
            key = this.parseIdentifier();
        }
        else if (this.currentToken.type === 'StringLiteral') {
            key = this.parseStringLiteral();
        }
        else {
            throw new Error(`Invalid property key type: ${this.currentToken.type}`);
        }
        this.eat('Colon');
        const value = this.parseExpression();
        return {
            type: 'Property',
            key,
            value,
            accept(visitor) { visitor.Property(this); }
        };
    }
}
exports.Parser = Parser;
