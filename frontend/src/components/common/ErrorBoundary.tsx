import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 错误边界组件 - 捕获子组件树中的 JavaScript 错误
 * 
 * 需求 14: 加载和错误状态
 * 
 * 使用方法:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="max-w-3xl mx-auto p-6">
          <Card variant="outlined" padding="lg" className="space-y-4 text-center">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-200">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">出错了</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              抱歉，页面遇到了一些问题。请尝试刷新页面或联系技术支持。
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-left p-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <summary className="font-semibold cursor-pointer">错误详情（仅开发环境显示）</summary>
                <div className="space-y-2">
                  <p>
                    <strong>错误:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="whitespace-pre-wrap break-words">{this.state.errorInfo.componentStack}</pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={this.handleReset}
              >
                重试
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                刷新页面
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
