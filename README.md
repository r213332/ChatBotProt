チャットモデルのテストです。

# How To

## モデルの構築

### ollama を使用する場合(推奨)

https://ollama.com/download からインストール

https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B-GGUF/tree/main からモデルをダウンロード(モデルはなんでもいい)

任意のディレクトリにインストールした GUFF ファイルを設置
同ディレクトリに Modelfile という名前のファイルを作成
以下の内容を記述

```Modelfile
FROM ./Llama-3-ELYZA-JP-8B-q4_k_m.gguf
TEMPLATE """{{ if .System }}<|start_header_id|>system<|end_header_id|>

{{ .System }}<|eot_id|>{{ end }}{{ if .Prompt }}<|start_header_id|>user<|end_header_id|>

{{ .Prompt }}<|eot_id|>{{ end }}<|start_header_id|>assistant<|end_header_id|>

{{ .Response }}<|eot_id|>"""
PARAMETER stop "<|start_header_id|>"
PARAMETER stop "<|end_header_id|>"
PARAMETER stop "<|eot_id|>"
PARAMETER stop "<|reserved_special_token"
```

以下のコマンドを実行

```bash
ollama create elyza:jp8b -f Modelfile
```

#### テスト

```bash
ollama run elyza:jp8b
```

### node-llama-cpp を使用する場合

node-llama-cpp のバージョンが 2 の場合は使用できません。
プロジェクトで使用している node-llama-cpp のバージョンは 2 のため、グローバルインストールした物等を使用してください。

```bash
# node-llama-cppのグローバルインストール
npm install -g node-llama-cpp@latest
```

```bash
# 日本語モデルで軽量　精度は良くない
npx --no node-llama-cpp pull --dir chat-app/.models/ https://huggingface.co/mmnga/ELYZA-japanese-Llama-2-7b-instruct-gguf/blob/main/ELYZA-japanese-Llama-2-7b-instruct-q2_K.gguf
# or
# おすすめらしい　悪くない精度だけど重い
npx --no node-llama-cpp pull --dir chat-app/.models/ https://huggingface.co/mradermacher/Meta-Llama-3.1-8B-Instruct-GGUF/blob/main/Meta-Llama-3.1-8B-Instruct.Q6_K.gguf
# or
# おすすめのモデルが表示されるので任意のものを選んでダウンロード、プロジェクトフォルダに引っ張ってくる
npx --no node-llama-cpp chat
```

## ベクターストアの起動

```bash
# dockerの起動
sudo service docker start
# ベクターストアの起動
docker compose up -d
```

## パッケージのインストール

```bash
npm install
```

## スタート

```bash
npm run dev
```
