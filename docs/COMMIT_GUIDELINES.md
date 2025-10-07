//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================

# Commit Message Guidelines

**Professional Standards for Git Commit Messages**

## Overview

This document provides comprehensive guidelines for writing clear, consistent, and professional commit messages for the Chahua Development projects.

## Commit Message Structure

### Basic Format

```
type(scope): brief description

Detailed explanation of changes (optional)

Additional context, breaking changes, or references (optional)
```

### Example

```
feat(validator): add TypeScript interface validation

Add comprehensive TypeScript interface validation to support
complex type checking and inheritance patterns.

- Implement interface member validation
- Add inheritance chain resolution
- Include generic type parameter support

Resolves: #123
Breaking Change: Updates validation API interface
```

## Commit Types

### Primary Types

**feat**: New feature implementation
```
feat(cli): add JSON output format support
feat(extension): implement real-time validation
```

**fix**: Bug fix or error correction
```
fix(parser): resolve AST parsing memory leak
fix(security): patch vulnerability in file scanning
```

**docs**: Documentation changes only
```
docs(api): update validation engine documentation
docs(readme): add installation troubleshooting guide
```

**refactor**: Code restructuring without feature changes
```
refactor(grammar): optimize Trie data structure performance
refactor(config): consolidate configuration management
```

**test**: Adding or modifying tests
```
test(validator): add comprehensive rule validation tests
test(integration): implement end-to-end CLI testing
```

**perf**: Performance improvements
```
perf(parser): optimize AST traversal algorithms
perf(memory): reduce validation engine memory usage
```

**chore**: Maintenance tasks and updates
```
chore(deps): update @babel/parser to version 7.28.4
chore(build): configure automated testing pipeline
```

### Specialized Types

**security**: Security-related changes
```
security(middleware): implement rate limiting protection
security(scan): add malicious code pattern detection
```

**config**: Configuration file updates
```
config(eslint): update linting rules for TypeScript
config(vscode): add extension development settings
```

**build**: Build system or CI/CD changes
```
build(npm): configure package publishing workflow
build(github): setup automated release process
```

## Scope Guidelines

### Project Scopes

**Core Components**
- `validator`: Core validation engine
- `parser`: AST parsing and analysis
- `grammar`: Language grammar definitions
- `cli`: Command-line interface
- `extension`: VS Code extension functionality

**Feature Areas**
- `security`: Security middleware and protection
- `config`: Configuration management
- `test`: Testing infrastructure
- `docs`: Documentation system
- `api`: Public API interfaces

**Language Support**
- `javascript`: JavaScript-specific features
- `typescript`: TypeScript-specific features
- `jsx`: JSX/React-specific features
- `java`: Java language support

### Scope Examples

```
feat(validator): implement new validation rule
fix(cli): resolve file scanning issue
docs(grammar): update language support documentation
refactor(security): optimize middleware performance
test(parser): add AST generation test cases
```

## Message Content Guidelines

### Subject Line Rules

**Length Limit**
- Maximum 72 characters
- Aim for 50 characters when possible
- Use imperative mood (Add, Fix, Update)
- No period at the end

**Format Standards**
```
# Good Examples
feat(cli): add verbose output option
fix(parser): resolve undefined variable detection
docs(api): update validation method signatures

# Poor Examples
Added new CLI feature for verbose output (too long)
Fixed bug (too vague)
Update docs. (has period, too vague)
```

### Body Content

**When to Include Body**
- Complex changes requiring explanation
- Breaking changes or API modifications
- Multiple related changes in one commit
- Context that helps reviewers understand changes

**Body Format**
- Separate from subject with blank line
- Wrap at 72 characters per line
- Use bullet points for multiple changes
- Explain what and why, not how

### Footer Information

**Issue References**
```
Resolves: #123
Fixes: #456
References: #789
Related: #101, #202
```

**Breaking Changes**
```
Breaking Change: Validation API interface updated
BREAKING CHANGE: Configuration format changed from JSON to YAML
```

**Co-authors**
```
Co-authored-by: John Doe <john.doe@example.com>
Co-authored-by: Jane Smith <jane.smith@example.com>
```

## Advanced Examples

### Feature Implementation

```
feat(grammar): add Java generics support

Implement comprehensive Java generics validation including:
- Type parameter declaration validation
- Bounded type parameters (extends/super)
- Wildcard type argument support
- Generic method and constructor validation

This enhancement improves Java code analysis accuracy
from 85% to 96% based on test corpus evaluation.

Resolves: #234
Performance: Adds 12ms to average validation time
```

