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
// ! NO_HARDCODE - ห้าม Hardcode ค่าใดๆ (กฎเหล็กข้อที่ 2)
// ! ======================================================================
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
            en: 
            // ! ======================================================================            
                 `ABSOLUTE PHILOSOPHY: "HARDCODE IS EMBEDDING TECHNICAL DEBT WAITING TO EXPLODE"
            // ! ======================================================================
            This rule enforces THE SACRED BOUNDARY between "Code (Behavior)" and "Config (Environment)". Code written once should be able to run in ANY environment (Development, Staging, Production, Customer machines) without modifying even a single character.

            Every time any value is hardcoded, that's creating a "specialized version" of software tied to that specific environment. It's deliberately creating software that is FRAGILE, INSECURE, and NON-SCALABLE.

            // ! ======================================================================
                 DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS:
            // ! ======================================================================
            FLAWED LOGIC: "But it's just localhost for my own machine!"
            REAL ANSWER: Tomorrow there might be a new developer joining the team who uses Docker and their localhost is host.docker.internal. Your hardcode has instantly created problems for others. Good code must not make assumptions about anyone's environment.

            FLAWED LOGIC: "But it's just a constant that never changes, like retry count!"
            REAL ANSWER: On high-load Production, you might need 5 retries with Exponential Backoff, but on Development you might want it to fail immediately for faster debugging. Values that seem "constant" are actually "policy variables" that need to be adjustable.

            // ! ======================================================================
                 GOLDEN RULE FOR VERIFICATION:
            // ! ======================================================================
            "If someone without an IDE (like DevOps team, SRE, or even managers) wants to change this value, can they do it themselves through a Dashboard or config file without touching code at all?"

            // ! ======================================================================
                 CONCLUSION WITHOUT EXCEPTIONS:
            // ! ======================================================================
            Every character in your code should describe "LOGIC", not "ADDRESSES" or "SPECIFIC DATA". If it's not logic, it's config, and must be external to code without any exceptions.

            // ! ======================================================================
                 LEGACY PHILOSOPHY & DEEPER RATIONALE:
            // ! ======================================================================
            Code should define BEHAVIOR (what the system does), while Configuration should define ENVIRONMENT (where and how it runs). Embedding values that should be in configuration into source code destroys the separation between these two concerns, making code NON-PORTABLE (cannot move to different environments) and INSECURE (secrets exposed).

            Every hardcoded value is an "assumption" embedded in code, such as "the database will always be at this IP", "this API key will work forever". In reality, these assumptions are false and will create problems eventually.

            The rule enforces the principle of EXTERNALIZATION OF CONFIGURATION - all environment-specific, security-sensitive, or deployment-dependent values must be injected from outside the codebase.

            // ! ======================================================================
                 HIDDEN DANGERS:
            // ! ======================================================================
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

            // ! ======================================================================
                 LITMUS TEST:
            // ! ======================================================================
            Ask yourself: "If DevOps/SRE team needs to change this value for new environment (like new K8s cluster, new region), do they need to ask programmers to modify this source file?"
            - If answer is "YES": You're violating NO_HARDCODE
            - If answer is "NO" (they can change via ENV, .env, or Config Map): You're doing it right

            // ! ======================================================================
                 THE ABSOLUTE SOLUTION:
            // ! ======================================================================
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

            // ! ======================================================================
                 ADVANCED VIOLATION PATTERNS:
            // ! ======================================================================
            
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

            // ! ======================================================================
                 SOPHISTICATED DETECTION:
            // ! ======================================================================
            This rule catches not just obvious hardcoding but also:
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

            // ! ======================================================================
                 ZERO TOLERANCE:
            // ! ======================================================================
            No hardcoded URLs, API keys, database connections, file paths, timeouts, business rules, feature flags, security bypasses, resource limits, schedules, compliance settings, or ANY environment/deployment/business-specific values in source code.`,
// ! ======================================================================
            th: 
