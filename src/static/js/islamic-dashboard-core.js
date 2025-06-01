/**
 * Islamic Dashboard Core Functionality
 * This module handles core functionality for the Islamic dashboard, focusing on
 * business logic rather than UI elements
 */

class IslamicDashboardCore {
  constructor() {
    // Core data
    this.userLocation = null;
    this.prayerTimes = null;
    this.currentPrayer = null;
    this.weatherData = null;
    this.currentTime = null;
    this.hijriDate = null;
    this.qiblaDirection = null;
    this.listeners = {};
    
    // Default location (Cairo, Egypt)
    this.defaultLocation = {
      name: 'القاهرة',
      country: 'مصر',
      lat: 30.0444,
      lng: 31.2357,
      timezone: 'Africa/Cairo'
    };
    
    // Initialize core functionality
    this.init();
  }
  
  /**
   * Initialize core services
   */
  async init() {
    console.log('[Core] Initializing Islamic dashboard core services...');
    
    try {
      // Load saved location or set default
      this.loadSavedLocation();
      
      // Initial data loading
      await this.updateAllData();
      
      // Start automatic refresh of data
      this.startAutoRefresh();
      
      // Start clock timer
      this.startClock();
      
      console.log('[Core] Islamic dashboard core initialized successfully');
      this.notifyListeners('ready', { status: 'ready' });
    } catch (error) {
      console.error('[Core] Initialization error:', error);
      this.notifyListeners('error', { type: 'init', error: error.message });
    }
  }
  
  /**
   * Retrieve saved location from localStorage or set default
   */
  loadSavedLocation() {
    try {
      const savedLocation = localStorage.getItem('user-location');
      if (savedLocation) {
        this.userLocation = JSON.parse(savedLocation);
        console.log('[Core] Loaded saved location:', this.userLocation.name);
      } else {
        this.userLocation = this.defaultLocation;
        console.log('[Core] Using default location (Cairo)');
      }
      
      this.notifyListeners('locationChanged', { location: this.userLocation });
    } catch (error) {
      console.error('[Core] Error loading saved location:', error);
      this.userLocation = this.defaultLocation;
    }
  }
  
  /**
   * Update all data (prayer times, weather, etc.)
   */
  async updateAllData() {
    try {
      // Run parallel requests for better performance
      const [prayerData, weatherData, hijriData] = await Promise.all([
        this.fetchPrayerTimes(),
        this.fetchWeatherData(),
        this.fetchHijriDate()
      ]);
      
      // Calculate qibla direction
      this.calculateQiblaDirection();
      
      this.notifyListeners('dataUpdated', {
        prayerTimes: this.prayerTimes,
        weatherData: this.weatherData,
        hijriDate: this.hijriDate,
        qiblaDirection: this.qiblaDirection
      });
      
      return {
        prayerTimes: this.prayerTimes,
        weatherData: this.weatherData,
        hijriDate: this.hijriDate,
        qiblaDirection: this.qiblaDirection
      };
    } catch (error) {
      console.error('[Core] Error updating data:', error);
      this.notifyListeners('error', { type: 'dataUpdate', error: error.message });
      throw error;
    }
  }
  
