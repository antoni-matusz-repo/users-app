import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { createUserWith, deleteUserWith, updateUserWith } from "@/server/users";

const adapter = new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL });
const testPrisma = new PrismaClient({ adapter });

function formDataOf(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

function rawUser(overrides: { email: string; firstName?: string; lastName?: string }) {
  const firstName = overrides.firstName ?? "Alice";
  const lastName = overrides.lastName ?? "Kowalska";
  return { email: overrides.email, firstName, lastName, name: `${firstName} ${lastName}` };
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
      formDataOf({ email: "alice@example.com", firstName: "Alice", lastName: "Kowalska" }),
    );

    expect(result).toEqual({});
    const users = await testPrisma.user.findMany();
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Kowalska",
    });
  });

  it("zwraca błąd walidacji przy niepoprawnym emailu i nie zapisuje rekordu", async () => {
    const result = await createUserWith(
      testPrisma,
      formDataOf({ email: "not-an-email", firstName: "Alice", lastName: "Kowalska" }),
    );

    expect(result.fieldErrors?.email).toBe("Nieprawidłowy format emaila.");
    expect(await testPrisma.user.count()).toBe(0);
  });

  it("zwraca błąd walidacji przy pustym imieniu i nie zapisuje rekordu", async () => {
    const result = await createUserWith(
      testPrisma,
      formDataOf({ email: "alice@example.com", firstName: "", lastName: "Kowalska" }),
    );

    expect(result.fieldErrors?.firstName).toBe("Imię jest wymagane.");
    expect(await testPrisma.user.count()).toBe(0);
  });

  it("zwraca czytelny błąd przy próbie dodania zajętego emaila, nie crashuje", async () => {
    await testPrisma.user.create({ data: rawUser({ email: "alice@example.com" }) });

    const result = await createUserWith(
      testPrisma,
      formDataOf({ email: "alice@example.com", firstName: "Inna", lastName: "Alice" }),
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
    const user = await testPrisma.user.create({ data: rawUser({ email: "alice@example.com" }) });

    const result = await updateUserWith(
      testPrisma,
      user.id,
      formDataOf({ email: "alice.new@example.com", firstName: "Alice", lastName: "Nowak" }),
    );

    expect(result).toEqual({});
    const updated = await testPrisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(updated).toMatchObject({
      email: "alice.new@example.com",
      firstName: "Alice",
      lastName: "Nowak",
    });
  });

  it("zwraca błąd walidacji przy niepoprawnym emailu i nie zapisuje zmian", async () => {
    const user = await testPrisma.user.create({ data: rawUser({ email: "alice@example.com" }) });

    const result = await updateUserWith(
      testPrisma,
      user.id,
      formDataOf({ email: "not-an-email", firstName: "Alice", lastName: "Kowalska" }),
    );

    expect(result.fieldErrors?.email).toBe("Nieprawidłowy format emaila.");
    const unchanged = await testPrisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(unchanged.email).toBe("alice@example.com");
  });

  it("zwraca błąd walidacji przy pustym nazwisku i nie zapisuje zmian", async () => {
    const user = await testPrisma.user.create({ data: rawUser({ email: "alice@example.com" }) });

    const result = await updateUserWith(
      testPrisma,
      user.id,
      formDataOf({ email: "alice@example.com", firstName: "Alice", lastName: "" }),
    );

    expect(result.fieldErrors?.lastName).toBe("Nazwisko jest wymagane.");
    const unchanged = await testPrisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(unchanged.lastName).toBe("Kowalska");
  });

  it("zwraca czytelny błąd przy próbie zmiany emaila na zajęty przez innego użytkownika", async () => {
    await testPrisma.user.create({
      data: rawUser({ email: "bob@example.com", firstName: "Bob", lastName: "Nowak" }),
    });
    const alice = await testPrisma.user.create({
      data: rawUser({ email: "alice@example.com" }),
    });

    const result = await updateUserWith(
      testPrisma,
      alice.id,
      formDataOf({ email: "bob@example.com", firstName: "Alice", lastName: "Kowalska" }),
    );

    expect(result.fieldErrors?.email).toBe("Ten email jest już zajęty.");
    const unchanged = await testPrisma.user.findUniqueOrThrow({ where: { id: alice.id } });
    expect(unchanged.email).toBe("alice@example.com");
  });

  it("pozwala zapisać z niezmienionym (własnym) emailem bez fałszywego błędu", async () => {
    const user = await testPrisma.user.create({ data: rawUser({ email: "alice@example.com" }) });

    const result = await updateUserWith(
      testPrisma,
      user.id,
      formDataOf({ email: "alice@example.com", firstName: "Alice", lastName: "Nowak" }),
    );

    expect(result).toEqual({});
    const updated = await testPrisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(updated).toMatchObject({ email: "alice@example.com", lastName: "Nowak" });
  });

  it("zwraca czytelny błąd przy próbie edycji nieistniejącego użytkownika, nie crashuje", async () => {
    const result = await updateUserWith(
      testPrisma,
      "nieistniejace-id",
      formDataOf({ email: "alice@example.com", firstName: "Alice", lastName: "Kowalska" }),
    );

    expect(result.error).toBe("Ten użytkownik już nie istnieje (mógł zostać usunięty).");
  });
});

describe("deleteUserWith", () => {
  beforeEach(async () => {
    await testPrisma.user.deleteMany();
  });

  afterAll(async () => {
    await testPrisma.user.deleteMany();
    await testPrisma.$disconnect();
  });

  it("usuwa istniejącego użytkownika", async () => {
    const user = await testPrisma.user.create({ data: rawUser({ email: "alice@example.com" }) });

    const result = await deleteUserWith(testPrisma, user.id);

    expect(result).toEqual({});
    expect(await testPrisma.user.count()).toBe(0);
  });

  it("zwraca czytelny błąd przy próbie usunięcia już nieistniejącego użytkownika, nie crashuje", async () => {
    const result = await deleteUserWith(testPrisma, "nieistniejace-id");

    expect(result.error).toBe("Ten użytkownik już nie istnieje (mógł zostać usunięty wcześniej).");
  });

  it("nie rusza innych rekordów przy usuwaniu jednego użytkownika", async () => {
    const alice = await testPrisma.user.create({ data: rawUser({ email: "alice@example.com" }) });
    await testPrisma.user.create({
      data: rawUser({ email: "bob@example.com", firstName: "Bob", lastName: "Nowak" }),
    });

    await deleteUserWith(testPrisma, alice.id);

    const remaining = await testPrisma.user.findMany();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].email).toBe("bob@example.com");
  });
});
