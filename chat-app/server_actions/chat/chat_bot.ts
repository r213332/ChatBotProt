"use server";

// import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { ChatOllama } from "@langchain/ollama";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { Message } from "@/app/lib/chat";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export async function chatBot(question: string, messages: Message[]) {
  console.log("Chat bot invoked");
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "貴方はアシスタントです。質問に対して丁寧かつ簡潔に応えてください。",
    ],
    new MessagesPlaceholder("chat_history"),
    new MessagesPlaceholder("question"),
  ]);
  // node-llama-cpp
  // const model = new ChatLlamaCpp({
  //   modelPath:
  //     // "./.models/hf_mradermacher_Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf",
  //     // "./.models/ELYZA-japanese-Llama-2-7b-instruct-q6_K.gguf",
  //     "./.models/Meta-Llama-3.1-8B-Instruct.Q6_K.gguf",
  //   maxTokens: 20,
  // });

  // ollama
  const model = new ChatOllama({
    model: "elyza:jp8b",
    maxRetries: 2,
  });

  const chain = RunnableSequence.from([
    {
      question: ({
        question,
      }: {
        question: HumanMessage;
        messages: BaseMessage[];
      }) => question,
      chat_history: ({
        messages,
      }: {
        question: HumanMessage;
        messages: BaseMessage[];
      }) => messages,
    },
    template,
    model,
  ]);

  const response = chain.streamEvents(
    {
      question: new HumanMessage(question),
      messages: messages.map((message) => {
        if (message.role === "user") {
          return new HumanMessage(message.content);
        } else {
          return new SystemMessage(message.content);
        }
      }),
    },
    {
      version: "v2",
      encoding: "text/event-stream",
    }
  );

  return response;
}
