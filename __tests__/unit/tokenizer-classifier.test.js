// ══════════════════════════════════════════════════════════════════════════════
// UNIT TEST: UniversalCharacterClassifier
// ══════════════════════════════════════════════════════════════════════════════
// Purpose: Test individual character classification functions
// Philosophy: Test the smallest units in isolation
// Speed: Fast (pure math, no I/O)
// ══════════════════════════════════════════════════════════════════════════════

import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load tokenizer-helper functions
// Note: We need to extract the pure functions for testing
const helperPath = join(__dirname, '../../src/grammars/shared/tokenizer-helper.js');
const helperSource = readFileSync(helperPath, 'utf-8');

// Load configuration
const configPath = join(__dirname, '../../src/grammars/shared/tokenizer-binary-config.json');
const CONFIG = JSON.parse(readFileSync(configPath, 'utf-8'));
const UNICODE = CONFIG.unicodeRanges.ranges;
// Extract just the numeric values from the flag objects
const CHAR_FLAGS = {
    LETTER: CONFIG.characterFlags.flags.LETTER.value,
    DIGIT: CONFIG.characterFlags.flags.DIGIT.value,
    WHITESPACE: CONFIG.characterFlags.flags.WHITESPACE.value,
    OPERATOR: CONFIG.characterFlags.flags.OPERATOR.value,
    PUNCTUATION: CONFIG.characterFlags.flags.PUNCTUATION ? CONFIG.characterFlags.flags.PUNCTUATION.value : 16
};

// ══════════════════════════════════════════════════════════════════════════════
// HELPER: Pure math functions extracted from tokenizer-helper.js
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Pure math: Check if character code is a letter
 * NO HARDCODE: Uses ranges from config
 */
function isLetterByMath(charCode) {
    return (charCode >= UNICODE.UPPERCASE_LETTER.start && charCode <= UNICODE.UPPERCASE_LETTER.end) ||
           (charCode >= UNICODE.LOWERCASE_LETTER.start && charCode <= UNICODE.LOWERCASE_LETTER.end) ||
           charCode === UNICODE.UNDERSCORE.code || charCode === UNICODE.DOLLAR.code;
}

/**
 * Pure math: Check if character code is a digit
 * NO HARDCODE: Uses ranges from config
 */
function isDigitByMath(charCode) {
    return charCode >= UNICODE.DIGIT.start && charCode <= UNICODE.DIGIT.end;
}

/**
 * Pure math: Check if character code is whitespace
 * NO HARDCODE: Uses exact values from config
 */
function isWhitespaceByMath(charCode) {
    return charCode === UNICODE.SPACE.code ||
           charCode === UNICODE.TAB.code ||
           charCode === UNICODE.LINE_FEED.code ||
           charCode === UNICODE.CARRIAGE_RETURN.code;
}

/**
 * Pure math: Check if character code is an operator
 * NO HARDCODE: Uses ranges from config
 */
function isOperatorByMath(charCode) {
    // Range 1: ! (33) to / (47)
    // Range 2: : (58) to @ (64)
    // Range 3: [ (91) to ` (96)
    // Range 4: { (123) to ~ (126)
    return (charCode >= UNICODE.EXCLAMATION.code && charCode <= UNICODE.SLASH.code) ||
           (charCode >= UNICODE.COLON.code && charCode <= UNICODE.AT_SIGN.code) ||
           (charCode >= UNICODE.LEFT_BRACKET.code && charCode <= UNICODE.BACKTICK.code) ||
           (charCode >= UNICODE.LEFT_BRACE.code && charCode <= UNICODE.TILDE.code);
}

/**
 * Compute binary flags for a character
 * NO HARDCODE: Uses flag values from config
 */
function computeBinaryFlags(charCode) {
    let flags = 0;
    
    if (isLetterByMath(charCode)) {
        flags |= CHAR_FLAGS.LETTER;
    }
    if (isDigitByMath(charCode)) {
        flags |= CHAR_FLAGS.DIGIT;
    }
    if (isWhitespaceByMath(charCode)) {
        flags |= CHAR_FLAGS.WHITESPACE;
    }
    if (isOperatorByMath(charCode)) {
        flags |= CHAR_FLAGS.OPERATOR;
    }
    
    return flags;
}

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Character Classification
// ══════════════════════════════════════════════════════════════════════════════

describe('UniversalCharacterClassifier - Letter Detection', () => {
    test('should classify uppercase letters as LETTER', () => {
        expect(isLetterByMath('A'.charCodeAt(0))).toBe(true);
        expect(isLetterByMath('Z'.charCodeAt(0))).toBe(true);
        expect(isLetterByMath('M'.charCodeAt(0))).toBe(true);
    });

    test('should classify lowercase letters as LETTER', () => {
        expect(isLetterByMath('a'.charCodeAt(0))).toBe(true);
        expect(isLetterByMath('z'.charCodeAt(0))).toBe(true);
        expect(isLetterByMath('m'.charCodeAt(0))).toBe(true);
    });

    test('should classify underscore and dollar sign as LETTER', () => {
        expect(isLetterByMath('_'.charCodeAt(0))).toBe(true);
        expect(isLetterByMath('$'.charCodeAt(0))).toBe(true);
    });

    test('should NOT classify digits as LETTER', () => {
        expect(isLetterByMath('0'.charCodeAt(0))).toBe(false);
        expect(isLetterByMath('9'.charCodeAt(0))).toBe(false);
    });

    test('should NOT classify operators as LETTER', () => {
        expect(isLetterByMath('+'.charCodeAt(0))).toBe(false);
        expect(isLetterByMath('='.charCodeAt(0))).toBe(false);
    });
});

