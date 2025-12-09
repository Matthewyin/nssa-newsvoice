/**
 * Dynamic Import Utilities
 * 
 * Provides utilities for lazy loading components and modules
 * 
 * Requirements: 需求 15 - 性能优化
 */

import { lazy, ComponentType } from 'react';

/**
 * Retry configuration for dynamic imports
 */
interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Create a lazy component with retry logic
 * Useful for handling network failures during chunk loading
 * 
 * @param importFn - Function that returns a dynamic import promise
 * @param config - Retry configuration
 * @returns Lazy component
 * 
 * @example
 * ```tsx
 * const MyComponent = lazyWithRetry(
 *   () => import('./MyComponent'),
 *   { maxRetries: 3, retryDelay: 1000 }
 * );
 * ```
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: RetryConfig = {}
): React.LazyExoticComponent<T> {
  const { maxRetries = 3, retryDelay = 1000 } = config;

  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      let retries = 0;

      const attemptImport = () => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (retries < maxRetries) {
              retries++;
              console.warn(
                `Failed to load component, retrying (${retries}/${maxRetries})...`,
                error
              );
              setTimeout(attemptImport, retryDelay);
            } else {
              console.error('Failed to load component after max retries', error);
              reject(error);
            }
          });
      };

      attemptImport();
    });
  });
}

/**
 * Preload a lazy component
 * Useful for preloading components that will be needed soon
 * 
 * @param importFn - Function that returns a dynamic import promise
 * 
 * @example
 * ```tsx
 * const MyComponent = lazy(() => import('./MyComponent'));
 * 
 * // Preload on hover
 * <button onMouseEnter={() => preloadComponent(() => import('./MyComponent'))}>
 *   Open Modal
 * </button>
 * ```
 */
export function preloadComponent(
  importFn: () => Promise<any>
): Promise<any> {
  return importFn();
}

/**
 * Create a lazy component that preloads on hover
 * 
 * @param importFn - Function that returns a dynamic import promise
 * @returns Object with lazy component and preload function
 * 
 * @example
 * ```tsx
 * const { Component, preload } = lazyWithPreload(() => import('./MyComponent'));
 * 
 * <button onMouseEnter={preload}>
 *   <Suspense fallback={<Loading />}>
 *     <Component />
 *   </Suspense>
 * </button>
 * ```
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  let componentPromise: Promise<{ default: T }> | null = null;

  const preload = () => {
    if (!componentPromise) {
      componentPromise = importFn();
    }
    return componentPromise;
  };

  const Component = lazy(() => {
    if (!componentPromise) {
      componentPromise = importFn();
    }
    return componentPromise;
  });

  return { Component, preload };
}

/**
 * Dynamically import a module with error handling
 * 
 * @param importFn - Function that returns a dynamic import promise
 * @returns Promise that resolves to the module
 * 
 * @example
 * ```tsx
 * const module = await importWithErrorHandling(
 *   () => import('./utils/helper')
 * );
 * ```
 */
export async function importWithErrorHandling<T>(
  importFn: () => Promise<T>
): Promise<T | null> {
  try {
    return await importFn();
  } catch (error) {
    console.error('Failed to dynamically import module:', error);
    
    // You could add error reporting here
    // reportError(error);
    
    return null;
  }
}

/**
 * Prefetch a route by preloading its component
 * Useful for prefetching routes that the user is likely to visit
 * 
 * @param routePath - Route path to prefetch
 * @param importFn - Function that returns a dynamic import promise
 * 
 * @example
 * ```tsx
 * // Prefetch admin dashboard when user hovers over admin link
 * <Link 
 *   to="/admin"
 *   onMouseEnter={() => prefetchRoute('/admin', () => import('./pages/admin/Dashboard'))}
 * >
 *   Admin
 * </Link>
 * ```
 */
export function prefetchRoute(
  routePath: string,
  importFn: () => Promise<any>
): void {
  // Check if already prefetched
  const prefetchKey = `prefetch:${routePath}`;
  
  if (sessionStorage.getItem(prefetchKey)) {
    return;
  }

  // Prefetch the component
  importFn()
    .then(() => {
      sessionStorage.setItem(prefetchKey, 'true');
      console.log(`Prefetched route: ${routePath}`);
    })
    .catch((error) => {
      console.error(`Failed to prefetch route ${routePath}:`, error);
    });
}

/**
 * Check if a module has been loaded
 * 
 * @param modulePath - Path to the module
 * @returns True if the module has been loaded
 */
export function isModuleLoaded(modulePath: string): boolean {
  // This is a simplified check - in production you might want to use
  // a more sophisticated method to track loaded modules
  return sessionStorage.getItem(`loaded:${modulePath}`) === 'true';
}

/**
 * Mark a module as loaded
 * 
 * @param modulePath - Path to the module
 */
export function markModuleAsLoaded(modulePath: string): void {
  sessionStorage.setItem(`loaded:${modulePath}`, 'true');
}
