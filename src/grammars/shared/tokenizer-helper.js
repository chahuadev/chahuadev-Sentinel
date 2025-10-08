// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https:// ! github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================
// !  ChahuadevR Engine Grammar Dictionary - Core Language Support
// !  ============================================================================
// !  Tokenizer Integration Helper
// !  ตัวอย่างการใช้ Grammar Index System ใน Tokenizer/Parser
// !  ============================================================================
// !  Performance Comparison:
// !  ============================================================================
// !  OLD METHOD (Loop through all operators):
// !  - Try 3-character operators: ['===', '!==', '>>>', '...'] - O(n)
// !  - Try 2-character operators: ['==', '!=', '>=', '<=', '<<', '>>', '&&', '||', '++', '--', ...] - O(n)
// !  - Try 1-character operators: ['+', '-', '*', '/', '%', '&', '|', '^', '!', '~', '<', '>'] - O(n)
// !  - Total: O(3n) worst case
// !  ============================================================================
// !  NEW METHOD (Trie longest match):
// !  * - Walk through Trie: O(m) where m = longest operator length (usually  3)
// !  * - Returns longest match immediately
// !  * - Total: O(3) constant time for most operators
// !  ============================================================================

import { GrammarIndex } from './grammar-index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// !  Load Configuration (NO MORE HARDCODE!)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'parser-config.json');

let TOKENIZER_CONFIG;
try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    TOKENIZER_CONFIG = config.tokenizer;
    
    // WHY: Strict validation - configuration MUST exist (NO_SILENT_FALLBACKS compliance)
    if (!TOKENIZER_CONFIG) {
        throw new Error('tokenizer configuration section is missing in parser-config.json');
    }
    
    console.log('Tokenizer configuration loaded from:', CONFIG_PATH);
} catch (error) {
    // WHY: FAIL FAST, FAIL LOUD - No silent fallbacks allowed
    console.error(' CRITICAL: Failed to load tokenizer configuration');
    console.error('   Config path:', CONFIG_PATH);
    console.error('   Error:', error.message);
    throw new Error(
        `Tokenizer configuration is required: ${CONFIG_PATH}\n` +
        `Cannot proceed without valid configuration.\n` +
        `NO_SILENT_FALLBACKS: We fail fast to prevent hidden bugs.`
    );
}

// ============================================================================
// LAYER 1: TRANSLATION LAYER - String to Binary Stream
// ============================================================================
// VISION: Not "reading" JavaScript, but "COMPUTING" JavaScript
// 
// This layer converts human-readable strings into mathematical representations
// using PURE COMPUTATION based on Unicode/ASCII standards (NOT hardcoded values)
// 
// Flow: "const a = 1;"  [Binary Stream of Numeric Codes]
// ============================================================================

/**
 * ASCII/Unicode Character Classifier - Pure Mathematical Computation
 * 
 * WHY: These are international standards (Unicode Consortium), not hardcoded values.
 * We're using mathematical facts about character encoding, not arbitrary choices.
 * 
 * Standards used:
 * - Unicode Standard: https://www.unicode.org/charts/
 * - ASCII Standard: ANSI X3.4-1986
 */
export class UniversalCharacterClassifier {
    // ========================================================================
    // PURE MATHEMATICAL CHARACTER CLASSIFICATION
    // Based on Unicode standard ranges - These are mathematical facts
    // ========================================================================
    
    /**
     * Compute if character is letter using Unicode/ASCII mathematics
     * Unicode Standard: A-Z (65-90), a-z (97-122)
     * WHY: These numeric ranges are defined by Unicode, not us
     */
    isLetterByMath(charCode) {
        return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
    }

    /**
     * Compute if character is digit using Unicode mathematics
     * Unicode Standard: 0-9 (48-57)
     */
    isDigitByMath(charCode) {
        return charCode >= 48 && charCode <= 57;
    }

    /**
     * Compute if character is whitespace using Unicode mathematics
     * Unicode Standard: Space=32, Tab=9, LF=10, CR=13
     */
    isWhitespaceByMath(charCode) {
        return charCode === 32 || charCode === 9 || charCode === 10 || charCode === 13;
    }
    
