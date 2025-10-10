// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================

// ! ======================================================================
// ! ABSOLUTE RULES CONFIGURATION
// ! กฎเหล็กทั้ง 5 ข้อ พร้อมรายละเอียดครบถ้วน
// ! ======================================================================
// ! ======================================================================
// ! ABSOLUTE RULES DEFINITION - 5 กฎเหล็กของ Chahuadev
// ! ======================================================================
import errorHandler from '../error-handler/ErrorHandler.js';

const ABSOLUTE_RULES = {
// ! ======================================================================
// !  กฎเหล็กข้อที่ 1: NO_MOCKING - ห้ามใช้ Mock/Stub/Spy
// ! ======================================================================  
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
            en: 
            // ! ======================================================================            
                 `ABSOLUTE PHILOSOPHY: "MOCKING IS EVIDENCE OF ARCHITECTURAL FAILURE"
            // ! ======================================================================
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

            // ! ======================================================================
                 CONCLUSION WITHOUT EXCEPTIONS:
            // ! ======================================================================
            Every time you type jest.mock, ask yourself: "Am I about to test real behavior, or am I about to lie to myself that my code works correctly?" Fix the architecture, don't distort reality with Mocks.

            // ! ======================================================================
                 ENGINEERING CULTURE DESTRUCTION:
            // ! ======================================================================
            - Erosion of Accountability: When tests pass but production fails, teams start blame-shifting ("My tests pass, must be your part"). Mocking creates "silo culture" where everyone only cares about their own component, not system outcomes.
            - Loss of Refactoring Courage: When test suite is unreliable, teams fear code improvements. Technical Debt accumulates until system collapses. Velocity for new features approaches zero.
            - Creates "Not-Real-World" Mentality: Teams become comfortable with artificial scenarios instead of demanding robust, real integrations.

            // ! ======================================================================
                 BUSINESS IMPACT:
            // ! ======================================================================
            - Slower Time-to-Market: Every bug that should've been caught in tests means development cycles slow down due to Hotfixes, Rollbacks, and post-mortem meetings.
            - Opportunity Cost: Time engineers spend debugging integration issues that should be automatically detected is time they're NOT spending building revenue-generating features.
            - Customer Trust Erosion: Frequent production issues erode customer confidence, leading to churn and negative reviews.
            - Competitive Disadvantage: While competitors ship reliable software quickly, mocked teams are stuck in debug-fix-deploy cycles.

            // ! ======================================================================
                 LEGACY PHILOSOPHY & DEEPER RATIONALE:
            // ! ======================================================================
            This rule enforces the principle that tests should validate BEHAVIOR, not IMPLEMENTATION DETAILS. When we mock dependencies, we're telling our tests "when function A is called with value B, pretend it returns C" - this couples our tests to HOW something works internally, rather than WHAT the end result should be.
            Mocking is fundamentally about making assumptions about how code SHOULD work internally, rather than verifying how it ACTUALLY works when integrated. This creates a dangerous disconnect between test success and real-world functionality.

            // ! ======================================================================
                HIDDEN DANGERS:
            // ! ======================================================================
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
 
            // ! ======================================================================
                LITMUS TEST:
            // ! ======================================================================
            Ask yourself: "If I refactor the internal code of this module without changing its public API, should my tests still pass?"
            - If answer is "NO" (tests break): You're violating NO_MOCKING because your tests are coupled to implementation
            - If answer is "YES" (tests still pass): You're testing behavior correctly
 
            // ! ======================================================================
                THE ABSOLUTE SOLUTION:
            // ! ======================================================================
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

            // ! ======================================================================
                 CLOSING ALL LOOPHOLES:
            // ! ======================================================================
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
            // ! ======================================================================
                ARCHITECTURAL SOLUTIONS TO COMMON "UNMOCKABLE" SCENARIOS:
            // ! ======================================================================
               DATABASE  Repository Pattern with interface
               FILE SYSTEM  FileSystem abstraction service  
               HTTP CALLS  HttpClient interface with implementations
               RANDOM/CRYPTO  RandomGenerator/CryptoProvider services
               TIME/DATE  Clock/TimeProvider services
               ENVIRONMENT  Configuration provider
               LOGGING  Logger interface
               CACHING  Cache interface
               MESSAGING  MessageBus interface
               AUTHENTICATION  AuthProvider interface
            // ! ======================================================================
                 NO EXCEPTIONS:
            // ! ======================================================================               
            If you think something "can't be injected", you haven't found the right abstraction yet.
            
            // ! ======================================================================
                 Example:
            // ! ======================================================================
            BAD:  jest.mock('./database'); // Tests don't validate real database integration
            GOOD: function createUser(userData, database) { return database.save(userData); } // Tests can pass real or test database`,
                     
// ! ======================================================================
               th: `
// ! ======================================================================               
            // ! ======================================================================
                 ปรัชญาและเหตุผลเชิงลึก:
            // ! ======================================================================
               กฎนี้บังคับหลักการที่ว่า test ควรตรวจสอบ BEHAVIOR ไม่ใช่ IMPLEMENTATION DETAILS เมื่อเรา mock dependencies เราจะบอก test ว่า "เมื่อฟังก์ชัน A ถูกเรียกด้วยค่า B ให้ทำเป็นว่าได้ผลลัพธ์ C" สิ่งนี้ทำให้ test ผูกติดกับ วิธีการทำงานภายใน แทนที่จะเป็น ผลลัพธ์สุดท้าย ที่ควรได้รับ
               Mock คือการสร้างสมมติฐานเกี่ยวกับวิธีการทำงานภายใน แทนที่จะตรวจสอบว่าทำงานจริงอย่างไรเมื่อรวมกัน สิ่งนี้สร้างช่องว่างอันตรายระหว่างความสำเร็จของ test กับการทำงานจริง
               กฎนี้บังคับให้ปฏิบัติตาม Inversion of Control (IoC) และ Dependency Injection (DI) อย่างเคร่งครัด ซึ่งเป็นรากฐานของสถาปัตยกรรมซอฟต์แวร์ที่ยืดหยุ่นและทดสอบได้
            // ! ======================================================================
                อันตรายที่ซ่อนอยู่:
            // ! ======================================================================
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

            // ! ======================================================================
                วิธีทดสอบความคิด (Litmus Test):
            // ! ======================================================================
                ถามตัวเอง: "ถ้าฉัน refactor โค้ดภายในของ module นี้โดยไม่เปลี่ยน public API test ควรผ่านหรือไม่?"
               - ถ้าตอบ "ไม่" (test พัง): คุณละเมิด NO_MOCKING เพราะ test ผูกติดกับ implementation  
               - ถ้าตอบ "ใช่" (test ยังผ่าน): คุณทดสอบ behavior ถูกต้อง

            // ! ======================================================================
                วิธีแก้ไขสมบูรณ์:
            // ! ======================================================================
                ใช้ Dependency Injection (DI) เท่านั้น:
            // ! ======================================================================
                ฟังก์ชัน: 
            // ! ======================================================================
                 DEPENDENCY INJECTION PATTERNS (CORRECT APPROACH):
            // ! ======================================================================
            
            // Functions: ส่ง dependencies ผ่าน parameter เสมอ
            // ไม่ดี: Mock 'database'
            jest.mock('./database');

            // ดี: ส่ง 'database' เข้ามาตรงๆ
            function createUser(userData, database) {
              return database.save(userData);
            }

            // ใน test:
            const fakeDatabase = { save: async (data) => ({ id: 1, ...data }) };
            const result = await createUser({ name: 'Test' }, fakeDatabase);

            // Classes: ส่ง dependencies ผ่าน Constructor
            class UserService {
              // ไม่ดี: this.database = require('./database');
              
              // ดี: รับ database จากภายนอก
              constructor(database, emailService) {
                this.database = database;
                this.emailService = emailService;
              }
            }
            // ! ======================================================================
                 ADVANCED VIOLATION PATTERNS:
            // ! ======================================================================
            
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

            // ! ======================================================================
                 SOPHISTICATED ALTERNATIVES (The Right Way):
            // ! ======================================================================
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

            // ! ======================================================================
                 ตัวอย่าง:
            // ! ======================================================================
            ไม่ดี: jest.mock('./database'); // Test ไม่ validate integration database จริง
            ดี: function createUser(userData, database) { return database.save(userData); } // Test ส่ง database จริงหรือตัวทดสอบ database ได้
 
            // ! ======================================================================
                 เหตุผลที่คนอยากใช้ mocking และการปิดช่องโหว่:
            // ! ======================================================================
            1. "เฮ้ย! แต่ unit test ต้องเร็วนี่!"
                ไม่ยอมรับ! ความเร็วมาจาก architecture ที่ดี ไม่ใช่การ mock
                แก้ถูก: ใช้ in-memory database หรือ test containers สำหรับ integration tests
                เพราะอะไร: Mock ทำให้ test ไม่ validate real integration behavior

            2. "อะ! แต่ external API มันช้าแล้วก็ไม่เสถียร!"
                ไม่ยอมรับ! External API ต้องห่อใน service layer และใช้ test environment
                แก้ถูก: API Gateway pattern พร้อม test endpoint หรือ staging environment
                เพราะอะไร: Mock API response ไม่ test real network errors และ API contract changes

            3. "เฮ้ย! แต่ database connection มันหนักเกินไป!"
                ไม่ยอมรับ! Database testing ต้องใช้ proper test isolation
                แก้ถูก: Docker test containers, transaction rollback หรือ dedicated test database
                เพราะอะไร: Mock database ไม่ validate SQL syntax, constraints และ data integrity

            4. "อะ! แต่ file system I/O มันช้า!"
                ไม่ยอมรับ! File operations ต้องถูกออกแบบให้ testable
                แก้ถูก: Abstraction layer สำหรับ file operations พร้อม in-memory implementation
                เพราะอะไร: Mock file operations ไม่ test real file permissions และ disk space issues

            5. "เฮ้ย! แต่ time/date testing ทำไงล่ะ!"
                ไม่ยอมรับ! Time dependencies ต้อง inject เป็น parameter
                แก้ถุก: Clock abstraction ที่ inject เข้า function แทน Date.now() ตรงๆ
                เพราะอะไร: Mock time ไม่ test timezone issues และ daylight saving time

            6. "อะ! แต่ third-party library มันใช้ยาก!"
                ไม่ยอมรับ! Third-party ต้องห่อใน adapter pattern
                แก้ถูก: Wrapper class ที่ implement interface ชัดเจนแล้วทดสอบ adapter นั้น
                เพราะอะไร: Mock library ไม่ validate API compatibility และ version changes

            7. "เฮ้ย! แต่ email/SMS service มันต้องใช้เงิน!"
                ไม่ยอมรับ! Communication service ต้องมี test mode
                แก้ถูก: Service configuration ที่มี test mode หรือ sandbox environment
                เพราะอะไร: Mock communication ไม่ validate message formatting และ delivery constraints

            8. "อะ! แต่ authentication มันซับซ้อน!"
                ไม่ยอมรับ! Authentication ต้องออกแบบให้มี test user
                แก้ถูก: Test authentication token หรือ development-only auth bypass
                เพราะอะไร: Mock auth ไม่ validate permission logic และ security policies

            9. "เฮ้ย! แต่ legacy code มันแก้ไม่ได้!"
                ไม่ยอมรับ! Legacy integration ต้องค่อยๆ refactor
                แก้ถูก: Strangler Fig pattern - wrap legacy ใน interface ใหม่แล้วทดสอบ interface นั้น
                เพราะอะไร: Mock legacy ทำให้ไม่สามารถ validate การทำงานจริงของระบบเก่า

            10. "อะ! แต่ performance testing ต้องใช้ mock!"
                 ไม่ยอมรับ! Performance testing ต้องใช้ representative data
                 แก้ถูก: Load testing พร้อม realistic test data และ proper test environment
                 เพราะอะไร: Mock performance ไม่ reflect real bottlenecks และ resource constraints

            // ! ======================================================================
                 กฎทองสำหรับตรวจสอบ:
            // ! ======================================================================
            ถ้า production bug เกิดขึ้นแล้ว unit test ยัง pass = test suite ไม่ validate behavior จริง
            ถ้าต้อง mock เพื่อให้ test ผ่าน = architecture coupling too tight

            ไม่มีข้อยกเว้น ไม่มีเหตุผลพิเศษ - ZERO MOCKING, REAL TESTING ONLY`
          
        },
        // ! ======================================================================
        // ! violationExamples - ตัวอย่างการละเมิดกฎ NO_MOCKING
        // ! ======================================================================
        violationExamples: {
            // ! ------------------------------------------------------------------
            // ! ENGLISH VIOLATION EXAMPLES
            // ! ------------------------------------------------------------------
            en: [
                `// @example-for-rule NO_MOCKING
                // @type violation
                // @matches-pattern jest.mock() usage
                jest.mock('./emailService');
                const emailService = require('./emailService');
                emailService.send.mockResolvedValue(true);

                test('should send notification', async () => {
                  await sendNotification('user@example.com', 'Hello');
                  expect(emailService.send).toHaveBeenCalledWith('user@example.com', 'Hello');
                });`,

                `// @example-for-rule NO_MOCKING
                // @type violation
                // @matches-pattern sinon.stub() usage
                const sinon = require('sinon');
                const fs = require('fs');
                const stub = sinon.stub(fs, 'readFileSync').returns('fake data');

                test('should read config', () => {
                  const config = readConfig('./config.json');
                  expect(config).toBe('fake data');
                });`,

                `// @example-for-rule NO_MOCKING
                // @type violation
                // @matches-pattern jest.spyOn() usage
                const spy = jest.spyOn(userService, 'validateEmail');
                await createUser({email: 'test@test.com'});
                expect(spy).toHaveBeenCalledTimes(1);`
            ],
            // ! ------------------------------------------------------------------
            // ! THAI VIOLATION EXAMPLES (ตัวอย่างการละเมิดภาษาไทย)
            // ! ------------------------------------------------------------------
            th: [
                `// @example-for-rule NO_MOCKING
                // @type violation
                // @matches-pattern jest.mock() usage
                jest.mock('./emailService');
                const emailService = require('./emailService');
                emailService.send.mockResolvedValue(true);

                test('ควรส่งการแจ้งเตือน', async () => {
                  await sendNotification('user@example.com', 'สวัสดี');
                  expect(emailService.send).toHaveBeenCalledWith('user@example.com', 'สวัสดี');
                });`,

                `// @example-for-rule NO_MOCKING
                // @type violation
                // @matches-pattern sinon.stub() usage
                const sinon = require('sinon');
                const fs = require('fs');
                const stub = sinon.stub(fs, 'readFileSync').returns('ข้อมูลปลอม');

                test('ควรอ่าน config', () => {
                  const config = readConfig('./config.json');
                  expect(config).toBe('ข้อมูลปลอม');
                });`,

                `// @example-for-rule NO_MOCKING
                // @type violation
                // @matches-pattern jest.spyOn() usage
                const spy = jest.spyOn(userService, 'validateEmail');
                await createUser({email: 'test@test.com'});
                expect(spy).toHaveBeenCalledTimes(1);`
            ]
            // ! ======================================================================
            // ! END OF violationExamples - All violation patterns above
            // ! ======================================================================
        },
        // ! ======================================================================
        // ! correctExamples - ตัวอย่างการใช้งานที่ถูกต้อง (NO MOCKING)
        // ! ======================================================================
        correctExamples: {
            // ! ------------------------------------------------------------------
            // ! ENGLISH CORRECT EXAMPLES
            // ! ------------------------------------------------------------------
            en: [
                `// @example-for-rule NO_MOCKING
                // @type correct
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

                `// @example-for-rule NO_MOCKING
                // @type correct
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
            // ! ------------------------------------------------------------------
            // ! THAI CORRECT EXAMPLES (ตัวอย่างที่ถูกต้องภาษาไทย)
            // ! ------------------------------------------------------------------
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
            // ! ======================================================================
            // ! END OF correctExamples - All correct implementation patterns above
            // ! ======================================================================
        },
// ! ======================================================================        
        patterns: [
// ! ======================================================================            
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
    }
};

// ! ======================================================================
// ! END OF NO_EMOJI Rule Definition
// ! ======================================================================

// ! ======================================================================
// ! MODULE EXPORTS - ส่งออกข้อมูลกฎเท่านั้น (เป็นหนังสือให้อ่าน)
// ! ======================================================================
export { ABSOLUTE_RULES };