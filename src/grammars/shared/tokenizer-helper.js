// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// @contact chahuadev@gmail.com
// ======================================================================
// ChahuadevR Engine Grammar Dictionary - Core Language Support
// ============================================================================
// Tokenizer Integration Helper
// ตัวอย่างการใช้ Grammar Index System ใน Tokenizer/Parser
// ============================================================================
// Performance Comparison:
// ============================================================================
// OLD METHOD (Loop through all operators):
// - Try 3-character operators: ['===', '!==', '>>>', '...'] - O(n)
// - Try 2-character operators: ['==', '!=', '>=', '<=', '<<', '>>', '&&', '||', '++', '--', ...] - O(n)
// - Try 1-character operators: ['+', '-', '*', '/', '%', '&', '|', '^', '!', '~', '<', '>'] - O(n)
// - Total: O(3n) worst case
// ============================================================================
// NEW METHOD (Trie longest match):
// * - Walk through Trie: O(m) where m = longest operator length (usually  3)
// * - Returns longest match immediately
// * - Total: O(3) constant time for most operators
// ============================================================================

import { GrammarIndex } from './grammar-index.js';

/**
 * Example Tokenizer using Grammar Index
 */
export class ExampleTokenizer {
    constructor(grammar) {
        // Build indexes once
        this.index = new GrammarIndex(grammar);
        console.log('Index built:', this.index.getStats());
    }

    /**
     * Tokenize input string
     * @param {string} input - Source code
     * @returns {Array<Token>}
     */
    tokenize(input) {
        const tokens = [];
        let position = 0;

        while (position < input.length) {
            const char = input[position];

            // Skip whitespace
            if (/\s/.test(char)) {
                position++;
                continue;
            }

            // =====================================================================
            // 1. Try Operator (FAST: O(m) instead of O(n))
            // =====================================================================
            const operatorMatch = this.index.findLongestOperator(input, position);
            if (operatorMatch) {
                tokens.push({
                    type: 'operator',
                    value: operatorMatch.operator,
                    start: position,
                    end: position + operatorMatch.length,
                    metadata: operatorMatch.data
                });
                position += operatorMatch.length;
                continue;
            }

            // =====================================================================
            // 2. Try Punctuation (FAST: O(m))
            // =====================================================================
            const punctMatch = this.index.findLongestPunctuation(input, position);
            if (punctMatch) {
                tokens.push({
                    type: 'punctuation',
                    value: punctMatch.punctuation,
                    start: position,
                    end: position + punctMatch.length,
                    metadata: punctMatch.data
                });
                position += punctMatch.length;
                continue;
            }

            // =====================================================================
            // 3. Try Identifier/Keyword
            // =====================================================================
            if (/[a-zA-Z_$]/.test(char)) {
                const identifier = this._readIdentifier(input, position);

                // Fast keyword check: O(1)
                if (this.index.isKeyword(identifier)) {
                    const keywordData = this.index.getKeyword(identifier);

                    // Check if deprecated
                    if (this.index.isDeprecated(identifier)) {
                        console.warn(`Deprecated keyword: ${identifier}`);
                    }

                    tokens.push({
                        type: 'keyword',
                        value: identifier,
                        start: position,
                        end: position + identifier.length,
                        metadata: keywordData
                    });
                } else {
                    // Not a keyword - might be typo?
                    const closest = this.index.findClosestKeyword(identifier, 2);

                    if (closest && closest.distance <= 2) {
                        console.warn(`Possible typo: "${identifier}" - Did you mean "${closest.keyword}"?`);
                    }

                    tokens.push({
                        type: 'identifier',
                        value: identifier,
                        start: position,
                        end: position + identifier.length
                    });
                }

                position += identifier.length;
                continue;
            }

            // =====================================================================
            // 4. Try Number
            // =====================================================================
            if (/[0-9]/.test(char)) {
                const number = this._readNumber(input, position);
                tokens.push({
                    type: 'number',
                    value: number,
                    start: position,
                    end: position + number.length
                });
                position += number.length;
                continue;
            }

            // =====================================================================
            // 5. Try String
            // =====================================================================
            if (char === '"' || char === "'" || char === '`') {
                const string = this._readString(input, position);
                tokens.push({
                    type: 'string',
                    value: string,
                    start: position,
                    end: position + string.length
                });
                position += string.length;
                continue;
            }

            // Unknown character
            throw new Error(`Unexpected character: ${char} at position ${position}`);
        }

        return tokens;
    }

