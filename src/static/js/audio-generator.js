// مولد الأصوات التجريبية للتطبيق الإسلامي
class AudioGenerator {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
    }

    // إنشاء AudioContext
    async initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
        }
        return this.audioContext;
    }

    // إنشاء صوت أذان بسيط
    async generateAdhanSound(duration = 5000) {
        const context = await this.initAudioContext();
        
        // نغمات الأذان التقليدية
        const frequencies = [
            { freq: 440, duration: 0.8 }, // لا
            { freq: 494, duration: 0.4 }, // سي
            { freq: 523, duration: 0.6 }, // دو
            { freq: 587, duration: 0.5 }, // ري
            { freq: 523, duration: 0.7 }, // دو
            { freq: 494, duration: 0.6 }, // سي
            { freq: 440, duration: 1.2 }  // لا
        ];

        return this.playMelody(frequencies, context);
    }

    // إنشاء صوت للأذكار
    async generateDhikrSound(duration = 3000) {
        const context = await this.initAudioContext();
        
        // نغمات هادئة للأذكار
        const frequencies = [
            { freq: 330, duration: 0.5 }, // مي
            { freq: 392, duration: 0.5 }, // صول
            { freq: 440, duration: 0.8 }, // لا
            { freq: 392, duration: 0.6 }, // صول
            { freq: 330, duration: 0.6 }  // مي
        ];

        return this.playMelody(frequencies, context);
    }

    // إنشاء صوت للقرآن
    async generateQuranSound(duration = 4000) {
        const context = await this.initAudioContext();
        
        // نغمات روحانية
        const frequencies = [
            { freq: 261, duration: 0.6 }, // دو
            { freq: 329, duration: 0.5 }, // مي
            { freq: 392, duration: 0.7 }, // صول
            { freq: 523, duration: 0.8 }, // دو عالي
            { freq: 392, duration: 0.5 }, // صول
            { freq: 329, duration: 0.4 }, // مي
            { freq: 261, duration: 0.8 }  // دو
        ];

        return this.playMelody(frequencies, context);
    }

    // إنشاء صوت التسبيح
    async generateTasbihSound() {
        const context = await this.initAudioContext();
        
        // صوت قصير وهادئ
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.setValueAtTime(523, context.currentTime); // دو
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
        
        return new Promise(resolve => {
            oscillator.onended = resolve;
        });
    }

    // إنشاء صوت إشعار عام
    async generateGeneralNotification() {
        const context = await this.initAudioContext();
        
        // صوت إشعار بسيط
        const frequencies = [
            { freq: 440, duration: 0.2 },
            { freq: 523, duration: 0.3 }
        ];

        return this.playMelody(frequencies, context);
    }

    // تشغيل مجموعة من النغمات
    async playMelody(frequencies, context) {
        let startTime = context.currentTime;
        
        for (const note of frequencies) {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, startTime);
            oscillator.type = 'sine';
            
            // تأثير تلاشي
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + note.duration);
            
            startTime += note.duration;
        }
        
        return new Promise(resolve => {
            setTimeout(resolve, startTime * 1000);
        });
    }

    // إنشاء ملف صوتي وحفظه
    async generateAndSaveAudio(type, filename) {
        try {
            let audioBuffer;
            
            switch(type) {
                case 'adhan':
                    audioBuffer = await this.generateAdhanSound();
                    break;
                case 'dhikr':
                    audioBuffer = await this.generateDhikrSound();
                    break;
                case 'quran':
                    audioBuffer = await this.generateQuranSound();
                    break;
                case 'tasbih':
                    audioBuffer = await this.generateTasbihSound();
                    break;
                case 'notification':
                    audioBuffer = await this.generateGeneralNotification();
                    break;
                default:
                    throw new Error('نوع صوت غير مدعوم');
            }
            
            console.log(`تم إنشاء صوت ${type} بنجاح`);
            return audioBuffer;
            
        } catch (error) {
            console.error(`خطأ في إنشاء الصوت ${type}:`, error);
            throw error;
        }
    }
}

// إنشاء مثيل واحد من مولد الأصوات
window.audioGenerator = new AudioGenerator();

// دالة لإنشاء جميع الأصوات التجريبية
async function generateAllDemoSounds() {
    const generator = window.audioGenerator;
    
    try {
        console.log('بدء إنشاء الأصوات التجريبية...');
        
        // إنشاء أصوات مختلفة
        await generator.generateAndSaveAudio('adhan', 'adhan-standard');
        await generator.generateAndSaveAudio('dhikr', 'azkar-morning');
        await generator.generateAndSaveAudio('dhikr', 'azkar-evening');
        await generator.generateAndSaveAudio('dhikr', 'azkar-sleep');
        await generator.generateAndSaveAudio('quran', 'quran-notification');
        await generator.generateAndSaveAudio('tasbih', 'tasbeh-sound');
        await generator.generateAndSaveAudio('notification', 'notification-general');
        
        console.log('تم إنشاء جميع الأصوات التجريبية بنجاح!');
        
    } catch (error) {
        console.error('خطأ في إنشاء الأصوات:', error);
    }
}

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioGenerator;
}
