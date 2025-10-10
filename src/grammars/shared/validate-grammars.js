// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https:// ! github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================
// !  Grammar Validation & Linting Tool
// !  ============================================================================
// !  ตรวจสอบความถูกต้องและความสอดคล้องของไฟล์แกรมม่าทั้งหมด
// !  ============================================================================

// Grammar Validation Module
// Ensures all grammars are correctly loaded before use

import errorHandler from '../../error-handler/ErrorHandler.js';

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load grammars from JSON (Pure Data)
const JAVASCRIPT_GRAMMAR = JSON.parse(readFileSync(join(__dirname, '../javascript.grammar.json'), 'utf8'));
const TYPESCRIPT_GRAMMAR = JSON.parse(readFileSync(join(__dirname, '../typescript.grammar.json'), 'utf8'));
const JAVA_GRAMMAR = JSON.parse(readFileSync(join(__dirname, '../java.grammar.json'), 'utf8'));
const JSX_GRAMMAR = JSON.parse(readFileSync(join(__dirname, '../jsx.grammar.json'), 'utf8'));

// Load config
const config = JSON.parse(readFileSync(join(__dirname, './parser-config.json'), 'utf8'));

const VALIDATION_CONFIG = config.validationReporting;

// !  ============================================================================
// !  VALIDATION RULES
// !  ============================================================================

const REQUIRED_KEYWORD_FIELDS = [
    'category',
    'source',
    'description',
    'followedBy',
    'precededBy',
    'parentContext',
    'disambiguation',
    'errorMessage',
    'commonTypos',
    'notes',
    'quirks',
    'stage',
    'example'
];

const VALID_CATEGORIES = [
    'keyword', 'operator', 'literal', 'identifier', 'punctuation',
    'control', 'iteration', 'exception', 'function', 'declaration',
    'modifier', 'type', 'module', 'primary', 'statement',
    'jsx-element', 'jsx-expression', 'jsx-fragment', 'jsx-spread',
    'react-component', 'react-pattern'
];

const VALID_STAGES = ['stable', 'experimental', 'deprecated', 'legacy'];

const VALID_TOKEN_TYPES = [
    'IDENTIFIER', 'LITERAL', 'STRING', 'NUMBER', 'BOOLEAN',
    'KEYWORD', 'OPERATOR', 'PUNCTUATION', 'WHITESPACE', 'NEWLINE',
    'COMMENT', 'EOF', 'ERROR',
    'PAREN_OPEN', 'PAREN_CLOSE', 'BRACE_OPEN', 'BRACE_CLOSE',
    'BRACKET_OPEN', 'BRACKET_CLOSE', 'SEMICOLON', 'COMMA', 'DOT',
    'COLON', 'QUESTION', 'ARROW', 'SPREAD', 'STAR', 'PLUS', 'MINUS',
    'SLASH', 'PERCENT', 'AMPERSAND', 'PIPE', 'CARET', 'TILDE',
    'EXCLAMATION', 'EQUALS', 'LESS_THAN', 'GREATER_THAN',
    'UPPERCASE_IDENTIFIER', 'Expression', 'Statement', 'Declaration',
    'BlockStatement', 'FunctionDeclaration', 'ClassDeclaration',
    'JSXElement', 'JSXText', 'JSXExpression', 'Fragment'
];

// !  ============================================================================
// !  VALIDATION ERRORS
// !  ============================================================================

class ValidationError {
    constructor(type, grammar, keyword, field, message, severity = 'error') {
        this.type = type;
        this.grammar = grammar;
        this.keyword = keyword;
        this.field = field;
        this.message = message;
        this.severity = severity; // !  'error', 'warning', 'info'
    }

    toString() {
        const icon = this.severity === 'error' ? 'ERROR' : this.severity === 'warning' ? 'WARN' : 'INFO';
        return `${icon} [${this.grammar}] "${this.keyword}" ${this.field ? `(${this.field})` : ''}: ${this.message}`;
    }
}

// !  ============================================================================
// !  VALIDATOR CLASS
// !  ============================================================================

class GrammarValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.stats = {
            totalKeywords: 0,
            validKeywords: 0,
            invalidKeywords: 0,
            missingFields: 0,
            invalidReferences: 0,
            duplicates: 0
        };
    }

    /**
     * ! Validate all grammars
     */
    validateAll() {
        console.log(' Starting Grammar Validation...\n');

        this.validateGrammar('JavaScript', JAVASCRIPT_GRAMMAR);
        this.validateGrammar('TypeScript', TYPESCRIPT_GRAMMAR);
        this.validateGrammar('Java', JAVA_GRAMMAR);
        this.validateGrammar('JSX', JSX_GRAMMAR);

        this.printReport();
    }

    /**
     * ! Validate a single grammar
     */
    validateGrammar(name, grammar) {
        console.log(` Validating ${name} Grammar...`);

        // !  Handle different grammar structures
        if (name === 'JSX') {
            this.validateJSXGrammar(name, grammar);
        } else {
            this.validateStandardGrammar(name, grammar);
        }
    }

    /**
     * ! Validate standard grammar (JS, TS, Java)
     */
    validateStandardGrammar(grammarName, grammar) {
        const allKeywords = new Set();

        // !  Iterate through all sections
        for (const [sectionName, section] of Object.entries(grammar)) {
            if (typeof section !== 'object' || section === null) continue;

            for (const [keyword, definition] of Object.entries(section)) {
                this.stats.totalKeywords++;

                // !  Check for duplicates
                if (allKeywords.has(keyword)) {
                    this.addError('duplicate', grammarName, keyword, null,
                        `Keyword "${keyword}" is declared multiple times`);
                    this.stats.duplicates++;
                } else {
                    allKeywords.add(keyword);
                }

                // !  Validate keyword definition
                this.validateKeywordDefinition(grammarName, keyword, definition);
            }
        }
    }

    /**
     * ! Validate JSX grammar (different structure)
     */
    validateJSXGrammar(grammarName, grammar) {
        for (const [sectionName, section] of Object.entries(grammar)) {
            if (typeof section !== 'object' || section === null) continue;

            for (const [item, definition] of Object.entries(section)) {
                this.stats.totalKeywords++;
                this.validateKeywordDefinition(grammarName, item, definition);
            }
        }
    }

    /**
     * ! Validate individual keyword definition
     */
    validateKeywordDefinition(grammarName, keyword, definition) {
        let hasErrors = false;

        // !  1. Check required fields
        for (const field of REQUIRED_KEYWORD_FIELDS) {
            if (!(field in definition)) {
                this.addWarning('missing-field', grammarName, keyword, field,
                    `Missing required field: ${field}`);
                this.stats.missingFields++;
                hasErrors = true;
            }
        }

        // !  2. Validate category
        if (definition.category && !VALID_CATEGORIES.includes(definition.category)) {
            this.addWarning('invalid-category', grammarName, keyword, 'category',
                `Invalid category: ${definition.category}`);
        }

        // !  3. Validate stage
        if (definition.stage && !VALID_STAGES.includes(definition.stage)) {
            this.addWarning('invalid-stage', grammarName, keyword, 'stage',
                `Invalid stage: ${definition.stage}`);
        }

        // !  4. Validate followedBy references
        if (definition.followedBy && Array.isArray(definition.followedBy)) {
            for (const token of definition.followedBy) {
                if (!VALID_TOKEN_TYPES.includes(token)) {
                    this.addInfo('unknown-token', grammarName, keyword, 'followedBy',
                        `Unknown token type: ${token}`);
                }
            }
        }

        // !  5. Validate precededBy references
        if (definition.precededBy && Array.isArray(definition.precededBy)) {
            for (const token of definition.precededBy) {
                if (!VALID_TOKEN_TYPES.includes(token)) {
                    this.addInfo('unknown-token', grammarName, keyword, 'precededBy',
                        `Unknown token type: ${token}`);
                }
            }
        }

        // !  6. Validate disambiguation array
        if (definition.disambiguation && !Array.isArray(definition.disambiguation)) {
            this.addError('invalid-disambiguation', grammarName, keyword, 'disambiguation',
                `disambiguation must be an array`);
            hasErrors = true;
        }

        // !  7. Validate commonTypos array
        if (definition.commonTypos && !Array.isArray(definition.commonTypos)) {
            this.addError('invalid-typos', grammarName, keyword, 'commonTypos',
                `commonTypos must be an array`);
            hasErrors = true;
        }

        // !  8. Validate quirks array
        if (definition.quirks && !Array.isArray(definition.quirks)) {
            this.addError('invalid-quirks', grammarName, keyword, 'quirks',
                `quirks must be an array`);
            hasErrors = true;
        }

        // !  9. Check for example
        if (!definition.example && !definition.examples) {
            this.addWarning('missing-example', grammarName, keyword, 'example',
                `Missing example or examples field`);
        }

        // !  10. Validate useCases array
        if (definition.useCases && !Array.isArray(definition.useCases)) {
            this.addWarning('invalid-usecases', grammarName, keyword, 'useCases',
                `useCases should be an array`);
        }

        // !  Update stats
        if (hasErrors) {
            this.stats.invalidKeywords++;
        } else {
            this.stats.validKeywords++;
        }
    }

    /**
     * ! Add error
     */
    addError(type, grammar, keyword, field, message) {
        const error = new ValidationError(type, grammar, keyword, field, message, 'error');
        this.errors.push(error);
    }

    /**
     * ! Add warning
     */
    addWarning(type, grammar, keyword, field, message) {
        const warning = new ValidationError(type, grammar, keyword, field, message, 'warning');
        this.warnings.push(warning);
    }

    /**
     * ! Add info
     */
    addInfo(type, grammar, keyword, field, message) {
        const info = new ValidationError(type, grammar, keyword, field, message, 'info');
        this.info.push(info);
    }

    /**
     * ! Print validation report
     */
    printReport() {
        console.log('\n' + '='.repeat(80));
        console.log(' VALIDATION REPORT');
        console.log('='.repeat(80) + '\n');

        // !  Print stats
        console.log(' Statistics:');
        console.log(`   Total Keywords: ${this.stats.totalKeywords}`);
        console.log(`    Valid: ${this.stats.validKeywords}`);
        console.log(`    Invalid: ${this.stats.invalidKeywords}`);
        console.log(`     Missing Fields: ${this.stats.missingFields}`);
        console.log(`    Duplicates: ${this.stats.duplicates}`);
        console.log('');

        // !  Print errors
        if (this.errors.length > 0) {
            console.log(' ERRORS:');
            this.errors.forEach(error => console.log(`   ${error.toString()}`));
            console.log('');
        }

        // !  Print warnings
        if (this.warnings.length > 0) {
            console.log('  WARNINGS:');
            this.warnings.slice(0, VALIDATION_CONFIG.maxWarnings).forEach(warning => console.log(`   ${warning.toString()}`));
            if (this.warnings.length > VALIDATION_CONFIG.maxWarnings) {
                console.log(`   ... and ${this.warnings.length - VALIDATION_CONFIG.maxWarnings} more warnings`);
            }
            console.log('');
        }

        // !  Print info
        if (this.info.length > 0) {
            console.log('   INFO:');
            this.info.slice(0, VALIDATION_CONFIG.maxInfoMessages).forEach(info => console.log(`   ${info.toString()}`));
            if (this.info.length > VALIDATION_CONFIG.maxInfoMessages) {
                console.log(`   ... and ${this.info.length - VALIDATION_CONFIG.maxInfoMessages} more info messages`);
            }
            console.log('');
        }

        // !  Final verdict
        console.log('='.repeat(80));
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log(' ALL GRAMMARS ARE VALID! ');
        } else if (this.errors.length === 0) {
            console.log('  GRAMMARS ARE VALID WITH WARNINGS');
        } else {
            console.log(' GRAMMARS HAVE ERRORS - NEEDS FIXING');
        }
        console.log('='.repeat(80) + '\n');

        // !  Return validation result
        return {
            valid: this.errors.length === 0,
            errors: this.errors.length,
            warnings: this.warnings.length,
            info: this.info.length,
            stats: this.stats
        };
    }
}

// !  ============================================================================
// !  EXPORT
// !  ============================================================================

export { GrammarValidator, ValidationError };

// !  Run validation if executed directly
if (import.meta.url === `file:// ! ${process.argv[1]}`) {
    const validator = new GrammarValidator();
    const result = validator.validateAll();
    process.exit(result.valid ? 0 : 1);
}
