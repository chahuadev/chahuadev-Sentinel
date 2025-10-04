// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// @contact chahuadev@gmail.com
// ======================================================================
// ChahuadevR Engine Grammar Dictionary - Core Language Support
// ============================================================================
// Grammar Index System
// In-Memory Search System ที่เร็วและแม่นยำ
// ============================================================================
// โครงสร้างข้อมูล:
// 1. Map - O(1) lookup สำหรับ keywords, operators
// 2. Set - O(1) membership check
// 3. Trie - Longest match, prefix search
// 4. Levenshtein - Fuzzy search, typo suggestions
// ============================================================================
// Performance:
// - Keyword lookup: O(1)
// - Operator longest match: O(m) where m = operator length
// - Fuzzy search: O(n * m) where n = number of candidates
// - Prefix search: O(m + k) where k = number of results
// ============================================================================

import { Trie } from './trie.js';
import {
    findClosestMatch,
    findTypoSuggestions,
    damerauLevenshteinDistance
} from './fuzzy-search.js';

export class GrammarIndex {
    constructor(grammar) {
        this.grammar = grammar;

        // =========================================================================
        // 1. Map-based Indexes (O(1) lookup)
        // =========================================================================

        /** @type {Map<string, any>} - All keywords */
        this.keywordMap = new Map();

        /** @type {Map<string, any>} - All operators */
        this.operatorMap = new Map();

        /** @type {Map<string, any>} - All punctuation */
        this.punctuationMap = new Map();

        /** @type {Map<string, any>} - All literals */
        this.literalMap = new Map();

        // =========================================================================
        // 2. Set-based Indexes (O(1) membership check)
        // =========================================================================

        /** @type {Set<string>} - Quick keyword check */
        this.keywordSet = new Set();

        /** @type {Set<string>} - Reserved words */
        this.reservedWordSet = new Set();

        /** @type {Set<string>} - Contextual keywords */
        this.contextualKeywordSet = new Set();

        /** @type {Set<string>} - Deprecated keywords */
        this.deprecatedSet = new Set();

        // =========================================================================
        // 3. Trie Indexes (Longest match, prefix search)
        // =========================================================================

        /** @type {Trie} - For multi-character operators (!==, !=, !) */
        this.operatorTrie = new Trie();

        /** @type {Trie} - For keywords (autocomplete, prefix search) */
        this.keywordTrie = new Trie();

        /** @type {Trie} - For punctuation (multi-char like ..., =>) */
        this.punctuationTrie = new Trie();

        // =========================================================================
        // 4. Category Indexes (for filtering)
        // =========================================================================

        /** @type {Map<string, Set<string>>} - Keywords by category */
        this.categoryIndex = new Map();

        /** @type {Map<string, Set<string>>} - Keywords by ES version */
        this.versionIndex = new Map();

        // Build all indexes
        this._buildIndexes();
    }

    // ===========================================================================
    // Index Building
    // ===========================================================================

    /**
     * Build all indexes from grammar
     * @private
     */
    _buildIndexes() {
        // Build keyword indexes
        if (this.grammar.keywords) {
            for (const [keyword, data] of Object.entries(this.grammar.keywords)) {
                // Map
                this.keywordMap.set(keyword, data);

                // Set
                this.keywordSet.add(keyword);

                if (data.category === 'reserved') {
                    this.reservedWordSet.add(keyword);
                }

                if (data.contextual) {
                    this.contextualKeywordSet.add(keyword);
                }

                if (data.deprecated) {
                    this.deprecatedSet.add(keyword);
                }

                // Trie
                this.keywordTrie.insert(keyword, data);

                // Category index
                if (!this.categoryIndex.has(data.category)) {
                    this.categoryIndex.set(data.category, new Set());
                }
                this.categoryIndex.get(data.category).add(keyword);

                // Version index
                if (data.esVersion) {
                    if (!this.versionIndex.has(data.esVersion)) {
                        this.versionIndex.set(data.esVersion, new Set());
                    }
                    this.versionIndex.get(data.esVersion).add(keyword);
                }
            }
        }

        // Build operator indexes
        if (this.grammar.operators) {
            // Binary operators
            if (this.grammar.operators.binaryOperators) {
                for (const [op, data] of Object.entries(this.grammar.operators.binaryOperators)) {
                    this.operatorMap.set(op, data);
                    this.operatorTrie.insert(op, { ...data, type: 'binary' });
                }
            }

            // Unary operators
            if (this.grammar.operators.unaryOperators) {
                for (const [op, data] of Object.entries(this.grammar.operators.unaryOperators)) {
                    if (!this.operatorMap.has(op)) {
                        this.operatorMap.set(op, data);
                    }
                    this.operatorTrie.insert(op, { ...data, type: 'unary' });
                }
            }

            // Assignment operators
            if (this.grammar.operators.assignmentOperators) {
                for (const [op, data] of Object.entries(this.grammar.operators.assignmentOperators)) {
                    if (!this.operatorMap.has(op)) {
                        this.operatorMap.set(op, data);
                    }
                    this.operatorTrie.insert(op, { ...data, type: 'assignment' });
                }
            }
        }

        // Build punctuation indexes
        if (this.grammar.punctuation) {
            for (const [punct, data] of Object.entries(this.grammar.punctuation)) {
                this.punctuationMap.set(punct, data);
                this.punctuationTrie.insert(punct, data);
            }
        }

        // Build literal indexes
        if (this.grammar.literals) {
            for (const [literal, data] of Object.entries(this.grammar.literals)) {
                this.literalMap.set(literal, data);
            }
        }
    }

