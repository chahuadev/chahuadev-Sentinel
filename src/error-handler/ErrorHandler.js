#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Centralized Error Handler
// ! ══════════════════════════════════════════════════════════════════════════════  
// ! ! NO_SILENT_FALLBACKS Compliance - "SILENCE IS A FORM OF DAMAGE"
 // ! ══════════════════════════════════════════════════════════════════════════════ 
// ! หลักการ:
// ! 1. ทุก Error ต้องถูกส่งมาที่นี่ (Single Point of Truth)
// ! 2. ทุก Error ต้องถูก Log (No Silent Failures)
// ! 3. ทุก Error ต้องมีการจัดประเภท (Operational vs Programming)
// ! 4. Error ที่เป็นบั๊ก (Non-Operational) ต้อง Crash Process ทันที
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Flow: Code → throw Error → ErrorHandler → Logger → Log File
// ! ══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { ERROR_HANDLER_CONFIG } from './error-handler-config.js';


// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════ Error Handler Class (Singleton)
// ! ══════════════════════════════════════════════════════════════════════════════
class ErrorHandler {
    constructor() {
        this.logDir = path.join(
            process.cwd(), 
            ERROR_HANDLER_CONFIG.LOG_BASE_DIR, 
            ERROR_HANDLER_CONFIG.LOG_ERROR_SUBDIR
        );
        this.errorLogPath = path.join(this.logDir, ERROR_HANDLER_CONFIG.LOG_FILENAME);
        this.criticalErrorPath = path.join(this.logDir, ERROR_HANDLER_CONFIG.LOG_CRITICAL_FILENAME);
        
        // สร้างโฟลเดอร์ logs ถ้ายังไม่มี
        this.initializeLogDirectory();
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! สร้างโฟลเดอร์สำหรับบันทึก Error
    // ! ══════════════════════════════════════════════════════════════════════════════
    initializeLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! ฟังก์ชันหลักในการจัดการ Error
    // ! NO_SILENT_FALLBACKS: ทุก Error ต้องถูก Log และจัดการ
    // ! ══════════════════════════════════════════════════════════════════════════════
    handleError(error, context = {}) {
        try {
            // 1. จัดประเภท Error
            const errorInfo = this.categorizeError(error, context);
            
            // 2. บันทึกลง Log ทันที
            this.logError(errorInfo);
            
            // 3. ตัดสินใจว่าจะปิด Process หรือไม่
            this.decideProcessFate(errorInfo);
            
            // 4. แจ้งเตือนถ้าเป็น Critical Error
            if (errorInfo.isCritical) {
                this.alertCriticalError(errorInfo);
            }
            
            return errorInfo;
            
        } catch (handlerError) {
            // ถ้า Error Handler เองมีปัญหา ต้อง Log ออก stderr ทันที
            console.error(ERROR_HANDLER_CONFIG.MSG_ERROR_HANDLER_FAILURE);
            console.error(ERROR_HANDLER_CONFIG.MSG_ORIGINAL_ERROR, error);
            console.error(ERROR_HANDLER_CONFIG.MSG_HANDLER_ERROR, handlerError);
            
            // Force crash เพราะระบบ Error Handling พัง
            process.exit(ERROR_HANDLER_CONFIG.FORCE_EXIT_CODE);
        }
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! จัดประเภท Error เพื่อให้รู้ว่าจะจัดการอย่างไร
    // ! NO_SILENT_FALLBACKS: ใช้ explicit checks แทน || operators
    // ! ══════════════════════════════════════════════════════════════════════════════
    categorizeError(error, context) {
        const now = new Date();
        
        // ตรวจสอบว่าเป็น Error ที่เรารู้จักหรือไม่
        const isKnownError = error.name && error.isOperational !== undefined;
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.name
        let errorName;
        if (error.name) {
            errorName = error.name;
        } else {
            console.warn(ERROR_HANDLER_CONFIG.MSG_MISSING_NAME);
            errorName = ERROR_HANDLER_CONFIG.DEFAULT_ERROR_NAME;
        }
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.message
        let errorMessage;
        if (error.message) {
            errorMessage = error.message;
        } else {
            console.warn(ERROR_HANDLER_CONFIG.MSG_MISSING_MESSAGE);
            errorMessage = ERROR_HANDLER_CONFIG.DEFAULT_ERROR_MESSAGE;
        }
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.stack
        let errorStack;
        if (error.stack) {
            errorStack = error.stack;
        } else {
            console.warn(ERROR_HANDLER_CONFIG.MSG_MISSING_STACK);
            errorStack = ERROR_HANDLER_CONFIG.DEFAULT_ERROR_STACK;
        }
        
        // ! NO_HARDCODE: ตรวจสอบและจัดการ error.statusCode
        let statusCode;
        if (error.statusCode) {
            statusCode = error.statusCode;
        } else {
            statusCode = ERROR_HANDLER_CONFIG.DEFAULT_STATUS_CODE;
        }
        
        // ! NO_HARDCODE: ตรวจสอบและจัดการ error.errorCode
        let errorCode;
        if (error.errorCode) {
            errorCode = error.errorCode;
        } else {
            errorCode = ERROR_HANDLER_CONFIG.DEFAULT_ERROR_CODE;
        }
        
        // ! NO_HARDCODE: ตรวจสอบและจัดการ error.severity
        let severity;
        if (error.severity) {
            severity = error.severity;
        } else {
            if (error.isOperational) {
                severity = ERROR_HANDLER_CONFIG.SEVERITY_MEDIUM;
            } else {
                severity = ERROR_HANDLER_CONFIG.SEVERITY_CRITICAL;
            }
        }
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.filePath
        let filePath;
        if (error.filePath) {
            filePath = error.filePath;
        } else {
            filePath = null;
        }
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.details
        let details;
        if (error.details) {
            details = error.details;
        } else {
            details = {};
        }
        
        return {
            // เวลาและบริบท
            timestamp: now.toISOString(),
            timestampLocal: now.toLocaleString('th-TH'),
            processId: process.pid,
            context: context,
            
            // ข้อมูล Error
            name: errorName,
            message: errorMessage,
            stack: errorStack,
            
            // การจัดประเภท
            isOperational: error.isOperational === true, // คาดเดาได้หรือไม่
            isKnownError: isKnownError, // เป็น Error ที่เราสร้างขึ้นมาเองหรือไม่
            isCritical: !error.isOperational, // Critical = ไม่คาดเดา
            
            // ข้อมูลเพิ่มเติม
            statusCode: statusCode,
            errorCode: errorCode,
            severity: severity,
            
            // สำหรับ Security Errors
            filePath: filePath,
            details: details
        };
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! บันทึก Error ลง Log File
    // ! ! NO_SILENT_FALLBACKS: ใช้ appendFileSync เพื่อให้แน่ใจว่า Log ถูกเขียนทันที
    // ! ══════════════════════════════════════════════════════════════════════════════
    logError(errorInfo) {
        // สร้าง Log Entry แบบ JSON
        const logEntry = {
            timestamp: errorInfo.timestamp,
            level: 'ERROR',
            severity: errorInfo.severity,
            name: errorInfo.name,
            message: errorInfo.message,
            isOperational: errorInfo.isOperational,
            isCritical: errorInfo.isCritical,
            statusCode: errorInfo.statusCode,
            errorCode: errorInfo.errorCode,
            context: errorInfo.context,
            stack: errorInfo.stack
        };
        
        const logString = JSON.stringify(logEntry, null, 2) + '\n' + ERROR_HANDLER_CONFIG.LOG_SEPARATOR + '\n';
        
        // ! 1. แสดงใน Console
        console.error('\n' + ERROR_HANDLER_CONFIG.LOG_SEPARATOR);
        console.error(ERROR_HANDLER_CONFIG.MSG_ERROR_CAUGHT);
        console.error(ERROR_HANDLER_CONFIG.LOG_SEPARATOR);
        console.error(`Time: ${errorInfo.timestampLocal}`);
        console.error(`Name: ${errorInfo.name}`);
        console.error(`Message: ${errorInfo.message}`);
        console.error(`Operational: ${errorInfo.isOperational}`);
        console.error(`Critical: ${errorInfo.isCritical}`);
        console.error(`Severity: ${errorInfo.severity}`);
        console.error(ERROR_HANDLER_CONFIG.LOG_SEPARATOR + '\n');
        
        // ! 2. เขียนลง Log File (ใช้ Sync เพื่อให้แน่ใจว่าถูกเขียนก่อน Process อาจจะ Crash)
        try {
            fs.appendFileSync(this.errorLogPath, logString);
            
            // ! 3. ถ้าเป็น Critical Error เขียนลงไฟล์พิเศษด้วย
            if (errorInfo.isCritical) {
                const criticalLog = `${ERROR_HANDLER_CONFIG.LOG_WARNING_PREFIX.repeat(ERROR_HANDLER_CONFIG.LOG_WARNING_REPEAT)}\n` +
                                   `CRITICAL ERROR DETECTED\n` +
                                   `${ERROR_HANDLER_CONFIG.LOG_WARNING_PREFIX.repeat(ERROR_HANDLER_CONFIG.LOG_WARNING_REPEAT)}\n` +
                                   logString;
                fs.appendFileSync(this.criticalErrorPath, criticalLog);
            }
        } catch (writeError) {
            // ! ถ้าเขียน Log File ไม่ได้ ต้องแสดงใน Console
            console.error(ERROR_HANDLER_CONFIG.MSG_LOG_WRITE_FAILURE, writeError.message);
            console.error('Original error that could not be logged:', errorInfo);
        }
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! ตัดสินใจว่าจะปิด Process หรือไม่
    // !  NO_SILENT_FALLBACKS: Error ที่เป็นบั๊กต้อง Crash ทันที
    // ! ══════════════════════════════════════════════════════════════════════════════
    decideProcessFate(errorInfo) {
        if (errorInfo.isCritical) {
            console.error('\n' + ERROR_HANDLER_CONFIG.MSG_CRITICAL_DETECTED);
            console.error('This is a non-operational error (likely a bug).');
            console.error('Application will shut down to prevent data corruption.');
            console.error('Process Manager (PM2/systemd) should restart the application.');
            console.error('\nShutting down in 1 second...\n');
            
            // ให้เวลา 1 วินาที สำหรับ Log ถูกเขียนเสร็จ
            setTimeout(() => {
                process.exit(ERROR_HANDLER_CONFIG.FORCE_EXIT_CODE);
            }, ERROR_HANDLER_CONFIG.SHUTDOWN_DELAY_MS);
        }
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! แจ้งเตือน Critical Error (สามารถเชื่อมต่อกับ Monitoring Service)
     // ! ══════════════════════════════════════════════════════════════════════════════
    alertCriticalError(errorInfo) {
        // ! ในอนาคตสามารถส่งไปที่:
        // ! - Slack/Discord Webhook
        // ! - Email
        // ! - SMS
        // ! - PagerDuty
        // ! - Sentry.io

        const alertMessage = `
${ERROR_HANDLER_CONFIG.MSG_CRITICAL_ALERT}
Time: ${errorInfo.timestampLocal}
Name: ${errorInfo.name}
Message: ${errorInfo.message}
Process: ${errorInfo.processId}

This error requires immediate attention!
        `.trim();
        
        console.error(alertMessage);
        
        // TODO: ส่ง alert ไปยัง monitoring service
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! ตรวจสอบว่า Error นี้เป็น Trusted Error หรือไม่
     // ! ══════════════════════════════════════════════════════════════════════════════
    isTrustedError(error) {
        return error.isOperational === true;
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! สร้าง Error Report สำหรับดูภาพรวม
     // ! ══════════════════════════════════════════════════════════════════════════════
    async generateErrorReport() {
        try {
            if (!fs.existsSync(this.errorLogPath)) {
                return {
                    totalErrors: 0,
                    criticalErrors: 0,
                    operationalErrors: 0,
                    message: ERROR_HANDLER_CONFIG.REPORT_NO_ERRORS
                };
            }
            
            const content = fs.readFileSync(this.errorLogPath, 'utf-8');
            const errors = content.split(ERROR_HANDLER_CONFIG.LOG_SEPARATOR).filter(e => e.trim());
            
            const critical = errors.filter(e => e.includes('"isCritical": true')).length;
            const operational = errors.filter(e => e.includes('"isOperational": true')).length;
            
            return {
                totalErrors: errors.length,
                criticalErrors: critical,
                operationalErrors: operational,
                nonOperationalErrors: errors.length - operational,
                logFilePath: this.errorLogPath,
                criticalLogPath: this.criticalErrorPath
            };
        } catch (error) {
            console.error('Failed to generate error report:', error.message);
            throw error;
        }
    }
}

// ! Export Singleton Instance
const errorHandler = new ErrorHandler();

 // ! ══════════════════════════════════════════════════════════════════════════════
 // ! Setup Global Error Handlers
 // ! NO_SILENT_FALLBACKS: ดักจับ Error ที่หลุดลอดมาได้ทุกอัน
 // ! ══════════════════════════════════════════════════════════════════════════════
export function setupGlobalErrorHandlers() {
    // ! 1. Uncaught Exception (Synchronous errors)
    process.on('uncaughtException', (error) => {
        console.error('\nUNCAUGHT EXCEPTION DETECTED');
        errorHandler.handleError(error, {
            type: 'UNCAUGHT_EXCEPTION',
            fatal: true
        });
        // ! handleError จะจัดการการปิด Process เอง
    });
    
    // ! 2. Unhandled Promise Rejection (Async errors)
    process.on('unhandledRejection', (reason, promise) => {
        console.error('\nUNHANDLED PROMISE REJECTION DETECTED');
        
        // reason อาจไม่ใช่ Error object
        const error = reason instanceof Error ? reason : new Error(String(reason));
        error.isOperational = false; // Promise Rejection ที่ไม่ถูก Handle คือบั๊ก
        
        errorHandler.handleError(error, {
            type: 'UNHANDLED_REJECTION',
            promise: promise.toString(),
            fatal: true
        });
    });
    
    // ! 3. Process Warning (สำหรับ deprecation warnings)
    process.on('warning', (warning) => {
        console.warn('\nPROCESS WARNING');
        console.warn(warning.name);
        console.warn(warning.message);
        console.warn(warning.stack);
        
        // Warning ไม่ Fatal แต่ควร Log ไว้
        const warningError = new Error(warning.message);
        warningError.name = warning.name;
        warningError.isOperational = true; // Warning ไม่ใช่ Error ที่ต้อง Crash
        
        errorHandler.handleError(warningError, {
            type: 'PROCESS_WARNING',
            fatal: false
        });
    });
    
    console.log('Global error handlers initialized');
}

export default errorHandler;
