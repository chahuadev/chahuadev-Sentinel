// ======================================================================
// Chahuadev Sentinel Security Middleware
// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @description Security middleware for VS Code extension operations
// ======================================================================

// Note: vscode module handling for both extension and test environments
let vscode;

// Initialize vscode module
async function initializeVSCode() {
    if (vscode) return vscode;
    
    try {
        // Try to import vscode module (only available in VS Code extension context)
        const vscodeModule = await import('vscode');
        vscode = vscodeModule.default || vscodeModule;
    } catch (e) {
        // Running outside VS Code environment (e.g., during testing)
        vscode = {
            // Mock vscode objects for testing
            DiagnosticSeverity: {
                Error: 0,
                Warning: 1,
                Information: 2,
                Hint: 3
            },
            Diagnostic: class {
                constructor(range, message, severity) {
                    this.range = range;
                    this.message = message;
                    this.severity = severity;
                }
            },
            Range: class {
                constructor(startLine, startChar, endLine, endChar) {
                    this.start = { line: startLine, character: startChar };
                    this.end = { line: endLine, character: endChar };
                }
            },
            window: {
                showInformationMessage: (msg) => Promise.resolve(),
                showWarningMessage: (msg) => Promise.resolve(),
                showErrorMessage: (msg) => Promise.resolve()
            },
            workspace: {
                openTextDocument: (options) => Promise.resolve({ uri: { fsPath: 'test' } }),
                showTextDocument: (doc) => Promise.resolve()
            }
        };
    }
    
    return vscode;
}

import { 
    SecurityManager, 
    SecurityError, 
    PathTraversalError, 
    AccessDeniedError, 
    FileValidationError 
} from './security-manager.js';

/**
 * Security Middleware Class
 * Provides security wrappers for VS Code extension operations
 */
class SecurityMiddleware {
    constructor(options = {}) {
        this.securityManager = new SecurityManager(options);
        this.isEnabled = true;
        this.vscode = null;
        this.initializeVSCode();
    }
    
