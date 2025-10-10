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
    STATUS_CODE_BAD_REQUEST: 400,
    STATUS_CODE_UNAUTHORIZED: 401,
    STATUS_CODE_FORBIDDEN: 403,
    STATUS_CODE_NOT_FOUND: 404,
    STATUS_CODE_TIMEOUT: 408,
    STATUS_CODE_TOO_MANY_REQUESTS: 429,
    STATUS_CODE_INTERNAL_ERROR: 500,
    STATUS_CODE_SERVICE_UNAVAILABLE: 503,
    
    // Error Codes - Application Errors
    DEFAULT_ERROR_CODE: 'UNKNOWN',
    ERROR_CODE_APP_INIT_FAILED: 'APP_INIT_FAILED',
    ERROR_CODE_CONFIG_INVALID: 'CONFIG_INVALID',
    ERROR_CODE_MODULE_LOAD_FAILED: 'MODULE_LOAD_FAILED',
    
    // Error Codes - File System Errors
    ERROR_CODE_FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    ERROR_CODE_FILE_READ_FAILED: 'FILE_READ_FAILED',
    ERROR_CODE_FILE_WRITE_FAILED: 'FILE_WRITE_FAILED',
    ERROR_CODE_DIR_CREATE_FAILED: 'DIR_CREATE_FAILED',
    ERROR_CODE_PERMISSION_DENIED: 'PERMISSION_DENIED',
    
    // Error Codes - Security Errors
    ERROR_CODE_SECURITY_VIOLATION: 'SECURITY_VIOLATION',
    ERROR_CODE_RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    ERROR_CODE_INVALID_INPUT: 'INVALID_INPUT',
    ERROR_CODE_INJECTION_ATTEMPT: 'INJECTION_ATTEMPT',
    ERROR_CODE_PATH_TRAVERSAL: 'PATH_TRAVERSAL',
    ERROR_CODE_SUSPICIOUS_PATTERN: 'SUSPICIOUS_PATTERN',
    
    // Error Codes - Validation Errors
    ERROR_CODE_VALIDATION_FAILED: 'VALIDATION_FAILED',
    ERROR_CODE_SCHEMA_INVALID: 'SCHEMA_INVALID',
    ERROR_CODE_TYPE_MISMATCH: 'TYPE_MISMATCH',
    ERROR_CODE_REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
    
    // Error Codes - Network Errors
    ERROR_CODE_NETWORK_ERROR: 'NETWORK_ERROR',
    ERROR_CODE_TIMEOUT: 'TIMEOUT',
    ERROR_CODE_CONNECTION_REFUSED: 'CONNECTION_REFUSED',
    ERROR_CODE_DNS_LOOKUP_FAILED: 'DNS_LOOKUP_FAILED',
    
    // Error Codes - Business Logic Errors
    ERROR_CODE_BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
    ERROR_CODE_INVALID_STATE: 'INVALID_STATE',
    ERROR_CODE_RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    ERROR_CODE_OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
    
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
    REPORT_NO_ERRORS: 'No errors logged yet',
    
    // Error Categories (สำหรับจัดกลุ่ม Error)
    CATEGORY_OPERATIONAL: 'OPERATIONAL',
    CATEGORY_PROGRAMMER: 'PROGRAMMER',
    CATEGORY_SYSTEM: 'SYSTEM',
    CATEGORY_EXTERNAL: 'EXTERNAL',
    CATEGORY_SECURITY: 'SECURITY',
    CATEGORY_VALIDATION: 'VALIDATION',
    CATEGORY_BUSINESS: 'BUSINESS',
    
    // Error Type Mapping (แมป Error types กับ categories และ severity)
    ERROR_TYPE_MAPPING: {
        // Operational Errors (คาดเดาได้)
        'ValidationError': { category: 'OPERATIONAL', severity: 'MEDIUM', isOperational: true },
        'InputError': { category: 'OPERATIONAL', severity: 'MEDIUM', isOperational: true },
        'NotFoundError': { category: 'OPERATIONAL', severity: 'LOW', isOperational: true },
        'TimeoutError': { category: 'OPERATIONAL', severity: 'MEDIUM', isOperational: true },
        'RateLimitError': { category: 'OPERATIONAL', severity: 'MEDIUM', isOperational: true },
        'UnauthorizedError': { category: 'OPERATIONAL', severity: 'MEDIUM', isOperational: true },
        'ForbiddenError': { category: 'OPERATIONAL', severity: 'MEDIUM', isOperational: true },
        
        // Security Errors (Critical - Operational)
        'SecurityViolationError': { category: 'SECURITY', severity: 'CRITICAL', isOperational: true },
        'InjectionAttemptError': { category: 'SECURITY', severity: 'CRITICAL', isOperational: true },
        'PathTraversalError': { category: 'SECURITY', severity: 'CRITICAL', isOperational: true },
        'SuspiciousPatternError': { category: 'SECURITY', severity: 'HIGH', isOperational: true },
        
        // System Errors (Programming Bugs - Non-Operational)
        'Error': { category: 'PROGRAMMER', severity: 'HIGH', isOperational: false },
        'ReferenceError': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false },
        'TypeError': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false },
        'SyntaxError': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false },
        'RangeError': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false },
        'URIError': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false },
        'EvalError': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false },
        
        // Async Errors
        'UnhandledPromiseRejection': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false },
        'PromiseRejectionError': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false },
        
        // External Service Errors (Operational)
        'NetworkError': { category: 'EXTERNAL', severity: 'MEDIUM', isOperational: true },
        'APIError': { category: 'EXTERNAL', severity: 'MEDIUM', isOperational: true },
        'ServiceUnavailableError': { category: 'EXTERNAL', severity: 'HIGH', isOperational: true },
        'RequestError': { category: 'EXTERNAL', severity: 'MEDIUM', isOperational: true },
        'ResponseError': { category: 'EXTERNAL', severity: 'MEDIUM', isOperational: true },
        
        // File System Errors (System)
        'ENOENT': { category: 'SYSTEM', severity: 'HIGH', isOperational: true },
        'EACCES': { category: 'SYSTEM', severity: 'HIGH', isOperational: true },
        'EPERM': { category: 'SYSTEM', severity: 'HIGH', isOperational: true },
        'EMFILE': { category: 'SYSTEM', severity: 'CRITICAL', isOperational: false },
        'ENOTDIR': { category: 'SYSTEM', severity: 'HIGH', isOperational: true },
        'EISDIR': { category: 'SYSTEM', severity: 'HIGH', isOperational: true },
        'EEXIST': { category: 'SYSTEM', severity: 'MEDIUM', isOperational: true },
        
        // Business Logic Errors (Operational)
        'BusinessRuleViolation': { category: 'BUSINESS', severity: 'MEDIUM', isOperational: true },
        'InvalidStateError': { category: 'BUSINESS', severity: 'MEDIUM', isOperational: true },
        'ConflictError': { category: 'BUSINESS', severity: 'MEDIUM', isOperational: true },
        'DuplicateError': { category: 'BUSINESS', severity: 'MEDIUM', isOperational: true },
        
        // Database Errors
        'DatabaseError': { category: 'SYSTEM', severity: 'HIGH', isOperational: true },
        'QueryError': { category: 'SYSTEM', severity: 'HIGH', isOperational: true },
        'ConnectionError': { category: 'SYSTEM', severity: 'CRITICAL', isOperational: true },
        
        // Assertion Errors
        'AssertionError': { category: 'PROGRAMMER', severity: 'CRITICAL', isOperational: false }
    }
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