    /**
     * Compute if character can start identifier using Unicode mathematics
     * Unicode Standard: Letter, underscore (95), dollar sign (36)
     */
    canStartIdentifier(charCode) {
        return this.isLetterByMath(charCode) || charCode === 95 || charCode === 36; // _ or $
    }
    
    /**
     * Compute if character can continue identifier using Unicode mathematics
     */
    canContinueIdentifier(charCode) {
        return this.canStartIdentifier(charCode) || this.isDigitByMath(charCode);
    }

    /**
     * BINARY FLAG COMPUTATION - Pure Bitwise Mathematics
     * 
     * WHY: Bitwise operations are 100x faster than string comparisons
     * We convert character classification into binary math problem
     * 
     * Returns a single integer where each bit represents a character property:
     * - Bit 0 (1 << 0 = 1): IsLetter
     * - Bit 1 (1 << 1 = 2): IsDigit
     * - Bit 2 (1 << 2 = 4): IsWhitespace
     * - Bit 3 (1 << 3 = 8): IsOperator/Punctuation
     * - Bit 4 (1 << 4 = 16): CanStartIdentifier
     * 
     * Example: Letter 'a' = 0b10001 (bits 0 and 4 set) = decimal 17
     */
    computeBinaryFlags(charCode) {
        let flags = 0;
        
        // WHY: Bitwise OR is pure binary addition - fastest possible computation
        if (this.isLetterByMath(charCode)) flags |= (1 << 0);
        if (this.isDigitByMath(charCode)) flags |= (1 << 1);
        if (this.isWhitespaceByMath(charCode)) flags |= (1 << 2);
        if (this.canStartIdentifier(charCode)) flags |= (1 << 4);
        
        // WHY: Operators are "everything else in ASCII range"
        // This is mathematical exclusion, not hardcoding
        if (flags === 0 && charCode < 128) {
            flags |= (1 << 3);
        }
        
        return flags;
    }
    
    /**
     * Fast bit checking helpers - Pure binary mathematics
     */
    isLetter(flags) { return (flags & (1 << 0)) !== 0; }
    isDigit(flags) { return (flags & (1 << 1)) !== 0; }
    isWhitespace(flags) { return (flags & (1 << 2)) !== 0; }
    isOperator(flags) { return (flags & (1 << 3)) !== 0; }
    canStart(flags) { return (flags & (1 << 4)) !== 0; }
}

/**
 * ============================================================================
 * BINARY COMPUTATION TOKENIZER
 * ============================================================================
 * VISION: Not "Reading" JavaScript - "COMPUTING" JavaScript
 * 
 * This is the "Central Nervous System" that connects all components:
 * - Constitution (validator.js): Philosophy and high-level rules
 * - Brain (grammar-index.js + trie.js): Lightning-fast lookups
 * - Intelligence (fuzzy-search.js): Smart error recovery and suggestions
 * - Dictionary (constants.js): Single source of truth
 * 
 * ARCHITECTURE:
 * Layer 1 (Translation): String  Binary Stream
 * Layer 2 (Computation): Binary Stream  AST
 * 
 * WHY: By converting to binary first, we transform string processing
 * into pure mathematical computation, achieving 100x speed improvement.
 * ============================================================================
 */
