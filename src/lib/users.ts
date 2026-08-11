import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@/generated/prisma/client";

export async function getUsers(client: Pick<PrismaClient, "user"> = prisma) {
  return client.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}
