/**
 * Enhanced Islamic Dashboard - Complete Fixed Version
 * لوحة التحكم الإسلامية المحسنة - النسخة المصححة والمطورة
 */

class IslamicDashboard {
    constructor() {
        this.userLocation = null;
        this.currentCity = null;
        this.prayerTimes = {};
        this.weatherData = {};
        
        // مجموعة كبيرة من الأحاديث النبوية الشريفة
        this.hadiths = [
            {
                text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
                narrator: "رواه البخاري ومسلم",
                verse: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ"
            },
            {
                text: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت",
                narrator: "رواه البخاري ومسلم",
                verse: "مَا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ"
            },
            {
                text: "المؤمن للمؤمن كالبنيان يشد بعضه بعضاً",
                narrator: "رواه البخاري ومسلم",
                verse: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا"
            },
            {
                text: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه",
                narrator: "رواه البخاري ومسلم",
                verse: "وَالْمُؤْمِنُونَ وَالْمُؤْمِنَاتُ بَعْضُهُمْ أَوْلِيَاءُ بَعْضٍ"
            },
            {
                text: "من لم يرحم الناس لم يرحمه الله",
                narrator: "رواه البخاري ومسلم",
                verse: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ"
            },
            {
                text: "الدين النصيحة",
                narrator: "رواه مسلم",
                verse: "وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ"
            },
            {
                text: "من ستر مسلماً ستره الله في الدنيا والآخرة",
                narrator: "رواه مسلم",
                verse: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"
            },
            {
                text: "أحب الأعمال إلى الله أدومها وإن قل",
                narrator: "رواه البخاري",
                verse: "وَالَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ"
            },
            {
                text: "البر حسن الخلق، والإثم ما حاك في صدرك",
                narrator: "رواه مسلم",
                verse: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ"
            },
            {
                text: "من يرد الله به خيراً يفقهه في الدين",
                narrator: "رواه البخاري",
                verse: "وَقُل رَّبِّ زِدْنِي عِلْمًا"
            },
            {
                text: "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها",
                narrator: "رواه الترمذي",
                verse: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ"
            },
            {
                text: "خير الناس أنفعهم للناس",
                narrator: "رواه الطبراني",
                verse: "وَجَعَلْنَا مِنْهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا"
            },
            {
                text: "ما نقص مال من صدقة",
                narrator: "رواه مسلم",
                verse: "مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا"
            },
            {
                text: "كل معروف صدقة",
                narrator: "رواه البخاري",
                verse: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ"
            },
            {
                text: "من صلى الفجر في جماعة فكأنما صلى الليل كله",
                narrator: "رواه مسلم",
                verse: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ"
            }
        ];

        // مجموعة حكم وآيات قرآنية
        this.wisdomVerses = [
            "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا - سورة الطلاق",
            "إِنَّ مَعَ الْعُسْرِ يُسْرًا - سورة الشرح",
            "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ - سورة الفرقان",
            "وَبَشِّرِ الصَّابِرِينَ - سورة البقرة",
            "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً - سورة البقرة",
            "وَقُل رَّبِّ زِدْنِي عِلْمًا - سورة طه",
            "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ - سورة البقرة",
            "وَهُوَ الَّذِي يُنَزِّلُ الْغَيْثَ مِن بَعْدِ مَا قَنَطُوا - سورة الشورى",
            "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ - سورة هود",
            "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ - سورة آل عمران"
        ];

        // قائمة المدن الرئيسية مع التنسيق المحسن
        this.cities = [
            { name: 'مكة المكرمة', lat: 21.3891, lng: 39.8579, country: 'السعودية', flag: '🇸🇦' },
            { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692, country: 'السعودية', flag: '🇸🇦' },
            { name: 'الرياض', lat: 24.7136, lng: 46.6753, country: 'السعودية', flag: '🇸🇦' },
            { name: 'جدة', lat: 21.2854, lng: 39.2376, country: 'السعودية', flag: '🇸🇦' },
            { name: 'الدمام', lat: 26.4207, lng: 50.0888, country: 'السعودية', flag: '🇸🇦' },
            { name: 'القاهرة', lat: 30.0444, lng: 31.2357, country: 'مصر', flag: '🇪🇬' },
            { name: 'الإسكندرية', lat: 31.2001, lng: 29.9187, country: 'مصر', flag: '🇪🇬' },
            { name: 'دبي', lat: 25.2048, lng: 55.2708, country: 'الإمارات', flag: '🇦🇪' },
            { name: 'أبوظبي', lat: 24.2539, lng: 54.3773, country: 'الإمارات', flag: '🇦🇪' },
            { name: 'الدوحة', lat: 25.2867, lng: 51.5333, country: 'قطر', flag: '🇶🇦' },
            { name: 'الكويت', lat: 29.3117, lng: 47.4818, country: 'الكويت', flag: '🇰🇼' },
            { name: 'المنامة', lat: 26.0667, lng: 50.5577, country: 'البحرين', flag: '🇧🇭' },
            { name: 'مسقط', lat: 23.5859, lng: 58.4059, country: 'عمان', flag: '🇴🇲' },
            { name: 'عمان', lat: 31.9539, lng: 35.9106, country: 'الأردن', flag: '🇯🇴' },
            { name: 'بيروت', lat: 33.8938, lng: 35.5018, country: 'لبنان', flag: '🇱🇧' },
            { name: 'دمشق', lat: 33.5138, lng: 36.2765, country: 'سوريا', flag: '🇸🇾' },
            { name: 'بغداد', lat: 33.3152, lng: 44.3661, country: 'العراق', flag: '🇮🇶' },
            { name: 'الرباط', lat: 34.0209, lng: -6.8416, country: 'المغرب', flag: '🇲🇦' },
            { name: 'تونس', lat: 36.8190, lng: 10.1658, country: 'تونس', flag: '🇹🇳' },
            { name: 'الجزائر', lat: 36.7538, lng: 3.0588, country: 'الجزائر', flag: '🇩🇿' }
        ];

        this.islamicMonths = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
            'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
    }

