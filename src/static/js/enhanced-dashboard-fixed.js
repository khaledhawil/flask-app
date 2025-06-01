/**
 * Enhanced Islamic Dashboard - Fixed Version
 * التطبيق الإسلامي المحسن - النسخة المصححة
 */

class EnhancedIslamicDashboard {
    constructor() {
        this.userLocation = null;
        this.prayerTimes = {};
        this.currentPrayerIndex = -1;
        this.nextPrayerTimer = null;
        
        // أسماء الصلوات
        this.prayerNames = {
            'fajr': 'الفجر',
            'sunrise': 'الشروق', 
            'dhuhr': 'الظهر',
            'asr': 'العصر',
            'maghrib': 'المغرب',
            'isha': 'العشاء'
        };

        // الأشهر الهجرية
        this.islamicMonths = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
            'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];

        // مجموعة كبيرة من الأحاديث النبوية
        this.hadithList = [
            {
                text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
                source: "صحيح البخاري ومسلم"
            },
            {
                text: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت",
                source: "صحيح البخاري ومسلم"
            },
            {
                text: "المؤمن للمؤمن كالبنيان يشد بعضه بعضاً",
                source: "صحيح البخاري ومسلم"
            },
            {
                text: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه",
                source: "صحيح البخاري ومسلم"
            },
            {
                text: "من لم يرحم الناس لم يرحمه الله",
                source: "صحيح البخاري ومسلم"
            },
            {
                text: "كل معروف صدقة",
                source: "صحيح البخاري ومسلم"
            },
            {
                text: "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن",
                source: "سنن الترمذي"
            },
            {
                text: "خير الناس أنفعهم للناس",
                source: "صحيح الجامع"
            },
            {
                text: "من صلى الفجر في جماعة فكأنما صلى الليل كله",
                source: "صحيح مسلم"
            },
            {
                text: "الدين النصيحة",
                source: "صحيح مسلم"
            },
            {
                text: "ما نقص مال من صدقة",
                source: "صحيح مسلم"
            },
            {
                text: "من ستر مسلماً ستره الله في الدنيا والآخرة",
                source: "صحيح مسلم"
            },
            {
                text: "أحب الأعمال إلى الله أدومها وإن قل",
                source: "صحيح البخاري"
            },
            {
                text: "البر حسن الخلق، والإثم ما حاك في صدرك وكرهت أن يطلع عليه الناس",
                source: "صحيح مسلم"
            },
            {
                text: "من يرد الله به خيراً يفقهه في الدين",
                source: "صحيح البخاري"
            }
        ];

        // مجموعة من الحكم الإسلامية
        this.wisdomList = [
            "الصبر مفتاح الفرج",
            "من طلب العلى سهر الليالي",
            "البر لا يبلى والذنب لا ينسى",
            "اصبر تنل",
            "من جد وجد ومن زرع حصد",
            "الوقت كالسيف إن لم تقطعه قطعك",
            "العلم نور والجهل ظلام",
            "خير الكلام ما قل ودل",
            "من عرف نفسه عرف ربه",
            "التوبة تهدم ما قبلها",
            "العدل أساس الملك",
            "من أمن العقاب أساء الأدب",
            "الحكمة ضالة المؤمن",
            "العقل زينة والجهل شين",
            "من حسن إسلام المرء تركه ما لا يعنيه",
            "إذا أردت أن تطاع فاطلب المستطاع",
            "رب كلمة أهلكت أمة ورب صمت أنجى قوماً",
            "المرء بأصغريه قلبه ولسانه",
            "العافية تاج على رؤوس الأصحاء",
            "من قنع بما رزقه الله فهو أغنى الناس"
        ];

        // بيانات الآيات القرآنية
        this.quranVerses = [
            {
                text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
                source: "سورة الطلاق - آية 2"
            },
            {
                text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
                source: "سورة الشرح - آية 6"
            },
            {
                text: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ",
                source: "سورة الفرقان - آية 58"
            },
            {
                text: "وَبَشِّرِ الصَّابِرِينَ",
                source: "سورة البقرة - آية 155"
            },
            {
                text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
                source: "سورة الطلاق - آية 3"
            }
        ];
    }