// ! ======================================================================            
            // ! ======================================================================            
                 `ปรัชญาและเหตุผลเชิงลึก:
            // ! ======================================================================
            โค้ดควรกำหนด BEHAVIOR (พฤติกรรมที่ระบบทำ) ส่วน Configuration ควรกำหนด ENVIRONMENT (สภาพแวดล้อมที่ทำงาน) การฝังค่าที่ควรอยู่ใน configuration ลงใน source code ทำลายการแยกระหว่างสองสิ่งนี้ ทำให้โค้ด NON-PORTABLE (ย้ายไป environment อื่นไม่ได้) และ INSECURE (ความลับเปิดเผย)

            ค่า hardcode ทุกตัวคือ "สมมติฐาน" ที่ฝังใน code เช่น "database จะอยู่ที่ IP นี้เสมอ", "API key นี้ใช้ได้ตลอดไป" ในความเป็นจริง สมมติฐานเหล่านี้เป็นเท็จและจะสร้างปัญหาในที่สุด

            // ! ======================================================================
                 หลักการสำคัญ:
            // ! ======================================================================
            ไม่มี hardcode ใดๆ ที่ยอมรับได้ - ไม่ว่าจะเป็น URL, API key, การเชื่อมต่อฐานข้อมูล, เส้นทางไฟล์, timeout, กฎธุรกิจ, feature flag, การข้าม security, ขีดจำกัดทรัพยากร, ตารางเวลา, การตั้งค่าการปฏิบัติตาม compliance หรือค่าใดๆ ที่เกี่ยวข้องกับ environment/deployment/business ใน source code

            กฎนี้บังคับหลักการ EXTERNALIZATION OF CONFIGURATION - ค่าทั้งหมดที่เกี่ยวกับ environment, security, deployment ต้องถูก inject จากภายนอก codebase

            // ! ======================================================================
                 อันตรายที่ซ่อนอยู่:
            // ! ======================================================================
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

            // ! ======================================================================
                 วิธีทดสอบความคิด (Litmus Test):
            // ! ======================================================================
            ถามตัวเอง: "ถ้าทีม DevOps/SRE ต้องการเปลี่ยนค่านี้สำหรับ environment ใหม่ (เช่น K8s cluster ใหม่, region ใหม่) เขาต้องมาขอให้โปรแกรมเมอร์แก้ไฟล์ source นี้หรือไม่?"
            - ถ้าตอบ "ใช่": คุณละเมิด NO_HARDCODE
            - ถ้าตอบ "ไม่" (แก้ผ่าน ENV, .env, Config Map ได้): คุณทำถูกต้อง

            // ! ======================================================================
                 วิธีแก้ไขสมบูรณ์:
            // ! ======================================================================
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

            // ! ======================================================================
                 *** LOOPHOLE CLOSURE - การปิดช่องโหว่ทุกรูปแบบ ***
            // ! ======================================================================

            // ! ======================================================================
                 เหตุผลที่คนอยากใช้ hardcode และการปิดช่องโหว่:
            // ! ======================================================================

            1. "OMG BUT IT'S JUST A LOCALHOST URL FOR DEVELOPMENT!"
                ไม่ยอมรับ! ทันทีที่เขียน localhost แล้ว Junior Developer คนอื่นจะคิดว่าต่อจากนี้ localhost ทั้งหมดใส่ hardcode ได้
                แก้ถูก: DEFAULT_DEV_URL = process.env.DEV_URL || 'http://localhost:3000'
                เพราะอะไร: โครงการใหญ่มักมี multiple localhost environments ที่ต่าง port กัน

            2. "DUDE! IT'S JUST FOR UNIT TESTS!"
                ไม่ยอมรับ! Test fixtures และ mock data ต้องอยู่ในไฟล์แยก หรือ test-specific configuration
                แก้ถูก: fixtures/test-urls.json, test-config.js หรือใช้ jest.setupFiles
                เพราะอะไร: Hardcode ใน test ทำให้เปลี่ยน test environment ไม่ได้

            3. "BRO, IT'S JUST A TIMEOUT CONSTANT!"
                ไม่ยอมรับ! Timeout behavior ต้องเปลี่ยนได้ตาม network conditions ของแต่ละ environment
                แก้ถูก: config.timeouts.httpRequest ที่มี default แต่ override ได้
                เพราะอะไร: Production might need 30 seconds, Development needs 5 seconds, Testing needs 1 second

            4. "OMG BUT IT'S JUST A DATABASE SCHEMA NAME!"
                ไม่ยอมรับ! Database naming convention ต่างกันใน environment ต่างๆ
                แก้ถูก: DB_SCHEMA environment variable with tenant-specific or environment-specific naming
                เพราะอะไร: Multi-tenant และ environment isolation

            5. "DUDE! IT'S A THIRD-PARTY OAUTH REDIRECT URL!"
                ไม่ยอมรับ! OAuth configuration เปลี่ยนตาม domain และ environment
                แก้ถูก: OAUTH_REDIRECT_BASE + computed path based on current domain
                เพราะอะไร: Staging, QA, Production มี different domains

            6. "BRO, IT'S JUST A SIMPLE FILE PATH!"
                ไม่ยอมรับ! File paths ต่างกันใน Windows/Linux และ container environments
                แก้ถูก: path.join(process.env.DATA_DIR || './data', filename)
                เพราะอะไร: Development: ./data, Production: /app/data, Docker: /var/app/data

            7. "OMG BUT THESE ARE INDUSTRY-STANDARD PORTS!"
                ไม่ยอมรับ! "Standard" ports อาจถูกใช้โดย service อื่น หรือ blocked โดย firewall
                แก้ถูก: PORT configuration ที่มี default แต่ override ได้
                เพราะอะไร: Production ใช้ port 8080, Development ใช้ 3000, Docker ใช้ 80

            8. "DUDE! IT'S JUST MAGIC NUMBERS FOR BUSINESS LOGIC!"
                ไม่ยอมรับ! Business rules เปลี่ยนและต้อง externalize เพื่อให้ business team แก้ได้โดยไม่ผ่าน engineering
                แก้ถูก: BUSINESS_RULES configuration หรือ feature flags
                เพราะอะไร: "Free shipping จาก 500 บาท" อาจเปลี่ยนเป็น 800 บาทโดยไม่แก้โค้ด

            9. "BRO, THESE ARE JUST REGEX VALIDATION PATTERNS!"
                ไม่ยอมรับ! Validation rules เปลี่ยนตาม country, regulations และ business requirements
                แก้ถูก: validation-rules.json configuration
                เพราะอะไร: Email regex สำหรับ international vs Thailand, Phone number formats

            10. "OMG BUT IT'S JUST CSS/STYLE CONSTANTS!"
                 ไม่ยอมรับ! Design systems และ theme ต้องเปลี่ยนได้ตาม brand guidelines หรือ A/B testing
                 แก้ถูก: CSS variables, theme configuration, design tokens
                 เพราะอะไร: White-label applications, dark/light themes, accessibility variants

            11. "DUDE! IT'S JUST ERROR MESSAGE STRINGS!"
                 ไม่ยอมรับ! Error messages ต้องแปลได้และเปลี่ยนตาม user persona
                 แก้ถูก: i18n configuration หรือ error-messages.json
                 เพราะอะไร: Multi-language, user-friendly vs technical messages

            12. "BRO, IT'S JUST FEATURE FLAG BOOLEAN VALUES!"
                 ไม่ยอมรับ! Feature flags ต้องควบคุมจาก runtime configuration
                 แก้ถูก: Feature flag service หรือ FEATURE_* environment variables
                 เพราะอะไร: Progressive rollout, A/B testing, instant rollback without deployment

            // ! ======================================================================
               GOLDEN RULE สำหรับตรวจสอบ: 
            // ! ======================================================================
               ถ้า DevOps, QA, Security, Business, หรือ Customer Support team ต้องการเปลี่ยนค่านี้โดยไม่ต้องรอ developer แก้โค้ด + code review + build + deploy ใหม่ 
               = ค่านั้นต้องเป็น configuration ไม่ใช่ hardcode

            // ! ======================================================================
                เหตุผลที่คนอยากใช้ hardcode และการปิดช่องโหว่ (เวอร์ชันภาษาไทย):
            // ! ======================================================================
            1. "เฮ้ย! แต่มันแค่ localhost URL สำหรับพัฒนานะ!"
                 ไม่ยอมรับ! ทันทีที่เขียน localhost แล้ว Junior Developer คนอื่นจะคิดว่าต่อจากนี้ localhost ทั้งหมดใส่ hardcode ได้
                 แก้ถูก: DEFAULT_DEV_URL = process.env.DEV_URL || 'http://localhost:3000'
                 เพราะอะไร: โครงการใหญ่มักมี multiple localhost environments ที่ต่าง port กัน

            2. "อะ! แต่มันแค่สำหรับ unit testing นี่!"
                ไม่ยอมรับ! Test fixtures และ mock data ต้องอยู่ในไฟล์แยก หรือ test-specific configuration
                แก้ถูก: fixtures/test-urls.json, test-config.js หรือใช้ jest.setupFiles
                เพราะอะไร: Hardcode ใน test ทำให้เปลี่ยน test environment ไม่ได้

            3. "เฮ้ย! แต่มันแค่ timeout constant นะ!"
                ไม่ยอมรับ! Timeout behavior ต้องเปลี่ยนได้ตาม network conditions ของแต่ละ environment
                แก้ถูก: config.timeouts.httpRequest ที่มี default แต่ override ได้
                เพราะอะไร: Production อาจต้อง 30 วินาที, Development ต้อง 5 วินาที, Testing ต้อง 1 วินาที

            4. "อะ! แต่มันแค่ database schema name!"
                ไม่ยอมรับ! Database naming convention ต่างกันใน environment ต่างๆ
                แก้ถูก: DB_SCHEMA environment variable with tenant-specific หรือ environment-specific naming
                เพราะอะไร: Multi-tenant และ environment isolation

            5. "เฮ้ย! แต่มันแค่ third-party OAuth redirect URL!"
                ไม่ยอมรับ! OAuth configuration เปลี่ยนตาม domain และ environment
                แก้ถูก: OAUTH_REDIRECT_BASE + computed path based on current domain
                เพราะอะไร: Staging, QA, Production มี different domains

            6. "อะ! แต่มันแค่ file path ธรรมดา!"
                ไม่ยอมรับ! File paths ต่างกันใน Windows/Linux และ container environments
                แก้ถูก: path.join(process.env.DATA_DIR || './data', filename)
                เพราะอะไร: Development: ./data, Production: /app/data, Docker: /var/app/data

            7. "เฮ้ย! แต่มันแค่ industry-standard ports!"
                ไม่ยอมรับ! "Standard" ports อาจถูกใช้โดย service อื่น หรือ blocked โดย firewall
                แก้ถูก: PORT configuration ที่มี default แต่ override ได้
                เพราะอะไร: Production ใช้ port 8080, Development ใช้ 3000, Docker ใช้ 80

            8. "อะ! แต่มันแค่ magic numbers สำหรับ business logic!"
                ไม่ยอมรับ! Business rules เปลี่ยนและต้อง externalize เพื่อให้ business team แก้ได้โดยไม่ผ่าน engineering
                แก้ถูก: BUSINESS_RULES configuration หรือ feature flags
                เพราะอะไร: "ส่งฟรีจาก 500 บาท" อาจเปลี่ยนเป็น 800 บาทโดยไม่แก้โค้ด

            9. "เฮ้ย! แต่มันแค่ regex validation patterns!"
                ไม่ยอมรับ! Validation rules เปลี่ยนตาม country, regulations และ business requirements
                แก้ถูก: validation-rules.json configuration
                เพราะอะไร: Email regex สำหรับ international vs Thailand, Phone number formats

            10. "อะ! แต่มันแค่ CSS/style constants!"
                 ไม่ยอมรับ! Design systems และ theme ต้องเปลี่ยนได้ตาม brand guidelines หรือ A/B testing
                 แก้ถูก: CSS variables, theme configuration, design tokens
                 เพราะอะไร: White-label applications, dark/light themes, accessibility variants

            11. "เฮ้ย! แต่มันแค่ error message strings!"
                 ไม่ยอมรับ! Error messages ต้องแปลได้และเปลี่ยนตาม user persona
                 แก้ถูก: i18n configuration หรือ error-messages.json
                 เพราะอะไร: Multi-language, user-friendly vs technical messages

            12. "อะ! แต่มันแค่ feature flag boolean values!"
                 ไม่ยอมรับ! Feature flags ต้องควบคุมจาม runtime configuration
                 แก้ถูก: Feature flag service หรือ FEATURE_* environment variables
                 เพราะอะไร: Progressive rollout, A/B testing, instant rollback without deployment
            // ! ======================================================================
                กฎทองสำหรับตรวจสอบ (ภาษาไทย): 
            // ! ======================================================================                
                ถ้าทีม DevOps, QA, Security, Business, หรือ Customer Support ต้องการเปลี่ยนค่านี้โดยไม่ต้องรอนักพัฒนาแก้โค้ด + code review + build + deploy ใหม่ 
                = ค่านั้นต้องเป็น configuration ไม่ใช่ hardcode

                ไม่มีข้อยกเว้น ไม่มีเหตุผลพิเศษ ไม่มี "แต่มันแค่..." - ห้าม HARDCODE เด็ดขาด`
        },
