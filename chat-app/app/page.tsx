import React from "react";
import Chat from "./ui/chat";

export default async function Home() {
  return (
    <div className="w-[100vw] h-[100vh] bg-gray-300 flex items-center justify-center">
      <Chat></Chat>
    </div>
  );
}
