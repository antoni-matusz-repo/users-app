import { execSync } from "node:child_process";

// Na Neonie migracje (DDL) powinny iść przez bezpośrednie połączenie, nie przez pooler
// (PgBouncer w trybie transaction nie wspiera niektórych operacji migracyjnych Prisma).
// Nazwa zmiennej zgodna z konwencją Neona (tak samo nazywa ją `neon env pull`).
// Lokalnie/CI, gdzie nie ma poolera, DATABASE_URL_UNPOOLED po prostu nie jest ustawione.
const databaseUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

execSync("pnpm exec prisma migrate deploy", {
  env: { ...process.env, DATABASE_URL: databaseUrl },
  stdio: "inherit",
});
