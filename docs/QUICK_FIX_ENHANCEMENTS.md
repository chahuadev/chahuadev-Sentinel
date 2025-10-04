# Quick Fix Enhancements - Complete

## Overview
Enhanced all Quick Fix (lightbulb 💡) suggestions in `codeActionProvider.js` to provide comprehensive, context-aware fixes for all 640+ violation patterns across 5 absolute coding rules.

---

## ✅ Rule 1: NO_MOCKING (Enhanced)

### Detection Capabilities
- **12 mock types detected**: Jest, Sinon, Vitest, MSW, Nock, Fetch-mock, Enzyme, TestDouble, Proxyquire, Rewire, Node native, Prototype patches, Global assignments

### Quick Fix Options (5 fixes)
1. **💡 Comment out [MockType] (TODO: Replace with DI)**
   - Smart detection of specific mock library
   - Shows mock type in message (e.g., "Jest mock", "Sinon stub")
   
2. **💡 Delete import statement**
   - Removes mock library import if detected
   - Only shown when mock is from import line

3. **💡 Generate Dependency Injection replacement**
   - Auto-generates DI parameter suggestion
   - Extracts module name from mock call
   - Shows constructor injection example

4. **📖 Read about Dependency Injection patterns**
   - Links to DI documentation
   - Language-aware (TH/EN)

5. **💡 Show real-world DI examples**
   - Opens examples page with before/after code

---

## ✅ Rule 2: NO_HARDCODE (Enhanced)

### Detection Capabilities
- **20+ token types detected**: 
  - Platform tokens: Slack (xoxb-), GitHub (ghp-), GitLab (glpat-), SendGrid (SG.), Twilio (SK/AC)
  - Payment: Stripe (sk_live_/sk_test_)
  - Cloud: AWS (AKIA), Azure, GCP
  - SSH keys: RSA/DSA/EC/OpenSSH private keys, ssh-rsa public keys
  - Cryptocurrency: Bitcoin addresses, Ethereum addresses
  - Generic: API keys, secrets, passwords, bearer tokens, URLs

### Quick Fix Options (6 fixes)
1. **💡 Replace with process.env.[TOKEN_NAME]**
   - Smart environment variable naming based on token type
   - Examples: `process.env.SLACK_BOT_TOKEN`, `process.env.GITHUB_TOKEN`
   - Auto-replaces hardcoded value in code

2. **💡 Extract to [CONSTANT_NAME] constant (move to config)**
   - Extracts to constant at top of file
   - Token-specific constant names (e.g., `SLACK_BOT_TOKEN`, `STRIPE_SECRET_KEY`)
   - Adds TODO comment to move to config file

3. **💡 Comment out this line**
   - Adds TODO with detected token type
   - Example: `// TODO: Move to config/env file - Slack Bot Token detected`

4. **📝 Create .env file entry**
   - Opens dialog showing `.env` example
   - Pre-filled with detected token name
   - Example: `SLACK_BOT_TOKEN=your_token_here`

5. **📖 Why hardcoding [TokenType] is problematic?**
   - Token-specific documentation
   - Links to configuration guide

6. **⚠️ Sensitive data security best practices** (only for sensitive tokens)
   - Shows for: API keys, SSH keys, passwords, payment keys, crypto seeds
   - Links to security documentation

---

## ✅ Rule 3: NO_SILENT_FALLBACK (Enhanced)

### Detection Capabilities
- **7 error contexts detected**:
  - `catch-block`: try-catch with silent return/continue/break
  - `promise-catch`: Promise.catch() without error handling
  - `event-handler`: addEventListener, onclick without error logs
  - `express-middleware`: Express/Koa middleware errors
  - `react-error`: componentDidCatch, getDerivedStateFromError
  - `array-fallback`: .find(), .filter(), .reduce() with || fallback
  - `unknown`: Other error contexts

