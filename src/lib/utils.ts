import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CATEGORY_COLORS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatFileSize(kb?: number): string {
  if (!kb) return '0 KB';
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function getCategoryStyle(category?: string) {
  if (!category) return CATEGORY_COLORS.default;
  const key = category.toLowerCase();
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.default;
}

export function getGitHubUrl(repoUrl: string, filePath?: string): string {
  if (!repoUrl) return '#';
  const cleanUrl = repoUrl.replace(/\.git$/, '');
  if (!filePath) return cleanUrl;
  return `${cleanUrl}/blob/main/${filePath.replace(/^\//, '')}`;
}
