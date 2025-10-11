# Grammar Index System - Documentation

##  ภาพรวมระบบ

ระบบ Grammar Index ใหม่ออกแบบมาเพื่อให้ **Tokenizer** สามารถค้นหาข้อมูล grammar ได้โดย:
- ส่ง **language** (ภาษา) และ **type** (ประเภท) 
- ไม่ต้องส่ง regex หรือ hardcode grammar
- รับผลลัพธ์กลับมาเป็น JSON object
- แปลงเป็นเลขฐาน 2 ด้วย Tokenizer เอง

---

##  สถาปัตยกรรม

```
┌─────────────┐
│  Tokenizer  │ ส่ง: language + type + itemName
└──────┬──────┘
       │
       
┌─────────────┐
│  index.js   │ ทางเข้า-ทางออก (Entry/Exit Point)
└──────┬──────┘
       │
       
┌──────────────────┐
│ grammar-index.js │ ค้นหาจาก grammar files
└──────┬───────────┘
       │
       
┌────────────────────────┐
│ shared/grammars/*.json │ Grammar data files
└────────────────────────┘
       │
       
┌─────────────┐
│  Tokenizer  │ รับผลลัพธ์  แปลงเป็นเลขฐาน 2
└─────────────┘
```

---

##  โครงสร้างไฟล์

```
src/grammars/
├── index.js                          # Entry/Exit Point (ไม่มีโลจิก)
├── shared/
│   ├── grammar-index.js              # Search Engine
│   ├── grammar-index-examples.js     # ตัวอย่างการใช้งาน
│   └── grammars/                     # Grammar Data Files
│       ├── java.grammar.json
│       ├── javascript.grammar.json
│       ├── typescript.grammar.json
│       └── jsx.grammar.json
```

---

##  API Functions

### 1. **searchByType()** - ค้นหาตาม type (ใช้บ่อยที่สุด)

```javascript
import { searchByType } from './grammars/index.js';

const result = await searchByType('javascript', 'keyword', 'function');
```

**Parameters:**
- `language`: `'javascript' | 'typescript' | 'java' | 'jsx'`
- `type`: `'keyword' | 'operator' | 'punctuation' | 'literal' | ...`
- `itemName`: ชื่อ item ที่ต้องการค้นหา

**Returns:**
```javascript
{
  found: true,
  language: "javascript",
  type: "keyword",
  section: "keywords",
  item: "function",
  data: {
    type: "keyword",
    category: "declaration",
    description: "Function declaration keyword",
    // ... more fields
  },
  metadata: {
    number: 1,
    name: "keywords",
    title: " Section 01: Keywords",
    // ... section info
  }
}
```

---

### 2. **batchSearch()** - ค้นหาหลายรายการพร้อมกัน

```javascript
import { batchSearch } from './grammars/index.js';

const requests = [
  { type: 'keyword', itemName: 'function' },
  { type: 'operator', itemName: '=>' },
  { type: 'punctuation', itemName: '{' }
];

const results = await batchSearch('javascript', requests);
```

**Returns:** `Array<SearchResult>`

---

### 3. **identifyType()** - ตรวจสอบว่า item เป็น type อะไร

```javascript
import { identifyType } from './grammars/index.js';

const result = await identifyType('javascript', 'function');
```

**Returns:**
```javascript
{
  found: true,
  language: "javascript",
  type: "keyword",        //  ระบุว่าเป็น type อะไร
  section: "keywords",
  item: "function",
  data: { ... }
}
```

---

##  Type Mapping

Grammar Index แปลง `type` เป็น `section name` อัตโนมัติ:

| Type               | Section Name        | ใช้กับภาษา              |
|--------------------|---------------------|-------------------------|
| `keyword`          | `keywords`          | All                     |
| `operator`         | `operators`         | JS, TS, Java            |
| `punctuation`      | `punctuation`       | All                     |
| `literal`          | `literals`          | All                     |
| `modifier`         | `modifiers`         | Java                    |
| `primitiveType`    | `primitiveTypes`    | Java                    |
| `annotation`       | `annotations`       | Java                    |
| `typeKeyword`      | `typeKeywords`      | TypeScript              |
| `typeOperator`     | `typeOperators`     | TypeScript              |
| `declaration`      | `declarations`      | TypeScript              |
| `moduleKeyword`    | `moduleKeywords`    | TypeScript              |
| `element`          | `elements`          | JSX                     |
| `expression`       | `expressions`       | JSX                     |
| `attribute`        | `attributes`        | JSX                     |
| `component`        | `builtInComponents` | JSX                     |

---

##  ตัวอย่างการใช้งานจริง

### Example 1: Tokenizer ค้นหา keyword

```javascript
// Tokenizer เจอ token "function"
const token = "function";
const language = "javascript";

// 1. ถาม GrammarIndex
const result = await searchByType(language, 'keyword', token);

// 2. ตรวจสอบผลลัพธ์
if (result.found) {
  console.log(`Token "${token}" is a ${result.type}`);
  console.log('Data:', result.data);
  
  // 3. Tokenizer แปลงเป็นเลขฐาน 2
  const binaryCode = convertToBinary(result.data);
  return binaryCode;
}
```

### Example 2: ค้นหา TypeScript type operators

