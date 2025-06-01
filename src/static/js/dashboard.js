// Islamic App Dashboard JavaScript
class IslamicDashboard {
    constructor() {
        this.userLocation = null;
        this.initializeDashboard();
    }

    async initializeDashboard() {
        try {
            await this.getUserLocation();
            await this.updatePrayerTimes();
            await this.updateWeather();
            this.updateQiblaDirection();
            this.updateIslamicDate();
            this.initializeQuickWorship();
            this.setupLocationSync();
        } catch (error) {
            console.error('خطأ في تهيئة لوحة التحكم:', error);
        }
    }

    // إدارة الموقع الجغرافي
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            // تحقق أولاً من الموقع المحفوظ
            const savedLocation = localStorage.getItem('userLocation');
            if (savedLocation) {
                try {
                    this.userLocation = JSON.parse(savedLocation);
                    console.log('تم استخدام الموقع المحفوظ:', this.userLocation);
                    resolve(this.userLocation);
                    return;
                } catch (e) {
                    console.warn('خطأ في قراءة الموقع المحفوظ:', e);
                }
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        this.userLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        
                        // الحصول على اسم المدينة من الإحداثيات
                        try {
                            const cityName = await this.getCityFromCoordinates(
                                this.userLocation.latitude,
                                this.userLocation.longitude
                            );
                            this.userLocation.city = cityName;
                        } catch (error) {
                            console.warn('تعذر الحصول على اسم المدينة:', error);
                            this.userLocation.city = 'موقعك الحالي';
                        }
                        
                        // حفظ الموقع
                        localStorage.setItem('userLocation', JSON.stringify(this.userLocation));
                        console.log('تم الحصول على الموقع الجغرافي:', this.userLocation);
                        resolve(this.userLocation);
                    },
                    (error) => {
                        console.warn('تعذر الحصول على الموقع:', error.message);
                        // استخدام الرياض كموقع افتراضي
                        this.userLocation = {
                            latitude: 24.7136,
                            longitude: 46.6753,
                            city: 'الرياض'
                        };
                        resolve(this.userLocation);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000 // 5 دقائق
                    }
                );
            } else {
                // متصفح لا يدعم الموقع الجغرافي
                this.userLocation = {
                    latitude: 24.7136,
                    longitude: 46.6753,
                    city: 'الرياض'
                };
                resolve(this.userLocation);
            }
        });
    }

    async getCityFromCoordinates(lat, lon) {
        try {
            const response = await fetch(
                `/api/city-name?lat=${lat}&lng=${lon}`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.city) {
                    return data.city;
                }
            }
        } catch (error) {
            console.warn('خطأ في الحصول على اسم المدينة:', error);
        }
        return 'موقعك الحالي';
    }

    // تحديث مواقيت الصلاة
    async updatePrayerTimes() {
        if (!this.userLocation) return;

        try {
            // تاريخ اليوم
            const today = new Date();
            const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
            
            const response = await fetch(
                `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${this.userLocation.latitude}&longitude=${this.userLocation.longitude}&method=4`
            );
            
            if (response.ok) {
                const data = await response.json();
                const timings = data.data.timings;
                
                // تحديث عناصر الصفحة
                document.getElementById('fajr-time').textContent = this.formatTime(timings.Fajr);
                document.getElementById('dhuhr-time').textContent = this.formatTime(timings.Dhuhr);
                document.getElementById('asr-time').textContent = this.formatTime(timings.Asr);
                document.getElementById('maghrib-time').textContent = this.formatTime(timings.Maghrib);
                document.getElementById('isha-time').textContent = this.formatTime(timings.Isha);
                document.getElementById('sunrise-time').textContent = this.formatTime(timings.Sunrise);
                
                // تحديث المدينة
                document.getElementById('prayer-location').textContent = this.userLocation.city;
                
                // تمييز الصلاة الحالية
                this.highlightCurrentPrayer(timings);
            } else {
                throw new Error('فشل في جلب مواقيت الصلاة');
            }
        } catch (error) {
            console.error('خطأ في تحديث مواقيت الصلاة:', error);
            this.showDefaultPrayerTimes();
        }
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'م' : 'ص';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${ampm}`;
    }

    highlightCurrentPrayer(timings) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = [
            { name: 'fajr', time: this.timeToMinutes(timings.Fajr) },
            { name: 'dhuhr', time: this.timeToMinutes(timings.Dhuhr) },
            { name: 'asr', time: this.timeToMinutes(timings.Asr) },
            { name: 'maghrib', time: this.timeToMinutes(timings.Maghrib) },
            { name: 'isha', time: this.timeToMinutes(timings.Isha) }
        ];
        
        // إزالة التمييز السابق
        prayers.forEach(prayer => {
            const element = document.querySelector(`#prayer-${prayer.name}`);
            if (element) {
                const prayerItem = element.closest('.prayer-item');
                if (prayerItem) prayerItem.classList.remove('current-prayer');
            }
        });
        
        // العثور على الصلاة الحالية
        let currentPrayer = null;
        for (let i = 0; i < prayers.length; i++) {
            if (currentTime < prayers[i].time) {
                currentPrayer = i > 0 ? prayers[i - 1] : prayers[prayers.length - 1];
                break;
            }
        }
        
        if (!currentPrayer && currentTime >= prayers[prayers.length - 1].time) {
            currentPrayer = prayers[prayers.length - 1];
        }
        
        if (currentPrayer) {
            const element = document.querySelector(`#prayer-${currentPrayer.name}`);
            if (element) {
                const prayerItem = element.closest('.prayer-item');
                if (prayerItem) prayerItem.classList.add('current-prayer');
            }
        }
    }

    timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    showDefaultPrayerTimes() {
        const defaultTimes = {
            fajr: '05:30 ص',
            dhuhr: '12:15 م',
            asr: '03:45 م',
            maghrib: '06:30 م',
            isha: '08:00 م'
        };
        
        Object.entries(defaultTimes).forEach(([prayer, time]) => {
            const element = document.getElementById(`prayer-${prayer}`);
            if (element) element.textContent = time;
        });
        
        const locationElement = document.getElementById('prayer-location');
        if (locationElement) locationElement.textContent = 'الرياض';
    }

    // تحديث بيانات الطقس
    async updateWeather() {
        if (!this.userLocation) return;

        try {
            const response = await fetch(
                `/api/weather?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`
            );
            
            if (response.ok) {
                const data = await response.json();
                const weather = data.weather;
                
                // تحديث العناصر الأساسية
                this.updateElementSafely('weather-temp', `${weather.temperature}°`);
                this.updateElementSafely('weather-desc', weather.description);
                this.updateElementSafely('weather-humidity', `${weather.humidity}%`);
                this.updateElementSafely('weather-wind', `${weather.wind || 5} كم/س`);
                this.updateElementSafely('weather-city', this.userLocation.city);
                
                // تحديث العناصر الإضافية
                this.updateElementSafely('weather-feels-like', `${weather.feels_like}°`);
                this.updateElementSafely('weather-pressure', `${weather.pressure} هكتوباسكال`);
                this.updateElementSafely('weather-visibility', `${weather.visibility} كم`);
                
                // تحديث أوقات الشروق والغروب
                if (weather.sunrise && weather.sunset) {
                    this.updateElementSafely('weather-sunrise', weather.sunrise);
                    this.updateElementSafely('weather-sunset', weather.sunset);
                }
                
                // تحديث الأيقونة والخلفية
                this.updateWeatherIcon(weather.icon, weather.description);
                this.updateWeatherBackground(weather.description);
                
            } else {
                throw new Error('فشل في جلب بيانات الطقس');
            }
        } catch (error) {
            console.error('خطأ في تحديث الطقس:', error);
            this.showDefaultWeather();
        }
    }

    updateElementSafely(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    updateWeatherIcon(iconCode, weatherMain) {
        const iconElement = document.getElementById('weather-icon');
        if (!iconElement) return;
        
        // خريطة الأيقونات
        const iconMap = {
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
        
        iconElement.textContent = iconMap[iconCode] || '🌤️';
    }

    updateWeatherBackground(weatherMain) {
        const weatherCard = document.querySelector('.weather-card');
        if (!weatherCard) return;
        
        // إزالة الفئات السابقة
        weatherCard.classList.remove('sunny', 'cloudy', 'rainy');
        
        // إضافة الفئة المناسبة
        switch (weatherMain.toLowerCase()) {
            case 'clear':
                weatherCard.classList.add('sunny');
                break;
            case 'clouds':
                weatherCard.classList.add('cloudy');
                break;
            case 'rain':
            case 'drizzle':
            case 'thunderstorm':
                weatherCard.classList.add('rainy');
                break;
            default:
                weatherCard.classList.add('cloudy');
        }
    }

    showDefaultWeather() {
        this.updateElementSafely('weather-temp', '25°');
        this.updateElementSafely('weather-desc', 'معتدل');
        this.updateElementSafely('weather-humidity', '60%');
        this.updateElementSafely('weather-wind', '5 م/ث');
        this.updateElementSafely('weather-location', this.userLocation?.city || 'الرياض');
        
        // القيم الافتراضية للعناصر الجديدة
        this.updateElementSafely('weather-feels-like', '27°');
        this.updateElementSafely('weather-pressure', '1013 هكتوباسكال');
        this.updateElementSafely('weather-visibility', '10 كم');
        this.updateElementSafely('weather-sunrise', '06:00 ص');
        this.updateElementSafely('weather-sunset', '06:30 م');
        
        // أيقونة افتراضية
        const iconElement = document.getElementById('weather-icon');
        if (iconElement) iconElement.textContent = '🌤️';
    }

    // تحديث اتجاه القبلة
    updateQiblaDirection() {
        if (!this.userLocation) return;
        
        try {
            // إحداثيات الكعبة المشرفة
            const kaaba = { lat: 21.4225, lon: 39.8262 };
            
            // حساب الاتجاه
            const qiblaAngle = this.calculateQiblaDirection(
                this.userLocation.latitude,
                this.userLocation.longitude,
                kaaba.lat,
                kaaba.lon
            );
            
            // تحديث العناصر
            this.updateElementSafely('qibla-direction', `${Math.round(qiblaAngle)}°`);
            this.updateElementSafely('qibla-location', this.userLocation.city);
            
            // تدوير السهم إذا وجد
            const compass = document.querySelector('.qibla-compass');
            if (compass) {
                compass.style.transform = `rotate(${qiblaAngle}deg)`;
            }
            
        } catch (error) {
            console.error('خطأ في حساب اتجاه القبلة:', error);
            this.updateElementSafely('qibla-direction', '45°');
            this.updateElementSafely('qibla-location', this.userLocation?.city || 'الرياض');
        }
    }

    calculateQiblaDirection(lat1, lon1, lat2, lon2) {
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const lat1Rad = lat1 * Math.PI / 180;
        const lat2Rad = lat2 * Math.PI / 180;
        
        const y = Math.sin(dLon) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
        
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        bearing = (bearing + 360) % 360;
        
        return bearing;
    }

    // تحديث التاريخ الإسلامي
    updateIslamicDate() {
        try {
            const today = new Date();
            const islamicDate = this.convertToIslamic(today);
            
            this.updateElementSafely('islamic-date', islamicDate.day);
            this.updateElementSafely('islamic-month', islamicDate.month);
            this.updateElementSafely('islamic-year', islamicDate.year);
            
            // ذكر عشوائي
            const randomDhikr = this.getRandomDhikr();
            this.updateElementSafely('daily-dhikr', randomDhikr);
            
        } catch (error) {
            console.error('خطأ في تحديث التاريخ الإسلامي:', error);
            this.showDefaultIslamicDate();
        }
    }

    convertToIslamic(gregorianDate) {
        // تحويل مبسط للتاريخ الهجري
        const islamicMonths = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
            'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
            'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
        
        // حساب تقريبي - في التطبيق الحقيقي يفضل استخدام مكتبة دقيقة
        const hijriYear = Math.floor(((gregorianDate.getFullYear() - 622) * 365.25) / 354.37) + 1;
        const monthIndex = Math.floor(Math.random() * 12); // مؤقت
        const day = Math.floor(Math.random() * 29) + 1; // مؤقت
        
        return {
            day: day,
            month: islamicMonths[monthIndex],
            year: `${hijriYear} هـ`
        };
    }

    getRandomDhikr() {
        const adhkar = [
            'سبحان الله وبحمده',
            'لا حول ولا قوة إلا بالله',
            'استغفر الله العظيم',
            'لا إله إلا الله',
            'الله أكبر',
            'الحمد لله رب العالمين',
            'سبحان الله العظيم',
            'اللهم صل على محمد',
            'حسبنا الله ونعم الوكيل',
            'رب اغفر لي ذنبي'
        ];
        
        return adhkar[Math.floor(Math.random() * adhkar.length)];
    }

    showDefaultIslamicDate() {
        this.updateElementSafely('islamic-date', '15');
        this.updateElementSafely('islamic-month', 'شعبان');
        this.updateElementSafely('islamic-year', '1446 هـ');
        this.updateElementSafely('daily-dhikr', 'سبحان الله وبحمده');
    }

    // تهيئة ميزات العبادة السريعة
    initializeQuickWorship() {
        // تحديث الإحصائيات
        this.updateDailyStats();
        
        // إضافة مستمعات الأحداث للأزرار
        document.querySelectorAll('.quick-worship .worship-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickWorship(action);
            });
        });
    }

    updateDailyStats() {
        // الحصول على الإحصائيات من localStorage أو قاعدة البيانات
        const stats = this.getDailyStats();
        
        this.updateElementSafely('daily-prayers', `${stats.prayers}/5`);
        this.updateElementSafely('daily-dhikr', stats.dhikr);
        this.updateElementSafely('daily-quran', `${stats.quran} آية`);
        this.updateElementSafely('daily-tasbeh', stats.tasbeh);
    }

    getDailyStats() {
        const today = new Date().toDateString();
        const savedStats = localStorage.getItem(`dailyStats_${today}`);
        
        return savedStats ? JSON.parse(savedStats) : {
            prayers: 0,
            dhikr: 0,
            quran: 0,
            tasbeh: 0
        };
    }

    handleQuickWorship(action) {
        switch (action) {
            case 'tasbeh':
                window.location.href = '/tasbeh';
                break;
            case 'dhikr':
                window.location.href = '/azkar';
                break;
            case 'quran':
                window.location.href = '/quran';
                break;
            case 'quick-dhikr':
                this.showQuickDhikr();
                break;
        }
    }

    showQuickDhikr() {
        const dhikr = this.getRandomDhikr();
        alert(`ذكر سريع:\n${dhikr}`);
        
        // تحديث الإحصائيات
        const stats = this.getDailyStats();
        stats.dhikr++;
        const today = new Date().toDateString();
        localStorage.setItem(`dailyStats_${today}`, JSON.stringify(stats));
        this.updateDailyStats();
    }

    // مزامنة الموقع بين الطقس ومواقيت الصلاة
    setupLocationSync() {
        // تحديث البيانات كل 5 دقائق
        setInterval(() => {
            this.updatePrayerTimes();
            this.updateWeather();
        }, 5 * 60 * 1000);
        
        // إعادة تحديد الموقع كل ساعة
        setInterval(() => {
            this.getUserLocation().then(() => {
                this.updatePrayerTimes();
                this.updateWeather();
                this.updateQiblaDirection();
            });
        }, 60 * 60 * 1000);
    }

    // Set location from modal selection
    async setLocation(cityName, lat, lng, isCurrentLocation = false) {
        try {
            // Update internal location
            this.userLocation = {
                latitude: lat,
                longitude: lng,
                city: cityName
            };

            // Save to localStorage
            localStorage.setItem('userLocation', JSON.stringify(this.userLocation));

            // Update location server-side
            await fetch('/set-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: lat,
                    longitude: lng,
                    city: cityName
                })
            });

            // Update UI elements
            const prayerLocationElement = document.getElementById('prayer-location');
            const weatherCityElement = document.getElementById('weather-city');
            
            if (prayerLocationElement) {
                prayerLocationElement.textContent = cityName;
            }
            if (weatherCityElement) {
                weatherCityElement.textContent = cityName;
            }

            // Refresh prayer times and weather
            await this.updatePrayerTimes();
            await this.updateWeather();
            this.updateQiblaDirection();

            console.log(`تم تحديث الموقع إلى: ${cityName}`);
            
        } catch (error) {
            console.error('خطأ في تحديث الموقع:', error);
            alert('حدث خطأ في تحديث الموقع. يرجى المحاولة مرة أخرى.');
        }
    }
}

