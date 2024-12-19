"use client";

// import { Button, Textarea } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizonal } from "lucide-react";
import { Message as ChatMessage, useChat } from "../lib/chat";
import { useEffect, useRef, useState } from "react";
import { Message } from "./message";
import { ChatTemplate } from "./chat-template";

const getFileBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function Chat() {
  // メッセージ送信時に最下部にスクロールするためのref
  const endRef = useRef<HTMLDivElement>(null);
  // RAGモード
  const [rag, setRag] = useState<boolean>(false);
  const setRagHandler = (value: boolean) => {
    setRag(value);
  };
  const [file, setFile] = useState<File | null>(null);
  // チャット
  const { messages, input, loading, setInput, append } = useChat();
  const onFinish = async (message: ChatMessage) => {
    console.log("Chat finished:", message);
  };

  // textaria参照
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handlechange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `38px`;
      console.log(textAreaRef.current.scrollHeight);
      textAreaRef.current.style.height = `${Math.max(
        textAreaRef.current.scrollHeight,
        38
      )}px`;
    }
  };

  const handleSubmit = async () => {
    if (input === "" || loading) return;
    setInput("");
    append(
      rag ? "RAG" : "chat",
      file ? await getFileBase64(file) : "",
      onFinish
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
      <ChatTemplate rag={rag} setRag={setRagHandler} setFile={setFile} />
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
      <div className="p-2 w-full h-15 flex gap-2 items-end border-1 rounded-md">
        <Textarea
          rows={1}
          className="resize-none border-none"
          ref={textAreaRef}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              console.log("Enter key pressed");
              e.preventDefault();
              handleSubmit();
            }
          }}
          onChange={handlechange}
          placeholder="質問してみてください"
        ></Textarea>
        <Button
          disabled={input === "" || loading}
          size="icon"
          onClick={handleSubmit}
        >
          {loading ? <Loader2 /> : <SendHorizonal className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
