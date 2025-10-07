//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// Corpus Testing Tool - Real World Code Testing
// ============================================================================
// ทดสอบแกรมม่ากับโค้ดจริงจากโปรเจกต์ Open Source ขนาดใหญ่
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GrammarIndex } from './grammar-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CORPUS CONFIGURATION - Load from external config file
// ============================================================================

function loadCorpusConfig() {
    try {
        const configPath = path.join(__dirname, 'corpus-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configData);
        return config;
    } catch (error) {
        throw new Error(`Failed to load corpus configuration: ${error.message}`);
    }
}

const config = loadCorpusConfig();
const CORPUS_PROJECTS = config.corpusProjects;
const TESTING_CONFIG = config.testingConfig;

// ============================================================================
// CORPUS TESTER CLASS
// ============================================================================

class CorpusTester {
    constructor() {
        this.grammarIndex = new GrammarIndex();
        this.results = {
            totalFiles: 0,
            successfulFiles: 0,
            failedFiles: 0,
            totalTokens: 0,
            errors: [],
            edgeCases: [],
            unsupportedPatterns: []
        };
        this.failedFiles = [];
    }

    /**
     * Run corpus testing on all configured projects
     */
    async testAll() {
        console.log(' Starting Corpus Testing...\n');
        console.log('Testing against real-world open source projects:\n');

        for (const project of CORPUS_PROJECTS) {
            await this.testProject(project);
        }

        this.printReport();
        return this.results;
    }

    /**
     * Test a single project
     */
    async testProject(project) {
        console.log(` Testing ${project.name}...`);
        console.log(`   ${project.description}`);

        const projectPath = path.resolve(process.cwd(), project.path);

        // Check if project exists
        if (!fs.existsSync(projectPath)) {
            console.log(`     Project not found at ${projectPath}`);
            console.log(`    Install with: npm install ${project.name.toLowerCase()}\n`);
            return;
        }

        // Find all files
        const files = this.findFiles(projectPath, project.extensions);
        console.log(`   Found ${files.length} files`);

        let projectSuccess = 0;
        let projectFailed = 0;

        // Test each file
        for (const file of files) {
            const result = await this.testFile(file, project.name);
            if (result.success) {
                projectSuccess++;
            } else {
                projectFailed++;
            }
        }

        console.log(`    Success: ${projectSuccess} files`);
        console.log(`    Failed: ${projectFailed} files`);
        console.log('');
    }

    /**
     * Test a single file
     */
    async testFile(filePath, projectName) {
        this.results.totalFiles++;

        try {
            // Read file
            const content = fs.readFileSync(filePath, 'utf-8');

            // Skip empty files
            if (content.trim().length === 0) {
                return { success: true, tokens: 0 };
            }

            // Try to tokenize
            const tokens = this.tokenize(content, filePath);

            // Success
            this.results.successfulFiles++;
            this.results.totalTokens += tokens.length;

            return {
                success: true,
                tokens: tokens.length
            };

        } catch (error) {
            // Failure
            this.results.failedFiles++;

            const failedFile = {
                project: projectName,
                file: path.basename(filePath),
                path: filePath,
                error: error.message,
                line: error.line,
                column: error.column
            };

            this.failedFiles.push(failedFile);
            this.results.errors.push(failedFile);

            // Detect edge cases
            this.detectEdgeCase(content, error, filePath);

            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Tokenize content (simple implementation)
     */
    tokenize(content, filePath) {
        const tokens = [];
        const lines = content.split('\n');

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum];
            const words = line.split(/\s+/).filter(w => w.length > 0);

            for (const word of words) {
                // Check if word is in grammar
                const grammarInfo = this.grammarIndex.lookup(word);

                if (grammarInfo) {
                    tokens.push({
                        type: grammarInfo.category,
                        value: word,
                        line: lineNum + 1,
                        grammar: grammarInfo
                    });
                } else {
                    // Unknown token
                    tokens.push({
                        type: 'UNKNOWN',
                        value: word,
                        line: lineNum + 1
                    });
                }
            }
        }

        return tokens;
    }

    /**
     * Detect edge cases from failed parsing
     */
    detectEdgeCase(content, error, filePath) {
        const patterns = [
            { regex: /\/\*[\s\S]*?\*\/|\/\/.*/g, name: 'Complex comments' },
            { regex: /`[^`]*`/g, name: 'Template literals' },
            { regex: /\/.*\/[gimuy]*/g, name: 'Regular expressions' },
            { regex: /<[^>]+>/g, name: 'JSX/XML syntax' },
            { regex: /\?\?|\?\./g, name: 'Optional chaining / Nullish coalescing' },
            { regex: /async\s+function\s*\*/g, name: 'Async generators' },
            { regex: /#\w+/g, name: 'Private fields' },
            { regex: /import\.meta/g, name: 'Import meta' },
            { regex: /export\s+\*/g, name: 'Namespace re-exports' }
        ];

        for (const pattern of patterns) {
            if (pattern.regex.test(content)) {
                this.results.edgeCases.push({
                    file: path.basename(filePath),
                    pattern: pattern.name,
                    error: error.message
                });
            }
        }
    }

    /**
     * Find all files with given extensions
     */
    findFiles(dir, extensions, fileList = []) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // Skip node_modules and hidden directories
                if (!file.startsWith('.') && file !== 'node_modules') {
                    this.findFiles(filePath, extensions, fileList);
                }
            } else {
                // Check extension
                const ext = path.extname(file);
                if (extensions.includes(ext)) {
                    fileList.push(filePath);
                }
            }
        }

        return fileList;
    }

    /**
     * Print testing report
     */
    printReport() {
        console.log('\n' + '='.repeat(80));
        console.log(' CORPUS TESTING REPORT');
        console.log('='.repeat(80) + '\n');

        // Statistics
        console.log(' Statistics:');
        console.log(`   Total Files Tested: ${this.results.totalFiles}`);
        console.log(`    Successful: ${this.results.successfulFiles} (${this.getPercentage(this.results.successfulFiles, this.results.totalFiles)}%)`);
        console.log(`    Failed: ${this.results.failedFiles} (${this.getPercentage(this.results.failedFiles, this.results.totalFiles)}%)`);
        console.log(`    Total Tokens: ${this.results.totalTokens.toLocaleString()}`);
        console.log('');

        // Failed files
        if (this.failedFiles.length > 0) {
            console.log(' Failed Files (showing first 10):');
            this.failedFiles.slice(0, 10).forEach((fail, idx) => {
                console.log(`   ${idx + 1}. [${fail.project}] ${fail.file}`);
                console.log(`      Error: ${fail.error}`);
                if (fail.line) {
                    console.log(`      Location: Line ${fail.line}, Column ${fail.column}`);
                }
            });
            if (this.failedFiles.length > 10) {
                console.log(`   ... and ${this.failedFiles.length - 10} more files`);
            }
            console.log('');
        }

        // Edge cases
        if (this.results.edgeCases.length > 0) {
            console.log(' Detected Edge Cases:');
            const edgeCaseMap = new Map();

            this.results.edgeCases.forEach(ec => {
                const count = edgeCaseMap.get(ec.pattern) || 0;
                edgeCaseMap.set(ec.pattern, count + 1);
            });

            for (const [pattern, count] of edgeCaseMap.entries()) {
                console.log(`   ${pattern}: ${count} occurrences`);
            }
            console.log('');
        }

        // Recommendations
        console.log(' Recommendations:');
        if (this.results.failedFiles === 0) {
            console.log('    Excellent! Grammar handles all tested files perfectly!');
        } else {
            console.log('    Review failed files to identify missing grammar rules');
            console.log('    Add disambiguation rules for edge cases');
            console.log('    Update grammar with patterns from real-world code');
        }
        console.log('');

        console.log('='.repeat(80) + '\n');
    }

    /**
     * Calculate percentage
     */
    getPercentage(value, total) {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(2);
    }

    /**
     * Export results to JSON
     */
    exportResults(outputPath) {
        const results = {
            timestamp: new Date().toISOString(),
            summary: {
                totalFiles: this.results.totalFiles,
                successfulFiles: this.results.successfulFiles,
                failedFiles: this.results.failedFiles,
                totalTokens: this.results.totalTokens,
                successRate: this.getPercentage(this.results.successfulFiles, this.results.totalFiles)
            },
            failedFiles: this.failedFiles,
            edgeCases: this.results.edgeCases
        };

        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(` Results exported to ${outputPath}`);
    }
}

// ============================================================================
// EXPORT
// ============================================================================

export { CorpusTester };

// Run testing if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const tester = new CorpusTester();
    await tester.testAll();

    // Export results
    const outputPath = path.join(__dirname, 'corpus-test-results.json');
    tester.exportResults(outputPath);
}
