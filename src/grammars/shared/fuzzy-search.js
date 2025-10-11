//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// ChahuadevR Engine Grammar Dictionary - Core Language Support
// ============================================================================
// Levenshtein Distance Algorithm
// คำนวณ "ระยะห่าง" ระหว่างสองคำ สำหรับ Fuzzy Search
// ============================================================================
// ใช้สำหรับ:
// - Typo correction: "Did you mean 'function'?" (when user types "functoin")
// - Fuzzy matching: ค้นหาคำที่คล้ายกัน
// - Auto-suggestion: แนะนำคำที่ใกล้เคียง
// ============================================================================
// - Time Complexity: O(m * n) where m, n = lengths of two strings
// - Space Complexity: O(m * n)
// ============================================================================
// Optimization: Can be reduced to O(min(m, n)) space using rolling array
// ============================================================================

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import errorHandler from '../../error-handler/ErrorHandler.js';



// Load Configuration (NO MORE HARDCODE!)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'parser-config.json');

let FUZZY_CONFIG;
try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    FUZZY_CONFIG = config.fuzzySearch;
    
    // WHY: Strict validation - configuration MUST exist (NO_SILENT_FALLBACKS compliance)
    if (!FUZZY_CONFIG) {
        throw new Error('fuzzySearch configuration section is missing in parser-config.json');
    }
    
    // Validate required fields
    if (typeof FUZZY_CONFIG.maxDistance !== 'number' || 
        typeof FUZZY_CONFIG.minSimilarity !== 'number' || 
        typeof FUZZY_CONFIG.maxSuggestions !== 'number') {
        throw new Error('fuzzySearch configuration missing required fields: maxDistance, minSimilarity, maxSuggestions');
    }
    
    console.log(' Fuzzy search configuration loaded from:', CONFIG_PATH);
} catch (error) {
    errorHandler.handleError(error, {
        source: 'FuzzySearch',
        method: 'initialization',
        severity: 'CRITICAL',
        context: `Failed to load fuzzy search configuration from ${CONFIG_PATH}`
    });
    // WHY: FAIL FAST, FAIL LOUD - No silent fallbacks allowed
    console.error(' CRITICAL: Failed to load fuzzy search configuration');
    console.error('   Config path:', CONFIG_PATH);
    console.error('   Error:', error.message);
    throw new Error(
        `Fuzzy search configuration is required: ${CONFIG_PATH}\n` +
        `Cannot proceed without valid configuration.\n` +
        `NO_SILENT_FALLBACKS: We fail fast to prevent hidden bugs.`
    );
}

/**
 * Calculate Levenshtein Distance between two strings
 * 
 * Distance = minimum number of single-character edits:
 * - Insert a character
 * - Delete a character
 * - Replace a character
 * 
 * Examples:
 * - levenshtein('functoin', 'function') = 2 (replace 'o' with 'c', insert 't')
 * - levenshtein('if', 'fi') = 2 (delete 'i', insert 'i')
 * - levenshtein('const', 'cosnt') = 2 (swap 'n' and 's')
 * 
 * @param {string} source - Source string
 * @param {string} target - Target string
 * @returns {number} - Edit distance
 */
export function levenshteinDistance(source, target) {
    const m = source.length;
    const n = target.length;

    // Optimization: if one string is empty, distance is the length of the other
    if (m === 0) return n;
    if (n === 0) return m;

    // Create matrix: (m+1) x (n+1)
    const matrix = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // Initialize first column (deletions from source)
    for (let i = 0; i <= m; i++) {
        matrix[i][0] = i;
    }

    // Initialize first row (insertions to source)
    for (let j = 0; j <= n; j++) {
        matrix[0][j] = j;
    }

    // Fill the matrix
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = source[i - 1] === target[j - 1] ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // Deletion
                matrix[i][j - 1] + 1,      // Insertion
                matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return matrix[m][n];
}

/**
 * Calculate Levenshtein Distance (optimized for space)
 * Uses only O(min(m, n)) space instead of O(m * n)
 * 
 * @param {string} source - Source string
 * @param {string} target - Target string
 * @returns {number} - Edit distance
 */
export function levenshteinDistanceOptimized(source, target) {
    // Ensure source is the shorter string
    if (source.length > target.length) {
        [source, target] = [target, source];
    }

    const m = source.length;
    const n = target.length;

    if (m === 0) return n;

    // Use only two rows instead of full matrix
    let prevRow = Array(m + 1).fill(0).map((_, i) => i);
    let currRow = Array(m + 1).fill(0);

    for (let j = 1; j <= n; j++) {
        currRow[0] = j;

        for (let i = 1; i <= m; i++) {
            const cost = source[i - 1] === target[j - 1] ? 0 : 1;

            currRow[i] = Math.min(
                currRow[i - 1] + 1,      // Insertion
                prevRow[i] + 1,          // Deletion
                prevRow[i - 1] + cost    // Substitution
            );
        }

        [prevRow, currRow] = [currRow, prevRow];
    }

    return prevRow[m];
}

/**
 * Calculate similarity ratio (0-1) based on Levenshtein Distance
 * 
 * @param {string} source - Source string
 * @param {string} target - Target string
 * @returns {number} - Similarity ratio (0 = completely different, 1 = identical)
 */
export function similarityRatio(source, target) {
    const maxLen = Math.max(source.length, target.length);
    if (maxLen === 0) return 1.0; // Both strings are empty

    const distance = levenshteinDistanceOptimized(source, target);
    return 1 - (distance / maxLen);
}

