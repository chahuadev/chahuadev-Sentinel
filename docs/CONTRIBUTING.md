//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================

# Contributing to Chahuadev Sentinel

**Professional Code Quality Checker for JavaScript/TypeScript Projects**

## Welcome Contributors

Thank you for your interest in contributing to Chahuadev Sentinel. This document provides guidelines for contributing to our open source project.

## Code of Conduct

### Core Principles

**ABSOLUTE RULES - NO EXCEPTIONS**

1. **NO_MOCKING**: Never mock or ridicule any code, technology, or contributor
2. **NO_HARDCODE**: All values must be configurable through configuration files
3. **NO_EMOJI**: Use text-based indicators only, never emoji characters
4. **NO_STUB_BEHAVIOR**: Implement real functionality, avoid stub patterns
5. **NO_INTERNAL_LEAKS**: Never expose internal implementation details

### Professional Standards

- Write clean, readable, and maintainable code
- Follow established coding patterns and conventions
- Provide comprehensive documentation for new features
- Include appropriate test coverage for contributions
- Respect intellectual property and licensing requirements

## Getting Started

### Prerequisites

- Node.js 14.0.0 or higher
- Git version control system
- Basic understanding of JavaScript/TypeScript
- Familiarity with VS Code extension development (for extension contributions)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/chahuadev/chahuadev-Sentinel.git
cd chahuadev-Sentinel

# Install dependencies
npm install

# Run tests to ensure everything works
npm test

# Validate project structure
npm run validate-project
```

### Project Structure

```
chahuadev-Sentinel/
├── src/                    # Main source code
│   ├── extension.js        # VS Code extension entry point
│   ├── validator.js        # Core validation engine
│   ├── grammars/          # Language grammar definitions
│   └── security/          # Security middleware
├── cli.js                 # Command-line interface
├── extension-wrapper.js   # CommonJS wrapper for VS Code
├── test/                  # Test suite
├── docs/                  # Documentation
└── package.json          # Project configuration
```

## Contribution Guidelines

### Code Contributions

#### Before Starting

1. **Check existing issues** for similar problems or features
2. **Create an issue** describing your proposed changes
3. **Wait for feedback** from maintainers before starting work
4. **Fork the repository** and create a feature branch

#### Development Process

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes following project standards
# Test thoroughly before committing

# Commit with clear messages
git commit -m "Add feature: brief description of changes"

# Push to your fork
git push origin feature/your-feature-name

# Create pull request with detailed description
```

#### Code Quality Standards

**File Headers**
Every JavaScript file must include the standard header:

```javascript
//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
```

**Configuration-Driven Development**
- Use JSON configuration files for all constants
- Never hardcode strings, numbers, or other values
- Reference configuration through proper imports

**Error Handling**
- Implement comprehensive error handling
- Provide meaningful error messages
- Include proper logging for debugging

**Testing Requirements**
- Write unit tests for new functionality
- Ensure existing tests continue to pass
- Test edge cases and error conditions
- Validate integration with existing systems

### Documentation Contributions

#### Documentation Standards

- Write in clear, professional English
- Include code examples where appropriate
- Maintain consistent formatting and style
- Update related documentation when making code changes

#### Types of Documentation

**API Documentation**
- Function signatures and parameters
- Return values and types
- Usage examples and best practices
- Error conditions and handling

**User Guides**
- Step-by-step installation instructions
- Configuration options and examples
- Common use cases and workflows
- Troubleshooting guides

**Developer Guides**
- Architecture overview and design decisions
- Extension development guidelines
- Testing strategies and best practices
- Performance optimization techniques

### Bug Reports

#### Required Information

**System Information**
- Operating System and version
- Node.js version
- VS Code version (for extension issues)
- Project dependencies and versions

**Problem Description**
- Clear description of the issue
- Steps to reproduce the problem
- Expected behavior vs actual behavior
- Error messages and stack traces

**Code Examples**
- Minimal code sample demonstrating the issue
- Configuration files (with sensitive data removed)
- Command-line arguments used
- Relevant file structure

### Feature Requests

#### Request Format

**Problem Statement**
- Description of the current limitation
- Impact on development workflow
- Business case for the enhancement

**Proposed Solution**
- Detailed description of desired functionality
- Alternative approaches considered
- Implementation suggestions (optional)

**Use Cases**
- Specific scenarios where feature would help
- Expected user interaction patterns
- Integration with existing functionality

## Review Process

### Pull Request Review

**Automated Checks**
- Code quality validation
- Test suite execution
- Security vulnerability scanning
- Performance impact assessment

**Human Review**
- Code style and standards compliance
- Architecture and design review
- Documentation quality assessment
- Test coverage evaluation

### Acceptance Criteria

**Technical Requirements**
- All tests must pass
- Code must follow project standards
- Documentation must be updated
- Performance impact must be acceptable

**Quality Standards**
- Clean, readable, and maintainable code
- Proper error handling and logging
- Comprehensive test coverage
- Clear and accurate documentation

## Release Process

### Version Management

**Semantic Versioning**
- Major: Breaking changes or significant new features
- Minor: New features with backward compatibility
- Patch: Bug fixes and minor improvements

**Release Schedule**
- Regular maintenance releases
- Security patches as needed
- Feature releases based on roadmap

### Testing Requirements

**Pre-Release Testing**
- Full test suite execution
- Manual testing of new features
- Performance regression testing
- Security vulnerability assessment

## Community Guidelines

### Communication Channels

**GitHub Issues**
- Bug reports and feature requests
- Technical discussions and questions
- Project planning and roadmap discussions

**Pull Requests**
- Code review and collaboration
- Implementation discussions
- Testing and validation feedback

### Professional Standards

**Respectful Communication**
- Constructive feedback and criticism
- Professional language and tone
- Inclusive and welcoming environment
- Focus on technical merit and project goals

**Collaborative Approach**
- Open discussion of technical decisions
- Shared responsibility for code quality
- Mentoring and knowledge sharing
- Recognition of contributor efforts

## Legal and Licensing

### Intellectual Property

**MIT License**
- All contributions are released under MIT license
- Contributors retain copyright to their contributions
- Permissive license allows commercial and personal use

**Third-Party Code**
- Ensure proper licensing for any third-party code
- Document dependencies and their licenses
- Avoid GPL or other copyleft licenses

### Contributor License Agreement

By contributing to this project, you agree to:
- License your contributions under the MIT license
- Confirm you have the right to contribute the code
- Waive any patent claims related to your contributions
- Allow modification and redistribution of your contributions

## Getting Help

### Documentation Resources

**Project Documentation**
- README.md for project overview
- API documentation in docs/ directory
- Code comments and inline documentation

**External Resources**
- VS Code extension development guides
- JavaScript/TypeScript best practices
- Node.js documentation and tutorials

### Support Channels

**Technical Questions**
- GitHub Issues for project-related questions
- Stack Overflow for general programming questions
- Official documentation for framework-specific issues

**Contact Information**
- Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
- Email: chahuadev@gmail.com
- Issues: GitHub Issues tracker

---

**Thank you for contributing to Chahuadev Sentinel!**

Your contributions help make this tool better for the entire JavaScript/TypeScript development community.