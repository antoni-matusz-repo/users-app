"use client";

import { useActionState } from "react";
import { deleteUser } from "@/server/users";
import type { ActionState } from "@/lib/validation/user";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteUserButton({ id, name }: { id: string; name: string }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    deleteUser.bind(null, id),
    {},
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="sm">
            Usuń
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć użytkownika {name}?</AlertDialogTitle>
          <AlertDialogDescription>Tej operacji nie można cofnąć.</AlertDialogDescription>
        </AlertDialogHeader>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <form action={formAction}>
            <AlertDialogAction type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Usuwanie…" : "Tak, usuń"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
