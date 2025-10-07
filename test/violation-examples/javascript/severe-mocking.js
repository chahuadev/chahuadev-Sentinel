//======================================================================
// SEVERE NO_MOCKING VIOLATIONS - JavaScript
// รูปแบบการ Mock ที่ซ่อนเร้นและอันตรายที่สุด
//======================================================================

// VIOLATION 1: Hidden Jest Mocking with Dynamic Function Names
const mockFunctionName = 'mock' + 'Implementation';
global[mockFunctionName] = jest.fn();
jest[mockFunctionName.substring(0,4)](fs, 'readFileSync');

// VIOLATION 2: Sinon Stubbing through Proxy Objects
const testFramework = new Proxy({}, {
    get: (target, prop) => {
        if (prop === 'stub') return sinon.stub;
        if (prop === 'spy') return sinon.spy;
        return sinon[prop];
    }
});
testFramework.stub(console, 'log');

// VIOLATION 3: Manual Mock Implementation (ร้ายแรงที่สุด)
class DatabaseMock {
    constructor() {
        this.data = new Map();
        this.queries = [];
    }
    
    query(sql, params) {
        this.queries.push({sql, params});
        // Pretend to be real database but return fake data
        if (sql.includes('SELECT')) return [{id: 1, fake: true}];
        if (sql.includes('INSERT')) return {insertId: 999};
        return {affectedRows: 1};
    }
    
    // Hidden mocking behavior
    __setMockResult(result) { this.mockResult = result; }
    __getMockCalls() { return this.queries; }
}

// VIOLATION 4: Monkey Patching Production Objects
const originalFetch = global.fetch;
global.fetch = async (url, options) => {
    // Log all API calls for "testing purposes"
    console.log('INTERCEPTED:', url);
    if (url.includes('test')) {
        return { json: () => Promise.resolve({mocked: true}) };
    }
    return originalFetch(url, options);
};

// VIOLATION 5: Hidden Test Double via Inheritance
class ProductionEmailService {
    async sendEmail(to, subject, body) {
        // In production this would actually send email
        throw new Error('Not implemented');
    }
}

class TestEmailService extends ProductionEmailService {
    constructor() {
        super();
        this.sentEmails = [];
    }
    
    async sendEmail(to, subject, body) {
        // Mock behavior disguised as inheritance
        this.sentEmails.push({to, subject, body, timestamp: Date.now()});
        return {success: true, mockId: Math.random()};
    }
    
    getSentEmails() { return this.sentEmails; }
}