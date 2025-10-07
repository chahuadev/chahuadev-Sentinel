//======================================================================
// SEVERE NO_INTERNAL_CACHING VIOLATIONS - TypeScript  
// การซ่อนระบบแคชที่ซับซ้อนผ่าน Decorators และ Advanced Type Patterns
//======================================================================

// VIOLATION 1: Decorator-Based Caching System (Hidden in Metadata)
interface CacheOptions {
    ttl?: number;
    key?: string;
    namespace?: string;
}

// CRITICAL: Hidden caching through decorators - hard to detect
function Cache(options: CacheOptions = {}) {
    return function <T extends (...args: any[]) => any>(
        target: any,
        propertyName: string,
        descriptor: TypedPropertyDescriptor<T>
    ) {
        const originalMethod = descriptor.value!;
        const cacheKey = options.key || `${target.constructor.name}.${propertyName}`;
        
        descriptor.value = function (this: any, ...args: any[]) {
            // CRITICAL: Method results cached using internal Map
            const key = `${cacheKey}:${JSON.stringify(args)}`;
            
            if (CacheManager.has(key)) {
                console.log(`Cache hit for ${key}`);
                return CacheManager.get(key);
            }
            
            const result = originalMethod.apply(this, args);
            
            if (result instanceof Promise) {
                return result.then(value => {
                    CacheManager.set(key, value, options.ttl || 300000);
                    return value;
                });
            } else {
                CacheManager.set(key, result, options.ttl || 300000);
                return result;
            }
        } as T;
    };
}

// CRITICAL: Internal caching system disguised as utility
class CacheManager {
    private static cache = new Map<string, {value: any, expiry: number}>();
    private static stats = { hits: 0, misses: 0, size: 0 };
    
    static has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;
        
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return false;
        }
        
        this.stats.hits++;
        return true;
    }
    
    static get(key: string): any {
        return this.cache.get(key)?.value;
    }
    
    static set(key: string, value: any, ttl: number): void {
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttl
        });
        this.stats.size = this.cache.size;
    }
    
    static clear(): void {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0, size: 0 };
    }
    
    static getStats() {
        return { ...this.stats };
    }
}

// VIOLATION 2: Service Layer with Hidden Memoization
interface UserProfile {
    id: string;
    name: string;
    email: string;
    preferences: Record<string, any>;
}

interface DatabaseQuery {
    table: string;
    where?: Record<string, any>;
    orderBy?: string;
    limit?: number;
}

class UserService {
    // CRITICAL: Memoized results using WeakMap (harder to detect)
    private static queryCache = new WeakMap<object, Map<string, any>>();
    private static resultCache = new Map<string, {data: any, timestamp: number}>();
    
    // @Cache({ ttl: 600000, namespace: 'user' }) - CRITICAL: Decorator-based caching
    async getUserById(id: string): Promise<UserProfile | null> {
        // Method appears clean but @Cache decorator adds caching
        const query = { table: 'users', where: { id } };
        const result = await this.executeQuery(query);
        return result ? this.mapToUserProfile(result) : null;
    }
    
    // @Cache({ ttl: 300000, key: 'user_preferences' }) - CRITICAL: Preference caching
    async getUserPreferences(userId: string): Promise<Record<string, any>> {
        const query = { table: 'user_preferences', where: { user_id: userId } };
        const results = await this.executeQuery(query);
        return results.reduce((acc: any, row: any) => {
            acc[row.key] = row.value;
            return acc;
        }, {});
    }
    
    // CRITICAL: Manual caching disguised as optimization
    async searchUsers(criteria: Record<string, any>): Promise<UserProfile[]> {
        const cacheKey = `search:${JSON.stringify(criteria)}`;
        const cached = UserService.resultCache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < 180000) {
            console.log('Returning cached search results');
            return cached.data;
        }
        
        const query = { 
            table: 'users', 
            where: criteria,
            orderBy: 'created_at DESC',
            limit: 100
        };
        
        const results = await this.executeQuery(query);
        const users = results.map((row: any) => this.mapToUserProfile(row));
        
        // CRITICAL: Results stored in internal cache
        UserService.resultCache.set(cacheKey, {
            data: users,
            timestamp: Date.now()
        });
        
        return users;
    }
    
    // CRITICAL: Query-level caching using WeakMap
    private async executeQuery(query: DatabaseQuery): Promise<any[]> {
        let queryMap = UserService.queryCache.get(query);
        if (!queryMap) {
            queryMap = new Map();
            UserService.queryCache.set(query, queryMap);
        }
        
        const queryString = JSON.stringify(query);
        const cached = queryMap.get(queryString);
        
        if (cached) {
            console.log('Using cached query result');
            return cached;
        }
        
        // Simulate database query
        const result = await this.simulateDbQuery(query);
        queryMap.set(queryString, result);
        
        return result;
    }
    
    private async simulateDbQuery(query: DatabaseQuery): Promise<any[]> {
        // Simulate database response
        return [
            { id: '1', name: 'John Doe', email: 'john@example.com' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
        ];
    }
    
    private mapToUserProfile(row: any): UserProfile {
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            preferences: {}
        };
    }
}

// VIOLATION 3: Proxy-Based Automatic Caching
interface ApiEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    cacheable: boolean;
}

class ApiClient {
    private static responseCache = new Map<string, {
        response: any;
        timestamp: number;
        ttl: number;
    }>();
    
