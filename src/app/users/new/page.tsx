import Link from "next/link";
import { UserForm } from "@/components/UserForm";
import { createUser } from "@/server/users";

export default function NewUserPage() {
  return (
    <main>
      <h1>Dodaj użytkownika</h1>
      <p>
        <Link href="/users">&larr; Lista użytkowników</Link>
      </p>
      <UserForm action={createUser} submitLabel="Dodaj" />
    </main>
  );
}
