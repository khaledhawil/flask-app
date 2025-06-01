/**
 * System Test Script for Islamic App User Data Features
 * Tests all components of the user data sync system
 */

class SystemTester {
    constructor() {
        this.results = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    // Test individual components
    async runAllTests() {
        console.log('🚀 Starting Islamic App System Tests...\n');

        // Test basic environment
        await this.testEnvironment();
        
        // Test user authentication
        await this.testUserAuth();
        
        // Test user data sync
        await this.testUserDataSync();
        
        // Test data migration
        await this.testDataMigration();
        
        // Test prayer notifications
        await this.testPrayerNotifications();
        
        // Test achievement system
        await this.testAchievementSystem();
        
        // Generate report
        this.generateReport();
    }

    async testEnvironment() {
        this.log('📋 Testing Environment Setup', 'section');
        
        // Test if required scripts are loaded
        this.test('UserDataSync loaded', () => {
            return typeof window.userDataSync !== 'undefined';
        });

        this.test('Prayer Notifications loaded', () => {
            return typeof window.prayerNotifications !== 'undefined';
        });

        this.test('Data Migration loaded', () => {
            return typeof window.dataMigration !== 'undefined';
        });

        // Test localStorage availability
        this.test('localStorage available', () => {
            return typeof Storage !== 'undefined';
        });

        // Test Notification API
        this.test('Notification API available', () => {
            return 'Notification' in window;
        });

        // Test Geolocation API
        this.test('Geolocation API available', () => {
            return 'geolocation' in navigator;
        });
    }

    async testUserAuth() {
        this.log('🔐 Testing User Authentication', 'section');
        
        this.test('User login status check', () => {
            return window.userDataSync && typeof window.userDataSync.isLoggedIn === 'boolean';
        });

        if (window.userDataSync && window.userDataSync.isLoggedIn) {
            this.test('User ID available', () => {
                return window.userDataSync.userId && window.userDataSync.userId > 0;
            });
        }
    }

    async testUserDataSync() {
        this.log('🔄 Testing User Data Sync System', 'section');
        
        if (!window.userDataSync || !window.userDataSync.isLoggedIn) {
            this.test('User Data Sync (skipped - not logged in)', () => true);
            return;
        }

        // Test preferences loading
        await this.asyncTest('Load user preferences', async () => {
            const prefs = await window.userDataSync.loadUserPreferences();
            return prefs && typeof prefs === 'object';
        });

        // Test preferences updating
        await this.asyncTest('Update user preferences', async () => {
            const testPrefs = {
                theme: 'dark',
                language: 'ar',
                test_timestamp: Date.now()
            };
            const result = await window.userDataSync.updateUserPreferences(testPrefs);
            return result && result.success;
        });

        // Test bookmarks
        await this.asyncTest('Load Quran bookmarks', async () => {
            const bookmarks = await window.userDataSync.loadQuranBookmarks();
            return Array.isArray(bookmarks);
        });

        // Test reading stats
        await this.asyncTest('Load reading stats', async () => {
            const stats = await window.userDataSync.loadReadingStats();
            return stats && typeof stats === 'object';
        });

        // Test achievements
        await this.asyncTest('Load achievements', async () => {
            const achievements = await window.userDataSync.loadAchievements();
            return Array.isArray(achievements);
        });
    }

    async testDataMigration() {
        this.log('📦 Testing Data Migration System', 'section');
        
        // Test migration detection
        this.test('Migration utility available', () => {
            return window.dataMigration && typeof window.dataMigration.checkForLocalData === 'function';
        });

        // Test local data detection
        this.test('Local data detection', () => {
            const hasLocalData = window.dataMigration ? window.dataMigration.checkForLocalData() : false;
            return typeof hasLocalData === 'boolean';
        });

        // Test migration modal
        this.test('Migration modal creation', () => {
            if (!window.dataMigration) return false;
            try {
                window.dataMigration.showMigrationModal();
                const modal = document.getElementById('migrationModal');
                return modal !== null;
            } catch (error) {
                return false;
            }
        });
    }

    async testPrayerNotifications() {
        this.log('🔔 Testing Prayer Notifications', 'section');
        
        // Test initialization
        await this.asyncTest('Prayer notifications init', async () => {
            if (!window.prayerNotifications) return false;
            try {
                await window.prayerNotifications.init();
                return true;
            } catch (error) {
                console.error('Prayer notifications init error:', error);
                return false;
            }
        });

        // Test settings
        await this.asyncTest('Notification settings', async () => {
            if (!window.prayerNotifications) return false;
            try {
                const settings = await window.prayerNotifications.getNotificationSettings();
                return settings && typeof settings === 'object';
            } catch (error) {
                return false;
            }
        });

        // Test prayer time update
        await this.asyncTest('Prayer times update', async () => {
            if (!window.prayerNotifications) return false;
            try {
                const testTimes = {
                    fajr: '05:30 AM',
                    dhuhr: '12:15 PM',
                    asr: '03:45 PM',
                    maghrib: '06:30 PM',
                    isha: '08:00 PM'
                };
                await window.prayerNotifications.updatePrayerTimes(testTimes);
                return true;
            } catch (error) {
                return false;
            }
        });
    }

    async testAchievementSystem() {
        this.log('🏆 Testing Achievement System', 'section');
        
        if (!window.userDataSync || !window.userDataSync.isLoggedIn) {
            this.test('Achievement System (skipped - not logged in)', () => true);
            return;
        }

        // Test achievement tracking functions
        this.test('Quran reading tracker', () => {
            return typeof window.userDataSync.trackQuranReading === 'function';
        });

        this.test('Hadith reading tracker', () => {
            return typeof window.userDataSync.trackHadithReading === 'function';
        });

        this.test('Bookmark tracker', () => {
            return typeof window.userDataSync.trackFirstBookmark === 'function';
        });

        this.test('Favorite tracker', () => {
            return typeof window.userDataSync.trackFirstFavorite === 'function';
        });

        // Test achievement calculation
        await this.asyncTest('Achievement calculation', async () => {
            try {
                await window.userDataSync.calculateAchievements();
                return true;
            } catch (error) {
                console.error('Achievement calculation error:', error);
                return false;
            }
        });
    }

    // Helper methods
    test(name, testFunction) {
        this.totalTests++;
        try {
            const result = testFunction();
            if (result) {
                this.passedTests++;
                this.log(`✅ ${name}`, 'pass');
                this.results.push({ name, status: 'PASS', error: null });
            } else {
                this.failedTests++;
                this.log(`❌ ${name}`, 'fail');
                this.results.push({ name, status: 'FAIL', error: 'Test returned false' });
            }
        } catch (error) {
            this.failedTests++;
            this.log(`❌ ${name} - Error: ${error.message}`, 'fail');
            this.results.push({ name, status: 'FAIL', error: error.message });
        }
    }

    async asyncTest(name, testFunction) {
        this.totalTests++;
        try {
            const result = await testFunction();
            if (result) {
                this.passedTests++;
                this.log(`✅ ${name}`, 'pass');
                this.results.push({ name, status: 'PASS', error: null });
            } else {
                this.failedTests++;
                this.log(`❌ ${name}`, 'fail');
                this.results.push({ name, status: 'FAIL', error: 'Test returned false' });
            }
        } catch (error) {
            this.failedTests++;
            this.log(`❌ ${name} - Error: ${error.message}`, 'fail');
            this.results.push({ name, status: 'FAIL', error: error.message });
        }
    }

    log(message, type = 'info') {
        const styles = {
            section: 'color: #2563eb; font-weight: bold; font-size: 14px;',
            pass: 'color: #10b981;',
            fail: 'color: #ef4444;',
            info: 'color: #6b7280;'
        };
        
        console.log(`%c${message}`, styles[type] || styles.info);
    }

    generateReport() {
        this.log('\n📊 Test Report', 'section');
        this.log(`Total Tests: ${this.totalTests}`);
        this.log(`Passed: ${this.passedTests}`, 'pass');
        this.log(`Failed: ${this.failedTests}`, 'fail');
        this.log(`Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);

        if (this.failedTests > 0) {
            this.log('\n❌ Failed Tests:', 'fail');
            this.results.filter(r => r.status === 'FAIL').forEach(result => {
                this.log(`  • ${result.name}: ${result.error}`, 'fail');
            });
        }

        // Create summary for user dashboard
        this.createUserSummary();
    }

    createUserSummary() {
        const summary = {
            timestamp: new Date().toISOString(),
            totalTests: this.totalTests,
            passedTests: this.passedTests,
            failedTests: this.failedTests,
            successRate: ((this.passedTests / this.totalTests) * 100).toFixed(1),
            details: this.results
        };

        // Store in localStorage for dashboard display
        localStorage.setItem('system_test_results', JSON.stringify(summary));
        
        // Show notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('نتائج اختبار النظام', {
                body: `تم اجتياز ${this.passedTests} من ${this.totalTests} اختبارات`,
                icon: '/static/favicon.ico'
            });
        }
    }

    // Quick health check method
    static async quickHealthCheck() {
        const tester = new SystemTester();
        
        console.log('🔍 Quick Health Check...');
        
        // Basic checks only
        tester.test('Scripts loaded', () => {
            return window.userDataSync && window.prayerNotifications && window.dataMigration;
        });

        tester.test('APIs available', () => {
            return 'Notification' in window && 'geolocation' in navigator && typeof Storage !== 'undefined';
        });

        if (window.userDataSync && window.userDataSync.isLoggedIn) {
            await tester.asyncTest('User data accessible', async () => {
                try {
                    await window.userDataSync.loadUserPreferences();
                    return true;
                } catch {
                    return false;
                }
            });
        }

        const healthScore = (tester.passedTests / tester.totalTests) * 100;
        console.log(`%c🏥 Health Score: ${healthScore.toFixed(1)}%`, 
                   healthScore > 80 ? 'color: #10b981; font-weight: bold;' : 'color: #ef4444; font-weight: bold;');
        
        return healthScore;
    }
}

// Make available globally
window.SystemTester = SystemTester;

// Auto-run health check on load (with delay to ensure all scripts are loaded)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SystemTester.quickHealthCheck();
    }, 2000);
});

// Console commands for manual testing
console.log(`
🧪 Islamic App System Tester Loaded!

Available commands:
- SystemTester.quickHealthCheck() - Quick system health check
- new SystemTester().runAllTests() - Full comprehensive test suite

Example usage:
const tester = new SystemTester();
await tester.runAllTests();
`);
