import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

/**
 * Badge Component
 * 状态徽章组件 - 支持多种状态类型和尺寸
 * 使用 Tailwind CSS 实现现代化设计，支持深色模式
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  dot = false,
  className = '',
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center rounded-full font-medium';
  
  // Variant styles with dark mode support
  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    error: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };
  
  // Dot color styles
  const dotColorStyles = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    default: 'bg-slate-400',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  // Combine all styles
  const badgeClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <span className={badgeClasses}>
      {dot && (
        <span className={`w-2 h-2 rounded-full mr-2 ${dotColorStyles[variant]}`}></span>
      )}
      {children}
    </span>
  );
};

export default Badge;
