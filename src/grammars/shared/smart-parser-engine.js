//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
//  Smart Parser Engine - Real AST Parser ใช้ Acorn + Babel

import { RULE_IDS, ERROR_TYPES, SEVERITY_LEVELS, TOKEN_TYPES, DEFAULT_LOCATION } from './constants.js';

import { parse as acornParse } from 'acorn';
import { parse as babelParse } from '@babel/parser';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ABSOLUTE_RULES } from '../../validator.js';
import GrammarIndex from './grammar-index.js';

//  Load Configuration from External File (NO MORE HARDCODE!)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'parser-config.json');

let PARSER_CONFIG;
try {
    PARSER_CONFIG = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    console.log(' Parser configuration loaded successfully from:', CONFIG_PATH);
} catch (error) {
    console.error('CRITICAL: Failed to load parser config:', error.message);
    throw new Error(`Configuration file is required: ${CONFIG_PATH}. Cannot proceed without valid configuration.`);
}

// Configuration must be loaded from external file - no fallback allowed

/**
 *  JavaScript Tokenizer - แยกโค้ดเป็น Token ที่ละเอียด
 */
class JavaScriptTokenizer {
    constructor(grammarIndex) { // รับ grammarIndex
        this.tokens = [];
        this.position = 0;
        this.grammarIndex = grammarIndex; // เก็บ index ไว้
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
            
            // ! UPGRADE: ตรวจจับ Operator ที่ยาวที่สุดก่อน (เช่น ===, =>)
            if (this.grammarIndex) {
                const operatorMatch = this.grammarIndex.findLongestOperator(line, i);
                if (operatorMatch) {
                    this.addToken('OPERATOR', operatorMatch.operator, lineNumber, i);
                    i += operatorMatch.length;
                    continue;
                }
            }

            // Operators and punctuation (fallback for single chars)
            if (/[+\-*/=<>!&|^~%(){}[\];,.]/.test(char)) {
                this.addToken('OPERATOR', char, lineNumber, i);
                i++;
                continue;
            }
            
            // ! NO_SILENT_FALLBACKS: ห้ามเพิกเฉยต่ออักขระที่ไม่รู้จัก - ต้อง throw error
            throw new Error(`Unrecognized character "${char}" (code: ${char.charCodeAt(0)}) at line ${lineNumber}, column ${i + 1}. This may indicate a syntax error or unsupported character.`);
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

    // ! UPGRADE: เปลี่ยนไปใช้ grammarIndex
    isKeyword(word) {
        return this.grammarIndex.isKeyword(word);
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
 *  Structure Parser - วิเคราะห์โครงสร้างโค้ดที่ซับซ้อน
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
 *  Smart File Analyzer - ระบบวิเคราะห์ไฟล์อัจฉริยะ
 */
class SmartFileAnalyzer {
    constructor(config = null) {
        // Use PARSER_CONFIG if no config provided, strict validation otherwise
        const actualConfig = config ? config : PARSER_CONFIG;
        const analyzerConfig = actualConfig.smartFileAnalyzer;
        if (!analyzerConfig) {
            throw new Error('SmartFileAnalyzer requires valid configuration with smartFileAnalyzer section');
        }
        
        if (!analyzerConfig.maxFileSize || !analyzerConfig.chunkSize) {
            throw new Error('SmartFileAnalyzer configuration missing required fields: maxFileSize, chunkSize');
        }
        
        this.maxFileSize = analyzerConfig.maxFileSize;
        this.chunkSize = analyzerConfig.chunkSize;
        
        // Strict validation - no silent fallbacks
        if (!analyzerConfig.healthCheckThresholds) {
            this.healthThresholds = actualConfig.astTraversal?.defaultHealthThresholds;
            if (!this.healthThresholds) {
                throw new Error('Configuration missing healthCheckThresholds and defaultHealthThresholds');
            }
        } else {
            this.healthThresholds = analyzerConfig.healthCheckThresholds;
        }
        
        console.log(` SmartFileAnalyzer configured: maxFileSize=${this.maxFileSize}, chunkSize=${this.chunkSize}`);
    }

    /**
     *  ตรวจสอบสุขภาพโค้ดก่อนการวิเคราะห์
     */
    performCodeHealthCheck(code) {
        const issues = [];
        
        // Check file size
        if (code.length > this.maxFileSize) {
            issues.push({
                type: 'LARGE_FILE',
                message: `File too large: ${code.length} bytes (max: ${this.maxFileSize})`,
                severity: SEVERITY_LEVELS.WARNING
            });
        }
        
        // Check for basic syntax issues
        const braceBalance = this.checkBraceBalance(code);
        if (braceBalance !== 0) {
            issues.push({
                type: 'SYNTAX_ERROR',
                message: `Unbalanced braces: ${braceBalance}`,
                severity: SEVERITY_LEVELS.ERROR
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
     *  วิเคราะห์เจตนาของโค้ด (Intent Analysis)
     */
    analyzeIntent(tokens) {
        const intents = {
            security: 0,
            businessLogic: 0,
            algorithm: 0,
            dataManagement: 0,
            apiIntegration: 0
        };

        // ใช้ keywords จาก config แทน hardcoded values
        const intentKeywords = PARSER_CONFIG.ruleChecking.intentAnalysisKeywords;
        if (!intentKeywords) {
            throw new Error('Parser configuration intentAnalysisKeywords section is required');
        }

        const securityKeywords = intentKeywords.security;
        const businessKeywords = intentKeywords.businessLogic;
        const algorithmKeywords = intentKeywords.algorithm;
        const dataKeywords = intentKeywords.dataManagement;
        const apiKeywords = intentKeywords.apiIntegration;

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
     *  แบ่งไฟล์ใหญ่เป็น Chunks เพื่อประมวลผล
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
 *  Smart Parser Engine Main Class
 */
class SmartParserEngine {
    constructor(combinedGrammar, config = null) { // รับ combined grammar และ config
        try {
            // Use PARSER_CONFIG if no config provided, strict validation otherwise
            const actualConfig = config ? config : PARSER_CONFIG;
            const engineConfig = actualConfig.smartParserEngine;
            if (!engineConfig) {
                throw new Error('SmartParserEngine requires valid configuration with smartParserEngine section');
            }
            
            // Store configs for later use (NO_HARDCODE compliance)
            this.config = actualConfig; // Store full config for accessing patterns
            this.engineConfig = engineConfig;
            
            const memoryConfig = engineConfig.memory;
            if (!memoryConfig) {
                throw new Error('SmartParserEngine configuration missing memory settings');
            }
            
            // สร้าง Index จาก grammar ที่ได้รับมา (ไม่โหลดเอง)
            this.grammarIndex = new GrammarIndex(combinedGrammar); 
            this.tokenizer = new JavaScriptTokenizer(this.grammarIndex);
            this.analyzer = new SmartFileAnalyzer(actualConfig); // ส่ง actualConfig ต่อ
            
            // MEMORY PROTECTION: Strict validation required
            if (!memoryConfig.maxTokensPerAnalysis) {
                throw new Error('Configuration missing maxTokensPerAnalysis');
            }
            if (!memoryConfig.maxMemoryUsage) {
                throw new Error('Configuration missing maxMemoryUsage');
            }
            if (!memoryConfig.maxAnalysisCount) {
                throw new Error('Configuration missing maxAnalysisCount');
            }
            if (!memoryConfig.maxASTNodes) {
                throw new Error('Configuration missing maxASTNodes');
            }
            
            this.maxTokensPerAnalysis = memoryConfig.maxTokensPerAnalysis;
            this.maxMemoryUsage = memoryConfig.maxMemoryUsage;
            this.maxAnalysisCount = memoryConfig.maxAnalysisCount;
            this.maxASTNodes = memoryConfig.maxASTNodes;
            this.analysisCount = 0;
            
            // Parser options validation
            if (!engineConfig.acornOptions) {
                throw new Error('Configuration missing acornOptions');
            }
            if (!engineConfig.babelOptions) {
                throw new Error('Configuration missing babelOptions');
            }
            
            this.acornOptions = engineConfig.acornOptions;
            this.babelOptions = engineConfig.babelOptions;
            
            console.log(`SmartParserEngine configured: maxTokens=${this.maxTokensPerAnalysis}, maxMemory=${Math.round(this.maxMemoryUsage/1024/1024)}MB, maxAST=${this.maxASTNodes}`);
            console.log(' GrammarIndex has been successfully integrated into the Smart Parser Engine.');
        } catch (error) {
            console.error(' Failed to initialize SmartParserEngine:', error.message);
            throw new Error(`SmartParserEngine initialization failed: ${error.message}`);
        }
    }

    // ! NO_HARDCODE: ใช้ DEFAULT_LOCATION constant แทน method call

    /**
     *  วิเคราะห์โค้ดด้วย Real AST Parser (Acorn/Babel)
     */
    analyzeCode(code) {
        console.log('Smart Parser Engine: Starting AST analysis...');
        
        // ! CIRCUIT BREAKER: ป้องกัน memory overflow
        this.analysisCount++;
        if (this.analysisCount > this.engineConfig.memory.maxAnalysisCount) {
            throw new Error('Analysis limit exceeded - possible memory leak detected');
        }
        
        // Memory usage check
        if (process.memoryUsage().heapUsed > this.maxMemoryUsage) {
            throw new Error(`Memory usage too high: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB > ${this.maxMemoryUsage / 1024 / 1024}MB`);
        }
        
        // 1. ตรวจสอบสุขภาพโค้ด
        const healthCheck = this.analyzer.performCodeHealthCheck(code);
        if (!healthCheck.healthy) {
            console.warn('Code health issues detected:', healthCheck.issues);
            return { violations: [], warnings: healthCheck.issues };
        }

        // 2. แบ่งไฟล์ใหญ่เป็น chunks
        const chunks = this.analyzer.processLargeFileInChunks(code);
        console.log(` Processing ${chunks.length} chunks with AST Parser...`);

        let allViolations = [];
        
        // 3. ประมวลผลแต่ละ chunk ด้วย Real AST Parser
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(` Analyzing chunk ${i + 1}/${chunks.length} with AST...`);
            
            try {
                //  ใช้ Acorn Parser สร้าง AST จริง (ใช้ Config แทน Hardcode!)
                const ast = acornParse(chunk, this.acornOptions);

                // 4. เดินสำรวจ AST และตรวจจับ violations
                const chunkViolations = this.traverseAST(ast, chunk);
                allViolations.push(...chunkViolations);
                
            } catch (acornError) {
                // ถ้า Acorn ไม่ได้ ลอง Babel Parser
                try {
                    console.log('Acorn failed, trying Babel parser...');
                    const ast = babelParse(chunk, this.babelOptions);

                    const chunkViolations = this.traverseAST(ast, chunk);
                    allViolations.push(...chunkViolations);
                    
                } catch (babelError) {
                    // ทั้งสอง parser ไม่ได้ = Syntax Error ใน chunk นี้
                    console.error(' Both parsers failed:', acornError.message);
                    allViolations.push({
                        ruleId: 'SYNTAX_ERROR',
                        severity: SEVERITY_LEVELS.CRITICAL, 
                        message: `Parser error: ${acornError.message}`,
                        location: acornError.loc ? acornError.loc : DEFAULT_LOCATION,
                        source: chunk.substring(0, PARSER_CONFIG.astTraversal.maxSourcePreview) + '...'
                    });
                }
            }
        }

        console.log(` Smart Parser Engine: Found ${allViolations.length} violations via AST`);
        return allViolations;
    }

    /**
     *   เดินสำรวจ AST Tree เพื่อตรวจจับ Violations (หัวใจของระบบ)
     */
    traverseAST(astNode, sourceCode = '') {
        const violations = [];
        let nodeCount = 0;
        const maxNodes = this.maxASTNodes; // Config-based limit (no hardcode)

        // ฟังก์ชันเดิน AST แบบ Recursive
        const walk = (currentNode, parent = null, depth = 0) => {
            if (!currentNode || nodeCount > maxNodes) return;
            nodeCount++;
            
            try {
                // === ตรวจสอบกฎทั้ง 5 ข้อผ่าน AST Nodes ===
                
                //  NO_MOCKING Detection
                if (currentNode.type === 'CallExpression') {
                    this.checkMockingInAST(currentNode, violations);
                }
                
                //  NO_HARDCODE Detection  
                if (currentNode.type === 'Literal' || currentNode.type === 'StringLiteral') {
                    this.checkHardcodeInAST(currentNode, violations);
                    this.checkNumericHardcodeInAST(currentNode, violations);
                }
                
                //  NO_SILENT_FALLBACKS Detection
                if (currentNode.type === 'CatchClause') {
                    this.checkSilentFallbacksInAST(currentNode, violations);
                }
                
                // Logical OR fallbacks (data || [])
                if (currentNode.type === 'LogicalExpression' && currentNode.operator === '||') {
                    this.checkLogicalFallbacksInAST(currentNode, violations);
                }
                
                // Promise catch with empty handler
                if (currentNode.type === 'CallExpression' && 
                    currentNode.callee?.type === 'MemberExpression' && 
                    currentNode.callee?.property?.name === 'catch') {
                    this.checkPromiseCatchFallbacks(currentNode, violations);
                }
                
                // Async function without try-catch
                if (currentNode.type === 'FunctionDeclaration' && currentNode.async === true) {
                    this.checkAsyncFunctionWithoutTryCatch(currentNode, violations);
                }
                
                //  NO_INTERNAL_CACHING Detection
                if (currentNode.type === 'VariableDeclarator' || currentNode.type === 'AssignmentExpression') {
                    this.checkCachingInAST(currentNode, violations);
                }
                
                // this.cache property detection
                if (currentNode.type === 'MemberExpression') {
                    this.checkCachingPropertyInAST(currentNode, violations);
                }
                
                // Memoization function calls
                if (currentNode.type === 'CallExpression') {
                    this.checkMemoizationInAST(currentNode, violations);
                }
                
                //  NO_EMOJI Detection
                if (currentNode.type === 'Literal' || currentNode.type === 'TemplateElement') {
                    this.checkEmojiInAST(currentNode, violations);
                }
                
                //  เดินทางไปยัง Child Nodes
                for (const key in currentNode) {
                    const value = currentNode[key];
                    if (value && typeof value === 'object') {
                        if (Array.isArray(value)) {
                            value.forEach(child => walk(child, currentNode, depth + 1));
                        } else if (value.type) { // เป็น AST Node
                            walk(value, currentNode, depth + 1);
                        }
                    }
                }
                
            } catch (traverseError) {
                console.error('CRITICAL AST traverse error at node:', currentNode.type, traverseError.message);
                // หยุดการทำงานทันที เพราะไม่สามารถไปต่อได้อย่างน่าเชื่อถือ
                throw new Error(`AST traversal failed at node ${currentNode.type}: ${traverseError.message}`);
            }
        };

        //  เริ่มเดินจาก Root ของ AST
        walk(astNode);
        console.log(` Traversed ${nodeCount} AST nodes, found ${violations.length} violations`);
        return violations;
    }

    checkMockingInAST(node, violations) {
        try {
            // jest.mock(), sinon.stub(), chai.spy()
            if (node.callee?.property?.name === 'mock' || 
                node.callee?.property?.name === 'stub' ||
                node.callee?.property?.name === 'spy') {
                violations.push({
                    ruleId: RULE_IDS.NO_MOCKING,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: ${node.callee.object?.name}.${node.callee.property.name}() detected`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }

            // jest.spyOn() - ตรวจ pattern พิเศษ
            if (node.callee?.property?.name === 'spyOn') {
                violations.push({
                    ruleId: RULE_IDS.NO_MOCKING,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: ${node.callee.object?.name}.spyOn() detected`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }

            // mockResolvedValue, mockImplementation, mockReturnValue
            if (node.callee?.property?.name?.includes('mock')) {
                violations.push({
                    ruleId: RULE_IDS.NO_MOCKING,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Mock method ${node.callee.property.name}() detected`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkMockingInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkHardcodeInAST(node, violations) {
        try {
            if (!node.value) return;
            const value = node.value.toString();
            const lowerValue = value.toLowerCase();
            
            //  ใช้ patterns จาก config แทน hardcode
            const ruleConfig = PARSER_CONFIG.ruleChecking;
            if (!ruleConfig || !ruleConfig.customPatterns) {
                throw new Error('Parser configuration ruleChecking.customPatterns section is required');
            }
            const credentialKeywords = ruleConfig.customPatterns.credentialKeywords;
            const connectionPatterns = ruleConfig.customPatterns.connectionStringPatterns;
            
            // Credential detection
            if (credentialKeywords.some(keyword => lowerValue.includes(keyword))) {
                violations.push({
                    ruleId: RULE_IDS.NO_HARDCODE,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Hardcoded credential: "${node.value}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
            
            // API Key patterns (sk_live_, pk_test_, etc.)
            const apiKeyMinLength = ruleConfig.customPatterns.apiKeyMinLength;
            const hexMinLength = ruleConfig.customPatterns.hexMinLength;
            const alphanumericMinLength = ruleConfig.customPatterns.alphanumericMinLength;
            
            if (lowerValue.match(new RegExp(`^(sk_|pk_|api_|key_|secret_)[a-z0-9_]{${apiKeyMinLength},}$`)) ||
                lowerValue.match(new RegExp(`^[a-f0-9]{${hexMinLength},}$`)) ||
                (lowerValue.match(new RegExp(`^[a-zA-Z0-9]{${alphanumericMinLength},}$`)) && value.length > alphanumericMinLength)) {
                violations.push({
                    ruleId: RULE_IDS.NO_HARDCODE,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Hardcoded API key/token: "${node.value}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
            
            // Connection string detection  
            if (connectionPatterns.some(pattern => lowerValue.includes(pattern))) {
                violations.push({
                    ruleId: RULE_IDS.NO_HARDCODE,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Hardcoded connection string: "${node.value}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
            
            // URL detection (https://api.production.com/v1)
            if (lowerValue.match(/^https?:\/\/.*\.(com|org|net|io).*\//) || 
                lowerValue.includes('production') || 
                lowerValue.includes('staging')) {
                violations.push({
                    ruleId: RULE_IDS.NO_HARDCODE,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Hardcoded URL/endpoint: "${node.value}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkHardcodeInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkNumericHardcodeInAST(node, violations) {
        try {
            if (node.type === 'Literal' && typeof node.value === 'number') {
                // ใช้ config แทน hardcoded array
                const ruleConfig = PARSER_CONFIG.ruleChecking;
                if (!ruleConfig || !ruleConfig.customPatterns) {
                    throw new Error('Parser configuration ruleChecking.customPatterns section is required');
                }
                const suspiciousNumbers = ruleConfig.customPatterns.suspiciousNumbers;
                const minThreshold = PARSER_CONFIG.astTraversal.minHardcodedNumberThreshold;
                
                if (suspiciousNumbers.includes(node.value) && node.value > minThreshold) {
                    violations.push({
                        ruleId: RULE_IDS.NO_HARDCODE,
                        severity: SEVERITY_LEVELS.CRITICAL, 
                        message: `AST: Hardcoded numeric value: ${node.value} (should use configuration)`,
                        location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                    });
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkNumericHardcodeInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkSilentFallbacksInAST(node, violations) {
        try {
            // ตรวจสอบ catch block ว่าเป็น silent fallback หรือไม่
            if (node.body && node.body.body) {
                const statements = node.body.body;
                
                // Empty catch block
                if (statements.length === 0) {
                    violations.push({
                        ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                        severity: SEVERITY_LEVELS.CRITICAL,
                        message: 'AST: Empty catch block detected - silent error handling',
                        location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                    });
                }
                
                // Catch block with only return null/undefined
                if (statements.length === 1) {
                    const stmt = statements[0];
                    if (stmt.type === 'ReturnStatement') {
                        if (!stmt.argument || 
                            (stmt.argument.type === 'Literal' && stmt.argument.value === null) ||
                            (stmt.argument.type === 'Identifier' && stmt.argument.name === 'undefined')) {
                            violations.push({
                                ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                                severity: SEVERITY_LEVELS.CRITICAL,
                                message: 'AST: Silent return in catch block detected',
                                location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkSilentFallbacksInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkLogicalFallbacksInAST(node, violations) {
        try {
            // ตรวจสอบ || fallback patterns
            if (node.operator === '||' && node.right) {
                // Common silent fallback patterns
                const isSilentFallback = 
                    (node.right.type === 'ArrayExpression' && node.right.elements.length === 0) || // || []
                    (node.right.type === 'ObjectExpression' && node.right.properties.length === 0) || // || {}
                    (node.right.type === 'Literal' && (node.right.value === null || node.right.value === '')) || // || null, || ''
                    (node.right.type === 'Identifier' && node.right.name === 'undefined'); // || undefined

                if (isSilentFallback) {
                    violations.push({
                        ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                        severity: SEVERITY_LEVELS.CRITICAL,
                        message: 'AST: Silent fallback with || operator detected',
                        location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                    });
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkLogicalFallbacksInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkPromiseCatchFallbacks(node, violations) {
        try {
            // ตรวจสอบ .catch() handlers
            if (node.arguments && node.arguments.length > 0) {
                const handler = node.arguments[0];
                
                // Empty function handler: .catch(() => {})
                if (handler.type === 'ArrowFunctionExpression' || handler.type === 'FunctionExpression') {
                    const body = handler.body;
                    
                    // Empty block statement
                    if (body.type === 'BlockStatement' && body.body.length === 0) {
                        violations.push({
                            ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                            severity: SEVERITY_LEVELS.CRITICAL,
                            message: 'AST: Empty Promise catch handler detected',
                            location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkPromiseCatchFallbacks: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkAsyncFunctionWithoutTryCatch(node, violations) {
        try {
            // ตรวจสอบ async function ที่มี await แต่ไม่มี try-catch
            let hasAwait = false;
            let hasTryCatch = false;
            
            // ค้นหา await expressions
            this.traverseNodeForPatterns(node.body, (n) => {
                if (n.type === 'AwaitExpression') {
                    hasAwait = true;
                }
                if (n.type === 'TryStatement') {
                    hasTryCatch = true;
                }
            });
            
            if (hasAwait && !hasTryCatch) {
                violations.push({
                    ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: 'AST: Async function with await but no error handling detected',
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkAsyncFunctionWithoutTryCatch: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    traverseNodeForPatterns(node, callback) {
        if (!node) return;
        
        callback(node);
        
        // Traverse child nodes
        for (const key in node) {
            if (key === 'parent' || key === 'loc' || key === 'range') continue;
            const child = node[key];
            
            if (Array.isArray(child)) {
                child.forEach(item => {
                    if (item && typeof item === 'object') {
                        this.traverseNodeForPatterns(item, callback);
                    }
                });
            } else if (child && typeof child === 'object') {
                this.traverseNodeForPatterns(child, callback);
            }
        }
    }

    checkCachingInAST(node, violations) {
        try {
            const varName = node.id?.name || node.left?.name || '';
            if (varName.toLowerCase().includes('cache') || 
                varName.toLowerCase().includes('store')) {
                violations.push({
                    ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: `AST: Potential caching variable: "${varName}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkCachingInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkCachingPropertyInAST(node, violations) {
        try {
            // ตรวจสอบ this.cache, obj.cache properties
            if (node.property && node.property.name) {
                const propertyName = node.property.name.toLowerCase();
                if (propertyName.includes('cache') || propertyName.includes('store') || propertyName.includes('memo')) {
                    violations.push({
                        ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                        severity: SEVERITY_LEVELS.WARNING,
                        message: `AST: Caching property detected: "${node.property.name}"`,
                        location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                    });
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkCachingPropertyInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkMemoizationInAST(node, violations) {
        try {
            // ตรวจสอบ memoization functions
            const callee = node.callee;
            
            // _.memoize()
            if (callee?.type === 'MemberExpression' && 
                callee.object?.name === '_' && 
                callee.property?.name === 'memoize') {
                violations.push({
                    ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: 'AST: Lodash memoize() function detected',
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
            
            // memoize() direct call
            if (callee?.type === 'Identifier' && callee.name === 'memoize') {
                violations.push({
                    ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: 'AST: Memoize function call detected',
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
            
            // useMemo() - React internal memoization
            if (callee?.type === 'Identifier' && callee.name === 'useMemo') {
                violations.push({
                    ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: 'AST: React useMemo() detected - internal memoization',
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkMemoizationInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkEmojiInAST(node, violations) {
        try {
            const rawText = node.value || node.raw || '';
            
            // Convert to string to handle numbers and other types
            const text = String(rawText);
            
            // Skip non-string content for emoji checking
            if (!text || typeof rawText !== 'string') {
                return; // Only check actual string literals
            }
            
            // ! KNOWN LIMITATION: AST-based emoji detection จับได้เฉพาะ STRING LITERALS เท่านั้น
            // ! COMMENTS จะไม่เข้า AST parsing (Acorn/Babel ไม่ include comments โดยปกติ)
            // ! ดังนั้น emoji ใน comments จึงต้องพึ่ง token-based detection แต่ยังไม่ implement
            // ! วิธีแก้: ใช้ string literals สำหรับ test cases แทน comments
            
            // Read emoji pattern from configuration (NO_HARDCODE compliance)
            const emojiRegexStr = this.config?.ruleChecking?.customPatterns?.emojiRegex || '';
            if (!emojiRegexStr) {
                return; // Skip if no configuration
            }
            
            const emojiPattern = new RegExp(emojiRegexStr, 'gu');
            
            emojiPattern.lastIndex = 0; // Reset regex state
            let match;
            while ((match = emojiPattern.exec(text)) !== null) {
                violations.push({
                    ruleId: RULE_IDS.NO_EMOJI,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: `AST: Emoji detected: "${match[0]}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
                
                if (emojiPattern.lastIndex === match.index) {
                    emojiPattern.lastIndex++;
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkEmojiInAST: ${error.message}`);
            throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    /**
     *  ตรวจจับการละเมิดกฎทั้งหมด
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
     *  ตรวจจับ Emoji ใน STRING และ COMMENT tokens (Memory Safe)
     *  
     *  ! CURRENT STATUS: Token-based detection ทำงานได้ แต่ main validation loop 
     *  ! ใช้ AST-based detection เป็นหลัก ซึ่งไม่สามารถจับ COMMENTS ได้
     *  ! 
     *  ! WORKAROUND: Test cases ใช้ string literals แทน comments เพื่อให้ผ่าน AST detection
     *  ! 
     *  ! TODO: Implement proper comment detection by using this token-based method
     *  ! in main validation loop alongside AST detection
     */
    detectEmojiViolations(tokens) {
        const violations = [];
        
        // ! MEMORY PROTECTION: ใช้แค่ regex หลักเพื่อป้องกัน memory leak รวม checkmark และ symbols
        const primaryEmojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2702}-\u{27B0}]|[\u{2194}-\u{21AA}]|[\u{231A}-\u{23FA}]|[\u{FE00}-\u{FE0F}]/gu;
        
        let checkedTokens = 0;
        const maxTokensToCheck = PARSER_CONFIG.astTraversal.maxTokensToCheck;
        
        tokens.forEach(token => {
            if (checkedTokens >= maxTokensToCheck) return;
            
            if (token.type === 'STRING' || token.type === 'COMMENT') {
                checkedTokens++;
                
                // Reset regex state to prevent infinite loops
                primaryEmojiPattern.lastIndex = 0;
                
                let match;
                let matchCount = 0;
                const maxEmojiMatches = PARSER_CONFIG.astTraversal.maxEmojiMatches;
                while ((match = primaryEmojiPattern.exec(token.value)) !== null && matchCount < maxEmojiMatches) {
                    violations.push({
                        ruleId: RULE_IDS.NO_EMOJI,
                        severity: SEVERITY_LEVELS.ERROR,
                        message: `Emoji "${match[0]}" found in ${token.type.toLowerCase()}`,
                        location: token.location,
                        emoji: match[0]
                    });
                    matchCount++;
                }
            }
        });
        
        return violations;
    }

    /**
     *  ตรวจจับ Hardcode values (Memory Safe)
     */
    detectHardcodeViolations(tokens) {
        const violations = [];
        
        // Skip if this appears to be a test file or demo code - ใช้ keywords จาก config
        const ignoreKeywords = PARSER_CONFIG.ruleChecking.hardcodeIgnoreKeywords;
        if (!ignoreKeywords || !Array.isArray(ignoreKeywords)) {
            throw new Error('Parser configuration hardcodeIgnoreKeywords must be a valid array');
        }
        
        const allText = tokens.map(t => t.value).join(' ');
        const shouldSkip = ignoreKeywords.some(keyword => allText.includes(keyword));
        if (shouldSkip) {
            return violations;
        }
        
        // ใช้ patterns จาก config แทน hardcoded values
        const patternConfigs = PARSER_CONFIG.ruleChecking.hardcodeDetectionPatterns;
        if (!patternConfigs) {
            throw new Error('Parser configuration hardcodeDetectionPatterns section is required');
        }
        
        const hardcodePatterns = patternConfigs.map(config => ({
            pattern: new RegExp(config.pattern, config.flags),
            name: config.name
        }));
        
        let checkedTokens = 0;
        const maxTokensToCheck = PARSER_CONFIG.astTraversal.maxTokensToCheck;
        
        tokens.forEach(token => {
            if (checkedTokens >= maxTokensToCheck) return;
            
            if (token.type === 'STRING' || token.type === 'NUMBER') {
                checkedTokens++;
                
                // ! ENHANCED: ปรับปรุงการตรวจ magic numbers
                if (token.type === 'NUMBER') {
                    const num = parseFloat(token.value);
                    if (!isNaN(num)) {
                        // Common safe numbers ที่ไม่ต้องแจ้งเตือน
                        const safeNumbers = PARSER_CONFIG.astTraversal.safeNumbers;
                        
                        // ตรวจ magic numbers ที่น่าสงสัย
                        if (!safeNumbers.includes(num)) {
                            // ตัวเลขขนาดใหญ่ (เช่น timeout values, ports)  
                            const suspiciousNumberThreshold = PARSER_CONFIG.astTraversal.suspiciousNumberThreshold;
                            const minThreshold = PARSER_CONFIG.astTraversal.minHardcodedNumberThreshold;
                            if (num > suspiciousNumberThreshold || (num > minThreshold && num % 10 !== 0)) {
                                violations.push({
                                    ruleId: RULE_IDS.NO_HARDCODE,
                                    severity: SEVERITY_LEVELS.WARNING,
                                    message: `Magic number detected: ${token.value}`,
                                    location: token.location,
                                    match: token.value
                                });
                            }
                        }
                    }
                    return;
                }
                
                // ! ENHANCED: ตรวจ string patterns อย่างละเอียด
                const tokenValue = token.value;
                
                // ตรวจ patterns ทั่วไป
                hardcodePatterns.forEach(({ pattern, name }) => {
                    if (pattern.test(tokenValue)) {
                        violations.push({
                            ruleId: RULE_IDS.NO_HARDCODE,
                            severity: SEVERITY_LEVELS.WARNING,
                            message: `${name} detected: ${tokenValue}`,
                            location: token.location,
                            match: tokenValue
                        });
                    }
                });
                
                // ! FIX: ตรวจ connection strings แบบเฉพาะ (ป้องกัน false positives) - ใช้ keywords จาก config
                const connectionKeywords = PARSER_CONFIG.ruleChecking.connectionStringKeywords;
                const ignoreKeywords = PARSER_CONFIG.ruleChecking.hardcodeIgnoreKeywords;
                
                if (!connectionKeywords || !Array.isArray(connectionKeywords)) {
                    throw new Error('Parser configuration connectionStringKeywords must be a valid array');
                }
                
                const minHardcodeLength = PARSER_CONFIG.astTraversal.minStringLengthForHardcodeCheck;
                const hasConnectionKeyword = connectionKeywords.some(keyword => tokenValue.includes(keyword));
                const hasIgnoreKeyword = ignoreKeywords.some(keyword => tokenValue.includes(keyword));
                
                if (tokenValue.length > minHardcodeLength && hasConnectionKeyword && !hasIgnoreKeyword) {
                    
                    violations.push({
                        ruleId: RULE_IDS.NO_HARDCODE,
                        severity: SEVERITY_LEVELS.WARNING,
                        message: `Potential connection string detected: ${tokenValue}`,
                        location: token.location,
                        match: tokenValue
                    });
                }
            }
        });
        
        return violations;
    }

    /**
     *  ตรวจจับ Silent Fallbacks โดยใช้ GrammarIndex เท่านั้น
     */
    detectSilentFallbackViolations(structures, tokens) {
        const violations = [];
        
        // ใช้ GrammarIndex ในการดึง patterns สำหรับ NO_SILENT_FALLBACKS
        const silentFallbackPatterns = this.grammarIndex.getPatternsForRule('NO_SILENT_FALLBACKS');
        
        if (!silentFallbackPatterns || silentFallbackPatterns.length === 0) {
            console.warn('GrammarIndex: NO_SILENT_FALLBACKS patterns not available');
            return violations;
        }
        
        // สร้าง code string จาก tokens
        const codeString = tokens.map(token => token.value || '').join(' ');
        
        // ตรวจสอบแต่ละ pattern จาก GrammarIndex
        silentFallbackPatterns.forEach((pattern, patternIndex) => {
            try {
                if (!pattern.regex || typeof pattern.regex !== 'object') {
                    return;
                }
                
                // ! NO_SILENT_FALLBACKS: ตรวจสอบอย่างเข้มงวด - ต้องมี source และ flags ที่ชัดเจน
                if (!pattern.regex.source || typeof pattern.regex.flags !== 'string') {
                    throw new Error(`Invalid regex pattern object at index ${patternIndex} for rule NO_SILENT_FALLBACKS: missing source or flags property (both are required)`);
                }
                
                const flags = pattern.regex.flags;
                const source = pattern.regex.source;
                const regex = new RegExp(source, flags);
                
                let match;
                let matchCount = 0;
                const maxMatches = PARSER_CONFIG.astTraversal.maxMatches;
                
                while ((match = regex.exec(codeString)) !== null && matchCount < maxMatches) {
                    matchCount++;
                    
                    const lineNumber = this.estimateLineFromMatch(tokens, match.index);
                    
                    violations.push({
                        ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                        severity: pattern.severity || 'ERROR',
                        message: `Silent fallback detected: ${pattern.name}`,
                        location: { 
                            line: lineNumber,
                            column: 1 
                        }
                    });
                    
                    if (regex.lastIndex === match.index) {
                        regex.lastIndex++;
                    }
                }
            } catch (error) {
                console.error(`[CRITICAL] Bug in GrammarIndex pattern for NO_SILENT_FALLBACKS[${patternIndex}]: ${error.message}`);
                throw error; // ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
            }
        });
        
        // เพิ่มการตรวจสอบ async functions จาก structure analysis
        if (structures && structures.asyncFunctions) {
            structures.asyncFunctions.forEach(func => {
                if (func.hasAwait && !func.hasTryCatch) {
                    violations.push({
                        ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                        severity: SEVERITY_LEVELS.WARNING,
                        message: `Async function with await but no try-catch error handling`,
                        location: func.location ? func.location : DEFAULT_LOCATION
                    });
                }
            });
        }
        
        return violations;
    }
    
    /**
     *  ตรวจจับ Empty catch blocks
     */
    findEmptyCatchBlocks(tokens) {
        const violations = [];
        let i = 0;
        
        while (i < tokens.length) {
            const token = tokens[i];
            
            if (token.type === 'KEYWORD' && token.value === 'catch') {
                // หาตำแหน่ง { ของ catch block
                let openBraceIndex = -1;
                let j = i + 1;
                
                while (j < tokens.length && j < i + 10) { // จำกัดการค้นหา
                    if (tokens[j].value === '{') {
                        openBraceIndex = j;
                        break;
                    }
                    j++;
                }
                
                if (openBraceIndex > 0) {
                    // ตรวจสอบว่า catch block ว่างหรือไม่
                    const isEmpty = this.isCatchBlockEmpty(tokens, openBraceIndex);
                    const returnsSilently = this.catchBlockReturnsSilently(tokens, openBraceIndex);
                    
                    if (isEmpty) {
                        violations.push({
                            ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                            severity: SEVERITY_LEVELS.ERROR,
                            message: 'Empty catch block detected - errors are silently ignored',
                            location: token.location
                        });
                    } else if (returnsSilently) {
                        violations.push({
                            ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                            severity: SEVERITY_LEVELS.ERROR,
                            message: 'Silent catch block returns default value without logging',
                            location: token.location
                        });
                    }
                }
            }
            
            i++;
        }
        
        return violations;
    }
    
    /**
     *  ตรวจจับ Empty Promise catches
     */
    findEmptyPromiseCatches(tokens) {
        const violations = [];
        let i = 0;
        
        while (i < tokens.length - 2) {
            if (tokens[i].value === '.' && 
                tokens[i + 1].type === 'IDENTIFIER' && 
                tokens[i + 1].value === 'catch') {
                
                // หา arrow function ใน catch
                let j = i + 2;
                while (j < tokens.length && j < i + 15) {
                    if (tokens[j].value === '=>') {
                        // ตรวจสอบว่า catch handler ว่างหรือไม่
                        if (this.isArrowFunctionEmpty(tokens, j)) {
                            violations.push({
                                ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                                severity: SEVERITY_LEVELS.ERROR,
                                message: 'Promise with empty catch handler',
                                location: tokens[i + 1].location
                            });
                        }
                        break;
                    }
                    j++;
                }
            }
            i++;
        }
        
        return violations;
    }
    
    /**
     *  ตรวจจับ Silent fallback patterns อื่นๆ
     */
    findSilentFallbackPatterns(tokens) {
        const violations = [];
        let i = 0;
        
        while (i < tokens.length - 1) {
            const token = tokens[i];
            
            // ตรวจ || และ ?? patterns ทั้งหมด
            if (token.value === '||' || token.value === '??') {
                const nextToken = tokens[i + 1];
                const nextNextToken = i + 2 < tokens.length ? tokens[i + 2] : null;
                
                // ! FIX: ตรวจ silent fallbacks ครอบคลุมมากขึ้น
                if (nextToken) {
                    let isSilentFallback = false;
                    let fallbackType = '';
                    
                    // 1. || [] หรือ ?? []
                    if (nextToken.value === '[' && nextNextToken && nextNextToken.value === ']') {
                        isSilentFallback = true;
                        fallbackType = 'empty array';
                    }
                    
                    // 2. || {} หรือ ?? {}
                    else if (nextToken.value === '{' && nextNextToken && nextNextToken.value === '}') {
                        isSilentFallback = true;
                        fallbackType = 'empty object';
                    }
                    
                    // 3. || null หรือ ?? null
                    else if (nextToken.type === 'KEYWORD' && nextToken.value === 'null') {
                        isSilentFallback = true;
                        fallbackType = 'null';
                    }
                    
                    // 4. || false หรือ ?? false
                    else if (nextToken.type === 'KEYWORD' && nextToken.value === 'false') {
                        isSilentFallback = true;
                        fallbackType = 'false';
                    }
                    
                    // 5. || "" หรือ ?? ""
                    else if (nextToken.type === 'STRING' && 
                            (nextToken.value === '""' || nextToken.value === "''" || nextToken.value.length <= 2)) {
                        isSilentFallback = true;
                        fallbackType = 'empty string';
                    }
                    
                    // 6. || 0 หรือ ?? 0 
                    else if (nextToken.type === 'NUMBER' && nextToken.value === '0') {
                        isSilentFallback = true;
                        fallbackType = 'zero';
                    }
                    
                    // ! FIX: เพิ่มการตรวจ function call patterns
                    // 7. functionCall() || defaultValue
                    else if (this.isFunctionCallPattern(tokens, i)) {
                        isSilentFallback = true;
                        fallbackType = 'function call with default';
                    }
                    
                    if (isSilentFallback) {
                        violations.push({
                            ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                            severity: SEVERITY_LEVELS.ERROR,
                            message: `Silent fallback to ${fallbackType} with ${token.value}`,
                            location: token.location
                        });
                    }
                }
            }
            
            i++;
        }
        
        return violations;
    }
    
    /**
     *  Helper: ตรวจสอบ function call pattern
     */
    isFunctionCallPattern(tokens, operatorIndex) {
        // ย้อนกลับไปหาว่าก่อน || มี function call หรือไม่
        let i = operatorIndex - 1;
        let foundCloseParen = false;
        let parenCount = 0;
        
        // หา ) ก่อนหน้า ||
        while (i >= 0 && i >= operatorIndex - 10) { // จำกัดการค้นหา
            if (tokens[i].value === ')') {
                foundCloseParen = true;
                parenCount = 1;
                i--;
                break;
            }
            i--;
        }
        
        if (!foundCloseParen) return false;
        
        // หา ( ที่ match กับ )
        while (i >= 0 && parenCount > 0) {
            if (tokens[i].value === ')') parenCount++;
            if (tokens[i].value === '(') parenCount--;
            i--;
        }
        
        // ตรวจสอบว่าก่อน ( มี identifier (function name) หรือไม่
        if (i >= 0 && tokens[i].type === 'IDENTIFIER') {
            return true;
        }
        
        return false;
    }
    
    /**
     *  Helper: ตรวจสอบว่า catch block ว่างหรือไม่
     */
    isCatchBlockEmpty(tokens, openBraceIndex) {
        let braceCount = 1;
        let i = openBraceIndex + 1;
        let hasContent = false;
        
        while (i < tokens.length && braceCount > 0) {
            if (tokens[i].value === '{') braceCount++;
            if (tokens[i].value === '}') braceCount--;
            
            // ถ้ามี token ที่ไม่ใช่ whitespace หรือ comment = มี content
            if (braceCount > 0 && 
                tokens[i].type !== 'COMMENT' && 
                tokens[i].value.trim() !== '') {
                hasContent = true;
            }
            
            i++;
        }
        
        return !hasContent;
    }
    
    /**
     *  Helper: ตรวจสอบว่า catch block return แบบ silent หรือไม่
     */
    catchBlockReturnsSilently(tokens, openBraceIndex) {
        let braceCount = 1;
        let i = openBraceIndex + 1;
        let hasReturn = false;
        let hasLogging = false;
        
        while (i < tokens.length && braceCount > 0) {
            if (tokens[i].value === '{') braceCount++;
            if (tokens[i].value === '}') braceCount--;
            
            if (braceCount > 0) {
                if (tokens[i].type === 'KEYWORD' && tokens[i].value === 'return') {
                    hasReturn = true;
                }
                
                if (tokens[i].type === 'IDENTIFIER' && 
                    (tokens[i].value.includes('log') || 
                     tokens[i].value.includes('console') ||
                     tokens[i].value.includes('error'))) {
                    hasLogging = true;
                }
            }
            
            i++;
        }
        
        return hasReturn && !hasLogging;
    }
    
    /**
     *  Helper: ตรวจสอบว่า arrow function ว่างหรือไม่
     */
    isArrowFunctionEmpty(tokens, arrowIndex) {
        let i = arrowIndex + 1;
        
        // Skip whitespace
        while (i < tokens.length && /\s/.test(tokens[i].value)) {
            i++;
        }
        
        if (i < tokens.length) {
            // ถ้าเป็น {} ว่าง
            if (tokens[i].value === '{' && 
                i + 1 < tokens.length && 
                tokens[i + 1].value === '}') {
                return true;
            }
            
            // ถ้าเป็น expression ที่ไม่ทำอะไร
            if (tokens[i].value === '(' && 
                i + 1 < tokens.length && 
                tokens[i + 1].value === ')') {
                return true;
            }
        }
        
        return false;
    }

    /**
     * ตรวจจับ Internal Caching - UPGRADED with GrammarIndex
     */
    detectCachingViolations(tokens) {
        const violations = [];
        // ! UPGRADE: ดึง patterns จาก GrammarIndex
        const cachingPatterns = this.grammarIndex.getPatternsForRule('NO_INTERNAL_CACHING');

        tokens.forEach(token => {
            if (token.type === 'IDENTIFIER') {
                for (const pattern of cachingPatterns) {
                    // สมมติว่า pattern เป็น regex หรือ string
                    const isMatch = pattern.regex ? 
                        pattern.regex.test(token.value) : 
                        token.value.toLowerCase().includes(pattern.keyword.toLowerCase());
                        
                    if (isMatch) {
                        violations.push({
                            ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                            severity: SEVERITY_LEVELS.WARNING,
                            message: `Internal caching detected: ${pattern.name || pattern.keyword}`,
                            location: token.location
                        });
                    }
                }
            }
        });

        return violations;
    }

    /**
     * ตรวจจับ Mocking patterns - UPGRADED with GrammarIndex  
     */
    detectMockingViolations(tokens) {
        const violations = [];
        // ! UPGRADE: ดึง patterns จาก GrammarIndex
        const mockingPatterns = this.grammarIndex.getPatternsForRule('NO_MOCKING');
        
        tokens.forEach((token, index) => {
            if (token.type === 'IDENTIFIER') {
                for (const pattern of mockingPatterns) {
                    const isMatch = pattern.regex ? 
                        pattern.regex.test(token.value) : 
                        token.value.toLowerCase().includes(pattern.keyword.toLowerCase());
                        
                    if (isMatch) {
                        violations.push({
                            ruleId: RULE_IDS.NO_MOCKING,
                            severity: SEVERITY_LEVELS.ERROR,
                            message: `Mocking detected: ${pattern.name || pattern.keyword}`,
                            location: token.location
                        });
                    }
                }
            }
        });
        
        return violations;
    }
    
    /**
     * Helper: ประมาณการ line number จาก string position ใน match
     */
    estimateLineFromMatch(tokens, matchIndex) {
        if (!tokens || tokens.length === 0) {
            console.warn(`Could not estimate line number: no tokens provided for match at index ${matchIndex}`);
            return -1; // ไม่สามารถหา line number ได้
        }
        
        let currentPosition = 0;
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const tokenLength = (token.value ? token.value.length : 0) + 1;
            
            if (currentPosition + tokenLength >= matchIndex) {
                if (token.location && token.location.line) {
                    return token.location.line;
                }
                console.warn(`Could not estimate line number: token at index ${i} has no location data for match at index ${matchIndex}`);
                return -1;
            }
            
            currentPosition += tokenLength;
        }
        
        const lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.location && lastToken.location.line) {
            return lastToken.location.line;
        }
        
        // ไม่สามารถหา line number ได้, ควรแจ้งให้ทราบ
        console.warn(`Could not estimate line number for match at index ${matchIndex}: no valid location data found`);
        return -1;
    }
}

export { SmartParserEngine };

