# Project TODO: Multiplayer Spy Game (Matchmaking + ELO)

Status: Draft v1 (implementation-ready)
Owner: You + Copilot
Scope: End-to-end plan to implement authentication-backed matchmaking, a 4-player spy/detective game loop, and ELO ranking with secure, event-driven state transitions.

---

## 1) Architecture Overview

- What: Serverless, event-driven game using Next.js App Router, Prisma (Postgres), and Supabase (Auth + Realtime).
- Why: Next.js functions are short-lived; game state must advance via explicit API-triggered transitions and persisted DB state, with Supabase Realtime for sync.
- How:
  - Persistence: Prisma models for users, queue, matches, rounds, proposals, guesses, participants.
  - Auth: Supabase Auth (email + OAuth). Trigger/Edge function mirrors new auth.users into Prisma `User` with `mmr` and `rankTier`.
  - Realtime: Supabase channels `game_room:[matchId]` for phase changes, drawing strokes, presence.
  - API: Narrow, role-checked endpoints mutate DB inside transactions and broadcast change events.
  - Security: DTOs redact sensitive fields (e.g., hide `finalKey` from detectives). Add RLS policies.

---

## 2) Data Model (Prisma)

Add/extend these models and enums (illustrative — finalize names/constraints during migration):

### Enums
- RankTier: BRONZE, SILVER, GOLD, PLATINUM, DIAMOND
- MatchPhase: GUIDELINES, KEY_SELECTION, PLAYING, HALFTIME, FINISHED
- Role: SPY, DETECTIVE
- ParticipantStatus: JOINED, READY, DISCONNECTED
- MatchStatus: ACTIVE, FINISHED, CANCELLED

### Tables
- User
  - id (String/UUID or Int), email (unique), name?, image?
  - mmr (Int, default 1000)
  - rankTier (RankTier, default BRONZE)
  - createdAt, updatedAt
  - Index: (rankTier, mmr)
- QueueEntry
  - id, userId (FK User), rankTier (copy-on-join), createdAt
  - Unique: userId (1 queue entry per user)
- Match
  - id (UUID), phase (MatchPhase), status (MatchStatus), finalKey?, createdAt, updatedAt
  - roundsToPlay (Int, default 4)
  - currentRoundNumber (Int, default 0)
- MatchParticipant
  - id, matchId (FK), userId (FK), role (Role), status (ParticipantStatus)
  - mmrSnapshot (Int) at join time (optional; for reporting fairness)
  - ready (Boolean, default false)
  - team (String or enum: SPY/DETECTIVE)
  - Unique: (matchId, userId)
- KeyProposal
  - id, matchId (FK), proposerId (FK MatchParticipant), word (Text), votes (Int), createdAt
  - Unique constraint per proposer per round if desired
- Round
  - id, matchId (FK), number (Int), drawerId (FK MatchParticipant), targetWord (Text), winnerTeam?
  - startedAt, endedAt
- GuessAttempt
  - id, matchId (FK), roundId (FK), participantId (FK), text (Text), isCorrect (Bool), createdAt
  - limit detective attempts to 1 per round; spies unlimited chat
- DrawingStroke (optional persistence)
  - id, roundId (FK), payload (JSON), seq (Int), createdAt

Notes
- Use `@unique`, `@index`, `@@index` for efficient queries by phase, matchId, participantId.
- Consider composite indexes: (matchId, role), (matchId, status), (roundId, seq).

---

## 3) Auth & Identity

- What: Persist public `User` with MMR/Rank synced to Supabase Auth.
- Why: Game logic needs public fields Supabase Auth doesn’t manage.
- How:
  1. Edge Function or Supabase trigger on `auth.users` insert → call a secure Next.js route or direct SQL to create Prisma `User` with defaults (`mmr=1000`, `rankTier=BRONZE`).
  2. On login, ensure existence of corresponding Prisma `User` (id mapping strategy: store `auth.users.id` in `User.id` or map via `authId`).
  3. Add lightweight `GET /api/me` to return DTO with rank, mmr.

