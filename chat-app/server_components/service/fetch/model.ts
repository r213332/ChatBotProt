import { prisma } from "@/lib/prisma";
import { Model } from "@/lib/types/model_definition";

export async function fetchModels(): Promise<Model[]> {
  try {
    const models = await prisma.model.findMany();
    return models;
  } catch (e) {
    console.log("モデルの取得に失敗しました");
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }
  return [];
}
