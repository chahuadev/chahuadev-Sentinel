//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// @description Security configuration and policies for the VS Code extension
// ======================================================================

/**
 * Security Levels Configuration
 */
const SECURITY_LEVELS = {
    MINIMAL: {
        name: 'Minimal Security',
        level: 1,
        description: 'Basic security checks only',
        features: {
            pathValidation: true,
            fileExtensionCheck: false,
            rateLimiting: false,
            redosProtection: false,
            securityLogging: false
        }
    },
    
    STANDARD: {
        name: 'Standard Security',
        level: 2,
        description: 'Standard security features for typical development',
        features: {
            pathValidation: true,
            fileExtensionCheck: true,
            rateLimiting: true,
            redosProtection: true,
            securityLogging: true,
            maxFileSize: 10 * 1024 * 1024 // 10MB
        }
    },
    
    FORTRESS: {
        name: 'Fortress Security',
        level: 3,
        description: 'Maximum security protection for sensitive environments',
        features: {
            pathValidation: true,
            fileExtensionCheck: true,
            rateLimiting: true,
            redosProtection: true,
            securityLogging: true,
            symlinkProtection: true,
            workingDirectoryEnforcement: true,
            maxFileSize: 5 * 1024 * 1024, // 5MB
            strictPermissions: true,
            contentScanning: true
        }
    }
};

/**
 * Default Security Policies
 */
