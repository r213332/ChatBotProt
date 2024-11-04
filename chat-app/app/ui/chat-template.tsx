export function ChatTemplate() {
  return (
    <div className="flex h-[30%] w-full p-5 justify-between items-center">
      <div className="bg-gray-400 w-[30%] h-full rounded-md p-3">
        <h2>RAG</h2>
        <p>工事中...</p>
      </div>
      <div className="bg-gray-400 w-[30%] h-full rounded-md p-3">
        <h2>🤖チャット</h2>
        <p>
          様々な内容をチャットできます。プログラムの質問やレポートの校正をしてみてください。ローカルで動作しているので内容は保存されません。
        </p>
      </div>
      <div className="bg-gray-400 w-[30%] h-full rounded-md p-3">
        <h2>未定</h2>
        <p>工事中...</p>
      </div>
    </div>
  );
}
