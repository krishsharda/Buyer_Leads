'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-full w-full"></div>
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className = '' }: LoadingCardProps) {
  return (
    <div className={`dashboard-card rounded-lg p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full loading-shimmer"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 loading-shimmer rounded w-3/4"></div>
            <div className="h-3 loading-shimmer rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 loading-shimmer rounded w-full"></div>
          <div className="h-3 loading-shimmer rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  className?: string;
}

export function LoadingTable({ rows = 5, className = '' }: LoadingTableProps) {
  return (
    <div className={`data-table ${className}`}>
      <div className="table-header p-4">
        <div className="flex space-x-4">
          <div className="h-4 loading-shimmer rounded w-32"></div>
          <div className="h-4 loading-shimmer rounded w-24"></div>
          <div className="h-4 loading-shimmer rounded w-28"></div>
          <div className="h-4 loading-shimmer rounded w-20"></div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full loading-shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 loading-shimmer rounded w-48"></div>
                <div className="h-3 loading-shimmer rounded w-32"></div>
              </div>
              <div className="h-6 loading-shimmer rounded w-20"></div>
              <div className="h-8 loading-shimmer rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}