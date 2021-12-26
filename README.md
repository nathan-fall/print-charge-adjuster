# print-charge-adjuster

## コマンド

### ライブラリインストール

```
yarn install
```

### 開発用に起動

```
yarn serve
```

### コンパイルしてインストーラを出力(`/dist_electron`に出力)

```
yarn build
```

### コードをきれいに整形する

```
yarn lint
```

## 仕様

### コマンドラインからの起動　(Ver1.2 から)

```zsh
open print-charge-adjuster://printjobs/new
```

ターミナルやシェルスクリプトから上記のコマンドを呼ぶことで印刷代登録の画面が出る

Ver1.1 までは引数を与えてアプリ自体を`open`していたが、Ver1.2 からはカスタム URL スキームに変更
