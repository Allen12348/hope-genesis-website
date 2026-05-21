import type { User } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";

export async function findUserByEmailForCredentials(email: string): Promise<User | null> {
  try {
    const client = await getPrisma();
    return client.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("[AUTH_CREDENTIALS_ERROR]", {
      email,
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
