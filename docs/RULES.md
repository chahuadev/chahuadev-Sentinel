# 🚫 กฎเหล็ก 5 ข้อ - ห้ามละเมิดโดยเด็ดขาด
# ABSOLUTE RULES - DO NOT VIOLATE

## ภาพรวม (Overview)

Chahuadev Rules Validator บังคับใช้กฎเหล็ก **5 ข้อ** เพื่อป้องกัน anti-patterns และรักษาคุณภาพโค้ดระดับมืออาชีพ

---

## 🚫 กฎที่ 1: NO_MOCKING - ห้ามสร้าง Mock/Stub/Spy

### ❌ ห้าม (FORBIDDEN)
```javascript
// ❌ ห้ามใช้ mocking libraries ทุกชนิด
jest.mock('./database');
jest.spyOn(obj, 'method');
jest.fn();
sinon.stub(obj, 'method');
sinon.spy();
vi.mock('./module');
```

### ✅ ใช้แทน (USE INSTEAD)
```javascript
// ✅ Dependency Injection - ส่ง dependencies ผ่าน parameters
function myFunction(database, logger) {
    return database.query('SELECT * FROM users');
}

// ✅ ใน test ก็ส่ง test implementation เข้าไป
const testDB = { query: () => [{ id: 1, name: 'Test' }] };
const result = myFunction(testDB, console);
```

### 💡 เหตุผล
- **Tight Coupling**: Mock ทำให้ test ผูกติดกับ implementation details
- **Brittle Tests**: แก้โค้ดนิดเดียว test พังทั้งหมด
- **False Security**: Test ผ่านแต่โค้ดจริงพัง
- **Hard to Refactor**: เปลี่ยน structure ต้องแก้ test ทั้งหมด

### 🔧 วิธีแก้
1. แปลงฟังก์ชันให้รับ dependencies เป็น parameters
2. สร้าง interface สำหรับ dependencies
3. ใน test ส่ง test implementation เข้าไป
4. ลบ mock library ออกทั้งหมด

---

## 🚫 กฎที่ 2: NO_HARDCODE - ห้าม Hardcode ค่าใดๆ

### ❌ ห้าม (FORBIDDEN)
```javascript
// ❌ Hardcoded URLs
const API_URL = 'https://api.example.com';
const WEBHOOK = 'https://hooks.slack.com/services/XXX';

// ❌ Hardcoded API Keys
const API_KEY = 'sk-1234567890abcdef';
const SECRET = 'my-secret-key';

// ❌ Hardcoded Connection Strings
const DB = 'mongodb://localhost:27017/mydb';
const REDIS = 'redis://localhost:6379';
```

### ✅ ใช้แทน (USE INSTEAD)
```javascript
// ✅ จาก environment variables
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

// ✅ จาก config file
import { API_URL, DB_CONNECTION } from './config.js';

// ✅ รับเป็น parameter
function fetchData(apiUrl, apiKey) {
    return fetch(apiUrl, {
        headers: { 'Authorization': apiKey }
    });
}
```

### 💡 เหตุผล
- **Environment Lock-in**: โค้ดผูกติดกับ environment เฉพาะ
- **Security Risk**: API keys/secrets ใน source code
- **Hard to Change**: เปลี่ยน URL ต้องแก้โค้ดและ deploy ใหม่
- **No Flexibility**: ไม่สามารถ test กับ environment ต่างๆ ได้

### 🔧 วิธีแก้
1. ย้ายทุกค่าไป `config.js` หรือ `.env`
2. ใช้ `process.env.VARIABLE_NAME`
3. สร้าง config file แยกตาม environment (dev/staging/prod)
4. ใน test ส่ง config เข้าไปเป็น parameter

### ⚠️ ข้อยกเว้น (EXCEPTIONS)
- ✅ W3C namespace URIs: `http://www.w3.org/2000/svg`
- ✅ localhost/127.0.0.1 ในไฟล์ test
- ✅ Relative paths

---

## 🚫 กฎที่ 3: NO_SILENT_FALLBACK - ห้ามใช้ Fallback ที่ซ่อนปัญหา

### ❌ ห้าม (FORBIDDEN)
```javascript
// ❌ Silent failure - return default without logging
try {
    return dangerousOperation();
} catch (error) {
    return null; // 🚫 ซ่อนปัญหา!
}

try {
    return fetchData();
} catch (error) {
    return []; // 🚫 กลืน error!
}

// ❌ Fallback operator without error handling
const value = riskyOperation() || defaultValue; // ไม่มี log
```

### ✅ ใช้แทน (USE INSTEAD)
```javascript
// ✅ Log และ throw ต่อ
try {
    return dangerousOperation();
} catch (error) {
    logger.error('Operation failed:', error);
    throw error;
}

// ✅ Log แล้วค่อย return default (ถ้าจำเป็น)
try {
    return fetchData();
} catch (error) {
    logger.error('Failed to fetch, using default:', error);
    return []; // OK เพราะมี log
}

// ✅ Explicit error handling
const value = (() => {
    try {
        return riskyOperation();
    } catch (error) {
        logger.error('Operation failed:', error);
        return defaultValue;
    }
})();
```

