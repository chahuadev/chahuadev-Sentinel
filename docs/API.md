//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================

# API Reference

**Complete API Documentation for Chahuadev Sentinel**

## Overview

This document provides comprehensive API documentation for all public interfaces, classes, and methods available in Chahuadev Sentinel.

## Core API

### ValidationEngine

The primary class for code validation and analysis.

#### Constructor

```javascript
new ValidationEngine()
```

Creates a new ValidationEngine instance with default configuration.

**Returns**: `ValidationEngine` - A new validation engine instance

**Example**:
```javascript
import { ValidationEngine } from './src/validator.js';

const engine = new ValidationEngine();
await engine.initializeParserStudy();
```

#### Methods

##### `initializeParserStudy()`

Initializes the validation engine with all necessary components.

```javascript
async initializeParserStudy(): Promise<void>
```

**Returns**: `Promise<void>` - Resolves when initialization is complete

**Throws**: 
- `Error` - If initialization fails due to missing dependencies
- `SecurityError` - If security middleware initialization fails

**Example**:
```javascript
try {
    await engine.initializeParserStudy();
    console.log('Engine initialized successfully');
} catch (error) {
    console.error('Initialization failed:', error.message);
}
```

##### `validateCode()`

Validates code content against all configured rules.

```javascript
async validateCode(code: string, filePath: string): Promise<ValidationResult>
```

**Parameters**:
- `code` (string): The source code to validate
- `filePath` (string): Path to the source file for context

**Returns**: `Promise<ValidationResult>` - Complete validation results

**Example**:
```javascript
const code = `
function example() {
    const hardcoded = "This violates NO_HARDCODE rule";
    return hardcoded;
}
`;

const result = await engine.validateCode(code, 'example.js');
console.log(`Found ${result.violations.length} violations`);
```

##### `validateFile()`

Validates a file by reading its contents and applying validation rules.

```javascript
async validateFile(filePath: string): Promise<ValidationResult>
```

**Parameters**:
- `filePath` (string): Path to the file to validate

**Returns**: `Promise<ValidationResult>` - Complete validation results

**Throws**:
- `Error` - If file cannot be read or parsed
- `SecurityError` - If file path violates security policies

**Example**:
```javascript
const result = await engine.validateFile('./src/example.js');
result.violations.forEach(violation => {
    console.log(`${violation.ruleId}: ${violation.message}`);
});
```

### ValidationResult

Interface representing the result of code validation.

#### Properties

```typescript
interface ValidationResult {
    filePath: string;           // Path to validated file
    violations: Violation[];    // Array of rule violations
    summary: ValidationSummary; // Summary statistics
    metadata: ValidationMetadata; // Additional context information
}
```

#### Violation

Interface representing a single rule violation.

```typescript
interface Violation {
    ruleId: string;            // Unique rule identifier
    message: string;           // Human-readable violation message
    severity: 'ERROR' | 'WARNING' | 'INFO'; // Violation severity level
    location: Location;        // Source code location
    context: ViolationContext; // Additional context information
    suggestions: string[];     // Suggested fixes (optional)
}
```

#### Location

Interface representing a location in source code.

```typescript
interface Location {
    line: number;     // Line number (1-based)
    column: number;   // Column number (1-based)
    endLine?: number; // End line for multi-line violations
    endColumn?: number; // End column for multi-line violations
}
```

## Grammar API

### Grammar Loading Functions

#### `getJavaScriptGrammar()`

Loads JavaScript language grammar definitions.

```javascript
async getJavaScriptGrammar(): Promise<Grammar>
```

**Returns**: `Promise<Grammar>` - JavaScript grammar object

**Example**:
```javascript
import { getJavaScriptGrammar } from './src/grammars/index.js';

const jsGrammar = await getJavaScriptGrammar();
console.log('Keywords:', jsGrammar.keywords.reserved);
```

#### `getTypeScriptGrammar()`

Loads TypeScript language grammar definitions.

```javascript
async getTypeScriptGrammar(): Promise<Grammar>
```

**Returns**: `Promise<Grammar>` - TypeScript grammar object

#### `getJavaGrammar()`

Loads Java language grammar definitions.

```javascript
async getJavaGrammar(): Promise<Grammar>
```

**Returns**: `Promise<Grammar>` - Java grammar object

#### `getJSXGrammar()`

Loads JSX/React grammar definitions.

```javascript
async getJSXGrammar(): Promise<Grammar>
```

**Returns**: `Promise<Grammar>` - JSX grammar object

#### `getCompleteGrammar()`

Loads all available language grammars.

```javascript
async getCompleteGrammar(): Promise<CompleteGrammar>
```

**Returns**: `Promise<CompleteGrammar>` - Object containing all grammars

**Example**:
```javascript
const allGrammars = await getCompleteGrammar();
console.log('Available languages:', Object.keys(allGrammars));
```

### Grammar Search Functions

