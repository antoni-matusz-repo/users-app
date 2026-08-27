// Better Auth podpisuje tokeny weryfikacyjne przez `jose`, które sprawdza
// `instanceof Uint8Array` względem natywnego Node.js — jsdom (domyślne
// środowisko testowe w tym projekcie) podstawia własny, inny obiekt
// Uint8Array/TextEncoder, więc podpis JWT wywala się w jsdom. Ten plik nie
// dotyka DOM, więc bezpiecznie wraca do zwykłego środowiska Node.
// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { createAuth } from "@/lib/auth";
import { registerUserWith } from "@/server/register";

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

describe("registerUserWith", () => {
  beforeEach(cleanDatabase);
  afterAll(async () => {
    await cleanDatabase();
    await testPrisma.$disconnect();
  });

  it("tworzy użytkownika z rolą user i kontem nieaktywnym do weryfikacji", async () => {
    const result = await registerUserWith(
      testAuth,
      formDataOf({
        firstName: "Alice",
        lastName: "Kowalska",
        email: "alice@example.com",
        password: "Haslo123!",
      }),
    );

    expect(result).toEqual({ success: true });
    const user = await testPrisma.user.findUniqueOrThrow({ where: { email: "alice@example.com" } });
    expect(user).toMatchObject({
      firstName: "Alice",
      lastName: "Kowalska",
      role: "user",
      emailVerified: false,
    });
  });

  it("zwraca błąd walidacji przy zbyt krótkim haśle i nie zakłada konta", async () => {
    const result = await registerUserWith(
      testAuth,
      formDataOf({
        firstName: "Alice",
        lastName: "Kowalska",
        email: "alice@example.com",
        password: "krotkie",
      }),
    );

    expect(result.fieldErrors?.password).toBe("Hasło musi mieć co najmniej 8 znaków.");
    expect(await testPrisma.user.count()).toBe(0);
  });

  it("zwraca błąd walidacji przy pustym imieniu i nie zakłada konta", async () => {
    const result = await registerUserWith(
      testAuth,
      formDataOf({
        firstName: "",
        lastName: "Kowalska",
        email: "alice@example.com",
        password: "Haslo123!",
      }),
    );

    expect(result.fieldErrors?.firstName).toBe("Imię jest wymagane.");
    expect(await testPrisma.user.count()).toBe(0);
  });

  it("dla zajętego emaila zwraca ten sam sukces co przy nowej rejestracji, nie tworzy duplikatu (ochrona przed email enumeration)", async () => {
    await registerUserWith(
      testAuth,
      formDataOf({
        firstName: "Alice",
        lastName: "Kowalska",
        email: "alice@example.com",
        password: "Haslo123!",
      }),
    );

    const result = await registerUserWith(
      testAuth,
      formDataOf({
        firstName: "Inna",
        lastName: "Alice",
        email: "alice@example.com",
        password: "Haslo123!",
      }),
    );

    // Przy requireEmailVerification: true Better Auth celowo nie ujawnia,
    // że email już istnieje — zwraca ten sam "sukces" co przy nowej
    // rejestracji, ale nie tworzy duplikatu ani nie nadpisuje istniejącego
    // konta (decyzja: zostajemy przy tym zachowaniu, patrz dyskusja w #7).
    expect(result).toEqual({ success: true });
    expect(await testPrisma.user.count()).toBe(1);
    const existing = await testPrisma.user.findUniqueOrThrow({
      where: { email: "alice@example.com" },
    });
    expect(existing.firstName).toBe("Alice");
  });

  it("odrzuca próbę wymuszenia roli admin bezpośrednio przez API, nie tworzy konta z rolą admin", async () => {
    // Nie przechodzi przez registerUserWith (nasza formData nigdy nie ma pola
    // role) — to test samego Better Auth: plugin admin deklaruje role z
    // input:false, więc pole jest odrzucane na poziomie walidacji requestu.
    // W praktyce Better Auth idzie o krok dalej niż samo zignorowanie —
    // rzuca błędem "role is not allowed to be set" i nie zakłada konta wcale.
    // Typ generowany przez Better Auth odrzuciłby "role" jako nieznaną
    // właściwość na etapie kompilacji — atakujący uderzający bezpośrednio
    // w /api/auth/sign-up/email nie ma takiego ograniczenia, więc test
    // musi symulować dokładnie ten (nietypowany) przypadek. `any` tu
    // celowe: obchodzimy typy, żeby przetestować realny, nietypowany request.
    await expect(
      testAuth.api.signUpEmail({
        body: {
          email: "haker@example.com",
          password: "Haslo123!",
          name: "Haker Test",
          firstName: "Haker",
          lastName: "Test",
          role: "admin",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      }),
    ).rejects.toThrow();

    const user = await testPrisma.user.findUnique({ where: { email: "haker@example.com" } });
    expect(user).toBeNull();
  });
});
