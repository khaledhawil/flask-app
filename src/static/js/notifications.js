// Enhanced Notification Service
class IslamicNotificationService {
    constructor() {
        this.hasPermission = false;
        this.reminders = JSON.parse(localStorage.getItem('islamicReminders')) || {
            fajr: { enabled: true, message: 'وقت صلاة الفجر وأذكار الصباح 🌅' },
            dhuhr: { enabled: true, message: 'وقت صلاة الظهر 🕌' },
            asr: { enabled: true, message: 'وقت صلاة العصر وأذكار المساء 🌆' },
            maghrib: { enabled: true, message: 'وقت صلاة المغرب 🌅' },
            isha: { enabled: true, message: 'وقت صلاة العشاء 🌙' },
            morning_azkar: { enabled: true, message: 'لا تنس أذكار الصباح ☀️' },
            evening_azkar: { enabled: true, message: 'حان وقت أذكار المساء 🌄' },
            sleep_azkar: { enabled: true, message: 'أذكار النوم قبل الراحة 🌙' },
            daily_quran: { enabled: true, message: 'وقت قراءة القرآن اليومية 📖' },
            istighfar: { enabled: true, message: 'توقف للحظة واستغفر الله 🤲' }
        };
        this.scheduledNotifications = new Map();
    }

    async init() {
        await this.requestPermission();
        if (this.hasPermission) {
            this.scheduleAllReminders();
            this.scheduleRecurringReminders();
            this.scheduleWisdomReminders();
            
            // Show welcome notification on first use
            const isFirstUse = !localStorage.getItem('islamicNotificationsInit');
            if (isFirstUse) {
                setTimeout(() => {
                    this.showNotification(
                        'مرحباً بك! 🌙',
                        'تم تفعيل التذكيرات الإسلامية. ستصلك تنبيهات لأوقات الصلاة والأذكار.',
                        { requireInteraction: true }
                    );
                }, 2000);
                localStorage.setItem('islamicNotificationsInit', 'true');
            }
        }
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            this.hasPermission = true;
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            this.hasPermission = permission === 'granted';
            return this.hasPermission;
        }

