/**
 * Islamic Dashboard UI Handler
 * This module connects the core functionality with the UI elements
 */

class IslamicDashboardUI {
  constructor(coreInstance) {
    // Reference to core functionality
    this.core = coreInstance || new IslamicDashboardCore();
    
    // UI elements cache
    this.elements = {};
    
    // Prayer names in Arabic
    this.prayerNames = {
      'fajr': 'الفجر',
      'sunrise': 'الشروق',
      'dhuhr': 'الظهر',
      'asr': 'العصر',
      'maghrib': 'المغرب',
      'isha': 'العشاء'
    };
    
    // Initialize UI
    this.init();
  }
  
  /**
   * Initialize the UI handler
   */
  init() {
    console.log('[UI] Initializing Islamic dashboard UI...');
    
    this.cacheElements();
    this.setupEventListeners();
    this.attachCoreListeners();
    
    console.log('[UI] Islamic dashboard UI initialized');
  }
  
  /**
   * Cache DOM elements for better performance
   */
  cacheElements() {
    // Clock and date elements
    this.elements.clock = document.getElementById('current-time');
    this.elements.gregorianDate = document.getElementById('current-date');
    this.elements.hijriDate = document.getElementById('hijri-date');
    
    // Location elements
    this.elements.locationDisplay = document.getElementById('current-location');
    this.elements.locationBtn = document.getElementById('location-btn');
    
    // Prayer times elements
    this.elements.prayerTimesContainer = document.getElementById('prayer-times-container');
    this.elements.prayerTimesList = document.getElementById('prayer-times-list');
    this.elements.nextPrayerName = document.getElementById('next-prayer-name');
    this.elements.nextPrayerTime = document.getElementById('next-prayer-time');
    this.elements.prayerCountdown = document.getElementById('prayer-countdown');
    
    // Weather elements
    this.elements.weatherIcon = document.getElementById('weather-icon');
    this.elements.temperature = document.getElementById('temperature');
    this.elements.weatherDesc = document.getElementById('weather-description');
    
    // Qibla elements
    this.elements.qiblaDirection = document.getElementById('qibla-direction');
    this.elements.qiblaCompass = document.getElementById('qibla-compass');
    
    // Action buttons
    this.elements.refreshBtn = document.getElementById('refresh-btn');
    this.elements.themeToggle = document.getElementById('theme-toggle-btn');
    
    // Notification area
    this.elements.notificationArea = document.getElementById('notification-area');
  }
  
