"use client";

import { Button, Textarea } from "@nextui-org/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useChat } from "../lib/chat";
import { useEffect, useRef } from "react";

export default function Chat() {
  // メッセージ送信時に最下部にスクロールするためのref
  const endRef = useRef<HTMLDivElement>(null);
  // チャットAPIのエンドポイント
  const api = "http://localhost:3000/api/chat";
  // チャット
  const { messages, setMessages, input, loading, setInput, append } = useChat({
    api,
    onFinish: (message) => {
      console.log("Chat finished:", message);
    },
  });
  const handleSubmit = () => {
    append({
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    })
      .then(() => setInput(""))
      .catch((e) => console.error(e));
  };

  // 最下部にスクロール
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 初期メッセージ
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "user",
        content: "Hello!",
      },
      {
        id: crypto.randomUUID(),
        role: "bot",
        content: "Hello! How can I help you?",
      },
    ]);
  }, []);
  return (
    <div className="flex flex-col w-[70%] h-[70%] items-center justify-center">
      <div className="flex flex-col grow w-full p-3 gap-10 overflow-scroll">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.role === "user" ? "self-end" : "self-start"
            } p-2 rounded-lg bg-gray-400 min-w-[30%] max-w-[60%]`}
          >
            <p>
              <strong>{message.role === "user" ? "You" : "Bot"}</strong>
            </p>
            <p>{message.content}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="pt-4 w-full h-15">
        <Textarea
          className="w-"
          classNames={{
            inputWrapper: "",
          }}
          value={input}
          onValueChange={setInput}
          placeholder="質問してみてください"
          minRows={1}
          endContent={
            <Button
              className="!w-auto !h-auto"
              color="primary"
              variant="light"
              size="sm"
              isIconOnly
              isLoading={loading}
              onClick={handleSubmit}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </Button>
          }
        ></Textarea>
      </div>
    </div>
  );
}
