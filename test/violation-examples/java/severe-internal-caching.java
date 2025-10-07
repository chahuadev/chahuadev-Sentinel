//======================================================================
// SEVERE NO_INTERNAL_CACHING VIOLATIONS - Java
// ระบบแคชที่ซับซ้อนผ่าน Static Maps, Weak References และ Annotation Processing
//======================================================================

import java.util.*;
import java.util.concurrent.*;
import java.lang.ref.*;
import java.lang.reflect.*;
import java.time.*;
import java.util.function.*;
import java.lang.annotation.*;
import java.io.Serializable;

// VIOLATION 1: Annotation-Driven Caching System
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
@interface Cacheable {
    int ttlSeconds() default 300;
    String keyGenerator() default "default";
    boolean asyncRefresh() default false;
    int maxSize() default 1000;
}

@Retention(RetentionPolicy.RUNTIME) 
@Target({ElementType.TYPE})
@interface EnableCaching {
    String cacheName() default "default";
    boolean statistics() default true;
}

// CRITICAL: Hidden caching infrastructure disguised as utility
public class SevereInternalCachingViolations {
    
    // VIOLATION 2: Multi-Level Caching System
    @EnableCaching(cacheName = "userService", statistics = true)
    public static class UserService {
        
        // CRITICAL: Method-level caching using annotations
        @Cacheable(ttlSeconds = 600, maxSize = 5000)
        public User findUserById(String id) {
            // Method appears clean but annotation adds caching
            System.out.println("Fetching user from database: " + id);
            
            // Simulate expensive database call
            try {
                Thread.sleep(100); // Simulate network latency
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            return new User(id, "User " + id, id + "@example.com");
        }
        
        @Cacheable(ttlSeconds = 300, keyGenerator = "emailKey")
        public List<User> findUsersByEmail(String email) {
            System.out.println("Searching users by email: " + email);
            
            // Simulate complex query
            List<User> users = new ArrayList<>();
            for (int i = 0; i < 3; i++) {
                users.add(new User(
                    "user_" + i + "_" + email.hashCode(),
                    "User " + i,
                    email
                ));
            }
            
            return users;
        }
        
        @Cacheable(ttlSeconds = 1800, asyncRefresh = true)
        public UserStatistics getUserStatistics(String userId) {
            System.out.println("Computing user statistics: " + userId);
            
            // Expensive computation
            return new UserStatistics(
                userId,
                (int) (Math.random() * 1000),
                (int) (Math.random() * 50),
                Instant.now()
            );
        }
    }
    
    // VIOLATION 3: Automatic Caching Proxy Generator
    public static class CachingProxyFactory {
        
        // CRITICAL: Internal cache storage systems
        private static final Map<Class<?>, Object> proxyInstances = new ConcurrentHashMap<>();
        private static final Map<String, CacheEntry> globalCache = new ConcurrentHashMap<>();
        private static final Map<Class<?>, CacheStatistics> cacheStats = new ConcurrentHashMap<>();
        
        // CRITICAL: Automatic proxy creation with caching
        @SuppressWarnings("unchecked")
        public static <T> T createCachingProxy(T target) {
            Class<?> targetClass = target.getClass();
            
            // Check if proxy already exists
            if (proxyInstances.containsKey(targetClass)) {
                return (T) proxyInstances.get(targetClass);
            }
            
            // Create caching statistics
            cacheStats.putIfAbsent(targetClass, new CacheStatistics());
            
            T proxy = (T) Proxy.newProxyInstance(
                targetClass.getClassLoader(),
                targetClass.getInterfaces(),
                new CachingInvocationHandler(target, targetClass)
            );
            
            proxyInstances.put(targetClass, proxy);
            return proxy;
        }
        
        // CRITICAL: Caching invocation handler with complex logic
        private static class CachingInvocationHandler implements InvocationHandler {
            private final Object target;
            private final Class<?> targetClass;
            private final Map<Method, Cacheable> cacheableAnnotations;
            
            public CachingInvocationHandler(Object target, Class<?> targetClass) {
                this.target = target;
                this.targetClass = targetClass;
                this.cacheableAnnotations = new HashMap<>();
                
                // Pre-process cacheable methods
                for (Method method : targetClass.getDeclaredMethods()) {
                    if (method.isAnnotationPresent(Cacheable.class)) {
                        cacheableAnnotations.put(method, method.getAnnotation(Cacheable.class));
                    }
                }
            }
            
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                Cacheable cacheable = cacheableAnnotations.get(method);
                
                if (cacheable != null) {
                    return handleCacheableMethod(method, args, cacheable);
                } else {
                    return method.invoke(target, args);
                }
            }
            
