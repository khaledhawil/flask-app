/**
 * Prayer Notifications System
 * Handles browser notifications for prayer times using Notifications API
 */

class PrayerNotifications {
    constructor() {
        this.notificationsEnabled = false;
        this.prayerTimes = {};
        this.checkInterval = null;
        this.reminderMinutes = 10; // Default reminder time
        this.notificationSounds = null;
        this.prayerSettings = {
            fajr: true,
            dhuhr: true,
            asr: true,
            maghrib: true,
            isha: true
        };
        
        console.log('🔔 Prayer Notifications System Initializing...');
    }

    async init() {
        try {
            // Check notification permission
            await this.checkNotificationPermission();
            
            // Load user preferences
            await this.loadNotificationPreferences();
            
            // Initialize sounds
            this.initializeNotificationSounds();
            
            // Load current prayer times
            await this.loadPrayerTimes();
            
            // Start monitoring prayer times
            this.startPrayerMonitoring();
            
            console.log('✅ Prayer Notifications System Ready');
        } catch (error) {
            console.error('❌ Error initializing Prayer Notifications:', error);
        }
    }

    async checkNotificationPermission() {
        if (!('Notification' in window)) {
            console.warn('❌ This browser does not support notifications');
            return false;
        }

        let permission = Notification.permission;
        
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }

        this.notificationsEnabled = permission === 'granted';
        
        if (this.notificationsEnabled) {
            console.log('✅ Notification permission granted');
        } else {
            console.warn('❌ Notification permission denied');
        }
        
