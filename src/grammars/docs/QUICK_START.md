#  Grammar System - Quick Start Guide

## เริ่มต้นใช้งานภายใน 5 นาที!

###  Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

---

##  Step 1: ติดตั้งและ Setup

```bash
# Clone หรือ Navigate to project
cd chahuadev-scanner

# ติดตั้ง dependencies (optional สำหรับ corpus testing)
npm install react lodash express typescript --save-dev
```

---

##  Step 2: รัน Grammar Validation

ตรวจสอบว่าแกรมม่าทั้งหมดถูกต้อง:

```bash
npm run grammar:validate
```

**คาดหวังผลลัพธ์:**
```
 Starting Grammar Validation...

 Validating JavaScript Grammar...
 Validating TypeScript Grammar...
 Validating Java Grammar...
 Validating JSX Grammar...

================================================================================
 VALIDATION REPORT
================================================================================

 Statistics:
   Total Keywords: 118
    Valid: 118
    Invalid: 0
     Missing Fields: 0
    Duplicates: 0

 ALL GRAMMARS ARE VALID! 
================================================================================
```

---

##  Step 3: ดู Disambiguation Report

ดูว่าระบบจัดการสัญลักษณ์กำกวมได้อย่างไร:

```bash
npm run grammar:disambiguate
```

**คุณจะเห็น:**
- สัญลักษณ์ที่มีความหมายหลายแบบ (เช่น `/`, `*`, `<`, `:`)
- กฎการแยกแยะแต่ละความหมาย
- ตัวอย่างการใช้งานจริง

---

##  Step 4: ทดสอบกับโค้ดจริง (Corpus Testing)

**ต้อง install libraries ก่อน:**

```bash
npm install react lodash express typescript --save-dev
```

**รัน corpus testing:**

```bash
npm run grammar:corpus
```

**คุณจะเห็น:**
- จำนวนไฟล์ที่ทดสอบ
- Success rate
- Edge cases ที่พบ
- ข้อเสนอแนะการปรับปรุง

---

##  Step 5: ดูตัวอย่าง Error Messages

ดูว่าระบบแจ้ง error อย่างไรเมื่อเจอปัญหา:

```bash
npm run grammar:errors
```

**คุณจะเห็น:**
- ข้อความ error ที่เป็นมิตร
- คำแนะนำการแก้ไข
- ตัวอย่างโค้ดที่ถูกและผิด
- ลิงก์เอกสารอ้างอิง

---

##  การใช้งาน API (สำหรับ Developers)

### 1. Grammar Index - ค้นหา Keyword

```javascript
import { GrammarIndex } from './src/grammars/shared/grammar-index.js';

const index = new GrammarIndex();

// ค้นหา keyword
const info = index.lookup('await');

console.log(info);
// {
//   keyword: 'await',
//   category: 'operator',
//   esVersion: 'ES8',
//   errorMessage: "'await' can only be used in async functions...",
//   ...
// }
```

### 2. Disambiguation Engine - แยกแยะความหมาย

```javascript
import { DisambiguationEngine } from './src/grammars/shared/disambiguation-engine.js';

const engine = new DisambiguationEngine();

// แยกแยะสัญลักษณ์
const result = engine.disambiguate('/', {
    precedingTokens: [{ type: 'IDENTIFIER', value: 'a' }],
    followingTokens: [{ type: 'IDENTIFIER', value: 'b' }]
});

console.log(result.type); // 'DIVISION'
console.log(result.confidence); // 0.9
```

### 3. Error Assistant - สร้างข้อความ Error

```javascript
import { ErrorAssistant, ERROR_TYPES } from './src/grammars/shared/error-assistant.js';

const assistant = new ErrorAssistant();

// สร้าง error
const error = assistant.generateError(ERROR_TYPES.WRONG_CONTEXT, {
    token: 'await',
    line: 10,
    column: 5
});

// แสดงผล
console.log(assistant.formatError(error));
```

### 4. Grammar Validator - ตรวจสอบแกรมม่า

