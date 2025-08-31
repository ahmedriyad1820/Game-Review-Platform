import { Role, ReviewStatus, CommentStatus, VoteTargetType, ListVisibility, ReportStatus, ReportTargetType } from '@prisma/client'

// User types
export interface User {
  id: string
  username: string
  email: string
  avatarUrl?: string
  bio?: string
  roles: Role[]
  isVerified: boolean
  isBanned: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export interface UserProfile extends User {
  _count: {
    reviews: number
    followers: number
    following: number
    lists: number
  }
}

// Game types
export interface Game {
  id: string
  slug: string
  title: string
  descriptionMd?: string
  releaseDate?: Date
  developer?: string
  publisher?: string
  genres: string[]
  tags: string[]
  platforms: string[]
  coverUrl?: string
  screenshots?: string[]
  trailerUrl?: string
  systemRequirements?: SystemRequirements
  esrbRating?: string
  metacriticUrl?: string
  criticScore?: number
  createdAt: Date
  updatedAt: Date
}

export interface GameWithStats extends Game {
  _count: {
    reviews: number
    listItems: number
  }
  averageRating?: number
  totalReviews: number
}

export interface SystemRequirements {
  minimum?: {
    os: string
    processor: string
    memory: string
    graphics: string
    storage: string
  }
  recommended?: {
    os: string
    processor: string
    memory: string
    graphics: string
    storage: string
  }
}

// Review types
export interface Review {
  id: string
  userId: string
  gameId: string
  rating: number
  bodyMd: string
  pros: string[]
  cons: string[]
  playtimeHours?: number
  containsSpoilers: boolean
  upvotesCount: number
  downvotesCount: number
  status: ReviewStatus
  createdAt: Date
  updatedAt: Date
}

export interface ReviewWithUser extends Review {
  user: User
  game: Game
  _count: {
    comments: number
    votes: number
  }
  userVote?: number
}

export interface CreateReviewData {
  rating: number
  bodyMd: string
  pros: string[]
  cons: string[]
  playtimeHours?: number
  containsSpoilers: boolean
}

export interface UpdateReviewData extends Partial<CreateReviewData> {
  id: string
}

// Comment types
export interface Comment {
  id: string
  reviewId: string
  userId: string
  bodyMd: string
  status: CommentStatus
  createdAt: Date
}

export interface CommentWithUser extends Comment {
  user: User
  _count: {
    votes: number
  }
  userVote?: number
}

export interface CreateCommentData {
  bodyMd: string
}

// Vote types
export interface Vote {
  id: string
  userId: string
  targetType: VoteTargetType
  targetId: string
  value: number
  createdAt: Date
}

export interface CreateVoteData {
  targetType: VoteTargetType
  targetId: string
  value: number
}

// List types
export interface List {
  id: string
  userId: string
  title: string
  description?: string
  visibility: ListVisibility
  createdAt: Date
  updatedAt: Date
}

export interface ListWithGames extends List {
  user: User
  items: ListItem[]
  _count: {
    items: number
  }
}

export interface ListItem {
  id: string
  listId: string
  gameId: string
  addedAt: Date
  game: Game
}

export interface CreateListData {
  title: string
  description?: string
  visibility: ListVisibility
}

export interface UpdateListData extends Partial<CreateListData> {
  id: string
}

// Report types
export interface Report {
  id: string
  reporterId: string
  targetType: ReportTargetType
  targetId: string
  reason: string
  notes?: string
  status: ReportStatus
  createdAt: Date
  resolvedBy?: string
  resolvedAt?: Date
}

export interface CreateReportData {
  targetType: ReportTargetType
  targetId: string
  reason: string
  notes?: string
}

// Follow types
export interface Follow {
  followerId: string
  followeeId: string
  createdAt: Date
}

// Search and filtering
export interface GameFilters {
  search?: string
  genres?: string[]
  platforms?: string[]
  tags?: string[]
  releaseYear?: number
  minRating?: number
  maxRating?: number
}

export interface GameSortOptions {
  field: 'rating' | 'popularity' | 'releaseDate' | 'title'
  order: 'asc' | 'desc'
}

export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    hasNext: boolean
    hasPrev: boolean
    nextCursor?: string
    prevCursor?: string
    total: number
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}

// Form validation schemas
export interface ValidationError {
  field: string
  message: string
}

// UI Component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Notification types
export interface Notification {
  id: string
  userId: string
  type: 'review_reply' | 'follow' | 'like' | 'comment' | 'system'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  metadata?: Record<string, any>
}

// Admin types
export interface AdminStats {
  totalUsers: number
  totalGames: number
  totalReviews: number
  pendingReports: number
  activeUsers: number
}

export interface AuditLogEntry {
  id: string
  actorId: string
  action: string
  targetType: string
  targetId: string
  metaJson?: Record<string, any>
  createdAt: Date
  actor: User
}