### 💡 เหตุผล
- **Hidden Bugs**: ปัญหาถูกซ่อนไว้ Debug ไม่ได้
- **Silent Failures**: System fail แต่ไม่มีใครรู้
- **Hard to Debug**: ไม่มี log trace เมื่อเกิดปัญหา
- **False Success**: ดูเหมือนทำงานปกติแต่จริงๆ error

### 🔧 วิธีแก้
1. เพิ่ม `logger.error(error)` ใน catch block ทุกอัน
2. Throw error ต่อไปแทนการ return default
3. ถ้าจำเป็นต้อง return default ต้อง log ก่อน
4. ห้ามใช้ `|| defaultValue` โดยไม่มี error handling

---

## 🚫 กฎที่ 4: NO_INTERNAL_CACHE - ห้ามสร้าง Cache ภายในฟังก์ชัน

### ❌ ห้าม (FORBIDDEN)
```javascript
// ❌ Internal caching
const cache = new Map();
function expensiveOperation(input) {
    if (cache.has(input)) {
        return cache.get(input); // 🚫 Internal cache!
    }
    const result = compute(input);
    cache.set(input, result);
    return result;
}

// ❌ Memoization
let cachedResult = null;
function getData() {
    if (!cachedResult) {
        cachedResult = fetchData(); // 🚫 Memoization!
    }
    return cachedResult;
}

// ❌ Using memoize libraries
import memoize from 'lodash/memoize';
const cached = memoize(expensiveFunc); // 🚫 Forbidden!
```

### ✅ ใช้แทน (USE INSTEAD)
```javascript
// ✅ Pure function - no internal state
function expensiveOperation(input) {
    return compute(input); // Let caller handle caching
}

// ✅ External caching - caller controls it
const cache = new Map();
function getCached(input) {
    if (!cache.has(input)) {
        cache.set(input, expensiveOperation(input));
    }
    return cache.get(input);
}

// ✅ Cache layer wrapper (external)
function withCache(fn) {
    const cache = new Map();
    return (input) => {
        if (!cache.has(input)) {
            cache.set(input, fn(input));
        }
        return cache.get(input);
    };
}
const cached = withCache(expensiveOperation);
```

### 💡 เหตุผล
- **Shared Mutable State**: สร้าง global state ที่อันตราย
- **Impure Functions**: ฟังก์ชันไม่ pure ทำให้ test ยาก
- **Memory Leaks**: Cache โตเรื่อยๆ ไม่มี invalidation
- **No Control**: Caller ไม่สามารถควบคุม caching strategy
- **Hard to Test**: ไม่สามารถ test แยกส่วนได้

### 🔧 วิธีแก้
1. ลบ cache variable ออกจากฟังก์ชัน
2. ทำให้ฟังก์ชันเป็น pure function
3. สร้าง cache wrapper ข้างนอก
4. ให้ caller เป็นคนตัดสินใจว่าจะ cache หรือไม่

---

## 🚫 กฎที่ 5: NO_EMOJI - ห้ามใช้อิโมจิในโค้ด

### ❌ ห้าม (FORBIDDEN)
```javascript
// ❌ Emoji in variables
const STATUS_SUCCESS = '✅'; // 🚫 FORBIDDEN!
const STATUS_ERROR = '❌'; // 🚫 FORBIDDEN!
const ROCKET = '🚀'; // 🚫 FORBIDDEN!

// ❌ Emoji in strings
console.log('✅ Success!'); // 🚫 FORBIDDEN!
console.log('🎉 Celebrate'); // 🚫 FORBIDDEN!
return '👍 OK'; // 🚫 FORBIDDEN!

// ❌ Emoji in comments
// 🔥 This is hot code // 🚫 FORBIDDEN!

// ❌ Emoji in function names
function 🚀launch() { } // 🚫 FORBIDDEN!
```

### ✅ ใช้แทน (USE INSTEAD)
```javascript
// ✅ Plain text descriptions
const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';
const STATUS_LAUNCH = 'launch';

// ✅ Descriptive messages
console.log('Success: Operation completed');
console.log('Celebration: Milestone reached');
return 'OK: Request approved';

// ✅ Plain text comments
// IMPORTANT: This is performance-critical code

// ✅ Descriptive function names
function launchRocket() { }
```

### 💡 เหตุผล
- **Encoding Issues**: ปัญหา UTF-8 encoding ในบาง systems
- **Impossible to Search**: `grep` หา emoji ไม่ได้
- **Not Accessible**: Screen readers อ่านไม่ได้
- **Unprofessional**: ดูไม่มืออาชีพในโค้ดจริง
- **Terminal Issues**: พังใน terminals ที่ไม่รองรับ Unicode
- **Hard to Type**: พิมพ์ยาก ต้องมี keyboard พิเศษ
- **Copy/Paste Problems**: คัดลอกผิดพลาดง่าย
- **Version Control**: Git diff แสดงผลแปลกๆ

