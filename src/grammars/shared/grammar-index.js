//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// Grammar Index System - Section-Based Search
// ============================================================================
// หน้าที่: ค้นหาจาก grammar files โดยใช้ language และ type (ประเภท)
// Tokenizer ส่ง language + type มา  GrammarIndex ค้นหาจาก section + type  ส่งผลกลับ
// ไม่เก็บ hardcode grammar ใดๆ - ค้นหาจากไฟล์ JSON เท่านั้น
//============================================================================

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import errorHandler from '../../error-handler/ErrorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class GrammarIndex {
    /**
     * Constructor - รับ grammar object โดยตรง (สำหรับ SmartParserEngine)
     * @param {Object} grammarData - Grammar object ที่โหลดมาแล้ว
     */
    constructor(grammarData = null) {
        if (grammarData) {
            // Store grammar data for instance methods
            this.grammar = grammarData;
            
            // Debug: Check what sections are available
            console.log('[GrammarIndex] Constructor received grammar with sections:');
            console.log('  - keywords:', !!grammarData.keywords, Object.keys(grammarData.keywords || {}).length);
            console.log('  - operators:', !!grammarData.operators, Object.keys(grammarData.operators || {}).length);
            console.log('  - punctuation:', !!grammarData.punctuation, Object.keys(grammarData.punctuation || {}).length);
            console.log('  - literals:', !!grammarData.literals);
            console.log('  - comments:', !!grammarData.comments);
        }
    }
    
    /**
     * ค้นหาจาก language และ type (สำหรับ Tokenizer)
     * @param {string} language - ภาษา (javascript, typescript, java, jsx)
     * @param {string} type - ประเภท (keyword, operator, punctuation, literal, etc.)
     * @param {string} itemName - ชื่อ item ที่ต้องการค้นหา
     * @returns {Promise<Object>} ผลลัพธ์การค้นหา
     */
    static async searchByType(language, type, itemName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        
        // ค้นหา section ที่ตรงกับ type
        const sectionName = GrammarIndex._mapTypeToSection(type);
        
        if (!sectionName || !grammar[sectionName]) {
            return {
                found: false,
                error: `Section for type '${type}' not found in ${language} grammar`
            };
        }

        const section = grammar[sectionName];
        if (section[itemName]) {
            return {
                found: true,
                language,
                type,
                section: sectionName,
                item: itemName,
                data: section[itemName],
                metadata: await GrammarIndex.getSectionMetadata(language, sectionName)
            };
        }

        return {
            found: false,
            language,
            type,
            section: sectionName,
            item: itemName,
            error: `Item '${itemName}' not found in section '${sectionName}'`
        };
    }

    /**
     * แปลง type เป็น section name
     * @param {string} type - ประเภท (keyword, operator, etc.)
     * @returns {string} section name
     * @private
     */
    static _mapTypeToSection(type) {
        const typeMapping = {
            // JavaScript/TypeScript
            'keyword': 'keywords',
            'reserved': 'keywords',
            'operator': 'operators',
            'punctuation': 'punctuation',
            'literal': 'literals',
            'separator': 'punctuation',
            
            // Java
            'modifier': 'modifiers',
            'primitiveType': 'primitiveTypes',
            'annotation': 'annotations',
            
            // JSX
            'element': 'elements',
            'expression': 'expressions',
            'attribute': 'attributes',
            'component': 'builtInComponents',
            
            // TypeScript
            'typeKeyword': 'typeKeywords',
            'typeOperator': 'typeOperators',
            'declaration': 'declarations',
            'moduleKeyword': 'moduleKeywords'
        };

        return typeMapping[type] || type;
    }

    static async loadGrammar(language) {
        try {
            const grammarPath = join(__dirname, 'grammars', `${language}.grammar.json`);
            const grammarData = JSON.parse(readFileSync(grammarPath, 'utf8'));
            
            // ! CRITICAL FIX: Flatten nested operators and punctuation structures
            // ! WHY: javascript.grammar.json has nested structure (binaryOperators, unaryOperators, etc.)
            // ! BUT: Tokenizer expects flat objects like { "+": {...}, "-": {...} }
            if (grammarData.operators && typeof grammarData.operators === 'object') {
                const flatOperators = {};
                for (const category in grammarData.operators) {
                    if (typeof grammarData.operators[category] === 'object') {
                        Object.assign(flatOperators, grammarData.operators[category]);
                    }
                }
                grammarData.operators = flatOperators;
            }
            
            // Note: punctuation seems to be flat already, but check anyway
            // If needed, we can apply same flattening logic here
            
            // Debug: Check loaded grammar
            console.log(`[GrammarIndex] Loaded ${language} grammar from file:`);
            console.log('  - keywords:', Object.keys(grammarData.keywords || {}).length);
            console.log('  - operators:', Object.keys(grammarData.operators || {}).length);
            console.log('  - punctuation:', Object.keys(grammarData.punctuation || {}).length);
            console.log('  - literals:', !!grammarData.literals);
            console.log('  - comments:', !!grammarData.comments);
            
            return grammarData;
        } catch (error) {
            errorHandler.handleError(error, {
                source: 'GrammarIndex',
                method: 'loadGrammar',
                severity: 'CRITICAL',
                context: `Failed to load grammar for ${language} - Grammar file not found or invalid JSON format`
            });
            throw new Error(`Failed to load grammar for ${language}: ${error.message}`);
        }
    }

    static async loadAllGrammars() {
        const [javascript, typescript, java, jsx] = await Promise.all([
            GrammarIndex.loadGrammar('javascript'),
            GrammarIndex.loadGrammar('typescript'),
            GrammarIndex.loadGrammar('java'),
            GrammarIndex.loadGrammar('jsx')
        ]);
        return { javascript, typescript, java, jsx };
    }

    static async searchBySection(language, sectionNumber, itemName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        const sectionKey = `__section_${String(sectionNumber).padStart(2, '0')}_name`;
        const sectionName = grammar[sectionKey];
        
        if (!sectionName) {
            return {
                found: false,
                error: `Section ${sectionNumber} not found in ${language} grammar`
            };
        }
        return await GrammarIndex.search(language, sectionName, itemName);
    }

    static async search(language, sectionName, itemName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        
        if (!grammar[sectionName]) {
            return {
                found: false,
                error: `Section '${sectionName}' not found in ${language} grammar`
            };
        }

        const section = grammar[sectionName];
        if (section[itemName]) {
            return {
                found: true,
                language,
                section: sectionName,
                item: itemName,
                data: section[itemName],
                metadata: await GrammarIndex.getSectionMetadata(language, sectionName)
            };
        }

        return {
            found: false,
            language,
            section: sectionName,
            item: itemName,
            error: `Item '${itemName}' not found in section '${sectionName}'`
        };
    }

    static async getSectionMetadata(language, sectionName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        
        let sectionNumber = null;
        for (let i = 1; i <= 20; i++) {
            const numKey = `__section_${String(i).padStart(2, '0')}_number`;
            const nameKey = `__section_${String(i).padStart(2, '0')}_name`;
            
            if (grammar[nameKey] === sectionName) {
                sectionNumber = i;
                break;
            }
        }

        if (!sectionNumber) {
            return null;
        }

        const prefix = `__section_${String(sectionNumber).padStart(2, '0')}`;
        
        return {
            number: grammar[`${prefix}_number`],
            name: grammar[`${prefix}_name`],
            title: grammar[`${prefix}_title`],
            language: grammar[`${prefix}_language`],
            total_items: grammar[`${prefix}_total_items`],
            description: grammar[`${prefix}_description`],
            purpose: grammar[`${prefix}_purpose`],
            responsibility: grammar[`${prefix}_responsibility`],
            used_by: grammar[`${prefix}_used_by`],
            footer: grammar[`${prefix}_footer`]
        };
    }

    /**
     * ค้นหาหลายรายการพร้อมกัน (Batch search สำหรับ Tokenizer)
     * @param {string} language - ภาษา
     * @param {Array<{type: string, itemName: string}>} requests - รายการคำขอ
     * @returns {Promise<Array<Object>>} ผลลัพธ์ทั้งหมด
     */
    static async batchSearch(language, requests) {
        const results = await Promise.all(
            requests.map(req => GrammarIndex.searchByType(language, req.type, req.itemName))
        );
        return results;
    }

    /**
     * ตรวจสอบว่า item เป็นประเภทใดในภาษานั้นๆ
     * @param {string} language - ภาษา
     * @param {string} itemName - ชื่อ item
     * @returns {Promise<Object>} { found, type, section, data }
     */
    static async identifyType(language, itemName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        
        // ลอง search ในทุก section
        const possibleSections = [
            'keywords', 'operators', 'punctuation', 'literals',
            'modifiers', 'primitiveTypes', 'annotations',
            'typeKeywords', 'typeOperators', 'declarations', 'moduleKeywords',
            'elements', 'expressions', 'attributes'
        ];

        for (const sectionName of possibleSections) {
            if (grammar[sectionName] && grammar[sectionName][itemName]) {
                return {
                    found: true,
                    language,
                    type: GrammarIndex._reverseMapSection(sectionName),
                    section: sectionName,
                    item: itemName,
                    data: grammar[sectionName][itemName]
                };
            }
        }

        return {
            found: false,
            language,
            item: itemName,
            error: `Item '${itemName}' not found in any section of ${language} grammar`
        };
    }

    /**
     * แปลง section name กลับเป็น type
     * @param {string} sectionName - ชื่อ section
     * @returns {string} type
     * @private
     */
    static _reverseMapSection(sectionName) {
        const reverseMapping = {
            'keywords': 'keyword',
            'operators': 'operator',
            'punctuation': 'punctuation',
            'literals': 'literal',
            'modifiers': 'modifier',
            'primitiveTypes': 'primitiveType',
            'annotations': 'annotation',
            'typeKeywords': 'typeKeyword',
            'typeOperators': 'typeOperator',
            'declarations': 'declaration',
            'moduleKeywords': 'moduleKeyword',
            'elements': 'element',
            'expressions': 'expression',
            'attributes': 'attribute',
            'builtInComponents': 'component'
        };

        return reverseMapping[sectionName] || sectionName;
    }

    /**
     * ค้นหาข้อมูล keyword จาก grammar (instance method - ไม่ hardcode)
     * @param {string} keyword - ชื่อ keyword (เช่น 'if', 'for', 'const')
     * @returns {Object|null} ข้อมูล keyword จาก grammar หรือ null ถ้าไม่เจอ
     */
    getKeywordInfo(keyword) {
        if (!this.grammar || !this.grammar.keywords) {
            return null;
        }

        const keywordData = this.grammar.keywords[keyword];
        if (!keywordData) {
            return null;
        }

        // คืนค่าข้อมูลจาก Grammar โดยตรง (ไม่ hardcode)
        return keywordData;
    }

    /**
     * ตรวจสอบว่า keyword มี subcategory ตรงกับที่ระบุหรือไม่ (section-based)
     * @param {string} keyword - ชื่อ keyword
     * @param {string} subcategory - subcategory ที่ต้องการตรวจสอบ (เช่น 'variableDeclaration', 'functionDeclaration', 'ifStatement')
     * @returns {boolean}
     */
    isKeywordSubcategory(keyword, subcategory) {
        const keywordInfo = this.getKeywordInfo(keyword);
        if (!keywordInfo) {
            return false;
        }
        return keywordInfo.subcategory === subcategory;
    }

    /**
     * ดึง subcategory ของ keyword (section-based)
     * @param {string} keyword - ชื่อ keyword
     * @returns {string|null}
     */
    getKeywordSubcategory(keyword) {
        const keywordInfo = this.getKeywordInfo(keyword);
        return keywordInfo ? keywordInfo.subcategory : null;
    }

    /**
     * ตรวจสอบว่า keyword เป็น unary keyword หรือไม่ (section-based)
     * @param {string} keyword - ชื่อ keyword (เช่น 'typeof', 'void', 'delete')
     * @returns {boolean}
     */
    isUnaryKeyword(keyword) {
        const keywordInfo = this.getKeywordInfo(keyword);
        if (!keywordInfo) {
            return false;
        }
        // ตรวจสอบจาก subcategory หรือ property ที่บ่งบอกว่าเป็น unary
        return keywordInfo.subcategory === 'unaryOperator' || 
               keywordInfo.category === 'unary' ||
               (keywordInfo.usage && keywordInfo.usage.includes('unary'));
    }

    /**
     * ตรวจสอบว่า operator เป็น assignment operator หรือไม่ (อ่านจาก Grammar - NO_HARDCODE)
     * @param {string} operator - ตัว operator (เช่น '=', '+=', '-=')
     * @returns {boolean}
     */
    isAssignmentOperator(operator) {
        if (!this.grammar || !this.grammar.operators) {
            return false;
        }

        const assignmentOps = this.grammar.operators.assignmentOperators;
        if (!assignmentOps) {
            return false;
        }

        return assignmentOps.hasOwnProperty(operator);
    }

    /**
     * ตรวจสอบว่า operator เป็น logical operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '&&', '||', '??')
     * @returns {boolean}
     */
    isLogicalOperator(operator) {
        return this._isOperatorCategory(operator, 'logical');
    }

    /**
     * ตรวจสอบว่า operator เป็น equality operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '===', '!==')
     * @returns {boolean}
     */
    isEqualityOperator(operator) {
        return this._isOperatorCategory(operator, 'equality');
    }

    /**
     * ตรวจสอบว่า operator เป็น relational operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '<', '>', '<=', '>=')
     * @returns {boolean}
     */
    isRelationalOperator(operator) {
        return this._isOperatorCategory(operator, 'relational');
    }

    /**
     * ตรวจสอบว่า operator เป็น additive operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '+', '-')
     * @returns {boolean}
     */
    isAdditiveOperator(operator) {
        return this._isOperatorCategory(operator, 'additive');
    }

    /**
     * ตรวจสอบว่า operator เป็น multiplicative operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '*', '/', '%')
     * @returns {boolean}
     */
    isMultiplicativeOperator(operator) {
        return this._isOperatorCategory(operator, 'multiplicative');
    }

    /**
     * ตรวจสอบว่า operator เป็น unary operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '!', '-', '+', 'typeof')
     * @returns {boolean}
     */
    isUnaryOperator(operator) {
        if (!this.grammar || !this.grammar.operators) {
            return false;
        }

        const unaryOps = this.grammar.operators.unaryOperators;
        if (!unaryOps) {
            return false;
        }

        return unaryOps.hasOwnProperty(operator);
    }

    /**
     * ฟังก์ชันช่วยตรวจสอบ operator category จาก Grammar (NO_HARDCODE)
     * @param {string} operator - ตัว operator
     * @param {string} category - category ที่ต้องการตรวจสอบ
     * @returns {boolean}
     * @private
     */
    _isOperatorCategory(operator, category) {
        if (!this.grammar || !this.grammar.operators) {
            return false;
        }

        const binaryOps = this.grammar.operators.binaryOperators;
        if (!binaryOps) {
            return false;
        }

        const operatorData = binaryOps[operator];
        if (!operatorData) {
            return false;
        }

        return operatorData.category === category;
    }

    /**
     * แปลง punctuation character เป็น binary constant (100% BINARY)
     * @param {string} punctuation - ตัว punctuation (เช่น '(', ')', '{', '}')
     * @returns {number} - binary constant หรือ 0 ถ้าไม่พบ
     */
    getPunctuationBinary(punctuation) {
        if (!this.config || !this.config.punctuationBinaryMap) {
            return 0;
        }
        return this.config.punctuationBinaryMap.map[punctuation] || 0;
    }

    /**
     * แปลง binary constant กลับเป็น punctuation character
     * @param {number} binary - binary constant
     * @returns {string|null} - punctuation character หรือ null ถ้าไม่พบ
     */
    getPunctuationFromBinary(binary) {
        if (!this.config || !this.config.punctuationBinaryMap) {
            return null;
        }
        return this.config.punctuationBinaryMap.reverseLookup[binary.toString()] || null;
    }
}

