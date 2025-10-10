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
// !  หน้าที่เดียว: แปลง String → Binary (0b10001)
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
// ! │ - Pure mathematics: 99 >= 97 && 99 <= 122 → LETTER                     │
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
// ! COMPLETE FLOW: Source Code → Semantic Binary Stream
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Input:  "const x = 5;"
// !
// ! Step 1: File System (OS stores as binary)
// !         const → 99,111,110,115,116 (ASCII codes)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Step 2: Character Classification (Pure Math)
// !         99 ≥ 97 && 99 ≤ 122 → TRUE → LETTER flag (0b00001)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Step 3: Token Assembly (Ask Brain)
// !         "const" → brain.isKeyword("const") → TRUE
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
// !    Source Code → Binary Token Stream (OUR DOMAIN)
// !    Binary Token Stream → Machine Code (COMPILER'S DOMAIN)
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
    const errorMsg = `CRITICAL: Failed to load tokenizer configuration from ${configPath}: ${error.message}`;
    throw new Error(errorMsg);
}

// Extract constants from configuration - ZERO HARDCODE
const UNICODE = CONFIG.unicodeRanges.ranges;
const CHAR_FLAGS = CONFIG.characterFlags.flags;
const TOKEN_TYPES = CONFIG.tokenBinaryTypes.types;
const TOKEN_TYPE_STRINGS = CONFIG.tokenTypeStrings.types;
const ERROR_MESSAGES = CONFIG.errorMessages.templates;
const PARSING_RULES = CONFIG.parsingRules.rules;
const SECURITY_LIMITS = CONFIG.securityConfig.limits;

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
        
        if (this.isLetterByMath(charCode)) flags |= (1 << CHAR_FLAGS.LETTER.bit);
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
 * หน้าที่: แปลง String → Binary Token Stream
 * 
 * ไม่มี hardcode logic ใดๆ - ถาม Brain ทุกอย่าง!
 * 
 * NO_HARDCODE COMPLIANCE: โหลดทุกค่าจาก config
 */
export class PureBinaryTokenizer {
    constructor(brain) {
        if (!brain) {
            throw new Error(ERROR_MESSAGES.BRAIN_REQUIRED);
        }
        
        this.brain = brain;
        this.classifier = new UniversalCharacterClassifier();
        this.position = 0;
        this.input = '';
        this.inputLength = 0;
    }

    /**
     * หน้าที่เดียว: แปลง String → Binary Stream
     * ตรวจสอบ security limits จาก config
     */
    tokenize(input) {
        // Security check: โหลดจาก config
        if (input.length > SECURITY_LIMITS.MAX_INPUT_LENGTH) {
            throw new Error(`Input exceeds maximum length of ${SECURITY_LIMITS.MAX_INPUT_LENGTH} characters`);
        }
        
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
            
            // ถาม Brain ว่า character นี้คืออะไร
            const token = this.computeToken(flags);
            
            if (token) {
                tokens.push(token);
            }
        }
        
        return tokens;
    }

    /**
     * ถาม Brain แล้วคำนวณ token
     * โหลด token type strings และ binary flags จาก config
     */
    computeToken(flags) {
        const char = this.input[this.position];
        
        // ถาม Brain: character นี้คืออะไร?
        const tokenType = this.brain.identifyTokenType(char, this.input, this.position);
        
        // เรียก compute function ตาม type ที่ Brain บอก
        if (tokenType.isComment) {
            return this.computePatternToken(
                TOKEN_TYPE_STRINGS.COMMENT,
                tokenType,
                TOKEN_TYPES.COMMENT.bit
            );
        }
        
        if (tokenType.isString) {
            return this.computeStringToken(tokenType);
        }
        
        // Letter/Digit: ถาม Brain ว่าเป็น keyword หรือไม่
        if (this.classifier.isLetter(flags)) {
            return this.computeIdentifierOrKeyword();
        }
        
        if (this.classifier.isDigit(flags)) {
            return this.computeNumber();
        }
        
        // Operator: ถาม Brain หา longest match
        if (this.classifier.isOperator(flags)) {
            return this.computeOperatorOrPunctuation();
        }
        
        // Error: โหลด error message template จาก config
        const errorMsg = ERROR_MESSAGES.UNKNOWN_CHARACTER
            .replace('{position}', this.position)
            .replace('{char}', char);
        throw new Error(errorMsg);
    }

    /**
     * คำนวณ token จาก pattern ที่ Brain บอก
     * ใช้สำหรับ: Comment, Regex, etc.
     * โหลด binary flag จาก config
     */
    computePatternToken(type, tokenInfo, binaryFlagBit) {
        const start = this.position;
        const startPattern = tokenInfo.startPattern;
        const endPattern = tokenInfo.endPattern;
        
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
    computeStringToken(tokenInfo) {
        const start = this.position;
        const quote = tokenInfo.quote;
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
        
        // ถาม Brain: นี่คือ keyword หรือไม่?
        if (this.brain.isKeyword(value)) {
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
     * คำนวณ operator/punctuation โดยถาม Brain
     * โหลด token types และ error messages จาก config
     */
    computeOperatorOrPunctuation() {
        const start = this.position;
        
        // ถาม Brain: operator longest match
        const opMatch = this.brain.findLongestOperator(this.input, start);
        
        if (opMatch && opMatch.found) {
            this.position += opMatch.length;
            return {
                type: TOKEN_TYPE_STRINGS.OPERATOR,
                binary: (1 << TOKEN_TYPES.OPERATOR.bit),
                value: opMatch.operator,
                length: opMatch.length,
                start: start,
                end: this.position
            };
        }
        
        // ถาม Brain: punctuation longest match
        const punctMatch = this.brain.findLongestPunctuation(this.input, start);
        
        if (punctMatch && punctMatch.found) {
            this.position += punctMatch.length;
            return {
                type: TOKEN_TYPE_STRINGS.PUNCTUATION,
                binary: (1 << TOKEN_TYPES.PUNCTUATION.bit),
                value: punctMatch.punctuation,
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
     * Helper: Match pattern ที่ Brain บอก
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
