"use client";

import { Model } from "@/lib/types/model_definition";
import { Table } from "../common/table";
import { Pagination } from "../common/pagination";
import { useEffect, useState } from "react";
import { CreateForm } from "./form";

const columns: {
  key: "name" | "description" | "createdAt" | "updatedAt";
  label: string;
  className?: string;
}[] = [
  { key: "name", label: "モデル名" },
  { key: "description", label: "説明" },
  { key: "createdAt", label: "作成日" },
  { key: "updatedAt", label: "更新日" },
] as const;

const formatDates = (data: Model[]) => {
  return data.map((model) => {
    return {
      ...model,
      createdAt: new Date(model.createdAt).toLocaleDateString("ja-JP"),
      updatedAt: new Date(model.updatedAt).toLocaleDateString("ja-JP"),
    };
  });
};

export function Models({ models }: { models: Model[] }) {
  const [data, setData] = useState<
    {
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    }[]
  >([]);

  useEffect(() => {
    setData(formatDates(models));
  }, [models]);

  return (
    <div className="flex flex-col items-center justify-center w-[50%]">
      <div className="w-full flex items-center justify-between">
        <div></div>
        <div>
          <CreateForm />
        </div>
      </div>
      <Table columns={columns} data={data} className="h-[400px]" />
      <Pagination />
    </div>
  );
}
