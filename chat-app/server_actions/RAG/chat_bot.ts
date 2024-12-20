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
import { formatDocumentsAsString } from "langchain/util/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

export async function RAGBot(
  vectoreStore: MemoryVectorStore,
  question: string,
  messages: Message[]
) {
  console.log("RAG Chat bot invoked");

  // const retriever = vectoreStore.asRetriever();
  const retriever = ScoreThresholdRetriever.fromVectorStore(vectoreStore, {
    minSimilarityScore: 0.2,
  });

  // チャットボット本体の定義
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "貴方はアシスタントです。質問に対して丁寧かつ簡潔に応えてください。",
    ],
    new MessagesPlaceholder("chat_history"),
    new MessagesPlaceholder("question"),
    new MessagesPlaceholder("context"),
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
    // model: "llama3.2",
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
      context: async ({
        question,
      }: {
        question: HumanMessage;
        messages: BaseMessage[];
      }) => {
        const document = await retriever.invoke(question.content as string);
        console.log("RAGBot context:", document);
        return formatDocumentsAsString(document);
      },
    },
    template,
    model,
  ]);

  // 回答の生成
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
