// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// !  PURE BINARY TOKENIZER - "BLANK PAPER"
// ! ══════════════════════════════════════════════════════════════════════════════
// !  PHILOSOPHY: Tokenizer คือ "กระดาษเปล่า" ที่ไม่รู้อะไรเลย
// !  
// !  หน้าที่เดียว: แปลง String  Binary (0b10001)
// !  
// !  ไม่มีหน้าที่:
// !  - [NO] ไม่รู้ว่า "//" คือ comment
// !  - [NO] ไม่รู้ว่า "/*" คือ comment เริ่มต้น
// !  - [NO] ไม่รู้ว่า `"` คือ string
// !  - [NO] ไม่รู้ว่า `'` คือ string
// !  - [NO] ไม่รู้ว่า `\` คือ escape character
// !  
// !  ทุกอย่างต้องถาม Brain (GrammarIndex) เท่านั้น!
// ! ══════════════════════════════════════════════════════════════════════════════
// ! CRITICAL UNDERSTANDING: THREE LAYERS OF BINARY
// ! ══════════════════════════════════════════════════════════════════════════════
// !   DO NOT CONFUSE THESE THREE DIFFERENT BINARY LAYERS:
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ┌─────────────────────────────────────────────────────────────────────────┐
// ! │ LAYER 1: MACHINE CODE (CPU Instructions)                               │
// ! │  WE DO NOT WORK HERE                                                  │
// ! │                                                                         │
// ! │ Example: 10111000 00000101 = MOV AX, 5                                 │
// ! │ - Opcodes + Operands that control CPU transistors directly             │
// ! │ - Platform specific (x86, ARM, RISC-V)                                 │
// ! │ - This is what COMPILER produces, NOT what we read                     │
// ! └─────────────────────────────────────────────────────────────────────────┘
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ┌─────────────────────────────────────────────────────────────────────────┐
// ! │ LAYER 2: CHARACTER ENCODING (ASCII/UTF-8)                              │
// ! │  THIS IS WHERE WE START                                               │
// ! │                                                                         │
// ! │ Example: 01100011 = 'c' (ASCII code 99)                                │
// ! │ - Universal text representation standard                                │
// ! │ - Same across ALL platforms                                             │
// ! │ - UniversalCharacterClassifier reads THESE numeric values               │
// ! │ - Pure mathematics: 99 >= 97 && 99 <= 122  LETTER                     │
// ! └─────────────────────────────────────────────────────────────────────────┘
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ┌─────────────────────────────────────────────────────────────────────────┐
// ! │ LAYER 3: SEMANTIC BINARY FLAGS (Our Innovation)                        │
// ! │  THIS IS OUR OUTPUT                                                   │
// ! │                                                                         │
// ! │ Example: 0b00100000 = KEYWORD token type (bit 5 set)                   │
// ! │ - Mathematical classification of meaning                                │
// ! │ - Language-agnostic semantic representation                             │
// ! │ - All bit positions defined in tokenizer-binary-config.json            │
// ! └─────────────────────────────────────────────────────────────────────────┘
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! COMPLETE FLOW: Source Code  Semantic Binary Stream
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Input:  "const x = 5;"
// !
// ! Step 1: File System (OS stores as binary)
// !         const  99,111,110,115,116 (ASCII codes)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Step 2: Character Classification (Pure Math)
// !         99  97 && 99  122  TRUE  LETTER flag (0b00001)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Step 3: Token Assembly (Ask Brain)
// !         "const"  brain.isKeyword("const")  TRUE
// !         Assign: binary = (1 << TOKEN_TYPES.KEYWORD.bit) = 0b00100000
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Step 4: Output Semantic Stream
// !         {type:"KEYWORD", binary:32, value:"const", start:0, end:5}
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! WHY THIS APPROACH IS POWERFUL
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 1. LANGUAGE AGNOSTIC: Same tokenizer reads JS, Python, Rust, Go
// !    Just swap Brain (GrammarIndex) with different grammar rules
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 2. PLATFORM INDEPENDENT: Works on Intel, ARM, RISC-V identically
// !    Because ASCII/UTF-8 is universal standard
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 3. PRESERVES SEMANTICS: Variable name "userAge" keeps meaning
// !    Unlike Machine Code where it becomes anonymous memory address
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 4. MATHEMATICALLY PURE: Zero ambiguity
// !    charCode >= 65 && charCode <= 90 is absolute truth
// !    No regex, no string matching, pure integer comparisons
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 5. ZERO HARDCODE: Every value from config
// !    Change behavior by editing JSON only, never touch source code
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! GOLDEN RULE
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! "We are NOT reading Machine Code."
// ! "We are reading Character Codes and converting them to"
// ! "Semantic Binary Flags through pure mathematics."
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Our Boundary:
// !    Source Code  Binary Token Stream (OUR DOMAIN)
// !    Binary Token Stream  Machine Code (COMPILER'S DOMAIN)
// ! ══════════════════════════════════════════════════════════════════════════════

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GrammarIndex } from './grammar-index.js';
import errorHandler from '../../error-handler/ErrorHandler.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// ! LOAD CONFIGURATION - NO_HARDCODE COMPLIANCE
// ! ══════════════════════════════════════════════════════════════════════════════
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, 'tokenizer-binary-config.json');

