import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";

// PDFのみ
export async function CreateVectorStore(file: File) {
  // PDF読み込み
  // const pdfLoader = new PDFLoader(file);
  // const docs = await pdfLoader.load();
  // text読み込み
  // const textLoader = new TextLoader(file);
  // const docs = await textLoader.load();
  // test
  const text = `
  生体運動制御システム研究室ではヒトの運動システムを解明し， それを応用した新しいシステムに関する研究を行っています。
人の運動はとても巧みな運動や、早く、力強い運動など、 様々な運動ができます。
このような運動ができるのは、 脳神経系がどのように手足を動かすかを決定し、 筋肉を制御することで実現できています。 
この、ヒトの運動がどのような原理で行なわれているのかを調べるために、 現在、様々な観点からの研究が世界中で行なわれています。 
その一つとして、計算論的神経科学と呼ばれる分野が存在します。 
  `;

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 10,
    chunkOverlap: 0,
  });
  const splits = await textSplitter.splitText(text);

  console.log(splits);

  const vectorStore = await MemoryVectorStore.fromTexts(
    splits,
    splits.map(() => "https://bmcs.cs.tut.ac.jp/new/study"),
    new OllamaEmbeddings({
      model: "kun432/cl-nagoya-ruri-large",
    })
  );

  return vectorStore;
}
