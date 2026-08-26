# plan.md

Plan realizacji projektu `users-app`, rozbity na etapy (milestone'y). Zgodnie z [CLAUDE.md](./CLAUDE.md): małe commity w konwencji Conventional Commits, każdy etap = jeden lub kilka logicznych commitów z opisem co i dlaczego.

## 1. Scaffolding (Next.js + TS + ESLint + pnpm)

- [x] Zainicjować projekt Next.js (App Router, TypeScript) przez `create-next-app` z użyciem pnpm
- [x] Skonfigurować `tsconfig.json` w trybie `strict`
- [x] Skonfigurować ESLint (flat config, `eslint.config.mjs`) zgodnie z regułami Next.js
- [x] Skonfigurować Prettier + integrację z ESLint (brak konfliktów reguł)
- [x] Dodać skrypty w `package.json`: `dev`, `build`, `start`, `lint`, `format`, `typecheck`
- [x] Uporządkować strukturę katalogów `src/` zgodnie z CLAUDE.md
- [x] Commit: `feat: scaffold next.js app`

## 2. Baza danych (Prisma + PostgreSQL, docker-compose do lokalnego dev)

- [x] Dodać `docker/docker-compose.yml` z serwisem PostgreSQL (wolumen, port, dane dostępowe)
- [x] Utworzyć `.env.example` z `DATABASE_URL` wskazującym na lokalny kontener
- [x] Zainstalować Prisma (`prisma`, `@prisma/client`)
- [x] Zainicjować Prisma (`prisma init`) i podpiąć `DATABASE_URL`
- [x] Skonfigurować klienta Prisma jako singleton w `src/lib/prisma.ts` (unikanie wielu instancji w dev)
- [x] Zweryfikować połączenie z bazą (np. prostym skryptem lub `prisma db pull`/`prisma studio`)
- [x] Commit: `feat: add postgres, prisma schema, migration and seed`

## 3. Model danych + migracje + seed (encja User: id, email, name, createdAt)

- [x] Zdefiniować model `User` w `prisma/schema.prisma` (`id`, `email` unikalny, `name`, `createdAt`)
- [x] Wygenerować pierwszą migrację (`prisma migrate dev`)
- [x] Napisać skrypt seed (`prisma/seed.ts`) tworzący przykładowych użytkowników
- [x] Podpiąć seed w konfiguracji Prisma (finalnie `migrations.seed` w `prisma.config.ts` — `package.json` → `prisma.seed` jest ignorowane przez Prisma 7, gdy istnieje `prisma.config.ts`)
- [x] Zweryfikować dane w bazie (Prisma Studio lub zapytanie testowe)
- [x] Commit: `feat: add postgres, prisma schema, migration and seed`

## 4. Feature: lista użytkowników (strona /users, server component, fetch z Prisma)

- [x] Utworzyć trasę `src/app/users/page.tsx` jako Server Component
- [x] Pobrać listę użytkowników bezpośrednio przez Prisma Client (bez dodatkowego route handlera, chyba że potrzebny do innych celów)
- [x] Wyrenderować listę (tabela lub lista) z podstawowym stylowaniem
- [x] Obsłużyć stan pusty (brak użytkowników w bazie)
- [x] Commit: `feat: add users list page`

## 5. Testy (unit + integracyjne na warstwie danych)

- [x] Skonfigurować Vitest + Testing Library w projekcie
- [ ] Dodać testy jednostkowe dla czystych funkcji/utils (jeśli takie powstaną) — nie dotyczy: nie powstały osobne czyste funkcje utils; `getUsers()` jest pokryte testem integracyjnym, `UsersTable` testem komponentu
- [x] Dodać osobną bazę/schemat testowy w tym samym `docker-compose.yml` (oddzielony od bazy dev) i osobny `DATABASE_URL` dla testów
- [x] Dodać testy integracyjne warstwy danych (operacje Prisma na testowej bazie/schemacie), z czyszczeniem danych między testami
- [x] Dodać skrypt `test` w `package.json`
- [x] Commit: `test: add tests for users list`

## 6. CI (GitHub Actions: lint, typecheck, testy)

- [x] Dodać workflow `.github/workflows/ci.yml`
- [x] Krok: instalacja zależności przez pnpm (z cache)
- [x] Krok: `pnpm lint`
- [x] Krok: `pnpm typecheck`
- [x] Krok: `pnpm test` (z bazą PostgreSQL jako serwis w CI, odzwierciedlającą testowy schemat z etapu 5)
- [x] Zweryfikować, że pipeline przechodzi na pustym/przykładowym PR — zweryfikowane na pushach do `main`; po drodze wykryty i naprawiony realny bug (`tsc --noEmit` failował bez wcześniejszego `next typegen`, zob. commit `fix: generate Next.js route types before typecheck`)
- [x] Commit: `ci: add github actions pipeline`

## 7. Repozytorium GitHub (push, README)

- [x] Utworzyć publiczne repozytorium `users-app` na GitHub
- [x] Dodać remote i wypchnąć historię (`git push`)
- [x] Napisać `README.md`: opis projektu, wymagania, instrukcja uruchomienia lokalnego (docker-compose, migracje, seed, dev server)
- [x] Commit: `docs: add README with setup instructions`

## 8. Produkcja (deploy na Vercel + hostowany Postgres, np. Neon)

- [x] Założyć bazę na Neon
- [x] Uruchomić migracje na bazie produkcyjnej (`prisma migrate deploy`)
- [x] Podpiąć repozytorium do Vercel, skonfigurować zmienne środowiskowe (`DATABASE_URL` z Neon)
- [x] Zweryfikować build i działanie aplikacji na środowisku produkcyjnym — https://users-app-gamma-seven.vercel.app/users pokazuje zaseedowane dane
- [x] Commit: `docs: add deployment notes` (finalnie: sekcja „Produkcja" w `CLAUDE.md`, commit `docs: record production deployment details in CLAUDE.md`)
