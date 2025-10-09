// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Grammar Index - Export all grammar modules
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ChahuadevR Engine Grammar Dictionary - Core Language Support
// ! ══════════════════════════════════════════════════════════════════════════════
// Provides complete type safety for Parser implementation
// ! ══════════════════════════════════════════════════════════════════════════════

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Base Types
// ! ══════════════════════════════════════════════════════════════════════════════

export type TokenCategory =
    | 'control'
    | 'iteration'
    | 'exception'
    | 'declaration'
    | 'primary'
    | 'operator'
    | 'module'
    | 'accessor'
    | 'statement'
    | 'reserved'
    | 'modifier'
    | 'type'
    | 'special';

export type ESVersion =
    | 'ES1'
    | 'ES3'
    | 'ES5'
    | 'ES6'
    | 'ES7'
    | 'ES8'
    | 'ES9'
    | 'ES10'
    | 'ES11'
    | 'ES12'
    | 'ES13'
    | 'ES2015'
    | 'ES2016'
    | 'ES2017'
    | 'ES2018'
    | 'ES2019'
    | 'ES2020'
    | 'ES2021'
    | 'ES2022'
    | 'ES2023'
    | 'ES2024';

export type TSVersion = '1.0' | '1.5' | '1.6' | '1.7' | '2.0' | '2.1' | '2.2' | '2.7' | '2.8' | '3.0' | '3.2' | '3.7' | '4.3' | '4.5' | '4.7' | '4.8' | '4.9' | '5.0' | '5.3';

export type JavaVersion = 'SE1.0' | 'SE1.2' | 'SE1.4' | 'SE5' | 'SE7' | 'SE8' | 'SE9' | 'SE10' | 'SE14' | 'SE15' | 'SE16' | 'SE17' | 'SE21';

export type Source = 'ECMA-262' | 'Babel' | 'TypeScript' | 'ANTLR' | 'React' | 'W3C' | 'ARIA' | 'HTML5';

export type TokenType = string;

export type Associativity = 'left' | 'right';

export type ProposalStage = 0 | 1 | 2 | 3 | 4;

export type Language = 'JavaScript' | 'TypeScript' | 'JSX' | 'Java';

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Disambiguation Rules
// ! ══════════════════════════════════════════════════════════════════════════════

export interface DisambiguationRule {
    /** Condition: token preceded by one of these types */
    ifPrecededBy?: TokenType[];

    /** Condition: token followed by one of these types */
    ifFollowedBy?: TokenType[];

    /** Condition: token NOT preceded by these types */
    ifNotPrecededBy?: TokenType[];

    /** Condition: token NOT followed by these types */
    ifNotFollowedBy?: TokenType[];

    /** Condition: must be in one of these contexts */
    parentContext?: string[];

    /** Condition: specific language constraint */
    language?: Language;

    /** Result: interpret as this token type */
    then?: string;

    /** Default rule (no conditions) */
    default?: string;

    /** Additional notes */
    notes?: string;
}

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Keyword Definition
// ! ══════════════════════════════════════════════════════════════════════════════

export interface KeywordDefinition {
    /** Token category */
    category: TokenCategory;

    /** ECMAScript version introduced */
    esVersion?: ESVersion;

    /** TypeScript version introduced */
    tsVersion?: TSVersion;

    /** Java version introduced */
    javaVersion?: JavaVersion;

    /** Authoritative source */
    source: Source;

    /** Is contextual keyword (only keyword in specific contexts) */
    contextual?: boolean;

    /** Token types that should follow this keyword */
    followedBy?: TokenType[];

    /** Token types that should precede this keyword */
    precededBy?: TokenType[];

    /** Valid parent contexts */
    parentContext?: string[];

    /** Can this token start an expression? */
    startsExpr?: boolean;

    /** Can this token appear before an expression? */
    beforeExpr?: boolean;

    /** Is this a loop construct? */
    isLoop?: boolean;

    /** Common typos for this keyword */
    commonTypos?: string[];

    /** Error message for invalid usage */
    errorMessage?: string;

    /** Additional usage notes */
    notes?: string;

    /** Special behaviors or edge cases */
    quirks?: string;

    /** Is this feature deprecated? */
    deprecated?: boolean;

    /** TC39 proposal stage (if applicable) */
    stage?: ProposalStage;
}

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Operator Definition
// ! ══════════════════════════════════════════════════════════════════════════════

