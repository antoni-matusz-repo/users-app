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
- Przy dodawaniu lub zmianie zmiennej środowiskowej/sekretu (nowa integracja, nowy provider itp.): zawsze (1) zaktualizuj `.env.example`, (2) zaktualizuj listę w sekcji „Produkcja" poniżej, (3) napisz mi wprost co i gdzie mam zrobić w panelu Vercela — nazwa zmiennej, wartość (albo skąd ją wziąć), które środowisko (Production/Preview/Development), i czy potrzebny jest ręczny redeploy (dodanie zmiennej w Vercelu samo z siebie NIE odpala redeploya)

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
- **Zmienne środowiskowe w Vercel** (środowisko Production, ustawione ręcznie w panelu Vercela — dodanie/zmiana nie odpala automatycznego redeploya):
  - `DATABASE_URL` — pooled, runtime aplikacji
  - `DATABASE_URL_UNPOOLED` — bezpośrednie połączenie, tylko do migracji (`vercel-build`)
  - `BETTER_AUTH_SECRET` — wymagany od #6 (Better Auth); bez niego `betterAuth()` rzuca wyjątkiem przy starcie w `NODE_ENV=production` (domyślny sekret jest zablokowany na produkcji) — awaria całej aplikacji, nie tylko tras logowania
  - `BETTER_AUTH_URL` — bazowy URL aplikacji (`https://users-app-gamma-seven.vercel.app`); brak nie crashuje appki, tylko loguje ostrzeżenie i może psuć redirecty/callbacki
  - `RESEND_API_KEY` — wymagany od #7 (rejestracja + maile weryfikacyjne); bez niego wysyłka prób leci przez lokalny SMTP (Mailpit), którego na produkcji nie ma
  - `EMAIL_FROM` — adres nadawcy; z sandboxowym `onboarding@resend.dev` (bez weryfikacji domeny w Resend) maile idą tylko na adres właściciela konta Resend, nie do dowolnego użytkownika
- Workspace lokalnie połączony z projektem Neon przez `neon link` (plik `.neon`, gitignored) — CLI/MCP Neona skonfigurowane przez skille `neon`/`neon-postgres` (`.agents/skills/`)
