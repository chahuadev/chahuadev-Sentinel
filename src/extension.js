// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// ======================================================================
// VS Code Extension - Main Entry Point (Pure JavaScript)
// ======================================================================

import * as vscode from 'vscode';
import { RulesValidator } from './validator.js';
import { CodeActionProvider } from './codeActionProvider.js';

let diagnosticCollection;
let validator;
let statusBarItem;
let outputChannel;

/**
 * Extension activation
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    outputChannel = vscode.window.createOutputChannel('Chahuadev Rules Validator');
    outputChannel.appendLine(' Chahuadev Rules Validator is now active!');
    outputChannel.appendLine(' Enforcing 4 absolute rules with ZERO tolerance');
    outputChannel.appendLine('');

    try {
        // Create validator (will initialize grammar system asynchronously)
        validator = new RulesValidator(diagnosticCollection, outputChannel);

        outputChannel.appendLine('[ACTIVATION] RulesValidator initialized successfully');

        // Create diagnostic collection
        diagnosticCollection = vscode.languages.createDiagnosticCollection('chahuadev');
        context.subscriptions.push(diagnosticCollection);

        // Create status bar item
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.command = 'chahuadev.validateCurrentFile';
        updateStatusBar();
        statusBarItem.show();
        context.subscriptions.push(statusBarItem);

        // Register commands
        registerCommands(context);

        // Register code action provider (Quick Fixes)
        registerCodeActionProvider(context);

        // Setup document listeners
        setupDocumentListeners(context);
    } catch (error) {
        outputChannel.appendLine(`[ERROR] Extension activation failed: ${error.message}`);
        outputChannel.appendLine(error.stack);
        vscode.window.showErrorMessage(`Chahuadev Sentinel activation failed: ${error.message}`);
        throw error;
    }

    // Validate open documents
    validateOpenDocuments();

    // Show welcome message
    const config = vscode.workspace.getConfiguration('chahuadev');
    const showWelcome = config.get('showWelcomeMessage');
    if (showWelcome === undefined) {
        throw new Error('Configuration "chahuadev.showWelcomeMessage" is required but not set');
    }
    if (showWelcome) {
        showWelcomeMessage();
    }
}

/**
 * Show welcome message on first activation
 */
function showWelcomeMessage() {
    const config = vscode.workspace.getConfiguration('chahuadev');
    const language = config.get('language');

    if (!language) {
        throw new Error('Configuration "chahuadev.language" is required but not set');
    }

    const message = language === 'th'
        ? ' Chahuadev Rules Validator: บังคับใช้กฎเหล็ก 4 ข้อ - ไม่มีข้อยกเว้น!'
        : ' Chahuadev Rules Validator: Enforcing 4 absolute rules - NO exceptions!';

    vscode.window.showInformationMessage(message,
        language === 'th' ? 'เปิด Output' : 'Show Output',
        language === 'th' ? 'ตั้งค่า' : 'Settings'
    ).then(selection => {
        if (selection === 'เปิด Output' || selection === 'Show Output') {
            outputChannel.show();
        } else if (selection === 'ตั้งค่า' || selection === 'Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'chahuadev');
        }
    });
}

/**
 * Register all commands
 * @param {vscode.ExtensionContext} context
 */
