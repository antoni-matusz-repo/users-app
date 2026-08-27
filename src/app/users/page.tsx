import Link from "next/link";
import { getUsers } from "@/lib/users";
import { UsersTable } from "@/components/UsersTable";
import { buttonVariants } from "@/components/ui/button";

// Lista użytkowników ma pokazywać aktualny stan bazy przy każdym żądaniu,
// a nie zrzut z momentu builda.
export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ forbidden?: string }>;
}) {
  const [users, { forbidden }] = await Promise.all([getUsers(), searchParams]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-col gap-1">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Strona główna
        </Link>
        {forbidden && (
          <p role="alert" className="text-sm text-destructive">
            Nie masz dostępu do tej strony.
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Użytkownicy</h1>
          <Link href="/users/new" className={buttonVariants({ className: "self-start" })}>
            Dodaj użytkownika
          </Link>
        </div>
      </div>
      <UsersTable users={users} />
    </main>
  );
}
