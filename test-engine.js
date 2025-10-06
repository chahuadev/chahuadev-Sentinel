// test-engine.js (เวอร์ชัน Dynamic)

const { ValidationEngine, ABSOLUTE_RULES } = require('./src/validator.js');

// --- Mini Assertion Library (เหมือนเดิม) ---
const results = { passed: 0, failed: 0, total: 0 };
const assert = {
    group(description, testFn) { console.log(`\n--- Testing Rule: [${description}] ---`); testFn(); },
    _check(description, condition, expected, actual) {
        results.total++;
        if (condition) {
            results.passed++;
            console.log(`\x1b[32m  ✓ PASS:\x1b[0m ${description}`);
        } else {
            results.failed++;
            console.error(`\x1b[31m  ✗ FAIL:\x1b[0m ${description}`);
            if (expected !== undefined) {
                console.error(`\x1b[33m     Expected:\x1b[0m ${JSON.stringify(expected)}`);
                console.error(`\x1b[33m     Actual:  \x1b[0m ${JSON.stringify(actual)}`);
            }
        }
    },
    exists(actual, description) { this._check(description, actual !== null && actual !== undefined, 'A violation object', actual); },
    equals(actual, expected, description) { this._check(description, actual === expected, expected, actual); },
    includes(actual, expectedSubstring, description) {
        const condition = actual && typeof actual === 'string' && actual.includes(expectedSubstring);
        this._check(description, condition, `A string including "${expectedSubstring}"`, actual);
    },
};

// --- โค้ดตัวอย่าง (เหมือนเดิม) ---
const sampleCodeForTest = `/* 1*/ // Rule: NO_EMOJI
/* 2*/ // Deploying! 🚀
/* 3*/ 
/* 4*/ // Rule: NO_HARDCODE
/* 5*/ const API_URL = "https://api.chahuadev.com/v1"; 
/* 6*/ const API_KEY = "sk_live_12345abcdefghijklmnop1234"; 
/* 7*/ 
/* 8*/ // Rule: NO_MOCKING
/* 9*/ jest.mock('./apiService'); 
/*10*/ const spy = jest.spyOn(console, 'log');
/*11*/ 
/*12*/ // Rule: NO_COMPLEX_FUNCTIONS (Too many params)
/*13*/ function complexFunction(a, b, c, d, e, f, g) { /*...*/ }
/*14*/ 
/*15*/ function anotherFunction() {
/*16*/     // Rule: NO_INTERNAL_CACHING
/*17*/     const cache = new Map();
/*18*/     if (cache.has('key')) { return cache.get('key'); }
/*19*/ 
/*20*/     try {
/*21*/         // Rule: NO_DEEP_NESTING
/*22*/         if (API_URL) { for (let i = 0; i < 5; i++) { if (i > 2) { if (i > 3) { console.log('Too deep!'); } } } }
/*23*/     } catch (e) {
/*24*/         // Rule: NO_SILENT_FALLBACKS
/*25*/         return null; 
/*26*/     }
/*27*/ }`;


async function runValidationEngineTest() {
    console.log('\n======================================================');
    console.log('  🧪  RUNNING DYNAMIC VALIDATION ENGINE TEST  🧪  ');
    console.log('======================================================\n');

    const engine = new ValidationEngine();
    await new Promise(resolve => setTimeout(resolve, 200));
    const validationResults = await engine.validateCode(sampleCodeForTest, 'javascript');
    const violations = validationResults.violations;

    const activeRules = Object.keys(ABSOLUTE_RULES);
    console.log(`Active rules found in validator.js: ${activeRules.join(', ')}\n`);
    
    // ! FIX: วนลูปเทสเฉพาะกฎที่มีอยู่จริงเท่านั้น
    
    if (activeRules.includes('NO_EMOJI')) {
        assert.group('NO_EMOJI', () => {
            const violation = violations.find(v => v.ruleId === 'NO_EMOJI');
            assert.exists(violation, 'Should detect a violation');
            if(violation) assert.equals(violation.location.start.line, 2, 'Violation should be on line 2');
        });
    }
    
    if (activeRules.includes('NO_HARDCODE')) {
        assert.group('NO_HARDCODE', () => {
            const v = violations.filter(v => v.ruleId === 'NO_HARDCODE');
            assert.exists(v.find(i => i.match.includes('https')), 'Should detect hardcoded URL');
            assert.exists(v.find(i => i.match.includes('sk_live')), 'Should detect hardcoded API Key');
        });
    }

    if (activeRules.includes('NO_MOCKING')) {
        assert.group('NO_MOCKING', () => {
            const v = violations.filter(v => v.ruleId === 'NO_MOCKING');
            assert.exists(v.find(i => i.message.includes('jest.mock')), 'Should detect jest.mock()');
            assert.exists(v.find(i => i.message.includes('jest.spyOn')), 'Should detect jest.spyOn()');
        });
    }

    if (activeRules.includes('NO_SILENT_FALLBACKS')) {
        assert.group('NO_SILENT_FALLBACKS', () => {
            const violation = violations.find(v => v.ruleId === 'NO_SILENT_FALLBACKS');
            assert.exists(violation, 'Should detect silent fallback in catch block');
            if(violation) assert.equals(violation.location.start.line, 24, 'Violation should be on line 24');
        });
    }

    if (activeRules.includes('NO_INTERNAL_CACHING')) {
        assert.group('NO_INTERNAL_CACHING', () => {
            const violation = violations.find(v => v.ruleId === 'NO_INTERNAL_CACHING');
            assert.exists(violation, 'Should detect internal cache declaration');
            if(violation) assert.equals(violation.location.start.line, 17, 'Violation should be on line 17');
        });
    }
    
    // เทสเหล่านี้จะรันก็ต่อเมื่อคุณเพิ่มกฎกลับเข้าไปใน ABSOLUTE_RULES
    if (activeRules.includes('NO_COMPLEX_FUNCTIONS')) {
        assert.group('NO_COMPLEX_FUNCTIONS', () => {
            const violation = violations.find(v => v.ruleId === 'NO_COMPLEX_FUNCTIONS');
            assert.exists(violation, 'Should detect function with too many parameters');
        });
    }

    if (activeRules.includes('NO_DEEP_NESTING')) {
        assert.group('NO_DEEP_NESTING', () => {
            const violation = violations.find(v => v.ruleId === 'NO_DEEP_NESTING');
            assert.exists(violation, 'Should detect deeply nested logic');
        });
    }


    console.log('\n--- TEST SUMMARY ---');
    console.log(`  Total Asserts: ${results.total}`);
    console.log(`  \x1b[32mPassed: ${results.passed}\x1b[0m`);
    console.log(`  \x1b[31mFailed: ${results.failed}\x1b[0m`);
    console.log('--------------------\n');

    if (results.failed > 0) {
        console.error('\x1b[41m\x1b[37m  SOME TESTS FAILED! Please review the output.  \x1b[0m\n');
        process.exit(1);
    } else {
        console.log('\x1b[42m\x1b[30m  ALL ACTIVE RULE TESTS PASSED! Your engine is correctly synced with your rules.  \x1b[0m\n');
    }
}

runValidationEngineTest().catch(err => {
    console.error('A critical error occurred during the test run:', err);
    process.exit(1);
});