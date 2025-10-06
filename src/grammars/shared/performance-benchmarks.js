// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// @contact chahuadev@gmail.com
// ======================================================================
// ChahuadevR Engine Grammar Dictionary - Core Language Support
// ============================================================================
// Performance Benchmark Tests
// เปรียบเทียบประสิทธิภาพของ Grammar Index System
// ============================================================================
// Test Categories:
// 1. Index Building Time
// 2. Lookup Performance (Map vs Object)
// 3. Longest Match Performance (Trie vs Loop)
// 4. Fuzzy Search Performance
// 5. Memory Usage
// ============================================================================

import { performance } from 'perf_hooks';
import { GrammarIndex } from './grammar-index.js';
import { Trie } from './trie.js';
import { findTypoSuggestions, damerauLevenshteinDistance } from './fuzzy-search.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load Configuration (NO MORE HARDCODE!)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'parser-config.json');

let BENCHMARK_CONFIG;
try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    BENCHMARK_CONFIG = config.performanceBenchmarks || { defaultSize: 100, defaultIterations: 100, intensiveIterations: 10000 };
} catch (error) {
    BENCHMARK_CONFIG = { defaultSize: 100, defaultIterations: 100, intensiveIterations: 10000 };
}

// =============================================================================
// Test Data Generator
// =============================================================================

function generateTestData(size = BENCHMARK_CONFIG.defaultSize) {
    const keywords = [];
    const operators = [];

    for (let i = 0; i < size; i++) {
        keywords.push(`keyword${i}`);
        operators.push(`op${i}`);
    }

    // Add realistic multi-char operators
    operators.push('===', '!==', '==', '!=', '>=', '<=', '++', '--', '&&', '||',
        '<<', '>>', '>>>', '...', '=>', '**', '??', '?.', '??=');

    return { keywords, operators };
}

// =============================================================================
// Benchmark 1: Index Building Time
// =============================================================================

export function benchmarkIndexBuilding(grammar) {
    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK 1: Index Building Time');
    console.log('='.repeat(80) + '\n');

    const iterations = BENCHMARK_CONFIG.defaultIterations;
    const times = [];

    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        new GrammarIndex(grammar);
        const end = performance.now();
        times.push(end - start);
    }

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    console.log(`Iterations: ${iterations}`);
    console.log(`Average Time: ${avg.toFixed(3)}ms`);
    console.log(`Min Time: ${min.toFixed(3)}ms`);
    console.log(`Max Time: ${max.toFixed(3)}ms`);
    console.log(`Standard Deviation: ${calculateStdDev(times).toFixed(3)}ms`);

    return { avg, min, max, times };
}

// =============================================================================
// Benchmark 2: Lookup Performance (Map vs Object)
// =============================================================================

export function benchmarkLookupPerformance() {
    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK 2: Lookup Performance (Map vs Object)');
    console.log('='.repeat(80) + '\n');

    const { keywords } = generateTestData(10000);

    // Build Map
    const keywordMap = new Map();
    keywords.forEach((k, i) => keywordMap.set(k, { id: i, category: 'test' }));

    // Build Object
    const keywordObj = {};
    keywords.forEach((k, i) => keywordObj[k] = { id: i, category: 'test' });

    const iterations = BENCHMARK_CONFIG.intensiveIterations;

    // Test Map
    console.log('Testing Map.get()...');
    let mapStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        keywordMap.get(keyword);
    }
    let mapEnd = performance.now();
    const mapTime = mapEnd - mapStart;

    // Test Object
    console.log('Testing Object property access...');
    let objStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        keywordObj[keyword];
    }
    let objEnd = performance.now();
    const objTime = objEnd - objStart;

    console.log(`\nMap.get() Time: ${mapTime.toFixed(2)}ms`);
    console.log(`Object property Time: ${objTime.toFixed(2)}ms`);
    console.log(`Speedup: ${(objTime / mapTime).toFixed(2)}x ${mapTime < objTime ? '(Map faster)' : '(Object faster)'}`);
    console.log(`\nIterations: ${iterations.toLocaleString()}`);
    console.log(`Map ops/sec: ${(iterations / (mapTime / 1000)).toLocaleString()}`);
    console.log(`Object ops/sec: ${(iterations / (objTime / 1000)).toLocaleString()}`);

    return { mapTime, objTime, speedup: objTime / mapTime };
}

// =============================================================================
// Benchmark 3: Longest Match Performance (Trie vs Loop)
// =============================================================================

