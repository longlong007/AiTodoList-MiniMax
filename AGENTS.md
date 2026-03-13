# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Smart TodoList (智能TodoList) — a Vue 3 + NestJS + PostgreSQL task management app with AI suggestions. Monorepo using npm workspaces (`frontend/`, `backend/`).

### Services

| Service | Port | Command |
|---------|------|---------|
| PostgreSQL 15 | 5432 | `docker compose up -d` (from repo root) |
| NestJS Backend | 3001 | `npm run dev:backend` (from repo root) |
| Vue 3 Frontend (Vite) | 5173 | `npm run dev:frontend` (from repo root) |
| Both frontend + backend | — | `npm run dev` (from repo root) |

### Startup sequence

1. Start Docker daemon: `sudo dockerd &>/tmp/dockerd.log &` then `sudo chmod 666 /var/run/docker.sock`
2. Start PostgreSQL: `docker compose up -d`
3. Start app: `npm run dev` (runs both frontend and backend concurrently)

### Key gotchas

- **DB name mismatch**: `docker-compose.yml` creates database `todolist_minimax`, but the backend defaults to `todolist`. The `backend/.env` must set `DB_NAME=todolist_minimax` to match.
- **JWT secret and module loading order**: The `.env` file is loaded at the top of `app.module.ts`, but ES module imports are hoisted. This means `auth.module.ts` evaluates `JwtModule.register({ secret: process.env.JWT_SECRET || 'smart-todolist-secret-key' })` before the `.env` is loaded. Set `JWT_SECRET=smart-todolist-secret-key` in `backend/.env` to match the default, or leave it unset.
- **backend/.env**: Copy from `backend/.env.example` and set: `DB_HOST=localhost`, `DB_USERNAME=postgres`, `DB_PASSWORD=postgres`, `DB_NAME=todolist_minimax`, `JWT_SECRET=smart-todolist-secret-key`. `ZHIPU_API_KEY` is optional (falls back to mock suggestions).
- **TypeORM `synchronize: true`** in dev mode auto-creates/migrates tables — no manual migration step needed.
- **No ESLint config**: The project has no `.eslintrc` or `eslint.config.*`. Use `npx tsc --noEmit` (backend) and `npx vite build` (frontend) for validation.
- **No automated test suites**: The project does not include unit or integration test configurations.

### Build / validate commands

- Backend TypeScript check: `cd backend && npx tsc --noEmit`
- Backend build: `cd backend && npx nest build`
- Frontend build: `cd frontend && npx vite build`
