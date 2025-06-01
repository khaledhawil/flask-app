/**
 * User Data Synchronization Module
 * Handles syncing user data between localStorage and server
 */

class UserDataSync {
    constructor() {
        this.isLoggedIn = this.checkLoginStatus();
        this.initializeSync();
    }

    checkLoginStatus() {
        // Check if user is logged in by looking for session indicators
        return document.body.classList.contains('logged-in') || 
               document.querySelector('[data-user-id]') !== null;
    }

    async initializeSync() {
        if (!this.isLoggedIn) {
            console.log('User not logged in, using localStorage only');
            return;
        }

        try {
            // Migrate localStorage data to server if it exists
            await this.migrateLocalStorageData();
            
            // Load user preferences
            await this.loadUserPreferences();
            
            // Set up periodic sync
            this.startPeriodicSync();
        } catch (error) {
            console.error('Error initializing user data sync:', error);
        }
    }

    async migrateLocalStorageData() {
        const localData = this.getLocalStorageData();
        
        if (Object.keys(localData).length === 0) {
            return; // No local data to migrate
        }

        console.log('Migrating localStorage data to server...');

        // Migrate preferences
        if (localData.preferences) {
            await this.updateUserPreferences(localData.preferences);
        }

        // Migrate bookmarks
        if (localData.bookmarks && localData.bookmarks.length > 0) {
            for (const bookmark of localData.bookmarks) {
                await this.addQuranBookmark(bookmark);
            }
        }

        // Migrate favorites
        if (localData.favorites && localData.favorites.length > 0) {
            for (const favorite of localData.favorites) {
                await this.addHadithFavorite(favorite);
            }
        }

        // Clear localStorage after successful migration
        this.clearLocalStorageData();
        console.log('Migration completed successfully');
    }

    getLocalStorageData() {
        const data = {};
        
        // Get preferences
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

        // Get bookmarks
        const bookmarks = localStorage.getItem('quranBookmarks');
        if (bookmarks) {
            try {
                data.bookmarks = JSON.parse(bookmarks);
            } catch (e) {
                console.error('Error parsing bookmarks:', e);
            }
        }

        // Get favorites
        const favorites = localStorage.getItem('hadithFavorites');
        if (favorites) {
            try {
                data.favorites = JSON.parse(favorites);
            } catch (e) {
                console.error('Error parsing favorites:', e);
            }
        }

        return data;
    }

    clearLocalStorageData() {
        const keysToRemove = [
            'theme', 'dailyGoal', 'soundEnabled', 'prayerNotifications', 'language',
            'quranBookmarks', 'hadithFavorites', 'quranProgress', 'readingStats'
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    // User Preferences Methods
    async loadUserPreferences() {
        try {
            const response = await fetch('/api/user/preferences');
            if (response.ok) {
                const preferences = await response.json();
                this.applyPreferences(preferences);
                return preferences;
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
        }
        return null;
    }

    async updateUserPreferences(preferences) {
        try {
            const response = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences)
            });
            
            if (response.ok) {
                this.applyPreferences(preferences);
                return true;
            }
        } catch (error) {
            console.error('Error updating user preferences:', error);
        }
        return false;
    }

