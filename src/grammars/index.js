// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// @contact chahuadev@gmail.com
// ======================================================================
// Grammar Index - Export all grammar modules
// ============================================================================
// ChahuadevR Engine Grammar Dictionary - Core Language Support
// ============================================================================

export { JAVASCRIPT_GRAMMAR } from './javascript.grammar.js';
export { TYPESCRIPT_GRAMMAR } from './typescript.grammar.js';
export { JAVA_GRAMMAR } from './java.grammar.js';
export { JSX_GRAMMAR } from './jsx.grammar.js';

// =========================================================================
// In-Memory Search System
// =========================================================================

export { GrammarIndex } from './shared/grammar-index.js';
export { Trie } from './shared/trie.js';
export {
    levenshteinDistance,
    levenshteinDistanceOptimized,
    damerauLevenshteinDistance,
    findClosestMatch,
    findTypoSuggestions,
    similarityRatio
} from './shared/fuzzy-search.js';

// Tokenizer/Parser Integration
export {
    ExampleTokenizer,
    ParserIntegration,
    benchmarkTokenizer
} from './shared/tokenizer-helper.js';

// Performance Benchmarks
export {
    runAllBenchmarks,
    benchmarkIndexBuilding,
    benchmarkLookupPerformance,
    benchmarkLongestMatchPerformance,
    benchmarkFuzzySearchPerformance
} from './shared/performance-benchmarks.js';

/**
 * Complete Grammar Dictionary
 * รวม vocabulary จากทุกภาษาที่รองรับ
 */
export const COMPLETE_GRAMMAR = {
    javascript: JAVASCRIPT_GRAMMAR,
    typescript: TYPESCRIPT_GRAMMAR,
    java: JAVA_GRAMMAR,
    jsx: JSX_GRAMMAR,
};

/**
 * Grammar Statistics
 * สถิติของ vocabulary ที่รวบรวมได้
 */
export const GRAMMAR_STATS = {
    javascript: {
        keywords: Object.keys(JAVASCRIPT_GRAMMAR.keywords).length,
        literals: Object.keys(JAVASCRIPT_GRAMMAR.literals).length,
        binaryOperators: Object.keys(JAVASCRIPT_GRAMMAR.operators.binaryOperators).length,
        unaryOperators: Object.keys(JAVASCRIPT_GRAMMAR.operators.unaryOperators).length,
        assignmentOperators: Object.keys(JAVASCRIPT_GRAMMAR.operators.assignmentOperators).length,
        punctuation: Object.keys(JAVASCRIPT_GRAMMAR.punctuation).length,
        total: Object.keys(JAVASCRIPT_GRAMMAR.keywords).length +
            Object.keys(JAVASCRIPT_GRAMMAR.literals).length +
            Object.keys(JAVASCRIPT_GRAMMAR.operators.binaryOperators).length +
            Object.keys(JAVASCRIPT_GRAMMAR.operators.unaryOperators).length +
            Object.keys(JAVASCRIPT_GRAMMAR.operators.assignmentOperators).length +
            Object.keys(JAVASCRIPT_GRAMMAR.punctuation).length,
    },
    typescript: {
        typeKeywords: Object.keys(TYPESCRIPT_GRAMMAR.typeKeywords).length,
        modifiers: Object.keys(TYPESCRIPT_GRAMMAR.modifiers).length,
        typeOperators: Object.keys(TYPESCRIPT_GRAMMAR.typeOperators).length,
        declarations: Object.keys(TYPESCRIPT_GRAMMAR.declarations).length,
        moduleKeywords: Object.keys(TYPESCRIPT_GRAMMAR.moduleKeywords).length,
        specialKeywords: Object.keys(TYPESCRIPT_GRAMMAR.specialKeywords).length,
        typeOperatorSymbols: Object.keys(TYPESCRIPT_GRAMMAR.typeOperatorSymbols).length,
        total: Object.keys(TYPESCRIPT_GRAMMAR.typeKeywords).length +
            Object.keys(TYPESCRIPT_GRAMMAR.modifiers).length +
            Object.keys(TYPESCRIPT_GRAMMAR.typeOperators).length +
            Object.keys(TYPESCRIPT_GRAMMAR.declarations).length +
            Object.keys(TYPESCRIPT_GRAMMAR.moduleKeywords).length +
            Object.keys(TYPESCRIPT_GRAMMAR.specialKeywords).length +
            Object.keys(TYPESCRIPT_GRAMMAR.typeOperatorSymbols).length,
    },
    java: {
        keywords: Object.keys(JAVA_GRAMMAR.keywords).length,
        primitiveTypes: Object.keys(JAVA_GRAMMAR.primitiveTypes).length,
        literals: Object.keys(JAVA_GRAMMAR.literals).length,
        operators: Object.keys(JAVA_GRAMMAR.operators).length,
        separators: Object.keys(JAVA_GRAMMAR.separators).length,
        annotations: Object.keys(JAVA_GRAMMAR.annotations).length,
        generics: Object.keys(JAVA_GRAMMAR.generics).length,
        total: Object.keys(JAVA_GRAMMAR.keywords).length +
            Object.keys(JAVA_GRAMMAR.primitiveTypes).length +
            Object.keys(JAVA_GRAMMAR.literals).length +
            Object.keys(JAVA_GRAMMAR.operators).length +
            Object.keys(JAVA_GRAMMAR.separators).length +
            Object.keys(JAVA_GRAMMAR.annotations).length +
            Object.keys(JAVA_GRAMMAR.generics).length,
    },
    jsx: {
        elements: Object.keys(JSX_GRAMMAR.elements).length,
        expressions: Object.keys(JSX_GRAMMAR.expressions).length,
        attributes: Object.keys(JSX_GRAMMAR.attributes).length,
        builtInComponents: Object.keys(JSX_GRAMMAR.builtInComponents).length,
        namespaces: Object.keys(JSX_GRAMMAR.namespaces).length,
        specialProps: Object.keys(JSX_GRAMMAR.specialProps).length,
        transforms: Object.keys(JSX_GRAMMAR.transforms).length,
        total: Object.keys(JSX_GRAMMAR.elements).length +
            Object.keys(JSX_GRAMMAR.expressions).length +
            Object.keys(JSX_GRAMMAR.attributes).length +
            Object.keys(JSX_GRAMMAR.builtInComponents).length +
            Object.keys(JSX_GRAMMAR.namespaces).length +
            Object.keys(JSX_GRAMMAR.specialProps).length +
            Object.keys(JSX_GRAMMAR.transforms).length,
    },
};

