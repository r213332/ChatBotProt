import React, { Suspense } from "react";
import Chat from "./ui/chat";
import { fetchModels } from "@/server_components/service/fetch/model";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Wrapper></Wrapper>
      </Suspense>
    </>
  );
}

async function Wrapper() {
  const models = await fetchModels();

  return (
    <div className="flex-grow flex items-center justify-center">
      <Chat models={models}></Chat>
    </div>
  );
}
