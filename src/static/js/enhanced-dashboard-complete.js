/**
 * Enhanced Islamic Dashboard - Complete Fixed Version
 * لوحة التحكم الإسلامية المحسنة - النسخة المكتملة المصححة
 */

class IslamicDashboard {
    constructor() {
        this.userLocation = null;
        this.prayerTimes = {};
        this.currentCity = null;
        
        // أسماء الصلوات
        this.prayerNames = {
            'fajr': 'الفجر',
            'sunrise': 'الشروق',
            'dhuhr': 'الظهر', 
            'asr': 'العصر',
            'maghrib': 'المغرب',
            'isha': 'العشاء'
        };

        // قائمة المدن الرئيسية
        this.cities = [
            { name: 'الرياض', lat: 24.7136, lng: 46.6753, country: 'السعودية' },
            { name: 'مكة المكرمة', lat: 21.3891, lng: 39.8579, country: 'السعودية' },
            { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692, country: 'السعودية' },
            { name: 'جدة', lat: 21.2854, lng: 39.2376, country: 'السعودية' },
            { name: 'الدمام', lat: 26.4207, lng: 50.0888, country: 'السعودية' },
            { name: 'القاهرة', lat: 30.0444, lng: 31.2357, country: 'مصر' },
            { name: 'الإسكندرية', lat: 31.2001, lng: 29.9187, country: 'مصر' },
            { name: 'دبي', lat: 25.2048, lng: 55.2708, country: 'الإمارات' },
            { name: 'أبوظبي', lat: 24.2539, lng: 54.3773, country: 'الإمارات' },
            { name: 'الكويت', lat: 29.3117, lng: 47.4818, country: 'الكويت' },
            { name: 'الدوحة', lat: 25.2867, lng: 51.5333, country: 'قطر' },
            { name: 'المنامة', lat: 26.0667, lng: 50.5577, country: 'البحرين' },
            { name: 'مسقط', lat: 23.5859, lng: 58.4059, country: 'عمان' },
            { name: 'عمان', lat: 31.9539, lng: 35.9106, country: 'الأردن' },
            { name: 'بيروت', lat: 33.8938, lng: 35.5018, country: 'لبنان' },
            { name: 'دمشق', lat: 33.5138, lng: 36.2765, country: 'سوريا' },
            { name: 'بغداد', lat: 33.3152, lng: 44.3661, country: 'العراق' },
            { name: 'الرباط', lat: 34.0209, lng: -6.8416, country: 'المغرب' },
            { name: 'تونس', lat: 36.8190, lng: 10.1658, country: 'تونس' },
            { name: 'الجزائر', lat: 36.7538, lng: 3.0588, country: 'الجزائر' }
        ];

        // مجموعة أحاديث متنوعة
        this.hadiths = [
            {
                text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
                narrator: "رواه البخاري ومسلم"
            },
            {
                text: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت",
                narrator: "رواه البخاري ومسلم"
            },
            {
                text: "المؤمن للمؤمن كالبنيان يشد بعضه بعضاً",
                narrator: "رواه البخاري ومسلم"
            },
            {
                text: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه",
                narrator: "رواه البخاري ومسلم"
            },
            {
                text: "من لم يرحم الناس لم يرحمه الله",
                narrator: "رواه البخاري ومسلم"
            },
            {
                text: "الدين النصيحة",
                narrator: "رواه مسلم"
            },
            {
                text: "من ستر مسلماً ستره الله في الدنيا والآخرة",
                narrator: "رواه مسلم"
            },
            {
                text: "أحب الأعمال إلى الله أدومها وإن قل",
                narrator: "رواه البخاري"
            },
            {
                text: "البر حسن الخلق",
                narrator: "رواه مسلم"
            },
            {
                text: "من يرد الله به خيراً يفقهه في الدين",
                narrator: "رواه البخاري"
            },
            {
                text: "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها",
                narrator: "رواه الترمذي"
            },
            {
                text: "خير الناس أنفعهم للناس",
                narrator: "رواه الطبراني"
            },
            {
                text: "ما نقص مال من صدقة",
                narrator: "رواه مسلم"
            },
            {
                text: "كل معروف صدقة",
                narrator: "رواه البخاري"
            },
            {
                text: "من صلى الفجر في جماعة فكأنما صلى الليل كله",
                narrator: "رواه مسلم"
            }
        ];

        // مجموعة حكم إسلامية
        this.wisdoms = [
            "الصبر مفتاح الفرج",
            "من طلب العلى سهر الليالي", 
            "العلم نور والجهل ظلام",
            "خير الكلام ما قل ودل",
            "من عرف نفسه عرف ربه",
            "التوبة تهدم ما قبلها",
            "العدل أساس الملك",
            "الحكمة ضالة المؤمن",
            "العقل زينة والجهل شين",
            "من حسن إسلام المرء تركه ما لا يعنيه",
            "رب كلمة أهلكت أمة ورب صمت أنجى قوماً",
            "المرء بأصغريه قلبه ولسانه",
            "العافية تاج على رؤوس الأصحاء",
            "من قنع بما رزقه الله فهو أغنى الناس",
            "اصبر تنل",
            "من جد وجد ومن زرع حصد",
            "الوقت كالسيف إن لم تقطعه قطعك"
        ];

        this.islamicMonths = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
            'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
    }