    async initializeDashboard() {
        console.log('🚀 بدء تهيئة لوحة التحكم الإسلامية المحسنة...');
        
        try {
            // 1. تحديث المحتوى المتغير أولاً
            this.updateDynamicContent();
            
            // 2. تحديث الوقت والتاريخ
            this.updateCurrentTime();
            setInterval(() => this.updateCurrentTime(), 1000);
            
            // 3. إعداد منتقي المدن المحسن
            this.setupEnhancedCitySelector();
            
            // 4. الحصول على الموقع أو استخدام المحفوظ
            await this.initializeLocation();
            
            // 5. تحديث جميع البيانات
            await this.updateAllData();
            
            // 6. تحديث دوري كل 10 دقائق
            setInterval(() => {
                this.updateAllData();
                this.updateDynamicContent(); // تحديث المحتوى كل 10 دقائق أيضاً
            }, 10 * 60 * 1000);
            
            console.log('✅ تمت التهيئة بنجاح!');
            
        } catch (error) {
            console.error('❌ خطأ في التهيئة:', error);
            this.showNotification('خطأ في تحميل البيانات، جاري المحاولة مرة أخرى...', 'error');
        }
    }

    // تحديث المحتوى المتغير (الأحاديث والآيات)
    updateDynamicContent() {
        const now = new Date();
        const seed = now.getDate() * 1000 + now.getHours() * 60 + now.getMinutes();
        
        // اختيار حديث عشوائي (يتغير كل دقيقة)
        const hadithIndex = Math.floor(seed / 60) % this.hadiths.length;
        const selectedHadith = this.hadiths[hadithIndex];
        
        // اختيار آية عشوائية
        const verseIndex = Math.floor(seed / 120) % this.wisdomVerses.length;
        const selectedVerse = this.wisdomVerses[verseIndex];
        
        // تحديث الحديث
        this.updateElement('hadith-text', `"${selectedHadith.text}"`);
        this.updateElement('hadith-narrator', selectedHadith.narrator);
        
        // إضافة الآية المرتبطة إذا وجدت
        if (selectedHadith.verse) {
            const verseElement = document.querySelector('.hadith-verse');
            if (verseElement) {
                verseElement.textContent = selectedHadith.verse;
                verseElement.style.display = 'block';
            } else {
                // إنشاء عنصر الآية إذا لم يوجد
                const hadithContainer = document.querySelector('.daily-hadith');
                if (hadithContainer) {
                    const verseDiv = document.createElement('div');
                    verseDiv.className = 'hadith-verse';
                    verseDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 8px; font-style: italic; color: #ffd700;';
                    verseDiv.textContent = selectedHadith.verse;
                    hadithContainer.appendChild(verseDiv);
                }
            }
        }
        
        // تحديث الحكمة/الآية اليومية
        const wisdomContainer = document.querySelector('.daily-wisdom');
        if (wisdomContainer) {
            const wisdomText = wisdomContainer.querySelector('.wisdom-text') || wisdomContainer;
            wisdomText.textContent = `"${selectedVerse}"`;
        }
        
        console.log('📖 تم تحديث المحتوى المتغير');
    }

