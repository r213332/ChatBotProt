"use server";

import { getLlama, LlamaChatSession } from "node-llama-cpp";

// import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
// import { HumanMessage } from "@langchain/core/messages";

export async function chatBot() {
  console.log("Chat bot invoked");
  // const model = new ChatLlamaCpp({
  //   modelPath:
  //     "../../.models/hf_mradermacher_Meta-Llama-3.1-8B-Instruct.Q6_K.gguf",
  // });

  // console.log("Model loaded:", model);

  // const response = await model.invoke([
  //   new HumanMessage({ content: "My name is John." }),
  // ]);
  // console.log({ response });

  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath:
      "C:\\workspace\\ChatBotProt\\chat-app\\.models\\hf_mradermacher_Meta-Llama-3.1-8B-Instruct.Q6_K.gguf",
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
  });

  const q1 = "Hi there, how are you?";
  console.log("User: " + q1);

  const a1 = await session.prompt(q1);
  console.log("AI: " + a1);
}
