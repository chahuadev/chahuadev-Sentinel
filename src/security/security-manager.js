// ======================================================================
// Chahuadev Sentinel Security Manager
// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @description Advanced security management system for VS Code extension
// @security_level FORTRESS - Maximum Security Protection
// ======================================================================

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ======================================================================
// Security Error Classes - Custom Security Exceptions
// ======================================================================

class SecurityError extends Error {
    constructor(message, filePath = null, errorCode = 'SEC_001') {
        super(message);
        this.name = 'SecurityError';
        this.filePath = filePath;
        this.errorCode = errorCode;
        this.timestamp = new Date().toISOString();
        this.severity = 'HIGH';
    }
}

class PathTraversalError extends SecurityError {
    constructor(message, filePath = null) {
        super(message, filePath, 'PATH_001');
        this.name = 'PathTraversalError';
        this.severity = 'CRITICAL';
    }
}

class AccessDeniedError extends SecurityError {
    constructor(message, filePath = null) {
        super(message, filePath, 'ACCESS_001');
        this.name = 'AccessDeniedError';
        this.severity = 'HIGH';
    }
}

class FileValidationError extends SecurityError {
    constructor(message, filePath = null, validationDetails = null) {
        super(message, filePath, 'FILE_001');
        this.name = 'FileValidationError';
        this.validationDetails = validationDetails;
        this.severity = 'MEDIUM';
    }
}

class ReDoSError extends SecurityError {
    constructor(message, pattern = null, filePath = null) {
        super(message, filePath, 'REDOS_001');
        this.name = 'ReDoSError';
        this.pattern = pattern;
        this.severity = 'HIGH';
    }
}

class InputValidationError extends SecurityError {
    constructor(message, input = null) {
        super(message, null, 'INPUT_001');
        this.name = 'InputValidationError';
        this.input = input;
        this.severity = 'MEDIUM';
    }
}

// ======================================================================
// Security Configuration - Fortress Level Settings
// ======================================================================

