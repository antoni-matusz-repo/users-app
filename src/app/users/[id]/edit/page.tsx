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
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-col gap-1">
        <Link href="/users" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Lista użytkowników
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Edytuj użytkownika</h1>
      </div>
      <UserForm
        action={updateUser.bind(null, user.id)}
        defaultValues={{ email: user.email, name: user.name }}
        submitLabel="Zapisz"
      />
    </main>
  );
}
