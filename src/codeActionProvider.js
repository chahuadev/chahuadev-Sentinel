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

        // Fix 1: Comment out the mock
        const commentFix = new vscode.CodeAction(
            language === 'th'
                ? '💡 คอมเมนต์ mock นี้ออก (และใช้ Dependency Injection)'
                : '💡 Comment out mock (and use Dependency Injection)',
            vscode.CodeActionKind.QuickFix
        );
        commentFix.diagnostics = [diagnostic];
        commentFix.edit = new vscode.WorkspaceEdit();
        const line = document.lineAt(diagnostic.range.start.line);
        const indent = line.text.match(/^\s*/)?.[0] || '';
        commentFix.edit.replace(
            document.uri,
            line.range,
            `${indent}// ${line.text.trim()} // TODO: Replace with Dependency Injection`
        );
        commentFix.isPreferred = true;
        fixes.push(commentFix);

        // Fix 2: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? '📖 เรียนรู้เกี่ยวกับ Dependency Injection'
                : '📖 Learn about Dependency Injection pattern',
            vscode.CodeActionKind.QuickFix
        );
        docFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'เปิดคู่มือ Dependency Injection' : 'Open Dependency Injection Guide',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/Dependency-Injection')]
        };
        fixes.push(docFix);

        return fixes;
    }

    /**
     * Quick fixes for NO_HARDCODE rule
     */
    getNoHardcodeFixes(document, diagnostic, language) {
        const fixes = [];
        const line = document.lineAt(diagnostic.range.start.line);
        const lineText = line.text;

        // Extract hardcoded URL/value
        const urlMatch = lineText.match(/['"]https?:\/\/[^'"]+['"]/);

        if (urlMatch) {
            // Fix 1: Extract to constant at top of file
            const extractFix = new vscode.CodeAction(
                language === 'th'
                    ? '💡 แยกไปเป็น constant ที่ด้านบน (ควรย้ายไป config file)'
                    : '💡 Extract to constant at top (should move to config file)',
                vscode.CodeActionKind.QuickFix
            );
            extractFix.diagnostics = [diagnostic];
            extractFix.edit = new vscode.WorkspaceEdit();

            const constantName = 'CONFIG_URL'; // Could be smarter
            const replacement = lineText.replace(urlMatch[0], constantName);

            // Insert constant declaration at top of file
            const todoComment = language === 'th'
                ? '// TODO: ย้าย constant นี้ไปไฟล์ config แยก\n'
                : '// TODO: Move this constant to separate config file\n';

            extractFix.edit.insert(
                document.uri,
                new vscode.Position(0, 0),
                `${todoComment}const ${constantName} = ${urlMatch[0]};\n\n`
            );

            // Replace usage
            extractFix.edit.replace(document.uri, line.range, replacement);
            extractFix.isPreferred = true;
            fixes.push(extractFix);

            // Fix 2: Comment out
            const commentFix = new vscode.CodeAction(
                language === 'th'
                    ? '💡 คอมเมนต์บรรทัดนี้ออก'
                    : '💡 Comment out this line',
                vscode.CodeActionKind.QuickFix
            );
            commentFix.diagnostics = [diagnostic];
            commentFix.edit = new vscode.WorkspaceEdit();
            const indent = line.text.match(/^\s*/)?.[0] || '';
            commentFix.edit.replace(
                document.uri,
                line.range,
                `${indent}// ${line.text.trim()} // TODO: Move to config file`
            );
            fixes.push(commentFix);
        }

        // Fix 3: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? '📖 ทำไมต้องห้าม hardcode ค่า?'
                : '📖 Why hardcoding is problematic?',
            vscode.CodeActionKind.QuickFix
        );
        docFix.command = {
            command: 'vscode.open',
            title: language === 'th' ? 'เปิดคู่มือ Configuration' : 'Open Configuration Guide',
            arguments: [vscode.Uri.parse('https://github.com/chahuadev/chahuadev-scanner/wiki/No-Hardcode')]
        };
        fixes.push(docFix);

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
                ? '💡 เพิ่ม logger.error() ก่อน return'
                : '💡 Add logger.error() before return',
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
                ? '💡 Throw error แทนการ return ค่า default'
                : '💡 Throw error instead of returning default',
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
                ? '📖 ทำไม silent fallback เป็นอันตราย?'
                : '📖 Why silent fallbacks are dangerous?',
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

        // Fix 1: Comment out cache
        const commentFix = new vscode.CodeAction(
            language === 'th'
                ? '💡 คอมเมนต์ cache นี้ออก (ให้ caller จัดการ)'
                : '💡 Comment out cache (let caller handle it)',
            vscode.CodeActionKind.QuickFix
        );
        commentFix.diagnostics = [diagnostic];
        commentFix.edit = new vscode.WorkspaceEdit();

        const line = document.lineAt(diagnostic.range.start.line);
        const indent = line.text.match(/^\s*/)?.[0] || '';
        const todoText = language === 'th'
            ? '// TODO: ลบ internal cache - ให้ caller จัดการแทน'
            : '// TODO: Remove internal cache - let caller handle it';
        commentFix.edit.replace(
            document.uri,
            line.range,
            `${indent}// ${line.text.trim()} ${todoText}`
        );
        commentFix.isPreferred = true;
        fixes.push(commentFix);

        // Fix 2: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? '📖 ทำไม internal cache เป็นปัญหา?'
                : '📖 Why internal caching is problematic?',
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

        // Fix 1: Auto-replace common emoji
        const autoReplace = this.findAndReplaceEmoji(lineText, emojiMap);
        if (autoReplace.replaced) {
            const replaceFix = new vscode.CodeAction(
                language === 'th'
                    ? `💡 แทนที่อิโมจิด้วย "${autoReplace.replacement}"`
                    : `💡 Replace emoji with "${autoReplace.replacement}"`,
                vscode.CodeActionKind.QuickFix
            );
            replaceFix.diagnostics = [diagnostic];
            replaceFix.edit = new vscode.WorkspaceEdit();
            replaceFix.edit.replace(document.uri, line.range, autoReplace.text);
            replaceFix.isPreferred = true;
            fixes.push(replaceFix);
        }

        // Fix 2: Remove emoji completely
        const removeFix = new vscode.CodeAction(
            language === 'th'
                ? '💡 ลบอิโมจิออก'
                : '💡 Remove emoji',
            vscode.CodeActionKind.QuickFix
        );
        removeFix.diagnostics = [diagnostic];
        removeFix.edit = new vscode.WorkspaceEdit();
        // Remove all emoji using comprehensive regex
        const cleanText = lineText.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '');
        removeFix.edit.replace(document.uri, line.range, cleanText);
        if (!autoReplace.replaced) {
            removeFix.isPreferred = true;
        }
        fixes.push(removeFix);

        // Fix 3: Comment out line
        const commentFix = new vscode.CodeAction(
            language === 'th'
                ? '💡 คอมเมนต์บรรทัดนี้ออก'
                : '💡 Comment out this line',
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

        // Fix 4: Show documentation
        const docFix = new vscode.CodeAction(
            language === 'th'
                ? '📖 ทำไมต้องห้ามใช้อิโมจิในโค้ด?'
                : '📖 Why emoji in code is problematic?',
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
}

module.exports = { CodeActionProvider };