const SECURITY_CONFIG = {
    // Path Security
    MAX_PATH_LENGTH: 260,
    FORBIDDEN_PATHS: [
        // Windows System Directories
        /^[A-Z]:\\Windows\\/i,
        /^[A-Z]:\\Program Files\\/i,
        /^[A-Z]:\\Program Files \(x86\)\\/i,
        /^[A-Z]:\\System Volume Information\\/i,
        // Linux/Unix System Directories  
        /^\/etc\//,
        /^\/usr\/bin\//,
        /^\/bin\//,
        /^\/sbin\//,
        /^\/root\//,
        /^\/boot\//,
        /^\/proc\//,
        /^\/sys\//,
        // macOS System Directories
        /^\/System\//,
        /^\/Library\//,
        // Common Sensitive Directories
        /node_modules/,
        /\.git/,
        /\.ssh/,
        /\.aws/,
        /\.config/
    ],
    
    // File Security
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_EXTENSIONS: [
        '.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css', '.scss', '.sass',
        '.py', '.java', '.cpp', '.c', '.cs', '.php', '.go', '.rs', '.rb', '.pl',
        '.sh', '.yml', '.yaml', '.xml', '.md', '.sql', '.lua', '.swift', '.kt'
    ],
    
    // Performance Security
    MAX_PROCESSING_TIME: 30000, // 30 seconds
    MAX_FILES_BATCH: 100,
    
    // ReDoS Protection
    ENABLE_REDOS_PROTECTION: true,
    MAX_REGEX_EXECUTION_TIME: 1000, // 1 second
    
    // Symlink Security
    ALLOW_SYMLINKS: false,
    MAX_SYMLINK_DEPTH: 3,
    
    // Input Validation
    DANGEROUS_CHARS_REGEX: /[<>"|?*\x00-\x1f]/,
    PATH_TRAVERSAL_REGEX: /\.\.[\\\/]/,
    
    // Rate Limiting
    MAX_REQUESTS_PER_MINUTE: 60,
    
    // Logging Security
    ENABLE_SECURITY_LOGGING: true,
    LOG_SENSITIVE_DATA: false
};

// ======================================================================
// Security Manager Class - Main Security Controller
// ======================================================================

class SecurityManager {
    constructor(options = {}) {
        // Merge configurations with deep merge for nested objects
        this.config = this.deepMergeConfig(SECURITY_CONFIG, options);
        this.securityLog = [];
        this.requestCounts = new Map();
        this.workingDirectory = process.cwd();
        this.startTime = Date.now();
        
        // Initialize security logging
        if (this.config.ENABLE_SECURITY_LOGGING) {
            this.initializeSecurityLogging();
        }
        
        this.logSecurityEvent('INIT', 'Security Manager initialized', { 
            pid: process.pid,
            configLevel: this.config.SECURITY_LEVEL || 'FORTRESS',
            workingDir: this.workingDirectory
        });
    }
    
    /**
     * Deep merge configuration objects
     */
    deepMergeConfig(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMergeConfig(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Core Security Validation Methods
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Comprehensive path security validation
     */
    validatePath(inputPath, operation = 'READ') {
        try {
            // Input type validation
            if (!inputPath || typeof inputPath !== 'string') {
                throw new InputValidationError('Invalid path input type', inputPath);
            }
            
            // Length validation
            if (inputPath.length > this.config.MAX_PATH_LENGTH) {
                throw new PathTraversalError(`Path too long: ${inputPath.length} characters`, inputPath);
            }
            
            // Dangerous characters check
            if (this.config.DANGEROUS_CHARS_REGEX.test(inputPath)) {
                throw new InputValidationError('Dangerous characters detected in path', inputPath);
            }
            
            // Path traversal protection
            if (this.config.PATH_TRAVERSAL_REGEX.test(inputPath)) {
                throw new PathTraversalError('Path traversal attempt detected', inputPath);
            }
            
            // Normalize and resolve path
            const normalizedPath = path.normalize(inputPath);
            const resolvedPath = path.resolve(normalizedPath);
            
            // Check forbidden paths
            this.checkForbiddenPaths(resolvedPath);
            
            // Working directory boundary check
            this.checkWorkingDirectoryBoundary(resolvedPath, operation);
            
            // File extension validation (for file operations)
            if (operation === 'WRITE' || operation === 'READ') {
                this.validateFileExtension(resolvedPath);
            }
            
            this.logSecurityEvent('PATH_VALIDATED', `Path validated successfully: ${operation}`, {
                originalPath: inputPath,
                resolvedPath: resolvedPath,
                operation
            });
            
            return resolvedPath;
            
        } catch (error) {
            this.logSecurityEvent('PATH_VIOLATION', error.message, {
                path: inputPath,
                operation,
                errorType: error.constructor.name
            });
            throw error;
        }
    }
    
    /**
     * File security validation (Enhanced with async operations)
     */
    async validateFile(filePath, operation = 'READ') {
        const validatedPath = this.validatePath(filePath, operation);
        
        try {
            // Check file existence using async operation
            let exists = false;
            let stats = null;
            
            try {
                stats = await fs.promises.stat(validatedPath);
                exists = true;
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw new FileValidationError(`File access error: ${error.message}`, validatedPath);
                }
                exists = false;
            }
            
            if (!exists && operation === 'READ') {
                throw new FileValidationError('File does not exist', validatedPath);
            }
            
            if (exists && stats) {
                // Symlink check
                if (stats.isSymbolicLink() && !this.config.ALLOW_SYMLINKS) {
                    throw new AccessDeniedError('Symbolic links are not allowed', validatedPath);
                }
                
                // File size check
                if (stats.size > this.config.MAX_FILE_SIZE) {
                    throw new FileValidationError(
                        `File too large: ${stats.size} bytes (max: ${this.config.MAX_FILE_SIZE})`,
                        validatedPath,
                        { fileSize: stats.size, maxSize: this.config.MAX_FILE_SIZE }
                    );
                }
                
                // Permission check (async)
                await this.checkFilePermissions(validatedPath, operation);
            }
            
            this.logSecurityEvent('FILE_VALIDATED', `File validated: ${operation}`, {
                filePath: validatedPath,
                operation,
                exists,
                fileSize: stats ? stats.size : 0
            });
            
            return validatedPath;
            
        } catch (error) {
            this.logSecurityEvent('FILE_VIOLATION', this.sanitizeLogMessage(error.message), {
                filePath: validatedPath,
                operation,
                errorType: error.constructor.name
            });
            throw error;
        }
    }
    
    /**
     * Safe regex execution with ReDoS protection
     */
    async safeRegexExecution(pattern, input, context = null) {
        if (!this.config.ENABLE_REDOS_PROTECTION) {
            try {
                return input.match(pattern);
            } catch (error) {
                return null;
            }
        }
        
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.logSecurityEvent('REDOS_DETECTED', 'Regex execution timeout', {
                    pattern: pattern.source,
                    context,
                    timeout: this.config.MAX_REGEX_EXECUTION_TIME
                });
                
                reject(new ReDoSError(
                    `Regex execution timeout (${this.config.MAX_REGEX_EXECUTION_TIME}ms)`,
                    pattern.source,
                    context
                ));
            }, this.config.MAX_REGEX_EXECUTION_TIME);
            
            try {
                const result = input.match(pattern);
                clearTimeout(timeout);
                resolve(result);
            } catch (error) {
                clearTimeout(timeout);
                reject(new ReDoSError(
                    `Regex execution error: ${error.message}`,
                    pattern.source,
                    context
                ));
            }
        });
    }
    
    /**
     * Rate limiting check
     */
    checkRateLimit(identifier = 'default') {
        const now = Date.now();
        const minute = Math.floor(now / 60000);
        const key = `${identifier}_${minute}`;
        
        const count = this.requestCounts.get(key) || 0;
        
        if (count >= this.config.MAX_REQUESTS_PER_MINUTE) {
            this.logSecurityEvent('RATE_LIMIT_EXCEEDED', 'Rate limit exceeded', {
                identifier,
                count,
                limit: this.config.MAX_REQUESTS_PER_MINUTE
            });
            
            throw new SecurityError(
                `Rate limit exceeded: ${count}/${this.config.MAX_REQUESTS_PER_MINUTE} requests per minute`,
                null,
                'RATE_001'
            );
        }
        
        this.requestCounts.set(key, count + 1);
        
        // Cleanup old entries
        for (const [oldKey] of this.requestCounts) {
            const oldMinute = parseInt(oldKey.split('_').pop());
            if (minute - oldMinute > 5) { // Keep last 5 minutes
                this.requestCounts.delete(oldKey);
            }
        }
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Helper Security Methods
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Check forbidden paths
     */
    checkForbiddenPaths(resolvedPath) {
        for (const forbiddenPattern of this.config.FORBIDDEN_PATHS) {
            if (forbiddenPattern.test(resolvedPath)) {
                throw new AccessDeniedError(
                    `Access denied to forbidden path: ${resolvedPath}`,
                    resolvedPath
                );
            }
        }
    }
    
    /**
     * Check working directory boundary
     */
    checkWorkingDirectoryBoundary(resolvedPath, operation) {
        // For write operations, ensure we stay within working directory
        if (operation === 'WRITE' && !resolvedPath.startsWith(this.workingDirectory)) {
            throw new AccessDeniedError(
                `Write operation outside working directory: ${resolvedPath}`,
                resolvedPath
            );
        }
    }
    
    /**
     * Validate file extension
     */
    validateFileExtension(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        
        if (ext && !this.config.ALLOWED_EXTENSIONS.includes(ext)) {
            throw new FileValidationError(
                `File extension not allowed: ${ext}`,
                filePath,
                { extension: ext, allowedExtensions: this.config.ALLOWED_EXTENSIONS }
            );
        }
    }
    
    /**
     * Check file permissions (Enhanced with async operations)
     */
    async checkFilePermissions(filePath, operation) {
        try {
            if (operation === 'READ') {
                await fs.promises.access(filePath, fs.constants.R_OK);
            } else if (operation === 'WRITE') {
                // Check if file exists and is writable, or if directory is writable
                try {
                    await fs.promises.access(filePath, fs.constants.F_OK);
                    // File exists, check write permission
                    await fs.promises.access(filePath, fs.constants.W_OK);
                } catch (error) {
                    if (error.code === 'ENOENT') {
                        // File doesn't exist, check directory write permission
                        await fs.promises.access(path.dirname(filePath), fs.constants.W_OK);
                    } else {
                        throw error;
                    }
                }
            }
        } catch (error) {
            throw new AccessDeniedError(
                `Permission denied for ${operation} operation: ${filePath}`,
                filePath
            );
        }
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Security Logging and Monitoring
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Initialize security logging
     */
    initializeSecurityLogging() {
        this.securityLogPath = path.join(this.workingDirectory, 'logs', 'security.log');
        
        // Ensure logs directory exists
        const logsDir = path.dirname(this.securityLogPath);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }
    
    /**
     * Log security events (Enhanced with message sanitization)
     */
    logSecurityEvent(type, message, details = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            type,
            message: this.sanitizeLogMessage(message),
            details: this.config.LOG_SENSITIVE_DATA ? details : this.sanitizeLogDetails(details),
            pid: process.pid,
            sessionId: this.generateSessionId()
        };
        
        this.securityLog.push(event);
        
        // Write to file if enabled (async to prevent blocking)
        if (this.config.ENABLE_SECURITY_LOGGING && this.securityLogPath) {
            try {
                const logEntry = JSON.stringify(event) + '\n';
                // Use async write to prevent blocking
                fs.promises.appendFile(this.securityLogPath, logEntry).catch(() => {
                    // Silent fail for logging to prevent recursion
                });
            } catch (error) {
                // Silent fail for logging to prevent recursion
            }
        }
        
        // Keep only last 1000 events in memory
        if (this.securityLog.length > 1000) {
            this.securityLog.shift();
        }
    }
    
    /**
     * Sanitize log messages to prevent log injection
     */
    sanitizeLogMessage(message) {
        if (typeof message !== 'string') {
            return String(message);
        }
        
        // Remove newlines, carriage returns and other control characters
        return message
            .replace(/\r?\n/g, ' ')  // Replace newlines with spaces
            .replace(/\r/g, ' ')     // Replace carriage returns
            .replace(/\t/g, ' ')     // Replace tabs
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
            .trim()                  // Remove leading/trailing whitespace
            .substring(0, 1000);     // Limit message length
    }
    
    /**
     * Sanitize log details to remove sensitive information
     */
    sanitizeLogDetails(details) {
        const sanitized = { ...details };
        
        // Remove or mask sensitive fields
        if (sanitized.filePath) {
            sanitized.filePath = this.maskSensitivePath(sanitized.filePath);
        }
        
        if (sanitized.path) {
            sanitized.path = this.maskSensitivePath(sanitized.path);
        }
        
        return sanitized;
    }
    
    /**
     * Mask sensitive parts of paths
     */
    maskSensitivePath(pathStr) {
        // Replace user directories with placeholders
        return pathStr
            .replace(/[A-Z]:\\Users\\[^\\]+/gi, '[USER_DIR]')
            .replace(/\/home\/[^\/]+/g, '[USER_DIR]')
            .replace(/\/Users\/[^\/]+/g, '[USER_DIR]');
    }
    
    /**
     * Generate session ID for tracking
     */
    generateSessionId() {
        if (!this.sessionId) {
            this.sessionId = crypto.randomBytes(8).toString('hex');
        }
        return this.sessionId;
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Security Status and Reporting
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Get security statistics
     */
    getSecurityStats() {
        const now = Date.now();
        const events = this.securityLog.filter(e => 
            now - new Date(e.timestamp).getTime() < 3600000 // Last hour
        );
        
        const violations = events.filter(e => 
            e.type.includes('VIOLATION') || e.type.includes('EXCEEDED') || e.type.includes('DETECTED')
        );
        
        return {
            uptime: now - this.startTime,
            totalEvents: this.securityLog.length,
            recentEvents: events.length,
            violations: violations.length,
            lastViolation: violations[violations.length - 1] || null,
            rateLimit: {
                currentMinute: Math.floor(now / 60000),
                requestCounts: Object.fromEntries(this.requestCounts)
            }
        };
    }
    
    /**
     * Generate security report
     */
    generateSecurityReport() {
        const stats = this.getSecurityStats();
        const config = {
            maxFileSize: this.config.MAX_FILE_SIZE,
            allowSymlinks: this.config.ALLOW_SYMLINKS,
            redosProtection: this.config.ENABLE_REDOS_PROTECTION,
            rateLimit: this.config.MAX_REQUESTS_PER_MINUTE
        };
        
        return {
            timestamp: new Date().toISOString(),
            securityLevel: 'FORTRESS',
            statistics: stats,
            configuration: config,
            recentViolations: this.securityLog
                .filter(e => e.type.includes('VIOLATION'))
                .slice(-10), // Last 10 violations
            status: stats.violations === 0 ? 'SECURE' : 'VIOLATIONS_DETECTED'
        };
    }
}

// ======================================================================
// Export Security Manager and Error Classes
// ======================================================================

export {
    SecurityManager,
    SecurityError,
    PathTraversalError,
    AccessDeniedError,
    FileValidationError,
    ReDoSError,
    InputValidationError,
    SECURITY_CONFIG
};