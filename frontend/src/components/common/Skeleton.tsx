import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

/**
 * Skeleton Component
 * 骨架屏组件 - 用于内容加载时的占位符
 * 使用 Tailwind CSS 实现现代化设计
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
}) => {
  // Base styles
  const baseStyles = 'bg-slate-200 dark:bg-slate-700';
  
  // Variant styles
  const variantStyles = {
    text: 'rounded h-4',
    rectangular: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };
  
  // Animation styles - Task 17.3: Enhanced loading animations
  const animationStyles = {
    pulse: 'skeleton-pulse',
    wave: 'skeleton-wave',
    none: '',
  };
  
  // Combine all styles
  const skeletonClasses = `${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`;

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div 
      className={skeletonClasses} 
      style={style}
      aria-busy="true"
      aria-live="polite"
      aria-label="加载中"
    />
  );
};

export default Skeleton;