function registerCommands(context) {
    // Command: Validate entire workspace
    context.subscriptions.push(
        vscode.commands.registerCommand('chahuadev.validateWorkspace', async () => {
            const config = vscode.workspace.getConfiguration('chahuadev');
            const language = config.get('language');

            if (!language) {
                throw new Error('Configuration "chahuadev.language" is required but not set');
            }

            const enabled = config.get('enabled');
            if (enabled === undefined) {
                throw new Error('Configuration "chahuadev.enabled" is required but not set');
            }

            if (!enabled) {
                const msg = language === 'th'
                    ? 'Chahuadev validator ถูกปิดใช้งานในการตั้งค่า'
                    : 'Chahuadev validator is disabled in settings';
                vscode.window.showWarningMessage(msg);
                return;
            }

            const title = language === 'th'
                ? 'Chahuadev: กำลังตรวจสอบทั้ง workspace...'
                : 'Chahuadev: Validating entire workspace...';

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: title,
                cancellable: false
            }, async (progress) => {
                const files = await vscode.workspace.findFiles(
                    '**/*.{js,ts,jsx,tsx}',
                    '**/node_modules/**'
                );

                let processed = 0;
                let totalViolations = 0;

                outputChannel.appendLine(`\n${'='.repeat(80)}`);
                outputChannel.appendLine(language === 'th'
                    ? ` เริ่มตรวจสอบ ${files.length} ไฟล์...`
                    : ` Starting validation of ${files.length} files...`
                );
                outputChannel.appendLine('='.repeat(80));

                for (const file of files) {
                    try {
                        const document = await vscode.workspace.openTextDocument(file);
                        const violations = await validator.validateDocument(document);
                        totalViolations += violations;

                        processed++;
                        progress.report({
                            increment: (processed / files.length) * 100,
                            message: `${processed}/${files.length} files`
                        });
                    } catch (error) {
                        outputChannel.appendLine(` Error validating ${file.fsPath}: ${error.message}`);
                    }
                }

                outputChannel.appendLine(`\n${'='.repeat(80)}`);
                outputChannel.appendLine(language === 'th'
                    ? ` ตรวจสอบเสร็จสิ้น: ${totalViolations} การละเมิดใน ${files.length} ไฟล์`
                    : ` Validation complete: ${totalViolations} violations in ${files.length} files`
                );
                outputChannel.appendLine('='.repeat(80));

                const resultMsg = language === 'th'
                    ? `Chahuadev: ตรวจสอบเสร็จสิ้น! พบการละเมิด ${totalViolations} รายการใน ${files.length} ไฟล์`
                    : `Chahuadev: Validation complete! Found ${totalViolations} violations in ${files.length} files`;

                if (totalViolations > 0) {
                    vscode.window.showWarningMessage(resultMsg,
                        language === 'th' ? 'ดู Problems' : 'View Problems'
                    ).then(selection => {
                        if (selection) {
                            vscode.commands.executeCommand('workbench.action.problems.focus');
                        }
                    });
                } else {
                    vscode.window.showInformationMessage(resultMsg);
                }

                updateStatusBar();
            });
        })
    );

    // Command: Validate current file
    context.subscriptions.push(
        vscode.commands.registerCommand('chahuadev.validateCurrentFile', async () => {
            const editor = vscode.window.activeTextEditor;
            const config = vscode.workspace.getConfiguration('chahuadev');
            const language = config.get('language');

            if (!language) {
                throw new Error('Configuration "chahuadev.language" is required but not set');
            }

            if (editor) {
                const violations = await validator.validateDocument(editor.document);
                updateStatusBar();

                const msg = language === 'th'
                    ? `Chahuadev: ตรวจสอบเสร็จแล้ว! พบการละเมิด ${violations} รายการ`
                    : `Chahuadev: Validation complete! Found ${violations} violations`;

                if (violations > 0) {
                    vscode.window.showWarningMessage(msg);
                } else {
                    vscode.window.showInformationMessage(msg);
                }
            } else {
                const msg = language === 'th'
                    ? 'ไม่มีไฟล์ที่เปิดอยู่'
                    : 'No active editor';
                vscode.window.showWarningMessage(msg);
            }
        })
    );

    // Command: Clear all diagnostics
    context.subscriptions.push(
        vscode.commands.registerCommand('chahuadev.clearDiagnostics', () => {
            diagnosticCollection.clear();
            updateStatusBar();

            const config = vscode.workspace.getConfiguration('chahuadev');
            const language = config.get('language');

            if (!language) {
                throw new Error('Configuration "chahuadev.language" is required but not set');
            }

            const msg = language === 'th'
                ? 'Chahuadev: ล้างการแจ้งเตือนทั้งหมดแล้ว!'
                : 'Chahuadev: All diagnostics cleared!';

            vscode.window.showInformationMessage(msg);
            outputChannel.appendLine(`\n ${msg}`);
        })
    );

    // Command: Show output channel
    context.subscriptions.push(
        vscode.commands.registerCommand('chahuadev.showOutput', () => {
            outputChannel.show();
        })
    );

    // Command: Toggle validation
    context.subscriptions.push(
        vscode.commands.registerCommand('chahuadev.toggleValidation', () => {
            const config = vscode.workspace.getConfiguration('chahuadev');
            const currentState = config.get('enabled');
            const language = config.get('language');

            if (currentState === undefined) {
                throw new Error('Configuration "chahuadev.enabled" is required but not set');
            }

            if (!language) {
                throw new Error('Configuration "chahuadev.language" is required but not set');
            }

            config.update('enabled', !currentState, vscode.ConfigurationTarget.Workspace);

            const msg = language === 'th'
                ? `Chahuadev: การตรวจสอบถูก${!currentState ? 'เปิด' : 'ปิด'}แล้ว`
                : `Chahuadev: Validation ${!currentState ? 'enabled' : 'disabled'}`;

            vscode.window.showInformationMessage(msg);
            updateStatusBar();
        })
    );

    // Command: Clean all emojis in file using emoji-cleaner.js
    context.subscriptions.push(
        vscode.commands.registerCommand('chahuadev.cleanEmojis', async (uri) => {
            const config = vscode.workspace.getConfiguration('chahuadev');
            const language = config.get('language');

            if (!language) {
                throw new Error('Configuration "chahuadev.language" is required but not set');
            }

            try {
                const document = await vscode.workspace.openTextDocument(uri);
                const originalText = document.getText();
                const fileExt = path.extname(uri.fsPath).toLowerCase();

                outputChannel.appendLine(`\n${'='.repeat(80)}`);
                outputChannel.appendLine(language === 'th'
                    ? ` [EMOJI CLEANER] เริ่มทำความสะอาดไฟล์: ${uri.fsPath}`
                    : ` [EMOJI CLEANER] Starting cleanup on: ${uri.fsPath}`
                );
                outputChannel.appendLine('='.repeat(80));

                // Import emoji-cleaner.js functions
                const emojiCleanerPath = path.join(__dirname, '..', '..', 'chahuadev-emoji-cleaner-tool', 'emoji-cleaner.js');
                let removeEmojis, removeEmojiComments;

                try {
                    const emojiCleaner = require(emojiCleanerPath);
                    removeEmojis = emojiCleaner.removeEmojis;
                    removeEmojiComments = emojiCleaner.removeEmojiComments;
                } catch (error) {
                    // Fallback: Use built-in emoji removal if emoji-cleaner.js not found
                    outputChannel.appendLine(language === 'th'
                        ? ` [WARNING] ไม่พบ emoji-cleaner.js ใช้การลบอิโมจิแบบ built-in`
                        : ` [WARNING] emoji-cleaner.js not found, using built-in emoji removal`
                    );

                    // Built-in emoji removal
                    removeEmojis = (text) => {
                        const emojiRegex = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu;
                        const cleaned = text.replace(emojiRegex, '');
                        return { content: cleaned, changed: cleaned !== text, count: text.length - cleaned.length };
                    };

                    removeEmojiComments = (text) => {
                        const commentRegex = /\/\/.*[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}].*$/gmu;
                        const cleaned = text.replace(commentRegex, '');
                        return { content: cleaned, commentCount: 0 };
                    };
                }

                // Execute emoji cleanup
                const emojiResult = removeEmojis(originalText, uri.fsPath);
                const commentResult = removeEmojiComments(emojiResult.content, fileExt, uri.fsPath);

                if (emojiResult.changed || commentResult.commentCount > 0) {
                    const newText = commentResult.content;
                    const edit = new vscode.WorkspaceEdit();
                    const fullRange = new vscode.Range(
                        document.positionAt(0),
                        document.positionAt(originalText.length)
                    );

                    edit.replace(uri, fullRange, newText);
                    await vscode.workspace.applyEdit(edit);

                    // Save the document
                    await vscode.window.activeTextEditor?.document.save();

                    const msg = language === 'th'
                        ? `[SUCCESS] ลบอิโมจิสำเร็จ! (${emojiResult.count} ตัวอักษร)`
                        : `[SUCCESS] Emojis cleaned successfully! (${emojiResult.count} characters removed)`;

                    outputChannel.appendLine(` ${msg}`);
                    outputChannel.appendLine('='.repeat(80));
                    vscode.window.showInformationMessage(msg);

                    // Re-validate the document
                    await validator.validateDocument(document);
                } else {
                    const msg = language === 'th'
                        ? '[INFO] ไม่พบอิโมจิในไฟล์นี้'
                        : '[INFO] No emojis found to clean';

                    outputChannel.appendLine(` ${msg}`);
                    outputChannel.appendLine('='.repeat(80));
                    vscode.window.showInformationMessage(msg);
                }
            } catch (error) {
                const msg = language === 'th'
                    ? `[ERROR] ล้มเหลวในการลบอิโมจิ: ${error.message}`
                    : `[ERROR] Failed to clean emojis: ${error.message}`;

                outputChannel.appendLine(` ${msg}`);
                outputChannel.appendLine(`Stack trace: ${error.stack}`);
                outputChannel.appendLine('='.repeat(80));
                vscode.window.showErrorMessage(msg);
            }
        })
    );
}

