//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
/**
 * VS Code Extension Entry Point (CommonJS Wrapper)
 * This file serves as a bridge between VS Code (CommonJS) and our ES Module codebase
 */

// Dynamic import our ES module extension
async function activate(context) {
    try {
        // Set up global vscode for ES modules (since VS Code provides it as global)
        if (typeof globalThis.vscode === 'undefined') {
            globalThis.vscode = require('vscode');
        }
        
        const { activate: esActivate } = await import('./src/extension.js');
        return await esActivate(context);
    } catch (error) {
        console.error('Failed to load ES Module extension:', error);
        const vscode = require('vscode');
        vscode.window.showErrorMessage('Chahuadev Sentinel: Failed to initialize extension - ' + error.message);
        throw error;
    }
}

async function deactivate() {
    try {
        const { deactivate: esDeactivate } = await import('./src/extension.js');
        return await esDeactivate();
    } catch (error) {
        // COMPLIANCE: NO_SILENT_FALLBACKS - log and re-throw error
        console.error('Failed to deactivate ES Module extension:', error);
        throw error; // Do not swallow deactivation errors
    }
}

module.exports = {
    activate,
    deactivate
};