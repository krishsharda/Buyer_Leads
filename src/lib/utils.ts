import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatBudgetRange(min?: number, max?: number): string {
  if (!min && !max) return 'Not specified';
  if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  if (min) return `${formatCurrency(min)}+`;
  if (max) return `Up to ${formatCurrency(max)}`;
  return 'Not specified';
}

export function formatPhone(phone: string): string {
  // Format Indian phone numbers
  if (phone.length === 10) {
    return phone.replace(/(\d{5})(\d{5})/, '$1-$2');
  }
  if (phone.length === 12 && phone.startsWith('91')) {
    return phone.replace(/(\d{2})(\d{5})(\d{5})/, '+$1-$2-$3');
  }
  return phone;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function formatRelativeTime(date: Date | number | null | undefined): string {
  if (!date) return 'Unknown';
  
  const now = new Date();
  let targetDate: Date;
  
  if (typeof date === 'number') {
    // Handle both Unix timestamp (seconds) and JavaScript timestamp (milliseconds)
    targetDate = new Date(date > 1000000000000 ? date : date * 1000);
  } else if (date instanceof Date) {
    targetDate = date;
  } else {
    return 'Invalid date';
  }
  
  // Validate that targetDate is a valid Date object
  if (isNaN(targetDate.getTime())) {
    return 'Invalid date';
  }
  
  const diff = now.getTime() - targetDate.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  
  return targetDate.toLocaleDateString();
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseURLSearchParams(searchParams: URLSearchParams) {
  const params: Record<string, string | string[]> = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (key in params) {
      const existing = params[key];
      params[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      params[key] = value;
    }
  }
  
  return params;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Contacted': 'bg-yellow-100 text-yellow-800',
    'Visited': 'bg-purple-100 text-purple-800',
    'Negotiation': 'bg-orange-100 text-orange-800',
    'Converted': 'bg-emerald-100 text-emerald-800',
    'Dropped': 'bg-red-100 text-red-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(timeline: string): string {
  const colors: Record<string, string> = {
    '0-3m': 'bg-red-100 text-red-800',
    '3-6m': 'bg-yellow-100 text-yellow-800',
    '>6m': 'bg-green-100 text-green-800',
    'Exploring': 'bg-gray-100 text-gray-800',
  };
  
  return colors[timeline] || 'bg-gray-100 text-gray-800';
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone);
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}