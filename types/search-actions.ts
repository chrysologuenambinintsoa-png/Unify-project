/**
 * Type Definitions for Search Actions
 * Types TypeScript pour la recherche et les actions
 */

// Search Results Types
export interface UserSearchResult {
  id: string;
  username: string;
  fullName: string;
  avatar: string | null;
  isVerified: boolean;
  friendshipStatus?: 'none' | 'pending' | 'accepted' | 'rejected' | 'self';
  bio?: string;
}

export interface GroupSearchResult {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  adminId: string;
  isPrivate: boolean;
  isMember?: boolean;
  memberCount?: number;
}

export interface PageSearchResult {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  coverImage: string | null;
  category: string | null;
  isVerified: boolean;
  isFollowing?: boolean;
  memberCount?: number;
}

export interface SearchResults {
  personnes: UserSearchResult[];
  groupes: GroupSearchResult[];
  pages: PageSearchResult[];
}

// Message Types
export interface MessageRequest {
  receiverId: string;
  content: string;
  image?: string;
  document?: string;
  mediaUrl?: string;
  mediaType?: string;
}

export interface MessageResponse {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  image: string | null;
  document: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    fullName: string | null;
    avatar: string | null;
  };
  receiver: {
    id: string;
    username: string;
    fullName: string | null;
    avatar: string | null;
  };
}

// Friend Request Types
export interface AddFriendRequest {
  userId: string;
}

export interface FriendshipResponse {
  id: string;
  user1Id: string;
  user2Id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  createdAt: string;
  user1: {
    id: string;
    username: string;
    fullName: string | null;
    avatar: string | null;
  };
  user2: {
    id: string;
    username: string;
    fullName: string | null;
    avatar: string | null;
  };
}

// Page Follow Types
export interface FollowPageRequest {
  pageId: string;
}

export interface PageMemberResponse {
  id: string;
  pageId: string;
  userId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
  page: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    category: string | null;
  };
  user: {
    id: string;
    username: string;
    fullName: string | null;
    avatar: string | null;
  };
}

// Group Join Types
export interface JoinGroupRequest {
  groupId: string;
}

export interface GroupMemberResponse {
  id: string;
  groupId: string;
  userId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
  group: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    isPrivate: boolean;
  };
  user: {
    id: string;
    username: string;
    fullName: string | null;
    avatar: string | null;
  };
}

// API Response Types
export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  status: 'error';
  error: string;
  code: number;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Action State Types
export interface ActionState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface SearchActionState extends ActionState {
  results: SearchResults;
}

export interface MessageActionState extends ActionState {
  message: MessageResponse | null;
}

export interface FriendActionState extends ActionState {
  friendship: FriendshipResponse | null;
}

export interface PageActionState extends ActionState {
  membership: PageMemberResponse | null;
}

export interface GroupActionState extends ActionState {
  membership: GroupMemberResponse | null;
}

// Combined Hook States
export interface UseSearchActionsState {
  // Search
  search: (query: string, type?: SearchType) => Promise<void>;
  results: SearchResults;
  searchLoading: boolean;
  searchError: string | null;

  // Messages
  sendMessage: (receiverId: string, content: string) => Promise<MessageResponse | null>;
  messageSending: boolean;
  messageError: string | null;

  // Friends
  addFriend: (userId: string) => Promise<FriendshipResponse | null>;
  friendAdding: boolean;
  friendError: string | null;

  // Pages
  followPage: (pageId: string) => Promise<PageMemberResponse | null>;
  unfollowPage: (pageId: string) => Promise<boolean>;
  pageLoading: boolean;
  pageError: string | null;

  // Groups
  joinGroup: (groupId: string) => Promise<GroupMemberResponse | null>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  groupLoading: boolean;
  groupError: string | null;

  // Combined
  isLoading: boolean;
  error: string | null;
}

// Enums and Constants
export type SearchType = 'all' | 'personnes' | 'groupes' | 'pages';
export type FriendshipStatus = 'none' | 'pending' | 'accepted' | 'rejected' | 'self' | 'blocked';
export type UserRole = 'member' | 'moderator' | 'admin';

export const FRIENDSHIP_STATUS = {
  NONE: 'none',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  BLOCKED: 'blocked',
  SELF: 'self',
} as const;

export const USER_ROLES = {
  MEMBER: 'member',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
} as const;

export const SEARCH_TYPES = {
  ALL: 'all',
  PERSONNES: 'personnes',
  GROUPES: 'groupes',
  PAGES: 'pages',
} as const;

// Error Codes
export const API_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
  CONFLICT: 409, // Duplicate entry
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  BAD_REQUEST: 'Invalid request parameters',
  INTERNAL_ERROR: 'An internal server error occurred',
  DUPLICATE: 'This action has already been performed',
  ALREADY_FRIEND: 'You are already friends with this user',
  ALREADY_MEMBER: 'You are already a member of this group',
  ALREADY_FOLLOWING: 'You are already following this page',
  SELF_ACTION: 'You cannot perform this action on yourself',
  PRIVATE_GROUP: 'This is a private group. You need an invitation to join.',
  EMPTY_MESSAGE: 'Message content cannot be empty',
  USER_NOT_FOUND: 'User not found',
  GROUP_NOT_FOUND: 'Group not found',
  PAGE_NOT_FOUND: 'Page not found',
} as const;

// Notification Types
export interface NotificationPayload {
  userId: string;
  type: 'friend_request' | 'group_member_joined' | 'page_followed' | 'message_received';
  senderId: string;
  relatedId: string;
  message: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface SearchFilters {
  query: string;
  type: SearchType;
  sortBy?: 'relevance' | 'date' | 'popularity';
  minMembers?: number;
  maxMembers?: number;
  verified?: boolean;
  category?: string;
}

// Component Props Types
export interface SearchBarEnhancedProps {
  onClose?: () => void;
  onSelectUser?: (user: UserSearchResult) => void;
  onSelectGroup?: (group: GroupSearchResult) => void;
  onSelectPage?: (page: PageSearchResult) => void;
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
}

export interface SearchResultsProps {
  results: SearchResults;
  loading: boolean;
  onSendMessage?: (userId: string) => void;
  onAddFriend?: (userId: string) => void;
  onFollowPage?: (pageId: string) => void;
  onJoinGroup?: (groupId: string) => void;
}

export interface ActionButtonProps {
  actionId: string;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

// Export all types
export default {
  FRIENDSHIP_STATUS,
  USER_ROLES,
  SEARCH_TYPES,
  API_ERROR_CODES,
  ERROR_MESSAGES,
};
