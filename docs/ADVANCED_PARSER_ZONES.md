#  Advanced Structure Parser - คู่มือโซนการทำงาน

##  สรุปภาพรวม

**AdvancedStructureParser** เป็น parser ที่เราสร้างขึ้นเองเพื่อแปลง JavaScript tokens  AST (Abstract Syntax Tree) โดยไม่ต้องพึ่ง Babel หรือ Acorn

**ไฟล์:** `src/grammars/shared/smart-parser-engine.js`  
**บรรทัด:** 221-870 (รวม 14 โซนหลัก)

---

##  แผนที่โซนทั้งหมด (14 โซน)

```
┌─────────────────────────────────────────────────────────────────┐
│  โซนที่ 1: CLASS DEFINITION (221-236)                           │
│  ╰ สร้างคลาสและ AST root node                                  │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 2: MAIN ENTRY POINT - parse() (238-260)                │
│  ╰ วน loop อ่าน tokens ทีละตัว  สร้าง AST                    │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 3: STATEMENT ROUTER (262-286)                           │
│  ╰ ตัดสินใจว่า statement ประเภทไหน (function, class, var)     │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 4: FUNCTION PARSER (288-306)                            │
│  ╰ แปลง function declaration  FunctionDeclaration node        │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 5: VARIABLE PARSER (308-336)                            │
│  ╰ แปลง const/let/var  VariableDeclaration node              │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 6: EXPRESSION PARSERS (338-375)                         │
│  ╰ จัดการ assignment (=) และ logical (&&, ||) expressions     │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 7: HELPER METHODS (378-424)                             │
│  ╰ peek, advance, match, consume - เครื่องมือพื้นฐาน          │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 8: PARAMETER & BLOCK (426-457)                          │
│  ╰ อ่าน (params) และ {...} block statements                   │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 9: EXPRESSION STATEMENT (459-473)                       │
│  ╰ แปลง expression statements (foo(); x=5;)                   │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 10: EQUALITY & COMPARISON (576-622)                     │
│  ╰ จัดการ ==, !=, <, >, +, - operators                        │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 11: MULTIPLICATIVE & UNARY (721-757)                    │
│  ╰ จัดการ *, /, %, !, typeof operators                        │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 12: POSTFIX EXPRESSIONS (760-799)                       │
│  ╰ จัดการ obj.prop, obj[key], func() - member & call          │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 13: PRIMARY EXPRESSIONS (802-853)                       │
│  ╰ อ่าน literals (42, 'hello'), identifiers, (expr)           │
├─────────────────────────────────────────────────────────────────┤
│  โซนที่ 14: ARGUMENT LIST (856-870)                             │
│  ╰ อ่าน arguments ใน function calls (arg1, arg2, arg3)        │
└─────────────────────────────────────────────────────────────────┘
```

---

##  รายละเอียดแต่ละโซน

###  โซนที่ 1: CLASS DEFINITION (บรรทัด 221-236)

**งานที่ทำ:** สร้างคลาส AdvancedStructureParser และตั้งค่าเริ่มต้น

```javascript
constructor(tokens, grammarIndex) {
    super(tokens);
    this.grammarIndex = grammarIndex;  // เก็บ grammar rules
    this.current = 0;                  // ตำแหน่งปัจจุบันใน tokens
    this.ast = {                       // สร้าง AST root (ESTree format)
        type: 'Program',
        body: [],
        sourceType: 'module',
        comments: []
    };
}
```

**Input:** 
- `tokens` - รายการ token จาก JavaScriptTokenizer
- `grammarIndex` - ข้อมูล grammar rules

**Output:** 
- สร้าง instance พร้อม AST root node

---

###  โซนที่ 2: MAIN ENTRY POINT - parse() (บรรทัด 238-260)

**งานที่ทำ:** จุดเริ่มต้นการแปลง tokens  AST

```javascript
parse() {
    while (!this.isAtEnd()) {           // วนอ่านจนหมด tokens
        const statement = this.parseStatement();
        if (statement) {
            this.ast.body.push(statement);
        }
    }
    return this.ast;                    // คืน AST ที่สร้างเสร็จ
}
```

**Flow:**
1. วน loop อ่าน tokens ทีละตัว
2. เรียก `parseStatement()` แปลงแต่ละ statement
3. เก็บ statement ลง `ast.body[]`
4. ถ้าเจอ error ให้ข้าม token ปัญหาไป (error recovery)
5. คืน AST ที่สร้างเสร็จแล้ว

---

###  โซนที่ 3: STATEMENT ROUTER (บรรทัด 262-286)

**งานที่ทำ:** ตัดสินใจว่า token ปัจจุบันคือ statement ประเภทไหน

