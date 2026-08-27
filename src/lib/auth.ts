import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import type { PrismaClient } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// Fabryka zamiast gotowej instancji, żeby testy integracyjne mogły podać
// klienta Prisma spięty z testową bazą (ten sam wzorzec co getUsers/createUserWith).
export function createAuth(prismaClient: PrismaClient) {
  return betterAuth({
    database: prismaAdapter(prismaClient, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Potwierdź swój adres email",
          html: `<p>Cześć ${user.name},</p><p>Kliknij, żeby potwierdzić adres email i aktywować konto:</p><p><a href="${url}">${url}</a></p>`,
        });
      },
    },
    user: {
      additionalFields: {
        firstName: { type: "string", required: true },
        lastName: { type: "string", required: true },
      },
    },
    plugins: [
      admin(),
      // Musi być ostatnim pluginem w tablicy (wymóg Better Auth) — pozwala
      // Server Actions ustawiać ciasteczko sesji przez next/headers.
      nextCookies(),
    ],
  });
}

export const auth = createAuth(prisma);
