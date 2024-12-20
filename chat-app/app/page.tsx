import React from "react";
import Chat from "./ui/chat";

export default async function Home() {
  return (
    <div className="flex-grow flex items-center justify-center">
      <Chat></Chat>
    </div>
  );
}
