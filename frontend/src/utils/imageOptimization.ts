/**
 * Image Optimization Utilities
 * 
 * Provides utilities for optimizing image loading and performance
 * 
 * Requirements: 需求 15 - 性能优化
 */

/**
 * Generate srcset string for responsive images
 * @param baseUrl - Base URL of the image
 * @param widths - Array of widths to generate
 * @returns srcset string
 */
export function generateSrcSet(baseUrl: string, widths: number[]): string {
  return widths
    .map(width => {
      // If the URL already has query params, append with &, otherwise use ?
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}w=${width} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * @param breakpoints - Object mapping breakpoints to sizes
 * @returns sizes string
 * 
 * Example:
 * generateSizes({
 *   '640px': '100vw',
 *   '768px': '50vw',
 *   '1024px': '33vw'
 * })
 * // Returns: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
 */
export function generateSizes(breakpoints: Record<string, string>): string {
  const entries = Object.entries(breakpoints);
  const mediaQueries = entries
    .slice(0, -1)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`);
  
  // Last entry is the default size
  const defaultSize = entries[entries.length - 1][1];
  
  return [...mediaQueries, defaultSize].join(', ');
}

/**
 * Check if WebP is supported by the browser
 * @returns Promise that resolves to true if WebP is supported
 */
export async function isWebPSupported(): Promise<boolean> {
  // Check if we've already cached the result
  const cached = sessionStorage.getItem('webp-support');
  if (cached !== null) {
    return cached === 'true';
  }

  // Create a test WebP image
  const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const supported = img.width === 1;
      sessionStorage.setItem('webp-support', String(supported));
      resolve(supported);
    };
    img.onerror = () => {
      sessionStorage.setItem('webp-support', 'false');
      resolve(false);
    };
    img.src = webpData;
  });
}

/**
 * Get optimized image URL with format and size parameters
 * @param url - Original image URL
 * @param options - Optimization options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    format?: 'webp' | 'jpeg' | 'png';
    quality?: number;
  } = {}
): string {
  // If it's a data URL or external URL without optimization support, return as-is
  if (url.startsWith('data:') || !url.includes('http')) {
    return url;
  }

  const params = new URLSearchParams();
  
  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.format) params.set('fm', options.format);
  if (options.quality) params.set('q', String(options.quality));

  const separator = url.includes('?') ? '&' : '?';
  return params.toString() ? `${url}${separator}${params.toString()}` : url;
}

/**
 * Preload critical images
 * @param urls - Array of image URLs to preload
 */
export function preloadImages(urls: string[]): void {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Calculate optimal image dimensions based on container size and device pixel ratio
 * @param containerWidth - Width of the container in pixels
 * @param containerHeight - Height of the container in pixels
 * @returns Optimal dimensions for the image
 */
export function getOptimalImageDimensions(
  containerWidth: number,
  containerHeight?: number
): { width: number; height?: number } {
  const dpr = window.devicePixelRatio || 1;
  
  // Cap DPR at 2 to avoid loading unnecessarily large images
  const cappedDpr = Math.min(dpr, 2);
  
  return {
    width: Math.ceil(containerWidth * cappedDpr),
    height: containerHeight ? Math.ceil(containerHeight * cappedDpr) : undefined,
  };
}

/**
 * Standard responsive image widths for srcset
 */
export const RESPONSIVE_WIDTHS = [320, 640, 768, 1024, 1280, 1536];

/**
 * Standard breakpoints for sizes attribute
 */
export const STANDARD_SIZES = {
  mobile: '(max-width: 640px) 100vw',
  tablet: '(max-width: 1024px) 50vw',
  desktop: '33vw',
};
