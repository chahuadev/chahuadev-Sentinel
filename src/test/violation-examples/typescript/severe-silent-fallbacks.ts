//======================================================================
// SEVERE NO_SILENT_FALLBACKS VIOLATIONS - TypeScript
// การซ่อนข้อผิดพลาดที่ซับซ้อนผ่าน Type Safety และ Promise Handling
//======================================================================

// Mock fetch API for TypeScript
declare const fetch: (url: string, options?: any) => Promise<any>;

// VIOLATION 1: Type-Safe Silent Fallbacks with Generic Error Handling
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

class ApiService {
    async fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            // CRITICAL: Network errors hidden with fake success response
            console.log('API call failed, returning fake success');
            return { 
                success: true,  // LIE: Error disguised as success
                data: {} as T   // Type assertion hides the lie
            };
        }
    }
    
    async updateUserProfile<T extends {id: string}>(user: T): Promise<boolean> {
        return this.fetchData(`/api/users/${user.id}`)
            .then(response => response.success)
            .catch(() => {
                // CRITICAL: Update failures always return true
                return true;  // User thinks update succeeded
            });
    }
}

// VIOLATION 2: Complex Promise Chain Silent Failures
interface DatabaseResult<T> {
    rows: T[];
    count: number;
}

interface User {
    id: string;
    name: string;
    email: string;
}

class DatabaseService {
    async getUsersWithFallback(): Promise<DatabaseResult<User>> {
        return this.connectToDatabase()
            .then(db => db.query('SELECT * FROM users'))
            .then(result => ({ rows: result, count: result.length }))
            .catch(connectionError => {
                // CRITICAL: Database connection failures hidden
                console.warn('DB connection failed, using cache');
                return this.getCachedUsers();  // Might return stale data
            })
            .catch(cacheError => {
                // CRITICAL: Cache failures also hidden  
                console.warn('Cache failed, generating fake data');
                return {
                    rows: [
                        { id: 'fake1', name: 'Fake User 1', email: 'fake1@example.com' },
                        { id: 'fake2', name: 'Fake User 2', email: 'fake2@example.com' }
                    ],
                    count: 2
                };
            });
    }
    
    async saveUser(user: User): Promise<{saved: boolean, id: string}> {
        try {
            const db = await this.connectToDatabase();
            const result = await db.insert('users', user);
            return { saved: true, id: result.insertId };
        } catch (error) {
            // CRITICAL: Save failures disguised as success with fake ID
            return { saved: true, id: `fake_${Date.now()}` };
        }
    }
    
    private async connectToDatabase(): Promise<any> {
        throw new Error('Database connection simulation');
    }
    
    private async getCachedUsers(): Promise<DatabaseResult<User>> {
        throw new Error('Cache connection simulation');
    }
}

// VIOLATION 3: Async/Await Silent Error Suppression
class PaymentProcessor {
    async processPayment(amount: number, cardToken: string): Promise<{success: boolean, transactionId: string}> {
        // CRITICAL: No try-catch in async function - can crash entire app
        const validation = await this.validateCard(cardToken);  // Can throw
        const charge = await this.createCharge(amount, cardToken);  // Can throw  
        const notification = await this.sendNotification(charge.id);  // Can throw
        
        return { success: true, transactionId: charge.id };
    }
    
    async processRefund(transactionId: string): Promise<boolean> {
        try {
            await this.validateTransaction(transactionId);
            await this.initiateRefund(transactionId);
            await this.updateRecords(transactionId);
            return true;
        } catch (error) {
            // CRITICAL: Refund failures hidden from caller
            console.error('Refund failed but returning success');
            return true;  // Caller thinks refund succeeded
        }
    }
    
    private async validateCard(token: string): Promise<boolean> {
        throw new Error('Card validation simulation');
    }
    
    private async createCharge(amount: number, token: string): Promise<{id: string}> {
        throw new Error('Charge creation simulation');
    }
    
    private async sendNotification(chargeId: string): Promise<void> {
        throw new Error('Notification simulation');
    }
    
