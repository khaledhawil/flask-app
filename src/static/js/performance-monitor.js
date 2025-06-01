/**
 * Performance Monitoring for Islamic App User Data System
 * Monitors sync performance, API response times, and user interactions
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            syncOperations: [],
            apiCalls: [],
            userInteractions: [],
            errors: [],
            loadTimes: {}
        };
        this.isEnabled = localStorage.getItem('performance_monitoring') === 'true';
        this.init();
    }

    init() {
        if (!this.isEnabled) return;

        // Monitor page load performance
        this.trackPageLoad();
        
        // Monitor user interactions
        this.trackUserInteractions();
        
        // Monitor API calls
        this.interceptFetch();
        
        // Monitor sync operations
        this.monitorSyncOperations();
        
        // Set up periodic reporting
        this.setupPeriodicReporting();
        
        console.log('📊 Performance Monitor initialized');
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            
            this.metrics.loadTimes[window.location.pathname] = {
                timestamp: Date.now(),
                loadTime: Math.round(loadTime),
                domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
                firstPaint: this.getFirstPaint(),
                resources: performance.getEntriesByType('resource').length
            };
            
            this.log(`Page loaded in ${Math.round(loadTime)}ms`);
        });
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }

    trackUserInteractions() {
        // Track clicks on key elements
        const trackableElements = [
            '.prayer-notification .toggle-switch',
            '.bookmark-btn',
            '.favorite-btn',
            '.sync-btn',
            '#testNotificationBtn'
        ];

        trackableElements.forEach(selector => {
            document.addEventListener('click', (e) => {
                if (e.target.closest(selector)) {
                    this.recordInteraction('click', selector, Date.now());
                }
            });
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.recordInteraction('form_submit', e.target.id || 'unknown_form', Date.now());
        });
    }

    recordInteraction(type, element, timestamp) {
        this.metrics.userInteractions.push({
            type,
            element,
            timestamp,
            page: window.location.pathname
        });
    }

    interceptFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const url = args[0];
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);
                
                this.recordApiCall(url, response.status, duration, true);
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);
                
                this.recordApiCall(url, 0, duration, false, error.message);
                this.recordError('fetch_error', error.message, url);
                
                throw error;
            }
        };
    }

    recordApiCall(url, status, duration, success, error = null) {
        // Only track our app's API calls
        if (typeof url === 'string' && (url.startsWith('/') || url.includes('localhost'))) {
            this.metrics.apiCalls.push({
                url,
                status,
                duration,
                success,
                error,
                timestamp: Date.now()
            });
        }
    }

    monitorSyncOperations() {
        // Monitor sync events if userDataSync is available
        if (window.userDataSync) {
            // Override sync methods to track performance
            const originalSync = window.userDataSync.syncUserData;
            if (originalSync) {
                window.userDataSync.syncUserData = async (...args) => {
                    const startTime = performance.now();
                    try {
                        const result = await originalSync.apply(window.userDataSync, args);
                        const duration = Math.round(performance.now() - startTime);
                        this.recordSyncOperation('sync_user_data', duration, true);
                        return result;
                    } catch (error) {
                        const duration = Math.round(performance.now() - startTime);
                        this.recordSyncOperation('sync_user_data', duration, false, error.message);
                        throw error;
                    }
                };
            }
        }
    }

    recordSyncOperation(operation, duration, success, error = null) {
        this.metrics.syncOperations.push({
            operation,
            duration,
            success,
            error,
            timestamp: Date.now()
        });
    }

    recordError(type, message, context = null) {
        this.metrics.errors.push({
            type,
            message,
            context,
            timestamp: Date.now(),
            page: window.location.pathname,
            userAgent: navigator.userAgent
        });
    }

    setupPeriodicReporting() {
        // Report every 5 minutes
        setInterval(() => {
            this.generateReport();
        }, 5 * 60 * 1000);

        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.generateReport();
        });
    }

    generateReport() {
        if (!this.isEnabled) return;

        const report = {
            timestamp: Date.now(),
            session: this.getSessionId(),
            user: window.userDataSync ? window.userDataSync.userId : null,
            metrics: this.getMetricsSummary(),
            performance: this.getPerformanceSummary()
        };

        // Store locally
        this.saveReport(report);
        
        // Send to server if possible
        this.sendReportToServer(report);
        
        console.log('📊 Performance Report Generated:', report);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('performance_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('performance_session_id', sessionId);
        }
        return sessionId;
    }

    getMetricsSummary() {
        const now = Date.now();
        const last5Min = now - (5 * 60 * 1000);

        return {
            apiCalls: {
                total: this.metrics.apiCalls.length,
                recent: this.metrics.apiCalls.filter(call => call.timestamp > last5Min).length,
                averageResponseTime: this.calculateAverage(this.metrics.apiCalls, 'duration'),
                successRate: this.calculateSuccessRate(this.metrics.apiCalls)
            },
            syncOperations: {
                total: this.metrics.syncOperations.length,
                recent: this.metrics.syncOperations.filter(op => op.timestamp > last5Min).length,
                averageDuration: this.calculateAverage(this.metrics.syncOperations, 'duration'),
                successRate: this.calculateSuccessRate(this.metrics.syncOperations)
            },
            userInteractions: {
                total: this.metrics.userInteractions.length,
                recent: this.metrics.userInteractions.filter(interaction => interaction.timestamp > last5Min).length,
                topInteractions: this.getTopInteractions()
            },
            errors: {
                total: this.metrics.errors.length,
                recent: this.metrics.errors.filter(error => error.timestamp > last5Min).length,
                topErrors: this.getTopErrors()
            }
        };
    }

    getPerformanceSummary() {
        return {
            loadTimes: this.metrics.loadTimes,
            memory: this.getMemoryInfo(),
            connection: this.getConnectionInfo(),
            browserInfo: this.getBrowserInfo()
        };
    }

    calculateAverage(array, field) {
        if (array.length === 0) return 0;
        const sum = array.reduce((acc, item) => acc + (item[field] || 0), 0);
        return Math.round(sum / array.length);
    }

    calculateSuccessRate(array) {
        if (array.length === 0) return 100;
        const successful = array.filter(item => item.success).length;
        return Math.round((successful / array.length) * 100);
    }

    getTopInteractions() {
        const interactions = {};
        this.metrics.userInteractions.forEach(interaction => {
            const key = `${interaction.type}:${interaction.element}`;
            interactions[key] = (interactions[key] || 0) + 1;
        });
        
        return Object.entries(interactions)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([key, count]) => ({ interaction: key, count }));
    }

    getTopErrors() {
        const errors = {};
        this.metrics.errors.forEach(error => {
            errors[error.type] = (errors[error.type] || 0) + 1;
        });
        
        return Object.entries(errors)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([type, count]) => ({ type, count }));
    }

    getMemoryInfo() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }

    getConnectionInfo() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }

    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    saveReport(report) {
        try {
            const reports = JSON.parse(localStorage.getItem('performance_reports') || '[]');
            reports.push(report);
            
            // Keep only last 50 reports
            if (reports.length > 50) {
                reports.splice(0, reports.length - 50);
            }
            
            localStorage.setItem('performance_reports', JSON.stringify(reports));
        } catch (error) {
            console.error('Error saving performance report:', error);
        }
    }

    async sendReportToServer(report) {
        try {
            await fetch('/api/performance-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(report)
            });
        } catch (error) {
            // Silently fail - performance reporting shouldn't break the app
            console.debug('Could not send performance report to server:', error);
        }
    }

    // Public methods for manual monitoring
    log(message) {
        if (this.isEnabled) {
            console.log(`📊 [Performance] ${message}`);
        }
    }

    markCustomEvent(eventName, data = {}) {
        if (!this.isEnabled) return;
        
        this.recordInteraction('custom_event', eventName, Date.now());
        console.log(`📊 [Custom Event] ${eventName}`, data);
    }

    getStats() {
        return {
            summary: this.getMetricsSummary(),
            performance: this.getPerformanceSummary()
        };
    }

    // Enable/disable monitoring
    enable() {
        this.isEnabled = true;
        localStorage.setItem('performance_monitoring', 'true');
        this.init();
        console.log('📊 Performance monitoring enabled');
    }

    disable() {
        this.isEnabled = false;
        localStorage.setItem('performance_monitoring', 'false');
        console.log('📊 Performance monitoring disabled');
    }
}

// Create global instance
window.performanceMonitor = new PerformanceMonitor();

// Console helper
console.log(`
📊 Performance Monitor Loaded!

Commands:
- performanceMonitor.enable() - Enable monitoring
- performanceMonitor.disable() - Disable monitoring  
- performanceMonitor.getStats() - Get current statistics
- performanceMonitor.markCustomEvent('event_name') - Mark custom event
- performanceMonitor.generateReport() - Generate immediate report

Status: ${window.performanceMonitor.isEnabled ? 'Enabled' : 'Disabled'}
`);

// Auto-enable in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.performanceMonitor.enable();
}