export interface OperatorDefinition {
    /** Operator precedence (0-11 for binary operators) */
    precedence?: number;

    /** Operator category */
    category: string;

    /** Authoritative source */
    source: Source;

    /** ECMAScript version introduced */
    esVersion?: ESVersion;

    /** TypeScript version introduced */
    tsVersion?: TSVersion;

    /** Associativity (left-to-right or right-to-left) */
    associativity?: Associativity;

    /** Is infix operator (a + b) */
    isInfix?: boolean;

    /** Is prefix operator (+a, ++x) */
    isPrefix?: boolean;

    /** Is postfix operator (x++) */
    isPostfix?: boolean;

    /** Is assignment operator */
    isAssign?: boolean;

    /** Disambiguation rules for multi-meaning operators */
    disambiguation?: DisambiguationRule[];

    /** Additional usage notes */
    notes?: string;

    /** Error message for invalid usage */
    errorMessage?: string;

    /** TC39 proposal stage (if applicable) */
    stage?: ProposalStage;

    /** Equivalent expression (for compound operators) */
    equivalentTo?: string;
}

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Unary Operator Definition
// ! ══════════════════════════════════════════════════════════════════════════════

export interface UnaryOperatorDefinition {
    /** Operator type */
    type: 'unary' | 'update';

    /** Authoritative source */
    source: Source;

    /** ECMAScript version introduced */
    esVersion?: ESVersion;

    /** Is prefix operator */
    isPrefix?: boolean;

    /** Is postfix operator */
    isPostfix?: boolean;

    /** Valid parent contexts */
    parentContext?: string[];

    /** Additional usage notes */
    notes?: string;

    /** Common typos */
    commonTypos?: string[];

    /** Error message for invalid usage */
    errorMessage?: string;

    /** Special behaviors or edge cases */
    quirks?: string;
}

// ============================================================================
// Assignment Operator Definition
// ============================================================================

export interface AssignmentOperatorDefinition {
    /** Assignment type */
    type: 'simple' | 'compound' | 'logical';

    /** Authoritative source */
    source: Source;

    /** ECMAScript version introduced */
    esVersion?: ESVersion;

    /** Associativity (always right for assignment) */
    associativity?: 'right';

    /** Is assignment operator */
    isAssign?: true;

    /** Equivalent expression */
    equivalentTo?: string;

    /** Additional usage notes */
    notes?: string;
}

// ============================================================================
// Punctuation Definition
// ============================================================================

export interface PunctuationDefinition {
    /** Punctuation type */
    type: string;

    /** Paired character (for brackets, parens, braces) */
    pair?: string;

    /** Authoritative source */
    source: Source;

    /** ECMAScript version introduced */
    esVersion?: ESVersion;

    /** Display name */
    name?: string;

    /** Can this token start an expression? */
    startsExpr?: boolean;

    /** Can this token appear before an expression? */
    beforeExpr?: boolean;

    /** Token types that should follow */
    followedBy?: TokenType[];

    /** Token types that should precede */
    precededBy?: TokenType[];

    /** Valid parent contexts */
    parentContext?: string[];

    /** Disambiguation rules */
    disambiguation?: DisambiguationRule[];

    /** Additional usage notes */
    notes?: string;

    /** Special behaviors or edge cases */
    quirks?: string;

    /** Error message for invalid usage */
    errorMessage?: string;
}

// ============================================================================
// Literal Definition
// ============================================================================

export interface LiteralDefinition {
    /** Literal type */
    type: 'boolean' | 'null' | 'undefined' | 'string' | 'number';

    /** Literal value */
    value: any;

    /** Authoritative source */
    source: Source;
}

// ============================================================================
// Complete Grammar Structures
// ============================================================================

export interface JavaScriptGrammar {
    keywords: Record<string, KeywordDefinition>;
    literals: Record<string, LiteralDefinition>;
    operators: {
        binaryOperators: Record<string, OperatorDefinition>;
        unaryOperators: Record<string, UnaryOperatorDefinition>;
        assignmentOperators: Record<string, AssignmentOperatorDefinition>;
    };
    punctuation: Record<string, PunctuationDefinition>;
    tokenMetadata: {
        flags: Record<string, string>;
        contexts: Record<string, string>;
    };
}

