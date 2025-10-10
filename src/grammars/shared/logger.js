#!/usr/bin/env node

//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================

/**
 * ============================================================================
 * Professional Scan Logger Module - ระบบบันทึกผลการสแกนแบบมืออาชีพ
 * ============================================================================
 * โมดูลนี้จะรัน Chahuadev Sentinel และสร้าง log files แบบมืออาชีพ:
 * - Raw output log (ผลการสแกนดิบ)
 * - Violation logs แยกตาม rule (การละเมิดแต่ละประเภท)
 * - Error log (บันทึกข้อผิดพลาด)
 * - Summary report (รายงานสรุป)
 * - Performance metrics (ข้อมูลประสิทธิภาพ)
 * - Security report (รายงานความปลอดภัย)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { SecurityManager } from '../../security/security-manager.js';
import errorHandler from '../../error-handler/ErrorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WHY: Get project root directory for CLI execution (NO_HARDCODE)
const projectRoot = path.resolve(__dirname, '../../..');
const cliPath = path.join(projectRoot, 'cli.js');

// ============================================================================
// Professional Logging System - ระบบบันทึกมืออาชีพ
// ============================================================================

class ProfessionalScanLogger {
    constructor() {
        this.projectName = 'Chahuadev-Sentinel';
        this.logsDir = path.join(process.cwd(), 'logs');
        
        // Initialize security manager
        console.log('[SECURITY] Initializing security protection for logging...');
        
        // ! NO_INTERNAL_CACHING: Inject rate limit store
        const rateLimitStore = new Map();
        console.warn('[SECURITY] Using in-memory rate limiting for logger. For production, inject Redis.');
        
        this.securityManager = new SecurityManager({
            rateLimitStore: rateLimitStore
        });

        try {
            // สร้างโฟลเดอร์ logs หลักถ้ายังไม่มี
            if (!fs.existsSync(this.logsDir)) {
                fs.mkdirSync(this.logsDir, { recursive: true });
            }

            // สร้างโฟลเดอร์ย่อยสำหรับโปรเจกต์นี้
            this.projectLogsDir = path.join(this.logsDir, this.projectName);
            if (!fs.existsSync(this.projectLogsDir)) {
                fs.mkdirSync(this.projectLogsDir, { recursive: true });
            }

            // สร้างโฟลเดอร์ session ตามวันเวลา
            const now = new Date();
            const dateFolder = now.toISOString().slice(0, 10); // 2025-10-09
            const timeFolder = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // 14-30-45
            this.sessionFolder = `${dateFolder}_${timeFolder}`;
            this.sessionLogsDir = path.join(this.projectLogsDir, this.sessionFolder);

            if (!fs.existsSync(this.sessionLogsDir)) {
                fs.mkdirSync(this.sessionLogsDir, { recursive: true });
            }
        } catch (err) {
            console.error(`CRITICAL: Failed to create logging directory structure`, err);
            // WHY: Cannot proceed without logging infrastructure - must fail loudly (NO_SILENT_FALLBACKS)
            const error = new Error(`Logging system initialization failed: Unable to create directories - ${err.message}`);
            error.isOperational = false; // Infrastructure failure = bug
            errorHandler.handleError(error, {
                source: 'logger.js',
                method: 'constructor',
                action: 'directory_creation'
            });
            throw error;
        }

        this.startTime = Date.now();
        this.timestamp = this.getTimestamp();

        this.logFiles = {
            rawOutput: path.join(this.sessionLogsDir, `raw-output-${this.timestamp}.log`),
            errors: path.join(this.sessionLogsDir, `errors-${this.timestamp}.log`),
            summary: path.join(this.sessionLogsDir, `SUMMARY-${this.timestamp}.log`),
            performance: path.join(this.sessionLogsDir, `performance-${this.timestamp}.log`),
            audit: path.join(this.sessionLogsDir, `audit-${this.timestamp}.log`),
            security: path.join(this.sessionLogsDir, `SECURITY-${this.timestamp}.log`)
        };

        // เขียน session header
        this.writeSessionHeader();
        
        // เขียน security report
        this.writeSecurityReport();
    }

    writeSessionHeader() {
        const timestamp = new Date().toISOString();
        const header = `\n${'='.repeat(80)}\nSESSION START: ${timestamp} | Project: ${this.projectName}\n${'='.repeat(80)}\n`;

        Object.values(this.logFiles).forEach(logFile => {
            try {
                fs.appendFileSync(logFile, header, 'utf8');
            } catch (err) {
                console.error(`CRITICAL: Failed to write session header to log file: ${logFile}`, err);
                // WHY: Logging system failure is critical - if we cannot log, we must fail loudly (NO_SILENT_FALLBACKS)
                const error = new Error(`Logging system initialization failed for ${logFile}: ${err.message}`);
                error.isOperational = false;
                errorHandler.handleError(error, {
                    source: 'logger.js',
                    method: 'writeSessionHeader',
                    logFile: logFile
                });
                throw error;
            }
        });
    }

    writeSecurityReport() {
        const report = this.securityManager.generateSecurityReport();
        const timestamp = new Date().toISOString();
        
        let securityLog = `\n${'='.repeat(80)}\n`;
        securityLog += `SECURITY REPORT - ${timestamp}\n`;
        securityLog += `${'='.repeat(80)}\n\n`;
        securityLog += `Configuration Level: ${report.securityLevel || 'STANDARD'}\n`;
        securityLog += `Status: ${report.status}\n`;
        securityLog += `Timestamp: ${report.timestamp}\n`;
        securityLog += `\nStatistics:\n`;
        securityLog += `  - Total Events: ${report.statistics?.totalEvents || 0}\n`;
        securityLog += `  - Recent Events: ${report.statistics?.recentEvents || 0}\n`;
        securityLog += `  - Violations: ${report.statistics?.violations || 0}\n`;
        
        if (report.recentViolations && report.recentViolations.length > 0) {
            securityLog += `\n${'='.repeat(80)}\n`;
            securityLog += `RECENT VIOLATIONS\n`;
            securityLog += `${'='.repeat(80)}\n\n`;
            
            report.recentViolations.forEach((violation, index) => {
                securityLog += `${index + 1}. Type: ${violation.type}\n`;
                securityLog += `   Message: ${violation.message}\n`;
                securityLog += `   Timestamp: ${violation.timestamp}\n\n`;
            });
        } else {
            securityLog += `\nNo recent violations detected.\n`;
        }
        
        securityLog += `\n${'='.repeat(80)}\n\n`;
        
        try {
            fs.appendFileSync(this.logFiles.security, securityLog, 'utf8');
            console.log(`[SECURITY] Security report written to: ${this.logFiles.security}`);
            
            // แสดง vulnerability summary ใน console สำหรับความโปร่งใส
            if (report.vulnerabilities && report.vulnerabilities.length > 0) {
                console.log(`[SECURITY] Transparency Report: ${report.vulnerabilities.length} known vulnerabilities at ${report.config.level} level`);
                report.vulnerabilities.forEach((vuln, index) => {
                    console.log(`  ${index + 1}. ${vuln.type}: ${vuln.description}`);
                });
            }
        } catch (err) {
            console.error(`CRITICAL: Failed to write security report`, err);
            // WHY: Security logging is critical for transparency - must fail loudly (NO_SILENT_FALLBACKS)
            const error = new Error(`Security report logging failed: ${err.message}`);
            error.isOperational = false;
            errorHandler.handleError(error, {
                source: 'logger.js',
                method: 'writeSecurityReport'
            });
            throw error;
        }
    }

    formatLogEntry(level, category, message, data = null) {
        const timestamp = new Date().toISOString();
        let entry = `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`;

        if (data) {
            entry += `\n  Data: ${JSON.stringify(data, null, 2)}`;
        }

        entry += '\n';
        return entry;
    }

    getTimestamp() {
        const now = new Date();
        return now.toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .replace(/\..+/, '');
    }

    audit(action, details = null) {
        const entry = this.formatLogEntry('AUDIT', 'SCAN_OPERATION', action, details);
        try {
            fs.appendFileSync(this.logFiles.audit, entry, 'utf8');
        } catch (err) {
            console.error(`CRITICAL: Failed to write audit log: ${this.logFiles.audit}`, err);
            // WHY: Audit trail is critical for compliance and debugging - must fail loudly (NO_SILENT_FALLBACKS)
            throw new Error(`Audit logging failed: ${err.message}`);
        }
    }

    performance(operation, duration, details = null) {
        const entry = this.formatLogEntry('PERFORMANCE', operation, `Duration: ${duration}ms`, details);
        try {
            fs.appendFileSync(this.logFiles.performance, entry, 'utf8');
        } catch (err) {
            console.error(`CRITICAL: Failed to write performance log: ${this.logFiles.performance}`, err);
            // WHY: Performance metrics are essential for system monitoring - must fail loudly (NO_SILENT_FALLBACKS)
            throw new Error(`Performance logging failed: ${err.message}`);
        }
    }

    error(category, message, errorObj = null) {
        const data = errorObj ? {
            message: errorObj.message,
            stack: errorObj.stack,
            name: errorObj.name
        } : null;

        const entry = this.formatLogEntry('ERROR', category, message, data);
        try {
            fs.appendFileSync(this.logFiles.errors, entry, 'utf8');
        } catch (err) {
            console.error(`CRITICAL: Failed to write error log: ${this.logFiles.errors}`, err);
            // WHY: Error logging failure is catastrophic - if we can't log errors, system is unreliable (NO_SILENT_FALLBACKS)
            throw new Error(`Error logging failed: ${err.message}`);
        }
        console.error(`[ERROR] ${category}: ${message}`);
    }

    getSessionPath() {
        return this.sessionLogsDir;
    }
}

// ============================================================================
// Configuration & Constants
// ============================================================================

const RULES = [
    'NO_EMOJI',
    'NO_HARDCODE',
    'NO_SILENT_FALLBACKS',
    'NO_INTERNAL_CACHING',
    'NO_MOCKING'
];

const COLORS = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
};

// ============================================================================
// Utility Functions
// ============================================================================

function colorLog(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function createHeader(title, count, timestamp) {
    const separator = '='.repeat(80);
    return [
        separator,
        `${title} - Found ${count} instances`,
        separator,
        `Timestamp: ${timestamp}`,
        `Source: src/ directory`,
        separator,
        ''
    ].join('\n');
}

// ============================================================================
// Scan Execution & Processing
// ============================================================================

class ScanProcessor {
    constructor(logger) {
        this.logger = logger;
    }

    runValidation(targetDir = 'src') {
        colorLog('[STEP 2] Running validation on src/ directory...', 'yellow');
        colorLog(`  -> Executing: node cli.js --quiet ${targetDir}`, 'gray');

        const startTime = Date.now();
        this.logger.audit('SCAN_START', { targetDirectory: targetDir });

        try {
            // WHY: Use absolute path to CLI to work from any location (NO_HARDCODE)
            const output = execSync(`node "${cliPath}" --quiet ${targetDir}`, {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: projectRoot
            });

            const duration = Date.now() - startTime;
            this.logger.performance('SCAN_EXECUTION', duration, {
                targetDirectory: targetDir,
                exitCode: 0
            });

            colorLog('  [OK] Validation completed with exit code: 0', 'green');
            return { output, exitCode: 0 };
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.performance('SCAN_EXECUTION', duration, {
                targetDirectory: targetDir,
                exitCode: error.status || 1
            });

            colorLog(`  [OK] Validation completed with exit code: ${error.status}`, 'yellow');
            return { output: error.stdout || error.stderr || '', exitCode: error.status || 1 };
        }
    }

    classifyViolations(output, timestamp) {
        colorLog('[STEP 3] Classifying violations by rule...', 'yellow');

        const violationCounts = {};
        const violationFiles = {};
        const sessionDir = this.logger.getSessionPath();

        RULES.forEach(rule => {
            colorLog(`  -> Processing ${rule} violations...`, 'gray');

            const violationLines = [];
            const lines = output.split('\n');

            lines.forEach(line => {
                if (line.includes(rule)) {
                    violationLines.push(line);
                }
            });

            const count = violationLines.length;
            violationCounts[rule] = count;

            // สร้างไฟล์ log
            const filename = `violations-${rule}.log`;
            const filepath = path.join(sessionDir, filename);
            violationFiles[rule] = filename;

            let content = createHeader(`${rule} VIOLATIONS`, count, timestamp);

            if (count > 0) {
                content += violationLines.join('\n');
            } else {
                content += 'No violations found.';
            }

            try {
                fs.writeFileSync(filepath, content, 'utf8');
            } catch (err) {
                console.error(`CRITICAL: Failed to write violation log: ${filepath}`, err);
                // WHY: Cannot continue without proper violation logging - must fail loudly (NO_SILENT_FALLBACKS)
                throw new Error(`Failed to create violation log for ${rule}: ${err.message}`);
            }
            
            this.logger.audit('VIOLATION_LOG_CREATED', { rule, count, filepath });

            const color = count === 0 ? 'green' : 'red';
            colorLog(`    [INFO] Found ${count} violations`, color);
        });

        return { violationCounts, violationFiles };
    }

    extractErrors(output, timestamp) {
        colorLog('[STEP 4] Extracting errors...', 'yellow');

        const errorPatterns = [
            /Error/i,
            /ERROR/,
            /SyntaxError/,
            /TypeError/,
            /ReferenceError/
        ];

        const errorLines = [];
        const lines = output.split('\n');

        lines.forEach(line => {
            if (errorPatterns.some(pattern => pattern.test(line))) {
                errorLines.push(line);
            }
        });

        const errorCount = errorLines.length;
        const filename = `errors-${timestamp}.log`;
        const filepath = path.join(this.logger.getSessionPath(), filename);

        const separator = '='.repeat(80);
        let content = [
            `ERRORS DETECTED - Found ${errorCount} error lines`,
            separator,
            `Timestamp: ${timestamp}`,
            `Source: src/ directory`,
            separator,
            ''
        ].join('\n');

        if (errorCount > 0) {
            content += errorLines.join('\n');
            colorLog(`  [WARN] Found ${errorCount} error lines`, 'red');
            this.logger.error('SCAN_ERRORS', `Detected ${errorCount} error lines during scan`);
        } else {
            content += 'No errors detected';
            colorLog('  [OK] No errors detected', 'green');
        }

        try {
            fs.writeFileSync(filepath, content, 'utf8');
        } catch (err) {
            console.error(`CRITICAL: Failed to write error log: ${filepath}`, err);
            // WHY: Error log is essential for debugging - failure to write must be reported (NO_SILENT_FALLBACKS)
            throw new Error(`Failed to create error log: ${err.message}`);
        }
        
        this.logger.audit('ERROR_LOG_CREATED', { errorCount, filepath });

        return { errorCount, filename };
    }

    generateSummary(exitCode, violationCounts, errorCount, violationFiles, timestamp) {
        colorLog('[STEP 5] Generating summary report...', 'yellow');

        const totalViolations = Object.values(violationCounts).reduce((sum, count) => sum + count, 0);
        const filename = `SUMMARY-${timestamp}.log`;
        const filepath = path.join(this.logger.getSessionPath(), filename);

        const separator = '='.repeat(80);
        const divider = '-'.repeat(20);

        let content = [
            separator,
            '              CHAHUADEV SENTINEL - SCAN SUMMARY',
            separator,
            `Timestamp: ${timestamp}`,
            `Test Target: src/ directory`,
            `Exit Code: ${exitCode}`,
            separator,
            '',
            'VIOLATION BREAKDOWN:',
            divider
        ];

        // เพิ่มข้อมูลการละเมิดแต่ละ rule
        RULES.sort().forEach(rule => {
            const count = violationCounts[rule] || 0;
            const status = count === 0 ? '[PASS]' : '[FAIL]';
            content.push(`  ${status} | ${rule} : ${count} violations`);
        });

        content.push('');
        content.push(`TOTAL VIOLATIONS: ${totalViolations}`);
        content.push('');
        content.push('ERROR SUMMARY:');
        content.push('-'.repeat(14));
        content.push(`  Total Error Lines: ${errorCount}`);
        content.push(`  Status: ${errorCount === 0 ? '[CLEAN]' : '[NEEDS ATTENTION]'}`);
        content.push('');
        content.push('FILES GENERATED:');
        content.push('-'.repeat(16));
        content.push(`  1. Raw Output: raw-output-${timestamp}.log`);
        
        let fileIndex = 2;
        RULES.forEach(rule => {
            content.push(`  ${fileIndex}. ${rule} Violations: ${violationFiles[rule]}`);
            fileIndex++;
        });
        
        content.push(`  ${fileIndex}. Errors: errors-${timestamp}.log`);
        content.push(`  ${fileIndex + 1}. Summary: ${filename}`);
        content.push(`  ${fileIndex + 2}. Performance: performance-${timestamp}.log`);
        content.push(`  ${fileIndex + 3}. Audit Trail: audit-${timestamp}.log`);
        content.push('');
        content.push(separator);
        content.push('                       END OF REPORT');
        content.push(separator);

        try {
            fs.writeFileSync(filepath, content.join('\n'), 'utf8');
        } catch (err) {
            console.error(`CRITICAL: Failed to write summary report: ${filepath}`, err);
            // WHY: Summary report is the primary deliverable - failure must be visible (NO_SILENT_FALLBACKS)
            throw new Error(`Failed to create summary report: ${err.message}`);
        }
        
        this.logger.audit('SUMMARY_REPORT_CREATED', { totalViolations, errorCount, filepath });
        colorLog('  [OK] Summary report generated', 'green');

        return { filename, totalViolations };
    }

    displaySummary(violationCounts, totalViolations, errorCount, sessionDir) {
        console.log('');
        colorLog('================================================', 'cyan');
        colorLog('              SCAN RESULTS SUMMARY', 'cyan');
        colorLog('================================================', 'cyan');
        console.log('');

        RULES.sort().forEach(rule => {
            const count = violationCounts[rule] || 0;
            const color = count === 0 ? 'green' : 'red';
            const symbol = count === 0 ? '[OK]' : '[X]';
            
            process.stdout.write(`${COLORS[color]}  ${symbol} ${rule}${COLORS.reset}`);
            process.stdout.write(' : ');
            console.log(`${COLORS[color]}${count} violations${COLORS.reset}`);
        });

        console.log('');
        process.stdout.write('  Total Violations: ');
        colorLog(`${totalViolations}`, totalViolations === 0 ? 'green' : 'red');

        process.stdout.write('  Total Errors: ');
        colorLog(`${errorCount}`, errorCount === 0 ? 'green' : 'red');

        console.log('');
        process.stdout.write(`${COLORS.yellow}  All logs saved to: ${COLORS.reset}`);
        colorLog(`${sessionDir}`, 'cyan');

        console.log('');
        colorLog('================================================', 'cyan');
        console.log('');
    }
}

// ============================================================================
// Main Execution
// ============================================================================

function main() {
    console.log('');
    colorLog('================================================', 'cyan');
    colorLog('  CHAHUADEV SENTINEL - PROFESSIONAL SCAN LOGGER', 'cyan');
    colorLog('================================================', 'cyan');
    console.log('');

    // Step 1: สร้าง Professional Logger
    colorLog('[STEP 1] Initializing professional logging system...', 'yellow');
    const logger = new ProfessionalScanLogger();
    colorLog(`  [OK] Logs session created: ${logger.sessionLogsDir}`, 'green');
    console.log('');

    // Step 2: สร้าง Processor และรัน validation
    const processor = new ScanProcessor(logger);
    const { output, exitCode } = processor.runValidation('src');
    
    const timestamp = logger.timestamp;
    try {
        fs.writeFileSync(logger.logFiles.rawOutput, output, 'utf8');
    } catch (err) {
        console.error(`CRITICAL: Failed to write raw output: ${logger.logFiles.rawOutput}`, err);
        // WHY: Raw output is the source of all analysis - failure is catastrophic (NO_SILENT_FALLBACKS)
        throw new Error(`Failed to save raw scan output: ${err.message}`);
    }
    
    logger.audit('RAW_OUTPUT_SAVED', { filepath: logger.logFiles.rawOutput });
    colorLog('  [OK] Raw output saved', 'green');
    console.log('');

    // Step 3: แยกประเภทการละเมิด
    const { violationCounts, violationFiles } = processor.classifyViolations(output, timestamp);
    console.log('');

    // Step 4: แยก Errors
    const { errorCount } = processor.extractErrors(output, timestamp);
    console.log('');

    // Step 5: สร้าง Summary
    const { filename: summaryFile, totalViolations } = processor.generateSummary(
        exitCode,
        violationCounts,
        errorCount,
        violationFiles,
        timestamp
    );
    console.log('');

    // Step 6: แสดงผลสรุป
    processor.displaySummary(violationCounts, totalViolations, errorCount, logger.sessionLogsDir);

    // Step 7: คำนวณและบันทึก performance
    const totalDuration = Date.now() - logger.startTime;
    logger.performance('TOTAL_SCAN_PROCESS', totalDuration, {
        totalViolations,
        errorCount,
        exitCode
    });

    // Step 8: แจ้งเตือนถ้ามีปัญหา
    if (totalViolations > 0 || errorCount > 0) {
        colorLog('[WARNING] Issues detected. Check the logs for details.', 'yellow');
        colorLog(`  Session directory: ${logger.sessionLogsDir}`, 'cyan');
        colorLog(`  Summary file: ${summaryFile}`, 'cyan');
        console.log('');
    }

    // Step 9: สรุปข้อมูล session
    colorLog('[OK] Scan completed successfully!', 'green');
    colorLog(`[INFO] Session folder: ${logger.sessionFolder}`, 'cyan');
    colorLog(`[INFO] Total execution time: ${totalDuration}ms`, 'cyan');
    console.log('');

    // Audit trail สิ้นสุด session
    logger.audit('SESSION_END', {
        totalDuration,
        totalViolations,
        errorCount,
        exitCode,
        sessionFolder: logger.sessionFolder
    });

    // Return exit code
    process.exit(exitCode);
}

// ============================================================================
// Execute if run directly
// ============================================================================

const isMainModule = import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;

if (isMainModule) {
    main();
}

export {
    ProfessionalScanLogger,
    ScanProcessor,
    main
};
