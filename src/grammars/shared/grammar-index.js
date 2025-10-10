// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https:// ! github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================
// !  ChahuadevR Engine Grammar Dictionary - Core Language Support
// !  ============================================================================
// !  Grammar Index System
// !  In-Memory Search System ที่เร็วและแม่นยำ
// !  ============================================================================
// !  โครงสร้างข้อมูล:
// !  1. Map - O(1) lookup สำหรับ keywords, operators
// !  2. Set - O(1) membership check
// !  3. Trie - Longest match, prefix search
// !  4. Levenshtein - Fuzzy search, typo suggestions
// !  ============================================================================
// !  Performance:
// !  - Keyword lookup: O(1)
// !  - Operator longest match: O(m) where m = operator length
// !  - Fuzzy search: O(n * m) where n = number of candidates
// !  - Prefix search: O(m + k) where k = number of results
// !  ============================================================================

import { Trie } from './trie.js';
import {
    findClosestMatch,
    findTypoSuggestions,
    damerauLevenshteinDistance
} from './fuzzy-search.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import errorHandler from '../../error-handler/ErrorHandler.js';

// !  Load Configuration (NO MORE HARDCODE!)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'parser-config.json');

let GRAMMAR_CONFIG;
try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    GRAMMAR_CONFIG = config.grammarIndex;
    if (!GRAMMAR_CONFIG) {
        throw new Error(`Grammar configuration missing 'grammarIndex' section in ${CONFIG_PATH}`);
    }
} catch (error) {
    // !  NO_SILENT_FALLBACKS: แจ้งเออเรอร์ให้ชัดเจน ไม่ fallback เงียบๆ
    console.error(`CRITICAL: Grammar configuration failed: ${error.message}`);
    throw new Error(`Grammar Index requires valid configuration: ${CONFIG_PATH}. Cannot proceed without proper grammar configuration.`);
}

export class GrammarIndex {
    constructor(grammar) {
        this.grammar = grammar;

        // !  =========================================================================
        // !  1. Map-based Indexes (O(1) lookup)
        // !  =========================================================================

        /** @type {Map<string, any>} - All keywords */
        this.keywordMap = new Map();

        /** @type {Map<string, any>} - All operators */
        this.operatorMap = new Map();

        /** @type {Map<string, any>} - All punctuation */
        this.punctuationMap = new Map();

        /** @type {Map<string, any>} - All literals */
        this.literalMap = new Map();

        // !  =========================================================================
        // !  2. Set-based Indexes (O(1) membership check)
        // !  =========================================================================

        /** @type {Set<string>} - Quick keyword check */
        this.keywordSet = new Set();

        /** @type {Set<string>} - Reserved words */
        this.reservedWordSet = new Set();

        /** @type {Set<string>} - Contextual keywords */
        this.contextualKeywordSet = new Set();

        /** @type {Set<string>} - Deprecated keywords */
        this.deprecatedSet = new Set();

        // !  =========================================================================
        // !  3. Trie Indexes (Longest match, prefix search)
        // !  =========================================================================

        /** @type {Trie} - For multi-character operators (!==, !=, !) */
        this.operatorTrie = new Trie();

        /** @type {Trie} - For keywords (autocomplete, prefix search) */
        this.keywordTrie = new Trie();

        /** @type {Trie} - For punctuation (multi-char like ..., =>) */
        this.punctuationTrie = new Trie();

        // !  =========================================================================
        // !  4. Category Indexes (for filtering)
        // !  =========================================================================

        /** @type {Map<string, Set<string>>} - Keywords by category */
        this.categoryIndex = new Map();

        /** @type {Map<string, Set<string>>} - Keywords by ES version */
        this.versionIndex = new Map();

        // !  Build all indexes
        this._buildIndexes();
        
        // WHY: Debug logging to verify Trie was built correctly
        console.log(` GrammarIndex built: ${this.operatorTrie.size} operators in Trie`);
        console.log(`   Trie root children:`, Array.from(this.operatorTrie.root.children.keys()).slice(0, 20).join(', '));
    }

    // !  ===========================================================================
    // !  Index Building
    // !  ===========================================================================

    /**
     * ! Build all indexes from grammar
     * ! @private
     */
    _buildIndexes() {
        // !   !  FIX: จัดการ multi-language grammar ที่รับเข้ามา
        // !  ถ้าได้รับ {javascript: {...}, typescript: {...}} ให้รวมเป็น single grammar
        const grammars = this._extractGrammars(this.grammar);
        
        for (const grammar of grammars) {
            this._buildIndexesFromSingleGrammar(grammar);
        }
    }
    
