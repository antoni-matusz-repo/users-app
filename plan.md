# plan.md

Plan realizacji projektu `users-app`, rozbity na etapy (milestone'y). Zgodnie z [CLAUDE.md](./CLAUDE.md): małe commity w konwencji Conventional Commits, każdy etap = jeden lub kilka logicznych commitów z opisem co i dlaczego.

## 1. Scaffolding (Next.js + TS + ESLint + pnpm)

- [ ] Zainicjować projekt Next.js (App Router, TypeScript) przez `create-next-app` z użyciem pnpm
- [ ] Skonfigurować `tsconfig.json` w trybie `strict`
- [ ] Skonfigurować ESLint (flat config, `eslint.config.mjs`) zgodnie z regułami Next.js
- [ ] Skonfigurować Prettier + integrację z ESLint (brak konfliktów reguł)
- [ ] Dodać skrypty w `package.json`: `dev`, `build`, `start`, `lint`, `format`, `typecheck`
- [ ] Uporządkować strukturę katalogów `src/` zgodnie z CLAUDE.md
- [ ] Commit: `chore: scaffold Next.js project with TypeScript, ESLint, Prettier`

## 2. Baza danych (Prisma + PostgreSQL, docker-compose do lokalnego dev)

- [ ] Dodać `docker/docker-compose.yml` z serwisem PostgreSQL (wolumen, port, dane dostępowe)
- [ ] Utworzyć `.env.example` z `DATABASE_URL` wskazującym na lokalny kontener
- [ ] Zainstalować Prisma (`prisma`, `@prisma/client`)
- [ ] Zainicjować Prisma (`prisma init`) i podpiąć `DATABASE_URL`
- [ ] Skonfigurować klienta Prisma jako singleton w `src/lib/prisma.ts` (unikanie wielu instancji w dev)
- [ ] Zweryfikować połączenie z bazą (np. prostym skryptem lub `prisma db pull`/`prisma studio`)
- [ ] Commit: `chore: add PostgreSQL via docker-compose and Prisma setup`

## 3. Model danych + migracje + seed (encja User: id, email, name, createdAt)

- [ ] Zdefiniować model `User` w `prisma/schema.prisma` (`id`, `email` unikalny, `name`, `createdAt`)
- [ ] Wygenerować pierwszą migrację (`prisma migrate dev`)
- [ ] Napisać skrypt seed (`prisma/seed.ts`) tworzący przykładowych użytkowników
- [ ] Podpiąć seed w konfiguracji Prisma (`package.json` → `prisma.seed`)
- [ ] Zweryfikować dane w bazie (Prisma Studio lub zapytanie testowe)
- [ ] Commit: `feat: add User model with migration and seed script`

## 4. Feature: lista użytkowników (strona /users, server component, fetch z Prisma)

- [ ] Utworzyć trasę `src/app/users/page.tsx` jako Server Component
- [ ] Pobrać listę użytkowników bezpośrednio przez Prisma Client (bez dodatkowego route handlera, chyba że potrzebny do innych celów)
- [ ] Wyrenderować listę (tabela lub lista) z podstawowym stylowaniem
- [ ] Obsłużyć stan pusty (brak użytkowników w bazie)
- [ ] Commit: `feat: add /users page listing users from database`

## 5. Testy (unit + integracyjne na warstwie danych)

- [ ] Skonfigurować Vitest + Testing Library w projekcie
- [ ] Dodać testy jednostkowe dla czystych funkcji/utils (jeśli takie powstaną)
- [ ] Dodać osobną bazę/schemat testowy w tym samym `docker-compose.yml` (oddzielony od bazy dev) i osobny `DATABASE_URL` dla testów
- [ ] Dodać testy integracyjne warstwy danych (operacje Prisma na testowej bazie/schemacie), z czyszczeniem danych między testami
- [ ] Dodać skrypt `test` w `package.json`
- [ ] Commit: `test: add unit and integration tests for data layer`

## 6. CI (GitHub Actions: lint, typecheck, testy)

- [ ] Dodać workflow `.github/workflows/ci.yml`
- [ ] Krok: instalacja zależności przez pnpm (z cache)
- [ ] Krok: `pnpm lint`
- [ ] Krok: `pnpm typecheck`
- [ ] Krok: `pnpm test` (z bazą PostgreSQL jako serwis w CI, odzwierciedlającą testowy schemat z etapu 5)
- [ ] Zweryfikować, że pipeline przechodzi na pustym/przykładowym PR
- [ ] Commit: `ci: add GitHub Actions workflow for lint, typecheck and tests`

## 7. Repozytorium GitHub (push, README)

- [ ] Utworzyć publiczne repozytorium `users-app` na GitHub
- [ ] Dodać remote i wypchnąć historię (`git push`)
- [ ] Napisać `README.md`: opis projektu, wymagania, instrukcja uruchomienia lokalnego (docker-compose, migracje, seed, dev server)
- [ ] Commit: `docs: add README with setup instructions`

## 8. Produkcja (deploy na Vercel + hostowany Postgres, np. Neon)

- [ ] Założyć bazę na Neon
- [ ] Uruchomić migracje na bazie produkcyjnej (`prisma migrate deploy`)
- [ ] Podpiąć repozytorium do Vercel, skonfigurować zmienne środowiskowe (`DATABASE_URL` z Neon)
- [ ] Zweryfikować build i działanie aplikacji na środowisku produkcyjnym
- [ ] Commit: `docs: add deployment notes` (jeśli potrzebny wpis w README/plan)
