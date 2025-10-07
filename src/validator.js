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
            en: `ABSOLUTE PHILOSOPHY: "MOCKING IS EVIDENCE OF ARCHITECTURAL FAILURE"
            
This rule doesn't exist to oppose "Unit Testing" - it exists to REDEFINE what a "Unit" actually means. In complex software systems, a meaningful business "Unit" is NOT a single isolated function, but rather a "Component that delivers complete behavior."

Real testing means testing the "CONTRACT" of that Component: when I send Input A, I expect Output or Side Effect B ALWAYS, regardless of internal implementation details.

Mocking is BETRAYAL of that contract. It's us interfering with internal mechanisms and forcing them to behave according to our assumptions, which completely destroys the purpose of testing. The urge to mock is the LOUDEST alarm signal that your Component has excessive tight coupling. This is not a testing problem - it's an architectural problem.

DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS:

FLAWED LOGIC: "But I need to isolate tests from Database/External APIs!"
REAL ANSWER: Correct, but you're isolating it WRONG. The correct way is using Dependency Injection with Test Doubles (Fakes/Stubs) that are "real things in test version" (like In-memory Database), not using Mocks to "pretend" connections happen. Mocking doesn't test connections AT ALL.

FLAWED LOGIC: "But Integration Tests are slow!"
REAL ANSWER: A test that passes in 1ms but catches zero bugs is COMPLETELY WORTHLESS. Good architecture (like Test Containers, In-memory Fakes) makes Integration Tests fast enough AND 100% reliable. Speed should never be traded for reliability.

GOLDEN RULE FOR VERIFICATION:
"If a bug occurs in Production but all your Unit Tests still pass 100%... your test suite is a LIE."

CONCLUSION WITHOUT EXCEPTIONS:
Every time you type jest.mock, ask yourself: "Am I about to test real behavior, or am I about to lie to myself that my code works correctly?" Fix the architecture, don't distort reality with Mocks.

*** ORGANIZATIONAL IMPACT: THE COST OF LOST TRUST ***

ENGINEERING CULTURE DESTRUCTION:
- Erosion of Accountability: When tests pass but production fails, teams start blame-shifting ("My tests pass, must be your part"). Mocking creates "silo culture" where everyone only cares about their own component, not system outcomes.
- Loss of Refactoring Courage: When test suite is unreliable, teams fear code improvements. Technical Debt accumulates until system collapses. Velocity for new features approaches zero.
- Creates "Not-Real-World" Mentality: Teams become comfortable with artificial scenarios instead of demanding robust, real integrations.

BUSINESS IMPACT:
- Slower Time-to-Market: Every bug that should've been caught in tests means development cycles slow down due to Hotfixes, Rollbacks, and post-mortem meetings.
- Opportunity Cost: Time engineers spend debugging integration issues that should be automatically detected is time they're NOT spending building revenue-generating features.
- Customer Trust Erosion: Frequent production issues erode customer confidence, leading to churn and negative reviews.
- Competitive Disadvantage: While competitors ship reliable software quickly, mocked teams are stuck in debug-fix-deploy cycles.

LEGACY PHILOSOPHY & DEEPER RATIONALE:
This rule enforces the principle that tests should validate BEHAVIOR, not IMPLEMENTATION DETAILS. When we mock dependencies, we're telling our tests "when function A is called with value B, pretend it returns C" - this couples our tests to HOW something works internally, rather than WHAT the end result should be.

Mocking is fundamentally about making assumptions about how code SHOULD work internally, rather than verifying how it ACTUALLY works when integrated. This creates a dangerous disconnect between test success and real-world functionality.

HIDDEN DANGERS:
1) FALSE CONFIDENCE (จอมปลอม): Tests passing 100% doesn't mean the system works when components connect, because tests never validate real integration
2) ARCHITECTURAL CORROSION (กัดกร่อนสถาปัตยกรรม): Developers start writing code to be "easily mockable" instead of "good and correct" - this is called "Test-Induced Design Damage"
3) REFACTORING NIGHTMARE (ฝันร้ายการ Refactor): Code improvement becomes terrifying because any internal change might break dozens of tests, preventing developers from improving code (Technical Debt increases)
4) INTEGRATION BLIND SPOTS (จุดบอด Integration): Bugs from component interactions (wrong data format, wrong API version calls) are never detected until Production
5) DEBUGGING HELL (นรกการ Debug): When production fails, there are no traces pointing to root cause because tests never exercised real paths
6) MAINTENANCE EXPLOSION (ระเบิดการดูแล): Every internal refactor requires updating multiple mock configurations across the codebase
7) ZOMBIE SYSTEM CREATION (ระบบซอมบี้): System appears to work (tests green) while internally riddled with integration failures
8) TEMPORAL COUPLING BUGS (บั๊กการเรียงลำดับ): Mocks don't capture timing, ordering, or concurrency issues that happen in real integration
9) VERSION DRIFT (ความแตกต่างเวอร์ชัน): Mocked APIs don't reflect real API changes, creating silent contract violations
10) PRODUCTION-TEST MISMATCH (ไม่ตรงกับ Production): Test environment behavior fundamentally differs from production due to artificial mock responses

LITMUS TEST:
Ask yourself: "If I refactor the internal code of this module without changing its public API, should my tests still pass?"
- If answer is "NO" (tests break): You're violating NO_MOCKING because your tests are coupled to implementation
- If answer is "YES" (tests still pass): You're testing behavior correctly

THE ABSOLUTE SOLUTION:
Use Dependency Injection (DI) ONLY:

Functions: Pass dependencies through parameters ALWAYS
// BAD: Mocking 'database'
jest.mock('./database');

// GOOD: Pass 'database' directly
function createUser(userData, database) {
  return database.save(userData);
}

// In tests:
const fakeDatabase = { save: async (data) => ({ id: 1, ...data }) };
const result = await createUser({ name: 'Test' }, fakeDatabase);

Classes: Pass dependencies through Constructor
class UserService {
  // BAD: this.database = require('./database');
  
  // GOOD: Receive database from outside
  constructor(database, emailService) {
    this.database = database;
    this.emailService = emailService;
  }
}

CLOSING ALL LOOPHOLES:

1) "BUT WHAT ABOUT UNIT TESTS?" LOOPHOLE:
   - WRONG: "I need to test my function in isolation, so I must mock dependencies"
   - RIGHT: True isolation comes from PURE FUNCTIONS with injected dependencies
   - SOLUTION: Write functions that are PURE by design, test with real lightweight implementations

2) "BUT EXTERNAL API CALLS ARE SLOW" LOOPHOLE:
   - WRONG: "I'll mock the API calls to make tests faster"
   - RIGHT: Fast tests come from good architecture, not mocks
   - SOLUTION: Use TEST DOUBLES (in-memory implementations) that implement same interface

3) "BUT I CAN'T CONTROL THIRD-PARTY SERVICES" LOOPHOLE:
   - WRONG: "I have to mock axios/fetch because I can't control external services"
   - RIGHT: Wrap external dependencies in YOUR OWN interfaces
   - SOLUTION: Create HttpClient abstraction, inject TestHttpClient for tests

4) "BUT SOME THINGS CAN'T BE INJECTED" LOOPHOLE:
   - WRONG: "File system, database, network calls are built-in, I must mock them"
   - RIGHT: EVERYTHING can be abstracted and injected
   - SOLUTION: Create adapters for ALL external dependencies

5) "BUT MOCKS ARE JUST FOR TESTING" LOOPHOLE:
   - WRONG: "Mocks don't affect production code"
   - RIGHT: Mocks DESTROY production code architecture by creating artificial dependencies
   - SOLUTION: If you need to mock it, your architecture is wrong

6) "BUT I'M ONLY MOCKING SIMPLE THINGS" LOOPHOLE:
   - WRONG: "Just mocking Date.now() or Math.random() is harmless"
   - RIGHT: Even simple mocks create temporal coupling and non-deterministic behavior
   - SOLUTION: Inject clock service, random number generator as dependencies

7) "BUT INTEGRATION TESTS ARE TOO COMPLEX" LOOPHOLE:
   - WRONG: "I'll use unit tests with mocks instead of integration tests"
   - RIGHT: Complexity comes from bad architecture, not integration testing
   - SOLUTION: Build architecture that makes integration testing simple

8) "BUT LEGACY CODE FORCES ME TO MOCK" LOOPHOLE:
   - WRONG: "Old code is too coupled, I have to mock to test it"
   - RIGHT: Mocks perpetuate bad architecture instead of fixing it  
   - SOLUTION: Refactor to dependency injection incrementally

9) "BUT FRAMEWORKS REQUIRE MOCKING" LOOPHOLE:
   - WRONG: "React/Angular/Express testing guides use mocks, so it's standard"
   - RIGHT: Framework testing guides often show BAD practices for simplicity
   - SOLUTION: Use framework-appropriate dependency injection patterns

10) "BUT TIME/DATE MOCKING IS NECESSARY" LOOPHOLE:
    - WRONG: "Testing time-dependent code requires mocking Date/setTimeout"
    - RIGHT: Time should be a dependency, not a global side effect
    - SOLUTION: Inject Clock interface with real/test implementations

ARCHITECTURAL SOLUTIONS TO COMMON "UNMOCKABLE" SCENARIOS:

DATABASE → Repository Pattern with interface
FILE SYSTEM → FileSystem abstraction service  
HTTP CALLS → HttpClient interface with implementations
RANDOM/CRYPTO → RandomGenerator/CryptoProvider services
TIME/DATE → Clock/TimeProvider services
ENVIRONMENT → Configuration provider
LOGGING → Logger interface
CACHING → Cache interface
MESSAGING → MessageBus interface
AUTHENTICATION → AuthProvider interface

NO EXCEPTIONS: If you think something "can't be injected", you haven't found the right abstraction yet.

Example:
BAD:  jest.mock('./database'); // Tests don't validate real database integration
GOOD: function createUser(userData, database) { return database.save(userData); } // Tests can pass real or test database`,
            th: `ปรัชญาและเหตุผลเชิงลึก:
กฎนี้บังคับหลักการที่ว่า test ควรตรวจสอบ BEHAVIOR ไม่ใช่ IMPLEMENTATION DETAILS เมื่อเรา mock dependencies เราจะบอก test ว่า "เมื่อฟังก์ชัน A ถูกเรียกด้วยค่า B ให้ทำเป็นว่าได้ผลลัพธ์ C" สิ่งนี้ทำให้ test ผูกติดกับ วิธีการทำงานภายใน แทนที่จะเป็น ผลลัพธ์สุดท้าย ที่ควรได้รับ

Mock คือการสร้างสมมติฐานเกี่ยวกับวิธีการทำงานภายใน แทนที่จะตรวจสอบว่าทำงานจริงอย่างไรเมื่อรวมกัน สิ่งนี้สร้างช่องว่างอันตรายระหว่างความสำเร็จของ test กับการทำงานจริง

กฎนี้บังคับให้ปฏิบัติตาม Inversion of Control (IoC) และ Dependency Injection (DI) อย่างเคร่งครัด ซึ่งเป็นรากฐานของสถาปัตยกรรมซอฟต์แวร์ที่ยืดหยุ่นและทดสอบได้

อันตรายที่ซ่อนอยู่:
1) ความมั่นใจจอมปลอม: Test ผ่าน 100% ไม่ได้หมายความว่าระบบทำงานได้เมื่อ component เชื่อมต่อกัน เพราะ test ไม่เคยทดสอบ integration จริง
2) การกัดกร่อนสถาปัตยกรรม: นักพัฒนาเขียนโค้ดเพื่อให้ "mock ได้ง่าย" แทนที่จะ "ดีและถูกต้อง" เรียกว่า "Test-Induced Design Damage"
3) ฝันร้ายการ Refactor: การปรับปรุงโค้ดกลายเป็นเรื่องน่ากลัว เพราะการเปลี่ยนแปลงภายในอาจทำให้ test พังเป็นสิบๆ ตัว ป้องกันการปรับปรุงโค้ด (Technical Debt เพิ่ม)
4) จุดบอด Integration: บั๊กจากการโต้ตอบระหว่าง component (format ข้อมูลผิด, เรียก API version ผิด) ไม่ถูกตรวจพบจนถึง Production
5) นรกการ Debug: เมื่อ production พัง ไม่มีร่องรอยชี้ไปต้นตอปัญหา เพราะ test ไม่เคยใช้เส้นทางจริง
6) ระเบิดการดูแล: การ refactor ภายในต้องอัปเดต mock หลายที่ทั่ว codebase
7) สร้างระบบซอมบี้: ระบบดูเหมือนทำงาน (test เขียว) แต่ภายในเต็มไปด้วย integration failure
8) บั๊กการเรียงลำดับ: Mock ไม่จับเวลา ลำดับ หรือปัญหา concurrency ที่เกิดใน integration จริง
9) ความแตกต่างเวอร์ชัน: Mock API ไม่สะท้อนการเปลี่ยนแปลง API จริง สร้างการละเมิด contract แบบเงียบ
10) ไม่ตรงกับ Production: Test environment แตกต่างจาก production เนื่องจาก mock response เทียม

วิธีทดสอบความคิด (Litmus Test):
ถามตัวเอง: "ถ้าฉัน refactor โค้ดภายในของ module นี้โดยไม่เปลี่ยน public API test ควรผ่านหรือไม่?"
- ถ้าตอบ "ไม่" (test พัง): คุณละเมิด NO_MOCKING เพราะ test ผูกติดกับ implementation  
- ถ้าตอบ "ใช่" (test ยังผ่าน): คุณทดสอบ behavior ถูกต้อง

วิธีแก้ไขสมบูรณ์:
ใช้ Dependency Injection (DI) เท่านั้น:

ฟังก์ชัน: ส่ง dependencies ผ่าน parameter เสมอ
// ไม่ดี: Mock 'database'
jest.mock('./database');

// ดี: ส่ง 'database' เข้ามาตรงๆ
function createUser(userData, database) {
  return database.save(userData);
}

// ใน test:
const fakeDatabase = { save: async (data) => ({ id: 1, ...data }) };
const result = await createUser({ name: 'Test' }, fakeDatabase);

คลาส: ส่ง dependencies ผ่าน Constructor
class UserService {
  // ไม่ดี: this.database = require('./database');
  
  // ดี: รับ database จากภายนอก
  constructor(database, emailService) {
    this.database = database;
    this.emailService = emailService;
  }
}

ADVANCED VIOLATION PATTERNS:
1) PARTIAL MOCKING: Mocking only parts of modules while keeping others real
   BAD: jest.mock('./userService', () => ({ validateEmail: jest.fn(), ...jest.requireActual('./userService') }));
   
2) SPY CHAINING: Using spies to track internal function calls
   BAD: const spy = jest.spyOn(service.database, 'connect'); expect(spy).toHaveBeenCalled();
   
3) DYNAMIC MOCKING: Runtime mocking based on conditions
   BAD: if (isTestMode) { UserService.prototype.save = jest.fn(); }
   
4) MOCK MODULES WITH REAL LOGIC: Mocks that replicate real implementation
   BAD: jest.mock('./calculator', () => ({ add: (a, b) => a + b })); // Still mocking!
   
5) GLOBAL MOCKING: Mocking global objects or built-ins
   BAD: global.fetch = jest.fn(); window.localStorage = { getItem: jest.fn() };
   
6) CONSTRUCTOR MOCKING: Mocking class constructors and instances
   BAD: jest.mock('./UserService'); const MockedUserService = UserService as jest.MockedClass;
   
7) ASYNC MOCKING: Mocking promises, callbacks, and async operations
   BAD: jest.mock('fs', () => ({ readFile: jest.fn((path, cb) => cb(null, 'fake data')) }));
   
8) MOCK TIMERS: Mocking time-based operations
   BAD: jest.useFakeTimers(); jest.advanceTimersByTime(1000); // Time should be injected
   
9) HTTP MOCKING: Mocking network requests instead of using test servers
   BAD: nock('https://api.com').get('/users').reply(200, { users: [] });
   
10) PROCESS MOCKING: Mocking Node.js process or environment
    BAD: jest.spyOn(process, 'exit').mockImplementation(() => {}); 

SOPHISTICATED ALTERNATIVES (The Right Way):
Instead of mocking, use these patterns:

1) TEST DOUBLES via DI:
// Create real implementations for testing
const testDatabase = new InMemoryDatabase();
const testEmailService = new LoggingEmailService();
const userService = new UserService(testDatabase, testEmailService);

2) ADAPTER PATTERN:
// Wrap external dependencies
class FileSystemAdapter {
  constructor(fs = require('fs')) { this.fs = fs; }
  readFile(path) { return this.fs.promises.readFile(path); }
}

3) FACTORY INJECTION:
// Inject factories instead of instances
function createUserService(dbFactory, emailFactory) {
  return new UserService(dbFactory(), emailFactory());
}

4) CONFIGURATION INJECTION:
// Make behavior configurable instead of mocked
function processPayment(amount, config = { timeout: 5000, retries: 3 }) {
  // Use config instead of hardcoded values that need mocking
}

5) EVENT-DRIVEN TESTING:
// Test through events instead of mocking internal calls
emitter.emit('user-created', userData);
expect(await waitForEvent('email-sent')).toBeTruthy();

ไม่มีข้อยกเว้น: แม้ external library ควรถูกห่อใน Adapter และ inject ผ่าน DI, ไม่ใช่ mock

ตัวอย่าง:
ไม่ดี: jest.mock('./database'); // Test ไม่ validate integration database จริง
ดี: function createUser(userData, database) { return database.save(userData); } // Test ส่ง database จริงหरือ test database ได้

*** การปิดช่องโหว่ทุกรูปแบบ - LOOPHOLE CLOSURE ***

เหตุผลที่คนอยากใช้ mocking และการปิดช่องโหว่:

1. "เฮ้ย! แต่ unit test ต้องเร็วนี่!"
   → ไม่ยอมรับ! ความเร็วมาจาก architecture ที่ดี ไม่ใช่การ mock
   → แก้ถูก: ใช้ in-memory database หรือ test containers สำหรับ integration tests
   → เพราะอะไร: Mock ทำให้ test ไม่ validate real integration behavior

2. "อะ! แต่ external API มันช้าแล้วก็ไม่เสถียร!"
   → ไม่ยอมรับ! External API ต้องห่อใน service layer และใช้ test environment
   → แก้ถูก: API Gateway pattern พร้อม test endpoint หรือ staging environment
   → เพราะอะไร: Mock API response ไม่ test real network errors และ API contract changes

3. "เฮ้ย! แต่ database connection มันหนักเกินไป!"
   → ไม่ยอมรับ! Database testing ต้องใช้ proper test isolation
   → แก้ถูก: Docker test containers, transaction rollback หรือ dedicated test database
   → เพราะอะไร: Mock database ไม่ validate SQL syntax, constraints และ data integrity

4. "อะ! แต่ file system I/O มันช้า!"
   → ไม่ยอมรับ! File operations ต้องถูกออกแบบให้ testable
   → แก้ถูก: Abstraction layer สำหรับ file operations พร้อม in-memory implementation
   → เพราะอะไร: Mock file operations ไม่ test real file permissions และ disk space issues

5. "เฮ้ย! แต่ time/date testing ทำไงล่ะ!"
   → ไม่ยอมรับ! Time dependencies ต้อง inject เป็น parameter
   → แก้ถุก: Clock abstraction ที่ inject เข้า function แทน Date.now() ตรงๆ
   → เพราะอะไร: Mock time ไม่ test timezone issues และ daylight saving time

6. "อะ! แต่ third-party library มันใช้ยาก!"
   → ไม่ยอมรับ! Third-party ต้องห่อใน adapter pattern
   → แก้ถูก: Wrapper class ที่ implement interface ชัดเจนแล้วทดสอบ adapter นั้น
   → เพราะอะไร: Mock library ไม่ validate API compatibility และ version changes

7. "เฮ้ย! แต่ email/SMS service มันต้องใช้เงิน!"
   → ไม่ยอมรับ! Communication service ต้องมี test mode
   → แก้ถูก: Service configuration ที่มี test mode หรือ sandbox environment
   → เพราะอะไร: Mock communication ไม่ validate message formatting และ delivery constraints

8. "อะ! แต่ authentication มันซับซ้อน!"
   → ไม่ยอมรับ! Authentication ต้องออกแบบให้มี test user
   → แก้ถูก: Test authentication token หรือ development-only auth bypass
   → เพราะอะไร: Mock auth ไม่ validate permission logic และ security policies

9. "เฮ้ย! แต่ legacy code มันแก้ไม่ได้!"
   → ไม่ยอมรับ! Legacy integration ต้องค่อยๆ refactor
   → แก้ถูก: Strangler Fig pattern - wrap legacy ใน interface ใหม่แล้วทดสอบ interface นั้น
   → เพราะอะไร: Mock legacy ทำให้ไม่สามารถ validate การทำงานจริงของระบบเก่า

10. "อะ! แต่ performance testing ต้องใช้ mock!"
    → ไม่ยอมรับ! Performance testing ต้องใช้ representative data
    → แก้ถูก: Load testing พร้อม realistic test data และ proper test environment
    → เพราะอะไร: Mock performance ไม่ reflect real bottlenecks และ resource constraints

กฎทองสำหรับตรวจสอบ: 
ถ้า production bug เกิดขึ้นแล้ว unit test ยัง pass = test suite ไม่ validate behavior จริง
ถ้าต้อง mock เพื่อให้ test ผ่าน = architecture coupling too tight

ไม่มีข้อยกเว้น ไม่มีเหตุผลพิเศษ - ZERO MOCKING, REAL TESTING ONLY`
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

            // ═══════════════════════════════════════════════════════════════════
            // ADVANCED MOCKING PATTERNS - ซับซ้อนและแอบแฝง
            // ═══════════════════════════════════════════════════════════════════

            // Partial mocking (mocking only parts of modules)
            { regex: /jest\.mock\s*\([^)]+,\s*\(\s*\)\s*=>\s*\(\s*\{[\s\S]*requireActual/, name: 'Partial module mocking with requireActual', severity: 'ERROR' },
            { regex: /\.\.\.\s*jest\.requireActual\s*\([^)]+\)/, name: 'Spread requireActual (partial mocking)', severity: 'ERROR' },
            { regex: /jest\.doMock\s*\([^)]+,\s*\(\s*\)\s*=>\s*\{/, name: 'jest.doMock with custom implementation', severity: 'ERROR' },

            // Dynamic/conditional mocking
            { regex: /if\s*\([^)]+\)\s*\{[\s\S]*jest\.mock/, name: 'Conditional mocking inside if statement', severity: 'ERROR' },
            { regex: /isTest\s*&&[\s\S]*\.mockImplementation/, name: 'Test environment conditional mocking', severity: 'ERROR' },
            { regex: /process\.env\.NODE_ENV[\s\S]*mockReturnValue/, name: 'Environment-based mock configuration', severity: 'ERROR' },

            // Spy chaining and behavior verification  
            { regex: /\.spyOn\s*\([^)]+\)\.mockImplementation/, name: 'Spy with mock implementation chaining', severity: 'ERROR' },
            { regex: /\.spyOn\s*\([^)]+\)\.mockReturnValue/, name: 'Spy with mock return value chaining', severity: 'ERROR' },
            { regex: /expect\s*\([^)]*spy[^)]*\)\.toHaveBeenCalled/, name: 'Spy call verification (testing implementation)', severity: 'ERROR' },
            { regex: /expect\s*\([^)]*\)\.toHaveBeenCalledWith\s*\(/, name: 'Spy call arguments verification', severity: 'ERROR' },
            { regex: /expect\s*\([^)]*\)\.toHaveBeenCalledTimes\s*\(/, name: 'Spy call count verification', severity: 'ERROR' },

            // Mock modules with real-like implementations
            { regex: /jest\.mock\s*\([^)]+,\s*\(\s*\)\s*=>\s*\{[\s\S]*return\s*\{/, name: 'Mock module with fake implementation', severity: 'ERROR' },
            { regex: /mockImplementation\s*\(\s*\([^)]*\)\s*=>\s*\{[\s\S]*real/, name: 'Mock implementation mimicking real behavior', severity: 'ERROR' },
            { regex: /jest\.fn\s*\(\s*\([^)]*\)\s*=>\s*\{[\s\S]*calculate/, name: 'Mock function with calculation logic', severity: 'ERROR' },

            // Constructor and class mocking
            { regex: /jest\.mock\s*\([^)]+\)[\s\S]*MockedClass/, name: 'Mocked class type assertion', severity: 'ERROR' },
            { regex: /as\s+jest\.MockedClass/, name: 'TypeScript mocked class casting', severity: 'ERROR' },
            { regex: /MockedFunction\s*</, name: 'TypeScript MockedFunction type', severity: 'ERROR' },
            { regex: /jest\.MockedConstructor/, name: 'Jest mocked constructor type', severity: 'ERROR' },

            // Async/Promise mocking patterns
            { regex: /mockResolvedValue\s*\([\s\S]*await/, name: 'Complex async mock with await logic', severity: 'ERROR' },
            { regex: /mockRejectedValue\s*\(new\s+Error/, name: 'Mock promise rejection with error', severity: 'ERROR' },
            { regex: /\.mockImplementation\s*\(\s*async\s*\(/, name: 'Async mock implementation', severity: 'ERROR' },
            { regex: /Promise\.resolve\s*\([\s\S]*\)[\s\S]*mockResolvedValue/, name: 'Promise wrapping in mock', severity: 'ERROR' },

            // Timer and scheduling mocking
            { regex: /jest\.useFakeTimers\s*\([^)]*\)/, name: 'Jest fake timers with config', severity: 'ERROR' },
            { regex: /jest\.setSystemTime\s*\(/, name: 'Jest system time mocking', severity: 'ERROR' },
            { regex: /jest\.getRealSystemTime\s*\(\s*\)/, name: 'Jest real system time access', severity: 'ERROR' },
            { regex: /jest\.advanceTimersToNextTimer\s*\(/, name: 'Jest advance to next timer', severity: 'ERROR' },
            { regex: /jest\.runOnlyPendingTimers\s*\(/, name: 'Jest run pending timers', severity: 'ERROR' },

            // HTTP/Network mocking (beyond basic patterns)
            { regex: /nock\s*\([^)]+\)\.get\s*\([^)]+\)\.reply/, name: 'Nock HTTP GET mock with reply', severity: 'ERROR' },
            { regex: /nock\s*\([^)]+\)\.post\s*\([^)]+\)\.reply/, name: 'Nock HTTP POST mock with reply', severity: 'ERROR' },
            { regex: /mockttp\.getLocal\s*\(\s*\)/, name: 'Mockttp local mock server', severity: 'ERROR' },
            { regex: /server\.forGet\s*\([^)]+\)\.thenReply/, name: 'Mockttp GET endpoint mock', severity: 'ERROR' },

            // Process and environment mocking
            { regex: /jest\.spyOn\s*\(\s*process\s*,\s*['"]exit['"]/, name: 'Process exit spy/mock', severity: 'ERROR' },
            { regex: /jest\.spyOn\s*\(\s*process\.stdout\s*,/, name: 'Process stdout spy', severity: 'ERROR' },
            { regex: /jest\.spyOn\s*\(\s*console\s*,/, name: 'Console method spy', severity: 'ERROR' },
            { regex: /process\.env\s*=\s*\{[\s\S]*jest/, name: 'Process env mocking with Jest', severity: 'ERROR' },

            // File system and I/O mocking
            { regex: /jest\.mock\s*\(\s*['"]fs['"]/, name: 'File system module mocking', severity: 'ERROR' },
            { regex: /jest\.mock\s*\(\s*['"]path['"]/, name: 'Path module mocking', severity: 'ERROR' },
            { regex: /vol\.fromJSON\s*\(/, name: 'Memfs volume creation (mocking fs)', severity: 'ERROR' },
            { regex: /mockfs\s*\(\s*\{/, name: 'Mock-fs usage', severity: 'ERROR' },

            // Database and ORM mocking
            { regex: /jest\.mock\s*\([^)]*sequelize/, name: 'Sequelize ORM mocking', severity: 'ERROR' },
            { regex: /jest\.mock\s*\([^)]*typeorm/, name: 'TypeORM mocking', severity: 'ERROR' },
            { regex: /jest\.mock\s*\([^)]*mongoose/, name: 'Mongoose ODM mocking', severity: 'ERROR' },
            { regex: /createConnection\s*=\s*jest\.fn/, name: 'Database connection mock function', severity: 'ERROR' },

            // React/Component mocking patterns
            { regex: /jest\.mock\s*\([^)]*react/, name: 'React library mocking', severity: 'ERROR' },
            { regex: /shallow\s*\([^)]+\)[\s\S]*mock/, name: 'Enzyme shallow rendering with mocks', severity: 'ERROR' },
            { regex: /render\s*\([^)]+\)[\s\S]*mockImplementation/, name: 'Testing Library render with mocks', severity: 'ERROR' },

            // Module boundary violations
            { regex: /require\.cache\s*\[\s*require\.resolve\s*\(/, name: 'Module cache manipulation', severity: 'ERROR' },
            { regex: /delete\s+require\.cache/, name: 'Module cache deletion', severity: 'ERROR' },
            { regex: /module\._load\s*=/, name: 'Module._load override', severity: 'ERROR' },
            { regex: /Module\._resolveFilename\s*=/, name: 'Module resolution override', severity: 'ERROR' },

            // Advanced sinon patterns
            { regex: /sinon\.createSandbox\s*\(\s*\)[\s\S]*restore/, name: 'Sinon sandbox with restore', severity: 'ERROR' },
            { regex: /sinon\.stub\s*\([^)]+\)\.withArgs/, name: 'Sinon conditional stub with args', severity: 'ERROR' },
            { regex: /sinon\.stub\s*\([^)]+\)\.onCall/, name: 'Sinon call-specific stub behavior', severity: 'ERROR' },
            { regex: /sinon\.mock\s*\([^)]+\)\.expects/, name: 'Sinon mock with expectations', severity: 'ERROR' },

            // Monkey patching and runtime modification
            { regex: /\w+\.prototype\.\w+\s*=\s*jest\.fn/, name: 'Prototype method mocking', severity: 'ERROR' },
            { regex: /Object\.assign\s*\([^)]+,\s*\{[\s\S]*jest\.fn/, name: 'Object.assign with mock functions', severity: 'ERROR' },
            { regex: /\w+\.\w+\s*=\s*jest\.fn\s*\(\s*\)[\s\S]*original/, name: 'Method replacement with original reference', severity: 'ERROR' },

            // Test framework agnostic mocking  
            { regex: /td\.replace\s*\(/, name: 'Testdouble replace function', severity: 'ERROR' },
            { regex: /td\.when\s*\([^)]+\)\.thenReturn/, name: 'Testdouble conditional return', severity: 'ERROR' },
            { regex: /td\.verify\s*\([^)]+\)/, name: 'Testdouble verification', severity: 'ERROR' },
            { regex: /proxyquire\s*\([^)]+,\s*\{/, name: 'Proxyquire module mocking', severity: 'ERROR' },
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
            en: `ABSOLUTE PHILOSOPHY: "HARDCODE IS EMBEDDING TECHNICAL DEBT WAITING TO EXPLODE"
            
This rule enforces THE SACRED BOUNDARY between "Code (Behavior)" and "Config (Environment)". Code written once should be able to run in ANY environment (Development, Staging, Production, Customer machines) without modifying even a single character.

Every time any value is hardcoded, that's creating a "specialized version" of software tied to that specific environment. It's deliberately creating software that is FRAGILE, INSECURE, and NON-SCALABLE.

DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS:

FLAWED LOGIC: "But it's just localhost for my own machine!"
REAL ANSWER: Tomorrow there might be a new developer joining the team who uses Docker and their localhost is host.docker.internal. Your hardcode has instantly created problems for others. Good code must not make assumptions about anyone's environment.

FLAWED LOGIC: "But it's just a constant that never changes, like retry count!"
REAL ANSWER: On high-load Production, you might need 5 retries with Exponential Backoff, but on Development you might want it to fail immediately for faster debugging. Values that seem "constant" are actually "policy variables" that need to be adjustable.

GOLDEN RULE FOR VERIFICATION:
"If someone without an IDE (like DevOps team, SRE, or even managers) wants to change this value, can they do it themselves through a Dashboard or config file without touching code at all?"

CONCLUSION WITHOUT EXCEPTIONS:
Every character in your code should describe "LOGIC", not "ADDRESSES" or "SPECIFIC DATA". If it's not logic, it's config, and must be external to code without any exceptions.

LEGACY PHILOSOPHY & DEEPER RATIONALE:
Code should define BEHAVIOR (what the system does), while Configuration should define ENVIRONMENT (where and how it runs). Embedding values that should be in configuration into source code destroys the separation between these two concerns, making code NON-PORTABLE (cannot move to different environments) and INSECURE (secrets exposed).

Every hardcoded value is an "assumption" embedded in code, such as "the database will always be at this IP", "this API key will work forever". In reality, these assumptions are false and will create problems eventually.

The rule enforces the principle of EXTERNALIZATION OF CONFIGURATION - all environment-specific, security-sensitive, or deployment-dependent values must be injected from outside the codebase.

HIDDEN DANGERS:
1) SECRET LEAKS (ความลับรั่วไหล): API Keys, passwords in code = open door for hackers. Just one code leak to public repo = instant disaster
2) DEPLOYMENT FAILURES (การ Deploy ล้มเหลว): Code works on Development but crashes on Staging/Production because URLs, ports, paths don't match
3) HIGH COST OF CHANGE (ค่าใช้จ่ายสูงในการเปลี่ยน): Changing small values like timeout or API URL becomes full code modification + code review + build + deploy cycle instead of just changing environment variable
4) MAGIC NUMBERS (ตัวเลขลึกลับ): Using floating numbers in code (like if (user.role === 3)) makes code unreadable and extremely difficult to modify
5) ENVIRONMENT COUPLING (ผูกติดสภาพแวดล้อม): Code becomes coupled to specific environment, preventing horizontal scaling and multi-environment deployment
6) SECURITY AUDIT NIGHTMARE (ฝันร้ายการตรวจสอบความปลอดภัย): Security teams cannot scan for exposed secrets because they're scattered throughout codebase instead of centralized configuration
7) DISASTER RECOVERY IMPOSSIBILITY (ฟื้นฟูหายนะไม่ได้): Cannot quickly change endpoints during outages because values are buried in code requiring full deployment
8) COMPLIANCE VIOLATIONS (ละเมิดมาตรฐาน): Regulations like SOX, PCI-DSS, GDPR require separation of configuration from code - hardcoded values violate compliance
9) TESTING HELL (นรกการทดสอบ): Cannot test against different environments/configurations without code changes
10) VENDOR LOCK-IN (ผูกติดผู้ขาย): Hardcoded service URLs prevent switching to alternative providers

LITMUS TEST:
Ask yourself: "If DevOps/SRE team needs to change this value for new environment (like new K8s cluster, new region), do they need to ask programmers to modify this source file?"
- If answer is "YES": You're violating NO_HARDCODE
- If answer is "NO" (they can change via ENV, .env, or Config Map): You're doing it right

THE ABSOLUTE SOLUTION:
Use Configuration Hierarchy that's clear:

1. Read from Environment Variables first: (like process.env.DATABASE_URL) - standard for Production and CI/CD
2. If not available, read from .env file: For local development
3. If still not available, read from config.js/config.json: For non-secret defaults that don't change per environment
4. NEVER have secret defaults: If Environment Variable for secret value (like API Key) doesn't exist, FAIL FAST with clear error message

// config.js
const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432
  },
  apiKey: process.env.API_KEY // NO default for secrets
};

if (!config.apiKey) {
  throw new Error('FATAL: API_KEY is not defined in environment variables.');
}

module.exports = config;

ADVANCED VIOLATION PATTERNS:
1) FAKE/TEST HARDCODING: Hardcoding fake values to make tests pass without real integration
   BAD: const mockUserId = 12345; // Always returns same fake ID
   BAD: if (process.env.NODE_ENV === 'test') return { success: true }; // Fake success in tests

2) CONDITIONAL HARDCODING: Different hardcoded values for different environments
   BAD: const timeout = isProd ? 30000 : 5000; // Environment-specific magic numbers
   BAD: const dbHost = isStaging ? 'staging-db.com' : 'prod-db.com'; // Hardcoded hosts

3) ALGORITHM PARAMETER HARDCODING: Business logic parameters that should be configurable
   BAD: const MAX_RETRY_ATTEMPTS = 3; // Should be configurable per environment
   BAD: const CACHE_TTL_SECONDS = 3600; // Should vary by environment load

4) FEATURE FLAGS HARDCODING: Feature toggles hardcoded instead of dynamic
   BAD: const ENABLE_NEW_ALGORITHM = true; // Should be runtime configurable
   BAD: if (userId === 'admin') enableBetaFeature(); // Hardcoded special cases

5) SECURITY BYPASS HARDCODING: Hardcoded backdoors or test bypasses left in production
   BAD: if (password === 'dev123') return { authenticated: true }; // Test backdoor
   BAD: const skipAuth = process.env.NODE_ENV === 'development'; // Auth bypass

6) BUSINESS RULE HARDCODING: Domain-specific rules that should be configurable
   BAD: const MIN_PASSWORD_LENGTH = 8; // Should be policy-configurable
   BAD: const TAX_RATE = 0.07; // Should be jurisdiction-configurable

7) INTEGRATION ENDPOINT HARDCODING: Service discovery hardcoded instead of dynamic
   BAD: const userService = 'http://user-service:3001'; // Should use service discovery
   BAD: const paymentGateway = 'https://payments.stripe.com'; // Should be env-specific

8) RESOURCE LIMIT HARDCODING: System resource limits hardcoded instead of tunable
   BAD: const MAX_CONCURRENT_REQUESTS = 100; // Should be tunable based on system capacity
   BAD: const MEMORY_LIMIT_MB = 512; // Should be configurable per deployment

9) TIMING/SCHEDULE HARDCODING: Cron schedules, timeouts, intervals hardcoded
   BAD: setInterval(cleanup, 60000); // Should be configurable
   BAD: const MAINTENANCE_WINDOW = '02:00-04:00'; // Should be timezone/region specific

10) COMPLIANCE/AUDIT HARDCODING: Audit trails, retention periods hardcoded
    BAD: const LOG_RETENTION_DAYS = 90; // Should be compliance-configurable
    BAD: const AUDIT_ENABLED = true; // Should be policy-driven

SOPHISTICATED DETECTION: This rule catches not just obvious hardcoding but also:
- Ternary operators with environment-specific values
- Switch statements with hardcoded environment cases
- Default function parameters hiding configuration
- Class constants that should be injected
- Enum values that should be configurable
- Regular expressions with hardcoded patterns
- Mathematical constants used in business logic
- Hardcoded user IDs, roles, permissions
- Test data generators with fixed values
- Mock responses that bypass real integration

ZERO TOLERANCE: No hardcoded URLs, API keys, database connections, file paths, timeouts, business rules, feature flags, security bypasses, resource limits, schedules, compliance settings, or ANY environment/deployment/business-specific values in source code.`,
            th: `ปรัชญาและเหตุผลเชิงลึก:
โค้ดควรกำหนด BEHAVIOR (พฤติกรรมที่ระบบทำ) ส่วน Configuration ควรกำหนด ENVIRONMENT (สภาพแวดล้อมที่ทำงาน) การฝังค่าที่ควรอยู่ใน configuration ลงใน source code ทำลายการแยกระหว่างสองสิ่งนี้ ทำให้โค้ด NON-PORTABLE (ย้ายไป environment อื่นไม่ได้) และ INSECURE (ความลับเปิดเผย)

ค่า hardcode ทุกตัวคือ "สมมติฐาน" ที่ฝังใน code เช่น "database จะอยู่ที่ IP นี้เสมอ", "API key นี้ใช้ได้ตลอดไป" ในความเป็นจริง สมมติฐานเหล่านี้เป็นเท็จและจะสร้างปัญหาในที่สุด

กฎนี้บังคับหลักการ EXTERNALIZATION OF CONFIGURATION - ค่าทั้งหมดที่เกี่ยวกับ environment, security, deployment ต้องถูก inject จากภายนอก codebase

อันตรายที่ซ่อนอยู่:
1) ความลับรั่วไหล: API Keys, passwords ในโค้ด = เปิดประตูให้แฮกเกอร์ แค่โค้ดหลุดไป public repo = หายนะทันที
2) การ Deploy ล้มเหลว: โค้ดทำงานใน Development แต่พังใน Staging/Production เพราะ URLs, ports, paths ไม่ตรง
3) ค่าใช้จ่ายสูงในการเปลี่ยน: เปลี่ยนค่าเล็กๆ เช่น timeout หรือ API URL กลายเป็นการแก้โค้ด + code review + build + deploy แทนที่จะแค่เปลี่ยน environment variable
4) ตัวเลขลึกลับ: ใช้ตัวเลขลอยๆ ในโค้ด (เช่น if (user.role === 3)) ทำให้โค้ดอ่านไม่รู้เรื่องและแก้ยากมาก
5) ผูกติดสภาพแวดล้อม: โค้ดผูกติดกับ environment เฉพาะ ป้องกันการ scale และ deploy หลาย environment
6) ฝันร้ายการตรวจสอบความปลอดภัย: Security team ไม่สามารถ scan หาความลับที่เปิดเผยได้ เพราะกระจายทั่ว codebase แทนที่จะรวมใน configuration
7) ฟื้นฟูหายนะไม่ได้: ไม่สามารถเปลี่ยน endpoint อย่างรวดเร็วเมื่อเกิดปัญหา เพราะค่าฝังอยู่ในโค้ดต้อง deploy ใหม่
8) ละเมิดมาตรฐาน: กฎหมายอย่าง SOX, PCI-DSS, GDPR ต้องการแยก configuration จากโค้ด - hardcode ละเมิดมาตรฐาน
9) นรกการทดสอบ: ไม่สามารถทดสอบกับ environment/configuration ต่างๆ ได้โดยไม่แก้โค้ด
10) ผูกติดผู้ขาย: Hardcode service URL ป้องกันการเปลี่ยนไป alternative provider

วิธีทดสอบความคิด (Litmus Test):
ถามตัวเอง: "ถ้าทีม DevOps/SRE ต้องการเปลี่ยนค่านี้สำหรับ environment ใหม่ (เช่น K8s cluster ใหม่, region ใหม่) เขาต้องมาขอให้โปรแกรมเมอร์แก้ไฟล์ source นี้หรือไม่?"
- ถ้าตอบ "ใช่": คุณละเมิด NO_HARDCODE
- ถ้าตอบ "ไม่" (แก้ผ่าน ENV, .env, Config Map ได้): คุณทำถูกต้อง

วิธีแก้ไขสมบูรณ์:
ใช้ Configuration Hierarchy ที่ชัดเจน:

1. อ่านจาก Environment Variables ก่อน: (เช่น process.env.DATABASE_URL) - มาตรฐานสำหรับ Production และ CI/CD
2. ถ้าไม่มี อ่านจากไฟล์ .env: สำหรับการพัฒนาในเครื่อง
3. ถ้ายังไม่มี อ่านจาก config.js/config.json: สำหรับค่า default ที่ไม่เป็นความลับและไม่เปลี่ยนตาม environment
4. ห้ามมีค่า default ที่เป็นความลับ: ถ้า Environment Variable สำหรับค่าลับ (เช่น API Key) ไม่มี ให้ FAIL FAST พร้อมข้อความ error ชัดเจน

// config.js
const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432
  },
  apiKey: process.env.API_KEY // ไม่มีค่า default สำหรับความลับ
};

if (!config.apiKey) {
  throw new Error('FATAL: API_KEY is not defined in environment variables.');
}

module.exports = config;

ไม่ยอมรับข้อยกเว้น: ไม่มี hardcode URLs, API keys, database connections, file paths, timeouts หรือค่า environment-specific ใดๆ ใน source code

*** LOOPHOLE CLOSURE - การปิดช่องโหว่ทุกรูปแบบ ***

เหตุผลที่คนอยากใช้ hardcode และการปิดช่องโหว่:

1. "OMG BUT IT'S JUST A LOCALHOST URL FOR DEVELOPMENT!"
   → ไม่ยอมรับ! ทันทีที่เขียน localhost แล้ว Junior Developer คนอื่นจะคิดว่าต่อจากนี้ localhost ทั้งหมดใส่ hardcode ได้
   → แก้ถูก: DEFAULT_DEV_URL = process.env.DEV_URL || 'http://localhost:3000'
   → เพราะอะไร: โครงการใหญ่มักมี multiple localhost environments ที่ต่าง port กัน

2. "DUDE! IT'S JUST FOR UNIT TESTS!"
   → ไม่ยอมรับ! Test fixtures และ mock data ต้องอยู่ในไฟล์แยก หรือ test-specific configuration
   → แก้ถูก: fixtures/test-urls.json, test-config.js หรือใช้ jest.setupFiles
   → เพราะอะไร: Hardcode ใน test ทำให้เปลี่ยน test environment ไม่ได้

3. "BRO, IT'S JUST A TIMEOUT CONSTANT!"
   → ไม่ยอมรับ! Timeout behavior ต้องเปลี่ยนได้ตาม network conditions ของแต่ละ environment
   → แก้ถูก: config.timeouts.httpRequest ที่มี default แต่ override ได้
   → เพราะอะไร: Production might need 30 seconds, Development needs 5 seconds, Testing needs 1 second

4. "OMG BUT IT'S JUST A DATABASE SCHEMA NAME!"
   → ไม่ยอมรับ! Database naming convention ต่างกันใน environment ต่างๆ
   → แก้ถูก: DB_SCHEMA environment variable with tenant-specific or environment-specific naming
   → เพราะอะไร: Multi-tenant และ environment isolation

5. "DUDE! IT'S A THIRD-PARTY OAUTH REDIRECT URL!"
   → ไม่ยอมรับ! OAuth configuration เปลี่ยนตาม domain และ environment
   → แก้ถูก: OAUTH_REDIRECT_BASE + computed path based on current domain
   → เพราะอะไร: Staging, QA, Production มี different domains

6. "BRO, IT'S JUST A SIMPLE FILE PATH!"
   → ไม่ยอมรับ! File paths ต่างกันใน Windows/Linux และ container environments
   → แก้ถูก: path.join(process.env.DATA_DIR || './data', filename)
   → เพราะอะไร: Development: ./data, Production: /app/data, Docker: /var/app/data

7. "OMG BUT THESE ARE INDUSTRY-STANDARD PORTS!"
   → ไม่ยอมรับ! "Standard" ports อาจถูกใช้โดย service อื่น หรือ blocked โดย firewall
   → แก้ถูก: PORT configuration ที่มี default แต่ override ได้
   → เพราะอะไร: Production ใช้ port 8080, Development ใช้ 3000, Docker ใช้ 80

8. "DUDE! IT'S JUST MAGIC NUMBERS FOR BUSINESS LOGIC!"
   → ไม่ยอมรับ! Business rules เปลี่ยนและต้อง externalize เพื่อให้ business team แก้ได้โดยไม่ผ่าน engineering
   → แก้ถูก: BUSINESS_RULES configuration หรือ feature flags
   → เพราะอะไร: "Free shipping จาก 500 บาท" อาจเปลี่ยนเป็น 800 บาทโดยไม่แก้โค้ด

9. "BRO, THESE ARE JUST REGEX VALIDATION PATTERNS!"
   → ไม่ยอมรับ! Validation rules เปลี่ยนตาม country, regulations และ business requirements
   → แก้ถูก: validation-rules.json configuration
   → เพราะอะไร: Email regex สำหรับ international vs Thailand, Phone number formats

10. "OMG BUT IT'S JUST CSS/STYLE CONSTANTS!"
    → ไม่ยอมรับ! Design systems และ theme ต้องเปลี่ยนได้ตาม brand guidelines หรือ A/B testing
    → แก้ถูก: CSS variables, theme configuration, design tokens
    → เพราะอะไร: White-label applications, dark/light themes, accessibility variants

11. "DUDE! IT'S JUST ERROR MESSAGE STRINGS!"
    → ไม่ยอมรับ! Error messages ต้องแปลได้และเปลี่ยนตาม user persona
    → แก้ถูก: i18n configuration หรือ error-messages.json
    → เพราะอะไร: Multi-language, user-friendly vs technical messages

12. "BRO, IT'S JUST FEATURE FLAG BOOLEAN VALUES!"
    → ไม่ยอมรับ! Feature flags ต้องควบคุมจาก runtime configuration
    → แก้ถูก: Feature flag service หรือ FEATURE_* environment variables
    → เพราะอะไร: Progressive rollout, A/B testing, instant rollback without deployment

GOLDEN RULE สำหรับตรวจสอบ: 
ถ้า DevOps, QA, Security, Business, หรือ Customer Support team ต้องการเปลี่ยนค่านี้โดยไม่ต้องรอ developer แก้โค้ด + code review + build + deploy ใหม่ 
= ค่านั้นต้องเป็น configuration ไม่ใช่ hardcode

ไม่มีข้อยกเว้น ไม่มีเหตุผลพิเศษ ไม่มี "แต่มันแค่..." - ZERO HARDCODED VALUES

*** การปิดช่องโหว่ทุกรูปแบบ - LOOPHOLE CLOSURE ***

เหตุผลที่คนอยากใช้ hardcode และการปิดช่องโหว่ (เวอร์ชันภาษาไทย):

1. "เฮ้ย! แต่มันแค่ localhost URL สำหรับพัฒนานะ!"
   → ไม่ยอมรับ! ทันทีที่เขียน localhost แล้ว Junior Developer คนอื่นจะคิดว่าต่อจากนี้ localhost ทั้งหมดใส่ hardcode ได้
   → แก้ถูก: DEFAULT_DEV_URL = process.env.DEV_URL || 'http://localhost:3000'
   → เพราะอะไร: โครงการใหญ่มักมี multiple localhost environments ที่ต่าง port กัน

2. "อะ! แต่มันแค่สำหรับ unit testing นี่!"
   → ไม่ยอมรับ! Test fixtures และ mock data ต้องอยู่ในไฟล์แยก หรือ test-specific configuration
   → แก้ถูก: fixtures/test-urls.json, test-config.js หรือใช้ jest.setupFiles
   → เพราะอะไร: Hardcode ใน test ทำให้เปลี่ยน test environment ไม่ได้

3. "เฮ้ย! แต่มันแค่ timeout constant นะ!"
   → ไม่ยอมรับ! Timeout behavior ต้องเปลี่ยนได้ตาม network conditions ของแต่ละ environment
   → แก้ถูก: config.timeouts.httpRequest ที่มี default แต่ override ได้
   → เพราะอะไร: Production อาจต้อง 30 วินาที, Development ต้อง 5 วินาที, Testing ต้อง 1 วินาที

4. "อะ! แต่มันแค่ database schema name!"
   → ไม่ยอมรับ! Database naming convention ต่างกันใน environment ต่างๆ
   → แก้ถูก: DB_SCHEMA environment variable with tenant-specific หรือ environment-specific naming
   → เพราะอะไร: Multi-tenant และ environment isolation

5. "เฮ้ย! แต่มันแค่ third-party OAuth redirect URL!"
   → ไม่ยอมรับ! OAuth configuration เปลี่ยนตาม domain และ environment
   → แก้ถูก: OAUTH_REDIRECT_BASE + computed path based on current domain
   → เพราะอะไร: Staging, QA, Production มี different domains

6. "อะ! แต่มันแค่ file path ธรรมดา!"
   → ไม่ยอมรับ! File paths ต่างกันใน Windows/Linux และ container environments
   → แก้ถูก: path.join(process.env.DATA_DIR || './data', filename)
   → เพราะอะไร: Development: ./data, Production: /app/data, Docker: /var/app/data

7. "เฮ้ย! แต่มันแค่ industry-standard ports!"
   → ไม่ยอมรับ! "Standard" ports อาจถูกใช้โดย service อื่น หรือ blocked โดย firewall
   → แก้ถูก: PORT configuration ที่มี default แต่ override ได้
   → เพราะอะไร: Production ใช้ port 8080, Development ใช้ 3000, Docker ใช้ 80

8. "อะ! แต่มันแค่ magic numbers สำหรับ business logic!"
   → ไม่ยอมรับ! Business rules เปลี่ยนและต้อง externalize เพื่อให้ business team แก้ได้โดยไม่ผ่าน engineering
   → แก้ถูก: BUSINESS_RULES configuration หรือ feature flags
   → เพราะอะไร: "ส่งฟรีจาก 500 บาท" อาจเปลี่ยนเป็น 800 บาทโดยไม่แก้โค้ด

9. "เฮ้ย! แต่มันแค่ regex validation patterns!"
   → ไม่ยอมรับ! Validation rules เปลี่ยนตาม country, regulations และ business requirements
   → แก้ถูก: validation-rules.json configuration
   → เพราะอะไร: Email regex สำหรับ international vs Thailand, Phone number formats

10. "อะ! แต่มันแค่ CSS/style constants!"
    → ไม่ยอมรับ! Design systems และ theme ต้องเปลี่ยนได้ตาม brand guidelines หรือ A/B testing
    → แก้ถูก: CSS variables, theme configuration, design tokens
    → เพราะอะไร: White-label applications, dark/light themes, accessibility variants

11. "เฮ้ย! แต่มันแค่ error message strings!"
    → ไม่ยอมรับ! Error messages ต้องแปลได้และเปลี่ยนตาม user persona
    → แก้ถูก: i18n configuration หรือ error-messages.json
    → เพราะอะไร: Multi-language, user-friendly vs technical messages

12. "อะ! แต่มันแค่ feature flag boolean values!"
    → ไม่ยอมรับ! Feature flags ต้องควบคุมจาก runtime configuration
    → แก้ถูก: Feature flag service หรือ FEATURE_* environment variables
    → เพราะอะไร: Progressive rollout, A/B testing, instant rollback without deployment

กฎทองสำหรับตรวจสอบ (ภาษาไทย): 
ถ้าทีม DevOps, QA, Security, Business, หรือ Customer Support ต้องการเปลี่ยนค่านี้โดยไม่ต้องรอนักพัฒนาแก้โค้ด + code review + build + deploy ใหม่ 
= ค่านั้นต้องเป็น configuration ไม่ใช่ hardcode

ไม่มีข้อยกเว้น ไม่มีเหตุผลพิเศษ ไม่มี "แต่มันแค่..." - ห้าม HARDCODE เด็ดขาด`
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

            // ═══════════════════════════════════════════════════════════════════
            // ADVANCED HARDCODE PATTERNS - ซับซ้อนและแอบแฝง
            // ═══════════════════════════════════════════════════════════════════

            // Conditional hardcoding (environment-specific values)
            {
                regex: /(?:isProd|isProduction|isStaging|isDev|isTest)\s*\?\s*['"][^'"]+['"]\s*:\s*['"][^'"]+['"]/i,
                name: 'Conditional environment-specific hardcoded values',
                severity: 'ERROR'
            },
            {
                regex: /process\.env\.NODE_ENV\s*===\s*['"]production['"]\s*\?\s*['"][^'"]+['"]/i,
                name: 'Production environment conditional hardcode',
                severity: 'ERROR'
            },
            {
                regex: /switch\s*\(\s*(?:env|environment|stage)\s*\)\s*\{[\s\S]*case\s*['"][^'"]+['"]\s*:\s*return\s*['"][^'"]+['"]/i,
                name: 'Switch statement with hardcoded environment values',
                severity: 'ERROR'
            },

            // Business logic hardcoding
            {
                regex: /(?:const|let|var)\s+(?:MAX|MIN)_[A-Z_]+\s*=\s*[0-9]+/,
                name: 'Hardcoded business rule limits (MAX_/MIN_)',
                severity: 'WARNING'
            },
            {
                regex: /(?:TAX_RATE|FEE_PERCENTAGE|COMMISSION_RATE)\s*=\s*[0-9.]+/i,
                name: 'Hardcoded business rates/percentages',
                severity: 'ERROR'
            },
            {
                regex: /(?:CURRENCY|LOCALE|TIMEZONE)\s*=\s*['"][^'"]+['"]/i,
                name: 'Hardcoded localization settings',
                severity: 'ERROR'
            },

            // Security bypass patterns
            {
                regex: /if\s*\(\s*(?:password|token|key)\s*===\s*['"][^'"]+['"]\s*\)/i,
                name: 'Hardcoded security bypass condition',
                severity: 'ERROR'
            },
            {
                regex: /(?:backdoor|bypass|skip_auth|disable_security)\s*=\s*true/i,
                name: 'Hardcoded security bypass flag',
                severity: 'ERROR'
            },
            {
                regex: /userId\s*===\s*['"](?:admin|root|test|debug)['"]/i,
                name: 'Hardcoded special user ID check',
                severity: 'ERROR'
            },

            // Algorithm parameters
            {
                regex: /(?:RETRY_ATTEMPTS|MAX_RETRIES|RETRY_COUNT)\s*=\s*[0-9]+/i,
                name: 'Hardcoded retry parameters',
                severity: 'WARNING'
            },
            {
                regex: /(?:TIMEOUT|DELAY|INTERVAL)_\w+\s*=\s*[0-9]+/i,
                name: 'Hardcoded timing parameters',
                severity: 'WARNING'
            },
            {
                regex: /(?:BUFFER_SIZE|CHUNK_SIZE|PAGE_SIZE)\s*=\s*[0-9]+/i,
                name: 'Hardcoded size parameters',
                severity: 'WARNING'
            },

            // Feature flags and toggles
            {
                regex: /(?:ENABLE|DISABLE)_[A-Z_]+\s*=\s*(?:true|false)/,
                name: 'Hardcoded feature flags',
                severity: 'WARNING'
            },
            {
                regex: /if\s*\(\s*FEATURE_FLAG_\w+\s*\)/,
                name: 'Hardcoded feature flag usage',
                severity: 'WARNING'
            },
            {
                regex: /\.(?:beta|alpha|experimental|preview)\s*=\s*(?:true|false)/i,
                name: 'Hardcoded experimental feature flags',
                severity: 'WARNING'
            },

            // Mock/Test data that might leak to production
            {
                regex: /(?:const|let|var)\s+(?:MOCK|FAKE|TEST)_\w+\s*=\s*['"][^'"]+['"]/i,
                name: 'Hardcoded mock/test data (potential production leak)',
                severity: 'WARNING'
            },
            {
                regex: /return\s*\{\s*success:\s*true\s*\}\s*;.*\/\/.*(?:mock|fake|test)/i,
                name: 'Hardcoded fake success response',
                severity: 'ERROR'
            },
            {
                regex: /if\s*\(\s*process\.env\.NODE_ENV\s*===\s*['"]test['\"]\s*\)\s*return\s*['"][^'"]*['"]/i,
                name: 'Hardcoded test environment bypass',
                severity: 'ERROR'
            },

            // Resource and service discovery hardcoding
            {
                regex: /['"][a-zA-Z0-9-]+\.(?:local|internal|k8s|cluster\.local)[^'"]*['"]/,
                name: 'Hardcoded internal service hostname',
                severity: 'ERROR'
            },
            {
                regex: /['"](?:redis|memcached|elasticsearch|mongodb):\/\/[^'"]+['"]/i,
                name: 'Hardcoded service connection string',
                severity: 'ERROR'
            },
            {
                regex: /service_discovery\s*=\s*false/i,
                name: 'Hardcoded service discovery disabled',
                severity: 'WARNING'
            },

            // Compliance and audit hardcoding
            {
                regex: /(?:LOG_RETENTION|AUDIT_PERIOD|RETENTION_DAYS)\s*=\s*[0-9]+/i,
                name: 'Hardcoded compliance retention periods',
                severity: 'ERROR'
            },
            {
                regex: /(?:GDPR|HIPAA|SOX|PCI)_COMPLIANT\s*=\s*(?:true|false)/i,
                name: 'Hardcoded compliance flags',
                severity: 'ERROR'
            },

            // Performance and scaling hardcoding
            {
                regex: /(?:MAX_CONCURRENT|POOL_SIZE|WORKER_COUNT)\s*=\s*[0-9]+/i,
                name: 'Hardcoded concurrency limits',
                severity: 'WARNING'
            },
            {
                regex: /(?:MEMORY_LIMIT|CPU_LIMIT)_\w+\s*=\s*[0-9]+/i,
                name: 'Hardcoded resource limits',
                severity: 'WARNING'
            },

            // Schedule and cron hardcoding
            {
                regex: /['"][0-9\s\*\/\-\,]+\s+[0-9\s\*\/\-\,]+\s+[0-9\s\*\/\-\,]+\s+[0-9\s\*\/\-\,]+\s+[0-9\s\*\/\-\,]+['"]/,
                name: 'Hardcoded cron schedule pattern',
                severity: 'WARNING'
            },
            {
                regex: /(?:MAINTENANCE_WINDOW|BACKUP_TIME)\s*=\s*['"][^'"]+['"]/i,
                name: 'Hardcoded maintenance schedule',
                severity: 'WARNING'
            },

            // Default function parameters hiding config
            {
                regex: /function\s+\w+\s*\([^)]*=\s*['"][^'"]+['"][^)]*\)/,
                name: 'Function default parameter with hardcoded value',
                severity: 'WARNING'
            },
            {
                regex: /\w+\s*=\s*\{\s*\w+:\s*['"][^'"]+['"]/,
                name: 'Object literal with hardcoded default values',
                severity: 'WARNING'
            },

            // Regular expression patterns that should be configurable
            {
                regex: /new\s+RegExp\s*\(\s*['"][^'"]+['"]\s*\)/,
                name: 'Hardcoded RegExp pattern (should be configurable)',
                severity: 'WARNING'
            },
            {
                regex: /\/[^\/\n]+\/[gimuy]*\s*\.test\s*\(/,
                name: 'Hardcoded regex pattern in test',
                severity: 'WARNING'
            },

            // Mathematical constants in business logic
            {
                regex: /\*\s*(?:0\.07|0\.08|0\.10|0\.15|0\.20|0\.25)/,
                name: 'Hardcoded percentage multiplier (likely tax/fee rate)',
                severity: 'WARNING'
            },
            {
                regex: /(?:\+|\-)\s*(?:86400|3600|1800|900)\b/,
                name: 'Hardcoded time offset in seconds',
                severity: 'WARNING'
            }
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
            en: `ABSOLUTE PHILOSOPHY: "SILENCE IS A FORM OF DAMAGE"
            
In complex systems, "NO DATA" is better than "UNRELIABLE DATA". When a system crashes, that's a clear and useful signal. It creates Logs, Alerts and forces us to fix things. But when a system continues running silently with incorrect data or default values, that's creating Silent Catastrophe that will gradually destroy data and system reliability.

This rule forces us to acknowledge that Errors are not things to hide, but the MOST VALUABLE information a system can give us for improvement.

DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS:

FLAWED LOGIC: "I just don't want the app to crash in front of users, so I return empty values first"
REAL ANSWER: You're not preventing crashes, you're just "postponing when it will crash" to a point far from the problem's source, making debugging 100x harder. The correct way is catching Errors at the top Layer, showing user-friendly "We apologize for the inconvenience" message, and sending aggressive Alerts to the development team immediately.

FLAWED LOGIC: "It's a predictable and unimportant Error, so I catch and let it pass"
REAL ANSWER: Errors that occur frequently but are ignored are signals of performance issues or design flaws. Logging every occurrence will help us see patterns and fix at root cause. NO Error is unimportant.

GOLDEN RULE FOR VERIFICATION:
"If code in this catch block runs at 3 AM on Sunday night, will it make enough noise to wake someone on the team? If not, it's a bug waiting to grow."

CONCLUSION WITHOUT EXCEPTIONS:
Every catch block must end with either throw or log.error() with complete details. Any return value that allows the next line of code to continue as if nothing happened is absolutely forbidden.

LEGACY PHILOSOPHY & DEEPER RATIONALE:
Systems that fail incorrectly should "FAIL FAST, FAIL LOUD" (ล้มเร็ว ส่งเสียงดัง). Error swallowing or silently returning defaults creates "ZOMBIE SYSTEMS" - systems that appear to work externally but are internally corrupting data and malfunctioning continuously.

This rule forces us to accept the reality that "ERRORS HAPPEN" and our responsibility is to make errors DETECTABLE, LOGGED, and ALERTABLE - not to hide them under the carpet.

HIDDEN DANGERS:
1) SILENT DATA CORRUPTION (ข้อมูลเสียหายแบบเงียบ): Functions that should fetch user data encounter errors but return null or {}, causing other parts of system to save empty/incorrect data to database
2) IMPOSSIBLE DEBUGGING (การ Debug เป็นไปไม่ได้): When major production issues occur, we find NO logs, NO stack traces, NO breadcrumbs pointing to root cause - complete investigative blindness
3) CASCADING FAILURES (ปัญหาลุกลามแบบลูกโซ่): Small hidden problems gradually affect other system parts until entire system collapses, with no way to trace back to original cause
4) MEANINGLESS MONITORING (การ Monitor ไร้ความหมาย): Dashboard monitoring shows system "healthy" (green) while internally hundreds of errors are occurring silently
5) SECURITY AUDIT FAILURES (ตรวจสอบความปลอดภัยล้มเหลว): Attack attempts, intrusions, unauthorized access hidden because errors not logged - compliance violations for SOX, PCI-DSS, HIPAA
6) FALSE SUCCESS METRICS (ตัวชี้วัดความสำเร็จเท็จ): Business metrics inflated because failures hidden - management makes decisions based on false data
7) CUSTOMER TRUST EROSION (ความไว้วางใจลูกค้าสึกกร่อน): Customers experience problems but system shows "everything working" - creates trust gap
8) DISASTER RECOVERY IMPOSSIBILITY (ฟื้นฟูหายนะไม่ได้): During outages, cannot determine failure patterns or root causes because error history was silently discarded
9) TECHNICAL DEBT EXPLOSION (หนี้เทคนิคระเบิด): Problems accumulate silently until system becomes unmaintainable, requiring complete rewrite
10) COMPLIANCE VIOLATIONS (ละเมิดกฎระเบียม): Regulations require audit trails of all errors - silent failures violate legal requirements

LITMUS TEST:
Ask yourself: "If the code in this catch block or after this || executes at 3 AM on Saturday night, will I know about it (like getting PagerDuty/Slack alert)?"
- If answer is "NO": You're violating NO_SILENT_FALLBACKS
- If answer is "YES": You're doing it right

THE ABSOLUTE SOLUTION:
Follow "Error Handling Contract" (สัญญาการจัดการข้อผิดพลาด):

Every catch MUST do exactly 2 things:
1. Log a structured error: Record error with full context
   logger.error({ message: 'Failed to process user data', error, userId, timestamp });
   
2. Throw or Propagate: Either throw error forward for higher layer to handle, or return explicit error representation
   throw error; // OR return { success: false, error: 'Clear error message' };

NEVER return values that look like success:

// BAD: Hides that config might not exist
const timeout = config.timeout || 3000;

// GOOD: Check explicitly and fail loud if missing
const timeout = config.timeout;
if (timeout === undefined) {
  logger.error('Configuration for "timeout" is missing.');
  throw new Error('Missing required configuration: timeout');
}

Every Promise MUST have .catch(): Uncaught promises are time bombs (unhandledRejection)

Zero tolerance for || and ?? without explicit error checking when dealing with critical data.`,
            th: `ปรัชญาที่เด็ดขาด: "ความเงียบคือรูปแบบหนึ่งของความเสียหาย"
            
ในระบบที่ซับซ้อน "ไม่มีข้อมูล" ยังดีกว่า "ข้อมูลที่ไม่น่าเชื่อถือ" การที่ระบบล่ม (Crash) คือสัญญาณที่ชัดเจนและมีประโยชน์ มันสร้าง Log, Alert และบังคับให้เราต้องแก้ไข แต่การที่ระบบทำงานต่อไปเงียบๆ ด้วยข้อมูลที่ไม่ถูกต้องหรือค่า Default คือ การสร้างหายนะแบบเงียบ (Silent Catastrophe) ที่จะค่อยๆ ทำลายข้อมูลและความน่าเชื่อถือของทั้งระบบ

กฎนี้บังคับให้เรายอมรับว่า Error ไม่ใช่สิ่งที่ต้องซ่อน แต่เป็นข้อมูลที่มีค่าที่สุด ที่ระบบสามารถมอบให้เราได้เพื่อใช้ในการปรับปรุง

ตรรกะวิบัติของนักพัฒนาและคำตอบที่แท้จริง:

ตรรกะวิบัติ: "ผมแค่ไม่อยากให้แอปพังต่อหน้าผู้ใช้ ผมเลยคืนค่าว่างๆ กลับไปก่อน"
คำตอบที่แท้จริง: คุณไม่ได้ป้องกันแอปพัง คุณแค่ "เลื่อนเวลาที่มันจะพัง" ไปยังจุดที่ห่างไกลจากต้นตอของปัญหา ทำให้การดีบักยากขึ้นเป็นร้อยเท่า วิธีที่ถูกต้องคือการดักจับ Error ที่ Layer บนสุด, แสดงข้อความ "ขออภัยในความไม่สะดวก" ที่เป็นมิตรต่อผู้ใช้, และส่ง Alert ที่เกรี้ยวกราดไปยังทีมพัฒนาทันที

ตรรกะวิบัติ: "มันเป็น Error ที่คาดเดาได้และไม่สำคัญ ผมเลย catch แล้วปล่อยผ่าน"
คำตอบที่แท้จริง: Error ที่เกิดขึ้นบ่อยครั้งแต่ถูกเพิกเฉย คือสัญญาณของปัญหาเชิงประสิทธิภาพหรือการออกแบบที่ผิดพลาด การ Log ทุกครั้งที่มันเกิดขึ้นจะทำให้เราเห็นแพตเทิร์นและแก้ไขที่ต้นเหตุได้ ไม่มี Error ใดที่ไม่สำคัญ

กฎทองสำหรับตรวจสอบ:
"ถ้าโค้ดในบล็อก catch นี้ทำงานตอนตีสามของคืนวันอาทิตย์ มันจะส่งเสียงดังพอที่จะปลุกใครสักคนในทีมได้หรือไม่? ถ้าไม่ มันคือบั๊กที่รอวันเติบโต"

บทสรุปที่ไม่มีข้อยกเว้น:
ทุกบล็อก catch ต้องจบด้วยการ throw หรือการ log.error() ที่มีรายละเอียดครบถ้วน การคืนค่าใดๆ ที่ทำให้โค้ดบรรทัดถัดไปทำงานต่อได้เสมือนว่าไม่มีอะไรเกิดขึ้น คือสิ่งต้องห้ามเด็ดขาด

ปรัชญาและเหตุผลเชิงลึกดั้งเดิม:
ระบบที่ทำงานผิดควร "ล้มเร็ว ส่งเสียงดัง" (FAIL FAST, FAIL LOUD) การกลืน Error หรือคืนค่า default แบบเงียบๆ สร้าง "ระบบซอมบี้" - ระบบที่ดูเหมือนทำงานปกติภายนอก แต่ภายในกำลังทำลายข้อมูลและทำงานผิดพลาดต่อเนื่อง

กฎนี้บังคับให้เรายอมรับความจริงว่า "ข้อผิดพลาดเกิดขึ้นได้" และหน้าที่ของเราคือทำให้ข้อผิดพลาดนั้น DETECTABLE (ตรวจจับได้), LOGGED (บันทึกไว้), และ ALERTABLE (แจ้งเตือนได้) - ไม่ใช่ซ่อนใต้พรม

อันตรายที่ซ่อนอยู่:
1) ข้อมูลเสียหายแบบเงียบ: ฟังก์ชันที่ควรดึงข้อมูลผู้ใช้เจอ error แต่คืน null หรือ {} ทำให้ส่วนอื่นของระบบบันทึกข้อมูลเปล่า/ผิดลง database
2) การ Debug เป็นไปไม่ได้: เมื่อเกิดปัญหาใหญ่ใน production ไม่เจอ logs, stack traces, breadcrumbs ที่ชี้ไปต้นตอปัญหา - ตาบอดในการสืบสวน
3) ปัญหาลุกลามแบบลูกโซ่: ปัญหาเล็กที่ซ่อนอยู่ค่อยๆ ส่งผลต่อส่วนอื่นของระบบจนทั้งระบบล่ม โดยไม่สามารถตาม trace กลับไปต้นตอได้
4) การ Monitor ไร้ความหมาย: Dashboard แสดงระบบ "สุขภาพดี" (สีเขียว) ขณะที่ภายในเกิด error หลายร้อยครั้งแบบเงียบ
5) ตรวจสอบความปลอดภัยล้มเหลว: ความพยายามโจมตี, การบุกรุก, การเข้าถึงโดยไม่ได้รับอนุญาตถูกซ่อนเพราะไม่ log error - ละเมิดมาตรฐาน SOX, PCI-DSS, HIPAA
6) ตัวชี้วัดความสำเร็จเท็จ: ตัวชี้วัดธุรกิจสูงเกินจริงเพราะความล้มเหลวถูกซ่อน - ผู้บริหารตัดสินใจด้วยข้อมูลเท็จ
7) ความไว้วงใจลูกค้าสึกกร่อน: ลูกค้าประสบปัญหาแต่ระบบแสดง "ทุกอย่างทำงานปกติ" - สร้างช่องว่างความไว้วางใจ
8) ฟื้นฟูหายนะไม่ได้: เมื่อเกิดเหตุขัดข้อง ไม่สามารถระบุรูปแบบความล้มเหลวหรือต้นตอได้เพราะประวัติ error ถูกทิ้งแบบเงียบ
9) หนี้เทคนิคระเบิด: ปัญหาสะสมแบบเงียบจนระบบดูแลไม่ได้ ต้องเขียนใหม่ทั้งหมด
10) ละเมิดกฎระเบียม: กฎหมายกำหนดให้มี audit trail ของ error ทั้งหมด - silent failure ละเมิดข้อกำหนดทางกฎหมาย

วิธีทดสอบความคิด (Litmus Test):
ถามตัวเอง: "ถ้าโค้ดใน catch block หรือหลัง || นี้ทำงานตอนตี 3 คืนวันเสาร์ ฉันจะรู้เรื่องหรือไม่ (เช่น มี alert วิ่งเข้า PagerDuty/Slack)?"
- ถ้าตอบ "ไม่": คุณละเมิด NO_SILENT_FALLBACKS
- ถ้าตอบ "ใช่": คุณทำถูกต้อง

วิธีแก้ไขสมบูรณ์:
ปฏิบัติตาม "สัญญาการจัดการข้อผิดพลาด":

ทุก catch ต้องทำ 2 อย่างเสมอ:
1. Log structured error: บันทึก error พร้อม context เต็ม
   logger.error({ message: 'Failed to process user data', error, userId, timestamp });
   
2. Throw หรือ Propagate: throw error ต่อไปให้ layer สูงกว่าจัดการ หรือคืนค่าแทน error ที่ชัดเจน
   throw error; // หรือ return { success: false, error: 'ข้อความ error ชัดเจน' };

ห้ามคืนค่าที่ดูเหมือนสำเร็จ:

// ไม่ดี: ซ่อนว่า config อาจไม่มี
const timeout = config.timeout || 3000;

// ดี: เช็คชัดเจนและ fail loud ถ้าไม่มี
const timeout = config.timeout;
if (timeout === undefined) {
  logger.error('Configuration for "timeout" is missing.');
  throw new Error('Missing required configuration: timeout');
}

ทุก Promise ต้องมี .catch(): Promise ที่ไม่จับ error คือระเบิดเวลา (unhandledRejection)

ไม่ยอมรับ || และ ?? โดยไม่เช็ค error อย่างชัดเจนเมื่อจัดการข้อมูลสำคัญ

*** LOOPHOLE CLOSURE - การปิดช่องโหว่ทุกรูปแบบ ***

เหตุผลที่คนอยากใช้ silent fallback และการปิดช่องโหว่:

1. "OMG BUT IT'S JUST FOR GRACEFUL DEGRADATION!"
   → ไม่ยอมรับ! Graceful degradation ต้อง OBSERVABLE และมี ALERTS ไม่ใช่ silent
   → แก้ถูก: Log ทุก degradation พร้อม alert และ fallback indicator ให้ monitoring team เห็น
   → เพราะอะไร: Silent degradation กลายเป็น technical debt และ production issue ที่ไม่มีใครสังเกต

2. "DUDE! IT'S JUST A DEFAULT VALUE FOR CONVENIENCE!"
   → ไม่ยอมรับ! Default value ต้องมีเหตุผลที่ดีและถูก document อย่างชัดเจน
   → แก้ถูก: Explicit defaults ใน configuration พร้อม validation ว่าค่านั้นเหมาะสมหรือไม่
   → เพราะอะไร: Default ที่ implicit อาจไม่เหมาะกับ environment หรือ use case ปัจจุบัน

3. "BRO, IT'S JUST A RETRY MECHANISM!"
   → ไม่ยอมรับ! Retry ต้องมี circuit breaker และ monitoring ไม่ใช่ retry แล้วปิดเงียบ
   → แก้ถูก: Structured retry policy พร้อม exponential backoff และ fail after N attempts พร้อม alert
   → เพราะอะไร: Infinite silent retry กิน resource และ mask serious infrastructure problems

4. "OMG BUT IT'S JUST FOR NON-CRITICAL FEATURES!"
   → ไม่ยอมรับ! "Non-critical" เป็น business decision ไม่ใช่ engineering decision - ต้อง explicit
   → แก้ถูก: Feature flag configuration พร้อม graceful disable notification ให้ user
   → เพราะอะไร: Features ที่คิดว่า non-critical อาจ critical สำหรับ specific user segment

5. "DUDE! IT'S JUST FOR CACHE MISS SCENARIOS!"
   → ไม่ยอมรับ! Cache miss ต้อง logged และ monitored เพื่อ tune cache strategy
   → แก้ถูก: Cache miss พร้อม metrics และ fallback to primary data source with performance tracking
   → เพราะอะไร: Silent cache miss ป้องกันการ optimize cache hit ratio

6. "BRO, IT'S JUST A FALLBACK UI COMPONENT!"
   → ไม่ยอมรับ! UI fallback ต้อง show error boundary พร้อม error reporting ไม่ใช่แสดง component ธรรมดา
   → แก้ถูก: Error boundary component พร้อม user-friendly error message และ error reporting to monitoring
   → เพราะอะไร: Silent UI fallback ทำให้ user confused และ developer ไม่รู้ว่ามี error

7. "OMG BUT IT'S JUST FOR OPTIONAL API FIELDS!"
   → ไม่ยอมรับ! Optional fields ต้อง validate ว่าจริงๆ optional หรือเป็น breaking change ที่ไม่ได้ detect
   → แก้ถูก: API schema validation พร้อม deprecation warnings สำหรับ missing optional fields
   → เพราะอะไร: Fields ที่ควรจะมีแต่หายไป อาจเป็น API version mismatch หรือ data corruption

8. "DUDE! IT'S JUST FOR BACKWARD COMPATIBILITY!"
   → ไม่ยอมรับ! Backward compatibility ต้องมี deprecation timeline และ migration path ไม่ใช่ silent forever
   → แก้ถูก: Versioned compatibility layer พร้อม deprecation warnings และ migration guidance
   → เพราะอะไร: Silent backward compatibility ป้องกัน technology stack evolution และ security updates

9. "BRO, IT'S JUST FOR A/B TESTING FALLBACK!"
   → ไม่ยอมรับ! A/B test fallback ต้อง tracked เพื่อ measure control group ไม่ใช่ silent default
   → แก้ถูก: A/B testing framework พร้อม explicit control group tracking และ experiment analytics
   → เพราะอะไร: Silent fallback ทำให้ experiment results invalid และ statistical significance calculation ผิด

10. "OMG BUT IT'S JUST FOR THIRD-PARTY SERVICE DOWNTIME!"
    → ไม่ยอมรับ! Third-party downtime ต้อง alert operations team และ consider circuit breaker
    → แก้ถูก: Service health check พร้อม circuit breaker pattern และ escalation to operations
    → เพราะอะไร: Silent third-party failure ป้องกัน proactive vendor management และ SLA enforcement

11. "DUDE! IT'S JUST FOR DATABASE READ REPLICA FAILURES!"
    → ไม่ยอมรับ! Replica failure ต้อง switch to primary พร้อม DBA notification
    → แก้ถูก: Database connection pool พร้อม automatic failover และ database health monitoring
    → เพราะอะไร: Silent replica failure อาจ indicate infrastructure problem ที่ต้อง urgent fix

12. "BRO, IT'S JUST FOR RATE LIMITING SCENARIOS!"
    → ไม่ยอมรับ! Rate limit hit ต้อง logged และ consider exponential backoff ไม่ใช่ silent skip
    → แก้ถูก: Rate limiting พร้อม proper HTTP status codes, retry headers และ client-side queue management
    → เพราะอะไร: Silent rate limiting ทำให้ client ไม่รู้ว่า service overloaded

GOLDEN RULE สำหรับตรวจสอบ:
ถ้า error/fallback เกิดขึ้นตอน 3 AM วันอาทิตย์ และไม่มีคน on-call ได้รับ notification
= คุณกำลังซ่อนปัญหาที่อาจ cascade เป็น major incident ภายหลัง

ไม่มี "แต่มันไม่สำคัญ" - ทุก failure mode ต้อง observable และ actionable
ZERO SILENT FAILURES - FAIL LOUD OR DON'T FAIL

*** การปิดช่องโหว่ทุกรูปแบบ - LOOPHOLE CLOSURE (เวอร์ชันภาษาไทย) ***

เหตุผลที่คนอยากใช้ silent fallback และการปิดช่องโหว่:

1. "เฮ้ย! แต่มันแค่ graceful degradation นะ!"
   → ไม่ยอมรับ! Graceful degradation ต้อง OBSERVABLE และมี ALERTS ไม่ใช่ silent
   → แก้ถูก: Log ทุก degradation พร้อม alert และ fallback indicator ให้ monitoring team เห็น
   → เพราะอะไร: Silent degradation กลายเป็น technical debt และ production issue ที่ไม่มีใครสังเกต

2. "อะ! แต่มันแค่ default value เพื่อความสะดวก!"
   → ไม่ยอมรับ! Default value ต้องมีเหตุผลที่ดีและถูก document อย่างชัดเจน
   → แก้ถูก: Explicit defaults ใน configuration พร้อม validation ว่าค่านั้นเหมาะสมหรือไม่
   → เพราะอะไร: Default ที่ implicit อาจไม่เหมาะกับ environment หรือ use case ปัจจุบัน

3. "เฮ้ย! แต่มันแค่ retry mechanism!"
   → ไม่ยอมรับ! Retry ต้องมี circuit breaker และ monitoring ไม่ใช่ retry แล้วปิดเงียบ
   → แก้ถูก: Structured retry policy พร้อม exponential backoff และ fail after N attempts พร้อม alert
   → เพราะอะไร: Infinite silent retry กิน resource และ mask serious infrastructure problems

4. "อะ! แต่มันแค่ feature ที่ไม่สำคัญ!"
   → ไม่ยอมรับ! "ไม่สำคัญ" เป็น business decision ไม่ใช่ engineering decision - ต้อง explicit
   → แก้ถูก: Feature flag configuration พร้อม graceful disable notification ให้ user
   → เพราะอะไร: Features ที่คิดว่าไม่สำคัญ อาจสำคัญมากสำหรับ specific user segment

5. "เฮ้ย! แต่มันแค่ cache miss scenarios!"
   → ไม่ยอมรับ! Cache miss ต้อง logged และ monitored เพื่อ tune cache strategy
   → แก้ถูก: Cache miss พร้อม metrics และ fallback to primary data source with performance tracking
   → เพราะอะไร: Silent cache miss ป้องกันการ optimize cache hit ratio

6. "อะ! แต่มันแค่ fallback UI component!"
   → ไม่ยอมรับ! UI fallback ต้อง show error boundary พร้อม error reporting ไม่ใช่แสดง component ธรรมดา
   → แก้ถูก: Error boundary component พร้อม user-friendly error message และ error reporting to monitoring
   → เพราะอะไร: Silent UI fallback ทำให้ user งงและ developer ไม่รู้ว่ามี error

7. "เฮ้ย! แต่มันแค่ optional API fields!"
   → ไม่ยอมรับ! Optional fields ต้อง validate ว่าจริงๆ optional หรือเป็น breaking change ที่ไม่ได้ detect
   → แก้ถูก: API schema validation พร้อม deprecation warnings สำหรับ missing optional fields
   → เพราะอะไร: Fields ที่ควรจะมีแต่หายไป อาจเป็น API version mismatch หรือ data corruption

8. "อะ! แต่มันแค่ backward compatibility!"
   → ไม่ยอมรับ! Backward compatibility ต้องมี deprecation timeline และ migration path ไม่ใช่ silent forever
   → แก้ถูก: Versioned compatibility layer พร้อม deprecation warnings และ migration guidance
   → เพราะอะไร: Silent backward compatibility ป้องกัน technology stack evolution และ security updates

9. "เฮ้ย! แต่มันแค่ A/B testing fallback!"
   → ไม่ยอมรับ! A/B test fallback ต้อง tracked เพื่อ measure control group ไม่ใช่ silent default
   → แก้ถูก: A/B testing framework พร้อม explicit control group tracking และ experiment analytics
   → เพราะอะไร: Silent fallback ทำให้ experiment results invalid และ statistical significance calculation ผิด

10. "อะ! แต่มันแค่ third-party service downtime!"
    → ไม่ยอมรับ! Third-party downtime ต้อง alert operations team และ consider circuit breaker
    → แก้ถูก: Service health check พร้อม circuit breaker pattern และ escalation to operations
    → เพราะอะไร: Silent third-party failure ป้องกัน proactive vendor management และ SLA enforcement

11. "เฮ้ย! แต่มันแค่ database read replica failures!"
    → ไม่ยอมรับ! Replica failure ต้อง switch to primary พร้อม DBA notification
    → แก้ถูก: Database connection pool พร้อม automatic failover และ database health monitoring
    → เพราะอะไร: Silent replica failure อาจ indicate infrastructure problem ที่ต้อง urgent fix

12. "อะ! แต่มันแค่ rate limiting scenarios!"
    → ไม่ยอมรับ! Rate limit hit ต้อง logged และ consider exponential backoff ไม่ใช่ silent skip
    → แก้ถูก: Rate limiting พร้อม proper HTTP status codes, retry headers และ client-side queue management
    → เพราะอะไร: Silent rate limiting ทำให้ client ไม่รู้ว่า service โอเวอร์โหลด

กฎทองสำหรับตรวจสอบ (ภาษาไทย):
ถ้า error/fallback เกิดขึ้นตอน 3 ทุ่มวันอาทิตย์ และไม่มีคน on-call ได้รับ notification
= คุณกำลังซ่อนปัญหาที่อาจ cascade เป็น major incident ภายหลัง

ไม่มี "แต่มันไม่สำคัญ" - ทุก failure mode ต้อง observable และ actionable
ห้าม SILENT FAILURES - FAIL LOUD หรือไม่ต้อง FAIL`
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
            en: `ABSOLUTE PHILOSOPHY: "CACHE IS STATE, AND STATE IS THE ENEMY OF RELIABILITY"
            
The best function is a Pure Function: Same Input always gives Same Output no matter how many times, where, or when it runs. Such functions are easy to test, predictable, and can run safely in parallel.

Internal Cache is deliberately destroying function purity. It's creating "Hidden Memory" that makes the same function return different results depending on its "execution history". This transforms what should be a simple function into a mini-application with its own State, which is a maintenance nightmare.

DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS:

FLAWED LOGIC: "But it makes this function much faster!"
REAL ANSWER: You're solving the performance problem in the wrong place. Caching is an "architecture" problem, not a "function" problem. The decision of what to cache, for how long, and when to clear should be managed from external layers (like Decorator, API Gateway, Redis) which allows us to control, monitor, and adjust caching strategies without touching Business Logic.

FLAWED LOGIC: "It's just simple memoization for repetitive calculations"
REAL ANSWER: Memoization without invalidation strategy is a Memory Leak waiting to explode. In long-running applications, that cache will grow and grow until it consumes all memory.

GOLDEN RULE FOR VERIFICATION:
"If this application is scaled to run on 10 servers simultaneously, will the cache you created still be correct and consistent across all of them? If not, it's wrong design from the start."

CONCLUSION WITHOUT EXCEPTIONS:
Your functions must have no memory. They must receive Input, process, and return Output - that's it. Let "state" and "performance" management be the responsibility of external architecture.

LEGACY PHILOSOPHY & DEEPER RATIONALE:
Functions should have SINGLE RESPONSIBILITY (do one thing only). Creating cache inside a function combines TWO separate responsibilities: Business Logic + Caching Logic. This is a "Cross-Cutting Concern" (like Logging or Authentication) that should be handled separately.

Internal caching creates HIDDEN STATE within functions, making them NON-PURE. A Pure Function should always return the same output for the same input - but cached functions return different values based on internal cache state, violating functional programming principles and making testing/debugging extremely difficult.

HIDDEN DANGERS:
1) SHARED MUTABLE STATE (สถานะแชร์ที่เปลี่ยนแปลงได้): Cache becomes global variable accessible by multiple functions/threads, creating race conditions and unpredictable behavior in concurrent environments
2) MEMORY LEAKS (หน่วยความจำรั่ว): Internal cache objects never get garbage collected because they're referenced by function closures, growing infinitely until Out of Memory (OOM) crashes
3) STALE DATA FOREVER (ข้อมูลเก่าตลอดกาล): Function has no way to know when source data changes (in database/API), so it serves outdated cached values indefinitely, causing business logic errors
4) FLAKY TESTS (เทสต์ไม่เสถียร): Tests interfere with each other through shared cache state - test order affects results, making CI/CD unpredictable and debugging impossible
5) CONCURRENCY NIGHTMARES (ฝันร้าย Concurrency): Multiple threads/processes accessing same cache create race conditions, data corruption, and deadlocks - especially problematic in Node.js cluster mode or microservices
6) DEBUGGING IMPOSSIBILITY (Debug ไม่ได้): Cannot inspect cache contents, hit/miss ratios, or performance metrics from outside - cache behavior is completely opaque
7) CONFIGURATION HELL (นรกการตั้งค่า): Cannot adjust cache size, TTL, eviction policies based on runtime conditions or performance requirements - cache behavior is hardcoded
8) TESTING ISOLATION VIOLATION (ละเมิดการแยก Test): Unit tests should be isolated, but cached functions carry state between tests, making test results dependent on execution order
9) PRODUCTION MONITORING BLINDNESS (มองไม่เห็นใน Production): Cannot monitor cache performance, identify cache misses, or tune cache behavior in production environment
10) SCALABILITY KILLER (ฆาตกร Scalability): When scaling to multiple servers/containers, each has separate internal caches, creating cache inconsistency and defeating caching purpose

LITMUS TEST:
Ask yourself: "If I need to clear this function's cache from another part of the application, can I do it without restarting the entire process?"
- If answer is "NO": You're violating NO_INTERNAL_CACHING
- If answer is "YES" (because cache is managed by Redis, Memcached, or external caching layer): You're doing it right

THE ABSOLUTE SOLUTION:
Use "Decorator Pattern" or "External Caching Layer":

1. Create Pure Functions: Make functions do their logic only, without storing any state
// Pure function: only fetches data
async function getUserProfile(userId, db) {
  return db.findUserById(userId);
}

2. Create External Caching Layer: Create function/class that wraps our function to add caching capability
// Caching Layer: receives function and cache client
function withCache(fn, cacheClient, ttl) {
  return async function(...args) {
    const key = \`\${fn.name}:\${JSON.stringify(args)}\`;
    const cachedResult = await cacheClient.get(key);
    
    if (cachedResult) {
      return cachedResult;
    }
    
    const result = await fn(...args);
    await cacheClient.set(key, result, { ttl });
    return result;
  }
}

// Usage:
const cachedGetUserProfile = withCache(getUserProfile, redisClient, 3600);
const user = await cachedGetUserProfile(123, database);

ZERO TOLERANCE: No Map(), WeakMap(), object literals ({}), arrays ([]), class properties (this.cache), closure variables, memoization, or any form of internal state storage for caching purposes.`,
            th: `ปรัชญาที่เด็ดขาด: "Cache คือสถานะ และสถานะคือศัตรูของความน่าเชื่อถือ"
            
ฟังก์ชันที่ดีที่สุดคือ Pure Function: Input เดียวกัน ให้ Output เดียวกันเสมอ ไม่ว่าจะรันกี่ครั้ง ที่ไหน หรือเมื่อไหร่ก็ตาม ฟังก์ชันแบบนี้ทดสอบง่าย, คาดเดาได้, และทำงานคู่ขนานกันได้อย่างปลอดภัย

Internal Cache คือการจงใจทำลายความบริสุทธิ์ของฟังก์ชัน มันคือการสร้าง "หน่วยความจำที่ซ่อนอยู่ (Hidden State)" ทำให้ฟังก์ชันเดียวกันให้ผลลัพธ์ต่างกันได้ขึ้นอยู่กับ "ประวัติการรัน" ของมันเอง สิ่งนี้เปลี่ยนฟังก์ชันที่ควรจะเรียบง่ายให้กลายเป็นมินิแอปพลิเคชันที่มี State ของตัวเอง ซึ่งเป็นฝันร้ายของการจัดการ

ตรรกะวิบัติของนักพัฒนาและคำตอบที่แท้จริง:

ตรรกะวิบัติ: "แต่มันทำให้ฟังก์ชันนี้เร็วขึ้นมาก!"
คำตอบที่แท้จริง: คุณกำลังแก้ปัญหาประสิทธิภาพผิดที่ Caching เป็นปัญหาของ "สถาปัตยกรรม" ไม่ใช่ของ "ฟังก์ชัน" การตัดสินใจว่าจะ Cache อะไร, นานแค่ไหน, และจะล้างเมื่อไหร่ ควรถูกจัดการจาก Layer ภายนอก (เช่น Decorator, API Gateway, Redis) ซึ่งทำให้เราสามารถควบคุม, มอนิเตอร์, และปรับเปลี่ยนกลยุทธ์ Caching ได้โดยไม่ต้องแก้โค้ด Business Logic

ตรรกะวิบัติ: "มันเป็นแค่ Memoization ง่ายๆ สำหรับการคำนวณซ้ำๆ"
คำตอบที่แท้จริง: Memoization ที่ไม่มีกลยุทธ์การล้าง (Invalidation Strategy) คือ Memory Leak ที่รอวันระเบิด ในแอปพลิเคชันที่ทำงานต่อเนื่อง (Long-running service) Cache นั้นจะใหญ่ขึ้นเรื่อยๆ จนกินหน่วยความจำทั้งหมด

กฎทองสำหรับตรวจสอบ:
"ถ้าแอปพลิเคชันนี้ถูกสเกลไปทำงานบน 10 Server พร้อมกัน Cache ที่คุณสร้างขึ้นจะยังคงถูกต้องและสอดคล้องกันทั้งหมดหรือไม่? ถ้าไม่ มันคือการออกแบบที่ผิดตั้งแต่ต้น"

บทสรุปที่ไม่มีข้อยกเว้น:
ฟังก์ชันของคุณต้องไม่มีหน่วยความจำ มันต้องรับ Input, ประมวลผล, และคืน Output จบแค่นั้น ปล่อยให้การจัดการ "สถานะ" และ "ประสิทธิภาพ" เป็นหน้าที่ของสถาปัตยกรรมภายนอก

ปรัชญาและเหตุผลเชิงลึกดั้งเดิม:
ฟังก์ชันควรมี SINGLE RESPONSIBILITY (ทำหน้าที่เพียงอย่างเดียว) การสร้าง cache ภายในฟังก์ชันรวมความรับผิดชอบ 2 อย่าง: Business Logic + Caching Logic นี่เป็น "Cross-Cutting Concern" (เหมือน Logging หรือ Authentication) ที่ควรจัดการแยกต่างหาก

Internal caching สร้าง HIDDEN STATE ในฟังก์ชัน ทำให้ไม่เป็น Pure Function อีกต่อไป ฟังก์ชัน Pure ควรคืนค่าเดียวกันสำหรับ input เดียวกันเสมอ - แต่ฟังก์ชันที่มี cache คืนค่าต่างกันตามสถานะ cache ภายใน ละเมิดหลัก functional programming และทำให้ test/debug ยากมาก

อันตรายที่ซ่อนอยู่:
1) สถานะแชร์ที่เปลี่ยนแปลงได้: Cache กลายเป็น global variable ที่หลาฟังก์ชัน/thread เข้าถึงได้ สร้าง race condition และพฤติกรรมไม่แน่นอนใน concurrent environment
2) หน่วยความจำรั่ว: Cache object ภายในไม่ถูก garbage collect เพราะถูก reference โดย function closure ขยายตัวไม่จำกัดจน Out of Memory (OOM) crash
3) ข้อมูลเก่าตลอดกาล: ฟังก์ชันไม่มีทางรู้ว่าข้อมูลต้นทาง (ใน database/API) เปลี่ยนเมื่อไหร่ จึงส่งค่า cache เก่าไปเรื่อยๆ ทำให้ business logic ผิดพลาด
4) เทสต์ไม่เสถียร: Test รบกวนกันผ่านสถานะ cache ที่แชร์กัน - ลำดับ test ส่งผลต่อผลลัพธ์ ทำให้ CI/CD ไม่แน่นอนและ debug ไม่ได้
5) ฝันร้าย Concurrency: หลาย thread/process เข้าถึง cache เดียวกันสร้าง race condition, ข้อมูลเสียหาย, deadlock - เป็นปัญหาโดยเฉพาะใน Node.js cluster mode หรือ microservices
6) Debug ไม่ได้: ไม่สามารถตรวจสอบเนื้อหา cache, hit/miss ratio, หรือ performance metric จากภายนอก - พฤติกรรม cache ทึบแสงหมด
7) นรกการตั้งค่า: ไม่สามารถปรับ cache size, TTL, eviction policy ตามสภาพ runtime หรือความต้องการ performance - พฤติกรรม cache ถูก hardcode
8) ละเมิดการแยก Test: Unit test ควรแยกกัน แต่ฟังก์ชันที่มี cache เก็บสถานะระหว่าง test ทำให้ผลลัพธ์ขึ้นกับลำดับการรัน
9) มองไม่เห็นใน Production: ไม่สามารถ monitor performance cache, ระบุ cache miss, หรือปรับ cache behavior ใน production environment
10) ฆาตกร Scalability: เมื่อ scale เป็นหลาย server/container แต่ละตัวมี internal cache แยกกัน สร้างความไม่สอดคล้องของ cache และทำลายจุดประสงค์ของการ cache

วิธีทดสอบความคิด (Litmus Test):
ถามตัวเอง: "ถ้าฉันต้องการล้าง cache ของฟังก์ชันนี้จากส่วนอื่นของแอปพลิเคชัน ฉันทำได้โดยไม่ต้อง restart process ทั้งหมดหรือไม่?"
- ถ้าตอบ "ไม่": คุณละเมิด NO_INTERNAL_CACHING
- ถ้าตอบ "ใช่" (เพราะ cache จัดการโดย Redis, Memcached, หรือ external caching layer): คุณทำถูกต้อง

วิธีแก้ไขสมบูรณ์:
ใช้ "Decorator Pattern" หรือ "External Caching Layer":

1. สร้าง Pure Function: ทำให้ฟังก์ชันทำ logic เท่านั้น ไม่เก็บ state ใดๆ
// Pure function: ดึงข้อมูลอย่างเดียว
async function getUserProfile(userId, db) {
  return db.findUserById(userId);
}

2. สร้าง External Caching Layer: สร้างฟังก์ชัน/คลาสที่ห่อฟังก์ชันของเราเพื่อเพิ่มความสามารถ cache
// Caching Layer: รับฟังก์ชันและ cache client
function withCache(fn, cacheClient, ttl) {
  return async function(...args) {
    const key = \`\${fn.name}:\${JSON.stringify(args)}\`;
    const cachedResult = await cacheClient.get(key);
    
    if (cachedResult) {
      return cachedResult;
    }
    
    const result = await fn(...args);
    await cacheClient.set(key, result, { ttl });
    return result;
  }
}

// การใช้งาน:
const cachedGetUserProfile = withCache(getUserProfile, redisClient, 3600);
const user = await cachedGetUserProfile(123, database);

ไม่ยอมรับข้อยกเว้น: ไม่มี Map(), WeakMap(), object literal ({}), array ([]), class property (this.cache), closure variable, memoization หรือการเก็บ internal state ใดๆ เพื่อการ cache

*** LOOPHOLE CLOSURE - การปิดช่องโหว่ทุกรูปแบบ ***

เหตุผลที่คนอยากใช้ internal caching และการปิดช่องโหว่:

1. "OMG BUT IT'S JUST FOR PERFORMANCE OPTIMIZATION!"
   → ไม่ยอมรับ! Performance optimization ต้องทำแบบ centralized และ measurable ไม่ใช่ hidden internal cache
   → แก้ถูก: External caching layer พร้อม monitoring และ cache hit/miss metrics
   → เพราะอะไร: Internal cache ไม่สามารถ monitor, tune หรือ debug ได้ง่าย

2. "DUDE! IT'S JUST A SIMPLE MEMOIZATION FOR EXPENSIVE CALCULATIONS!"
   → ไม่ยอมรับ! Expensive calculations ต้องใช้ proper caching strategy พร้อม TTL และ invalidation
   → แก้ถูก: Dedicated computation cache service หรือ memoization library with proper lifecycle
   → เพราะอะไร: Manual memoization ไม่มี memory management และอาจ memory leak

3. "BRO, IT'S JUST FOR AVOIDING DUPLICATE API CALLS!"
   → ไม่ยอมรับ! API call deduplication ต้องทำใน HTTP layer หรือ API client layer
   → แก้ถูก: HTTP cache headers, API client with request deduplication หรือ GraphQL DataLoader pattern
   → เพราะอะไร: Function-level deduplication ไม่ respect HTTP semantics และ cache invalidation

4. "OMG BUT IT'S JUST FOR STATIC DATA THAT NEVER CHANGES!"
   → ไม่ยอมรับ! "Never changes" คือ assumption ที่อันตราย - data เปลี่ยนได้เสมอ
   → แก้ถูก: Configuration store หรือ static assets loading พร้อม cache invalidation mechanism
   → เพราะอะไร: Static assumptions break เมื่อ requirements เปลี่ยนและไม่มี invalidation strategy

5. "DUDE! IT'S JUST FOR DATABASE QUERY RESULT CACHING!"
   → ไม่ยอมรับ! Database caching ต้องทำใน database layer หรือ dedicated cache layer
   → แก้ถูก: Database query cache, Redis cache หรือ ORM-level caching พร้อม proper invalidation
   → เพราะอะไร: Function-level DB caching bypass database transaction isolation และ data consistency

6. "BRO, IT'S JUST FOR PARSED CONFIGURATION DATA!"
   → ไม่ยอมรับ! Configuration parsing ต้องทำครั้งเดียวตอน application startup
   → แก้ถูก: Configuration loader ที่ parse ตอน bootstrap พร้อม hot-reload mechanism
   → เพราะอะไร: Runtime config parsing cache ป้องกัน configuration updates และ environment changes

7. "OMG BUT IT'S JUST FOR USER SESSION DATA!"
   → ไม่ยอมรับ! User session ต้องเก็บใน session store ไม่ใช่ application memory
   → แก้ถูก: Redis session store, database sessions หรือ JWT stateless sessions
   → เพราะอะไร: In-memory session cache ไม่ work ใน multi-instance deployment และ horizontal scaling

8. "DUDE! IT'S JUST FOR TEMPLATE RENDERING CACHE!"
   → ไม่ยอมรับ! Template caching ต้องทำใน template engine layer
   → แก้ถูก: Template engine built-in caching (เช่น Handlebars precompiled templates)
   → เพราะอะไร: Custom template cache ไม่ integrate กับ template engine optimization และ debug tools

9. "BRO, IT'S JUST FOR VALIDATION RULES PARSING!"
   → ไม่ยอมรับ! Validation rules ต้อง compile ตอน application startup
   → แก้ถูก: Pre-compiled validation schemas หรือ validation library with built-in compilation caching
   → เพราะอะไร: Runtime validation parsing cache อาจ outdated เมื่อ rules เปลี่ยน

10. "OMG BUT IT'S JUST FOR TIMEZONE/LOCALE DATA!"
    → ไม่ยอมรับ! Timezone/locale data ต้องใช้ standard library caching
    → แก้ถูก: Intl API, moment.js timezone caching หรือ i18n library built-in cache
    → เพราะอะไร: Custom timezone cache อาจ outdated เมื่อมี timezone rule changes

11. "DUDE! IT'S JUST FOR FILE SYSTEM READ CACHE!"
    → ไม่ยอมรับ! File system caching ต้องทำใน OS level หรือ application-level file cache
    → แก้ถูก: OS file system cache, application file loader พร้อม file watcher
    → เพราะอะไร: Custom file cache ไม่ detect file changes และ memory management issues

12. "BRO, IT'S JUST FOR CRYPTO/HASH COMPUTATION CACHE!"
    → ไม่ยอมรับ! Crypto operations ต้องใช้ proper key derivation functions หรือ crypto library caching
    → แก้ถูก: Proper PBKDF2/bcrypt/scrypt พร้อม built-in optimization หรือ dedicated crypto cache service
    → เพราะอะไร: Custom crypto cache อาจ security vulnerability และไม่ follow crypto best practices

ARCHITECTURAL PRINCIPLE:
Caching เป็น CROSS-CUTTING CONCERN ไม่ใช่ business logic concern
- Business functions ต้อง pure และ stateless
- Caching ต้องทำใน infrastructure layer (Redis, database, HTTP, CDN)
- Performance optimization ต้อง measurable และ configurable

GOLDEN RULE สำหรับตรวจสอบ:
ถ้า function นี้ถูกเรียกใน different process/thread/instance แล้ว cache ไม่ shared
= คุณกำลัง optimize แค่ local scope แทนที่จะ solve ปัญหาที่ architecture level

ไม่มี "แต่มัน optimize แค่นิดเดียว" - ทุก optimization ต้อง global และ maintainable
ZERO INTERNAL STATE - PURE FUNCTIONS ONLY

*** การปิดช่องโหว่ทุกรูปแบบ - LOOPHOLE CLOSURE (เวอร์ชันภาษาไทย) ***

เหตุผลที่คนอยากใช้ internal caching และการปิดช่องโหว่:

1. "เฮ้ย! แต่มันแค่ performance optimization นะ!"
   → ไม่ยอมรับ! Performance optimization ต้องทำแบบ centralized และ measurable ไม่ใช่ซ่อนใน function
   → แก้ถูก: External caching layer พร้อม monitoring และ cache hit/miss metrics
   → เพราะอะไร: Internal cache ไม่สามารถ monitor, tune หรือ debug ได้ง่าย

2. "อะ! แต่มันแค่ memoization ธรรมดาสำหรับการคำนวณที่หนัก!"
   → ไม่ยอมรับ! การคำนวณที่หนักต้องใช้ proper caching strategy พร้อม TTL และ invalidation
   → แก้ถูก: Dedicated computation cache service หรือ memoization library ที่มี proper lifecycle
   → เพราะอะไร: Manual memoization ไม่มี memory management และอาจ memory leak

3. "เฮ้ย! แต่มันแค่หลีกเลี่ยง duplicate API calls!"
   → ไม่ยอมรับ! API call deduplication ต้องทำใน HTTP layer หรือ API client layer
   → แก้ถูก: HTTP cache headers, API client ที่มี request deduplication หรือ GraphQL DataLoader pattern
   → เพราะอะไร: Function-level deduplication ไม่ respect HTTP semantics และ cache invalidation

4. "อะ! แต่มันแค่ static data ที่ไม่เปลี่ยน!"
   → ไม่ยอมรับ! "ไม่เปลี่ยน" คือ assumption ที่อันตราย - data เปลี่ยนได้เสมอ
   → แก้ถูก: Configuration store หรือ static assets loading พร้อม cache invalidation mechanism
   → เพราะอะไร: Static assumptions พังเมื่อ requirements เปลี่ยนและไม่มี invalidation strategy

5. "เฮ้ย! แต่มันแค่ database query result caching!"
   → ไม่ยอมรับ! Database caching ต้องทำใน database layer หรือ dedicated cache layer
   → แก้ถูก: Database query cache, Redis cache หรือ ORM-level caching พร้อม proper invalidation
   → เพราะอะไร: Function-level DB caching bypass database transaction isolation และ data consistency

6. "อะ! แต่มันแค่ parsed configuration data!"
   → ไม่ยอมรับ! Configuration parsing ต้องทำครั้งเดียวตอน application startup
   → แก้ถูก: Configuration loader ที่ parse ตอน bootstrap พร้อม hot-reload mechanism
   → เพราะอะไร: Runtime config parsing cache ป้องกัน configuration updates และ environment changes

7. "เฮ้ย! แต่มันแค่ user session data!"
   → ไม่ยอมรับ! User session ต้องเก็บใน session store ไม่ใช่ application memory
   → แก้ถูก: Redis session store, database sessions หรือ JWT stateless sessions
   → เพราะอะไร: In-memory session cache ไม่ work ใน multi-instance deployment และ horizontal scaling

8. "อะ! แต่มันแค่ template rendering cache!"
   → ไม่ยอมรับ! Template caching ต้องทำใน template engine layer
   → แก้ถูก: Template engine built-in caching (เช่น Handlebars precompiled templates)
   → เพราะอะไร: Custom template cache ไม่ integrate กับ template engine optimization และ debug tools

9. "เฮ้ย! แต่มันแค่ validation rules parsing!"
   → ไม่ยอมรับ! Validation rules ต้อง compile ตอน application startup
   → แก้ถูก: Pre-compiled validation schemas หรือ validation library with built-in compilation caching
   → เพราะอะไร: Runtime validation parsing cache อาจ outdated เมื่อ rules เปลี่ยน

10. "อะ! แต่มันแค่ timezone/locale data!"
    → ไม่ยอมรับ! Timezone/locale data ต้องใช้ standard library caching
    → แก้ถูก: Intl API, moment.js timezone caching หรือ i18n library built-in cache
    → เพราะอะไร: Custom timezone cache อาจ outdated เมื่อมี timezone rule changes

11. "เฮ้ย! แต่มันแค่ file system read cache!"
    → ไม่ยอมรับ! File system caching ต้องทำใน OS level หรือ application-level file cache
    → แก้ถูก: OS file system cache, application file loader พร้อม file watcher
    → เพราะอะไร: Custom file cache ไม่ detect file changes และ memory management issues

12. "อะ! แต่มันแค่ crypto/hash computation cache!"
    → ไม่ยอมรับ! Crypto operations ต้องใช้ proper key derivation functions หรือ crypto library caching
    → แก้ถูก: Proper PBKDF2/bcrypt/scrypt พร้อม built-in optimization หรือ dedicated crypto cache service
    → เพราะอะไร: Custom crypto cache อาจเป็น security vulnerability และไม่ follow crypto best practices

หลักการสถาปัตยกรรม (ภาษาไทย):
Caching เป็น CROSS-CUTTING CONCERN ไม่ใช่ business logic concern
- Business functions ต้อง pure และ stateless
- Caching ต้องทำใน infrastructure layer (Redis, database, HTTP, CDN)  
- Performance optimization ต้อง measurable และ configurable

กฎทองสำหรับตรวจสอบ (ภาษาไทย):
ถ้า function นี้ถูกเรียกใน different process/thread/instance แล้ว cache ไม่ shared
= คุณกำลัง optimize แค่ local scope แทนที่จะ solve ปัญหาที่ architecture level

ไม่มี "แต่มัน optimize แค่นิดเดียว" - ทุก optimization ต้อง global และ maintainable
ห้าม INTERNAL STATE - PURE FUNCTIONS เท่านั้น`
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
            en: `ABSOLUTE PHILOSOPHY: "CODE IS ENGINEERING DOCUMENTATION, NOT EMOTIONAL EXPRESSION"
            
Source Code is the ultimate precision communication medium. It must be readable and processable with 100% accuracy by humans and machines from all cultures, all operating systems, and all tools - both today and 20 years from now.

Emoji destroys ALL of these qualities. It's AMBIGUOUS, inconsistently rendered, unsearchable, and platform-dependent. Using emoji in code is lowering engineering documentation to chat message level, which is unacceptable in professional environments.

DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS:

FLAWED LOGIC: "But it makes logs or commits easier to read!"
REAL ANSWER: It makes it easier to read for YOU on YOUR machine TODAY only. For automated tools (Log Parser, grep, git log --grep) or for developers using basic Terminal, it's unreadable garbage. Standardized clarity is more valuable than group-specific prettiness.

FLAWED LOGIC: "It's just jokes in comments!"
REAL ANSWER: Comments are part of technical documentation. They must provide clear, searchable information. Adding emoji adds Noise and reduces the professionalism of that codebase.

GOLDEN RULE FOR VERIFICATION:
"Can I grep this concept on a GUI-less server via PuTTY with basic fonts and be 100% confident I'll find every related point?"

CONCLUSION WITHOUT EXCEPTIONS:
Every character in your code should have technical purpose. Readability comes from clear naming and good structure, not visual decorations. International teams must collaborate without cultural/visual barriers.

LEGACY PHILOSOPHY & DEEPER RATIONALE:
Source Code is OFFICIAL TECHNICAL DOCUMENTATION designed for CLEAR, SEARCHABLE, and UNIVERSAL communication between humans and machines across all platforms. Emoji destroys ALL of these properties.

Using emoji might seem harmless, but it creates fundamental problems with Encoding, Searchability, Accessibility, and Portability that are completely unacceptable for professional software production.

HIDDEN DANGERS:
1) ENCODING HELL (นรก Encoding): Files opened in different editors or OS may display emoji as garbage characters (Mojibake) or corrupt the entire file, making code unreadable or causing compilation errors
2) TOOLCHAIN BREAKDOWN (เครื่องมือพัง): grep, git diff, git log in terminal or CI/CD tools cannot properly display or search emoji, making code inspection and debugging dramatically harder
3) DATABASE DISASTERS (หายนะ Database): Databases using utf8 collation (not utf8mb4) cannot store emoji, causing ERROR exceptions or silent data truncation, destroying application data
4) ACCESSIBILITY DISCRIMINATION (เลือกปฏิบัติผู้พิการ): Screen readers cannot read and interpret emoji meaningfully, preventing visually impaired developers from participating in the codebase, violating inclusion principles
5) PROFESSIONAL CREDIBILITY LOSS (สูญเสียความน่าเชื่อถือ): No enterprise-grade production system uses emoji - it immediately signals "amateur project" or "toy code" to technical leaders, clients, and auditors
6) CI/CD PIPELINE FAILURES (Pipeline ล้มเหลว): Many CI/CD systems, Docker containers, SSH sessions cannot display emoji properly, causing build logs to be unreadable and debugging impossible
7) VERSION CONTROL CHAOS (Version Control วุ่นวาย): Git diffs display emoji as escape sequences (\u{1F600}), making code review completely illegible and merge conflict resolution impossible
8) CROSS-PLATFORM INCOMPATIBILITY (ไม่เข้ากันข้าม Platform): Different operating systems render emoji differently or not at all, creating inconsistent developer experience and communication gaps
9) SEARCH AND REPLACE IMPOSSIBILITY (ค้นหาและแทนที่ไม่ได้): Cannot reliably search for emoji in IDEs, text editors, or command-line tools, making refactoring and maintenance extremely difficult
10) COMPLIANCE VIOLATIONS (ละเมิดมาตรฐาน): Many corporate coding standards, government regulations, and industry certifications explicitly prohibit non-ASCII characters in source code for auditability

LITMUS TEST:
Ask yourself: "Can I copy this code section into the oldest text editor on a Linux server via SSH and still understand its meaning and search for it 100%?"
- If answer is "NO": You may be violating NO_EMOJI
- If answer is "YES": You're doing it right

THE ABSOLUTE SOLUTION:
Use Text-based Descriptions that are industry standard:

In Comments: Use clear prefixes like // TODO:, // FIXME:, // NOTE:, // PERF:, // SECURITY:

In Log Messages: Use structured prefixes or structured data:
logger.info('[DEPLOY] Deployment started.');
logger.info({ event: 'deploy_start', message: 'Deployment started.' });

In Status Variables: Use strings that are immediately understandable:
const status = 'SUCCESS'; // instead of checkmark emoji
const buildState = 'FAILED'; // instead of X emoji 
const priority = 'HIGH'; // instead of fire emoji
const type = 'BUG'; // instead of bug emoji
const note = 'TODO'; // instead of memo emoji

In Error Messages: Use clear text:
throw new Error('CRITICAL: Database connection failed'); // instead of explosion emoji + text

COMPREHENSIVE COVERAGE: This validator detects ALL forms of emoji including direct Unicode characters, ZWJ sequences, skin tone modifiers, regional indicators, variation selectors, HTML entities, tag characters, and all Unicode 15.1+ emoji blocks.

ZERO TOLERANCE: No emoji, Unicode symbols, pictographs, or non-standard characters allowed in source code, comments, strings, variable names, or any part of the codebase.`,
            th: `ปรัชญาที่เด็ดขาด: "โค้ดคือเอกสารทางวิศวกรรม ไม่ใช่การแสดงออกทางอารมณ์"
            
Source Code คือสื่อกลางการสื่อสารที่ต้องมีความแม่นยำสูงสุด มันต้องถูกอ่านและประมวลผลได้ถูกต้อง 100% โดยมนุษย์และเครื่องจักรจากทุกวัฒนธรรม, ทุกระบบปฏิบัติการ, และทุกเครื่องมือ ทั้งในปัจจุบันและอีก 20 ปีข้างหน้า

Emoji ทำลายคุณสมบัติทั้งหมดนี้ มันคืออักขระที่ กำกวม, แสดงผลไม่แน่นอน, ค้นหาไม่ได้, และขึ้นอยู่กับแพลตฟอร์ม การใช้อิโมจิในโค้ดคือการลดระดับเอกสารทางวิศวกรรมให้กลายเป็นข้อความในแชท ซึ่งเป็นสิ่งที่ยอมรับไม่ได้ในสภาพแวดล้อมที่เป็นมืออาชีพ

ตรรกะวิบัติของนักพัฒนาและคำตอบที่แท้จริง:

ตรรกะวิบัติ: "แต่มันทำให้ Log หรือ Commit อ่านง่ายขึ้น!"
คำตอบที่แท้จริง: มันทำให้อ่านง่ายขึ้นสำหรับ คุณ บน เครื่องของคุณ ใน วันนี้ เท่านั้น สำหรับเครื่องมืออัตโนมัติ (Log Parser, grep, git log --grep) หรือสำหรับนักพัฒนาที่ใช้ Terminal แบบ Basic มันคือขยะที่อ่านไม่ออก ความชัดเจนที่เป็นมาตรฐาน มีค่ามากกว่าความสวยงามเฉพาะกลุ่ม

ตรรกะวิบัติ: "มันเป็นแค่มุกตลกในคอมเมนต์!"
คำตอบที่แท้จริง: คอมเมนต์คือส่วนหนึ่งของเอกสารทางเทคนิค มันต้องให้ข้อมูลที่ชัดเจนและค้นหาได้ การใส่อิโมจิเข้าไปเป็นการเพิ่ม Noise และลดทอนความเป็นมืออาชีพของโค้ดเบสนั้นๆ

กฎทองสำหรับตรวจสอบ:
"ฉันสามารถ grep คอนเซ็ปต์นี้บน Server ที่ไม่มี GUI ผ่าน PuTTY ด้วยฟอนต์พื้นฐาน แล้วมั่นใจได้ 100% ว่าจะเจอทุกจุดที่เกี่ยวข้องหรือไม่?"

บทสรุปที่ไม่มีข้อยกเว้น:
ทุกตัวอักษรในโค้ดของคุณควรมี technical purpose Readability มาจาก clear naming และ good structure ไม่ใช่ visual decorations International teams ต้อง collaborate ได้โดยไม่ติด cultural/visual barriers

ปรัชญาและเหตุผลเชิงลึกดั้งเดิม:
Source Code คือ เอกสารทางเทคนิคที่เป็นทางการ ที่ออกแบบมาเพื่อการสื่อสาร ที่ชัดเจน ค้นหาได้ และเป็นสากล ระหว่างมนุษย์และเครื่องจักรบนทุกแพลตฟอร์ม Emoji ทำลายคุณสมบัติทั้งหมดนี้

การใช้อิโมจิดูเหมือนไม่เป็นอันตราย แต่มันสร้างปัญหาพื้นฐานด้าน Encoding, Searchability, Accessibility และ Portability ที่ยอมรับไม่ได้สำหรับการผลิตซอฟต์แวร์มืออาชีพ

อันตรายที่ซ่อนอยู่:
1) นรก Encoding: ไฟล์ที่เปิดใน editor หรือ OS ต่างกันอาจแสดงอิโมจิเป็นตัวอักษรขยะ (Mojibake) หรือทำให้ไฟล์เสียหาย ทำให้โค้ดอ่านไม่ได้หรือ compile ไม่ได้
2) เครื่องมือพัง: grep, git diff, git log ใน terminal หรือ CI/CD tools ไม่สามารถแสดงผลหรือค้นหาอิโมจิได้ถูกต้อง ทำให้ตรวจสอบโค้ดและ debug ยากขึ้นมาก
3) หายนะ Database: Database ที่ใช้ utf8 collation (ไม่ใช่ utf8mb4) เก็บอิโมจิไม่ได้ ทำให้เกิด ERROR exception หรือข้อมูลถูกตัดแบบเงียบ ทำลายข้อมูลแอปพลิเคชัน
4) เลือกปฏิบัติผู้พิการ: Screen reader ไม่สามารถอ่านและตีความอิโมจิได้อย่างมีความหมาย ป้องกันนักพัฒนาที่บกพร่องทางสายตาจากการร่วมงานใน codebase ละเมิดหลักการเท่าเทียม
5) สูญเสียความน่าเชื่อถือ: ไม่มีระบบ production ระดับองค์กรใช้อิโมจิ - มันส่งสัญญาณว่าเป็น "โปรเจกต์สมัครเล่น" หรือ "โค้ดของเล่น" ไปยังผู้นำเทคนิค ลูกค้า และผู้ตรวจสอบทันที
6) Pipeline ล้มเหลว: ระบบ CI/CD หลายตัว, Docker container, SSH session แสดงอิโมจิไม่ได้ ทำให้ build log อ่านไม่ได้และ debug ไม่ได้
7) Version Control วุ่นวาย: Git diff แสดงอิโมจิเป็น escape sequence (\u{1F600}) ทำให้ code review อ่านไม่ได้และแก้ merge conflict ไม่ได้
8) ไม่เข้ากันข้าม Platform: OS ต่างกัน render อิโมจิต่างกันหรือไม่แสดงเลย สร้างประสบการณ์นักพัฒนาไม่สอดคล้องและช่องว่างการสื่อสาร
9) ค้นหาและแทนที่ไม่ได้: ไม่สามารถค้นหาอิโมจิใน IDE, text editor หรือ command-line tools ได้อย่างเชื่อถือได้ ทำให้ refactor และ maintain ยากมาก
10) ละเมิดมาตรฐาน: มาตรฐานการเขียนโค้ดขององค์กรหลายแห่ง กฎระเบียมของรัฐ และการรับรองอุตสาหกรรมห้าม non-ASCII character ในโค้ดอย่างชัดเจน เพื่อการตรวจสอบได้

วิธีทดสอบความคิด (Litmus Test):
ถามตัวเอง: "ฉันสามารถ copy โค้ดส่วนนี้ไปวางใน text editor ที่เก่าที่สุดบน Linux server ผ่าน SSH และยังเข้าใจความหมายและค้นหาได้ 100% หรือไม่?"
- ถ้าตอบ "ไม่": คุณอาจละเมิด NO_EMOJI
- ถ้าตอบ "ใช่": คุณทำถูกต้อง

วิธีแก้ไขสมบูรณ์:
ใช้คำอธิบายแบบข้อความที่เป็นมาตรฐานอุตสาหกรรม:

ใน Comment: ใช้ prefix ที่ชัดเจน เช่น // TODO:, // FIXME:, // NOTE:, // PERF:, // SECURITY:

ใน Log Message: ใช้ structured prefix หรือ structured data:
logger.info('[DEPLOY] Deployment started.');
logger.info({ event: 'deploy_start', message: 'Deployment started.' });

ในตัวแปร Status: ใช้ string ที่เข้าใจได้ทันที:
const status = 'SUCCESS'; // แทนการใช้ checkmark emoji
const buildState = 'FAILED'; // แทนการใช้ X emoji
const priority = 'HIGH'; // แทนการใช้ fire emoji
const type = 'BUG'; // แทนการใช้ bug emoji
const note = 'TODO'; // แทนการใช้ memo emoji

ใน Error Message: ใช้ข้อความชัดเจน:
throw new Error('CRITICAL: Database connection failed'); // แทนการใช้ explosion emoji + text

ครอบคลุมทั่วถึง: Validator นี้ตรวจจับอิโมจิทุกรูปแบบ รวมถึง Unicode character ตรงๆ, ZWJ sequence, skin tone modifier, regional indicator, variation selector, HTML entity, tag character และ Unicode 15.1+ emoji block ทั้งหมด

ไม่ยอมรับข้อยกเว้น: ไม่มีอิโมจิ Unicode symbol pictograph หรือ non-standard character ใน source code comment string variable name หรือส่วนใดๆ ของ codebase

*** LOOPHOLE CLOSURE - การปิดช่องโหว่ทุกรูปแบบ ***

เหตุผลที่คนอยากใช้ emoji และการปิดช่องโหว่:

1. "OMG BUT IT'S JUST FOR FUN AND TEAM MORALE!"
   → ไม่ยอมรับ! Fun ไม่ใช่เหตุผลที่ดีในการทำลาย professional code standards
   → แก้ถูก: Team morale ผ่าน proper documentation, meaningful code review และ knowledge sharing
   → เพราะอะไร: Code คือ professional artifact ที่ต้อง maintainable โดย developers ทั่วโลก

2. "DUDE! IT'S JUST IN COMMENTS, NOT IN ACTUAL CODE!"
   → ไม่ยอมรับ! Comments เป็นส่วนหนึ่งของ codebase และต้อง searchable และ parseable
   → แก้ถูก: Structured comments พร้อม proper prefixes (// TODO:, // FIXME:, // NOTE:)
   → เพราะอะไร: Emoji ใน comments ทำลาย text search, code indexing และ documentation generation

3. "BRO, IT'S JUST FOR COMMIT MESSAGES!"
   → ไม่ยอมรับ! Commit messages ต้อง machine-readable และ professional
   → แก้ถูก: Conventional Commit format พร้อม clear type และ scope (feat:, fix:, docs:)
   → เพราะอะไร: Git log parsing, changelog generation และ CI/CD automation ต้องการ structured format

4. "OMG BUT IT'S JUST FOR STATUS INDICATORS!"
   → ไม่ยอมรับ! Status indicators ต้องใช้ standard text ที่ universally understood
   → แก้ถูก: Enum values (SUCCESS/FAILED/PENDING) หรือ standard status codes
   → เพราะอะไร: Status indicators ต้อง machine-readable และ locale-independent

5. "DUDE! IT'S JUST FOR PRIORITY LEVELS!"
   → ไม่ยอมรับ! Priority levels ต้องใช้ standardized priority systems
   → แก้ถูก: Priority enum (LOW/MEDIUM/HIGH/CRITICAL) หรือ numeric levels (P0-P4)
   → เพราะอะไร: Priority systems ต้อง sortable และ integrate กับ issue tracking systems

6. "BRO, IT'S JUST FOR USER-FACING STRINGS!"
   → ไม่ยอมรับ! User-facing content ต้อง properly internationalized
   → แก้ถูก: i18n framework พร้อม proper Unicode handling และ locale-specific rendering
   → เพราะอะไร: Hardcoded emoji ไม่ support accessibility, screen readers และ cultural differences

7. "OMG BUT IT'S JUST FOR TEST DATA/FIXTURES!"
   → ไม่ยอมรับ! Test data ต้อง predictable และ focused บน business logic ไม่ใช่ visual elements
   → แก้ถูก: Meaningful test data ที่ reflect real-world scenarios
   → เพราะอะไร: Emoji ใน test data distract จาก actual test logic และ make debugging harder

8. "DUDE! IT'S JUST FOR ERROR MESSAGES TO MAKE THEM FRIENDLY!"
   → ไม่ยอมรับ! Error messages ต้อง structured และ actionable ไม่ใช่ "friendly"
   → แก้ถูก: Clear error codes พร้อม actionable messages และ proper error categorization
   → เพราะอะไร: Error handling systems ต้อง parseable และ alerting systems ต้องการ structured data

9. "BRO, IT'S JUST FOR LOG LEVEL INDICATORS!"
   → ไม่ยอมรับ! Log levels ต้อง standard และ machine-parseable
   → แก้ถูก: Standard log levels (DEBUG/INFO/WARN/ERROR/FATAL) พร้อม structured logging
   → เพราะอะไร: Log aggregation systems และ monitoring tools ต้องการ standardized log formats

10. "OMG BUT IT'S PART OF THE BUSINESS DOMAIN (SOCIAL MEDIA APP)!"
    → ไม่ยอมรับ! Business domain emoji ต้องเก็บใน database หรือ user content ไม่ใช่ source code
    → แก้ถูก: Emoji handling library พร้อม proper Unicode normalization และ database storage
    → เพราะอะไร: Business logic ต้องแยกจาก presentation layer และ support emoji evolution

11. "DUDE! IT'S JUST FOR FEATURE FLAGS OR CONFIGURATION!"
    → ไม่ยอมรับ! Configuration values ต้อง machine-readable และ deployment-safe
    → แก้ถูก: Boolean/string configuration values พร้อม proper validation
    → เพราะอะไร: Configuration parsing ต้อง robust และ environment-independent

12. "BRO, OTHER POPULAR PROJECTS USE EMOJI IN CODE!"
    → ไม่ยอมรับ! Popularity ไม่ใช่ technical merit - enterprise code ต้อง stricter standards
    → แก้ถูก: Follow established enterprise coding standards และ industry best practices
    → เพราะอะไร: Enterprise software ต้อง maintainable โดย global teams พร้อม different tooling และ environments

PROFESSIONAL PRINCIPLE:
Source code คือ TECHNICAL SPECIFICATION ไม่ใช่ creative expression
- ทุก character ใน source code ต้องมี technical purpose
- Readability มาจาก clear naming และ good structure ไม่ใช่ visual decorations
- International teams ต้อง collaborate ได้โดยไม่ติด cultural/visual barriers

GOLDEN RULE สำหรับตรวจสอบ:
ถ้า character นี้ถูก copy/paste ไป terminal ที่ไม่ support Unicode properly แล้วกลายเป็น garbled text
= ห้ามใช้ใน professional codebase

ไม่มี "แต่มันดูน่ารัก" หรือ "ทำให้ code สนุก" - CODE IS BUSINESS DOCUMENTATION
ZERO EMOJI - PROFESSIONAL CODE ONLY

*** การปิดช่องโหว่ทุกรูปแบบ - LOOPHOLE CLOSURE (เวอร์ชันภาษาไทย) ***

เหตุผลที่คนอยากใช้ emoji และการปิดช่องโหว่:

1. "เฮ้ย! แต่มันแค่เพื่อความสนุกและสร้างขวัญทีม!"
   → ไม่ยอมรับ! ความสนุกไม่ใช่เหตุผลที่ดีในการทำลาย professional code standards
   → แก้ถูก: Team morale ผ่าน proper documentation, meaningful code review และ knowledge sharing
   → เพราะอะไร: Code คือ professional artifact ที่ต้อง maintainable โดย developers ทั่วโลก

2. "อะ! แต่มันแค่ใน comments ไม่ใช่โค้ดจริงนะ!"
   → ไม่ยอมรับ! Comments เป็นส่วนหนึ่งของ codebase และต้อง searchable และ parseable
   → แก้ถูก: Structured comments พร้อม proper prefixes (// TODO:, // FIXME:, // NOTE:)
   → เพราะอะไร: Emoji ใน comments ทำลาย text search, code indexing และ documentation generation

3. "เฮ้ย! แต่มันแค่ commit messages!"
   → ไม่ยอมรับ! Commit messages ต้อง machine-readable และ professional
   → แก้ถูก: Conventional Commit format พร้อม clear type และ scope (feat:, fix:, docs:)
   → เพราะอะไร: Git log parsing, changelog generation และ CI/CD automation ต้องการ structured format

4. "อะ! แต่มันแค่ status indicators!"
   → ไม่ยอมรับ! Status indicators ต้องใช้ standard text ที่ universally understood
   → แก้ถูก: Enum values (SUCCESS/FAILED/PENDING) หรือ standard status codes
   → เพราะอะไร: Status indicators ต้อง machine-readable และ locale-independent

5. "เฮ้ย! แต่มันแค่ priority levels!"
   → ไม่ยอมรับ! Priority levels ต้องใช้ standardized priority systems
   → แก้ถูก: Priority enum (LOW/MEDIUM/HIGH/CRITICAL) หรือ numeric levels (P0-P4)
   → เพราะอะไร: Priority systems ต้อง sortable และ integrate กับ issue tracking systems

6. "อะ! แต่มันแค่ user-facing strings!"
   → ไม่ยอมรับ! User-facing content ต้อง properly internationalized
   → แก้ถูก: i18n framework พร้อม proper Unicode handling และ locale-specific rendering
   → เพราะอะไร: Hardcoded emoji ไม่ support accessibility, screen readers และ cultural differences

7. "เฮ้ย! แต่มันแค่ test data/fixtures!"
   → ไม่ยอมรับ! Test data ต้อง predictable และ focused บน business logic ไม่ใช่ visual elements
   → แก้ถูก: Meaningful test data ที่ reflect real-world scenarios
   → เพราะอะไร: Emoji ใน test data distract จาก actual test logic และ make debugging harder

8. "อะ! แต่มันแค่ error messages เพื่อให้เป็นมิตร!"
   → ไม่ยอมรับ! Error messages ต้อง structured และ actionable ไม่ใช่ "เป็นมิตร"
   → แก้ถูก: Clear error codes พร้อม actionable messages และ proper error categorization
   → เพราะอะไร: Error handling systems ต้อง parseable และ alerting systems ต้องการ structured data

9. "เฮ้ย! แต่มันแค่ log level indicators!"
   → ไม่ยอมรับ! Log levels ต้อง standard และ machine-parseable
   → แก้ถูก: Standard log levels (DEBUG/INFO/WARN/ERROR/FATAL) พร้อม structured logging
   → เพราะอะไร: Log aggregation systems และ monitoring tools ต้องการ standardized log formats

10. "อะ! แต่มันเป็นส่วนหนึ่งของ business domain (social media app)!"
    → ไม่ยอมรับ! Business domain emoji ต้องเก็บใน database หรือ user content ไม่ใช่ source code
    → แก้ถูก: Emoji handling library พร้อม proper Unicode normalization และ database storage
    → เพราะอะไร: Business logic ต้องแยกจาก presentation layer และ support emoji evolution

11. "เฮ้ย! แต่มันแค่ feature flags หรือ configuration!"
    → ไม่ยอมรับ! Configuration values ต้อง machine-readable และ deployment-safe
    → แก้ถูก: Boolean/string configuration values พร้อม proper validation
    → เพราะอะไร: Configuration parsing ต้อง robust และ environment-independent

12. "อะ! แต่โปรเจ็กต์ดังๆ ก็ใช้ emoji ในโค้ด!"
    → ไม่ยอมรับ! Popularity ไม่ใช่ technical merit - enterprise code ต้อง stricter standards
    → แก้ถูก: Follow established enterprise coding standards และ industry best practices
    → เพราะอะไร: Enterprise software ต้อง maintainable โดย global teams พร้อม different tooling และ environments

หลักการมืออาชีพ (ภาษาไทย):
Source code คือ TECHNICAL SPECIFICATION ไม่ใช่ creative expression
- ทุก character ใน source code ต้องมี technical purpose
- Readability มาจาก clear naming และ good structure ไม่ใช่ visual decorations
- International teams ต้อง collaborate ได้โดยไม่ติด cultural/visual barriers

กฎทองสำหรับตรวจสอบ (ภาษาไทย):
ถ้า character นี้ถูก copy/paste ไป terminal ที่ไม่ support Unicode properly แล้วกลายเป็น garbled text
= ห้ามใช้ใน professional codebase

ไม่มี "แต่มันดูน่ารัก" หรือ "ทำให้ code สนุก" - CODE คือ BUSINESS DOCUMENTATION
ห้าม EMOJI - PROFESSIONAL CODE เท่านั้น`
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
// MODULE EXPORTS - ส่งออกทั้ง Rules และ Engine
// ======================================================================
export { ABSOLUTE_RULES, ValidationEngine };



