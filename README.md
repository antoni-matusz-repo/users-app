# users-app

Prosta aplikacja webowa do zarządzania użytkownikami, oparta o Next.js (App Router) + React + Prisma + PostgreSQL. Projekt ma charakter edukacyjny — celem jest nauka pracy AI-first (współpraca z Claude Code nad kodem produkcyjnej jakości), a nie budowa produktu komercyjnego.

Pełne konwencje pracy nad projektem opisane są w [CLAUDE.md](./CLAUDE.md), a rozbicie na etapy w [plan.md](./plan.md).

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** w trybie `strict`
- **Prisma 7** jako ORM (z driver adapterem `@prisma/adapter-pg`)
- **PostgreSQL** — uruchamiany lokalnie w Dockerze
- **pnpm** jako package manager
- **Vitest** + **Testing Library** — testy jednostkowe i integracyjne

## Wymagania

- Node.js 20+
- [pnpm](https://pnpm.io/)
- Docker + Docker Compose (do lokalnej bazy PostgreSQL)

## Szybki start

1. Zainstaluj zależności:

   ```bash
   pnpm install
   ```

2. Skopiuj plik ze zmiennymi środowiskowymi:

   ```bash
   cp .env.example .env
   ```

   Domyślne wartości pasują do serwisu bazy z `docker/docker-compose.yml`.

3. Uruchom PostgreSQL w Dockerze:

   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```

4. Zastosuj migracje i wypełnij bazę przykładowymi danymi:

   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

5. Uruchom serwer deweloperski:

   ```bash
   pnpm dev
   ```

   Aplikacja będzie dostępna pod [http://localhost:3000](http://localhost:3000), lista użytkowników pod [http://localhost:3000/users](http://localhost:3000/users).

## Dostępne skrypty

| Skrypt              | Opis                                      |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | uruchamia serwer deweloperski Next.js     |
| `pnpm build`        | buduje aplikację produkcyjnie             |
| `pnpm start`        | uruchamia zbudowaną aplikację             |
| `pnpm lint`         | uruchamia ESLint                          |
| `pnpm typecheck`    | sprawdza typy TypeScript (`tsc --noEmit`) |
| `pnpm format`       | formatuje kod Prettierem                  |
| `pnpm format:check` | sprawdza formatowanie bez zapisu          |
| `pnpm test`         | uruchamia testy (Vitest)                  |

## Testy

Testy jednostkowe i integracyjne znajdują się w `tests/unit/`. Testy warstwy danych (`tests/unit/lib/users.test.ts`) korzystają z **osobnej bazy PostgreSQL** (`users_app_test`, ta sama instancja co baza deweloperska) — nie mockują Prisma Client, tylko realnie sprawdzają zapytania SQL. Baza testowa musi być dostępna (kontener z `docker/docker-compose.yml` uruchomiony); migracje są aplikowane do niej automatycznie przy starcie testów.

```bash
pnpm test
```

## Struktura projektu

Pełny opis planowanej struktury katalogów znajduje się w [CLAUDE.md](./CLAUDE.md#struktura-katalogów-planowana). W skrócie:

- `src/app/` — strony i trasy Next.js App Router
- `src/components/` — komponenty współdzielone
- `src/lib/` — klient Prisma i logika dostępu do danych
- `prisma/` — schema, migracje, seed
- `docker/` — `docker-compose.yml` z lokalną bazą PostgreSQL
- `tests/unit/` — testy Vitest + Testing Library

## Status projektu

Postęp prac śledzony jest w [plan.md](./plan.md) jako lista etapów (milestone'ów) z checklistami zadań.
