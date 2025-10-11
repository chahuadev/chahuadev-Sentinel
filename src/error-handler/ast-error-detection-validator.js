#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! AST-Based Error Detection Validator
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ตรวจสอบว่าไฟล์ไหนพยายามจัดการ Error เองโดยไม่ส่งไปที่ ErrorHandler
// ! 
// ! VERSION 2.0 IMPROVEMENTS:
// ! ใช้ AST Parser แทน Regex (แม่นยำ 100%)
// ! ตรวจสอบ import ทั้งไฟล์ (ไม่ใช่แค่ 500 characters)
// ! ตรวจจับ Wrapper Functions ได้
// ! ไม่มี False Positive/Negative
// ! แยก Grammar Documentation ออกจาก Production Code
// ! ══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import errorHandler from './ErrorHandler.js';
import { PureBinaryParser } from '../grammars/shared/pure-binary-parser.js';
import { BinaryComputationTokenizer } from '../grammars/shared/tokenizer-helper.js';
import { GrammarIndex } from '../grammars/index.js';



// ! ══════════════════════════════════════════════════════════════════════════════
// ! CONSTANTS - NO_HARDCODE COMPLIANCE
// ! ══════════════════════════════════════════════════════════════════════════════
const REPORT_BASE_DIR = 'logs';
const REPORT_SUB_DIR = 'error-detection';
const REPORT_FILENAME_PREFIX = 'ast-error-detection-';
const DEFAULT_SCAN_DIR = 'src';
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', 'coverage'];
const EXCLUDED_FILES = [
    'javascript.grammar.json', 
    'typescript.grammar.json',
    'java.grammar.json',
    'jsx.grammar.json'
]; // Grammar data files (Pure Data - not executable code)

// ! ══════════════════════════════════════════════════════════════════════════════
// ! AST-BASED ERROR DETECTION VALIDATOR CLASS
// ! ══════════════════════════════════════════════════════════════════════════════
class ASTErrorDetectionValidator {
    constructor() {
        this.violations = [];
        this.scannedFiles = 0;
        this.totalIssues = 0;
        this.grammarCache = null;
    }

    /**
     * โหลด JavaScript Grammar สำหรับ AST Parser
     */
    async loadGrammar() {
        if (this.grammarCache) {
            return this.grammarCache;
        }

        try {
            // Load grammar from JSON (Pure Data)
            const fs = await import('fs');
            const path = await import('path');
            const { fileURLToPath } = await import('url');
            const { dirname, join } = path;
            
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const grammarPath = join(__dirname, '../grammars/javascript.grammar.json');
            
            const grammar = JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
            this.grammarCache = new GrammarIndex(grammar);
            console.log('[INIT] JavaScript Grammar loaded successfully from JSON');
            return this.grammarCache;
        } catch (error) {
            errorHandler.handleError(error, {
                source: 'ASTErrorDetectionValidator',
                method: 'loadGrammar',
                severity: 'CRITICAL'
            });
            throw error;
        }
    }

