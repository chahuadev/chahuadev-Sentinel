// Template literals
const name = 'World';
const greeting = `Hello, ${name}!`;

const multiline = `
    This is a
    multiline string
    with ${greeting}
`;

// Tagged template
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] || '');
    }, '');
}

const emphasized = highlight`Name: ${name}`;
