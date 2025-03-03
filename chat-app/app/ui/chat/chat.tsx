"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizonal } from "lucide-react";
import { Message as ChatMessage, useChat } from "../../../hooks/use-chat";
import { useEffect, useRef, useState } from "react";
import { Message } from "./message";
import { ChatTemplate } from "./chat-template";
import { getFileBase64 } from "@/lib/utils";
import { Model } from "@/lib/types/model_definition";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createChatHistory,
  createChatWithChatHistory,
} from "@/server_components/chat/chat_history";
import { chatBot } from "@/server_components/chat/chat_bot";

export default function Chat({
  models,
  userId,
  chatId,
}: {
  models: Model[];
  userId?: string;
  chatId?: string;
}) {
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
  const onFinish = async (
    userMessage: ChatMessage,
    botMessage: ChatMessage
  ) => {
    console.log("Chat finished:");
    if (userId) {
      if (chatId) {
        await createChatHistory(chatId, userMessage, botMessage);
      } else {
        await createChatWithChatHistory(userId, userMessage, botMessage);
      }
    }
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

  const testHandler = async () => {
    const response = await chatBot("テスト", []);
    for await (const message of response) {
      // const dec = new TextDecoder("utf-8").decode(message);
      console.log(message);
      // console.log(JSON.parse(`{${dec}}`));
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center">
      {/* ヘッダー */}
      <div className="top-0 w-full bg-primary flex justify-center">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-end gap-2 p-2">
            <p className="text-primary-foreground text-2xl font-bold p-2">
              チャット
            </p>
            <Select defaultValue={models[0].id}>
              <SelectTrigger className="w-[180px] bg-transparent border-transparent focus-visible:ring-transparent focus-visible:ring-offset-0 focus:ring-offset-0 text-primary-foreground">
                <SelectValue placeholder="モデルを選択" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="icon" onClick={testHandler}>
              テスト
            </Button>
          </div>
        </div>
      </div>
      {/* テンプレ */}
      <ChatTemplate rag={rag} setRag={setRagHandler} setFile={setFile} />
      {/* メッセージ履歴 */}
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
      {/* 入力欄 */}
      <div className="p-4 pb-12 w-full h-15">
        <div className="p-2 flex gap-2 w-full items-end border-2 border-primary rounded-md">
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
    </div>
  );
}
