import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { createUserWith } from "@/server/users";

const adapter = new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL });
const testPrisma = new PrismaClient({ adapter });

function formDataOf(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

describe("createUserWith", () => {
  beforeEach(async () => {
    await testPrisma.user.deleteMany();
  });

  afterAll(async () => {
    await testPrisma.user.deleteMany();
    await testPrisma.$disconnect();
  });

  it("tworzy użytkownika przy poprawnych danych", async () => {
    const result = await createUserWith(
      testPrisma,
      formDataOf({ email: "alice@example.com", name: "Alice" }),
    );

    expect(result).toEqual({});
    const users = await testPrisma.user.findMany();
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({ email: "alice@example.com", name: "Alice" });
  });

  it("zwraca błąd walidacji przy niepoprawnym emailu i nie zapisuje rekordu", async () => {
    const result = await createUserWith(
      testPrisma,
      formDataOf({ email: "not-an-email", name: "Alice" }),
    );

    expect(result.fieldErrors?.email).toBe("Nieprawidłowy format emaila.");
    expect(await testPrisma.user.count()).toBe(0);
  });

  it("zwraca błąd walidacji przy pustej nazwie i nie zapisuje rekordu", async () => {
    const result = await createUserWith(
      testPrisma,
      formDataOf({ email: "alice@example.com", name: "" }),
    );

    expect(result.fieldErrors?.name).toBe("Nazwa jest wymagana.");
    expect(await testPrisma.user.count()).toBe(0);
  });

  it("zwraca czytelny błąd przy próbie dodania zajętego emaila, nie crashuje", async () => {
    await testPrisma.user.create({ data: { email: "alice@example.com", name: "Alice" } });

    const result = await createUserWith(
      testPrisma,
      formDataOf({ email: "alice@example.com", name: "Inna Alice" }),
    );

    expect(result.fieldErrors?.email).toBe("Ten email jest już zajęty.");
    expect(await testPrisma.user.count()).toBe(1);
  });
});
