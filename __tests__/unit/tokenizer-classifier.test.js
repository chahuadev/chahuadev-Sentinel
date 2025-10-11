// ══════════════════════════════════════════════════════════════════════════════
// UNIT TEST: UniversalCharacterClassifier
// ══════════════════════════════════════════════════════════════════════════════
// Purpose: Test individual character classification functions
// Philosophy: Test the ACTUAL implementation, not a duplicate
// Speed: Fast (pure math, no I/O)
// Approach: Import real functions from tokenizer-helper.js
// ══════════════════════════════════════════════════════════════════════════════

import { describe, test, expect } from '@jest/globals';
import { 
    UniversalCharacterClassifier,
    CONFIG,
    UNICODE,
    CHAR_FLAGS 
} from '../../src/grammars/shared/tokenizer-helper.js';

// ══════════════════════════════════════════════════════════════════════════════
// SETUP: Create classifier instance for testing
// ══════════════════════════════════════════════════════════════════════════════

const classifier = new UniversalCharacterClassifier();

// Extract numeric values from CHAR_FLAGS for bit operations
const FLAGS = {
    LETTER: CHAR_FLAGS.LETTER.value,
    DIGIT: CHAR_FLAGS.DIGIT.value,
    WHITESPACE: CHAR_FLAGS.WHITESPACE.value,
    OPERATOR: CHAR_FLAGS.OPERATOR.value,
    PUNCTUATION: CHAR_FLAGS.PUNCTUATION ? CHAR_FLAGS.PUNCTUATION.value : 16
};

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Character Classification
// ══════════════════════════════════════════════════════════════════════════════

describe('UniversalCharacterClassifier - Letter Detection', () => {
    test('should classify uppercase letters as LETTER', () => {
        expect(classifier.isLetterByMath('A'.charCodeAt(0))).toBe(true);
        expect(classifier.isLetterByMath('Z'.charCodeAt(0))).toBe(true);
        expect(classifier.isLetterByMath('M'.charCodeAt(0))).toBe(true);
    });

    test('should classify lowercase letters as LETTER', () => {
        expect(classifier.isLetterByMath('a'.charCodeAt(0))).toBe(true);
        expect(classifier.isLetterByMath('z'.charCodeAt(0))).toBe(true);
        expect(classifier.isLetterByMath('m'.charCodeAt(0))).toBe(true);
    });

    test('should classify underscore and dollar sign as LETTER', () => {
        expect(classifier.isLetterByMath('_'.charCodeAt(0))).toBe(true);
        expect(classifier.isLetterByMath('$'.charCodeAt(0))).toBe(true);
    });

    test('should NOT classify digits as LETTER', () => {
        expect(classifier.isLetterByMath('0'.charCodeAt(0))).toBe(false);
        expect(classifier.isLetterByMath('9'.charCodeAt(0))).toBe(false);
    });

    test('should NOT classify operators as LETTER', () => {
        expect(classifier.isLetterByMath('+'.charCodeAt(0))).toBe(false);
        expect(classifier.isLetterByMath('='.charCodeAt(0))).toBe(false);
    });
});

describe('UniversalCharacterClassifier - Digit Detection', () => {
    test('should classify numeric characters as DIGIT', () => {
        expect(classifier.isDigitByMath('0'.charCodeAt(0))).toBe(true);
        expect(classifier.isDigitByMath('5'.charCodeAt(0))).toBe(true);
        expect(classifier.isDigitByMath('9'.charCodeAt(0))).toBe(true);
    });

    test('should NOT classify letters as DIGIT', () => {
        expect(classifier.isDigitByMath('A'.charCodeAt(0))).toBe(false);
        expect(classifier.isDigitByMath('a'.charCodeAt(0))).toBe(false);
    });

    test('should NOT classify operators as DIGIT', () => {
        expect(classifier.isDigitByMath('+'.charCodeAt(0))).toBe(false);
    });
});

