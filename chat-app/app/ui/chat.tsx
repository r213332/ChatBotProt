"use client";

import { Button, Textarea } from "@nextui-org/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { body, useChat } from "../lib/chat";
import { useEffect, useRef, useState } from "react";
import { Message } from "./message";
import { ChatTemplate } from "./chat-template";

export default function Chat() {
  // メッセージ送信時に最下部にスクロールするためのref
  const endRef = useRef<HTMLDivElement>(null);
  // RAGモード
  const [rag, setRag] = useState<boolean>(false);
  const setRagHandler = (value: boolean) => {
    setRag(value);
  };
  const [file, setFile] = useState<File | null>(null);
  // チャットAPIのエンドポイント
  const api = "http://localhost:3000/api/chat";
  // チャット
  const { messages, input, loading, setInput, append } = useChat({
    api,
    onFinish: (message) => {
      console.log("Chat finished:", message);
    },
  });
  const handleSubmit = () => {
    if (input === "" || loading) return;
    setInput("");
    const body: body = {
      question: input,
      messages: messages,
      mode: rag ? "RAG" : "chat",
      file: file,
    };
    append(
      {
        id: messages.length.toString(),
        role: "user",
        content: input,
      },
      body
    )
      .then(() => setInput(""))
      .catch((e) => console.error(e));
  };

  // 最下部にスクロール
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-[70%] h-full items-center justify-center pb-32 pt-16">
      <ChatTemplate rag={rag} setRag={setRagHandler} />
      <div className="flex flex-col grow w-full p-3 gap-10 overflow-y-auto">
        {messages.length != 0 &&
          messages.map((message) => (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
            />
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              console.log("Enter key pressed");
              e.preventDefault();
              handleSubmit();
            }
          }}
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
              disabled={input === ""}
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
