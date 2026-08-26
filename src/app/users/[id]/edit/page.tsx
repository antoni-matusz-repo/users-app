import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/UserForm";
import { updateUser } from "@/server/users";

export default async function EditUserPage({ params }: PageProps<"/users/[id]/edit">) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    notFound();
  }

  return (
    <main>
      <h1>Edytuj użytkownika</h1>
      <p>
        <Link href="/users">&larr; Lista użytkowników</Link>
      </p>
      <UserForm
        action={updateUser.bind(null, user.id)}
        defaultValues={{ email: user.email, name: user.name }}
        submitLabel="Zapisz"
      />
    </main>
  );
}
