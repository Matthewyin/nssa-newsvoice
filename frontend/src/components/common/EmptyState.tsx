import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'inbox' | 'search' | 'briefing' | 'news' | 'config' | 'custom';
  customIcon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * EmptyState Component
 * 空状态组件 - 用于显示无内容时的友好提示
 * 
 * 需求 14: 加载和错误状态
 * 
 * 支持的场景:
 * - 无简报时的空状态
 * - 无搜索结果的空状态
 * - 无配置项的空状态
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'inbox',
  customIcon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  size = 'md',
  className = '',
}) => {
  const getIcon = () => {
    if (customIcon) {
      return customIcon;
    }

    switch (icon) {
      case 'inbox':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      
      case 'search':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      
      case 'briefing':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2" strokeLinecap="round" />
            <polyline points="10 9 9 9 8 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      
      case 'news':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      
      case 'config':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m13.2 5.2l-4.2-4.2m0-6l-4.2-4.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  const sizing = {
    sm: 'p-6 text-center gap-3',
    md: 'p-8 text-center gap-4',
    lg: 'p-10 text-center gap-5',
  }[size];

  const iconWrapper = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${sizing} ${className}`} role="status" aria-live="polite">
      <div className={`flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 ${iconWrapper}`}>
        <div className="w-6 h-6">{getIcon()}</div>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>

      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">{description}</p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button
              variant="primary"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
