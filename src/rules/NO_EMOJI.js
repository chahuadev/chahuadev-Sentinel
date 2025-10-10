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
// ! NO_EMOJI - ห้ามใช้อิโมจิในโค้ด (กฎเหล็กข้อที่ 5)
// ! ======================================================================
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
        // ! ======================================================================
        // ! EXPLANATION - NO_EMOJI Rule
        // ! ======================================================================
        explanation: {
            en: `// ! ======================================================================
            // ! ABSOLUTE PHILOSOPHY: "CODE IS ENGINEERING DOCUMENTATION, NOT EMOTIONAL EXPRESSION"
            // ! ======================================================================
            
            Source Code is the ultimate precision communication medium. It must be readable and processable with 100% accuracy by humans and machines from all cultures, all operating systems, and all tools - both today and 20 years from now.

            Emoji destroys ALL of these qualities. It's AMBIGUOUS, inconsistently rendered, unsearchable, and platform-dependent. Using emoji in code is lowering engineering documentation to chat message level, which is unacceptable in professional environments.

            // ! ======================================================================
            // ! DEVASTATING DEVELOPER LOGIC AND THE REAL ANSWERS
            // ! ======================================================================

            FLAWED LOGIC: "But it makes logs or commits easier to read!"
            REAL ANSWER: It makes it easier to read for YOU on YOUR machine TODAY only. For automated tools (Log Parser, grep, git log --grep) or for developers using basic Terminal, it's unreadable garbage. Standardized clarity is more value than group-specific prettiness.

            FLAWED LOGIC: "It's just jokes in comments!"
            REAL ANSWER: Comments are part of technical documentation. They must provide clear, searchable information. Adding emoji adds Noise and reduces the professionalism of that codebase.

            // ! ======================================================================
            // ! GOLDEN RULE FOR VERIFICATION
            // ! ======================================================================
            "Can I grep this concept on a GUI-less server via PuTTY with basic fonts and be 100% confident I'll find every related point?"

            // ! ======================================================================
            // ! CONCLUSION WITHOUT EXCEPTIONS
            // ! ======================================================================
            Every character in your code should have technical purpose. Readability comes from clear naming and good structure, not visual decorations. International teams must collaborate without cultural/visual barriers.

            // ! ======================================================================
            // ! LEGACY PHILOSOPHY & DEEPER RATIONALE
            // ! ======================================================================
            Source Code is OFFICIAL TECHNICAL DOCUMENTATION designed for CLEAR, SEARCHABLE, and UNIVERSAL communication between humans and machines across all platforms. Emoji destroys ALL of these properties.

            Using emoji might seem harmless, but it creates fundamental problems with Encoding, Searchability, Accessibility, and Portability that are completely unacceptable for professional software production.

            // ! ======================================================================
            // ! HIDDEN DANGERS
            // ! ======================================================================
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

            // ! ======================================================================
            // ! LITMUS TEST
            // ! ======================================================================
            Ask yourself: "Can I copy this code section into the oldest text editor on a Linux server via SSH and still understand its meaning and search for it 100%?"
            - If answer is "NO": You may be violating NO_EMOJI
            - If answer is "YES": You're doing it right

            // ! ======================================================================
            // ! THE ABSOLUTE SOLUTION
            // ! ======================================================================
            Use Text-based Descriptions that are industry standard:

            // ! ======================================================================
            // ! In Comments
            // ! ======================================================================
            Use clear prefixes like // TODO:, // FIXME:, // NOTE:, // PERF:, // SECURITY:
            
            // ! ======================================================================
            // ! In Log Messages
            // ! ======================================================================
            Use structured prefixes or structured data:
            logger.info('[DEPLOY] Deployment started.');
            logger.info({ event: 'deploy_start', message: 'Deployment started.' });
            // ! ======================================================================
            // ! In Status Variables
            // ! ======================================================================
            Use strings that are immediately understandable:
            const status = 'SUCCESS'; // instead of checkmark emoji
            const buildState = 'FAILED'; // instead of X emoji 
            const priority = 'HIGH'; // instead of fire emoji
            const type = 'BUG'; // instead of bug emoji
            const note = 'TODO'; // instead of memo emoji
            
            // ! ======================================================================
            // ! In Error Messages
            // ! ======================================================================
            Use clear text:
            throw new Error('CRITICAL: Database connection failed'); // instead of explosion emoji + text

            // ! ======================================================================
            // ! COMPREHENSIVE COVERAGE
            // ! ======================================================================
            This validator detects ALL forms of emoji including direct Unicode characters, ZWJ sequences, skin tone modifiers, regional indicators, variation selectors, HTML entities, tag characters, and all Unicode 15.1+ emoji blocks.

            // ! ======================================================================
            // ! ZERO TOLERANCE
            // ! ======================================================================
            No emoji, Unicode symbols, pictographs, or non-standard characters allowed in source code, comments, strings, variable names, or any part of the codebase.`,
            th: `// ! ======================================================================
            // ! ปรัชญาที่เด็ดขาด: "โค้ดคือเอกสารทางวิศวกรรม ไม่ใช่การแสดงออกทางอารมณ์"
            // ! ======================================================================
            
            Source Code คือสื่อกลางการสื่อสารที่ต้องมีความแม่นยำสูงสุด มันต้องถูกอ่านและประมวลผลได้ถูกต้อง 100% โดยมนุษย์และเครื่องจักรจากทุกวัฒนธรรม, ทุกระบบปฏิบัติการ, และทุกเครื่องมือ ทั้งในปัจจุบันและอีก 20 ปีข้างหน้า

            Emoji ทำลายคุณสมบัติทั้งหมดนี้ มันคืออักขระที่ กำกวม, แสดงผลไม่แน่นอน, ค้นหาไม่ได้, และขึ้นอยู่กับแพลตฟอร์ม การใช้อิโมจิในโค้ดคือการลดระดับเอกสารทางวิศวกรรมให้กลายเป็นข้อความในแชท ซึ่งเป็นสิ่งที่ยอมรับไม่ได้ในสภาพแวดล้อมที่เป็นมืออาชีพ

            // ! ======================================================================
                 ตรรกะวิบัติของนักพัฒนาและคำตอบที่แท้จริง:
            // ! ======================================================================

            ตรรกะวิบัติ: "แต่มันทำให้ Log หรือ Commit อ่านง่ายขึ้น!"
            คำตอบที่แท้จริง: มันทำให้อ่านง่ายขึ้นสำหรับ คุณ บน เครื่องของคุณ ใน วันนี้ เท่านั้น สำหรับเครื่องมืออัตโนมัติ (Log Parser, grep, git log --grep) หรือสำหรับนักพัฒนาที่ใช้ Terminal แบบ Basic มันคือขยะที่อ่านไม่ออก ความชัดเจนที่เป็นมาตรฐาน มีค่ามากกว่าความสวยงามเฉพาะกลุ่ม

            ตรรกะวิบัติ: "มันเป็นแค่มุกตลกในคอมเมนต์!"
            คำตอบที่แท้จริง: คอมเมนต์คือส่วนหนึ่งของเอกสารทางเทคนิค มันต้องให้ข้อมูลที่ชัดเจนและค้นหาได้ การใส่อิโมจิเข้าไปเป็นการเพิ่ม Noise และลดทอนความเป็นมืออาชีพของโค้ดเบสนั้นๆ

            // ! ======================================================================
            // ! กฎทองสำหรับตรวจสอบ
            // ! ======================================================================
            "ฉันสามารถ grep คอนเซ็ปต์นี้บน Server ที่ไม่มี GUI ผ่าน PuTTY ด้วยฟอนต์พื้นฐาน แล้วมั่นใจได้ 100% ว่าจะเจอทุกจุดที่เกี่ยวข้องหรือไม่?"

            // ! ======================================================================
            // ! บทสรุปที่ไม่มีข้อยกเว้น
            // ! ======================================================================
            ทุกตัวอักษรในโค้ดของคุณควรมี technical purpose Readability มาจาก clear naming และ good structure ไม่ใช่ visual decorations International teams ต้อง collaborate ได้โดยไม่ติด cultural/visual barriers

            // ! ======================================================================
            // ! ปรัชญาและเหตุผลเชิงลึกดั้งเดิม
            // ! ======================================================================
            Source Code คือ เอกสารทางเทคนิคที่เป็นทางการ ที่ออกแบบมาเพื่อการสื่อสาร ที่ชัดเจน ค้นหาได้ และเป็นสากล ระหว่างมนุษย์และเครื่องจักรบนทุกแพลตฟอร์ม Emoji ทำลายคุณสมบัติทั้งหมดนี้

            การใช้อิโมจิดูเหมือนไม่เป็นอันตราย แต่มันสร้างปัญหาพื้นฐานด้าน Encoding, Searchability, Accessibility และ Portability ที่ยอมรับไม่ได้สำหรับการผลิตซอฟต์แวร์มืออาชีพ

            // ! ======================================================================
            // ! อันตรายที่ซ่อนอยู่
            // ! ======================================================================
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

            // ! ======================================================================
            // ! วิธีทดสอบความคิด (Litmus Test)
            // ! ======================================================================
            ถามตัวเอง: "ฉันสามารถ copy โค้ดส่วนนี้ไปวางใน text editor ที่เก่าที่สุดบน Linux server ผ่าน SSH และยังเข้าใจความหมายและค้นหาได้ 100% หรือไม่?"
            - ถ้าตอบ "ไม่": คุณอาจละเมิด NO_EMOJI
            - ถ้าตอบ "ใช่": คุณทำถูกต้อง

            // ! ======================================================================
            // ! วิธีแก้ไขสมบูรณ์
            // ! ======================================================================
            ใช้คำอธิบายแบบข้อความที่เป็นมาตรฐานอุตสาหกรรม:

            // ! ======================================================================
            // ! ใน Comment
            // ! ======================================================================
            ใช้ prefix ที่ชัดเจน เช่น // TODO:, // FIXME:, // NOTE:, // PERF:, // SECURITY:

            // ! ======================================================================
                 ใน Log Message:
            // ! ======================================================================
            ใช้ structured prefix หรือ structured data:
            logger.info('[DEPLOY] Deployment started.');
            logger.info({ event: 'deploy_start', message: 'Deployment started.' });

            // ! ======================================================================
                 ในตัวแปร Status:
            // ! ======================================================================
            ใช้ string ที่เข้าใจได้ทันที:
            const status = 'SUCCESS'; // แทนการใช้ checkmark emoji
            const buildState = 'FAILED'; // แทนการใช้ X emoji
            const priority = 'HIGH'; // แทนการใช้ fire emoji
            const type = 'BUG'; // แทนการใช้ bug emoji
            const note = 'TODO'; // แทนการใช้ memo emoji

            // ! ======================================================================
                 ใน Error Message:
            // ! ======================================================================
            ใช้ข้อความชัดเจน:
            throw new Error('CRITICAL: Database connection failed'); // แทนการใช้ explosion emoji + text

            // ! ======================================================================
                 ครอบคลุมทั่วถึง:
            // ! ======================================================================
            Validator นี้ตรวจจับอิโมจิทุกรูปแบบ รวมถึง Unicode character ตรงๆ, ZWJ sequence, skin tone modifier, regional indicator, variation selector, HTML entity, tag character และ Unicode 15.1+ emoji block ทั้งหมด

            ไม่ยอมรับข้อยกเว้น: ไม่มีอิโมจิ Unicode symbol pictograph หรือ non-standard character ใน source code comment string variable name หรือส่วนใดๆ ของ codebase

            // ! ======================================================================
            // ! LOOPHOLE CLOSURE - การปิดช่องโหว่ทุกรูปแบบ
            // ! ======================================================================

            เหตุผลที่คนอยากใช้ emoji และการปิดช่องโหว่:

            1. "OMG BUT IT'S JUST FOR FUN AND TEAM MORALE!"
                ไม่ยอมรับ! Fun ไม่ใช่เหตุผลที่ดีในการทำลาย professional code standards
                แก้ถูก: Team morale ผ่าน proper documentation, meaningful code review และ knowledge sharing
                เพราะอะไร: Code คือ professional artifact ที่ต้อง maintainable โดย developers ทั่วโลก

            2. "DUDE! IT'S JUST IN COMMENTS, NOT IN ACTUAL CODE!"
                ไม่ยอมรับ! Comments เป็นส่วนหนึ่งของ codebase และต้อง searchable และ parseable
                แก้ถูก: Structured comments พร้อม proper prefixes (// TODO:, // FIXME:, // NOTE:)
                เพราะอะไร: Emoji ใน comments ทำลาย text search, code indexing และ documentation generation

            3. "BRO, IT'S JUST FOR COMMIT MESSAGES!"
                ไม่ยอมรับ! Commit messages ต้อง machine-readable และ professional
                แก้ถูก: Conventional Commit format พร้อม clear type และ scope (feat:, fix:, docs:)
                เพราะอะไร: Git log parsing, changelog generation และ CI/CD automation ต้องการ structured format

            4. "OMG BUT IT'S JUST FOR STATUS INDICATORS!"
                ไม่ยอมรับ! Status indicators ต้องใช้ standard text ที่ universally understood
                แก้ถูก: Enum values (SUCCESS/FAILED/PENDING) หรือ standard status codes
                เพราะอะไร: Status indicators ต้อง machine-readable และ locale-independent

            5. "DUDE! IT'S JUST FOR PRIORITY LEVELS!"
                ไม่ยอมรับ! Priority levels ต้องใช้ standardized priority systems
                แก้ถูก: Priority enum (LOW/MEDIUM/HIGH/CRITICAL) หรือ numeric levels (P0-P4)
                เพราะอะไร: Priority systems ต้อง sortable และ integrate กับ issue tracking systems

            6. "BRO, IT'S JUST FOR USER-FACING STRINGS!"
                ไม่ยอมรับ! User-facing content ต้อง properly internationalized
                แก้ถูก: i18n framework พร้อม proper Unicode handling และ locale-specific rendering
                เพราะอะไร: Hardcoded emoji ไม่ support accessibility, screen readers และ cultural differences

            7. "OMG BUT IT'S JUST FOR TEST DATA/FIXTURES!"
                ไม่ยอมรับ! Test data ต้อง predictable และ focused บน business logic ไม่ใช่ visual elements
                แก้ถูก: Meaningful test data ที่ reflect real-world scenarios
                เพราะอะไร: Emoji ใน test data distract จาก actual test logic และ make debugging harder

            8. "DUDE! IT'S JUST FOR ERROR MESSAGES TO MAKE THEM FRIENDLY!"
                ไม่ยอมรับ! Error messages ต้อง structured และ actionable ไม่ใช่ "friendly"
                แก้ถูก: Clear error codes พร้อม actionable messages และ proper error categorization
                เพราะอะไร: Error handling systems ต้อง parseable และ alerting systems ต้องการ structured data

            9. "BRO, IT'S JUST FOR LOG LEVEL INDICATORS!"
                ไม่ยอมรับ! Log levels ต้อง standard และ machine-parseable
                แก้ถูก: Standard log levels (DEBUG/INFO/WARN/ERROR/FATAL) พร้อม structured logging
                เพราะอะไร: Log aggregation systems และ monitoring tools ต้องการ standardized log formats

            10. "OMG BUT IT'S PART OF THE BUSINESS DOMAIN (SOCIAL MEDIA APP)!"
                 ไม่ยอมรับ! Business domain emoji ต้องเก็บใน database หรือ user content ไม่ใช่ source code
                 แก้ถูก: Emoji handling library พร้อม proper Unicode normalization และ database storage
                 เพราะอะไร: Business logic ต้องแยกจาก presentation layer และ support emoji evolution

            11. "DUDE! IT'S JUST FOR FEATURE FLAGS OR CONFIGURATION!"
                 ไม่ยอมรับ! Configuration values ต้อง machine-readable และ deployment-safe
                 แก้ถูก: Boolean/string configuration values พร้อม proper validation
                 เพราะอะไร: Configuration parsing ต้อง robust และ environment-independent

            12. "BRO, OTHER POPULAR PROJECTS USE EMOJI IN CODE!"
                 ไม่ยอมรับ! Popularity ไม่ใช่ technical merit - enterprise code ต้อง stricter standards
                 แก้ถูก: Follow established enterprise coding standards และ industry best practices
                 เพราะอะไร: Enterprise software ต้อง maintainable โดย global teams พร้อม different tooling และ environments

            // ! ======================================================================
            // ! PROFESSIONAL PRINCIPLE
            // ! ======================================================================
            Source code คือ TECHNICAL SPECIFICATION ไม่ใช่ creative expression
            - ทุก character ใน source code ต้องมี technical purpose
            - Readability มาจาก clear naming และ good structure ไม่ใช่ visual decorations
            - International teams ต้อง collaborate ได้โดยไม่ติด cultural/visual barriers

            // ! ======================================================================
            // ! GOLDEN RULE สำหรับตรวจสอบ
            // ! ======================================================================
            ถ้า character นี้ถูก copy/paste ไ terminal ที่ไม่ support Unicode properly แล้วกลายเป็น garbled text
            = ห้ามใช้ใน professional codebase

            ไม่มี "แต่มันดูน่ารัก" หรือ "ทำให้ code สนุก" - CODE IS BUSINESS DOCUMENTATION
            ZERO EMOJI - PROFESSIONAL CODE ONLY

            // ! ======================================================================
            // ! การปิดช่องโหว่ทุกรูปแบบ - LOOPHOLE CLOSURE (เวอร์ชันภาษาไทย)
            // ! ======================================================================

            เหตุผลที่คนอยากใช้ emoji และการปิดช่องโหว่:

            1. "เฮ้ย! แต่มันแค่เพื่อความสนุกและสร้างขวัญทีม!"
                ไม่ยอมรับ! ความสนุกไม่ใช่เหตุผลที่ดีในการทำลาย professional code standards
                แก้ถูก: Team morale ผ่าน proper documentation, meaningful code review และ knowledge sharing
                เพราะอะไร: Code คือ professional artifact ที่ต้อง maintainable โดย developers ทั่วโลก

            2. "อะ! แต่มันแค่ใน comments ไม่ใช่โค้ดจริงนะ!"
                ไม่ยอมรับ! Comments เป็นส่วนหนึ่งของ codebase และต้อง searchable และ parseable
                แก้ถูก: Structured comments พร้อม proper prefixes (// TODO:, // FIXME:, // NOTE:)
                เพราะอะไร: Emoji ใน comments ทำลาย text search, code indexing และ documentation generation

            3. "เฮ้ย! แต่มันแค่ commit messages!"
                ไม่ยอมรับ! Commit messages ต้อง machine-readable และ professional
                แก้ถูก: Conventional Commit format พร้อม clear type และ scope (feat:, fix:, docs:)
                เพราะอะไร: Git log parsing, changelog generation และ CI/CD automation ต้องการ structured format

            4. "อะ! แต่มันแค่ status indicators!"
                ไม่ยอมรับ! Status indicators ต้องใช้ standard text ที่ universally understood
                แก้ถูก: Enum values (SUCCESS/FAILED/PENDING) หรือ standard status codes
                เพราะอะไร: Status indicators ต้อง machine-readable และ locale-independent

            5. "เฮ้ย! แต่มันแค่ priority levels!"
                ไม่ยอมรับ! Priority levels ต้องใช้ standardized priority systems
                แก้ถูก: Priority enum (LOW/MEDIUM/HIGH/CRITICAL) หรือ numeric levels (P0-P4)
                เพราะอะไร: Priority systems ต้อง sortable และ integrate กับ issue tracking systems

            6. "อะ! แต่มันแค่ user-facing strings!"
                ไม่ยอมรับ! User-facing content ต้อง properly internationalized
                แก้ถูก: i18n framework พร้อม proper Unicode handling และ locale-specific rendering
                เพราะอะไร: Hardcoded emoji ไม่ support accessibility, screen readers และ cultural differences

            7. "เฮ้ย! แต่มันแค่ test data/fixtures!"
                ไม่ยอมรับ! Test data ต้อง predictable และ focused บน business logic ไม่ใช่ visual elements
                แก้ถูก: Meaningful test data ที่ reflect real-world scenarios
                เพราะอะไร: Emoji ใน test data distract จาก actual test logic และ make debugging harder

            8. "อะ! แต่มันแค่ error messages เพื่อให้เป็นมิตร!"
                ไม่ยอมรับ! Error messages ต้อง structured และ actionable ไม่ใช่ "เป็นมิตร"
                แก้ถูก: Clear error codes พร้อม actionable messages และ proper error categorization
                เพราะอะไร: Error handling systems ต้อง parseable และ alerting systems ต้องการ structured data

            9. "เฮ้ย! แต่มันแค่ log level indicators!"
                ไม่ยอมรับ! Log levels ต้อง standard และ machine-parseable
                แก้ถูก: Standard log levels (DEBUG/INFO/WARN/ERROR/FATAL) พร้อม structured logging
                เพราะอะไร: Log aggregation systems และ monitoring tools ต้องการ standardized log formats

            10. "อะ! แต่มันเป็นส่วนหนึ่งของ business domain (social media app)!"
                 ไม่ยอมรับ! Business domain emoji ต้องเก็บใน database หรือ user content ไม่ใช่ source code
                 แก้ถูก: Emoji handling library พร้อม proper Unicode normalization และ database storage
                 เพราะอะไร: Business logic ต้องแยกจาก presentation layer และ support emoji evolution

            11. "เฮ้ย! แต่มันแค่ feature flags หรือ configuration!"
                 ไม่ยอมรับ! Configuration values ต้อง machine-readable และ deployment-safe
                 แก้ถูก: Boolean/string configuration values พร้อม proper validation
                 เพราะอะไร: Configuration parsing ต้อง robust และ environment-independent

            12. "อะ! แต่โปรเจ็กต์ดังๆ ก็ใช้ emoji ในโค้ด!"
                 ไม่ยอมรับ! Popularity ไม่ใช่ technical merit - enterprise code ต้อง stricter standards
                 แก้ถูก: Follow established enterprise coding standards และ industry best practices
                 เพราะอะไร: Enterprise software ต้อง maintainable โดย global teams พร้อม different tooling และ environments

            // ! ======================================================================
            // ! หลักการมืออาชีพ (ภาษาไทย)
            // ! ======================================================================
            Source code คือ TECHNICAL SPECIFICATION ไม่ใช่ creative expression
            - ทุก character ใน source code ต้องมี technical purpose
            - Readability มาจาก clear naming และ good structure ไม่ใช่ visual decorations
            - International teams ต้อง collaborate ได้โดยไม่ติด cultural/visual barriers

            // ! ======================================================================
            // ! กฎทองสำหรับตรวจสอบ (ภาษาไทย)
            // ! ======================================================================
            ถ้า character นี้ถูก copy/paste ไป terminal ที่ไม่ support Unicode properly แล้วกลายเป็น garbled text
            = ห้ามใช้ใน professional codebase

            ไม่มี "แต่มันดูน่ารัก" หรือ "ทำให้ code สนุก" - CODE คือ BUSINESS DOCUMENTATION
            ห้าม EMOJI - PROFESSIONAL CODE เท่านั้น`

        },
