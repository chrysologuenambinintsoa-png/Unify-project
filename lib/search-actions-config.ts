/**
 * Configuration for Search Actions Feature
 * Configuration centralisée pour les fonctionnalités de recherche
 */

// API Configuration
export const API_CONFIG = {
  // Timeouts
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Search
  MIN_SEARCH_LENGTH: 2,
  SEARCH_DEBOUNCE: 300,
  MAX_SEARCH_RESULTS: 50,

  // Rate Limiting
  RATE_LIMIT_ENABLED: true,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 60,

  // Endpoints
  ENDPOINTS: {
    SEARCH: '/api/search',
    MESSAGE_SEND: '/api/messages/send',
    FRIEND_ADD: '/api/friends/add',
    PAGE_FOLLOW: '/api/pages/follow',
    GROUP_JOIN: '/api/groups/join',
  },
};

// UI Configuration
export const UI_CONFIG = {
  // Search Bar
  SEARCH_PLACEHOLDER: 'Rechercher des personnes, groupes, pages...',
  SEARCH_MIN_CHARS: 2,
  SHOW_RECENT_SEARCHES: true,
  MAX_RECENT_SEARCHES: 10,

  // Results Display
  RESULTS_PER_TAB: 10,
  SHOW_RESULT_AVATARS: true,
  SHOW_VERIFICATION_BADGES: true,
  SHOW_MEMBER_COUNT: true,

  // Actions
  SHOW_ACTION_BUTTONS: true,
  ACTION_BUTTON_SIZE: 'sm', // 'sm', 'md', 'lg'
  ACTION_BUTTON_VARIANT: 'primary', // 'primary', 'secondary', 'danger'

  // Loading
  SHOW_LOADING_SKELETON: true,
  LOADING_ANIMATION: 'pulse', // 'pulse', 'shimmer', 'bounce'

  // Notifications
  SHOW_SUCCESS_TOAST: true,
  SHOW_ERROR_TOAST: true,
  TOAST_DURATION: 3000,
  TOAST_POSITION: 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
};

// Feature Flags
export const FEATURE_FLAGS = {
  // Search Features
  ENABLE_SEARCH: true,
  ENABLE_ADVANCED_SEARCH: false,
  ENABLE_SEARCH_FILTERS: true,
  ENABLE_SEARCH_HISTORY: true,

  // Action Features
  ENABLE_DIRECT_MESSAGE: true,
  ENABLE_FRIEND_REQUEST: true,
  ENABLE_PAGE_FOLLOW: true,
  ENABLE_GROUP_JOIN: true,

  // UI Features
  ENABLE_SEARCH_SUGGESTIONS: false,
  ENABLE_QUICK_PREVIEW: false,
  ENABLE_BATCH_ACTIONS: false,

  // Advanced Features
  ENABLE_NOTIFICATIONS: true,
  ENABLE_REAL_TIME_UPDATES: false,
  ENABLE_ANALYTICS: false,
  ENABLE_OFFLINE_MODE: false,
};

// Message Configuration
export const MESSAGE_CONFIG = {
  MAX_LENGTH: 5000,
  MIN_LENGTH: 1,
  ALLOW_EMPTY_CONTENT: false,
  ALLOW_MEDIA: true,
  ALLOWED_MEDIA_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  MAX_FILE_SIZE: 10485760, // 10MB
};

// Friend Request Configuration
export const FRIEND_CONFIG = {
  // Status Management
  ALLOW_FRIEND_REJECTION: true,
  ALLOW_BLOCKING: true,
  AUTO_ACCEPT_FRIENDS: false,
  MUTUAL_FRIEND_THRESHOLD: 3,

  // Notifications
  NOTIFY_ON_REQUEST: true,
  NOTIFY_ON_ACCEPTANCE: true,
  NOTIFY_ON_REJECTION: false,
};

// Page Configuration
export const PAGE_CONFIG = {
  // Following
  ALLOW_UNFOLLOW: true,
  ALLOW_NOTIFICATIONS: true,
  ALLOW_MUTING: false,

  // Membership
  DEFAULT_MEMBER_ROLE: 'member', // 'member', 'moderator', 'admin'
  AUTO_ACCEPT_FOLLOWERS: true,

  // Notifications
  NOTIFY_ON_FOLLOW: true,
  NOTIFY_ON_POST: false,
};

// Group Configuration
export const GROUP_CONFIG = {
  // Membership
  ALLOW_JOIN_PUBLIC: true,
  ALLOW_LEAVE: true,
  AUTO_ACCEPT_MEMBERS: true, // Pour groupes publics
  MIN_MEMBERS_TO_PROMOTE: 5,

  // Moderation
  ENABLE_MODERATION: true,
  ALLOW_KICK_MEMBERS: true,
  ALLOW_BAN_MEMBERS: true,

  // Permissions
  DEFAULT_MEMBER_ROLE: 'member', // 'member', 'moderator', 'admin'
  ALLOW_ADMIN_TRANSFER: true,

  // Notifications
  NOTIFY_ON_JOIN: true,
  NOTIFY_ON_LEAVE: false,
  NOTIFY_ADMIN_ON_JOIN: true,
};

// Error Handling Configuration
export const ERROR_CONFIG = {
  // Display
  SHOW_ERROR_DETAILS: false, // Ne pas montrer les détails en production
  SHOW_ERROR_CODE: true,
  SHOW_ERROR_STACK: false,

  // Retry
  AUTO_RETRY_ENABLED: true,
  AUTO_RETRY_COUNT: 3,
  AUTO_RETRY_DELAY: 1000,

  // Logging
  LOG_ERRORS: true,
  LOG_TO_CONSOLE: true,
  LOG_TO_SERVER: false,
  LOG_LEVEL: 'error', // 'debug', 'info', 'warn', 'error'
};

