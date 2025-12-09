import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined'; // For backward compatibility
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Card Component
 * 通用卡片组件 - 支持悬停效果和深色模式
 * 使用 Tailwind CSS 实现现代化设计
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
  className = '',
}) => {
  // Base styles with dark mode support
  const baseStyles = 'rounded-xl bg-white dark:bg-slate-900 transition-all duration-200';
  
  // Variant styles (for backward compatibility)
  const variantStyles = {
    default: 'border border-slate-200 dark:border-slate-800 shadow-sm',
    elevated: 'shadow-md',
    outlined: 'border-2 border-slate-200 dark:border-slate-800',
  };
  
  // Padding styles
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  // Hoverable styles - Task 17.2: Enhanced hover effects
  const hoverStyles = hoverable ? 'hover:-translate-y-[2px] hover:shadow-lg hover:border-primary/60' : '';
  
  // Clickable styles
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  // Combine all styles
  const cardClasses = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