---

## 4) Matchmaking (Queue + Cron)

- What: Group 4 players of similar skill into a match.
- Why: Fair games, minimal wait time.
- How:
  1. `POST /api/queue/join` → insert `QueueEntry(userId, rankTier)` if not present.
  2. `POST /api/queue/leave` → delete user’s `QueueEntry`.
  3. Client polls `GET /api/match/status` every 2s; returns `inQueue: boolean`, `matchId?: string`.
  4. Cron/Job every ~10s (Vercel Cron or Supabase Edge Scheduler):
     - Fetch groups of 4 by same `rankTier` (consider widening search over time by ±MMR buckets).
     - Transaction: create `Match(phase=GUIDELINES,status=ACTIVE)`, create 4 `MatchParticipant`, delete their `QueueEntry` rows.
     - Optional: notify via Supabase channel `queue_updates`.

---

## 5) State Machine & Phases

Phases: GUIDELINES → KEY_SELECTION → PLAYING → (after 2 rounds) HALFTIME → KEY_SELECTION → PLAYING → FINISHED

- Transitions are only via server API after validation; then broadcast `phase-change` over `game_room:[matchId]`.

### GUIDELINES (Ready Check)
- API: `POST /api/game/ready` → mark participant ready.
- Server: when 4/4 ready → `phase = KEY_SELECTION`, broadcast.

### KEY_SELECTION
- On entry: assign roles for first half (2 SPY, 2 DETECTIVE). After halftime, roles swap.
- Spy UI: propose words and vote.
- APIs:
  - `POST /api/game/proposals` (spy only)
  - `POST /api/game/vote` (spy only)
- Server: when proposal has >50% votes or timer expires, set `Match.finalKey`, `phase=PLAYING`, broadcast.

### PLAYING (Rounds)
- On entry: create `Round` with `drawerId` (alternates between spies) and `targetWord=Match.finalKey`.
- Realtime:
  - Drawing: broadcast strokes to `game_room:[matchId]`; optionally persist `DrawingStroke`.
  - Chat: spies can chat freely; detectives have a single “Decipher” guess.
- APIs:
  - `POST /api/game/chat` (spy chat only)
  - `POST /api/game/guess` (detective: single guess per round)
  - `POST /api/game/spy-guess` (Spy B guess; if equals target → spies win round)
- Server: end round on success or timer; increment `currentRoundNumber`.
- After 2 rounds: `phase = HALFTIME`, broadcast.

### HALFTIME (Swap)
- Server: swap roles for all participants, reset to `KEY_SELECTION`, broadcast.

### FINISHED (MMR/ELO)
- On match end (4 rounds total), set `status=FINISHED`.
- ELO: winning team +25 MMR; losing team -25 MMR. Update `rankTier` thresholds (e.g., >1500 SILVER).

---

## 6) API Surface (Spec)

All endpoints check:
- Authenticated user exists.
- Membership in `MatchParticipant` for `matchId`.
- Phase and role-specific guards.
- Transactions when mutating related rows.

Routes (suggested paths):
- Queue
  - POST `/api/queue/join`
  - POST `/api/queue/leave`
  - GET `/api/match/status`
  - GET `/api/match/:id` → returns DTO (role-aware redaction)
- Matchmaking Cron
  - POST `/api/cron/matchmaker` (secured by secret header)
- Game
  - POST `/api/game/ready`
  - POST `/api/game/proposals`
  - POST `/api/game/vote`
  - POST `/api/game/spy-guess`
  - POST `/api/game/guess`
  - POST `/api/game/next-round` (server-only or admin route)
  - POST `/api/game/reconnect`
- Session
  - GET `/api/me`

Response DTOs redact sensitive fields (see Section 8).

---

