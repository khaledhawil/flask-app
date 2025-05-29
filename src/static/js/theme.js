// Theme management for Islamic App
document.addEventListener('DOMContentLoaded', function() {
    console.log("Theme script loaded");
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('appTheme') || 'dark';
    
    // Apply saved theme or default to dark
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
    
    // Setup theme toggle buttons
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    console.log("Found theme buttons:", themeButtons.length);
    themeButtons.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
});

function toggleTheme() {
    console.log("Toggle theme called");
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('appTheme', newTheme);
    updateThemeIcons(newTheme);
    console.log(`Switched to ${newTheme} theme`);
}

function updateThemeIcons(theme) {
    // Update all theme toggle buttons' icons
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
        if (theme === 'light') {
            btn.innerHTML = '<i class="fas fa-moon"></i>';  // Moon icon for switching to dark
        } else {
            btn.innerHTML = '<i class="fas fa-sun"></i>';   // Sun icon for switching to light
        }
    });
}