```javascript
parseStatement() {
    const token = this.peek();
    
    if (token.type === 'KEYWORD') {
        switch (token.value) {
            case 'function': return this.parseFunctionDeclaration();
            case 'class': return this.parseClassDeclaration();
            case 'const':
            case 'let':
            case 'var': return this.parseVariableDeclaration();
            case 'if': return this.parseIfStatement();
            // ... etc
        }
    }
    
    return this.parseExpressionStatement();
}
```

**Routing Table:**

| Keyword | Parser Method | Output Node |
|---------|---------------|-------------|
| `function` | `parseFunctionDeclaration()` | FunctionDeclaration |
| `class` | `parseClassDeclaration()` | ClassDeclaration |
| `const/let/var` | `parseVariableDeclaration()` | VariableDeclaration |
| `if` | `parseIfStatement()` | IfStatement |
| `for/while` | `parseForStatement()` | ForStatement |
| `try` | `parseTryStatement()` | TryStatement |
| `return` | `parseReturnStatement()` | ReturnStatement |
| `import` | `parseImportDeclaration()` | ImportDeclaration |
| `export` | `parseExportDeclaration()` | ExportDeclaration |
| `async` | `parseAsyncStatement()` | AsyncFunction |
| (other) | `parseExpressionStatement()` | ExpressionStatement |

---

###  โซนที่ 4: FUNCTION PARSER (บรรทัด 288-306)

**งานที่ทำ:** แปลง function declaration  FunctionDeclaration node

```javascript
parseFunctionDeclaration() {
    const start = this.current;
    this.consume('function');           // กิน 'function' keyword
    const id = this.parseIdentifier();  // อ่านชื่อ function
    const params = this.parseParameterList(); // อ่านพารามิเตอร์
    const body = this.parseBlockStatement();  // อ่าน function body
    
    return {
        type: 'FunctionDeclaration',
        id: id,
        params: params,
        body: body,
        generator: false,
        async: false
    };
}
```

**ตัวอย่าง:**
```javascript
function add(x, y) {
    return x + y;
}
```

**AST Output:**
```json
{
  "type": "FunctionDeclaration",
  "id": { "type": "Identifier", "name": "add" },
  "params": [
    { "type": "Identifier", "name": "x" },
    { "type": "Identifier", "name": "y" }
  ],
  "body": { "type": "BlockStatement", "body": [...] }
}
```

---

###  โซนที่ 5: VARIABLE PARSER (บรรทัด 308-336)

**งานที่ทำ:** แปลง variable declaration  VariableDeclaration node

```javascript
parseVariableDeclaration() {
    const kind = this.advance().value;  // const/let/var
    const declarations = [];
    
    do {
        const declaration = {
            type: 'VariableDeclarator',
            id: this.parseIdentifier(),
            init: null
        };
        
        if (this.match('=')) {          // ถ้ามี = initializer
            this.advance();
            declaration.init = this.parseExpression();
        }
        
        declarations.push(declaration);
    } while (this.match(',') && this.advance());
    
    return { type: 'VariableDeclaration', declarations, kind };
}
```

**ตัวอย่าง:**
```javascript
const x = 5, y = 10;
```

**AST Output:**
```json
{
  "type": "VariableDeclaration",
  "kind": "const",
  "declarations": [
    {
      "type": "VariableDeclarator",
      "id": { "type": "Identifier", "name": "x" },
      "init": { "type": "Literal", "value": 5 }
    },
    {
      "type": "VariableDeclarator",
      "id": { "type": "Identifier", "name": "y" },
      "init": { "type": "Literal", "value": 10 }
    }
  ]
}
```

---

###  โซนที่ 6: EXPRESSION PARSERS (บรรทัด 338-375)

**งานที่ทำ:** จัดการ expressions ตาม operator precedence

**Parser Chain:**
```
parseExpression()
  
parseAssignmentExpression() (=, +=, -=)
  
parseLogicalExpression() (&&, ||, ??)
  
parseEqualityExpression() (==, !=, ===, !==)
  
...
```

**1. parseAssignmentExpression (บรรทัด 342-356)**
- Operators: `=`, `+=`, `-=`, `*=`, `/=`
- Precedence: ต่ำสุด
- ตัวอย่าง: `x = 5`, `y += 10`

**2. parseLogicalExpression (บรรทัด 358-375)**
- Operators: `&&`, `||`, `??`
- Precedence: สูงกว่า assignment
- ตัวอย่าง: `x && y`, `a || b`, `c ?? d`

---

###  โซนที่ 7: HELPER METHODS (บรรทัด 378-424)

