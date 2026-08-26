import Link from "next/link";
import { UserForm } from "@/components/UserForm";
import { createUser } from "@/server/users";

export default function NewUserPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-col gap-1">
        <Link href="/users" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Lista użytkowników
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Dodaj użytkownika</h1>
      </div>
      <UserForm action={createUser} submitLabel="Dodaj" />
    </main>
  );
}