    // ===========================================================================
    // Fast Lookup Operations (O(1))
    // ===========================================================================

    /**
     * Check if a word is a keyword
     * @param {string} word - Word to check
     * @returns {boolean}
     */
    isKeyword(word) {
        return this.keywordSet.has(word);
    }

    /**
     * Get keyword metadata
     * @param {string} keyword - Keyword to lookup
     * @returns {any|null}
     */
    getKeyword(keyword) {
        return this.keywordMap.get(keyword) || null;
    }

    /**
     * Check if a word is a reserved word
     * @param {string} word - Word to check
     * @returns {boolean}
     */
    isReservedWord(word) {
        return this.reservedWordSet.has(word);
    }

    /**
     * Check if a word is a contextual keyword
     * @param {string} word - Word to check
     * @returns {boolean}
     */
    isContextualKeyword(word) {
        return this.contextualKeywordSet.has(word);
    }

    /**
     * Check if a feature is deprecated
     * @param {string} word - Word to check
     * @returns {boolean}
     */
    isDeprecated(word) {
        return this.deprecatedSet.has(word);
    }

    /**
     * Get operator metadata
     * @param {string} operator - Operator to lookup
     * @returns {any|null}
     */
    getOperator(operator) {
        return this.operatorMap.get(operator) || null;
    }

    /**
     * Get punctuation metadata
     * @param {string} punct - Punctuation to lookup
     * @returns {any|null}
     */
    getPunctuation(punct) {
        return this.punctuationMap.get(punct) || null;
    }

    /**
     * Get literal metadata
     * @param {string} literal - Literal to lookup
     * @returns {any|null}
     */
    getLiteral(literal) {
        return this.literalMap.get(literal) || null;
    }

    // ===========================================================================
    // Longest Match Operations (O(m) where m = length)
    // ===========================================================================

    /**
     * Find longest matching operator from input
     * **Core algorithm for Tokenizer**
     * 
     * Example: Input "!==" at position 5
     * - Tries: "!" (found), "!=" (found), "!==" (found)
     * - Returns: "!==" (longest match)
     * 
     * @param {string} input - Input string
     * @param {number} position - Start position
     * @returns {{operator: string, data: any, length: number}|null}
     */
    findLongestOperator(input, position = 0) {
        const match = this.operatorTrie.findLongestMatch(input, position);

        if (!match) return null;

        return {
            operator: match.word,
            data: match.data,
            length: match.length
        };
    }

    /**
     * Find longest matching punctuation from input
     * 
     * @param {string} input - Input string
     * @param {number} position - Start position
     * @returns {{punctuation: string, data: any, length: number}|null}
     */
    findLongestPunctuation(input, position = 0) {
        const match = this.punctuationTrie.findLongestMatch(input, position);

        if (!match) return null;

        return {
            punctuation: match.word,
            data: match.data,
            length: match.length
        };
    }

    // ===========================================================================
    // Prefix Search Operations (O(m + k))
    // ===========================================================================

    /**
     * Find all keywords starting with prefix (for autocomplete)
     * 
     * @param {string} prefix - Prefix to search
     * @returns {Array<{keyword: string, data: any}>}
     */
    findKeywordsByPrefix(prefix) {
        return this.keywordTrie.findWordsWithPrefix(prefix).map(result => ({
            keyword: result.word,
            data: result.data
        }));
    }

