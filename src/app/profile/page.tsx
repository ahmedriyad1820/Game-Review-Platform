'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Gamepad2, Star, Calendar, Users, Settings, PenSquare } from 'lucide-react'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import Link from 'next/link'

interface UserProfile {
  id: string
  username: string
  email: string
  bio: string | null
  avatarUrl: string | null
  createdAt: string
  lastLogin: string | null
  roles: string[]
  isVerified: boolean
  _count: {
    reviews: number
    followers: number
    following: number
  }
}

interface UserReview {
  id: string
  rating: number
  title: string
  excerpt: string
  pros: string[]
  cons: string[]
  playtimeHours: number
  upvotesCount: number
  commentCount: number
  createdAt: string
  game: {
    title: string
    slug: string
    coverUrl?: string
  }
  user: {
    id: string
    username: string
    avatarUrl?: string
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [reviews, setReviews] = useState<UserReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'reviews' | 'lists' | 'activity'>('reviews')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    // Fetch user profile data and reviews
    const fetchProfileData = async () => {
      try {
        const [profileResponse, reviewsResponse] = await Promise.all([
          fetch(`/api/users/${session.user.id}`),
          fetch(`/api/reviews?userId=${session.user.id}`)
        ])
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfile(profileData)
        }
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData.reviews || [])
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [session, status, router])

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
  }

  const handleReviewDelete = () => {
    // Refresh reviews after deletion
    if (session) {
      fetch(`/api/reviews?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setReviews(data.reviews || []))
        .catch(console.error)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatarUrl || ''} alt={profile?.username || ''} />
              <AvatarFallback className="text-2xl">
                {profile?.username?.charAt(0) || session.user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {profile?.username || session.user?.username}
                </h1>
                {profile?.isVerified && (
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Verified
                  </div>
                )}
                {profile?.roles?.includes('ADMIN') && (
                  <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Admin
                  </div>
                )}
              </div>
              
              {profile?.bio && (
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                {profile?.lastLogin && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Last login {new Date(profile.lastLogin).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {profile?._count?.reviews || 0}
            </h3>
            <p className="text-muted-foreground">Reviews Written</p>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mx-auto mb-4">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {profile?._count?.followers || 0}
            </h3>
            <p className="text-muted-foreground">Followers</p>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mx-auto mb-4">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {profile?._count?.following || 0}
            </h3>
            <p className="text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-card rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button 
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'reviews' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
              <button 
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'lists' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('lists')}
              >
                Lists
              </button>
              <button 
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'activity' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('activity')}
              >
                Activity
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onEdit={() => {
                          // Handle edit - redirect to edit page
                          window.location.href = `/reviews/${review.id}/edit`
                        }}
                        onDelete={handleReviewDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start reviewing games to build your profile and help other gamers discover great titles.
                    </p>
                    <Link href="/games">
                      <Button>
                        <PenSquare className="h-4 w-4 mr-2" />
                        Write Your First Review
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'lists' && (
              <div className="text-center py-12">
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Lists feature coming soon</h3>
                <p className="text-muted-foreground">
                  Create and share your game lists with the community.
                </p>
              </div>
            )}
            
            {activeTab === 'activity' && (
              <div className="text-center py-12">
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Activity feed coming soon</h3>
                <p className="text-muted-foreground">
                  Track your gaming activity and see what your friends are playing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {profile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}