    async init() {
        console.log('🚀 بدء تهيئة لوحة التحكم الإسلامية...');
        
        try {
            // تحديث المحتوى اليومي أولاً
            this.updateDailyContent();
            
            // تحديث الوقت والتاريخ
            this.updateCurrentDateTime();
            setInterval(() => this.updateCurrentDateTime(), 1000);
            
            // إعداد منتقي المدن
            this.setupCitySelector();
            
            // الحصول على الموقع
            await this.initializeLocation();
            
            // تحديث البيانات
            await this.updateAllData();
            
            // تحديث دوري كل 10 دقائق
            setInterval(() => this.updateAllData(), 10 * 60 * 1000);
            
            console.log('✅ تمت التهيئة بنجاح!');
            
        } catch (error) {
            console.error('❌ خطأ في التهيئة:', error);
            this.showError('خطأ في تحميل البيانات');
        }
    }

    // تحديث المحتوى اليومي (متغير بناءً على الوقت)
    updateDailyContent() {
        const now = new Date();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
        const hourOfDay = now.getHours();
        
        // تغيير الحديث كل 6 ساعات
        const hadithIndex = Math.floor(dayOfYear + hourOfDay / 6) % this.hadiths.length;
        const hadith = this.hadiths[hadithIndex];
        
        // تغيير الحكمة كل 4 ساعات  
        const wisdomIndex = Math.floor(dayOfYear + hourOfDay / 4) % this.wisdoms.length;
        const wisdom = this.wisdoms[wisdomIndex];
        
        // تحديث العناصر في DOM
        this.updateElement('daily-hadith', `"${hadith.text}"`);
        this.updateElement('hadith-narrator', `- ${hadith.narrator}`);
        this.updateElement('daily-wisdom', `"${wisdom}"`);
        
        console.log('📖 تم تحديث المحتوى اليومي');
    }

    // تحديث الوقت والتاريخ الحالي
    updateCurrentDateTime() {
        const now = new Date();
        
        // الوقت الحالي
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Riyadh'
        };
        const currentTime = now.toLocaleTimeString('ar-SA', timeOptions);
        this.updateElement('current-time', currentTime);
        
        // التاريخ الميلادي
        const dateOptions = {
            weekday: 'long',
            year: 'numeric', 
            month: 'long',
            day: 'numeric'
        };
        const gregorianDate = now.toLocaleDateString('ar-SA', dateOptions);
        this.updateElement('gregorian-date', gregorianDate);
        
