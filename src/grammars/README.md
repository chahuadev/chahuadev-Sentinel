# Grammar Dictionaries

Complete grammar vocabularies for JavaScript, TypeScript, Java, and JSX - compiled from **REAL authoritative sources**.

##  New: In-Memory Search System

Fast and accurate search system with:
- **Map/Set**: O(1) keyword/operator lookup
- **Trie**: Longest match tokenization for multi-char operators
- **Levenshtein Distance**: Typo suggestions ("Did you mean...?")

See **[SEARCH_SYSTEM.md](./SEARCH_SYSTEM.md)** for complete guide.

```javascript
import { GrammarIndex, JAVASCRIPT_GRAMMAR } from '@chahuadev/scanner';

const index = new GrammarIndex(JAVASCRIPT_GRAMMAR);

// O(1) keyword check
index.isKeyword('const'); // true

// O(m) longest operator match - solves tokenizer problem!
const match = index.findLongestOperator('!==', 0);
console.log(match.operator); // '!==' (not '!=' or '!')

// Typo suggestions
const suggestions = index.suggestKeyword('functoin');
// [{ keyword: 'function', distance: 2, similarity: 0.75 }]
```

##  Sources

All vocabulary items are sourced from these authoritative references:

### JavaScript/ECMAScript
- **[ECMAScript 2026 Language Specification](https://tc39.es/ecma262/)** - Official ECMA-262 standard
- **[Babel Parser](https://github.com/babel/babel)** - `packages/babel-parser/src/tokenizer/types.ts`
- **[ANTLR JavaScript Grammar](https://github.com/antlr/grammars-v4)** - Community-validated grammar

### TypeScript
- **[TypeScript Compiler](https://github.com/microsoft/TypeScript)** - `src/compiler/scanner.ts`, `src/compiler/types.ts`
- **[Babel TypeScript Plugin](https://github.com/babel/babel)** - `packages/babel-parser/src/plugins/typescript`
- **[ANTLR TypeScript Grammar](https://github.com/antlr/grammars-v4)** - `javascript/typescript/*.g4`

### Java
- **[ANTLR Java Grammar](https://github.com/antlr/grammars-v4)** - `java/java/*.g4`
- **Java Language Specification (JLS) SE 21** - Official Oracle documentation

### JSX
- **[ANTLR JSX Grammar](https://github.com/antlr/grammars-v4)** - `javascript/jsx/*.g4`
- **[React JSX Documentation](https://react.dev/learn/writing-markup-with-jsx)** - Official React docs
- **[Babel JSX Plugin](https://github.com/babel/babel)** - `packages/babel-plugin-transform-react-jsx`

##  Files

```
grammars/
├── index.js                  # Main export, statistics, validation
├── index.d.ts               # TypeScript type definitions
├── javascript.grammar.js     # JavaScript ES1-ES2024 grammar (ENHANCED)
├── typescript.grammar.js     # TypeScript 1.0-5.x grammar
├── java.grammar.js          # Java SE8-SE21 grammar
├── jsx.grammar.js           # JSX/React grammar
├── PARSER_DIRECTIVES.md     # Parser implementation guide
├── CHANGELOG.md             # Version history
└── README.md                # This file
```

##  Enhanced Features (5 Strategies)

### 1. **Syntactic Relationships** 
Grammar มีข้อมูลความสัมพันธ์ทางไวยากรณ์:
- `followedBy` - Token ที่ควรตามหลัง
- `precededBy` - Token ที่ควรอยู่ข้างหน้า
- `parentContext` - Context ที่ยอมให้มี token นี้

```javascript
'if': {
  followedBy: ['PAREN_OPEN'],
  parentContext: ['BlockStatement', 'IfStatement', 'Program'],
  errorMessage: "An 'if' statement must be followed by a condition in parentheses."
}
```

### 2. **Parser Directives** 
คำสั่งสำหรับ Parser:
- `associativity` - ทิศทางการคำนวณ (left/right)
- `isInfix` / `isPrefix` / `isPostfix` - ตำแหน่งของ operator
- `isAssign` - เป็น assignment operator
- `startsExpr` / `beforeExpr` - บอกว่า token เริ่มหรือนำหน้า expression

```javascript
'||': {
  precedence: 1,
  associativity: 'left',  // ซ้ายไปขวา: a || b || c = (a || b) || c
  isInfix: true,
}
```

### 3. **Disambiguation Rules** 
กฎสำหรับแก้ความกำกวมของ tokens หลายความหมาย:

```javascript
'<': {
  disambiguation: [
    // TypeScript Generic: Array<string>
    { 
      ifPrecededBy: ['IDENTIFIER'],
      ifFollowedBy: ['IDENTIFIER'],
      then: 'GENERIC_START',
      language: 'TypeScript'
    },
    // JSX Tag: <Component />
    { 
      ifPrecededBy: ['KEYWORD_RETURN'],
      then: 'JSX_TAG_START',
      language: 'JSX'
    },
    // Default: x < 5
    { default: 'OPERATOR_LESS_THAN' }
  ]
}
```

### 4. **Enhanced Error Reporting** 
ข้อมูลสำหรับแจ้งข้อผิดพลาด:
- `errorMessage` - ข้อความแนะนำ
- `commonTypos` - คำที่มักพิมพ์ผิด (แนะนำการแก้ไข)
- `notes` - หมายเหตุเพิ่มเติม

```javascript
'function': {
  commonTypos: ['functoin', 'fucntion', 'funciton'],
  errorMessage: "A function declaration must start with 'function'..."
}
```

### 5. **Complete Coverage** 
ครอบคลุมทุก edge cases:
- `stage` - สถานะของ Proposal (Stage 0-4)
- `deprecated` - ฟีเจอร์ที่ไม่แนะนำให้ใช้
- `quirks` - พฤติกรรมพิเศษ
- `equivalentTo` - สมมูลกับ (สำหรับ compound operators)

```javascript
'|>': {
  stage: 2,
  notes: 'Experimental feature. Syntax may change.'
}

'with': {
  deprecated: true,
  notes: 'Deprecated in strict mode.'
}
```

##  Coverage

### JavaScript (`javascript.grammar.js`)
- **Keywords**: 70+ (ES1-ES2024)
  - Control flow: `if`, `else`, `switch`, `case`, `default`
  - Iteration: `for`, `while`, `do`, `break`, `continue`
  - Exception handling: `try`, `catch`, `finally`, `throw`
  - Functions: `function`, `return`, `yield`, `async`, `await`
  - Declarations: `var`, `let`, `const`, `class`, `extends`
  - Modules: `import`, `export`, `from`, `as`
  - Operators: `in`, `instanceof`, `typeof`, `void`, `delete`, `new`
  - Reserved: `enum`, `implements`, `interface`, `package`, `private`, `protected`, `public`, `static`
  - Contextual: `of`, `get`, `set`, `meta`, `target`, `using`, `defer`

- **Literals**: 4
  - Boolean: `true`, `false`
  - Null: `null`
  - Undefined: `undefined`

- **Binary Operators**: 30+ (with precedence 0-11)
  - Pipeline: `|>` (Stage 2)
  - Nullish coalescing: `??` (ES2020)
  - Logical: `||`, `&&`
  - Bitwise: `|`, `^`, `&`, `<<`, `>>`, `>>>`
  - Equality: `==`, `!=`, `===`, `!==`
  - Relational: `<`, `>`, `<=`, `>=`
  - Arithmetic: `+`, `-`, `*`, `/`, `%`, `**`

- **Unary Operators**: 10
  - Update: `++`, `--`
  - Unary: `+`, `-`, `!`, `~`
  - Keywords: `typeof`, `void`, `delete`, `await`

- **Assignment Operators**: 16
  - Simple: `=`
  - Compound: `+=`, `-=`, `*=`, `/=`, `%=`, `<<=`, `>>=`, `>>>=`, `|=`, `^=`, `&=`, `**=`
  - Logical: `&&=`, `||=`, `??=` (ES2021)

- **Punctuation**: 14
  - Brackets: `[`, `]`, `(`, `)`, `{`, `}`
  - Delimiters: `;`, `,`, `:`, `.`
  - Special: `...`, `?.`, `??`, `=>`, `?`

**Source Mapping**:
- ECMAScript 2026: Reserved words, syntax productions
- Babel tokenizer/types.ts: Token types, operator precedence
- ANTLR JavaScript grammar: Lexer/parser rules

---

### TypeScript (`typescript.grammar.js`)
- **Type Keywords**: 12
  - Primitives: `any`, `boolean`, `number`, `string`, `void`, `null`, `undefined`
  - Advanced: `never`, `unknown`, `object`, `bigint`, `symbol`

- **Modifiers**: 11
  - Access: `public`, `private`, `protected`
  - Declaration: `abstract`, `declare`, `readonly`, `static`, `override`
  - Async/Accessor: `async`, `accessor`
  - Variance: `in`, `out` (TS 4.7)

- **Type Operators**: 7
  - Query: `keyof`, `typeof`
  - Manipulation: `infer`, `is`, `asserts`, `satisfies`
  - Unique: `unique`

- **Declarations**: 6
  - Type declarations: `type`, `interface`, `enum`
  - Namespace/Module: `namespace`, `module`
  - Global: `global`

- **Module Keywords**: 8
  - ES Module: `import`, `export`, `from`, `as`
  - TypeScript-specific: `require`, `exports`
  - Import assertions: `assert`, `with` (TS 5.3)

- **Special Keywords**: 6
  - Constructor: `constructor`
  - Type predicates: `checks`
  - Mixins: `mixins`
  - Intrinsic: `intrinsic`
  - Proto: `proto`
  - Implements: `implements`

- **Type Operator Symbols**: 13
  - Union/Intersection: `|`, `&`
  - Conditional: `?`, `:`
  - Mapped: `[`, `]`
  - Generic: `<`, `>`
  - Arrow: `=>`
  - Optional/Rest: `?`, `...`
  - Non-null assertion: `!`
  - Template literal: `${`, `}`

- **Decorators**: `@` (TS 5.0+)

- **Triple-Slash Directives**: 3
  - `/// <reference`
  - `/// <amd-module`
  - `/// <amd-dependency`

- **Classification Types**: 15
  - `comment`, `identifier`, `keyword`, `numericLiteral`, `bigintLiteral`, `operator`, `stringLiteral`, `regularExpressionLiteral`, `whiteSpace`, `text`, `punctuation`, `className`, `enumName`, `interfaceName`, `moduleName`, `typeParameterName`, `typeAliasName`, `parameterName`

**Source Mapping**:
- TypeScript scanner.ts: `textToKeywordObj` (80+ keywords)
- TypeScript types.ts: `SyntaxKind` enum
- TypeScript classifier.ts: Token classification
- Babel TypeScript plugin: TypeScript-specific tokens

---

### Java (`java.grammar.js`)
- **Keywords**: 65+
  - Declaration: `abstract`, `class`, `interface`, `enum`, `record`, `sealed`, `non-sealed`
  - Access modifiers: `public`, `private`, `protected`
  - Other modifiers: `static`, `final`, `strictfp`, `synchronized`, `transient`, `volatile`, `native`
  - Control flow: `if`, `else`, `switch`, `case`, `default`
  - Iteration: `for`, `while`, `do`, `break`, `continue`
  - Exception: `try`, `catch`, `finally`, `throw`, `throws`
  - OOP: `extends`, `implements`, `new`, `this`, `super`
  - Module: `package`, `import`, `module`, `requires`, `exports`, `opens`, `uses`, `provides`, `with`, `to`, `transitive`, `open`
  - Method: `return`, `void`
  - Assertion: `assert`
  - Operators: `instanceof`
  - Reserved: `const`, `goto` (unused)
  - Contextual: `var` (SE10), `yield` (SE14), `permits` (SE17)

- **Primitive Types**: 8
  - `boolean` (1-bit), `byte` (8-bit), `char` (16-bit), `short` (16-bit)
  - `int` (32-bit), `long` (64-bit), `float` (32-bit), `double` (64-bit)

- **Literals**: 10
  - Boolean: `true`, `false`
  - Null: `null`
  - Integer: decimal, hexadecimal (`0x`), octal (`0`), binary (`0b` - SE7)
  - Floating-point: float (`f/F`), double (`d/D`)
  - Character: `'...'`
  - String: `"..."`, text blocks (`"""..."""` - SE15)

- **Operators**: 35
  - Arithmetic: `+`, `-`, `*`, `/`, `%`
  - Unary: `++`, `--`, `!`, `~`
  - Relational: `==`, `!=`, `<`, `>`, `<=`, `>=`
  - Logical: `&&`, `||`
  - Bitwise: `&`, `|`, `^`, `<<`, `>>`, `>>>`
  - Assignment: `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=`, `>>>=`
  - Ternary: `?`, `:`
  - Method reference: `::` (SE8)
  - Lambda arrow: `->` (SE8)
  - Annotation: `@` (SE5)
  - Varargs: `...` (SE5)

- **Separators**: 9
  - Parentheses: `(`, `)`
  - Braces: `{`, `}`
  - Brackets: `[`, `]`
  - Delimiters: `;`, `,`, `.`

- **Annotations**: 9 built-in
  - `@Override`, `@Deprecated`, `@SuppressWarnings`, `@SafeVarargs`, `@FunctionalInterface`
  - Meta-annotations: `@Retention`, `@Target`, `@Documented`, `@Inherited`, `@Repeatable`

- **Generics**: 5 (SE5+)
  - Type parameters: `<`, `>`
  - Wildcard: `?`
  - Bounds: `extends`, `super`

**Source Mapping**:
- ANTLR Java Lexer: `java/java/JavaLexer.g4`
- Java Language Specification (JLS) SE 21

---

### JSX (`jsx.grammar.js`)
- **Elements**: 6
  - Opening/Closing: `<`, `>`, `</`, `/>`
  - Fragment: `<>`, `</>`

- **Expressions**: 4
  - JavaScript embedding: `{`, `}`
  - Spread attributes: `{...`, `}`

- **Attributes**: 20+
  - HTML equivalents: `className`, `htmlFor`, `defaultValue`, `defaultChecked`
  - Data attributes: `data-*`
  - ARIA attributes: `aria-*`
  - Event handlers: `onClick`, `onChange`, `onSubmit`, `onKeyDown`, `onKeyUp`, `onFocus`, `onBlur`, `onMouseEnter`, `onMouseLeave`, `onInput`
  - Special React: `key`, `ref`, `dangerouslySetInnerHTML`
  - Style: `style` (object syntax)

- **Built-in Components**: 4
  - `Fragment`, `StrictMode`, `Suspense`, `Profiler`
  - Experimental: `Offscreen`

- **Namespaces**: 10
  - SVG: `svg`, `path`, `circle`, `rect`, `g`
  - MathML: `math`, `mrow`, `mi`, `mo`, `mn`

- **Hooks Pattern**: `/^use[A-Z]/`
  - Examples: `useState`, `useEffect`, `useCustomHook`

- **Component Pattern**: `/^[A-Z]/`
  - Examples: `MyComponent`, `Button`, `UserProfile`

- **Children Types**: 10
  - `JSXElement`, `JSXText`, `JSXExpression`, `JSXFragment`, `null`, `undefined`, `boolean`, `string`, `number`, `Array`

- **Special Props**: 3
  - `children` (ReactNode), `key` (string | number), `ref` (RefObject | RefCallback)

- **Transform Modes**: 2
  - Classic: `React.createElement()` calls
  - Automatic: `jsx()` runtime (React 17+)

- **Babel JSX Options**: 7
  - `pragma`, `pragmaFrag`, `throwIfNamespace`, `useBuiltIns`, `useSpread`, `runtime`, `importSource`

- **TypeScript JSX Modes**: 5
  - `preserve`, `react`, `react-native`, `react-jsx`, `react-jsxdev`

- **Common Patterns**: 4 categories
  - Conditional rendering (ternary, logical AND, logical OR, nullish coalescing)
  - List rendering (map, filter)
  - Prop spreading
  - Children patterns (render props, cloneElement)

- **Escaping**: 10+ HTML entities
  - ``, ``, ``, ``, ``, `&#x...;`, `&#...;`
  - JavaScript escaping: `\'`, `\"`, `\\`, `\n`, `\t`

**Source Mapping**:
- ANTLR JSX Grammar: `javascript/jsx/*.g4`
- React JSX Documentation
- Babel JSX Plugin: `packages/babel-plugin-transform-react-jsx`

##  Statistics

```javascript
import { GRAMMAR_STATS } from './index.js';

console.log(GRAMMAR_STATS);
// {
//   javascript: { keywords: 70, literals: 4, binaryOperators: 30, ... },
//   typescript: { typeKeywords: 12, modifiers: 11, ... },
//   java: { keywords: 65, primitiveTypes: 8, ... },
//   jsx: { elements: 6, expressions: 4, attributes: 20, ... }
// }
```

##  Validation

All grammar data is validated for completeness:

```javascript
import { validateGrammarCompleteness } from './index.js';

const validation = validateGrammarCompleteness();
console.log(validation);
// { results: {...}, allValid: true }
```

##  Usage

### Basic Usage

```javascript
// Import specific grammar
import { JAVASCRIPT_GRAMMAR } from './grammars/javascript.grammar.js';

// Check if 'const' is a keyword
console.log(JAVASCRIPT_GRAMMAR.keywords.const);
// {
//   category: 'declaration',
//   esVersion: 'ES6',
//   source: 'ECMA-262',
//   followedBy: ['IDENTIFIER'],
//   notes: 'Block-scoped. Must be initialized. Cannot be reassigned.',
//   commonTypos: ['cosnt', 'ocnst', 'cnst']
// }

// Get operator precedence and associativity
console.log(JAVASCRIPT_GRAMMAR.operators.binaryOperators['**']);
// {
//   precedence: 11,
//   category: 'exponential',
//   source: 'ECMA-262',
//   esVersion: 'ES7',
//   associativity: 'right',
//   isInfix: true,
//   notes: 'Right-associative: 2 ** 3 ** 2 equals 2 ** (3 ** 2) = 512'
// }

// Check disambiguation rules
console.log(JAVASCRIPT_GRAMMAR.operators.binaryOperators['<'].disambiguation);
// [
//   { ifPrecededBy: ['IDENTIFIER'], then: 'GENERIC_START', language: 'TypeScript' },
//   { ifPrecededBy: ['KEYWORD_RETURN'], then: 'JSX_TAG_START', language: 'JSX' },
//   { default: 'OPERATOR_LESS_THAN' }
// ]
```

### Advanced Usage (Parser Integration)

```javascript
import { JAVASCRIPT_GRAMMAR } from './grammars/javascript.grammar.js';

// Validate token context
function validateToken(token, contextStack) {
  const grammar = JAVASCRIPT_GRAMMAR.keywords[token.value];
  
  if (grammar?.parentContext) {
    const currentContext = contextStack[contextStack.length - 1];
    if (!grammar.parentContext.includes(currentContext)) {
      throw new SyntaxError(grammar.errorMessage);
    }
  }
}

// Suggest typo correction
function suggestCorrection(invalidToken) {
  for (const [keyword, data] of Object.entries(JAVASCRIPT_GRAMMAR.keywords)) {
    if (data.commonTypos?.includes(invalidToken.value)) {
      throw new SyntaxError(
        `Did you mean '${keyword}'? (found '${invalidToken.value}')`
      );
    }
  }
}

// Disambiguate tokens
function disambiguate(token, prevToken, nextToken, language) {
  const operator = JAVASCRIPT_GRAMMAR.operators.binaryOperators[token.value];
  
  for (const rule of operator.disambiguation || []) {
    if (rule.language && rule.language !== language) continue;
    if (rule.ifPrecededBy && !rule.ifPrecededBy.includes(prevToken.type)) continue;
    if (rule.ifFollowedBy && !rule.ifFollowedBy.includes(nextToken.type)) continue;
    return rule.then;
  }
}

// Calculate operator binding power (Pratt Parser)
function bindingPower(operator) {
  const op = JAVASCRIPT_GRAMMAR.operators.binaryOperators[operator];
  const base = op.precedence * 10;
  
  if (op.associativity === 'left') {
    return [base, base + 1]; // [left, right]
  } else {
    return [base, base - 1]; // right-associative
  }
}
```

### Import All Grammars

```javascript
import { COMPLETE_GRAMMAR } from './grammars/index.js';

console.log(COMPLETE_GRAMMAR.typescript.typeKeywords.never);
// { category: 'type', source: 'TypeScript', tsVersion: '2.0' }

console.log(COMPLETE_GRAMMAR.java.keywords.record);
// { category: 'declaration', source: 'ANTLR', javaVersion: 'SE16' }

console.log(COMPLETE_GRAMMAR.jsx.specialProps.key);
// { type: 'string | number', description: 'Unique identifier for list items', required: 'in lists' }
```

##  Data Structure

Each vocabulary item includes rich metadata:

### Core Properties
- **category**: Token category (e.g., 'control', 'operator', 'type')
- **source**: Authoritative source (e.g., 'ECMA-262', 'Babel', 'TypeScript')
- **version**: Language version (e.g., 'ES6', 'TS 4.3', 'SE8')

### Syntactic Properties
- **followedBy**: Token types that should follow
- **precededBy**: Token types that should precede
- **parentContext**: Valid contexts for this token
- **startsExpr**: Can start an expression
- **beforeExpr**: Can appear before an expression

### Operator Properties
- **precedence**: Operator precedence (0-11)
- **associativity**: Left or right associative
- **isInfix**: Infix operator (a + b)
- **isPrefix**: Prefix operator (+a)
- **isPostfix**: Postfix operator (x++)
- **isAssign**: Assignment operator

### Disambiguation
- **disambiguation**: Array of rules for multi-meaning tokens
  - `ifPrecededBy`: Condition on previous token
  - `ifFollowedBy`: Condition on next token
  - `then`: Resulting interpretation
  - `language`: Language constraint (JavaScript/TypeScript/JSX/Java)

### Error Reporting
- **errorMessage**: User-friendly error description
- **commonTypos**: Array of common misspellings
- **notes**: Usage notes and additional context
- **quirks**: Special behaviors and edge cases

### Feature Status
- **contextual**: Contextual keyword (only keyword in specific contexts)
- **deprecated**: Deprecated feature
- **stage**: TC39 proposal stage (0-4)
- **experimental**: Experimental feature

##  TypeScript Support

Complete TypeScript type definitions included:

```typescript
import type { 
  JavaScriptGrammar, 
  KeywordDefinition,
  OperatorDefinition,
  DisambiguationRule 
} from './grammars/index.d.ts';

// Fully typed grammar access
const grammar: JavaScriptGrammar = JAVASCRIPT_GRAMMAR;

// Type-safe disambiguation
function disambiguate(
  token: string,
  rules: DisambiguationRule[]
): string {
  // Implementation
}
```

##  Credits

All data compiled from official specifications, real-world parser/compiler implementations, and community-validated grammars:

- **ECMAScript TC39 Committee** - ECMAScript Language Specification
- **Babel Team** - Babel Parser implementation
- **TypeScript Team (Microsoft)** - TypeScript Compiler implementation
- **ANTLR Community** - Grammar definitions
- **React Team (Meta)** - JSX specification and documentation

**NO IMAGINED OR MADE-UP DATA** - Every token, keyword, and operator is sourced from real authoritative references.

##  License

Grammar data compiled from public specifications and open-source projects. See individual source licenses:
- ECMAScript Specification: Ecma International (public)
- Babel: MIT License
- TypeScript: Apache License 2.0
- ANTLR Grammars: Various (see repository)
- React: MIT License
