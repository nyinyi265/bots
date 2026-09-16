import type { Handler, HandlerEvent } from "@netlify/functions";
import { createBot } from "../../src/bot/create-bot.js";

const bot = createBot();

function getHeader(
  headers: HandlerEvent["headers"],
  name: string,
): string | undefined {
  const target = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === target) {
      return value;
    }
  }

  return undefined;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (webhookSecret) {
    const providedSecret = getHeader(
      event.headers,
      "x-telegram-bot-api-secret-token",
    );

    if (providedSecret !== webhookSecret) {
      return {
        statusCode: 401,
        body: "Unauthorized",
      };
    }
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: "Missing request body",
    };
  }

  try {
    const update = JSON.parse(event.body);
    await bot.handleUpdate(update);

    return {
      statusCode: 200,
      body: "OK",
    };
  } catch (error) {
    console.error("❌ Failed to handle Telegram update:", error);

    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
