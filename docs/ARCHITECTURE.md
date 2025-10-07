//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================

# Architecture Guide

**System Design and Architecture Overview**

## Overview

Chahuadev Sentinel is designed as a modular, secure, and extensible code quality analysis system. This document provides comprehensive architectural guidance for understanding, extending, and maintaining the system.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                 │
├─────────────────────┬───────────────────────────────────┤
│   VS Code Extension │           CLI Tool                │
├─────────────────────┴───────────────────────────────────┤
│                  Extension Wrapper                      │
├─────────────────────────────────────────────────────────┤
│                   Core Engine Layer                     │
├─────────────────────┬───────────────────────────────────┤
│  Validation Engine  │      Security Middleware         │
├─────────────────────┼───────────────────────────────────┤
│   Grammar System    │      Configuration Management     │
├─────────────────────┴───────────────────────────────────┤
│                   Parser Infrastructure                 │
├─────────────────────┬───────────────────────────────────┤
│   Smart Parser      │        Grammar Index             │
├─────────────────────┼───────────────────────────────────┤
│   AST Analysis      │        Fuzzy Search              │
├─────────────────────┴───────────────────────────────────┤
│                    Foundation Layer                     │
├─────────────────────┬───────────────────────────────────┤
│   Acorn Parser      │        Babel Parser              │
├─────────────────────┼───────────────────────────────────┤
│   Node.js Runtime   │        File System               │
└─────────────────────┴───────────────────────────────────┘
```

### Component Relationships

**Interface Layer**
- VS Code Extension: Provides IDE integration and real-time feedback
- CLI Tool: Enables command-line usage and CI/CD integration
- Extension Wrapper: Bridges CommonJS (VS Code) and ES Modules

**Core Engine Layer**
- Validation Engine: Orchestrates all validation processes
- Security Middleware: Implements security policies and threat detection
- Grammar System: Manages language-specific rules and patterns
- Configuration Management: Handles settings and rule configuration

**Parser Infrastructure**
- Smart Parser Engine: Advanced AST-based code analysis
- Grammar Index: Efficient keyword and pattern lookup system
- AST Analysis: Deep syntax tree inspection and validation
- Fuzzy Search: Intelligent pattern matching and suggestions

## Core Components

### Validation Engine

**Purpose**: Central orchestration of all validation processes

**Architecture**:
```javascript
class ValidationEngine {
    constructor() {
        this.smartParser = null;          // AST parsing engine
        this.grammarIndex = null;         // Pattern matching system
        this.securityMiddleware = null;   // Security validation
        this.absoluteRules = ABSOLUTE_RULES; // Core immutable rules
    }
    
    async initializeParserStudy() {
        // Initialize all subsystems with proper error handling
        // Load grammar definitions and configuration
        // Establish security policies and middleware
        // Prepare AST analysis capabilities
    }
    
    async validateCode(code, filePath) {
        // Multi-stage validation process
        // Security scanning and threat detection
        // Grammar-based rule application
        // AST analysis and pattern matching
        // Result aggregation and reporting
    }
}
```

**Key Features**:
- Modular initialization with comprehensive error handling
- Multi-stage validation pipeline with early termination
- Extensible rule system with immutable core rules
- Performance optimization through caching and indexing

### Smart Parser Engine

**Purpose**: Advanced AST-based code analysis and pattern detection

**Architecture**:
```javascript
class SmartParserEngine {
    constructor(grammarRules) {
        this.acornParser = acorn;           // Primary JavaScript parser
        this.babelParser = babel;           // Advanced TypeScript/JSX parser
        this.grammarRules = grammarRules;   // Language-specific rules
        this.astCache = new Map();          // Performance optimization
        this.visitors = new Map();          // AST visitor patterns
    }
    
    async parseCode(code, options) {
        // Multi-parser strategy with fallback mechanisms
        // Grammar-aware parsing with language detection
        // AST generation with error recovery
        // Performance monitoring and optimization
    }
    
