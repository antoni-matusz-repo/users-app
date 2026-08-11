import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1>Użytkownicy</h1>
      <p>
        <Link href="/">&larr; Strona główna</Link>
      </p>
      {users.length === 0 ? (
        <p>Brak użytkowników.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nazwa</th>
              <th>Data utworzenia</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.createdAt.toLocaleString("pl-PL")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