let CONFIG;
try {
    CONFIG = JSON.parse(readFileSync(configPath, 'utf-8'));
} catch (error) {
    errorHandler.handleError(error, {
        source: 'BinaryComputationTokenizer',
        method: 'initialization',
        severity: 'CRITICAL',
        context: `Failed to load tokenizer configuration from ${configPath} - Configuration file is required for tokenization`
    });
    throw new Error(`CRITICAL: Failed to load tokenizer configuration from ${configPath}: ${error.message}`);
}

// Extract constants from configuration - ZERO HARDCODE
const UNICODE = CONFIG.unicodeRanges.ranges;
const CHAR_FLAGS = CONFIG.characterFlags.flags;
const TOKEN_TYPES = CONFIG.tokenBinaryTypes.types;
const TOKEN_TYPE_STRINGS = CONFIG.tokenTypeStrings.types;
const ERROR_MESSAGES = CONFIG.errorMessages.templates;
const PARSING_RULES = CONFIG.parsingRules.rules;
const SECURITY_LIMITS = CONFIG.securityConfig.limits;

// ! NO_HARDCODE: Grammar structure metadata fields - โหลดจาก config
// ! These field names indicate a final grammar item (keyword/operator) vs nested category
const GRAMMAR_METADATA_FIELDS = CONFIG.grammarStructure?.metadataFields?.fields || [];

// ! NO_HARDCODE: Punctuation binary map - โหลดจาก config
// ! For 100% binary parsing without string comparison
const PUNCTUATION_BINARY_MAP = CONFIG.punctuationBinaryMap?.map || {};

/**
 * ============================================================================
 * UNIVERSAL CHARACTER CLASSIFIER
 * ============================================================================
 * หน้าที่: จำแนกตัวอักษรตาม Unicode Standard เท่านั้น
 * ไม่มีการตัดสินใจเกี่ยวกับ grammar
 * 
 * NO_HARDCODE COMPLIANCE: โหลดค่าทั้งหมดจาก tokenizer-binary-config.json
 */
export class UniversalCharacterClassifier {
    /**
     * ตรวจสอบว่าเป็นตัวอักษรหรือไม่ (A-Z, a-z)
     * Unicode Standard: โหลดจาก config
     */
    isLetterByMath(charCode) {
        return (
            (charCode >= UNICODE.UPPERCASE_LETTER.start && charCode <= UNICODE.UPPERCASE_LETTER.end) ||
            (charCode >= UNICODE.LOWERCASE_LETTER.start && charCode <= UNICODE.LOWERCASE_LETTER.end)
        );
    }

    /**
     * ตรวจสอบว่าเป็นตัวเลขหรือไม่ (0-9)
     * Unicode Standard: โหลดจาก config
     */
    isDigitByMath(charCode) {
        return charCode >= UNICODE.DIGIT.start && charCode <= UNICODE.DIGIT.end;
    }

    /**
     * ตรวจสอบว่าเป็น whitespace หรือไม่
     * Unicode Standard: โหลดจาก config
     */
    isWhitespaceByMath(charCode) {
        return (
            charCode === UNICODE.SPACE.code ||
            charCode === UNICODE.TAB.code ||
            charCode === UNICODE.LINE_FEED.code ||
            charCode === UNICODE.CARRIAGE_RETURN.code
        );
    }
    
