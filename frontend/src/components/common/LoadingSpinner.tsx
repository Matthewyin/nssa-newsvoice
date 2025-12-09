import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  message?: string;
  className?: string;
  variant?: 'spinner' | 'dots';
}

/**
 * LoadingSpinner Component
 * 加载指示器组件 - 支持多种尺寸、颜色和变体
 * 使用 Tailwind CSS 实现现代化设计
 * 
 * Task 17.3: Enhanced loading animations
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  message,
  className = '',
  variant = 'spinner',
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  // Color styles
  const colorStyles = {
    primary: 'text-[#1387ec]',
    secondary: 'text-slate-500',
    white: 'text-white',
  };

  const spinner = (
    <div className={`flex flex-col items-center gap-3 ${className}`} role="status" aria-live="polite">
      {variant === 'spinner' ? (
        <svg 
          className={`spinner ${sizeStyles[size]} ${colorStyles[color]}`}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <div className={`dots-loading ${colorStyles[color]}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {message && (
        <span className="text-sm text-slate-600 dark:text-slate-400">{message}</span>
      )}
      <span className="sr-only">加载中...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