// ! ======================================================================        
        patterns: [
// ! ======================================================================            
            // ! HTTP/HTTPS URLs (all variants)
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

            // ! API Keys and Secrets (comprehensive patterns)
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

            // ! Database Connection Strings
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

            // ! Server/Host URLs and IPs
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

            // ! Environment-specific hardcoded values
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

            // ! File paths (absolute paths, especially on Windows/Unix)
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

            // ! Version numbers and build numbers
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

            // ! Magic numbers (common problematic values)
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

            // ! Cache expiration times
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

            // ! Phone numbers
            {
                regex: /['"](?:\+?[1-9]\d{1,14}|(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4})['"]/,
                name: 'Phone number hardcoded',
                severity: 'ERROR'
            },

            // ! Credit card test numbers (common test patterns)
            {
                regex: /['"](?:4111111111111111|4000000000000002|5555555555554444|2223003122003222|378282246310005)['"]/,
                name: 'Test credit card number (should use test data config)',
                severity: 'WARNING'
            },

            // ! Company/organization specific identifiers
            {
                regex: /['"](?:admin|administrator|root|superuser|sa|sysadmin)['"]/i,
                name: 'Admin/root username hardcoded',
                severity: 'ERROR'
            },

            // ! Encryption/Hash related hardcoded values
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

            // ! JWT tokens
            {
                regex: /['"]eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*['"]/,
                name: 'JWT token pattern',
                severity: 'ERROR'
            },

            // ! OAuth client secrets and IDs
            {
                regex: /(?:client_secret|client_id|oauth_token)['"]?\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
                name: 'OAuth client credentials',
                severity: 'ERROR'
            },

            // ! Webhook URLs
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

            // ! Cloud service keys and identifiers
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

            // ! Hardcoded salts and initialization vectors
            {
                regex: /(?:salt|iv|nonce)['"]?\s*[:=]\s*['"][a-zA-Z0-9+\/]{8,}['"]/i,
                name: 'Cryptographic salt/IV/nonce hardcoded',
                severity: 'ERROR'
            },

            // ! License keys
            {
                regex: /(?:license|serial|activation)['"]?\s*[:=]\s*['"][A-Z0-9-]{20,}['"]/i,
                name: 'License/serial key pattern',
                severity: 'ERROR'
            },

            // ! Payment processor keys
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
// ! ======================================================================        
        violationExamples: {
            en: [
// ! ======================================================================                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern HTTP/HTTPS URL hardcoded
                const API_URL = "https://api.production.com/v1";`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Stripe Live Secret Key
                const apiKey = "sk_live_12345abcdef";`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Hardcoded password
                const dbPassword = "mySecretPassword123";`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Slack webhook URL
                axios.post("https://hooks.slack.com/services/T00/B00/XXX");`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Numeric constants without context
                const timeout = 30000;`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern JWT Secret Key
                const JWT_SECRET = "my-super-secret-key";`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern MySQL/MariaDB connection string
                mysqli_connect("prod.db.server.com", "admin", "password123");`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Stripe Publishable Key
                const STRIPE_KEY = "pk_live_AbCdEf123456";`
            ],
// ! ======================================================================            
            th: [
// ! ======================================================================                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern HTTP/HTTPS URL hardcoded
                // @description hardcode URL production
                const API_URL = "https://api.production.com/v1";`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Stripe Live Secret Key
                // @description hardcode API key
                const apiKey = "sk_live_12345abcdef";`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Hardcoded password
                // @description hardcode รหัสผ่าน database
                const dbPassword = "mySecretPassword123";`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Slack webhook URL
                // @description hardcode webhook
                axios.post("https://hooks.slack.com/services/T00/B00/XXX");`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Numeric constants without context
                // @description hardcode timeout 30 วินาที
                const timeout = 30000;`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern JWT Secret Key
                // @description hardcode JWT secret
                const JWT_SECRET = "my-super-secret-key";`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern MySQL/MariaDB connection string
                // @description hardcode DB connection
                mysqli_connect("prod.db.server.com", "admin", "password123");`,
                
                `// @example-for-rule NO_HARDCODE
                // @type violation
                // @matches-pattern Stripe Publishable Key
                // @description hardcode Stripe key
                const STRIPE_KEY = "pk_live_AbCdEf123456";`
            ]
        },
// ! ======================================================================
        correctExamples: {
            en: [
// ! ======================================================================                
                `// @example-for-rule NO_HARDCODE
                // @type correct
                const API_URL = process.env.API_URL || config.api.baseUrl;`,
                
                `// @example-for-rule NO_HARDCODE
                // @type correct
                const apiKey = process.env.STRIPE_SECRET_KEY;`,
                
                `// @example-for-rule NO_HARDCODE
                // @type correct
                const dbPassword = process.env.DB_PASSWORD;`,
                
                `// @example-for-rule NO_HARDCODE
                // @type correct
                axios.post(config.webhooks.slack);`,
                
                `// @example-for-rule NO_HARDCODE
                // @type correct
                const timeout = config.network.requestTimeout;`,
                
                `// @example-for-rule NO_HARDCODE
                // @type correct
                const JWT_SECRET = process.env.JWT_SECRET;`,

                `// @example-for-rule NO_HARDCODE
                // @type correct
                mysqli_connect(config.db.host, config.db.user, config.db.password);`,
                
                `// @example-for-rule NO_HARDCODE
                // @type correct
                const STRIPE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;`
            ],
// ! ======================================================================            
            th: [
// ! ======================================================================
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
    }
};

// ! ======================================================================
// ! END OF NO_EMOJI Rule Definition
// ! ======================================================================

// ! ======================================================================
// ! MODULE EXPORTS - ส่งออกข้อมูลกฎเท่านั้น (เป็นหนังสือให้อ่าน)
// ! ======================================================================
export { ABSOLUTE_RULES };