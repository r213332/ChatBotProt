"use server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { WeaviateStore } from "@langchain/weaviate";
import weaviate from "weaviate-ts-client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const confirmVectorStoreShema = z.object({
  name: z.string(),
  description: z.string(),
  file: z.string(),
});

type ComfirmVectoreStoreFormState = {
  sucuess: boolean;
  error_message?: string;
};

// PDFのみ
export async function ComfirmVectorStore(
  prevState: ComfirmVectoreStoreFormState,
  fromData: FormData | undefined
): Promise<ComfirmVectoreStoreFormState> {
  // 初期化用
  if (!fromData) {
    return { sucuess: false };
  }
  console.log(fromData);
  // フォームのバリデーション
  const form = confirmVectorStoreShema.safeParse({
    name: fromData.get("name"),
    description: fromData.get("description"),
    file: fromData.get("file"),
  });
  if (!form.success) {
    return { sucuess: false, error_message: "フォームの入力が不正です" };
  }
  const { name, description, file } = form.data;

  // ドキュメントの読み込み
  console.log("ドキュメントの読み込み");
  const { uuid } = await CreateVectorStore(file);
  // const uuid = "test";
  console.log("ドキュメントの読み込み完了");
  console.log("データベースへの登録");
  // データベースへの登録
  try {
    await prisma.model.create({
      data: {
        name,
        description,
        vector_store_id: uuid,
      },
    });
  } catch (e) {
    console.log("データベースへの登録に失敗しました", e);
    return { sucuess: false, error_message: "予期せぬエラーで失敗しました" };
  } finally {
    await prisma.$disconnect();
  }
  console.log("データベースへの登録完了");

  revalidatePath("/models");
  return { sucuess: true };
}

// PDFのみ
export async function CreateVectorStore(file: string) {
  const fileData = file.replace(/^data:\w+\/\w+;base64,/, "");
  const type = file.split(";")[0].split(":")[1];
  const buffer = Buffer.from(fileData, "base64");
  const blob = new Blob([buffer], { type });
  let docs;
  if (type.includes("application/pdf")) {
    // PDF読み込み
    const pdfLoader = new PDFLoader(blob);
    docs = await pdfLoader.load();
  } else if (type.includes("text/plain")) {
    // text読み込み
    const textLoader = new TextLoader(blob);
    docs = await textLoader.load();
  }

  // ドキュメントが読み込めなかった場合
  if (!docs) {
    throw new Error("Failed to load document");
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 10,
  });
  const splits = await textSplitter.splitDocuments(docs);

  const uuid = uuidv4();

  console.log(splits);

  // ベクトルストアの作成
  const weaviateClient = weaviate.client({
    scheme: process.env.WEAVIATE_SCHEME ?? "http",
    host: process.env.WEAVIATE_HOST ?? "localhost",
  });
  const vectorStore = await WeaviateStore.fromDocuments(
    splits,
    new OllamaEmbeddings({
      model: "kun432/cl-nagoya-ruri-large",
    }),
    {
      client: weaviateClient,
      indexName: uuid,
    }
  );

  return { vectorStore, uuid };
}
