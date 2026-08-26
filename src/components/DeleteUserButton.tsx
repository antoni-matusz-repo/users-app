"use client";

import { useActionState, useRef } from "react";
import { deleteUser } from "@/server/users";
import type { ActionState } from "@/lib/validation/user";

export function DeleteUserButton({ id, name }: { id: string; name: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    deleteUser.bind(null, id),
    {},
  );

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>
        Usuń
      </button>
      <dialog ref={dialogRef}>
        <p>
          Czy na pewno chcesz usunąć użytkownika <strong>{name}</strong>?
        </p>
        {state.error && <p role="alert">{state.error}</p>}
        <button type="button" onClick={() => dialogRef.current?.close()}>
          Anuluj
        </button>
        <form action={formAction}>
          <button type="submit" disabled={isPending}>
            {isPending ? "Usuwanie…" : "Tak, usuń"}
          </button>
        </form>
      </dialog>
    </>
  );
}
