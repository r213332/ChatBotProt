import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";

export type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export type body = {
  question: string;
  messages: Message[];
  mode: "RAG" | "chat";
  file: string;
};

const api = process.env.NEXT_PUBLIC_API_PATH + "/api/chat";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const append = async (
    mode: "RAG" | "chat",
    file: string,
    onFinish: (message: Message) => Promise<void>
  ) => {
    setLoading(true);
    const prevMessages = messages.slice();
    const userMessage: Message = {
      id: (messages.length + 1).toString(),
      role: "user",
      content: input,
    };
    const botMessage: Message = {
      id: (messages.length + 2).toString(),
      role: "bot",
      content: "",
    };

    setMessages([...prevMessages, userMessage, botMessage]);

    const request: body = {
      question: input,
      messages: [...prevMessages, userMessage, botMessage],
      mode,
      file,
    };
    await fetchEventSource(api, {
      method: "POST",
      openWhenHidden: true,
      body: JSON.stringify(request),
      onmessage: (message) => {
        if (message.event === "data") {
          // console.log('eventMessage', message.data);
          const data = JSON.parse(message.data);
          // console.log(data.event);
          if (data.event == "on_chat_model_stream") {
            // console.log(data.data);
            if (data.data?.chunk?.kwargs?.content) {
              // console.log(data.data?.chunk?.kwargs.content);
              botMessage.content += data.data?.chunk?.kwargs.content;
              setMessages([...prevMessages, userMessage, botMessage]);
            }
          } else if (data.event == "on_chat_model_end") {
            // console.log('on_chat_model_end', data);
            // usage_metadata = data.data?.output?.kwargs?.usage_metadata;
          }
        }
      },
      onclose: () => {
        setLoading(false);
        if (onFinish) {
          onFinish(botMessage);
        }
      },
      onerror: (e) => {
        setLoading(false);
        throw e;
      },
    });
  };

  return {
    messages,
    setMessages,
    input,
    loading,
    setInput,
    append,
  };
}
