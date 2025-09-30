'use client';

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = false, className = '' }: StatusBadgeProps) {
  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-800 border-blue-200',
      'Qualified': 'bg-green-100 text-green-800 border-green-200',
      'Contacted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Visited': 'bg-purple-100 text-purple-800 border-purple-200',
      'Negotiation': 'bg-orange-100 text-orange-800 border-orange-200',
      'Converted': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Dropped': 'bg-red-100 text-red-800 border-red-200',
    };
    
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDotClass = (status: string) => {
    const classes: Record<string, string> = {
      'New': 'status-dot-new',
      'Qualified': 'status-dot-qualified',
      'Contacted': 'status-dot-contacted',
      'Visited': 'status-dot-visited',
      'Negotiation': 'status-dot-negotiation',
      'Converted': 'status-dot-converted',
      'Dropped': 'status-dot-dropped',
    };
    
    return classes[status] || 'bg-gray-400';
  };

  return (
    <span 
      className={`status-badge ${getStatusStyle(status)} border ${className}`}
    >
      {showDot && <span className={`status-dot ${getDotClass(status)}`}></span>}
      {status}
    </span>
  );
}