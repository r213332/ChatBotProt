import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";

export type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export function useChat({
  api,
  onFinish,
}: {
  api: string;
  onFinish?: (message: Message) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const append = async (userMessage: Message) => {
    setLoading(true);
    const botMessage: Message = {
      id: crypto.randomUUID(),
      role: "bot",
      content: "",
    };
    setMessages([...messages, userMessage, botMessage]);
    await fetchEventSource(api, {
      method: "POST",
      body: JSON.stringify({ userMessage }),
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
              setMessages([...messages, userMessage, botMessage]);
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
        console.error(e);
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
