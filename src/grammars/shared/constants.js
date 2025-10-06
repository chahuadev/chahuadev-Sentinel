// src/grammars/shared/constants.js
// ! NO_HARDCODE: Central repository for all rule IDs and constant values
// ! ป้องกันการพิมพ์ผิด ruleId และจัดการ constants จากที่เดียว

/**
 * Absolute Rule IDs - 5 กฎเหล็กของ Chahuadev
 */
export const RULE_IDS = {
    NO_MOCKING: 'NO_MOCKING',
    NO_HARDCODE: 'NO_HARDCODE', 
    NO_SILENT_FALLBACKS: 'NO_SILENT_FALLBACKS',
    NO_INTERNAL_CACHING: 'NO_INTERNAL_CACHING',
    NO_EMOJI: 'NO_EMOJI'
};

/**
 * System Error Types
 */
export const ERROR_TYPES = {
    SYNTAX_ERROR: 'SYNTAX_ERROR',
    PARSER_ERROR: 'PARSER_ERROR',
    TOKENIZER_ERROR: 'TOKENIZER_ERROR',
    AST_ERROR: 'AST_ERROR',
    MEMORY_ERROR: 'MEMORY_ERROR'
};

/**
 * Violation Severity Levels
 */
export const SEVERITY_LEVELS = {
    CRITICAL: 'CRITICAL',
    ERROR: 'ERROR', 
    WARNING: 'WARNING',
    INFO: 'INFO'
};

/**
 * Token Types สำหรับ Tokenizer
 */
export const TOKEN_TYPES = {
    STRING: 'STRING',
    COMMENT: 'COMMENT',
    NUMBER: 'NUMBER',
    IDENTIFIER: 'IDENTIFIER',
    OPERATOR: 'OPERATOR',
    WHITESPACE: 'WHITESPACE',
    KEYWORD: 'KEYWORD'
};

/**
 * Engine Modes
 */
export const ENGINE_MODES = {
    FULL_PERFORMANCE: 'FULL_PERFORMANCE',
    NO_FALLBACK_MODE: 'NO_FALLBACK_MODE',
    LEGACY_MODE: 'LEGACY_MODE'
};

/**
 * Default Locations สำหรับ Error Reporting
 */
export const DEFAULT_LOCATION = { line: 0, column: 0 };

/**
 * Memory Protection Limits
 */
export const MEMORY_LIMITS = {
    MAX_TOKENS: 50000,
    MAX_AST_NODES: 10000,
    MAX_FILE_SIZE: 500000,
    CHUNK_SIZE: 10000
};

/**
 * Validation Thresholds
 */
export const VALIDATION_THRESHOLDS = {
    MIN_HARDCODE_LENGTH: 10,
    MIN_CREDENTIAL_LENGTH: 20,
    MAX_NESTING_DEPTH: 20,
    MAX_LINE_LENGTH: 1000
};

// Freeze objects เพื่อป้องกันการแก้ไข
Object.freeze(RULE_IDS);
Object.freeze(ERROR_TYPES);  
Object.freeze(SEVERITY_LEVELS);
Object.freeze(TOKEN_TYPES);
Object.freeze(ENGINE_MODES);
Object.freeze(MEMORY_LIMITS);
Object.freeze(VALIDATION_THRESHOLDS);