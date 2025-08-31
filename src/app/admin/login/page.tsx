'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin page where AuthWrapper will handle authentication
    router.push('/admin')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to admin panel...</p>
      </div>
    </div>
  )
}
