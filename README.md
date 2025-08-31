# GameReview Platform

A community-driven platform where players can discover games, read and write reviews, and track what they're playing. Built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## 🎮 Features

### Core Features
- **Game Catalog**: Browse thousands of games with detailed information
- **Community Reviews**: Read and write detailed game reviews with ratings
- **User Profiles**: Build your gaming profile and track your collection
- **Lists & Collections**: Create and share game lists (Playing, Completed, Wishlist)
- **Search & Filters**: Find games by title, genre, platform, rating, and more
- **Responsive Design**: Beautiful UI that works on all devices

### Advanced Features
- **OAuth Authentication**: Sign in with Google, GitHub, or Discord
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Real-time Updates**: Live notifications and activity feeds
- **Moderation Tools**: Report system and content moderation
- **Admin Panel**: Comprehensive admin tools for platform management

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation

### Backend
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication solution
- **Redis** - Caching and rate limiting
- **Meilisearch** - Full-text search engine

### Infrastructure
- **Vercel** - Frontend deployment
- **Railway/Fly.io** - Backend hosting
- **Neon/Supabase** - Database hosting
- **S3/Cloudflare R2** - File storage

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── home/             # Homepage components
│   ├── games/            # Game-related components
│   └── reviews/          # Review components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Utility functions
│   └── validations/      # Zod schemas
├── types/                # TypeScript type definitions
└── prisma/               # Database schema and migrations
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Redis (optional, for caching)
- Meilisearch (optional, for search)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd game-review-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/game_review_platform"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   # Add other required variables...
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The platform uses PostgreSQL with the following key tables:

- **Users**: User accounts, profiles, and authentication
- **Games**: Game catalog with metadata
- **Reviews**: User reviews and ratings
- **Comments**: Review comments and discussions
- **Lists**: User game collections
- **Reports**: Content moderation system
- **AuditLogs**: System activity tracking

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `GITHUB_ID` | GitHub OAuth client ID | No |
| `GITHUB_SECRET` | GitHub OAuth client secret | No |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID | No |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret | No |
| `REDIS_URL` | Redis connection string | No |
| `MEILISEARCH_HOST` | Meilisearch host URL | No |
| `S3_ACCESS_KEY` | S3-compatible storage access key | No |
| `S3_SECRET_KEY` | S3-compatible storage secret key | No |

## 🎯 Key Features Implementation

### Authentication System
- Email/password authentication
- OAuth providers (Google, GitHub, Discord)
- JWT-based sessions
- Role-based access control (User, Verified, Moderator, Admin)

### Game Management
- Comprehensive game database
- Cover images and screenshots
- Genre and platform categorization
- System requirements tracking
- Release date and metadata

### Review System
- 0.5 increment rating system (0-10)
- Rich text reviews with markdown support
- Pros and cons lists
- Playtime tracking
- Spoiler warnings
- Upvote/downvote system

### User Experience
- Responsive design for all devices
- Dark/light theme switching
- Accessibility features (WCAG 2.1 AA)
- Performance optimizations
- SEO-friendly structure

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run db:generate  # Generate Prisma client
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
npm run test         # Run tests
npm run test:e2e     # Run end-to-end tests
```

### Code Quality

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Husky** - Git hooks for quality checks

### Testing Strategy

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API route testing
- **E2E Tests**: User journey testing with Playwright
- **Accessibility Tests**: WCAG compliance checking

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Backend (Railway/Fly.io)
1. Set up your preferred backend hosting
2. Configure environment variables
3. Deploy with Docker or native builds

### Database
1. Set up PostgreSQL on your preferred provider
2. Run migrations: `npx prisma migrate deploy`
3. Seed initial data: `npx prisma db seed`

## 📊 Performance & Monitoring

### Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Monitoring
- **Vercel Analytics** - Frontend performance
- **Sentry** - Error tracking
- **PostHog** - User analytics
- **Uptime monitoring** - Service availability

## 🔒 Security Features

- **HTTPS enforcement** - Secure connections
- **CSRF protection** - Cross-site request forgery prevention
- **Rate limiting** - API abuse prevention
- **Input sanitization** - XSS protection
- **Content Security Policy** - Security headers
- **Password hashing** - Argon2id/bcrypt
- **JWT rotation** - Token security

## 🌐 Internationalization

- **Multi-language support** - English, Spanish, French, German
- **Localized content** - Region-specific game data
- **RTL support** - Right-to-left language support
- **Cultural adaptations** - Local gaming preferences

## 📱 Mobile Experience

- **Responsive design** - Mobile-first approach
- **Touch optimization** - Mobile-friendly interactions
- **PWA support** - Progressive web app features
- **Native app** - React Native app (Phase 2)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commits
- Write comprehensive tests
- Update documentation
- Follow accessibility guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js team** - Amazing React framework
- **Vercel** - Deployment and hosting
- **Prisma team** - Database toolkit
- **Tailwind CSS** - Utility-first CSS framework
- **Gaming community** - Inspiration and feedback

## 📞 Support

- **Documentation**: [docs.gamereview.com](https://docs.gamereview.com)
- **Discord**: [discord.gg/gamereview](https://discord.gg/gamereview)
- **Email**: support@gamereview.com
- **Issues**: [GitHub Issues](https://github.com/gamereview/platform/issues)

---

**Built with ❤️ for the gaming community**