    async initializeVSCode() {
        this.vscode = await initializeVSCode();
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Document Security Operations
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Secure document reading with validation
     */
    async secureReadDocument(document) {
        try {
            if (!document || !document.uri) {
                throw new SecurityError('Invalid document object');
            }
            
            // Validate document path
            const filePath = document.uri.fsPath;
            await this.securityManager.validateFile(filePath, 'READ');
            
            // Rate limiting check
            this.securityManager.checkRateLimit(`read_${filePath}`);
            
            // Get document content safely
            const content = document.getText();
            
            // Validate content size
            if (content.length > this.securityManager.config.MAX_FILE_SIZE) {
                throw new SecurityError(`Document too large: ${content.length} characters`);
            }
            
            return {
                success: true,
                content,
                filePath,
                size: content.length
            };
            
        } catch (error) {
            this.handleSecurityError(error, 'READ_DOCUMENT');
            throw error;
        }
    }
    
    /**
     * Secure workspace file operations
     */
    async secureWorkspaceOperation(operation, targetPath, content = null) {
        try {
            // Validate the operation
            const validOperations = ['READ', 'WRITE', 'DELETE', 'SCAN'];
            if (!validOperations.includes(operation)) {
                throw new SecurityError(`Invalid operation: ${operation}`);
            }
            
            // Validate target path
            const validatedPath = await this.securityManager.validateFile(targetPath, operation);
            
            // Rate limiting
            this.securityManager.checkRateLimit(`workspace_${operation}`);
            
            switch (operation) {
                case 'READ':
                    return await this.secureFileRead(validatedPath);
                case 'WRITE':
                    return await this.secureFileWrite(validatedPath, content);
                case 'SCAN':
                    return await this.secureFileScan(validatedPath);
                default:
                    throw new SecurityError(`Operation ${operation} not implemented`);
            }
            
        } catch (error) {
            this.handleSecurityError(error, `WORKSPACE_${operation}`);
            throw error;
        }
    }
    
    /**
     * Secure regex pattern execution
     */
    async securePatternMatch(pattern, text, context = null) {
        try {
            // Validate inputs
            if (!pattern || !text) {
                throw new SecurityError('Invalid pattern or text for regex execution');
            }
            
            // Rate limiting for regex operations
            this.securityManager.checkRateLimit('regex_execution');
            
            // Safe regex execution with ReDoS protection
            const result = await this.securityManager.safeRegexExecution(pattern, text, context);
            
            return {
                success: true,
                matches: result,
                pattern: pattern.source || pattern,
                contextInfo: context
            };
            
        } catch (error) {
            this.handleSecurityError(error, 'PATTERN_MATCH');
            throw error;
        }
    }
    
    // ══════════════════════════════════════════════════════════════════
    // VS Code Integration Security
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Secure diagnostic creation with validation
     */
    createSecureDiagnostic(range, message, severity = null) {
        try {
            // Initialize vscode if not available
            if (!this.vscode) {
                this.vscode = vscode;
            }
            
            const defaultSeverity = severity || this.vscode.DiagnosticSeverity.Information;
            
            // Validate inputs
            if (!range || !message) {
                throw new SecurityError('Invalid range or message for diagnostic');
            }
            
            // Sanitize message to prevent XSS-like issues
            const sanitizedMessage = this.sanitizeMessage(message);
            
            // Rate limiting for diagnostic creation
            this.securityManager.checkRateLimit('diagnostic_creation');
            
            return new this.vscode.Diagnostic(range, sanitizedMessage, defaultSeverity);
            
        } catch (error) {
            this.handleSecurityError(error, 'CREATE_DIAGNOSTIC');
            // Return safe fallback diagnostic
            return new this.vscode.Diagnostic(
                new this.vscode.Range(0, 0, 0, 0),
                'Security error in diagnostic creation',
                this.vscode.DiagnosticSeverity.Error
            );
        }
    }
    
    /**
     * Secure notification display
     */
    async showSecureNotification(message, type = 'info', actions = []) {
        try {
            // Sanitize message
            const sanitizedMessage = this.sanitizeMessage(message);
            
            // Rate limiting for notifications
            this.securityManager.checkRateLimit('notifications');
            
            // Validate actions
            const validActions = actions.filter(action => 
                action && typeof action === 'string' && action.length < 100
            );
            
            // Initialize vscode if not available
            if (!this.vscode) {
                this.vscode = vscode;
            }
            
            switch (type) {
                case 'info':
                    return await this.vscode.window.showInformationMessage(sanitizedMessage, ...validActions);
                case 'warning':
                    return await this.vscode.window.showWarningMessage(sanitizedMessage, ...validActions);
                case 'error':
                    return await this.vscode.window.showErrorMessage(sanitizedMessage, ...validActions);
                default:
                    return await this.vscode.window.showInformationMessage(sanitizedMessage, ...validActions);
            }
            
        } catch (error) {
            this.handleSecurityError(error, 'SHOW_NOTIFICATION');
            // Fallback to simple error message
            if (this.vscode && this.vscode.window) {
                this.vscode.window.showErrorMessage('Security error in notification system');
            }
        }
    }
    
    // ══════════════════════════════════════════════════════════════════
    // File System Security Operations
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Secure file reading
     */
    async secureFileRead(filePath) {
        const fs = require('fs').promises;
        
        try {
            const content = await fs.readFile(filePath, 'utf8');
            
            return {
                success: true,
                content,
                filePath,
                size: content.length,
                encoding: 'utf8'
            };
            
        } catch (error) {
            throw new SecurityError(`File read failed: ${error.message}`, filePath);
        }
    }
    
    /**
     * Secure file writing with backup
     */
    async secureFileWrite(filePath, content) {
        const fs = require('fs').promises;
        const path = require('path');
        
        try {
            // Create backup if file exists
            let backupPath = null;
            try {
                await fs.access(filePath);
                backupPath = filePath + '.security-backup.' + Date.now();
                await fs.copyFile(filePath, backupPath);
            } catch (error) {
                // File doesn't exist, no backup needed
            }
            
            // Write content securely
            await fs.writeFile(filePath, content, 'utf8');
            
            return {
                success: true,
                filePath,
                backupPath,
                size: content.length
            };
            
        } catch (error) {
            throw new SecurityError(`File write failed: ${error.message}`, filePath);
        }
    }
    
    /**
     * Secure file scanning for validation (Enhanced with configurable patterns)
     */
    async secureFileScan(filePath) {
        try {
            const readResult = await this.secureFileRead(filePath);
            const content = readResult.content;
            
            // Basic security scan of file content
            const securityIssues = [];
            
            // Get suspicious patterns from security configuration instead of hardcoding
            const suspiciousPatterns = this.securityManager.config.content?.suspiciousPatterns || [];
            
            // Scan content against each configured pattern
            for (const patternConfig of suspiciousPatterns) {
                try {
                    const matches = await this.securityManager.safeRegexExecution(
                        patternConfig.pattern, 
                        content, 
                        filePath
                    );
                    
                    if (matches && matches.length > 0) {
                        securityIssues.push({
                            issue: patternConfig.description,
                            name: patternConfig.name,
                            severity: patternConfig.severity,
                            category: patternConfig.category,
                            matches: matches.length,
                            positions: matches.map(match => ({
                                index: match.index,
                                length: match[0] ? match[0].length : 0
                            })).slice(0, 10) // Limit to first 10 matches for performance
                        });
                    }
                } catch (regexError) {
                    // Log regex execution error but continue scanning
                    this.securityManager.logSecurityEvent(
                        'SCAN_PATTERN_ERROR', 
                        `Pattern scan failed: ${patternConfig.name}`,
                        { 
                            patternName: patternConfig.name,
                            error: regexError.message,
                            filePath 
                        }
                    );
                }
            }
            
            // Additional file-specific validations
            const fileExtension = require('path').extname(filePath).toLowerCase();
            const fileTypeRules = this.securityManager.config.content?.fileTypeRules?.[fileExtension];
            
            if (fileTypeRules) {
                // Check file size against extension-specific limits
                if (fileTypeRules.maxSize && content.length > fileTypeRules.maxSize) {
                    securityIssues.push({
                        issue: `File exceeds size limit for ${fileExtension} files`,
                        name: 'File Size Violation',
                        severity: 'MEDIUM',
                        category: 'PERFORMANCE_RISK',
                        actualSize: content.length,
                        maxSize: fileTypeRules.maxSize
                    });
                }
                
                // JSON validation for .json files
                if (fileExtension === '.json' && fileTypeRules.validateJSON) {
                    try {
                        JSON.parse(content);
                    } catch (jsonError) {
                        securityIssues.push({
                            issue: 'Invalid JSON format detected',
                            name: 'JSON Syntax Error',
                            severity: 'HIGH',
                            category: 'SYNTAX_ERROR',
                            error: jsonError.message
                        });
                    }
                }
            }
            
            return {
                success: true,
                filePath,
                contentSize: content.length,
                fileExtension,
                securityIssues,
                scanTimestamp: new Date().toISOString(),
                patternsScanned: suspiciousPatterns.length
            };
            
        } catch (error) {
            throw new SecurityError(`File scan failed: ${error.message}`, filePath);
        }
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Utility and Helper Methods
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Sanitize message content
     */
    sanitizeMessage(message) {
        if (typeof message !== 'string') {
            return 'Invalid message type';
        }
        
        // Remove potentially dangerous characters and limit length
        return message
            .replace(/[<>\"'&]/g, '') // Remove HTML/script characters
            .replace(/\x00/g, '') // Remove null bytes
            .substring(0, 500); // Limit length
    }
    
    /**
     * Handle security errors with appropriate logging and actions (Enhanced)
     */
    handleSecurityError(error, operation) {
        // Log security event with sanitized message (message will be sanitized in logSecurityEvent)
        this.securityManager.logSecurityEvent('SECURITY_ERROR', error.message, {
            operation,
            errorType: error.constructor.name,
            errorCode: error.errorCode || 'UNKNOWN',
            severity: error.severity || 'HIGH',
            // Sanitize stack trace to prevent log injection
            stack: error.stack ? error.stack.replace(/\r?\n/g, ' | ').substring(0, 500) : 'No stack trace'
        });
        
        // Show appropriate user notification based on error type
        if (error instanceof SecurityError) {
            this.showSecurityAlert(error, operation);
        }
    }
    
    /**
     * Show security alert to user
     */
    async showSecurityAlert(error, operation) {
        try {
            const message = `Security Alert: ${error.message}`;
            
            // Initialize vscode if not available
            if (!this.vscode) {
                this.vscode = vscode;
            }
            
            if (this.vscode && this.vscode.window) {
                // Don't use our secure notification to avoid recursion
                await this.vscode.window.showWarningMessage(
                    message,
                    'View Security Report',
                    'Dismiss'
                ).then(selection => {
                    if (selection === 'View Security Report') {
                        this.showSecurityReport();
                    }
                });
            } else {
                // Fallback to console logging if VS Code not available
                console.warn('Security Alert:', error.message);
            }
            
        } catch (notificationError) {
            // Fallback to console logging if notification fails
            console.error('Security Alert:', error.message);
        }
    }
    
    /**
     * Show security report to user
     */
    async showSecurityReport() {
        try {
            const report = this.securityManager.generateSecurityReport();
            
            // Create formatted report content
            const reportContent = this.formatSecurityReport(report);
            
            // Initialize vscode if not available
            if (!this.vscode) {
                this.vscode = vscode;
            }
            
            if (this.vscode && this.vscode.workspace) {
                // Show in a new untitled document
                const doc = await this.vscode.workspace.openTextDocument({
                    content: reportContent,
                    language: 'json'
                });
                
                await this.vscode.window.showTextDocument(doc);
            } else {
                // Fallback for non-vscode environment
                console.log('Security Report:\n', reportContent);
            }
            
        } catch (error) {
            console.error('Failed to show security report:', error);
        }
    }
    
    /**
     * Format security report for display
     */
    formatSecurityReport(report) {
        return JSON.stringify(report, null, 2);
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Security Control Methods
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Enable security middleware
     */
    enable() {
        this.isEnabled = true;
        this.securityManager.logSecurityEvent('MIDDLEWARE_ENABLED', 'Security middleware enabled');
    }
    
    /**
     * Disable security middleware (for debugging only)
     */
    disable() {
        this.isEnabled = false;
        this.securityManager.logSecurityEvent('MIDDLEWARE_DISABLED', 'Security middleware disabled');
    }
    
    /**
     * Get security statistics
     */
    getStats() {
        return this.securityManager.getSecurityStats();
    }
    
    /**
     * Check if security is enabled
     */
    isSecurityEnabled() {
        return this.isEnabled;
    }
}

// ======================================================================
// Security Decorator Functions
// ======================================================================

/**
 * Decorator function to add security to any async function
 */
function withSecurity(securityMiddleware, operation) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args) {
            try {
                // Security pre-check
                if (!securityMiddleware.isSecurityEnabled()) {
                    return await originalMethod.apply(this, args);
                }
                
                // Rate limiting
                securityMiddleware.securityManager.checkRateLimit(`method_${propertyKey}`);
                
                // Execute original method
                const result = await originalMethod.apply(this, args);
                
                // Log successful operation
                securityMiddleware.securityManager.logSecurityEvent(
                    'SECURE_OPERATION',
                    `Method ${propertyKey} executed securely`,
                    { operation, args: args.length }
                );
                
                return result;
                
            } catch (error) {
                securityMiddleware.handleSecurityError(error, `METHOD_${propertyKey}`);
                throw error;
            }
        };
        
        return descriptor;
    };
}

// ======================================================================
// Export Security Middleware
// ======================================================================

export {
    SecurityMiddleware,
    withSecurity
};