export function benchmarkLongestMatchPerformance() {
    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK 3: Longest Match Performance (Trie vs Loop)');
    console.log('='.repeat(80) + '\n');

    // Real operators
    const operators = [
        '===', '!==', '==', '!=', '>=', '<=', '++', '--', '&&', '||',
        '<<', '>>', '>>>', '...', '=>', '**', '??', '?.', '??=',
        '+', '-', '*', '/', '%', '&', '|', '^', '!', '~', '<', '>'
    ];

    // Build Trie
    const trie = new Trie();
    operators.forEach(op => trie.insert(op, { operator: op }));

    // Test cases
    const testInputs = [
        '!== 10',      // longest: !==
        '!= 10',       // longest: !=
        '! true',      // longest: !
        'x === y',     // longest: ===
        'x == y',      // longest: ==
        '...rest',     // longest: ...
        'x++',         // longest: ++
        'x + y',       // longest: +
        'a ?? b',      // longest: ??
        'obj?.prop'    // longest: ?.
    ];

    const iterations = BENCHMARK_CONFIG.intensiveIterations;

    // ============================================
    // Method 1: Trie (NEW)
    // ============================================
    console.log('Testing Trie.findLongestMatch()...');
    const trieStart = performance.now();

    for (let i = 0; i < iterations; i++) {
        for (const input of testInputs) {
            trie.findLongestMatch(input, 0);
        }
    }

    const trieEnd = performance.now();
    const trieTime = trieEnd - trieStart;

    // ============================================
    // Method 2: Loop (OLD)
    // ============================================
    console.log('Testing Loop through operators...');
    const loopStart = performance.now();

    for (let i = 0; i < iterations; i++) {
        for (const input of testInputs) {
            findLongestOperatorLoop(input, 0, operators);
        }
    }

    const loopEnd = performance.now();
    const loopTime = loopEnd - loopStart;

    console.log(`\nTrie Time: ${trieTime.toFixed(2)}ms`);
    console.log(`Loop Time: ${loopTime.toFixed(2)}ms`);
    console.log(`Speedup: ${(loopTime / trieTime).toFixed(2)}x faster with Trie`);
    console.log(`\nTotal operations: ${(iterations * testInputs.length).toLocaleString()}`);
    console.log(`Trie ops/sec: ${(iterations * testInputs.length / (trieTime / 1000)).toLocaleString()}`);
    console.log(`Loop ops/sec: ${(iterations * testInputs.length / (loopTime / 1000)).toLocaleString()}`);

    return { trieTime, loopTime, speedup: loopTime / trieTime };
}

/**
 * OLD METHOD: Loop through operators by length
 */
function findLongestOperatorLoop(input, position, operators) {
    // Sort by length (longest first)
    const sorted = operators.slice().sort((a, b) => b.length - a.length);

    for (const op of sorted) {
        const substr = input.slice(position, position + op.length);
        if (substr === op) {
            return { operator: op, length: op.length };
        }
    }

    return null;
}

// =============================================================================
// Benchmark 4: Fuzzy Search Performance
// =============================================================================

export function benchmarkFuzzySearchPerformance() {
    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK 4: Fuzzy Search Performance');
    console.log('='.repeat(80) + '\n');

    // Generate realistic keyword set
    const keywords = [
        'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
        'import', 'export', 'class', 'extends', 'async', 'await', 'try', 'catch',
        'switch', 'case', 'break', 'continue', 'typeof', 'instanceof', 'new',
        'this', 'super', 'static', 'get', 'set', 'yield', 'delete', 'void'
    ];

    // Typos to test
    const typos = [
        'functoin', 'cosnt', 'reutrn', 'improt', 'exprot', 'awiat', 'aysnc', 'clss'
    ];

    const iterations = BENCHMARK_CONFIG.defaultIterations;

    console.log('Testing findTypoSuggestions()...');
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
        for (const typo of typos) {
            findTypoSuggestions(typo, keywords, 3);
        }
    }

    const end = performance.now();
    const totalTime = end - start;
    const avgTime = totalTime / (iterations * typos.length);

    console.log(`\nTotal Time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average Time per typo: ${avgTime.toFixed(4)}ms`);
    console.log(`Total operations: ${(iterations * typos.length).toLocaleString()}`);
    console.log(`Operations/sec: ${(iterations * typos.length / (totalTime / 1000)).toLocaleString()}`);

    // Show sample results
    console.log('\nSample Results:');
    for (const typo of typos.slice(0, 3)) {
        const suggestions = findTypoSuggestions(typo, keywords, 3);
        console.log(`"${typo}"  ${suggestions.map(s => `"${s.word}"(${s.distance})`).join(', ')}`);
    }

    return { totalTime, avgTime };
}

