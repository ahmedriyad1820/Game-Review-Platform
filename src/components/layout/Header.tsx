'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, Menu, X, Sun, Moon, Monitor, User, LogOut, Settings, Gamepad2 } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { SearchBar } from '@/components/ui/SearchBar'

export function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Games', href: '/games' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Lists', href: '/lists' },
    { name: 'Community', href: '/community' },
  ]

  // Add admin link only for admin users
  if (session?.user?.roles?.includes('ADMIN')) {
    navigation.push({ name: 'Admin', href: '/admin' })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">GameReview</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right side - Theme toggle, user menu, mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <Link href="/profile">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.username || ''} />
                      <AvatarFallback>
                        {session.user?.username?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  
                  {/* Desktop User Menu */}
                  <div className="hidden md:flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">
                      {session.user?.username || session.user?.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile User Menu */}
            {session ? (
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.username || ''} />
                    <AvatarFallback>
                      {session.user?.username?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {session.user?.username || session.user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                </div>
                
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex w-full items-center space-x-3 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="border-t pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
