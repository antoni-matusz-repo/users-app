"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth";
import { auth } from "@/lib/auth";
import { loginSchema, type LoginActionState } from "@/lib/validation/login";

type AuthInstance = Pick<typeof auth, "api">;

export async function loginUserWith(
  authInstance: AuthInstance,
  requestHeaders: Headers,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  try {
    await authInstance.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
      headers: requestHeaders,
    });
  } catch (error) {
    if (error instanceof APIError && error.body?.code === "EMAIL_NOT_VERIFIED") {
      return { error: "Potwierdź adres email, zanim się zalogujesz — sprawdź swoją skrzynkę." };
    }
    if (error instanceof APIError && error.body?.code === "INVALID_EMAIL_OR_PASSWORD") {
      // Celowo ten sam, ogólny komunikat dla złego emaila i złego hasła —
      // nie ujawniamy, które pole jest niepoprawne (to samo, co robi
      // Better Auth po swojej stronie: stały czas odpowiedzi, jeden kod
      // błędu niezależnie od przyczyny).
      return { error: "Nieprawidłowy email lub hasło." };
    }
    console.error("Logowanie nie powiodło się:", error);
    return { error: "Nie udało się zalogować. Spróbuj ponownie." };
  }

  return {};
}

export async function loginUser(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const result = await loginUserWith(auth, await headers(), formData);
  if (result.error || result.fieldErrors) {
    return result;
  }

  redirect("/");
}

export async function logoutUserWith(authInstance: AuthInstance, requestHeaders: Headers) {
  await authInstance.api.signOut({ headers: requestHeaders });
}

export async function logoutUser() {
  await logoutUserWith(auth, await headers());
  redirect("/");
}
