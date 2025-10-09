
---

<div align="center">
  <img src="https://raw.githubusercontent.com/chahuadev/chahuadev/main/icon.png" alt="Chahuadev Framework" width="150"/>
  <h1> Chahuadev Sentinel</h1>

[![Version](https://img.shields.io/badge/version-1.0.0BATA-blue?style=for-the-badge)](https://github.com/chahuadev/chahuadev-emoji-cleaner-tool)
[![Issues](https://img.shields.io/badge/Report_Issues-GitHub_Issues-red?style=for-the-badge&logo=github)](https://github.com/chahuadev/chahuadev-Sentinel/issues)
[![Discussions](https://img.shields.io/badge/Feature_Requests-GitHub_Discussions-blue?style=for-the-badge&logo=github)](https://github.com/chahuadev/chahuadev-Sentinel/discussions)
[![Contact](https://img.shields.io/badge/Contact-chahuadev@gmail.com-green?style=for-the-badge&logo=gmail)](mailto:chahuadev@gmail.com)

</div>

---

**Code Quality Checker for Chahua Development Standards**

A comprehensive VS Code extension and CLI tool that enforces code quality standards, security policies, and best practices for JavaScript, TypeScript, JSX, and Java projects.

##  Features

- ** Real-time Code Analysis** - Smart AST-based parsing with Acorn and Babel
- ** Security-First Approach** - Built-in security middleware and threat detection
- ** Multi-Language Support** - JavaScript, TypeScript, JSX, and Java
- ** Absolute Rules Enforcement** - 5 core rules that cannot be disabled
- ** Performance Optimized** - Grammar indexing and fuzzy search capabilities
- ** VS Code Integration** - Seamless editor experience with real-time feedback
- ** CLI Tool** - Command-line interface for CI/CD integration

##  Quick Start

### Installation

#### VS Code Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Chahuadev Sentinel"
4. Click Install

#### CLI Tool
```bash
npm install -g chahuadev-sentinel
```

### Usage

#### VS Code
The extension automatically activates for JavaScript, TypeScript, JSX files. Use:
- `Ctrl+Shift+P`  "Chahuadev Sentinel: Scan Current File"
- `Ctrl+Shift+P`  "Chahuadev Sentinel: Scan Entire Workspace"

#### CLI
```bash
# Scan current directory
chahuadev-sentinel .

# Scan specific files
chahuadev-sentinel src/**/*.js

# JSON output for CI/CD
chahuadev-sentinel --json src/ > report.json

# Quiet mode (errors only)
chahuadev-sentinel --quiet src/
```

##  The 5 Absolute Rules

1. **NO_MOCKING** - No mock data or stub implementations in production
2. **NO_HARDCODE** - No hardcoded values, use configuration files
3. **NO_EMOJI** - No emoji in code comments or strings
4. **NO_EXTERNAL_API** - No external API calls without proper abstraction
5. **NO_STUB_CODE** - No placeholder or temporary code

##  Architecture

### Core Components

- **Smart Parser Engine** - AST analysis with fallback strategies
- **Grammar Index System** - Fast keyword and pattern matching
- **Security Middleware** - Multi-layered security validation
- **Validation Engine** - Rule enforcement and violation reporting

### Supported Languages

- **JavaScript** (ES2022+)
- **TypeScript** (5.0+)
- **JSX/TSX** (React 18+)
- **Java** (SE 21)

##  Documentation

### Essential Documentation
- **[Code of Conduct](docs/CODE_OF_CONDUCT.md)** - Community standards and behavior guidelines
- **[Contributing Guidelines](docs/CONTRIBUTING.md)** - How to contribute to the project
- **[Security Policy](docs/SECURITY.md)** - Security policies and vulnerability reporting

### Development Documentation
- **[API Reference](docs/API.md)** - Complete programming interface documentation
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and architecture overview
- **[Commit Guidelines](docs/COMMIT_GUIDELINES.md)** - Professional commit message standards

### Project Management
- **[Governance Model](docs/GOVERNANCE.md)** - Project leadership and decision-making
- **[Collaboration Guidelines](docs/COLLABORATION.md)** - Open source collaboration practices
- **[Release Process](docs/RELEASE_PROCESS.md)** - Release procedures and quality assurance
- [Architecture Guide](docs/ARCHITECTURE.md) - System design and architecture
- [Security Guide](docs/SECURITY.md) - Security policies and procedures

##  Contributing

We welcome contributions from the community! Please read our documentation before getting started:

- **[Contributing Guidelines](docs/CONTRIBUTING.md)** - Complete contribution procedures
- **[Commit Guidelines](docs/COMMIT_GUIDELINES.md)** - Professional commit message standards  
- **[Collaboration Guidelines](docs/COLLABORATION.md)** - Open source collaboration practices

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  About Chahua Development

**บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)**

We are committed to creating high-quality, secure, and maintainable software solutions. Our tools and standards reflect our dedication to excellence in software development.

- **Website**: https://chahuadev.com
- **Email**: chahuadev@gmail.com
- **Repository**: https://github.com/chahuadev/chahuadev-Sentinel.git

##  Support

- **Issues**: [GitHub Issues](https://github.com/chahuadev/chahuadev-Sentinel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chahuadev/chahuadev-Sentinel/discussions)
- **Email**: chahuadev@gmail.com

##  Project Status

- **Version**: 1.0.0
- **Status**: Active Development
- **Maintenance**: Actively Maintained
- **Node.js**: >=22.0.0
- **VS Code**: >=1.104.0

---

**Made with  by Chahua Development Co., Ltd.**