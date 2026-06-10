# VID Master Zimbabwe

Zimbabwe's premier learner's licence exam preparation and driver education platform — helping learners pass VID examinations through realistic simulations, interactive learning, and progress tracking.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at `/api`)
- `pnpm --filter @workspace/vid-master run dev` — run the frontend (served at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Recharts, Wouter router, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: JWT (bcryptjs + jsonwebtoken), stored as `vid_token` in localStorage
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — Database tables (users, questions, testSessions, roadSigns, bookmarks)
- `artifacts/api-server/src/routes/` — Express route handlers (auth, questions, tests, progress, signs, admin)
- `artifacts/api-server/src/middlewares/auth.ts` — JWT auth middleware
- `artifacts/vid-master/src/` — React frontend (pages, components, hooks)

## Architecture decisions

- Backend is single source of truth for all test scoring and timing — frontend never trusts submitted scores
- Test sessions expire server-side (8 min = 480s) regardless of client timer
- JWT auth with 7-day expiry; token stored in `vid_token` localStorage key
- Question selection uses controlled difficulty distribution: ~40% easy, ~40% medium, ~20% hard, shuffled
- Pass threshold: 60% (15/25 correct)
- XP system: 100 XP for passing, 30 XP for failing; level = floor(xp/500) + 1

## Product

- **VID Practice Tests** — 56+ real Zimbabwe VID questions, timed (8 min, 25 questions) or practice mode
- **Road Signs Library** — 25 signs across Warning, Regulatory, Informative, Direction categories
- **Progress Dashboard** — exam readiness meter, streak, XP, rank, category breakdown
- **Leaderboard** — top learners ranked by XP
- **Question Bookmarks** — save difficult questions for revision
- **Admin Panel** — manage questions, users, and view platform analytics
- **Gamification** — XP, levels (Beginner Driver → VID Master), pass rate tracking

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always re-run `pnpm --filter @workspace/api-spec run codegen` after editing `openapi.yaml`
- DB schema push with `pnpm --filter @workspace/db run push` before starting the API server after schema changes
- The `SESSION_SECRET` env var is already set; JWT signing uses it automatically
- Admin routes require `role: "admin"` in JWT payload — promote a user via admin panel or direct DB update

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
