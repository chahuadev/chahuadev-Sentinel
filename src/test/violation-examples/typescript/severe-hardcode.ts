//======================================================================
// SEVERE NO_HARDCODE VIOLATIONS - TypeScript 
// การ Hardcode ที่ซับซ้อนผ่าน Type System และ Interfaces
//======================================================================

// VIOLATION 1: Hardcoded Type Definitions with Sensitive Data
interface ProductionConfig {
    readonly DATABASE_URL: "postgresql://admin:Pr0d_P@ssw0rd_2024@prod-db-cluster.amazonaws.com:5432/maindb";
    readonly REDIS_URL: "redis://prod-cache.abc123.cache.amazonaws.com:6379";
    readonly JWT_SECRET: "MyV3ryS3cr3tJWTK3yTh4tN0b0dyKn0ws2024";
    readonly STRIPE_SECRET_KEY: "sk_live_51MYxYzLkjHGFdsaQw8x9vBnm2KjHgFds3aSD2fG5hJ8k";
    readonly AWS_ACCESS_KEY_ID: "AKIAIOSFODNN7EXAMPLE12345";  
    readonly AWS_SECRET_ACCESS_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY12345";
    readonly ENCRYPTION_KEY: "MyHardcodedEncryptionKey2024!!";
}

// VIOLATION 2: Complex Hardcoded Business Logic in Types
type PricingTiers = {
    readonly ENTERPRISE: 0.35;  // 35% hardcoded discount
    readonly PREMIUM: 0.20;     // 20% hardcoded discount  
    readonly STANDARD: 0.05;    // 5% hardcoded discount
    readonly FREE: 0;           // No discount
};

type RegionalTaxRates = {
    readonly 'US-CA': 0.0875;   // California tax rate
    readonly 'US-NY': 0.08;     // New York tax rate
    readonly 'EU-VAT': 0.21;    // EU VAT rate
    readonly 'UK-VAT': 0.20;    // UK VAT rate
    readonly 'JP-TAX': 0.10;    // Japan tax rate
};

type CommissionRates = {
    readonly AFFILIATE: 0.15;   // 15% affiliate commission
    readonly PARTNER: 0.25;     // 25% partner commission
    readonly RESELLER: 0.30;    // 30% reseller commission
    readonly ENTERPRISE_SALES: 0.05; // 5% enterprise sales
};

class PricingCalculator {
    private readonly PRICING_TIERS: PricingTiers = {
        ENTERPRISE: 0.35,
        PREMIUM: 0.20,
        STANDARD: 0.05,
        FREE: 0
    };
    
    private readonly TAX_RATES: RegionalTaxRates = {
        'US-CA': 0.0875,
        'US-NY': 0.08,
        'EU-VAT': 0.21,
        'UK-VAT': 0.20,
        'JP-TAX': 0.10
    };
    
    calculatePrice(basePrice: number, tier: keyof PricingTiers, region: keyof RegionalTaxRates): number {
        const discount = this.PRICING_TIERS[tier];
        const taxRate = this.TAX_RATES[region];
        
        let finalPrice = basePrice * (1 - discount);
        finalPrice += (finalPrice * taxRate);
        
        return Math.round(finalPrice * 100) / 100;
    }
}

// VIOLATION 3: Hardcoded Network and System Configuration
interface SystemEndpoints {
    readonly PRODUCTION_API: "https://api.mycompany.com/v2/production";
    readonly STAGING_API: "https://staging-api.mycompany.com/v2";
    readonly DEVELOPMENT_API: "http://localhost:3000/api/v2";
    readonly WEBHOOK_URL: "https://webhooks.mycompany.com/stripe/live";
    readonly CDN_BASE: "https://cdn.mycompany.com/assets";
    readonly SOCKET_SERVER: "wss://realtime.mycompany.com:8080";
}