            private Object handleCacheableMethod(Method method, Object[] args, Cacheable cacheable) 
                    throws Throwable {
                
                String cacheKey = generateCacheKey(method, args, cacheable.keyGenerator());
                CacheEntry entry = globalCache.get(cacheKey);
                
                // Check cache hit
                if (entry != null && !entry.isExpired(cacheable.ttlSeconds())) {
                    updateStatistics(targetClass, true);
                    return entry.getValue();
                }
                
                // Cache miss - invoke original method
                updateStatistics(targetClass, false);
                Object result = method.invoke(target, args);
                
                // Store in cache
                globalCache.put(cacheKey, new CacheEntry(result, Instant.now()));
                
                // Enforce cache size limits
                enforceCacheSizeLimit(cacheable.maxSize());
                
                return result;
            }
            
            private String generateCacheKey(Method method, Object[] args, String keyGenerator) {
                StringBuilder keyBuilder = new StringBuilder();
                keyBuilder.append(targetClass.getName())
                         .append(".")
                         .append(method.getName());
                
                if (args != null) {
                    for (Object arg : args) {
                        keyBuilder.append(":").append(arg != null ? arg.toString() : "null");
                    }
                }
                
                return keyBuilder.toString();
            }
            
            private void updateStatistics(Class<?> clazz, boolean hit) {
                CacheStatistics stats = cacheStats.get(clazz);
                if (stats != null) {
                    if (hit) {
                        stats.incrementHits();
                    } else {
                        stats.incrementMisses();
                    }
                }
            }
            
            private void enforceCacheSizeLimit(int maxSize) {
                if (globalCache.size() > maxSize) {
                    // Remove oldest entries (LRU eviction)
                    List<Map.Entry<String, CacheEntry>> entries = new ArrayList<>(globalCache.entrySet());
                    entries.sort(Map.Entry.comparingByValue(
                        (e1, e2) -> e1.getCreationTime().compareTo(e2.getCreationTime())
                    ));
                    
                    int toRemove = globalCache.size() - maxSize;
                    for (int i = 0; i < toRemove; i++) {
                        globalCache.remove(entries.get(i).getKey());
                    }
                }
            }
        }
    }
    
    // VIOLATION 4: WeakReference-Based Memory-Sensitive Caching
    public static class MemorySensitiveCacheManager {
        
        // CRITICAL: WeakReference cache that's harder to detect
        private static final Map<String, WeakReference<Object>> weakCache = new ConcurrentHashMap<>();
        private static final Map<String, SoftReference<Object>> softCache = new ConcurrentHashMap<>();
        private static final ReferenceQueue<Object> referenceQueue = new ReferenceQueue<>();
        
        // Cleanup thread for reference management
        private static final ScheduledExecutorService cleanupExecutor = 
            Executors.newScheduledThreadPool(1, r -> {
                Thread t = new Thread(r, "CacheCleanupThread");
                t.setDaemon(true);
                return t;
            });
        
        static {
            // CRITICAL: Background cleanup of cache entries
            cleanupExecutor.scheduleAtFixedRate(() -> {
                cleanupDeadReferences();
            }, 30, 30, TimeUnit.SECONDS);
        }
        
        public static void cacheWeakReference(String key, Object value) {
            WeakReference<Object> weakRef = new WeakReference<>(value, referenceQueue);
            weakCache.put(key, weakRef);
        }
        
        public static void cacheSoftReference(String key, Object value) {
            SoftReference<Object> softRef = new SoftReference<>(value, referenceQueue);
            softCache.put(key, softRef);
        }
        
        @SuppressWarnings("unchecked")
        public static <T> T getFromWeakCache(String key, Class<T> type) {
            WeakReference<Object> ref = weakCache.get(key);
            if (ref != null) {
                Object value = ref.get();
                if (value != null && type.isAssignableFrom(value.getClass())) {
                    return (T) value;
                }
                // Clean up dead reference
                weakCache.remove(key);
            }
            return null;
        }
        
        @SuppressWarnings("unchecked")
        public static <T> T getFromSoftCache(String key, Class<T> type) {
            SoftReference<Object> ref = softCache.get(key);
            if (ref != null) {
                Object value = ref.get();
                if (value != null && type.isAssignableFrom(value.getClass())) {
                    return (T) value;
                }
                // Clean up dead reference
                softCache.remove(key);
            }
            return null;
        }
        