    analyzeAST(ast, rules) {
        // Visitor pattern implementation for AST traversal
        // Rule application with context awareness
        // Pattern matching with fuzzy search capabilities
        // Violation detection and location tracking
    }
}
```

**Key Features**:
- Dual parser strategy (Acorn + Babel) for comprehensive support
- Grammar-aware parsing with automatic language detection
- Visitor pattern for efficient AST traversal
- Caching and optimization for performance

### Grammar System

**Purpose**: Language-specific rule definitions and pattern management

**Architecture**:
```javascript
// Grammar Definition Structure
export const JAVASCRIPT_GRAMMAR = {
    keywords: {
        reserved: ['function', 'class', 'const', 'let', 'var'],
        operators: ['++', '--', '===', '!==', '&&', '||'],
        literals: ['true', 'false', 'null', 'undefined']
    },
    
    patterns: {
        functionDeclaration: /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/,
        arrowFunction: /\(\s*[^)]*\s*\)\s*=>/,
        classDeclaration: /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/
    },
    
    rules: {
        NO_HARDCODE: {
            patterns: [/["'].*["']/, /\d+/],
            exceptions: ['test', 'spec', 'mock'],
            severity: 'ERROR'
        }
    }
};
```

**Key Features**:
- Hierarchical grammar organization by language
- Extensible rule definition with pattern matching
- Exception handling for specific contexts
- Performance-optimized lookup structures

### Security Middleware

**Purpose**: Comprehensive security validation and threat detection

**Architecture**:
```javascript
class SecurityMiddleware {
    constructor(securityPolicies) {
        this.policies = securityPolicies;
        this.threatDetector = new ThreatDetector();
        this.rateLimiter = new RateLimiter();
        this.auditLogger = new AuditLogger();
    }
    
    async validateSecurityPolicy(code, context) {
        // Multi-layered security validation
        // Threat pattern detection and analysis
        // Rate limiting and resource management
        // Comprehensive audit logging
    }
    
    async scanForThreats(content, metadata) {
        // Malicious pattern detection
        // Code injection prevention
        // Path traversal protection
        // Resource exhaustion prevention
    }
}
```

**Key Features**:
- Multi-layered security validation approach
- Real-time threat detection and response
- Rate limiting and resource management
- Comprehensive audit logging and monitoring

## Design Patterns

### Visitor Pattern

**Implementation**: AST traversal and rule application

```javascript
class ValidationVisitor {
    constructor(rules) {
        this.rules = rules;
        this.violations = [];
    }
    
    visit(node) {
        // Dynamic dispatch based on node type
        const method = `visit${node.type}`;
        if (this[method]) {
            this[method](node);
        }
        
        // Continue traversal to child nodes
        this.visitChildren(node);
    }
    
    visitFunctionDeclaration(node) {
        // Apply function-specific validation rules
        this.applyRules(node, this.rules.functions);
    }
}
```

### Strategy Pattern

**Implementation**: Multi-parser selection and grammar handling

```javascript
class ParserStrategy {
    static selectParser(code, filePath) {
        const extension = path.extname(filePath);
        
        switch (extension) {
            case '.ts':
            case '.tsx':
                return new TypeScriptParserStrategy();
            case '.jsx':
                return new JSXParserStrategy();
            default:
                return new JavaScriptParserStrategy();
        }
    }
}
```

### Observer Pattern

**Implementation**: Real-time validation and event handling

```javascript
class ValidationEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.subscribers = new Map();
    }
    
    onValidationComplete(callback) {
        this.on('validation:complete', callback);
    }
    
    onViolationDetected(callback) {
        this.on('violation:detected', callback);
    }
    
    emitValidationResult(result) {
        this.emit('validation:complete', result);
        
        result.violations.forEach(violation => {
            this.emit('violation:detected', violation);
        });
    }
}
```

## Performance Architecture

### Caching Strategy

**Multi-Level Caching**:
```javascript
class CacheManager {
    constructor() {
        this.astCache = new LRUCache({ max: 1000 });      // AST caching
        this.grammarCache = new Map();                    // Grammar caching
        this.resultCache = new WeakMap();                 // Result caching
    }
    
    getCachedAST(code, options) {
        const key = this.generateCacheKey(code, options);
        return this.astCache.get(key);
    }
    
    setCachedAST(code, options, ast) {
        const key = this.generateCacheKey(code, options);
        this.astCache.set(key, ast);
    }
}
```

**Performance Optimizations**:
- AST caching with LRU eviction policy
- Grammar rule indexing with Trie data structures
- Lazy loading of language-specific grammars
- Streaming processing for large files

### Memory Management

**Resource Control**:
```javascript
class ResourceManager {
    constructor(limits) {
        this.memoryLimit = limits.maxMemoryMB * 1024 * 1024;
        this.fileSize = limits.maxFileSizeKB * 1024;
        this.timeoutMs = limits.maxTimeoutMs;
    }
    
