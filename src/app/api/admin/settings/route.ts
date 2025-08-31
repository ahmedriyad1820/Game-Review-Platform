import { NextRequest, NextResponse } from 'next/server'

// Default platform settings
const defaultSettings = {
  moderation: {
    autoModerateReviews: false,
    requireReviewApproval: true,
    maxReviewsPerUser: 100,
    maxCommentsPerReview: 50,
    profanityFilter: true,
    spamProtection: true,
  },
  content: {
    allowUserGeneratedGames: false,
    allowUserGeneratedLists: true,
    maxGamesPerList: 100,
    allowImageUploads: true,
    maxImageSize: 5,
    allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
  user: {
    allowUserRegistration: true,
    requireEmailVerification: true,
    allowOAuthLogin: true,
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    allowProfileCustomization: true,
  },
  system: {
    maintenanceMode: false,
    allowGuestAccess: true,
    enableRateLimiting: true,
    maxRequestsPerMinute: 100,
    enableCaching: true,
    cacheTimeout: 3600,
  },
}

// In a real application, you would store these in a database
// For now, we'll use a simple in-memory store
let currentSettings = { ...defaultSettings }

// GET /api/admin/settings - Get current platform settings
export async function GET() {
  try {
    return NextResponse.json(currentSettings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update platform settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the settings structure
    const requiredCategories = ['moderation', 'content', 'user', 'system']
    for (const category of requiredCategories) {
      if (!body[category] || typeof body[category] !== 'object') {
        return NextResponse.json(
          { error: `Invalid settings structure: missing or invalid ${category} category` },
          { status: 400 }
        )
      }
    }

    // Update settings with validation
    currentSettings = {
      moderation: {
        autoModerateReviews: Boolean(body.moderation.autoModerateReviews),
        requireReviewApproval: Boolean(body.moderation.requireReviewApproval),
        maxReviewsPerUser: Math.max(1, Math.min(1000, parseInt(body.moderation.maxReviewsPerUser) || 100)),
        maxCommentsPerReview: Math.max(1, Math.min(500, parseInt(body.moderation.maxCommentsPerReview) || 50)),
        profanityFilter: Boolean(body.moderation.profanityFilter),
        spamProtection: Boolean(body.moderation.spamProtection),
      },
      content: {
        allowUserGeneratedGames: Boolean(body.content.allowUserGeneratedGames),
        allowUserGeneratedLists: Boolean(body.content.allowUserGeneratedLists),
        maxGamesPerList: Math.max(1, Math.min(1000, parseInt(body.content.maxGamesPerList) || 100)),
        allowImageUploads: Boolean(body.content.allowImageUploads),
        maxImageSize: Math.max(1, Math.min(50, parseInt(body.content.maxImageSize) || 5)),
        allowedImageTypes: Array.isArray(body.content.allowedImageTypes) 
          ? body.content.allowedImageTypes.filter((type: string) => typeof type === 'string')
          : defaultSettings.content.allowedImageTypes,
      },
      user: {
        allowUserRegistration: Boolean(body.user.allowUserRegistration),
        requireEmailVerification: Boolean(body.user.requireEmailVerification),
        allowOAuthLogin: Boolean(body.user.allowOAuthLogin),
        maxLoginAttempts: Math.max(1, Math.min(20, parseInt(body.user.maxLoginAttempts) || 5)),
        sessionTimeout: Math.max(1, Math.min(168, parseInt(body.user.sessionTimeout) || 24)),
        allowProfileCustomization: Boolean(body.user.allowProfileCustomization),
      },
      system: {
        maintenanceMode: Boolean(body.system.maintenanceMode),
        allowGuestAccess: Boolean(body.system.allowGuestAccess),
        enableRateLimiting: Boolean(body.system.enableRateLimiting),
        maxRequestsPerMinute: Math.max(10, Math.min(1000, parseInt(body.system.maxRequestsPerMinute) || 100)),
        enableCaching: Boolean(body.system.enableCaching),
        cacheTimeout: Math.max(60, Math.min(86400, parseInt(body.system.cacheTimeout) || 3600)),
      },
    }

    // In a real application, you would save these to a database
    // await prisma.platformSettings.upsert({ ... })

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: currentSettings,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
