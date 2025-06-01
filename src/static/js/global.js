/**
 * Global Functions for Islamic App
 * وظائف عامة للتطبيق الإسلامي
 */

// Quick access functions for buttons
function incrementDhikr() {
    if (window.islamicDashboard) {
        window.islamicDashboard.incrementDhikr();
    }
}

function startQuickDhikr() {
    if (window.islamicDashboard) {
        window.islamicDashboard.startQuickDhikr();
    }
}

// Utility functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
        font-family: 'Cairo', sans-serif;
        font-weight: 600;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Store dashboard instance globally
    if (typeof IslamicDashboard !== 'undefined') {
        window.islamicDashboard = new IslamicDashboard();
    }
});
