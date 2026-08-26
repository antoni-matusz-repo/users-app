"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/validation/user";

type UserFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: { email: string; name: string };
  submitLabel?: string;
};

export function UserForm({ action, defaultValues, submitLabel = "Dodaj" }: UserFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">Email</label>
        <br />
        <input id="email" name="email" type="email" defaultValue={defaultValues?.email} required />
        {state.fieldErrors?.email && <p role="alert">{state.fieldErrors.email}</p>}
      </div>
      <div>
        <label htmlFor="name">Nazwa</label>
        <br />
        <input id="name" name="name" type="text" defaultValue={defaultValues?.name} required />
        {state.fieldErrors?.name && <p role="alert">{state.fieldErrors.name}</p>}
      </div>
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Zapisywanie…" : submitLabel}
      </button>
    </form>
  );
}
