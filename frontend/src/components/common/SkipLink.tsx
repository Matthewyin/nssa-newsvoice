import React from 'react';

export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SkipLink Component
 * 跳过导航链接 - 用于键盘导航用户快速跳转到主要内容
 * 
 * Features:
 * - Hidden until focused
 * - Allows keyboard users to skip repetitive navigation
 * - WCAG 2.1 Level A requirement
 * 
 * Requirements: 需求 14
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className = '',
}) => {
  return (
    <a
      href={href}
      className={`skip-link ${className}`}
    >
      {children}
    </a>
  );
};

export default SkipLink;
