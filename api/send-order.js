export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      ok: false,
      error: "Telegram environment variables are not configured"
    });
  }

  const text = req.body?.text;

  if (!text) {
    return res.status(400).json({ ok: false, error: "Missing message text" });
  }

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown"
        })
      }
    );

    const data = await telegramResponse.json();

    if (!telegramResponse.ok || !data.ok) {
      return res.status(502).json({
        ok: false,
        error: data.description || "Telegram API error"
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Telegram send error:", error);
    return res.status(500).json({
      ok: false,
      error: "Could not connect to Telegram"
    });
  }
}
