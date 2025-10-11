# Chahuadev-Sentinel Test Suite

## Philosophy: Testing Pyramid

Our test suite follows the industry-standard **Testing Pyramid** approach, ensuring comprehensive coverage while maintaining fast feedback loops.

```
          /\
         /  \
        / E2E \      <- Few, Slow, Full System
       /--------\
      /          \
     / Integration \  <- Medium, Moderate Speed
    /--------------\
   /                \
  /   Unit Tests     \ <- Many, Fast, Isolated
 /____________________\
```

## Three Layers of Testing

### Layer 1: Unit Tests (Foundation)
**Location:** `__tests__/unit/`  
**Purpose:** Test individual functions and classes in complete isolation  
**Speed:** Very fast (pure logic, no I/O)  
**Quantity:** Many (70% of total tests)

#### What We Test:
- **Character Classification** (`tokenizer-classifier.test.js`)
  - `isLetterByMath()` - Pure mathematical letter detection
  - `isDigitByMath()` - Pure mathematical digit detection
  - `isWhitespaceByMath()` - Whitespace identification
  - `isOperatorByMath()` - Operator detection
  - `computeBinaryFlags()` - Binary flag computation

- **Grammar Index** (`grammar-index.test.js`)
  - Keyword lookup
  - Operator lookup
  - Punctuation binary mapping
  - Grammar structure validation

#### Running Unit Tests:
```bash
npm run test:unit
```

---

### Layer 2: Integration Tests (Middle)
**Location:** `__tests__/integration/`  
**Purpose:** Test components working together  
**Speed:** Moderate (real file I/O, small scope)  
**Quantity:** Medium (20% of total tests)

#### What We Test:
- **Tokenizer + Grammar** (`tokenizer-with-grammar.test.js`)
  - Real grammar file loading
  - Keyword recognition across all ECMAScript versions
  - Operator disambiguation
  - Punctuation binary mapping accuracy
  - Grammar completeness validation

#### Running Integration Tests:
```bash
npm run test:integration
```

---

### Layer 3: End-to-End Tests (Top)
**Location:** `__tests__/e2e/`  
**Purpose:** Test entire system as users would  
**Speed:** Slower (complete parsing pipeline)  
**Quantity:** Few (10% of total tests)

#### What We Test:
- **Complete Parser Pipeline** (`parser.e2e.test.js`)
  - Full source code → AST transformation
  - All JavaScript language features
  - Error handling for invalid syntax
  - Performance benchmarks
  - Regression tests

#### Test Cases:
All test cases are in `test-cases/` directory:

1. **simple-variable.js** - Basic variable declarations
2. **if-else.js** - Conditional statements
3. **for-loop.js** - All loop types (for, for-of, for-in)
4. **complex-function.js** - Async/await, generators, arrow functions
5. **es6-class.js** - Class inheritance and static methods
6. **es6-modules.js** - Import/export statements
7. **destructuring-spread.js** - Modern syntax features
8. **template-literals.js** - Template strings and tags
9. **comments.js** - All comment types
10. **edge-cases.js** - Quirky JavaScript features
11. **invalid-syntax.js** - Error handling validation

#### Running E2E Tests:
```bash
npm run test:e2e
```

---

## Snapshot Testing

### Why Snapshot Testing?

AST structures are deeply nested and complex. Instead of writing hundreds of assertions manually, we use **snapshot testing**:

1. **First Run:** Generate snapshot files (`.snap`) containing correct AST output
2. **Future Runs:** Compare new output against saved snapshots
3. **Changes Detected:** Test fails, showing exact differences
4. **Review & Update:** Accept changes (`jest -u`) or fix broken code

### Benefits:
- **Catch Regressions:** Any unintended AST change is immediately detected
- **Easy Review:** `git diff` shows exactly what changed in snapshots
- **Comprehensive:** Entire AST structure validated with single line
- **Maintainable:** Update all snapshots with one command

### Example:
```javascript
test('should parse simple variable correctly', () => {
  const code = 'const x = 1;';
  const ast = parse(code);
  
  // Single line tests entire AST structure!
  expect(ast).toMatchSnapshot();
});
```

---

## Running Tests

### All Tests:
```bash
npm test
```

### By Layer:
```bash
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e         # E2E tests only
```

### Watch Mode:
```bash
npm run test:watch       # Re-run on file changes
```

### Coverage Report:
```bash
npm run test:coverage    # Generate coverage report
```

### Coverage Thresholds:
We maintain **80% coverage** across all metrics:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

---

## Test Structure

```
Chahuadev-Sentinel/
├── __tests__/
│   ├── unit/
│   │   ├── tokenizer-classifier.test.js  # Character classification
│   │   └── grammar-index.test.js         # Grammar lookup
│   ├── integration/
│   │   └── tokenizer-with-grammar.test.js # Tokenizer + Grammar
│   └── e2e/
│       └── parser.e2e.test.js            # Full pipeline
├── test-cases/                            # Real code samples
│   ├── simple-variable.js
│   ├── if-else.js
│   ├── complex-function.js
│   └── ...
└── package.json                           # Test scripts
```

---

## Writing New Tests

### Adding Unit Tests:
1. Create file in `__tests__/unit/`
2. Import function to test
3. Write isolated tests with mocks
4. Run `npm run test:unit`

### Adding Integration Tests:
1. Create file in `__tests__/integration/`
2. Use real components (no mocks)
3. Test component interactions
4. Run `npm run test:integration`

### Adding E2E Tests:
1. Add test case file in `test-cases/`
2. Add test in `parser.e2e.test.js`
3. Use snapshot testing for AST
4. Run `npm run test:e2e`

---

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- Main branch push

All tests must pass before merging.

---

## Philosophy

> "Test close to the code as much as possible"

- **Many fast unit tests** - Catch bugs early
- **Moderate integration tests** - Ensure components work together
- **Few slow E2E tests** - Validate complete system

This pyramid ensures:
- Fast feedback loops
- Precise error location
- Comprehensive coverage
- Maintainable test suite

---

## Next Steps

1. **Run existing tests:** `npm test`
2. **Check coverage:** `npm run test:coverage`
3. **Add more test cases** in `test-cases/`
4. **Update snapshots** after intended changes: `npm test -- -u`
5. **Keep coverage above 80%** for all metrics

---

**Last Updated:** 2025-10-11  
**Test Framework:** Jest 29.x  
**Coverage Target:** 80% minimum across all metrics
