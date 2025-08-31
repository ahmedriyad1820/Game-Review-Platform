'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './Button'
import { Shield, Settings } from 'lucide-react'

export function FloatingAdminButton() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.roles?.includes('ADMIN')

  if (!isAdmin) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col space-y-2">
        {/* Quick Admin Access */}
        <Link href="/admin">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Shield className="mr-2 h-5 w-5" />
            Admin Panel
          </Button>
        </Link>
        
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Link href="/admin/games">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/10 hover:border-primary/50"
            >
              Games
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/10 hover:border-primary/50"
            >
              Users
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
