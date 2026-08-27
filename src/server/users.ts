"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";
import { userSchema, type ActionState } from "@/lib/validation/user";

function parseUserFormData(formData: FormData) {
  return userSchema.safeParse({
    email: formData.get("email"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });
}

export async function createUserWith(
  client: Pick<PrismaClient, "user">,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseUserFormData(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
      },
    };
  }

  try {
    await client.user.create({
      data: {
        ...parsed.data,
        // Better Auth wymaga "name" na bazowym modelu User — liczymy je
        // z firstName/lastName, ale to firstName/lastName są tu realnymi
        // polami; "name" nie jest nigdzie w naszym UI wyświetlane.
        name: `${parsed.data.firstName} ${parsed.data.lastName}`,
      },
    });
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

export async function updateUserWith(
  client: Pick<PrismaClient, "user">,
  id: string,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseUserFormData(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
      },
    };
  }

  try {
    await client.user.update({
      where: { id },
      data: {
        ...parsed.data,
        name: `${parsed.data.firstName} ${parsed.data.lastName}`,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { fieldErrors: { email: "Ten email jest już zajęty." } };
      }
      if (error.code === "P2025") {
        return { error: "Ten użytkownik już nie istnieje (mógł zostać usunięty)." };
      }
    }
    throw error;
  }

  return {};
}

export async function updateUser(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await updateUserWith(prisma, id, formData);
  if (result.fieldErrors || result.error) {
    return result;
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUserWith(
  client: Pick<PrismaClient, "user">,
  id: string,
): Promise<ActionState> {
  try {
    await client.user.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { error: "Ten użytkownik już nie istnieje (mógł zostać usunięty wcześniej)." };
    }
    throw error;
  }

  return {};
}

export async function deleteUser(
  id: string,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const result = await deleteUserWith(prisma, id);
  if (result.error) {
    return result;
  }

  revalidatePath("/users");
  return {};
}
