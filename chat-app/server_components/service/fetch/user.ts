import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function fetchUserBySession(
  sessionId?: string
): Promise<User | null> {
  if (!sessionId) {
    return null;
  }
  try {
    const users = await prisma.user.findFirst({
      where: {
        session_id: sessionId,
      },
    });
    if (!users) {
      throw new Error("ユーザが見つかりませんでした");
    }
    return users;
  } catch (e) {
    console.log("ユーザの取得に失敗しました");
    console.log(e);
    return null;
  } finally {
    prisma.$disconnect();
  }
}
