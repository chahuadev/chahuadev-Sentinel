#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Error Handler Configuration
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ! NO_HARDCODE Compliance - "ALL CONSTANTS MUST BE EXTERNALIZED"
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * Error Handler Configuration Object
 * ค่าคงที่ทั้งหมดที่ใช้ใน ErrorHandler
 */
export const ERROR_HANDLER_CONFIG = {
    // Log Directory Configuration
    LOG_BASE_DIR: 'logs',
    LOG_ERROR_SUBDIR: 'errors',
    LOG_FILENAME: 'centralized-errors.log',
    LOG_CRITICAL_FILENAME: 'critical-errors.log',
    
    // Default Error Values
    DEFAULT_ERROR_NAME: 'UnknownError',
    DEFAULT_ERROR_MESSAGE: 'An unknown error occurred',
    DEFAULT_ERROR_STACK: 'No stack trace available',
    
    // HTTP Status Codes
    DEFAULT_STATUS_CODE: 500,
    
    // Error Codes
    DEFAULT_ERROR_CODE: 'UNKNOWN',
    
    // Severity Levels
    SEVERITY_LOW: 'LOW',
    SEVERITY_MEDIUM: 'MEDIUM',
    SEVERITY_HIGH: 'HIGH',
    SEVERITY_CRITICAL: 'CRITICAL',
    
    // Process Management
    SHUTDOWN_DELAY_MS: 1000,
    FORCE_EXIT_CODE: 1,
    
    // Log Formatting
    LOG_SEPARATOR: '='.repeat(80),
    LOG_WARNING_PREFIX: '!!! ',
    LOG_WARNING_REPEAT: 20,
    
    // Console Messages
    MSG_ERROR_HANDLER_FAILURE: '[ERROR HANDLER FAILURE] Critical: Error handler itself failed!',
    MSG_ORIGINAL_ERROR: 'Original Error:',
    MSG_HANDLER_ERROR: 'Handler Error:',
    MSG_ERROR_CAUGHT: 'ERROR CAUGHT BY CENTRALIZED HANDLER',
    MSG_CRITICAL_DETECTED: '*** CRITICAL ERROR DETECTED ***',
    MSG_CRITICAL_ALERT: '!!! CRITICAL ERROR ALERT !!!',
    MSG_UNCAUGHT_EXCEPTION: '[X] UNCAUGHT EXCEPTION DETECTED [X]',
    MSG_UNHANDLED_REJECTION: '[X] UNHANDLED PROMISE REJECTION DETECTED [X]',
    MSG_PROCESS_WARNING: '[!] PROCESS WARNING [!]',
    MSG_HANDLERS_INITIALIZED: '[OK] Global error handlers initialized',
    MSG_LOG_WRITE_FAILURE: '[LOG WRITE FAILURE] Failed to write error log:',
    MSG_MISSING_NAME: '[ERROR HANDLER] Error object missing name property',
    MSG_MISSING_MESSAGE: '[ERROR HANDLER] Error object missing message property',
    MSG_MISSING_STACK: '[ERROR HANDLER] Error object missing stack trace',
    
    // Error Report
    REPORT_NO_ERRORS: 'No errors logged yet'
};

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
export function getErrorHandlerConfig(key) {
    if (!ERROR_HANDLER_CONFIG.hasOwnProperty(key)) {
        throw new Error(`Invalid error handler config key: ${key}`);
    }
    return ERROR_HANDLER_CONFIG[key];
}

export default ERROR_HANDLER_CONFIG;
