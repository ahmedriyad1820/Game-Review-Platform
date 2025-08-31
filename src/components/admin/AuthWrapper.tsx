'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const authToken = sessionStorage.getItem('adminAuth')
    
    if (authToken) {
      // Verify the token is valid
      const [username, password] = atob(authToken).split(':')
      if (username === 'dracula' && password === '1234') {
        setIsAuthenticated(true)
        setShowLogin(false)
      } else {
        // Invalid token, clear it and show login
        sessionStorage.removeItem('adminAuth')
        setIsAuthenticated(false)
        setShowLogin(true)
      }
    } else {
      // No token, show login
      setIsAuthenticated(false)
      setShowLogin(true)
    }
    
    setIsLoading(false)
  }, [])

  // Monitor pathname changes to detect when leaving admin area
  useEffect(() => {
    if (!pathname.startsWith('/admin')) {
      // User left admin area, log them out
      sessionStorage.removeItem('adminAuth')
      setIsAuthenticated(false)
      setShowLogin(true)
      router.push('/admin/login')
    }
  }, [pathname, router])

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        // Store credentials in sessionStorage
        const token = btoa(`${username}:${password}`)
        sessionStorage.setItem('adminAuth', token)
        setIsAuthenticated(true)
        setShowLogin(false)
      } else {
        alert('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    setShowLogin(true)
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (showLogin || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-full max-w-md">
          <div className="bg-background rounded-lg border shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-8 w-8 text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
              <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
            </div>
            
            <LoginForm onLogin={handleLogin} />
            
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Admin Header with Logout */}
      <div className="bg-background border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-5 w-5 text-primary">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
          </svg>
          <span className="font-semibold text-foreground">Admin Panel</span>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out mr-2 h-4 w-4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16,17 21,12 16,7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
      
      {/* Admin Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

// Separate LoginForm component
function LoginForm({ onLogin }: { onLogin: (username: string, password: string) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      alert('Please enter both username and password')
      return
    }
    
    setIsLoading(true)
    await onLogin(username, password)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter username"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter password"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Authenticating...
          </>
        ) : (
          'Login'
        )}
      </button>
    </form>
  )
}
