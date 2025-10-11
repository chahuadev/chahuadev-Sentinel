// ES6 Modules
import { sum, multiply } from './math.js';
import * as utils from './utils.js';
import defaultExport from './default.js';

export const PI = 3.14159;

export function calculateArea(radius) {
    return PI * radius * radius;
}

export default class Calculator {
    add(a, b) {
        return a + b;
    }
}
