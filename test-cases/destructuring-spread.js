// Destructuring and spread operators
const person = {
    name: 'John',
    age: 30,
    city: 'New York'
};

const { name, age, ...rest } = person;

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...remaining] = numbers;

const combined = [...numbers, 6, 7, 8];
const merged = { ...person, country: 'USA' };
