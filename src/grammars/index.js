//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// Grammar Entry/Exit Point - NO LOGIC, ONLY ROUTING
// ============================================================================
// หน้าที่: ทางเข้า-ทางออกเท่านั้น ไม่มีโลจิกใดๆ
// ส่งต่อ request ไปยัง grammar-index.js และรอรับ response กลับมา
// ============================================================================

import { GrammarIndex } from './shared/grammar-index.js';
import { SmartParserEngine } from '../../test/violation-examples/smart-parser-engine.js';
import { PureBinaryParser } from './shared/pure-binary-parser.js';
import { BinaryComputationTokenizer } from './shared/tokenizer-helper.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Create Smart Parser Engine instance (Factory Function)
 * @param {Object} rules - Validation rules
 * @returns {Promise<SmartParserEngine>}
 */
export async function createSmartParserEngine(rules) {
    const grammar = await GrammarIndex.loadGrammar('javascript');
    
    // Load parser config
    const configPath = join(__dirname, 'shared', 'parser-config.json');
    const parserConfig = JSON.parse(readFileSync(configPath, 'utf8'));
    
    // Merge rules into config
    const fullConfig = {
        ...parserConfig,
        rules: rules
    };
    
    return new SmartParserEngine(grammar, fullConfig);
}

/**
 * Request JavaScript Grammar - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object|null>}
 */
export async function getJavaScriptGrammar() {
    return await GrammarIndex.loadGrammar('javascript');
}

/**
 * Request TypeScript Grammar - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object|null>}
 */
export async function getTypeScriptGrammar() {
    return await GrammarIndex.loadGrammar('typescript');
}

/**
 * Request Java Grammar - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object|null>}
 */
export async function getJavaGrammar() {
    return await GrammarIndex.loadGrammar('java');
}

/**
 * Request JSX Grammar - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object|null>}
 */
export async function getJSXGrammar() {
    return await GrammarIndex.loadGrammar('jsx');
}

/**
 * Request Complete Grammar Set - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object>}
 */
export async function getCompleteGrammar() {
    return await GrammarIndex.loadAllGrammars();
}

/**
 * Search in grammar by section and name - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา (javascript, typescript, java, jsx)
 * @param {string} sectionName - ชื่อ section (keywords, operators, etc.)
 * @param {string} itemName - ชื่อ item ที่ต้องการค้นหา
 * @returns {Promise<Object>}
 */
export async function searchGrammar(language, sectionName, itemName) {
    return await GrammarIndex.search(language, sectionName, itemName);
}

/**
 * Search by section number - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา
 * @param {number} sectionNumber - หมายเลข section
 * @param {string} itemName - ชื่อ item
 * @returns {Promise<Object>}
 */
export async function searchBySectionNumber(language, sectionNumber, itemName) {
    return await GrammarIndex.searchBySection(language, sectionNumber, itemName);
}

/**
 * Get section info - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา
 * @param {string} sectionName - ชื่อ section
 * @returns {Promise<Object>}
 */
export async function getSectionInfo(language, sectionName) {
    return await GrammarIndex.getSectionMetadata(language, sectionName);
}

/**
 * Search by type (สำหรับ Tokenizer) - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา (javascript, typescript, java, jsx)
 * @param {string} type - ประเภท (keyword, operator, punctuation, etc.)
 * @param {string} itemName - ชื่อ item ที่ต้องการค้นหา
 * @returns {Promise<Object>} ผลลัพธ์การค้นหา
 */
export async function searchByType(language, type, itemName) {
    return await GrammarIndex.searchByType(language, type, itemName);
}

/**
 * Batch search (ค้นหาหลายรายการพร้อมกัน) - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา
 * @param {Array<{type: string, itemName: string}>} requests - รายการคำขอ
 * @returns {Promise<Array<Object>>} ผลลัพธ์ทั้งหมด
 */
export async function batchSearch(language, requests) {
    return await GrammarIndex.batchSearch(language, requests);
}

/**
 * Identify type of item - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา
 * @param {string} itemName - ชื่อ item
 * @returns {Promise<Object>} { found, type, section, data }
 */
export async function identifyType(language, itemName) {
    return await GrammarIndex.identifyType(language, itemName);
}

// Re-export classes and GrammarIndex for direct access if needed
export { GrammarIndex, SmartParserEngine, PureBinaryParser, BinaryComputationTokenizer };