export interface TypeScriptGrammar {
    typeKeywords: Record<string, KeywordDefinition>;
    modifiers: Record<string, KeywordDefinition>;
    typeOperators: Record<string, KeywordDefinition>;
    declarations: Record<string, KeywordDefinition>;
    moduleKeywords: Record<string, KeywordDefinition>;
    specialKeywords: Record<string, KeywordDefinition>;
    typeOperatorSymbols: Record<string, OperatorDefinition>;
    decorators: Record<string, OperatorDefinition>;
    syntaxKinds: {
        classifications: Record<string, string>;
    };
    tripleSlashDirectives: Record<string, { type: string; source: Source; tsVersion: TSVersion }>;
    typeCompatibility: Record<string, string>;
}

export interface JavaGrammar {
    keywords: Record<string, KeywordDefinition>;
    primitiveTypes: Record<string, { category: string; size: string; source: Source }>;
    literals: Record<string, { type: string; format?: string; suffix?: string; source: Source; javaVersion?: JavaVersion }>;
    operators: Record<string, OperatorDefinition>;
    separators: Record<string, PunctuationDefinition>;
    annotations: Record<string, { target: string; source: Source; javaVersion: JavaVersion }>;
    generics: Record<string, { type: string; name: string; source: Source; javaVersion: JavaVersion }>;
}

export interface JSXGrammar {
    elements: Record<string, { type: string; source: Source; version?: string }>;
    expressions: Record<string, { type: string; source: Source }>;
    attributes: Record<string, { htmlEquivalent?: string; eventType?: string; type?: string; source: Source; description?: string; controlled?: boolean }>;
    builtInComponents: Record<string, { source: Source; version: string; description?: string; shorthand?: string; experimental?: boolean }>;
    namespaces: Record<string, { namespace: string; source: Source }>;
    hooksPattern: { pattern: RegExp; description: string; source: Source; examples: string[] };
    componentPattern: { pattern: RegExp; description: string; source: Source; examples: string[] };
    childrenTypes: Record<string, { description: string; source: Source }>;
    specialProps: Record<string, { type: string; description: string; source: Source; required?: string }>;
    transforms: Record<string, { description: string; source: Source; pragma?: string; pragmaFrag?: string; runtime?: string; version?: string }>;
    babelOptions: Record<string, { default: any; description: string }>;
    tsxModes: Record<string, { description: string; output: string }>;
    patterns: {
        conditionalRendering: Record<string, string>;
        listRendering: Record<string, string>;
        propSpreading: Record<string, string>;
        childrenPatterns: Record<string, string>;
    };
    escaping: Record<string, string | { [key: string]: string }>;
}

// ============================================================================
// Complete Grammar Dictionary
// ============================================================================

export interface CompleteGrammar {
    javascript: JavaScriptGrammar;
    typescript: TypeScriptGrammar;
    java: JavaGrammar;
    jsx: JSXGrammar;
}

// ============================================================================
// Statistics
// ============================================================================

export interface GrammarStatistics {
    javascript: {
        keywords: number;
        literals: number;
        binaryOperators: number;
        unaryOperators: number;
        assignmentOperators: number;
        punctuation: number;
        total: number;
    };
    typescript: {
        typeKeywords: number;
        modifiers: number;
        typeOperators: number;
        declarations: number;
        moduleKeywords: number;
        specialKeywords: number;
        typeOperatorSymbols: number;
        total: number;
    };
    java: {
        keywords: number;
        primitiveTypes: number;
        literals: number;
        operators: number;
        separators: number;
        annotations: number;
        generics: number;
        total: number;
    };
    jsx: {
        elements: number;
        expressions: number;
        attributes: number;
        builtInComponents: number;
        namespaces: number;
        specialProps: number;
        transforms: number;
        total: number;
    };
}

// ============================================================================
// Validation
// ============================================================================

export interface ValidationResult {
    results: {
        javascript: Record<string, boolean>;
        typescript: Record<string, boolean>;
        java: Record<string, boolean>;
        jsx: Record<string, boolean>;
    };
    allValid: boolean;
}

// ============================================================================
// Module Exports
// ============================================================================

export const JAVASCRIPT_GRAMMAR: JavaScriptGrammar;
export const TYPESCRIPT_GRAMMAR: TypeScriptGrammar;
export const JAVA_GRAMMAR: JavaGrammar;
export const JSX_GRAMMAR: JSXGrammar;
export const COMPLETE_GRAMMAR: CompleteGrammar;
export const GRAMMAR_STATS: GrammarStatistics;
export const GRAMMAR_SOURCES: Record<string, string[]>;

export function validateGrammarCompleteness(): ValidationResult;

export default CompleteGrammar;