    // CRITICAL: Proxy automatically caches all GET requests
    static createCachingProxy<T extends object>(target: T): T {
        return new Proxy(target, {
            get(target: any, prop: string | symbol) {
                const originalMethod = target[prop];
                
                if (typeof originalMethod === 'function') {
                    return function (...args: any[]) {
                        // CRITICAL: Auto-cache based on method name pattern
                        if (prop.toString().startsWith('get') || prop.toString().includes('fetch')) {
                            const cacheKey = `${prop.toString()}:${JSON.stringify(args)}`;
                            const cached = ApiClient.responseCache.get(cacheKey);
                            
                            if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
                                return Promise.resolve(cached.response);
                            }
                            
                            const result = originalMethod.apply(target, args);
                            
                            if (result instanceof Promise) {
                                return result.then(response => {
                                    ApiClient.responseCache.set(cacheKey, {
                                        response,
                                        timestamp: Date.now(),
                                        ttl: 240000  // 4 minutes
                                    });
                                    return response;
                                });
                            }
                        }
                        
                        return originalMethod.apply(target, args);
                    };
                }
                
                return originalMethod;
            }
        });
    }
    
    constructor() {
        // CRITICAL: Return cached proxy instead of actual instance
        return ApiClient.createCachingProxy(this);
    }
    
    async getUser(id: string): Promise<UserProfile> {
        // This method will be automatically cached by proxy
        return { id, name: `User ${id}`, email: `user${id}@example.com`, preferences: {} };
    }
    
    async fetchUserList(page: number = 1): Promise<UserProfile[]> {
        // This method will be automatically cached by proxy
        return Array.from({ length: 10 }, (_, i) => ({
            id: String(page * 10 + i),
            name: `User ${page * 10 + i}`,
            email: `user${page * 10 + i}@example.com`,
            preferences: {}
        }));
    }
}

// VIOLATION 4: Generic Cache Provider with Type Safety
interface CacheProvider<K, V> {
    get(key: K): V | undefined;
    set(key: K, value: V, ttl?: number): void;
    delete(key: K): boolean;
    clear(): void;
    size(): number;
}

// CRITICAL: Hidden caching infrastructure disguised as generic utility
class TypedCacheProvider<K, V> implements CacheProvider<K, V> {
    private cache = new Map<K, {
        value: V;
        expiry?: number;
        accessCount: number;
        lastAccess: number;
    }>();
    
    private maxSize: number;
    private defaultTtl: number;
    
    constructor(maxSize: number = 1000, defaultTtl: number = 300000) {
        this.maxSize = maxSize;
        this.defaultTtl = defaultTtl;
    }
    
    get(key: K): V | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;
        
        if (entry.expiry && Date.now() > entry.expiry) {
            this.cache.delete(key);
            return undefined;
        }
        
        // CRITICAL: LRU statistics tracked internally
        entry.accessCount++;
        entry.lastAccess = Date.now();
        
        return entry.value;
    }
    
    set(key: K, value: V, ttl?: number): void {
        // CRITICAL: Automatic eviction based on size and access patterns
        if (this.cache.size >= this.maxSize) {
            this.evictLeastRecentlyUsed();
        }
        
        const expiry = ttl ? Date.now() + ttl : 
                      this.defaultTtl ? Date.now() + this.defaultTtl : undefined;
        
        this.cache.set(key, {
            value,
            expiry,
            accessCount: 1,
            lastAccess: Date.now()
        });
    }
    
    delete(key: K): boolean {
        return this.cache.delete(key);
    }
    
    clear(): void {
        this.cache.clear();
    }
    
    size(): number {
        return this.cache.size;
    }
    
    private evictLeastRecentlyUsed(): void {
        let lruKey: K | undefined;
        let oldestAccess = Date.now();
        
        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccess < oldestAccess) {
                oldestAccess = entry.lastAccess;
                lruKey = key;
            }
        }
        
        if (lruKey !== undefined) {
            this.cache.delete(lruKey);
        }
    }
}

// VIOLATION 5: Computed Property Caching with Getters/Setters
class DataProcessor {
    private _cache = new TypedCacheProvider<string, any>(500, 600000);
    private _rawData: any[] = [];
    
    // CRITICAL: Computed properties automatically cached via getters
    get processedData(): any[] {
        const cacheKey = 'processedData';
        let cached = this._cache.get(cacheKey);
        
        if (cached) {
            console.log('Using cached processed data');
            return cached;
        }
        
        // Expensive computation
        cached = this._rawData.map(item => ({
            ...item,
            processed: true,
            timestamp: Date.now(),
            hash: this.generateHash(item)
        }));
        
        this._cache.set(cacheKey, cached);
        return cached;
    }
    
    get aggregatedStats(): {count: number; sum: number; avg: number} {
        const cacheKey = 'aggregatedStats';
        let cached = this._cache.get(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        const values = this._rawData.map(item => item.value || 0);
        cached = {
            count: values.length,
            sum: values.reduce((a, b) => a + b, 0),
            avg: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
        };
        
        this._cache.set(cacheKey, cached);
        return cached;
    }
    
    addData(item: any): void {
        this._rawData.push(item);
        // CRITICAL: Selective cache invalidation - some entries remain stale
        this._cache.delete('processedData');
        // Note: aggregatedStats cache not invalidated - stale data!
    }
    
    clearData(): void {
        this._rawData = [];
        this._cache.clear();
    }
    
    private generateHash(item: any): string {
        return btoa(JSON.stringify(item)).slice(0, 8);
    }
}