## 7) Realtime & Presence

- Channels
  - `game_room:[matchId]`
  - Events: `phase-change`, `ready-update`, `proposal-update`, `vote-update`, `round-start`, `round-end`, `drawing-stroke`, `chat`, `guess-result`.
- Presence
  - Track participant online/offline; escalate to `DISCONNECTED` after grace window.
- Recovery
  - On join/reload, refetch canonical state via `/api/match/:id`, then subscribe.

---

## 8) Security, DTOs, RLS, Rate Limits

- DTO Layer
  - Detective view: `finalKey: null`, hide spy proposals and votes.
  - Spy view: show `finalKey`, proposals, votes.
  - Always minimize shape: only fields needed by the view.
- Authorization
  - Derive `userId` from Supabase session server-side; never trust client-provided IDs.
  - Validate `role` and `phase` per endpoint.
- RLS (in Supabase)
  - RLS for tables exposed to client reads; or prefer server-only reads via Next.js APIs.
  - At minimum, RLS policies for `User` (self), `MatchParticipant` (by membership), and any table you plan to query directly from client.
- Rate limiting
  - Per-IP + per-user for chat/guess endpoints.
- Validation
  - Zod schemas for payloads; profanity filtering for chat and key proposals if desired.

---

## 9) UI/UX Plan

- Pages
  - `/` Landing + “Find Match” CTA.
  - `/dashboard` Profile (MMR, rankTier), recent matches.
  - `/game/[matchId]` Game room (phase-driven UI).
  - `/leaderboard` Top ranked players (optional).
- Components
  - Lobby/Guidelines: ready panel, participants list, timer.
  - Key Selection: proposals list, input form (spies), voting controls, timer.
  - Playing: drawing board (existing `DrawingBoard`), chat panel, guess inputs (role-based), timer, round status.
  - Shared: role badge, participant list with status, toast notifications.
- State
  - React client state + Supabase realtime for live updates; server fetch is source of truth at phase boundaries.

---

## 10) Timers & Job Strategy

- Key selection, rounds: client countdown + server cutoff time saved in DB; server validates late events.
- Matchmaking: Vercel Cron (≥60s) or Supabase Edge Scheduler (for 10s cadence). If 10s is required, prefer Supabase Edge Function with deno-cron.

---

## 11) Observability & Errors

- Structured logs in API routes (matchId, userId, phase, action).
- Client toasts for recoverable errors; full-screen error states for unrecoverable.
- Optional: capture metrics (matchmaking latency, round durations, disconnect rate).

---

## 12) Implementation Order (Checklists)

### A. Database & Identity
- [ ] Extend Prisma schema with models/enums (Section 2)
- [ ] Migrations: `prisma migrate dev`
- [ ] Seed script: create test users, queue entries, dummy matches
- [ ] Supabase trigger/Edge function to create Prisma `User` on signup
- [ ] Ensure `User` defaults: `mmr=1000`, `rankTier=BRONZE`

### B. Matchmaking
- [ ] `/api/queue/join` + `/api/queue/leave` + `/api/match/status`
- [ ] Cron job `/api/cron/matchmaker` (secure with header)
- [ ] Transaction: create `Match`, `MatchParticipant[4]`, delete `QueueEntry[4]`
- [ ] Client polling integrates with redirect to `/game/[matchId]`

### C. Lobby & Guidelines
- [ ] Game room page shell `/game/[matchId]`
- [ ] Fetch match + participants DTO
- [ ] Subscribe to `game_room:[matchId]`
- [ ] Ready UI + `POST /api/game/ready`
- [ ] Transition to `KEY_SELECTION` on 4/4 ready

### D. Key Selection
- [ ] Role assignment (2 spies, 2 detectives) on phase entry
- [ ] Spy proposals UI + `POST /api/game/proposals`
- [ ] Spy voting UI + `POST /api/game/vote`
- [ ] Majority or timeout → set `Match.finalKey`, phase → `PLAYING`

