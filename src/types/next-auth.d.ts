import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      roles: string[]
      isVerified: boolean
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    username: string
    roles: string[]
    isVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    roles: string[]
    isVerified: boolean
  }
}