  /**
   * Set up UI event listeners
   */
  setupEventListeners() {
    // Location button click
    if (this.elements.locationBtn) {
      this.elements.locationBtn.addEventListener('click', () => {
        this.showLocationModal();
      });
    }
    
    // Refresh button click
    if (this.elements.refreshBtn) {
      this.elements.refreshBtn.addEventListener('click', () => {
        this.showNotification('جاري تحديث البيانات...', 'info');
        this.core.updateAllData();
      });
    }
    
    // Theme toggle click
    if (this.elements.themeToggle && window.islamicThemeManager) {
      this.elements.themeToggle.addEventListener('click', () => {
        window.islamicThemeManager.toggleTheme();
      });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // F5 or Ctrl+R - Refresh data
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        this.core.updateAllData();
        this.showNotification('جاري تحديث البيانات...', 'info');
      }
      
      // Ctrl+L - Show location modal
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        this.showLocationModal();
      }
    });
  }
  
  /**
   * Attach listeners to core functionality events
   */
  attachCoreListeners() {
    // Listen for time changes
    this.core.on('timeChanged', (data) => {
      this.updateClock(data.time);
    });
    
    // Listen for prayer time changes
    this.core.on('prayerChanged', (data) => {
      this.updatePrayerInfo(data.currentPrayer);
      this.showPrayerNotification(data.currentPrayer);
    });
    
    // Listen for prayer countdown updates
    this.core.on('countdownUpdated', (data) => {
      this.updatePrayerCountdown(data.nextPrayer);
    });
    
    // Listen for location changes
    this.core.on('locationChanged', (data) => {
      this.updateLocationDisplay(data.location);
    });
    
    // Listen for data updates
    this.core.on('dataUpdated', (data) => {
      if (data.prayerTimes) this.updatePrayerTimes(data.prayerTimes);
      if (data.weatherData) this.updateWeather(data.weatherData);
      if (data.hijriDate) this.updateHijriDate(data.hijriDate);
      if (data.qiblaDirection) this.updateQiblaDirection(data.qiblaDirection);
    });
    
    // Listen for errors
    this.core.on('error', (data) => {
      this.showNotification(`خطأ: ${data.error}`, 'error');
    });
    
    // Listen for ready event
    this.core.on('ready', () => {
      this.showNotification('تم تحميل لوحة التحكم بنجاح', 'success');
    });
  }
  
  /**
   * Update clock display
   */
  updateClock(time) {
    if (!this.elements.clock) return;
    
    // Update time display
    this.elements.clock.textContent = time.formatted;
    
    // Add pulse effect on seconds change
    if (time.seconds % 2 === 0) {
      this.elements.clock.classList.add('pulse');
    } else {
      this.elements.clock.classList.remove('pulse');
    }
    
    // Update gregorian date if element exists
    if (this.elements.gregorianDate) {
      const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      const dateStr = time.time.toLocaleDateString('ar-SA', dateOptions);
      this.elements.gregorianDate.textContent = dateStr;
    }
  }
  
  /**
   * Update Hijri date display
   */
  updateHijriDate(hijriDate) {
    if (!this.elements.hijriDate || !hijriDate) return;
    
    this.elements.hijriDate.textContent = hijriDate;
    this.elements.hijriDate.classList.add('updated');
    
    // Remove highlight after animation
    setTimeout(() => {
      this.elements.hijriDate.classList.remove('updated');
    }, 2000);
  }
  
  /**
   * Update location display
   */
  updateLocationDisplay(location) {
    if (!this.elements.locationDisplay || !location) return;
    
    const flag = this.getFlagEmoji(location.country) || '📍';
    this.elements.locationDisplay.innerHTML = `
      <span class="location-flag">${flag}</span>
      <span class="location-name">${location.name}</span>
      <span class="location-country">${location.country}</span>
    `;
    
    this.elements.locationDisplay.setAttribute('title', `${location.lat}, ${location.lng}`);
  }
  
  /**
   * Update prayer times display
   */
  updatePrayerTimes(prayerData) {
    if (!this.elements.prayerTimesList || !prayerData || !prayerData.timings) return;
    
    const { timings } = prayerData;
    const mainPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    // Clear previous content
    this.elements.prayerTimesList.innerHTML = '';
    
    // Create prayer time items
    mainPrayers.forEach(prayer => {
      const prayerKey = prayer.toLowerCase();
      const prayerName = this.prayerNames[prayerKey] || prayer;
      const time = timings[prayer];
      
      const isCurrentPrayer = this.core.currentPrayer && 
                             this.core.currentPrayer.name === prayerKey;
      
      const prayerItem = document.createElement('div');
      prayerItem.className = `prayer-time${isCurrentPrayer ? ' current' : ''}`;
      prayerItem.id = `prayer-${prayerKey}`;
      
      prayerItem.innerHTML = `
        <div class="prayer-name">${prayerName}</div>
        <div class="prayer-time-display">${time}</div>
      `;
      
      this.elements.prayerTimesList.appendChild(prayerItem);
    });
    
    // Update date from API if available
    if (prayerData.date && prayerData.date.hijri) {
      const hijriInfo = prayerData.date.hijri;
      const hijriDate = `${hijriInfo.day} ${hijriInfo.month.ar} ${hijriInfo.year} هـ`;
      this.updateHijriDate(hijriDate);
    }
  }
  
  /**
   * Update current prayer information
   */
  updatePrayerInfo(prayerInfo) {
    if (!prayerInfo) return;
    
    // Update next prayer name and time
    if (this.elements.nextPrayerName) {
      const nextPrayerName = this.prayerNames[prayerInfo.next.name] || prayerInfo.next.name;
      this.elements.nextPrayerName.textContent = nextPrayerName;
    }
    
    if (this.elements.nextPrayerTime) {
      const nextTime = prayerInfo.next.time.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      this.elements.nextPrayerTime.textContent = nextTime;
    }
    
    // Highlight current prayer in the list
    const prayerItems = document.querySelectorAll('.prayer-time');
    prayerItems.forEach(item => item.classList.remove('current'));
    
    const currentPrayerElement = document.getElementById(`prayer-${prayerInfo.name}`);
    if (currentPrayerElement) {
      currentPrayerElement.classList.add('current');
    }
    
    // Update countdown
    this.updatePrayerCountdown(prayerInfo.next);
  }
  
  /**
   * Update countdown to next prayer
   */
  updatePrayerCountdown(nextPrayer) {
    if (!this.elements.prayerCountdown || !nextPrayer) return;
    
    const { hours, minutes, seconds } = nextPrayer.countdown;
    
    this.elements.prayerCountdown.innerHTML = `
      <span class="countdown-section">
        <span class="countdown-value">${hours.toString().padStart(2, '0')}</span>
        <span class="countdown-label">ساعة</span>
      </span>
      <span class="countdown-separator">:</span>
      <span class="countdown-section">
        <span class="countdown-value">${minutes.toString().padStart(2, '0')}</span>
        <span class="countdown-label">دقيقة</span>
      </span>
      <span class="countdown-separator">:</span>
      <span class="countdown-section">
        <span class="countdown-value">${seconds.toString().padStart(2, '0')}</span>
        <span class="countdown-label">ثانية</span>
      </span>
    `;
  }
  
  /**
   * Update weather information
   */
  updateWeather(weatherData) {
    if (!weatherData) return;
    
    // Update temperature if element exists
    if (this.elements.temperature) {
      const temp = Math.round(weatherData.temp);
      this.elements.temperature.textContent = `${temp}°C`;
    }
    
    // Update weather description if element exists
    if (this.elements.weatherDesc) {
      this.elements.weatherDesc.textContent = weatherData.description || '';
    }
    
    // Update weather icon if element exists
    if (this.elements.weatherIcon) {
      const iconClass = this.getWeatherIconClass(weatherData.icon || weatherData.condition);
      this.elements.weatherIcon.className = `weather-icon fas ${iconClass}`;
    }
  }
  
  /**
   * Update qibla direction display
   */
  updateQiblaDirection(direction) {
    if (!direction) return;
    
    // Update text direction if element exists
    if (this.elements.qiblaDirection) {
      this.elements.qiblaDirection.textContent = `${Math.round(direction)}°`;
    }
    
    // Update compass if element exists
    if (this.elements.qiblaCompass) {
      this.elements.qiblaCompass.style.transform = `rotate(${direction}deg)`;
    }
  }
  
  /**
   * Show location selection modal
   */
  showLocationModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('location-modal')) {
      const modal = document.createElement('div');
      modal.id = 'location-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>تحديد الموقع</h2>
            <span class="modal-close">&times;</span>
          </div>
          <div class="modal-body">
            <div class="location-options">
              <button id="detect-location-btn" class="btn btn-primary">
                <i class="fas fa-location-arrow"></i> تحديد موقعي الحالي
              </button>
              
              <div class="location-search">
                <input type="text" id="location-search-input" placeholder="ابحث عن مدينة...">
                <button id="search-location-btn">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
            
            <div class="cities-grid" id="cities-grid"></div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Add event listeners
      const closeBtn = modal.querySelector('.modal-close');
      closeBtn.addEventListener('click', () => {
        this.hideLocationModal();
      });
      
      // Detect location button
      const detectBtn = modal.querySelector('#detect-location-btn');
      detectBtn.addEventListener('click', async () => {
        detectBtn.disabled = true;
        detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديد...';
        
        try {
          await this.core.detectUserLocation();
          this.hideLocationModal();
          this.showNotification('تم تحديد موقعك بنجاح', 'success');
        } catch (error) {
          this.showNotification('فشل في تحديد الموقع', 'error');
        } finally {
          detectBtn.disabled = false;
          detectBtn.innerHTML = '<i class="fas fa-location-arrow"></i> تحديد موقعي الحالي';
        }
      });
      
      // Populate cities
      this.populateCitiesGrid();
    }
    
    // Show modal
    document.getElementById('location-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Hide location modal
   */
  hideLocationModal() {
    const modal = document.getElementById('location-modal');
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
  
  /**
   * Populate cities grid in location modal
   */
  populateCitiesGrid() {
    const citiesGrid = document.getElementById('cities-grid');
    if (!citiesGrid) return;
    
    // Default cities list
    const cities = [
      // Egypt cities (priority)
      { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357 },
      { name: 'الإسكندرية', country: 'مصر', lat: 31.2001, lng: 29.9187 },
      { name: 'الجيزة', country: 'مصر', lat: 30.0131, lng: 31.2089 },
      { name: 'شرم الشيخ', country: 'مصر', lat: 27.9158, lng: 34.3300 },
      { name: 'الأقصر', country: 'مصر', lat: 25.6872, lng: 32.6396 },
      { name: 'أسوان', country: 'مصر', lat: 24.0889, lng: 32.8998 },
      
      // Other cities
      { name: 'مكة المكرمة', country: 'السعودية', lat: 21.3891, lng: 39.8579 },
      { name: 'المدينة المنورة', country: 'السعودية', lat: 24.5247, lng: 39.5692 },
      { name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753 },
      { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708 },
      { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310 },
      { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784 }
    ];
    
    // Clear previous content
    citiesGrid.innerHTML = '';
    
    // Add city cards
    cities.forEach(city => {
      const cityCard = document.createElement('div');
      cityCard.className = 'city-card';
      
      const flag = this.getFlagEmoji(city.country) || '🌎';
      
      cityCard.innerHTML = `
        <div class="city-flag">${flag}</div>
        <div class="city-name">${city.name}</div>
        <div class="city-country">${city.country}</div>
      `;
      
      cityCard.addEventListener('click', () => {
        this.core.setLocation({
          ...city,
          timezone: this.getTimezoneFromCountry(city.country)
        });
        this.hideLocationModal();
        this.showNotification(`تم تحديد الموقع: ${city.name}`, 'success');
      });
      
      citiesGrid.appendChild(cityCard);
    });
  }
  
  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    if (!this.elements.notificationArea) {
      // Create notification area if it doesn't exist
      const notificationArea = document.createElement('div');
      notificationArea.id = 'notification-area';
      notificationArea.className = 'notification-area';
      document.body.appendChild(notificationArea);
      this.elements.notificationArea = notificationArea;
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    
    const icon = icons[type] || icons.info;
    
    notification.innerHTML = `
      <i class="fas fa-${icon}"></i>
      <span class="notification-message">${message}</span>
    `;
    
    // Add to notification area
    this.elements.notificationArea.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
  
  /**
   * Show notification for prayer change
   */
  showPrayerNotification(prayer) {
    if (!prayer) return;
    
    const prayerName = this.prayerNames[prayer.name];
    if (prayer.name === 'fajr') {
      this.showNotification(`حان الآن موعد صلاة ${prayerName}`, 'success');
      this.playAzanSound('fajr');
    } else if (['dhuhr', 'asr', 'maghrib', 'isha'].includes(prayer.name)) {
      this.showNotification(`حان الآن موعد صلاة ${prayerName}`, 'success');
      this.playAzanSound('regular');
    }
  }
  
  /**
   * Play azan sound for prayer notification
   */
  playAzanSound(type) {
    try {
      // Check if audio is enabled in settings
      const audioEnabled = localStorage.getItem('audio-enabled') !== 'false';
      if (!audioEnabled) return;
      
      const audio = new Audio(`/static/audio/azan-${type}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(err => console.warn('Could not play azan sound:', err));
    } catch (error) {
      console.error('Error playing azan sound:', error);
    }
  }
  
  /**
   * Get flag emoji for country
   */
  getFlagEmoji(country) {
    const flagMap = {
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
      'تركيا': '🇹🇷',
      'Egypt': '🇪🇬',
      'Saudi Arabia': '🇸🇦',
      'UAE': '🇦🇪',
      'Qatar': '🇶🇦',
      'Kuwait': '🇰🇼',
      'Bahrain': '🇧🇭',
      'Oman': '🇴🇲',
      'Jordan': '🇯🇴',
      'Lebanon': '🇱🇧',
      'Syria': '🇸🇾',
      'Iraq': '🇮🇶',
      'Turkey': '🇹🇷'
    };
    
    return flagMap[country] || '🌍';
  }
  
  /**
   * Get weather icon class based on condition
   */
  getWeatherIconClass(condition) {
    if (!condition) return 'fa-cloud';
    
    const conditionLower = condition.toLowerCase();
    
    const iconMap = {
      'clear': 'fa-sun',
      'sunny': 'fa-sun',
      'cloud': 'fa-cloud',
      'cloudy': 'fa-cloud',
      'overcast': 'fa-cloud',
      'rain': 'fa-cloud-rain',
      'shower': 'fa-cloud-showers-heavy',
      'snow': 'fa-snowflake',
      'thunder': 'fa-bolt',
      'storm': 'fa-bolt',
      'fog': 'fa-smog',
      'mist': 'fa-smog',
      'haze': 'fa-smog',
      'dust': 'fa-wind'
    };
    
    // Try to find matching condition
    for (const [key, value] of Object.entries(iconMap)) {
      if (conditionLower.includes(key)) {
        return value;
      }
    }
    
    // Default icon
    return 'fa-cloud';
  }
  
  /**
   * Get timezone from country
   */
  getTimezoneFromCountry(country) {
    const timezoneMap = {
      'مصر': 'Africa/Cairo',
      'السعودية': 'Asia/Riyadh',
      'الإمارات': 'Asia/Dubai',
      'قطر': 'Asia/Qatar',
      'الكويت': 'Asia/Kuwait',
      'البحرين': 'Asia/Bahrain',
      'عُمان': 'Asia/Muscat',
      'الأردن': 'Asia/Amman',
      'لبنان': 'Asia/Beirut',
      'سوريا': 'Asia/Damascus',
      'العراق': 'Asia/Baghdad',
      'تركيا': 'Europe/Istanbul'
    };
    
    return timezoneMap[country] || Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

// Export for global use
window.IslamicDashboardUI = IslamicDashboardUI;