    /**
     * Read identifier/keyword
     * @private
     */
    _readIdentifier(input, position) {
        let end = position;
        while (end < input.length && /[a-zA-Z0-9_$]/.test(input[end])) {
            end++;
        }
        return input.slice(position, end);
    }

    /**
     * Read number literal
     * @private
     */
    _readNumber(input, position) {
        let end = position;
        while (end < input.length && /[0-9._xXoObBeE]/.test(input[end])) {
            end++;
        }
        return input.slice(position, end);
    }

    /**
     * Read string literal
     * @private
     */
    _readString(input, position) {
        const quote = input[position];
        let end = position + 1;

        while (end < input.length) {
            if (input[end] === '\\') {
                end += 2; // Skip escaped character
                continue;
            }
            if (input[end] === quote) {
                end++;
                break;
            }
            end++;
        }

        return input.slice(position, end);
    }
}

// =============================================================================
// Performance Benchmarks
// =============================================================================

/**
 * Compare OLD vs NEW tokenizer performance
 */
export function benchmarkTokenizer(grammar, testCode, iterations = 1000) {
    console.log('='.repeat(80));
    console.log('TOKENIZER PERFORMANCE BENCHMARK');
    console.log('='.repeat(80));

    const tokenizer = new ExampleTokenizer(grammar);

    // Warm-up
    for (let i = 0; i < 10; i++) {
        tokenizer.tokenize(testCode);
    }

    // Benchmark
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        tokenizer.tokenize(testCode);
    }
    const end = performance.now();

    const totalTime = end - start;
    const avgTime = totalTime / iterations;
    const tokens = tokenizer.tokenize(testCode);

    console.log(`Test Code: ${testCode}`);
    console.log(`Iterations: ${iterations}`);
    console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average Time: ${avgTime.toFixed(4)}ms`);
    console.log(`Tokens Generated: ${tokens.length}`);
    console.log(`Tokens per Second: ${(iterations * tokens.length / (totalTime / 1000)).toFixed(0)}`);
    console.log('='.repeat(80));

    return { totalTime, avgTime, tokens };
}

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * Example 1: Basic Tokenization
 */
export function exampleBasicTokenization() {
    console.log('\n===== Example 1: Basic Tokenization =====\n');

    // Assume we have JAVASCRIPT_GRAMMAR
    const { JAVASCRIPT_GRAMMAR } = require('../javascript/javascript.grammar.js');

    const tokenizer = new ExampleTokenizer(JAVASCRIPT_GRAMMAR);
    const code = 'const x = 10 + 20;';

    const tokens = tokenizer.tokenize(code);
    console.log('Code:', code);
    console.log('Tokens:', JSON.stringify(tokens, null, 2));
}

/**
 * Example 2: Operator Longest Match
 */
export function exampleOperatorLongestMatch() {
    console.log('\n===== Example 2: Operator Longest Match =====\n');

    const { JAVASCRIPT_GRAMMAR } = require('../javascript/javascript.grammar.js');
    const index = new GrammarIndex(JAVASCRIPT_GRAMMAR);

    const testCases = [
        { input: '!== 10', position: 0, expected: '!==' },
        { input: '!= 10', position: 0, expected: '!=' },
        { input: '! true', position: 0, expected: '!' },
        { input: 'x === y', position: 2, expected: '===' },
        { input: 'x == y', position: 2, expected: '==' },
        { input: '...rest', position: 0, expected: '...' }
    ];

    console.log('OLD METHOD: Loop through all operators (O(n))');
    console.log('NEW METHOD: Trie longest match (O(m))\n');

    for (const test of testCases) {
        const result = index.findLongestOperator(test.input, test.position);

        console.log(`Input: "${test.input}" at position ${test.position}`);
        console.log(`Expected: "${test.expected}"`);
        console.log(`Found: "${result.operator}"`);
        console.log(`Match: ${result.operator === test.expected ? '' : ''}`);
        console.log(`Data:`, result.data);
        console.log();
    }
}

/**
 * Example 3: Typo Suggestions
 */
export function exampleTypoSuggestions() {
    console.log('\n===== Example 3: Typo Suggestions =====\n');

    const { JAVASCRIPT_GRAMMAR } = require('../javascript/javascript.grammar.js');
    const index = new GrammarIndex(JAVASCRIPT_GRAMMAR);

    const typos = [
        'functoin',  //  function
        'cosnt',     //  const
        'reutrn',    //  return
        'improt',    //  import
        'exprot',    //  export
        'awiat',     //  await
        'aysnc',     //  async
        'clss'       //  class
    ];

    for (const typo of typos) {
        const suggestions = index.suggestKeyword(typo, 3);

        console.log(`Typo: "${typo}"`);
        console.log('Suggestions:');
        for (const s of suggestions) {
            console.log(`  - "${s.keyword}" (distance: ${s.distance}, similarity: ${(s.similarity * 100).toFixed(1)}%)`);
        }
        console.log();
    }
}

/**
 * Example 4: Keyword Autocomplete
 */
export function exampleKeywordAutocomplete() {
    console.log('\n===== Example 4: Keyword Autocomplete =====\n');

    const { JAVASCRIPT_GRAMMAR } = require('../javascript/javascript.grammar.js');
    const index = new GrammarIndex(JAVASCRIPT_GRAMMAR);

    const prefixes = ['con', 'fun', 'imp', 'aw', 'class'];

    for (const prefix of prefixes) {
        const matches = index.findKeywordsByPrefix(prefix);

        console.log(`Prefix: "${prefix}"`);
        console.log(`Matches: ${matches.map(m => m.keyword).join(', ')}`);
        console.log();
    }
}

/**
 * Example 5: Category Queries
 */
export function exampleCategoryQueries() {
    console.log('\n===== Example 5: Category Queries =====\n');

    const { JAVASCRIPT_GRAMMAR } = require('../javascript/javascript.grammar.js');
    const index = new GrammarIndex(JAVASCRIPT_GRAMMAR);

    const categories = index.getAllCategories();

    console.log('All Categories:', categories.join(', '));
    console.log();

    for (const category of categories.slice(0, 5)) {
        const keywords = index.getKeywordsByCategory(category);
        console.log(`Category: "${category}"`);
        console.log(`Keywords: ${keywords.map(k => k.keyword).join(', ')}`);
        console.log();
    }
}

/**
 * Example 6: Version Queries
 */
export function exampleVersionQueries() {
    console.log('\n===== Example 6: Version Queries =====\n');

    const { JAVASCRIPT_GRAMMAR } = require('../javascript/javascript.grammar.js');
    const index = new GrammarIndex(JAVASCRIPT_GRAMMAR);

    const versions = index.getAllVersions();

    console.log('All Versions:', versions.join(', '));
    console.log();

    for (const version of versions) {
        const keywords = index.getKeywordsByVersion(version);
        console.log(`Version: ${version}`);
        console.log(`Keywords: ${keywords.map(k => k.keyword).join(', ')}`);
        console.log();
    }
}

// =============================================================================
// Integration with Real Parser
// =============================================================================

/**
 * Example integration pattern for real parser
 */
export class ParserIntegration {
    constructor(grammar) {
        this.index = new GrammarIndex(grammar);
    }

    /**
     * Check if identifier can start expression
     */
    canStartExpression(identifier) {
        const keyword = this.index.getKeyword(identifier);
        if (!keyword) return true; // Not a keyword

        return keyword.startsExpr === true;
    }

    /**
     * Get operator precedence
     */
    getOperatorPrecedence(operator) {
        const opData = this.index.getOperator(operator);
        return opData?.precedence ?? 0;
    }

    /**
     * Get operator associativity
     */
    getOperatorAssociativity(operator) {
        const opData = this.index.getOperator(operator);
        return opData?.associativity ?? 'left';
    }

    /**
     * Check if operator is assignment
     */
    isAssignmentOperator(operator) {
        const opData = this.index.getOperator(operator);
        return opData?.isAssign === true || opData?.type === 'assignment';
    }

    /**
     * Validate keyword usage in context
     */
    validateKeywordInContext(keyword, context) {
        const keywordData = this.index.getKeyword(keyword);
        if (!keywordData) return { valid: false, error: 'Not a keyword' };

        if (keywordData.contextual) {
            if (!keywordData.allowedContexts) {
                throw new Error(`Contextual keyword "${keyword}" missing allowedContexts`);
            }

            if (!keywordData.allowedContexts.includes(context)) {
                return {
                    valid: true,
                    isIdentifier: true,
                    message: `"${keyword}" is an identifier in this context`
                };
            }
        }

        // Check if deprecated
        if (keywordData.deprecated) {
            return {
                valid: true,
                warning: `"${keyword}" is deprecated. ${keywordData.deprecationMessage || ''}`
            };
        }

        return { valid: true };
    }
}

export default {
    ExampleTokenizer,
    benchmarkTokenizer,
    exampleBasicTokenization,
    exampleOperatorLongestMatch,
    exampleTypoSuggestions,
    exampleKeywordAutocomplete,
    exampleCategoryQueries,
    exampleVersionQueries,
    ParserIntegration
};