        return this.notificationsEnabled;
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            throw new Error('المتصفح لا يدعم الإشعارات');
        }

        const permission = await Notification.requestPermission();
        this.notificationsEnabled = permission === 'granted';
        
        if (this.notificationsEnabled) {
            this.showTestNotification();
            await this.saveNotificationPreferences();
        }
        
        return this.notificationsEnabled;
    }

    async loadNotificationPreferences() {
        try {
            // Try to load from server if logged in
            if (window.userDataSync && window.userDataSync.isLoggedIn) {
                const preferences = await window.userDataSync.loadUserPreferences();
                if (preferences && preferences.prayer_notifications) {
                    this.applyPreferences(preferences.prayer_notifications);
                    return;
                }
            }

            // Fallback to localStorage
            const savedPrefs = localStorage.getItem('prayerNotifications');
            if (savedPrefs) {
                this.applyPreferences(JSON.parse(savedPrefs));
            }
        } catch (error) {
            console.error('Error loading notification preferences:', error);
        }
    }

    applyPreferences(preferences) {
        this.notificationsEnabled = preferences.enabled !== false;
        this.reminderMinutes = preferences.reminderMinutes || 10;
        
        // Apply prayer-specific settings
        this.prayerSettings = {
            fajr: preferences.fajr !== false,
            dhuhr: preferences.dhuhr !== false,
            asr: preferences.asr !== false,
            maghrib: preferences.maghrib !== false,
            isha: preferences.isha !== false,
            ...preferences
        };
    }

    async saveNotificationPreferences() {
        const preferences = {
            enabled: this.notificationsEnabled,
            reminderMinutes: this.reminderMinutes,
            ...this.prayerSettings
        };

        try {
            // Save to server if logged in
            if (window.userDataSync && window.userDataSync.isLoggedIn) {
                await window.userDataSync.updateUserPreferences({
                    prayer_notifications: preferences
                });
            }

            // Always save to localStorage as backup
            localStorage.setItem('prayerNotifications', JSON.stringify(preferences));
        } catch (error) {
            console.error('Error saving notification preferences:', error);
        }
    }

    initializeNotificationSounds() {
        try {
            // Use the existing audio files
            this.notificationSounds = {
                fajr: new Audio('/static/audio/azan-fajr.wav'),
                regular: new Audio('/static/audio/azan-regular.wav'),
                notification: new Audio('/static/audio/notification.wav')
            };
            
            // Set volume to reasonable level
            Object.values(this.notificationSounds).forEach(audio => {
                audio.volume = 0.5;
                audio.preload = 'auto';
            });
            
            console.log('🔊 Prayer notification sounds initialized');
        } catch (error) {
            console.error('Error initializing notification sounds:', error);
        }
    }

    playNotificationSound(prayer = null) {
        try {
            if (!this.notificationSounds) return;
            
            let soundToPlay;
            if (prayer === 'Fajr' && this.notificationSounds.fajr) {
                soundToPlay = this.notificationSounds.fajr;
            } else if (this.notificationSounds.regular) {
                soundToPlay = this.notificationSounds.regular;
            } else if (this.notificationSounds.notification) {
                soundToPlay = this.notificationSounds.notification;
            }
            
            if (soundToPlay) {
                soundToPlay.currentTime = 0; // Reset to beginning
                soundToPlay.play().catch(error => {
                    console.warn('Could not play notification sound:', error);
                });
            }
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    }

    async loadPrayerTimes() {
        try {
            // Try to get location-based prayer times
            const position = await this.getCurrentPosition();
            const prayerTimes = await this.fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
            this.prayerTimes = prayerTimes;
            console.log('📅 Prayer times loaded for current location');
        } catch (error) {
            console.error('Error loading prayer times:', error);
            // Fallback to default location or cached times
            await this.loadDefaultPrayerTimes();
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            });
        });
    }

    async fetchPrayerTimes(latitude, longitude) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        const response = await fetch(`/api/prayer-times?lat=${latitude}&lng=${longitude}&date=${dateStr}`);
        const data = await response.json();
        
        if (data.success) {
            return data.timings;
        } else {
            throw new Error(data.error || 'Failed to fetch prayer times');
        }
    }

    async loadDefaultPrayerTimes() {
        // Load cached prayer times or use default location (Mecca)
        const cachedTimes = localStorage.getItem('cachedPrayerTimes');
        if (cachedTimes) {
            const cached = JSON.parse(cachedTimes);
            const today = new Date().toDateString();
            
            if (cached.date === today) {
                this.prayerTimes = cached.times;
                console.log('📅 Using cached prayer times');
                return;
            }
        }

        // Fallback to Mecca coordinates
        try {
            const prayerTimes = await this.fetchPrayerTimes(21.4225, 39.8262);
            this.prayerTimes = prayerTimes;
            
            // Cache the times
            localStorage.setItem('cachedPrayerTimes', JSON.stringify({
                date: new Date().toDateString(),
                times: prayerTimes
            }));
            
            console.log('📅 Using default prayer times (Mecca)');
        } catch (error) {
            console.error('Failed to load default prayer times:', error);
        }
    }

    startPrayerMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        // Check every 30 seconds for more accurate timing
        this.checkInterval = setInterval(() => {
            this.checkPrayerTimes();
        }, 30000);

        // Initial check
        this.checkPrayerTimes();
        
        console.log('⏰ Prayer time monitoring started');
    }

    checkPrayerTimes() {
        if (!this.notificationsEnabled || !this.prayerTimes) {
            return;
        }

        const now = new Date();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        prayers.forEach(prayer => {
            const prayerKey = prayer.toLowerCase();
            
            // Check if notifications are enabled for this prayer
            if (this.prayerSettings && this.prayerSettings[prayerKey] === false) {
                return;
            }

            const prayerTime = this.prayerTimes[prayer];
            if (!prayerTime) return;

            const prayerDateTime = this.parseTime(prayerTime);
            const timeDiff = prayerDateTime.getTime() - now.getTime();
            const minutesDiff = Math.floor(timeDiff / (1000 * 60));

            // Check for prayer time notifications (exact time)
            if (minutesDiff === 0 && now.getSeconds() < 30) {
                this.sendPrayerNotification(prayer, prayerTime, 'now');
            }
            // Check for reminder notifications
            else if (minutesDiff === this.reminderMinutes && now.getSeconds() < 30) {
                this.sendPrayerNotification(prayer, prayerTime, 'reminder');
            }
        });
    }

    parseTime(timeStr) {
        const today = new Date();
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) {
            hour24 += 12;
        } else if (period === 'AM' && hours === 12) {
            hour24 = 0;
        }

        const prayerTime = new Date(today);
        prayerTime.setHours(hour24, minutes, 0, 0);
        
        return prayerTime;
    }

    sendPrayerNotification(prayer, time, type) {
        if (!this.notificationsEnabled) return;

        // Check if notification was already sent (prevent duplicates)
        const notificationKey = `notification_${prayer}_${type}_${new Date().toDateString()}`;
        if (localStorage.getItem(notificationKey)) {
            return;
        }

        let title, body, icon;
        
        if (type === 'now') {
            title = `🕌 حان وقت صلاة ${this.getPrayerNameArabic(prayer)}`;
            body = `الوقت الآن ${time}`;
            icon = '🕌';
        } else {
            title = `⏰ تذكير: صلاة ${this.getPrayerNameArabic(prayer)}`;
            body = `بعد ${this.reminderMinutes} دقائق في ${time}`;
            icon = '⏰';
        }

        const notification = new Notification(title, {
            body: body,
            icon: '/static/favicon.ico',
            tag: `prayer-${prayer}-${type}`,
            requireInteraction: type === 'now',
            silent: false,
            vibrate: type === 'now' ? [200, 100, 200] : [100],
            data: {
                prayer: prayer,
                time: time,
                type: type
            }
        });

        // Play notification sound
        if (type === 'now') {
            this.playNotificationSound(prayer);
        } else {
            // Play a softer notification sound for reminders
            if (this.notificationSounds && this.notificationSounds.notification) {
                this.notificationSounds.notification.play().catch(console.warn);
            }
        }

        // Handle notification click
        notification.onclick = () => {
            window.focus();
            
            // Navigate to prayer times page
            if (window.location.pathname !== '/prayer-times') {
                window.location.href = '/prayer-times';
            }
            
            notification.close();
        };

        // Auto close reminder notifications
        if (type === 'reminder') {
            setTimeout(() => {
                notification.close();
            }, 10000);
        }

        // Mark as sent
        localStorage.setItem(notificationKey, 'sent');

        // Clean up old notification markers
        this.cleanupNotificationMarkers();
        
        console.log(`🔔 Sent ${type} notification for ${prayer} at ${time}`);
    }

    getPrayerNameArabic(prayer) {
        const names = {
            'Fajr': 'الفجر',
            'Dhuhr': 'الظهر',
            'Asr': 'العصر',
            'Maghrib': 'المغرب',
            'Isha': 'العشاء'
        };
        return names[prayer] || prayer;
    }

    cleanupNotificationMarkers() {
        const today = new Date().toDateString();
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith('notification_') && !key.includes(today)) {
                localStorage.removeItem(key);
            }
        });
    }

    showTestNotification() {
        if (!this.notificationsEnabled) return;

        const notification = new Notification('🕌 تم تفعيل الإشعارات', {
            body: 'سيتم تذكيرك بأوقات الصلاة',
            icon: '/static/favicon.ico',
            tag: 'test-notification',
            silent: false
        });

        // Play test sound
        if (this.notificationSounds && this.notificationSounds.notification) {
            this.notificationSounds.notification.play().catch(console.warn);
        }

        setTimeout(() => {
            notification.close();
        }, 5000);
    }

    // Public API methods
    async updateReminderTime(minutes) {
        this.reminderMinutes = parseInt(minutes);
        await this.saveNotificationPreferences();
        console.log(`⏰ Reminder time updated to ${minutes} minutes`);
    }

    async updateNotificationSetting(prayer, enabled) {
        if (!this.prayerSettings) {
            this.prayerSettings = {};
        }
        
        this.prayerSettings[prayer.toLowerCase()] = enabled;
        await this.saveNotificationPreferences();
        console.log(`🔔 ${prayer} notifications ${enabled ? 'enabled' : 'disabled'}`);
    }

    async updatePrayerTimes(times) {
        this.prayerTimes = times;
        console.log('📅 Prayer times updated manually');
    }

    async testNotification() {
        if (!this.notificationsEnabled) {
            await this.requestNotificationPermission();
        }
        
        if (this.notificationsEnabled) {
            this.showTestNotification();
        } else {
            throw new Error('Notification permission not granted');
        }
    }

    getNotificationSettings() {
        return {
            enabled: this.notificationsEnabled,
            reminderMinutes: this.reminderMinutes,
            notifications: this.prayerSettings
        };
    }

    getReminderTime() {
        return this.reminderMinutes;
    }

    isSoundEnabled() {
        return this.notificationSounds !== null;
    }

    async setSoundEnabled(enabled) {
        if (enabled && !this.notificationSounds) {
            this.initializeNotificationSounds();
        } else if (!enabled) {
            this.notificationSounds = null;
        }
        
        // Save preference
        const currentPrefs = JSON.parse(localStorage.getItem('prayerNotifications') || '{}');
        currentPrefs.soundEnabled = enabled;
        localStorage.setItem('prayerNotifications', JSON.stringify(currentPrefs));
    }

    getNextPrayer() {
        if (!this.prayerTimes) return null;

        const now = new Date();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        for (const prayer of prayers) {
            const prayerTime = this.parseTime(this.prayerTimes[prayer]);
            if (prayerTime > now) {
                return {
                    name: prayer,
                    nameArabic: this.getPrayerNameArabic(prayer),
                    time: this.prayerTimes[prayer],
                    timeUntil: this.getTimeUntil(prayerTime)
                };
            }
        }
        
        // If no prayer today, return Fajr tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const fajrTime = this.parseTime(this.prayerTimes.Fajr);
        fajrTime.setDate(tomorrow.getDate());
        
        return {
            name: 'Fajr',
            nameArabic: 'الفجر',
            time: this.prayerTimes.Fajr + ' (غداً)',
            timeUntil: this.getTimeUntil(fajrTime)
        };
    }

    getTimeUntil(targetTime) {
        const now = new Date();
        const diff = targetTime.getTime() - now.getTime();
        
        if (diff <= 0) return 'الآن';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours} ساعة و ${minutes} دقيقة`;
        } else {
            return `${minutes} دقيقة`;
        }
    }

    getStatus() {
        return {
            enabled: this.notificationsEnabled,
            permission: Notification.permission,
            reminderMinutes: this.reminderMinutes,
            prayerSettings: this.prayerSettings,
            nextPrayer: this.getNextPrayer(),
            soundEnabled: this.isSoundEnabled()
        };
    }

    // Cleanup method
    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        console.log('🔔 Prayer Notifications System stopped');
    }
}

// Create global instance
window.prayerNotifications = new PrayerNotifications();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        window.prayerNotifications.init();
    }, 1000);
});

// Console helper for debugging
console.log(`
🔔 Prayer Notifications Loaded!

Available commands:
- prayerNotifications.testNotification() - Test notification
- prayerNotifications.getStatus() - Get current status
- prayerNotifications.updateReminderTime(minutes) - Set reminder time
- prayerNotifications.getNextPrayer() - Get next prayer info

Status: ${window.prayerNotifications ? 'Ready' : 'Loading...'}
`);