```javascript
const result = await searchByType('typescript', 'typeOperator', 'keyof');

if (result.found) {
  console.log('Found:', result.item);
  console.log('Description:', result.data.description);
  console.log('Section:', result.metadata.title);
}
```

### Example 3: ค้นหาหลาย tokens พร้อมกัน

```javascript
const tokens = ['function', 'const', 'let', 'var'];
const requests = tokens.map(t => ({ type: 'keyword', itemName: t }));

const results = await batchSearch('javascript', requests);

results.forEach(r => {
  if (r.found) {
    console.log(` ${r.item}: ${r.data.category}`);
  }
});
```

---

##  สำหรับ Tokenizer

### การใช้งาน Tokenizer จริง

```javascript
import { PureBinaryTokenizer } from './grammars/shared/tokenizer-helper.js';
import { TokenizerBrainAdapter } from './grammars/shared/tokenizer-brain-adapter.js';

// 1. สร้าง Brain Adapter (เชื่อมกับ GrammarIndex)
const brain = new TokenizerBrainAdapter('javascript');

// 2. สร้าง Tokenizer พร้อม Brain
const tokenizer = new PureBinaryTokenizer(brain);

// 3. Tokenize code
const code = 'const x = 5;';
const tokens = await tokenizer.tokenize(code);

// 4. ผลลัพธ์
console.log(tokens);
// [
//   { type: 'KEYWORD', binary: 32, value: 'const', start: 0, end: 5 },
//   { type: 'IDENTIFIER', binary: 64, value: 'x', start: 6, end: 7 },
//   { type: 'OPERATOR', binary: 4, value: '=', start: 8, end: 9 },
//   { type: 'NUMBER', binary: 16, value: '5', start: 10, end: 11 },
//   { type: 'PUNCTUATION', binary: 8, value: ';', start: 11, end: 12 }
// ]
```

### สลับภาษา

```javascript
const brain = new TokenizerBrainAdapter('javascript');
const tokenizer = new PureBinaryTokenizer(brain);

// Tokenize JavaScript
const jsTokens = await tokenizer.tokenize('function test() {}');

// เปลี่ยนเป็น TypeScript
brain.setLanguage('typescript');
const tsTokens = await tokenizer.tokenize('interface User {}');

// เปลี่ยนเป็น Java
brain.setLanguage('java');
const javaTokens = await tokenizer.tokenize('public class Main {}');
```

---

##  ข้อดีของระบบใหม่

1. **ไม่มี Hardcode**
   - Grammar data อยู่ในไฟล์ JSON
   - แก้ไข grammar ได้โดยไม่ต้องแก้โค้ด

2. **ค้นหาเร็ว**
   - ใช้ section-based search
   - O(1) lookup ใน section

3. **แยก Responsibility ชัดเจน**
   - `index.js` = Entry/Exit Point
   - `grammar-index.js` = Search Engine
   - `Tokenizer` = Binary Conversion

4. **รองรับหลายภาษา**
   - JavaScript, TypeScript, Java, JSX
   - เพิ่มภาษาใหม่ได้ง่าย

5. **Section Metadata**
   - รู้ว่าข้อมูลมาจาก section ไหน
   - มี description, purpose, responsibility

---

##  การเพิ่มภาษาใหม่

1. สร้างไฟล์ grammar: `shared/grammars/[language].grammar.json`
2. เพิ่ม section headers ตาม format เดิม
3. เพิ่ม type mapping ใน `grammar-index.js`  `_mapTypeToSection()`
4. Done! ไม่ต้องแก้โค้ดอื่น

---

##  หมายเหตุ

- ไฟล์ grammar ต้องมี section headers (__section_XX_name, etc.)
- Type ต้องตรงกับ section name ใน type mapping
- **Tokenizer** ใช้ผ่าน `TokenizerBrainAdapter` ที่เชื่อมกับ GrammarIndex
- **Brain Adapter** แปลงคำถามจาก Tokenizer  `searchByType()` / `loadGrammar()`
- Tokenizer รับผิดชอบแปลงเป็นเลขฐาน 2 เอง (ทำอยู่ใน tokenizer-helper.js แล้ว)

---

##  ไฟล์ในระบบ

### Core Files
- `index.js` - Entry/Exit Point (รับ-ส่งต่อ)
- `shared/grammar-index.js` - Search Engine (ค้นหา grammar)
- `shared/tokenizer-brain-adapter.js` - เชื่อม Tokenizer  GrammarIndex
- `shared/tokenizer-helper.js` - Pure Binary Tokenizer (แปลง String  Binary)

### Data Files
- `shared/grammars/javascript.grammar.json`
- `shared/grammars/typescript.grammar.json`
- `shared/grammars/java.grammar.json`
- `shared/grammars/jsx.grammar.json`
- `shared/tokenizer-binary-config.json` (Tokenizer config)

### Examples
- `shared/grammar-index-examples.js` - ตัวอย่างการใช้ GrammarIndex
- `shared/tokenizer-examples.js` - ตัวอย่างการใช้ Tokenizer

---

##  Quick Start

```bash
# 1. ทดสอบ GrammarIndex
node src/grammars/shared/grammar-index-examples.js

# 2. ทดสอบ Tokenizer
node src/grammars/shared/tokenizer-examples.js
```

---

##  See Also

- `grammar-index-examples.js` - ตัวอย่างการใช้งาน
- `shared/grammars/` - Grammar data files
- `index.js` - API entry points
