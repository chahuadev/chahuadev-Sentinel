# In-Memory Search System - Usage Guide

## Overview

Grammar Index System ที่ออกแบบมาสำหรับประสิทธิภาพสูงสุด โดยใช้โครงสร้างข้อมูลที่เหมาะสมกับการใช้งานแต่ละประเภท:

### Data Structures

| โครงสร้าง | Complexity | การใช้งาน |
|----------|-----------|----------|
| **Map** | O(1) | Keyword/Operator lookup |
| **Set** | O(1) | Membership check (isKeyword, isReserved) |
| **Trie** | O(m) | Longest match tokenization |
| **Levenshtein Distance** | O(m×n) | Fuzzy search, typo suggestions |

---

## Quick Start

```javascript
import { 
  GrammarIndex,
  JAVASCRIPT_GRAMMAR 
} from '@chahuadev/scanner';

// Build index (one-time cost)
const index = new GrammarIndex(JAVASCRIPT_GRAMMAR);

// O(1) keyword check
console.log(index.isKeyword('const')); // true
console.log(index.isReservedWord('await')); // true

// O(1) keyword lookup
const constData = index.getKeyword('const');
console.log(constData.category); // 'declaration'
console.log(constData.esVersion); // 'ES6'

// O(m) longest operator match (CORE FEATURE)
const match = index.findLongestOperator('!== 10', 0);
console.log(match.operator); // '!=='
console.log(match.length);   // 3

// Typo suggestions
const suggestions = index.suggestKeyword('functoin', 3);
console.log(suggestions[0].keyword); // 'function'
console.log(suggestions[0].distance); // 2
```

---

## Core Features

### 1. Fast Keyword Lookup (O(1))

```javascript
// Check if word is keyword
if (index.isKeyword('const')) {
  const data = index.getKeyword('const');
  console.log(data);
  // {
  //   category: 'declaration',
  //   esVersion: 'ES6',
  //   description: 'Block-scoped variable declaration',
  //   startsExpr: false,
  //   beforeExpr: false,
  //   ...
  // }
}

// Check specific keyword types
index.isReservedWord('await');      // true
index.isContextualKeyword('async'); // true
index.isDeprecated('with');         // true
```

### 2. Longest Match Tokenization (O(m))

**Problem**: Multi-character operators need longest match

```javascript
// Input: "!==" at position 0
// Should match: "!==" not "!=" or "!"

// OLD METHOD (Loop through all operators)
// Try 3-char: ['===', '!==', '>>>'] - O(n)
// Try 2-char: ['==', '!=', '>=', ...] - O(n)
// Try 1-char: ['+', '-', '*', ...] - O(n)

// NEW METHOD (Trie)
const match = index.findLongestOperator('!==', 0);
// - Walks: "!" (found)  "!=" (found)  "!==" (found)
// - Returns: "!==" (longest)
// - Complexity: O(3) = O(m) where m = operator length
```

**Real Example**:

```javascript
const operators = [
  { input: '!== 10', position: 0, expected: '!==' },
  { input: '!= 10',  position: 0, expected: '!='  },
  { input: '! true', position: 0, expected: '!'   },
  { input: '...rest', position: 0, expected: '...' },
  { input: 'x++',    position: 1, expected: '++'  }
];

for (const test of operators) {
  const match = index.findLongestOperator(test.input, test.position);
  console.log(` ${match.operator === test.expected}`);
}
```

**Performance**:
- Trie: 5-10x faster than loop method
- Constant time for most operators ( 3 characters)
- No sorting needed

### 3. Typo Suggestions (Levenshtein Distance)

```javascript
// Find closest match
const closest = index.findClosestKeyword('functoin', 3);
console.log(closest);
// {
//   keyword: 'function',
//   distance: 2,      // Edit distance (Damerau-Levenshtein)
//   similarity: 0.75, // Similarity ratio (0-1)
//   data: { ... }
// }

// Get multiple suggestions
const suggestions = index.suggestKeyword('improt', 3);
// [
//   { keyword: 'import', distance: 1, similarity: 0.83 },
//   { keyword: 'export', distance: 3, similarity: 0.50 }
// ]

// Error messages
if (!index.isKeyword(userInput)) {
  const closest = index.findClosestKeyword(userInput, 2);
  if (closest) {
    throw new Error(
      `Unknown keyword "${userInput}". Did you mean "${closest.keyword}"?`
    );
  }
}
```

