import { prisma } from "@/lib/prisma";
import { Model } from "@/lib/types/model_definition";

export async function fetchModels(): Promise<Model[]> {
  try {
    const models = await prisma.model.findMany();
    return models.map((model) => {
      return {
        id: model.id,
        name: model.name,
        description: model.description,
        createdAt: model.createdAt.toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        updatedAt: model.updatedAt.toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      };
    });
  } catch (e) {
    console.log("モデルの取得に失敗しました");
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }
  return [];
}
