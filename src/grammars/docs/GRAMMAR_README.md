#  Grammar System - Ultimate Guide

## ภาพรวม (Overview)

ระบบแกรมม่าที่สมบูรณ์แบบที่สุดสำหรับ **ChahuadevR Scanner Engine** ครอบคลุม:
-  **JavaScript** (ES1-ES2024) - 37+ keywords
-  **TypeScript** (1.0-5.x) - 49 keywords  
-  **Java** (SE 8-21) - 17+ keywords (กำลังพัฒนา)
-  **JSX** (React 16+) - 15 items

##  4 ภารกิจสู่ความสมบูรณ์แบบ

### ภารกิจที่ 1: Grammar Linter 

เครื่องมือตรวจสอบความถูกต้องและความสอดคล้องของแกรมม่าทั้งหมด

#### การใช้งาน:

```bash
# Validate all grammars
npm run grammar:validate

# หรือรันโดยตรง
node src/grammars/shared/validate-grammars.js
```

#### สิ่งที่ตรวจสอบ:

-  **ความครบถ้วน**: ทุก keyword มี `category`, `source`, `description`
-  **ความสัมพันธ์**: `followedBy`, `precededBy` อ้างอิงถูกต้อง
-  **ความซ้ำซ้อน**: ไม่มี keyword ประกาศซ้ำ
-  **Type Safety**: ตรงตาม `index.d.ts`
-  **5 Strategies**: ครบทุก property ที่จำเป็น

#### ตัวอย่างผลลัพธ์:

```
 VALIDATION REPORT
================================================================================

 Statistics:
   Total Keywords: 101
    Valid: 95
    Invalid: 6
     Missing Fields: 12
    Duplicates: 0

  WARNINGS:
    [JavaScript] "debugger" (example): Missing example or examples field
    [Java] "abstract" (disambiguation): Missing disambiguation array

 ALL GRAMMARS ARE VALID! 
```

---

### ภารกิจที่ 2: Corpus Testing 

ทดสอบแกรมม่ากับโค้ดจริงจากโปรเจกต์ Open Source

#### การใช้งาน:

```bash
# Install test corpus
npm install react lodash express typescript

# Run corpus testing
npm run grammar:corpus

# หรือรันโดยตรง
node src/grammars/shared/corpus-tester.js
```

#### โปรเจกต์ทดสอบ:

1. **React** - JSX และ Modern JavaScript
2. **Lodash** - Functional Programming Patterns
3. **Express** - Node.js Patterns
4. **TypeScript** - Complex Type System

#### ตัวอย่างผลลัพธ์:

```
 CORPUS TESTING REPORT
================================================================================

 Statistics:
   Total Files Tested: 1,247
    Successful: 1,189 (95.35%)
    Failed: 58 (4.65%)
    Total Tokens: 3,456,789

 Detected Edge Cases:
   Template literals: 23 occurrences
   Optional chaining: 45 occurrences
   Private fields: 12 occurrences
   Import meta: 8 occurrences

 Recommendations:
    Review failed files to identify missing grammar rules
    Add disambiguation rules for edge cases
```

---

### ภารกิจที่ 3: Disambiguation Engine 

Master of Ambiguous Syntax - ตัดสินสัญลักษณ์กำกวมอย่างชาญฉลาด

#### การใช้งาน:

```bash
# Generate disambiguation report
npm run grammar:disambiguate

# หรือรันโดยตรง
node src/grammars/shared/disambiguation-engine.js
```

#### สัญลักษณ์กำกวมที่รองรับ:

| สัญลักษณ์ | ความหมายที่เป็นไปได้ | ตัวอย่าง |
|---------|-------------------|---------|
| `/` | Division, RegExp, JSX Closing | `a / b`, `/abc/g`, `</div>` |
| `*` | Multiplication, Generator, Import | `a * b`, `function*`, `import *` |
| `<` | Less than, JSX, Generic, Shift | `a < b`, `<Component>`, `Array<T>` |
| `:` | Property, Ternary, Label, Type | `{a: 1}`, `a ? b : c`, `loop:` |
| `async` | Keyword, Identifier | `async function`, `const async = 1` |
| `.` | Property, Spread, Decimal, Optional | `obj.x`, `...arr`, `3.14`, `obj?.x` |

#### API การใช้งาน:

```javascript
import { DisambiguationEngine } from './disambiguation-engine.js';

const engine = new DisambiguationEngine();

// Disambiguate symbol
const result = engine.disambiguate('/', {
    precedingTokens: [{ type: 'IDENTIFIER', value: 'a' }],
    followingTokens: [{ type: 'IDENTIFIER', value: 'b' }],
    language: 'javascript'
});

console.log(result);
// {
//   symbol: '/',
//   type: 'DIVISION',
//   confidence: 0.9,
//   example: 'a / b',
//   alternatives: [...]
// }
```

---

### ภารกิจที่ 4: Error Assistant 

The Ultimate Error Messaging System

#### การใช้งาน:

```bash
# View error examples
npm run grammar:errors

# หรือรันโดยตรง
node src/grammars/shared/error-assistant.js
```

#### API การใช้งาน:

```javascript
import { ErrorAssistant, ERROR_TYPES } from './error-assistant.js';

const assistant = new ErrorAssistant();

// Generate comprehensive error
const error = assistant.generateError(ERROR_TYPES.WRONG_CONTEXT, {
    token: 'await',
    line: 10,
    column: 5,
    language: 'javascript'
});

// Format for display
console.log(assistant.formatError(error, { verbose: true }));
```

#### ตัวอย่างข้อความ Error:

```
================================================================================
 'await' can only be used in async functions or at the top level of modules.
   at Line 10, Column 5
================================================================================

 Suggestions:
   1. Add async to function (85% confidence)

 Correct Usage:
   async function fn() { await x; }
   // await can only be used in async functions

 Quick Fixes:
   1. Add async to function
      await can only be used in async functions

 Learn More:
   MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
   Spec: https://tc39.es/ecma262/

================================================================================
```

---

##  โครงสร้างแกรมม่า (Grammar Structure)

### 5 Strategies (บังคับสำหรับทุก Keyword):

```javascript
'keyword': {
    // 1. Syntactic Relationships
    category: 'keyword',
    source: 'ECMA-262',
    description: 'คำอธิบาย',
    followedBy: ['IDENTIFIER', 'PAREN_OPEN'],
    precededBy: ['NEWLINE', 'SEMICOLON'],
    parentContext: ['Statement', 'BlockStatement'],
    startsExpr: false,
    beforeExpr: true,
    
    // 2. Parser Directives
    isStatement: true,
    isControl: true,
    requiresCondition: true,
    hoisted: false,
    blockScoped: true,
    
    // 3. Disambiguation Rules
    disambiguation: [{
        language: 'JavaScript',
        rule: 'กฎการแยกแยะ',
        context: 'บริบท',
        examples: ['ตัวอย่าง'],
        note: 'หมายเหตุ'
    }],
    
    // 4. Error Reporting
    errorMessage: "ข้อความ error",
    commonTypos: ['tpyo1', 'typo2'],
    notes: 'หมายเหตุเพิ่มเติม',
    quirks: [
        'จุดพิเศษที่ 1',
        'จุดพิเศษที่ 2'
    ],
    
    // 5. Complete Coverage
    stage: 'stable',
    esVersion: 'ES6',
    spec: 'ECMA-262 Section 13.6',
    bestPractice: 'แนวทางปฏิบัติที่ดี',
    useCases: [
        'กรณีใช้งาน 1',
        'กรณีใช้งาน 2'
    ],
    examples: [
        'ตัวอย่างที่ 1',
        'ตัวอย่างที่ 2'
    ]
}
```

---

##  การทดสอบ

### รัน Grammar Validation:

```bash
npm run grammar:validate
```

### รัน Corpus Testing (ต้อง install libraries ก่อน):

```bash
npm install react lodash express typescript
npm run grammar:corpus
```

### รัน Disambiguation Report:

```bash
npm run grammar:disambiguate
```

### รันทุกอย่างพร้อมกัน:

```bash
npm run grammar:all
```

---

##  สถานะปัจจุบัน (Current Status)

| Grammar | Keywords | 5 Strategies | Status |
|---------|----------|--------------|--------|
| **JavaScript** | 37/44 |  Complete | 84% |
| **TypeScript** | 49/49 |  Complete | 100% |
| **Java** | 17/60 |  Partial | 28% |
| **JSX** | 15/15 |  Complete | 100% |

**รวม**: 118 keywords/items ครบ 5 strategies

---

##  ขั้นตอนถัดไป (Next Steps)

### Phase 1: Complete JavaScript Grammar
- [ ] Module operators (7 keywords remaining)
- [ ] Contextual keywords (static, get, set, of, target, meta)
- [ ] เพิ่ม documentation URLs ทุก keyword

### Phase 2: Complete Java Grammar  
- [ ] Control Flow (if, else, switch, case, default, break, continue)
- [ ] Iteration (for, while, do)
- [ ] Exception (try, catch, finally, throw)
- [ ] Inheritance (extends, implements, super, this)
- [ ] Type keywords (boolean, byte, char, short, int, long, float, double)

### Phase 3: Enhancement
- [ ] เพิ่ม `documentationUrl` ทุก keyword
- [ ] เพิ่ม `goodExample` และ `badExample`
- [ ] เพิ่ม test coverage เป็น 100%
- [ ] สร้าง Visual Studio Code extension ใช้ grammar นี้

### Phase 4: Advanced Features
- [ ] Grammar versioning system
- [ ] Auto-generate grammar from specs
- [ ] Machine learning for disambiguation
- [ ] Interactive grammar explorer (web UI)

---

##  Contributing

เพิ่ม keyword ใหม่ให้ทำตาม 5 Strategies ครบถ้วน แล้วรัน:

```bash
npm run grammar:validate
```

ถ้า validation ผ่าน = keyword ของคุณสมบูรณ์แบบ! 

---

##  License

MIT License - ใช้งานได้อย่างอิสระ

---

##  Credits

Created with  by **ChahuadevR Team**

Special thanks to:
- ECMA-262 Specification
- TypeScript Language Specification  
- Java Language Specification
- ANTLR JSX Grammar
- React Documentation
- MDN Web Docs

---

**สร้างแกรมม่าที่สมบูรณ์แบบที่สุดในโลก! **
