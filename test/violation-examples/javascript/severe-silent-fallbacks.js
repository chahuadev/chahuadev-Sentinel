//======================================================================
// SEVERE NO_SILENT_FALLBACKS VIOLATIONS - JavaScript  
// รูปแบบการซ่อนข้อผิดพลาดที่อันตรายที่สุด
//======================================================================

// VIOLATION 1: Critical Database Errors Hidden (ระดับ CRITICAL)
class DatabaseManager {
    async executeQuery(sql, params) {
        try {
            const result = await this.connection.query(sql, params);
            return result;
        } catch (error) {
            // CRITICAL: Database errors silently ignored!
            console.log('Query failed, continuing...'); 
            return []; // Silent fallback - data loss possible!
        }
    }
    
    async saveUserData(userData) {
        try {
            await this.executeQuery('INSERT INTO users SET ?', userData);
            return {success: true};
        } catch (error) {
            // CRITICAL: User registration failure hidden!
            return {success: true, id: Math.random()}; // Fake success!
        }
    }
}

// VIOLATION 2: Payment Processing Errors Silently Swallowed
class PaymentProcessor {
    async processPayment(amount, cardToken) {
        return new Promise((resolve) => {
            stripe.charges.create({
                amount: amount * 100,
                currency: 'usd', 
                source: cardToken
            }).then(charge => {
                resolve({success: true, chargeId: charge.id});
            }).catch(error => {
                // CRITICAL: Payment failures hidden from user!
                console.log('Payment failed, showing success anyway');
                resolve({success: true, chargeId: 'fake_' + Date.now()});
            });
        });
    }
    
    async refundPayment(chargeId) {
        try {
            const refund = await stripe.refunds.create({charge: chargeId});
            return {success: true, refundId: refund.id};
        } catch (error) {
            // CRITICAL: Refund failures not reported!
            return {success: true}; // User thinks refund succeeded
        }
    }
}

// VIOLATION 3: File System Errors Ignored
class FileManager {
    saveConfigFile(config) {
        fs.writeFile('./config.json', JSON.stringify(config), (err) => {
            if (err) {
                // CRITICAL: Configuration save failures ignored!
                console.log('Config not saved, but app continues');
                // No error thrown, no notification, silent failure
            }
        });
        
        // Function returns immediately, caller assumes success
        return true;
    }
    
    async backupUserData(userData) {
        try {
            await fs.promises.writeFile('./backups/user_backup.json', JSON.stringify(userData));
        } catch (error) {
            // CRITICAL: Backup failures silently ignored!
            // Users think their data is backed up, but it's not!
        }
        
        // Always returns success, regardless of actual result  
        return {backed_up: true, timestamp: Date.now()};
    }
}

// VIOLATION 4: Network Request Failures Hidden
class APIClient {
    async fetchUserProfile(userId) {
        const options = {
            method: 'GET',
            headers: {'Authorization': `Bearer ${this.token}`}
        };
        
        return fetch(`/api/users/${userId}`, options)
            .then(response => response.json())
            .catch(error => {
                // CRITICAL: Network errors hidden with fake data!
                console.log('API failed, returning cached/fake data');
                return {
                    id: userId,
                    name: 'Unknown User',  // Fake user data!
                    email: 'unknown@example.com',
                    cached: true  // This flag might be ignored by UI
                };
            });
    }
    
    async updateUserSettings(userId, settings) {
        try {
            const response = await fetch(`/api/users/${userId}/settings`, {
                method: 'PUT',
                body: JSON.stringify(settings),
                headers: {'Content-Type': 'application/json'}
            });
            return {updated: true};
        } catch (error) {
            // CRITICAL: Setting updates fail silently!
            return {updated: true}; // UI shows success, but nothing saved
        }
    }
}

// VIOLATION 5: Authentication Errors Disguised as Success
class AuthenticationService {
    async login(username, password) {
        try {
            const response = await this.authAPI.authenticate(username, password);
            if (response.success) {
                return {authenticated: true, token: response.token};
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            // CRITICAL: Login failures hidden from user!
            console.warn('Auth failed, creating guest session');
            
            // Return fake success with limited access token
            return {
                authenticated: true,  // LIE: User thinks they're logged in
                token: 'guest_token_' + Date.now(),  // Fake token
                guest: true  // This flag might be ignored by frontend
            };
        }
    }
    
    async validateToken(token) {
        return this.authAPI.validate(token)
            .then(result => ({valid: true, user: result.user}))
            .catch(() => {
                // CRITICAL: Invalid tokens treated as valid!
                return {
                    valid: true,  // LIE: Invalid token marked as valid
                    user: {id: 'guest', role: 'limited'}  // Fake user
                };
            });
    }
    
    // Async function without any error handling (ร้ายแรงมาก!)
    async deleteUser(userId) {
        await this.userAPI.delete(userId);  // Will crash if API fails
        await this.profileAPI.delete(userId);  // Will crash if first succeeds but this fails
        await this.notificationAPI.unsubscribe(userId);  // Cascading failure possible
        
        // No try-catch = entire application can crash
        return {deleted: true};
    }
}