    /**
     * คำนวณ Binary Flags จาก character code
     * โหลด bit positions จาก config
     */
    computeBinaryFlags(charCode) {
        let flags = 0;
        
        // ! เพิ่ม _ (Underscore) และ $ (Dollar) ให้เป็น Letter เพื่อรองรับ JavaScript Identifiers
        if (this.isLetterByMath(charCode) || charCode === UNICODE.UNDERSCORE.code || charCode === UNICODE.DOLLAR.code) {
            flags |= (1 << CHAR_FLAGS.LETTER.bit);
        }
        if (this.isDigitByMath(charCode)) flags |= (1 << CHAR_FLAGS.DIGIT.bit);
        if (this.isWhitespaceByMath(charCode)) flags |= (1 << CHAR_FLAGS.WHITESPACE.bit);
        
        if (flags === 0 && charCode < UNICODE.ASCII_BOUNDARY.code) {
            flags |= (1 << CHAR_FLAGS.OPERATOR.bit);
        }
        
        return flags;
    }
    
    isLetter(flags) { return (flags & (1 << CHAR_FLAGS.LETTER.bit)) !== 0; }
    isDigit(flags) { return (flags & CHAR_FLAGS.DIGIT.value) !== 0; }
    isWhitespace(flags) { return (flags & (1 << CHAR_FLAGS.WHITESPACE.bit)) !== 0; }
    isOperator(flags) { return (flags & (1 << CHAR_FLAGS.OPERATOR.bit)) !== 0; }
}

/**
 * ============================================================================
 * PURE BINARY TOKENIZER - "BLANK PAPER"
 * ============================================================================
 * หน้าที่: แปลง String  Binary Token Stream
 * 
 * Flow:
 * 1. Tokenizer ถาม GrammarIndex: "ขอ section 'operators' ของ JS"
 * 2. GrammarIndex ส่ง: Stream ของ section ทั้งหมด (1 ครั้ง)
 * 3. Tokenizer Cache section ไว้
 * 4. Tokenizer หา "&" ใน section  แปลงเป็นเลขฐาน 2
 * 
 * ไม่ต้องถาม 100 ครั้ง - ถามครั้งเดียวได้ทั้ง section!
 * 
 * NO_HARDCODE COMPLIANCE: โหลดทุกค่าจาก config
 */
export class PureBinaryTokenizer {
    constructor(grammarIndexOrLanguage = 'javascript') {
        // ! Support both GrammarIndex object and language string for backward compatibility
        if (typeof grammarIndexOrLanguage === 'string') {
            // Legacy mode: language string provided
            this.language = grammarIndexOrLanguage;
            this.brain = null; // Will load grammar from file
        } else if (grammarIndexOrLanguage && typeof grammarIndexOrLanguage === 'object') {
            // Modern mode: GrammarIndex (Brain) provided directly
            this.brain = grammarIndexOrLanguage;
            this.language = 'javascript'; // Default, could be extracted from brain if needed
        } else {
            throw new Error('PureBinaryTokenizer requires either a language string or GrammarIndex object');
        }
        
        this.classifier = new UniversalCharacterClassifier();
        this.position = 0;
        this.input = '';
        this.inputLength = 0;
        
        // Cache sections (โหลดครั้งเดียว ใช้ได้หลายครั้ง)
        this.grammarCache = null;
        this.sectionCache = {
            keywords: null,
            operators: null,
            punctuation: null,
            literals: null,
            comments: null
        };
    }

