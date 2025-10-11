# Base Grammar + Delta Architecture

##  Vision: Universal Linguistic Engine

การพัฒนา Parser จาก "ภาษาเดียว" สู่ **"Universal Linguistic Engine"** ที่เข้าใจโครงสร้างภาษากลุ่มต่างๆ ด้วยแนวคิด **Base Grammar + Delta**

---

##  แนวคิดหลัก (Core Concept)

### เปรียบเทียบกับ "กายวิภาคของสัตว์เลี้ยงลูกด้วยนม"

```
 Base Anatomy (Java Grammar)
   ├─ กระดูกสันหลัง       if, for, while, switch
   ├─ หัวใจ + ปอด         {}, (), operators
   └─ แขนขาสี่ข้าง         method calls, variables

 Bat (C# Grammar) = Base + Delta
   └─ ปีก + Sonar        LINQ, Properties (get; set;)

 Whale (JavaScript Grammar) = Base + Delta
   └─ ครีบ + ช่องหายใจ    async/await, arrow functions (=>)
```

### สูตร

```
Language Grammar = Base Grammar (Java) + Delta (Language-Specific Features)
```

---

##  สถาปัตยกรรมระบบ

### 1. Base Grammar (java.grammar.json)

**Purpose:** แกนกลางที่สมบูรณ์แบบที่สุด - มี Syntax ครบทุกมิติของ C-Family Languages

**Contents:**
-  Keywords: `if`, `else`, `for`, `while`, `switch`, `case`, `break`, `continue`, `return`, `throw`, `try`, `catch`, `finally`
-  Control Flow: Loops, conditionals, exception handling
-  OOP: `class`, `interface`, `extends`, `implements`, `abstract`, `public`, `private`, `protected`, `static`, `final`
-  Operators: `+`, `-`, `*`, `/`, `%`, `&&`, `||`, `!`, `==`, `!=`, `<`, `>`, `<=`, `>=`
-  Punctuation: `{}`, `()`, `[]`, `;`, `,`, `.`, `:`
-  Primitive Types: `int`, `long`, `short`, `byte`, `float`, `double`, `boolean`, `char`

**Metadata Tags:**
```json
{
  "if": {
    "category": "control",
    "cFamilyCommon": true,  //  Tag ว่าเป็น Common Syntax
    "inheritableBy": ["javascript", "csharp", "typescript", "cpp"],
    ...
  }
}
```

---

### 2. Delta Files (*.delta.json)

Delta files มีเฉพาะ **ส่วนต่าง** ที่แตกต่างจาก Base Grammar

#### Example: `javascript.delta.json`

```json
{
  "_base": "java",
  "_language": "JavaScript",
  "_description": "JavaScript-specific features not in Java",
  
  "keywords": {
    "async": { /* async/await - ES2017 */ },
    "await": { /* async/await - ES2017 */ },
    "let": { /* Block-scoped variable - ES6 */ },
    "const": { /* Constant - ES6 */ },
    "yield": { /* Generator - ES6 */ },
    "of": { /* for...of - ES6 */ }
  },
  
  "operators": {
    "=>": { /* Arrow function - ES6 */ },
    "...": { /* Spread/Rest - ES6 */ },
    "?.": { /* Optional chaining - ES2020 */ },
    "??": { /* Nullish coalescing - ES2020 */ }
  },
  
  "removedKeywords": ["goto", "const"],  // Keywords จาก Base ที่ไม่ใช้
  "modifiedKeywords": {
    "class": {
      "_extends": "java.keywords.class",
      "quirks": ["No interfaces in JS", "Prototype-based under the hood"]
    }
  }
}
```

#### Example: `csharp.delta.json`

```json
{
  "_base": "java",
  "_language": "C#",
  "_description": "C#-specific features not in Java",
  
  "keywords": {
    "var": { /* Type inference - C# 3.0 */ },
    "dynamic": { /* Dynamic typing - C# 4.0 */ },
    "async": { /* Async/await - C# 5.0 */ },
    "await": { /* Async/await - C# 5.0 */ }
  },
  
  "operators": {
    "?.": { /* Null-conditional - C# 6.0 */ },
    "??": { /* Null-coalescing - C# 2.0 */ },
    "=>": { /* Lambda or expression body - C# 3.0/6.0 */ }
  },
  
  "linq": {
    "from": { /* LINQ query - C# 3.0 */ },
    "where": { /* LINQ filter - C# 3.0 */ },
    "select": { /* LINQ projection - C# 3.0 */ }
  },
  
  "properties": {
    "get": { /* Property getter - C# 1.0 */ },
    "set": { /* Property setter - C# 1.0 */ }
  }
}
```

