import React from 'react';
import { NavLink } from 'react-router-dom';

const categories = [
  { id: 'business', name: '商业财经', icon: '💼' },
  { id: 'technology', name: '科技动态', icon: '💻' },
  { id: 'sports', name: '体育赛事', icon: '⚽' },
  { id: 'security', name: '安全资讯', icon: '🛡️' },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  return (
    <aside className={`w-64 flex-shrink-0 hidden lg:block ${className}`}>
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4 font-sans">
            板块导航
          </h3>
          <nav className="space-y-1">
            {categories.map((category) => (
              <NavLink
                key={category.id}
                to={`/${category.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-sans">{category.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
