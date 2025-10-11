//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 2.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// PURE BINARY AST PARSER - 100% Binary Operations
//======================================================================
// Philosophy: Parser ใช้ BINARY 100% - ไม่มี String comparison เลย
// 
// Rules:
// 1. ใช้ token.binary เท่านั้น (Integer comparison)
// 2. ไม่ skip keyword ใดๆ - ต้องแปลงทั้งหมด
// 3. ถาม GrammarIndex สำหรับ structure
// 4. NO_HARDCODE - ทุกอย่างมาจาก Grammar
// 5. NO_SILENT_FALLBACKS - Error ต้องชัดเจน
//======================================================================

import errorHandler from '../../error-handler/ErrorHandler.js';

// Binary constants from tokenizer-binary-config.json
const BINARY = {
    IDENTIFIER:   1,      // 0b0000000000000001
    NUMBER:       2,      // 0b0000000000000010
    OPERATOR:     8,      // 0b0000000000001000
    KEYWORD:      32,     // 0b0000000000100000
    PUNCTUATION:  64,     // 0b0000000001000000
    STRING:       128,    // 0b0000000010000000
    COMMENT:      256     // 0b0000000100000000
};

export class PureBinaryParser {
    constructor(tokens, grammarIndex) {
        this.tokens = tokens;
        this.grammarIndex = grammarIndex;
        this.current = 0;
        this.BINARY = BINARY;
        
        // ! 100% BINARY: โหลด punctuation binary constants จาก grammar
        this.PUNCT = {
            LPAREN: grammarIndex.getPunctuationBinary('('),      // 1
            RPAREN: grammarIndex.getPunctuationBinary(')'),      // 2
            LBRACE: grammarIndex.getPunctuationBinary('{'),      // 3
            RBRACE: grammarIndex.getPunctuationBinary('}'),      // 4
            LBRACKET: grammarIndex.getPunctuationBinary('['),    // 5
            RBRACKET: grammarIndex.getPunctuationBinary(']'),    // 6
            SEMICOLON: grammarIndex.getPunctuationBinary(';'),   // 7
            COMMA: grammarIndex.getPunctuationBinary(','),       // 8
            DOT: grammarIndex.getPunctuationBinary('.'),         // 9
            COLON: grammarIndex.getPunctuationBinary(':'),       // 10
            QUESTION: grammarIndex.getPunctuationBinary('?'),    // 11
            ARROW: grammarIndex.getPunctuationBinary('=>'),      // 12
            SPREAD: grammarIndex.getPunctuationBinary('...')     // 13
        };
    }

    parse() {
        console.log('[PureBinaryParser] Starting pure binary AST generation...');
        
        const ast = {
            type: 'Program',
            body: [],
            sourceType: 'module'
        };

        while (!this.isAtEnd()) {
            try {
                this.skipComments();
                if (this.isAtEnd()) break;
                
                const stmt = this.parseStatement();
                if (stmt) {
                    ast.body.push(stmt);
                }
            } catch (error) {
                errorHandler.handleError(error, {
                    source: 'PureBinaryParser',
                    method: 'parse',
                    position: this.current,
                    token: this.peek()?.value || 'EOF',
                    severity: 'HIGH'
                });
                throw error;
            }
        }

        console.log(`[PureBinaryParser] AST Built: ${ast.body.length} statements`);
        return ast;
    }

    // ========================================================================
    // STATEMENT PARSING - PURE BINARY
    // ========================================================================
    
    parseStatement() {
        this.skipComments();
        const token = this.peek();
        
        if (!token) return null;

        // PURE BINARY: ใช้ binary check แทน String
        if (token.binary === this.BINARY.KEYWORD) {
            return this.parseKeywordStatement(token);
        }

        // Expression statement
        return this.parseExpressionStatement();
    }

    parseKeywordStatement(token) {
        const keyword = token.value;
        const keywordInfo = this.grammarIndex.getKeywordInfo(keyword);
        
        if (!keywordInfo) {
            throw new Error(`Unknown keyword: ${keyword} at position ${this.current}`);
        }

        // ถาม Grammar ว่า keyword นี้ต้อง parse อย่างไร
        const category = keywordInfo.category;

        switch (category) {
            case 'declaration':
                return this.parseDeclaration(keyword, keywordInfo);
            case 'control':
                return this.parseControl(keyword, keywordInfo);
            case 'iteration':
                return this.parseIteration(keyword, keywordInfo);
            case 'exception':
                return this.parseException(keyword, keywordInfo);
            case 'module':
                return this.parseModule(keyword, keywordInfo);
            default:
                throw new Error(`Unknown keyword category: ${category} for keyword: ${keyword}`);
        }
    }