**Common Typos**:
| Typo | Suggestion | Distance |
|------|-----------|----------|
| functoin | function | 2 |
| cosnt | const | 1 |
| reutrn | return | 2 |
| improt | import | 1 |
| awiat | await | 2 |
| aysnc | async | 2 |

### 4. Prefix Search (Autocomplete)

```javascript
// Find all keywords starting with prefix
const matches = index.findKeywordsByPrefix('con');
// [
//   { keyword: 'const', data: { ... } },
//   { keyword: 'continue', data: { ... } },
//   { keyword: 'constructor', data: { ... } }
// ]

// IDE autocomplete
function autocomplete(prefix) {
  return index.findKeywordsByPrefix(prefix)
    .map(m => ({
      label: m.keyword,
      kind: 'keyword',
      detail: m.data.description,
      documentation: m.data.notes
    }));
}
```

### 5. Category & Version Queries

```javascript
// Get all control flow keywords
const control = index.getKeywordsByCategory('control');
// ['if', 'else', 'switch', 'case', ...]

// Get all ES6 features
const es6 = index.getKeywordsByVersion('ES6');
// ['const', 'let', 'class', 'import', 'export', ...]

// List all categories
const categories = index.getAllCategories();
// ['declaration', 'control', 'iteration', 'exception', ...]

// List all versions
const versions = index.getAllVersions();
// ['ES1', 'ES3', 'ES5', 'ES6', 'ES2020', ...]
```

---

## Tokenizer Integration

### Basic Tokenizer

```javascript
import { GrammarIndex } from '@chahuadev/scanner';

class Tokenizer {
  constructor(grammar) {
    this.index = new GrammarIndex(grammar);
  }
  
  tokenize(input) {
    const tokens = [];
    let position = 0;
    
    while (position < input.length) {
      // Skip whitespace
      if (/\s/.test(input[position])) {
        position++;
        continue;
      }
      
      // 1. Try operator (FAST: O(m))
      const opMatch = this.index.findLongestOperator(input, position);
      if (opMatch) {
        tokens.push({
          type: 'operator',
          value: opMatch.operator,
          start: position,
          end: position + opMatch.length,
          precedence: opMatch.data.precedence,
          associativity: opMatch.data.associativity
        });
        position += opMatch.length;
        continue;
      }
      
      // 2. Try punctuation
      const punctMatch = this.index.findLongestPunctuation(input, position);
      if (punctMatch) {
        tokens.push({
          type: 'punctuation',
          value: punctMatch.punctuation,
          start: position,
          end: position + punctMatch.length
        });
        position += punctMatch.length;
        continue;
      }
      
      // 3. Try identifier/keyword
      if (/[a-zA-Z_$]/.test(input[position])) {
        const identifier = this.readIdentifier(input, position);
        
        // Fast keyword check: O(1)
        if (this.index.isKeyword(identifier)) {
          const keywordData = this.index.getKeyword(identifier);
          
          tokens.push({
            type: 'keyword',
            value: identifier,
            start: position,
            end: position + identifier.length,
            category: keywordData.category,
            startsExpr: keywordData.startsExpr,
            beforeExpr: keywordData.beforeExpr
          });
        } else {
          // Check for typos
          const closest = this.index.findClosestKeyword(identifier, 2);
          if (closest && closest.distance <= 1) {
            console.warn(
              `Possible typo: "${identifier}" - Did you mean "${closest.keyword}"?`
            );
          }
          
          tokens.push({
            type: 'identifier',
            value: identifier,
            start: position,
            end: position + identifier.length
          });
        }
        
        position += identifier.length;
        continue;
      }
      
      throw new Error(`Unexpected character: ${input[position]}`);
    }
    
    return tokens;
  }
  
  readIdentifier(input, position) {
    let end = position;
    while (end < input.length && /[a-zA-Z0-9_$]/.test(input[end])) {
      end++;
    }
    return input.slice(position, end);
  }
}
```

### Parser Integration

