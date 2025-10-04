// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Code Action Provider - Quick Fixes with Maximum Detail
// ======================================================================

const vscode = require('vscode');

/**
 * Provides quick fixes (lightbulb) for Chahuadev rule violations
 */
class CodeActionProvider {
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
    }

    static get providedCodeActionKinds() {
        return [vscode.CodeActionKind.QuickFix];
    }

    /**
     * Provide code actions for diagnostics
     * @param {vscode.TextDocument} document
     * @param {vscode.Range | vscode.Selection} range
     * @param {vscode.CodeActionContext} context
     * @returns {vscode.CodeAction[]}
     */
    provideCodeActions(document, range, context) {
        const config = vscode.workspace.getConfiguration('chahuadev');
        const language = config.get('language', 'th');

        const codeActions = [];

        // Only provide quick fixes for Chahuadev diagnostics
        const chahuadevDiagnostics = context.diagnostics.filter(
            diagnostic => diagnostic.source === 'Chahuadev'
        );

        for (const diagnostic of chahuadevDiagnostics) {
            const ruleCode = diagnostic.code;

            switch (ruleCode) {
                case 'NO_MOCKING':
                    codeActions.push(...this.getNoMockingFixes(document, diagnostic, language));
                    break;
                case 'NO_HARDCODE':
                    codeActions.push(...this.getNoHardcodeFixes(document, diagnostic, language));
                    break;
                case 'NO_SILENT_FALLBACK':
                    codeActions.push(...this.getNoSilentFallbackFixes(document, diagnostic, language));
                    break;
                case 'NO_INTERNAL_CACHE':
                    codeActions.push(...this.getNoInternalCacheFixes(document, diagnostic, language));
                    break;
                case 'NO_EMOJI':
                    codeActions.push(...this.getNoEmojiFixes(document, diagnostic, language));
                    break;
            }
        }

        return codeActions;
    }

    /**
     * Quick fixes for NO_MOCKING rule
     */
    getNoMockingFixes(document, diagnostic, language) {
        const fixes = [];
        const line = document.lineAt(diagnostic.range.start.line);
        const lineText = line.text;
        const indent = line.text.match(/^\s*/)?.[0] || '';

        // Detect specific mock type for better fix suggestions
        const mockType = this.detectMockType(lineText);

        // Fix 1: Comment out the mock
        const commentFix = new vscode.CodeAction(
            language === 'th'
                ? `[FIX] คอมเมนต์ ${mockType.name} นี้ออก (ใช้ Dependency Injection)`
                : `[FIX] Comment out ${mockType.name} (use Dependency Injection)`,
            vscode.CodeActionKind.QuickFix
        );
        commentFix.diagnostics = [diagnostic];
        commentFix.edit = new vscode.WorkspaceEdit();
        commentFix.edit.replace(
            document.uri,
            line.range,
            `${indent}// ${line.text.trim()} // TODO: Replace with Dependency Injection`
        );
        commentFix.isPreferred = true;
        fixes.push(commentFix);

        // Fix 2: Delete import statement if it's a mocking library import
        if (lineText.includes('import') || lineText.includes('require')) {
            const deleteImportFix = new vscode.CodeAction(
                language === 'th'
                    ? 'ลบการ import mock library'
                    : 'Delete mock library import',
                vscode.CodeActionKind.QuickFix
            );
            deleteImportFix.diagnostics = [diagnostic];
            deleteImportFix.edit = new vscode.WorkspaceEdit();
            deleteImportFix.edit.delete(document.uri, line.rangeIncludingLineBreak);
            fixes.push(deleteImportFix);
        }

        // Fix 3: Replace with Dependency Injection pattern (for common cases)
        if (mockType.canAutoFix) {
            const diFix = new vscode.CodeAction(
                language === 'th'
                    ? 'แทนที่ด้วย Dependency Injection parameter'
                    : 'Replace with Dependency Injection parameter',
                vscode.CodeActionKind.QuickFix
            );
            diFix.diagnostics = [diagnostic];
            diFix.edit = new vscode.WorkspaceEdit();

            const replacement = this.generateDIReplacement(lineText, mockType, indent);
            if (replacement) {
                diFix.edit.replace(document.uri, line.range, replacement);
                fixes.push(diFix);
            }
        }

        // Fix 4: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? 'เรียนรู้เกี่ยวกับ Dependency Injection'
                : 'Learn about Dependency Injection pattern',
            vscode.CodeActionKind.QuickFix
        );
        docFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'เปิดคู่มือ Dependency Injection' : 'Open Dependency Injection Guide',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/Dependency-Injection')]
        };
        fixes.push(docFix);

        // Fix 5: Show examples
        const exampleFix = new vscode.CodeAction(
            language === 'th'
                ? 'ดูตัวอย่างการแก้ไข mock'
                : 'View mock refactoring examples',
            vscode.CodeActionKind.QuickFix
        );
        exampleFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'ตัวอย่าง' : 'Examples',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/Mock-Refactoring-Examples')]
        };
        fixes.push(exampleFix);

        return fixes;
    }

    /**
     * Quick fixes for NO_HARDCODE rule
     */
    getNoHardcodeFixes(document, diagnostic, language) {
        const fixes = [];
        const line = document.lineAt(diagnostic.range.start.line);
        const lineText = line.text;
        const indent = line.text.match(/^\s*/)?.[0] || '';

        // Detect type of hardcoded value
        const hardcodeType = this.detectHardcodeType(lineText);

        // Extract hardcoded value
        const urlMatch = lineText.match(/['"]https?:\/\/[^'"]+['"]/);
        const apiKeyMatch = lineText.match(/['"][a-zA-Z0-9_-]{20,}['"]/);
        const tokenMatch = lineText.match(/(?:api[_-]?key|token|secret|password):\s*['"][^'"]+['"]/i);

        // Fix 1: Replace with environment variable
        const envVarFix = new vscode.CodeAction(
            language === 'th'
                ? `[FIX] แทนที่ด้วย process.env.${hardcodeType.envName}`
                : `[FIX] Replace with process.env.${hardcodeType.envName}`,
            vscode.CodeActionKind.QuickFix
        );
        envVarFix.diagnostics = [diagnostic];
        envVarFix.edit = new vscode.WorkspaceEdit();

        const envVarReplacement = this.generateEnvVarReplacement(lineText, hardcodeType);
        if (envVarReplacement) {
            envVarFix.edit.replace(document.uri, line.range, envVarReplacement);
            envVarFix.isPreferred = true;
            fixes.push(envVarFix);
        }

        // Fix 2: Extract to constant at top of file
        if (urlMatch || apiKeyMatch) {
            const extractFix = new vscode.CodeAction(
                language === 'th'
                    ? `[FIX] แยกไปเป็น constant ${hardcodeType.constantName} (ควรย้ายไป config)`
                    : `[FIX] Extract to ${hardcodeType.constantName} constant (move to config)`,
                vscode.CodeActionKind.QuickFix
            );
            extractFix.diagnostics = [diagnostic];
            extractFix.edit = new vscode.WorkspaceEdit();

            const hardcodedValue = urlMatch ? urlMatch[0] : (apiKeyMatch ? apiKeyMatch[0] : null);
            if (hardcodedValue) {
                const replacement = lineText.replace(hardcodedValue, hardcodeType.constantName);

                // Insert constant declaration at top of file
                const todoComment = language === 'th'
                    ? `// TODO: ย้าย ${hardcodeType.constantName} ไปไฟล์ config.js หรือ .env\n`
                    : `// TODO: Move ${hardcodeType.constantName} to config.js or .env\n`;

                extractFix.edit.insert(
                    document.uri,
                    new vscode.Position(0, 0),
                    `${todoComment}const ${hardcodeType.constantName} = ${hardcodedValue}; // TEMPORARY - MUST MOVE TO CONFIG!\n\n`
                );

                // Replace usage
                extractFix.edit.replace(document.uri, line.range, replacement);
                fixes.push(extractFix);
            }
        }

        // Fix 3: Comment out
        const commentFix = new vscode.CodeAction(
            language === 'th'
                ? '[FIX] คอมเมนต์บรรทัดนี้ออก'
                : '[FIX] Comment out this line',
            vscode.CodeActionKind.QuickFix
        );
        commentFix.diagnostics = [diagnostic];
        commentFix.edit = new vscode.WorkspaceEdit();
        commentFix.edit.replace(
            document.uri,
            line.range,
            `${indent}// ${line.text.trim()} // TODO: Move to config/env file - ${hardcodeType.type} detected`
        );
        fixes.push(commentFix);

        // Fix 4: Create .env file entry (show as information)
        const envFileFix = new vscode.CodeAction(
            language === 'th'
                ? 'สร้างรายการใน .env file'
                : 'Create .env file entry',
            vscode.CodeActionKind.QuickFix
        );
        envFileFix.command = {
            command: 'chahuadev.showEnvExample',
            title: language === 'th' ? 'แสดงตัวอย่าง .env' : 'Show .env example',
            arguments: [hardcodeType.envName, lineText]
        };
        fixes.push(envFileFix);

        // Fix 5: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? `ทำไมห้าม hardcode ${hardcodeType.type}?`
                : `Why hardcoding ${hardcodeType.type} is problematic?`,
            vscode.CodeActionKind.QuickFix
        );
        docFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'เปิดคู่มือ Configuration' : 'Open Configuration Guide',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/No-Hardcode')]
        };
        fixes.push(docFix);

        // Fix 6: Show security implications for sensitive data
        if (hardcodeType.sensitive) {
            const securityFix = new vscode.CodeAction(
                language === 'th'
                    ? 'ข้อมูลนี้เป็น sensitive data - อ่านด้วน security best practices'
                    : 'This is sensitive data - read security best practices',
                vscode.CodeActionKind.QuickFix
            );
            securityFix.command = {
                command: 'vscode.open',
                title: 'Security Guide',
                arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/Security-Best-Practices')]
            };
            fixes.push(securityFix);
        }

        return fixes;
    }

    /**
     * Quick fixes for NO_SILENT_FALLBACK rule
     */
    getNoSilentFallbackFixes(document, diagnostic, language) {
        const fixes = [];

        // Fix 1: Add error logging
        const logFix = new vscode.CodeAction(
            language === 'th'
                ? '[FIX] เพิ่ม logger.error() ก่อน return'
                : '[FIX] Add logger.error() before return',
            vscode.CodeActionKind.QuickFix
        );
        logFix.diagnostics = [diagnostic];
        logFix.edit = new vscode.WorkspaceEdit();

        const line = document.lineAt(diagnostic.range.start.line);
        const indent = line.text.match(/^\s*/)?.[0] || '';

        // Find the catch block and add logging
        const catchLine = this.findCatchBlockStart(document, diagnostic.range.start.line);
        if (catchLine !== -1) {
            const errorVar = this.extractErrorVariable(document, catchLine);
            const insertPosition = new vscode.Position(catchLine + 1, 0);
            const logMessage = language === 'th'
                ? `${indent}    logger.error('Error caught:', ${errorVar}); // บันทึก error ก่อน return\n`
                : `${indent}    logger.error('Error caught:', ${errorVar}); // Log before returning\n`;
            logFix.edit.insert(document.uri, insertPosition, logMessage);
        }
        logFix.isPreferred = true;
        fixes.push(logFix);

        // Fix 2: Throw instead of return
        const throwFix = new vscode.CodeAction(
            language === 'th'
                ? '[FIX] Throw error แทนการ return ค่า default'
                : '[FIX] Throw error instead of returning default',
            vscode.CodeActionKind.QuickFix
        );
        throwFix.diagnostics = [diagnostic];
        throwFix.edit = new vscode.WorkspaceEdit();

        const returnMatch = line.text.match(/return\s+([^;]+);/);
        if (returnMatch) {
            const errorVar = this.extractErrorVariable(document, this.findCatchBlockStart(document, diagnostic.range.start.line));
            const newText = line.text.replace(/return\s+[^;]+;/, `throw ${errorVar};`);
            throwFix.edit.replace(document.uri, line.range, newText);
        }
        fixes.push(throwFix);

        // Fix 3: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? 'ทำไม silent fallback เป็นอันตราย?'
                : 'Why silent fallbacks are dangerous?',
            vscode.CodeActionKind.QuickFix
        );
        docFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'เปิดคู่มือ Error Handling' : 'Open Error Handling Guide',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/No-Silent-Fallback')]
        };
        fixes.push(docFix);

        return fixes;
    }

    /**
     * Quick fixes for NO_INTERNAL_CACHE rule
     */
    getNoInternalCacheFixes(document, diagnostic, language) {
        const fixes = [];
        const line = document.lineAt(diagnostic.range.start.line);
        const lineText = line.text;
        const indent = line.text.match(/^\s*/)?.[0] || '';

        // Detect cache library/pattern
        const cacheLib = this.detectCacheLibrary(lineText);

        // Fix 1: Remove cache wrapper (library-specific)
        if (cacheLib.canRemove) {
            const removeFix = new vscode.CodeAction(
                language === 'th'
                    ? `[FIX] ลบ ${cacheLib.name} wrapper ออก`
                    : `[FIX] Remove ${cacheLib.name} wrapper`,
                vscode.CodeActionKind.QuickFix
            );
            removeFix.diagnostics = [diagnostic];
            removeFix.edit = new vscode.WorkspaceEdit();

            let unwrappedCode = lineText;

            // React useMemo: useMemo(() => calculation, [deps]) -> calculation
            if (cacheLib.library === 'react' && /useMemo/.test(lineText)) {
                unwrappedCode = lineText.replace(/useMemo\s*\(\s*\(\)\s*=>\s*([^,]+),\s*\[[^\]]*\]\s*\)/, '$1');
            }
            // Lodash/Ramda memoize: _.memoize(fn) -> fn
            else if (cacheLib.library === 'lodash' || cacheLib.library === 'ramda') {
                unwrappedCode = lineText.replace(/[_R]\.memoize\s*\(([^)]+)\)/, '$1');
            }
            // Other memoize libraries: memoizee(fn) -> fn
            else if (cacheLib.library === 'memoizee' || cacheLib.library === 'fast-memoize' || cacheLib.library === 'moize') {
                unwrappedCode = lineText.replace(/\w+\s*\(([^)]+)\)/, '$1');
            }
            // Manual Map cache: delete the Map initialization line
            else if (cacheLib.name.includes('Manual Map')) {
                unwrappedCode = `${indent}// ${lineText.trim()} // TODO: Remove internal cache - let caller handle it`;
            }

            removeFix.edit.replace(document.uri, line.range, unwrappedCode);
            removeFix.isPreferred = true;
            fixes.push(removeFix);
        }

        // Fix 2: Comment out cache with library-specific note
        const commentFix = new vscode.CodeAction(
            language === 'th'
                ? `[FIX] คอมเมนต์ ${cacheLib.name} ออก`
                : `[FIX] Comment out ${cacheLib.name}`,
            vscode.CodeActionKind.QuickFix
        );
        commentFix.diagnostics = [diagnostic];
        commentFix.edit = new vscode.WorkspaceEdit();
        const todoText = language === 'th'
            ? `// TODO: ลบ ${cacheLib.name} internal cache - ให้ caller จัดการ`
            : `// TODO: Remove ${cacheLib.name} internal cache - let caller handle`;
        commentFix.edit.replace(
            document.uri,
            line.range,
            `${indent}// ${line.text.trim()} ${todoText}`
        );
        if (!cacheLib.canRemove) {
            commentFix.isPreferred = true; // Prefer comment if can't auto-remove
        }
        fixes.push(commentFix);

        // Fix 3: Extract to decorator/HOC (for memoization)
        if (cacheLib.library === 'react' || cacheLib.library === 'lodash' || cacheLib.library === 'ramda') {
            const decoratorFix = new vscode.CodeAction(
                language === 'th'
                    ? '[FIX] แยกไป decorator/HOC ที่ caller เรียกใช้'
                    : '[FIX] Extract to decorator/HOC at caller',
                vscode.CodeActionKind.QuickFix
            );
            decoratorFix.command = {
                command: 'chahuadev.showDecoratorExample',
                title: language === 'th' ? 'แสดงตัวอย่าง decorator' : 'Show decorator example',
                arguments: [cacheLib.library]
            };
            fixes.push(decoratorFix);
        }

        // Fix 4: Show external caching alternatives
        const alternativesFix = new vscode.CodeAction(
            language === 'th'
                ? '[FIX] ใช้ external cache (Redis/Memcached) แทน'
                : '[FIX] Use external cache (Redis/Memcached) instead',
            vscode.CodeActionKind.QuickFix
        );
        alternativesFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'ตัวอย่าง External Cache' : 'External Cache Examples',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/External-Caching-Solutions')]
        };
        fixes.push(alternativesFix);

        // Fix 5: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? `[DOCS] ทำไม ${cacheLib.name} internal cache เป็นปัญหา?`
                : `[DOCS] Why ${cacheLib.name} internal caching is problematic?`,
            vscode.CodeActionKind.QuickFix
        );
        docFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'เปิดคู่มือ External Caching' : 'Open External Caching Guide',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/External-Caching')]
        };
        fixes.push(docFix);

        return fixes;
    }

    /**
     * Quick fixes for NO_EMOJI rule
     */
    getNoEmojiFixes(document, diagnostic, language) {
        const fixes = [];
        const line = document.lineAt(diagnostic.range.start.line);
        const lineText = line.text;

        // Fix 1: Clean ALL emojis in entire file using emoji-cleaner.js
        const cleanAllFix = new vscode.CodeAction(
            language === 'th'
                ? '[AUTO] ลบอิโมจิทั้งหมดในไฟล์นี้ (emoji-cleaner.js)'
                : '[AUTO] Clean all emojis in this file (emoji-cleaner.js)',
            vscode.CodeActionKind.QuickFix
        );
        cleanAllFix.isPreferred = true;
        cleanAllFix.command = {
            command: 'chahuadev.cleanEmojis',
            title: language === 'th' ? 'ลบอิโมจิทั้งหมด' : 'Clean all emojis',
            arguments: [document.uri]
        };
        fixes.push(cleanAllFix);

        // Common emoji to text mappings
        const emojiMap = {
            '✅': 'success',
            '❌': 'error',
            '⚠️': 'warning',
            '🚀': 'launch',
            '🔥': 'hot',
            '💡': 'idea',
            '📝': 'note',
            '📌': 'important',
            '🎯': 'target',
            '⭐': 'star',
            '👍': 'approve',
            '👎': 'reject',
            '🔴': 'red',
            '🟢': 'green',
            '🟡': 'yellow',
            '⚡': 'fast',
            '🐛': 'bug',
            '🎉': 'celebrate',
            '💾': 'save',
            '🔒': 'locked',
            '🔓': 'unlocked',
        };

        // Fix 2: Auto-replace common emoji on this line only
        const autoReplace = this.findAndReplaceEmoji(lineText, emojiMap);
        if (autoReplace.replaced) {
            const replaceFix = new vscode.CodeAction(
                language === 'th'
                    ? `[FIX] แทนที่อิโมจิด้วย "${autoReplace.replacement}" (บรรทัดนี้เท่านั้น)`
                    : `[FIX] Replace emoji with "${autoReplace.replacement}" (this line only)`,
                vscode.CodeActionKind.QuickFix
            );
            replaceFix.diagnostics = [diagnostic];
            replaceFix.edit = new vscode.WorkspaceEdit();
            replaceFix.edit.replace(document.uri, line.range, autoReplace.text);
            fixes.push(replaceFix);
        }

        // Fix 3: Remove emoji on this line only
        const removeFix = new vscode.CodeAction(
            language === 'th'
                ? '[FIX] ลบอิโมจิออก (บรรทัดนี้เท่านั้น)'
                : '[FIX] Remove emoji (this line only)',
            vscode.CodeActionKind.QuickFix
        );
        removeFix.diagnostics = [diagnostic];
        removeFix.edit = new vscode.WorkspaceEdit();
        // Remove all emoji using comprehensive regex
        const cleanText = lineText.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '');
        removeFix.edit.replace(document.uri, line.range, cleanText);
        fixes.push(removeFix);

        // Fix 4: Comment out line
        const commentFix = new vscode.CodeAction(
            language === 'th'
                ? '[FIX] คอมเมนต์บรรทัดนี้ออก'
                : '[FIX] Comment out this line',
            vscode.CodeActionKind.QuickFix
        );
        commentFix.diagnostics = [diagnostic];
        commentFix.edit = new vscode.WorkspaceEdit();
        const indent = line.text.match(/^\s*/)?.[0] || '';
        commentFix.edit.replace(
            document.uri,
            line.range,
            `${indent}// ${line.text.trim()} // TODO: Replace emoji with text`
        );
        fixes.push(commentFix);

        // Fix 5: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? '[DOCS] ทำไมต้องห้ามใช้อิโมจิในโค้ด?'
                : '[DOCS] Why emoji in code is problematic?',
            vscode.CodeActionKind.QuickFix
        );
        docFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'เปิดคู่มือ Emoji Policy' : 'Open Emoji Policy Guide',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/No-Emoji')]
        };
        fixes.push(docFix);

        return fixes;
    }

    /**
     * Find and replace emoji with text equivalent
     */
    findAndReplaceEmoji(text, emojiMap) {
        for (const [emoji, replacement] of Object.entries(emojiMap)) {
            if (text.includes(emoji)) {
                return {
                    replaced: true,
                    replacement: replacement,
                    text: text.replace(emoji, replacement)
                };
            }
        }
        return { replaced: false };
    }

    /**
     * Find the line where catch block starts
     */
    findCatchBlockStart(document, startLine) {
        for (let i = startLine; i >= Math.max(0, startLine - 20); i--) {
            const lineText = document.lineAt(i).text;
            if (/catch\s*\(/.test(lineText)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Extract error variable name from catch block
     */
    extractErrorVariable(document, catchLine) {
        if (catchLine === -1) return 'error';

        const lineText = document.lineAt(catchLine).text;
        const match = lineText.match(/catch\s*\(\s*(\w+)\s*\)/);
        return match ? match[1] : 'error';
    }

    /**
     * Detect specific type of mock library/pattern
     */
    detectMockType(lineText) {
        const mockTypes = [
            { pattern: /jest\.mock|jest\.spyOn|jest\.fn/, name: 'Jest mock', library: 'jest', canAutoFix: true },
            { pattern: /sinon\.(stub|spy|mock)|createStubInstance/, name: 'Sinon stub/spy', library: 'sinon', canAutoFix: true },
            { pattern: /vi\.mock|vi\.spyOn|vi\.fn/, name: 'Vitest mock', library: 'vitest', canAutoFix: true },
            { pattern: /rest\.(get|post|put|delete)|graphql\.(query|mutation)|setupServer/, name: 'MSW (Mock Service Worker)', library: 'msw', canAutoFix: true },
            { pattern: /nock\(|\.get\(|\.post\(|\.reply\(/, name: 'Nock HTTP mock', library: 'nock', canAutoFix: true },
            { pattern: /fetchMock\.|fetch-mock/, name: 'Fetch Mock', library: 'fetch-mock', canAutoFix: true },
            { pattern: /shallow|mount|render.*enzyme/, name: 'Enzyme (deprecated)', library: 'enzyme', canAutoFix: true },
            { pattern: /td\.|testdouble/, name: 'TestDouble.js', library: 'testdouble', canAutoFix: true },
            { pattern: /proxyquire/, name: 'Proxyquire', library: 'proxyquire', canAutoFix: true },
            { pattern: /rewire/, name: 'Rewire', library: 'rewire', canAutoFix: true },
            { pattern: /mock\.module|mock\.fn/, name: 'Node.js native mock', library: 'node:test', canAutoFix: false },
            { pattern: /\.prototype\.\w+\s*=\s*function/, name: 'Prototype monkey patch', library: null, canAutoFix: false },
            { pattern: /global\.\w+\s*=/, name: 'Global mock assignment', library: null, canAutoFix: false }
        ];

        for (const mockType of mockTypes) {
            if (mockType.pattern.test(lineText)) {
                return mockType;
            }
        }

        return { name: 'Unknown mock', library: null, canAutoFix: false };
    }

    /**
     * Generate Dependency Injection replacement code
     */
    generateDIReplacement(lineText, mockType, indent) {
        // Extract function/module name being mocked
        let moduleName = 'service';

        if (mockType.library === 'jest' || mockType.library === 'vitest') {
            const mockMatch = lineText.match(/mock\(['"]([^'"]+)['"]/);
            if (mockMatch) {
                moduleName = mockMatch[1].split('/').pop().replace(/\.\w+$/, '');
            }
        }

        // Generate DI parameter suggestion
        const diCode = `${indent}// TODO: Replace mock with Dependency Injection\n` +
            `${indent}// Example:\n` +
            `${indent}// constructor(private ${moduleName}Service: I${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Service) {}\n` +
            `${indent}// Pass real implementation in production, test double in tests\n`;

        return diCode;
    }

    /**
     * Detect type of hardcoded value
     */
    detectHardcodeType(lineText) {
        const types = [
            // Platform-specific tokens
            { pattern: /xoxb-[0-9A-Za-z-]+/, type: 'Slack Bot Token', envName: 'SLACK_BOT_TOKEN', constantName: 'SLACK_BOT_TOKEN', sensitive: true },
            { pattern: /xoxp-[0-9A-Za-z-]+/, type: 'Slack User Token', envName: 'SLACK_USER_TOKEN', constantName: 'SLACK_USER_TOKEN', sensitive: true },
            { pattern: /ghp_[a-zA-Z0-9]{36}/, type: 'GitHub Personal Access Token', envName: 'GITHUB_TOKEN', constantName: 'GITHUB_TOKEN', sensitive: true },
            { pattern: /ghs_[a-zA-Z0-9]{36}/, type: 'GitHub Secret Token', envName: 'GITHUB_SECRET', constantName: 'GITHUB_SECRET', sensitive: true },
            { pattern: /glpat-[a-zA-Z0-9_-]+/, type: 'GitLab Personal Access Token', envName: 'GITLAB_TOKEN', constantName: 'GITLAB_TOKEN', sensitive: true },
            { pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/, type: 'SendGrid API Key', envName: 'SENDGRID_API_KEY', constantName: 'SENDGRID_API_KEY', sensitive: true },
            { pattern: /SK[a-zA-Z0-9]{32}/, type: 'Twilio API Key', envName: 'TWILIO_API_KEY', constantName: 'TWILIO_API_KEY', sensitive: true },
            { pattern: /AC[a-f0-9]{32}/, type: 'Twilio Account SID', envName: 'TWILIO_ACCOUNT_SID', constantName: 'TWILIO_ACCOUNT_SID', sensitive: true },
            { pattern: /sk_live_[a-zA-Z0-9]{24,}/, type: 'Stripe Live Key', envName: 'STRIPE_SECRET_KEY', constantName: 'STRIPE_SECRET_KEY', sensitive: true },
            { pattern: /sk_test_[a-zA-Z0-9]{24,}/, type: 'Stripe Test Key', envName: 'STRIPE_TEST_KEY', constantName: 'STRIPE_TEST_KEY', sensitive: true },
            { pattern: /AKIA[0-9A-Z]{16}/, type: 'AWS Access Key', envName: 'AWS_ACCESS_KEY_ID', constantName: 'AWS_ACCESS_KEY_ID', sensitive: true },
            { pattern: /amzn\.mws\.[0-9a-f-]{36}/, type: 'AWS MWS Token', envName: 'AWS_MWS_TOKEN', constantName: 'AWS_MWS_TOKEN', sensitive: true },

            // SSH and crypto
            { pattern: /-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/, type: 'SSH Private Key', envName: 'SSH_PRIVATE_KEY', constantName: 'SSH_PRIVATE_KEY', sensitive: true },
            { pattern: /ssh-rsa AAAA[0-9A-Za-z+/]+/, type: 'SSH Public Key', envName: 'SSH_PUBLIC_KEY', constantName: 'SSH_PUBLIC_KEY', sensitive: false },
            { pattern: /[13][a-km-zA-HJ-NP-Z1-9]{25,34}/, type: 'Bitcoin Address', envName: 'BTC_WALLET_ADDRESS', constantName: 'BTC_WALLET_ADDRESS', sensitive: true },
            { pattern: /0x[a-fA-F0-9]{40}/, type: 'Ethereum Address', envName: 'ETH_WALLET_ADDRESS', constantName: 'ETH_WALLET_ADDRESS', sensitive: true },

            // Generic patterns
            { pattern: /api[_-]?key['"]?\s*[:=]\s*['"][^'"]{20,}['"]/, type: 'API Key', envName: 'API_KEY', constantName: 'API_KEY', sensitive: true },
            { pattern: /secret['"]?\s*[:=]\s*['"][^'"]{20,}['"]/, type: 'Secret', envName: 'SECRET_KEY', constantName: 'SECRET_KEY', sensitive: true },
            { pattern: /password['"]?\s*[:=]\s*['"][^'"]+['"]/, type: 'Password', envName: 'PASSWORD', constantName: 'DB_PASSWORD', sensitive: true },
            { pattern: /token['"]?\s*[:=]\s*['"][^'"]{20,}['"]/, type: 'Access Token', envName: 'ACCESS_TOKEN', constantName: 'ACCESS_TOKEN', sensitive: true },
            { pattern: /bearer\s+[a-zA-Z0-9_-]+/, type: 'Bearer Token', envName: 'BEARER_TOKEN', constantName: 'BEARER_TOKEN', sensitive: true },
            { pattern: /https?:\/\/[^\s'"]+/, type: 'URL', envName: 'API_URL', constantName: 'API_BASE_URL', sensitive: false }
        ];

        for (const type of types) {
            if (type.pattern.test(lineText)) {
                return type;
            }
        }

        return { type: 'Hardcoded Value', envName: 'CONFIG_VALUE', constantName: 'CONFIG_VALUE', sensitive: false };
    }

    /**
     * Generate environment variable replacement code
     */
    generateEnvVarReplacement(lineText, hardcodeType) {
        // Find the hardcoded value
        const patterns = [
            /['"]https?:\/\/[^'"]+['"]/,
            /['"][a-zA-Z0-9_-]{20,}['"]/,
            /(?:api[_-]?key|token|secret|password):\s*['"]([^'"]+)['"]/i
        ];

        for (const pattern of patterns) {
            const match = lineText.match(pattern);
            if (match) {
                const indent = lineText.match(/^\s*/)?.[0] || '';
                return lineText.replace(match[0], `process.env.${hardcodeType.envName}`);
            }
        }

        return null;
    }

    /**
     * Detect error handling context
     */
    detectErrorContext(lineText, document, lineNumber) {
        const contexts = [];

        // Check for catch block
        const catchMatch = lineText.match(/catch\s*\(([^)]+)\)/);
        if (catchMatch) {
            return {
                type: 'catch-block',
                errorVar: catchMatch[1].trim(),
                loggerType: 'logger.error',
                throwAction: 'Re-throw',
                canThrow: true
            };
        }

        // Check for Promise.catch
        if (/\.catch\s*\(/.test(lineText)) {
            return {
                type: 'promise-catch',
                errorVar: 'err',
                loggerType: 'logger.error',
                throwAction: 'Throw',
                canThrow: true
            };
        }

        // Check for event handler
        if (/on\w+\s*=|addEventListener\s*\(/.test(lineText)) {
            return {
                type: 'event-handler',
                errorVar: 'event',
                loggerType: 'console.error',
                throwAction: 'Log',
                canThrow: false
            };
        }

        // Check for Express/Koa middleware
        if (/\(req,\s*res,\s*next\)|\(ctx,\s*next\)/.test(lineText)) {
            return {
                type: 'express-middleware',
                errorVar: 'err',
                loggerType: 'logger.error',
                throwAction: 'next(err)',
                canThrow: true
            };
        }

        // Check for React error boundary
        if (/componentDidCatch|getDerivedStateFromError/.test(lineText)) {
            return {
                type: 'react-error',
                errorVar: 'error',
                loggerType: 'console.error',
                throwAction: 'setState',
                canThrow: false
            };
        }

        // Check for array methods with fallback
        if (/\.(find|filter|reduce)\([^)]+\)\s*\|\|/.test(lineText)) {
            return {
                type: 'array-fallback',
                errorVar: null,
                loggerType: 'logger.warn',
                throwAction: 'Throw',
                canThrow: true
            };
        }

        // Default
        return {
            type: 'unknown',
            errorVar: 'error',
            loggerType: 'logger.error',
            throwAction: 'Throw',
            canThrow: true
        };
    }

    /**
     * Generate error handling code based on context
     */
    generateErrorHandling(lineText, errorContext, indent, language) {
        const result = { position: null, code: '' };

        if (errorContext.type === 'catch-block') {
            // Find catch block start
            const todoComment = language === 'th'
                ? '// TODO: จัดการ error อย่างเหมาะสม - ห้าม silent fallback'
                : '// TODO: Handle error properly - no silent fallback';

            result.code = `${indent}    ${errorContext.loggerType}('Error occurred:', ${errorContext.errorVar}); ${todoComment}\n`;
            result.position = new vscode.Position(0, 0); // Will be adjusted by caller

        } else if (errorContext.type === 'promise-catch') {
            result.code = `.catch(${errorContext.errorVar} => {\n${indent}    ${errorContext.loggerType}('Promise error:', ${errorContext.errorVar});\n${indent}    throw ${errorContext.errorVar};\n${indent}})`;

        } else if (errorContext.type === 'event-handler') {
            result.code = `${indent}    ${errorContext.loggerType}('Event handler error:', event);\n`;

        } else if (errorContext.type === 'express-middleware') {
            result.code = `${indent}    ${errorContext.loggerType}('Middleware error:', err);\n${indent}    next(err); // Pass to error handler\n`;

        } else {
            result.code = `${indent}    ${errorContext.loggerType}('Unexpected error:', ${errorContext.errorVar || 'error'});\n`;
        }

        return result;
    }

    /**
     * Detect cache library/pattern
     */
    detectCacheLibrary(lineText) {
        const libraries = [
            { pattern: /useMemo|useCallback|React\.memo/, name: 'React Hooks', library: 'react', canRemove: true },
            { pattern: /computed\s*\(|computed:/, name: 'Vue Computed', library: 'vue', canRemove: false },
            { pattern: /_.memoize|lodash\.memoize/, name: 'Lodash memoize', library: 'lodash', canRemove: true },
            { pattern: /R\.memoize|ramda\.memoize/, name: 'Ramda memoize', library: 'ramda', canRemove: true },
            { pattern: /memoizee\(/, name: 'Memoizee', library: 'memoizee', canRemove: true },
            { pattern: /fast-memoize|fastMemoize/, name: 'Fast-memoize', library: 'fast-memoize', canRemove: true },
            { pattern: /moize\(/, name: 'Moize', library: 'moize', canRemove: true },
            { pattern: /createSelector/, name: 'Reselect', library: 'reselect', canRemove: false },
            { pattern: /useSWR|useQuery/, name: 'SWR/React Query', library: 'swr', canRemove: false },
            { pattern: /localStorage\.|sessionStorage\./, name: 'Web Storage API', library: 'browser', canRemove: true },
            { pattern: /new\s+Map\(\)|new\s+WeakMap\(\)/, name: 'Manual Map cache', library: null, canRemove: true },
            { pattern: /InMemoryCache/, name: 'Apollo Cache', library: 'apollo', canRemove: false }
        ];

        for (const lib of libraries) {
            if (lib.pattern.test(lineText)) {
                return lib;
            }
        }

        return { name: 'Unknown cache', library: null, canRemove: false };
    }
}

module.exports = { CodeActionProvider };
