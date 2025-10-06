// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// @contact chahuadev@gmail.com
// ======================================================================
// Disambiguation Engine - Master of Ambiguous Syntax
// ============================================================================
// ระบบตัดสินคำกำกวมอัจฉริยะสำหรับสัญลักษณ์ที่มีความหมายหลายแบบ
// ============================================================================

import { GrammarIndex } from './grammar-index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load Configuration (NO MORE HARDCODE!)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'parser-config.json');

let DISAMBIGUATION_CONFIG;
try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    DISAMBIGUATION_CONFIG = config.disambiguationEngine || { maxHistory: 10 };
} catch (error) {
    DISAMBIGUATION_CONFIG = { maxHistory: 10 };
}

// ============================================================================
// AMBIGUOUS SYMBOLS REGISTRY
// ============================================================================

const AMBIGUOUS_SYMBOLS = {
    // Division vs RegExp vs JSX
    '/': {
        patterns: [
            {
                type: 'DIVISION',
                context: 'BinaryExpression',
                precededBy: ['IDENTIFIER', 'LITERAL', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
                followedBy: ['IDENTIFIER', 'LITERAL', 'PAREN_OPEN'],
                example: 'a / b',
                confidence: 0.9
            },
            {
                type: 'REGEXP_START',
                context: 'RegExpLiteral',
                precededBy: ['PAREN_OPEN', 'BRACKET_OPEN', 'COMMA', 'RETURN', 'ASSIGN'],
                followedBy: ['LETTER', 'DIGIT', 'SPECIAL_CHAR'],
                example: '/abc/gi',
                confidence: 0.85
            },
            {
                type: 'JSX_CLOSING',
                context: 'JSXClosingElement',
                precededBy: ['LESS_THAN'],
                followedBy: ['IDENTIFIER', 'UPPERCASE_IDENTIFIER'],
                example: '</Component>',
                confidence: 0.95
            }
        ]
    },

    // Multiplication vs Generator vs Import Namespace
    '*': {
        patterns: [
            {
                type: 'MULTIPLICATION',
                context: 'BinaryExpression',
                precededBy: ['IDENTIFIER', 'LITERAL', 'PAREN_CLOSE'],
                followedBy: ['IDENTIFIER', 'LITERAL', 'PAREN_OPEN'],
                example: 'a * b',
                confidence: 0.9
            },
            {
                type: 'GENERATOR_STAR',
                context: 'GeneratorFunction',
                precededBy: ['function'],
                followedBy: ['IDENTIFIER', 'PAREN_OPEN'],
                example: 'function* gen()',
                confidence: 0.95
            },
            {
                type: 'NAMESPACE_IMPORT',
                context: 'ImportDeclaration',
                precededBy: ['import'],
                followedBy: ['as'],
                example: 'import * as mod',
                confidence: 0.95
            },
            {
                type: 'EXPORT_ALL',
                context: 'ExportDeclaration',
                precededBy: ['export'],
                followedBy: ['from', 'as'],
                example: 'export * from "mod"',
                confidence: 0.95
            },
            {
                type: 'POINTER_DEREF',
                context: 'PointerExpression',
                language: 'c',
                precededBy: ['TYPE', 'STAR'],
                followedBy: ['IDENTIFIER'],
                example: 'int *ptr',
                confidence: 0.9
            }
        ]
    },

    // Less than vs JSX vs Generic vs Template
    '<': {
        patterns: [
            {
                type: 'LESS_THAN',
                context: 'BinaryExpression',
                precededBy: ['IDENTIFIER', 'LITERAL', 'PAREN_CLOSE'],
                followedBy: ['IDENTIFIER', 'LITERAL', 'PAREN_OPEN'],
                example: 'a < b',
                confidence: 0.85
            },
            {
                type: 'JSX_OPEN',
                context: 'JSXElement',
                precededBy: ['RETURN', 'PAREN_OPEN', 'ASSIGN', 'ARROW'],
                followedBy: ['UPPERCASE_IDENTIFIER', 'Fragment'],
                example: '<Component>',
                confidence: 0.9
            },
            {
                type: 'GENERIC_OPEN',
                context: 'TypeParameter',
                language: 'typescript',
                precededBy: ['IDENTIFIER', 'class', 'interface', 'function'],
                followedBy: ['IDENTIFIER', 'TYPE'],
                example: 'Array<T>',
                confidence: 0.9
            },
            {
                type: 'SHIFT_LEFT',
                context: 'BinaryExpression',
                precededBy: ['IDENTIFIER', 'LITERAL'],
                followedBy: ['LESS_THAN'],
                example: 'x << 2',
                confidence: 0.95
            }
        ]
    },

    // Colon - multiple meanings
    ':': {
        patterns: [
            {
                type: 'OBJECT_PROPERTY',
                context: 'ObjectLiteral',
                precededBy: ['IDENTIFIER', 'STRING', 'BRACKET_CLOSE'],
                followedBy: ['Expression', 'LITERAL'],
                example: '{ a: 1 }',
                confidence: 0.9
            },
            {
                type: 'TERNARY_OPERATOR',
                context: 'ConditionalExpression',
                precededBy: ['QUESTION'],
                followedBy: ['Expression'],
                example: 'a ? b : c',
                confidence: 0.95
            },
            {
                type: 'LABEL',
                context: 'LabeledStatement',
                precededBy: ['IDENTIFIER'],
                followedBy: ['NEWLINE', 'Statement'],
                example: 'loop: for(...)',
                confidence: 0.85
            },
            {
                type: 'TYPE_ANNOTATION',
                context: 'TypeAnnotation',
                language: 'typescript',
                precededBy: ['IDENTIFIER', 'PAREN_CLOSE'],
                followedBy: ['TYPE', 'IDENTIFIER'],
                example: 'let x: number',
                confidence: 0.9
            },
            {
                type: 'CASE_COLON',
                context: 'SwitchCase',
                precededBy: ['case', 'default'],
                followedBy: ['NEWLINE', 'Statement'],
                example: 'case 1:',
                confidence: 0.95
            }
        ]
    },

    // Async - keyword vs identifier
    'async': {
        patterns: [
            {
                type: 'KEYWORD',
                context: 'AsyncFunction',
                precededBy: ['NEWLINE', 'SEMICOLON', 'PAREN_OPEN'],
                followedBy: ['function', 'PAREN_OPEN', 'IDENTIFIER'],
                example: 'async function fn()',
                confidence: 0.95
            },
            {
                type: 'IDENTIFIER',
                context: 'Variable',
                precededBy: ['const', 'let', 'var', 'DOT'],
                followedBy: ['ASSIGN', 'DOT', 'PAREN_OPEN'],
                example: 'const async = true',
                confidence: 0.8
            }
        ]
    },

    // Dot - property access vs spread vs decimal
    '.': {
        patterns: [
            {
                type: 'PROPERTY_ACCESS',
                context: 'MemberExpression',
                precededBy: ['IDENTIFIER', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
                followedBy: ['IDENTIFIER'],
                example: 'obj.prop',
                confidence: 0.95
            },
            {
                type: 'DECIMAL_POINT',
                context: 'NumericLiteral',
                precededBy: ['DIGIT'],
                followedBy: ['DIGIT'],
                example: '3.14',
                confidence: 0.98
            },
            {
                type: 'SPREAD_START',
                context: 'SpreadElement',
                precededBy: ['DOT'],
                followedBy: ['DOT'],
                example: '...args',
                confidence: 0.95
            },
            {
                type: 'OPTIONAL_CHAINING',
                context: 'OptionalChaining',
                precededBy: ['QUESTION'],
                followedBy: ['IDENTIFIER', 'BRACKET_OPEN'],
                example: 'obj?.prop',
                confidence: 0.95
            }
        ]
    },

    // Parentheses - function call vs grouping vs arrow params
    '(': {
        patterns: [
            {
                type: 'FUNCTION_CALL',
                context: 'CallExpression',
                precededBy: ['IDENTIFIER', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
                followedBy: ['Expression', 'PAREN_CLOSE'],
                example: 'fn(args)',
                confidence: 0.9
            },
            {
                type: 'GROUPING',
                context: 'ParenthesizedExpression',
                precededBy: ['OPERATOR', 'PAREN_OPEN', 'BRACKET_OPEN'],
                followedBy: ['Expression'],
                example: '(a + b)',
                confidence: 0.85
            },
            {
                type: 'ARROW_PARAMS',
                context: 'ArrowFunction',
                precededBy: ['ASSIGN', 'ARROW', 'PAREN_OPEN'],
                followedBy: ['IDENTIFIER', 'PAREN_CLOSE'],
                example: '(x) => x',
                confidence: 0.9
            },
            {
                type: 'FUNCTION_PARAMS',
                context: 'FunctionDeclaration',
                precededBy: ['function', 'IDENTIFIER'],
                followedBy: ['IDENTIFIER', 'PAREN_CLOSE'],
                example: 'function(x)',
                confidence: 0.95
            }
        ]
    },

    // Minus - subtraction vs negative vs decrement
    '-': {
        patterns: [
            {
                type: 'SUBTRACTION',
                context: 'BinaryExpression',
                precededBy: ['IDENTIFIER', 'LITERAL', 'PAREN_CLOSE'],
                followedBy: ['IDENTIFIER', 'LITERAL', 'PAREN_OPEN'],
                example: 'a - b',
                confidence: 0.9
            },
            {
                type: 'NEGATIVE',
                context: 'UnaryExpression',
                precededBy: ['OPERATOR', 'PAREN_OPEN', 'ASSIGN', 'RETURN'],
                followedBy: ['IDENTIFIER', 'LITERAL'],
                example: '-x',
                confidence: 0.85
            },
            {
                type: 'DECREMENT',
                context: 'UpdateExpression',
                precededBy: ['MINUS'],
                followedBy: ['IDENTIFIER'],
                example: '--x',
                confidence: 0.95
            },
            {
                type: 'ARROW_START',
                context: 'ArrowFunction',
                precededBy: ['PAREN_CLOSE', 'IDENTIFIER'],
                followedBy: ['GREATER_THAN'],
                example: '() => {}',
                confidence: 0.98
            }
        ]
    }
};

// ============================================================================
// DISAMBIGUATION ENGINE
// ============================================================================

class DisambiguationEngine {
    constructor(grammarIndex) {
        this.grammarIndex = grammarIndex || new GrammarIndex();
        this.history = []; // Token history for context
        this.maxHistory = DISAMBIGUATION_CONFIG.maxHistory;
    }

    /**
     * Disambiguate a symbol based on context
     */
    disambiguate(symbol, context = {}) {
        const { precedingTokens = [], followingTokens = [], language = 'javascript' } = context;

        // Get ambiguous patterns for this symbol
        const patterns = AMBIGUOUS_SYMBOLS[symbol];
        if (!patterns) {
            return {
                symbol,
                type: 'UNKNOWN',
                confidence: 0,
                reason: 'Symbol not in ambiguous registry'
            };
        }

        // Score each pattern
        const scores = patterns.patterns.map(pattern => {
            const score = this.scorePattern(pattern, precedingTokens, followingTokens, language);
            return {
                ...pattern,
                score
            };
        });

        // Sort by score (highest first)
        scores.sort((a, b) => b.score - a.score);

        // Return best match
        const best = scores[0];
        return {
            symbol,
            type: best.type,
            context: best.context,
            confidence: best.score,
            example: best.example,
            alternatives: scores.slice(1, 3).map(s => ({
                type: s.type,
                confidence: s.score
            }))
        };
    }

    /**
     * Score a pattern based on context
     */
    scorePattern(pattern, precedingTokens, followingTokens, language) {
        let score = pattern.confidence || 0.5;

        // Language check
        if (pattern.language && pattern.language !== language) {
            return 0;
        }

        // Check preceding tokens
        if (pattern.precededBy && precedingTokens.length > 0) {
            const lastToken = precedingTokens[precedingTokens.length - 1];
            if (pattern.precededBy.includes(lastToken.type)) {
                score += 0.2;
            }
        }

        // Check following tokens
        if (pattern.followedBy && followingTokens.length > 0) {
            const nextToken = followingTokens[0];
            if (pattern.followedBy.includes(nextToken.type)) {
                score += 0.2;
            }
        }

        // Context bonus
        if (pattern.context && this.matchesContext(pattern.context)) {
            score += 0.1;
        }

        return Math.min(score, 1.0);
    }

    /**
     * Check if current context matches pattern context
     */
    matchesContext(expectedContext) {
        // Simple heuristic based on recent tokens
        const recentTypes = this.history.slice(-5).map(t => t.type);

        const contextMatches = {
            'BinaryExpression': recentTypes.includes('IDENTIFIER') || recentTypes.includes('LITERAL'),
            'FunctionDeclaration': recentTypes.includes('function'),
            'JSXElement': recentTypes.includes('JSX_OPEN') || recentTypes.includes('UPPERCASE_IDENTIFIER'),
            'ImportDeclaration': recentTypes.includes('import'),
            'ExportDeclaration': recentTypes.includes('export')
        };

        return contextMatches[expectedContext] || false;
    }

    /**
     * Add token to history
     */
    addToHistory(token) {
        this.history.push(token);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Get all ambiguous symbols
     */
    getAmbiguousSymbols() {
        return Object.keys(AMBIGUOUS_SYMBOLS);
    }

    /**
     * Get patterns for a symbol
     */
    getPatternsForSymbol(symbol) {
        return AMBIGUOUS_SYMBOLS[symbol];
    }

    /**
     * Generate disambiguation report
     */
    generateReport() {
        console.log(' DISAMBIGUATION REPORT\n');
        console.log('='.repeat(80));

        for (const [symbol, data] of Object.entries(AMBIGUOUS_SYMBOLS)) {
            console.log(`\n"${symbol}" - ${data.patterns.length} possible meanings:`);

            data.patterns.forEach((pattern, idx) => {
                console.log(`  ${idx + 1}. ${pattern.type} (${pattern.context})`);
                console.log(`     Example: ${pattern.example}`);
                console.log(`     Confidence: ${(pattern.confidence * 100).toFixed(0)}%`);
            });
        }

        console.log('\n' + '='.repeat(80));
        console.log(`\n Total ambiguous symbols: ${Object.keys(AMBIGUOUS_SYMBOLS).length}`);
        console.log(` Total patterns: ${Object.values(AMBIGUOUS_SYMBOLS).reduce((sum, s) => sum + s.patterns.length, 0)}`);
    }
}

// ============================================================================
// EXPORT
// ============================================================================

export { DisambiguationEngine, AMBIGUOUS_SYMBOLS };

// Run report if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const engine = new DisambiguationEngine();
    engine.generateReport();
}
