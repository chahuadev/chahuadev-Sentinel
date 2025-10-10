// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// !  TOKENIZER BRAIN ADAPTER
// ! ══════════════════════════════════════════════════════════════════════════════
// !  หน้าที่: เชื่อม PureBinaryTokenizer กับ GrammarIndex
// !  
// !  Tokenizer (tokenizer-helper.js) ต้องการ Brain object ที่มี:
// !    - identifyTokenType(char, input, position)
// !    - isKeyword(word)
// !    - findLongestOperator(input, position)
// !    - findLongestPunctuation(input, position)
// !  
// !  Brain Adapter จะแปลงคำถามจาก Tokenizer → searchByType() ของ GrammarIndex
// ! ══════════════════════════════════════════════════════════════════════════════

import { GrammarIndex } from './grammar-index.js';

/**
 * ============================================================================
 * TOKENIZER BRAIN ADAPTER
 * ============================================================================
 * แปลงคำถามจาก Tokenizer เป็นการเรียก GrammarIndex.searchByType()
 */
export class TokenizerBrainAdapter {
    constructor(language = 'javascript') {
        this.language = language;
        this.grammarCache = null;
    }

    /**
     * โหลด grammar ครั้งเดียว แล้วเก็บไว้ใน cache
     */
    async ensureGrammarLoaded() {
        if (!this.grammarCache) {
            this.grammarCache = await GrammarIndex.loadGrammar(this.language);
        }
        return this.grammarCache;
    }

    /**
     * ตรวจสอบว่า character ปัจจุบันเป็น token type อะไร
     * ใช้โดย: computeToken() ใน tokenizer-helper.js
     */
    async identifyTokenType(char, input, position) {
        await this.ensureGrammarLoaded();
        
        // ตรวจสอบ Comment patterns
        const commentResult = await this._checkComment(input, position);
        if (commentResult.isComment) {
            return commentResult;
        }

        // ตรวจสอบ String patterns
        const stringResult = this._checkString(char, input, position);
        if (stringResult.isString) {
            return stringResult;
        }

        // ไม่ใช่ comment/string = ให้ tokenizer จัดการต่อ
        return {
            isComment: false,
            isString: false,
            isUnknown: true
        };
    }

    /**
     * ตรวจสอบว่าเป็น comment หรือไม่
     * ค้นหาใน section 'comments'
     */
    async _checkComment(input, position) {
        const grammar = await this.ensureGrammarLoaded();
        const commentsSection = grammar.comments;

        if (!commentsSection) {
            return { isComment: false };
        }

        // ตรวจสอบ single-line comment
        if (commentsSection.singleLine) {
            const start = commentsSection.singleLine.start;
            const end = commentsSection.singleLine.end;
            
            if (input.substr(position, start.length) === start) {
                return {
                    isComment: true,
                    type: 'singleLine',
                    startPattern: start,
                    endPattern: end
                };
            }
        }

        // ตรวจสอบ multi-line comment
        if (commentsSection.multiLine) {
            const start = commentsSection.multiLine.start;
            const end = commentsSection.multiLine.end;
            
            if (input.substr(position, start.length) === start) {
                return {
                    isComment: true,
                    type: 'multiLine',
                    startPattern: start,
                    endPattern: end
                };
            }
        }

        return { isComment: false };
    }

    /**
     * ตรวจสอบว่าเป็น string หรือไม่
     * ค้นหาใน section 'literals'
     */
    _checkString(char, input, position) {
        // String quotes: " ' `
        if (char === '"' || char === "'" || char === '`') {
            return {
                isString: true,
                quote: char
            };
        }

        return { isString: false };
    }

    /**
     * ตรวจสอบว่า word เป็น keyword หรือไม่
     * ใช้โดย: computeIdentifierOrKeyword() ใน tokenizer-helper.js
     */
    async isKeyword(word) {
        try {
            const result = await GrammarIndex.searchByType(this.language, 'keyword', word);
            return result.found;
        } catch (error) {
            return false;
        }
    }

    /**
     * หา longest operator match
     * ใช้โดย: computeOperatorOrPunctuation() ใน tokenizer-helper.js
     */
    async findLongestOperator(input, position) {
        const grammar = await this.ensureGrammarLoaded();
        const operatorsSection = grammar.operators;

        if (!operatorsSection) {
            return { found: false };
        }

        let longestMatch = null;
        let longestLength = 0;

        // ตรวจสอบทุก operator
        for (const [operator, data] of Object.entries(operatorsSection)) {
            // ข้าม metadata fields
            if (operator.startsWith('__section_')) continue;

            // ตรวจสอบว่าตรงกับ input หรือไม่
            if (input.substr(position, operator.length) === operator) {
                if (operator.length > longestLength) {
                    longestMatch = operator;
                    longestLength = operator.length;
                }
            }
        }

        if (longestMatch) {
            return {
                found: true,
                operator: longestMatch,
                length: longestLength,
                data: operatorsSection[longestMatch]
            };
        }

        return { found: false };
    }

    /**
     * หา longest punctuation match
     * ใช้โดย: computeOperatorOrPunctuation() ใน tokenizer-helper.js
     */
    async findLongestPunctuation(input, position) {
        const grammar = await this.ensureGrammarLoaded();
        const punctuationSection = grammar.punctuation;

        if (!punctuationSection) {
            return { found: false };
        }

        let longestMatch = null;
        let longestLength = 0;

        // ตรวจสอบทุก punctuation
        for (const [punct, data] of Object.entries(punctuationSection)) {
            // ข้าม metadata fields
            if (punct.startsWith('__section_')) continue;

            // ตรวจสอบว่าตรงกับ input หรือไม่
            if (input.substr(position, punct.length) === punct) {
                if (punct.length > longestLength) {
                    longestMatch = punct;
                    longestLength = punct.length;
                }
            }
        }

        if (longestMatch) {
            return {
                found: true,
                punctuation: longestMatch,
                length: longestLength,
                data: punctuationSection[longestMatch]
            };
        }

        return { found: false };
    }

    /**
     * เปลี่ยนภาษา
     */
    setLanguage(language) {
        if (this.language !== language) {
            this.language = language;
            this.grammarCache = null; // Clear cache
        }
    }

    /**
     * Get current language
     */
    getLanguage() {
        return this.language;
    }
}

export default TokenizerBrainAdapter;