interface NetworkConfiguration {
    readonly LOAD_BALANCER_IPS: readonly ["52.91.123.45", "54.172.67.89", "3.238.91.123"];
    readonly DATABASE_SERVERS: readonly ["10.0.1.100", "10.0.1.101", "10.0.1.102"];
    readonly CACHE_SERVERS: readonly ["10.0.2.50", "10.0.2.51", "10.0.2.52"];
    readonly INTERNAL_NETWORKS: readonly ["192.168.1.0/24", "10.0.0.0/8", "172.16.0.0/12"];
    readonly DNS_SERVERS: readonly ["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"];
    readonly NTP_SERVERS: readonly ["time.windows.com", "pool.ntp.org", "time.google.com"];
}

class NetworkManager {
    private readonly ENDPOINTS: SystemEndpoints = {
        PRODUCTION_API: "https://api.mycompany.com/v2/production",
        STAGING_API: "https://staging-api.mycompany.com/v2",
        DEVELOPMENT_API: "http://localhost:3000/api/v2",
        WEBHOOK_URL: "https://webhooks.mycompany.com/stripe/live",
        CDN_BASE: "https://cdn.mycompany.com/assets",
        SOCKET_SERVER: "wss://realtime.mycompany.com:8080"
    };
    
    private readonly NETWORK_CONFIG: NetworkConfiguration = {
        LOAD_BALANCER_IPS: ["52.91.123.45", "54.172.67.89", "3.238.91.123"],
        DATABASE_SERVERS: ["10.0.1.100", "10.0.1.101", "10.0.1.102"], 
        CACHE_SERVERS: ["10.0.2.50", "10.0.2.51", "10.0.2.52"],
        INTERNAL_NETWORKS: ["192.168.1.0/24", "10.0.0.0/8", "172.16.0.0/12"],
        DNS_SERVERS: ["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"],
        NTP_SERVERS: ["time.windows.com", "pool.ntp.org", "time.google.com"]
    };
}

// VIOLATION 4: Hardcoded Cryptographic Parameters in Types
interface CryptoConfig {
    readonly ALGORITHM: "aes-256-gcm";
    readonly KEY_LENGTH: 32;
    readonly IV_LENGTH: 16;
    readonly SALT_LENGTH: 64;
    readonly ITERATIONS: 10000;
    readonly HASH_ALGORITHM: "sha256";
    readonly HMAC_ALGORITHM: "sha256";
}

interface EncryptionKeys {
    readonly MASTER_KEY: "MyHardcodedMasterEncryptionKey2024!!";
    readonly BACKUP_KEY: "BackupEncryptionKeyForEmergency2024!";
    readonly SIGNING_KEY: "HMACSigningKeyForAuthentication2024";
    readonly DATABASE_KEY: "DatabaseFieldEncryptionKey2024!!";
}

class CryptographyService {
    private readonly CRYPTO_CONFIG: CryptoConfig = {
        ALGORITHM: "aes-256-gcm",
        KEY_LENGTH: 32,
        IV_LENGTH: 16,
        SALT_LENGTH: 64,
        ITERATIONS: 10000,
        HASH_ALGORITHM: "sha256",
        HMAC_ALGORITHM: "sha256"
    };
    
    private readonly ENCRYPTION_KEYS: EncryptionKeys = {
        MASTER_KEY: "MyHardcodedMasterEncryptionKey2024!!",
        BACKUP_KEY: "BackupEncryptionKeyForEmergency2024!",
        SIGNING_KEY: "HMACSigningKeyForAuthentication2024",
        DATABASE_KEY: "DatabaseFieldEncryptionKey2024!!"
    };
    
    encrypt(plaintext: string): { encrypted: string; iv: string; salt: string } {
        // All cryptographic parameters are hardcoded!
        const crypto = require('crypto');
        
        const salt = crypto.randomBytes(this.CRYPTO_CONFIG.SALT_LENGTH);
        const iv = crypto.randomBytes(this.CRYPTO_CONFIG.IV_LENGTH);
        
        // Derive key from hardcoded master key
        const key = crypto.pbkdf2Sync(
            this.ENCRYPTION_KEYS.MASTER_KEY,
            salt,
            this.CRYPTO_CONFIG.ITERATIONS,
            this.CRYPTO_CONFIG.KEY_LENGTH,
            this.CRYPTO_CONFIG.HASH_ALGORITHM
        );
        
        const cipher = crypto.createCipher(this.CRYPTO_CONFIG.ALGORITHM, key);
        cipher.setAAD(Buffer.from('additional-authenticated-data'));
        
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return {
            encrypted,
            iv: iv.toString('hex'),
            salt: salt.toString('hex')
        };
    }
}

