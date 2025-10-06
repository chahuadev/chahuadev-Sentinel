// test-validator-itself.js (v3 - with Logging)
// Meta-Test with a robust logging system to capture all outputs.

const { ValidationEngine, ABSOLUTE_RULES } = require('./src/validator.js');
const fs = require('fs');
const path = require('path');

// --- Logger Setup ---
const logFilePath = path.join(process.cwd(), 'test-run.log');
// ลบไฟล์ log เก่าทิ้งเมื่อเริ่มรันเทสใหม่
if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
}
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const stripAnsiCodes = (str) => str.replace(/[\u001b\u009b][[()#;?]?[0-9]{1,4}(?:;[0-9]{0,4})?[0-9A-ORZcf-nqry=><]/g, '');

const log = (message, level = 'INFO') => {
    // แสดงผลบน Console เหมือนเดิม
    console.log(message);
    
    // บันทึกลงไฟล์ Log
    const timestamp = new Date().toISOString();
    const plainMessage = stripAnsiCodes(String(message)); // แปลงเป็น string เพื่อความปลอดภัย
    logStream.write(`[${timestamp}] [${level}] ${plainMessage}\n`);
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
            log(`\x1b[32m  ✓ PASS:\x1b[0m ${description}`);
        } else {
            results.failed++;
            log(`\x1b[31m  ✗ FAIL:\x1b[0m ${description}`);
            if (expected !== undefined) {
                log(`\x1b[33m     Expected:\x1b[0m ${JSON.stringify(expected)}`);
                log(`\x1b[33m     Actual:  \x1b[0m ${JSON.stringify(actual)}`);
            }
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

async function runTestForExample(engine, exampleData) {
    return assert.group(`${exampleData.expectedRuleId} - ${exampleData.description}`, async () => {
        try {
            const validationResults = await engine.validateCode(exampleData.code);
            const violations = validationResults.violations;
            assert.isTrue(violations.length > 0, 'Should find at least one violation');
            if (violations.length > 0) {
                const foundCorrectRule = violations.some(v => v.ruleId === exampleData.expectedRuleId);
                assert.isTrue(foundCorrectRule, `Violation list must include the correct rule ID: "${exampleData.expectedRuleId}"`);
                const otherRulesFound = violations.filter(v => v.ruleId !== exampleData.expectedRuleId);
                assert.equals(otherRulesFound.length, 0, `Should not find violations for other rules. (Found: ${otherRulesFound.map(v => v.ruleId).join(', ')})`);
            }
        } catch (error) {
            assert._check(`Engine should not crash while parsing. Error: ${error.message}`, false);
        }
    });
}

async function runMetaTest() {
    log('=================================================');
    log('  🔍  RUNNING VALIDATOR META-TEST (with Logger) 🔍  ');
    log('=================================================\n');

    const engine = new ValidationEngine();
    await new Promise(resolve => setTimeout(resolve, 500)); // wait for engine init log

    for (const [ruleId, ruleDefinition] of Object.entries(ABSOLUTE_RULES)) {
        if (!ruleDefinition.violationExamples || !ruleDefinition.violationExamples.en) {
            continue;
        }
        for (const exampleString of ruleDefinition.violationExamples.en) {
            const exampleData = extractExampleData(exampleString);
            if (exampleData) {
                await runTestForExample(engine, exampleData);
            }
        }
    }

    log('\n--- META-TEST SUMMARY ---');
    log(`  Total Asserts: ${results.total}`);
    log(`  \x1b[32mPassed: ${results.passed}\x1b[0m`);
    log(`  \x1b[31mFailed: ${results.failed}\x1b[0m`);
    log('-------------------------\n');

    if (results.failed > 0) {
        log('\x1b[41m\x1b[37m  META-TEST FAILED! Check test-run.log for details.  \x1b[0m\n');
    } else {
        log('\x1b[42m\x1b[30m  ALL EXAMPLES PASSED! Check test-run.log for full details.  \x1b[0m\n');
    }
}

// --- Main Execution & Graceful Shutdown ---
runMetaTest().catch(err => {
    log('A critical error occurred during the meta-test run:', 'CRITICAL');
    log(err.stack, 'CRITICAL');
    process.exitCode = 1;
}).finally(() => {
    log('--- Test run finished. Closing log stream. ---');
    logStream.end();
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