/**
 * Data Migration Script
 * One-time migration of localStorage data to server for existing users
 */

class DataMigration {
    constructor() {
        this.migrationKey = 'migrationCompleted_v1';
        this.migrationStatus = localStorage.getItem(this.migrationKey);
    }

    async checkAndMigrate() {
        // Check if user is logged in
        const isLoggedIn = document.body.classList.contains('logged-in') || 
                          document.querySelector('[data-user-id]') !== null;
        
        if (!isLoggedIn) {
            console.log('User not logged in, skipping migration');
            return;
        }

        // Check if migration already completed
        if (this.migrationStatus === 'completed') {
            console.log('Data migration already completed');
            return;
        }

        // Show migration prompt to user
        const shouldMigrate = await this.showMigrationPrompt();
        if (!shouldMigrate) {
            localStorage.setItem(this.migrationKey, 'skipped');
            return;
        }

        try {
            await this.performMigration();
            localStorage.setItem(this.migrationKey, 'completed');
            this.showMigrationSuccess();
        } catch (error) {
            console.error('Migration failed:', error);
            this.showMigrationError(error);
        }
    }

    async showMigrationPrompt() {
        return new Promise((resolve) => {
            // Check if there's any localStorage data to migrate
            const hasLocalData = this.hasLocalStorageData();
            
            if (!hasLocalData) {
                resolve(false);
                return;
            }

            const modal = document.createElement('div');
            modal.className = 'migration-modal';
            modal.innerHTML = `
                <div class="migration-modal-content">
                    <div class="migration-icon">📥</div>
                    <h3>نقل البيانات المحفوظة</h3>
                    <p>تم العثور على بيانات محفوظة محلياً (مفضلة، إعدادات، إلخ). هل تريد نقلها إلى حسابك؟</p>
                    <div class="migration-benefits">
                        <div class="benefit-item">✅ حفظ آمن للبيانات</div>
                        <div class="benefit-item">✅ مزامنة بين الأجهزة</div>
                        <div class="benefit-item">✅ نسخ احتياطي تلقائي</div>
                    </div>
                    <div class="migration-actions">
                        <button class="btn-migrate" onclick="resolveMigration(true)">نعم، انقل البيانات</button>
                        <button class="btn-skip" onclick="resolveMigration(false)">تخطي</button>
                    </div>
                </div>
                <div class="migration-backdrop" onclick="resolveMigration(false)"></div>
            `;

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .migration-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .migration-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }
                
                .migration-modal-content {
                    background: white;
                    border-radius: 15px;
                    padding: 2rem;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                
                .migration-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                
                .migration-modal-content h3 {
                    color: #333;
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }
                
                .migration-modal-content p {
                    color: #666;
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }
                
                .migration-benefits {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 1rem;
                    margin-bottom: 2rem;
                    text-align: right;
                }
                
                .benefit-item {
                    margin: 0.5rem 0;
                    color: #28a745;
                    font-weight: 600;
                }
                
                .migration-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                
                .btn-migrate, .btn-skip {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-migrate {
                    background: #28a745;
                    color: white;
                }
                
                .btn-migrate:hover {
                    background: #218838;
                }
                
                .btn-skip {
                    background: #6c757d;
                    color: white;
                }
                
                .btn-skip:hover {
                    background: #5a6268;
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(modal);

            // Global function for button clicks
            window.resolveMigration = (result) => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
                delete window.resolveMigration;
                resolve(result);
            };
        });
    }

    hasLocalStorageData() {
        const keys = [
            'theme', 'dailyGoal', 'soundEnabled', 'prayerNotifications', 'language',
            'quranBookmarks', 'hadithFavorites', 'quranProgress', 'readingStats'
        ];
        
        return keys.some(key => localStorage.getItem(key) !== null);
    }

    async performMigration() {
        this.showMigrationProgress();
        
        const localData = this.collectLocalStorageData();
        
        if (Object.keys(localData).length === 0) {
            throw new Error('No data found to migrate');
        }

        // Step 1: Migrate preferences
        if (localData.preferences) {
            await this.migratePreferences(localData.preferences);
            this.updateProgress(25, 'جاري نقل الإعدادات...');
        }

        // Step 2: Migrate bookmarks
        if (localData.bookmarks && localData.bookmarks.length > 0) {
            await this.migrateBookmarks(localData.bookmarks);
            this.updateProgress(50, 'جاري نقل مفضلة القرآن...');
        }

        // Step 3: Migrate favorites
        if (localData.favorites && localData.favorites.length > 0) {
            await this.migrateFavorites(localData.favorites);
            this.updateProgress(75, 'جاري نقل الأحاديث المفضلة...');
        }

        // Step 4: Migrate reading stats
        if (localData.readingStats) {
            await this.migrateReadingStats(localData.readingStats);
            this.updateProgress(90, 'جاري نقل الإحصائيات...');
        }

        // Step 5: Clear localStorage and finish
        this.clearMigratedData();
        this.updateProgress(100, 'تم النقل بنجاح!');
        
        // Wait before closing
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.closeMigrationProgress();
    }

    collectLocalStorageData() {
        const data = {};
        
        // Collect preferences
        const theme = localStorage.getItem('theme');
        const dailyGoal = localStorage.getItem('dailyGoal');
        const soundEnabled = localStorage.getItem('soundEnabled');
        const prayerNotifications = localStorage.getItem('prayerNotifications');
        const language = localStorage.getItem('language');

        if (theme || dailyGoal || soundEnabled || prayerNotifications || language) {
            data.preferences = {
                theme: theme || 'light',
                daily_goal: parseInt(dailyGoal) || 100,
                sound_enabled: soundEnabled !== 'false',
                prayer_notifications: prayerNotifications ? JSON.parse(prayerNotifications) : {},
                language_preference: language || 'ar'
            };
        }

        // Collect bookmarks
        const bookmarks = localStorage.getItem('quranBookmarks');
        if (bookmarks) {
            try {
                data.bookmarks = JSON.parse(bookmarks);
            } catch (e) {
                console.error('Error parsing bookmarks:', e);
            }
        }

        // Collect favorites
        const favorites = localStorage.getItem('hadithFavorites');
        if (favorites) {
            try {
                data.favorites = JSON.parse(favorites);
            } catch (e) {
                console.error('Error parsing favorites:', e);
            }
        }

        // Collect reading stats
        const readingStats = localStorage.getItem('readingStats');
        if (readingStats) {
            try {
                data.readingStats = JSON.parse(readingStats);
            } catch (e) {
                console.error('Error parsing reading stats:', e);
            }
        }

        return data;
    }

    async migratePreferences(preferences) {
        const response = await fetch('/api/user/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences)
        });
        
        if (!response.ok) {
            throw new Error('Failed to migrate preferences');
        }
    }