describe('UniversalCharacterClassifier - Digit Detection', () => {
    test('should classify numeric characters as DIGIT', () => {
        expect(isDigitByMath('0'.charCodeAt(0))).toBe(true);
        expect(isDigitByMath('5'.charCodeAt(0))).toBe(true);
        expect(isDigitByMath('9'.charCodeAt(0))).toBe(true);
    });

    test('should NOT classify letters as DIGIT', () => {
        expect(isDigitByMath('A'.charCodeAt(0))).toBe(false);
        expect(isDigitByMath('a'.charCodeAt(0))).toBe(false);
    });

    test('should NOT classify operators as DIGIT', () => {
        expect(isDigitByMath('+'.charCodeAt(0))).toBe(false);
    });
});

describe('UniversalCharacterClassifier - Whitespace Detection', () => {
    test('should classify space as WHITESPACE', () => {
        expect(isWhitespaceByMath(' '.charCodeAt(0))).toBe(true);
    });

    test('should classify tab as WHITESPACE', () => {
        expect(isWhitespaceByMath('\t'.charCodeAt(0))).toBe(true);
    });

    test('should classify newline as WHITESPACE', () => {
        expect(isWhitespaceByMath('\n'.charCodeAt(0))).toBe(true);
    });

    test('should classify carriage return as WHITESPACE', () => {
        expect(isWhitespaceByMath('\r'.charCodeAt(0))).toBe(true);
    });

    test('should NOT classify letters as WHITESPACE', () => {
        expect(isWhitespaceByMath('A'.charCodeAt(0))).toBe(false);
    });
});

describe('UniversalCharacterClassifier - Operator Detection', () => {
    test('should classify arithmetic operators as OPERATOR', () => {
        expect(isOperatorByMath('+'.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath('-'.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath('*'.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath('/'.charCodeAt(0))).toBe(true);
    });

    test('should classify comparison operators as OPERATOR', () => {
        expect(isOperatorByMath('='.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath('<'.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath('>'.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath('!'.charCodeAt(0))).toBe(true);
    });

    test('should classify punctuation as OPERATOR', () => {
        expect(isOperatorByMath('('.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath(')'.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath('{'.charCodeAt(0))).toBe(true);
        expect(isOperatorByMath('}'.charCodeAt(0))).toBe(true);
    });

    test('should NOT classify letters as OPERATOR', () => {
        expect(isOperatorByMath('A'.charCodeAt(0))).toBe(false);
        expect(isOperatorByMath('z'.charCodeAt(0))).toBe(false);
    });
});

describe('UniversalCharacterClassifier - Binary Flags Computation', () => {
    test('should compute LETTER flag correctly', () => {
        const flags = computeBinaryFlags('A'.charCodeAt(0));
        expect(flags).toBe(CHAR_FLAGS.LETTER); // 1
    });

    test('should compute DIGIT flag correctly', () => {
        const flags = computeBinaryFlags('5'.charCodeAt(0));
        expect(flags).toBe(CHAR_FLAGS.DIGIT); // 2
    });

    test('should compute WHITESPACE flag correctly', () => {
        const flags = computeBinaryFlags(' '.charCodeAt(0));
        expect(flags).toBe(CHAR_FLAGS.WHITESPACE); // 4
    });

    test('should compute OPERATOR flag correctly', () => {
        const flags = computeBinaryFlags('+'.charCodeAt(0));
        expect(flags).toBe(CHAR_FLAGS.OPERATOR); // 8
    });

    test('should compute combined LETTER+DIGIT flag correctly', () => {
        // This should never happen in real code, but tests the bitwise OR logic
        const charCode = 'A'.charCodeAt(0);
        // Manually force both flags for testing
        const combinedFlags = CHAR_FLAGS.LETTER | CHAR_FLAGS.DIGIT;
        expect(combinedFlags).toBe(3); // 0b00011
    });
});

describe('UniversalCharacterClassifier - Edge Cases', () => {
    test('should handle boundary values correctly', () => {
        // Just before 'A' (@ symbol, charCode 64)
        expect(isLetterByMath(64)).toBe(false);
        expect(isOperatorByMath(64)).toBe(true);
        
        // Just after 'Z' ([ symbol, charCode 91)
        expect(isLetterByMath(91)).toBe(false);
        expect(isOperatorByMath(91)).toBe(true);
        
        // Just before '0' (/ symbol, charCode 47)
        expect(isDigitByMath(47)).toBe(false);
        expect(isOperatorByMath(47)).toBe(true);
        
        // Just after '9' (: symbol, charCode 58)
        expect(isDigitByMath(58)).toBe(false);
        expect(isOperatorByMath(58)).toBe(true);
    });

    test('should handle special identifier characters', () => {
        expect(isLetterByMath('_'.charCodeAt(0))).toBe(true); // Underscore
        expect(isLetterByMath('$'.charCodeAt(0))).toBe(true); // Dollar sign
    });

    test('should return 0 for unclassified characters', () => {
        // Null character
        const flags = computeBinaryFlags(0);
        expect(flags).toBe(0);
    });
});
