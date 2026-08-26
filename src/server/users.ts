"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";
import { userSchema, type ActionState } from "@/lib/validation/user";

export async function createUserWith(
  client: Pick<PrismaClient, "user">,
  formData: FormData,
): Promise<ActionState> {
  const parsed = userSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        name: fieldErrors.name?.[0],
      },
    };
  }

  try {
    await client.user.create({ data: parsed.data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { fieldErrors: { email: "Ten email jest już zajęty." } };
    }
    throw error;
  }

  return {};
}

export async function createUser(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await createUserWith(prisma, formData);
  if (result.fieldErrors || result.error) {
    return result;
  }

  revalidatePath("/users");
  redirect("/users");
}
