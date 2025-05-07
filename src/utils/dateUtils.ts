/**
 * Date utility functions for formatting dates consistently across the application
 */

/**
 * Format a date to a localized string
 * @param date - The date to format
 * @param locale - The locale to use (defaults to 'zh-TW')
 * @returns Formatted date string
 */
export function formatDate(date: Date, locale: string = 'zh-TW'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 * @param date - The date to format
 * @param locale - The locale to use (defaults to 'zh-TW')
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date, locale: string = 'zh-TW'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  // Localized labels
  const labels: Record<string, Record<string, string>> = {
    'zh-TW': {
      year: '年前',
      month: '個月前',
      week: '週前',
      day: '天前',
      hour: '小時前',
      minute: '分鐘前',
      justNow: '剛剛'
    },
    'en-US': {
      year: 'year ago',
      years: 'years ago',
      month: 'month ago',
      months: 'months ago',
      week: 'week ago',
      weeks: 'weeks ago',
      day: 'day ago',
      days: 'days ago',
      hour: 'hour ago',
      hours: 'hours ago',
      minute: 'minute ago',
      minutes: 'minutes ago',
      justNow: 'just now'
    }
  };
  
  // Default to zh-TW if locale not found
  const localizedLabels = labels[locale] || labels['zh-TW'];
  
  // Calculate relative time
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    
    if (interval >= 1) {
      // For English, handle plural forms
      if (locale === 'en-US') {
        const key = interval === 1 ? unit : `${unit}s`;
        return `${interval} ${localizedLabels[key] || ''}`;
      }
      
      // For other languages
      return `${interval}${localizedLabels[unit]}`;
    }
  }
  
  return localizedLabels.justNow;
}

/**
 * Format a date to ISO string for datetime attributes
 * @param date - The date to format
 * @returns ISO date string
 */
export function formatISODate(date: Date): string {
  return date.toISOString();
}

/**
 * Format a date for URL slugs (YYYY-MM-DD)
 * @param date - The date to format
 * @returns Date formatted as YYYY-MM-DD
 */
export function formatDateForSlug(date: Date): string {
  return date.toISOString().split('T')[0];
}
