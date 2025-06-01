/**
 * Global Dark Theme Manager for Islamic App
 * Ensures consistent dark theme across all pages optimized for Egyptian users
 */

class IslamicThemeManager {
    constructor() {
        this.defaultTheme = 'dark'; // Default to dark theme for Islamic app
        this.currentTheme = null;
        this.init();
    }
    
    init() {
        // Load saved theme or default to dark
        this.currentTheme = localStorage.getItem('islamic-app-theme') || this.defaultTheme;
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.initializeForEgypt();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Update all theme toggle buttons
        this.updateToggleButtons(theme);
        
        // Save theme preference
        localStorage.setItem('islamic-app-theme', theme);
        
        // Emit custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.currentTheme = newTheme;
        this.applyTheme(newTheme);
        
        // Show notification
        this.showThemeNotification(newTheme);
    }
    
    updateToggleButtons(theme) {
        const toggleButtons = document.querySelectorAll('.theme-toggle, .theme-toggle-btn, [data-theme-toggle]');
        toggleButtons.forEach(button => {
            const icon = button.querySelector('i') || button;
            if (icon) {
                // Update icon based on current theme
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun'; // Show sun icon to switch to light
                } else {
                    icon.className = 'fas fa-moon'; // Show moon icon to switch to dark
                }
            }
        });
    }
    
    setupThemeToggle() {
        // Add click listeners to all theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle, .theme-toggle-btn, [data-theme-toggle]')) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    initializeForEgypt() {
        // Set Egypt-specific preferences
        const egyptPreferences = {
            defaultLocation: {
                name: 'القاهرة',
                country: 'مصر',
                lat: 30.0444,
                lng: 31.2357
            },
            language: 'ar',
            direction: 'rtl',
            calendar: 'hijri-primary'
        };
        
        // Apply Egypt-specific settings if not already set
        if (!localStorage.getItem('user-location')) {
            localStorage.setItem('user-location', JSON.stringify(egyptPreferences.defaultLocation));
        }
        
        if (!localStorage.getItem('app-language')) {
            localStorage.setItem('app-language', egyptPreferences.language);
        }
    }
    
    showThemeNotification(theme) {
        // Create notification if notification system exists
        if (typeof showNotification === 'function') {
            const message = theme === 'dark' ? 
                '🌙 تم تفعيل الوضع المظلم' : 
                '☀️ تم تفعيل الوضع المضيء';
            showNotification(message, 'success');
        } else {
            // Fallback notification
            this.createSimpleNotification(theme);
        }
    }
    
    createSimpleNotification(theme) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg, rgba(30, 41, 59, 0.9));
            backdrop-filter: blur(10px);
            color: var(--text-color, white);
            padding: 12px 20px;
            border-radius: 8px;
            border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'Cairo', sans-serif;
            font-weight: 500;
            transition: all 0.3s ease;
            transform: translateX(100%);
        `;
        
        notification.textContent = theme === 'dark' ? 
            '🌙 تم تفعيل الوضع المظلم' : 
            '☀️ تم تفعيل الوضع المضيء';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Method to force theme (for system preference detection)
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.currentTheme = theme;
            this.applyTheme(theme);
        }
    }
    
    // Detect system preference and apply if user hasn't set preference
    detectSystemPreference() {
        if (!localStorage.getItem('islamic-app-theme')) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.setTheme('dark');
            } else {
                // Default to dark for Islamic app regardless of system preference
                this.setTheme('dark');
            }
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.islamicThemeManager = new IslamicThemeManager();
    
    // Also make toggle function globally available for backward compatibility
    window.toggleTheme = () => {
        window.islamicThemeManager.toggleTheme();
    };
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('islamic-app-theme')) {
            window.islamicThemeManager.setTheme('dark'); // Always prefer dark for Islamic app
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IslamicThemeManager;
}
