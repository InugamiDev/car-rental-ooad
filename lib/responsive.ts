/**
 * Responsive utility functions and constants for consistent mobile-first design
 */

// Breakpoint constants (matching Tailwind config)
export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Common responsive patterns
export const responsivePatterns = {
  // Grid patterns
  grid: {
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    twoCol: 'grid grid-cols-1 sm:grid-cols-2',
    threeCol: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    fourCol: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    cardsGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  },
  
  // Spacing patterns
  spacing: {
    section: 'py-12 lg:py-20',
    sectionSm: 'py-8 lg:py-12',
    sectionLg: 'py-16 lg:py-28',
    container: 'px-4 sm:px-6 lg:px-8',
    gap: 'gap-4 lg:gap-6',
    gapLarge: 'gap-6 lg:gap-8',
  },
  
  // Typography patterns
  text: {
    hero: 'text-3xl sm:text-4xl lg:text-6xl',
    heading: 'text-2xl sm:text-3xl lg:text-4xl',
    subheading: 'text-xl sm:text-2xl lg:text-3xl',
    body: 'text-base sm:text-lg',
    caption: 'text-sm sm:text-base',
  },
  
  // Layout patterns
  layout: {
    flexResponsive: 'flex flex-col sm:flex-row',
    flexCenter: 'flex flex-col sm:flex-row items-center justify-center',
    spaceBetween: 'flex flex-col sm:flex-row sm:justify-between sm:items-center',
  },
  
  // Component patterns
  card: {
    base: 'rounded-lg lg:rounded-xl p-4 lg:p-6',
    featured: 'rounded-xl lg:rounded-2xl p-6 lg:p-8',
    compact: 'rounded-lg p-3 lg:p-4',
  },
  
  // Button patterns
  button: {
    responsive: 'w-full sm:w-auto',
    group: 'flex flex-col sm:flex-row gap-3 lg:gap-4',
  },
} as const;

// Responsive helper functions
export const getResponsiveClasses = (pattern: keyof typeof responsivePatterns) => {
  return responsivePatterns[pattern];
};

// Mobile detection utilities
export const isMobileViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

export const isTabletViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
};

export const isDesktopViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
};

// Touch device detection
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Safe area utilities for mobile devices
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };
  
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
  };
};

// Viewport height utilities for mobile browsers
export const getViewportHeight = () => {
  if (typeof window === 'undefined') return 0;
  return window.innerHeight;
};

export const getDocumentHeight = () => {
  if (typeof document === 'undefined') return 0;
  return Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
};

// Responsive image utilities
export const getResponsiveImageSizes = () => {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};

// Animation preferences
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Color scheme detection
export const prefersDarkMode = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// High contrast mode detection
export const prefersHighContrast = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};