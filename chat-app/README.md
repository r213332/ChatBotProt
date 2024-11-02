チャットモデルのテストです。

## 設定

パッケージのインストール

```bash
npm install
```

モデルの構築

```bash
npx --no node-llama-cpp pull --dir .models/ https://huggingface.co/mmnga/ELYZA-japanese-Llama-2-7b-instruct-gguf/blob/main/ELYZA-japanese-Llama-2-7b-instruct-q2_K.gguf
# or
npx --no node-llama-cpp chat
```

スタート

```bash
npm run dev
```