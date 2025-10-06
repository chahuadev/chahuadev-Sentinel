const vscode = require('vscode');
const { ABSOLUTE_RULES, ValidationEngine } = require('./validator.js');

/**
 * VS Code Extension Entry Point for Chahuadev Sentinel
 * Provides subtle blue notifications with detailed hover information
 */

let diagnosticCollection;
let validationEngine;

function activate(context) {
    console.log('🔵 Chahuadev Sentinel Extension activated');
    
    // Initialize validation engine
    validationEngine = new ValidationEngine();
    validationEngine.initializeParserStudy().catch(console.error);
    
    // Create diagnostic collection for subtle blue notifications
    diagnosticCollection = vscode.languages.createDiagnosticCollection('chahuadev-sentinel');
    context.subscriptions.push(diagnosticCollection);
    
    // Real-time scanning on document change (throttled)
    let scanTimeout;
    const documentChangeListener = vscode.workspace.onDidChangeTextDocument(async (event) => {
        const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
        if (!config.get('enableRealTimeScanning', true)) return;
        
        // Throttle scanning to avoid performance issues
        clearTimeout(scanTimeout);
        scanTimeout = setTimeout(() => {
            scanDocument(event.document);
        }, 500);
    });
    
    // Scan on save
    const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
        if (!config.get('scanOnSave', true)) return;
        
        await scanDocument(document);
        showSubtleNotification('File scanned successfully');
    });
    
    // Command: Scan Current File
    const scanFileCommand = vscode.commands.registerCommand('chahuadev-sentinel.scanFile', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage('📂 No active file to scan');
            return;
        }
        
        const results = await scanDocument(activeEditor.document);
        const violationCount = results?.violations?.length || 0;
        
        if (violationCount === 0) {
            showSubtleNotification('✨ File is clean - no violations found');
        } else {
            showSubtleNotification(`🔍 Found ${violationCount} quality issue${violationCount > 1 ? 's' : ''}`);
        }
    });
    
    // Command: Scan Workspace
    const scanWorkspaceCommand = vscode.commands.registerCommand('chahuadev-sentinel.scanWorkspace', async () => {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Chahuadev Sentinel',
            cancellable: true
        }, async (progress, token) => {
            progress.report({ message: 'Scanning workspace...' });
            
            const files = await vscode.workspace.findFiles(
                '**/*.{js,ts,jsx,tsx}', 
                '**/node_modules/**'
            );
            
            let scannedCount = 0;
            let totalViolations = 0;
            
            for (const [index, file] of files.entries()) {
                if (token.isCancellationRequested) break;
                
                progress.report({ 
                    message: `Scanning ${file.path.split('/').pop()}...`,
                    increment: (100 / files.length)
                });
                
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const results = await scanDocument(document);
                    totalViolations += results?.violations?.length || 0;
                    scannedCount++;
                } catch (error) {
                    console.error('Scan error:', error);
                }
            }
            
            if (!token.isCancellationRequested) {
                showSubtleNotification(
                    `🏁 Workspace scan completed: ${scannedCount} files, ${totalViolations} issues found`
                );
            }
        });
    });
    
    // Command: Configure Rules
    const configureRulesCommand = vscode.commands.registerCommand('chahuadev-sentinel.toggleRules', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:chahuadev.chahuadev-sentinel');
    });
    
    // Register all subscriptions
    context.subscriptions.push(
        documentChangeListener,
        saveListener,
        scanFileCommand,
        scanWorkspaceCommand,
        configureRulesCommand
    );
    
    // Initial scan of active document
    if (vscode.window.activeTextEditor) {
        scanDocument(vscode.window.activeTextEditor.document);
    }
    
    console.log('🟢 Chahuadev Sentinel ready for action');
}

/**
 * Scan document and create subtle diagnostics with detailed hover info
 */
async function scanDocument(document) {
    // Only scan supported file types
    if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(document.languageId)) {
        return null;
    }
    
    try {
        const code = document.getText();
        if (!code.trim()) {
            diagnosticCollection.set(document.uri, []);
            return { violations: [] };
        }
        
        const results = await validationEngine.validateCode(code, document.fileName);
        
        const diagnostics = results.violations.map(violation => {
            const line = Math.max(0, (violation.location?.line || 1) - 1);
            const column = Math.max(0, (violation.location?.column || 0));
            
            // Create range for the violation
            const range = new vscode.Range(
                line,
                column,
                line,
                column + 15 // Highlight a reasonable length
            );
            
            const diagnostic = new vscode.Diagnostic(
                range,
                getShortMessage(violation),
                getSeverity(violation.severity)
            );
            
            // Set source and code for identification
            diagnostic.source = 'Chahuadev Sentinel';
            diagnostic.code = {
                value: violation.ruleId,
                target: vscode.Uri.parse('https://github.com/chahuadev/chahuadev-vscode-extension#rules')
            };
            
            // Add detailed information for hover
            diagnostic.relatedInformation = [
                new vscode.DiagnosticRelatedInformation(
                    new vscode.Location(document.uri, range),
                    getFullMessage(violation)
                )
            ];
            
            // Add tags for better categorization
            diagnostic.tags = getViolationTags(violation);
            
            return diagnostic;
        });
        
        // Apply subtle blue styling by using Information severity for most issues
        const subtleDiagnostics = diagnostics.map(d => {
            const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
            const notificationStyle = config.get('notificationStyle', 'subtle');
            
            if (notificationStyle === 'subtle' && d.severity !== vscode.DiagnosticSeverity.Error) {
                d.severity = vscode.DiagnosticSeverity.Information;
            }
            
            return d;
        });
        
        diagnosticCollection.set(document.uri, subtleDiagnostics);
        return results;
        
    } catch (error) {
        console.error('🔴 Chahuadev Sentinel scan error:', error);
        
        // Show error as subtle notification
        const errorDiagnostic = new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 10),
            'Scan failed - check syntax',
            vscode.DiagnosticSeverity.Warning
        );
        errorDiagnostic.source = 'Chahuadev Sentinel';
        
        diagnosticCollection.set(document.uri, [errorDiagnostic]);
        return null;
    }
}

