import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface TopNavBarProps {
  className?: string;
}

/**
 * TopNavBar Component
 * 顶部导航栏组件 - 用于公共页面
 * 
 * Features:
 * - Logo and brand name area
 * - Navigation links (首页, 所有来源, 关于我们)
 * - Login/Admin button
 * - Responsive design with mobile hamburger menu
 * - Sticky positioning with backdrop blur
 * - Shadow on scroll
 * 
 * Requirements: 需求 3, 需求 11
 */
export const TopNavBar: React.FC<TopNavBarProps> = ({ className = '' }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Add scroll listener to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`flex items-center justify-between whitespace-nowrap border-b border-gray-200/50 dark:border-gray-800/50 px-4 sm:px-10 py-3 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-30 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''} ${className}`}>
      {/* Logo and Brand Area */}
      <Link to="/" className="flex items-center gap-4 text-slate-900 dark:text-white">
        <div className="size-6 text-primary">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-tight">NewsVoice</h2>
      </Link>

      {/* Desktop Navigation and Button */}
      <div className="hidden md:flex flex-1 justify-end gap-8">
        <nav className="flex items-center gap-9" aria-label="主导航">
          <Link
            to="/"
            className={`text-sm font-medium ${isActivePath('/') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'} hover:text-primary dark:hover:text-primary transition-colors`}
          >
            首页
          </Link>
          <Link
            to="/sources"
            className={`text-sm font-medium ${isActivePath('/sources') ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'} hover:text-primary dark:hover:text-primary transition-colors`}
          >
            所有来源
          </Link>
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
          aria-label={mobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          {/* Mobile Menu */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 p-4">
            <nav className="flex flex-col gap-2" aria-label="移动端导航">
              <Link
                to="/"
                className={`px-4 py-3 text-base font-medium rounded-lg ${isActivePath('/') ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-300'} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
                onClick={closeMobileMenu}
              >
                首页
              </Link>
              <Link
                to="/sources"
                className={`px-4 py-3 text-base font-medium rounded-lg ${isActivePath('/sources') ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-300'} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
                onClick={closeMobileMenu}
              >
                所有来源
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default TopNavBar;