```javascript
import { GrammarIndex, ParserIntegration } from '@chahuadev/scanner';

class Parser {
  constructor(grammar) {
    this.integration = new ParserIntegration(grammar);
  }
  
  parseExpression(tokens) {
    // Check if identifier can start expression
    if (this.integration.canStartExpression(token.value)) {
      // Parse as expression start
    }
    
    // Get operator precedence
    const precedence = this.integration.getOperatorPrecedence('+');
    
    // Get operator associativity
    const assoc = this.integration.getOperatorAssociativity('**');
    // 'right' (exponentiation is right-associative)
    
    // Check if operator is assignment
    if (this.integration.isAssignmentOperator('+=')) {
      // Handle assignment
    }
    
    // Validate keyword in context
    const validation = this.integration.validateKeywordInContext('await', 'async-function');
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }
}
```

---

## Performance

### Benchmarks

Run benchmarks:

```javascript
import { runAllBenchmarks, JAVASCRIPT_GRAMMAR } from '@chahuadev/scanner';

const results = runAllBenchmarks(JAVASCRIPT_GRAMMAR);
```

**Expected Results**:

| Benchmark | Result |
|-----------|--------|
| Index Building | ~5-10ms |
| Map vs Object Lookup | 1.2-1.5x faster (Map) |
| Trie vs Loop (Longest Match) | 5-10x faster (Trie) |
| Fuzzy Search | ~0.5ms per query |
| Memory Usage | ~2-5 MB |
| Tokenizer | ~0.1ms per file |

### Complexity Analysis

| Operation | Old Method | New Method | Speedup |
|-----------|-----------|-----------|---------|
| Keyword lookup | O(n) loop | O(1) Map | n/1 |
| Longest operator | O(n) loop | O(m) Trie | n/m |
| Existence check | O(n) loop | O(1) Set | n/1 |
| Prefix search | O(n) filter | O(m+k) Trie | n/(m+k) |

Where:
- n = total number of keywords/operators
- m = length of word/operator
- k = number of matching results

---

## Statistics

```javascript
const stats = index.getStats();
console.log(stats);
```

**Output**:
```json
{
  "keywords": {
    "total": 73,
    "reserved": 37,
    "contextual": 12,
    "deprecated": 2
  },
  "operators": {
    "total": 56,
    "trieSize": 56,
    "trieStats": {
      "nodeCount": 98,
      "wordCount": 56,
      "maxDepth": 3
    }
  },
  "punctuation": {
    "total": 14,
    "trieSize": 14
  },
  "literals": {
    "total": 4
  },
  "categories": 8,
  "versions": 15
}
```

---

## Debugging

### Visualize Trie Structure

```javascript
const tries = index.visualizeTries();
console.log('Operators Trie:');
console.log(tries.operators);
```

**Output**:
```
Operators Trie:
└── ! (2)
    ├── = (2)
    │   └── = (end) [!==]
    └── (end) [!]
└── = (3)
    ├── = (2)
    │   └── = (end) [===]
    └── (end) [=]
└── + (2)
    ├── + (end) [++]
    └── = (end) [+=]
```

---

## Advanced Usage

### Multi-Language Support

```javascript
import { GrammarIndex, JAVASCRIPT_GRAMMAR, TYPESCRIPT_GRAMMAR } from '@chahuadev/scanner';

// Switch between languages
const jsIndex = new GrammarIndex(JAVASCRIPT_GRAMMAR);
const tsIndex = new GrammarIndex(TYPESCRIPT_GRAMMAR);

// Detect language
function detectLanguage(code) {
  // Check TypeScript-specific keywords
  if (tsIndex.isKeyword('interface') || tsIndex.isKeyword('type')) {
    return 'typescript';
  }
  return 'javascript';
}
```

### Custom Error Messages

```javascript
class SmartTokenizer extends Tokenizer {
  handleUnknownKeyword(identifier) {
    const suggestions = this.index.suggestKeyword(identifier, 3);
    
    if (suggestions.length > 0) {
      const top = suggestions[0];
      
      // Very close match (distance 1)
      if (top.distance === 1) {
        throw new SyntaxError(
          `Unexpected identifier "${identifier}". Did you mean "${top.keyword}"?`
        );
      }
      
      // Multiple suggestions
      const list = suggestions.slice(0, 3).map(s => s.keyword).join('", "');
      throw new SyntaxError(
        `Unexpected identifier "${identifier}". Did you mean one of: "${list}"?`
      );
    }
    
    // No suggestions
    throw new SyntaxError(`Unexpected identifier "${identifier}"`);
  }
}
```

