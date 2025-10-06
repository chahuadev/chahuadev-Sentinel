const vscode = require('vscode');
const { ABSOLUTE_RULES, ValidationEngine } = require('./validator.js');

const diagnosticCollection = vscode.languages.createDiagnosticCollection('chahuaLinter');
const validationEngine = new ValidationEngine();

function activate(context) {
    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document);
    }
    
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            updateDiagnostics(document);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(document => {
            updateDiagnostics(document);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(document => {
            diagnosticCollection.delete(document.uri);
        })
    );
}

async function updateDiagnostics(document) {
    if (document.languageId !== 'javascript' && document.languageId !== 'typescript') {
        return;
    }

    const diagnostics = [];
    const text = document.getText();
    const language = document.languageId;

    try {
        // เชื่อใจ ValidationEngine ให้จัดการทุกอย่าง รวมถึง Fallback
        const results = await validationEngine.validateCode(text, language);
        
        // แปลง violations เป็น VS Code Diagnostics
        for (const violation of results.violations) {
            let range;
            
            if (violation.location) {
                // AST-based location
                const start = new vscode.Position(
                    violation.location.start.line - 1, 
                    violation.location.start.column
                );
                const end = new vscode.Position(
                    violation.location.end.line - 1, 
                    violation.location.end.column
                );
                range = new vscode.Range(start, end);
            } else if (violation.position !== undefined) {
                // Position-based (regex fallback)
                const lines = text.split('\n');
                const lineIndex = text.substring(0, violation.position).split('\n').length - 1;
                const line = lines[lineIndex];
                const matchText = violation.match || 'unknown';
                const startCol = line.indexOf(matchText);
                const startPosition = new vscode.Position(lineIndex, startCol);
                const endPosition = new vscode.Position(lineIndex, startCol + matchText.length);
                range = new vscode.Range(startPosition, endPosition);
            } else {
                // Fallback ใช้ line แรก
                range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
            }

            const severity = violation.severity === 'ERROR' 
                ? vscode.DiagnosticSeverity.Error 
                : vscode.DiagnosticSeverity.Warning;

            const diagnostic = new vscode.Diagnostic(range, violation.message, severity);
            diagnostic.code = violation.ruleId;
            diagnostic.source = 'Chahua Sentinel';
            
            // เพิ่ม suggestion ถ้ามี
            if (violation.suggestion) {
                diagnostic.tags = [vscode.DiagnosticTag.Unnecessary];
            }

            diagnostics.push(diagnostic);
        }

        // เพิ่ม warnings - COMPLIANT with NO_SILENT_FALLBACKS
        const warnings = results.warnings;
        if (!Array.isArray(warnings)) {
            console.warn('ValidationEngine returned non-array warnings:', typeof warnings);
            return; // Fail fast instead of silent fallback
        }
        for (const warning of warnings) {
            let range;
            
            if (warning.location) {
                const start = new vscode.Position(
                    warning.location.start.line - 1, 
                    warning.location.start.column
                );
                const end = new vscode.Position(
                    warning.location.end.line - 1, 
                    warning.location.end.column
                );
                range = new vscode.Range(start, end);
            } else {
                range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
            }

            const diagnostic = new vscode.Diagnostic(range, warning.message, vscode.DiagnosticSeverity.Warning);
            diagnostic.source = 'Chahua Sentinel';
            diagnostics.push(diagnostic);
        }

    } catch (error) {
        // จัดการเฉพาะ Error ที่เกิดจากการเชื่อมต่อกับ Engine เท่านั้น
        console.error('Chahua Sentinel engine failed catastrophically:', error);
        vscode.window.showErrorMessage(`Chahua Sentinel failed to analyze this file: ${error.message}`);
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};