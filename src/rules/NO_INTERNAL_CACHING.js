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
// ! NO_INTERNAL_CACHING - ห้ามสร้าง Cache ภายในฟังก์ชัน (กฎเหล็กข้อที่ 4)
// ! ======================================================================
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
            en: 
            // ! ======================================================================            
                 `ABSOLUTE PHILOSOPHY: "CACHE IS STATE, AND STATE IS THE ENEMY OF RELIABILITY"
            // ! ======================================================================
            
            The best function is a Pure Function: Same Input always gives Same Output no matter how many times, where, or when it runs. Such functions are easy to test, predictable, and can run safely in parallel.

            Internal Cache is deliberately destroying function purity. It's creating "Hidden Memory" that makes the same function return different results depending on its "execution history". This transforms what should be a simple function into a mini-application with its own State, which is a maintenance nightmare.

            // ! ======================================================================
                 DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS:
            // ! ======================================================================

            FLAWED LOGIC: "But it makes this function much faster!"
            REAL ANSWER: You're solving the performance problem in the wrong place. Caching is an "architecture" problem, not a "function" problem. The decision of what to cache, for how long, and when to clear should be managed from external layers (like Decorator, API Gateway, Redis) which allows us to control, monitor, and adjust caching strategies without touching Business Logic.

            FLAWED LOGIC: "It's just simple memoization for repetitive calculations"
            REAL ANSWER: Memoization without invalidation strategy is a Memory Leak waiting to explode. In long-running applications, that cache will grow and grow until it consumes all memory.

            // ! ======================================================================
                 GOLDEN RULE FOR VERIFICATION:
            // ! ======================================================================
            "If this application is scaled to run on 10 servers simultaneously, will the cache you created still be correct and consistent across all of them? If not, it's wrong design from the start."

            // ! ======================================================================
                 CONCLUSION WITHOUT EXCEPTIONS:
            // ! ======================================================================
            Your functions must have no memory. They must receive Input, process, and return Output - that's it. Let "state" and "performance" management be the responsibility of external architecture.

            // ! ======================================================================
                 LEGACY PHILOSOPHY & DEEPER RATIONALE:
            // ! ======================================================================
            Functions should have SINGLE RESPONSIBILITY (do one thing only). Creating cache inside a function combines TWO separate responsibilities: Business Logic + Caching Logic. This is a "Cross-Cutting Concern" (like Logging or Authentication) that should be handled separately.

            Internal caching creates HIDDEN STATE within functions, making them NON-PURE. A Pure Function should always return the same output for the same input - but cached functions return different values based on internal cache state, violating functional programming principles and making testing/debugging extremely difficult.

            // ! ======================================================================
                 HIDDEN DANGERS:
            // ! ======================================================================
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

            // ! ======================================================================
                 LITMUS TEST:
            // ! ======================================================================
            Ask yourself: "If I need to clear this function's cache from another part of the application, can I do it without restarting the entire process?"
            - If answer is "NO": You're violating NO_INTERNAL_CACHING
            - If answer is "YES" (because cache is managed by Redis, Memcached, or external caching layer): You're doing it right

            // ! ======================================================================
                 THE ABSOLUTE SOLUTION:
            // ! ======================================================================
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
// ! ======================================================================
            th: `
