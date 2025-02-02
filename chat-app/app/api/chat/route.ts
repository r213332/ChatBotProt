import { NextRequest } from "next/server";
import { chatBot } from "@/server_components/chat/chat_bot";
import { CreateVectorStore } from "@/server_components/RAG/vectore_store";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import { RAGBot } from "@/server_components/RAG/chat_bot";
import { body } from "@/hooks/use-chat";
import { z } from "zod";

const requestSchema = z.object({
  question: z.string(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["user", "bot"]),
      content: z.string(),
    })
  ),
  mode: z.enum(["RAG", "chat"]),
  file: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsedBody = requestSchema.safeParse(body);

  if (!parsedBody.success) {
    throw new Error("Invalid request body");
  }

  const { question, messages, mode, file } = parsedBody.data as body;

  // console.log("Chat message:", file);

  let stream: IterableReadableStream<Uint8Array>;
  if (mode === "RAG") {
    console.log("RAG mode");
    if (file === "") {
      throw new Error("RAG mode requires file");
    }
    const vectorStore = await CreateVectorStore(file);
    console.log("Vector store created");
    stream = await RAGBot(vectorStore, question, messages);
  } else {
    stream = await chatBot(question, messages);
  }

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      connection: "keep-alive",
      "cache-control": "no-cache no-transform",
    },
  });
}