    /**
     * ! แยก grammar จาก multi-language object หรือ single grammar
     * ! @private
     */
    _extractGrammars(grammarObject) {
        // !  ถ้ามี keywords, operators, punctuation โดยตรง = single grammar
        if (grammarObject.keywords || grammarObject.operators || grammarObject.punctuation) {
            return [grammarObject];
        }
        
        // !  ถ้าไม่ใช่ = multi-language object
        const grammars = [];
        for (const [lang, grammar] of Object.entries(grammarObject)) {
            // !  ข้าม absoluteRules เพราะไม่ใช่ language grammar
            if (lang !== 'absoluteRules' && grammar && typeof grammar === 'object') {
                grammars.push(grammar);
            }
        }
        return grammars;
    }
    
    /**
     * ! Build indexes จาก single grammar
     * ! @private
     */
    _buildIndexesFromSingleGrammar(grammar) {
        // !  Build keyword indexes
        if (grammar.keywords) {
            for (const [keyword, data] of Object.entries(grammar.keywords)) {
                // !  Map
                this.keywordMap.set(keyword, data);

                // !  Set
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

                // !  Trie
                this.keywordTrie.insert(keyword, data);

                // !  Category index
                if (!this.categoryIndex.has(data.category)) {
                    this.categoryIndex.set(data.category, new Set());
                }
                this.categoryIndex.get(data.category).add(keyword);

                // !  Version index
                if (data.esVersion) {
                    if (!this.versionIndex.has(data.esVersion)) {
                        this.versionIndex.set(data.esVersion, new Set());
                    }
                    this.versionIndex.get(data.esVersion).add(keyword);
                }
            }
        }

        // !  Build operator indexes
        if (grammar.operators) {
            // !  Binary operators
            if (grammar.operators.binaryOperators) {
                for (const [op, data] of Object.entries(grammar.operators.binaryOperators)) {
                    this.operatorMap.set(op, data);
                    this.operatorTrie.insert(op, { ...data, type: 'binary' });
                }
            }

            // !  Unary operators
            if (grammar.operators.unaryOperators) {
                for (const [op, data] of Object.entries(grammar.operators.unaryOperators)) {
                    if (!this.operatorMap.has(op)) {
                        this.operatorMap.set(op, data);
                    }
                    this.operatorTrie.insert(op, { ...data, type: 'unary' });
                }
            }

            // !  Assignment operators
            if (grammar.operators.assignmentOperators) {
                let count = 0;
                for (const [op, data] of Object.entries(grammar.operators.assignmentOperators)) {
                    if (!this.operatorMap.has(op)) {
                        this.operatorMap.set(op, data);
                    }
                    this.operatorTrie.insert(op, { ...data, type: 'assignment' });
                    count++;
                }
                console.log(` Built ${count} assignment operators in Trie (including '=')`);
            }
        }

        // !  Build punctuation indexes
        if (grammar.punctuation) {
            for (const [punct, data] of Object.entries(grammar.punctuation)) {
                this.punctuationMap.set(punct, data);
                this.punctuationTrie.insert(punct, data);
            }
        }

        // !  Build literal indexes
        if (this.grammar.literals) {
            for (const [literal, data] of Object.entries(this.grammar.literals)) {
                this.literalMap.set(literal, data);
            }
        }
    }

    // !  ===========================================================================
    // !  Fast Lookup Operations (O(1))
    // !  ===========================================================================

    /**
     * ! Check if a word is a keyword
     * ! @param {string} word - Word to check
     * ! @returns {boolean}
     */
    isKeyword(word) {
        return this.keywordSet.has(word);
    }

    /**
     * ! Get keyword metadata - COMPLIANT with NO_SILENT_FALLBACKS
     * ! @param {string} keyword - Keyword to lookup
     * ! @returns {any|undefined} - Returns undefined if not found (explicit)
     */
    getKeyword(keyword) {
        if (!keyword) {
            throw new Error('GrammarIndex.getKeyword: keyword parameter is required');
        }
        return this.keywordMap.get(keyword); // !  Returns undefined if not found - explicit behavior
    }