    // ========================================================================
    // DECLARATION PARSING
    // ========================================================================
    
    parseDeclaration(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // Skip keyword (const/let/var/function/class)

        // ใช้ subcategory จาก Grammar แทน hardcode
        const subcategory = keywordInfo.subcategory;

        if (subcategory === 'variableDeclaration') {
            return this.parseVariableDeclaration(keyword, start);
        } else if (subcategory === 'functionDeclaration') {
            return this.parseFunctionDeclaration(start);
        } else if (subcategory === 'classDeclaration') {
            return this.parseClassDeclaration(start);
        } else {
            throw new Error(`Unhandled declaration subcategory: ${subcategory}`);
        }
    }

    parseVariableDeclaration(kind, start) {
        const declarations = [];

        do {
            // parseDeclaration() already advanced past keyword, so current is at identifier
            const id = this.parseIdentifier();
            let init = null;

            // ! 100% BINARY: ตรวจสอบว่ามี '=' operator หรือไม่
            const assignOp = this.peek();
            if (assignOp && assignOp.binary === this.BINARY.OPERATOR && 
                this.grammarIndex.isAssignmentOperator(assignOp.value) && 
                assignOp.value === '=') {
                this.advance(); // Skip '='
                init = this.parseExpression();
            }

            declarations.push({
                type: 'VariableDeclarator',
                id: id,
                init: init
            });

        } while (this.matchPunctuation(this.PUNCT.COMMA) && this.advance());

        this.consumeSemicolon();

        return {
            type: 'VariableDeclaration',
            kind: kind,
            declarations: declarations,
            start: start,
            end: this.current
        };
    }

    parseFunctionDeclaration(start) {
        const id = this.parseIdentifier();
        const params = this.parseParameterList();
        const body = this.parseBlockStatement();

        return {
            type: 'FunctionDeclaration',
            id: id,
            params: params,
            body: body,
            start: start,
            end: this.current
        };
    }

    parseClassDeclaration(start) {
        const id = this.parseIdentifier();
        this.consumePunctuation(this.PUNCT.LBRACE);
        
        const body = [];
        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            // Skip class members for now
            this.advance();
        }
        
        this.consumePunctuation(this.PUNCT.RBRACE);