/**
 * Find the closest match from a list of candidates
 * 
 * Example:
 * findClosestMatch('functoin', ['function', 'for', 'const'])
 *  { found: true, match: 'function', distance: 2, similarity: 0.75 }
 * 
 * @param {string} input - Input string (possibly misspelled)
 * @param {Array<string>} candidates - List of valid strings
 * @param {number} maxDistance - Maximum acceptable distance (default: 3)
 * @returns {{found: boolean, match: string|null, distance: number, similarity: number}}
 */
export function findClosestMatch(input, candidates, maxDistance = FUZZY_CONFIG.maxDistance) {
    let bestMatch = null;
    let bestDistance = Infinity;

    for (const candidate of candidates) {
        const distance = levenshteinDistanceOptimized(input, candidate);

        if (distance < bestDistance && distance <= maxDistance) {
            bestDistance = distance;
            bestMatch = candidate;
        }
    }

    if (bestMatch === null) {
        // !  NO_SILENT_FALLBACKS: คืน Object ที่มีสถานะชัดเจนแทน null
        return {
            found: false,
            match: null,
            distance: Infinity,
            similarity: 0
        };
    }

    return {
        found: true,
        match: bestMatch,
        distance: bestDistance,
        similarity: similarityRatio(input, bestMatch)
    };
}

/**
 * Find all similar matches within a threshold
 * 
 * Example:
 * findSimilarMatches('functoin', ['function', 'functional', 'for'], 0.7)
 *  [
 *     { match: 'function', distance: 2, similarity: 0.75 },
 *     { match: 'functional', distance: 4, similarity: 0.6 }
 *   ]
 * 
 * @param {string} input - Input string
 * @param {Array<string>} candidates - List of valid strings
 * @param {number} minSimilarity - Minimum similarity threshold (0-1, default: 0.7)
 * @returns {Array<{match: string, distance: number, similarity: number}>}
 */
export function findSimilarMatches(input, candidates, minSimilarity = FUZZY_CONFIG.minSimilarity) {
    const results = [];

    for (const candidate of candidates) {
        const distance = levenshteinDistanceOptimized(input, candidate);
        const similarity = 1 - (distance / Math.max(input.length, candidate.length));

        if (similarity >= minSimilarity) {
            results.push({
                match: candidate,
                distance,
                similarity
            });
        }
    }

    // Sort by similarity (descending)
    return results.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Check if two strings are within a certain edit distance
 * (Fast early exit if distance exceeds threshold)
 * 
 * @param {string} source - Source string
 * @param {string} target - Target string
 * @param {number} threshold - Maximum acceptable distance
 * @returns {boolean}
 */
export function isWithinDistance(source, target, threshold) {
    // Quick checks
    const lengthDiff = Math.abs(source.length - target.length);
    if (lengthDiff > threshold) return false;

    // If strings are identical
    if (source === target) return true;

    // Calculate distance (can optimize with early exit)
    const distance = levenshteinDistanceOptimized(source, target);
    return distance <= threshold;
}

/**
 * Damerau-Levenshtein Distance (includes transpositions)
 * More accurate for typos where adjacent characters are swapped
 * 
 * Example:
 * - levenshtein('cosnt', 'const') = 2 (delete 'n', insert 'n')
 * - damerauLevenshtein('cosnt', 'const') = 1 (transpose 's' and 'n')
 * 
 * @param {string} source - Source string
 * @param {string} target - Target string
 * @returns {number} - Edit distance (including transpositions)
 */
export function damerauLevenshteinDistance(source, target) {
    const m = source.length;
    const n = target.length;

    if (m === 0) return n;
    if (n === 0) return m;

    const matrix = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // Initialize
    for (let i = 0; i <= m; i++) matrix[i][0] = i;
    for (let j = 0; j <= n; j++) matrix[0][j] = j;

    // Fill matrix
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = source[i - 1] === target[j - 1] ? 0 : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,          // Deletion
                matrix[i][j - 1] + 1,          // Insertion
                matrix[i - 1][j - 1] + cost    // Substitution
            );

            // Transposition
            if (i > 1 && j > 1 &&
                source[i - 1] === target[j - 2] &&
                source[i - 2] === target[j - 1]) {
                matrix[i][j] = Math.min(
                    matrix[i][j],
                    matrix[i - 2][j - 2] + 1    // Transposition cost
                );
            }
        }
    }

    return matrix[m][n];
}

/**
 * Find typo suggestions with enhanced algorithm
 * Uses Damerau-Levenshtein for better transposition handling
 * 
 * @param {string} input - Possibly misspelled input
 * @param {Array<string>} candidates - Valid words
 * @param {number} maxSuggestions - Maximum number of suggestions (default: 3)
 * @returns {Array<{word: string, distance: number, similarity: number}>}
 */
export function findTypoSuggestions(input, candidates, maxSuggestions = FUZZY_CONFIG.maxSuggestions) {
    const results = [];

    for (const candidate of candidates) {
        const distance = damerauLevenshteinDistance(input, candidate);
        const similarity = 1 - (distance / Math.max(input.length, candidate.length));

        // Only suggest if distance is reasonable
        if (distance <= FUZZY_CONFIG.maxDistance && distance > 0) {
            results.push({
                word: candidate,
                distance,
                similarity
            });
        }
    }

    // Sort by distance (ascending), then by length similarity
    results.sort((a, b) => {
        if (a.distance !== b.distance) {
            return a.distance - b.distance;
        }
        // Prefer words with similar length
        const lenDiffA = Math.abs(input.length - a.word.length);
        const lenDiffB = Math.abs(input.length - b.word.length);
        return lenDiffA - lenDiffB;
    });

    return results.slice(0, maxSuggestions);
}

export default {
    levenshteinDistance,
    levenshteinDistanceOptimized,
    similarityRatio,
    findClosestMatch,
    findSimilarMatches,
    isWithinDistance,
    damerauLevenshteinDistance,
    findTypoSuggestions
};