    async init() {
        console.log('🌟 بدء تهيئة لوحة التحكم الإسلامية المحسنة...');
        
        try {
            // تحديث المحتوى المتغير (الأحاديث والحكم)
            this.updateDailyContent();
            
            // تحديث الوقت والتاريخ كل ثانية
            this.updateCurrentTime();
            setInterval(() => this.updateCurrentTime(), 1000);
            
            // تحديث التاريخ الهجري
            this.updateIslamicCalendar();
            
            // الحصول على الموقع وتحديث البيانات
            await this.getUserLocation();
            
            // تحديث البيانات الأساسية
            await Promise.all([
                this.updatePrayerTimes(),
                this.updateWeather(),
                this.updateQiblaDirection()
            ]);
            
            // إعداد المدينة
            this.setupCitySelector();
            
            // تحديث دوري كل 30 دقيقة
            setInterval(() => {
                this.updatePrayerTimes();
                this.updateWeather();
            }, 30 * 60 * 1000);
            
            console.log('✅ تم تهيئة لوحة التحكم بنجاح!');
            
        } catch (error) {
            console.error('❌ خطأ في تهيئة لوحة التحكم:', error);
        }
    }

    // تحديث المحتوى اليومي (الأحاديث والحكم)
    updateDailyContent() {
        // استخدام تاريخ اليوم + الوقت للحصول على تنوع أكبر
        const now = new Date();
        const seed = now.getDate() * 100 + now.getHours();
        
        // اختيار حديث عشوائي
        const hadithIndex = seed % this.hadithList.length;
        const todayHadith = this.hadithList[hadithIndex];
        this.updateElement('daily-hadith', `"${todayHadith.text}"`);
        this.updateElement('hadith-narrator', `- ${todayHadith.source}`);
        
        // اختيار حكمة عشوائية
        const wisdomIndex = (seed + 7) % this.wisdomList.length;
        const todayWisdom = this.wisdomList[wisdomIndex];
        this.updateElement('daily-wisdom', `"${todayWisdom}"`);
        
        // اختيار آية قرآنية عشوائية
        const verseIndex = (seed + 13) % this.quranVerses.length;
        const todayVerse = this.quranVerses[verseIndex];
        this.updateElement('wisdom-author', `- ${todayVerse.source}`);
    }

    // تحديث الوقت الحالي
    updateCurrentTime() {
        const now = new Date();
        
        // الوقت بالتنسيق العربي
        const timeString = now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        // التاريخ الميلادي
        const gregorianDate = now.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        this.updateElement('current-time', timeString);
        this.updateElement('gregorian-date', gregorianDate);
    }

    // تحديث التقويم الهجري
    updateIslamicCalendar() {
        try {
            const now = new Date();
            const hijriDate = this.gregorianToHijri(now);
            
            this.updateElement('hijri-date', `${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year}هـ`);
            this.updateElement('hijri-month', hijriDate.monthName);
            this.updateElement('hijri-year', `${hijriDate.year} هـ`);
            
        } catch (error) {
            console.error('خطأ في تحديث التقويم الهجري:', error);
        }
    }

    // تحويل التاريخ الميلادي إلى هجري
    gregorianToHijri(date) {
        const gYear = date.getFullYear();
        const gMonth = date.getMonth() + 1;
        const gDay = date.getDate();
        
        // معادلة محسنة للتحويل
        const referenceGregorian = new Date(2023, 6, 19); // 19 يوليو 2023
        const referenceHijri = { year: 1445, month: 1, day: 1 };
        
        const currentDate = new Date(gYear, gMonth - 1, gDay);
        const daysDiff = Math.floor((currentDate - referenceGregorian) / (1000 * 60 * 60 * 24));
        
        const hijriYearLength = 354.37;
        const yearsDiff = daysDiff / hijriYearLength;
        
        let hijriYear = referenceHijri.year + Math.floor(yearsDiff);
        let remainingDays = daysDiff % hijriYearLength;
        
        if (remainingDays < 0) {
            hijriYear--;
            remainingDays += hijriYearLength;
        }
        
        const hijriMonth = Math.floor(remainingDays / 29.5) + 1;
        const hijriDay = Math.floor(remainingDays % 29.5) + 1;
        
        const finalMonth = Math.min(Math.max(hijriMonth, 1), 12);
        const finalDay = Math.min(Math.max(hijriDay, 1), 29);
        
        return {
            year: hijriYear,
            month: finalMonth,
            day: finalDay,
            monthName: this.islamicMonths[finalMonth - 1] || this.islamicMonths[0]
        };
    }

