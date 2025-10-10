// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// !  TOKENIZER USAGE EXAMPLES
// ! ══════════════════════════════════════════════════════════════════════════════

import { PureBinaryTokenizer } from './tokenizer-helper.js';
import { TokenizerBrainAdapter } from './tokenizer-brain-adapter.js';

/**
 * ============================================================================
 * Example 1: Tokenize JavaScript Code
 * ============================================================================
 */
async function example1_TokenizeJavaScript() {
    console.log('='.repeat(80));
    console.log('Example 1: Tokenize JavaScript Code');
    console.log('='.repeat(80));

    // 1. สร้าง Brain Adapter สำหรับ JavaScript
    const brain = new TokenizerBrainAdapter('javascript');

    // 2. สร้าง Tokenizer พร้อม Brain
    const tokenizer = new PureBinaryTokenizer(brain);

    // 3. Tokenize code
    const code = 'const x = 5;';
    console.log(`\nInput: "${code}"\n`);

    const tokens = await tokenizer.tokenize(code);

    // 4. แสดงผลลัพธ์
    console.log('Tokens:');
    tokens.forEach((token, index) => {
        console.log(`  [${index}] ${token.type.padEnd(12)} | Binary: ${token.binary.toString(2).padStart(8, '0')} | Value: "${token.value}"`);
    });
}

/**
 * ============================================================================
 * Example 2: Tokenize TypeScript Code
 * ============================================================================
 */
async function example2_TokenizeTypeScript() {
    console.log('\n' + '='.repeat(80));
    console.log('Example 2: Tokenize TypeScript Code');
    console.log('='.repeat(80));

    // 1. สร้าง Brain Adapter สำหรับ TypeScript
    const brain = new TokenizerBrainAdapter('typescript');

    // 2. สร้าง Tokenizer
    const tokenizer = new PureBinaryTokenizer(brain);

    // 3. Tokenize TypeScript code
    const code = 'let count: number = 0;';
    console.log(`\nInput: "${code}"\n`);

    const tokens = await tokenizer.tokenize(code);

    // 4. แสดงผลลัพธ์พร้อม binary
    console.log('Tokens:');
    tokens.forEach((token, index) => {
        console.log(`  [${index}] ${token.type.padEnd(12)} | 0b${token.binary.toString(2).padStart(8, '0')} | "${token.value}"`);
    });
}

/**
 * ============================================================================
 * Example 3: Tokenize with Comments
 * ============================================================================
 */
async function example3_TokenizeWithComments() {
    console.log('\n' + '='.repeat(80));
    console.log('Example 3: Tokenize with Comments');
    console.log('='.repeat(80));

    const brain = new TokenizerBrainAdapter('javascript');
    const tokenizer = new PureBinaryTokenizer(brain);

    const code = `
// This is a comment
const name = "John";
/* Multi-line
   comment */
let age = 30;
    `.trim();

    console.log(`\nInput:\n${code}\n`);

    const tokens = await tokenizer.tokenize(code);

    console.log('Tokens:');
    tokens.forEach((token, index) => {
        const preview = token.value.length > 30 
            ? token.value.substring(0, 30) + '...' 
            : token.value;
        console.log(`  [${index}] ${token.type.padEnd(12)} | Binary: ${token.binary} | "${preview.replace(/\n/g, '\\n')}"`);
    });
}

/**
 * ============================================================================
 * Example 4: Switch Languages Dynamically
 * ============================================================================
 */
async function example4_SwitchLanguages() {
    console.log('\n' + '='.repeat(80));
    console.log('Example 4: Switch Languages Dynamically');
    console.log('='.repeat(80));

    // สร้าง Brain และ Tokenizer
    const brain = new TokenizerBrainAdapter('javascript');
    const tokenizer = new PureBinaryTokenizer(brain);

    // Tokenize JavaScript
    console.log('\n--- JavaScript ---');
    const jsCode = 'function test() {}';
    console.log(`Input: "${jsCode}"`);
    const jsTokens = await tokenizer.tokenize(jsCode);
    console.log(`Tokens: ${jsTokens.length} tokens`);
    jsTokens.forEach(t => console.log(`  - ${t.type}: "${t.value}"`));

    // เปลี่ยนเป็น TypeScript
    brain.setLanguage('typescript');
    console.log('\n--- TypeScript ---');
    const tsCode = 'interface User {}';
    console.log(`Input: "${tsCode}"`);
    const tsTokens = await tokenizer.tokenize(tsCode);
    console.log(`Tokens: ${tsTokens.length} tokens`);
    tsTokens.forEach(t => console.log(`  - ${t.type}: "${t.value}"`));

    // เปลี่ยนเป็น Java
    brain.setLanguage('java');
    console.log('\n--- Java ---');
    const javaCode = 'public class Main {}';
    console.log(`Input: "${javaCode}"`);
    const javaTokens = await tokenizer.tokenize(javaCode);
    console.log(`Tokens: ${javaTokens.length} tokens`);
    javaTokens.forEach(t => console.log(`  - ${t.type}: "${t.value}"`));
}

