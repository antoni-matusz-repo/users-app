# Scaffolding: Next.js + TypeScript + ESLint + pnpm

## Co i po co

Potrzebujemy podstawowego szkieletu aplikacji, na którym będziemy budować kolejne etapy (baza danych, model danych, feature'y). Zgodnie z [CLAUDE.md](../../CLAUDE.md) stack to Next.js (App Router) + React + TypeScript, zarządzany przez pnpm, z wymuszonym stylem kodu (ESLint + Prettier) i trybem `strict` w TypeScript.

Celem tego etapu jest wyłącznie scaffolding — bez logiki biznesowej, bazy danych czy feature'ów. Efekt: projekt, który da się uruchomić lokalnie (`pnpm dev`), zlintować i sprawdzić typami, z uporządkowaną strukturą katalogów gotową pod kolejne etapy.

Referencja: etap 1 z [plan.md](../../plan.md).

## Kryteria akceptacji

- [ ] Projekt zainicjowany przez `create-next-app` (App Router, TypeScript), zależności zainstalowane przez pnpm
- [ ] `tsconfig.json` ma włączony tryb `strict`
- [ ] ESLint skonfigurowany (flat config, `eslint.config.mjs`) z regułami Next.js
- [ ] Prettier skonfigurowany i zintegrowany z ESLint (brak konfliktujących reguł)
- [ ] `package.json` zawiera skrypty: `dev`, `build`, `start`, `lint`, `format`, `typecheck`
- [ ] Struktura katalogów `src/` odpowiada strukturze zaplanowanej w [CLAUDE.md](../../CLAUDE.md)
- [ ] `pnpm dev` uruchamia aplikację lokalnie bez błędów
- [ ] `pnpm lint` i `pnpm typecheck` przechodzą bez błędów
- [ ] Zmiany zacommitowane w konwencji Conventional Commits (`chore: scaffold Next.js project with TypeScript, ESLint, Prettier`)
