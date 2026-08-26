import Link from "next/link";
import { getUsers } from "@/lib/users";
import { UsersTable } from "@/components/UsersTable";

// Lista użytkowników ma pokazywać aktualny stan bazy przy każdym żądaniu,
// a nie zrzut z momentu builda.
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <main>
      <h1>Użytkownicy</h1>
      <p>
        <Link href="/">&larr; Strona główna</Link>
      </p>
      <UsersTable users={users} />
    </main>
  );
}