    // تحديث الوقت الحالي والتاريخ
    updateCurrentTime() {
        const now = new Date();
        
        // الوقت الحالي بتنسيق عربي
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const currentTime = now.toLocaleTimeString('ar-SA', timeOptions);
        
        // التاريخ الميلادي
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const gregorianDate = now.toLocaleDateString('ar-SA', dateOptions);
        
        // التاريخ الهجري التقريبي
        const hijriDate = this.calculateHijriDate(now);
        
        // تحديث العناصر
        this.updateElement('current-time', currentTime);
        this.updateElement('current-date', gregorianDate);
        this.updateElement('hijri-date', hijriDate);
        
        // تحديث عناصر أخرى إذا وجدت
        this.updateElement('digital-clock', currentTime);
        this.updateElement('today-date', gregorianDate);
    }

    // حساب التاريخ الهجري التقريبي
    calculateHijriDate(gregorianDate) {
        // تحويل تقريبي للتاريخ الهجري
        const hijriEpoch = new Date(622, 6, 16); // بداية التقويم الهجري
        const diffTime = gregorianDate.getTime() - hijriEpoch.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const hijriYear = Math.floor(diffDays / 354.37) + 1;
        const dayInYear = diffDays % 354;
        const hijriMonth = Math.floor(dayInYear / 29.5);
        const hijriDay = Math.floor(dayInYear % 29.5) + 1;
        
        const monthName = this.islamicMonths[hijriMonth] || 'محرم';
        
        return `${hijriDay} ${monthName} ${hijriYear} هـ`;
    }

    // إعداد منتقي المدن المحسن
    setupEnhancedCitySelector() {
        // البحث عن عنصر منتقي المدن
        let citySelector = document.getElementById('city-selector');
        if (!citySelector) {
            // إنشاء عنصر جديد إذا لم يوجد
            const locationContainer = document.querySelector('.location-display') || 
                                    document.querySelector('.location-info') ||
                                    document.querySelector('.dashboard-header');
            
            if (locationContainer) {
                citySelector = document.createElement('div');
                citySelector.id = 'city-selector';
                citySelector.className = 'enhanced-city-selector';
                locationContainer.appendChild(citySelector);
            }
        }

        if (!citySelector) return;

        // إنشاء HTML للمنتقي المحسن
        citySelector.innerHTML = `
            <div class="city-selector-wrapper">
                <button class="city-selector-btn" id="cityToggleBtn">
                    <div class="city-info">
                        <span class="city-icon">📍</span>
                        <div class="city-details">
                            <span class="selected-city" id="selectedCityName">جاري تحديد الموقع...</span>
                            <span class="city-country" id="selectedCityCountry"></span>
                        </div>
                    </div>
                    <span class="dropdown-arrow">▼</span>
                </button>
                
                <div class="city-dropdown" id="cityDropdown">
                    <div class="dropdown-header">
                        <h4>اختيار المدينة</h4>
                        <button class="close-btn" id="closeDropdown">×</button>
                    </div>
                    
                    <div class="search-section">
                        <input type="text" id="citySearch" placeholder="🔍 البحث عن مدينة..." autocomplete="off">
                    </div>
                    
                    <div class="cities-grid" id="citiesGrid">
                        ${this.cities.map(city => `
                            <div class="city-card" data-lat="${city.lat}" data-lng="${city.lng}" data-name="${city.name}" data-country="${city.country}">
                                <span class="city-flag">${city.flag}</span>
                                <div class="city-text">
                                    <span class="city-name">${city.name}</span>
                                    <span class="city-country-small">${city.country}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="location-actions">
                        <button class="location-btn" id="detectLocationBtn">
                            <span>📍</span> استخدام موقعي الحالي
                        </button>
                    </div>
                </div>
            </div>
        `;

        // إضافة الأنماط
        this.addEnhancedCityStyles();

        // ربط الأحداث
        this.bindCityEvents();
    }

    // إضافة أنماط منتقي المدن المحسن
    addEnhancedCityStyles() {
        if (document.getElementById('enhanced-city-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'enhanced-city-styles';
        styles.textContent = `
            .enhanced-city-selector {
                position: relative;
                width: 100%;
                max-width: 400px;
                margin: 20px auto;
                z-index: 1000;
            }

            .city-selector-wrapper {
                position: relative;
            }

            .city-selector-btn {
                width: 100%;
                padding: 15px 20px;
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
                color: white;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-family: 'Cairo', sans-serif;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 25px rgba(30, 58, 138, 0.3);
                border: 2px solid rgba(255, 215, 0, 0.2);
            }

            .city-selector-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 35px rgba(30, 58, 138, 0.4);
                border-color: rgba(255, 215, 0, 0.4);
            }

