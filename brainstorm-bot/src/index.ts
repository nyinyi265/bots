import { Telegraf } from 'telegraf';
import { env } from './config/env.js';
import { helpCommand, startCommand } from './bot/commands.js';
import { textMessageHandler } from './bot/handlers.js';

const bot = new Telegraf(env.telegramBotToken);

bot.start(startCommand);
bot.help(helpCommand);

bot.on('text', textMessageHandler);

bot.catch((error) => {
  console.error('Telegram bot error:', error);
});

async function main(): Promise<void> {
  await bot.telegram.getMe();

  console.log('🧠 Brainstorm Bot is starting...');
  console.log('📡 Using long polling.');
  console.log('Press Ctrl+C to stop the bot.');

  await bot.launch();

  console.log('✅ Brainstorm Bot is running!');
}

main().catch((error) => {
  console.error('❌ Failed to start Brainstorm Bot:', error);
  process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
