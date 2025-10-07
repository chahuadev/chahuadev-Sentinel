//======================================================================
// SEVERE NO_MOCKING VIOLATIONS - TypeScript
// การ Mock ที่ซับซ้อนและอันตรายผ่าน Type System
//======================================================================

// Mock library types (CRITICAL violations - would import jest/sinon)
declare const jest: any;
declare const sinon: any;

// VIOLATION 1: Type-Safe Mocking with Generic Constraints
interface DatabaseConnection<T> {
    query<R>(sql: string, params?: T[]): Promise<R[]>;
    transaction<R>(callback: (trx: DatabaseConnection<T>) => Promise<R>): Promise<R>;
}

class MockDatabaseConnection<T = any> implements DatabaseConnection<T> {
    private queryLog: Array<{sql: string, params: T[], timestamp: number}> = [];
    private mockResults = new Map<string, any>();
    
    async query<R>(sql: string, params: T[] = []): Promise<R[]> {
        // Log all queries for "testing analysis"
        this.queryLog.push({sql, params, timestamp: Date.now()});
        
        // Return predetermined mock results
        const mockKey = this.generateMockKey(sql, params);
        if (this.mockResults.has(mockKey)) {
            return this.mockResults.get(mockKey);
        }
        
        // Generate fake data based on SQL pattern
        if (sql.toLowerCase().includes('select')) {
            return [{id: 1, mocked: true} as R];
        }
        
        return [] as R[];
    }
    
    async transaction<R>(callback: (trx: DatabaseConnection<T>) => Promise<R>): Promise<R> {
        // Mock transaction - no actual rollback capability!
        const mockTrx = new MockDatabaseConnection<T>();
        return callback(mockTrx);
    }
    
    // Hidden mock manipulation methods
    setMockResult(sql: string, params: T[], result: any): void {
        const key = this.generateMockKey(sql, params);
        this.mockResults.set(key, result);
    }
    
    getMockHistory(): Array<{sql: string, params: T[], timestamp: number}> {
        return this.queryLog;
    }
    
    private generateMockKey(sql: string, params: T[]): string {
        return `${sql}_${JSON.stringify(params)}`;
    }
}

// VIOLATION 2: Advanced Decorator-Based Mocking
type MockedFunction<T extends (...args: any[]) => any> = T & {
    mockImplementation: (fn: T) => void;
    mockReturnValue: (value: ReturnType<T>) => void;
    mockResolvedValue: (value: Awaited<ReturnType<T>>) => void;
    mockCalls: Parameters<T>[];
    mockResults: ReturnType<T>[];
};

function MockMethod<T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
) {
    const originalMethod = descriptor.value!;
    const mockData = {
        calls: [] as Parameters<T>[],
        results: [] as ReturnType<T>[],
        implementation: null as T | null
    };
    
    descriptor.value = ((...args: Parameters<T>) => {
        mockData.calls.push(args);
        
        if (mockData.implementation) {
            const result = mockData.implementation(...args);
            mockData.results.push(result);
            return result;
        }
        
        // Default mock behavior
        const result = `MOCKED_${propertyKey}_${Date.now()}` as ReturnType<T>;
        mockData.results.push(result);
        return result;
    }) as T;
    
    // Attach mock control methods
    Object.assign(descriptor.value, {
        mockImplementation: (fn: T) => { mockData.implementation = fn; },
        mockReturnValue: (value: ReturnType<T>) => {
            mockData.implementation = (() => value) as T;
        },
        mockCalls: mockData.calls,
        mockResults: mockData.results
    });
}

// VIOLATION 3: Sophisticated Service Mocking with Dependency Injection
interface UserService {
    getUser(id: string): Promise<User>;
    createUser(data: CreateUserRequest): Promise<User>;
    deleteUser(id: string): Promise<void>;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface CreateUserRequest {
    name: string;
    email: string;
}

class MockUserService {
    private users = new Map<string, User>();
    private callHistory: Array<{method: string, args: any[], timestamp: number}> = [];
    
