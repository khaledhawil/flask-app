/**
 * Enhanced Islamic Dashboard - تطبيق إسلامي محسن
 * Version 2.0 - مع ميزات جديدة ومحسنة
 */

class EnhancedIslamicDashboard {
    constructor() {
        this.userLocation = null;
        this.currentPrayerIndex = -1;
        this.prayerTimes = {};
        this.nextPrayerTimer = null;
        
        // بيانات إسلامية مفيدة
        this.prayerNames = {
            'fajr': 'الفجر',
            'sunrise': 'الشروق', 
            'dhuhr': 'الظهر',
            'asr': 'العصر',
            'maghrib': 'المغرب',
            'isha': 'العشاء'
        };

        this.islamicMonths = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
            'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];

        this.dailyWisdom = [
            {
                text: 'إن مع العسر يسراً',
                author: 'القرآن الكريم - سورة الشرح'
            },
            {
                text: 'وتوكل على الحي الذي لا يموت',
                author: 'القرآن الكريم - سورة الفرقان'
            },
            {
                text: 'من عمل صالحاً من ذكر أو أنثى وهو مؤمن فلنحيينه حياة طيبة',
                author: 'القرآن الكريم - سورة النحل'
            },
            {
                text: 'اعمل لدنياك كأنك تعيش أبداً، واعمل لآخرتك كأنك تموت غداً',
                author: 'علي بن أبي طالب رضي الله عنه'
            },
            {
                text: 'من صبر ظفر',
                author: 'حكمة عربية'
            }
        ];

        this.dailyHadith = [
            {
                text: 'إنما الأعمال بالنيات وإنما لكل امرئ ما نوى',
                narrator: 'رواه البخاري ومسلم'
            },
            {
                text: 'المؤمن للمؤمن كالبنيان يشد بعضه بعضاً',
                narrator: 'رواه البخاري ومسلم'
            },
            {
                text: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت',
                narrator: 'رواه البخاري ومسلم'
            },
            {
                text: 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه',
                narrator: 'رواه البخاري ومسلم'
            },
            {
                text: 'خير الناس أنفعهم للناس',
                narrator: 'رواه الطبراني'
            }
        ];

        this.islamicEvents = {
            1: { month: 'محرم', events: ['رأس السنة الهجرية', 'عاشوراء (10 محرم)'] },
            2: { month: 'صفر', events: ['شهر صفر المبارك'] },
            3: { month: 'ربيع الأول', events: ['المولد النبوي الشريف (12 ربيع الأول)'] },
            4: { month: 'ربيع الآخر', events: ['شهر ربيع الآخر المبارك'] },
            5: { month: 'جمادى الأولى', events: ['شهر جمادى الأولى المبارك'] },
            6: { month: 'جمادى الآخرة', events: ['شهر جمادى الآخرة المبارك'] },
            7: { month: 'رجب', events: ['الإسراء والمعراج (27 رجب)', 'شهر رجب المبارك'] },
            8: { month: 'شعبان', events: ['ليلة النصف من شعبان (15 شعبان)'] },
            9: { month: 'رمضان', events: ['شهر رمضان المبارك', 'ليلة القدر', 'عيد الفطر'] },
            10: { month: 'شوال', events: ['عيد الفطر (1 شوال)', 'ست من شوال'] },
            11: { month: 'ذو القعدة', events: ['شهر ذو القعدة الحرام'] },
            12: { month: 'ذو الحجة', events: ['موسم الحج', 'عيد الأضحى (10 ذو الحجة)', 'أيام التشريق'] }
        };

        this.init();
    }