    /**
     * Find all operators starting with prefix
     * 
     * @param {string} prefix - Prefix to search
     * @returns {Array<{operator: string, data: any}>}
     */
    findOperatorsByPrefix(prefix) {
        return this.operatorTrie.findWordsWithPrefix(prefix).map(result => ({
            operator: result.word,
            data: result.data
        }));
    }

    // ===========================================================================
    // Fuzzy Search Operations (O(n * m))
    // ===========================================================================

    /**
     * Find closest keyword match (for typo suggestions)
     * 
     * Example:
     * findClosestKeyword('functoin')  { keyword: 'function', distance: 2 }
     * 
     * @param {string} input - Possibly misspelled input
     * @param {number} maxDistance - Maximum edit distance (default: 3)
     * @returns {{keyword: string, distance: number, similarity: number}|null}
     */
    findClosestKeyword(input, maxDistance = 3) {
        const candidates = Array.from(this.keywordSet);
        const result = findClosestMatch(input, candidates, maxDistance);

        if (!result) return null;

        return {
            keyword: result.match,
            distance: result.distance,
            similarity: result.similarity,
            data: this.keywordMap.get(result.match)
        };
    }

    /**
     * Find typo suggestions for invalid keyword
     * 
     * Example:
     * suggestKeyword('functoin')  [
     *   { keyword: 'function', distance: 2 },
     *   { keyword: 'const', distance: 5 }
     * ]
     * 
     * @param {string} input - Possibly misspelled input
     * @param {number} maxSuggestions - Maximum suggestions (default: 3)
     * @returns {Array<{keyword: string, distance: number}>}
     */
    suggestKeyword(input, maxSuggestions = 3) {
        const candidates = Array.from(this.keywordSet);
        const suggestions = findTypoSuggestions(input, candidates, maxSuggestions);

        return suggestions.map(s => ({
            keyword: s.word,
            distance: s.distance,
            similarity: s.similarity,
            data: this.keywordMap.get(s.word)
        }));
    }

    // ===========================================================================
    // Category & Version Queries
    // ===========================================================================

    /**
     * Get all keywords of a specific category
     * 
     * @param {string} category - Category name (e.g., 'control', 'iteration')
     * @returns {Array<{keyword: string, data: any}>}
     */
    getKeywordsByCategory(category) {
        const keywords = this.categoryIndex.get(category) || new Set();
        return Array.from(keywords).map(keyword => ({
            keyword,
            data: this.keywordMap.get(keyword)
        }));
    }

    /**
     * Get all keywords introduced in a specific ES version
     * 
     * @param {string} version - ES version (e.g., 'ES6', 'ES2020')
     * @returns {Array<{keyword: string, data: any}>}
     */
    getKeywordsByVersion(version) {
        const keywords = this.versionIndex.get(version) || new Set();
        return Array.from(keywords).map(keyword => ({
            keyword,
            data: this.keywordMap.get(keyword)
        }));
    }

    /**
     * Get all available categories
     * @returns {Array<string>}
     */
    getAllCategories() {
        return Array.from(this.categoryIndex.keys());
    }

    /**
     * Get all available versions
     * @returns {Array<string>}
     */
    getAllVersions() {
        return Array.from(this.versionIndex.keys());
    }

    // ===========================================================================
    // Statistics
    // ===========================================================================

    /**
     * Get index statistics
     * @returns {Object}
     */
    getStats() {
        return {
            keywords: {
                total: this.keywordMap.size,
                reserved: this.reservedWordSet.size,
                contextual: this.contextualKeywordSet.size,
                deprecated: this.deprecatedSet.size
            },
            operators: {
                total: this.operatorMap.size,
                trieSize: this.operatorTrie.size,
                trieStats: this.operatorTrie.getStats()
            },
            punctuation: {
                total: this.punctuationMap.size,
                trieSize: this.punctuationTrie.size
            },
            literals: {
                total: this.literalMap.size
            },
            categories: this.categoryIndex.size,
            versions: this.versionIndex.size
        };
    }

    /**
     * Visualize trie structures (for debugging)
     * @returns {Object}
     */
    visualizeTries() {
        return {
            operators: this.operatorTrie.visualize(),
            keywords: this.keywordTrie.visualize(),
            punctuation: this.punctuationTrie.visualize()
        };
    }
}

export default GrammarIndex;
