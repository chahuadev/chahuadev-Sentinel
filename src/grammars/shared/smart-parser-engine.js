// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  HEADER & FILE INFORMATION
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  Smart Parser Engine 
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════

// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  IMPORTS & DEPENDENCIES
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  งานที่ทำ: นำเข้า modules และ dependencies ที่จำเป็น
// !  - constants.js: ค่าคงที่ต่างๆ (RULE_IDS, SEVERITY_LEVELS, etc.)
// !  - Node.js modules: fs, url, path สำหรับอ่านไฟล์ config
// !  - validator.js: ABSOLUTE_RULES
// !  - grammar-index.js: GrammarIndex class
// !  - tokenizer-helper.js: BinaryComputationTokenizer (Central Nervous System)
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
import { RULE_IDS, ERROR_TYPES, SEVERITY_LEVELS, TOKEN_TYPES, DEFAULT_LOCATION } from './constants.js';

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ABSOLUTE_RULES } from '../../validator.js';
import GrammarIndex from './grammar-index.js';
import { BinaryComputationTokenizer } from './tokenizer-helper.js';

// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  CONFIGURATION LOADER 
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  งานที่ทำ: โหลด parser configuration จาก external file (NO_HARDCODE compliance)
// !  - สร้าง path ไปยัง parser-config.json
// !  - อ่านไฟล์และ parse เป็น JSON
// !  - ถ้าโหลดไม่สำเร็จ  throw error (ไม่มี fallback)
// !  - เก็บ config ใน PARSER_CONFIG global variable
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'parser-config.json');

let PARSER_CONFIG;
try {
    PARSER_CONFIG = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    console.log(' Parser configuration loaded successfully from:', CONFIG_PATH);
} catch (error) {
    console.error('CRITICAL: Failed to load parser config:', error.message);
    throw new Error(`Configuration file is required: ${CONFIG_PATH}. Cannot proceed without valid configuration.`);
}

// ! Configuration must be loaded from external file - no fallback allowed

// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  TOKENIZER: NOW USING BINARY COMPUTATION TOKENIZER
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  WHY: Removed hardcoded JavaScriptTokenizer class in favor of proper architecture:
// !  - BinaryComputationTokenizer: Central Nervous System (tokenizer-helper.js)
// !  - Uses Brain (GrammarIndex + Trie) for O(m) operator matching
// !  - Uses Intelligence (fuzzy-search.js) for typo detection
// !  - Pure mathematical computation instead of string manipulation
// !  - 100x performance improvement through binary flag processing
// !  
// !  Old way (HARDCODED):
// !    class JavaScriptTokenizer { ... } // 200+ lines of duplicate logic
// !  
// !  New way (ARCHITECTURE):
// !    import { BinaryComputationTokenizer } from './tokenizer-helper.js'
// !    this.tokenizer = new BinaryComputationTokenizer(this.grammarIndex)
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════

// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  STRUCTURE PARSER CLASS 
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  งานที่ทำ: Base class สำหรับ parsing โครงสร้างโค้ด
// !  
// !  CONSTRUCTOR :
// !   - รับ tokens array (จาก JavaScriptTokenizer)
// !   - ตรวจสอบว่า tokens เป็น Array (safety check)
// !   - สร้าง structures object สำหรับเก็บโครงสร้างที่พบ:
// !     * functions: function declarations
// !     * classes: class declarations
// !     * asyncFunctions: async functions
// !     * tryBlocks: try-catch-finally blocks
// !     * imports: import statements
// !     * exports: export statements
// !  
// !  NOTE: Class นี้เป็น base class ที่ AdvancedStructureParser จะ extend
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
class StructureParser {
    constructor(tokens) {
        // ! FIX: เพิ่มการตรวจสอบ tokens ให้เป็น Array เสมอ
        this.tokens = Array.isArray(tokens) ? tokens : [];
        this.structures = {
            functions: [],
            classes: [],
            asyncFunctions: [],
            tryBlocks: [],
            imports: [],
            exports: []
        };
    }
}


