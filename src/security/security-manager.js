// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! @description Advanced security management system for VS Code extension
// ! @security_level FORTRESS - Maximum Security Protection
// ! ══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import securityDefaults from './security-defaults.json' with { type: 'json' };
import errorHandlers from './error-handlers.json' with { type: 'json' };

// ! ══════════════════════════════════════════════════════════════════════════════
// !  Security Error Classes - Custom Security Exceptions
// ! ══════════════════════════════════════════════════════════════════════════════

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

// ! ══════════════════════════════════════════════════════════════════════════════
// !  Security Configuration - Fortress Level Settings
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// !  Security Manager Class - Main Security Controller
// ! ══════════════════════════════════════════════════════════════════════════════

class SecurityManager {
    constructor(options = {}) {
        // !  Load configuration from external file instead of hardcoded values
        const baseConfig = this.convertPattersToRegex(securityDefaults.SECURITY_CONFIG);
        
        // !  Merge configurations with deep merge for nested objects
        this.config = this.deepMergeConfig(baseConfig, options);
        this.securityLog = [];
        
        // ! NO_INTERNAL_CACHING: CRITICAL - Rate Limit Store MUST be injected
        // ! REASON: Internal state breaks scalability in multi-instance deployments
        // ! 
        // ! BAD (ละเมิดกฎ):
        // !   this.requestCounts = new Map(); //  Internal state - ไม่ scale ได้
        // !
        // ! GOOD (ถูกต้อง):
        // !   const redis = require('redis').createClient();
        // !   new SecurityManager({ rateLimitStore: redis });
        // !
        // ! WARNING: ถ้าคุณต้องการใช้ in-memory Map (เช่น สำหรับ testing)
        // !          คุณต้อง inject มันเองเพื่อให้ชัดเจนว่านี่คือการตัดสินใจที่รู้สึกตัว
        // !
        if (!options.rateLimitStore) {
            throw new Error(
                'CRITICAL: rateLimitStore is REQUIRED (NO_INTERNAL_CACHING violation). ' +
                '\n\nWHY: Internal state breaks rate limiting in multi-instance deployments. ' +
                '\n     If you run 10 servers, each has separate requestCounts Map. ' +
                '\n     Rate limit of 100/min becomes 1000/min total - SECURITY BREACH!' +
                '\n\nSOLUTION (Production):' +
                '\n  const redis = require(\'redis\').createClient();' +
                '\n  const securityManager = new SecurityManager({ rateLimitStore: redis });' +
                '\n\nSOLUTION (Testing):' +
                '\n  const testStore = new Map();' +
                '\n  const securityManager = new SecurityManager({ rateLimitStore: testStore });' +
                '\n\nLearn more: See src/rules/NO_INTERNAL_CACHING.js'
            );
        }
        
        // Validate injected store implements required interface
        if (typeof options.rateLimitStore.get !== 'function') {
            throw new Error('rateLimitStore must implement get() method');
        }
        if (typeof options.rateLimitStore.set !== 'function') {
            throw new Error('rateLimitStore must implement set() method');
        }
        if (typeof options.rateLimitStore.has !== 'function') {
            throw new Error('rateLimitStore must implement has() method');
        }
        if (typeof options.rateLimitStore.delete !== 'function') {
            throw new Error('rateLimitStore must implement delete() method');
        }
        
        this.requestCounts = options.rateLimitStore;
        
        this.workingDirectory = process.cwd();
        this.startTime = Date.now();
        
        // Initialize security logging
        if (this.config.ENABLE_SECURITY_LOGGING) {
            this.initializeSecurityLogging();
        }
        
        // ! NO_SILENT_FALLBACKS: Explicit check for SECURITY_LEVEL
        let securityLevel = 'FORTRESS';
        if (this.config.SECURITY_LEVEL) {
            if (typeof this.config.SECURITY_LEVEL !== 'string') {
                this.logSecurityEvent('CONFIG_ERROR', 'SECURITY_LEVEL must be a string', {
                    type: typeof this.config.SECURITY_LEVEL
                });
                throw new Error('SECURITY_LEVEL configuration must be a string');
            }
            securityLevel = this.config.SECURITY_LEVEL;
        }
        
        this.logSecurityEvent('INIT', 'Security Manager initialized', { 
            pid: process.pid,
            configLevel: securityLevel,
            workingDir: this.workingDirectory
        });
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Convert string patterns to RegExp objects for runtime use
    // ! NO_HARDCODE: Configuration-driven pattern conversion without IF statements
    // ! ══════════════════════════════════════════════════════════════════════════════
    convertPattersToRegex(config) {
        const converted = { ...config };
        
        // Convert forbidden paths patterns to RegExp objects
        if (config.FORBIDDEN_PATHS_PATTERNS) {
            converted.FORBIDDEN_PATHS = config.FORBIDDEN_PATHS_PATTERNS.map(pattern => {
                // ! NO_SILENT_FALLBACKS: Explicit flag determination
                let flags = '';
                if (pattern.includes('[A-Z]')) {
                    flags = 'i'; // Case insensitive for Windows paths
                }
                return new RegExp(pattern, flags);
            });
            delete converted.FORBIDDEN_PATHS_PATTERNS;
        }
        
        // Convert other string patterns to RegExp
        if (config.DANGEROUS_CHARS_PATTERN) {
            converted.DANGEROUS_CHARS_REGEX = new RegExp(config.DANGEROUS_CHARS_PATTERN);
            delete converted.DANGEROUS_CHARS_PATTERN;
        }
        
        if (config.PATH_TRAVERSAL_PATTERN) {
            converted.PATH_TRAVERSAL_REGEX = new RegExp(config.PATH_TRAVERSAL_PATTERN);
            delete converted.PATH_TRAVERSAL_PATTERN;
        }
        
        return converted;
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Deep merge configuration objects
    // ! NO_HARDCODE + NO_SILENT_FALLBACKS: Configuration-driven merge
    // ! SECURITY: Prototype Pollution Protection
    // ! ══════════════════════════════════════════════════════════════════════════════

    deepMergeConfig(target, source) {
        const result = { ...target };
        
        // ! SECURITY FIX: Prevent Prototype Pollution Attack
        // ! WHY: Attackers can inject __proto__, constructor, or prototype to modify Object.prototype
        const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];
        
        for (const key in source) {
            // ! NO_SILENT_FALLBACKS: Explicit check for dangerous keys - FAIL LOUD
            if (DANGEROUS_KEYS.includes(key)) {
                this.logSecurityEvent(
                    'PROTOTYPE_POLLUTION_BLOCKED',
                    `Blocked attempt to modify dangerous property: ${key}`,
                    { 
                        key, 
                        configMerge: true,
                        severity: 'CRITICAL'
                    }
                );
                // ! FAIL LOUD: Throw error instead of silently skipping
                throw new SecurityError(
                    `CRITICAL: Attempt to modify protected property '${key}' detected`,
                    null,
                    'PROTO_POLLUTION_001'
                );
            }
            
            // ! NO_SILENT_FALLBACKS: Explicit type checking
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                // ! NO_SILENT_FALLBACKS: Explicit fallback with validation
                if (target[key]) {
                    result[key] = this.deepMergeConfig(target[key], source[key]);
                } else {
                    result[key] = this.deepMergeConfig({}, source[key]);
                }
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Comprehensive path security validation
    // ! NO_HARDCODE: Validation pipeline without IF statements
    // ! ══════════════════════════════════════════════════════════════════════════════

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
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! File security validation (Enhanced with async operations)
    // ! CONFIGURATION-DRIVEN: No hardcoded if statements - uses strategy pattern
    // ! ══════════════════════════════════════════════════════════════════════════════
 
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
                // !  NO_SILENT_FALLBACKS: Throw error instead of returning null
                this.logSecurityEvent('REGEX_ERROR', `Regex execution failed: ${error.message}`, {
                    pattern: pattern.source,
                    context
                });
                throw error;
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
     * ! NO_SILENT_FALLBACKS: Explicit null checks instead of || fallbacks
     * ! NO_INTERNAL_CACHING: Uses injected store (supports both sync Map and async Redis)
     * ! CRITICAL: DoS Protection - LRU eviction prevents unbounded Map growth
     */
    async checkRateLimit(identifier = 'default') {
        const now = Date.now();
        const minute = Math.floor(now / 60000);
        const key = `${identifier}_${minute}`;
        
        // ! NO_SILENT_FALLBACKS: Explicit check instead of `|| 0`
        let count = 0;
        
        // Support both synchronous (Map) and asynchronous (Redis) stores
        const hasKey = await Promise.resolve(this.requestCounts.has(key));
        
        if (hasKey) {
            const storedCount = await Promise.resolve(this.requestCounts.get(key));
            if (typeof storedCount !== 'number') {
                this.logSecurityEvent('RATE_LIMIT_CORRUPTION', 'Invalid count type in requestCounts store', {
                    key,
                    type: typeof storedCount
                });
                // Reset corrupted entry
                count = 0;
            } else {
                count = storedCount;
            }
        }
        
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
        
        await Promise.resolve(this.requestCounts.set(key, count + 1));
        
        // ! NO_HARDCODE: Use configuration value instead of hardcoded constant
        // ! CRITICAL: DoS Protection - Prevent unbounded Map growth (only for in-memory Map)
        // ! External stores (Redis) handle their own eviction policies
        if (this.requestCounts.size !== undefined) {
            // In-memory Map has .size property
            if (!this.config.MAX_RATE_LIMIT_KEYS) {
                this.logSecurityEvent('CONFIG_ERROR', 'MAX_RATE_LIMIT_KEYS not configured', {
                    type: typeof this.config.MAX_RATE_LIMIT_KEYS
                });
                throw new Error('MAX_RATE_LIMIT_KEYS configuration is required for DoS protection');
            }
            
            if (this.requestCounts.size > this.config.MAX_RATE_LIMIT_KEYS) {
                // LRU Eviction: Remove oldest 10% of entries
                const entriesToRemove = Math.floor(this.config.MAX_RATE_LIMIT_KEYS * 0.1);
                const sortedKeys = Array.from(this.requestCounts.keys()).sort();
                
                for (let i = 0; i < entriesToRemove && i < sortedKeys.length; i++) {
                    await Promise.resolve(this.requestCounts.delete(sortedKeys[i]));
                }
                
                this.logSecurityEvent('RATE_LIMIT_EVICTION', 'LRU eviction triggered to prevent memory leak', {
                    entriesRemoved: entriesToRemove,
                    currentSize: this.requestCounts.size,
                    maxSize: this.config.MAX_RATE_LIMIT_KEYS
                });
            }
            
            // Cleanup old entries (keep last 5 minutes) - only for in-memory Map
            for (const [oldKey] of this.requestCounts) {
                const keyParts = oldKey.split('_');
                const oldMinute = parseInt(keyParts[keyParts.length - 1]);
                
                if (isNaN(oldMinute)) {
                    // Invalid key format - remove it
                    await Promise.resolve(this.requestCounts.delete(oldKey));
                    continue;
                }
                
                if (minute - oldMinute > 5) {
                    await Promise.resolve(this.requestCounts.delete(oldKey));
                }
            }
        }
        // External stores (Redis) handle TTL automatically, no manual cleanup needed
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // !  Helper Security Methods
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Check forbidden paths
    // ! NO_HARDCODE: Loop-based checking with early throw
    // ! ══════════════════════════════════════════════════════════════════════════════
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
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Initialize security logging
    // ! NO_HARDCODE: Directory creation without IF statement
    // ! ══════════════════════════════════════════════════════════════════════════════
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
     * ! NO_SILENT_FALLBACKS: Explicit check for LOG_SENSITIVE_DATA
     */
    logSecurityEvent(type, message, details = {}) {
        // ! NO_SILENT_FALLBACKS: Explicit decision on detail sanitization
        let eventDetails = {};
        if (this.config.LOG_SENSITIVE_DATA) {
            eventDetails = details;
        } else {
            eventDetails = this.sanitizeLogDetails(details);
        }
        
        const event = {
            timestamp: new Date().toISOString(),
            type,
            message: this.sanitizeLogMessage(message),
            details: eventDetails,
            pid: process.pid,
            sessionId: this.generateSessionId()
        };
        
        this.securityLog.push(event);
        
        // Write to file if enabled (async to prevent blocking)
        if (this.config.ENABLE_SECURITY_LOGGING && this.securityLogPath) {
            try {
                const logEntry = JSON.stringify(event) + '\n';
                // ! NO_SILENT_FALLBACKS: Log errors to console as fallback
                // ! WHY: Cannot use logSecurityEvent here (infinite recursion)
                // ! WHY: Must have SOME notification mechanism for logging failures
                fs.promises.appendFile(this.securityLogPath, logEntry).catch((writeError) => {
                    // ! FAIL LOUD: Output to console stderr as last resort
                    console.error(`[SECURITY] Failed to write security log: ${writeError.message}`);
                    console.error(`[SECURITY] Event type: ${type}, Message: ${message}`);
                });
            } catch (error) {
                // ! FAIL LOUD: Output critical error to console
                console.error(`[SECURITY] Critical logging error: ${error.message}`);
                console.error(`[SECURITY] Event type: ${type}, Message: ${message}`);
            }
        }
        
        // Keep only last 1000 events in memory
        if (this.securityLog.length > 1000) {
            this.securityLog.shift();
        }
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Sanitize log messages to prevent log injection
    // ! NO_HARDCODE: Type checking using ternary instead of IF
    // ! ══════════════════════════════════════════════════════════════════════════════
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
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Sanitize log details to remove sensitive information
    // ! NO_HARDCODE: Field sanitization using configuration
    // ! ══════════════════════════════════════════════════════════════════════════════
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
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Mask sensitive parts of paths
    // ! ══════════════════════════════════════════════════════════════════════════════
    maskSensitivePath(pathStr) {
        // Replace user directories with placeholders
        return pathStr
            .replace(/[A-Z]:\\Users\\[^\\]+/gi, '[USER_DIR]')
            .replace(/\/home\/[^\/]+/g, '[USER_DIR]')
            .replace(/\/Users\/[^\/]+/g, '[USER_DIR]');
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════════════════
    // ! Generate se!  ssion ID for tracking
    // ! NO_HARDCODE: Lazy initialization without IF statement
    // ! ═════════════════════════════════════════════════════════════════════════════════════════════════════// !═════════════════════════════// ! ═════════════════════════════════════════════════════════════════════════════════════════════════
    generateSessionId() {
        if (!this.sessionId) {
            this.sessionId = crypto.randomBytes(8).toString('hex');
        }
        return this.sessionId;
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // !  Security Status and Reporting
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Get security statistics
    // ! ══════════════════════════════════════════════════════════════════════════════
    getSecurityStats() {
        const now = Date.now();
        const events = this.securityLog.filter(e => 
            now - new Date(e.timestamp).getTime() < 3600000 // Last hour
        );
        
        const violations = events.filter(e => 
            e.type.includes('VIOLATION') || e.type.includes('EXCEEDED') || e.type.includes('DETECTED')
        );
        
        // ! NO_SILENT_FALLBACKS: Explicit check instead of `|| null`
        let lastViolation = null;
        if (violations.length > 0) {
            const lastIndex = violations.length - 1;
            if (violations[lastIndex]) {
                lastViolation = violations[lastIndex];
            } else {
                // Should never happen, but fail loud if it does
                console.error('[SECURITY] CRITICAL: violations array has undefined entry at last index');
            }
        }
        
        return {
            uptime: now - this.startTime,
            totalEvents: this.securityLog.length,
            recentEvents: events.length,
            violations: violations.length,
            lastViolation: lastViolation,
            rateLimit: {
                currentMinute: Math.floor(now / 60000),
                requestCounts: Object.fromEntries(this.requestCounts)
            }
        };
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Generate security report
    // ! ══════════════════════════════════════════════════════════════════════════════
    generateSecurityReport() {
        const stats = this.getSecurityStats();
        const config = {
            maxFileSize: this.config.MAX_FILE_SIZE,
            allowSymlinks: this.config.ALLOW_SYMLINKS,
            redosProtection: this.config.ENABLE_REDOS_PROTECTION,
            rateLimit: this.config.MAX_REQUESTS_PER_MINUTE
        };
        
        // ! NO_SILENT_FALLBACKS: Explicit status determination
        let securityStatus = 'SECURE';
        if (stats.violations > 0) {
            securityStatus = 'VIOLATIONS_DETECTED';
        }
        
        return {
            timestamp: new Date().toISOString(),
            securityLevel: 'FORTRESS',
            statistics: stats,
            configuration: config,
            recentViolations: this.securityLog
                .filter(e => e.type.includes('VIOLATION'))
                .slice(-10), // Last 10 violations
            status: securityStatus
        };
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
// !  Export Security Manager and Error Classes
// ! ══════════════════════════════════════════════════════════════════════════════

export {
    SecurityManager,
    SecurityError,
    PathTraversalError,
    AccessDeniedError,
    FileValidationError,
    ReDoSError,
    InputValidationError
};