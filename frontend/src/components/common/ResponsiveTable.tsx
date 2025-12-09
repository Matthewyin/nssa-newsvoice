import React, { useState, useEffect, useRef } from 'react';

/**
 * ResponsiveTable Component
 * Task 16.3: 优化表格的移动端显示
 * 
 * Features:
 * - Horizontal scroll with visual indicators on mobile
 * - Optional card view for mobile devices
 * - Sticky first column
 * - Scroll hint for users
 * 
 * Requirements: 需求 11
 */

export interface ResponsiveTableColumn {
  key: string;
  label: string;
  mobileLabel?: string; // Shorter label for mobile card view
  render?: (value: any, row: any) => React.ReactNode;
  hideOnMobile?: boolean;
}

export interface ResponsiveTableProps {
  columns: ResponsiveTableColumn[];
  data: any[];
  keyExtractor: (row: any, index: number) => string;
  enableCardView?: boolean; // Enable card view toggle on mobile
  className?: string;
  emptyMessage?: string;
  actions?: (row: any) => React.ReactNode;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  keyExtractor,
  enableCardView = false,
  className = '',
  emptyMessage = '暂无数据',
  actions,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [showScrollHint, setShowScrollHint] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Check if table is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (tableContainerRef.current) {
        const { scrollWidth, clientWidth } = tableContainerRef.current;
        setShowScrollHint(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [data]);

  // Filter columns for mobile
  const visibleColumns = columns.filter(col => !col.hideOnMobile || viewMode === 'table');

  // Render table view
  const renderTableView = () => (
    <div className="table-container" ref={tableContainerRef}>
      <div className="table-wrapper">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyExtractor(row, index)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="table-actions flex justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showScrollHint && (
        <div className="table-scroll-hint">
          滑动查看更多
        </div>
      )}
    </div>
  );

  // Render card view (mobile)
  const renderCardView = () => (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          {emptyMessage}
        </div>
      ) : (
        data.map((row, index) => (
          <div key={keyExtractor(row, index)} className="table-card">
            {visibleColumns.map((column) => (
              <div key={column.key} className="table-card__row">
                <div className="table-card__label">
                  {column.mobileLabel || column.label}
                </div>
                <div className="table-card__value">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </div>
              </div>
            ))}
            {actions && (
              <div className="table-card__actions">
                {actions(row)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* View toggle (mobile only) */}
      {enableCardView && (
        <div className="table-view-toggle md:hidden">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'active' : ''}
            aria-label="表格视图"
          >
            <span className="material-symbols-outlined text-base">table_chart</span>
            表格
          </button>
          <button
            type="button"
            onClick={() => setViewMode('card')}
            className={viewMode === 'card' ? 'active' : ''}
            aria-label="卡片视图"
          >
            <span className="material-symbols-outlined text-base">view_agenda</span>
            卡片
          </button>
        </div>
      )}

      {/* Render appropriate view */}
      {enableCardView && viewMode === 'card' ? (
        <div className="md:hidden">{renderCardView()}</div>
      ) : null}
      
      <div className={enableCardView && viewMode === 'card' ? 'hidden md:block' : ''}>
        {renderTableView()}
      </div>
    </div>
  );
};

export default ResponsiveTable;
