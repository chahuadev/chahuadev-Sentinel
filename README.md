<div align="center">
  <img src="https://raw.githubusercontent.com/chahuadev/chahuadev/main/icon.png" alt="Chahuadev Sentinel" width="150"/>
  <h1>Chahuadev Sentinel</h1>
  <p><strong>VS Code Extension for Zero-Tolerance Code Quality Enforcement</strong></p>
  <p><em>Real-time Detection and Quick Fixes for Mock Libraries, Cache Operations, Fallback Mechanisms, and Hardcoded Values</em></p>
  
  [![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue.svg)](https://code.visualstudio.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/chahuadev/chahuadev-vscode-extension)
  [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-brightgreen)](https://nodejs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
</div>

---

## Quick Summary

**Chahuadev Sentinel** is a VS Code extension that provides real-time static analysis and automatic code fixes for JavaScript/TypeScript projects. It enforces 5 absolute coding rules with zero tolerance to prevent anti-patterns before they reach your codebase.

**What it does in 3 lines:**
- Detects violations instantly as you type with red underlines and hover tooltips
- Provides one-click Quick Fixes (lightbulb icon) with actionable solutions
- Integrates emoji-cleaner.js to automatically remove all emoji from source code

**Current Status:** Under active development | 5 absolute rules | Available for manual installation

---

## The 5 Absolute Rules

### Core Principles

The extension enforces these fundamental rules to ensure code quality:

#### 1. NO_MOCKING (ERROR Severity)

**Rule**: No mock libraries allowed - use Dependency Injection instead

```javascript
// VIOLATION - Mock library detected
jest.mock('./database');
sinon.stub(service, 'method');
vi.mock('./api');

// CORRECT - Dependency Injection
function myFunction(database) {
    return database.query('SELECT * FROM users');
}
```

**Detection Coverage**: 160+ patterns including Jest, Sinon, Vitest, MSW, Nock, Enzyme, TestDouble, Proxyquire, Rewire, Node native mocks

#### 2. NO_HARDCODE (ERROR Severity)

**Rule**: No hardcoded URLs, API keys, tokens, secrets, or configuration values

```javascript
// VIOLATION - Hardcoded values detected
const API_URL = 'https://api.example.com';
const SLACK_TOKEN = 'xoxb-1234567890';
const STRIPE_KEY = 'sk_live_abcdef123456';

// CORRECT - External configuration
const API_URL = process.env.API_URL;
import { SLACK_TOKEN } from './config.js';
```

**Detection Coverage**: 190+ patterns including URLs, Slack tokens, GitHub PAT, AWS keys, Stripe keys, SSH keys, cryptocurrency addresses

#### 3. NO_SILENT_FALLBACK (ERROR Severity)

**Rule**: No catch blocks returning defaults without logging - always throw or log errors

```javascript
// VIOLATION - Silent error suppression
try {
    return riskyOperation();
} catch (error) {
    return null; // Error context lost!
}

// CORRECT - Proper error handling
try {
    return riskyOperation();
} catch (error) {
    logger.error('Operation failed:', error);
    throw error; // Re-throw to caller
}
```

**Detection Coverage**: 100+ patterns including try-catch blocks, Promise.catch, event handlers, Express middleware, React error boundaries

#### 4. NO_INTERNAL_CACHE (WARNING Severity)

**Rule**: No internal memoization or caching - caching is external responsibility

```javascript
// VIOLATION - Internal cache detected
const cache = new Map();
const result = useMemo(() => calculation, [deps]);
const memoized = _.memoize(expensiveFunc);

// CORRECT - External caching
function getData(key) {
    return fetchData(key); // Let caller handle caching
}
```

**Detection Coverage**: 100+ patterns including React hooks (useMemo, useCallback), Vue computed, Lodash/Ramda memoize, Reselect, SWR/React Query

#### 5. NO_EMOJI (ERROR Severity)

**Rule**: No emoji characters allowed in source code

```javascript
// VIOLATION - Emoji detected
const status = '✅ Success';
console.log('🚀 Launching...');

// CORRECT - Use text
const status = '[SUCCESS] Success';
console.log('[LAUNCH] Launching...');
```

**Detection Coverage**: 90+ patterns covering all Unicode emoji blocks with automatic removal via emoji-cleaner.js integration

---

---

## Key Features

### Real-time Error Detection

The extension provides instant feedback as you code:

- **Red underlines** appear immediately when violations are detected
- **Hover tooltips** explain the violation with detailed context
- **Problems panel** integration lists all violations with file/line/column information
- **Status bar** indicator shows violation count for active file

### Intelligent Quick Fixes

Click the lightbulb icon to access context-aware solutions:

#### NO_MOCKING Quick Fixes (5 fixes)
- `[FIX]` Comment out mock with TODO reminder
- `[FIX]` Delete mock library import statement
- `[FIX]` Generate Dependency Injection replacement code
- `[DOCS]` Learn about Dependency Injection patterns
- `[EXAMPLES]` View real-world DI examples

#### NO_HARDCODE Quick Fixes (6 fixes)
- `[FIX]` Replace with `process.env.TOKEN_NAME` (preferred)
- `[FIX]` Extract to constant with TODO
- `[FIX]` Comment out with detected token type
- `[INFO]` Create .env file entry example
- `[DOCS]` Why hardcoding is problematic
- `[WARNING]` Security best practices (for sensitive data)

#### NO_SILENT_FALLBACK Quick Fixes (6 fixes)
- `[FIX]` Add `logger.error()` before return
- `[FIX]` Replace return with throw error
- `[FIX]` Convert Promise chain to async/await
- `[FIX]` Add Error Boundary component (React)
- `[FIX]` Comment out with context
- `[DOCS]` Why silent fallbacks are dangerous

#### NO_INTERNAL_CACHE Quick Fixes (5 fixes)
- `[FIX]` Remove cache wrapper (useMemo, _.memoize, etc.)
- `[FIX]` Comment out with library name
- `[FIX]` Extract to decorator/HOC at caller
- `[INFO]` Use external cache (Redis/Memcached)
- `[DOCS]` Why internal caching is problematic

#### NO_EMOJI Quick Fixes (5 fixes)
- `[AUTO]` Clean all emojis in file using emoji-cleaner.js (preferred)
- `[FIX]` Replace emoji with text equivalent (this line only)
- `[FIX]` Remove emoji (this line only)
- `[FIX]` Comment out line
- `[DOCS]` Why emoji in code is problematic

### Comprehensive Pattern Detection

**Total: 640+ violation patterns detected**

| Rule | Patterns | Examples |
|------|----------|----------|
| NO_MOCKING | 160+ | Jest, Sinon, Vitest, MSW, Nock, Enzyme, TestDouble |
| NO_HARDCODE | 190+ | Slack xoxb-, GitHub ghp-, AWS AKIA, Stripe sk_live_, SSH keys |
| NO_SILENT_FALLBACK | 100+ | try-catch, Promise.catch, event handlers, Express middleware |
| NO_INTERNAL_CACHE | 100+ | useMemo, useCallback, _.memoize, Reselect, SWR |
| NO_EMOJI | 90+ | All Unicode emoji blocks (U+1F000-U+1FAFF, etc.) |

### Workspace-wide Commands

Access via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- `Chahuadev: Validate Entire Workspace` - Scan all JavaScript/TypeScript files
- `Chahuadev: Validate Current File` - Quick validation of active file
- `Chahuadev: Clear All Diagnostics` - Reset all violation markers
- `Chahuadev: Show Output` - View detailed validation logs
- `Chahuadev: Toggle Validation` - Enable/disable validator

### Highly Configurable

- Enable/disable individual rules
- Choose language (English/Thai) for all messages
- Configure validation triggers (on save, on open, on type)
- Exclude patterns for test files or node_modules
- Customize severity levels per rule

---

---

## Installation

### Prerequisites

- **VS Code**: Version 1.80.0 or higher
- **Node.js**: Version 18 or higher (for development)

### Method 1: From VS Code Marketplace (Coming Soon)

1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
3. Search for **"Chahuadev Sentinel"**
4. Click **Install**

### Method 2: From VSIX File (Manual Installation)

1. Download the latest `.vsix` file from [Releases](https://github.com/chahuadev/chahuadev-vscode-extension/releases)
2. Open VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Run command: `Extensions: Install from VSIX...`
5. Select the downloaded `.vsix` file

### Method 3: From Source (Development)

```bash
# Clone the repository
git clone https://github.com/chahuadev/chahuadev-vscode-extension.git
cd chahuadev-vscode-extension

# Install dependencies
npm install

# Build the extension
npm run compile

# Package as VSIX (optional)
npm run package

# Launch Extension Development Host
# Press F5 in VS Code to test
```

### Verify Installation

After installation, you should see:
- "Chahuadev" status bar item in bottom-right corner
- "Chahuadev" output channel available
- Commands available in Command Palette (search "Chahuadev")

---

---

## Usage

### Automatic Validation

Once installed, Chahuadev Sentinel automatically validates your code:

- **On File Open** (default: enabled)
- **On File Save** (default: enabled)
- **On Type** (default: disabled for performance)
- **Workspace Scan** (on-demand via command)

### Validation Workflow

1. **Detection**: Extension scans code and identifies violations
2. **Visual Feedback**: Red underlines appear under problematic code
3. **Hover Information**: Hover over underlined code to see violation details
4. **Quick Fix**: Click lightbulb icon to see available fixes
5. **Apply Fix**: Select a fix to automatically update your code

### Manual Commands

Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and type:

```
Chahuadev: Validate Entire Workspace
Chahuadev: Validate Current File
Chahuadev: Clear All Diagnostics
Chahuadev: Show Output
Chahuadev: Toggle Validation
```

### Example Workflow: Removing Emoji

1. Extension detects emoji in your code (red underline appears)
2. Hover to see: "NO_EMOJI: Emoji character detected in source code"
3. Click lightbulb icon
4. Select `[AUTO] Clean all emojis in this file (emoji-cleaner.js)`
5. Extension automatically removes all emoji from the file
6. File is saved and re-validated

### Example Workflow: Fixing Hardcoded Token

1. Extension detects hardcoded Slack token
2. Hover to see: "NO_HARDCODE: Slack Bot Token detected - use environment variables"
3. Click lightbulb icon
4. Select `[FIX] Replace with process.env.SLACK_BOT_TOKEN`
5. Code is automatically updated: `const token = process.env.SLACK_BOT_TOKEN;`
6. Create `.env` file with: `SLACK_BOT_TOKEN=your_token_here`

---

---

## Configuration

### Accessing Settings

Open VS Code Settings:
- Press `Ctrl+,` (or `Cmd+,` on Mac)
- Search for **"Chahuadev"**
- Or edit `.vscode/settings.json` directly

### General Settings

```json
{
  "chahuadev.enabled": true,
  "chahuadev.language": "th",
  "chahuadev.validateOnSave": true,
  "chahuadev.validateOnOpen": true,
  "chahuadev.validateOnType": false,
  "chahuadev.showWelcomeMessage": true,
  "chahuadev.maxProblemsPerFile": 100
}
```

**Settings Explained**:
- `enabled`: Master on/off switch for the extension
- `language`: UI language - `"th"` (Thai) or `"en"` (English)
- `validateOnSave`: Trigger validation when file is saved
- `validateOnOpen`: Trigger validation when file is opened
- `validateOnType`: Trigger validation as you type (performance impact)
- `showWelcomeMessage`: Show welcome message on first activation
- `maxProblemsPerFile`: Limit number of violations reported per file

### Rule-Specific Settings

Enable/disable individual rules:

```json
{
  "chahuadev.rules.noMocking": true,
  "chahuadev.rules.noHardcode": true,
  "chahuadev.rules.noSilentFallback": true,
  "chahuadev.rules.noInternalCache": true,
  "chahuadev.rules.noEmoji": true
}
```

### Severity Overrides

Customize severity levels (not recommended):

```json
{
  "chahuadev.severity.noMocking": "Error",
  "chahuadev.severity.noHardcode": "Error",
  "chahuadev.severity.noSilentFallback": "Error",
  "chahuadev.severity.noInternalCache": "Warning",
  "chahuadev.severity.noEmoji": "Error"
}
```

**Available Severities**: `"Error"`, `"Warning"`, `"Information"`, `"Hint"`

### Exclusion Patterns

Exclude files/directories from validation:

```json
{
  "chahuadev.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/*.min.js",
    "**/*.test.js",
    "**/*.spec.js",
    "**/vendor/**",
    "**/__tests__/**"
  ]
}
```

### Workspace vs User Settings

- **User Settings**: Apply to all projects globally
- **Workspace Settings**: Apply to current project only (recommended)

Example `.vscode/settings.json`:

```json
{
  "chahuadev.enabled": true,
  "chahuadev.language": "en",
  "chahuadev.rules.noMocking": true,
  "chahuadev.rules.noHardcode": true,
  "chahuadev.rules.noSilentFallback": true,
  "chahuadev.rules.noInternalCache": false,
  "chahuadev.rules.noEmoji": true,
  "chahuadev.excludePatterns": [
    "**/node_modules/**",
    "**/*.test.js"
  ]
}
```

---

## Supported File Types

Chahuadev Sentinel validates the following file types:

| Language | Extensions | Support Level |
|----------|------------|---------------|
| JavaScript | `.js` | Full support - 640+ patterns |
| TypeScript | `.ts` | Full support - 640+ patterns |
| JSX | `.jsx` | Full support - 640+ patterns |
| TSX | `.tsx` | Full support - 640+ patterns |

**Excluded by Default**: `node_modules/**`, `dist/**`, `build/**`, `*.min.js`, `vendor/**`

---

## Why These Rules Matter

### Technical Justification

| Rule | Problem Prevented | Technical Benefit | Production Impact |
|------|-------------------|-------------------|-------------------|
| **NO_MOCKING** | Tight coupling, fragile test suites, false confidence in tests | True dependency injection, testable architecture, integration test reliability | Fewer production failures from untested integration points |
| **NO_HARDCODE** | Environment coupling, credential leaks, deployment inflexibility | Configuration externalization, 12-factor app compliance, secure credential management | Faster deployments, better security posture |
| **NO_SILENT_FALLBACK** | Hidden bugs, silent failures, reduced system observability | Explicit error handling, improved debugging, comprehensive error logs | Lower MTTR, better incident response |
| **NO_INTERNAL_CACHE** | Shared mutable state, memory leaks, testing complexity | Pure functions, stateless design, horizontal scalability | Better performance under load, easier scaling |
| **NO_EMOJI** | Encoding issues, terminal compatibility, professionalism concerns | Cross-platform compatibility, consistent code presentation | No encoding bugs in CI/CD, professional codebase |

### Real-world Impact

**Without Chahuadev Sentinel:**
- Mock-heavy test suites pass but production code fails silently
- Hardcoded API tokens accidentally committed to version control
- Silent catch blocks mask critical payment processing failures
- Internal caches cause memory leaks in long-running Node.js services
- Emoji characters break Docker builds and CI/CD pipelines

**With Chahuadev Sentinel:**
- Violations caught instantly in IDE before commit
- One-click Quick Fixes provide immediate remediation
- Consistent code quality across entire team
- Best practices enforced automatically
- Professional, production-ready codebase maintained effortlessly

---

## Architecture & Technical Details

### Extension Components

```
chahuadev-vscode-extension/
├── src/
│   ├── extension.js            # Main entry point (428 lines)
│   │   ├── activate()          # Extension activation
│   │   ├── registerCommands()  # 6 commands registered
│   │   └── setupListeners()    # Document change listeners
│   │
│   ├── validator.js            # Core validation engine (1492 lines)
│   │   ├── ABSOLUTE_RULES      # 5 rule definitions
│   │   ├── 640+ patterns       # Comprehensive detection
│   │   └── validateDocument()  # Main validation logic
│   │
│   └── codeActionProvider.js  # Quick Fix provider (868 lines)
│       ├── 26 Quick Fixes      # Actionable solutions
│       ├── 10 helper functions # Pattern detection
│       └── Multi-language support (TH/EN)
│
├── package.json                # Extension manifest
│   ├── Activation events
│   ├── Contribution points
│   └── Configuration schema
│
└── .vscodeignore              # Package exclusions
```

### Pattern Detection Engine

The validator implements sophisticated pattern matching:

```javascript
// Example: NO_HARDCODE pattern detection
{
  pattern: /xoxb-[0-9A-Za-z-]+/,
  type: 'Slack Bot Token',
  envName: 'SLACK_BOT_TOKEN',
  sensitive: true
}

// Detected in real-time:
const token = 'xoxb-1234567890-abcdefghij'; // ❌ Violation detected instantly
```

**Detection Techniques:**
1. **Regex Pattern Matching**: 640+ compiled regular expressions
2. **Context Analysis**: Distinguishes legitimate vs problematic patterns
3. **AST Parsing**: Understanding code structure (future enhancement)
4. **Heuristic Scoring**: Confidence levels for each detection

### Quick Fix Architecture

Each Quick Fix implements the VS Code CodeAction API:

```javascript
// Example: Replace hardcoded token with process.env
const envVarFix = new vscode.CodeAction(
    `[FIX] Replace with process.env.${tokenType.envName}`,
    vscode.CodeActionKind.QuickFix
);
envVarFix.edit = new vscode.WorkspaceEdit();
envVarFix.edit.replace(uri, range, `process.env.${tokenType.envName}`);
envVarFix.isPreferred = true; // Show as default suggestion
```

### Integration with emoji-cleaner.js

Seamless integration with the standalone emoji cleaning tool:

```javascript
// Command: chahuadev.cleanEmojis
1. User clicks [AUTO] Clean all emojis Quick Fix
2. Extension loads ../chahuadev-emoji-cleaner-tool/emoji-cleaner.js
3. Executes removeEmojis() and removeEmojiComments()
4. Applies changes to document with WorkspaceEdit
5. Auto-saves file and re-validates
6. Shows success message in Output Channel
```

**Fallback Mechanism**: If emoji-cleaner.js not found, uses built-in regex-based removal.

---

## Advanced Usage

### Custom Validation Triggers

```json
{
  "chahuadev.validateOnSave": true,    // Validate when saving file
  "chahuadev.validateOnOpen": true,    // Validate when opening file
  "chahuadev.validateOnType": false,   // Validate as you type (performance impact)
  "chahuadev.maxProblemsPerFile": 100  // Limit diagnostics per file
}
```

### Workspace-wide Validation

Scan entire project at once:

```bash
# Via Command Palette
Ctrl+Shift+P → "Chahuadev: Validate Entire Workspace"

# Results shown in:
# - Problems Panel (all violations listed)
# - Output Channel (detailed logs)
# - Status Bar (total violation count)
```

### Excluding Files

```json
{
  "chahuadev.excludePatterns": [
    "**/node_modules/**",      // Dependencies
    "**/dist/**",              // Build output
    "**/build/**",             // Build output
    "**/*.min.js",             // Minified files
    "**/*.test.js",            // Test files (optional)
    "**/*.spec.js",            // Spec files (optional)
    "**/vendor/**",            // Third-party code
    "**/__tests__/**",         // Test directories
    "**/__mocks__/**",         // Mock directories
    "**/coverage/**"           // Coverage reports
  ]
}
```

### Language Selection

Switch between Thai and English:

```json
{
  "chahuadev.language": "th"  // Thai (ภาษาไทย)
  // or
  "chahuadev.language": "en"  // English
}
```

All messages, tooltips, and Quick Fixes will display in selected language.

---

## Troubleshooting

### Common Issues

#### 1. Extension Not Detecting Violations

**Symptoms**: No red underlines appear, Problems panel empty

**Solutions**:
- Check `chahuadev.enabled` is `true` in settings
- Verify file type is supported (`.js`, `.ts`, `.jsx`, `.tsx`)
- Check file is not in excluded patterns
- Run manual validation: `Chahuadev: Validate Current File`
- Check Output Channel for errors: `Chahuadev: Show Output`

#### 2. Quick Fixes Not Appearing

**Symptoms**: Lightbulb icon doesn't show, no code actions available

**Solutions**:
- Position cursor directly on red underline
- Wait 1-2 seconds for lightbulb to appear
- Check rule is enabled in settings (`chahuadev.rules.{ruleName}`)
- Try clicking on different part of underlined text
- Reload VS Code window: `Developer: Reload Window`

#### 3. Performance Issues

**Symptoms**: VS Code feels slow, high CPU usage, typing lag

**Solutions**:
- Disable `validateOnType`: Set to `false`
- Reduce `maxProblemsPerFile`: Set to `50` or lower
- Add more exclusion patterns for large directories
- Close unused files and editors
- Increase VS Code memory limit in settings

#### 4. Emoji Cleaner Not Working

**Symptoms**: Quick Fix "Clean all emojis" fails or does nothing

**Solutions**:
- Check emoji-cleaner.js is installed at `../chahuadev-emoji-cleaner-tool/`
- View error details in Output Channel: `Chahuadev: Show Output`
- Verify file has write permissions
- Try manual emoji removal Quick Fix (single line)
- Check file is saved before running cleaner

#### 5. Incorrect Detections (False Positives)

**Symptoms**: Code flagged as violation but is actually correct

**Solutions**:
- Use inline disable comments: `// chahuadev-disable-next-line NO_MOCKING`
- Add file to exclusion patterns if appropriate
- Report false positive on GitHub Issues with code sample
- Temporarily disable specific rule: `chahuadev.rules.{ruleName}: false`

### Debug Mode

Enable verbose logging:

```json
{
  "chahuadev.debug": true,  // Enable detailed logging
  "chahuadev.logLevel": "verbose"  // Log everything
}
```

Then check Output Channel: `View → Output → Select "Chahuadev"`

---

## Development & Contributing

### Setting Up Development Environment

```bash
# 1. Clone repository
git clone https://github.com/chahuadev/chahuadev-vscode-extension.git
cd chahuadev-vscode-extension

# 2. Install dependencies
npm install

# 3. Open in VS Code
code .

# 4. Press F5 to launch Extension Development Host
# A new VS Code window will open with extension loaded

# 5. Make changes and test
# Extension auto-reloads on file changes
```

### Project Structure

```
chahuadev-vscode-extension/
├── .vscode/               # VS Code configuration
│   └── launch.json        # Debug configuration
├── src/                   # Source code
│   ├── extension.js       # Main entry point
│   ├── validator.js       # Validation engine
│   └── codeActionProvider.js  # Quick Fixes
├── test/                  # Test suite (coming soon)
├── docs/                  # Documentation
├── package.json           # Extension manifest
├── .vscodeignore         # Packaging exclusions
└── README.md             # This file
```

### Adding New Patterns

To add detection for new violation patterns:

**1. Add Pattern to validator.js:**

```javascript
// In ABSOLUTE_RULES.NO_HARDCODE.patterns array:
{
    regex: /new-token-pattern-here/,
    name: 'New Token Type',
    severity: 'ERROR',
    explanation: {
        th: 'คำอธิบายภาษาไทย',
        en: 'English explanation'
    }
}
```

**2. Add Quick Fix to codeActionProvider.js:**

```javascript
// In getNoHardcodeFixes() method:
const newFix = new vscode.CodeAction(
    '[FIX] Fix description',
    vscode.CodeActionKind.QuickFix
);
// Implement fix logic...
fixes.push(newFix);
```

**3. Test in Extension Development Host (F5)**

**4. Submit Pull Request with:**
- Pattern description
- Test cases
- Documentation updates

### Running Tests

```bash
# Run test suite
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "pattern name"
```

### Building VSIX Package

```bash
# Install vsce (VS Code Extension CLI)
npm install -g @vscode/vsce

# Package extension
vsce package

# Output: chahuadev-sentinel-1.0.0.vsix
```

### Contributing Guidelines

1. **Fork & Clone**: Fork the repository and clone locally
2. **Branch**: Create feature branch: `git checkout -b feature/your-feature`
3. **Code**: Follow existing code style (2 spaces, semicolons, JSDoc comments)
4. **Test**: Add tests for new patterns and Quick Fixes
5. **Document**: Update README.md and code comments
6. **Commit**: Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`
7. **Push**: Push to your fork: `git push origin feature/your-feature`
8. **PR**: Open Pull Request with clear description

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed guidelines.

---

## Performance Considerations

### Validation Performance

| Setting | Performance Impact | Use Case |
|---------|-------------------|----------|
| `validateOnType: true` | **High** - Validates on every keystroke | Small files, fast machines |
| `validateOnSave: true` | **Medium** - Validates when saving | Recommended default |
| `validateOnOpen: true` | **Low** - Validates once on file open | Always recommended |
| `maxProblemsPerFile: 50` | **Faster** - Stops after 50 violations | Large legacy codebases |

### Memory Usage

- **Base**: ~50 MB (extension loaded)
- **Per File**: ~5 MB (active validation)
- **Workspace Scan**: ~200 MB (temporary spike)

### Optimization Tips

1. **Exclude Large Directories**: Add `node_modules`, `dist`, `build` to exclusions
2. **Limit Problem Count**: Set `maxProblemsPerFile: 50` for faster scans
3. **Disable On-Type Validation**: Turn off for large files
4. **Close Unused Files**: VS Code validates all open files
5. **Use Workspace Settings**: Different settings per project

---

## Roadmap

### Version 1.1 (Q1 2025)

- [ ] VS Code Marketplace publication
- [ ] Automated fix-all command for entire workspace
- [ ] Custom rule configuration (user-defined patterns)
- [ ] Integration with ESLint and Prettier
- [ ] Performance optimization for large codebases

### Version 1.2 (Q2 2025)

- [ ] AST-based parsing for more accurate detection
- [ ] Machine learning for false positive reduction
- [ ] Team-level rule enforcement and reporting
- [ ] CI/CD integration (GitHub Actions, GitLab CI)
- [ ] Pre-commit hook generation

### Version 2.0 (Q3 2025)

- [ ] Support for Python, Go, Ruby, PHP
- [ ] Cloud-based rule sharing and collaboration
- [ ] Real-time team-wide violation dashboard
- [ ] Auto-fix suggestions using GPT-4
- [ ] Comprehensive API for custom integrations

---

## FAQ

### Q: Can I use this with TypeScript?
**A**: Yes! Full support for `.ts` and `.tsx` files with all 640+ patterns.

### Q: Will this slow down my VS Code?
**A**: Minimal impact with default settings. Disable `validateOnType` if you experience lag.

### Q: Can I customize the rules?
**A**: Yes! Enable/disable individual rules, adjust severity, add exclusion patterns.

### Q: Does it work with ESLint/Prettier?
**A**: Yes, it complements (not replaces) ESLint. They check different things.

### Q: Can I add my own patterns?
**A**: Currently no, but planned for v1.1. Submit patterns via GitHub Issues for inclusion.

### Q: How do I disable for specific files?
**A**: Add inline comment: `// chahuadev-disable-file` at top of file.

### Q: Does it support monorepos?
**A**: Yes! Use workspace settings per package/project.

### Q: Can I use this in CI/CD?
**A**: Not yet, but planned. Use [chahuadev-scanner](https://github.com/chahuadev/chahuadev-scanner) CLI for CI/CD.

---

## License

MIT License

Copyright (c) 2025 Chahua Development Co., Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Related Projects

**Chahuadev Ecosystem:**

- **[chahuadev-scanner](https://github.com/chahuadev/chahuadev-scanner)** - CLI static analysis tool for CI/CD pipelines
- **[chahuadev-emoji-cleaner-tool](https://github.com/chahuadev/chahuadev-emoji-cleaner-tool)** - Standalone emoji removal utility
- **[chahuadev-fix-comments](https://github.com/chahuadev/chahuadev-fix-comments)** - Comment standardization and formatting tool
- **[chahuadev-framework](https://github.com/chahuadev/chahuadev-framework)** - Full-stack application framework with built-in code quality

---

## Acknowledgments

- **VS Code Extension API**: Built with [vscode](https://code.visualstudio.com/api) extension framework
- **Inspired By**: ESLint, TSLint, SonarQube, and other static analysis tools
- **Testing Frameworks**: The mock libraries we detect (but don't endorse for production overuse)
- **Community**: Thanks to all contributors and early adopters
- **Open Source**: Standing on the shoulders of giants

---

## Support & Contact

### Get Help

- **Documentation**: [GitHub Wiki](https://github.com/chahuadev/chahuadev-vscode-extension/wiki)
- **Bug Reports**: [GitHub Issues](https://github.com/chahuadev/chahuadev-vscode-extension/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/chahuadev/chahuadev-vscode-extension/discussions)
- **Questions**: [Stack Overflow](https://stackoverflow.com/questions/tagged/chahuadev) (tag: `chahuadev`)

### Contact Us

- **Email**: chahuadev@gmail.com
- **Website**: [Chahua Development Co., Ltd.](https://chahuadev.com)
- **GitHub**: [@chahuadev](https://github.com/chahuadev)
- **Twitter**: [@chahuadev](https://twitter.com/chahuadev)

---

<div align="center">

### Made with ❤️ by Chahua Development Co., Ltd.

**"Zero Tolerance for Anti-patterns, Maximum Support for Quality Code"**

[⭐ Star us on GitHub](https://github.com/chahuadev/chahuadev-vscode-extension) | [🐛 Report Bug](https://github.com/chahuadev/chahuadev-vscode-extension/issues) | [💡 Request Feature](https://github.com/chahuadev/chahuadev-vscode-extension/issues/new)

</div>