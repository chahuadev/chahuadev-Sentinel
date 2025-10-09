//======================================================================
// SEVERE NO_HARDCODE VIOLATIONS - JavaScript
// การ Hardcode ที่อันตรายและซ่อนเร้นที่สุด
//======================================================================

// VIOLATION 1: Production API Keys and Secrets (ระดับ CRITICAL)
const config = {
    // Real production credentials hardcoded
    STRIPE_SECRET_KEY: "sk_live_51MYxYzLkjHGFdsaQw8x9vBnm2KjHgFds3aSD2fG5hJ8kLmnBvCx4QwErTyUiOp1234567890abcdef",
    AWS_ACCESS_KEY: "AKIAIOSFODNN7EXAMPLE12345",
    AWS_SECRET_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY12345",
    DATABASE_PASSWORD: "Pr0d_DB_P@ssw0rd_2024!",
    JWT_SECRET: "MyV3ryS3cr3tJWTK3yTh4tN0b0dyKn0ws2024",
    
    // Hidden in mathematical operations
    MAX_RETRY_COUNT: 3 * 1000 + 500 - 499,  // = 3001 (magic number)
    SESSION_TIMEOUT: 60 * 60 * 24 * 7 * 1000,  // = 604800000ms (1 week)
    
    // Base64 encoded secrets (still hardcoded!)
    WEBHOOK_SECRET: atob("TXlTdXBlclNlY3JldFdlYmhvb2tLZXkyMDI0"),
};

// VIOLATION 2: Production URLs and Endpoints
const endpoints = {
    PRODUCTION_API: "https://api.mycompany.com/v2/production",
    PAYMENT_GATEWAY: "https://payments.stripe.com/webhooks/live",
    DATABASE_HOST: "prod-db-cluster.amazonaws.com",
    REDIS_CLUSTER: "prod-cache.abc123.cache.amazonaws.com:6379",
    ELASTICSEARCH: "https://search-prod-logs.us-east-1.es.amazonaws.com",
    
    // IP addresses of production servers
    LOAD_BALANCER_IPS: ["52.91.123.45", "54.172.67.89", "3.238.91.123"],
    BACKUP_SERVERS: ["10.0.1.100", "10.0.1.101", "10.0.1.102"],
};

// VIOLATION 3: Hardcoded Business Logic Constants
class PricingCalculator {
    calculatePrice(basePrice, userTier) {
        // Hardcoded pricing tiers and percentages
        const ENTERPRISE_DISCOUNT = 0.35;  // 35% discount
        const PREMIUM_DISCOUNT = 0.20;     // 20% discount  
        const STANDARD_DISCOUNT = 0.05;    // 5% discount
        
        // Hardcoded tax rates by region
        const TAX_RATES = {
            'US_CA': 0.0875,    // California tax
            'US_NY': 0.08,      // New York tax
            'EU_VAT': 0.21,     // EU VAT
            'UK_VAT': 0.20,     // UK VAT
        };
        
        // Hardcoded commission rates
        const AFFILIATE_COMMISSION = 0.15;  // 15%
        const PARTNER_COMMISSION = 0.25;    // 25%
        
        // Complex hardcoded calculation
        let finalPrice = basePrice;
        if (userTier === 'enterprise') finalPrice *= (1 - ENTERPRISE_DISCOUNT);
        finalPrice += (finalPrice * TAX_RATES['US_CA']);  // Always California tax!
        
        return Math.round(finalPrice * 100) / 100;
    }
}

// VIOLATION 4: Hardcoded File Paths and System Configurations
const systemPaths = {
    WINDOWS_CONFIG: "C:\\Program Files\\MyApp\\config\\production.ini",
    LINUX_CONFIG: "/etc/myapp/production.conf",
    MACOS_CONFIG: "/Applications/MyApp.app/Contents/Resources/config.plist",
    LOG_DIRECTORY: "C:\\inetpub\\logs\\myapp\\production\\",
    CERTIFICATE_PATH: "C:\\ssl\\certificates\\myapp-prod-2024.pfx",
    CERTIFICATE_PASSWORD: "CertP@ssw0rd2024!",
    
    // Hardcoded network configurations
    INTERNAL_NETWORKS: ["192.168.1.0/24", "10.0.0.0/8", "172.16.0.0/12"],
    DNS_SERVERS: ["8.8.8.8", "8.8.4.4", "1.1.1.1"],
    NTP_SERVERS: ["time.windows.com", "pool.ntp.org"],
};

// VIOLATION 5: Hardcoded Cryptographic Parameters (ระดับ CRITICAL)
const crypto = require('crypto');

class SecurityManager {
    encryptData(plaintext) {
        // Hardcoded encryption parameters (ร้ายแรงมาก!)
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from('MyHardcodedEncryptionKey2024!!', 'utf8');  // Fixed key!
        const iv = Buffer.from('1234567890123456', 'utf8');  // Fixed IV!
        const salt = Buffer.from('hardcodedsalt123', 'utf8');  // Fixed salt!
        
        const cipher = crypto.createCipher(algorithm, key);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return {
            encrypted,
            // Hardcoded authentication parameters  
            hmacKey: '5f4dcc3b5aa765d61d8327deb882cf99',  // MD5 hash as HMAC key!
            iterations: 10000,  // Hardcoded PBKDF2 iterations
            keyLength: 32,      // Hardcoded key length
        };
    }
}