import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes without conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate approximate driving distance between two locations
 * Uses a simplified algorithm - in a real app, you'd use a mapping API
 */
export function calculateDistance(from: string, to: string): number {
  // In a real app, you would:
  // 1. Use a geocoding API to convert addresses to coordinates
  // 2. Use a routing API to get actual driving distance
  
  // For demo purposes, we'll generate a reasonable distance based on string comparison
  // This is just for simulation - NOT for real distance calculation!
  const similarity = calculateLocationSimilarity(from, to);
  
  // Generate a distance between 10 and 200 km based on location similarity
  const baseDistance = 10 + (1 - similarity) * 190;
  
  // Add some randomness to make it more realistic
  const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
  
  return Math.round(baseDistance * randomFactor);
}

/**
 * Calculate a similarity score between two locations
 * This is a simplified demonstration - not for real use!
 */
function calculateLocationSimilarity(loc1: string, loc2: string): number {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const s1 = normalize(loc1);
  const s2 = normalize(loc2);
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  // Count matching characters
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }
  
  return matches / longer.length;
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Format a date in a consistent way
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  const diffInSeconds = Math.floor((d.getTime() - now.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (Math.abs(diffInDays) > 0) {
    return rtf.format(diffInDays, 'day');
  }
  if (Math.abs(diffInHours) > 0) {
    return rtf.format(diffInHours, 'hour');
  }
  if (Math.abs(diffInMinutes) > 0) {
    return rtf.format(diffInMinutes, 'minute');
  }
  return rtf.format(diffInSeconds, 'second');
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