  /**
   * Fetch prayer times from API
   */
  async fetchPrayerTimes() {
    if (!this.userLocation) return null;
    
    try {
      const { lat, lng } = this.userLocation;
      const response = await fetch(`/api/prayer-times?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch prayer times: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        this.prayerTimes = data.data;
        this.updateCurrentPrayer();
        console.log('[Core] Prayer times updated:', this.prayerTimes);
        return this.prayerTimes;
      } else {
        throw new Error(data.error || 'Unknown error fetching prayer times');
      }
    } catch (error) {
      console.error('[Core] Prayer times error:', error);
      this.notifyListeners('error', { type: 'prayerTimes', error: error.message });
      return null;
    }
  }
  
  /**
   * Fetch weather data from API
   */
  async fetchWeatherData() {
    if (!this.userLocation) return null;
    
    try {
      const { lat, lng } = this.userLocation;
      const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        this.weatherData = data.data;
        console.log('[Core] Weather updated:', this.weatherData);
        return this.weatherData;
      } else {
        throw new Error(data.error || 'Unknown error fetching weather');
      }
    } catch (error) {
      console.error('[Core] Weather error:', error);
      this.notifyListeners('error', { type: 'weather', error: error.message });
      return null;
    }
  }
  
  /**
   * Fetch Hijri (Islamic) date
   */
  async fetchHijriDate() {
    try {
      const response = await fetch('/api/islamic-date');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Hijri date: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        this.hijriDate = data.hijri_date;
        console.log('[Core] Hijri date updated:', this.hijriDate);
        return this.hijriDate;
      } else {
        throw new Error(data.error || 'Unknown error fetching Hijri date');
      }
    } catch (error) {
      console.error('[Core] Hijri date error:', error);
      // Fallback to client-side calculation
      this.calculateHijriDate();
      return this.hijriDate;
    }
  }
  
  /**
   * Calculate Hijri date client-side as fallback
   */
  calculateHijriDate() {
    try {
      const now = new Date();
      const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(now);
      
      this.hijriDate = hijriDate;
      return hijriDate;
    } catch (error) {
      console.error('[Core] Client-side Hijri calculation error:', error);
      return null;
    }
  }
  
  /**
   * Calculate Qibla direction based on current location
   */
  calculateQiblaDirection() {
    if (!this.userLocation) return null;
    
    try {
      // Kaaba coordinates
      const kaabaLat = 21.4225;
      const kaabaLng = 39.8262;
      
      const { lat, lng } = this.userLocation;
      
      // Convert to radians
      const latRad = lat * Math.PI / 180;
      const lngRad = lng * Math.PI / 180;
      const kaabaLatRad = kaabaLat * Math.PI / 180;
      const kaabaLngRad = kaabaLng * Math.PI / 180;
      
      // Calculate qibla direction
      const y = Math.sin(kaabaLngRad - lngRad);
      const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - 
        Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);
      
      let qiblaAngle = Math.atan2(y, x) * 180 / Math.PI;
      qiblaAngle = (qiblaAngle + 360) % 360; // Convert to positive angle
      
      this.qiblaDirection = qiblaAngle;
      console.log('[Core] Qibla direction calculated:', qiblaAngle.toFixed(2), '°');
      
      return qiblaAngle;
    } catch (error) {
      console.error('[Core] Qibla calculation error:', error);
      return null;
    }
  }
  
  /**
   * Start the real-time clock and update
   */
  startClock() {
    const updateTime = () => {
      const now = new Date();
      this.currentTime = {
        time: now,
        formatted: now.toLocaleTimeString('ar-SA', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      };
      
      this.notifyListeners('timeChanged', { time: this.currentTime });
      
      // Check for prayer time changes
      this.updateCurrentPrayer();
    };
    
    // Start clock
    updateTime();
    setInterval(updateTime, 1000);
  }
  
  /**
   * Update the current prayer based on time
   */
  updateCurrentPrayer() {
    if (!this.prayerTimes || !this.currentTime) return null;
    
    try {
      const now = this.currentTime.time;
      const prayers = this.prayerTimes.timings;
      
      // Prayer times in 24-hour format
      const prayerTimesArray = [
        { name: 'fajr', time: this.convertPrayerTimeToDate(prayers.Fajr) },
        { name: 'sunrise', time: this.convertPrayerTimeToDate(prayers.Sunrise) },
        { name: 'dhuhr', time: this.convertPrayerTimeToDate(prayers.Dhuhr) },
        { name: 'asr', time: this.convertPrayerTimeToDate(prayers.Asr) },
        { name: 'maghrib', time: this.convertPrayerTimeToDate(prayers.Maghrib) },
        { name: 'isha', time: this.convertPrayerTimeToDate(prayers.Isha) }
      ];
      
      // Find current prayer
      let currentPrayer = null;
      let nextPrayer = null;
      
      for (let i = 0; i < prayerTimesArray.length; i++) {
        if (now < prayerTimesArray[i].time) {
          nextPrayer = prayerTimesArray[i];
          currentPrayer = i === 0 ? prayerTimesArray[prayerTimesArray.length - 1] : prayerTimesArray[i - 1];
          break;
        }
      }
      
      // If now is after Isha, current is Isha and next is Fajr
      if (!currentPrayer) {
        currentPrayer = prayerTimesArray[prayerTimesArray.length - 1]; // Isha
        nextPrayer = prayerTimesArray[0]; // Fajr (tomorrow)
        
        // Adjust Fajr for next day
        nextPrayer = {
          ...nextPrayer,
          time: new Date(nextPrayer.time.getTime() + 24 * 60 * 60 * 1000)
        };
      }
      
      // Calculate time until next prayer
      const timeUntilNext = nextPrayer.time - now;
      const hoursUntil = Math.floor(timeUntilNext / (1000 * 60 * 60));
      const minutesUntil = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));
      const secondsUntil = Math.floor((timeUntilNext % (1000 * 60)) / 1000);
      
      const nextPrayerInfo = {
        name: nextPrayer.name,
        time: nextPrayer.time,
        countdown: {
          hours: hoursUntil,
          minutes: minutesUntil,
          seconds: secondsUntil,
          formatted: `${hoursUntil.toString().padStart(2, '0')}:${minutesUntil.toString().padStart(2, '0')}:${secondsUntil.toString().padStart(2, '0')}`
        }
      };
      
      // Set and notify if current prayer changed
      const prayerChanged = !this.currentPrayer || this.currentPrayer.name !== currentPrayer.name;
      
      this.currentPrayer = {
        name: currentPrayer.name,
        time: currentPrayer.time,
        next: nextPrayerInfo
      };
      
      if (prayerChanged) {
        console.log('[Core] Current prayer updated:', this.currentPrayer.name);
        this.notifyListeners('prayerChanged', { currentPrayer: this.currentPrayer });
      } else {
        this.notifyListeners('countdownUpdated', { nextPrayer: nextPrayerInfo });
      }
      
      return this.currentPrayer;
    } catch (error) {
      console.error('[Core] Error updating current prayer:', error);
      return null;
    }
  }
  
  /**
   * Convert prayer time string to Date object
   * @param {string} timeStr Time string in 24-hour format (HH:MM)
   * @returns {Date} Date object representing the prayer time today
   */
  convertPrayerTimeToDate(timeStr) {
    try {
      const now = new Date();
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const prayerTime = new Date(now);
      prayerTime.setHours(hours, minutes, 0, 0);
      
      return prayerTime;
    } catch (error) {
      console.error('[Core] Error converting prayer time:', error);
      return new Date();
    }
  }
  
  /**
   * Start auto-refresh for data
   */
  startAutoRefresh() {
    // Refresh all data every 5 minutes
    setInterval(() => {
      console.log('[Core] Performing auto-refresh of data...');
      this.updateAllData();
    }, 5 * 60 * 1000); // 5 minutes
  }
  
  /**
   * Set user location and update relevant data
   */
  async setLocation(location) {
    try {
      this.userLocation = location;
      
      // Store in localStorage
      localStorage.setItem('user-location', JSON.stringify(location));
      
      // Notify of location change
      this.notifyListeners('locationChanged', { location });
      
      // Refresh data with new location
      await this.updateAllData();
      
      return true;
    } catch (error) {
      console.error('[Core] Error setting location:', error);
      this.notifyListeners('error', { type: 'location', error: error.message });
      return false;
    }
  }
  
  /**
   * Detect user's location using browser geolocation API
   */
  async detectUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by your browser'));
        return;
      }
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log('[Core] Location detected:', lat, lng);
            
            // Try to reverse geocode to get city name
            const locationInfo = await this.reverseGeocode(lat, lng);
            
            const location = {
              lat,
              lng,
              name: locationInfo.city || 'Unknown Location',
              country: locationInfo.country || 'Unknown',
              timezone: locationInfo.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            
            await this.setLocation(location);
            resolve(location);
          } catch (error) {
            console.error('[Core] Error processing detected location:', error);
            reject(error);
          }
        },
        (error) => {
          console.error('[Core] Geolocation error:', error);
          reject(error);
        },
        options
      );
    });
  }
  
  /**
   * Attempt to get location details from coordinates using a geocoding service
   */
  async reverseGeocode(lat, lng) {
    try {
      // Try to use reverse geocoding API if available
      const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Unknown geocoding error');
      }
    } catch (error) {
      console.warn('[Core] Geocoding error:', error);
      
      // Return basic location info if API fails
      return {
        city: 'Unknown Location',
        country: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  }
  
  /**
   * Register event listener for core events
   * @param {string} event Event name
   * @param {Function} callback Callback function
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback);
    return this; // For chaining
  }
  
  /**
   * Remove event listener
   * @param {string} event Event name
   * @param {Function} callback Callback function to remove
   */
  off(event, callback) {
    if (!this.listeners[event]) return this;
    
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    return this;
  }
  
  /**
   * Notify all listeners of an event
   * @param {string} event Event name
   * @param {Object} data Event data
   */
  notifyListeners(event, data = {}) {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[Core] Error in ${event} listener:`, error);
      }
    });
  }
  
  /**
   * Clean up resources when dashboard is destroyed
   */
  destroy() {
    // Clear all intervals
    for (const interval of Object.values(this.intervals || {})) {
      clearInterval(interval);
    }
    
    // Clear all listeners
    this.listeners = {};
    
    console.log('[Core] Dashboard core resources cleaned up');
  }
}

// Export for global use
window.IslamicDashboardCore = IslamicDashboardCore;
