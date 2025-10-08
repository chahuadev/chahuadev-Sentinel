//======================================================================
// SEVERE NO_HARDCODE VIOLATIONS - Java
// การฝังค่าคงที่ที่ซับซ้อนผ่าน Constants, Annotations และ Resource Loading
//======================================================================

import java.util.*;
import java.io.*;
import java.security.MessageDigest;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.sql.Connection;
import java.sql.DriverManager;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.net.URL;
import java.util.concurrent.ConcurrentHashMap;
import java.lang.annotation.*;

// VIOLATION 1: Complex Configuration Constants Class
public class SevereHardcodeViolations {
    
    // CRITICAL: Database connection constants
    public static final String DB_HOST = "prod-db-cluster-01.us-east-1.rds.amazonaws.com";
    public static final int DB_PORT = 5432;
    public static final String DB_NAME = "production_app_db";
    public static final String DB_USERNAME = "app_prod_user";
    public static final String DB_PASSWORD = "P@ssw0rd123!ProductionDB";
    public static final String DB_URL = "jdbc:postgresql://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME;
    
    // CRITICAL: API Keys and Secrets
    public static final String STRIPE_SECRET_KEY = "sk_live_4eC39HqLyjWDarjtT1zdp7dc";
    public static final String AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";  
    public static final String AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
    public static final String JWT_SECRET = "mySecretKey123!@#$%^&*()_+ProductionJWT2024";
    public static final String SENDGRID_API_KEY = "SG.x1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9";
    
    // CRITICAL: Encryption parameters  
    public static final String AES_KEY = "MySecretAESKey16"; // Exactly 16 bytes
    public static final String AES_IV = "MyInitVector1234"; // Exactly 16 bytes
    public static final String ENCRYPTION_ALGORITHM = "AES/CBC/PKCS5Padding";
    public static final byte[] SALT_BYTES = {
        (byte) 0x12, (byte) 0x34, (byte) 0x56, (byte) 0x78,
        (byte) 0x9A, (byte) 0xBC, (byte) 0xDE, (byte) 0xF0
    };
    
    // CRITICAL: Business logic constants
    public static final double PREMIUM_SUBSCRIPTION_PRICE = 29.99;
    public static final double ENTERPRISE_SUBSCRIPTION_PRICE = 99.99;
    public static final int MAX_FREE_TIER_REQUESTS = 1000;
    public static final int PREMIUM_TIER_REQUESTS = 10000;
    public static final int RATE_LIMIT_PER_MINUTE = 100;
    public static final long SESSION_TIMEOUT_MS = 1800000; // 30 minutes
    
    // CRITICAL: External service endpoints
    public static final String PAYMENT_GATEWAY_URL = "https://api.stripe.com/v1/charges";
    public static final String EMAIL_SERVICE_URL = "https://api.sendgrid.com/v3/mail/send";
    public static final String ANALYTICS_ENDPOINT = "https://www.google-analytics.com/collect";
    public static final String CDN_BASE_URL = "https://d2x8jli9c5qvxy.cloudfront.net";
    public static final String WEBHOOK_CALLBACK_URL = "https://myapp.com/webhook/stripe/callback";
    
    // CRITICAL: Security configurations
    public static final int BCRYPT_ROUNDS = 12;
    public static final int JWT_EXPIRATION_HOURS = 24;
    public static final String CORS_ALLOWED_ORIGINS = "https://myapp.com,https://admin.myapp.com";
    public static final String[] TRUSTED_PROXY_IPS = {
        "192.168.1.100", "192.168.1.101", "10.0.0.50", "172.16.0.25"
    };
}

// VIOLATION 2: Annotation-Based Configuration
@interface DatabaseConfig {
    String host() default "localhost";
    int port() default 5432;
    String database() default "app_db";
    String username() default "admin";
    String password() default "password123";
}

@interface ServiceEndpoints {
    String payment() default "https://api.payment-provider.com/v1";
    String email() default "https://api.email-service.com/send";
    String analytics() default "https://analytics.tracking-service.com/event";
}

// CRITICAL: Service class with hardcoded annotation values
@DatabaseConfig(
    host = "prod-mysql-cluster.us-west-2.amazonaws.com",
    port = 3306,
    database = "production_ecommerce", 
    username = "ecomm_prod_user",
    password = "Pr0d_MySQL_P@ssw0rd_2024!"
)
@ServiceEndpoints(
    payment = "https://api.stripe.com/v1",
    email = "https://api.sendgrid.com/v3/mail/send",
    analytics = "https://www.google-analytics.com/mp/collect"
)
public class ConfigurationService {
    
