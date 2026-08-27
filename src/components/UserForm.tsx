"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/validation/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: { email: string; firstName: string; lastName: string };
  submitLabel?: string;
};

export function UserForm({ action, defaultValues, submitLabel = "Dodaj" }: UserFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultValues?.email}
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
        <Label htmlFor="firstName">Imię</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          defaultValue={defaultValues?.firstName}
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
          defaultValue={defaultValues?.lastName}
          aria-invalid={Boolean(state.fieldErrors?.lastName)}
          required
        />
        {state.fieldErrors?.lastName && (
          <p role="alert" className="text-sm text-destructive">
            {state.fieldErrors.lastName}
          </p>
        )}
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={isPending} className="justify-self-start">
        {isPending ? "Zapisywanie…" : submitLabel}
      </Button>
    </form>
  );
}
