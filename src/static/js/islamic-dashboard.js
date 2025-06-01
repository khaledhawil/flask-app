/**
 * Islamic Dashboard - Main JavaScript File
 * تطبيق إسلامي شامل - الصفحة الرئيسية
 */

class IslamicDashboard {
    constructor() {
        this.userLocation = null;
        this.currentPrayerIndex = -1;
        this.dhikrCount = 0;
        this.dhikrTexts = [
            'سبحان الله وبحمده',
            'لا إله إلا الله',
            'الله أكبر',
            'الحمد لله رب العالمين',
            'أستغفر الله العظيم',
            'لا حول ولا قوة إلا بالله',
            'سبحان الله العظيم',
            'بسم الله الرحمن الرحيم'
        ];
        this.currentDhikrIndex = 0;
        this.prayerNames = {
            'fajr': 'الفجر',
            'dhuhr': 'الظهر',
            'asr': 'العصر',
            'maghrib': 'المغرب',
            'isha': 'العشاء'
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('بدء تهيئة لوحة التحكم الإسلامية...');
            
            // تحديث الوقت كل ثانية
            this.updateCurrentTime();
            setInterval(() => this.updateCurrentTime(), 1000);
            
            // تحديث الحديث اليومي
            this.updateDailyHadith();
            
            // تحميل البيانات المحفوظة
            this.loadSavedData();
            
            // الحصول على الموقع الجغرافي
            await this.getUserLocation();
            
            // تحديث عرض الموقع
            this.updateLocationDisplay();
            
            // تحديث جميع المكونات
            await Promise.all([
                this.updatePrayerTimes(),
                this.updateWeather(),
                this.updateQiblaDirection(),
                this.updateIslamicDate()
            ]);
            
            // تحديث دوري كل 5 دقائق
            setInterval(() => {
                this.updatePrayerTimes();
                this.updateWeather();
            }, 5 * 60 * 1000);
            
            console.log('تم تهيئة لوحة التحكم بنجاح ✅');
            
        } catch (error) {
            console.error('خطأ في تهيئة لوحة التحكم:', error);
            this.showFallbackData();
        }
    }