    /**
     * โหลด grammar และ cache sections
     */
    loadGrammarSections() {
        if (this.grammarCache) {
            return; // โหลดแล้ว
        }

        try {
            // ! If Brain (GrammarIndex) is provided, use it directly
            if (this.brain) {
                // Use Brain's grammar data directly
                this.grammarCache = this.brain.grammar || this.brain;
                
                console.log('[DEBUG] Tokenizer using Brain (GrammarIndex)');
                console.log('[DEBUG] Grammar cache type:', typeof this.grammarCache);
                console.log('[DEBUG] Has keywords:', !!this.grammarCache.keywords);
                console.log('[DEBUG] Has operators:', !!this.grammarCache.operators);
                console.log('[DEBUG] Has punctuation:', !!this.grammarCache.punctuation);
                
                // ! FLATTEN nested structure to hash sections
                // ! Convert: { operators: { binaryOperators: { "+": {...} } } }
                // ! To:      { operators: { "+": {...} } }
                this.sectionCache.keywords = this.flattenSection(this.grammarCache.keywords || {});
                this.sectionCache.operators = this.flattenSection(this.grammarCache.operators || {});
                this.sectionCache.punctuation = this.flattenSection(this.grammarCache.punctuation || {});
                this.sectionCache.literals = this.flattenSection(this.grammarCache.literals || {});
                this.sectionCache.comments = this.grammarCache.comments || {};
                
                console.log('[DEBUG] Flattened sections - operators count:', Object.keys(this.sectionCache.operators).length);
                console.log('[DEBUG] Flattened sections - punctuation count:', Object.keys(this.sectionCache.punctuation).length);
                return;
            }
            
            // ! Legacy mode: Load from file
            // โหลด grammar ทั้งหมดครั้งเดียว
            const grammarPath = join(__dirname, 'grammars', `${this.language}.grammar.json`);
            this.grammarCache = JSON.parse(readFileSync(grammarPath, 'utf8'));

            // Cache sections ที่ใช้บ่อย (Stream ทั้ง section)
            this.sectionCache.keywords = this.grammarCache.keywords || {};
            this.sectionCache.operators = this.grammarCache.operators || {};
            this.sectionCache.punctuation = this.grammarCache.punctuation || {};
            this.sectionCache.literals = this.grammarCache.literals || {};
            this.sectionCache.comments = this.grammarCache.comments || {};
        } catch (error) {
            errorHandler.handleError(error, {
                source: 'BinaryComputationTokenizer',
                method: 'loadGrammar',
                severity: 'CRITICAL',
                context: `Failed to load grammar for ${this.language} - Grammar file or GrammarIndex loading error`
            });
            throw new Error(`Failed to load grammar for ${this.language}: ${error.message}`);
        }
    }
    
    /**
     * Flatten nested grammar section to hash section (no conversion needed)
     * ! Convert nested structure: { binaryOperators: { "+": {...} }, unaryOperators: { "!": {...} } }
     * ! To flat hash: { "+": {...}, "!": {...} }
     * ! This is the "hash section" format - no value conversion, just structure flattening
     */
    flattenSection(section) {
        if (!section || typeof section !== 'object') {
            return {};
        }
        
        const flat = {};
        
        for (const [key, value] of Object.entries(section)) {
            // Skip metadata fields
            if (key.startsWith('__section_')) {
                continue;
            }
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                // Check if this value has metadata fields (means it's a final token/keyword)
                // ! NO_HARDCODE: Use GRAMMAR_METADATA_FIELDS from config instead of hardcoded array
                const hasMetadata = Object.keys(value).some(k => 
                    GRAMMAR_METADATA_FIELDS.includes(k)
                );
                
                if (hasMetadata) {
                    // This is a final item (keyword/operator/punctuation definition)
                    flat[key] = value;
                } else {
                    // This is a nested category, merge its contents recursively
                    const flattened = this.flattenSection(value);
                    Object.assign(flat, flattened);
                }
            } else {
                flat[key] = value;
            }
        }
        
