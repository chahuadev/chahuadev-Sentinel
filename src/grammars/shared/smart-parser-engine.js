// src/grammars/shared/smart-parser-engine.js
// 🚀 Smart Parser Engine - แทนที่ parser-study.js ด้วยระบบที่ฉลาดกว่า

const { ABSOLUTE_RULES } = require('../../validator');

/**
 * 🧠 JavaScript Tokenizer - แยกโค้ดเป็น Token ที่ละเอียด
 */
class JavaScriptTokenizer {
    constructor() {
        this.tokens = [];
        this.position = 0;
    }

    tokenize(code) {
        this.tokens = [];
        this.position = 0;
        const lines = code.split('\n');
        
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            this.tokenizeLine(line, lineIndex + 1);
        }
        
        return this.tokens;
    }

    tokenizeLine(line, lineNumber) {
        let i = 0;
        while (i < line.length) {
            const char = line[i];
            
            // Skip whitespace
            if (/\s/.test(char)) {
                i++;
                continue;
            }
            
            // Comments
            if (char === '/' && line[i + 1] === '/') {
                this.addToken('COMMENT', line.slice(i), lineNumber, i);
                break;
            }
            
            if (char === '/' && line[i + 1] === '*') {
                const commentEnd = line.indexOf('*/', i + 2);
                const content = commentEnd >= 0 ? line.slice(i, commentEnd + 2) : line.slice(i);
                this.addToken('COMMENT', content, lineNumber, i);
                i = commentEnd >= 0 ? commentEnd + 2 : line.length;
                continue;
            }
            
            // String literals
            if (char === '"' || char === "'" || char === '`') {
                const stringResult = this.parseString(line, i, char, lineNumber);
                this.addToken('STRING', stringResult.value, lineNumber, i);
                i = stringResult.endIndex;
                continue;
            }
            
            // Numbers
            if (/\d/.test(char)) {
                const numberResult = this.parseNumber(line, i, lineNumber);
                this.addToken('NUMBER', numberResult.value, lineNumber, i);
                i = numberResult.endIndex;
                continue;
            }
            
            // Keywords and identifiers
            if (/[a-zA-Z_$]/.test(char)) {
                const identifierResult = this.parseIdentifier(line, i, lineNumber);
                const tokenType = this.isKeyword(identifierResult.value) ? 'KEYWORD' : 'IDENTIFIER';
                this.addToken(tokenType, identifierResult.value, lineNumber, i);
                i = identifierResult.endIndex;
                continue;
            }
            
            // Operators and punctuation
            if (/[+\-*/=<>!&|^~%(){}[\];,.]/.test(char)) {
                this.addToken('OPERATOR', char, lineNumber, i);
                i++;
                continue;
            }
            
            i++;
        }
    }

    parseString(line, start, quote, lineNumber) {
        let i = start + 1;
        let value = quote;
        
        while (i < line.length && line[i] !== quote) {
            if (line[i] === '\\' && i + 1 < line.length) {
                value += line[i] + line[i + 1];
                i += 2;
            } else {
                value += line[i];
                i++;
            }
        }
        
        if (i < line.length) {
            value += quote; // Closing quote
            i++;
        }
        
        return { value, endIndex: i };
    }

    parseNumber(line, start, lineNumber) {
        let i = start;
        let value = '';
        
        while (i < line.length && /[\d.]/.test(line[i])) {
            value += line[i];
            i++;
        }
        
        return { value, endIndex: i };
    }

    parseIdentifier(line, start, lineNumber) {
        let i = start;
        let value = '';
        
        while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) {
            value += line[i];
            i++;
        }
        
        return { value, endIndex: i };
    }

    isKeyword(word) {
        const keywords = [
            'async', 'await', 'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
            'try', 'catch', 'finally', 'throw', 'return', 'import', 'export', 'class', 
            'extends', 'super', 'this', 'new', 'typeof', 'instanceof', 'in', 'of'
        ];
        return keywords.includes(word);
    }

    addToken(type, value, line, column) {
        this.tokens.push({
            type,
            value,
            location: { line, column },
            raw: value
        });
    }
}

/**
 * 🏗️ Structure Parser - วิเคราะห์โครงสร้างโค้ดที่ซับซ้อน
 */
class StructureParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.structures = {
            functions: [],
            classes: [],
            asyncFunctions: [],
            tryBlocks: [],
            imports: [],
            exports: []
        };
    }

    parse() {
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            
            // Detect functions
            if (token.type === 'KEYWORD' && token.value === 'function') {
                const funcInfo = this.parseFunctionDeclaration(i);
                if (funcInfo) {
                    this.structures.functions.push(funcInfo);
                }
            }
            
            // Detect async functions
            if (token.type === 'KEYWORD' && token.value === 'async') {
                const nextToken = this.tokens[i + 1];
                if (nextToken && nextToken.value === 'function') {
                    const asyncFuncInfo = this.parseAsyncFunction(i);
                    if (asyncFuncInfo) {
                        this.structures.asyncFunctions.push(asyncFuncInfo);
                    }
                }
            }
            
            // Detect try blocks
            if (token.type === 'KEYWORD' && token.value === 'try') {
                const tryInfo = this.parseTryBlock(i);
                if (tryInfo) {
                    this.structures.tryBlocks.push(tryInfo);
                }
            }
            
            // Detect classes
            if (token.type === 'KEYWORD' && token.value === 'class') {
                const classInfo = this.parseClass(i);
                if (classInfo) {
                    this.structures.classes.push(classInfo);
                }
            }
        }
        
        return this.structures;
    }

    parseFunctionDeclaration(startIndex) {
        const nameToken = this.tokens[startIndex + 1];
        if (!nameToken || nameToken.type !== 'IDENTIFIER') return null;
        
        // Count parameters
        let paramCount = 0;
        let i = startIndex + 2;
        let foundOpenParen = false;
        
        while (i < this.tokens.length && !foundOpenParen) {
            if (this.tokens[i].value === '(') {
                foundOpenParen = true;
                i++;
                break;
            }
            i++;
        }
        
        if (foundOpenParen) {
            while (i < this.tokens.length && this.tokens[i].value !== ')') {
                if (this.tokens[i].type === 'IDENTIFIER') {
                    paramCount++;
                }
                i++;
            }
        }
        
        return {
            type: 'function',
            name: nameToken.value,
            paramCount,
            location: nameToken.location
        };
    }

    parseAsyncFunction(startIndex) {
        const funcInfo = this.parseFunctionDeclaration(startIndex + 1);
        if (funcInfo) {
            funcInfo.isAsync = true;
            funcInfo.hasAwait = this.hasAwaitInFunction(startIndex);
            funcInfo.hasTryCatch = this.hasTryCatchInFunction(startIndex);
        }
        return funcInfo;
    }

    hasAwaitInFunction(startIndex) {
        // Simple check for await keyword after function declaration
        let depth = 0;
        for (let i = startIndex; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token.value === '{') depth++;
            if (token.value === '}') {
                depth--;
                if (depth === 0) break;
            }
            if (token.type === 'KEYWORD' && token.value === 'await' && depth > 0) {
                return true;
            }
        }
        return false;
    }

    hasTryCatchInFunction(startIndex) {
        // Simple check for try-catch blocks within function
        let depth = 0;
        for (let i = startIndex; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token.value === '{') depth++;
            if (token.value === '}') {
                depth--;
                if (depth === 0) break;
            }
            if (token.type === 'KEYWORD' && token.value === 'try' && depth > 0) {
                return true;
            }
        }
        return false;
    }

    parseTryBlock(startIndex) {
        return {
            type: 'try-block',
            location: this.tokens[startIndex].location,
            hasCatch: this.hasCatchAfterTry(startIndex),
            hasFinally: this.hasFinallyAfterTry(startIndex)
        };
    }

    hasCatchAfterTry(startIndex) {
        let depth = 0;
        for (let i = startIndex; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token.value === '{') depth++;
            if (token.value === '}') {
                depth--;
                if (depth === 0) {
                    // Check next token for catch
                    const nextToken = this.tokens[i + 1];
                    return nextToken && nextToken.value === 'catch';
                }
            }
        }
        return false;
    }

    hasFinallyAfterTry(startIndex) {
        // Similar logic for finally block
        return false; // Simplified for now
    }

    parseClass(startIndex) {
        const nameToken = this.tokens[startIndex + 1];
        if (!nameToken || nameToken.type !== 'IDENTIFIER') return null;
        
        return {
            type: 'class',
            name: nameToken.value,
            location: nameToken.location
        };
    }
}

/**
 * 🛡️ Smart File Analyzer - ระบบวิเคราะห์ไฟล์อัจฉริยะ
 */
class SmartFileAnalyzer {
    constructor() {
        this.maxFileSize = 500000; // 500KB limit for memory protection
        this.chunkSize = 10000; // Process in 10KB chunks
    }