    // تحديث الوقت الحالي
    updateCurrentTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const timeString = now.toLocaleDateString('ar-SA', options);
        this.updateElement('current-time', timeString);
    }

    // الحصول على الموقع الجغرافي
    async getUserLocation() {
        try {
            // التحقق من الموقع المحفوظ
            const savedLocation = localStorage.getItem('userLocation');
            if (savedLocation) {
                this.userLocation = JSON.parse(savedLocation);
                console.log('تم استخدام الموقع المحفوظ:', this.userLocation);
                return;
            }

            // طلب الموقع من المتصفح
            if (navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 10000,
                        enableHighAccuracy: true
                    });
                });

                this.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    city: 'موقعك الحالي'
                };

                // محاولة الحصول على اسم المدينة
                try {
                    const cityName = await this.getCityName(this.userLocation.latitude, this.userLocation.longitude);
                    this.userLocation.city = cityName;
                } catch (e) {
                    console.warn('تعذر الحصول على اسم المدينة:', e);
                }

                // حفظ الموقع
                localStorage.setItem('userLocation', JSON.stringify(this.userLocation));
                console.log('تم الحصول على الموقع الجغرافي:', this.userLocation);

            } else {
                throw new Error('Geolocation not supported');
            }

        } catch (error) {
            console.warn('تعذر الحصول على الموقع، استخدام الموقع الافتراضي (الرياض):', error.message);
            this.userLocation = {
                latitude: 24.7136,
                longitude: 46.6753,
                city: 'الرياض'
            };
        }
    }

    // الحصول على اسم المدينة من الإحداثيات
    async getCityName(lat, lon) {
        try {
            const response = await fetch(`/api/city-name?lat=${lat}&lon=${lon}`);
            if (response.ok) {
                const data = await response.json();
                return data.city || 'موقعك الحالي';
            }
        } catch (error) {
            console.warn('خطأ في الحصول على اسم المدينة:', error);
        }
        return 'موقعك الحالي';
    }

    // تحديث مواقيت الصلاة
    async updatePrayerTimes() {
        try {
            if (!this.userLocation) return;

            const response = await fetch(`/api/prayer-times?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`);
            const data = await response.json();

            if (data.success && data.prayer_times) {
                this.displayPrayerTimes(data.prayer_times);
                this.findCurrentPrayer(data.prayer_times);
            } else {
                throw new Error(data.error || 'فشل في الحصول على مواقيت الصلاة');
            }

        } catch (error) {
            console.error('خطأ في تحديث مواقيت الصلاة:', error);
            this.showFallbackPrayerTimes();
        }
    }

    // عرض مواقيت الصلاة
    displayPrayerTimes(prayerTimes) {
        const container = document.getElementById('prayer-times-list');
        if (!container) return;

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        let html = '';
        let currentPrayerFound = false;

        Object.entries(prayerTimes).forEach(([prayer, time]) => {
            const prayerName = this.prayerNames[prayer] || prayer;
            const [hours, minutes] = time.split(':').map(Number);
            const prayerTimeInMinutes = hours * 60 + minutes;
            
            const isCurrentPrayer = !currentPrayerFound && prayerTimeInMinutes > currentTimeInMinutes;
            if (isCurrentPrayer) {
                currentPrayerFound = true;
                this.currentPrayerIndex = Object.keys(prayerTimes).indexOf(prayer);
            }

            html += `
                <div class="prayer-item ${isCurrentPrayer ? 'current' : ''}">
                    <span class="prayer-name">${prayerName}</span>
                    <span class="prayer-time">${time}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // إيجاد الصلاة الحالية والتالية مع تحسينات
    findCurrentPrayer(prayerTimes) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = Object.entries(prayerTimes);
        let nextPrayer = null;
        let currentPrayer = null;
        
        // تحويل أوقات الصلاة إلى دقائق
        const prayerTimesInMinutes = prayers.map(([key, time]) => {
            const [hours, minutes] = time.split(':').map(Number);
            return {
                key,
                name: this.prayerNames[key],
                time,
                minutes: hours * 60 + minutes
            };
        });
        
        // البحث عن الصلاة الحالية والتالية
        for (let i = 0; i < prayerTimesInMinutes.length; i++) {
            const prayer = prayerTimesInMinutes[i];
            
            if (prayer.minutes > currentTime) {
                nextPrayer = prayer;
                currentPrayer = i > 0 ? prayerTimesInMinutes[i - 1] : null;
                break;
            }
        }
        
        // إذا لم نجد صلاة تالية، فالصلاة التالية هي فجر الغد
        if (!nextPrayer && prayerTimesInMinutes.length > 0) {
            nextPrayer = prayerTimesInMinutes[0];
            nextPrayer.isNextDay = true;
            currentPrayer = prayerTimesInMinutes[prayerTimesInMinutes.length - 1];
        }
        
        // تحديث العرض
        if (nextPrayer) {
            const timeRemaining = this.calculateTimeRemaining(currentTime, nextPrayer.minutes, nextPrayer.isNextDay);
            console.log(`الصلاة التالية: ${nextPrayer.name} في ${nextPrayer.time} - متبقي: ${timeRemaining}`);
            
            // إضافة معلومات الصلاة التالية للواجهة إذا كان هناك عنصر لعرضها
            this.updateNextPrayerDisplay(nextPrayer, timeRemaining);
        }
        
        if (currentPrayer) {
            console.log(`الصلاة الحالية: ${currentPrayer.name}`);
        }
    }

    // حساب الوقت المتبقي للصلاة التالية
    calculateTimeRemaining(currentTime, nextPrayerTime, isNextDay = false) {
        let remainingMinutes;
        
        if (isNextDay) {
            // إضافة 24 ساعة للصلاة التالية في اليوم التالي
            remainingMinutes = (24 * 60) - currentTime + nextPrayerTime;
        } else {
            remainingMinutes = nextPrayerTime - currentTime;
        }
        
        const hours = Math.floor(remainingMinutes / 60);
        const minutes = remainingMinutes % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // تحديث عرض الصلاة التالية (إذا كان هناك عنصر في HTML)
    updateNextPrayerDisplay(nextPrayer, timeRemaining) {
        const nextPrayerElement = document.getElementById('next-prayer');
        const timeRemainingElement = document.getElementById('time-remaining');
        
        if (nextPrayerElement) {
            nextPrayerElement.textContent = nextPrayer.name;
        }
        
        if (timeRemainingElement) {
            timeRemainingElement.textContent = timeRemaining;
        }
    }

    // عرض مواقيت افتراضية في حالة الخطأ
    showFallbackPrayerTimes() {
        const fallbackTimes = {
            'fajr': '05:30',
            'dhuhr': '12:15',
            'asr': '15:45',
            'maghrib': '18:20',
            'isha': '19:50'
        };
        this.displayPrayerTimes(fallbackTimes);
    }

    // تحديث بيانات الطقس
    async updateWeather() {
        try {
            if (!this.userLocation) return;

            const response = await fetch(`/api/weather?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`);
            const data = await response.json();

            if (data.success && data.weather) {
                this.displayWeather(data.weather);
            } else {
                throw new Error(data.error || 'فشل في الحصول على بيانات الطقس');
            }

        } catch (error) {
            console.error('خطأ في تحديث الطقس:', error);
            this.showFallbackWeather();
        }
    }

    // عرض بيانات الطقس مع اسم المدينة المحسن
    displayWeather(weather) {
        const container = document.getElementById('weather-display');
        if (!container) return;

        const weatherIcon = this.getWeatherIcon(weather.icon || '01d');
        
        // استخدام اسم المدينة من موقع المستخدم
        const cityName = this.userLocation?.city || weather.city || 'موقعك الحالي';
        
        container.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-temp">${weather.temperature}°</div>
            </div>
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="font-weight: 600; color: var(--primary-gold); font-size: 1.1rem;">
                    <span class="location-icon">📍</span> ${cityName}
                </div>
                <div style="opacity: 0.8; margin-top: 5px;">${weather.description}</div>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-label">الإحساس</div>
                    <div class="weather-detail-value">${weather.feels_like}°</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">الرطوبة</div>
                    <div class="weather-detail-value">${weather.humidity}%</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">الشروق</div>
                    <div class="weather-detail-value">${weather.sunrise}</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">الغروب</div>
                    <div class="weather-detail-value">${weather.sunset}</div>
                </div>
            </div>
        `;
    }

    // الحصول على أيقونة الطقس
    getWeatherIcon(iconCode) {
        const icons = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return icons[iconCode] || '🌤️';
    }

    // عرض طقس افتراضي في حالة الخطأ
    showFallbackWeather() {
        const fallbackWeather = {
            temperature: 25,
            feels_like: 28,
            humidity: 45,
            description: 'صافي',
            city: this.userLocation?.city || 'موقعك الحالي',
            sunrise: '06:00',
            sunset: '18:30',
            icon: '01d'
        };
        this.displayWeather(fallbackWeather);
    }

    // تحديث اتجاه القبلة
    async updateQiblaDirection() {
        try {
            if (!this.userLocation) return;

            const response = await fetch(`/api/qibla?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`);
            const data = await response.json();

            if (data.success && data.qibla_direction !== undefined) {
                this.displayQiblaDirection(data.qibla_direction);
            } else {
                throw new Error(data.error || 'فشل في حساب اتجاه القبلة');
            }

        } catch (error) {
            console.error('خطأ في تحديث اتجاه القبلة:', error);
            this.showFallbackQibla();
        }
    }

    // عرض اتجاه القبلة مع البوصلة المحسنة
    displayQiblaDirection(direction) {
        const needle = document.getElementById('compass-needle');
        const degreesElement = document.getElementById('qibla-degrees');
        
        if (needle) {
            needle.style.transform = `translateX(-50%) rotate(${direction}deg)`;
        }
        
        if (degreesElement) {
            const directionName = this.getDirectionName(direction);
            degreesElement.innerHTML = `
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-gold);">${Math.round(direction)}°</div>
                <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">${directionName}</div>
            `;
        }

        // إضافة البوصلة التفاعلية إذا متاحة
        this.addCompassInteractivity(direction);
    }

    // الحصول على اسم الاتجاه
    getDirectionName(degrees) {
        const directions = [
            { name: 'شمال', min: 0, max: 22.5 },
            { name: 'شمال شرق', min: 22.5, max: 67.5 },
            { name: 'شرق', min: 67.5, max: 112.5 },
            { name: 'جنوب شرق', min: 112.5, max: 157.5 },
            { name: 'جنوب', min: 157.5, max: 202.5 },
            { name: 'جنوب غرب', min: 202.5, max: 247.5 },
            { name: 'غرب', min: 247.5, max: 292.5 },
            { name: 'شمال غرب', min: 292.5, max: 337.5 },
            { name: 'شمال', min: 337.5, max: 360 }
        ];

        for (let direction of directions) {
            if (degrees >= direction.min && degrees < direction.max) {
                return direction.name;
            }
        }
        return 'شمال';
    }

    // إضافة التفاعل للبوصلة
    addCompassInteractivity(qiblaDirection) {
        if ('DeviceOrientationEvent' in window) {
            // محاولة استخدام اتجاه الجهاز للبوصلة الحقيقية
            window.addEventListener('deviceorientation', (event) => {
                if (event.alpha !== null) {
                    const deviceHeading = 360 - event.alpha;
                    const relativeQibla = (qiblaDirection - deviceHeading + 360) % 360;
                    
                    const needle = document.getElementById('compass-needle');
                    if (needle) {
                        needle.style.transform = `translateX(-50%) rotate(${relativeQibla}deg)`;
                    }
                }
            });
        }
    }

    // عرض قبلة افتراضية
    showFallbackQibla() {
        this.displayQiblaDirection(45); // اتجاه افتراضي
    }

    // تحديث التقويم الإسلامي
    async updateIslamicDate() {
        try {
            const response = await fetch('/api/islamic-date');
            const data = await response.json();

            if (data.success) {
                this.updateElement('hijri-date', data.hijri_date);
                this.updateElement('gregorian-date', data.gregorian_date);
            } else {
                throw new Error(data.error || 'فشل في الحصول على التاريخ الهجري');
            }

        } catch (error) {
            console.error('خطأ في تحديث التقويم الإسلامي:', error);
            this.showFallbackDate();
        }
    }

    // عرض تاريخ افتراضي
    showFallbackDate() {
        const today = new Date();
        const gregorianDate = today.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        this.updateElement('hijri-date', 'التاريخ الهجري غير متاح');
        this.updateElement('gregorian-date', gregorianDate);
    }

    // تحميل البيانات المحفوظة
    loadSavedData() {
        try {
            // تحميل عداد الأذكار
            const savedDhikrCount = localStorage.getItem('dailyDhikrCount');
            if (savedDhikrCount) {
                this.dhikrCount = parseInt(savedDhikrCount, 10) || 0;
                this.updateElement('dhikr-count', this.dhikrCount);
            }

            // تحميل الإحصائيات اليومية
            const stats = {
                dhikr: localStorage.getItem('dailyDhikr') || '0',
                quran: localStorage.getItem('dailyQuran') || '0',
                prayers: localStorage.getItem('dailyPrayers') || '0',
                tasbeh: localStorage.getItem('dailyTasbeh') || '0'
            };

            this.updateElement('daily-dhikr', stats.dhikr);
            this.updateElement('daily-quran', stats.quran);
            this.updateElement('daily-prayers', stats.prayers);
            this.updateElement('daily-tasbeh', stats.tasbeh);

            // تحديث نص الذكر الحالي
            const currentDhikr = this.dhikrTexts[this.currentDhikrIndex];
            this.updateElement('current-dhikr', currentDhikr);

        } catch (error) {
            console.error('خطأ في تحميل البيانات المحفوظة:', error);
        }
    }

    // حفظ البيانات
    saveData() {
        try {
            localStorage.setItem('dailyDhikrCount', this.dhikrCount.toString());
            
            // حفظ الإحصائيات
            const currentDhikr = parseInt(localStorage.getItem('dailyDhikr') || '0');
            localStorage.setItem('dailyDhikr', (currentDhikr + 1).toString());
            
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
        }
    }

    // عرض بيانات افتراضية في حالة الخطأ الكامل
    showFallbackData() {
        console.log('عرض البيانات الافتراضية...');
        
        this.showFallbackPrayerTimes();
        this.showFallbackWeather();
        this.showFallbackQibla();
        this.showFallbackDate();
        
        // عرض رسالة للمستخدم
        const container = document.querySelector('.dashboard-container');
        if (container) {
            const notice = document.createElement('div');
            notice.style.cssText = `
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                text-align: center;
                color: #ffc107;
            `;
            notice.innerHTML = '⚠️ يتم عرض بيانات افتراضية - تحقق من اتصال الإنترنت';
            container.insertBefore(notice, container.firstChild);
        }
    }

    // تحديث عنصر في الصفحة بأمان
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // زيادة عداد الأذكار
    incrementDhikr() {
        this.dhikrCount++;
        this.updateElement('dhikr-count', this.dhikrCount);
        
        // تغيير الذكر كل 33 مرة
        if (this.dhikrCount % 33 === 0) {
            this.currentDhikrIndex = (this.currentDhikrIndex + 1) % this.dhikrTexts.length;
            const newDhikr = this.dhikrTexts[this.currentDhikrIndex];
            this.updateElement('current-dhikr', newDhikr);
        }
        
        // حفظ البيانات
        this.saveData();
        
        // تحديث الإحصائيات
        const currentCount = parseInt(document.getElementById('daily-dhikr').textContent) || 0;
        this.updateElement('daily-dhikr', currentCount + 1);
        
        // تأثير بصري
        const button = document.querySelector('.dhikr-btn');
        if (button) {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // تحديث الحديث اليومي
    updateDailyHadith() {
        const hadithTexts = [
            {
                text: 'قال رسول الله صلى الله عليه وسلم: "من قال سبحان الله وبحمده في يوم مائة مرة حطت خطاياه وإن كانت مثل زبد البحر"',
                narrator: 'رواه البخاري ومسلم'
            },
            {
                text: 'قال رسول الله صلى الله عليه وسلم: "أحب الأعمال إلى الله أدومها وإن قل"',
                narrator: 'رواه البخاري ومسلم'
            },
            {
                text: 'قال رسول الله صلى الله عليه وسلم: "من صلى الفجر في جماعة فهو في ذمة الله"',
                narrator: 'رواه مسلم'
            },
            {
                text: 'قال رسول الله صلى الله عليه وسلم: "الدعاء مخ العبادة"',
                narrator: 'رواه الترمذي'
            },
            {
                text: 'قال رسول الله صلى الله عليه وسلم: "أفضل الذكر لا إله إلا الله"',
                narrator: 'رواه الترمذي'
            },
            {
                text: 'قال رسول الله صلى الله عليه وسلم: "من قرأ بالآيتين من آخر سورة البقرة في ليلة كفتاه"',
                narrator: 'رواه البخاري ومسلم'
            }
        ];

        // اختيار حديث عشوائي بناءً على اليوم
        const today = new Date();
        const dayIndex = today.getDate() % hadithTexts.length;
        const selectedHadith = hadithTexts[dayIndex];

        this.updateElement('daily-hadith', selectedHadith.text);
        this.updateElement('hadith-narrator', selectedHadith.narrator);
    }

    // تحديث عرض الموقع
    updateLocationDisplay() {
        if (this.userLocation) {
            const locationText = `${this.userLocation.city} (${this.userLocation.latitude.toFixed(2)}, ${this.userLocation.longitude.toFixed(2)})`;
            this.updateElement('current-location-text', locationText);
        }
    }

    // تعديل الموقع (للاستخدام من Modal)
    async setLocation(cityName, lat, lng, getCurrentName = false) {
        try {
            console.log(`تغيير الموقع إلى: ${cityName} (${lat}, ${lng})`);
            
            let finalCityName = cityName;
            
            // إذا كان الموقع الحالي، حاول الحصول على اسم المدينة
            if (getCurrentName) {
                try {
                    const response = await fetch(`/api/city-name?lat=${lat}&lng=${lng}`);
                    if (response.ok) {
                        const data = await response.json();
                        finalCityName = data.city || 'موقعك الحالي';
                    }
                } catch (e) {
                    console.warn('تعذر الحصول على اسم المدينة:', e);
                }
            }
            
            // تحديث الموقع
            this.userLocation = {
                latitude: lat,
                longitude: lng,
                city: finalCityName
            };
            
            // حفظ الموقع الجديد
            localStorage.setItem('userLocation', JSON.stringify(this.userLocation));
            
            // تحديث عرض الموقع
            this.updateLocationDisplay();
            
            // تحديث البيانات بناءً على الموقع الجديد
            await Promise.all([
                this.updatePrayerTimes(),
                this.updateWeather(),
                this.updateQiblaDirection()
            ]);
            
            console.log('تم تحديث الموقع والبيانات بنجاح ✅');
            
        } catch (error) {
            console.error('خطأ في تعديل الموقع:', error);
            alert('حدث خطأ في تحديث الموقع. يرجى المحاولة مرة أخرى.');
        }
    }
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تشغيل التطبيق الإسلامي');
    window.islamicDashboard = new IslamicDashboard();
});

// تصدير الوظائف للاستخدام العام
window.incrementDhikr = () => {
    if (window.islamicDashboard) {
        window.islamicDashboard.incrementDhikr();
    }
};

// إعادة التحميل كل ساعة للحفاظ على دقة البيانات
setInterval(() => {
    if (window.islamicDashboard) {
        window.islamicDashboard.updatePrayerTimes();
        window.islamicDashboard.updateWeather();
    }
}, 60 * 60 * 1000);
