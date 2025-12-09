import React from 'react';

export interface IconProps {
  /**
   * The name of the Material Symbol icon
   * @example "home", "settings", "search"
   */
  name: string;
  
  /**
   * Size variant of the icon
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Whether the icon should be filled
   * @default false
   */
  filled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Accessible label for the icon
   * Required for icons used as buttons or standalone elements
   */
  ariaLabel?: string;
  
  /**
   * Whether the icon is decorative only (hidden from screen readers)
   * @default false
   */
  decorative?: boolean;
}

/**
 * Icon component using Material Symbols Outlined
 * 
 * @example
 * ```tsx
 * <Icon name="home" size="md" />
 * <Icon name="settings" size="lg" filled />
 * <Icon name="search" ariaLabel="Search" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  filled = false,
  className = '',
  ariaLabel,
  decorative = false,
}) => {
  const sizeClass = `icon-${size}`;
  const filledClass = filled ? 'icon-filled' : '';
  
  const classes = [
    'material-symbols-outlined',
    sizeClass,
    filledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  const ariaProps = decorative
    ? { 'aria-hidden': true as const }
    : ariaLabel
    ? { 'aria-label': ariaLabel, role: 'img' as const }
    : {};
  
  return (
    <span className={classes} {...ariaProps}>
      {name}
    </span>
  );
};

export default Icon;
