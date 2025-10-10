//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// Grammar Index - Usage Examples
// ============================================================================
// ตัวอย่างการใช้งาน GrammarIndex สำหรับ Tokenizer
// ============================================================================

import { searchByType, batchSearch, identifyType } from '../index.js';

/**
 * ตัวอย่างที่ 1: ค้นหาแบบง่าย - Tokenizer ส่ง language + type + itemName
 */
async function example1_SimpleSearch() {
    console.log('=== Example 1: Simple Search ===');
    
    // Tokenizer ส่ง: ภาษา JavaScript, ประเภท keyword, ชื่อ "function"
    const result = await searchByType('javascript', 'keyword', 'function');
    
    console.log('Result:', JSON.stringify(result, null, 2));
    // Output:
    // {
    //   found: true,
    //   language: "javascript",
    //   type: "keyword",
    //   section: "keywords",
    //   item: "function",
    //   data: { type: "keyword", category: "declaration", ... },
    //   metadata: { number: 1, name: "keywords", ... }
    // }
}

/**
 * ตัวอย่างที่ 2: ค้นหาหลายรายการพร้อมกัน (Batch)
 */
async function example2_BatchSearch() {
    console.log('=== Example 2: Batch Search ===');
    
    // Tokenizer ส่งคำขอหลายรายการพร้อมกัน
    const requests = [
        { type: 'keyword', itemName: 'function' },
        { type: 'operator', itemName: '=>' },
        { type: 'punctuation', itemName: '{' },
        { type: 'keyword', itemName: 'const' }
    ];
    
    const results = await batchSearch('javascript', requests);
    
    console.log(`Found ${results.filter(r => r.found).length}/${results.length} items`);
    results.forEach((result, i) => {
        console.log(`${i+1}. ${result.item}: ${result.found ? '✅ FOUND' : '❌ NOT FOUND'}`);
    });
}

/**
 * ตัวอย่างที่ 3: ตรวจสอบว่า item เป็นประเภทใด
 */
async function example3_IdentifyType() {
    console.log('=== Example 3: Identify Type ===');
    
    // Tokenizer ไม่รู้ว่า "function" เป็นประเภทอะไร - ถาม GrammarIndex
    const result = await identifyType('javascript', 'function');
    
    console.log('Result:', JSON.stringify(result, null, 2));
    // Output:
    // {
    //   found: true,
    //   language: "javascript",
    //   type: "keyword",
    //   section: "keywords",
    //   item: "function",
    //   data: { ... }
    // }
}

/**
 * ตัวอย่างที่ 4: TypeScript - ค้นหา type keywords
 */
async function example4_TypeScriptTypes() {
    console.log('=== Example 4: TypeScript Types ===');
    
    const result = await searchByType('typescript', 'typeKeyword', 'interface');
    
    if (result.found) {
        console.log('✅ Found:', result.item);
        console.log('Data:', result.data);
        console.log('Section:', result.metadata.title);
    }
}

/**
 * ตัวอย่างที่ 5: Java - ค้นหา modifiers
 */
async function example5_JavaModifiers() {
    console.log('=== Example 5: Java Modifiers ===');
    
    const modifiers = ['public', 'private', 'protected', 'static', 'final'];
    const requests = modifiers.map(m => ({ type: 'modifier', itemName: m }));
    
    const results = await batchSearch('java', requests);
    
    console.log('Java Modifiers:');
    results.forEach(r => {
        if (r.found) {
            console.log(`  ✅ ${r.item}: ${r.data.description || 'modifier'}`);
        }
    });
}

/**
 * ตัวอย่างที่ 6: JSX - ค้นหา elements
 */
async function example6_JSXElements() {
    console.log('=== Example 6: JSX Elements ===');
    
    const result = await searchByType('jsx', 'element', '<');
    
    if (result.found) {
        console.log('✅ Found JSX element:', result.item);
        console.log('Type:', result.data.type);
        console.log('Description:', result.data.description);
    }
}

/**
 * Tokenizer Integration Example
 * แสดงวิธีที่ Tokenizer จะใช้งานจริง
 */
async function tokenizerIntegrationExample() {
    console.log('=== Tokenizer Integration ===');
    
    // 1. Tokenizer เจอ token "function"
    const token = 'function';
    const language = 'javascript'; // ภาษาที่กำลัง parse
    
    // 2. ถาม GrammarIndex ว่า "function" เป็นอะไร
    const result = await identifyType(language, token);
    
    if (result.found) {
        console.log(`Token "${token}" is a ${result.type}`);
        console.log('Binary representation will be generated based on:', result.data);
        
        // 3. Tokenizer แปลง result.data เป็นเลขฐาน 2
        // (ในส่วนนี้ Tokenizer จะมี logic แปลงเอง)
        console.log('→ Tokenizer will convert to binary...');
    }
}

// Run all examples
async function runAllExamples() {
    try {
        await example1_SimpleSearch();
        console.log('\n');
        
        await example2_BatchSearch();
        console.log('\n');
        
        await example3_IdentifyType();
        console.log('\n');
        
        await example4_TypeScriptTypes();
        console.log('\n');
        
        await example5_JavaModifiers();
        console.log('\n');
        
        await example6_JSXElements();
        console.log('\n');
        
        await tokenizerIntegrationExample();
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Export for testing
export {
    example1_SimpleSearch,
    example2_BatchSearch,
    example3_IdentifyType,
    example4_TypeScriptTypes,
    example5_JavaModifiers,
    example6_JSXElements,
    tokenizerIntegrationExample,
    runAllExamples
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExamples();
}
