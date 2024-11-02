"use client";

import { Button } from "@nextui-org/react";
import { chatBot } from "@/server_actions/chat/chat_bot";

export default function Chat() {
  return (
    <div>
      <form action={chatBot}>
        <Button size="md" color="primary">
          Chat
        </Button>
      </form>
    </div>
  );
}
