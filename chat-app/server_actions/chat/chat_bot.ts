"use server";

import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function chatBot(question: string) {
  console.log("Chat bot invoked");
  const model = new ChatLlamaCpp({
    modelPath:
      // "./.models/hf_mradermacher_Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf",
      "./.models/ELYZA-japanese-Llama-2-7b-instruct-q6_K.gguf",
    maxTokens: 20,
  });

  // console.log("Model loaded:", model);

  // const stream = await model.invoke([
  //   new SystemMessage(
  //     "貴方はアシスタントです。質問に対して丁寧かつ簡潔に応えてください。"
  //   ),
  //   new HumanMessage(question),
  // ]);

  // console.log("Stream:", stream);

  const response = model.streamEvents(
    [
      new SystemMessage(
        "貴方はアシスタントです。質問に対して丁寧かつ簡潔に応えてください。"
      ),
      new HumanMessage(question),
    ],
    {
      version: "v2",
      encoding: "text/event-stream",
    }
  );

  return response;
}
