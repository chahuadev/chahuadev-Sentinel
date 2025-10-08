#!/usr/bin/env node
//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
/**
 * Chahuadev Sentinel CLI
 * Command-line interface for code quality checking
 */

import { ABSOLUTE_RULES } from './src/validator.js';
import { createSmartParserEngine } from './src/grammars/index.js';
import fs from 'fs';
import path from 'path';

// Load CLI configuration from JSON 
const cliConfig = JSON.parse(
    fs.readFileSync(new URL('./cli-config.json', import.meta.url), 'utf8')
);

class ChahuadevCLI {
    constructor() {
        this.engine = null;
        this.config = cliConfig; // WHY: Store config reference for use in methods (NO_HARDCODE)
        this.stats = {
            totalFiles: 0,
            totalViolations: 0,
            processedFiles: 0
        };
    }

    async initialize() {
        try {
            // อ่านกฎจาก validator.js (หนังสือ) และส่งต่อให้ parser engine
            this.rules = ABSOLUTE_RULES;
            this.engine = await createSmartParserEngine(ABSOLUTE_RULES);
            console.log(cliConfig.messages.cliInitialized);
            return true;
        } catch (error) {
            console.error(`${cliConfig.messages.initializationFailed} ${error.message}`);
            return false;
        }
    }

    showProjectInfo() {
        console.log(`
======================================================================
${cliConfig.projectInfo.author}
Repository: ${cliConfig.projectInfo.repository}
Version: ${cliConfig.projectInfo.version}
License: ${cliConfig.projectInfo.license}
Contact: ${cliConfig.projectInfo.contact}
======================================================================
`);
    }

    showHelp() {
        this.showProjectInfo();
        console.log(`
${cliConfig.helpText.header}

${cliConfig.helpText.usage}

Options:`);
        cliConfig.helpText.options.forEach(option => console.log(`  ${option}`));
        console.log(`
Examples:`);
        cliConfig.helpText.examples.forEach(example => console.log(`  ${example}`));
        console.log(`
${cliConfig.helpText.footer}`);
    }

    showVersion() {
        this.showProjectInfo();
        const packageJson = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
        console.log(`${packageJson.displayName} v${packageJson.version}`);
    }