    // الحصول على الموقع الجغرافي
    async getUserLocation() {
        return new Promise((resolve) => {
            // تحقق من الموقع المحفوظ
            const savedLocation = localStorage.getItem('selectedCity');
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
                        localStorage.setItem('selectedCity', JSON.stringify(this.userLocation));
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

    // الحصول على اسم المدينة
    async getCityName(lat, lng) {
        try {
            const response = await fetch(`/api/city-name?lat=${lat}&lng=${lng}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.city) {
                    return data.city;
                }
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

    // تحديث أوقات الصلاة
    async updatePrayerTimes() {
        if (!this.userLocation) {
            this.showDefaultPrayerTimes();
            return;
        }

        try {
            // استخدام API العام الجديد الذي لا يحتاج مصادقة
            const response = await fetch(`/get-prayer-times-public?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`);
            
            if (response.ok) {
                const data = await response.json();
                this.prayerTimes = data.timings;
                this.displayPrayerTimes();
                this.checkCurrentPrayer();
                return;
            }
        } catch (error) {
            console.warn('فشل في جلب المواقيت من API المحلي:', error);
        }

        try {
            // استخدم API الخارجي كبديل
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
            
            return `
                <div class="prayer-time-item" data-prayer="${prayer.toLowerCase()}">
                    <div class="prayer-info">
                        <div class="prayer-name">${arabicName}</div>
                    </div>
                    <div class="prayer-time">${time}</div>
                </div>
            `;
        }).join('');

        prayersList.innerHTML = prayerElements;
    }

    // تحديد الصلاة الحالية والتالية
    checkCurrentPrayer() {
        if (!this.prayerTimes || Object.keys(this.prayerTimes).length === 0) return;

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
        
        // تحديث معلومات الصلاة التالية
        this.updateNextPrayerInfo(prayers[nextPrayer]);
    }

    // تحديث معلومات الصلاة التالية
    updateNextPrayerInfo(nextPrayerKey) {
        const nextPrayerName = this.prayerNames[nextPrayerKey.toLowerCase()];
        const nextPrayerTime = this.prayerTimes[nextPrayerKey];
        
        this.updateElement('next-prayer-name', nextPrayerName || 'الفجر');
        
        // بدء العداد التنازلي
        if (nextPrayerTime) {
            this.startCountdown(nextPrayerTime);
        }
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

    // حساب الوقت المتبقي
    calculateTimeRemaining(prayerTimeStr) {
        if (!prayerTimeStr) return '00:00:00';
        
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
        
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }

    // تحليل وقت الصلاة
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
        try {
            if (!this.userLocation) {
                this.showDefaultWeather();
                return;
            }

            const response = await fetch(
                `/api/weather?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.weather) {
                    this.displayWeather(data.weather);
                } else {
                    this.showDefaultWeather();
                }
            } else {
                this.showDefaultWeather();
            }
        } catch (error) {
            console.warn('خطأ في تحديث الطقس:', error);
            this.showDefaultWeather();
        }
    }

    // عرض بيانات الطقس
    displayWeather(weather) {
        const weatherDisplay = document.getElementById('weather-display');
        if (!weatherDisplay) return;

        const temperature = Math.round(weather.temperature || 25);
        const description = weather.description || 'صافي';
        const humidity = weather.humidity || 45;
        const windSpeed = Math.round(weather.windSpeed || 10);
        const weatherIcon = this.getWeatherIcon(weather.condition || 'clear');

        weatherDisplay.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-temp">${temperature}°</div>
            </div>
            <div class="weather-details">
                <div class="weather-desc">${description}</div>
                <div class="weather-extra">
                    <span><i class="fas fa-tint"></i> ${humidity}%</span>
                    <span><i class="fas fa-wind"></i> ${windSpeed} كم/س</span>
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
                        <span><i class="fas fa-tint"></i> 45%</span>
                        <span><i class="fas fa-wind"></i> 10 كم/س</span>
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
        if (!this.userLocation) {
            this.showDefaultQibla();
            return;
        }

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
            const directionText = this.getDirectionText(qiblaData.direction);
            qiblaDirection.textContent = `${qiblaData.direction}° ${directionText}`;
        }

        if (qiblaDistance) {
            qiblaDistance.textContent = `المسافة: ${qiblaData.distance.toLocaleString()} كم`;
        }
    }

    // الحصول على نص الاتجاه
    getDirectionText(degrees) {
        if (degrees >= 337.5 || degrees < 22.5) return 'شمال';
        if (degrees >= 22.5 && degrees < 67.5) return 'شمال شرق';
        if (degrees >= 67.5 && degrees < 112.5) return 'شرق';
        if (degrees >= 112.5 && degrees < 157.5) return 'جنوب شرق';
        if (degrees >= 157.5 && degrees < 202.5) return 'جنوب';
        if (degrees >= 202.5 && degrees < 247.5) return 'جنوب غرب';
        if (degrees >= 247.5 && degrees < 292.5) return 'غرب';
        if (degrees >= 292.5 && degrees < 337.5) return 'شمال غرب';
        return 'غير محدد';
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

    // إعداد محدد المدينة
    setupCitySelector() {
        const cityModal = document.getElementById('city-modal');
        const citySelector = document.getElementById('city-selector');
        const citySearch = document.getElementById('city-search');
        const citiesList = document.getElementById('cities-list');
        
        if (!cityModal || !citySelector || !citySearch || !citiesList) return;

        // قائمة المدن الرئيسية
        const majorCities = [
            { name: 'الرياض', lat: 24.7136, lng: 46.6753, country: 'السعودية' },
            { name: 'مكة المكرمة', lat: 21.3891, lng: 39.8579, country: 'السعودية' },
            { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692, country: 'السعودية' },
            { name: 'جدة', lat: 21.2854, lng: 39.2376, country: 'السعودية' },
            { name: 'الدمام', lat: 26.4282, lng: 50.0946, country: 'السعودية' },
            { name: 'القاهرة', lat: 30.0444, lng: 31.2357, country: 'مصر' },
            { name: 'دبي', lat: 25.276987, lng: 55.296249, country: 'الإمارات' },
            { name: 'الكويت', lat: 29.3117, lng: 47.4818, country: 'الكويت' },
            { name: 'الدوحة', lat: 25.276987, lng: 51.520008, country: 'قطر' },
            { name: 'عمان', lat: 31.9454, lng: 35.9284, country: 'الأردن' },
            { name: 'بيروت', lat: 33.8938, lng: 35.5018, country: 'لبنان' },
            { name: 'دمشق', lat: 33.5138, lng: 36.2765, country: 'سوريا' },
            { name: 'بغداد', lat: 33.3152, lng: 44.3661, country: 'العراق' },
            { name: 'الخرطوم', lat: 15.5007, lng: 32.5599, country: 'السودان' },
            { name: 'تونس', lat: 36.8065, lng: 10.1815, country: 'تونس' },
            { name: 'الجزائر', lat: 36.7538, lng: 3.0588, country: 'الجزائر' },
            { name: 'الرباط', lat: 34.0209, lng: -6.8416, country: 'المغرب' },
            { name: 'مسقط', lat: 23.5859, lng: 58.4059, country: 'عمان' },
            { name: 'المنامة', lat: 26.0667, lng: 50.5577, country: 'البحرين' }
        ];

        // إظهار المدن
        this.displayCities(majorCities, citiesList);

        // فتح مختار المدينة
        citySelector.addEventListener('click', () => {
            cityModal.style.display = 'flex';
        });

        // إغلاق النافذة عند النقر خارجها
        cityModal.addEventListener('click', (e) => {
            if (e.target === cityModal) {
                cityModal.style.display = 'none';
            }
        });

        // البحث في المدن
        citySearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredCities = majorCities.filter(city => 
                city.name.includes(searchTerm) || city.country.includes(searchTerm)
            );
            this.displayCities(filteredCities, citiesList);
        });
    }

