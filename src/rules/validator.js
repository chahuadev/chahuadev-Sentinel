// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 2.0.0 - Modular Architecture
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Chahuadev Sentinel - Rules Validator (Modular Version)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! This file combines all 5 ABSOLUTE RULES from separate files.
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Architecture:
// !   BEFORE: All rules in one 5,191-line file
// !  AFTER:  Each rule in its own file (NO_*.js)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Rule Files:
// !  - NO_MOCKING.js
// !  - NO_HARDCODE.js
// !  - NO_SILENT_FALLBACKS.js
// !  - NO_INTERNAL_CACHING.js
// !  - NO_EMOJI.js
// ! ══════════════════════════════════════════════════════════════════════════════

// ! ══════════════════════════════════════════════════════════════════════════════
// !  IMPORTS - นำเข้ากฎทั้ง 5 ข้อจากไฟล์แยก
// ! ══════════════════════════════════════════════════════════════════════════════

import errorHandler from '../error-handler/ErrorHandler.js';

import { ABSOLUTE_RULES as MOCKING_RULE } from './NO_MOCKING.js';
import { ABSOLUTE_RULES as HARDCODE_RULE } from './NO_HARDCODE.js';
import { ABSOLUTE_RULES as FALLBACKS_RULE } from './NO_SILENT_FALLBACKS.js';
import { ABSOLUTE_RULES as CACHING_RULE } from './NO_INTERNAL_CACHING.js';
import { ABSOLUTE_RULES as EMOJI_RULE } from './NO_EMOJI.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// !  COMBINE - รวมกฎทั้ง 5 ข้อเป็น ABSOLUTE_RULES เดียว
// ! ══════════════════════════════════════════════════════════════════════════════

export const ABSOLUTE_RULES = {
    ...MOCKING_RULE,
    ...HARDCODE_RULE,
    ...FALLBACKS_RULE,
    ...CACHING_RULE,
    ...EMOJI_RULE
};

// ! ══════════════════════════════════════════════════════════════════════════════
// !  VALIDATION ENGINE CLASS
// ! ══════════════════════════════════════════════════════════════════════════════

import { createSmartParserEngine } from '../grammars/index.js';

export class ValidationEngine {
    constructor() {
        this.rules = ABSOLUTE_RULES;
        this.parserEngine = null;
    }

    async initializeParserStudy() {
        try {
            this.parserEngine = await createSmartParserEngine(ABSOLUTE_RULES);
            console.log('[SUCCESS] ValidationEngine initialized');
            return true;
        } catch (error) {
            console.error('[ERROR] ValidationEngine init failed:', error.message);
            throw new Error(`ValidationEngine initialization failed: ${error.message}`);
        }
    }

    async validateCode(code, fileName = 'unknown') {
        if (!this.parserEngine) {
            throw new Error('ValidationEngine not initialized. Call initializeParserStudy() first.');
        }

        try {
            const results = this.parserEngine.analyzeCode(code, fileName);
            return {
                fileName,
                violations: results.violations || [],
                success: (results.violations || []).length === 0
            };
        } catch (error) {
            console.error(`[ERROR] Validation error for ${fileName}:`, error.message);
            throw new Error(`Validation failed for ${fileName}: ${error.message}`);
        }
    }

    getRules() {
        return this.rules;
    }

    getRule(ruleId) {
        if (!this.rules[ruleId]) {
            throw new Error(`Rule '${ruleId}' not found. Available: ${Object.keys(this.rules).join(', ')}`);
        }
        return this.rules[ruleId];
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
// !  EXPORTS SUMMARY
// ! ══════════════════════════════════════════════════════════════════════════════
// !  ABSOLUTE_RULES - กฎทั้ง 5 ข้อ (รวมจากไฟล์แยก)
// !  ValidationEngine - Class สำหรับ validate โค้ด
// !  
// !  Usage (เหมือนเดิม):
// !    import { ABSOLUTE_RULES } from './src/rules/validator.js';
// !    import { ValidationEngine } from './src/rules/validator.js';
// ! ══════════════════════════════════════════════════════════════════════════════
