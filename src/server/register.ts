"use server";

import { auth } from "@/lib/auth";
import { registerSchema, type RegisterActionState } from "@/lib/validation/register";

type AuthInstance = Pick<typeof auth, "api">;

export async function registerUserWith(
  authInstance: AuthInstance,
  formData: FormData,
): Promise<RegisterActionState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  try {
    // Rola nie jest tu w ogóle przekazywana — nowe konto zawsze dostaje
    // domyślną rolę "user" (a nawet gdyby ktoś ją podał, admin plugin
    // deklaruje pole role z input:false, więc Better Auth by ją odrzuciło).
    //
    // Przy requireEmailVerification: true (z #6) Better Auth celowo NIE
    // rozróżnia "nowa rejestracja" od "email już zajęty" — w obu
    // przypadkach signUpEmail kończy się sukcesem bez wyjątku (ochrona
    // przed email enumeration, decyzja świadoma, patrz dyskusja w #7).
    // Dlatego nie ma tu żadnej gałęzi łapiącej duplikat email — nie ma
    // czego łapać, zwracamy ten sam sukces niezależnie od tego, czy konto
    // istniało wcześniej.
    await authInstance.api.signUpEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        name: `${parsed.data.firstName} ${parsed.data.lastName}`,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        callbackURL: "/login",
      },
    });
  } catch (error) {
    console.error("Rejestracja nie powiodła się:", error);
    return { error: "Nie udało się zarejestrować konta. Spróbuj ponownie." };
  }

  return { success: true };
}

export async function registerUser(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  return registerUserWith(auth, formData);
}
