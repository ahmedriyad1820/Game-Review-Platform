import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials')
        }

        if (user.isBanned) {
          throw new Error('Account has been banned')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          roles: user.roles,
          isVerified: user.isVerified,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.roles = user.roles
        token.isVerified = user.isVerified
      }
      
      if (account?.provider === 'google' || account?.provider === 'github' || account?.provider === 'discord') {
        // Handle OAuth user creation/update
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email! }
        })

        if (!existingUser) {
          // Create new user from OAuth
          const newUser = await prisma.user.create({
            data: {
              email: token.email!,
              username: token.name || `user_${Date.now()}`,
              oauthProvider: account.provider,
              roles: ['USER'],
              isVerified: true,
            }
          })
          
          token.id = newUser.id
          token.username = newUser.username
          token.roles = newUser.roles
          token.isVerified = newUser.isVerified
        } else {
          // Update existing user's OAuth info
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              oauthProvider: account.provider,
              lastLogin: new Date(),
            }
          })
          
          token.id = existingUser.id
          token.username = existingUser.username
          token.roles = existingUser.roles
          token.isVerified = existingUser.isVerified
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.roles = token.roles as string[]
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true
      }

      if (account?.provider === 'google' || account?.provider === 'github' || account?.provider === 'discord') {
        // Check if user is banned
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (existingUser?.isBanned) {
          return false
        }

        return true
      }

      return true
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account }) {
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        })
      }
    },
  },
}

export default authOptions