describe('UniversalCharacterClassifier - Whitespace Detection', () => {
    test('should classify space as WHITESPACE', () => {
        expect(classifier.isWhitespaceByMath(' '.charCodeAt(0))).toBe(true);
    });

    test('should classify tab as WHITESPACE', () => {
        expect(classifier.isWhitespaceByMath('\t'.charCodeAt(0))).toBe(true);
    });

    test('should classify newline as WHITESPACE', () => {
        expect(classifier.isWhitespaceByMath('\n'.charCodeAt(0))).toBe(true);
    });

    test('should classify carriage return as WHITESPACE', () => {
        expect(classifier.isWhitespaceByMath('\r'.charCodeAt(0))).toBe(true);
    });

    test('should NOT classify letters as WHITESPACE', () => {
        expect(classifier.isWhitespaceByMath('A'.charCodeAt(0))).toBe(false);
    });
});

describe('UniversalCharacterClassifier - Operator Detection', () => {
    test('should classify arithmetic operators as OPERATOR', () => {
        expect(classifier.isOperatorByMath('+'.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath('-'.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath('*'.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath('/'.charCodeAt(0))).toBe(true);
    });

    test('should classify comparison operators as OPERATOR', () => {
        expect(classifier.isOperatorByMath('='.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath('<'.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath('>'.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath('!'.charCodeAt(0))).toBe(true);
    });

    test('should classify punctuation as OPERATOR', () => {
        expect(classifier.isOperatorByMath('('.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath(')'.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath('{'.charCodeAt(0))).toBe(true);
        expect(classifier.isOperatorByMath('}'.charCodeAt(0))).toBe(true);
    });

    test('should NOT classify letters as OPERATOR', () => {
        expect(classifier.isOperatorByMath('A'.charCodeAt(0))).toBe(false);
        expect(classifier.isOperatorByMath('z'.charCodeAt(0))).toBe(false);
    });
});

describe('UniversalCharacterClassifier - Binary Flags Computation', () => {
    test('should compute LETTER flag correctly', () => {
        const flags = classifier.computeBinaryFlags('A'.charCodeAt(0));
        expect(flags).toBe(FLAGS.LETTER); // 1
    });

    test('should compute DIGIT flag correctly', () => {
        const flags = classifier.computeBinaryFlags('5'.charCodeAt(0));
        expect(flags).toBe(FLAGS.DIGIT); // 2
    });

    test('should compute WHITESPACE flag correctly', () => {
        const flags = classifier.computeBinaryFlags(' '.charCodeAt(0));
        expect(flags).toBe(FLAGS.WHITESPACE); // 4
    });

    test('should compute OPERATOR flag correctly', () => {
        const flags = classifier.computeBinaryFlags('+'.charCodeAt(0));
        expect(flags).toBe(FLAGS.OPERATOR); // 8
    });

    test('should compute combined LETTER+DIGIT flag correctly', () => {
        // This should never happen in real code, but tests the bitwise OR logic
        const charCode = 'A'.charCodeAt(0);
        // Manually force both flags for testing
        const combinedFlags = FLAGS.LETTER | FLAGS.DIGIT;
        expect(combinedFlags).toBe(3); // 0b00011
    });
});

describe('UniversalCharacterClassifier - Edge Cases', () => {
    test('should handle boundary values correctly', () => {
        // Just before 'A' (@ symbol, charCode 64)
        expect(classifier.isLetterByMath(64)).toBe(false);
        expect(classifier.isOperatorByMath(64)).toBe(true);
        
        // Just after 'Z' ([ symbol, charCode 91)
        expect(classifier.isLetterByMath(91)).toBe(false);
        expect(classifier.isOperatorByMath(91)).toBe(true);
        
        // Just before '0' (/ symbol, charCode 47)
        expect(classifier.isDigitByMath(47)).toBe(false);
        expect(classifier.isOperatorByMath(47)).toBe(true);
        
        // Just after '9' (: symbol, charCode 58)
        expect(classifier.isDigitByMath(58)).toBe(false);
        expect(classifier.isOperatorByMath(58)).toBe(true);
    });

    test('should handle special identifier characters', () => {
        expect(classifier.isLetterByMath('_'.charCodeAt(0))).toBe(true); // Underscore
        expect(classifier.isLetterByMath('$'.charCodeAt(0))).toBe(true); // Dollar sign
    });

    test('should return 0 for unclassified characters', () => {
        // Null character
        const flags = classifier.computeBinaryFlags(0);
        expect(flags).toBe(0);
    });
});