    /**
     * ! Check if a word is a reserved word
     * ! @param {string} word - Word to check
     * ! @returns {boolean}
     */
    isReservedWord(word) {
        return this.reservedWordSet.has(word);
    }

    /**
     * ! Check if a word is a contextual keyword
     * ! @param {string} word - Word to check
     * ! @returns {boolean}
     */
    isContextualKeyword(word) {
        return this.contextualKeywordSet.has(word);
    }

    /**
     * ! Check if a feature is deprecated
     * ! @param {string} word - Word to check
     * ! @returns {boolean}
     */
    isDeprecated(word) {
        return this.deprecatedSet.has(word);
    }

    /**
     * ! Get operator metadata - COMPLIANT with NO_SILENT_FALLBACKS
     * ! @param {string} operator - Operator to lookup
     * ! @returns {any|undefined} - Returns undefined if not found (explicit)
     */
    getOperator(operator) {
        if (!operator) {
            throw new Error('GrammarIndex.getOperator: operator parameter is required');
        }
        return this.operatorMap.get(operator); // !  Returns undefined if not found - explicit behavior
    }

    /**
     * ! Get punctuation metadata - COMPLIANT with NO_SILENT_FALLBACKS
     * ! @param {string} punct - Punctuation to lookup
     * ! @returns {any|undefined} - Returns undefined if not found (explicit)
     */
    getPunctuation(punct) {
        if (!punct) {
            throw new Error('GrammarIndex.getPunctuation: punct parameter is required');
        }
        return this.punctuationMap.get(punct); // !  Returns undefined if not found - explicit behavior
    }

    /**
     * ! Get literal metadata - COMPLIANT with NO_SILENT_FALLBACKS
     * ! @param {string} literal - Literal to lookup
     * ! @returns {any|undefined} - Returns undefined if not found (explicit)
     */
    getLiteral(literal) {
        if (!literal) {
            throw new Error('GrammarIndex.getLiteral: literal parameter is required');
        }
        return this.literalMap.get(literal); // !  Returns undefined if not found - explicit behavior
    }

    // !  ===========================================================================
    // !  Longest Match Operations (O(m) where m = length)
    // !  ===========================================================================

    /**
     * ! Find longest matching operator from input
     * ! **Core algorithm for Tokenizer**
     * ! 
     * ! Example: Input "!==" at position 5
     * ! - Tries: "!" (found), "!=" (found), "!==" (found)
     * ! - Returns: "!==" (longest match)
     * ! 
     * ! @param {string} input - Input string
     * ! @param {number} position - Start position
     * ! @returns {{operator: string, data: any, length: number}|null}
     */
    findLongestOperator(input, position = 0) {
        const match = this.operatorTrie.findLongestMatch(input, position);

        // WHY: Debug logging to see why operators are not found
        if (!match) {
            const char = input[position];
            const next5 = input.substring(position, position + 5);
            console.log(`findLongestOperator FAILED: char="${char}" context="${next5}" position=${position}`);
        }

        if (!match) {
            // !  NO_SILENT_FALLBACKS: คืน Object ที่มีสถานะชัดเจนแทน null
            return {
                found: false,
                operator: null,
                data: null,
                length: 0,
                position: position
            };
        }

        return {
            found: true,
            operator: match.word,
            data: match.data,
            length: match.length,
            position: position
        };
    }

    /**
     * ! Find longest matching punctuation from input
     * ! @param {string} input - Input string
     * ! @param {number} position - Start position
     * ! @returns {{found: boolean, punctuation: string|null, data: any, length: number, position: number}}
     */
    findLongestPunctuation(input, position = 0) {
        const match = this.punctuationTrie.findLongestMatch(input, position);

        if (!match) {
            // !  NO_SILENT_FALLBACKS: คืน Object ที่มีสถานะชัดเจนแทน null
            return {
                found: false,
                punctuation: null,
                data: null,
                length: 0,
                position: position
            };
        }

        return {
            found: true,
            punctuation: match.word,
            data: match.data,
            length: match.length,
            position: position
        };
    }

    // !  ===========================================================================
    // !   ! Prefix Search Operations (O(m + k))
    // !  ===========================================================================

    findKeywordsByPrefix(prefix) {
        return this.keywordTrie.findWordsWithPrefix(prefix).map(result => ({
            keyword: result.word,
            data: result.data
        }));
    }

