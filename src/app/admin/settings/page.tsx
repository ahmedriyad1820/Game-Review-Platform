'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Shield, 
  Users, 
  Gamepad2, 
  Star, 
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  List
} from 'lucide-react'

interface PlatformSettings {
  moderation: {
    autoModerateReviews: boolean
    requireReviewApproval: boolean
    maxReviewsPerUser: number
    maxCommentsPerReview: number
    profanityFilter: boolean
    spamProtection: boolean
  }
  content: {
    allowUserGeneratedGames: boolean
    allowUserGeneratedLists: boolean
    maxGamesPerList: number
    allowImageUploads: boolean
    maxImageSize: number
    allowedImageTypes: string[]
  }
  user: {
    allowUserRegistration: boolean
    requireEmailVerification: boolean
    allowOAuthLogin: boolean
    maxLoginAttempts: number
    sessionTimeout: number
    allowProfileCustomization: boolean
  }
  system: {
    maintenanceMode: boolean
    allowGuestAccess: boolean
    enableRateLimiting: boolean
    maxRequestsPerMinute: number
    enableCaching: boolean
    cacheTimeout: number
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
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
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (category: keyof PlatformSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const updateArraySetting = (category: keyof PlatformSettings, key: string, value: string, add: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: add 
          ? [...(prev[category] as any)[key], value]
          : (prev[category] as any)[key].filter((item: string) => item !== value),
      },
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Platform Settings</h1>
            <p className="text-muted-foreground">
              Configure platform behavior, moderation rules, and system preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Settings saved successfully!</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Moderation Settings */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-foreground">Moderation Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.moderation.autoModerateReviews}
                    onChange={(e) => updateSetting('moderation', 'autoModerateReviews', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Auto-moderate reviews</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.moderation.requireReviewApproval}
                    onChange={(e) => updateSetting('moderation', 'requireReviewApproval', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Require review approval</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.moderation.profanityFilter}
                    onChange={(e) => updateSetting('moderation', 'profanityFilter', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Enable profanity filter</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.moderation.spamProtection}
                    onChange={(e) => updateSetting('moderation', 'spamProtection', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Enable spam protection</span>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max reviews per user
                  </label>
                  <input
                    type="number"
                    value={settings.moderation.maxReviewsPerUser}
                    onChange={(e) => updateSetting('moderation', 'maxReviewsPerUser', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max comments per review
                  </label>
                  <input
                    type="number"
                    value={settings.moderation.maxCommentsPerReview}
                    onChange={(e) => updateSetting('moderation', 'maxCommentsPerReview', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Settings */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Gamepad2 className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-foreground">Content Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.content.allowUserGeneratedGames}
                    onChange={(e) => updateSetting('content', 'allowUserGeneratedGames', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Allow user-generated games</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.content.allowUserGeneratedLists}
                    onChange={(e) => updateSetting('content', 'allowUserGeneratedLists', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Allow user-generated lists</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.content.allowImageUploads}
                    onChange={(e) => updateSetting('content', 'allowImageUploads', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Allow image uploads</span>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max games per list
                  </label>
                  <input
                    type="number"
                    value={settings.content.maxGamesPerList}
                    onChange={(e) => updateSetting('content', 'maxGamesPerList', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max image size (MB)
                  </label>
                  <input
                    type="number"
                    value={settings.content.maxImageSize}
                    onChange={(e) => updateSetting('content', 'maxImageSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Allowed image types
                  </label>
                  <div className="space-y-2">
                    {['jpg', 'jpeg', 'png', 'gif', 'webp'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.content.allowedImageTypes.includes(type)}
                          onChange={(e) => updateArraySetting('content', 'allowedImageTypes', type, e.target.checked)}
                          className="rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{type.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Settings */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-foreground">User Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.user.allowUserRegistration}
                    onChange={(e) => updateSetting('user', 'allowUserRegistration', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Allow user registration</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.user.requireEmailVerification}
                    onChange={(e) => updateSetting('user', 'requireEmailVerification', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Require email verification</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.user.allowOAuthLogin}
                    onChange={(e) => updateSetting('user', 'allowOAuthLogin', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Allow OAuth login</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.user.allowProfileCustomization}
                    onChange={(e) => updateSetting('user', 'allowProfileCustomization', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Allow profile customization</span>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max login attempts
                  </label>
                  <input
                    type="number"
                    value={settings.user.maxLoginAttempts}
                    onChange={(e) => updateSetting('user', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Session timeout (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.user.sessionTimeout}
                    onChange={(e) => updateSetting('user', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-foreground">System Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => updateSetting('system', 'maintenanceMode', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Maintenance mode</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.system.allowGuestAccess}
                    onChange={(e) => updateSetting('system', 'allowGuestAccess', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Allow guest access</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.system.enableRateLimiting}
                    onChange={(e) => updateSetting('system', 'enableRateLimiting', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Enable rate limiting</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.system.enableCaching}
                    onChange={(e) => updateSetting('system', 'enableCaching', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Enable caching</span>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max requests per minute
                  </label>
                  <input
                    type="number"
                    value={settings.system.maxRequestsPerMinute}
                    onChange={(e) => updateSetting('system', 'maxRequestsPerMinute', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cache timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.system.cacheTimeout}
                    onChange={(e) => updateSetting('system', 'cacheTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
