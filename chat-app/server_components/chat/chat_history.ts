import { Message } from "@/hooks/use-chat";
import { prisma } from "@/lib/prisma";

export async function createChat(userId: string, title: string) {
  try {
    // const now = new Date();
    const chat = await prisma.chat.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return chat.id;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
}

export async function createChatWithChatHistory(
  userId: string,
  userMessage: Message,
  botMessage: Message
) {
  try {
    // const now = new Date();
    const chat = await prisma.chat.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        title: "Chat with bot",
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: {
          create: [
            {
              text: userMessage.content,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              text: botMessage.content,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      },
    });
    return chat.id;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
}

export async function createChatHistory(
  chatId: string,
  userMessage: Message,
  botMessage: Message
) {
  try {
    // const now = new Date();
    await prisma.message.createMany({
      data: [
        {
          chat_id: chatId,
          text: userMessage.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chat_id: chatId,
          text: botMessage.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });
    return;
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
}