    /**
     * ! Find all operators starting with prefix
     * ! @param {string} prefix - Prefix to search
     * ! @returns {Array<{operator: string, data: any}>}
     */
    findOperatorsByPrefix(prefix) {
        return this.operatorTrie.findWordsWithPrefix(prefix).map(result => ({
            operator: result.word,
            data: result.data
        }));
    }

    // !  ===========================================================================
    // !  Fuzzy Search Operations (O(n * m))
    // !  ===========================================================================

    findClosestKeyword(input, maxDistance = GRAMMAR_CONFIG.maxDistance) {
        const candidates = Array.from(this.keywordSet);
        const result = findClosestMatch(input, candidates, maxDistance);

        if (!result.found) {
            // !  NO_SILENT_FALLBACKS: คืน Object ที่มีสถานะชัดเจนแทน null
            return {
                found: false,
                keyword: null,
                distance: maxDistance + 1,
                similarity: 0,
                data: null
            };
        }

        return {
            found: true,
            keyword: result.match,
            distance: result.distance,
            similarity: result.similarity,
            data: this.keywordMap.get(result.match)
        };
    }

    /**
     * ! Find typo suggestions for invalid keyword
     * ! @param {string} input - Possibly misspelled input
     * ! @param {number} maxSuggestions - Maximum suggestions (default: 3)
     * ! @returns {Array<{keyword: string, distance: number}>}
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

    // !  ===========================================================================
    // !  Category & Version Queries
    // !  ===========================================================================

    /**
     * ! Get all keywords of a specific category
     * ! 
     * ! @param {string} category - Category name (e.g., 'control', 'iteration')
     * ! @returns {Array<{keyword: string, data: any}>}
     */
    getKeywordsByCategory(category) {
        const keywords = this.categoryIndex.get(category);
        if (!keywords) {
            // !  NO_SILENT_FALLBACKS: แจ้งให้ผู้เรียกทราบว่าเกิดปัญหา
            throw new Error(`Category '${category}' not found in grammar index. Available categories: ${Array.from(this.categoryIndex.keys()).join(', ')}`);
        }
        return Array.from(keywords).map(keyword => ({
            keyword,
            data: this.keywordMap.get(keyword)
        }));
    }

    /**
     * ! Get all keywords introduced in a specific ES version
     * ! 
     * ! @param {string} version - ES version (e.g., 'ES6', 'ES2020')
     * ! @returns {Array<{keyword: string, data: any}>}
     */
    getKeywordsByVersion(version) {
        const keywords = this.versionIndex.get(version);
        if (!keywords) {
            // !  NO_SILENT_FALLBACKS: แจ้งให้ผู้เรียกทราบว่าเกิดปัญหา
            throw new Error(`Version '${version}' not found in grammar index. Available versions: ${Array.from(this.versionIndex.keys()).join(', ')}`);
        }
        return Array.from(keywords).map(keyword => ({
            keyword,
            data: this.keywordMap.get(keyword)
        }));
    }

    /**
     * ! Get all available categories
     * ! @returns {Array<string>}
     */
    getAllCategories() {
        return Array.from(this.categoryIndex.keys());
    }

    /**
     * ! Get all available versions
     * ! @returns {Array<string>}
     */
    getAllVersions() {
        return Array.from(this.versionIndex.keys());
    }

    /**
     * ! ตรวจสอบว่าตัวอักษรสามารถใช้เป็นตัวเริ่มต้นของ Identifier ได้หรือไม่
     * ! (a-z, A-Z, _, $)
     * ! @param {string} char Character to check
     * ! @returns {boolean}
     */
    isValidIdentifierStart(char) {
        // !  According to ECMAScript spec, identifiers start with letters, $, or _
        return /[a-zA-Z_$]/.test(char);
    }

    /**
     * ! ตรวจสอบว่าตัวอักษรสามารถเป็นส่วนหนึ่งของ Identifier ได้หรือไม่
     * ! (a-z, A-Z, 0-9, _, $)
     * ! @param {string} char Character to check
     * ! @returns {boolean}
     */
    isValidIdentifierChar(char) {
        // !  Subsequent characters can also include numbers
        return /[a-zA-Z0-9_$]/.test(char);
    }