// ! ======================================================================        
        patterns: [
// ! ======================================================================            
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
// ! ======================================================================
// ! violationExamples - ตัวอย่างการละเมิดกฎ NO_EMOJI
// ! ======================================================================
        violationExamples: {
            // ! ======================================================================
            // ! English violation examples
            // ! ------------------------------------------------------------------
            // ! ENGLISH VIOLATION EXAMPLES
            // ! ------------------------------------------------------------------
            en: [
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Check mark button (U+2705) - commonly misused
                // @description Unicode checkmark in string
                // @note CHANGED: เปลี่ยนจาก comment เป็น string literal เพราะ AST ไม่จับ comments
                // @original-code //  Task completed successfully
                const status = " Task completed successfully";`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Cross mark (U+274C) - commonly misused
                // @description Unicode symbols in string
                const status = isComplete ? "" : "";`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Rocket (U+1F680) - unprofessional
                // @description Unicode rocket in message
                console.log(" Deployment started!");`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Bug (U+1F41B) - use "BUG" or "FIXME"
                // @description Unicode bug in error message
                throw new Error(" Critical bug found");`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Memo (U+1F4DD) - use "NOTE" or "TODO"
                // @description Unicode memo in string
                // @note CHANGED: เปลี่ยนจาก comment เป็น string literal เพราะ AST ไม่จับ comments
                // @original-code //  TODO: Implement feature
                const note = " TODO: Implement feature";`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Warning sign (U+26A0) - use "WARNING"
                // @description Unicode warning sign
                logger.warn("\u26A0\uFE0F Memory usage high");`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Party popper (U+1F389) - unprofessional
                // @description Unicode party popper in result
                const result = { success: true, message: "\u{1F389} Done!" };`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Fire (U+1F525) - unprofessional slang
                // @description Unicode fire in string
                // @note CHANGED: เปลี่ยนจาก block comment เป็น string literal เพราะ AST ไม่จับ comments
                // @original-code function calculate() with fire emoji in comment
                const msg = " Hot path optimization";`
            ],
// ! ======================================================================
// ! Thai violation examples 
// ! ======================================================================
            // ! ------------------------------------------------------------------
            // ! THAI VIOLATION EXAMPLES
            // ! ------------------------------------------------------------------
            th: [
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Check mark button (U+2705) - commonly misused
                // @description Unicode checkmark ในคอมเมนต์
                // \u2705 งานเสร็จสมบูรณ์`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Cross mark (U+274C) - commonly misused
                // @description Unicode symbols ในสตริง
                const status = isComplete ? "\u2713" : "\u274C";`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Rocket (U+1F680) - unprofessional
                // @description Unicode rocket ในข้อความ
                console.log("\u{1F680} Deployment started!");`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Bug (U+1F41B) - use "BUG" or "FIXME"
                // @description Unicode bug ใน error message
                throw new Error("\u{1F41B} Critical bug found");`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Memo (U+1F4DD) - use "NOTE" or "TODO"
                // @description Unicode memo ใน TODO
                // \u{1F4DD} TODO: Implement feature`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Warning sign (U+26A0) - use "WARNING"
                // @description Unicode warning sign
                logger.warn("\u26A0\uFE0F Memory usage high");`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Party popper (U+1F389) - unprofessional
                // @description Unicode party popper ในผลลัพธ์
                const result = { success: true, message: "\u{1F389} Done!" };`,
                
                `// @example-for-rule NO_EMOJI
                // @type violation
                // @matches-pattern Fire (U+1F525) - unprofessional slang
                // @description Unicode fire ในคอมเมนต์
                function calculate() { /* \u{1F525} Hot path optimization */ }`
            ]
        },
// ! ======================================================================
// ! correctExamples - ตัวอย่างที่ถูกต้องสำหรับ NO_EMOJI
// ! ======================================================================
        // ! ------------------------------------------------------------------
        // ! CORRECT EXAMPLES
        // ! ------------------------------------------------------------------
        correctExamples: {
            // ! ------------------------------------------------------------------
            // ! ENGLISH CORRECT EXAMPLES
            // ! ------------------------------------------------------------------
            en: [
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern descriptive text instead of checkmark
                // @description Use clear text instead of emoji
                // SUCCESS: Task completed successfully`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern clear status words
                // @description Use PASS/FAIL instead of symbols
                const status = isComplete ? "PASS" : "FAIL";`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern DEPLOY prefix
                // @description Use DEPLOY instead of rocket emoji
                console.log("DEPLOY: Deployment started!");`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern BUG prefix
                // @description Use BUG instead of bug emoji
                throw new Error("BUG: Critical bug found");`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern standard TODO
                // @description Standard TODO without emoji
                // TODO: Implement feature`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern WARNING prefix
                // @description Use WARNING text instead of warning emoji
                logger.warn("WARNING: Memory usage high");`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern COMPLETED message
                // @description Use COMPLETED instead of party emoji
                const result = { success: true, message: "COMPLETED!" };`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern PERFORMANCE comment
                // @description Use PERFORMANCE instead of fire emoji
                function calculate() { /* PERFORMANCE: Hot path optimization */ }`
            ],
            // ! ------------------------------------------------------------------
            // ! THAI CORRECT EXAMPLES
            // ! ------------------------------------------------------------------
            th: [
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern descriptive text instead of checkmark
                // @description ใช้คำแทนอิโมจิ
                // SUCCESS: งานเสร็จสมบูรณ์`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern clear status words
                // @description ใช้คำอังกฤษชัดเจน
                const status = isComplete ? "PASS" : "FAIL";`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern DEPLOY prefix
                // @description ใช้คำ DEPLOY แทนจรวด
                console.log("DEPLOY: Deployment started!");`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern BUG prefix
                // @description ใช้คำ BUG แทนแมลง
                throw new Error("BUG: Critical bug found");`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern standard TODO
                // @description TODO แบบปกติ
                // TODO: Implement feature`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern WARNING prefix
                // @description ใช้คำ WARNING
                logger.warn("WARNING: Memory usage high");`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern COMPLETED message
                // @description ใช้คำ COMPLETED
                const result = { success: true, message: "COMPLETED!" };`,
                
                `// @example-for-rule NO_EMOJI
                // @type correct
                // @matches-pattern PERFORMANCE comment
                // @description ใช้คำ PERFORMANCE
                function calculate() { /* PERFORMANCE: Hot path optimization */ }`
            ]
        },
        // ! ------------------------------------------------------------------
        // ! FIX SUGGESTIONS
        // ! ------------------------------------------------------------------
        fix: {
            en: 'Replace emoji with descriptive text. Examples: U+2705 checkmark -> "SUCCESS", U+274C cross -> "FAILED", U+1F680 rocket -> "DEPLOY", U+1F41B bug -> "BUG", U+1F4DD memo -> "NOTE", U+26A0 warning -> "WARNING"',
            th: 'แทนที่อิโมจิด้วยข้อความอธิบาย ตัวอย่าง: U+2705 เครื่องหมายถูก -> "SUCCESS", U+274C กากบาท -> "FAILED", U+1F680 จรวด -> "DEPLOY", U+1F41B แมลง -> "BUG", U+1F4DD บันทึก -> "NOTE", U+26A0 คำเตือน -> "WARNING"'
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