    applyPreferences(preferences) {
        // Apply theme
        if (preferences.theme) {
            document.body.className = document.body.className.replace(/theme-\w+/g, '');
            document.body.classList.add(`theme-${preferences.theme}`);
        }

        // Apply language preference
        if (preferences.language_preference) {
            document.documentElement.lang = preferences.language_preference;
        }

        // Apply sound settings
        if (typeof preferences.sound_enabled !== 'undefined') {
            window.soundEnabled = preferences.sound_enabled;
        }

        // Trigger custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('userPreferencesLoaded', { 
            detail: preferences 
        }));
    }

    // Quran Progress Methods
    async updateQuranProgress(surahNumber, ayahNumber, readingStreak = 1) {
        if (!this.isLoggedIn) {
            return this.updateLocalQuranProgress(surahNumber, ayahNumber, readingStreak);
        }

        try {
            const response = await fetch('/api/user/quran/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    surah_number: surahNumber,
                    ayah_number: ayahNumber,
                    reading_streak: readingStreak
                })
            });
            
            if (response.ok) {
                // Update reading statistics
                await this.updateReadingStats({ quran_verses_read: 1 });
                return true;
            }
        } catch (error) {
            console.error('Error updating Quran progress:', error);
        }
        return false;
    }

    updateLocalQuranProgress(surahNumber, ayahNumber, readingStreak) {
        const progress = JSON.parse(localStorage.getItem('quranProgress') || '[]');
        const existingIndex = progress.findIndex(p => 
            p.surah_number === surahNumber && p.ayah_number === ayahNumber
        );

        if (existingIndex >= 0) {
            progress[existingIndex].total_ayahs_read += 1;
            progress[existingIndex].last_read_date = new Date().toISOString();
            progress[existingIndex].reading_streak = readingStreak;
        } else {
            progress.push({
                surah_number: surahNumber,
                ayah_number: ayahNumber,
                total_ayahs_read: 1,
                last_read_date: new Date().toISOString(),
                reading_streak: readingStreak
            });
        }

        localStorage.setItem('quranProgress', JSON.stringify(progress));
        return true;
    }

    // Bookmark Methods
    async getQuranBookmarks() {
        if (!this.isLoggedIn) {
            return JSON.parse(localStorage.getItem('quranBookmarks') || '[]');
        }

        try {
            const response = await fetch('/api/user/quran/bookmarks');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
        return [];
    }

    async addQuranBookmark(bookmark) {
        if (!this.isLoggedIn) {
            return this.addLocalQuranBookmark(bookmark);
        }

        try {
            const response = await fetch('/api/user/quran/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookmark)
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error adding bookmark:', error);
            return false;
        }
    }

    async removeQuranBookmark(surahNumber, ayahNumber) {
        if (!this.isLoggedIn) {
            return this.removeLocalQuranBookmark(surahNumber, ayahNumber);
        }

        try {
            const response = await fetch('/api/user/quran/bookmarks', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    surah_number: surahNumber,
                    ayah_number: ayahNumber
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error removing bookmark:', error);
            return false;
        }
    }

    addLocalQuranBookmark(bookmark) {
        const bookmarks = JSON.parse(localStorage.getItem('quranBookmarks') || '[]');
        const exists = bookmarks.some(b => 
            b.surah_number === bookmark.surah_number && b.ayah_number === bookmark.ayah_number
        );

        if (!exists) {
            bookmarks.push({
                ...bookmark,
                created_at: new Date().toISOString()
            });
            localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
            return true;
        }
        return false;
    }

    removeLocalQuranBookmark(surahNumber, ayahNumber) {
        const bookmarks = JSON.parse(localStorage.getItem('quranBookmarks') || '[]');
        const filtered = bookmarks.filter(b => 
            !(b.surah_number === surahNumber && b.ayah_number === ayahNumber)
        );
        localStorage.setItem('quranBookmarks', JSON.stringify(filtered));
        return true;
    }

    // Hadith Favorites Methods
    async getHadithFavorites() {
        if (!this.isLoggedIn) {
            return JSON.parse(localStorage.getItem('hadithFavorites') || '[]');
        }

        try {
            const response = await fetch('/api/user/hadith/favorites');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching hadith favorites:', error);
        }
        return [];
    }

    async addHadithFavorite(favorite) {
        if (!this.isLoggedIn) {
            return this.addLocalHadithFavorite(favorite);
        }

        try {
            const response = await fetch('/api/user/hadith/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(favorite)
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error adding hadith favorite:', error);
            return false;
        }
    }

    async removeHadithFavorite(collection, number) {
        if (!this.isLoggedIn) {
            return this.removeLocalHadithFavorite(collection, number);
        }

        try {
            const response = await fetch('/api/user/hadith/favorites', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection: collection,
                    number: number
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error removing hadith favorite:', error);
            return false;
        }
    }

    addLocalHadithFavorite(favorite) {
        const favorites = JSON.parse(localStorage.getItem('hadithFavorites') || '[]');
        const exists = favorites.some(f => 
            f.collection === favorite.collection && f.number === favorite.number
        );

        if (!exists) {
            favorites.push({
                ...favorite,
                created_at: new Date().toISOString()
            });
            localStorage.setItem('hadithFavorites', JSON.stringify(favorites));
            return true;
        }
        return false;
    }

    removeLocalHadithFavorite(collection, number) {
        const favorites = JSON.parse(localStorage.getItem('hadithFavorites') || '[]');
        const filtered = favorites.filter(f => 
            !(f.collection === collection && f.number === number)
        );
        localStorage.setItem('hadithFavorites', JSON.stringify(filtered));
        return true;
    }

    // Reading Statistics Methods
    async updateReadingStats(stats) {
        if (!this.isLoggedIn) {
            return this.updateLocalReadingStats(stats);
        }

        try {
            const response = await fetch('/api/user/reading-stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stats)
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error updating reading stats:', error);
            return false;
        }
    }

    async getReadingStats() {
        if (!this.isLoggedIn) {
            return JSON.parse(localStorage.getItem('readingStats') || '{}');
        }

        try {
            const response = await fetch('/api/user/reading-stats');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching reading stats:', error);
        }
        return {};
    }

    updateLocalReadingStats(stats) {
        const currentStats = JSON.parse(localStorage.getItem('readingStats') || '{}');
        
        if (stats.quran_verses_read) {
            currentStats.quran_verses_read = (currentStats.quran_verses_read || 0) + stats.quran_verses_read;
        }
        
        if (stats.hadiths_read) {
            currentStats.hadiths_read = (currentStats.hadiths_read || 0) + stats.hadiths_read;
        }
        
        if (stats.daily_reading_streak) {
            currentStats.daily_reading_streak = stats.daily_reading_streak;
        }
        
        if (stats.favorite_reciter) {
            currentStats.favorite_reciter = stats.favorite_reciter;
        }

        currentStats.last_reading_date = new Date().toDateString();
        localStorage.setItem('readingStats', JSON.stringify(currentStats));
        return true;
    }

    // Achievement Methods
    async addAchievement(type, name, data = {}) {
        if (!this.isLoggedIn) {
            return false;
        }

        try {
            const response = await fetch('/api/user/achievements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: type,
                    name: name,
                    data: data
                })
            });
            
            if (response.ok) {
                // Show achievement notification
                this.showAchievementNotification(name);
                return true;
            }
        } catch (error) {
            console.error('Error adding achievement:', error);
        }
        return false;
    }

    showAchievementNotification(achievementName) {
        // Create a simple achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <h3>🏆 إنجاز جديد!</h3>
                <p>${achievementName}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // Achievement system integration
    async checkAndAwardAchievements(activityType, data = {}) {
        if (!this.isLoggedIn) return;

        try {
            const stats = await this.getReadingStats();
            const bookmarks = await this.getQuranBookmarks();
            const favorites = await this.getHadithFavorites();

            // Check various achievement conditions
            const achievements = [];

            // First time achievements
            if (activityType === 'first_bookmark' && bookmarks.length === 1) {
                achievements.push({
                    type: 'milestone',
                    name: 'أول مفضلة',
                    description: 'أضفت أول آية للمفضلة'
                });
            }

            if (activityType === 'first_favorite' && favorites.length === 1) {
                achievements.push({
                    type: 'milestone',
                    name: 'أول حديث مفضل',
                    description: 'أضفت أول حديث للمفضلة'
                });
            }

            // Reading milestones
            if (activityType === 'quran_reading' && stats.quran_verses_read) {
                if (stats.quran_verses_read === 100) {
                    achievements.push({
                        type: 'milestone',
                        name: 'قارئ مبتدئ',
                        description: 'قرأت 100 آية من القرآن'
                    });
                } else if (stats.quran_verses_read === 500) {
                    achievements.push({
                        type: 'milestone',
                        name: 'قارئ متقدم',
                        description: 'قرأت 500 آية من القرآن'
                    });
                } else if (stats.quran_verses_read === 1000) {
                    achievements.push({
                        type: 'milestone',
                        name: 'حافظ مجتهد',
                        description: 'قرأت 1000 آية من القرآن'
                    });
                }
            }

            if (activityType === 'hadith_reading' && stats.hadiths_read) {
                if (stats.hadiths_read === 50) {
                    achievements.push({
                        type: 'milestone',
                        name: 'طالب علم',
                        description: 'قرأت 50 حديثاً'
                    });
                } else if (stats.hadiths_read === 200) {
                    achievements.push({
                        type: 'milestone',
                        name: 'محدث مجتهد',
                        description: 'قرأت 200 حديثاً'
                    });
                }
            }

            // Streak achievements
            if (activityType === 'daily_streak' && stats.daily_reading_streak) {
                if (stats.daily_reading_streak === 7) {
                    achievements.push({
                        type: 'streak',
                        name: 'أسبوع مبارك',
                        description: '7 أيام متتالية من القراءة'
                    });
                } else if (stats.daily_reading_streak === 30) {
                    achievements.push({
                        type: 'streak',
                        name: 'شهر مبارك',
                        description: '30 يوماً متتالياً من القراءة'
                    });
                } else if (stats.daily_reading_streak === 100) {
                    achievements.push({
                        type: 'streak',
                        name: 'مثابر ملتزم',
                        description: '100 يوم متتالي من القراءة'
                    });
                }
            }

            // Collection achievements
            if (bookmarks.length === 10) {
                achievements.push({
                    type: 'collection',
                    name: 'جامع الآيات',
                    description: 'جمعت 10 آيات في المفضلة'
                });
            } else if (bookmarks.length === 50) {
                achievements.push({
                    type: 'collection',
                    name: 'خزانة القرآن',
                    description: 'جمعت 50 آية في المفضلة'
                });
            }

            if (favorites.length === 25) {
                achievements.push({
                    type: 'collection',
                    name: 'محب الأحاديث',
                    description: 'جمعت 25 حديثاً في المفضلة'
                });
            }

            // Award new achievements
            for (const achievement of achievements) {
                await this.addAchievement(achievement);
                this.showAchievementNotification(achievement.name);
            }

        } catch (error) {
            console.error('Error checking achievements:', error);
        }
    }

    async addAchievement(achievement) {
        if (!this.isLoggedIn) return;

        try {
            const response = await fetch('/api/user/achievements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    achievement_type: achievement.type,
                    achievement_name: achievement.name,
                    achievement_data: {
                        description: achievement.description,
                        earned_date: new Date().toISOString()
                    }
                })
            });

            const result = await response.json();
            if (!result.success) {
                console.error('Failed to add achievement:', result.error);
            }
        } catch (error) {
            console.error('Error adding achievement:', error);
        }
    }

    // Enhanced tracking methods with achievement checks
    async trackQuranReading(versesRead = 1) {
        await this.updateReadingStats({ 
            quran_verses_read: versesRead,
            daily_reading_streak: 1,
            total_reading_days: 1
        });
        await this.checkAndAwardAchievements('quran_reading');
        await this.checkAndAwardAchievements('daily_streak');
    }

    async trackHadithReading(hadithsRead = 1) {
        await this.updateReadingStats({ 
            hadiths_read: hadithsRead 
        });
        await this.checkAndAwardAchievements('hadith_reading');
    }

    async trackFirstBookmark() {
        await this.checkAndAwardAchievements('first_bookmark');
    }

    async trackFirstFavorite() {
        await this.checkAndAwardAchievements('first_favorite');
    }

    // Periodic sync for logged-in users
    startPeriodicSync() {
        if (!this.isLoggedIn) return;

        // Sync every 5 minutes
        setInterval(() => {
            this.syncData();
        }, 5 * 60 * 1000);
    }

    async syncData() {
        if (!this.isLoggedIn) return;

        try {
            // Refresh user preferences
            await this.loadUserPreferences();
            
            // Trigger sync event for other components
            window.dispatchEvent(new CustomEvent('userDataSynced'));
        } catch (error) {
            console.error('Error during periodic sync:', error);
        }
    }
}

// Initialize the user data sync system
window.userDataSync = new UserDataSync();

// Export for use in other scripts
window.UserDataSync = UserDataSync;