        private static void cleanupDeadReferences() {
            Reference<? extends Object> deadRef;
            while ((deadRef = referenceQueue.poll()) != null) {
                // Remove dead references from caches
                weakCache.entrySet().removeIf(entry -> entry.getValue() == deadRef);
                softCache.entrySet().removeIf(entry -> entry.getValue() == deadRef);
            }
        }
    }
    
    // VIOLATION 5: Computation Cache with Memoization
    public static class ComputationCacheService {
        
        // CRITICAL: Function memoization cache
        private static final Map<String, Map<Object, Object>> functionCaches = new ConcurrentHashMap<>();
        private static final Map<String, Long> cacheAccessTimes = new ConcurrentHashMap<>();
        
        // CRITICAL: Generic memoization decorator
        public static <T, R> Function<T, R> memoize(String functionName, Function<T, R> function) {
            Map<Object, Object> cache = functionCaches.computeIfAbsent(
                functionName, 
                k -> new ConcurrentHashMap<>()
            );
            
            return input -> {
                // Check cache first
                @SuppressWarnings("unchecked")
                R cachedResult = (R) cache.get(input);
                
                if (cachedResult != null) {
                    cacheAccessTimes.put(functionName, System.currentTimeMillis());
                    return cachedResult;
                }
                
                // Compute and cache result
                R result = function.apply(input);
                cache.put(input, result);
                cacheAccessTimes.put(functionName, System.currentTimeMillis());
                
                return result;
            };
        }
        
        // CRITICAL: Expensive computations with automatic caching
        private static final Function<Integer, Long> fibonacci = memoize("fibonacci", n -> {
            if (n <= 1) return (long) n;
            return ComputationCacheService.fibonacci.apply(n - 1) + 
                   ComputationCacheService.fibonacci.apply(n - 2);
        });
        
        private static final Function<String, Integer> hashComputation = memoize("hashComputation", str -> {
            // Simulate expensive hash computation
            int hash = 0;
            for (char c : str.toCharArray()) {
                hash = 31 * hash + c;
                // Simulate CPU-intensive work
                for (int i = 0; i < 1000; i++) {
                    hash ^= (hash << 13) | (hash >>> 19);
                }
            }
            return hash;
        });
        
        public static long calculateFibonacci(int n) {
            return fibonacci.apply(n);
        }
        
        public static int computeExpensiveHash(String input) {
            return hashComputation.apply(input);
        }
        
        // CRITICAL: Cache statistics and management
        public static Map<String, Integer> getCacheSizes() {
            Map<String, Integer> sizes = new HashMap<>();
            functionCaches.forEach((name, cache) -> sizes.put(name, cache.size()));
            return sizes;
        }
        
        public static void clearCache(String functionName) {
            Map<Object, Object> cache = functionCaches.get(functionName);
            if (cache != null) {
                cache.clear();
            }
        }
        
        public static void clearAllCaches() {
            functionCaches.clear();
            cacheAccessTimes.clear();
        }
    }
}

// Supporting classes
class User {
    private final String id;
    private final String name;
    private final String email;
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    
    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "', email='" + email + "'}";
    }
}

class UserStatistics {
    private final String userId;
    private final int totalActions;
    private final int loginCount;
    private final Instant lastUpdated;
    
    public UserStatistics(String userId, int totalActions, int loginCount, Instant lastUpdated) {
        this.userId = userId;
        this.totalActions = totalActions;
        this.loginCount = loginCount;
        this.lastUpdated = lastUpdated;
    }
    
    public String getUserId() { return userId; }
    public int getTotalActions() { return totalActions; }
    public int getLoginCount() { return loginCount; }
    public Instant getLastUpdated() { return lastUpdated; }
}

class CacheEntry {
    private final Object value;
    private final Instant creationTime;
    private volatile Instant lastAccessTime;
    
    public CacheEntry(Object value, Instant creationTime) {
        this.value = value;
        this.creationTime = creationTime;
        this.lastAccessTime = creationTime;
    }
    
    public Object getValue() {
        lastAccessTime = Instant.now();
        return value;
    }
    
    public Instant getCreationTime() { return creationTime; }
    public Instant getLastAccessTime() { return lastAccessTime; }
    
    public boolean isExpired(int ttlSeconds) {
        return Duration.between(creationTime, Instant.now()).getSeconds() > ttlSeconds;
    }
}

class CacheStatistics {
    private volatile long hits = 0;
    private volatile long misses = 0;
    
    public void incrementHits() { hits++; }
    public void incrementMisses() { misses++; }
    
    public long getHits() { return hits; }
    public long getMisses() { return misses; }
    
    public double getHitRatio() {
        long total = hits + misses;
        return total > 0 ? (double) hits / total : 0.0;
    }
}