/**
 * Register Code Action Provider for Quick Fixes
 * @param {vscode.ExtensionContext} context
 */
function registerCodeActionProvider(context) {
    const provider = new CodeActionProvider(outputChannel);
    const selector = [
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', language: 'typescript' },
        { scheme: 'file', language: 'javascriptreact' },
        { scheme: 'file', language: 'typescriptreact' }
    ];

    for (const sel of selector) {
        context.subscriptions.push(
            vscode.languages.registerCodeActionsProvider(
                sel,
                provider,
                { providedCodeActionKinds: CodeActionProvider.providedCodeActionKinds }
            )
        );
    }
}

/**
 * Setup document listeners based on configuration
 * @param {vscode.ExtensionContext} context
 */
function setupDocumentListeners(context) {
    // Validate on open
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(async (document) => {
            const config = vscode.workspace.getConfiguration('chahuadev');
            const enabled = config.get('enabled');
            const validateOnOpen = config.get('validateOnOpen');

            if (enabled === undefined) {
                throw new Error('Configuration "chahuadev.enabled" is required but not set');
            }

            if (validateOnOpen === undefined) {
                throw new Error('Configuration "chahuadev.validateOnOpen" is required but not set');
            }

            if (enabled && validateOnOpen) {
                await validator.validateDocument(document);
                updateStatusBar();
            }
        })
    );

    // Validate on save
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(async (document) => {
            const config = vscode.workspace.getConfiguration('chahuadev');
            const enabled = config.get('enabled');
            const validateOnSave = config.get('validateOnSave');

            if (enabled === undefined) {
                throw new Error('Configuration "chahuadev.enabled" is required but not set');
            }

            if (validateOnSave === undefined) {
                throw new Error('Configuration "chahuadev.validateOnSave" is required but not set');
            }

            if (enabled && validateOnSave) {
                const violations = await validator.validateDocument(document);
                updateStatusBar();

                if (violations > 0) {
                    const language = config.get('language');
                    if (!language) {
                        throw new Error('Configuration "chahuadev.language" is required but not set');
                    }

                    const msg = language === 'th'
                        ? ` พบการละเมิดกฎ ${violations} รายการในไฟล์นี้`
                        : ` Found ${violations} rule violations in this file`;
                    outputChannel.appendLine(`\n${msg}: ${document.fileName}`);
                }
            }
        })
    );

    // Validate on type (debounced)
    let timeout;
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            const config = vscode.workspace.getConfiguration('chahuadev');
            const enabled = config.get('enabled');
            const validateOnType = config.get('validateOnType');

            if (enabled === undefined) {
                throw new Error('Configuration "chahuadev.enabled" is required but not set');
            }

            if (validateOnType === undefined) {
                throw new Error('Configuration "chahuadev.validateOnType" is required but not set');
            }

            if (enabled && validateOnType) {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(async () => {
                    await validator.validateDocument(event.document);
                    updateStatusBar();
                }, 500);
            }
        })
    );

    // Clear diagnostics when document is closed
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(document => {
            diagnosticCollection.delete(document.uri);
            updateStatusBar();
        })
    );

    // Re-validate on configuration change
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('chahuadev')) {
                outputChannel.appendLine('\n Configuration changed - re-validating...');
                validateOpenDocuments();
            }
        })
    );
}

