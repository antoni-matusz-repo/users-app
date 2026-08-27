"use client";

import { useActionState } from "react";
import { registerUser } from "@/server/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, {});

  if (state.success) {
    return (
      <div className="grid max-w-sm gap-2">
        <p className="font-medium">Sprawdź swoją skrzynkę pocztową</p>
        <p className="text-sm text-muted-foreground">
          Wysłaliśmy link potwierdzający na podany adres email. Kliknij go, żeby aktywować konto —
          dopiero wtedy będzie można się zalogować.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="firstName">Imię</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          aria-invalid={Boolean(state.fieldErrors?.firstName)}
          required
        />
        {state.fieldErrors?.firstName && (
          <p role="alert" className="text-sm text-destructive">
            {state.fieldErrors.firstName}
          </p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lastName">Nazwisko</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          aria-invalid={Boolean(state.fieldErrors?.lastName)}
          required
        />
        {state.fieldErrors?.lastName && (
          <p role="alert" className="text-sm text-destructive">
            {state.fieldErrors.lastName}
          </p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          required
        />
        {state.fieldErrors?.email && (
          <p role="alert" className="text-sm text-destructive">
            {state.fieldErrors.email}
          </p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Hasło</Label>
        <Input
          id="password"
          name="password"
          type="password"
          aria-invalid={Boolean(state.fieldErrors?.password)}
          required
        />
        {state.fieldErrors?.password && (
          <p role="alert" className="text-sm text-destructive">
            {state.fieldErrors.password}
          </p>
        )}
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={isPending} className="justify-self-start">
        {isPending ? "Rejestrowanie…" : "Zarejestruj się"}
      </Button>
    </form>
  );
}