/**
 * Get error category, severity และ isOperational โดยใช้ error name
 * @param {string} errorName - Error name/type
 * @returns {Object} { category, severity, isOperational }
 */
export function getErrorMetadata(errorName) {
    if (ERROR_HANDLER_CONFIG.ERROR_TYPE_MAPPING[errorName]) {
        return ERROR_HANDLER_CONFIG.ERROR_TYPE_MAPPING[errorName];
    }
    
    // Default: Unknown errors คือ Programming Bugs (Non-Operational)
    return {
        category: ERROR_HANDLER_CONFIG.CATEGORY_PROGRAMMER,
        severity: ERROR_HANDLER_CONFIG.SEVERITY_CRITICAL,
        isOperational: false
    };
}

/**
 * ตรวจสอบว่า error type เป็น operational error หรือไม่
 * @param {string} errorName - Error name/type
 * @returns {boolean}
 */
export function isOperationalError(errorName) {
    const metadata = getErrorMetadata(errorName);
    return metadata.isOperational === true;
}

/**
 * Get HTTP status code for error type
 * @param {string} errorName - Error name/type
 * @returns {number} HTTP status code
 */
export function getStatusCodeForError(errorName) {
    const mapping = {
        'ValidationError': ERROR_HANDLER_CONFIG.STATUS_CODE_BAD_REQUEST,
        'NotFoundError': ERROR_HANDLER_CONFIG.STATUS_CODE_NOT_FOUND,
        'UnauthorizedError': ERROR_HANDLER_CONFIG.STATUS_CODE_UNAUTHORIZED,
        'ForbiddenError': ERROR_HANDLER_CONFIG.STATUS_CODE_FORBIDDEN,
        'TimeoutError': ERROR_HANDLER_CONFIG.STATUS_CODE_TIMEOUT,
        'RateLimitError': ERROR_HANDLER_CONFIG.STATUS_CODE_TOO_MANY_REQUESTS,
        'ServiceUnavailableError': ERROR_HANDLER_CONFIG.STATUS_CODE_SERVICE_UNAVAILABLE
    };
    
    return mapping[errorName] || ERROR_HANDLER_CONFIG.DEFAULT_STATUS_CODE;
}

export default ERROR_HANDLER_CONFIG;
