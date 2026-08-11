import { prisma } from "../src/lib/prisma";

const users = [
  { email: "alice@example.com", name: "Alice Kowalska" },
  { email: "bob@example.com", name: "Bob Nowak" },
  { email: "carol@example.com", name: "Carol Wiśniewska" },
  { email: "dawid@example.com", name: "Dawid Zieliński" },
  { email: "ewa@example.com", name: "Ewa Lewandowska" },
  { email: "filip@example.com", name: "Filip Wójcik" },
  { email: "gosia@example.com", name: "Małgorzata Kamińska" },
  { email: "hubert@example.com", name: "Hubert Szymański" },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