// تهيئة لوحة التحكم عند تحميل الصفحة
// Unified Location Modal Functions
function openLocationModal() {
    const modal = document.getElementById('locationModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function selectCity(cityName, lat, lng) {
    console.log(`اختيار المدينة: ${cityName} (${lat}, ${lng})`);
    
    // Update location in dashboard
    if (window.islamicDashboard) {
        window.islamicDashboard.setLocation(cityName, lat, lng);
    }
    
    closeLocationModal();
}

function getCurrentLocation() {
    console.log('طلب الموقع الحالي من المتصفح...');
    
    if (navigator.geolocation) {
        const btn = document.querySelector('.current-location-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديد...';
        btn.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                if (window.islamicDashboard) {
                    window.islamicDashboard.setLocation('موقعك الحالي', lat, lng, true);
                }
                
                closeLocationModal();
                btn.innerHTML = originalText;
                btn.disabled = false;
            },
            (error) => {
                console.error('خطأ في الحصول على الموقع:', error);
                alert('تعذر الحصول على موقعك الحالي. يرجى اختيار مدينة من القائمة.');
                btn.innerHTML = originalText;
                btn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    } else {
        alert('متصفحك لا يدعم تحديد الموقع الجغرافي');
    }
}

function switchRegion(region) {
    // Hide all regions
    const regions = document.querySelectorAll('.cities-grid');
    regions.forEach(r => r.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.region-tab');
    tabs.forEach(t => t.classList.remove('active'));
    
    // Show selected region
    document.getElementById(region + '-cities').classList.add('active');
    
    // Add active class to selected tab
    event.target.classList.add('active');
    
    // Clear search when switching regions
    document.getElementById('citySearch').value = '';
    filterCities();
}

function filterCities() {
    const searchTerm = document.getElementById('citySearch').value.toLowerCase().trim();
    const activeRegion = document.querySelector('.cities-grid.active');
    const cityItems = activeRegion.querySelectorAll('.city-item');
    
    cityItems.forEach(item => {
        const cityText = item.textContent.toLowerCase();
        if (cityText.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('locationModal');
    if (e.target === modal) {
        closeLocationModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    window.islamicDashboard = new IslamicDashboard();
});

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IslamicDashboard;
}