        // التاريخ الهجري (تقريبي)
        const hijriDate = this.getHijriDate(now);
        this.updateElement('hijri-date', hijriDate);
    }

    // حساب التاريخ الهجري التقريبي
    getHijriDate(date) {
        // هذا حساب تقريبي للتاريخ الهجري
        const hijriEpoch = new Date(622, 6, 16); // بداية التقويم الهجري
        const diffTime = date.getTime() - hijriEpoch.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // السنة الهجرية = 354.37 يوم تقريباً
        const hijriYear = Math.floor(diffDays / 354.37) + 1;
        const dayInYear = diffDays % 354;
        const hijriMonth = Math.floor(dayInYear / 29.5) + 1;
        const hijriDay = Math.floor(dayInYear % 29.5) + 1;
        
        const monthName = this.islamicMonths[hijriMonth - 1] || 'محرم';
        
        return `${hijriDay} ${monthName} ${hijriYear} هـ`;
    }

    // إعداد منتقي المدن
    setupCitySelector() {
        const citySelector = document.getElementById('city-selector');
        if (!citySelector) return;

        // إنشاء HTML للمنتقي
        citySelector.innerHTML = `
            <div class="city-selector-container">
                <button class="city-selector-btn" id="cityBtn">
                    <i class="fas fa-map-marker-alt"></i>
                    <span id="selected-city">جاري تحديد الموقع...</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="city-dropdown" id="cityDropdown">
                    <div class="city-search">
                        <input type="text" id="citySearch" placeholder="البحث عن مدينة...">
                    </div>
                    <div class="city-list" id="cityList">
                        ${this.cities.map(city => `
                            <div class="city-item" data-lat="${city.lat}" data-lng="${city.lng}" data-name="${city.name}">
                                <span class="city-name">${city.name}</span>
                                <span class="city-country">${city.country}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // إضافة الأنماط
        this.addCitySelectorStyles();

        // ربط الأحداث
        this.bindCitySelectorEvents();
    }

    // إضافة أنماط منتقي المدن
    addCitySelectorStyles() {
        if (document.getElementById('city-selector-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'city-selector-styles';
        styles.textContent = `
            .city-selector-container {
                position: relative;
                width: 100%;
                max-width: 300px;
                margin: 0 auto;
            }

            .city-selector-btn {
                width: 100%;
                padding: 12px 16px;
                background: linear-gradient(135deg, #1e3a8a, #3b82f6);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
            }

            .city-selector-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
            }

            .city-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                margin-top: 8px;
                max-height: 300px;
                overflow: hidden;
                display: none;
            }

            .city-dropdown.show {
                display: block;
                animation: slideDown 0.3s ease;
            }

            .city-search {
                padding: 12px;
                border-bottom: 1px solid #e5e7eb;
            }

            .city-search input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                color: #374151;
            }

            .city-search input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .city-list {
                max-height: 200px;
                overflow-y: auto;
            }

            .city-item {
                padding: 12px 16px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background-color 0.2s ease;
                color: #374151;
            }

            .city-item:hover {
                background-color: #f3f4f6;
            }

            .city-name {
                font-weight: 600;
                color: #111827;
            }

            .city-country {
                font-size: 12px;
                color: #6b7280;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // ربط أحداث منتقي المدن
    bindCitySelectorEvents() {
        const cityBtn = document.getElementById('cityBtn');
        const cityDropdown = document.getElementById('cityDropdown');
        const citySearch = document.getElementById('citySearch');
        const cityList = document.getElementById('cityList');

        if (!cityBtn || !cityDropdown) return;

        // فتح/إغلاق القائمة
        cityBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cityDropdown.classList.toggle('show');
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', () => {
            cityDropdown.classList.remove('show');
        });

        // منع إغلاق القائمة عند النقر داخلها
        cityDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // البحث في المدن
        if (citySearch) {
            citySearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const cityItems = cityList.querySelectorAll('.city-item');
                
                cityItems.forEach(item => {
                    const cityName = item.querySelector('.city-name').textContent.toLowerCase();
                    const countryName = item.querySelector('.city-country').textContent.toLowerCase();
                    
                    if (cityName.includes(query) || countryName.includes(query)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }

        // اختيار مدينة
        cityList.addEventListener('click', (e) => {
            const cityItem = e.target.closest('.city-item');
            if (!cityItem) return;

            const lat = parseFloat(cityItem.dataset.lat);
            const lng = parseFloat(cityItem.dataset.lng);
            const name = cityItem.dataset.name;

            this.selectCity(lat, lng, name);
            cityDropdown.classList.remove('show');
        });
    }

    // اختيار مدينة
    async selectCity(lat, lng, name) {
        this.userLocation = { latitude: lat, longitude: lng };
        this.currentCity = name;
        
        // حفظ في localStorage
        localStorage.setItem('selectedCity', JSON.stringify({
            name: name,
            latitude: lat,
            longitude: lng
        }));

        // تحديث النص
        this.updateElement('selected-city', name);
        
        console.log(`📍 تم اختيار المدينة: ${name}`);
        
        // تحديث البيانات
        await this.updateAllData();
    }

    // تهيئة الموقع
    async initializeLocation() {
        // محاولة الحصول على الموقع المحفوظ
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
            try {
                const cityData = JSON.parse(savedCity);
                this.userLocation = {
                    latitude: cityData.latitude,
                    longitude: cityData.longitude
                };
                this.currentCity = cityData.name;
                this.updateElement('selected-city', cityData.name);
                console.log('📍 تم استرداد الموقع المحفوظ:', cityData.name);
                return;
            } catch (error) {
                console.error('خطأ في استرداد الموقع المحفوظ:', error);
            }
        }

        // محاولة الحصول على الموقع الحالي
        if (navigator.geolocation) {
            this.updateElement('selected-city', 'جاري تحديد الموقع...');
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    this.userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    
                    // محاولة الحصول على اسم المدينة
                    const cityName = await this.getCityName(this.userLocation.latitude, this.userLocation.longitude);
                    this.currentCity = cityName || 'موقعك الحالي';
                    this.updateElement('selected-city', this.currentCity);
                    
                    console.log('📍 تم تحديد الموقع الحالي');
                    await this.updateAllData();
                },
                (error) => {
                    console.error('خطأ في تحديد الموقع:', error);
                    // استخدام الرياض كموقع افتراضي
                    this.selectCity(24.7136, 46.6753, 'الرياض');
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            // استخدام الرياض كموقع افتراضي
            this.selectCity(24.7136, 46.6753, 'الرياض');
        }
    }

    // الحصول على اسم المدينة من الإحداثيات
    async getCityName(lat, lng) {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=c02baa78b61cf8aaa38a1d1b4c24baea`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                return data[0].local_names?.ar || data[0].name;
            }
        } catch (error) {
            console.error('خطأ في الحصول على اسم المدينة:', error);
        }
        return null;
    }

    // تحديث جميع البيانات
    async updateAllData() {
        if (!this.userLocation) return;

        try {
            await Promise.all([
                this.updatePrayerTimes(),
                this.updateWeather()
            ]);
        } catch (error) {
            console.error('خطأ في تحديث البيانات:', error);
        }
    }

    // تحديث أوقات الصلاة (مطابقة لصفحة أوقات الصلاة)
    async updatePrayerTimes() {
        if (!this.userLocation) return;

        try {
            console.log('🕰️ جاري تحديث أوقات الصلاة...');
            
            // محاولة استخدام API المحلي أولاً
            let response = await fetch(`/get-prayer-times-public?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`);
            let data;
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    data = result.data;
                }
            }
            
            // في حالة فشل API المحلي، استخدم API خارجي
            if (!data) {
                console.log('📡 استخدام API خارجي لأوقات الصلاة...');
                response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${this.userLocation.latitude}&longitude=${this.userLocation.longitude}&method=4`);
                const result = await response.json();
                
                if (result.code === 200 && result.data) {
                    data = result.data.timings;
                }
            }

            if (data) {
                this.prayerTimes = data;
                this.displayPrayerTimes(data);
                this.updateNextPrayer();
                console.log('✅ تم تحديث أوقات الصلاة بنجاح');
            } else {
                throw new Error('لا توجد بيانات أوقات الصلاة');
            }

        } catch (error) {
            console.error('❌ خطأ في تحديث أوقات الصلاة:', error);
            this.showError('خطأ في تحميل أوقات الصلاة');
        }
    }

    // عرض أوقات الصلاة
    displayPrayerTimes(times) {
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        prayers.forEach(prayer => {
            const timeElement = document.getElementById(`${prayer}-time`);
            if (timeElement && times[prayer]) {
                // تحويل الوقت إلى تنسيق 12 ساعة
                const time24 = times[prayer];
                const time12 = this.convertTo12Hour(time24);
                timeElement.textContent = time12;
            }
        });

        // تحديث وقت الشروق
        const sunriseElement = document.getElementById('sunrise-time');
        if (sunriseElement && times.sunrise) {
            sunriseElement.textContent = this.convertTo12Hour(times.sunrise);
        }
    }

    // تحويل الوقت إلى تنسيق 12 ساعة
    convertTo12Hour(time24) {
        if (!time24) return '';
        
        const [hours, minutes] = time24.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const period = hour24 >= 12 ? 'م' : 'ص';
        
        return `${hour12}:${minutes} ${period}`;
    }

    // تحديث الصلاة التالية
    updateNextPrayer() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = [
            { name: 'fajr', arabicName: 'الفجر', time: this.prayerTimes.fajr },
            { name: 'dhuhr', arabicName: 'الظهر', time: this.prayerTimes.dhuhr },
            { name: 'asr', arabicName: 'العصر', time: this.prayerTimes.asr },
            { name: 'maghrib', arabicName: 'المغرب', time: this.prayerTimes.maghrib },
            { name: 'isha', arabicName: 'العشاء', time: this.prayerTimes.isha }
        ];

        let nextPrayer = null;
        
        for (const prayer of prayers) {
            if (prayer.time) {
                const [hours, minutes] = prayer.time.split(':');
                const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
                
                if (prayerTime > currentTime) {
                    nextPrayer = prayer;
                    break;
                }
            }
        }
        
        // إذا لم نجد صلاة تالية اليوم، فالصلاة التالية هي فجر الغد
        if (!nextPrayer) {
            nextPrayer = prayers[0]; // الفجر
        }
        
        if (nextPrayer) {
            this.updateElement('next-prayer-name', nextPrayer.arabicName);
            this.updateElement('next-prayer-time', this.convertTo12Hour(nextPrayer.time));
        }
    }

    // تحديث بيانات الطقس
    async updateWeather() {
        if (!this.userLocation) return;

        try {
            console.log('🌤️ جاري تحديث بيانات الطقس...');
            
            const response = await fetch(`/api/weather?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data) {
                this.displayWeather(data.data);
                console.log('✅ تم تحديث بيانات الطقس بنجاح');
            } else {
                throw new Error(data.message || 'خطأ في البيانات');
            }
            
        } catch (error) {
            console.error('❌ خطأ في تحديث بيانات الطقس:', error);
            this.showError('خطأ في تحميل بيانات الطقس');
        }
    }

    // عرض بيانات الطقس
    displayWeather(weather) {
        // درجة الحرارة
        this.updateElement('temperature', `${Math.round(weather.main?.temp || 0)}°`);
        
        // وصف الطقس
        this.updateElement('weather-description', weather.weather?.[0]?.description || 'غير متوفر');
        
        // الرطوبة
        this.updateElement('humidity', `${weather.main?.humidity || 0}%`);
        
        // سرعة الرياح
        const windSpeed = weather.wind?.speed || 0;
        this.updateElement('wind-speed', `${Math.round(windSpeed * 3.6)} كم/س`);
        
        // أيقونة الطقس
        const iconElement = document.getElementById('weather-icon');
        if (iconElement && weather.weather?.[0]?.icon) {
            iconElement.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
            iconElement.alt = weather.weather[0].description;
        }
    }

    // دالة مساعدة لتحديث عنصر في DOM
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        } else {
            console.warn(`⚠️ لم يتم العثور على العنصر: ${id}`);
        }
    }

    // عرض رسالة خطأ
    showError(message) {
        console.error('💬 رسالة خطأ:', message);
        
        // يمكن تحسين هذا لعرض notification
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${message}
                </div>
            `;
            setTimeout(() => {
                errorContainer.innerHTML = '';
            }, 5000);
        }
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 بدء تحميل لوحة التحكم الإسلامية...');
    
    const dashboard = new IslamicDashboard();
    dashboard.init().then(() => {
        console.log('🎉 تم تحميل لوحة التحكم بنجاح!');
    }).catch(error => {
        console.error('💥 خطأ في تحميل لوحة التحكم:', error);
    });
});
