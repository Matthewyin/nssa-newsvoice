/**
 * Theme Initialization
 * 
 * This script runs before React hydration to prevent flash of unstyled content (FOUC)
 * It checks localStorage and system preferences to apply the correct theme immediately
 * 
 * Requirements: 需求 12
 */

export function initializeTheme() {
  try {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      // Use saved preference
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // No saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  } catch (error) {
    console.error('Failed to initialize theme:', error);
    // Fallback to light mode
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Listen for system theme changes
 * Allows the app to respond to system theme changes if user hasn't set a preference
 */
export function watchSystemTheme() {
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't explicitly set a preference
      const savedTheme = localStorage.getItem('theme');
      
      if (!savedTheme) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  } catch (error) {
    console.error('Failed to watch system theme:', error);
    return () => {};
  }
}
