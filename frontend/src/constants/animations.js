/**
 * Centralized animation configuration for consistent feel across pages
 */
export const ANIMATION_CONFIG = {
  // Easing curve used throughout the app
  EASING: 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Standard animation durations
  DURATION: {
    NORMAL: '0.8s',
    SLOW: '1s',
    LINK: '0.6s ease', // for buttons and links
  },

  // Stagger delay calculations for different contexts
  STAGGER: {
    // Featured products on home page
    FEATURED: (i) => i * 120 + 200,
    // Feature blocks on home page
    FEATURES: (i) => i * 100 + 200,
    // Grid items on shop page
    GRID: (i) => Math.min(i * 80, 600),
  },
};