/**
 * ============================================================================
 * Example 5: Analyze Binary Representation
 * ============================================================================
 */
async function example5_AnalyzeBinary() {
    console.log('\n' + '='.repeat(80));
    console.log('Example 5: Analyze Binary Representation');
    console.log('='.repeat(80));

    const brain = new TokenizerBrainAdapter('javascript');
    const tokenizer = new PureBinaryTokenizer(brain);

    const code = 'const x = 5 + 10;';
    console.log(`\nInput: "${code}"\n`);

    const tokens = await tokenizer.tokenize(code);

    console.log('Binary Analysis:');
    tokens.forEach((token, index) => {
        const binary = token.binary.toString(2).padStart(8, '0');
        const decimal = token.binary;
        const hex = '0x' + token.binary.toString(16).toUpperCase();
        
        console.log(`\n  Token [${index}]: "${token.value}"`);
        console.log(`    Type:    ${token.type}`);
        console.log(`    Binary:  0b${binary}`);
        console.log(`    Decimal: ${decimal}`);
        console.log(`    Hex:     ${hex}`);
        console.log(`    Range:   ${token.start}-${token.end}`);
        console.log(`    Length:  ${token.length} chars`);
    });
}

/**
 * ============================================================================
 * Example 6: Performance Test
 * ============================================================================
 */
async function example6_PerformanceTest() {
    console.log('\n' + '='.repeat(80));
    console.log('Example 6: Performance Test');
    console.log('='.repeat(80));

    const brain = new TokenizerBrainAdapter('javascript');
    const tokenizer = new PureBinaryTokenizer(brain);

    // สร้าง code ยาวๆ
    const code = `
function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price * items[i].quantity;
    }
    return total;
}

const cart = [
    { name: "Apple", price: 10, quantity: 5 },
    { name: "Banana", price: 5, quantity: 10 },
    { name: "Orange", price: 8, quantity: 3 }
];

const result = calculateTotal(cart);
console.log("Total:", result);
    `.trim();

    console.log(`\nCode length: ${code.length} characters`);
    console.log(`Code lines: ${code.split('\n').length} lines\n`);

    // วัดเวลา
    const startTime = Date.now();
    const tokens = await tokenizer.tokenize(code);
    const endTime = Date.now();

    console.log(`Tokenization time: ${endTime - startTime}ms`);
    console.log(`Total tokens: ${tokens.length}`);
    console.log(`Average: ${((endTime - startTime) / tokens.length).toFixed(3)}ms per token`);

    // สรุป token types
    const typeCounts = {};
    tokens.forEach(token => {
        typeCounts[token.type] = (typeCounts[token.type] || 0) + 1;
    });

    console.log('\nToken Type Distribution:');
    Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
            const percentage = ((count / tokens.length) * 100).toFixed(1);
            console.log(`  ${type.padEnd(12)}: ${count.toString().padStart(3)} (${percentage}%)`);
        });
}

/**
 * ============================================================================
 * RUN ALL EXAMPLES
 * ============================================================================
 */
async function runAllExamples() {
    try {
        await example1_TokenizeJavaScript();
        await example2_TokenizeTypeScript();
        await example3_TokenizeWithComments();
        await example4_SwitchLanguages();
        await example5_AnalyzeBinary();
        await example6_PerformanceTest();
        
        console.log('\n' + '='.repeat(80));
        console.log('All examples completed successfully!');
        console.log('='.repeat(80));
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExamples();
}

export {
    example1_TokenizeJavaScript,
    example2_TokenizeTypeScript,
    example3_TokenizeWithComments,
    example4_SwitchLanguages,
    example5_AnalyzeBinary,
    example6_PerformanceTest,
    runAllExamples
};
