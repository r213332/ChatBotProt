チャットモデルのテストです。
NextJs + LangchainJs + Ollama

# How To

## モデルの構築

Ollama を使用しています。
https://ollama.com/download からインストール

### チャットモデル

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

テスト

```bash
ollama run elyza:jp8b
```

### 埋め込み

https://ollama.com/kun432/cl-nagoya-ruri-large を使用

```bash
ollama pull kun432/cl-nagoya-ruri-large
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
cd chat-app
npm install
```

## 環境変数

example.env ファイルを参考に.env ファイルを作成

## スタート

```bash
npm run dev
```
