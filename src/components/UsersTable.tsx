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
  );
}