/**
 * Validate all currently open documents
 */
async function validateOpenDocuments() {
    const config = vscode.workspace.getConfiguration('chahuadev');
    const enabled = config.get('enabled');

    if (enabled === undefined) {
        throw new Error('Configuration "chahuadev.enabled" is required but not set');
    }

    if (!enabled) {
        diagnosticCollection.clear();
        return;
    }

    for (const document of vscode.workspace.textDocuments) {
        await validator.validateDocument(document);
    }
    updateStatusBar();
}

/**
 * Update status bar with current violation count
 */
function updateStatusBar() {
    const totalViolations = getTotalViolations();
    const config = vscode.workspace.getConfiguration('chahuadev');
    const enabled = config.get('enabled');
    const language = config.get('language');

    if (enabled === undefined) {
        throw new Error('Configuration "chahuadev.enabled" is required but not set');
    }

    if (!language) {
        throw new Error('Configuration "chahuadev.language" is required but not set');
    }

    if (!enabled) {
        statusBarItem.text = language === 'th'
            ? '$(circle-slash) Chahuadev: ปิด'
            : '$(circle-slash) Chahuadev: Disabled';
        statusBarItem.tooltip = language === 'th'
            ? 'Chahuadev validator ถูกปิดใช้งาน - คลิกเพื่อตรวจสอบไฟล์ปัจจุบัน'
            : 'Chahuadev validator is disabled - Click to validate current file';
        statusBarItem.backgroundColor = undefined;
        statusBarItem.color = '#888';
        return;
    }

    if (totalViolations === 0) {
        statusBarItem.text = language === 'th'
            ? '$(check) Chahuadev: สะอาด'
            : '$(check) Chahuadev: Clean';
        statusBarItem.tooltip = language === 'th'
            ? 'ไม่พบการละเมิดกฎ - คลิกเพื่อตรวจสอบอีกครั้ง'
            : 'No rule violations found - Click to re-validate';
        statusBarItem.backgroundColor = undefined;
        statusBarItem.color = '#4CAF50';
    } else {
        statusBarItem.text = language === 'th'
            ? `$(warning) Chahuadev: ${totalViolations} ปัญหา`
            : `$(warning) Chahuadev: ${totalViolations} issues`;
        statusBarItem.tooltip = language === 'th'
            ? `พบการละเมิดกฎ ${totalViolations} รายการ - คลิกเพื่อตรวจสอบอีกครั้ง`
            : `Found ${totalViolations} rule violations - Click to re-validate`;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        statusBarItem.color = '#FFF';
    }
}

/**
 * Get total violations across all documents
 * @returns {number}
 */
function getTotalViolations() {
    let total = 0;
    diagnosticCollection.forEach((uri, diagnostics) => {
        total += diagnostics.length;
    });
    return total;
}

/**
 * Extension deactivation
 */
function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    if (outputChannel) {
        outputChannel.appendLine('\n Chahuadev Rules Validator deactivated');
        outputChannel.dispose();
    }
}

export {
    activate,
    deactivate
};
