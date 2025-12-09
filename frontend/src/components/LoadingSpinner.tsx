interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({ message = '加载中...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Message */}
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}

export default LoadingSpinner;