/**
 * Grammar Sources
 * แหล่งอ้างอิงของแต่ละ grammar
 */
export const GRAMMAR_SOURCES = {
    javascript: [
        'ECMAScript 2026 Language Specification (https://tc39.es/ecma262/)',
        'Babel Parser tokenizer/types.ts (https://github.com/babel/babel)',
        'ANTLR JavaScript Grammar (https://github.com/antlr/grammars-v4)',
    ],
    typescript: [
        'TypeScript Compiler scanner.ts (https://github.com/microsoft/TypeScript)',
        'Babel Parser TypeScript plugin (https://github.com/babel/babel)',
        'ANTLR TypeScript Grammar (https://github.com/antlr/grammars-v4)',
    ],
    java: [
        'ANTLR Java Grammar (https://github.com/antlr/grammars-v4)',
        'Java Language Specification (JLS) SE 21',
    ],
    jsx: [
        'ANTLR JSX/JavaScript Grammar (https://github.com/antlr/grammars-v4)',
        'React JSX Documentation',
        'Babel JSX Plugin (https://github.com/babel/babel)',
    ],
};

/**
 * Validate Grammar Completeness
 * ตรวจสอบความสมบูรณ์ของ grammar
 */
export function validateGrammarCompleteness() {
    const results = {
        javascript: {
            hasKeywords: Object.keys(JAVASCRIPT_GRAMMAR.keywords).length > 0,
            hasOperators: Object.keys(JAVASCRIPT_GRAMMAR.operators.binaryOperators).length > 0,
            hasLiterals: Object.keys(JAVASCRIPT_GRAMMAR.literals).length > 0,
            hasPunctuation: Object.keys(JAVASCRIPT_GRAMMAR.punctuation).length > 0,
        },
        typescript: {
            hasTypeKeywords: Object.keys(TYPESCRIPT_GRAMMAR.typeKeywords).length > 0,
            hasModifiers: Object.keys(TYPESCRIPT_GRAMMAR.modifiers).length > 0,
            hasDeclarations: Object.keys(TYPESCRIPT_GRAMMAR.declarations).length > 0,
        },
        java: {
            hasKeywords: Object.keys(JAVA_GRAMMAR.keywords).length > 0,
            hasPrimitiveTypes: Object.keys(JAVA_GRAMMAR.primitiveTypes).length > 0,
            hasOperators: Object.keys(JAVA_GRAMMAR.operators).length > 0,
        },
        jsx: {
            hasElements: Object.keys(JSX_GRAMMAR.elements).length > 0,
            hasAttributes: Object.keys(JSX_GRAMMAR.attributes).length > 0,
            hasComponents: Object.keys(JSX_GRAMMAR.builtInComponents).length > 0,
        },
    };

    const allValid = Object.values(results).every(grammar =>
        Object.values(grammar).every(check => check === true)
    );

    return { results, allValid };
}

export default COMPLETE_GRAMMAR;
