import { execSync } from "node:child_process";

export default function setup() {
  execSync("pnpm exec prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    stdio: "inherit",
  });
}
