// test-validator-itself.js (v3 - with Logging)
// Meta-Test with a robust logging system to capture all outputs.

import { ValidationEngine, ABSOLUTE_RULES } from './src/validator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Logger Setup ---
const logFilePath = path.join(process.cwd(), 'test-run.log');
console.log(`📝 Initializing log system at: ${logFilePath}`);

// ลบไฟล์ log เก่าทิ้งเมื่อเริ่มรันเทสใหม่
if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
    console.log('🗑️ Removed old log file');
}

// สร้าง log stream
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// เขียน header ลงไฟล์ทันที
const initMessage = `=== CHAHUADEV SENTINEL META-TEST LOG ===\nStarted at: ${new Date().toISOString()}\nNode version: ${process.version}\nPlatform: ${process.platform}\nCWD: ${process.cwd()}\n`;
fs.writeFileSync(logFilePath, initMessage);
console.log('📄 Log file initialized');

const stripAnsiCodes = (str) => str.replace(/[\u001b\u009b][[()#;?]?[0-9]{1,4}(?:;[0-9]{0,4})?[0-9A-ORZcf-nqry=><]/g, '');

const log = (message, level = 'INFO') => {
    // แสดงผลบน Console เหมือนเดิม
    console.log(message);
    
    // บันทึกลงไฟล์ Log พร้อม force flush
    const timestamp = new Date().toISOString();
    const plainMessage = stripAnsiCodes(String(message)); // แปลงเป็น string เพื่อความปลอดภัย
    const logLine = `[${timestamp}] [${level}] ${plainMessage}\n`;
    
    // เขียนแบบ synchronous เพื่อให้แน่ใจว่าถูกบันทึก
    fs.appendFileSync(logFilePath, logLine);
    
    // เขียนแบบ async ด้วยเพื่อ performance (backup)
    logStream.write(logLine);
};

// --- Mini Assertion Library (อัปเดตให้ใช้ Logger) ---
const results = { passed: 0, failed: 0, total: 0 };
const assert = {
    group(description, testFn) {
        log(`\n--- Testing Example: [${description}] ---`);
        return testFn(); // return a promise
    },
    _check(description, condition, expected, actual) {
        results.total++;
        if (condition) {
            results.passed++;
            log(`\x1b[32m  PASS:\x1b[0m ${description}`);
        } else {
            results.failed++;
            log(`\x1b[31m  FAIL:\x1b[0m ${description}`);
            if (expected !== undefined) {
                log(`\x1b[33m     Expected:\x1b[0m ${JSON.stringify(expected)}`);
                log(`\x1b[33m     Actual:  \x1b[0m ${JSON.stringify(actual)}`);
            }
            
            // STRICT MODE: หยุดการทำงานทันทีเมื่อพบ failure
            log(`\x1b[91m\n=== CRITICAL FAILURE DETECTED ===\x1b[0m`);
            log(`\x1b[91mTest failed: ${description}\x1b[0m`);
            log(`\x1b[91mCurrent Results: ${results.passed}/${results.total} passed\x1b[0m`);
            log(`\x1b[91mStopping execution immediately to prevent further issues\x1b[0m`);
            log(`--- Test run terminated due to failure. Closing log stream. ---`);
            
            // ปิด log stream และออกจากโปรแกรม
            logStream.end();
            process.exit(1);
        }
    },
    isTrue(condition, description) { this._check(description, condition, true, condition); },
    equals(actual, expected, description) { this._check(description, actual === expected, expected, actual); },
};

function extractExampleData(exampleString) {
    const ruleMatch = exampleString.match(/@example-for-rule\s+([A-Z_]+)/);
    const descriptionMatch = exampleString.match(/@description\s+(.*)/);
    const codeMatch = exampleString.match(/\*\/([\s\S]*)/);
    if (!ruleMatch || !codeMatch || !codeMatch[1].trim()) return null;
    return {
        expectedRuleId: ruleMatch[1].trim(),
        description: descriptionMatch ? descriptionMatch[1].trim() : 'Unnamed Example',
        code: codeMatch[1].trim()
    };
}

// ใส่โค้ดนี้แทนที่ฟังก์ชัน runTestForExample เดิมทั้งหมด
async function runTestForExample(engine, exampleData) {
    let violations = [];
    let engineError = null;

    await assert.group(`${exampleData.expectedRuleId} - ${exampleData.description}`, async () => {
        try {
            log(`   Code:\n---\n${exampleData.code}\n---`);
            const validationResults = await engine.validateCode(exampleData.code, 'javascript', false);
            
            // STRICT VALIDATION RESULT CHECKING
            if (!validationResults) {
                log(`\x1b[91m     ERROR: validationResults is null/undefined\x1b[0m`);
                throw new Error(`ValidationEngine returned null/undefined results for code: ${exampleData.code.substring(0, 50)}...`);
            }
            
            if (typeof validationResults !== 'object') {
                log(`\x1b[91m     ERROR: validationResults is not an object (type: ${typeof validationResults})\x1b[0m`);
                throw new Error(`ValidationEngine returned invalid result type: ${typeof validationResults}`);
            }
            
            if (!Array.isArray(validationResults.violations)) {
                log(`\x1b[91m     ERROR: validationResults.violations is not an array\x1b[0m`);
                log(`\x1b[91m     Actual type: ${typeof validationResults.violations}\x1b[0m`);
                log(`\x1b[91m     Value: ${JSON.stringify(validationResults.violations)}\x1b[0m`);
                throw new Error(`ValidationEngine returned invalid violations format`);
            }
            
            violations = validationResults.violations;
            
            log(`\x1b[36m     VALIDATION SUCCESS: Found ${violations.length} violations\x1b[0m`);
            
        } catch (error) {
            engineError = error;
            log(`\x1b[91m     ENGINE ERROR CAUGHT: ${error.message}\x1b[0m`);
        }
    });

    if (engineError) {
        log(`\x1b[91m     ENGINE CRASH DETECTED\x1b[0m`);
        log(`\x1b[91m     Error Type: ${engineError.constructor.name}\x1b[0m`);
        log(`\x1b[91m     Error Message: ${engineError.message}\x1b[0m`);
        log(`\x1b[91m     Stack Trace:\x1b[0m`);
        log(`\x1b[91m${engineError.stack}\x1b[0m`);
        log(`\x1b[91m     Test Code: ${exampleData.code}\x1b[0m`);
        assert._check(`Engine must not crash while parsing (Error: ${engineError.message})`, false);
    } else {
        const foundViolations = violations.length > 0;
        assert.isTrue(foundViolations, 'Should find at least one violation');

        if (foundViolations) {
            // DETAILED ANALYSIS: วิเคราะห์ละเอียดทุกการละเมิด
            const violationDetails = violations.map((v, index) => {
                const line = v.location ? v.location.line : 'N/A';
                const column = v.location ? v.location.column : 'N/A';
                const severity = v.severity || 'UNKNOWN';
                return `  ${index + 1}. [${v.ruleId}] ${severity}: ${v.message || v.pattern} (Line ${line}, Col ${column})`;
            }).join('\n');
            
            log(`\x1b[36m     DETAILED VIOLATION ANALYSIS:\x1b[0m`);
            log(`\x1b[36m     Total violations found: ${violations.length}\x1b[0m`);
            log(`\x1b[36m${violationDetails}\x1b[0m`);
            
            // ตรวจสอบ Rule ID ที่ถูกต้อง
            const correctRuleViolations = violations.filter(v => v.ruleId === exampleData.expectedRuleId);
            const wrongRuleViolations = violations.filter(v => v.ruleId !== exampleData.expectedRuleId);
            
            log(`\x1b[32m     Correct rule violations (${exampleData.expectedRuleId}): ${correctRuleViolations.length}\x1b[0m`);
            if (wrongRuleViolations.length > 0) {
                log(`\x1b[31m     Wrong rule violations: ${wrongRuleViolations.length}\x1b[0m`);
                wrongRuleViolations.forEach((v, i) => {
                    log(`\x1b[31m       ${i + 1}. [${v.ruleId}] ${v.message}\x1b[0m`);
                });
            }

            // STRICT VALIDATION: ต้องมี violation ที่ถูก rule เท่านั้น
            const foundCorrectRule = correctRuleViolations.length > 0;
            assert.isTrue(foundCorrectRule, `Must find violations for rule "${exampleData.expectedRuleId}" (Found: ${correctRuleViolations.length})`);

            // ZERO TOLERANCE: ห้ามมี violation จาก rule อื่น
            assert.equals(wrongRuleViolations.length, 0, `Must not find violations for other rules (Found ${wrongRuleViolations.length}: [${wrongRuleViolations.map(v => v.ruleId).join(', ')}])`);
        } else {
            log(`\x1b[91m     CRITICAL: NO VIOLATIONS DETECTED\x1b[0m`);
            log(`\x1b[91m     Expected rule: ${exampleData.expectedRuleId}\x1b[0m`);
            log(`\x1b[91m     Test code: ${exampleData.code.substring(0, 100)}${exampleData.code.length > 100 ? '...' : ''}\x1b[0m`);
        }
    }
    
    // FINAL ENGINE ERROR CHECK: ตรวจสอบอีกครั้งก่อนจบฟังก์ชัน
    if (engineError) {
        log(`\x1b[91m   [FATAL] ENGINE ERROR IN FINAL CHECK: ${engineError.message}\x1b[0m`);
        log(`\x1b[91m   [FATAL] This indicates a critical system failure that must not be ignored\x1b[0m`);
        log(`\x1b[91m   [FATAL] Terminating test execution immediately for safety\x1b[0m`);
        console.log(`\nCRITICAL ENGINE FAILURE DETECTED - IMMEDIATE TERMINATION`);
        process.exit(1);
    }
}

async function runMetaTest() {
    log('=================================================');
    log('   RUNNING VALIDATOR META-TEST (with Logger)');
    log('=================================================');

    const engine = new ValidationEngine();
    await engine.initializeParserStudy();

    const examples = [];
    for (const [ruleId, ruleConfig] of Object.entries(ABSOLUTE_RULES)) {
        if (ruleConfig.violationExamples?.en) {
            for (const example of ruleConfig.violationExamples.en) {
                const exampleData = extractExampleData(example);
                if (exampleData) examples.push(exampleData);
            }
        }
    }

    for (const exampleData of examples) {
        await runTestForExample(engine, exampleData);
    }

    log('\n=================================================');
    log(`TEST SUMMARY: ${results.passed}/${results.total} tests passed (${((results.passed/results.total)*100).toFixed(2)}%)`);
    log('=================================================');
}

// --- Main Execution & Graceful Shutdown ---
log('Starting Meta-Test Execution...', 'START');
log(`Log file will be created at: ${logFilePath}`, 'INFO');

runMetaTest().then(() => {
    log('Meta-Test completed successfully!', 'SUCCESS');
}).catch(err => {
    log('A critical error occurred during the meta-test run:', 'CRITICAL');
    log(err.stack, 'CRITICAL');
    process.exitCode = 1;
}).finally(() => {
    log('--- Test run finished. Closing log stream. ---', 'SHUTDOWN');
    
    // Force flush และปิด stream
    logStream.end();
    
    // ตรวจสอบว่าไฟล์ถูกสร้างหรือไม่
    setTimeout(() => {
        if (fs.existsSync(logFilePath)) {
            const size = fs.statSync(logFilePath).size;
            console.log(`Log file created successfully: ${logFilePath} (${size} bytes)`);
        } else {
            console.log(`Warning: Log file not found at ${logFilePath}`);
        }
    }, 100);
});

// ดักจับ Error ที่ไม่คาดคิด เพื่อให้แน่ใจว่าจะถูกบันทึกลง Log ก่อนโปรแกรมปิด
process.on('uncaughtException', (err, origin) => {
    const errorMsg = `\n--- UNCAUGHT EXCEPTION ---\nOrigin: ${origin}\n${err.stack}\n`;
    console.error(errorMsg);
    fs.appendFileSync(logFilePath, errorMsg); // Write synchronously before exiting
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    const errorMsg = `\n--- UNHANDLED REJECTION ---\n${reason.stack || reason}\n`;
    console.error(errorMsg);
    fs.appendFileSync(logFilePath, errorMsg);
    process.exit(1);
});