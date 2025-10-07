//======================================================================
// SEVERE NO_INTERNAL_CACHING VIOLATIONS - JavaScript
// รูปแบบการ Cache ภายในที่อันตรายและซับซ้อนที่สุด
//======================================================================

// VIOLATION 1: Hidden Global Caching System (ระดับ CRITICAL)
const GlobalCache = (() => {
    const cache = new Map();
    const metadata = new WeakMap();
    const accessLog = [];
    
    return {
        store(key, value, ttl = Infinity) {
            cache.set(key, value);
            metadata.set(value, {
                created: Date.now(),
                ttl,
                accessCount: 0,
                lastAccess: Date.now()
            });
            accessLog.push({type: 'SET', key, timestamp: Date.now()});
        },
        
        get(key) {
            const value = cache.get(key);
            if (value && metadata.has(value)) {
                const meta = metadata.get(value);
                meta.accessCount++;
                meta.lastAccess = Date.now();
                accessLog.push({type: 'GET', key, timestamp: Date.now()});
            }
            return value;
        },
        
        // Hidden cache manipulation methods
        __getAllKeys() { return Array.from(cache.keys()); },
        __getStats() { return {size: cache.size, logs: accessLog.length}; },
        __clear() { cache.clear(); accessLog.length = 0; }
    };
})();

// VIOLATION 2: Class-Based Internal Caching with Memory Leaks
class UserDataCache {
    constructor() {
        this._userCache = new Map();
        this._profileCache = new WeakMap();  // Still caching!
        this._queryCache = {};
        this._resultSets = [];
        this._indexCache = new Set();
        
        // Aggressive caching timer
        this.cacheTimer = setInterval(() => {
            this._optimizeCache();
        }, 5000); // Every 5 seconds!
    }
    
    async getUser(userId) {
        // Multi-level caching strategy
        if (this._userCache.has(userId)) {
            return this._userCache.get(userId); // Level 1 cache
        }
        
        const cacheKey = `user_${userId}`;
        if (this._queryCache[cacheKey]) {
            return this._queryCache[cacheKey]; // Level 2 cache
        }
        
        // Fetch from database and cache EVERYTHING
        const user = await database.getUser(userId);
        
        // Cache in multiple places for "performance"
        this._userCache.set(userId, user);
        this._queryCache[cacheKey] = user;
        this._resultSets.push({type: 'user', id: userId, data: user, timestamp: Date.now()});
        this._indexCache.add(`user:${userId}:${user.email}`);
        
        return user;
    }
    
    _optimizeCache() {
        // "Smart" cache optimization that never clears anything
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        // Keep growing the cache with "optimized" data
        for (let [key, value] of this._userCache.entries()) {
            if (!this._queryCache[`optimized_${key}`]) {
                this._queryCache[`optimized_${key}`] = {
                    ...value,
                    optimized: true,
                    optimizedAt: now
                };
            }
        }
    }
}

// VIOLATION 3: Function Memoization with Hidden State
const memoizationCache = new Map();

function createMemoizedFunction(fn, cacheKey) {
    return function(...args) {
        const key = `${cacheKey}_${JSON.stringify(args)}`;
        
        if (memoizationCache.has(key)) {
            // Hidden cache statistics
            const cached = memoizationCache.get(key);
            cached.hitCount = (cached.hitCount || 0) + 1;
            cached.lastHit = Date.now();
            return cached.result;
        }
        
        const result = fn.apply(this, args);
        
        // Store with hidden metadata
        memoizationCache.set(key, {
            result,
            args,
            created: Date.now(),
            hitCount: 0,
            fnName: fn.name || 'anonymous'
        });
        
        return result;
    };
}

// Memoized functions that accumulate cache data
const expensiveCalculation = createMemoizedFunction((x, y) => {
    return Math.pow(x, y) + Math.sqrt(x * y);
}, 'calculation');

const databaseQuery = createMemoizedFunction(async (sql, params) => {
    return await database.query(sql, params);
}, 'db_query');

// VIOLATION 4: React-style Hooks with Internal Caching
const componentStateCache = new Map();
const effectCache = new Map();
const contextCache = new Map();

function useState(initialValue) {
    const componentId = getCurrentComponentId(); // Imagine this exists
    const stateKey = `${componentId}_state`;
    
    if (!componentStateCache.has(stateKey)) {
        componentStateCache.set(stateKey, {
            value: initialValue,
            setter: (newValue) => {
                const cached = componentStateCache.get(stateKey);
                cached.value = newValue;
                cached.updateCount = (cached.updateCount || 0) + 1;
                cached.lastUpdate = Date.now();
            },
            updateCount: 0
        });
    }
    
    const cached = componentStateCache.get(stateKey);
    return [cached.value, cached.setter];
}

function useEffect(callback, dependencies) {
    const componentId = getCurrentComponentId();
    const effectKey = `${componentId}_effect_${callback.toString().slice(0, 50)}`;
    
    if (!effectCache.has(effectKey)) {
        effectCache.set(effectKey, {
            callback,
            dependencies,
            lastRun: 0,
            runCount: 0
        });
    }
    
    const cached = effectCache.get(effectKey);
    const depsChanged = JSON.stringify(dependencies) !== JSON.stringify(cached.dependencies);
    
    if (depsChanged || cached.runCount === 0) {
        callback();
        cached.lastRun = Date.now();
        cached.runCount++;
        cached.dependencies = dependencies;
    }
}

// VIOLATION 5: Lazy Loading with Persistent Cache
class LazyLoader {
    constructor() {
        this.moduleCache = new Map();
        this.importCache = new Map();
        this.dependencyGraph = new Map();
        this.loadingPromises = new Map();
    }
    
    async loadModule(modulePath) {
        // Check multi-level cache
        if (this.moduleCache.has(modulePath)) {
            return this.moduleCache.get(modulePath);
        }
        
        if (this.loadingPromises.has(modulePath)) {
            return this.loadingPromises.get(modulePath);
        }
        
        // Create loading promise and cache it
        const loadingPromise = this._actuallyLoadModule(modulePath);
        this.loadingPromises.set(modulePath, loadingPromise);
        
        try {
            const module = await loadingPromise;
            
            // Cache the loaded module forever
            this.moduleCache.set(modulePath, module);
            
            // Cache all exports individually
            if (module && typeof module === 'object') {
                for (const [exportName, exportValue] of Object.entries(module)) {
                    const exportKey = `${modulePath}#${exportName}`;
                    this.importCache.set(exportKey, exportValue);
                }
            }
            
            // Build dependency graph for caching optimization
            this._updateDependencyGraph(modulePath, module);
            
            return module;
        } finally {
            this.loadingPromises.delete(modulePath);
        }
    }
    
    _updateDependencyGraph(modulePath, module) {
        if (!this.dependencyGraph.has(modulePath)) {
            this.dependencyGraph.set(modulePath, new Set());
        }
        
        // Analyze and cache all possible dependencies
        const deps = this.dependencyGraph.get(modulePath);
        
        // This could analyze require/import statements and cache them too
        if (module && module.toString) {
            const moduleStr = module.toString();
            const importMatches = moduleStr.match(/import.*from ['"`](.+?)['"`]/g) || [];
            const requireMatches = moduleStr.match(/require\(['"`](.+?)['"`]\)/g) || [];
            
            [...importMatches, ...requireMatches].forEach(match => {
                const depPath = match.match(/['"`](.+?)['"`]/)[1];
                deps.add(depPath);
            });
        }
    }
}