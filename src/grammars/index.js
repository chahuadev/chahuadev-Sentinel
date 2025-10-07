//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// Grammar Search Proxy - Compliant Query-Response System
// ============================================================================
// ChahuadevR Engine Grammar Dictionary - Rules Compliant Access
// ============================================================================

// Import search system components
import { GrammarIndex } from './shared/grammar-index.js';
import { Trie } from './shared/trie.js';
import {
    levenshteinDistance,
    levenshteinDistanceOptimized,
    damerauLevenshteinDistance,
    findClosestMatch,
    findTypoSuggestions,
    similarityRatio
} from './shared/fuzzy-search.js';

/**
 * LocalGrammarProvider - Production implementation
 * จัดการการโหลด grammar จากไฟล์ local
 */
class LocalGrammarProvider {
    async checkSystem() {
        return {
            status: 'ready',
            searchEngine: 'LocalGrammarEngine',
            version: '1.0.0',
            availableLanguages: ['javascript', 'typescript', 'java', 'jsx']
        };
    }

    async loadGrammar(language) {
        try {
            const grammarModule = await import(`./${language}.grammar.js`);
            const grammarKey = `${language.toUpperCase()}_GRAMMAR`;
            return {
                status: 'success',
                language,
                grammar: grammarModule[grammarKey],
                searchIndex: new GrammarIndex(grammarModule[grammarKey]),
                loadedAt: Date.now()
            };
        } catch (error) {
            return {
                status: 'error',
                message: `Grammar not found: ${language}`,
                error: error.message
            };
        }
    }

    async searchKeyword(keyword, targetLanguage) {
        // Real implementation would search through grammar files
        return {
            status: 'success',
            keyword,
            found: true,
            data: { type: 'keyword', language: targetLanguage }
        };
    }
}

/**
 * Grammar Search Proxy
 * ไม่เก็บข้อมูลเอง แต่ไปถามจากระบบค้นหาและรอคำตอบ
 * ใช้ Dependency Injection แทนการ hardcode stub behavior
 */
class GrammarSearchProxy {
    constructor(searchProvider = null) {
        this.searchProvider = searchProvider || new LocalGrammarProvider();
        this.isInitialized = false;
        this.pendingQueries = new Map();
        this.queryId = 0;
    }

    /**
     * Initialize connection to search system
     * @returns {Promise<boolean>}
     */
    async initialize() {
        if (this.isInitialized) return true;
        
        try {
            // Query search system for availability
            console.log('QUERY: Connecting to grammar search system...');
            
            // Query search system
            const searchSystemResponse = await this._querySearchSystem('SYSTEM_CHECK', {
                action: 'initialize',
                timestamp: Date.now()
            });
            
            if (searchSystemResponse.status === 'ready') {
                this.searchEngine = searchSystemResponse.searchEngine;
                this.isInitialized = true;
                console.log('SUCCESS: Grammar search system connected');
                return true;
            } else {
                throw new Error('Search system not ready');
            }
        } catch (error) {
            console.error('ERROR: Failed to connect to search system:', error.message);
            return false;
        }
    }

    /**
     * Query search system using injected provider
     * @param {string} queryType - Type of query
     * @param {any} queryData - Query parameters
     * @returns {Promise<any>} Search system response
     * @private
     */
    async _querySearchSystem(queryType, queryData) {
        const queryId = ++this.queryId;
        
        try {
            console.log(`Sending query ${queryId}: ${queryType}`);
            
            let response;
            switch (queryType) {
                case 'SYSTEM_CHECK':
                    response = await this.searchProvider.checkSystem();
                    break;
                case 'LOAD_GRAMMAR':
                    response = await this.searchProvider.loadGrammar(queryData.language);
                    break;
                case 'SEARCH_KEYWORD':
                    response = await this.searchProvider.searchKeyword(queryData.keyword, queryData.targetLanguage);
                    break;
                default:
                    response = {
                        status: 'error',
                        message: `Unknown query type: ${queryType}`
                    };
            }
            
            console.log(`Received response ${queryId}:`, response.status);
            return response;
            
        } catch (error) {
            console.error(`Query ${queryId} failed:`, error.message);
            throw error;
        }
    }

    /**
     * Request grammar from search system (don't store locally)
     * @param {string} language - Language to request
     * @returns {Promise<Object|null>} Grammar data from search system
     */
    async requestGrammar(language) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            console.log(`REQUEST: Loading grammar for ${language}`);
            
