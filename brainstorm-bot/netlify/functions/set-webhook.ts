import type { Handler } from "@netlify/functions";
import { Telegraf } from "telegraf";

export const handler: Handler = async (event) => {
  const setupKey = process.env.WEBHOOK_SETUP_KEY;
  const providedKey = event.queryStringParameters?.key;

  if (!setupKey || providedKey !== setupKey) {
    return {
      statusCode: 403,
      body: "Forbidden",
    };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const siteUrl = process.env.URL ?? process.env.DEPLOY_PRIME_URL;

  if (!token) {
    return {
      statusCode: 500,
      body: "TELEGRAM_BOT_TOKEN is not configured",
    };
  }

  if (!webhookSecret) {
    return {
      statusCode: 500,
      body: "WEBHOOK_SECRET is not configured",
    };
  }

  if (!siteUrl) {
    return {
      statusCode: 500,
      body: "Site URL is not available",
    };
  }

  const webhookUrl = `${siteUrl.replace(/\/$/, "")}/.netlify/functions/telegram`;
  const bot = new Telegraf(token);

  try {
    await bot.telegram.setWebhook(webhookUrl, {
      secret_token: webhookSecret,
    });

    const info = await bot.telegram.getWebhookInfo();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          ok: true,
          webhookUrl,
          info,
        },
        null,
        2,
      ),
    };
  } catch (error) {
    console.error("❌ Failed to set Telegram webhook:", error);

    return {
      statusCode: 500,
      body: "Failed to set webhook",
    };
  }
};
