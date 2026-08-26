import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { createUserWith, updateUserWith } from "@/server/users";

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

describe("updateUserWith", () => {
  beforeEach(async () => {
    await testPrisma.user.deleteMany();
  });

  afterAll(async () => {
    await testPrisma.user.deleteMany();
    await testPrisma.$disconnect();
  });

  it("aktualizuje użytkownika przy poprawnych danych", async () => {
    const user = await testPrisma.user.create({
      data: { email: "alice@example.com", name: "Alice" },
    });

    const result = await updateUserWith(
      testPrisma,
      user.id,
      formDataOf({ email: "alice.new@example.com", name: "Alice Nowak" }),
    );

    expect(result).toEqual({});
    const updated = await testPrisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(updated).toMatchObject({ email: "alice.new@example.com", name: "Alice Nowak" });
  });

  it("zwraca błąd walidacji przy niepoprawnym emailu i nie zapisuje zmian", async () => {
    const user = await testPrisma.user.create({
      data: { email: "alice@example.com", name: "Alice" },
    });

    const result = await updateUserWith(
      testPrisma,
      user.id,
      formDataOf({ email: "not-an-email", name: "Alice" }),
    );

    expect(result.fieldErrors?.email).toBe("Nieprawidłowy format emaila.");
    const unchanged = await testPrisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(unchanged.email).toBe("alice@example.com");
  });

  it("zwraca błąd walidacji przy pustej nazwie i nie zapisuje zmian", async () => {
    const user = await testPrisma.user.create({
      data: { email: "alice@example.com", name: "Alice" },
    });

    const result = await updateUserWith(
      testPrisma,
      user.id,
      formDataOf({ email: "alice@example.com", name: "" }),
    );

    expect(result.fieldErrors?.name).toBe("Nazwa jest wymagana.");
    const unchanged = await testPrisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(unchanged.name).toBe("Alice");
  });

  it("zwraca czytelny błąd przy próbie zmiany emaila na zajęty przez innego użytkownika", async () => {
    await testPrisma.user.create({ data: { email: "bob@example.com", name: "Bob" } });
    const alice = await testPrisma.user.create({
      data: { email: "alice@example.com", name: "Alice" },
    });

    const result = await updateUserWith(
      testPrisma,
      alice.id,
      formDataOf({ email: "bob@example.com", name: "Alice" }),
    );

    expect(result.fieldErrors?.email).toBe("Ten email jest już zajęty.");
    const unchanged = await testPrisma.user.findUniqueOrThrow({ where: { id: alice.id } });
    expect(unchanged.email).toBe("alice@example.com");
  });

  it("pozwala zapisać z niezmienionym (własnym) emailem bez fałszywego błędu", async () => {
    const user = await testPrisma.user.create({
      data: { email: "alice@example.com", name: "Alice" },
    });

    const result = await updateUserWith(
      testPrisma,
      user.id,
      formDataOf({ email: "alice@example.com", name: "Alice Nowak" }),
    );

    expect(result).toEqual({});
    const updated = await testPrisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(updated).toMatchObject({ email: "alice@example.com", name: "Alice Nowak" });
  });

  it("zwraca czytelny błąd przy próbie edycji nieistniejącego użytkownika, nie crashuje", async () => {
    const result = await updateUserWith(
      testPrisma,
      "nieistniejace-id",
      formDataOf({ email: "alice@example.com", name: "Alice" }),
    );

    expect(result.error).toBe("Ten użytkownik już nie istnieje (mógł zostać usunięty).");
  });
});