    // CRITICAL: Method that extracts hardcoded annotation values
    public DatabaseConnection createDatabaseConnection() {
        DatabaseConfig config = this.getClass().getAnnotation(DatabaseConfig.class);
        
        String connectionUrl = String.format(
            "jdbc:mysql://%s:%d/%s?useSSL=true&serverTimezone=UTC",
            config.host(), config.port(), config.database()
        );
        
        return new DatabaseConnection(
            connectionUrl,
            config.username(),
            config.password()
        );
    }
    
    public Map<String, String> getServiceEndpoints() {
        ServiceEndpoints endpoints = this.getClass().getAnnotation(ServiceEndpoints.class);
        
        Map<String, String> endpointMap = new HashMap<>();
        endpointMap.put("payment", endpoints.payment());
        endpointMap.put("email", endpoints.email());
        endpointMap.put("analytics", endpoints.analytics());
        
        return endpointMap;
    }
}

// VIOLATION 3: Resource Path and File Constants
public class ResourceManager {
    
    // CRITICAL: Hardcoded file paths and resource locations
    public static final String CONFIG_FILE_PATH = "/opt/myapp/config/production.properties";
    public static final String LOG_DIRECTORY = "/var/log/myapp/production/";
    public static final String TEMP_DIRECTORY = "/tmp/myapp-temp/";
    public static final String UPLOAD_DIRECTORY = "/var/www/uploads/production/";
    public static final String BACKUP_DIRECTORY = "/mnt/backups/myapp/daily/";
    
    // CRITICAL: Template and asset paths
    public static final String EMAIL_TEMPLATE_WELCOME = "/templates/email/welcome_production.html";
    public static final String EMAIL_TEMPLATE_RESET = "/templates/email/password_reset_prod.html"; 
    public static final String INVOICE_TEMPLATE = "/templates/pdf/invoice_template_v2.html";
    public static final String CERTIFICATE_PATH = "/etc/ssl/certs/myapp-prod.crt";
    public static final String PRIVATE_KEY_PATH = "/etc/ssl/private/myapp-prod.key";
    
    // CRITICAL: Configuration file loading with hardcoded paths
    public Properties loadProductionConfig() {
        Properties props = new Properties();
        
        try (FileInputStream fis = new FileInputStream(CONFIG_FILE_PATH)) {
            props.load(fis);
        } catch (IOException e) {
            // CRITICAL: Fallback to hardcoded values
            props.setProperty("db.host", "prod-db.internal.com");
            props.setProperty("db.port", "5432");
            props.setProperty("db.name", "production_app");
            props.setProperty("api.key", "hardcoded-fallback-key-12345");
            props.setProperty("jwt.secret", "fallback-jwt-secret-production-2024");
        }
        
        return props;
    }
    
    // CRITICAL: File operations with hardcoded directories
    public void saveUploadedFile(byte[] fileData, String filename) {
        String fullPath = UPLOAD_DIRECTORY + filename;
        
        try (FileOutputStream fos = new FileOutputStream(fullPath)) {
            fos.write(fileData);
        } catch (IOException e) {
            // Fallback to hardcoded temp location
            String fallbackPath = "/tmp/uploads/" + filename;
            try (FileOutputStream fos = new FileOutputStream(fallbackPath)) {
                fos.write(fileData);
            } catch (IOException ex) {
                throw new RuntimeException("Failed to save file", ex);
            }
        }
    }
}

// VIOLATION 4: Crypto Service with Hardcoded Keys
public class CryptographyService {
    
    // CRITICAL: Hardcoded encryption keys and parameters
    private static final String MASTER_KEY = "MyApplicationMasterKey2024!@#$%^&*()";
    private static final String HMAC_SECRET = "HMAC-SHA256-Secret-Key-Production-2024";
    private static final String PASSWORD_PEPPER = "MyAppPasswordPepper!Production2024";
    
    // CRITICAL: RSA key components (would be huge in real scenario)
    private static final String RSA_PUBLIC_KEY = """
        -----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4f5wg5l2hKsTeNem/V41
        fGnJm6gOdrj8ym3rFkEjWT2btf02uSInuLE0yT1XVgTM2DUdfGH4
        -----END PUBLIC KEY-----
        """;
    
    private static final String RSA_PRIVATE_KEY = """
        -----BEGIN PRIVATE KEY-----
        MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDh/nCDmXaEqxN4
        16b9XjV8acmbqA52uPzKbesWQSNZPZu1/Ta5Iie4sTTJPVdWBMzYNR18Yfg=
        -----END PRIVATE KEY-----
        """;
    