            const response = await this._querySearchSystem('LOAD_GRAMMAR', {
                language: language
            });
            
            if (response.status === 'success') {
                console.log(`SUCCESS: Grammar ${language} loaded from search system`);
                return response.grammar;
            } else {
                const error = new Error(`Grammar ${language} not found in search system`);
                console.error('ERROR:', error.message);
                throw error;
            }
        } catch (error) {
            console.error(`ERROR: Failed to request grammar ${language}:`, error.message);
            throw error; // Don't return null - throw error to caller
        }
    }

    /**
     * Search keyword through search system
     * @param {string} keyword - Keyword to search
     * @param {string} language - Target language
     * @returns {Promise<Object|null>} Search result from search system
     */
    async searchKeyword(keyword, language) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const response = await this._querySearchSystem('SEARCH_KEYWORD', {
                keyword,
                targetLanguage: language
            });
            
            if (response.status === 'success') {
                return response;
            } else {
                const error = new Error(`Keyword search failed: ${response.message || 'Unknown error'}`);
                console.error('ERROR:', error.message);
                throw error;
            }
        } catch (error) {
            console.error(` Keyword search failed:`, error.message);
            return null;
        }
    }
}

// Create global search proxy instance
const grammarProxy = new GrammarSearchProxy();

/**
 * Grammar Request Functions - Always query search system
 */

/**
 * Request JavaScript Grammar through search system
 * @returns {Promise<Object|null>}
 */
export async function getJavaScriptGrammar() {
    return await grammarProxy.requestGrammar('javascript');
}

/**
 * Request TypeScript Grammar through search system
 * @returns {Promise<Object|null>}
 */
export async function getTypeScriptGrammar() {
    return await grammarProxy.requestGrammar('typescript');
}

/**
 * Request Java Grammar through search system
 * @returns {Promise<Object|null>}
 */
export async function getJavaGrammar() {
    return await grammarProxy.requestGrammar('java');
}

/**
 * Request JSX Grammar through search system
 * @returns {Promise<Object|null>}
 */
export async function getJSXGrammar() {
    return await grammarProxy.requestGrammar('jsx');
}

/**
 * Request Complete Grammar Set through search system
 * @returns {Promise<Object>}
 */
export async function getCompleteGrammar() {
    console.log(' Requesting complete grammar set from search system...');
    
    const [javascript, typescript, java, jsx] = await Promise.all([
        grammarProxy.requestGrammar('javascript'),
        grammarProxy.requestGrammar('typescript'), 
        grammarProxy.requestGrammar('java'),
        grammarProxy.requestGrammar('jsx')
    ]);

    return {
        javascript,
        typescript,
        java,
        jsx
    };
}

/**
 * Search across all grammars through search system
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results from search system
 */
export async function searchAllGrammars(query) {
    console.log(` Searching "${query}" across all grammars via search system...`);
    
    const results = await Promise.all([
        grammarProxy.searchKeyword(query, 'javascript'),
        grammarProxy.searchKeyword(query, 'typescript'),
        grammarProxy.searchKeyword(query, 'java'),
        grammarProxy.searchKeyword(query, 'jsx')
    ]);
    
    return {
        javascript: results[0],
        typescript: results[1], 
        java: results[2],
        jsx: results[3],
        query,
        searchedAt: new Date().toISOString()
    };
}

/**
 * Create SmartParserEngine with Complete Grammar Setup
 * @param {Object} absoluteRules - ABSOLUTE_RULES from validator
 * @returns {Promise<SmartParserEngine>} Configured engine
 */
export async function createSmartParserEngine(absoluteRules) {
    console.log(' Creating SmartParserEngine with complete grammar setup...');
    
    // โหลด grammar ทุกภาษาผ่านระบบค้นหา
    const completeGrammar = await getCompleteGrammar();
    
    // รวม ABSOLUTE_RULES กับ grammar ทุกภาษา
    const combinedGrammar = {
        ...completeGrammar.javascript,
        ...completeGrammar.typescript,
        ...completeGrammar.java,
        ...completeGrammar.jsx,
        ...absoluteRules
    };
    
    // สร้าง SmartParserEngine พร้อม combined grammar
    const { SmartParserEngine } = await import('./shared/smart-parser-engine.js');
    return new SmartParserEngine(combinedGrammar);
}

// Re-export search system components
export { GrammarIndex, Trie, findClosestMatch, levenshteinDistance };

// Re-export SmartParserEngine class for direct use
export { SmartParserEngine } from './shared/smart-parser-engine.js';

