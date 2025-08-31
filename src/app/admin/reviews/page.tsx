'use client'

import { useState, useEffect } from 'react'
import { 
  Star, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  User,
  Gamepad2
} from 'lucide-react'

interface Review {
  id: string
  rating: number
  bodyMd: string
  pros: string[]
  cons: string[]
  playtimeHours?: number
  containsSpoilers: boolean
  upvotesCount: number
  downvotesCount: number
  status: string
  createdAt: string
  user: {
    username: string
    avatarUrl?: string
  }
  game: {
    title: string
    coverUrl?: string
    slug: string
  }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [selectedGame, setSelectedGame] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews')
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Error updating review status:', error)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.bodyMd.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.game.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || review.status === selectedStatus
    const matchesRating = !selectedRating || review.rating === parseInt(selectedRating)
    const matchesGame = !selectedGame || review.game.title === selectedGame
    return matchesSearch && matchesStatus && matchesRating && matchesGame
  })

  const allGames = Array.from(new Set(reviews.map(r => r.game.title)))
  const allStatuses = Array.from(new Set(reviews.map(r => r.status)))

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Reviews</h1>
          <p className="text-muted-foreground">
            Moderate and manage game reviews across the platform
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews by content, username, or game..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Status</option>
            {allStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Ratings</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
              <option key={rating} value={rating}>{rating}/10</option>
            ))}
          </select>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Games</option>
            {allGames.map(game => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-background border rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    {review.user.avatarUrl ? (
                      <img src={review.user.avatarUrl} alt={review.user.username} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{review.user.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-foreground">{review.rating}/10</span>
                  </div>
                  {review.containsSpoilers && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Spoilers
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    review.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    review.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    review.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    {review.game.coverUrl ? (
                      <img src={review.game.coverUrl} alt={review.game.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">{review.game.title}</span>
                </div>
                <div className="text-sm text-foreground leading-relaxed">
                  {review.bodyMd.length > 300 
                    ? `${review.bodyMd.substring(0, 300)}...` 
                    : review.bodyMd
                  }
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {review.pros.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Pros</h4>
                    <ul className="space-y-1">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-green-600 flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Cons</h4>
                    <ul className="space-y-1">
                      {review.cons.map((con, index) => (
                        <li key={index} className="text-sm text-red-600 flex items-center space-x-2">
                          <XCircle className="h-3 w-3" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {review.playtimeHours && (
                    <span>Playtime: {review.playtimeHours}h</span>
                  )}
                  <span>Votes: +{review.upvotesCount} / -{review.downvotesCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatusChange(review.id, 'APPROVED')}
                    disabled={review.status === 'APPROVED'}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      review.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(review.id, 'REJECTED')}
                    disabled={review.status === 'REJECTED'}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      review.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800 cursor-not-allowed'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