#### `searchAllGrammars()`

Searches for patterns across all loaded grammars.

```javascript
async searchAllGrammars(query: string): Promise<SearchResult>
```

**Parameters**:
- `query` (string): Search pattern or keyword

**Returns**: `Promise<SearchResult>` - Search results across all languages

**Example**:
```javascript
const results = await searchAllGrammars('function');
results.javascript.forEach(match => {
    console.log(`Found in JavaScript: ${match.pattern}`);
});
```

## Security API

### SecurityMiddleware

Class providing security validation and threat detection.

#### Constructor

```javascript
new SecurityMiddleware(policies: SecurityPolicies)
```

**Parameters**:
- `policies` (SecurityPolicies): Security configuration object

#### Methods

##### `validateRequest()`

Validates incoming requests against security policies.

```javascript
async validateRequest(request: ValidationRequest): Promise<SecurityValidationResult>
```

**Parameters**:
- `request` (ValidationRequest): Validation request to check

**Returns**: `Promise<SecurityValidationResult>` - Security validation outcome

##### `scanForThreats()`

Scans content for potential security threats.

```javascript
async scanForThreats(content: string, metadata: ScanMetadata): Promise<ThreatScanResult>
```

**Parameters**:
- `content` (string): Content to scan for threats
- `metadata` (ScanMetadata): Additional context for scanning

**Returns**: `Promise<ThreatScanResult>` - Threat detection results

## Parser API

### SmartParserEngine

Advanced AST-based parser with multi-language support.

#### Constructor

```javascript
new SmartParserEngine(grammarRules: GrammarRules)
```

**Parameters**:
- `grammarRules` (GrammarRules): Language grammar definitions

#### Methods

##### `parseCode()`

Parses source code into an Abstract Syntax Tree.

```javascript
async parseCode(code: string, options: ParseOptions): Promise<AST>
```

**Parameters**:
- `code` (string): Source code to parse
- `options` (ParseOptions): Parser configuration options

**Returns**: `Promise<AST>` - Abstract Syntax Tree representation

**Example**:
```javascript
const ast = await parser.parseCode(sourceCode, {
    sourceType: 'module',
    ecmaVersion: 2022,
    allowImportExportEverywhere: true
});
```

##### `analyzeAST()`

Analyzes an AST for rule violations and patterns.

```javascript
analyzeAST(ast: AST, rules: ValidationRules): AnalysisResult
```

**Parameters**:
- `ast` (AST): Abstract Syntax Tree to analyze
- `rules` (ValidationRules): Rules to apply during analysis

**Returns**: `AnalysisResult` - Analysis results and violations

## Configuration API

### Configuration Types

#### ExtensionConfig

Configuration options for VS Code extension.

```typescript
interface ExtensionConfig {
    defaultSettings: {
        securityLevel: 'MINIMAL' | 'STANDARD' | 'FORTRESS';
        scanPatterns: {
            include: string;
            exclude: string;
        };
        timing: {
            scanThrottleMs: number;
            statusMessageDurationMs: number;
        };
    };
    messages: Record<string, string>;
    ui: {
        highlightLength: number;
        notificationStyle: string;
    };
}
```

#### CLIConfig

Configuration options for command-line interface.

```typescript
interface CLIConfig {
    messages: Record<string, string>;
    severityLabels: Record<string, string>;
    defaultPatterns: {
        include: string;
        exclude: string;
    };
    helpText: {
        header: string;
        usage: string;
        options: string[];
        examples: string[];
        footer: string;
    };
}
```

## CLI API

### ChahuadevCLI

Command-line interface class for batch validation.

#### Constructor

```javascript
new ChahuadevCLI()
```

Creates a new CLI instance with default configuration.

#### Methods

##### `initialize()`

Initializes the CLI with validation engine and configuration.

```javascript
async initialize(): Promise<boolean>
```

**Returns**: `Promise<boolean>` - True if initialization successful

##### `scanFile()`

Scans a single file for violations.

```javascript
async scanFile(filePath: string, options: ScanOptions): Promise<ValidationResult>
```

**Parameters**:
- `filePath` (string): Path to file to scan
- `options` (ScanOptions): Scanning options and configuration

**Returns**: `Promise<ValidationResult>` - File validation results

##### `scanPattern()`

Scans files matching a glob pattern.

```javascript
async scanPattern(pattern: string, options: ScanOptions): Promise<ValidationResult[]>
```

**Parameters**:
- `pattern` (string): Glob pattern for file matching
- `options` (ScanOptions): Scanning options and configuration

**Returns**: `Promise<ValidationResult[]>` - Results for all matching files

## VS Code Extension API

### Extension Lifecycle

#### `activate()`

Extension activation function called by VS Code.

```javascript
function activate(context: vscode.ExtensionContext): void
```

**Parameters**:
- `context` (vscode.ExtensionContext): VS Code extension context

