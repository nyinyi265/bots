import http from "node:http";
import { Telegraf } from "telegraf";
import { env } from "./config/env.js";
import { helpCommand, startCommand } from "./bot/commands.js";
import {
  textMessageHandler,
  clearCommandHandler,
} from "./bot/handlers.js";
import { testDatabaseConnection } from "./database/postgres.js";

const bot = new Telegraf(env.telegramBotToken);

bot.start(startCommand);
bot.help(helpCommand);

bot.command("clear", clearCommandHandler);
bot.on("text", textMessageHandler);

bot.catch((error, ctx) => {
  console.error("❌ Telegram bot error:", {
    error,
    updateId: ctx.update.update_id,
    chatId: ctx.chat?.id,
  });
});

async function main(): Promise<void> {
  await testDatabaseConnection();
  await bot.telegram.getMe();

  const PORT = Number(process.env.PORT ?? 3000);
  const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN;
  const WEBHOOK_PATH =
    process.env.WEBHOOK_PATH ?? "/telegram/webhook";
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  console.log("🧠 Brainstorm Bot is starting...");

  if (process.env.NODE_ENV === "production") {
    if (!WEBHOOK_DOMAIN) {
      throw new Error(
        "WEBHOOK_DOMAIN is required in production.",
      );
    }

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "WEBHOOK_SECRET is required in production.",
      );
    }

    const webhookHandler = bot.webhookCallback(
      WEBHOOK_PATH,
      {
        secretToken: WEBHOOK_SECRET,
      },
    );

    const server = http.createServer(
      async (req, res) => {
        if (
          req.method === "GET" &&
          req.url === "/health"
        ) {
          res.writeHead(200, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              status: "ok",
            }),
          );

          return;
        }

        if (
          req.method === "POST" &&
          req.url === WEBHOOK_PATH
        ) {
          await webhookHandler(req, res);
          return;
        }

        res.writeHead(404);
        res.end("Not Found");
      },
    );

    server.listen(PORT, "0.0.0.0", async () => {
      console.log(
        `🌐 HTTP server listening on 0.0.0.0:${PORT}`,
      );

      const webhookUrl =
        `https://${WEBHOOK_DOMAIN}${WEBHOOK_PATH}`;

      await bot.telegram.setWebhook(
        webhookUrl,
        {
          secret_token: WEBHOOK_SECRET,
        },
      );

      console.log(
        `🌐 Telegram webhook enabled: ${webhookUrl}`,
      );
    });
  } else {
    await bot.launch();

    console.log("📡 Using long polling.");
  }

  console.log("✅ Brainstorm Bot is running!");
}

main().catch((error) => {
  console.error(
    "❌ Failed to start Brainstorm Bot:",
    error,
  );

  process.exit(1);
});

process.once("SIGINT", () => {
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});