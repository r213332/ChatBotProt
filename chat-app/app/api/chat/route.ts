import { NextRequest } from "next/server";
import { chatBot } from "@/server_actions/chat/chat_bot";
import { CreateVectorStore } from "@/server_actions/RAG/vectore_store";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import { RAGBot } from "@/server_actions/RAG/chat_bot";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { question, messages, file, mode } = body;

  // console.log("Chat message:", body);

  let stream: IterableReadableStream<Uint8Array>;
  if (mode === "RAG") {
    console.log("RAG mode");
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
