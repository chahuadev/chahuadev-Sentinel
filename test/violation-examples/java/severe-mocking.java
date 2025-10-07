//======================================================================
// SEVERE NO_MOCKING VIOLATIONS - Java
// การสร้าง Mock Objects ที่ซับซ้อนและซ่อนเร้นผ่าน Reflection และ Dynamic Proxies
//======================================================================

import java.lang.reflect.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import javax.sql.DataSource;
import java.sql.*;

// VIOLATION 1: Dynamic Proxy-Based Mocking System
public class SevereMockingViolations {
    
    // CRITICAL: Hidden mocking infrastructure using Reflection
    private static final Map<Class<?>, Object> mockInstances = new ConcurrentHashMap<>();
    private static final Map<String, InvocationHandler> mockHandlers = new ConcurrentHashMap<>();
    private static final ThreadLocal<Boolean> mockingEnabled = ThreadLocal.withInitial(() -> false);
    
    // CRITICAL: Generic mock factory disguised as utility
    @SuppressWarnings("unchecked")
    public static <T> T createMock(Class<T> interfaceClass) {
        if (mockInstances.containsKey(interfaceClass)) {
            return (T) mockInstances.get(interfaceClass);
        }
        
        InvocationHandler handler = new MockInvocationHandler(interfaceClass);
        T mockInstance = (T) Proxy.newProxyInstance(
            interfaceClass.getClassLoader(),
            new Class<?>[]{interfaceClass},
            handler
        );
        
        mockInstances.put(interfaceClass, mockInstance);
        mockHandlers.put(interfaceClass.getName(), handler);
        
        return mockInstance;
    }
    
    // CRITICAL: Mock configuration system
    public static void configureMockBehavior(Class<?> mockClass, String method, Object returnValue) {
        InvocationHandler handler = mockHandlers.get(mockClass.getName());
        if (handler instanceof MockInvocationHandler) {
            ((MockInvocationHandler) handler).setReturnValue(method, returnValue);
        }
    }
    
    // CRITICAL: Hidden mocking handler with complex behavior simulation
    private static class MockInvocationHandler implements InvocationHandler {
        private final Class<?> targetClass;
        private final Map<String, Object> returnValues = new ConcurrentHashMap<>();
        private final Map<String, Exception> exceptions = new ConcurrentHashMap<>();
        private final Map<String, Integer> callCounts = new ConcurrentHashMap<>();
        
        public MockInvocationHandler(Class<?> targetClass) {
            this.targetClass = targetClass;
        }
        
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            String methodKey = method.getName() + Arrays.toString(method.getParameterTypes());
            
            // Track call statistics
            callCounts.merge(methodKey, 1, Integer::sum);
            
            // Simulate exceptions if configured
            if (exceptions.containsKey(methodKey)) {
                throw exceptions.get(methodKey);
            }
            
            // Return configured values
            if (returnValues.containsKey(methodKey)) {
                return returnValues.get(methodKey);
            }
            
            // CRITICAL: Default mock behavior based on return type
            Class<?> returnType = method.getReturnType();
            if (returnType == void.class) {
                return null;
            } else if (returnType == boolean.class) {
                return false;
            } else if (returnType.isPrimitive()) {
                return getDefaultPrimitiveValue(returnType);
            } else if (returnType == String.class) {
                return "MOCK_" + method.getName().toUpperCase();
            } else if (Collection.class.isAssignableFrom(returnType)) {
                return new ArrayList<>();
            } else if (Map.class.isAssignableFrom(returnType)) {
                return new HashMap<>();
            } else {
                // Recursively create mocks for complex return types
                return createMock(returnType);
            }
        }
        
        public void setReturnValue(String method, Object value) {
            returnValues.put(method, value);
        }
        
        public void setException(String method, Exception exception) {
            exceptions.put(method, exception);
        }
        
        private Object getDefaultPrimitiveValue(Class<?> type) {
            if (type == int.class) return 0;
            if (type == long.class) return 0L;
            if (type == double.class) return 0.0;
            if (type == float.class) return 0.0f;
            if (type == byte.class) return (byte) 0;
            if (type == short.class) return (short) 0;
            if (type == char.class) return '\0';
            return false;
        }
    }
}

// VIOLATION 2: Service Layer with Hidden Mock Dependencies
interface DatabaseService {
    User findUserById(String id);
    List<User> findAllUsers();
    void saveUser(User user);
    void deleteUser(String id);
    boolean userExists(String id);
}

interface EmailService {
    void sendWelcomeEmail(String email);
    void sendPasswordReset(String email, String token);
    boolean validateEmailAddress(String email);
    List<String> getEmailTemplates();
}

interface PaymentService {
    PaymentResult processPayment(String cardToken, double amount);
    boolean validateCard(String cardToken);
    List<Transaction> getTransactionHistory(String userId);
    void refundTransaction(String transactionId);
}

// CRITICAL: Business service using mocked dependencies
public class UserManagementService {
    
    // CRITICAL: Dependencies replaced with mocks during testing
    private final DatabaseService databaseService;
    private final EmailService emailService;
    private final PaymentService paymentService;
    