        return false;
    }

    showNotification(title, message, options = {}) {
        if (!this.hasPermission) return;

        const defaultOptions = {
            icon: '/static/icon.png',
            badge: '/static/badge.png',
            dir: 'rtl',
            lang: 'ar',
            requireInteraction: false,
            silent: false,
            ...options
        };

        // تشغيل الصوت المناسب حسب نوع الإشعار
        this.playNotificationSound(options.type, options.subType);

        const notification = new Notification(title, {
            body: message,
            ...defaultOptions
        });

        // Auto close after 8 seconds for audio notifications
        setTimeout(() => {
            notification.close();
        }, 8000);

        // Handle click
        notification.onclick = function() {
            window.focus();
            if (options.url) {
                window.location.href = options.url;
            }
            notification.close();
        };

        return notification;
    }

    playNotificationSound(type, subType) {
        if (!window.audioManager) return;

        switch(type) {
            case 'prayer':
                window.audioManager.playPrayerSound(subType);
                break;
            case 'azkar':
                window.audioManager.playAzkarSound(subType);
                break;
            case 'quran':
                window.audioManager.playQuranSound();
                break;
            case 'istighfar':
                window.audioManager.playAzkarSound('general');
                break;
            case 'tasbeh':
                window.audioManager.playTasbehSound();
                break;
            default:
                window.audioManager.playGeneralNotification();
        }
    }

    async scheduleAllReminders() {
        // Clear existing scheduled notifications
        this.scheduledNotifications.forEach(timeoutId => clearTimeout(timeoutId));
        this.scheduledNotifications.clear();

        const now = new Date();
        
        // Schedule prayer time reminders
        await this.schedulePrayerReminders(now);
        
        // Schedule daily azkar reminders
        this.scheduleAzkarReminders(now);
        
        // Schedule Quran reading reminder
        this.scheduleQuranReminder(now);
    }

    async schedulePrayerReminders(now) {
        const prayerTimes = await this.getPrayerTimes();
        
        Object.entries(prayerTimes).forEach(([prayer, time]) => {
            if (this.reminders[prayer]?.enabled && time instanceof Date) {
                // Schedule notification 10 minutes before prayer
                const reminderTime = new Date(time.getTime() - 10 * 60 * 1000);
                
                this.scheduleNotificationAt(reminderTime, 
                    `اقتراب موعد صلاة ${this.getPrayerNameArabic(prayer)}`,
                    `متبقي 10 دقائق على صلاة ${this.getPrayerNameArabic(prayer)}`,
                    { url: '/prayer_times', icon: '🕌', type: 'prayer', subType: prayer }
                );
                
                // Schedule exact prayer time notification
                this.scheduleNotificationAt(time,
                    `حان وقت صلاة ${this.getPrayerNameArabic(prayer)}`,
                    this.reminders[prayer].message,
                    { url: '/prayer_times', icon: '🕌', type: 'prayer', subType: prayer }
                );
            }
        });
    }

    scheduleAzkarReminders(now) {
        // Morning azkar - 7:00 AM
        if (this.reminders.morning_azkar.enabled) {
            const morningTime = new Date(now);
            morningTime.setHours(7, 0, 0, 0);
            if (morningTime <= now) {
                morningTime.setDate(morningTime.getDate() + 1);
            }
            this.scheduleNotificationAt(morningTime, 
                'أذكار الصباح',
                this.reminders.morning_azkar.message,
                { url: '/azkar', type: 'azkar', subType: 'morning' }
            );
        }

        // Evening azkar - 6:00 PM
        if (this.reminders.evening_azkar.enabled) {
            const eveningTime = new Date(now);
            eveningTime.setHours(18, 0, 0, 0);
            if (eveningTime <= now) {
                eveningTime.setDate(eveningTime.getDate() + 1);
            }
            this.scheduleNotificationAt(eveningTime, 
                'أذكار المساء',
                this.reminders.evening_azkar.message,
                { url: '/azkar', type: 'azkar', subType: 'evening' }
            );
        }

        // Sleep azkar - 10:00 PM
        if (this.reminders.sleep_azkar.enabled) {
            const sleepTime = new Date(now);
            sleepTime.setHours(22, 0, 0, 0);
            if (sleepTime <= now) {
                sleepTime.setDate(sleepTime.getDate() + 1);
            }
            this.scheduleNotificationAt(sleepTime, 
                'أذكار النوم',
                this.reminders.sleep_azkar.message,
                { url: '/azkar', type: 'azkar', subType: 'sleep' }
            );
        }
    }

    scheduleQuranReminder(now) {
        if (this.reminders.daily_quran.enabled) {
            const quranTime = new Date(now);
            quranTime.setHours(14, 0, 0, 0); // 2:00 PM
            if (quranTime <= now) {
                quranTime.setDate(quranTime.getDate() + 1);
            }
            this.scheduleNotificationAt(quranTime, 
                'قراءة القرآن',
                this.reminders.daily_quran.message,
                { url: '/quran', type: 'quran' }
            );
        }
    }

    scheduleRecurringReminders() {
        // Istighfar reminder every 2 hours
        if (this.reminders.istighfar.enabled) {
            setInterval(() => {
                this.showNotification(
                    'تذكير بالاستغفار',
                    this.reminders.istighfar.message,
                    { url: '/azkar', type: 'istighfar' }
                );
            }, 2 * 60 * 60 * 1000); // 2 hours
        }
    }

    scheduleNotificationAt(targetTime, title, message, options = {}) {
        const now = new Date();
        const timeUntil = targetTime.getTime() - now.getTime();

        if (timeUntil > 0) {
            const timeoutId = setTimeout(() => {
                this.showNotification(title, message, options);
                // Reschedule for next day
                const nextDay = new Date(targetTime);
                nextDay.setDate(nextDay.getDate() + 1);
                this.scheduleNotificationAt(nextDay, title, message, options);
            }, timeUntil);

            this.scheduledNotifications.set(`${title}_${targetTime.getTime()}`, timeoutId);
        }
    }

    updateReminderSettings(reminderType, settings) {
        this.reminders[reminderType] = { ...this.reminders[reminderType], ...settings };
        localStorage.setItem('islamicReminders', JSON.stringify(this.reminders));
        
        // Reschedule reminders
        this.scheduleAllReminders();
    }

    getReminderSettings() {
        return this.reminders;
    }

    async getPrayerTimes() {
        // Check if user has stored location in localStorage first (for both guests and users)
        const storedLocation = localStorage.getItem('islamicAppLocation');
        if (storedLocation) {
            try {
                const location = JSON.parse(storedLocation);
                // Try our public prayer times endpoint first
                try {
                    const response = await fetch(`/get-prayer-times-public?lat=${location.latitude}&lng=${location.longitude}`);
                    if (response.ok) {
                        const data = await response.json();
                        const now = new Date();
                        
                        // Convert prayer time strings to Date objects
                        return {
                            fajr: this.parseTimeToDate(data.Fajr, now),
                            dhuhr: this.parseTimeToDate(data.Dhuhr, now),
                            asr: this.parseTimeToDate(data.Asr, now),
                            maghrib: this.parseTimeToDate(data.Maghrib, now),
                            isha: this.parseTimeToDate(data.Isha, now)
                        };
                    }
                } catch (error) {
                    console.warn('Public prayer times API failed, trying external API:', error);
                }
                
                // Fallback to external API
                const prayerTimes = await this.getPrayerTimesForLocation(location.latitude, location.longitude);
                if (prayerTimes) return prayerTimes;
            } catch (error) {
                console.warn('Error using stored location:', error);
            }
        }
        
        // Try to get user's current location
        if (navigator.geolocation) {
            try {
                const position = await this.getCurrentPosition();
                const prayerTimes = await this.getPrayerTimesForLocation(position.coords.latitude, position.coords.longitude);
                if (prayerTimes) {
                    // Store location for future use
                    localStorage.setItem('islamicAppLocation', JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now()
                    }));
                    return prayerTimes;
                }
            } catch (error) {
                console.warn('Could not get location for prayer times:', error);
            }
        }
        
        // Fallback to default times based on timezone
        return this.getDefaultPrayerTimes();
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: false
            });
        });
    }

    async getPrayerTimesForLocation(lat, lng) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const url = `https://api.aladhan.com/v1/timings/${today}`;
            const params = new URLSearchParams({
                latitude: lat,
                longitude: lng,
                method: 2
            });
            
            const response = await fetch(`${url}?${params}`);
            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    const timings = data.data.timings;
                    const now = new Date();
                    
                    return {
                        fajr: this.parseTimeToDate(timings.Fajr, now),
                        dhuhr: this.parseTimeToDate(timings.Dhuhr, now),
                        asr: this.parseTimeToDate(timings.Asr, now),
                        maghrib: this.parseTimeToDate(timings.Maghrib, now),
                        isha: this.parseTimeToDate(timings.Isha, now)
                    };
                }
            }
        } catch (error) {
            console.warn('Error fetching prayer times from external API:', error);
        }
        return null;
    }

    getDefaultPrayerTimes() {
        // Get approximate prayer times based on timezone
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() / 60;
        
        // Adjust times based on timezone (rough approximation)
        const baseHours = {
            fajr: 5,
            dhuhr: 12,
            asr: 15,
            maghrib: 18,
            isha: 19
        };
        
        return {
            fajr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), baseHours.fajr + Math.floor(timezoneOffset / 4), 30),
            dhuhr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), baseHours.dhuhr, 30),
            asr: new Date(now.getFullYear(), now.getMonth(), now.getDate(), baseHours.asr, 30),
            maghrib: new Date(now.getFullYear(), now.getMonth(), now.getDate(), baseHours.maghrib, 0),
            isha: new Date(now.getFullYear(), now.getMonth(), now.getDate(), baseHours.isha, 30)
        };
    }

    parseTimeToDate(timeString, baseDate) {
        // Parse time string (e.g., "12:30 PM" or "15:30")
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hours, minutes);
    }

    getPrayerNameArabic(prayer) {
        const names = {
            fajr: 'الفجر',
            dhuhr: 'الظهر',
            asr: 'العصر',
            maghrib: 'المغرب',
            isha: 'العشاء'
        };
        return names[prayer] || prayer;
    }

    // Test notification
    testNotification() {
        this.showNotification(
            'تجربة التنبيهات',
            'تم تفعيل التنبيهات الإسلامية بنجاح! 🎉',
            { url: '/azkar' }
        );
    }

    // Show achievement notification
    showAchievement(title, message) {
        this.showNotification(
            `🏆 ${title}`,
            message,
            { 
                requireInteraction: true,
                silent: false,
                url: '/azkar'
            }
        );
    }

    // Show streak notification
    showStreakNotification(days) {
        const messages = {
            3: 'ممتاز! ثلاثة أيام متتالية من الأذكار 🔥',
            7: 'رائع! أسبوع كامل من المحافظة على الأذكار! 🌟',
            30: 'مبروك! شهر كامل من الأذكار المستمرة! 🎊',
            100: 'سبحان الله! 100 يوم من المحافظة على الأذكار! 👑'
        };

        if (messages[days]) {
            this.showAchievement('إنجاز جديد!', messages[days]);
        }
    }

    // Show Islamic wisdom quote notification
    showIslamicWisdom() {
        const quotes = [
            'واذكر ربك كثيراً وسبح بالعشي والإبكار',
            'الدنيا ساعة فاجعلها طاعة',
            'من لم يشكر الناس لم يشكر الله',
            'البر لا يبلى والذنب لا يُنسى والديان لا يموت',
            'المؤمن مألوف، ولا خير فيمن لا يألف ولا يؤلف',
            'خير الناس أنفعهم للناس',
            'لا تغضب ولك الجنة',
            'الكلمة الطيبة صدقة'
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        this.showNotification(
            '💝 حكمة إسلامية',
            randomQuote,
            { 
                requireInteraction: true,
                silent: true 
            }
        );
    }

    // Schedule wisdom reminders
    scheduleWisdomReminders() {
        // Show Islamic wisdom every 4 hours
        setInterval(() => {
            this.showIslamicWisdom();
        }, 4 * 60 * 60 * 1000);
    }

    // Get notification statistics
    getNotificationStats() {
        return {
            totalScheduled: this.scheduledNotifications.size,
            permissionStatus: Notification.permission,
            remindersEnabled: Object.values(this.reminders).filter(r => r.enabled).length,
            totalReminders: Object.keys(this.reminders).length
        };
    }

    // Enable all notifications
    enableAllNotifications() {
        Object.keys(this.reminders).forEach(key => {
            this.reminders[key].enabled = true;
        });
        localStorage.setItem('islamicReminders', JSON.stringify(this.reminders));
        this.scheduleAllReminders();
    }

    // Disable all notifications
    disableAllNotifications() {
        Object.keys(this.reminders).forEach(key => {
            this.reminders[key].enabled = false;
        });
        localStorage.setItem('islamicReminders', JSON.stringify(this.reminders));
        
        // Clear all scheduled notifications
        this.scheduledNotifications.forEach(timeoutId => clearTimeout(timeoutId));
        this.scheduledNotifications.clear();
    }

    // Update notification timing
    updateNotificationTiming(reminderType, hour, minute) {
        // This can be used to customize timing for azkar reminders
        const timing = { hour, minute };
        localStorage.setItem(`islamicTiming_${reminderType}`, JSON.stringify(timing));
        this.scheduleAllReminders();
    }
}

// Initialize notification service when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    window.islamicNotifications = new IslamicNotificationService();
    await window.islamicNotifications.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IslamicNotificationService;
}