    async scanFile(filePath, options = {}) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`${cliConfig.messages.fileNotFound} ${filePath}`);
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const results = this.engine.analyzeCode(content, filePath);
            
            this.stats.processedFiles++;
            this.stats.totalViolations += results.violations.length;

            if (!options.quiet && results.violations.length > 0) {
                console.log(`\\n${filePath}:`);
                results.violations.forEach(violation => {
                    const location = violation.location ? `${violation.location.line}:${violation.location.column}` : '?:?';
                    const severityLabel = this.getSeverityLabel(violation.severity);
                    console.log(`  ${severityLabel} ${location} - ${violation.message} [${violation.ruleId}]`);
                });
            } else if (options.verbose && results.violations.length === 0) {
                console.log(`${filePath} - ${cliConfig.messages.noViolations}`);
            }

            return results;
        } catch (error) {
            console.error(`${cliConfig.messages.errorScanning} ${filePath}: ${error.message}`);
            return { violations: [], error: error.message };
        }
    }

    getSeverityLabel(severity) {
        const level = severity?.toUpperCase() || 'INFO';
        return cliConfig.severityLabels[level] || cliConfig.severityLabels.INFO;
    }

    async scanPattern(pattern, options = {}) {
        try {
            // Use configured patterns with fallback
            const scanPattern = pattern || cliConfig.defaultPatterns.include;
            const files = await this.findFilesRecursive(scanPattern);

            if (files.length === 0) {
                console.log(`${cliConfig.messages.noFilesFound} ${scanPattern}`);
                return [];
            }

            this.stats.totalFiles = files.length;
            
            if (!options.quiet) {
                console.log(`\\n${cliConfig.messages.scanningFiles} (${files.length} files)`);
            }

            const results = [];
            for (const file of files) {
                const result = await this.scanFile(file, options);
                results.push({ file, ...result });
            }

            return results;
        } catch (error) {
            console.error(`${cliConfig.messages.errorScanning}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Find files recursively without external dependencies
     */
    async findFilesRecursive(pattern) {
        const results = [];
        
        // WHY: Read from config (NO_HARDCODE compliance)
        // NO_SILENT_FALLBACKS: Config MUST exist - no defaults allowed
        const extensions = this.config.fileExtensions;
        
        if (!extensions || !Array.isArray(extensions) || extensions.length === 0) {
            throw new Error(
                'Configuration error: fileExtensions is required in cli-config.json\n' +
                'Expected: { "fileExtensions": [".js", ".ts", ".jsx", ".tsx"] }\n' +
                'NO_HARDCODE: We cannot use hardcoded defaults.'
            );
        }
        
        const scanDirectory = (dir) => {
            try {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    
                    if (entry.isDirectory()) {
                        // Skip node_modules and other common ignore patterns
                        if (!this.shouldIgnoreDirectory(entry.name)) {
                            scanDirectory(fullPath);
                        }
                    } else if (entry.isFile()) {
                        const ext = path.extname(entry.name);
                        if (extensions.includes(ext)) {
                            results.push(fullPath);
                        }
                    }
                }
            } catch (error) {
                // Skip directories we cannot read
                console.error(`Warning: Cannot read directory ${dir}: ${error.message}`);
            }
        };

        // Handle different pattern types
        if (pattern.includes('/') || pattern.includes('\\')) {
            // Path-based pattern
            const basePath = pattern.replace(/[*]/g, '');
            if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
                scanDirectory(basePath);
            } else if (fs.existsSync(pattern) && fs.statSync(pattern).isFile()) {
                results.push(pattern);
            }
        } else {
            // Scan current directory
            scanDirectory(process.cwd());
        }

        return results;
    }

    /**
     * Check if directory should be ignored
     * COMPLIANCE: NO_HARDCODE - read patterns from config file
     */
    shouldIgnoreDirectory(name) {
        // COMPLIANCE: NO_HARDCODE - get ignore patterns from config
        const ignorePatterns = cliConfig.ignoreDirectories || [];
        return ignorePatterns.includes(name) || name.startsWith('.');
    }

    showSummary(results, options = {}) {
        const hasViolations = this.stats.totalViolations > 0;
        
        if (options.json) {
            const jsonOutput = {
                summary: {
                    totalFiles: this.stats.totalFiles,
                    processedFiles: this.stats.processedFiles,
                    totalViolations: this.stats.totalViolations
                },
                results: results
            };
            console.log(JSON.stringify(jsonOutput, null, 2));
        } else {
            console.log(`\\n${cliConfig.messages.summaryHeader}`);
            console.log(`   ${cliConfig.messages.filesScanned} ${this.stats.processedFiles}/${this.stats.totalFiles}`);
            console.log(`   ${cliConfig.messages.totalViolations} ${this.stats.totalViolations}`);
            
            if (hasViolations) {
                console.log(`\\n${cliConfig.messages.qualityCheckFailed}`);
            } else {
                console.log(`\\n${cliConfig.messages.qualityCheckPassed}`);
            }
        }
        
        return hasViolations ? 1 : 0; // Exit code
    }
}

async function main() {
    const args = process.argv.slice(2);
    const options = {
        quiet: args.includes('--quiet') || args.includes('-q'),
        verbose: args.includes('--verbose'),
        json: args.includes('--json'),
        help: args.includes('--help') || args.includes('-h'),
        version: args.includes('--version') || args.includes('-v')
    };

    const cli = new ChahuadevCLI();

    if (options.help) {
        cli.showHelp();
        return 0;
    }

    if (options.version) {
        cli.showVersion();
        return 0;
    }

    // Show project info at startup (unless quiet mode)
    if (!options.quiet) {
        cli.showProjectInfo();
    }

    // Initialize the engine
    const initialized = await cli.initialize();
    if (!initialized) {
        return 1;
    }

    // Get file patterns (remove flags from args)
    const patterns = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));
    
    try {
        let results = [];
        
        if (patterns.length === 0) {
            // Use default pattern
            results = await cli.scanPattern(undefined, options);
        } else {
            // Process each pattern
            for (const pattern of patterns) {
                const patternResults = await cli.scanPattern(pattern, options);
                results.push(...patternResults);
            }
        }

        const exitCode = cli.showSummary(results, options);
        return exitCode;
        
    } catch (error) {
        console.error(`${cliConfig.messages.cliExecutionFailed} ${error.message}`);
        return 1;
    }
}

// Run CLI if called directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
    import.meta.url.endsWith('/cli.js') || 
    process.argv[1].endsWith('cli.js')) {
    main().then(exitCode => {
        process.exit(exitCode);
    }).catch(error => {
        console.error(`${cliConfig.messages.fatalError}`, error);
        process.exit(1);
    });
}

export { ChahuadevCLI };