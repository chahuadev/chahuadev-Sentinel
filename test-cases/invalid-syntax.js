// Intentionally invalid syntax
// Note: This file contains syntax errors ON PURPOSE for testing error handling
// It should NOT pass linting - these are test cases for the parser's error detection

// Test Case 1: Missing value
// const x = ; // Missing value

// Test Case 2: Missing closing brace
// function missingBrace() {
//     return 42;
// // Missing closing brace

// Test Case 3: Missing extends target
// class MissingExtends extends {
//     constructor() {
//         super();
//     }
// }

// Test Case 4: Invalid identifier
// const y = 123abc; // Unexpected token

// For actual testing, these should be stored as strings:
const invalidSyntaxExamples = [
    'const x = ;',  // Missing value
    'function missingBrace() { return 42;',  // Missing closing brace
    'class MissingExtends extends { }',  // Missing extends target
    'const y = 123abc;',  // Invalid identifier
    'if (x > 0',  // Missing closing parenthesis
    'const { x, } = ;',  // Missing destructuring target
];

// Export for use in E2E tests
export default invalidSyntaxExamples;
