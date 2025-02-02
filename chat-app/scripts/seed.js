import { PrismaClient } from "@prisma/client";
import weaviate from "weaviate-client";

const prisma = new PrismaClient();
try {
  await prisma.model.deleteMany({});
  await prisma.model.create({
    data: {
      name: "テストモデル",
      description: "これはテストモデルです",
      vector_store_id: "test:test",
    },
  });
  console.log("モデルの作成に成功しました");
} catch (e) {
  console.log("モデルの作成に失敗しました");
  console.log(e);
}

try {
  const client = await weaviate.connectToLocal();
  await client.collections.deleteAll();

  console.log("Weaviateへの接続に成功しました");
  console.log(client);
} catch (e) {
  console.log("Weaviateへの接続に失敗しました");
  console.log(e);
}
