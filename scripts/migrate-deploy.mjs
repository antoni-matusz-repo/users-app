import { execSync } from "node:child_process";

// Na Neonie migracje (DDL) powinny iść przez bezpośrednie połączenie, nie przez pooler
// (PgBouncer w trybie transaction nie wspiera niektórych operacji migracyjnych Prisma).
// Lokalnie/CI, gdzie nie ma poolera, DIRECT_DATABASE_URL po prostu nie jest ustawione.
const databaseUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

execSync("pnpm exec prisma migrate deploy", {
  env: { ...process.env, DATABASE_URL: databaseUrl },
  stdio: "inherit",
});
