// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// ======================================================================
// VS Code Extension - Main Entry Point (Pure JavaScript)
// ======================================================================

const vscode = require('vscode');
const { RulesValidator } = require('./validator');
const { CodeActionProvider } = require('./codeActionProvider');

let diagnosticCollection;
let validator;
let statusBarItem;
let outputChannel;

/**
 * Extension activation
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    outputChannel = vscode.window.createOutputChannel('Chahuadev Rules Validator');
    outputChannel.appendLine(' Chahuadev Rules Validator is now active!');
    outputChannel.appendLine(' Enforcing 4 absolute rules with ZERO tolerance');
    outputChannel.appendLine('');

    // Create diagnostic collection
    diagnosticCollection = vscode.languages.createDiagnosticCollection('chahuadev');
    context.subscriptions.push(diagnosticCollection);

    // Create validator
    validator = new RulesValidator(diagnosticCollection, outputChannel);

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

    // Validate open documents
    validateOpenDocuments();

    // Show welcome message
    const config = vscode.workspace.getConfiguration('chahuadev');
    if (config.get('showWelcomeMessage', true)) {
        showWelcomeMessage();
    }
}

/**
 * Show welcome message on first activation
 */
function showWelcomeMessage() {
    const config = vscode.workspace.getConfiguration('chahuadev');
    const language = config.get('language', 'th');

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
            const language = config.get('language', 'th');

            if (!config.get('enabled', true)) {
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
                        const violations = validator.validateDocument(document);
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
        vscode.commands.registerCommand('chahuadev.validateCurrentFile', () => {
            const editor = vscode.window.activeTextEditor;
            const config = vscode.workspace.getConfiguration('chahuadev');
            const language = config.get('language', 'th');

            if (editor) {
                const violations = validator.validateDocument(editor.document);
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
            const language = config.get('language', 'th');
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
            const currentState = config.get('enabled', true);
            const language = config.get('language', 'th');

            config.update('enabled', !currentState, vscode.ConfigurationTarget.Workspace);

            const msg = language === 'th'
                ? `Chahuadev: การตรวจสอบถูก${!currentState ? 'เปิด' : 'ปิด'}แล้ว`
                : `Chahuadev: Validation ${!currentState ? 'enabled' : 'disabled'}`;

            vscode.window.showInformationMessage(msg);
            updateStatusBar();
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
        vscode.workspace.onDidOpenTextDocument(document => {
            const config = vscode.workspace.getConfiguration('chahuadev');
            if (config.get('enabled', true) && config.get('validateOnOpen', true)) {
                validator.validateDocument(document);
                updateStatusBar();
            }
        })
    );

    // Validate on save
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(document => {
            const config = vscode.workspace.getConfiguration('chahuadev');
            if (config.get('enabled', true) && config.get('validateOnSave', true)) {
                const violations = validator.validateDocument(document);
                updateStatusBar();

                if (violations > 0) {
                    const language = config.get('language', 'th');
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
            if (config.get('enabled', true) && config.get('validateOnType', false)) {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(() => {
                    validator.validateDocument(event.document);
                    updateStatusBar();
                }, 500); // 500ms debounce
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
function validateOpenDocuments() {
    const config = vscode.workspace.getConfiguration('chahuadev');
    if (!config.get('enabled', true)) {
        diagnosticCollection.clear();
        return;
    }

    vscode.workspace.textDocuments.forEach(document => {
        validator.validateDocument(document);
    });
    updateStatusBar();
}

/**
 * Update status bar with current violation count
 */
function updateStatusBar() {
    const totalViolations = getTotalViolations();
    const config = vscode.workspace.getConfiguration('chahuadev');
    const enabled = config.get('enabled', true);
    const language = config.get('language', 'th');

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

module.exports = {
    activate,
    deactivate
};