**งานที่ทำ:** ฟังก์ชันช่วยเหลือสำหรับการอ่านและเคลื่อนที่ใน tokens

| Method | งานที่ทำ | Return |
|--------|---------|--------|
| `peek()` | ดู token ปัจจุบันโดยไม่เลื่อน | current token |
| `advance()` | เลื่อน position +1 | previous token |
| `isAtEnd()` | เช็คว่าอ่านหมดแล้วหรือยัง | boolean |
| `match(...types)` | เช็คว่า token ตรงกับ types หรือไม่ | boolean |
| `matchOperator(...ops)` | เช็คว่า token เป็น operator ที่กำหนดหรือไม่ | boolean |
| `consume(expected)` | กิน token ที่คาดหวัง (ไม่งั้น error) | token |
| `consumeSemicolon()` | กิน ; ถ้ามี (รองรับ ASI) | void |
| `parseIdentifier()` | อ่าน identifier | Identifier node |

**ตัวอย่าง:**
```javascript
// ต้องการอ่าน: function foo() {}
this.consume('function');   // กิน 'function' (ไม่งั้น error)
const name = this.parseIdentifier(); // อ่าน 'foo'
this.consume('(');          // กิน '('
```

---

###  โซนที่ 8: PARAMETER & BLOCK (บรรทัด 426-457)

**1. parseParameterList() (บรรทัด 426-439)**

อ่านรายการพารามิเตอร์: `(x, y, z)`

```javascript
parseParameterList() {
    const params = [];
    this.consume('(');
    
    while (!this.match(')') && !this.isAtEnd()) {
        params.push(this.parseIdentifier());
        if (this.match(',')) this.advance();
    }
    
    this.consume(')');
    return params;
}
```

**2. parseBlockStatement() (บรรทัด 441-457)**

อ่าน block statement: `{ ... }`

```javascript
parseBlockStatement() {
    this.consume('{');
    const body = [];
    
    while (!this.match('}') && !this.isAtEnd()) {
        const stmt = this.parseStatement();
        if (stmt) body.push(stmt);
    }
    
    this.consume('}');
    return { type: 'BlockStatement', body };
}
```

---

###  โซนที่ 9: EXPRESSION STATEMENT (บรรทัด 459-473)

**งานที่ทำ:** แปลง expression statement  ExpressionStatement node

```javascript
parseExpressionStatement() {
    try {
        const expr = this.parseExpression();
        this.consumeSemicolon();
        
        return {
            type: 'ExpressionStatement',
            expression: expr
        };
    } catch (error) {
        this.advance();  // Error recovery
        return null;
    }
}
```

**ตัวอย่าง:**
- `foo();`  ExpressionStatement with CallExpression
- `x = 5;`  ExpressionStatement with AssignmentExpression
- `obj.method();`  ExpressionStatement with CallExpression

---

###  โซนที่ 10: EQUALITY & COMPARISON (บรรทัด 576-622)

**Parsers ใน zone นี้:**

1. **parseEqualityExpression()** - `==`, `!=`, `===`, `!==`
2. **parseRelationalExpression()** - `<`, `>`, `<=`, `>=`
3. **parseAdditiveExpression()** - `+`, `-`

**Precedence Order:**
```
Additive (+, -)
   สูงกว่า
Relational (<, >)
   สูงกว่า
Equality (===, !==)
```

**ตัวอย่าง:**
```javascript
x + y < z       // (x + y) < z    (additive first)
a === b + c     // a === (b + c)  (additive first)
```

---

###  โซนที่ 11: MULTIPLICATIVE & UNARY (บรรทัด 721-757)

**1. parseMultiplicativeExpression() (บรรทัด 721-738)**
- Operators: `*`, `/`, `%`
- Precedence: สูงกว่า additive
- ตัวอย่าง: `x * y`, `a / b`, `c % d`

**2. parseUnaryExpression() (บรรทัด 741-757)**
- Operators: `!`, `-`, `+`, `typeof`, `void`, `delete`
- Precedence: สูงที่สุดใน operators
- ตัวอย่าง: `!x`, `-y`, `typeof foo`
- รองรับ nested: `!!x`, `-(-y)`

---

###  โซนที่ 12: POSTFIX EXPRESSIONS (บรรทัด 760-799)

**งานที่ทำ:** จัดการ postfix operators (อยู่หลัง operand)

**Postfix Types:**

1. **Member Access (`.`)** - `obj.property`
   - สร้าง MemberExpression (computed: false)

2. **Computed Member (` []`)** - `obj[key]`
   - สร้าง MemberExpression (computed: true)

3. **Function Call (`()`)** - `func(args)`
   - สร้าง CallExpression