    async migrateBookmarks(bookmarks) {
        for (const bookmark of bookmarks) {
            const response = await fetch('/api/user/quran/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookmark)
            });
            
            if (!response.ok) {
                console.warn('Failed to migrate bookmark:', bookmark);
            }
        }
    }

    async migrateFavorites(favorites) {
        for (const favorite of favorites) {
            const response = await fetch('/api/user/hadith/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(favorite)
            });
            
            if (!response.ok) {
                console.warn('Failed to migrate favorite:', favorite);
            }
        }
    }

    async migrateReadingStats(stats) {
        const response = await fetch('/api/user/reading-stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stats)
        });
        
        if (!response.ok) {
            throw new Error('Failed to migrate reading stats');
        }
    }

    showMigrationProgress() {
        const progressModal = document.createElement('div');
        progressModal.id = 'migrationProgress';
        progressModal.className = 'migration-modal';
        progressModal.innerHTML = `
            <div class="migration-modal-content">
                <div class="migration-icon">⏳</div>
                <h3>جاري نقل البيانات...</h3>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text" id="progressText">بدء النقل...</div>
                </div>
                <p style="color: #666; font-size: 0.9rem; margin-top: 1rem;">
                    الرجاء عدم إغلاق النافذة حتى انتهاء العملية
                </p>
            </div>
        `;

        // Add progress styles
        const style = document.createElement('style');
        style.id = 'progressStyles';
        style.textContent = `
            .progress-container {
                margin: 1.5rem 0;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #28a745, #20c997);
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 0.9rem;
                color: #666;
                text-align: center;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(progressModal);
    }

    updateProgress(percentage, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = percentage + '%';
        if (progressText) progressText.textContent = text;
    }

    closeMigrationProgress() {
        const progressModal = document.getElementById('migrationProgress');
        const progressStyles = document.getElementById('progressStyles');
        
        if (progressModal) document.body.removeChild(progressModal);
        if (progressStyles) document.head.removeChild(progressStyles);
    }

    clearMigratedData() {
        const keysToRemove = [
            'theme', 'dailyGoal', 'soundEnabled', 'prayerNotifications', 'language',
            'quranBookmarks', 'hadithFavorites', 'quranProgress', 'readingStats'
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    showMigrationSuccess() {
        const notification = document.createElement('div');
        notification.className = 'migration-success';
        notification.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <h4>تم النقل بنجاح!</h4>
                <p>تم نقل جميع بياناتك إلى حسابك بأمان</p>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .migration-success {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                padding: 1.5rem;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                max-width: 300px;
                border-left: 4px solid #28a745;
                animation: slideInRight 0.3s ease;
            }
            
            .success-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            
            .success-content h4 {
                color: #28a745;
                margin: 0 0 0.5rem 0;
            }
            
            .success-content p {
                color: #666;
                margin: 0;
                font-size: 0.9rem;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }
        }, 5000);
    }

    showMigrationError(error) {
        const notification = document.createElement('div');
        notification.className = 'migration-error';
        notification.innerHTML = `
            <div class="error-content">
                <div class="error-icon">❌</div>
                <h4>فشل في النقل</h4>
                <p>حدث خطأ أثناء نقل البيانات: ${error.message}</p>
                <button onclick="this.parentElement.parentElement.remove()">إغلاق</button>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .migration-error {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                padding: 1.5rem;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                max-width: 300px;
                border-left: 4px solid #dc3545;
                animation: slideInRight 0.3s ease;
            }
            
            .error-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            
            .error-content h4 {
                color: #dc3545;
                margin: 0 0 0.5rem 0;
            }
            
            .error-content p {
                color: #666;
                margin: 0 0 1rem 0;
                font-size: 0.9rem;
            }
            
            .error-content button {
                background: #dc3545;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);
    }
}

// Initialize migration on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for user data sync to initialize
    setTimeout(() => {
        const migration = new DataMigration();
        migration.checkAndMigrate();
    }, 2000);
});

// Export for manual triggering
window.DataMigration = DataMigration;
