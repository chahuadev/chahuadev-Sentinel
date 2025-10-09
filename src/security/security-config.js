//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// @description Security configuration and policies for the VS Code extension
// ======================================================================

// !  NO_HARDCODE: Import pattern definitions from JSON file
import suspiciousPatternDefinitions from './suspicious-patterns.json' with { type: 'json' };

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
        
        // !  NO_HARDCODE: Patterns loaded from JSON and converted to RegExp at runtime
        // !  WHY: Allows DevOps/Security team to modify patterns without touching .js files
        // !  NOTE: Actual patterns are in suspicious-patterns.json
        suspiciousPatterns: [], // Will be populated at runtime by loadSuspiciousPatterns()
        
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
 * Load suspicious patterns from JSON and convert to RegExp at runtime
 * NO_HARDCODE: Patterns come from external JSON file, not hardcoded in .js
 */
function loadSuspiciousPatterns() {
    // !  NO_HARDCODE: Build RegExp objects from string patterns at runtime
    // !  WHY: Allows pattern modification without code changes
    return suspiciousPatternDefinitions.SUSPICIOUS_PATTERNS.map(patternDef => ({
        name: patternDef.name,
        pattern: new RegExp(patternDef.pattern, patternDef.flags),
        severity: patternDef.severity,
        description: patternDef.description,
        category: patternDef.category
    }));
}

/**
 * Security Configuration Class
 */
class SecurityConfig {
    constructor(level = 'STANDARD', customPolicies = {}) {
        // !  NO_SILENT_FALLBACKS: Explicit validation - Fail Fast, Fail Loud
        if (typeof SECURITY_LEVELS[level] === 'undefined') {
            throw new Error(`Invalid security level: ${level}. Valid levels: ${Object.keys(SECURITY_LEVELS).join(', ')}`);
        }
        this.securityLevel = SECURITY_LEVELS[level];
        this.policies = this.mergePolicies(SECURITY_POLICIES, customPolicies);
        
        // !  NO_HARDCODE: Load suspicious patterns from JSON at runtime
        // !  WHY: Allows modification without code changes
        this.policies.content.suspiciousPatterns = loadSuspiciousPatterns();
        
        this.overrides = {};
    }
    
    /**
     * Merge default policies with custom policies
     * NO_HARDCODE: Uses Object.assign for merging without conditionals
     */
    mergePolicies(defaultPolicies, customPolicies) {
        const merged = JSON.parse(JSON.stringify(defaultPolicies));
        
        // !  CONFIGURATION-DRIVEN: Direct merge using Object.assign (no conditionals)
        // !  WHY: Object.assign handles both cases automatically
        Object.entries(customPolicies).forEach(([category, rules]) => {
            merged[category] = Object.assign({}, merged[category], rules);
        });
        
        return merged;
    }
    
