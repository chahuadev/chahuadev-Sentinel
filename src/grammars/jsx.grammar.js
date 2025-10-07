//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// JSX Grammar Dictionary
// ============================================================================
// ChahuadevR Engine Grammar Dictionary - Core Language Support
// ============================================================================
// ครอบคลุม: JSX, React 18+
// ============================================================================

import { XML_NAMESPACES, NAMESPACE_SOURCES } from './shared/xml-namespaces.js';

export const JSX_GRAMMAR = {
    // ============================================================================
    // JSX ELEMENTS - ANTLR JSX Grammar
    // ============================================================================
    elements: {
        // Opening/Closing Tags
        '<': {
            type: 'tag-start',
            source: 'ANTLR',
            category: 'jsx-element',
            description: 'JSX opening tag start',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'UPPERCASE_IDENTIFIER', 'DOT', 'Fragment'],
            precededBy: ['NEWLINE', 'PAREN_OPEN', 'BRACE_OPEN', 'RETURN', 'ASSIGN'],
            parentContext: ['JSXElement', 'JSXFragment', 'ReturnStatement', 'Expression'],
            startsExpr: true,
            beforeExpr: false,
            mustBeFollowedByIdentifier: true,

            // 2. Parser Directives
            isJSXToken: true,
            startsJSXElement: true,
            requiresClosing: true,
            canBeComponent: true,
            canBeHTMLTag: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: 'JSX vs generic type parameter',
                jsx: 'return <Component />',
                typescript: 'const fn = <T>() => {}',
                context: 'JSX in .jsx/.tsx files',
                note: 'TypeScript: < after = is generic, not JSX'
            }],

            // 4. Error Reporting
            errorMessage: "JSX opening tag must be followed by element name.",
            commonTypos: ['<<', '<-'],
            notes: 'Must be followed by valid identifier or Fragment syntax. Uppercase = Component, lowercase = HTML.',
            quirks: [
                'Uppercase starts with capital = Component',
                'Lowercase = HTML/SVG element',
                'Can conflict with TypeScript generics',
                'Must match closing tag name',
                'Fragment shorthand: <>'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            jsxVersion: 'JSX 1.0',
            spec: 'ANTLR JSX Grammar',
            bestPractice: 'Use Fragment <> instead of <div> wrappers when possible.',
            useCases: [
                'Opening JSX element',
                'Component rendering',
                'HTML element rendering',
                'Fragment shorthand'
            ],
            examples: [
                '<div>',
                '<Component>',
                '<Component.Child>',
                '<>',
                '<ns:element>'
            ]
        },

        '>': {
            type: 'tag-end',
            source: 'ANTLR',
            category: 'jsx-element',
            description: 'JSX opening tag end',

            // 1. Syntactic Relationships
            followedBy: ['JSXText', 'JSXElement', 'JSXExpression', 'NEWLINE'],
            precededBy: ['IDENTIFIER', 'ATTRIBUTE', 'STRING', 'JSXExpression'],
            parentContext: ['JSXOpeningElement'],
            startsExpr: false,
            beforeExpr: false,
            endsOpeningTag: true,

            // 2. Parser Directives
            isJSXToken: true,
            endsJSXOpeningTag: true,
            requiresClosing: true,
            allowsChildren: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: '> vs /> vs comparison',
                openingTag: '<Component>',
                selfClosing: '<Component />',
                comparison: 'x > y',
                note: 'Context-dependent'
            }],

            // 4. Error Reporting
            errorMessage: "JSX tag closed. Expects children or closing tag.",
            commonTypos: ['>>'],
            notes: 'After >, element expects children or closing tag. Self-closing uses />.',
            quirks: [
                'Requires matching closing tag',
                'Can contain JSX children',
                'Different from self-closing />',
                'Can be nested'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            jsxVersion: 'JSX 1.0',
            spec: 'ANTLR JSX Grammar',
            bestPractice: 'Use self-closing /> for elements without children.',
            useCases: [
                'Complete opening tag',
                'Allow children',
                'Nested JSX elements'
            ],
            example: '<Component>children</Component>'
        },

        '</': {
            type: 'closing-tag-start',
            source: 'ANTLR',
            category: 'jsx-element',
            description: 'JSX closing tag start',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'UPPERCASE_IDENTIFIER', 'DOT'],
            precededBy: ['JSXText', 'JSXElement', 'JSXExpression', 'NEWLINE'],
            parentContext: ['JSXClosingElement'],
            startsExpr: false,
            beforeExpr: false,
            closesElement: true,

            // 2. Parser Directives
            isJSXToken: true,
            startsJSXClosingTag: true,
            mustMatchOpening: true,
            requiresIdentifier: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: 'Closing tag must match opening',
                valid: '<Component>...</Component>',
                invalid: '<Component>...</OtherComponent>',
                note: 'Case-sensitive matching'
            }],

            // 4. Error Reporting
            errorMessage: "JSX closing tag must match opening tag name.",
            commonTypos: ['</', '< /'],
            notes: 'Must match opening tag exactly. Case-sensitive.',
            quirks: [
                'Must match opening tag name',
                'Case-sensitive',
                'No attributes allowed',
                'Fragment closing: </>'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            jsxVersion: 'JSX 1.0',
            spec: 'ANTLR JSX Grammar',
            bestPractice: 'Ensure opening and closing tags match exactly.',
            useCases: [
                'Close JSX element',
                'Match opening tag',
                'Fragment closing'
            ],
            examples: [
                '</Component>',
                '</div>',
                '</Component.Child>',
                '</>'
            ]
        },

        '/>': {
            type: 'self-closing-tag-end',
            source: 'ANTLR',
            category: 'jsx-element',
            description: 'JSX self-closing tag end',

            // 1. Syntactic Relationships
            followedBy: ['NEWLINE', 'COMMA', 'SEMICOLON', 'PAREN_CLOSE', 'JSXElement'],
            precededBy: ['IDENTIFIER', 'ATTRIBUTE', 'STRING', 'JSXExpression'],
            parentContext: ['JSXSelfClosingElement'],
            startsExpr: false,
            beforeExpr: false,
            closesElement: true,

            // 2. Parser Directives
            isJSXToken: true,
            endsJSXElement: true,
            selfClosing: true,
            noChildren: true,
            noClosingTag: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: 'Self-closing vs regular tag',
                selfClosing: '<Component />',
                withChildren: '<Component></Component>',
                note: 'Self-closing has no children'
            }],

            // 4. Error Reporting
            errorMessage: "Self-closing JSX tag. No children or closing tag needed.",
            commonTypos: ['/ >', '//>', '>/', '</>', '< />'],
            notes: 'Self-closing tag has no children. No closing tag needed.',
            quirks: [
                'No children allowed',
                'No closing tag needed',
                'Space before / is optional',
                'XML-style self-closing',
                'Must be used for void elements'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            jsxVersion: 'JSX 1.0',
            spec: 'ANTLR JSX Grammar',
            bestPractice: 'Use for elements without children. Void elements must be self-closing.',
            useCases: [
                'Elements without children',
                'Void elements (img, input, br)',
                'Components without children',
                'SVG elements'
            ],
            examples: [
                '<Component />',
                '<img src="..." />',
                '<input type="text" />',
                '<br />',
                '<Circle cx={50} cy={50} r={40} />'
            ]
        },

        // Fragment Syntax
        '<>': {
            type: 'fragment-start',
            source: 'React',
            version: '16.2',
            category: 'jsx-fragment',
            description: 'JSX Fragment shorthand - no extra DOM node',

            // 1. Syntactic Relationships
            followedBy: ['JSXElement', 'JSXText', 'JSXExpression', 'NEWLINE'],
            precededBy: ['RETURN', 'PAREN_OPEN', 'ASSIGN', 'NEWLINE'],
            parentContext: ['JSXFragment', 'ReturnStatement', 'Expression'],
            startsExpr: true,
            beforeExpr: false,
            isFragment: true,

            // 2. Parser Directives
            isJSXToken: true,
            startsJSXFragment: true,
            requiresClosing: true,
            noAttributes: true,
            noKey: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: 'Fragment shorthand vs React.Fragment',
                shorthand: '<>children</>',
                longForm: '<React.Fragment>children</React.Fragment>',
                withKey: '<React.Fragment key={key}>children</React.Fragment>',
                note: 'Shorthand cannot have attributes (including key)'
            }],

            // 4. Error Reporting
            errorMessage: "Fragment shorthand. Use <React.Fragment> if you need key prop.",
            commonTypos: ['< >', '<>>', '<<>'],
            notes: 'No attributes allowed. Use React.Fragment for key prop in lists.',
            quirks: [
                'No attributes allowed',
                'No key prop (use React.Fragment)',
                'Renders no DOM node',
                'Must be closed with </>',
                'React 16.2+ only'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            reactVersion: '16.2',
            spec: 'React Documentation',
            bestPractice: 'Use <> for grouping elements without extra DOM node. Use <React.Fragment key={...}> in lists.',
            useCases: [
                'Group elements without wrapper',
                'Multiple root elements in component',
                'Avoid unnecessary div wrappers',
                'Cleaner JSX structure'
            ],
            examples: [
                'return <><Header /><Content /></>',
                '<>{items.map(i => <Item key={i} />)}</>',
                'condition && <><A /><B /></>'
            ],
            alternatives: ['<React.Fragment>', '<div>']
        },

        '</>': {
            type: 'fragment-end',
            source: 'React',
            version: '16.2',
            category: 'jsx-fragment',
            description: 'JSX Fragment closing tag',

            // 1. Syntactic Relationships
            followedBy: ['NEWLINE', 'SEMICOLON', 'COMMA', 'PAREN_CLOSE'],
            precededBy: ['JSXElement', 'JSXText', 'JSXExpression', 'NEWLINE'],
            parentContext: ['JSXFragment'],
            startsExpr: false,
            beforeExpr: false,
            closesFragment: true,

            // 2. Parser Directives
            isJSXToken: true,
            endsJSXFragment: true,
            mustMatchOpening: true,
            onlyForFragments: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: 'Fragment closing must match <>',
                valid: '<>...</>',
                invalid: '<>...</Component>',
                note: 'Only closes <> fragments'
            }],

            // 4. Error Reporting
            errorMessage: "Fragment closing tag. Must match <> opening.",
            commonTypos: ['< />', '<//>>', '</ >'],
            notes: 'Only closes <> fragments. Cannot close React.Fragment.',
            quirks: [
                'Only closes <> shorthand',
                'Cannot close <React.Fragment>',
                'No whitespace allowed',
                'Must match <> exactly'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            reactVersion: '16.2',
            spec: 'React Documentation',
            bestPractice: 'Always match <> with </>.',
            useCases: [
                'Close fragment shorthand',
                'Complete JSX structure',
                'End element grouping'
            ],
            examples: [
                '<>children</>',
                '<><A /><B /></>',
                'return <><Header /><Footer /></>'
            ]
        },
    },

    // ============================================================================
    // JSX EXPRESSIONS - ANTLR JSX Grammar
    // ============================================================================
    expressions: {
        // JavaScript Expression Embedding
        '{': {
            type: 'expression-start',
            source: 'ANTLR',
            category: 'jsx-expression',
            description: 'JSX expression container start',

            // 1. Syntactic Relationships
            followedBy: ['Expression', 'IDENTIFIER', 'LITERAL', 'BRACE_OPEN', 'BRACKET_OPEN', 'DOT_DOT_DOT'],
            precededBy: ['EQUALS', 'GREATER_THAN', 'JSXText', 'NEWLINE'],
            parentContext: ['JSXExpressionContainer', 'JSXAttribute', 'JSXChildren'],
            startsExpr: true,
            beforeExpr: false,
            embedsJavaScript: true,

            // 2. Parser Directives
            isJSXToken: true,
            startsExpression: true,
            requiresClosing: true,
            allowsAnyExpression: true,
            canSpreadProps: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: '{ in JSX vs object literal',
                jsxExpression: '<Component prop={value} />',
                jsxChildren: '<div>{expression}</div>',
                objectLiteral: 'const obj = { key: value }',
                context: 'In JSX = expression, in JS = object'
            }],

            // 4. Error Reporting
            errorMessage: "JSX expression must contain valid JavaScript expression.",
            commonTypos: ['{{', '{=', '{ '],
            notes: 'Embeds JavaScript expression. Must be closed with }. Can spread props with {...obj}.',
            quirks: [
                'Embeds any JavaScript expression',
                'In attributes: prop={value}',
                'In children: {expression}',
                'Spread props: {...props}',
                'Cannot contain statements',
                'Comments require {/* */}'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            jsxVersion: 'JSX 1.0',
            spec: 'ANTLR JSX Grammar',
            bestPractice: 'Keep expressions simple. Extract complex logic to variables.',
            useCases: [
                'Dynamic attribute values',
                'Embed JavaScript in children',
                'Conditional rendering',
                'Spread props',
                'Array mapping'
            ],
            examples: [
                '{value}',
                '{condition ? <A /> : <B />}',
                '{items.map(i => <Item key={i} />)}',
                '{...props}',
                '{/* comment */}'
            ]
        },

        '}': {
            type: 'expression-end',
            source: 'ANTLR',
            category: 'jsx-expression',
            description: 'JSX expression container end',

            // 1. Syntactic Relationships
            followedBy: ['NEWLINE', 'LESS_THAN', 'JSXText', 'BRACE_OPEN', 'ATTRIBUTE'],
            precededBy: ['Expression', 'IDENTIFIER', 'LITERAL', 'PAREN_CLOSE', 'BRACKET_CLOSE', 'BRACE_CLOSE'],
            parentContext: ['JSXExpressionContainer'],
            startsExpr: false,
            beforeExpr: false,
            closesExpression: true,

            // 2. Parser Directives
            isJSXToken: true,
            endsExpression: true,
            mustMatchOpening: true,
            returnsToJSX: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: '} closes JSX expression',
                valid: '{expression}',
                nested: '{{key: value}}',
                note: 'Returns to JSX context after }'
            }],

            // 4. Error Reporting
            errorMessage: "Closes JSX expression. Returns to JSX context.",
            commonTypos: ['}}', '} }'],
            notes: 'Must match opening {. Returns to JSX parsing after }.',
            quirks: [
                'Returns to JSX context',
                'Must balance with {',
                'Can be nested (object literals)',
                'Closing spread: {...props}'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            jsxVersion: 'JSX 1.0',
            spec: 'ANTLR JSX Grammar',
            bestPractice: 'Ensure { and } are balanced.',
            useCases: [
                'Close JSX expression',
                'Return to JSX parsing',
                'Complete attribute value',
                'Complete children expression'
            ],
            example: '<Component prop={value}>{children}</Component>'
        },

        // Spread Attributes
        '{...': {
            type: 'spread-start',
            source: 'ANTLR',
            category: 'jsx-spread',
            description: 'JSX spread attributes syntax',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'Expression'],
            precededBy: ['WHITESPACE', 'NEWLINE', 'IDENTIFIER'],
            parentContext: ['JSXSpreadAttribute', 'JSXOpeningElement'],
            startsExpr: true,
            beforeExpr: false,
            spreadsObject: true,

            // 2. Parser Directives
            isJSXToken: true,
            isSpreadOperator: true,
            requiresObject: true,
            spreadsProps: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'JSX',
                rule: 'Spread props vs spread in expression',
                spreadProps: '<Component {...props} />',
                spreadArray: '<Component items={[...array]} />',
                spreadObject: '<Component style={{...styles}} />',
                note: 'Different contexts'
            }],

            // 4. Error Reporting
            errorMessage: "Spread operator in JSX. Must spread object containing props.",
            commonTypos: ['{..', '{...}', '{ ...'],
            notes: 'Spreads object properties as JSX props. Common for passing all props.',
            quirks: [
                'Spreads object as props',
                'Order matters (later overrides)',
                'Can spread multiple objects',
                'React-specific syntax',
                'Not standard JavaScript'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            jsxVersion: 'JSX 1.0',
            spec: 'ANTLR JSX Grammar',
            bestPractice: 'Use for prop forwarding. Place specific props after to override.',
            useCases: [
                'Forward all props',
                'Merge prop objects',
                'Override default props',
                'HOC prop forwarding'
            ],
            examples: [
                '<Component {...props} />',
                '<Component {...defaults} className="override" />',
                '<Component {...props} {...overrides} />',
                '<input {...register("name")} />'
            ]
        },
    },

    // ============================================================================
    // JSX ATTRIBUTES - ANTLR JSX Grammar
    // ============================================================================
    attributes: {
        // HTML Attributes (camelCase in React)
        'className': { htmlEquivalent: 'class', source: 'React' },
        'htmlFor': { htmlEquivalent: 'for', source: 'React' },
        'defaultValue': { htmlEquivalent: 'value', source: 'React', controlled: false },
        'defaultChecked': { htmlEquivalent: 'checked', source: 'React', controlled: false },

        // Data Attributes
        'data-*': { pattern: 'data-[a-z]+', source: 'HTML5' },

        // ARIA Attributes
        'aria-*': { pattern: 'aria-[a-z]+', source: 'ARIA' },

        // Event Handlers (React SyntheticEvent)
        'onClick': { eventType: 'MouseEvent', source: 'React' },
        'onChange': { eventType: 'ChangeEvent', source: 'React' },
        'onSubmit': { eventType: 'FormEvent', source: 'React' },
        'onKeyDown': { eventType: 'KeyboardEvent', source: 'React' },
        'onKeyUp': { eventType: 'KeyboardEvent', source: 'React' },
        'onFocus': { eventType: 'FocusEvent', source: 'React' },
        'onBlur': { eventType: 'FocusEvent', source: 'React' },
        'onMouseEnter': { eventType: 'MouseEvent', source: 'React' },
        'onMouseLeave': { eventType: 'MouseEvent', source: 'React' },
        'onInput': { eventType: 'FormEvent', source: 'React' },

        // Special React Attributes
        'key': { type: 'special', source: 'React', description: 'List item identifier' },
        'ref': { type: 'special', source: 'React', description: 'DOM reference' },
        'dangerouslySetInnerHTML': { type: 'special', source: 'React', description: 'Raw HTML injection' },

        // Style Attribute (object syntax)
        'style': { type: 'object', source: 'React', description: 'Inline styles as object' },
    },

    // ============================================================================
    // REACT BUILT-IN COMPONENTS
    // ============================================================================
    builtInComponents: {
        // Fragment
        'Fragment': {
            source: 'React',
            version: '16.2',
            shorthand: '<>',
            category: 'react-component',
            description: 'Groups children without adding DOM node',

            // 1. Syntactic Relationships
            followedBy: ['GREATER_THAN', 'ATTRIBUTE'],
            precededBy: ['LESS_THAN', 'DOT'],
            parentContext: ['JSXElement'],
            startsExpr: false,
            beforeExpr: false,
            isBuiltIn: true,

            // 2. Parser Directives
            isReactComponent: true,
            isBuiltInComponent: true,
            noDOMNode: true,
            allowsKey: true,
            allowsChildren: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'React',
                rule: 'Fragment vs fragment shorthand',
                longForm: '<React.Fragment key={key}>...</React.Fragment>',
                shorthand: '<>...</>',
                note: 'Use longform for key prop in lists'
            }],

            // 4. Error Reporting
            errorMessage: "Fragment groups elements without DOM node.",
            commonTypos: ['Frag', 'fragment', 'Fragement'],
            notes: 'Renders no DOM node. Use <> shorthand when no key needed. Only accepts key and children props.',
            quirks: [
                'Renders no DOM node',
                'Shorthand: <>',
                'Accepts only key prop',
                'Useful in lists',
                'Cannot have ref'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            reactVersion: '16.2',
            spec: 'React Documentation',
            bestPractice: 'Use <> shorthand unless you need key prop.',
            useCases: [
                'Group elements without wrapper',
                'Return multiple elements',
                'List items with key',
                'Avoid unnecessary divs'
            ],
            examples: [
                '<React.Fragment key={id}><A /><B /></React.Fragment>',
                '<>...</>',
                '{items.map(i => <Fragment key={i.id}>...</Fragment>)}'
            ]
        },

        // StrictMode
        'StrictMode': {
            source: 'React',
            version: '16.3',
            category: 'react-component',
            description: 'Enables development warnings and checks',

            // 1. Syntactic Relationships
            followedBy: ['GREATER_THAN'],
            precededBy: ['LESS_THAN', 'DOT'],
            parentContext: ['JSXElement', 'Root'],
            startsExpr: false,
            beforeExpr: false,
            isBuiltIn: true,

            // 2. Parser Directives
            isReactComponent: true,
            isBuiltInComponent: true,
            developmentOnly: true,
            noProductionEffect: true,
            allowsChildren: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'React',
                rule: 'StrictMode development checks',
                checks: [
                    'Unsafe lifecycle methods',
                    'Legacy string ref API',
                    'Deprecated findDOMNode',
                    'Unexpected side effects',
                    'Legacy context API'
                ]
            }],

            // 4. Error Reporting
            errorMessage: "StrictMode enables extra development checks.",
            commonTypos: ['StrictMode', 'Strict', 'strictMode'],
            notes: 'Development-only. Intentionally double-invokes functions to detect side effects.',
            quirks: [
                'Development only',
                'No production effect',
                'Double-invokes components',
                'Detects side effects',
                'Can be nested'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            reactVersion: '16.3',
            spec: 'React Documentation',
            bestPractice: 'Wrap entire app in <StrictMode> during development.',
            useCases: [
                'Enable development warnings',
                'Detect unsafe patterns',
                'Prepare for concurrent features',
                'Find side effects'
            ],
            examples: [
                '<React.StrictMode><App /></React.StrictMode>',
                '<StrictMode><Router><App /></Router></StrictMode>'
            ]
        },

        // Suspense
        'Suspense': {
            source: 'React',
            version: '16.6',
            category: 'react-component',
            description: 'Lazy loading boundary with fallback',

            // 1. Syntactic Relationships
            followedBy: ['GREATER_THAN', 'ATTRIBUTE'],
            precededBy: ['LESS_THAN', 'DOT'],
            parentContext: ['JSXElement'],
            startsExpr: false,
            beforeExpr: false,
            isBuiltIn: true,

            // 2. Parser Directives
            isReactComponent: true,
            isBuiltInComponent: true,
            requiresFallback: true,
            allowsChildren: true,
            catchesPromise: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'React',
                rule: 'Suspense for code splitting and data fetching',
                codeSplitting: '<Suspense fallback={<Loading />}><LazyComponent /></Suspense>',
                dataFetching: '<Suspense fallback={<Spinner />}><DataComponent /></Suspense>',
                note: 'React 18: data fetching support'
            }],

            // 4. Error Reporting
            errorMessage: "Suspense requires fallback prop.",
            commonTypos: ['Suspence', 'Suspend', 'suspense'],
            notes: 'Catches thrown promises. Shows fallback while loading. React 18: supports data fetching.',
            quirks: [
                'Requires fallback prop',
                'Catches thrown promises',
                'Code splitting with lazy()',
                'React 18: data fetching',
                'Can be nested'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            reactVersion: '16.6',
            enhancements: { '18.0': 'Data fetching support' },
            spec: 'React Documentation',
            bestPractice: 'Place close to lazy-loaded components. Provide meaningful fallback.',
            useCases: [
                'Code splitting',
                'Lazy component loading',
                'Data fetching (React 18+)',
                'Loading states'
            ],
            examples: [
                '<Suspense fallback={<Loading />}><LazyComponent /></Suspense>',
                '<Suspense fallback={<Spinner />}>{children}</Suspense>',
                'const Lazy = lazy(() => import("./Component"))'
            ]
        },

        // Profiler
        'Profiler': {
            source: 'React',
            version: '16.5',
            category: 'react-component',
            description: 'Measures render performance',

            // 1. Syntactic Relationships
            followedBy: ['GREATER_THAN', 'ATTRIBUTE'],
            precededBy: ['LESS_THAN', 'DOT'],
            parentContext: ['JSXElement'],
            startsExpr: false,
            beforeExpr: false,
            isBuiltIn: true,

            // 2. Parser Directives
            isReactComponent: true,
            isBuiltInComponent: true,
            requiresId: true,
            requiresOnRender: true,
            allowsChildren: true,
            developmentRecommended: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'React',
                rule: 'Profiler callback signature',
                onRender: 'function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {}',
                phases: ['mount', 'update'],
                note: 'Use React DevTools Profiler for visual analysis'
            }],

            // 4. Error Reporting
            errorMessage: "Profiler requires id and onRender callback.",
            commonTypos: ['Profiler', 'profiler', 'Profile'],
            notes: 'Measures render time. Requires id and onRender callback. Has performance cost.',
            quirks: [
                'Requires id prop',
                'Requires onRender callback',
                'Has performance cost',
                'Development tool',
                'Can be nested',
                'Tracks render phases'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            reactVersion: '16.5',
            spec: 'React Documentation',
            bestPractice: 'Use in development only. Remove or disable in production.',
            useCases: [
                'Performance profiling',
                'Render time tracking',
                'Optimization debugging',
                'Component analysis'
            ],
            examples: [
                '<Profiler id="App" onRender={callback}><App /></Profiler>',
                '<Profiler id="Navigation" onRender={onRenderCallback}><Nav /></Profiler>'
            ]
        },

        // Concurrent Features (React 18+)
        'Offscreen': {
            source: 'React',
            version: '18.0',
            experimental: true,
            category: 'react-component',
            description: 'Pre-render content off-screen (experimental)',

            // 1. Syntactic Relationships
            followedBy: ['GREATER_THAN', 'ATTRIBUTE'],
            precededBy: ['LESS_THAN', 'DOT'],
            parentContext: ['JSXElement'],
            startsExpr: false,
            beforeExpr: false,
            isBuiltIn: true,

            // 2. Parser Directives
            isReactComponent: true,
            isBuiltInComponent: true,
            isExperimental: true,
            allowsChildren: true,
            preRendersContent: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'React',
                rule: 'Offscreen experimental API',
                note: 'Pre-renders content without displaying. Experimental - may change.'
            }],

            // 4. Error Reporting
            errorMessage: "Offscreen is experimental. API may change.",
            commonTypos: ['OffScreen', 'offscreen'],
            notes: 'EXPERIMENTAL. Pre-renders hidden content. API subject to change.',
            quirks: [
                'Experimental API',
                'May change or be removed',
                'Pre-renders off-screen',
                'Not for production',
                'Part of concurrent features'
            ],

            // 5. Complete Coverage
            stage: 'experimental',
            reactVersion: '18.0',
            spec: 'React Experimental',
            bestPractice: 'Do not use in production. Wait for stable release.',
            useCases: [
                'Pre-render hidden content',
                'Experimental concurrent features',
                'Future optimizations'
            ],
            examples: [
                '<Offscreen mode="hidden"><Content /></Offscreen>',
                '// Experimental - do not use in production'
            ],
            warning: 'Experimental API. Do not use in production.'
        },

        // Error Boundaries (class component pattern)
        // Note: No built-in component, use class with componentDidCatch
        'ErrorBoundary': {
            source: 'React',
            version: '16.0',
            category: 'react-pattern',
            description: 'Catch JavaScript errors in component tree (pattern, not built-in)',

            // 1. Syntactic Relationships
            followedBy: ['GREATER_THAN', 'ATTRIBUTE'],
            precededBy: ['LESS_THAN'],
            parentContext: ['JSXElement'],
            startsExpr: false,
            beforeExpr: false,
            isPattern: true,

            // 2. Parser Directives
            isReactComponent: true,
            isPattern: true,
            notBuiltIn: true,
            requiresClassComponent: true,
            allowsChildren: true,

            // 3. Disambiguation Rules
            disambiguation: [{
                language: 'React',
                rule: 'Error boundary implementation',
                required: [
                    'static getDerivedStateFromError(error)',
                    'componentDidCatch(error, errorInfo)'
                ],
                note: 'Must be class component. No functional equivalent yet.'
            }],

            // 4. Error Reporting
            errorMessage: "Error boundaries must be class components with componentDidCatch.",
            commonTypos: ['ErrorBoundry', 'errorBoundary'],
            notes: 'NOT built-in. Must implement yourself. Catches errors in child components.',
            quirks: [
                'Not a built-in component',
                'Must be class component',
                'No functional equivalent',
                'Catches render errors',
                'Does not catch event handler errors',
                'Does not catch async errors'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            reactVersion: '16.0',
            spec: 'React Documentation',
            bestPractice: 'Wrap top-level routes. Provide fallback UI. Log errors.',
            useCases: [
                'Catch render errors',
                'Prevent white screen',
                'Show error UI',
                'Log errors to service'
            ],
            examples: [
                'class ErrorBoundary extends React.Component { /* ... */ }',
                '<ErrorBoundary fallback={<Error />}><App /></ErrorBoundary>',
                '// Use react-error-boundary library'
            ],
            alternatives: ['react-error-boundary library']
        },
    },

    // ============================================================================
    // JSX NAMESPACES (SVG, MathML)
    // ============================================================================
    namespaces: {
        // SVG Elements
        'svg': { namespace: XML_NAMESPACES.SVG, source: NAMESPACE_SOURCES.SVG },
        'path': { namespace: XML_NAMESPACES.SVG, source: NAMESPACE_SOURCES.SVG },
        'circle': { namespace: XML_NAMESPACES.SVG, source: NAMESPACE_SOURCES.SVG },
        'rect': { namespace: XML_NAMESPACES.SVG, source: NAMESPACE_SOURCES.SVG },
        'g': { namespace: XML_NAMESPACES.SVG, source: NAMESPACE_SOURCES.SVG },

        // MathML Elements
        'math': { namespace: XML_NAMESPACES.MATHML, source: NAMESPACE_SOURCES.MATHML },
        'mrow': { namespace: XML_NAMESPACES.MATHML, source: NAMESPACE_SOURCES.MATHML },
        'mi': { namespace: XML_NAMESPACES.MATHML, source: NAMESPACE_SOURCES.MATHML },
        'mo': { namespace: XML_NAMESPACES.MATHML, source: NAMESPACE_SOURCES.MATHML },
        'mn': { namespace: XML_NAMESPACES.MATHML, source: NAMESPACE_SOURCES.MATHML },
    },

    // ============================================================================
    // REACT HOOKS NAMING PATTERN
    // ============================================================================
    hooksPattern: {
        pattern: /^use[A-Z]/,
        description: 'Custom hooks must start with "use"',
        source: 'React',
        examples: ['useState', 'useEffect', 'useCustomHook'],
    },

    // ============================================================================
    // COMPONENT NAMING PATTERN
    // ============================================================================
    componentPattern: {
        pattern: /^[A-Z]/,
        description: 'Components must start with uppercase letter',
        source: 'React',
        examples: ['MyComponent', 'Button', 'UserProfile'],
    },

    // ============================================================================
    // JSX CHILDREN TYPES
    // ============================================================================
    childrenTypes: {
        'JSXElement': { description: 'Nested JSX element', source: 'ANTLR' },
        'JSXText': { description: 'Plain text content', source: 'ANTLR' },
        'JSXExpression': { description: 'JavaScript expression in {}', source: 'ANTLR' },
        'JSXFragment': { description: 'Fragment (<>...</>)', source: 'ANTLR' },
        'null': { description: 'Null renders nothing', source: 'React' },
        'undefined': { description: 'Undefined renders nothing', source: 'React' },
        'boolean': { description: 'Boolean renders nothing', source: 'React' },
        'string': { description: 'String renders as text', source: 'React' },
        'number': { description: 'Number renders as text', source: 'React' },
        'Array': { description: 'Array of children', source: 'React' },
    },

    // ============================================================================
    // REACT SPECIAL PROPS
    // ============================================================================
    specialProps: {
        'children': {
            type: 'ReactNode',
            description: 'Content between opening and closing tags',
            source: 'React',
        },
        'key': {
            type: 'string | number',
            description: 'Unique identifier for list items',
            source: 'React',
            required: 'in lists',
        },
        'ref': {
            type: 'RefObject | RefCallback',
            description: 'Reference to DOM element or component instance',
            source: 'React',
        },
    },

    // ============================================================================
    // JSX TRANSFORM MODES
    // ============================================================================
    transforms: {
        'classic': {
            description: 'React.createElement() calls',
            source: 'Babel',
            pragma: 'React.createElement',
            pragmaFrag: 'React.Fragment',
        },
        'automatic': {
            description: 'jsx() runtime calls (React 17+)',
            source: 'Babel',
            runtime: 'jsx/jsx-runtime',
            version: 'React 17+',
        },
    },

    // ============================================================================
    // BABEL JSX PLUGIN OPTIONS
    // ============================================================================
    babelOptions: {
        'pragma': { default: 'React.createElement', description: 'JSX factory function' },
        'pragmaFrag': { default: 'React.Fragment', description: 'Fragment factory' },
        'throwIfNamespace': { default: false, description: 'Error on XML namespaces' },
        'useBuiltIns': { default: false, description: 'Use native Object.assign' },
        'useSpread': { default: false, description: 'Use spread for props' },
        'runtime': { default: 'classic', description: 'JSX transform runtime' },
        'importSource': { default: 'react', description: 'JSX runtime import source' },
    },

    // ============================================================================
    // TYPESCRIPT JSX MODES
    // ============================================================================
    tsxModes: {
        'preserve': { description: 'Keep JSX for subsequent transform', output: '.jsx' },
        'react': { description: 'Transform to React.createElement', output: '.js' },
        'react-native': { description: 'Keep JSX for React Native', output: '.js' },
        'react-jsx': { description: 'Use jsx() runtime (React 17+)', output: '.js' },
        'react-jsxdev': { description: 'Use jsxDEV() runtime (dev)', output: '.js' },
    },

    // ============================================================================
    // COMMON JSX PATTERNS
    // ============================================================================
    patterns: {
        // Conditional Rendering
        conditionalRendering: {
            ternary: 'condition ? <A /> : <B />',
            logicalAnd: 'condition && <Component />',
            logicalOr: 'value || <Default />',
            nullCoalescing: 'value ?? <Default />',
        },

        // List Rendering
        listRendering: {
            map: 'array.map(item => <Item key={item.id} {...item} />)',
            filter: 'array.filter(predicate).map(item => <Item key={item.id} />)',
        },

        // Prop Spreading
        propSpreading: {
            spread: '<Component {...props} />',
            override: '<Component {...props} className="custom" />',
        },

        // Children Patterns
        childrenPatterns: {
            renderProps: '<Container>{value => <Child value={value} />}</Container>',
            cloneElement: 'React.cloneElement(child, { additionalProp: value })',
        },
    },

    // ============================================================================
    // JSX ESCAPING
    // ============================================================================
    escaping: {
        // HTML Entities
        '': '<',
        '': '>',
        '': '&',
        '': '"',
        '': "'",
        '&#x...;': 'Unicode code point',
        '&#...;': 'Decimal code point',

        // JavaScript Escaping in Attributes
        attributeEscaping: {
            singleQuote: "\\'",
            doubleQuote: '\\"',
            backslash: '\\\\',
            newline: '\\n',
            tab: '\\t',
        },
    },
};

// Export ทั้ง grammar และ metadata
export default JSX_GRAMMAR;
