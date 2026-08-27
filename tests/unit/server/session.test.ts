// Better Auth podpisuje tokeny przez `jose`, które sprawdza `instanceof
// Uint8Array` względem natywnego Node.js — jsdom (domyślne środowisko
// testowe w tym projekcie) podstawia własny obiekt Uint8Array/TextEncoder,
// więc wywala podpis. Ten plik nie dotyka DOM, więc wraca do Node
// (ten sam problem i to samo rozwiązanie co w register.test.ts).
// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { createAuth } from "@/lib/auth";
import { loginUserWith, logoutUserWith } from "@/server/session";

const adapter = new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL });
const testPrisma = new PrismaClient({ adapter });
const testAuth = createAuth(testPrisma);

function formDataOf(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

async function cleanDatabase() {
  await testPrisma.verification.deleteMany();
  await testPrisma.session.deleteMany();
  await testPrisma.account.deleteMany();
  await testPrisma.user.deleteMany();
}

async function createVerifiedUser(email: string, password: string) {
  await testAuth.api.signUpEmail({
    body: { email, password, name: "Test User", firstName: "Test", lastName: "User" },
  });
  await testPrisma.user.update({ where: { email }, data: { emailVerified: true } });
}

describe("loginUserWith", () => {
  beforeEach(cleanDatabase);
  afterAll(async () => {
    await cleanDatabase();
    await testPrisma.$disconnect();
  });

  it("loguje użytkownika ze zweryfikowanym emailem, zapisuje sesję w bazie", async () => {
    await createVerifiedUser("alice@example.com", "Haslo123!");

    const result = await loginUserWith(
      testAuth,
      new Headers(),
      formDataOf({ email: "alice@example.com", password: "Haslo123!" }),
    );

    expect(result).toEqual({});
    expect(await testPrisma.session.count()).toBe(1);
  });

  it("odrzuca logowanie na niezweryfikowany email, nie zakłada sesji", async () => {
    await testAuth.api.signUpEmail({
      body: {
        email: "niezweryfikowany@example.com",
        password: "Haslo123!",
        name: "Test User",
        firstName: "Test",
        lastName: "User",
      },
    });

    const result = await loginUserWith(
      testAuth,
      new Headers(),
      formDataOf({ email: "niezweryfikowany@example.com", password: "Haslo123!" }),
    );

    expect(result.error).toBe(
      "Potwierdź adres email, zanim się zalogujesz — sprawdź swoją skrzynkę.",
    );
    expect(await testPrisma.session.count()).toBe(0);
  });

  it("zwraca ten sam ogólny błąd dla złego hasła (nie ujawnia którego pola)", async () => {
    await createVerifiedUser("alice@example.com", "Haslo123!");

    const result = await loginUserWith(
      testAuth,
      new Headers(),
      formDataOf({ email: "alice@example.com", password: "zlehaslo123" }),
    );

    expect(result.error).toBe("Nieprawidłowy email lub hasło.");
    expect(await testPrisma.session.count()).toBe(0);
  });

  it("zwraca ten sam ogólny błąd dla nieistniejącego emaila (nie ujawnia którego pola)", async () => {
    const result = await loginUserWith(
      testAuth,
      new Headers(),
      formDataOf({ email: "nieistnieje@example.com", password: "Haslo123!" }),
    );

    expect(result.error).toBe("Nieprawidłowy email lub hasło.");
    expect(await testPrisma.session.count()).toBe(0);
  });

  it("zwraca błąd walidacji przy pustym haśle i nie próbuje logować", async () => {
    const result = await loginUserWith(
      testAuth,
      new Headers(),
      formDataOf({ email: "alice@example.com", password: "" }),
    );

    expect(result.fieldErrors?.password).toBe("Hasło jest wymagane.");
  });
});

describe("logoutUserWith", () => {
  beforeEach(cleanDatabase);
  afterAll(async () => {
    await cleanDatabase();
    await testPrisma.$disconnect();
  });

  it("kończy sesję po zalogowaniu", async () => {
    await createVerifiedUser("alice@example.com", "Haslo123!");

    // signOut czyta token sesji z podpisanego ciasteczka (HMAC), więc nie
    // da się go po prostu złożyć ręcznie z surowego tokenu z bazy — trzeba
    // użyć prawdziwego `Set-Cookie` zwróconego przez signInEmail.
    const { headers: signInHeaders } = await testAuth.api.signInEmail({
      body: { email: "alice@example.com", password: "Haslo123!" },
      headers: new Headers(),
      returnHeaders: true,
    });
    expect(await testPrisma.session.count()).toBe(1);

    const setCookie = signInHeaders.get("set-cookie");
    if (!setCookie) throw new Error("Brak Set-Cookie w odpowiedzi signInEmail");
    const requestHeaders = new Headers({ cookie: setCookie.split(";")[0] });

    await logoutUserWith(testAuth, requestHeaders);

    expect(await testPrisma.session.count()).toBe(0);
  });
});