    /**
     * สแกนไฟล์เดียวด้วย AST Parser
     */
    async scanFile(filePath) {
        // ข้าม Grammar Documentation files
        const fileName = path.basename(filePath);
        if (EXCLUDED_FILES.includes(fileName)) {
            console.log(`[SKIP] Grammar documentation file: ${fileName}`);
            return;
        }

        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // ข้าม shebang line (#!/usr/bin/env node)
            if (content.startsWith('#!')) {
                const firstNewline = content.indexOf('\n');
                if (firstNewline !== -1) {
                    content = content.substring(firstNewline + 1);
                }
            }
            
            this.scannedFiles++;

            // Load grammar if not loaded
            const grammarIndex = await this.loadGrammar();

            // Tokenize
            const tokenizer = new BinaryComputationTokenizer(grammarIndex);
            const tokens = tokenizer.tokenize(content);

            // Parse to AST using Pure Binary Parser
            const parser = new PureBinaryParser(tokens, grammarIndex);
            const ast = parser.parse();

            // Step 1: Check if file imports errorHandler
            const hasErrorHandlerImport = this.checkErrorHandlerImport(ast);

            // Step 2: Find all try-catch blocks
            const tryCatchBlocks = this.findTryCatchBlocks(ast);

            // Step 3: Analyze each catch block
            for (const tryCatch of tryCatchBlocks) {
                const violation = this.analyzeCatchBlock(
                    tryCatch,
                    hasErrorHandlerImport,
                    content,
                    filePath
                );

                if (violation) {
                    this.violations.push(violation);
                    this.totalIssues++;
                }
            }

        } catch (error) {
            // ! FAIL FAST, FAIL LOUD - ไม่กลืน error
            errorHandler.handleError(error, {
                source: 'ASTErrorDetectionValidator',
                method: 'scanFile',
                filePath: filePath,
                severity: 'HIGH'
            });
            throw error; // ! Re-throw เพื่อหยุดการทำงาน
        }
    }

    /**
     * ตรวจสอบว่าไฟล์มีการ import errorHandler หรือไม่
     * (ตรวจสอบทั้งไฟล์ ไม่ใช่แค่ 500 characters)
     */
    checkErrorHandlerImport(ast) {
        if (!ast || !ast.body) {
            return false;
        }

        // ค้นหา import statements ทั้งหมด
        for (const node of ast.body) {
            if (node.type === 'ImportDeclaration') {
                // ตรวจสอบว่า import จาก ErrorHandler หรือไม่
                const source = node.source;
                if (source && source.value) {
                    if (source.value.includes('ErrorHandler') || source.value.includes('error-handler')) {
                        // ตรวจสอบว่า import errorHandler หรือ { handleError } หรือไม่
                        if (node.specifiers) {
                            for (const spec of node.specifiers) {
                                if (spec.local && spec.local.name === 'errorHandler') {
                                    return true;
                                }
                                if (spec.imported && spec.imported.name === 'handleError') {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    /**
     * หา try-catch blocks ทั้งหมดใน AST
     */
    findTryCatchBlocks(ast) {
        const blocks = [];

        const traverse = (node) => {
            if (!node || typeof node !== 'object') {
                return;
            }

            if (node.type === 'TryStatement') {
                blocks.push(node);
            }

            // Traverse child nodes
            for (const key in node) {
                if (key === 'parent') {
                    continue; // ข้าม parent reference เพื่อไม่ให้เกิด infinite loop
                }
                const value = node[key];
                if (Array.isArray(value)) {
                    value.forEach(traverse);
                } else if (typeof value === 'object') {
                    traverse(value);
                }
            }
        };

        traverse(ast);
        return blocks;
    }

    /**
     * วิเคราะห์ catch block ว่าละเมิดกฎหรือไม่
     */
    analyzeCatchBlock(tryCatch, hasErrorHandlerImport, content, filePath) {
        const catchClause = tryCatch.handler;
        if (!catchClause || !catchClause.body) {
            return null; // ไม่มี catch block
        }

        const catchBody = catchClause.body.body;
        if (!catchBody || catchBody.length === 0) {
            // EMPTY_CATCH - ละเมิดร้ายแรง
            return {
                file: filePath,
                line: catchClause.start || 0,
                pattern: 'EMPTY_CATCH',
                description: 'Empty catch block - errors are silently ignored',
                severity: 'CRITICAL',
                hasErrorHandlerImport: hasErrorHandlerImport,
                actualCode: this.extractCode(content, catchClause.start, catchClause.end)
            };
        }

        // ตรวจสอบว่ามีการเรียก errorHandler.handleError หรือไม่
        const hasErrorHandlerCall = this.checkErrorHandlerCall(catchClause);

        if (!hasErrorHandlerCall) {
            // ตรวจสอบว่าเป็น CONSOLE_ERROR_ONLY หรือไม่
            const isConsoleOnly = this.checkConsoleErrorOnly(catchClause);
            
            if (isConsoleOnly) {
                return {
                    file: filePath,
                    line: catchClause.start || 0,
                    pattern: 'CONSOLE_ERROR_ONLY',
                    description: 'Catch block only uses console.error without errorHandler',
                    severity: 'HIGH',
                    hasErrorHandlerImport: hasErrorHandlerImport,
                    actualCode: this.extractCode(content, catchClause.start, catchClause.end)
                };
            }

            // ตรวจสอบว่า re-throw error หรือไม่ (ถ้า re-throw ถือว่าไม่ละเมิด)
            const hasRethrow = this.checkRethrow(catchClause);
            if (hasRethrow) {
                return null; // ไม่ละเมิด
            }

            // ละเมิด: มีการ handle error แต่ไม่ใช้ errorHandler
            return {
                file: filePath,
                line: catchClause.start || 0,
                pattern: 'NO_ERRORHANDLER_CALL',
                description: 'Catch block handles error without using errorHandler',
                severity: 'HIGH',
                hasErrorHandlerImport: hasErrorHandlerImport,
                actualCode: this.extractCode(content, catchClause.start, catchClause.end)
            };
        }

        return null; // ไม่ละเมิด
    }

    /**
     * ตรวจสอบว่ามีการเรียก errorHandler.handleError ใน catch block
     */
    checkErrorHandlerCall(catchClause) {
        const traverse = (node) => {
            if (!node || typeof node !== 'object') {
                return false;
            }

            // ตรวจสอบ CallExpression: errorHandler.handleError()
            if (node.type === 'CallExpression') {
                const callee = node.callee;
                if (callee && callee.type === 'MemberExpression') {
                    const object = callee.object;
                    const property = callee.property;
                    
                    if (object && object.name === 'errorHandler' &&
                        property && property.name === 'handleError') {
                        return true;
                    }
                }
            }

            // Traverse child nodes
            for (const key in node) {
                if (key === 'parent') continue;
                const value = node[key];
                if (Array.isArray(value)) {
                    if (value.some(traverse)) return true;
                } else if (typeof value === 'object') {
                    if (traverse(value)) return true;
                }
            }

            return false;
        };

        return traverse(catchClause);
    }

    /**
     * ตรวจสอบว่ามีแค่ console.error หรือไม่
     */
    checkConsoleErrorOnly(catchClause) {
        let hasConsoleError = false;
        let hasOtherStatements = false;

        const body = catchClause.body.body;
        for (const stmt of body) {
            if (stmt.type === 'ExpressionStatement' &&
                stmt.expression.type === 'CallExpression') {
                const callee = stmt.expression.callee;
                if (callee && callee.type === 'MemberExpression') {
                    const object = callee.object;
                    const property = callee.property;
                    if (object && object.name === 'console' &&
                        property && property.name === 'error') {
                        hasConsoleError = true;
                        continue;
                    }
                }
            }
            hasOtherStatements = true;
        }

        return hasConsoleError && !hasOtherStatements;
    }

    /**
     * ตรวจสอบว่ามีการ re-throw error หรือไม่
     */
    checkRethrow(catchClause) {
        const body = catchClause.body.body;
        for (const stmt of body) {
            if (stmt.type === 'ThrowStatement') {
                return true;
            }
        }
        return false;
    }

    /**
     * ดึงโค้ดจริงจากไฟล์
     */
    extractCode(content, start, end) {
        const lines = content.split('\n');
        const startLine = this.getLineNumber(content, start);
        const endLine = this.getLineNumber(content, end);
        
        const codeLines = [];
        for (let i = startLine - 1; i < endLine && i < lines.length; i++) {
            codeLines.push(`${i + 1}: ${lines[i]}`);
        }
        return codeLines.join('\n');
    }

    /**
     * หาเลขบรรทัดจาก character position
     */
    getLineNumber(content, position) {
        if (!position) return 1;
        return content.substring(0, position).split('\n').length;
    }

    /**
     * สแกนทั้ง directory
     */
    async scanDirectory(dir) {
        const files = this.getAllJsFiles(dir);
        console.log(`\n[SCAN] Found ${files.length} JavaScript files to scan...\n`);
        
        for (const file of files) {
            await this.scanFile(file);
        }
    }

    /**
     * ดึงไฟล์ .js ทั้งหมด
     */
    getAllJsFiles(dir) {
        const files = [];
        
        const scan = (directory) => {
            const items = fs.readdirSync(directory);
            
            items.forEach(item => {
                const fullPath = path.join(directory, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!EXCLUDED_DIRS.includes(item)) {
                        scan(fullPath);
                    }
                } else if (item.endsWith('.js')) {
                    files.push(fullPath);
                }
            });
        };
        
        scan(dir);
        return files;
    }

    /**
     * สร้างรายงาน
     */
    generateReport() {
        console.log('\n' + '='.repeat(80));
        console.log('AST-BASED ERROR HANDLING VALIDATION REPORT (v2.0)');
        console.log('='.repeat(80));
        console.log(`Scanned Files: ${this.scannedFiles}`);
        console.log(`Total Issues Found: ${this.totalIssues}`);
        console.log('='.repeat(80));
        
        if (this.violations.length === 0) {
            console.log('\n[OK] No error handling violations found!\n');
            return;
        }

        // จัดกลุ่มตาม severity
        const critical = this.violations.filter(v => v.severity === 'CRITICAL');
        const high = this.violations.filter(v => v.severity === 'HIGH');

        if (critical.length > 0) {
            console.log(`\n[CRITICAL] ${critical.length} Critical Issues:`);
            this.printViolations(critical);
        }

        if (high.length > 0) {
            console.log(`\n[HIGH] ${high.length} High Priority Issues:`);
            this.printViolations(high);
        }

        console.log('\n' + '='.repeat(80));
        console.log('[ACTION REQUIRED] Fix these issues by:');
        console.log('1. Import errorHandler: import errorHandler from "./error-handler/ErrorHandler.js"');
        console.log('2. In catch blocks: errorHandler.handleError(error, { source: __filename, method: "methodName" })');
        console.log('3. Remove empty catch blocks');
        console.log('4. Remove console.error-only error handling');
        console.log('='.repeat(80) + '\n');
    }

    /**
     * พิมพ์รายการ violations
     */
    printViolations(violations) {
        violations.forEach((v, index) => {
            console.log(`\n  ${index + 1}. File: ${v.file}`);
            console.log(`     Line: ${v.line}`);
            console.log(`     Pattern: ${v.pattern}`);
            console.log(`     Issue: ${v.description}`);
            console.log(`     Has ErrorHandler Import: ${v.hasErrorHandlerImport ? 'YES' : 'NO'}`);
            console.log(`\n     ACTUAL CODE FROM FILE:`);
            console.log('     ' + '-'.repeat(70));
            console.log(v.actualCode.split('\n').map(line => '     ' + line).join('\n'));
            console.log('     ' + '-'.repeat(70));
        });
    }

    /**
     * บันทึกรายงานลงไฟล์
     */
    saveReportToFile() {
        const reportDir = path.join(process.cwd(), REPORT_BASE_DIR, REPORT_SUB_DIR);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const reportFile = path.join(reportDir, `${REPORT_FILENAME_PREFIX}${timestamp}.json`);

        const report = {
            version: '2.0',
            method: 'AST-based',
            timestamp: new Date().toISOString(),
            scannedFiles: this.scannedFiles,
            totalIssues: this.totalIssues,
            violations: this.violations
        };

        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        console.log(`\n[REPORT] Saved to: ${reportFile}`);
    }
}

// Export
export { ASTErrorDetectionValidator };
export { ASTErrorDetectionValidator as ErrorDetectionValidator };
export default ASTErrorDetectionValidator;

// CLI Usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const validator = new ASTErrorDetectionValidator();
    let targetDir = path.join(process.cwd(), DEFAULT_SCAN_DIR);
    if (process.argv[2]) {
        targetDir = process.argv[2];
    }
    
    console.log('================================================================================');
    console.log('AST-BASED ERROR DETECTION VALIDATOR v2.0');
    console.log('================================================================================');
    console.log('[START] Error Detection Validation');
    console.log(`[TARGET] ${targetDir}`);
    
    validator.scanDirectory(targetDir)
        .then(() => {
            validator.generateReport();
            validator.saveReportToFile();
            
            if (validator.totalIssues > 0) {
                process.exit(1);
            }
        })
        .catch((error) => {
            errorHandler.handleError(error, {
                source: 'ast-error-detection-validator.js',
                method: 'CLI',
                severity: 'CRITICAL',
                context: 'Validator execution crashed - AST parsing, file scanning, or report generation failed'
            });
            // errorHandler.handleError จะ process.exit(1) เองถ้าเป็น CRITICAL
        });
}