```javascript
import { GrammarValidator } from './src/grammars/shared/validate-grammars.js';

const validator = new GrammarValidator();

// Validate all
const result = validator.validateAll();

console.log(result.valid); // true/false
console.log(result.errors); // array of errors
```

---

##  npm Scripts ทั้งหมด

```bash
# Grammar Commands
npm run grammar:validate      # ตรวจสอบความถูกต้อง
npm run grammar:corpus        # ทดสอบกับโค้ดจริง
npm run grammar:disambiguate  # ดู disambiguation report
npm run grammar:errors        # ดูตัวอย่าง error messages
npm run grammar:all          # รันทุกอย่างพร้อมกัน
```

---

##  Troubleshooting

###  "Module type not specified"

**แก้ไข:** เพิ่ม `"type": "module"` ใน `package.json`:

```json
{
  "name": "chahuadev-scanner",
  "version": "2.0.0",
  "type": "module",
  ...
}
```

###  "Cannot find module"

**แก้ไข:** ตรวจสอบว่าไฟล์มีอยู่จริงและใช้ `.js` extension:

```javascript
import { GrammarIndex } from './grammar-index.js'; // ต้องมี .js
```

###  Corpus testing fail

**สาเหตุ:** ยัง install libraries ไม่ครบ

**แก้ไข:**
```bash
npm install react lodash express typescript --save-dev
```

---

##  เรียนรู้เพิ่มเติม

-  [Grammar README](./GRAMMAR_README.md) - เอกสารฉบับเต็ม
-  [TypeScript Grammar](../typescript.grammar.js) - ตัวอย่างแกรมม่าที่สมบูรณ์
-  [JavaScript Grammar](../javascript.grammar.js) - แกรมม่า ES1-ES2024
-  [JSX Grammar](../jsx.grammar.js) - React JSX syntax

---

##  Workshop: เพิ่ม Keyword ใหม่

### ตัวอย่าง: เพิ่ม `null` ใน JavaScript

1. **เปิดไฟล์:** `src/grammars/javascript.grammar.js`

2. **เพิ่ม keyword ตาม 5 Strategies:**

```javascript
'null': {
    // 1. Syntactic Relationships
    category: 'literal',
    source: 'ECMA-262',
    description: 'Null value - represents intentional absence',
    followedBy: ['SEMICOLON', 'COMMA', 'PAREN_CLOSE'],
    precededBy: ['ASSIGN', 'RETURN', 'COLON'],
    parentContext: ['Expression', 'Literal'],
    startsExpr: true,
    beforeExpr: false,
    
    // 2. Parser Directives
    isLiteral: true,
    isPrimitive: true,
    isNullable: true,
    
    // 3. Disambiguation Rules
    disambiguation: [{
        language: 'JavaScript',
        rule: 'null vs undefined',
        null: 'Intentional absence',
        undefined: 'Uninitialized',
        note: 'typeof null === "object" (historical bug)'
    }],
    
    // 4. Error Reporting
    errorMessage: "null represents intentional absence of value.",
    commonTypos: ['nul', 'NULL', 'Null'],
    notes: 'typeof null === "object" is a bug from ES1.',
    quirks: [
        'typeof null === "object"',
        'null == undefined (true)',
        'null === undefined (false)',
        'Not an object despite typeof'
    ],
    
    // 5. Complete Coverage
    stage: 'stable',
    esVersion: 'ES1',
    spec: 'ECMA-262 Section 4.3.12',
    bestPractice: 'Use null for intentional absence, undefined for uninitialized.',
    useCases: [
        'Intentional absence',
        'Reset object reference',
        'API returns'
    ],
    examples: [
        'const obj = null',
        'if (value === null)',
        'array.find() || null'
    ]
}
```

3. **Validate:**

```bash
npm run grammar:validate
```

4. **Done!** 

---

##  Next Steps

1.  รัน validation ครั้งแรก
2.  ดู disambiguation report
3.  ทดสอบกับโค้ดจริง (corpus)
4.  ศึกษา API และนำไปใช้

**Happy Coding! **
