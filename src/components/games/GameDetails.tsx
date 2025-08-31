'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface GameDetailsProps {
  game: {
    descriptionMd?: string
    systemRequirements?: any
    esrbRating?: string
    metacriticUrl?: string
    criticScore?: number
    trailerUrl?: string
    screenshots?: string[]
  }
}

export function GameDetails({ game }: GameDetailsProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [showRequirements, setShowRequirements] = useState(false)

  return (
    <div className="space-y-6">
      {/* Description */}
      {game.descriptionMd && (
        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4">About This Game</h2>
          <div className="prose prose-gray max-w-none">
            {showDescription ? (
              <div>
                <div 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: game.descriptionMd.replace(/\n/g, '<br/>') 
                  }} 
                />
                <Button
                  variant="outline"
                  onClick={() => setShowDescription(false)}
                  className="mt-4"
                >
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </Button>
              </div>
            ) : (
              <div>
                <div 
                  className="text-muted-foreground leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ 
                    __html: game.descriptionMd.substring(0, 300).replace(/\n/g, '<br/>') + 
                           (game.descriptionMd.length > 300 ? '...' : '') 
                  }} 
                />
                {game.descriptionMd.length > 300 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowDescription(true)}
                    className="mt-4"
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Read More
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Requirements */}
      {game.systemRequirements && (
        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Minimum Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Minimum</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {game.systemRequirements.minimum?.os && (
                  <div><strong>OS:</strong> {game.systemRequirements.minimum.os}</div>
                )}
                {game.systemRequirements.minimum?.processor && (
                  <div><strong>Processor:</strong> {game.systemRequirements.minimum.processor}</div>
                )}
                {game.systemRequirements.minimum?.memory && (
                  <div><strong>Memory:</strong> {game.systemRequirements.minimum.memory}</div>
                )}
                {game.systemRequirements.minimum?.graphics && (
                  <div><strong>Graphics:</strong> {game.systemRequirements.minimum.graphics}</div>
                )}
                {game.systemRequirements.minimum?.storage && (
                  <div><strong>Storage:</strong> {game.systemRequirements.minimum.storage}</div>
                )}
              </div>
            </div>

            {/* Recommended Requirements */}
            {game.systemRequirements.recommended && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Recommended</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {game.systemRequirements.recommended.os && (
                    <div><strong>OS:</strong> {game.systemRequirements.recommended.os}</div>
                  )}
                  {game.systemRequirements.recommended.processor && (
                    <div><strong>Processor:</strong> {game.systemRequirements.recommended.processor}</div>
                  )}
                  {game.systemRequirements.recommended.memory && (
                    <div><strong>Memory:</strong> {game.systemRequirements.recommended.memory}</div>
                  )}
                  {game.systemRequirements.recommended.graphics && (
                    <div><strong>Graphics:</strong> {game.systemRequirements.recommended.graphics}</div>
                  )}
                  {game.systemRequirements.recommended.storage && (
                    <div><strong>Storage:</strong> {game.systemRequirements.recommended.storage}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-background border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ESRB Rating */}
          {game.esrbRating && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">ESRB Rating:</span>
              <span className="px-2 py-1 text-xs bg-muted text-foreground rounded">
                {game.esrbRating}
              </span>
            </div>
          )}

          {/* Metacritic Score */}
          {game.criticScore && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Metacritic:</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{game.criticScore}</span>
              </div>
            </div>
          )}

          {/* Metacritic Link */}
          {game.metacriticUrl && (
            <div>
              <a
                href={game.metacriticUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span className="text-sm">View on Metacritic</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Trailer */}
          {game.trailerUrl && (
            <div>
              <a
                href={game.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span className="text-sm">Watch Trailer</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Screenshots */}
      {game.screenshots && game.screenshots.length > 0 && (
        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {game.screenshots.map((screenshot, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={screenshot}
                  alt={`${index + 1} screenshot`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
