"use server";

import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { HumanMessage } from "@langchain/core/messages";

export async function chatBot() {
  const model = new ChatLlamaCpp({
    modelPath:
      "../../.models/hf_mradermacher_Meta-Llama-3.1-8B-Instruct.Q6_K.gguf",
  });

  const response = await model.invoke([
    new HumanMessage({ content: "My name is John." }),
  ]);
  console.log({ response });
}
