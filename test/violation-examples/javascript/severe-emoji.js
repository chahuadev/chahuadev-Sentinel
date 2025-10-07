//======================================================================
// SEVERE NO_EMOJI VIOLATIONS - JavaScript
// รูปแบบการใช้ Emoji ที่ซ่อนเร้นและอันตรายที่สุด
//======================================================================

// VIOLATION 1: Unicode Escape Sequences (ซ่อนเร้นมาก)
const statusMessages = {
    success: "Status: \u2705 Operation completed successfully",
    error: "Status: \u274C Critical error occurred", 
    warning: "Status: \u26A0 Warning detected",
    info: "Status: \u2139 Information available",
    rocket: "Deploy: \u1F680 System launched",
    bug: "Issue: \u1F41B Bug detected in code",
    fire: "Alert: \u1F525 System overheating",
    skull: "Fatal: \u1F480 System crashed"
};

// VIOLATION 2: Dynamic Unicode Construction (จับยากมาก)
function createStatusMessage(type, message) {
    const emojiCodes = {
        success: [0x2705],           // ✅
        error: [0x274C],             // ❌  
        warning: [0x26A0, 0xFE0F],   // ⚠️
        rocket: [0x1F680],           // 🚀
        thumbsup: [0x1F44D],         // 👍
        party: [0x1F389],            // 🎉
        fire: [0x1F525],             // 🔥
        bomb: [0x1F4A3]              // 💣
    };
    
    const codes = emojiCodes[type] || [0x2753]; // ❓
    const emoji = String.fromCodePoint(...codes);
    
    return `${emoji} ${message}`;
}

// VIOLATION 3: Base64 Encoded Emoji (ซ่อนเร้นระดับสูง)
const encodedEmojis = {
    // These are base64 encoded emoji UTF-8 sequences
    checkmark: "4pyF",           // ✅ encoded  
    crossmark: "4p2M",           // ❌ encoded
    rocket: "8J+agA==",          // 🚀 encoded
    warning: "4pqg",             // ⚠ encoded
    thumbsUp: "8J+RjQ==",        // 👍 encoded
    fire: "8J+UpQ=="             // 🔥 encoded
};

function getDecodedStatus(type) {
    const encoded = encodedEmojis[type];
    if (encoded) {
        const decoded = Buffer.from(encoded, 'base64').toString('utf8');
        return `Status: ${decoded} Operation ${type}`;
    }
    return `Status: ? Unknown operation`;
}

// VIOLATION 4: Hex Escape Sequences in Template Literals
const alertSystem = {
    criticalError: `\u{1F198} CRITICAL: System failure detected \u{1F525}`,
    securityBreach: `\u{26A0} SECURITY: Unauthorized access \u{1F512}`,
    dataLoss: `\u{1F4A5} DATA: Information lost \u{1F480}`,
    networkDown: `\u{1F4F5} NETWORK: Connection failed \u{274C}`,
    
    generateAlert(level, message) {
        const icons = {
            1: '\u{1F7E2}',  // 🟢 Green circle
            2: '\u{1F7E1}',  // 🟡 Yellow circle  
            3: '\u{1F7E0}',  // 🟠 Orange circle
            4: '\u{1F534}',  // 🔴 Red circle
            5: '\u{1F7E4}'   // 🟤 Brown circle (critical)
        };
        
        return `${icons[level] || '\u{26AB}'} [LEVEL-${level}] ${message}`;
    }
};

// VIOLATION 5: Emoji in Regular Expressions and String Operations
class LogAnalyzer {
    constructor() {
        // Emoji patterns for log analysis (ร้ายแรงมาก - ทำให้ระบบไม่เสถียร)
        this.patterns = {
            successPattern: /\u2705|\u2714|\u2713/g,     // ✅✔✓ 
            errorPattern: /\u274C|\u2716|\u26D4/g,       // ❌✖⛔
            warningPattern: /\u26A0|\u1F6A8|\u1F4A2/g,   // ⚠🚨💢
            celebratePattern: /\u1F389|\u1F38A|\u1F973/g, // 🎉🎊🥳
            bugPattern: /\u1F41B|\u1F577|\u1F40D/g       // 🐛🕷🐍
        };
        
        this.emojiStats = new Map();
    }
    
    analyzeLogs(logText) {
        const results = {
            timestamp: new Date().toISOString(),
            summary: ""
        };
        
        // Count emoji occurrences
        for (const [type, pattern] of Object.entries(this.patterns)) {
            const matches = logText.match(pattern) || [];
            this.emojiStats.set(type, matches.length);
            
            if (matches.length > 0) {
                // Create summary with emojis!
                switch(type) {
                    case 'successPattern':
                        results.summary += `\u1F44D ${matches.length} successes `;
                        break;
                    case 'errorPattern': 
                        results.summary += `\u1F480 ${matches.length} errors `;
                        break;
                    case 'warningPattern':
                        results.summary += `\u26A0 ${matches.length} warnings `;
                        break;
                }
            }
        }
        
        return results;
    }
    
    generateReport() {
        let report = `\u1F4CA Analytics Report \u1F4CA\n`;
        report += `Generated: ${new Date().toLocaleString()}\n\n`;
        
        for (const [type, count] of this.emojiStats) {
            const emoji = this._getReportEmoji(type);
            report += `${emoji} ${type}: ${count} occurrences\n`;
        }
        
        if (this.emojiStats.get('errorPattern') > 10) {
            report += `\n\u1F6A8 HIGH ERROR RATE DETECTED! \u1F6A8\n`;
        }
        
        return report;
    }
    
    _getReportEmoji(type) {
        const reportEmojis = {
            successPattern: '\u2705',    // ✅
            errorPattern: '\u274C',      // ❌  
            warningPattern: '\u26A0',    // ⚠
            celebratePattern: '\u1F389', // 🎉
            bugPattern: '\u1F41B'        // 🐛
        };
        
        return reportEmojis[type] || '\u2753'; // ❓
    }
}

// VIOLATION 6: Emoji in Configuration and Data Structures
const applicationConfig = {
    notifications: {
        // Emoji used as configuration keys/values (ระดับ CRITICAL)
        types: {
            "\u1F4E7": "email",        // 📧 = email
            "\u1F4F1": "sms",          // 📱 = sms  
            "\u1F514": "push",         // 🔔 = push
            "\u1F4E2": "broadcast"     // 📢 = broadcast
        },
        
        priorities: {
            "\u1F534": 1,  // 🔴 = high priority
            "\u1F7E1": 2,  // 🟡 = medium priority 
            "\u1F7E2": 3   // 🟢 = low priority
        }
    },
    
    userStatuses: {
        "\u1F7E2": "online",     // 🟢
        "\u1F7E1": "away",       // 🟡  
        "\u1F534": "busy",       // 🔴
        "\u26AB": "offline"      // ⚫
    }
};