// =============================================================================
// Benchmark 5: Memory Usage
// =============================================================================

export function benchmarkMemoryUsage(grammar) {
    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK 5: Memory Usage');
    console.log('='.repeat(80) + '\n');

    if (typeof process !== 'undefined' && process.memoryUsage) {
        const before = process.memoryUsage();

        // Build index
        const index = new GrammarIndex(grammar);

        const after = process.memoryUsage();

        const heapUsed = (after.heapUsed - before.heapUsed) / 1024 / 1024;
        const external = (after.external - before.external) / 1024 / 1024;

        console.log(`Heap Used: ${heapUsed.toFixed(2)} MB`);
        console.log(`External: ${external.toFixed(2)} MB`);
        console.log(`\nIndex Stats:`, index.getStats());

        return { heapUsed, external, stats: index.getStats() };
    } else {
        console.log('Memory profiling not available in this environment');
        return null;
    }
}

// =============================================================================
// Benchmark 6: Complete Tokenizer Performance
// =============================================================================

export function benchmarkCompleteTokenizer(grammar, testCode) {
    console.log('\n' + '='.repeat(80));
    console.log('BENCHMARK 6: Complete Tokenizer Performance');
    console.log('='.repeat(80) + '\n');

    const { ExampleTokenizer } = require('./tokenizer-helper.js');

    const tokenizer = new ExampleTokenizer(grammar);
    const iterations = BENCHMARK_CONFIG.defaultIterations;

    console.log(`Test Code: ${testCode}`);
    console.log(`Iterations: ${iterations}\n`);

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

    console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average Time: ${avgTime.toFixed(4)}ms`);
    console.log(`Tokens Generated: ${tokens.length}`);
    console.log(`Tokens/sec: ${(iterations * tokens.length / (totalTime / 1000)).toLocaleString()}`);
    console.log(`Code Length: ${testCode.length} characters`);
    console.log(`Characters/sec: ${(iterations * testCode.length / (totalTime / 1000)).toLocaleString()}`);

    return { totalTime, avgTime, tokenCount: tokens.length };
}

// =============================================================================
// Run All Benchmarks
// =============================================================================

export function runAllBenchmarks(grammar) {
    console.log('\n');
    console.log('╔' + '═'.repeat(78) + '╗');
    console.log('║' + ' '.repeat(20) + 'GRAMMAR INDEX PERFORMANCE BENCHMARKS' + ' '.repeat(22) + '║');
    console.log('╚' + '═'.repeat(78) + '╝');

    const results = {};

    try {
        results.indexBuilding = benchmarkIndexBuilding(grammar);
        results.lookupPerformance = benchmarkLookupPerformance();
        results.longestMatch = benchmarkLongestMatchPerformance();
        results.fuzzySearch = benchmarkFuzzySearchPerformance();
        results.memoryUsage = benchmarkMemoryUsage(grammar);

        // Test with real code
        const testCode = `
      const x = 10;
      if (x !== 20) {
        console.log('x is not 20');
      }
      const arr = [1, 2, 3];
      const sum = arr.reduce((a, b) => a + b, 0);
    `;

        results.tokenizer = benchmarkCompleteTokenizer(grammar, testCode);

    } catch (error) {
        console.error('Benchmark error:', error);
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80) + '\n');

    if (results.lookupPerformance) {
        console.log(` Map vs Object: ${results.lookupPerformance.speedup.toFixed(2)}x speedup`);
    }

    if (results.longestMatch) {
        console.log(` Trie vs Loop: ${results.longestMatch.speedup.toFixed(2)}x speedup`);
    }

    if (results.indexBuilding) {
        console.log(` Index Build Time: ${results.indexBuilding.avg.toFixed(2)}ms average`);
    }

    if (results.fuzzySearch) {
        console.log(` Fuzzy Search: ${results.fuzzySearch.avgTime.toFixed(4)}ms per query`);
    }

    if (results.tokenizer) {
        console.log(` Tokenizer: ${results.tokenizer.avgTime.toFixed(4)}ms per file`);
    }

    console.log('\n' + '='.repeat(80));

    return results;
}

// =============================================================================
// Utility Functions
// =============================================================================

function calculateStdDev(values) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
}

// =============================================================================
// Export
// =============================================================================

export default {
    benchmarkIndexBuilding,
    benchmarkLookupPerformance,
    benchmarkLongestMatchPerformance,
    benchmarkFuzzySearchPerformance,
    benchmarkMemoryUsage,
    benchmarkCompleteTokenizer,
    runAllBenchmarks
};