    // CRITICAL: Constructor injection allows mock substitution
    public UserManagementService(DatabaseService databaseService, 
                               EmailService emailService,
                               PaymentService paymentService) {
        // CRITICAL: Mock detection and automatic mock creation
        if (SevereMockingViolations.mockingEnabled.get()) {
            this.databaseService = SevereMockingViolations.createMock(DatabaseService.class);
            this.emailService = SevereMockingViolations.createMock(EmailService.class);
            this.paymentService = SevereMockingViolations.createMock(PaymentService.class);
            
            // Configure mock behaviors for testing
            configureMockBehaviors();
        } else {
            this.databaseService = databaseService;
            this.emailService = emailService;
            this.paymentService = paymentService;
        }
    }
    
    // CRITICAL: Method with hidden mock behavior configuration
    private void configureMockBehaviors() {
        // Database service mocks
        SevereMockingViolations.configureMockBehavior(
            DatabaseService.class, "findUserById", createMockUser("123")
        );
        SevereMockingViolations.configureMockBehavior(
            DatabaseService.class, "userExists", true
        );
        
        // Email service mocks  
        SevereMockingViolations.configureMockBehavior(
            EmailService.class, "validateEmailAddress", true
        );
        
        // Payment service mocks
        SevereMockingViolations.configureMockBehavior(
            PaymentService.class, "processPayment", new PaymentResult(true, "MOCK_TXN_123")
        );
    }
    
    public User registerUser(String email, String name, String cardToken) {
        // Service appears normal but uses mocks when enabled
        
        // Validate email
        if (!emailService.validateEmailAddress(email)) {
            throw new IllegalArgumentException("Invalid email address");
        }
        
        // Create user
        User user = new User(UUID.randomUUID().toString(), name, email);
        databaseService.saveUser(user);
        
        // Send welcome email
        emailService.sendWelcomeEmail(email);
        
        // Process initial payment if provided
        if (cardToken != null) {
            PaymentResult result = paymentService.processPayment(cardToken, 9.99);
            if (!result.isSuccess()) {
                throw new RuntimeException("Payment processing failed");
            }
        }
        
        return user;
    }
    
    // CRITICAL: Factory method that creates mocked version
    public static UserManagementService createTestInstance() {
        SevereMockingViolations.mockingEnabled.set(true);
        
        // All dependencies will be mocked automatically
        return new UserManagementService(null, null, null);
    }
    
    private User createMockUser(String id) {
        return new User(id, "Mock User", "mock@example.com");
    }
}

// VIOLATION 3: Annotation-Based Mock Injection System
@interface MockDependency {
    Class<?> implementation() default Object.class;
    String behavior() default "default";
}

@interface EnableMocking {
    boolean strict() default false;
}

// CRITICAL: Service with annotation-driven mocking
@EnableMocking(strict = true)
public class AdvancedBusinessService {
    
    @MockDependency(implementation = DatabaseService.class, behavior = "return_success")
    private DatabaseService database;
    
    @MockDependency(implementation = EmailService.class, behavior = "validate_all")
    private EmailService emailSender;
    
    @MockDependency(implementation = PaymentService.class, behavior = "always_succeed")
    private PaymentService payments;
    
    // CRITICAL: Hidden post-construction mock initialization
    public AdvancedBusinessService() {
        initializeMocks();
    }
    
    private void initializeMocks() {
        try {
            Field[] fields = this.getClass().getDeclaredFields();
            
            for (Field field : fields) {
                if (field.isAnnotationPresent(MockDependency.class)) {
                    MockDependency annotation = field.getAnnotation(MockDependency.class);
                    
                    // CRITICAL: Reflection-based mock injection
                    field.setAccessible(true);
                    Object mockInstance = SevereMockingViolations.createMock(field.getType());
                    field.set(this, mockInstance);
                    
                    // Configure behavior based on annotation
                    configureMockBehavior(field.getType(), annotation.behavior());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Mock initialization failed", e);
        }
    }
    
    private void configureMockBehavior(Class<?> mockClass, String behavior) {
        switch (behavior) {
            case "return_success":
                if (mockClass == DatabaseService.class) {
                    SevereMockingViolations.configureMockBehavior(mockClass, "userExists", true);
                }
                break;
            case "validate_all":
                if (mockClass == EmailService.class) {
                    SevereMockingViolations.configureMockBehavior(mockClass, "validateEmailAddress", true);
                }
                break;
            case "always_succeed":
                if (mockClass == PaymentService.class) {
                    SevereMockingViolations.configureMockBehavior(
                        mockClass, "processPayment", new PaymentResult(true, "SUCCESS")
                    );
                }
                break;
        }
    }
    
    // Business methods use injected mocks transparently
    public boolean processUserTransaction(String userId, double amount, String cardToken) {
        User user = database.findUserById(userId);
        if (user == null) return false;
        
        boolean cardValid = payments.validateCard(cardToken);
        if (!cardValid) return false;
        
        PaymentResult result = payments.processPayment(cardToken, amount);
        return result.isSuccess();
    }
}

// VIOLATION 4: Test Infrastructure Classes (Mock Data Objects)
class User {
    private final String id;
    private final String name;
    private final String email;
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}

class PaymentResult {
    private final boolean success;
    private final String transactionId;
    
    public PaymentResult(boolean success, String transactionId) {
        this.success = success;
        this.transactionId = transactionId;
    }
    
    public boolean isSuccess() { return success; }
    public String getTransactionId() { return transactionId; }
}

class Transaction {
    private final String id;
    private final double amount;
    private final Date timestamp;
    
    public Transaction(String id, double amount, Date timestamp) {
        this.id = id;
        this.amount = amount;
        this.timestamp = timestamp;
    }
    
    public String getId() { return id; }
    public double getAmount() { return amount; }
    public Date getTimestamp() { return timestamp; }
}