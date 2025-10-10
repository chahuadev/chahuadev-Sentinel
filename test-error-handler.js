#!/usr/bin/env node
import errorHandler, { setupGlobalErrorHandlers } from './src/error-handler/ErrorHandler.js';

console.log('[TEST] Import successful');
console.log('[TEST] errorHandler type:', typeof errorHandler);
console.log('[TEST] setupGlobalErrorHandlers type:', typeof setupGlobalErrorHandlers);

// ทดสอบ handleError
try {
    const testError = new Error('Test operational error');
    testError.isOperational = true;
    
    console.log('\n[TEST] Testing operational error...');
    errorHandler.handleError(testError, {
        source: 'test-error-handler.js',
        test: true
    });
    console.log('[TEST] Operational error handled successfully\n');
} catch (e) {
    console.error('[TEST] Failed:', e.message);
}

console.log('[OK] All tests passed!');
