import React from 'react';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

export interface SkeletonCardProps {
  variant?: 'briefing' | 'news' | 'config' | 'default';
  count?: number;
  className?: string;
}

/**
 * SkeletonCard Component
 * 卡片骨架屏组件 - 用于不同类型卡片的加载占位符
 * 
 * 需求 14: 加载和错误状态
 * 需求 9: 现代仪表盘设计 - 交互元素
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'default',
  count = 1,
  className = '',
}) => {
  const renderSkeletonContent = () => {
    switch (variant) {
      case 'briefing':
        return (
          <div className="space-y-4">
            <Skeleton variant="text" width="40%" height={28} />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" width={80} height={24} />
              <Skeleton variant="rectangular" width={80} height={24} />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width="100%" height={8} />
            </div>
            <Skeleton variant="rectangular" width={120} height={40} />
          </div>
        );
      
      case 'news':
        return (
          <div className="space-y-4">
            <Skeleton variant="rectangular" width="100%" height={180} />
            <Skeleton variant="text" width="90%" height={24} />
            <Skeleton variant="text" width="70%" height={24} />
            <div className="flex gap-3">
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="text" width={80} height={16} />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
        );
      
      case 'config':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" width="50%" height={24} />
              <Skeleton variant="rectangular" width={80} height={32} />
            </div>
            <div className="space-y-3">
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="rectangular" width="100%" height={40} />
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="rectangular" width="100%" height={40} />
              <Skeleton variant="text" width={100} height={16} />
              <Skeleton variant="rectangular" width="100%" height={80} />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-3">
            <Skeleton variant="text" width="60%" height={24} />
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </div>
          </div>
        );
    }
  };

  const cards = Array.from({ length: count }, (_, index) => (
    <Card key={index} variant="default" className={`space-y-4 ${className}`}>
      {renderSkeletonContent()}
    </Card>
  ));

  return count === 1 ? cards[0] : <>{cards}</>;
};

export default SkeletonCard;
