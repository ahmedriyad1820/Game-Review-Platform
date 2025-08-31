'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  if (session) {
    router.push('/')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setErrors({ general: 'Invalid email or password' })
      } else {
        // Login successful, redirect to home
        router.push('/')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'An error occurred during login' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">GameReview</h1>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to your account</h2>
          <p className="text-muted-foreground">
            Join the gaming community and start reviewing games
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-input'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-input'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                Sign up here
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-input" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => signIn('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span className="sr-only">Sign in with Google</span>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => signIn('github')}
              className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span className="sr-only">Sign in with GitHub</span>
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
