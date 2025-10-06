// src/grammars/shared/parser-study.js (เวอร์ชันแก้ไข Final ที่สมบูรณ์)

const acorn = require('acorn');
const { ABSOLUTE_RULES } = require('../../validator');

function traverse(node, visitors) {
    if (!node) return;
    const visitor = visitors[node.type];
    if (visitor) visitor(node);
    for (const key in node) {
        if (key === 'parent') continue;
        const child = node[key];
        if (Array.isArray(child)) {
            child.forEach(item => traverse(item, visitors));
        } else if (child && typeof child === 'object') {
            traverse(child, visitors);
        }
    }
}

class ParserStudyModule {
    
    positionToLocation(code, position, matchLength = 1) {
        const start = { line: 1, column: 0 };
        for (let i = 0; i < position; i++) {
            if (code[i] === '\n') {
                start.line++;
                start.column = 0;
            } else {
                start.column++;
            }
        }
        const end = { line: start.line, column: start.column + matchLength };
        return { start, end };
    }

    studyRulePatterns(code) {
        console.log('TARGET: Studying Rule Detection Patterns from AST...');
        let ast;
        const comments = [];
        try {
            ast = acorn.parse(code, {
                ecmaVersion: 2024,
                sourceType: 'module',
                locations: true,
                onComment: comments, 
            });
            ast.comments = comments;
        } catch (error) {
            console.error('ERROR: Acorn failed to parse code.', error.message);
            throw new Error('AST parsing failed.');
        }

        const allViolations = {
            mockingPatterns: this.findMockingPatterns(ast, code),
            hardcodePatterns: this.findHardcodePatterns(ast),
            silentFallbackPatterns: this.findSilentFallbackPatterns(ast),
            internalCachingPatterns: this.findInternalCachingPatterns(ast, code),
            emojiPatterns: this.findEmojiPatterns(ast, code),
            deepNestingPatterns: this.findDeepNestingPatterns(ast),
            complexityPatterns: this.findComplexityPatterns(ast),
        };

        console.log('--- AST Pattern Analysis Results ---');
        for (const key in allViolations) {
            console.log(`  ${key}: ${allViolations[key].length} locations found.`);
        }
        console.log('------------------------------------');
        
        return allViolations;
    }
    
    _getAstSlice(code, node) {
        if (node && typeof node.start === 'number' && typeof node.end === 'number') {
            return code.slice(node.start, node.end);
        }
        return '';
    }
    
    findMockingPatterns(ast, code) {
        const patterns = [];
        const mockingRules = ABSOLUTE_RULES.NO_MOCKING.patterns;
        
        traverse(ast, {
            CallExpression: (node) => {
                // ! FIX: เปลี่ยนจากการเช็คชื่อ มาเป็นการเช็คโค้ดจริง
                const codeSlice = this._getAstSlice(code, node);
                if (!codeSlice) return;

                for (const rule of mockingRules) {
                    const regex = new RegExp(rule.regex.source);
                    if (regex.test(codeSlice)) {
                        patterns.push({
                            type: 'mocking-call',
                            location: node.loc,
                            pattern: rule.name,
                        });
                        return; // เจอ 1 rule ก็พอสำหรับ node นี้
                    }
                }
            }
        });
        return patterns;
    }

