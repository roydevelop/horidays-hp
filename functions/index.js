/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");
// Firebase Configを使用する場合（v1 API）
const functionsV1 = require("firebase-functions");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Gmail SMTP設定
// 環境変数の設定方法：
// 1. Firebase Configを使用する場合（推奨）:
//    firebase functions:config:set smtp.user="your-email@gmail.com" smtp.pass="your-app-password"
// 2. 環境変数を使用する場合:
//    firebase functions:secrets:set SMTP_USER
//    firebase functions:secrets:set SMTP_PASS
const createTransporter = () => {
  // Firebase Configから取得（firebase functions:config:set で設定）
  const config = functionsV1.config();
  const smtpUser = config.smtp?.user || process.env.SMTP_USER || "";
  const smtpPass = config.smtp?.pass || process.env.SMTP_PASS || "";

  if (!smtpUser || !smtpPass) {
    logger.error("SMTP設定が正しく設定されていません");
    throw new Error(
      "SMTP設定が正しく設定されていません。環境変数を設定してください。"
    );
  }

  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

// お問い合わせメール送信関数
exports.sendContactEmail = onRequest(
  {
    cors: true,
    maxInstances: 5,
  },
  async (req, res) => {
    // CORS設定
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // OPTIONSリクエストの処理
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    // POSTリクエストのみ処理
    if (req.method !== "POST") {
      res.status(405).json({error: "Method not allowed"});
      return;
    }

    try {
      const {name, email, message} = req.body;

      // バリデーション
      if (!name || !email || !message) {
        res.status(400).json({
          error: "必須項目が入力されていません",
          details: "お名前、メールアドレス、お問い合わせ内容は必須です",
        });
        return;
      }

      // メールアドレスの形式チェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({error: "メールアドレスの形式が正しくありません"});
        return;
      }

      // メール送信先
      const recipientEmail = "dreamfighter4649@gmail.com";

      // SMTP設定を取得
      const config = functionsV1.config();
      const smtpUser = config.smtp?.user || process.env.SMTP_USER || "";

      // メール本文
      const mailOptions = {
        from: `"${name}" <${smtpUser || "noreply@horidays.com"}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `【HORIDAYS STUDIO】お問い合わせ: ${name}様より`,
        text: `
お問い合わせがありました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【お名前】
${name}

【メールアドレス】
${email}

【お問い合わせ内容】
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは、HORIDAYS STUDIOのお問い合わせフォームから送信されました。
`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, "MS Gothic", sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 3px solid #000;
      border-radius: 10px;
    }
    .header {
      background: #ffd700;
      padding: 15px;
      text-align: center;
      border-bottom: 3px solid #000;
      font-weight: bold;
      font-size: 1.2em;
    }
    .content {
      padding: 20px;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      font-weight: bold;
      color: #000;
      margin-bottom: 5px;
    }
    .field-value {
      padding: 10px;
      background: #f5f5f5;
      border: 2px solid #000;
      border-radius: 5px;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #ccc;
      font-size: 0.9em;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      HORIDAYS STUDIO お問い合わせ
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">お名前</div>
        <div class="field-value">${name}</div>
      </div>
      <div class="field">
        <div class="field-label">メールアドレス</div>
        <div class="field-value">${email}</div>
      </div>
      <div class="field">
        <div class="field-label">お問い合わせ内容</div>
        <div class="field-value">${message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
    <div class="footer">
      このメールは、HORIDAYS STUDIOのお問い合わせフォームから送信されました。<br>
      返信する場合は、このメールに直接返信してください。
    </div>
  </div>
</body>
</html>
`,
      };

      // メール送信
      const transporter = createTransporter();
      await transporter.sendMail(mailOptions);

      logger.info("Contact email sent successfully", {
        name,
        email,
        recipientEmail,
      });

      res.status(200).json({
        success: true,
        message: "お問い合わせを受け付けました。ありがとうございます。",
      });
    } catch (error) {
      logger.error("Error sending contact email", error);
      res.status(500).json({
        error: "メール送信に失敗しました",
        details: error.message,
      });
    }
  }
);
