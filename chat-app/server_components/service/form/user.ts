import { prisma } from "@/lib/prisma";
import { v4 } from "uuid";

export async function createUser() {
  try {
    const user = await prisma.user.create({
      data: {
        id: v4(),
        session_id: v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return user;
  } catch (e) {
    console.log(e);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
