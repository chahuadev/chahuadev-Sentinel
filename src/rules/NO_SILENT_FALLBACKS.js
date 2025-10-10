
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
// ! NO_SILENT_FALLBACKS - ห้ามใช้ Fallback ที่ซ่อนปัญหา (กฎเหล็กข้อที่ 3)
// ! ======================================================================
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
            en: 
            // ! ======================================================================            
                 `ABSOLUTE PHILOSOPHY: "SILENCE IS A FORM OF DAMAGE"
            // ! ======================================================================
            In complex systems, "NO DATA" is better than "UNRELIABLE DATA". When a system crashes, that's a clear and useful signal. It creates Logs, Alerts and forces us to fix things. But when a system continues running silently with incorrect data or default values, that's creating Silent Catastrophe that will gradually destroy data and system reliability.

            This rule forces us to acknowledge that Errors are not things to hide, but the MOST VALUABLE information a system can give us for improvement.

            // ! ======================================================================
                 DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS:
            // ! ======================================================================
            FLAWED LOGIC: "I just don't want the app to crash in front of users, so I return empty values first"
            REAL ANSWER: You're not preventing crashes, you're just "postponing when it will crash" to a point far from the problem's source, making debugging 100x harder. The correct way is catching Errors at the top Layer, showing user-friendly "We apologize for the inconvenience" message, and sending aggressive Alerts to the development team immediately.

            FLAWED LOGIC: "It's a predictable and unimportant Error, so I catch and let it pass"
            REAL ANSWER: Errors that occur frequently but are ignored are signals of performance issues or design flaws. Logging every occurrence will help us see patterns and fix at root cause. NO Error is unimportant.

            // ! ======================================================================
                 GOLDEN RULE FOR VERIFICATION:
            // ! ======================================================================
            "If code in this catch block runs at 3 AM on Sunday night, will it make enough noise to wake someone on the team? If not, it's a bug waiting to grow."

            // ! ======================================================================
                 CONCLUSION WITHOUT EXCEPTIONS:
            // ! ======================================================================
            Every catch block must end with either throw or log.error() with complete details. Any return value that allows the next line of code to continue as if nothing happened is absolutely forbidden.

            // ! ======================================================================
                 LEGACY PHILOSOPHY & DEEPER RATIONALE:
            // ! ======================================================================
            Systems that fail incorrectly should "FAIL FAST, FAIL LOUD" (ล้มเร็ว ส่งเสียงดัง). Error swallowing or silently returning defaults creates "ZOMBIE SYSTEMS" - systems that appear to work externally but are internally corrupting data and malfunctioning continuously.

            This rule forces us to accept the reality that "ERRORS HAPPEN" and our responsibility is to make errors DETECTABLE, LOGGED, and ALERTABLE - not to hide them under the carpet.

            // ! ======================================================================
                 HIDDEN DANGERS:
            // ! ======================================================================
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

            // ! ======================================================================
                 LITMUS TEST:
            // ! ======================================================================
            Ask yourself: "If the code in this catch block or after this || executes at 3 AM on Saturday night, will I know about it (like getting PagerDuty/Slack alert)?"
            - If answer is "NO": You're violating NO_SILENT_FALLBACKS
            - If answer is "YES": You're doing it right

            // ! ======================================================================
                 THE ABSOLUTE SOLUTION:
            // ! ======================================================================
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
            
            th: `
            // ! ======================================================================            
                 ปรัชญาที่เด็ดขาด: "ความเงียบคือรูปแบบหนึ่งของความเสียหาย"
            // ! ======================================================================
            
            ในระบบที่ซับซ้อน "ไม่มีข้อมูล" ยังดีกว่า "ข้อมูลที่ไม่น่าเชื่อถือ" การที่ระบบล่ม (Crash) คือสัญญาณที่ชัดเจนและมีประโยชน์ มันสร้าง Log, Alert และบังคับให้เราต้องแก้ไข แต่การที่ระบบทำงานต่อไปเงียบๆ ด้วยข้อมูลที่ไม่ถูกต้องหรือค่า Default คือ การสร้างหายนะแบบเงียบ (Silent Catastrophe) ที่จะค่อยๆ ทำลายข้อมูลและความน่าเชื่อถือของทั้งระบบ

            กฎนี้บังคับให้เรายอมรับว่า Error ไม่ใช่สิ่งที่ต้องซ่อน แต่เป็นข้อมูลที่มีค่าที่สุด ที่ระบบสามารถมอบให้เราได้เพื่อใช้ในการปรับปรุง

            // ! ======================================================================
                 ตรรกะวิบัติของนักพัฒนาและคำตอบที่แท้จริง:
            // ! ======================================================================

            ตรรกะวิบัติ: "ผมแค่ไม่อยากให้แอปพังต่อหน้าผู้ใช้ ผมเลยคืนค่าว่างๆ กลับไปก่อน"
            คำตอบที่แท้จริง: คุณไม่ได้ป้องกันแอปพัง คุณแค่ "เลื่อนเวลาที่มันจะพัง" ไปยังจุดที่ห่างไกลจากต้นตอของปัญหา ทำให้การดีบักยากขึ้นเป็นร้อยเท่า วิธีที่ถูกต้องคือการดักจับ Error ที่ Layer บนสุด, แสดงข้อความ "ขออภัยในความไม่สะดวก" ที่เป็นมิตรต่อผู้ใช้, และส่ง Alert ที่เกรี้ยวกราดไปยังทีมพัฒนาทันที

            ตรรกะวิบัติ: "มันเป็น Error ที่คาดเดาได้และไม่สำคัญ ผมเลย catch แล้วปล่อยผ่าน"
            คำตอบที่แท้จริง: Error ที่เกิดขึ้นบ่อยครั้งแต่ถูกเพิกเฉย คือสัญญาณของปัญหาเชิงประสิทธิภาพหรือการออกแบบที่ผิดพลาด การ Log ทุกครั้งที่มันเกิดขึ้นจะทำให้เราเห็นแพตเทิร์นและแก้ไขที่ต้นเหตุได้ ไม่มี Error ใดที่ไม่สำคัญ

            // ! ======================================================================
                 กฎทองสำหรับตรวจสอบ:
            // ! ======================================================================
            "ถ้าโค้ดในบล็อก catch นี้ทำงานตอนตีสามของคืนวันอาทิตย์ มันจะส่งเสียงดังพอที่จะปลุกใครสักคนในทีมได้หรือไม่? ถ้าไม่ มันคือบั๊กที่รอวันเติบโต"

            // ! ======================================================================
                 บทสรุปที่ไม่มีข้อยกเว้น:
            // ! ======================================================================
            ทุกบล็อก catch ต้องจบด้วยการ throw หรือการ log.error() ที่มีรายละเอียดครบถ้วน การคืนค่าใดๆ ที่ทำให้โค้ดบรรทัดถัดไปทำงานต่อได้เสมือนว่าไม่มีอะไรเกิดขึ้น คือสิ่งต้องห้ามเด็ดขาด

            // ! ======================================================================
                 ปรัชญาและเหตุผลเชิงลึกดั้งเดิม:
            // ! ======================================================================
            ระบบที่ทำงานผิดควร "ล้มเร็ว ส่งเสียงดัง" (FAIL FAST, FAIL LOUD) การกลืน Error หรือคืนค่า default แบบเงียบๆ สร้าง "ระบบซอมบี้" - ระบบที่ดูเหมือนทำงานปกติภายนอก แต่ภายในกำลังทำลายข้อมูลและทำงานผิดพลาดต่อเนื่อง

            กฎนี้บังคับให้เรายอมรับความจริงว่า "ข้อผิดพลาดเกิดขึ้นได้" และหน้าที่ของเราคือทำให้ข้อผิดพลาดนั้น DETECTABLE (ตรวจจับได้), LOGGED (บันทึกไว้), และ ALERTABLE (แจ้งเตือนได้) - ไม่ใช่ซ่อนใต้พรม

            // ! ======================================================================
                 อันตรายที่ซ่อนอยู่:
            // ! ======================================================================
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

            // ! ======================================================================
                 วิธีทดสอบความคิด (Litmus Test):
            // ! ======================================================================
            ถามตัวเอง: "ถ้าโค้ดใน catch block หรือหลัง || นี้ทำงานตอนตี 3 คืนวันเสาร์ ฉันจะรู้เรื่องหรือไม่ (เช่น มี alert วิ่งเข้า PagerDuty/Slack)?"
            - ถ้าตอบ "ไม่": คุณละเมิด NO_SILENT_FALLBACKS
            - ถ้าตอบ "ใช่": คุณทำถูกต้อง

            // ! ======================================================================
                 วิธีแก้ไขสมบูรณ์:
            // ! ======================================================================
            ปฏิบัติตาม "สัญญาการจัดการข้อผิดพลาด":

            ทุก catch ต้องทำ 2 อย่างเสมอ:
            1. Log structured error: บันทึก error พร้อม context เต็ม
               logger.error({ message: 'Failed to process user data', error, userId, timestamp });
               
            2. Throw หรือ Propagate: throw error ต่อไปให้ layer สูงกว่าจัดการ หรือคืนค่าแทน error ที่ชัดเจน
               throw error; // หรือ return { success: false, error: 'ข้อความ error ชัดเจน' };

            // ! ======================================================================
                 ห้ามคืนค่าที่ดูเหมือนสำเร็จ:
            // ! ======================================================================

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

            // ! ======================================================================
                 LOOPHOLE CLOSURE - การปิดช่องโหว่ทุกรูปแบบ
            // ! ======================================================================
            เหตุผลที่คนอยากใช้ silent fallback และการปิดช่องโหว่:

            1. "OMG BUT IT'S JUST FOR GRACEFUL DEGRADATION!"
                ไม่ยอมรับ! Graceful degradation ต้อง OBSERVABLE และมี ALERTS ไม่ใช่ silent
                แก้ถูก: Log ทุก degradation พร้อม alert และ fallback indicator ให้ monitoring team เห็น
                เพราะอะไร: Silent degradation กลายเป็น technical debt และ production issue ที่ไม่มีใครสังเกต

            2. "DUDE! IT'S JUST A DEFAULT VALUE FOR CONVENIENCE!"
                ไม่ยอมรับ! Default value ต้องมีเหตุผลที่ดีและถูก document อย่างชัดเจน
                แก้ถูก: Explicit defaults ใน configuration พร้อม validation ว่าค่านั้นเหมาะสมหรือไม่
                เพราะอะไร: Default ที่ implicit อาจไม่เหมาะกับ environment หรือ use case ปัจจุบัน

            3. "BRO, IT'S JUST A RETRY MECHANISM!"
                ไม่ยอมรับ! Retry ต้องมี circuit breaker และ monitoring ไม่ใช่ retry แล้วปิดเงียบ
                แก้ถูก: Structured retry policy พร้อม exponential backoff และ fail after N attempts พร้อม alert
                เพราะอะไร: Infinite silent retry กิน resource และ mask serious infrastructure problems

            4. "OMG BUT IT'S JUST FOR NON-CRITICAL FEATURES!"
                ไม่ยอมรับ! "Non-critical" เป็น business decision ไม่ใช่ engineering decision - ต้อง explicit
                แก้ถูก: Feature flag configuration พร้อม graceful disable notification ให้ user
                เพราะอะไร: Features ที่คิดว่า non-critical อาจ critical สำหรับ specific user segment

            5. "DUDE! IT'S JUST FOR CACHE MISS SCENARIOS!"
                ไม่ยอมรับ! Cache miss ต้อง logged และ monitored เพื่อ tune cache strategy
                แก้ถูก: Cache miss พร้อม metrics และ fallback to primary data source with performance tracking
                เพราะอะไร: Silent cache miss ป้องกันการ optimize cache hit ratio

            6. "BRO, IT'S JUST A FALLBACK UI COMPONENT!"
                ไม่ยอมรับ! UI fallback ต้อง show error boundary พร้อม error reporting ไม่ใช่แสดง component ธรรมดา
                แก้ถูก: Error boundary component พร้อม user-friendly error message และ error reporting to monitoring
                เพราะอะไร: Silent UI fallback ทำให้ user confused และ developer ไม่รู้ว่ามี error

            7. "OMG BUT IT'S JUST FOR OPTIONAL API FIELDS!"
                ไม่ยอมรับ! Optional fields ต้อง validate ว่าจริงๆ optional หรือเป็น breaking change ที่ไม่ได้ detect
                แก้ถูก: API schema validation พร้อม deprecation warnings สำหรับ missing optional fields
                เพราะอะไร: Fields ที่ควรจะมีแต่หายไป อาจเป็น API version mismatch หรือ data corruption

            8. "DUDE! IT'S JUST FOR BACKWARD COMPATIBILITY!"
                ไม่ยอมรับ! Backward compatibility ต้องมี deprecation timeline และ migration path ไม่ใช่ silent forever
                แก้ถูก: Versioned compatibility layer พร้อม deprecation warnings และ migration guidance
                เพราะอะไร: Silent backward compatibility ป้องกัน technology stack evolution และ security updates

            9. "BRO, IT'S JUST FOR A/B TESTING FALLBACK!"
                ไม่ยอมรับ! A/B test fallback ต้อง tracked เพื่อ measure control group ไม่ใช่ silent default
                แก้ถูก: A/B testing framework พร้อม explicit control group tracking และ experiment analytics
                เพราะอะไร: Silent fallback ทำให้ experiment results invalid และ statistical significance calculation ผิด

                 ไม่ยอมรับ! Third-party downtime ต้อง alert operations team และ consider circuit breaker
                 แก้ถูก: Service health check พร้อม circuit breaker pattern และ escalation to operations
                 เพราะอะไร: Silent third-party failure ป้องกัน proactive vendor management และ SLA enforcement

            11. "DUDE! IT'S JUST FOR DATABASE READ REPLICA FAILURES!"
                 ไม่ยอมรับ! Replica failure ต้อง switch to primary พร้อม DBA notification
                 แก้ถูก: Database connection pool พร้อม automatic failover และ database health monitoring
                 เพราะอะไร: Silent replica failure อาจ indicate infrastructure problem ที่ต้อง urgent fix

            12. "BRO, IT'S JUST FOR RATE LIMITING SCENARIOS!"
                 ไม่ยอมรับ! Rate limit hit ต้อง logged และ consider exponential backoff ไม่ใช่ silent skip
                 แก้ถูก: Rate limiting พร้อม proper HTTP status codes, retry headers และ client-side queue management
                 เพราะอะไร: Silent rate limiting ทำให้ client ไม่รู้ว่า service overloaded

            // ! ======================================================================
                 GOLDEN RULE สำหรับตรวจสอบ:
            // ! ======================================================================
            ถ้า error/fallback เกิดขึ้นตอน 3 AM วันอาทิตย์ และไม่มีคน on-call ได้รับ notification
            = คุณกำลังซ่อนปัญหาที่อาจ cascade เป็น major incident ภายหลัง

            ไม่มี "แต่มันไม่สำคัญ" - ทุก failure mode ต้อง observable และ actionable
            ZERO SILENT FAILURES - FAIL LOUD OR DON'T FAIL

            // ! ======================================================================
                 การปิดช่องโหว่ทุกรูปแบบ - LOOPHOLE CLOSURE (เวอร์ชันภาษาไทย)
            // ! ======================================================================
            เหตุผลที่คนอยากใช้ silent fallback และการปิดช่องโหว่:

            1. "เฮ้ย! แต่มันแค่ graceful degradation นะ!"
                ไม่ยอมรับ! Graceful degradation ต้อง OBSERVABLE และมี ALERTS ไม่ใช่ silent
                แก้ถูก: Log ทุก degradation พร้อม alert และ fallback indicator ให้ monitoring team เห็น
                เพราะอะไร: Silent degradation กลายเป็น technical debt และ production issue ที่ไม่มีใครสังเกต

            2. "อะ! แต่มันแค่ default value เพื่อความสะดวก!"
                ไม่ยอมรับ! Default value ต้องมีเหตุผลที่ดีและถูก document อย่างชัดเจน
                แก้ถูก: Explicit defaults ใน configuration พร้อม validation ว่าค่านั้นเหมาะสมหรือไม่
                เพราะอะไร: Default ที่ implicit อาจไม่เหมาะกับ environment หรือ use case ปัจจุบัน

            3. "เฮ้ย! แต่มันแค่ retry mechanism!"
                ไม่ยอมรับ! Retry ต้องมี circuit breaker และ monitoring ไม่ใช่ retry แล้วปิดเงียบ
                แก้ถูก: Structured retry policy พร้อม exponential backoff และ fail after N attempts พร้อม alert
                เพราะอะไร: Infinite silent retry กิน resource และ mask serious infrastructure problems

            4. "อะ! แต่มันแค่ feature ที่ไม่สำคัญ!"
                ไม่ยอมรับ! "ไม่สำคัญ" เป็น business decision ไม่ใช่ engineering decision - ต้อง explicit
                แก้ถูก: Feature flag configuration พร้อม graceful disable notification ให้ user
                เพราะอะไร: Features ที่คิดว่าไม่สำคัญ อาจสำคัญมากสำหรับ specific user segment

            5. "เฮ้ย! แต่มันแค่ cache miss scenarios!"
                แก้ถูก: Cache miss พร้อม metrics และ fallback to primary data source with performance tracking
                เพราะอะไร: Silent cache miss ป้องกันการ optimize cache hit ratio

            6. "อะ! แต่มันแค่ fallback UI component!"
                ไม่ยอมรับ! UI fallback ต้อง show error boundary พร้อม error reporting ไม่ใช่แสดง component ธรรมดา
                แก้ถูก: Error boundary component พร้อม user-friendly error message และ error reporting to monitoring
                เพราะอะไร: Silent UI fallback ทำให้ user งงและ developer ไม่รู้ว่ามี error

            7. "เฮ้ย! แต่มันแค่ optional API fields!"
                ไม่ยอมรับ! Optional fields ต้อง validate ว่าจริงๆ optional หรือเป็น breaking change ที่ไม่ได้ detect
                แก้ถูก: API schema validation พร้อม deprecation warnings สำหรับ missing optional fields
                เพราะอะไร: Fields ที่ควรจะมีแต่หายไป อาจเป็น API version mismatch หรือ data corruption

            8. "อะ! แต่มันแค่ backward compatibility!"
                ไม่ยอมรับ! Backward compatibility ต้องมี deprecation timeline และ migration path ไม่ใช่ silent forever
                แก้ถูก: Versioned compatibility layer พร้อม deprecation warnings และ migration guidance
                เพราะอะไร: Silent backward compatibility ป้องกัน technology stack evolution และ security updates

            9. "เฮ้ย! แต่มันแค่ A/B testing fallback!"
                ไม่ยอมรับ! A/B test fallback ต้อง tracked เพื่อ measure control group ไม่ใช่ silent default
                แก้ถูก: A/B testing framework พร้อม explicit control group tracking และ experiment analytics
                เพราะอะไร: Silent fallback ทำให้ experiment results invalid และ statistical significance calculation ผิด

            10. "อะ! แต่มันแค่ third-party service downtime!"
                 ไม่ยอมรับ! Third-party downtime ต้อง alert operations team และ consider circuit breaker
                 แก้ถูก: Service health check พร้อม circuit breaker pattern และ escalation to operations
                 เพราะอะไร: Silent third-party failure ป้องกัน proactive vendor management และ SLA enforcement

            11. "เฮ้ย! แต่มันแค่ database read replica failures!"
                 ไม่ยอมรับ! Replica failure ต้อง switch to primary พร้อม DBA notification
                 แก้ถูก: Database connection pool พร้อม automatic failover และ database health monitoring
                 เพราะอะไร: Silent replica failure อาจ indicate infrastructure problem ที่ต้อง urgent fix

            12. "อะ! แต่มันแค่ rate limiting scenarios!"
                 ไม่ยอมรับ! Rate limit hit ต้อง logged และ consider exponential backoff ไม่ใช่ silent skip
                 แก้ถูก: Rate limiting พร้อม proper HTTP status codes, retry headers และ client-side queue management
                 เพราะอะไร: Silent rate limiting ทำให้ client ไม่รู้ว่า service โอเวอร์โหลด           
            // ! ======================================================================
                 กฎทองสำหรับตรวจสอบ (ภาษาไทย):
            // ! ======================================================================
            ถ้า error/fallback เกิดขึ้นตอน 3 ทุ่มวันอาทิตย์ และไม่มีคน on-call ได้รับ notification
            = คุณกำลังซ่อนปัญหาที่อาจ cascade เป็น major incident ภายหลัง

            ไม่มี "แต่มันไม่สำคัญ" - ทุก failure mode ต้อง observable และ actionable
            ห้าม SILENT FAILURES - FAIL LOUD หรือไม่ต้อง FAIL`

        },
// ! ======================================================================        
        violationExamples: [],
        correctExamples: [],
        patterns: [
// ! ======================================================================            
            // ═══════════════════════════════════════════════════════════════════
            // ! || OPERATOR SILENT FALLBACKS - จับ || ที่ซ่อน error
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\|\|\s*(?:null|undefined)\b/, name: '|| null/undefined fallback', severity: 'ERROR' },
            { regex: /\|\|\s*\[\]/, name: '|| empty array fallback', severity: 'ERROR' },
            { regex: /\|\|\s*\{\}/, name: '|| empty object fallback', severity: 'ERROR' },
            { regex: /\|\|\s*(?:false|0)\b/, name: '|| false/0 fallback', severity: 'ERROR' },
            { regex: /\|\|\s*['"](?:[^'"]*)?['"]/, name: '|| empty/default string fallback', severity: 'ERROR' },
            { regex: /\|\|\s*\w+Default\w*/, name: '|| defaultValue pattern', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ! ?? NULLISH COALESCING - จับ ?? ที่ซ่อนปัญหา
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\?\?\s*(?:null|undefined)\b/, name: '?? null/undefined coalescing', severity: 'ERROR' },
            { regex: /\?\?\s*\[\]/, name: '?? empty array coalescing', severity: 'ERROR' },
            { regex: /\?\?\s*\{\}/, name: '?? empty object coalescing', severity: 'ERROR' },
            { regex: /\?\?\s*['"](?:[^'"]*)?['"]/, name: '?? default string coalescing', severity: 'ERROR' },
            { regex: /\?\?\s*\w+Default\w*/, name: '?? defaultValue coalescing', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ! TERNARY OPERATOR HIDING ERRORS - จับ ternary ที่ซ่อน error
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\?\s*(?:null|undefined|\[\]|\{\})\s*:\s*\w+/, name: 'Ternary with silent null fallback', severity: 'WARNING' },
            { regex: /\w+\s*\?\s*\w+\s*:\s*(?:null|undefined|\[\]|\{\})/, name: 'Ternary with silent default', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ! OPTIONAL CHAINING HIDING UNDEFINED - จับ ?. ที่อาจซ่อนปัญหา
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\?\.\w+\s*\|\|/, name: 'Optional chaining with || fallback', severity: 'WARNING' },
            { regex: /\?\.\w+\s*\?\?/, name: 'Optional chaining with ?? fallback', severity: 'WARNING' },
            { regex: /\?\.\w+\([^)]*\)\s*\|\|/, name: 'Optional method call with || fallback', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ! PROMISE .catch() RETURNING DEFAULTS - จับ Promise catch ที่ไม่ log
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\.catch\s*\(\s*\(\s*\)\s*=>\s*(?:null|undefined|\[\]|\{\})\s*\)/, name: 'Promise.catch returning default without logging', severity: 'ERROR' },
            { regex: /\.catch\s*\(\s*\w+\s*=>\s*(?:null|undefined|\[\]|\{\})\s*\)/, name: 'Promise.catch silently swallowing error', severity: 'ERROR' },
            { regex: /\.catch\s*\(\s*\w+\s*=>\s*\{\s*return\s+(?:null|undefined|\[\]|\{\})\s*;\s*\}\s*\)/, name: 'Promise.catch block returning default', severity: 'ERROR' },
            { regex: /\.catch\s*\(\s*\(\s*\)\s*=>\s*\w+Default\w*\s*\)/, name: 'Promise.catch returning default value', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ! ASYNC/AWAIT WITHOUT TRY-CATCH - จับ async ที่ไม่มี error handling
            // ═══════════════════════════════════════════════════════════════════
            { regex: /async\s+function[^{]*\{(?:(?!try)(?!catch).)*await[\s\S]*?\}(?!\s*\.catch)/, name: 'async function with await but no try-catch', severity: 'ERROR' },
            { regex: /async\s*\([^)]*\)\s*=>\s*\{(?:(?!try)(?!catch).)*await/, name: 'async arrow function without try-catch', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // ! EMPTY CATCH BLOCKS - จับ catch ที่ว่างเปล่า (จะถูกเช็คใน checkCatchBlocks)
            // ═══════════════════════════════════════════════════════════════════
            { regex: /catch\s*\(\s*\w*\s*\)\s*\{\s*\}/, name: 'Empty catch block (worst practice)', severity: 'ERROR' },
            { regex: /catch\s*\(\s*\w+\s*\)\s*\{\s*return\s+(?:null|undefined|\[\]|\{\}|false|0|['"][^'"]*['"])\s*;?\s*\}/, name: 'Catch block only returning default', severity: 'ERROR' },
            { regex: /catch\s*\(\s*\w+\s*\)\s*\{\s*\/\//, name: 'Catch block with only comments', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // ! TRY-CATCH WITHOUT PROPER HANDLING - จับ try-catch ที่ไม่มี log/throw
            // ═══════════════════════════════════════════════════════════════════
            { regex: /catch\s*\(\s*\w+\s*\)\s*\{(?:(?!logger)(?!console\.error)(?!console\.warn)(?!throw).)*\}/, name: 'Catch block without logging or throwing', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // ! .then() WITHOUT .catch() - จับ Promise chain ที่ไม่มี catch
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\.then\s*\([^)]*\)(?:\s*\.then\s*\([^)]*\))*\s*;/, name: 'Promise.then() without .catch()', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ! DEFAULT PARAMETERS HIDING VALIDATION - จับ default param ที่อาจปัญหา
            // ═══════════════════════════════════════════════════════════════════
            { regex: /function\s+\w+\s*\([^)]*=\s*(?:\[\]|\{\}|null)[^)]*\)/, name: 'Default parameters may hide validation', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // ! SILENT ERROR VARIABLE NAMES - จับชื่อตัวแปรที่บอกว่า ignore error
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
// ! ======================================================================        
        severity: 'ERROR',
        mustInclude: ['throw', 'logger', 'console.error', 'log.error', 'console.warn'],
        checkCatchBlocks: true,
        violationExamples: {
            en: [
// ! ======================================================================                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @description Try-catch with silent return
                function riskyOperationWrapper() { try { riskyOperation(); } catch(e) { return null; } }`,
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @description Function call with silent fallback
                const data = fetchData() || [];`,
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @description Empty catch block
                try {} catch(error) { /* ignore errors */ }`,
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @description Promise with empty catch
                new Promise((res, rej) => rej()).catch(() => {});`,
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @description async function with await but no try-catch
                async function getData() { await Promise.resolve(1); }`

