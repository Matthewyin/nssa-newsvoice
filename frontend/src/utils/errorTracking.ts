/**
 * Error Tracking Utilities
 * 
 * Provides utilities for tracking and reporting errors
 * 
 * Requirements: 需求 15 - 性能优化, Task 22.3 - 设置监控
 */

import { getAnalytics, logEvent } from 'firebase/analytics';

/**
 * Error context interface
 */
interface ErrorContext {
  page?: string;
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

/**
 * Log an error to Firebase Analytics
 */
export function logError(error: Error, context?: ErrorContext): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'exception', {
      description: error.message,
      fatal: false,
      stack: error.stack?.substring(0, 500), // Limit stack trace length
      page: context?.page || window.location.pathname,
      ...context
    });
    
    // Also log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged:', error, context);
    }
  } catch (e) {
    // Fail silently if analytics is not available
    console.error('Failed to log error:', e);
  }
}

/**
 * Log a warning to Firebase Analytics
 */
export function logWarning(message: string, context?: ErrorContext): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'warning', {
      message,
      page: context?.page || window.location.pathname,
      ...context
    });
    
    if (import.meta.env.DEV) {
      console.warn('Warning logged:', message, context);
    }
  } catch (e) {
    console.warn('Failed to log warning:', e);
  }
}

/**
 * Initialize global error handlers
 */
export function initErrorTracking(): void {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    logError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'uncaught_error'
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(String(event.reason)), {
      type: 'unhandled_promise_rejection'
    });
  });

  // Handle console errors (optional, for debugging)
  if (import.meta.env.DEV) {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      originalError.apply(console, args);
      
      // Log to analytics if it's an Error object
      if (args[0] instanceof Error) {
        logError(args[0], { type: 'console_error' });
      }
    };
  }
}

/**
 * Track API errors
 */
export function logApiError(
  endpoint: string,
  status: number,
  message: string,
  context?: ErrorContext
): void {
  logError(new Error(`API Error: ${message}`), {
    endpoint,
    status,
    type: 'api_error',
    ...context
  });
}

/**
 * Track authentication errors
 */
export function logAuthError(error: Error, action: string): void {
  logError(error, {
    type: 'auth_error',
    action
  });
}

/**
 * Track navigation errors
 */
export function logNavigationError(error: Error, route: string): void {
  logError(error, {
    type: 'navigation_error',
    route
  });
}
