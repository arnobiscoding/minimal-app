# 🎮 Spy vs Detectives

> A competitive multiplayer game of steganography where spies communicate through drawings while detectives try to intercept their messages.

![System Architecture](./public/systemDesign.jpg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Game Mechanics](#game-mechanics)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

CipherCanvas is a real-time multiplayer game where 4 players are divided into two teams:

- **2 Spies**: Must communicate a secret key through drawings without revealing it to detectives
- **2 Detectives**: Must intercept and guess the secret key by analyzing the drawings

The game features ranked matchmaking, ELO-based ranking system, and real-time synchronization using WebSockets.

## ✨ Features

### Core Gameplay

- **4-Player Matches**: Balanced teams of 2 spies vs 2 detectives
- **Real-time Drawing**: Collaborative drawing board with live synchronization
- **Secret Key Voting**: Spies propose and vote on secret keys
- **Role Swapping**: Teams swap roles at halftime for balanced gameplay
- **Round-based System**: 4 rounds per match with scoring

### Matchmaking & Ranking

- **ELO-based Matchmaking**: Players matched by skill level (MMR)
- **Rank Tiers**: BRONZE, SILVER, GOLD, DIAMOND
- **Queue System**: Real-time matchmaking with automatic pairing
- **Match History**: Track your performance and statistics

### Technical Features

- **Real-time Updates**: Supabase Realtime for instant game state synchronization
- **Secure Architecture**: Role-based data redaction (detectives can't see secret keys)
- **Row Level Security**: Database-level security policies
- **Responsive Design**: Modern UI with Tailwind CSS and Shadcn UI
- **Type Safety**: Full TypeScript coverage with Prisma ORM

## 🛠 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality component library
- **React Sketch Canvas** - Drawing functionality
- **Lucide React** - Icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database (via Supabase)
- **Supabase Auth** - Authentication and user management
- **Supabase Realtime** - WebSocket-based real-time updates

### Infrastructure

- **Supabase** - Backend-as-a-Service (Auth, Database, Realtime)
- **Vercel** - Deployment platform (recommended)

## 🏗 System Architecture

![System Architecture Diagram](./public/systemDesign.jpg)

The application follows a three-tier architecture:

### 1. Client Layer (Browser/Device)

- **Next.js 14** frontend with App Router
- **Supabase Client SDK** for direct auth and realtime connections
- Views: Landing, Dashboard, Game Arena (Voting, Drawing, Summary)

### 2. Server Layer (Next.js API)

- **API Routes** for game logic and matchmaking
- **Prisma Client** for database operations
- **Auth Middleware** for request authentication
- Handles: Queue management, game state transitions, ELO calculations

### 3. Data Layer (Supabase Platform)

- **PostgreSQL Database** with RLS policies
- **Supabase Auth** for user authentication
- **Supabase Realtime** for WebSocket connections
- Two communication lanes:
  - **Reliable Lane**: Game state updates
  - **Fast Lane**: Drawing data broadcasts

### Data Flow

1. **Authentication**: Client → Supabase Auth → Session tokens
2. **API Requests**: Client → Next.js API → Prisma → PostgreSQL
3. **Real-time Updates**: PostgreSQL changes → Supabase Realtime → Client
4. **Drawing Data**: Client → Supabase Realtime (broadcast) → Other clients

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (via Supabase or self-hosted)
- Supabase account (for Auth and Realtime)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd minimal-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables (see [Environment Variables](#environment-variables))

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
minimal-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/
│   └── systemDesign.jpg       # Architecture diagram
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth routes (login, signup)
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── game/         # Game logic endpoints
│   │   │   ├── match/        # Match data endpoints
│   │   │   ├── matchmaking/  # Queue management
│   │   │   └── cron/         # Background jobs
│   │   ├── dashboard/        # User dashboard
│   │   ├── game/             # Game arena
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── game/             # Game components
│   │   ├── landing/          # Landing page components
│   │   └── ui/               # Reusable UI components
│   ├── lib/
│   │   ├── game/              # Game logic (DTO, ELO)
│   │   ├── constants.ts       # Application constants
│   │   ├── errors.ts          # Error handling
│   │   ├── logger.ts          # Logging utility
│   │   ├── validation.ts      # Input validation schemas
│   │   └── prisma.ts          # Prisma client
│   └── utils/
│       └── supabase/          # Supabase utilities
├── CODE_REVIEW.md             # Code review documentation
├── TODO.md                     # Project roadmap
└── README.md                   # This file
```

## 📚 API Documentation

### Authentication

#### `POST /api/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": { ... },
  "session": { ... }
}
```

#### `POST /api/auth/signin`

Sign in with email and password.

#### `POST /api/auth/signout`

Sign out the current user.

### Matchmaking

#### `POST /api/matchmaking/queue`

Join the matchmaking queue.

**Response:**

```json
{
  "matchId": "uuid" | null,
  "inQueue": true
}
```

#### `POST /api/matchmaking/leave`

Leave the matchmaking queue.

#### `GET /api/matchmaking/status`

Check current matchmaking status.

### Game

#### `GET /api/match/[matchId]`

Get match details with role-based data redaction.

#### `POST /api/game/ready`

Mark yourself as ready in the guidelines phase.

**Request Body:**

```json
{
  "matchId": "uuid"
}
```

#### `POST /api/game/proposals`

Propose a secret key (spies only).

**Request Body:**

```json
{
  "matchId": "uuid",
  "text": "SECRET"
}
```

#### `POST /api/game/vote`

Vote on a proposal (spies only).

**Request Body:**

```json
{
  "matchId": "uuid",
  "proposalId": "uuid"
}
```

#### `POST /api/game/guess`

Submit a guess (detectives only).

**Request Body:**

```json
{
  "matchId": "uuid",
  "text": "GUESS"
}
```

#### `POST /api/game/leave`

Leave an active match.

### Health Check

#### `GET /api/health`

Check API health status.

## 🎲 Game Mechanics

### Game Phases

1. **GUIDELINES**: All players must mark ready
2. **KEY_SELECTION**: Spies propose and vote on secret key
3. **PLAYING**: Drawing and guessing rounds
4. **HALFTIME**: Role swap (after 2 rounds)
5. **FINISHED**: Match complete, ELO updated

### Scoring System

- **Spies Win Round**: If Spy B guesses the target word correctly
- **Detectives Win Round**: If a detective guesses correctly first
- **Match Winner**: Team with higher total score after 4 rounds

### ELO System

- **Base MMR**: 1000
- **MMR Change**: ±25 per match
- **Rank Tiers**:
  - BRONZE: 0-1199 MMR
  - SILVER: 1200-1499 MMR
  - GOLD: 1500-1999 MMR
  - DIAMOND: 2000+ MMR

### Matchmaking

- Players matched by rank tier and MMR (±100 range)
- Queue groups players into sets of 4
- Automatic match creation when 4 players found

## 💻 Development

### Code Quality

The project follows these engineering practices:

- **Type Safety**: Full TypeScript coverage
- **Input Validation**: Zod schemas for all API inputs
- **Error Handling**: Standardized error responses
- **Logging**: Structured logging utility
- **Constants**: Centralized configuration
- **Environment Validation**: Runtime env var checks

### Running Tests

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Database Management

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### Code Style

- Use TypeScript strict mode
- Follow Next.js App Router conventions
- Use functional components with hooks
- Prefer server components when possible
- Use Prisma transactions for multi-step operations

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Optional
CRON_SECRET="your-cron-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## 🗄 Database Schema

### Key Models

- **User**: Player profiles with MMR and rank tier
- **QueueEntry**: Temporary matchmaking queue
- **Match**: Game matches with phase and status
- **MatchParticipant**: Players in a match with roles
- **KeyProposal**: Secret key proposals from spies
- **Round**: Individual game rounds
- **GuessAttempt**: Player guesses

See `prisma/schema.prisma` for complete schema definition.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add JSDoc comments for complex functions
- Write descriptive commit messages
- Update documentation for new features
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

\*_Made with ❤️ Megamind Team_