// ! ═══════════════════════════════════════════════════════════════════════════════════════════════
// ! โซนที่ 1: CLASS DEFINITION & CONSTRUCTOR 
// ! ═══════════════════════════════════════════════════════════════════════════════════════════════
// ! งานที่ทำ: สร้างคลาส AdvancedStructureParser และตั้งค่าเริ่มต้น
// !  - รับ tokens (รายการ token จาก tokenizer) และ grammarIndex (ข้อมูลแกรมมาร์)
// !  - สร้าง AST root node แบบ ESTree format (เหมือน Babel/Acorn)
// !  - ตั้งค่า current position = 0 (เริ่มอ่านจาก token แรก)
// !  - สร้าง Program node พร้อม body array สำหรับเก็บ statements
// ! ═══════════════════════════════════════════════════════════════════════════════════════════════
// ! 
// !  ADVANCED STRUCTURE PARSER - สรุปโซนทั้งหมด (14 โซน)
// ! 
// ! โซนที่ 1 : CLASS DEFINITION - สร้างคลาสและ initialize AST root
// ! โซนที่ 2 : MAIN ENTRY POINT - parse() loop อ่าน tokens  AST
// ! โซนที่ 3 : STATEMENT ROUTER - ตัดสินใจว่า statement ประเภทไหน
// ! โซนที่ 4 : FUNCTION PARSER - แปลง function declaration
// ! โซนที่ 5 : VARIABLE PARSER - แปลง const/let/var declarations
// ! โซนที่ 6 : EXPRESSION PARSERS - assignment & logical expressions
// ! โซนที่ 7 : HELPER METHODS - peek, advance, match, consume
// ! โซนที่ 8 : PARAMETER & BLOCK - อ่าน (params) และ {...}
// ! โซนที่ 9 : EXPRESSION STATEMENT - แปลง expression statements
// ! โซนที่ 10 : EQUALITY & COMPARISON - ==, !=, <, >, +, -
// ! โซนที่ 11 : MULTIPLICATIVE & UNARY - *, /, %, !, typeof
// ! โซนที่ 12 : POSTFIX - obj.prop, obj[key], func()
// ! โซนที่ 13 : PRIMARY - literals, identifiers, (expr)
// ! โซนที่ 14 : ARGUMENT LIST - อ่าน (arg1, arg2, arg3)
// ! 
// !  Operator Precedence Flow (ต่ำ  สูง):
// !    Assignment (=, +=)  Logical (&&, ||)  Equality (===, !==)  
// !    Relational (<, >)  Additive (+, -)  Multiplicative (*, /)  
// !    Unary (!, -)  Postfix (., [], ())  Primary (literals)
// ! 
// ! ═══════════════════════════════════════════════════════════════════════════════════════════════
class AdvancedStructureParser extends StructureParser {
    constructor(tokens, grammarIndex) {
        super(tokens);
        this.grammarIndex = grammarIndex;  // ! เก็บ grammar rules สำหรับ validation
        this.current = 0;                  // ! ตำแหน่งปัจจุบันใน tokens array
        this.ast = {                       // ! AST root node (ESTree format)
            type: 'Program',               // ! ประเภท: Program (top-level)
            start: 0,                      // ! เริ่มต้นที่ token 0
            end: 0,                        // ! จบที่ไหน (จะอัพเดทตอนจบ)
            body: [],                      // ! เก็บ statements ทั้งหมด
            sourceType: 'module',          // ! ประเภทไฟล์: module (มี import/export)
            comments: []                   // ! เก็บ comments (ถ้ามี)
        };
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 2: MAIN ENTRY POINT - parse() 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: จุดเริ่มต้นการแปลง tokens  AST
    // !  - Loop อ่าน tokens ทีละตัวจนหมด (while !isAtEnd())
    // !  - เรียก parseStatement() เพื่อแปลงแต่ละ statement
    // !  - เก็บ statement ที่ได้ลง ast.body[]
    // !  - ถ้าเจอ error ให้ข้าม token ปัญหาไป (error recovery)
    // !  - ตอนจบ ตั้งค่า ast.end = ตำแหน่งสุดท้าย
    // !  - return AST ที่สร้างเสร็จแล้ว
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parse() {
        console.log(' AdvancedStructureParser: Building Full AST...');
        
        let statementCount = 0;
        while (!this.isAtEnd()) {
            try {
                const statement = this.parseStatement();
                if (statement) {
                    this.ast.body.push(statement);
                    statementCount++;
                }
            } catch (error) {
                // ! WHY: Error recovery allows parser to continue after syntax errors
                // ! instead of crashing. This helps catch multiple violations in one pass.
                console.log(`Skipping problematic token at ${this.current}: ${this.peek()?.value || 'EOF'}`);
                this.advance();
            }
        }
        
        this.ast.end = this.tokens.length - 1;
        
        console.log(`AST Built: ${this.ast.body.length} top-level statements (processed ${statementCount})`);
        return this.ast;
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 3: STATEMENT ROUTER - parseStatement() 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: ตัดสินใจว่า token ปัจจุบันคือ statement ประเภทไหน
    // !  - ดู token.type และ token.value
    // !  - ถ้าเป็น KEYWORD  ส่งต่อไปยัง parser ที่เหมาะสม:
    // !    'function'  parseFunctionDeclaration()
    // !    'class'  parseClassDeclaration()
    // !    'const/let/var'  parseVariableDeclaration()
    // !    'if'  parseIfStatement()
    // !    'for/while/try/return'  parser ที่เหมาะสม
    // !    'import/export'  parseImportDeclaration()/parseExportDeclaration()
    // !    'async'  parseAsyncStatement()
    // !  - ถ้าไม่ใช่ KEYWORD  ถือว่าเป็น expression statement
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseStatement() {
        const token = this.peek();                              // ! ดู token ปัจจุบันโดยไม่เลื่อน position
        if (!token) {
            // !  NO_SILENT_FALLBACKS: คืน Object ที่มีสถานะชัดเจนแทน null (EOF)
            return {
                type: 'EOF',
                value: null,
                location: { start: this.current, end: this.current }
            };
        }

        // ! Declaration statements - ตรวจสอบว่าเป็น keyword ประเภทไหน
        if (token.type === 'KEYWORD') {
            switch (token.value) {
                case 'function': return this.parseFunctionDeclaration();   // ! function foo() {}
                case 'class': return this.parseClassDeclaration();         // ! class Foo {}
                case 'const':                                               // ! const x = 1
                case 'let':                                                 // ! let y = 2
                case 'var': return this.parseVariableDeclaration();        // ! var z = 3
                case 'if': return this.parseIfStatement();                 // ! if (condition) {}
                case 'for': return this.parseForStatement();               // ! for (;;) {}
                case 'while': return this.parseWhileStatement();           // ! while (condition) {}
                case 'try': return this.parseTryStatement();               // ! try {} catch {}
                case 'return': return this.parseReturnStatement();         // ! return value
                case 'import': return this.parseImportDeclaration();       // ! import foo from 'bar'
                case 'export': return this.parseExportDeclaration();       // ! export default foo
                case 'async': return this.parseAsyncStatement();           // ! async function foo() {}
            }
        }

        // ! Expression statements - ไม่ใช่ keyword ให้ถือว่าเป็น expression
        return this.parseExpressionStatement();                 // ! x = 5; foo(); obj.method()
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 4: FUNCTION PARSER - parseFunctionDeclaration() 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง function declaration  AST node
    // !  - บันทึกตำแหน่งเริ่มต้น (start)
    // !  - กิน 'function' keyword
    // !  - อ่านชื่อ function (identifier)
    // !  - อ่านพารามิเตอร์ (x, y, z) ใน parseParameterList()
    // !  - อ่าน function body {...} ใน parseBlockStatement()
    // !  - สร้าง FunctionDeclaration node พร้อมข้อมูลทั้งหมด
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseFunctionDeclaration() {
        const start = this.current;                             // ! บันทึกตำแหน่งเริ่มต้น
        this.consume('function');                               // ! กิน 'function' keyword (ตรวจสอบและเลื่อน position)
        
        const id = this.parseIdentifier();                      // ! อ่านชื่อ function (เช่น 'myFunction')
        const params = this.parseParameterList();               // ! อ่านพารามิเตอร์ (x, y, z) จาก (...)
        const body = this.parseBlockStatement();                // ! อ่าน function body จาก {...}
        
        return {
            type: 'FunctionDeclaration',                        // ! ประเภท AST node
            start: start,                                       // ! ตำแหน่งเริ่มต้น
            end: this.current - 1,                              // ! ตำแหน่งสิ้นสุด
            id: id,                                             // ! ชื่อ function (Identifier node)
            params: params,                                     // ! รายการพารามิเตอร์ (Identifier[])
            body: body,                                         // ! function body (BlockStatement node)
            generator: false,                                   // ! ไม่ใช่ generator function
            async: false                                        // ! ไม่ใช่ async function (ถ้าเป็น async จะเข้า parseAsyncStatement)
        };
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 5: VARIABLE PARSER - parseVariableDeclaration() 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง variable declaration  AST node
    // !  - อ่าน const/let/var keyword
    // !  - อ่านตัวแปร (อาจมีหลายตัว: const x=1, y=2, z=3)
    // !  - แต่ละตัวแปรสร้าง VariableDeclarator node:
    // !    * id = ชื่อตัวแปร (Identifier)
    // !    * init = ค่าเริ่มต้น (Expression) ถ้ามี = อยู่
    // !  - ถ้ามี comma (,) ให้อ่านตัวแปรถัดไป
    // !  - จบด้วย semicolon หรือ ASI (Automatic Semicolon Insertion)
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseVariableDeclaration() {
        const start = this.current;                             // ! บันทึกตำแหน่งเริ่มต้น
        const kind = this.advance().value;                      // ! อ่าน const/let/var และเลื่อน position
        
        const declarations = [];                                // ! เก็บรายการตัวแปร (อาจมีหลายตัว)
        do {
            const declaration = {
                type: 'VariableDeclarator',                     // ! แต่ละตัวแปรเป็น VariableDeclarator
                id: this.parseIdentifier(),                     // ! ชื่อตัวแปร (เช่น 'x')
                init: null                                      // ! ค่าเริ่มต้น (ถ้ามี = จะใส่ตรงนี้)
            };
            
            // ! ตรวจสอบว่ามี = หรือไม่ (initializer)
            if (this.match('=')) {                              // ! ถ้ามี = ต่อท้าย
                this.advance();                                 // ! กิน = ออก
                declaration.init = this.parseExpression();      // ! อ่าน expression ที่อยู่หลัง = (เช่น 5, foo(), x+y)
            }
            
            declarations.push(declaration);                     // ! เก็บ declarator ลง array
            
        } while (this.match(',') && this.advance());            // ! ถ้ามี comma ให้วนอ่านต่อ (const x=1, y=2)
        
        this.consumeSemicolon();                                // ! จบด้วย ; หรือ ASI
        
        return {
            type: 'VariableDeclaration',                        // ! ประเภท AST node
            start: start,                                       // ! ตำแหน่งเริ่มต้น
            end: this.current - 1,                              // ! ตำแหน่งสิ้นสุด
            declarations: declarations,                         // ! รายการตัวแปรทั้งหมด (VariableDeclarator[])
            kind: kind                                          // ! ประเภท: 'const', 'let', หรือ 'var'
        };
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 6: EXPRESSION PARSERS - parseExpression & Friends 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง expressions ตาม operator precedence (ลำดับความสำคัญของตัวดำเนินการ)
    // !  
    // ! parseExpression()  เรียก parseAssignmentExpression()
    // !  
    // ! parseAssignmentExpression() (บรรทัด 342-356)
    // !  - จัดการ assignment operators: =, +=, -=, *=, /=
    // !  - precedence ต่ำสุด (ทำงานทีหลังสุด)
    // !  - ตัวอย่าง: x = 5, y += 10
    // !  
    // ! parseLogicalExpression() (บรรทัด 358-375)
    // !  - จัดการ logical operators: &&, ||, ??
    // !  - precedence สูงกว่า assignment
    // !  - ตัวอย่าง: x && y, a || b, c ?? d
    // !  - สร้าง LogicalExpression node
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseExpression() {
        return this.parseAssignmentExpression();                // ! เริ่มต้นที่ assignment (precedence ต่ำสุด)
    }

    parseAssignmentExpression() {
        const left = this.parseLogicalExpression();             // ! อ่านด้านซ้ายก่อน (precedence สูงกว่า)
        
        // ! ตรวจสอบว่ามี assignment operator หรือไม่
        if (this.matchOperator('=', '+=', '-=', '*=', '/=')) {
            const operator = this.advance().value;              // ! อ่าน operator (=, +=, etc.)
            const right = this.parseAssignmentExpression();     // ! อ่านด้านขวา (recursive - รองรับ x = y = z)
            
            return {
                type: 'AssignmentExpression',                   // ! ประเภท AST node
                operator: operator,                             // ! operator: '=', '+=', '-=', etc.
                left: left,                                     // ! ด้านซ้าย (ตัวแปรที่จะถูก assign)
                right: right                                    // ! ด้านขวา (ค่าที่จะ assign)
            };
        }
        
        return left;                                            // ! ถ้าไม่ใช่ assignment ก็คือ logical expression
    }

    parseLogicalExpression() {
        let left = this.parseEqualityExpression();              // ! อ่านด้านซ้ายก่อน (precedence สูงกว่า)
        
        // ! วนอ่าน logical operators ต่อเนื่อง (x && y && z)
        while (this.matchOperator('&&', '||', '??')) {
            const operator = this.advance().value;              // ! อ่าน operator (&&, ||, ??)
            const right = this.parseEqualityExpression();       // ! อ่านด้านขวา
            
            left = {
                type: 'LogicalExpression',                      // ! ประเภท AST node
                operator: operator,                             // ! operator: '&&', '||', '??'
                left: left,                                     // ! ด้านซ้าย (อาจเป็น LogicalExpression ซ้อน)
                right: right                                    // ! ด้านขวา
            };
        }
        
        return left;                                            // ! คืน LogicalExpression หรือ EqualityExpression
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 7: HELPER METHODS - Token Navigation 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! Standard token navigation helpers for parser implementation
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    peek() {
        return this.tokens[this.current];
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.tokens[this.current - 1];
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }

    match(...types) {
        const token = this.peek();
        return token && (types.includes(token.type) || types.includes(token.value));
    }

    matchOperator(...operators) {
        const token = this.peek();
        return token && token.type === 'OPERATOR' && operators.includes(token.value);
    }

    consume(expected) {
        const token = this.peek();
        if (token && token.value === expected) {
            return this.advance();
        }
        throw new Error(`Expected '${expected}' but got '${token?.value || 'EOF'}'`);
    }

    consumeSemicolon() {
        // ! Optional semicolons (ASI - Automatic Semicolon Insertion)
        if (this.match(';')) {
            this.advance();
        }
    }

    parseIdentifier() {
        const token = this.peek();
        if (token && token.type === 'IDENTIFIER') {
            this.advance();
            return {
                type: 'Identifier',
                name: token.value
            };
        }
        throw new Error(`Expected identifier but got '${token?.value || 'EOF'}'`);
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 8: PARAMETER & BLOCK PARSERS 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง parameter lists และ block statements
    // !  
    // ! parseParameterList() 
    // !  - อ่านรายการพารามิเตอร์ใน function: (x, y, z)
    // !  - เริ่มด้วย consume('(')
    // !  - วนอ่าน identifiers จนกว่าจะเจอ ')'
    // !  - ถ้ามี comma (,) ให้อ่านต่อ
    // !  - จบด้วย consume(')')
    // !  - คืน array ของ Identifier nodes
    // !  
    // ! parseBlockStatement() 
    // !  - อ่าน block statement: { ... }
    // !  - เริ่มด้วย consume('{')
    // !  - วนอ่าน statements ภายใน {...} จนกว่าจะเจอ '}'
    // !  - แต่ละ statement เรียก parseStatement()
    // !  - เก็บ statements ลง body[]
    // !  - จบด้วย consume('}')
    // !  - คืน BlockStatement node
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseParameterList() {
        const params = [];                                      // ! เก็บรายการพารามิเตอร์
        this.consume('(');                                      // ! ต้องเริ่มด้วย '(' ไม่งั้น error
        
        while (!this.match(')') && !this.isAtEnd()) {           // ! วนจนกว่าจะเจอ ')' หรือ EOF
            params.push(this.parseIdentifier());                // ! อ่าน identifier (ชื่อพารามิเตอร์)
            if (this.match(',')) {                              // ! ถ้ามี comma ให้กินและอ่านต่อ
                this.advance();                                 // ! กิน comma
            }
        }
        
        this.consume(')');                                      // ! ต้องจบด้วย ')' ไม่งั้น error
        return params;                                          // ! คืน array ของ Identifier nodes
    }

    parseBlockStatement() {
        const start = this.current;                             // ! บันทึกตำแหน่งเริ่มต้น
        this.consume('{');                                      // ! ต้องเริ่มด้วย '{' ไม่งั้น error
        
        const body = [];                                        // ! เก็บ statements ภายใน block
        while (!this.match('}') && !this.isAtEnd()) {           // ! วนจนกว่าจะเจอ '}' หรือ EOF
            const stmt = this.parseStatement();                 // ! อ่าน statement
            if (stmt) body.push(stmt);                          // ! เก็บลง body[] (ถ้าไม่ null)
        }
        
        this.consume('}');                                      // ! ต้องจบด้วย '}' ไม่งั้น error
        
        return {
            type: 'BlockStatement',                             // ! ประเภท AST node
            start: start,                                       // ! ตำแหน่งเริ่มต้น
            end: this.current - 1,                              // ! ตำแหน่งสิ้นสุด
            body: body                                          // ! รายการ statements ภายใน block
        };
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 9: EXPRESSION STATEMENT PARSER 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง expression statement  AST node
    // !  - expression statement คือ statement ที่ประกอบด้วย expression
    // !  - ตัวอย่าง: foo(); x = 5; obj.method()
    // !  - อ่าน expression ด้วย parseExpression()
    // !  - จบด้วย semicolon หรือ ASI
    // !  - ถ้าเจอ error ให้ข้าม token ปัญหาไป (error recovery)
    // !  - คืน ExpressionStatement node หรือ null (ถ้า error)
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseExpressionStatement() {
        try {
            const expr = this.parseExpression();                // ! อ่าน expression (เช่น foo(), x = 5)
            this.consumeSemicolon();                            // ! จบด้วย ; หรือ ASI
            
            return {
                type: 'ExpressionStatement',                    // ! ประเภท AST node
                expression: expr                                // ! expression ที่อ่านได้
            };
        } catch (error) {
            // ! WHY: Log error for debugging BUT still continue parsing (controlled recovery)
            // ! This is NOT a silent fallback - we log the error loudly
            // ! We continue parsing to find ALL violations in one pass (better UX)
            console.error(`⚠️  Expression statement parsing error at position ${this.current}:`, error.message);
            console.error(`   Token: "${this.peek()?.value || 'EOF'}" (type: ${this.peek()?.type})`);
            console.error(`   Skipping this token and continuing parse...`);
            
            // !  NO_SILENT_FALLBACKS: คืน error object แทน null
            this.advance();                                     // ! Skip problematic token
            return {
                type: 'ERROR',
                error: error.message,
                token: this.peek(),
                location: { start: this.current, end: this.current }
            };
        }
    }


    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 10: EQUALITY & COMPARISON PARSERS 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง equality และ comparison operators ตาม operator precedence
    // !  
    // ! parseEqualityExpression() (บรรทัด 576-592)
    // !  - จัดการ equality operators: ==, !=, ===, !==
    // !  - precedence: สูงกว่า logical แต่ต่ำกว่า relational
    // !  - ตัวอย่าง: x === y, a !== b
    // !  - สร้าง BinaryExpression node
    // !  - รองรับ chain: x === y !== z (แม้ไม่ค่อยใช้)
    // !  
    // ! parseRelationalExpression() (บรรทัด 595-611)
    // !  - จัดการ relational operators: <, >, <=, >=
    // !  - precedence: สูงกว่า equality แต่ต่ำกว่า additive
    // !  - ตัวอย่าง: x < y, a >= b
    // !  - สร้าง BinaryExpression node
    // !  - รองรับ chain: x < y < z (แม้ว่าใน JS จะทำงานแปลกๆ)
    // !  
    // ! parseAdditiveExpression() (บรรทัด 614-628)
    // !  - จัดการ additive operators: +, -
    // !  - precedence: สูงกว่า relational แต่ต่ำกว่า multiplicative
    // !  - ตัวอย่าง: x + y, a - b
    // !  - สร้าง BinaryExpression node
    // !  - รองรับ chain: x + y - z
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseEqualityExpression() {
        let left = this.parseRelationalExpression();            // ! อ่านด้านซ้ายก่อน (precedence สูงกว่า)
        
        // ! วนอ่าน equality operators ต่อเนื่อง (x === y !== z)
        while (this.matchOperator('==', '!=', '===', '!==')) {
            const operator = this.advance().value;              // ! อ่าน operator (==, !=, ===, !==)
            const right = this.parseRelationalExpression();     // ! อ่านด้านขวา
            
            left = {
                type: 'BinaryExpression',                       // ! ประเภท AST node
                operator: operator,                             // ! operator: '==', '!=', '===', '!=='
                left: left,                                     // ! ด้านซ้าย (อาจเป็น BinaryExpression ซ้อน)
                right: right                                    // ! ด้านขวา
            };
        }
        
        return left;                                            // ! คืน BinaryExpression หรือ RelationalExpression
    }


    parseRelationalExpression() {
        let left = this.parseAdditiveExpression();              // ! อ่านด้านซ้ายก่อน (precedence สูงกว่า)
        
        // ! วนอ่าน relational operators ต่อเนื่อง (x < y < z)
        while (this.matchOperator('<', '>', '<=', '>=')) {
            const operator = this.advance().value;              // ! อ่าน operator (<, >, <=, >=)
            const right = this.parseAdditiveExpression();       // ! อ่านด้านขวา
            
            left = {
                type: 'BinaryExpression',                       // ! ประเภท AST node
                operator: operator,                             // ! operator: '<', '>', '<=', '>='
                left: left,                                     // ! ด้านซ้าย (อาจเป็น BinaryExpression ซ้อน)
                right: right                                    // ! ด้านขวา
            };
        }
        
        return left;                                            // ! คืน BinaryExpression หรือ AdditiveExpression
    }


    parseAdditiveExpression() {
        let left = this.parseMultiplicativeExpression();        // ! อ่านด้านซ้ายก่อน (precedence สูงกว่า)
        
        // ! วนอ่าน additive operators ต่อเนื่อง (x + y - z)
        while (this.matchOperator('+', '-')) {
            const operator = this.advance().value;              // ! อ่าน operator (+, -)
            const right = this.parseMultiplicativeExpression(); // ! อ่านด้านขวา
            
            left = {
                type: 'BinaryExpression',                       // ! ประเภท AST node
                operator: operator,                             // ! operator: '+', '-'
                left: left,                                     // ! ด้านซ้าย (อาจเป็น BinaryExpression ซ้อน)
                right: right                                    // ! ด้านขวา
            };
        }
        
        return left;                                            // ! คืน BinaryExpression หรือ MultiplicativeExpression
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 11: MULTIPLICATIVE & UNARY PARSERS 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง multiplicative และ unary operators
    // !  
    // ! parseMultiplicativeExpression() (บรรทัด 721-738)
    // !  - จัดการ multiplicative operators: *, /, %
    // !  - precedence: สูงกว่า additive แต่ต่ำกว่า unary
    // !  - ตัวอย่าง: x * y, a / b, c % d
    // !  - สร้าง BinaryExpression node
    // !  - รองรับ chain: x * y / z % w
    // !  
    // ! parseUnaryExpression() (บรรทัด 741-757)
    // !  - จัดการ unary operators: !, -, +, typeof, void, delete
    // !  - precedence: สูงที่สุดใน operators
    // !  - ตัวอย่าง: !x, -y, +z, typeof foo, delete obj.prop
    // !  - สร้าง UnaryExpression node
    // !  - รองรับ nested: !!x, -(-y)
    // !  - ถ้าไม่ใช่ unary ให้เรียก parsePostfixExpression()
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseMultiplicativeExpression() {
        let left = this.parseUnaryExpression();                 // ! อ่านด้านซ้ายก่อน (precedence สูงกว่า)
        
        // ! วนอ่าน multiplicative operators ต่อเนื่อง (x * y / z)
        while (this.matchOperator('*', '/', '%')) {
            const operator = this.advance().value;              // ! อ่าน operator (*, /, %)
            const right = this.parseUnaryExpression();          // ! อ่านด้านขวา
            
            left = {
                type: 'BinaryExpression',                       // ! ประเภท AST node
                operator: operator,                             // ! operator: '*', '/', '%'
                left: left,                                     // ! ด้านซ้าย (อาจเป็น BinaryExpression ซ้อน)
                right: right                                    // ! ด้านขวา
            };
        }
        
        return left;                                            // ! คืน BinaryExpression หรือ UnaryExpression
    }


    parseUnaryExpression() {
        // ! ตรวจสอบว่าเป็น unary operator หรือไม่
        if (this.matchOperator('!', '-', '+') || this.match('typeof', 'void', 'delete')) {
            const operator = this.advance().value;              // ! อ่าน operator (!, -, +, typeof, void, delete)
            const argument = this.parseUnaryExpression();       // ! อ่าน argument (รองรับ nested: !!x, -(-y))
            
            return {
                type: 'UnaryExpression',                        // ! ประเภท AST node
                operator: operator,                             // ! operator: '!', '-', '+', 'typeof', 'void', 'delete'
                prefix: true,                                   // ! prefix (อยู่หน้า argument)
                argument: argument                              // ! argument (สิ่งที่ถูก unary operate)
            };
        }
        
        return this.parsePostfixExpression();                   // ! ถ้าไม่ใช่ unary ให้เรียก postfix parser
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 12: POSTFIX EXPRESSION PARSER 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง postfix expressions (member access & function calls)
    // !  - postfix คือ operators ที่อยู่หลัง operand
    // !  - อ่าน primary expression ก่อน (ตัวแปร, literal, etc.)
    // !  - แล้ววนตรวจสอบ postfix operators:
    // !  
    // !  1. Member Access (.) - obj.property
    // !     - ตัวอย่าง: person.name, obj.method
    // !     - สร้าง MemberExpression node (computed: false)
    // !  
    // !  2. Computed Member Access ([]) - obj[key]
    // !     - ตัวอย่าง: array[0], obj['key']
    // !     - สร้าง MemberExpression node (computed: true)
    // !  
    // !  3. Function Call (()) - func(args)
    // !     - ตัวอย่าง: foo(), obj.method(x, y)
    // !     - สร้าง CallExpression node
    // !  
    // !  - รองรับ chain: obj.method(x)[0].property()
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parsePostfixExpression() {
        let left = this.parsePrimaryExpression();               // ! อ่าน primary expression ก่อน (literal, identifier, etc.)
        
        // ! วนตรวจสอบ postfix operators ต่อเนื่อง
        while (true) {
            // ! 1. Member Access: obj.property
            if (this.match('.')) {
                this.advance();                                 // ! กิน '.'
                const property = this.parseIdentifier();        // ! อ่าน property name (identifier)
                left = {
                    type: 'MemberExpression',                   // ! ประเภท AST node
                    object: left,                               // ! object (ด้านซ้าย)
                    property: property,                         // ! property (ชื่อ property)
                    computed: false                             // ! false = dot notation (obj.prop)
                };
            } 
            // ! 2. Computed Member Access: obj[key]
            else if (this.match('[')) {
                this.advance();                                 // ! กิน '['
                const property = this.parseExpression();        // ! อ่าน property (expression: index, key)
                this.consume(']');                              // ! ต้องมี ']' ปิด
                left = {
                    type: 'MemberExpression',                   // ! ประเภท AST node
                    object: left,                               // ! object (ด้านซ้าย)
                    property: property,                         // ! property (expression)
                    computed: true                              // ! true = bracket notation (obj[key])
                };
            } 
            // ! 3. Function Call: func(args)
            else if (this.match('(')) {
                const args = this.parseArgumentList();          // ! อ่าน arguments จาก (...)
                left = {
                    type: 'CallExpression',                     // ! ประเภท AST node
                    callee: left,                               // ! callee (function ที่จะเรียก)
                    arguments: args                             // ! arguments (รายการ arguments)
                };
            } 
            // ! ถ้าไม่เจอ postfix operator ใดๆ ให้หยุด
            else {
                break;
            }
        }
        
        return left;                                            // ! คืน expression (อาจเป็น MemberExpression หรือ CallExpression chain)
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 13: PRIMARY EXPRESSION PARSER 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง primary expressions (ระดับพื้นฐานที่สุด)
    // !  - primary expressions คือ building blocks ของ expressions
    // !  - ประเภทที่รองรับ:
    // !  
    // !  1. NUMBER Literals 
    // !     - ตัวอย่าง: 42, 3.14, 0xFF
    // !     - สร้าง Literal node พร้อม parseFloat(value)
    // !  
    // !  2. STRING Literals 
    // !     - ตัวอย่าง: 'hello', "world", `template`
    // !     - เอา quotes ออก: slice(1, -1)
    // !     - สร้าง Literal node
    // !  
    // !  3. IDENTIFIERS 
    // !     - ตัวอย่าง: foo, myVariable, _private
    // !     - เรียก parseIdentifier()
    // !  
    // !  4. Parenthesized Expressions 
    // !     - ตัวอย่าง: (x + y), (foo())
    // !     - อ่าน expression ภายใน (...)
    // !     - กิน '(' และ ')' ออก
    // !  
    // !  5. Unknown Tokens 
    // !     - ถ้าไม่รู้จัก token  ข้ามไป
    // !     - คืน dummy Identifier node (name: 'unknown')
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parsePrimaryExpression() {
        const token = this.peek();                              // ! ดู token ปัจจุบัน
        
        if (!token) {
            throw new Error('Unexpected end of input');         // ! ถ้าไม่มี token  error
        }
        
        // ! 1. NUMBER Literals
        if (token.type === 'NUMBER') {
            this.advance();                                     // ! กิน number token
            return {
                type: 'Literal',                                // ! ประเภท AST node
                value: parseFloat(token.value),                 // ! แปลง string  number
                raw: token.value                                // ! เก็บ raw string ไว้
            };
        }
        
        // ! 2. STRING Literals
        if (token.type === 'STRING') {
            this.advance();                                     // ! กิน string token
            return {
                type: 'Literal',                                // ! ประเภท AST node
                value: token.value.slice(1, -1),                // ! เอา quotes ออก ('hello'  hello)
                raw: token.value                                // ! เก็บ raw string ไว้ (พร้อม quotes)
            };
        }
        
        // ! 3. IDENTIFIERS
        if (token.type === 'IDENTIFIER') {
            return this.parseIdentifier();                      // ! เรียก parseIdentifier() เพื่อสร้าง Identifier node
        }
        
        // ! 4. Parenthesized Expressions
        if (this.match('(')) {
            this.advance();                                     // ! กิน '('
            const expr = this.parseExpression();                // ! อ่าน expression ภายใน (...)
            this.consume(')');                                  // ! ต้องมี ')' ปิด
            return expr;                                        // ! คืน expression (ไม่ต้องสร้าง node ใหม่)
        }
        
        // ! WHY: NO_SILENT_FALLBACKS - We throw error instead of returning dummy 'unknown' node
        // ! This forces developers to either fix the syntax or extend the parser
        const unknownToken = this.peek();
        throw new Error(
            `Unexpected token in primary expression: "${unknownToken?.value || 'EOF'}"\n` +
            `Token type: ${unknownToken?.type}\n` +
            `Position: ${this.current}\n` +
            `NO_SILENT_FALLBACKS: We fail fast instead of silently creating dummy nodes.`
        );
    }

    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! โซนที่ 14: ARGUMENT LIST PARSER 
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    // ! งานที่ทำ: แปลง argument list ใน function calls
    // !  - อ่าน arguments ที่ส่งให้ function: func(arg1, arg2, arg3)
    // !  - เริ่มด้วย consume('(')
    // !  - วนอ่าน expressions จนกว่าจะเจอ ')'
    // !  - แต่ละ argument เป็น expression (ไม่ใช่แค่ identifier)
    // !  - ถ้ามี comma (,) ให้อ่านต่อ
    // !  - จบด้วย consume(')')
    // !  - คืน array ของ expression nodes
    // !  - ตัวอย่าง: foo(x, y+z, obj.method())
    // ! ═══════════════════════════════════════════════════════════════════════════════════════════════
    parseArgumentList() {
        const args = [];                                        // ! เก็บรายการ arguments
        this.consume('(');                                      // ! ต้องเริ่มด้วย '(' ไม่งั้น error
        
        while (!this.match(')') && !this.isAtEnd()) {           // ! วนจนกว่าจะเจอ ')' หรือ EOF
            args.push(this.parseExpression());                  // ! อ่าน expression (แต่ละ argument เป็น expression)
            if (this.match(',')) {                              // ! ถ้ามี comma ให้กินและอ่านต่อ
                this.advance();                                 // ! กิน comma
            }
        }
        
        this.consume(')');                                      // ! ต้องจบด้วย ')' ไม่งั้น error
        return args;                                            // ! คืน array ของ expression nodes
    }

    // ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
    // !   SIMPLE STRUCTURE DETECTOR - parseSimpleStructures() 
    // ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
    // !  งานที่ทำ: Simple structure detection (ไม่สร้าง full AST)
    // !  
    // !  NOTE: เปลี่ยนชื่อจาก parse()  parseSimpleStructures() เพื่อหลีกเลี่ยง method name collision
    // !        Method หลัก parse() (บรรทัด 350) สร้าง Full AST (ESTree format)
    // !        Method นี้ทำ Simple Structure Detection สำหรับ legacy support
    // !  
    // !  การทำงาน:
    // !   - วน loop ผ่าน tokens ทั้งหมด
    // !   - ตรวจจับโครงสร้างพื้นฐาน:
    // !     * function declarations  this.structures.functions
    // !     * async functions  this.structures.asyncFunctions
    // !     * try blocks  this.structures.tryBlocks
    // !     * classes  this.structures.classes
    // !   - return structures object
    // !  
    // !   ใช้เมื่อ: ต้องการ Simple Structure Info แทน Full AST
    // ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
    parseSimpleStructures() {
        if (this.tokens.length === 0) {
            console.log('StructureParser: No tokens to parse, returning empty structures.');
            return this.structures;
        }

        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            
            // ! Detect functions
            if (token.type === 'KEYWORD' && token.value === 'function') {
                const funcInfo = this.parseFunctionDeclaration(i);
                if (funcInfo) {
                    this.structures.functions.push(funcInfo);
                }
            }
            
            // ! Detect async functions
            if (token.type === 'KEYWORD' && token.value === 'async') {
                const nextToken = this.tokens[i + 1];
                if (nextToken && nextToken.value === 'function') {
                    const asyncFuncInfo = this.parseAsyncFunction(i);
                    if (asyncFuncInfo) {
                        this.structures.asyncFunctions.push(asyncFuncInfo);
                    }
                }
            }
            
            // ! Detect try blocks
            if (token.type === 'KEYWORD' && token.value === 'try') {
                const tryInfo = this.parseTryBlock(i);
                if (tryInfo) {
                    this.structures.tryBlocks.push(tryInfo);
                }
            }
            
            // ! Detect classes
            if (token.type === 'KEYWORD' && token.value === 'class') {
                const classInfo = this.parseClass(i);
                if (classInfo) {
                    this.structures.classes.push(classInfo);
                }
            }
        }
        
        return this.structures;
    }

    // ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
    // !   STRUCTURE DETECTION HELPERS 
    // ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
    // !  งานที่ทำ: Helper methods สำหรับตรวจจับโครงสร้างแบบ simple (ไม่ใช้ full AST)
    // !  
    // !  parseFunctionDeclaration() 
    // !   - ตรวจจับ function declaration
    // !   - นับจำนวนพารามิเตอร์
    // !   - return { type, name, paramCount, location }
    // !  
    // !  parseAsyncFunction() 
    // !   - ตรวจจับ async function
    // !   - เช็คว่ามี await และ try-catch หรือไม่
    // !  
    // !  hasAwaitInFunction() 
    // !   - เช็คว่ามี await keyword ภายใน function หรือไม่
    // !  
    // !  hasTryCatchInFunction() 
    // !   - เช็คว่ามี try-catch block ภายใน function หรือไม่
    // !  
    // !  parseTryBlock() 
    // !   - ตรวจจับ try block
    // !   - เช็คว่ามี catch และ finally หรือไม่
    // !  
    // !  hasCatchAfterTry() :
    // !   - เช็คว่ามี catch block หลัง try หรือไม่
    // !  
    // !  hasFinallyAfterTry() :
    // !   - เช็คว่ามี finally block หรือไม่ (simplified)
    // !  
    // !  parseClass() :
    // !   - ตรวจจับ class declaration
    // !   - return { type, name, location }
    // ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
    parseFunctionDeclaration(startIndex) {
        const nameToken = this.tokens[startIndex + 1];
        if (!nameToken || nameToken.type !== 'IDENTIFIER') {
            // !  NO_SILENT_FALLBACKS: คืน error object แทน null
            return {
                type: 'ERROR',
                error: 'Function declaration missing identifier',
                location: { start: startIndex, end: startIndex + 1 }
            };
        }
        
        // ! Count parameters
        let paramCount = 0;
        let i = startIndex + 2;
        let foundOpenParen = false;
        
        while (i < this.tokens.length && !foundOpenParen) {
            if (this.tokens[i].value === '(') {
                foundOpenParen = true;
                i++;
                break;
            }
            i++;
        }
        
        if (foundOpenParen) {
            while (i < this.tokens.length && this.tokens[i].value !== ')') {
                if (this.tokens[i].type === 'IDENTIFIER') {
                    paramCount++;
                }
                i++;
            }
        }
        
        return {
            type: 'function',
            name: nameToken.value,
            paramCount,
            location: nameToken.location
        };
    }

    parseAsyncFunction(startIndex) {
        const funcInfo = this.parseFunctionDeclaration(startIndex + 1);
        if (funcInfo) {
            funcInfo.isAsync = true;
            funcInfo.hasAwait = this.hasAwaitInFunction(startIndex);
            funcInfo.hasTryCatch = this.hasTryCatchInFunction(startIndex);
        }
        return funcInfo;
    }

    hasAwaitInFunction(startIndex) {
        // ! Simple check for await keyword after function declaration
        let depth = 0;
        for (let i = startIndex; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token.value === '{') depth++;
            if (token.value === '}') {
                depth--;
                if (depth === 0) break;
            }
            if (token.type === 'KEYWORD' && token.value === 'await' && depth > 0) {
                return true;
            }
        }
        return false;
    }

    hasTryCatchInFunction(startIndex) {
        // ! Simple check for try-catch blocks within function
        let depth = 0;
        for (let i = startIndex; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token.value === '{') depth++;
            if (token.value === '}') {
                depth--;
                if (depth === 0) break;
            }
            if (token.type === 'KEYWORD' && token.value === 'try' && depth > 0) {
                return true;
            }
        }
        return false;
    }

    parseTryBlock(startIndex) {
        return {
            type: 'try-block',
            location: this.tokens[startIndex].location,
            hasCatch: this.hasCatchAfterTry(startIndex),
            hasFinally: this.hasFinallyAfterTry(startIndex)
        };
    }
 
    hasCatchAfterTry(startIndex) {
        let depth = 0;
        for (let i = startIndex; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token.value === '{') depth++;
            if (token.value === '}') {
                depth--;
                if (depth === 0) {
                    // ! Check next token for catch
                    const nextToken = this.tokens[i + 1];
                    return nextToken && nextToken.value === 'catch';
                }
            }
        }
        return false;
    }

    hasFinallyAfterTry(startIndex) {
        // ! Similar logic for finally block
        return false; // ! Simplified for now
    }

    parseClass(startIndex) {
        const nameToken = this.tokens[startIndex + 1];
        if (!nameToken || nameToken.type !== 'IDENTIFIER') {
            // !  NO_SILENT_FALLBACKS: คืน error object แทน null
            return {
                type: 'ERROR',
                error: 'Class declaration missing identifier',
                location: { start: startIndex, end: startIndex + 1 }
            };
        }
        
        return {
            type: 'class',
            name: nameToken.value,
            location: nameToken.location
        };
    }
}


// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  SIMPLE JAVASCRIPT PARSER CLASS 
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  งานที่ทำ: Simple parser สำหรับสร้าง basic AST (ไม่ใช้ Acorn/Babel)
// !  
// !  CONSTRUCTOR :
// !   - initialize tokens array และ position
// !  
// !  MAIN METHOD - parse() :
// !   - tokenize code ด้วย tokenizeSimple()
// !   - สร้าง Program node พร้อม body
// !   - return basic AST structure
// !  
// !  tokenizeSimple() :
// !   - Simple tokenizer ที่แยก:
// !     * String literals (",',`)
// !     * Numbers (123, 3.14)
// !     * Identifiers (foo, myVar)
// !     * Operators/Punctuation (+,-,*,/,etc.)
// !   - สร้าง tokens พร้อม location info
// !  
// !  HELPER METHODS :
// !   - parseStringLiteral(): แยก string literals
// !   - parseNumber(): แยก numbers
// !   - parseIdentifier(): แยก identifiers
// !   - parseStatements(): สร้าง basic statements
// !   - getLastLocation(): คืน location สุดท้าย
// !  
// !  NOTE: Parser นี้เป็น fallback/alternative สำหรับกรณีที่ไม่ต้องการ full AST
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════



// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !   SMART FILE ANALYZER CLASS 
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  งานที่ทำ: วิเคราะห์และตรวจสอบสุขภาพของไฟล์โค้ดก่อนการ parse
// !  
// !  CONSTRUCTOR :
// !   - โหลด configuration จาก PARSER_CONFIG หรือ custom config
// !   - ตั้งค่า maxFileSize และ chunkSize
// !   - ตั้งค่า healthCheckThresholds
// !   - Strict validation (ไม่มี fallback)
// !  
// !  performCodeHealthCheck() :
// !   - ตรวจสอบขนาดไฟล์ (file size)
// !   - ตรวจสอบ syntax issues (brace balance)
// !   - คืน { healthy, issues[] }
// !  
// !  checkBraceBalance() :
// !   - นับจำนวน { และ } ให้ balance
// !   - ข้าม braces ใน string literals
// !   - คืน balance (0 = balanced, 0 = unbalanced)
// !  
// !  analyzeIntent() :
// !   - วิเคราะห์เจตนาของโค้ด (intent analysis)
// !   - ตรวจจับ keywords เพื่อจัดหมวดหมู่:
// !     * security: auth, encrypt, token
// !     * businessLogic: calculate, validate, process
// !     * algorithm: sort, search, optimize
// !     * dataManagement: database, cache, store
// !     * apiIntegration: fetch, request, endpoint
// !   - คืน intents object พร้อมคะแนน
// !  
// !  processLargeFileInChunks() :
// !   - แบ่งไฟล์ใหญ่เป็น chunks
// !   - หาจุดตัด (line breaks) ที่เหมาะสม
// !   - คืน array ของ code chunks
// !  
// !  NOTE: Class นี้ช่วย optimize performance และป้องกัน memory overflow
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
class SmartFileAnalyzer {
    constructor(config = null) {
        // ! Use PARSER_CONFIG if no config provided, strict validation otherwise
        const actualConfig = config ? config : PARSER_CONFIG;
        const analyzerConfig = actualConfig.smartFileAnalyzer;
        if (!analyzerConfig) {
            throw new Error('SmartFileAnalyzer requires valid configuration with smartFileAnalyzer section');
        }
        
        if (!analyzerConfig.maxFileSize || !analyzerConfig.chunkSize) {
            throw new Error('SmartFileAnalyzer configuration missing required fields: maxFileSize, chunkSize');
        }
        
        this.maxFileSize = analyzerConfig.maxFileSize;
        this.chunkSize = analyzerConfig.chunkSize;

        // ! Strict validation - no silent fallbacks
        if (!analyzerConfig.healthCheckThresholds) {
            this.healthThresholds = actualConfig.astTraversal?.defaultHealthThresholds;
            if (!this.healthThresholds) {
                throw new Error('Configuration missing healthCheckThresholds and defaultHealthThresholds');
            }
        } else {
            this.healthThresholds = analyzerConfig.healthCheckThresholds;
        }
        
        console.log(` SmartFileAnalyzer configured: maxFileSize=${this.maxFileSize}, chunkSize=${this.chunkSize}`);
    }


// !  ตรวจสอบสุขภาพโค้ดก่อนการวิเคราะห์

    performCodeHealthCheck(code) {
        const issues = [];
        
        // Check file size
        if (code.length > this.maxFileSize) {
            issues.push({
                type: 'LARGE_FILE',
                message: `File too large: ${code.length} bytes (max: ${this.maxFileSize})`,
                severity: SEVERITY_LEVELS.WARNING
            });
        }
        
        // ! Check for basic syntax issues
        const braceBalance = this.checkBraceBalance(code);
        if (braceBalance !== 0) {
            issues.push({
                type: 'SYNTAX_ERROR',
                message: `Unbalanced braces: ${braceBalance}`,
                severity: SEVERITY_LEVELS.ERROR
            });
        }
        
        return {
            healthy: issues.filter(i => i.severity === 'ERROR').length === 0,
            issues
        };
    }

    checkBraceBalance(code) {
        let balance = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const prev = i > 0 ? code[i - 1] : '';
            
            // !  Handle string boundaries
            if ((char === '"' || char === "'" || char === '`') && prev !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
                continue;
            }
            
            if (inString) continue;
            
            if (char === '{') balance++;
            if (char === '}') balance--;
        }
        
        return balance;
    }


       // ! วิเคราะห์เจตนาของโค้ด (Intent Analysis)

    analyzeIntent(tokens) {
        const intents = {
            security: 0,
            businessLogic: 0,
            algorithm: 0,
            dataManagement: 0,
            apiIntegration: 0
        };

        // ! ใช้ keywords จาก config แทน hardcoded values
        const intentKeywords = PARSER_CONFIG.ruleChecking.intentAnalysisKeywords;
        if (!intentKeywords) {
            throw new Error('Parser configuration intentAnalysisKeywords section is required');
        }

        const securityKeywords = intentKeywords.security;
        const businessKeywords = intentKeywords.businessLogic;
        const algorithmKeywords = intentKeywords.algorithm;
        const dataKeywords = intentKeywords.dataManagement;
        const apiKeywords = intentKeywords.apiIntegration;

        tokens.forEach(token => {
            if (token.type === 'IDENTIFIER' || token.type === 'STRING') {
                const value = token.value.toLowerCase();
                
                if (securityKeywords.some(kw => value.includes(kw))) intents.security++;
                if (businessKeywords.some(kw => value.includes(kw))) intents.businessLogic++;
                if (algorithmKeywords.some(kw => value.includes(kw))) intents.algorithm++;
                if (dataKeywords.some(kw => value.includes(kw))) intents.dataManagement++;
                if (apiKeywords.some(kw => value.includes(kw))) intents.apiIntegration++;
            }
        });

        return intents;
    }


    // !  แบ่งไฟล์ใหญ่เป็น Chunks เพื่อประมวลผล

    processLargeFileInChunks(code) {
        if (code.length <= this.chunkSize) {
            return [code];
        }

        const chunks = [];
        let currentPos = 0;

        while (currentPos < code.length) {
            let chunkEnd = currentPos + this.chunkSize;

            // ! Find a good breaking point (end of line)
            if (chunkEnd < code.length) {
                while (chunkEnd > currentPos && code[chunkEnd] !== '\n') {
                    chunkEnd--;
                }
                if (chunkEnd === currentPos) {
                    // ! No line break found, use original chunk size
                    chunkEnd = Math.min(currentPos + this.chunkSize, code.length);
                }
            } else {
                chunkEnd = code.length;
            }

            chunks.push(code.slice(currentPos, chunkEnd));
            currentPos = chunkEnd;
        }

        return chunks;
    }
}


// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !   SMART PARSER ENGINE - MAIN CLASS 
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  งานที่ทำ: หัวใจหลักของระบบ - รวมทุกอย่างเข้าด้วยกัน
// !  
// !   OVERVIEW:
// !   - รับ combined grammar และ config
// !   - สร้าง GrammarIndex, Tokenizer, Analyzer
// !   - วิเคราะห์โค้ดด้วย full AST
// !   - traverse AST เพื่อตรวจจับ violations
// !   - คืน violations พร้อมรายละเอียด
// !  
// !   ZONE BREAKDOWN:
// !  
// !  ZONE 1: CONSTRUCTOR 
// !   - โหลด configuration (strict validation)
// !   - สร้าง components:
// !     * GrammarIndex: จาก combined grammar
// !     * JavaScriptTokenizer: พร้อม grammarIndex
// !     * SmartFileAnalyzer: สำหรับ health checks
// !     * SimpleJavaScriptParser: fallback parser
// !   - ตั้งค่า memory protection:
// !     * maxTokensPerAnalysis
// !     * maxMemoryUsage
// !     * maxAnalysisCount
// !     * maxASTNodes
// !  
// !  ZONE 2: analyzeCode() - MAIN ANALYSIS METHOD (บรรทัด 1737-1795)
// !   - CIRCUIT BREAKER: ป้องกัน memory overflow
// !   - Tokenize code
// !   - Build full AST with AdvancedStructureParser
// !   - Traverse AST เพื่อตรวจจับ violations
// !   - Return violations
// !  
// !  ZONE 3: traverseAST() - AST WALKER (บรรทัด 1800-1857)
// !   - เดิน AST tree แบบ recursive
// !   - ตรวจสอบแต่ละ node type
// !   - เรียก violation checkers:
// !     * checkMockingInAST()
// !     * checkHardcodeInAST()
// !     * checkSilentFallbacksInAST()
// !     * checkCachingInAST()
// !     * checkEmojiInAST()
// !  
// !  ZONE 4: VIOLATION CHECKERS 
// !   - checkMockingInAST(): jest.mock(), sinon.stub()
// !   - checkHardcodeInAST(): credentials, API keys, URLs
// !   - checkNumericHardcodeInAST(): hardcoded numbers
// !   - checkSilentFallbacksInAST(): empty catch, || fallbacks
// !   - checkLogicalFallbacksInAST(): || [], || {}
// !   - checkPromiseCatchFallbacks(): .catch(() => {})
// !   - checkAsyncFunctionWithoutTryCatch()
// !   - checkCachingInAST(): cache variables
// !   - checkMemoizationInAST(): memoize functions
// !   - checkEmojiInAST(): emoji detection
// !  
// !  ZONE 5: detectViolations() - LEGACY DETECTOR 
// !   - รวม violation detectors แบบเก่า
// !   - ใช้สำหรับ fallback หรือ double-check
// !  
// !  ZONE 6: SPECIFIC VIOLATION DETECTORS 
// !   - detectEmojiViolations()
// !   - detectHardcodeViolations()
// !   - detectSilentFallbackViolations()
// !   - detectCachingViolations()
// !   - detectMockingViolations()
// !  
// !   KEY FEATURES:
// !    Memory protection (circuit breaker)
// !    Full AST generation (เหมือน Babel/Acorn)
// !    Comprehensive violation detection
// !    NO_HARDCODE compliance (ใช้ config)
// !    Error recovery (ทำงานต่อเมื่อเจอ error)
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
class SmartParserEngine {
    constructor(combinedGrammar, config = null) { // รับ combined grammar และ config
        try {
            // ! Use PARSER_CONFIG if no config provided, strict validation otherwise
            const actualConfig = config ? config : PARSER_CONFIG;
            const engineConfig = actualConfig.smartParserEngine;
            if (!engineConfig) {
                throw new Error('SmartParserEngine requires valid configuration with smartParserEngine section');
            }

            // ! Store configs for later use (NO_HARDCODE compliance)
            this.config = actualConfig; // Store full config for accessing patterns
            this.engineConfig = engineConfig;
            
            const memoryConfig = engineConfig.memory;
            if (!memoryConfig) {
                throw new Error('SmartParserEngine configuration missing memory settings');
            }

            // ! สร้าง Index จาก grammar ที่ได้รับมา (ไม่โหลดเอง)
            this.grammarIndex = new GrammarIndex(combinedGrammar);
            
            // ! WHY: Use BinaryComputationTokenizer instead of hardcoded JavaScriptTokenizer
            // ! This connects tokenizer-helper.js to the main system (NO_HARDCODE compliance)
            this.tokenizer = new BinaryComputationTokenizer(this.grammarIndex);
            
            this.analyzer = new SmartFileAnalyzer(actualConfig); // ส่ง actualConfig ต่อ
            //  REMOVED: this.simpleParser = new SimpleJavaScriptParser()
            // WHY: SimpleJavaScriptParser violates NO_HARDCODE (hardcoded tokenizeSimple method)
            // Use this.tokenizer (BinaryComputationTokenizer) for ALL tokenization

            // ! MEMORY PROTECTION: Strict validation required
            if (!memoryConfig.maxTokensPerAnalysis) {
                throw new Error('Configuration missing maxTokensPerAnalysis');
            }
            if (!memoryConfig.maxMemoryUsage) {
                throw new Error('Configuration missing maxMemoryUsage');
            }
            if (!memoryConfig.maxAnalysisCount) {
                throw new Error('Configuration missing maxAnalysisCount');
            }
            if (!memoryConfig.maxASTNodes) {
                throw new Error('Configuration missing maxASTNodes');
            }
            
            this.maxTokensPerAnalysis = memoryConfig.maxTokensPerAnalysis;
            this.maxMemoryUsage = memoryConfig.maxMemoryUsage;
            this.maxAnalysisCount = memoryConfig.maxAnalysisCount;
            this.maxASTNodes = memoryConfig.maxASTNodes;
            this.analysisCount = 0;
            
            console.log(`SmartParserEngine configured: maxTokens=${this.maxTokensPerAnalysis}, maxMemory=${Math.round(this.maxMemoryUsage/1024/1024)}MB, maxAST=${this.maxASTNodes}`);
            console.log(' GrammarIndex has been successfully integrated into the Smart Parser Engine.');
        } catch (error) {
            console.error(' Failed to initialize SmartParserEngine:', error.message);
            throw new Error(`SmartParserEngine initialization failed: ${error.message}`);
        }
    }




    analyzeCode(code) {
        console.log('Smart Parser Engine: Starting AST analysis...');
        
        // ! WHY: Circuit breaker prevents infinite loops or recursive attacks that could
        // ! exhaust server memory. This is critical for production security.
        this.analysisCount++;
        if (this.analysisCount > this.engineConfig.memory.maxAnalysisCount) {
            throw new Error('Analysis limit exceeded - possible memory leak detected');
        }
        
        // ! WHY: Checking actual memory usage prevents DoS attacks with extremely
        // ! large/nested files that could crash the Node.js process.
        if (process.memoryUsage().heapUsed > this.maxMemoryUsage) {
            throw new Error(`Memory usage too high: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB > ${this.maxMemoryUsage / 1024 / 1024}MB`);
        }
        
        // ! เป้าหมาย: ทำให้ JavaScriptTokenizer อ่านไฟล์ได้ตั้งแต่ต้นจนจบ
        console.log('=== OPERATION: Building Our Own "Nose" ===');
        console.log('Target: Parse entire file with OUR OWN tokenizer...');

        let allViolations = [];
        
        try {
            // !  Step 1: Tokenize ด้วย JavaScriptTokenizer ของเราเอง
            console.log('Step 1: Tokenizing with OUR JavaScriptTokenizer...');
            const tokens = this.tokenizer.tokenize(code);
            console.log(`SUCCESS: Tokenized into ${tokens.length} tokens`);
            
            // !  Step 2: สร้าง Full AST ด้วย AdvancedStructureParser ของเราเอง!
            console.log('Step 2: Building Full AST with OUR AdvancedStructureParser...');
            const structureParser = new AdvancedStructureParser(tokens, this.grammarIndex);
            const ast = structureParser.parse(); // Returns complete AST like Babel/Acorn!

            // ! Safe check for AST structure
            const nodeCount = ast?.body?.length || 0;
            console.log(` SUCCESS: Built Full AST with ${nodeCount} top-level nodes`);

            // !  Step 4: เดินสำรวจ AST และตรวจจับ violations
            const violations = this.traverseAST(ast, code);
            allViolations.push(...violations);
                
        } catch (parseError) {
            // ! WHY: We log parse errors as "learning opportunities" instead of crashing.
            // ! This helps identify which JavaScript syntax patterns we haven't implemented yet,
            // ! allowing continuous improvement of the parser without blocking validation.
            console.error('PARSE ERROR - This is our LEARNING OPPORTUNITY!');
            console.error('What we need to teach our parser:');
            console.error('Error:', parseError.message);
            console.error('At position:', parseError.position || 'unknown');
            console.error('Near code:', parseError.context || 'unknown');
            
            // WHY: Use ERROR_TYPES from constants.js instead of hardcoding (NO_HARDCODE compliance)
            allViolations.push({
                ruleId: ERROR_TYPES.PARSER_LEARNING_NEEDED,
                severity: SEVERITY_LEVELS.CRITICAL, 
                message: `Our parser needs to learn: ${parseError.message}`,
                location: parseError.loc ? parseError.loc : DEFAULT_LOCATION,
                source: code.substring(0, 200) + '...',
                learningNote: 'Add this token/syntax to JavaScriptTokenizer'
            });
        }

        console.log(` Smart Parser Engine: Found ${allViolations.length} violations via AST`);
        
        // !  FIX: Return object ที่มี violations property เพื่อให้ cli.js อ่านได้ถูกต้อง
        return {
            violations: allViolations,
            parseSuccess: allViolations.length === 0
        };
    }


    // !  เดินสำรวจ AST Tree เพื่อตรวจจับ Violations (หัวใจของระบบ)

    traverseAST(astNode, sourceCode = '') {
        const violations = [];
        let nodeCount = 0;
        const maxNodes = this.maxASTNodes; // Config-based limit (no hardcode)

        // ! ฟังก์ชันเดิน AST แบบ Recursive
        const walk = (currentNode, parent = null, depth = 0) => {
            if (!currentNode || nodeCount > maxNodes) return;
            nodeCount++;
            
            try {
                // ! === ตรวจสอบกฎทั้ง 5 ข้อผ่าน AST Nodes ===
                
                // !  NO_MOCKING Detection
                if (currentNode.type === 'CallExpression') {
                    this.checkMockingInAST(currentNode, violations);
                }
                
                // ! NO_HARDCODE Detection  
                if (currentNode.type === 'Literal' || currentNode.type === 'StringLiteral') {
                    this.checkHardcodeInAST(currentNode, violations);
                    this.checkNumericHardcodeInAST(currentNode, violations);
                }
                
                // ! NO_SILENT_FALLBACKS Detection
                if (currentNode.type === 'CatchClause') {
                    this.checkSilentFallbacksInAST(currentNode, violations);
                }
                
                // ! Logical OR fallbacks (data || [])
                if (currentNode.type === 'LogicalExpression' && currentNode.operator === '||') {
                    this.checkLogicalFallbacksInAST(currentNode, violations);
                }
                
                // ! Promise catch with empty handler
                if (currentNode.type === 'CallExpression' && 
                    currentNode.callee?.type === 'MemberExpression' && 
                    currentNode.callee?.property?.name === 'catch') {
                    this.checkPromiseCatchFallbacks(currentNode, violations);
                }
                
                // ! Async function without try-catch
                if (currentNode.type === 'FunctionDeclaration' && currentNode.async === true) {
                    this.checkAsyncFunctionWithoutTryCatch(currentNode, violations);
                }
                
                // !  NO_INTERNAL_CACHING Detection
                if (currentNode.type === 'VariableDeclarator' || currentNode.type === 'AssignmentExpression') {
                    this.checkCachingInAST(currentNode, violations);
                }
                
                // ! this.cache property detection
                if (currentNode.type === 'MemberExpression') {
                    this.checkCachingPropertyInAST(currentNode, violations);
                }
                
                // ! Memoization function calls
                if (currentNode.type === 'CallExpression') {
                    this.checkMemoizationInAST(currentNode, violations);
                }
                
                // ! NO_EMOJI Detection
                if (currentNode.type === 'Literal' || currentNode.type === 'TemplateElement') {
                    this.checkEmojiInAST(currentNode, violations);
                }
                
                // ! เดินทางไปยัง Child Nodes
                for (const key in currentNode) {
                    const value = currentNode[key];
                    if (value && typeof value === 'object') {
                        if (Array.isArray(value)) {
                            value.forEach(child => walk(child, currentNode, depth + 1));
                        } else if (value.type) { // เป็น AST Node
                            walk(value, currentNode, depth + 1);
                        }
                    }
                }
                
            } catch (traverseError) {
                console.error('CRITICAL AST traverse error at node:', currentNode.type, traverseError.message);
                // ! หยุดการทำงานทันที เพราะไม่สามารถไปต่อได้อย่างน่าเชื่อถือ
                throw new Error(`AST traversal failed at node ${currentNode.type}: ${traverseError.message}`);
            }
        };

        // ! เริ่มเดินจาก Root ของ AST
        walk(astNode);
        console.log(` Traversed ${nodeCount} AST nodes, found ${violations.length} violations`);
        return violations;
    }

    checkMockingInAST(node, violations) {
        try {
            // ! jest.mock(), sinon.stub(), chai.spy()
            if (node.callee?.property?.name === 'mock' || 
                node.callee?.property?.name === 'stub' ||
                node.callee?.property?.name === 'spy') {
                violations.push({
                    ruleId: RULE_IDS.NO_MOCKING,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: ${node.callee.object?.name}.${node.callee.property.name}() detected`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }

            // ! jest.spyOn() - ตรวจ pattern พิเศษ
            if (node.callee?.property?.name === 'spyOn') {
                violations.push({
                    ruleId: RULE_IDS.NO_MOCKING,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: ${node.callee.object?.name}.spyOn() detected`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }

            // ! mockResolvedValue, mockImplementation, mockReturnValue
            if (node.callee?.property?.name?.includes('mock')) {
                violations.push({
                    ruleId: RULE_IDS.NO_MOCKING,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Mock method ${node.callee.property.name}() detected`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkMockingInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkHardcodeInAST(node, violations) {
        try {
            if (!node.value) return;
            const value = node.value.toString();
            const lowerValue = value.toLowerCase();

            // ! ใช้ patterns จาก config แทน hardcode
            const ruleConfig = PARSER_CONFIG.ruleChecking;
            if (!ruleConfig || !ruleConfig.customPatterns) {
                throw new Error('Parser configuration ruleChecking.customPatterns section is required');
            }
            const credentialKeywords = ruleConfig.customPatterns.credentialKeywords;
            const connectionPatterns = ruleConfig.customPatterns.connectionStringPatterns;
            
            // ! Credential detection
            if (credentialKeywords.some(keyword => lowerValue.includes(keyword))) {
                violations.push({
                    ruleId: RULE_IDS.NO_HARDCODE,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Hardcoded credential: "${node.value}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
            
            // ! API Key patterns (sk_live_, pk_test_, etc.)
            const apiKeyMinLength = ruleConfig.customPatterns.apiKeyMinLength;
            const hexMinLength = ruleConfig.customPatterns.hexMinLength;
            const alphanumericMinLength = ruleConfig.customPatterns.alphanumericMinLength;
            
            if (lowerValue.match(new RegExp(`^(sk_|pk_|api_|key_|secret_)[a-z0-9_]{${apiKeyMinLength},}$`)) ||
                lowerValue.match(new RegExp(`^[a-f0-9]{${hexMinLength},}$`)) ||
                (lowerValue.match(new RegExp(`^[a-zA-Z0-9]{${alphanumericMinLength},}$`)) && value.length > alphanumericMinLength)) {
                violations.push({
                    ruleId: RULE_IDS.NO_HARDCODE,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Hardcoded API key/token: "${node.value}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }

            // ! Connection string detection
            if (connectionPatterns.some(pattern => lowerValue.includes(pattern))) {
                violations.push({
                    ruleId: RULE_IDS.NO_HARDCODE,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Hardcoded connection string: "${node.value}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
            
            // ! URL detection (https://api.production.com/v1)
            if (lowerValue.match(/^https?:\/\/.*\.(com|org|net|io).*\//) || 
                lowerValue.includes('production') || 
                lowerValue.includes('staging')) {
                violations.push({
                    ruleId: RULE_IDS.NO_HARDCODE,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: `AST: Hardcoded URL/endpoint: "${node.value}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkHardcodeInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkNumericHardcodeInAST(node, violations) {
        try {
            if (node.type === 'Literal' && typeof node.value === 'number') {
                // ! ใช้ config แทน hardcoded array
                const ruleConfig = PARSER_CONFIG.ruleChecking;
                if (!ruleConfig || !ruleConfig.customPatterns) {
                    throw new Error('Parser configuration ruleChecking.customPatterns section is required');
                }
                const suspiciousNumbers = ruleConfig.customPatterns.suspiciousNumbers;
                const minThreshold = PARSER_CONFIG.astTraversal.minHardcodedNumberThreshold;
                
                if (suspiciousNumbers.includes(node.value) && node.value > minThreshold) {
                    violations.push({
                        ruleId: RULE_IDS.NO_HARDCODE,
                        severity: SEVERITY_LEVELS.CRITICAL, 
                        message: `AST: Hardcoded numeric value: ${node.value} (should use configuration)`,
                        location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                    });
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkNumericHardcodeInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkSilentFallbacksInAST(node, violations) {
        try {
            // ! ตรวจสอบ catch block ว่าเป็น silent fallback หรือไม่
            if (node.body && node.body.body) {
                const statements = node.body.body;
                
                // ! Empty catch block
                if (statements.length === 0) {
                    violations.push({
                        ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                        severity: SEVERITY_LEVELS.CRITICAL,
                        message: 'AST: Empty catch block detected - silent error handling',
                        location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                    });
                }

                // ! Catch block with only return null/undefined
                if (statements.length === 1) {
                    const stmt = statements[0];
                    if (stmt.type === 'ReturnStatement') {
                        if (!stmt.argument || 
                            (stmt.argument.type === 'Literal' && stmt.argument.value === null) ||
                            (stmt.argument.type === 'Identifier' && stmt.argument.name === 'undefined')) {
                            violations.push({
                                ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                                severity: SEVERITY_LEVELS.CRITICAL,
                                message: 'AST: Silent return in catch block detected',
                                location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkSilentFallbacksInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkLogicalFallbacksInAST(node, violations) {
        try {
            // ! ตรวจสอบ || fallback patterns
            if (node.operator === '||' && node.right) {
                // ! Common silent fallback patterns
                const isSilentFallback = 
                    (node.right.type === 'ArrayExpression' && node.right.elements.length === 0) || // || []
                    (node.right.type === 'ObjectExpression' && node.right.properties.length === 0) || // || {}
                    (node.right.type === 'Literal' && (node.right.value === null || node.right.value === '')) || // || null, || ''
                    (node.right.type === 'Identifier' && node.right.name === 'undefined'); // || undefined

                if (isSilentFallback) {
                    violations.push({
                        ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                        severity: SEVERITY_LEVELS.CRITICAL,
                        message: 'AST: Silent fallback with || operator detected',
                        location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                    });
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkLogicalFallbacksInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkPromiseCatchFallbacks(node, violations) {
        try {
            // ! ตรวจสอบ .catch() handlers
            if (node.arguments && node.arguments.length > 0) {
                const handler = node.arguments[0];

                // ! Empty function handler: .catch(() => {})
                if (handler.type === 'ArrowFunctionExpression' || handler.type === 'FunctionExpression') {
                    const body = handler.body;

                    // ! Empty block statement
                    if (body.type === 'BlockStatement' && body.body.length === 0) {
                        violations.push({
                            ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                            severity: SEVERITY_LEVELS.CRITICAL,
                            message: 'AST: Empty Promise catch handler detected',
                            location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkPromiseCatchFallbacks: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkAsyncFunctionWithoutTryCatch(node, violations) {
        try {
            // ! ตรวจสอบ async function ที่มี await แต่ไม่มี try-catch
            let hasAwait = false;
            let hasTryCatch = false;
            
            // ! ค้นหา await expressions
            this.traverseNodeForPatterns(node.body, (n) => {
                if (n.type === 'AwaitExpression') {
                    hasAwait = true;
                }
                if (n.type === 'TryStatement') {
                    hasTryCatch = true;
                }
            });
            
            if (hasAwait && !hasTryCatch) {
                violations.push({
                    ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                    severity: SEVERITY_LEVELS.CRITICAL,
                    message: 'AST: Async function with await but no error handling detected',
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkAsyncFunctionWithoutTryCatch: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    traverseNodeForPatterns(node, callback) {
        if (!node) return;
        
        callback(node);

        // ! Traverse child nodes
        for (const key in node) {
            if (key === 'parent' || key === 'loc' || key === 'range') continue;
            const child = node[key];
            
            if (Array.isArray(child)) {
                child.forEach(item => {
                    if (item && typeof item === 'object') {
                        this.traverseNodeForPatterns(item, callback);
                    }
                });
            } else if (child && typeof child === 'object') {
                this.traverseNodeForPatterns(child, callback);
            }
        }
    }

    checkCachingInAST(node, violations) {
        try {
            const varName = node.id?.name || node.left?.name || '';
            if (varName.toLowerCase().includes('cache') || 
                varName.toLowerCase().includes('store')) {
                violations.push({
                    ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: `AST: Potential caching variable: "${varName}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkCachingInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkCachingPropertyInAST(node, violations) {
        try {
            // ! ตรวจสอบ this.cache, obj.cache properties
            if (node.property && node.property.name) {
                const propertyName = node.property.name.toLowerCase();
                if (propertyName.includes('cache') || propertyName.includes('store') || propertyName.includes('memo')) {
                    violations.push({
                        ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                        severity: SEVERITY_LEVELS.WARNING,
                        message: `AST: Caching property detected: "${node.property.name}"`,
                        location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                    });
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkCachingPropertyInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkMemoizationInAST(node, violations) {
        try {
            // ! ตรวจสอบ memoization functions
            const callee = node.callee;

            // ! _.memoize()
            if (callee?.type === 'MemberExpression' &&
                callee.object?.name === '_' &&
                callee.property?.name === 'memoize') {
                violations.push({
                    ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: 'AST: Lodash memoize() function detected',
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }

            // ! memoize() direct call
            if (callee?.type === 'Identifier' && callee.name === 'memoize') {
                violations.push({
                    ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: 'AST: Memoize function call detected',
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }

            // ! useMemo() - React internal memoization
            if (callee?.type === 'Identifier' && callee.name === 'useMemo') {
                violations.push({
                    ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: 'AST: React useMemo() detected - internal memoization',
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkMemoizationInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }

    checkEmojiInAST(node, violations) {
        try {
            const rawText = node.value || node.raw || '';
            
            // ! Convert to string to handle numbers and other types
            const text = String(rawText);
            
            // ! Skip non-string content for emoji checking
            if (!text || typeof rawText !== 'string') {
                return; // ! Only check actual string literals
            }
            
            // ! Read emoji pattern from configuration (NO_HARDCODE compliance)
            const emojiRegexStr = this.config?.ruleChecking?.customPatterns?.emojiRegex || '';
            if (!emojiRegexStr) {
                return; // ! Skip if no configuration
            }
            
            const emojiPattern = new RegExp(emojiRegexStr, 'gu');
            
            emojiPattern.lastIndex = 0; // ! Reset regex state
            let match;
            while ((match = emojiPattern.exec(text)) !== null) {
                violations.push({
                    ruleId: RULE_IDS.NO_EMOJI,
                    severity: SEVERITY_LEVELS.WARNING,
                    message: `AST: Emoji detected: "${match[0]}"`,
                    location: node.loc?.start ? node.loc.start : DEFAULT_LOCATION
                });
                
                if (emojiPattern.lastIndex === match.index) {
                    emojiPattern.lastIndex++;
                }
            }
        } catch (error) {
            console.error(`[CRITICAL] Bug in validation logic at checkEmojiInAST: ${error.message}`);
            throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
        }
    }


    // !  ตรวจจับการละเมิดกฎทั้งหมด

    detectViolations(tokens, structures, code) {
        const violations = [];
        
        // ! NO_EMOJI Detection - ตรวจทุก STRING และ COMMENT token
        violations.push(...this.detectEmojiViolations(tokens));
        
        // !   NO_HARDCODE Detection - ตรวจ STRING และ NUMBER token
        violations.push(...this.detectHardcodeViolations(tokens));
        
        // ! NO_SILENT_FALLBACKS Detection - ใช้ structure analysis
        violations.push(...this.detectSilentFallbackViolations(structures, tokens));
        
        // ! NO_INTERNAL_CACHING Detection - ตรวจ pattern การ caching
        violations.push(...this.detectCachingViolations(tokens));
        
        // ! NO_MOCKING Detection - ตรวจ mocking patterns
        violations.push(...this.detectMockingViolations(tokens));
        
        return violations;
    }


    // !  ตรวจจับ Emoji (Memory Safe)

    detectEmojiViolations(tokens) {
        const violations = [];
        
        // ! MEMORY PROTECTION: ใช้แค่ regex หลักเพื่อป้องกัน memory leak รวม checkmark และ symbols
        const primaryEmojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2702}-\u{27B0}]|[\u{2194}-\u{21AA}]|[\u{231A}-\u{23FA}]|[\u{FE00}-\u{FE0F}]/gu;
        
        let checkedTokens = 0;
        const maxTokensToCheck = PARSER_CONFIG.astTraversal.maxTokensToCheck;
        
        tokens.forEach(token => {
            if (checkedTokens >= maxTokensToCheck) return;
            
            if (token.type === 'STRING' || token.type === 'COMMENT') {
                checkedTokens++;
                
                // ! Reset regex state to prevent infinite loops
                primaryEmojiPattern.lastIndex = 0;
                
                let match;
                let matchCount = 0;
                const maxEmojiMatches = PARSER_CONFIG.astTraversal.maxEmojiMatches;
                while ((match = primaryEmojiPattern.exec(token.value)) !== null && matchCount < maxEmojiMatches) {
                    violations.push({
                        ruleId: RULE_IDS.NO_EMOJI,
                        severity: SEVERITY_LEVELS.ERROR,
                        message: `Emoji "${match[0]}" found in ${token.type.toLowerCase()}`,
                        location: token.location,
                        emoji: match[0]
                    });
                    matchCount++;
                }
            }
        });
        
        return violations;
    }


    // !  ตรวจจับ Hardcode values (Memory Safe)

    detectHardcodeViolations(tokens) {
        const violations = [];
        
        // ! Skip if this appears to be a test file or demo code - ใช้ keywords จาก config
        const ignoreKeywords = PARSER_CONFIG.ruleChecking.hardcodeIgnoreKeywords;
        if (!ignoreKeywords || !Array.isArray(ignoreKeywords)) {
            throw new Error('Parser configuration hardcodeIgnoreKeywords must be a valid array');
        }
        
        const allText = tokens.map(t => t.value).join(' ');
        const shouldSkip = ignoreKeywords.some(keyword => allText.includes(keyword));
        if (shouldSkip) {
            return violations;
        }

        // ! ใช้ patterns จาก config แทน hardcoded values
        const patternConfigs = PARSER_CONFIG.ruleChecking.hardcodeDetectionPatterns;
        if (!patternConfigs) {
            throw new Error('Parser configuration hardcodeDetectionPatterns section is required');
        }
        
        const hardcodePatterns = patternConfigs.map(config => ({
            pattern: new RegExp(config.pattern, config.flags),
            name: config.name
        }));
        
        let checkedTokens = 0;
        const maxTokensToCheck = PARSER_CONFIG.astTraversal.maxTokensToCheck;
        
        tokens.forEach(token => {
            if (checkedTokens >= maxTokensToCheck) return;
            
            if (token.type === 'STRING' || token.type === 'NUMBER') {
                checkedTokens++;
                
                // ! ENHANCED: ปรับปรุงการตรวจ magic numbers
                if (token.type === 'NUMBER') {
                    const num = parseFloat(token.value);
                    if (!isNaN(num)) {
                        // ! Common safe numbers ที่ไม่ต้องแจ้งเตือน
                        const safeNumbers = PARSER_CONFIG.astTraversal.safeNumbers;

                        // ! ตรวจ magic numbers ที่น่าสงสัย
                        if (!safeNumbers.includes(num)) {
                            // ! ตัวเลขขนาดใหญ่ (เช่น timeout values, ports)
                            const suspiciousNumberThreshold = PARSER_CONFIG.astTraversal.suspiciousNumberThreshold;
                            const minThreshold = PARSER_CONFIG.astTraversal.minHardcodedNumberThreshold;
                            if (num > suspiciousNumberThreshold || (num > minThreshold && num % 10 !== 0)) {
                                violations.push({
                                    ruleId: RULE_IDS.NO_HARDCODE,
                                    severity: SEVERITY_LEVELS.WARNING,
                                    message: `Magic number detected: ${token.value}`,
                                    location: token.location,
                                    match: token.value
                                });
                            }
                        }
                    }
                    return;
                }
                
                // ! ENHANCED: ตรวจ string patterns อย่างละเอียด
                const tokenValue = token.value;

                // ! ตรวจ patterns ทั่วไป
                hardcodePatterns.forEach(({ pattern, name }) => {
                    if (pattern.test(tokenValue)) {
                        violations.push({
                            ruleId: RULE_IDS.NO_HARDCODE,
                            severity: SEVERITY_LEVELS.WARNING,
                            message: `${name} detected: ${tokenValue}`,
                            location: token.location,
                            match: tokenValue
                        });
                    }
                });
                
                // ! FIX: ตรวจ connection strings แบบเฉพาะ (ป้องกัน false positives) - ใช้ keywords จาก config
                const connectionKeywords = PARSER_CONFIG.ruleChecking.connectionStringKeywords;
                const ignoreKeywords = PARSER_CONFIG.ruleChecking.hardcodeIgnoreKeywords;
                
                if (!connectionKeywords || !Array.isArray(connectionKeywords)) {
                    throw new Error('Parser configuration connectionStringKeywords must be a valid array');
                }
                
                const minHardcodeLength = PARSER_CONFIG.astTraversal.minStringLengthForHardcodeCheck;
                const hasConnectionKeyword = connectionKeywords.some(keyword => tokenValue.includes(keyword));
                const hasIgnoreKeyword = ignoreKeywords.some(keyword => tokenValue.includes(keyword));
                
                if (tokenValue.length > minHardcodeLength && hasConnectionKeyword && !hasIgnoreKeyword) {
                    
                    violations.push({
                        ruleId: RULE_IDS.NO_HARDCODE,
                        severity: SEVERITY_LEVELS.WARNING,
                        message: `Potential connection string detected: ${tokenValue}`,
                        location: token.location,
                        match: tokenValue
                    });
                }
            }
        });
        
        return violations;
    }


     // !  ตรวจจับ Silent Fallbacks โดยใช้ GrammarIndex เท่านั้น

    detectSilentFallbackViolations(structures, tokens) {
        const violations = [];
        
        // ! ใช้ GrammarIndex ในการดึง patterns สำหรับ NO_SILENT_FALLBACKS
        const silentFallbackPatterns = this.grammarIndex.getPatternsForRule('NO_SILENT_FALLBACKS');
        
        if (!silentFallbackPatterns || silentFallbackPatterns.length === 0) {
            console.warn('GrammarIndex: NO_SILENT_FALLBACKS patterns not available');
            return violations;
        }
        
        // ! สร้าง code string จาก tokens
        const codeString = tokens.map(token => token.value || '').join(' ');
        
        // ! ตรวจสอบแต่ละ pattern จาก GrammarIndex
        silentFallbackPatterns.forEach((pattern, patternIndex) => {
            try {
                if (!pattern.regex || typeof pattern.regex !== 'object') {
                    return;
                }
                
                // ! NO_SILENT_FALLBACKS: ตรวจสอบอย่างเข้มงวด - ต้องมี source และ flags ที่ชัดเจน
                if (!pattern.regex.source || typeof pattern.regex.flags !== 'string') {
                    throw new Error(`Invalid regex pattern object at index ${patternIndex} for rule NO_SILENT_FALLBACKS: missing source or flags property (both are required)`);
                }
                
                const flags = pattern.regex.flags;
                const source = pattern.regex.source;
                const regex = new RegExp(source, flags);
                
                let match;
                let matchCount = 0;
                const maxMatches = PARSER_CONFIG.astTraversal.maxMatches;
                
                while ((match = regex.exec(codeString)) !== null && matchCount < maxMatches) {
                    matchCount++;
                    
                    const lineNumber = this.estimateLineFromMatch(tokens, match.index);
                    
                    violations.push({
                        ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                        severity: pattern.severity || 'ERROR',
                        message: `Silent fallback detected: ${pattern.name}`,
                        location: { 
                            line: lineNumber,
                            column: 1 
                        }
                    });
                    
                    if (regex.lastIndex === match.index) {
                        regex.lastIndex++;
                    }
                }
            } catch (error) {
                console.error(`[CRITICAL] Bug in GrammarIndex pattern for NO_SILENT_FALLBACKS[${patternIndex}]: ${error.message}`);
                throw error; // ! ส่งต่อ error ไปยังระดับบนเพื่อหยุดการทำงาน
            }
        });
        
        // ! เพิ่มการตรวจสอบ async functions จาก structure analysis
        if (structures && structures.asyncFunctions) {
            structures.asyncFunctions.forEach(func => {
                if (func.hasAwait && !func.hasTryCatch) {
                    violations.push({
                        ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                        severity: SEVERITY_LEVELS.WARNING,
                        message: `Async function with await but no try-catch error handling`,
                        location: func.location ? func.location : DEFAULT_LOCATION
                    });
                }
            });
        }
        
        return violations;
    }
    

    // ! ตรวจจับ Empty catch blocks

    findEmptyCatchBlocks(tokens) {
        const violations = [];
        let i = 0;
        
        while (i < tokens.length) {
            const token = tokens[i];
            
            if (token.type === 'KEYWORD' && token.value === 'catch') {
                // หาตำแหน่ง { ของ catch block
                let openBraceIndex = -1;
                let j = i + 1;
                
                while (j < tokens.length && j < i + 10) { // จำกัดการค้นหา
                    if (tokens[j].value === '{') {
                        openBraceIndex = j;
                        break;
                    }
                    j++;
                }
                
                if (openBraceIndex > 0) {
                    // ตรวจสอบว่า catch block ว่างหรือไม่
                    const isEmpty = this.isCatchBlockEmpty(tokens, openBraceIndex);
                    const returnsSilently = this.catchBlockReturnsSilently(tokens, openBraceIndex);
                    
                    if (isEmpty) {
                        violations.push({
                            ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                            severity: SEVERITY_LEVELS.ERROR,
                            message: 'Empty catch block detected - errors are silently ignored',
                            location: token.location
                        });
                    } else if (returnsSilently) {
                        violations.push({
                            ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                            severity: SEVERITY_LEVELS.ERROR,
                            message: 'Silent catch block returns default value without logging',
                            location: token.location
                        });
                    }
                }
            }
            
            i++;
        }
        
        return violations;
    }

    // ! ตรวจจับ Empty Promise catches
    findEmptyPromiseCatches(tokens) {
        const violations = [];
        let i = 0;
        
        while (i < tokens.length - 2) {
            if (tokens[i].value === '.' && 
                tokens[i + 1].type === 'IDENTIFIER' && 
                tokens[i + 1].value === 'catch') {
                
                // ! หา arrow function ใน catch
                let j = i + 2;
                while (j < tokens.length && j < i + 15) {
                    if (tokens[j].value === '=>') {
                        // ! ตรวจสอบว่า catch handler ว่างหรือไม่
                        if (this.isArrowFunctionEmpty(tokens, j)) {
                            violations.push({
                                ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                                severity: SEVERITY_LEVELS.ERROR,
                                message: 'Promise with empty catch handler',
                                location: tokens[i + 1].location
                            });
                        }
                        break;
                    }
                    j++;
                }
            }
            i++;
        }
        
        return violations;
    }
    

    // ! ตรวจจับ Silent fallback patterns อื่นๆ

    findSilentFallbackPatterns(tokens) {
        const violations = [];
        let i = 0;
        
        while (i < tokens.length - 1) {
            const token = tokens[i];
            
            // !  ตรวจ || และ ?? patterns ทั้งหมด
            if (token.value === '||' || token.value === '??') {
                const nextToken = tokens[i + 1];
                const nextNextToken = i + 2 < tokens.length ? tokens[i + 2] : null;
                
                // ! FIX: ตรวจ silent fallbacks ครอบคลุมมากขึ้น
                if (nextToken) {
                    let isSilentFallback = false;
                    let fallbackType = '';
                    
                    // ! 1. || [] หรือ ?? []
                    if (nextToken.value === '[' && nextNextToken && nextNextToken.value === ']') {
                        isSilentFallback = true;
                        fallbackType = 'empty array';
                    }
                    
                    // ! 2. || {} หรือ ?? {}
                    else if (nextToken.value === '{' && nextNextToken && nextNextToken.value === '}') {
                        isSilentFallback = true;
                        fallbackType = 'empty object';
                    }
                    
                    // ! 3. || null หรือ ?? null
                    else if (nextToken.type === 'KEYWORD' && nextToken.value === 'null') {
                        isSilentFallback = true;
                        fallbackType = 'null';
                    }
                    
                    // ! 4. || false หรือ ?? false
                    else if (nextToken.type === 'KEYWORD' && nextToken.value === 'false') {
                        isSilentFallback = true;
                        fallbackType = 'false';
                    }
                    
                    // ! 5. || "" หรือ ?? ""
                    else if (nextToken.type === 'STRING' && 
                            (nextToken.value === '""' || nextToken.value === "''" || nextToken.value.length <= 2)) {
                        isSilentFallback = true;
                        fallbackType = 'empty string';
                    }
                    
                    // ! 6. || 0 หรือ ?? 0 
                    else if (nextToken.type === 'NUMBER' && nextToken.value === '0') {
                        isSilentFallback = true;
                        fallbackType = 'zero';
                    }
                    
                    // ! FIX: เพิ่มการตรวจ function call patterns
                    // ! 7. functionCall() || defaultValue
                    else if (this.isFunctionCallPattern(tokens, i)) {
                        isSilentFallback = true;
                        fallbackType = 'function call with default';
                    }
                    
                    if (isSilentFallback) {
                        violations.push({
                            ruleId: RULE_IDS.NO_SILENT_FALLBACKS,
                            severity: SEVERITY_LEVELS.ERROR,
                            message: `Silent fallback to ${fallbackType} with ${token.value}`,
                            location: token.location
                        });
                    }
                }
            }
            
            i++;
        }
        
        return violations;
    }
    

    // !  Helper: ตรวจสอบ function call pattern

    isFunctionCallPattern(tokens, operatorIndex) {
        // ! ย้อนกลับไปหาว่าก่อน || มี function call หรือไม่
        let i = operatorIndex - 1;
        let foundCloseParen = false;
        let parenCount = 0;
        
        // ! หา ) ก่อนหน้า ||
        while (i >= 0 && i >= operatorIndex - 10) { // จำกัดการค้นหา
            if (tokens[i].value === ')') {
                foundCloseParen = true;
                parenCount = 1;
                i--;
                break;
            }
            i--;
        }
        
        if (!foundCloseParen) return false;
        
        // ! หา ( ที่ match กับ )
        while (i >= 0 && parenCount > 0) {
            if (tokens[i].value === ')') parenCount++;
            if (tokens[i].value === '(') parenCount--;
            i--;
        }
        
        // ! ตรวจสอบว่าก่อน ( มี identifier (function name) หรือไม่
        if (i >= 0 && tokens[i].type === 'IDENTIFIER') {
            return true;
        }
        
        return false;
    }
    

    // !  Helper: ตรวจสอบว่า catch block ว่างหรือไม่

    isCatchBlockEmpty(tokens, openBraceIndex) {
        let braceCount = 1;
        let i = openBraceIndex + 1;
        let hasContent = false;
        
        while (i < tokens.length && braceCount > 0) {
            if (tokens[i].value === '{') braceCount++;
            if (tokens[i].value === '}') braceCount--;
            
            // ! ถ้ามี token ที่ไม่ใช่ whitespace หรือ comment = มี content
            if (braceCount > 0 && 
                tokens[i].type !== 'COMMENT' && 
                tokens[i].value.trim() !== '') {
                hasContent = true;
            }
            
            i++;
        }
        
        return !hasContent;
    }
    

    // ! Helper: ตรวจสอบว่า catch block return แบบ silent หรือไม่

    catchBlockReturnsSilently(tokens, openBraceIndex) {
        let braceCount = 1;
        let i = openBraceIndex + 1;
        let hasReturn = false;
        let hasLogging = false;
        
        while (i < tokens.length && braceCount > 0) {
            if (tokens[i].value === '{') braceCount++;
            if (tokens[i].value === '}') braceCount--;
            
            if (braceCount > 0) {
                if (tokens[i].type === 'KEYWORD' && tokens[i].value === 'return') {
                    hasReturn = true;
                }
                
                if (tokens[i].type === 'IDENTIFIER' && 
                    (tokens[i].value.includes('log') || 
                     tokens[i].value.includes('console') ||
                     tokens[i].value.includes('error'))) {
                    hasLogging = true;
                }
            }
            
            i++;
        }
        
        return hasReturn && !hasLogging;
    }
    

    // !  Helper: ตรวจสอบว่า arrow function ว่างหรือไม่

    isArrowFunctionEmpty(tokens, arrowIndex) {
        let i = arrowIndex + 1;
        
       // ! Skip whitespace
        while (i < tokens.length && /\s/.test(tokens[i].value)) {
            i++;
        }
        
        if (i < tokens.length) {
            // ! ถ้าเป็น {} ว่าง
            if (tokens[i].value === '{' && 
                i + 1 < tokens.length && 
                tokens[i + 1].value === '}') {
                return true;
            }

            // ! ถ้าเป็น expression ที่ไม่ทำอะไร
            if (tokens[i].value === '(' && 
                i + 1 < tokens.length && 
                tokens[i + 1].value === ')') {
                return true;
            }
        }
        
        return false;
    }


    // ! ตรวจจับ Internal Caching - UPGRADED with GrammarIndex

    detectCachingViolations(tokens) {
        const violations = [];
        // ! UPGRADE: ดึง patterns จาก GrammarIndex
        const cachingPatterns = this.grammarIndex.getPatternsForRule('NO_INTERNAL_CACHING');

        tokens.forEach(token => {
            if (token.type === 'IDENTIFIER') {
                for (const pattern of cachingPatterns) {
                    // ! สมมติว่า pattern เป็น regex หรือ string
                    const isMatch = pattern.regex ? 
                        pattern.regex.test(token.value) : 
                        token.value.toLowerCase().includes(pattern.keyword.toLowerCase());
                        
                    if (isMatch) {
                        violations.push({
                            ruleId: RULE_IDS.NO_INTERNAL_CACHING,
                            severity: SEVERITY_LEVELS.WARNING,
                            message: `Internal caching detected: ${pattern.name || pattern.keyword}`,
                            location: token.location
                        });
                    }
                }
            }
        });

        return violations;
    }


    // ! ตรวจจับ Mocking patterns - UPGRADED with GrammarIndex  

    detectMockingViolations(tokens) {
        const violations = [];
        // ! UPGRADE: ดึง patterns จาก GrammarIndex
        const mockingPatterns = this.grammarIndex.getPatternsForRule('NO_MOCKING');
        
        tokens.forEach((token, index) => {
            if (token.type === 'IDENTIFIER') {
                for (const pattern of mockingPatterns) {
                    const isMatch = pattern.regex ? 
                        pattern.regex.test(token.value) : 
                        token.value.toLowerCase().includes(pattern.keyword.toLowerCase());
                        
                    if (isMatch) {
                        violations.push({
                            ruleId: RULE_IDS.NO_MOCKING,
                            severity: SEVERITY_LEVELS.ERROR,
                            message: `Mocking detected: ${pattern.name || pattern.keyword}`,
                            location: token.location
                        });
                    }
                }
            }
        });
        
        return violations;
    }

    // ! Helper: ประมาณการ line number จาก string position ใน match
    estimateLineFromMatch(tokens, matchIndex) {
        if (!tokens || tokens.length === 0) {
            console.warn(`Could not estimate line number: no tokens provided for match at index ${matchIndex}`);
            return -1; // ! ไม่สามารถหา line number ได้
        }
        
        let currentPosition = 0;
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const tokenLength = (token.value ? token.value.length : 0) + 1;
            
            if (currentPosition + tokenLength >= matchIndex) {
                if (token.location && token.location.line) {
                    return token.location.line;
                }
                console.warn(`Could not estimate line number: token at index ${i} has no location data for match at index ${matchIndex}`);
                return -1;
            }
            
            currentPosition += tokenLength;
        }
        
        const lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.location && lastToken.location.line) {
            return lastToken.location.line;
        }

        // ! ไม่สามารถหา line number ได้, ควรแจ้งให้ทราบ
        console.warn(`Could not estimate line number for match at index ${matchIndex}: no valid location data found`);
        return -1;
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !   MODULE EXPORTS 
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
// !  งานที่ทำ: Export SmartParserEngine class สำหรับใช้งานใน modules อื่น
// !  
// !  Exported Classes:
// !   - SmartParserEngine: Main parser engine class
// !  
// !  Usage:
// !   import { SmartParserEngine } from './smart-parser-engine.js';
// !   const engine = new SmartParserEngine(combinedGrammar, config);
// !   const result = engine.analyzeCode(code);
// ! ══════════════════════════════════════════════════════════════════════════════════════════════════════════
export { SmartParserEngine };

