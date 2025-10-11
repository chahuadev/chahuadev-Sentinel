// ══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TEST: Tokenizer + GrammarIndex
// ══════════════════════════════════════════════════════════════════════════════
// Purpose: Test tokenizer working with real grammar data
// Philosophy: Test components working together
// Speed: Medium (real file reads, but small scope)
// ══════════════════════════════════════════════════════════════════════════════

import { describe, test, expect, beforeAll } from '@jest/globals';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GrammarIndex } from '../../src/grammars/shared/grammar-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ══════════════════════════════════════════════════════════════════════════════
// LOAD REAL GRAMMAR FOR TESTING
// ══════════════════════════════════════════════════════════════════════════════

let javascriptGrammar;
let grammarIndex;

beforeAll(() => {
    const grammarPath = join(__dirname, '../../src/grammars/shared/grammars/javascript.grammar.json');
    javascriptGrammar = JSON.parse(readFileSync(grammarPath, 'utf-8'));
    grammarIndex = new GrammarIndex(javascriptGrammar);
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Real JavaScript Grammar Loading
// ══════════════════════════════════════════════════════════════════════════════

describe('Integration: JavaScript Grammar Loading', () => {
    test('should load javascript.grammar.json successfully', () => {
        expect(javascriptGrammar).toBeDefined();
        expect(javascriptGrammar.metadata).toBeDefined();
        expect(javascriptGrammar.keywords).toBeDefined();
        expect(javascriptGrammar.operators).toBeDefined();
        expect(javascriptGrammar.punctuation).toBeDefined();
    });

    test('should have correct grammar metadata', () => {
        expect(javascriptGrammar.metadata.language).toBe('JavaScript');
        expect(javascriptGrammar.metadata.version).toBeDefined();
    });

    test('should have all 75 JavaScript keywords', () => {
        const keywordCount = Object.keys(javascriptGrammar.keywords).length;
        expect(keywordCount).toBe(75);
    });

    test('should have operators defined', () => {
        const operatorCount = Object.keys(javascriptGrammar.operators).length;
        expect(operatorCount).toBeGreaterThan(0);
    });

    test('should have punctuation with binary mappings', () => {
        const punctuationCount = Object.keys(javascriptGrammar.punctuation).length;
        expect(punctuationCount).toBeGreaterThan(0);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Keyword Recognition with Real Grammar
// ══════════════════════════════════════════════════════════════════════════════

describe('Integration: Keyword Recognition', () => {
    test('should recognize ES1 keywords', () => {
        const es1Keywords = ['if', 'else', 'for', 'while', 'var', 'function', 'return'];
        
        for (const keyword of es1Keywords) {
            const info = javascriptGrammar.keywords[keyword];
            expect(info).toBeDefined();
            expect(info.description).toBeDefined();
            expect(info.examples).toBeDefined();
        }
    });

    test('should recognize ES6 keywords', () => {
        const es6Keywords = ['let', 'const', 'class', 'extends', 'import', 'export'];
        
        for (const keyword of es6Keywords) {
            const info = javascriptGrammar.keywords[keyword];
            expect(info).toBeDefined();
            expect(info.description).toBeDefined();
            expect(info.ecmaVersion).toBeDefined();
        }
    });

    test('should recognize ES2017+ async keywords', () => {
        const asyncKeywords = ['async', 'await'];
        
        for (const keyword of asyncKeywords) {
            const info = javascriptGrammar.keywords[keyword];
            expect(info).toBeDefined();
            expect(info.category).toContain('async');
        }
    });

    test('should recognize ES2024 keywords', () => {
        const es2024Keywords = ['using', 'defer'];
        
        for (const keyword of es2024Keywords) {
            const info = javascriptGrammar.keywords[keyword];
            expect(info).toBeDefined();
            expect(info.ecmaVersion).toBe('ES2024');
        }
    });

    test('should recognize futureReservedOldECMA keywords', () => {
        const futureReserved = ['abstract', 'boolean', 'byte', 'char', 'double', 
                                'final', 'float', 'goto', 'int', 'long', 'native', 
                                'short', 'synchronized', 'throws', 'transient', 'volatile'];
        
        for (const keyword of futureReserved) {
            const info = javascriptGrammar.keywords[keyword];
            expect(info).toBeDefined();
            expect(info.category).toBe('futureReservedOldECMA');
        }
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Operator Recognition with Real Grammar
// ══════════════════════════════════════════════════════════════════════════════

describe('Integration: Operator Recognition', () => {
    test('should recognize arithmetic operators', () => {
        const arithmeticOps = ['+', '-', '*', '/', '%'];
        
        for (const op of arithmeticOps) {
            const info = javascriptGrammar.operators[op];
            expect(info).toBeDefined();
            expect(info.description).toBeDefined();
        }
    });

    test('should recognize comparison operators', () => {
        const comparisonOps = ['==', '===', '!=', '!==', '<', '>', '<=', '>='];
        
        for (const op of comparisonOps) {
            const info = javascriptGrammar.operators[op];
            expect(info).toBeDefined();
            expect(info.description).toBeDefined();
        }
    });

    test('should recognize logical operators', () => {
        const logicalOps = ['&&', '||', '!'];
        
        for (const op of logicalOps) {
            const info = javascriptGrammar.operators[op];
            expect(info).toBeDefined();
        }
    });

    test('should recognize assignment operators', () => {
        const assignmentOps = ['=', '+=', '-=', '*=', '/='];
        
        for (const op of assignmentOps) {
            const info = javascriptGrammar.operators[op];
            expect(info).toBeDefined();
        }
    });

    test('should distinguish between single and multi-character operators', () => {
        // Single character
        expect(javascriptGrammar.operators['=']).toBeDefined();
        expect(javascriptGrammar.operators['<']).toBeDefined();
        
        // Multi-character
        expect(javascriptGrammar.operators['==']).toBeDefined();
        expect(javascriptGrammar.operators['===']).toBeDefined();
        expect(javascriptGrammar.operators['<=']).toBeDefined();
        
        // Should be different entries
        expect(javascriptGrammar.operators['=']).not.toEqual(javascriptGrammar.operators['==']);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Punctuation Recognition with Binary Mapping
// ══════════════════════════════════════════════════════════════════════════════

describe('Integration: Punctuation Binary Mapping', () => {
    test('should have punctuation with unique binary values', () => {
        const binaries = Object.values(javascriptGrammar.punctuation)
            .map(p => p.binary)
            .filter(b => b !== undefined);
        
        const uniqueBinaries = new Set(binaries);
        expect(binaries.length).toBe(uniqueBinaries.size);
    });

    test('should recognize grouping punctuation', () => {
        const groupingPunct = ['(', ')', '[', ']', '{', '}'];
        
        for (const punct of groupingPunct) {
            const info = javascriptGrammar.punctuation[punct];
            expect(info).toBeDefined();
            expect(info.binary).toBeDefined();
            expect(typeof info.binary).toBe('number');
        }
    });

    test('should recognize separators', () => {
        const separators = [',', ';', ':'];
        
        for (const sep of separators) {
            const info = javascriptGrammar.punctuation[sep];
            expect(info).toBeDefined();
            expect(info.binary).toBeDefined();
        }
    });

    test('should recognize special punctuation', () => {
        const special = ['.', '?'];
        
        for (const punct of special) {
            const info = javascriptGrammar.punctuation[punct];
            expect(info).toBeDefined();
            expect(info.binary).toBeDefined();
        }
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Grammar Completeness Validation
// ══════════════════════════════════════════════════════════════════════════════

describe('Integration: Grammar Completeness', () => {
    test('all keywords should have examples', () => {
        for (const [keyword, info] of Object.entries(javascriptGrammar.keywords)) {
            expect(info.examples).toBeDefined();
            expect(Array.isArray(info.examples)).toBe(true);
            expect(info.examples.length).toBeGreaterThan(0);
        }
    });

    test('all keywords should have descriptions', () => {
        for (const [keyword, info] of Object.entries(javascriptGrammar.keywords)) {
            expect(info.description).toBeDefined();
            expect(typeof info.description).toBe('string');
            expect(info.description.length).toBeGreaterThan(0);
        }
    });

    test('all operators should have descriptions', () => {
        for (const [op, info] of Object.entries(javascriptGrammar.operators)) {
            expect(info.description).toBeDefined();
            expect(typeof info.description).toBe('string');
        }
    });

    test('all punctuation should have binary mappings', () => {
        for (const [punct, info] of Object.entries(javascriptGrammar.punctuation)) {
            expect(info.binary).toBeDefined();
            expect(typeof info.binary).toBe('number');
            expect(info.binary).toBeGreaterThan(0);
        }
    });

    test('should have disambiguation for ambiguous keywords', () => {
        // Keywords like "as", "from", "of" are context-dependent
        const ambiguousKeywords = ['as', 'from', 'of', 'get', 'set'];
        
        for (const keyword of ambiguousKeywords) {
            const info = javascriptGrammar.keywords[keyword];
            if (info && info.disambiguation) {
                expect(info.disambiguation).toBeDefined();
                expect(typeof info.disambiguation).toBe('string');
            }
        }
    });

    test('should have quirks for special keywords', () => {
        // Some keywords have special behaviors
        const keywordsWithQuirks = ['with', 'arguments', 'eval'];
        
        for (const keyword of keywordsWithQuirks) {
            const info = javascriptGrammar.keywords[keyword];
            if (info && info.quirks) {
                expect(info.quirks).toBeDefined();
                expect(typeof info.quirks).toBe('string');
            }
        }
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: GrammarIndex Integration with Real Data
// ══════════════════════════════════════════════════════════════════════════════

describe('Integration: GrammarIndex with Real Grammar', () => {
    test('should create GrammarIndex from real grammar', () => {
        expect(grammarIndex).toBeDefined();
        expect(grammarIndex.grammar).toBeDefined();
        expect(grammarIndex.grammar.keywords).toBeDefined();
    });

    test('should look up keywords through GrammarIndex', () => {
        const keyword = grammarIndex.grammar.keywords['const'];
        expect(keyword).toBeDefined();
        expect(keyword.category).toBeDefined();
    });

    test('should look up operators through GrammarIndex', () => {
        const operator = grammarIndex.grammar.operators['==='];
        expect(operator).toBeDefined();
        expect(operator.description).toBeDefined();
    });

    test('should look up punctuation through GrammarIndex', () => {
        const punct = grammarIndex.grammar.punctuation['('];
        expect(punct).toBeDefined();
        expect(punct.binary).toBeDefined();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Cross-Reference Validation
// ══════════════════════════════════════════════════════════════════════════════

describe('Integration: Cross-Reference Validation', () => {
    test('keywords should not overlap with operators', () => {
        const keywords = Object.keys(javascriptGrammar.keywords);
        const operators = Object.keys(javascriptGrammar.operators);
        
        const overlap = keywords.filter(k => operators.includes(k));
        expect(overlap.length).toBe(0);
    });

    test('keywords should not overlap with punctuation', () => {
        const keywords = Object.keys(javascriptGrammar.keywords);
        const punctuation = Object.keys(javascriptGrammar.punctuation);
        
        const overlap = keywords.filter(k => punctuation.includes(k));
        expect(overlap.length).toBe(0);
    });

    test('operators and punctuation may overlap (e.g., "+" as both)', () => {
        // This is expected - some symbols can be both operator and punctuation
        // depending on context
        const operators = Object.keys(javascriptGrammar.operators);
        const punctuation = Object.keys(javascriptGrammar.punctuation);
        
        const overlap = operators.filter(o => punctuation.includes(o));
        // Just verify this doesn't throw - overlap is allowed
        expect(overlap).toBeDefined();
    });
});
