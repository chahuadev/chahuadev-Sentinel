//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// Error Assistant - Ultimate Error Messaging System
// ============================================================================
// ระบบแจ้งข้อผิดพลาดที่ดีที่สุด พร้อมคำแนะนำและตัวอย่าง
// ============================================================================

import { GrammarIndex } from './grammar-index.js';

// ============================================================================
// ERROR TYPES
// ============================================================================

const ERROR_TYPES = {
    UNEXPECTED_TOKEN: 'unexpected-token',
    MISSING_TOKEN: 'missing-token',
    INVALID_SYNTAX: 'invalid-syntax',
    WRONG_CONTEXT: 'wrong-context',
    DEPRECATED: 'deprecated',
    TYPO: 'possible-typo',
    MISSING_IMPORT: 'missing-import',
    TYPE_ERROR: 'type-error'
};

// ============================================================================
// ERROR ASSISTANT CLASS
// ============================================================================

class ErrorAssistant {
    constructor(grammarIndex) {
        this.grammarIndex = grammarIndex || new GrammarIndex();
    }

    /**
     * Generate comprehensive error message with suggestions
     */
    generateError(errorType, context = {}) {
        const {
            token,
            expected,
            actual,
            line,
            column,
            code,
            language = 'javascript'
        } = context;

        // Get grammar information
        const grammarInfo = this.grammarIndex.lookup(token);

        // Build error object
        const error = {
            type: errorType,
            severity: 'error',
            message: this.generateMessage(errorType, context, grammarInfo),
            location: { line, column },
            token,
            suggestions: this.generateSuggestions(errorType, context, grammarInfo),
            documentation: this.getDocumentation(token, grammarInfo),
            examples: this.getExamples(token, grammarInfo),
            quickFixes: this.generateQuickFixes(errorType, context, grammarInfo),
            relatedErrors: this.getRelatedErrors(token, grammarInfo)
        };

        return error;
    }

    /**
     * Generate error message
     */
    generateMessage(errorType, context, grammarInfo) {
        const { token, expected, actual } = context;

        switch (errorType) {
            case ERROR_TYPES.UNEXPECTED_TOKEN:
                if (grammarInfo && grammarInfo.errorMessage) {
                    return grammarInfo.errorMessage;
                }
                return `Unexpected token '${token}'. Expected ${expected || 'valid syntax'}.`;

            case ERROR_TYPES.MISSING_TOKEN:
                return `Missing ${expected} token. Found '${actual}' instead.`;

            case ERROR_TYPES.INVALID_SYNTAX:
                return `Invalid syntax near '${token}'.`;

            case ERROR_TYPES.WRONG_CONTEXT:
                if (grammarInfo) {
                    const notes = grammarInfo.notes ? ` ${grammarInfo.notes}` : '';
                    return `'${token}' cannot be used here.${notes}`;
                }
                return `'${token}' is not allowed in this context.`;

            case ERROR_TYPES.DEPRECATED:
                if (grammarInfo && grammarInfo.deprecated) {
                    return `'${token}' is deprecated. ${grammarInfo.bestPractice || 'Use alternative syntax.'}`;
                }
                return `'${token}' is deprecated.`;

            case ERROR_TYPES.TYPO:
                return `Possible typo: '${token}'. Did you mean one of these?`;

            default:
                return `Syntax error near '${token}'.`;
        }
    }

    /**
     * Generate suggestions
     */
    generateSuggestions(errorType, context, grammarInfo) {
        const suggestions = [];

        // Check for common typos
        if (grammarInfo && grammarInfo.commonTypos) {
            const typos = grammarInfo.commonTypos;
            if (typos.includes(context.token)) {
                suggestions.push({
                    type: 'typo-fix',
                    message: `Did you mean '${grammarInfo.keyword || grammarInfo.operator}'?`,
                    fix: grammarInfo.keyword || grammarInfo.operator,
                    confidence: 0.9
                });
            }
        }

        // Check for alternatives
        if (grammarInfo && grammarInfo.alternatives) {
            grammarInfo.alternatives.forEach(alt => {
                suggestions.push({
                    type: 'alternative',
                    message: `Consider using '${alt}' instead`,
                    fix: alt,
                    confidence: 0.7
                });
            });
        }

        // Context-specific suggestions
        if (errorType === ERROR_TYPES.WRONG_CONTEXT) {
            if (grammarInfo && grammarInfo.requiredContext) {
                suggestions.push({
                    type: 'context-fix',
                    message: `'${context.token}' must be used in ${grammarInfo.requiredContext}`,
                    confidence: 0.8
                });
            }
        }

        // Best practice suggestions
        if (grammarInfo && grammarInfo.bestPractice) {
            suggestions.push({
                type: 'best-practice',
                message: grammarInfo.bestPractice,
                confidence: 0.6
            });
        }

        return suggestions;
    }