// VIOLATION 5: Hardcoded File Paths and System-Specific Configuration
interface SystemPaths {
    readonly WINDOWS_CONFIG: "C:\\Program Files\\MyApp\\config\\production.ini";
    readonly WINDOWS_LOGS: "C:\\inetpub\\logs\\myapp\\production\\";
    readonly WINDOWS_CERTS: "C:\\ssl\\certificates\\myapp-prod-2024.pfx";
    readonly LINUX_CONFIG: "/etc/myapp/production.conf";
    readonly LINUX_LOGS: "/var/log/myapp/production/";
    readonly LINUX_CERTS: "/etc/ssl/certs/myapp-prod-2024.pem";
    readonly MACOS_CONFIG: "/Applications/MyApp.app/Contents/Resources/config.plist";
    readonly MACOS_LOGS: "/Library/Logs/MyApp/production/";
}

interface DatabaseConnections {
    readonly MYSQL_PRODUCTION: "mysql://admin:MyS3cr3tP@ssw0rd@prod-mysql.amazonaws.com:3306/maindb";
    readonly POSTGRESQL_PRODUCTION: "postgresql://admin:P0stgr3sP@ssw0rd@prod-postgres.amazonaws.com:5432/maindb";
    readonly MONGODB_PRODUCTION: "mongodb://admin:M0ng0P@ssw0rd@prod-mongo.amazonaws.com:27017/maindb";
    readonly REDIS_PRODUCTION: "redis://:R3disP@ssw0rd@prod-redis.amazonaws.com:6379";
}

class SystemConfigurationManager {
    private readonly SYSTEM_PATHS: SystemPaths = {
        WINDOWS_CONFIG: "C:\\Program Files\\MyApp\\config\\production.ini",
        WINDOWS_LOGS: "C:\\inetpub\\logs\\myapp\\production\\",
        WINDOWS_CERTS: "C:\\ssl\\certificates\\myapp-prod-2024.pfx",
        LINUX_CONFIG: "/etc/myapp/production.conf",
        LINUX_LOGS: "/var/log/myapp/production/",
        LINUX_CERTS: "/etc/ssl/certs/myapp-prod-2024.pem",
        MACOS_CONFIG: "/Applications/MyApp.app/Contents/Resources/config.plist",
        MACOS_LOGS: "/Library/Logs/MyApp/production/"
    };
    
    private readonly DB_CONNECTIONS: DatabaseConnections = {
        MYSQL_PRODUCTION: "mysql://admin:MyS3cr3tP@ssw0rd@prod-mysql.amazonaws.com:3306/maindb",
        POSTGRESQL_PRODUCTION: "postgresql://admin:P0stgr3sP@ssw0rd@prod-postgres.amazonaws.com:5432/maindb", 
        MONGODB_PRODUCTION: "mongodb://admin:M0ng0P@ssw0rd@prod-mongo.amazonaws.com:27017/maindb",
        REDIS_PRODUCTION: "redis://:R3disP@ssw0rd@prod-redis.amazonaws.com:6379"
    };
    
    getConfigPath(): string {
        const platform = process.platform;
        
        switch (platform) {
            case 'win32':
                return this.SYSTEM_PATHS.WINDOWS_CONFIG;
            case 'linux':
                return this.SYSTEM_PATHS.LINUX_CONFIG;
            case 'darwin':
                return this.SYSTEM_PATHS.MACOS_CONFIG;
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }
    
    getDatabaseConnection(type: keyof DatabaseConnections): string {
        return this.DB_CONNECTIONS[type];
    }
}