**รองรับ chain:**
```javascript
obj.method(x)[0].property()
  
CallExpression(
  MemberExpression(
    MemberExpression(
      CallExpression(
        MemberExpression(obj, method),
        [x]
      ),
      [0]
    ),
    property
  ),
  []
)
```

---

###  โซนที่ 13: PRIMARY EXPRESSIONS (บรรทัด 802-853)

**งานที่ทำ:** อ่าน primary expressions (building blocks)

**ประเภทที่รองรับ:**

1. **NUMBER Literals** - `42`, `3.14`
   ```javascript
   { type: 'Literal', value: 42, raw: '42' }
   ```

2. **STRING Literals** - `'hello'`, `"world"`
   ```javascript
   { type: 'Literal', value: 'hello', raw: "'hello'" }
   ```

3. **IDENTIFIERS** - `foo`, `myVariable`
   ```javascript
   { type: 'Identifier', name: 'foo' }
   ```

4. **Parenthesized Expressions** - `(x + y)`
   ```javascript
   // คืน expression ภายใน (ไม่สร้าง node ใหม่)
   ```

5. **Unknown Tokens** - ข้ามไปและคืน dummy node

---

###  โซนที่ 14: ARGUMENT LIST (บรรทัด 856-870)

**งานที่ทำ:** อ่าน arguments ใน function calls

```javascript
parseArgumentList() {
    const args = [];
    this.consume('(');
    
    while (!this.match(')') && !this.isAtEnd()) {
        args.push(this.parseExpression());
        if (this.match(',')) this.advance();
    }
    
    this.consume(')');
    return args;
}
```

**ตัวอย่าง:**
```javascript
foo(x, y+z, obj.method())
```

**Output:**
```json
[
  { "type": "Identifier", "name": "x" },
  { "type": "BinaryExpression", "operator": "+", ... },
  { "type": "CallExpression", ... }
]
```

---

##  Operator Precedence Flow

การไหลของ precedence (จากต่ำไปสูง):

```
1. Assignment (=, +=, -=, *=, /=)            precedence ต่ำสุด
   
2. Logical (&&, ||, ??)
   
3. Equality (==, !=, ===, !==)
   
4. Relational (<, >, <=, >=)
   
5. Additive (+, -)
   
6. Multiplicative (*, /, %)
   
7. Unary (!, -, +, typeof, void, delete)
   
8. Postfix (., [], ())
   
9. Primary (literals, identifiers, (...))    precedence สูงสุด
```

**ตัวอย่างการประมวลผล:**

```javascript
x = y + z * 3
```

**Parser Flow:**
```
parseAssignmentExpression()
  ├─ left: parseLogical()  ...  parseIdentifier('x')
  ├─ operator: '='
  └─ right: parseAssignmentExpression()
      └─ parseLogical()  ...  parseAdditive()
          ├─ left: parseIdentifier('y')
          └─ right: parseMultiplicative()
              ├─ left: parseIdentifier('z')
              └─ right: parseLiteral(3)
```

**AST Result:**
```json
{
  "type": "AssignmentExpression",
  "operator": "=",
  "left": { "type": "Identifier", "name": "x" },
  "right": {
    "type": "BinaryExpression",
    "operator": "+",
    "left": { "type": "Identifier", "name": "y" },
    "right": {
      "type": "BinaryExpression",
      "operator": "*",
      "left": { "type": "Identifier", "name": "z" },
      "right": { "type": "Literal", "value": 3 }
    }
  }
}
```

---

##  สรุปสุดท้าย

**AdvancedStructureParser** ทำงานเป็น 3 ระดับใหญ่ๆ:

1. **Statement Level (โซน 2-5, 9)**
   - จัดการ top-level statements
   - function, class, variable declarations

2. **Expression Level (โซน 6, 10-14)**
   - จัดการ expressions ตาม precedence
   - operators, member access, calls

3. **Helper Level (โซน 7-8)**
   - เครื่องมือช่วยเหลือ
   - token navigation, parsing utilities

**หัวใจสำคัญ:**
-  **Recursive Descent Parsing** - เรียกตัวเองแบบ recursive
-  **Operator Precedence** - precedence ต่ำ  สูง
-  **Error Recovery** - ข้าม token ปัญหาและทำงานต่อ
-  **ESTree Format** - AST เหมือน Babel/Acorn

---

**เอกสารสร้างเมื่อ:** 8 ตุลาคม 2025  
**ไฟล์:** `smart-parser-engine.js` (บรรทัด 221-870)  
**จำนวนโซน:** 14 โซน  
**จำนวนบรรทัดโค้ด:** ~650 บรรทัด
