# CLAUDE.md

## Opis projektu

Prosta aplikacja webowa do zarządzania użytkownikami, oparta o Next.js (App Router) + React + Prisma + PostgreSQL. Projekt ma charakter edukacyjny — celem jest nauka pracy AI-first (współpraca z Claude Code nad kodem produkcyjnej jakości), a nie budowa produktu komercyjnego.

## Stack i wersje

- **Next.js** — najnowsza stabilna wersja (16.x), App Router
- **React** — najnowsza stabilna wersja (19.x)
- **TypeScript** — najnowsza stabilna wersja (7.x), tryb `strict`
- **Prisma** — najnowsza stabilna wersja (7.x) jako ORM
- **PostgreSQL** — baza danych
- **pnpm** — package manager (nie używamy npm/yarn)
- **Docker / docker-compose** — wyłącznie do uruchomienia lokalnej bazy PostgreSQL; sama aplikacja Next.js działa poza kontenerem (`pnpm dev`)

Wersje pakietów trzymamy na bieżąco jako "najnowsze stabilne" — przy dodawaniu zależności sprawdzamy aktualny stabilny release, nie przypinamy się do wersji z tego dokumentu.

## Konwencje kodu

- TypeScript w trybie `strict` — brak `any` bez wyraźnego uzasadnienia
- ESLint + Prettier — kod musi przechodzić lint przed commitem
- Komponenty React Server Components domyślnie; `"use client"` tylko tam, gdzie faktycznie potrzebna jest interaktywność
- API budowane jako Next.js Route Handlers (`src/app/api/**/route.ts`) — bez osobnego backendu
- Testy jednostkowe/integracyjne: **Vitest** + **Testing Library**
- Testy e2e: **Playwright**
- Nazewnictwo i struktura plików: zgodnie z konwencjami App Router (`page.tsx`, `layout.tsx`, `route.ts` itd.)

## Zasady pracy

- Małe, częste commity w konwencji **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:` itd.)
- Każda zmiana ma krótki opis **co i dlaczego** (w commit message lub PR description) — nie tylko "co"
- Pytaj mnie zanim wykonasz coś nieodwracalnego lub trudnego do cofnięcia, np.:
  - drop/reset bazy danych, nieodwracalne migracje
  - `git push --force`, `git reset --hard`, usuwanie branchy
  - usuwanie plików/danych, nadpisywanie niezacommitowanych zmian
- Preferuj rozwiązania proste i czytelne nad "sprytne" — to projekt edukacyjny, priorytetem jest zrozumiałość

## Struktura katalogów (planowana)

```
users-app/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── src/
│   ├── app/                # Next.js App Router (strony, layouty)
│   │   ├── api/             # Route Handlers (backend API)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # komponenty współdzielone
│   ├── lib/                 # klient Prisma, utils, konfiguracja
│   ├── server/               # logika serwerowa / server actions
│   └── types/
├── tests/
│   ├── unit/                # Vitest + Testing Library
│   └── e2e/                  # Playwright
├── docker/
│   └── docker-compose.yml   # tylko PostgreSQL
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── CLAUDE.md
```

## Produkcja

- **Aplikacja**: https://users-app-gamma-seven.vercel.app/ — hostowana na Vercel, spięta z repo `antoni-matusz-repo/users-app`, deployuje branch `main`
- **Baza danych**: Neon (Postgres), projekt `users-app` (ID: `patient-sunset-72632225`), organizacja `Antoni` (ID: `org-misty-meadow-12787184`), branch `production`
- **Build na Vercel**: skrypt `vercel-build` w `package.json` — `prisma generate` → `scripts/migrate-deploy.mjs` (migracje przez bezpośrednie połączenie) → `next build`
- **Zmienne środowiskowe w Vercel**: `DATABASE_URL` (pooled, runtime aplikacji), `DATABASE_URL_UNPOOLED` (bezpośrednie, tylko do migracji)
- Workspace lokalnie połączony z projektem Neon przez `neon link` (plik `.neon`, gitignored) — CLI/MCP Neona skonfigurowane przez skille `neon`/`neon-postgres` (`.agents/skills/`)