// Cache Configuration
export const CACHE_CONFIG = {
  ENABLED: true,
  STRATEGY: 'memory', // 'memory', 'localStorage', 'sessionStorage', 'redis'

  // TTL (Time To Live)
  SEARCH_CACHE_TTL: 300000, // 5 minutes
  USER_CACHE_TTL: 600000, // 10 minutes
  GROUP_CACHE_TTL: 600000, // 10 minutes
  PAGE_CACHE_TTL: 600000, // 10 minutes

  // Size Limits
  MAX_SEARCH_CACHE_SIZE: 100,
  MAX_USER_CACHE_SIZE: 500,
  MAX_GROUP_CACHE_SIZE: 100,
  MAX_PAGE_CACHE_SIZE: 100,
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  ENABLED: false,
  TRACK_SEARCHES: true,
  TRACK_ACTIONS: true,
  TRACK_ERRORS: true,
  TRACK_PERFORMANCE: true,

  // Events
  EVENTS: {
    SEARCH_PERFORMED: 'search_performed',
    MESSAGE_SENT: 'message_sent',
    FRIEND_REQUEST_SENT: 'friend_request_sent',
    PAGE_FOLLOWED: 'page_followed',
    GROUP_JOINED: 'group_joined',
  },
};

// Security Configuration
export const SECURITY_CONFIG = {
  // CORS
  CORS_ENABLED: true,
  CORS_ORIGINS: ['http://localhost:3000', 'https://unify.app'],

  // Rate Limiting
  RATE_LIMIT_ENABLED: true,
  RATE_LIMIT_WINDOW: 60000,
  RATE_LIMIT_MAX: 100,

  // Content Security
  SANITIZE_INPUT: true,
  ALLOW_HTML: false,
  ALLOW_SCRIPTS: false,

  // Authentication
  REQUIRE_SESSION: true,
  SESSION_TIMEOUT: 3600000, // 1 hour

  // Validation
  VALIDATE_EMAIL: true,
  VALIDATE_PHONE: false,
  REQUIRE_EMAIL_VERIFICATION: false,
};

// Validation Rules
export const VALIDATION_RULES = {
  // Username
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  USERNAME_PATTERN: /^[a-zA-Z0-9_-]+$/,

  // Email
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Full Name
  FULLNAME_MIN_LENGTH: 2,
  FULLNAME_MAX_LENGTH: 100,

  // Bio
  BIO_MAX_LENGTH: 500,

  // Message
  MESSAGE_MIN_LENGTH: 1,
  MESSAGE_MAX_LENGTH: 5000,

  // Group/Page Name
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,

  // Description
  DESCRIPTION_MIN_LENGTH: 0,
  DESCRIPTION_MAX_LENGTH: 5000,
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  ENABLED: true,
  TYPES: {
    FRIEND_REQUEST: 'friend_request',
    MESSAGE_RECEIVED: 'message_received',
    PAGE_POST: 'page_post',
    GROUP_POST: 'group_post',
    GROUP_MEMBER_JOINED: 'group_member_joined',
  },

  // Display
  SHOW_TOAST: true,
  SHOW_BADGE: true,
  SHOW_SOUND: false,

  // Persistence
  SAVE_TO_DB: true,
  MARK_READ_ON_VIEW: true,

  // Sound
  SOUND_ENABLED: false,
  SOUND_FILE: '/sounds/notification.mp3',

  // Desktop Notifications
  ENABLE_DESKTOP: true,
  DESKTOP_ICON: '/icons/notification.png',
};

// Development Configuration
export const DEV_CONFIG = {
  // Debug
  DEBUG_ENABLED: process.env.NODE_ENV === 'development',
  DEBUG_API_CALLS: true,
  DEBUG_STORAGE: true,
  DEBUG_PERFORMANCE: true,

  // Mock Data
  USE_MOCK_DATA: false,
  MOCK_DELAY: 500,

  // Logging
  LOG_LEVEL: 'info',
  LOG_TO_CONSOLE: true,

  // Performance
  PROFILE_PERFORMANCE: false,
  MEASURE_PAINT_TIMING: false,
};

// Export Configuration Object
export const SEARCH_ACTIONS_CONFIG = {
  API: API_CONFIG,
  UI: UI_CONFIG,
  FEATURES: FEATURE_FLAGS,
  MESSAGE: MESSAGE_CONFIG,
  FRIEND: FRIEND_CONFIG,
  PAGE: PAGE_CONFIG,
  GROUP: GROUP_CONFIG,
  ERROR: ERROR_CONFIG,
  CACHE: CACHE_CONFIG,
  ANALYTICS: ANALYTICS_CONFIG,
  SECURITY: SECURITY_CONFIG,
  VALIDATION: VALIDATION_RULES,
  NOTIFICATION: NOTIFICATION_CONFIG,
  DEV: DEV_CONFIG,
};

// Helper Functions
export const getApiEndpoint = (key: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return API_CONFIG.ENDPOINTS[key];
};

export const isFeatureEnabled = (featurePath: string): boolean => {
  const keys = featurePath.split('.');
  let value: any = FEATURE_FLAGS;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return false;
  }

  return Boolean(value);
};

export const getConfig = (path: string): any => {
  const keys = path.split('.');
  let value: any = SEARCH_ACTIONS_CONFIG;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return null;
  }

  return value;
};

export default SEARCH_ACTIONS_CONFIG;
