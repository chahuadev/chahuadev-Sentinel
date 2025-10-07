//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// Chahuadev Engine Grammar Dictionary - Core Language Support
// ============================================================================
// JavaScript/ECMAScript Grammar Dictionary
// อ้างอิงจาก:
// - ECMAScript 2026 Language Specification (https://tc39.es/ecma262/)
// - Babel Parser tokenizer/types.ts (https://github.com/babel/babel)
// - ANTLR JavaScript Grammar (https://github.com/antlr/grammars-v4)
// ============================================================================
// ครอบคลุม: ES1 (1997) - ES2024
// ============================================================================

export const JAVASCRIPT_GRAMMAR = {
    // ============================================================================
    // KEYWORDS (Reserved Words) - ECMAScript 2026 Section 12.8.1
    // ============================================================================
    keywords: {
        // Control Flow - ES1
        'if': {
            category: 'control',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Conditional statement - executes code based on condition',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE', 'BRACE_OPEN', 'else'],
            parentContext: ['BlockStatement', 'IfStatement', 'Program', 'FunctionBody'],
            startsExpr: false,
            beforeExpr: true,
            canBeNested: true,

            // 2. Parser Directives
            isStatement: true,
            isControl: true,
            requiresCondition: true,
            canHaveElse: true,
            hoisted: false,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'if statement vs ternary operator',
                    contexts: [
                        'if (condition) { ... } // if statement',
                        'condition ? a : b // ternary operator'
                    ]
                },
                {
                    language: 'JavaScript',
                    rule: 'Dangling else problem',
                    note: 'else associates with nearest unmatched if',
                    example: 'if (a) if (b) x; else y; // else belongs to inner if'
                }
            ],

            // 4. Error Reporting
            errorMessage: "An 'if' statement must be followed by a condition in parentheses '(condition)'.",
            commonTypos: ['fi', 'iif', 'iff', 'iof'],
            notes: 'Condition must be in parentheses. Body can be single statement or block.',
            quirks: [
                'Condition is always evaluated (no short-circuit here)',
                'Truthy/falsy conversion applies',
                'Dangling else associates with nearest if',
                'Can be without braces (single statement)',
                'Prefer braces for clarity'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.6',
            bestPractice: 'Always use braces {}. Avoid deeply nested ifs.',
            useCases: [
                'Conditional execution',
                'Guard clauses',
                'Early returns',
                'Validation logic'
            ],
            example: 'if (condition) { doSomething(); }',
            ifElse: 'if (x > 0) { ... } else { ... }',
            ifElseIf: 'if (x > 0) { ... } else if (x < 0) { ... } else { ... }',
            withoutBraces: 'if (x) return; // Valid but discouraged',
            truthyFalsy: 'if (0) // false, if (1) // true, if ("") // false'
        },
        'else': {
            category: 'control',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Else clause - executes when if condition is false',

            // 1. Syntactic Relationships
            followedBy: ['BRACE_OPEN', 'if', 'IDENTIFIER', 'Statement'],
            precededBy: ['BRACE_CLOSE', 'Statement', 'SEMICOLON'],
            parentContext: ['IfStatement'],
            startsExpr: false,
            beforeExpr: true,
            requiresIf: true,

            // 2. Parser Directives
            isStatement: true,
            isControl: true,
            requiresIf: true,
            canChain: true,
            mustFollowIf: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'else if vs else + nested if',
                    contexts: [
                        'else if (x) { ... } // else if (recommended)',
                        'else { if (x) { ... } } // else + nested if'
                    ],
                    note: 'Both are equivalent, else if is preferred'
                },
                {
                    language: 'JavaScript',
                    rule: 'Dangling else problem',
                    resolution: 'else matches nearest unmatched if',
                    example: 'if (a) if (b) x; else y; // else belongs to inner if'
                }
            ],

            // 4. Error Reporting
            errorMessage: "An 'else' statement must follow an 'if' statement and be followed by a block '{}' or another 'if'.",
            commonTypos: ['esle', 'eles', 'lese', 'els'],
            notes: 'Must immediately follow if or else if. Associates with nearest if.',
            quirks: [
                'Must follow if statement',
                'Dangling else ambiguity',
                'else if is syntactic sugar',
                'Can be without braces (not recommended)',
                'No condition needed'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.6',
            bestPractice: 'Use else if for multiple conditions. Always use braces.',
            useCases: [
                'Alternative execution path',
                'Multiple conditions (else if)',
                'Default case',
                'Fallback logic'
            ],
            example: 'if (condition) { ... } else { ... }',
            elseIf: 'if (x > 0) { ... } else if (x < 0) { ... } else { ... }',
            danglingElse: 'if (a) if (b) x(); else y(); // else belongs to inner if',
            addBraces: 'if (a) { if (b) x(); } else { y(); } // Explicit grouping'
        },
        'switch': {
            category: 'control',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Switch statement - multi-way branch based on value',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE', 'BRACE_OPEN'],
            parentContext: ['BlockStatement', 'Program', 'FunctionBody'],
            startsExpr: false,
            beforeExpr: true,
            containsCases: true,

            // 2. Parser Directives
            isStatement: true,
            isControl: true,
            requiresExpression: true,
            requiresCases: true,
            hasFallthrough: true,
            strictComparison: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'switch vs if-else chain',
                    guideline: 'Use switch for discrete values, if-else for ranges/complex conditions',
                    note: 'switch uses strict equality (===)'
                },
                {
                    language: 'JavaScript',
                    rule: 'Fall-through behavior',
                    warning: 'Cases fall through without break',
                    example: 'case 1: doOne(); case 2: doTwo(); // Both execute for case 1!'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'switch' statement must be followed by a parenthesized expression and a block containing 'case' clauses.",
            commonTypos: ['swtich', 'swich', 'swicth', 'switc'],
            notes: 'Uses strict equality (===). Cases fall through without break. Expression evaluated once.',
            quirks: [
                'Strict equality (===) comparison',
                'Fall-through without break',
                'Expression evaluated once',
                'default can appear anywhere',
                'Block scoping with let/const',
                'Can switch on any type'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.12',
            bestPractice: 'Use break to prevent fall-through. Consider using object lookup for simple cases.',
            useCases: [
                'Multiple discrete values',
                'State machines',
                'Command dispatch',
                'Menu selection'
            ],
            example: 'switch (value) { case 1: ...; break; default: ...; }',
            fallthrough: 'case 1: case 2: case 3: // Intentional fall-through',
            blockScoping: 'case 1: { let x = 1; } break; // Block for scoping',
            alternatives: 'Object lookup: const actions = { a: fn1, b: fn2 }; actions[key]();',
            strictEquality: 'switch(1) { case "1": // Not matched! }',
            expressionEvaluation: 'switch(fn()) // fn() called once only'
        },
        'case': {
            category: 'control',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Case clause - matches specific value in switch',

            // 1. Syntactic Relationships
            followedBy: ['Expression', 'LITERAL'],
            precededBy: ['BRACE_OPEN', 'COLON', 'break', 'Statement', 'NEWLINE'],
            parentContext: ['SwitchStatement'],
            requiresColon: true,
            startsExpr: false,
            beforeExpr: true,

            // 2. Parser Directives
            isClause: true,
            requiresExpression: true,
            requiresColon: true,
            canFallthrough: true,
            onlyInSwitch: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'case in switch vs labeled statement',
                    contexts: [
                        'switch(x) { case 1: ... } // switch case',
                        'myLabel: statement; // labeled statement (different)'
                    ]
                },
                {
                    language: 'JavaScript',
                    rule: 'Multiple case labels',
                    pattern: 'case 1: case 2: case 3: shared code',
                    note: 'Fall-through for multiple matches'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'case' clause must be followed by an expression and a colon ':'.",
            commonTypos: ['caes', 'csae', 'cas', 'cae'],
            notes: 'Must be inside switch. Strict equality (===). Fall-through without break.',
            quirks: [
                'Only valid inside switch',
                'Strict equality comparison',
                'Fall-through without break',
                'Can match expressions',
                'Multiple cases can share code',
                'No braces needed'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.12',
            bestPractice: 'Use break to prevent fall-through. Group related cases.',
            useCases: [
                'Discrete value matching',
                'Multiple values  same action',
                'State machine transitions',
                'Command routing'
            ],
            example: 'case 1: doSomething(); break;',
            multipleCases: 'case 1: case 2: case 3: shared(); break;',
            expressions: 'case x + y: case fn(): // Valid expressions',
            fallthrough: 'case 1: doOne(); // Falls through to next case!',
            withBlock: 'case 1: { let x = 1; } break; // Block scoping'
        },

        'default': {
            category: 'control',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Default clause - fallback in switch statement',

            // 1. Syntactic Relationships
            followedBy: ['COLON'],
            precededBy: ['BRACE_OPEN', 'COLON', 'break', 'Statement', 'NEWLINE'],
            parentContext: ['SwitchStatement'],
            requiresColon: true,
            startsExpr: false,
            beforeExpr: true,

            // 2. Parser Directives
            isClause: true,
            isDefault: true,
            requiresColon: true,
            catchAll: true,
            onlyInSwitch: true,
            maxOne: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'default in switch vs default export',
                    contexts: [
                        'switch(x) { default: ... } // switch default',
                        'export default X; // default export (different)'
                    ]
                },
                {
                    language: 'JavaScript',
                    rule: 'default position',
                    note: 'Can appear anywhere in switch, but conventionally last'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'default' clause must be followed by a colon ':'.",
            commonTypos: ['defualt', 'deafult', 'deualt', 'defalt'],
            notes: 'Catch-all clause. Only one per switch. Can appear anywhere.',
            quirks: [
                'Only valid inside switch',
                'Only one default per switch',
                'Can appear anywhere (not just last)',
                'Executes if no case matches',
                'Still falls through without break',
                'Optional but recommended'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.12',
            bestPractice: 'Always include default for completeness. Place at end by convention.',
            useCases: [
                'Fallback case',
                'Error handling',
                'Unexpected value handling',
                'Completeness check'
            ],
            example: 'default: handleOther(); break;',
            position: 'case 1: break; default: break; case 2: break; // Valid but unusual',
            noBreak: 'default: doDefault(); // Falls through!',
            withThrow: 'default: throw new Error("Unexpected value");'
        },

        // Iteration - ES1
        'for': {
            category: 'iteration',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'For loop - iteration with initialization, condition, increment',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE', 'BRACE_OPEN'],
            parentContext: ['BlockStatement', 'Program', 'FunctionBody'],
            startsExpr: false,
            beforeExpr: true,
            isLoop: true,

            // 2. Parser Directives
            isStatement: true,
            isIteration: true,
            isLoop: true,
            hasMultipleForms: true,
            canUseBreak: true,
            canUseContinue: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'Multiple for loop variants',
                    variants: [
                        'for (init; condition; increment) // Classic for',
                        'for (let item of iterable) // for-of (ES6)',
                        'for (let key in object) // for-in',
                        'for await (let item of asyncIterable) // for-await-of (ES2018)'
                    ]
                },
                {
                    language: 'JavaScript',
                    rule: 'for-in vs for-of',
                    forIn: 'Iterates over enumerable property keys',
                    forOf: 'Iterates over iterable values',
                    example: 'for (let k in arr) // indices. for (let v of arr) // values'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'for' loop must be followed by parentheses containing initialization, condition, and increment.",
            commonTypos: ['fro', 'ofr', 'forr', 'fo', 'fr'],
            notes: 'Three forms: classic, for-in, for-of. Each has different semantics.',
            quirks: [
                'Classic: for (init; test; update)',
                'for-in: Iterates keys (including prototype)',
                'for-of: Iterates values (Symbol.iterator)',
                'All parts optional in classic for',
                'let/const scoping per iteration',
                'for-await-of for async iterables'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.7',
            enhancements: {
                ES6: 'for-of loop',
                ES2018: 'for-await-of loop'
            },
            bestPractice: 'Use for-of for arrays, for-in with hasOwnProperty, classic for rare.',
            useCases: [
                'Iteration with counter',
                'Object property iteration',
                'Array value iteration',
                'Async iteration'
            ],
            example: 'for (let i = 0; i < 10; i++) { ... }',
            forOf: 'for (const value of array) { ... }',
            forIn: 'for (const key in object) { if (obj.hasOwnProperty(key)) ... }',
            forAwaitOf: 'for await (const item of asyncIterable) { ... }',
            infiniteLoop: 'for (;;) { ... } // Infinite loop',
            blockScoping: 'for (let i = 0; i < 10; i++) // Fresh i each iteration'
        },

        'while': {
            category: 'iteration',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'While loop - iteration while condition is true',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE', 'BRACE_OPEN', 'do'],
            parentContext: ['BlockStatement', 'Program', 'FunctionBody', 'DoWhileStatement'],
            startsExpr: false,
            beforeExpr: true,
            isLoop: true,

            // 2. Parser Directives
            isStatement: true,
            isIteration: true,
            isLoop: true,
            requiresCondition: true,
            canUseBreak: true,
            canUseContinue: true,
            preTest: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'while vs do-while',
                    while: 'Pre-test loop (may not execute)',
                    doWhile: 'Post-test loop (executes at least once)',
                    example: 'while (false) {} // Never runs. do {} while (false); // Runs once'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'while' loop must be followed by a condition in parentheses '(condition)'.",
            commonTypos: ['whiel', 'wihle', 'whille', 'wile', 'whle'],
            notes: 'Pre-test loop. Condition checked before each iteration. May not execute at all.',
            quirks: [
                'Pre-test loop (condition before body)',
                'May execute zero times',
                'Condition must be truthy to continue',
                'Infinite loop: while (true)',
                'Common for event loops',
                'Can be replaced with for(;;)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.7',
            bestPractice: 'Use when iteration count is unknown. Ensure termination condition.',
            useCases: [
                'Unknown iteration count',
                'Event loops',
                'Processing until condition met',
                'Polling'
            ],
            example: 'while (condition) { ... }',
            infiniteLoop: 'while (true) { ... break; }',
            zeroIterations: 'while (false) { /* Never runs */ }',
            vsFor: 'for (;;) {} // Equivalent to while (true)'
        },

        'do': {
            category: 'iteration',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Do-while loop - executes at least once, then checks condition',

            // 1. Syntactic Relationships
            followedBy: ['BRACE_OPEN', 'Statement'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE', 'BRACE_OPEN'],
            parentContext: ['BlockStatement', 'Program', 'FunctionBody'],
            requiresWhile: true,
            startsExpr: false,
            beforeExpr: true,
            isLoop: true,

            // 2. Parser Directives
            isStatement: true,
            isIteration: true,
            isLoop: true,
            requiresWhile: true,
            canUseBreak: true,
            canUseContinue: true,
            postTest: true,
            guaranteedOnce: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'do-while vs while',
                    doWhile: 'Post-test loop (at least once)',
                    while: 'Pre-test loop (may skip)',
                    example: 'do { ... } while (false); // Runs once!'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'do...while' loop must be followed by a block '{}' and then a 'while' condition.",
            commonTypos: ['od', 'doo', 'dow'],
            notes: 'Post-test loop. Body executes before condition check. Guarantees at least one execution.',
            quirks: [
                'Post-test loop (body before condition)',
                'Always executes at least once',
                'Requires while after body',
                'Semicolon after while(condition)',
                'Less common than while',
                'Good for "do once then maybe repeat"'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.7',
            bestPractice: 'Use when body must execute at least once. Remember semicolon after while.',
            useCases: [
                'Execute then check',
                'Input validation loops',
                'Menu systems',
                'Retry logic'
            ],
            example: 'do { ... } while (condition);',
            guaranteedExecution: 'do { console.log("Always runs"); } while (false);',
            semicolon: 'do { ... } while (x < 10); // Semicolon required!',
            vsWhile: 'do { ... } while (condition); // At least once. while (condition) { ... } // Maybe zero'
        },

        'break': {
            category: 'iteration',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Break statement - exits loop or switch',

            // 1. Syntactic Relationships
            followedBy: ['SEMICOLON', 'IDENTIFIER', 'LineTerminator', 'NEWLINE'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['IterationStatement', 'SwitchStatement', 'LabeledStatement'],
            canHaveLabel: true,
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isStatement: true,
            isJump: true,
            exitsBlock: true,
            canHaveLabel: true,
            requiresLoopOrSwitch: true,
            noLineBreakBeforeLabel: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'break vs labeled break',
                    unlabeled: 'Exits innermost loop/switch',
                    labeled: 'Exits to specific label',
                    example: 'outer: for (...) { inner: for (...) { break outer; } }'
                },
                {
                    language: 'JavaScript',
                    rule: 'break in switch vs loop',
                    switch: 'Prevents fall-through',
                    loop: 'Exits loop entirely',
                    note: 'Same keyword, different semantics'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'break' statement must be inside a loop or switch statement.",
            commonTypos: ['braek', 'brak', 'breka', 'brek'],
            notes: 'Exits innermost loop/switch. Can use label for outer loops. No line break before label.',
            quirks: [
                'Exits innermost enclosing loop/switch',
                'Can use label to exit outer loop',
                'No line break before label name',
                'Not allowed in function',
                'switch: prevents fall-through',
                'Labeled break exits to label'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.9',
            bestPractice: 'Use unlabeled break for simple cases. Labeled break for nested loops.',
            useCases: [
                'Exit loop early',
                'Prevent switch fall-through',
                'Exit nested loops',
                'Error conditions'
            ],
            example: 'break;',
            labeled: 'outer: for (...) { for (...) { break outer; } }',
            inSwitch: 'case 1: doSomething(); break;',
            noLineBreak: 'break\nlabel; // Error: label ignored (ASI inserts semicolon)'
        },

        'continue': {
            category: 'iteration',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Continue statement - skips to next iteration',

            // 1. Syntactic Relationships
            followedBy: ['SEMICOLON', 'IDENTIFIER', 'LineTerminator', 'NEWLINE'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'if'],
            parentContext: ['IterationStatement', 'LabeledStatement'],
            canHaveLabel: true,
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isStatement: true,
            isJump: true,
            skipToNext: true,
            canHaveLabel: true,
            requiresLoop: true,
            noLineBreakBeforeLabel: true,
            notInSwitch: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'continue vs labeled continue',
                    unlabeled: 'Continues innermost loop',
                    labeled: 'Continues to specific labeled loop',
                    example: 'outer: for (...) { inner: for (...) { continue outer; } }'
                },
                {
                    language: 'JavaScript',
                    rule: 'continue vs break',
                    continue: 'Skips to next iteration',
                    break: 'Exits loop entirely',
                    note: 'continue only in loops, not switch'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'continue' statement must be inside a loop.",
            commonTypos: ['contine', 'contineu', 'contiue', 'contineu', 'cotinue'],
            notes: 'Skips to next iteration. Only in loops, not switch. Can use label for outer loops.',
            quirks: [
                'Only in loops (not switch)',
                'Skips to next iteration',
                'Can use label for outer loop',
                'No line break before label',
                'for loop: jumps to increment',
                'while/do-while: jumps to condition'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.8',
            bestPractice: 'Use for early return in loop body. Consider filter/map instead.',
            useCases: [
                'Skip iteration',
                'Conditional processing',
                'Guard clauses in loops',
                'Continue to labeled loop'
            ],
            example: 'if (skip) continue;',
            labeled: 'outer: for (...) { for (...) { continue outer; } }',
            inFor: 'for (let i = 0; i < 10; i++) { if (i % 2) continue; /* even only */ }',
            notInSwitch: 'switch (x) { case 1: continue; /* Error! */ }',
            alternatives: 'array.filter(x => condition).forEach(...) // Instead of continue'
        },

        // Exception Handling - ES3
        'try': {
            category: 'exception',
            esVersion: 'ES3',
            source: 'ECMA-262',
            description: 'Try block - error handling with catch/finally',

            // 1. Syntactic Relationships
            followedBy: ['BRACE_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE', 'BRACE_OPEN'],
            parentContext: ['BlockStatement', 'Program', 'FunctionBody'],
            requiresCatchOrFinally: true,
            startsExpr: false,
            beforeExpr: true,

            // 2. Parser Directives
            isStatement: true,
            isException: true,
            requiresCatchOrFinally: true,
            canHaveBoth: true,
            mustHaveBlock: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'try-catch-finally combinations',
                    valid: [
                        'try { } catch (e) { }',
                        'try { } finally { }',
                        'try { } catch (e) { } finally { }'
                    ],
                    invalid: 'try { } // Must have catch or finally'
                },
                {
                    language: 'JavaScript',
                    rule: 'Optional catch binding (ES2019)',
                    legacy: 'catch (error) { }',
                    modern: 'catch { } // No binding needed'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'try' statement must be followed by a block '{}' and at least one 'catch' or 'finally' clause.",
            commonTypos: ['tyr', 'tri', 'tryy', 'trey'],
            notes: 'Must have catch, finally, or both. ES2019+ allows catch without binding.',
            quirks: [
                'Must have catch or finally (or both)',
                'try alone is invalid',
                'catch binding optional (ES2019+)',
                'finally always executes',
                'Return in finally overrides try/catch return',
                'Errors bubble up if not caught'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES3',
            spec: 'ECMA-262 Section 14.15',
            enhancements: {
                ES2019: 'Optional catch binding'
            },
            bestPractice: 'Always catch specific errors. Use finally for cleanup. Avoid catch-all.',
            useCases: [
                'Error handling',
                'Resource cleanup',
                'Async error handling',
                'Fallback logic'
            ],
            example: 'try { riskyOperation(); } catch (error) { handleError(error); }',
            withFinally: 'try { ... } catch (e) { ... } finally { cleanup(); }',
            optionalBinding: 'try { JSON.parse(str); } catch { /* ES2019+ */ }',
            onlyFinally: 'try { ... } finally { cleanup(); }',
            returnOverride: 'try { return 1; } finally { return 2; } // Returns 2!'
        },

        'catch': {
            category: 'exception',
            esVersion: 'ES3',
            source: 'ECMA-262',
            description: 'Catch clause - handles thrown exceptions',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN', 'BRACE_OPEN'],
            precededBy: ['BRACE_CLOSE'],
            parentContext: ['TryStatement'],
            requiresTry: true,
            startsExpr: false,
            beforeExpr: true,

            // 2. Parser Directives
            isClause: true,
            isException: true,
            requiresTry: true,
            canHaveBinding: true,
            bindingOptional: true, // ES2019+
            canHaveFinally: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'catch binding evolution',
                    legacy: 'catch (error) { } // Required binding',
                    modern: 'catch { } // Optional binding (ES2019+)',
                    note: 'Omit binding if error not used'
                },
                {
                    language: 'JavaScript',
                    rule: 'catch scope',
                    note: 'catch parameter is block-scoped',
                    example: 'catch (e) { let e; } // Error: e already declared'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'catch' clause must follow a 'try' block and can optionally have a parameter in parentheses '(error)'.",
            commonTypos: ['cathc', 'cath', 'catc', 'caatch'],
            notes: 'Handles exceptions from try. Binding optional (ES2019+). Block-scoped parameter.',
            quirks: [
                'Must follow try block',
                'Binding optional (ES2019+)',
                'Catch parameter is block-scoped',
                'Can have finally after',
                'Catches all errors (no type filtering)',
                'Re-throwing is common pattern'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES3',
            spec: 'ECMA-262 Section 14.15',
            enhancements: {
                ES2019: 'Optional catch binding'
            },
            bestPractice: 'Catch specific errors. Re-throw unexpected errors. Use optional binding if error unused.',
            useCases: [
                'Error handling',
                'Error recovery',
                'Logging errors',
                'Re-throwing errors'
            ],
            example: 'catch (error) { console.error(error); }',
            optionalBinding: 'catch { /* Ignore error */ }',
            rethrowing: 'catch (e) { if (e instanceof TypeError) handle(e); else throw e; }',
            blockScoping: 'catch (e) { /* e only visible here */ }',
            multipleErrors: 'catch (e) { if (e.code === "ERR1") {...} else if (e.code === "ERR2") {...} }'
        },

        'finally': {
            category: 'exception',
            esVersion: 'ES3',
            source: 'ECMA-262',
            description: 'Finally clause - always executes after try/catch',

            // 1. Syntactic Relationships
            followedBy: ['BRACE_OPEN'],
            precededBy: ['BRACE_CLOSE'],
            parentContext: ['TryStatement'],
            requiresTry: true,
            startsExpr: false,
            beforeExpr: true,

            // 2. Parser Directives
            isClause: true,
            isException: true,
            requiresTry: true,
            alwaysExecutes: true,
            canOverrideReturn: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'finally execution guarantee',
                    note: 'Executes even if try/catch returns or throws',
                    warning: 'Return in finally overrides try/catch return'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'finally' clause must follow a 'try' or 'catch' block.",
            commonTypos: ['finaly', 'finnaly', 'finallly', 'fnally'],
            notes: 'Always executes. Can override return values. Good for cleanup.',
            quirks: [
                'Always executes (even with return/throw)',
                'Return in finally overrides earlier returns',
                'Throw in finally overrides earlier errors',
                'Used for cleanup/resource management',
                'Executes before function returns',
                'Can suppress exceptions (if returns)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES3',
            spec: 'ECMA-262 Section 14.15',
            bestPractice: 'Use for cleanup only. Avoid return/throw in finally.',
            useCases: [
                'Resource cleanup',
                'File closing',
                'Connection closing',
                'Reset state'
            ],
            example: 'finally { cleanup(); }',
            withReturn: 'try { return 1; } finally { return 2; } // Returns 2!',
            cleanup: 'finally { file.close(); connection.close(); }',
            alwaysRuns: 'try { throw new Error(); } catch (e) { } finally { /* Always runs */ }',
            dangerousReturn: 'finally { return; } // Suppresses exceptions!'
        },

        'throw': {
            category: 'exception',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Throw statement - raises exception',

            // 1. Syntactic Relationships
            followedBy: ['Expression', 'new', 'IDENTIFIER'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'if'],
            parentContext: ['BlockStatement', 'CatchClause', 'Program', 'FunctionBody'],
            requiresExpression: true,
            noLineBreak: true,
            startsExpr: false,
            beforeExpr: true,

            // 2. Parser Directives
            isStatement: true,
            isException: true,
            requiresExpression: true,
            noLineBreakAfter: true,
            terminatesExecution: true,
            canThrowAny: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'throw anything (not just Error)',
                    note: 'Can throw any value, but Error objects recommended',
                    examples: [
                        'throw new Error("message");',
                        'throw "string"; // Valid but discouraged',
                        'throw { code: 404 }; // Valid but discouraged'
                    ]
                },
                {
                    language: 'JavaScript',
                    rule: 'No line break after throw (ASI)',
                    valid: 'throw new Error("error");',
                    invalid: 'throw\nnew Error(); // ASI: throw; (SyntaxError)',
                    note: 'Line break inserts semicolon'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'throw' statement must be followed by an expression (no line break allowed).",
            commonTypos: ['thorw', 'thow', 'trhow', 'throow'],
            notes: 'No line break after throw (ASI issue). Can throw any value. Terminates execution.',
            quirks: [
                'No line break after throw keyword',
                'Can throw any value (not just Error)',
                'Terminates current execution context',
                'Bubbles up call stack',
                'Error objects have stack trace',
                'Custom error types inherit from Error'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.14',
            bestPractice: 'Throw Error objects. Include descriptive messages. Use custom error types.',
            errorTypes: [
                'Error',
                'TypeError',
                'ReferenceError',
                'SyntaxError',
                'RangeError',
                'Custom Error classes'
            ],
            useCases: [
                'Error signaling',
                'Validation failures',
                'Async error propagation',
                'Control flow (discouraged)'
            ],
            example: 'throw new Error("Something went wrong");',
            customError: 'class CustomError extends Error {}; throw new CustomError();',
            asiIssue: 'throw\nerror; // Error: ASI inserts semicolon after throw',
            throwAny: 'throw "error"; // Valid but not recommended',
            asyncThrow: 'async function fn() { throw new Error(); } // Rejects promise'
        },

        // Function Declaration - ES1
        'function': {
            category: 'declaration',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Function declaration/expression - defines reusable code block',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'PAREN_OPEN', 'STAR', 'async'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'PAREN_OPEN', 'ASSIGN', 'async'],
            parentContext: ['Program', 'BlockStatement', 'FunctionDeclaration', 'Expression'],
            startsExpr: true,
            beforeExpr: false,
            dualUsage: true,

            // 2. Parser Directives
            isDeclaration: true,
            isExpression: true,
            dualUsage: true,
            canBeAsync: true,
            canBeGenerator: true,
            hoisted: true, // declarations only

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'function declaration vs expression',
                    declaration: 'function name() {} // Hoisted, requires name',
                    expression: 'const fn = function() {}; // Not hoisted, name optional',
                    note: 'Context determines which form'
                },
                {
                    language: 'JavaScript',
                    rule: 'Function variants',
                    regular: 'function fn() {}',
                    generator: 'function* gen() {}',
                    async: 'async function fn() {}',
                    asyncGenerator: 'async function* fn() {}',
                    arrow: '() => {} // Arrow function (different)'
                },
                {
                    language: 'JavaScript',
                    rule: 'Named function expression',
                    note: 'Name only visible inside function',
                    example: 'const fn = function myName() { myName(); }; myName(); // Error'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A function declaration must start with 'function', optionally followed by a name, and parentheses '()' for parameters.",
            commonTypos: ['functoin', 'fucntion', 'funciton', 'fuctnion', 'functino', 'funciton'],
            notes: 'Declarations are hoisted. Expressions are not. Name optional in expressions.',
            quirks: [
                'Declarations hoisted to top',
                'Expressions not hoisted',
                'Named expressions: name visible only inside',
                'Generator: function* syntax',
                'Async: async function syntax',
                'Arrow functions are different'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 15.2',
            enhancements: {
                ES6: 'Arrow functions, default parameters, rest parameters',
                ES8: 'Async functions',
                ES2018: 'Async generators'
            },
            bestPractice: 'Use arrow functions for simple cases. Named functions for recursion/debugging.',
            useCases: [
                'Reusable code',
                'Callbacks',
                'Event handlers',
                'Modules',
                'Recursion'
            ],
            example: 'function greet(name) { return `Hello ${name}`; }',
            expression: 'const greet = function(name) { return `Hello ${name}`; };',
            generator: 'function* range(n) { for (let i = 0; i < n; i++) yield i; }',
            async: 'async function fetchData() { return await fetch(url); }',
            asyncGenerator: 'async function* asyncRange(n) { for (let i = 0; i < n; i++) yield i; }',
            namedExpression: 'const fn = function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); };',
            hoisting: 'fn(); function fn() {} // Works! (hoisted)'
        },

        'return': {
            category: 'control',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Return statement - exits function with optional value',

            // 1. Syntactic Relationships
            followedBy: ['Expression', 'SEMICOLON', 'LineTerminator', 'NEWLINE', 'BRACE_CLOSE'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'if'],
            parentContext: ['FunctionBody', 'ArrowFunctionBody'],
            canHaveExpression: true,
            lineBreakAllowed: true,
            startsExpr: false,
            beforeExpr: true,

            // 2. Parser Directives
            isStatement: true,
            isControl: true,
            requiresFunction: true,
            terminatesExecution: true,
            allowsLineBreak: true,
            canOmitValue: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'return with/without value',
                    withValue: 'return value;',
                    withoutValue: 'return; // Returns undefined',
                    note: 'Line break after return can trigger ASI'
                },
                {
                    language: 'JavaScript',
                    rule: 'ASI with return',
                    intended: 'return { key: value };',
                    asi: 'return\n{ key: value }; // ASI: return; (returns undefined!)',
                    note: 'Line break inserts semicolon'
                },
                {
                    language: 'JavaScript',
                    rule: 'Arrow function implicit return',
                    explicit: 'const fn = () => { return value; };',
                    implicit: 'const fn = () => value; // Implicit return',
                    note: 'No braces = implicit return'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'return' statement must be inside a function body.",
            commonTypos: ['retrun', 'retur', 'retrn', 'retunr'],
            notes: 'Line break after return triggers ASI. Must be in function. Returns undefined if no value.',
            quirks: [
                'Must be inside function',
                'Line break after return triggers ASI',
                'Without value returns undefined',
                'finally can override return value',
                'Async functions return Promise',
                'Generators return iterator'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.10',
            bestPractice: 'Use explicit returns. Avoid line breaks after return. Early returns for guards.',
            useCases: [
                'Function result',
                'Early exit',
                'Guard clauses',
                'Error handling'
            ],
            example: 'return result;',
            noValue: 'return; // Returns undefined',
            asiPitfall: 'return\n{ x: 1 }; // ASI: return; (returns undefined!)',
            earlyReturn: 'if (!valid) return; // Guard clause',
            finallyOverride: 'try { return 1; } finally { return 2; } // Returns 2!',
            asyncReturn: 'async function fn() { return value; } // Returns Promise<value>',
            arrowImplicit: '() => value // Implicit return'
        },

        // Variable Declaration - ES1/ES5/ES6
        'var': {
            category: 'declaration',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Variable declaration - function-scoped, hoisted (legacy)',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'BRACE_OPEN', 'BRACKET_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'PAREN_OPEN', 'for'],
            parentContext: ['Program', 'BlockStatement', 'ForStatement', 'FunctionBody'],
            canDestructure: true,
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isVariable: true,
            functionScoped: true,
            hoisted: true,
            canRedeclare: true,
            initializerOptional: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'var vs let vs const',
                    var: 'Function-scoped, hoisted, can redeclare',
                    let: 'Block-scoped, TDZ, no redeclare',
                    const: 'Block-scoped, TDZ, must initialize, no reassign',
                    recommendation: 'Use const by default, let when reassignment needed'
                },
                {
                    language: 'JavaScript',
                    rule: 'Hoisting behavior',
                    example: 'console.log(x); var x = 1; // undefined (hoisted)',
                    note: 'Declaration hoisted, assignment not'
                },
                {
                    language: 'JavaScript',
                    rule: 'Function vs block scope',
                    example: 'if (true) { var x = 1; } console.log(x); // 1 (function-scoped!)',
                    note: 'Ignores block boundaries'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'var' declaration must be followed by a variable name.",
            commonTypos: ['vra', 'va', 'varr', 'ver'],
            notes: 'Legacy. Function-scoped. Hoisted. Can redeclare. Use let/const instead.',
            quirks: [
                'Function-scoped (ignores blocks)',
                'Hoisted to function top',
                'Can redeclare same name',
                'Global var creates window property',
                'for loop var leaks',
                'Deprecated in modern code'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: true,
            deprecationMessage: 'Use let or const instead of var',
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 14.3.1',
            bestPractice: 'Avoid var. Use const by default, let when reassignment needed.',
            useCases: [
                'Legacy code',
                'Maintaining old codebases'
            ],
            example: 'var count = 0;',
            hoisting: 'console.log(x); var x = 1; // undefined (hoisted)',
            functionScope: 'if (true) { var x = 1; } console.log(x); // 1',
            redeclaration: 'var x = 1; var x = 2; // OK (but bad)',
            forLoopLeak: 'for (var i = 0; i < 3; i++) {} console.log(i); // 3',
            globalProperty: 'var x = 1; // window.x === 1 (browser)',
            modernAlternative: 'const x = 1; let y = 2; // Use these instead'
        },

        'const': {
            category: 'declaration',
            esVersion: 'ES6',
            source: 'ECMA-262',
            description: 'Constant declaration - block-scoped, immutable binding',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'BRACE_OPEN', 'BRACKET_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'PAREN_OPEN', 'for', 'export'],
            parentContext: ['Program', 'BlockStatement', 'ForStatement', 'FunctionBody'],
            requiresInitializer: true,
            canDestructure: true,
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isVariable: true,
            blockScoped: true,
            hasTDZ: true,
            noRedeclare: true,
            noReassign: true,
            requiresInitializer: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'const immutability',
                    binding: 'const x = 1; x = 2; // Error: reassignment',
                    objectMutation: 'const obj = {}; obj.x = 1; // OK! (object mutable)',
                    note: 'Binding is immutable, not the value'
                },
                {
                    language: 'JavaScript',
                    rule: 'Temporal Dead Zone (TDZ)',
                    example: 'console.log(x); const x = 1; // ReferenceError (TDZ)',
                    note: 'Cannot access before declaration'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'const' declaration must be followed by a variable name and an initializer.",
            commonTypos: ['cosnt', 'ocnst', 'cnst', 'conts', 'cosnst'],
            notes: 'Must initialize. Cannot reassign. Block-scoped. TDZ applies. Objects/arrays mutable.',
            quirks: [
                'Must initialize at declaration',
                'Cannot reassign binding',
                'Objects/arrays still mutable',
                'Block-scoped',
                'Temporal Dead Zone (TDZ)',
                'No hoisting to top'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES6',
            spec: 'ECMA-262 Section 14.3.1',
            bestPractice: 'Default to const. Use let only when reassignment needed.',
            useCases: [
                'Immutable bindings',
                'Constants',
                'Function references',
                'Object references'
            ],
            example: 'const MAX_SIZE = 100;',
            mustInitialize: 'const x; // SyntaxError: missing initializer',
            noReassign: 'const x = 1; x = 2; // TypeError: reassignment',
            objectMutation: 'const obj = {}; obj.x = 1; // OK (obj reference unchanged)',
            tdz: 'console.log(x); const x = 1; // ReferenceError',
            blockScope: 'if (true) { const x = 1; } console.log(x); // ReferenceError',
            forLoop: 'for (const item of array) { } // OK (fresh binding)',
            destructuring: 'const { x, y } = obj; const [a, b] = arr;'
        },

        'let': {
            category: 'declaration',
            esVersion: 'ES6',
            source: 'ECMA-262',
            contextual: true,
            description: 'Let declaration - block-scoped, reassignable variable',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'BRACKET_OPEN', 'BRACE_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'PAREN_OPEN', 'for', 'export'],
            parentContext: ['Program', 'BlockStatement', 'ForStatement', 'FunctionBody'],
            canDestructure: true,
            contextual: true,
            startsExpr: false,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isVariable: true,
            blockScoped: true,
            hasTDZ: true,
            noRedeclare: true,
            canReassign: true,
            initializerOptional: true,
            contextual: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'let as keyword vs identifier',
                    keyword: 'let x = 1; // Declaration',
                    identifier: 'let; // Valid identifier in some contexts',
                    note: 'Contextual keyword - can be identifier in ES5 code'
                },
                {
                    language: 'JavaScript',
                    rule: 'let vs const',
                    let: 'Allows reassignment',
                    const: 'No reassignment',
                    guideline: 'Use const by default, let when reassignment needed'
                },
                {
                    language: 'JavaScript',
                    rule: 'Temporal Dead Zone (TDZ)',
                    example: 'console.log(x); let x = 1; // ReferenceError (TDZ)',
                    note: 'Cannot access before declaration'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A 'let' declaration must be followed by a variable name.",
            commonTypos: ['lte', 'elt', 'lett', 'lete'],
            notes: 'Block-scoped. TDZ applies. Cannot redeclare. Can reassign. Contextual keyword.',
            quirks: [
                'Block-scoped (respects blocks)',
                'Temporal Dead Zone (TDZ)',
                'Cannot redeclare in same scope',
                'Can reassign value',
                'Fresh binding in for loops',
                'Contextual keyword (can be identifier)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES6',
            spec: 'ECMA-262 Section 14.3.1',
            contextual: true,
            bestPractice: 'Use when reassignment needed. Prefer const otherwise.',
            useCases: [
                'Loop counters',
                'Accumulator variables',
                'State that changes',
                'Conditional assignment'
            ],
            example: 'let count = 0; count++;',
            noInitializer: 'let x; // OK (undefined)',
            reassignment: 'let x = 1; x = 2; // OK',
            noRedeclare: 'let x = 1; let x = 2; // SyntaxError',
            tdz: 'console.log(x); let x = 1; // ReferenceError',
            blockScope: 'if (true) { let x = 1; } console.log(x); // ReferenceError',
            forLoop: 'for (let i = 0; i < 10; i++) { setTimeout(() => console.log(i)); } // Fresh i',
            destructuring: 'let { x, y } = obj; let [a, b] = arr;',
            contextualKeyword: 'let = 5; // Valid in non-strict mode ES5'
        },

        // Class & Object - ES6
        'class': {
            category: 'declaration',
            esVersion: 'ES6',
            source: 'ECMA-262',
            description: 'Class declaration/expression - syntactic sugar over prototypes',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'BRACE_OPEN', 'extends'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'export', 'PAREN_OPEN', 'ASSIGN'],
            parentContext: ['Program', 'BlockStatement', 'ExportDeclaration', 'Expression'],
            dualUsage: true,
            startsExpr: true,
            beforeExpr: false,

            // 2. Parser Directives
            isDeclaration: true,
            isExpression: true,
            dualUsage: true,
            strictMode: true,
            notHoisted: true,
            canExtend: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'class declaration vs expression',
                    declaration: 'class Name {} // Requires name',
                    expression: 'const C = class {}; // Name optional',
                    note: 'Like function, context determines type'
                },
                {
                    language: 'JavaScript',
                    rule: 'class vs function constructor',
                    class: 'class X { constructor() {} } // Modern',
                    function: 'function X() {} X.prototype.method = ... // Legacy',
                    note: 'Class is syntactic sugar'
                }
            ],

            // 4. Error Reporting
            errorMessage: "A class declaration must be followed by a name and a class body '{}'.",
            commonTypos: ['calss', 'clas', 'classs', 'clsas'],
            notes: 'Strict mode by default. Not hoisted. Syntactic sugar over prototypes.',
            quirks: [
                'Strict mode enforced',
                'Not hoisted (TDZ applies)',
                'Constructor optional',
                'Methods non-enumerable',
                'Must use new',
                'Private fields (#field)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES6',
            spec: 'ECMA-262 Section 15.7',
            enhancements: {
                ES2022: 'Private fields and methods (#)',
                ES2022: 'Static initialization blocks'
            },
            bestPractice: 'Use class for OOP. Private fields for encapsulation.',
            useCases: [
                'Object-oriented programming',
                'Inheritance hierarchies',
                'Encapsulation',
                'Polymorphism'
            ],
            example: 'class User { constructor(name) { this.name = name; } }',
            withMethods: 'class X { method() {} static staticMethod() {} }',
            privateFields: 'class X { #private = 1; getPrivate() { return this.#private; } }',
            staticBlock: 'class X { static { /* initialization */ } }',
            notHoisted: 'new X(); class X {} // ReferenceError'
        },

        'extends': {
            category: 'declaration',
            esVersion: 'ES6',
            source: 'ECMA-262',
            description: 'Extends clause - class inheritance',

            // 1. Syntactic Relationships
            followedBy: ['Expression', 'IDENTIFIER', 'null'],
            precededBy: ['IDENTIFIER', 'BRACE_CLOSE'],
            parentContext: ['ClassDeclaration', 'ClassExpression'],
            requiresClass: true,
            startsExpr: false,
            beforeExpr: true,

            // 2. Parser Directives
            isInheritance: true,
            requiresClass: true,
            canBeNull: true,
            mustBeConstructor: true,
            singleInheritance: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'extends can be expression',
                    examples: [
                        'class A extends B {}',
                        'class A extends getBase() {}',
                        'class A extends (condition ? B : C) {}',
                        'class A extends null {} // Valid!'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "The 'extends' clause must be followed by a class or constructor function.",
            commonTypos: ['extend', 'extedns', 'extneds'],
            notes: 'Single inheritance only. Can extend expressions. extends null is valid.',
            quirks: [
                'Single inheritance (unlike interfaces)',
                'Can extend expressions',
                'extends null removes Object.prototype',
                'Must call super() in constructor',
                'Static methods inherited',
                'Can extend built-ins (Array, Error)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES6',
            spec: 'ECMA-262 Section 15.7',
            bestPractice: 'Call super() first in derived constructor. Avoid deep hierarchies.',
            useCases: [
                'Class inheritance',
                'Extending built-ins',
                'Mixins (via expressions)',
                'Polymorphism'
            ],
            example: 'class Dog extends Animal { constructor() { super(); } }',
            extendsExpression: 'class X extends getBase() {}',
            extendsNull: 'class X extends null {} // No Object.prototype',
            extendsBuiltin: 'class MyArray extends Array {}'
        },

        'super': {
            category: 'primary',
            esVersion: 'ES6',
            source: 'ECMA-262',
            description: 'Super keyword - access parent class',

            // 1. Syntactic Relationships
            followedBy: ['PAREN_OPEN', 'DOT', 'BRACKET_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN', 'return'],
            parentContext: ['Constructor', 'MethodDefinition', 'StaticBlock'],
            dualUsage: true,
            startsExpr: true,
            beforeExpr: false,

            // 2. Parser Directives
            isSuper: true,
            dualUsage: true,
            requiresClass: true,
            onlyInDerived: true,
            mustBeFirst: true, // in constructor

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'super() vs super.method vs super[prop]',
                    superCall: 'super() // Constructor call (must be first)',
                    superProperty: 'super.method() // Parent method',
                    superComputed: 'super[name] // Parent property',
                    note: 'Different usages in different contexts'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'super' can only be used in class constructors or methods.",
            commonTypos: ['supr', 'super', 'suepr', 'spuer'],
            notes: 'super() must be first in constructor. super.method() accesses parent. Only in classes.',
            quirks: [
                'super() only in derived constructors',
                'super() must be called before this',
                'super.method() in any method',
                'super in static methods = parent static',
                'super in arrow functions fails',
                'Cannot call super() conditionally'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES6',
            spec: 'ECMA-262 Section 13.3',
            bestPractice: 'Call super() first in constructor. Use super.method() for parent access.',
            useCases: [
                'Parent constructor call',
                'Parent method access',
                'Method overriding',
                'Constructor chaining'
            ],
            example: 'constructor() { super(); this.x = 1; }',
            superMethod: 'method() { super.method(); /* override */ }',
            superStatic: 'static method() { super.method(); }',
            mustBeFirst: 'constructor() { super(); /* Must be before this */ }'
        },

        'new': {
            category: 'operator',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'New operator - creates instance',

            // 1. Syntactic Relationships
            followedBy: ['Expression', 'IDENTIFIER', 'new', 'PAREN_OPEN'],
            precededBy: ['ASSIGN', 'PAREN_OPEN', 'BRACKET_OPEN', 'return', 'new'],
            parentContext: ['Expression', 'Statement'],
            startsExpr: false,
            beforeExpr: true,
            isOperator: true,
            isPrefix: true,

            // 2. Parser Directives
            isOperator: true,
            isPrefix: true,
            requiresConstructor: true,
            canChain: true,
            optionalArguments: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'new with/without parentheses',
                    withArgs: 'new Date(2024, 0, 1)',
                    noArgs: 'new Date // Same as new Date()',
                    note: 'Parentheses optional if no arguments'
                },
                {
                    language: 'JavaScript',
                    rule: 'new.target meta-property',
                    regular: 'new Foo()',
                    metaProperty: 'new.target // Detects new call',
                    note: 'Different from regular new'
                }
            ],

            // 4. Error Reporting
            errorMessage: "The 'new' operator must be followed by a constructor expression.",
            commonTypos: ['nwe', 'ne', 'neew', 'neww'],
            notes: 'Creates instance. Parentheses optional. Can chain: new new Foo(). Sets prototype.',
            quirks: [
                'Parentheses optional (no args)',
                'Can chain: new new Foo()',
                'new.target is meta-property',
                'Returns object (unless constructor returns)',
                'Sets prototype chain',
                'Arrow functions cannot be constructors'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 13.3.5',
            enhancements: {
                ES6: 'new.target meta-property'
            },
            bestPractice: 'Use class instead of constructor functions. Check new.target.',
            useCases: [
                'Object instantiation',
                'Constructor invocation',
                'Built-in objects',
                'Factory patterns'
            ],
            example: 'const obj = new MyClass();',
            noParens: 'new Date // Same as new Date()',
            chained: 'new new Foo() // Valid but unusual',
            newTarget: 'function F() { console.log(new.target); }'
        },

        'this': {
            category: 'primary',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'This keyword - current execution context',

            // 1. Syntactic Relationships
            followedBy: ['DOT', 'BRACKET_OPEN', 'SEMICOLON', 'COMMA', 'PAREN_CLOSE'],
            precededBy: ['return', 'PAREN_OPEN', 'ASSIGN', 'COMMA', 'DOT'],
            parentContext: ['FunctionBody', 'ClassDeclaration', 'ObjectLiteral', 'GlobalScope'],
            startsExpr: true,
            beforeExpr: false,
            contextDependent: true,

            // 2. Parser Directives
            isPrimary: true,
            contextDependent: true,
            bindingRules: 'complex',
            arrowFunctionsInherit: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'JavaScript',
                    rule: 'this binding rules',
                    global: 'this // window (browser) or global (Node)',
                    method: 'obj.method() // this = obj',
                    constructor: 'new Foo() // this = new instance',
                    arrow: '() => this // this = outer this',
                    explicit: 'fn.call(obj) // this = obj',
                    strict: 'function() { "use strict"; this; } // undefined'
                },
                {
                    language: 'JavaScript',
                    rule: 'Arrow functions inherit this',
                    regular: 'function() { this } // Dynamic binding',
                    arrow: '() => { this } // Lexical binding (outer this)',
                    note: 'Arrow functions do not have own this'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'this' refers to the current execution context.",
            commonTypos: ['tihs', 'thi', 'thsi', 'htis'],
            notes: 'Context-dependent. Arrow functions inherit outer this. strict mode affects global this.',
            quirks: [
                'Global: window/global/undefined',
                'Method: receiver object',
                'Constructor: new instance',
                'Arrow: lexical (outer this)',
                'Explicit: call/apply/bind',
                'Strict mode: undefined (not global)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            esVersion: 'ES1',
            spec: 'ECMA-262 Section 9.2',
            bestPractice: 'Use arrow functions to preserve this. Be aware of binding rules.',
            bindingRules: [
                '1. new binding: new Foo()',
                '2. Explicit: call/apply/bind',
                '3. Implicit: obj.method()',
                '4. Default: global/undefined',
                '5. Arrow: lexical'
            ],
            useCases: [
                'Object methods',
                'Class methods',
                'Event handlers',
                'Callbacks'
            ],
            example: 'obj.method() // this = obj',
            arrowFunction: 'const fn = () => { this }; // Outer this',
            explicitBinding: 'fn.call(obj) // this = obj',
            strictMode: '(function() { "use strict"; return this; })() // undefined'
        },

        // Module System - ES6
        'import': {
            category: 'module',
            esVersion: 'ES6',
            source: 'ECMA-262',
            description: 'Import declaration - ES modules',
            followedBy: ['IDENTIFIER', 'STRING', 'BRACE_OPEN', 'STAR'],
            precededBy: ['NEWLINE', 'SEMICOLON'],
            parentContext: ['Program', 'Module'],
            startsExpr: false,
            beforeExpr: false,
            isDeclaration: true,
            hoisted: true,
            staticOnly: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'import forms',
                forms: [
                    'import x from "mod"',
                    'import { x } from "mod"',
                    'import * as x from "mod"',
                    'import "mod"',
                    'import("mod") // Dynamic'
                ]
            }],
            errorMessage: "Import must specify module source.",
            commonTypos: ['imoprt', 'improt', 'imprt'],
            notes: 'Static imports hoisted. Dynamic import() returns Promise.',
            quirks: ['Hoisted', 'Read-only bindings', 'Live bindings', 'Dynamic import() is different'],
            stage: 'stable',
            esVersion: 'ES6',
            spec: 'ECMA-262 Section 16.2',
            bestPractice: 'Use named imports. Avoid wildcard.',
            example: 'import { x } from "./mod.js";'
        },

        'export': {
            category: 'module',
            esVersion: 'ES6',
            source: 'ECMA-262',
            description: 'Export declaration - ES modules',
            followedBy: ['IDENTIFIER', 'BRACE_OPEN', 'default', 'const', 'let', 'function', 'class', 'STAR'],
            precededBy: ['NEWLINE', 'SEMICOLON'],
            parentContext: ['Program', 'Module'],
            startsExpr: false,
            beforeExpr: false,
            isDeclaration: true,
            canBeDefault: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'export forms',
                forms: [
                    'export const x = 1',
                    'export { x }',
                    'export default x',
                    'export * from "mod"',
                    'export { x } from "mod"'
                ]
            }],
            errorMessage: "Export must specify what to export.",
            commonTypos: ['exprot', 'exoprt', 'exprt'],
            notes: 'export default allows expressions. Named exports require declarations.',
            quirks: ['default exports', 'Re-exports', 'Live bindings', 'Cannot export let conditionally'],
            stage: 'stable',
            esVersion: 'ES6',
            spec: 'ECMA-262 Section 16.2',
            bestPractice: 'Prefer named exports. Single default per module.',
            example: 'export const x = 1;'
        },

        'from': {
            category: 'module',
            esVersion: 'ES6',
            source: 'ECMA-262',
            contextual: true,
            description: 'From clause - module source',
            followedBy: ['STRING'],
            precededBy: ['IDENTIFIER', 'BRACE_CLOSE', 'STAR'],
            parentContext: ['ImportDeclaration', 'ExportDeclaration'],
            startsExpr: false,
            beforeExpr: true,
            contextual: true,
            requiresString: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'from is contextual',
                note: 'Only keyword in import/export. Can be identifier elsewhere.'
            }],
            errorMessage: "from requires string module specifier.",
            commonTypos: ['form', 'fron', 'frm'],
            notes: 'Contextual keyword. Requires string literal.',
            quirks: ['Contextual', 'Only in import/export', 'Can be identifier name'],
            stage: 'stable',
            esVersion: 'ES6',
            contextual: true,
            example: 'import x from "./mod.js";'
        },

        'as': {
            category: 'module',
            esVersion: 'ES6',
            source: 'ECMA-262',
            contextual: true,
            description: 'As clause - rename/namespace',
            followedBy: ['IDENTIFIER'],
            precededBy: ['IDENTIFIER', 'STAR', 'default'],
            parentContext: ['ImportDeclaration', 'ExportDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,
            dualUsage: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'as in modules vs TypeScript',
                module: 'import { x as y } from "mod"',
                namespace: 'import * as ns from "mod"',
                note: 'Contextual keyword'
            }],
            errorMessage: "as requires identifier.",
            commonTypos: ['s', 'sa'],
            notes: 'Contextual keyword. Rename or namespace.',
            quirks: ['Contextual', 'Rename imports/exports', 'Namespace imports'],
            stage: 'stable',
            esVersion: 'ES6',
            contextual: true,
            example: 'import { x as y } from "./mod.js";'
        },

        // Operators - ES1
        'in': {
            category: 'operator',
            esVersion: 'ES1',
            source: 'ECMA-262',
            precedence: 7,
            description: 'In operator - property existence check',
            followedBy: ['Expression'],
            precededBy: ['IDENTIFIER', 'STRING', 'PAREN_CLOSE'],
            parentContext: ['Expression', 'ForInStatement'],
            startsExpr: false,
            beforeExpr: true,
            isBinary: true,
            dualUsage: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'in operator vs for-in',
                operator: '"key" in obj // true/false',
                forIn: 'for (const key in obj) {}',
                note: 'Different contexts'
            }],
            errorMessage: "in checks if property exists in object.",
            commonTypos: ['ni', 'inn'],
            notes: 'Checks prototype chain. for-in iterates keys.',
            quirks: ['Checks prototype chain', 'for-in also uses in', 'Returns boolean'],
            stage: 'stable',
            esVersion: 'ES1',
            precedence: 7,
            example: '"length" in [] // true'
        },

        'instanceof': {
            category: 'operator',
            esVersion: 'ES1',
            source: 'ECMA-262',
            precedence: 7,
            description: 'Instanceof operator - prototype check',
            followedBy: ['Expression', 'IDENTIFIER'],
            precededBy: ['IDENTIFIER', 'PAREN_CLOSE', 'this'],
            parentContext: ['Expression'],
            startsExpr: false,
            beforeExpr: true,
            isBinary: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'instanceof vs typeof',
                instanceof: 'obj instanceof Class // Prototype check',
                typeof: 'typeof x // Type string',
                note: 'Different purposes'
            }],
            errorMessage: "instanceof checks prototype chain.",
            commonTypos: ['instanceof', 'instanceOf', 'instaneof'],
            notes: 'Checks prototype chain. Can be fooled with Object.create.',
            quirks: ['Prototype chain check', 'Can be customized (Symbol.hasInstance)', 'Fails across realms'],
            stage: 'stable',
            esVersion: 'ES1',
            precedence: 7,
            example: 'arr instanceof Array // true'
        },

        'typeof': {
            category: 'operator',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Typeof operator - type string',
            followedBy: ['Expression', 'IDENTIFIER'],
            precededBy: ['PAREN_OPEN', 'ASSIGN', 'return'],
            parentContext: ['Expression'],
            startsExpr: false,
            beforeExpr: true,
            isPrefix: true,
            isUnary: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'typeof returns',
                types: [
                    '"undefined"', '"boolean"', '"number"', '"bigint"',
                    '"string"', '"symbol"', '"function"', '"object"'
                ]
            }],
            errorMessage: "typeof returns type string.",
            commonTypos: ['typeOf', 'typof', 'typeof'],
            notes: 'Returns string. typeof null === "object" (bug). Safe for undeclared.',
            quirks: ['typeof null === "object"', 'Safe for undeclared vars', 'Returns 8 possible strings'],
            stage: 'stable',
            esVersion: 'ES1',
            example: 'typeof x === "number"'
        },

        'void': {
            category: 'operator',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Void operator - returns undefined',
            followedBy: ['Expression', 'IDENTIFIER', 'LITERAL'],
            precededBy: ['PAREN_OPEN', 'ASSIGN', 'return'],
            parentContext: ['Expression'],
            startsExpr: false,
            beforeExpr: true,
            isPrefix: true,
            isUnary: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'void always returns undefined',
                note: 'Evaluates expression but returns undefined'
            }],
            errorMessage: "void evaluates expression and returns undefined.",
            commonTypos: ['viod', 'vod', 'vooid'],
            notes: 'Always returns undefined. Common: void 0. Used in IIFEs.',
            quirks: ['Always returns undefined', 'void 0 === undefined', 'Used in void function expressions'],
            stage: 'stable',
            esVersion: 'ES1',
            example: 'void 0 // undefined'
        },

        'delete': {
            category: 'operator',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Delete operator - removes property',
            followedBy: ['Expression', 'IDENTIFIER', 'DOT', 'BRACKET_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['Expression', 'Statement'],
            startsExpr: false,
            beforeExpr: true,
            isPrefix: true,
            isUnary: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'delete only affects properties',
                works: 'delete obj.prop // true',
                doesNotWork: 'delete variable // false (strict: error)',
                note: 'Cannot delete variables'
            }],
            errorMessage: "delete removes object properties.",
            commonTypos: ['delte', 'dleete', 'delete'],
            notes: 'Removes properties. Cannot delete variables. Returns boolean.',
            quirks: ['Only properties', 'Returns boolean', 'Strict mode: error on vars', 'Cannot delete non-configurable'],
            stage: 'stable',
            esVersion: 'ES1',
            example: 'delete obj.prop'
        },

        // Async/Await - ES8 (ES2017)
        'async': {
            category: 'modifier',
            esVersion: 'ES8',
            source: 'ECMA-262',
            contextual: true,
            description: 'Async modifier - returns Promise',
            followedBy: ['function', 'PAREN_OPEN', 'IDENTIFIER'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'ASSIGN', 'export'],
            parentContext: ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunction'],
            startsExpr: false,
            beforeExpr: false,
            contextual: true,
            isModifier: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'async function forms',
                forms: [
                    'async function fn() {}',
                    'async () => {}',
                    'async function* gen() {}'
                ]
            }],
            errorMessage: "async function returns Promise.",
            commonTypos: ['asynch', 'asyn', 'aync'],
            notes: 'Makes function return Promise. Allows await inside.',
            quirks: ['Returns Promise', 'Allows await', 'Async generators', 'Contextual keyword'],
            stage: 'stable',
            esVersion: 'ES8',
            contextual: true,
            example: 'async function fn() { await x; }'
        },

        'await': {
            category: 'operator',
            esVersion: 'ES8',
            source: 'ECMA-262',
            description: 'Await operator - wait for Promise',
            followedBy: ['Expression', 'IDENTIFIER', 'PAREN_OPEN'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'ASSIGN', 'return'],
            parentContext: ['AsyncFunction', 'AsyncGenerator'],
            startsExpr: false,
            beforeExpr: true,
            isPrefix: true,
            requiresAsync: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'await only in async',
                valid: 'async function() { await promise; }',
                invalid: 'function() { await promise; } // Error',
                note: 'Requires async context'
            }],
            errorMessage: "await pauses for Promise resolution.",
            commonTypos: ['awiat', 'awit', 'awaitt'],
            notes: 'Only in async functions. Pauses execution. Top-level await (ES2022).',
            quirks: ['Only in async', 'Pauses execution', 'Top-level await (modules)', 'await non-Promise is ok'],
            stage: 'stable',
            esVersion: 'ES8',
            enhancements: { ES2022: 'Top-level await' },
            example: 'await fetch(url)'
        },

        // Generator - ES6
        'yield': {
            category: 'operator',
            esVersion: 'ES6',
            source: 'ECMA-262',
            description: 'Yield operator - generator value',
            followedBy: ['Expression', 'IDENTIFIER', 'STAR', 'SEMICOLON'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['GeneratorFunction'],
            startsExpr: false,
            beforeExpr: true,
            requiresGenerator: true,
            canDelegateYield: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'yield vs yield*',
                yield: 'yield value // Single value',
                yieldStar: 'yield* iterable // Delegate',
                note: 'yield* delegates to iterable'
            }],
            errorMessage: "yield produces generator value.",
            commonTypos: ['yeild', 'yiled', 'yeld'],
            notes: 'Only in generators. Pauses function. yield* delegates.',
            quirks: ['Only in generators', 'Pauses function', 'yield* delegates', 'Can receive value via next()'],
            stage: 'stable',
            esVersion: 'ES6',
            example: 'yield value'
        },

        // Debugger - ES1
        'debugger': {
            category: 'statement',
            esVersion: 'ES1',
            source: 'ECMA-262',
            description: 'Debugger statement - breakpoint',
            followedBy: ['SEMICOLON', 'NEWLINE'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['Statement', 'BlockStatement'],
            startsExpr: false,
            beforeExpr: false,
            isStatement: true,
            disambiguation: [{
                language: 'JavaScript',
                rule: 'debugger behavior',
                devTools: 'Pauses if dev tools open',
                production: 'No-op in production',
                note: 'Development tool only'
            }],
            errorMessage: "debugger creates breakpoint.",
            commonTypos: ['debuger', 'debbuger', 'debuggar'],
            notes: 'Pauses execution if debugger attached. No-op otherwise.',
            quirks: ['Only if debugger attached', 'No-op in production', 'Remove before deploy'],
            stage: 'stable',
            esVersion: 'ES1',
            example: 'debugger; // Pause here'
        },

        // With Statement - ES1 (deprecated in strict mode)
        'with': { category: 'statement', esVersion: 'ES1', source: 'ECMA-262', deprecated: true },

        // Future Reserved - ES1
        'enum': { category: 'reserved', esVersion: 'ES1', source: 'ECMA-262', futureReserved: true },

        // Strict Mode Reserved - ES5
        'implements': { category: 'reserved', esVersion: 'ES5', source: 'ECMA-262', strictOnly: true },
        'interface': { category: 'reserved', esVersion: 'ES5', source: 'ECMA-262', strictOnly: true },
        'package': { category: 'reserved', esVersion: 'ES5', source: 'ECMA-262', strictOnly: true },
        'private': { category: 'reserved', esVersion: 'ES5', source: 'ECMA-262', strictOnly: true },
        'protected': { category: 'reserved', esVersion: 'ES5', source: 'ECMA-262', strictOnly: true },
        'public': { category: 'reserved', esVersion: 'ES5', source: 'ECMA-262', strictOnly: true },
        'static': { category: 'reserved', esVersion: 'ES5', source: 'ECMA-262', strictOnly: true },

        // Contextual Keywords - ES6+
        'of': { category: 'iterator', esVersion: 'ES6', source: 'Babel', contextual: true },
        'get': { category: 'accessor', esVersion: 'ES5', source: 'Babel', contextual: true },
        'set': { category: 'accessor', esVersion: 'ES5', source: 'Babel', contextual: true },
        'meta': { category: 'meta', esVersion: 'ES6', source: 'Babel', contextual: true },
        'target': { category: 'meta', esVersion: 'ES6', source: 'Babel', contextual: true },
        'using': { category: 'declaration', esVersion: 'ES2024', source: 'Babel', contextual: true },
        'defer': { category: 'declaration', esVersion: 'ES2024', source: 'Babel', contextual: true },
    },

    // ============================================================================
    // LITERALS - ECMAScript 2026 Section 12.8
    // ============================================================================
    literals: {
        // Boolean Literals
        'true': { type: 'boolean', value: true, source: 'ECMA-262' },
        'false': { type: 'boolean', value: false, source: 'ECMA-262' },

        // Null Literal
        'null': { type: 'null', value: null, source: 'ECMA-262' },

        // Undefined (not a keyword, but global property)
        'undefined': { type: 'undefined', value: undefined, source: 'ECMA-262' },
    },

    // ============================================================================
    // OPERATORS - Babel tokenizer/types.ts + ECMAScript 2026
    // ============================================================================
    operators: {
        // Binary Operators (from Babel precedence)
        binaryOperators: {
            // Pipeline Operator (Stage 2 Proposal) - Precedence 0
            '|>': {
                precedence: 0,
                category: 'pipeline',
                source: 'Babel',
                stage: 2,
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                notes: 'Experimental feature. Syntax may change. Requires @babel/plugin-proposal-pipeline-operator.',
                errorMessage: "Pipeline operator '|>' is experimental. Enable with Babel plugin."
            },

            // Nullish Coalescing - ES11 (ES2020) - Precedence 1
            '??': {
                precedence: 1,
                category: 'logical',
                source: 'ECMA-262',
                esVersion: 'ES11',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                notes: 'Returns right operand when left is null or undefined (not when falsy).',
                disambiguation: [
                    // JSX: Nullish coalescing in expression
                    {
                        ifPrecededBy: ['IDENTIFIER', 'PAREN_CLOSE'],
                        ifFollowedBy: ['IDENTIFIER', 'LITERAL'],
                        then: 'OPERATOR_NULLISH_COALESCING',
                        notes: 'value ?? defaultValue'
                    },
                    // Punctuation in some contexts
                    {
                        ifPrecededBy: ['JSX_ATTRIBUTE'],
                        then: 'PUNCTUATION',
                        language: 'JSX'
                    }
                ],
                errorMessage: "Nullish coalescing operator '??' cannot be mixed with '&&' or '||' without parentheses."
            },

            // Logical OR - Precedence 1
            '||': {
                precedence: 1,
                category: 'logical',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                notes: 'Returns first truthy operand or last operand.',
                errorMessage: "Logical OR '||' cannot be mixed with '??' without parentheses."
            },

            // Logical AND - Precedence 2
            '&&': {
                precedence: 2,
                category: 'logical',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                notes: 'Returns first falsy operand or last operand.',
                errorMessage: "Logical AND '&&' cannot be mixed with '??' without parentheses."
            },

            // Bitwise OR - Precedence 3
            '|': {
                precedence: 3,
                category: 'bitwise',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                disambiguation: [
                    // TypeScript: Union type
                    {
                        ifPrecededBy: ['COLON', 'IDENTIFIER', 'KEYWORD_TYPE'],
                        ifFollowedBy: ['IDENTIFIER', 'KEYWORD_STRING', 'KEYWORD_NUMBER'],
                        then: 'TYPE_UNION',
                        language: 'TypeScript',
                        notes: 'string | number | boolean'
                    },
                    // Default: Bitwise OR
                    {
                        default: 'OPERATOR_BITWISE_OR',
                        notes: 'a | b'
                    }
                ]
            },

            // Bitwise XOR - Precedence 4
            '^': {
                precedence: 4,
                category: 'bitwise',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false
            },

            // Bitwise AND - Precedence 5
            '&': {
                precedence: 5,
                category: 'bitwise',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                disambiguation: [
                    // TypeScript: Intersection type
                    {
                        ifPrecededBy: ['COLON', 'IDENTIFIER', 'KEYWORD_TYPE'],
                        ifFollowedBy: ['IDENTIFIER', 'BRACE_OPEN'],
                        then: 'TYPE_INTERSECTION',
                        language: 'TypeScript',
                        notes: 'interface A & interface B'
                    },
                    // Default: Bitwise AND
                    {
                        default: 'OPERATOR_BITWISE_AND',
                        notes: 'a & b'
                    }
                ]
            },

            // Equality Operators - Precedence 6
            '==': { precedence: 6, category: 'equality', source: 'ECMA-262' },
            '!=': { precedence: 6, category: 'equality', source: 'ECMA-262' },
            '===': { precedence: 6, category: 'equality', source: 'ECMA-262' },
            '!==': { precedence: 6, category: 'equality', source: 'ECMA-262' },

            // Relational Operators - Precedence 7
            '<': {
                precedence: 7,
                category: 'relational',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                disambiguation: [
                    // TypeScript: Generic type parameter
                    {
                        ifPrecededBy: ['IDENTIFIER', 'KEYWORD_CONST', 'KEYWORD_LET', 'KEYWORD_FUNCTION'],
                        ifFollowedBy: ['IDENTIFIER'],
                        ifNotPrecededBy: ['OPERATOR_ASSIGN', 'OPERATOR_RETURN'],
                        then: 'GENERIC_START',
                        language: 'TypeScript',
                        notes: 'Array<string>, function foo<T>() {}'
                    },
                    // JSX: Opening tag
                    {
                        ifPrecededBy: ['KEYWORD_RETURN', 'PAREN_OPEN', 'BRACE_OPEN', 'OPERATOR_ASSIGN'],
                        ifFollowedBy: ['IDENTIFIER', 'JSX_IDENTIFIER'],
                        then: 'JSX_TAG_START',
                        language: 'JSX',
                        notes: 'return <Component />, const x = <div />'
                    },
                    // Default: Comparison operator
                    {
                        default: 'OPERATOR_LESS_THAN',
                        notes: 'x < 5, a < b'
                    }
                ]
            },
            '>': {
                precedence: 7,
                category: 'relational',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                disambiguation: [
                    // TypeScript: End of generic type parameter
                    {
                        ifPrecededBy: ['IDENTIFIER', 'BRACKET_CLOSE'],
                        ifFollowedBy: ['PAREN_OPEN', 'DOT', 'IDENTIFIER'],
                        then: 'GENERIC_END',
                        language: 'TypeScript',
                        notes: 'Array<string>.map(), new Map<K, V>()'
                    },
                    // JSX: Self-closing tag or closing tag
                    {
                        ifPrecededBy: ['SLASH', 'IDENTIFIER'],
                        then: 'JSX_TAG_END',
                        language: 'JSX',
                        notes: '<Component />, </div>'
                    },
                    // Default: Comparison operator
                    {
                        default: 'OPERATOR_GREATER_THAN',
                        notes: 'x > 5, a > b'
                    }
                ]
            },
            '<=': {
                precedence: 7,
                category: 'relational',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false
            },
            '>=': {
                precedence: 7,
                category: 'relational',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false
            },

            // Bit Shift Operators - Precedence 8
            '<<': { precedence: 8, category: 'bitshift', source: 'ECMA-262' },
            '>>': { precedence: 8, category: 'bitshift', source: 'ECMA-262' },
            '>>>': { precedence: 8, category: 'bitshift', source: 'ECMA-262' },

            // Additive Operators - Precedence 9
            '+': {
                precedence: 9,
                category: 'additive',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: true,
                notes: 'Can be unary (type coercion) or binary (addition/concatenation).',
                disambiguation: [
                    // Unary plus
                    {
                        ifPrecededBy: ['OPERATOR', 'PAREN_OPEN', 'COMMA', 'KEYWORD_RETURN'],
                        then: 'OPERATOR_UNARY_PLUS',
                        notes: '+value, +"123"'
                    },
                    // Binary plus
                    {
                        default: 'OPERATOR_BINARY_PLUS',
                        notes: 'a + b'
                    }
                ]
            },
            '-': {
                precedence: 9,
                category: 'additive',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: true,
                notes: 'Can be unary (negation) or binary (subtraction).',
                disambiguation: [
                    // Unary minus
                    {
                        ifPrecededBy: ['OPERATOR', 'PAREN_OPEN', 'COMMA', 'KEYWORD_RETURN'],
                        then: 'OPERATOR_UNARY_MINUS',
                        notes: '-value, -10'
                    },
                    // Binary minus
                    {
                        default: 'OPERATOR_BINARY_MINUS',
                        notes: 'a - b'
                    }
                ]
            },

            // Multiplicative Operators - Precedence 10
            '*': {
                precedence: 10,
                category: 'multiplicative',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                disambiguation: [
                    // Generator function
                    {
                        ifPrecededBy: ['KEYWORD_FUNCTION', 'KEYWORD_YIELD'],
                        then: 'GENERATOR_STAR',
                        notes: 'function* gen() {}, yield* otherGen()'
                    },
                    // Import namespace
                    {
                        ifPrecededBy: ['KEYWORD_IMPORT'],
                        ifFollowedBy: ['KEYWORD_AS'],
                        then: 'IMPORT_NAMESPACE',
                        notes: 'import * as name from "module"'
                    },
                    // Default: Multiplication
                    {
                        default: 'OPERATOR_MULTIPLY',
                        notes: 'a * b'
                    }
                ]
            },
            '/': {
                precedence: 10,
                category: 'multiplicative',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false,
                disambiguation: [
                    // Regular expression literal
                    {
                        ifPrecededBy: ['OPERATOR_ASSIGN', 'PAREN_OPEN', 'COMMA', 'KEYWORD_RETURN'],
                        ifFollowedBy: ['REGEX_PATTERN'],
                        then: 'REGEX_START',
                        notes: 'const regex = /pattern/flags'
                    },
                    // JSX closing tag
                    {
                        ifPrecededBy: ['JSX_TAG_START'],
                        ifFollowedBy: ['IDENTIFIER'],
                        then: 'JSX_CLOSING_TAG',
                        language: 'JSX',
                        notes: '</Component>'
                    },
                    // Self-closing JSX tag
                    {
                        ifPrecededBy: ['JSX_IDENTIFIER'],
                        ifFollowedBy: ['JSX_TAG_END'],
                        then: 'JSX_SELF_CLOSING',
                        language: 'JSX',
                        notes: '<Component />'
                    },
                    // Default: Division
                    {
                        default: 'OPERATOR_DIVIDE',
                        notes: 'a / b'
                    }
                ]
            },
            '%': {
                precedence: 10,
                category: 'multiplicative',
                source: 'ECMA-262',
                associativity: 'left',
                isInfix: true,
                isPrefix: false
            },

            // Exponentiation Operator - ES7 (ES2016) - Precedence 11
            '**': {
                precedence: 11,
                category: 'exponential',
                source: 'ECMA-262',
                esVersion: 'ES7',
                associativity: 'right',
                isInfix: true,
                isPrefix: false,
                notes: 'Right-associative: 2 ** 3 ** 2 equals 2 ** (3 ** 2) = 512'
            },
        },

        // Unary Operators - ECMAScript 2026
        unaryOperators: {
            '++': {
                type: 'update',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: true,
                notes: 'Prefix: ++x (returns incremented), Postfix: x++ (returns original)',
                errorMessage: "Increment operator '++' requires a valid left-hand side expression."
            },
            '--': {
                type: 'update',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: true,
                notes: 'Prefix: --x (returns decremented), Postfix: x-- (returns original)',
                errorMessage: "Decrement operator '--' requires a valid left-hand side expression."
            },
            '+': {
                type: 'unary',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: false,
                notes: 'Converts operand to number. +true === 1, +"42" === 42'
            },
            '-': {
                type: 'unary',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: false,
                notes: 'Negates operand. -10 === -10, -true === -1'
            },
            '!': {
                type: 'unary',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: false,
                notes: 'Logical NOT. !true === false, !0 === true',
                commonTypos: ['not', '¬'],
                errorMessage: "Logical NOT operator '!' must precede an expression."
            },
            '~': {
                type: 'unary',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: false,
                notes: 'Bitwise NOT. ~5 === -6 (inverts bits)'
            },
            'typeof': {
                type: 'unary',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: false,
                notes: 'Returns type as string. typeof undefined === "undefined"',
                commonTypos: ['typeOf', 'type of', 'typof'],
                errorMessage: "The 'typeof' operator must be followed by an expression."
            },
            'void': {
                type: 'unary',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: false,
                notes: 'Evaluates expression and returns undefined. void 0 === undefined',
                errorMessage: "The 'void' operator must be followed by an expression."
            },
            'delete': {
                type: 'unary',
                source: 'ECMA-262',
                isPrefix: true,
                isPostfix: false,
                notes: 'Removes property from object. Returns true if successful.',
                errorMessage: "The 'delete' operator can only be used on object properties.",
                quirks: 'Cannot delete variables or functions. Strict mode throws errors.'
            },
            'await': {
                type: 'unary',
                source: 'ECMA-262',
                esVersion: 'ES8',
                isPrefix: true,
                isPostfix: false,
                parentContext: ['AsyncFunction', 'AsyncGeneratorFunction', 'Module'],
                notes: 'Pauses async function execution until promise resolves.',
                errorMessage: "'await' can only be used in async functions or at the top level of modules."
            },
        },

        // Assignment Operators - ECMAScript 2026 Section 13.15
        assignmentOperators: {
            '=': {
                type: 'simple',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                notes: 'Simple assignment. Right-associative: a = b = c means a = (b = c)',
                errorMessage: "Assignment operator '=' requires a valid left-hand side expression."
            },
            '+=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a + b',
                notes: 'Addition assignment. Performs addition or string concatenation.'
            },
            '-=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a - b',
                notes: 'Subtraction assignment.'
            },
            '*=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a * b',
                notes: 'Multiplication assignment.'
            },
            '/=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a / b',
                notes: 'Division assignment.'
            },
            '%=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a % b',
                notes: 'Remainder assignment.'
            },
            '<<=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a << b',
                notes: 'Left shift assignment.'
            },
            '>>=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a >> b',
                notes: 'Sign-propagating right shift assignment.'
            },
            '>>>=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a >>> b',
                notes: 'Unsigned right shift assignment.'
            },
            '|=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a | b',
                notes: 'Bitwise OR assignment.'
            },
            '^=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a ^ b',
                notes: 'Bitwise XOR assignment.'
            },
            '&=': {
                type: 'compound',
                source: 'ECMA-262',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a & b',
                notes: 'Bitwise AND assignment.'
            },
            '**=': {
                type: 'compound',
                source: 'ECMA-262',
                esVersion: 'ES7',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a = a ** b',
                notes: 'Exponentiation assignment.'
            },
            '&&=': {
                type: 'logical',
                source: 'ECMA-262',
                esVersion: 'ES12',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a && (a = b)',
                notes: 'Logical AND assignment. Only assigns if left is truthy.'
            },
            '||=': {
                type: 'logical',
                source: 'ECMA-262',
                esVersion: 'ES12',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a || (a = b)',
                notes: 'Logical OR assignment. Only assigns if left is falsy.'
            },
            '??=': {
                type: 'logical',
                source: 'ECMA-262',
                esVersion: 'ES12',
                associativity: 'right',
                isAssign: true,
                equivalentTo: 'a ?? (a = b)',
                notes: 'Nullish coalescing assignment. Only assigns if left is null or undefined.'
            },
        },
    },

    // ============================================================================
    // PUNCTUATION - ANTLR JavaScript Grammar
    // ============================================================================
    punctuation: {
        // Brackets
        '[': {
            type: 'bracket',
            pair: ']',
            source: 'ANTLR',
            startsExpr: true,
            beforeExpr: true,
            disambiguation: [
                {
                    ifPrecededBy: ['IDENTIFIER', 'BRACKET_CLOSE', 'PAREN_CLOSE'],
                    then: 'MEMBER_ACCESS',
                    notes: 'array[index], obj[prop]'
                },
                {
                    default: 'ARRAY_LITERAL',
                    notes: '[1, 2, 3]'
                }
            ],
            errorMessage: "Unclosed bracket '['. Expected ']'."
        },
        ']': {
            type: 'bracket',
            pair: '[',
            source: 'ANTLR',
            startsExpr: false,
            beforeExpr: false,
            errorMessage: "Unexpected bracket ']'. No matching '['."
        },
        '(': {
            type: 'paren',
            pair: ')',
            source: 'ANTLR',
            startsExpr: true,
            beforeExpr: true,
            disambiguation: [
                {
                    ifPrecededBy: ['IDENTIFIER', 'KEYWORD_FUNCTION', 'KEYWORD_IF', 'KEYWORD_WHILE'],
                    then: 'FUNCTION_CALL_OR_CONDITION',
                    notes: 'foo(), if (cond), while (cond)'
                },
                {
                    default: 'GROUPING',
                    notes: '(expr)'
                }
            ],
            errorMessage: "Unclosed parenthesis '('. Expected ')'."
        },
        ')': {
            type: 'paren',
            pair: '(',
            source: 'ANTLR',
            startsExpr: false,
            beforeExpr: false,
            errorMessage: "Unexpected parenthesis ')'. No matching '('."
        },
        '{': {
            type: 'brace',
            pair: '}',
            source: 'ANTLR',
            startsExpr: true,
            beforeExpr: true,
            disambiguation: [
                {
                    ifPrecededBy: ['OPERATOR_ASSIGN', 'COLON', 'PAREN_OPEN'],
                    then: 'OBJECT_LITERAL',
                    notes: 'const obj = {}, arr.map(x => {})'
                },
                {
                    ifPrecededBy: ['PAREN_CLOSE', 'KEYWORD_ELSE', 'KEYWORD_TRY', 'KEYWORD_CATCH'],
                    then: 'BLOCK_STATEMENT',
                    notes: 'if (x) {}, else {}, try {}'
                },
                {
                    default: 'BLOCK_STATEMENT',
                    notes: '{ statements }'
                }
            ],
            errorMessage: "Unclosed brace '{'. Expected '}'."
        },
        '}': {
            type: 'brace',
            pair: '{',
            source: 'ANTLR',
            startsExpr: false,
            beforeExpr: false,
            errorMessage: "Unexpected brace '}'. No matching '{'."
        },

        // Delimiters
        ';': {
            type: 'delimiter',
            name: 'semicolon',
            source: 'ANTLR',
            startsExpr: false,
            beforeExpr: false,
            notes: 'Statement terminator. Optional in many cases due to ASI (Automatic Semicolon Insertion).',
            quirks: 'ASI can lead to unexpected behavior. Recommended to always use semicolons.'
        },
        ',': {
            type: 'delimiter',
            name: 'comma',
            source: 'ANTLR',
            startsExpr: false,
            beforeExpr: true,
            notes: 'Separates items in arrays, objects, function parameters, etc.'
        },
        ':': {
            type: 'delimiter',
            name: 'colon',
            source: 'ANTLR',
            startsExpr: false,
            beforeExpr: true,
            disambiguation: [
                {
                    ifPrecededBy: ['IDENTIFIER', 'STRING_LITERAL', 'NUMBER_LITERAL'],
                    ifFollowedBy: ['Expression'],
                    parentContext: ['ObjectLiteral'],
                    then: 'OBJECT_PROPERTY',
                    notes: '{ key: value }'
                },
                {
                    ifPrecededBy: ['KEYWORD_CASE', 'KEYWORD_DEFAULT'],
                    then: 'SWITCH_CLAUSE',
                    notes: 'case x:, default:'
                },
                {
                    ifPrecededBy: ['IDENTIFIER'],
                    parentContext: ['LabeledStatement'],
                    then: 'LABEL',
                    notes: 'label: statement'
                },
                {
                    ifPrecededBy: ['IDENTIFIER'],
                    language: 'TypeScript',
                    then: 'TYPE_ANNOTATION',
                    notes: 'const x: string'
                },
                {
                    ifPrecededBy: ['PAREN_CLOSE'],
                    language: 'TypeScript',
                    then: 'RETURN_TYPE',
                    notes: 'function foo(): string'
                },
                {
                    ifFollowedBy: ['Expression'],
                    then: 'TERNARY_TRUE',
                    notes: 'cond ? true : false'
                }
            ]
        },
        '.': {
            type: 'accessor',
            name: 'dot',
            source: 'ANTLR',
            startsExpr: false,
            beforeExpr: false,
            notes: 'Member access operator. Also used in numeric literals (1.5).',
            disambiguation: [
                {
                    ifPrecededBy: ['IDENTIFIER', 'PAREN_CLOSE', 'BRACKET_CLOSE'],
                    ifFollowedBy: ['IDENTIFIER'],
                    then: 'MEMBER_ACCESS',
                    notes: 'obj.prop, arr.length'
                },
                {
                    ifPrecededBy: ['NUMBER_LITERAL'],
                    ifFollowedBy: ['NUMBER_LITERAL'],
                    then: 'DECIMAL_POINT',
                    notes: '3.14'
                }
            ]
        },

        // Special
        '...': {
            type: 'spread',
            name: 'ellipsis',
            source: 'ANTLR',
            esVersion: 'ES6',
            startsExpr: false,
            beforeExpr: false,
            notes: 'Spread operator or rest parameter.',
            disambiguation: [
                {
                    ifPrecededBy: ['BRACKET_OPEN', 'BRACE_OPEN', 'PAREN_OPEN', 'COMMA'],
                    then: 'SPREAD_OPERATOR',
                    notes: '[...arr], {...obj}, func(...args)'
                },
                {
                    ifPrecededBy: ['PAREN_OPEN', 'COMMA'],
                    parentContext: ['FunctionDeclaration', 'ArrowFunction'],
                    then: 'REST_PARAMETER',
                    notes: 'function foo(...args)'
                }
            ],
            errorMessage: "Spread/rest operator '...' must be followed by an iterable expression."
        },
        '?.': {
            type: 'accessor',
            name: 'optional-chaining',
            source: 'ANTLR',
            esVersion: 'ES11',
            startsExpr: false,
            beforeExpr: false,
            notes: 'Optional chaining operator. Short-circuits if left side is null/undefined.',
            errorMessage: "Optional chaining operator '?.' must be followed by a property name or bracket."
        },
        '=>': {
            type: 'arrow',
            name: 'arrow-function',
            source: 'ANTLR',
            esVersion: 'ES6',
            startsExpr: false,
            beforeExpr: true,
            precededBy: ['PAREN_CLOSE', 'IDENTIFIER'],
            followedBy: ['BRACE_OPEN', 'Expression'],
            notes: 'Arrow function syntax. Does not bind this, arguments, super, or new.target.',
            commonTypos: ['=>>', '->'],
            errorMessage: "Arrow function '=>' must be preceded by parameters and followed by function body."
        },
        '?': {
            type: 'conditional',
            name: 'ternary',
            source: 'ANTLR',
            startsExpr: false,
            beforeExpr: true,
            disambiguation: [
                {
                    ifFollowedBy: ['DOT'],
                    then: 'OPTIONAL_CHAINING_START',
                    esVersion: 'ES11',
                    notes: 'obj?.prop'
                },
                {
                    ifFollowedBy: ['BRACKET_OPEN'],
                    then: 'OPTIONAL_ELEMENT_ACCESS',
                    esVersion: 'ES11',
                    notes: 'obj?.[key]'
                },
                {
                    ifFollowedBy: ['PAREN_OPEN'],
                    then: 'OPTIONAL_CALL',
                    esVersion: 'ES11',
                    notes: 'func?.()'
                },
                {
                    language: 'TypeScript',
                    ifPrecededBy: ['IDENTIFIER'],
                    then: 'OPTIONAL_PROPERTY',
                    notes: 'interface { prop?: string }'
                },
                {
                    default: 'TERNARY_OPERATOR',
                    notes: 'cond ? true : false'
                }
            ],
            errorMessage: "Ternary operator '?' must be followed by an expression and ':' with alternative expression."
        },
    },

    // ============================================================================
    // TOKEN METADATA - Babel tokenizer/types.ts
    // ============================================================================
    tokenMetadata: {
        // Token Flags (from Babel)
        flags: {
            beforeExpr: 'Token can precede expression',
            startsExpr: 'Token can start expression',
            isLoop: 'Token is loop keyword',
            isAssign: 'Token is assignment operator',
            prefix: 'Token is prefix operator',
            postfix: 'Token is postfix operator',
        },

        // Token Context (from Babel)
        contexts: {
            braceStatement: 'Brace in statement position',
            braceExpression: 'Brace in expression position',
            templateQuasi: 'Template literal quasi',
            parenStatement: 'Paren in statement position',
            parenExpression: 'Paren in expression position',
        },
    },
};

// Export ทั้ง grammar และ metadata
export default JAVASCRIPT_GRAMMAR;
