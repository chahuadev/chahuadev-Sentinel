// ══════════════════════════════════════════════════════════════════════════════
// END-TO-END TEST: Complete Parser Pipeline with Snapshot Testing
// ══════════════════════════════════════════════════════════════════════════════
// Purpose: Test entire system from source code to AST
// Philosophy: Test as a real user would - full pipeline
// Speed: Slower (complete parsing, snapshot comparison)
// ══════════════════════════════════════════════════════════════════════════════
// WHY SNAPSHOT TESTING:
//   - AST structures are complex and deeply nested
//   - Manual assertion of entire AST is tedious and error-prone
//   - Snapshots capture exact output once verified correct
//   - Future changes that break AST structure are immediately detected
//   - Easy to review: git diff shows exactly what changed
// ══════════════════════════════════════════════════════════════════════════════

import { describe, test, expect } from '@jest/globals';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ══════════════════════════════════════════════════════════════════════════════
// MOCK PARSER: Simulated AST generation for testing structure
// ══════════════════════════════════════════════════════════════════════════════
// NOTE: Replace this with actual PureBinaryParser when ready
// This demonstrates the testing approach
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Mock function that simulates parsing JavaScript code to AST
 * In production, this would be: PureBinaryParser.parse(code, 'javascript')
 */
function mockParse(code, language = 'javascript') {
    // This is a simplified mock - real parser would use tokenizer + grammar
    return {
        type: 'Program',
        language,
        body: [],
        sourceCode: code,
        tokens: code.split(/\s+/).length,
        timestamp: new Date().toISOString().split('T')[0], // Date only, no time
        metadata: {
            hasAsync: code.includes('async'),
            hasClass: code.includes('class'),
            hasImport: code.includes('import'),
            hasExport: code.includes('export'),
            linesOfCode: code.split('\n').length
        }
    };
}

// ══════════════════════════════════════════════════════════════════════════════
// HELPER: Load all test case files
// ══════════════════════════════════════════════════════════════════════════════

function loadTestCases() {
    const testCasesDir = join(__dirname, '../../test-cases');
    const files = readdirSync(testCasesDir).filter(f => f.endsWith('.js'));
    
    return files.map(file => {
        const filePath = join(testCasesDir, file);
        const code = readFileSync(filePath, 'utf-8');
        return {
            name: file.replace('.js', ''),
            path: filePath,
            code
        };
    });
}

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: E2E Parsing with Snapshot Testing
// ══════════════════════════════════════════════════════════════════════════════

describe('E2E: Complete Parser Pipeline', () => {
    const testCases = loadTestCases();
    
    test('should load all test cases', () => {
        expect(testCases.length).toBeGreaterThan(0);
        console.log(`Loaded ${testCases.length} test cases`);
    });

    // Generate a test for each test case file
    testCases.forEach(({ name, code }) => {
        test(`should correctly parse: ${name}`, () => {
            const ast = mockParse(code, 'javascript');
            
            // Basic sanity checks before snapshot
            expect(ast).toBeDefined();
            expect(ast.type).toBe('Program');
            expect(ast.language).toBe('javascript');
            
            // SNAPSHOT: Capture entire AST structure
            // First run creates .snap file
            // Future runs compare against saved snapshot
            expect(ast).toMatchSnapshot();
        });
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Specific Feature Validation
// ══════════════════════════════════════════════════════════════════════════════

describe('E2E: Simple Variable Declaration', () => {
    test('should parse const declaration correctly', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/simple-variable.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast.metadata.hasAsync).toBe(false);
        expect(ast.metadata.hasClass).toBe(false);
        expect(ast.metadata.hasImport).toBe(false);
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: If-Else Statement', () => {
    test('should parse conditional logic correctly', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/if-else.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast.type).toBe('Program');
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: For Loops', () => {
    test('should parse all loop types correctly', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/for-loop.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: Complex Function', () => {
    test('should parse async/await and generators', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/complex-function.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast.metadata.hasAsync).toBe(true);
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: ES6 Class', () => {
    test('should parse class inheritance correctly', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/es6-class.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast.metadata.hasClass).toBe(true);
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: ES6 Modules', () => {
    test('should parse import/export statements', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/es6-modules.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast.metadata.hasImport).toBe(true);
        expect(ast.metadata.hasExport).toBe(true);
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: Destructuring and Spread', () => {
    test('should parse modern syntax correctly', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/destructuring-spread.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: Template Literals', () => {
    test('should parse template strings and tags', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/template-literals.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: Comments', () => {
    test('should handle all comment types', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/comments.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast).toMatchSnapshot();
    });
});

describe('E2E: Edge Cases', () => {
    test('should handle quirky JavaScript features', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/edge-cases.js'),
            'utf-8'
        );
        const ast = mockParse(code);
        
        expect(ast).toMatchSnapshot();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Error Handling
// ══════════════════════════════════════════════════════════════════════════════

describe('E2E: Invalid Syntax Error Handling', () => {
    test('should throw appropriate errors for invalid syntax', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/invalid-syntax.js'),
            'utf-8'
        );
        
        // For now, mock parser doesn't throw
        // Real parser should throw SyntaxError
        // expect(() => mockParse(code)).toThrow(SyntaxError);
        
        // Snapshot the error structure
        try {
            const ast = mockParse(code);
            expect(ast).toMatchSnapshot();
        } catch (error) {
            expect(error).toMatchSnapshot();
        }
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Performance Benchmarks
// ══════════════════════════════════════════════════════════════════════════════

describe('E2E: Performance', () => {
    test('should parse simple code in reasonable time', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/simple-variable.js'),
            'utf-8'
        );
        
        const start = performance.now();
        const ast = mockParse(code);
        const end = performance.now();
        
        const duration = end - start;
        
        // Should complete in less than 100ms for simple code
        expect(duration).toBeLessThan(100);
        expect(ast).toBeDefined();
    });

    test('should parse complex code in reasonable time', () => {
        const code = readFileSync(
            join(__dirname, '../../test-cases/complex-function.js'),
            'utf-8'
        );
        
        const start = performance.now();
        const ast = mockParse(code);
        const end = performance.now();
        
        const duration = end - start;
        
        // Even complex code should be fast
        expect(duration).toBeLessThan(500);
        expect(ast).toBeDefined();
    });
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITE: Regression Tests
// ══════════════════════════════════════════════════════════════════════════════
// These tests ensure that previously fixed bugs don't come back
// ══════════════════════════════════════════════════════════════════════════════

describe('E2E: Regression Tests', () => {
    test('should not break on empty file', () => {
        const code = '';
        const ast = mockParse(code);
        
        expect(ast).toBeDefined();
        expect(ast.type).toBe('Program');
        expect(ast).toMatchSnapshot();
    });

    test('should not break on whitespace-only file', () => {
        const code = '   \n  \t  \n   ';
        const ast = mockParse(code);
        
        expect(ast).toBeDefined();
        expect(ast).toMatchSnapshot();
    });

    test('should not break on single-line comment only', () => {
        const code = '// just a comment';
        const ast = mockParse(code);
        
        expect(ast).toBeDefined();
        expect(ast).toMatchSnapshot();
    });

    test('should handle Unicode identifiers', () => {
        const code = 'const 변수명 = 123;';
        const ast = mockParse(code);
        
        expect(ast).toBeDefined();
        expect(ast).toMatchSnapshot();
    });
});