### IDE Integration

```javascript
// Language Server Protocol
class LanguageServer {
  constructor(grammar) {
    this.index = new GrammarIndex(grammar);
  }
  
  // Autocomplete
  provideCompletionItems(prefix) {
    return this.index.findKeywordsByPrefix(prefix)
      .map(m => ({
        label: m.keyword,
        kind: CompletionItemKind.Keyword,
        detail: m.data.description,
        documentation: m.data.notes,
        deprecated: m.data.deprecated
      }));
  }
  
  // Hover information
  provideHover(word) {
    const data = this.index.getKeyword(word);
    if (!data) return null;
    
    return {
      contents: [
        `**${word}** (${data.category})`,
        data.description,
        `Introduced in: ${data.esVersion}`,
        data.notes ? `\n${data.notes}` : ''
      ].join('\n')
    };
  }
  
  // Diagnostics
  provideDiagnostics(document) {
    const diagnostics = [];
    const tokens = this.tokenize(document.text);
    
    for (const token of tokens) {
      if (token.type === 'identifier') {
        const closest = this.index.findClosestKeyword(token.value, 2);
        
        if (closest && closest.distance === 1) {
          diagnostics.push({
            severity: DiagnosticSeverity.Warning,
            range: token.range,
            message: `Did you mean "${closest.keyword}"?`,
            source: 'grammar-checker'
          });
        }
      }
      
      if (token.type === 'keyword') {
        const data = this.index.getKeyword(token.value);
        
        if (data.deprecated) {
          diagnostics.push({
            severity: DiagnosticSeverity.Warning,
            range: token.range,
            message: `"${token.value}" is deprecated. ${data.deprecationMessage}`,
            source: 'grammar-checker',
            tags: [DiagnosticTag.Deprecated]
          });
        }
      }
    }
    
    return diagnostics;
  }
}
```

---

## Best Practices

### 1. Build Index Once

```javascript
//  BAD: Build index for every file
function tokenizeFile(file) {
  const index = new GrammarIndex(JAVASCRIPT_GRAMMAR); // Slow!
  // ...
}

//  GOOD: Build once, reuse
const globalIndex = new GrammarIndex(JAVASCRIPT_GRAMMAR);

function tokenizeFile(file) {
  // Use globalIndex
}
```

### 2. Use Appropriate Data Structure

```javascript
//  BAD: Loop for existence check
function isKeyword(word) {
  return keywords.includes(word); // O(n)
}

//  GOOD: Use Set
function isKeyword(word) {
  return index.isKeyword(word); // O(1)
}

//  BAD: Loop for longest match
function findOperator(input, pos) {
  for (const op of operators.sort((a, b) => b.length - a.length)) {
    if (input.startsWith(op, pos)) return op;
  }
}

//  GOOD: Use Trie
function findOperator(input, pos) {
  return index.findLongestOperator(input, pos); // O(m)
}
```

### 3. Typo Threshold

```javascript
// Set reasonable distance threshold
const suggestions = index.suggestKeyword(typo, 3);

// Filter by similarity ratio
const goodSuggestions = suggestions.filter(s => s.similarity > 0.6);

// Only suggest if very close
const closest = index.findClosestKeyword(typo, 2);
if (closest && closest.distance <= 1) {
  // High confidence suggestion
}
```

---

## API Reference

See [API_REFERENCE.md](./API_REFERENCE.md) for complete API documentation.

---

## Performance Tips

1. **Build index once** - ~5-10ms per grammar
2. **Use longest match for operators** - 5-10x faster than loop
3. **Use Map for lookups** - 1.2-1.5x faster than Object
4. **Cache suggestions** - Fuzzy search is expensive
5. **Limit maxDistance** - Lower distance = faster search

---

## Examples

See [tokenizer-helper.js](./shared/tokenizer-helper.js) for complete working examples.

---

## License

MIT
