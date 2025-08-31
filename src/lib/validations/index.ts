import { z } from 'zod'

// User validation schemas
export const userRegistrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const userProfileUpdateSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
})

// Game validation schemas
export const gameCreateSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  descriptionMd: z.string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional(),
  releaseDate: z.string().datetime().optional(),
  developer: z.string()
    .max(100, 'Developer must be less than 100 characters')
    .optional(),
  publisher: z.string()
    .max(100, 'Publisher must be less than 100 characters')
    .optional(),
  genres: z.array(z.string())
    .min(1, 'At least one genre is required')
    .max(10, 'Maximum 10 genres allowed'),
  tags: z.array(z.string())
    .max(20, 'Maximum 20 tags allowed'),
  platforms: z.array(z.string())
    .min(1, 'At least one platform is required')
    .max(10, 'Maximum 10 platforms allowed'),
  coverUrl: z.string().url('Invalid URL').optional(),
  screenshots: z.array(z.string().url('Invalid URL')).optional(),
  trailerUrl: z.string().url('Invalid URL').optional(),
  systemRequirements: z.object({
    minimum: z.object({
      os: z.string(),
      processor: z.string(),
      memory: z.string(),
      graphics: z.string(),
      storage: z.string(),
    }).optional(),
    recommended: z.object({
      os: z.string(),
      processor: z.string(),
      memory: z.string(),
      graphics: z.string(),
      storage: z.string(),
    }).optional(),
  }).optional(),
  esrbRating: z.string().optional(),
  metacriticUrl: z.string().url('Invalid URL').optional(),
  criticScore: z.number()
    .min(0, 'Score must be at least 0')
    .max(100, 'Score must be at most 100')
    .optional(),
})

export const gameUpdateSchema = gameCreateSchema.partial()

// Review validation schemas
export const reviewCreateSchema = z.object({
  rating: z.number()
    .min(0, 'Rating must be at least 0')
    .max(10, 'Rating must be at most 10')
    .multipleOf(0.5, 'Rating must be in 0.5 increments'),
  bodyMd: z.string()
    .min(10, 'Review must be at least 10 characters')
    .max(10000, 'Review must be less than 10000 characters'),
  pros: z.array(z.string())
    .min(1, 'At least one pro is required')
    .max(10, 'Maximum 10 pros allowed'),
  cons: z.array(z.string())
    .min(1, 'At least one con is required')
    .max(10, 'Maximum 10 cons allowed'),
  playtimeHours: z.number()
    .min(0, 'Playtime must be at least 0 hours')
    .max(10000, 'Playtime must be less than 10000 hours')
    .optional(),
  containsSpoilers: z.boolean().default(false),
})

export const reviewUpdateSchema = reviewCreateSchema.partial()

// Comment validation schemas
export const commentCreateSchema = z.object({
  bodyMd: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
})

// Vote validation schemas
export const voteCreateSchema = z.object({
  targetType: z.enum(['REVIEW', 'COMMENT']),
  targetId: z.string().min(1, 'Target ID is required'),
  value: z.number().refine(val => val === 1 || val === -1, 'Vote value must be 1 or -1'),
})

// List validation schemas
export const listCreateSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC', 'UNLISTED']).default('PRIVATE'),
})

export const listUpdateSchema = listCreateSchema.partial()

// Report validation schemas
export const reportCreateSchema = z.object({
  targetType: z.enum(['REVIEW', 'COMMENT', 'USER']),
  targetId: z.string().min(1, 'Target ID is required'),
  reason: z.string()
    .min(1, 'Reason is required')
    .max(200, 'Reason must be less than 200 characters'),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
})

// Search and filter schemas
export const gameFiltersSchema = z.object({
  search: z.string().optional(),
  genres: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  releaseYear: z.number()
    .min(1950, 'Release year must be at least 1950')
    .max(new Date().getFullYear() + 5, 'Release year cannot be more than 5 years in the future')
    .optional(),
  minRating: z.number()
    .min(0, 'Minimum rating must be at least 0')
    .max(10, 'Minimum rating must be at most 10')
    .optional(),
  maxRating: z.number()
    .min(0, 'Maximum rating must be at least 0')
    .max(10, 'Maximum rating must be at most 10')
    .optional(),
  sortBy: z.enum(['rating', 'popularity', 'releaseDate', 'title']).default('popularity'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').default(20),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').default(20),
  cursor: z.string().optional(),
})

// Admin schemas
export const adminUserUpdateSchema = z.object({
  roles: z.array(z.enum(['USER', 'VERIFIED', 'MODERATOR', 'ADMIN'])),
  isVerified: z.boolean().optional(),
  isBanned: z.boolean().optional(),
})

export const adminGameUpdateSchema = gameUpdateSchema

export const adminReportResolveSchema = z.object({
  status: z.enum(['RESOLVED', 'DISMISSED']),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
})

// Export all schemas
export const schemas = {
  user: {
    registration: userRegistrationSchema,
    login: userLoginSchema,
    profileUpdate: userProfileUpdateSchema,
  },
  game: {
    create: gameCreateSchema,
    update: gameUpdateSchema,
  },
  review: {
    create: reviewCreateSchema,
    update: reviewUpdateSchema,
  },
  comment: {
    create: commentCreateSchema,
  },
  vote: {
    create: voteCreateSchema,
  },
  list: {
    create: listCreateSchema,
    update: listUpdateSchema,
  },
  report: {
    create: reportCreateSchema,
  },
  filters: {
    game: gameFiltersSchema,
  },
  pagination: paginationSchema,
  admin: {
    userUpdate: adminUserUpdateSchema,
    gameUpdate: adminGameUpdateSchema,
    reportResolve: adminReportResolveSchema,
  },
}