    // عرض قائمة المدن
    displayCities(cities, container) {
        container.innerHTML = cities.map(city => `
            <div class="city-item" onclick="dashboard.selectCity(${city.lat}, ${city.lng}, '${city.name}')">
                <div class="city-name">${city.name}</div>
                <div class="city-country">${city.country}</div>
            </div>
        `).join('');
    }

    // اختيار مدينة
    async selectCity(lat, lng, name) {
        this.userLocation = {
            latitude: lat,
            longitude: lng,
            city: name
        };

        // حفظ الاختيار
        localStorage.setItem('selectedCity', JSON.stringify(this.userLocation));

        // تحديث العرض
        this.updateLocationDisplay();

        // إغلاق النافذة
        const cityModal = document.getElementById('city-modal');
        if (cityModal) {
            cityModal.style.display = 'none';
        }

        // تحديث البيانات
        await Promise.all([
            this.updatePrayerTimes(),
            this.updateWeather(),
            this.updateQiblaDirection()
        ]);

        console.log(`تم تحديد المدينة: ${name}`);
    }

    // تحديث عنصر HTML
    updateElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = content;
        }
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

function openPrayerTimes() {
    window.location.href = '/prayer-times';
}

// متغير عام للوصول من HTML
let dashboard;

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new EnhancedIslamicDashboard();
    dashboard.init().catch(error => {
        console.error('خطأ في تهيئة لوحة التحكم:', error);
    });
});
