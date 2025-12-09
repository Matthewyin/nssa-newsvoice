/**
 * MobileMenuButton Component
 * 移动端汉堡菜单按钮
 * 
 * Features:
 * - Hamburger icon animation
 * - Accessible button with proper ARIA labels
 * 
 * Requirements: 需求 11, 需求 14
 */

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center justify-center rounded-lg p-2
        text-slate-700 transition-colors duration-200
        hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800
        focus:outline-none focus:ring-2 focus:ring-primary/50
      "
      aria-label={isOpen ? '关闭菜单' : '打开菜单'}
      aria-expanded={isOpen}
      aria-controls="mobile-sidebar"
    >
      <span className="material-symbols-outlined text-2xl">
        {isOpen ? 'close' : 'menu'}
      </span>
    </button>
  );
}

export default MobileMenuButton;
