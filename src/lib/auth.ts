import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    // Realna wysyłka (Postmark na produkcji, Mailpit w dev) to zakres
    // issue #7 — tu tylko fundament configu, żeby rejestracja miała się
    // czym w ogóle wywołać.
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`[auth] Link weryfikacyjny dla ${user.email}: ${url}`);
    },
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
    },
  },
  plugins: [admin()],
});
