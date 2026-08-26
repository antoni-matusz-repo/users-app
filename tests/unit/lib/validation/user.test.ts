import { describe, expect, it } from "vitest";
import { userSchema } from "@/lib/validation/user";

describe("userSchema", () => {
  it("akceptuje poprawne dane i przycina białe znaki", () => {
    const result = userSchema.safeParse({
      email: "  alice@example.com  ",
      name: "  Alice  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ email: "alice@example.com", name: "Alice" });
    }
  });

  it("odrzuca nieprawidłowy format emaila", () => {
    const result = userSchema.safeParse({ email: "not-an-email", name: "Alice" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toBe("Nieprawidłowy format emaila.");
    }
  });

  it("odrzuca pusty email", () => {
    const result = userSchema.safeParse({ email: "", name: "Alice" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toBe("Email jest wymagany.");
    }
  });

  it("odrzuca pustą (lub samą białoznakową) nazwę", () => {
    const result = userSchema.safeParse({ email: "alice@example.com", name: "   " });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name?.[0]).toBe("Nazwa jest wymagana.");
    }
  });
});