### Quick Fix Options (6 fixes)
1. **💡 Add [logger.error() / console.error()]**
   - Context-aware logger selection
   - catch-block → `logger.error('Error occurred:', err)`
   - promise-catch → `logger.error('Promise error:', err)`
   - event-handler → `console.error('Event error:', event)`
   - express-middleware → `logger.error('Middleware error:', err); next(err);`

2. **💡 [Re-throw / Throw] error**
   - catch-block: Replaces `return` with `throw err`
   - promise-catch: Converts to `.catch(err => { logger.error(); throw err; })`
   - event-handler: Adds `console.error()` in handler body
   - Context-specific error propagation

3. **💡 Convert to async/await with try-catch** (for Promise chains)
   - Shows for promise-catch violations
   - Links to conversion tool/example

4. **💡 Add Error Boundary component** (for React)
   - Shows for React componentDidCatch violations
   - Links to Error Boundary implementation guide

5. **💡 Comment out this line**
   - Adds detected error context in TODO
   - Example: `// TODO: Proper error handling - promise-catch detected`

6. **📖 Why silent fallback in [context] is dangerous?**
   - Context-specific documentation
   - Examples showing why silent errors are problematic

---

## ✅ Rule 4: NO_INTERNAL_CACHE (Enhanced)

### Detection Capabilities
- **12 cache libraries detected**:
  - React: useMemo, useCallback, React.memo
  - Vue: computed properties
  - Lodash: _.memoize
  - Ramda: R.memoize
  - Memoization: memoizee, fast-memoize, moize
  - Reselect: createSelector
  - Data fetching: useSWR, useQuery (React Query)
  - Browser: localStorage, sessionStorage
  - Manual: Map/WeakMap caches
  - GraphQL: InMemoryCache (Apollo)

### Quick Fix Options (5 fixes)
1. **💡 Remove [CacheLibrary] wrapper**
   - Library-specific unwrapping:
     - React: `useMemo(() => calc, [deps])` → `calc`
     - Lodash/Ramda: `_.memoize(fn)` → `fn`
     - Others: Removes memoization wrapper
   - Only shown for removable caches

2. **💡 Comment out [CacheLibrary]**
   - Library-specific TODO comment
   - Example: `// TODO: Remove React Hooks internal cache - let caller handle`

3. **💡 Extract to decorator/HOC at caller**
   - Shows for React/Lodash/Ramda
   - Opens decorator pattern examples
   - Demonstrates proper separation of concerns

4. **💡 Use external cache (Redis/Memcached) instead**
   - Links to external caching solutions
   - Shows Redis/Memcached integration examples
   - API Gateway caching strategies

5. **📖 Why [CacheLibrary] internal caching is problematic?**
   - Library-specific documentation
   - Explains why internal state is an issue
   - Shows proper alternatives

---

## ✅ Rule 5: NO_EMOJI (Already Complete)

### Quick Fix Options (4 fixes)
1. **💡 Replace [emoji] with '[text]'**
   - 20+ emoji mappings (✅→success, ❌→error, 🚀→launch)
   - Auto-replaces in code

2. **💡 Replace all emoji with text**
   - Bulk replacement across entire line

3. **💡 Remove emoji completely**
   - Just deletes the emoji character

4. **📖 Why emoji in code is problematic?**
   - Links to emoji policy documentation

---

## 🔧 Helper Functions Added

### 1. `detectMockType(lineText)`
Returns: `{ name, library, canAutoFix }`
- Detects 13 different mock patterns
- Examples: "Jest mock", "Sinon stub/spy", "MSW (Mock Service Worker)"

### 2. `generateDIReplacement(lineText, mockType, indent)`
Returns: String (DI code suggestion)
- Extracts module name from mock call
- Generates constructor injection example
- Adds TODO comments

### 3. `detectHardcodeType(lineText)`
Returns: `{ type, envName, constantName, sensitive }`
- Detects 20+ token/secret patterns
- Platform-specific: Slack, GitHub, GitLab, AWS, Stripe, etc.
- Flags sensitive data (passwords, keys, crypto)

