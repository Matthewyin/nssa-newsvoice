/**
 * Performance Monitoring Utilities
 * 
 * Provides utilities for monitoring and reporting application performance
 * 
 * Requirements: 性能优化 - 13.3
 */

/**
 * Performance metrics interface
 */
interface PerformanceMetrics {
  // Navigation timing
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  
  // Resource timing
  totalResources: number;
  cachedResources: number;
  cacheHitRate: number;
  
  // Custom metrics
  timeToInteractive?: number;
  largestContentfulPaint?: number;
}

/**
 * Get navigation timing metrics
 */
export function getNavigationMetrics(): Partial<PerformanceMetrics> {
  if (!window.performance || !window.performance.timing) {
    return {};
  }

  const timing = window.performance.timing;
  const navigationStart = timing.navigationStart;

  return {
    domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
    loadComplete: timing.loadEventEnd - navigationStart,
  };
}

/**
 * Get paint timing metrics
 */
export function getPaintMetrics(): Partial<PerformanceMetrics> {
  if (!window.performance || !window.performance.getEntriesByType) {
    return {};
  }

  const paintEntries = window.performance.getEntriesByType('paint');
  const metrics: Partial<PerformanceMetrics> = {};

  paintEntries.forEach((entry) => {
    if (entry.name === 'first-paint') {
      metrics.firstPaint = entry.startTime;
    } else if (entry.name === 'first-contentful-paint') {
      metrics.firstContentfulPaint = entry.startTime;
    }
  });

  return metrics;
}

/**
 * Get resource timing and cache metrics
 */
export function getResourceMetrics(): Partial<PerformanceMetrics> {
  if (!window.performance || !window.performance.getEntriesByType) {
    return {};
  }

  const resources = window.performance.getEntriesByType('resource');
  const totalResources = resources.length;
  
  // Count cached resources (transferSize === 0 means from cache)
  const cachedResources = resources.filter(
    (resource: any) => resource.transferSize === 0
  ).length;

  const cacheHitRate = totalResources > 0 
    ? (cachedResources / totalResources) * 100 
    : 0;

  return {
    totalResources,
    cachedResources,
    cacheHitRate: Math.round(cacheHitRate * 100) / 100,
  };
}

/**
 * Get Largest Contentful Paint (LCP)
 */
export function getLargestContentfulPaint(): Promise<number> {
  return new Promise((resolve) => {
    if (!window.PerformanceObserver) {
      resolve(0);
      return;
    }

    let lcp = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcp = lastEntry.startTime;
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    // Stop observing after 10 seconds
    setTimeout(() => {
      observer.disconnect();
      resolve(lcp);
    }, 10000);
  });
}

/**
 * Get all performance metrics
 */
export async function getAllPerformanceMetrics(): Promise<PerformanceMetrics> {
  const navigationMetrics = getNavigationMetrics();
  const paintMetrics = getPaintMetrics();
  const resourceMetrics = getResourceMetrics();
  const lcp = await getLargestContentfulPaint();

  return {
    domContentLoaded: navigationMetrics.domContentLoaded || 0,
    loadComplete: navigationMetrics.loadComplete || 0,
    firstPaint: paintMetrics.firstPaint || 0,
    firstContentfulPaint: paintMetrics.firstContentfulPaint || 0,
    totalResources: resourceMetrics.totalResources || 0,
    cachedResources: resourceMetrics.cachedResources || 0,
    cacheHitRate: resourceMetrics.cacheHitRate || 0,
    largestContentfulPaint: lcp,
  };
}

/**
 * Log performance metrics to console (development only)
 */
export function logPerformanceMetrics(): void {
  if (import.meta.env.DEV) {
    window.addEventListener('load', async () => {
      // Wait a bit for all metrics to be available
      setTimeout(async () => {
        const metrics = await getAllPerformanceMetrics();
        
        console.group('📊 Performance Metrics');
        console.log('DOM Content Loaded:', `${metrics.domContentLoaded}ms`);
        console.log('Load Complete:', `${metrics.loadComplete}ms`);
        console.log('First Paint:', `${metrics.firstPaint}ms`);
        console.log('First Contentful Paint:', `${metrics.firstContentfulPaint}ms`);
        console.log('Largest Contentful Paint:', `${metrics.largestContentfulPaint}ms`);
        console.log('Total Resources:', metrics.totalResources);
        console.log('Cached Resources:', metrics.cachedResources);
        console.log('Cache Hit Rate:', `${metrics.cacheHitRate}%`);
        console.groupEnd();
      }, 2000);
    });
  }
}

/**
 * Report performance metrics to analytics service
 */
export async function reportPerformanceMetrics(
  analyticsService?: (metrics: PerformanceMetrics) => void
): Promise<void> {
  if (!analyticsService) {
    return;
  }

  try {
    const metrics = await getAllPerformanceMetrics();
    analyticsService(metrics);
  } catch (error) {
    console.error('Failed to report performance metrics:', error);
  }
}

/**
 * Monitor Core Web Vitals
 */
export function monitorCoreWebVitals(): void {
  if (!window.PerformanceObserver) {
    return;
  }

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      const fid = entry.processingStart - entry.startTime;
      console.log('FID:', fid);
    });
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsScore = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsScore += entry.value;
      }
    });
    console.log('CLS:', clsScore);
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });
}

/**
 * Check if resources are being cached properly
 */
export function checkCacheEffectiveness(): void {
  if (!window.performance || !window.performance.getEntriesByType) {
    console.warn('Performance API not available');
    return;
  }

  const resources = window.performance.getEntriesByType('resource');
  
  console.group('🗄️ Cache Effectiveness Report');
  
  const resourcesByType: Record<string, { total: number; cached: number }> = {};
  
  resources.forEach((resource: any) => {
    const type = resource.initiatorType || 'other';
    
    if (!resourcesByType[type]) {
      resourcesByType[type] = { total: 0, cached: 0 };
    }
    
    resourcesByType[type].total++;
    
    if (resource.transferSize === 0) {
      resourcesByType[type].cached++;
    }
  });
  
  Object.entries(resourcesByType).forEach(([type, stats]) => {
    const hitRate = (stats.cached / stats.total) * 100;
    console.log(
      `${type}:`,
      `${stats.cached}/${stats.total} cached (${hitRate.toFixed(1)}%)`
    );
  });
  
  console.groupEnd();
}

/**
 * Initialize performance monitoring
 * Call this in your main.tsx or App.tsx
 */
export function initPerformanceMonitoring(): void {
  if (import.meta.env.DEV) {
    logPerformanceMetrics();
    
    // Check cache effectiveness after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        checkCacheEffectiveness();
      }, 3000);
    });
  }
}
