/**
 * Modern Islamic Dashboard Homepage
 * Clean, fast, and responsive homepage implementation
 */

class ModernIslamicDashboard {
    constructor() {
        this.userLocation = null;
        this.currentCity = null;
        this.isLoadingLocation = false;
        
        // Islamic content collections
        this.wisdomQuotes = [
            {
                text: "إن مع العسر يسرا",
                source: "سورة الشرح آية 6",
                type: "quran"
            },
            {
                text: "واصبر وما صبرك إلا بالله",
                source: "سورة النحل آية 127",
                type: "quran"
            },
            {
                text: "أحب الأعمال إلى الله أدومها وإن قل",
                source: "رواه البخاري ومسلم",
                type: "hadith"
            },
            {
                text: "من صبر ظفر",
                source: "حكمة إسلامية",
                type: "wisdom"
            },
            {
                text: "الدين النصيحة",
                source: "رواه مسلم",
                type: "hadith"
            },
            {
                text: "وذكر فإن الذكرى تنفع المؤمنين",
                source: "سورة الذاريات آية 55",
                type: "quran"
            },
            {
                text: "من لم يشكر الناس لم يشكر الله",
                source: "رواه أبو داود والترمذي",
                type: "hadith"
            },
            {
                text: "اعمل لدنياك كأنك تعيش أبداً واعمل لآخرتك كأنك تموت غداً",
                source: "حكمة إسلامية",
                type: "wisdom"
            },
            {
                text: "وتوكل على الله وكفى بالله وكيلاً",
                source: "سورة النساء آية 81",
                type: "quran"
            },
            {
                text: "خير الناس أنفعهم للناس",
                source: "رواه الطبراني",
                type: "hadith"
            }
        ];
        
        this.majorCities = [
            // Egypt cities first for Egyptian users
            { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357, flag: '🇪🇬' },
            { name: 'الإسكندرية', country: 'مصر', lat: 31.2001, lng: 29.9187, flag: '🇪🇬' },
            { name: 'الجيزة', country: 'مصر', lat: 30.0131, lng: 31.2089, flag: '🇪🇬' },
            { name: 'شرم الشيخ', country: 'مصر', lat: 27.9158, lng: 34.3300, flag: '🇪🇬' },
            { name: 'الأقصر', country: 'مصر', lat: 25.6872, lng: 32.6396, flag: '🇪🇬' },
            { name: 'أسوان', country: 'مصر', lat: 24.0889, lng: 32.8998, flag: '🇪🇬' },
            { name: 'طنطا', country: 'مصر', lat: 30.7865, lng: 31.0004, flag: '🇪🇬' },
            { name: 'المنصورة', country: 'مصر', lat: 31.0409, lng: 31.3785, flag: '🇪🇬' },
            // Other Arab cities
            { name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753, flag: '🇸🇦' },
            { name: 'جدة', country: 'السعودية', lat: 21.4858, lng: 39.1925, flag: '🇸🇦' },
            { name: 'مكة المكرمة', country: 'السعودية', lat: 21.3891, lng: 39.8579, flag: '🇸🇦' },
            { name: 'المدينة المنورة', country: 'السعودية', lat: 24.5247, lng: 39.5692, flag: '🇸🇦' },
            { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708, flag: '🇦🇪' },
            { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310, flag: '🇶🇦' },
            { name: 'الكويت', country: 'الكويت', lat: 29.3117, lng: 47.4818, flag: '🇰🇼' },
            { name: 'بيروت', country: 'لبنان', lat: 33.8938, lng: 35.5018, flag: '🇱🇧' },
            { name: 'عمّان', country: 'الأردن', lat: 31.9539, lng: 35.9106, flag: '🇯🇴' },
            { name: 'المنامة', country: 'البحرين', lat: 26.0667, lng: 50.5577, flag: '🇧🇭' },
            { name: 'مسقط', country: 'عُمان', lat: 23.5859, lng: 58.4059, flag: '🇴🇲' },
            { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784, flag: '🇹🇷' }
        ];
        
        this.filteredCities = [...this.majorCities];
        
        this.init();
    }
    
    init() {
        this.displayDailyWisdom();
        this.startClock();
        this.updateHijriDate();
        this.setupLocationHandling();
        this.populateCitiesGrid();
        this.loadUserLocation();
    }
    