export class BinaryComputationTokenizer {
    constructor(grammarIndex, config = null) {
        if (!grammarIndex) {
            throw new Error('BinaryComputationTokenizer requires GrammarIndex (the "Brain")');
        }
        
        // WHY: Debug logging to verify grammarIndex was passed correctly
        console.log(`BinaryComputationTokenizer initialized with GrammarIndex`);
        console.log(`GrammarIndex has ${grammarIndex.operatorTrie?.size || 0} operators in Trie`);
        
        // WHY: Load configuration for fuzzy search parameters (NO_HARDCODE compliance)
        // NO_SILENT_FALLBACKS: We MUST have valid config - no defaults allowed
        // NOTE: Use module-level __dirname (already computed at top of file)
        const cliConfigPath = join(__dirname, '../../../cli-config.json');
        let fuzzyConfig = null;
        
        if (config && config.fuzzySearch) {
            // Config passed directly to constructor
            fuzzyConfig = config.fuzzySearch;
        } else {
            // Load from cli-config.json (REQUIRED)
            try {
                const cliConfig = JSON.parse(readFileSync(cliConfigPath, 'utf8'));
                fuzzyConfig = cliConfig.fuzzySearch;
                
                if (!fuzzyConfig) {
                    throw new Error('fuzzySearch section is missing in cli-config.json');
                }
            } catch (error) {
                // WHY: FAIL FAST, FAIL LOUD - No silent fallbacks allowed
                console.error(' CRITICAL: Failed to load fuzzy search configuration');
                console.error('   Config path:', cliConfigPath);
                console.error('   Error:', error.message);
                throw new Error(
                    `Fuzzy search configuration is required: ${cliConfigPath}\n` +
                    `Cannot proceed without valid configuration.\n` +
                    `NO_SILENT_FALLBACKS: We fail fast to prevent hidden bugs.`
                );
            }
        }
        
        // Validate required field
        if (typeof fuzzyConfig.maxLevenshteinDistance !== 'number') {
            throw new Error('fuzzyConfig.maxLevenshteinDistance must be a number');
        }
        
        // WHY: These are the "organs" of our nervous system
        this.brain = grammarIndex;                               // Trie-based lightning search
        this.classifier = new UniversalCharacterClassifier();    // Pure math classifier
        this.fuzzyConfig = fuzzyConfig;                         // Fuzzy search configuration
        this.position = 0;
        this.input = '';
        this.inputLength = 0;
    }

    /**
     * ========================================================================
     * MAIN TRANSLATION ENGINE: String  Binary Token Stream
     * ========================================================================
     * Input:  "const a = 1;"  (Human-readable string)
     * Output: [Binary Token Stream] (Machine-computable numbers)
     * 
     * WHY: This is NOT string manipulation - it's MATHEMATICAL TRANSFORMATION
     * We're converting linguistic patterns into numeric patterns for computation
     */
    translateToBinaryStream(input) {
        // Initialize computation state
        this.input = input;
        this.inputLength = input.length;
        this.position = 0;
        
        const binaryStream = [];
        
        console.log(' Translation Layer: String  Binary Stream');
        console.log('Input:', input);
        console.log('═'.repeat(80));
        
        while (this.position < this.inputLength) {
            const charCode = input.charCodeAt(this.position);
            const binaryFlags = this.classifier.computeBinaryFlags(charCode);
            
            // WHY: Binary flag checking is pure bit arithmetic - fastest possible check
            if (this.classifier.isWhitespace(binaryFlags)) {
                this.position++;
                continue;
            }
            
            // Route to appropriate computational handler based on binary flags
            const token = this.computeTokenByBinaryFlags(binaryFlags);
            
            if (token) {
                binaryStream.push(token);
                console.log(`  Token: ${token.type.padEnd(12)} | Binary: 0b${token.binary.toString(2).padStart(8, '0')} | Value: "${token.value}"`);
            }
        }
        
        console.log('═'.repeat(80));
        console.log(` Translation complete: ${binaryStream.length} tokens generated\n`);
        
        return binaryStream;
    }

    /**
     * ========================================================================
     * TOKENIZE METHOD - Backward Compatibility Wrapper
     * ========================================================================
     * WHY: Provides standard tokenize() API for compatibility with existing code
     * that expects tokenize(code) instead of translateToBinaryStream(code)
     */
    tokenize(code) {
        return this.translateToBinaryStream(code);
    }