---

##  GrammarIndex Enhancement

### Current Architecture
```javascript
class GrammarIndex {
  constructor(language) {
    this.grammar = require(`./grammars/${language}.grammar.json`);
  }
}
```

### Enhanced Architecture (Inheritance Support)
```javascript
class GrammarIndex {
  constructor(language, options = {}) {
    this.language = language;
    this.grammar = this.loadGrammarWithInheritance(language);
  }
  
  loadGrammarWithInheritance(language) {
    const delta = require(`./grammars/${language}.delta.json`);
    
    if (delta._base) {
      // Load base grammar
      const base = require(`./grammars/${delta._base}.grammar.json`);
      
      // Merge: Base + Delta
      return this.mergeGrammars(base, delta);
    }
    
    // Fallback: Full grammar file
    return require(`./grammars/${language}.grammar.json`);
  }
  
  mergeGrammars(base, delta) {
    const merged = JSON.parse(JSON.stringify(base)); // Deep clone
    
    // Add new keywords
    Object.assign(merged.keywords, delta.keywords || {});
    
    // Add new operators
    Object.assign(merged.operators, delta.operators || {});
    
    // Remove keywords
    (delta.removedKeywords || []).forEach(kw => {
      delete merged.keywords[kw];
    });
    
    // Modify existing keywords
    Object.entries(delta.modifiedKeywords || {}).forEach(([kw, changes]) => {
      if (merged.keywords[kw]) {
        Object.assign(merged.keywords[kw], changes);
      }
    });
    
    return merged;
  }
  
  // Query capabilities
  getDifferences(language1, language2) {
    const g1 = this.loadGrammarWithInheritance(language1);
    const g2 = this.loadGrammarWithInheritance(language2);
    
    return {
      onlyIn1: this.getUnique(g1, g2),
      onlyIn2: this.getUnique(g2, g1),
      common: this.getCommon(g1, g2)
    };
  }
}
```

---

##  ผลลัพธ์ที่ได้

### 1. ลดความซ้ำซ้อนมหาศาล

**Before (ไม่มี Delta):**
```
java.grammar.json       5,000 lines
javascript.grammar.json  4,800 lines (ซ้ำ 90%)
csharp.grammar.json     4,900 lines (ซ้ำ 90%)
typescript.grammar.json  5,200 lines (ซ้ำ 85%)

Total: 19,900 lines
```

**After (มี Delta):**
```
java.grammar.json        5,000 lines (Base)
javascript.delta.json    500 lines
csharp.delta.json        600 lines
typescript.delta.json    1,200 lines

Total: 7,300 lines (ประหยัด 63%!)
```

### 2. ดูแลรักษาง่าย

**ปรับปรุงกฎพื้นฐาน:**
```
Before: แก้ 4 ไฟล์ (java, js, c#, ts)
After:  แก้ 1 ไฟล์ (java.grammar.json)
         ทุกภาษาอัปเดตอัตโนมัติ
```

### 3. วิเคราะห์เปรียบเทียบภาษาได้

```javascript
// Query: "แสดง Syntax ที่ C# มี แต่ Java ไม่มี"
const differences = grammarIndex.getDifferences('csharp', 'java');

console.log(differences.onlyIn2);
// Output:
// {
//   keywords: ['var', 'dynamic', 'async', 'await'],
//   operators: ['?.', '??'],
//   linq: ['from', 'where', 'select'],
//   properties: ['get', 'set']
// }
```

---

##  Roadmap

### Phase 1: Foundation (Current - Q4 2024) 
- [x] สร้าง `javascript.grammar.json` ให้สมบูรณ์ 100%
- [x] เพิ่ม 16 futureReservedOldECMA keywords (Java-inspired)
- [x] เติม disambiguation, quirks, examples ครบทุก keyword
- [x] Total: 75 keywords + 4 literals + 50 operators

