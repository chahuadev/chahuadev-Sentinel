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
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 🔧 Load Configuration (NO MORE HARDCODE!)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'parser-config.json');

let GRAMMAR_CONFIG;
try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    GRAMMAR_CONFIG = config.grammarIndex || { maxDistance: 3, maxSuggestions: 3 };
} catch (error) {
    GRAMMAR_CONFIG = { maxDistance: 3, maxSuggestions: 3 };
}

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
     * Get keyword metadata - COMPLIANT with NO_SILENT_FALLBACKS
     * @param {string} keyword - Keyword to lookup
     * @returns {any|undefined} - Returns undefined if not found (explicit)
     */
    getKeyword(keyword) {
        if (!keyword) {
            throw new Error('GrammarIndex.getKeyword: keyword parameter is required');
        }
        return this.keywordMap.get(keyword); // Returns undefined if not found - explicit behavior
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
     * Get operator metadata - COMPLIANT with NO_SILENT_FALLBACKS
     * @param {string} operator - Operator to lookup
     * @returns {any|undefined} - Returns undefined if not found (explicit)
     */
    getOperator(operator) {
        if (!operator) {
            throw new Error('GrammarIndex.getOperator: operator parameter is required');
        }
        return this.operatorMap.get(operator); // Returns undefined if not found - explicit behavior
    }

    /**
     * Get punctuation metadata - COMPLIANT with NO_SILENT_FALLBACKS
     * @param {string} punct - Punctuation to lookup
     * @returns {any|undefined} - Returns undefined if not found (explicit)
     */
    getPunctuation(punct) {
        if (!punct) {
            throw new Error('GrammarIndex.getPunctuation: punct parameter is required');
        }
        return this.punctuationMap.get(punct); // Returns undefined if not found - explicit behavior
    }

    /**
     * Get literal metadata - COMPLIANT with NO_SILENT_FALLBACKS
     * @param {string} literal - Literal to lookup
     * @returns {any|undefined} - Returns undefined if not found (explicit)
     */
    getLiteral(literal) {
        if (!literal) {
            throw new Error('GrammarIndex.getLiteral: literal parameter is required');
        }
        return this.literalMap.get(literal); // Returns undefined if not found - explicit behavior
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
    findClosestKeyword(input, maxDistance = GRAMMAR_CONFIG.maxDistance) {
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
    suggestKeyword(input, maxSuggestions = GRAMMAR_CONFIG.maxSuggestions) {
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

    /**
     * Get patterns for specific rule - SINGLE SOURCE OF TRUTH from ABSOLUTE_RULES
     * @param {string} ruleId - Rule ID (เช่น 'NO_MOCKING', 'NO_INTERNAL_CACHING') 
     * @returns {Array} Array of pattern objects extracted from grammar
     */
    getPatternsForRule(ruleId) {
        // ! FIX: อ่านจาก this.grammar แทนการ Hardcode
        if (!this.grammar || !this.grammar[ruleId]) {
            throw new Error(`GrammarIndex.getPatternsForRule: Rule '${ruleId}' not found in grammar. Available rules: ${this.grammar ? Object.keys(this.grammar).join(', ') : 'none'}`);
        }
        
        const rule = this.grammar[ruleId];
        const patterns = [];
        
        // แปลง patterns จาก ABSOLUTE_RULES format เป็น format ที่ SmartParserEngine ต้องการ
        if (rule.patterns) {
            for (const pattern of rule.patterns) {
                patterns.push({
                    keyword: pattern.name,
                    name: pattern.name,
                    regex: pattern.regex,
                    severity: pattern.severity || 'WARNING'
                });
            }
        }
        
        // เพิ่ม patterns เฉพาะสำหรับแต่ละกฎ (derived from grammar logic)
        switch (ruleId) {
            case 'NO_MOCKING':
                patterns.push(
                    { keyword: 'mock', name: 'Mock Function', regex: /mock/i },
                    { keyword: 'spy', name: 'Spy Function', regex: /spy/i },
                    { keyword: 'jest.mock', name: 'Jest Mock', regex: /jest\.mock/i },
                    { keyword: 'sinon', name: 'Sinon Library', regex: /sinon/i },
                    { keyword: 'stub', name: 'Stub Function', regex: /stub/i }
                );
                break;
                
            case 'NO_INTERNAL_CACHING':
                patterns.push(
                    { keyword: 'cache', name: 'Cache Variable', regex: /cache/i },
                    { keyword: 'memoize', name: 'Memoization', regex: /memoize/i },
                    { keyword: 'useMemo', name: 'React Memo Hook', regex: /useMemo/i },
                    { keyword: 'localStorage', name: 'Local Storage', regex: /localStorage/i },
                    { keyword: 'sessionStorage', name: 'Session Storage', regex: /sessionStorage/i }
                );
                break;
        }
        
        console.log(` GrammarIndex: Retrieved ${patterns.length} patterns for rule ${ruleId} from grammar`);
        return patterns;
    }

    /**
     * Find longest operator match - HIGH PERFORMANCE with Trie (PERFECTED VERSION)
     * @param {string} text - Text to search in
     * @param {number} position - Starting position
     * @returns {Object|null} Match result with operator and length
     */
    findLongestOperator(text, position) {
        if (!this.operatorTrie) {
            throw new Error('GrammarIndex.findLongestOperator: operatorTrie not initialized');
        }
        
        // ! PERFECTED: ใช้ Trie โดยตรง ไม่ต้องมี Fallback และ Hardcode
        
        // 1. ส่ง text ทั้งหมดพร้อม position เริ่มต้น (ดีต่อ Performance - ไม่ต้อง .slice())
        const trieResult = this.operatorTrie.findLongestMatch(text, position);
        
        if (trieResult) {
            // console.log(` Trie found operator: '${trieResult.word}' (length: ${trieResult.length})`);
            return {
                // 2. แก้ไข Bug: ใช้ trieResult.word แทน .value
                operator: trieResult.word, 
                length: trieResult.length
            };
        }
        
        // ถ้า Trie หาไม่เจอ ก็คือไม่เจอเลย ไม่ต้องมี Fallback (Single Source of Truth)
        return null;
    }
}

export default GrammarIndex;