    /**
     * 🏥 ตรวจสอบสุขภาพโค้ดก่อนการวิเคราะห์
     */
    performCodeHealthCheck(code) {
        const issues = [];
        
        // Check file size
        if (code.length > this.maxFileSize) {
            issues.push({
                type: 'LARGE_FILE',
                message: `File too large: ${code.length} bytes (max: ${this.maxFileSize})`,
                severity: 'WARNING'
            });
        }
        
        // Check for basic syntax issues
        const braceBalance = this.checkBraceBalance(code);
        if (braceBalance !== 0) {
            issues.push({
                type: 'SYNTAX_ERROR',
                message: `Unbalanced braces: ${braceBalance}`,
                severity: 'ERROR'
            });
        }
        
        return {
            healthy: issues.filter(i => i.severity === 'ERROR').length === 0,
            issues
        };
    }

    checkBraceBalance(code) {
        let balance = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const prev = i > 0 ? code[i - 1] : '';
            
            // Handle string boundaries
            if ((char === '"' || char === "'" || char === '`') && prev !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
                continue;
            }
            
            if (inString) continue;
            
            if (char === '{') balance++;
            if (char === '}') balance--;
        }
        
        return balance;
    }

    /**
     * 📊 วิเคราะห์เจตนาของโค้ด (Intent Analysis)
     */
    analyzeIntent(tokens) {
        const intents = {
            security: 0,
            businessLogic: 0,
            algorithm: 0,
            dataManagement: 0,
            apiIntegration: 0
        };

        const securityKeywords = ['password', 'token', 'auth', 'login', 'secret', 'key', 'encrypt', 'decrypt'];
        const businessKeywords = ['calculate', 'process', 'validate', 'format', 'transform'];
        const algorithmKeywords = ['sort', 'search', 'optimize', 'iterate', 'recursive'];
        const dataKeywords = ['database', 'query', 'insert', 'update', 'delete', 'select'];
        const apiKeywords = ['http', 'request', 'response', 'api', 'fetch', 'axios'];

        tokens.forEach(token => {
            if (token.type === 'IDENTIFIER' || token.type === 'STRING') {
                const value = token.value.toLowerCase();
                
                if (securityKeywords.some(kw => value.includes(kw))) intents.security++;
                if (businessKeywords.some(kw => value.includes(kw))) intents.businessLogic++;
                if (algorithmKeywords.some(kw => value.includes(kw))) intents.algorithm++;
                if (dataKeywords.some(kw => value.includes(kw))) intents.dataManagement++;
                if (apiKeywords.some(kw => value.includes(kw))) intents.apiIntegration++;
            }
        });

        return intents;
    }

    /**
     * 🔧 แบ่งไฟล์ใหญ่เป็น Chunks เพื่อประมวลผล
     */
    processLargeFileInChunks(code) {
        if (code.length <= this.chunkSize) {
            return [code];
        }

        const chunks = [];
        let currentPos = 0;

        while (currentPos < code.length) {
            let chunkEnd = currentPos + this.chunkSize;
            
            // Find a good breaking point (end of line)
            if (chunkEnd < code.length) {
                while (chunkEnd > currentPos && code[chunkEnd] !== '\n') {
                    chunkEnd--;
                }
                if (chunkEnd === currentPos) {
                    // No line break found, use original chunk size
                    chunkEnd = Math.min(currentPos + this.chunkSize, code.length);
                }
            } else {
                chunkEnd = code.length;
            }

            chunks.push(code.slice(currentPos, chunkEnd));
            currentPos = chunkEnd;
        }

        return chunks;
    }
}

/**
 * 🚀 Smart Parser Engine Main Class
 */
class SmartParserEngine {
    constructor() {
        this.tokenizer = new JavaScriptTokenizer();
        this.analyzer = new SmartFileAnalyzer();
    }

    /**
     * 🧠 วิเคราะห์โค้ดด้วย Smart Engine
     */
    analyzeCode(code) {
        console.log('🚀 Smart Parser Engine: Starting analysis...');
        
        // 1. ตรวจสอบสุขภาพโค้ด
        const healthCheck = this.analyzer.performCodeHealthCheck(code);
        if (!healthCheck.healthy) {
            console.warn('⚠️ Code health issues detected:', healthCheck.issues);
            return { violations: [], warnings: healthCheck.issues };
        }

        // 2. แบ่งไฟล์ใหญ่เป็น chunks
        const chunks = this.analyzer.processLargeFileInChunks(code);
        console.log(`📊 Processing ${chunks.length} chunks...`);

        let allViolations = [];
        
        // 3. ประมวลผลแต่ละ chunk
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(`🔍 Analyzing chunk ${i + 1}/${chunks.length}...`);
            
            const tokens = this.tokenizer.tokenize(chunk);
            const structureParser = new StructureParser(tokens);
            const structures = structureParser.parse();
            
            // 4. ตรวจจับการละเมิดแต่ละกฎ
            const chunkViolations = this.detectViolations(tokens, structures, chunk);
            allViolations.push(...chunkViolations);
        }