### Bug Fix

```
fix(security): prevent directory traversal attack

Resolve security vulnerability where malicious file paths
could escape scan directory boundaries using relative
path manipulation (../../../etc/passwd).

- Add path normalization and validation
- Implement whitelist-based path filtering
- Include comprehensive path traversal tests

Security Impact: Critical
Affects: All CLI and extension file operations
CVE: Pending assignment
```

### Documentation Update

```
docs(contributing): add commit message guidelines

Create comprehensive commit message standards to improve
project consistency and maintainability:

- Define commit types and scope conventions
- Provide examples for common scenarios
- Include security and performance considerations
- Add automated validation workflow integration

This documentation supports our goal of maintaining
professional development standards across all contributions.

Related: #456
```

### Refactoring

```
refactor(parser): migrate from regex to AST-based validation

Replace regex-based pattern matching with proper AST analysis
for improved accuracy and maintainability:

- Remove 15 complex regex patterns
- Implement visitor pattern for AST traversal
- Add proper scope resolution and context tracking
- Improve error location reporting accuracy

Performance Impact:
- 40% faster validation on large files
- 60% reduction in false positive detections
- 25% lower memory usage during parsing

Breaking Change: Internal parser API modified
Migration Guide: See docs/migration/parser-v2.md
```

## Commit Message Validation

### Automated Checks

**Format Validation**
- Subject line length limits
- Proper type and scope format
- Required fields presence
- Breaking change indicators

**Content Quality**
- No placeholder text or TODO markers
- Proper grammar and spelling
- Appropriate detail level
- Issue reference format

### Manual Review Guidelines

**Reviewer Checklist**
- [ ] Clear and descriptive subject line
- [ ] appropriate commit type and scope
- [ ] Sufficient context in body (if needed)
- [ ] Proper issue references
- [ ] Breaking change documentation
- [ ] No sensitive information exposure

## Integration Guidelines

### Git Workflow Integration

**Branch Naming**
```
feature/add-java-generics-support
bugfix/fix-directory-traversal
docs/update-api-documentation
refactor/optimize-parser-performance
```

**Pull Request Titles**
Use commit message format for PR titles:
```
feat(grammar): add Java generics support
fix(security): prevent directory traversal attack
```

### Automated Workflows

**Commit Hooks**
- Pre-commit: Format and type validation
- Pre-push: Integration test execution
- Post-commit: Documentation generation

**CI/CD Integration**
- Automatic changelog generation
- Semantic version determination
- Release note compilation
- Issue status updates

## Tools and Resources

### Validation Tools

**Commitlint Configuration**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'refactor', 
      'test', 'perf', 'chore', 'security', 
      'config', 'build'
    ]],
    'scope-enum': [2, 'always', [
      'validator', 'parser', 'grammar', 'cli', 
      'extension', 'security', 'config', 'test', 
      'docs', 'api'
    ]],
    'subject-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', 'lower-case']
  }
};
```

**Git Hooks Setup**
```bash
# Install commitlint
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Setup git hooks
npx husky install
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

### IDE Integration

**VS Code Extensions**
- Conventional Commits: Guided commit message creation
- GitLens: Enhanced commit history visualization
- Git Graph: Visual commit graph and history

**Command Line Tools**
- `git commit -m "type(scope): description"`
- `git commit --template .gitmessage`
- Interactive commit tools for guided message creation

## Best Practices Summary

### DO

- Use imperative mood in subject lines
- Include scope when changes affect specific components
- Provide context for complex changes
- Reference related issues and PRs
- Document breaking changes clearly
- Keep commits atomic and focused

### DON'T

- Use past tense or present continuous tense
- Include emoji or special characters
- Write vague or generic descriptions
- Combine unrelated changes in one commit
- Forget to reference important issues
- Include sensitive information in messages

### Quality Indicators

**Good Commit Message Characteristics**
- Clear and specific description
- Appropriate level of detail
- Proper formatting and grammar
- Relevant scope and type
- Helpful for future reference

**Signs of Poor Quality**
- Generic descriptions like "fix bug" or "update code"
- Missing context for complex changes
- Incorrect type or scope classification
- Grammar errors or typos
- Missing issue references for bug fixes

---

**Following these guidelines helps maintain a professional and maintainable project history that benefits all contributors and users.**