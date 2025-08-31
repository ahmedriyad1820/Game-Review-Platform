'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
  placeholder?: string
  defaultValue?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ 
  className, 
  placeholder = "Search games, reviews, users...",
  defaultValue = "",
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  return (
    <form onSubmit={handleSearch} className={cn('relative w-full', className)}>
      <div className={cn(
        'relative flex items-center w-full',
        'bg-background border border-input rounded-md',
        'focus-within:ring-2 focus-within:ring-primary focus-within:border-primary',
        'transition-all duration-200',
        isFocused && 'ring-2 ring-primary border-primary'
      )}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-2 text-sm',
            'bg-transparent border-none outline-none',
            'placeholder:text-muted-foreground',
            'focus:ring-0 focus:outline-none'
          )}
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Button
        type="submit"
        size="sm"
        className="sr-only"
        disabled={!query.trim()}
      >
        Search
      </Button>
    </form>
  )
}