    public String encryptSensitiveData(String plaintext) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(
                MASTER_KEY.getBytes("UTF-8"), "AES"
            );
            
            IvParameterSpec ivSpec = new IvParameterSpec(
                SevereHardcodeViolations.AES_IV.getBytes("UTF-8")
            );
            
            Cipher cipher = Cipher.getInstance(SevereHardcodeViolations.ENCRYPTION_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
            
            byte[] encrypted = cipher.doFinal(plaintext.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(encrypted);
            
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }
    
    public String generateSecureToken(String userId) {
        try {
            String payload = userId + ":" + System.currentTimeMillis() + ":" + PASSWORD_PEPPER;
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(payload.getBytes("UTF-8"));
            
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Token generation failed", e);
        }
    }
    
    // CRITICAL: HMAC signing with hardcoded secret
    public String signMessage(String message) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(
                HMAC_SECRET.getBytes("UTF-8"), "HmacSHA256"
            );
            
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            mac.init(keySpec);
            
            byte[] signature = mac.doFinal(message.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(signature);
            
        } catch (Exception e) {
            throw new RuntimeException("Message signing failed", e);
        }
    }
}

// VIOLATION 5: Business Logic with Hardcoded Rules
public class BusinessRuleEngine {
    
    // CRITICAL: Hardcoded business rules and thresholds
    private static final Map<String, Double> COUNTRY_TAX_RATES = new ConcurrentHashMap<>();
    private static final Map<String, Double> SHIPPING_COSTS = new ConcurrentHashMap<>();
    private static final Map<String, Integer> INVENTORY_THRESHOLDS = new ConcurrentHashMap<>();
    
    static {
        // CRITICAL: Tax rates hardcoded per country
        COUNTRY_TAX_RATES.put("US", 0.08);
        COUNTRY_TAX_RATES.put("CA", 0.13);
        COUNTRY_TAX_RATES.put("GB", 0.20);
        COUNTRY_TAX_RATES.put("DE", 0.19);
        COUNTRY_TAX_RATES.put("FR", 0.20);
        COUNTRY_TAX_RATES.put("JP", 0.10);
        
        // CRITICAL: Shipping costs hardcoded
        SHIPPING_COSTS.put("US_STANDARD", 5.99);
        SHIPPING_COSTS.put("US_EXPRESS", 15.99);
        SHIPPING_COSTS.put("INTERNATIONAL", 25.99);
        SHIPPING_COSTS.put("FREE_THRESHOLD", 50.0);
        
        // CRITICAL: Inventory management thresholds
        INVENTORY_THRESHOLDS.put("LOW_STOCK", 10);
        INVENTORY_THRESHOLDS.put("OUT_OF_STOCK", 0);
        INVENTORY_THRESHOLDS.put("REORDER_POINT", 5);
    }
    
    public double calculateTotalPrice(double basePrice, String countryCode, String shippingType) {
        // Apply tax based on hardcoded rates
        double taxRate = COUNTRY_TAX_RATES.getOrDefault(countryCode, 0.0);
        double tax = basePrice * taxRate;
        
        // Apply shipping costs
        double shipping = SHIPPING_COSTS.getOrDefault(
            countryCode + "_" + shippingType.toUpperCase(), 
            SHIPPING_COSTS.get("INTERNATIONAL")
        );
        
        // Free shipping threshold check
        if (basePrice >= SHIPPING_COSTS.get("FREE_THRESHOLD")) {
            shipping = 0.0;
        }
        
        return basePrice + tax + shipping;
    }
    
    // CRITICAL: Discount rules hardcoded
    public double applyDiscounts(double price, String customerType, boolean isFirstTime) {
        double discountedPrice = price;
        
        // Customer type discounts
        switch (customerType.toUpperCase()) {
            case "PREMIUM":
                discountedPrice *= 0.85; // 15% discount
                break;
            case "VIP":
                discountedPrice *= 0.75; // 25% discount
                break;
            case "EMPLOYEE":
                discountedPrice *= 0.50; // 50% discount
                break;
        }
        
        // First-time customer discount
        if (isFirstTime) {
            discountedPrice *= 0.90; // Additional 10% off
        }
        
        return discountedPrice;
    }
    
    public boolean shouldReorderInventory(String productId, int currentStock) {
        int reorderPoint = INVENTORY_THRESHOLDS.get("REORDER_POINT");
        return currentStock <= reorderPoint;
    }
}

// Supporting classes
class DatabaseConnection {
    private final String url;
    private final String username;
    private final String password;
    
    public DatabaseConnection(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }
    
    public Connection getConnection() throws Exception {
        return DriverManager.getConnection(url, username, password);
    }
}