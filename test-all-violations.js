// ======================================================================
// TEST FILE - Contains ALL 5 Rule Violations (including EMOJI)
// ======================================================================

// ❌ VIOLATION 5: Emoji in code
const STATUS_SUCCESS = '✅'; // 🚫 FORBIDDEN!
const STATUS_ERROR = '❌'; // 🚫 FORBIDDEN!
const ROCKET = '🚀'; // 🚫 FORBIDDEN!

function displayMessage() {
    console.log('✅ Success!'); // 🚫 FORBIDDEN!
    console.log('🎉 Celebrate'); // 🚫 FORBIDDEN!
    return '👍 OK'; // 🚫 FORBIDDEN!
}

// ❌ VIOLATION 1: Mocking
jest.mock('./database');
const spy = jest.spyOn(obj, 'method');

// ❌ VIOLATION 2: Hardcoded URL
const API_URL = 'https://api.example.com/v1/users';
const DB_CONN = 'mongodb://localhost:27017/mydb';

// ❌ VIOLATION 3: Silent fallback
function getData() {
    try {
        return fetchFromAPI();
    } catch (error) {
        return null; // Silent failure!
    }
}

// ❌ VIOLATION 4: Internal cache
const cache = new Map();
function expensiveOperation(input) {
    if (cache.has(input)) {
        return cache.get(input);
    }
    const result = compute(input);
    cache.set(input, result);
    return result;
}

// ✅ GOOD: No violations
function goodFunction(config, logger) {
    const STATUS_SUCCESS = 'success'; // Plain text instead of ✅
    const STATUS_ERROR = 'error'; // Plain text instead of ❌

    try {
        return processData(config.apiUrl); // Config instead of hardcode
    } catch (error) {
        logger.error('Failed to process:', error); // Log before action
        throw error; // Throw instead of silent return
    }
}