**Example**:
```javascript
export function activate(context) {
    console.log('Chahuadev Sentinel extension activated');
    
    // Register commands and event handlers
    registerCommands(context);
    setupEventHandlers(context);
}
```

#### `deactivate()`

Extension deactivation function for cleanup.

```javascript
function deactivate(): void
```

Performs cleanup when extension is deactivated.

### Extension Commands

#### `chahuadev-sentinel.scanFile`

Scans the currently active file in VS Code.

**Command ID**: `chahuadev-sentinel.scanFile`

**Usage**: Available in Command Palette and context menus

#### `chahuadev-sentinel.scanWorkspace`

Scans all files in the current workspace.

**Command ID**: `chahuadev-sentinel.scanWorkspace`

**Usage**: Available in Command Palette and Explorer context menu

#### `chahuadev-sentinel.toggleRules`

Opens rule configuration interface.

**Command ID**: `chahuadev-sentinel.toggleRules`

**Usage**: Available in Command Palette

## Error Handling

### Error Types

#### `ValidationError`

Thrown when validation process encounters errors.

```javascript
class ValidationError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'ValidationError';
        this.details = details;
    }
}
```

#### `SecurityError`

Thrown when security violations are detected.

```javascript
class SecurityError extends Error {
    constructor(message, threatLevel) {
        super(message);
        this.name = 'SecurityError';
        this.threatLevel = threatLevel;
    }
}
```

#### `ParsingError`

Thrown when code parsing fails.

```javascript
class ParsingError extends Error {
    constructor(message, location) {
        super(message);
        this.name = 'ParsingError';
        this.location = location;
    }
}
```

### Error Handling Best Practices

```javascript
try {
    const result = await engine.validateCode(code, filePath);
    return result;
} catch (error) {
    if (error instanceof SecurityError) {
        console.error('Security violation detected:', error.message);
        // Handle security issues appropriately
    } else if (error instanceof ParsingError) {
        console.error('Code parsing failed:', error.message);
        // Provide parsing error feedback
    } else {
        console.error('Validation error:', error.message);
        // Handle general validation errors
    }
    
    throw error; // Re-throw if needed
}
```

## Performance Considerations

### Optimization Guidelines

**Caching**:
- Use AST caching for repeated validations of the same files
- Cache grammar lookups for improved performance
- Implement result caching for batch operations

**Memory Management**:
- Monitor memory usage during large file processing
- Implement streaming for very large files
- Clear caches periodically to prevent memory leaks

**Concurrency**:
- Use worker threads for CPU-intensive operations
- Implement queue management for batch processing
- Provide cancellation mechanisms for long-running operations

### Performance Monitoring

```javascript
// Example performance monitoring
const startTime = performance.now();
const result = await engine.validateCode(code, filePath);
const endTime = performance.now();

console.log(`Validation completed in ${endTime - startTime}ms`);
console.log(`Memory usage: ${JSON.stringify(process.memoryUsage())}`);
```

## Integration Examples

### Basic Validation

```javascript
import { ValidationEngine } from './src/validator.js';

async function validateProject() {
    const engine = new ValidationEngine();
    await engine.initializeParserStudy();
    
    const files = ['src/main.js', 'src/utils.js', 'src/config.js'];
    
    for (const file of files) {
        try {
            const result = await engine.validateFile(file);
            console.log(`${file}: ${result.violations.length} violations`);
        } catch (error) {
            console.error(`Failed to validate ${file}:`, error.message);
        }
    }
}

validateProject().catch(console.error);
```

### Custom Rule Implementation

```javascript
// Example custom rule
const customRule = {
    id: 'CUSTOM_NAMING_CONVENTION',
    severity: 'WARNING',
    
    check(node, context) {
        if (node.type === 'FunctionDeclaration') {
            const name = node.id.name;
            if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
                return {
                    message: `Function name should use camelCase: ${name}`,
                    location: {
                        line: node.loc.start.line,
                        column: node.loc.start.column
                    }
                };
            }
        }
        return null;
    }
};
```

### VS Code Extension Integration

```javascript
import * as vscode from 'vscode';
import { ValidationEngine } from './validator.js';

class ChahuadevSentinelProvider {
    constructor() {
        this.engine = new ValidationEngine();
    }
    
    async provideDiagnostics(document) {
        const result = await this.engine.validateCode(
            document.getText(),
            document.fileName
        );
        
        return result.violations.map(violation => {
            const range = new vscode.Range(
                violation.location.line - 1,
                violation.location.column - 1,
                violation.location.line - 1,
                violation.location.column + 10
            );
            
            const diagnostic = new vscode.Diagnostic(
                range,
                violation.message,
                vscode.DiagnosticSeverity.Error
            );
            
            diagnostic.code = violation.ruleId;
            return diagnostic;
        });
    }
}
```

---

**This API reference provides comprehensive guidance for integrating and extending Chahuadev Sentinel in various environments and use cases.**