    findHardcodePatterns(ast) {
        const patterns = [];
        const hardcodeRules = ABSOLUTE_RULES.NO_HARDCODE.patterns;
        
        traverse(ast, {
            Literal: (node) => {
                // ! FIX: ตรวจจับทั้ง string และ number literals
                if (!node.raw) return;
                
                for (const rule of hardcodeRules) {
                    const regex = new RegExp(rule.regex.source, 'i'); // Case insensitive
                    
                    // ตรวจสอบ string literals
                    if (typeof node.value === 'string' && regex.test(node.raw)) {
                        patterns.push({
                            type: 'hardcode-string',
                            location: node.loc,
                            match: node.raw,
                            patternName: rule.name
                        });
                        return;
                    }
                    
                    // ! FIX: ตรวจสอบ magic numbers (นอกจาก 0, 1, -1)
                    if (typeof node.value === 'number' && 
                        ![0, 1, -1].includes(node.value) && 
                        rule.name.includes('Magic')) {
                        patterns.push({
                            type: 'magic-number',
                            location: node.loc,
                            match: node.raw,
                            patternName: rule.name
                        });
                        return;
                    }
                }
            },
            
            // ! FIX: ตรวจจับ Template Literals ที่อาจมี hardcode
            TemplateLiteral: (node) => {
                if (node.quasis) {
                    node.quasis.forEach(element => {
                        if (element.value && element.value.raw) {
                            for (const rule of hardcodeRules) {
                                const regex = new RegExp(rule.regex.source, 'i');
                                if (regex.test(element.value.raw)) {
                                    patterns.push({
                                        type: 'hardcode-template',
                                        location: element.loc || node.loc,
                                        match: element.value.raw,
                                        patternName: rule.name
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
        return patterns;
    }
    
    findSilentFallbackPatterns(ast) {
        const patterns = [];
        
        traverse(ast, {
            CatchClause: (node) => {
                if (!node.body.body || node.body.body.length === 0) {
                    patterns.push({ type: 'empty-catch', location: node.loc, patternName: 'Empty catch block' });
                } else if (node.body.body.length === 1) {
                    const statement = node.body.body[0];
                    if (statement.type === 'ReturnStatement' && (statement.argument === null || (statement.argument.type === 'Literal' && statement.argument.value === null))) {
                        patterns.push({ type: 'silent-return-catch', location: node.loc, patternName: 'Catch block only returning default' });
                    }
                }
            },
            
            LogicalExpression: (node) => {
                if (node.operator === '||' || node.operator === '??') {
                    if (node.right.type === 'ArrayExpression' && node.right.elements.length === 0) {
                        patterns.push({ type: 'logical-fallback', location: node.loc, patternName: `Fallback to empty array with ${node.operator}`});
                    }
                }
            },
            
            CallExpression: (node) => {
                 if (node.callee.type === 'MemberExpression' && node.callee.property.name === 'catch') {
                     const handler = node.arguments[0];
                     if(handler && handler.type === 'ArrowFunctionExpression' && handler.body.type === 'BlockStatement' && handler.body.body.length === 0) {
                         patterns.push({ type: 'promise-empty-catch', location: node.loc, patternName: 'Promise with empty catch'});
                     }
                 }
            },
            
            // ! FIX: ตรวจจับ async function ที่มี await แต่ไม่มี try-catch
            FunctionDeclaration: (node) => {
                this._checkAsyncFunctionForUnsafeAwait(node, patterns);
            },
            
            FunctionExpression: (node) => {
                this._checkAsyncFunctionForUnsafeAwait(node, patterns);
            },
            
            ArrowFunctionExpression: (node) => {
                this._checkAsyncFunctionForUnsafeAwait(node, patterns);
            }
        });
        return patterns;
    }
    
    // ! FIX: Helper method สำหรับตรวจจับ async function ที่ไม่ปลอดภัย
    _checkAsyncFunctionForUnsafeAwait(node, patterns) {
        if (!node.async) return;
        
        let hasAwait = false;
        let hasTryCatch = false;
        
        // ตรวจสอบว่ามี await และ try-catch หรือไม่
        traverse(node.body, {
            AwaitExpression: () => { hasAwait = true; },
            TryStatement: () => { hasTryCatch = true; }
        });
        
        // ถ้ามี await แต่ไม่มี try-catch = Silent Fallback
        if (hasAwait && !hasTryCatch) {
            patterns.push({ 
                type: 'async-without-trycatch', 
                location: node.loc, 
                patternName: 'Async function with await but no try-catch' 
            });
        }
    }
    
    findInternalCachingPatterns(ast, code) {
        const patterns = [];
        
        traverse(ast, {
            VariableDeclarator: (node) => {
                // ตรวจจับตัวแปรที่มีชื่อเกี่ยวกับ cache
                if (node.id.type === 'Identifier' && node.id.name?.toLowerCase().includes('cache')) {
                    patterns.push({ type: 'cache-variable', location: node.loc, patternName: 'new Map() assigned to cache variable' });
                }
            },
            
            CallExpression: (node) => {
                const codeSlice = this._getAstSlice(code, node);
                const lowerCode = codeSlice.toLowerCase();
                
                // ตรวจจับฟังก์ชัน memoization ต่างๆ
                if (lowerCode.includes('memoize')) {
                    patterns.push({ type: 'memo-usage', location: node.loc, patternName: 'Memoization function call' });
                }
                
                // ! FIX: ตรวจจับ useMemo ของ React (ปัญหาหลักที่พลาด)
                if (node.callee.type === 'Identifier' && node.callee.name === 'useMemo') {
                    patterns.push({ type: 'react-usememo', location: node.loc, patternName: 'React useMemo hook' });
                }
                
                // ตรวจจับ cache.has() pattern
                if (lowerCode.includes('cache.has')) {
                    patterns.push({ type: 'cache-usage', location: node.loc, patternName: 'if (cache.has()) pattern' });
                }
                
                // ! FIX: ตรวจจับ localStorage/sessionStorage (เป็น caching อีกรูปแบบ)
                if (node.callee.type === 'MemberExpression') {
                    const objectName = node.callee.object.name || '';
                    const methodName = node.callee.property.name || '';
                    
                    if (['localStorage', 'sessionStorage'].includes(objectName) && 
                        ['getItem', 'setItem'].includes(methodName)) {
                        patterns.push({ type: 'web-storage-cache', location: node.loc, patternName: `${objectName}.${methodName} caching` });
                    }
                }
            },
            
            MemberExpression: (node) => {
                const codeSlice = this._getAstSlice(code, node);
                
                // ตรวจจับ this.cache property
                if (codeSlice.toLowerCase().includes('this.cache')) {
                    patterns.push({ type: 'this-cache', location: node.loc, patternName: 'this.cache property' });
                }
                
                // ! FIX: ตรวจจับรูปแบบ cache อื่นๆ เพิ่มเติม
                if (node.object && node.object.name && 
                    node.object.name.toLowerCase().includes('cache')) {
                    patterns.push({ type: 'cache-object-access', location: node.loc, patternName: 'Cache object property access' });
                }
            }
        });
        return patterns;
    }
    
    findEmojiPatterns(ast, code) {
        const patterns = [];
        
        // ! EMERGENCY FIX: ใช้ regex แค่ตัวเดียวเพื่อป้องกัน memory leak
        const emojiRule = ABSOLUTE_RULES.NO_EMOJI.patterns.find(p => p.name.includes("Emoticons"));
        if (!emojiRule) return patterns;
        
        const emojiRegex = new RegExp(emojiRule.regex.source, 'gu');

        // ตรวจจับอีโมจิใน Comments
        (ast.comments || []).forEach(comment => {
            emojiRegex.lastIndex = 0;
            let match;
            while ((match = emojiRegex.exec(comment.value)) !== null) {
                patterns.push({
                    type: 'emoji-comment',
                    location: this.positionToLocation(code, comment.start + match.index + 2, match[0].length),
                    emoji: match[0],
                });
                if (patterns.length > 10) break; // Circuit breaker
            }
        });

        // ตรวจจับอีโมจิใน String Literals
        traverse(ast, {
            Literal: (node) => {
                if (typeof node.value === 'string' && patterns.length < 10) {
                    emojiRegex.lastIndex = 0;
                    let match;
                    while ((match = emojiRegex.exec(node.value)) !== null) {
                        patterns.push({
                            type: 'emoji-string',
                            location: this.positionToLocation(code, node.start + match.index + 1, match[0].length),
                            emoji: match[0],
                        });
                        if (patterns.length > 10) break;
                    }
                }
            }
        });

        return patterns;
    }

    findDeepNestingPatterns(ast) {
        const patterns = [];
        const maxDepth = 3;
        const nestingTypes = new Set(['IfStatement', 'ForStatement', 'WhileStatement', 'SwitchStatement', 'ForOfStatement', 'ForInStatement']);

        const checkDepth = (node, depth) => {
            if (!node || typeof node !== 'object') return;
            const isNestingNode = nestingTypes.has(node.type);
            const currentDepth = isNestingNode ? depth + 1 : depth;
            if (isNestingNode && currentDepth > maxDepth) {
                patterns.push({ depth: currentDepth, location: node.loc });
            }
            for (const key in node) {
                if (key === 'parent') continue;
                const child = node[key];
                if (Array.isArray(child)) {
                    child.forEach(item => checkDepth(item, currentDepth));
                } else if (child) {
                    checkDepth(child, currentDepth);
                }
            }
        };
        checkDepth(ast, 0);
        return patterns.length > 0 ? [patterns.reduce((max, p) => p.depth > max.depth ? p : max, {depth: 0})] : [];
    }
    
    findComplexityPatterns(ast) {
        const patterns = [];
        const maxParams = 5;
        const checkFunc = (node) => {
            if (node.params.length > maxParams) {
                patterns.push({
                    type: 'too-many-parameters',
                    paramCount: node.params.length,
                    location: node.loc,
                });
            }
        };
        traverse(ast, { FunctionDeclaration: checkFunc, ArrowFunctionExpression: checkFunc, FunctionExpression: checkFunc });
        return patterns;
    }
}

module.exports = { ParserStudyModule };