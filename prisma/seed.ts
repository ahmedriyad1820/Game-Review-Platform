import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.review.deleteMany()
  await prisma.listItem.deleteMany()
  await prisma.list.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.report.deleteMany()
  await prisma.user.deleteMany()
  await prisma.game.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@gamereview.com',
        passwordHash: await bcrypt.hash('Admin123!', 12),
        roles: ['ADMIN', 'MODERATOR'],
        isVerified: true,
        bio: 'Platform administrator and gaming enthusiast',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        username: 'RPGMaster',
        email: 'rpgmaster@gamereview.com',
        passwordHash: await bcrypt.hash('Password123!', 12),
        roles: ['VERIFIED', 'USER'],
        isVerified: true,
        bio: 'Passionate RPG player and reviewer. Love deep stories and complex mechanics.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        username: 'WebSlinger',
        email: 'webslinger@gamereview.com',
        passwordHash: await bcrypt.hash('Password123!', 12),
        roles: ['VERIFIED', 'USER'],
        isVerified: true,
        bio: 'Action-adventure game specialist. Always looking for the next great story.',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        username: 'HorrorFan',
        email: 'horrorfan@gamereview.com',
        passwordHash: await bcrypt.hash('Password123!', 12),
        roles: ['USER'],
        isVerified: false,
        bio: 'Horror game enthusiast. The scarier, the better!',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        username: 'IndieGamer',
        email: 'indiegamer@gamereview.com',
        passwordHash: await bcrypt.hash('Password123!', 12),
        roles: ['USER'],
        isVerified: false,
        bio: 'Discovering hidden gems in the indie game scene.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      },
    }),
  ])

  console.log('👥 Created users')

  // Create games
  const games = await Promise.all([
    prisma.game.create({
      data: {
        title: 'Cyberpunk 2077',
        slug: 'cyberpunk-2077',
        descriptionMd: 'An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.',
        releaseDate: new Date('2020-12-10'),
        developer: 'CD Projekt Red',
        publisher: 'CD Projekt',
        genres: ['RPG', 'Action', 'Sci-Fi', 'Open World'],
        tags: ['Cyberpunk', 'Story-Rich', 'Character Customization', 'Atmospheric'],
        platforms: ['PC', 'PS5', 'Xbox Series X', 'PS4', 'Xbox One'],
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=8X2kIfS6fb8',
        systemRequirements: {
          minimum: {
            os: 'Windows 10',
            processor: 'Intel Core i5-3570K or AMD FX-8310',
            memory: '8 GB RAM',
            graphics: 'NVIDIA GeForce GTX 970 or AMD Radeon RX 470',
            storage: '70 GB available space',
          },
          recommended: {
            os: 'Windows 10',
            processor: 'Intel Core i7-4790 or AMD Ryzen 3 3200G',
            memory: '12 GB RAM',
            graphics: 'NVIDIA GeForce GTX 1060 or AMD Radeon RX 590',
            storage: '70 GB available space',
          },
        },
        esrbRating: 'M',
        metacriticUrl: 'https://www.metacritic.com/game/cyberpunk-2077/',
        criticScore: 87,
      },
    }),
    prisma.game.create({
      data: {
        title: 'Elden Ring',
        slug: 'elden-ring',
        descriptionMd: 'An action RPG set in a vast fantasy world. Created by FromSoftware and George R.R. Martin, Elden Ring features challenging combat, deep lore, and an open world to explore.',
        releaseDate: new Date('2022-02-25'),
        developer: 'FromSoftware',
        publisher: 'Bandai Namco Entertainment',
        genres: ['Action RPG', 'Soulslike', 'Open World', 'Fantasy'],
        tags: ['Challenging', 'Atmospheric', 'Story Rich', 'Great Soundtrack'],
        platforms: ['PC', 'PS5', 'Xbox Series X', 'PS4', 'Xbox One'],
        coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=AKXiKBnzpBQ',
        systemRequirements: {
          minimum: {
            os: 'Windows 10',
            processor: 'Intel Core i5-8400 or AMD Ryzen 3 3300X',
            memory: '12 GB RAM',
            graphics: 'NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580 4GB',
            storage: '60 GB available space',
          },
          recommended: {
            os: 'Windows 10/11',
            processor: 'Intel Core i7-8700K or AMD Ryzen 5 3600X',
            memory: '16 GB RAM',
            graphics: 'NVIDIA GeForce GTX 1070 8GB or AMD Radeon RX VEGA 56 8GB',
            storage: '60 GB available space',
          },
        },
        esrbRating: 'T',
        metacriticUrl: 'https://www.metacritic.com/game/elden-ring/',
        criticScore: 96,
      },
    }),
    prisma.game.create({
      data: {
        title: 'The Legend of Zelda: Tears of the Kingdom',
        slug: 'zelda-tears-kingdom',
        descriptionMd: 'The sequel to Breath of the Wild, featuring new abilities, expanded world exploration, and the return of Ganondorf as the main antagonist.',
        releaseDate: new Date('2023-05-12'),
        developer: 'Nintendo',
        publisher: 'Nintendo',
        genres: ['Action Adventure', 'Open World', 'Puzzle', 'Fantasy'],
        tags: ['Adventure', 'Puzzle', 'Exploration', 'Nintendo'],
        platforms: ['Nintendo Switch'],
        coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=uHGShqcAHlQ',
        systemRequirements: {
          minimum: {
            os: 'Nintendo Switch System Software 16.0.0',
            processor: 'Nintendo Switch',
            memory: 'Nintendo Switch',
            graphics: 'Nintendo Switch',
            storage: '18.2 GB available space',
          },
        },
        esrbRating: 'E10+',
        metacriticUrl: 'https://www.metacritic.com/game/the-legend-of-zelda-tears-of-the-kingdom/',
        criticScore: 96,
      },
    }),
    prisma.game.create({
      data: {
        title: 'Baldur\'s Gate 3',
        slug: 'baldurs-gate-3',
        descriptionMd: 'A next-generation RPG set in the world of Dungeons & Dragons. Experience a cinematic story with unprecedented player freedom, featuring turn-based combat and deep character customization.',
        releaseDate: new Date('2023-08-03'),
        developer: 'Larian Studios',
        publisher: 'Larian Studios',
        genres: ['RPG', 'Turn-Based', 'Fantasy', 'Story Rich'],
        tags: ['D&D', 'Co-op', 'Multiplayer', 'Character Customization'],
        platforms: ['PC', 'PS5', 'Xbox Series X'],
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=1T22w0vcKjE',
        systemRequirements: {
          minimum: {
            os: 'Windows 10 64-bit',
            processor: 'Intel I5 4690 / AMD FX 8350',
            memory: '8 GB RAM',
            graphics: 'Nvidia GTX 970 / RX 480 (4GB+ of VRAM)',
            storage: '150 GB available space',
          },
          recommended: {
            os: 'Windows 10 64-bit',
            processor: 'Intel i7 8700K / AMD r5 3600',
            memory: '16 GB RAM',
            graphics: 'Nvidia 2060 Super / RX 5700 XT (8GB+ of VRAM)',
            storage: '150 GB available space',
          },
        },
        esrbRating: 'M',
        metacriticUrl: 'https://www.metacritic.com/game/baldurs-gate-3/',
        criticScore: 96,
      },
    }),
    prisma.game.create({
      data: {
        title: 'Spider-Man 2',
        slug: 'spider-man-2',
        descriptionMd: 'The sequel to Marvel\'s Spider-Man, featuring both Peter Parker and Miles Morales as they face new threats in an expanded New York City.',
        releaseDate: new Date('2023-10-20'),
        developer: 'Insomniac Games',
        publisher: 'Sony Interactive Entertainment',
        genres: ['Action Adventure', 'Open World', 'Superhero', 'Story Rich'],
        tags: ['Marvel', 'Superhero', 'Open World', 'Action'],
        platforms: ['PS5'],
        coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=nq1uAqyKjL0',
        systemRequirements: {
          minimum: {
            os: 'PS5 System Software',
            processor: 'PS5',
            memory: 'PS5',
            graphics: 'PS5',
            storage: '98 GB available space',
          },
        },
        esrbRating: 'T',
        metacriticUrl: 'https://www.metacritic.com/game/marvels-spider-man-2/',
        criticScore: 90,
      },
    }),
    prisma.game.create({
      data: {
        title: 'Alan Wake 2',
        slug: 'alan-wake-2',
        descriptionMd: 'A survival horror game that follows the story of Alan Wake, a writer trapped in a nightmare, and Saga Anderson, an FBI agent investigating a series of ritualistic murders.',
        releaseDate: new Date('2023-10-27'),
        developer: 'Remedy Entertainment',
        publisher: 'Epic Games Publishing',
        genres: ['Survival Horror', 'Psychological', 'Thriller', 'Story Rich'],
        tags: ['Horror', 'Psychological', 'Atmospheric', 'Mystery'],
        platforms: ['PC', 'PS5', 'Xbox Series X'],
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=YQxMbe9LbfM',
        systemRequirements: {
          minimum: {
            os: 'Windows 10/11 64-bit',
            processor: 'Intel i5-8400 or AMD equivalent',
            memory: '16 GB RAM',
            graphics: 'GeForce RTX 2060 or Radeon RX 6600',
            storage: '90 GB available space',
          },
          recommended: {
            os: 'Windows 10/11 64-bit',
            processor: 'Intel i7-10700K or AMD equivalent',
            memory: '16 GB RAM',
            graphics: 'GeForce RTX 3070 or Radeon RX 6700 XT',
            storage: '90 GB available space',
          },
        },
        esrbRating: 'M',
        metacriticUrl: 'https://www.metacritic.com/game/alan-wake-2/',
        criticScore: 89,
      },
    }),
  ])

  console.log('🎮 Created games')

  // Create reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: users[1].id, // RPGMaster
        gameId: games[3].id, // Baldur's Gate 3
        rating: 9.5,
        bodyMd: `Larian Studios has delivered what might be the most impressive RPG I've ever played. The depth of choice, the quality of writing, and the sheer amount of content is staggering.

**What makes this game special:**
- The writing is exceptional, with every character feeling real and every choice having weight
- The combat system is deep and tactical, requiring real strategy
- The world is massive and filled with secrets
- The voice acting is top-notch across the board

**Minor issues:**
- The learning curve can be steep for newcomers to CRPGs
- Some bugs in the later acts (though they're being patched)
- The game is very long (100+ hours for completionists)

Overall, this is a game that will be talked about for years to come. It sets a new standard for what RPGs can achieve.`,
        pros: ['Exceptional writing', 'Meaningful choices', 'Beautiful graphics', 'Deep combat', 'Massive world'],
        cons: ['Steep learning curve', 'Some bugs in later acts', 'Very long playtime'],
        playtimeHours: 120,
        containsSpoilers: false,
      },
    }),
    prisma.review.create({
      data: {
        userId: users[2].id, // WebSlinger
        gameId: games[4].id, // Spider-Man 2
        rating: 8.8,
        bodyMd: `Insomniac has once again captured the essence of being Spider-Man. The web-swinging mechanics are refined, the story is compelling, and the open world feels alive.

**Highlights:**
- Web-swinging is still the best traversal system in gaming
- Both Peter and Miles have compelling storylines
- The expanded New York City is beautiful and detailed
- Combat is fluid and satisfying

**Areas for improvement:**
- Some side content feels repetitive
- The main story could be longer
- Some technical issues on launch

This is a fantastic sequel that improves on the original in almost every way.`,
        pros: ['Amazing web-swinging', 'Great story', 'Beautiful graphics', 'Fluid combat', 'Expanded world'],
        cons: ['Repetitive side content', 'Short main story', 'Some technical issues'],
        playtimeHours: 45,
        containsSpoilers: false,
      },
    }),
    prisma.review.create({
      data: {
        userId: users[3].id, // HorrorFan
        gameId: games[5].id, // Alan Wake 2
        rating: 8.9,
        bodyMd: `Remedy has crafted one of the most atmospheric and psychologically unsettling horror games in recent memory. The narrative is complex, the atmosphere is thick, and the scares are genuine.

**What works:**
- Incredibly atmospheric and moody
- Complex, layered narrative that rewards attention
- Genuine psychological horror elements
- Beautiful graphics and sound design

**What doesn't:**
- Some pacing issues in the middle sections
- Occasional technical problems
- The combat can feel clunky at times

This is a game that will stick with you long after you finish it.`,
        pros: ['Atmospheric horror', 'Complex narrative', 'Beautiful graphics', 'Great sound design', 'Psychological depth'],
        cons: ['Pacing issues', 'Some technical problems', 'Clunky combat'],
        playtimeHours: 35,
        containsSpoilers: false,
      },
    }),
  ])

  console.log('📝 Created reviews')

  // Create lists
  const lists = await Promise.all([
    prisma.list.create({
      data: {
        userId: users[1].id, // RPGMaster
        title: 'My RPG Collection',
        description: 'A collection of my favorite RPGs that I\'ve played and loved.',
        visibility: 'PUBLIC',
      },
    }),
    prisma.list.create({
      data: {
        userId: users[2].id, // WebSlinger
        title: 'Action Games Wishlist',
        description: 'Games I\'m excited to play in the action genre.',
        visibility: 'PUBLIC',
      },
    }),
    prisma.list.create({
      data: {
        userId: users[3].id, // HorrorFan
        title: 'Horror Games Completed',
        description: 'All the horror games I\'ve finished. The scarier, the better!',
        visibility: 'PUBLIC',
      },
    }),
  ])

  console.log('📚 Created lists')

  // Add games to lists
  await Promise.all([
    prisma.listItem.create({
      data: {
        listId: lists[0].id,
        gameId: games[3].id, // Baldur's Gate 3
      },
    }),
    prisma.listItem.create({
      data: {
        listId: lists[1].id,
        gameId: games[4].id, // Spider-Man 2
      },
    }),
    prisma.listItem.create({
      data: {
        listId: lists[2].id,
        gameId: games[5].id, // Alan Wake 2
      },
    }),
  ])

  console.log('➕ Added games to lists')

  // Create some follows
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[2].id, // WebSlinger follows RPGMaster
        followeeId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[3].id, // HorrorFan follows RPGMaster
        followeeId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[4].id, // IndieGamer follows HorrorFan
        followeeId: users[3].id,
      },
    }),
  ])

  console.log('👥 Created follows')

  // Create some votes on reviews
  await Promise.all([
    prisma.vote.create({
      data: {
        userId: users[2].id,
        targetType: 'REVIEW',
        targetId: reviews[0].id,
        value: 1,
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[3].id,
        targetType: 'REVIEW',
        targetId: reviews[0].id,
        value: 1,
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[4].id,
        targetType: 'REVIEW',
        targetId: reviews[0].id,
        value: 1,
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[1].id,
        targetType: 'REVIEW',
        targetId: reviews[1].id,
        value: 1,
      },
    }),
    prisma.vote.create({
      data: {
        userId: users[3].id,
        targetType: 'REVIEW',
        targetId: reviews[1].id,
        value: 1,
      },
    }),
  ])

  console.log('👍 Created votes')

  // Update review vote counts
  await Promise.all([
    prisma.review.update({
      where: { id: reviews[0].id },
      data: { upvotesCount: 3 },
    }),
    prisma.review.update({
      where: { id: reviews[1].id },
      data: { upvotesCount: 2 },
    }),
  ])

  console.log('📊 Updated review vote counts')

  console.log('✅ Database seeding completed successfully!')
  console.log(`Created ${users.length} users, ${games.length} games, ${reviews.length} reviews, and ${lists.length} lists`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
