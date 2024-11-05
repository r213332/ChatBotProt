import { Switch } from "@nextui-org/react";

export function ChatTemplate({
  rag,
  setRag,
}: {
  rag: boolean;
  setRag: (value: boolean) => void;
}) {
  return (
    <div className="flex w-full p-5 justify-between items-center">
      <div className="bg-gray-400 w-[30%] h-full rounded-md p-3">
        <h2>未定</h2>
        <p>工事中...</p>
      </div>
      <div className="bg-gray-400 w-[30%] h-full rounded-md p-3">
        <h2>🤖チャット</h2>
        <p>
          様々な内容をチャットできます。プログラムの質問やレポートの校正をしてみてください。ローカルで動作しているので内容は保存されません。
        </p>
      </div>
      <div className="bg-gray-400 w-[30%] h-full rounded-md p-3">
        <h2>RAG</h2>
        <p>
          ファイルをアップロードしてその内容についてチャットします。ファイルは保存されません。
        </p>
        <div className="flex w-full gap-2 items-center justify-end">
          <p>RAGを試す</p>
          <Switch isSelected={rag} onValueChange={setRag}></Switch>
        </div>
      </div>
    </div>
  );
}