// ! ======================================================================            
            // ! ======================================================================            
                 ปรัชญาที่เด็ดขาด: "Cache คือสถานะ และสถานะคือศัตรูของความน่าเชื่อถือ"
            // ! ======================================================================
            
            ฟังก์ชันที่ดีที่สุดคือ Pure Function: Input เดียวกัน ให้ Output เดียวกันเสมอ ไม่ว่าจะรันกี่ครั้ง ที่ไหน หรือเมื่อไหร่ก็ตาม ฟังก์ชันแบบนี้ทดสอบง่าย, คาดเดาได้, และทำงานคู่ขนานกันได้อย่างปลอดภัย

            Internal Cache คือการจงใจทำลายความบริสุทธิ์ของฟังก์ชัน มันคือการสร้าง "หน่วยความจำที่ซ่อนอยู่ (Hidden State)" ทำให้ฟังก์ชันเดียวกันให้ผลลัพธ์ต่างกันได้ขึ้นอยู่กับ "ประวัติการรัน" ของมันเอง สิ่งนี้เปลี่ยนฟังก์ชันที่ควรจะเรียบง่ายให้กลายเป็นมินิแอปพลิเคชันที่มี State ของตัวเอง ซึ่งเป็นฝันร้ายของการจัดการ

            // ! ======================================================================
                 ตรรกะวิบัติของนักพัฒนาและคำตอบที่แท้จริง:
            // ! ======================================================================

            ตรรกะวิบัติ: "แต่มันทำให้ฟังก์ชันนี้เร็วขึ้นมาก!"
            คำตอบที่แท้จริง: คุณกำลังแก้ปัญหาประสิทธิภาพผิดที่ Caching เป็นปัญหาของ "สถาปัตยกรรม" ไม่ใช่ของ "ฟังก์ชัน" การตัดสินใจว่าจะ Cache อะไร, นานแค่ไหน, และจะล้างเมื่อไหร่ ควรถูกจัดการจาก Layer ภายนอก (เช่น Decorator, API Gateway, Redis) ซึ่งทำให้เราสามารถควบคุม, มอนิเตอร์, และปรับเปลี่ยนกลยุทธ์ Caching ได้โดยไม่ต้องแก้โค้ด Business Logic

            ตรรกะวิบัติ: "มันเป็นแค่ Memoization ง่ายๆ สำหรับการคำนวณซ้ำๆ"
            คำตอบที่แท้จริง: Memoization ที่ไม่มีกลยุทธ์การล้าง (Invalidation Strategy) คือ Memory Leak ที่รอวันระเบิด ในแอปพลิเคชันที่ทำงานต่อเนื่อง (Long-running service) Cache นั้นจะใหญ่ขึ้นเรื่อยๆ จนกินหน่วยความจำทั้งหมด

            // ! ======================================================================
                 กฎทองสำหรับตรวจสอบ:
            // ! ======================================================================
            "ถ้าแอปพลิเคชันนี้ถูกสเกลไปทำงานบน 10 Server พร้อมกัน Cache ที่คุณสร้างขึ้นจะยังคงถูกต้องและสอดคล้องกันทั้งหมดหรือไม่? ถ้าไม่ มันคือการออกแบบที่ผิดตั้งแต่ต้น"

            // ! ======================================================================
                 บทสรุปที่ไม่มีข้อยกเว้น:
            // ! ======================================================================
            ฟังก์ชันของคุณต้องไม่มีหน่วยความจำ มันต้องรับ Input, ประมวลผล, และคืน Output จบแค่นั้น ปล่อยให้การจัดการ "สถานะ" และ "ประสิทธิภาพ" เป็นหน้าที่ของสถาปัตยกรรมภายนอก

            // ! ======================================================================
                 ปรัชญาและเหตุผลเชิงลึกดั้งเดิม:
            // ! ======================================================================
            ฟังก์ชันควรมี SINGLE RESPONSIBILITY (ทำหน้าที่เพียงอย่างเดียว) การสร้าง cache ภายในฟังก์ชันรวมความรับผิดชอบ 2 อย่าง: Business Logic + Caching Logic นี่เป็น "Cross-Cutting Concern" (เหมือน Logging หรือ Authentication) ที่ควรจัดการแยกต่างหาก

            Internal caching สร้าง HIDDEN STATE ในฟังก์ชัน ทำให้ไม่เป็น Pure Function อีกต่อไป ฟังก์ชัน Pure ควรคืนค่าเดียวกันสำหรับ input เดียวกันเสมอ - แต่ฟังก์ชันที่มี cache คืนค่าต่างกันตามสถานะ cache ภายใน ละเมิดหลัก functional programming และทำให้ test/debug ยากมาก

            // ! ======================================================================
                 อันตรายที่ซ่อนอยู่:
            // ! ======================================================================
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

            // ! ======================================================================
                 วิธีทดสอบความคิด (Litmus Test):
            // ! ======================================================================
            ถามตัวเอง: "ถ้าฉันต้องการล้าง cache ของฟังก์ชันนี้จากส่วนอื่นของแอปพลิเคชัน ฉันทำได้โดยไม่ต้อง restart process ทั้งหมดหรือไม่?"
            - ถ้าตอบ "ไม่": คุณละเมิด NO_INTERNAL_CACHING
            - ถ้าตอบ "ใช่" (เพราะ cache จัดการโดย Redis, Memcached, หรือ external caching layer): คุณทำถูกต้อง

            // ! ======================================================================
                 วิธีแก้ไขสมบูรณ์:
            // ! ======================================================================
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

            // ! ======================================================================
                 LOOPHOLE CLOSURE - การปิดช่องโหว่ทุกรูปแบบ
            // ! ======================================================================
            เหตุผลที่คนอยากใช้ internal caching และการปิดช่องโหว่:

            1. "OMG BUT IT'S JUST FOR PERFORMANCE OPTIMIZATION!"
                ไม่ยอมรับ! Performance optimization ต้องทำแบบ centralized และ measurable ไม่ใช่ hidden internal cache
                แก้ถูก: External caching layer พร้อม monitoring และ cache hit/miss metrics
                เพราะอะไร: Internal cache ไม่สามารถ monitor, tune หรือ debug ได้ง่าย

            2. "DUDE! IT'S JUST A SIMPLE MEMOIZATION FOR EXPENSIVE CALCULATIONS!"
                ไม่ยอมรับ! Expensive calculations ต้องใช้ proper caching strategy พร้อม TTL และ invalidation
                แก้ถูก: Dedicated computation cache service หรือ memoization library with proper lifecycle
                เพราะอะไร: Manual memoization ไม่มี memory management และอาจ memory leak

            3. "BRO, IT'S JUST FOR AVOIDING DUPLICATE API CALLS!"
                ไม่ยอมรับ! API call deduplication ต้องทำใน HTTP layer หรือ API client layer
                แก้ถูก: HTTP cache headers, API client with request deduplication หรือ GraphQL DataLoader pattern
                เพราะอะไร: Function-level deduplication ไม่ respect HTTP semantics และ cache invalidation

            4. "OMG BUT IT'S JUST FOR STATIC DATA THAT NEVER CHANGES!"
                ไม่ยอมรับ! "Never changes" คือ assumption ที่อันตราย - data เปลี่ยนได้เสมอ
                แก้ถูก: Configuration store หรือ static assets loading พร้อม cache invalidation mechanism
                เพราะอะไร: Static assumptions break เมื่อ requirements เปลี่ยนและไม่มี invalidation strategy

            5. "DUDE! IT'S JUST FOR DATABASE QUERY RESULT CACHING!"
                ไม่ยอมรับ! Database caching ต้องทำใน database layer หรือ dedicated cache layer
                แก้ถูก: Database query cache, Redis cache หรือ ORM-level caching พร้อม proper invalidation
                เพราะอะไร: Function-level DB caching bypass database transaction isolation และ data consistency

            6. "BRO, IT'S JUST FOR PARSED CONFIGURATION DATA!"
                ไม่ยอมรับ! Configuration parsing ต้องทำครั้งเดียวตอน application startup
                แก้ถูก: Configuration loader ที่ parse ตอน bootstrap พร้อม hot-reload mechanism
                เพราะอะไร: Runtime config parsing cache ป้องกัน configuration updates และ environment changes

            7. "OMG BUT IT'S JUST FOR USER SESSION DATA!"
                ไม่ยอมรับ! User session ต้องเก็บใน session store ไม่ใช่ application memory
                แก้ถูก: Redis session store, database sessions หรือ JWT stateless sessions
                เพราะอะไร: In-memory session cache ไม่ work ใน multi-instance deployment และ horizontal scaling

            8. "DUDE! IT'S JUST FOR TEMPLATE RENDERING CACHE!"
                ไม่ยอมรับ! Template caching ต้องทำใน template engine layer
                แก้ถูก: Template engine built-in caching (เช่น Handlebars precompiled templates)
                เพราะอะไร: Custom template cache ไม่ integrate กับ template engine optimization และ debug tools

            9. "BRO, IT'S JUST FOR VALIDATION RULES PARSING!"
                ไม่ยอมรับ! Validation rules ต้อง compile ตอน application startup
                แก้ถูก: Pre-compiled validation schemas หรือ validation library with built-in compilation caching
                เพราะอะไร: Runtime validation parsing cache อาจ outdated เมื่อ rules เปลี่ยน

            10. "OMG BUT IT'S JUST FOR TIMEZONE/LOCALE DATA!"
                 ไม่ยอมรับ! Timezone/locale data ต้องใช้ standard library caching
                 แก้ถูก: Intl API, moment.js timezone caching หรือ i18n library built-in cache
                 เพราะอะไร: Custom timezone cache อาจ outdated เมื่อมี timezone rule changes

            11. "DUDE! IT'S JUST FOR FILE SYSTEM READ CACHE!"
                 ไม่ยอมรับ! File system caching ต้องทำใน OS level หรือ application-level file cache
                 แก้ถูก: OS file system cache, application file loader พร้อม file watcher
                 เพราะอะไร: Custom file cache ไม่ detect file changes และ memory management issues

            12. "BRO, IT'S JUST FOR CRYPTO/HASH COMPUTATION CACHE!"
                 ไม่ยอมรับ! Crypto operations ต้องใช้ proper key derivation functions หรือ crypto library caching
                 แก้ถูก: Proper PBKDF2/bcrypt/scrypt พร้อม built-in optimization หรือ dedicated crypto cache service
                 เพราะอะไร: Custom crypto cache อาจ security vulnerability และไม่ follow crypto best practices

            // ! ======================================================================
                 ARCHITECTURAL PRINCIPLE:
            // ! ======================================================================
            Caching เป็น CROSS-CUTTING CONCERN ไม่ใช่ business logic concern
            - Business functions ต้อง pure และ stateless
            - Caching ต้องทำใน infrastructure layer (Redis, database, HTTP, CDN)
            - Performance optimization ต้อง measurable และ configurable

            // ! ======================================================================
                 GOLDEN RULE สำหรับตรวจสอบ:
            // ! ======================================================================
            ถ้า function นี้ถูกเรียกใน different process/thread/instance แล้ว cache ไม่ shared
            = คุณกำลัง optimize แค่ local scope แทนที่จะ solve ปัญหาที่ architecture level

            ไม่มี "แต่มัน optimize แค่นิดเดียว" - ทุก optimization ต้อง global และ maintainable
            ZERO INTERNAL STATE - PURE FUNCTIONS ONLY

            // ! ======================================================================
                 การปิดช่องโหว่ทุกรูปแบบ - LOOPHOLE CLOSURE (เวอร์ชันภาษาไทย)
            // ! ======================================================================

            เหตุผลที่คนอยากใช้ internal caching และการปิดช่องโหว่:

            1. "เฮ้ย! แต่มันแค่ performance optimization นะ!"
                ไม่ยอมรับ! Performance optimization ต้องทำแบบ centralized และ measurable ไม่ใช่ซ่อนใน function
                แก้ถูก: External caching layer พร้อม monitoring และ cache hit/miss metrics
                เพราะอะไร: Internal cache ไม่สามารถ monitor, tune หรือ debug ได้ง่าย

            2. "อะ! แต่มันแค่ memoization ธรรมดาสำหรับการคำนวณที่หนัก!"
                ไม่ยอมรับ! การคำนวณที่หนักต้องใช้ proper caching strategy พร้อม TTL และ invalidation
                แก้ถูก: Dedicated computation cache service หรือ memoization library ที่มี proper lifecycle
                เพราะอะไร: Manual memoization ไม่มี memory management และอาจ memory leak

            3. "เฮ้ย! แต่มันแค่หลีกเลี่ยง duplicate API calls!"
                ไม่ยอมรับ! API call deduplication ต้องทำใน HTTP layer หรือ API client layer
                แก้ถูก: HTTP cache headers, API client ที่มี request deduplication หรือ GraphQL DataLoader pattern
                เพราะอะไร: Function-level deduplication ไม่ respect HTTP semantics และ cache invalidation

            4. "อะ! แต่มันแค่ static data ที่ไม่เปลี่ยน!"
                ไม่ยอมรับ! "ไม่เปลี่ยน" คือ assumption ที่อันตราย - data เปลี่ยนได้เสมอ
                แก้ถูก: Configuration store หรือ static assets loading พร้อม cache invalidation mechanism
                เพราะอะไร: Static assumptions พังเมื่อ requirements เปลี่ยนและไม่มี invalidation strategy

            5. "เฮ้ย! แต่มันแค่ database query result caching!"
                ไม่ยอมรับ! Database caching ต้องทำใน database layer หรือ dedicated cache layer
                แก้ถูก: Database query cache, Redis cache หรือ ORM-level caching พร้อม proper invalidation
                เพราะอะไร: Function-level DB caching bypass database transaction isolation และ data consistency

            6. "อะ! แต่มันแค่ parsed configuration data!"
                ไม่ยอมรับ! Configuration parsing ต้องทำครั้งเดียวตอน application startup
                แก้ถูก: Configuration loader ที่ parse ตอน bootstrap พร้อม hot-reload mechanism
                เพราะอะไร: Runtime config parsing cache ป้องกัน configuration updates และ environment changes

            7. "เฮ้ย! แต่มันแค่ user session data!"
                ไม่ยอมรับ! User session ต้องเก็บใน session store ไม่ใช่ application memory
                แก้ถูก: Redis session store, database sessions หรือ JWT stateless sessions
                เพราะอะไร: In-memory session cache ไม่ work ใน multi-instance deployment และ horizontal scaling

            8. "อะ! แต่มันแค่ template rendering cache!"
                ไม่ยอมรับ! Template caching ต้องทำใน template engine layer
                แก้ถูก: Template engine built-in caching (เช่น Handlebars precompiled templates)
                เพราะอะไร: Custom template cache ไม่ integrate กับ template engine optimization และ debug tools

            9. "เฮ้ย! แต่มันแค่ validation rules parsing!"
                ไม่ยอมรับ! Validation rules ต้อง compile ตอน application startup
                แก้ถูก: Pre-compiled validation schemas หรือ validation library with built-in compilation caching
                เพราะอะไร: Runtime validation parsing cache อาจ outdated เมื่อ rules เปลี่ยน

            10. "อะ! แต่มันแค่ timezone/locale data!"
                 ไม่ยอมรับ! Timezone/locale data ต้องใช้ standard library caching
                 แก้ถูก: Intl API, moment.js timezone caching หรือ i18n library built-in cache
                 เพราะอะไร: Custom timezone cache อาจ outdated เมื่อมี timezone rule changes

            11. "เฮ้ย! แต่มันแค่ file system read cache!"
                 ไม่ยอมรับ! File system caching ต้องทำใน OS level หรือ application-level file cache
                 แก้ถูก: OS file system cache, application file loader พร้อม file watcher
                 เพราะอะไร: Custom file cache ไม่ detect file changes และ memory management issues

            12. "อะ! แต่มันแค่ crypto/hash computation cache!"
                 ไม่ยอมรับ! Crypto operations ต้องใช้ proper key derivation functions หรือ crypto library caching
                 แก้ถูก: Proper PBKDF2/bcrypt/scrypt พร้อม built-in optimization หรือ dedicated crypto cache service
                 เพราะอะไร: Custom crypto cache อาจเป็น security vulnerability และไม่ follow crypto best practices

            // ! ======================================================================
                 หลักการสถาปัตยกรรม (ภาษาไทย):
            // ! ======================================================================
            Caching เป็น CROSS-CUTTING CONCERN ไม่ใช่ business logic concern
            - Business functions ต้อง pure และ stateless
            - Caching ต้องทำใน infrastructure layer (Redis, database, HTTP, CDN)  
            - Performance optimization ต้อง measurable และ configurable

            // ! ======================================================================
                 กฎทองสำหรับตรวจสอบ (ภาษาไทย):
            // ! ======================================================================
            ถ้า function นี้ถูกเรียกใน different process/thread/instance แล้ว cache ไม่ shared
            = คุณกำลัง optimize แค่ local scope แทนที่จะ solve ปัญหาที่ architecture level

            ไม่มี "แต่มัน optimize แค่นิดเดียว" - ทุก optimization ต้อง global และ maintainable
            ห้าม INTERNAL STATE - PURE FUNCTIONS เท่านั้น`

        },
// ! ======================================================================        
        violationExamples: [],
        correctExamples: [],
        patterns: [
// ! ======================================================================            
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
// ! ======================================================================        
        violationExamples: {
// ! ======================================================================            
            en: [
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @description cache variable with Map/Object/Array
                function getData(id) { 
                    const cache = {}; 
                    if (cache[id]) return cache[id]; 
                }`,

                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @description memoize() function call
                const memoized = _.memoize(() => 1);`,

                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @description this.cache property
                class Service { 
                    constructor() { this.cache = {}; } 
                    getData(id) { 
                        if (this.cache[id]) return this.cache[id]; 
                    } 
                }`,

                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @description useMemo() - React internal memoization
                const memoizedValue = useMemo(() => expensiveCalculation(), [deps]);`
            ],
// ! ======================================================================            
            th: [
// ! ======================================================================                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @matches-pattern cache variable with Map/Object/Array
                // @description cache ภายใน
                const cache = {}; 
                function getData(id) { 
                    if (cache[id]) return cache[id]; 
                    cache[id] = fetch(id); 
                    return cache[id]; 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @matches-pattern memoize() function call
                // @description memoization ภายใน
                const memoized = _.memoize(expensiveFunction);`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @matches-pattern let result(s) storage
                // @description เก็บผลลัพธ์
                let lastResult; 
                function compute() { 
                    if (lastResult) return lastResult; 
                    lastResult = calculate(); 
                    return lastResult; 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @matches-pattern cache.has() check
                // @description Map cache
                const results = new Map(); 
                function process(key) { 
                    if (results.has(key)) return results.get(key); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @matches-pattern this.cache property
                // @description class cache
                class Service { 
                    constructor() { this.cache = {}; } 
                    getData(id) { 
                        if (this.cache[id]) return this.cache[id]; 
                    } 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @matches-pattern useMemo() - React internal memoization
                // @description React memoization
                const useMemo(() => expensiveCalculation(), [deps]);`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @matches-pattern cache[key] = value assignment
                // @description function property cache
                function factorial(n) { 
                    if (!factorial.cache) factorial.cache = {}; 
                    if (factorial.cache[n]) return factorial.cache[n]; 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type violation
                // @matches-pattern SWR hook (data caching)
                // @description SWR caching hook
                const stored = useSWR(key, fetcher);`
            ]
        },
// ! ======================================================================       
        correctExamples: {
// ! ======================================================================           
            en: [
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern pure function without cache
                // @description Pure function, let caller add cache
                function getData(id) { 
                    return fetch(id); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern external cache decorator
                // @description No memoization, use external cache decorator
                function expensiveFunction(input) { 
                    return calculate(input); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern external caching layer
                // @description Always compute, external caching layer handles optimization
                function compute(params) { 
                    return calculate(params); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern pure transformation
                // @description Pure transformation, caching is external concern
                function process(key, data) { 
                    return transform(key, data); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern dependency injection pattern
                // @description Inject dependencies, no internal cache
                class Service { 
                    getData(id, database) { 
                        return database.find(id); 
                    } 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern component level memoization
                // @description Let React handle memoization at component level
                function expensiveCalculation(deps) { 
                    return result; 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern pure recursive function
                // @description Pure recursive, cache externally if needed
                function factorial(n) { 
                    if (n <= 1) return 1; 
                    return n * factorial(n - 1); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern pure fetcher function
                // @description Pure fetcher, use external cache layer
                function fetcher(key) { 
                    return api.get(key); 
                }`
            ],
// ! ======================================================================            
            th: [
// ! ======================================================================                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern pure function without cache
                // @description ฟังก์ชันบริสุทธิ์ ให้ผู้เรียกใช้เพิ่ม cache
                function getData(id) { 
                    return fetch(id); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern external cache decorator
                // @description ไม่ใช้ memoization ใช้ cache decorator ภายนอก
                function expensiveFunction(input) { 
                    return calculate(input); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern external caching layer
                // @description คำนวณเสมอ ให้ caching layer ภายนอกจัดการ
                function compute(params) { 
                    return calculate(params); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern pure transformation
                // @description transformation บริสุทธิ์ caching เป็นเรื่องภายนอก
                function process(key, data) { 
                    return transform(key, data); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern dependency injection pattern
                // @description ใช้ dependency injection ไม่มี cache ภายใน
                class Service { 
                    getData(id, database) { 
                        return database.find(id); 
                    } 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern component level memoization
                // @description ให้ React จัดการ memoization ในระดับ component
                function expensiveCalculation(deps) { 
                    return result; 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern pure recursive function
                // @description recursion บริสุทธิ์ cache ภายนอกถ้าจำเป็น
                function factorial(n) { 
                    if (n <= 1) return 1; 
                    return n * factorial(n - 1); 
                }`,
                
                `// @example-for-rule NO_INTERNAL_CACHING
                // @type correct
                // @matches-pattern pure fetcher function
                // @description fetcher บริสุทธิ์ ใช้ cache layer ภายนอก
                function fetcher(key) { 
                    return api.get(key); 
                }`
            ]
        },
        fix: {
            en: 'Remove internal cache. Let the caller handle caching externally with Redis, Memcached, or a caching decorator.',
            th: 'ลบ cache ภายใน ให้ผู้เรียกใช้จัดการ cache จากภายนอกด้วย Redis, Memcached หรือ caching decorator'
        }
    },
};
// ! ======================================================================
// ! END OF NO_INTERNAL_CACHING - Rule Definition
// ! ======================================================================

// ! ======================================================================
// ! MODULE EXPORTS - ส่งออกข้อมูลกฎเท่านั้น (เป็นหนังสือให้อ่าน)
// ! ======================================================================
export { ABSOLUTE_RULES };