    // Display rotating daily wisdom
    displayDailyWisdom() {
        const now = new Date();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
        const selectedWisdom = this.wisdomQuotes[dayOfYear % this.wisdomQuotes.length];
        
        const textElement = document.getElementById('daily-wisdom-text');
        const sourceElement = document.getElementById('daily-wisdom-source');
        
        if (textElement && sourceElement) {
            textElement.textContent = selectedWisdom.text;
            sourceElement.textContent = selectedWisdom.source;
        }
    }
    
    // Real-time clock
    startClock() {
        const updateClock = () => {
            const now = new Date();
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
            
            if (timeElement) timeElement.textContent = timeString;
            if (dateElement) dateElement.textContent = dateString;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    // Update Hijri date
    updateHijriDate() {
        const hijriElement = document.getElementById('hijri-date');
        if (!hijriElement) return;
        
        try {
            const now = new Date();
            const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(now);
            
            hijriElement.textContent = hijriDate + ' هـ';
        } catch (error) {
            console.warn('Could not format Hijri date:', error);
            hijriElement.textContent = 'التاريخ الهجري';
        }
    }
    
    // Location handling
    setupLocationHandling() {
        const savedLocation = localStorage.getItem('selectedCity');
        if (savedLocation) {
            try {
                this.userLocation = JSON.parse(savedLocation);
                this.loadLocationData();
            } catch (error) {
                console.error('Invalid saved location data:', error);
                localStorage.removeItem('selectedCity');
            }
        }
    }
    
    loadUserLocation() {
        if (!this.userLocation) {
            this.detectCurrentLocation();
        }
    }
    
    detectCurrentLocation() {
        if (this.isLoadingLocation) return;
        
        this.isLoadingLocation = true;
        this.showNotification('جاري تحديد موقعك...', 'info');
        
        if (!navigator.geolocation) {
            this.showNotification('المتصفح لا يدعم تحديد الموقع', 'error');
            this.setDefaultLocation();
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.reverseGeocode(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.showNotification('لم يتم تحديد الموقع، سيتم استخدام القاهرة كموقع افتراضي', 'warning');
                this.setDefaultLocation();
            },
            { timeout: 10000, enableHighAccuracy: false }
        );
    }
    
    async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                {
                    headers: {
                        'User-Agent': 'Islamic-Dashboard/1.0'
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                const cityName = data.address?.city || data.address?.town || data.address?.village || 'موقعك الحالي';
                const country = data.address?.country || '';
                
                this.userLocation = {
                    name: cityName,
                    country: country,
                    lat: lat,
                    lng: lng
                };
                
                localStorage.setItem('selectedCity', JSON.stringify(this.userLocation));
                this.loadLocationData();
                this.showNotification(`تم تحديد موقعك: ${cityName}`, 'success');
            } else {
                throw new Error('Geocoding failed');
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            this.setDefaultLocation();
        } finally {
            this.isLoadingLocation = false;
        }
    }
    
    setDefaultLocation() {
        this.userLocation = {
            name: 'القاهرة',
            country: 'مصر',
            lat: 30.0444,
            lng: 31.2357
        };
        localStorage.setItem('selectedCity', JSON.stringify(this.userLocation));
        this.loadLocationData();
        this.isLoadingLocation = false;
    }
    
    loadLocationData() {
        if (!this.userLocation) return;
        
        this.updateLocationDisplay();
        this.loadPrayerTimes();
        this.loadWeatherData();
    }
    
    updateLocationDisplay() {
        const prayerLocationElement = document.getElementById('prayer-location');
        const weatherCityElement = document.getElementById('weather-city');
        
        const locationText = `${this.userLocation.name}${this.userLocation.country ? ', ' + this.userLocation.country : ''}`;
        
        if (prayerLocationElement) {
            prayerLocationElement.textContent = locationText;
        }
        if (weatherCityElement) {
            weatherCityElement.textContent = locationText;
        }
    }
    
    // Prayer times
    async loadPrayerTimes() {
        if (!this.userLocation) return;
        
        const prayerTimesElement = document.getElementById('prayer-times');
        if (!prayerTimesElement) return;
        
        try {
            const response = await fetch(`/get-prayer-times-public?lat=${this.userLocation.lat}&lng=${this.userLocation.lng}`);
            
            if (response.ok) {
                const data = await response.json();
                this.displayPrayerTimes(data);
            } else {
                throw new Error('Failed to fetch prayer times');
            }
        } catch (error) {
            console.error('Prayer times error:', error);
            this.displayDefaultPrayerTimes();
        }
    }
    
    displayPrayerTimes(data) {
        const prayerTimesElement = document.getElementById('prayer-times');
        if (!prayerTimesElement) return;
        
        const prayers = [
            { name: 'الفجر', time: data.Fajr, key: 'fajr' },
            { name: 'الشروق', time: data.Sunrise, key: 'sunrise' },
            { name: 'الظهر', time: data.Dhuhr, key: 'dhuhr' },
            { name: 'العصر', time: data.Asr, key: 'asr' },
            { name: 'المغرب', time: data.Maghrib, key: 'maghrib' },
            { name: 'العشاء', time: data.Isha, key: 'isha' }
        ];
        
        const currentPrayer = this.getCurrentPrayer(prayers);
        
        prayerTimesElement.innerHTML = prayers.map((prayer, index) => `
            <div class="prayer-item ${prayer.key === currentPrayer ? 'current' : ''}">
                <span class="prayer-name">${prayer.name}</span>
                <span class="prayer-time">${prayer.time || '--:--'}</span>
            </div>
        `).join('');
    }
    
    displayDefaultPrayerTimes() {
        const prayerTimesElement = document.getElementById('prayer-times');
        if (!prayerTimesElement) return;
        
        const defaultPrayers = [
            { name: 'الفجر', time: '05:30' },
            { name: 'الشروق', time: '06:45' },
            { name: 'الظهر', time: '12:15' },
            { name: 'العصر', time: '15:30' },
            { name: 'المغرب', time: '18:15' },
            { name: 'العشاء', time: '19:45' }
        ];
        
        prayerTimesElement.innerHTML = defaultPrayers.map(prayer => `
            <div class="prayer-item">
                <span class="prayer-name">${prayer.name}</span>
                <span class="prayer-time">${prayer.time}</span>
            </div>
        `).join('');
    }
    
    getCurrentPrayer(prayers) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayerTimes = prayers.map(prayer => {
            if (!prayer.time || prayer.time === '--:--') return null;
            const [hours, minutes] = prayer.time.split(':').map(Number);
            return {
                key: prayer.key,
                time: hours * 60 + minutes
            };
        }).filter(Boolean);
        
        let currentPrayer = null;
        let nextPrayerTime = Infinity;
        
        for (const prayer of prayerTimes) {
            if (prayer.time > currentTime && prayer.time < nextPrayerTime) {
                nextPrayerTime = prayer.time;
                currentPrayer = prayer.key;
            }
        }
        
        return currentPrayer;
    }
    
    // Weather data
    async loadWeatherData() {
        if (!this.userLocation) return;
        
        try {
            const response = await fetch(`/api/weather?lat=${this.userLocation.lat}&lng=${this.userLocation.lng}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.weather) {
                    this.displayWeatherData(data.weather);
                } else {
                    throw new Error('Invalid weather data');
                }
            } else {
                throw new Error('Weather API failed');
            }
        } catch (error) {
            console.error('Weather error:', error);
            this.displayDefaultWeather();
        }
    }
    
    displayWeatherData(weather) {
        const tempElement = document.getElementById('temperature');
        const descElement = document.getElementById('weather-description');
        const humidityElement = document.getElementById('humidity');
        const windElement = document.getElementById('wind-speed');
        const feelsLikeElement = document.getElementById('feels-like');
        const pressureElement = document.getElementById('pressure');
        const iconElement = document.getElementById('weather-icon');
        
        if (tempElement) tempElement.textContent = `${Math.round(weather.temperature)}°`;
        if (descElement) descElement.textContent = weather.description || 'صافي';
        if (humidityElement) humidityElement.textContent = `${weather.humidity || 0}%`;
        if (windElement) windElement.textContent = `${weather.wind_speed || 0} كم/س`;
        if (feelsLikeElement) feelsLikeElement.textContent = `${Math.round(weather.feels_like || weather.temperature)}°`;
        if (pressureElement) pressureElement.textContent = `${weather.pressure || 1013} هكتوباسكال`;
        
        // Update weather icon based on description
        if (iconElement) {
            const weatherIcon = this.getWeatherIcon(weather.description || '', weather.icon);
            iconElement.textContent = weatherIcon;
        }
    }
    
    displayDefaultWeather() {
        const tempElement = document.getElementById('temperature');
        const descElement = document.getElementById('weather-description');
        const humidityElement = document.getElementById('humidity');
        const windElement = document.getElementById('wind-speed');
        const feelsLikeElement = document.getElementById('feels-like');
        const pressureElement = document.getElementById('pressure');
        
        if (tempElement) tempElement.textContent = '25°';
        if (descElement) descElement.textContent = 'صافي';
        if (humidityElement) humidityElement.textContent = '45%';
        if (windElement) windElement.textContent = '10 كم/س';
        if (feelsLikeElement) feelsLikeElement.textContent = '28°';
        if (pressureElement) pressureElement.textContent = '1013 هكتوباسكال';
    }
    
    getWeatherIcon(description, iconCode) {
        const desc = description.toLowerCase();
        if (desc.includes('مطر') || desc.includes('rain')) return '🌧️';
        if (desc.includes('غيوم') || desc.includes('cloud')) return '☁️';
        if (desc.includes('شمس') || desc.includes('clear')) return '☀️';
        if (desc.includes('ثلج') || desc.includes('snow')) return '❄️';
        if (desc.includes('عاصف') || desc.includes('storm')) return '⛈️';
        if (desc.includes('ضباب') || desc.includes('fog')) return '🌫️';
        return '🌤️';
    }
    
    // Modal functions
    populateCitiesGrid() {
        const citiesGrid = document.getElementById('cities-grid');
        if (!citiesGrid) return;
        
        citiesGrid.innerHTML = this.filteredCities.map(city => `
            <div class="city-item" data-country="${city.country}" onclick="dashboard.selectCity('${city.name}', '${city.country}', ${city.lat}, ${city.lng})">
                <div class="city-name">${city.flag} ${city.name}</div>
                <div class="city-country">${city.country}</div>
            </div>
        `).join('');
    }
    
    selectCity(name, country, lat, lng) {
        this.userLocation = { name, country, lat, lng };
        localStorage.setItem('selectedCity', JSON.stringify(this.userLocation));
        
        this.loadLocationData();
        this.closeLocationModal();
        this.showNotification(`تم اختيار ${name} كموقعك`, 'success');
    }
    
    filterCities() {
        const searchInput = document.getElementById('citySearch');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filteredCities = [...this.majorCities];
        } else {
            this.filteredCities = this.majorCities.filter(city =>
                city.name.includes(searchTerm) || city.country.includes(searchTerm)
            );
        }
        
        this.populateCitiesGrid();
    }
    
    getCurrentLocation() {
        this.closeLocationModal();
        this.detectCurrentLocation();
    }
    
    openLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.add('show');
            // Reset search
            const searchInput = document.getElementById('citySearch');
            if (searchInput) {
                searchInput.value = '';
                this.filterCities();
            }
        }
    }
    
    closeLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Quick dhikr function
    startQuickDhikr() {
        const dhikrPhrases = [
            'سبحان الله',
            'الحمد لله',
            'الله أكبر',
            'لا إله إلا الله',
            'أستغفر الله'
        ];
        
        const randomPhrase = dhikrPhrases[Math.floor(Math.random() * dhikrPhrases.length)];
        
        // Create temporary dhikr modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(8px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
                <h3 style="font-family: 'Amiri', serif; font-size: 2rem; color: #2c5530; margin-bottom: 30px;">
                    ${randomPhrase}
                </h3>
                <div style="font-size: 3rem; font-weight: bold; color: #28a745; margin: 20px 0;" id="quickCounter">0</div>
                <button onclick="incrementQuickDhikr()" style="
                    background: linear-gradient(135deg, #28a745, #20c997);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin: 10px;
                    transition: all 0.3s ease;
                ">سبّح</button>
                <button onclick="closeQuickDhikr()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    margin: 10px;
                ">إغلاق</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add global functions for the modal
        let quickCount = 0;
        window.incrementQuickDhikr = () => {
            quickCount++;
            document.getElementById('quickCounter').textContent = quickCount;
        };
        
        window.closeQuickDhikr = () => {
            document.body.removeChild(modal);
            delete window.incrementQuickDhikr;
            delete window.closeQuickDhikr;
            
            if (quickCount > 0) {
                dashboard.showNotification(`أحسنت! سبحت الله ${quickCount} مرة`, 'success');
            }
        };
    }
}

// Global functions for the template
function openLocationModal() {
    dashboard.openLocationModal();
}

function closeLocationModal() {
    dashboard.closeLocationModal();
}

function getCurrentLocation() {
    dashboard.getCurrentLocation();
}

function filterCities() {
    dashboard.filterCities();
}

function startQuickDhikr() {
    dashboard.startQuickDhikr();
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        dashboard.closeLocationModal();
    }
});

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new ModernIslamicDashboard();
});

// Make dashboard globally accessible for onclick handlers
window.dashboard = dashboard;
