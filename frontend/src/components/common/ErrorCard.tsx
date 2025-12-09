import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

export interface ErrorCardProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'permission';
  icon?: 'error' | 'warning' | 'info' | 'lock' | 'network' | 'notfound';
  onRetry?: () => void;
  onAction?: {
    label: string;
    onClick: () => void;
  };
  showDetails?: boolean;
  details?: string;
  className?: string;
}

/**
 * ErrorCard Component
 * 错误卡片组件 - 用于显示各种错误状态的卡片
 * 
 * 需求 14: 加载和错误状态
 * 
 * 支持的错误类型:
 * - error: 一般错误
 * - warning: 警告信息
 * - info: 提示信息
 * - permission: 权限错误
 */
export const ErrorCard: React.FC<ErrorCardProps> = ({
  title,
  message,
  type = 'error',
  icon,
  onRetry,
  onAction,
  showDetails = false,
  details,
  className = '',
}) => {
  const getIcon = () => {
    const iconType = icon || type;
    
    switch (iconType) {
      case 'error':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      
      case 'warning':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      
      case 'info':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      
      case 'lock':
      case 'permission':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      
      case 'network':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2" />
          </svg>
        );
      
      case 'notfound':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="11" x2="14" y2="11" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  const tone = {
    error: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-100',
    warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100',
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100',
    permission: 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-100',
  }[type];

  return (
    <Card variant="outlined" padding="lg" className={`space-y-4 ${tone} ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-black/10 border border-current/20 text-current">
          <div className="w-5 h-5">{getIcon()}</div>
        </div>
        <div className="space-y-1">
          {title && (
            <h3 className="text-base font-semibold text-current">{title}</h3>
          )}
          <p className="text-sm text-current/80">{message}</p>
        </div>
      </div>

      {showDetails && details && (
        <details className="rounded-lg border border-current/20 bg-white/50 dark:bg-black/10 px-3 py-2 text-sm text-current/80">
          <summary className="cursor-pointer font-semibold">查看详情</summary>
          <div className="mt-2 whitespace-pre-wrap break-words">{details}</div>
        </details>
      )}

      {(onRetry || onAction) && (
        <div className="flex flex-wrap items-center gap-3">
          {onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
            >
              重试
            </Button>
          )}
          {onAction && (
            <Button
              variant="outline"
              onClick={onAction.onClick}
            >
              {onAction.label}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default ErrorCard;