    /**
     * ! ค้นหา punctuation ตัวอักษรเดี่ยวจากแกรมมาร์
     * ! @param {string} char Character to check
     * ! @returns {Object} { found: boolean, punctuation?: string, type?: string }
     */
    findPunctuation(char) {
        // !  ! FIX: ใช้ punctuationMap ที่ build แล้วแทน grammar.punctuation โดยตรง
        const punctuationData = this.punctuationMap.get(char);
        if (punctuationData) {
            return {
                found: true,
                punctuation: char,
                type: punctuationData.type || 'unknown',
                data: punctuationData
            };
        }

        return { found: false };
    }

    // !  ===========================================================================
    // !  Statistics
    // !  ===========================================================================

    /**
     * ! Get index statistics
     * ! @returns {Object}
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
     * ! Visualize trie structures (for debugging)
     * ! @returns {Object}
     */
    visualizeTries() {
        return {
            operators: this.operatorTrie.visualize(),
            keywords: this.keywordTrie.visualize(),
            punctuation: this.punctuationTrie.visualize()
        };
    }

    /**
     * ! Get patterns for specific rule - SINGLE SOURCE OF TRUTH from ABSOLUTE_RULES
     * ! @param {string} ruleId - Rule ID (เช่น 'NO_MOCKING', 'NO_INTERNAL_CACHING') 
     * ! @returns {Array} Array of pattern objects extracted from grammar
     */
    getPatternsForRule(ruleId) {
        // ! FIX: อ่านจาก this.grammar แทนการ Hardcode
        if (!this.grammar || !this.grammar[ruleId]) {
            throw new Error(`GrammarIndex.getPatternsForRule: Rule '${ruleId}' not found in grammar. Available rules: ${this.grammar ? Object.keys(this.grammar).join(', ') : 'none'}`);
        }
        
        const rule = this.grammar[ruleId];
        const patterns = [];
        
        // !  แปลง patterns จาก ABSOLUTE_RULES format เป็น format ที่ SmartParserEngine ต้องการ
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
        
        // !  COMPLIANCE: NO_HARDCODE - removed hardcoded patterns
        // !  All patterns now come from ABSOLUTE_RULES as single source of truth
        // !  No additional patterns added here to maintain rule integrity
        
        console.log(` GrammarIndex: Retrieved ${patterns.length} patterns for rule ${ruleId} from grammar`);
        return patterns;
    }

    // !  ===========================================================================
    // !  TOKEN TYPE IDENTIFICATION - For Tokenizer
    // !  ===========================================================================
    // !  PURPOSE: Tokenizer ถามว่า character นี้คืออะไร โดยไม่ต้อง hardcode
    // !  ===========================================================================

    /**
     * ! ระบุประเภทของ token จาก character และ context
     * ! @param {string} char - Current character
     * ! @param {string} input - Full input string
     * ! @param {number} position - Current position
     * ! @returns {{type: string, isComment: boolean, isString: boolean, isRegex: boolean, startPattern: string, endPattern: string, quote: string}}
     */
    identifyTokenType(char, input, position) {
        // เช็ค 2 ตัวอักษร (เช่น //, /*)
        if (position + 1 < input.length) {
            const twoChar = char + input[position + 1];
            
            // Single-line comment: //
            if (twoChar === '//') {
                return {
                    type: 'COMMENT',
                    isComment: true,
                    isString: false,
                    isRegex: false,
                    startPattern: '//',
                    endPattern: '\n',
                    length: 2
                };
            }
            
            // Multi-line comment: /* */
            if (twoChar === '/*') {
                return {
                    type: 'COMMENT',
                    isComment: true,
                    isString: false,
                    isRegex: false,
                    startPattern: '/*',
                    endPattern: '*/',
                    length: 2
                };
            }
        }
        
        // String quotes: ", ', `
        if (char === '"') {
            return {
                type: 'STRING',
                isComment: false,
                isString: true,
                isRegex: false,
                quote: '"',
                length: 1
            };
        }
        
        if (char === "'") {
            return {
                type: 'STRING',
                isComment: false,
                isString: true,
                isRegex: false,
                quote: "'",
                length: 1
            };
        }
        
        if (char === '`') {
            return {
                type: 'STRING',
                isComment: false,
                isString: true,
                isRegex: false,
                quote: '`',
                length: 1
            };
        }
        
        // เช็คว่าเป็น regex หรือไม่ (ต้องมี context)
        // TODO: ใช้ grammar disambiguation rules
        
        return {
            type: 'UNKNOWN',
            isComment: false,
            isString: false,
            isRegex: false,
            length: 0
        };
    }


}

export default GrammarIndex;
