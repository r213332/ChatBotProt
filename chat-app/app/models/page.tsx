import { Models } from "@/app/ui/model/models";
import { fetchModels } from "@/server_components/service/fetch/model";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Wrapper />
    </Suspense>
  );
}

async function Wrapper() {
  const models = await fetchModels();
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Models models={models} />
    </div>
  );
}
