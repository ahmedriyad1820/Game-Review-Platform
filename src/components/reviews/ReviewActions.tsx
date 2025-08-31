'use client'

import { useState } from 'react'
import { Edit, Trash2, MoreVertical, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ReviewActionsProps {
  review: {
    id: string
    userId: string
    gameId: string
    game: {
      title: string
      slug: string
    }
  }
  onEdit: () => void
  onDelete: () => void
  className?: string
}

export function ReviewActions({ review, onEdit, onDelete, className }: ReviewActionsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if user can edit/delete this review
  const canModify = session && (
    session.user.id === review.userId || 
    session.user.roles.includes('ADMIN')
  )

  if (!canModify) {
    return null
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onDelete()
        router.push(`/games/${review.game.slug}`)
      } else {
        const error = await response.json()
        alert(`Failed to delete review: ${error.error}`)
      }
    } catch (error) {
      alert('An error occurred while deleting the review')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Actions Menu */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMenu(!showMenu)}
          className="h-8 w-8 p-0"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  setShowMenu(false)
                  onEdit()
                }}
                className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Review</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenu(false)
                  setShowDeleteConfirm(true)
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Review</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-foreground">
                Delete Review
              </h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete your review for <span className="font-semibold text-foreground">{review.game.title}</span>? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Review'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}
