/**
 * Accessibility Utilities
 * 
 * Common ARIA patterns and accessibility helpers for the application.
 * 
 * Requirements: 需求 14
 */

/**
 * Generate unique IDs for form elements
 */
let idCounter = 0;
export const generateId = (prefix: string = 'id'): string => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Common ARIA labels for icon buttons
 */
export const ariaLabels = {
  // Navigation
  openMenu: '打开菜单',
  closeMenu: '关闭菜单',
  skipToContent: '跳转到主要内容',
  
  // Theme
  toggleTheme: '切换主题',
  lightMode: '切换到浅色模式',
  darkMode: '切换到深色模式',
  
  // Actions
  edit: '编辑',
  delete: '删除',
  save: '保存',
  cancel: '取消',
  close: '关闭',
  search: '搜索',
  filter: '筛选',
  sort: '排序',
  refresh: '刷新',
  download: '下载',
  upload: '上传',
  
  // Forms
  showPassword: '显示密码',
  hidePassword: '隐藏密码',
  clearInput: '清除输入',
  
  // Pagination
  previousPage: '上一页',
  nextPage: '下一页',
  firstPage: '第一页',
  lastPage: '最后一页',
  
  // Media
  play: '播放',
  pause: '暂停',
  stop: '停止',
  mute: '静音',
  unmute: '取消静音',
  
  // User
  userProfile: '用户资料',
  userAvatar: '用户头像',
  logout: '登出',
  login: '登录',
};

/**
 * Get ARIA label for sort direction
 */
export const getSortAriaLabel = (field: string, direction: 'asc' | 'desc'): string => {
  const directionText = direction === 'asc' ? '升序' : '降序';
  return `按${field}${directionText}排序`;
};

/**
 * Get ARIA label for pagination
 */
export const getPaginationAriaLabel = (current: number, total: number): string => {
  return `第 ${current} 页，共 ${total} 页`;
};

/**
 * Get ARIA label for status badge
 */
export const getStatusAriaLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '活跃',
    inactive: '未激活',
    enabled: '已启用',
    disabled: '已禁用',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    pending: '待处理',
    completed: '已完成',
  };
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Trap focus within an element (for modals, dialogs)
 */
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  firstElement?.focus();
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Check if element is visible to screen readers
 */
export const isVisibleToScreenReader = (element: HTMLElement): boolean => {
  return (
    !element.hasAttribute('aria-hidden') ||
    element.getAttribute('aria-hidden') !== 'true'
  );
};

/**
 * Get accessible name for an element
 */
export const getAccessibleName = (element: HTMLElement): string => {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }
  
  // Check associated label
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent || '';
  }
  
  // Fallback to text content
  return element.textContent || '';
};
