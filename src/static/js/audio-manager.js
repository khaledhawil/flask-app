// مدير الأصوات للإشعارات الإسلامية
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {
            // أصوات الأذان والصلاة
            prayer: {
                fajr: '/static/audio/azan-fajr.wav',
                dhuhr: '/static/audio/azan-regular.wav',
                asr: '/static/audio/azan-regular.wav',
                maghrib: '/static/audio/azan-regular.wav',
                isha: '/static/audio/azan-regular.wav'
            },
            // أصوات الأذكار
            azkar: {
                morning: '/static/audio/dhikr-morning.wav',
                evening: '/static/audio/dhikr-evening.wav',
                sleep: '/static/audio/dhikr-sleep.wav',
                general: '/static/audio/dhikr-general.wav'
            },
            // أصوات أخرى
            quran: '/static/audio/quran.wav',
            istighfar: '/static/audio/dhikr-general.wav',
            tasbeh: '/static/audio/tasbeh.wav',
            general: '/static/audio/notification.wav'
        };
        
        // إعدادات الصوت المحفوظة
        this.settings = JSON.parse(localStorage.getItem('audioSettings')) || {
            enabled: true,
            volume: 0.7,
            muteAt: { start: '23:00', end: '06:00' }, // وضع صامت في الليل
            useVibration: true
        };
        
        this.initAudio();
    }

    async initAudio() {
        try {
            // إنشاء AudioContext عند أول تفاعل مع المستخدم
            document.addEventListener('click', () => {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
            }, { once: true });
            
            // تحميل مسبق للأصوات المهمة
            await this.preloadCriticalSounds();
        } catch (error) {
            console.error('خطأ في تهيئة مدير الصوت:', error);
        }
    }

    async preloadCriticalSounds() {
        const criticalSounds = [
            this.sounds.prayer.fajr,
            this.sounds.prayer.dhuhr,
            this.sounds.azkar.morning,
            this.sounds.general
        ];

        for (const soundUrl of criticalSounds) {
            try {
                await this.preloadSound(soundUrl);
            } catch (error) {
                console.warn(`فشل في تحميل الصوت: ${soundUrl}`, error);
            }
        }
    }

    preloadSound(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.addEventListener('canplaythrough', resolve);
            audio.addEventListener('error', reject);
            audio.src = url;
            audio.load();
        });
    }

    isQuietTime() {
        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const startTime = parseInt(this.settings.muteAt.start.replace(':', ''));
        const endTime = parseInt(this.settings.muteAt.end.replace(':', ''));
        
        if (startTime > endTime) {
            // عبر منتصف الليل
            return currentTime >= startTime || currentTime <= endTime;
        } else {
            return currentTime >= startTime && currentTime <= endTime;
        }
    }

    async playPrayerSound(prayerName) {
        if (!this.settings.enabled || this.isQuietTime()) {
            this.vibrate([200, 100, 200]); // اهتزاز بديل
            return;
        }

        const soundUrl = this.sounds.prayer[prayerName] || this.sounds.prayer.dhuhr;
        await this.playSound(soundUrl, {
            volume: this.settings.volume,
            fade: true,
            duration: 30000 // 30 ثانية كحد أقصى
        });
    }

    async playAzkarSound(azkarType = 'general') {
        if (!this.settings.enabled || this.isQuietTime()) {
            this.vibrate([100, 50, 100]);
            return;
        }

        const soundUrl = this.sounds.azkar[azkarType] || this.sounds.azkar.general;
        await this.playSound(soundUrl, {
            volume: this.settings.volume * 0.8,
            fade: true,
            duration: 15000 // 15 ثانية
        });
    }

    async playQuranSound() {
        if (!this.settings.enabled || this.isQuietTime()) {
            this.vibrate([150, 100, 150]);
            return;
        }

        await this.playSound(this.sounds.quran, {
            volume: this.settings.volume * 0.9,
            fade: true,
            duration: 20000
        });
    }

    async playTasbehSound() {
        if (!this.settings.enabled) return;

        await this.playSound(this.sounds.tasbeh, {
            volume: this.settings.volume * 0.5,
            duration: 2000 // صوت قصير للتسبيح
        });
    }

    async playGeneralNotification() {
        if (!this.settings.enabled || this.isQuietTime()) {
            this.vibrate([100]);
            return;
        }

        await this.playSound(this.sounds.general, {
            volume: this.settings.volume * 0.6,
            duration: 5000
        });
    }

    async playSound(url, options = {}) {
        try {
            // محاولة تشغيل الملف الصوتي أولاً
            const audio = new Audio(url);
            audio.volume = options.volume || this.settings.volume;
            
            // إعداد التلاشي
            if (options.fade) {
                audio.volume = 0;
                const fadeInterval = setInterval(() => {
                    if (audio.volume < (options.volume || this.settings.volume)) {
                        audio.volume = Math.min(audio.volume + 0.05, options.volume || this.settings.volume);
                    } else {
                        clearInterval(fadeInterval);
                    }
                }, 100);
            }

            // تشغيل الصوت
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                await playPromise;
            }

            // إيقاف الصوت بعد المدة المحددة
            if (options.duration) {
                setTimeout(() => {
                    if (!audio.paused) {
                        this.fadeOut(audio, 1000).then(() => {
                            audio.pause();
                            audio.currentTime = 0;
                        });
                    }
                }, options.duration);
            }

        } catch (error) {
            console.warn('فشل في تشغيل الملف الصوتي، سيتم استخدام الصوت التجريبي:', error);
            
            // استخدام مولد الأصوات التجريبية كبديل
            await this.playGeneratedSound(url, options);
        }
    }

    async playGeneratedSound(originalUrl, options = {}) {
        try {
            if (!window.audioGenerator) {
                console.error('مولد الأصوات غير متاح');
                this.vibrate([200, 100, 200]);
                return;
            }

            // تحديد نوع الصوت بناءً على المسار
            let soundType = 'notification';
            if (originalUrl.includes('adhan')) soundType = 'adhan';
            else if (originalUrl.includes('azkar') || originalUrl.includes('dhikr')) soundType = 'dhikr';
            else if (originalUrl.includes('quran')) soundType = 'quran';
            else if (originalUrl.includes('tasbeh')) soundType = 'tasbih';

            // تشغيل الصوت المولد
            await window.audioGenerator.generateAndSaveAudio(soundType);
            
        } catch (error) {
            console.error('خطأ في تشغيل الصوت المولد:', error);
            // استخدام الاهتزاز كبديل أخير
            this.vibrate([200, 100, 200]);
        }
    }

    fadeOut(audio, duration = 1000) {
        return new Promise((resolve) => {
            const initialVolume = audio.volume;
            const fadeInterval = setInterval(() => {
                if (audio.volume > 0.05) {
                    audio.volume = Math.max(audio.volume - (initialVolume / (duration / 100)), 0);
                } else {
                    audio.volume = 0;
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, 100);
        });
    }

    vibrate(pattern) {
        if (this.settings.useVibration && 'vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    // إعدادات الصوت
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('audioSettings', JSON.stringify(this.settings));
    }

    getSettings() {
        return { ...this.settings };
    }

    // اختبار الأصوات
    async testPrayerSound(prayerName) {
        const originalSettings = { ...this.settings };
        this.settings.enabled = true;
        this.settings.muteAt = { start: '00:00', end: '00:00' }; // إلغاء الوضع الصامت للاختبار
        
        await this.playPrayerSound(prayerName);
        
        this.settings = originalSettings;
    }

    async testAzkarSound(azkarType) {
        const originalSettings = { ...this.settings };
        this.settings.enabled = true;
        this.settings.muteAt = { start: '00:00', end: '00:00' };
        
        await this.playAzkarSound(azkarType);
        
        this.settings = originalSettings;
    }
}

// إنشاء مثيل واحد لمدير الصوت
window.audioManager = new AudioManager();

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
