# Firebase Functions メール送信機能のセットアップ

## 概要
このプロジェクトでは、Firebase Functionsを使用してGmail経由でメール送信機能を実装しています。
お問い合わせフォームから送信された内容が `dreamfighter4649@gmail.com` に自動送信されます。

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
cd functions
npm install
```

### 2. Gmailアプリパスワードの取得

1. Googleアカウントにログイン
2. [Googleアカウント設定](https://myaccount.google.com/) にアクセス
3. 「セキュリティ」→「2段階認証プロセス」を有効化（まだの場合）
4. 「アプリパスワード」を検索して設定
5. 「メール」と「その他（カスタム名）」を選択してアプリパスワードを生成
6. 生成された16文字のパスワードをコピー

### 3. Firebase Functionsの環境変数設定

```bash
firebase functions:config:set smtp.user="your-email@gmail.com" smtp.pass="your-app-password"
```

**重要**: 
- `your-email@gmail.com` をGmailアドレスに置き換えてください
- `your-app-password` を上記で取得したアプリパスワードに置き換えてください
- このコマンドはプロジェクトのルートディレクトリで実行してください

### 4. Functionsのデプロイ

```bash
firebase deploy --only functions
```

### 5. Functions URLの確認

デプロイ後、以下のコマンドでFunctionsのURLを確認できます：

```bash
firebase functions:list
```

または、Firebase Consoleの「Functions」セクションで確認できます。

デフォルトのURL形式：
```
https://us-central1-horidays-hp.cloudfunctions.net/sendContactEmail
```

### 6. contact.htmlのURL更新（必要に応じて）

`public/contact.html` のJavaScript内の `FUNCTION_URL` を、実際のFunctions URLに更新してください。

```javascript
const FUNCTION_URL = 'https://us-central1-horidays-hp.cloudfunctions.net/sendContactEmail';
```

## ローカル開発環境でのテスト

### エミュレーターの起動

```bash
firebase emulators:start --only functions
```

### 環境変数の設定（エミュレーター用）

エミュレーターを使用する場合は、`functions/.env` ファイルを作成して環境変数を設定します：

```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**注意**: `.env` ファイルは `.gitignore` に追加されていることを確認してください。

## トラブルシューティング

### メールが送信されない場合

1. **環境変数の確認**
   ```bash
   firebase functions:config:get
   ```

2. **ログの確認**
   ```bash
   firebase functions:log
   ```

3. **Gmailアプリパスワードの確認**
   - 2段階認証が有効になっているか
   - アプリパスワードが正しく設定されているか

### CORSエラーが発生する場合

Functions側でCORS設定が正しく行われているか確認してください。
`functions/index.js` の `cors: true` オプションが設定されていることを確認してください。

## セキュリティに関する注意事項

- Gmailアプリパスワードは機密情報です。GitHubなどにコミットしないでください
- 環境変数はFirebase Functionsの設定で管理してください
- 本番環境では、必要に応じて追加のセキュリティ対策（レート制限など）を検討してください

## メール送信先の変更

メール送信先を変更する場合は、`functions/index.js` の以下の行を編集してください：

```javascript
const recipientEmail = "dreamfighter4649@gmail.com";
```

変更後、再度デプロイしてください：

```bash
firebase deploy --only functions
```

