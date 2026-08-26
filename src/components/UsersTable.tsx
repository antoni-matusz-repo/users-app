import Link from "next/link";
import { DeleteUserButton } from "@/components/DeleteUserButton";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export function UsersTable({ users }: { users: UserRow[] }) {
  if (users.length === 0) {
    return <p>Brak użytkowników.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Nazwa</th>
          <th>Data utworzenia</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.email}</td>
            <td>{user.name}</td>
            <td>{user.createdAt.toLocaleString("pl-PL")}</td>
            <td>
              <Link href={`/users/${user.id}/edit`}>Edytuj</Link>{" "}
              <DeleteUserButton id={user.id} name={user.name} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
