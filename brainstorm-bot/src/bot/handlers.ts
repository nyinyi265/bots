import { Context } from 'telegraf';
import { brainstorm } from '../brainstorm/brainstorm.engine.js';

const BOT_USERNAME = 'zethus_brainstorm_bot';

export async function textMessageHandler(ctx: Context): Promise<void> {
  if (!ctx.message || !('text' in ctx.message)) {
    return;
  }

  const message = ctx.message;
  const text = message.text.trim();

  // Only process messages that explicitly mention the bot
  if (!text.toLowerCase().includes(`@${BOT_USERNAME}`.toLowerCase())) {
    return;
  }

  // Remove the bot mention
  const question = text
    .replace(new RegExp(`@${BOT_USERNAME}\\b`, 'gi'), '')
    .trim();

  if (!question) {
    await ctx.reply(
      '🧠 What would you like to brainstorm about?'
    );
    return;
  }

  console.log('🧠 Brainstorm question:', question);

  try {
    await ctx.sendChatAction('typing');

    const response = await brainstorm(question);

    await ctx.reply(response);
  } catch (error) {
    console.error('❌ Brainstorm error:', error);

    await ctx.reply(
      '❌ Sorry, I could not generate a brainstorming response right now.'
    );
  }
}