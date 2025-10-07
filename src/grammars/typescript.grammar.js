//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// TypeScript Grammar Dictionary
// ============================================================================
// ครอบคลุม: TypeScript 1.0 - 5.x
// ============================================================================

export const TYPESCRIPT_GRAMMAR = {
    // ============================================================================
    // TYPE KEYWORDS - TypeScript Compiler textToKeywordObj
    // ============================================================================
    typeKeywords: {
        // Primitive Types
        'any': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Type that disables type checking - allows any value',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'AMPERSAND', 'BRACKET_CLOSE', 'PAREN_CLOSE', 'SEMICOLON'],
            precededBy: ['COLON', 'LESS_THAN', 'PIPE', 'AMPERSAND', 'EQUALS', 'EXTENDS', 'AS'],
            parentContext: ['TypeAnnotation', 'TypeParameter', 'UnionType', 'IntersectionType', 'TypeAlias', 'InterfaceDeclaration'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isTopType: true,
            canBeNull: true,
            canBeUndefined: true,
            assignableToAll: true,
            allAssignableToThis: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'In type position only - not a value',
                    context: 'Type annotation',
                    ifPrecededBy: ['COLON', 'LESS_THAN', 'AS'],
                    note: 'Cannot be used as variable name in strict mode'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Type 'any' disables type checking. Consider using 'unknown' for type-safe dynamic values.",
            commonTypos: ['anu', 'ayn', 'anny', 'anyy'],
            notes: 'Using "any" opts out of type checking. Use "unknown" for safer type-unsafe code.',
            quirks: [
                'Disables all type checking',
                'Should be avoided in strict TypeScript',
                'Can cause runtime errors',
                'Defeats the purpose of TypeScript'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Avoid "any". Use "unknown" for truly dynamic types that require runtime checking.',
            alternatives: ['unknown', 'T extends Record<string, unknown>'],
            useCases: [
                'Migrating JavaScript to TypeScript',
                'Third-party libraries without types',
                'Temporary placeholder during development'
            ],
            securityNote: 'Can hide type errors that lead to security vulnerabilities',
            lintRules: ['@typescript-eslint/no-explicit-any', '@typescript-eslint/no-unsafe-assignment']
        },

        'unknown': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '3.0',
            description: 'Type-safe alternative to any - requires type narrowing before use',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'AMPERSAND', 'BRACKET_CLOSE', 'PAREN_CLOSE', 'SEMICOLON'],
            precededBy: ['COLON', 'LESS_THAN', 'PIPE', 'AMPERSAND', 'EQUALS', 'EXTENDS', 'AS'],
            parentContext: ['TypeAnnotation', 'TypeParameter', 'UnionType', 'IntersectionType', 'CatchClause'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isTopType: true,
            requiresTypeNarrowing: true,
            requiresTypeGuard: true,
            canBeNull: true,
            canBeUndefined: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Top type that requires narrowing',
                    context: 'Safer than "any"',
                    note: 'Cannot perform operations without type guards'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Type 'unknown' requires type narrowing (typeof, instanceof, type guards) before use.",
            commonTypos: ['unknow', 'unkown', 'uknown', 'unknwon'],
            notes: 'Safer than "any" - forces explicit type checking before operations.',
            quirks: [
                'Cannot directly access properties',
                'Cannot call as function',
                'Cannot perform arithmetic operations',
                'Requires type narrowing for all operations'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use "unknown" instead of "any" for type-unsafe values. Always narrow before use.',
            useCases: [
                'API responses with unknown structure',
                'User input validation',
                'Error handling (catch clause)',
                'Generic constraints for truly dynamic data'
            ],
            typeNarrowingMethods: [
                'typeof checks',
                'instanceof checks',
                'Custom type guards (x is Type)',
                'Assertion functions'
            ],
            example: 'function parse(json: string): unknown { return JSON.parse(json); }'
        },

        'never': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '2.0',
            description: 'Bottom type - represents values that never occur',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'SEMICOLON', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['COLON', 'ARROW', 'PIPE', 'EQUALS', 'EXTENDS'],
            parentContext: ['ReturnType', 'TypeAnnotation', 'UnionType', 'ConditionalType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isBottomType: true,
            isUninhabited: true,
            assignableToAll: true,
            nothingAssignableToThis: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Bottom type - subtype of all types',
                    context: 'Unreachable code or exhaustiveness checking',
                    note: 'Functions that never return have return type "never"'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Type 'never' represents unreachable code or impossible values.",
            commonTypos: ['nerver', 'nevar', 'nevr', 'nver'],
            notes: 'Used for functions that never return (throw errors, infinite loops) or unreachable code branches.',
            quirks: [
                'Subtype of every type',
                'No type is subtype of never (except never itself)',
                'Union with never is eliminated: T | never = T',
                'Intersection with never is never: T & never = never'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use for exhaustiveness checking in switch statements and impossible return types.',
            useCases: [
                'Functions that throw errors: function fail(): never { throw new Error(); }',
                'Functions with infinite loops: function forever(): never { while(true) {} }',
                'Exhaustiveness checking in discriminated unions',
                'Unreachable code branches',
                'Type-level programming (filtering unions)'
            ],
            example: 'const exhaustiveCheck = (x: never): never => { throw new Error(); }',
            typeTheory: 'Bottom type () in type theory - empty set of values'
        },

        'void': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Absence of a value - typically function return type',

            // 1. Syntactic Relationships
            followedBy: ['SEMICOLON', 'PAREN_CLOSE', 'GREATER_THAN', 'COMMA', 'BRACE_OPEN'],
            precededBy: ['COLON', 'ARROW', 'PAREN_OPEN'],
            parentContext: ['ReturnType', 'TypeAnnotation', 'FunctionDeclaration'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isReturnType: true,
            isUnitType: true,
            representsAbsence: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'As type: absence of return value. As operator: evaluates to undefined.',
                    context: 'Type position vs expression position',
                    ifPrecededBy: ['COLON', 'ARROW'],
                    note: 'Type "void" vs operator "void"'
                },
                {
                    language: 'JavaScript',
                    rule: 'void operator evaluates expression and returns undefined',
                    context: 'Expression position: void 0',
                    note: 'Different from TypeScript type void'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Type 'void' should only be used for function return types. Variables should use 'undefined'.",
            commonTypos: ['viod', 'voud', 'vod', 'vooid'],
            notes: 'Use for functions that don\'t return a value. For variables, use "undefined" instead.',
            quirks: [
                'void is assignable to undefined',
                'Only undefined is assignable to void',
                'void 0 is common pattern for getting undefined',
                'Callback return types often use void'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use void for function return types. Use undefined for variable types.',
            useCases: [
                'Function returns nothing: function log(): void {}',
                'Callback returns are ignored: callback: () => void',
                'Promise<void> for async functions that return nothing',
                'Event handlers: onClick: (e: Event) => void'
            ],
            vsUndefined: 'void means "ignore return value", undefined means "explicitly returns undefined"',
            example: 'function performAction(): void { console.log("done"); }'
        },

        'boolean': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'True or false value type',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'SEMICOLON', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['COLON', 'LESS_THAN', 'PIPE', 'AMPERSAND', 'EQUALS'],
            parentContext: ['TypeAnnotation', 'TypeParameter', 'UnionType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isPrimitive: true,
            hasLiteralTypes: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Lowercase "boolean" is TypeScript type, uppercase "Boolean" is JavaScript wrapper',
                    context: 'Type annotation',
                    note: 'Always use lowercase in TypeScript'
                }
            ],

            // 4. Error Reporting
            errorMessage: 'Use lowercase "boolean" type, not uppercase "Boolean" wrapper.',
            commonTypos: ['Boolean', 'boolan', 'boolearn', 'bool', 'boolen'],
            notes: 'Use lowercase "boolean", not "Boolean". Represents primitive boolean values.',
            quirks: [
                'boolean !== Boolean (wrapper object)',
                'Union of true | false',
                'Truthiness in JavaScript affects boolean operations',
                'Literal types: true, false are subtypes of boolean'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use literal types (true | false) for more precise typing when possible.',
            literalTypes: ['true', 'false'],
            useCases: [
                'Conditional flags',
                'Binary state representation',
                'Control flow conditions',
                'Function predicate returns'
            ],
            jsEquivalent: 'boolean primitive',
            example: 'const isActive: boolean = true;'
        },

        'number': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Numeric value type (integers and floats)',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'SEMICOLON', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['COLON', 'LESS_THAN', 'PIPE', 'AMPERSAND', 'EQUALS'],
            parentContext: ['TypeAnnotation', 'TypeParameter', 'UnionType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isPrimitive: true,
            hasLiteralTypes: true,
            isNumeric: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Lowercase "number" is type, uppercase "Number" is wrapper',
                    context: 'Type annotation',
                    note: 'Always use lowercase'
                }
            ],

            // 4. Error Reporting
            errorMessage: 'Use lowercase "number" type, not uppercase "Number" wrapper.',
            commonTypos: ['Number', 'numbr', 'numer', 'num', 'nmber'],
            notes: 'Use lowercase "number", not "Number". Includes integers, floats, Infinity, NaN.',
            quirks: [
                'Includes NaN and Infinity',
                'IEEE 754 double-precision floating-point',
                'Safe integer range: -(2^53-1) to (2^53-1)',
                'Literal types: 0, 1, 42, 3.14 are subtypes of number'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use number for general numeric values. Use bigint for values beyond safe integer range.',
            literalTypes: ['Numeric literals: 0, 1, 42, 3.14, -5, 1e10'],
            useCases: [
                'Counters and indices',
                'Measurements and calculations',
                'Timestamps (milliseconds)',
                'Percentages and ratios'
            ],
            relatedTypes: ['bigint', 'numeric literal types'],
            jsEquivalent: 'number primitive (IEEE 754)',
            example: 'const count: number = 42;',
            specialValues: ['NaN', 'Infinity', '-Infinity', '+0', '-0']
        },

        'string': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Text value type',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'SEMICOLON', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['COLON', 'LESS_THAN', 'PIPE', 'AMPERSAND', 'EQUALS'],
            parentContext: ['TypeAnnotation', 'TypeParameter', 'UnionType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isPrimitive: true,
            hasLiteralTypes: true,
            hasTemplateTypes: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Lowercase "string" is type, uppercase "String" is wrapper',
                    context: 'Type annotation',
                    note: 'Always use lowercase'
                }
            ],

            // 4. Error Reporting
            errorMessage: 'Use lowercase "string" type, not uppercase "String" wrapper.',
            commonTypos: ['String', 'strng', 'stirng', 'str', 'strin'],
            notes: 'Use lowercase "string", not "String". Represents primitive string values.',
            quirks: [
                'Immutable sequence of UTF-16 code units',
                'Template literal types in TypeScript 4.1+',
                'String literal types are subtypes',
                'Empty string "" is valid string literal type'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use string literal types or template literal types for more precise typing.',
            literalTypes: [
                'String literals: "hello", "world"',
                'Template literals: `${string}-${number}`'
            ],
            useCases: [
                'Text content',
                'Identifiers and keys',
                'URLs and paths',
                'JSON strings'
            ],
            relatedTypes: ['string literal types', 'template literal types'],
            jsEquivalent: 'string primitive (UTF-16)',
            example: 'const name: string = "TypeScript";',
            templateLiteralTypes: 'Available since TypeScript 4.1'
        },

        'bigint': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '3.2',
            description: 'Arbitrary precision integer type',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'SEMICOLON', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['COLON', 'LESS_THAN', 'PIPE', 'AMPERSAND', 'EQUALS'],
            parentContext: ['TypeAnnotation', 'TypeParameter', 'UnionType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isPrimitive: true,
            hasLiteralTypes: true,
            isNumeric: true,
            requiresES2020: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Lowercase "bigint" is type, uppercase "BigInt" is constructor',
                    context: 'Type annotation vs value',
                    note: 'Use lowercase for type, uppercase for construction'
                }
            ],

            // 4. Error Reporting
            errorMessage: 'Use lowercase "bigint" for type annotation. Requires ES2020 target.',
            commonTypos: ['BigInt', 'bigInt', 'big_int', 'bignit', 'bigInt'],
            notes: 'Requires ES2020 or later. Use "n" suffix for bigint literals (e.g., 9007199254740991n).',
            quirks: [
                'Cannot mix with number in arithmetic',
                'No fraction or exponent',
                'Literals use "n" suffix: 100n',
                'Precision limited only by memory',
                'No implicit conversion from number'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use bigint for integers beyond Number.MAX_SAFE_INTEGER (2^53-1).',
            literalTypes: ['Bigint literals: 0n, 100n, 9007199254740991n'],
            useCases: [
                'Large integers beyond safe integer range',
                'Cryptography and hashing',
                'High-precision calculations',
                'Database IDs (64-bit integers)'
            ],
            relatedTypes: ['number'],
            jsEquivalent: 'bigint primitive (ES2020)',
            example: 'const huge: bigint = 9007199254740991n;',
            compilerTarget: 'ES2020 or later',
            limitations: ['Cannot use with Math methods', 'Cannot mix with number']
        },

        'symbol': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '2.0',
            description: 'Unique and immutable identifier type',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'SEMICOLON', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['COLON', 'LESS_THAN', 'PIPE', 'AMPERSAND', 'EQUALS', 'typeof', 'unique'],
            parentContext: ['TypeAnnotation', 'TypeParameter', 'UnionType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isPrimitive: true,
            isUnique: true,
            canBeUnique: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Lowercase "symbol" is general type, "unique symbol" is specific type',
                    context: 'Type annotation',
                    note: 'unique symbol requires const or readonly'
                }
            ],

            // 4. Error Reporting
            errorMessage: 'Use lowercase "symbol" type, not uppercase "Symbol" constructor.',
            commonTypos: ['Symbol', 'symbl', 'simbol', 'symboll'],
            notes: 'Use lowercase "symbol", not "Symbol". Each symbol value is unique.',
            quirks: [
                'Every symbol is unique',
                'Symbol() !== Symbol() always true',
                'Used as object property keys',
                'Not enumerable in for...in',
                'unique symbol for nominal typing'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use "unique symbol" with const for nominal typing and branded types.',
            useCases: [
                'Unique object property keys',
                'Private class properties (pre-# syntax)',
                'Branded types (nominal typing)',
                'Well-known symbols (Symbol.iterator, Symbol.toStringTag)'
            ],
            relatedTypes: ['unique symbol'],
            jsEquivalent: 'symbol primitive (ES2015)',
            example: 'const sym: symbol = Symbol("key");',
            uniqueSymbol: 'const sym: unique symbol = Symbol(); // More specific type',
            wellKnownSymbols: ['Symbol.iterator', 'Symbol.asyncIterator', 'Symbol.toStringTag']
        },

        'object': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '2.2',
            description: 'Non-primitive type (excludes primitives)',

            // 1. Syntactic Relationships
            followedBy: ['COMMA', 'GREATER_THAN', 'PIPE', 'SEMICOLON', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['COLON', 'LESS_THAN', 'PIPE', 'AMPERSAND', 'EQUALS', 'EXTENDS'],
            parentContext: ['TypeAnnotation', 'TypeParameter', 'UnionType', 'Constraint'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isNonPrimitive: true,
            excludesPrimitives: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Lowercase "object" excludes primitives, uppercase "Object" does not',
                    context: 'Type annotation',
                    note: 'object !== Object !== {}'
                },
                {
                    language: 'TypeScript',
                    rule: 'object vs {} vs Object',
                    differences: [
                        'object: non-primitive (excludes string, number, boolean, bigint, symbol, null, undefined)',
                        'Object: includes primitives (boxed)',
                        '{}: empty object type (allows anything except null/undefined)'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Type 'object' is too general. Use specific interface or type literal instead.",
            commonTypos: ['Object', 'obj', 'objet', 'objct'],
            notes: 'Lowercase "object" excludes all primitives. Use specific interfaces for better type safety.',
            quirks: [
                'Excludes: string, number, boolean, bigint, symbol, null, undefined',
                'Includes: objects, arrays, functions, classes',
                'object !== Object !== {}',
                'Avoid using "object" - use specific types'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Avoid generic "object" type. Use specific interfaces, type literals, or Record<K, V>.',
            alternatives: [
                'Record<string, unknown>',
                'Specific interface',
                'Type literal: { prop: type }',
                '{ [key: string]: any } for index signature'
            ],
            useCases: [
                'Generic constraint to exclude primitives',
                'Weak typing for truly dynamic objects',
                'Object.create() return type'
            ],
            vsObject: 'object excludes primitives, Object includes boxed primitives',
            vsEmptyObject: '{} allows all values except null/undefined',
            example: 'function accepts(obj: object) {} // Excludes primitives'
        },

        'null': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Null value type - intentional absence',

            // 1. Syntactic Relationships
            followedBy: ['PIPE', 'SEMICOLON', 'COMMA', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['PIPE', 'COLON', 'EQUALS'],
            parentContext: ['UnionType', 'TypeAnnotation', 'LiteralType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isLiteral: true,
            isNullable: true,
            isUnitType: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Type "null" vs value null',
                    context: 'Type position vs value position',
                    note: 'strictNullChecks affects behavior'
                }
            ],

            // 4. Error Reporting
            errorMessage: 'Use strictNullChecks for proper null handling. Avoid checking with == (use ===).',
            commonTypos: ['nul', 'NULL', 'Null', 'nill'],
            notes: 'Represents intentional absence. Use strictNullChecks compiler option for safety.',
            quirks: [
                'null == undefined (loose equality)',
                'null !== undefined (strict equality)',
                'typeof null === "object" (JavaScript quirk)',
                'strictNullChecks required for proper null safety'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Enable strictNullChecks. Use null for intentional absence, undefined for uninitialized.',
            useCases: [
                'Intentional absence of object value',
                'API responses with null fields',
                'Optional values: T | null',
                'Nullable references'
            ],
            strictNullChecks: 'Required for type safety',
            vsUndefined: 'null = intentional absence, undefined = uninitialized',
            jsEquivalent: 'null primitive',
            example: 'let value: string | null = null;'
        },

        'undefined': {
            category: 'type',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Undefined value type - uninitialized or missing',

            // 1. Syntactic Relationships
            followedBy: ['PIPE', 'SEMICOLON', 'COMMA', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
            precededBy: ['PIPE', 'COLON', 'EQUALS'],
            parentContext: ['UnionType', 'TypeAnnotation', 'LiteralType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isType: true,
            isLiteral: true,
            isNullable: true,
            isUnitType: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Type "undefined" vs value undefined vs void',
                    context: 'Type vs value vs operator',
                    note: 'void returns undefined but types differently'
                }
            ],

            // 4. Error Reporting
            errorMessage: 'Use strictNullChecks for proper undefined handling. Distinguish from void.',
            commonTypos: ['undefind', 'undifined', 'undefned', 'undef'],
            notes: 'Represents uninitialized value. Use strictNullChecks for safety.',
            quirks: [
                'Default value of uninitialized variables',
                'Return value of void functions (at runtime)',
                'null == undefined (loose equality)',
                'null !== undefined (strict equality)',
                'void operator returns undefined'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Enable strictNullChecks. Use undefined for optional parameters, null for intentional absence.',
            useCases: [
                'Optional function parameters',
                'Uninitialized variables',
                'Missing object properties',
                'Optional values: T | undefined (same as T?)'
            ],
            strictNullChecks: 'Required for type safety',
            vsNull: 'undefined = uninitialized, null = intentional absence',
            vsVoid: 'undefined is value/type, void is type only (ignores return)',
            jsEquivalent: 'undefined primitive',
            example: 'let value: string | undefined;',
            optionalSyntax: 'param?: string  // Same as param: string | undefined'
        },
    },

    // ============================================================================
    // MODIFIER KEYWORDS - TypeScript Compiler
    // ============================================================================
    modifiers: {
        // Access Modifiers
        'public': {
            category: 'access',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Public accessibility modifier - accessible everywhere',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'static', 'readonly', 'async', 'abstract', 'get', 'set', 'ASTERISK'],
            precededBy: ['WHITESPACE', 'NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['ClassDeclaration', 'ClassMethod', 'ClassProperty', 'Constructor', 'ParameterProperty'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isAccessModifier: true,
            appliesTo: ['class members', 'constructor parameters'],
            canCombineWith: ['static', 'readonly', 'async', 'abstract', 'override'],
            mutuallyExclusive: ['private', 'protected'],
            isDefault: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'In class members only - not interfaces',
                    context: 'Class declaration',
                    ifFollowedBy: ['IDENTIFIER', 'static', 'readonly'],
                    note: 'Default accessibility if not specified'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Access modifier 'public' can only be used on class members.",
            commonTypos: ['pubilc', 'publc', 'pubic', 'publci'],
            notes: 'Default accessibility in TypeScript classes. Explicit declaration is optional.',
            quirks: [
                'Default modifier (implicit if not specified)',
                'Has no runtime effect (compile-time only)',
                'Cannot be used in interfaces (all interface members are public)',
                'Can be used on constructor parameters to create properties'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Explicit "public" is optional but improves readability.',
            useCases: [
                'Class methods and properties',
                'Constructor parameter properties',
                'Explicit API surface',
                'Documentation clarity'
            ],
            javaEquivalent: 'public',
            csharpEquivalent: 'public',
            example: 'public name: string; // or just: name: string;',
            parameterProperty: 'constructor(public name: string) {} // Creates and assigns property'
        },

        'private': {
            category: 'access',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Private accessibility modifier - accessible only within class',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'static', 'readonly', 'async', 'get', 'set', 'ASTERISK', 'HASH'],
            precededBy: ['WHITESPACE', 'NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['ClassDeclaration', 'ClassMethod', 'ClassProperty', 'Constructor', 'ParameterProperty'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isAccessModifier: true,
            appliesTo: ['class members', 'constructor parameters'],
            canCombineWith: ['static', 'readonly', 'async', 'abstract', 'override'],
            mutuallyExclusive: ['public', 'protected'],
            compileTimeOnly: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'TypeScript "private" vs JavaScript "#" private',
                    context: 'Compile-time vs runtime privacy',
                    note: 'TypeScript private is erased at runtime; # is true private'
                },
                {
                    language: 'JavaScript',
                    rule: 'Use # prefix for runtime private fields',
                    context: 'ECMAScript private fields',
                    note: '#fieldName is JavaScript syntax, not TypeScript modifier'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Access modifier 'private' can only be used on class members. Use '#' for runtime privacy.",
            commonTypos: ['privat', 'privte', 'prviate', 'pirvate'],
            notes: 'Compile-time only. Use "#" prefix (e.g., #fieldName) for true runtime private fields.',
            quirks: [
                'Compile-time only (erased in JavaScript output)',
                'Not enforced at runtime',
                'Accessible via bracket notation at runtime',
                'Cannot be used in interfaces',
                'Different from JavaScript # private fields'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use TypeScript "private" for type safety. Use "#" prefix for runtime privacy.',
            useCases: [
                'Internal implementation details',
                'Helper methods',
                'State management',
                'Encapsulation'
            ],
            runtimeEquivalent: '#fieldName // JavaScript private field',
            javaEquivalent: 'private',
            csharpEquivalent: 'private',
            example: 'private secret: string; // Type-level privacy',
            hardPrivate: '#secret: string; // Runtime privacy (JavaScript)',
            differences: 'TypeScript private = compile-time, # private = runtime'
        },

        'protected': {
            category: 'access',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Protected accessibility modifier - accessible in class and subclasses',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'static', 'readonly', 'async', 'abstract', 'get', 'set', 'ASTERISK'],
            precededBy: ['WHITESPACE', 'NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['ClassDeclaration', 'ClassMethod', 'ClassProperty', 'Constructor', 'ParameterProperty'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isAccessModifier: true,
            appliesTo: ['class members', 'constructor parameters'],
            canCombineWith: ['static', 'readonly', 'async', 'abstract', 'override'],
            mutuallyExclusive: ['public', 'private'],
            allowsInheritance: true,
            compileTimeOnly: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Accessible in class and derived classes only',
                    context: 'Inheritance hierarchy',
                    note: 'Not accessible outside class hierarchy'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Access modifier 'protected' can only be used on class members.",
            commonTypos: ['protectd', 'protcted', 'prtected', 'portected'],
            notes: 'Accessible in class and subclasses. Compile-time only.',
            quirks: [
                'Compile-time only (not enforced at runtime)',
                'Accessible in derived classes',
                'Cannot be used in interfaces',
                'Can be overridden with any visibility',
                'Protected constructor prevents direct instantiation'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use for methods/properties that subclasses need to access or override.',
            useCases: [
                'Template method pattern',
                'Inheritance hooks',
                'Protected constructors (abstract classes)',
                'Shared implementation details'
            ],
            javaEquivalent: 'protected',
            csharpEquivalent: 'protected',
            example: 'protected helper(): void {} // Subclasses can access',
            protectedConstructor: 'protected constructor() {} // Cannot instantiate directly'
        },

        'readonly': {
            category: 'modifier',
            source: 'TypeScript',
            tsVersion: '2.0',
            description: 'Read-only property modifier - prevents reassignment after initialization',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'BRACKET_OPEN'],
            precededBy: ['public', 'private', 'protected', 'static', 'WHITESPACE'],
            parentContext: ['ClassProperty', 'InterfaceProperty', 'TypeLiteral', 'IndexSignature'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isReadOnly: true,
            preventsReassignment: true,
            appliesTo: ['properties', 'index signatures', 'array types'],
            canCombineWith: ['public', 'private', 'protected', 'static', 'abstract'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Readonly property vs ReadonlyArray vs Readonly<T> type',
                    context: 'Different readonly mechanisms',
                    variants: [
                        'readonly prop: T - readonly property',
                        'ReadonlyArray<T> - readonly array type',
                        'Readonly<T> - makes all properties readonly'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Modifier 'readonly' can only be used on properties and index signatures.",
            commonTypos: ['readony', 'raedonly', 'readonly', 'read-only'],
            notes: 'Prevents reassignment after initialization. Deep immutability requires Readonly<T>.',
            quirks: [
                'Compile-time only (not enforced at runtime)',
                'Can be initialized in declaration or constructor',
                'Shallow immutability (nested objects still mutable)',
                'ReadonlyArray<T> for readonly arrays',
                'as const for deep readonly literals'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use readonly for immutable properties. Use Readonly<T> for deep immutability.',
            useCases: [
                'Immutable configuration',
                'Constants',
                'Value objects',
                'Functional programming patterns'
            ],
            relatedTypes: ['ReadonlyArray<T>', 'Readonly<T>', 'as const'],
            example: 'readonly id: string; // Cannot reassign after init',
            deepImmutability: 'Readonly<T> or as const for nested objects',
            vsConst: 'readonly = immutable property, const = immutable binding'
        },

        'abstract': {
            category: 'modifier',
            source: 'TypeScript',
            tsVersion: '1.6',
            description: 'Abstract class/method modifier - requires implementation in derived class',

            // 1. Syntactic Relationships
            followedBy: ['class', 'IDENTIFIER', 'get', 'set'],
            precededBy: ['export', 'WHITESPACE', 'public', 'protected'],
            parentContext: ['ClassDeclaration', 'ClassMethod', 'PropertyDeclaration'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isAbstract: true,
            requiresImplementation: true,
            preventsInstantiation: true,
            appliesTo: ['classes', 'methods', 'properties', 'accessors'],
            canCombineWith: ['export', 'public', 'protected'],
            cannotCombineWith: ['private', 'static'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Abstract class vs abstract member',
                    context: 'Class-level vs member-level',
                    note: 'Abstract class can have non-abstract members'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Abstract classes cannot be instantiated. Abstract members must be implemented in derived classes.",
            commonTypos: ['abstact', 'abstrac', 'abtract', 'absrtact'],
            notes: 'Abstract classes cannot be instantiated. Abstract methods must be implemented in subclasses.',
            quirks: [
                'Abstract class can have non-abstract members',
                'Abstract methods have no implementation',
                'Cannot be private (must be implemented)',
                'Abstract properties must be implemented',
                'Partial implementation pattern'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use abstract classes for shared implementation with required overrides.',
            useCases: [
                'Template method pattern',
                'Base classes with partial implementation',
                'Framework extension points',
                'Enforcing implementation contracts'
            ],
            javaEquivalent: 'abstract',
            csharpEquivalent: 'abstract',
            example: 'abstract class Animal { abstract makeSound(): void; }',
            vsInterface: 'abstract class can have implementation, interface cannot'
        },

        'static': {
            category: 'modifier',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Static member modifier - belongs to class, not instance',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'readonly', 'async', 'get', 'set', 'ASTERISK'],
            precededBy: ['public', 'private', 'protected', 'WHITESPACE'],
            parentContext: ['ClassMethod', 'ClassProperty', 'StaticBlock'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isStatic: true,
            belongsToClass: true,
            appliesTo: ['methods', 'properties', 'accessors', 'blocks'],
            canCombineWith: ['public', 'private', 'protected', 'readonly', 'async', 'override'],
            cannotCombineWith: ['abstract'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Static member vs static block',
                    context: 'Member vs initialization code',
                    note: 'static {} block for initialization (ES2022)'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Modifier 'static' can only be used on class members.",
            commonTypos: ['statc', 'staic', 'staatic', 'sttaic'],
            notes: 'Static members belong to the class, not instances. Accessed via ClassName.member.',
            quirks: [
                'Accessed via class name, not instance',
                'Cannot access instance members',
                '"this" refers to class constructor',
                'Inherited by subclasses',
                'static {} blocks for initialization (ES2022)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use static for utility methods and class-level constants.',
            useCases: [
                'Utility functions',
                'Factory methods',
                'Class constants',
                'Singleton pattern'
            ],
            javaEquivalent: 'static',
            csharpEquivalent: 'static',
            example: 'static create(): MyClass { return new MyClass(); }',
            staticBlock: 'static { /* initialization code */ } // ES2022',
            inheritance: 'Static members are inherited but not polymorphic'
        },

        'declare': {
            category: 'modifier',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Ambient declaration modifier - declares shape without implementation',

            // 1. Syntactic Relationships
            followedBy: ['const', 'let', 'var', 'function', 'class', 'interface', 'namespace', 'module', 'enum', 'global'],
            precededBy: ['export', 'WHITESPACE', 'NEWLINE'],
            parentContext: ['DeclarationFile', 'Module', 'Namespace', 'AmbientDeclaration'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isAmbient: true,
            noImplementation: true,
            typeOnly: true,
            appliesTo: ['variables', 'functions', 'classes', 'namespaces', 'modules'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Ambient declaration - type info without implementation',
                    context: '.d.ts files',
                    note: 'Implementation exists elsewhere (usually JavaScript)'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'declare' is used for ambient declarations in .d.ts files or global augmentation.",
            commonTypos: ['delcare', 'declar', 'declre', 'decalre'],
            notes: 'Used in .d.ts files to describe external APIs. No runtime code generated.',
            quirks: [
                'No implementation allowed',
                'Describes existing JavaScript APIs',
                'Common in .d.ts declaration files',
                'Can declare global variables',
                'Erased completely in output'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Use "declare" in .d.ts files for type definitions of external libraries.',
            useCases: [
                'Type definitions for JavaScript libraries',
                'Global variable declarations',
                'Ambient module declarations',
                'Window/process augmentation'
            ],
            example: 'declare const API_KEY: string; // Exists in runtime',
            fileTypes: ['.d.ts declaration files', '.ts files with global augmentation'],
            noEmit: 'Completely erased from JavaScript output'
        },

        'override': {
            category: 'modifier',
            source: 'TypeScript',
            tsVersion: '4.3',
            description: 'Override modifier - explicitly marks overridden base class member',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'get', 'set'],
            precededBy: ['public', 'private', 'protected', 'static', 'readonly'],
            parentContext: ['ClassMethod', 'ClassProperty', 'Accessor'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isOverride: true,
            requiresBaseClass: true,
            requiresBaseMember: true,
            appliesTo: ['methods', 'properties', 'accessors'],
            canCombineWith: ['public', 'private', 'protected', 'static', 'readonly', 'async'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Explicitly marks override - prevents typos',
                    context: 'Inheritance',
                    note: 'Compiler flag --noImplicitOverride enforces this'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'override' requires a base class member to override. Enable --noImplicitOverride.",
            commonTypos: ['overide', 'overrid', 'overrride'],
            notes: 'Ensures method exists in base class. Prevents typos in overridden methods.',
            quirks: [
                'Requires base class with matching member',
                'Enforced by --noImplicitOverride flag',
                'Compile-time only',
                'Helps catch refactoring errors',
                'Optional but recommended'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            bestPractice: 'Always use "override" for clarity. Enable --noImplicitOverride.',
            useCases: [
                'Explicit method overriding',
                'Refactoring safety',
                'Code clarity',
                'Preventing typos'
            ],
            compilerFlag: '--noImplicitOverride',
            example: 'override render(): void { /* override */ }',
            csharpEquivalent: 'override',
            javaEquivalent: '@Override annotation'
        },

        'async': {
            category: 'modifier',
            source: 'TypeScript',
            tsVersion: '1.7',
            description: 'Async function modifier - function returns Promise',

            // 1. Syntactic Relationships
            followedBy: ['function', 'IDENTIFIER', 'PAREN_OPEN', 'ASTERISK'],
            precededBy: ['export', 'public', 'private', 'protected', 'static', 'WHITESPACE'],
            parentContext: ['FunctionDeclaration', 'MethodDeclaration', 'ArrowFunction', 'FunctionExpression'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isAsync: true,
            returnsPromise: true,
            allowsAwait: true,
            appliesTo: ['functions', 'methods', 'arrow functions'],
            canCombineWith: ['public', 'private', 'protected', 'static', 'abstract', 'override'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'async function vs async method vs async arrow',
                    contexts: ['Function', 'Method', 'Arrow function'],
                    note: 'All return Promise automatically'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Async functions must return Promise. Use 'await' for Promise values.",
            commonTypos: ['asnyc', 'aync', 'asyn', 'asyncc'],
            notes: 'Async functions automatically return promises. Use "await" to wait for promises inside.',
            quirks: [
                'Return value automatically wrapped in Promise',
                'Allows "await" keyword inside',
                'Even synchronous returns become promises',
                'Exceptions become rejected promises',
                'async function* for async generators'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            requiresES2017: true,
            bestPractice: 'Always type return as Promise<T>. Use await for async operations.',
            useCases: [
                'Asynchronous operations',
                'API calls',
                'File I/O',
                'Database queries'
            ],
            example: 'async function fetch(): Promise<Data> { return await api.get(); }',
            asyncIterator: 'async function* // async generator',
            jsEquivalent: 'async (ES2017)'
        },

        'accessor': {
            category: 'modifier',
            source: 'TypeScript',
            tsVersion: '4.9',
            description: 'Auto-accessor field - generates getter/setter automatically',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['public', 'private', 'protected', 'static', 'WHITESPACE'],
            parentContext: ['ClassProperty'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isAccessor: true,
            generatesGetterSetter: true,
            appliesTo: ['class fields'],
            canCombineWith: ['public', 'private', 'protected', 'static', 'readonly'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Shorthand for getter/setter pair',
                    context: 'Class field',
                    note: 'Automatically generates backing field'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'accessor' generates getter and setter automatically for the field.",
            commonTypos: ['accesso', 'acessor', 'accesor'],
            notes: 'Shorthand for property with getter/setter. Generates private backing field.',
            quirks: [
                'Generates private backing field automatically',
                'Cannot define separate getter/setter',
                'Works with decorators',
                'Similar to C# auto-properties',
                'Introduced in TypeScript 4.9'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '4.9',
            bestPractice: 'Use accessor for simple get/set properties. Use manual getter/setter for complex logic.',
            useCases: [
                'Simple properties with backing field',
                'Properties with decorators',
                'Encapsulated class fields',
                'Reducing boilerplate'
            ],
            example: 'accessor name: string; // Generates get name() and set name()',
            vsManual: 'Manual: get/set methods. accessor: automatic',
            csharpEquivalent: 'public string Name { get; set; }'
        },

        // Variance Modifiers
        'in': {
            category: 'variance',
            source: 'TypeScript',
            tsVersion: '4.7',
            contextual: true,
            description: 'Contravariance annotation for type parameters',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['LESS_THAN', 'COMMA'],
            parentContext: ['TypeParameter', 'GenericTypeDeclaration'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isVariance: true,
            isContravariant: true,
            appliesTo: ['type parameters'],
            contextual: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'In type parameter position: variance. In other contexts: "in" operator or "for...in"',
                    context: 'Type parameter vs operator',
                    ifPrecededBy: ['LESS_THAN', 'COMMA'],
                    note: 'Contextual keyword - meaning depends on position'
                },
                {
                    language: 'JavaScript',
                    rule: '"in" operator checks property existence',
                    context: 'Value position',
                    note: 'Different from TypeScript type parameter variance'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'in' marks contravariant type parameter. Only for function parameters.",
            commonTypos: ['inn', 'In', 'IN'],
            notes: 'Contravariant type parameter - used for input positions (function parameters).',
            quirks: [
                'Contextual keyword',
                'Only valid in type parameter position',
                'Enforces contravariance',
                'Enables stricter type checking',
                'Introduced in TypeScript 4.7'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '4.7',
            bestPractice: 'Use "in" for type parameters that appear in input positions (function parameters).',
            useCases: [
                'Function parameter types',
                'Contravariant generic types',
                'Type-safe callbacks',
                'Event handlers'
            ],
            example: 'interface Consumer<in T> { consume(value: T): void; }',
            variance: 'contravariant (accepts supertypes)',
            typeTheory: 'Contravariance for input types'
        },

        'out': {
            category: 'variance',
            source: 'TypeScript',
            tsVersion: '4.7',
            contextual: true,
            description: 'Covariance annotation for type parameters',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['LESS_THAN', 'COMMA'],
            parentContext: ['TypeParameter', 'GenericTypeDeclaration'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isModifier: true,
            isVariance: true,
            isCovariant: true,
            appliesTo: ['type parameters'],
            contextual: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'In type parameter position: variance. Otherwise: identifier',
                    context: 'Type parameter vs variable name',
                    ifPrecededBy: ['LESS_THAN', 'COMMA'],
                    note: 'Contextual keyword - meaning depends on position'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'out' marks covariant type parameter. Only for return types.",
            commonTypos: ['otu', 'Out', 'OUT'],
            notes: 'Covariant type parameter - used for output positions (return types, properties).',
            quirks: [
                'Contextual keyword',
                'Only valid in type parameter position',
                'Enforces covariance',
                'Enables stricter type checking',
                'Introduced in TypeScript 4.7'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '4.7',
            bestPractice: 'Use "out" for type parameters that appear in output positions (return types).',
            useCases: [
                'Return types',
                'Read-only properties',
                'Covariant generic types',
                'Observable/Promise types'
            ],
            example: 'interface Producer<out T> { produce(): T; }',
            variance: 'covariant (accepts subtypes)',
            typeTheory: 'Covariance for output types'
        },
    },

    // ============================================================================
    // TYPE OPERATORS - TypeScript Compiler
    // ============================================================================
    typeOperators: {
        // Type Query
        'keyof': {
            category: 'type-operator',
            source: 'TypeScript',
            tsVersion: '2.1',
            description: 'Keyof operator - gets keys of object type as union',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'typeof', 'PAREN_OPEN', 'BRACE_OPEN'],
            precededBy: ['COLON', 'EQUALS', 'EXTENDS', 'BRACKET_OPEN'],
            parentContext: ['TypeAnnotation', 'MappedType', 'IndexedAccessType', 'TypeAlias'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isTypeOperator: true,
            isPrefix: true,
            operatesOnTypes: true,
            returnsUnion: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Gets union of keys as string literals',
                    context: 'Type-level operation',
                    note: 'Returns union type, not array'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'keyof' must be followed by an object type or type query.",
            commonTypos: ['keyOff', 'keysof', 'keyoff', 'keof'],
            notes: 'Returns union of property keys as string literal types.',
            quirks: [
                'Returns union of keys, not array',
                'Includes symbol keys',
                'Excludes private/protected members',
                'Can be used with typeof',
                'Respects index signatures'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '2.1',
            bestPractice: 'Use keyof with typeof for runtime object keys. Combine with generics for type-safe access.',
            useCases: [
                'Type-safe property access',
                'Mapped types',
                'Generic constraints',
                'Pick/Omit utility types'
            ],
            example: 'type Keys = keyof { a: number; b: string }; // "a" | "b"',
            withTypeof: 'keyof typeof obj // Gets keys of runtime object',
            relatedTypes: ['Pick<T, K>', 'Record<K, V>', 'Mapped types']
        },

        'typeof': {
            category: 'type-operator',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Typeof operator - gets type of value or runtime type string',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'PAREN_OPEN'],
            precededBy: ['COLON', 'EQUALS', 'keyof', 'BRACKET_OPEN', 'PAREN_OPEN'],
            parentContext: ['TypeAnnotation', 'TypeQuery', 'Expression'],
            startsExpr: true,
            beforeExpr: false,

            // 2. Parser Directives
            isTypeOperator: true,
            isPrefix: true,
            hasRuntimeEquivalent: true,
            dualUsage: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Type context vs value context - different behavior',
                    contexts: ['Type position', 'Value position'],
                    ifPrecededBy: ['COLON', 'EQUALS'],
                    typePosition: 'Gets type of identifier',
                    valuePosition: 'Returns string: "string", "number", etc.'
                },
                {
                    language: 'JavaScript',
                    rule: 'Runtime typeof returns type string',
                    context: 'Value position',
                    returnValues: ['string', 'number', 'boolean', 'undefined', 'object', 'function', 'symbol', 'bigint']
                }
            ],

            // 4. Error Reporting
            errorMessage: "'typeof' has different behavior in type vs value context.",
            commonTypos: ['typeOf', 'typof', 'tyepof'],
            notes: 'In type position: gets type. In value position: returns type string.',
            quirks: [
                'Dual usage: type-level and runtime',
                'typeof null === "object" (JavaScript quirk)',
                'Type context: infers static type',
                'Value context: runtime type check',
                'Can be combined with keyof'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            bestPractice: 'Use typeof in type position for inferring types. Use for runtime checks in value position.',
            useCases: [
                'Type inference: type T = typeof value',
                'Runtime type guards',
                'Capturing function signatures',
                'Module type extraction'
            ],
            example: 'const obj = { a: 1 }; type ObjType = typeof obj;',
            typePosition: 'type T = typeof value // Gets type',
            valuePosition: 'if (typeof value === "string") {} // Runtime check',
            jsEquivalent: 'typeof operator (runtime)'
        },

        'infer': {
            category: 'type-operator',
            source: 'TypeScript',
            tsVersion: '2.8',
            description: 'Infer operator - declares type variable in conditional type',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['extends'],
            parentContext: ['ConditionalType'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isTypeOperator: true,
            isInfer: true,
            requiresConditionalType: true,
            declaresTypeVariable: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Only valid in conditional type extends clause',
                    context: 'T extends infer U ? X : Y',
                    note: 'Declares type variable for pattern matching'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'infer' can only be used in conditional types within extends clause.",
            commonTypos: ['infr', 'inffer', 'infer', 'infeer'],
            notes: 'Infers and captures type variable in conditional types. Advanced type-level programming.',
            quirks: [
                'Only in conditional types',
                'Must be in extends clause',
                'Creates type variable',
                'Used for pattern matching',
                'Can infer multiple types'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '2.8',
            bestPractice: 'Use for extracting types from complex structures (return types, promise types, array elements).',
            useCases: [
                'Extract return types',
                'Unwrap Promise types',
                'Get array element types',
                'Pattern matching in types'
            ],
            example: 'type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;',
            patterns: [
                'infer R from function return',
                'infer T from Promise<T>',
                'infer U from Array<U>',
                'infer K and V from Map<K,V>'
            ],
            relatedTypes: ['ReturnType<T>', 'Parameters<T>', 'Awaited<T>']
        },

        'is': {
            category: 'type-guard',
            source: 'TypeScript',
            tsVersion: '1.6',
            description: 'Type predicate - narrows type in conditional branches',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'typeof', 'keyof'],
            precededBy: ['IDENTIFIER', 'PAREN_CLOSE', 'this'],
            parentContext: ['FunctionReturnType', 'TypePredicate'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isTypeGuard: true,
            isTypePredicate: true,
            narrowsType: true,
            appliesTo: ['function return types'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Type predicate in function signature',
                    context: 'parameterName is Type',
                    note: 'Enables type narrowing in conditional branches'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'is' creates type predicate for type guard functions.",
            commonTypos: ['iis', 'si', 'Is'],
            notes: 'Type guard function that narrows type in conditional branches.',
            quirks: [
                'Only in function return type position',
                'Parameter name must match function parameter',
                'Enables type narrowing',
                'Boolean return value required',
                'Can use with "this" for class methods'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.6',
            bestPractice: 'Use type guards for safe type narrowing. Ensure runtime check matches type predicate.',
            useCases: [
                'Custom type guards',
                'Runtime type validation',
                'Discriminated union narrowing',
                'Library type assertions'
            ],
            example: 'function isString(value: unknown): value is string { return typeof value === "string"; }',
            thisTypeGuard: 'method(): this is SubClass { return ...; }',
            requirements: ['Boolean return', 'Runtime check must be accurate']
        },

        'asserts': {
            category: 'type-guard',
            source: 'TypeScript',
            tsVersion: '3.7',
            description: 'Assertion signature - throws or narrows type',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'is', 'this'],
            precededBy: ['COLON'],
            parentContext: ['FunctionReturnType', 'AssertionSignature'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isTypeGuard: true,
            isAssertion: true,
            narrowsType: true,
            throwsOnFalse: true,
            appliesTo: ['function return types'],

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Assertion function - throws if condition false',
                    context: 'asserts parameterName or asserts parameterName is Type',
                    note: 'Two forms: asserts x and asserts x is Type'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'asserts' creates assertion function that throws or narrows type.",
            commonTypos: ['assert', 'assrts', 'aserts'],
            notes: 'Assertion signature - guarantees condition or throws error.',
            quirks: [
                'Two forms: asserts x and asserts x is Type',
                'Must throw if assertion fails',
                'Narrows type after call',
                'Return type must be void',
                'Introduced in TypeScript 3.7'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '3.7',
            bestPractice: 'Use assertions for invariant checks. Always throw on failure.',
            useCases: [
                'Runtime invariants',
                'Null checks',
                'Type narrowing with throws',
                'Defensive programming'
            ],
            example: 'function assertString(value: unknown): asserts value is string { if (typeof value !== "string") throw new Error(); }',
            forms: [
                'asserts value // Asserts truthy',
                'asserts value is Type // Asserts type'
            ],
            vsTypeGuard: 'Type guard returns boolean, assertion throws or narrows'
        },

        'satisfies': {
            category: 'type-operator',
            source: 'TypeScript',
            tsVersion: '4.9',
            description: 'Satisfies operator - validates type without widening',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'BRACE_OPEN', 'BRACKET_OPEN', 'typeof', 'keyof'],
            precededBy: ['IDENTIFIER', 'BRACE_CLOSE', 'BRACKET_CLOSE', 'PAREN_CLOSE'],
            parentContext: ['VariableDeclaration', 'Expression', 'PropertyAssignment'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isTypeOperator: true,
            isInfix: true,
            validatesType: true,
            preservesLiteralTypes: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Type validation without type widening',
                    context: 'value satisfies Type',
                    note: 'Checks type but keeps literal types'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'satisfies' validates type while preserving literal types.",
            commonTypos: ['satisfy', 'satifies', 'satis fies'],
            notes: 'Type validation without losing specificity of literal types.',
            quirks: [
                'Preserves literal types',
                'Type checking at declaration',
                'No type widening',
                'Best of both worlds',
                'Introduced in TypeScript 4.9'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '4.9',
            bestPractice: 'Use satisfies for type validation without losing precision. Better than type assertion.',
            useCases: [
                'Configuration objects with specific keys',
                'Type-safe with literal preservation',
                'API response validation',
                'Constants with constraints'
            ],
            example: 'const config = { mode: "dev" } satisfies { mode: string }; // mode is "dev", not string',
            vsAssertion: 'satisfies validates, as casts',
            vsAnnotation: 'satisfies preserves literals, : Type widens'
        },

        // Unique Symbol
        'unique': {
            category: 'type-operator',
            source: 'TypeScript',
            tsVersion: '2.7',
            contextual: true,
            description: 'Unique symbol type - creates nominal symbol type',

            // 1. Syntactic Relationships
            followedBy: ['symbol'],
            precededBy: ['COLON', 'typeof'],
            parentContext: ['TypeAnnotation', 'PropertySignature'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isTypeOperator: true,
            requiresSymbol: true,
            contextual: true,
            createsNominalType: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Must be used with symbol type',
                    context: 'unique symbol',
                    note: 'Creates unique brand for nominal typing'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'unique symbol' must be const or readonly. Used for nominal typing.",
            commonTypos: ['uniqe', 'unque', 'uinque'],
            notes: 'Creates unique symbol type for nominal typing. Must be const or readonly.',
            quirks: [
                'Must be const or readonly',
                'Each declaration has unique type',
                'Enables nominal typing',
                'Cannot be reassigned',
                'Contextual keyword'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '2.7',
            contextual: true,
            bestPractice: 'Use unique symbol for branded types and nominal typing patterns.',
            useCases: [
                'Branded types',
                'Nominal typing',
                'Unique identifiers',
                'Private object keys'
            ],
            example: 'declare const brand: unique symbol; type Branded<T> = T & { [brand]: void };',
            nominalTyping: 'Simulates nominal types in structural type system',
            relatedPatterns: ['Branded types', 'Opaque types']
        },
    },

    // ============================================================================
    // DECLARATION KEYWORDS - TypeScript Compiler
    // ============================================================================
    declarations: {
        // Type Declarations
        'type': {
            category: 'declaration',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Type alias declaration - creates reusable type name',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['export', 'SEMICOLON', 'BRACE_CLOSE', 'NEWLINE'],
            parentContext: ['Program', 'Module', 'Namespace', 'BlockStatement'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isTypeDeclaration: true,
            canHaveGenerics: true,
            canExport: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Type alias vs interface - different capabilities',
                    differences: [
                        'type: Can represent unions, intersections, primitives',
                        'interface: Better for objects, supports declaration merging',
                        'type: Cannot be extended (use intersection)',
                        'interface: Can be extended with extends'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Type alias must have a name and definition.",
            commonTypos: ['typ', 'tpe', 'tyep', 'tpye'],
            notes: 'Creates reusable type name. More flexible than interface but no declaration merging.',
            quirks: [
                'Cannot be reopened (no declaration merging)',
                'Can represent any type (unions, intersections, primitives)',
                'Can use mapped types',
                'Can be recursive (with care)',
                'Vs interface: different use cases'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            bestPractice: 'Use type for unions, intersections, mapped types. Use interface for object shapes.',
            useCases: [
                'Union types: type ID = string | number',
                'Intersection types: type A = B & C',
                'Mapped types: type Readonly<T> = { readonly [P in keyof T]: T[P] }',
                'Conditional types: type X = T extends U ? A : B'
            ],
            example: 'type Point = { x: number; y: number };',
            vsInterface: 'type = flexible, no merging. interface = objects, merging, extends',
            advancedFeatures: ['Union types', 'Intersection types', 'Mapped types', 'Conditional types', 'Template literals']
        },

        'interface': {
            category: 'declaration',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Interface declaration - defines object shape',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['export', 'SEMICOLON', 'BRACE_CLOSE', 'NEWLINE', 'declare'],
            parentContext: ['Program', 'Module', 'Namespace'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isTypeDeclaration: true,
            canHaveGenerics: true,
            canExtend: true,
            canMerge: true,
            canExport: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Interface vs type alias - when to use which',
                    guideline: 'interface for object shapes, type for complex types',
                    interfaceAdvantages: [
                        'Declaration merging',
                        'extends keyword',
                        'Better error messages',
                        'Class implements'
                    ],
                    typeAdvantages: [
                        'Union types',
                        'Intersection types',
                        'Mapped types',
                        'Conditional types'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Interface must have a name and body.",
            commonTypos: ['interfce', 'intrface', 'interfac', 'interace'],
            notes: 'Defines object shape. Supports declaration merging and extension.',
            quirks: [
                'Declaration merging (same name combines)',
                'Can extend multiple interfaces',
                'Classes can implement interfaces',
                'Better for public APIs',
                'Excess property checking'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            bestPractice: 'Use interface for object shapes and public APIs. Prefer over type for objects.',
            useCases: [
                'Object shapes',
                'Class contracts (implements)',
                'Public APIs',
                'Library type definitions'
            ],
            example: 'interface User { id: number; name: string; }',
            declarationMerging: 'interface User { email: string; } // Merges with above',
            extends: 'interface Admin extends User { role: string; }',
            vsType: 'interface = objects, merging. type = all types, no merging'
        },

        'enum': {
            category: 'declaration',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Enumeration declaration - named constants',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['export', 'const', 'declare', 'SEMICOLON'],
            parentContext: ['Program', 'Module', 'Namespace'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isEnum: true,
            generatesRuntime: true,
            canBeConst: true,
            canExport: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'enum vs const enum - runtime vs compile-time',
                    differences: [
                        'enum: Generates runtime object',
                        'const enum: Inlined, no runtime code',
                        'enum: Can be imported',
                        'const enum: Better tree-shaking'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Enum must have a name and at least one member.",
            commonTypos: ['enm', 'enmum', 'enum', 'enu'],
            notes: 'Creates set of named constants. Generates runtime object unless const enum.',
            quirks: [
                'Generates JavaScript object at runtime',
                'Numeric enums auto-increment',
                'String enums require explicit values',
                'const enum is inlined',
                'Can mix numeric and string values (heterogeneous)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            bestPractice: 'Use const enum for better tree-shaking. Consider union types as alternative.',
            variants: [
                'Numeric enum: enum Color { Red, Green, Blue }',
                'String enum: enum Color { Red = "RED", Green = "GREEN" }',
                'Heterogeneous: enum Mix { No = 0, Yes = "YES" }',
                'Const enum: const enum Color { Red, Green }'
            ],
            useCases: [
                'Named constants',
                'State machines',
                'Configuration options',
                'API response codes'
            ],
            example: 'enum Status { Pending = 0, Active = 1, Archived = 2 }',
            constEnum: 'const enum Status { ... } // Inlined, no runtime code',
            alternatives: 'Union types: type Status = "pending" | "active";',
            treeShaking: 'const enum has better tree-shaking'
        },

        // Namespace/Module
        'namespace': {
            category: 'declaration',
            source: 'TypeScript',
            tsVersion: '1.5',
            description: 'Namespace declaration - logical grouping (legacy)',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['export', 'declare', 'SEMICOLON'],
            parentContext: ['Program', 'Module', 'Namespace'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isNamespace: true,
            canNest: true,
            canMerge: true,
            canExport: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'namespace vs ES modules - modern vs legacy',
                    recommendation: 'Use ES modules (import/export) instead',
                    note: 'namespace is legacy feature'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Namespace is legacy. Use ES modules (import/export) instead.",
            commonTypos: ['namepsace', 'namesapce', 'namspace'],
            notes: 'Legacy feature for organizing code. Prefer ES modules.',
            quirks: [
                'Pre-ES module syntax',
                'Can be nested',
                'Declaration merging',
                'Generates IIFE in JavaScript',
                'Avoid in new code'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: true,
            deprecationMessage: 'Use ES modules (import/export) instead of namespaces',
            tsVersion: '1.5',
            bestPractice: 'Avoid namespaces. Use ES modules for code organization.',
            useCases: [
                'Legacy code maintenance',
                'Global type augmentation',
                'Declaration files'
            ],
            example: 'namespace Utils { export function helper() {} }',
            vsModules: 'modules = modern, standard. namespace = legacy',
            migration: 'Convert to ES modules: import/export'
        },

        'module': {
            category: 'declaration',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Ambient module declaration (for .d.ts files)',

            // 1. Syntactic Relationships
            followedBy: ['STRING', 'IDENTIFIER'],
            precededBy: ['declare', 'export', 'SEMICOLON'],
            parentContext: ['DeclarationFile', 'AmbientContext'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isModule: true,
            isAmbient: true,
            requiresDeclare: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Ambient module declaration in .d.ts files',
                    context: 'Type definitions',
                    note: 'Different from namespace and ES modules'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'module' is for ambient module declarations in .d.ts files.",
            commonTypos: ['modul', 'modlue', 'mdoule'],
            notes: 'Used in .d.ts files for external module type definitions.',
            quirks: [
                'Ambient declarations only',
                'String literal name',
                'No implementation',
                'Type information only',
                'Legacy syntax'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: true,
            deprecationMessage: 'Use ES module syntax or namespace instead',
            tsVersion: '1.0',
            bestPractice: 'Use only in .d.ts files for legacy module types.',
            useCases: [
                'Ambient module declarations',
                'Type definitions for non-TS modules',
                'Global module augmentation'
            ],
            example: 'declare module "my-library" { export function fn(): void; }',
            fileTypes: '.d.ts declaration files',
            modernAlternative: 'ES module declarations'
        },

        // Declaration Merging
        'global': {
            category: 'declaration',
            source: 'TypeScript',
            tsVersion: '1.8',
            contextual: true,
            description: 'Global scope augmentation',

            // 1. Syntactic Relationships
            followedBy: ['BRACE_OPEN'],
            precededBy: ['declare'],
            parentContext: ['Module'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isGlobal: true,
            augmentsGlobal: true,
            contextual: true,
            requiresDeclare: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'Global augmentation from module scope',
                    context: 'declare global { ... }',
                    note: 'Adds declarations to global scope from module'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'global' augments global scope from module context.",
            commonTypos: ['globl', 'globa', 'gloabl'],
            notes: 'Adds declarations to global scope from within a module.',
            quirks: [
                'Only in module context',
                'Requires declare keyword',
                'Augments global types',
                'Contextual keyword',
                'Used for type augmentation'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.8',
            contextual: true,
            bestPractice: 'Use for adding types to global scope from modules.',
            useCases: [
                'Augmenting Window interface',
                'Adding process types in Node',
                'Global library extensions',
                'Polyfill types'
            ],
            example: 'declare global { interface Window { myAPI: MyAPI; } }',
            windowAugmentation: 'declare global { interface Window { ... } }',
            processAugmentation: 'declare global { namespace NodeJS { interface ProcessEnv { ... } } }'
        },
    },

    // ============================================================================
    // MODULE KEYWORDS - TypeScript Compiler + Babel
    // ============================================================================
    moduleKeywords: {
        // ES Module Keywords (inherited from JavaScript)
        'import': {
            category: 'module',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Import declaration for ES modules',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'BRACE_OPEN', 'STRING', 'STAR', 'type'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE'],
            parentContext: ['Program', 'Module'],
            startsExpr: false,
            beforeExpr: false,
            canStartStatement: true,

            // 2. Parser Directives
            isModuleKeyword: true,
            isImport: true,
            requiresSpecifier: true,
            canHaveTypeModifier: true,
            hoisted: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'import vs import type - runtime vs type-only',
                    contexts: [
                        'import { value } from "mod" // Runtime import',
                        'import type { Type } from "mod" // Type-only import',
                        'import { type Type, value } from "mod" // Mixed'
                    ]
                },
                {
                    language: 'TypeScript',
                    rule: 'Dynamic import() vs static import',
                    difference: 'import() is expression, import is declaration'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Import declaration must have a module specifier.",
            commonTypos: ['imoprt', 'improt', 'imprt', 'ipmort'],
            notes: 'Static imports are hoisted. Use import() for dynamic loading.',
            quirks: [
                'Hoisted to top of module',
                'Cannot be conditional',
                'Type imports erased at runtime',
                'Side-effect imports: import "module"',
                'import() is dynamic (returns Promise)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            esVersion: 'ES2015',
            bestPractice: 'Use import type for type-only imports to improve tree-shaking.',
            importTypes: [
                'Default: import X from "mod"',
                'Named: import { a, b } from "mod"',
                'Namespace: import * as X from "mod"',
                'Side-effect: import "mod"',
                'Type-only: import type { T } from "mod"',
                'Mixed: import { type T, value } from "mod"'
            ],
            useCases: [
                'ES module imports',
                'Type-only imports',
                'Side-effect imports',
                'Dynamic imports with import()'
            ],
            example: 'import { User } from "./types";',
            typeOnly: 'import type { User } from "./types";',
            dynamicImport: 'const mod = await import("./module");'
        },

        'export': {
            category: 'module',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Export declaration for ES modules',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'BRACE_OPEN', 'const', 'let', 'var', 'function', 'class', 'interface', 'type', 'enum', 'default', 'STAR', 'as'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE'],
            parentContext: ['Program', 'Module'],
            startsExpr: false,
            beforeExpr: false,
            canStartStatement: true,

            // 2. Parser Directives
            isModuleKeyword: true,
            isExport: true,
            canHaveTypeModifier: true,
            canBeDefault: true,
            canReexport: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'export vs export type - runtime vs type-only',
                    contexts: [
                        'export { value } // Runtime export',
                        'export type { Type } // Type-only export',
                        'export { type Type, value } // Mixed'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Export declaration must have exportable binding.",
            commonTypos: ['exprot', 'exoprt', 'exprt', 'expotr'],
            notes: 'Type exports erased at runtime. Use export type for better tree-shaking.',
            quirks: [
                'export default allows expressions',
                'Re-exports: export { x } from "mod"',
                'Namespace re-exports: export * from "mod"',
                'Type exports erased',
                'Cannot export let/const in ambient context'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            esVersion: 'ES2015',
            bestPractice: 'Use export type for type-only exports. Prefer named exports over default.',
            exportTypes: [
                'Named: export const x = 1',
                'Named declaration: export function fn() {}',
                'Named list: export { a, b }',
                'Default: export default class X {}',
                'Re-export: export { x } from "mod"',
                'Namespace re-export: export * from "mod"',
                'Type-only: export type { T }',
                'Type alias: export type T = string'
            ],
            useCases: [
                'ES module exports',
                'Type-only exports',
                'Re-exports from other modules',
                'Default exports'
            ],
            example: 'export { User, admin };',
            typeOnly: 'export type { User };',
            reexport: 'export { User } from "./types";'
        },

        'from': {
            category: 'module',
            source: 'TypeScript',
            tsVersion: '1.0',
            contextual: true,
            description: 'Module specifier in import/export (contextual)',

            // 1. Syntactic Relationships
            followedBy: ['STRING'],
            precededBy: ['IDENTIFIER', 'BRACE_CLOSE', 'STAR'],
            parentContext: ['ImportDeclaration', 'ExportDeclaration'],
            startsExpr: false,
            beforeExpr: true,
            contextual: true,

            // 2. Parser Directives
            isModuleKeyword: true,
            contextual: true,
            requiresString: true,
            partOfImportExport: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'from is contextual - only keyword in import/export',
                    note: 'Can be used as identifier elsewhere'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'from' requires string literal module specifier.",
            commonTypos: ['form', 'fron', 'frm'],
            notes: 'Contextual keyword. Can be identifier name outside import/export.',
            quirks: [
                'Contextual keyword',
                'Requires string literal',
                'Part of import/export syntax',
                'Can be variable name elsewhere'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            esVersion: 'ES2015',
            contextual: true,
            bestPractice: 'Always use string literals after from.',
            useCases: [
                'import { x } from "module"',
                'export { x } from "module"',
                'export * from "module"'
            ],
            example: 'import { User } from "./types";',
            contextualNote: 'Only keyword in import/export context'
        },

        'as': {
            category: 'module',
            source: 'TypeScript',
            tsVersion: '1.0',
            contextual: true,
            description: 'Rename/namespace import/export (contextual)',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'STRING'],
            precededBy: ['IDENTIFIER', 'STAR', 'default'],
            parentContext: ['ImportDeclaration', 'ExportDeclaration', 'TypeAssertion'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,
            dualUsage: true,

            // 2. Parser Directives
            isModuleKeyword: true,
            contextual: true,
            canRename: true,
            canNamespace: true,
            dualPurpose: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'as in modules vs as in type assertions',
                    contexts: [
                        'import * as X from "mod" // Module namespace',
                        'import { a as b } from "mod" // Rename',
                        'export { a as b } // Rename export',
                        'value as Type // Type assertion',
                        'export { default as name } from "mod" // Re-export default'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "'as' requires identifier for renaming.",
            commonTypos: ['s', 'sa'],
            notes: 'Dual usage: module renaming AND type assertions.',
            quirks: [
                'Contextual keyword',
                'Module rename: import { a as b }',
                'Namespace: import * as X',
                'Type assertion: value as Type',
                'String literal for re-exports'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            esVersion: 'ES2015',
            contextual: true,
            dualUsage: true,
            bestPractice: 'Use as for renaming imports to avoid conflicts.',
            usageContexts: [
                'Module: import { a as b } from "mod"',
                'Namespace: import * as X from "mod"',
                'Export: export { a as b }',
                'Type assertion: value as Type',
                'Re-export: export { default as name } from "mod"'
            ],
            useCases: [
                'Rename imports',
                'Namespace imports',
                'Type assertions',
                'Re-export with rename'
            ],
            example: 'import { User as Person } from "./types";',
            namespace: 'import * as Utils from "./utils";',
            typeAssertion: 'const num = value as number;'
        },

        // TypeScript-Specific Module Keywords
        'require': {
            category: 'module',
            source: 'TypeScript',
            tsVersion: '1.0',
            contextual: true,
            description: 'CommonJS require (for type inference)',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN'],
            precededBy: ['ASSIGN', 'PAREN_OPEN', 'const', 'let', 'var'],
            parentContext: ['CallExpression', 'ImportEqualsDeclaration'],
            startsExpr: true,
            beforeExpr: false,
            contextual: true,

            // 2. Parser Directives
            isModuleKeyword: true,
            contextual: true,
            isCommonJS: true,
            canBeCallExpression: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'require in CommonJS vs ES modules',
                    note: 'TypeScript infers types from require() calls',
                    context: 'Legacy CommonJS interop'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'require' is CommonJS. Prefer ES modules (import/export).",
            commonTypos: ['requrie', 'reqiure', 'rquire'],
            notes: 'CommonJS legacy. TypeScript can infer types. Prefer ES modules.',
            quirks: [
                'CommonJS module system',
                'Runtime function call',
                'TypeScript infers types',
                'Not hoisted like import',
                'Can be conditional'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: true,
            deprecationMessage: 'Use ES modules (import) instead of CommonJS require',
            tsVersion: '1.0',
            contextual: true,
            bestPractice: 'Use ES modules. require only for legacy CommonJS interop.',
            useCases: [
                'Legacy CommonJS code',
                'Dynamic module loading',
                'Node.js built-ins'
            ],
            example: 'const fs = require("fs");',
            modernAlternative: 'import fs from "fs";',
            typeInference: 'TypeScript infers types from @types packages'
        },

        'exports': {
            category: 'module',
            source: 'Babel',
            tsVersion: '1.0',
            contextual: true,
            description: 'CommonJS exports object (contextual)',

            // 1. Syntactic Relationships
            followedBy: ['DOT', 'BRACKET_OPEN', 'ASSIGN'],
            precededBy: ['module', 'NEWLINE', 'SEMICOLON'],
            parentContext: ['MemberExpression', 'AssignmentExpression'],
            startsExpr: true,
            beforeExpr: false,
            contextual: true,

            // 2. Parser Directives
            isModuleKeyword: true,
            contextual: true,
            isCommonJS: true,
            isGlobal: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'exports in CommonJS vs ES modules',
                    note: 'CommonJS legacy - module.exports or exports.x',
                    context: 'Cannot mix with ES module exports'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'exports' is CommonJS. Use ES module export instead.",
            commonTypos: ['export', 'expots', 'exprts'],
            notes: 'CommonJS legacy. Prefer ES module export.',
            quirks: [
                'CommonJS module.exports',
                'Global in CommonJS context',
                'Cannot mix with ES exports',
                'Runtime assignment',
                'Avoid in modern TypeScript'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: true,
            deprecationMessage: 'Use ES modules (export) instead of CommonJS exports',
            tsVersion: '1.0',
            contextual: true,
            bestPractice: 'Use ES module export. exports only for legacy CommonJS.',
            useCases: [
                'Legacy CommonJS exports',
                'Node.js modules'
            ],
            example: 'module.exports = { fn };',
            modernAlternative: 'export { fn };',
            commonJSPattern: 'exports.fn = function() {};'
        },

        // Import Assertions (Stage 3)
        'assert': {
            category: 'module',
            source: 'TypeScript',
            tsVersion: '4.5',
            contextual: true,
            description: 'Import assertions (legacy, replaced by with)',

            // 1. Syntactic Relationships
            followedBy: ['BRACE_OPEN'],
            precededBy: ['STRING', 'SEMICOLON'],
            parentContext: ['ImportDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,

            // 2. Parser Directives
            isModuleKeyword: true,
            contextual: true,
            isAssertion: true,
            requiresObject: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'assert (legacy) vs with (modern) - import attributes',
                    note: 'assert deprecated in favor of with',
                    migration: 'Use with instead of assert'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'assert' is deprecated. Use 'with' for import attributes.",
            commonTypos: ['asert', 'assrt', 'asssert'],
            notes: 'Deprecated. Use with keyword for import attributes.',
            quirks: [
                'Stage 3 proposal (deprecated)',
                'Replaced by with keyword',
                'JSON imports: assert { type: "json" }',
                'CSS imports: assert { type: "css" }',
                'Migration to with required'
            ],

            // 5. Complete Coverage
            stage: 'deprecated',
            deprecated: true,
            deprecationMessage: 'Use with keyword instead of assert',
            tsVersion: '4.5',
            replacedBy: 'with',
            contextual: true,
            bestPractice: 'Use with for import attributes. assert is deprecated.',
            useCases: [
                'Legacy JSON imports',
                'Migration path to with'
            ],
            example: 'import json from "./data.json" assert { type: "json" };',
            modernSyntax: 'import json from "./data.json" with { type: "json" };',
            proposal: 'Import Assertions (Stage 3, deprecated)'
        },

        'with': {
            category: 'module',
            source: 'TypeScript',
            tsVersion: '5.3',
            contextual: true,
            description: 'Import attributes (replaces assert)',

            // 1. Syntactic Relationships
            followedBy: ['BRACE_OPEN'],
            precededBy: ['STRING', 'SEMICOLON'],
            parentContext: ['ImportDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,
            dualUsage: true,

            // 2. Parser Directives
            isModuleKeyword: true,
            contextual: true,
            isAttribute: true,
            requiresObject: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'with in import attributes vs with statement',
                    contexts: [
                        'import x from "mod" with { type: "json" } // Import attribute',
                        'with (obj) { ... } // with statement (deprecated)'
                    ],
                    note: 'Different contexts - import vs statement'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'with' requires attribute object in import context.",
            commonTypos: ['wiht', 'wth', 'wit'],
            notes: 'Import attributes (modern). Also deprecated with statement.',
            quirks: [
                'Import attributes (Stage 3)',
                'Replaces assert keyword',
                'JSON imports: with { type: "json" }',
                'CSS imports: with { type: "css" }',
                'Different from with statement'
            ],

            // 5. Complete Coverage
            stage: 'stage3',
            deprecated: false,
            tsVersion: '5.3',
            contextual: true,
            dualUsage: true,
            bestPractice: 'Use with for import attributes. Avoid with statement.',
            useCases: [
                'JSON imports',
                'CSS module imports',
                'WebAssembly imports',
                'Import type assertions'
            ],
            example: 'import json from "./data.json" with { type: "json" };',
            cssImport: 'import styles from "./styles.css" with { type: "css" };',
            wasmImport: 'import wasm from "./module.wasm" with { type: "webassembly" };',
            proposal: 'Import Attributes (Stage 3)',
            replaces: 'assert keyword'
        },
    },

    // ============================================================================
    // SPECIAL KEYWORDS - TypeScript Compiler
    // ============================================================================
    specialKeywords: {
        // Constructor
        'constructor': {
            category: 'special',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Class constructor method',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'public', 'private', 'protected'],
            parentContext: ['ClassBody'],
            startsExpr: false,
            beforeExpr: false,
            isMethodName: true,

            // 2. Parser Directives
            isSpecialMethod: true,
            isConstructor: true,
            canHaveModifiers: true,
            canHaveParameters: true,
            onlyOnePerClass: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'constructor method vs constructor property',
                    note: 'constructor() is method, not property'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Class can have only one constructor.",
            commonTypos: ['construtor', 'constuctor', 'consructor', 'contructor'],
            notes: 'Special method for class initialization. Only one per class.',
            quirks: [
                'Only one per class',
                'Cannot have return type annotation',
                'Cannot be async',
                'Cannot be generator',
                'Can have parameter properties (public/private/protected)',
                'super() call in derived classes'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            esVersion: 'ES2015',
            bestPractice: 'Use parameter properties for concise initialization.',
            useCases: [
                'Class initialization',
                'Parameter properties',
                'super() calls in inheritance'
            ],
            example: 'constructor(public name: string) {}',
            parameterProperties: 'constructor(public x: number, private y: number) {}',
            superCall: 'constructor() { super(); }'
        },

        // Type Predicates
        'checks': {
            category: 'special',
            source: 'Babel',
            tsVersion: 'experimental',
            contextual: true,
            description: 'Type checks keyword (experimental)',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN'],
            precededBy: ['IDENTIFIER', 'COLON'],
            parentContext: ['FunctionDeclaration', 'MethodDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,

            // 2. Parser Directives
            isExperimental: true,
            contextual: true,
            isTypePredicate: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'checks vs is - different type predicate syntax',
                    note: 'Experimental proposal, not standard TypeScript'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'checks' is experimental. Use 'is' for type predicates.",
            commonTypos: ['check', 'cheks', 'checsk'],
            notes: 'Experimental Babel feature. Not standard TypeScript.',
            quirks: [
                'Babel experimental feature',
                'Not in TypeScript standard',
                'Use is for standard type predicates',
                'May not be supported'
            ],

            // 5. Complete Coverage
            stage: 'experimental',
            deprecated: false,
            tsVersion: 'experimental',
            contextual: true,
            bestPractice: 'Use standard "is" type predicates instead.',
            useCases: [
                'Experimental type predicates'
            ],
            example: 'function isString(x: unknown) checks: x is string { ... }',
            standardAlternative: 'function isString(x: unknown): x is string { ... }'
        },

        // Mixins (Decorator Proposal)
        'mixins': {
            category: 'special',
            source: 'Babel',
            tsVersion: 'experimental',
            contextual: true,
            description: 'Mixin composition (experimental)',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN', 'IDENTIFIER'],
            precededBy: ['class', 'NEWLINE'],
            parentContext: ['ClassDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,

            // 2. Parser Directives
            isExperimental: true,
            contextual: true,
            isMixin: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'mixins proposal vs standard class extends',
                    note: 'Experimental decorator-based mixin system'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'mixins' is experimental Babel feature.",
            commonTypos: ['mixin', 'mixns', 'mixisn'],
            notes: 'Experimental Babel proposal. Use standard TypeScript patterns.',
            quirks: [
                'Babel experimental feature',
                'Not in TypeScript standard',
                'Use composition pattern instead',
                'May require special transpiler'
            ],

            // 5. Complete Coverage
            stage: 'experimental',
            deprecated: false,
            tsVersion: 'experimental',
            contextual: true,
            bestPractice: 'Use standard composition or extends instead.',
            useCases: [
                'Experimental mixin composition'
            ],
            example: 'class MyClass mixins Mixin1, Mixin2 {}',
            standardPattern: 'Use composition or helper functions for mixins'
        },

        // Intrinsic Types
        'intrinsic': {
            category: 'special',
            source: 'TypeScript',
            tsVersion: '4.8',
            contextual: true,
            description: 'Intrinsic string manipulation types',

            // 1. Syntactic Relationships
            followedBy: [],
            precededBy: ['type'],
            parentContext: ['TypeAliasDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,

            // 2. Parser Directives
            contextual: true,
            isIntrinsicType: true,
            builtInTransformation: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'intrinsic for built-in string manipulation types',
                    note: 'Used in lib.d.ts for Uppercase, Lowercase, etc.'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'intrinsic' is for built-in type transformations.",
            commonTypos: ['intrisic', 'intrnsic', 'intrinsnic'],
            notes: 'Internal keyword for built-in string manipulation types.',
            quirks: [
                'TypeScript 4.8+',
                'Used in lib.d.ts',
                'Uppercase, Lowercase, Capitalize, Uncapitalize',
                'Not for user code',
                'Compiler intrinsic'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '4.8',
            contextual: true,
            bestPractice: 'Do not use directly. Use built-in utility types.',
            intrinsicTypes: [
                'Uppercase<T>',
                'Lowercase<T>',
                'Capitalize<T>',
                'Uncapitalize<T>'
            ],
            useCases: [
                'Built-in string manipulation types',
                'Compiler-provided transformations'
            ],
            example: 'type Uppercase<S extends string> = intrinsic;',
            userCode: 'Use Uppercase<T>, Lowercase<T> etc. directly'
        },

        // Proto (for type compatibility)
        'proto': {
            category: 'special',
            source: 'Babel',
            tsVersion: 'internal',
            contextual: true,
            description: 'Prototype chain (internal)',

            // 1. Syntactic Relationships
            followedBy: ['COLON'],
            precededBy: ['DOT'],
            parentContext: ['MemberExpression'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,

            // 2. Parser Directives
            contextual: true,
            isInternal: true,
            prototypeRelated: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: '__proto__ vs proto contextual keyword',
                    note: 'Internal Babel feature for type compatibility'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'proto' is internal feature. Use __proto__ or Object.getPrototypeOf().",
            commonTypos: ['prot', 'protot', 'prto'],
            notes: 'Internal Babel feature. Use standard JavaScript prototype access.',
            quirks: [
                'Internal Babel feature',
                'Not standard TypeScript',
                'Use __proto__ or Object methods',
                'Type compatibility concern'
            ],

            // 5. Complete Coverage
            stage: 'internal',
            deprecated: false,
            tsVersion: 'internal',
            contextual: true,
            bestPractice: 'Use __proto__ or Object.getPrototypeOf() instead.',
            useCases: [
                'Internal type system'
            ],
            example: 'Internal usage only',
            standardAPI: 'Object.getPrototypeOf(obj) or obj.__proto__'
        },

        // Implements
        'implements': {
            category: 'special',
            source: 'TypeScript',
            tsVersion: '1.0',
            description: 'Class implements interface',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['IDENTIFIER', 'BRACE_CLOSE'],
            parentContext: ['ClassDeclaration'],
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isImplements: true,
            requiresInterface: true,
            canHaveMultiple: true,
            compileTimeOnly: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'TypeScript',
                    rule: 'implements vs extends - interface vs inheritance',
                    differences: [
                        'implements: Interface contract (compile-time)',
                        'extends: Class inheritance (runtime)',
                        'implements: Multiple interfaces',
                        'extends: Single class'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Class must implement all interface members.",
            commonTypos: ['implemnts', 'implements', 'impelements', 'implments'],
            notes: 'Compile-time check. Class must implement all interface members.',
            quirks: [
                'Compile-time only (erased)',
                'Can implement multiple interfaces',
                'Must implement all members',
                'No runtime check',
                'Vs extends: different purpose'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            tsVersion: '1.0',
            bestPractice: 'Use implements for interface contracts, extends for inheritance.',
            useCases: [
                'Interface implementation',
                'Multiple interface contracts',
                'Type safety'
            ],
            example: 'class User implements IUser, IEntity {}',
            multipleInterfaces: 'class X implements A, B, C {}',
            vsExtends: 'extends = inheritance, implements = contract'
        },
    },

    // ============================================================================
    // TYPE OPERATORS (Symbols) - TypeScript Compiler
    // ============================================================================
    typeOperatorSymbols: {
        // Union & Intersection
        '|': { type: 'union', source: 'TypeScript', tsVersion: '1.4' },
        '&': { type: 'intersection', source: 'TypeScript', tsVersion: '1.6' },

        // Conditional Types
        '?': { type: 'conditional', source: 'TypeScript', tsVersion: '2.8' },
        ':': { type: 'conditional', source: 'TypeScript', tsVersion: '2.8' },

        // Mapped Types
        '[': { type: 'mapped', source: 'TypeScript', tsVersion: '2.1' },
        ']': { type: 'mapped', source: 'TypeScript', tsVersion: '2.1' },

        // Index Signature
        '<': { type: 'generic', source: 'TypeScript', tsVersion: '1.0' },
        '>': { type: 'generic', source: 'TypeScript', tsVersion: '1.0' },

        // Arrow (Function Type)
        '=>': { type: 'arrow', source: 'TypeScript', tsVersion: '1.0' },

        // Optional/Rest
        '?': { type: 'optional', source: 'TypeScript', tsVersion: '1.0' },
        '...': { type: 'rest', source: 'TypeScript', tsVersion: '1.0' },

        // Non-null Assertion
        '!': { type: 'assertion', source: 'TypeScript', tsVersion: '2.0' },

        // Template Literal Types (ES2020)
        '${': { type: 'template', source: 'TypeScript', tsVersion: '4.1' },
        '}': { type: 'template', source: 'TypeScript', tsVersion: '4.1' },
    },

    // ============================================================================
    // JSX KEYWORDS - ANTLR TypeScript Grammar
    // ============================================================================
    jsxKeywords: {
        // JSX Elements (inherited from JavaScript)
        // Note: JSX uses HTML-like tags, not keywords
        // But TypeScript has special handling for JSX
    },

    // ============================================================================
    // DECORATORS - TypeScript 5.0+ (Stage 3)
    // ============================================================================
    decorators: {
        '@': { type: 'decorator', source: 'TypeScript', tsVersion: '5.0' },
    },

    // ============================================================================
    // SYNTAX KIND ENUM - TypeScript Compiler src/compiler/types.ts
    // ============================================================================
    syntaxKinds: {
        // Classification Types (from TypeScript Classifier)
        classifications: {
            comment: 'Comment token',
            identifier: 'Identifier token',
            keyword: 'Keyword token',
            numericLiteral: 'Numeric literal token',
            bigintLiteral: 'BigInt literal token',
            operator: 'Operator token',
            stringLiteral: 'String literal token',
            regularExpressionLiteral: 'RegExp literal token',
            whiteSpace: 'Whitespace token',
            text: 'Plain text token',
            punctuation: 'Punctuation token',
            className: 'Class name token',
            enumName: 'Enum name token',
            interfaceName: 'Interface name token',
            moduleName: 'Module name token',
            typeParameterName: 'Type parameter name token',
            typeAliasName: 'Type alias name token',
            parameterName: 'Parameter name token',
        },
    },

    // ============================================================================
    // TRIPLE-SLASH DIRECTIVES - TypeScript Compiler
    // ============================================================================
    tripleSlashDirectives: {
        '/// <reference': { type: 'reference', source: 'TypeScript', tsVersion: '1.0' },
        '/// <amd-module': { type: 'amd-module', source: 'TypeScript', tsVersion: '1.5' },
        '/// <amd-dependency': { type: 'amd-dependency', source: 'TypeScript', tsVersion: '1.5' },
    },

    // ============================================================================
    // TYPE COMPATIBILITY - TypeScript Compiler
    // ============================================================================
    typeCompatibility: {
        // Structural Typing
        structural: 'TypeScript uses structural type system',

        // Variance
        covariance: 'Return types are covariant',
        contravariance: 'Parameter types are contravariant',
        bivariance: 'Methods are bivariant (with strictFunctionTypes: false)',
        invariance: 'Generics are invariant',
    },
};

// Export ทั้ง grammar และ metadata
export default TYPESCRIPT_GRAMMAR;
