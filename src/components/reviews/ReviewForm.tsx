'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Plus, X, Save, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ReviewFormProps {
  gameId: string
  gameTitle: string
  onCancel: () => void
  onSuccess?: () => void
  initialData?: {
    rating: number
    bodyMd: string
    pros: string[]
    cons: string[]
    playtimeHours: number
    containsSpoilers: boolean
  }
  isEditing?: boolean
}

export function ReviewForm({ 
  gameId, 
  gameTitle, 
  onCancel, 
  onSuccess, 
  initialData,
  isEditing = false 
}: ReviewFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 0,
    bodyMd: initialData?.bodyMd || '',
    pros: initialData?.pros || [''],
    cons: initialData?.cons || [''],
    playtimeHours: initialData?.playtimeHours || 0,
    containsSpoilers: initialData?.containsSpoilers || false
  })

  const [hoveredRating, setHoveredRating] = useState(0)

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
    setErrors(prev => ({ ...prev, rating: '' }))
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addPro = () => {
    setFormData(prev => ({ ...prev, pros: [...prev.pros, ''] }))
  }

  const removePro = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      pros: prev.pros.filter((_, i) => i !== index) 
    }))
  }

  const updatePro = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      pros: prev.pros.map((pro, i) => i === index ? value : pro)
    }))
  }

  const addCon = () => {
    setFormData(prev => ({ ...prev, cons: [...prev.cons, ''] }))
  }

  const removeCon = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      cons: prev.cons.filter((_, i) => i !== index) 
    }))
  }

  const updateCon = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      cons: prev.cons.map((con, i) => i === index ? value : con)
    }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }

    if (!formData.bodyMd.trim()) {
      newErrors.bodyMd = 'Review content is required'
    }

    if (formData.bodyMd.trim().length < 50) {
      newErrors.bodyMd = 'Review must be at least 50 characters long'
    }

    if (formData.pros.filter(p => p.trim()).length === 0) {
      newErrors.pros = 'Please add at least one pro'
    }

    if (formData.cons.filter(c => c.trim()).length === 0) {
      newErrors.cons = 'Please add at least one con'
    }

    if (formData.playtimeHours < 0) {
      newErrors.playtimeHours = 'Playtime cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const endpoint = isEditing 
        ? `/api/reviews/${gameId}` 
        : '/api/reviews'
      
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameId,
          ...formData,
          pros: formData.pros.filter(p => p.trim()),
          cons: formData.cons.filter(c => c.trim())
        })
      })

      if (response.ok) {
        const result = await response.json()
        onSuccess?.()
        router.push(`/reviews/${result.id}`)
      } else {
        const error = await response.json()
        setErrors(error.errors || { general: 'Failed to save review' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred while saving the review' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background border rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isEditing ? 'Edit Review' : 'Write a Review'}
        </h2>
        <p className="text-muted-foreground">
          {isEditing ? 'Update your review for' : 'Share your thoughts on'} <span className="font-semibold text-foreground">{gameTitle}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Rating *
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                className="relative p-1 group"
              >
                <Star
                  className={cn(
                    'h-8 w-8 transition-colors',
                    (hoveredRating >= rating || formData.rating >= rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground hover:text-yellow-400'
                  )}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {rating}
                </span>
              </button>
            ))}
            <span className="ml-3 text-sm text-muted-foreground">
              {formData.rating > 0 ? `${formData.rating}/10` : 'Select rating'}
            </span>
          </div>
          {errors.rating && (
            <p className="text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Review Content */}
        <div className="space-y-3">
          <label htmlFor="bodyMd" className="text-sm font-medium text-foreground">
            Review Content *
          </label>
          <textarea
            id="bodyMd"
            rows={8}
            value={formData.bodyMd}
            onChange={(e) => handleInputChange('bodyMd', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Share your detailed thoughts about the game. What did you like? What could be improved? Include specific examples and your overall experience..."
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimum 50 characters</span>
            <span>{formData.bodyMd.length}/2000</span>
          </div>
          {errors.bodyMd && (
            <p className="text-sm text-red-600">{errors.bodyMd}</p>
          )}
        </div>

        {/* Pros */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Pros *
          </label>
          <div className="space-y-2">
            {formData.pros.map((pro, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => updatePro(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="e.g., Great story, smooth gameplay"
                />
                {formData.pros.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePro(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPro}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Pro</span>
            </Button>
          </div>
          {errors.pros && (
            <p className="text-sm text-red-600">{errors.pros}</p>
          )}
        </div>

        {/* Cons */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Cons *
          </label>
          <div className="space-y-2">
            {formData.cons.map((con, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => updateCon(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="e.g., Performance issues, repetitive content"
                />
                {formData.cons.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCon(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCon}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Con</span>
            </Button>
          </div>
          {errors.cons && (
            <p className="text-sm text-red-600">{errors.cons}</p>
          )}
        </div>

        {/* Additional Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Playtime */}
          <div className="space-y-3">
            <label htmlFor="playtimeHours" className="text-sm font-medium text-foreground">
              Playtime (hours)
            </label>
            <input
              id="playtimeHours"
              type="number"
              min="0"
              step="0.5"
              value={formData.playtimeHours}
              onChange={(e) => handleInputChange('playtimeHours', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="0"
            />
            {errors.playtimeHours && (
              <p className="text-sm text-red-600">{errors.playtimeHours}</p>
            )}
          </div>

          {/* Spoiler Warning */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Content Warning
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="containsSpoilers"
                type="checkbox"
                checked={formData.containsSpoilers}
                onChange={(e) => handleInputChange('containsSpoilers', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="containsSpoilers" className="text-sm text-foreground">
                Contains spoilers
              </label>
            </div>
          </div>
        </div>

        {/* General Errors */}
        {errors.general && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Saving...' : (isEditing ? 'Update Review' : 'Publish Review')}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
