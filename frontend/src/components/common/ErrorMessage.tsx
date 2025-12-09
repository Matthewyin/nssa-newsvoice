import React from 'react';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
  onRetry?: () => void; // Shortcut for retry action
  onDismiss?: () => void;
  className?: string;
}

/**
 * ErrorMessage Component
 * 错误消息组件 - 显示友好的错误、警告或信息提示
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = 'error',
  action,
  onRetry,
  onDismiss,
  className = '',
}) => {
  // If onRetry is provided but no action, create a default retry action
  const finalAction = action || (onRetry ? { label: '重试', onClick: onRetry } : undefined);
  const classNames = `flex items-start gap-3 rounded-lg border p-4 ${
    type === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
      : type === 'info'
      ? 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-100'
      : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-100'
  } ${className}`;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className={classNames} role="alert">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/60 dark:bg-black/10 border border-current/20">
        {getIcon()}
      </div>
      
      <div className="flex-1 space-y-1">
        {title && <h4 className="text-sm font-semibold text-current">{title}</h4>}
        <p className="text-sm text-current/80">{message}</p>

        {finalAction && (
          <button
            className="inline-flex items-center gap-1 text-sm font-medium text-current underline underline-offset-2 hover:opacity-80"
            onClick={finalAction.onClick}
            type="button"
          >
            {finalAction.label}
          </button>
        )}
      </div>
      
      {onDismiss && (
        <button
          className="p-1 text-current/70 hover:text-current"
          onClick={onDismiss}
          type="button"
          aria-label="关闭"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
