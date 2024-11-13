import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";

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

  console.log(splits);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    new OllamaEmbeddings({
      model: "kun432/cl-nagoya-ruri-large",
    })
  );

  return vectorStore;
}
