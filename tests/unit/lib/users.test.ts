import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getUsers } from "@/lib/users";

const adapter = new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL });
const testPrisma = new PrismaClient({ adapter });

describe("getUsers", () => {
  beforeEach(async () => {
    await testPrisma.user.deleteMany();
  });

  afterAll(async () => {
    await testPrisma.user.deleteMany();
    await testPrisma.$disconnect();
  });

  it("zwraca użytkowników posortowanych malejąco po createdAt", async () => {
    await testPrisma.user.create({
      data: {
        email: "old@example.com",
        name: "Old User",
        createdAt: new Date("2026-01-01T00:00:00Z"),
      },
    });
    await testPrisma.user.create({
      data: {
        email: "new@example.com",
        name: "New User",
        createdAt: new Date("2026-06-01T00:00:00Z"),
      },
    });

    const users = await getUsers(testPrisma);

    expect(users.map((user) => user.email)).toEqual(["new@example.com", "old@example.com"]);
  });

  it("zwraca pustą listę, gdy w bazie nie ma użytkowników", async () => {
    const users = await getUsers(testPrisma);

    expect(users).toEqual([]);
  });
});
