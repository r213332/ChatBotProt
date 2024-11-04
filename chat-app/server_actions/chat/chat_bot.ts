"use server";

// import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";
import { ChatOllama } from "@langchain/ollama";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { Message } from "@/app/lib/chat";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableConfig, RunnableSequence } from "@langchain/core/runnables";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";

export async function chatBot(question: string, messages: Message[]) {
  console.log("Chat bot invoked");

  // ツール定義
  const multiplyTool = new DynamicStructuredTool({
    name: "multiply",
    description: "multiply two numbers together",
    schema: z.object({
      a: z.number().describe("the first number to multiply"),
      b: z.number().describe("the second number to multiply"),
    }),
    func: async ({ a, b }: { a: number; b: number }) => {
      return (a * b).toString();
    },
  });

  const toolNode = new ToolNode([multiplyTool]);

  // チャットボット本体の定義
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
    // model: "elyza:jp8b",
    model: "llama3.2",
    maxRetries: 2,
  });

  const boundModel = model.bindTools([multiplyTool]);

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

  const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
    }),
  });

  // Define the function that determines whether to continue or not
  const shouldContinue = (state: typeof AgentState.State) => {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1] as AIMessage;
    // If there is no function call, then we finish
    if (!lastMessage?.tool_calls?.length) {
      return END;
    } // Otherwise if there is, we check if it's suppose to return direct
    else {
      const args = lastMessage.tool_calls[0].args;
      if (args?.return_direct) {
        return "final";
      } else {
        return "tools";
      }
    }
  };

  // Define the function that calls the model
  const callModel = async (
    state: typeof AgentState.State,
    config?: RunnableConfig
  ) => {
    const messages = state.messages;
    const response = await boundModel.invoke(messages, config);
    // We return an object, because this will get added to the existing list
    return { messages: [response] };
  };

  // Define a new graph
  const workflow = new StateGraph(AgentState)
    // Define the two nodes we will cycle between
    .addNode("agent", callModel)
    // Note the "action" and "final" nodes are identical!
    .addNode("tools", toolNode)
    .addNode("final", toolNode)
    // Set the entrypoint as `agent`
    .addEdge(START, "agent")
    // We now add a conditional edge
    .addConditionalEdges(
      // First, we define the start node. We use `agent`.
      "agent",
      // Next, we pass in the function that will determine which node is called next.
      shouldContinue
    )
    // We now add a normal edge from `tools` to `agent`.
    .addEdge("tools", "agent")
    .addEdge("final", END);

  // Finally, we compile it!
  const app = workflow.compile();

  // 回答の生成
  const response = app.streamEvents(
    { messages: [new HumanMessage(question)] },
    {
      version: "v2",
      encoding: "text/event-stream",
    }
  );

  // const response = chain.streamEvents(
  //   {
  //     question: new HumanMessage(question),
  //     messages: messages.map((message) => {
  //       if (message.role === "user") {
  //         return new HumanMessage(message.content);
  //       } else {
  //         return new SystemMessage(message.content);
  //       }
  //     }),
  //   },
  //   {
  //     version: "v2",
  //     encoding: "text/event-stream",
  //   }
  // );

  return response;
}