    // @MockMethod - CRITICAL: Mocking decorator pattern
    async getUser(id: string): Promise<User> {
        this.logCall('getUser', [id]);
        
        if (this.users.has(id)) {
            return this.users.get(id)!;
        }
        
        // Generate fake user data
        return {
            id,
            name: `Mock User ${id}`,
            email: `mock${id}@example.com`
        };
    }
    
    // @MockMethod - CRITICAL: Create user mocking  
    async createUser(data: CreateUserRequest): Promise<User> {
        this.logCall('createUser', [data]);
        
        const user: User = {
            id: `mock_${Date.now()}`,
            name: data.name,
            email: data.email
        };
        
        this.users.set(user.id, user);
        return user;
    }
    
    // @MockMethod - CRITICAL: Delete user mocking
    async deleteUser(id: string): Promise<void> {
        this.logCall('deleteUser', [id]);
        this.users.delete(id);
    }
    
    private logCall(method: string, args: any[]): void {
        this.callHistory.push({method, args, timestamp: Date.now()});
    }
    
    // Mock introspection methods
    getCallHistory(): Array<{method: string, args: any[], timestamp: number}> {
        return this.callHistory;
    }
    
    getAllMockUsers(): User[] {
        return Array.from(this.users.values());
    }
}

// VIOLATION 4: Complex Generic Mock Factory
class MockFactory {
    private static instances = new Map<string, any>();
    
    static createMock<T>(
        name: string,
        methods: (keyof T)[],
        mockBehaviors?: Partial<Record<keyof T, (...args: any[]) => any>>
    ): T {
        if (this.instances.has(name)) {
            return this.instances.get(name);
        }
        
        const mock = {} as T;
        
        for (const method of methods) {
            const methodName = String(method);
            
            if (mockBehaviors && mockBehaviors[method]) {
                mock[method] = mockBehaviors[method] as any;
            } else {
                // Generate default mock implementation
                mock[method] = jest.fn().mockImplementation((...args: any[]) => {
                    console.log(`Mock ${name}.${methodName} called with:`, args);
                    
                    // Return type-appropriate mock data
                    if (methodName.startsWith('get')) return {};
                    if (methodName.startsWith('create')) return {id: `mock_${Date.now()}`};
                    if (methodName.startsWith('delete')) return true;
                    if (methodName.startsWith('update')) return true;
                    
                    return null;
                }) as any;
            }
        }
        
        this.instances.set(name, mock);
        return mock;
    }
    
    static getMockInstance<T>(name: string): T | undefined {
        return this.instances.get(name);
    }
    
    static clearAllMocks(): void {
        this.instances.clear();
    }
}

// VIOLATION 5: Sinon Stub Factory with Type Safety
class TypedSinonFactory {
    private stubs = new Map<string, any>();
    
    createStub<T extends Record<string, any>, K extends keyof T>(
        object: T,
        method: K,
        implementation?: T[K]
    ): any {
        const stubKey = `${(object as any).constructor.name}.${String(method)}`;
        
        if (this.stubs.has(stubKey)) {
            return this.stubs.get(stubKey)!;
        }
        
        const stub = sinon.stub(object, method as any);
        
        if (implementation) {
            stub.callsFake(implementation as any);
        } else {
            // Generate default stub behavior based on method name
            const methodName = String(method);
            if (methodName.startsWith('get')) {
                stub.resolves({});
            } else if (methodName.startsWith('create') || methodName.startsWith('update')) {
                stub.resolves({success: true, id: `stub_${Date.now()}`});
            } else if (methodName.startsWith('delete')) {
                stub.resolves(true);
            }
        }
        
        this.stubs.set(stubKey, stub);
        return stub;
    }
    
    restoreAll(): void {
        for (const stub of this.stubs.values()) {
            stub.restore();
        }
        this.stubs.clear();
    }
    
    getStubCallHistory(): Record<string, any[]> {
        const history: Record<string, any[]> = {};
        
        for (const [key, stub] of this.stubs) {
            history[key] = stub.getCalls().map((call: any) => call.args);
        }
        
        return history;
    }
}