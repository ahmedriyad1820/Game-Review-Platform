'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authToken = sessionStorage.getItem('adminAuth')
    
    if (authToken) {
      // Verify the token is valid
      const [username, password] = atob(authToken).split(':')
      if (username === 'dracula' && password === '1234') {
        setIsAuthenticated(true)
      } else {
        // Invalid token, remove it
        sessionStorage.removeItem('adminAuth')
        router.push('/admin/login')
      }
    } else {
      // No token, redirect to login
      router.push('/admin/login')
    }
    
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
