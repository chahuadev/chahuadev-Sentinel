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
// Tokenizer ส่ง language + type มา → GrammarIndex ค้นหาจาก section + type → ส่งผลกลับ
// ไม่เก็บ hardcode grammar ใดๆ - ค้นหาจากไฟล์ JSON เท่านั้น
//============================================================================

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class GrammarIndex {
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
            return grammarData;
        } catch (error) {
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
}
