// Ten sam powód co w session.test.ts — Better Auth podpisuje tokeny przez
// `jose`, które koliduje z Uint8Array/TextEncoder podstawianym przez jsdom.
// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { createAuth } from "@/lib/auth";
import { guardProtectedRouteWith } from "@/server/routeProtection";

const adapter = new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL });
const testPrisma = new PrismaClient({ adapter });
const testAuth = createAuth(testPrisma);

const PASSWORD = "Haslo123!";

async function cleanDatabase() {
  await testPrisma.verification.deleteMany();
  await testPrisma.session.deleteMany();
  await testPrisma.account.deleteMany();
  await testPrisma.user.deleteMany();
}

async function createUserWithRole(email: string, role: "admin" | "user") {
  await testAuth.api.createUser({
    body: {
      email,
      password: PASSWORD,
      name: "Test User",
      role,
      data: { firstName: "Test", lastName: "User" },
    },
  });
  await testPrisma.user.update({ where: { email }, data: { emailVerified: true } });
}

async function sessionHeadersFor(email: string) {
  const { headers } = await testAuth.api.signInEmail({
    body: { email, password: PASSWORD },
    headers: new Headers(),
    returnHeaders: true,
  });
  const setCookie = headers.get("set-cookie");
  if (!setCookie) throw new Error("Brak Set-Cookie w odpowiedzi signInEmail");
  return new Headers({ cookie: setCookie.split(";")[0] });
}

describe("guardProtectedRouteWith", () => {
  beforeEach(cleanDatabase);
  afterAll(async () => {
    await cleanDatabase();
    await testPrisma.$disconnect();
  });

  it("przepuszcza trasy niechronione bez sprawdzania sesji", async () => {
    expect(await guardProtectedRouteWith(testAuth, new Headers(), "/")).toEqual({
      type: "allow",
    });
  });

  it("przekierowuje niezalogowanego z /users do /login", async () => {
    expect(await guardProtectedRouteWith(testAuth, new Headers(), "/users")).toEqual({
      type: "redirect",
      url: "/login",
    });
  });

  it("przekierowuje niezalogowanego z /dashboard do /login", async () => {
    expect(await guardProtectedRouteWith(testAuth, new Headers(), "/dashboard")).toEqual({
      type: "redirect",
      url: "/login",
    });
  });

  it("wpuszcza admina na /users i jego podstrony", async () => {
    await createUserWithRole("admin@example.com", "admin");
    const headers = await sessionHeadersFor("admin@example.com");

    expect(await guardProtectedRouteWith(testAuth, headers, "/users")).toEqual({
      type: "allow",
    });
    expect(await guardProtectedRouteWith(testAuth, headers, "/users/new")).toEqual({
      type: "allow",
    });
    expect(await guardProtectedRouteWith(testAuth, headers, "/users/abc123/edit")).toEqual({
      type: "allow",
    });
  });

  it("przekierowuje zwykłego usera z /users na /dashboard z komunikatem", async () => {
    await createUserWithRole("user@example.com", "user");
    const headers = await sessionHeadersFor("user@example.com");

    expect(await guardProtectedRouteWith(testAuth, headers, "/users")).toEqual({
      type: "redirect",
      url: "/dashboard?forbidden=1",
    });
  });

  it("wpuszcza usera na /dashboard", async () => {
    await createUserWithRole("user@example.com", "user");
    const headers = await sessionHeadersFor("user@example.com");

    expect(await guardProtectedRouteWith(testAuth, headers, "/dashboard")).toEqual({
      type: "allow",
    });
  });

  it("przekierowuje admina z /dashboard na /users z komunikatem", async () => {
    await createUserWithRole("admin@example.com", "admin");
    const headers = await sessionHeadersFor("admin@example.com");

    expect(await guardProtectedRouteWith(testAuth, headers, "/dashboard")).toEqual({
      type: "redirect",
      url: "/users?forbidden=1",
    });
  });
});
