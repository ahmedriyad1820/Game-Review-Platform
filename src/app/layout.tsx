import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextAuthProvider } from '@/components/providers/NextAuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'GameReview - Discover, Review, and Track Your Games',
    template: '%s | GameReview'
  },
  description: 'A community-driven platform where players can discover games, read and write reviews, and track what they\'re playing. Find your next favorite game with trusted reviews from the community.',
  keywords: ['games', 'reviews', 'gaming', 'community', 'game reviews', 'game ratings', 'gaming platform'],
  authors: [{ name: 'GameReview Team' }],
  creator: 'GameReview',
  publisher: 'GameReview',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://gamereview.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gamereview.com',
    title: 'GameReview - Discover, Review, and Track Your Games',
    description: 'A community-driven platform where players can discover games, read and write reviews, and track what they\'re playing.',
    siteName: 'GameReview',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GameReview - Game Review Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameReview - Discover, Review, and Track Your Games',
    description: 'A community-driven platform where players can discover games, read and write reviews, and track what they\'re playing.',
    images: ['/og-image.jpg'],
    creator: '@gamereview',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider>
            <QueryProvider>
              <div className="min-h-screen bg-background">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </QueryProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