    /**
     * Get documentation links
     */
    getDocumentation(token, grammarInfo) {
        const docs = {
            official: null,
            mdn: null,
            spec: null,
            tutorial: null
        };

        if (!grammarInfo) return docs;

        // MDN Documentation
        if (grammarInfo.category === 'keyword' || grammarInfo.category === 'operator') {
            docs.mdn = `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/${grammarInfo.category === 'keyword' ? 'Statements' : 'Operators'
                }/${token}`;
        }

        // ECMA Spec
        if (grammarInfo.spec) {
            docs.spec = `https://tc39.es/ecma262/${grammarInfo.spec}`;
        }

        // TypeScript Documentation
        if (grammarInfo.source === 'TypeScript') {
            docs.official = `https://www.typescriptlang.org/docs/handbook/2/everyday-types.html`;
        }

        // Java Documentation
        if (grammarInfo.source === 'Java') {
            docs.official = `https://docs.oracle.com/javase/tutorial/java/nutsandbolts/keywords.html`;
        }

        return docs;
    }

    /**
     * Get code examples
     */
    getExamples(token, grammarInfo) {
        const examples = {
            good: [],
            bad: []
        };

        if (!grammarInfo) return examples;

        // Good examples
        if (grammarInfo.example) {
            examples.good.push({
                code: grammarInfo.example,
                description: 'Correct usage'
            });
        }

        if (grammarInfo.examples && Array.isArray(grammarInfo.examples)) {
            grammarInfo.examples.forEach(ex => {
                examples.good.push({
                    code: ex,
                    description: 'Valid syntax'
                });
            });
        }

        if (grammarInfo.useCases && Array.isArray(grammarInfo.useCases)) {
            grammarInfo.useCases.slice(0, 2).forEach(useCase => {
                examples.good.push({
                    description: useCase
                });
            });
        }

        // Bad examples (from quirks and common errors)
        if (grammarInfo.quirks && Array.isArray(grammarInfo.quirks)) {
            grammarInfo.quirks.slice(0, 2).forEach(quirk => {
                examples.bad.push({
                    description: quirk
                });
            });
        }

        // Generate bad examples based on disambiguation
        if (grammarInfo.disambiguation && Array.isArray(grammarInfo.disambiguation)) {
            grammarInfo.disambiguation.forEach(dis => {
                if (dis.invalid) {
                    examples.bad.push({
                        code: dis.invalid,
                        description: dis.note || 'Invalid usage'
                    });
                }
            });
        }

        return examples;
    }

    /**
     * Generate quick fixes
     */
    generateQuickFixes(errorType, context, grammarInfo) {
        const fixes = [];

        // Typo fix
        if (grammarInfo && grammarInfo.commonTypos && grammarInfo.commonTypos.includes(context.token)) {
            fixes.push({
                title: `Change '${context.token}' to '${grammarInfo.keyword || grammarInfo.operator}'`,
                edit: {
                    range: { line: context.line, column: context.column, length: context.token.length },
                    newText: grammarInfo.keyword || grammarInfo.operator
                },
                confidence: 0.9
            });
        }

        // Missing semicolon
        if (errorType === ERROR_TYPES.UNEXPECTED_TOKEN && context.expected === 'SEMICOLON') {
            fixes.push({
                title: 'Add semicolon',
                edit: {
                    range: { line: context.line, column: context.column, length: 0 },
                    newText: ';'
                },
                confidence: 0.8
            });
        }

        // Add async keyword
        if (context.token === 'await' && grammarInfo && grammarInfo.requiresAsync) {
            fixes.push({
                title: 'Add async to function',
                description: 'await can only be used in async functions',
                confidence: 0.85
            });
        }

        // Import missing module
        if (errorType === ERROR_TYPES.MISSING_IMPORT) {
            fixes.push({
                title: `Import '${context.token}'`,
                edit: {
                    range: { line: 0, column: 0, length: 0 },
                    newText: `import ${context.token} from '${context.module || context.token}';\n`
                },
                confidence: 0.7
            });
        }

        return fixes;
    }

