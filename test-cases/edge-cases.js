// Edge cases and quirky JavaScript

// With statement (deprecated but valid)
// Note: 'with' is not allowed in strict mode, but is valid JavaScript
// Commented out to avoid linter errors, but parser should handle it
// with (Math) {
//     const x = cos(PI);
// }

// Comma operator
let a = (1, 2, 3); // a = 3

// Void operator
void function() {
    console.log('IIFE');
}();

// In operator
const obj = { prop: true };
const hasProp = 'prop' in obj;

// Instanceof
const arr = [];
const isArray = arr instanceof Array;

// Typeof with quirks
typeof null; // "object" (quirk!)
typeof undefined; // "undefined"
typeof function(){}; // "function"

// Delete operator
const obj2 = { x: 1 };
delete obj2.x;

// Label statement
loop1:
for (let i = 0; i < 3; i++) {
    if (i === 1) {
        break loop1;
    }
}
