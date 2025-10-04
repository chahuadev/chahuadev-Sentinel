# Parser Directives Guide

คู่มือการใช้งาน Grammar Dictionary สำหรับ Parser Implementation

##  Table of Contents

1. [Syntactic Relationships](#syntactic-relationships)
2. [Parser Directives](#parser-directives)
3. [Disambiguation Rules](#disambiguation-rules)
4. [Error Reporting](#error-reporting)
5. [Edge Cases & Quirks](#edge-cases--quirks)

---

## 1. Syntactic Relationships

Grammar Dictionary มีข้อมูลความสัมพันธ์ทางไวยากรณ์ที่ Parser สามารถใช้ตรวจสอบ syntax ได้

### Properties

#### `followedBy` - Token ที่ควรตามหลัง
```javascript
'if': {
  followedBy: ['PAREN_OPEN'],
  // Parser ต้องคาดหวัง '(' หลัง 'if'
}
```

**การใช้งาน**:
```javascript
function parseIfStatement(token) {
  if (token.value === 'if') {
    const expectedTokens = grammar.keywords['if'].followedBy;
    const nextToken = lexer.peek();
    
    if (!expectedTokens.includes(nextToken.type)) {
      throw new SyntaxError(
        `Expected ${expectedTokens.join(' or ')} after 'if', but got ${nextToken.type}`
      );
    }
  }
}
```

#### `precededBy` - Token ที่ควรอยู่ข้างหน้า
```javascript
'else': {
  precededBy: ['BRACE_CLOSE', 'Statement'],
  // 'else' ต้องมาหลัง '}' หรือ statement
}
```

#### `parentContext` - Context ที่ยอมให้มี token นี้
```javascript
'break': {
  parentContext: ['IterationStatement', 'SwitchStatement', 'LabeledStatement'],
  // 'break' ใช้ได้เฉพาะใน loop, switch, หรือ labeled statement
}
```

**การใช้งาน**:
```javascript
function validateBreakStatement(token, contextStack) {
  const allowedContexts = grammar.keywords['break'].parentContext;
  const currentContext = contextStack[contextStack.length - 1];
  
  if (!allowedContexts.includes(currentContext)) {
    throw new SyntaxError(
      grammar.keywords['break'].errorMessage
    );
  }
}
```

---

## 2. Parser Directives

คำสั่งที่บอก Parser วิธีประมวลผล operators และ expressions

### Operator Properties

#### `associativity` - ทิศทางการคำนวณ
```javascript
'||': {
  precedence: 1,
  associativity: 'left',  // ซ้ายไปขวา: a || b || c = (a || b) || c
}

'**': {
  precedence: 11,
  associativity: 'right', // ขวาไปซ้าย: 2 ** 3 ** 2 = 2 ** (3 ** 2)
}
```

**การใช้งาน (Pratt Parser)**:
```javascript
function infixBindingPower(operator) {
  const op = grammar.operators.binaryOperators[operator];
  const basePower = op.precedence * 10;
  
  if (op.associativity === 'left') {
    return [basePower, basePower + 1]; // [left, right]
  } else {
    return [basePower, basePower - 1]; // right-associative
  }
}
```

#### `isInfix` / `isPrefix` / `isPostfix` - ตำแหน่งของ operator
```javascript
'+': {
  isInfix: true,   // a + b
  isPrefix: true,  // +a
}

'++': {
  isPrefix: true,  // ++x
  isPostfix: true, // x++
}
```

**การใช้งาน**:
```javascript
function parseExpression(minPrecedence) {
  let left;
  const token = lexer.current();
  
  // Check prefix operator
  if (grammar.unaryOperators[token.value]?.isPrefix) {
    const operator = token.value;
    lexer.advance();
    const operand = parseExpression(UNARY_PRECEDENCE);
    left = { type: 'UnaryExpression', operator, operand };
  } else {
    left = parsePrimaryExpression();
  }
  
  // Check postfix operator
  if (grammar.unaryOperators[lexer.peek().value]?.isPostfix) {
    const operator = lexer.peek().value;
    lexer.advance();
    left = { type: 'UpdateExpression', operator, argument: left };
  }
  
  return left;
}
```

#### `isAssign` - เป็น assignment operator
```javascript
'=': {
  isAssign: true,
  // บอก Parser ว่า left-hand side ต้องเป็น valid assignment target
}
```

---

## 3. Disambiguation Rules

กฎสำหรับแก้ความกำกวมของ tokens ที่มีความหมายหลายแบบ

### `disambiguation` Property

```javascript
'<': {
  disambiguation: [
    // Rule 1: TypeScript Generic
    { 
      ifPrecededBy: ['IDENTIFIER'],
      ifFollowedBy: ['IDENTIFIER'],
      ifNotPrecededBy: ['OPERATOR_RETURN'],
      then: 'GENERIC_START',
      language: 'TypeScript'
    },
    // Rule 2: JSX Opening Tag
    { 
      ifPrecededBy: ['KEYWORD_RETURN', 'PAREN_OPEN'],
      ifFollowedBy: ['IDENTIFIER'],
      then: 'JSX_TAG_START',
      language: 'JSX'
    },
    // Rule 3 (Default): Comparison Operator
    { 
      default: 'OPERATOR_LESS_THAN'
    }
  ]
}
```

### การใช้งาน Disambiguation

```javascript
function disambiguateToken(token, prevToken, nextToken, language) {
  const rules = grammar.operators.binaryOperators[token.value]?.disambiguation;
  
  if (!rules) return token.type; // No disambiguation needed
  
  for (const rule of rules) {
    // Check default rule
    if (rule.default) {
      return rule.default;
    }
    
    // Check language constraint
    if (rule.language && rule.language !== language) {
      continue;
    }
    
    // Check precededBy condition
    if (rule.ifPrecededBy && !rule.ifPrecededBy.includes(prevToken.type)) {
      continue;
    }
    
    // Check followedBy condition
    if (rule.ifFollowedBy && !rule.ifFollowedBy.includes(nextToken.type)) {
      continue;
    }
    
    // Check ifNotPrecededBy condition
    if (rule.ifNotPrecededBy && rule.ifNotPrecededBy.includes(prevToken.type)) {
      continue;
    }
    
    // All conditions matched
    return rule.then;
  }
  
  return token.type; // Fallback
}
```

### ตัวอย่างการใช้งาน

```javascript
// Case 1: TypeScript Generic
// Array<string>
//      ^ '<' ถูก disambiguate เป็น GENERIC_START

// Case 2: JSX Tag
// return <Component />
//        ^ '<' ถูก disambiguate เป็น JSX_TAG_START

// Case 3: Comparison
// if (x < 5)
//       ^ '<' ถูก disambiguate เป็น OPERATOR_LESS_THAN
```

---

## 4. Error Reporting

ข้อมูลสำหรับแจ้งข้อผิดพลาดที่เป็นมิตรกับผู้ใช้

### Properties for Error Reporting

#### `errorMessage` - ข้อความแจ้งข้อผิดพลาด
```javascript
'if': {
  errorMessage: "An 'if' statement must be followed by a condition in parentheses '(condition)'."
}
```

**การใช้งาน**:
```javascript
function throwSyntaxError(token, expectedType) {
  const errorMsg = grammar.keywords[token.value]?.errorMessage;
  
  throw new SyntaxError(
    errorMsg || `Unexpected token ${token.value}`
  );
}
```

#### `commonTypos` - คำที่มักพิมพ์ผิด
```javascript
'function': {
  commonTypos: ['functoin', 'fucntion', 'funciton', 'fuctnion', 'functino']
}
```

**การใช้งาน**:
```javascript
function suggestCorrection(invalidToken) {
  for (const [keyword, data] of Object.entries(grammar.keywords)) {
    if (data.commonTypos?.includes(invalidToken.value)) {
      throw new SyntaxError(
        `Unexpected token '${invalidToken.value}'. Did you mean '${keyword}'?`
      );
    }
  }
}
```

#### `notes` - หมายเหตุเพิ่มเติม
```javascript
'await': {
  notes: 'Pauses async function execution until promise resolves.',
  errorMessage: "'await' can only be used in async functions or at the top level of modules."
}
```

**การใช้งาน (Enhanced Error)**:
```javascript
function validateAwaitUsage(token, context) {
  const allowedContexts = grammar.keywords['await'].parentContext;
  
  if (!allowedContexts.includes(context)) {
    const notes = grammar.keywords['await'].notes;
    const error = grammar.keywords['await'].errorMessage;
    
    throw new SyntaxError(`${error}\n\nNote: ${notes}`);
  }
}
```

---

## 5. Edge Cases & Quirks

ข้อมูลเกี่ยวกับพฤติกรรมพิเศษและข้อควรระวัง

### Properties

#### `quirks` - พฤติกรรมแปลกๆ หรือข้อควรระวัง
```javascript
'delete': {
  quirks: 'Cannot delete variables or functions. Strict mode throws errors.'
}

';': {
  quirks: 'ASI can lead to unexpected behavior. Recommended to always use semicolons.'
}
```

#### `notes` - หมายเหตุเพิ่มเติม
```javascript
'var': {
  notes: 'Function-scoped or globally-scoped. Subject to hoisting.'
}

'const': {
  notes: 'Block-scoped. Must be initialized. Cannot be reassigned.'
}

'let': {
  notes: 'Block-scoped. Cannot be re-declared in same scope. Subject to TDZ (Temporal Dead Zone).'
}
```

#### `deprecated` - ฟีเจอร์ที่ไม่แนะนำให้ใช้
```javascript
'with': {
  deprecated: true,
  notes: 'Deprecated in strict mode. Creates ambiguous scope.'
}
```

#### `stage` - สถานะของ Proposal (สำหรับฟีเจอร์ใหม่)
```javascript
'|>': {
  stage: 2,
  notes: 'Experimental feature. Syntax may change.'
}
```

**การใช้งาน (Warnings)**:
```javascript
function checkDeprecatedFeature(token) {
  const data = grammar.keywords[token.value];
  
  if (data?.deprecated) {
    console.warn(
      `Warning: '${token.value}' is deprecated. ${data.notes}`
    );
  }
  
  if (data?.stage !== undefined) {
    console.warn(
      `Warning: '${token.value}' is a Stage ${data.stage} proposal. ${data.notes}`
    );
  }
}
```

---

##  Complete Example: Building a Simple Parser

```javascript
import { JAVASCRIPT_GRAMMAR } from './grammars/javascript.grammar.js';

class SimpleParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
    this.contextStack = ['Program'];
  }
  
  // Check if token follows grammar rules
  validateToken(token) {
    const grammar = JAVASCRIPT_GRAMMAR.keywords[token.value];
    
    if (!grammar) return true;
    
    // Check parent context
    if (grammar.parentContext) {
      const currentContext = this.contextStack[this.contextStack.length - 1];
      if (!grammar.parentContext.includes(currentContext)) {
        throw new SyntaxError(grammar.errorMessage);
      }
    }
    
    // Check followedBy
    if (grammar.followedBy) {
      const nextToken = this.peek();
      if (!grammar.followedBy.includes(nextToken.type)) {
        throw new SyntaxError(grammar.errorMessage);
      }
    }
    
    return true;
  }
  
  // Disambiguate token based on context
  disambiguate(token) {
    const prev = this.tokens[this.position - 1];
    const next = this.peek();
    const operator = JAVASCRIPT_GRAMMAR.operators.binaryOperators[token.value];
    
    if (!operator?.disambiguation) return token.type;
    
    for (const rule of operator.disambiguation) {
      if (rule.default) return rule.default;
      
      if (rule.ifPrecededBy && !rule.ifPrecededBy.includes(prev?.type)) {
        continue;
      }
      
      if (rule.ifFollowedBy && !rule.ifFollowedBy.includes(next?.type)) {
        continue;
      }
      
      return rule.then;
    }
    
    return token.type;
  }
  
  // Suggest correction for typos
  suggestCorrection(invalidToken) {
    for (const [keyword, data] of Object.entries(JAVASCRIPT_GRAMMAR.keywords)) {
      if (data.commonTypos?.includes(invalidToken.value)) {
        throw new SyntaxError(
          `Unexpected token '${invalidToken.value}'. Did you mean '${keyword}'?`
        );
      }
    }
  }
  
  peek() {
    return this.tokens[this.position + 1];
  }
  
  current() {
    return this.tokens[this.position];
  }
  
  advance() {
    this.position++;
  }
}
```

---

##  Benefits

1. **ลด Hardcoding**: Parser ไม่ต้อง hardcode กฎไวยากรณ์
2. **แจ้งข้อผิดพลาดที่ดีขึ้น**: ข้อความ error ที่เป็นมิตร + แนะนำการแก้ไข
3. **รองรับหลายภาษา**: Disambiguation rules รองรับ TypeScript, JSX, Java
4. **Extensible**: เพิ่มกฎใหม่ได้ง่ายโดยไม่แก้ Parser
5. **Type-safe**: ข้อมูล Grammar สามารถ export เป็น TypeScript types ได้

---

##  References

- **ECMAScript 2026 Specification**: https://tc39.es/ecma262/
- **Babel Parser**: https://github.com/babel/babel
- **TypeScript Compiler**: https://github.com/microsoft/TypeScript
- **ANTLR Grammars**: https://github.com/antlr/grammars-v4
- **Pratt Parsing**: https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/

---

**Created**: October 4, 2025  
**Grammar Version**: 1.0.0  
**Coverage**: JavaScript ES1-ES2024, TypeScript 1.0-5.x, Java SE8-SE21, JSX/React 18+