### 🔧 วิธีแก้
1. แทนที่ emoji ด้วยคำอธิบายภาษาอังกฤษ
2. ใช้ชื่อตัวแปรที่อธิบายความหมายชัดเจน
3. ใน console.log ใช้ข้อความธรรมดา
4. ใน comments ใช้คำว่า "IMPORTANT", "NOTE", "TODO" แทน emoji

### 📖 Emoji Mapping ที่แนะนำ
| Emoji | แทนด้วย |
|-------|---------|
| ✅ | success, completed, approved |
| ❌ | error, failed, rejected |
| ⚠️ | warning, caution |
| 🚀 | launch, deploy, start |
| 🔥 | hot, critical, important |
| 💡 | idea, suggestion, tip |
| 📝 | note, documentation |
| 📌 | important, pinned |
| 🎯 | target, goal, focus |
| ⭐ | star, favorite, featured |
| 👍 | approve, accept, ok |
| 👎 | reject, decline, no |
| 🐛 | bug, issue, defect |
| 🎉 | celebrate, success, milestone |
| 💾 | save, store, persist |

---

## 📊 สรุปเปรียบเทียบ

| กฎ | สิ่งที่ห้าม | ใช้แทน | ความรุนแรง |
|-----|------------|---------|-----------|
| **#1 NO_MOCKING** | jest.mock(), sinon.stub() | Dependency Injection | ERROR |
| **#2 NO_HARDCODE** | Hardcoded URLs, API keys | Config files, env vars | ERROR |
| **#3 NO_SILENT_FALLBACK** | catch { return null; } | logger.error() + throw | ERROR |
| **#4 NO_INTERNAL_CACHE** | const cache = new Map() | External caching | WARNING |
| **#5 NO_EMOJI** | '✅', '🚀', '❌' | 'success', 'launch', 'error' | ERROR |

---

## 🎯 ประโยชน์ของการปฏิบัติตามกฎ

### ✅ คุณภาพโค้ด
- โค้ดอ่านง่าย เข้าใจง่าย
- ไม่มี hidden dependencies
- Pure functions ที่ test ได้ง่าย

### ✅ ความปลอดภัย
- ไม่มี hardcoded secrets
- Error handling ที่ชัดเจน
- ไม่มี silent failures

### ✅ การบำรุงรักษา
- Refactor ง่าย ไม่มี tight coupling
- Debug ง่าย มี error logs ครบถ้วน
- เปลี่ยน configuration ไม่ต้องแก้โค้ด

### ✅ ความยืดหยุ่น
- ทำงานได้ทุก environment
- เปลี่ยน dependencies ได้ง่าย
- ควบคุม caching strategy ได้เอง

---

## 🚨 ผลที่ตามมาจากการละเมิด

### ใน VS Code
- 🔴 **ขีดเส้นใต้สีแดง** ตรงตำแหน่งที่ละเมิด
- ⚠️ **Problems panel** แสดงรายการละเมิดทั้งหมด
- 💡 **Quick Fixes** แสดง lightbulb เมื่อคลิกที่ละเมิด
- 📝 **Output Channel** log รายละเอียดทั้งหมด
- 🚫 **Status Bar** แสดงจำนวนการละเมิด

### ใน Command Line
```bash
# รัน validator จาก CLI
npm run validate

# แสดงผลเป็นภาษาไทย
npm run validate -- --lang th

# แสดงรายละเอียดทั้งหมด
npm run validate -- --verbose
```

---

## 🛠️ การติดตั้งและใช้งาน

### ติดตั้ง Extension
1. เปิด VS Code
2. กด `Ctrl+Shift+X` (Extensions)
3. ค้นหา "Chahuadev Rules Validator"
4. คลิก Install

### คำสั่งที่มี
- `Chahuadev: Validate Entire Workspace` - ตรวจสอบทั้ง workspace
- `Chahuadev: Validate Current File` - ตรวจสอบไฟล์ปัจจุบัน
- `Chahuadev: Clear All Diagnostics` - ล้างการแจ้งเตือน
- `Chahuadev: Toggle Validation` - เปิด/ปิดการตรวจสอบ

### ตั้งค่า (Settings)
```json
{
  "chahuadev.enabled": true,
  "chahuadev.language": "th",
  "chahuadev.validateOnSave": true,
  "chahuadev.validateOnOpen": true,
  "chahuadev.validateOnType": false,
  "chahuadev.rules.noMocking": true,
  "chahuadev.rules.noHardcode": true,
  "chahuadev.rules.noSilentFallback": true,
  "chahuadev.rules.noInternalCache": true,
  "chahuadev.rules.noEmoji": true
}
```

---

## 📚 แหล่งข้อมูลเพิ่มเติม

- [GitHub Repository](https://github.com/chahuadev/chahuadev-scanner)
- [Documentation Wiki](https://github.com/chahuadev/chahuadev-scanner/wiki)
- [Issue Tracker](https://github.com/chahuadev/chahuadev-scanner/issues)

---

<div align="center">

**Made with ❤️ by Chahua Development Co., Ltd.**

*(Wait... ❌ VIOLATION! ใช้ "Made with care" แทน!)*

**Made with care by Chahua Development Co., Ltd.** ✅

</div>
