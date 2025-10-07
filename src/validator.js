//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================

// ======================================================================
// ABSOLUTE RULES CONFIGURATION
//  กฎเหล็กทั้ง 5 ข้อ พร้อมรายละเอียดครบถ้วน
// ======================================================================
const ABSOLUTE_RULES = {
// ======================================================================
// NO_MOCKING - ห้ามใช้ Mock/Stub/Spy
// ======================================================================   
    NO_MOCKING: {
        id: 'NO_MOCKING',
        name: {
            en: 'No Mock/Stub/Spy',
            th: 'ห้ามสร้าง Mock/Stub/Spy'
        },
        description: {
            en: 'DO NOT use jest.mock(), sinon.stub(), or any mocking libraries. Use Dependency Injection instead.',
            th: 'ห้ามใช้ jest.mock(), sinon.stub() หรือไลบรารี Mock ใดๆ โดยเด็ดขาด ให้ใช้ Dependency Injection แทน'
        },
        explanation: {
            en: `Mocking creates TIGHT COUPLING between tests and implementation details, making refactoring extremely difficult and leading to BRITTLE TESTS that break when internal implementation changes.

Why mocking is HARMFUL:
1) IMPLEMENTATION COUPLING: Tests become dependent on internal method names, call order, and private details
2) REFACTORING NIGHTMARE: Changing internal implementation breaks tests even when behavior is correct
3) FALSE CONFIDENCE: Tests pass but don't validate actual integration between components
4) DEBUGGING HELL: When integration fails in production, mocked tests provide no insight
5) MAINTENANCE BURDEN: Every internal change requires updating multiple mock configurations
6) BEHAVIOR DISCONNECT: Tests mock behavior instead of verifying real component interactions
7) INTEGRATION BLIND SPOTS: Real integration bugs are never caught by mocked tests
8) TEST COMPLEXITY: Mock setup often more complex than the code being tested
9) PRODUCTION MISMATCH: Test environment behavior differs from production due to mocks
10) DEPENDENCY INVERSION VIOLATION: Forces tests to know implementation details

SOLUTION: Use Dependency Injection to pass real or test implementations through function parameters.

Example:
BAD:  jest.mock('./database'); // Tests don't validate real database integration
GOOD: function createUser(userData, database) { return database.save(userData); } // Tests can pass real or test database`,
            th: `การใช้ Mock ทำให้เกิด TIGHT COUPLING ระหว่าง test และรายละเอียดการทำงาน ทำให้ refactor ยากมากและ test เปราะบางแตกง่ายเมื่อเปลี่ยน implementation

ทำไม Mock จึงเป็นอันตราย:
1) IMPLEMENTATION COUPLING: Test ผูกติดกับชื่อ method, ลำดับการเรียก และรายละเอียดภายใน
2) REFACTORING ฝันร้าย: เปลี่ยน implementation ภายในทำให้ test แตกแม้ behavior ถูกต้อง
3) ความเชื่อมั่นเท็จ: Test ผ่านแต่ไม่ได้ validate integration จริงระหว่าง component
4) DEBUG นรก: เมื่อ integration พังใน production, mock test ไม่ให้ข้อมูล insight
5) ภาระ MAINTENANCE: เปลี่ยน implementation ต้องไปแก้ mock หลายที่
6) พฤติกรรมไม่ตรง: Test mock behavior แทนที่จะ verify การทำงานจริง
7) มองไม่เห็น INTEGRATION BUG: Bug การเชื่อมต่อจริงไม่เจอด้วย mock test
8) TEST ซับซ้อน: การตั้ง mock ซับซ้อนกว่าโค้ดที่ test
9) PRODUCTION ไม่ตรง: Test environment ต่างจาก production เพราะ mock
10) ละเมิด DEPENDENCY INVERSION: บังคับให้ test รู้รายละเอียด implementation

วิธีแก้: ใช้ Dependency Injection ส่ง implementation จริงหรือเพื่อ test ผ่าน parameter

ตัวอย่าง:
ไม่ดี: jest.mock('./database'); // Test ไม่ validate integration database จริง
ดี: function createUser(userData, database) { return database.save(userData); } // Test ส่ง database จริงหรือ test database ได้`
        },
        violationExamples: {
            en: [
                `/**
                 * @example-for-rule NO_MOCKING
                 * @type violation
                 * @matches-pattern jest.mock() usage
                 */
jest.mock('./emailService');
const emailService = require('./emailService');
emailService.send.mockResolvedValue(true);

test('should send notification', async () => {
  await sendNotification('user@example.com', 'Hello');
  expect(emailService.send).toHaveBeenCalledWith('user@example.com', 'Hello');
});`,

                `/**
                 * @example-for-rule NO_MOCKING
                 * @type violation
                 * @matches-pattern sinon.stub() usage
                 */
const sinon = require('sinon');
const fs = require('fs');
const stub = sinon.stub(fs, 'readFileSync').returns('fake data');

test('should read config', () => {
  const config = readConfig('./config.json');
  expect(config).toBe('fake data');
});`,

                `/**
                 * @example-for-rule NO_MOCKING
                 * @type violation
                 * @matches-pattern jest.spyOn() usage
                 */
const spy = jest.spyOn(userService, 'validateEmail');
await createUser({email: 'test@test.com'});
expect(spy).toHaveBeenCalledTimes(1);`
            ],
            th: [
                `/**
                 * @example-for-rule NO_MOCKING
                 * @type violation
                 * @matches-pattern jest.mock() usage
                 */
jest.mock('./emailService');
const emailService = require('./emailService');
emailService.send.mockResolvedValue(true);

test('ควรส่งการแจ้งเตือน', async () => {
  await sendNotification('user@example.com', 'สวัสดี');
  expect(emailService.send).toHaveBeenCalledWith('user@example.com', 'สวัสดี');
});`,

                `/**
                 * @example-for-rule NO_MOCKING
                 * @type violation
                 * @matches-pattern sinon.stub() usage
                 */
const sinon = require('sinon');
const fs = require('fs');
const stub = sinon.stub(fs, 'readFileSync').returns('ข้อมูลปลอม');

test('ควรอ่าน config', () => {
  const config = readConfig('./config.json');
  expect(config).toBe('ข้อมูลปลอม');
});`,

                `/**
                 * @example-for-rule NO_MOCKING
                 * @type violation
                 * @matches-pattern jest.spyOn() usage
                 */
const spy = jest.spyOn(userService, 'validateEmail');
await createUser({email: 'test@test.com'});
expect(spy).toHaveBeenCalledTimes(1);`
            ]
        },
        correctExamples: {
            en: [
                `/**
                 * @example-for-rule NO_MOCKING
                 * @type correct
                 */
function sendNotification(email, message, emailService = defaultEmailService) {
  return emailService.send(email, message);
}

test('should send notification', async () => {
  const testEmailService = { 
    send: async (email, msg) => ({ success: true, email, msg })
  };
  const result = await sendNotification('user@example.com', 'Hello', testEmailService);
  expect(result.success).toBe(true);
});`,

                `/**
                 * @example-for-rule NO_MOCKING
                 * @type correct
                 */
class UserService {
  constructor(database, emailService, logger) {
    this.database = database;
    this.emailService = emailService;
    this.logger = logger;
  }
  
  async createUser(userData) {
    const user = await this.database.save(userData);
    await this.emailService.sendWelcome(user.email);
    this.logger.info('User created', user.id);
    return user;
  }
}

const userService = new UserService(realDatabase, realEmailService, realLogger);`
            ],
            th: [
                `// ดี: Dependency Injection อนุญาตให้ใช้ implementation จริงและ test
function sendNotification(email, message, emailService = defaultEmailService) {
  return emailService.send(email, message);
}

// Test ด้วย implementation จริงหรือ test double
test('ควรส่งการแจ้งเตือน', async () => {
  const testEmailService = { 
    send: async (email, msg) => ({ success: true, email, msg })
  };
  const result = await sendNotification('user@example.com', 'สวัสดี', testEmailService);
  expect(result.success).toBe(true);
});`,

                `// ดี: Dependencies แบบ configuration-based
class UserService {
  constructor(database, emailService, logger) {
    this.database = database;
    this.emailService = emailService;
    this.logger = logger;
  }
  
  async createUser(userData) {
    const user = await this.database.save(userData);
    await this.emailService.sendWelcome(user.email);
    this.logger.info('สร้างผู้ใช้แล้ว', user.id);
    return user;
  }
}

// การใช้งานจริง
const userService = new UserService(realDatabase, realEmailService, realLogger);

// การใช้งานใน test  
const userService = new UserService(testDatabase, testEmailService, testLogger);`
            ]
        },
        patterns: [
            // Jest mocking patterns (all variants)
            { regex: /jest\.mock\s*\(/, name: 'jest.mock()', severity: 'ERROR' },
            { regex: /jest\.unmock\s*\(/, name: 'jest.unmock()', severity: 'ERROR' },
            { regex: /jest\.doMock\s*\(/, name: 'jest.doMock()', severity: 'ERROR' },
            { regex: /jest\.dontMock\s*\(/, name: 'jest.dontMock()', severity: 'ERROR' },
            { regex: /jest\.setMock\s*\(/, name: 'jest.setMock()', severity: 'ERROR' },
            { regex: /jest\.spyOn\s*\(/, name: 'jest.spyOn()', severity: 'ERROR' },
            { regex: /jest\.fn\s*\(/, name: 'jest.fn()', severity: 'ERROR' },
            { regex: /jest\.clearAllMocks\s*\(/, name: 'jest.clearAllMocks()', severity: 'ERROR' },
            { regex: /jest\.resetAllMocks\s*\(/, name: 'jest.resetAllMocks()', severity: 'ERROR' },
            { regex: /jest\.restoreAllMocks\s*\(/, name: 'jest.restoreAllMocks()', severity: 'ERROR' },
            { regex: /\.mockImplementation\s*\(/, name: '.mockImplementation()', severity: 'ERROR' },
            { regex: /\.mockImplementationOnce\s*\(/, name: '.mockImplementationOnce()', severity: 'ERROR' },
            { regex: /\.mockReturnValue\s*\(/, name: '.mockReturnValue()', severity: 'ERROR' },
            { regex: /\.mockReturnValueOnce\s*\(/, name: '.mockReturnValueOnce()', severity: 'ERROR' },
            { regex: /\.mockResolvedValue\s*\(/, name: '.mockResolvedValue()', severity: 'ERROR' },
            { regex: /\.mockResolvedValueOnce\s*\(/, name: '.mockResolvedValueOnce()', severity: 'ERROR' },
            { regex: /\.mockRejectedValue\s*\(/, name: '.mockRejectedValue()', severity: 'ERROR' },
            { regex: /\.mockRejectedValueOnce\s*\(/, name: '.mockRejectedValueOnce()', severity: 'ERROR' },
            { regex: /\.mockClear\s*\(/, name: '.mockClear()', severity: 'ERROR' },
            { regex: /\.mockReset\s*\(/, name: '.mockReset()', severity: 'ERROR' },
            { regex: /\.mockRestore\s*\(/, name: '.mockRestore()', severity: 'ERROR' },

            // Sinon mocking patterns (comprehensive)
            { regex: /sinon\.stub\s*\(/, name: 'sinon.stub()', severity: 'ERROR' },
            { regex: /sinon\.spy\s*\(/, name: 'sinon.spy()', severity: 'ERROR' },
            { regex: /sinon\.mock\s*\(/, name: 'sinon.mock()', severity: 'ERROR' },
            { regex: /sinon\.fake\s*\(/, name: 'sinon.fake()', severity: 'ERROR' },
            { regex: /sinon\.replace\s*\(/, name: 'sinon.replace()', severity: 'ERROR' },
            { regex: /sinon\.createStubInstance\s*\(/, name: 'sinon.createStubInstance()', severity: 'ERROR' },
            { regex: /sinon\.sandbox\s*\./, name: 'sinon.sandbox', severity: 'ERROR' },

            // Mocha/Chai mocking and test doubles
            { regex: /chai\.spy\s*\(/, name: 'chai.spy()', severity: 'ERROR' },
            { regex: /proxyquire\s*\(/, name: 'proxyquire()', severity: 'ERROR' },
            { regex: /rewire\s*\(/, name: 'rewire()', severity: 'ERROR' },
            { regex: /testdouble\.replace\s*\(/, name: 'testdouble.replace()', severity: 'ERROR' },
            { regex: /testdouble\.when\s*\(/, name: 'testdouble.when()', severity: 'ERROR' },
            { regex: /testdouble\.verify\s*\(/, name: 'testdouble.verify()', severity: 'ERROR' },

            // Node.js specific mocking
            { regex: /require\.cache\s*\[/, name: 'require.cache manipulation', severity: 'ERROR' },
            { regex: /module\._load\s*=/, name: 'module._load override', severity: 'ERROR' },
            { regex: /process\.env\.NODE_ENV\s*=/, name: 'NODE_ENV mocking', severity: 'WARNING' },

            // Generic mocking keywords and patterns
            { regex: /\.mockReturnThis\s*\(/, name: '.mockReturnThis()', severity: 'ERROR' },
            { regex: /\.toHaveBeenCalled/, name: 'jest spy assertion', severity: 'ERROR' },
            { regex: /\.toHaveBeenCalledWith/, name: 'jest spy assertion with params', severity: 'ERROR' },
            { regex: /\.toHaveBeenCalledTimes/, name: 'jest call count assertion', severity: 'ERROR' },
            { regex: /\.toHaveBeenLastCalledWith/, name: 'jest last call assertion', severity: 'ERROR' },
            { regex: /\.toHaveBeenNthCalledWith/, name: 'jest nth call assertion', severity: 'ERROR' },

            // Library-specific mocking patterns
            { regex: /nock\s*\(/, name: 'nock() HTTP mocking', severity: 'ERROR' },
            { regex: /mockttp\s*\./, name: 'mockttp HTTP mocking', severity: 'ERROR' },
            { regex: /msw\s*\./, name: 'Mock Service Worker', severity: 'ERROR' },
            { regex: /jest-fetch-mock/, name: 'jest-fetch-mock', severity: 'ERROR' },
            { regex: /axios-mock-adapter/, name: 'axios-mock-adapter', severity: 'ERROR' },

            // Framework-specific mocking
            { regex: /@testing-library.*mock/, name: 'Testing Library mocking', severity: 'ERROR' },
            { regex: /enzyme.*mount.*mock/, name: 'Enzyme mocking', severity: 'ERROR' },
            { regex: /shallow.*mock/, name: 'Shallow rendering with mocks', severity: 'ERROR' },

            // Database and external service mocking
            { regex: /mongodb-memory-server/, name: 'MongoDB memory server mocking', severity: 'WARNING' },
            { regex: /jest-dynalite/, name: 'DynamoDB mocking', severity: 'WARNING' },
            { regex: /aws-sdk-mock/, name: 'AWS SDK mocking', severity: 'ERROR' },

            // Variable and function name patterns indicating mocking
            { regex: /\bmock[A-Z]\w*/, name: 'mockVariableName pattern', severity: 'WARNING' },
            { regex: /\bstub[A-Z]\w*/, name: 'stubVariableName pattern', severity: 'WARNING' },
            { regex: /\bspy[A-Z]\w*/, name: 'spyVariableName pattern', severity: 'WARNING' },
            { regex: /\bfake[A-Z]\w*/, name: 'fakeVariableName pattern', severity: 'WARNING' },
            { regex: /\bdouble[A-Z]\w*/, name: 'testDoubleVariableName pattern', severity: 'WARNING' },
            { regex: /\.returns\s*\(/, name: '.returns() (sinon)', severity: 'WARNING' },
            { regex: /\.resolves\s*\(/, name: '.resolves() (sinon)', severity: 'WARNING' },
            { regex: /\.rejects\s*\(/, name: '.rejects() (sinon)', severity: 'WARNING' },
            { regex: /\.callsFake\s*\(/, name: '.callsFake() (sinon)', severity: 'ERROR' },
            { regex: /\.yields\s*\(/, name: '.yields() (sinon)', severity: 'ERROR' },

            // Advanced Jest mocking patterns
            { regex: /jest\.createMockFromModule\s*\(/, name: 'jest.createMockFromModule()', severity: 'ERROR' },
            { regex: /jest\.requireActual\s*\(/, name: 'jest.requireActual()', severity: 'ERROR' },
            { regex: /jest\.requireMock\s*\(/, name: 'jest.requireMock()', severity: 'ERROR' },
            { regex: /jest\.genMockFromModule\s*\(/, name: 'jest.genMockFromModule()', severity: 'ERROR' },
            { regex: /\.mockName\s*\(/, name: '.mockName()', severity: 'ERROR' },
            { regex: /\.getMockName\s*\(/, name: '.getMockName()', severity: 'ERROR' },
            { regex: /\.mock\.calls/, name: '.mock.calls property', severity: 'ERROR' },
            { regex: /\.mock\.instances/, name: '.mock.instances property', severity: 'ERROR' },
            { regex: /\.mock\.contexts/, name: '.mock.contexts property', severity: 'ERROR' },
            { regex: /\.mock\.results/, name: '.mock.results property', severity: 'ERROR' },
            { regex: /\.mock\.lastCall/, name: '.mock.lastCall property', severity: 'ERROR' },

            // Sinon advanced patterns
            { regex: /sinon\.useFakeTimers\s*\(/, name: 'sinon.useFakeTimers()', severity: 'ERROR' },
            { regex: /sinon\.useFakeXMLHttpRequest\s*\(/, name: 'sinon.useFakeXMLHttpRequest()', severity: 'ERROR' },
            { regex: /sinon\.useFakeServer\s*\(/, name: 'sinon.useFakeServer()', severity: 'ERROR' },
            { regex: /sinon\.fakeServer\s*\./, name: 'sinon.fakeServer', severity: 'ERROR' },
            { regex: /sinon\.fakeServerWithClock\s*\./, name: 'sinon.fakeServerWithClock', severity: 'ERROR' },
            { regex: /\.calledWith\s*\(/, name: '.calledWith() (sinon)', severity: 'ERROR' },
            { regex: /\.calledOnce\b/, name: '.calledOnce (sinon)', severity: 'ERROR' },
            { regex: /\.calledTwice\b/, name: '.calledTwice (sinon)', severity: 'ERROR' },
            { regex: /\.calledThrice\b/, name: '.calledThrice (sinon)', severity: 'ERROR' },
            { regex: /\.callCount\b/, name: '.callCount (sinon)', severity: 'ERROR' },
            { regex: /\.firstCall\b/, name: '.firstCall (sinon)', severity: 'ERROR' },
            { regex: /\.secondCall\b/, name: '.secondCall (sinon)', severity: 'ERROR' },
            { regex: /\.lastCall\b/, name: '.lastCall (sinon)', severity: 'ERROR' },
            { regex: /\.getCall\s*\(/, name: '.getCall() (sinon)', severity: 'ERROR' },
            { regex: /\.thisValues\b/, name: '.thisValues (sinon)', severity: 'ERROR' },
            { regex: /\.args\b/, name: '.args (sinon)', severity: 'ERROR' },
            { regex: /\.returnValues\b/, name: '.returnValues (sinon)', severity: 'ERROR' },
            { regex: /\.exceptions\b/, name: '.exceptions (sinon)', severity: 'ERROR' },

            // Testing framework mocking utilities
            { regex: /vitest\.mock\s*\(/, name: 'vitest.mock()', severity: 'ERROR' },
            { regex: /vitest\.spyOn\s*\(/, name: 'vitest.spyOn()', severity: 'ERROR' },
            { regex: /vitest\.fn\s*\(/, name: 'vitest.fn()', severity: 'ERROR' },
            { regex: /vi\.mock\s*\(/, name: 'vi.mock() (vitest)', severity: 'ERROR' },
            { regex: /vi\.spyOn\s*\(/, name: 'vi.spyOn() (vitest)', severity: 'ERROR' },
            { regex: /vi\.fn\s*\(/, name: 'vi.fn() (vitest)', severity: 'ERROR' },
            { regex: /jasmine\.createSpy\s*\(/, name: 'jasmine.createSpy()', severity: 'ERROR' },
            { regex: /jasmine\.createSpyObj\s*\(/, name: 'jasmine.createSpyObj()', severity: 'ERROR' },
            { regex: /spyOn\s*\(/, name: 'spyOn() (jasmine)', severity: 'ERROR' },

            // Mock file and module patterns
            { regex: /__mocks__/, name: '__mocks__ directory', severity: 'ERROR' },
            { regex: /\.mock\.(js|ts|jsx|tsx)$/, name: 'mock file extension', severity: 'ERROR' },
            { regex: /manual-mocks/, name: 'manual-mocks directory', severity: 'ERROR' },

            // External service mocking libraries
            { regex: /miragejs/, name: 'MirageJS API mocking', severity: 'ERROR' },
            { regex: /json-server/, name: 'JSON Server mocking', severity: 'WARNING' },
            { regex: /mockoon/, name: 'Mockoon API mocking', severity: 'ERROR' },
            { regex: /wiremock/, name: 'WireMock', severity: 'ERROR' },
            { regex: /hoverfly/, name: 'Hoverfly mocking', severity: 'ERROR' },

            // Dynamic and runtime mocking
            { regex: /Object\.defineProperty.*mock/, name: 'Object.defineProperty mocking', severity: 'ERROR' },
            { regex: /Object\.assign.*mock/, name: 'Object.assign mocking', severity: 'ERROR' },
            { regex: /Proxy.*mock/, name: 'Proxy-based mocking', severity: 'ERROR' },
            { regex: /Reflect.*mock/, name: 'Reflect API mocking', severity: 'ERROR' },

            // Time and date mocking
            { regex: /mockdate/, name: 'MockDate library', severity: 'ERROR' },
            { regex: /timekeeper/, name: 'Timekeeper library', severity: 'ERROR' },
            { regex: /jest\.useFakeTimers\s*\(/, name: 'jest.useFakeTimers()', severity: 'ERROR' },
            { regex: /jest\.useRealTimers\s*\(/, name: 'jest.useRealTimers()', severity: 'ERROR' },
            { regex: /jest\.setSystemTime\s*\(/, name: 'jest.setSystemTime()', severity: 'ERROR' },
            { regex: /jest\.getRealSystemTime\s*\(/, name: 'jest.getRealSystemTime()', severity: 'ERROR' },

            // Browser and DOM mocking
            { regex: /jsdom/, name: 'JSDOM environment mocking', severity: 'WARNING' },
            { regex: /happy-dom/, name: 'Happy DOM mocking', severity: 'WARNING' },
            { regex: /puppeteer.*mock/, name: 'Puppeteer mocking', severity: 'ERROR' },
            { regex: /playwright.*mock/, name: 'Playwright mocking', severity: 'ERROR' },

            // Network and HTTP mocking
            { regex: /fetch-mock/, name: 'fetch-mock library', severity: 'ERROR' },
            { regex: /supertest.*mock/, name: 'Supertest with mocking', severity: 'ERROR' },
            { regex: /http-mock/, name: 'HTTP mocking', severity: 'ERROR' },

            // Vitest mocking patterns
            { regex: /vi\.mock\s*\(/, name: 'vitest mock()', severity: 'ERROR' },
            { regex: /vi\.unmock\s*\(/, name: 'vitest unmock()', severity: 'ERROR' },
            { regex: /vi\.doMock\s*\(/, name: 'vitest doMock()', severity: 'ERROR' },
            { regex: /vi\.doUnmock\s*\(/, name: 'vitest doUnmock()', severity: 'ERROR' },
            { regex: /vi\.fn\s*\(/, name: 'vitest fn()', severity: 'ERROR' },
            { regex: /vi\.spyOn\s*\(/, name: 'vitest spyOn()', severity: 'ERROR' },
            { regex: /vi\.clearAllMocks\s*\(/, name: 'vitest clearAllMocks()', severity: 'ERROR' },
            { regex: /vi\.resetAllMocks\s*\(/, name: 'vitest resetAllMocks()', severity: 'ERROR' },
            { regex: /vi\.restoreAllMocks\s*\(/, name: 'vitest restoreAllMocks()', severity: 'ERROR' },

            // TestDouble patterns
            { regex: /td\.replace\s*\(/, name: 'testdouble replace()', severity: 'ERROR' },
            { regex: /td\.function\s*\(/, name: 'testdouble function()', severity: 'ERROR' },
            { regex: /td\.object\s*\(/, name: 'testdouble object()', severity: 'ERROR' },
            { regex: /td\.constructor\s*\(/, name: 'testdouble constructor()', severity: 'ERROR' },
            { regex: /td\.when\s*\(/, name: 'testdouble when()', severity: 'ERROR' },
            { regex: /td\.verify\s*\(/, name: 'testdouble verify()', severity: 'ERROR' },

            // Other mocking libraries
            { regex: /proxyquire\s*\(/, name: 'proxyquire()', severity: 'ERROR' },
            { regex: /mockery\./, name: 'mockery library', severity: 'ERROR' },
            { regex: /rewire\s*\(/, name: 'rewire()', severity: 'ERROR' },
            { regex: /@mock\s+/, name: '@mock decorator', severity: 'ERROR' },
            { regex: /@spy\s+/, name: '@spy decorator', severity: 'ERROR' },

            // Import statements for mocking libraries
            { regex: /import\s+.*\s+from\s+['"]sinon['"]/, name: 'import sinon', severity: 'ERROR' },
            { regex: /import\s+.*\s+from\s+['"]@sinonjs/, name: 'import @sinonjs', severity: 'ERROR' },
            { regex: /import\s+.*\s+from\s+['"]testdouble['"]/, name: 'import testdouble', severity: 'ERROR' },
            { regex: /import\s+.*\s+from\s+['"]proxyquire['"]/, name: 'import proxyquire', severity: 'ERROR' },
            { regex: /import\s+.*\s+from\s+['"]mockery['"]/, name: 'import mockery', severity: 'ERROR' },
            { regex: /require\s*\(\s*['"]sinon['"]\s*\)/, name: 'require sinon', severity: 'ERROR' },
            { regex: /require\s*\(\s*['"]testdouble['"]\s*\)/, name: 'require testdouble', severity: 'ERROR' },

            // Additional mocking patterns - EXTENDED COVERAGE
            { regex: /jest\.createMockFromModule\s*\(/, name: 'jest.createMockFromModule()', severity: 'ERROR' },
            { regex: /jest\.requireActual\s*\(/, name: 'jest.requireActual() (used with mocks)', severity: 'WARNING' },

            // Modern mocking patterns (React Testing Library, etc.)
            { regex: /jest\.mocked\s*\(/, name: 'jest.mocked() TypeScript helper', severity: 'ERROR' },
            { regex: /\w+\.mockName\s*\(/, name: '.mockName() assignment', severity: 'ERROR' },
            { regex: /jest\.isMockFunction\s*\(/, name: 'jest.isMockFunction() check', severity: 'ERROR' },

            // ESM mocking patterns
            { regex: /jest\.unstable_mockModule\s*\(/, name: 'jest.unstable_mockModule() ESM mocking', severity: 'ERROR' },
            { regex: /await\s+import\s*\(\s*['"].*\.mock\.js['"]/, name: 'Dynamic import of mock files', severity: 'ERROR' },

            // Playwright/Puppeteer mocking
            { regex: /page\.route\s*\(/, name: 'Playwright page.route() mocking', severity: 'WARNING' },
            { regex: /page\.setRequestInterception\s*\(/, name: 'Puppeteer request interception', severity: 'WARNING' },

            // MSW (Mock Service Worker) patterns  
            { regex: /msw\./, name: 'MSW (Mock Service Worker)', severity: 'ERROR' },
            { regex: /rest\.get\s*\(/, name: 'MSW rest.get() handler', severity: 'ERROR' },
            { regex: /rest\.post\s*\(/, name: 'MSW rest.post() handler', severity: 'ERROR' },
            { regex: /graphql\.query\s*\(/, name: 'MSW graphql.query() handler', severity: 'ERROR' },

            // Nock (HTTP mocking)
            { regex: /import\s+.*\s+from\s+['"]nock['"]/, name: 'import nock (HTTP mocking)', severity: 'ERROR' },
            { regex: /nock\s*\(/, name: 'nock() HTTP interceptor', severity: 'ERROR' },

            // Fetch-mock
            { regex: /import\s+.*\s+from\s+['"]fetch-mock['"]/, name: 'import fetch-mock', severity: 'ERROR' },
            { regex: /fetchMock\./, name: 'fetchMock usage', severity: 'ERROR' },

            // Jest mock modules
            { regex: /__mocks__/, name: '__mocks__ directory (Jest convention)', severity: 'ERROR' },
            { regex: /\.mocked\s*\(/, name: '.mocked() type helper', severity: 'ERROR' },

            // Global mock functions
            { regex: /global\.\w+\s*=\s*jest\.fn/, name: 'global mock assignment', severity: 'ERROR' },
            { regex: /window\.\w+\s*=\s*jest\.fn/, name: 'window mock assignment', severity: 'ERROR' },
            { regex: /Object\.defineProperty\s*\([^)]*,\s*['"]mock/, name: 'Object.defineProperty mock', severity: 'ERROR' },

            // Monkey patching patterns (manual mocking)
            { regex: /const\s+original\w*\s*=\s*\w+\.\w+;\s*\w+\.\w+\s*=\s*jest\.fn/, name: 'Manual monkey patching with Jest', severity: 'ERROR' },
            { regex: /const\s+\w+Backup\s*=\s*\w+\.\w+;\s*\w+\.\w+\s*=\s*sinon/, name: 'Manual monkey patching with Sinon', severity: 'ERROR' },
            
            // Conditional mocking
            { regex: /if\s*\(\s*process\.env\.NODE_ENV.*mock/, name: 'Conditional mocking based on environment', severity: 'ERROR' },
            { regex: /\w+\s*\?\s*mockImplementation\s*:\s*realImplementation/, name: 'Ternary mock selection', severity: 'ERROR' },

            // Mock factory functions
            { regex: /function\s+create\w*Mock/, name: 'Mock factory function', severity: 'ERROR' },
            { regex: /const\s+\w*Mock\s*=\s*\(\s*\)\s*=>\s*\{/, name: 'Arrow function mock factory', severity: 'ERROR' },

            // React/Component mocking
            { regex: /jest\.mock\s*\(\s*['"][^'"]*\.jsx?['"]/, name: 'React component mocking', severity: 'ERROR' },
            { regex: /shallow\s*\(.*\)\.find/, name: 'Enzyme shallow rendering (mock-like)', severity: 'WARNING' },
            { regex: /mount\s*\(.*mockProps/, name: 'Component mounting with mock props', severity: 'WARNING' },

            // Database/ORM mocking
            { regex: /\w+\.query\.mockResolvedValue/, name: 'Database query mocking', severity: 'ERROR' },
            { regex: /\w+\.findOne\.mockImplementation/, name: 'ORM method mocking', severity: 'ERROR' },
            { regex: /sequelize.*mock/, name: 'Sequelize ORM mocking', severity: 'ERROR' },

            // External service mocking
            { regex: /axios\.get\.mockResolvedValue/, name: 'Axios HTTP client mocking', severity: 'ERROR' },
            { regex: /fetch\.mockResolvedValue/, name: 'Fetch API mocking', severity: 'ERROR' },
            { regex: /\w+Client\.\w+\.mockImplementation/, name: 'Service client mocking', severity: 'ERROR' },

            // Timer mocking  
            { regex: /jest\.useFakeTimers\s*\(/, name: 'jest.useFakeTimers()', severity: 'ERROR' },
            { regex: /jest\.useRealTimers\s*\(/, name: 'jest.useRealTimers()', severity: 'ERROR' },
            { regex: /jest\.advanceTimersByTime\s*\(/, name: 'jest.advanceTimersByTime()', severity: 'ERROR' },
            { regex: /sinon\.useFakeTimers\s*\(/, name: 'sinon.useFakeTimers()', severity: 'ERROR' },

            // Module mocking with manual implementations
            { regex: /jest\.doMock\s*\(\s*['"][^'"]+['"],\s*\(\s*\)\s*=>\s*\{/, name: 'jest.doMock with manual implementation', severity: 'ERROR' },
            { regex: /require\.cache\[[^\]]+\]\s*=\s*\{[^}]*mock/, name: 'Manual require cache manipulation', severity: 'ERROR' },

            // TypeScript mock patterns
            { regex: /as\s+jest\.MockedFunction/, name: 'TypeScript jest.MockedFunction cast', severity: 'ERROR' },
            { regex: /MockInstance</, name: 'TypeScript MockInstance type', severity: 'ERROR' },
            { regex: /Mocked</, name: 'TypeScript Mocked utility type', severity: 'ERROR' },

            // Configuration-based mocking
            { regex: /setupFilesAfterEnv.*mock/, name: 'Jest setup files with mocking', severity: 'ERROR' },
            { regex: /moduleNameMapper.*mock/, name: 'Jest moduleNameMapper with mocks', severity: 'ERROR' },

            // Advanced mocking patterns
            { regex: /jest\.replaceProperty\s*\(/, name: 'jest.replaceProperty() (newer Jest versions)', severity: 'ERROR' },
            { regex: /vi\.hoisted\s*\(/, name: 'Vitest vi.hoisted() for ESM mocking', severity: 'ERROR' },
            { regex: /vi\.importActual\s*\(/, name: 'Vitest vi.importActual() with mocking', severity: 'ERROR' },
            { regex: /jest\.requireMock\s*\(/, name: 'jest.requireMock()', severity: 'ERROR' },
            { regex: /jest\.genMockFromModule\s*\(/, name: 'jest.genMockFromModule()', severity: 'ERROR' },
            { regex: /\.mockName\s*\(/, name: '.mockName() (jest mock naming)', severity: 'ERROR' },
            { regex: /\.mockReturnThis\s*\(/, name: '.mockReturnThis()', severity: 'ERROR' },
            { regex: /\.mock\.calls/, name: '.mock.calls (checking mock calls)', severity: 'ERROR' },
            { regex: /\.mock\.results/, name: '.mock.results (checking mock results)', severity: 'ERROR' },
            { regex: /\.mock\.instances/, name: '.mock.instances (checking mock instances)', severity: 'ERROR' },

            // Sinon extended patterns
            { regex: /sinon\.useFakeTimers\s*\(/, name: 'sinon.useFakeTimers()', severity: 'ERROR' },
            { regex: /sinon\.useFakeServer\s*\(/, name: 'sinon.useFakeServer()', severity: 'ERROR' },
            { regex: /sinon\.useFakeXMLHttpRequest\s*\(/, name: 'sinon.useFakeXMLHttpRequest()', severity: 'ERROR' },
            { regex: /sinon\.match\./, name: 'sinon.match (argument matching)', severity: 'ERROR' },
            { regex: /sinon\.assert\./, name: 'sinon.assert (mock assertions)', severity: 'ERROR' },
            { regex: /\.withArgs\s*\(/, name: '.withArgs() (sinon conditional stub)', severity: 'ERROR' },
            { regex: /\.onCall\s*\(/, name: '.onCall() (sinon call-specific stub)', severity: 'ERROR' },
            { regex: /\.onFirstCall\s*\(/, name: '.onFirstCall()', severity: 'ERROR' },
            { regex: /\.onSecondCall\s*\(/, name: '.onSecondCall()', severity: 'ERROR' },
            { regex: /\.onThirdCall\s*\(/, name: '.onThirdCall()', severity: 'ERROR' },
            { regex: /\.throws\s*\(/, name: '.throws() (sinon stub throws)', severity: 'ERROR' },
            { regex: /\.callsArg\s*\(/, name: '.callsArg() (sinon callback)', severity: 'ERROR' },
            { regex: /\.callsArgWith\s*\(/, name: '.callsArgWith()', severity: 'ERROR' },
            { regex: /\.callThrough\s*\(/, name: '.callThrough() (spy original)', severity: 'ERROR' },
            { regex: /\.restore\s*\(/, name: '.restore() (restore original)', severity: 'ERROR' },

            // Vitest extended patterns
            { regex: /vi\.mocked\s*\(/, name: 'vitest mocked() helper', severity: 'ERROR' },
            { regex: /vi\.isMockFunction\s*\(/, name: 'vitest isMockFunction()', severity: 'ERROR' },
            { regex: /vi\.clearAllTimers\s*\(/, name: 'vitest clearAllTimers()', severity: 'ERROR' },
            { regex: /vi\.useFakeTimers\s*\(/, name: 'vitest useFakeTimers()', severity: 'ERROR' },
            { regex: /vi\.useRealTimers\s*\(/, name: 'vitest useRealTimers()', severity: 'ERROR' },
            { regex: /vi\.setSystemTime\s*\(/, name: 'vitest setSystemTime()', severity: 'ERROR' },
            { regex: /vi\.advanceTimersByTime\s*\(/, name: 'vitest advanceTimersByTime()', severity: 'ERROR' },

            // Enzyme & React Testing Library mocking
            { regex: /shallow\s*\(/, name: 'Enzyme shallow() (creates mocked render)', severity: 'WARNING' },
            { regex: /mount\s*\(/, name: 'Enzyme mount() (may involve mocking)', severity: 'WARNING' },
            { regex: /@testing-library\/react.*\bmock\b/i, name: 'React Testing Library with mock', severity: 'ERROR' },

            // Node.js native mocking (Node 20+)
            { regex: /mock\s*\(/, name: 'Node.js native mock()', severity: 'ERROR' },
            { regex: /test\.mock\./, name: 'Node.js test.mock', severity: 'ERROR' },

            // MSW (Mock Service Worker) - API mocking
            { regex: /import\s+.*\s+from\s+['"]msw['"]/, name: 'import msw (API mocking)', severity: 'ERROR' },
            { regex: /setupWorker\s*\(/, name: 'MSW setupWorker()', severity: 'ERROR' },
            { regex: /setupServer\s*\(/, name: 'MSW setupServer()', severity: 'ERROR' },
            { regex: /rest\.get\s*\(/, name: 'MSW rest.get() handler', severity: 'ERROR' },
            { regex: /rest\.post\s*\(/, name: 'MSW rest.post() handler', severity: 'ERROR' },
            { regex: /graphql\.query\s*\(/, name: 'MSW graphql.query() handler', severity: 'ERROR' },

            // Nock (HTTP mocking)
            { regex: /import\s+.*\s+from\s+['"]nock['"]/, name: 'import nock (HTTP mocking)', severity: 'ERROR' },
            { regex: /nock\s*\(/, name: 'nock() HTTP interceptor', severity: 'ERROR' },

            // Fetch-mock
            { regex: /import\s+.*\s+from\s+['"]fetch-mock['"]/, name: 'import fetch-mock', severity: 'ERROR' },
            { regex: /fetchMock\./, name: 'fetchMock usage', severity: 'ERROR' },

            // Jest mock modules
            { regex: /__mocks__/, name: '__mocks__ directory (Jest convention)', severity: 'ERROR' },
            { regex: /\.mocked\s*\(/, name: '.mocked() type helper', severity: 'ERROR' },

            // Global mock functions
            { regex: /global\.\w+\s*=\s*jest\.fn/, name: 'global mock assignment', severity: 'ERROR' },
            { regex: /window\.\w+\s*=\s*jest\.fn/, name: 'window mock assignment', severity: 'ERROR' },
            { regex: /Object\.defineProperty\s*\([^)]*,\s*['"]mock/, name: 'Object.defineProperty mock', severity: 'ERROR' },
        ],
        severity: 'ERROR',
        fix: {
            en: 'Remove mocking and use Dependency Injection: Pass dependencies as function parameters.',
            th: 'ลบ mock ออกและใช้ Dependency Injection: ส่ง dependencies เป็น parameter ของฟังก์ชัน'
        }
    },
// ======================================================================
// NO_HARDCODE Rule: Detects hardcoded URLs, API keys, and configuration values in code.
// ======================================================================
    NO_HARDCODE: {
        id: 'NO_HARDCODE',
        name: {
            en: 'No Hardcoded Values',
            th: 'ห้าม Hardcode ค่าใดๆ'
        },
        description: {
            en: 'DO NOT hardcode URLs, API keys, or configuration values. Use config files or function parameters.',
            th: 'ห้าม Hardcode URL, API Key หรือค่าคงที่ใดๆ ที่ควรอยู่ใน Configuration ให้ใช้ไฟล์ config หรือ parameter'
        },
        explanation: {
            en: `Hardcoded values make your code inflexible and environment-specific. When you need to change a URL or API key, you must modify the code itself. Use configuration files or environment variables for all external values.`,
            th: `ค่าที่ hardcode ไว้ทำให้โค้ดไม่ยืดหยุ่นและผูกติดกับ environment เฉพาะ เมื่อต้องเปลี่ยน URL หรือ API key ต้องแก้โค้ดเอง ให้ใช้ไฟล์ config หรือ environment variables สำหรับค่าภายนอกทั้งหมด`
        },
        patterns: [
            // HTTP/HTTPS URLs (all variants)
            {
                regex: /['"]https?:\/\/(?!www\.w3\.org|localhost|127\.0\.0\.1)[a-zA-Z0-9][^'"]*['"]/,
                name: 'HTTP/HTTPS URL',
                severity: 'ERROR'
            },
            {
                regex: /['"]wss?:\/\/[^'"]+['"]/,
                name: 'WebSocket URL (ws/wss)',
                severity: 'ERROR'
            },
            {
                regex: /['"]ftp:\/\/[^'"]+['"]/,
                name: 'FTP URL',
                severity: 'ERROR'
            },

            // API Keys and Secrets (comprehensive patterns)
            {
                regex: /['"](?:api[_-]?key|apikey|api_secret|secret[_-]?key|access[_-]?token|bearer[_-]?token)['"]:\s*['"][^'"]+['"]/i,
                name: 'API Key/Secret/Token in object',
                severity: 'ERROR'
            },
            {
                regex: /sk_live_[a-zA-Z0-9]{24}/,
                name: 'Stripe Live Secret Key',
                severity: 'ERROR'
            },
            {
                regex: /pk_live_[a-zA-Z0-9]{24}/,
                name: 'Stripe Live Publishable Key',
                severity: 'ERROR'
            },
            {
                regex: /sk_test_[a-zA-Z0-9]{24}/,
                name: 'Stripe Test Secret Key',
                severity: 'WARNING'
            },
            {
                regex: /pk_test_[a-zA-Z0-9]{24}/,
                name: 'Stripe Test Publishable Key',
                severity: 'WARNING'
            },
            {
                regex: /xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]+/,
                name: 'Slack Bot Token',
                severity: 'ERROR'
            },
            {
                regex: /xoxp-[0-9]+-[0-9]+-[0-9]+-[a-zA-Z0-9]+/,
                name: 'Slack User Token',
                severity: 'ERROR'
            },
            {
                regex: /AIza[0-9A-Za-z\-_]{35}/,
                name: 'Google API Key',
                severity: 'ERROR'
            },
            {
                regex: /AKIA[0-9A-Z]{16}/,
                name: 'AWS Access Key ID',
                severity: 'ERROR'
            },
            {
                regex: /[0-9a-zA-Z\/+]{40}/,
                name: 'AWS Secret Access Key pattern',
                severity: 'WARNING'
            },
            {
                regex: /github_pat_[a-zA-Z0-9_]{82}/,
                name: 'GitHub Personal Access Token',
                severity: 'ERROR'
            },
            {
                regex: /ghp_[a-zA-Z0-9]{36}/,
                name: 'GitHub Personal Access Token (Classic)',
                severity: 'ERROR'
            },
            {
                regex: /ghs_[a-zA-Z0-9]{36}/,
                name: 'GitHub Server Token',
                severity: 'ERROR'
            },
            {
                regex: /gho_[a-zA-Z0-9]{36}/,
                name: 'GitHub OAuth Token',
                severity: 'ERROR'
            },
            {
                regex: /ghu_[a-zA-Z0-9]{36}/,
                name: 'GitHub User Token',
                severity: 'ERROR'
            },
            {
                regex: /glpat-[a-zA-Z0-9\-_]{20}/,
                name: 'GitLab Personal Access Token',
                severity: 'ERROR'
            },
            {
                regex: /ya29\.[0-9A-Za-z\-_]+/,
                name: 'Google OAuth Access Token',
                severity: 'ERROR'
            },
            {
                regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
                name: 'UUID/GUID (potential secret)',
                severity: 'WARNING'
            },
            {
                regex: /Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/,
                name: 'Bearer Token in Authorization header',
                severity: 'ERROR'
            },
            {
                regex: /Basic\s+[A-Za-z0-9+\/]+=*/,
                name: 'Basic Auth credentials',
                severity: 'ERROR'
            },
            {
                regex: /(?:password|pwd|pass)['"]?\s*[:=]\s*['"][^'"]{8,}['"]/i,
                name: 'Password assignment',
                severity: 'ERROR'
            },
            {
                regex: /(?:token|key|secret|credential)['"]?\s*[:=]\s*['"][a-zA-Z0-9]{16,}['"]/i,
                name: 'Long secret/token assignment',
                severity: 'ERROR'
            },

            // Database Connection Strings
            {
                regex: /['"](?:mongodb|mysql|postgresql|postgres):\/\/[^'"]*['"]/i,
                name: 'Database connection string',
                severity: 'ERROR'
            },
            {
                regex: /['"](?:Server|Data Source|Initial Catalog|User ID|Password)=[^;'"]*['"]/i,
                name: 'SQL Server connection string parameter',
                severity: 'ERROR'
            },
            {
                regex: /['"]Host=[^;'"]*;Port=[^;'"]*['"]/i,
                name: 'Database host/port configuration',
                severity: 'ERROR'
            },

            // Server/Host URLs and IPs
            {
                regex: /['"](?:https?:\/\/)?[a-zA-Z0-9-]+\.(?:com|net|org|io|co|dev|local|internal)[^'"]*['"]/i,
                name: 'Domain name/hostname',
                severity: 'ERROR'
            },
            {
                regex: /['"](?:https?:\/\/)?(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::[0-9]+)?[^'"]*['"]/,
                name: 'IP address with optional port',
                severity: 'ERROR'
            },

            // Environment-specific hardcoded values
            {
                regex: /['"](?:development|production|staging|test|dev|prod|stage)['"](?:\s*[=:]\s*true|\s*===\s*['"](?:development|production|staging|test|dev|prod|stage)['"])/i,
                name: 'Environment comparison hardcoded',
                severity: 'ERROR'
            },
            {
                regex: /process\.env\.NODE_ENV\s*===\s*['"](?:development|production|staging|test)['"]/,
                name: 'NODE_ENV hardcoded comparison',
                severity: 'WARNING'
            },

            // File paths (absolute paths, especially on Windows/Unix)
            {
                regex: /['"][C-Z]:\\[^'"]*['"]/,
                name: 'Windows absolute file path',
                severity: 'ERROR'
            },
            {
                regex: /['"]\/(?:usr|home|opt|var|tmp)\/[^'"]*['"]/,
                name: 'Unix/Linux absolute file path',
                severity: 'ERROR'
            },
            {
                regex: /['"]~\/[^'"]+['"]/,
                name: 'Home directory path',
                severity: 'WARNING'
            },

            // Version numbers and build numbers
            {
                regex: /(?:version|build|release)['"]?\s*[:=]\s*['"][0-9]+\.[0-9]+\.[0-9]+['"]/i,
                name: 'Version number hardcoded',
                severity: 'WARNING'
            },
            {
                regex: /['"]v[0-9]+\.[0-9]+\.[0-9]+['"]/,
                name: 'Version string pattern',
                severity: 'WARNING'
            },

            // Magic numbers (common problematic values)
            {
                regex: /(?<![0-9.])\b(?:8080|3000|5000|8000|9000|3306|5432|6379|27017|443|80|22|21|25)\b(?![0-9.])/,
                name: 'Common port number (should be configurable)',
                severity: 'WARNING'
            },
            {
                regex: /(?<![0-9.])\b(?:300|600|900|1800|3600|86400|604800|2592000)\b(?![0-9.])/,
                name: 'Time duration in seconds (use constants)',
                severity: 'WARNING'
            },

            // Cache expiration times
            {
                regex: /(?:expires?|ttl|timeout|cache)['"]?\s*[:=]\s*(?:[0-9]{4,}|'[0-9]{4,}'|"[0-9]{4,}")/i,
                name: 'Cache/timeout duration hardcoded',
                severity: 'WARNING'
            },

            // Email addresses
            {
                regex: /['"][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}['"]/,
                name: 'Email address hardcoded',
                severity: 'ERROR'
            },

            // Phone numbers
            {
                regex: /['"](?:\+?[1-9]\d{1,14}|(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4})['"]/,
                name: 'Phone number hardcoded',
                severity: 'ERROR'
            },

            // Credit card test numbers (common test patterns)
            {
                regex: /['"](?:4111111111111111|4000000000000002|5555555555554444|2223003122003222|378282246310005)['"]/,
                name: 'Test credit card number (should use test data config)',
                severity: 'WARNING'
            },

            // Company/organization specific identifiers
            {
                regex: /['"](?:admin|administrator|root|superuser|sa|sysadmin)['"]/i,
                name: 'Admin/root username hardcoded',
                severity: 'ERROR'
            },

            // Encryption/Hash related hardcoded values
            {
                regex: /['"][a-fA-F0-9]{32}['"]/,
                name: 'MD5 hash or 32-char hex string',
                severity: 'WARNING'
            },
            {
                regex: /['"][a-fA-F0-9]{40}['"]/,
                name: 'SHA1 hash or 40-char hex string',
                severity: 'WARNING'
            },
            {
                regex: /['"][a-fA-F0-9]{64}['"]/,
                name: 'SHA256 hash or 64-char hex string',
                severity: 'WARNING'
            },

            // JWT tokens
            {
                regex: /['"]eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*['"]/,
                name: 'JWT token pattern',
                severity: 'ERROR'
            },

            // OAuth client secrets and IDs
            {
                regex: /(?:client_secret|client_id|oauth_token)['"]?\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
                name: 'OAuth client credentials',
                severity: 'ERROR'
            },

            // Webhook URLs
            {
                regex: /['"]https?:\/\/hooks?\.slack\.com\/[^'"]*['"]/i,
                name: 'Slack webhook URL',
                severity: 'ERROR'
            },
            {
                regex: /['"]https?:\/\/discord(?:app)?\.com\/api\/webhooks\/[^'"]*['"]/i,
                name: 'Discord webhook URL',
                severity: 'ERROR'
            },

            // Cloud service keys and identifiers
            {
                regex: /['"]projects\/[a-zA-Z0-9-]+\/serviceAccounts\/[^'"]*['"]/i,
                name: 'Google Cloud service account path',
                severity: 'ERROR'
            },
            {
                regex: /['"]arn:aws:[^'"]*['"]/i,
                name: 'AWS ARN (Amazon Resource Name)',
                severity: 'ERROR'
            },
            {
                regex: /['"][a-zA-Z0-9+\/]{87}=['"]/,
                name: 'Base64 encoded key (88 chars with padding)',
                severity: 'WARNING'
            },

            // Hardcoded salts and initialization vectors
            {
                regex: /(?:salt|iv|nonce)['"]?\s*[:=]\s*['"][a-zA-Z0-9+\/]{8,}['"]/i,
                name: 'Cryptographic salt/IV/nonce hardcoded',
                severity: 'ERROR'
            },

            // License keys
            {
                regex: /(?:license|serial|activation)['"]?\s*[:=]\s*['"][A-Z0-9-]{20,}['"]/i,
                name: 'License/serial key pattern',
                severity: 'ERROR'
            },

            // Payment processor keys
            {
                regex: /(?:merchant|paypal|square)['"]?\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/i,
                name: 'Payment processor credential',
                severity: 'ERROR'
            },

            // Third-party service API endpoints
            {
                regex: /['"]https?:\/\/api\.[a-zA-Z0-9-]+\.com[^'"]*['"]/i,
                name: 'Third-party API endpoint',
                severity: 'WARNING'
            },

            // Hardcoded user IDs or account IDs
            {
                regex: /(?:user_id|account_id|customer_id)['"]?\s*[:=]\s*['"][a-zA-Z0-9_-]{8,}['"]/i,
                name: 'User/Account ID hardcoded',
                severity: 'WARNING'
            },

            // Social media app credentials
            {
                regex: /(?:twitter|facebook|instagram|linkedin)['"]?\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/i,
                name: 'Social media API credential',
                severity: 'ERROR'
            },

            // Hardcoded session secrets
            {
                regex: /(?:session_secret|cookie_secret)['"]?\s*[:=]\s*['"][a-zA-Z0-9+\/]{16,}['"]/i,
                name: 'Session/cookie secret hardcoded',
                severity: 'ERROR'
            },

            // Container registry credentials
            {
                regex: /['"](?:docker|registry)\.(?:io|com|org)\/[^'"]*['"]/i,
                name: 'Container registry URL',
                severity: 'WARNING'
            },

            // Hardcoded CORS origins
            {
                regex: /(?:cors|origin)['"]?\s*[:=]\s*(?:\[['"][^'"]*['"](?:,\s*['"][^'"]*['"])*\]|['"]https?:\/\/[^'"]*['"])/i,
                name: 'CORS origin hardcoded',
                severity: 'WARNING'
            },

            // Telegram bot tokens
            {
                regex: /[0-9]{8,10}:[a-zA-Z0-9_-]{35}/,
                name: 'Telegram bot token',
                severity: 'ERROR'
            },

            // Firebase config
            {
                regex: /(?:apiKey|authDomain|projectId|storageBucket|messagingSenderId|appId)['"]?\s*[:=]\s*['"][^'"]+['"]/i,
                name: 'Firebase configuration value',
                severity: 'WARNING'
            },

            // Hardcoded feature flags
            {
                regex: /(?:feature_flag|flag)['"]?\s*[:=]\s*(?:true|false|['"](?:enabled|disabled)['"])/i,
                name: 'Feature flag hardcoded',
                severity: 'WARNING'
            },

            // CDN and asset URLs
            {
                regex: /['"]https?:\/\/[a-zA-Z0-9-]+\.cloudfront\.net[^'"]*['"]/i,
                name: 'CloudFront CDN URL',
                severity: 'WARNING'
            },
            {
                regex: /['"]https?:\/\/[a-zA-Z0-9-]+\.s3\.amazonaws\.com[^'"]*['"]/i,
                name: 'S3 bucket URL',
                severity: 'WARNING'
            },

            // Analytics and tracking IDs
            {
                regex: /['"](?:GA|G)-[A-Z0-9-]{10,}['"]/,
                name: 'Google Analytics tracking ID',
                severity: 'WARNING'
            },
            {
                regex: /['"]UA-[0-9]+-[0-9]+['"]/,
                name: 'Google Analytics Universal ID',
                severity: 'WARNING'
            },

            // Common test/placeholder values that should be configurable
            {
                regex: /['"](?:example\.com|test\.com|localhost|127\.0\.0\.1)['"]/i,
                name: 'Test/example domain hardcoded',
                severity: 'WARNING'
            },
            {
                regex: /['"](?:John Doe|Jane Smith|Test User|Admin User)['"]/i,
                name: 'Test user name hardcoded',
                severity: 'WARNING'
            },

            // Hardcoded retry counts and limits
            {
                regex: /(?:max_retries?|retry_count|attempt_limit)['"]?\s*[:=]\s*[0-9]+/i,
                name: 'Retry count/limit hardcoded',
                severity: 'WARNING'
            },

            // Queue names and topic names
            {
                regex: /(?:queue|topic)['"]?\s*[:=]\s*['"][a-zA-Z0-9_-]+['"]/i,
                name: 'Queue/topic name hardcoded',
                severity: 'WARNING'
            },

            // Hardcoded rate limits
            {
                regex: /(?:rate_limit|requests_per_second|rpm|rps)['"]?\s*[:=]\s*[0-9]+/i,
                name: 'Rate limit hardcoded',
                severity: 'WARNING'
            },

            // Additional hardcoded API keys and constants
            {
                regex: /const\s+(?:API_KEY|APIKEY|SECRET_KEY|ACCESS_TOKEN|BEARER_TOKEN)\s*=\s*['"][^'"]+['"]/i,
                name: 'Hardcoded API Key constant',
                severity: 'ERROR'
            },
            {
                regex: /Authorization:\s*['"]Bearer\s+[a-zA-Z0-9\-_.]+['"]/i,
                name: 'Hardcoded Bearer token',
                severity: 'ERROR'
            },
            {
                regex: /Authorization:\s*['"]Basic\s+[a-zA-Z0-9+/=]+['"]/i,
                name: 'Hardcoded Basic auth',
                severity: 'ERROR'
            },
            {
                regex: /password:\s*['"][^'"]+['"]/i,
                name: 'Hardcoded password',
                severity: 'ERROR'
            },
            {
                regex: /private[_-]?key:\s*['"][^'"]+['"]/i,
                name: 'Hardcoded private key',
                severity: 'ERROR'
            },

            // Database Connection Strings (all major databases)
            {
                regex: /['"]mongodb(\+srv)?:\/\/[^'"]+['"]/,
                name: 'MongoDB connection string',
                severity: 'ERROR'
            },
            {
                regex: /['"]mysql:\/\/[^'"]+['"]/,
                name: 'MySQL connection string',
                severity: 'ERROR'
            },
            {
                regex: /['"]postgresql:\/\/[^'"]+['"]/,
                name: 'PostgreSQL connection string',
                severity: 'ERROR'
            },
            {
                regex: /['"]redis:\/\/[^'"]+['"]/,
                name: 'Redis connection string',
                severity: 'ERROR'
            },
            {
                regex: /['"]sqlite:\/\/[^'"]+['"]/,
                name: 'SQLite connection string',
                severity: 'ERROR'
            },
            {
                regex: /['"]oracle:\/\/[^'"]+['"]/,
                name: 'Oracle connection string',
                severity: 'ERROR'
            },
            {
                regex: /['"]mssql:\/\/[^'"]+['"]/,
                name: 'MSSQL connection string',
                severity: 'ERROR'
            },

            // Cloud Service URLs and Credentials
            {
                regex: /['"].*\.amazonaws\.com[^'"]*['"]/,
                name: 'AWS endpoint URL',
                severity: 'ERROR'
            },
            {
                regex: /['"].*\.azure\.com[^'"]*['"]/,
                name: 'Azure endpoint URL',
                severity: 'ERROR'
            },
            {
                regex: /['"].*\.googleapis\.com[^'"]*['"]/,
                name: 'Google Cloud endpoint URL',
                severity: 'ERROR'
            },

            // AWS Credentials
            {
                regex: /['"]AKIA[0-9A-Z]{16}['"]/,
                name: 'AWS Access Key ID',
                severity: 'ERROR'
            },
            {
                regex: /aws_secret_access_key\s*=\s*['"][^'"]+['"]/i,
                name: 'AWS Secret Access Key',
                severity: 'ERROR'
            },

            // IP Addresses (excluding localhost/development)
            {
                regex: /['"](?:(?!127\.0\.0\.1|0\.0\.0\.0|localhost)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))['"]/,
                name: 'Hardcoded IP Address (production)',
                severity: 'ERROR'
            },
            {
                regex: /['"](?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}['"]/,
                name: 'Hardcoded IPv6 Address',
                severity: 'ERROR'
            },

            // Port Numbers (non-standard development ports)
            {
                regex: /port\s*[:=]\s*(?:3001|4000|5000|8080|8443|9000|9443)(?![0-9])/i,
                name: 'Hardcoded production port number',
                severity: 'WARNING'
            },

            // Environment-specific hardcoded values
            {
                regex: /['"](?:production|prod|staging|stage|development|dev|test)['"]\s*[=:]/i,
                name: 'Hardcoded environment name',
                severity: 'ERROR'
            },
            {
                regex: /NODE_ENV\s*[=:]\s*['"](?:production|staging|development)['"]/i,
                name: 'Hardcoded NODE_ENV value',
                severity: 'ERROR'
            },

            // File paths and directories (system-specific)
            {
                regex: /['"]\/home\/[^'"]+['"]/,
                name: 'Hardcoded Linux home directory path',
                severity: 'ERROR'
            },
            {
                regex: /['"]C:\\[^'"]+['"]/,
                name: 'Hardcoded Windows path',
                severity: 'ERROR'
            },
            {
                regex: /['"]\/var\/[^'"]+['"]/,
                name: 'Hardcoded Unix system path',
                severity: 'ERROR'
            },
            {
                regex: /['"]\/tmp\/[^'"]+['"]/,
                name: 'Hardcoded temporary directory path',
                severity: 'WARNING'
            },

            // Configuration values that should be externalized
            {
                regex: /timeout\s*[:=]\s*(?:[5-9][0-9]{3,}|[1-9][0-9]{4,})/i,
                name: 'Hardcoded timeout value (large)',
                severity: 'WARNING'
            },
            {
                regex: /maxConnections?\s*[:=]\s*[0-9]+/i,
                name: 'Hardcoded max connections',
                severity: 'WARNING'
            },
            {
                regex: /buffer[Ss]ize\s*[:=]\s*[0-9]+/i,
                name: 'Hardcoded buffer size',
                severity: 'WARNING'
            },
            {
                regex: /max[A-Z]\w*\s*[:=]\s*[0-9]+/i,
                name: 'Hardcoded max limit configuration',
                severity: 'WARNING'
            },

            // Third-party service credentials and configurations
            {
                regex: /['"]pk_live_[a-zA-Z0-9]+['"]/,
                name: 'Stripe live public key',
                severity: 'ERROR'
            },
            {
                regex: /['"]sk_live_[a-zA-Z0-9]+['"]/,
                name: 'Stripe live secret key',
                severity: 'ERROR'
            },
            {
                regex: /['"]pk_test_[a-zA-Z0-9]+['"]/,
                name: 'Stripe test key (should be in config)',
                severity: 'WARNING'
            },
            {
                regex: /['"]sk_test_[a-zA-Z0-9]+['"]/,
                name: 'Stripe test secret (should be in config)',
                severity: 'WARNING'
            },
            {
                regex: /client_id\s*[:=]\s*['"][^'"]+['"]/i,
                name: 'OAuth client ID',
                severity: 'ERROR'
            },
            {
                regex: /client_secret\s*[:=]\s*['"][^'"]+['"]/i,
                name: 'OAuth client secret',
                severity: 'ERROR'
            },

            // JWT and encryption secrets
            {
                regex: /jwt[_-]?secret\s*[:=]\s*['"][^'"]+['"]/i,
                name: 'JWT secret key',
                severity: 'ERROR'
            },
            {
                regex: /encryption[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
                name: 'Encryption key',
                severity: 'ERROR'
            },
            {
                regex: /salt\s*[:=]\s*['"][^'"]{8,}['"]/i,
                name: 'Hardcoded cryptographic salt',
                severity: 'ERROR'
            },

            // Domain names and hostnames
            {
                regex: /['"][a-zA-Z0-9][\w-]*\.(?:com|net|org|io|co|app|dev)(?:\/[^'"]*)?['"]/,
                name: 'Hardcoded domain name',
                severity: 'WARNING'
            },
            {
                regex: /host\s*[:=]\s*['"][^'"]+['"]/i,
                name: 'Hardcoded hostname',
                severity: 'ERROR'
            },

            // Magic numbers (business logic constants)
            {
                regex: /\b(?:86400|3600|604800|31536000|2592000)\b/,
                name: 'Magic number (time constants should be named)',
                severity: 'WARNING'
            },
            {
                regex: /\b(?:1024|2048|4096|8192)\b/,
                name: 'Magic number (buffer/memory sizes should be configurable)',
                severity: 'WARNING'
            },

            // Email addresses and contact information
            {
                regex: /['"][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}['"]/,
                name: 'Hardcoded email address',
                severity: 'WARNING'
            },
            {
                regex: /['"][\+]?[\d\s\-\(\)]{10,}['"]/,
                name: 'Hardcoded phone number',
                severity: 'WARNING'
            },

            // File Paths (absolute paths that may be environment-specific)
            {
                regex: /['"]\/(?:home|usr|opt|var)\/[^'"]+['"]/,
                name: 'Hardcoded absolute file path (Linux)',
                severity: 'ERROR'
            },
            {
                regex: /['"][C-Z]:\\[^'"]+['"]/,
                name: 'Hardcoded absolute file path (Windows)',
                severity: 'ERROR'
            },

            // Email/SMTP Configuration
            {
                regex: /smtp\.[^'"]*\.[^'"]+/i,
                name: 'Hardcoded SMTP server',
                severity: 'ERROR'
            },
            {
                regex: /email.*@[^'"]+\.[^'"]+/i,
                name: 'Hardcoded email address',
                severity: 'WARNING'
            },

            // API Version Numbers in URLs
            {
                regex: /['"][^'"]*\/api\/v\d+\/[^'"]*['"]/,
                name: 'Hardcoded API version in URL',
                severity: 'WARNING'
            },
            {
                regex: /['"]sk-[a-zA-Z0-9]{32,}['"]/,
                name: 'OpenAI API key format (sk-...)',
                severity: 'ERROR'
            },
            {
                regex: /['"]pk-[a-zA-Z0-9]{32,}['"]/,
                name: 'Public key format (pk-...)',
                severity: 'WARNING'
            },

            // Email/SMTP credentials
            {
                regex: /smtp_password:\s*['"][^'"]+['"]/i,
                name: 'SMTP password',
                severity: 'ERROR'
            },
            {
                regex: /email_password:\s*['"][^'"]+['"]/i,
                name: 'Email password',
                severity: 'ERROR'
            },

            // IP Addresses and Ports (non-localhost)
            {
                regex: /['"](?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):\d+['"]/,
                name: 'Hardcoded IP:Port',
                severity: 'WARNING'
            },

            // Webhook URLs
            {
                regex: /['"]https?:\/\/hooks?\.[^'"]+['"]/,
                name: 'Webhook URL',
                severity: 'ERROR'
            },

            // JWT Tokens
            {
                regex: /['"]eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*['"]/,
                name: 'JWT Token',
                severity: 'ERROR'
            },

            // ADDITIONAL HARDCODE PATTERNS - EXTENDED COVERAGE

            // More API Key patterns
            {
                regex: /['"]xoxb-[a-zA-Z0-9-]+['"]/,
                name: 'Slack Bot Token (xoxb-)',
                severity: 'ERROR'
            },
            {
                regex: /['"]xoxp-[a-zA-Z0-9-]+['"]/,
                name: 'Slack User Token (xoxp-)',
                severity: 'ERROR'
            },
            {
                regex: /['"]ghp_[a-zA-Z0-9]{36}['"]/,
                name: 'GitHub Personal Access Token',
                severity: 'ERROR'
            },
            {
                regex: /['"]gho_[a-zA-Z0-9]{36}['"]/,
                name: 'GitHub OAuth Token',
                severity: 'ERROR'
            },
            {
                regex: /['"]glpat-[a-zA-Z0-9_-]{20}['"]/,
                name: 'GitLab Personal Access Token',
                severity: 'ERROR'
            },
            {
                regex: /['"]NRAK-[A-Z0-9]{27}['"]/,
                name: 'New Relic API Key',
                severity: 'ERROR'
            },
            {
                regex: /['"]SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}['"]/,
                name: 'SendGrid API Key',
                severity: 'ERROR'
            },
            {
                regex: /['"]key-[a-zA-Z0-9]{32}['"]/,
                name: 'Mailgun API Key',
                severity: 'ERROR'
            },
            {
                regex: /['"]SK[a-zA-Z0-9]{32}['"]/,
                name: 'Twilio API Key',
                severity: 'ERROR'
            },
            {
                regex: /['"]AC[a-f0-9]{32}['"]/,
                name: 'Twilio Account SID',
                severity: 'ERROR'
            },
            {
                regex: /['"]sq0atp-[a-zA-Z0-9_-]{22}['"]/,
                name: 'Square Access Token',
                severity: 'ERROR'
            },
            {
                regex: /['"]sq0csp-[a-zA-Z0-9_-]{43}['"]/,
                name: 'Square OAuth Secret',
                severity: 'ERROR'
            },
            {
                regex: /['"]AIza[a-zA-Z0-9_-]{35}['"]/,
                name: 'Google Cloud API Key',
                severity: 'ERROR'
            },
            {
                regex: /['"]ya29\.[a-zA-Z0-9_-]+['"]/,
                name: 'Google OAuth Access Token',
                severity: 'ERROR'
            },
            {
                regex: /['"]EAA[a-zA-Z0-9]+['"]/,
                name: 'Facebook Access Token',
                severity: 'ERROR'
            },
            {
                regex: /['"]1\/[a-zA-Z0-9_-]{43}['"]/,
                name: 'Google OAuth Refresh Token',
                severity: 'ERROR'
            },

            // Database credentials patterns
            {
                regex: /user:\s*['"][^'"]+['"]\s*,\s*password:\s*['"][^'"]+['"]/i,
                name: 'DB user:password pair',
                severity: 'ERROR'
            },
            {
                regex: /username:\s*['"][^'"]+['"]\s*,\s*password:\s*['"][^'"]+['"]/i,
                name: 'Username:password pair',
                severity: 'ERROR'
            },
            {
                regex: /DB_PASSWORD\s*=\s*['"][^'"]+['"]/,
                name: 'DB_PASSWORD constant',
                severity: 'ERROR'
            },
            {
                regex: /DATABASE_URL\s*=\s*['"][^'"]+['"]/,
                name: 'DATABASE_URL constant',
                severity: 'ERROR'
            },

            // SSH/Private Keys
            {
                regex: /-----BEGIN (?:RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----/,
                name: 'Private Key (PEM format)',
                severity: 'ERROR'
            },
            {
                regex: /ssh-rsa\s+[A-Za-z0-9+/=]{200,}/,
                name: 'SSH Public Key',
                severity: 'WARNING'
            },
            {
                regex: /ssh-ed25519\s+[A-Za-z0-9+/=]+/,
                name: 'SSH ED25519 Key',
                severity: 'WARNING'
            },

            // Cryptocurrency private keys/seeds
            {
                regex: /['"][13][a-km-zA-HJ-NP-Z1-9]{25,34}['"]/,
                name: 'Bitcoin Address (possible private key)',
                severity: 'WARNING'
            },
            {
                regex: /['"]0x[a-fA-F0-9]{40}['"]/,
                name: 'Ethereum Address (possible private key)',
                severity: 'WARNING'
            },
            {
                regex: /\b(?:seed|mnemonic)\s*(?:phrase|words)?\s*:\s*['"][^'"]{50,}['"]/i,
                name: 'Cryptocurrency seed phrase',
                severity: 'ERROR'
            },

            // OAuth & Session Secrets
            {
                regex: /client_secret:\s*['"][^'"]+['"]/i,
                name: 'OAuth client_secret',
                severity: 'ERROR'
            },
            {
                regex: /refresh_token:\s*['"][^'"]+['"]/i,
                name: 'OAuth refresh_token',
                severity: 'ERROR'
            },
            {
                regex: /session_secret:\s*['"][^'"]+['"]/i,
                name: 'Session secret',
                severity: 'ERROR'
            },
            {
                regex: /cookie_secret:\s*['"][^'"]+['"]/i,
                name: 'Cookie secret',
                severity: 'ERROR'
            },
            {
                regex: /encryption_key:\s*['"][^'"]+['"]/i,
                name: 'Encryption key',
                severity: 'ERROR'
            },

            // Cloud Platform Specific
            {
                regex: /['"]ASIA[a-zA-Z0-9]{16}['"]/,
                name: 'AWS Access Key (Asia region)',
                severity: 'ERROR'
            },
            {
                regex: /['"]projects\/[^'"]+\/keys\/[^'"]+['"]/,
                name: 'Google Cloud service account key path',
                severity: 'ERROR'
            },
            {
                regex: /['"]service_account\.json['"]/,
                name: 'GCP service account filename',
                severity: 'WARNING'
            },
            {
                regex: /DefaultAzureCredential|ClientSecretCredential/,
                name: 'Azure credential hardcode pattern',
                severity: 'WARNING'
            },

            // Connection strings with embedded credentials
            {
                regex: /['"](?:Server|Host)=[^;'"]+(User ID|UID)=[^;']+(Password|PWD)=[^;'"]+['"]/i,
                name: 'SQL Server connection string with embedded credentials',
                severity: 'ERROR'
            },
            {
                regex: /['"]Data Source=[^;]+(User Id|UserId)=[^;]+(Password|Pwd)=[^;]+['"]/i,
                name: '.NET connection string with credentials',
                severity: 'ERROR'
            },

            // Docker & Kubernetes secrets
            {
                regex: /REGISTRY_AUTH\s*=\s*['"][^'"]+['"]/,
                name: 'Docker registry auth',
                severity: 'ERROR'
            },
            {
                regex: /KUBE_TOKEN\s*=\s*['"][^'"]+['"]/,
                name: 'Kubernetes token',
                severity: 'ERROR'
            },

            // Payment Gateway Keys
            {
                regex: /['"]sk_live_[a-zA-Z0-9]{24,}['"]/,
                name: 'Stripe Live Secret Key',
                severity: 'ERROR'
            },
            {
                regex: /['"]sk_test_[a-zA-Z0-9]{24,}['"]/,
                name: 'Stripe Test Secret Key',
                severity: 'ERROR'
            },
            {
                regex: /['"]pk_live_[a-zA-Z0-9]{24,}['"]/,
                name: 'Stripe Live Publishable Key',
                severity: 'WARNING'
            },
            {
                regex: /['"]rk_live_[a-zA-Z0-9]{24,}['"]/,
                name: 'Stripe Restricted Key',
                severity: 'ERROR'
            },

            // Generic secret patterns
            {
                regex: /(?:secret|token|key|password|pwd|pass|auth)['"]?\s*[:=]\s*['"][^'"\s]{12,}['"]/i,
                name: 'Generic secret pattern (secret/token/key = "value")',
                severity: 'WARNING'
            },
            {
                regex: /X-API-KEY:\s*['"][^'"]+['"]/i,
                name: 'X-API-KEY header value',
                severity: 'ERROR'
            },
            {
                regex: /X-Auth-Token:\s*['"][^'"]+['"]/i,
                name: 'X-Auth-Token header value',
                severity: 'ERROR'
            },
        ],
        severity: 'ERROR',
        exceptions: [
            /http:\/\/www\.w3\.org/,
            /localhost|127\.0\.0\.1/,
            /test|spec|fixture|mock/i,
            /example\.com|example\.org/,
            /YOUR_API_KEY|REPLACE_ME|TODO|CHANGEME|dummy/i,
        ],
        violationExamples: {
            en: [
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern HTTP/HTTPS URL hardcoded
                 */
                const API_URL = "https://api.production.com/v1";`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Stripe Live Secret Key
                 */
                const apiKey = "sk_live_12345abcdef";`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Hardcoded password
                 */
                const dbPassword = "mySecretPassword123";`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Slack webhook URL
                 */
                axios.post("https://hooks.slack.com/services/T00/B00/XXX");`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Numeric constants without context
                 */
                const timeout = 30000;`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern JWT Secret Key
                 */
                const JWT_SECRET = "my-super-secret-key";`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern MySQL/MariaDB connection string
                 */
                mysqli_connect("prod.db.server.com", "admin", "password123");`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Stripe Publishable Key
                 */
                const STRIPE_KEY = "pk_live_AbCdEf123456";`
            ],
            th: [
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern HTTP/HTTPS URL hardcoded
                 * @description hardcode URL production
                 */
                const API_URL = "https://api.production.com/v1";`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Stripe Live Secret Key
                 * @description hardcode API key
                 */
                const apiKey = "sk_live_12345abcdef";`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Hardcoded password
                 * @description hardcode รหัสผ่าน database
                 */
                const dbPassword = "mySecretPassword123";`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Slack webhook URL
                 * @description hardcode webhook
                 */
                axios.post("https://hooks.slack.com/services/T00/B00/XXX");`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Numeric constants without context
                 * @description hardcode timeout 30 วินาที
                 */
                const timeout = 30000;`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern JWT Secret Key
                 * @description hardcode JWT secret
                 */
                const JWT_SECRET = "my-super-secret-key";`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern MySQL/MariaDB connection string
                 * @description hardcode DB connection
                 */
                mysqli_connect("prod.db.server.com", "admin", "password123");`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type violation
                 * @matches-pattern Stripe Publishable Key
                 * @description hardcode Stripe key
                 */
                const STRIPE_KEY = "pk_live_AbCdEf123456";`
            ]
        },
        correctExamples: {
            en: [
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type correct
                 */
                const API_URL = process.env.API_URL || config.api.baseUrl;`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type correct
                 */
                const apiKey = process.env.STRIPE_SECRET_KEY;`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type correct
                 */
                const dbPassword = process.env.DB_PASSWORD;`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type correct
                 */
                axios.post(config.webhooks.slack);`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type correct
                 */
                const timeout = config.network.requestTimeout;`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type correct
                 */
                const JWT_SECRET = process.env.JWT_SECRET;`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type correct
                 */
                mysqli_connect(config.db.host, config.db.user, config.db.password);`,
                
                `/**
                 * @example-for-rule NO_HARDCODE
                 * @type correct
                 */
                const STRIPE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;`
            ],
            th: [
                'const API_URL = process.env.API_URL || config.api.baseUrl; // จาก config',
                'const apiKey = process.env.STRIPE_SECRET_KEY; // จาก environment variable',
                'const dbPassword = process.env.DB_PASSWORD; // จาก environment',
                'axios.post(config.webhooks.slack); // จากไฟล์ config',
                'const timeout = config.network.requestTimeout; // จาก config',
                'const JWT_SECRET = process.env.JWT_SECRET; // จาก environment',
                'mysqli_connect(config.db.host, config.db.user, config.db.password); // จาก config',
                'const STRIPE_KEY = process.env.STRIPE_PUBLISHABLE_KEY; // จาก environment'
            ]
        },
        fix: {
            en: 'Move to config file or environment variable: process.env.API_URL or import from config.js',
            th: 'ย้ายไปไฟล์ config หรือ environment variable: process.env.API_URL หรือ import จาก config.js'
        }
    },
// ====================================================================== 
// NO_SILENT_FALLBACKS Rule: Detects silent fallbacks in error handling and default values.
// ====================================================================== 
    NO_SILENT_FALLBACKS: {
        id: 'NO_SILENT_FALLBACKS',
        name: {
            en: 'No Silent Fallbacks',
            th: 'ห้ามใช้ Fallback ที่ซ่อนปัญหา'
        },
        description: {
            en: 'DO NOT return default values in catch blocks without logging. Always throw or log errors.',
            th: 'ห้าม return ค่า default ใน catch โดยไม่จัดการ Error ให้ throw error ต่อไปหรือ log เสมอ'
        },
        explanation: {
            en: `Silent failures are the MOST DANGEROUS anti-pattern in production code. They hide critical bugs, make debugging impossible, and cause cascading failures that are impossible to trace.

WHY IT'S CRITICAL:
1) INVISIBLE BUGS: When errors are swallowed, you never know something went wrong until data is corrupted
2) DEBUGGING NIGHTMARE: No stack trace, no error message = impossible to find root cause
3) CASCADE FAILURES: Silent errors propagate through system, causing failures in unrelated components
4) DATA CORRUPTION: Returning default values on error may write corrupt data to database
5) SECURITY RISKS: Errors may indicate attacks or intrusions - must be logged for audit
6) PRODUCTION BLINDNESS: Can't monitor system health if errors aren't reported
7) FALSE METRICS: Success metrics are inflated because failures are hidden
8) COMPLIANCE VIOLATION: Many regulations require error logging for audit trails

WHAT THIS CATCHES:
- Empty catch blocks (catch(e) {})
- Catch blocks that only return defaults without logging
- || operator silently falling back to defaults
- ?? operator hiding undefined/null without checking
- .catch() returning defaults without logging
- Optional chaining (?.) hiding errors
- try-catch without proper error handling
- Async functions without try-catch
- Promises without .catch()
- Default parameters hiding validation errors

CORRECT APPROACH:
[BAD]:  try { risky() } catch(e) { return null; }
[GOOD]: try { risky() } catch(e) { logger.error('Risky failed:', e); throw e; }

[BAD]:  const data = riskyCall() || defaultData;
[GOOD]: const data = riskyCall(); if (!data) { logger.error('No data'); throw new Error('Missing data'); }`,
            th: `Silent failures เป็นรูปแบบต่อต้านที่อันตรายที่สุดในโค้ด production มันซ่อนบั๊กร้ายแรง ทำให้ debug ไม่ได้ และทำให้เกิดความล้มเหลวแบบลูกโซ่ที่ตามหาสาเหตุไม่ได้

ทำไมมันสำคัญมาก:
1) บั๊กมองไม่เห็น: เมื่อ error ถูกกลืนไป คุณไม่รู้เลยว่ามีอะไรผิดพลาดจนกว่าข้อมูลจะเสียหาย
2) Debug ฝันร้าย: ไม่มี stack trace ไม่มี error message = หาสาเหตุไม่ได้เลย
3) ล้มเหลวแบบลูกโซ่: Error ที่เงียบกระจายไปทั่วระบบ ทำให้ส่วนอื่นๆ ที่ไม่เกี่ยวข้องล้มเหลวด้วย
4) ข้อมูลเสียหาย: การ return ค่า default เมื่อเกิด error อาจเขียนข้อมูลเสียลง database
5) ความเสี่ยงด้านความปลอดภัย: Error อาจบอกว่ามีการโจมตีหรือบุกรุก - ต้อง log เพื่อตรวจสอบ
6) มองไม่เห็น Production: ไม่สามารถ monitor สุขภาพระบบถ้า error ไม่ถูกรายงาน
7) ตัวชี้วัดผิด: ตัวชี้วัดความสำเร็จสูงเกินจริงเพราะความล้มเหลวถูกซ่อนไว้
8) ละเมิดกฎหมาย: กฎหมายหลายฉบับกำหนดให้ต้อง log error เพื่อตรวจสอบย้อนหลัง

อันนี้จับอะไรบ้าง:
- Catch block เปล่า (catch(e) {})
- Catch block ที่ return default โดยไม่ log
- || operator ที่ fallback เงียบๆ
- ?? operator ที่ซ่อน undefined/null โดยไม่เช็ค
- .catch() ที่ return default โดยไม่ log
- Optional chaining (?.) ที่ซ่อน error
- try-catch ที่ไม่จัดการ error ถูกต้อง
- Async function ที่ไม่มี try-catch
- Promise ที่ไม่มี .catch()
- Default parameter ที่ซ่อน validation error

วิธีที่ถูกต้อง:
[ไม่ดี]:  try { risky() } catch(e) { return null; }
[ดี]: try { risky() } catch(e) { logger.error('Risky failed:', e); throw e; }

[ไม่ดี]:  const data = riskyCall() || defaultData;
[ดี]: const data = riskyCall(); if (!data) { logger.error('No data'); throw new Error('Missing data'); }`
        },
        patterns: [
            // ═══════════════════════════════════════════════════════════════════
            // || OPERATOR SILENT FALLBACKS - จับ || ที่ซ่อน error
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\|\|\s*(?:null|undefined)\b/, name: '|| null/undefined fallback', severity: 'ERROR' },
            { regex: /\|\|\s*\[\]/, name: '|| empty array fallback', severity: 'ERROR' },
            { regex: /\|\|\s*\{\}/, name: '|| empty object fallback', severity: 'ERROR' },
            { regex: /\|\|\s*(?:false|0)\b/, name: '|| false/0 fallback', severity: 'ERROR' },
            { regex: /\|\|\s*['"](?:[^'"]*)?['"]/, name: '|| empty/default string fallback', severity: 'ERROR' },
            { regex: /\|\|\s*\w+Default\w*/, name: '|| defaultValue pattern', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ?? NULLISH COALESCING - จับ ?? ที่ซ่อนปัญหา
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\?\?\s*(?:null|undefined)\b/, name: '?? null/undefined coalescing', severity: 'ERROR' },
            { regex: /\?\?\s*\[\]/, name: '?? empty array coalescing', severity: 'ERROR' },
            { regex: /\?\?\s*\{\}/, name: '?? empty object coalescing', severity: 'ERROR' },
            { regex: /\?\?\s*['"](?:[^'"]*)?['"]/, name: '?? default string coalescing', severity: 'ERROR' },
            { regex: /\?\?\s*\w+Default\w*/, name: '?? defaultValue coalescing', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // TERNARY OPERATOR HIDING ERRORS - จับ ternary ที่ซ่อน error
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\?\s*(?:null|undefined|\[\]|\{\})\s*:\s*\w+/, name: 'Ternary with silent null fallback', severity: 'WARNING' },
            { regex: /\w+\s*\?\s*\w+\s*:\s*(?:null|undefined|\[\]|\{\})/, name: 'Ternary with silent default', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // OPTIONAL CHAINING HIDING UNDEFINED - จับ ?. ที่อาจซ่อนปัญหา
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\?\.\w+\s*\|\|/, name: 'Optional chaining with || fallback', severity: 'WARNING' },
            { regex: /\?\.\w+\s*\?\?/, name: 'Optional chaining with ?? fallback', severity: 'WARNING' },
            { regex: /\?\.\w+\([^)]*\)\s*\|\|/, name: 'Optional method call with || fallback', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // PROMISE .catch() RETURNING DEFAULTS - จับ Promise catch ที่ไม่ log
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\.catch\s*\(\s*\(\s*\)\s*=>\s*(?:null|undefined|\[\]|\{\})\s*\)/, name: 'Promise.catch returning default without logging', severity: 'ERROR' },
            { regex: /\.catch\s*\(\s*\w+\s*=>\s*(?:null|undefined|\[\]|\{\})\s*\)/, name: 'Promise.catch silently swallowing error', severity: 'ERROR' },
            { regex: /\.catch\s*\(\s*\w+\s*=>\s*\{\s*return\s+(?:null|undefined|\[\]|\{\})\s*;\s*\}\s*\)/, name: 'Promise.catch block returning default', severity: 'ERROR' },
            { regex: /\.catch\s*\(\s*\(\s*\)\s*=>\s*\w+Default\w*\s*\)/, name: 'Promise.catch returning default value', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ASYNC/AWAIT WITHOUT TRY-CATCH - จับ async ที่ไม่มี error handling
            // ═══════════════════════════════════════════════════════════════════
            { regex: /async\s+function[^{]*\{(?:(?!try)(?!catch).)*await[\s\S]*?\}(?!\s*\.catch)/, name: 'async function with await but no try-catch', severity: 'ERROR' },
            { regex: /async\s*\([^)]*\)\s*=>\s*\{(?:(?!try)(?!catch).)*await/, name: 'async arrow function without try-catch', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // EMPTY CATCH BLOCKS - จับ catch ที่ว่างเปล่า (จะถูกเช็คใน checkCatchBlocks)
            // ═══════════════════════════════════════════════════════════════════
            { regex: /catch\s*\(\s*\w*\s*\)\s*\{\s*\}/, name: 'Empty catch block (worst practice)', severity: 'ERROR' },
            { regex: /catch\s*\(\s*\w+\s*\)\s*\{\s*return\s+(?:null|undefined|\[\]|\{\}|false|0|['"][^'"]*['"])\s*;?\s*\}/, name: 'Catch block only returning default', severity: 'ERROR' },
            { regex: /catch\s*\(\s*\w+\s*\)\s*\{\s*\/\//, name: 'Catch block with only comments', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // TRY-CATCH WITHOUT PROPER HANDLING - จับ try-catch ที่ไม่มี log/throw
            // ═══════════════════════════════════════════════════════════════════
            { regex: /catch\s*\(\s*\w+\s*\)\s*\{(?:(?!logger)(?!console\.error)(?!console\.warn)(?!throw).)*\}/, name: 'Catch block without logging or throwing', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // .then() WITHOUT .catch() - จับ Promise chain ที่ไม่มี catch
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\.then\s*\([^)]*\)(?:\s*\.then\s*\([^)]*\))*\s*;/, name: 'Promise.then() without .catch()', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // DEFAULT PARAMETERS HIDING VALIDATION - จับ default param ที่อาจปัญหา
            // ═══════════════════════════════════════════════════════════════════
            { regex: /function\s+\w+\s*\([^)]*=\s*(?:\[\]|\{\}|null)[^)]*\)/, name: 'Default parameters may hide validation', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // SILENT ERROR VARIABLE NAMES - จับชื่อตัวแปรที่บอกว่า ignore error
            // ═══════════════════════════════════════════════════════════════════
            { regex: /catch\s*\(\s*_(?:error|err|e)?\s*\)/, name: 'Catch with _ (ignoring error intentionally)', severity: 'ERROR' },
            { regex: /catch\s*\(\s*ignore[dD]?\s*\)/, name: 'Catch with "ignored" variable name', severity: 'ERROR' },
            { regex: /catch\s*\(\s*unused\s*\)/, name: 'Catch with "unused" variable name', severity: 'ERROR' },

            // ADDITIONAL SILENT FALLBACK PATTERNS - EXTENDED COVERAGE

            // Array methods with silent failures
            { regex: /\.find\s*\([^)]+\)\s*\|\|/, name: '.find() with || fallback (may hide not found)', severity: 'WARNING' },
            { regex: /\.filter\s*\([^)]+\)\s*\[0\]\s*\|\|/, name: '.filter()[0] with || fallback', severity: 'WARNING' },
            { regex: /\.reduce\s*\([^)]+\)\s*\|\|/, name: '.reduce() with || fallback', severity: 'WARNING' },
            { regex: /\.map\s*\([^)]+\)\s*\[0\]\s*\|\|/, name: '.map()[0] with || fallback', severity: 'WARNING' },

            // Object property access with silent fallback
            { regex: /\w+\[['"][^'"]+['"]\]\s*\|\|/, name: 'Object[key] with || fallback', severity: 'WARNING' },
            { regex: /\w+\.\w+\s*\|\|\s*\{\}/, name: 'Object.property || {} (hiding undefined)', severity: 'WARNING' },
            { regex: /\w+\.\w+\s*\|\|\s*\[\]/, name: 'Object.property || [] (hiding undefined)', severity: 'WARNING' },

            // Function calls with silent fallback
            { regex: /\w+\([^)]*\)\s*\|\|\s*(?:null|undefined|false|\[\]|\{\})/, name: 'Function call with silent fallback', severity: 'WARNING' },
            { regex: /\w+\([^)]*\)\s*\?\?\s*(?:null|undefined|\[\]|\{\})/, name: 'Function call with ?? fallback', severity: 'WARNING' },

            // Try-catch with continue/break (silently skipping errors)
            { regex: /catch\s*\([^)]*\)\s*\{\s*continue\s*;?\s*\}/, name: 'Catch with continue (silently skipping error)', severity: 'ERROR' },
            { regex: /catch\s*\([^)]*\)\s*\{\s*break\s*;?\s*\}/, name: 'Catch with break (silently skipping error)', severity: 'ERROR' },
            { regex: /catch\s*\([^)]*\)\s*\{\s*return\s*;?\s*\}/, name: 'Catch with empty return (silently exiting)', severity: 'ERROR' },

            // Error handling with only console.log (not error logging)
            { regex: /catch\s*\([^)]*\)\s*\{\s*console\.log\(/, name: 'Catch with console.log() (use console.error)', severity: 'ERROR' },
            { regex: /catch\s*\([^)]*\)\s*\{\s*console\.info\(/, name: 'Catch with console.info() (use console.error)', severity: 'ERROR' },
            { regex: /catch\s*\([^)]*\)\s*\{\s*console\.debug\(/, name: 'Catch with console.debug() (use console.error)', severity: 'ERROR' },

            // Silent error with only variable assignment
            { regex: /catch\s*\([^)]*\)\s*\{\s*\w+\s*=\s*(?:null|undefined|false|\[\]|\{\})\s*;?\s*\}/, name: 'Catch only assigning default value', severity: 'ERROR' },

            // Promises with empty .catch
            { regex: /\.catch\s*\(\s*\(\s*\)\s*=>\s*\{\s*\}\s*\)/, name: 'Empty Promise.catch() block', severity: 'ERROR' },

            // Advanced silent fallback patterns
            { regex: /try\s*\{[^}]+\}\s*catch\s*\([^)]*\)\s*\{\s*\/\/\s*(?:ignore|skip|silent)/, name: 'Try-catch with ignore comment', severity: 'ERROR' },
            { regex: /try\s*\{[^}]+\}\s*catch\s*\([^)]*\)\s*\{\s*\/\*[^*]*(?:ignore|skip|silent)[^*]*\*\//, name: 'Try-catch with ignore block comment', severity: 'ERROR' },
            
            // Conditional error suppression
            { regex: /if\s*\([^)]*error[^)]*\)\s*\{\s*return\s*(?:null|undefined|false|\[\]|\{\})\s*;?\s*\}/, name: 'If error condition with silent return', severity: 'ERROR' },
            { regex: /error\s*\?\s*(?:null|undefined|false|\[\]|\{\})\s*:/, name: 'Ternary operator silencing errors', severity: 'ERROR' },
            
            // Async/await without proper error handling
            { regex: /async\s+(?:function\s+\w+\s*)?\([^)]*\)\s*\{(?:(?!try)(?!catch)(?!throw).)*await(?:(?!try)(?!catch)(?!throw).)*\}/, name: 'Async function without try-catch around await', severity: 'WARNING' },
            { regex: /await\s+[^;]+\s*\|\|/, name: 'Await with || fallback (hiding async errors)', severity: 'ERROR' },
            { regex: /await\s+[^;]+\s*\?\?/, name: 'Await with ?? fallback (hiding async errors)', severity: 'ERROR' },
            
            // JSON parsing without error handling
            { regex: /JSON\.parse\s*\([^)]+\)\s*\|\|/, name: 'JSON.parse with || fallback (hiding parse errors)', severity: 'ERROR' },
            { regex: /JSON\.parse\s*\([^)]+\)\s*\?\?/, name: 'JSON.parse with ?? fallback (hiding parse errors)', severity: 'ERROR' },
            
            // File system operations without error handling
            { regex: /fs\.readFileSync\s*\([^)]+\)\s*\|\|/, name: 'fs.readFileSync with || fallback', severity: 'ERROR' },
            { regex: /fs\.existsSync\s*\([^)]+\)\s*\?\s*[^:]+\s*:\s*(?:null|undefined|\[\]|\{\})/, name: 'fs.existsSync ternary with silent fallback', severity: 'WARNING' },
            
            // Database query silent failures
            { regex: /\.query\s*\([^)]+\)\s*\|\|/, name: 'Database query with || fallback', severity: 'ERROR' },
            { regex: /\.findOne\s*\([^)]+\)\s*\|\|/, name: 'Database findOne with || fallback', severity: 'WARNING' },
            { regex: /\.findById\s*\([^)]+\)\s*\|\|/, name: 'Database findById with || fallback', severity: 'WARNING' },
            
            // HTTP requests without proper error handling
            { regex: /axios\.[^(]+\([^)]+\)(?:(?!\.catch)(?!\.then\s*\([^)]*,\s*[^)]+\))).+;/, name: 'Axios request without .catch()', severity: 'WARNING' },
            { regex: /fetch\s*\([^)]+\)(?:(?!\.catch)(?!\.then\s*\([^)]*,\s*[^)]+\))).+;/, name: 'Fetch request without .catch()', severity: 'WARNING' },
            
            // Event handlers swallowing errors
            { regex: /\.on\s*\(\s*['"]error['"],\s*\(\s*\)\s*=>\s*\{\s*\}/, name: 'Empty error event handler', severity: 'ERROR' },
            { regex: /\.addEventListener\s*\(\s*['"]error['"],\s*\(\s*\)\s*=>\s*\{\s*\}/, name: 'Empty error event listener', severity: 'ERROR' },
            
            // Process error handling
            { regex: /process\.on\s*\(\s*['"]uncaughtException['"],\s*\(\s*\)\s*=>\s*\{\s*\}/, name: 'Empty uncaughtException handler', severity: 'ERROR' },
            { regex: /process\.on\s*\(\s*['"]unhandledRejection['"],\s*\(\s*\)\s*=>\s*\{\s*\}/, name: 'Empty unhandledRejection handler', severity: 'ERROR' },
            
            // Stream error handling
            { regex: /\.on\s*\(\s*['"]error['"],\s*err\s*=>\s*\{\s*\}\s*\)/, name: 'Stream with empty error handler', severity: 'ERROR' },
            
            // Silent error logging (using wrong log level)
            { regex: /catch\s*\([^)]*\)\s*\{\s*logger\.info\(/, name: 'Catch logging as info (should be error)', severity: 'ERROR' },
            { regex: /catch\s*\([^)]*\)\s*\{\s*logger\.debug\(/, name: 'Catch logging as debug (should be error)', severity: 'ERROR' },
            
            // Configuration fallbacks that might hide errors
            { regex: /config\.\w+\s*\|\|\s*['"][^'"]*['"]/, name: 'Config property with string fallback (might hide missing config)', severity: 'WARNING' },
            { regex: /process\.env\.\w+\s*\|\|\s*['"][^'"]*['"]/, name: 'Environment variable with hardcoded fallback', severity: 'WARNING' },
            { regex: /\.catch\s*\(\s*\w+\s*=>\s*\{\s*\}\s*\)/, name: 'Empty Promise.catch() with parameter', severity: 'ERROR' },

            // Async/await with empty catch
            { regex: /async[^{]+\{[^}]*try\s*\{[^}]+\}\s*catch\s*\([^)]*\)\s*\{\s*\}/, name: 'Async function with empty catch', severity: 'ERROR' },

            // Error swallowing with void operator
            { regex: /void\s+\w+\([^)]*\)\.catch/, name: 'void with .catch() (suppressing errors)', severity: 'ERROR' },

            // Silent failure in event handlers
            { regex: /\.on\s*\(\s*['"]error['"].*?\(\s*\)\s*=>\s*\{\s*\}/, name: 'Empty error event handler', severity: 'ERROR' },
            { regex: /\.addEventListener\s*\(\s*['"]error['"].*?\(\s*\)\s*=>\s*\{\s*\}/, name: 'Empty addEventListener error handler', severity: 'ERROR' },
            { regex: /onerror\s*=\s*\(\s*\)\s*=>\s*\{\s*\}/, name: 'Empty onerror handler', severity: 'ERROR' },
            { regex: /onerror\s*=\s*\(\s*\)\s*=>\s*(?:null|undefined|false)/, name: 'onerror returning null/undefined/false', severity: 'ERROR' },

            // Process error handlers without logging
            { regex: /process\.on\s*\(\s*['"]uncaughtException['"].*?catch.*?\{\s*\}/, name: 'Empty uncaughtException handler', severity: 'ERROR' },
            { regex: /process\.on\s*\(\s*['"]unhandledRejection['"].*?catch.*?\{\s*\}/, name: 'Empty unhandledRejection handler', severity: 'ERROR' },

            // Window error handlers
            { regex: /window\.onerror\s*=.*?return\s+true/, name: 'window.onerror returning true (suppressing)', severity: 'ERROR' },
            { regex: /window\.addEventListener\s*\(\s*['"]error['"].*?\{\s*\}/, name: 'Empty window error listener', severity: 'ERROR' },

            // Silent failures in callbacks
            { regex: /callback\s*\(\s*(?:null|undefined)\s*,/, name: 'Callback with null error (Node.js pattern without check)', severity: 'WARNING' },
            { regex: /cb\s*\(\s*(?:null|undefined)\s*,/, name: 'cb() with null error without check', severity: 'WARNING' },

            // Axios/Fetch interceptors with silent failures
            { regex: /interceptors\.\w+\.use\([^,]+,\s*\(\s*\)\s*=>\s*\{\s*\}/, name: 'Axios interceptor with empty error handler', severity: 'ERROR' },
            { regex: /interceptors\.\w+\.use\([^,]+,\s*\w+\s*=>\s*\{\s*return\s+\w+\s*\}/, name: 'Interceptor returning error without logging', severity: 'WARNING' },

            // GraphQL/Apollo error handling
            { regex: /onError\s*:\s*\(\s*\)\s*=>\s*\{\s*\}/, name: 'Empty onError callback', severity: 'ERROR' },
            { regex: /errorPolicy\s*:\s*['"]ignore['"]/, name: 'Apollo errorPolicy: ignore', severity: 'ERROR' },

            // React error boundaries without logging
            { regex: /componentDidCatch\s*\([^)]*\)\s*\{\s*\}/, name: 'Empty componentDidCatch (React)', severity: 'ERROR' },
            { regex: /static\s+getDerivedStateFromError.*?\{\s*return\s+\{/, name: 'getDerivedStateFromError without logging', severity: 'WARNING' },

            // Express/Koa error middleware
            { regex: /\(err,\s*req,\s*res,\s*next\)\s*=>\s*\{\s*res\.(send|json)/, name: 'Express error middleware without logging', severity: 'WARNING' },
            { regex: /app\.use\s*\(\s*async.*?catch.*?\{\s*\}/, name: 'Empty catch in Express middleware', severity: 'ERROR' },
        ],
        severity: 'ERROR',
        mustInclude: ['throw', 'logger', 'console.error', 'log.error', 'console.warn'],
        checkCatchBlocks: true,
        violationExamples: {
            en: [
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @description Try-catch with silent return
                 */
                function riskyOperationWrapper() { try { riskyOperation(); } catch(e) { return null; } }`,
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @description Function call with silent fallback
                 */
                const data = fetchData() || [];`,
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @description Empty catch block
                 */
                try {} catch(error) { /* ignore errors */ }`,
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @description Promise with empty catch
                 */
                new Promise((res, rej) => rej()).catch(() => {});`,
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @description async function with await but no try-catch
                 */
                async function getData() { await Promise.resolve(1); }`
            ],
            th: [
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @matches-pattern Try-catch with silent return
                 * @description กลืน error เงียบๆ
                 */
                try { riskyOperation(); } catch(e) { return null; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @matches-pattern Function call with silent fallback
                 * @description ซ่อนปัญหาด้วย ||
                 */
                const data = fetchData() || defaultData;`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @matches-pattern Empty catch block
                 * @description เพิกเฉยต่อ error
                 */
                catch(error) { /* ignore errors */ }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @matches-pattern Promise with empty catch
                 * @description catch ว่างเปล่า
                 */
                promise.catch(() => {});`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @matches-pattern Try-catch with default return
                 * @description return default โดยไม่ log
                 */
                try { parse(json); } catch(e) { return {}; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @matches-pattern Function call with silent fallback
                 * @description ซ่อนการหาไม่เจอ
                 */
                const user = users.find(u => u.id === id) || guestUser;`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @matches-pattern Catch with console.log() (use console.error)
                 * @description log ผิดวิธี
                 */
                catch(err) { console.log("Error occurred"); return false; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type violation
                 * @matches-pattern async function with await but no try-catch
                 * @description ไม่มี try-catch
                 */
                async function getData() { await apiCall(); }`
            ]
        },
        correctExamples: {
            en: [
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                try { riskyOperation(); } catch(e) { logger.error("Operation failed:", e); throw e; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                const data = fetchData(); if (!data) { logger.error("Fetch failed"); throw new Error("No data"); }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                catch(error) { logger.error("Critical error:", error); throw error; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                promise.catch(err => { logger.error("Promise rejected:", err); throw err; });`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                try { parse(json); } catch(e) { logger.error("JSON parse failed:", e); throw new Error("Invalid JSON"); }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                const user = users.find(u => u.id === id); if (!user) { logger.warn("User not found:", id); throw new NotFoundError(); }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                catch(err) { logger.error("Unexpected error:", err); throw err; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                async function getData() { try { return await apiCall(); } catch(e) { logger.error("API call failed:", e); throw e; } }`
            ],
            th: [
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                try { riskyOperation(); } catch(e) { logger.error("Operation failed:", e); throw e; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                const data = fetchData(); if (!data) { logger.error("Fetch failed"); throw new Error("No data"); }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                catch(error) { logger.error("Critical error:", error); throw error; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                promise.catch(err => { logger.error("Promise rejected:", err); throw err; });`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                try { parse(json); } catch(e) { logger.error("JSON parse failed:", e); throw new Error("Invalid JSON"); }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                const user = users.find(u => u.id === id); if (!user) { logger.warn("User not found:", id); throw new NotFoundError(); }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                catch(err) { logger.error("Unexpected error:", err); throw err; }`,
                
                `/**
                 * @example-for-rule NO_SILENT_FALLBACKS
                 * @type correct
                 */
                async function getData() { try { return await apiCall(); } catch(e) { logger.error("API call failed:", e); throw e; } }`
            ]
        },
        fix: {
            en: 'Add logger.error(error) before return, or throw error instead of returning default. NEVER silently swallow errors.',
            th: 'เพิ่ม logger.error(error) ก่อน return หรือ throw error แทนการ return ค่า default ห้ามกลืน error แบบเงียบๆ เด็ดขาด'
        }
    },
// ====================================================================== 
// NO_INTERNAL_CACHING Rule: Detects internal caching/memoization in functions.
// ====================================================================== 
    NO_INTERNAL_CACHING: {
        id: 'NO_INTERNAL_CACHING',
        name: {
            en: 'No Internal Caching',
            th: 'ห้ามสร้าง Cache ภายในฟังก์ชัน'
        },
        description: {
            en: 'DO NOT create internal cache or memoization. Caching is external responsibility.',
            th: 'ห้ามสร้างตัวแปรเก็บผลลัพธ์หรือ memoization ภายในฟังก์ชัน ให้ Cache เป็นหน้าที่ของภายนอก'
        },
        explanation: {
            en: `Internal caching is a VIOLATION of separation of concerns and creates hard-to-debug problems:

WHY IT'S PROBLEMATIC:
1) SHARED MUTABLE STATE: Cache becomes global state, causing race conditions and unpredictable behavior
2) IMPURE FUNCTIONS: Functions with cache are not pure - same input can give different output based on cache state
3) MEMORY LEAKS: Internal cache never gets garbage collected, growing indefinitely until OOM
4) NO INVALIDATION: Function doesn't know when data changes - serves stale data forever
5) TESTING NIGHTMARE: Tests interfere with each other through shared cache, causing flaky tests
6) CONCURRENCY BUGS: Multiple threads/processes accessing same cache = race conditions
7) NO VISIBILITY: Can't monitor cache hit/miss rates or debug cache behavior
8) TIGHT COUPLING: Function becomes tightly coupled to caching implementation
9) NO CONFIGURABILITY: Cannot adjust cache size, TTL, or strategy based on usage patterns
10) VIOLATES SRP: Function does business logic AND caching - two responsibilities

WHAT THIS CATCHES:
- Cache variables (any name: cache, memo, memoized, stored, etc.)
- Map/WeakMap/Set/WeakSet used for caching
- Object literals used as cache ({})
- Arrays used as cache ([])
- Class properties for caching (this.cache, this._cache)
- Closure-based caching patterns
- Memoization functions and decorators
- LRU cache implementations
- Cache checking patterns (if cached, cache.has, etc.)
- Cache operations (get, set, delete, clear)

CORRECT APPROACH:
[BAD]:  const cache = {}; function getData(id) { if(cache[id]) return cache[id]; cache[id] = fetch(id); return cache[id]; }
[GOOD]: function getData(id) { return fetch(id); } // Let caller add caching layer: const cachedGetData = withCache(getData)

SEPARATION OF CONCERNS:
- Business Logic Layer: Pure function that just computes/fetches
- Caching Layer: External decorator/wrapper that handles caching
- Configuration Layer: Centralized cache config (Redis, Memcached, etc.)`,
            th: `Cache ภายในฟังก์ชันเป็นการละเมิดหลัก separation of concerns และสร้างปัญหาที่ debug ยาก:

ทำไมมันเป็นปัญหา:
1) SHARED MUTABLE STATE: Cache กลายเป็น global state ทำให้เกิด race condition และทำงานไม่แน่นอน
2) ฟังก์ชันไม่ PURE: ฟังก์ชันที่มี cache ไม่ pure - input เดียวกันอาจให้ output ต่างกันขึ้นกับสถานะ cache
3) MEMORY LEAKS: Cache ภายในไม่ถูก garbage collect ขยายตัวเรื่อยๆ จนกว่าจะ OOM
4) ไม่มี INVALIDATION: ฟังก์ชันไม่รู้ว่าข้อมูลเปลี่ยนเมื่อไหร่ - ส่งข้อมูลเก่าออกไปตลอด
5) TEST ฝันร้าย: Test รบกวนกันผ่าน shared cache ทำให้ test ไม่เสถียร
6) CONCURRENCY BUGS: หลาย thread/process เข้าถึง cache เดียวกัน = race condition
7) มองไม่เห็น: ไม่สามารถ monitor cache hit/miss rate หรือ debug พฤติกรรม cache
8) TIGHT COUPLING: ฟังก์ชันผูกติดแน่นกับ caching implementation
9) ปรับแต่งไม่ได้: ไม่สามารถปรับ cache size, TTL หรือ strategy ตามการใช้งาน
10) ละเมิด SRP: ฟังก์ชันทำทั้ง business logic และ caching - สองหน้าที่

อันนี้จับอะไรบ้าง:
- ตัวแปร cache (ทุกชื่อ: cache, memo, memoized, stored, ฯลฯ)
- Map/WeakMap/Set/WeakSet ที่ใช้เป็น cache
- Object literal ที่ใช้เป็น cache ({})
- Array ที่ใช้เป็น cache ([])
- Class property สำหรับ cache (this.cache, this._cache)
- Closure-based caching pattern
- Memoization function และ decorator
- LRU cache implementation
- Cache checking pattern (if cached, cache.has, ฯลฯ)
- Cache operation (get, set, delete, clear)

วิธีที่ถูกต้อง:
[ไม่ดี]:  const cache = {}; function getData(id) { if(cache[id]) return cache[id]; cache[id] = fetch(id); return cache[id]; }
[ดี]: function getData(id) { return fetch(id); } // ให้ caller เพิ่ม caching layer: const cachedGetData = withCache(getData)

SEPARATION OF CONCERNS:
- Business Logic Layer: Pure function ที่แค่คำนวณ/ดึงข้อมูล
- Caching Layer: External decorator/wrapper ที่จัดการ cache
- Configuration Layer: Cache config ส่วนกลาง (Redis, Memcached, ฯลฯ)`
        },
        patterns: [
            // ═══════════════════════════════════════════════════════════════════
            // CACHE VARIABLE DECLARATIONS - จับการประกาศตัวแปร cache ที่ชัดเจน
            // ปรับปรุง: เน้นจับ pattern ที่มีการใช้งาน cache จริงๆ ไม่ใช่แค่ชื่อ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /(?:const|let|var)\s+cache\s*=\s*(?:new\s+Map\(|new\s+WeakMap\(|\{\}|\[\]|Object\.create)/, name: 'cache variable with Map/Object/Array', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+(?:result|data|value)Cache\s*=/, name: 'resultCache/dataCache/valueCache variable', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+cached(?:Results|Data|Values)\s*=\s*(?:new\s+Map|new\s+WeakMap|\{\})/, name: 'cachedResults/cachedData with Map/Object', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+_cache\s*=\s*(?:new\s+Map|new\s+WeakMap|\{\})/, name: '_cache private variable with storage', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+__cache\s*=\s*(?:new\s+Map|new\s+WeakMap|\{\})/, name: '__cache double underscore with storage', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // MAP/WEAKMAP/SET FOR CACHING - จับการใช้ Map/Set เป็น cache
            // ปรับปรุง: เฉพาะตัวแปรที่มีชื่อชัดเจนว่าเป็น cache
            // ═══════════════════════════════════════════════════════════════════
            { regex: /(?:const|let|var)\s+(?:cache|resultCache|dataCache|queryCache)\s*=\s*new\s+Map\s*\(/, name: 'new Map() assigned to cache variable', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+(?:cache|resultCache|dataCache|queryCache)\s*=\s*new\s+WeakMap\s*\(/, name: 'new WeakMap() assigned to cache variable', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+(?:cache|resultCache|dataCache|queryCache)\s*=\s*new\s+Set\s*\(/, name: 'new Set() assigned to cache variable', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+(?:cache|resultCache|dataCache|queryCache)\s*=\s*new\s+WeakSet\s*\(/, name: 'new WeakSet() assigned to cache variable', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // MEMOIZATION PATTERNS - จับ memoization functions และ patterns
            // ═══════════════════════════════════════════════════════════════════
            { regex: /function\s+memoize\s*\(|const\s+memoize\s*=|let\s+memoize\s*=/, name: 'memoize() function implementation', severity: 'ERROR' },
            { regex: /\.memoize\s*\(|\.memo\s*\(/, name: 'memoize() method call', severity: 'ERROR' },
            { regex: /useMemo\s*\(/, name: 'React useMemo() hook (internal memoization)', severity: 'ERROR' },
            { regex: /useCallback\s*\(/, name: 'React useCallback() hook (internal memoization)', severity: 'WARNING' },
            { regex: /React\.memo\s*\(/, name: 'React.memo() HOC (component memoization)', severity: 'WARNING' },
            { regex: /memo\s*\(.*\)/, name: 'generic memo() function call', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // CLASS-BASED CACHING - จับ caching ใน class properties
            // ═══════════════════════════════════════════════════════════════════
            { regex: /this\.cache\s*=\s*(?:new\s+Map|new\s+WeakMap|\{\}|\[\])/, name: 'this.cache property assignment', severity: 'ERROR' },
            { regex: /this\._cache\s*=\s*(?:new\s+Map|new\s+WeakMap|\{\}|\[\])/, name: 'this._cache private property assignment', severity: 'ERROR' },
            { regex: /this\.(?:result|data|query)Cache\s*=/, name: 'this.resultCache/dataCache property assignment', severity: 'ERROR' },
            { regex: /this\.cached(?:Results|Data|Values)\s*=/, name: 'this.cachedResults/cachedData property assignment', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════  
            // CACHE CHECKING PATTERNS - จับการตรวจสอบ cache
            // ═══════════════════════════════════════════════════════════════════
            { regex: /if\s*\(\s*cache\[|if\s*\(\s*cache\.get\(|if\s*\(\s*cache\.has\(/, name: 'cache checking with if statement', severity: 'WARNING' },
            { regex: /cache\[.*\]\s*\?\s*cache\[.*\]\s*:/, name: 'ternary cache access pattern', severity: 'WARNING' },
            { regex: /cached\s*\?\s*cached\s*:/, name: 'cached variable ternary check', severity: 'WARNING' },
            { regex: /return\s+cache\[.*\]\s*\|\|/, name: 'return cache with || fallback', severity: 'WARNING' },
            { regex: /return\s+cache\.get\(.*\)\s*\|\|/, name: 'return cache.get() with || fallback', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // CACHE OPERATIONS - จับการ get/set cache
            // ═══════════════════════════════════════════════════════════════════
            { regex: /cache\.set\s*\(|cache\[.*\]\s*=/, name: 'cache write operation (set/assignment)', severity: 'WARNING' },
            { regex: /cache\.get\s*\(|cache\[.*\](?!=)/, name: 'cache read operation (get/access)', severity: 'WARNING' },
            { regex: /cache\.delete\s*\(|delete\s+cache\[/, name: 'cache delete operation', severity: 'WARNING' },
            { regex: /cache\.clear\s*\(|cache\s*=\s*\{\}/, name: 'cache clear operation', severity: 'WARNING' },
            { regex: /cache\.has\s*\(/, name: 'cache.has() existence check', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // CLOSURE-BASED CACHING - จับ closure caching patterns
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\(\s*function\s*\(\s*\)\s*\{[^}]*(?:const|let|var)\s+cache\s*=/, name: 'IIFE with internal cache variable', severity: 'ERROR' },
            { regex: /function.*\{[^}]*(?:const|let|var)\s+(?:cache|_cache)\s*=\s*(?:\{\}|\[\]|new\s+Map)/, name: 'function with internal cache variable', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // BROWSER STORAGE AS CACHE - จับการใช้ browser storage เป็น cache
            // ═══════════════════════════════════════════════════════════════════
            { regex: /localStorage\.setItem\s*\([^,)]*cache/i, name: 'localStorage used for caching', severity: 'ERROR' },
            { regex: /sessionStorage\.setItem\s*\([^,)]*cache/i, name: 'sessionStorage used for caching', severity: 'ERROR' },
            { regex: /localStorage\.getItem\s*\([^,)]*cache/i, name: 'localStorage cache retrieval', severity: 'ERROR' },
            { regex: /sessionStorage\.getItem\s*\([^,)]*cache/i, name: 'sessionStorage cache retrieval', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // LRU CACHE IMPLEMENTATIONS - จับ LRU cache ที่ implement เอง
            // ═══════════════════════════════════════════════════════════════════
            { regex: /class\s+LRU|function\s+LRU|const\s+LRU\s*=/i, name: 'LRU cache implementation', severity: 'ERROR' },
            { regex: /lruCache|LruCache|lru_cache/i, name: 'LRU cache variable/function', severity: 'ERROR' },
            { regex: /maxSize.*cache|cacheSize.*max/i, name: 'cache size configuration (indicates internal caching)', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // CACHE LIBRARY USAGE - จับการใช้ cache libraries ภายใน component
            // ═══════════════════════════════════════════════════════════════════
            { regex: /require\s*\(\s*['"]node-cache['"]|import.*from\s*['"]node-cache['"]/, name: 'node-cache library import (internal caching)', severity: 'ERROR' },
            { regex: /require\s*\(\s*['"]memory-cache['"]|import.*from\s*['"]memory-cache['"]/, name: 'memory-cache library import', severity: 'ERROR' },
            { regex: /require\s*\(\s*['"]lru-cache['"]|import.*from\s*['"]lru-cache['"]/, name: 'lru-cache library import', severity: 'ERROR' },
            { regex: /new\s+NodeCache\s*\(|new\s+LRU\s*\(/i, name: 'cache library instantiation', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // CACHE INVALIDATION PATTERNS - จับ cache invalidation (ปัญหาเรื่อง staleness)
            // ═══════════════════════════════════════════════════════════════════
            { regex: /cache\.expire\s*\(|cache\.ttl\s*\(/, name: 'cache expiration/TTL management (complex internal caching)', severity: 'ERROR' },
            { regex: /invalidate.*cache|cache.*invalidate/i, name: 'cache invalidation logic', severity: 'ERROR' },
            { regex: /cache.*refresh|refresh.*cache/i, name: 'cache refresh logic', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ADVANCED CACHING PATTERNS - จับ advanced caching ที่ซับซ้อน
            // ═══════════════════════════════════════════════════════════════════
            { regex: /cache\.(?:hits|misses|statistics)/i, name: 'cache statistics tracking (complex internal cache)', severity: 'ERROR' },
            { regex: /cacheHit|cacheMiss|hit_rate|miss_rate/i, name: 'cache performance metrics variables', severity: 'ERROR' },
            { regex: /warm.*cache|cache.*warm/i, name: 'cache warming logic', severity: 'WARNING' },
            { regex: /preload.*cache|cache.*preload/i, name: 'cache preloading logic', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // CACHE LOOKUP PATTERNS - จับการเช็คว่ามีใน cache หรือไม่
            // ═══════════════════════════════════════════════════════════════════
            { regex: /if\s*\(\s*\w*[Cc]ache\w*\s*\[/, name: 'if (cache[key]) pattern', severity: 'WARNING' },
            { regex: /if\s*\(\s*\w*[Cc]ache\w*\.has\(/, name: 'if (cache.has()) pattern', severity: 'WARNING' },
            { regex: /if\s*\(\s*\w*[Cc]ache\w*\.get\(/, name: 'if (cache.get()) pattern', severity: 'WARNING' },
            { regex: /\?\s*\w*[Cc]ache\w*\[/, name: 'ternary with cache[key]', severity: 'WARNING' },
            { regex: /\w*[Cc]ache\w*\[.*\]\s*\?\?/, name: 'cache[key] ?? fallback', severity: 'WARNING' },
            { regex: /\w*[Cc]ache\w*\[.*\]\s*\|\|/, name: 'cache[key] || fallback', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // CACHE OPERATIONS - จับการจัดการ cache (get, set, delete, clear)
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\w*[Cc]ache\w*\.get\(/, name: 'cache.get() operation', severity: 'WARNING' },
            { regex: /\w*[Cc]ache\w*\.set\(/, name: 'cache.set() operation', severity: 'WARNING' },
            { regex: /\w*[Cc]ache\w*\.delete\(/, name: 'cache.delete() operation', severity: 'WARNING' },
            { regex: /\w*[Cc]ache\w*\.clear\(/, name: 'cache.clear() operation', severity: 'WARNING' },
            { regex: /\w*[Cc]ache\w*\.has\(/, name: 'cache.has() check', severity: 'WARNING' },
            { regex: /\w*[Cc]ache\w*\[.*\]\s*=/, name: 'cache[key] = value assignment', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // CLASS PROPERTY CACHING - จับ cache ในรูป class property
            // ═══════════════════════════════════════════════════════════════════
            { regex: /this\.\w*[Cc]ache\w*\s*=/, name: 'this.cache property', severity: 'WARNING' },
            { regex: /this\._\w*[Cc]ache\w*/, name: 'this._cache private property', severity: 'WARNING' },
            { regex: /this\.\w*[Mm]emo\w*/, name: 'this.memo property', severity: 'WARNING' },
            { regex: /this\.\w*[Ss]tored?\w*/, name: 'this.stored property', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // MEMOIZATION FUNCTIONS - จับ memoization function และ decorator
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\bmemoize\s*\(/, name: 'memoize() function call', severity: 'WARNING' },
            { regex: /\bmemo\s*\(/, name: 'memo() function call', severity: 'WARNING' },
            { regex: /@memoize\b/, name: '@memoize decorator', severity: 'WARNING' },
            { regex: /@memo\b/, name: '@memo decorator', severity: 'WARNING' },
            { regex: /import\s+.*\bmemoize\b/, name: 'import memoize library', severity: 'WARNING' },
            { regex: /from\s+['"].*memoize.*['"]/, name: 'import from memoize library', severity: 'WARNING' },
            { regex: /require\s*\(\s*['"].*memoize.*['"]\s*\)/, name: 'require memoize library', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // LRU CACHE - จับ LRU cache implementation
            // ═══════════════════════════════════════════════════════════════════
            { regex: /new\s+LRU(?:Cache)?\s*\(/, name: 'LRU Cache instance', severity: 'WARNING' },
            { regex: /import\s+.*\bLRU\b/, name: 'import LRU cache', severity: 'WARNING' },
            { regex: /from\s+['"]lru-cache['"]/, name: 'import lru-cache library', severity: 'WARNING' },
            { regex: /require\s*\(\s*['"]lru-cache['"]\s*\)/, name: 'require lru-cache', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // CLOSURE-BASED CACHING - จับ closure ที่ใช้เก็บ cache
            // ═══════════════════════════════════════════════════════════════════
            { regex: /function\s+\w+\s*\([^)]*\)\s*\{[^}]*(?:const|let|var)\s+\w*[Cc]ache\w*/, name: 'Function with internal cache variable', severity: 'WARNING' },
            { regex: /\(\s*\)\s*=>\s*\{[^}]*(?:const|let|var)\s+\w*[Cc]ache\w*/, name: 'Arrow function with cache', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // RESULT STORAGE PATTERNS - จับการเก็บผลลัพธ์ไว้ใช้ซ้ำ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /const\s+results?\s*=\s*(?:new\s+Map|\{\})/, name: 'const result(s) storage', severity: 'WARNING' },
            { regex: /let\s+results?\s*=\s*(?:new\s+Map|\{\})/, name: 'let result(s) storage', severity: 'WARNING' },
            { regex: /if\s*\(\s*!?\w*[Rr]esults?\w*\[/, name: 'if (!result[key]) caching pattern', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // COMMON CACHING PATTERNS - จับ pattern ที่ใช้บ่อยสำหรับ cache
            // ═══════════════════════════════════════════════════════════════════
            { regex: /const\s+\w*[Ss]tored?\w*\s*=\s*(?:new\s+Map|\{\})/, name: 'stored/store variable for caching', severity: 'WARNING' },
            { regex: /const\s+\w*[Bb]uffer\w*\s*=\s*(?:new\s+Map|\{\})/, name: 'buffer variable for caching', severity: 'WARNING' },
            { regex: /if\s*\(\s*stored\w*\[/, name: 'if (stored[key]) lookup pattern', severity: 'WARNING' },
            { regex: /stored\w*\[.*\]\s*=/, name: 'stored[key] = value assignment', severity: 'WARNING' },
            
            // Database result caching patterns
            { regex: /const\s+\w*[Qq]ueryCache\w*\s*=/, name: 'queryCache variable', severity: 'ERROR' },
            { regex: /const\s+\w*[Dd]bCache\w*\s*=/, name: 'dbCache variable', severity: 'ERROR' },
            { regex: /const\s+\w*[Ss]qlCache\w*\s*=/, name: 'sqlCache variable', severity: 'ERROR' },
            
            // HTTP response caching
            { regex: /const\s+\w*[Rr]esponseCache\w*\s*=/, name: 'responseCache variable', severity: 'ERROR' },
            { regex: /const\s+\w*[Hh]ttpCache\w*\s*=/, name: 'httpCache variable', severity: 'ERROR' },
            { regex: /const\s+\w*[Aa]piCache\w*\s*=/, name: 'apiCache variable', severity: 'ERROR' },
            
            // File system caching
            { regex: /const\s+\w*[Ff]ileCache\w*\s*=/, name: 'fileCache variable', severity: 'ERROR' },
            { regex: /const\s+\w*[Pp]athCache\w*\s*=/, name: 'pathCache variable', severity: 'ERROR' },
            
            // Computation result caching
            { regex: /const\s+\w*[Cc]omputeCache\w*\s*=/, name: 'computeCache variable', severity: 'ERROR' },
            { regex: /const\s+\w*[Cc]alcCache\w*\s*=/, name: 'calcCache variable', severity: 'ERROR' },
            { regex: /const\s+\w*[Pp]rocessCache\w*\s*=/, name: 'processCache variable', severity: 'ERROR' },
            
            // Redis/Memcached usage inside functions
            { regex: /require\s*\(\s*['"]redis['"]|import.*from\s*['"]redis['"]/, name: 'redis library import (should be external)', severity: 'WARNING' },
            { regex: /require\s*\(\s*['"]memcached['"]|import.*from\s*['"]memcached['"]/, name: 'memcached library import (should be external)', severity: 'WARNING' },
            { regex: /new\s+Redis\s*\(/i, name: 'new Redis() instantiation', severity: 'WARNING' },
            { regex: /redis\.get\(|redis\.set\(/, name: 'redis get/set operations', severity: 'WARNING' },
            
            // Cache configuration patterns
            { regex: /cacheTimeout|cache_timeout|cacheTTL|cache_ttl/i, name: 'cache timeout/TTL configuration', severity: 'WARNING' },
            { regex: /maxCacheSize|max_cache_size|cacheLimit|cache_limit/i, name: 'cache size limit configuration', severity: 'WARNING' },
            
            // Service worker caching
            { regex: /caches\.open\(|caches\.match\(/, name: 'Service Worker Cache API usage', severity: 'WARNING' },
            
            // IndexedDB caching
            { regex: /indexedDB\.open\(.*cache/i, name: 'IndexedDB used for caching', severity: 'WARNING' },
            
            // Cookie-based caching
            { regex: /document\.cookie.*cache/i, name: 'cookies used for caching', severity: 'WARNING' },
            
            // Cache-Control headers
            { regex: /['"]Cache-Control['"]/, name: 'Cache-Control header (should be external concern)', severity: 'WARNING' },
            { regex: /['"]ETag['"]/, name: 'ETag header (caching concern)', severity: 'WARNING' },
            
            // Memory optimization patterns (potential caching)
            { regex: /const\s+\w*[Pp]ool\w*\s*=\s*(?:new\s+Map|\{\})/, name: 'object pool pattern (potential caching)', severity: 'WARNING' },
            { regex: /const\s+\w*[Bb]ank\w*\s*=\s*(?:new\s+Map|\{\})/, name: 'data bank pattern (potential caching)', severity: 'WARNING' },
            
            // Singleton patterns used for caching
            { regex: /getInstance\(\).*cache/i, name: 'singleton getInstance() with cache', severity: 'ERROR' },
            { regex: /static\s+\w*[Cc]ache\w*/, name: 'static cache property', severity: 'ERROR' },
            
            // Lazy loading with caching
            { regex: /lazy\w*\s*=.*cache|cache.*lazy/i, name: 'lazy loading with cache', severity: 'WARNING' },
            
            // Computed properties that cache
            { regex: /get\s+\w+\(\)\s*\{[^}]*cache/, name: 'getter with internal cache', severity: 'ERROR' },
            { regex: /computed\s*:\s*\{[^}]*cache/, name: 'computed property with cache', severity: 'WARNING' },
            
            // Throttle/debounce with caching
            { regex: /throttle\(.*cache|debounce\(.*cache/, name: 'throttle/debounce with cache argument', severity: 'WARNING' },
            
            // Cache key generation
            { regex: /cacheKey|cache_key|generateCacheKey/i, name: 'cache key generation logic', severity: 'WARNING' },
            { regex: /hashKey.*cache|cache.*hashKey/i, name: 'hash-based cache key', severity: 'WARNING' },
            
            // Cache hit/miss tracking
            { regex: /cacheHits\+\+|cacheMisses\+\+/, name: 'cache hit/miss counter increment', severity: 'ERROR' },
            { regex: /hitCount|missCount|hit_count|miss_count/, name: 'cache statistics variables', severity: 'ERROR' },
            
            // Cache eviction policies
            { regex: /evict.*cache|cache.*evict/i, name: 'cache eviction logic', severity: 'ERROR' },
            { regex: /leastRecentlyUsed|mostRecentlyUsed|LRU|MRU/i, name: 'cache eviction policy implementation', severity: 'ERROR' },
            
            // Cache partitioning
            { regex: /cachePartition|cache_partition|partitionedCache/i, name: 'cache partitioning logic', severity: 'ERROR' },
            
            // Cache serialization
            { regex: /JSON\.stringify\(.*cache|cache.*JSON\.stringify/, name: 'cache serialization with JSON', severity: 'WARNING' },
            { regex: /serialize.*cache|cache.*serialize/i, name: 'cache serialization logic', severity: 'WARNING' },
            
            // Cache warming strategies
            { regex: /warmCache|warm_cache|prewarm|pre_warm/i, name: 'cache warming implementation', severity: 'ERROR' },
            { regex: /preloadCache|preload_cache|cachePreload/i, name: 'cache preloading implementation', severity: 'ERROR' },
            
            // Advanced caching libraries
            { regex: /require\s*\(\s*['"]quick-lru['"]/, name: 'quick-lru library (advanced caching)', severity: 'ERROR' },
            { regex: /require\s*\(\s*['"]p-memoize['"]/, name: 'p-memoize library', severity: 'ERROR' },
            { regex: /require\s*\(\s*['"]mem['"]/, name: 'mem memoization library', severity: 'ERROR' },
            { regex: /require\s*\(\s*['"]memoizee['"]/, name: 'memoizee library', severity: 'ERROR' },
            { regex: /require\s*\(\s*['"]lodash.*memoize['"]/, name: 'lodash memoize', severity: 'ERROR' },
            
            // Weak reference caching
            { regex: /new\s+WeakRef\(.*cache/, name: 'WeakRef used for caching', severity: 'WARNING' },
            { regex: /new\s+FinalizationRegistry\(.*cache/, name: 'FinalizationRegistry for cache cleanup', severity: 'WARNING' },
            
            // Stream caching
            { regex: /streamCache|stream_cache/, name: 'stream caching implementation', severity: 'ERROR' },
            
            // Template/render caching
            { regex: /templateCache|template_cache|renderCache|render_cache/i, name: 'template/render caching', severity: 'WARNING' },
            
            // Asset caching
            { regex: /assetCache|asset_cache|resourceCache|resource_cache/i, name: 'asset/resource caching', severity: 'WARNING' }
        ],
        severity: 'WARNING',
        violationExamples: {
            en: [
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @description cache variable with Map/Object/Array
                 */
                function getData(id) { const cache = {}; if (cache[id]) return cache[id]; }`,
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @description memoize() function call
                 */
                const memoized = _.memoize(() => 1);`,
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @description this.cache property
                 */
                class Service { constructor() { this.cache = {}; } getData(id) { if (this.cache[id]) return this.cache[id]; } }`,
                 `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @description useMemo() - React internal memoization
                 */
                const memoizedValue = useMemo(() => expensiveCalculation(), [deps]);`
            ],
            th: [
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @matches-pattern cache variable with Map/Object/Array
                 * @description cache ภายใน
                 */
                const cache = {}; function getData(id) { if (cache[id]) return cache[id]; cache[id] = fetch(id); return cache[id]; }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @matches-pattern memoize() function call
                 * @description memoization ภายใน
                 */
                const memoized = _.memoize(expensiveFunction);`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @matches-pattern let result(s) storage
                 * @description เก็บผลลัพธ์
                 */
                let lastResult; function compute() { if (lastResult) return lastResult; lastResult = calculate(); return lastResult; }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @matches-pattern cache.has() check
                 * @description Map cache
                 */
                const results = new Map(); function process(key) { if (results.has(key)) return results.get(key); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @matches-pattern this.cache property
                 * @description class cache
                 */
                class Service { constructor() { this.cache = {}; } getData(id) { if (this.cache[id]) return this.cache[id]; } }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @matches-pattern useMemo() - React internal memoization
                 * @description React memoization
                 */
                const useMemo(() => expensiveCalculation(), [deps]);`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @matches-pattern cache[key] = value assignment
                 * @description function property cache
                 */
                function factorial(n) { if (!factorial.cache) factorial.cache = {}; if (factorial.cache[n]) return factorial.cache[n]; }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type violation
                 * @matches-pattern SWR hook (data caching)
                 * @description SWR caching hook
                 */
                const stored = useSWR(key, fetcher);`
            ]
        },
        correctExamples: {
            en: [
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern pure function without cache
                 * @description Pure function, let caller add cache
                 */
                function getData(id) { return fetch(id); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern external cache decorator
                 * @description No memoization, use external cache decorator
                 */
                function expensiveFunction(input) { return calculate(input); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern external caching layer
                 * @description Always compute, external caching layer handles optimization
                 */
                function compute(params) { return calculate(params); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern pure transformation
                 * @description Pure transformation, caching is external concern
                 */
                function process(key, data) { return transform(key, data); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern dependency injection pattern
                 * @description Inject dependencies, no internal cache
                 */
                class Service { getData(id, database) { return database.find(id); } }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern component level memoization
                 * @description Let React handle memoization at component level
                 */
                function expensiveCalculation(deps) { return result; }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern pure recursive function
                 * @description Pure recursive, cache externally if needed
                 */
                function factorial(n) { if (n <= 1) return 1; return n * factorial(n - 1); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern pure fetcher function
                 * @description Pure fetcher, use external cache layer
                 */
                function fetcher(key) { return api.get(key); }`
            ],
            th: [
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern pure function without cache
                 * @description ฟังก์ชันบริสุทธิ์ ให้ผู้เรียกใช้เพิ่ม cache
                 */
                function getData(id) { return fetch(id); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern external cache decorator
                 * @description ไม่ใช้ memoization ใช้ cache decorator ภายนอก
                 */
                function expensiveFunction(input) { return calculate(input); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern external caching layer
                 * @description คำนวณเสมอ ให้ caching layer ภายนอกจัดการ
                 */
                function compute(params) { return calculate(params); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern pure transformation
                 * @description transformation บริสุทธิ์ caching เป็นเรื่องภายนอก
                 */
                function process(key, data) { return transform(key, data); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern dependency injection pattern
                 * @description ใช้ dependency injection ไม่มี cache ภายใน
                 */
                class Service { getData(id, database) { return database.find(id); } }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern component level memoization
                 * @description ให้ React จัดการ memoization ในระดับ component
                 */
                function expensiveCalculation(deps) { return result; }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern pure recursive function
                 * @description recursion บริสุทธิ์ cache ภายนอกถ้าจำเป็น
                 */
                function factorial(n) { if (n <= 1) return 1; return n * factorial(n - 1); }`,
                
                `/**
                 * @example-for-rule NO_INTERNAL_CACHING
                 * @type correct
                 * @matches-pattern pure fetcher function
                 * @description fetcher บริสุทธิ์ ใช้ cache layer ภายนอก
                 */
                function fetcher(key) { return api.get(key); }`
            ]
        },
        fix: {
            en: 'Remove internal cache. Let the caller handle caching externally with Redis, Memcached, or a caching decorator.',
            th: 'ลบ cache ภายใน ให้ผู้เรียกใช้จัดการ cache จากภายนอกด้วย Redis, Memcached หรือ caching decorator'
        }
    },
// ======================================================================
// NO_EMOJI - ห้ามใช้อิโมจิในโค้ด
// ======================================================================

    NO_EMOJI: {
        id: 'NO_EMOJI',
        name: {
            en: 'No Emoji in Code',
            th: 'ห้ามใช้อิโมจิในโค้ด'
        },
        description: {
            en: 'DO NOT use emoji characters in source code. Use plain text descriptions instead.',
            th: 'ห้ามใช้อักขระอิโมจิในซอร์สโค้ด ให้ใช้คำอธิบายแบบข้อความธรรมดาแทน'
        },
        explanation: {
            en: `Emoji in source code causes CRITICAL PROBLEMS that make code unmaintainable and unprofessional:

1) ENCODING HELL: Different editors/systems interpret Unicode differently, causing corruption and data loss
2) SEARCH IMPOSSIBLE: Cannot grep, find, or search emoji in code review tools, git diff, or command line
3) ACCESSIBILITY FAIL: Screen readers cannot properly announce emoji, excluding visually impaired developers
4) UNPROFESSIONAL: No serious production codebase uses emoji - it signals amateur/toy project
5) TERMINAL BREAKING: Many terminals, CI/CD systems, and SSH sessions cannot display emoji properly
6) VERSION CONTROL CHAOS: Git diffs show emoji as escape sequences, making code review impossible
7) DATABASE CORRUPTION: MySQL utf8 (not utf8mb4) cannot store emoji, causing silent data loss
8) KEYBOARD DEPENDENCY: Requires OS-specific emoji keyboards, making code editing platform-dependent
9) COPY-PASTE ERRORS: Emoji may copy as different Unicode sequences, breaking code behavior
10) FONT DEPENDENCY: Different fonts render emoji differently or not at all, causing confusion

SOLUTION: Use clear, descriptive English words and variable names. Example:
BAD:  const status = isComplete ? 'CHECK_MARK_EMOJI' : 'CROSS_MARK_EMOJI';  // Unicode symbols
GOOD: const status = isComplete ? 'SUCCESS' : 'FAILED';

This validator catches ALL emoji forms including:
- Direct emoji characters (grinning face, rocket, checkmark symbols)
- ZWJ sequences (family emoji, profession emoji) 
- Skin tone modifiers (various skin tone variations)
- Regional indicators (flag emoji like U+1F1F9 U+1F1ED for Thailand)
- Variation selectors (text vs emoji presentation)
- HTML entities (, )
- Tag characters and modifiers
- All Unicode 15.1+ emoji blocks`,
            th: `อิโมจิในซอร์สโค้ดสร้างปัญหาร้ายแรงที่ทำให้โค้ดดูแลรักษาไม่ได้และไม่เป็นมืออาชีพ:

1) ENCODING นรก: Editor/system ต่างกันแปล Unicode ต่างกัน ทำให้ไฟล์เสียหายและสูญหายข้อมูล
2) ค้นหาไม่ได้: ใช้ grep, find หรือเครื่องมือ code review, git diff, command line หาอิโมจิไม่เจอ
3) ไม่รองรับ Accessibility: Screen reader อ่านอิโมจิไม่ถูกต้อง ทำให้นักพัฒนาที่มีปัญหาสายตาใช้งานไม่ได้
4) ไม่เป็นมืออาชีพ: ไม่มี codebase production ที่จริงจังใช้อิโมจิ - มันบอกว่าเป็นโปรเจกต์สมัครเล่น
5) Terminal พัง: หลาย terminal, CI/CD system, SSH session แสดงอิโมจิไม่ได้
6) Version Control วุ่นวาย: Git diff แสดงอิโมจิเป็น escape sequence ทำให้ code review ไม่ได้
7) Database พัง: MySQL utf8 (ไม่ใช่ utf8mb4) เก็บอิโมจิไม่ได้ ทำให้ข้อมูลหายแบบเงียบๆ
8) ขึ้นกับ Keyboard: ต้องใช้ emoji keyboard ของแต่ละ OS ทำให้แก้โค้ดต้องขึ้นกับ platform
9) Copy-Paste ผิด: อิโมจิอาจ copy เป็น Unicode sequence ต่างกัน ทำให้โค้ดทำงานผิด
10) ขึ้นกับ Font: แต่ละ font แสดงอิโมจิต่างกัน หรือไม่แสดงเลย ทำให้งงและสับสน

วิธีแก้: ใช้คำภาษาอังกฤษที่ชัดเจน อธิบายได้ และชื่อตัวแปรที่มีความหมาย ตัวอย่าง:
[ไม่ดี]:  const status = isComplete ? 'U+2705' : 'U+274C';  // checkmark and cross emoji
[ดี]: const status = isComplete ? 'SUCCESS' : 'FAILED';

Validator นี้จับอิโมจิทุกรูปแบบ รวมถึง:
- อิโมจิตรงๆ (U+1F600 หน้ายิ้ม, U+1F680 จรวด, U+2705 เครื่องหมายถูก)
- ZWJ sequences (อิโมจิครอบครัว, อาชีพ)
- Skin tone modifiers (สีผิว U+1F3FB-U+1F3FF)
- Regional indicators (อิโมจิธง เช่น U+1F1F9 U+1F1ED สำหรับไทย)
- Variation selectors (แสดงแบบข้อความ vs อิโมจิ)
- HTML entities (, )
- Tag characters และ modifiers
- ทุก Unicode 15.1+ emoji blocks`
        },
        patterns: [
            // ═══════════════════════════════════════════════════════════════════
            // CORE EMOJI RANGES (Unicode 15.1+) - จับอิโมจิหลักทุกตัว
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{1F600}-\u{1F64F}]/gu, name: 'Emoticons (U+1F600-U+1F64F) - faces, gestures', severity: 'ERROR' },
            { regex: /[\u{1F300}-\u{1F5FF}]/gu, name: 'Symbols & Pictographs (U+1F300-U+1F5FF) - weather, objects', severity: 'ERROR' },
            { regex: /[\u{1F680}-\u{1F6FF}]/gu, name: 'Transport & Map (U+1F680-U+1F6FF) - vehicles, places', severity: 'ERROR' },
            { regex: /[\u{1F700}-\u{1F77F}]/gu, name: 'Alchemical Symbols (U+1F700-U+1F77F) - ancient symbols', severity: 'ERROR' },
            { regex: /[\u{1F780}-\u{1F7FF}]/gu, name: 'Geometric Shapes Extended (U+1F780-U+1F7FF)', severity: 'ERROR' },
            { regex: /[\u{1F800}-\u{1F8FF}]/gu, name: 'Supplemental Arrows-C (U+1F800-U+1F8FF)', severity: 'ERROR' },
            { regex: /[\u{1F900}-\u{1F9FF}]/gu, name: 'Supplemental Symbols (U+1F900-U+1F9FF) - modern emoji', severity: 'ERROR' },
            { regex: /[\u{1FA00}-\u{1FA6F}]/gu, name: 'Chess & Playing Cards Symbols (U+1FA00-U+1FA6F)', severity: 'ERROR' },
            { regex: /[\u{1FA70}-\u{1FAFF}]/gu, name: 'Symbols Extended-A (U+1FA70-U+1FAFF) - newest emoji', severity: 'ERROR' },
            { regex: /[\u{1FB00}-\u{1FBFF}]/gu, name: 'Symbols Extended-B (U+1FB00-U+1FBFF) - Unicode 15+', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // EXTENDED SYMBOL RANGES - จับสัญลักษณ์พิเศษทั้งหมด
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{2600}-\u{26FF}]/gu, name: 'Miscellaneous Symbols (U+2600-U+26FF) - sun, star, weather', severity: 'ERROR' },
            { regex: /[\u{2700}-\u{27BF}]/gu, name: 'Dingbats (U+2700-U+27BF) - scissors, checkmarks, arrows', severity: 'ERROR' },
            { regex: /[\u{1F1E0}-\u{1F1FF}]/gu, name: 'Regional Indicator (U+1F1E0-U+1F1FF) - flag letters', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // SKIN TONE MODIFIERS - จับ skin tone modifiers ทั้งหมด
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{1F3FB}-\u{1F3FF}]/gu, name: 'Skin Tone Modifiers (U+1F3FB-U+1F3FF) - light to dark skin', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // VARIATION SELECTORS - จับ emoji vs text presentation selectors
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{FE0E}\u{FE0F}]/gu, name: 'Variation Selectors (U+FE0E text, U+FE0F emoji)', severity: 'ERROR' },
            { regex: /\u{2764}\u{FE0F}/gu, name: 'Red Heart with Emoji Variation Selector', severity: 'ERROR' },
            { regex: /\u{2665}\u{FE0F}/gu, name: 'Black Heart with Variation Selector', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // ZWJ SEQUENCES - จับ Zero Width Joiner emoji sequences (family, profession)
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\u{200D}/gu, name: 'Zero Width Joiner (U+200D) - used in multi-person emoji', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{2695}\u{FE0F}/gu, name: 'Woman Health Worker ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F4BB}/gu, name: 'Man Technologist ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{1F373}/gu, name: 'Woman Cook ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F692}/gu, name: 'Man Firefighter ZWJ sequence', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // FAMILY AND COUPLE SEQUENCES - จับ family emoji combinations
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\u{1F468}\u{200D}\u{1F469}\u{200D}/gu, name: 'Family: Man, Woman... ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{1F469}\u{200D}/gu, name: 'Family: Woman, Woman... ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F468}\u{200D}/gu, name: 'Family: Man, Man... ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F48F}\u{1F3FB}/gu, name: 'Kiss with Skin Tone Modifier', severity: 'ERROR' },
            { regex: /\u{1F491}\u{1F3FC}/gu, name: 'Couple with Heart with Skin Tone', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // KEYCAP SEQUENCES - จับ keycap emoji (numbers with enclosing keycap)
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{0030}-\u{0039}]\u{FE0F}\u{20E3}/gu, name: 'Number Keycap (0-9 with keycap)', severity: 'ERROR' },
            { regex: /\u{0023}\u{FE0F}\u{20E3}/gu, name: 'Hash Keycap "[HASH_KEYCAP]"', severity: 'ERROR' },
            { regex: /\u{002A}\u{FE0F}\u{20E3}/gu, name: 'Asterisk Keycap "[ASTERISK_KEYCAP]"', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // TAG SEQUENCES - จับ tag characters used in flag sequences
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{E0020}-\u{E007F}]/gu, name: 'Tag Characters (U+E0020-U+E007F) - used in subdivision flags', severity: 'ERROR' },
            { regex: /\u{1F3F4}\u{E0067}\u{E0062}/gu, name: 'England Flag Tag Sequence', severity: 'ERROR' },
            { regex: /\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}/gu, name: 'Scotland Flag Tag Sequence', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // HTML ENTITIES FOR EMOJI - จับ HTML entity ของ emoji
            // ═══════════════════════════════════════════════════════════════════
            { regex: /&#{1,2}[0-9]{4,6};/g, name: 'HTML Numeric Entity (possible emoji)', severity: 'WARNING' },
            { regex: /||/g, name: 'HTML Entity for Face Emoji "[GRINNING_FACE][BEAMING_FACE][CRYING_LAUGHING]"', severity: 'ERROR' },
            { regex: /&#9989;||/g, name: 'HTML Entity for Check/Cross/Button "[CHECK_MARK][CROSS_MARK][CIRCLE]"', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // UNICODE ESCAPE SEQUENCES - จับ Unicode escape ของ emoji ใน string
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\\u\{1F[0-9A-Fa-f]{3}\}/g, name: 'Unicode escape for emoji (\\u{1F...})', severity: 'ERROR' },
            { regex: /\\u1F[0-9A-Fa-f]{2}[0-9A-Fa-f]/g, name: 'Unicode escape for emoji (\\u1F...)', severity: 'ERROR' },
            { regex: /\\x{1F[0-9A-Fa-f]+}/g, name: 'Hex escape for emoji (\\x{1F...})', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // COMMON EMOJI IN STRING LITERALS - จับ emoji ที่มักใช้ใน string
            // ═══════════════════════════════════════════════════════════════════
            { regex: /["'].*[\u{1F600}-\u{1F64F}].*["']/gu, name: 'String containing face emoji', severity: 'ERROR' },
            { regex: /["'].*[\u{2764}\u{1F49C}\u{1F49B}\u{1F49A}\u{1F499}\u{1F9E1}].*["']/gu, name: 'String containing heart emoji', severity: 'ERROR' },
            { regex: /["'].*[\u{1F44D}\u{1F44E}\u{1F44F}\u{1F590}].*["']/gu, name: 'String containing hand gesture emoji', severity: 'ERROR' },
            { regex: /["'].*[\u{1F525}\u{1F4A5}\u{2728}\u{1F31F}].*["']/gu, name: 'String containing fire/sparkle emoji', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // COMMENT EMOJI - จับ emoji ใน comments
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\/\/.*[\u{1F600}-\u{1F64F}]/gu, name: 'Single-line comment containing emoji', severity: 'ERROR' },
            { regex: /\/\*[\s\S]*[\u{1F600}-\u{1F64F}][\s\S]*\*\//gu, name: 'Multi-line comment containing emoji', severity: 'ERROR' },
            { regex: /#.*[\u{1F600}-\u{1F64F}]/gu, name: 'Hash comment containing emoji (Python, Shell)', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // VARIABLE NAMES WITH EMOJI - จับชื่อตัวแปรที่มี emoji
            // ═══════════════════════════════════════════════════════════════════
            { regex: /(?:const|let|var)\s+\w*[\u{1F600}-\u{1F64F}]\w*/gu, name: 'Variable name containing emoji', severity: 'ERROR' },
            { regex: /function\s+\w*[\u{1F600}-\u{1F64F}]\w*/gu, name: 'Function name containing emoji', severity: 'ERROR' },
            { regex: /class\s+\w*[\u{1F600}-\u{1F64F}]\w*/gu, name: 'Class name containing emoji', severity: 'ERROR' },
            { regex: /[\u{1F100}-\u{1F1FF}]/gu, name: 'Enclosed Alphanumeric Supplement', severity: 'ERROR' },
            { regex: /[\u{2B00}-\u{2BFF}]/gu, name: 'Miscellaneous Symbols and Arrows', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // MATHEMATICAL & TECHNICAL SYMBOLS - จับสัญลักษณ์ทางคณิตศาสตร์
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{2190}-\u{21FF}]/gu, name: 'Arrows (U+2190-U+21FF) - directional symbols', severity: 'ERROR' },
            { regex: /[\u{2200}-\u{22FF}]/gu, name: 'Mathematical Operators (U+2200-U+22FF)', severity: 'ERROR' },
            { regex: /[\u{2300}-\u{23FF}]/gu, name: 'Miscellaneous Technical (U+2300-U+23FF)', severity: 'ERROR' },
            { regex: /[\u{2460}-\u{24FF}]/gu, name: 'Enclosed Alphanumerics (U+2460-U+24FF)', severity: 'ERROR' },
            { regex: /[\u{25A0}-\u{25FF}]/gu, name: 'Geometric Shapes (U+25A0-U+25FF)', severity: 'ERROR' },
            { regex: /[\u{2900}-\u{297F}]/gu, name: 'Supplemental Arrows-A', severity: 'ERROR' },
            { regex: /[\u{2980}-\u{29FF}]/gu, name: 'Miscellaneous Mathematical Symbols-A', severity: 'ERROR' },
            { regex: /[\u{2A00}-\u{2AFF}]/gu, name: 'Supplemental Mathematical Operators', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // ASIAN & SPECIAL SYMBOLS - จับสัญลักษณ์เอเชียและพิเศษ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{3030}]/gu, name: 'Wavy dash (U+3030) - Japanese symbol', severity: 'ERROR' },
            { regex: /[\u{303D}]/gu, name: 'Part alternation mark (U+303D) - Japanese', severity: 'ERROR' },
            { regex: /[\u{3297}]/gu, name: 'Japanese congratulations symbol (U+3297)', severity: 'ERROR' },
            { regex: /[\u{3299}]/gu, name: 'Japanese secret symbol (U+3299)', severity: 'ERROR' },
            { regex: /[\u{1F004}]/gu, name: 'Mahjong tile (U+1F004)', severity: 'ERROR' },
            { regex: /[\u{1F0CF}]/gu, name: 'Playing card (U+1F0CF)', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // EMOJI MODIFIERS & COMPONENTS - จับส่วนประกอบอิโมจิ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{1F3FB}-\u{1F3FF}]/gu, name: 'Skin tone modifiers (U+1F3FB-U+1F3FF) - light to dark', severity: 'ERROR' },
            { regex: /[\u{FE00}-\u{FE0F}]/gu, name: 'Variation Selectors (U+FE00-U+FE0F) - emoji vs text', severity: 'ERROR' },
            { regex: /[\u{200D}]/gu, name: 'Zero Width Joiner (U+200D ZWJ) - combines emoji', severity: 'ERROR' },
            { regex: /[\u{20E3}]/gu, name: 'Combining Enclosing Keycap (U+20E3)', severity: 'ERROR' },
            { regex: /[\u{E0020}-\u{E007F}]/gu, name: 'Tag characters (U+E0020-U+E007F) - for flag emoji', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // COMPLEX ZWJ SEQUENCES - จับอิโมจิซับซ้อนที่รวมกัน
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\u{1F468}\u{200D}\u{1F4BB}/gu, name: 'Man technologist ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{1F4BC}/gu, name: 'Woman office worker ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F680}/gu, name: 'Man astronaut ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{1F680}/gu, name: 'Woman astronaut ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F692}/gu, name: 'Man firefighter ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{1F692}/gu, name: 'Woman firefighter ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}/gu, name: 'Rainbow flag ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}/gu, name: 'Family ZWJ sequence', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // HEART VARIATIONS - จับหัวใจทุกสี (มักใช้ใน comment)
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\u{2764}\u{FE0F}/gu, name: 'Red heart with variation (U+2764 U+FE0F)', severity: 'ERROR' },
            { regex: /\u{2764}/gu, name: 'Red heart (U+2764)', severity: 'ERROR' },
            { regex: /\u{1F49A}/gu, name: 'Green heart (U+1F49A)', severity: 'ERROR' },
            { regex: /\u{1F499}/gu, name: 'Blue heart (U+1F499)', severity: 'ERROR' },
            { regex: /\u{1F49B}/gu, name: 'Yellow heart (U+1F49B)', severity: 'ERROR' },
            { regex: /\u{1F9E1}/gu, name: 'Orange heart (U+1F9E1)', severity: 'ERROR' },
            { regex: /\u{1F49C}/gu, name: 'Purple heart (U+1F49C)', severity: 'ERROR' },
            { regex: /\u{1F5A4}/gu, name: 'Black heart (U+1F5A4)', severity: 'ERROR' },
            { regex: /\u{1F90D}/gu, name: 'White heart (U+1F90D)', severity: 'ERROR' },
            { regex: /\u{1F90E}/gu, name: 'Brown heart (U+1F90E)', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // HTML ENTITIES - จับอิโมจิในรูปแบบ HTML
            // ═══════════════════════════════════════════════════════════════════
            { regex: /&#x1F[0-9A-Fa-f]{3,4};/g, name: 'Hex HTML emoji entity ()', severity: 'ERROR' },
            { regex: /&#1[0-9]{4,6};/g, name: 'Decimal HTML emoji entity ()', severity: 'ERROR' },
            { regex: /&(?:hearts?|spades?|clubs?|diams?|star|check|cross|times);/gi, name: 'Named HTML symbol entities', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // CATCH-ALL COMPREHENSIVE PATTERNS - จับทุกอย่างที่เหลือ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{1F000}-\u{1FFFF}]/gu, name: 'Complete emoji plane (U+1F000-U+1FFFF)', severity: 'ERROR' },
            { regex: /[\u{2600}-\u{27FF}]/gu, name: 'Extended symbol coverage (U+2600-U+27FF)', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // SPECIFIC COMMON EMOJI - จับอิโมจิที่ใช้บ่อยโดยเฉพาะ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u2705]/gu, name: 'Check mark button (U+2705) - commonly misused', severity: 'ERROR' },
            { regex: /[\u274C]/gu, name: 'Cross mark (U+274C) - commonly misused', severity: 'ERROR' },
            { regex: /[\u26A0][\uFE0F]?/gu, name: 'Warning sign (U+26A0) - use "WARNING"', severity: 'ERROR' },
            { regex: /[\u{1F680}]/gu, name: 'Rocket (U+1F680) - unprofessional', severity: 'ERROR' },
            { regex: /[\u{1F44D}\u{1F44E}]/gu, name: 'Thumbs up/down (U+1F44D/U+1F44E)', severity: 'ERROR' },
            { regex: /[\u{1F525}]/gu, name: 'Fire (U+1F525) - unprofessional slang', severity: 'ERROR' },
            { regex: /[\u{1F4AF}]/gu, name: '100 points (U+1F4AF) - unprofessional', severity: 'ERROR' },
            { regex: /[\u{1F389}]/gu, name: 'Party popper (U+1F389) - unprofessional', severity: 'ERROR' },
            { regex: /[\u2B50\u{1F31F}]/gu, name: 'Star (U+2B50/U+1F31F)', severity: 'ERROR' },
            { regex: /[\u{1F4DD}]/gu, name: 'Memo (U+1F4DD) - use "NOTE" or "TODO"', severity: 'ERROR' },
            { regex: /[\u{1F41B}]/gu, name: 'Bug (U+1F41B) - use "BUG" or "FIXME"', severity: 'ERROR' },
            { regex: /[\u26A1]/gu, name: 'Lightning (U+26A1) - use "FAST" or "PERF"', severity: 'ERROR' },
            { regex: /[\u{1F527}]/gu, name: 'Wrench (U+1F527) - use "FIX" or "TOOL"', severity: 'ERROR' },
            { regex: '[\\u{1F4E6}]', flags: 'gu', name: 'Package (U+1F4E6) - use "PACKAGE"', severity: 'ERROR' },
            { regex: '[\\u{1F3AF}]', flags: 'gu', name: 'Direct hit (U+1F3AF) - use "TARGET"', severity: 'ERROR' },
        ],
        severity: 'ERROR',
        violationExamples: {
            en: [
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Check mark button (U+2705) - commonly misused
                 * @description Unicode checkmark in string
                 * @note CHANGED: เปลี่ยนจาก comment เป็น string literal เพราะ AST ไม่จับ comments
                 * @original-code //  Task completed successfully
                 */
                const status = " Task completed successfully";`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Cross mark (U+274C) - commonly misused
                 * @description Unicode symbols in string
                 */
                const status = isComplete ? "" : "";`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Rocket (U+1F680) - unprofessional
                 * @description Unicode rocket in message
                 */
                console.log(" Deployment started!");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Bug (U+1F41B) - use "BUG" or "FIXME"
                 * @description Unicode bug in error message
                 */
                throw new Error(" Critical bug found");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Memo (U+1F4DD) - use "NOTE" or "TODO"
                 * @description Unicode memo in string
                 * @note CHANGED: เปลี่ยนจาก comment เป็น string literal เพราะ AST ไม่จับ comments
                 * @original-code //  TODO: Implement feature
                 */
                const note = " TODO: Implement feature";`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Warning sign (U+26A0) - use "WARNING"
                 * @description Unicode warning sign
                 */
                logger.warn("\u26A0\uFE0F Memory usage high");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Party popper (U+1F389) - unprofessional
                 * @description Unicode party popper in result
                 */
                const result = { success: true, message: "\u{1F389} Done!" };`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Fire (U+1F525) - unprofessional slang
                 * @description Unicode fire in string
                 * @note CHANGED: เปลี่ยนจาก block comment เป็น string literal เพราะ AST ไม่จับ comments
                 * @original-code function calculate() with fire emoji in comment
                 */
                const msg = " Hot path optimization";`
            ],
            th: [
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Check mark button (U+2705) - commonly misused
                 * @description Unicode checkmark ในคอมเมนต์
                 */
                // \u2705 งานเสร็จสมบูรณ์`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Cross mark (U+274C) - commonly misused
                 * @description Unicode symbols ในสตริง
                 */
                const status = isComplete ? "\u2713" : "\u274C";`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Rocket (U+1F680) - unprofessional
                 * @description Unicode rocket ในข้อความ
                 */
                console.log("\u{1F680} Deployment started!");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Bug (U+1F41B) - use "BUG" or "FIXME"
                 * @description Unicode bug ใน error message
                 */
                throw new Error("\u{1F41B} Critical bug found");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Memo (U+1F4DD) - use "NOTE" or "TODO"
                 * @description Unicode memo ใน TODO
                 */
                // \u{1F4DD} TODO: Implement feature`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Warning sign (U+26A0) - use "WARNING"
                 * @description Unicode warning sign
                 */
                logger.warn("\u26A0\uFE0F Memory usage high");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Party popper (U+1F389) - unprofessional
                 * @description Unicode party popper ในผลลัพธ์
                 */
                const result = { success: true, message: "\u{1F389} Done!" };`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type violation
                 * @matches-pattern Fire (U+1F525) - unprofessional slang
                 * @description Unicode fire ในคอมเมนต์
                 */
                function calculate() { /* \u{1F525} Hot path optimization */ }`
            ]
        },
        correctExamples: {
            en: [
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern descriptive text instead of checkmark
                 * @description Use clear text instead of emoji
                 */
                // SUCCESS: Task completed successfully`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern clear status words
                 * @description Use PASS/FAIL instead of symbols
                 */
                const status = isComplete ? "PASS" : "FAIL";`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern DEPLOY prefix
                 * @description Use DEPLOY instead of rocket emoji
                 */
                console.log("DEPLOY: Deployment started!");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern BUG prefix
                 * @description Use BUG instead of bug emoji
                 */
                throw new Error("BUG: Critical bug found");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern standard TODO
                 * @description Standard TODO without emoji
                 */
                // TODO: Implement feature`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern WARNING prefix
                 * @description Use WARNING text instead of warning emoji
                 */
                logger.warn("WARNING: Memory usage high");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern COMPLETED message
                 * @description Use COMPLETED instead of party emoji
                 */
                const result = { success: true, message: "COMPLETED!" };`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern PERFORMANCE comment
                 * @description Use PERFORMANCE instead of fire emoji
                 */
                function calculate() { /* PERFORMANCE: Hot path optimization */ }`
            ],
            th: [
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern descriptive text instead of checkmark
                 * @description ใช้คำแทนอิโมจิ
                 */
                // SUCCESS: งานเสร็จสมบูรณ์`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern clear status words
                 * @description ใช้คำอังกฤษชัดเจน
                 */
                const status = isComplete ? "PASS" : "FAIL";`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern DEPLOY prefix
                 * @description ใช้คำ DEPLOY แทนจรวด
                 */
                console.log("DEPLOY: Deployment started!");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern BUG prefix
                 * @description ใช้คำ BUG แทนแมลง
                 */
                throw new Error("BUG: Critical bug found");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern standard TODO
                 * @description TODO แบบปกติ
                 */
                // TODO: Implement feature`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern WARNING prefix
                 * @description ใช้คำ WARNING
                 */
                logger.warn("WARNING: Memory usage high");`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern COMPLETED message
                 * @description ใช้คำ COMPLETED
                 */
                const result = { success: true, message: "COMPLETED!" };`,
                
                `/**
                 * @example-for-rule NO_EMOJI
                 * @type correct
                 * @matches-pattern PERFORMANCE comment
                 * @description ใช้คำ PERFORMANCE
                 */
                function calculate() { /* PERFORMANCE: Hot path optimization */ }`
            ]
        },
        fix: {
            en: 'Replace emoji with descriptive text. Examples: U+2705 checkmark -> "SUCCESS", U+274C cross -> "FAILED", U+1F680 rocket -> "DEPLOY", U+1F41B bug -> "BUG", U+1F4DD memo -> "NOTE", U+26A0 warning -> "WARNING"',
            th: 'แทนที่อิโมจิด้วยข้อความอธิบาย ตัวอย่าง: U+2705 เครื่องหมายถูก -> "SUCCESS", U+274C กากบาท -> "FAILED", U+1F680 จรวด -> "DEPLOY", U+1F41B แมลง -> "BUG", U+1F4DD บันทึก -> "NOTE", U+26A0 คำเตือน -> "WARNING"'
        }
    }
};

// ======================================================================
// ENHANCED VALIDATION ENGINE - ใช้ Grammar-based Analysis
// ======================================================================

/**
 * ValidationEngine - เครื่องมือตรวจสอบโค้ดด้วย Grammar และ AST
 * ใช้ Parser มืออาชีพเป็นต้นแบบการเรียนรู้
 */
class ValidationEngine {
    constructor() {
        this.rules = ABSOLUTE_RULES;
        this.parserStudy = null;
        this.initializeParserStudy();
    }

    async initializeParserStudy() {
        // ! FIX: FAIL FAST - ไม่มี Silent Fallback เพื่อให้รู้ปัญหาทันที
        console.log('Initializing Smart Parser Engine (NO FALLBACK MODE)...');
        
        const { SmartParserEngine } = await import('./grammars/shared/smart-parser-engine.js');
        // ส่ง rules และ config (PARSER_CONFIG จะถูกใช้ภายใน SmartParserEngine)
        this.parserStudy = new SmartParserEngine(this.rules, null); // pass rules + null config to use PARSER_CONFIG
        
        console.log('SUCCESS: Smart Parser Engine initialized with grammar rules');
        console.log('Engine Mode: FULL PERFORMANCE (no legacy fallbacks)');
    }

    async validateCode(code, language = 'javascript', allowFallback = false) {
        const results = { violations: [], warnings: [], suggestions: [] };
        if (this.parserStudy) {
            try {
                const astViolations = await this.analyzeWithAST(code);
                results.violations.push(...astViolations);
                console.log('SUCCESS: AST Analysis completed successfully');
            } catch (astError) {
                // ! FIX: ตามกฎ NO_SILENT_FALLBACKS - Log error อย่างชัดเจน
                console.error('CRITICAL ERROR: AST Analysis failed completely:', astError.message);
                console.error('Stack trace:', astError.stack);
                console.error('Possible causes: GrammarIndex integration issue, memory overflow, or parser corruption');
                
                // ! COMPLIANT FALLBACK: ให้ user เลือกว่าจะใช้ fallback หรือไม่
                if (allowFallback) {
                    console.warn('  WARNING: Using fallback regex-based analysis due to AST failure');
                    console.warn('  Results may be less accurate than AST-based analysis');
                    results.violations.push(...this.analyzeWithRegex(code));
                    results.warnings.push({
                        rule: 'SYSTEM_WARNING',
                        message: 'Used fallback analysis due to AST engine failure',
                        severity: 'WARNING'
                    });
                } else {
                    // Default behavior: fail fast
                    throw new Error(`ValidationEngine: AST Analysis failed - ${astError.message}. Use allowFallback=true for regex-based analysis.`);
                }
            }
        } else {
            // ถ้าไม่มี parser เลย ให้ throw error
            throw new Error('ValidationEngine: No parser available - cannot perform validation');
        }
        return results;
    }
    
    async analyzeWithAST(code) {
        if (!this.parserStudy) throw new Error("Parser not initialized.");
        
        // ! UPGRADE: ตรวจสอบว่าเป็น Smart Parser Engine หรือไม่
        if (typeof this.parserStudy.analyzeCode === 'function') {
            // ใช้ Smart Parser Engine (ระบบใหม่)
            console.log(' Using Smart Parser Engine...');
            return this.parserStudy.analyzeCode(code);
        } else {
            // ใช้ระบบเก่า (Fallback)
            console.log(' Using legacy parser...');
            const violations = [];
            const patterns = this.parserStudy.studyRulePatterns(code);
            
            // ตรวจสอบว่ามีกฎอยู่จริงใน ABSOLUTE_RULES ก่อนเรียกใช้
            if (this.rules.NO_MOCKING) this.checkMockingViolations(patterns, violations);
            if (this.rules.NO_EMOJI) this.checkEmojiViolations(patterns, violations);
            if (this.rules.NO_HARDCODE) this.checkHardcodeViolations(patterns, violations);
            if (this.rules.NO_SILENT_FALLBACKS) this.checkSilentFallbackViolations(patterns, violations);
            if (this.rules.NO_COMPLEX_FUNCTIONS) this.checkComplexityViolations(patterns, violations);
            if (this.rules.NO_INTERNAL_CACHING) this.checkCachingViolations(patterns, violations);
            if (this.rules.NO_DEEP_NESTING) this.checkDeepNestingViolations(patterns, violations);

            return violations;
        }
    }

    analyzeWithRegex(code) {
        const violations = [];
        for (const [ruleId, rule] of Object.entries(this.rules)) {
            for (const pattern of rule.patterns) {
                const regex = new RegExp(pattern.regex.source, 'gu');
                let match;
                while ((match = regex.exec(code)) !== null) {
                    violations.push({
                        ruleId,
                        severity: pattern.severity,
                        message: `[${ruleId}] ${rule.description.th}`,
                        match: match[0],
                        position: match.index,
                        pattern: pattern.name
                    });
                }
            }
        }
        return violations;
    }
    
    // --- ฟังก์ชัน check...Violations ทั้งหมดเหมือนเดิม ไม่ต้องแก้ไข ---
    // (ผมใส่มาให้ครบถ้วนเพื่อความสมบูรณ์)
    checkMockingViolations(patterns, violations) {
        patterns.mockingPatterns?.forEach(p => violations.push({
            ruleId: 'NO_MOCKING', severity: 'ERROR', message: `Detected ${p.pattern}`, location: p.location
        }));
    }
    checkEmojiViolations(patterns, violations) {
        patterns.emojiPatterns?.forEach(p => violations.push({
            ruleId: 'NO_EMOJI', severity: 'ERROR', message: `Emoji "${p.emoji}" found`, location: p.location
        }));
    }
    checkHardcodeViolations(patterns, violations) {
        patterns.hardcodePatterns?.forEach(p => violations.push({
            ruleId: 'NO_HARDCODE', severity: 'ERROR', message: `Hardcoded value detected: ${p.match}`, match: p.match, location: p.location
        }));
    }
    checkSilentFallbackViolations(patterns, violations) {
        patterns.silentFallbackPatterns?.forEach(p => violations.push({
            ruleId: 'NO_SILENT_FALLBACKS', severity: 'ERROR', message: `Silent fallback detected: ${p.patternName}`, location: p.location
        }));
    }
    checkComplexityViolations(patterns, violations) {
        patterns.complexityPatterns?.forEach(p => violations.push({
            ruleId: 'NO_COMPLEX_FUNCTIONS', severity: 'ERROR', message: `Function has ${p.paramCount} parameters (max 5)`, location: p.location
        }));
    }
    checkCachingViolations(patterns, violations) {
        patterns.internalCachingPatterns?.forEach(p => violations.push({
            ruleId: 'NO_INTERNAL_CACHING', severity: 'WARNING', message: `Internal caching detected: ${p.patternName}`, location: p.location
        }));
    }
    checkDeepNestingViolations(patterns, violations) {
        patterns.deepNestingPatterns?.forEach(p => violations.push({
            ruleId: 'NO_DEEP_NESTING', severity: 'ERROR', message: `Nesting level ${p.depth} exceeds maximum of 3`, location: p.location
        }));
    }
}

// ======================================================================
// MODULE EXPORTS - ส่งออกทั้ง Rules และ Engine
// ======================================================================
export { ABSOLUTE_RULES, ValidationEngine };