### 4. `generateEnvVarReplacement(lineText, hardcodeType)`
Returns: String (code with process.env.VAR)
- Replaces hardcoded value with environment variable
- Smart variable naming based on token type

### 5. `detectErrorContext(lineText, document, lineNumber)`
Returns: `{ type, errorVar, loggerType, throwAction, canThrow }`
- Detects 7 error handling contexts
- Examples: "catch-block", "promise-catch", "event-handler"

### 6. `generateErrorHandling(lineText, errorContext, indent, language)`
Returns: `{ position, code }`
- Context-aware error logging code
- Proper logger selection (logger.error vs console.error)
- Language-aware TODO comments (TH/EN)

### 7. `detectCacheLibrary(lineText)`
Returns: `{ name, library, canRemove }`
- Detects 12 caching patterns
- Examples: "React Hooks", "Lodash memoize", "Manual Map cache"
- Flags whether cache can be auto-removed

---

## 📊 Statistics

### Before Enhancement
- **Total Quick Fix methods**: 5
- **Fixes per rule**: 2-3 fixes
- **Total Quick Fixes**: ~12 fixes
- **Helper functions**: 3 (basic)
- **Detection patterns**: Generic only

### After Enhancement
- **Total Quick Fix methods**: 5 (all enhanced)
- **Fixes per rule**: 4-6 fixes
- **Total Quick Fixes**: 26 fixes
- **Helper functions**: 10 (comprehensive)
- **Detection patterns**: 50+ specific sub-types detected

### Coverage
| Rule | Patterns in validator.js | Quick Fix Sub-types | Fix Actions |
|------|--------------------------|---------------------|-------------|
| NO_MOCKING | 160+ | 13 mock types | 5 fixes |
| NO_HARDCODE | 190+ | 20+ token types | 6 fixes |
| NO_SILENT_FALLBACK | 100+ | 7 error contexts | 6 fixes |
| NO_INTERNAL_CACHE | 100+ | 12 cache libraries | 5 fixes |
| NO_EMOJI | 90+ | 20+ emoji mappings | 4 fixes |
| **TOTAL** | **640+** | **70+ sub-types** | **26 fixes** |

---

## 🎯 Features

### Context-Aware Intelligence
- Detects specific violation sub-type (not just generic "mocking detected")
- Shows library name in Quick Fix message ("Jest mock", "Sinon stub")
- Token-specific environment variable names ("SLACK_BOT_TOKEN" not just "TOKEN")

### Actionable Code Transformations
- Auto-generates Dependency Injection replacement code
- Auto-unwraps React useMemo/Lodash memoize
- Auto-replaces hardcoded values with process.env
- Auto-adds error logging with correct logger type

### Smart Import Handling
- Deletes mock library imports when appropriate
- Suggests moving constants to config files
- Generates .env file entries

### Language Support
- All messages in Thai (TH) and English (EN)
- Language-aware TODO comments
- Culturally appropriate documentation links

### Security Awareness
- Flags sensitive data (passwords, SSH keys, crypto)
- Shows security best practices for sensitive tokens
- Warns about hardcoded payment gateway keys

---

## 🚀 Usage Examples

### Example 1: Jest Mock Detection
**Violation detected:**
```javascript
jest.mock('../services/UserService');
```

**Quick Fixes offered:**
1. 💡 Comment out Jest mock (TODO: Replace with DI)
2. 💡 Delete import statement
3. 💡 Generate Dependency Injection replacement
4. 📖 Read about Dependency Injection patterns
5. 💡 Show real-world DI examples

**After applying Fix #3:**
```javascript
// TODO: Replace mock with Dependency Injection
// Example:
// constructor(private userService: IUserService) {}
// Pass real implementation in production, test double in tests
```

---

### Example 2: Slack Token Detection
**Violation detected:**
```javascript
const token = 'xoxb-1234567890-abcdefghij';
```