/**
 * Get short, non-intrusive message for inline display
 */
function getShortMessage(violation) {
    const shortMessages = {
        'NO_MOCKING': '🚫 Mock',
        'NO_HARDCODE': '🔧 Hardcode',
        'NO_SILENT_FALLBACKS': '🔇 Silent fallback', 
        'NO_INTERNAL_CACHING': '💾 Cache',
        'NO_EMOJI': '😊 Emoji'
    };
    
    return shortMessages[violation.ruleId] || '⚠️ Quality';
}

/**
 * Get comprehensive message with suggestions for hover
 */
function getFullMessage(violation) {
    const suggestions = {
        'NO_MOCKING': `🧪 Testing Issue: ${violation.message}

💡 Better Approach:
• Use dependency injection for testable code
• Create test doubles manually for better control  
• Consider integration tests over mocked unit tests

📚 Why: Mock frameworks create brittle tests that break when implementation details change, leading to false confidence and maintenance overhead.`,

        'NO_HARDCODE': `🔧 Configuration Issue: ${violation.message}

💡 Better Approach:
• Move to environment variables (.env file)
• Use configuration objects or JSON files
• Consider feature flags for behavioral settings

📚 Why: Hardcoded values make code inflexible, hard to deploy across environments, and create security risks for sensitive data.`,

        'NO_SILENT_FALLBACKS': `🔇 Error Handling Issue: ${violation.message}

💡 Better Approach:
• Add explicit error logging and handling
• Throw meaningful errors instead of returning defaults
• Use result objects with success/error states

📚 Why: Silent failures hide bugs, make debugging impossible, and create unpredictable system behavior in production.`,

        'NO_INTERNAL_CACHING': `💾 Architecture Issue: ${violation.message}

💡 Better Approach:
• Use external cache stores (Redis, Memcached)
• Implement database-level caching
• Consider CDN for static content caching

📚 Why: Internal caching causes memory leaks, scaling issues, and cache invalidation problems in distributed systems.`,

        'NO_EMOJI': `😊 Text Encoding Issue: ${violation.message}

💡 Better Approach:
• Use descriptive text: "SUCCESS", "ERROR", "WARNING"
• Create constants for status indicators
• Use icons from icon libraries if visual indicators needed

📚 Why: Emoji can cause encoding issues, reduce accessibility, and create inconsistent rendering across different systems.`
    };
    
    return suggestions[violation.ruleId] || `Code Quality Issue: ${violation.message}\n\n💡 Follow Chahuadev coding standards for better maintainability.`;
}

/**
 * Convert severity to VS Code diagnostic severity with subtle default
 */
function getSeverity(severity) {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL': return vscode.DiagnosticSeverity.Error;
        case 'ERROR': return vscode.DiagnosticSeverity.Warning; // Soften errors to warnings
        case 'WARNING': return vscode.DiagnosticSeverity.Information; // Soften warnings
        case 'INFO': return vscode.DiagnosticSeverity.Hint;
        default: return vscode.DiagnosticSeverity.Information; // Subtle default
    }
}

/**
 * Get diagnostic tags for better categorization
 */
function getViolationTags(violation) {
    const tags = [];
    
    if (violation.ruleId === 'NO_HARDCODE' && violation.message.includes('credential')) {
        tags.push(vscode.DiagnosticTag.Deprecated); // Security-related
    }
    
    return tags;
}

/**
 * Show subtle, non-intrusive notification
 */
function showSubtleNotification(message) {
    const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
    const style = config.get('notificationStyle', 'subtle');
    
    switch (style) {
        case 'prominent':
            vscode.window.showWarningMessage(`Chahuadev Sentinel: ${message}`);
            break;
        case 'normal':
            vscode.window.showInformationMessage(`🔵 ${message}`);
            break;
        case 'subtle':
        default:
            // Very subtle - just show in status bar briefly
            vscode.window.setStatusBarMessage(`🔵 ${message}`, 3000);
            break;
    }
}

function deactivate() {
    console.log('🔵 Chahuadev Sentinel Extension deactivated');
    
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};