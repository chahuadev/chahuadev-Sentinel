const vscode = require('vscode');
const { ABSOLUTE_RULES } = require('./validator.js');

const diagnosticCollection = vscode.languages.createDiagnosticCollection('chahuaLinter');

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

function updateDiagnostics(document) {
    if (document.languageId !== 'javascript' && document.languageId !== 'typescript') {
        return;
    }

    const diagnostics = [];
    const text = document.getText();
    const lines = text.split('\n');

    for (const ruleKey in ABSOLUTE_RULES) {
        const rule = ABSOLUTE_RULES[ruleKey];

        for (const pattern of rule.patterns) {
            const regex = new RegExp(pattern.regex.source, 'gu');
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                const lineIndex = text.substring(0, match.index).split('\n').length - 1;
                const line = lines[lineIndex];
                const startPosition = new vscode.Position(lineIndex, line.indexOf(match[0]));
                const endPosition = new vscode.Position(lineIndex, line.indexOf(match[0]) + match[0].length);
                const range = new vscode.Range(startPosition, endPosition);

                const severity = pattern.severity === 'ERROR' 
                    ? vscode.DiagnosticSeverity.Error 
                    : vscode.DiagnosticSeverity.Warning;

                const message = `[${rule.id}] ${rule.description.th}`;

                const diagnostic = new vscode.Diagnostic(range, message, severity);
                diagnostic.code = rule.id;
                diagnostic.source = 'Chahua Linter';

                diagnostics.push(diagnostic);
            }
        }
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};