const SECURITY_POLICIES = {
    // File System Security
    filesystem: {
        // Maximum file size for processing (bytes)
        maxFileSize: 50 * 1024 * 1024, // 50MB
        
        // Allowed file extensions for processing
        allowedExtensions: [
            '.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css', '.scss',
            '.py', '.java', '.cpp', '.c', '.cs', '.php', '.go', '.rs', '.rb'
        ],
        
        // Forbidden paths (regex patterns)
        forbiddenPaths: [
            /^[A-Z]:\\Windows\\/i,           // Windows system
            /^[A-Z]:\\Program Files\\/i,      // Windows programs
            /^\/etc\//,                      // Linux system config
            /^\/usr\/bin\//,                 // Linux binaries
            /^\/System\//,                   // macOS system
            /node_modules/,                  // Dependencies
            /\.git/,                         // Git repository
            /\.ssh/,                         // SSH keys
            /\.aws/                          // AWS credentials
        ],
        
        // Symlink handling
        allowSymlinks: false,
        maxSymlinkDepth: 3,
        
        // Permission requirements
        requireReadPermission: true,
        requireWritePermission: true
    },
    
    // Input Validation Security
    input: {
        // Maximum path length
        maxPathLength: 260,
        
        // Dangerous characters in paths
        dangerousCharsPattern: /[<>"|?*\x00-\x1f]/,
        
        // Path traversal detection
        pathTraversalPattern: /\.\.[\\\/]/,
        
        // Maximum input string length
        maxStringLength: 10000,
        
        // Null byte detection
        nullBytePattern: /\x00/
    },
    
    // Performance Security
    performance: {
        // Maximum processing time per operation (ms)
        maxProcessingTime: 30000,
        
        // Maximum files in batch operation
        maxFilesBatch: 100,
        
        // Rate limiting
        maxRequestsPerMinute: 60,
        maxRequestsBurst: 10,
        
        // Regex execution timeout (ms)
        regexTimeout: 1000,
        
        // Memory usage limits
        maxMemoryUsage: 100 * 1024 * 1024 // 100MB
    },
    
    // Logging and Monitoring
    logging: {
        // Enable security event logging
        enableSecurityLogging: true,
        
        // Log sensitive data (be careful!)
        logSensitiveData: false,
        
        // Maximum log file size (bytes)
        maxLogFileSize: 10 * 1024 * 1024, // 10MB
        
        // Log retention period (days)
        logRetentionDays: 30,
        
        // Critical events that require immediate attention
        criticalEvents: [
            'PATH_TRAVERSAL_ATTEMPT',
            'FORBIDDEN_PATH_ACCESS',
            'RATE_LIMIT_EXCEEDED',
            'REDOS_ATTACK_DETECTED',
            'PERMISSION_VIOLATION'
        ]
    },
    
    // Content Security
    content: {
        // Scan for suspicious patterns
        enableContentScanning: true,
        
        // Suspicious code patterns - ย้ายมาจาก middleware เพื่อไม่ให้เป็น hardcode
        suspiciousPatterns: [
            {
                name: 'Dynamic Code Evaluation',
                pattern: /eval\s*\(/gi,
                severity: 'HIGH',
                description: 'Dynamic code evaluation detected',
                category: 'CODE_INJECTION'
            },
            {
                name: 'Function Constructor',
                pattern: /new\s+Function\s*\(/gi,
                severity: 'HIGH',
                description: 'Dynamic function creation detected',
                category: 'CODE_INJECTION'
            },
            {
                name: 'Function Constructor Alternative',
                pattern: /Function\s*\(/gi,
                severity: 'HIGH',
                description: 'Dynamic function creation detected',
                category: 'CODE_INJECTION'
            },
            {
                name: 'Script Injection',
                pattern: /<script[^>]*>[\s\S]*?<\/script>/gi,
                severity: 'MEDIUM',
                description: 'Script tag detected in content',
                category: 'XSS_RISK'
            },
            {
                name: 'DOM Write Manipulation',
                pattern: /document\.write\s*\(/gi,
                severity: 'MEDIUM',
                description: 'Direct DOM write manipulation detected',
                category: 'XSS_RISK'
            },
            {
                name: 'Inner HTML Manipulation',
                pattern: /innerHTML\s*=/gi,
                severity: 'MEDIUM',
                description: 'Direct innerHTML manipulation detected',
                category: 'XSS_RISK'
            },
            {
                name: 'String-based setTimeout',
                pattern: /setTimeout\s*\(\s*["']/gi,
                severity: 'MEDIUM',
                description: 'String-based setTimeout detected',
                category: 'CODE_INJECTION'
            },
            {
                name: 'String-based setInterval',
                pattern: /setInterval\s*\(\s*["']/gi,
                severity: 'MEDIUM',
                description: 'String-based setInterval detected',
                category: 'CODE_INJECTION'
            }
        ],
        
        // File type specific security rules
        fileTypeRules: {
            '.js': {
                maxSize: 1024 * 1024, // 1MB
                scanForEval: true,
                checkSyntax: true
            },
            '.ts': {
                maxSize: 1024 * 1024, // 1MB
                scanForEval: true,
                checkSyntax: true
            },
            '.json': {
                maxSize: 100 * 1024, // 100KB
                validateJSON: true
            }
        }
    }
};

/**
 * Security Configuration Class
 */
class SecurityConfig {
    constructor(level = 'STANDARD', customPolicies = {}) {
        this.securityLevel = SECURITY_LEVELS[level] || SECURITY_LEVELS.STANDARD;
        this.policies = this.mergePolicies(SECURITY_POLICIES, customPolicies);
        this.overrides = {};
    }
    
    /**
     * Merge default policies with custom policies
     */
    mergePolicies(defaultPolicies, customPolicies) {
        const merged = JSON.parse(JSON.stringify(defaultPolicies));
        
        for (const [category, rules] of Object.entries(customPolicies)) {
            if (merged[category]) {
                merged[category] = { ...merged[category], ...rules };
            } else {
                merged[category] = rules;
            }
        }
        
        return merged;
    }
    
    /**
     * Get configuration value by path
     */
    get(path, defaultValue = null) {
        const parts = path.split('.');
        let current = this.policies;
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return defaultValue;
            }
        }
        
        return current;
    }
    
    /**
     * Set configuration override
     */
    set(path, value) {
        this.overrides[path] = value;
    }
    
    /**
     * Check if feature is enabled at current security level
     */
    isFeatureEnabled(feature) {
        return this.securityLevel.features[feature] === true;
    }
    
    /**
     * Get security level information
     */
    getSecurityLevel() {
        return this.securityLevel;
    }
    
    /**
     * Update security level
     */
    setSecurityLevel(level) {
        if (SECURITY_LEVELS[level]) {
            this.securityLevel = SECURITY_LEVELS[level];
            return true;
        }
        return false;
    }
    
    /**
     * Validate configuration
     */
    validate() {
        const errors = [];
        
        // Validate file size limits
        const maxFileSize = this.get('filesystem.maxFileSize');
        if (!maxFileSize || maxFileSize <= 0) {
            errors.push('Invalid filesystem.maxFileSize value');
        }
        
        // Validate rate limiting
        const maxRequests = this.get('performance.maxRequestsPerMinute');
        if (!maxRequests || maxRequests <= 0) {
            errors.push('Invalid performance.maxRequestsPerMinute value');
        }
        
        // Validate regex timeout
        const regexTimeout = this.get('performance.regexTimeout');
        if (!regexTimeout || regexTimeout <= 0) {
            errors.push('Invalid performance.regexTimeout value');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Export configuration as JSON
     */
    toJSON() {
        return {
            securityLevel: this.securityLevel,
            policies: this.policies,
            overrides: this.overrides,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Generate security configuration report
     */
    generateReport() {
        const validation = this.validate();
        
        return {
            timestamp: new Date().toISOString(),
            securityLevel: this.securityLevel,
            validation: validation,
            enabledFeatures: Object.entries(this.securityLevel.features)
                .filter(([_, enabled]) => enabled)
                .map(([feature]) => feature),
            keySettings: {
                maxFileSize: this.get('filesystem.maxFileSize'),
                allowSymlinks: this.get('filesystem.allowSymlinks'),
                rateLimitPerMinute: this.get('performance.maxRequestsPerMinute'),
                regexTimeout: this.get('performance.regexTimeout'),
                securityLogging: this.get('logging.enableSecurityLogging')
            }
        };
    }
}

/**
 * Factory function to create security configuration
 */
function createSecurityConfig(options = {}) {
    const {
        level = 'STANDARD',
        customPolicies = {},
        vscodeSettings = null
    } = options;
    
    const config = new SecurityConfig(level, customPolicies);
    
    // Apply VS Code settings if provided
    if (vscodeSettings) {
        applyVSCodeSettings(config, vscodeSettings);
    }
    
    return config;
}

/**
 * Apply VS Code workspace settings to security config
 */
function applyVSCodeSettings(config, vscodeSettings) {
    // Map VS Code settings to security config paths
    const settingsMapping = {
        'chahuadev-sentinel.security.level': 'securityLevel',
        'chahuadev-sentinel.security.maxFileSize': 'filesystem.maxFileSize',
        'chahuadev-sentinel.security.allowSymlinks': 'filesystem.allowSymlinks',
        'chahuadev-sentinel.security.rateLimit': 'performance.maxRequestsPerMinute',
        'chahuadev-sentinel.security.enableLogging': 'logging.enableSecurityLogging'
    };
    
    for (const [vscodeKey, configPath] of Object.entries(settingsMapping)) {
        const value = vscodeSettings.get(vscodeKey);
        if (value !== undefined) {
            if (configPath === 'securityLevel') {
                config.setSecurityLevel(value);
            } else {
                config.set(configPath, value);
            }
        }
    }
}

// ======================================================================
// Export Security Configuration
// ======================================================================

export {
    SecurityConfig,
    createSecurityConfig,
    SECURITY_LEVELS,
    SECURITY_POLICIES
};