    /**
     * Get related errors
     */
    getRelatedErrors(token, grammarInfo) {
        const related = [];

        if (!grammarInfo) return related;

        // Common mistakes
        if (grammarInfo.quirks) {
            related.push({
                title: 'Common Gotchas',
                items: grammarInfo.quirks.slice(0, 3)
            });
        }

        // Related keywords
        if (grammarInfo.relatedKeywords) {
            related.push({
                title: 'Related Keywords',
                items: grammarInfo.relatedKeywords
            });
        }

        return related;
    }

    /**
     * Format error for display
     */
    formatError(error, options = {}) {
        const { color = true, verbose = false } = options;

        let output = '';

        // Error header
        output += `\n${'='.repeat(80)}\n`;
        output += ` ${error.message}\n`;
        output += `   at Line ${error.location.line}, Column ${error.location.column}\n`;
        output += `${'='.repeat(80)}\n\n`;

        // Suggestions
        if (error.suggestions.length > 0) {
            output += ` Suggestions:\n`;
            error.suggestions.forEach((sug, idx) => {
                output += `   ${idx + 1}. ${sug.message}`;
                if (sug.fix) {
                    output += `  "${sug.fix}"`;
                }
                output += ` (${(sug.confidence * 100).toFixed(0)}% confidence)\n`;
            });
            output += '\n';
        }

        // Good examples
        if (error.examples.good.length > 0) {
            output += ` Correct Usage:\n`;
            error.examples.good.slice(0, 2).forEach(ex => {
                if (ex.code) {
                    output += `   ${ex.code}\n`;
                }
                if (ex.description) {
                    output += `   // ${ex.description}\n`;
                }
            });
            output += '\n';
        }

        // Bad examples
        if (error.examples.bad.length > 0 && verbose) {
            output += ` Common Mistakes:\n`;
            error.examples.bad.slice(0, 2).forEach(ex => {
                if (ex.code) {
                    output += `   ${ex.code}\n`;
                }
                if (ex.description) {
                    output += `   // ${ex.description}\n`;
                }
            });
            output += '\n';
        }

        // Quick fixes
        if (error.quickFixes.length > 0) {
            output += ` Quick Fixes:\n`;
            error.quickFixes.forEach((fix, idx) => {
                output += `   ${idx + 1}. ${fix.title}\n`;
                if (fix.description) {
                    output += `      ${fix.description}\n`;
                }
            });
            output += '\n';
        }

        // Documentation
        if (error.documentation.mdn || error.documentation.official) {
            output += ` Learn More:\n`;
            if (error.documentation.mdn) {
                output += `   MDN: ${error.documentation.mdn}\n`;
            }
            if (error.documentation.official) {
                output += `   Docs: ${error.documentation.official}\n`;
            }
            if (error.documentation.spec) {
                output += `   Spec: ${error.documentation.spec}\n`;
            }
            output += '\n';
        }

        output += `${'='.repeat(80)}\n`;

        return output;
    }

    /**
     * Export error to JSON
     */
    exportError(error) {
        return JSON.stringify(error, null, 2);
    }
}

// ============================================================================
// EXPORT
// ============================================================================

export { ErrorAssistant, ERROR_TYPES };

// Demo if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const assistant = new ErrorAssistant();

    // Example error
    const error = assistant.generateError(ERROR_TYPES.WRONG_CONTEXT, {
        token: 'await',
        line: 10,
        column: 5,
        language: 'javascript'
    });

    console.log(assistant.formatError(error, { verbose: true }));
}
