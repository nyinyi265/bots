import { Context } from 'telegraf';
import { brainstorm } from '../brainstorm/brainstorm.engine.js';

const BOT_USERNAME = 'zethus_brainstorm_bot';

export async function textMessageHandler(ctx: Context): Promise<void> {
  if (!ctx.message || !('text' in ctx.message)) {
    return;
  }

  const message = ctx.message;
  const text = message.text.trim();

  const chatType = ctx.chat?.type;

  // Private chat:
  // The user is already talking directly to the bot,
  // so no @mention is required.
  const isPrivateChat = chatType === 'private';

  // Group / supergroup:
  // Only respond when the bot is explicitly mentioned.
  const botMention = `@${BOT_USERNAME}`;

  if (!isPrivateChat) {
    if (!text.toLowerCase().includes(botMention.toLowerCase())) {
      return;
    }
  }

  // Remove the bot mention if it exists.
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