    private async validateTransaction(id: string): Promise<boolean> {
        throw new Error('Transaction validation simulation');
    }
    
    private async initiateRefund(id: string): Promise<void> {
        throw new Error('Refund initiation simulation');
    }
    
    private async updateRecords(id: string): Promise<void> {
        throw new Error('Record update simulation');
    }
}

// VIOLATION 4: Optional Chaining Silent Fallbacks
interface NestedConfig {
    database?: {
        connection?: {
            host?: string;
            port?: number;
            credentials?: {
                username?: string;
                password?: string;
            };
        };
    };
    api?: {
        endpoints?: {
            primary?: string;
            backup?: string[];
        };
        auth?: {
            key?: string;
            secret?: string;
        };
    };
}

class ConfigurationManager {
    constructor(private config: NestedConfig) {}
    
    getDatabaseConnection(): string {
        // CRITICAL: Optional chaining hides missing configuration
        const host = this.config.database?.connection?.host ?? 'localhost';
        const port = this.config.database?.connection?.port ?? 5432;
        const username = this.config.database?.connection?.credentials?.username ?? 'admin';
        const password = this.config.database?.connection?.credentials?.password ?? 'password';
        
        // Silent fallbacks might connect to wrong database!
        return `postgresql://${username}:${password}@${host}:${port}/defaultdb`;
    }
    
    getApiEndpoint(): string {
        // CRITICAL: Missing endpoint configuration silently ignored
        const primary = this.config.api?.endpoints?.primary;
        const backup = this.config.api?.endpoints?.backup?.[0];
        
        // Returns localhost if production config is missing!
        return primary ?? backup ?? 'http://localhost:3000';
    }
    
    getAuthCredentials(): {key: string, secret: string} {
        // CRITICAL: Missing auth credentials get default values
        return {
            key: this.config.api?.auth?.key ?? 'default_key',
            secret: this.config.api?.auth?.secret ?? 'default_secret'
        };
    }
}

// VIOLATION 5: Union Type Silent Fallback Pattern
type OperationResult<T> = 
    | { success: true; data: T }
    | { success: false; error: string }
    | { success: true; data: null; fallback: true };  // Hidden fallback type

class BusinessLogicService {
    async performCriticalOperation<T>(operation: () => Promise<T>): Promise<OperationResult<T>> {
        try {
            const data = await operation();
            return { success: true, data };
        } catch (error) {
            // CRITICAL: Critical operation failures disguised as success with null data
            console.error('Critical operation failed, returning fallback success');
            return { 
                success: true,    // LIE: Operation failed but marked as success
                data: null as T,  // Type assertion hides null data
                fallback: true    // Hidden flag that caller might ignore
            };
        }
    }
    
    async batchProcess<T>(items: T[], processor: (item: T) => Promise<void>): Promise<{processed: number, failed: number}> {
        let processed = 0;
        let failed = 0;
        
        for (const item of items) {
            try {
                await processor(item);
                processed++;
            } catch (error) {
                // CRITICAL: Individual failures silently ignored
                console.log(`Item ${JSON.stringify(item)} failed, continuing batch`);
                failed++;
                // Continue processing without notifying about partial failures
            }
        }
        
        // CRITICAL: Returns success even if all items failed
        return { processed, failed };
    }
    
    // Function with destructured parameters that can silently fail
    async processUserAction({
        userId,
        action,
        data
    }: {
        userId?: string;
        action?: string; 
        data?: any;
    } = {}): Promise<boolean> {
        // CRITICAL: Missing required parameters silently ignored
        if (!userId || !action) {
            console.warn('Missing parameters, skipping action');
            return true;  // Returns success for invalid input!
        }
        
        try {
            // Process the action
            await this.executeAction(userId, action, data);
            return true;
        } catch (error) {
            // CRITICAL: Action execution failures hidden
            return true;  // Always returns success
        }
    }
    
    private async executeAction(userId: string, action: string, data: any): Promise<void> {
        throw new Error('Action execution simulation');
    }
}