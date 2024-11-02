"use server";

// import { getLlama, LlamaChatSession } from "node-llama-cpp";

import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { HumanMessage } from "@langchain/core/messages";
// import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";

export async function chatBot(question: string) {
  console.log("Chat bot invoked");
  const model = new ChatLlamaCpp({
    modelPath: "./models/ELYZA-japanese-Llama-2-7b-instruct-q2_K.gguf",
  });

  console.log("Model loaded:", model);

  const response = await model.streamEvents([new HumanMessage(question)], {
    version: "v2",
    encoding: "text/event-stream",
  });
  return response;

  // const model = new LlamaModel({
  //   modelPath: "./models/ELYZA-japanese-Llama-2-7b-instruct-q2_K.gguf",
  // });
  // const context = new LlamaContext({ model });
  // const session = new LlamaChatSession({ context });
  // console.log("User: " + question);

  // const a1 = await session.prompt(question);
  // console.log("AI: " + a1);

  // return a1;
}
