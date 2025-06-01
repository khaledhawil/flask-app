/**
 * Enhanced Islamic Dashboard with Perfect Integration
 * Combining modern design with powerful functionality
 */

class PerfectIslamicDashboard {
    constructor() {
        this.userLocation = null;
        this.currentCity = null;
        this.isLoadingLocation = false;
        this.weatherData = null;
        this.prayerTimes = null;
        this.currentPrayer = null;
        this.refreshInterval = null;
        
        // Enhanced Islamic content collections
        this.wisdomQuotes = [
            {
                text: "إن مع العسر يسرا",
                source: "سورة الشرح آية 6",
                type: "quran",
                category: "hope"
            },
            {
                text: "واصبر وما صبرك إلا بالله",
                source: "سورة النحل آية 127",
                type: "quran",
                category: "patience"
            },
            {
                text: "أحب الأعمال إلى الله أدومها وإن قل",
                source: "رواه البخاري ومسلم",
                type: "hadith",
                category: "worship"
            },
            {
                text: "من صبر ظفر",
                source: "حكمة إسلامية",
                type: "wisdom",
                category: "patience"
            },
            {
                text: "الدين النصيحة",
                source: "رواه مسلم",
                type: "hadith",
                category: "advice"
            },
            {
                text: "وذكر فإن الذكرى تنفع المؤمنين",
                source: "سورة الذاريات آية 55",
                type: "quran",
                category: "reminder"
            },
            {
                text: "من لم يشكر الناس لم يشكر الله",
                source: "رواه أبو داود والترمذي",
                type: "hadith",
                category: "gratitude"
            },
            {
                text: "اعمل لدنياك كأنك تعيش أبداً واعمل لآخرتك كأنك تموت غداً",
                source: "حكمة إسلامية",
                type: "wisdom",
                category: "balance"
            },
            {
                text: "وتوكل على الله وكفى بالله وكيلاً",
                source: "سورة النساء آية 81",
                type: "quran",
                category: "trust"
            },
            {
                text: "خير الناس أنفعهم للناس",
                source: "رواه الطبراني",
                type: "hadith",
                category: "service"
            },
            {
                text: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
                source: "سورة البقرة آية 201",
                type: "quran",
                category: "dua"
            },
            {
                text: "من قال لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير في يوم مائة مرة",
                source: "رواه البخاري ومسلم",
                type: "hadith",
                category: "dhikr"
            }
        ];
        
        // Enhanced major cities with better data for Egyptian users
        this.majorCities = [
            // Egypt cities (priority for Egyptian users)
            { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'الإسكندرية', country: 'مصر', lat: 31.2001, lng: 29.9187, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'الجيزة', country: 'مصر', lat: 30.0131, lng: 31.2089, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'شرم الشيخ', country: 'مصر', lat: 27.9158, lng: 34.3300, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'الأقصر', country: 'مصر', lat: 25.6872, lng: 32.6396, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'أسوان', country: 'مصر', lat: 24.0889, lng: 32.8998, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'طنطا', country: 'مصر', lat: 30.7865, lng: 31.0004, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'المنصورة', country: 'مصر', lat: 31.0409, lng: 31.3785, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'الزقازيق', country: 'مصر', lat: 30.5877, lng: 31.5022, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            { name: 'بني سويف', country: 'مصر', lat: 29.0661, lng: 31.0994, flag: '🇪🇬', timezone: 'Africa/Cairo' },
            
            // Other Arab cities
            { name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753, flag: '🇸🇦', timezone: 'Asia/Riyadh' },
            { name: 'جدة', country: 'السعودية', lat: 21.4858, lng: 39.1925, flag: '🇸🇦', timezone: 'Asia/Riyadh' },
            { name: 'مكة المكرمة', country: 'السعودية', lat: 21.3891, lng: 39.8579, flag: '🇸🇦', timezone: 'Asia/Riyadh' },
            { name: 'المدينة المنورة', country: 'السعودية', lat: 24.5247, lng: 39.5692, flag: '🇸🇦', timezone: 'Asia/Riyadh' },
            { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708, flag: '🇦🇪', timezone: 'Asia/Dubai' },
            { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310, flag: '🇶🇦', timezone: 'Asia/Qatar' },
            { name: 'الكويت', country: 'الكويت', lat: 29.3117, lng: 47.4818, flag: '🇰🇼', timezone: 'Asia/Kuwait' },
            { name: 'بيروت', country: 'لبنان', lat: 33.8938, lng: 35.5018, flag: '🇱🇧', timezone: 'Asia/Beirut' },
            { name: 'عمّان', country: 'الأردن', lat: 31.9539, lng: 35.9106, flag: '🇯🇴', timezone: 'Asia/Amman' },
            { name: 'المنامة', country: 'البحرين', lat: 26.0667, lng: 50.5577, flag: '🇧🇭', timezone: 'Asia/Bahrain' },
            { name: 'مسقط', country: 'عُمان', lat: 23.5859, lng: 58.4059, flag: '🇴🇲', timezone: 'Asia/Muscat' },
            { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784, flag: '🇹🇷', timezone: 'Europe/Istanbul' }
        ];
        
        this.filteredCities = [...this.majorCities];
        
        // Prayer time names in Arabic
        this.prayerNames = {
            'fajr': 'الفجر',
            'dhuhr': 'الظهر',
            'asr': 'العصر',
            'maghrib': 'المغرب',
            'isha': 'العشاء'
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 تهيئة لوحة التحكم الإسلامية المحسنة...');
        
        this.displayDailyWisdom();
        this.startClock();
        this.updateHijriDate();
        this.setupLocationHandling();
        this.populateCitiesGrid();
        this.loadUserLocation();
        this.setupEventListeners();
        this.startAutoRefresh();
        
        // تحسين تجربة المستخدم
        this.preloadData();
        this.enableKeyboardShortcuts();
        this.setupPullToRefresh();
        
        console.log('✅ تم تهيئة لوحة التحكم بنجاح');
    }
    
    // عرض الحكمة اليومية مع تحسينات
    displayDailyWisdom() {
        const now = new Date();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
        const selectedWisdom = this.wisdomQuotes[dayOfYear % this.wisdomQuotes.length];
        
        const textElement = document.getElementById('daily-wisdom-text');
        const sourceElement = document.getElementById('daily-wisdom-source');
        
        if (textElement && sourceElement) {
            // إضافة تأثير الكتابة
            this.typeWriter(textElement, selectedWisdom.text, 50);
            
            setTimeout(() => {
                sourceElement.textContent = selectedWisdom.source;
                sourceElement.style.opacity = '0';
                sourceElement.style.animation = 'fadeInUp 0.8s ease forwards';
            }, selectedWisdom.text.length * 30);
            
            // إضافة فئة CSS للنوع
            textElement.className = `wisdom-text ${selectedWisdom.type}`;
        }
    }
    
    // تأثير الكتابة
    typeWriter(element, text, speed) {
        element.textContent = '';
        element.style.opacity = '1';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }
    
    // ساعة محسنة مع تأثيرات
    startClock() {
        const updateClock = () => {
            const now = new Date();
            
            // تحديث الوقت
            const timeString = now.toLocaleTimeString('ar-SA', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const dateString = now.toLocaleDateString('ar-SA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const timeElement = document.getElementById('current-time');
            const dateElement = document.getElementById('current-date');
            
            if (timeElement) {
                // تأثير النبض للثواني
                if (now.getSeconds() % 2 === 0) {
                    timeElement.classList.add('pulse');
                } else {
                    timeElement.classList.remove('pulse');
                }
                timeElement.textContent = timeString;
            }
            
            if (dateElement) {
                dateElement.textContent = dateString;
            }
            
            // تحديث الصلاة الحالية
            this.updateCurrentPrayer();
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    // تحديث التاريخ الهجري
    updateHijriDate() {
        const hijriElement = document.getElementById('hijri-date');
        if (!hijriElement) return;
        
        try {
            const now = new Date();
            
            // استخدام API للحصول على التاريخ الهجري
            fetch('/api/islamic-date')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        hijriElement.textContent = data.hijri_date;
                        hijriElement.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        throw new Error('Failed to get Hijri date');
                    }
                })
                .catch(error => {
                    console.warn('Could not fetch Hijri date:', error);
                    // استخدام Intl API كبديل
                    try {
                        const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).format(now);
                        
                        hijriElement.textContent = hijriDate + ' هـ';
                    } catch (intlError) {
                        hijriElement.textContent = 'التاريخ الهجري';
                    }
                });
        } catch (error) {
            console.warn('Error updating Hijri date:', error);
            hijriElement.textContent = 'التاريخ الهجري';
        }
    }
    
    // معالجة الموقع المحسنة
    setupLocationHandling() {
        const savedLocation = localStorage.getItem('selectedCity');
        if (savedLocation) {
            try {
                this.userLocation = JSON.parse(savedLocation);
                this.currentCity = this.userLocation.name;
                this.loadLocationData();
                console.log('📍 تم تحميل الموقع المحفوظ:', this.currentCity);
            } catch (error) {
                console.error('Invalid saved location data:', error);
                localStorage.removeItem('selectedCity');
                this.setDefaultLocation();
            }
        } else {
            this.setDefaultLocation();
        }
    }
    
    // تعيين الموقع الافتراضي (القاهرة للمستخدمين المصريين)
    setDefaultLocation() {
        this.userLocation = {
            name: 'القاهرة',
            country: 'مصر',
            lat: 30.0444,
            lng: 31.2357,
            flag: '🇪🇬',
            timezone: 'Africa/Cairo'
        };
        this.currentCity = 'القاهرة';
        this.loadLocationData();
        this.showNotification('تم تعيين القاهرة كموقع افتراضي 📍', 'info');
        console.log('🏠 تم تعيين القاهرة كموقع افتراضي');
    }
    
    // تحميل الموقع التلقائي
    loadUserLocation() {
        if (!this.userLocation || this.userLocation.name === 'القاهرة') {
            // جرب تحديد الموقع التلقائي بعد تحميل الصفحة
            setTimeout(() => {
                this.detectCurrentLocation();
            }, 2000);
        }
    }
    
    // تحديد الموقع الحالي
    detectCurrentLocation() {
        if (this.isLoadingLocation) return;
        
        this.isLoadingLocation = true;
        this.showNotification('جاري تحديد موقعك الحالي...', 'info');
        
        if (!navigator.geolocation) {
            this.showNotification('المتصفح لا يدعم تحديد الموقع', 'error');
            this.isLoadingLocation = false;
            return;
        }
        
        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000 // 5 minutes
        };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                console.log(`📍 تم تحديد الموقع: ${lat}, ${lng}`);
                
                // البحث عن أقرب مدينة
                this.findNearestCity(lat, lng)
                    .then(city => {
                        if (city) {
                            this.selectCity(city);
                            this.showNotification(`تم تحديد موقعك: ${city.name}, ${city.country} ✅`, 'success');
                        } else {
                            // استخدام إحداثيات دقيقة
                            this.userLocation = {
                                name: 'موقعك الحالي',
                                country: '',
                                lat: lat,
                                lng: lng,
                                flag: '📍',
                                timezone: this.getTimezoneFromCoords(lat, lng)
                            };
                            this.loadLocationData();
                            this.showNotification('تم تحديد موقعك الحالي ✅', 'success');
                        }
                    })
                    .catch(error => {
                        console.error('Error finding nearest city:', error);
                        this.showNotification('تم تحديد الموقع ولكن لم نتمكن من تحديد المدينة', 'warning');
                    })
                    .finally(() => {
                        this.isLoadingLocation = false;
                    });
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.isLoadingLocation = false;
                
                let message = 'فشل في تحديد الموقع';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'تم رفض طلب تحديد الموقع. يرجى السماح بالوصول للموقع';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'معلومات الموقع غير متوفرة';
                        break;
                    case error.TIMEOUT:
                        message = 'انتهت مهلة تحديد الموقع';
                        break;
                }
                
                this.showNotification(message, 'error');
            },
            options
        );
    }
    
    // البحث عن أقرب مدينة
    async findNearestCity(lat, lng) {
        let minDistance = Infinity;
        let nearestCity = null;
        
        // البحث في المدن المحفوظة
        for (const city of this.majorCities) {
            const distance = this.calculateDistance(lat, lng, city.lat, city.lng);
            if (distance < minDistance && distance < 100) { // ضمن 100 كم
                minDistance = distance;
                nearestCity = city;
            }
        }
        
        // إذا لم نجد مدينة قريبة، جرب استخدام API
        if (!nearestCity) {
            try {
                const response = await fetch(`/api/city-name?lat=${lat}&lng=${lng}`);
                const data = await response.json();
                
                if (data.success && data.city !== 'موقعك الحالي') {
                    nearestCity = {
                        name: data.city,
                        country: data.country || '',
                        lat: lat,
                        lng: lng,
                        flag: this.getFlagForCountry(data.country),
                        timezone: this.getTimezoneFromCoords(lat, lng)
                    };
                }
            } catch (error) {
                console.error('Error fetching city name:', error);
            }
        }
        
        return nearestCity;
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
    
    // إملاء شبكة المدن
    populateCitiesGrid() {
        const grid = document.getElementById('citiesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.filteredCities.forEach(city => {
            const cityElement = document.createElement('div');
            cityElement.className = 'city-item';
            cityElement.setAttribute('data-country', city.country);
            
            cityElement.innerHTML = `
                <span class="city-flag">${city.flag}</span>
                <div class="city-name">${city.name}</div>
                <div class="city-country">${city.country}</div>
            `;
            
            cityElement.addEventListener('click', () => {
                this.selectCity(city);
                this.hideLocationModal();
            });
            
            // تأثير hover محسن
            cityElement.addEventListener('mouseenter', () => {
                cityElement.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            cityElement.addEventListener('mouseleave', () => {
                cityElement.style.transform = 'translateY(0) scale(1)';
            });
            
            grid.appendChild(cityElement);
        });
    }
    
    // اختيار مدينة
    selectCity(city) {
        this.userLocation = city;
        this.currentCity = city.name;
        
        // حفظ في localStorage
        localStorage.setItem('selectedCity', JSON.stringify(city));
        
        // تحميل البيانات
        this.loadLocationData();
        
        this.showNotification(`تم اختيار ${city.name}, ${city.country} ✅`, 'success');
        console.log('🌍 تم اختيار المدينة:', city.name);
    }
    
    // تحميل بيانات الموقع
    async loadLocationData() {
        if (!this.userLocation) return;
        
        const { lat, lng } = this.userLocation;
        
        // تحميل بيانات الطقس ومواقيت الصلاة بشكل متوازي
        await Promise.all([
            this.loadWeatherData(lat, lng),
            this.loadPrayerTimes(lat, lng)
        ]);
    }
    
    // تحميل بيانات الطقس
    async loadWeatherData(lat, lng) {
        try {
            const weatherInfo = document.getElementById('weather-info');
            if (!weatherInfo) return;
            
            // عرض loader
            weatherInfo.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    جاري تحميل بيانات الطقس...
                </div>
            `;
            
            const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
            const data = await response.json();
            
            if (data.success) {
                this.weatherData = data.weather;
                this.displayWeatherData();
            } else {
                throw new Error(data.error || 'فشل في تحميل بيانات الطقس');
            }
        } catch (error) {
            console.error('Weather error:', error);
            const weatherInfo = document.getElementById('weather-info');
            if (weatherInfo) {
                weatherInfo.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        خطأ في تحميل بيانات الطقس
                    </div>
                `;
            }
        }
    }
    
    // عرض بيانات الطقس
    displayWeatherData() {
        const weatherInfo = document.getElementById('weather-info');
        if (!weatherInfo || !this.weatherData) return;
        
        const weather = this.weatherData;
        
        weatherInfo.innerHTML = `
            <div class="weather-temp">${weather.temperature}°</div>
            <div class="weather-desc">${weather.description}</div>
            <div class="weather-location">${weather.city}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <i class="fas fa-eye"></i>
                    <span>الرؤية: ${weather.visibility} كم</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-tint"></i>
                    <span>الرطوبة: ${weather.humidity}%</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-thermometer-half"></i>
                    <span>الإحساس: ${weather.feels_like}°</span>
                </div>
                <div class="weather-detail">
                    <i class="fas fa-compress-arrows-alt"></i>
                    <span>الضغط: ${weather.pressure} هكتوباسكال</span>
                </div>
            </div>
        `;
        
        // تأثير fade in
        weatherInfo.style.opacity = '0';
        weatherInfo.style.animation = 'fadeInUp 0.6s ease forwards';
    }
    
    // تحميل مواقيت الصلاة
    async loadPrayerTimes(lat, lng) {
        try {
            const prayerTimesElement = document.getElementById('prayer-times');
            if (!prayerTimesElement) return;
            
            // عرض loader
            prayerTimesElement.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    جاري تحميل أوقات الصلاة...
                </div>
            `;
            
            const response = await fetch(`/api/prayer-times?lat=${lat}&lng=${lng}`);
            const data = await response.json();
            
            if (data.success) {
                this.prayerTimes = data.prayer_times;
                this.displayPrayerTimes();
            } else {
                throw new Error(data.error || 'فشل في تحميل أوقات الصلاة');
            }
        } catch (error) {
            console.error('Prayer times error:', error);
            const prayerTimesElement = document.getElementById('prayer-times');
            if (prayerTimesElement) {
                prayerTimesElement.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        خطأ في تحميل أوقات الصلاة
                    </div>
                `;
            }
        }
    }
    
    // عرض مواقيت الصلاة
    displayPrayerTimes() {
        const prayerTimesElement = document.getElementById('prayer-times');
        if (!prayerTimesElement || !this.prayerTimes) return;
        
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        let html = '';
        
        prayers.forEach((prayer, index) => {
            const isNext = this.isNextPrayer(prayer);
            const time = this.prayerTimes[prayer] || '--:--';
            
            html += `
                <div class="prayer-time ${isNext ? 'current' : ''}" data-prayer="${prayer}">
                    <span class="prayer-name">
                        <i class="fas fa-moon ${isNext ? 'glow' : ''}"></i>
                        ${this.prayerNames[prayer]}
                    </span>
                    <span class="prayer-time-value">${time}</span>
                </div>
            `;
        });
        
        prayerTimesElement.innerHTML = html;
        
        // تأثير fade in للعناصر
        const prayerElements = prayerTimesElement.querySelectorAll('.prayer-time');
        prayerElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                element.style.animation = `slideInRight 0.4s ease forwards`;
                element.style.animationDelay = `${index * 0.1}s`;
            }, 100);
        });
    }
    
    // تحديد الصلاة القادمة
    isNextPrayer(prayer) {
        if (!this.prayerTimes) return false;
        
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        for (const prayerName of prayers) {
            const prayerTime = this.prayerTimes[prayerName];
            if (!prayerTime) continue;
            
            const [hours, minutes] = prayerTime.split(':').map(num => parseInt(num));
            const prayerMinutes = hours * 60 + minutes;
            
            if (prayerMinutes > currentTime) {
                return prayerName === prayer;
            }
        }
        
        // إذا انتهى اليوم، الفجر هو القادم
        return prayer === 'fajr';
    }
    
    // تحديث الصلاة الحالية
    updateCurrentPrayer() {
        if (!this.prayerTimes) return;
        
        const prayerElements = document.querySelectorAll('.prayer-time');
        prayerElements.forEach(element => {
            element.classList.remove('current');
        });
        
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        for (const prayer of prayers) {
            if (this.isNextPrayer(prayer)) {
                const element = document.querySelector(`[data-prayer="${prayer}"]`);
                if (element) {
                    element.classList.add('current');
                    this.currentPrayer = prayer;
                }
                break;
            }
        }
    }
    
    // تصفية المدن
    filterCities(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredCities = [...this.majorCities];
        } else {
            this.filteredCities = this.majorCities.filter(city => 
                city.name.toLowerCase().includes(term) ||
                city.country.toLowerCase().includes(term)
            );
        }
        
        this.populateCitiesGrid();
    }
    
    // إظهار نافذة اختيار الموقع
    showLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // تركيز على حقل البحث
            setTimeout(() => {
                const searchInput = document.getElementById('citySearch');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        }
    }
    
    // إخفاء نافذة اختيار الموقع
    hideLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // تنظيف البحث
            const searchInput = document.getElementById('citySearch');
            if (searchInput) {
                searchInput.value = '';
                this.filterCities('');
            }
        }
    }
    
    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // إغلاق النافذة بالنقر خارجها
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideLocationModal();
                }
            });
        }
        
        // تحديث تلقائي عند تغيير التركيز
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.userLocation) {
                this.loadLocationData();
            }
        });
        
        // تحديث البيانات عند الاتصال مرة أخرى
        window.addEventListener('online', () => {
            this.showNotification('تم استعادة الاتصال - يتم تحديث البيانات...', 'info');
            if (this.userLocation) {
                this.loadLocationData();
            }
        });
        
        // تنبيه عند انقطاع الاتصال
        window.addEventListener('offline', () => {
            this.showNotification('انقطع الاتصال بالإنترنت', 'warning');
        });
    }
    
    // بدء التحديث التلقائي
    startAutoRefresh() {
        // تحديث البيانات كل 5 دقائق
        this.refreshInterval = setInterval(() => {
            if (this.userLocation && navigator.onLine) {
                console.log('🔄 تحديث تلقائي للبيانات...');
                this.loadLocationData();
            }
        }, 5 * 60 * 1000);
    }
    
    // تحميل البيانات مسبقاً
    preloadData() {
        // تحديث التاريخ الهجري
        setTimeout(() => this.updateHijriDate(), 1000);
        
        // تحميل بيانات إضافية إذا لزم الأمر
        if (this.userLocation) {
            setTimeout(() => this.loadLocationData(), 2000);
        }
    }
    
    // تفعيل اختصارات لوحة المفاتيح
    enableKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC لإغلاق النوافذ
            if (e.key === 'Escape') {
                this.hideLocationModal();
            }
            
            // Ctrl+L لفتح نافذة الموقع
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.showLocationModal();
            }
            
            // F5 أو Ctrl+R لتحديث البيانات
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                e.preventDefault();
                this.refreshData();
            }
        });
    }
    
    // إعداد السحب للتحديث (للجوال)
    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let isPulling = false;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY <= 0) {
                currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                
                if (pullDistance > 100 && !isPulling) {
                    isPulling = true;
                    this.showNotification('اتركه للتحديث...', 'info');
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            if (isPulling) {
                isPulling = false;
                this.refreshData();
                this.showNotification('جاري التحديث...', 'info');
            }
        });
    }
    
    // تحديث البيانات
    refreshData() {
        if (this.userLocation) {
            this.loadLocationData();
            this.updateHijriDate();
            this.displayDailyWisdom();
        }
    }
    
    // عرض الإشعارات
    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getIconForType(type)}"></i>
            <span>${message}</span>
        `;
        
        // إضافة للصفحة
        document.body.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // إخفاء الإشعار بعد 4 ثوان
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
        
        console.log(`${type.toUpperCase()}: ${message}`);
    }
    
    // الحصول على أيقونة حسب نوع الإشعار
    getIconForType(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // الحصول على العلم حسب البلد
    getFlagForCountry(country) {
        const flags = {
            'مصر': '🇪🇬',
            'السعودية': '🇸🇦',
            'الإمارات': '🇦🇪',
            'قطر': '🇶🇦',
            'الكويت': '🇰🇼',
            'البحرين': '🇧🇭',
            'عُمان': '🇴🇲',
            'الأردن': '🇯🇴',
            'لبنان': '🇱🇧',
            'سوريا': '🇸🇾',
            'العراق': '🇮🇶',
            'تركيا': '🇹🇷'
        };
        return flags[country] || '🌍';
    }
    
    // تخمين المنطقة الزمنية من الإحداثيات
    getTimezoneFromCoords(lat, lng) {
        // تخمين بسيط للمنطقة الزمنية
        const offset = Math.round(lng / 15);
        return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    }
    
    // تنظيف الموارد
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // إزالة مستمعي الأحداث إذا لزم الأمر
        console.log('🧹 تم تنظيف موارد لوحة التحكم');
    }
}

// تصدير الفئة للاستخدام العام
window.PerfectIslamicDashboard = PerfectIslamicDashboard;

// تأكد من تحميل المشروع عند جاهزية الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.islamicDashboard = new PerfectIslamicDashboard();
    });
} else {
    window.islamicDashboard = new PerfectIslamicDashboard();
}
