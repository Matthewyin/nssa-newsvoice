import { useDarkMode } from '../../hooks/useDarkMode';

/**
 * ThemeToggle Component
 * 深色模式切换按钮
 * 
 * Features:
 * - Toggle between light and dark mode
 * - Smooth transition animation
 * - Accessible button with proper ARIA labels
 * - Saves user preference to localStorage
 * 
 * Requirements: 需求 12, 需求 14
 */

interface ThemeToggleProps {
  className?: string;
}

function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
        text-slate-600 transition-colors duration-200
        hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${className}
      `}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
      <p>{isDark ? 'Light Mode' : 'Dark Mode'}</p>
    </button>
  );
}

export default ThemeToggle;
