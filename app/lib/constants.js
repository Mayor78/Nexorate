/**
 * Application constants
 */

export const PAGINATION = {
  LISTINGS_PER_PAGE: 20,
  CONVERSATIONS_PER_PAGE: 15,
  COMMENTS_PER_PAGE: 20,
  RELATED_ITEMS: 6,
  SEARCH_RESULTS: 50,
};

export const IMAGES = {
  MAX_PER_LISTING: 5,
  QUALITY: 75,
  THUMBNAIL_WIDTH: 80,
  THUMBNAIL_HEIGHT: 80,
  GALLERY_WIDTH: 500,
  GALLERY_HEIGHT: 500,
};

export const GRID = {
  MOBILE_COLS: 2,
  TABLET_COLS: 3,
  DESKTOP_COLS: 4,
};

export const DEBOUNCE = {
  SEARCH: 300,
  FILTER: 500,
  INPUT: 200,
};

export const CACHE = {
  LISTINGS_TTL: 5 * 60 * 1000, // 5 minutes
  USER_TTL: 10 * 60 * 1000, // 10 minutes
  CONVERSATIONS_TTL: 2 * 60 * 1000, // 2 minutes
};

export const API_TIMEOUTS = {
  SHORT: 5000, // 5s
  MEDIUM: 10000, // 10s
  LONG: 30000, // 30s
};

export const ANIMATION = {
  DURATION_FAST: 150,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
};

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  PROFILE: '/profile',
  PROFILE_ID: '/profile/[id]',
  ONBOARDING: '/onboarding',
  MESSAGES: '/messages',
  MESSAGE_ID: '/messages/[id]',
  POST_LISTING: '/listings/new',
  LISTING_ID: '/listings/[id]',
  CATEGORIES: '/categories',
  CATEGORY_SLUG: '/categories/[slug]',
  SEARCH: '/search',
};

export const CATEGORY_ICONS = {
  electronics: '📱',
  fashion: '👕',
  home: '🏠',
  vehicles: '🚗',
  services: '🔧',
  jobs: '💼',
  personal: '💬',
};

export const TOAST = {
  DURATION: 3000,
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
};
