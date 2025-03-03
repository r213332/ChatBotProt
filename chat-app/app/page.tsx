import React, { Suspense } from "react";
import Chat from "./ui/chat/chat";
import { fetchModels } from "@/server_components/service/fetch/model";
import { auth } from "@/auth";
import { fetchUserBySession } from "@/server_components/service/fetch/user";

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
  const session = await auth();
  // console.log({ session });
  // if (!session) {
  //   redirect("/signin");
  // }

  const [user, models] = await Promise.all([
    fetchUserBySession(session?.user?.name || undefined),
    fetchModels(),
  ]);

  return (
    <div className="flex-grow flex items-center justify-center">
      <Chat userId={user?.id || undefined} models={models}></Chat>
    </div>
  );
}