// ! ======================================================================
            ],
            th: [
// ! ======================================================================                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @matches-pattern Try-catch with silent return
                // @description กลืน error เงียบๆ
                try { riskyOperation(); } catch(e) { return null; }`,
                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @matches-pattern Function call with silent fallback
                // @description ซ่อนปัญหาด้วย ||
                const data = fetchData() || defaultData;`,
                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @matches-pattern Empty catch block
                // @description เพิกเฉยต่อ error
                catch(error) { /* ignore errors */ }`,
                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @matches-pattern Promise with empty catch
                // @description catch ว่างเปล่า
                promise.catch(() => {});`,
                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @matches-pattern Try-catch with default return
                // @description return default โดยไม่ log
                try { parse(json); } catch(e) { return {}; }`,
                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @matches-pattern Function call with silent fallback
                // @description ซ่อนการหาไม่เจอ
                const user = users.find(u => u.id === id) || guestUser;`,
                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @matches-pattern Catch with console.log() (use console.error)
                // @description log ผิดวิธี
                catch(err) { console.log("Error occurred"); return false; }`,
                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type violation
                // @matches-pattern async function with await but no try-catch
                // @description ไม่มี try-catch
                async function getData() { await apiCall(); }`
            ]
        },
// ! ======================================================================        
        correctExamples: {       
            en: [
// ! ======================================================================                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                try { riskyOperation(); } catch(e) { logger.error("Operation failed:", e); throw e; }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                const data = fetchData(); if (!data) { logger.error("Fetch failed"); throw new Error("No data"); }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                catch(error) { logger.error("Critical error:", error); throw error; }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                promise.catch(err => { logger.error("Promise rejected:", err); throw err; });`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                try { parse(json); } catch(e) { logger.error("JSON parse failed:", e); throw new Error("Invalid JSON"); }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                const user = users.find(u => u.id === id); if (!user) { logger.warn("User not found:", id); throw new NotFoundError(); }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                catch(err) { logger.error("Unexpected error:", err); throw err; }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                async function getData() { try { return await apiCall(); } catch(e) { logger.error("API call failed:", e); throw e; } }`
            ],
// ! ======================================================================            
            th: [
// ! ======================================================================                
                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                try { riskyOperation(); } catch(e) { logger.error("Operation failed:", e); throw e; }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                const data = fetchData(); if (!data) { logger.error("Fetch failed"); throw new Error("No data"); }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                catch(error) { logger.error("Critical error:", error); throw error; }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                promise.catch(err => { logger.error("Promise rejected:", err); throw err; });`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                try { parse(json); } catch(e) { logger.error("JSON parse failed:", e); throw new Error("Invalid JSON"); }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                const user = users.find(u => u.id === id); if (!user) { logger.warn("User not found:", id); throw new NotFoundError(); }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                catch(err) { logger.error("Unexpected error:", err); throw err; }`,

                `// @example-for-rule NO_SILENT_FALLBACKS
                // @type correct
                async function getData() { try { return await apiCall(); } catch(e) { logger.error("API call failed:", e); throw e; } }`
            ]
        },
        fix: {
            en: 'Add logger.error(error) before return, or throw error instead of returning default. NEVER silently swallow errors.',
            th: 'เพิ่ม logger.error(error) ก่อน return หรือ throw error แทนการ return ค่า default ห้ามกลืน error แบบเงียบๆ เด็ดขาด'
        }
    }
};
    // ! ======================================================================
    // ! END NO_SILENT_FALLBACKS RULE
    // ! ======================================================================

// ! ======================================================================
// ! MODULE EXPORTS - ส่งออกข้อมูลกฎเท่านั้น (เป็นหนังสือให้อ่าน)
// ! ======================================================================
export { ABSOLUTE_RULES };