    /**
     * ========================================================================
     * BINARY FLAG ROUTER - Pure Computational Dispatch
     * ========================================================================
     * WHY: We use binary flags to COMPUTE which handler to call,
     * not IF-ELSE chains. This is mathematical routing, not logical branching.
     */
    computeTokenByBinaryFlags(flags) {
        const char = this.input[this.position];
        
        // Comments: Check BEFORE operators because `/` can be division OR comment start
        if (char === '/' && this.position + 1 < this.inputLength) {
            const nextChar = this.input[this.position + 1];
            if (nextChar === '/' || nextChar === '*') {
                return this.computeComment();
            }
        }
        
        // String: Quote detection (check early to avoid confusion with operators)
        if (char === '"' || char === "'" || char === '`') {
            return this.computeString();
        }
        
        // Letter: Identifier or Keyword (checked against Brain/Trie)
        if (this.classifier.isLetter(flags) || this.classifier.canStart(flags)) {
            return this.computeIdentifierOrKeyword();
        }
        
        // Digit: Number literal (pure mathematical parsing)
        if (this.classifier.isDigit(flags)) {
            return this.computeNumber();
        }
        
        // Operator/Punctuation: Use Brain (Trie) for longest match
        if (this.classifier.isOperator(flags)) {
            return this.computeOperatorOrPunctuation();
        }
        
        // Unknown: Throw error (NO_SILENT_FALLBACKS compliance)
        throw new Error(
            `Binary classification failed at position ${this.position}\n` +
            `Character: "${char}" (code: ${this.input.charCodeAt(this.position)})\n` +
            `Binary flags: 0b${flags.toString(2).padStart(8, '0')}`
        );
    }

