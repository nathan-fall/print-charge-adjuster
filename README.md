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

### 自動バックアップ　(Ver1.3 から)

3 日ごとに`{ホームフォルダ}/印刷代管理アプリ/`下にバックアップが作成される

Ver1.0 まで存在していた機能で Ver1.1 で削除され Ver1.3 で復活
