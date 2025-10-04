// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Rules Validator - Core validation logic with MAXIMUM DETAIL
// ======================================================================

const vscode = require('vscode');
const path = require('path');

/**
 * ABSOLUTE RULES CONFIGURATION
 * กฎเหล็กทั้ง 4 ข้อ พร้อมรายละเอียดครบถ้วน
 */
const ABSOLUTE_RULES = {
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
            en: `Mocking creates tight coupling between tests and implementation details. It makes refactoring difficult and leads to brittle tests. Use Dependency Injection to pass real or test implementations through function parameters.`,
            th: `การใช้ Mock ทำให้เกิด tight coupling ระหว่าง test และรายละเอียดการทำงาน ทำให้ refactor ยาก และ test เปราะบาง ให้ใช้ Dependency Injection โดยส่ง implementation ที่แท้จริงหรือเพื่อ test ผ่าน parameter แทน`
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
            { regex: /\.returns\s*\(/, name: '.returns() (sinon)', severity: 'WARNING' },
            { regex: /\.resolves\s*\(/, name: '.resolves() (sinon)', severity: 'WARNING' },
            { regex: /\.rejects\s*\(/, name: '.rejects() (sinon)', severity: 'WARNING' },
            { regex: /\.callsFake\s*\(/, name: '.callsFake() (sinon)', severity: 'ERROR' },
            { regex: /\.yields\s*\(/, name: '.yields() (sinon)', severity: 'ERROR' },

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
            {
                regex: /AKIA[0-9A-Z]{16}/,
                name: 'AWS Access Key ID',
                severity: 'ERROR'
            },
            {
                regex: /['"][0-9a-zA-Z/+=]{40}['"]/,
                name: 'AWS Secret Access Key format',
                severity: 'WARNING'
            },

            // Long tokens and hashes
            {
                regex: /['"][a-zA-Z0-9]{32,}['"]/,
                name: 'Long alphanumeric string (32+ chars, possible token)',
                severity: 'WARNING'
            },
            {
                regex: /['"][a-f0-9]{40,}['"]/,
                name: 'Long hex string (possible hash/token)',
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
        fix: {
            en: 'Move to config file or environment variable: process.env.API_URL or import from config.js',
            th: 'ย้ายไปไฟล์ config หรือ environment variable: process.env.API_URL หรือ import จาก config.js'
        }
    },

    NO_SILENT_FALLBACK: {
        id: 'NO_SILENT_FALLBACK',
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
        fix: {
            en: 'Add logger.error(error) before return, or throw error instead of returning default. NEVER silently swallow errors.',
            th: 'เพิ่ม logger.error(error) ก่อน return หรือ throw error แทนการ return ค่า default ห้ามกลืน error แบบเงียบๆ เด็ดขาด'
        }
    },

    NO_INTERNAL_CACHE: {
        id: 'NO_INTERNAL_CACHE',
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
            // CACHE VARIABLE DECLARATIONS - จับการประกาศตัวแปร cache ทุกรูปแบบ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /(?:const|let|var)\s+cache\s*=/, name: 'cache variable declaration', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+\w*[Cc]ache\w*\s*=/, name: 'variable with "cache" in name', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+\w*[Mm]emo(?:ized?)?\w*\s*=/, name: 'variable with "memo" in name', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+\w*[Ss]tored?\w*\s*=/, name: 'variable with "stored" in name', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+\w*[Cc]ached\w*\s*=/, name: 'variable with "cached" in name', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+_cache\s*=/, name: '_cache private variable', severity: 'WARNING' },
            { regex: /(?:const|let|var)\s+__cache\s*=/, name: '__cache double underscore', severity: 'WARNING' },

            // ═══════════════════════════════════════════════════════════════════
            // MAP/WEAKMAP/SET FOR CACHING - จับการใช้ Map/Set เป็น cache
            // ═══════════════════════════════════════════════════════════════════
            { regex: /new\s+Map\s*\(\s*\)(?=.*(?:cache|memo|store))/i, name: 'new Map() for caching', severity: 'WARNING' },
            { regex: /new\s+WeakMap\s*\(\s*\)/, name: 'new WeakMap() (usually for caching)', severity: 'WARNING' },
            { regex: /new\s+Set\s*\(\s*\)(?=.*(?:cache|memo|store))/i, name: 'new Set() for caching', severity: 'WARNING' },
            { regex: /new\s+WeakSet\s*\(\s*\)/, name: 'new WeakSet() (usually for caching)', severity: 'WARNING' },

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
            { regex: /if\s*\(\s*typeof\s+\w+\s*!==?\s*['"]undefined['"]\s*\)\s*return\s+\w+/, name: 'if (typeof cached !== undefined) return', severity: 'WARNING' },
            { regex: /if\s*\(\s*\w+\s*in\s+\w*[Cc]ache/, name: 'if (key in cache) pattern', severity: 'WARNING' },
            { regex: /hasOwnProperty\s*\(\s*['"].*[Cc]ache.*['"]\s*\)/, name: 'hasOwnProperty cache check', severity: 'WARNING' },
            
            // ADDITIONAL INTERNAL CACHE PATTERNS - EXTENDED COVERAGE
            
            // React hooks for caching
            { regex: /useMemo\s*\(\s*\(\s*\)\s*=>/, name: 'useMemo() - React internal memoization', severity: 'WARNING' },
            { regex: /useCallback\s*\(\s*\(\s*\)\s*=>/, name: 'useCallback() - React callback memoization', severity: 'WARNING' },
            { regex: /React\.memo\s*\(/, name: 'React.memo() - component memoization', severity: 'WARNING' },
            { regex: /React\.useMemo/, name: 'React.useMemo', severity: 'WARNING' },
            { regex: /React\.useCallback/, name: 'React.useCallback', severity: 'WARNING' },
            
            // Vue computed/watch (caching)
            { regex: /computed\s*:\s*\{/, name: 'Vue computed properties (caching)', severity: 'WARNING' },
            { regex: /computed\s*\(\s*\(\s*\)\s*=>/, name: 'Vue 3 computed() (caching)', severity: 'WARNING' },
            
            // Lodash/Underscore memoization
            { regex: /_.memoize\s*\(/, name: 'Lodash _.memoize()', severity: 'WARNING' },
            { regex: /lodash\.memoize/, name: 'lodash.memoize', severity: 'WARNING' },
            { regex: /import\s+.*\bmemoize\b.*from\s+['"]lodash/, name: 'import memoize from lodash', severity: 'WARNING' },
            
            // Ramda memoization
            { regex: /R\.memoizeWith\s*\(/, name: 'Ramda R.memoizeWith()', severity: 'WARNING' },
            { regex: /R\.memoize\s*\(/, name: 'Ramda R.memoize()', severity: 'WARNING' },
            
            // Memoizee library
            { regex: /import\s+.*from\s+['"]memoizee['"]/, name: 'import memoizee library', severity: 'WARNING' },
            { regex: /require\s*\(\s*['"]memoizee['"]\s*\)/, name: 'require memoizee', severity: 'WARNING' },
            
            // Fast-memoize library
            { regex: /import\s+.*from\s+['"]fast-memoize['"]/, name: 'import fast-memoize', severity: 'WARNING' },
            { regex: /require\s*\(\s*['"]fast-memoize['"]\s*\)/, name: 'require fast-memoize', severity: 'WARNING' },
            
            // Moize library
            { regex: /import\s+.*from\s+['"]moize['"]/, name: 'import moize library', severity: 'WARNING' },
            { regex: /moize\s*\(/, name: 'moize() memoization', severity: 'WARNING' },
            
            // Reselect (Redux memoization)
            { regex: /createSelector\s*\(/, name: 'createSelector() - Reselect memoization', severity: 'WARNING' },
            { regex: /import\s+.*createSelector.*from\s+['"]reselect['"]/, name: 'import Reselect library', severity: 'WARNING' },
            
            // Singleton pattern (often used for caching)
            { regex: /let\s+instance\s*=\s*null[\s\S]*?getInstance\s*\(/, name: 'Singleton pattern (often caches instance)', severity: 'WARNING' },
            { regex: /private\s+static\s+instance\s*:/, name: 'Singleton instance property', severity: 'WARNING' },
            
            // Module-level cache variables
            { regex: /^(?:const|let|var)\s+\w*[Cc]ache\w*\s*=/m, name: 'Module-level cache variable', severity: 'WARNING' },
            { regex: /^(?:const|let|var)\s+_\w*[Cc]ache\w*\s*=/m, name: 'Module-level private cache', severity: 'WARNING' },
            
            // Object property caching patterns
            { regex: /if\s*\(\s*!\s*this\._\w*\)\s*\{\s*this\._\w*\s*=/, name: 'Lazy initialization caching pattern', severity: 'WARNING' },
            { regex: /get\s+\w+\s*\(\s*\)\s*\{[^}]*if\s*\(\s*!?\s*this\._/, name: 'Getter with internal cache', severity: 'WARNING' },
            
            // IndexedDB/LocalStorage caching
            { regex: /localStorage\.getItem.*localStorage\.setItem/, name: 'localStorage caching pattern', severity: 'WARNING' },
            { regex: /sessionStorage\.getItem.*sessionStorage\.setItem/, name: 'sessionStorage caching pattern', severity: 'WARNING' },
            { regex: /indexedDB\.open/, name: 'IndexedDB (client-side caching)', severity: 'WARNING' },
            
            // Service Worker caching
            { regex: /caches\.open\s*\(/, name: 'Service Worker Cache API', severity: 'WARNING' },
            { regex: /cache\.put\s*\(/, name: 'Service Worker cache.put()', severity: 'WARNING' },
            { regex: /cache\.match\s*\(/, name: 'Service Worker cache.match()', severity: 'WARNING' },
            
            // Time-based caching
            { regex: /lastFetch|lastUpdate|lastCache/i, name: 'Time-based cache variable', severity: 'WARNING' },
            { regex: /cacheExpiry|cacheTimeout|cacheTTL/i, name: 'Cache TTL variable', severity: 'WARNING' },
            { regex: /if\s*\([^)]*Date\.now\(\)\s*-\s*\w*(?:Time|Timestamp)/, name: 'Time-based cache check', severity: 'WARNING' },
            
            // Request deduplication (form of caching)
            { regex: /pendingRequests|inFlightRequests/i, name: 'Request deduplication (caching)', severity: 'WARNING' },
            { regex: /if\s*\(\s*\w*Pending\w*\[/, name: 'Pending request check (deduplication)', severity: 'WARNING' },
            
            // Computed property caching
            { regex: /@computed\b/, name: '@computed decorator (MobX caching)', severity: 'WARNING' },
            { regex: /makeObservable.*computed/, name: 'MobX computed observable', severity: 'WARNING' },
            
            // Apollo/GraphQL client caching
            { regex: /InMemoryCache\s*\(/, name: 'Apollo InMemoryCache', severity: 'WARNING' },
            { regex: /cache-first|cache-only|cache-and-network/i, name: 'Apollo cache policy', severity: 'WARNING' },
            
            // SWR/React Query (data caching libraries)
            { regex: /useSWR\s*\(/, name: 'SWR hook (data caching)', severity: 'WARNING' },
            { regex: /useQuery\s*\(/, name: 'React Query useQuery (caching)', severity: 'WARNING' },
            { regex: /queryClient\.setQueryData/, name: 'React Query manual cache manipulation', severity: 'WARNING' },
        ],
        severity: 'WARNING',
        fix: {
            en: 'Remove internal cache. Let the caller handle caching externally with Redis, Memcached, or a caching decorator.',
            th: 'ลบ cache ภายใน ให้ผู้เรียกใช้จัดการ cache จากภายนอกด้วย Redis, Memcached หรือ caching decorator'
        }
    },

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
BAD:  const status = isComplete ? '\\u2705' : '\\u274C';  // checkmark and cross emoji
GOOD: const status = isComplete ? 'SUCCESS' : 'FAILED';

This validator catches ALL emoji forms including:
- Direct emoji characters (U+1F600 grinning face, U+1F680 rocket, U+2705 checkmark)
- ZWJ sequences (family emoji, profession emoji)
- Skin tone modifiers (U+1F3FB-U+1F3FF)
- Regional indicators (flag emoji like U+1F1F9 U+1F1ED for Thailand)
- Variation selectors (text vs emoji presentation)
- HTML entities (&#x1F600;, &#128512;)
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
- HTML entities (&#x1F600;, &#128512;)
- Tag characters และ modifiers
- ทุก Unicode 15.1+ emoji blocks`
        },
        patterns: [
            // ═══════════════════════════════════════════════════════════════════
            // CORE EMOJI RANGES (Unicode 15.1+) - จับอิโมจิหลักทุกตัว
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{1F600}-\u{1F64F}]/u, name: 'Emoticons (U+1F600-U+1F64F) - faces, gestures', severity: 'ERROR' },
            { regex: /[\u{1F300}-\u{1F5FF}]/u, name: 'Symbols & Pictographs (U+1F300-U+1F5FF) - weather, objects', severity: 'ERROR' },
            { regex: /[\u{1F680}-\u{1F6FF}]/u, name: 'Transport & Map (U+1F680-U+1F6FF) - vehicles, places', severity: 'ERROR' },
            { regex: /[\u{1F700}-\u{1F77F}]/u, name: 'Alchemical Symbols (U+1F700-U+1F77F) - ancient symbols', severity: 'ERROR' },
            { regex: /[\u{1F780}-\u{1F7FF}]/u, name: 'Geometric Shapes Extended (U+1F780-U+1F7FF)', severity: 'ERROR' },
            { regex: /[\u{1F800}-\u{1F8FF}]/u, name: 'Supplemental Arrows-C (U+1F800-U+1F8FF)', severity: 'ERROR' },
            { regex: /[\u{1F900}-\u{1F9FF}]/u, name: 'Supplemental Symbols (U+1F900-U+1F9FF) - modern emoji', severity: 'ERROR' },
            { regex: /[\u{1FA00}-\u{1FA6F}]/u, name: 'Chess & Playing Cards Symbols (U+1FA00-U+1FA6F)', severity: 'ERROR' },
            { regex: /[\u{1FA70}-\u{1FAFF}]/u, name: 'Symbols Extended-A (U+1FA70-U+1FAFF) - newest emoji', severity: 'ERROR' },
            { regex: /[\u{1FB00}-\u{1FBFF}]/u, name: 'Symbols Extended-B (U+1FB00-U+1FBFF) - Unicode 15+', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // EXTENDED SYMBOL RANGES - จับสัญลักษณ์พิเศษทั้งหมด
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{2600}-\u{26FF}]/u, name: 'Miscellaneous Symbols (U+2600-U+26FF) - sun, star, weather', severity: 'ERROR' },
            { regex: /[\u{2700}-\u{27BF}]/u, name: 'Dingbats (U+2700-U+27BF) - scissors, checkmarks, arrows', severity: 'ERROR' },
            { regex: /[\u{1F1E0}-\u{1F1FF}]/u, name: 'Regional Indicator (U+1F1E0-U+1F1FF) - flag letters', severity: 'ERROR' },
            { regex: /[\u{1F100}-\u{1F1FF}]/u, name: 'Enclosed Alphanumeric Supplement', severity: 'ERROR' },
            { regex: /[\u{2B00}-\u{2BFF}]/u, name: 'Miscellaneous Symbols and Arrows', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // MATHEMATICAL & TECHNICAL SYMBOLS - จับสัญลักษณ์ทางคณิตศาสตร์
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{2190}-\u{21FF}]/u, name: 'Arrows (U+2190-U+21FF) - directional symbols', severity: 'ERROR' },
            { regex: /[\u{2200}-\u{22FF}]/u, name: 'Mathematical Operators (U+2200-U+22FF)', severity: 'ERROR' },
            { regex: /[\u{2300}-\u{23FF}]/u, name: 'Miscellaneous Technical (U+2300-U+23FF)', severity: 'ERROR' },
            { regex: /[\u{2460}-\u{24FF}]/u, name: 'Enclosed Alphanumerics (U+2460-U+24FF)', severity: 'ERROR' },
            { regex: /[\u{25A0}-\u{25FF}]/u, name: 'Geometric Shapes (U+25A0-U+25FF)', severity: 'ERROR' },
            { regex: /[\u{2900}-\u{297F}]/u, name: 'Supplemental Arrows-A', severity: 'ERROR' },
            { regex: /[\u{2980}-\u{29FF}]/u, name: 'Miscellaneous Mathematical Symbols-A', severity: 'ERROR' },
            { regex: /[\u{2A00}-\u{2AFF}]/u, name: 'Supplemental Mathematical Operators', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // ASIAN & SPECIAL SYMBOLS - จับสัญลักษณ์เอเชียและพิเศษ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{3030}]/u, name: 'Wavy dash (U+3030) - Japanese symbol', severity: 'ERROR' },
            { regex: /[\u{303D}]/u, name: 'Part alternation mark (U+303D) - Japanese', severity: 'ERROR' },
            { regex: /[\u{3297}]/u, name: 'Japanese congratulations symbol (U+3297)', severity: 'ERROR' },
            { regex: /[\u{3299}]/u, name: 'Japanese secret symbol (U+3299)', severity: 'ERROR' },
            { regex: /[\u{1F004}]/u, name: 'Mahjong tile (U+1F004)', severity: 'ERROR' },
            { regex: /[\u{1F0CF}]/u, name: 'Playing card (U+1F0CF)', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // EMOJI MODIFIERS & COMPONENTS - จับส่วนประกอบอิโมจิ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{1F3FB}-\u{1F3FF}]/u, name: 'Skin tone modifiers (U+1F3FB-U+1F3FF) - light to dark', severity: 'ERROR' },
            { regex: /[\u{FE00}-\u{FE0F}]/u, name: 'Variation Selectors (U+FE00-U+FE0F) - emoji vs text', severity: 'ERROR' },
            { regex: /[\u{200D}]/u, name: 'Zero Width Joiner (U+200D ZWJ) - combines emoji', severity: 'ERROR' },
            { regex: /[\u{20E3}]/u, name: 'Combining Enclosing Keycap (U+20E3)', severity: 'ERROR' },
            { regex: /[\u{E0020}-\u{E007F}]/u, name: 'Tag characters (U+E0020-U+E007F) - for flag emoji', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // COMPLEX ZWJ SEQUENCES - จับอิโมจิซับซ้อนที่รวมกัน
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\u{1F468}\u{200D}\u{1F4BB}/u, name: 'Man technologist ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{1F4BC}/u, name: 'Woman office worker ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F680}/u, name: 'Man astronaut ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{1F680}/u, name: 'Woman astronaut ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F692}/u, name: 'Man firefighter ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F469}\u{200D}\u{1F692}/u, name: 'Woman firefighter ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}/u, name: 'Rainbow flag ZWJ sequence', severity: 'ERROR' },
            { regex: /\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}/u, name: 'Family ZWJ sequence', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // HEART VARIATIONS - จับหัวใจทุกสี (มักใช้ใน comment)
            // ═══════════════════════════════════════════════════════════════════
            { regex: /\u{2764}\u{FE0F}/u, name: 'Red heart with variation (U+2764 U+FE0F)', severity: 'ERROR' },
            { regex: /\u{2764}/u, name: 'Red heart (U+2764)', severity: 'ERROR' },
            { regex: /\u{1F49A}/u, name: 'Green heart (U+1F49A)', severity: 'ERROR' },
            { regex: /\u{1F499}/u, name: 'Blue heart (U+1F499)', severity: 'ERROR' },
            { regex: /\u{1F49B}/u, name: 'Yellow heart (U+1F49B)', severity: 'ERROR' },
            { regex: /\u{1F9E1}/u, name: 'Orange heart (U+1F9E1)', severity: 'ERROR' },
            { regex: /\u{1F49C}/u, name: 'Purple heart (U+1F49C)', severity: 'ERROR' },
            { regex: /\u{1F5A4}/u, name: 'Black heart (U+1F5A4)', severity: 'ERROR' },
            { regex: /\u{1F90D}/u, name: 'White heart (U+1F90D)', severity: 'ERROR' },
            { regex: /\u{1F90E}/u, name: 'Brown heart (U+1F90E)', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // HTML ENTITIES - จับอิโมจิในรูปแบบ HTML
            // ═══════════════════════════════════════════════════════════════════
            { regex: /&#x1F[0-9A-Fa-f]{3,4};/g, name: 'Hex HTML emoji entity (&#x1F600;)', severity: 'ERROR' },
            { regex: /&#1[0-9]{4,6};/g, name: 'Decimal HTML emoji entity (&#128512;)', severity: 'ERROR' },
            { regex: /&(?:hearts?|spades?|clubs?|diams?|star|check|cross|times);/gi, name: 'Named HTML symbol entities', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // CATCH-ALL COMPREHENSIVE PATTERNS - จับทุกอย่างที่เหลือ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u{1F000}-\u{1FFFF}]/u, name: 'Complete emoji plane (U+1F000-U+1FFFF)', severity: 'ERROR' },
            { regex: /[\u{2600}-\u{27FF}]/u, name: 'Extended symbol coverage (U+2600-U+27FF)', severity: 'ERROR' },

            // ═══════════════════════════════════════════════════════════════════
            // SPECIFIC COMMON EMOJI - จับอิโมจิที่ใช้บ่อยโดยเฉพาะ
            // ═══════════════════════════════════════════════════════════════════
            { regex: /[\u2705]/u, name: 'Check mark button (U+2705) - commonly misused', severity: 'ERROR' },
            { regex: /[\u274C]/u, name: 'Cross mark (U+274C) - commonly misused', severity: 'ERROR' },
            { regex: /[\u26A0][\uFE0F]?/u, name: 'Warning sign (U+26A0) - use "WARNING"', severity: 'ERROR' },
            { regex: /[\u{1F680}]/u, name: 'Rocket (U+1F680) - unprofessional', severity: 'ERROR' },
            { regex: /[\u{1F44D}\u{1F44E}]/u, name: 'Thumbs up/down (U+1F44D/U+1F44E)', severity: 'ERROR' },
            { regex: /[\u{1F525}]/u, name: 'Fire (U+1F525) - unprofessional slang', severity: 'ERROR' },
            { regex: /[\u{1F4AF}]/u, name: '100 points (U+1F4AF) - unprofessional', severity: 'ERROR' },
            { regex: /[\u{1F389}]/u, name: 'Party popper (U+1F389) - unprofessional', severity: 'ERROR' },
            { regex: /[\u2B50\u{1F31F}]/u, name: 'Star (U+2B50/U+1F31F)', severity: 'ERROR' },
            { regex: /[\u{1F4DD}]/u, name: 'Memo (U+1F4DD) - use "NOTE" or "TODO"', severity: 'ERROR' },
            { regex: /[\u{1F41B}]/u, name: 'Bug (U+1F41B) - use "BUG" or "FIXME"', severity: 'ERROR' },
            { regex: /[\u26A1]/u, name: 'Lightning (U+26A1) - use "FAST" or "PERF"', severity: 'ERROR' },
            { regex: /[\u{1F527}]/u, name: 'Wrench (U+1F527) - use "FIX" or "TOOL"', severity: 'ERROR' },
            { regex: /[\u{1F4E6}]/u, name: 'Package (U+1F4E6) - use "PACKAGE"', severity: 'ERROR' },
            { regex: /[\u{1F3AF}]/u, name: 'Direct hit (U+1F3AF) - use "TARGET"', severity: 'ERROR' },
        ],
        severity: 'ERROR',
        fix: {
            en: 'Replace emoji with descriptive text. Examples: U+2705 checkmark -> "SUCCESS", U+274C cross -> "FAILED", U+1F680 rocket -> "DEPLOY", U+1F41B bug -> "BUG", U+1F4DD memo -> "NOTE", U+26A0 warning -> "WARNING"',
            th: 'แทนที่อิโมจิด้วยข้อความอธิบาย ตัวอย่าง: U+2705 เครื่องหมายถูก -> "SUCCESS", U+274C กากบาท -> "FAILED", U+1F680 จรวด -> "DEPLOY", U+1F41B แมลง -> "BUG", U+1F4DD บันทึก -> "NOTE", U+26A0 คำเตือน -> "WARNING"'
        }
    }
};

/**
 * Rules Validator Class
 */
class RulesValidator {
    constructor(diagnosticCollection, outputChannel) {
        this.diagnosticCollection = diagnosticCollection;
        this.outputChannel = outputChannel;
        this.updateLanguage();
    }

    /**
     * Update language from config
     */
    updateLanguage() {
        const config = vscode.workspace.getConfiguration('chahuadev');
        this.language = config.get('language', 'th');
    }

    /**
     * Validate a document
     * @param {vscode.TextDocument} document
     * @returns {number} Number of violations found
     */
    validateDocument(document) {
        this.updateLanguage();

        // Check if validation is enabled
        const config = vscode.workspace.getConfiguration('chahuadev');
        if (!config.get('enabled', true)) {
            return 0;
        }

        // Check if file should be excluded
        if (this.shouldExclude(document.uri.fsPath)) {
            return 0;
        }

        // Check if language is supported
        if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(document.languageId)) {
            return 0;
        }

        const content = document.getText();
        const lines = content.split('\n');
        const violations = [];

        // Check each enabled rule
        for (const [ruleKey, rule] of Object.entries(ABSOLUTE_RULES)) {
            const ruleEnabled = config.get(`rules.${this.camelCase(ruleKey)}`, true);
            if (!ruleEnabled) {
                continue;
            }

            const ruleViolations = this.checkRule(rule, content, lines, document);
            violations.push(...ruleViolations);
        }

        // Convert violations to diagnostics
        const diagnostics = violations.map(v => this.violationToDiagnostic(v, document));
        this.diagnosticCollection.set(document.uri, diagnostics);

        // Log to output channel
        if (violations.length > 0) {
            this.logViolations(document, violations);
        }

        return violations.length;
    }

    /**
     * Check a specific rule
     */
    checkRule(rule, content, lines, document) {
        const violations = [];

        // Special handling for NO_SILENT_FALLBACK
        if (rule.checkCatchBlocks) {
            return this.checkCatchBlocks(content, document, rule);
        }

        // Check all patterns
        for (const patternDef of rule.patterns) {
            const pattern = patternDef.regex;

            lines.forEach((line, index) => {
                const match = pattern.exec(line);
                if (match) {
                    // Check exceptions for NO_HARDCODE
                    if (rule.id === 'NO_HARDCODE' && rule.exceptions) {
                        const isException = rule.exceptions.some(exc => exc.test(match[0]));
                        if (isException) {
                            return;
                        }
                    }

                    violations.push({
                        rule: rule.id,
                        ruleName: rule.name[this.language],
                        description: rule.description[this.language],
                        explanation: rule.explanation[this.language],
                        severity: patternDef.severity || rule.severity,
                        line: index + 1,
                        column: match.index + 1,
                        code: line.trim(),
                        matched: match[0],
                        patternName: patternDef.name,
                        fix: rule.fix[this.language]
                    });
                }
            });
        }

        return violations;
    }

    /**
     * Check catch blocks for silent fallbacks
     */
    checkCatchBlocks(content, document, rule) {
        const violations = [];
        const catchBlockRegex = /catch\s*\(([^)]*)\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;

        let match;
        while ((match = catchBlockRegex.exec(content)) !== null) {
            const catchBlock = match[2];
            const hasReturn = /return\s+(?:null|undefined|\[\]|\{\}|false|true|0|''|"")/.test(catchBlock);

            if (hasReturn && rule.mustInclude) {
                const hasErrorHandling = rule.mustInclude.some(keyword =>
                    new RegExp(keyword).test(catchBlock)
                );

                if (!hasErrorHandling) {
                    const lineNumber = content.substring(0, match.index).split('\n').length;
                    const codeSnippet = match[0].length > 100
                        ? match[0].substring(0, 100) + '...'
                        : match[0];

                    violations.push({
                        rule: rule.id,
                        ruleName: rule.name[this.language],
                        description: rule.description[this.language],
                        explanation: rule.explanation[this.language],
                        severity: rule.severity,
                        line: lineNumber,
                        column: match.index,
                        code: codeSnippet,
                        matched: 'Silent fallback detected',
                        patternName: 'catch block returning default without error handling',
                        fix: rule.fix[this.language]
                    });
                }
            }
        }

        return violations;
    }

    /**
     * Convert violation to VS Code diagnostic
     */
    violationToDiagnostic(violation, document) {
        const lineIndex = Math.max(0, violation.line - 1);
        const line = document.lineAt(lineIndex);

        const range = new vscode.Range(
            new vscode.Position(lineIndex, Math.max(0, violation.column - 1)),
            new vscode.Position(lineIndex, line.text.length)
        );

        const severity = violation.severity === 'ERROR'
            ? vscode.DiagnosticSeverity.Error
            : vscode.DiagnosticSeverity.Warning;

        // Create detailed message
        const message = this.language === 'th'
            ? ` ${violation.ruleName}

  คำอธิบาย: ${violation.description}

💡เหตุผล: ${violation.explanation}

  พบ: ${violation.patternName}
   ${violation.matched}

  วิธีแก้: ${violation.fix}

  อ่านเพิ่มเติม: กฎเหล็กข้อที่ ${this.getRuleNumber(violation.rule)}`
            : ` ${violation.ruleName}

  Description: ${violation.description}

  Reason: ${violation.explanation}

  Found: ${violation.patternName}
   ${violation.matched}

  Fix: ${violation.fix}

  Learn more: Absolute Rule #${this.getRuleNumber(violation.rule)}`;

        const diagnostic = new vscode.Diagnostic(range, message, severity);
        diagnostic.source = 'Chahuadev';
        diagnostic.code = violation.rule;

        return diagnostic;
    }

    /**
     * Get rule number for documentation
     */
    getRuleNumber(ruleId) {
        const rules = ['NO_MOCKING', 'NO_HARDCODE', 'NO_SILENT_FALLBACK', 'NO_INTERNAL_CACHE', 'NO_EMOJI'];
        return rules.indexOf(ruleId) + 1;
    }

    /**
     * Log violations to output channel
     */
    logViolations(document, violations) {
        const fileName = path.basename(document.uri.fsPath);

        this.outputChannel.appendLine(`\n${'='.repeat(80)}`);
        this.outputChannel.appendLine(this.language === 'th'
            ? `พบการละเมิดใน: ${fileName}`
            : `Violations found in: ${fileName}`
        );
        this.outputChannel.appendLine('='.repeat(80));

        for (const v of violations) {
            this.outputChannel.appendLine(` ${v.ruleName} (${v.severity})`);
            this.outputChannel.appendLine(`Line ${v.line}, Column ${v.column}`);
            this.outputChannel.appendLine(`${v.patternName}: ${v.matched}`);
            this.outputChannel.appendLine(`${v.fix}`);
        }
    }

    /**
     * Check if file should be excluded
     */
    shouldExclude(filePath) {
        const config = vscode.workspace.getConfiguration('chahuadev');
        const excludePatterns = config.get('excludePatterns', []);

        const relativePath = vscode.workspace.asRelativePath(filePath);

        return excludePatterns.some(pattern => {
            const regex = this.globToRegex(pattern);
            return regex.test(relativePath);
        });
    }

    /**
     * Convert glob pattern to regex
     */
    globToRegex(pattern) {
        let regexStr = pattern
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\?/g, '.');

        return new RegExp(`^${regexStr}$`);
    }

    /**
     * Convert SNAKE_CASE to camelCase
     */
    camelCase(str) {
        return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }
}

module.exports = { RulesValidator };
