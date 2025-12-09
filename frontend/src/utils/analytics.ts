/**
 * Analytics Utilities
 * 
 * Provides utilities for tracking user behavior and events
 * 
 * Requirements: 需求 15 - 性能优化, Task 22.3 - 设置监控
 */

import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';

/**
 * Track page view
 */
export function trackPageView(pageName: string, pageTitle?: string): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'page_view', {
      page_title: pageTitle || pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track page view:', e);
  }
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, context?: Record<string, any>): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'button_click', {
      button_name: buttonName,
      page: window.location.pathname,
      ...context
    });
  } catch (e) {
    console.error('Failed to track button click:', e);
  }
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(featureName: string, context?: Record<string, any>): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'feature_used', {
      feature_name: featureName,
      page: window.location.pathname,
      ...context
    });
  } catch (e) {
    console.error('Failed to track feature usage:', e);
  }
}

/**
 * Track dark mode toggle
 */
export function trackDarkModeToggle(enabled: boolean): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'dark_mode_toggle', {
      enabled: enabled,
      page: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track dark mode toggle:', e);
  }
}

/**
 * Track search
 */
export function trackSearch(query: string, resultsCount: number): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'search', {
      search_term: query,
      results_count: resultsCount,
      page: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track search:', e);
  }
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, success: boolean): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'form_submission', {
      form_name: formName,
      success: success,
      page: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track form submission:', e);
  }
}

/**
 * Track login
 */
export function trackLogin(method: string): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'login', {
      method: method
    });
  } catch (e) {
    console.error('Failed to track login:', e);
  }
}

/**
 * Track logout
 */
export function trackLogout(): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'logout', {
      page: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track logout:', e);
  }
}

/**
 * Track external link click
 */
export function trackExternalLink(url: string, linkText?: string): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'external_link_click', {
      url: url,
      link_text: linkText,
      page: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track external link:', e);
  }
}

/**
 * Track file download
 */
export function trackDownload(fileName: string, fileType: string): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'file_download', {
      file_name: fileName,
      file_type: fileType,
      page: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track download:', e);
  }
}

/**
 * Track audio play
 */
export function trackAudioPlay(audioId: string, audioTitle?: string): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'audio_play', {
      audio_id: audioId,
      audio_title: audioTitle,
      page: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track audio play:', e);
  }
}

/**
 * Track share action
 */
export function trackShare(method: string, contentType: string): void {
  try {
    const analytics = getAnalytics();
    
    logEvent(analytics, 'share', {
      method: method,
      content_type: contentType,
      page: window.location.pathname
    });
  } catch (e) {
    console.error('Failed to track share:', e);
  }
}

/**
 * Set user properties
 */
export function setUserAnalyticsProperties(properties: Record<string, any>): void {
  try {
    const analytics = getAnalytics();
    setUserProperties(analytics, properties);
  } catch (e) {
    console.error('Failed to set user properties:', e);
  }
}

/**
 * Track time on page
 */
export function trackTimeOnPage(pageName: string): () => void {
  const startTime = Date.now();
  
  return () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
    
    try {
      const analytics = getAnalytics();
      
      logEvent(analytics, 'time_on_page', {
        page_name: pageName,
        time_spent: timeSpent,
        page: window.location.pathname
      });
    } catch (e) {
      console.error('Failed to track time on page:', e);
    }
  };
}

/**
 * Track scroll depth
 */
export function initScrollTracking(): void {
  let maxScroll = 0;
  let tracked25 = false;
  let tracked50 = false;
  let tracked75 = false;
  let tracked100 = false;

  const trackScroll = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    if (scrollPercentage > maxScroll) {
      maxScroll = scrollPercentage;

      const analytics = getAnalytics();

      if (scrollPercentage >= 25 && !tracked25) {
        tracked25 = true;
        logEvent(analytics, 'scroll_depth', {
          depth: 25,
          page: window.location.pathname
        });
      }

      if (scrollPercentage >= 50 && !tracked50) {
        tracked50 = true;
        logEvent(analytics, 'scroll_depth', {
          depth: 50,
          page: window.location.pathname
        });
      }

      if (scrollPercentage >= 75 && !tracked75) {
        tracked75 = true;
        logEvent(analytics, 'scroll_depth', {
          depth: 75,
          page: window.location.pathname
        });
      }

      if (scrollPercentage >= 100 && !tracked100) {
        tracked100 = true;
        logEvent(analytics, 'scroll_depth', {
          depth: 100,
          page: window.location.pathname
        });
      }
    }
  };

  window.addEventListener('scroll', trackScroll, { passive: true });
}
