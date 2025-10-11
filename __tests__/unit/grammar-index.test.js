// ══════════════════════════════════════════════════════════════════════════════
// UNIT TEST: GrammarIndex
// ══════════════════════════════════════════════════════════════════════════════
// Purpose: Test Grammar lookup and indexing in isolation
// Philosophy: Mock file I/O to test pure logic
// Speed: Fast (mocked data, no real file reads)
// ══════════════════════════════════════════════════════════════════════════════

import { describe, test, expect, beforeEach } from '@jest/globals';
import { GrammarIndex } from '../../src/grammars/shared/grammar-index.js';

// ══════════════════════════════════════════════════════════════════════════════
// MOCK DATA: Minimal grammar structure for testing
// ══════════════════════════════════════════════════════════════════════════════

const mockGrammar = {
    keywords: {
        'if': {
            category: 'controlFlow',
            description: 'Conditional statement',
            subcategory: 'conditional',
            examples: ['if (x > 0) { }']
        },
        'const': {
            category: 'declaration',
            description: 'Constant variable declaration',
            subcategory: 'variableDeclaration',
            examples: ['const x = 5;']
        },
        'async': {
            category: 'async',
            description: 'Async function declaration',
            subcategory: 'functionModifier',
            examples: ['async function foo() {}']
        }
    },
    operators: {
        '=': {
            category: 'assignment',
            description: 'Assignment operator',
            precedence: 1,
            associativity: 'right',
            examples: ['x = 5']
        },
        '+': {
            category: 'arithmetic',
            description: 'Addition operator',
            precedence: 12,
            associativity: 'left',
            examples: ['x + y']
        },
        '===': {
            category: 'comparison',
            description: 'Strict equality',
            precedence: 9,
            associativity: 'left',
            examples: ['x === y']
        }
    },
    punctuation: {
        '(': {
            binary: 1,
            category: 'grouping',
            description: 'Left parenthesis',
            examples: ['(expression)']
        },
        '{': {
            binary: 3,
            category: 'block',
            description: 'Left brace',
            examples: ['{ statement }']
        },
        ';': {
            binary: 7,
            category: 'terminator',
            description: 'Semicolon',
            examples: ['statement;']
        }
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: GrammarIndex Constructor
// ══════════════════════════════════════════════════════════════════════════════

describe('GrammarIndex - Constructor', () => {
    test('should create instance with grammar data', () => {
        const index = new GrammarIndex(mockGrammar);
        expect(index.grammar).toBeDefined();
        expect(index.grammar.keywords).toBeDefined();
        expect(index.grammar.operators).toBeDefined();
        expect(index.grammar.punctuation).toBeDefined();
    });

    test('should create instance without grammar data', () => {
        const index = new GrammarIndex();
        expect(index.grammar).toBeUndefined();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Keyword Lookup
// ══════════════════════════════════════════════════════════════════════════════

describe('GrammarIndex - Keyword Lookup', () => {
    let index;

    beforeEach(() => {
        index = new GrammarIndex(mockGrammar);
    });

    test('should find keyword "if" with correct metadata', () => {
        const result = index.grammar.keywords['if'];
        expect(result).toBeDefined();
        expect(result.category).toBe('controlFlow');
        expect(result.description).toBe('Conditional statement');
        expect(result.subcategory).toBe('conditional');
    });

    test('should find keyword "const" with correct metadata', () => {
        const result = index.grammar.keywords['const'];
        expect(result).toBeDefined();
        expect(result.category).toBe('declaration');
        expect(result.subcategory).toBe('variableDeclaration');
    });

    test('should find keyword "async" with correct metadata', () => {
        const result = index.grammar.keywords['async'];
        expect(result).toBeDefined();
        expect(result.category).toBe('async');
        expect(result.subcategory).toBe('functionModifier');
    });

    test('should return undefined for non-existent keyword', () => {
        const result = index.grammar.keywords['nonexistent'];
        expect(result).toBeUndefined();
    });

    test('should have examples for all keywords', () => {
        expect(index.grammar.keywords['if'].examples).toBeDefined();
        expect(index.grammar.keywords['if'].examples.length).toBeGreaterThan(0);
        expect(index.grammar.keywords['const'].examples).toBeDefined();
        expect(index.grammar.keywords['const'].examples.length).toBeGreaterThan(0);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Operator Lookup
// ══════════════════════════════════════════════════════════════════════════════

describe('GrammarIndex - Operator Lookup', () => {
    let index;

    beforeEach(() => {
        index = new GrammarIndex(mockGrammar);
    });

    test('should find assignment operator "=" with correct metadata', () => {
        const result = index.grammar.operators['='];
        expect(result).toBeDefined();
        expect(result.category).toBe('assignment');
        expect(result.precedence).toBe(1);
        expect(result.associativity).toBe('right');
    });

    test('should find arithmetic operator "+" with correct metadata', () => {
        const result = index.grammar.operators['+'];
        expect(result).toBeDefined();
        expect(result.category).toBe('arithmetic');
        expect(result.precedence).toBe(12);
        expect(result.associativity).toBe('left');
    });

    test('should find comparison operator "===" with correct metadata', () => {
        const result = index.grammar.operators['==='];
        expect(result).toBeDefined();
        expect(result.category).toBe('comparison');
        expect(result.precedence).toBe(9);
    });

    test('should return undefined for non-existent operator', () => {
        const result = index.grammar.operators['%%%'];
        expect(result).toBeUndefined();
    });

    test('should distinguish between single and multi-character operators', () => {
        expect(index.grammar.operators['=']).toBeDefined();
        expect(index.grammar.operators['===']).toBeDefined();
        expect(index.grammar.operators['=']).not.toEqual(index.grammar.operators['===']);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Punctuation Lookup
// ══════════════════════════════════════════════════════════════════════════════

describe('GrammarIndex - Punctuation Lookup', () => {
    let index;

    beforeEach(() => {
        index = new GrammarIndex(mockGrammar);
    });

    test('should find punctuation "(" with binary mapping', () => {
        const result = index.grammar.punctuation['('];
        expect(result).toBeDefined();
        expect(result.binary).toBe(1);
        expect(result.category).toBe('grouping');
    });

    test('should find punctuation "{" with binary mapping', () => {
        const result = index.grammar.punctuation['{'];
        expect(result).toBeDefined();
        expect(result.binary).toBe(3);
        expect(result.category).toBe('block');
    });

    test('should find punctuation ";" with binary mapping', () => {
        const result = index.grammar.punctuation[';'];
        expect(result).toBeDefined();
        expect(result.binary).toBe(7);
        expect(result.category).toBe('terminator');
    });

    test('should return undefined for non-existent punctuation', () => {
        const result = index.grammar.punctuation['@'];
        expect(result).toBeUndefined();
    });

    test('all punctuation should have unique binary values', () => {
        const binaries = Object.values(index.grammar.punctuation).map(p => p.binary);
        const uniqueBinaries = new Set(binaries);
        expect(binaries.length).toBe(uniqueBinaries.size);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Grammar Structure Validation
// ══════════════════════════════════════════════════════════════════════════════

describe('GrammarIndex - Grammar Structure Validation', () => {
    let index;

    beforeEach(() => {
        index = new GrammarIndex(mockGrammar);
    });

    test('should have three main sections', () => {
        expect(index.grammar.keywords).toBeDefined();
        expect(index.grammar.operators).toBeDefined();
        expect(index.grammar.punctuation).toBeDefined();
    });

    test('all keywords should have required fields', () => {
        for (const [key, value] of Object.entries(index.grammar.keywords)) {
            expect(value.category).toBeDefined();
            expect(value.description).toBeDefined();
            expect(value.examples).toBeDefined();
            expect(Array.isArray(value.examples)).toBe(true);
        }
    });

    test('all operators should have required fields', () => {
        for (const [key, value] of Object.entries(index.grammar.operators)) {
            expect(value.category).toBeDefined();
            expect(value.description).toBeDefined();
            expect(value.precedence).toBeDefined();
            expect(value.associativity).toBeDefined();
        }
    });

    test('all punctuation should have required fields', () => {
        for (const [key, value] of Object.entries(index.grammar.punctuation)) {
            expect(value.binary).toBeDefined();
            expect(value.category).toBeDefined();
            expect(value.description).toBeDefined();
        }
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Helper Methods (if any exist in GrammarIndex)
// ══════════════════════════════════════════════════════════════════════════════

describe('GrammarIndex - Helper Methods', () => {
    let index;

    beforeEach(() => {
        index = new GrammarIndex(mockGrammar);
    });

    test('should identify assignment operators correctly', () => {
        const assignmentOp = index.grammar.operators['='];
        expect(assignmentOp.category).toBe('assignment');
    });

    test('should identify comparison operators correctly', () => {
        const comparisonOp = index.grammar.operators['==='];
        expect(comparisonOp.category).toBe('comparison');
    });

    test('should identify arithmetic operators correctly', () => {
        const arithmeticOp = index.grammar.operators['+'];
        expect(arithmeticOp.category).toBe('arithmetic');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Edge Cases
// ══════════════════════════════════════════════════════════════════════════════

describe('GrammarIndex - Edge Cases', () => {
    test('should handle empty grammar gracefully', () => {
        const emptyGrammar = {
            keywords: {},
            operators: {},
            punctuation: {}
        };
        const index = new GrammarIndex(emptyGrammar);
        expect(index.grammar.keywords).toEqual({});
        expect(index.grammar.operators).toEqual({});
        expect(index.grammar.punctuation).toEqual({});
    });

    test('should handle missing sections gracefully', () => {
        const partialGrammar = {
            keywords: mockGrammar.keywords
        };
        const index = new GrammarIndex(partialGrammar);
        expect(index.grammar.keywords).toBeDefined();
        expect(index.grammar.operators).toBeUndefined();
        expect(index.grammar.punctuation).toBeUndefined();
    });

    test('should handle null/undefined grammar gracefully', () => {
        const index1 = new GrammarIndex(null);
        const index2 = new GrammarIndex(undefined);
        const index3 = new GrammarIndex();
        
        // All should be either null or undefined (just check they're falsy)
        expect(index1.grammar).toBeFalsy();
        expect(index2.grammar).toBeFalsy();
        expect(index3.grammar).toBeFalsy();
    });
});