        return {
            type: 'ClassDeclaration',
            id: id,
            body: { type: 'ClassBody', body: body },
            start: start,
            end: this.current
        };
    }

    // ========================================================================
    // CONTROL FLOW PARSING
    // ========================================================================
    
    parseControl(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // keyword

        // ใช้ subcategory จาก Grammar แทน hardcode
        const subcategory = keywordInfo.subcategory;

        if (subcategory === 'ifStatement') {
            return this.parseIfStatement(start);
        } else if (subcategory === 'returnStatement') {
            return this.parseReturnStatement(start);
        } else if (subcategory === 'breakStatement') {
            return this.parseBreakStatement(start);
        } else if (subcategory === 'continueStatement') {
            return this.parseContinueStatement(start);
        } else {
            throw new Error(`Unhandled control subcategory: ${subcategory}`);
        }
    }

    parseIfStatement(start) {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        const consequent = this.parseStatement();
        
        let alternate = null;
        // SECTION-BASED: ใช้ binary check + grammar lookup แทน string comparison
        const nextToken = this.peek();
        if (nextToken && 
            nextToken.binary === this.BINARY.KEYWORD && 
            this.grammarIndex.isKeywordSubcategory(nextToken.value, 'elseClause')) {
            this.advance();
            alternate = this.parseStatement();
        }

        return {
            type: 'IfStatement',
            test: test,
            consequent: consequent,
            alternate: alternate,
            start: start,
            end: this.current
        };
    }

    parseReturnStatement(start) {
        let argument = null;
        
        if (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            argument = this.parseExpression();
        }
        
        this.consumeSemicolon();

        return {
            type: 'ReturnStatement',
            argument: argument,
            start: start,
            end: this.current
        };
    }

    parseBreakStatement(start) {
        this.consumeSemicolon();
        return {
            type: 'BreakStatement',
            start: start,
            end: this.current
        };
    }

    parseContinueStatement(start) {
        this.consumeSemicolon();
        return {
            type: 'ContinueStatement',
            start: start,
            end: this.current
        };
    }

    // ========================================================================
    // ITERATION PARSING
    // ========================================================================
    
    parseIteration(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // keyword

        // ใช้ subcategory จาก Grammar แทน hardcode
        const subcategory = keywordInfo.subcategory;

        if (subcategory === 'forLoop') {
            return this.parseForStatement(start);
        } else if (subcategory === 'whileLoop') {
            return this.parseWhileStatement(start);
        } else if (subcategory === 'doWhileLoop') {
            return this.parseDoWhileStatement(start);
        } else {
            throw new Error(`Unhandled iteration subcategory: ${subcategory}`);
        }
    }

    parseForStatement(start) {
        this.consumePunctuation(this.PUNCT.LPAREN);
        
        // Simplified for statement
        let init = null;
        let test = null;
        let update = null;

        if (!this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            init = this.parseExpression();
        }
        this.consumePunctuation(this.PUNCT.SEMICOLON);

        if (!this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            test = this.parseExpression();
        }
        this.consumePunctuation(this.PUNCT.SEMICOLON);

        if (!this.matchPunctuation(this.PUNCT.RPAREN)) {
            update = this.parseExpression();
        }
        this.consumePunctuation(this.PUNCT.RPAREN);

        const body = this.parseStatement();

        return {
            type: 'ForStatement',
            init: init,
            test: test,
            update: update,
            body: body,
            start: start,
            end: this.current
        };
    }

    parseWhileStatement(start) {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        const body = this.parseStatement();

        return {
            type: 'WhileStatement',
            test: test,
            body: body,
            start: start,
            end: this.current
        };
    }

    parseDoWhileStatement(start) {
        const body = this.parseStatement();
        this.consumeKeyword('while');
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        this.consumeSemicolon();

        return {
            type: 'DoWhileStatement',
            body: body,
            test: test,
            start: start,
            end: this.current
        };
    }

    // ========================================================================
    // EXCEPTION PARSING
    // ========================================================================
    
    parseException(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // keyword

        // ใช้ subcategory จาก Grammar แทน hardcode
        const subcategory = keywordInfo.subcategory;

        if (subcategory === 'tryStatement') {
            return this.parseTryStatement(start);
        } else if (subcategory === 'throwStatement') {
            return this.parseThrowStatement(start);
        } else {
            throw new Error(`Unhandled exception subcategory: ${subcategory}`);
        }
    }

    parseTryStatement(start) {
        const block = this.parseBlockStatement();
        
        let handler = null;
        // SECTION-BASED: ใช้ binary check + grammar lookup แทน string comparison
        let nextToken = this.peek();
        if (nextToken && 
            nextToken.binary === this.BINARY.KEYWORD && 
            this.grammarIndex.isKeywordSubcategory(nextToken.value, 'catchClause')) {
            this.advance();
            this.consumePunctuation(this.PUNCT.LPAREN);
            const param = this.parseIdentifier();
            this.consumePunctuation(this.PUNCT.RPAREN);
            const body = this.parseBlockStatement();
            
            handler = {
                type: 'CatchClause',
                param: param,
                body: body
            };
        }

        let finalizer = null;
        // SECTION-BASED: ใช้ binary check + grammar lookup แทน string comparison
        nextToken = this.peek();
        if (nextToken && 
            nextToken.binary === this.BINARY.KEYWORD && 
            this.grammarIndex.isKeywordSubcategory(nextToken.value, 'finallyClause')) {
            this.advance();
            finalizer = this.parseBlockStatement();
        }

        return {
            type: 'TryStatement',
            block: block,
            handler: handler,
            finalizer: finalizer,
            start: start,
            end: this.current
        };
    }

    parseThrowStatement(start) {
        const argument = this.parseExpression();
        this.consumeSemicolon();

        return {
            type: 'ThrowStatement',
            argument: argument,
            start: start,
            end: this.current
        };
    }

    // ========================================================================
    // MODULE PARSING
    // ========================================================================
    
    parseModule(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // keyword

        // ใช้ subcategory จาก Grammar แทน hardcode
        const subcategory = keywordInfo.subcategory;

        if (subcategory === 'importDeclaration') {
            return this.parseImportDeclaration(start);
        } else if (subcategory === 'exportDeclaration') {
            return this.parseExportDeclaration(start);
        } else {
            throw new Error(`Unhandled module subcategory: ${subcategory}`);
        }
    }

    parseImportDeclaration(start) {
        // Simplified import - skip to semicolon
        while (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            this.advance();
        }
        this.consumeSemicolon();

        return {
            type: 'ImportDeclaration',
            specifiers: [],
            source: { type: 'Literal', value: 'unknown' },
            start: start,
            end: this.current
        };
    }

    parseExportDeclaration(start) {
        // Simplified export - skip to semicolon
        while (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            this.advance();
        }
        this.consumeSemicolon();

        return {
            type: 'ExportDeclaration',
            declaration: null,
            start: start,
            end: this.current
        };
    }

    // ========================================================================
    // EXPRESSION PARSING - PURE BINARY
    // ========================================================================
    
    parseExpressionStatement() {
        const expr = this.parseExpression();
        this.consumeSemicolon();

        return {
            type: 'ExpressionStatement',
            expression: expr
        };
    }

    parseExpression() {
        return this.parseAssignmentExpression();
    }

    parseAssignmentExpression() {
        const left = this.parseLogicalExpression();
        const token = this.peek();

        if (token && token.binary === this.BINARY.OPERATOR && 
            this.grammarIndex.isAssignmentOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseAssignmentExpression();

            return {
                type: 'AssignmentExpression',
                operator: operator,
                left: left,
                right: right
            };
        }

        return left;
    }

    parseLogicalExpression() {
        let left = this.parseEqualityExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isLogicalOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseEqualityExpression();

            left = {
                type: 'LogicalExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseEqualityExpression() {
        let left = this.parseRelationalExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isEqualityOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseRelationalExpression();

            left = {
                type: 'BinaryExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseRelationalExpression() {
        let left = this.parseAdditiveExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isRelationalOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseAdditiveExpression();

            left = {
                type: 'BinaryExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseAdditiveExpression() {
        let left = this.parseMultiplicativeExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isAdditiveOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseMultiplicativeExpression();

            left = {
                type: 'BinaryExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseMultiplicativeExpression() {
        let left = this.parseUnaryExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isMultiplicativeOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseUnaryExpression();

            left = {
                type: 'BinaryExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseUnaryExpression() {
        const token = this.peek();

        // SECTION-BASED: ตรวจสอบจาก grammar แทน hardcode array
        if (token && ((token.binary === this.BINARY.OPERATOR && 
                       this.grammarIndex.isUnaryOperator(token.value)) ||
                      (token.binary === this.BINARY.KEYWORD && 
                       this.grammarIndex.isUnaryKeyword(token.value)))) {
            const operator = this.advance().value;
            const argument = this.parseUnaryExpression();

            return {
                type: 'UnaryExpression',
                operator: operator,
                prefix: true,
                argument: argument
            };
        }

        return this.parsePostfixExpression();
    }

    parsePostfixExpression() {
        let left = this.parsePrimaryExpression();

        while (true) {
            if (this.matchPunctuation(this.PUNCT.DOT)) {
                this.advance();
                const property = this.parseIdentifier();
                left = {
                    type: 'MemberExpression',
                    object: left,
                    property: property,
                    computed: false
                };
            } else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                this.advance();
                const property = this.parseExpression();
                this.consumePunctuation(this.PUNCT.RBRACKET);
                left = {
                    type: 'MemberExpression',
                    object: left,
                    property: property,
                    computed: true
                };
            } else if (this.matchPunctuation(this.PUNCT.LPAREN)) {
                const args = this.parseArgumentList();
                left = {
                    type: 'CallExpression',
                    callee: left,
                    arguments: args
                };
            } else {
                break;
            }
        }

        return left;
    }

    parsePrimaryExpression() {
        this.skipComments();
        const token = this.peek();

        if (!token) {
            throw new Error('Unexpected end of input');
        }

        // SECTION-BASED: ใช้ grammar lookup แทน string comparison
        if (token.binary === this.BINARY.KEYWORD && 
            this.grammarIndex.isKeywordSubcategory(token.value, 'newExpression')) {
            this.advance();
            const callee = this.parsePostfixExpression();
            return {
                type: 'NewExpression',
                callee: callee,
                arguments: []
            };
        }

        if (token.binary === this.BINARY.NUMBER) {
            this.advance();
            return {
                type: 'Literal',
                value: parseFloat(token.value),
                raw: token.value
            };
        }

        if (token.binary === this.BINARY.STRING) {
            this.advance();
            return {
                type: 'Literal',
                value: token.value.slice(1, -1),
                raw: token.value
            };
        }

        if (token.binary === this.BINARY.IDENTIFIER) {
            return this.parseIdentifier();
        }

        if (this.matchPunctuation(this.PUNCT.LPAREN)) {
            this.advance();
            const expr = this.parseExpression();
            this.consumePunctuation(this.PUNCT.RPAREN);
            return expr;
        }

        // Unknown token
        throw new Error(
            `Unexpected token in primary expression: "${token.value}"\n` +
            `Binary: ${token.binary}\n` +
            `Position: ${this.current}`
        );
    }

    // ========================================================================
    // HELPER METHODS - PURE BINARY
    // ========================================================================
    
    parseIdentifier() {
        const token = this.peek();
        if (token && (token.binary === this.BINARY.IDENTIFIER || 
                     token.binary === this.BINARY.KEYWORD)) {
            this.advance();
            return {
                type: 'Identifier',
                name: token.value
            };
        }
        throw new Error(`Expected identifier but got '${token?.value || 'EOF'}'`);
    }

    parseParameterList() {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const params = [];

        while (!this.matchPunctuation(this.PUNCT.RPAREN) && !this.isAtEnd()) {
            params.push(this.parseIdentifier());
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                this.advance();
            }
        }

        this.consumePunctuation(this.PUNCT.RPAREN);
        return params;
    }

    parseArgumentList() {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const args = [];

        while (!this.matchPunctuation(this.PUNCT.RPAREN) && !this.isAtEnd()) {
            args.push(this.parseExpression());
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                this.advance();
            }
        }

        this.consumePunctuation(this.PUNCT.RPAREN);
        return args;
    }

    parseBlockStatement() {
        this.consumePunctuation(this.PUNCT.LBRACE);
        const body = [];

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt) body.push(stmt);
        }

        this.consumePunctuation(this.PUNCT.RBRACE);
        return {
            type: 'BlockStatement',
            body: body
        };
    }

    skipComments() {
        while (this.peek() && this.peek().binary === this.BINARY.COMMENT) {
            this.advance();
        }
    }

    consumeSemicolon() {
        if (this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            this.advance();
        }
    }

    consumeKeyword(keyword) {
        const token = this.peek();
        if (token && token.binary === this.BINARY.KEYWORD && token.value === keyword) {
            this.advance();
            return token;
        }
        throw new Error(`Expected keyword '${keyword}' but got '${token?.value || 'EOF'}'`);
    }

    /**
     * Consume punctuation using BINARY CHECK (100% BINARY - NO STRING COMPARISON)
     * @param {number} punctBinary - Binary constant for punctuation
     * @returns {Object} - consumed token
     */
    consumePunctuation(punctBinary) {
        const token = this.peek();
        if (this.matchPunctuation(punctBinary)) {
            this.advance();
            return token;
        }
        const expected = this.grammarIndex.getPunctuationFromBinary(punctBinary);
        throw new Error(`Expected '${expected}' but got '${token?.value || 'EOF'}'`);
    }

    consume(value) {
        // ! DEPRECATED: Use consumePunctuation() for 100% binary parsing
        // ! This method remains for backward compatibility only
        if (this.matchValue(value)) {
            this.advance();
            return this.tokens[this.current - 1];
        }
        throw new Error(`Expected '${value}' but got '${this.peek()?.value || 'EOF'}'`);
    }

    /**
     * Match punctuation using BINARY CHECK (100% BINARY - NO STRING COMPARISON)
     * @param {number} punctBinary - Binary constant for punctuation
     * @returns {boolean}
     */
    matchPunctuation(punctBinary) {
        const token = this.peek();
        return token && 
               token.binary === this.BINARY.PUNCTUATION && 
               token.punctuationBinary === punctBinary;
    }

    matchValue(value) {
        // ! DEPRECATED: Use matchPunctuation() for 100% binary parsing
        // ! This method remains for backward compatibility only
        const token = this.peek();
        return token && token.value === value;
    }

    peekValue() {
        return this.peek()?.value;
    }

    peek() {
        return this.tokens[this.current];
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.tokens[this.current - 1];
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }
}

export default PureBinaryParser;
