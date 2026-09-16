import { Telegraf } from "telegraf";
import { env } from "../config/env.js";
import { helpCommand, startCommand } from "./commands.js";
import {
  textMessageHandler,
  clearCommandHandler,
} from "./handlers.js";

export function createBot(): Telegraf {
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

  return bot;
}