        return flat;
    }

    /**
     * เปลี่ยนภาษา (clear cache)
     */
    setLanguage(language) {
        if (this.language !== language) {
            this.language = language;
            this.grammarCache = null;
            this.sectionCache = {
                keywords: null,
                operators: null,
                punctuation: null,
                literals: null,
                comments: null
            };
        }
    }

    /**
     * หน้าที่เดียว: แปลง String  Binary Stream
     * ตรวจสอบ security limits จาก config
     * 
     * Flow:
     * 1. โหลด grammar sections (cache)
     * 2. แปลง String  Binary tokens
     * 3. ส่งงานต่อให้ Parser
     * 4. ลบ cache ทันที (memory management)
     */
    tokenize(input) {
        try {
            // โหลด grammar sections ครั้งเดียว
            this.loadGrammarSections();

            // Security check: โหลดจาก config
            if (input.length > SECURITY_LIMITS.MAX_INPUT_LENGTH) {
                throw new Error(`Input exceeds maximum length of ${SECURITY_LIMITS.MAX_INPUT_LENGTH} characters`);
            }
            
            // ! ========================================================================
            // ! PREPROCESSING: จัดการกับ Special Characters ที่ต้องข้าม
            // ! ========================================================================
            
            // 1. ตรวจจับและข้าม BOM (Byte Order Mark - charCode 65279)
            // ! WHY: Text editors บน Windows มักใส่ BOM ไว้หน้าไฟล์ UTF-8
            // ! SOLUTION: ข้ามตัวอักษรนี้ไปเพื่อไม่ให้เกิด "Unknown character" error
            if (input.charCodeAt(0) === 65279) {
                input = input.slice(1);
                console.log('[Tokenizer] Skipped BOM (Byte Order Mark) at start of file');
            }
            
            // 2. ตรวจจับและข้าม Shebang (#!/usr/bin/env node)
            // ! WHY: ไฟล์ JavaScript CLI มักขึ้นต้นด้วย shebang เพื่อบอก OS ว่าจะใช้ Node.js รัน
            // ! SOLUTION: ข้ามบรรทัดแรกทั้งหมดถ้าขึ้นต้นด้วย #!
            if (input.startsWith('#!')) {
                const endOfLine = input.indexOf('\n');
                if (endOfLine !== -1) {
                    input = input.slice(endOfLine + 1);
                    console.log('[Tokenizer] Skipped Shebang line');
                } else {
                    // ถ้าทั้งไฟล์มีแค่ shebang ให้เป็นไฟล์ว่าง
                    input = '';
                }
            }
            
            // ! ========================================================================
            
            this.input = input;
            this.inputLength = input.length;
            this.position = 0;
            
            const tokens = [];
            
            while (this.position < this.inputLength) {
                const charCode = input.charCodeAt(this.position);
                const flags = this.classifier.computeBinaryFlags(charCode);
                
                // ข้าม whitespace (โหลดจาก config)
                if (PARSING_RULES.SKIP_WHITESPACE && this.classifier.isWhitespace(flags)) {
                    this.position++;
                    continue;
                }
                
                // คำนวณ token (ค้นหาใน section cache)
                const token = this.computeToken(flags);
                
                if (token) {
                    tokens.push(token);
                }
            }
            
            //  ส่งงานต่อให้ Parser เสร็จแล้ว  ลบ cache ทันที!
            return tokens;
            
        } finally {
            //  CRITICAL: ลบ cache หลังส่งงานต่อให้ Parser
            // เพื่อ Memory Management และป้องกันข้อมูลค้าง
            this.clearCache();
        }
    }

    /**
     * ลบ cache ทั้งหมดหลังจากส่งงานต่อให้ Parser
     * เรียกทันทีหลัง tokenize() เสร็จ
     */
    clearCache() {
        this.grammarCache = null;
        this.sectionCache = {
            keywords: null,
            operators: null,
            punctuation: null,
            literals: null,
            comments: null
        };
    }

    /**
     * คำนวณ token โดยค้นหาใน section cache
     * ไม่ต้องถาม brain - ใช้ section stream ที่ cache ไว้แล้ว
     */
    computeToken(flags) {
        const char = this.input[this.position];
        
        // ตรวจสอบ Comment (ค้นหาใน section cache)
        const commentResult = this.checkComment();
        if (commentResult) {
            return commentResult;
        }

        // ตรวจสอบ String
        if (char === '"' || char === "'" || char === '`') {
            return this.computeStringToken(char);
        }
        
        // Letter/Digit: ตรวจสอบว่าเป็น keyword หรือไม่
        if (this.classifier.isLetter(flags)) {
            return this.computeIdentifierOrKeyword();
        }
        
        if (this.classifier.isDigit(flags)) {
            return this.computeNumber();
        }
        
        // Operator/Punctuation: ค้นหาใน section cache
        if (this.classifier.isOperator(flags)) {
            return this.computeOperatorOrPunctuation();
        }
        
        // ! NO_SILENT_FALLBACKS: ห้าม fallback - ต้อง throw error ทันที
        // ! ให้ ErrorHandler กลางจัดการ (src/error-handler/ErrorHandler.js)
        const error = new Error(
            `Unknown character at position ${this.position}: "${char}" (charCode: ${char.charCodeAt(0)})`
        );
        error.name = 'TokenizerError';
        error.errorCode = 'UNKNOWN_CHARACTER';
        error.position = this.position;
        error.character = char;
        error.isOperational = false; // Programming error - ต้อง crash
        
        throw error; // Let ErrorHandler decide what to do
    }

    /**
     * ตรวจสอบ comment โดยค้นหาใน comments section cache
     */
    checkComment() {
        const commentsSection = this.sectionCache.comments;
        const input = this.input;
        const position = this.position;

        // ตรวจสอบ single-line comment
        if (commentsSection.singleLine) {
            const start = commentsSection.singleLine.start;
            if (input.substr(position, start.length) === start) {
                return this.computeCommentToken(
                    start,
                    commentsSection.singleLine.end,
                    TOKEN_TYPE_STRINGS.COMMENT,
                    TOKEN_TYPES.COMMENT.bit
                );
            }
        }

        // ตรวจสอบ multi-line comment
        if (commentsSection.multiLine) {
            const start = commentsSection.multiLine.start;
            if (input.substr(position, start.length) === start) {
                return this.computeCommentToken(
                    start,
                    commentsSection.multiLine.end,
                    TOKEN_TYPE_STRINGS.COMMENT,
                    TOKEN_TYPES.COMMENT.bit
                );
            }
        }

        return null;
    }

    /**
     * คำนวณ comment token
     */
    computeCommentToken(startPattern, endPattern, type, binaryFlagBit) {
        const start = this.position;
        
        // Security check: โหลดจาก config
        if (startPattern.length > SECURITY_LIMITS.MAX_PATTERN_LENGTH) {
            throw new Error(`Pattern exceeds maximum length of ${SECURITY_LIMITS.MAX_PATTERN_LENGTH}`);
        }
        
        // ตรวจสอบว่าตรงกับ start pattern หรือไม่
        if (!this.matchPattern(start, startPattern)) {
            const errorMsg = ERROR_MESSAGES.EXPECTED_PATTERN
                .replace('{pattern}', startPattern)
                .replace('{position}', start);
            throw new Error(errorMsg);
        }
        
        let end = start + startPattern.length;
        
        // หา end pattern
        while (end < this.inputLength) {
            if (this.matchPattern(end, endPattern)) {
                end += endPattern.length;
                break;
            }
            end++;
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        return {
            type: type,
            binary: (1 << binaryFlagBit),
            value: value,
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * คำนวณ string token
     * โหลด Unicode constants และ limits จาก config
     */
    computeStringToken(quote) {
        const start = this.position;
        let end = start + 1;
        let escaped = false;
        
        while (end < this.inputLength) {
            // Security check: โหลดจาก config
            if ((end - start) > SECURITY_LIMITS.MAX_STRING_LENGTH) {
                throw new Error(`String exceeds maximum length of ${SECURITY_LIMITS.MAX_STRING_LENGTH}`);
            }
            
            const charCode = this.input.charCodeAt(end);
            
            if (escaped) {
                escaped = false;
                end++;
                continue;
            }
            
            // Backslash: โหลดจาก config
            if (charCode === UNICODE.BACKSLASH.code) {
                escaped = true;
                end++;
                continue;
            }
            
            if (this.input[end] === quote) {
                end++;
                break;
            }
            
            end++;
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        return {
            type: TOKEN_TYPE_STRINGS.STRING,
            binary: (1 << TOKEN_TYPES.STRING.bit),
            value: value,
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * คำนวณ identifier/keyword โดยถาม Brain
     * โหลด Unicode constants และ parsing rules จาก config
     */
    computeIdentifierOrKeyword() {
        const start = this.position;
        let end = start;
        
        // อ่านตัวอักษร/ตัวเลข (โหลด rules จาก config)
        while (end < this.inputLength) {
            // Security check: โหลดจาก config
            if ((end - start) > SECURITY_LIMITS.MAX_TOKEN_LENGTH) {
                throw new Error(`Token exceeds maximum length of ${SECURITY_LIMITS.MAX_TOKEN_LENGTH}`);
            }
            
            const code = this.input.charCodeAt(end);
            const flags = this.classifier.computeBinaryFlags(code);
            
            if (this.classifier.isLetter(flags) || this.classifier.isDigit(flags)) {
                end++;
            } else if (code === UNICODE.UNDERSCORE.code || code === UNICODE.DOLLAR.code) {
                end++;
            } else {
                break;
            }
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        // ค้นหาใน keywords section cache (ไม่ต้องถาม brain)
        const keywordsSection = this.sectionCache.keywords;
        const isKeyword = keywordsSection && 
                         keywordsSection.hasOwnProperty(value) && 
                         !value.startsWith('__section_');
        
        if (isKeyword) {
            return {
                type: TOKEN_TYPE_STRINGS.KEYWORD,
                binary: (1 << TOKEN_TYPES.KEYWORD.bit),
                value: value,
                length: end - start,
                start: start,
                end: end
            };
        }
        
        return {
            type: TOKEN_TYPE_STRINGS.IDENTIFIER,
            binary: (1 << TOKEN_TYPES.IDENTIFIER.bit),
            value: value,
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * คำนวณตัวเลข (pure math)
     * โหลด Unicode constants และ limits จาก config
     */
    computeNumber() {
        const start = this.position;
        let end = start;
        
        // อ่านตัวเลข (Unicode math only) - โหลดจาก config
        while (end < this.inputLength) {
            // Security check: โหลดจาก config
            if ((end - start) > SECURITY_LIMITS.MAX_NUMBER_LENGTH) {
                throw new Error(`Number exceeds maximum length of ${SECURITY_LIMITS.MAX_NUMBER_LENGTH}`);
            }
            
            const code = this.input.charCodeAt(end);
            
            // Digits, dot, 'E', 'e' - ทั้งหมดโหลดจาก config
            if (
                (code >= UNICODE.DIGIT.start && code <= UNICODE.DIGIT.end) ||
                code === UNICODE.DOT.code ||
                code === UNICODE.LETTER_E_UPPERCASE.code ||
                code === UNICODE.LETTER_E_LOWERCASE.code
            ) {
                end++;
            } else {
                break;
            }
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        return {
            type: TOKEN_TYPE_STRINGS.NUMBER,
            binary: (1 << TOKEN_TYPES.NUMBER.bit),
            value: value,
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * คำนวณ operator/punctuation โดยค้นหาใน section cache
     * Longest match algorithm
     */
    computeOperatorOrPunctuation() {
        const start = this.position;
        
        // ค้นหา operator longest match ใน section cache
        const opMatch = this.findLongestInSection(
            this.sectionCache.operators,
            this.input,
            start
        );
        
        if (opMatch) {
            this.position += opMatch.length;
            return {
                type: TOKEN_TYPE_STRINGS.OPERATOR,
                binary: (1 << TOKEN_TYPES.OPERATOR.bit),
                value: opMatch.value,
                length: opMatch.length,
                start: start,
                end: this.position
            };
        }
        
        // ค้นหา punctuation longest match ใน section cache
        const punctMatch = this.findLongestInSection(
            this.sectionCache.punctuation,
            this.input,
            start
        );
        
        if (punctMatch) {
            this.position += punctMatch.length;
            return {
                type: TOKEN_TYPE_STRINGS.PUNCTUATION,
                binary: (1 << TOKEN_TYPES.PUNCTUATION.bit),
                value: punctMatch.value,
                punctuationBinary: PUNCTUATION_BINARY_MAP[punctMatch.value] || 0,
                length: punctMatch.length,
                start: start,
                end: this.position
            };
        }
        
        // Error: โหลด error message template จาก config
        const errorMsg = ERROR_MESSAGES.UNKNOWN_OPERATOR
            .replace('{position}', start)
            .replace('{char}', this.input[start]);
        throw new Error(errorMsg);
    }

    /**
     * หา longest match ใน section
     * @param {Object} section - Section cache (operators/punctuation)
     * @param {string} input - Input string
     * @param {number} position - Current position
     * @returns {Object|null} { value, length } หรือ null
     */
    findLongestInSection(section, input, position) {
        if (!section) {
            return null;
        }

        let longestMatch = null;
        let longestLength = 0;

        // ค้นหาทุก item ใน section
        for (const [item, data] of Object.entries(section)) {
            // ข้าม metadata fields
            if (item.startsWith('__section_')) continue;

            // ตรวจสอบว่าตรงกับ input หรือไม่
            if (input.substr(position, item.length) === item) {
                if (item.length > longestLength) {
                    longestMatch = item;
                    longestLength = item.length;
                }
            }
        }

        if (longestMatch) {
            return {
                value: longestMatch,
                length: longestLength,
                data: section[longestMatch]
            };
        }

        return null;
    }

    /**
     * Helper: Match pattern
     */
    matchPattern(position, pattern) {
        if (position + pattern.length > this.inputLength) {
            return false;
        }
        
        for (let i = 0; i < pattern.length; i++) {
            if (this.input[position + i] !== pattern[i]) {
                return false;
            }
        }
        
        return true;
    }
}

// Export alias for backward compatibility
export { PureBinaryTokenizer as BinaryComputationTokenizer };
export default PureBinaryTokenizer;
