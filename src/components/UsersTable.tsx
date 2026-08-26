import Link from "next/link";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export function UsersTable({ users }: { users: UserRow[] }) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak użytkowników.</p>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Nazwa</TableHead>
            <TableHead>Data utworzenia</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.createdAt.toLocaleString("pl-PL")}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Link
                  href={`/users/${user.id}/edit`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Edytuj
                </Link>
                <DeleteUserButton id={user.id} name={user.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