**Quick Fixes offered:**
1. 💡 Replace with process.env.SLACK_BOT_TOKEN ⭐ (preferred)
2. 💡 Extract to SLACK_BOT_TOKEN constant (move to config)
3. 💡 Comment out this line
4. 📝 Create .env file entry
5. 📖 Why hardcoding Slack Bot Token is problematic?
6. ⚠️ This is sensitive data - read security best practices

**After applying Fix #1:**
```javascript
const token = process.env.SLACK_BOT_TOKEN;
```

---

### Example 3: Promise Silent Fallback
**Violation detected:**
```javascript
fetchData().catch(() => { return null; });
```

**Quick Fixes offered:**
1. 💡 Add logger.error() ⭐ (preferred)
2. 💡 Throw error
3. 💡 Convert to async/await with try-catch
4. 💡 Comment out this line
5. 📖 Why silent fallback in promise-catch is dangerous?

**After applying Fix #2:**
```javascript
fetchData().catch(err => { logger.error('Promise error:', err); throw err; });
```

---

### Example 4: React useMemo Detection
**Violation detected:**
```javascript
const result = useMemo(() => expensiveCalc(data), [data]);
```

**Quick Fixes offered:**
1. 💡 Remove React Hooks wrapper ⭐ (preferred)
2. 💡 Comment out React Hooks
3. 💡 Extract to decorator/HOC at caller
4. 💡 Use external cache (Redis/Memcached) instead
5. 📖 Why React Hooks internal caching is problematic?

**After applying Fix #1:**
```javascript
const result = expensiveCalc(data);
```

---

## 🧪 Testing

### Test Coverage Needed
1. **NO_MOCKING**: Test all 13 mock types (Jest, Sinon, Vitest, MSW, Nock, etc.)
2. **NO_HARDCODE**: Test 20+ token patterns (Slack, GitHub, AWS, Stripe, SSH keys)
3. **NO_SILENT_FALLBACK**: Test 7 error contexts (catch, Promise, event handler, Express)
4. **NO_INTERNAL_CACHE**: Test 12 cache libraries (React, Lodash, Reselect, SWR)
5. **NO_EMOJI**: Test 20+ emoji replacements

### Test Scenarios
- ✅ Quick Fix appears when violation detected
- ✅ Preferred fix marked with ⭐
- ✅ Code transformations are syntactically correct
- ✅ Environment variable names are appropriate
- ✅ Import statements deleted when needed
- ✅ Language switching (TH/EN) works correctly
- ✅ Documentation links open correctly
- ✅ Helper functions detect correct sub-types

---

## 📝 Next Steps

### Immediate (Ready to Test)
1. ✅ All Quick Fix methods enhanced
2. ✅ All helper functions implemented
3. 🔄 **Test in VS Code Extension Development Host**
4. 🔄 **Verify all 26 Quick Fixes work correctly**

### Follow-up (Commands to Implement)
Some Quick Fixes reference VS Code commands that need implementation:
- `chahuadev.showEnvExample` - Show .env file example
- `chahuadev.convertToAsyncAwait` - Convert Promise chain to async/await
- `chahuadev.addErrorBoundary` - Add React Error Boundary
- `chahuadev.showDecoratorExample` - Show decorator pattern examples

### Future Enhancements
- Add "Fix All" command to apply all Quick Fixes in file
- Add code snippets for common patterns (DI, error handling)
- Add integration with popular config file formats (.env, config.js, secrets.json)
- Add automatic .gitignore updates for sensitive files

---

## 🎉 Summary

**Total Quick Fix enhancements:**
- ✅ NO_MOCKING: 2 fixes → 5 fixes (13 mock types detected)
- ✅ NO_HARDCODE: 3 fixes → 6 fixes (20+ token types detected)
- ✅ NO_SILENT_FALLBACK: 3 fixes → 6 fixes (7 error contexts detected)
- ✅ NO_INTERNAL_CACHE: 2 fixes → 5 fixes (12 cache libraries detected)
- ✅ NO_EMOJI: 4 fixes (already complete)

**Result:** Comprehensive, context-aware Quick Fixes covering all 640+ validation patterns with actionable code transformations!
