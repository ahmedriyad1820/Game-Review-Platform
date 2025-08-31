'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthWrapper from '@/components/admin/AuthWrapper'
import { 
  Gamepad2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Star
} from 'lucide-react'

interface Game {
  id: string
  title: string
  slug: string
  descriptionMd?: string
  releaseDate?: string
  developer?: string
  publisher?: string
  genres: string[]
  platforms: string[]
  coverUrl?: string
  criticScore?: number
  createdAt: string
  _count: {
    reviews: number
  }
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)

  const [newGame, setNewGame] = useState({
    title: '',
    slug: '',
    descriptionMd: '',
    releaseDate: '',
    developer: '',
    publisher: '',
    genres: [] as string[],
    platforms: [] as string[],
    coverUrl: '',
    criticScore: '',
  })

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/admin/games')
      const data = await response.json()
      setGames(data)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGame,
          criticScore: newGame.criticScore ? parseFloat(newGame.criticScore) : null,
          genres: newGame.genres.filter(g => g.trim()),
          platforms: newGame.platforms.filter(p => p.trim()),
        }),
      })

      if (response.ok) {
        setShowAddForm(false)
        setNewGame({
          title: '', slug: '', descriptionMd: '', releaseDate: '', developer: '',
          publisher: '', genres: [], platforms: [], coverUrl: '', criticScore: '',
        })
        fetchGames()
      }
    } catch (error) {
      console.error('Error adding game:', error)
    }
  }

  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGame) return

    try {
      const response = await fetch(`/api/admin/games/${editingGame.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGame,
          criticScore: newGame.criticScore ? parseFloat(newGame.criticScore) : null,
          genres: newGame.genres.filter(g => g.trim()),
          platforms: newGame.platforms.filter(p => p.trim()),
        }),
      })

      if (response.ok) {
        setEditingGame(null)
        setNewGame({
          title: '', slug: '', descriptionMd: '', releaseDate: '', developer: '',
          publisher: '', genres: [], platforms: [], coverUrl: '', criticScore: '',
        })
        fetchGames()
      }
    } catch (error) {
      console.error('Error updating game:', error)
    }
  }

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchGames()
      }
    } catch (error) {
      console.error('Error deleting game:', error)
    }
  }

  const startEdit = (game: Game) => {
    setEditingGame(game)
    setNewGame({
      title: game.title,
      slug: game.slug,
      descriptionMd: game.descriptionMd || '',
      releaseDate: game.releaseDate ? new Date(game.releaseDate).toISOString().split('T')[0] : '',
      developer: game.developer || '',
      publisher: game.publisher || '',
      genres: [...game.genres],
      platforms: [...game.platforms],
      coverUrl: game.coverUrl || '',
      criticScore: game.criticScore?.toString() || '',
    })
  }

  const addGenre = () => {
    setNewGame(prev => ({ ...prev, genres: [...prev.genres, ''] }))
  }

  const removeGenre = (index: number) => {
    setNewGame(prev => ({ ...prev, genres: prev.genres.filter((_, i) => i !== index) }))
  }

  const updateGenre = (index: number, value: string) => {
    setNewGame(prev => ({
      ...prev,
      genres: prev.genres.map((g, i) => i === index ? value : g)
    }))
  }

  const addPlatform = () => {
    setNewGame(prev => ({ ...prev, platforms: [...prev.platforms, ''] }))
  }

  const removePlatform = (index: number) => {
    setNewGame(prev => ({ ...prev, platforms: prev.platforms.filter((_, i) => i !== index) }))
  }

  const updatePlatform = (index: number, value: string) => {
    setNewGame(prev => ({
      ...prev,
      platforms: prev.platforms.map((p, i) => i === index ? value : p)
    }))
  }

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.developer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.publisher?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = !selectedGenre || game.genres.includes(selectedGenre)
    return matchesSearch && matchesGenre
  })

  const allGenres = Array.from(new Set(games.flatMap(g => g.genres)))

  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading games...</p>
          </div>
        </div>
      </AuthWrapper>
    )
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manage Games</h1>
              <p className="text-muted-foreground">
                Add, edit, and delete games in your platform
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Game</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search games by title, developer, or publisher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Genres</option>
              {allGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Add/Edit Game Form */}
          {(showAddForm || editingGame) && (
            <div className="bg-background border rounded-lg p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {editingGame ? 'Edit Game' : 'Add New Game'}
              </h3>
              <form onSubmit={editingGame ? handleUpdateGame : handleAddGame} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={newGame.title}
                      onChange={(e) => setNewGame(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Slug *</label>
                    <input
                      type="text"
                      required
                      value={newGame.slug}
                      onChange={(e) => setNewGame(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Developer</label>
                    <input
                      type="text"
                      value={newGame.developer}
                      onChange={(e) => setNewGame(prev => ({ ...prev, developer: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Publisher</label>
                    <input
                      type="text"
                      value={newGame.publisher}
                      onChange={(e) => setNewGame(prev => ({ ...prev, publisher: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Release Date</label>
                    <input
                      type="date"
                      value={newGame.releaseDate}
                      onChange={(e) => setNewGame(prev => ({ ...prev, releaseDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Critic Score</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={newGame.criticScore}
                      onChange={(e) => setNewGame(prev => ({ ...prev, criticScore: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Cover URL</label>
                    <input
                      type="url"
                      value={newGame.coverUrl}
                      onChange={(e) => setNewGame(prev => ({ ...prev, coverUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={newGame.descriptionMd}
                    onChange={(e) => setNewGame(prev => ({ ...prev, descriptionMd: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Genres */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Genres</label>
                  <div className="space-y-2">
                    {newGame.genres.map((genre, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={genre}
                          onChange={(e) => updateGenre(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Genre name"
                        />
                        <button
                          type="button"
                          onClick={() => removeGenre(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addGenre}
                      className="text-sm text-primary hover:underline"
                    >
                      + Add Genre
                    </button>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Platforms</label>
                  <div className="space-y-2">
                    {newGame.platforms.map((platform, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={platform}
                          onChange={(e) => updatePlatform(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Platform name"
                        />
                        <button
                          type="button"
                          onClick={() => removePlatform(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPlatform}
                      className="text-sm text-primary hover:underline"
                    >
                      + Add Platform
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {editingGame ? 'Update Game' : 'Add Game'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingGame(null)
                      setNewGame({
                        title: '', slug: '', descriptionMd: '', releaseDate: '', developer: '',
                        publisher: '', genres: [], platforms: [], coverUrl: '', criticScore: '',
                      })
                    }}
                    className="px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Games List */}
          <div className="bg-background border rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Game
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Developer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Genres
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Reviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredGames.map((game) => (
                    <tr key={game.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            {game.coverUrl ? (
                              <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Gamepad2 className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{game.title}</div>
                            <div className="text-sm text-muted-foreground">{game.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {game.developer || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {game.genres.slice(0, 2).map((genre) => (
                            <span key={genre} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                              {genre}
                            </span>
                          ))}
                          {game.genres.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                              +{game.genres.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{game._count.reviews}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(game.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/games/${game.slug}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => startEdit(game)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No games found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  )
}
