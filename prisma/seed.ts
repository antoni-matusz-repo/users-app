import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

// Konta zakładane przez Better Auth (auth.api.createUser), nie surowe
// INSERT-y — dostają realne, zahashowane hasła i mogą się logować od razu
// (emailVerified ustawiane ręcznie, żeby nie trzeba było klikać w link
// weryfikacyjny na danych demo). Dwie pierwsze osoby mają rolę "admin"
// do testów autoryzacji tras w kolejnym issue.
const SEED_PASSWORD = "Haslo123!";

const users: { email: string; firstName: string; lastName: string; role: "admin" | "user" }[] = [
  { email: "alice@example.com", firstName: "Alice", lastName: "Kowalska", role: "admin" },
  { email: "bob@example.com", firstName: "Bob", lastName: "Nowak", role: "admin" },
  { email: "carol@example.com", firstName: "Carol", lastName: "Wiśniewska", role: "user" },
  { email: "dawid@example.com", firstName: "Dawid", lastName: "Zieliński", role: "user" },
  { email: "ewa@example.com", firstName: "Ewa", lastName: "Lewandowska", role: "user" },
  { email: "filip@example.com", firstName: "Filip", lastName: "Wójcik", role: "user" },
  { email: "gosia@example.com", firstName: "Małgorzata", lastName: "Kamińska", role: "user" },
  { email: "hubert@example.com", firstName: "Hubert", lastName: "Szymański", role: "user" },
];

async function main() {
  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (existing) {
      continue;
    }

    await auth.api.createUser({
      body: {
        email: user.email,
        password: SEED_PASSWORD,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        data: { firstName: user.firstName, lastName: user.lastName },
      },
    });

    await prisma.user.update({
      where: { email: user.email },
      data: { emailVerified: true },
    });
  }
}

main()
  .then(async () => {
    console.log(`Zaseedowano ${users.length} użytkowników. Hasło demo: ${SEED_PASSWORD}`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