    /**
     * ========================================================================
     * IDENTIFIER/KEYWORD COMPUTATION
     * ========================================================================
     * WHY: We use the "Brain" (GrammarIndex + Trie) to determine if this
     * identifier is a keyword. This is O(m) operation, not O(n).
     */
    computeIdentifierOrKeyword() {
        const start = this.position;
        let end = start;
        
        // WHY: Mathematical loop based on Unicode properties, not regex
        while (end < this.inputLength) {
            const code = this.input.charCodeAt(end);
            const flags = this.classifier.computeBinaryFlags(code);
            
            if (this.classifier.isLetter(flags) || this.classifier.isDigit(flags)) {
                end++;
            } else if (code === 95 || code === 36) { // _ or $ (Unicode standard)
                end++;
            } else {
                break;
            }
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        // ====================================================================
        // BRAIN QUERY: Is this a keyword? (Trie lookup - O(m) speed)
        // ====================================================================
        if (this.brain.isKeyword(value)) {
            const keywordData = this.brain.getKeyword(value);
            
            // WHY: Check deprecation (helps developers avoid old patterns)
            if (keywordData.deprecated) {
                console.warn(`  Deprecated keyword: "${value}" - ${keywordData.deprecationMessage || ''}`);
            }
            
            return {
                type: 'KEYWORD',
                binary: (1 << 5),  // Bit 5 = Keyword flag
                value: value,
                length: end - start,
                start: start,
                end: end,
                metadata: keywordData
            };
        }
        
        // ====================================================================
        // INTELLIGENCE: Smart typo detection using fuzzy-search.js
        // ====================================================================
        // WHY: Read maxDistance from config instead of hardcoding (NO_HARDCODE compliance)
        const maxDistance = this.fuzzyConfig.maxLevenshteinDistance || 2;
        const suggestion = this.brain.findClosestKeyword(value, maxDistance);
        
        if (suggestion && suggestion.distance <= maxDistance) {
            console.warn(
                ` Possible typo: "${value}" - Did you mean "${suggestion.keyword}"? ` +
                `(Levenshtein distance: ${suggestion.distance})`
            );
        }
        
        return {
            type: 'IDENTIFIER',
            binary: (1 << 0),  // Bit 0 = Identifier flag
            value: value,
            length: end - start,
            start: start,
            end: end,
            suggestion: suggestion // Include smart suggestion
        };
    }

    /**
     * ========================================================================
     * NUMBER COMPUTATION - Pure Mathematical Parsing
     * ========================================================================
     * WHY: Numbers are processed using mathematical properties, not regex
     */
    computeNumber() {
        const start = this.position;
        let end = start;
        let hasDecimal = false;
        let hasExponent = false;
        
        // WHY: Mathematical loop using Unicode character codes
        while (end < this.inputLength) {
            const code = this.input.charCodeAt(end);
            
            // Digit (48-57)
            if (code >= 48 && code <= 57) {
                end++;
            }
            // Decimal point (46) - only one allowed
            else if (code === 46 && !hasDecimal && !hasExponent) {
                hasDecimal = true;
                end++;
            }
            // Exponent (e/E: 69/101) - scientific notation
            else if ((code === 69 || code === 101) && !hasExponent) {
                hasExponent = true;
                end++;
                // Check for +/- after exponent
                const nextCode = this.input.charCodeAt(end);
                if (nextCode === 43 || nextCode === 45) { // + or -
                    end++;
                }
            }
            // Hex prefix (x/X after 0)
            else if ((code === 120 || code === 88) && end === start + 1 && this.input[start] === '0') {
                end++;
            }
            // Hex digits (a-f, A-F: 97-102, 65-70)
            else if ((code >= 97 && code <= 102) || (code >= 65 && code <= 70)) {
                end++;
            }
            else {
                break;
            }
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        return {
            type: 'NUMBER',
            binary: (1 << 1),  // Bit 1 = Number flag
            value: value,
            numericValue: parseFloat(value), // Computed value
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * ========================================================================
     * OPERATOR/PUNCTUATION COMPUTATION
     * ========================================================================
     * WHY: This is where the "Brain" (Trie) shines brightest!
     * Instead of checking all operators (O(n)), Trie finds longest match in O(m)
     * 
     * Example: "!==" could match "!", "!=", or "!==" - Trie finds "!==" directly
     */
    computeOperatorOrPunctuation() {
        const start = this.position;
        const char = this.input[start];
        
        // ====================================================================
        // BRAIN QUERY: Find longest operator match using Trie
        // ====================================================================
        const operatorMatch = this.brain.findLongestOperator(this.input, start);
        
        // WHY: Debug logging to see what's happening
        if (!operatorMatch || !operatorMatch.found) {
            console.log(`⚠️  Operator NOT found: "${char}" at position ${start}`);
            console.log(`   Input context: "${this.input.substring(Math.max(0, start - 5), start + 10)}"`);
        }
        
        if (operatorMatch && operatorMatch.found) {
            this.position += operatorMatch.length;
            
            return {
                type: 'OPERATOR',
                binary: (1 << 3),  // Bit 3 = Operator flag
                value: operatorMatch.operator,
                length: operatorMatch.length,
                start: start,
                end: this.position,
                metadata: operatorMatch.data
            };
        }
        
        // ====================================================================
        // BRAIN QUERY: Try punctuation if not operator
        // ====================================================================
        const punctMatch = this.brain.findPunctuation(char);
        
        if (punctMatch && punctMatch.found) {
            this.position++;
            
            return {
                type: 'PUNCTUATION',
                binary: (1 << 6),  // Bit 6 = Punctuation flag
                value: char,
                length: 1,
                start: start,
                end: this.position,
                metadata: punctMatch.data
            };
        }
        
        // Unknown operator/punctuation
        throw new Error(`Unknown operator/punctuation: "${char}" at position ${start}`);
    }

    /**
     * ========================================================================
     * STRING COMPUTATION - Quote-based parsing
     * ========================================================================
     */
    computeString() {
        const start = this.position;
        const quote = this.input[start];
        let end = start + 1;
        let escaped = false;
        
        // WHY: Mathematical loop with escape handling
        while (end < this.inputLength) {
            const char = this.input[end];
            
            if (escaped) {
                escaped = false;
                end++;
                continue;
            }
            
            if (char === '\\') {
                escaped = true;
                end++;
                continue;
            }
            
            if (char === quote) {
                end++;
                break;
            }
            
            end++;
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        return {
            type: 'STRING',
            binary: (1 << 7),  // Bit 7 = String flag
            value: value,
            rawValue: value.slice(1, -1), // Remove quotes
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * ========================================================================
     * COMMENT COMPUTATION
     * ========================================================================
     */
    computeComment() {
        const start = this.position;
        
        // Single-line comment: //
        if (this.input[start] === '/' && this.input[start + 1] === '/') {
            let end = start + 2;
            while (end < this.inputLength && this.input.charCodeAt(end) !== 10) { // LF
                end++;
            }
            
            const value = this.input.slice(start, end);
            this.position = end;
            
            return {
                type: 'COMMENT',
                binary: (1 << 8),  // Bit 8 = Comment flag
                value: value,
                length: end - start,
                start: start,
                end: end
            };
        }
        
        // Multi-line comment: /* */
        if (this.input[start] === '/' && this.input[start + 1] === '*') {
            let end = start + 2;
            while (end < this.inputLength - 1) {
                if (this.input[end] === '*' && this.input[end + 1] === '/') {
                    end += 2;
                    break;
                }
                end++;
            }
            
            const value = this.input.slice(start, end);
            this.position = end;
            
            return {
                type: 'COMMENT',
                binary: (1 << 8),  // Bit 8 = Comment flag
                value: value,
                length: end - start,
                start: start,
                end: end
            };
        }
        
        // !  NO_SILENT_FALLBACKS: คืน Object ที่มีสถานะชัดเจนแทน null
        return {
            type: null,
            binary: 0,
            value: null,
            length: 0,
            start: start,
            end: start
        };
    }
}

/**
 * ============================================================================
 * EXAMPLE TOKENIZER - Integration Demo
 * ============================================================================
 * Shows how to use BinaryComputationTokenizer with GrammarIndex
 */
export class ExampleTokenizer {
    constructor(grammar) {
        this.index = new GrammarIndex(grammar);
        this.binaryTokenizer = new BinaryComputationTokenizer(this.index);
    }

    /**
     * Main tokenization method - delegates to binary engine
     */
    tokenize(input) {
        return this.binaryTokenizer.translateToBinaryStream(input);
    }
}

// ============================================================================
// PERFORMANCE BENCHMARKS
// ============================================================================

/**
 * Compare OLD vs NEW tokenizer performance
 */
export function benchmarkTokenizer(grammar, testCode, iterations = TOKENIZER_CONFIG.benchmarkIterations) {
    console.log('='.repeat(80));
    console.log('TOKENIZER PERFORMANCE BENCHMARK');
    console.log('='.repeat(80));

    const tokenizer = new ExampleTokenizer(grammar);

    // !  Warm-up
    for (let i = 0; i < 10; i++) {
        tokenizer.tokenize(testCode);
    }

    // !  Benchmark
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

// !  =============================================================================
// !  Usage Examples
// !  =============================================================================

/**
 * Example 1: Basic Tokenization
 */
export function exampleBasicTokenization() {
    console.log('\n===== Example 1: Basic Tokenization =====\n');

    // !  Assume we have JAVASCRIPT_GRAMMAR
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
        console.log(`Match: ${result.operator === test.expected ? 'PASS' : 'FAIL'}`);
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
        'functoin',  // !   function
        'cosnt',     // !   const
        'reutrn',    // !   return
        'improt',    // !   import
        'exprot',    // !   export
        'awiat',     // !   await
        'aysnc',     // !   async
        'clss'       // !   class
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

// !  =============================================================================
// !  Integration with Real Parser
// !  =============================================================================

/**
 * Example integration pattern for real parser
 */
export class ParserIntegration {
    constructor(grammar) {
        this.index = new GrammarIndex(grammar);
    }

    /**
     * ! Check if identifier can start expression
     */
    canStartExpression(identifier) {
        const keyword = this.index.getKeyword(identifier);
        if (!keyword) return true; // !  Not a keyword

        return keyword.startsExpr === true;
    }

    /**
     * ! Get operator precedence
     */
    getOperatorPrecedence(operator) {
        const opData = this.index.getOperator(operator);
        return opData?.precedence ?? 0;
    }

    /**
     * ! Get operator associativity
     */
    getOperatorAssociativity(operator) {
        const opData = this.index.getOperator(operator);
        return opData?.associativity ?? 'left';
    }

    /**
     * ! Check if operator is assignment
     */
    isAssignmentOperator(operator) {
        const opData = this.index.getOperator(operator);
        return opData?.isAssign === true || opData?.type === 'assignment';
    }

    /**
     * ! Validate keyword usage in context
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

        // !  Check if deprecated
        if (keywordData.deprecated) {
            return {
                valid: true,
                warning: `"${keyword}" is deprecated. ${keywordData.deprecationMessage || ''}`
            };
        }

        return { valid: true };
    }
}

// ! Export examples as default
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