    async processWithLimits(operation, context) {
        return Promise.race([
            operation(context),
            this.timeoutPromise(this.timeoutMs),
            this.memoryMonitor(this.memoryLimit)
        ]);
    }
}
```

## Security Architecture

### Defense in Depth

**Security Layers**:
1. **Input Validation**: Comprehensive sanitization and validation
2. **Parser Security**: Safe AST parsing with error recovery
3. **Execution Sandboxing**: Isolated execution environments
4. **Output Sanitization**: Clean and safe result formatting
5. **Audit Logging**: Complete security event tracking

**Implementation**:
```javascript
class SecurityLayer {
    static async processSecurely(input, processor) {
        // Layer 1: Input validation
        const validatedInput = await this.validateInput(input);
        
        // Layer 2: Sandboxed processing
        const sandbox = new ProcessingSandbox();
        const result = await sandbox.execute(processor, validatedInput);
        
        // Layer 3: Output sanitization
        const sanitizedResult = await this.sanitizeOutput(result);
        
        // Layer 4: Audit logging
        await this.auditLog(input, result, sanitizedResult);
        
        return sanitizedResult;
    }
}
```

### Threat Detection

**Real-time Monitoring**:
```javascript
class ThreatDetectionEngine {
    constructor() {
        this.patterns = new ThreatPatternDatabase();
        this.anomalyDetector = new AnomalyDetector();
        this.responseHandler = new ThreatResponseHandler();
    }
    
    async analyzeForThreats(code, metadata) {
        // Static analysis for known threat patterns
        const staticThreats = await this.patterns.match(code);
        
        // Dynamic analysis for anomalous behavior
        const anomalies = await this.anomalyDetector.analyze(code, metadata);
        
        // Combine results and determine response
        const threats = [...staticThreats, ...anomalies];
        if (threats.length > 0) {
            await this.responseHandler.respond(threats);
        }
        
        return threats;
    }
}
```

## Extension Architecture

### Plugin System

**Extensibility Framework**:
```javascript
class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.hooks = new Map();
    }
    
    registerPlugin(name, plugin) {
        // Plugin validation and registration
        this.validatePlugin(plugin);
        this.plugins.set(name, plugin);
        
        // Hook registration
        plugin.hooks.forEach(hook => {
            this.registerHook(hook.name, hook.handler);
        });
    }
    
    async executeHook(hookName, context) {
        const handlers = this.hooks.get(hookName) || [];
        
        for (const handler of handlers) {
            await handler(context);
        }
    }
}
```

### Configuration System

**Hierarchical Configuration**:
```javascript
class ConfigurationManager {
    constructor() {
        this.configurations = new Map();
        this.watchers = new Map();
    }
    
    async loadConfiguration(source) {
        // Support multiple configuration sources
        switch (source.type) {
            case 'file':
                return this.loadFromFile(source.path);
            case 'environment':
                return this.loadFromEnvironment(source.prefix);
            case 'vscode':
                return this.loadFromVSCode(source.section);
            default:
                throw new Error(`Unsupported configuration source: ${source.type}`);
        }
    }
    
    mergeConfigurations(...configs) {
        // Deep merge with priority ordering
        return configs.reduce((merged, config) => {
            return this.deepMerge(merged, config);
        }, {});
    }
}
```

## Deployment Architecture

### Multi-Platform Support

**Distribution Strategies**:
- **VS Code Extension**: Packaged as VSIX with marketplace distribution
- **NPM Package**: CLI tool distributed through npm registry
- **Standalone Binary**: Optional compiled binaries for system integration

**Build and Deployment Pipeline**:
```yaml
# Example CI/CD configuration
deployment:
  vscode-extension:
    build: "vsce package"
    test: "npm run test:extension"
    deploy: "vsce publish"
    
  npm-package:
    build: "npm run build"
    test: "npm run test:cli"
    deploy: "npm publish"
    
  documentation:
    build: "npm run docs:build"
    deploy: "npm run docs:deploy"
```

## Monitoring and Observability

### Performance Monitoring

**Metrics Collection**:
```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = new MetricsCollector();
        this.profiler = new PerformanceProfiler();
    }
    
    async measureOperation(operationName, operation) {
        const startTime = performance.now();
        const startMemory = process.memoryUsage();
        
        try {
            const result = await operation();
            
            const endTime = performance.now();
            const endMemory = process.memoryUsage();
            
            this.metrics.record({
                operation: operationName,
                duration: endTime - startTime,
                memoryDelta: endMemory.heapUsed - startMemory.heapUsed,
                success: true
            });
            
            return result;
        } catch (error) {
            this.metrics.record({
                operation: operationName,
                error: error.message,
                success: false
            });
            
            throw error;
        }
    }
}
```

## Future Architecture Considerations

### Scalability Planning

**Horizontal Scaling**:
- Microservice decomposition for large-scale deployments
- Distributed grammar and rule management
- Load balancing for high-throughput scenarios
- Caching layers for improved performance

**Vertical Scaling**:
- Multi-threaded processing for large files
- Worker thread pools for concurrent validation
- Memory optimization for resource-constrained environments
- Streaming processing for continuous integration

### Technology Evolution

**Emerging Technologies**:
- WebAssembly integration for performance-critical components
- Machine learning integration for intelligent rule suggestions
- Cloud-based grammar and rule distribution
- Real-time collaborative validation features

---

**This architecture provides a solid foundation for current requirements while maintaining flexibility for future evolution and scaling needs.**