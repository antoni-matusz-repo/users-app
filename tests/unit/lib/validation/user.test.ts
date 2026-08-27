import { describe, expect, it } from "vitest";
import { userSchema } from "@/lib/validation/user";

describe("userSchema", () => {
  it("akceptuje poprawne dane i przycina białe znaki", () => {
    const result = userSchema.safeParse({
      email: "  alice@example.com  ",
      firstName: "  Alice  ",
      lastName: "  Kowalska  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        email: "alice@example.com",
        firstName: "Alice",
        lastName: "Kowalska",
      });
    }
  });

  it("odrzuca nieprawidłowy format emaila", () => {
    const result = userSchema.safeParse({
      email: "not-an-email",
      firstName: "Alice",
      lastName: "Kowalska",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toBe("Nieprawidłowy format emaila.");
    }
  });

  it("odrzuca pusty email", () => {
    const result = userSchema.safeParse({ email: "", firstName: "Alice", lastName: "Kowalska" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toBe("Email jest wymagany.");
    }
  });

  it("odrzuca puste (lub samo białoznakowe) imię", () => {
    const result = userSchema.safeParse({
      email: "alice@example.com",
      firstName: "   ",
      lastName: "Kowalska",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.firstName?.[0]).toBe("Imię jest wymagane.");
    }
  });

  it("odrzuca puste (lub samo białoznakowe) nazwisko", () => {
    const result = userSchema.safeParse({
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "   ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.lastName?.[0]).toBe("Nazwisko jest wymagane.");
    }
  });
});