### E. Playing
- [ ] Create `Round` with `drawerId` + `targetWord`
- [ ] Integrate `DrawingBoard` with match/round context
- [ ] Chat (spy-only) + `POST /api/game/chat`
- [ ] Detective guess (one per round) + `POST /api/game/guess`
- [ ] Spy B guess path + `POST /api/game/spy-guess`
- [ ] End round conditions (win or timer), increment round

### F. Halftime & Finish
- [ ] After 2 rounds → `HALFTIME` → swap roles → back to `KEY_SELECTION`
- [ ] After 4 rounds → `FINISHED`
- [ ] ELO updates ±25; update `rankTier` thresholds
- [ ] Post-match summary view

### G. Security & Polish
- [ ] DTOs with role-based redaction
- [ ] AuthZ checks (phase, role, membership) in all routes
- [ ] RLS for any direct client reads or move all reads server-side
- [ ] Rate limits (chat/guess), profanity filter optional
- [ ] Error handling, logs, metrics

### H. Nice-to-Haves
- [ ] Presence indicators and reconnect flow
- [ ] Leaderboard page
- [ ] Spectator mode (read-only)

---

## 13) Acceptance Criteria

- Auth creates a mirrored Prisma `User` with `mmr=1000`, `rankTier=BRONZE`.
- Queue groups 4 players of same rank tier into active `Match` within 10–60s.
- Clients in queue see status switch to in-match and navigate to `/game/[matchId]`.
- Ready check gates progression to `KEY_SELECTION`.
- Spies can propose and vote on a key; majority or timeout advances to `PLAYING` with `finalKey` set.
- Rounds: drawing and chat are realtime; guesses adjudicate immediately; per-role permissions enforced.
- Halftime swaps roles after 2 rounds; game ends after 4 rounds.
- ELO adjusts ±25; rank tier updates at thresholds.
- Detectives never receive `finalKey` in APIs; DTO redaction verified via Network tab.

---

## 14) Risks & Mitigations

- Long queues at off-peak: widen MMR window over time; fallback bots.
- Cheating via devtools: strict DTO redaction + server validation; avoid exposing sensitive fields client-side.
- Serverless timing drift: client timers as UX; authoritative server timestamps/endpoints enforce cutoffs.
- Disconnect churn: grace window + reconnect API; presence updates UI.
- Storage bloat (strokes): snapshot per N strokes or per 5s; GC old snapshots.

---

## 15) Operational Notes

- ENV
  - SUPABASE: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - DATABASE: `DATABASE_URL` (pooled), `DIRECT_URL` (migrations)
  - CRON: secret header `CRON_SECRET` for matchmaker route
- Deploy
  - Vercel Cron (or Supabase deno-cron) for matchmaking
  - Migrations run on deploy; seed via script in non-prod only

---

## 16) Quick Start (once implemented)

```bash
# 1) Install & generate prisma
pnpm install
pnpm prisma generate
pnpm prisma migrate dev

# 2) Seed (optional)
pnpm tsx prisma/seed.ts

# 3) Dev server
pnpm dev
```

MMR update rule: $mmr' = mmr \pm 25$.

---

## 17) File/Folder Additions (planned)

- src/app/api/queue/join/route.ts
- src/app/api/queue/leave/route.ts
- src/app/api/match/status/route.ts
- src/app/api/cron/matchmaker/route.ts
- src/app/api/game/ready/route.ts
- src/app/api/game/proposals/route.ts
- src/app/api/game/vote/route.ts
- src/app/api/game/guess/route.ts
- src/app/api/game/spy-guess/route.ts
- src/app/api/me/route.ts
- src/app/game/[matchId]/page.tsx
- src/lib/game/{dto.ts, phase-manager.ts, elo.ts}
- prisma/schema.prisma (extended)
- prisma/seed.ts (extended)