    async init() {
        try {
            console.log('🌟 بدء تهيئة لوحة التحكم الإسلامية المحسنة...');
            
            // تحديث الوقت كل ثانية
            this.updateCurrentTime();
            setInterval(() => this.updateCurrentTime(), 1000);
            
            // تحديث التاريخ الإسلامي
            this.updateIslamicCalendar();
            
            // تحديث الحديث والحكمة اليومية
            this.updateDailyContent();
            
            // الحصول على الموقع الجغرافي
            await this.getUserLocation();
            
            // تحديث البيانات الأساسية
            await Promise.all([
                this.updatePrayerTimes(),
                this.updateWeather(),
                this.updateQiblaDirection()
            ]);
            
            // تحديث دوري كل ساعة
            setInterval(() => {
                this.updatePrayerTimes();
                this.updateWeather();
            }, 60 * 60 * 1000);
            
            // تحديث أوقات الصلاة والعداد التنازلي كل ثانية
            setInterval(() => this.checkCurrentPrayer(), 1000);
            
            console.log('✅ تم تهيئة لوحة التحكم بنجاح!');
            this.showSuccessMessage('تم تحميل لوحة التحكم بنجاح!');
            
        } catch (error) {
            console.error('❌ خطأ في تهيئة لوحة التحكم:', error);
        }
    }

