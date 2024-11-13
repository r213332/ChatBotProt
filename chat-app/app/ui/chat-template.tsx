import { Switch, Input } from "@nextui-org/react";
import { Bot, BookOpenText } from "lucide-react";

export function ChatTemplate({
  rag,
  setRag,
  setFile,
}: {
  rag: boolean;
  setRag: (value: boolean) => void;
  setFile: (value: File | null) => void;
}) {
  return (
    <div className="flex w-full p-5 justify-between items-center">
      <div className="bg-gray-400 w-[30%] h-full rounded-md p-3 flex flex-col">
        <div className="flex items-center gap-2">
          <div className="bg-green-200 text-gray-400 w-8 h-8 rounded-full flex justify-center items-center">
            <Bot />
          </div>
          <h2>チャット</h2>
        </div>
        <p>
          様々な内容をチャットできます。プログラムの質問やレポートの校正をしてみてください。ローカルで動作しているので内容は保存されません。
        </p>
      </div>
      <div className="bg-gray-400 w-[68%] h-full rounded-md p-3 flex flex-col">
        <div className="flex items-center gap-2">
          <div className="bg-green-200 text-gray-400 w-8 h-8 rounded-full flex justify-center items-center">
            <BookOpenText />
          </div>
          <h2>RAG</h2>
        </div>
        <p>
          ファイルをアップロードしてその内容についてチャットします。ファイルは保存されません。
          PDFとTXTファイルのみ対象です。
        </p>
        <div className="w-full">
          <Input
            className="w-80"
            accept="application/pdf, text/plain"
            classNames={{
              inputWrapper: "bg-gray-200",
            }}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.item(0);
              if (file) {
                setFile(file);
              }
            }}
          />
        </div>
        <div className="flex w-full gap-2 items-center justify-end">
          <p>RAGを試す</p>
          <Switch isSelected={rag} onValueChange={setRag}></Switch>
        </div>
      </div>
    </div>
  );
}