            .city-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .city-icon {
                font-size: 20px;
                animation: pulse 2s infinite;
            }

            .city-details {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                text-align: right;
            }

            .selected-city {
                font-size: 16px;
                font-weight: 700;
                color: #ffd700;
            }

            .city-country {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                margin-top: 2px;
            }

            .dropdown-arrow {
                transition: transform 0.3s ease;
                font-size: 12px;
            }

            .city-selector-btn.active .dropdown-arrow {
                transform: rotate(180deg);
            }

            .city-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
                margin-top: 10px;
                max-height: 500px;
                overflow: hidden;
                display: none;
                animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 2px solid rgba(255, 215, 0, 0.2);
            }

            .city-dropdown.show {
                display: block;
            }

            .dropdown-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                border-bottom: 1px solid #e2e8f0;
            }

            .dropdown-header h4 {
                margin: 0;
                color: #1e293b;
                font-size: 18px;
                font-weight: 700;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #64748b;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .close-btn:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }

            .search-section {
                padding: 20px;
                border-bottom: 1px solid #e2e8f0;
            }

            .search-section input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                font-size: 16px;
                font-family: 'Cairo', sans-serif;
                outline: none;
                transition: all 0.3s ease;
                background: #f8fafc;
            }

            .search-section input:focus {
                border-color: #3b82f6;
                background: white;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .cities-grid {
                max-height: 300px;
                overflow-y: auto;
                padding: 10px;
            }

            .city-card {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 12px 15px;
                cursor: pointer;
                border-radius: 10px;
                transition: all 0.2s ease;
                margin-bottom: 5px;
            }

            .city-card:hover {
                background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                transform: translateX(-5px);
            }

            .city-flag {
                font-size: 24px;
                min-width: 30px;
            }

            .city-text {
                display: flex;
                flex-direction: column;
                flex: 1;
            }

            .city-name {
                font-size: 16px;
                font-weight: 600;
                color: #1e293b;
            }

            .city-country-small {
                font-size: 12px;
                color: #64748b;
                margin-top: 2px;
            }

            .location-actions {
                padding: 20px;
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
            }

            .location-btn {
                width: 100%;
                padding: 12px 20px;
                background: linear-gradient(135deg, #059669, #10b981);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s ease;
            }

            .location-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .enhanced-city-selector {
                    max-width: 100%;
                    margin: 15px 0;
                }
                
                .cities-grid {
                    max-height: 250px;
                }
                
                .city-card {
                    padding: 10px 12px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // ربط أحداث منتقي المدن
    bindCityEvents() {
        const toggleBtn = document.getElementById('cityToggleBtn');
        const dropdown = document.getElementById('cityDropdown');
        const closeBtn = document.getElementById('closeDropdown');
        const searchInput = document.getElementById('citySearch');
        const citiesGrid = document.getElementById('citiesGrid');
        const detectBtn = document.getElementById('detectLocationBtn');

        if (!toggleBtn || !dropdown) return;

        // فتح/إغلاق القائمة
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            toggleBtn.classList.toggle('active');
        });

        // إغلاق القائمة
        closeBtn?.addEventListener('click', () => {
            dropdown.classList.remove('show');
            toggleBtn.classList.remove('active');
        });

        // إغلاق عند النقر خارج القائمة
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
                dropdown.classList.remove('show');
                toggleBtn.classList.remove('active');
            }
        });

        // البحث في المدن
        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cityCards = citiesGrid.querySelectorAll('.city-card');
            
            cityCards.forEach(card => {
                const cityName = card.querySelector('.city-name').textContent.toLowerCase();
                const countryName = card.querySelector('.city-country-small').textContent.toLowerCase();
                
                if (cityName.includes(query) || countryName.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // اختيار مدينة
        citiesGrid?.addEventListener('click', (e) => {
            const cityCard = e.target.closest('.city-card');
            if (!cityCard) return;

            const lat = parseFloat(cityCard.dataset.lat);
            const lng = parseFloat(cityCard.dataset.lng);
            const name = cityCard.dataset.name;
            const country = cityCard.dataset.country;

            this.selectCity(lat, lng, name, country);
            dropdown.classList.remove('show');
            toggleBtn.classList.remove('active');
        });

        // كشف الموقع الحالي
        detectBtn?.addEventListener('click', () => {
            this.detectCurrentLocation();
            dropdown.classList.remove('show');
            toggleBtn.classList.remove('active');
        });
    }

    // اختيار مدينة محددة
    async selectCity(lat, lng, name, country = '') {
        this.userLocation = { latitude: lat, longitude: lng };
        this.currentCity = name;
        
        // حفظ في localStorage
        localStorage.setItem('selectedCity', JSON.stringify({
            name: name,
            country: country,
            latitude: lat,
            longitude: lng
        }));

        // تحديث واجهة المستخدم
        this.updateElement('selectedCityName', name);
        this.updateElement('selectedCityCountry', country);
        this.updateElement('current-location', name);
        
        // إظهار رسالة تأكيد
        this.showNotification(`تم اختيار ${name} بنجاح`, 'success');
        
        console.log(`📍 تم اختيار المدينة: ${name}, ${country}`);
        
        // تحديث جميع البيانات
        await this.updateAllData();
    }

    // كشف الموقع الحالي
    async detectCurrentLocation() {
        this.showNotification('جاري تحديد موقعك الحالي...', 'info');
        
        if (!navigator.geolocation) {
            this.showNotification('متصفحك لا يدعم تحديد الموقع', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                try {
                    // الحصول على اسم المدينة
                    const cityName = await this.getCityNameFromCoords(lat, lng);
                    await this.selectCity(lat, lng, cityName || 'موقعك الحالي', '');
                } catch (error) {
                    console.error('خطأ في الحصول على اسم المدينة:', error);
                    await this.selectCity(lat, lng, 'موقعك الحالي', '');
                }
            },
            (error) => {
                console.error('خطأ في تحديد الموقع:', error);
                this.showNotification('تعذر تحديد موقعك. يرجى اختيار مدينة يدوياً', 'error');
            },
            { timeout: 15000, enableHighAccuracy: true }
        );
    }

    // الحصول على اسم المدينة من الإحداثيات
    async getCityNameFromCoords(lat, lng) {
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

    // تهيئة الموقع
    async initializeLocation() {
        // محاولة استرداد الموقع المحفوظ
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
            try {
                const cityData = JSON.parse(savedCity);
                this.userLocation = {
                    latitude: cityData.latitude,
                    longitude: cityData.longitude
                };
                this.currentCity = cityData.name;
                
                this.updateElement('selectedCityName', cityData.name);
                this.updateElement('selectedCityCountry', cityData.country || '');
                this.updateElement('current-location', cityData.name);
                
                console.log('📍 تم استرداد الموقع المحفوظ:', cityData.name);
                return;
            } catch (error) {
                console.error('خطأ في استرداد الموقع المحفوظ:', error);
            }
        }

        // استخدام الرياض كموقع افتراضي
        await this.selectCity(24.7136, 46.6753, 'الرياض', 'السعودية');
    }

    // تحديث جميع البيانات
    async updateAllData() {
        if (!this.userLocation) return;

        this.showNotification('جاري تحديث البيانات...', 'info');

        try {
            await Promise.all([
                this.updatePrayerTimes(),
                this.updateWeather()
            ]);
            
            this.showNotification('تم تحديث جميع البيانات بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في تحديث البيانات:', error);
            this.showNotification('حدث خطأ في تحديث بعض البيانات', 'warning');
        }
    }

    // تحديث أوقات الصلاة (مطابق لصفحة أوقات الصلاة)
    async updatePrayerTimes() {
        if (!this.userLocation) return;

        try {
            console.log('🕰️ جاري تحديث أوقات الصلاة...');
            
            let response, data;
            
            // محاولة استخدام API المحلي أولاً
            try {
                response = await fetch(`/get-prayer-times-public?lat=${this.userLocation.latitude}&lng=${this.userLocation.longitude}`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        data = result.data;
                        console.log('✅ تم الحصول على أوقات الصلاة من API المحلي');
                    }
                }
            } catch (error) {
                console.warn('API المحلي غير متاح:', error);
            }
            
            // في حالة فشل API المحلي، استخدم API خارجي
            if (!data) {
                console.log('📡 استخدام API خارجي لأوقات الصلاة...');
                response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${this.userLocation.latitude}&longitude=${this.userLocation.longitude}&method=4`);
                const result = await response.json();
                
                if (result.code === 200 && result.data) {
                    data = result.data.timings;
                    console.log('✅ تم الحصول على أوقات الصلاة من API خارجي');
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
            this.showNotification('خطأ في تحميل أوقات الصلاة', 'error');
        }
    }

    // عرض أوقات الصلاة
    displayPrayerTimes(times) {
        const prayers = [
            { key: 'fajr', name: 'الفجر' },
            { key: 'sunrise', name: 'الشروق' },
            { key: 'dhuhr', name: 'الظهر' },
            { key: 'asr', name: 'العصر' },
            { key: 'maghrib', name: 'المغرب' },
            { key: 'isha', name: 'العشاء' }
        ];

        prayers.forEach(prayer => {
            const timeElement = document.getElementById(`${prayer.key}-time`);
            if (timeElement && times[prayer.key]) {
                const time12 = this.convertTo12Hour(times[prayer.key]);
                timeElement.textContent = time12;
            }
        });

        // تحديث عرض مواقيت الصلاة في القائمة
        const prayerTimesList = document.getElementById('prayer-times-list');
        if (prayerTimesList && !prayerTimesList.querySelector('.prayer-time-item')) {
            prayerTimesList.innerHTML = prayers.map(prayer => `
                <div class="prayer-time-item">
                    <span class="prayer-name">${prayer.name}</span>
                    <span class="prayer-time" id="${prayer.key}-time">${this.convertTo12Hour(times[prayer.key] || '--:--')}</span>
                </div>
            `).join('');
        }
    }

    // تحويل الوقت إلى تنسيق 12 ساعة
    convertTo12Hour(time24) {
        if (!time24 || time24 === '--:--') return '--:--';
        
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
            { key: 'fajr', name: 'الفجر', time: this.prayerTimes.fajr },
            { key: 'dhuhr', name: 'الظهر', time: this.prayerTimes.dhuhr },
            { key: 'asr', name: 'العصر', time: this.prayerTimes.asr },
            { key: 'maghrib', name: 'المغرب', time: this.prayerTimes.maghrib },
            { key: 'isha', name: 'العشاء', time: this.prayerTimes.isha }
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
            nextPrayer = prayers[0];
        }
        
        if (nextPrayer) {
            this.updateElement('next-prayer', nextPrayer.name);
            this.updateElement('next-prayer-name', nextPrayer.name);
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
                this.weatherData = data.data;
                this.displayWeather(data.data);
                console.log('✅ تم تحديث بيانات الطقس بنجاح');
            } else {
                throw new Error(data.message || 'خطأ في بيانات الطقس');
            }
            
        } catch (error) {
            console.error('❌ خطأ في تحديث بيانات الطقس:', error);
            this.showNotification('خطأ في تحميل بيانات الطقس', 'error');
        }
    }

    // عرض بيانات الطقس
    displayWeather(weather) {
        // درجة الحرارة
        const temp = Math.round(weather.main?.temp || 0);
        this.updateElement('temperature', `${temp}°C`);
        this.updateElement('temp-value', `${temp}°`);
        
        // وصف الطقس
        const description = weather.weather?.[0]?.description || 'غير متوفر';
        this.updateElement('weather-description', description);
        this.updateElement('weather-condition', description);
        
        // الرطوبة
        const humidity = weather.main?.humidity || 0;
        this.updateElement('humidity', `${humidity}%`);
        this.updateElement('humidity-value', `${humidity}%`);
        
        // سرعة الرياح
        const windSpeed = weather.wind?.speed || 0;
        const windSpeedKmh = Math.round(windSpeed * 3.6);
        this.updateElement('wind-speed', `${windSpeedKmh} كم/س`);
        this.updateElement('wind-value', `${windSpeedKmh} كم/س`);
        
        // أيقونة الطقس
        const iconElement = document.getElementById('weather-icon');
        if (iconElement && weather.weather?.[0]?.icon) {
            iconElement.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
            iconElement.alt = description;
        }

        // تحديث عرض الطقس المحسن
        const weatherDisplay = document.getElementById('weather-display');
        if (weatherDisplay && !weatherDisplay.querySelector('.weather-enhanced')) {
            weatherDisplay.innerHTML = `
                <div class="weather-enhanced">
                    <div class="weather-main">
                        <div class="weather-temp">
                            <span class="temp-value">${temp}°</span>
                            <img class="weather-icon" src="https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon || '01d'}@2x.png" alt="${description}">
                        </div>
                        <div class="weather-info">
                            <div class="weather-desc">${description}</div>
                            <div class="weather-details">
                                <span>💧 ${humidity}%</span>
                                <span>💨 ${windSpeedKmh} كم/س</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // دالة مساعدة لتحديث عنصر DOM
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // عرض الإشعارات
    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // إضافة الأنماط إذا لم تكن موجودة
        this.addNotificationStyles();

        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);

        // إظهار الإشعار
        setTimeout(() => notification.classList.add('show'), 100);

        // إخفاء الإشعار بعد 3 ثواني
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // الحصول على أيقونة الإشعار
    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    // إضافة أنماط الإشعارات
    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                padding: 15px 20px;
                z-index: 10000;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border-right: 4px solid #3b82f6;
                max-width: 350px;
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification-success {
                border-right-color: #10b981;
            }

            .notification-error {
                border-right-color: #ef4444;
            }

            .notification-warning {
                border-right-color: #f59e0b;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .notification-icon {
                font-size: 18px;
            }

            .notification-message {
                font-family: 'Cairo', sans-serif;
                font-size: 14px;
                font-weight: 600;
                color: #1e293b;
            }

            @media (max-width: 768px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    transform: translateY(-100px);
                }

                .notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 بدء تحميل لوحة التحكم الإسلامية المحسنة...');
    
    const dashboard = new IslamicDashboard();
    dashboard.initializeDashboard().then(() => {
        console.log('🎉 تم تحميل لوحة التحكم بنجاح!');
    }).catch(error => {
        console.error('💥 خطأ في تحميل لوحة التحكم:', error);
    });

    // إضافة دعم الوظائف العامة للتوافق مع الكود الموجود
    window.selectCity = (name, lat, lng) => {
        if (window.islamicDashboard) {
            window.islamicDashboard.selectCity(lat, lng, name);
        }
    };

    // حفظ مرجع التطبيق للوصول إليه من أماكن أخرى
    window.islamicDashboard = dashboard;
});
