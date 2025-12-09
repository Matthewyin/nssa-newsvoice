import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';

/**
 * PublicLayout Component
 * 公共页面布局 - 包含顶部导航和主内容区域
 * 
 * Features:
 * - Top navigation bar with sticky positioning
 * - Main content area with responsive padding
 * - Footer
 * - Page transition animations
 * - Responsive layout
 * 
 * Requirements: 需求 3, 需求 11
 */
export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        跳到主内容
      </a>

      {/* Top Navigation Bar */}
      <TopNavBar />

      {/* Main Content Area */}
      <main
        id="main-content"
        className="flex-1 flex flex-col"
      >
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
            {/* Page Content */}
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 px-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 NewsVoice. 保留所有权利。
          </p>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary link-hover"
            >
              隐私政策
            </a>
            <a
              href="/contact"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary link-hover"
            >
              联系我们
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