### Phase 2: Base Grammar Completion (Q1 2025)
- [ ] สร้าง `java.grammar.json` ให้สมบูรณ์ในทุกมิติ
- [ ] เพิ่ม metadata tag `cFamilyCommon: true` ในทุก common syntax
- [ ] สร้าง `inheritableBy` field เพื่อระบุภาษาที่สืบทอดได้
- [ ] Validation: ทุก keyword ต้องมี disambiguation + quirks + examples

### Phase 3: Delta System Implementation (Q2 2025)
- [ ] อัปเกรด `GrammarIndex` รองรับ inheritance
- [ ] สร้าง `javascript.delta.json` (extract จาก full grammar)
- [ ] สร้าง `csharp.delta.json`
- [ ] สร้าง `typescript.delta.json`
- [ ] Implement `mergeGrammars()` algorithm

### Phase 4: Comparison Engine (Q3 2025)
- [ ] Implement `getDifferences(lang1, lang2)`
- [ ] Implement `getCommonSyntax(languages[])`
- [ ] สร้าง visualization tool สำหรับแสดง syntax tree
- [ ] สร้าง API endpoint สำหรับ query ความแตกต่าง

### Phase 5: Multi-Language Support (Q4 2025)
- [ ] เพิ่ม Python support (delta from Java)
- [ ] เพิ่ม Go support (delta from Java)
- [ ] เพิ่ม Rust support (delta from Java)
- [ ] เพิ่ม Kotlin support (delta from Java)

---

##  Design Principles

### 1. DRY (Don't Repeat Yourself)
- ไม่เขียนกฎเดิมซ้ำในหลายไฟล์
- Base Grammar เป็นแหล่งความจริงเดียว (Single Source of Truth)

### 2. Single Responsibility
- Base Grammar = Common Syntax
- Delta Files = Language-Specific Features
- GrammarIndex = Inheritance Logic

### 3. Open/Closed Principle
- เปิดรับการขยาย (เพิ่มภาษาใหม่ได้ง่าย)
- ปิดไม่ให้แก้ไข (ไม่ต้องแก้ Base Grammar)

### 4. Composability
- Grammar สามารถ compose จากหลาย base ได้
- TypeScript = JavaScript + Type System
- JSX = JavaScript + XML Syntax

---

##  Metrics for Success

### Code Reduction
- Target: ลดโค้ดซ้ำซ้อน 60%+
- Current: ประหยัดได้ ~63% (จากการคำนวณ)

### Maintenance Time
- Target: ลดเวลา maintenance 75%
- Before: แก้ไข 4 ไฟล์ = 2 ชั่วโมง
- After: แก้ไข 1 ไฟล์ = 30 นาที

### Language Support Growth
- Target: เพิ่มภาษาใหม่ได้ภายใน 1 วัน
- Before: สร้าง full grammar = 1-2 สัปดาห์
- After: สร้าง delta file = 4-8 ชั่วโมง

---

##  Success Criteria

### javascript.grammar.json (Current Status) 
-  **75 keywords** (59 standard + 16 futureReservedOldECMA)
-  **92% with disambiguation** (69/75)
-  **97% with quirks** (73/75)
-  **100% with examples** (75/75)
-  **4 literals** (true, false, null, undefined)
-  **50 operators** (24 binary + 10 unary + 16 assignment)
-  **15 punctuation** with context-dependent disambiguation

### java.grammar.json (Target - Q1 2025)
- [ ] **68 keywords** with full metadata
- [ ] **100% with disambiguation**
- [ ] **100% with quirks**
- [ ] **100% with examples**
- [ ] All common C-Family syntax tagged with `cFamilyCommon: true`

---

##  Related Documents

- [Grammar Architecture](./GRAMMAR_ARCHITECTURE.md)
- [Disambiguation Engine](./DISAMBIGUATION_ENGINE.md)
- [Pure Binary Parser](./PURE_BINARY_PARSER.md)
- [GrammarIndex API](../api/GRAMMAR_INDEX_API.md)

---

##  Notes

> "A language is a dialect with an army and navy."  
> — Max Weinreich

ในโลกของ Programming Languages:
- **Base Grammar (Java)** = Navy (พื้นฐานที่แข็งแกร่ง)
- **Delta Files** = Army (กำลังเฉพาะทาง)
- **GrammarIndex** = Command Center (สั่งการทั้งหมด)

---

**Author:** Chahua Development Team  
**Version:** 1.0.0  
**Last Updated:** 2024-10-11  
**Status:**  In Progress (Phase 1 Complete)