    /**
     * Get configuration value by path
     * NO_SILENT_FALLBACKS: Throws error when path not found - Fail Fast, Fail Loud
     */
    get(path, defaultValue = null) {
        try {
            const parts = path.split('.');
            
            // !  NO_SILENT_FALLBACKS: Explicit validation - Fail Fast, Fail Loud
            const result = parts.reduce((acc, part) => {
                // !  Throw immediately if property doesn't exist - LOUD failure
                if (typeof acc[part] === 'undefined') {
                    throw new Error(`Configuration property '${part}' not found in path '${path}'`);
                }
                return acc[part];
            }, this.policies);
            
            // !  NO_SILENT_FALLBACKS: Validate final result - Never return undefined
            if (typeof result === 'undefined') {
                throw new Error(`Configuration path '${path}' returned undefined. This is a critical configuration error.`);
            }
            
            return result;
        } catch (error) {
            // !  NO_SILENT_FALLBACKS: Never return default silently - always throw
            // !  WHY: Missing config is CRITICAL ERROR, not something to ignore
            throw new Error(`CRITICAL: Invalid configuration path '${path}'. ${error.message}`);
        }
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
     * NO_SILENT_FALLBACKS: Explicit validation - Fail Fast, Fail Loud
     */
    setSecurityLevel(level) {
        // !  NO_SILENT_FALLBACKS: Explicit check before assignment
        if (typeof SECURITY_LEVELS[level] === 'undefined') {
            throw new Error(`Invalid security level: ${level}. Valid levels: ${Object.keys(SECURITY_LEVELS).join(', ')}`);
        }
        this.securityLevel = SECURITY_LEVELS[level];
        
        return true;
    }
    
    /**
     * Validate configuration
     * CONFIGURATION-DRIVEN: Pure validation without any conditionals
     */
    validate() {
        // !  CONFIGURATION-DRIVEN: Define validation rules as data
        const validationRules = [
            {
                getter: () => this.get('filesystem.maxFileSize'),
                errorMessage: 'Invalid filesystem.maxFileSize value',
                isValid: (value) => value > 0
            },
            {
                getter: () => this.get('performance.maxRequestsPerMinute'),
                errorMessage: 'Invalid performance.maxRequestsPerMinute value',
                isValid: (value) => value > 0
            },
            {
                getter: () => this.get('performance.regexTimeout'),
                errorMessage: 'Invalid performance.regexTimeout value',
                isValid: (value) => value > 0
            }
        ];
        
        // !  NO_SILENT_FALLBACKS: Map and filter to collect errors
        const errors = validationRules
            .map(rule => {
                const value = rule.getter();
                return { isValid: rule.isValid(value), message: rule.errorMessage };
            })
            .filter(result => !result.isValid)
            .map(result => result.message);
        
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
 * CONFIGURATION-DRIVEN: No conditionals
 */
function createSecurityConfig(options = {}) {
    const {
        level = 'STANDARD',
        customPolicies = {},
        vscodeSettings = null
    } = options;
    
    const config = new SecurityConfig(level, customPolicies);
    
    // !  NO_SILENT_FALLBACKS: Explicit nested checks - no logical AND operators
    if (vscodeSettings !== null) {
        if (vscodeSettings.constructor === Object) {
            applyVSCodeSettings(config, vscodeSettings);
        }
    }
    
    return config;
}

/**
 * Apply VS Code workspace settings to security config
 * NO_SILENT_FALLBACKS: Throws errors instead of silently continuing
 */
function applyVSCodeSettings(config, vscodeSettings) {
    // !  CONFIGURATION-DRIVEN: Define action strategies
    const actionStrategies = {
        securityLevel: (value) => config.setSecurityLevel(value),
        default: (path, value) => config.set(path, value)
    };
    
    // !  CONFIGURATION-DRIVEN: Define mapping table
    const settingsMapping = [
        { vscodeKey: 'chahuadev-sentinel.security.level', configPath: 'securityLevel' },
        { vscodeKey: 'chahuadev-sentinel.security.maxFileSize', configPath: 'filesystem.maxFileSize' },
        { vscodeKey: 'chahuadev-sentinel.security.allowSymlinks', configPath: 'filesystem.allowSymlinks' },
        { vscodeKey: 'chahuadev-sentinel.security.rateLimit', configPath: 'performance.maxRequestsPerMinute' },
        { vscodeKey: 'chahuadev-sentinel.security.enableLogging', configPath: 'logging.enableSecurityLogging' }
    ];
    
    // !  NO_SILENT_FALLBACKS: Collect all errors and throw if any failed
    // !  WHY: User MUST know their settings are invalid, not silently ignored
    const errors = [];
    
    settingsMapping.forEach(({ vscodeKey, configPath }) => {
        try {
            const value = vscodeSettings.get(vscodeKey);
            
            // !  NO_SILENT_FALLBACKS: Explicit check - only process when value is defined
            // !  WHY: undefined means user didn't set it, not an error
            if (typeof value !== 'undefined') {
                // !  NO_SILENT_FALLBACKS: Explicit strategy lookup with explicit check
                let strategy;
                if (typeof actionStrategies[configPath] !== 'undefined') {
                    strategy = actionStrategies[configPath];
                } else {
                    strategy = actionStrategies.default;
                }
                
                const isSecurityLevel = configPath === 'securityLevel';
                
                // !  NO_SILENT_FALLBACKS: Explicit execution path
                if (isSecurityLevel) {
                    strategy(value);
                } else {
                    strategy(configPath, value);
                }
            }
        } catch (error) {
            // !  NO_SILENT_FALLBACKS: Collect error instead of swallowing it
            errors.push(`${vscodeKey}: ${error.message}`);
        }
    });
    
    // !  NO_SILENT_FALLBACKS: Explicit error check and throw
    // !  WHY: Force user to fix invalid settings, don't run with broken config
    if (errors.length > 0) {
        throw new Error(`Invalid VS Code settings detected:\n${errors.join('\n')}`);
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