        console.log(`✅ Smart Parser Engine: Found ${allViolations.length} violations`);
        return allViolations;
    }

    /**
     * 🎯 ตรวจจับการละเมิดกฎทั้งหมด
     */
    detectViolations(tokens, structures, code) {
        const violations = [];
        
        // NO_EMOJI Detection - ตรวจทุก STRING และ COMMENT token
        violations.push(...this.detectEmojiViolations(tokens));
        
        // NO_HARDCODE Detection - ตรวจ STRING และ NUMBER token
        violations.push(...this.detectHardcodeViolations(tokens));
        
        // NO_SILENT_FALLBACKS Detection - ใช้ structure analysis
        violations.push(...this.detectSilentFallbackViolations(structures, tokens));
        
        // NO_INTERNAL_CACHING Detection - ตรวจ pattern การ caching
        violations.push(...this.detectCachingViolations(tokens));
        
        // NO_MOCKING Detection - ตรวจ mocking patterns
        violations.push(...this.detectMockingViolations(tokens));
        
        return violations;
    }

    /**
     * 😀 ตรวจจับ Emoji ใน STRING และ COMMENT tokens
     */
    detectEmojiViolations(tokens) {
        const violations = [];
        const emojiRules = ABSOLUTE_RULES.NO_EMOJI.patterns;
        
        tokens.forEach(token => {
            if (token.type === 'STRING' || token.type === 'COMMENT') {
                emojiRules.forEach(rule => {
                    const regex = new RegExp(rule.regex.source, 'gu');
                    let match;
                    while ((match = regex.exec(token.value)) !== null) {
                        violations.push({
                            ruleId: 'NO_EMOJI',
                            severity: 'ERROR',
                            message: `Emoji "${match[0]}" found in ${token.type.toLowerCase()}`,
                            location: token.location,
                            emoji: match[0]
                        });
                    }
                });
            }
        });
        
        return violations;
    }

    /**
     * 🔑 ตรวจจับ Hardcode values
     */
    detectHardcodeViolations(tokens) {
        const violations = [];
        const hardcodeRules = ABSOLUTE_RULES.NO_HARDCODE.patterns;
        
        tokens.forEach(token => {
            if (token.type === 'STRING' || token.type === 'NUMBER') {
                hardcodeRules.forEach(rule => {
                    const regex = new RegExp(rule.regex.source, 'i');
                    if (regex.test(token.value)) {
                        violations.push({
                            ruleId: 'NO_HARDCODE',
                            severity: 'WARNING',
                            message: `Hardcoded value detected: ${token.value}`,
                            location: token.location,
                            match: token.value
                        });
                    }
                });
            }
        });
        
        return violations;
    }

    /**
     * 🤫 ตรวจจับ Silent Fallbacks
     */
    detectSilentFallbackViolations(structures, tokens) {
        const violations = [];
        
        // ตรวจ async functions ที่ไม่มี try-catch
        structures.asyncFunctions.forEach(func => {
            if (func.hasAwait && !func.hasTryCatch) {
                violations.push({
                    ruleId: 'NO_SILENT_FALLBACKS',
                    severity: 'ERROR',
                    message: `Async function "${func.name}" has await but no try-catch`,
                    location: func.location
                });
            }
        });
        
        return violations;
    }

    /**
     * 💾 ตรวจจับ Internal Caching
     */
    detectCachingViolations(tokens) {
        const violations = [];
        const cachingKeywords = ['cache', 'memoize', 'useMemo', 'localStorage', 'sessionStorage'];
        
        tokens.forEach(token => {
            if (token.type === 'IDENTIFIER') {
                cachingKeywords.forEach(keyword => {
                    if (token.value.toLowerCase().includes(keyword.toLowerCase())) {
                        violations.push({
                            ruleId: 'NO_INTERNAL_CACHING',
                            severity: 'WARNING',
                            message: `Internal caching detected: ${token.value}`,
                            location: token.location
                        });
                    }
                });
            }
        });
        
        return violations;
    }

    /**
     * 🎭 ตรวจจับ Mocking patterns
     */
    detectMockingViolations(tokens) {
        const violations = [];
        const mockingKeywords = ['mock', 'spy', 'jest.mock', 'sinon', 'stub'];
        
        tokens.forEach((token, index) => {
            if (token.type === 'IDENTIFIER') {
                mockingKeywords.forEach(keyword => {
                    if (token.value.includes(keyword)) {
                        violations.push({
                            ruleId: 'NO_MOCKING',
                            severity: 'ERROR',
                            message: `Mocking detected: ${token.value}`,
                            location: token.location
                        });
                    }
                });
            }
        });
        
        return violations;
    }
}

module.exports = { SmartParserEngine };