import { NextRequest } from "next/server";
import { chatBot } from "@/server_actions/chat/chat_bot";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { userMessage } = body;

  // console.log("Chat message:", body);

  const stream = await chatBot(userMessage.content);

  //   const stream = new ReadableStream({
  //     start(controller) {
  //       controller.enqueue(userMessage.content);
  //       controller.close();
  //     },
  //   });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
    },
  });
}