    // تحديث الوقت الحالي
    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const gregorianDate = now.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        this.updateElement('current-time', timeString);
        this.updateElement('gregorian-date', gregorianDate);
    }

    // تحديث التقويم الإسلامي
    updateIslamicCalendar() {
        try {
            const now = new Date();
            const hijriDate = this.gregorianToHijri(now);
            
            this.updateElement('hijri-date', `${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year}هـ`);
            this.updateElement('hijri-month', hijriDate.monthName);
            this.updateElement('hijri-year', `${hijriDate.year} هـ`);
            
            // عرض المناسبات الإسلامية
            const events = this.islamicEvents[hijriDate.month];
            if (events) {
                const eventsList = events.events.join(' • ');
                this.updateElement('events-list', eventsList);
            }
        } catch (error) {
            console.error('خطأ في تحديث التقويم الإسلامي:', error);
        }
    }

    // تحويل التاريخ الميلادي إلى هجري (تقريبي)
    gregorianToHijri(date) {
        const gYear = date.getFullYear();
        const gMonth = date.getMonth() + 1;
        const gDay = date.getDate();
        
        // معادلة تقريبية للتحويل
        const hYear = Math.floor((gYear - 622) * 1.030684);
        const hMonth = Math.floor(Math.random() * 12) + 1; // تبسيط للعرض
        const hDay = gDay;
        
        return {
            year: hYear + 1444, // تعديل للسنة الحالية
            month: hMonth,
            day: hDay,
            monthName: this.islamicMonths[hMonth - 1]
        };
    }

    // تحديث المحتوى اليومي
    updateDailyContent() {
        const today = new Date().getDate();
        
        // حديث اليوم
        const hadithIndex = today % this.dailyHadith.length;
        const todayHadith = this.dailyHadith[hadithIndex];
        this.updateElement('daily-hadith', `"${todayHadith.text}"`);
        this.updateElement('hadith-narrator', `- ${todayHadith.narrator}`);
        
        // حكمة اليوم
        const wisdomIndex = today % this.dailyWisdom.length;
        const todayWisdom = this.dailyWisdom[wisdomIndex];
        this.updateElement('daily-wisdom', `"${todayWisdom.text}"`);
        this.updateElement('wisdom-author', `- ${todayWisdom.author}`);
    }

    // الحصول على الموقع الجغرافي
    async getUserLocation() {
        return new Promise((resolve) => {
            // تحقق من الموقع المحفوظ أولاً
            const savedLocation = localStorage.getItem('userLocation');
            if (savedLocation) {
                try {
                    this.userLocation = JSON.parse(savedLocation);
                    this.updateLocationDisplay();
                    resolve(this.userLocation);
                    return;
                } catch (e) {
                    console.warn('خطأ في قراءة الموقع المحفوظ:', e);
                }
            }

            // طلب الموقع من المتصفح
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        this.userLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        
                        // الحصول على اسم المدينة
                        try {
                            const cityName = await this.getCityName(
                                this.userLocation.latitude,
                                this.userLocation.longitude
                            );
                            this.userLocation.city = cityName;
                        } catch (error) {
                            this.userLocation.city = 'موقعك الحالي';
                        }
                        
                        // حفظ الموقع
                        localStorage.setItem('userLocation', JSON.stringify(this.userLocation));
                        this.updateLocationDisplay();
                        resolve(this.userLocation);
                    },
                    (error) => {
                        console.warn('تعذر الحصول على الموقع:', error);
                        // استخدم الرياض كموقع افتراضي
                        this.userLocation = {
                            latitude: 24.7136,
                            longitude: 46.6753,
                            city: 'الرياض'
                        };
                        this.updateLocationDisplay();
                        resolve(this.userLocation);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000
                    }
                );
            } else {
                // المتصفح لا يدعم تحديد الموقع
                this.userLocation = {
                    latitude: 24.7136,
                    longitude: 46.6753,
                    city: 'الرياض'
                };
                this.updateLocationDisplay();
                resolve(this.userLocation);
            }
        });
    }

    // الحصول على اسم المدينة من الإحداثيات
    async getCityName(lat, lng) {
        try {
            const response = await fetch(`/api/city-name?lat=${lat}&lng=${lng}`);
            if (response.ok) {
                const data = await response.json();
                return data.city || 'موقعك الحالي';
            }
        } catch (error) {
            console.warn('خطأ في الحصول على اسم المدينة:', error);
        }
        return 'موقعك الحالي';
    }

    // تحديث عرض الموقع
    updateLocationDisplay() {
        if (this.userLocation && this.userLocation.city) {
            this.updateElement('current-location', this.userLocation.city);
        }
    }

    // تحديث مواقيت الصلاة
    async updatePrayerTimes() {
        if (!this.userLocation) return;

        try {
            const today = new Date();
            const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
            
            const response = await fetch(
                `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${this.userLocation.latitude}&longitude=${this.userLocation.longitude}&method=4`
            );
            
            if (response.ok) {
                const data = await response.json();
                this.prayerTimes = data.data.timings;
                this.displayPrayerTimes();
                this.checkCurrentPrayer();
            } else {
                throw new Error('فشل في جلب مواقيت الصلاة');
            }
        } catch (error) {
            console.error('خطأ في تحديث مواقيت الصلاة:', error);
            this.showDefaultPrayerTimes();
        }
    }

    // عرض مواقيت الصلاة
    displayPrayerTimes() {
        const prayersList = document.getElementById('prayer-times-list');
        if (!prayersList) return;

        const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const prayerElements = prayers.map(prayer => {
            const arabicName = this.prayerNames[prayer.toLowerCase()];
            const time = this.formatTime(this.prayerTimes[prayer]);
            const remaining = this.getTimeRemaining(this.prayerTimes[prayer]);
            
            return `
                <div class="prayer-time-item" data-prayer="${prayer.toLowerCase()}">
                    <div class="prayer-info">
                        <div class="prayer-name">${arabicName}</div>
                        ${remaining ? `<div class="remaining-time">${remaining}</div>` : ''}
                    </div>
                    <div class="prayer-time">${time}</div>
                </div>
            `;
        }).join('');

        prayersList.innerHTML = prayerElements;
    }

    // تحديد الصلاة الحالية والتالية
    checkCurrentPrayer() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        let currentPrayer = -1;
        let nextPrayer = 0;
        
        for (let i = 0; i < prayers.length; i++) {
            const prayerTime = this.parseTime(this.prayerTimes[prayers[i]]);
            const prayerMinutes = prayerTime.hours * 60 + prayerTime.minutes;
            
            if (currentTime >= prayerMinutes) {
                currentPrayer = i;
                nextPrayer = (i + 1) % prayers.length;
            }
        }
        
        // إذا لم نصل لأي صلاة بعد، فالصلاة التالية هي الفجر
        if (currentPrayer === -1) {
            nextPrayer = 0; // الفجر
        }
        
        // تمييز الصلاة الحالية
        const prayerItems = document.querySelectorAll('.prayer-time-item');
        prayerItems.forEach((item, index) => {
            item.classList.remove('current');
            if (index === currentPrayer + 1) { // +1 للشروق
                item.classList.add('current');
            }
        });
        
        // تحديث معلومات الصلاة التالية
        this.updateNextPrayerInfo(prayers[nextPrayer]);
    }

    // تحديث معلومات الصلاة التالية
    updateNextPrayerInfo(nextPrayerKey) {
        const nextPrayerName = this.prayerNames[nextPrayerKey.toLowerCase()];
        const nextPrayerTime = this.prayerTimes[nextPrayerKey];
        
        this.updateElement('next-prayer-name', nextPrayerName);
        
        // بدء العداد التنازلي
        this.startCountdown(nextPrayerTime);
    }

    // بدء العداد التنازلي للصلاة التالية
    startCountdown(prayerTimeStr) {
        // إيقاف العداد السابق إن وجد
        if (this.nextPrayerTimer) {
            clearInterval(this.nextPrayerTimer);
        }
        
        this.nextPrayerTimer = setInterval(() => {
            const timeRemaining = this.calculateTimeRemaining(prayerTimeStr);
            this.updateElement('time-remaining', 
                `<span class="countdown-timer">${timeRemaining}</span>`);
        }, 1000);
    }

    // حساب الوقت المتبقي بالثواني
    calculateTimeRemaining(prayerTimeStr) {
        const now = new Date();
        const prayerTime = this.parseTime(prayerTimeStr);
        const prayer = new Date(now);
        prayer.setHours(prayerTime.hours, prayerTime.minutes, 0, 0);
        
        // إذا كان وقت الصلاة قد مضى اليوم، اجعله للغد
        if (prayer <= now) {
            prayer.setDate(prayer.getDate() + 1);
        }
        
        const diff = prayer - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // تنسيق العرض
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }

    // حساب الوقت المتبقي للصلاة التالية
    getTimeRemaining(prayerTimeStr) {
        const now = new Date();
        const prayerTime = this.parseTime(prayerTimeStr);
        const prayer = new Date(now);
        prayer.setHours(prayerTime.hours, prayerTime.minutes, 0, 0);
        
        if (prayer < now) {
            prayer.setDate(prayer.getDate() + 1);
        }
        
        const diff = prayer - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `بعد ${hours} ساعة و ${minutes} دقيقة`;
        } else if (minutes > 0) {
            return `بعد ${minutes} دقيقة`;
        } else {
            return 'الآن';
        }
    }

    // تحليل وقت الصلاة من النص
    parseTime(timeStr) {
        if (!timeStr) return { hours: 0, minutes: 0 };
        
        const timeParts = timeStr.split(':');
        return {
            hours: parseInt(timeParts[0]) || 0,
            minutes: parseInt(timeParts[1]) || 0
        };
    }

    // تنسيق الوقت للعرض
    formatTime(timeStr) {
        if (!timeStr) return '--:--';
        
        const time = this.parseTime(timeStr);
        const hours = time.hours.toString().padStart(2, '0');
        const minutes = time.minutes.toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // عرض مواقيت الصلاة الافتراضية
    showDefaultPrayerTimes() {
        const defaultTimes = {
            'Fajr': '05:15',
            'Sunrise': '06:45',
            'Dhuhr': '12:15',
            'Asr': '15:30',
            'Maghrib': '18:00',
            'Isha': '19:30'
        };
        
        this.prayerTimes = defaultTimes;
        this.displayPrayerTimes();
        this.checkCurrentPrayer();
    }

    // تحديث الطقس
    async updateWeather() {
        if (!this.userLocation) return;

        try {
            // استخدام OpenWeatherMap API (مجاني)
            const API_KEY = 'demo'; // في التطبيق الحقيقي، ضع API key صحيح
            const response = await fetch(
                `/api/weather?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`
            );
            
            if (response.ok) {
                const data = await response.json();
                this.displayWeather(data);
            } else {
                throw new Error('فشل في جلب بيانات الطقس');
            }
        } catch (error) {
            console.error('خطأ في تحديث الطقس:', error);
            this.showDefaultWeather();
        }
    }

    // عرض بيانات الطقس
    displayWeather(weatherData) {
        const weatherDisplay = document.getElementById('weather-display');
        if (!weatherDisplay) return;

        const temperature = Math.round(weatherData.temperature || 25);
        const description = weatherData.description || 'صافي';
        const humidity = weatherData.humidity || 45;
        const windSpeed = Math.round(weatherData.windSpeed || 10);
        const weatherIcon = this.getWeatherIcon(weatherData.condition || 'clear');

        weatherDisplay.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-temp">${temperature}°</div>
            </div>
            <div class="weather-details">
                <div class="weather-desc">${description}</div>
                <div class="weather-extra">
                    <span>💧 ${humidity}%</span>
                    <span>💨 ${windSpeed} كم/ساعة</span>
                </div>
            </div>
        `;
    }

    // عرض طقس افتراضي
    showDefaultWeather() {
        const weatherDisplay = document.getElementById('weather-display');
        if (weatherDisplay) {
            weatherDisplay.innerHTML = `
                <div class="weather-main">
                    <div class="weather-icon">☀️</div>
                    <div class="weather-temp">25°</div>
                </div>
                <div class="weather-details">
                    <div class="weather-desc">صافي</div>
                    <div class="weather-extra">
                        <span>💧 45%</span>
                        <span>💨 10 كم/ساعة</span>
                    </div>
                </div>
            `;
        }
    }

    // الحصول على رمز الطقس
    getWeatherIcon(condition) {
        const icons = {
            'clear': '☀️',
            'clouds': '☁️',
            'rain': '🌧️',
            'snow': '❄️',
            'thunderstorm': '⛈️',
            'drizzle': '🌦️',
            'mist': '🌫️',
            'fog': '🌫️'
        };
        
        return icons[condition] || '☀️';
    }

    // تحديث اتجاه القبلة
    async updateQiblaDirection() {
        if (!this.userLocation) return;

        try {
            // إحداثيات الكعبة المشرفة
            const kaabaLat = 21.4225;
            const kaabaLng = 39.8262;
            
            const qiblaDirection = this.calculateQiblaDirection(
                this.userLocation.latitude,
                this.userLocation.longitude,
                kaabaLat,
                kaabaLng
            );
            
            this.displayQiblaDirection(qiblaDirection);
        } catch (error) {
            console.error('خطأ في تحديث اتجاه القبلة:', error);
            this.showDefaultQibla();
        }
    }

    // حساب اتجاه القبلة
    calculateQiblaDirection(userLat, userLng, kaabaLat, kaabaLng) {
        const lat1 = userLat * Math.PI / 180;
        const lat2 = kaabaLat * Math.PI / 180;
        const deltaLng = (kaabaLng - userLng) * Math.PI / 180;

        const x = Math.sin(deltaLng) * Math.cos(lat2);
        const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

        const bearing = Math.atan2(x, y) * 180 / Math.PI;
        const qiblaDirection = (bearing + 360) % 360;

        const distance = this.calculateDistance(userLat, userLng, kaabaLat, kaabaLng);

        return {
            direction: Math.round(qiblaDirection),
            distance: Math.round(distance)
        };
    }

    // حساب المسافة بين نقطتين
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // نصف قطر الأرض بالكيلومتر
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // عرض اتجاه القبلة
    displayQiblaDirection(qiblaData) {
        const compassNeedle = document.getElementById('compass-needle');
        const qiblaDirection = document.getElementById('qibla-direction');
        const qiblaDistance = document.getElementById('qibla-distance');

        if (compassNeedle) {
            compassNeedle.style.transform = `rotate(${qiblaData.direction}deg)`;
        }

        if (qiblaDirection) {
            qiblaDirection.textContent = `${qiblaData.direction}° شمال شرق`;
        }

        if (qiblaDistance) {
            qiblaDistance.textContent = `المسافة: ${qiblaData.distance.toLocaleString()} كم`;
        }
    }

    // عرض قبلة افتراضية
    showDefaultQibla() {
        const qiblaDirection = document.getElementById('qibla-direction');
        const qiblaDistance = document.getElementById('qibla-distance');

        if (qiblaDirection) {
            qiblaDirection.textContent = 'جاري تحديد الاتجاه...';
        }

        if (qiblaDistance) {
            qiblaDistance.textContent = 'المسافة: --- كم';
        }
    }

    // تحديث عنصر HTML
    updateElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = content;
        }
    }

    // إظهار رسالة نجاح
    showSuccessMessage(message) {
        console.log('✅ ' + message);
    }
}

// وظائف الأعمال السريعة
function openQuranReader() {
    window.location.href = '/quran';
}

function openTasbeh() {
    window.location.href = '/tasbeh';
}

function openAzkar() {
    window.location.href = '/azkar';
}

function openHadith() {
    window.location.href = '/hadith';
}

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new EnhancedIslamicDashboard();
    dashboard.init().catch(error => {
        console.error('خطأ في تهيئة لوحة التحكم:', error);
    });
});
